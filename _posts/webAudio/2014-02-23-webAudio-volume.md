---
layout: post
title: 【Voice communications】音量的控制
description: 改变音频的音量是音频处理中最基础的部分，我们可以利用 GainNode 来构建 Mixers 的结构块。
category: webaudio
tags: webAudio javascript volume
---

改变音频的音量是音频处理中最基础的部分，我们可以利用 GainNode 来构建 Mixers 的结构块。GainNode 的接口是很简单的：

	interface GainNode : AudioNode {
	    readonly attribute AudioParam gain;
	};

通过调节 GainNode.gain.value 就可以实现音频大小的调控了。下文会先介绍使用 Processor 来处理，这是一个最通用的节点，可以处理很多东西。在上文[看得到的音频流](webAudio-show-audio)中我们也使用了该节点。

本文地址：{{ site.url }}{{ page.url }}，转载请注明源地址。

**P.S：请在较新版的 chrome 火狐 Firefox 中测试。**

## 一、音频流音量大小的控制 

### 1. 使用 Processor 处理

这个过程比较简单：

> source Node  -> Processor Node -> Destination Node

数据送入到 Processor 后，由于输入 channel 和输出的 channel 之间的对应关系需要我们自己去处理，这些对应关系可以在 onaudioprocess 事件中处理，只要上面的连接导通，那这个事件就一直会处于触发状态，无论是否有数据流送入（其实没有数据流送入也就是数据流 bufferArray 为 0 嘛）。

可以看下面这个 DEMO：

	<audio src="http://qianduannotes.duapp.com/file/tankWar.mp3" id="audio" autoplay></audio>
	<input type="range" min="0" max="100" id="volume" />
	<script type="text/javascript">
	    var AudioContext = AudioContext || webkitAudioContext;
	    var context = new AudioContext();
	    var source = context.createMediaElementSource(audio);
	    // 低通滤波节点（高频信号被过滤，听到的声音会很沉闷）
	    var processor = context.createScriptProcessor(1024, 1, 1);
	    // sourceNode - > processor -> destinationNode
	    source.connect(processor);
	    processor.connect(context.destination);
	    //处理过程
	    processor.onaudioprocess = function(e){
	      //获取输入和输出的数据缓冲区
	      var input = e.inputBuffer.getChannelData(0);
	      var output = e.outputBuffer.getChannelData(0);
	      //将输入数缓冲复制到输出缓冲上，并调整音量
	      for(var  i =0; i < input.length; i++)
	            output[i] = input[i] * value;
	    };
	    //音量控制
	    var value;
	    onload = volume.onchange = function(){
	      value = volume.value / 200;
	    };
	</script>


### 2. 使用 GainNode 控制

上面这种方式，我们可以在 onaudioprocess 事件中拿到几乎我们想要的所有数据，并且可以进行各种处理，可以说 processor 这个节点十分通用，但他的性能并不是高，你应该也看到了上面的代码中有：

	//将输入数缓冲复制到输出缓冲上，并调整音量	
	for(var  i =0; i < input.length; i++)
	    output[i] = input[i] * value;	

需要将数据一一复制到输出节点，上面 demo 中我们设定的 bufferSize 是 1024 ，如果再大一些，或者文中需要处理的节点数太多，那页面将会很卡。Web Audio API 中提供了提供音量的节点，GainNode，既然提供了，毫无疑问，就用它呗~

节点连接方式也是十分的方便：

> source → gain → destination

然后通过一个 range 控件来调节 Gain 的 gain 参数。DEMO如下：

	<audio src="http://qianduannotes.duapp.com/file/tankWar.mp3" id="audio" autoplay></audio>
	<input type="range" min="0" max="100" id="volume" />
	<script type="text/javascript">
	    var AudioContext = AudioContext || webkitAudioContext;
	    var context = new AudioContext();
	    var source = context.createMediaElementSource(audio);
	    var Gain = context.createGain();
	    //连接：source → Gain → destination
	    source.connect(Gain);
	    Gain.connect(context.destination);
	    //音量控制
	    var value;
	    onload = volume.onchange = function(){
	      gain.gain.value = volume.value / 200;
	    };
	</script>

十分轻松简洁的处理一个音量控制。

## 二、小结

本文主要是介绍 Web Audio API 中的 GainNode 节点，以及相关的应用。文中的两个 DEMO ，前者利用 processor 节点来处理，关于这个几点的说明，可以参考上两篇文章的接受；后者是使用 GainNode ，通过控制 Gain.gain.value 的值来调节音量的大小，过程十分简单，所以本文的思路也是比较的清晰。

如果本文中有叙述不正确的地方，还请斧正！

## 三、参考资料

- <http://www.w3.org/TR/webaudio/> W3C Group
- <http://www.web-tinker.com/> 次碳酸钴