//思路1：首先观看页面就知道肯定有ajax请求 以及请求成功之后进行渲染 绑定事件。初始化肯定需要进行页面加载数据请求 绑定事件 
(function(){
	var shoppingCar={
		init:function(){
			this.queryList();
			this.bindEvent();
		},//init end
		bindEvent:function(){//绑定数据
			//思路：根据需求分析 ，有下面几个绑定事件
			//1：点击好邻居跳转到首页 注意HTML好邻居是a标签，里面href="#"这样才能跳转
			//2：点击li勾选框 和全选勾选框 进行勾选与不勾选切换 toggle
			//3：点击结算页面跳转到结算页面
			//4：点击编辑，显示加减框 字改为完成  ，数量消失   数量值显示在加减框中值；隐藏结算 总价格框，显示删除框，li 和全选框默认未勾选  全选二字框居中
			//点击完成说明数据选取已定，此时需要向后台请求数据，后台添加成功，才算 ，然后把添加成功的值返回给编辑页面的数量
			//5：完成页面有一个删除框  点击删除框显示一个确认删除框
			//5：确认删除框有考虑 和确定删除两个选项   ；点击考虑只需要隐藏确认删除框就行 
			//   点击确认删除 需要向后台请求数据 在后天删除 然后再返回 。进行调用计算函数
			//6：点击加减框  来改变加减框的值 增大和递减
			//注意点：一定要知道li 勾选框 和加减框都是未来元素 要把点击事件放到父元素上
			
			var self=this;
			//1点击好邻居
			$("#home a").on("click",function(){
				location.href="home.html"
			});
			
			//3:点击结算
			$("#account_btn").on("click",function(){
				location.href="playOrder.html";
			});
			
			//2：点击li勾选框  
			$("#shopping_list").on("click",".no_select ",function(){
				//注意选取元素；这里只能选取 this 的最近closest()  的li
				$(this).closest("li").toggleClass("select");
				//如果勾选框li 有select类的长度等于list li 的长度 那样就表示全部选中 此时全选需要被勾选，否则全选需要移除勾选
				if($("li.select").length==$("#shopping_list li").length){
					$("#select_all").addClass("select");
				}else{
					$("#select_all").removeClass("select");
				}
				//点击勾选不勾选 下面价格需要实时更新 所以这里需要调用计算函数
				self.calcTotalPrice();
			});
			
			//2点击全选框
			$("#select_all").on("click",function(){
				$("#select_all").toggleClass("select");
				//如果勾选框选中有select这个类  那么所有的li都要被勾选 否则都要移除勾选
				if($("#select_all").hasClass("select")){
					$("#shopping_list li").addClass("select");
				}else{
					$("#shopping_list li").removeClass("select");
				}
				self.calcTotalPrice();    //数据需要实时更新 所以需要调用函数
			});
			
			//点击编辑
			$("#car_edit").on("click",function(){  //代码较多封装一个函数
				self.carEdit();   //点击编辑函数
			});
			
			//点击编辑减框   注意  加减框属于渲染出来的未来元素  需要赋给父元素点击事件
			$("#shopping_list").on("click",".minus_icon ",function(){
				var num=$(this).next().text();
				//..........................................................................
			})
		},//bindEvent end
		carEdit:function(){   //点击编辑函数
			if($("#car_edit").text()=="编辑"){
				$("#car_edit").text("完成");
				$(".number").addClass("dsn");  //隐藏编辑数量
				$(".number_content ").removeClass("dsn") //显示加减框
				$("#account_btn").addClass("dsn");  //隐藏结算框
				$("#total_box").addClass("dsn");  //隐藏总价格框
				$("#delete_btn").removeClass("dsn");  //显示删除框
				$(".select_all_txt").css("text-align","center");  //全选二字框居中
				$("#shopping_list li").removeClass("select");  //默认所有li勾选框
				$("#select_all").removeClass("select");  //取消全选勾选框
				//现在需要把编辑页面数量 放在完成加减框的数量上
				for(var i=0;i<$("#shopping_list li").length;i++){
					var bnum=Number($(".number span").eq(i).text());
					var wnum=Number($(".number_edit").eq(i).text());
					$(".number_edit").eq(i).text(bnum);
				}
			}else{  //此时就是点击完成。说明客户已经修改数据需要提交给后台，后台删除或添加数据成功才行 ，
				    //所以首先需要传给后台sessionId  商品id  商品数量 prdNum  接口list:{id:id,prdNum:prdNum}
				    //思路：首先声明一个空数组 然后用push()方法在数组末尾添加一个对象  。id 和数量就在这一个对象里
				    var list=[];  //...................................
				    for(var i=0;i<$("#shopping_list li").length;i++){
				    	var id=$("#shopping_list li").eq(i).data("id");
				    	var num=$(".number_edit").eq(i).text();
				    	list.push({
				    		id:id,
				    		prdNum:num,
				    	})
				    }
				    $.ajax({    //传数据给后台添加数据成功
				    	url:"http://192.168.6.133:3000/editCar ",   //编辑接口
				    	type:"post",
				    	data:{
				    		sessionId:localStorage.getItem("sessionId"),
				    		list:list,
				    	},
				    	
				    	dataType:"json",
				    	success:function(res){
				    		if(typeof res=="string"){
				    			res=JSON.parse(res);
				    		}
				    		if(res.resCode!="000"){
				    			alert(res.resMsg);
				    		}else{  //注释相反
				    			alert("请求完成接口数据成功");
				    			$("#car_edit").text("编辑");
								$(".number").removeClass("dsn");  //隐藏编辑数量
								$(".number_content ").addClass("dsn") //显示加减框
								$("#account_btn").removeClass("dsn");  //隐藏结算框
								$("#total_box").removeClass("dsn");  //隐藏总价格框
								$("#delete_btn").addClass("dsn");  //显示删除框
								$(".select_all_txt").css("text-align","center");  //全选二字框居中
								$("#shopping_list li").addClass("select");  //默认所有li勾选框
								$("#select_all").addClass("select");  //取消全选勾选框
								
								//最后把完成后的值再放到编辑页面的数字框中  有多个li 所以有多个值  用for循环
								for(var i=0;i<$(".number_edit").length;i++){
									$(".number span").eq(i).text($(".number_edit").eq(i).text());
								}
				    		}
				    	},
				    	error:function(res){
				    		alert("请求完成接口数据失败")
				    	},
				    })
			}
		},//carEdit end
		queryList:function(){
			var self=this;
			$.ajax({
				type:"post",
				url:"http://192.168.6.133:3000/shopCarList ",   //购物车详情接口
				data:{sessionId:localStorage.getItem("sessionId")},
				
				dataType:"json",
				success:function(res){
					if(typeof res=="string"){
						res=JSON.parse(res);
					}
					if(res.resCode!="000"){
						alert(res.resMsg);
					}else{  //接收数据成功弹窗提醒  进行渲染页面
						alert("接收自写数据成功");
						self.render(res.list); //我们只需要渲染列表 只需要res里面的list。这里需要把参数传给render
					}
				},
				error:function(res){
					alert("接收数据失败");
				},
				
			});
		},//queryList end
		calcTotalPrice:function(){   //算取价格函数
			//思路：1：只算取选中的列表 ，所以首先需要选取所有有select类的li
			//2: 先声明一个变量等于0，然后计算每一行列表的总价=价格*数量 然后把他们全部相加。最后放到总价格盒子text
			var $lis=$("li.select");
			var total=0;
			for(var i=0;i<$lis.length;i++){
				var price=Number($lis.eq(i).find(".unit_price span").text());    //价格
				var num=Number($lis.eq(i).find(".number span").text());    //数量
				total+=price*num
			}
			$("#pay_account").text(total);
		},//calcTotalPrice end
		render:function(obj){  //
			//渲染时有两种情况1：没有选中列表 购物车是空的  这样需要把商品列表的盒子隐藏，显示购物车空空盒子
			//2：用字符串拼接，然后放到父元素ul里面  这里渲染之后自行实时进行计算
			var self=this;
			if(obj.length==0){     //obj.length表示列表的长度 ，如果长度为0 就表示购物车为空
				$("#shopping_list").addClass("dsn");
				$("#empty_cart").removeClass("dsn");
				return false;
			}else{
				var str="";
				for(var i=0;i<obj.length;i++){
					str+=' <li class="select" data-id='+obj[i].id+'>\
		                <div class="no_select select_ok"></div>\
		                <div class="shopping_img"><a href="productdetails.html"><img src="'+obj[i].imgUrl+'"></a></div>\
		                <div class="shopping_box">\
		                    <h2>'+obj[i].shopName+'</h2>\
		                    <div class="shopping_box_bottom">\
		                        <div class="unit_price">￥<span>'+Number(obj[i].price).toFixed(2)+'</span></div>\
		                        <div class="number">x<span>'+obj[i].prdNum+'</span></div>\
		                        <!--编辑状态加减框-->\
		                        <div class="number_content dsn">\
		                            <div class="minus_icon js_minus"></div>\
		                            <div class="number_edit">'+obj[i].prdNum+'</div>\
		                            <div class="add_icon js_add"></div>\
		                        </div>\
		                    </div>\
		                </div>\
		            </li>'
				}
				$("#shopping_list").html(str); 
				self.calcTotalPrice();
			}
			
			
		},//render end
	};//shoppingCar end
	shoppingCar.init();  //函数初始化调用
})();
