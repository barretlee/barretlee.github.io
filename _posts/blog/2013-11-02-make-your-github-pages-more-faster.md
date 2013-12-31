---
layout: post
title: 让你的github pages跑得更快
description: 使用github pages做博客的童鞋，肯定是深深地感受到github提供的jekyll编译乌龟速度和图片下载的无限缓慢，进去看看这篇博客吧~
category: blog
tags: 速度 github
---


Github pages已经用了一段时间了，有很多要吐槽的地方

1. 上传代码不能实时预览，需等待后台系统编译，windows用户内伤- -
2. 每次编译完后，本地所有的缓存都过期，需要重新加载
3. 不能控制后台，至少是不好控制

其实github pages本身并不适合做个人博客，很多开源的框架、库、新技术，诸如seajs、requirejs，angularjs等会比较偏爱它。首先它和github的代码管理联系十分紧密，同时也很容易引入gist的代码，当然也内置了代码高亮、分页、站点配置等功能。

那它适合做什么呢？

- 开源产品的介绍
- 更新比较少的页面展示
- 个人(公司)作品展示，如twitter的几个开源软件的展示 [twitter github pages][1]
- ...

用着不爽的地方很多，越是难用，越是考验在艰难环境下做小强的精神。对于windows用户，我是这么处理的（windows和linux对我来说，是一样的），准备两个工具，一个是svn，一个是github for windows。

[![svn]({{ site.repo }}/images/blog-article-images/blog/svn.png)]({{ site.repo }}/images/blog-article-images/blog/svn.png)
[![github for windows]({{ site.repo }}/images/blog-article-images/blog/github.jpg)]({{ site.repo }}/images/blog-article-images/blog/github.jpg)

然后把github的repository克隆到一个[BAE][2]的svn目录下。BAE，就是baidu application engine，不清楚的去官网上了解下。为什么要用BAE呢，之前也说了，Github每次上传代码都会重新编译一次，这样一来，一些静态文件的Last-Modified属性就会改变，再次访问的时候又得重新加载，这样的体验是相当不好的，我们可以把静态文件放到BAE上面去，也算是一个免费的CDN吧，一般来说速度还不错。

那为什么要把repository建在SVN目录下呢？当然是为了方便管理代码，如果不这样做，你的article文件和静态文件就需要放在两个文件夹中，编辑起来麻烦，还不如直接放到一起，然后丢到SVN下，处理好了也方便把整个文件都push到master上去。

这两天在使用BAE的时候，发现有时候请求静态文件，从chrome DevTool的netWork一栏可以看出请求一直是pending状态，搞不明白BAE是肿么了，貌似会经常出点小bug，SAE的效果要稍好一些，但是SAE要云豆，你要是不舍得那几块钱的话，建议还是用BAE，GAE其实也不错，只是人家国外（或者香港）的服务器，速度可能会比较慢。

用github的童鞋一些git命令应该是去熟悉过了，github也支持svn，所以对命令不熟悉或者没了解过git命令的话，可以使用svn进行操作。



[1]: http://twitter.github.io/  "twitter github pages"
[2]: http://developer.baidu.com/ "BAE"