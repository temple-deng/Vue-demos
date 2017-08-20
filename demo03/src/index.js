import Vue from 'vue';
import Vuex from 'vuex';
import VuexRouter from 'vue-router';

Vue.use(Vuex);
Vue.use(VuexRouter)

const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
});



const vm = new Vue({
  el: '#vm',
  store,
  methods: {
    incre() {
      this.$store.commit('increment');
    }
  },
  computed: {
    count() {
      return this.$store.state.count;
    }
  }
});

var routes = [
  { path: '/foo', 
    component: {
      template: '<h1>Foo</h1>'
    }
  },
  {
    path: '/bar',
    component: {
      template: '<p>Bar</p>'
    }
  }
];

var router = new VuexRouter({
  mode: 'history',
  routes: routes
});

const app1 = new Vue({
  el: '#app-1',
  router
});