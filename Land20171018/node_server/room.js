//初始化100个空房间
var SLogic = require('./socketlogic').route;
var GameLogic = require('./gamelogic').route;
var RobotMan = require('./robotman');
var Room = 
{
	STATE_ZERO:0,//人未满
	STATE_UP:1,//人满了
	roomList:[],
	m_cbCardListData:[
        0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08,0x09,0x0A,0x0B,0x0C,0x0D,	//方块 A - K
        0x11,0x12,0x13,0x14,0x15,0x16,0x17,0x18,0x19,0x1A,0x1B,0x1C,0x1D,	//梅花 A - K
        0x21,0x22,0x23,0x24,0x25,0x26,0x27,0x28,0x29,0x2A,0x2B,0x2C,0x2D,	//红桃 A - K
        0x31,0x32,0x33,0x34,0x35,0x36,0x37,0x38,0x39,0x3A,0x3B,0x3C,0x3D,	//黑桃 A - K
        0x4E,0x4F //双鬼
    ],
	initEmptyRoom:function()
	{
		for(var i = 0; i<100;i++)
		{
			var room = {
				id:i,
				socket:null,
				left:null,
				top:null,
				right:null,
				jiaoCount:0,
				noCount:0,
				currentSenderPos:0,
				currentCardType:-1,
				currentCards:[],
				dizhu:-1,
				dizhuCard:[],
				isHaveRobot:false,
				state:this.STATE_ZERO
			};//三个占位 state 0:人未满，1:人满
			this.roomList.push(room);
		}
	},
	//param Item
	joinRoom:function(item,callback)
	{
		var id = Number(item.roomId);
		console.log("id=> "+id);
		for(var i = 0; i < this.roomList.length;i++)
		{
			var room = this.roomList[i];
			if(id == room.id)
			{
				if(room.state == this.STATE_UP)
				{
					callback();
					return;
				}
				console.log("------------zz");
				room.socket = item.socket;
				console.log("------------bb");
				if(!room.isHaveRobot)
				{
					if(item.isRobot)
					{
						room.isHaveRobot = true;
					}
				}
				switch (item.pos)
				{
					case 0 && !room.left://left
					{
						room.left = item;
						break;
					}
					case 1 && !room.top://top
					{
						room.top = item;
						break;
					}
					case 2 && !room.right://right
					{
						room.right = item;
						break;
					}
					default:
					{
						if(!room.left)
						{
							item.pos = 0;
							room.left = item;
						}
						else if(!room.top)
						{
							item.pos = 1;
							room.top = item;
						}
						else if(!room.right)
						{
							item.pos = 2;
							room.right = item;
						}
						else
						{
							//进入房间失败
							return;
						}
						item.updatePlayerPos(item.pos);
						break;
					}
				}
				item.player.isRoom = true;
			}
		}
	},
	//获取当前房间数据推送一份给客户端
	getClientRoomInfo:function(roomId)
	{
		console.log("----------------error=> "+roomId)
		var room = this.getRoomByRoomId(roomId);
		SLogic.sendRoomInfo(room,this);
	},
	//下线
	clearUnlinePlayer:function(item)
	{
		item.player.onLinee = false;
		var room = this.getRoomByRoomId(item.roomId);
		room.currentCards = [];
		room.currentCardType = -1;	
		if(room.id == item.roomId)
		{
			room.state = this.STATE_ZERO;
			SLogic.sendPlayerUnline(room,item);
			if(room.left && room.left.socket == item.socket)
			{
				room.left = null;
			}
			else if(room.top && room.top.socket == item.socket)
			{
				room.top = null;
			}
			else if(room.right && room.right.socket == item.socket)
			{
				room.right = null;
			}
		}
	},
	//退出房间
	clearPlayerFromRoom:function(item)
	{
		item.player.isRoom = false;
		var room = this.getRoomByRoomId(item.roomId);
		room.currentCards = [];
		room.currentCardType = -1;
		if(room.id == item.roomId)
		{
			room.state = this.STATE_ZERO;
			SLogic.sendPlayerLeaveRoom(room,item);
			if(room.left && room.left.socket == item.socket)
			{
				room.left = null;
			}
			else if(room.top && room.top.socket == item.socket)
			{
				room.top = null;
			}
			else if(room.right && room.right.socket == item.socket)
			{
				room.right = null;
			}
		}
	},
	//准备
	setPlayerReadyState:function(data)
	{
		var room = this.getRoomByRoomId(data.roomId);
		if(room)
		{
			var pData = null;
			if(room.left && room.left.pos == data.pos)
			{
				room.left.updatePlayerReadyState(data.isReady);
				pData = room.left.player;
			}
			else if(room.top && room.top.pos == data.pos)
			{
				room.top.updatePlayerReadyState(data.isReady);
				pData = room.top.player;
			}
			else if(room.right && room.right.pos == data.pos)
			{
				room.right.updatePlayerReadyState(data.isReady);
				pData = room.right.player;
			}
			SLogic.updatePlayerState(room,pData);
			this.checkRoomPlayer(data.roomId);
		}
	},
	//检查是否有房间满员,是否准备
	checkRoomPlayer:function(roomId)
	{
		var room = this.getRoomByRoomId(roomId);
		console.log("room.state=> "+room.state);
		if(room && room.state == this.STATE_ZERO)
		{
			if(room.left && room.top && room.right)
			{
				room.state = this.STATE_UP;
			}
		}
		if(room && room.state == this.STATE_UP)
		{
			if(room.left.player.isReady && room.top.player.isReady && room.right.player.isReady)
			{
				this.handleUpRoom(room);
			}
		}
	},
	sendInterver:0,
	//人满,已准备
	handleUpRoom:function(room)
	{
		console.log("---------roomup and ready---------room.id=> "+room.id);
		//发牌
		this.sendInterver = setTimeout(function()
		{
			this.Shuffle();//洗牌
			this.sendCard(room);//发牌
		}.bind(this),1000);
	},
	//洗牌
	Shuffle:function()
	{
		var arr = this.m_cbCardListData;
		var len = arr.length;
		for(var i = len - 1; i > 0; i--)
		{
		    var a = Math.floor(Math.random()*len)
		    var temp = arr[i];
		    arr[i] = arr[a];
		    arr[a] =  temp;
		}
	},
	//全发
	sendCard:function(room)
	{
		room.dizhu = -1;
		room.jiaoCount = 0;
		room.dizhuCard = [],
		// console.log(room);
		console.log("this.m_cbCardListData--------");
		var list = this.m_cbCardListData;
		var gap = 17;
		var card = [
			list.slice(0,gap),
			list.slice(gap,gap*2),
			list.slice(gap*2,gap*3),
		]
		room.dizhuCard = list.slice(gap*3,list.length);
		SLogic.LaunchCard(room,card);
		clearTimeout(this.sendInterver);			
	},
	//叫  {roomId:1,pos:0,isJiao:bool,nPos:0}
	setPlayerJiao:function(data)
	{
		data.nPos = 0;
		var room = this.getRoomByRoomId(data.roomId);
		if(data.isJiao)
		{
			room.dizhu = data.pos;
		}
		data.nPos = this.getNextPos(data.pos);
		SLogic.playerJiao(room,data);
		this.checkJiaoFinish(data);
	},
	//强
	setPlayerQiang:function(data)
	{
		data.nPos = 0;
		var room = this.getRoomByRoomId(data.roomId);
		if(data.isQiang)
		{
			room.dizhu = data.pos;
		}
		data.nPos = this.getNextPos(data.pos);
		SLogic.playerQiang(room,data);
		this.checkJiaoFinish(data);
	},
	//叫完，确定dizhu，翻开发放dizhu card
	checkJiaoFinish:function(data)
	{
		var room = this.getRoomByRoomId(data.roomId);
		var dizhuCard = room.dizhuCard;
		room.jiaoCount++;
		var isfinish = false;
		if(room.jiaoCount == 3)
		{
			isfinish = true;
			room.jiaoCount = 0;
			if(room.dizhu != -1)
			{
				if(room.dizhu == room.left.pos)
				{
					room.left.player.isDizhu = true;
					room.left.player.cards.concat(dizhuCard);
				}
				else if(room.dizhu == room.top.pos)
				{
					room.top.player.isDizhu = true;
					room.top.player.cards.concat(dizhuCard);
				}
				else if(room.dizhu == room.right.pos)
				{
					room.right.player.isDizhu = true;
					room.right.player.cards.concat(dizhuCard);
				}
				SLogic.jiaoFinish(room,dizhuCard);
			}
			else//没人叫，重发
			{
				this.handleUpRoom(room);
			}
		}
		return isfinish;
	},
	//出牌
	HandleSendcard:function(data)
	{
		data.nPos = 0;
		data.lastCount = 0;
		var room = this.getRoomByRoomId(data.roomId);
		if(data.cards.length>0)
		{
			var type = GameLogic.getType(data.cards);
			room.noCount = 0;
			if(room.currentCardType == -1)
			{
				room.currentCards = data.cards;
				room.currentSenderPos = data.pos;
				room.currentCardType = type;
			}
			else
			{
				if(type == room.currentCardType)
				{
					room.currentSenderPos = data.pos;
					// var cards = GameLogic.getCardForType(room.currentCards,data.cards,type);
					var cards = GameLogic.getCardForType(data.cards,room.currentCards,type);
					if(!cards || cards.length<1)
					{
						console.log(type);
						console.log(cards);
						console.log('send card error');
						console.log(GameLogic.getPukerData(room.currentCards));
						console.log(GameLogic.getPukerData(data.cards));
						return;
					}
				}
				else
				{
					console.log('type error');
					return;
				}
			}
		}
		else
		{
			room.noCount++;
		}
		data.nPos = this.getNextPos(data.pos);
		data.lastCount = this.removeCardFromCurrentPlayer(room,data);
		console.log(data);
		SLogic.playerSendcard(room,data);
		console.log('room.noCount=> '+room.noCount);
		if(room.noCount == 2)
		{
			room.currentCards = [];
			room.currentCardType = -1;
			SLogic.startSendcard(room,room.currentSenderPos);//一轮结束，开始新的一轮
		}
		this.checkGameOver(room,data);
	},
	getNextPos:function(pos)
	{
		var nextPos = 0;
		switch(pos)
		{
			case 0:
			{
				nextPos = 1;
				break;
			}
			case 1:
			{
				nextPos = 2;
				break;
			}
			case 2:
			{
				nextPos = 0;
				break;
			}
			default:break;
		}
		return nextPos;
	},
	removeCardFromCurrentPlayer:function(room,data)
	{
		var list = data.cards;
		var plist = [];
		switch(data.pos)
		{
			case room.left.pos:
			{
				plist = room.left.player.cards;
				break;
			}
			case room.top.pos:
			{
				plist = room.top.player.cards;
				break;
			}
			case room.right.pos:
			{
				plist = room.right.player.cards;
				break;
			}
			default:break;
		}
		for(var i = 0; i<list.length;i++)
		{
			for(var j = 0; j<plist.length;j++)
			{
				if(list[i] == plist[j])
				{
					plist.splice(j,1);
					break;
				}
			}
		}
		return plist.length;
	},
	checkGameOver:function(room,data)
	{
		var list = [
			room.left.player.cards,
			room.top.player.cards,
			room.right.player.cards
		];
		for(var i = 0; i<list.length; i++)
		{
			if(list[i].length == 0)
			{
				SLogic.gameOver(room);
				break;
			}
		}
	},
	getRoomByRoomId:function(roomId)
	{
		for(var i = 0; i<this.roomList.length;i++)
		{
			if(this.roomList[i].id == roomId)
			{
				return this.roomList[i];
			}
		}
		return false;
	}
}
exports.route = Room;
exports.room = Room;