---
layout: post
title: 一、ECMAScript 6 简介
description: ECMAScript 6 是JavaScript的下一个标准，正处在快速开发之中，大部分已经完成了，预计将在2014年正式发布。
category: ecmascript
tags: ES6
---

ECMAScript 6 是JavaScript的下一个标准，正处在快速开发之中，大部分已经完成了，预计将在2014年正式发布。Mozilla将在这个标准的基础上，推出JavaScript 2.0。

ECMAScript 6 的目标，是使得JavaScript可以用来编写复杂的应用程序、函数库和代码的自动生成器（code generator）。

最新的浏览器已经部分支持ECMAScript 6 的语法，可以通过[《ECMAScript 6 浏览器兼容表》][1]查看浏览器支持情况。

## ECMAScript 6 新内容一览

1. **let, const** (定义块级局部变量), 函数在块级域中

2. **解构**: `let {x, y} = pt; let [s, v, o] = triple();` (如可以 `let pt = {x:2, y:-5}`).

3. **参数设置默认设置**: `function f(x, y=1, z=0) {...}`

4. **rest**: `function g(i, j, ...r) { return r.slice(i, j); }` (而不是疯狂地使用arguments).

5. **spread**: `let a = [0,1,2,3]`, `o = new Something(...a);`

6. **proxies**: `let obj = Proxy.create(handler, proto)`. 简单地说，就是类对象元素的符号重载.

7. **weak map**: `let map = new WeakMap`. 当你有循环应用的时候用它.

8. **generators**: `function* gen() { yield 1; yield 2; }` 事实上, gen() 返回一个有next()属性的对象

9. **迭代器**: `for (var [key, val] of items(x)) { alert(key + ',' + val); }`. Iterators 可以是 generators 或者 proxies.

10. **array and generator comprehension**: `[a+b for (a in A) for (b in B)]` (array comprehension), `(x for (x of generateValues()) if (x.color === 'blue'))` (generator expression).

11. **二进制数据**: `const Pixel = new StructType({x:uint32, y:uint32, color:Color})` (此处Color本身就是一个结构类型), `new ArrayType(Pixel, 3)`.

12. **类语法**, 包含 `extends`, `prototype`, and `super`:

```javascript
class Point extends Base {
  constructor(x,y) {
    super();
    this[px] = x, this[py] = y;
    this.r = function() { return Math.sqrt(x*x + y*y); }
  }
  get x() { return this[px]; }
  get y() { return this[py]; }
  proto_r() { return Math.sqrt(this[px] * this[px] +
      this[py] * this[py]); }
  equals(p) { return this[px] === p[px] &&
      this[py] === p[py]; }
}
```

13 **模块**:

```javascript
module math {
  export function sum(x, y) {
    return x + y;
  }
  export var pi = 3.141593;
}
import {sum, pi} from math;
alert(sum(pi,pi));
```

14 **quasis**: multiline, 可扩展的预处理字符串. `You are ${age} years old.`.

```javascript
// The following regexp spans multiple lines.
re`line1: (words )*
line2: \w+`

// It desugars to:
re({raw:'line1: (words )*\nline2: \w+',
    cooked:'line1: (words )*\nline2: \w+'})
```

## 参考资料

- <http://espadrine.github.io/New-In-A-Spec/es6/>  espadrine
- <http://javascript.ruanyifeng.com/oop/ecmascript6.html> ruanyifeng


ECMAScript 6系列文章请移步：<http://barretlee.com/ES6/>



[1]: http://kangax.github.io/es5-compat-table/es6/  《ECMAScript 6 浏览器兼容表》
