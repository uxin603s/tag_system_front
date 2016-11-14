var postMessageHelper={
	connect:{},
	masterTimer:{},
	slaveTimer:{},
	listen:{},
	master:function(pack,callback){
		var self=this;
		if(pack.token){
			var status=2;
		}else{
			pack.token=Date.now();
			var status=0;
		}
		
		var send={
			sendData:pack.sendData,
			connect:pack.connect,
			token:pack.token,
			status:status,
		}
		
		if(status==0){
			self.masterTimer[pack.connect]=setInterval(function(){
				pack.source.postMessage(send,"*");
			},500)
			// console.log(self.masterTimer[pack.connect])
		}else 
		if(status==2){
			pack.source.postMessage(send,"*");
		}
		
		window.addEventListener("message",function(e){
			// console.log(pack.connect,e.data)
			if(e.data.connect!=pack.connect)return;
			if(e.data.token!=pack.token)return;
			if(e.data.status==1){
				// console.log(self.masterTimer[pack.connect])
				clearTimeout(self.masterTimer[pack.connect]);
			}
			if(e.data.status==2){
				callback && callback(e.data.sendData)
			}
		},false)
	},
	slave:function(connect,sendData){
		var self=this;
		if(!self.listen[connect]){
			self.listen[connect]=1;
			
			window.addEventListener("message",function(e){
				if(e.data.status==0 && e.data.connect==connect){
					var send={
						status:1,
						connect:connect,
						token:e.data.token,
					}
					e.source.postMessage(send,"*");
					var pack={
						source:e.source,
						token:e.data.token,
						connect:connect,
					}
					self.connect[connect]=pack;
					self.slave(connect,sendData)
				}
			},false);
			
		}else if(self.connect[connect]){
			clearTimeout(self.slaveTimer[connect]);
			self.slaveTimer[connect]=setTimeout(function(){
				var pack=self.connect[connect];
				pack.sendData=sendData;
				self.master(pack)
			},50)
		}
		
	},
}

