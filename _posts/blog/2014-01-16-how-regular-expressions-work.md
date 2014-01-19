---
layout: post
title: 进阶正则表达式
description: 了解正则表达式的内部工作原理，可以更加高效的使用正则，写出更加优质的代码。
category: blog
tags: JavaScript reg
---

关于正则表达式，网上可以搜到一大片文章，我之前也搜集了一些资料，并做了排版整理，可以看这篇文章<http://www.cnblogs.com/hustskyking/archive/2013/06/04/RegExp.html>，作为基础入门讲解，这篇文章说的十分到位。

记得最开始学习正则，是使用 php 做一个爬虫程序。为了获取指定的信息，必须用一定的方式把有规律的数据匹配出来，而正则是首选。下面是当时写的爬虫程序的一个代码片段：

	$regdata = "/<font size=\"3\">((?<bf>[^<]*)<br \/>){0,1}⊙(?<bs>.{12})\S*\s/";

	//获取页面
	$html = file_get_contents('http://www.qnwz.cn/html/daodu/201107/282277.html');	
	$html = iconv("GBK", "UTF-8", $html);
	if ($html == '') { 
		die("<hr />出错：【错】无法打开《青年文摘》页面<hr />");
	}

	//匹配页面信息
	preg_match_all($regdata, $html, $mdata);

	print_r($mdata);

当时写代码还真是欢乐多，什么都不懂，什么都是新知识，学起来津津有味。我觉得学习知识一定要把握最基本的原理，先把一个知识的大概轮廓搞清楚，然后学习怎么去使用他，完了就是深入学习，了解底层基础实现。很多人解决问题都是靠经验，这个当然很重要，但如果我们弄懂了一项技术最底层的实现，完全可以靠自己的推断分析出问题的根源。我对一些公司的招聘要求特别不满，说什么要三年五年Javascript编程经验云云，经验当然和时间成正相关，但是对于那些没有三年五年工作经验却照样能够解决实际的人呢？算是小小的吐槽吧，下面进入正题。

本文地址：<http://barretlee.com/how-regular-expressions-work>

## 一、正则表达式的工作机制

画了一个草图，简单的说明了下正则表达式的工作原理。

		+--------+
		|  编译  |
		+--------+
	         |
	         ↓
	+----------------+
	|  设置开始位置   |←---------+
	+----------------+          ↑
	         |                  |
	         ↓               其 |
	+----------------+       他 |
	|  匹配 & 回溯   |       路 |
	+----------------+       径 |
	         |                  |
	         ↓                  |
	+----------------+          |
	|  成功 or 失败   |---------→+
	+----------------+


你写的任何一个正则直接量或者 RegExp 都会被浏览器编译为一个原生代码程序，第一次匹配是从头个字符开始，匹配成功时，他会查看是否还有其他的路径没有匹配到，如果有的话，回退到上一次成功匹配的位置，然后重复第二步操作，不过此时开始匹配的位置（lastIndex）是上次成功位置加 1.这样说有点难以理解，下面写了一个 demo，这个 demo 就是实现一个正则表达式的解析引擎，因为逻辑和效果的表现都太复杂了，所以只做了一个简单的演示：

<div id="demoBox" style="margin:20px 10px;position:relative; line-height:30px; font-size:16px; font-family:Courier;">
	Reg: <div class="d_reg" style="border:1px solid #CCC; margin-bottom:10px; padding:10px; display:inline-block; background:#F8F8F8; font-size:20px;">/<span data-index="0">H</span><span data-index="1">(<span data-index="2">i</span>|<span data-index="3">ello</span>)</span><span data-index="4">,</span><span data-index="5"> </span><span data-index="6">b</span><span data-index="7">a</span><span data-index="8">r</span><span data-index="9">r</span><span data-index="10">e</span><span data-index="11">t</span>/g</div><br />
	Str: <div class="d_str" style="border:1px solid #CCC; margin-bottom:10px; padding:10px; display:inline-block; font-size:28px;">Lalala. Hi, barret. Hello, John</div><br />
	<div class="aniBox" style=" position:absolute; border:none; color:orange;top:114px; left:61px; text-decoration:underline;font-size:28px;"></div>
	<div class="d_info" style=" border:1px solid #CCC; margin-bottom:10px; padding:10px; display:inline-block; position:absolute; left:350px; top:0; color:orange; font-weight:bold;"><a href="#" id="runDemo" onclick="return false;">点击开始演示</a></div>
</div>

如果要深入了解正则表达式的内部原理，必须先理解匹配过程的一个基础环节——回溯，他是驱动正则的一个基本动力，也是性能消耗、计算消耗的根源。

## 二、回溯

正则表达式中出现最多的是分支和量词，上面的 demo 中可以很清楚的看到 hi 和 hello 这两个分支，当匹配到第一个字符 h 之后，进入 (i|ello) 的分支选择，首先是进入 i 分支，当 i 分支匹配完了之后，再回到分支选择的位置，重新选择分支。简单点说，分支就是 `|` 操作符带来的多项选择问题，而量词指的是诸如 `*, +?, {m,n}` 之类的符号，正则表达式必须决定何时尝试匹配更多的字符。下面结合回溯详细说说分支和量词。

### 1. 分支

继续分析上面那个案例。`"Lalala. Hi, barret. Hello, John".match(/H(i|ello), barret/g)`,首先会查找 H 字符，在第九位找到 H 之后，正则子表达式提供了两个选择 (i|ello)，程序会先拿到最左边的那个分支，进入分支后，在第十位匹配到了 i，接着匹配下一个字符，下一个字符是逗号，接着刚才的位置又匹配到了这个逗号，然后再匹配下一个，依次类推，直到完整匹配到整个正则的内容，此时程序会在`Hi, barret`后面做一个标记，表示在这里进行了一次成功的匹配。但程序到此并没有结束，因为后面加了一个全局参数，依然使用这个分支往后匹配，很显然，到了 Hello 的时候，Hi 分支匹配不了了，于是程序会回溯到刚才我们做标记的位置，并进入第二个分支，从做标记的位置重新开始匹配，依次循环。

只要正则表达式没有尝试完所有的可选项，他就会回溯到最近的决策点（也就是上次匹配成功的位置）。


### 2. 量词

量词这个概念特别简单，只是在匹配过程中有贪婪匹配和懒惰匹配两种模式，结合回溯的概念理解稍微复杂。还是用几个例子来说明。

**1) 贪婪**

	str = "AB1111BA111BA";
	reg = /AB[\s\S]+BA/;
	console.log(str.match(reg));

首先是匹配AB，遇到了 `[\s\S]+`，这是贪婪模式的匹配，他会一口吞掉后面所有的字符，也就是如果 reg 的内容为 AB[\s\S]+，那后面的就不用看了，直接全部匹配，而往后看，正则后面还有B字符，所以他会先回溯到倒数第一个字符，匹配看是否为 B，显然倒数第一个字符不是B，于是他又接着回溯，找到了B字母，找到之后就不继续回溯了，而是往后继续匹配，此刻匹配的是字符A，程序发现紧跟B后的字母确实是A，那此时匹配就结束了。如果没有看明白，可以再读读下面这个图：

	  REG: /AB[\s\S]+BA/
	MATCH: A               匹配第一个字符
	       AB              匹配第二个字符
	       AB1111BA111BA   [\s\S]+ 贪婪吞并所有字符
	       AB1111BA111BA   回溯，匹配字符B
	       AB1111BA111B    找到字符B，继续匹配A
	       AB1111BA111BA   找到字符A，匹配完成，停止匹配

**2) 懒惰（非贪婪）**

	str = "AB1111BA111BA";
	reg = /AB[\s\S]+?BA/;
	console.log(str.match(reg));

与上面不同的是，reg 中多了一个 ? 号，此时的匹配模式为懒惰模式，也叫做非贪婪匹配。此时的匹配流程是，先匹配AB，遇到[\s\S]+?，程序尝试跳过并开始匹配后面的字符B，往后查看的时候，发现是数字1，不是要匹配的内容，继续往后匹配，知道遇到字符B，然后匹配A，发现紧接着B后面就有一个A，于是宣布匹配完成，停止程序。	  

	  REG: /AB[\s\S]+BA/
	MATCH: A               匹配第一个字符
	       AB              匹配第二个字符
	       AB              [\s\S]+? 非贪婪跳过并开始匹配B
	       AB1             不是B，回溯，继续匹配
	       AB11            不是B，回溯，继续匹配
	       AB111           不是B，回溯，继续匹配
	       AB1111          不是B，回溯，继续匹配
	       AB1111B         找到字符B，继续匹配A
	       AB1111BA        找到字符A，匹配完成，停止匹配

如果匹配的内容是 AB1111BA，那贪婪和非贪婪方式的正则是等价的，但是内部的匹配原理还是有区别的。为了高效运用正则，必须搞清楚使用正则时会遇到那些性能消耗问题。


## 三、逗比的程序

	//去测试下这句代码
	"TTTTTTTT".match(/(T+T+)+K/);
	//然后把前面的T重复次数改成30
	//P.S:小心风扇狂转，CPU暴涨

我们来分析下上面这段代码，上面使用的都是贪婪模式，那么他会这样做：


	  REG: (T+T+)+K
	MATCH: ①第一个T+匹配前7个T，第二个T+匹配最后一个T，没找到K，宣布失败，回溯到最开始位置
	       ②第一个T+匹配前6个T，第二个T+匹配最后两个T，没找到K，宣布失败，回溯到最开始位置
	       ③...
	       ... 接着还会考虑(T+T+)+后面的 + 号，接着另一轮的尝试。
	       ⑦...
	       ...

这段程序并不会智能的去检测字符串中是否存在 K，如果匹配失败，他会选择其他的匹配方式（路径）去匹配，从而造成疯狂的回溯和重新匹配，结果可想而知。这是回溯失控的典型例子。

## 四、前瞻和反向引用

### 1. 前瞻和引用

前瞻有两种，一种是负向前瞻，JS中使用 `(?!xxx)` 来表示，他的作用是对后面要匹配的内容做一个预判断，如果后面的内容是xxx，则此段内容匹配失败，跳过去重新开始匹配。另一种是正向前瞻，`(?=xxx)`，匹配方式和上面相反，还有一个长的类似的是 `(?:xxx)`,这个是匹配xxx，他是非捕获性分组匹配，即匹配的内容不会创建反向引用。具体内容可以去文章开头提到的文档中查看。

反向引用，这个在 replace 中用的比较多，在 replace 中：


字符             |	替换文本
-----------------|--------------------------------------------------
$1、$2、...、$99 |与 regexp 中的第 1 到第 99 个子表达式相匹配的文本。
$&	             |与 regexp 相匹配的子串。
$`	             |位于匹配子串左侧的文本。
$'	             |位于匹配子串右侧的文本。
$$	             |直接量符号。

而在正则表达中，主要就是 \1, \2 之类的数字引用。前瞻和反向引用使用恰当可以大大的减少正则对资源的消耗。举个例子来简单说明下这几个东西：

	问题：使用正则匹配过滤后缀名为 .css 和 .js 的文件。
		  如：test.wow.js test.wow.css test.js.js等等。

有人会立马想到使用负向前瞻，即：

	//过滤js文件
	/(?!.+\.js$).*/.exec("test.wow.js")

	//过滤js和css文件
	/(?!.+\.js$|.+\.css$).*/.exec("test.wow.js")
	/(?!.+\.js$|.+\.css$).*/.exec("test.wow.html")

但是你自己去测试下，拿到的结果是什么。匹配非js和非css文件可以拿到正确的文件名，但是我们期望这个表达式对js和css文件的匹配结果是null，上面的表达式却做不到。问题是什么，因为(?!xxx)和(?=xxx)都会消耗字符，在做预判断的时候把 .js 和 .css 给消耗了，所以这里我们必须使用非捕获模式。

	/(?:(?!.+\.js$|.+\.css$).)*/.exec("test.wow.html");
	/(?:(?!.+\.js$|.+\.css$).)*/.exec("test.wow.js");

我们来分析下这个正则：

	(?:(?!.+\.js$|.+\.css$).)*
    ---   ----------------  -
     |                |     |   
     +----------------------+
                 ↓    | 
    非捕获，内部只有一个占位字符
                      |
                      ↓
        负向前瞻以.js和.css结尾的字符串

最后一个星号是贪婪匹配，直接吞掉全部字符。

这里讲的算是有点复杂了，不过在稍复杂的正则中，这些都是很基础的东西了，想在这方面提高的童鞋可以多研究下。

### 2. 原子组

JavaScript的正则算是比较弱的，他没有分组命名、递归、原子组等功能特别强的匹配模式，不过我们可以利用一些组合方式达到自己的目的。上面的例子中，我们实际上用正则实现了一个或和与的功能，上面的例子体现的还不是特别明显，再写个例子来展示下：

	str1 = "我(wo)叫(jiao)李(li)靖(jing)";
	str2 = "李(li)靖(jing)我(wo)叫(jiao)";
	reg = /(?=.*?我)(?=.*?叫)(?=.*?李)(?=.*?靖)/;
	console.log(reg.test(str1)); //true
	console.log(reg.test(str2)); //true

不管怎么打乱顺序，只要string中包含“我”，“是”，“李”，“靖”这四个字，结果都是true。

类似(?=xxx)\1，就相当于一个原子组，原子组的作用就是消除回溯，只要是这种模式匹配过的地方，回溯时都不会到这里和他之前的地方。上面的程序`"TTTTTTTT".match(/(T+T+)+K/);`可以通过原子组的方式处理：

	"TTTTTTTT".match(/(?=(T+T+))\2+K/);

如此便能彻底消除回溯失控问题。

## 五、小结

关于正则的学习，重点是要多练习多实践，并且多尝试用不同的方案去解决一个正则问题，一个很典型的例子，去除字符串首尾的空白，尝试用5-10种不同的正则去测试，并思考哪些方式的效率最高，为什么？通过这一连串的思考可以带动你学习的兴趣，也会让你成长的比较快~

<script type="text/javascript">
/**
* @author Barret Lee
* @email barret.china@gmail.com
* @description 事件队列管理，含延时
*/
var Q = {
    // 保存队列信息
    a: [],
    // 添加到队列 queue
    q: function(d){
        // 添加到队列如果不是函数或者数字则不处理
        if(!/function|number/.test(typeof d)) return;

        Q.a.push(d);
        // 返回对自身的引用
        return Q;
    },
    qa: function(arr){
    	var t;
    	while(t = arr.shift()) Q.a.push(t);
    	return Q;
	},
    // 执行队列 dequeue
    d: function(){
        var s = Q.a.shift();
        // 如果已经到了队列尽头则返回
        if(!s) return;

        // 如果是函数，直接执行，然后继续 dequeue
        if(typeof s === "function") {
            s(), Q.d();
            return;
        }

        // 如果是数字，该数字作为延迟时间，延迟 dequeue
        setTimeout(function(){
            Q.d();
        }, s);
    }
};


var reg_data = ["H", "(i|ello)", "i", "ello", ",", " barret"],
	str_data = "Lalala. Hi, barret. Hello, John",
	w_delta = 17,
	cur = 0,
	lastIndex = 0,
	$info = $(".d_info");

function aniReg(index, callback){
	var $demoBox = $("#demoBox"),
		$obj = $demoBox
			.find("span[data-index=" + index + "]")
			.css("color","red"),
		$aniBox = $(".aniBox"),
		t = $obj[0].offsetTop,
		l = $obj[0].offsetLeft + $aniBox[0].clientWidth;
	
	$obj.clone().css({
		"position": "absolute",
		"top": t,
		"left": l,
		"font-size": "28px",
		"color": "orange",
		"font-weight": "bold",
		"text-decoration": "underline"
	}).appendTo($demoBox).animate({
		"top": $aniBox.css("top"),
		"left": $aniBox.css("left")
	}, 800, function(){
		var $this = $(this);
		$aniBox.text($aniBox.text() + $this.text());
		callback && callback($this.text());
		$(this).remove();
	});
}

function aniMatch(step, callback){
	var step = step || 1;
	$(".aniBox").animate({"left": "+=" + step * w_delta + "px"}, 800, function(){
		cur += step;
		callback && callback();
	});
}

function aniStr(len){
	var $str = $(".d_str"),
		text = $str.text();

	$str.html("<span style='color:#CCC'>" + text.slice(0, len || cur) + "</span>" + text.slice(len || cur));
}

function resetAniBox(){
	$info.html("逻辑太复杂，就不继续了~<a href='#' style='color:blue;' onclick='runAni();return false;'>重新演示</a>");
	return;
	var $aniBox = $(".aniBox"),
		l = $aniBox.text().length;
	$aniBox.text("").css({"top":"114px", "left":"51px"});
	$aniBox.css("left", (cur + l) * w_delta + "px");

	cur = lastIndex = 0;
}



function runAni(){
	cur = lastIndex = 0;
	$(".aniBox").css({"top":"114px", "left":"61px"}).text("");
	$(".d_reg span").css("color", "#000");

	aniReg(0, function(t){

		setTimeout(function(){
			if(str_data.charAt(cur + 1) != t) {
				$info.text("使劲匹配..");
				aniMatch(1, aniStr);
				setTimeout(arguments.callee, 800);
			} else {
				$info.text("匹配到了O(∩_∩)O~");
				Q.qa([
					function(){
						aniReg(2);
					},
					800,
					function(){
						aniReg(4);
					},
					800,
					function(){
						aniReg(5);
					},
					800,
					function(){
						aniReg(6);
					},
					800,
					function(){
						aniReg(7);
					},
					800,
					function(){
						aniReg(8);
					},
					800,
					function(){
						aniReg(9);
					},
					800,
					function(){
						aniReg(10);
					},
					800,
					function(){
						aniReg(11);
					},
					800,
					function(){
						$(".aniBox").animate({"top": "73px"}, 800);
					},
					800,
					function(){
						resetAniBox();
					}
				]);
				setTimeout(Q.d);
			}
		});
	});
}

$("#runDemo").on("click", function(){
	runAni && runAni();
})
</script>