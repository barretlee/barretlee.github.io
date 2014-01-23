---
layout: default
title: about
---
<div id="content" class="aboutMe">
<form class="page-loc" method="GET" action="/search">
	<span style="float:right"><input type="text" class="web-search" name ="q" value="站内搜索" /><a href="http://barretlee.com/atom.xml" class="page-rss" style="margin-left: 20px;">订阅</a></span>
  	李靖的博客 » 关于我
</form>
<dl class="aboutDl">
	<dt><img src="{{ site.repo }}/images/mine.jpg" />关于作者</dt>
	<dd><strong>李靖，</strong>Barret Lee，小胡子哥</dd>
	<dd><strong>weibo:</strong><a href="http://weibo.com/hustskyking" target="_blank">@BarretLee</a></dd>
	<dd><strong>blog:</strong><a href="http://hustskyking.cnblogs.com" target="_blank">博客园-BarretLee</a>（本博客部分文章会同步至博客园）</dd>
	<dd><strong>email:</strong><a href="mailto:barret.china@gmail.com">barret.china@gmail.com</a></dd>
	<dd><strong>自述:</strong>华中科技大学本科 10 级，13 年于百度地图 LBS 搜索部 Place 团队实习了三个多月，后被阿里巴巴淘宝 UED 团队收编，擅长前端各项技能，近期目标是成为全栈工程师。特别喜欢钻研新技术，对 JavaScript 相关的客户端、服务端 (NodeJS) 以及数据库 (MongoDB) 知识很感兴趣。行动方式是底层再底层思考，创新再创新实践。</dd>

	<dt>关于博客</dt>
	<dd>所有文章非特别说明皆为原创，遵循的协议为「<a href="http://creativecommons.org/licenses/by-nc-sa/3.0/deed.zh" target="_blank">署名-非商业性使用-相同方式共享</a>」，由于文章表述或者内容可能存在诸多错误，所以部分内容会作修改，为保证转载信息与源同步，转载请注明文章出处！谢谢合作 :）</dd>

	<dt>好友链接</dt>
	<dd>
        <div class="friend-link">
            <a href="http://www.web-tinker.com" title="http://www.web-tinker.com" target="_blank">次碳酸钴</a>
            <a href="http://hustskyking.cnblogs.com" title="http://hustskyking.cnblogs.com" target="_blank">Barret Lee</a>
            <a href="http://www.imququ.com" title="http://www.imququ.com" target="_blank">屈屈</a>
        </div>
   </dd>
</dl>
{% include disqus.snippet %}
<div class="footer">
    <small>Powered by <a href="https://github.com/mojombo/jekyll">Jekyll</a> | Copyright 2013 - 2023 Designed by <a href="http://barretlee.com/about.html">Barret Lee</a> | <span class="label label-info">{{site.time | date:"%Y-%m-%d %H:%M:%S %Z"}}</span></small>
</div>
</div>
<script type="text/javascript">
$(function(){
	$('#disqus_container .comment').trigger('click');
});
</script>
