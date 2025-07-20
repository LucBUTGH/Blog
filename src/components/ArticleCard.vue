<script setup>
import { format } from "date-fns";
import { computed } from "vue";
import { useRouter } from "vue-router";
import TagBadge from "./TagBadge.vue";

const props = defineProps({
  article: {
    type: Object,
    required: true,
  },
  delay: {
    type: Number,
    default: 0,
  },
});

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
  router.push(`/article/${props.article.title_slug}`);
};
</script>

<template>
  <article
    class="card group overflow-hidden hover:translate-y-[-4px] transition-all duration-300 animate-fade-in"
    :style="animationStyle"
    @click="viewArticle"
  >
    <div class="p-6 md:p-8">
      <div class="flex flex-wrap gap-2 mb-4">
        <TagBadge
          v-for="tag in article.tags"
          :key="tag.id"
          :category="tag.category"
        />
      </div>

      <h2
        class="text-2xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200 font-serif"
      >
        {{ article.title }}
      </h2>

      <p class="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3 text-base">
        {{ article.short_desc }}
      </p>

      <div class="flex justify-between items-center text-sm font-medium">
        <time class="text-gray-500 dark:text-gray-400 italic">
          {{ formattedDate }}
        </time>
        <span
          class="text-gray-500 dark:text-gray-400 inline-flex items-center gap-1"
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
          {{ article.time_read }} min.
        </span>
        <span
          class="inline-flex items-center text-primary-600 group-hover:text-primary-700 dark:text-primary-400 dark:group-hover:text-primary-300 transition-colors duration-200"
        >
          Lire l'article
          <svg
            class="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
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
