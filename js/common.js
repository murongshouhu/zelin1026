
(function(){
	var common={
		init:function(){
			this.env="";
			this.rootUrl="http://127"
		},
		
		delCar:function(){
			var sessionId=localStorage.getItem("sessionId");
			var arr=["1110","1111","1112","1113","1114","2220","2221","2222","2223"];
			$.ajax({
				url:"http://192.168.6.133:3000/deleteAll",
				type:"post",
				data:{sessionId:sessionId,list:arr},
				
				dataType:"json",
				success:function(res){
					alert("删除成功")
				},
				error:function(res){
					alert("获取失败")
				},
				
			});
		},
	}
	window.common=common;    //这里一定要把common变为全局变量  才能引入   在控制台打common 显示出对象
	                          //代表引入成功，然后在控制台调用delCar()函数 删除  ，然后在resours面板打开localStorage 
	                          //点击proNum 点击右键 选择delete  这样在控制台就清空购物车了。不需要再每个页面进行绑定只需要引入common文件
	                          //注意错误  common   后面是n  不是m
	                          
})();
