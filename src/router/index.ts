import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/editor/:id?",
    name: "resumeEditor",
    component: () => import("../views/ResumeEditorView.vue"),
  },
  {
    path: "/templates/:id?",
    name: "templateSelection",
    component: () => import("../views/TemplateSelectionView.vue"),
  },
  {
    path: "/export/:id?",
    name: "export",
    component: () => import("../views/ExportView.vue"),
  },
  {
    path: "/documents",
    name: "documents",
    component: () => import("../views/DocumentsView.vue"),
  },
  {
    path: "/preview/:id",
    name: "resumePreview",
    component: () => import("../views/ResumePreviewView.vue"),
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../views/AboutView.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
