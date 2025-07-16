<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  category: string;
}>();

// Generate tag color based on category
const tagClass = computed(() => {
  switch (props.category.toLowerCase()) {
    case 'science':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'quantic':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    case 'future':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'tech':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
    case 'ai':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
});
</script>

<template>
  <span 
    class="tag-badge inline-block transition-all hover:scale-105"
    :class="tagClass"
  >
    {{ category }}
  </span>
</template>