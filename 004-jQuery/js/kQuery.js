//kQuery的基本结构是一个闭包
(function(window, undefined){
var 
	//kQuery的构造函数
	kQuery = function(selector){
		return new kQuery.fn.init(selector);
	};
//kQuery的原型对象
kQuery.fn = kQuery.prototype = {
	constructor:kQuery,
	//核心函数
	init:function(selector){
		selector = kQuery.trim(selector);
		//布尔值是假的情况返回空的jquery对象
		if(!selector){
			return this;
		}
		//如是函数的话返回有document的jquery对象,当页面所有的DOM节点加载完毕后执行传入的函数
		else if(kQuery.isFunction(selector)){
			document.addEventListener('DOMContentLoaded',function(){
				selector();
			});
			this[0] = document;
			this.length = 1;
		//处理字符串	
		}else if(kQuery.isString(selector)){
			//HTML代码处理
			if(kQuery.isHTML(selector)){
				var tmpDom = document.createElement('div');
				tmpDom.innerHTML = selector;
				// console.log(tmpDom.children);
				/*
				for(var i = 0;i<tmpDom.children.length;i++){
					this[i] =  tmpDom.children[i];
				}
				this.length = tmpDom.children.length;
				*/
				[].push.apply(this,tmpDom.children);
			//选择器处理	
			}else{
				var doms = document.querySelectorAll(selector);
				// console.log(doms);
				/*
				for(var i = 0;i<doms.length;i++){
					this[i] = doms[i];
				}
				this.length = doms.length;
				*/
				[].push.apply(this,doms);
			}	
		}
		else if(kQuery.isArray(selector)){
			//由于apply转伪数组有兼容问题(IE8以下不兼容),所以把所有传入的数组转换成真数组
			var tmpArr = [].slice.call(selector);
			
			//把转换后的真数组转换成伪数组
			[].push.apply(this,tmpArr);
		}else{
			this[0] = selector;
			this.length = 1;
		}
		return this;
	},
	selector: "",
	length: 0,
	jquery:'1.0.0',
	//以下方法在调用时是kquery对象调用,所以方法内部的this指向调用的kquery对象
	push: [].push,
	sort: [].sort,
	splice: [].splice,
	toArray:function(){
		return [].slice.call(this);
	},
	get:function(num){
		if(arguments.length == 1){
			//正数
			if(num>=0){
				return this[num];
			//负数	
			}else{
				// -1 4 = 3
				// -2 4 = 2
				return this[this.length + num]
			}
		}else{
			return this.toArray();
		}
	},
	eq:function(num){
		if(arguments.length == 1){
			return kQuery(this.get(num));
		}else{
			return new kQuery();
		}
	},
	first:function(){
		return this.eq(0);
	},
	last:function(){
		return this.eq(-1);
	},
	each:function(fn){
		return kQuery.each(this,fn);
	},
	map:function(fn){
		return kQuery(kQuery.map(this,fn));
	}	
}

kQuery.extend = kQuery.fn.extend  = function(obj){
	for(key in obj){
		this[key] = obj[key];
	}
}

//kQuery的静态方法
kQuery.extend({
	isFunction:function(str){
		return typeof str === 'function';
	},
	isString:function(str){
		return typeof str === 'string';
	},
	isHTML:function(str){
		return str.charAt(0) == '<' && str.charAt(str.length-1) == '>' && str.length >= 3;
	},
	isArray:function(str){
		return kQuery.isObject(str) && length in str 
	},
	isObject:function(str){
		return typeof str === 'object';
	},
	trim:function(str){
		if(kQuery.isString(str)){
			//用正则去掉字符串的前后空格
			return str.replace(/^\s+|\s+$/g,'');
		}else{
			return str;
		}	
	},
	each:function(arr,fn){
		if(kQuery.isArray(arr)){
			for(var i = 0;i<arr.length;i++){
				// console.log(i,arr[i]);
				var res = fn.call(arr[i],i,arr[i]);
				if(res == false){
					break;
				}else if(res == true){
					continue;
				}
			}
		}else{
			for(key in arr){
				// console.log(key,arr[key]);
				var res = fn.call(arr[key],key,arr[key]);
				if(res == false){
					break;
				}else if(res == true){
					continue;
				}				
			}
		}
		return arr;
	},
	map:function(arr,fn){
		var retArr = [];
		if(kQuery.isArray(arr)){
			for(var i = 0;i<arr.length;i++){
				var res = fn(arr[i],i);
				if(res){
					retArr.push(res);
				}
			}
		}else{
			for(key in arr){
				var res = fn(arr[key],key);
				if(res){
					retArr.push(res);
				}
			}
		}
		return retArr;
	},
	toWords:function(str){
		return str.match(/\b\w+\b/g);
	},
	addEvent:function(dom,eventName,fn){
		if(dom.addEventListener){
			dom.addEventListener(eventName,fn);
		}else{
			dom.attachEvent('on'+eventName,fn);
		}
	}

});
kQuery.fn.extend({
	html:function(content){
		if(content){
			this.each(function(){
				this.innerHTML=content;
			})
			return this
		}else{
			return this[0].innerHTML
		}
	},
	test:function(content){
		if(content){
			this.each(function(){
				this.innerText=content;
			})
			return this
		}else{
			var str='';	
			this.each(function(){
				str += this.innerText
			})
			return str;
		}
	},
	attr:function(arg1,arg2){
		if(kQuery.isObject()){
			
			this.each(function(){
				var dom=this;
				kQuery.each(arg1,function(attr,val){
					dom.setAttribute(attr,val);
				})
			})

		}else if(arguments.length==1){
			return this[0].getAttribute(arg1)

		}else if(arguments.length==2){
			this.each(function(){
				this.setAttribute(arg1,arg2)
			})
		}
		return this
	},
	remove:function(attr){
		if(attr){
			this.each(function(){
				this.removeAttribute(attr);
			})
		}
		return this
	},
	val:function(val){
		if(val){
			this.each(function(){
				this.value=val
			})
			return this
		}else{
			return this[0].value;
		}

	},
	css:function(arg1,arg2){
		if(kQuery.isString(arg1)){
			if(arguments.length==1){
				if(this[0].currentStyle(arg1)){
					return this[0].currentStyle[arg1];
				}else{
					return getComputedStyle(this[0],false)[arg1];
				}
			}else if(arguments.length==2){
				this.each(function(){
					this.style[arg1]=arg2
				})
			}
		}else(kQuery.isObject(arg1)){
			this.each(function(){
				for(key in arg1){
					this.style[key]=arg1[key];
				}
			})
		}
		return this;
	},
	hasClass:function(str){
		var res = false;
		if(str){
			//判断是否存在指定单词的正则
			var reg = eval('/\\b'+str+'\\b/');
			this.each(function(){
				//判断传入的参数是否存在在DOM节点的className上
				if(reg.test(this.className)){
					res = true;
					return false;
				}
			})
		}
		return res;
	},
	addClass:function(str){
		//把传入的参数转换为数组
		// console.log(str.split(" "));
		// var reg = /\b\w+\b/g;
		// console.log(str.match(reg));
		var names = kQuery.toWords(str);
		this.each(function(){
			//如果有参数对应的class不添加,如果没有就添加
			var $this = kQuery(this);//DOM节点转kquery对象
			for(var i = 0;i<names.length;i++){
				if(!$this.hasClass(names[i])){
					this.className =this.className + ' ' + names[i];
				}				
			}

		})
		return this;
	},
	removeClass:function(str){
		if(str){
			//把传入的参数转换为数组
			var names = kQuery.toWords(str);
			this.each(function(){
				//如果有就删除
				var $this = kQuery(this);
				for(var i = 0;i<names.length;i++){
					if($this.hasClass(names[i])){//DOM节点上有class
						//删除
						var reg = eval('/\\b'+names[i]+'\\b/');
						// console.log('把'+this.className+"上的"+names[i]+"删除掉");
						this.className = this.className.replace(reg,'');
					}
				}
			});			
		}else{
			this.each(function(){
				this.className = '';
			})
		}
		return this;
	},
	toggleClass:function(str){
		if(str){
			var names = kQuery.toWords(str);
			this.each(function(){
				var $this = kQuery(this);
				for(var i = 0;i<names.length;i++){
					if($this.hasClass(names[i])){
						//有对应的class删除
						$this.removeClass(names[i]);
					}else{
						//没有对应的class添加
						$this.addClass(names[i]);
					}
				}
			});
		}else{
			this.each(function(){
				this.className = '';
			});
		}
		return this;
	},
}
//操作DOM节点
kQuery.fn.extend({
	emply:function(){
		this.each(function(){
			this.innerHTML='';
			return this
		})
	},
	remove:function(selector){
		if(selector){
			var doms=document.querySelectorAll(selector);
			this.each(function(){
				for(var i=0;i<doms.length;i++){
					if(doms.[i]==this){
						var parentNode=doms[i].parentNode;
						parentNode.removeChild(this);
					}
				}
			})
		}else{
			var parentNode=this.parentNode;
			parentNode.removeChildNode(this);

		}
		return this
	},
	append:function(source){
		if(source){
			//kquery对象,DOM节点,HTML代码片段
			//source -> this
			var $source = kQuery(source);
			this.each(function(index,value){
				// this.appendChild($source);
				var parentNode = this;
				if(index == 0){//第一个DOM元素直接插入
					$source.each(function(){
						parentNode.appendChild(this);
					})
				}else{//第一个DOM元素复制一份再插入
					$source.each(function(){
						//复制一份
						var dom = this.cloneNode(true);
						parentNode.appendChild(dom);
						// parentNode.appendChild(this);
					})					
				}
			})
		}
		return this;
	},
	prepend:function(source){
		if(source){
			//kquery对象,DOM节点,HTML代码片段
			//source -> this
			var $source = kQuery(source);
			this.each(function(index,value){
				// this.appendChild($source);
				var parentNode = this;
				if(index == 0){//第一个DOM元素直接插入
					$source.each(function(){
						// parentNode.appendChild(this);
						//firstChild
						//firstElementChild
						parentNode.insertBefore(this,parentNode.firstChild);
					})
				}else{//第一个DOM元素复制一份再插入
					$source.each(function(){
						//复制一份
						var dom = this.cloneNode(true);
						// parentNode.appendChild(dom);
						parentNode.insertBefore(dom,parentNode.firstChild);
					})					
				}
			})
		}
		return this;
	},
	clone:function(dcopy){
		var res=[];
		var dom=this.cloneNode();
	}	

})
//事件
kQuery.fn.extend({
	on:function(eventName,fn){
		this.each(function(){
			// if(dom.addEventListener){
			// 	dom.addEventListener(eventName,fn);
			// }else{
			// 	dom.attachEvent("on"+eventName,fn);
			// }
			if(!backetEvent){
				backetEvent={};
			}else if(!backetEvent[eventName]){
				backetEvent[eventName]=[];
				this.backetEvent[eventName].push(fn);

			}else{
				this.backetEvent[eventName].push(fn)
			}
		})
	},
	off:function(eventName,fnName){
		if(arguments.length==0){
			this.each(function(){
				this.backetEvent={};
			})
		}else if(arguments.length==1){
			this.each(function(){
				if(this.backetEvent[eventName]){
					this.backetEvent[eventName]=[];
				}
			})
		}else if(arguments.length==2){
			this.each(function(){
				var dom=this;
				if(this.backetEvent && this.backetEvent[eventName]){
					kQuery.each(function(){

					})
				}
			})
		}
	}
})

kQuery.fn.init.prototype = kQuery.fn;


window.kQuery = window.$ = kQuery;

})(window);