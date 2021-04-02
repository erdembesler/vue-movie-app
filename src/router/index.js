import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import MovieDetail from "../views/MovieDetail.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    props: true,
  },
  {
    path: "/movie/:id",
    name: "Movie Detail",
    component: MovieDetail,
    props: true,
  },
];

const router = new VueRouter({
  routes,
  mode: "history",
});

export default router;
