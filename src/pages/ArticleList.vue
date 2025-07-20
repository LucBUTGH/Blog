<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { fetchArticles } from "../api/articles";
import ArticleCard from "../components/ArticleCard.vue";
import ArticleSkeleton from "../components/ArticleSkeleton.vue";

const articles = ref([]);
const loading = ref(true);
const error = ref<string | null>(null);
const selectedTag = ref<string | null>(null);

// Get all unique tags from articles
const allTags = computed(() => {
  const tags = new Set<string>();
  articles.value.forEach((article) => {
    article.tags.forEach((tag) => {
      tags.add(tag.category);
    });
  });
  return Array.from(tags);
});

// Filter articles by selected tag
const filteredArticles = computed(() => {
  if (!selectedTag.value) return articles.value;

  return articles.value.filter((article) =>
    article.tags.some((tag) => tag.category === selectedTag.value)
  );
});

const filterByTag = (tag: string | null) => {
  selectedTag.value = tag === selectedTag.value ? null : tag;
};

const reloadPage = () => window.location.reload();

onMounted(async () => {
  try {
    articles.value = await fetchArticles();
  } catch (err) {
    error.value = "Failed to load articles. Please try again later.";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="page-container">
    <div class="mb-8 text-center">
      <h1
        class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-slide-down"
      >
        Blog de Kuramaa
      </h1>
      <p
        class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-slide-down"
      >
        Discover insights on the latest technologies and innovations
      </p>
    </div>

    <!-- Tags filter -->
    <div
      class="mb-8 flex flex-wrap justify-center gap-2 animate-fade-in"
      v-if="!loading && !error"
    >
      <button
        class="tag-badge cursor-pointer"
        :class="
          !selectedTag
            ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
        "
        @click="filterByTag(null)"
      >
        All
      </button>
      <button
        v-for="tag in allTags"
        :key="tag"
        class="tag-badge cursor-pointer"
        :class="
          selectedTag === tag
            ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
        "
        @click="filterByTag(tag)"
      >
        {{ tag }}
      </button>
    </div>

    <!-- Error message -->
    <div v-if="error" class="text-center py-12 animate-fade-in">
      <div class="text-red-500 dark:text-red-400 mb-4">
        <svg
          class="w-12 h-12 mx-auto"
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
        @click="reloadPage"
        class="btn btn-primary inline-flex items-center"
      >
        <svg
          class="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          ></path>
        </svg>
        Retry
      </button>
    </div>

    <!-- Loading skeletons -->
    <div v-else-if="loading" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <ArticleSkeleton v-for="i in 6" :key="i" />
    </div>

    <!-- Articles grid -->
    <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <template v-if="filteredArticles.length > 0">
        <ArticleCard
          v-for="(article, index) in filteredArticles"
          :key="article.documentId"
          :article="article"
          :delay="index"
          :to="`/article/${article.documentId}`"
        />
      </template>
      <div v-else class="col-span-full text-center py-12 animate-fade-in">
        <p class="text-lg text-gray-600 dark:text-gray-400">
          No articles found with the selected tag.
        </p>
        <button @click="selectedTag = null" class="mt-4 btn btn-primary">
          Show all articles
        </button>
      </div>
    </div>
  </div>
</template>
