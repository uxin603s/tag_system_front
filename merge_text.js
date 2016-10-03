/*
自動換行
保持一行
直一行
*/
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
	item.text_size=Math.floor(item.text_size*(item.w/w));//計算需要縮放比例
}
function get_ok_width_string(item,c,result_arr,break_time){
	if(!result_arr){
		var result_arr=[];		
	}
	if(!break_time){
		var break_time=Date.now();
	}
	var type=0;
	if(item.text_content.indexOf(" ")==-1){
		var line_limit_count=Math.floor(item.w/item.text_size*2);
		type=1;
		var tmp_line_limit_count=line_limit_count;
	}else{
		if(typeof(item.text_content)=="string"){
			item.text_content=item.text_content.split(" ");
		}
		type=2;
	}
	
	var tmp_arr=[];
	while(true){
		if(type==1){
			var text=item.text_content.substr(0,tmp_line_limit_count);
		}else{
			var text=item.text_content.join(" ");
		}
		var width=Math.floor(c.measureText(text).width);	
		if(type==1){
			if(width>item.w){
				tmp_line_limit_count--;
			}else{
				item.text_content=item.text_content.substr(text.length,item.text_content.length-text.length);
				break;
			}
		}else{
			if(width>item.w){
				tmp_arr.unshift(item.text_content.pop());			
			}else{
				item.text_content=tmp_arr;
				tmp_arr=[];
				break;
			}
		}
	}
	
	if(text.indexOf("\n")!=-1){
		var arr=text.split("\n");			
		var text=arr.shift()+"\n";		
		if(type==1){
			item.text_content=arr.join("\n")+item.text_content;
		}else{
			item.text_content.unshift(arr.join("\n"));
		}
	}
	
	result_arr.push(text.trim());
	
	
	if(type==1){
		if(item.text_content==""){
			// console.log("順利執行"+((Date.now()-break_time)/1000)+"s");
			return result_arr;
		}
	}else{
		item.text_content=item.text_content.join(" ")
	}
	if((Date.now()-break_time)>1000*2){
		console.log('卡迴圈，強制中斷');
		return result_arr;
	}
	
	return get_ok_width_string(item,c,result_arr,break_time);
}
function make_text(text,item,w,h,resize){		
	var c=init_canvas(w,h);	
	c.fillStyle=item.text_color;
	c.font=item.text_size+"px 微軟正黑體";
	c.textBaseline="middle";
	
	if(resize){
		var width=c.measureText(text).width;
		var scale=1;
		if(width>w){
			scale=w/width;
			item.text_size=item.text_size*scale;
			c.font=item.text_size+"px 微軟正黑體";
		}
		var height=item.text_size;//*1.2;
		if(height>h){
			scale=h/height;
			item.text_size=item.text_size*scale;
			c.font=item.text_size+"px 微軟正黑體";
		}
	}
	
	var width=c.measureText(text).width;
	var height=item.text_size;
	
	var x=0;	
	var y=item.text_size/2;
	c.fillText(text,x,y);			
	return c.canvas;	
}
function merge_text(item){	
	area_scale_w_h(item);
	var c=init_canvas(item.w,item.h);
	c.fillStyle=item.text_color;
	c.font=item.text_size+"px 微軟正黑體";
	c.textBaseline="middle";
	// c.fillStyle="#aaaaaa";
	// c.fillRect(0,0,item.w,item.h);
	
	while(true){
		var tmp_text_content=item.text_content;
		var result_arr=get_ok_width_string(item,c);
		if(result_arr.length*item.text_size*1.2>item.h){
			c.font=--item.text_size+"px 微軟正黑體";
			item.text_content=tmp_text_content;
		}else{
			break;
		}
	}	
	var y=0;	
	for(var i in result_arr){
		var text=result_arr[i];
		var w=c.measureText(text).width;
		var text_img=make_text(text,item,w,item.text_size*1.2);
		var x=0;	
		if(item.text_hAlign==1){
			x=(item.w-text_img.width)/2;
		}else if(item.text_hAlign==2){
			x=(item.w-text_img.width);
		}
		
		c.drawImage(text_img,x,y);
		y+=text_img.height;
	}
	return c.canvas;
}
CanvasRenderingContext2D.prototype.set_font_size=function(size,family){
	console.log(size,family)
	this.font=size+"px "+family;
}