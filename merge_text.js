function merge_text(item){
	function area_scale_w_h(item){
		var len=item.text_content.length;	
		var area=len*item.text_size*item.text_size;//計算文字面積
		var h=Math.sqrt(area/(item.w/item.h));//取得高
		var w=area/h;
		if(h>w){//確保寬比高大
			var tmp=h;
			h=w;
			w=tmp;
		}
		var scale=item.w/w;
		item.text_size=Math.floor(item.text_size*scale);//計算需要縮放比例
	}
	function get_ok_width_string(item,c,result_arr,break_time){
		if(item.text_content.indexOf("\n")!=-1){
			return item.text_content.split("\n");
		}
		
		if(!result_arr){
			var result_arr=[];		
		}
		
		if(!break_time){
			var break_time=Date.now();
		}
		
		if(((Date.now()-break_time)/1000)>1){
			throw "卡迴圈，強制中斷";
		}
		var type=0;
		
		if(item.text_content.indexOf(" ")==-1){
			var tmp_line_limit_count=Math.floor(item.w/item.text_size*2);
			type=1;
		}else{
			if(typeof(item.text_content)=="string"){
				item.text_content=item.text_content.split(" ");
			}
			type=2;
			var tmp_arr=[];
		}
		
		var start_time=Date.now();
		while(true){
			if(type==1){
				var text=item.text_content.substr(0,tmp_line_limit_count);
			}else{
				var text=item.text_content.join(" ");
				
			}
			var width=c.measureText(text).width;	
			
			if(type==1){
				if(width>item.w){
					tmp_line_limit_count--;
				}else{
					item.text_content=item.text_content.substr(text.length,item.text_content.length-text.length);
					break;
				}
			}else{
				if(width>item.w && item.text_content.length!==1){
					tmp_arr.unshift(item.text_content.pop());
				}else{
					item.text_content=tmp_arr;
					tmp_arr=[];
					break;
				}
			}
			if(((Date.now()-start_time)/1000)>1){
				throw "卡迴圈，強制中斷";
			}
		}
		// console.log(item.text_content)
		// console.log(text)
		if(text.trim()!=="")
			result_arr.push(text.trim());
		
		if(type==1){
			if(item.text_content==""){
				return result_arr;
			}
		}else{
			item.text_content=item.text_content.join(" ");
		}
		
		
		return get_ok_width_string(item,c,result_arr,break_time);
	}
	
	
	function make_text(text,item,c,w,h){
		
		var c=init_canvas(w,h);	
		c.fillStyle=item.text_color;
		c.font=item.text_size+"px 微軟正黑體";
		c.textBaseline="middle";
		if(item.useFontBg && item.FontBgSize){
			c.lineWidth = item.FontBgSize;
			c.strokeStyle = item.FontBgColor;		
		}
		var x=0;
		var y=item.text_size/2;
		
		var text_w=c.measureText(text).width;
		if(item.text_hAlign==0){
			x=0;
		}else if(item.text_hAlign==1){
			x=(w-text_w)/2;
		}else if(item.text_hAlign==2){
			x=(w-text_w);
		}
		
		
		if(item.useFontBg && item.FontBgSize){
			if(item.text_hAlign==0){
				x+=item.FontBgSize
			}else if(item.text_hAlign==1){
				x+=item.FontBgSize/2;
			}else if(item.text_hAlign==2){
				x-=item.FontBgSize;
			}
			y+=item.FontBgSize/2;
		}
		var line_x=x;
		var line_w=x+text_w;
		
		if(item.useFontBg && item.FontBgSize){
			line_x-=item.FontBgSize/2;
			line_w+=item.FontBgSize/2;
			c.strokeText(text,x,y);	
		}
		c.fillText(text,x,y);	
		if(item.useLine){
			if(item.useLine==1){
				var line_y=.9;
			}else{
				var line_y=.5;
			}
			c.strokeStyle = item.text_color;
			c.lineWidth = Math.floor(item.text_size/10);
			
			var y=h*line_y-c.lineWidth/2
			c.moveTo(line_x,y);
			c.lineTo(line_w,y);
			c.stroke();
		}		
		return c.canvas;	
	}	
	function break_line(item,c){
		 
		
		if(item.text_type==1 || !item.text_content.match(/[^a-zA-Z0-9\.]+/)){
			var result_arr=[item.text_content];
			var max_w=c.measureText(item.text_content).width;
		}else{
			var result_arr=get_ok_width_string(item,c);
			var w=c.measureText(result_arr[result_arr.length-2]).width;
			var w1=c.measureText(result_arr[result_arr.length-1]).width;
			if(w/2 > w1){
				return false;
			}
			
			var max_w=0;
			for(var i in result_arr){
				var w=c.measureText(result_arr[i]).width;
				if(w>max_w){
					max_w=w;
				}
			}
		}
		var max_h=item.text_size*1.2;
		if(item.useFontBg && item.FontBgSize){
			max_w+=item.FontBgSize*2;
			max_h+=item.FontBgSize*2;
		}
		
		var total_height=result_arr.length*max_h;
		// console.log(result_arr,item.w,max_w,item.h,total_height)
		if(max_w<=item.w && total_height<=item.h){
			return {
				result_arr:result_arr,
				max_w:max_w,
				max_h:max_h,
				total_height:total_height,
			}
		}
		return false;
	}	
	item.text_content=item.text_content.trim();
	if(item.text_size>item.h){
		item.text_size=item.h;
	}
	area_scale_w_h(item);
	
	var c=init_canvas(item.w,item.h);
	c.fillStyle=item.text_color;
	c.font=item.text_size+"px 微軟正黑體";
	c.textBaseline="middle";
	
	if(item.useFontBg && item.FontBgSize){
		c.lineWidth = item.FontBgSize;
		c.strokeStyle = item.FontBgColor;
		c.strokeText(text,x,y);	
	}
	if(item.text_type==2){
		item.text_content=item.text_content.split("").join("\n")
	}
	var fast={
		flag:false,
		max:item.text_size,
		min:0,
	};
	
	var fast_func=function(statement,item,fast){
		if(statement){
			fast.min=item.text_size*1;
		}else{
			fast.max=item.text_size*1;
		}
		item.text_size=(fast.max+fast.min)/2;
		
		fast.flag=Math.floor(fast.min)!=Math.floor(fast.max);
	};
	var count=0;
	// var tt=[];
	while(true){
		if(count>10 && !fast.flag){
			fast.flag=true;
		}
		var text_content=item.text_content;
		var data=break_line(item,c);
		item.text_content=text_content;
		
		if(fast.flag){
			fast_func(data,item,fast);
			c.font=item.text_size+"px 微軟正黑體";
			console.log(JSON.stringify(fast))
		}else{
			if(data){
				break;
			}else{
				c.font=--item.text_size+"px 微軟正黑體";
			}
		}
		// console.log(data.result_arr)
		if(++count>50){
			console.log("ggwp");
			break;
		}
	}	
	
	var result_arr=data.result_arr;
	var max_w=data.max_w;
	var max_h=data.max_h;
	var total_height=data.total_height;
	
	var y=0;	
	if(item.text_vAlign==1){
		y=(item.h-total_height)/2;
	}else if(item.text_vAlign==2){
		y=(item.h-total_height);
	}
	var x=0;
	if(item.text_hAlign==1){
		x=(item.w-max_w)/2;
	}else if(item.text_hAlign==2){
		x=(item.w-max_w);
	}
	for(var i in result_arr){
		var text=result_arr[i].replace(/###space###/g," ");
		var text_img=make_text(text,item,c,max_w,max_h);
		// c.fillStyle=["#ffeeee","#ffddff","#aaff00"][i];
		// c.fillRect(x,y,text_img.width,text_img.height);
		c.drawImage(text_img,x,y);
		y+=text_img.height;
	}
	console.log("文字合成判斷"+count+"次");
	return c.canvas;
}