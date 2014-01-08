---
layout: default
title: about
---
<div id="content" class="aboutMe">
<div class="page-loc">
	<span style="float:right"><a href="/atom.xml" class="page-rss" style="margin-left: 20px;">订阅</a></span>
  	李靖的博客 » 关于我
</div>
<dl class="aboutDl">
	<dt><img src="{{ site.repo }}/images/mine.jpg" />关于作者</dt>
	<dd><strong>李靖，</strong>Barret Lee</dd>
	<dd><strong>weibo:</strong><a href="http://weibo.com/hustskyking" target="_blank">@BarretLee</a></dd>
	<dd><strong>blog:</strong><a href="http://hustskyking.cnblogs.com" target="_blank">博客园-BarretLee</a>（本博客部分文章会同步至博客园）</dd>
	<dd><strong>email:</strong><a href="mailto:barret.china@gmail.com">barret.china@gmail.com</a></dd>

	<dt>关于博客</dt>
	<dd>所有文章非特别说明皆为原创，遵循的协议为「<a href="http://creativecommons.org/licenses/by-nc-sa/3.0/deed.zh" target="_blank">署名-非商业性使用-相同方式共享</a>」，转载请注明文章出处！谢谢合作 :）</dd>
</dl>
{% include disqus.snippet %}
<div class="footer">
    <small>Powered by <a href="https://github.com/mojombo/jekyll">Jekyll</a> | Copyright 2013 - 2023 Designed by <a href="http://barretlee.com/about.html">Barret Lee</a> | <span class="label label-info">{{site.time | date:"%Y-%m-%d %H:%M:%S %Z"}}</span></small>
</div>
</div>
<script type="text/javascript">
$(window).on("load", function(){
	$('#disqus_container .comment').trigger('click');
});
</script>