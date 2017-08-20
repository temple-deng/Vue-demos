
## 开始

使用 Vue.js ，我们已经可以通过组合组件来组成应用程序，当你要把 vue-router 添加进来，我们需要做的是，将组件(components)映射到路由(routes)，然后告诉 vue-router 在哪里渲染它们。下面是个基本例子：    

```html
<div id="app">
  <h1>Hello App!</h1>
  <p>
    <!-- 使用 router-link 组件来导航. -->
    <!-- 通过传入 `to` 属性指定链接. -->
    <!-- <router-link> 默认会被渲染成一个 `<a>` 标签 -->
    <router-link to="/foo">Go to Foo</router-link>
    <router-link to="/bar">Go to Bar</router-link>
  </p>
  <!-- 路由出口 -->
  <!-- 路由匹配到的组件将渲染在这里 -->
  <router-view></router-view>
</div>
```    

```js
// 0. 如果使用模块化机制编程，導入Vue和VueRouter，要调用 Vue.use(VueRouter)

// 1. 定义（路由）组件。
// 可以从其他文件 import 进来
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

// 2. 定义路由
// 每个路由应该映射一个组件。 其中"component" 可以是
// 通过 Vue.extend() 创建的组件构造器，
// 或者，只是一个组件配置对象。
// 我们晚点再讨论嵌套路由。
const routes = [
  { path: '/foo', component: Foo },
  { path: '/bar', component: Bar }
]

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
  routes // （缩写）相当于 routes: routes
})

// 4. 创建和挂载根实例。
// 记得要通过 router 配置参数注入路由，
// 从而让整个应用都有路由功能
const app = new Vue({
  router
}).$mount('#app')

// 现在，应用已经启动了！
```    

## 动态路由匹配

我们经常需要把某种模式匹配到的所有路由，全都映射到同个组件。例如，我们有一个 User 组件，对于所有 ID 各不相同的用户，都要使用这个组件来渲染。那么，我们可以在 vue-router 的路由路径中使用『动态路径参数』（dynamic segment）来达到这个效果：   

```js
const User = {
  template: '<div>User</div>'
}

const router = new VueRouter({
  routes: [
    // 动态路径参数 以冒号开头
    { path: '/user/:id', component: User }
  ]
})
```    

一个『路径参数』使用冒号 : 标记。当匹配到一个路由时，参数值会被设置到 this.$route.params，可以在每个组件内使用。于是，我们可以更新 User 的模板，输出当前用户的 ID：     

```js
const User = {
  template: '<div>User {{ $route.params.id }}</div>'
}
```   

当使用路由参数时，例如从 /user/foo 导航到 user/bar，原来的组件实例会被复用。因为两个路由都渲染同个组件，比起销毁再创建，复用则显得更加高效。不过，这也意味着组件的生命周期钩子不会再被调用。    

## 嵌套路由

一个被渲染组件同样可以包含自己的嵌套 `<router-view>`。例如，在 User 组件的模板添加一个 `<router-view>`：    

```js
const User = {
  template: `
    <div class="user">
      <h2>User {{ $route.params.id }}</h2>
      <router-view></router-view>
    </div>
  `
}
```    

要在嵌套的出口中渲染组件，需要在 VueRouter 的参数中使用 `children` 配置：     

```js
const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User,
      children: [
        {
          // 当 /user/:id/profile 匹配成功，
          // UserProfile 会被渲染在 User 的 <router-view> 中
          path: 'profile',
          component: UserProfile
        },
        {
          // 当 /user/:id/posts 匹配成功
          // UserPosts 会被渲染在 User 的 <router-view> 中
          path: 'posts',
          component: UserPosts
        }
      ]
    }
  ]
})
```     

此时，基于上面的配置，当你访问 /user/foo 时，User 的出口是不会渲染任何东西，这是因为没有匹配到合适的子路由。如果你想要渲染点什么，可以提供一个 空的 子路由：   

```js
const router = new VueRouter({
  routes: [
    {
      path: '/user/:id', component: User,
      children: [
        // 当 /user/:id 匹配成功，
        // UserHome 会被渲染在 User 的 <router-view> 中
        { path: '', component: UserHome },

        // ...其他子路由
      ]
    }
  ]
})
```    

## 编程式导航

### `router.push(location)`

想要导航到不同的 URL，则使用 `router.push` 方法。这个方法会向 history 栈添加一个新的记录，所以，当用户点击浏览器后退按钮时，则回到之前的 URL。当你点击 `<router-link>` 时，这个方法会在内部调用。    

该方法的参数可以是一个字符串路径，或者一个描述地址的对象。例如：    

```js
// 字符串
router.push('home')

// 对象
router.push({ path: 'home' })

// 命名的路由
router.push({ name: 'user', params: { userId: 123 }})

// 带查询参数，变成 /register?plan=private
router.push({ path: 'register', query: { plan: 'private' }})
```    

### `router.replace(location)

跟 router.push 很像，唯一的不同就是，它不会向 history 添加新记录，而是跟它的方法名一样 —— 替换掉当前的 history 记录。    

### `router.go(n)`

这个方法的参数是一个整数，意思是在 history 记录中向前或者后退多少步，类似 `window.history.go(n)`。    

## 命名路由

有时候，通过一个名称来标识一个路由显得更方便一些，特别是在链接一个路由，或者是执行一些跳转的时候。你可以在创建 Router 实例的时候，在 routes 配置中给某个路由设置名称。    

```js
const router = new VueRouter({
  routes: [
    {
      path: '/user/:userId',
      name: 'user',
      component: User
    }
  ]
})
```   

`<router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>`     

## 命名视图

有时候想同时（同级）展示多个视图，而不是嵌套展示，例如创建一个布局，有 sidebar（侧导航） 和 main（主内容） 两个视图，这个时候命名视图就派上用场了。你可以在界面中拥有多个单独命名的视图，而不是只有一个单独的出口。如果 router-view 没有设置名字，那么默认为 `default`。    

```html
<router-view class="view one"></router-view>
<router-view class="view two" name="a"></router-view>
<router-view class="view three" name="b"></router-view>
```   

一个视图使用一个组件渲染，因此对于同个路由，多个视图就需要多个组件。确保正确使用 components 配置（带上 s）：    

```js
const router = new VueRouter({
  routes: [
    {
      path: '/',
      components: {
        default: Foo,
        a: Bar,
        b: Baz
      }
    }
  ]
})
```   

## 重定向和别名

重定向也是通过 routes 配置来完成，下面例子是从 `/a` 重定向到 `/b`：    

```js
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: '/b' }
  ]
})
```   

重定向的目标也可以是一个命名的路由：    

```js
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: { name: 'foo' }}
  ]
})
```    

甚至是一个方法，动态返回重定向目标：    

```js
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: to => {
      // 方法接收 目标路由 作为参数
      // return 重定向的 字符串路径/路径对象
    }}
  ]
})
```    

### 别名

```js
const router = new VueRouter({
  routes: [
    { path: '/a', component: A, alias: '/b' }
  ]
})
```   

## HTML5 History 模式

如果不想要很丑的 hash，我们可以用路由的 history 模式，这种模式充分利用 history.pushState API 来完成 URL 跳转而无须重新加载页面。     

```js
const router = new VueRouter({
  mode: 'history',
  routes: [...]
})
```    

## 导航钩子

正如其名，`vue-router` 提供的导航钩子主要用来拦截导航，让它完成跳转或取消。有多种方式可以在路由导航发生时执行钩子：全局的, 单个路由独享的, 或者组件级的。      

### 全局钩子
 
你可以使用 `router.beforeEach` 注册一个全局的 `before` 钩子：     

```js
const router = new VueRouter({ ... })

router.beforeEach((to, from, next) => {
  // ...
})
```    

当一个导航触发时，全局的 `before` 钩子按照创建顺序调用。钩子是异步解析执行，此时导航在所有钩子 `resolve` 完之前一直处于 等待中。     

每个钩子方法接收三个参数：   

+ `to: Route`: 即将要进入的目标路由对象
+ `from: Route`: 当前导航正要离开的路由
+ `next: Function`: 一定要调用该方法来 resolve 这个钩子。执行的效果依赖 `next` 方法的调用参数。
  - `next()` 进行管道中的下一个钩子。如果全部钩子执行完了，导航的状态就是 confirmed。
  - `next(false)`：中断当前的导航。如果浏览的 URL 改变了（可能是用户手动或者浏览器后退按钮），那么 URL 地址会重置到 `from` 路由对应的地址。
  - `next('/')` 或者 `next({ path: '/'})`: 跳转到一个不同的地址，当前的导航被中断，然后进行一个新的导航。    

同样可以注册一个全局的 `after` 钩子，不过其没有 `next` 方法，不能改变导航。    

### 某个路由独享的钩子

可以在路由配置上直接定义 `beforeEnter` 钩子：   

```js
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      beforeEnter: (to, from, next) => {
        // ...
      }
    }
  ]
})
```   

参数与全局的 `before` 一样。    

### 组件内的钩子

最后，还可以在路由组件内直接定义以下的钩子：   

+ `beforeRouteEnter`
+ `beforeRouteUpdate`
+ `beforeRouteLeave`    

```js
const Foo = {
  template: `...`,
  beforeRouteEnter (to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当钩子执行前，组件实例还没被创建
  },
  beforeRouteUpdate (to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
  },
  beforeRouteLeave (to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
  }
}
```    

`beforeRouteEnter` 钩子 不能 访问 `this`，不过，你可以通过传一个回调给 `next` 来访问组件实例。在导航被确认的时候执行回调，并且把组件实例作为回调方法的参数。     

```js
beforeRouteEnter (to, from, next) {
  next(vm => {
    // 通过 `vm` 访问组件实例
  })
}
```    

## 路由元信息

定义路由的时候可以配置 `meta` 字段：    

```js
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      children: [
        {
          path: 'bar',
          component: Bar,
          // a meta field
          meta: { requiresAuth: true }
        }
      ]
    }
  ]
})
```    

我们称呼 routes 配置中的每个路由对象为 路由记录。路由记录可以是嵌套的，因此，当一个路由匹配成功后，他可能匹配多个路由记录。     

一个路由匹配到的所有路由记录会暴露为 `$route` 对象（还有在导航钩子中的 `route` 对象）的 `$route.matched` 数组。因此，我们需要遍历 `$route.matched` 来检查路由记录中的 meta 字段。     

```js
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!auth.loggedIn()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next() // 确保一定要调用 next()
  }
})
```     

## 滚动行为

这个功能仅在 HTML5 history 模式下可用。     

当创建一个 Router 实例，你可以提供一个 `scrollBehavior` 方法：     

```js
const router = new VueRouter({
  routes: [...],
  scrollBehavior (to, from, savedPosition) {
    // return 期望滚动到哪个的位置
  }
})
```    

`scrollBehavior` 方法接收 `to` 和 `from` 路由对象。第三个参数 `savedPosition` 当且仅当 `popstate` 导航 (通过浏览器的 前进/后退 按钮触发) 时才可用。     

这个方法返回滚动位置的对象信息，长这样：   

+ `{ x: number, y: number }`
+ `{ selector: string }`    

如果返回一个布尔假的值，或者是一个空对象，那么不会发生滚动。    

返回 savedPosition，在按下 后退/前进 按钮时，就会像浏览器的原生表现那样：   

```js
scrollBehavior (to, from, savedPosition) {
  if (savedPosition) {
    return savedPosition
  } else {
    return { x: 0, y: 0 }
  }
}
```    

## router-link

`<router-link>` 组件支持用户在具有路由功能的应用中（点击）导航。 通过 `to` 属性指定目标地址，默认渲染成带有正确链接的 `<a>` 标签，可以通过配置 `tag` 属性生成别的标签.。另外，当目标路由成功激活时，链接元素自动设置一个表示激活的 CSS 类名。    

### 属性

+ **`to`**
  - 类型： `string | Location`
  - 必须    

表示目标路由的链接。当被点击后，内部会立刻把 to 的值传到 router.push()，所以这个值可以是一个字符串或者是描述目标位置的对象。    

```html
<!-- 字符串 -->
<router-link to="home">Home</router-link>
<!-- 渲染结果 -->
<a href="home">Home</a>

<!-- 使用 v-bind 的 JS 表达式 -->
<router-link v-bind:to="'home'">Home</router-link>

<!-- 不写 v-bind 也可以，就像绑定别的属性一样 -->
<router-link :to="'home'">Home</router-link>

<!-- 同上 -->
<router-link :to="{ path: 'home' }">Home</router-link>

<!-- 命名的路由 -->
<router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>

<!-- 带查询参数，下面的结果为 /register?plan=private -->
<router-link :to="{ path: 'register', query: { plan: 'private' }}">Register</router-link>
```   

+ **`replace`**   
  - 类型：`boolean`
  - 默认 `false`   

设置了 `replace` 属性的话，就使用 `router.replace()` 而不是 `router.push()`。    
`<router-link :to="{ path: '/abc' }" replace></router-link>`    

+ **`append`**
  - 类型 `boolean`
  - 默认 `false`    

设置了 `append` 属性后，则在当前（相对）路径前添加基路由，例如，我们从 /a 导航到一个相对路径 b，如果没有配置 append，则路径为 /b，如果配了，则为 /a/b .    

`  <router-link :to="{ path: 'relative/path'}" append></router-link>`   

+ **`tag`**
  - 类型：`string`
  - 默认 `"a"`   

略。    

+ **`active-class`**
  - 类型 `string`
  - 默认 `router-link-active`    

设置 链接激活时使用的 CSS 类名。默认值可以通过路由的构造选项 `linkActiveClass` 来全局配置。    

+ **`exact`**
  - 类型 `boolean`
  - 默认 `false`    

"是否激活" 默认类名的依据是 inclusive match （全包含匹配）。 举个例子，如果当前的路径是 /a 开头的，那么 `<router-link to="/a">` 也会被设置 CSS 类名。    

按照这个规则，`<router-link to="/">` 将会点亮各个路由！想要链接使用 "exact 匹配模式"，则使用 exact 属性：    

+ **`events`**
  - 类型 `string | Array<string>`
  - 默认 `click` 

声明可以用来触发导航的事件。可以是一个字符串或是一个包含字符串的数组。    

### 将"激活时的CSS类名"应用在外层元素  

有时候我们要让 "激活时的CSS类名" 应用在外层元素，而不是 `<a>` 标签本身，那么可以用 `<router-link>` 渲染外层元素，包裹着内层的原生 `<a>` 标签：   

```html
<router-link tag="li" to="/foo">
  <a>/foo</a>
</router-link>
```    

## router-view

`<router-view>` 是一个函数组件。渲染路径匹配到的视图组件。    

### 属性

+ **`name`**
  - 类型：`string`
  - 默认 `default`   

如果 `<router-view>`设置了名称，则会渲染对应的路由配置中 `components` 下的相应组件。    

## 路由信息对象

一个 route object（路由信息对象） 表示当前激活的路由的状态信息，包含了当前 URL 解析得到的信息，还有 URL 匹配到的 route records（路由记录）。    

route object 出现在多个地方:   

+ 组件内的 `this.$route` 和 `$route` watcher 回调（监测变化处理）;
+ `router.match(location)` 的返回值
+ 导航钩子的参数
+ `scrollBehavior` 方法的参数

### 路由信息对象的属性

+ **`$route.path`**
  - 类型 `string`  
字符串，对应当前路由的路径，总是解析为绝对路径，如 `"/foo/bar"`。   
+ **`$route.params`**
  - 类型： `Object`  
包含了动态片段和全匹配片段，如果没有路由参数，就是一个空参数。
+ **`$route.query`**
  - 类型：`Object`  
URL 查询参数。如果没有查询参数就是空对象。
+ **`$route.hash`**
  - 类型 `string`  
当前路由的 hash 值，带 `#`
+ **`$route.fullPath`**
  - 类型 `string`  
完成解析后的 URL。包含查询参数和 hash 的完整路径。   
+ **`$route.matched`**
  - 类型 `Array<RouteRecord>`   
一个数组，包含当前路由的所有嵌套路径片段的路由记录。路由记录就是 `routes` 配置数组中的对象副本。   
```js
const router = new VueRouter({
  routes: [
    // 下面的对象就是 route record
    { path: '/foo', component: Foo,
      children: [
        // 这也是个 route record
        { path: 'bar', component: Bar }
      ]
    }
  ]
})
```    
+ **`route.name`** 当前路由的名称。   


## Router 构造配置

### routes

+ 类型： `Array<RouteConfig>`   

`RouteConfig` 的类型定义：   

```js
declare type RouteConfig = {
  path: string;
  component?: Component;
  name?: string; // for named routes (命名路由)
  components?: { [name: string]: Component }; // for named views (命名视图组件)
  redirect?: string | Location | Function;
  alias?: string | Array<string>;
  children?: Array<RouteConfig>; // for nested routes
  beforeEnter?: (to: Route, from: Route, next: Function) => void;
  meta?: any;
}
```    

### mode

+ 类型 `string`
+ 默认 `"hash"`(浏览器环境) | `"abstract"` Node 环境
+ 可选值: `hash | history | abstract`   

### base

+ 类型： `string`
+ 默认 `/`   

应用的基路径。例如，如果整个单页应用服务在 /app/ 下，然后 base 就应该设为 "/app/"。    

### linkActiveClass

略。    

### scrollBehavior

略。    

## Router 实例

### 属性

+ **`router.app`**
  - 类型 `Vue instance`   
配置了 `router` 的根实例。  
+ **`router.mode`** 使用模式
+ **`router.currentRoute`** 当前路由对应的路由信息对象。   

### 方法

+ `router.beforeEach(guard)`, `router.afterEach(hook)`
+ `router.push(location)`
+ `router.replace(location)`
+ `router.go(n)`
+ `router.back()`, `router.forward()`    
+ `router.getMatchedComponents(location?)`返回目标位置或是当前路由匹配的组件数组（是数组的定义/构造类，不是实例）。通常在服务端渲染的数据预加载时时候。 
+ `router.resolve(location, current?,append?)`解析目标位置（格式和 `<router-link>` 的 to prop 一样），返回包含如下属性的对象：   
```js
{
  location: Location;
  route: Route;
  href: string;
}
```   
+ `router.addRoutes(routes)`动态添加更多的路由规则。参数必须是一个符合 `routes` 选项要求的数组。   
+ `router.onReady(callback)`添加一个会在第一次路由跳转完成时被调用的回调函数。此方法通常用于等待异步的导航钩子完成，比如在进行服务端渲染的时候。    

## 对组件注入

通过在 Vue 实例的 `router` 配置传入 router 实例。每个子组件都会注入以下的属性：   

+ `$router`
+ `$route`    

