<script setup>
import { RouterView } from "vue-router";
import AppFooter from "./components/AppFooter.vue";
import AppHeader from "./components/AppHeader.vue";
</script>

<template>
  <div
    class="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 transition-colors duration-200"
  >
    <AppHeader />
    <main class="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- TEST : Temporairement sans transition -->
      <router-view />

      <!-- Version originale commentée -->
      <!-- <router-view v-slot="{ Component }">
        <transition
          name="page"
          mode="out-in"
        >
          <component :is="Component" />
        </transition>
      </router-view> -->
    </main>
    <AppFooter />
  </div>
</template>
