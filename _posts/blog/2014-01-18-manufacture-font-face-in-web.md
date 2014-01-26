---
layout: post
title: 再探@font-face及webIcon制作
description: 
category: blog
tags: font-face css3 fontCreator
---

@font-face 不能说他是什么新东西了，在 CSS2.0 规范中就有了这玩意儿，IE4.0 开始就已经出现，只是当时用的不是特别广泛，后来在 CSS2.1 草案中又被删掉。随着 web 的急速发展，@font-face 价值越来越凸显，然后再次被纳入 CSS3 草案中。@font-face 是个什么东西，本文不做过多说明，不太清楚的童鞋可以看这里 <http://www.w3schools.com/css/css3_fonts.asp>。需要强调的是他的书写格式：

	@font-face {
		font-family: <YourWebFontName>;
		src: <source> [<format>][,<source> [<format>]]*;
		[font-weight: <weight>];
		[font-style: <style>];
	}

举个例子：

	@font-face {
		font-family: Gentium;
		src: url(http://example.com/fonts/Gentium.woff) format("woff");
	}

	p { font-family: Gentium, serif; }

format 是一个可选参数，他的作用是提示该资源 URI 所引用的字体格式，关于字体格式，可以看下面列表：

format 格式       |Font 格式	                                        |后缀名
------------------|-----------------------------------------------------|------------------
truetype	      |TrueType	                                            |.ttf
opentype	      |OpenType	                                            |.ttf, .oft
truetype-aat	  |TrueType with Apple Advanced Typography extensions	|.ttf
embedded-opentype |Embedded OpenType	                                |.eot
svg	              |SVG Font	                                            |.svg, .svgz

这堆麻烦的字体格式的出现，是因为各种浏览器对他们的支持程度不一样：

浏览器                  |支持类型
------------------------|---------------------------------------------------------
IE6,7,8                 |仅支持 Embedded OpenType(.eot) 格式。
Firefox 3.5	            |支持 TrueType、OpenType(.ttf, .otf) 格式。
Firefox 3.6	            |支持 TrueType、OpenType(.ttf, .otf) 及 WOFF 格式。
Chrome,Safari,Opera	    |支持 TrueType、OpenType(.ttf, .otf) 及 SVG Font(.svg) 格式。

各浏览器具体的支持情况，可以戳[这里](http://caniuse.com/#feat=fontface)。除了可以利用 font-face 引入各种炫酷的字体，还一个比较大的用途是使用它们替换网页图标。下面就说一说 @font-face 在 web 开发中比较有用的 webIcon。

本文地址：{{ site.url }}{{ page.url }}

## 一、fontCreator 制作 webIcon

这部分说的比较啰嗦，算是一个webicon制作教程吧~ 制作的图片取自张鑫旭大哥的[鑫表情包](http://www.zhangxinxu.com/wordpress/2013/12/%E9%91%AB%E8%A1%A8%E6%83%85%E5%8C%85/)~

首先说一说什么是 web icon，可以看看这个页面，<http://fortawesome.github.io/Font-Awesome/>，随便瞄准网页上的一个图标，（chrome浏览器）点击右键审查元素，可以看到页面上的图标都没有使用图片，而是用的特殊的字体：

	//html
	<i class="fa fa-flag"></i>

	//css
	.fa-flag:before {
		content: "\f024";
	}

从网页资源列表中可以查看到该网页使用了多种字体：

[![web-icon-1]({{ site.repo }}/images/blog-article-images/blog/webicon/web-icon-1.jpg)]({{ site.repo }}/images/blog-article-images/blog/webicon/web-icon-1.jpg)

也可以去看看我写的一个 [DEMO](http://qianduannotes.duapp.com/demo/testFont/index.html)

### 1. 编码与webIcon

编码和字体没有关系，但编码和字符是一一对应的，比如 "\u674e" 对应的是 “李”，"\u9756" 对应的是“靖”。而字体在这里有个什么对应关系呢？不同的字体中显示同一个 unicode 编码，看到的效果是不一样的，我们可以让正楷的 "李" 对应 "\u674e"，也可以用行楷对应，当然我们也可以用一张图片来对应。Web Icon 也就是用图片来对应一些 unicode 码。

但是这里存在一个问题，我们用一张图片来对应 “李” 字，倘若想输入一个正常的“李”字，该怎么去对应呢？ Unicode 包含 0-0x10FFFF 共 1114112 个码位，而汉字占用的码位并不多，只有几千个，在制作 webIcon 时可以选择避开常用的字符集。当然， Unicode 编码也给我们提供了码位的专用区（Pricate Use Area），区间是 E000-F8FF，所以我们可以在这个字符集中放肆 DIY 属于我们自己的字体。

### 2. fontCreator 介绍与字体制作

Web Icon 的制作，网上有很多在线工具，不过这些在线工具都是从已有的图片中选择对应关系，约束性比较大，fontCreator 是一款比较优秀的字体制作工具，它能够很智能的将我们导入的图片转换成黑白色的位图，我们可以编辑和修改各个位图区域，按照自己的意愿 DIY。

打开 fontCreator，新建一个字体：
[![web-icon-tool]({{ site.repo }}/images/blog-article-images/blog/webicon/web-icon-tool.jpg)]({{ site.repo }}/images/blog-article-images/blog/webicon/web-icon-tool.jpg)

为了方便演示，我只保留了 A-Z 的字符，其他的全部删除了。
[![web-icon-step-1]({{ site.repo }}/images/blog-article-images/blog/webicon/web-icon-step-1.jpg)]({{ site.repo }}/images/blog-article-images/blog/webicon/web-icon-step-1.jpg)

选中 A ，右击选择导入图片：
[![web-icon-step-2]({{ site.repo }}/images/blog-article-images/blog/webicon/web-icon-step-2.jpg)]({{ site.repo }}/images/blog-article-images/blog/webicon/web-icon-step-2.jpg)

选择 generate，生成字符内容，然后双击 A，进行细节的编辑（放大，平移）：
[![web-icon-step-3]({{ site.repo }}/images/blog-article-images/blog/webicon/web-icon-step-3.jpg)]({{ site.repo }}/images/blog-article-images/blog/webicon/web-icon-step-3.jpg)

依次处理其他几个字母。Ctrl+S 保存为 barret.ttf。P.S：由于导入表情调整大小位置过于繁琐，我只做了 A-I 这几个码位对应的符号，测试的时候使用字母 A-I 测试即可~

### 3. 本地测试

为了方便本地测试，我们先安装这个字体：
[![web-icon-install]({{ site.repo }}/images/blog-article-images/blog/webicon/web-icon-install.jpg)]({{ site.repo }}/images/blog-article-images/blog/webicon/web-icon-install.jpg)

打开记事本，选择字体为 barret，字号调大一点，输入 BCDEF 等字符，看看效果：
[![web-icon-txt]({{ site.repo }}/images/blog-article-images/blog/webicon/web-icon-txt.jpg)]({{ site.repo }}/images/blog-article-images/blog/webicon/web-icon-txt.jpg)

是不是惊呆了，呵呵~

### 4. 网页测试

网页测试之前，需要先转化下格式，至于原因在前言部分我已经说了。我们拿到的是 ttf 的字体格式，为了兼容所有的浏览器，必须修改进行格式转换。

进入<http://www.fontsquirrel.com/tools/webfont-generator>，选择字体，点击 Agreement，然后点击下载字体：
[![web-icon-transfer]({{ site.repo }}/images/blog-article-images/blog/webicon/web-icon-transfer.jpg)]({{ site.repo }}/images/blog-article-images/blog/webicon/web-icon-transfer.jpg)

转换的拿到的是下面四个文件：
[![web-icon-t-res]({{ site.repo }}/images/blog-article-images/blog/webicon/web-icon-t-res.jpg)]({{ site.repo }}/images/blog-article-images/blog/webicon/web-icon-t-res.jpg)

用下面一段代码测试下结果：

	<style type="text/css">
	@font-face {
		font-family: 'barretregular';
		src: url('./font/barret-webfont.eot');
		src: url('./font/barret-webfont.eot?#iefix') format('embedded-opentype'),
			 url('./font/barret-webfont.woff') format('woff'),
			 url('./font/barret-webfont.ttf') format('truetype'),
			 url('./font/barret-webfont.svg#barretregular') format('svg');
		font-weight: normal;
		font-style: normal;

	}
	div {
		font-family: "barretregular";
		font-size:50px;
	}
	</style>

	<div>
		B​C​D​E​F​G​H​I
	</div>

也可以直接戳这个 [DEMO](http://qianduannotes.duapp.com/demo/testFont/index.html)

## 二、@font-face细节

### 1. local()

### 2. unicode-range

### 3. 兼容性处理

## 三、小结


## 四、参考资料
- <http://www.w3.org/TR/css3-fonts/#the-font-face-rule> W3.ORG
- <http://www.w3help.org/zh-cn/causes/RF1001> W3Help
- <http://www.php100.com/manual/css3_0/@font-face.shtml> Font-Face
- <http://www.fontsquirrel.com/fontface/generator> Tool
