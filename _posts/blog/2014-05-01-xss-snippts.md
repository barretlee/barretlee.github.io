---
layout: post
title: NodeJS写个爬虫
description: 这两天看了好几篇不错的文章，有的时候想把好的文章 down 下来放到 kindle 上看，便写了个爬虫脚本，因为最近都在搞 node，所以就很自然的选择 node 来爬咯～
category: blog
tags: javascript node spider 爬虫
---

这两天看了好几篇不错的文章，有的时候想把好的文章 down 下来放到 kindle 上看，便写了个爬虫脚本，因为最近都在搞 node，所以就很自然的选择 node 来爬咯～

本文地址：{{ site.url }}{{ page.url }}，转载请注明源地址。

所谓爬虫，可以简单理解为利用程序操作文件，只是这些文件不在本地，需要我们拉取过来。

## 一. 爬虫代码解析

### 1. 拿到目标页码源码

Node 提供了很多接口来获取远程地址代码，就拿 AlloyTeam 的页面举例吧，把他首页几篇文章的信息爬取过来。因为 AlloyTeam 使用的协议是 http:// ，本文就不介绍 Node 中 https:// 的使用了。

    var http = require("http");
    
    var url = "http://www.alloyteam.com/";
    var data = "";
    
    // 创建一个请求
    var req = http.request(url, function(res){
        // 设置显示编码
        res.setEncoding("utf8");
        // 数据是 chunked 发送，意思就是一段一段发送过来的
        // 我们使用 data 给他们串接起来
        res.on('data', function(chunk){
            data += chunk;
        });
        // 响应完毕时间出发，输出 data
        res.on('end', function(){
            // dealData(data);
            console.log(data);
        });
    });
    
    // 发送请求
    req.end();

上面短短七八行代码，就拿到了 AlloyTeam 首页的代码，真的十分简单，如果是 https:// 就得引用 https 模块咯，都是差不多的。

### 2. 正则提取目标内容

先看下我们要抓取的内容：
![alloyteam](/images/blog-article-images/blog/spider-alloyteam.png)

由于没有使用其他库，我们没办法像操作 DOM 一样获取目标内容，不过写正则也挺简单的，比如我们要 获取标题/文章链接/摘要 这些内容，正则表达式为：

    // function dealData
    var reg = /<ul\s+class="articlemenu">\s+<li>\s+<a[^>]*>.*?<\/a>\s+<a href="(.*?)"[^>]*>(.*?)<\/a>[\s\S]*?<div\s+class="text">([\s\S]*?)<\/div>/g;
    var res = [];
    while(match = reg.exec(data)) {
        res.push({
            "url": match[1],
            "title": match[2],
            "excerpt": match[3]
        });
    }


这里的正则看起来有点晦涩，不过呢，正则在编程中十分基础的东西，如果没有太多的了解，建议先去搞清楚，这里就不细说啦。这里要强调的一点是：

    reg.exec(data);

如果只写上面这句话，只会拿到第一个匹配结果，所以需要使用 while 循环来处理，没处理一次，正则匹配的位置就会往后推一下。其实上面这条语句执行后返回的是一个对象，其中包含一个 index 属性，具体可以查阅 JavaScript 正则的内容。

这里返回（res）的数据格式是：

    [{
        "url: url,
        "title": title,
        "excerpt" excerpt
    }];

### 3. 数据的过滤

上面虽然拿到了内容，不过我们需要的是纯文本，其他标签什么的得过滤掉，excerpt 中包含了一些标签：

    var excerpt = excerpt.replace(/(<.*?>)((.*?)(<.*?>))?/g, "$3");

虽说文章中有很多代码，有些标签是不应该删除的，不过这里是摘要内容，这些内容的标签都删除掉，方便我们储存。然后把长度处理下：

    excerpt = excerpt.slice(0, 120);

### 4. 存到数据库（或者文件）

我这里是把文件储存到文件之中，存放格式为：

    [title](url)
    > excerpt

哈哈，很熟熟悉吧，markdown 语法，看起来也比较清晰。

    var str = "";
    for(var i = 0, len = data.length; i < len; i++){
        str += "[" + data[i].title + "](" + data[i].url + ")\n" + data[i].excerpt.replace("\n\s*\n?", ">\n") + "\n\n";
    }

先拼接数据，然后写入到文件：

    fs.writeFile('index.md', str, function (err) {
        if (err) throw err;
        console.log('数据已保存～');
    });

大功告成，过程其实是很简单的。拿到的内容：

![alloyteam](/images/blog-article-images/blog/spider-alloyteam-res.png)


## 二. 小结

如果对正则不太熟悉，上面的工作是不太好完成的，很多开发者为 Node 提供了工具库，使用 npm 可以安装，如果不习惯正则，使用一些工具包辅助处理，可以把拿到的数据当作 DOM 来解析。

我了解到的有一个叫做 node-jquery 的库貌似还不错，具体请读者自己去网上搜吧，应该挺多的。

## 三. 参考资料

- <http://nodejs.org/api/fs.html>
- <http://nodejs.org/api/http.html>








