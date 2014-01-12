---
layout: post
title: jekyll语法练手
description: 算是第二次接触jekyll了，刚开始没弄太明白，觉得挺麻烦的，后来把md的语法学了一遍，发现配合这用还挺好的！
category: blog
tags: jekyll
---

Github上学着倒弄博客，当然少不了学习md语法和jekyll语法，jekyll学习的官方网址是<http://jekyllrb.com/>。我是把别人的代码fork过来，从头到脚看了一通，基本是懂了，然后此刻正在官网比较全面的学习相关知识，下面是几个测试。

### 代码高亮 
{% highlight ruby %}
def show
  @widget = Widget(params[:id])
  respond_to do |format|
    format.html # show.html.erb
    format.json { render json: @widget }
  end
end
{% endhighlight %}

### for循环的使用

<ul>
	<li><a href="{{ post.url }}" targert="_blank">{{ post.title }}</a></li>
</ul>

### paginator
<div id="post-pagination" class="pagination">
  {% if paginator.previous_page %}
    <p class="previous">
      {% if paginator.previous_page == 1 %}
        <a href="http://barretlee.com/">Previous</a>
      {% else %}
        <a href="{{ paginator.previous_page_path }}">Previous</a>
      {% endif %}
    </p>
  {% else %}
    <p class="previous disabled">
      <span>Previous</span>
    </p>
  {% endif %}

  <ul class="pages">
    <li class="page">
      {% if paginator.page == 1 %}
        <span class="current-page">1</span>
      {% else %}
        <a href="http://barretlee.com/">1</a>
      {% endif %}
    </li>

    {% for count in (2..paginator.total_pages) %}
      <li class="page">
        {% if count == paginator.page %}
          <span class="current-page">{{ count }}</span>
        {% else %}
          <a href="http://barretlee.com/page{{ count }}">{{ count }}</a>
        {% endif %}
      </li>
    {% endfor %}
  </ul>

  {% if paginator.next_page %}
    <p class="next">
      <a href="{{ paginator.next_page_path }}">Next</a>
    </p>
  {% else %}
    <p class="next disabled">
      <span>Next</span>
    </p>
  {% endif %}

</div>

