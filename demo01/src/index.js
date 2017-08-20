import Vue from 'vue';

const app = new Vue({
  el: '#app',
  data: {
    message: 'Hello World!'
  }
});

const app2 = new Vue({
  el: '#app-2',
  data: {
    message: 'The title property"s value was bound to message value'
  }
});

const app3 = new Vue({
  el: '#app-3',
  data: {
    seen: 1
  }
});

const app4 = new Vue({
  el: '#app-4',
  data: {
    todos: [
      { name: 'item1' },
      { name: 'item2' },
      { name: 'item3' }
    ]
  }
});

const app5 = new Vue({
  el: '#app-5',
  data: {
    message: 'Hello World!'
  },
  methods: {
    reverseMessage: function() {
      return this.message = this.message.split('').reverse().join('');
    }
  }
});

Vue.component('todo-item', {
  props: [ 'todo', 'en' ],
  template: '<li> {{ todo.text }} </li>'
});

const app6 = new Vue({
  el: '#app-6',
  data: {
    message: ''
  }
});

const app7 = new Vue({
  el: '#app-7',
  data: {
    todos: [ 
      { id: 0, text: 'this is the item 0' },
      { id: 1, text: 'this is the item 1' },
      { id: 2, text: 'this is the item 2' }
    ]
  }
})