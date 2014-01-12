---
title: Search
layout: single
NotLoadComment: true
---

<form class="page-loc" style="margin:0;margin-top:40px;" method="GET" action="/search">
    <span style="float:right"><input type="text" class="web-search" name ="q" value="站内搜索" /><a href="http://barretlee.com/about.html">关于</a><a href="http://barretlee.com/atom.xml" class="page-rss" style="margin-left: 20px;">订阅</a></span>
    李靖的博客 » 搜索页面
</form>
<div class="categories">
	<p id="s-wait"><img src="../images/loading.gif" style="width:40px;vertical-align: bottom; margin-right: 8px;" />客官请稍后，正在玩命检索中~</p>
	<h3 style="display:none" id="s-res">搜索结果：</h3>
	<h3 style="display:none" id="s-none">没有搜索相关的结果~</h3>
	<ul class="cate-list">
	{% for cat in site.categories %}
		{% for post in cat[1] %}
			<li style="display:none">
				<time datetime="{{ post.date | date:"%Y-%m-%d" }}">{{ post.date | date_to_string }}</time> » 
				<a href="{{ post.url }}" title="{{ post.title }}">{{ post.title }}<s style="display:none">
				{% for tag in post.tags %} {{ tag }} {% endfor %}
				{% for cat in post.catetories %} {{ cat }} {% endfor %}
				</s></a>
			</li>
		{% endfor %}
	{% endfor %}
	</ul>
</div>

<script type="text/javascript">
	$(function(){
		var h = window.location.href,
			s = h.indexOf("?q=") > -1 ? h.slice(h.indexOf("?q=") + 3) : "",
			num = 0;

		if(s.length == 0) {
			$("#s-wait, #s-none").toggle();
			return;
		}

		s = decodeURIComponent(s).split(/[\+ ]/g);

		$("ul li").each(function(){
			var $this = $(this);
			var t = $this.find("a").text().toLowerCase();

			for(var i = 0; s[i]; i++){
				if(t.indexOf(s[i].toLowerCase()) > -1){
					$this.show();
					num ++;
					return;
				}
			}
		});

		if(num == 0) {
			$("#s-wait, #s-none").toggle();
		} else {
			$("#s-res").text("共为您找到了 " + num + " 篇相关文章：").toggle();
			$("#s-wait").toggle();
		}
	});
</script>