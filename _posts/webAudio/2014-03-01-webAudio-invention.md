---
layout: post
title: 【Voice communications】创建音频流
description: 
category: webaudio
tags: webAudio javascript AudioBuffer
---

本系列文章主要是介绍 Web Audio API 的相关知识，以及 web语音通信 中会遇到的一些问题，阐述可能存在错误，还请多多斧正！

本文地址：{{ site.url }}{{ page.url }}，转载请注明源地址。

**P.S：请在较新版的 chrome 或者 Firefox 中测试。**

## 一、滤波节点

AudioBuffer

arraybuffer

OscillatorNode 

## 二、小结

滤波在通信中一个重要的意义是减少数据传输量，节约频带，提高传送效率，在硬件设备还未跟上语音通信的 web环境中，这个操作是十分有意义的！

本节重点是介绍 BiquadFilterNode 在 AudioContext 环境中的使用，比较简单。

## 三、参考资料

- <http://www.w3.org/TR/webaudio/> W3C Group
- <http://www.web-tinker.com/> 次碳酸钴