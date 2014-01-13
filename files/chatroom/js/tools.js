/**
* @author Barret Lee
* @barret.china@gmail.com
*/
Function.prototype.bind = Function.prototype.bind || function(context){
	var args = Array.prototype.slice.call(arguments)
	  , self = this;

	return function() {
		return self.apply(context, args.slice(1));
	}
};

var Tool = {
	info: {
		$infoBar: $(".info-bar"),
		show: function(msg){
			var this_ = Tool.info;

			clearTimeout(this_.timer);

			this_.$infoBar.show().css("right", "-255px")
			.find("sup").on("click", function(){
				clearTimeout(this_.timer);
				this_.$infoBar.fadeOut('fast');
			});

			this_.$infoBar.find("div").html(msg);

			this_.$infoBar.animate({"right": 15}, 300, function(){
				this_.timer = setTimeout(function(){
					this_.hide();
				}.bind(this_), 2000);
			});
		},
		hide: function(callback){
			Tool.info.$infoBar.fadeOut(function(){
				$(this).css("right", "-255px");
				callback && callback();
			});
		}
	},
	load: function(percentage, callback){
		$(".loading-bar").show().find("div")
		.animate({"width": percentage*100 + "%"}, 200, function(){
			percentage == 1 && 
			$(this).parent().fadeOut('100', function(){
				$(this).find("div").css("width", 0);
				callback && callback();
			});
		});
	}
};
