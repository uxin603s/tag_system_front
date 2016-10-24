<?php
class MergeText{
	public static function init_canvas($w,$h){
		$image=new \Imagick();
		$image->setResourceLimit(6,1);//限制執行緒才不會出錯
		$image->newImage($w,$h,'none');
		$image->setImageFormat('png');
		return $image;
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
	public function area_scale_w_h(&$item){		
		$len=mb_strlen($item['text_content']);
		$text_size=$item['text_size'];
		if($item['useFontBg'] && $item['FontBgSize']){
			$text_size+=$item['FontBgSize']*2;
		}
		$area=$len*$text_size*$text_size*1.2*1.2;//計算文字面積
		$scale=sqrt($item['w']*$item['h']/$area);		
		$item['text_size']=floor($item['text_size']*$scale);//計算需要縮放比例
	}
	
	public function get_ok_width_string($item,$c,$limit_w=0,$user_arr,$count_re){
		$user_arr['index']=0;
		$result_arr=[];	
		if(is_numeric(mb_strpos($item['text_content'],"\n"))){
			$tmp=explode("\n",$item['text_content']);
			foreach($tmp as $text){
				$info=self::measureText($c,$item,$text);
				$w=$info['textWidth'];
				$result_arr[]=compact(['text','w']);
			}
			
			return $result_arr;
		}
		
		if(!$count_re){
			$count_re=0;
		}
		
		$tmp_text_content=$item['text_content'];
		// var_dump($tmp_text_content);
		$type=0;
		if(!is_numeric(mb_strpos($user_arr['source']," "))){
			if(!$limit_w){
				$limit_w=0;
				if(count($user_arr['list'])){
					foreach($user_arr['list'] as $val){
						$text=$val['text'];
						$info=self::measureText($c,$item,$text);
						$tmp_w=$info['textWidth'];
						if($tmp_w>$limit_w)$limit_w=$tmp_w;
					}
				}else{
					$limit_w=$item['w'];
				}
			}
			$get_count=floor($limit_w/$item['text_size']*1.5);
			$type=1;
			$tmp_line_limit_count=$get_count;
		}else{
			
			$tmp_text_content=explode(" ",str_replace("###user_name###","",$user_arr['source']));
			$type=2;
			$tmp_arr=[];
			$tmp_width_arr=[];
			$info=self::measureText($c,$item," ");
			$space_width=$info['textWidth'];
			$tmp_text_content_width=[];
			if(!$limit_w){			
				$limit_w=0;
			}
			
			foreach($tmp_text_content as $text){
				$text=str_replace("###space###"," ",$text);
				$info=self::measureText($c,$item,$text);
				$tmp_w=$info['textWidth'];
				$tmp_text_content_width[]=$tmp_w;
				if($tmp_w>$limit_w){
					$limit_w=$tmp_w;
				}
			}
			
		}
		
		$while_count=0;
		while(true){
			if($type==1){
				$text=mb_substr($tmp_text_content,0,$tmp_line_limit_count);
				$user_arr['index']+=mb_strlen($text);
				foreach($user_arr['list'] as $val){
					$start=$val['start'];
					$end=$val['end'];
					if($start <=$user_arr['index'] && $user_arr['index'] <$end){
						$user_arr['index']-=mb_strlen($text);
						$count=$start-$user_arr['index'];
						if($count==0)$count=$end-$start;
						$text=mb_substr($tmp_text_content,0,$count);
						$user_arr['index']+=mb_strlen($text);
					}
				}
				
			}
			else{
				$do_while=0;
				$index=count($tmp_text_content_width);
				do{
					$tmp=array_slice($tmp_text_content_width,0,$index);
					$width=array_reduce($tmp,function($prev,$curr)use($space_width){
						$width_tmp=0;
						if($prev!=0)$width_tmp+=$space_width;
						$width_tmp+=$prev+$curr;
						return $width_tmp;
					},0);
					
					if($width>$limit_w){
						$index--;
					}else{
						break;
					}
					if(++$do_while>500){
						var_dump("卡迴圈",$width,$limit_w,$index);
						exit;
					}
				}while(true);
				$text=array_splice($tmp_text_content,0,$index);
				$text=implode(" ",$text);
				$text=str_replace("###space###"," ",$text);
				
				$info=self::measureText($c,$item,$text);
				$width=$info['textWidth'];
				array_splice($tmp_text_content_width,0,$index);			
				
			}
				
			
			if($type==1){
				$info=self::measureText($c,$item,$text);
				$width=$info['textWidth'];
				if($width>$limit_w){
					$user_arr['index']-=mb_strlen($text);
					$tmp_line_limit_count--;
				}else{
					$while_count=0;
					$start=mb_strlen($text);
					$count=mb_strlen($tmp_text_content)-mb_strlen($text);
					$tmp_text_content=mb_substr($tmp_text_content,$start,$count);
					if($text){
						$result_arr[]=[
							'text'=>$text,
							'w'=>$width,
						];
					}
					$tmp_line_limit_count=$get_count;
					if(!mb_strlen($tmp_text_content)){
						if(!count($user_arr['list'])){
							$count=count($result_arr);
							if($count!=1){
								$w1=$result_arr[$count-2]['w']/2;	
								$w2=$result_arr[$count-1]['w'];	
								if($w1 > $w2){
									$result_arr=[];
									$limit_w*=1.1;
									$get_count=floor($limit_w/$item['text_size']*1.5);
									$tmp_text_content=$item['text_content'];
									continue;
								}
							}
						}
						break;
					}
				}
			}
			else{
				
				if($text){
					$result_arr[]=[
						'text'=>$text,
						'w'=>$width,
					];
				}
				
				
				if(!count($tmp_text_content)){
					break;
				}
				
			}
			
			if(++$while_count>50){
				var_dump($user_arr['source'],$result_arr,$while_count);
				var_dump("卡迴圈，強制中斷");
				exit;
			}
		}
		$max_h=$item['text_size']*1.2;
		if($item['useFontBg'] && $item['FontBgSize']){
			$max_h+=$item['FontBgSize'];
		}
		
		$max_w=0;
		$min_w=0;
		foreach($result_arr as $val){
			if(!$min_w){
				$min_w=$val['w'];
			}else{
				if($val['w']<$min_w){
					$min_w=$val['w'];
				}
			}
			if($val['w']>$max_w){
				$max_w=$val['w'];
			}
		}
		$new_w=$max_w;
		
		$new_h=$max_h*count($result_arr);
		$check_h=$new_w*$item['h']/$item['w'];
		
		// if(false)
		if(count($result_arr)!=1)
		if($check_h<$new_h){
			
			if($type==1){
				$limit_w*=1.1;
			}else{
				$limit_w*=1.1;
			}
			if($count_re>100){
				var_dump("error",$user_arr['source'],$limit_w,$item['text_size'],$check_h,$new_h);
				var_dump("卡迴圈");
			}
	
			return self::get_ok_width_string($item,$c,$limit_w,$user_arr,++$count_re);
		}
	
		
		return $result_arr;
		
	}
	
	public function make_text($text,$item,$w,$h){
		$c=self::init_canvas($w,$h);
		$x=0;
		$y=0;
		
		if($item['useFontBg'] && $item['FontBgSize']){
			$x+=$item['FontBgSize'];
			
			$draw1=new \ImagickDraw();	
			$draw1->setFont($item["font_family"]);
			$draw1->setFontSize($item["text_size"]);
			$draw1->setStrokeWidth($item['FontBgSize']);//描邊
			$draw1->setStrokeColor($item['FontBgColor']);
			$draw1->setFillColor($item["FontBgColor"]);
			$draw1->setStrokeAntialias(true);//消除鋸齒
			$draw1->setTextAntialias(true);//消除鋸齒
			$draw1->setGravity(\Imagick::GRAVITY_WEST);
			$info=$c->queryFontMetrics($draw1,$text);
			
			
			$draw1->annotation($x,$y,$text);
			$c->drawImage($draw1);
			$draw1->destroy();
			
		}
		$draw=new \ImagickDraw();		
		$draw->setFont($item["font_family"]);
		$draw->setFontSize($item["text_size"]);
		$draw->setFillColor($item["text_color"]);
		$draw->setStrokeAntialias(true);//消除鋸齒
		$draw->setTextAntialias(true);//消除鋸齒
		
		$draw->setGravity(\Imagick::GRAVITY_WEST );
		$info=$c->queryFontMetrics($draw,$text);
		
		$draw->annotation($x,$y,$text);
		$c->drawImage($draw);
		$draw->destroy();
	
		if($item['useLine']){
			if($item['useLine']==1){
				$line_y=0.9;
			}else{
				$line_y=0.5;
			}
			$lineWidth=$item['text_size']/10;
			$draw->setStrokeColor($item['text_color']);
			$draw->setStrokeWidth($lineWidth);
			
			$y=$h*$line_y-$lineWidth/2;
			
			$draw->line(0,$y,$w,$y);
			$c->drawImage($draw);
			$draw->destroy();
		}
		
		return $c;	
	}	
	public static function init($item){
		$start_time=microtime(1);
		// return $item;
		if(empty($item['font_family'])){
			$item['font_family']="msjh.ttf";
		}
		$item['text_content']=trim($item['text_content']);
		if($item['text_size']>$item['h']){
			$item['text_size']=$item['h'];
		}
		
		$user_arr=[
			"source"=>$item['text_content'],
			'list'=>[],
			"index"=>0,
		];
		if($tmp=preg_match_all("/###user_name###[\w\W]+?###user_name###/",$item['text_content'],$match_arr)){
			$match_arr=$match_arr[0];
			
			foreach($match_arr as $match){
				$start=mb_strpos($item['text_content'],$match);
				$count=mb_strlen($match);
				
				$text_arr=[];
				for($i=0;$i<mb_strlen($item['text_content']);$i++){
					$text_arr[]=mb_substr($item['text_content'],$i,1);
				}
				$source=implode("",array_slice($text_arr,$start,$count));
				$text=str_replace("###user_name###","",$source);
				$text=str_replace("###space###"," ",$text);
				array_splice($text_arr,$start,$count,$text);
				
				$item['text_content']=implode("",$text_arr);
				$user_arr['list'][]=[
					'text'=>$text,
					'source'=>$source,
					'start'=>$start,
					'count'=>mb_strlen($text),
					'end'=>$start+mb_strlen($text),
				];
				
			}
			$user_arr['list']=array_reverse($user_arr['list']);
		}
		
		if($item['text_content']==""){
			$data="";
			return compact(['data','item',"y",]);
		}
		self::area_scale_w_h($item);
		
		$c=self::init_canvas($item['w'],$item['h']);
		
		
		if($item['text_size']<20){
			$item['text_size']=20;
		}
		
		
		if($item['text_type']==0 && !preg_match("/[^a-zA-Z0-9\.]+/",$item['text_content'])){
			$item['text_type']=1;
		}
		
		
		
		if($item['text_type']==0){
			$result_arr=self::get_ok_width_string($item,$c,$limit_w,$user_arr);
		}else if($item['text_type']==1){
			$item['text_content']=str_replace("###user_name###","",$item['text_content']);
			$item['text_content']=str_replace("###space###"," ",$item['text_content']);
			$text=$item['text_content'];
			$info=self::measureText($c,$item,$text);
			$width=ceil($info['textWidth']);
			
			$result_arr=[
				[
					"text"=>$text,
					"w"=>$width,
				],
			];
		}else if($item['text_type']==2){
			$item['text_content']=str_replace("###user_name###","",$item['text_content']);
			$item['text_content']=str_replace("###space###"," ",$item['text_content']);
			
			$result_arr=[];
			$count=mb_strlen($item['text_content']);
			for($i=0;$i<$count;$i++){
				$text=mb_substr($item['text_content'],$i,1);
				$info=self::measureText($c,$item,$text);
				$width=ceil($info['textWidth']);
				$result_arr[]=[
					"text"=>$text,
					"w"=>$width,
				];
			}
			
		}
		
		$max_h=$item['text_size']*1.2;	
		
		$max_w=0;
		foreach($result_arr as $val){
			if($val['w']>$max_w){
				$max_w=$val['w'];
			}
		}		
		
		
		
		$max_w=ceil($max_w);
		$max_h=ceil($max_h);
		
		
		if($item['useFontBg'] && $item['FontBgSize']){
			$max_w+=$item['FontBgSize'];
			$max_h+=$item['FontBgSize'];
		}
		$new_w=$max_w;
		$new_h=$max_h*count($result_arr);	
		$image_arr=[];
		if(!count($result_arr)){
			$data="data:image/png;base64,".base64_encode($c);
			return compact(['data','tt','item','result_arr','w','new_w','x']);
		}
		// var_dump($result_arr);
		foreach($result_arr as $data){
			$text=$data['text'];
			$w=$data['w'];
			if($item['useFontBg'] && $item['FontBgSize']){
				$w+=$item['FontBgSize'];
			}
			$w=ceil($w);
			
			$text_img=self::make_text($text,$item,$w,$max_h);
			// $data="data:image/png;base64,".base64_encode($text_img);
			// return compact(['data','tt','item','result_arr','w','new_w','x']);
			$image_arr[]=$text_img;
		}
	
		$new_c=self::init_canvas($new_w,$new_h);
		$x=0;
		$y=0;
		foreach($image_arr as $data){
			
			$w=$data->getImageWidth();
			$h=$data->getImageHeight();
			
			if($item['text_hAlign']==0){
				$x=0;
			}else if($item['text_hAlign']==1){
				$x=($new_w-$w)/2;
			}else if($item['text_hAlign']==2){
				$x=($new_w-$w);
			}	
			
			$new_c->compositeImage($data,\imagick::COMPOSITE_OVER,$x,$y);			
			
			$y+=$h;
		}
		$new_c->scaleImage($item['w'],$item['h'],1);
		
		
		
		$w=$new_c->getImageWidth();
		$h=$new_c->getImageHeight();
		$x=0;
		$y=0;
		if($item['text_hAlign']==0){
			$x=0;
		}else if($item['text_hAlign']==1){
			$x=($item['w']-$w)/2;
		}else if($item['text_hAlign']==2){
			$x=($item['w']-$w);
		}	
		if($item['text_vAlign']==0){
			$y=0;
		}else if($item['text_vAlign']==1){
			$y=($item['h']-$h)/2;
		}else if($item['text_vAlign']==2){
			$y=($item['h']-$h);
		}	
		$c->compositeImage($new_c,\imagick::COMPOSITE_OVER,$x,$y);
		
		$data="data:image/png;base64,".base64_encode($c);
		$new_c->destroy();
		$c->destroy();
		$time=microtime(1)-$start_time;
		return compact(['data','item',"y",'result_arr','time']);
	}
	
}
