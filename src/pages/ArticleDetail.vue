<script setup lang="ts">
import { format } from "date-fns";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import { marked } from "marked";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { fetchArticleByDocumentId } from "../api/articles";
import TagBadge from "../components/TagBadge.vue";
import type { Article } from "../types/article";

const ICON_COPY = `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8 16V7a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v9a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3z"></path>
    <rect x="6" y="12" width="10" height="10" rx="1"></rect>
  </svg>
`;

const ICON_CHECK = `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
`;

const router = useRouter();
const route = useRoute();
const article = ref<Article | null>(null);
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
            copyToClipboard(block.textContent, button);
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
          class="text-gray-600 dark:text-gray-400 mb-6 animate-slide-down"
          style="animation-delay: 0.2s"
        >
          <time>{{ formattedDate(article.date) }}</time>
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
        v-if="article.source"
        class="mt-12 text-sm text-gray-600 dark:text-gray-400 border-t pt-6 border-gray-200 dark:border-gray-700"
      >
        Source :
        <a
          :href="article.source"
          target="_blank"
          rel="noopener"
          class="text-primary-600 dark:text-primary-400 underline hover:opacity-80"
        >
          {{ article.source }}
        </a>
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
  <div
    v-if="showToast"
    class="fixed bottom-4 right-4 bg-[#111827] border border-white text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in"
  >
    {{ toastMessage }}
  </div>
</template>
