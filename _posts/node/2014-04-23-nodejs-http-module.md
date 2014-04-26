---
layout: post
title: 深入浅出NodeJS——数据通信，HTTP模块运行机制
description: 整个数据通信就是围绕请求（Request）和响应（Response）两个点进行的设计和架构。在对请求和响应处理之前，我们必须深入的理解这两者之间的关系。
category: nodejs
tags: nodejs http
---

客户端向服务器发送一个 HTTP 请求，如下：

	GET / HTTP/1.1
	Host: barret:3333
	Connection: keep-alive

包含的内容很简单，“我是谁，我要什么”。上面的请求是 Chrome 浏览器向服务器请求 http://barret:3333 这个内容。服务器的响应是：

	HTTP/1.1 200 OK
	Date: Tue, 22 Apr 2014 15:37:43 GMT
	Connection: keep-alive
	Transfer-Encoding: chunked

告诉浏览器，东西到了，收货！上面给出的只是 Response 的 Header 部分，服务器的响应分为 Header 和 Body 两个部分。

这样的一问一答在 Node 中是如何执行的呢？本文主要讲述数据交互过程中，HTTP 模块的运行机制。

本文地址：{{ site.url }}{{ page.url }}，转载请注明源地址。

## 一、请求和响应

整个数据通信就是围绕请求（Request）和响应（Response）两个点进行的设计和架构。在对请求和响应处理之前，我们必须深入的理解这两者之间的关系。

### 1. 请求 - Request

请求是由客户端发起的，首先来创建一个服务器：

	var http = require("http");
	var server = http.createServer(function(req, res){

	    res.end("Hello World");
	});

	server.listen(3333, function(){
	   console.log("Listen at port 3333.");
	});

对于这段代码的理解，可以参考[上篇文章](/nodejs-net-module)对 TCP 服务器的说明，我们创建了一个监听在 3333 端口的服务器，

### 2. 响应 - Response

## 二、客户端的构建

## 三、代理服务器

## 四、小结

## 五、参考资料

- <http://nodejs.org/api/http.html>
