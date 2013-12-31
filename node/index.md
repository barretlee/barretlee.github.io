---
layout: default
---
<div class="index-content ES6">
    <ul class="artical-list">
    <li itemscope itemtype="http://schema.org/Article">
        <h1 class="title">NodeJS 系列</h1>
    </li>
    {% for post in site.categories.node %}
        <li itemscope itemtype="http://schema.org/Article">
            <h2><a href="{{ post.url }}" itemprop="url">{{ post.title }}</a></h2>
        </li>
    {% endfor %}
    </ul>
    <p style="margin-top:40px;color:red;">持续更新中...</p>
</div>

<script type="text/javascript">
	$(function(){
		var a = $(".artical-list li:gt(0)");
		a.remove();
		$(a.get().reverse()).appendTo($(".artical-list"));
	});
</script>
