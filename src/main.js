import Vue from "vue";
import VueCompositionApi from "@vue/composition-api";
import App from "./App.vue";
import VueRouter from "vue-router";

import Home from "./views/Home";
import MovieDetail from "./views/MovieDetail";

Vue.use(VueCompositionApi);

Vue.use(VueRouter);

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

new Vue({
  router,
  render: function(createElement) {
    return createElement(App);
  },
}).$mount("#app");
