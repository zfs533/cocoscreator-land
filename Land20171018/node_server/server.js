var express = require("express");//exports = module.exports = createApplication;
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
//----------------------------------------
var Order = require('./order');
var GameLogic = require('./gamelogic');
var Player = require('./player').route;
var Item = require('./roomitem').route;
var SLogic = require('./socketlogic').route;
var Room = require('./room').route;
Room.initEmptyRoom();//初始化100个空房间
//----------------------------------------
//client connection
var clientCount = 0;
var socketList = [];
var HandleData = function(data)
{
	if(typeof(data) == 'string')
	{
		data = JSON.parse(data);			
	}
	return data;
}
io.on(Order.route.connection,function(socket)
{
	console.log("connected server "+clientCount++);
	socket.emit(Order.route.connected,"");

	socket.on(Order.route.disconnect, function () 
	{
		console.log("disconnect");
		for(var i = 0; i<socketList.length;i++)
		{
			if(socketList[i].socket == socket)
			{
				Room.clearUnlinePlayer(socketList[i]);
				console.log("disconnect socket from socketList=> "+socketList[i].player.namee);
				socketList.splice(i,1);
				break;
			}
		}
	});
	socket.on(Order.route.leaveRoom,function(data)
	{
		data = HandleData(data);
		for(var i = 0; i<socketList.length;i++)
		{
			if(socketList[i].roomId == data.roomId)
			{
				Room.clearPlayerFromRoom(socketList[i]);
				console.log("leaveRoom=> "+socketList[i].player.namee);
				break;
			}
		}
	});
	//------------------login room------------------
	socket.on(Order.route.login,function(data)
	{
		console.log("user "+data+" logined");
		data = HandleData(data);
		var player = new Player(data.name,data.roomId,data.pos);
		console.log(player);
		var item = new Item(socket,player);
		socketList.push(item);
		socket.emit(Order.route.login,"");
		Room.joinRoom(item,function()
		{
			console.log("room is up!");
		});
	});
	socket.on(Order.route.roomInfo,function(data)
	{
		data = HandleData(data);
		Room.getClientRoomInfo(data);
	});
	//data=> {roomId:1,pos:0,isReady:bool}
	socket.on(Order.route.ready,function(data)
	{
		data = HandleData(data);
		Room.setPlayerReadyState(data);
	}.bind(this));
	//data=> {roomId:1,pos:0,isJiao:bool}
	socket.on(Order.route.jiao,function(data)
	{
		data = HandleData(data);
		Room.setPlayerJiao(data);
	}.bind(this));
	//data=> {roomId:1,pos:0,isQiang:bool}
	socket.on(Order.route.qiang,function(data)
	{
		data = HandleData(data);
		Room.setPlayerQiang(data);
	}.bind(this));
	//data=> {roomId:1,pos:0,cards:[]}
	socket.on(Order.route.sendcard,function(data)
	{
		data = HandleData(data);
		Room.HandleSendcard(data);
	});
});


server.listen(Order.route.port,function()
{
	console.log("server start port : 1314");
});