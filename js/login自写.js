(function(){
	var login={
		init:function(){
			this.bindEvent();
			//这里需要进行初始化判断是否有记忆，如果有就取出来..........................
			if(localStorage.getItem("userName")){  //括号里面表示的是一个值
				$("#user-name").val(localStorage.getItem("userName"));//把值放进去
				$("#checkbox").attr("checked",true);
			}
		},//init end
		bindEvent:function(){  //3个绑定事件
			var self=this;
			$("#register").on("click",function(){
				location.href="register.html";
			});
			$("#submit").on("click",function(){
				self.submitAjax();;
			});
			$("#checkbox").on("click",function(){
				//记住用户名
				if($("#checkbox").prop("checked")){
					localStorage.setItem("userName",$("#user-name").val()); //记住存储有两个参数第一个是记忆所取的名字，后面一个是需要记忆的值
					
				}else{
					localStorage.removeItem("userName");
				}
			});
		},//bindEvent end
		submitAjax:function(){
			//思路：1：判断用户名手机号码， 密码是否符合规则，
			//    2：如果符合，进行ajax请求
			//    3：如果请求成功，进行弹窗登录成功，并且保存记忆sessionId,跳转到首页
			var phoneReg=/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
			var userName=$("#user-name").val();
			var passwordReg=/^\w{6,18}$/;
			var password=$("#password").val();
			if(!phoneReg.test(userName)){
				alert("手机号码输入不正确");
				return;
			}else if(!passwordReg.test(password)){
				alert("输入密码不正确")
				return;
			}else{  //这里说明前两者都正确，进行ajax请求
				$.ajax({
					url:"http://192.168.6.133:3000/login",         //登录接口
					type:"post",
					data:{userName:userName,password:password},
					
					dataType:"json",
					success:function(res){
						if(typeof res=="string"){  //记住是双等号
							res=JSON.parse(res);
						}
						if(res.resCode!="000"){
							alert(res.resMsg);
						}else{  //弹窗 记住用户id   跳转到首页
							alert("登录成功");
							localStorage.setItem("sessionId",res.sessionId);
							location.href="home.html";
							//下面是解决BUG  先记住后放进去
							localStorage.setItem("userName",$("#user-name").val());
							if(localStorage.getItem("userName")){  //括号里面表示的是一个值
				               $("#user-name").val(localStorage.getItem("userName"));//把值放进去
				           }
		  					
						}
					},
					error:function(r){
						alert(r);
					},
				});//$.ajax end
			}
		},//submitAjax end
	};//login end
	
	login.init();     //调用初始化函数
})();
