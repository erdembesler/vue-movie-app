<template>
  <div>
    <div class="not-found-div" v-if="notFound == true">Movie not found..</div>
    <div v-if="notFound == false" class="movie-detail">
      <h2>{{ movie.Title }}</h2>
      <p>{{ movie.Year }}</p>
      <div class="image-div">
        <img :src="movie.Poster" alt="Movie Poster" class="featured-img" />
      </div>
      <p>{{ movie.Plot }}</p>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import VueCompositionAPI from "@vue/composition-api";

Vue.use(VueCompositionAPI);
import { ref, onBeforeMount } from "@vue/composition-api";
import VueRouter from "vue-router";
Vue.use(VueRouter);

import env from "@/env.js";

export default {
  setup(props, context) {
    const movie = ref({});
    const notFound = ref(false);
    const route = context.root.$route;
    onBeforeMount(() => {
      fetch(
        `http://www.omdbapi.com/?apikey=${env.apikey}&i=${route.params.id}&plot=full`
      )
        .then((response) => response.json())
        .then((data) => {
          // eslint-disable-next-line no-debugger
          debugger;
          if (data.Response == "False") {
            notFound.value = true;
          } else {
            if (data.Poster == "N/A") {
              data.Poster =
                "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";
            }
            movie.value = data;
            notFound.value = false;
          }
        });
    });

    return {
      movie,
      notFound,
    };
  },
};
</script>

<style lang="scss">
.not-found-div {
  padding: 10px;
  text-align: center;
  color: white;
}
.movie-detail {
  display: block;
  margin: 0 auto;
  border-bottom: 20px solid white;
  border-top: 2px solid white;
  border-radius: 2px;
  background-color: #2c3c4f;
  padding: 16px;
  max-width: 50%;
  text-align: center;
  .image-div {
    display: inline-block;
  }
  h2 {
    color: #fff;
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 16px;
  }

  .featured-img {
    display: block;
    max-width: 300px;
    margin-bottom: 16px;
  }

  p {
    color: #fff;
    font-size: 18px;
    line-height: 1.4;
  }
}
</style>
