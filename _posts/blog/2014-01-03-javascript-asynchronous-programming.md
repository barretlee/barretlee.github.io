---
layout: post
title: JavaScript异步编程原理
description: 异步的作用就是通知主程序，我的任务已经搞定了，你可以来处理结果了。如果没有异步，我们需要耗费大量的资源去判断程序的状态。
category: blog
tags: javascript 异步编程 多线程 promise Generator
---

众所周知，JavaScript 的执行环境是单线程的，所谓的单线程就是一次只能完成一个任务，其任务的调度方式就是排队，这就和火车站洗手间门口的等待一样，前面的那个人没有搞定，你就只能站在后面排队等着。在事件队列中加一个延时，这样的问题便可以得到缓解。

	A: 嘿，哥们儿，快点！
	B: 我要三分钟，你先等着，完了叫你~
	A: 好的，记得叫我啊~ 你（C）也等着吧，完了叫你~
	C: 嗯！
	...

告诉后面排队的人一个准确的时间，这样后面的人就可以利用这段时间去干点别的事情，而不是所有的人都排在队列后抱怨。我写了一段程序来解决这个问题：

	/**
	* @author Barret Lee
	* @email barret.china@gmail.com
	* @description 事件队列管理，含延时
	*/
	var Q = {
		// 保存队列信息
		a: [],
		// 添加到队列 queue
		q: function(d){
			// 添加到队列如果不是函数或者数字则不处理
			if(!/function|number/.test(typeof d)) return;

			Q.a.push(d);
			// 返回对自身的引用
			return Q;
		},
		// 执行队列 dequeue
		d: function(){
			var s = Q.a.shift();
			// 如果已经到了队列尽头则返回
			if(!s) return;

			// 如果是函数，直接执行，然后继续 dequeue
			if(typeof s === "function") {
				s(), Q.d();
				return;
			}

			// 如果是数字，该数字作为延迟时间，延迟 dequeue
			setTimeout(function(){
				Q.d();
			}, s);
		}
	};

这段程序加了很多注释，相信有 JS 基础的童鞋都能够看懂，利用上面这段代码测试下：

	// 进程记录函数
	function record(s){
		var div = document.createElement("div");
		div.innerHTML = s;
		console.log(s);
		document.body.appendChild(div);
	}

	Q
	.q(function(){
		record("0 <i style='color:blue'>3s 之后搞定，0 把 1 叫进来</i>");
	})
	.q(3000)  // 延时 3s
	.q(function(){
		record("1 <i style='color:blue'>2s 之后搞定，1 把 2 叫进来</i>");
	})
	.q(2000)  // 延时 2s
	.q(function(){
		record("2 <span style='color:red'>后面没人了，OK，厕所关门~</span>");
	})
	.d();     // 执行队列

可以戳戳这个 [DEMO](http://qianduannotes.duapp.com/demo/ansyc/)。

本文地址：<http://barretlee.com/javascript-asynchronous-programming>，转载请注明出处。

## 一、Javascript 异步编程原理

显然，上面这种方式和银行取号等待有些类似，只不过银行取号我们并不知道上一个人需要多久才会完成。这是一种非阻塞的方式处理问题。下面来探讨下 JavaScript 中的异步编程原理。

### 1. setTimeout 函数的弊端

延时处理当然少不了 setTimeout 这个神器，很多人对 setTimeout 函数的理解就是：延时为 n 的话，函数会在 n 毫秒之后执行。事实上并非如此，这里存在三个问题，一个是 setTimeout 函数的及时性问题，可以测试下面这串代码：

	var d = new Date, count = 0, f, timer;
	timer = setInterval(f = function (){
		if(new Date - d > 1000) 
			clearInterval(timer), console.log(count);
		count++;
	}, 0);

可以看出 1s 中运行的次数大概在 200次 左右，有人会说那是因为 new Date 和 函数作用域的转换消耗了时间，其实不然，你可以再试试这段代码：

	var d = new Date, count = 0;
	while(true) {
		if(new Date - d > 1000) {
			console.log(count);
			break;
		}
		count++;
	}

我这里显示的是 351813，也就是说 count 累加了 35W+ 次，这说明了什么呢？setInterval 和 setTimeout 函数运转的最短周期是 5ms 左右，这个数值在 [HTML规范](http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout) 中也是有提到的:
	
	5. Let timeout be the second method argument, or zero if the argument was omitted.
	如果 timeout 参数没有写，默认为 0
	7. If nesting level is greater than 5, and timeout is less than 4, then increase timeout to 4.
	如果嵌套的层次大于 5 ，并且 timeout 设置的数值小于 4 则直接取 4.

为了让函数可以更快速的相应，部分浏览器提供了更加高级的接口（当 timeout 为 0 的时候，可以使用下面的方式替代，速度更快）：

- requestAnimationFrame 它允许 JavaScript 以 60+帧/s 的速度处理动画，他的运行时间间隔比 setTimeout 是要短很多的。
- process.nextTick 这个是 NodeJS 中的一个函数，利用他可以几乎达到上面看到的 while 循环的效率
- ajax 或者 插入节点 的 readState 变化
- MutationObserver 
- setImmediate
- ...

这些东西下次有空再细谈。之前研究[司徒正美](http://www.cnblogs.com/rubylouvre)的 avalon 源码的时候，看到了相关的内容，有兴趣的可以看看：

	//视浏览器情况采用最快的异步回调
	var BrowserMutationObserver = window.MutationObserver || window.WebKitMutationObserver
	if (BrowserMutationObserver) { //chrome18+, safari6+, firefox14+,ie11+,opera15
		avalon.nextTick = function(callback) { //2-3ms
			var input = DOC.createElement("input")
			var observer = new BrowserMutationObserver(function(mutations) {
				mutations.forEach(function() {
					callback()
				})
			})
			observer.observe(input, {
				attributes: true
			})
			input.setAttribute("value", Math.random())
		}
	} else if (window.VBArray) { 
	//IE下这个通常只要1ms,而且没有副作用，不会发现请求，
	//setImmediate如果只执行一次，与setTimeout一样要140ms上下
		avalon.nextTick = function(callback) {
			var node = DOC.createElement("script")
			node.onreadystatechange = function() {
				callback() //在interactive阶段就触发
				node.onreadystatechange = null
				root.removeChild(node)
				node = null
			}
			root.appendChild(node)
		}
	} else {
		avalon.nextTick = function(callback) {
			setTimeout(callback, 0)
		}
	}

上面说了一堆，目的是想说明， setTimeout 是存在一定时间间隔的，并不是设定 n 毫秒执行，他就是 n 毫秒执行，可能会有一点时间的延迟（2ms左右）。然后说说他的第二个缺点，先看代码：

	var d = new Date;
	setTimeout(function(){
		console.log("show me after 1s, but you konw:" + (new Date - d));
	}, 1000);
	while(1) if(new Date - d > 2000) break;

我们期望 console 在 1s 之后出结果，可事实上他却是在 2075ms 之后运行的，这就是 JavaScript 单线程给我们带来的烦恼，while循环阻塞了 setTimeout 函数的执行。接着是他的第三个毛病，try..catch捕捉不到他的错误：

	try{
		setTimeout(function(){
			throw new Error("我不希望这个错误出现！")
		}, 1000);
	} catch(e){
		console.log(e.message);
	}

可以说 setTimeout 是异步编程不可缺少的角色，但是它本身就存在这么多的问题，这就要求我们用更加恰当的方式去规避！

### 2. 什么样的函数为异步的

异步的概念和非阻塞是是息息相关的，我们通过 ajax 请求数据的时候，一般采用的是异步的方式：

	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/', true);
	xhr.send();
	xhr.onreadystatechange = function(){
		console.log(xhr.status);
	}

在 xhr.open 中我们把第三个参数设置为 true ，也就是异步加载，当 state 发生改变的时候，xhr 立即响应，触发相关的函数。有人想过用这样的方式来处理：

	while(1) {
		if(xhr.status === "complete") {
			// dosomething();
			break;
		}
	}

而事实上，这里的判断已经陷入了死循环，即便是 xhr 的 status 已经发生了改变，这个死循环也跳不出来，那么这里的异步是基于事件的。

> 某个函数会导致将来再运行的另一个函数，后者取自于事件队列（若后面这个函数是作为参数传递给前者的，则称其为回调函数，简称为回调）。<cite>—— 摘自《Async Javascript》</cite>

由于 JavaScript 的单线程特点，他没有提供一种机制以阻止函数在其异步操作结束之前返回，事实上，除非函数返回，否则不会触发任何异步事件。

### 3. 常见的异步模型

1） 最常见的一种方式是，高阶函数（泛函数）

	step1(function(res1){
		step2(function(res2){
			step3(function(res3){
				//...
			});
		});
	});

解耦程度特别低，如果送入的参数太多会显得很乱！这是最常见的一种方式，把函数作为参数送入，然后回调。

2） 事件监听

	f.on("evt", g);
	function f(){
		setTimeout(function(){
			f.trigger("evt");
		})
	}

JS 和 浏览器提供的原生方法基本都是基于事件触发机制的，耦合度很低，不过事件不能得到流程控制。

3） 发布/订阅( Pub/Sub )

	E.subscribe("evt", g);
	function f(){
		setTimeout(function () {
		　　// f的任务代码
		　　E.publish("evt");
		}, 1000);
	}

把事件全部交给 E 这个控制器管理，可以完全掌握事件被订阅的次数，以及订阅者的信息，管理起来特别方便。

4） Promise 对象（deferred 对象）

关于这里的内容可以看看 [屈屈](https://www.imququ.com/post/promises-when-js.html) 写的文章，说的比较详细。

[Promise/A+](http://promisesaplus.com/) 规范是对 [Promise/A](http://wiki.commonjs.org/wiki/Promises/A) 规范的补充和修改，他出现的目的是为了统一异步编程中的接口，JS中的异步编程是十分普遍的事情，也出现了很多的异步库，如果不统一接口，对开发者来说也是一件十分痛苦的事情。

在Promises/A规范中，每个任务都有三种状态：默认(pending)、完成(fulfilled)、失败(rejected)。

- 默认状态可以单向转移到完成状态，这个过程叫resolve，对应的方法是deferred.resolve(promiseOrValue)；
- 默认状态还可以单向转移到失败状态，这个过程叫reject，对应的方法是deferred.reject(reason)；
- 默认状态时，还可以通过deferred.notify(update)来宣告任务执行信息，如执行进度；
- 状态的转移是一次性的，一旦任务由初始的pending转为其他状态，就会进入到下一个任务的执行过程中。

## 二、异步函数中的错误处理

前面已经提到了 setTimeout 函数的一些问题，JS 中的 try..catch 机制并不能拿到 setTimeout 函数中出现的错误，一个 throw error 的影响范围有多大呢？我做了一个测试：

	<script type="text/javascript">
		throw new Error("error");
		console.log("show me"); // 并没有打印出来
	</script>
	<script type="text/javascript">
		console.log("show me"); // 打印出来了
	</script>

从上面的测试我们可以看出，`throw new Error` 的作用范围就是阻断一个 script 标签内的程序运行，但是不会影响下面的 script。这个测试没什么作用，只是想告诉大家不要担心一个 Error 会影响全局的函数执行。所以把代码分为两段，一段可能出错的，一段确保不会出错的，这样不至于让全局代码都死掉，当然这样的处理方式是不可取的。

庆幸的是 window 全局对象上有一个便利的函数，`window.error`，我们可以利用他捕捉到所有的错误，并作出相应的处理，比如：

	window.onerror = function(msg, url, line){
		console.log(msg, url, line);
		// 必须返回 true，否则 Error 还是会触发阻塞程序
		return true;
	}

	setTimeout(function(){
		throw new Error("error");
		// console：
		//Uncaught Error: error path/to/ie6bug.html 99  
	}, 50);

我们可以对错误进行封装处理：

	window.onerror = function(msg, url, line){
		// 截断 "Uncaught Error: error"，获取错误类型
		var type = msg.slice(16);
		switch(type){
			case "TooLarge": 
				console.log("The number is too large");
			case "TooSmall": 
				console.log("The number is too Small");
			case "TooUgly": 
				console.log("That's Barret Lee~");
			// 如果不是我们预定义的错误类型，则反馈给后台监控
			default:
				$ && $.post && $.post({
					"msg": msg,
					"url": url,
					"line": line
				})
		}
		// 记得这里要返回 true，否则错误阻断程序。
		return true;
	}

	setTimeout(function(){
		if( something )  throw new Error("TooUgly");
		// console：
		//That's Barret Lee~ 
	}, 50);

很显然，报错已经不可怕了，利用 window 提供的 onerror 函数可以很方便地处理错误并作出及时的反应，如果出现了不可知的错误，可以把信息 post 到后台，这也算是一个十分不错的监控方式。

不过这样的处理存在一个问题，所有的错误我们都给屏蔽了，但有些错误本应该阻断所有程序的运行的。比如我们通过 ajax 获取数据中出了错误，程序误以为已经拿到了数据，本应该停下工作报出这个致命的错误，但是这个错误被 window.onerror 给截获了，从而进行了错误的处理。

window.onerror 算是一种特别暴力的容错手段，try..catch 也是如此，他们底层的实现就是利用 C/C++ 中的 goto 语句实现，一旦发现错误，不管目前的堆栈有多深，不管代码运行到了何处，直接跑到 顶层 或者 try..catch 捕获的那一层，这种一脚踢开错误的处理方式并不是很好，我觉得。

## 三、JavaScript 多线程技术介绍

开始说了异步编程和非阻塞这个概念密切相关，而 JavaScript 中的 Worker 对象可以创建一个独立线程来处理数据，很自然的处理了阻塞问题。我们可以把繁重的计算任务交给 Worker 去倒腾，等他处理完了再把数据 Post 过来。

	var worker = new Worker("./outer.js");
	worker.addEventListener("message", function(e){
		console.log(e.message);
	});
	worker.postMessage("data one");
	worker.postMessage("data two");

	// outer.js
	self.addEventListener("message", function(e){
		self.postMessage(e.message);
	});

上面是一个简单的例子，如果我们创建了多个 Worker，在监听 onmessage 事件的时候还要判断下 e.target 的值从而得知数据源，当然，我们也可以把数据源封装在 e.message 中。

Worker 是一个有用的工具，我可以可以在 Worker 中使用 setTimeout，setInterval等函数，也可以拿到 navigator 的相关信息，最重要的是他可以创建 ajax 对象和 WebSocket 对象，也就是说他可以直接向服务器请求数据。不过他不能访问 DOM 的信息，更不能直接处理 DOM，这个其实很好理解，主线程和 Worker 是两个独立的线程，如果两者都可以修改 DOM，那岂不是得设置一个麻烦的互斥变量？！还有一个值得注意的点是，在 Worker 中我们可以使用 importScript 函数直接加载脚本，不过这个函数是同步的，也就是说他会冻结 Worker 线程，直到 Script  加载完毕。

	importScript("a.js", "b.js", "c.js");

他可以添加多个参数，加载的顺序就是 参数的顺序。一般会使用 Worker 做哪些事情呢？

- 数据的计算和加密  如计算斐波拉契函数的值，特别费时；再比如文件的 MD5 值比对，一个大文件的 MD5 值计算也是很费时的。
- 音、视频流的编解码工作，这些工作搞微信的技术人员应该没有少做。有兴趣的童鞋可以看看这个[技术分享](http://v.youku.com/v_show/id_XNjQ5NzgxODAw.html)，是杭州的 hehe123 搞的一个WebRTC 分享，内容还不错。
- 等等，你觉得费时间的事情都可以交给他做

然后要说的是 SharedWorker，这是 web 通信领域未来的一个趋势，有些人觉得 WebSocket 已经十分不错了，但是一些基于 WebSocket 的架构，服务器要为每一个页面维护一个 WebSocket 代码，而 SharedWorker 十分给力，他是多页面通用的。

	<input id="inp" /><input type="button" id="btn" value="发送" />
	<script type="text/javascript">
		var sw = new SharedWorder("./outer.js");
		// 绑定事件
		sw.port.onmessage = function(e){
			console.log(e.data);
		};
		btn.onclick = function(){
			sw.port.postMessage(inp.value);
			inp.value = "";
		};
		// 创建连接，开始监听
		sw.port.start();
	</script>

	// outer.js
	var pool = [];
	onconnect = function(e) {
		// 把连接的页面放入连接池
		pool.push(e.ports[0]);
		// 收到信息立即广播
		e.ports[0].onmessage = function(e){
			for(var i = 0;i < pool.length; i++)
				// 广播信息
				pool[i].postMessage(e.data);
		};
	};

简单理解 SharedWorker，就是把运行的一个线程作为 web后台程序，完全不需要后台脚本参与，这个对 web通讯，尤其是游戏开发者，觉得是一个福音！

## 四、ECMAScript 6 中 Generator 对象搞定异步

异步两种常见方式是 事件监听 以及 函数回调。前者没什么好说的，事件机制是 JS 的核心，而函数回调这块，过于深入的嵌套简直就是一个地狱，可以看看[这篇文章](http://callbackhell.com/)，这是一篇介绍异步编程的文章，什么叫做“回调地狱”，可以看看下面的例子：

	fs.readdir(source, function(err, files) {
	  if (err) {
		console.log('Error finding files: ' + err)
	  } else {
		files.forEach(function(filename, fileIndex) {
		  console.log(filename)
		  gm(source + filename).size(function(err, values) {
			if (err) {
			  console.log('Error identifying file size: ' + err)
			} else {
			  console.log(filename + ' : ' + values)
			  aspect = (values.width / values.height)
			  widths.forEach(function(width, widthIndex) {
				height = Math.round(width / aspect)
				console.log('resizing ' + filename + 'to ' + height + 'x' + height)
				this.resize(width, height).write(destination + 'w' + width + '_' + filename, function(err) {
				  if (err) console.log('Error writing file: ' + err)
				})
			  }.bind(this))
			}
		  })
		})
	  }
	})

是不是有种想吐的感觉，一层一层的嵌套，虽说这种嵌套十分正常，倘若每段代码都是这样的呈现，相信二次开发者一定会累死！关于如何解耦我就不细说了，可以回头看看上面那篇回调地狱的文章。

ECMAScript 6中有一个 Generator 对象，过段时间会对 ES6 中的新知识进行一一的探讨，这里不多说了，有兴趣的同学可以看看 H-Jin 写的一篇文章[使用 (Generator) 生成器解决 JavaScript 回调嵌套问题](http://huangj.in/765)，使用 yield 关键词和 Generator 把嵌套给“拉直”了，这种方式就像是 chrome 的 DevTool 中使用断点一般，用起来特别舒服。

## 五、串并行的转换

留到下次说吧，文字敲多了，累 ：)

## 六、小结

本文提到了异步编程的相关概念和使用中会遇到的问题，在写文章之前做了三天的调研，不过还是有很多点没说全，下次对异步编程有了更深入的理解再来谈一谈。

## 七、参考资料

- [Javascript异步编程的4种方法](http://www.ruanyifeng.com/blog/2012/12/asynchronous%EF%BC%BFjavascript.html) 阮一峰
- [javascript 异步编程](http://www.cnblogs.com/rubylouvre/archive/2011/03/14/1982699.html) 司徒正美
- [HTML Specification](http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html) web develop group
- [Promise/A+ 规范](http://promisesaplus.com/)
- [异步编程：When.js快速上手](https://www.imququ.com/post/promises-when-js.html) JerrryQu
- [《Async Javascript》](http://book.douban.com/subject/10745151/) By Trevor Burnham
- [非常有意义，却尚未兼容的SharedWorker](http://www.web-tinker.com/article/20444.html) 次碳酸钴
- [HTML5 Web Worker](http://www.cnblogs.com/_franky/archive/2010/11/23/1885773.html) Franky