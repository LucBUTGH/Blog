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
              &lt;K/&gt;
            </span>
          </div>
        </div>

        <!-- Navigation -->
        <div class="flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </div>
  </header>
</template>
