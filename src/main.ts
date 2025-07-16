import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import "./style.css";

// Import components for routes
import ArticleDetail from "./pages/ArticleDetail.vue";
import ArticleList from "./pages/ArticleList.vue";
import NotFound from "./pages/NotFound.vue";

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: ArticleList },
    { path: "/article/:id", component: ArticleDetail, props: true },
    { path: "/:pathMatch(.*)*", component: NotFound },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

// Create app
const app = createApp(App);

// Use plugins
app.use(router);

// Mount app
app.mount("#app");
