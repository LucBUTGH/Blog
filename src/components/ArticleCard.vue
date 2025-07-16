<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import type { Article } from "../types/article";
import TagBadge from "./TagBadge.vue";
import { format } from "date-fns";

const props = defineProps<{
  article: Article;
  delay?: number;
}>();

const router = useRouter();

const formattedDate = computed(() => {
  try {
    return format(new Date(props.article.date), "MMMM d, yyyy");
  } catch (e) {
    return props.article.date;
  }
});

const animationStyle = computed(() => ({
  animationDelay: props.delay ? `${props.delay * 0.1}s` : "0s",
}));

const viewArticle = () => {
  router.push(`/article/${props.article.documentId}`);
};
</script>

<template>
  <article
    class="card overflow-hidden hover:translate-y-[-4px] transition-all duration-300 animate-fade-in"
    :style="animationStyle"
    @click="viewArticle"
  >
    <div class="p-6">
      <div class="flex flex-wrap gap-2 mb-3">
        <TagBadge
          v-for="tag in article.tags"
          :key="tag.id"
          :category="tag.category"
        />
      </div>

      <h2 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">
        {{ article.title }}
      </h2>

      <p class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
        {{ article.short_desc }}
      </p>

      <div
        class="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400"
      >
        <time>{{ formattedDate }}</time>
        <span
          class="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          Read more
          <svg class="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
      </div>
    </div>
  </article>
</template>
