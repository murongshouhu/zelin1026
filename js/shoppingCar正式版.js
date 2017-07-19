(function(){
	var shoppingCar={
		init:function(){  //初始化后台加载数据ajax
			this.queryList();
			this.bindEvent();
		},//init end
		bindEvent:function(){
			//思路：绑定事件:
			//1:点击好邻居跳转到到首页
			var self=this;
			$("#home a").on("click",function(){
				location.href="home.html";
				return false;
			});
			
			//2：点击li进行选中 与未选中来回切换  ，因为li是未来元素  所以需要把点击事件赋给他的父元素
			$("#shopping_list").on("click",".no_select",function(){
				$(this).closest("li").toggleClass("select");   //找到勾选框最近的li 添加和删除select元素
				if(!$(this).closest("li").hasClass("select")){
					$("#select_all").removeClass("select");
				}else{  //如果有selsect类的长度等于li的长度，那么给全选框增加select
					if($("li.select").length==$("#shopping_list li").length){
						$("#select_all").addClass("select");
					}
				}
				self.calcTotalPrice();
			});
			
			//点击全选框  首先让全选框在勾选和未勾选来回切换  然后如果之前没有，点击之后勾选，那么所有li要全部勾选 ；反之全部不勾选
			$("#select_all").on("click",function(){
				$(this).toggleClass("select");
				if($(this).hasClass("select")){  //点击之后有勾选
					$("#shopping_list li").addClass("select");
				}else{                          //否则就是点击之后取消勾选 所有li都要删除select这个类
					$("#shopping_list li").removeClass("select");
				}
				self.calcTotalPrice();
			});
			
			//点击编辑框 显示出加减框 并且之前的数量要消失
			$("#car_edit").on("click",function(){  //函数较多 这里封装一个点击编辑之后的函数
				self.carEdit($(this));                 //这里需要把编辑的元素传进去  实际参数   不能只传this 
			});
			
			//点击减框  加减框是属于渲染出来你的 属于未来元素 需要赋给父元素点击事件  记住：未来子元素类要加点
			$("#shopping_list").on("click",".minus_icon ",function(){
				var num=$(this).next().text();    //表示减框的下一个元素的值
				if(num>1){
					$(this).next().text(--num)
				}
			});
			
			//点击加框 同理
			$("#shopping_list").on("click",".add_icon ",function(){
				var num=$(this).prev().text();    //表示减框的上一个元素的值
					$(this).prev().text(++num);
			});
			
			//点击删除
			$("#delete_btn").on("click",function(){  //会弹出一个确定删除框 
				self.showDelete();
			});
			
			//点击考虑一下 
			$(".pop_remove_btn").on("click",function(){  //此时就是什么都不需要改变，只需要隐藏确定删除框
				$(this).closest(".pop_wrapper").addClass("dsn");      //注意这里用this  不然就会选中3个 执行第一个 就是错误的
			}); 
			
			//点击删除框中的确定框
			$(".pop_sure_btn").on("click",function(){   //此时就是确定删除成功  需要向后台请求数据，从后台删除然后再返回
				self.deleteShop();    //封装删除确定函数
				
			});
			
			//点击去结算
			$("#account_btn").on("click",function(){
				//思路点击去结算跳转到订单页playOrder,所以需要把图片url name id price num  传过去
				//新知识点 each()方法
				var $lis=$("#shopping_list li div.select_ok").closest("li");    //用JQ取出所有选中的商品列表li  //先选出所有选中的，然后找出所有离他最近的父元素li
				var list=[];
				$lis.each(function(i,dom){   //两个变量 自己取名 一般都是这样取 系统自动给数据  和event类似
					//因为此时li是dom对象，需要先转化为JQ对象，用data属性取出id等
					var id=$(dom).data("id");
					var name=$(dom).find("h2").text();
					var price=$(dom).find(".unit_price span").text();  //$(".unit_price span")
					var num=$(dom).find(".number span").text();
					var imgUrl=$(dom).find("img").prop("src");
					var obj={
						id:id,
						name:name,
						price:price,
						num:num,
						imgUrl:imgUrl,
					}
					list.push(obj);
				})
				
				list=JSON.stringify(list);
				localStorage.setItem("list",list);
				location.href="playOrder.html";
				return false;
				
			});
		},//bindEvent end
		showDelete:function(){  //确定删除选中的商品类数 首先要把商品类数保存起来
			var num=$("li.select").length;
			$("#sure_Del").removeClass("dsn")    //使确定删除框显示出来
			$("#sure_Del span").text(num);   //把商品类数放在上面
			
		},//showDelete end
		deleteShop:function(){   //这里需要传给后台sessionId  和要删除选中商品的所有id数组
			var list=[];
			for(var i=0;i<$("li.select").length;i++){
				list.push($("li.select").eq(i).data("id"))  //这里表示增加数组里面的值  不能直接list=list.push() 要先用一个变量装起来，然后在等进去等于
			}
			$.ajax({  
				url:"http://192.168.6.133:3000/deleteFromShopCar ",  //删除购物车接口
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
					}else{    //请求删除购物车接口成功  ，这样把所有选中的列表就是带有select类的li 删除自杀remove()
						alert("请求删除购物车接口成功");
						$("li.select").remove();      //删除所有选中的列表
						$("#sure_Del").addClass("dsn");   //隐藏确定删除框
					}
				},
				error:function(res){
					alert(res);
				},
			});
		},//deleteShop end
		queryList:function(){
			//进行ajax请求加载后台数据，然后进行渲染页面
			var self=this;
			$.ajax({
				url:"http://192.168.6.133:3000/shopCarList",//购物车清单接口
				type:"post",
				data:{sessionId:localStorage.getItem("sessionId")},  //sesionId传输给后台
				
				dataType:"json",
				success:function(res){
					if(typeof res=="string"){
						res=JSON.parse(res);
					}
					if(res.resCode!="000"){
						alert(res.resMsg);
					}else{//请求数据成功  进行页面渲染  只需要渲染list   所以 只需要传res.list  就可以
						alert("请求数据成功");
						self.render(res.list);
						
					}
				},
				error:function(res){
					alert(res);
				},
				
			});
		},//queryList end
		render:function(obj){
			//思路：1:如果没有选中列表，就是购物车什么都没有，此时应该怎么样；如果有进行渲染页面
			var self=this;
			if(obj.length==0){  //表示购物车什么都没有  ,我们需要隐藏清单列表项   显示购物车空空的图标
				$("#shopping_list").addClass("dsn");
				$("#empty_cart").removeClass("dsn");
				return false;
			}else{             //表示购物车有商品 ，这样我们就渲染商品列表页面  用字符串拼接  ,然后放到父元素里面
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
				                                    //把渲染出来的列表放在父元素里面ul
				$("#shopping_list").html(str);
				
				                                  //这里需要实时算取价格 肯定得进行计算,所以封装一个计算函数
				
				self.calcTotalPrice();
			}
		},//render end
		calcTotalPrice:function(){
			//计算选中商品的价格  也就是有select这个类的
			//思路:1:首先选取有select这个类的商品 ,然后算取每一个列表的总价 然后把他们全部相加 成为总价格 
			//用JQ取 会把他们全部取出来,然后进行for循环 每一行算出总价格 用+= ;JQ变量命名前面加上$ ;记得不能用[],而是用eq().
			var $lis=$("li.select");
			var total=0;
			for(var i=0;i<$lis.length;i++){  //总价格=价格*数量
				total+=$lis.eq(i).find(".unit_price span").text()*$lis.eq(i).find(".number span").text();
				
			}
			$("#pay_account").text(total);
		},//calcTotalPrice end
		carEdit:function($this){    //JQ变量名  用$开头   形式参数
			var self=this;
			if($this.text()=="编辑"){   //如果最开始是编辑状态  点击之后....
				$this.text("完成");             //点击之后 编辑变为完成
				$(".number_content").removeClass("dsn");   //删除隐藏的类  显示出编辑加减框
				$(".number").addClass("dsn");     //原来的X2数量 增加隐藏类    隐藏原来的数量
				$("#delete_btn").removeClass("dsn");     //删除隐藏类   显示删除框
				$("#account_btn").addClass("dsn");       //增加隐藏类 ,隐藏结算框 
				$("#total_box").addClass("dsn");         //增加隐藏类 ,隐藏总价格框
				$(".select_all_txt").css("text-align","center")   //全选的文字框居中 ;注意 css()属性前民第一个参数打双引号可以用css样式写
				$("#shopping_list li").removeClass("select")   //在完成状态页面时,此时需要添加数量 ,删除所有li勾选类
				$("#select_all").removeClass("select");    //删除全选的勾选类  .从新开始
	
			}else{  //否则就是点击完成  ,这时需要向后台请求数据 是否请求数据添加成功  需要把商品li的id 和数量传到后台
				var list=[];           //先声明一个空数组 ,然后把每个产品的id 和数量 保存起来传给后台;每一个列表都有一个data-id属性
				for(var i=0;i<$("#shopping_list li").length;i++){
					var id=$("#shopping_list li").eq(i).data("id");   //这样就把所有的id都取出来 是一个数组
					var num=$("#shopping_list li").eq(i).find(".number_edit").text();   //先选出所有的li 然后找到里面的某个eq(i),
					                                                //  find()括号里面填属性 表示找到有这个属性的元素,然后找到他的数量值
					list.push({id:id,prdNum:num});      //   push() 方法可向数组的末尾添加一个或多个元素，并返回新的长度。此时list数组就是有一个对象
				}                                       //  千万不要把请求参数的前面字母写错 ,是prdNum  不是proNum
				
				//此时点击完成进行ajax请求是否添加成功   需要传sessionId   商品id  商品数量
				$.ajax({ 
					url:"http://192.168.6.133:3000/editCar",   // 点击编辑变为完成 点击完成,编辑接口
					type:"post",
					data:{
						sessionId:localStorage.getItem("sessionId"),
						list:list,
					},
					
					dataType:"json",
					success:function(res){
						if(typeof res=="string"){
							res=JSON.parse(res)
						}
						if(res.resCode!="000"){
							alert("请求完成数据失败"+res.resMsg);
						}else{   // 点击完成 此时需要变为编辑 并且需要向后台提交数据请求成功  最后进行计算 调用计算函数
							alert("点击完成数据请求成功");
							$this.text("编辑");             //点击之后 编辑变为完成
						$(".number_content").addClass("dsn");   //删除隐藏的类  显示出编辑加减框
						$(".number").removeClass("dsn");     //原来的X2数量 增加隐藏类    隐藏原来的数量
						$("#delete_btn").addClass("dsn");     //删除隐藏类   显示删除框
						$("#account_btn").removeClass("dsn");       //增加隐藏类 ,隐藏结算框 
						$("#total_box").removeClass("dsn");         //增加隐藏类 ,隐藏总价格框
						$(".select_all_txt").css("text-align","center")   //全选的文字框居中 ;注意 css()属性前民第一个参数打双引号可以用css样式写
						$("#shopping_list li").addClass("select")   //在完成状态页面时,此时需要添加数量 ,删除所有li勾选类
						$("#select_all").addClass("select");    //删除全选的勾选类  .从新开始
						
						//最后把完成后的值再放到编辑页面的数字框中  有多个li 所以有多个值  用for循环
						for(var i=0;i<$(".number span").length;i++){
							$(".number span").eq(i).text($(".number_edit").eq(i).text());
						}
						self.calcTotalPrice();
						}
					},
					error:function(res){    //注意  下面的注释是相反的.
						alert(res);
						
					},
				});
				
			}
		}, //carEdit end
		
		
	};//shoppingCar end
	shoppingCar.init();
})();
