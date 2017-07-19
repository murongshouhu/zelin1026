(function(){
	var register={
		init:function(){
			this.bindEvent();
		},
		bindEvent:function(){
			var self=this;
			$("#login").on("click",function(){
				location.href="login.html";
			});
			$(".codebtn").on("click",function(){
				self.senCode();  //封装函数 :发送验证码
			});
			$("#submit").on("click",function(){
				self.submitAjax();  //封装函数：立即注册
			});
		},
		
		senCode:function(){
			//思路：
			//1:输入的手机号码是否合理;
			//2:如果合理,进行ajax请求数据;
			//3:如果请求成功,则进行弹窗并且进行倒计时
			var phoneReg=/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
			var phone=$("#phone").val();
			if(!phoneReg.test(phone)){ //避免头重脚轻,少的代码放在上面所以用非！;test()检测一个字符串是否匹配某个模式,返回true或false;
				alert("输入不正确");
				return;                //结束整个sendCode函数;	
			}else{
				this.verifyCode(phone);   //此时就是输入正确进行后台数据请求ajax,获取验证码但是代码比较多，这里再进行封装一个函数verifyCode();因为输入正确,手机号码phone需要传进去
			}
		},//sendCode()end
		verifyCode:function(phone){        //这里记得把参数phone传进去
			$.ajax({
				url:"http://192.168.6.133:3000/getVerifyCode",
				type:"post",        //此时是进行传给后台数据所以是post
				data:{phone:phone},
				
				dataType:"json",
				success:function(res){
					if(typeof res=="string"){
						res=JSON.parse(res);     //先把res转换成对象
					}
					if(res.resCode!="000"){       //也是头重脚轻原则，因为不成功代码比较少，所以用非！  是！=   不是用在最前面
						alert(res.resMsg)         //接收数据失败，要把参数传给后台  也就是 resMsg
						return;                    //结束函数
					}else{
						alert("验证码已发送到尾号为"+phone.slice(-4)+"的手机上");   //此时就是接收数据成功 resMsg="000"
						//弹窗之后并且进行倒计时
						var i=5;
						var id=setInterval(function(){     //后面要清除，所以我们要用一个id存起来
							$(".codebtn").val(i--+"s后重新发送");
							$(".codebtn").attr("disabled",true);    //表示中间不可以再点击，点击之后无效果。
							if(i<0){
								clearInterval(id);            //清除定时器 id
								$(".codebtn").val("获取短信验证码");   //问题：在2s后直接跳转了
								$(".codebtn").removeAttr("disabled");    //删除属性，因为清除之后，需要把它还原可以点击
							}
						},1000);
					}
				},
				error:function(r){
					
				}
			});//ajax end
		},// verifyCode end
		submitAjax:function(){
			//思路:1:验证手机号,密码,验证码,勾选框,是否正确
			  //  2:如果正确,进行ajax数据请求
			  //  3:如果请求成功,进行弹窗并且跳转到登录页面
			  var phoneReg=/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
			  var phone=$("#phone").val();
			  var passwordReg=/^\w{6,18}$/
			  var password=$("#password").val();
			  var codeReg=/^\d{4}$/;
			  var verifyCode=$("#code").val();
			  if(!phoneReg.test(phone)){
			  	alert("输入电话号码不正确");
			  	return;
			  }else if(!passwordReg.test(password)){
			  	alert("输入密码不正确");
			  	return;
			  }else if(!codeReg.test(verifyCode)){
			  	alert("验证码不正确");
			  	return;
			  }else if(!$("#checkbox").prop("checked")){
			  	alert("未勾选用户协议")
			  }else{
			  	this.registerAjax(phone,password,verifyCode);
			  }
		},//submitAjax end
		registerAjax:function(phone,password,verifyCode){
			$.ajax({
				url:"http://192.168.6.133:3000/register",
				type:"post",
				data:{phone:phone,password:password,verifyCode:verifyCode},
				
				dataType:"json",
				success:function(res){
					if(typeof res=="string"){    //注意是判断等，有两个等号
						res=JSON.parse(res);
					}
					if(res.resCode!="000"){     //如果请求失败
						alert(res.resMsg);
						return;
					}else{
						alert("注册成功");                       //此时就是请求成功
						location.href="login.html";
						
					}
				},
				error:function(r){
					
				},
			})//ajax end
		},//registerAjax end
	};
	register.init();
})()
