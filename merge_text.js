function merge_text(item,index,message){
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
			var width=c.measureText(text).width;	
			
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
		if(text.trim()!=="")
			result_arr.push(text.trim());
		if(type==1){
			if(item.text_content==""){
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
	function make_text(text,item,c){
		var w=c.measureText(text).width;	
		var h=item.text_size*1.2;
		if(item.useFontBg && item.FontBgSize){
			h+=item.FontBgSize;
		}
		var c=init_canvas(w,h);	
		c.fillStyle=item.text_color;
		c.font=item.text_size+"px 微軟正黑體";
		c.textBaseline="middle";
		
		var y=item.text_size/2;	
		if(item.useFontBg && item.FontBgSize){
			y+=item.FontBgSize/2;
			c.lineWidth = item.FontBgSize;
			c.strokeStyle = item.FontBgColor;		
			c.strokeText(text,0,y);	
		}
		c.fillText(text,0,y);	
		if(item.useLine){
			if(item.useLine==1){
				var line_y=.9;
			}else{
				var line_y=.5;
			}
			c.strokeStyle = item.text_color;
			c.lineWidth = Math.floor(item.text_size/10);
			
			var x=w;
			var y=h*line_y-c.lineWidth/2
			c.moveTo(0,y);
			c.lineTo(x,y);
			c.stroke();
		}		
		return c.canvas;	
	}	
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
	
	var count=0;
	while(true){
		count++;
		var tmp_text_content=item.text_content;
		var break_flag=false;
		if(item.text_type==1){
			var result_arr=[tmp_text_content];
			var w=c.measureText(tmp_text_content).width;
			break_flag=break_flag || w >item.w;
		}else{
			var result_arr=get_ok_width_string(item,c);
		}
		if(item.useFontBg && item.FontBgSize){
			var text_size=item.text_size*1.2+item.FontBgSize;
		}else{
			var text_size=item.text_size*1.2;
		}
		var total_height=result_arr.length*text_size;
		break_flag=break_flag || total_height>item.h
		if(break_flag){
			c.font=--item.text_size+"px 微軟正黑體";
			item.text_content=tmp_text_content;
		}else{
			break;
		}
	}	
	
	var y=0;	
	if(item.text_vAlign==1){
		y=(item.h-total_height)/2;
	}else if(item.text_vAlign==2){
		y=(item.h-total_height);
	}
	for(var i in result_arr){
		var text=result_arr[i];
		var text_img=make_text(text,item,c);
		var x=0;
		if(item.text_hAlign==1){
			x=(item.w-text_img.width)/2;
		}else if(item.text_hAlign==2){
			x=(item.w-text_img.width);
		}
		// c.fillStyle=["#ff0000","#00ddff","#00ff00"][i];
		// c.fillRect(x,y,text_img.width,text_img.height);
		c.drawImage(text_img,x,y);
		y+=text_img.height;
	}
	message.push("圖層"+index+"文字合成判斷"+count+"次");
	return c.canvas;
}

