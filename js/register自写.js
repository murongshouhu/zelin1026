(function(){                       //化成局部变量，避免全局污染 使用函数自调用
	var register={                  //进行声明
		init:function(){           //初始化
			this.bindEvent();                           //初始化绑定事件
		},
		bindEvent:function(){
			//思路：有3个绑定事件
			//1:点击登录跳转到注册页面
			//2：点击验证码框获取验证码
			//3：点击注册提交信息是否注册成功
			var self=this;          //后面需要用到this，首先用self把this存起来
			$("#login").on("click",function(){
				location.href="register.html";
			});
			$("#code").on("click",function(){   //获取验证码，说明要向后台请求数据，代码较多，封装一个函数
				self.senCode();                 //马上再下面写上senCode函数
			});
			$("#submit").on("click",function(){ //这里点击注册需要从后台请求数据，进行封装函数
				self.submitAjax();            
			});
		},//bindEvent end
		senCode:function(){
			//思路：1：获取验证码首先要判断手机号码输入是否合理
			   //  2：如果合理，进行ajax请求
			   //  3：如果请求成功，进行弹窗并且进行倒计时
			   //首先要知道手机号码的正则表达式规则，然后用.test()检测输入的东西是否符合这个规则
			   var phoneReg=/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
			   var phone=$("#phone").val();
			   if(!phoneReg.test(phone)){  //不需要等于什么，里面会自动判断返回true 或者false  避免头重脚轻，先写如果失败所以用！非
			   	alert("手机号码输入不正确");
			   	return;                 //结束整个函数
			   }else{         //表示输入正确 ，此时需要进行ajax请求 ，函数代码较多，再进行封装一个函数
			   	this.verifyCode(phone);         //这里的this表示是上面的self。顺便再下面写上这个函数。手机号码这个参数需要传过去
			   }
			   
		},//senCode end
		verifyCode:function(phone){
			//写到手机号码输入正确，进行ajax请求.......................
			$.ajax({
				url:"http://192.168.6.133:3000/getVerifyCode ",  //验证码页面请求
				type:"get",
				data:{phone:phone},
				
				dataType:"json",
				success:function(res){
					if(typeof res=="string"){
						res=JSON.parse(res);
					}
					if(res.resCode!="000"){
						alert(res.resMsg);
					}else{
						alert("短信验证码已经发送到:"+phone.slice(-4)+"的手机上");
						var i=5;
						var id=setInterval(function(){
							$("#code").val(i--+"s重新发送");
							$("#code").attr("disabled",true);
							if(i<0){//此时需要清除定时器 把定时器用一个id名存起来
								clearInterval(id);
								$("#code").val("重新获取验证码");
								$("#code").removeAttr("disabled");
							}
						},1000);
					}
				},
				error:function(r){
					alert(r);
				},
			});//$.ajax end
		},//verifyCode end
		submitAjax:function(){
			//思跳路：1：提交注册首先要判断手机号码，密码，验证码，勾选框 是否都是正确的
			//   2：如果4个都合理，进行ajax请求
			//   3：如果请求成功进行弹窗，并跳转到登录页面
			var phoneReg=/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
			var phone=$("#phone").val();
			var passwordRed=/^\w{6,18}$/;
			var password=$("#password").val();
			var codeReg=/^\b{4}$/;
			var verifyCode=$("#code").val();
			if(!phoneReg.test(phone)){
				alert("输入手机号码不正确");
				return;
			}else if(!passwordRed.test(password)){
				alert("输入密码不正确");
				return;
			}else if(!codeReg.test(verifyCode)){
				alert("输入验证码不正确");
				return;
			}else if(!$("#checkbox").attr("checked")){
				alert("未勾选用户协议");
				return;
			}else{   //运行到这一步，说明前面所有条件都符合此时可以进行ajax请求是否注册成功
				this.registerAjax(phone,password,verifyCode);  //封装函数
			}
			
		},//submitAjax end
		registerAjax:function(phone,password,verifyCode){
			$.ajax({
				url:"http://192.168.6.133:3000/register",   //注册页面接口
				type:"post",
				data:{phone:phone,password:password,verifyCode:verifyCode},
				
				dataType:"json",
				success:function(res){
					if(typeof res=="string"){
						res=JSON.parse(res);
					}
					if(!res.resCode=="000"){
						alert(res.resMsg);
					}else{
						alert("恭喜你注册成功");
						location.href="login.html";
					}
				},
				error:function(r){
					alert(r);
				}
			});//$.ajax end
			 
		},//registerAjax end
	};
	register.init();     //调用初始化函数
})()


//问题：此时出现跨域问题