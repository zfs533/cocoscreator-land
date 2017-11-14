var Order = require('./order').route;
var SockeLogic = 
{
	//下线
	sendPlayerUnline:function(room,item)
	{
		console.log('玩家下线-------------');
		if(!item){return;}
		var data = {player:item.player,roomId:item.roomId,pos:item.pos};
		if(room.left && room.left.player.onLinee)
		{
			console.log(room.left.player.namee);
			room.left.socket.emit(Order.unLine,data);
		}
		if(room.top && room.top.player.onLinee)
		{
			console.log(room.top.player.namee);
			room.top.socket.emit(Order.unLine,data);
		}
		if(room.right && room.right.player.onLinee)
		{
			console.log(room.right.player.namee);
			room.right.socket.emit(Order.unLine,data);
		}
	},
	//离开房间,向房间中的其他人发消息
	sendPlayerLeaveRoom:function(room,item)
	{
		if(!item){return;}
		var data = {player:item.player,roomId:item.roomId,pos:item.pos};
		if(room.left)
		{
			room.left.socket.emit(Order.leaveRoom,data);
		}
		if(room.top)
		{
			room.top.socket.emit(Order.leaveRoom,data);
		}
		if(room.right)
		{
			room.right.socket.emit(Order.leaveRoom,data);
		}
	},
	//进入房间，房间信息
	sendRoomInfo:function(room)
	{
		var data = this.getRoomData(room);
		console.log(data);
		if(room.left)
		{
			room.left.socket.emit(Order.roomInfo,data);
		}
		if(room.top)
		{
			room.top.socket.emit(Order.roomInfo,data);
		}
		if(room.right)
		{
			room.right.socket.emit(Order.roomInfo,data);
		}
	},
	getRoomData:function(room)
	{
		var data = [null,null,null];
		if(room.left)
		{
			data[0] = room.left.player;
		}
		if(room.top)
		{
			data[1] = room.top.player;
		}
		if(room.right)
		{
			data[2] = room.right.player;
		}
		return data;
	},
	//准备
	updatePlayerState:function(room,data)//data = room.right.player;
	{
		
		if(room.left)
		{
			room.left.socket.emit(Order.ready,data);
		}
		if(room.top)
		{
			room.top.socket.emit(Order.ready,data);
		}
		if(room.right)
		{
			room.right.socket.emit(Order.ready,data);
		}
	},
	//发牌
	LaunchCard:function(room,data)
	{
		var zero = function()
		{
			var arr = [];
			for(var i = 0; i<17;i++)
			{
				arr.push(0);
			}
			return arr;
		}();
		//客户端只能看见自己的牌
		var lD = {card:[zero,zero,zero],pos:room.left.pos};
		lD.card[room.left.pos] = data[room.left.pos];
		room.left.player.cards = data[room.left.pos];
		room.left.socket.emit(Order.launchCard,lD);

		var lT = {card:[zero,zero,zero],pos:room.top.pos};
		lT.card[lT.pos] = data[lT.pos];
		room.top.player.cards = data[lT.pos];
		room.top.socket.emit(Order.launchCard,lT);

		var lR = {card:[zero,zero,zero],pos:room.right.pos};
		lR.card[lR.pos] = data[lR.pos];
		room.right.player.cards = data[lR.pos];
		room.right.socket.emit(Order.launchCard,lR);
		var timeout = setTimeout(function()
		{
			var first = Math.floor(Math.random()*3);
			room.left.socket.emit(Order.first,first);
			room.top.socket.emit(Order.first,first);
			room.right.socket.emit(Order.first,first);
			clearTimeout(timeout);
		}, 10);
	},
	//叫
	playerJiao:function(room,data)
	{
		room.left.socket.emit(Order.jiao,data);
		room.top.socket.emit(Order.jiao,data);
		room.right.socket.emit(Order.jiao,data);
	},
	//抢
	playerQiang:function(room,data)
	{
		room.left.socket.emit(Order.qiang,data);
		room.top.socket.emit(Order.qiang,data);
		room.right.socket.emit(Order.qiang,data);
	},
	//叫，抢结束
	jiaoFinish:function(room,dizhuCard)
	{
		// var data = [room.left.player,room.top.player,room.right.player,dizhuCard];
		var data = {dizhu:room.dizhu,card:dizhuCard};
		room.left.socket.emit(Order.jFinish,data);
		room.top.socket.emit(Order.jFinish,data);
		room.right.socket.emit(Order.jFinish,data);
		// if(room.dizhu == room.left.pos)
		// {
		// 	room.left.player.cards.concat(dizhuCard);
		// 	room.left.socket.emit(Order.dizhuCard,room.left.player.cards);
		// }
		// else if(room.dizhu == room.top.pos)
		// {
		// 	room.top.player.cards.concat(dizhuCard);
		// 	room.top.socket.emit(Order.dizhuCard,room.top.player.cards);
		// }
		// else if(room.dizhu == room.right.pos)
		// {
		// 	room.right.player.cards.concat(dizhuCard);
		// 	room.right.socket.emit(Order.dizhuCard,room.right.player.cards);
		// }
		//开始出牌
		var timeout = setTimeout(function()
		{
			this.startSendcard(room,room.dizhu);
			clearTimeout(timeout);
		}.bind(this), 1000);
	},
	startSendcard:function(room,pos)
	{
		var data = {pos:pos};
		room.left.socket.emit(Order.start,data);
		room.top.socket.emit(Order.start,data);
		room.right.socket.emit(Order.start,data);
		this.guangboError(room,'一轮结束');
	},
	//出牌 {roomId:1,pos:0,cards:[],nPos:0:lastCount:0}//lastCount剩余数量
	playerSendcard:function(room,data)
	{
		room.left.socket.emit(Order.sendcard,data);
		room.top.socket.emit(Order.sendcard,data);
		room.right.socket.emit(Order.sendcard,data);
	},
	gameOver:function(room)
	{
		var data = [
			room.top.player.cards,
			room.left.player.cards,
			room.right.player.cards
		];
		room.left.socket.emit(Order.gameover,data);
		room.top.socket.emit(Order.gameover,data);
		room.right.socket.emit(Order.gameover,data);
		this.guangboError(room,'游戏结束');	
	},

	guangboError:function(room,str)
	{
		var info = {info:str};
		room.left.socket.emit(Order.errorr,info);
		room.top.socket.emit(Order.errorr,info);
		room.right.socket.emit(Order.errorr,info);
	}
};

exports.route = SockeLogic;