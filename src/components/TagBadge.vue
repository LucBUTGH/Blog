<script setup>
const props = defineProps({
  category: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <span
    class="bg-gray-100/80 text-gray-800 dark:bg-gray-800/20 dark:text-gray-300 dark:border-gray-700/50 border border-gray-300/30 tag-badge text-xs"
  >
    {{ category }}
  </span>
</template>
