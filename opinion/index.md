---
layout: home
---

<div class="index-content opinion">
    <div class="section">
        <ul class="artical-cate">
            <li><a href="http://barretlee.com/"><span>技术积淀</span></a></li>
            <li class="on"><a href="http://barretlee.com/opinion"><span>交互分析</span></a></li>
            <li><a href="http://barretlee.com/life"><span>生活杂记</span></a></li>
            <li><a href="http://barretlee.com/trash"><span>回收站</span></a></li>
        </ul>

        <div class="cate-bar"><span id="cateBar"></span></div>

        <ul class="artical-list">
        {% for post in site.categories.opinion %}
            <li itemscope itemtype="http://schema.org/Article">
                <h2>
                    <a href="{{ post.url }}" itemprop="url">{{ post.title }}</a>
                </h2>
                <div class="title-desc" itemprop="description">{{ post.description }}</div>
            </li>
        {% endfor %}
        </ul>
    </div>

    <div class="aside"></div>
</div>
