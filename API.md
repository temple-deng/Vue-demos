
## 全局配置

`Vue.config` 是一个对象，包含 Vue 的全局配置。可以在启动应用之前修改下列属性：    

#### silent

+ type: `boolean`
+ default: `false`   

`Vue.config.silent = true`   

取消 Vue 所有的日志与警告。     

#### optionMergeStrategies

+ type: `{ [key: string]: Function }`
+ default: `{}`    

```js
Vue.config.optionMergeStrategies._my_option = function (parent, child, vm) {
  return child + 1
}
const Profile = Vue.extend({
  _my_option: 1
})
// Profile.options._my_option = 2
```    

自定义合并策略的选项。    

合并策略选项分别接受第一个参数作为父实例，第二个参数为子实例，Vue实例上下文被作为第三个参数传入。    

#### devtools

+ type: `boolean`
+ default: `true` production 环境为 `false`   

是否允许 vue-devtools 检查代码。    

#### errorHandler

+ type: `Function`
+ default: `undefined`    

```js
Vue.config.errorHandler = function (err, vm, info) {
  // handle error
  // `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
  // 只在 2.2.0+ 可用
}
```    

指定组件的渲染和观察期间未捕获错误的处理函数。这个处理函数被调用时，可获取错误信息和 Vue 实例。从 2.2.0 起，这个钩子也会捕获组件生命周期钩子里的错误。从 2.4.0 起这个钩子也会捕获 Vue 自定义事件句柄内部的错误了。     

#### warnHandler

+ type: `Function`
+ default: `undefined`    

```js
Vue.config.warnHandler = function (msg, vm, trace) {
  // `trace` 是组件的继承关系追踪
}
```    

为 Vue 的运行时警告赋于一个自定义句柄。注意这只会在开发者环境下生效，在生产环境下它会被忽略。     

#### ignoredElements

+ type: `Array<string>`
+ default: `[]`    

```js
Vue.config.ignoredElements = [
  'my-custom-web-component', 'another-web-component'
]
```    

须使 Vue 忽略在 Vue 之外的自定义元素 (e.g., 使用了 Web Components APIs)。否则，它会假设你忘记注册全局组件或者拼错了组件名称，从而抛出一个关于 `Unknown custom element` 的警告。       

#### keyCodes

+ type: `{ [key: string]: number | Array<number>}`   
+ default: `{}`    

```js
Vue.config.keyCodes = {
  v: 86,
  f1: 112,
  // camelCase 不可用
  mediaPlayPause: 179,
  // 取而代之的是 kebab-case 且用双引号括起来
  "media-play-pause": 179,
  up: [38, 87]
}
```    

#### performance

+ type: `boolean`
+ default: `false`    

设置为 true 以在浏览器开发工具中启用对组件初始化，渲染和打补丁的性能追踪。只适用于开发模式和支持 performance.mark API的浏览器上。      

#### productionTip

+ type: `boolean`
+ default: `true`   

设置为 false 以阻止 vue 在启动时生成生产提示。    

## 全局 API

#### Vue.extend(options)

+ `options`: `Object`    

使用 Vue 构造器，创建一个子类。参数是一个包含组件选项的对象。    

`data` 是特例，在 `Vue.extend()` 中必须是函数。    

`<div id="mount-point"></div>`    

```js
// 创建构造器
var Profile = Vue.extend({
  template: '<p>{{firstName}} {{lastName}} aka {{alias}}</p>',
  data: function () {
    return {
      firstName: 'Walter',
      lastName: 'White',
      alias: 'Heisenberg'
    }
  }
})
// 创建 Profile 实例，并挂载到一个元素上。
new Profile().$mount('#mount-point')
```    

结果如下：    

`<p>Walter White aka Heisenberg</p>`     

#### Vue.nextTick( [callback, context ])

+ `[callback]`: `Function`
+ `[context]`: `Object`   

这个大括号应该是指两个参数都是可选的。   

在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。      

#### Vue.set( target, key, value)   

+ `target`: `Object | Array `
+ `key`: `string | number`
+ `value`: any     
+ Return: 设置的值，应该就是 `value`    

设置对象的属性。如果对象是响应式的，确保属性被创建后也是响应式的，同时触发视图更新。这个方法主要用于避开 Vue 不能检测属性被添加的限制。    

注意对象不能是 Vue 实例，或者 Vue 实例的根数据对象。    

#### Vue.delete( target, key)

+ `target`: `Object | Array `
+ `key`: `string | number`    

删除对象的属性。如果对象是响应式的，确保删除能触发更新视图。这个方法主要用于避开 Vue 不能检测到属性被删除的限制，但是你应该很少会使用它。    

目标对象不能是一个 Vue 示例或 Vue 示例的根数据对象。     

#### Vue.directive(id, [definition])    

+ `id`: `string`
+ `[definition]`: `Function | Object`   

注册或者获取全局指令。    

```js
// 注册
Vue.directive('my-directive', {
  bind: function () {},
  inserted: function () {},
  update: function () {},
  componentUpdated: function () {},
  unbind: function () {}
})
// 注册（传入一个简单的指令函数）
Vue.directive('my-directive', function () {
  // 这里将会被 `bind` 和 `update` 调用
})
// getter，返回已注册的指令
var myDirective = Vue.directive('my-directive')
```    

这里的 getter 应该主要是获取 defintion 对象吧。     

#### Vue.filter(id, [definition])

+ `id`: `string`
+ `[definition]`: `Function`    

注册或者获取全局过滤器。    

```js
// 注册
Vue.filter('my-filter', function (value) {
  // 返回处理后的值
})
// getter，返回已注册的过滤器
var myFilter = Vue.filter('my-filter')
```    

#### Vue.component(id, [definition])

+ `id`: `string`
+ `[definition]`: `Function | Object`    

```js
// 注册组件，传入一个扩展过的构造器
Vue.component('my-component', Vue.extend({ /* ... */ }))
// 注册组件，传入一个选项对象（自动调用 Vue.extend）
Vue.component('my-component', { /* ... */ })
// 获取注册的组件（始终返回构造器）
var MyComponent = Vue.component('my-component')
```    

#### Vue.use( plugin )

+ `plugin`: `Function | Object`    

安装 Vue.js 插件。如果插件是一个对象，必须提供 `install` 方法。如果插件是一个函数，它会被作为 `install` 方法。`install` 方法将被作为 Vue 的参数调用。    

当 install 方法被同一个插件多次调用，插件将只会被安装一次。     

#### Vue.mixin( mixin )  

+ `mixin`: `Object`    

全局注册一个混合，影响注册之后所有创建的每个 Vue 实例。插件作者可以使用混合，向组件注入自定义的行为。不推荐在应用代码中使用。     

#### Vue.compile( template )   

+ `template`: `string`   

在render函数中编译模板字符串。只在独立构建时有效。   

```js
var res = Vue.compile('<div><span>{{ msg }}</span></div>')
new Vue({
  data: {
    msg: 'hello'
  },
  render: res.render,
  staticRenderFns: res.staticRenderFns
})
```    

#### Vue.version

## 选项

### 数据

#### data

+ type: `Object | Function`    

对象必须是纯粹的对象(含有零个或多个的key/value对)：浏览器 API 创建的原生对象，原型上的属性会被忽略。大概来说，data 应该只能是数据 - 不推荐观察拥有状态行为的对象。   

实例创建之后，可以通过 `vm.$data` 访问原始数据对象。Vue 实例也代理了 `data` 对象上所有的属性，因此访问 `vm.a` 等价于访问 `vm.$data.a`。    

以 `_`或 `$` 开头的属性 不会 被 Vue 实例代理，因为它们可能和 Vue 内置的属性、 API 方法冲突。你可以使用例如 `vm.$data._property` 的方式访问这些属性。    

当一个组件被定义，`data` 必须声明为返回一个初始数据对象的函数，因为组件可能被用来创建多个实例。如果 `data` 仍然是一个纯粹的对象，则所有的实例将共享引用同一个数据对象！通过提供 `data` 函数，每次创建一个新实例后，我们能够调用 `data` 函数，从而返回初始数据的一个全新副本数据对象。    

#### props

+ type: `Object | Array<string>`    

props 可以是数组或对象，用于接收来自父组件的数据。props 可以是简单的数组，或者使用对象作为替代，对象允许配置高级选项，如类型检测、自定义校验和设置默认值。    

#### propsData

+ type: `{ [key: string]: any}`   
+ 限制：只用于 `new` 创建的实例中。    

创建实例时传递 props。主要作用是方便测试。    

```js
var Comp = Vue.extend({
  props: ['msg'],
  template: '<div>{{ msg }}</div>'
})
var vm = new Comp({
  propsData: {
    msg: 'hello'
  }
})
```    

#### computed

+ type: `{ [key: string]: Function | { get: Function, set: Function} }`   

计算属性将被混入到 Vue 实例中。所有 getter 和 setter 的 this 上下文自动地绑定为 Vue 实例。    

计算属性的结果会被缓存，除非依赖的响应式属性变化才会重新计算。注意，如果实例范畴之外的依赖 (比如非响应式的 not reactive) 是不会触发计算属性更新的。    

#### methods  

+ type: `{ [key: string]: Function }`   

methods 将被混入到 Vue 实例中。可以直接通过 VM 实例访问这些方法，或者在指令表达式中使用。方法中的 this 自动绑定为 Vue 实例。     

```js
var vm = new Vue({
  data: { a: 1 },
  methods: {
    plus: function () {
      this.a++
    }
  }
})
vm.plus()
vm.a // 2
```    

#### watch

+ type: `{ [key: string]: string | Function | Object }`    

一个对象，键是需要观察的表达式，值是对应回调函数。值也可以是方法名，或者包含选项的对象。Vue 实例将会在实例化时调用 `$watch()`，遍历 `watch` 对象的每一个属性。    

```js
var vm = new Vue({
  data: {
    a: 1,
    b: 2,
    c: 3
  },
  watch: {
    a: function (val, oldVal) {
      console.log('new: %s, old: %s', val, oldVal)
    },
    // 方法名
    b: 'someMethod',
    // 深度 watcher
    c: {
      handler: function (val, oldVal) { /* ... */ },
      deep: true
    }
  }
})
vm.a = 2 // -> new: 2, old: 1
```    

看情况的话，vm 实例会直接代理 `data`, `methods`, `computed` 中的属性和方法。     

### DOM

#### el

+ type: `string | HTMLElement`
+ 限制：只在 `new` 创建的实例中遵守。     

提供一个在页面上已存在的 DOM 元素作为 Vue 实例的挂载目标。可以是 CSS 选择器，也可以是一个 HTMLElement 实例。    

如果这个选项在实例化时有作用，实例将立即进入编译过程，否则，需要显式调用 `vm.$mount()` 手动开启编译。这里在实例化有作用是指上面的满足限制的时候这个
选项会起作用的意思吧。    

如果 `render` 函数和 `template` 属性都不存在，挂载 DOM 元素的 HTML 会被提取出来用作模板，此时，必须使用 Runtime + Compiler 构建的 Vue 库。

#### template

+ type: `string`    

一个字符串模板作为 Vue 实例的标识使用。模板将会 替换 挂载的元素。挂载元素的内容都将被忽略，除非模板的内容有分发 slot。    

如果值以 `#` 开始，则它用作选项符，将使用匹配元素的 innerHTML 作为模板。常用的技巧是用 `<script type="x-template">` 包含模板。   

如果 Vue 选项中包含 `render` 函数，template 选项将被忽略。       

#### render

+ type: `(createElement: () => VNode) => VNode()`      

字符串模板的代替方案，允许你发挥 JavaScript 最大的编程能力。`render` 函数接收一个 `createElement` 方法作为第一个参数用来创建 `VNode`。     

如果组件是一个函数组件，渲染函数还会接收一个额外的 `context` 参数，为没有实例的函数组件提供上下文信息。    

Vue 选项中的 `render` 函数若存在，则 Vue 构造函数不会从 `template` 选项或通过 `el` 选项指定的挂载元素中提取出的 HTML 模板编译 `render` 函数。     

总之最后不管是使用 `el` 挂载元素的 HTML，还是 `template` 指定的模板，最终都要编译成 `render` 函数，返回 VNode。    


#### renderError

+ type: `(creatrElement: () => VNode, error: Error) => VNode`    

只在开发环境工作。    

当 render 函数遭遇错误时，提供另外一种渲染输出。其错误将会作为第二个参数传递到 renderError。这个功能配合 hot-reload 非常实用。    

```js
new Vue({
  render (h) {
    throw new Error('oops')
  },
  renderError (h, err) {
    return h('pre', { style: { color: 'red' }}, err.stack)
  }
}).$mount('#app')
```    

### 生命周期钩子

所有的生命周期钩子自动绑定 `this` 上下文到实例中，因此你可以访问数据，对属性和方法进行运算。这意味着 你不能使用箭头函数来定义一个生命周期方法 (例如 `created: () => this.fetchTodos()`)。     

#### beforeCreate

在实例初始化之后，数据观测和 event/watcher 事件配置之前调用。    

#### created

实例已经创建完成后调用。这时已经完成了数据观测，属性和方法的运算，watch/event 回调。     

#### beforeMount
 
在挂载前调用，相关的 `render` 函数首次被调用。该钩子在服务器端渲染期间不被调用。    

#### mounted

`el` 被新创建的 `vm.$el` 替换，并挂载到实例上去之后调用该钩子。如果 root 实例挂载了一个文档内元素，当 `mounted` 被调用时 `vm.$el` 也在文档内。     

该钩子在服务器端渲染期间不被调用。    

#### beforeUpdate

数据更新时调用，发生在虚拟 DOM 重新渲染和打补丁之前。    

你可以在这个钩子中进一步地更改状态，这不会触发附加的重渲染过程。     

该钩子在服务器端渲染期间不被调用。     

#### updated

由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。该钩子在服务器端渲染期间不被调用。     

#### activated

keep-alive 组件激活时调用。      

该钩子在服务器端渲染期间不被调用。     

#### deactivated

keep-alive 组件停用时调用。   

该钩子在服务器端渲染期间不被调用。   

#### beforeDestroy

实例销毁之前调用。在这一步，实例仍然完全可用。   

该钩子在服务器端渲染期间不被调用。    

#### destroyed

Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。    

该钩子在服务器端渲染期间不被调用。     

### 资源

#### directives

+ type: `Object`    

#### filters

+ type: `Object`   

#### components

+ type: `Object`   

### 组合

#### parent

+ type: `Vue instance`   

指定以创建的实例的父实例，在两者之间建立父子关系。子实例可以用 `this.$parent` 访问父实例，子实例被推入父实例的 `$children` 数组中。    

#### mixins

+ type: `Array<Object>`   

mixins 选项接受一个混合对象的数组。这些混合实例对象可以像正常的实例对象一样包含选项,他们将在 `Vue.extend()` 里最终选择使用相同的选项合并逻辑合并。    

#### extends

+ type: `Object | Function`   

允许声明扩展另一个组件(可以是一个简单的选项对象或构造函数),而无需使用 `Vue.extend`。这主要是为了便于扩展单文件组件。    

这和 `mixins` 类似，区别在于，组件自身的选项会比要扩展的源组件具有更高的优先级。     

#### provide/inject

+ provide: `Object | () => Object`
+ inject: `Array<string> | { [key: string]: string | Symbol }`   

`provide` 和 `inject` 主要为高阶插件/组件库提供用例。    

这对选项需要一起使用，以允许一个祖先组件向其所有子孙后代注入一个依赖，不论组件层次有多深，并在起上下游关系成立的时间里始终生效。如果你熟悉 React，这与 React 的上下文特性很相似。     

`provide` 选项应该是一个对象或返回一个对象的函数。该对象包含可注入其子孙的属性。在该对象中你可以使用 ES2015 Symbols 作为 key，但是只在原生支持 `Symbol` 和 `Reflect.ownKeys` 的环境下可工作。

`inject` 选项应该是一个字符串数组或一个对象，该对象的 key 代表了本地绑定的名称，`value` 为其 key (字符串或 Symbol) 以在可用的注入中搜索。     

```js
var Provider = {
  provide: {
    foo: 'bar'
  },
  // ...
}
var Child = {
  inject: ['foo'],
  created () {
    console.log(this.foo) // -> "bar"
  }
  // ...
}
```   

类似于 React 中的 context 特性。`provide` 相当于父组件上的 `getChildContext`。`inject` 相当于子组件上的 `context` 对象。    

### 其他

#### name

+ type: `string`  
+ 限制：只有作为组件选项时起作用。    

允许组件模板递归地调用自身。注意，组件在全局用 `Vue.component()` 注册时，全局 ID 自动作为组件的 `name`。      

#### delimiters

+ type: `Array<string>`
+ default: `["{{", "}}"]`   

改变纯文本的插入分隔符。    

#### functional 

+ type: `boolean`   

使组件无状态（没有 `data` ）和无实例（没有 `this` 上下文）。他们用一个简单的 `render` 函数返回虚拟节点使他们更容易渲染。    

#### model

+ type: `{ prop?: string, event?: string }`   

允许一个自定义组件在使用 `v-model` 时定制 `prop` 和 `event`。默认情况下，一个组件上的 `v-model` 会把 `value` 用作 `prop` 且把 `input` 用作 `event`，但是一些输入类型比如单选框和复选框按钮可能像使用 value prop 来达到不同的目的。使用 model 选项可以回避这些情况产生的冲突。     

#### inheritAttrs

+ type: `boolean`
+ default: `true`   

详细：

默认情况下父作用域的不被认作 props 的特性绑定 (attribute bindings) 将会“回退”且作为普通的 HTML 特性应用在子组件的根元素上。当撰写包裹一个目标元素或另一个组件的组件时，这可能不会总是符合预期行为。通过设置 `inheritAttrs` 到 `false`，这些默认行为将会被去掉。而通过 (同样是 2.4 新增的) 实例属性 `$attrs` 可以让这些特性生效，且可以通过 `v-bind` 显性的绑定到非根元素上。     

#### comments

+ type: `boolean`
+ default: `false`  

当设为 true 时，将会保留且渲染模板中的 HTML 注释。默认行为是舍弃它们。     


## 实例属性

#### vm.$data

Vue 实例观测的数据对象。Vue 实例代理了对其 data 对象属性的访问。   

#### vm.$props

一个对象，代表当前组件收到的 props。Vue 实例代理访问到这个 props 对象的属性们。    

当一个属性同时声明为 props 和 data 时，默认使用 `props`。    

#### vm.$el

+ type: `HTMLElement`  
+ 只读    

Vue 实例使用的根 DOM 元素。    

#### vm.$options

+ type: `Object`
+ 只读   

用于当前 Vue 实例的初始化选项。需要在选项中包含自定义属性时会有用处：    

```js
new Vue({
  customOption: 'foo',
  created: function () {
    console.log(this.$options.customOption) // -> 'foo'
  }
})
```    

#### vm.$parent

+ type: `Vue instance`  
+ 只读   

如果当前实例有父实例的话，就是父实例的引用。    

#### vm.$root

+ type: `Vue instance` 
+ 只读   

当前组件树的根 Vue 实例。如果当前实例没有父实例，此实例将会是自己。   

#### vm.$children

+ type: `Array<Vue instance>`
+ 只读   

当前实例的直接子组件。     

#### vm.$slots

+ type: `{ [name: string]: ?Array<VNode>}`   
+ 只读   

用来访问 slot 分发的内容。每个具名 slot 有其相应的属性。`default` 属性包括了所有没有被包含在具名 slot 中的节点。   

#### vm.$scopedSlots

+ type: `{ [name: string]: props => VNode | Array<VNode> }`   
+ 只读   

用来访问作用域插槽。    

#### vm.$refs

+ type: `Object`
+ 只读   

一个对象，包含了所有拥有 `ref` 注册的子组件。   

#### vm.$isServer

+ type: `boolean`
+ 只读

当前 Vue 实例是否运行于服务器。    

#### vm.$attrs

+ type: `{ [key: string]: string }`  
+ 只读    

包含了父作用域中不被认为 (且不预期为) props 的特性绑定 (`class` 和 `style` 除外)。当一个组件没有声明任何 props 时，这里会包含所有父作用域的绑定 (`class` 和 `style` 除外)，并且可以通过 `v-bind="$attrs"` 传入内部组件——在创建更高层次的组件时非常有用。      

#### vm.$listeners  

+ type: `{ [key: string]: Function | Array<Function> }`   
+ 只读   

包含了父作用域中的 (不含 `.native` 修饰器的) `v-on` 事件监听器。它可以通过 `v-on="$listeners"` 传入内部组件——在创建更高层次的组件时非常有用。   

## 实例方法 

### 数据

#### vm.$watch(expOrFn, callback, [options])

+ `expOrFn`: `string | Function `
+ `callback`: `Function | Object `
+ `[options]`: `Object`   
  - `deep`: `boolean`
  - `immediate`: `boolean`   
+ Return: `unwatch` `Function`  

观察 Vue 实例变化的一个表达式或计算属性函数。回调函数得到的参数为新值和旧值。表达式只接受监督的键路径。对于更复杂的表达式，用一个函数取代。      

```js
// 键路径
vm.$watch('a.b.c', function (newVal, oldVal) {
  // 做点什么
})
// 函数
vm.$watch(
  function () {
    return this.a + this.b   //这里指定是这个表达式的值发生变动时触发回调把
  },
  function (newVal, oldVal) {
    // 做点什么
  }
)
```   

`vm.$watch` 返回一个取消观察函数，用来停止触发回调：   

```js
var unwatch = vm.$watch('a', cb)
// 之后取消观察
unwatch()
```    

`deep` 为 `true` 时可以发现对象内部值的变化。   

`immediate` 为 `true` 时立即以表达式的当前值触发回调。   

#### vm.$set(target, key, value)

略。    

#### vm.$delete(target, key)

略。   

### 事件

#### vm.$on(event, callback)

+ `event`: `string | Array<string>`   

监听当前实例上的自定义事件。事件可以由`vm.$emit`触发。回调函数会接收所有传入事件触发函数的额外参数。     

#### vm.$once(event, callback)

+ `event`: `string`   

只触发一次的监听器。    

#### vm.$off([event, callback])

+ `event`: `string | Array<string>`  

移除自定义事件监听器。   

+ 如果没有提供参数，则移除所有的事件监听器；

+ 如果只提供了事件，则移除该事件所有的监听器；

+ 如果同时提供了事件与回调，则只移除这个回调的监听器。    

#### vm.$emit(event, [...args])

略。    

### 生命周期

#### vm.$mount([elementOrSelector])

+ `[elementOrSelector]`: `Element` | `string`
+ `[hydrating]`: `boolean`
+ Return: `vm` 实例自身    

如果 Vue 实例在实例化时没有收到 el 选项，则它处于“未挂载”状态，没有关联的 DOM 元素。可以用 `vm.$mount()` 手动地挂载一个未挂载的实例。    

如果没有提供 `elementOrSelector` 参数，模板将被渲染为文档之外的元素，并且我们必须使用原生的 DOM API 将其插入到文档中。    

但是文档没有 `hydrating` 参数是什么鬼。。。    

#### vm.$forceUpdate()

迫使 Vue 实例重新渲染。注意它仅仅影响实例本身和插入插槽内容的子组件，而不是所有子组件。     

#### vm.$nextTick([callback])

将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新。    

#### vm.$destroy()

完全销毁一个实例。清理它与其它实例的连接，解绑它的全部指令及事件监听器。     

## 指令

#### v-text

+ 预期： `string`   

更新元素的 `textContent`。如果要更新部分的 `textContent`，需要使用 `{{}}` 插值。   

```html
<span v-text="msg"></span>
<!-- 和下面的一样 -->
<span>{{msg}}</span>
```   

不是很懂怎么更新部分，实验的时候也没有实现这个功能。    

#### v-html

+ 预期：`string`

更新元素的 `innerHTML`。注意：内容按普通 HTML 插入 - 不会作为 Vue 模板进行编译。    

#### v-show

+ 预期：`any`    

根据表达式之真假值，切换元素的 `display` CSS 属性。    

#### v-if

+ 预期：`any`    

根据表达式的值的真假条件渲染元素。在切换时元素及它的数据绑定 / 组件被销毁并重建。如果元素是 `<template>` ，将提出它的内容作为条件块。    

#### v-else

略。    

#### v-if-else

+ 预期：`any`   

略。     

#### v-for

+ 预期：`Array | Object | number | string` (这的预期应该指的是 `in` 或者 `of` 运算符之后的表达式)

`v-for` 默认行为试着不改变整体，而是替换元素。迫使其重新排序的元素,您需要提供一个 `key` 的特殊属性。    

#### v-on

+ 缩写：`@`
+ 预期：`Function | Inline Statement | Object`
+ 参数：`event`
+ 修饰符：   
  - `.stop`
  - `.prevent`
  - `.capture`
  - `.self`
  - `{keyCode | keyAlias}`
  - `.native`
  - `.once`
  - `.left`
  - `.right`
  - `.middle`
  - `.passive`   

从 2.4.0 开始，`v-on` 同样支持不带参数绑定一个事件/监听器键值对的对象。注意当使用对象语法时，是不支持任何修饰器的。    

用在普通元素上时，只能监听 原生 DOM 事件。用在自定义元素组件上时，也可以监听子组件触发的自定义事件。    

在监听原生 DOM 事件时，方法以事件为唯一的参数。如果使用内联语句，语句可以访问一个 `$event` 属性：`v-on:click="handle('ok', $event)"`。     

#### v-bind

+ 缩写：`:`
+ 参数：`attrOrProp (optional)`   
+ 修饰符：   
  - `.prop` - 被用于绑定 DOM 属性
  - `.camel` - 将 kebab-case 属性名转换为 camelCase
  - `.sync` - 扩展成一个更新父组件绑定值的 `v-on` 监听器   

  
#### v-model

+ 预期：随着表单控件类型不同而不同。
+ 限制
  - `<input>`
  - `<select>`
  - `<textarea>`
  - components
+ 修饰符
  - `.lazy`
  - `.number`
  - `.trim`    

#### v-pre

不需要表达式。   

跳过这个元素和它的子元素的编译过程，可以用来显示原始的双大括号标签。   

#### v-cloak

不需要表达式。   

这个指令保持在元素上直到关联实例结束编译。和 CSS 规则如 `[v-cloak] { display: none }` 一起用时，这个指令可以隐藏未编译的 Mustache 标签直到实例准备完毕。    

```css
[v-cloak] {
  display: none;
}
```  

```html
<div v-cloak>
  {{ message }}
</div>
```   

貌似是这个意思，按照上面的搭配。可能就是在未编译前就先隐藏原始的 DOM 内容，不会说在编译后替换原始内容，造成一次抖动的样子。    

#### v-once

不需要表达式。    

只渲染元素和组件一次。随后的重新渲染,元素/组件及其所有的子节点将被视为静态内容并跳过。这可以用于优化更新性能。    

## 特殊属性

#### key

+ 预期：`number | string`    

`key` 的特殊属性主要用在 Vue的虚拟DOM算法，在新旧nodes对比时辨识VNodes。如果不使用key，Vue会使用一种最大限度减少动态元素并且尽可能的尝试修复/再利用相同类型元素的算法。使用key，它会基于key的变化重新排列元素顺序，并且会移除key不存在的元素。     

#### ref

+ 预期：`string`   

`ref` 被用来给元素或子组件注册引用信息。引用信息将会注册在父组件的 `$refs` 对象上。如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素; 如果用在子组件上，引用就指向组件实例。      


#### slot

+ 预期：`string`    

用于标记往哪个slot中插入子组件内容。    

#### is

+ 预期：`string`

用于动态组件且基于DOM 内模板到限制来工作。    

```html
<!-- component changes when currentView changes -->
<component v-bind:is="currentView"></component>
<!-- necessary because `<my-row>` would be invalid inside -->
<!-- a `<table>` element and so would be hoisted out      -->
<table>
  <tr is="my-row"></tr>
</table>
```     

## 内置的组件

#### component

+ Props:
  - `is`: `string | ComponentDefinition | ComponentConstructor`
  - `inline-template` - `boolean`   

渲染一个“元组件”为动态组件。依 is 的值，来决定哪个组件被渲染。     

#### transition

略。    

#### transition-group

略。    

#### keep-alive

+ Props:
  - `include` - 字符串或正则表达式。只有匹配的组件会被缓存。
  - `exclude` - 字符串或正则表达式。任何匹配的组件都不会被缓存。


`<keep-alive>` 包裹动态组件是，会缓存不活动的组件实例，而不是销毁它们。    

`include` 和 `exclude` 属性允许组件有条件地缓存。二者都可以用逗号分隔字符串、正则表达式或一个数组来表示:    

```html
<!-- 逗号分隔字符串 -->
<keep-alive include="a,b">
  <component :is="view"></component>
</keep-alive>
<!-- 正则表达式 (使用 `v-bind`) -->
<keep-alive :include="/a|b/">
  <component :is="view"></component>
</keep-alive>
<!-- 数组 (使用 `v-bind`) -->
<keep-alive :include="['a', 'b']">
  <component :is="view"></component>
</keep-alive>
```    

匹配首先检查组件自身的 `name` 选项，如果 `name` 选项不可用，则匹配它的局部注册名称（父组件 `components` 选项的键值）。匿名组件不能被匹配。     

`<keep-alive>` 不会在函数式组件中正常工作，因为它们没有缓存实例。     

#### slot

+ Props
  - `name` `string` 用于命名插槽。    






