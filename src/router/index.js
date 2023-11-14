import Vue from "vue";
import VueRouter from "vue-router";
//import Home from "../views/Home.vue";
import CompanyMonitoring from "@/views/CompanyMonitoring";
import ProjectMonitoring from "@/views/ProjectMonitoring";
import UserMonitoring from "@/views/UserMonitoring";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: CompanyMonitoring,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/company",
    name: "Company",
    component: CompanyMonitoring,
  },  
  {
    path: "/project",
    name: "Project",
    component: ProjectMonitoring,
  },  
  {
    path: "/user",
    name: "User",
    component: UserMonitoring,
  },     
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  next();
});

export default router;
