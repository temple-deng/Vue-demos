# Vuex

<!-- TOC -->

- [Vuex](#vuex)
  - [State](#state)
    - [在 Vue 组件中获得 Vuex 状态](#在-vue-组件中获得-vuex-状态)
    - [`mapState` 辅助函数](#mapstate-辅助函数)
  - [Getters](#getters)
    - [mapGetters 辅助函数](#mapgetters-辅助函数)
  - [Mutations](#mutations)
    - [提交载荷 payload](#提交载荷-payload)
    - [对象风格的提交方式](#对象风格的提交方式)
    - [在组件中提交 Mutations](#在组件中提交-mutations)
    - [Actions](#actions)
    - [分发 Action](#分发-action)
    - [在组件中分发 Action](#在组件中分发-action)
    - [组合 Actions](#组合-actions)
  - [Modules](#modules)
    - [模块的局部状态](#模块的局部状态)
    - [命名空间](#命名空间)
      - [带命名空间的绑定函数](#带命名空间的绑定函数)
    - [模块动态注册](#模块动态注册)
  - [API](#api)
    - [Vuex.Store 的构造选项](#vuexstore-的构造选项)
    - [Vuex.Store 实例属性](#vuexstore-实例属性)
    - [Vuex.Store 实例方法](#vuexstore-实例方法)

<!-- /TOC -->

## State

### 在 Vue 组件中获得 Vuex 状态

Vuex 通过 `store` 选项，提供了一种机制将状态从根组件『注入』到每一个子组件中（需调用 `Vue.use(Vuex)`）：     

```js
const app = new Vue({
  el: '#app',
  // 把 store 对象提供给 “store” 选项，这可以把 store 的实例注入所有的子组件
  store,
  components: { Counter },
  template: '<div class="app"><counter></counter></div>'
})
```  

通过在根实例中注册 `store` 选项，该 `store` 实例会注入到根组件下的所有子组件中，且子组件能通过 `this.$store` 访问到。(估计使用 `provide/inject` 实现的)    

### `mapState` 辅助函数

当一个组件需要获取多个状态时候，将这些状态都声明为计算属性会有些重复和冗余。为了解决这个问题，我们可以使用 mapState 辅助函数帮助我们生成计算属性，让你少按几次键：    

```js
// 在单独构建的版本中辅助函数为 Vuex.mapState
import { mapState } from 'vuex'

export default {
  // ...
  computed: mapState({
    // 箭头函数可使代码更简练
    count: state => state.count,

    // 传字符串参数 'count' 等同于 `state => state.count`
    countAlias: 'count',

    // 为了能够使用 `this` 获取局部状态，必须使用常规函数
    countPlusLocalState (state) {
      return state.count + this.localCount
    }
  })
}
```    

当映射的计算属性的名称与 `state` 的子节点名称相同时，我们也可以给 `mapState` 传一个字符串数组。    

```js
computed: mapState([
  // 映射 this.count 为 store.state.count
  'count'
])
```   

## Getters

Vuex 允许我们在 store 中定义『getters』（可以认为是 store 的计算属性）。就像计算属性一样，getters的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。    
 
Getters 接受 state 作为其第一个参数：    

```js
const store = new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    }
  }
})
```    

Getters 会暴露为 store.getters 对象：   

```js
store.getters.doneTodos // -> [{ id: 1, text: '...', done: true }]
```    

Getters 也可以接受其他 getters 作为第二个参数：    

```js
getters: {
  // ...
  doneTodosCount: (state, getters) => {
    return getters.doneTodos.length
  }
}
store.getters.doneTodosCount // -> 1
```    

### mapGetters 辅助函数

`mapGetters` 辅助函数仅仅是将 `store` 中的 getters 映射到局部计算属性：    

```js
import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
  // 使用对象展开运算符将 getters 混入 computed 对象中
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // ...
    ])
  }
}
```   

如果你想将一个 getter 属性另取一个名字，使用对象形式：   

```js
mapGetters({
  // 映射 this.doneCount 为 store.getters.doneTodosCount
  doneCount: 'doneTodosCount'
})
```   

## Mutations

更改 Vuex 的 store 中的状态的唯一方法是提交 mutation。Vuex 中的 mutations 非常类似于事件：每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)。这个回调函数就是我们实际进行状态更改的地方，并且它会接受 state 作为第一个参数：    

```js
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    increment (state) {
      // 变更状态
      state.count++
    }
  }
})
```    

你不能直接调用一个 mutation handler。这个选项更像是事件注册：“当触发一个类型为 increment 的 mutation 时，调用此函数。”要唤醒一个 mutation handler，你需要以相应的 type 调用 store.commit 方法：   

`store.commit('increment')`    

### 提交载荷 payload

你可以向 store.commit 传入额外的参数，即 mutation 的 载荷（payload）：   

```js
// ...
mutations: {
  increment (state, n) {
    state.count += n
  }
}
store.commit('increment', 10)
```    

### 对象风格的提交方式

提交 mutation 的另一种方式是直接使用包含 `type` 属性的对象：   

```js
store.commit({
  type: 'increment',
  amount: 10
})
```   

当使用对象风格的提交方式，整个对象都作为载荷传给 mutation 函数，因此 handler 保持不变（哈?）：   

```js
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```   

### 在组件中提交 Mutations

你可以在组件中使用 this.$store.commit('xxx') 提交 mutation，或者使用 mapMutations 辅助函数将组件中的 methods 映射为 store.commit 调用（需要在根节点注入 store）。     

```js
import { mapMutations } from 'vuex'

export default {
  // ...
  methods: {
    ...mapMutations([
      'increment' // 映射 this.increment() 为 this.$store.commit('increment')
    ]),
    ...mapMutations({
      add: 'increment' // 映射 this.add() 为 this.$store.commit('increment')
    })
  }
}
```   

### Actions

Action 类似于 mutation，不同在于：   

+ Action 提交的是 mutation，而不是直接变更状态。
+ Action 可以包含任意异步操作。     

```js
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    increment (context) {
      context.commit('increment')
    }
  }
})
```   

Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象，因此你可以调用 context.commit 提交一个 mutation，或者通过 context.state 和 context.getters 来获取 state 和 getters。当我们在之后介绍到 Modules 时，你就知道 context 对象为什么不是 store 实例本身了。    

感觉像是这样的，mutations 像是 Redux 中的 reducer，而 `commit` 方法相当于我们直接调用 `reducer`。而 action 概念是类似的。   

### 分发 Action

Action 通过 `store.dispatch` 方法触发：    

`store.dispatch('increment')`    

我们可以在 action 内部执行异步操作：   

```js
actions: {
  incrementAsync ({ commit }) {
    setTimeout(() => {
      commit('increment')
    }, 1000)
  }
}
```   

Actions 支持同样的载荷方式和对象方式进行分发：    

```js
// 以载荷形式分发
store.dispatch('incrementAsync', {
  amount: 10
})

// 以对象形式分发
store.dispatch({
  type: 'incrementAsync',
  amount: 10
})
```    

### 在组件中分发 Action

你在组件中使用 `this.$store.dispatch('xxx')` 分发 action，或者使用 `mapActions` 辅助函数将组件的 `methods` 映射为 `store.dispatch` 调用（需要先在根节点注入 store）：     

```js
import { mapActions } from 'vuex'

export default {
  // ...
  methods: {
    ...mapActions([
      'increment' // 映射 this.increment() 为 this.$store.dispatch('increment')
    ]),
    ...mapActions({
      add: 'increment' // 映射 this.add() 为 this.$store.dispatch('increment')
    })
  }
}
```   

### 组合 Actions

你需要明白 store.dispatch 可以处理被触发的action的回调函数返回的Promise，并且store.dispatch仍旧返回Promise：    

```js
actions: {
  actionA ({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('someMutation')
        resolve()
      }, 1000)
    })
  }
}
```    

现在我们可以：   

```js
store.dispatch('actionA').then(() => {
  // ...
})
```    

## Modules

Vuex 允许我们将 store 分割成模块（module）。每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块——从上至下进行同样方式的分割：   

```js
const moduleA = {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: { ... },
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA 的状态
store.state.b // -> moduleB 的状态
```    

### 模块的局部状态

对于模块内部的 mutation 和 getter，接收的第一个参数是模块的局部状态对象。  

```js
const moduleA = {
  state: { count: 0 },
  mutations: {
    increment (state) {
      // 这里的 `state` 对象是模块的局部状态
      state.count++
    }
  },

  getters: {
    doubleCount (state) {
      return state.count * 2
    }
  }
}
```   

同样，对于模块内部的 action，局部状态通过 `context.state` 暴露出来， 根节点状态则为 `context.rootState`：    

```js
const moduleA = {
  // ...
  actions: {
    incrementIfOddOnRootSum ({ state, commit, rootState }) {
      if ((state.count + rootState.count) % 2 === 1) {
        commit('increment')
      }
    }
  }
}
```   

对于模块内部的 getter，根节点状态会作为第三个参数暴露出来：   

```js
const moduleA = {
  // ...
  getters: {
    sumWithRootCount (state, getters, rootState) {
      return state.count + rootState.count
    }
  }
}
```   

### 命名空间

默认情况下，模块内部的 action、mutation 和 getter 是注册在全局命名空间的——这样使得多个模块能够对同一 mutation 或 action 作出响应。如果希望你的模块更加自包含或提高可重用性，你可以通过添加 namespaced: true 的方式使其成为命名空间模块。当模块被注册后，它的所有 getter、action 及 mutation 都会自动根据模块注册的路径调整命名。例如：    

```js
const store = new Vuex.Store({
  modules: {
    account: {
      namespaced: true,
      // 模块内容（module assets）
      state: { ... }, // 模块内的状态已经是嵌套的了，使用 `namespaced` 属性不会对其产生影响
      getters: {
        isAdmin () { ... } // -> getters['account/isAdmin']
      },
      actions: {
        login () { ... } // -> dispatch('account/login')
      },
      mutations: {
        login () { ... } // -> commit('account/login')
      },
      // 嵌套模块
      modules: {
        // 继承父模块的命名空间
        myPage: {
          state: { ... },
          getters: {
            profile () { ... } // -> getters['account/profile']
          }
        },
        // 进一步嵌套命名空间
        posts: {
          namespaced: true,
          state: { ... },
          getters: {
            popular () { ... } // -> getters['account/posts/popular']
          }
        }
      }
    }
  }
})
```   

如果你希望使用全局 `state` 和 `getter`，`rootState` 和 `rootGetter` 会作为第三和第四参数传入 `getter`，也会通过 `context` 对象的属性传入 action。    

若需要在全局命名空间内分发 action 或提交 mutation，将 `{ root: true }` 作为第三参数传给 `dispatch` 或 `commit` 即可。     

```js
modules: {
  foo: {
    namespaced: true,
    getters: {
      // 在这个模块的 getter 中，`getters` 被局部化了
      // 你可以使用 getter 的第四个参数来调用 `rootGetters`
      someGetter (state, getters, rootState, rootGetters) {
        getters.someOtherGetter // -> 'foo/someOtherGetter'
        rootGetters.someOtherGetter // -> 'someOtherGetter'
      },
      someOtherGetter: state => { ... }
    },
    actions: {
      // 在这个模块中， dispatch 和 commit 也被局部化了
      // 他们可以接受 `root` 属性以访问根 dispatch 或 commit
      someAction ({ dispatch, commit, getters, rootGetters }) {
        getters.someGetter // -> 'foo/someGetter'
        rootGetters.someGetter // -> 'someGetter'
        dispatch('someOtherAction') // -> 'foo/someOtherAction'
        dispatch('someOtherAction', null, { root: true }) // -> 'someOtherAction'
        commit('someMutation') // -> 'foo/someMutation'
        commit('someMutation', null, { root: true }) // -> 'someMutation'
      },
      someOtherAction (ctx, payload) { ... }
    }
  }
}
```    

#### 带命名空间的绑定函数

当使用 `mapState`, `mapGetters`, `mapActions` 和 `mapMutations` 这些函数来绑定命名空间模块时，写起来可能比较繁琐：    

```js
computed: {
  ...mapState({
    a: state => state.some.nested.module.a,
    b: state => state.some.nested.module.b
  })
},
methods: {
  ...mapActions([
    'some/nested/module/foo',
    'some/nested/module/bar'
  ])
}
```    

对于这种情况，你可以将模块的空间名称字符串作为第一个参数传递给上述函数，这样所有绑定都会自动将该模块作为上下文。于是上面的例子可以简化为：    

```js
computed: {
  ...mapState('some/nested/module', {
    a: state => state.a,
    b: state => state.b
  })
},
methods: {
  ...mapActions('some/nested/module', [
    'foo',
    'bar'
  ])
}
```   

### 模块动态注册

在 store 创建之后，你可以使用 `store.registerModule` 方法注册模块：    

```js
// 注册模块 `myModule`
store.registerModule('myModule', {
  // ...
})
// 注册嵌套模块 `nested/myModule`
store.registerModule(['nested', 'myModule'], {
  // ...
})
```   

你也可以使用 store.unregisterModule(moduleName) 来动态卸载模块。注意，你不能使用此方法卸载静态模块（即创建 store 时声明的模块）。    

## API

### Vuex.Store 的构造选项

+ state: `Object`
+ mutation: `{ [type: string]: Function }`，函数第一个参数是 `state`，第二个是 `payload`。
+ actions: `{ [type: string]: Function }`, 函数接受一个 `context` 对象，包含以下属性：
```js
{
  state,     // 等同于 store.state, 若在模块中则为局部状态
  rootState, // 等同于 store.state, 只存在于模块中
  commit,    // 等同于 store.commit
  dispatch,  // 等同于 store.dispatch
  getters    // 等同于 store.getters
}
```    
+ getters: `{ [key: string]: Function }`, getter 方法接受以下参数：   
```js
  state,     // 如果在模块中定义则为模块的局部状态
  getters,   // 等同于 store.getters
  rootState  // 等同于 store.state
```   
+ modules: `Object`
+ plugins
+ strict   

### Vuex.Store 实例属性

+ state
+ getters

### Vuex.Store 实例方法

+ `commit(type: string, payload?: any) | commit(mutation: Object)`
+ `dispatch(type: string, payload? any) | dispatch(action: Object)`分发 action。返回 action 方法的返回值，如果多个处理函数被触发，那么返回一个 Pormise。     
+ `replaceState(state: Object)`
+ `watch(getter: Function, cb: Function, options?: Object)` 响应式地监测一个 getter 方法的返回值，当值改变时调用回调函数。getter 接收 store 的状态作为唯一参数。接收一个可选的对象参数表示 Vue 的 vm.$watch 方法的参数。要停止监测，直接调用返回的处理函数。   
+ `subscribe(handler: Function)`注册监听 store 的 mutation。handler 会在每个 mutation 完成后调用，接收 mutation 和经过 mutation 后的状态作为参数：   
+ `registerModule(path: string | Array<string>, module: Module)`
+ `unregisterModule(path: string | Array<string>)`   
+ `hotUpdate(newOptions: Object)`热替换新的 action 和 mutation。   





