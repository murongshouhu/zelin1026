//首先在detail页面吧 商品你id  数量 价格 名称  第一张图片 保存起来 locaStorage.  然后带到订单页进行页面渲染，这里渲染之前就不需要
//进行后台请求了  直接初始化渲染就可以了
(function(){
	var playOrder={
		init:function(){  //初始化 渲染列表   ；请求查询优惠券  绑定事件
//			this.list=JSON.parse(localStorage.getItem("list"));
			this.list=JSON.parse(localStorage.getItem("list"));
			this.renderList();
		//	this.queryCoupons();      表示刚开始就渲染优惠券   我们这里是点击优惠券再进行渲染
			this.bindEvend();
		},//init end
		bindEvend:function(){
			//思路：
			//1:点击好邻居跳转到home首页 ；
			//2：点击图片跳转到详情页  ，li是渲染出来的  未来元素 ，给父元素绑定事件
			//3：点击优惠券，显示隐藏的优惠券列表  且进行渲染
			//4：点击到店自取和点击送货上门  两个点击事件
			//5：点击提交订单到payIndex
			var self=this;
			//点击好邻居
			$("#home a").on("click",function(){
				location.href="home.html";
			});
			
			//点击图片跳转到详情页   ，上面已经把商品id保存了  self.list
			$("#good_list").on("click","img",function(){
				//这里点击跳转到详情页，需要id带过去 通过url 传ID，?id=   ;找到这个点击列表最近的li 取他的data-id  ,data新属性
				location.href="detail.html?id="+$(this).closest("li").data("id");
			});
			
			//点击优惠券          显示优惠券列表 进行后台请求进行渲染  封装优惠券渲染函数
			$("#good_coupons").on("click",function(){
				$("#coupons_Pop").removeClass("dsn");
				self.queryCoupons();
			});
			
			//点击优惠券取消框
			$(".pop_remove_btn").on("click",function(){
				$("#coupons_Pop").addClass("dsn");
			});
			
			//点击优惠券渲染出来的列表（未来元素）        点击哪一个列表哪一个就增加选中类select,其余的siblings()全部移除选中类
			$(".coupons_list").on("click","li",function(){
				$(this).addClass("select");
				$(this).siblings().removeClass("select");
			});
			
			//点击确定
			$(".pop_sure_btn").on("click",function(){   //代码较多  封装一个函数
				//思路：
				self.useCoupon();
			});
			
			//点击送货上门    然后谁点击 谁增加勾选框的类  并且显示隐藏的配送地址
			$("#good_delivery").on("click",function(){
			      $(this).toggleClass("select")
			      $("#store_invite").removeClass("select");
			      $("#user_inf").removeClass("dsn");

			});
			
			//点击到店自取
			$("#store_invite").on("click",function(){
				$("#store_invite").toggleClass("select");
				$("#store_invite").addClass("select");
				$("#user_inf").addClass("dsn");
				$("#good_delivery").removeClass("select");
			})
			
			//5点击提交订单跳转到payIndex
			$("#submit_order a").on("click",function(){
				//思路1：提交订单就是进行ajax请求  如果请求成功 存储商品列表 价格  优惠券折扣 需要支付金额
				//然后跳转到payIndex
				self.submitOrder();    //封装提交订单函数
			});
		},//bindEvend end
		submitOrder:function(){
//			var id=$("#good_list li").data("id");     //取所有li的id 数组  方法记住
//			var list=[];
//			list.push(id);
            var list=[];
            $("#good_list li").each(function(i,dom){    //each方法  里面有两个参数 一个是索引下标，一个是DOM
            	var id=$(dom).data("id");              //取出id的全部数组 要用JQ方法去 ，所以先要把dom对象改为JQ对象
            	list.push(id);                          //一定要熟练掌握
            })
			
			$.ajax({
				url:"http://192.168.6.133:3000/placeOrder",
				type:"post",
				data:{sessionId:localStorage.getItem("sessionId"),
					list:list},
				
				dataType:"json",
				success:function(res){
					if(typeof res=="string"){
						res=JSON.parse(res);
					}
					if(res.resCode!="000"){
						alert(res.resMSg);
					}else{     
						alert("请求提交订单接口数据成功");
						//成功之后需要本地存储商品订单号，商品价格，优惠券折扣价，需要支付的金额
						//然后把存起来的数据传给payIndex页面 并且进行跳转payIndex页面
						var orderInfo={
							orderNum:res.orderNum,   //订单号
							orderMoney:$("#pay_account").text(),
							discount:$("#order_discount").text(),
							needToPay:$("#need_pay").text(),	
						}
						orderInfo=JSON.stringify(orderInfo);      //要把数据进行本地存储 必须首先要把对象转换为字符串
						localStorage.setItem("orderInfo",orderInfo);		
						location.href="payIndex.html";
						return false;
					}
				},
				error:function(res){
					alert("请求提交订单接口数据失败")
				},
			});
		},//submitOrder end
		useCoupon:function(){
			//思路：点击确定   如果不使用优惠券被选中，那么点击确定没有什么改变，继续隐藏优惠券窗口就行
			//优惠券折扣的值变为0.00；  页面上的值显示为不使用优惠券  然后结束函数
			var self=this;
			if($(".no_coupons").hasClass("select")){
				$("#coupons_Pop").addClass("dsn");
				$("#order_discount").text("0.00");
				$("#good_coupons .container_right").text("不使用优惠券");
				return false;
			}else{
				//思路：否则就是选中的优惠券列表  只有一个  所以只要li里有select就是谁
				//之后就是要比较满足金额的最小值 以及有限期限是否过期   所以把最小值取出来 最后期限也取出来
				//如果商品价格小于最少价格  那么弹框 消费不够  结束函数  
				//否则如果new Date  表示现在的时间  +new Date 表示1970到今天的毫秒数  如果大于结束日期的毫秒数 表示过期
				//否则就是可以使用 
			var $li=$(".coupons_list li.select");
			var minPrice=Number($li.find(".minPrice").text());         //  最少价格 才能优惠折扣这是字符串  需要转化为数字
			var endTime=Number($li.find(".endTime").text());           //截止日期
			var couponPrice=Number($li.find(".couponPrice").text());   //优惠券的折扣价格
			var total=Number($("#pay_account").text());                 //商品的价格
			if(total<minPrice){
				alert("消费不足");
				return false;
			}else if(+new Date()>+new Date(endTime+" 23:59:59")){
				alert("已经过期");
				return false;
			}else{                              //表示可以使用
				$("#coupons_Pop").addClass("dsn");         //此时优惠券框隐藏
				$("#order_discount").text(couponPrice);     //页面优惠券的折扣值
				//然后调用计算函数   算出需要付出的值  放在最后的价格框里   计算函数里面已经完成这一步
				self.calcTotalPrice();
				
				$("#good_coupons .container_right").text("已使用优惠券");   //优惠券框里显示已使用优惠券
			} 
			}
		},//useCoupon end
		queryCoupons:function(){    //请求优惠券数据  请求成功之后进行渲染优惠券
			$.ajax({
				url:"http://192.168.6.133:3000/coupon",    //优惠券查询接口
				type:"post",
				data:{sessionId:localStorage.getItem("sessionId")},
				
				dataType:"json",
				success:function(res){
					if(typeof res=="string"){
						res=JSON.parse(res);
					}
					if(res.resCode!="000"){
						alert(res.resMsg);
					}else{
						alert("请求查询优惠券接口成功");  //然后进行渲染优惠券页面  主需要res里面list
						//注意首先是有不使用优惠券这一列表 不需要渲染 我们需要把渲染的优惠券列表加到后面就行用append()
						
						var list=res.list;
						var str="";
						for(var i=0;i<list.length;i++){
							str+='<li>\
				                    <div class="icon_no_ok"></div>\
				                    <div class="coupons_list_messg">\
				                        <div class="coupons_messg_txt">\
				                            <span class="couponPrice">'+list[i].amount+'</span>元（满<span class="minPrice">'+list[i].minBuyAmount+'</span>元可用）</div>\
				                        <div class="coupons_messg_time">有效期至<span class="endTime">'+list[i].effectiveDate+'</span></div>\
				                    </div>\
				                </li>'
						}
						$(".coupons_list").append(str);               //放在优惠券盒子里   不能用html.不然会覆盖掉不使用优惠券 从后面加元素
					}
				},
				error:function(res){
					alert("请求查询优惠券接口失败");
				},
			});
		},//queryCoupons end 
		
		renderList:function(){    //渲染列表     商品id  图片   名称   价格   数量
			var self=this;
//			self.list=JSON.parse(localStorage.getItem("list"));      //这里是一个字符串   如果是字符串就要转化为一个对象JSON.parse()
			var list=self.list;
			var str="";
			for(var i=0;i<list.length;i++){
				str+='<li data-id="'+list[i].id+'">\
                    <div class="shopping_img"><a href="#"><img src="'+list[i].imgUrl+'"></a></div>\
                    <div class="shopping_box">\
                        <h2>'+list[i].name+'</h2>\
                        <div class="shopping_box_bottom">\
                            <div class="unit_price">￥<span>'+list[i].price+'</span></div>\
                            <div class="number">x<span>'+list[i].num+'</span></div>\
                        </div>\
                    </div>\
                </li>'
			}
			$("#good_list").html(str);
			//商品渲染完后  要实时计算价格, 所以这里需要调用计算函数
			self.calcTotalPrice();
			
		},//render end
		calcTotalPrice:function(){    //计算函数
			//思路:要把所有列表li的总价=价格*数量  计算出来  然后相加成为总价格 放在订单金额那里
			var $lis=$("#good_list li");
			var total=0;
			for(var i=0;i<$lis.length;i++){
				var price=Number($(".unit_price span").text());          //这是字符串要转化为数字 后面需要相乘
				var num=Number($(".number span").text());                  //数量
				total+=price*num;
			//	total=total.toFixed(2);
			}
			$("#pay_account").text(total);                           //放在订单金额
			//由思路可知后面的需要支付金额=订单金额-优惠券折扣              ,所以可以先把优惠券取出来  相减放在最后需要支付金额的盒子里
			var orderDiscount=Number($("#order_discount").text());  //优惠券折扣
			    orderDiscount=orderDiscount.toFixed(2);
			 var needPay=total-orderDiscount;                   //需要支付的金额
			     needPay=needPay.toFixed(2);
			 $("#need_pay").text(needPay);                        //放在里面
		},//calcTotalPrice end
	};//playOrder end
	playOrder.init();
})();
