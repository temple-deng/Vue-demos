# 组件的内容
<!-- TOC -->

- [组件](#组件)
  - [使用组件](#使用组件)
    - [注册](#注册)
    - [局部注册](#局部注册)
    - [DOM 模板解析说明](#dom-模板解析说明)
    - [data 必须是函数](#data-必须是函数)
  - [Prop](#prop)
    - [使用 Prop 传递数据](#使用-prop-传递数据)
    - [camelCase vs. kebab-case](#camelcase-vs-kebab-case)
    - [动态 Prop](#动态-prop)
    - [单向数据流](#单向数据流)
    - [Prop 验证](#prop-验证)
  - [非 Prop 属性](#非-prop-属性)
  - [自定义事件](#自定义事件)
    - [使用 `v-on` 绑定自定义事件](#使用-v-on-绑定自定义事件)
    - [给组件绑定原生事件](#给组件绑定原生事件)
    - [.sync 修饰符](#sync-修饰符)
    - [定制组件的 `v-model`](#定制组件的-v-model)
  - [使用 Slot 分发内容](#使用-slot-分发内容)
    - [编译作用域](#编译作用域)
    - [单个 Slot](#单个-slot)
    - [具名 Slot](#具名-slot)
    - [作用域插槽](#作用域插槽)
  - [动态组件](#动态组件)
    - [keep-alive](#keep-alive)
  - [杂项](#杂项)
    - [子组件索引](#子组件索引)
    - [异步组件](#异步组件)
    - [高级异步组件](#高级异步组件)
    - [内联模板](#内联模板)
    - [X-Templates](#x-templates)

<!-- /TOC -->

## 组件

### 使用组件

#### 注册

注册一个全局组件，使用 `Vue.component(tagName, options)`:    

```js
Vue.component('my-component', {
  // options
});
```    

组件在注册之后，便可以在父实例的模块中以自定义元素 `<my-component></my-component>` 的形式使用，那么全局的组件，肯定是所有实例都可以使用了。不过需要确保在初始化根实例之前注册组件。     

#### 局部注册

```js
var Child = {
  template: '<div>A custom component!</div>'
}
new Vue({
  // ...
  components: {
    // <my-component> 将只在父模板可用
    'my-component': Child
  }
})
```    

#### DOM 模板解析说明

当使用 DOM 作为模版时 (例如，将 `el` 选项挂载到一个已存在的元素上，这个应该是这个样子吧，组件会使用 `el` 元素当模板？), 你会受到 HTML 的一些限制，因为 Vue 只有在浏览器解析和标准化 HTML 后才能获取模版内容。尤其像这些元素 `<ul>`，`<ol>`，`<table>`，`<select>` 限制了能被它包裹的元素，而一些像 `<option>` 这样的元素只能出现在某些其它元素内部。    

在自定义组件中使用这些受限制的元素时会导致一些问题，例如：    

```html
<table>
  <my-row>...</my-row>
</table>
```    

自定义组件 `<my-row>` 被认为是无效的内容，因此在渲染的时候会导致错误。变通的方案是使用特殊的 `is` 属性：    

```html
<table>
  <tr is="my-row"></tr>
</table>
```    

不过需要注意的是，当使用以下来源的字符串模板时，这些限制就不适用了：    

+ `<script type="text/x-template">`
+ JS 内联的模板字符串
+ `.vue` 组件。    

#### data 必须是函数

准确的来说应该是一个返回一个对象的函数。    

### Prop

#### 使用 Prop 传递数据   

要让子组件使用父组件的数据，我们需要通过子组件的 props 选项。     

```js
Vue.component('child', {
  props: [ 'message' ],
  template: '<span> {{ message }} </span>'
})
```    

#### camelCase vs. kebab-case

HTML 属性是不区分大小写的。所有，当使用的不是字符串模板，驼峰式命名的 prop 需要转换为相对的
短横线命名：    

```js
Vue.component('child', {
  // camelCase in JavaScript
  props: ['myMessage'],
  template: '<span>{{ myMessage }}</span>'
})
```    

```html
<!-- kebab-case in HTML -->
<child my-message="hello!"></child>
```   

如果你使用字符串模版，则没有这些限制。     

看情况 Vue 中的模板可以分为两类，一类应该是使用 `el` 选项的元素作为模板，这个应该叫做 DOM 模板，因为 `el` 就是在 HTML 文档中的原因吧，
另一类叫字符串模板，上面提到了有 3 种来源。    

其实 Vue 的核心还是模板，通常来说，如果一个 Vue 实例有 `el` 选项，没有 `template` 选项，应该是使用 `el` 指定的元素作为模板，
如果两个都出现的话，貌似也是 `el` 的优先级高。   

#### 动态 Prop

在模板中，如果想要将子模板的 props 绑定到动态地父组件的数据上，要使用 `v-bind` 指令。    

```html
<div>
  <input v-model="parentMsg">
  <br />
  <child :my-message="parentMsg"></child>
</div>
```    

#### 单向数据流

prop 是单向绑定的：当父组件的属性变化时，将传导给子组件，但是不会反过来。理论上来说我们不应该在子组件内部改变 prop。如果这么做，Vue 会在控制台给出警告。    

#### Prop 验证

要指定验证规格，需要用对象的形式，而不是一个字符串数组：    

```js
Vue.component('example', {
  props: {
    // 基础类型检测，null 的意思是任何类型都可以
    propA: Number,
    // 多种类型
    propB: [String, Number],
    // 必传，且必须是字符串
    propC: {
      type: String,
      required: true
    },
    // 数字，有默认值
    propD: {
      type: Number,
      default: 100
    },
    // 数组/对象的默认值应该由一个工厂函数返回
    propE: {
      type: Object,
      default: function() {
        return {
          message: 'Hello'
        }
      }
    },
    // 自定义验证函数
    propF: {
      validator: function(value) {
        return value > 10
      }
    }
  }
});
```    

`type` 可以是如下值表示原生的类型：    

+ String
+ Number
+ Boolean
+ Object
+ Function
+ Array
+ Symbol    

`type` 也可以是一个自定义构造器函数，使用 `instanceof` 检测。    

当 prop 验证失败，Vue 会在抛出警告 (如果使用的是开发版本)。注意 `props` 会在组件实例创建之前进行校验，所以在 `default` 或 `validator` 函数里，
诸如 `data`、`computed` 或 `methods` 等实例属性还无法使用。     

### 非 Prop 属性

所谓非 `prop` 属性，就是可以直接传入组件，而不需要定义相应的 `prop`。      

组件可以接收任意传入的属性，这些属性都会被添加到组件的根元素上。   

不过需要注意的是，如果传入的属性与组件根元素上的属性重名了，除了 `class` 和 `style` 属性是采用合并的操作，其他的都是直接替换。    

### 自定义事件

#### 使用 `v-on` 绑定自定义事件

每个 Vue 实例都实现了 Event Interface，即：    

+ 使用 `$on(eventName)` 监听事件
+ 使用 `$emit(eventName)` 触发事件     

另外父组件可以在使用子组件的地方直接用 `v-on` 来监听子组件触发的事件。也就是说上面的 `$on()` 只能监听组件自身的事件，子组件的事件要在模板中用
`v-on` 绑定。联想一下 React 中并没有自定义事件的概念，所谓的事件处理代码是将代码定义在高层组件的方法中，然后将方法通过 prop 向下传递，然后子组件
直接调用传递下来的方法。     

```html
  <div id="app-9" class="sec">
    <div>自定义事件</div>
    <p>{{ total }}</p>
    <button-counter v-on:increment="incrementTotal"></button-counter>
    <button-counter v-on:increment="incrementTotal"></button-counter>
  </div>
```    

```js
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
})
```   

#### 给组件绑定原生事件

有时候，我们可能想在某个组件的根元素上监听一个原生事件。可以使用 `.native` 修饰 `v-on`:    

`<my-component v-on:click.native="doTheThing"></my-component>`     

#### .sync 修饰符

`.sync` 是一个编译时的语法糖，它会被扩展为一个自动更新父组件属性的 `v-on` 监听器。    

`<comp :foo.sync="bar"></comp>`    

会被扩展为：    

`<comp :foo="bar" @update:foo="val => bar = val"></comp>`    

当子组件需要更新 `foo` 的值时，需要显示地触发一个更新事件：    

`this.$emit('update:foo', newValue)`      

注意上面这个事件的写法，之前是没见过的，有点像命名空间的意思，但意思上貌似
是专指更新 prop 的名字，同理 `$emit` 的第二个参数，是一个传入自定义事件参数。这样的话，子组件更新 props 应该是建议直接通过这种方式。     

#### 定制组件的 `v-model`   

默认情况下，一个组件的 `v-model` 会使用 `value` 属性和 `input` 事件，但是诸如单选框、复选框之类的输入类型可能把 `value` 属性用作了别的目的。`model` 选项可以回避这样的冲突：    

```js
Vue.component('my-checkbox', {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: Boolean,
    // this allows using the `value` prop for a different purpose
    value: String
  },
  // ...
})
```   

`<my-checkbox v-model="foo" value="some value"></my-checkbox>`    

上面代码等价于：    

```html
<my-checkbox
  :checked="foo"
  @change="val => { foo = val }"
  value="some value">
</my-checkbox>
```    

### 使用 Slot 分发内容

#### 编译作用域

假定模板为：   

```html
<child>
  {{ message }}
</child>
```   

`message` 会绑定到父组件的数据。简单来说，组件的作用域是：父组件模板的内容在父组件作用域内编译，子组件模板的内容在子组件作用域内编译。因此到底是哪个组件的模板需要非常注意。   

#### 单个 Slot

除非子组件模板本身包含至少一个 `<slot>` 插口，否则父组件的内容将会被丢弃，个人感觉，这个父组件的内容是指位于子组件开闭标签之间的内容。但子组件模板只有一个没有属性的 slot 时，父组件整个内容片段将插入到 slot 所在的 DOM 位置，并替换掉 slot 标签本身。    

最初在 `<slot>` 标签中的任何内容被视为备用内容。备用内容在子组件的作用域内编译，并且只有在宿主元素为空，且没有要插入的内容时才显示备用内容。   

假定 `my-component` 模板如下：   

```html
<div>
  <h2>我是子组件的标题</h2>
  <slot>
    只有在没有要分发的内容时才会显示。
  </slot>
</div>
```    

父组件模板：    

```html
<div>
  <h1>我是父组件的标题</h1>
  <my-component>
    <p>这是一些初始内容</p>
    <p>这是更多的初始内容</p>
  </my-component>
</div>
```   

渲染结果为：    

```html
<div>
  <h1>我是父组件的标题</h1>
  <div>
    <h2>我是子组件的标题</h2>
    <p>这是一些初始内容</p>
    <p>这是更多的初始内容</p>
  </div>
</div>
```    

#### 具名 Slot

`<slot>` 元素可以用一个特殊的属性 `name` 来配置如何分发内容。多个 slot 可以有不同的名字。具名 slot 将匹配内容片段中有对应 `slot` 属性的元素。   

仍然可以有一个匿名 slot，它是默认 slot，作为找不到匹配的内容片段的备用插槽。如果没有默认的 slot，这些找不到匹配的内容片段将被抛弃。    

假设 `app-layout` 组件模板如下：    

```html
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```    

父组件模板：    

```html
    <app-layout>
      <h1 slot="header">这是首部的内容</h1>

      <p>这是一段内容</p>
      <p>这是另一段内容</p>

      <h1 slot="footer">这是尾部的内容</h1>

      <p>这是第三段内容</p>
    </app-layout>
```    

渲染结果为：    

```html
<div class="container">
  <header>
    <h1>这是首部的内容</h1>
  </header>
  <main>
    <p>这是一段内容</p>
    <p>这是另一段内容</p>
    <p>这是第三段内容</p>
  </main>
  <footer>
    <h1>这是尾部的内容</h1>
  </footer>
</div>
```   

#### 作用域插槽

作用域插槽是一种特殊类型的插槽，用作使用一个 (能够传递数据到) 可重用模板替换已渲染元素。    

在子组件中，只需将数据传递到插槽，就像你将 props 传递给组件一样：    

```html
<div class="child">
  <slot text="hello from child"></slot>
</div>
```   

在父级中，具有特殊属性 `scope` 的 `<template>` 元素必须存在，表示它是作用域插槽的模板。`scope` 的值对应一个临时变量名，此变量接收从子组件中传递的 `props` 对象：   

```html
<div class="parent">
  <child>
    <template scope="props">
      <span>hello from parent</span>
      <span>{{ props.text }}</span>
    </template>
  </child>
</div>
```    

如果我们渲染以上结果，得到的输出会是：    

```html
<div class="parent">
  <div class="child">
    <span>hello from parent</span>
    <span>hello from child</span>
  </div>
</div>
```    

### 动态组件

通过使用保留的 `<component>` 元素，动态地绑定到它的 `is` 属性，我们让多个组件可以使用同一个挂载点，并动态切换：    

```js
var vm = new Vue({
  el: '#example',
  data: {
    currentView: 'home'
  },
  components: {
    home: { /* ... */ },
    posts: { /* ... */ },
    archive: { /* ... */ }
  }
})
```    

```html
<component v-bind:is="currentView">
  <!-- 组件在 vm.currentview 变化时改变！ -->
</component>
```   

#### keep-alive

如果把切换出去的组件保留在内存中，可以保留它的状态或避免重新渲染。为此可以添加一个 `keep-alive` 指令参数：   

```html
<keep-alive>
  <component :is="currentView">
    <!-- 非活动组件将被缓存！ -->
  </component>
</keep-alive>
```    

### 杂项

#### 子组件索引

有时需要在 JS 中直接访问子组件。为此可以使用 `ref` 属性为子组件指定一个索引 ID。例如：   

```html
<div id="parent">
  <user-profile ref="profile"></user-profile>
</div>
```   

```js
var parent = new Vue({ el: '#parent'});

var child = parent.$refs.profile;   
```    

#### 异步组件

在大型应用中，我们可能需要将应用拆分为多个小模块，按需从服务器下载。为了让事情更简单，Vue.js 允许将组件定义为一个工厂函数，动态地解析组件的定义。Vue.js 只在组件需要渲染时触发工厂函数，并且把结果缓存起来，用于后面的再次渲染。例如：   

```js
Vue.component('async-example', function (resolve, reject) {
  setTimeout(function () {
    // Pass the component definition to the resolve callback
    resolve({
      template: '<div>I am async!</div>'
    })
  }, 1000)
})
```    

工厂函数接收一个 `resolve` 回调，在收到从服务器下载的组件定义时调用。也可以调用 `reject(reason)` 指示加载失败。看样子 `resolve` 的参数就是组件的定义对象。    

#### 高级异步组件

自 2.3.0 起，异步组件的工厂函数也可以返回一个如下的对象：   

```js
const AsyncComp = () => ({
  // 需要加载的组件. 应当是一个 Promise
  component: import('./MyComp.vue'),
  // loading 时应当渲染的组件
  loading: LoadingComp,
  // 出错时渲染的组件
  error: ErrorComp,
  // 渲染 loading 组件前的等待时间。默认：200ms.
  delay: 200,
  // 最长等待时间。超出此时间则渲染 error 组件。默认：Infinity
  timeout: 3000
})
```    

#### 内联模板  

如果子组件有 `inline-template` 属性，组件将把它的内容当作它的模板，而不是把它当作分发内容。这让模板更灵活。     

```html
<my-component inline-template>
  <div>
    <p>These are compiled as the component's own template.</p>
    <p>Not parent's transclusion content.</p>
  </div>
</my-component>
```    

#### X-Templates

另一种定义模版的方式是在 JavaScript 标签里使用 text/x-template 类型，并且指定一个 id。例如：   

```html
<script type="text/x-template" id="hello-world-template">
  <p>Hello hello hello</p>
</script>
```   

```js
Vue.component('hello-world', {
  template: '#hello-world-template'
})
```   



