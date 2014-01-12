---
layout: post
title: 缓动在动画中的应用
description: JavaScript 实现一个可以运动的效果自然不是什么难事，然而要让动画真实的表现出来，这就离不开缓动函数(Tween)了。
category: blog
tags: JavaScript 缓动函数 Tween Animation
---

缓动，也就是缓冲移动，我们的世界没有绝对匀速的物体移动，所有的运动在宏观上都是变速的，可以说缓动就是让人感到比较舒畅的变速运动。我们最熟悉的自由落体运动，牛顿先生已经在十六世纪就研究出了他的运动规律，`S = 1/2gt^2`，随着下落时间的增加，速度越来越快，如果在落地碰撞中没有损失能量，他还会反弹到同样的高度。本文的目的就是将这些物体运动规律整合到页面动画之中，并建立一个属于开发者的缓动类。

用程序去实现缓动和现实生活中的缓动存在一定的差异，现实世界是一个连续的四维空间，时间 t 是连续的，而程序中我们没办法让时间连续起来，程序运动最快的速度也就是 CPU 相应的速度，而对于 JavaScript 来说，不连续性就更加明显了，在 i7 处理器下 1s 中可以进行 500W+ 计算，也就是说在两次计算之间总是会有一定的时间间隔，时间的不连续性导致运动的轨迹也是不连续的，当物体运动在我们设定的时间点时，会超过或者差一点到达终点，而这里存在的差异就需要程序开发者自己控制了。可以看下面这个例子：

<div class="tween-demo" style="height:100px; border:1px solid #CCC; background:#EFEFEF; position:relative;margin-bottom:10px;">
	<span style="position:absolute; width:8px;height:8px;margin-top:-4px;top:50%;left:0;border:2px solid #666;"></span>
</div>
<div class="tween-ctrl" style="margin-bottom:20px;">
	<input type="button" value="linear" style="border:1px solid #ccc; background:#EFEFEF;padding:3px 5px; cursor:pointer; margin-right:8px" />
	<input type="button" value="swing" style="border:1px solid #ccc; background:#EFEFEF;padding:3px 5px; cursor:pointer; margin-right:8px"  />
	<input type="button" value="easeInQuad" style="border:1px solid #ccc; background:#EFEFEF;padding:3px 5px; cursor:pointer; margin-right:8px" />
	<input type="button" value="easeOutQuad" style="border:1px solid #ccc; background:#EFEFEF;padding:3px 5px; cursor:pointer; margin-right:8px" />
	<input type="button" value="easeInOutQuad" style="border:1px solid #ccc; background:#EFEFEF;padding:3px 5px; cursor:pointer; margin-right:8px" />
</div>

上面这个例子是用 jquery 写的，jquery 对运动的封装十分给力，不过我们很难从他的代码中把动画部分剥离出来。漂亮的接口后面总会有一个龌龊的实现，jquery 代码耦合度太高，除了 John Resig 等几个 JQ 的作者可以对代码的理解游刃有余，其他人只能望而却步。但是动画的实现并不复杂，我们完全可以用几行代码写出自己的动画类。

(未完待续)



<script type="text/javascript">
	 jQuery.extend(jQuery.easing, {
		easeInQuad: function(x, t, b, c, d) {
			return c * (t /= d) * t + b;
		},
		easeOutQuad: function(x, t, b, c, d) {
			return -c * (t /= d) * (t - 2) + b;
		},
		easeInOutQuad: function(x, t, b, c, d) {
			if ((t /= d / 2) < 1) return c / 2 * t * t + b;
				return -c / 2 * ((--t) * (t - 2) - 1) + b;
		}
	});
	$(function(){
		var $ctrl = $(".tween-ctrl input"),
			$box = $(".tween-demo"),
			$demo = $box.find("span");
		$ctrl.on("click", function(){
			var $this = $(this), type = $this.val();
			$demo.stop().css({"left": 0}).animate({"left": $box.width() - $demo.width()}, 1000, type, function(){
				$demo.animate({"left": 0}, 1000, type, function(){});
			});
		});
	});
</script>