---
layout: post
title: 【Voice communications】声道的转换
description: 很多粤语剧都提供了两个声道，一个左声道为粤语，一个右声道有国语。观看者可以自由切换声道，那么切换声道的原理是什么呢？
category: webaudio
tags: webAudio javascript crossFading
---

本系列文章主要是介绍 Web Audio API 的相关知识，以及 web语音通信 中会遇到的一些问题，阐述可能存在错误，还请多多斧正！

很多粤语剧都提供了两个声道，一个左声道为粤语，一个右声道有国语。观看者可以自由切换声道，那么切换声道的原理是什么呢？在播放器中，只需要把不同的声道切换到声轨就行了，因为有左右两个声道，所以播放器至少是包含两个声轨的。如果我们想听粤语，只需要将右声道声轨的声音设置为 0，或者临时删掉右声道声轨。本文主要是利用 GainNode 节点控制音量的属性实现两个音轨之间的相互切换，Cross-fading 的意思可以在后面的 DEMO 中用耳朵体会出来~

本文地址：{{ site.url }}{{ page.url }}，转载请注明源地址。

**P.S：请在较新版的 chrome 或者 Firefox 中测试。**

## 一、两个声音之间的声轨切换

### 1. 原理介绍

在一个 AudioContext 中可以输入多个音频流，而这些音频流在 AudioContext 这个环境中辗转反侧，最后的出路也就是 DestinationNode：

> source 1 ---+
>             |----> Destination
> source 2 ---+

而要实现上面两个声轨的切换，实则是它容易了，我们可以在他们到达 Destination 之前，加一个 GainNode，[上文](webAudio-volume) 已经对 GainNode 做了详细的说明，本文就不继续赘述了。

### 2. DEMO 演示

首先要创建两个音频，平时我们都是使用 audio 节点带上 src 属性，插入到 DOM 中让其自动播放音频，本文将使用其他的方式拿到音频流：

	var tank = new Audio("http://qianduannotes.duapp.com/file/tankWar.mp3");

我准备了两个音频，一个是 tankWar.mp3 ，经典的坦克大战开场音乐，另一个是 SuperMario.mp3，超级玛丽的背景音乐，前者稍微短一些，所以在播放的时候将其设定为循环播放：

	tank.loop = true;

然后利用 createMediaElementSource 这个函数从 Media 中获取到音频流：
	
	var source1 = context.createMediaElementSource(tank);

过程十分简单，整个 AudioContext 的连接模型为：

> source 1 -->  GainNode 1 -+
>                           |----> Destination
> source 2 -->  GainNode 2 -+

然后用同一个控制棒来控制 GainNode 1 和 2。

	<input type="range" min="0" max="100" id="volume" />
	<script type="text/javascript">
	    var tank = new Audio("http://qianduannotes.duapp.com/file/tankWar.mp3");
	    tank.loop = true;
	    var mario = new Audio("http://qianduannotes.duapp.com/file/SuperMario.mp3");
	    mario.loop = true;

	    var AudioContext = AudioContext || webkitAudioContext;
	    var context = new AudioContext();
	    var source1 = context.createMediaElementSource(tank);
	    var source2 = context.createMediaElementSource(mario);
	    var gain1 = context.createGain();
	    var gain2 = context.createGain();
	    //连接：source → gain → destination
	    source1.connect(gain1);
	    source2.connect(gain2);
	    gain1.connect(context.destination);
	    gain2.connect(context.destination);
	    //音量控制
	    var value;
	    onload = volume.onchange = function(){
	      gain1.gain.value = volume.value / 100;
	      gain2.gain.value = 1 - volume.value / 100;
	    };

	    tank.onload = mario.onlond = function(){
	        console.log("var1, var2");
	    }
	    tank.play();
	    mario.play();
	    
	</script>

代码没有封装，写的稍微有些乱，不过看了之前的说明，应该可以理解这段代码~

### 3. 效果增强

上面的音量控制，我使用的是线性控制：

	gain1.gain.value = volume.value / 100;
	gain2.gain.value = 1 - volume.value / 100;

效果并不是特别好，他对音量的控制如下图：

[![volume-linear]({{ site.repo }}/images/blog-article-images/blog/audio/linear-fade.png)]({{ site.repo }}/images/blog-article-images/blog/audio/linear-fade.png)

稍微修改下控制函数：

	var vol = volume.value / 100;
	gain1.gain.value = Math.cos(vol * 0.5 * Math.PI);
  	gain2.gain.value = Math.cos((1.0 - vol) * 0.5 * Math.PI);

可以感受到音量的变化是这样的：

[![volume-equal]({{ site.repo }}/images/blog-article-images/blog/audio/equal-fade.png)]({{ site.repo }}/images/blog-article-images/blog/audio/equal-fade.png)

详情可以戳这个 DEMO ：<http://qianduannotes.duapp.com/demo/audio/>


## 二、小结

本文的目的是介绍 Web Audio API 的 GainNode 节点的使用，并将此应用到声道的切换之中，上面的例子不能算是严格的声道切换，但如果我们只给 volume 参数设定 0 ,50, 100 这三个值，那效果跟声道的切换就差不多了~

由于这几篇文章都是关于 Node 之间的相互连接，技术含量并不多，主要是读懂 API 以及相关使用方法。行文仓促，如有错误地方，还请斧正！

## 三、参考资料

- <http://www.w3.org/TR/webaudio/> W3C Group
- <http://www.web-tinker.com/> 次碳酸钴