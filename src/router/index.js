import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
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
    path: "/mafs1",
    name: "MarriedAtFirstSightStatic",
    component: () =>
      import(
        /* webpackChunkName: "MafsOne" */
        "../components/MafsOne.vue"
      ),
  },
  {
    path: "/mafs2",
    name: "MarriedAtFirstSightDynamic",
    component: () =>
      import(
        /* webpackChunkName: "MafsTwo" */
        "../components/MafsTwo.vue"
      ),
  },
  {
    path: "/bad-metronome",
    name: "BadMetronome",
    component: () =>
      import(
        /* webpackChunkName: "BadMetronome" */
        "../components/Metronome.vue"
      ),
  },
  {
    path: "/random-wave",
    name: "RandomSinWaveFun",
    component: () =>
      import(
        /* webpackChunkName: "SinWave" */
        "../components/RandomSinWaveFun.vue"
      ),
  },
  {
    path: "/triangle-model",
    name: "TriangleModel",
    component: () =>
      import(
        /* webpackChunkName: "TriangleModel" */
        "../components/TriangleLayer.vue"
      ),
  },
  // {
  //   path: "/two-axis-plot",
  //   name: "TwoAxisPlot",
  //   component: () => import("../components/CovidWastewaterPlot.vue"),
  // },
];

const router = new VueRouter({
  routes,
});

export default router;
