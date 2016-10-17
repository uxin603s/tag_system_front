function merge_text(item){
	function area_scale_w_h(item){
		var len=item.text_content.length;	
		var area=len*item.text_size*item.text_size*1.1*1.1;//計算文字面積
		
		var scale=Math.sqrt(item.w*item.h/area);		
		
		item.text_size*=scale;//計算需要縮放比例
		
		// var area=len*item.text_size*item.text_size*1.1*1.1;
		// var h=Math.sqrt(area/(item.w/item.h))
		// var w=area/h;
		// console.log(w,h)
		// console.log(item.w/item.h)
		// console.log(area1,tt,item.text_size)
	}
	// var tmp=item.text_content.match(/###user_name###([\w\W]+?)###user_name###/)
	// if(tmp){
		// console.log(tmp)
		// var user_name_tmp=item.text_content.substr(tmp.index,tmp[0].length);
		// console.log(user_name_tmp)
		// item.text_content=item.text_content.substr(tmp[0].length,item.text_content.length-tmp[0].length);
		// console.log(item.text_content)
	// }
	// ###user_name###wang chi###user_name###
	function get_ok_width_string(item,c,break_time){
		
		if(item.text_content.indexOf("\n")!=-1){
			item.text_content=item.text_content.replace(/###user_name###/g," ");
			return item.text_content.split("\n");
		}
		
		
		
		var result_arr=[];	
		var type=0;
		
		if(item.text_content.indexOf(" ")==-1){
			var get_count=Math.floor(item.w/item.text_size*2);
			var limit_w=item.w+1;
			type=1;
			var tmp_line_limit_count=get_count;
			var tmp_text_content=item.text_content;
		}else{
			var tmp_text_content=item.text_content.split(" ");
			var limit_w=0;
			for(var i in tmp_text_content){
				var tmp_w=c.measureText(tmp_text_content[i]).width;
				if(tmp_w>limit_w){
					limit_w=tmp_w;
				}
			}
			type=2;
			var tmp_arr=[];
		}
		
		var start_time=Date.now();
		
		
		
		while(true){
			
			if(type==1){
				var text=tmp_text_content.substr(0,tmp_line_limit_count);
			}else{
				var text=tmp_text_content.join(" ");
			}
				
			var width=c.measureText(text).width;
			if(type==1){
				if(width>limit_w){
					tmp_line_limit_count--;
				}else{
					var start=text.length;
					var count=tmp_text_content.length-text.length;
					tmp_text_content=tmp_text_content.substr(start,count);
					if(text){
						result_arr.push(text);
					}
					if(!tmp_text_content.length){
						var count=result_arr.length;
						if(count!=1){
							var w1=c.measureText(result_arr[count-2]).width/2;	
							var w2=c.measureText(result_arr[count-1]).width;
							console.log(count,w1,w2)
							if(w1 > w2){
								var result_arr=[];
								limit_w*=1.1;
								var tmp_line_limit_count=get_count;
								var tmp_text_content=item.text_content;
								continue;
							}
						}
						return result_arr;
					}
				}
			}else{
				if(width>limit_w && tmp_text_content.length!==1){
					tmp_arr.unshift(tmp_text_content.pop());
				}else{
					if(text){
						result_arr.push(text);
					}
					tmp_text_content=tmp_arr;
					
					if(tmp_text_content.length){
						var tmp_arr=[];
					}else{
						return result_arr;
					}
					
				}
			}
			if(((Date.now()-start_time)/1000)>1){
				throw "卡迴圈，強制中斷";
			}
		}
		
		
		return result_arr;
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
		var y=(item.text_size)/2;
		
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
			}else if(item.text_hAlign==2){// 
				x-=item.FontBgSize/2;
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
	}
	if(item.text_type==2){
		item.text_content=item.text_content.split("").join("\n")
	}
	
	if(item.text_type==1 || !item.text_content.match(/[^a-zA-Z0-9\.]+/)){
		var result_arr=[item.text_content];
		var max_w=c.measureText(item.text_content).width;
	}else{
		var result_arr=get_ok_width_string(item,c);
		var max_w=0;
		for(var i in result_arr){
			var w=c.measureText(result_arr[i]).width;
			if(w>max_w){
				max_w=w;
			}
		}
	}
	console.log(result_arr)
	// console.log(max_w,result_arr.length*item.text_size)
	// console.log(item.w,item.h)
	
}