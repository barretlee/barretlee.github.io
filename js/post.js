if(!/barret/i.test(window.location.href)){
    window.location.href = "http://barretlee.com";
}

$(document).ready(function(){
    var isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        }
        ,BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        }
        ,iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        }
        ,Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        }
        ,Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        }
        ,any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };

    $('pre').addClass('prettyprint linenums') //添加Google code Hight需要的class

/*
    var $sidebar = $(".sidebar"), fix = $sidebar.offset().top + $sidebar.height();
    $(window).on("scroll", function(){
        setTimeout(function(){
            var nowTop = $(window).scrollTop();
            if(nowTop >= fix) {
                if($("#recent-page").size() == 0){
                    $sidebar.find(".recent-page")
                        .clone()
                        .css({"position":"fixed", "top":20})
                        .attr("id","recent-page")
                        .appendTo($sidebar);
                } else {
                    $("#recent-page").show();
                }
            } else {
                $("#recent-page").hide();
            }
        }, 100);
    });
*/
    $('.entry a').each(function(index,element){
        var href = $(this).attr('href');
        if(href){
            if(href.indexOf('#') == 0){
            }else if ( href.indexOf('/') == 0 || href.toLowerCase().indexOf('barretlee.github.io')>-1 || href.toLowerCase().indexOf('bareet.cc')>-1 ){
            }else if ($(element).has('img').length){
            }else{
                $(this).attr('target','_blank');
                $(this).addClass('external');
            }
        }
    });

    //预加载图片，载入之前获取图片的width和height
    /*function preloadImg(image, callback, load, error){
        var self = arguments.callee, args = arguments, 
            callback = callback || new Function(),
            load = load || new Function(),
            error = error || new Function(),
            img = typeof image === "string" ? document.getElementById(image) : image;

        setTimeout(function(){
            if(img.width){
                callback(img, [img.width,img.height]);
            } else {
                self(args);
            }
        }, 1);

        img.onload = function(){ load(img)};
        img.onerror = function(){ error(img)};
    }

    $("img").each(function(){
        var $this = $(this);
        preloadImg($(this), function(img, arr){
            $this.attr({
                width: arr[0],
                height: arr[1]
            });
        });
    })
    */
    
    // by Barret Lee
   /* $("pre.prettyprint").each(function(){
        var $this = $(this);

        if($this.height() <= 100) return;

        $this.height(100).attr("unfold", true).css("position", "relative");

        $("<span/>").css({
            "position": "absolute",
            "top": "-30px",
            "right": "10px",
            "border": "1px solid #CCC",
            "border-bottom": "none",
            "line-height": "30px",
            "padding": "0 4px",
            "background": "#F8F8F8",
            "cursor": "pointer"
        }).text("展开").appendTo($this).on("click", function(){
            var $this = $(this);
            $this.text($this.text == "展开" ? "展开" : "收起").css("height", $this.height() == 200 ? "auto" : 200);

        });
    });*/

    // 功能按钮
    var leader = [
        '<div id="page-leader">',
            '<span title="回顶部">↑</span>',
            '<span title="回到阅读处">●</span>',
            '<span title="我要评论">↓</span>',
        '</div>'
    ];

    $(leader.join("\n")).appendTo($("body"));

    $("#page-leader span").each(function(index, ele){
        var $this = $(this);
        if(index == 0) {
            $this.on("click", function(){
                $("body").animate({scrollTop: 0});
            });
        }
        if(index == 1) {
            $this.on("click", function(evt){
                if(window.readTempPos){
                    $("body").animate({scrollTop: window.readTempPos});
                }
            });
        }
        if(index == 2) {
            $this.on("click", function(){
                var pos = $("#disqus_thread").length > 0 && $("#disqus_thread").offset().top;

                window.readTempPos = $("body").scrollTop();

                !!pos && $("body").animate({scrollTop: pos});
            });
        }
    });

    // 代码长度问题 by Barret Lee
    isMobile.any() || $("pre.prettyprint").on("mouseover", function(){
        var $this = $(this), origin, acture;

        //if($this.attr("unfold")) return;


        // 如果缓存了实际宽度，直接动画
        if(acture = $this.attr("data-acture-width")) {
            $(this).stop().animate({"width": acture}, 400);
            return ;
        } 

        $this.attr("data-origin-width", origin = $this.width());

        // 克隆对象append到空白处，然后获取实际宽度，并缓存
        var $clone = $this.clone(true);
        acture = $clone.css({position:"absolute",left:"-9999px",top: 0}).appendTo($("body")).width();

        $this.attr("data-acture-width", acture);
        //console.log(acture, origin)

        setTimeout(function(){
            $clone.remove();
        }, 50);

        // 如果origin <= acture，则取消绑定
        if(acture <= origin || acture > (origin + window.screen.availWidth) / 2){
            // 删除克隆对象
            $clone.remove();

            $this.off();

            return ;
        }

        $(this).stop().animate({"width": acture}, 400, function(){
            // 删除克隆对象
            $clone.remove();
        });

    }).on("mouseout",function(){
        var $this = $(this);

        //if($this.attr("unfold")) return;

        $this.stop().animate({"width": $this.attr("data-origin-width")}, 400);
    });

    var menuIndex = function(){
        var ie6 = ($.browser.msie && $.browser.version=="6.0") ? true : false;
        if($('h2',$('#content')).length > 2 && !isMobile.any() && !ie6){
            var h2 = [],h3 = [],tmpl = '<ul>',h2index = 0;

            $.each($('h2,h3',$('#content')),function(index,item){
                if(item.tagName.toLowerCase() == 'h2'){
                    var h2item = {};
                    h2item.name = $(item).text();
                    h2item.id = 'menuIndex'+index;
                    h2.push(h2item);
                    h2index++;
                }else{
                    var h3item = {};
                    h3item.name = $(item).text();
                    h3item.id = 'menuIndex'+index;
                    if(!h3[h2index-1]){
                        h3[h2index-1] = [];
                    }
                    h3[h2index-1].push(h3item);
                }
                item.id = 'menuIndex' + index
            });

            //添加h1
            tmpl += '<li class="h1"><a href="#" data-top="0">'+$('h1').text()+'</a></li>';

            for(var i=0;i<h2.length;i++){
                tmpl += '<li><a href="#" data-id="'+h2[i].id+'">'+h2[i].name+'</a></li>';
                if(h3[i]){
                    for(var j=0;j<h3[i].length;j++){
                        tmpl += '<li class="h3"><a href="#" data-id="'+h3[i][j].id+'">'+h3[i][j].name+'</a></li>';
                    }
                }
            }
            tmpl += '</ul>';

            $('body').append('<div id="menuIndex"></div>');
            $('#menuIndex').append($(tmpl)).delegate('a','click',function(e){
                e.preventDefault();
                var scrollNum = $(this).attr('data-top') || $('#'+$(this).attr('data-id')).offset().top;
                //window.scrollTo(0,scrollNum-30);
                $('body, html').animate({ scrollTop: scrollNum-30 }, 400, 'swing');
            })/*.append("<a href='javascript:void(0);' onclick='return false;' class='menu-unfold'>&gt;</a>");*/

            $(window).load(function(){
                var scrollTop = [];
                $.each($('#menuIndex li a'),function(index,item){
                    if(!$(item).attr('data-top')){
                        var top = $('#'+$(item).attr('data-id')).offset().top;
                        scrollTop.push(top);
                        $(item).attr('data-top',top);
                    }
                });

                var waitForFinalEvent = (function () {
                    var timers = {};
                    return function (callback, ms, uniqueId) {
                        if (!uniqueId) {
                            uniqueId = "Don't call this twice without a uniqueId";
                        }
                        if (timers[uniqueId]) {
                            clearTimeout (timers[uniqueId]);
                        }
                        timers[uniqueId] = setTimeout(callback, ms);
                    };
                })();

                $(window).scroll(function(){
                    waitForFinalEvent(function(){
                        var nowTop = $(window).scrollTop(),index,length = scrollTop.length;
                        if(nowTop+60 > scrollTop[length-1]){
                            index = length
                        }else{
                            for(var i=0;i<length;i++){
                                if(nowTop+60 <= scrollTop[i]){
                                    index = i
                                    break;
                                }
                            }
                        }
                        $('#menuIndex li').removeClass('on')
                        $('#menuIndex li').eq(index).addClass('on')
                    })
                });
            });

            //用js计算屏幕的高度
            $('#menuIndex').css('max-height',$(window).height()-80);
        }
    }

    $.getScript('http://qianduannotes.duapp.com/github/barretlee.github.com/js/prettify/prettify.js',function(){
        prettyPrint();
        menuIndex();
    });

    $(window).on("load", function(){
        
        //评论自动展开  by barret lee
        isMobile.any() || $(".comment").trigger("click");

        // 添加百度分享
        $("head").append($('<script/>').attr("src", 
            "http://bdimg.share.baidu.com/static/api/js/share.js?v=86835285.js?cdnversion=" + ~(-new Date()/36e5)))    
    });
        
});
