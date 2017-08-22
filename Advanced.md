# 进阶
<!-- TOC -->

- [进阶](#进阶)
  - [深入响应式原理](#深入响应式原理)
    - [如何追踪变化](#如何追踪变化)
    - [变化检测问题](#变化检测问题)
    - [异步更新队列](#异步更新队列)
  - [Render 函数](#render-函数)
    - [基础](#基础)
    - [createElement 参数](#createelement-参数)
      - [深入 data object 参数](#深入-data-object-参数)
      - [约束](#约束)
    - [使用 JS 代替模板功能](#使用-js-代替模板功能)
      - [slots](#slots)
    - [函数化组件](#函数化组件)
  - [自定义指令](#自定义指令)
    - [简介](#简介)
    - [钩子函数](#钩子函数)
    - [钩子函数参数](#钩子函数参数)
    - [函数简写](#函数简写)
  - [混合](#混合)
    - [基础](#基础-1)
    - [选项合并](#选项合并)
    - [全局混合](#全局混合)
    - [自定义选项混合策略](#自定义选项混合策略)
  - [单文件组件](#单文件组件)

<!-- /TOC -->


## 深入响应式原理

### 如何追踪变化

把一个普通 JavaScript 对象传给 Vue 实例的 `data` 选项，Vue 将遍历此对象所有的属性，并使用 `Object.defineProperty` 把这些属性全部转为 getter/setter。    

每个组件实例都有相应的 watcher 实例对象，它会在组件渲染的过程中把属性（这里的属性应该就是指的 `data` 对象的属性）记录为依赖，之后当依赖项的 `setter` 被调用时，会通知 `watcher` 重新计算，从而致使它关联的组件得以更新。     

![reactive](https://cn.vuejs.org/images/data.png)   

### 变化检测问题

受 JS 的限制，Vue 不能检测到对象属性的添加或删除（这里应该是指 `data` 对象上的属性的添加和删除），因为 Vue 只有在初始化实例时才会对属性进行 `getter/setter` 的转化。     

Vue 不允许在已经创建的实例上动态添加新的根级响应式属性(root-level reactive property)。然而它可以使用 `Vue.set(object, key, value)` 方法将响应属性添加到嵌套的对象上：    

`Vue.set(vm.someObject, 'b', 2)`    

还可以使用 `vm.$set` 实例方法，这是全局 `Vue.set()` 的别名：    

`vm.$set(this.someObject, 'b', 2)`    

### 异步更新队列

Vue 是异步执行 DOM 更新的。只要观察到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据改变。如果同一个 watcher 被多次触发，只会一次推入到队列中。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作上非常重要。然后，在下一个的事件循环“tick”中，Vue 刷新队列并执行实际（已去重的）工作。Vue 在内部尝试对异步队列使用原生的 `Promise.then` 和 `MutationObserver`，如果执行环境不支持，会采用 `setTimeout(fn, 0)` 代替。    

为了在数据变化之后等待 Vue 完成更新 DOM ，可以在数据变化之后立即使用 `Vue.nextTick(callback)` 。这样回调函数在 DOM 更新完成后就会调用。例如：    

```js
var vm = new Vue({
  el: '#example',
  data: {
    message: '123'
  }
})
vm.message = 'new message' // 更改数据
vm.$el.textContent === 'new message' // false
Vue.nextTick(function () {
  vm.$el.textContent === 'new message' // true
})
```    

或者使用实例上的 `vm.$nextTick()` 方法。    

## Render 函数

### 基础

Vue 推荐在绝大多数情况下使用 template 来创建你的 HTML。然而在一些场景中，你真的需要 JavaScript 的完全编程的能力，这就是 render 函数，它比 template 更接近编译器。      

其实模板最终也是被编译器编译为 `render()` 函数，貌似与 React 类似，`render()` 函数返回一个实例在内存中的表示对象，这里的话看样子可能叫 VNode。      

```html
<h1>
  <a name="hello-world" href="#hello-world">
    Hello world!
  </a>
</h1>
```   

在 HTML 层，我们决定这样定义组件接口：    

`<anchored-heading v-bind:level="1">Hello world!</anchored-heading>`     

```js
Vue.component('anchored-heading', {
  render: function (createElement) {
    return createElement(
      'h' + this.level,   // tag name 标签名称
      this.$slots.default // 子组件中的阵列
    )
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```    

估计这里的 `this.$slots.default` 指的恰好是 `Hello world!` 字符串。

### createElement 参数

```js
// @returns {VNode}
createElement(
  // {String | Object | Function}
  // 一个 HTML 标签字符串，组件选项对象，或者一个返回值类型为String/Object的函数，必要参数
  'div',
  // {Object}
  // 一个包含模板相关属性的数据对象
  // 这样，您可以在 template 中使用这些属性.可选参数.
  {
    // (详情见下一节)
  },
  // {String | Array}
  // 子节点 (VNodes)，由 `createElement()` 构建而成，
  // 或简单的使用字符串来生成“文本结点”。可选参数。
  [
    '先写一些文字',
    createElement('h1', '一则头条'),
    createElement(MyComponent, {
      props: {
        someProp: 'foobar'
      }
    })
  ]
)
```   

#### 深入 data object 参数

有一件事要注意：正如在模板语法中，`v-bind:class` 和 `v-bind:style` ，会被特别对待一样，在 VNode 数据对象中，下列属性名是级别最高的字段。该对象也允许你绑定普通的 HTML 特性，就像 DOM 属性一样，比如 `innerHTML` (这会取代 `v-html` 指令)。    

```js
{
  // 和`v-bind:class`一样的 API
  'class': {
    foo: true,
    bar: false
  },
  // 和`v-bind:style`一样的 API
  style: {
    color: 'red',
    fontSize: '14px'
  },
  // 正常的 HTML 特性
  attrs: {
    id: 'foo'
  },
  // 组件 props
  props: {
    myProp: 'bar'
  },
  // DOM 属性
  domProps: {
    innerHTML: 'baz'
  },
  // 事件监听器基于 `on`
  // 所以不再支持如 `v-on:keyup.enter` 修饰器
  // 需要手动匹配 keyCode。
  on: {
    click: this.clickHandler
  },
  // 仅对于组件，用于监听原生事件，而不是组件内部使用 `vm.$emit` 触发的事件。
  nativeOn: {
    click: this.nativeClickHandler
  },
  // 自定义指令. 注意事项：不能对绑定的旧值设值
  // Vue 会为您持续追踪
  directives: [
    {
      name: 'my-custom-directive',
      value: '2',
      expression: '1 + 1',
      arg: 'foo',
      modifiers: {
        bar: true
      }
    }
  ],
  // Scoped slots in the form of
  // { name: props => VNode | Array<VNode> }
  scopedSlots: {
    default: props => createElement('span', props.text)
  },
  // 如果组件是其他组件的子组件，需为 slot 指定名称
  slot: 'name-of-slot',
  // 其他特殊顶层属性
  key: 'myKey',
  ref: 'myRef'
}
```    

#### 约束

VNodes 必须唯一。    

组件树中的所有 VNodes 必须是唯一的。这意味着，下面的 render function 是无效的：    

```js
render: function (createElement) {
  var myParagraphVNode = createElement('p', 'hi')
  return createElement('div', [
    // 错误-重复的VNodes
    myParagraphVNode, myParagraphVNode
  ])
}
```    

如果你真的需要重复很多次的元素/组件，你可以使用工厂函数来实现。例如，下面这个例子 render 函数完美有效地渲染了 20 个重复的段落：    

```js
render: function (createElement) {
  return createElement('div',
    Array.apply(null, { length: 20 }).map(function () {
      return createElement('p', 'hi')
    })
  )
}
```    

### 使用 JS 代替模板功能

首先 render 函数里没有 `v-if` 和 `v-for`，也没有 `v-model`。    

#### slots

可以从 `this.$slots` 中获取 VNodes 列表中的静态内容。还可以从 `this.$scopedSlots 中获取作用域插槽，这个函数返回 VNodes:   

```js
render: function (createElement) {
  // `<div><slot :text="msg"></slot></div>`
  return createElement('div', [
    this.$scopedSlots.default({
      text: this.msg
    })
  ])
}
```    

### 函数化组件

在这个例子中，我们标记组件为 `functional`，这意味着它是无状态的（没有 `data`）这就清楚了， React里的 state 对应于 Vue 的 `data`，无实例（没有
`this` 上下文）。   

```js
 Vue.component('my-component', {
  functional: true,
  // 为了弥补缺少的实例
  // 提供第二个参数作为上下文
  render: function (createElement, context) {
    // ...
  },
  // Props 可选
  props: {
    // ...
  }
})
```    

组件需要的一切都是通过上下文传递，包括：    

+ `props`: 提供 props 的对象
+ `children`: VNode 子节点的数组
+ `slots`: slots 对象
+ `data`: 传递给组件的 data 对象
+ `parent`: 对父组件的引用
+ `listeners`: 一个包含了组件上所注册的 `v-on` 侦听器的对象。
+ `injections`: 如果使用了 `inject` 选项，则该对象包含了应当被注入的属性   


## 自定义指令

### 简介

注册一个自定义指令，可以让 `input` 元素自动获取焦点。    

```js
Vue.directive('focus', {
  // 当绑定元素插入到 DOM 中
  inserted: function(el) {
    el.focus()
  }
});
```    

也可以注册局部指令，组件接收一个 `directives` 选项：   

```js
directives: {
  focus: {
    inserted: function() {
      // ...
    }
  }
}
```   

接下来就可以在模板中使用 `v-focus` 属性了： `<input v-focus>`。    

### 钩子函数

指令定义函数提供了几个钩子函数（可选）：    

+ `bind`: 只调用一次，指令第一次绑定到元素时调用，用这个钩子定义一个在绑定时执行一次的初始化动作。
+ `inserted`: 被绑定元素插入父节点时调用。
+ `update`: 所在组件的 VNode 更新时调用。
+ `componentUpdated`: 所在组件的 VNode 及其孩子的 VNode 全部更新时调用。
+ `unbind`: 只调用一次，指令与原始解绑时调用。    

### 钩子函数参数

钩子函数被赋予以下参数：   

+ `el`: 指令所绑定的元素，可以用来直接操作 DOM。
+ `binding`: 一个对象，包含以下属性：   
  - `name`: 指令名，不包括 `v-` 前缀
  - `value`: 指令的绑定值，例如 `v-my-directive="1+1"`，value的值是2.
  - `oldValue`: 指令绑定的前一个值，仅在 `update` 和 `componentUpdated` 钩子中可用。
  - `expression`: 绑定值的字符串形式。例如 `v-my-directive="1+1"`，值为 `"1+1"`。
  - `arg`: 传给指令的参数
  - `modifiers`: 一个包含修饰符的对象，例如 `v-my-directive.foo.bar`,修饰符对象是 `{ foo: true, bar: true}`。    
+ `vnode`: Vue 编译生成的虚拟节点
+ `oldVnode`: 上一个虚拟节点，仅在 `update` 和 `componentUpdated` 钩子中可用。    

### 函数简写

大多数情况下，我们可能想在 bind 和 update 钩子上做重复动作，并且不想关心其它的钩子函数。可以这样写:   

```js
Vue.directive('color-swatch', function (el, binding) {
  el.style.backgroundColor = binding.value
})
```   

## 混合

### 基础

混合 (mixins) 是一种分发 Vue 组件中可复用功能的非常灵活的方式。混合对象可以包含任意组件选项。以组件使用混合对象时，所有混合对象的选项将被混入该组件本身的选项。   

```js
// 定义一个混合对象
var myMixin = {
  created: function () {
    this.hello()
  },
  methods: {
    hello: function () {
      console.log('hello from mixin!')
    }
  }
}
// 定义一个使用混合对象的组件
var Component = Vue.extend({
  mixins: [myMixin]
})
var component = new Component() // -> "hello from mixin!"
```    

### 选项合并

当组件和混合对象含有同名选项时，这些选项将以恰当的方式混合。比如，同名钩子函数将混合为一个数组，因此都将被调用。另外，混合对象的 钩子将在组件自身钩子 之前 调用    

```js
var mixin = {
  created: function () {
    console.log('混合对象的钩子被调用')
  }
}
new Vue({
  mixins: [mixin],
  created: function () {
    console.log('组件钩子被调用')
  }
})
// -> "混合对象的钩子被调用"
// -> "组件钩子被调用"
```   

值为对象的选项，例如 `methods`, `components` 和 `directives`，将被混合为同一个对象。 两个对象键名冲突时，取组件对象的键值对。   

### 全局混合

也可以全局注册混合对象。 注意使用！ 一旦使用全局混合对象，将会影响到 所有 之后创建的 Vue 实例。使用恰当时，可以为自定义对象注入处理逻辑。    

```js
// 为自定义的选项 'myOption' 注入一个处理器。 
Vue.mixin({
  created: function () {
    var myOption = this.$options.myOption
    if (myOption) {
      console.log(myOption)
    }
  }
})
new Vue({
  myOption: 'hello!'
})
// -> "hello!"
```   

### 自定义选项混合策略

自定义选项将使用默认策略，即简单地覆盖已有值。 如果想让自定义选项以自定义逻辑混合，可以向 Vue.config.optionMergeStrategies 添加一个函数：   

```js
Vue.config.optionMergeStrategies.myOption = function (toVal, fromVal) {
  // return mergedVal
}
```   

## 单文件组件

在很多Vue项目中，我们使用 `Vue.component` 来定义全局组件，紧接着用 `new Vue({ el: '#container '})` 在每个页面内指定一个容器元素。    

这种方式在很多中小规模的项目中运作的很好，在这些项目里 JavaScript 只被用来加强特定的视图。但当在更复杂的项目中，或者你的前端完全由 JavaScript 驱动的时候，下面这些缺点将变得非常明显：    

+ 全局定义强制要求每个 component 中的命名不得重复
+ 字符串模板缺乏语法高亮
+ 不支持 CSS
+ 没有构建步骤限制只能使用 HTML 和 ES5 JavaScript, 而不能使用预处理器，如 Pug (formerly Jade) 和 Babel。     

这是一个文件名为 `Hello.vue` 的单文件组件：    

![vue](https://cn.vuejs.org/images/vue-component.png)    


$E=mc^2$    

$$\sum_{i=1}^n a_i=0$$   