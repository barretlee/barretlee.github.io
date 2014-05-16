---
layout: post
title: JavaScript多文件下载
description: 前端很多项目中，都有文件下载的需求，特别是JS生成文件内容，然后让浏览器执行下载操作（例如在线图片编辑、在线代码编辑、iPresst等）。
category: blog
tags: JavaScript download file execCommand
---

对于文件的下载，可以说是一个十分常见的话题，前端的很多项目中都会有这样的需求，比如 highChart 统计图的导出，在线图片编辑中的图片保存，在线代码编辑的代码导出等等。而很多时候，我们只给了一个链接，用户需要右键点击链接，然后选择“另存为”，这个过程虽说不麻烦，但还是需要两步操作，倘若用户想保存页面中的多个链接文件，就得重复操作很多次，最常见的就是英语听力网站上的音频下载，手都要点麻！

本文的目的是介绍如何利用 javascript 进行多文件的下载，也就是当用户点击某个链接或者按钮的时候，同时下载多个文件。这里的“同时”用的不是很准确，在现代浏览器中可以实现多文件的并行下载，而在一些老版本浏览器，如IE8-，此类的浏览器就进行只能单个文件的下载，但是我们可以让多个文件依次保存下来，算是串行下载吧~

本文地址：{{ site.url }}{{ page.url }}，转载请保留原文地址。

## 一、文件类型介绍及其特点

### 1. 一般类型

平时比较常见的有 txt、png、jpg、zip、tar 等各种文件格式，这些文件格式中，一部分浏览器是会直接打开链接显示内容的，而另外一部分，浏览器不识别响应头，或者不能解析对应的格式，于是当做文件直接下载下来了。如：

	<a href="http://barretlee.github.io/test.rar">file</a>

这句代码，若直接点开链接，浏览器将会直接下载该文件。

### 2. dataURL类型

dataURL 也是十分常见的类型，他可以作为 src 或者 url() 的参数送进去。比较常见的有如下几种：

	文本： data:text/plain;这里是正文内容。
	图片： data:image/jpg;base64,/9j/4AAQSkZJRgABAQEA....
	       data:image/png;base64,/9j/4AAQSkZJRgABAQEA....

base64 是用的比较广泛的一种数据格式。

	Base64格式
	data:[][;charset=][;base64],
	Base64 在CSS中的使用：
	.demoImg{ background-image: url("data:image/jpg;base64,/9j/4QMZRXhpZgAASUkqAAgAAAAL...."); }
	Base64 在HTML中的使用：
	<img width="40" height="30" src="data:image/jpg;base64,/9j/4QMZRXhpZgAASUkqAAgAAAAL...." />	     

### 3. Blob 流

Blob 对象表示不可变的、包含原始数据的类文件对象。具体的内容可以参阅[MDN文档](https://developer.mozilla.org/en-US/docs/Web/API/Blob)。

他的使用也是特别的方便，如：

	var aFileParts = ['<a id="a"><b id="b">hey!</b></a>'];
	var oMyBlob = new Blob(aFileParts, {type : 'text/html'}); // the blob

Blob 接收两个参数，一个是数组类型的数据对象，他可以是 ArrayBuffer、ArrayBufferView、Blob、String 等诸多类型；第二个参数是 MINE 类型设置。而本文我们要用到的是 `URLcreateObjectURL()` 这个函数，他的作用是将一个 URL 所代表的内容转化成一个 [DOMString](https://developer.mozilla.org/en-US/docs/Web/API/DOMString)，产生的结果是一个 文件对象 或者 Blob 对象。

### 4. 二进制流

我们利用 File API 读取文件的时候，拿到的是数据的二进制流格式，这些类型可以直接被 ArrayBuffer 等接收，本文中没有用到，就不细说了。

## 二、JavaScript 多文件下载

HTML5 中 a 标签多了一个属性——download，用户点击链接浏览器会打开并显示该链接的内容，若在链接中加了 download 属性，点击该链接不会打开这个文件，而是直接下载。虽说是比较好用，但低版本浏览器不兼容，这个在本届的 2 和 3 中将会讲到解决方案。

在这里，我们可以利用属性检测来判断浏览器类型：

	h5Down = document.createElement("a").hasOwnProperty("download");


### 1. a 标签 download 属性的使用

利用 download 属性可以直接下载单个文件，若想点击一次下载多个文件，就得稍加处理下了：

	function downloadFile(fileName, content){
		var aLink = document.createElement("a"),
			evt = document.createEvent("HTMLEvents");

		evt.initEvent("click");
		aLink.download = fileName;
		aLink.href = content;

		aLink.dispatchEvent(evt);
	}

download 属性的作用除了让浏览器忽略文件的 MIME 类型之外，还会把该属性的值作为文件名。你可以在 chrome 控制台运行这句程序：

	downloadFile("barretlee.html", "./");

浏览器会提示是否保留（下载）该 html 文件。之前我们提到文件类型还可能是 dataURL 或者是 Blob 流，为了让程序也支持这些数据类型，稍微修改下上面的函数：

	function downloadFile(fileName, content){
	    var aLink = document.createElement('a');
	      , blob = new Blob([content])
	      , evt = document.createEvent("HTMLEvents");

	    evt.initEvent("click");

	    aLink.download = fileName;
	    aLink.href = URL.createObjectURL(blob);
	    aLink.dispatchEvent(evt);
	}

`new Blob([content])`，现将文件转换成一个 Blog 流，然后，使用 `URL.createObjectURL()` 将其转换成一个 DOMString。这样我们就支持 data64 和其他数据类型的 content 了~

### 2. window.open 之后 execCommand("SaveAs")

上面也提到了，尽管 download 属性是十分便利的 H5 利器，但低版本 IE 根本不赏脸，要说方法，IE 还是有很多方式去转换的，比如 ADOBE.STREAM 的 activeX 对象可以把文件转换成文件流，然后写入到一个要保存的文件中。这里要谈到的是略微方便一点的方式：先把内容写到一个新开的 window 对象中，然后利用 execCommand 执行保存命令，就相当于我们在页面上按下 Ctrl+S，这样页面内的信息都会 down 下来。

	// 将文件在一个 window 窗口中打开，并隐藏这个窗口。
	var win = window.open("path/to/file.ext", "new Window", "width=0,height=0");
	// 在 win 窗口中按下 ctrl+s 保存窗口内容
	win.document.execCommand("SaveAs", true, "filename.ext");
	// 使用完了，关闭窗口
	win.close();

这个过程十分明了，不过这里会存在一个问题，并不是程序的问题，而是浏览器的问题，如果我们用 搜狗浏览器 或者 360浏览器 打开新窗口的话，他会新开一个标签页，而不是新开一个窗口，更可恶的时候部分浏览器不允许 window.open （这个可以设置）。所以只好另觅他法了。

### 3. iframe 中操作

既然新开一个窗口那么麻烦，我就在本窗口下完成工作~

	function IEdownloadFile(fileName, contentOrPath){
		var ifr = document.createElement('iframe');

		ifr.style.display = 'none';
		ifr.src = contentOrPath;

		document.body.appendChild(ifr);


		// 保存页面 -> 保存文件
		ifr.contentWindow.document.execCommand('SaveAs', false, fileName);
		document.body.removeChild(ifr);
	}

一般的链接我们可以直接给 iframe 添加 src 属性，然后执行 saveAs 命令，倘若我们使用的是 data64 编码的文件，这个怎么办？

	var isImg = contentOrPath.slice(0, 10) === "data:image"；

	// dataURL 的情况
	isImg && ifr.contentWindow.document.write("<img src='" + 
			contentOrPath + "' />");

这个也比较好处理，直接把文件写入到 iframe 中，然后在执行保存。

## 三、代码的封装与接口介绍

### 1. 代码的封装以及相关 DEMO

封装：[lib.js](https://github.com/barretlee/javascript-multiple-download/blob/master/lib.js)
DEMO：[javascript-multiple-download](http://rawgithub.com/barretlee/javascript-multiple-download/master/test/test.html)

### 2. 接口的调用

提供了三个接口，支持单文件下载，多文件下载，多文件下载自定义命名。

1）单文件下载

	Downer("./file/test.txt");

2）多文件下载
	
	Downer(["./file/test.txt","./file/test.txt"]);

3）多文件下载自定义命名
	
	Downer({
		"1.txt":"./file/test.txt",
		"2.jpg":"./file/test.jpg"
	});	

文件的 URL 如 `./file/test.txt` 都可以改成 base64 或者其他格式。

## 四、服务器支持与后端实现

### 1. 后端实现

后端实现的原理，就是在响应头中加入一些特殊的标记，如前端发送这样的请求：

	function download(path) {
	    var ifrm = document.getElementById(frame);
	    ifrm.src = "download.php?path="+path;
	}

后端的响应为

	<?php 
	   header("Content-Type: application/octet-stream");
	   header("Content-Disposition: attachment; filename=".$_GET['path']);
	   readfile($_GET['path']);
	?>

告诉浏览器这是一个流文件，作为附件方式发送给你，请忽略 MINE type，直接保存。

### 2. 服务器配置

若后台是 apche 作为服务器，可以配置 htaccess 文件：

	<filesmatch "\.(zip|rar)$"="">
	Header set Content-Disposition attachment
	</filesmatch>

意思是只要请求的是 zip 或者 rar 类型的文件，那么久添加一个 `Content-Disposition:attachment` 的响应头。这样就可以在 php 代码中省略麻烦的操作。

## 四、小结

由于行文仓促，文中会有不少错误，对多文件下载有更好的提议，希望提出来共同分享！

## 五、参考资料

- [在浏览器端用JS创建和下载文件](http://www.alloyteam.com/2014/01/use-js-file-download/>) AlloyTeam
- [Starting file download with Javascript](http://thezedienblog.blogspot.com/2013/05/starting-file-download-with-javascript.html) Ahzaz's Blog
- [Blob 流](https://developer.mozilla.org/en-US/docs/Web/API/Blob) MDN