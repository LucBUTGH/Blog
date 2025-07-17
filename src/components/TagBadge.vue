<script setup>
import { computed } from "vue";

const props = defineProps({
  category: {
    type: String,
    required: true
  }
});

const tagStyles = computed(() => {
  const styles = {
    javascript: "bg-yellow-100/80 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800/50 border border-yellow-300/30",
    typescript: "bg-blue-100/80 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/50 border border-blue-300/30",
    vue: "bg-emerald-100/80 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800/50 border border-emerald-300/30",
    react: "bg-cyan-100/80 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-300 dark:border-cyan-800/50 border border-cyan-300/30",
    nextjs: "bg-slate-100/80 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300 dark:border-slate-800/50 border border-slate-300/30",
    tailwind: "bg-sky-100/80 text-sky-800 dark:bg-sky-900/20 dark:text-sky-300 dark:border-sky-800/50 border border-sky-300/30",
    prisma: "bg-indigo-100/80 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800/50 border border-indigo-300/30",
    postgresql: "bg-blue-100/80 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/50 border border-blue-300/30",
    default: "bg-gray-100/80 text-gray-800 dark:bg-gray-800/20 dark:text-gray-300 dark:border-gray-700/50 border border-gray-300/30"
  };

  return styles[props.category.toLowerCase()] || styles.default;
});
</script>

<template>
  <span 
    class="tag-badge text-xs" 
    :class="tagStyles"
  >
    {{ category }}
  </span>
</template>