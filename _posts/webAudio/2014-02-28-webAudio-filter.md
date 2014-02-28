---
layout: post
title: 【Voice communications】声音的滤波
description: 通过设备获取音频流会不可避免的渗入一些杂音，这些杂音可能来自你周边的环境，也有可能来自录音设备本身，一些低频的声音还好，人耳难以分辨出来，但是那些高频的白噪声对音质的影响是特别大的，如我们听收音机没有调到正确的频率上，会听到吱吱兹兹的刺耳的杂音。
category: webaudio
tags: webAudio javascript filter
---

本系列文章主要是介绍 Web Audio API 的相关知识，以及 web语音通信 中会遇到的一些问题，阐述可能存在错误，还请多多斧正！

通过设备获取音频流会不可避免的渗入一些杂音，这些杂音可能来自你周边的环境，也有可能来自录音设备本身，一些低频的声音还好，人耳难以分辨出来，但是那些高频的白噪声对音质的影响是特别大的，如我们听收音机没有调到正确的频率上，会听到吱吱兹兹的刺耳的杂音。这些杂音不仅增大了音频流信号本身的体积，而且我们的耳朵也不喜欢，所以在传输之前必须对音频做相应的滤波处理。

本文地址：{{ site.url }}{{ page.url }}，转载请注明源地址。

**P.S：请在较新版的 chrome 火狐 Firefox 中测试。**

## 一、滤波节点

### 1. 接口介绍

频率，是单位时间内完成振动的次数，是描述振动物体往复运动频繁程度的量。一段音频流中包含了各种频率，温和的音乐频率在一个范围之内，超过这个范围的声音一般就是噪声，人和人之间的语音交流，声音也是在一定的频段之中。

在 AudioContext 中用于滤波的节点叫做 BiquadFilterNode，Biquad 是双二阶的意思，这里涉及到了很多通信中专业词汇，我们暂时可以不用在意。BiquadFilterType 包含了各种滤波类型：

	enum BiquadFilterType {
	    "lowpass",
	    "highpass",
	    "bandpass",
	    "lowshelf",
	    "highshelf",
	    "peaking",
	    "notch",
	    "allpass"
	};

用的比较多的就是 lowpass（低通滤波），highpass（高通滤波），bandpass（带通滤波）。低通滤波就是过滤某个临界点的高频信号，只让低频信号通过，高通滤波反之。带通滤波就是允许某个频段的信号通过。这个节点的参数比较多：

    
	attribute BiquadFilterType type;
	readonly attribute AudioParam frequency; // in Hertz
	readonly attribute AudioParam detune; // in Cents
	readonly attribute AudioParam Q; // Quality factor
	readonly attribute AudioParam gain; // in Decibels

	void getFrequencyResponse(Float32Array frequencyHz,
	                          Float32Array magResponse,
	                          Float32Array phaseResponse);

	};

其中几个参数的取值范围是：

>	**Q**
>	默认是 1, 取值从 0.0001 到 1000.
>	**gain**
>	默认是 0, 取值从 -40 到 40.

### 2. 初始化接口

我们可以在初始化的时候将 BiquadFilterType 送进去：

	// 初始化为低通滤波
	var filter = context.createBiquadFilter("lowpass");

当然，我们也可以通过设置他的 AudioParam 来控制参数：

	var filter = context.createBiquadFilter();
	// 设置为低通滤波
	filter.type = filter.LOWPASS;
	// 只允许频率小于 800Hz 的音频信号通过
	filter.frequency.value = 800;

两只方式都是一样的，都好控制。

### 3. DEMO 测试

简单点的话，中间只用一个 filter 节点就可以了，使用低通滤波，将频率设置为 800Hz，可以听到声音很闷，声音不是变小了，而是变闷了~节点之间的连接方式是：

> Source -> Filter -> Destination

代码：

	var AudioContext = AudioContext || webkitAudioContext;
	var context = new AudioContext;
	//创建节点
	var audio = new Audio("http://qianduannotes.duapp.com/file/SuperMario.mp3");
	audio.loop = true;
	var media = context.createMediaElementSource(audio);
	var filter = context.createBiquadFilter();
	filter.type=filter.LOWPASS;
	filter.frequency.value=800;
	//连接：media → filter → destination
	media.connect(filter);
	filter.connect(context.destination);

为了方面查看改变频率之后波形的变化，我做了一些处理：

> Source -> Filter -> Analyser -> Destination
>                        |
>                        +-----> 波形绘制到 Canvas


	<canvas id="canvas" width="400" height="300"></canvas><br />
	<input type="range" min="0" max="100" id="volume" />
	<input type="button" onclick="audio.play()" value="播放" />
	<input type="button" onclick="audio.pause()" value="暂停" />
	<script type="text/javascript">
	var AudioContext=AudioContext||webkitAudioContext;
	var context=new AudioContext;
	//创建节点
	var audio = new Audio("http://qianduannotes.duapp.com/file/SuperMario.mp3");
	audio.loop = true;
	var media=context.createMediaElementSource(audio);
	var filter=context.createBiquadFilter();
	var analyser=context.createAnalyser();
	//只允许小于800的频率通过
	filter.type=filter.LOWPASS;
	filter.frequency.value=800;
	//Canvas初始化
	var width=canvas.width,height=canvas.height;
	var g=canvas.getContext("2d");
	g.translate(0.5,height/2+0.5);
	//连接：media → filter → analyser → destination
	media.connect(filter);
	filter.connect(analyser);
	analyser.connect(context.destination);
	//以fftSize为长度创建一个字节数组作为数据缓冲区
	var output=new Uint8Array(analyser.fftSize);
	//播放帧
	(function callee(e){
	  analyser.getByteTimeDomainData(output);
	  //将缓冲区的数据绘制到Canvas上
	  g.clearRect(-0.5,-height/2-0.5,width,height);
	  g.beginPath();
	  for(var i=0;i<width;i++)
	    g.lineTo(i,height*(output[output.length*i/width|0]/256-0.5));
	  g.stroke();
	  //请求下一帧
	  requestAnimationFrame(callee);
	})();
	//播放
	audio.play();
	load = volume.onchange = function(){
	    filter.frequency.value = volume.value * volume.value;
	}
	</script>

这里频率的变化是：

	filter.frequency.value = volume.value * volume.value;

线性变化可能不太明显，所以改成了平方变化。

## 二、小结

滤波在通信中一个重要的意义是减少数据传输量，节约频带，提高传送效率，在硬件设备还未跟上语音通信的 web环境中，这个操作是十分有意义的！

本节重点是介绍 BiquadFilterNode 在 AudioContext 环境中的使用，比较简单。

## 三、参考资料

- <http://www.w3.org/TR/webaudio/> W3C Group
- <http://www.web-tinker.com/> 次碳酸钴