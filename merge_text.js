
function merge_text(item){
	item=JSON.parse(JSON.stringify(item));
	function area_scale_w_h(item){		
		var len=item.text_content.length;	
		var text_size=item.text_size;
		if(item.useFontBg && item.FontBgSize){
			text_size+=item.FontBgSize*2;
		}
		var area=len*text_size*text_size*1.2*1.2;//計算文字面積
		var scale=Math.sqrt(item.w*item.h/area);		
		item.text_size=Math.floor(item.text_size*scale);//計算需要縮放比例
	}
	
	function get_ok_width_string(item,c,limit_w,count_re){
		var result_arr=[];	
		if(item.text_content.indexOf("\n")!=-1){
			item.text_content=item.text_content.replace(/###user_name###/g," ");
			var tmp=item.text_content.split("\n");
			for(var i in tmp){
				var text=tmp[i];
				var width=c.measureText(text).width;
				result_arr.push({text:text,w:width});
			}
			return result_arr;
		}
		if(!count_re){
			var count_re=0;
		}
		
		var type=0;
		if(item.text_content.indexOf(" ")==-1){
			
			if(!limit_w){
				var limit_w=item.w;
			}
			var get_count=Math.floor(limit_w/item.text_size*1.5);
			
			type=1;
			var tmp_line_limit_count=get_count;
			var tmp_text_content=item.text_content;
			
		}else{
			var tmp_text_content=item.text_content.split(" ");
			if(!limit_w){			
				var limit_w=0;
				for(var i in tmp_text_content){
					var tmp_w=c.measureText(tmp_text_content[i]).width;
					if(tmp_w>limit_w){
						limit_w=tmp_w;
					}
				}
			}
			type=2;
			var tmp_arr=[];
		}
		
		
		// console.log(user_name)
	
		var start_time=Date.now();
		var while_count=0
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
						result_arr.push({text:text,w:width});
					}
					var tmp_line_limit_count=get_count;
					if(!tmp_text_content.length){
						// var count=result_arr.length;
						// if(count!=1){
							// var w1=result_arr[count-2].w/2;	
							// var w2=result_arr[count-1].w;	
							
							// if(w1 > w2){
								// var result_arr=[];
								// limit_w++;
								
								// var tmp_text_content=item.text_content;
								// continue;
							// }
						// }
						
						break;
					}
				}
			}else{
				if(width>limit_w && tmp_text_content.length!==1){
					tmp_arr.unshift(tmp_text_content.pop());
				}else{
					if(text){
						result_arr.push({text:text,w:width});
					}
					tmp_text_content=tmp_arr;
					
					if(tmp_text_content.length){
						var tmp_arr=[];
					}else{
						break;
					}
					
				}
			}
			if(++while_count>1000000){
				
				console.log(while_count,result_arr)
				throw "卡迴圈，強制中斷";
			}
		}
		
		var max_h=item.text_size*1.2;
		if(item.useFontBg && item.FontBgSize){
			max_h+=item.FontBgSize;
		}
		
		var max_w=0;
		var min_w=0;
		for(var i in result_arr){
			if(!min_w){
				min_w=result_arr[i].w
			}else{
				if(result_arr[i].w<min_w){
					min_w=result_arr[i].w
				}
			}
			
			if(result_arr[i].w>max_w){
				max_w=result_arr[i].w
			}
		}
		var new_w=max_w;
		var new_h=max_h*result_arr.length;
		var check_h=h=new_w*item.h/item.w
		
		if(check_h<new_h && result_arr.length!=1){
			// var limit_w=max_w;
			
			if(type==1){
				limit_w*=1.1;
			}else{
				limit_w+=min_w/2;
			}
			// console.log(limit_w)
			if(count_re>100){
				console.log("error",limit_w,item.text_size,check_h,new_h)
				throw "卡迴圈";
			}
			console.log("again")
			return get_ok_width_string(item,c,limit_w,++count_re);
		}else{
			console.log("ok")
			return result_arr;
		}
	}
	
	function make_text(text,item,w,h){
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
		if(item.useFontBg && item.FontBgSize){
			x+=item.FontBgSize;
		}
		if(item.useFontBg && item.FontBgSize){
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
			c.moveTo(0,y);
			c.lineTo(w,y);
			c.stroke();
		}		
		return c.canvas;	
	}	
	
	item.text_content=item.text_content.toString().trim();
	if(item.text_size>item.h){
		item.text_size=item.h;
	}
	// var tmp=text_content.match(/###user_name###([\w\W]+?)###user_name###/g)
	// if(tmp){
		// for(var i in tmp){
			// var text=tmp[i].replace(/###user_name###/g,"")
			// .replace(/###space###/g," ");
			// while(text_content.indexOf(tmp[i])!=-1){
				// text_content=text_content.replace(tmp[i],text);
			// }
		// }
	// }
	var tmp=item.text_content.match(/###user_name###([\w\W]+?)###user_name###/g)
	var user_arr=[];
	if(tmp){
		for(var i in tmp){
			var start=item.text_content.indexOf(tmp[i]);
			var count=tmp[i].length;
			var text_arr=item.text_content.split("");
			var text=text_arr.slice(start,start+count).join("").replace(/###user_name###/g,"").replace(/###space###/g," ")
			text_arr.splice(start,count,text)// tmp_text_content=text_arr.join("");
			item.text_content=text_arr.join("");
			user_arr.push({
				start:start,
				count:text.length,
				index:0,
			})
		}
	}
	// for(var i in user_arr){
		// var start=user_arr[i].start;
		// var count=user_arr[i].count+start;
		// var qq=item.text_content.split("").slice(start,count).join("")
		// console.log(qq)		
	// }
	alert("偵測user_arr決定斷行")
	return
	area_scale_w_h(item);
	
	var c=init_canvas(item.w,item.h);
	c.fillStyle=item.text_color;
	c.font=item.text_size+"px 微軟正黑體";
	c.textBaseline="middle";
	
	if(item.useFontBg && item.FontBgSize){
		c.lineWidth = item.FontBgSize;
		c.strokeStyle = item.FontBgColor;
	}
	if(item.text_size<20){
		item.text_size=20;
		c.font=item.text_size+"px 微軟正黑體";
	}
	if(item.text_type==0 && !item.text_content.match(/[^a-zA-Z0-9\.]+/)){
		item.text_type=1;
	}
	
	
	if(item.text_type==0){
		var result_arr=get_ok_width_string(item,c);
	}else if(item.text_type==1){
		item.text_content=item.text_content.replace(/###user_name###/g," ");
		var text=item.text_content;
		var width=c.measureText(text).width;
		var result_arr=[
			{
				text:text,
				w:width,
			}
		];
	}else if(item.text_type==2){
		item.text_content=item.text_content.replace(/###user_name###/g," ");
		var text_arr=item.text_content.split("");
		var result_arr=[];
		for(var i in text_arr){
			var text=text_arr[i];
			var width=c.measureText(text).width;
			result_arr.push({
				text:text,
				w:width,
			})
		}
	}
		
	var max_h=item.text_size*1.2;
	if(item.useFontBg && item.FontBgSize){
		max_h+=item.FontBgSize;
	}
	
	var max_w=0;
	for(var i in result_arr){
		if(result_arr[i].w>max_w){
			max_w=result_arr[i].w
		}
	}
	var new_w=max_w;
	var new_h=max_h*result_arr.length;	
		
	var image_arr=[];
	for(var i in result_arr){
		var data=result_arr[i];
		var text=data.text;
		var w=data.w;
		if(item.useFontBg && item.FontBgSize){
			w+=item.FontBgSize*2;
		}
		var text_img=make_text(text,item,w,max_h);
		image_arr.push(text_img);
	}
	
	var new_c=init_canvas(new_w,new_h);
	var x=0;
	var y=0;
	for(var i in image_arr){
		var data=image_arr[i];
		var w=data.width;
		var h=data.height;
		if(item.text_hAlign==0){
			x=0;
		}else if(item.text_hAlign==1){
			x=(new_w-w)/2;
		}else if(item.text_hAlign==2){
			x=(new_w-w);
		}		
		new_c.drawImage(image_arr[i],x,y,w,h);
		y+=h;
	}
	// return new_c.canvas
	var scale=item.w/new_w;
	new_w*=scale;
	new_h*=scale;
	if(new_h>item.h){
		scale=item.h/new_h;
		new_w*=scale;
		new_h*=scale;
	}
	
	var x=0;
	var y=0;
	if(item.text_hAlign==0){
		x=0;
	}else if(item.text_hAlign==1){
		x=(item.w-new_w)/2;
	}else if(item.text_hAlign==2){
		x=(item.w-new_w);
	}	
	if(item.text_vAlign==0){
		y=0;
	}else if(item.text_vAlign==1){
		y=(item.h-new_h)/2;
	}else if(item.text_vAlign==2){
		y=(item.h-new_h);
	}	
	c.drawImage(new_c.canvas,x,y,new_w,new_h);
	return c.canvas
}