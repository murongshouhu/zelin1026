//如果是从详情页跳转到playOrder,那么首先在详情页存储产品的id 名称 图片 价格 数量
(function(){
	var playOrder={
		init:function(){
			if(!localStorage.getItem("sessionId")){
				alert("请先登录")
			}else{
				this.list=localStorage.getItem("list");
				this.render();
				this.bindEvent();
			}
		},//init end
		bindEvent:function(){
			var self=this;
			//点击好邻居跳转到home页面
			$("#home").on("click",function(){
				location.href="home.html";
			});
			
			//点击提交订单 跳转到payIndex页面
			$("#submit_order").on("click",function(){
				location.href="payIndex.html";
			});
			
			//点击优惠券  显示出隐藏的优惠券框;向后台请求优惠券接口 ，请求数据成功，然后渲染优惠券列表
			$("#good_coupons").on("click",function(){
				$("#coupons_Pop").removeClass("dsn");
				self.queryCoupons();    // 封装渲染优惠券列表
			});
			
			//点击优惠券取消框 只要添加dsn隐藏起来就可以了
			$(".pop_remove_btn").on("click",function(){
				$("#coupons_Pop").addClass("dsn");
			});
			
			//点击优惠券确定框 此时需要向后台进行ajax数据请求，后台确定成功才算
			$(".pop_sure_btn").on("click",function(){
				self.sureBtn();     //封装优惠券确定函数
			});
		},//bindEvent end
		sureBtn:function(){ //优惠券确定函数
			
		},//sureBtn end
		queryCoupons:function(){  //向后台ajax请求优惠券数据  请求成功渲染优惠券列表
			var self=this;
			$.ajax({
				url:"http://192.168.6.133:3000/coupon",   //查询优惠券接口
				type:"get",
				data:{sessionId:localStorage.getItem("sessionId")},
				
				data:"json",
				success:function(res){
					if(typeof res=="string"){   //注意这里是 typeof res  不要忘记res  不是一个等号 是两个
						res=JSON.parse(res);
					}
					if(res.resCode!="000"){
						alert(res.resMsg);
					}else{
						alert("请求查询优惠券成功");  //后面进行渲染优惠券页面  for循环里面是分号隔开，不是逗号重点注意
					    var str='<li class="select no_coupons">\
				                    <div class="icon_no_ok"></div>\
				                    <div class="coupons_list_messg">\
				                        <div class="coupons_messg_txt">不使用优惠券</div>\
				                    </div>\
				                </li>'          
					    var obj=res.list;
							for(var i=0;i<obj.length;i++){
								str+='<li>\
					                    <div class="icon_no_ok"></div>\
					                    <div class="coupons_list_messg">\
					                        <div class="coupons_messg_txt">\
					                            <span>'+obj[i].amount+'</span>元（满'+obj[i].minBuyAmount+'元可用）</div>\
					                        <div class="coupons_messg_time">有效期至'+obj[i].effectiveDate+'</div>\
					                    </div>\
					                </li>'
			                }
							$(".coupons_list").html(str);
					}
				},
				error:function(res){
					alert("请求查询优惠券失败");
				},
			});
		},//queryCoupons end
		
		queryList:function(){ //进行后台数据请求 如果请求成功渲染页面 以及优惠券
			$.ajax({
				
			});
		},//queryList end
		allPrice:function(list){   //在下面是局部变量  传进来
			//思路：先声明一个变量为0  然后for循环算出每一行列表的总价=价格*数量  然后+=  放在总价格框里 保留两位小数
			var total=0;
			for(var i=0;i<list.length;i++){
				var price=Number(list[0].price);
				var num=Number(list[0].num);
				total+=price*num;
				total=total.toFixed(2);
			}
			$("#pay_account").text(total);
		},//allPrice
		
		render:function(){  //数据已经在detail详情页传过来了 直接进行渲染
			var self=this;
			var list=JSON.parse(self.list);
			var str="";
			for(var i=0;i<list.length;i++){
				str+='<li data-id="'+list[i].id+'">\
                    <div class="shopping_img"><a href="productdetails.html"><img src="'+list[i].imgUrl+'"></a></div>\
                    <div class="shopping_box">\
                        <h2>'+list[i].name+'</h2>\
                        <div class="shopping_box_bottom">\
                            <div class="unit_price">￥<span>'+Number(list[i].price).toFixed(2)+'</span></div>\
                            <div class="number">x<span>'+list[i].num+'</span></div>\
                        </div>\
                    </div>\
                </li>'
			}
			$("#good_list").html(str);
			self.allPrice(list);     //封装计算函数
			//需要计算每一行列表的总价格 然后相加,放在总价格框里 ;做好是在detail详情页里面传过来,这里是在写一遍
		},//render end
		
	};//playOrder end
	playOrder.init();
})();
