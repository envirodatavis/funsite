import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);
const routes = [{
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
            import ( /* webpackChunkName: "about" */ "../views/About.vue"),
    },
    {
        path: "/mafs2",
        name: "MafsTwo",
        component: () =>
            import (
                /* webpackChunkName: "MafsTwo" */
                "../views/MafsTwo.vue"
            ),
    },
    {
        path: "/willow",
        name: "ForWillow",
        component: () =>
            import (
                /* webpackChunkName: "ForWillow" */
                "../views/ForWillow.vue"
            )
    },
    {
        path: "/covid-wastewater",
        name: "CovidWastewater",
        component: () =>
            import (
                /* webpackChunkName: "CovidWasteater" */
                "../views/CovidWw.vue"
            )
    }
];

const router = new VueRouter({
    routes,
});

export default router;