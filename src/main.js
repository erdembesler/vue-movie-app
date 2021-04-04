import Vue from "vue";
import VueCompositionApi from "@vue/composition-api";
import App from "./App.vue";
import VueRouter from "vue-router";
import Vuetify from "vuetify";

import Home from "./views/Home";
import MovieDetail from "./views/MovieDetail";
import vuetify from "./plugins/vuetify";

Vue.use(vuetify);
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
  {
    path: "*",
    component: Home,
    props: true,
  },
];

const router = new VueRouter({
  routes,
  mode: "history",
});

new Vue({
  vuetify: new Vuetify({}),
  router,

  render: function(createElement) {
    return createElement(App);
  },
}).$mount("#app");
