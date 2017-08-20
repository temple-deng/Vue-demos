# 基础
<!-- TOC -->

- [介绍](#介绍)
  - [声明式渲染](#声明式渲染)
  - [条件与循环](#条件与循环)
  - [处理用户交互](#处理用户交互)
  - [组件化应用构建](#组件化应用构建)
- [Vue 实例](#vue-实例)
  - [构造器](#构造器)
  - [属性与方法](#属性与方法)
  - [实例声明周期](#实例声明周期)
  - [生命周期图示](#生命周期图示)
- [模板语法](#模板语法)
  - [插值](#插值)
    - [文本](#文本)
    - [纯HTML](#纯html)
    - [特性](#特性)
    - [使用表达式](#使用表达式)
  - [指令](#指令)
    - [参数](#参数)
    - [修饰符](#修饰符)
  - [过滤器](#过滤器)
  - [缩写](#缩写)
- [计算属性](#计算属性)
  - [计算属性](#计算属性-1)
    - [基础例子](#基础例子)
    - [计算属性 vs Methods](#计算属性-vs-methods)
    - [计算属性 vs Watched 属性](#计算属性-vs-watched-属性)
    - [计算 setter](#计算-setter)
- [Class 与 Style 绑定](#class-与-style-绑定)
  - [绑定 Class](#绑定-class)
    - [对象语法](#对象语法)
    - [数组语法](#数组语法)
    - [用在组件上](#用在组件上)
  - [绑定内联样式](#绑定内联样式)
    - [对象语法](#对象语法-1)
    - [数组语法](#数组语法-1)
    - [自动添加前缀](#自动添加前缀)
- [条件渲染](#条件渲染)
  - [v-if](#v-if)
    - [配合 `<template>` 条件渲染多个元素](#配合-template-条件渲染多个元素)
    - [v-else-if](#v-else-if)
    - [用 `key` 管理可复用的元素](#用-key-管理可复用的元素)
  - [v-show](#v-show)
  - [v-if vs v-show](#v-if-vs-v-show)
- [列表渲染](#列表渲染)
  - [v-for](#v-for)
    - [基本语法](#基本语法)
    - [Template v-for](#template-v-for)
    - [对象迭代 v-for](#对象迭代-v-for)
    - [整数迭代 v-for](#整数迭代-v-for)
  - [key](#key)
  - [数组更新检测](#数组更新检测)
- [事件处理器](#事件处理器)
  - [监听事件](#监听事件)
  - [事件修饰符](#事件修饰符)
  - [键值修饰符](#键值修饰符)
  - [修饰键](#修饰键)
- [表单控件绑定](#表单控件绑定)
  - [基础用法](#基础用法)
    - [多行文本](#多行文本)
    - [复选框](#复选框)
    - [单选按钮](#单选按钮)
  - [绑定 Value](#绑定-value)
  - [修饰符](#修饰符-1)
    - [lazy](#lazy)
    - [number](#number)
    - [trim](#trim)

<!-- /TOC -->   


## 介绍

### 声明式渲染

Vue.js 的核心是一个允许采用简洁的模板语法来声明式的将数据渲染进 DOM：   

```html
<div id="app">
  {{ message }}
</div>
```    

```js
var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello World!'
  }
})  
```   

除了绑定元素内容的文本值。还可以绑定 DOM 元素的属性：   

```html
<div id="app-2">
  <span v-bind:title="message">
    鼠标悬停几秒钟查看此处动态绑定的提示信息！
  </span>
</div>
```   

```js
var app2 = new Vue({
  el: 'app-2',
  data: {
    message: 'This is the span element"s title'
  }
})
```    

### 条件与循环

条件渲染：   

```html
<div id="app-3">
  <p v-if="seen">Now you can see me!</p>
</div>
```   

```js
var app3= new Vue({
  el: '#app-3',
  data: {
    seen: true
  }
})
```   

这个例子表示我们不仅可以绑定 DOM 文本及属性到数据，设置还可以绑定 DOM 的结构到数据。   

循环渲染，注意 `v-for` 指令应该是卸载需要重复的元素的属性中：   

```html
  <div id="app-4">
    <ul>
      <li v-for="todo in todos">
        {{ todo.name }}
      </li>
    </ul>
  </div>
```   

```js
const app4 = new Vue({
  el: '#app-4',
  data: {
    todos: [
      { name: 'item1' },
      { name: 'item2' },
      { name: 'item3' }
    ]
  }
})
```    

### 处理用户交互

`v-on` 指令绑定事件监听器，这个事件监听器貌似可以是语句，或者是一个函数的引用，这个函数应该是 Vue 实例中 `methods` 中定义的方法：   

```html
<div id="app-5">
  <p> {{ message }} </p>
  <button v-on:click="reverseMessage">click to reverse the message!</button>
</div>
```   

```js
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
})
```    

`v-model` 指令，实现表单输入与数据之间的双向绑定：    

```html
<div id="app-6">
    <input type="text" v-model="message" placeholder="input your name" />
    <div> {{ message }} </div>
</div>
```   

```js
const app6 = new Vue({
  el: '#app-6',
  data: {
    message: ''
  }
})
```   

推测应该会将 `message` 数据装换为字符串，因此只有在字符串转换后是空串的时候才会显示 `placeholder` 的内容。   

### 组件化应用构建

在 Vue 中，一个组件本质上是一个拥有预定义选项的一个 Vue 实例，也就是说组件本身也是 Vue 实例，在 Vue 中注册组件：   

```js
// 定义名为 todo-item 的新组件
Vue.component('todo-item', {
  template: '<li>这是个待办项</li>'
})
```   

现在可以用它构建另一个组件模板：   

```html
<ol>
  <!-- 创建一个 todo-item 组件的实例 -->
  <todo-item></todo-item>
</ol>
```   

我们应该能将数据从父作用域传到子组件。让我们来修改一下组件的定义，使之能够接受一个属性：    

```js
Vue.component('todo-item', {
  // todo-item 组件现在接受一个
  // "prop"，类似于一个自定义属性
  // 这个属性名为 todo。
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
})
```   

使用 `v-bind` 指令将 `todo` 传到每一个重复的组件中：   

```html
<div id="app-7">
  <ol>
    <!--
      现在我们为每个 todo-item 提供 todo 对象
      todo 对象是变量，即其内容可以是动态的。
      我们也需要为每个组件提供一个“key”，晚些时候我们会做个解释。
    -->
    <todo-item
      v-for="item in groceryList"
      v-bind:todo="item"
      v-bind:key="item.id">
    </todo-item>
  </ol>
</div>
```   

```js
Vue.component('todo-item', {
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
})
var app7 = new Vue({
  el: '#app-7',
  data: {
    groceryList: [
      { id: 0, text: '蔬菜' },
      { id: 1, text: '奶酪' },
      { id: 2, text: '随便其他什么人吃的东西' }
    ]
  }
})
```   

注意可能只有是父级需要传递给的数据需要使用 `props` 指出，普通的属性应该不用。而且貌似不在 `props` 中的属性会出现在最终的 HTML 文档中元素的属性上。    

## Vue 实例

### 构造器

每个 Vue.js 应用都是通过构造函数 `Vue` 创建一个 **Vue 的根实例** 启动的（其实根实例也是一个普通的实例，无非根实例是作为应用的起始点而已吧）：  

```js
var vm = new Vue({
  // ....
})   
```   

在实例化一个 Vue 实例时，需要传入一个选项对象，它可以包含数据、模板、挂载元素、方法、生命周期钩子等选项。   

还可以扩展 `Vue` 构造器，从而用预定义选项创建可复用的组件构造器：   

```js
var MyComponent = Vue.extend({
  // 扩展选项
})

// 所有的 'MyComponent' 实例都将以预定义的扩展选项被创建
var myComponentInstance = new MyComponent();
```   

尽管可以命令式地创建扩展实例，不过在多数情况下建议将组件构造器注册为一个自定义元素，然后声明式地用在模板中。所有的 Vue.js 组件其实都是被扩展的 Vue 实例。    

这里所谓的组件构造器其实相当于一个 Vue 类的子类吧，包含了一些预定义的共享的内容，所谓的将组件构造器注册为自定义元素就是之前提到的用 `Vue.component` 注册组件吧。   

也就是说两种创建组件的方式，一种上面的命令式 `Vue.extend` 出一个组件类，然后使用 `new` 操作符实例化一个组件实例，或者使用 `Vue.component` 注册组件，然后在模板中声明式的使用组件。并且所有的组件实例均是 Vue 实例。   

```js
var Vm = Vue.extend();

var vm = new Vm();

console.log(vm instanceof Vue)  // true
```   

### 属性与方法

每个 Vue 实例都会代理其 `data` 对象里所有的属性：   

```js
var data = { a: 1 }
var vm = new Vue({
  data: data
})
vm.a === data.a // -> true
// 设置属性也会影响到原始数据
vm.a = 2
data.a // -> 2
// ... 反之亦然
data.a = 3
vm.a // -> 3
```   

注意只有这些被代理的属性是响应的，也就是说值的任何改变都是触发视图的重新渲染。如果在实例创建之后添加新的属性到实例上，它不会触发视图更新。   

除了 `data` 属性， Vue 实例暴露了一些有用的实例属性与方法。这些属性与方法都有前缀 `$`，以便与代理的 `data` 属性区分。例如：   

```js
var data = { a: 1};
var vm = new Vue({
  el: '#example',
  data: data
});

vm.$data === data // true
vm.$el = document.getElementById('example'); // true

vm.$watch('a', function(newVal, oldVal) {
  // 这个回调会在 'vm.a' 改变后调用
})
```   

### 实例声明周期

每个 Vue 实例在被创建之前都要经过一系列的初始化过程。例如，实例需要配置数据观测(data observer)、编译模版、挂载实例到 DOM ，然后在数据变化时更新 DOM 。在这个过程中，实例也会调用一些 生命周期钩子 ，这就给我们提供了执行自定义逻辑的机会。例如，`created` 这个钩子在实例被创建之后被调用：   

```js
const app = new Vue({
  el: '#app',
  data: {
    todos: [ 
      { id: 0, text: 'this is the item 0' },
      { id: 1, text: 'this is the item 1' },
      { id: 2, text: 'this is the item 2' }
    ]
  },
  created: function() {
    console.log('created!')
  }
})
```    

### 生命周期图示

![lifycycle](https://cn.vuejs.org/images/lifecycle.png)   

注意其实图里有一处有问题的地方，不是说只有 `new Vue()` 创建的实例才有生命周期，组件也是有的。   

看图的意思可能是这样子的，所有的 Vue 实例都会先找到挂载到的 `el` 元素，这时候应该是创建一个 `el` 元素副本，然后根据 `template` 选项的有无，看是直接将模板编译到渲染函数中，还是将 `el` 的 `outerHTML` 编译到渲染函数中，之后就是挂载的流程了，应该会用 `el` 的副本替换掉 `el` 元素，并删除一个 Vue 相关的指令之类的东西。    

老是说图中的将模板编译进 render 函数及将 `el` 编译成模板是什么意思不是很理解。    

## 模板语法

Vue.js 使用了基于 HTML 的模板语法，允许开发者声明式地将 DOM 绑定至底层 Vue 实例的数据。所有 Vue.js 的模板都是合法的 HTML ，所以能被遵循规范的浏览器和 HTML 解析器解析。在底层的实现上， Vue 将模板编译成虚拟 DOM 渲染函数。    

### 插值

#### 文本

使用双大括号来在模板中进行文本插值：    

`<span> {{ msg }} </span>`    

使用 `v-once` 指令可以进行一次性地插值，即当数据随后改变时，插值处的内容不会获取更新。    

`<span v-once> {{ msg }}</span>`    

#### 纯HTML

双大括号会将数据解释为纯文本，而非 HTML。为了输出 HTML，使用 `v-html` 指令：    

`<div v-html="rawHtml"></div>`    

这个 `div` 的内容会被替换成属性值 `rawHtml`，直接作为HTML————会忽略解析属性值中的数据绑定。     

#### 特性

注意这里说的特性应该是指 HTML 属性，因为双大括号语法不能用在属性中，这时必须使用 `v-bind` 命令来让属性与表达式绑定：    

`<div v-bind:id="dynamicId"></div>`    

这同样适用于布尔类特性，如果求值结果是 falsy 的值，则该特性将会被删除：    

`<button v-bind:disabled="isButtonDisabled">Button</button>`    

#### 使用表达式

没什么好说的，不管是双大括号语法还是 `v-bind` 指令，插入的都是表达式的值。但是需要注意的是
这些表达式会在所属 Vue 实例的数据作用域下作为 JavaScript 被解析。模板表达式都被放在沙盒中，只能访问全局变量的一个白名单，如 `Math` 和 `Date` 。你不应该在模板表达式中试图访问用户定义的全局变量。      

### 指令

指令是指带有 `v-` 前缀的特殊属性。     

#### 参数

有的指令可以接收一个“参数”，在指令名称之后以冒号表示。例如，`v-bind` 可以用于响应式地更新 HTML 属性。    

`<a v-bind:href="url"></a>`     

这里的 `href` 就是 `v-bind` 的参数。    

还有一个例子就是 `v-on` 指令，它的参数是要监听的事件：    

`<a v-on:click="doSomething">`     

#### 修饰符

修饰符是以半角句号 `.` 指明的特殊后缀，用于指出一个指令应该以特殊方式绑定。例如，
`.prevent` 修改符告诉 `v-on` 指令对于触发的事件调用 `event.preventDefault()`：    

`<form v-on:submit.prevent="onSubmit"></form>`    

注意修饰符是后缀，如果指令有参数卸载参数的后面。    

### 过滤器

过滤器可以用在两个地方：双大括号插值和 `v-bind` 指令中。过滤器应该添加在 JS 表达式的尾部，由管道符 `|` 指示：   

```html
<!-- in mustaches -->
{{ message | capitalize }}
<!-- in v-bind -->
<div v-bind:id="rawId | formatId"></div>
```   

过滤器函数总接收表达式的值 (之前的操作链的结果) 作为第一个参数。在这个例子中，`capitalize` 过滤器函数将会收到 `message` 的值作为第一个参数。    

```js
new Vue({
  // ...
  filters: {
    capitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  }
})
```    

过滤器可以串联：    

`{{ message | filterA | filterB }} `    

过滤器是 JavaScript 函数，因此可以接收参数：    

`{{ message | filterA('arg1', arg2) }}`   

这个是挺奇怪的，原本以为是传入一个函数的引用，但是却又可以写成函数调用的形式，奇怪。   

这里，`filterA` 被定义为接收三个参数的过滤器函数。其中 `message` 的值作为第一个参数，普通字符串 `'arg1'` 作为第二个参数，表达式 `arg2` 取值后的值作为第三个参数。     

### 缩写

`v-bind` 缩写 `<a :href="url"></a>`    

`v-on` 缩写 `<a @click="doSomething"></a>`    

## 计算属性

### 计算属性

#### 基础例子

```html
  <div id="app-2">
    <div>计算属性</div>
    <div>原始 message: {{ message }} </div>
    <div>逆转后的 message: {{ reverseMessage }} </div>
  </div>
```   

```js
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
})
```   

这里我们声明了一个计算属性 `reverseMessage`。我们提供的函数将用作属性 `app2.reverseMessage` 的 getter 函数。与其说是计算属性，不如说是计算数据。计算属性可以像一个数据值一个在模板中使用。   

#### 计算属性 vs Methods

我们可以将同一函数定义为一个 method 而不是一个计算属性。对于最终的结果，两种方式确实是相同的。然而，不同的是计算属性是基于它们的依赖进行缓存的。计算属性只有在它的相关依赖发生改变时才会重新求值。这就意味着只要 `message` 还没有发生改变，多次访问 `reversedMessage` 计算属性会立即返回之前的计算结果，而不必再次执行函数。    

相比而言，只要发生重新渲染，method 调用总会执行该函数。    

#### 计算属性 vs Watched 属性

略。    

#### 计算 setter

计算属性默认只有 getter，不过也可以提供 setter:   

```js
// ...
computed: {
  fullName: {
    // getter
    get: function () {
      return this.firstName + ' ' + this.lastName
    },
    // setter
    set: function (newValue) {
      var names = newValue.split(' ')
      this.firstName = names[0]
      this.lastName = names[names.length - 1]
    }
  }
}
```    

## Class 与 Style 绑定

当 `v-bind` 用于 `class` 和 `style` 属性时，Vue.js 加强了其功能，表达式的结果类型除了字符串之外，
还可以是对象与数组。     

### 绑定 Class

#### 对象语法

可以给 `v-bind:class` 传一个对象，来动态切换 class:   

`<div v-bind:class="{ active: isActive }"></div>`   

很明显 div 会根据 `isActive` 的值来决定是否含有 `active` 类。`isActive` 应该会被转换为布尔值来进行操作。   

`v-bind:class` 可以同时与 `class` 属性共存：    

```html
<div class="static"
     v-bind:class="{ active: isActive, 'text-danger': hasError }">
</div>
```    

注意如果一个类同时在 `class` 和 `v-bind:class` 的结果值中出现，类名会出现两次。    

甚至可以在 `v-bind:class` 中使用计算属性（毕竟只是一个简单的对象而已）。    

#### 数组语法

可以把一个数组传给 `v-bind:class`：   

`<div v-bind:class="[activeClass, errorClass]">`    

```js
data: {
  activeClass: 'active',
  errorClass: 'text-danger'
}
```    

还可以在数组语法中使用对象语法。    

#### 用在组件上

当你在一个定制的组件上用到 class 属性或者 `v-bind:class` 的时候，这些类将被添加到根元素上面，这个元素上已经存在的类不会被覆盖。也就是说采用的是合并的操作而不是替换。    

```js
Vue.component('my-component', {
  template: '<p class="foo bar">Hi</p>'
})
```   

```html
<my-component class="baz boo"></my-component>
```   

最终渲染成：   

`<p class="foo bar baz boo">Hi</p>`     

### 绑定内联样式

#### 对象语法

属性名可以用驼峰式或者是短横分隔式：    

`<div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>`    

#### 数组语法

数组语法的话其实是传入多个样式对象。    

#### 自动添加前缀

略。   

## 条件渲染

### v-if

`v-if`，`v-else` 指令。    

```html
<h1 v-if="ok">Yes</h1>
<h1 v-else>No</h1>
```    
#### 配合 `<template>` 条件渲染多个元素   

略。   

#### v-else-if

略。    

#### 用 `key` 管理可复用的元素

略。    

### v-show

与 `v-if` 不同的是，`v-show` 的元素始终会被渲染并保留在 DOM 中。 `v-show` 只是简单地切换元素的 `display` CSS 属性。    

*Note:* `v-show` 不支持 `<template>`，也没有 `v-else` 搭配。    

### v-if vs v-show

`v-if` 是“真正的”条件渲染，因为它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建。   

`v-if` 也是惰性的：如果在初始渲染时条件为假，则什么也不做——直到条件第一次变为真时，才会开始渲染条件块。   

相比之下， `v-show` 就简单得多——不管初始条件是什么，元素总是会被渲染，并且只是简单地基于 CSS 进行切换。   

## 列表渲染

`v-for` 指令的值遵从 `item in items` 形式的特殊的语法。`items` 是源数据数组而 `item` 是每轮循环迭代的元素名。    

### v-for

#### 基本语法

`v-for` 支持一个可选的当前项的索引做第二个参数：    

```html
<ul id="example-2">
  <li v-for="(item, index) in items">
    {{ parentMessage }} - {{ index }} - {{ item.message }}
  </li>
</ul>
```     

也可以使用 `of` 替代 `in` 作为分隔符。    

#### Template v-for

同 `v-if` 一样，搭配 `<template>` 来迭代多个元素。    

#### 对象迭代 v-for

还可以用来迭代一个对象。第一个参数键值，第二个参数是键名，第三参数是索引。    

```html
<div v-for="(value, key, index) in object">
  {{ index }}. {{ key }} : {{ value }}
</div>
```    

#### 整数迭代 v-for

`v-for` 也可以取整数，这种情况下，重复多次模板：    

```html
<div>
  <span v-for="n in 10">{{ n }} </span>
</div>
```    

准确的来说是 `items` 的位置可以换成整数。而且注意貌似是从 1 而不是 0开始迭代的。    

### key

这个东西就不说了。    

### 数组更新检测

Vue 包含一组观察数组的变异方法，所以它们也将会触发视图更新。这些方法如下：    

`push(), pop(), shift(), unshift(), splice(), reverse(), sort()`     

## 事件处理器

### 监听事件

```html
<div id="example-1">
  <button v-on:click="counter += 1">增加 1</button>
  <p>这个按钮被点击了 {{ counter }} 次。</p>
</div>
```   

```js
var example1 = new Vue({
  el: '#example-1',
  data: {
    counter: 0
  }
})
```   

这个例子主要是展示了事件处理器可以直接使用表达式。    

### 事件修饰符

`.stop, .prevent, .capture, .self, .once`    

`self` 表示事件应该是在元素自身上触发的，`once` 表示只触发一次的回调。    

### 键值修饰符

当然是针对键盘事件。    

`.enter, .tab, .delete, .esc, .space, .up, .down, .left, .right`。    

还可以通过全局的 `config,keyCodes` 读与写自定义键值修饰符：   

`Vue.config.keyCodes.f1 = 112`    

### 修饰键

暂略。    

## 表单控件绑定

### 基础用法

可以在表单控件元素上使用 `v-model` 指令来创建双向的数据绑定。`v-model` 本质上是语法糖，监听用户的
输入事件并更新数据。     

#### 多行文本

```html
<span>Multiline message is:</span>
<p style="white-space: pre-line">{{ message }}</p>
<br>
<textarea v-model="message" placeholder="add multiple lines"></textarea>
```   

在文本区域插值 `<textarea></textarea>` 并不会生效，使用 `v-model` 代替。   

#### 复选框

单个勾选框的话，应该绑定一个逻辑值。多个勾选框的话，应该绑定一个数组。   

#### 单选按钮

```html
<div id="example-4">
  <input type="radio" id="one" value="One" v-model="picked">
  <label for="one">One</label>
  <br>
  <input type="radio" id="two" value="Two" v-model="picked">
  <label for="two">Two</label>
  <br>
  <span>Picked: {{ picked }}</span>
</div>
```   

```js
new Vue({
  el: '#example-4',
  data: {
    picked: ''
  }
})
```  

这个挺奇怪的，并没有使用相同的 `name` 属性来表示一组单选按钮。    

### 绑定 Value

对于单选按钮 radio，复选框 checkbox 及选择列表 select，`v-model` 绑定的 value 通常是静态字符串：    

```html
<!-- 当选中时，`picked` 为字符串 "a" -->
<input type="radio" v-model="picked" value="a">
<!-- `toggle` 为 true 或 false -->
<input type="checkbox" v-model="toggle">
<!-- 当选中时，`selected` 为字符串 "abc" -->
<select v-model="selected">
  <option value="abc">ABC</option>
</select>
```    

但是有时我们想绑定 value 到 Vue 实例的一个动态属性上，这时可以用 `v-bind` 实现，并且这个属性的值可以不是字符串。也就是说希望表单控件变动时，绑定的值可以是依赖与其他数据的值。    

对于复选框来说：   

```html
<input
  type="checkbox"
  v-model="toggle"
  v-bind:true-value="a"
  v-bind:false-value="b"
>
```   

```js
// 当选中时
vm.toggle === vm.a
// 当没有选中时
vm.toggle === vm.b
```    

对于单选按钮：   

`<input type="radio" v-model="pick" :value="a">`   

对于选择列表：   

```html
<select v-model="selected">
  <option :value="{number:123}">123</option>
</select>
```   

### 修饰符      

#### lazy

默认情况下， `v-model` 是在 `input` 事件中同步数据，但是可以添加 `lazy` 修饰符，改为 `change` 事件同步。      
#### number

将输入值转换 Number 类型。    

#### trim

过滤首尾空格。   














