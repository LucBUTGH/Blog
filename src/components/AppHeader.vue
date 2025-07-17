<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import ThemeToggle from "./ThemeToggle.vue";

const router = useRouter();
const mobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const navigateHome = () => {
  router.push("/");
  mobileMenuOpen.value = false;
};
</script>

<template>
  <header
    class="sticky top-0 z-50 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm border-b border-gray-100/20 dark:border-gray-800/30 transition-colors duration-200"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <div
            class="flex-shrink-0 flex items-center cursor-pointer group"
            @click="navigateHome"
          >
            <span
              class="text-primary-600 dark:text-primary-400 font-serif italic font-medium text-2xl tracking-tight group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors duration-200"
            >
              &lt;Kuramaa/&gt;
            </span>
          </div>
        </div>

        <!-- Desktop navigation -->
        <div class="hidden sm:flex sm:items-center sm:space-x-4">
          <router-link
            to="/"
            class="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50/50 dark:text-gray-300 dark:hover:text-primary-400 dark:hover:bg-gray-800/30 transition-all duration-200"
          >
            Articles
          </router-link>
          <ThemeToggle />
        </div>

        <!-- Mobile menu button -->
        <div class="flex items-center space-x-4 sm:hidden">
          <ThemeToggle />
          <button
            type="button"
            class="inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 focus:outline-none transition-colors duration-200"
            @click="toggleMobileMenu"
          >
            <span class="sr-only">Open main menu</span>
            <svg
              class="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                v-if="!mobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div
      v-show="mobileMenuOpen"
      class="sm:hidden bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-t border-gray-100/20 dark:border-gray-800/30 transition-all duration-200"
    >
      <div class="pt-2 pb-3 space-y-1">
        <router-link
          to="/"
          class="block px-4 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50/50 dark:text-gray-300 dark:hover:text-primary-400 dark:hover:bg-gray-800/30 transition-all duration-200"
          @click="mobileMenuOpen = false"
        >
          Articles
        </router-link>
      </div>
    </div>
  </header>
</template>
