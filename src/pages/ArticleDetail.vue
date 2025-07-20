<script setup lang="ts">
import { format } from "date-fns";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import { marked } from "marked";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { fetchArticleByDocumentId } from "../api/articles";
import TagBadge from "../components/TagBadge.vue";

const ICON_COPY = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy-icon lucide-copy">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
  </svg>
`;

const ICON_CHECK = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-icon lucide-check">
    <path d="M20 6 9 17l-5-5"/>
  </svg>
`;

const router = useRouter();
const route = useRoute();
const article = ref(null);
const loading = ref(true);
const error = ref<string | null>(null);

const fetchArticle = async (documentId: string) => {
  loading.value = true;
  error.value = null;
  try {
    article.value = await fetchArticleByDocumentId(documentId);
    console.log(article.value);
  } catch (err) {
    error.value = "Failed to load article. Please try again later.";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const renderedContent = computed(() => {
  if (!article.value) return "";
  let content = marked(article.value.content);
  return addLanguageBanners(content);
});

const showToast = ref(false);
const toastMessage = ref("");

const copyToClipboard = (text: string, button: HTMLButtonElement) => {
  console.log("Attempting to copy to clipboard");
  navigator.clipboard.writeText(text).then(
    () => {
      console.log("Successfully copied to clipboard");
      if (button) {
        button.innerHTML = ICON_CHECK;
        setTimeout(() => {
          button.innerHTML = ICON_COPY;
          console.log("Icon reverted to copy");
        }, 2600);
      }
      toastMessage.value = "Content copied!";
      showToast.value = true;
      setTimeout(() => {
        showToast.value = false;
      }, 2600);
    },
    (err) => {
      console.error("Could not copy text: ", err);
    }
  );
};

const addLanguageBanners = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const codeBlocks = doc.querySelectorAll("pre code");
  codeBlocks.forEach((block) => {
    const preBlock = block.parentElement;
    const classList = Array.from(block.classList);
    const languageClass = classList.find((className) =>
      className.startsWith("language-")
    );
    if (languageClass) {
      const language = languageClass.replace("language-", "");
      const banner = document.createElement("div");
      banner.className = "language-banner";
      const languageText = document.createElement("span");
      languageText.textContent = language;
      banner.appendChild(languageText);
      const copyButton = document.createElement("button");
      copyButton.className = "copy-button";
      copyButton.innerHTML = ICON_COPY;
      copyButton.addEventListener("click", () => {
        console.log("Copy button clicked");
        copyToClipboard(block.textContent, copyButton);
      });
      banner.appendChild(copyButton);
      preBlock.insertBefore(banner, block);
    }
  });
  return doc.body.innerHTML;
};

const formattedDate = (dateString: string) => {
  try {
    return format(new Date(dateString), "MMMM d, yyyy");
  } catch (e) {
    return dateString;
  }
};

const goBack = () => {
  router.push("/");
};

const highlightCode = () => {
  nextTick(() => {
    document.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightElement(block as HTMLElement);
    });
  });
};

onMounted(() => {
  if (route.params.id) {
    fetchArticle(route.params.id as string);
  }
});

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      fetchArticle(newId as string);
    }
  }
);

const extractCodeLanguage = () => {
  nextTick(() => {
    const codeBlocks = document.querySelectorAll("pre code");
    codeBlocks.forEach((block) => {
      const classList = block.classList;
      for (let className of classList) {
        if (className.startsWith("language-")) {
          const language = className.replace("language-", "");
          console.log("Language found:", language);
        }
      }
    });
  });
};

const attachCopyListeners = () => {
  nextTick(() => {
    const copyButtons = document.querySelectorAll(".copy-button");
    console.log("Attaching copy listeners to buttons:", copyButtons);
    copyButtons.forEach((button) => {
      button.addEventListener("click", () => {
        console.log("Copy button event listener triggered");
        const pre = button.closest("pre");
        if (pre) {
          const block = pre.querySelector("code");
          if (block) {
            copyToClipboard(block.textContent, button as HTMLButtonElement);
          }
        }
      });
    });
  });
};

watch(renderedContent, () => {
  highlightCode();
  extractCodeLanguage();
  attachCopyListeners();
});
</script>

<template>
  <div class="page-container">
    <!-- Back button -->
    <button
      @click="goBack"
      class="mb-6 inline-flex items-center text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200 animate-fade-in"
    >
      <svg
        class="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        ></path>
      </svg>
      Back to Articles
    </button>

    <!-- Loading state -->
    <div v-if="loading" class="py-16 animate-pulse">
      <div class="w-3/4 mx-auto">
        <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>

        <div class="flex gap-2 mb-4">
          <div class="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div class="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        </div>

        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>

        <div class="space-y-4 mb-8">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
        </div>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-16 animate-fade-in">
      <div class="text-red-500 dark:text-red-400 mb-4">
        <svg
          class="w-16 h-16 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          ></path>
        </svg>
        <h3 class="text-xl font-medium mt-2">{{ error }}</h3>
      </div>
      <button
        @click="goBack"
        class="btn btn-primary inline-flex items-center mr-4"
      >
        Back to Articles
      </button>
    </div>
    <!-- Article content -->
    <article v-else-if="article" class="max-w-4xl mx-auto animate-fade-in">
      <header class="mb-8">
        <h1
          class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-slide-down"
        >
          {{ article.title }}
        </h1>

        <div
          class="flex flex-wrap gap-2 mb-4 animate-slide-down"
          style="animation-delay: 0.1s"
        >
          <TagBadge
            v-for="tag in article.tags"
            :key="tag.id"
            :category="tag.category"
          />
        </div>

        <div
          class="text-gray-600 dark:text-gray-400 mb-6 flex items-center gap-3 animate-slide-down"
        >
          <time>{{ formattedDate(article.date) }}</time>
          <span
            class="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12,6 12,12 16,14" />
            </svg>
            {{ article.time_read }}
            {{ article.time_read === 1 ? "minute" : "minutes" }} de lecture
          </span>
        </div>

        <div
          class="text-lg text-gray-700 dark:text-gray-300 mb-6 font-medium italic border-l-4 border-primary-500 pl-4 animate-slide-down"
          style="animation-delay: 0.3s"
        >
          {{ article.short_desc }}
        </div>
      </header>

      <div
        class="prose prose-lg max-w-none dark:prose-invert animate-fade-in"
        style="animation-delay: 0.4s"
        v-html="renderedContent"
      ></div>

      <!-- Article source -->
      <div
        v-if="article.source?.length"
        class="mt-12 text-sm text-gray-600 dark:text-gray-400 border-t pt-6 border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-center gap-2 font-medium mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="text-primary-500 dark:text-primary-400"
          >
            <path
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <span>{{ article.source.length === 1 ? "Source" : "Sources" }}</span>
        </div>
        <ul class="space-y-2">
          <li
            v-for="(source, index) in article.source"
            :key="source.id"
            class="flex items-start gap-2 group"
          >
            <a
              :href="source.url"
              target="_blank"
              rel="noopener noreferrer"
              class="text-primary-600 dark:text-primary-400 hover:underline group-hover:opacity-80 transition-opacity"
            >
              {{ source.label }}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="inline-block ml-1 mb-1"
              >
                <path
                  d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </li>
        </ul>
      </div>
    </article>

    <!-- Article not found -->
    <div v-else class="text-center py-16 animate-fade-in">
      <svg
        class="w-16 h-16 mx-auto text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <h3 class="text-xl font-medium mt-4 mb-2">Article not found</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        The article you're looking for doesn't exist or has been removed.
      </p>
      <button @click="goBack" class="btn btn-primary">
        Go back to Articles
      </button>
    </div>
  </div>

  <!-- Toast notification -->
  <Transition
    enter-active-class="animate-toast-enter"
    leave-active-class="animate-toast-exit"
  >
    <div
      v-if="showToast"
      class="fixed bottom-4 right-4 bg-[#111827] border border-white text-white px-4 py-2 rounded-lg shadow-lg z-50"
    >
      {{ toastMessage }}
    </div>
  </Transition>
</template>
