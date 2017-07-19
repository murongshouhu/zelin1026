(function(){
	var result={
		//思路：首先进行渲染选中的列表  以及产品订单号
		//2：两个绑定点击事件
		init:function(){
			this.renderList();
			this.bindEvent();
		},//init end
		bindEvent:function(){
			//点击好邻居 返回首页home
			$("#home a").on("click",function(){
				location.href="home.html";
				return false; //阻止默认事件  这里阻止静态页面a链接的自动跳转
				
			});
			
			//点击返回首页 home
			$("#return_index").on("click",function(){
				location.href="home.html";
				return false; //阻止默认事件
			});
			
			//点击图片跳转到详情页
			$("#pay_order").on("click",".shopping_img",function(){    //这是渲染出来的 属于未来元素 ,给他的父元素赋点击事件
				location.href="detail.html?id="+$(this).closest("li").data("id");   //直接用this 找到属于他最近的父元素Li 用data属性取出id
				return false;  //阻止静态页面默认的跳转  再不改动静态页面的前提下 ，执行阻止默认事件
			});
		},//bindEvent end
		renderList:function(){  //取出本地存储是字符串 需要转化为对象，然后取对象里面的值
			var orderNum=JSON.parse(localStorage.getItem("orderInfo")).orderNum;
			$("#id_pay_order").text(orderNum);
			//熏染选中的列表
			var str="";
			var lis=JSON.parse(localStorage.getItem("list"));     //选中的list
			for(var i=0;i<lis.length;i++){
				str+='<li data-id="'+lis[i].id+'">\
					<div class="shopping_img"><a href="productdetails.html"><img src="'+lis[i].imgUrl+'"></a></div>\
                    <div class="shopping_box">\
                        <h2>'+lis[i].name+'</h2>\
                        <div class="shopping_box_bottom">\
                            <div class="unit_price">￥<span>'+lis[i].price+'</span></div>\
                            <div class="number">x<span>'+lis[i].num+'</span></div>\
                        </div>\
                    </div>\
				</li>'
			}
			$("#pay_order").html(str);
		},//renderList end
	};//result end
	result.init();
})();
