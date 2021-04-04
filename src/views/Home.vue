<template>
  <div class="home">
    <v-app>
      <v-card v-click-outside="onClickOutside" color="#2C3C4F" dark>
        <v-card-text>
          <v-autocomplete
            v-model="model"
            :items="items"
            :loading="isLoading"
            :search-input.sync="search"
            @click:clear="initMovies()"
            color="white"
            hide-no-data
            item-text="Title"
            placeholder="Search"
            clearable
            filled
            rounded
          ></v-autocomplete>
        </v-card-text>
      </v-card>
    </v-app>

    <div class="movies-list">
      <div class="movie" v-for="(movie, index) in movies" :key="index">
        <router-link
          :to="{ name: 'Movie Detail', params: { id: movie.imdbID } }"
          class="movie-link"
        >
          <div class="product-image">
            <img :src="movie.Poster" alt="Movie Poster" />
            <div class="type">{{ movie.Type }}</div>
          </div>
          <div class="detail">
            <p class="year">{{ movie.Year }}</p>
            <h3>{{ movie.Title }}</h3>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import VueCompositionAPI from "@vue/composition-api";

Vue.use(VueCompositionAPI);
import env from "@/env.js";

export default {
  data: () => ({
    descriptionLimit: 60,
    movies: [],
    searchMovies: [],
    isLoading: false,
    model: null,
    search: null,
  }),

  computed: {
    fields() {
      if (!this.model) return [];

      return Object.keys(this.model).map((key) => {
        return {
          key,
          value: this.model[key] || "n/a",
        };
      });
    },
    items() {
      if (this.searchMovies) {
        return this.searchMovies.map((entry) => {
          //autocomplete items max text length is descriptionLimit
          const Title =
            entry.Title.length > this.descriptionLimit
              ? entry.Title.slice(0, this.descriptionLimit) + "..."
              : entry.Title;

          return Object.assign({}, entry, { Title });
        });
      } else {
        return [];
      }
    },
  },
  watch: {
    search(val, oldVal) {
      //search text at least for length of three
      if (val == null || val.length < 3) {
        if (oldVal == null || oldVal.length < 3) {
          return;
        }
        this.isLoading = true;

        fetch(`http://www.omdbapi.com/?apikey=${env.apikey}&y=2020&s=game`)
          .then((response) => response.json())
          .then((data) => {
            this.searchMovies = [];
            this.movies = data ? data.Search : [];
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => (this.isLoading = false));

        return;
      }

      // Items have already been requested
      if (this.isLoading) return;

      this.isLoading = true;

      // Lazily load input items
      fetch(`http://www.omdbapi.com/?apikey=${env.apikey}&s=${val}&y=2020`)
        .then((response) => response.json())
        .then((data) => {
          this.movies = data ? data.Search : [];
          this.searchMovies = this.movies;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => (this.isLoading = false));
    },
  },
  methods: {
    initMovies() {
      //Because ombd api does not allow to get all movies or randomly pick limited amount of movies,
      // by default "game" search input has been given to query in order to list some movies on home screen.
      fetch(`http://www.omdbapi.com/?apikey=${env.apikey}&s=game&y=2020`)
        .then((response) => response.json())
        .then((data) => {
          this.movies = data ? data.Search : [];
          this.searchMovies = [];
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => (this.isLoading = false));
    },
  },
  beforeMount() {
    this.initMovies();
  },
};
</script>

<style lang="scss">
.home {
  .v-application {
    background-color: #2c3c4f !important;
    color: #2c3c4f;
    max-width: 100%;

    .v-application--wrap {
      flex: 1 1 auto;
      background-color: #2c3c4f;
      backface-visibility: hidden;
      display: flex;
      flex-direction: column;
      min-height: 0vh;
      max-width: 100%;
      position: relative;
      .v-input__slot {
        width: 35%;
      }
    }
  }

  .feature-card {
    position: relative;

    .featured-img {
      display: block;
      width: 100%;
      height: 300px;
      object-fit: cover;

      position: relative;
      z-index: 0;
    }

    .detail {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.6);
      padding: 16px;
      z-index: 1;

      h3 {
        color: #fff;
        margin-bottom: 16px;
      }

      p {
        color: #fff;
      }
    }
  }

  .search-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 16px;

    input {
      display: block;
      appearance: none;
      border: none;
      outline: none;
      background: none;

      &[type="text"] {
        width: 100%;
        color: #fff;
        background-color: #496583;
        font-size: 20px;
        padding: 10px 16px;
        border-radius: 8px;
        margin-bottom: 15px;
        transition: 0.4s;

        &::placeholder {
          color: #f3f3f3;
        }

        &:focus {
          box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
        }
      }

      &[type="submit"] {
        width: 100%;
        max-width: 300px;
        background-color: #42b883;
        padding: 16px;
        border-radius: 8px;
        color: #fff;
        font-size: 20px;
        text-transform: uppercase;
        transition: 0.4s;

        &:active {
          background-color: #3b8070;
        }
      }
    }
  }

  .movies-list {
    display: flex;
    flex-wrap: wrap;
    margin: 0px 8px;

    .movie {
      max-width: 20%;
      flex: 1 1 20%;
      padding: 16px 8px;

      .movie-link {
        display: flex;
        flex-direction: column;
        height: 100%;

        .product-image {
          position: relative;
          display: block;

          img {
            display: block;
            width: 100%;
            height: 275px;
            object-fit: cover;
          }

          .type {
            position: absolute;
            padding: 8px 16px;
            background-color: #42b883;
            color: #fff;
            bottom: 16px;
            left: 0px;
            text-transform: capitalize;
          }
        }

        .detail {
          background-color: #496583;
          padding: 16px 8px;
          flex: 1 1 100%;
          border-radius: 0px 0px 8px 8px;

          .year {
            color: #aaa;
            font-size: 14px;
          }

          h3 {
            color: #fff;
            font-weight: 600;
            font-size: 18px;
          }
        }
      }
    }
  }
}
</style>
