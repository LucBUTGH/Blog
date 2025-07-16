<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/');
};
</script>

<template>
  <div class="flex items-center justify-center min-h-[70vh]">
    <div class="text-center px-4 animate-fade-in">
      <div class="mb-4 text-6xl font-extrabold text-primary-600 dark:text-primary-400">404</div>
      <h1 class="text-3xl font-bold mb-4">Page Not Found</h1>
      <p class="mb-6 text-gray-600 dark:text-gray-400">Sorry, we couldn't find the page you're looking for.</p>
      <button 
        @click="goHome" 
        class="btn btn-primary inline-flex items-center"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7m-7-7v14"></path>
        </svg>
        Go Home
      </button>
    </div>
  </div>
</template>