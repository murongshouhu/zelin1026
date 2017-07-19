//接收前面play

(function(){
	var payIndex={
		init:function(){
			this.orderInfo=JSON.parse(localStorage.getItem("orderInfo"));   //取出来需要把存进去的字符串转化为对象
			this.renderList();   //渲染
			this.bindEvent();    //记得初始化绑定事件
		},//init
		bindEvent:function(){
			//点击好邻居跳转到首页home页面
			$("#home").on("click",function(){
				location.href="home.html";
			});
			
			//点击微信安全支付跳转到面对面付款
			$("#order_pay_btn").on("click",function(){
				location.href="faceToFace.html";
			})
		},//bindEvent end
		renderList:function(){
			var self=this;
			var orderInfo=self.orderInfo;
			$("#id_order").text(orderInfo.orderNum);    //订单号
			$("#order_price").text(orderInfo.orderMoney);  //订单金额
			$("#order_coupons").text(orderInfo.discount);  //优惠券折扣
			$("#order_needpay").text(orderInfo.needToPay);  //需要支付
			
			
		},//renderList end
							
	};//payIndex end
	
	payIndex.init();
})();
