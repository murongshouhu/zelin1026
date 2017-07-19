//首页思路：
//1：init判断是否登录
//2：请求商品数据
//思路：首先判断用户是否登录，如果没有登录直接弹窗并跳转到登录页面。否则进行加载
(function(){
	var home={
		init:function(){ 
			if(!localStorage.getItem("sessionId")){
				alert("您还未登录，请先登录");
				location.href="login.html";
				return;			
			}
			this.more=false;  //第一次请求页面 请求商品数据isMore 肯定为false ,不会再在更多数据
			this.queryList(this.more);  // 请求商品数据
			this.bindEvent();    //初始化绑定事件
			
			//初始化思路：如果刷新页面之前不存在商品，那么我们给商品数量附初始值为0
			 //否则就把商品数量值取出来放到提示框内，并且删除隐藏提示框的类dsn
			if(!localStorage.getItem("prdNum")){   //如果之前不存在商品
				localStorage.setItem("prdNum",0);//则给商品数量赋初始值
			}else{
				$(".product_car").text(localStorage.getItem("prdNum"));
				$(".product_car").removeClass("dsn");
			}
			
		},//init end
		bindEvent:function(){  //有4个点击事件 点击查看更多，点击添加小购物车，点击商品，点击总购物车
			var self=this;
			$("#btn_more").on("click",function(){   //点击查看更多
				//思路：1：点击查看更多  isMore就为true
				//    2：请求更多的商品列表
				//    3：隐藏查看更多这几个字
				//知识点：.hide()  隐藏
				self.more=true;                //是否请求更多 此时为false
				self.queryList(self.more);              //向后台请求列表数据
				$(this).hide();                //隐藏文字			
			});
			$("#product_list").on("click",".product_car",function(){  //点击小购物车添加
				//思路：1：因为li里面都是未来元素，所以我们需要找到他的父元素ul,然后进行绑定事件
				//    2:取购物车的父元素li 但是购物车的父元素不是Li，所以我们需要找祖先元素最近的li 用closet()
				//    3：然后把商品li的id传给后台，看是否成功，然后添加数量
				//var id=$(this).closest("li").prop("id");   第一种写法
				var id=$(this).closest("li")[0].dataset.id;   //取出li的id名 如果用H5则需要转化为DOM对象，dataset.xxx
				self.addShop(id);           //把商品的id传给后台，不能一点击就添加，要看后天是否添加成功
			}); 
			$("#product_list").on("click","a",function(){ //点击商品
				//思路：1：商品是一个图片在a链接里面，所以点击商品的这个未来元素就是a
				//    2:点击商品跳转到这个商品的详情页并且把this后面的id值表示出来 
				location.href="detail.html?id="+this.closest("li").dataset.id;  //跳转到详情页
			});
			$("#pop_car").on("click",function(){  //点击总购物车，跳转到购物车页面
				location.href="shoppingCar.html";
			});
			$("#recommend").on("click",function(){
				location.href="detail.html?id="+this.dataset.id;
			})
			
			var self=this;
		},//bindEvend end
		queryList:function(more){           //请求商品列表  是否为加载更多 可能为more 可能为true，所以用一个变量more
			var self=this;
			$.ajax({
				url:"http://192.168.6.133:3000/shopListQuery ",   //就是打开首页看到的东西，所以就是首页接口
				type:"post",
				data:{sessionId:localStorage.getItem("sessionId"),isMore:more},
				
				dataType:"json",
				success:function(res){
					if(typeof res=="string"){
						res=JSON.parse(res);
					}
					if(res.resCode!="000"){
						alert(res.resMsg);
					}else{                      //more这个变量 false表示第一次加载  true表示多次加载，传给后台让后台做判断
						self.render(res,more);   //表示数据请求成功，然后进行渲染，渲染有两种情况isMore为false或者true  用变量名more表示。
						                 //所以这里需要传两个参数，一个是res,一个是more 。因为渲染页面代码较多，进行函数封装
					}
				},
				error:function(r){
					alert(r);
				},
			});//$.ajax end
		},//queryList end
		render:function(res,more){    //进行页面渲染。这里有两个参数 一个是res,一个是more 这个变量
			//思路：1：渲染数据 进行字符串拼接 ，改变需要改的内容
			    //2：先声明一个变量为空，然后让一个li模板等于他  然后放进li的父元素ul里面
			    //3：为了简洁 res包含list list再包含渲染的详细数据  所以声明一个变量等于res,list;
			    //4:str 要进行+=，这样才不会被覆盖，并且要设置id属性  后面才好把id传过去  用data-id 设置
			    //5：价格要先把字符串转化为数字，并且保留两位小数Number(list[i].price).toFixed(2)
			    var str="";
			    var list=res.list;
			    if(!more){
				  //  $("#recommend").data("id",list[0].id)
				    $("#recommend img").prop("src",list[0].imgUrl);
				    $("#recommend img").prop("data-id",list[0].id);
				  //JQ设置的data-id  html是取不到的  要用原生ＪＳ写
				  $("#recommend")[0].dataset.id=list[0].id;
				  //要把JQ转成原生JS =list[0].id
				    
				    $(".recom_price p").text("￥"+Number(list[0].price).toFixed(2));
				    $(".recom_price s").text("原价"+Number(list[0].oldPrice).toFixed(2));
				    list.shift();
			    }
			    for(var i=0;i<list.length;i++){//  注意str 是+=  且要在里面设置一个id名 把id值写进去
				    str+='<li data-id="'+list[i].id+'">\
	                        <div class="product_box">\
	                            <a><img src="'+list[i].imgUrl+'"></a>\
	                            <h2><a>'+list[i].shopName+'</a></h2>\
	                            <div class="clearfix">\
	                                <div class="product_price fl">￥<span class="product_mpney">'+Number(list[i].price).toFixed(2)+'</span></div>\
	                                <div class="product_car fr"></div>\
	                            </div>\
	                        </div>\
	                    </li>';
			    };  //.................................................下面不理解
			    if(!more){               //如果是第一次加载少的商品
			    	$("#product_list").html();             //没有更多
			    	$("#product_list").html(str);          //进行全部覆盖
			    }else{                   //如果是点击更多之后
			    	$("#product_list").append(str);
			    }
			    
			    //res.shopNum   商品数量从后台取出  
			    
			    if(res.shopNum!=0){
			    	//把值显示在购物车里面 并且存起来 传给后面的页面
			    	$(".car_trolley").text(res.shopNum);     //把值放在购物车提示框内
					$(".car_trolley").removeClass("dsn");   //删除小购物车隐藏提示框的类
					localStorage.setItem("prdNum",res.shopNum);
			    }
		},//render end
		addShop:function(id){             //把点击小购物车商品id传给后台是否添加成功
			var self=this;
			$.ajax({
				url:"http://192.168.6.133:3000/addToShopCar ",     //添加到购物车接口
				type:"post",
				data:{sessionId:localStorage.getItem("sessionId"),id:id,prdNum:1},    //表示点击一次,数量添加一个
				
				dataType:"json",
				success:function(res){
					if(typeof res=="string"){
						res=JSON.parse(res);
					}
					if(res.resCode!="000"){
						alert(res.resMsg);
					}else{                        //请求数据成功
						//思路:1:首先把本地存储记忆的产品数量取出来给到一个变量
						//    2:如果newly 为Y新增商品 :如果为N 就表示已添加过就不添加
						//    3:避免刷新购物车清空,所以需要记住当地的数量值
						//    4:然后把数量放在小购物车网页上
						//    5:移除已经隐藏在大小购物车右上角的红色图框
						//    6:最后进行延时操作,让提示框自动隐藏
						var num=localStorage.getItem("prdNum");
						if(res.newly=="Y"){   
							num++;            //数量++
						}
						localStorage.setItem("prdNum",num);  //记住添加的数量
						$(".car_trolley").text(num);     //把值放在购物车提示框内
						$(".car_trolley").removeClass("dsn");   //删除小购物车隐藏提示框的类
						$(".pop_wrapper").removeClass("dsn");   //删除大购物车隐藏提示框的类
						setTimeout(function(){
							$(".pop_wrapper").addClass("dsn");  //一秒钟后自动添加隐藏的类名
						},1000);
					}
				},
				error:function(r){
					alert(r);
				},
			});//$.ajax end
		},//addShop end；
	};
	home.init();
})();
