var postMessageHelper={
	connect:{},
	sendTimer:{},
	cacheSendData:[],
	init:function(connect,post_window){
		var self=this;
		self.connect[connect] || (self.connect[connect]={});
		self.connect[connect].post_window=post_window
		self.connect[connect].status=0;
	},
	send:function(connect,sendData){
		var self=this;
		if(self.connect[connect] && self.connect[connect].status && self.connect[connect].post_window){
			var timer=setInterval(function(){
				if(!self.cacheSendData[0]){
					clearTimeout(timer);
					var send={
						sendData:sendData,
						connect:connect,
						status:self.connect[connect].status,
					}
					self.connect[connect].post_window.postMessage(send,"*");
				}
			},0)
		}else{
			if(sendData)
				self.cacheSendData.push(sendData);
			
			var send={
				connect:connect,
				status:0,
			}
			var timer=setInterval(function(){
				if(self.connect[connect].post_window)
				self.connect[connect].post_window.postMessage(send,"*");
			},0)
			window.addEventListener("message",function(e){
				if(e.data.connect!=connect)return;
				if(e.data.status!=2)return;
				while(self.cacheSendData[0]){
					var send={
						sendData:self.cacheSendData.shift(),
						connect:connect,
						status:self.connect[connect].status,
					}
					self.connect[connect].post_window.postMessage(send,"*");
				}
				self.connect[connect].status=1;
			},false);
		}
		
	},
	receive:function(connect,callback){
		var self=this;
		self.connect[connect] || (self.connect[connect]={});
		window.addEventListener("message",function(e){
			if(e.data.connect!=connect)return;
			if(e.data.status==0){
				var send={
					status:2,
					connect:connect,
				}
				e.source.postMessage(send,"*");
				self.connect[connect].post_window=e.source;
				self.connect[connect].status=1;
			}else if(e.data.status==1){
				callback && callback(e.data.sendData);
			}
		},false);
	},
}

