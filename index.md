---
layout: home
---

<div class="index-content blog">
    <div class="section">
        <ul class="artical-cate">
            <li class="on"><a href="/"><span>技术积淀</span></a></li>
            <li><a href="/opinion"><span>交互分析</span></a></li>
            <li><a href="/life"><span>生活杂记</span></a></li>
            <li><a href="/trash"><span>回收站</span></a></li>
        </ul>

        <div class="cate-bar"><span id="cateBar"></span></div>

        <ul class="artical-list">
        {% for post in site.categories.blog %}
            <li itemscope itemtype="http://schema.org/Article">
                <h2>
                    <a href="{{ post.url }}" itemprop="url">{{ post.title }}</a>
                    <span class="dis_comments">
                        <a href="{{ post.url }}#disqus_thread" data-disqus-identifier="{{ site.url }}{{ post.url }}">comments</a>
                    </span>
                </h2>
                <div class="title-desc" itemprop="description">{{ post.description }}</div>
            </li>
        {% endfor %}
        </ul>
    </div>

    <div class="aside"></div>
</div>
