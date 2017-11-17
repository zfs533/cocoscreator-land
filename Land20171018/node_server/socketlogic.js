var Order = require('./order').route;
var Timer = require('./timerutil');
var Room = null;/*require('./room').room;*/
var GameLogic = require('./gamelogic').route;
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
	sendRoomInfo:function(room,parent)
	{
		Room = parent;
		var data = this.getRoomData(room);
		console.log("---------------------------sendRoomInfo");
		if(room.isHaveRobot)
		{
			room.socket.emit(Order.roomInfo,data);
		}
		else
		{
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
		

		var lT = {card:[zero,zero,zero],pos:room.top.pos};
		lT.card[lT.pos] = data[lT.pos];
		room.top.player.cards = data[lT.pos];
		

		var lR = {card:[zero,zero,zero],pos:room.right.pos};
		lR.card[lR.pos] = data[lR.pos];
		room.right.player.cards = data[lR.pos];


		var pPos = this.getPlayerPos(room);
		if(room.isHaveRobot)
		{
			if(pPos == room.left.pos)
			{
				room.left.socket.emit(Order.launchCard,lD);
			}
			else if(pPos == room.top.pos)
			{
				room.top.socket.emit(Order.launchCard,lT);
			}
			else if(pPos == room.right.pos)
			{
				room.right.socket.emit(Order.launchCard,lR);
			}
		}
		else
		{
			room.left.socket.emit(Order.launchCard,lD);
			room.top.socket.emit(Order.launchCard,lT);
			room.right.socket.emit(Order.launchCard,lR);
		}
		var self = this;
		var timeout = Timer.setTimeOut(function()
		{
			var first = Math.floor(Math.random()*3);
			if(room.isHaveRobot)
			{
				room.socket.emit(Order.first,first);
				if(first != pPos)
				{
					Timer.setTimeOut(function()
					{
						self.setRobotJiao(room,first,Order.jiao);
					},3);
				}
			}
			else
			{
				room.left.socket.emit(Order.first,first);
				room.top.socket.emit(Order.first,first);
				room.right.socket.emit(Order.first,first);
			}
			clearTimeout(timeout);
		}, 1);
	},
	//非robot
	getPlayerPos:function(room)
	{
		var pos = 0;
		if(!room.left.isRobot)
		{
			pos = room.left.pos;
		}
		else if(!room.right.isRobot)
		{
			pos = room.right.pos;
		}
		else if(!room.top.isRobot)
		{
			pos = room.top.pos;
		}
		return pos;
	},
	//has robot
	setRobotJiao:function(room,pPos,order)
	{
		var data = {roomId:room.id,pos:pPos,isJiao:false,nPos:0};
		if(order == Order.jiao)
		{
			data = {roomId:room.id,pos:pPos,isJiao:false,nPos:0};	
		}
		else
		{
			data = {roomId:room.id,pos:0,isQiang:false,nPos:0};
		}
		switch(data.pos)
		{
			case 0:
			{
				data.nPos = 1;
				break;
			}
			case 1:
			{
				data.nPos = 2;
				break;
			}
			case 2:
			{
				data.nPos = 0;
				break;
			}
			default:break;
		}
		if(pPos == room.left.pos)
		{
			room.left.socket.emit(order,data);
		}
		else if(pPos == room.top.pos)
		{
			room.top.socket.emit(order,data);
		}
		else if(pPos == room.right.pos)
		{
			room.right.socket.emit(order,data);
		}
		var isfinish = Room.checkJiaoFinish(data);
		var self = this;
		if(!isfinish)
		{
			var pos = this.getPlayerPos(room);
			if(pos != data.nPos)
			{
				Timer.setTimeOut(function()
				{
					self.setRobotJiao(room,data.nPos,order);
				},3);
			}
		}
	},
	//叫
	playerJiao:function(room,data)
	{
		var self = this;
		if(room.isHaveRobot)
		{
			if(data.isJiao)
			{
				Timer.setTimeOut(function()
				{
					self.setRobotJiao(room,data.nPos,Order.qiang);
				},3);
			}
			else
			{
				Timer.setTimeOut(function()
				{
					self.setRobotJiao(room,data.nPos,Order.jiao);
				},3);
			}
		}
		else
		{
			room.left.socket.emit(Order.jiao,data);
			room.top.socket.emit(Order.jiao,data);
			room.right.socket.emit(Order.jiao,data);
		}
	},
	//抢
	playerQiang:function(room,data)
	{
		var self = this;
		if(room.isHaveRobot)
		{
			Timer.setTimeOut(function()
			{
				self.setRobotJiao(room,data.nPos,Order.qiang);
			},3);
		}
		else
		{
			room.left.socket.emit(Order.qiang,data);
			room.top.socket.emit(Order.qiang,data);
			room.right.socket.emit(Order.qiang,data);
		}
	},
	//叫，抢结束
	jiaoFinish:function(room,dizhuCard)
	{
		var data = {dizhu:room.dizhu,card:dizhuCard};
		if(room.isHaveRobot)
		{
			room.socket.emit(Order.jFinish,data);
		}
		else
		{
			room.left.socket.emit(Order.jFinish,data);
			room.top.socket.emit(Order.jFinish,data);
			room.right.socket.emit(Order.jFinish,data);
		}
		if(room.dizhu == room.left.pos)
		{
			room.left.player.cards.concat(dizhuCard);
		}
		else if(room.dizhu == room.top.pos)
		{
			room.top.player.cards.concat(dizhuCard);
		}
		else if(room.dizhu == room.right.pos)
		{
			room.right.player.cards.concat(dizhuCard);
		}
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
		if(room.isHaveRobot)
		{
			room.socket.emit(Order.start,data);
			var pPos = this.getPlayerPos(room);
			if(pPos != pos)
			{
				this.robotSendCards(room,pos);
			}
			else
			{
				room.socket.emit(Order.start,data);
			}
		}
		else
		{
			room.left.socket.emit(Order.start,data);
			room.top.socket.emit(Order.start,data);
			room.right.socket.emit(Order.start,data);
		}
		this.guangboError(room,'一轮结束');
	},
	// {roomId:1,pos:0,cards:[]}
	robotSendCards:function(room,pos)
	{
		var data = {roomId:room.id,pos:pos,cards:[]};
		var robotCards = this.getRobotCards(room,pos);
		if(room.currentCardType != -1)
		{
			var cards = GameLogic.getCardForType(robotCards,room.currentCards,room.currentCardType);
			if(cards.length>0)
			{
				for(var i = 0; i<cards[0].length;i++)
				{
					data.cards.push(cards[0].sortNumber);
				}
			}
		}
		else
		{
			data.cards = [robotCards[0]];
		}
		Timer.setTimeOut(function()
		{
			Room.HandleSendcard(data);
		},3);
	},
	getRobotCards:function(room,pos)
	{
		var robotCards = [];
		if(pos == room.left.pos)
		{
			robotCards = room.left.player.cards;
		}
		else if(pos == room.top.pos)
		{
			robotCards = room.top.player.cards;
		}
		else if(pos == room.right.pos)
		{
			robotCards = room.right.player.cards;
		}
		return robotCards;
	},
	//出牌 {roomId:1,pos:0,cards:[],nPos:0:lastCount:0}//lastCount剩余数量
	playerSendcard:function(room,data)
	{
		console.log(data);
		if(room.isHaveRobot)
		{
			var pPos = this.getPlayerPos(room);
			if(pPos != data.nPos)
			{
				this.robotSendCards(room,pPos);
			}
			room.socket.emit(Order.sendcard,data);
		}
		else
		{
			room.left.socket.emit(Order.sendcard,data);
			room.top.socket.emit(Order.sendcard,data);
			room.right.socket.emit(Order.sendcard,data);
		}
	},
	gameOver:function(room)
	{
		var data = [
			room.top.player.cards,
			room.left.player.cards,
			room.right.player.cards
		];
		if(room.isHaveRobot)
		{
			room.socket.emit(Order.gameOver,data);
		}
		else
		{
			room.left.socket.emit(Order.gameover,data);
			room.top.socket.emit(Order.gameover,data);
			room.right.socket.emit(Order.gameover,data);
		}
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