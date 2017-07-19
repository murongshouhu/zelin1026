//思路：1：绑定事件有6个  ，好邻居；加减框；购物车图标；加入购物车；立即购买
//    2:首先要取出产品的id  存起来
//  思路：首先要判断是否登录  ，如果没有登录，则跳转到登录页面；否则就进行AJAX请求详情页数据，渲染页面。绑定事件
(function(){      //自调用，防止全局污染
	var detail={
		init:function(){   //初始化绑定事件
			if(!localStorage.getItem("sessionId")){   //判断是否登录   在于前面本地记忆存储的sessionId
				alert("您还未登录，请先登录");
				location.href="login.html";
			}else{     //否则就是登录了，就需要知道前面点击图片的id，这样就可以向后台请求数据，绑定事件
				this.id=location.href.split("?id=")[1];    //取出URL传输的id 存起来
				this.prdNum=localStorage.getItem("prdNum"); //把数量取出来传到购物车icon右上角里
				    $(".car_trolley").removeClass("dsn");  
		        	$(".car_trolley").text(this.prdNum);
				this.queryDetail(this.id);   //进行后台请求 渲染页面  ，向后台请求就需要把id传过去;this.id这里为实际参数，可以与形式参数不一样命名
			}
			
			this.bindEvent();
		},//init end

        bindEvent:function(){   //绑定好邻居，购物车icon,立即跳转购买点击
        	var self=this;
        	$("#home").on("click",function(){   //点击好邻居跳转到首页
        		location.href="home.html";
        	});
        	$("#floatbar_bottom_cart").on("click",function(){ //点击购物车跳转到购物车页面
        		location.href="shoppingCar.html";
        	});
        	$("#buy_now").on("click",function(){  //点击立即支付跳转到购买页面
        		//首先要把商品的id 图片1 价格 数量  名称 存储到本地 ，然后跳转到playOrder把数据带过去 然后进行跳转
        		var id=self.id;     //id 在上面我们已经取出  就是this.id
        		var price=$(".unit_price span").text();   //价格
        		var num=$(".number_edit ").text();   //数量
        		var imgUrl=$(".pic img").eq(0).prop("src");       //第一张图片 里面的地址 ，调出属性用prop()
        		var name=$(".shopping_box h2").text(); //名称
        		//下面要把他们存起来传过去 ，可以先声明一个数组 吗，然后传一个对象过去  对象里面有产品id 等
        		var list=[];
        		list.push({
        			id:id,
        			price:price,
        			num:num,
        			imgUrl:imgUrl,
        			name:name,
        		});
        		//locaStroge进行存储 必须是字符串，所以首先要进行字符串化
        		list=JSON.stringify(list);  //进行转化为字符串
        		localStorage.setItem("list",list);   //存储起来
        		location.href="playOrder.html";
        	});
        	
        	
        	//点击加减框 点击数字框  点击加入购物车框；为了整洁美观，一律用函数封装  用函数封装需要用到this，所以先要声明
        	//首先要对比剩余数量与购买数量 ，要确保剩余数量大于购买数量，因为要进行对比，所以首先要用Number转化为数字
        	$(".minus_icon ").on("click",function(){  //点击减框  数字框递减  
        		self.minusIcon();
        		
        	});
        	$(".add_icon ").on("click",function(){  //点击加框 数字递增
        		self.addIcon();
        	});
        	$(".number_edit ").on("click",function(){  //点击数字框 出现输入数量框
        		self.numberEdit();
        	});
        	$("#join_car").on("click",function(){   //点击加入购物城框，购物车icon右上角有数字显示
        		self.joinCar();
        	});
        	
        	
        	//点击弹出输入数量框  输入数字 会有确定和取消两种绑定点击事件
        	//弹出框本来就有dsn属性    
        	$(".pop_sure_btn").on("click",function(){   //点击确定  把输入数量框值给到页面上数量
        		var numput=$("#number_input").val();    //恢复增加dsn属性
        		$(".number_edit").text(numput);    
        		$("#add_minus_Pop").addClass("dsn");    
        	});
        	$(".pop_remove_btn").on("click",function(){ //点击取消  保持原状，恢复增加dsn属性
        		$("#add_minus_Pop").addClass("dsn");
        	});
        	
        },//bindEvent end
        numberEdit:function(){  //点击数字框会弹出数量输入框，输入数字    删除隐藏类 显示弹出数量框。
        	$("#add_minus_Pop").removeClass("dsn");
        	$("#number_input").val($(".number_edit").text());
        },//numberEdit end 
        minusIcon:function(){
        	var leftNum=Number($("#leftNum span").text());   //剩余数量
        	var  num=Number($(".number_edit ").text());  //购买数量
        	if(num>0){  //如果购买数量小于剩余数量 这样数字框增加    点击数字会显示一个隐藏输入数量弹框，把数字框的值直接给到输入数量框的值
        		$(".number_edit ").text(--num);   //num++还是原来值  ++num的值才会减1
        		$("#number_input").val(num);
        	}else{
        		alert("没有商品可以减少");
        	}
        },//minusIcon end
        addIcon:function(){
        	var leftNum=Number($("#leftNum span").text());   //剩余数量
        	var  num=Number($(".number_edit ").text());  //购买数量
        	if(num<leftNum){  //如果购买数量小于剩余数量 这样数字框增加    点击数字会显示一个隐藏输入数量弹框，把数字框的值直接给到输入数量框的值
        		$(".number_edit ").text(++num);   //num++还是原来值  ++num的值才会加1
        		$("#number_input").val(num);
        	}else{
        		alert("今天已卖完，请明天预约");
        	}
        },//addIcon end
        
        joinCar:function(){// 点击加入购物车，数量显示在购物车icon右上角 ，但是要后台确认成功才能确定是否添加成功，所以要进行ajax请求
        	var self=this;
        	$.ajax({
        		url:"http://192.168.6.133:3000/addToShopCar",
        		type:"post",
        		data:{sessionId:localStorage.getItem("sessionId"),
		        	  id:self.id,           //上面已经把id变为this的一种属性this.id   这里要先self=this  /这里的id为实参
		        	  prdNum:$(".number_edit ").text()},
		        	  
		        dataType:"json",
		        success:function(res){
		        	if(typeof res=="string"){
		        		res=JSON.parse(res);
		        	}
		        	if(res.resCode!="000"){
		        		alert("res.resMsg");
		        	}else{           //请求购物车接口数据成功 把数量值添加到购物车图片右上角隐藏的div里面
		        		$("#hasAdd").removeClass("dsn");
		        		var id=setInterval(function(){
		        			
		        			$(".car_trolley").removeClass("dsn");
		        		    $(".car_trolley").text($(".number_edit ").text());
		        		    $("#hasAdd").addClass("dsn");
		        		},1000)
		        		
		        		
		        		
		        	}
		        },
		        error:function(r){
		        	alert("请求购物车添加失败")
		        },
        	});//$.ajax end
        	
        },//joinCar end
		queryDetail:function(id1){   //此时登录成功进行后台ajax请求
			var self=this;
			$.ajax({
				url:"http://192.168.6.133:3000/productDetail",       //详情页接口
				type:"get",
				data:{id:id1},
				
				dataType:"json",
				success:function(res){
					if(typeof res=="string"){
						res=JSON.parse(res);
					}
					if(res.resCode!="000"){
						alert(res.resMsg);
					}else{             //这里就是向后台请求数据成功，进行渲染页面，代码较多封装一个函数。
						               //这里要用到this ，所以要先声明self=this
						self.render(res.productDetail);   //看接口知道主要是渲染productDetail,所以我们需要把请求的数据传给渲染函数里面，不然没有数据无法渲染
					}
				},
				error:function(r){
					alert("失败"+r);
				},
			});//$.ajax end
		},//queryDetail end
		render:function(obj){   //进行渲染页面
		//	 obj=res.productDetail;
			$(".shopping_box h2").text(obj.shopName);    //商品简介
			$(".unit_price span").text(obj.price);    //商品价格
			$("#leftNum span").text(obj.leftNum);  //剩余数量
			$("#graphic_details").text(obj.disc);      //图文详情
			var str="";
			for(var i=0;i<obj.imgList.length;i++){
				str+='<li>\
                        <a class="pic" href="#"><img src="'+obj.imgList[i]+'"/></a>\
                    </li>'
			}
			$("#slideBox ul").html(str);      //注意是类  不是id ;用点不是#
			Touch({ 
		        slideCell:"#slideBox",
		        titCell:".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
		        mainCell:".bd ul", 
		        effect:"left", 
		        autoPage:true,//自动分页
		        autoPlay:true, //自动播放
	        });
		},//render end

	};//detail end
	
	detail.init();    //初始化函数调用
})();
