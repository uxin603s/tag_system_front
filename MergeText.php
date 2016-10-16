<?php
class MergeText{
	public static function init_canvas($w,$h){
		$image=new \Imagick();
		$image->setResourceLimit(6,1);//限制執行緒才不會出錯
		$image->newImage($w,$h,'none');
		$image->setImageFormat('png');
		return $image;
	}
	public static function area_scale_w_h(&$item){
		$len=mb_strlen($item["text_content"]);
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
	public static function get_ok_width_string(&$item,$c,$result_arr=null,$break_time=null){
		if(is_numeric(strpos($item['text_content'],"\n"))){
			return explode("\n",$item['text_content']);
		}
		
		if(!$result_arr){
			$result_arr=[];		
		}
		
		if(!$break_time){
			$break_time=time();
		}
		
		if((time()-$break_time)>1){
			var_dump("卡迴圈，強制中斷");
			exit;
		}
		
		$type=0;
		if(!is_numeric(strpos($item['text_content']," "))){
			$tmp_line_limit_count=floor($item['w']/$item['text_size']*2);
			$type=1;
		}else{
			if(gettype($item['text_content'])=="string"){
				$item['text_content']=explode(" ",$item['text_content']);
			}
			$type=2;
			$tmp_arr=[];
		}
		
		$start_time=time();
		while(true){
			if($type==1){
				$text=mb_substr($item["text_content"],0,$tmp_line_limit_count);
			}else{
				$text=implode(" ",$item['text_content']);
			}
			
			$info=self::measureText($c,$item,$text);
			$width=$info['textWidth'];
			
			if($type==1){
				if($width>$item['w']){
					$tmp_line_limit_count--;
				}else{
					$item["text_content"]=mb_substr($item["text_content"],mb_strlen($text),mb_strlen($item['text_content'])-mb_strlen($text));
					break;
				}
			}else{
				if($width>$item['w'] && count($item['text_content'])!==1){
					array_unshift($tmp_arr,array_pop($item["text_content"]));
				}else{
					$item['text_content']=$tmp_arr;
					$tmp_arr=[];
					break;
				}
			}
			
			if(((time()-$start_time))>1){
				
				var_dump("卡迴圈，強制中斷");
				exit;
			}
		}
		
		if(trim($text)!=="")
			array_push($result_arr,trim($text));
		
		if($type==1){
			if($item["text_content"]==""){
				return $result_arr;
			}
		}else{
			
			if(count($item['text_content'])==1){
				$result_arr[]=$item['text_content'][0];
				return $result_arr;
			}
			$item['text_content']=implode(" ",$item['text_content']);
			
		}
		
		
		return self::get_ok_width_string($item,$c,$result_arr,$break_time);
	}
	public static function make_text($text,$item,$w,$h){
		
		$c=self::init_canvas($w,$h);
		$info=self::measureText($c,$item,$text);
		$text_w=$info['textWidth'];
		$text_h=$info['textHeight'];
		if($item['text_hAlign']==0){
			$x=0;
		}else if($item['text_hAlign']==1){
			$x=($w-$text_w)/2;
		}else if($item['text_hAlign']==2){
			$x=($w-$text_w);
		}
		$y=0;
		
		
		$line_x=$x;
		$line_w=$x+$text_w;
		if($item['useFontBg'] && $item['FontBgSize']){
			$x+=$item['FontBgSize']/2;
			$line_x-=$item['FontBgSize']/2;
			$line_w+=$item['FontBgSize']/2;
			$draw1=new \ImagickDraw();	
			$draw1->setFont($item["font_family"]);
			$draw1->setFontSize($item["text_size"]);
			$draw1->setStrokeWidth($item['FontBgSize']);//描邊
			$draw1->setStrokeColor($item['FontBgColor']);
			$draw1->setFillColor($item["FontBgColor"]);
			$draw1->setStrokeAntialias(true);//消除鋸齒
			$draw1->setTextAntialias(true);//消除鋸齒
			
			$info=$c->queryFontMetrics($draw1,$text);
			$draw1->annotation($x,$y+$info['ascender'],$text);
			$c->drawImage($draw1);
			$draw1->destroy();
		}
		$draw=new \ImagickDraw();		
		$draw->setFont($item["font_family"]);
		$draw->setFontSize($item["text_size"]);
		$draw->setFillColor($item["text_color"]);
		$draw->setStrokeAntialias(true);//消除鋸齒
		$draw->setTextAntialias(true);//消除鋸齒
		
		$info=$c->queryFontMetrics($draw,$text);
		$draw->annotation($x,$y+$info['ascender'],$text);
		$c->drawImage($draw);
		$draw->destroy();
		
		
		if($item['useLine']){
			$draw=new \ImagickDraw();
			if($item['useLine']==1){
				$line_y=0.9;
			}else{
				$line_y=0.5;
			}
			
			$lineWidth=$item['text_size']/10;
			$draw->setStrokeColor($item['text_color']);
			$draw->setStrokeWidth($lineWidth);
			
			$y=$h*$line_y-$lineWidth/2;
			
			$draw->line($line_x,$y,$line_w,$y);
			$c->drawImage($draw);
			$draw->destroy();
			
		}		
		return $c;	
	}	
	public static function measureText($c,$item,$text){
		$draw=new \ImagickDraw();		
		$draw->setFont($item["font_family"]);
		$draw->setFontSize($item["text_size"]);
		$draw->setFillColor($item["text_color"]);
		
		if($item['useFontBg'] && $item['FontBgSize']){
			$draw->setStrokeWidth($item['FontBgSize']);//描邊
			$draw->setStrokeColor($item['FontBgColor']);
		}
		$info=$c->queryFontMetrics($draw,$text);
		$draw->destroy();
		return $info;
	}
	public static function break_line(&$item,$c){
		$max_w=0;
		$max_h=0;
		
		if($item['text_type']==1 || !preg_match("/[^a-zA-Z0-9\.]+/",$item['text_content'])){
			$result_arr=[$item['text_content']];
			$info=self::measureText($c,$item,$item['text_content']);
			$max_w=$info['textWidth'];
			$max_h=$info['textHeight'];
		}else{
			$result_arr=self::get_ok_width_string($item,$c);
			$info=self::measureText($c,$item,$result_arr[count($result_arr)-1]);
			$info1=self::measureText($c,$item,$result_arr[count($result_arr)-2]);
			
			if($info['textWidth']/2 > $info1['textWidth']){
				return false;
			}
			
			foreach($result_arr as $text){
				$info=self::measureText($c,$item,$text);
				if($info['textWidth']>$max_w){
					$max_w=$info['textWidth'];
				}
				if($info['textHeight']>$max_h){
					$max_h=$info['textHeight'];
				}
			}
		}
		
		$max_h*=1.2;
		$total_height=count($result_arr)*$max_h;
		if($total_height<=$item['h'] && $max_w<=$item['w']){
			return compact(['result_arr','max_w','max_h','total_height']);
		}
		return false;
	}
	public static function init($item){
		
		if(empty($item['font_family'])){
			$item['font_family']="msjh.ttf";
		}
		
		$item['text_content']=trim($item['text_content']);
		if($item['text_size']>$item['h']){
			$item['text_size']=$item['h'];
		}
		
		self::area_scale_w_h($item);
		
		$c=self::init_canvas($item['w'],$item['h']);
		if($item['text_type']==2){
			$tmp=$item['text_content'];
			$count=mb_strlen($tmp);
			$item['text_content']=mb_substr($tmp,0,1);
			for($i=1;$i<$count;$i++){
				$item['text_content'].="\n".mb_substr($tmp,$i,1);
			}
		}
		
		$fast=[
			"flag"=>true,
			"max"=>$item["text_size"],
			"min"=>0,
		];
		
		$fast_func=function($statement,&$item,&$fast){
			if($statement){
				$fast['min']=$item["text_size"];
			}else{
				$fast['max']=$item["text_size"];
			}
			$item["text_size"]=($fast['max']+$fast['min'])/2;
			$fast['flag']=floor($fast['min'])!=floor($fast['max']);
		};
		$count=0;
		$tt=[];
		while(true){
			
			$text_content=$item['text_content'];
			$data=self::break_line($item,$c);
			$item['text_content']=$text_content;
			
			if($fast['flag']){
				$fast_func($data,$item,$fast);
				$tt[]=$fast;
			}else{
				if($data){
					break;
				}else{
					--$item["text_size"];
				}
			}
			if(++$count>100){
				break;
			}
		}
		// return $fast;
		$result_arr=$data['result_arr'];
		$max_w=$data['max_w'];
		$max_h=$data['max_h'];
		$total_height=$data['total_height'];
		
		$y=0;	
		if($item['text_vAlign']==1){
			$y=($item['h']-$total_height)/2;
		}else if($item['text_vAlign']==2){
			$y=($item['h']-$total_height);
		}
		$x=0;
		if($item['text_hAlign']==1){
			$x=($item['w']-$max_w)/2;
		}else if($item['text_hAlign']==2){
			$x=($item['w']-$max_w);
		}
		foreach($result_arr as  $val){
			$text=preg_replace("/###space###/"," ",$val);
			$text_img=self::make_text($text,$item,$max_w,$max_h);
			// var_dump($y);
			
			$c->compositeImage($text_img,\imagick::COMPOSITE_OVER,$x,$y);
			$y+=$max_h;
		}
		$data="data:image/png;base64,".base64_encode($c);
		return compact(['data','count','tt']);
	}	
}