---
layout: post
title: 让你的页面瞬间全屏
description: 本文要说的并不是这种全屏。当页面中有个小 DEMO 或者小游戏要展示的时候，用户期望，这个 DEMO 或者游戏可以在全屏下展示，本文就教你如何来展示。
category: blog
tags: javascript fullscreen 全屏
---

页面全屏是一个体验非常棒的功能，他可以让你的视觉焦点聚集在你想关注的元素块上。很多浏览器都支持全屏，按下 F11，哦了！ 页面全屏了~

但是本文要说的并不是这种全屏。当页面中有个小 DEMO 或者小游戏要展示的时候，用户期望，这个 DEMO 或者游戏可以在全屏下展示，本文就教你如何来展示。

本文地址：{{ site.url }}{{ page.url }}，转载请注明源地址。

## 一、全屏策略

### 1. 原理

一些浏览器提供了元素全屏的接口，这些接口的调用特别简单：

	// 进入全屏
	element.requestFullScreen(); 
	// 退出全屏
	document.exitFullscreen(); 

这是 w3c 规范统一的接口，但是浏览器总是那么调皮，内部实现的时候会加上自己厂商的前缀，如：
	
	// 小狐
	element.mozRequestFullScreen();  
	// Chrome
	document.webkitCancelFullScreen();

这里有两点需要引起注意，W3C 中的退出全屏是 `exitFullscreen`，而小狐跟 Chrome 使用的是 `cancelFullScreen`，这里在作判断的时候不要弄错了；再一点就是当我们退出全屏的时候，并不是使用 element 作为退出的对象了，而是使用 document。

### 2. 兼容处理

原理是很简单，但是针对浏览器的兼容性写起来还是挺麻烦的，幸好 Chrome 换用 blink内核 之后没有继续加上一个 `-blink-`，否则开发者心里会有无数个草泥马奔腾的！

对于进入全屏：

	function launchFullScreen(element) {  
		if(element.requestFullScreen) {  
			element.requestFullScreen();  
		} else if(element.mozRequestFullScreen) {  
			element.mozRequestFullScreen();  
		} else if(element.webkitRequestFullScreen) {  
			element.webkitRequestFullScreen();  
		}
	}

对于退出全屏：

	function cancelFullScreen() {  
		if(document.exitFullscreen) {  
			document.exitFullscreen();  
		} else if(document.mozCancelFullScreen) {  
			document.mozCancelFullScreen();  
		} else if(document.webkitCancelFullScreen) {  
			document.webkitCancelFullScreen();  
		}
	}  

### 3. 浏览器兼容性

IE 用户就甭看了，刚测试，IE11 不兼容。目前 Firefox 兼容，不过有点离谱。他会弹出一个让你全屏的提示，此时确实是全屏的，但当你点击提示中的确认时，屏幕又退出了全屏，真是让人匪夷所思。我测试的版本（27.0.1）有这个问题，这是浏览器本身的问题，不用纠结。

Chrome 对于新特性的支持永远是站在前排，不得不佩服 google 开发工程师的牛掰！

## 二、两个 bug

### 1. window 失去焦点

当全屏一个元素块的时候，原始状态该元素块可能没有padding或者margin值，为了让他显示的稍微养眼一些，我们可能会给他主动加上 padding 值，然后在退出全屏的时候在拿到设置的值。但此时，一个 bug 出现鸟，当我们点击全屏页面中的 a 标签，或者触发了某个 `window.open` 之后，浏览器会失去焦点，调到新开的页面中，而全屏的页面会退出全屏，搞笑的是我们开始设置的 padding 值他不给我们去掉，这个是令人十分神伤的，不过没关系，有 bug 咱们就打补丁！

	window.onblur = function(){
		cancelFullsreen();
		changeThePadding();
	};

有人会想到，我们在点击 a 链接的时候先 changeThePadding()，再让 a 标签跳走，这种方式是不合理的，因为除了 a 链接会让页面失去焦点之外还有其他的可能（如 window.open）。

### 2. 一个貌似可以重现的 bug

所谓的可以重现就是，把代码逻辑抽离出来，写个 demo 还能看到 bug。反正我试过好几次，这个 bug 都出现了，懒得写一个 DEMO 重现他。他出现的位置是：我的滚动条是自己设置的样式，当全屏之后，滚动条本应该在页面的最右侧，但是我测试的时候他偶尔会离最右侧有十几个像素，我不知道为什么。但是当我打开 DevTools 的时候，这十几个像素又奇妙的被缝合了~

后来一想，管你呢，这肯定是 google 的工程师没有留意到的位置，既然开打 DevTools 可以修复，那就说明触发 window.resize 也能解决这个问题，好吧，那就这样吧：
	
	newCancelFullscreen = function(){
		cancelFullscreen();
		window.onresize();
	};

bug 搞定！

## 三、小结

除了上面提到的两个 bug，还有一个值得注意的是，如果你全屏的那个元素块很高但却没有设置 

	element { overflow:auto; }

之类的东西，你会发现滚烂你的鼠标也滚不动那块区域。

本文介绍了如何使用 javascript 将页面中的某个元素调至全屏，并指出了再使用过程中的两个 bug，希望引起注意！

## 四、参考资料

- <http://baidufe.com/> Alien的笔记