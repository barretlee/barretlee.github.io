---
layout: post
title: 你所不知道的JavaScript数组
description: 相信每一个 javascript 学习者，都会去了解 JS 的各种基本数据类型，数组就是数据的组合，这是一个很基本也十分简单的概念，他的内容没多少，学好它也不是件难事情。但是本文着重要介绍的并不是我们往常看到的 Array，而是 ArrayBuffer。
category: blog
tags: javascript array arraybuffer 堆栈模型
---

相信每一个 javascript 学习者，都会去了解 JS 的各种基本数据类型，数组就是数据的组合，这是一个很基本也十分简单的概念，他的内容没多少，学好它也不是件难事情。但是本文着重要介绍的并不是我们往常看到的 Array，而是 ArrayBuffer。

我写的很多东西都是因为要完成某些特定的功能而刻意总结的，可以算是备忘，本文也是如此！前段时间一直在研究 Web Audio API 以及语音通信相关的知识，内容侧重于音频流在 AudioContext 各个节点之间的流动情况，而现在要摸清楚音频到流底是个什么样的数据格式，所以对 ArrayBuffer 的研究就显得格外重要了。

本文地址：{{ site.url }}{{ page.url }}，转载请注明源地址。

## 一、Array 在内存中的堆栈模型

### 1. Array 的获取

Javascript 中如何产生 Array：

	[element0, element1, ..., elementN]
	new Array(element0, element1, ..., elementN)
	new Array(arrayLength)

直接定义，或者通过构造函数创建一个 Array，当然也可以使用其他的手段：

	"array".split("");
	"array".match(/a|r/g);

等等，方式有很多。但是 Array 内部是个什么样的结构，恐怕很多人还不是很清楚。

### 2. 堆栈模型

在数组中我们可以放很多不同数据类型的数据，如：

	var arr = [21, "李靖", new Date(), function(){}, , null];

上面这个数组中一次放入了 数字、字符串、对象、函数、undefined 和 null，对于上面的数据接口我们可以具象的描述下：

	    栈
	+---------+                  堆
	|   21    |         +-------------------+
	+---------+         |                   |
	|  "李靖" |         |                   |
	+---------+         |  +--------+       |
	| [refer] |----------->| Object |       |
	+---------+         |  +--------+       |
	| [refer] |----------------->+--------+ |
	+---------+         |        |function| |
	|undefined|         |        +--------+ |
	+---------+         |                   |
	|   null  |         +-------------------+
	+---------+         Created By Barret Lee

JavaScript 的数据类型分为两种，一种是值类型，一种是引用类型，常见的引用类型有 Object 和 Array，数组的储存模型中，如果是诸如 Number、String 之类的值类型数据会被直接压入栈中，而引用类型只会压入对该值的一个索引，用 C 语言的概念来解释就是只保存了数据的指针，这些数据是储存在堆中的某块区间中。栈堆并不是独立的，栈也可以在堆中存放。

好了，对 Array 的说明就到这里，下面具体说说 ArrayBuffer 的相关知识。

## 二、ArrayBuffer

web 是个啥玩意儿，web 要讨论的最基本问题是什么？我觉得有两点，一个是数据，一个是数据传输，至于数据的展示，纷繁复杂，这个应该是 web 上层的东西。而本文要讨论的 ArrayBuffer 就是最基础的数据类型，甚至不能称之为数据类型，它是一个数据容易，需要通过其他方式来读写。

官方点的定义：

> The ArrayBuffer is a data type that is used to represent a generic, fixed-length binary data buffer. You can't directly manipulate the contents of an ArrayBuffer; instead, you create an ArrayBufferView object which represents the buffer in a specific format, and use that to read and write the contents of the buffer.
> 表示二进制数据的原始缓冲区，该缓冲区用于存储各种类型化数组的数据。 无法直接读取或写入 ArrayBuffer，但可根据需要将其传递到类型化数组或 DataView 对象 来解释原始缓冲区。

他是一个二进制数据的原始缓冲区，虽然 JavaScript 是弱类型语言，但是他本身是对数据的类型和大小都有限制的，我们需要通过某种数据结构将缓冲区的内容有序的读取出来（写进去）。

### 1. 原始缓冲区的创建

通过 ArrayBuffer 这个构造函数可以创建一个原始缓冲区：

	var buffer  = new ArrayBuffer(30);

从 chrome 控制台可以看到：

[![arrayBuffer]({{ site.repo }}/images/blog-article-images/blog/audio/arraybuffer.jpg)]({{ site.repo }}/images/blog-article-images/blog/audio/arraybuffer.jpg)

buffer 实例拥有一个 byteLength 的属性，用于获取 buffer 的 size，一个只有 IE11+ 以及 ios6+ 支持的 slice 方法，用于对 buffer 长度进行截取操作。

	ArrayBuffer slice(
		unsigned long begin
		unsigned long end Optional
	);

可以测试这个 DEMO：

	var buffer = new ArrayBuffer(12);
	var x = new Int32Array(buffer);
	x[1] = 1234;
	var slice = buffer.slice(4);
	var y = new Int32Array(slice);
	console.log(x[1]); 
	console.log(y[0]);
	x[1] = 6789;
	console.log(x[1]); 
	console.log(y[0]);


### 2. 数据化数组

类型化数组类型表示可编制索引和操纵的 ArrayBuffer 对象 的各种视图。 所有数组类型的长度均固定。

名称           |大小（以字节为单位）  |描述
---------------|----------------------|---------------------
Int8Array      |1                     |8 位二补码有符号整数
Uint8Array     |1                     |8 位无符号整数
Int16Array     |2                     |16 位二补码有符号整数
Uint16Array    |2                     |16 位无符号整数
Int32Array     |4                     |32 位二补码有符号整数
Uint32Array    |4                     |32 位无符号整数
Float32Array   |4                     |32 位 IEEE 浮点数
Float64Array   |8                     |64 位 IEEE 浮点数

Int 就是整型，Uint 为无符号整形，Float 为浮点型，这些是 C 语言中的基本概念，我就不具体解释了。由于这些视图化结构都是大同小异，本文只对 Float32Array 类型作说明，读者可以举一反三。

Float32Array 跟 Array 是十分类似的，只不过他每一个元素都是都是一个 32位（4字节） 的浮点型数据。Float32Array 一旦创建其大小不能再修改。

我们可以直接创建一个 Float32Array:

	var x = new Float32Array(2);
	x[0] = 17;
	console.log(x[0]); // 17
	console.log(x[1]); // 0
	console.log(x.length); // 2

需要有这么一个概念，他依然是一个数组，只不过该数组中的每个元素都是 Float 32 位的数据类型，再如：

	var x = new Float32Array([17, -45.3]);
	console.log(x[0]);  // 17
	console.log(x[1]);  // -45.29999923706055
	console.log(x.length); // 2

我们把一个数组的值直接赋给了 x 这个 Float32Array 对象，那么在储存之前会将它转换成一个 32位浮点数。

由于该类数组的每个元素都是同一类型，所以在堆栈模型中，他们全部会被压入到栈之中，因此数据化数组都是值类型，他并不是引用类型！这个要引起注意，从下面的例子中也可以反映出来：

	var x = new Float32Array([17, -45.3]);
	var y = new Float32Array(x);
	console.log(x[0]); // 17
	console.log(x[1]); //-45.29999923706055
	console.log(x.length); // 2
	x[0] = -2;
	console.log(y[0]); // 17, y的值没变

将 x 的值复制给 y，修改 x[0], y[0] 并没有变化。

除了上面的方式，我们还可以通过其他方式来创建一个数据化数组：

	var buffer = new ArrayBuffer(12);
	var x = new Float32Array(buffer, 0, 2);
	var y = new Float32Array(buffer, 4, 1);
	x[1] = 7;
	console.log(y[0]); // 7

解释下这里为什么返回 7.

	       ArrayBuffer（12）
	+-+-+-+-+-+-+-+-+-+-+-+-+-+
	|0|1|2|3|4|5|6|7|8| | | | |
	+-+-+-+-+-+-+-+-+-+-+-+-+-+
	\                /           
	  x (Float32Array)
	  offset：0
	  byteLength：4
	  length:2


	       ArrayBuffer（12）
	+-+-+-+-+-+-+-+-+-+-+-+-+-+
	|0|1|2|3|4|5|6|7|8| | | | |
	+-+-+-+-+-+-+-+-+-+-+-+-+-+
	        \         /           
	             y

	      Created By Barret Lee

看了上面的图解还有疑问么？我觉得我不用继续解释了。可以把 ArrayBuffer 的单位看成 1，而 Float32Array 的单位是 4.

### 3. DataView对象

DataView 对象对数据的操作更加细致，不过我觉得没啥意思，上面提到的各种数据化数组已经可以基本满足应用了，所以这里就一笔带过，一个简单的示例：

	var buffer = new ArrayBuffer(12);
	var x = new DataView(buffer, 0);
	x.setInt8(0, 22);
	x.setFloat32(1, Math.PI);
	console.log(x.getInt8(0)); // 22
	console.log(x.getFloat32(1)); // 3.1415927410125732

如果感兴趣，可以移步<http://www.javascripture.com/DataView>，作详细了解。

## 三、XHR2 中的 ArrayBuffer

ArrayBuffer 的应用特别广泛，无论是 WebSocket、WebAudio 还是 Ajax等等，前端方面只要是处理大数据或者想提高数据处理性能，那一定是少不了 ArrayBuffer 。

XHR2 并不是什么新东西，可能你用到了相关的特性，却不知这就是 XHR2 的内容。最主要的一个东西就是 `xhr.responseType`，他的作用是设置响应的数据格式，可选参数有："text"、"arraybuffer"、"blob"或"document"。请注意，设置（或忽略）xhr.responseType = '' 会默认将响应设为"text"。这里存在一个这样的对应关系：

	请求            响应
	text            DOMString
	arraybuffer     ArrayBuffer
	blob            Blob
	document        Document

举个栗子：

	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/path/to/image.png', true);
	xhr.responseType = 'arraybuffer';

	xhr.onload = function(e) {
		// this.response == uInt8Array.buffer
		var uInt8Array = new Uint8Array(this.response); 
	};

	xhr.send();

我们在 xhr.responseType 中设置了属性为 arraybuffer，那么在拿到的数据中就可以用数据化数组来接受啦！

## 四、小结

本文主要介绍了 Array 在堆栈模型中的存放方式，也详细描述了 ArrayBuffer 这个原始缓冲区的二进制数据类型，在 web 开发中，数据以及数据的储存是一个重要的部分，希望引起注意！

本文叙述上可能存在错误，请多多斧正！

## 五、参考资料

- <http://www.javascripture.com/ArrayBuffer> 
- <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array> MDN Array
- <http://www.html5rocks.com/zh/tutorials/file/xhr2/> html5rocks
- <http://technet.microsoft.com/zh-cn/ie/br212485> MSDN