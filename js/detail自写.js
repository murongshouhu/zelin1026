//思路1：点击首页的商品页面进入detail 页面，这样首先要判断用户是否登录，如果未登录弹框提醒并且跳转到登录login页面
// 2:如果登录 则要把商品的id名通过URL传到detail里面  取出id  ；确认登录就要进行后台数据请求ajax进行加载页面，渲染页面，初始化绑定事件
// 3：点击绑定事件有3个跳转，页面4个点击   ，2个dsn隐藏的点击事件  一共9个
//4：点击购物车添加数量 需要在后台确认是否添加成功，后台确认成功 值才可以显示  所以需要进行ajax请求
//5：有很多框 都是dsn隐藏起来的注意；   
//6：注意选取元素的准确性  以及确定class类名的唯一性；不要把点和#弄错
(function(){  //   函数自调用 避免全局污染
	var detail={   //声明一个对象 里面用逗号隔开
		init:function(){  //初始化
		//思路1：首先判断是否登录，	如果未登录，弹框返回登录页面；如果登录过进行后台数据请求加载数据，初始化绑定事件
		//前提：首先home页面存储记忆sesssionId 
		if(!localStorage.getItem("sessionId")){   //表示如果不能取到id值
			alert("你还未登录，请先登录");
			location.href="login.html";      //跳转到登录页
		}else{   //说明已登录 这样需要通过url把id传过来存起来 这样吧id传给后台请求数据，然后初始化绑定事件
			this.id=location.href.split("?id=")[1];
			this.queryDetail(this.id);  //实参   进行数据请求
			this.bindEvent();           //绑定事件
			 
		}
		},//init end
		queryDetail:function(id1){ //进行ajax请求 请求成功进行渲染页面  设置一个形式参数接收实参id
			var self=this;
			$.ajax({
				url:" http://192.168.6.133:3000/productDetail ",//  详情页面接口
				type:"get",
				data:{id:id1},
				
				dataType:"json",
				success:function(res){
					if(typeof res=="string"){
						res=JSON.parse(res);
					}
					if(!res.resCode=="000"){
						alert(res.resMsg);
					}else{   //请求后台数据成功，进行渲染
						self.render(res);// 接收数据成功的实际参数
					}
				},
				error:function(r){
					alert("失败"+r);
				},
			});//$.ajax end
		},//queryDetail end
		bindEvent:function(){//绑定事件
			//思路：有9个绑定事件  3个跳转  4个 页面点击    2个弹框中点击
			var self=this;
			$("#home").on("click",function(){    //点击好邻居跳转你到首页
				location.href="lome.html";
			});
			$("#floatbar_bottom_cart").on("click",function(){  //点击购物车icon跳转到购物车页面
				location.href="shoppingCar.html";
			});
			$("#buy_now").on("click",function(){
				location.href="playOrder.html";
			});
			
			
			$(".minus_icon ").on("click",function(){   //点击减框  代码进行函数封装
				self.minusIcon();
			});
			$(".add_icon ").on("click",function(){   //点击加框
				self.addIcon();
			});
			$(".number_edit ").on("click",function(){  //点击数字框
				self.numberEdit();
			});
			$("#join_car").on("click",function(){   //点金加入购物车
				self.joinCar();
			});
			
			
			
		},//bindEvent end
		//思路：1：首先取出剩余商品数量的值以及商品数量值  进行对比  如果商品数量小于剩余数量 才可以继续增加否则提示弹框商品不足；
		  //  2：
		minusIcon:function(){      //点击减框代码函数
			
		},//minusIcon end
		addIcon:function(){        //点击加框代码函数
			
		},//addIcon end
		numberEdit:function(){     //点击数字框
			
		},//numberEdit end
		joinCar:function(){        //点击加入购物车框
			
		},//joinCar end
		render:function(res1){   //接收数据的形式参数
			var obj=res1.productDetail;
			$(".shopping_box h2").text(obj.shopName);  //商品名称
			$(".unit_price span").text(obj.price);  //商品价格
			$("#leftNum span").text(obj.leftNum);  //剩余数量
			$("#graphic_content").text(obj.disc);   //商品详情
			var str="";
			for(var i=0;i<obj.imgList.length;i++){
				str='<li>\
                        <a class="pic" href="#"><img src="'+obj.imgList[i]+'"/></a>\
                    </li>';
                    
			}
		      Touch({ 
		            slideCell:"#slideBox",
			        titCell:".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
			        mainCell:".bd ul", 
			        effect:"left", 
			        autoPage:true,//自动分页
			        autoPlay:true, //自动播放
		      });
		},//render end
		
	};//datail end
	
	detail.init();  //函数初始化调用
})();
