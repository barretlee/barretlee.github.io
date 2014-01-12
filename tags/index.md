---
title: Tags
layout: single
NotLoadComment: true
---
<form class="page-loc" style="margin:0;margin-top:40px;" method="GET" action="/search">
    <span style="float:right"><input type="text" class="web-search" name ="q" value="站内搜索" /><a href="http://barretlee.com/about.html">关于</a><a href="http://barretlee.com/atom.xml" class="page-rss" style="margin-left: 20px;">订阅</a></span>
    李靖的博客 » Tags
</form>
<div class="categories">
	<div class="cate-title">
	{% for cat in site.tags %}
		<a href="#{{ cat[0] }}" title="{{ cat[0] }}" rel="{{ cat[1].size }}">{{ cat[0] | capitalize }} <sup>({{ cat[1].size }})</sup></a>
	{% endfor %}
	</div>

	<ul class="cate-list">
	{% for cat in site.tags %}
	  <h3 id="{{ cat[0] }}">{{ cat[0] | capitalize  }}</h3>
		{% for post in cat[1] %}
			<li>
				<time datetime="{{ post.date | date:"%Y-%m-%d" }}">{{ post.date | date_to_string }}</time> » 
				<a href="{{ post.url }}" title="{{ post.title }}">{{ post.title }}</a>
			</li>
		{% endfor %}
	{% endfor %}
	</ul>
</div>