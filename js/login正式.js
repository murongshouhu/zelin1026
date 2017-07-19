(function(){   //
	var login={
		init:function(){
			this.bindEvent();
			//如果有记住的用户名，则把用户名显示在手机号码框内 也就是user-name
			if(localStorage.getItem("userName")){  //if()括号里面表示取出来的值，有值就会直接运行，所以下面把值直接放进用户名框内就可以了。
				$("#user-name").val(localStorage.getItem("userName"));
				$("#checkbox").prop("checked",true);  //优先使用prop
			}
		},
		bindEvent:function(){
			var self=this;
			$("#register").on("click",function(){
				location.href="register.html";
			});
			$("#submit").on("click",function(){  //这里登录需要判断需要进行数据请求
				self.submitAjax();       //封装一个函数，代码简洁
			});
			$("#checkbox").on("click",function(){
				//js需要记住用户名  这里选择用久存在记忆，除非你自己删除记忆  用localStorage  
				//setItem() 表示记住  括号里面前面一个参数是自己取得值
				//getItem()  表示取出里面的值，这里可以在初始化地方做判断
				//removeItem() 删除里面的值，表示删除之前的记忆
				//思路：如果勾选框勾选上就记住用户名，如果没有勾选上就删除本地的记忆
				if($("#checkbox").prop("checked")){
					localStorage.setItem("userName",$("#user-name").val());
				}else{
					localStorage.removeItem("userName");   //这里就表示把值删除了，不需要括号里面再放$("#user-name").val()；
				}

			});
		},
		submitAjax:function(){
			//思路：1：判断手机号码，密码是否合理
			//    2：如果合理 ，进行ajax请求
			//    3：如果请求成功，进行弹窗 并跳转到登录页面
			//首先要知道手机号码 和密码的正则表达式
			var phoneReg=/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
			var userName=$("#user-name").val();
		  	var passwordReg=/^\w{6,18}$/
		  	var password=$("#password").val(); 
		  	
		  	 
		  	if(!phoneReg.test(userName)){  //注意用户名是的id是userName
		  		alert("手机号码输入不正确");
		  		return;
		  	}else if(!passwordReg.test(password)){
		  		alert("输入密码不正确");
		  		return;
		  	}else{   //能够运行到这里说明手机号码，密码输入正确，现在进行ajax请求
		  		$.ajax({
		  			url:"http://192.168.6.133:3000/login",  //登录接口
		  			type:"post",
		  			data:{userName:userName,password:password},
		  			
		  			dataType:"json",
		  			success:function(res){
		  				if(typeof res=="string"){
		  				res=JSON.parse(res);
		  				}
		  				//写到这里就是如果请求成功
		  				if(res.resCode!="000"){  //记住括号里面一段代码为false 才会进去。非！有等号判断是非等！=
		  					alert(res.resMsg);
		  				}else{  //请求成功之后进行弹窗，记住sessionId并跳转到首页页面
		  					alert("登录成功");
		  					localStorage.setItem("sessionId",res.sessionId);
		  					location.href="home.html";
		  					
		  					
		  				}
		  			},
		  			error:function(r){
		  				
		  			},
		  			
		  		});//$.ajax end
		  	};
		  	
		},//submitAjax end
	};
	login.init();
})();

