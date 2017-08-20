import Vue from 'vue';

const app = new Vue({
  el: '#app',
  data: {
    message: 'Hello World!'
  },
  filters: {
    capitalize: function(val) {
      return val.toUpperCase();
    }
  }
});

const app2 = new Vue({
  el: '#app-2',
  data: {
    message: 'Hello World!'
  },
  computed: {
    reverseMessage: function() {
      return this.message.split('').reverse().join('')
    }
  }
});


const app3 = new Vue({
  el: '#app-3',
  data: {
    isActive: {}
  }
});


const app4 = new Vue({
  el: '#app-4',
  data: {
    object: {
      prop1: 'hello world!',
      prop2: 2222,
      prop3: false
    }
  }
});

const app5 = new Vue({
  el: '#app-5',
  data: {
    picked: 'Two'
  }
});

const app6 = new Vue({
  el: '#app-6',
  data: {
    a: {
      ha: '2333'
    },
    b: {
      xi: '1111'
    },
    toggle: ''
  }
});

const app7 = new Vue({
  el: '#app-7',
  tempalte: '<p>hahahahahsa</p>',
  data: {
    message: 'this is a message'
  }
});

var Child = {
  props: {
    propA: {
      type: Number,
      required: true
    },
    propB: {
      type: Number,
      default: 100
    },
    propC: {
      validator: function(value) {
        return value === 'Hello'
      }
    }
  },
  template: '<div><p>propA 是数字 {{ typeof propA }}</p><p> propB 也是数字默认100 {{ propB }}</p><p> propC 必须是字符串 Hello: {{ propC }}</p></div>'
};

const app8 = new Vue({
  el: '#app-8',
  components: {
    'child': Child
  },
  data: {
    p1: 101,
    p2: 0,
    p3: 'Hello'
  }
});


Vue.component('button-counter', {
  data: function() {
    return {
      count: 0
    }
  },
  template: '<button @click="incre">{{ count }}</button>',
  methods: {
    incre: function() {
      this.count++;
      this.$emit('increment');
    }
  }
})

const app9 = new Vue({
  el: '#app-9',
  data: {
    total: 0
  },
  methods: {
    incrementTotal: function() {
      this.total++
    }
  }
});

const app10 = new Vue({
  el: '#app-10',
  components: {
    'app-layout': {
      template: `<div class="container">
                  <header>
                    <slot name="header"></slot>
                  </header>
                  <main>
                    <slot></slot>
                  </main>
                  <footer>
                    <slot name="footer"></slot>
                  </footer>
                </div >`
    }
  }
});


const app11 = new Vue({
  el: '#app-11',
  components: {
    'child-comp': {
      render: function(createEl) {
        return createEl(
          'div',
          {
            class: {
              foo: true,
              bar: true
            },
            style: {
              fontSize: '20px',
              color: 'yellowgreen'
            },
            attrs: {
              id: 'foo',
              title: 'this is the title'
            },
            props: {
              myProp: 'bar'
            }
          },
          [ 'hahahahahahaha']
        )
      }
    }
  }
});

const app12 = new Vue({
  el: '#app-12',
  directives: {
    focus: {
      inserted: function(el) {
        el.value = '123';
        el.focus();
        console.log('hahah')
      }
    }
  }
});

const app13 = new Vue({
  el: '#app-13',
  created: function() {
    console.log('component hook')
  },
  mixins: [{
    created: function() {
      console.log('mixins hook')
    }
  }]
});


const app14 = new Vue({
  el: '#app-14',
  components: {
    'my-child': {
      props: [ 'title' ],
      template: '<p> {{ title }}</p>'
    }
  }
});


const app15 = new Vue({
  el: '#app-15',
  data: {
    message: 'VueJs',
    msg: 'Hello World!'
  }
})



