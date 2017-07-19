(function(){
	var faceTOFace={
		init:function(){    //代码较简单，直接进行渲染 绑定事件  并且自动获取焦点
			var needToPay=JSON.parse(localStorage.getItem("orderInfo")).needToPay;
			$("#need_pay").text(needToPay);
			this.bindEvent();
			$("#pay_value").focus();
		},//init end
		bindEvent:function(){
			//点击去支付  如果输入金额小于需要支付金额，进行弹框 重新获取焦点 结束函数
			//否则就是输入正确 进行后台请求 看是否支付成功  如果成功，跳转到result页面
			var self=this;
			$("#face_pay").on("click",function(){
				self.playOrder();   //有判断 后台请求 代码较多封装去支付函数
			});
		},//bindEvent end
		playOrder:function(){
			var outPrice=Number($("#pay_value").val());  //后面要进行比较，转化为数字
			var needPay=$("#need_pay").text();
			if(outPrice<needPay){
				alert("您输入的金额有误，请重新输入")
				$("#pay_value").focus();   //重新获取焦点
				return false;
			}else{   //输入正确 进行后台请求是否支付成功
				var orderInfo=JSON.parse(localStorage.getItem("orderInfo"));
				$.ajax({
				url:"http://192.168.6.133:3000/pay",	 //支付页面接口
				type:"post",
				data:{
					sessionId:localStorage.getItem("sessionId"),
					orderNum:orderInfo.orderNum,
					orderMoney:orderInfo.orderMoney,
					discount:orderInfo.discount,
					needToPay:orderInfo.needToPay,
				},
				
				dataType:"json",
				success:function(res){
					if(typeof res=="string"){    //错了3次了  记住是判断等 两个等号 if里面
                       res=JSON.parse(res);
					}
					if(res.resCode!="000"){
						alert(res.resMsg);
					}else{         //进行支付请求成功  跳转结果页
						alert("进行后台支付请求成功");
						location.href="result.html";
						
					}
				},
				error:function(res){
					alert("进行后台支付请求失败")
				},
				});
			}
		},//playOrder end
	};//faceTOFace end
	faceTOFace.init();  //初始化函数调用
})();
