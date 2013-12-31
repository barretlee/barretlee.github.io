---
layout: post
title: 突然犯2了，整个页面只剩下百度统计
description: 本想着文档加载完毕之后再把百度统计加上，这样对浏览者也公平点吧，结果忘了document流已经关闭了，而百度统计里头有一个二货document.write，哎...
category: blog
tags:   document.write 统计
---

因为用的是windows系统，不能安装[jekyll][1]，所以一直都是上传代码到[github][2]然后线上预览，这种方式也挺蛋疼的，如果是添加(add)或是删除(delete)资源，github page可以马上响应，但如果是修改(modify)文件，尤其是css、js之类的文件，需要等十多分钟才能生效。

之前提交了一版代码，本想着让百度统计的代码最后加载，于是这样了：

	$(function(){
		// tongji here.
	});

`$(function(){})`跟`$(document).ready(function(){})`两者是等价的，翻开jQuery的源码，我们可以找到DOMContentLoaded和`document.readyState`等相关的字眼。

刚跑到<http://www.w3.org/>上去看规范了，东西实在是太多，看了半个多小时才找到我想要的答案。DOMContentLoaded和`document.readyState`一些状态的标记大概是这样的：
	
1. `document.readyState`在文档加载完成后被标记为 "interactive"
2. DOMContentLoaded事件bubble触发
3. `document.readyState`接着被标记为 "complete"
4. `document`遇到`EOF`结束符后close掉当前输出流

相关参阅：[html语法解析][3],  [关闭输出流][4]


当页面文档完全加载完毕并解析完毕之后，会触发DOMContentLoaded事件，而此时document文档流是没有关闭输出的。那么问题就出来鸟。这是本博客所用到的百度统计代码：

	var _bdhmProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");

	document.write(unescape("%3Cscript src='" + _bdhmProtocol + 
	"hm.baidu.com/h.js%3Ff4a45383b9990291e07a09cb3f0007a6' type='text/javascript'%3E%3C/script%3E"));

文档流没有关闭之前使用`document.write`应该不会重写整个页面的内容啊？！但结果就是整个页面只剩下百度统计的图标了- -

唯一能说的通的理由就是，使用`$(function(){})`包裹的统计代码是在文档流输出关闭之后执行的。`document.write`之前如果没写`document.open`会默认添加，这个操作会新开一个文档输出流，从而覆盖当前的页面文档。那到底是什么原因导致这里的统计代码在`document.close`才执行呢？

我揣测是以下原因造成：

1. 我没有完全看懂jQuery的源码，理解错了
2. $()中有多个function排队执行，这个百度统计的代码放在最后，所以在队列的最后面，在等待执行的过程中，文档流已经停止输出了
3. 我太累了...

	
 ===========



 这篇文章是昨天（29号）写的，今天中午吃完午饭回来继续考虑了下，上面说的第四点`document`遇到`EOF`结束符后close掉当前输出流，这个应该是在`document.readyState`被标记为 "interactive"的时候就已经触发了，所以DOMContentLoaded事件已经触发了。嗯嗯，应该就是这样了。

  



### 为何百度统计代码要使用 document.write

既然这玩意儿这么容易出问题，并且出的是大问题(整个页面除了一个百度统计的图标啥也没了)，那为何百度统计给出的所谓的安装代码为何用`document.write`呢，这不是闲着没事干么！

	(function(url, charset){
		var baseElement = head.getElementsByTagName("base")[0],
			insertPosition = document.getElementsByTagName("head")[0] || doc.documentElement,
			node = doc.createElement("script");

		node.charset = charset;
		node.async = true;
		node.src = url;

		// ref: #185 & http://dev.jquery.com/ticket/2709
		baseElement ?
	      head.insertBefore(node, baseElement) :
	      head.appendChild(node)

	})(url= "//hm.baidu.com/h.js%3Ff4a45383b9990291e07a09cb3f0007a6", charset = "utf-8");

上述代码中，head标签，如果你没写，(webkit内核和Geoko内核)浏览器也会兼容性地补上，详情请参阅[HTML语法解析][3]，IE我不太清楚。




[1]: http://jekyllrb.com "jekyll"
[2]: https://github.com/barretlee/barretlee.github.io "Barret Lee's github"
[3]: http://www.w3.org/TR/html5/syntax.html#the-end  "HTML语法解析"
[4]: http://www.w3.org/TR/html5/dom.html#closing-the-input-stream "document.close()"