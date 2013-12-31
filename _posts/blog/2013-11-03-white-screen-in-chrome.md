---
layout: post
title: chrome浏览器渲染白屏问题剖析
description: 打开一个比较大的页面，加载完毕之前快速滚屏会产生白屏现象，这个不能算浏览器的bug，那它是怎么造成的呢？
category: blog
tags: 速度 github
---

刚截图十几次，终于捕捉到了这个白屏现象，hiahia~~
[![svn]({{ site.repo }}/images/blog-article-images/blog/white-screen.jpg)]({{ site.repo }}/images/blog-article-images/blog/white-screen.jpg)

大家可以很清晰地看到下边还木有渲染完毕的透明层，这是一个十分普遍的问题，经常遇到。我的浏览器版本是
[![svn]({{ site.repo }}/images/blog-article-images/blog/chrome-version.jpg)]({{ site.repo }}/images/blog-article-images/blog/chrome-version.jpg)
到目前为止应该是最新版(release版本)，之前的版本应该也存在类似的问题。只要处理好代码，这种体验相当不好的白屏问题是可以避免的，Qzone的页面貌似就没有这个现象。首先我们来聊一聊这个问题是怎么产生的，这涉及到chrome浏览器对网页的解析和渲染。

> 渲染引擎首先通过网络获得所请求文档的内容，通常**以8K分块的方式**完成。<br />下面是渲染引擎在取得内容之后的基本流程：<br />解析html以**构建dom树->构建render树->布局render树->绘制render树**[![svn]({{ site.repo }}/images/blog-article-images/blog/webkit-render.png)]({{ site.repo }}/images/blog-article-images/blog/webkit-render.png)

渲染引擎开始解析html，并将标签转化为内容树中的dom节点。接着，它解析外部CSS文件及style标签中的样式信息。这些样式信息以及html中的可见性指令将被用来构建另一棵树——render树。

Render树由一些包含有颜色和大小等属性的矩形组成，它们将被按照正确的顺序显示到屏幕上。

Render树构建好了之后，将会执行布局过程，它将确定每个节点在屏幕上的确切坐标。再下一步就是绘制，即遍历render树，并使用UI后端层绘制每个节点。

值得注意的是，这个过程是逐步完成的，为了更好的用户体验，渲染引擎将会尽可能早的将内容呈现到屏幕上，并不会等到所有的html都解析完成之后再去构建和布局render树。它是解析完一部分内容就显示一部分内容，同时，可能还在通过网络下载其余内容。

如果我们在Render树未完全绘制并渲染之前，向下快速拖动滚动条会看到上图所示的白屏现象。那这种现象可以通过什么方式来处理呢？应该说这是避免不了的，我们能做的就是：

- 遵循XHTML编码规则，错误的标签在解析的过程中，浏览器需要花费很多时间去进行容错处理（一些push和pop操作），会在构建DOM树的时间花掉额外的时间。
- 优化HTML代码，减少代码层次（有些网站堆砌一二十层标签的做法实在是没法不让人吐槽）[![svn]({{ site.repo }}/images/blog-article-images/blog/renren.jpg)]({{ site.repo }}/images/blog-article-images/blog/renren.jpg)
- 优化css，减少样式计算所需要的时间，`div div div div｛…｝`，尽量不要出现这么复杂的选择符。
- 尽量不要使用 `document.write`，html不能被自顶向下或自底向上地被解析，一种重要的原因也是因为脚本标签中含有这个所导致的，他可能会添加标签。
- 缩短第一屏的内容，后几屏的内容用js异步+判断滚动条动作载入，减少构建Render树和布局render树的时间

关于浏览器的工作原理，有兴趣的可以上网[搜搜](https://www.google.com.hk/search?q=%E6%B5%8F%E8%A7%88%E5%99%A8%E7%9A%84%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86)。


