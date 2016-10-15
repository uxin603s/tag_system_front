<?php
class MergeText{
	public function init_canvas($w,$h){
		$image=new \Imagick();
		$image->setResourceLimit(6,1);//限制執行緒才不會出錯
		$image->newImage($w,$h,'none');
		$image->setImageFormat('png');
		return $image;
	}
	public static function area_scale_w_h(&$item){
		$len=count($item["text_content"]);
		$area=$len*$item['text_size']*$item['text_size'];//計算文字面積
		$h=sqrt($area/($item['w']/$item['h']));//取得高
		$w=$area/$h;
		if($h>$w){//確保寬比高大
			$tmp=$h;
			$h=$w;
			$w=$tmp;
		}
		$scale=$item['w']/$w;
		$item['text_size']=floor($item['text_size']*$scale);//計算需要縮放比例
	}
	// public function get_ok_width_string($item,$c,$result_arr=null,$break_time=null){
		// if(is_numeric(strpos($item['text_content'],"\n"))){
			// return explode("\n",$item['text_content']);
		// }
		
		// if(!$result_arr){
			// $result_arr=[];		
		// }
		
		// if(!$break_time){
			// $break_time=time();
		// }
		
		// if((time()-$break_time)>1){
			// throw "卡迴圈，強制中斷";
		// }
		// $type=0;
		// if(!is_numeric(strpos($item['text_content']," "))){
			// $tmp_line_limit_count=floor($item['w']/$item['text_size']*2);
			// $type=1;
		// }else{
			// if(gettype($item['text_content'])=="string"){
				// $item['text_content']=explode(" ",$item['text_content']);
			// }
			// $type=2;
			// $tmp_arr=[];
		// }
		
		// $start_time=time();
		// while(true){
			// if($type==1){
				// $text=mb_substr($item["text_content"],0,$tmp_line_limit_count);
			// }else{
				// $text=explode(" ",$item['text_content']);
			// }
			// $width=$c.measureText(text).width;	
			
			// if($type==1){
				// if($width>$item['w']){
					// $tmp_line_limit_count--;
				// }else{
					// $item["text_content"]=mb_substr($item["text_content"],mb_strlen($text),mb_strlen($item['text_content'])-mb_strlen($text));
					// break;
				// }
			// }else{
				// if($width>$item['w'] && count($item['text_content'])!==1){
					// array_unshift($tmp_arr,array_pop($item["text_content"]));
				// }else{
					// $item['text_content']=$tmp_arr;
					// $tmp_arr=[];
					// break;
				// }
			// }
			// if(((time()-$start_time))>1){
				// throw "卡迴圈，強制中斷";
			// }
		// }
		
		// if(trim($text)!=="")
			// array_push($result_arr,trim($text));
		
		// if($type==1){
			// if($item["text_content"]==""){
				// return $result_arr;
			// }
		// }else{
			// $item['text_content']=implode(" ",$item['text_content']);
		// }
		
		
		// return self::get_ok_width_string($item,$c,$result_arr,$break_time);
	// }
	public static function make_text($text,$item,$c,$draw,$draw1){
		
		$info=$c->queryFontMetrics($draw,$text);
		
		$w=$info['textWidth'];
		
		// var_dump($c->getImageWidth());
		// var_dump($text);
		// var_dump($item['text_size']);
		// var_dump($info);
		
		$h=$item['text_size']*1.2;
		if($item['useFontBg'] && $item['FontBgSize']){
			$h+=$item['FontBgSize'];
		}
		
		$c=self::init_canvas($w,$h);
		$draw->annotation(0,$h/2,$text);
		$c->drawImage($draw1);
		$c->drawImage($draw);
		
		
		// if($item['useLine']){
			// if($item['useLine']==1){
				// $line_y=0.9;
			// }else{
				// $line_y=0.5;
			// }
			// c.strokeStyle = $item['text_color'];
			// c.lineWidth = floor($item['text_size']/10);
			
			// $x=$w;
			// $y=$h*$line_y-c.lineWidth/2
			// c.moveTo(0,$y);
			// c.lineTo($x,$y);
			// c.stroke();
		// }		
		return $c;	
	}	
	public static function init($item){
		$item['text_content']=trim($item['text_content']);
		if($item['text_size']>$item['h']){
			$item['text_size']=$item['h'];
		}
		self::area_scale_w_h($item);
		$c=self::init_canvas($item['w'],$item['h']);
		
		$draw=new \ImagickDraw();		
		$draw->setFont($item["font_family"]);
		$draw->setFontSize($item["text_size"]);
		$draw->setFillColor($item["text_color"]);
		$draw->setStrokeAntialias(true);//消除鋸齒
		$draw->setTextAntialias(true);//消除鋸齒// $c.textBaseline="middle";
		
		if($item['useFontBg'] && $item['FontBgSize']){
			$draw1=new \ImagickDraw();	
			$draw1->setStrokeWidth($item['FontBgSize']);//描邊
			$draw1->setStrokeColor($item['FontBgColor']);
			$draw1->setFillColor($item["FontBgColor"]);
			$draw1->setStrokeAntialias(true);//消除鋸齒
			$draw1->setTextAntialias(true);//消除鋸齒
		}
		
		if($item['text_type']==2){
			$tmp=$item['text_content'];
			$count=mb_strlen($tmp);
			$item['text_content']=mb_substr($tmp,0,1);
			for($i=1;$i<$count;$i++){
				$item['text_content'].="\n".mb_substr($tmp,$i,1);
			}
		}
		
		$count=0;
		while(true){
			$count++;
			
			$tmp_text_content=$item['text_content'];
			
			$break_flag=false;
			if($item['text_type']==1 || !preg_match("/[^a-zA-Z0-9\.]+/",$item['text_content'])){
				$result_arr=[$tmp_text_content];
				$info=$c->queryFontMetrics($draw,$tmp_text_content);
				$w=$info['textWidth'];
				// var_dump($info['textWidth']);
				// var_dump($info['textHeight']);
				// exit;
				// $w=$c.measureText(tmp_text_content).width;
			}else{
				$result_arr=self::get_ok_width_string($item,$c);
				
				$w=array_reduce(array_map(function($value){
					return $c.measureText($value).width;
				},$result_arr),function($prev,$curr){
					if($prev>$curr){
						return $prev;
					}
					return $curr;
				},0);
				 
			}
			
			$break_flag=$break_flag || $w >$item['w'];
			if($item['useFontBg'] && $item['FontBgSize']){
				$text_size=$item['text_size']*1.2+$item['FontBgSize'];
			}else{
				$text_size=$item['text_size']*1.2;
			}
			$total_height=count($result_arr)*$text_size;
			$break_flag=$break_flag || $total_height>$item['h'];
			if($break_flag){
				$draw->setFontSize(--$item["text_size"]);
				$item['text_content']=$tmp_text_content;
			}else{
				break;
			}
		}	
		
		$y=0;	
		if($item['text_vAlign']==1){
			$y=($item['h']-$total_height)/2;
		}else if($item['text_vAlign']==2){
			$y=($item['h']-$total_height);
		}
		foreach($result_arr as  $val){
			$text=preg_replace("/###space###/"," ",$val);
			$text_img=self::make_text($text,$item,$c,$draw,$draw1);
			$x=0;
			if($item['text_hAlign']==1){
				$x=($item['w']-$text_img->getImageWidth())/2;
			}else if($item['text_hAlign']==2){
				$x=($item['w']-$text_img->getImageWidth());
			}
			return $text_img;
			$c->compositeImage($text_img,\imagick::COMPOSITE_OVER,$x,$y);
			// $c.drawImage($text_img,$x,$y);// c.fillStyle=["#ff0000","#00ddff","#00ff00"][i];// c.fillRect(x,y,text_img.width,text_img.height);
			$y+=$text_img->getImageHeight();
		}
		return $c;//.canvas;//$message[]="圖層{$index}文字合成判斷{$count}次";
	}	
}
echo "<pre>";
$item=json_decode('{"zIndex":1,"x":0,"y":0,"w":500,"h":300,"type":1,"text_hAlign":2,"text_vAlign":1,"text_size":500,"text_color":"#FF0000","text_content":"dfgdfggdfg dfgdfgds fgdgfdg123.","text_type":0,"useFontBg":1,"FontBgSize":10,"FontBgColor":"#00FF00","useLine":2,"useBg":1,"bgPadding":20,"bgColor":"#0000FF","bgBorderRadius":0,"rotate":0}',1);
$item['text_content']="test123";
$item['font_family']="msjh.ttf";
var_dump($item);
$image_src=MergeText::init($item);
echo "<img src='data:image/png;base64,".base64_encode($image_src)."' />";