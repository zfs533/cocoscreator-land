//socket.io net class
var Order = require('order');
var GameMsg = require('handmessage');
var PData = require('playerData');
var Alert = require('alert');
var Message = cc.Class(
{
    socket:null,
    isConnected:false,
    ctor:function()
    {
        this.initProperty();
    },
    //init socket.io
    initProperty:function()
    {
    },
    //use HellowWorld script
    setParentt:function(parentt)
    {
        this.parentt = parentt;
    },
    handleData:function(data)
    {
        if(typeof(data) == 'string')
        {
            data = JSON.parse(data);			
        }
        return data;
    },
    connectServer:function(parentt,callback)
    {
        this.parentt = parentt;
        if(this.isConnected)
        {
            Alert.show('is connecting state');
            return;
        }
        //127.0.0.1 connect local server by port 1314
        //192.168.51.159 is local ip
        this.socket = io.connect("192.168.51.159:"+Order.port);//port 自定义
        this.registerMsg(callback);
    },
    //register(recieve) message , server send to client
    registerMsg:function(connectSuccess)
    {
        this.socket.on(Order.connected,function(msg){
            this.isConnected = true;
            connectSuccess();
        }.bind(this));
        this.socket.on(Order.disconnect,function(msg)
        {
            this.isConnected = false;
            Alert.show("---------------disconnect server ---------------");
        }.bind(this));
        this.socket.on(Order.leaveRoom,function(data)
        {
            var data = this.handleData(data);
            if(data && data.player.namee == PData.namee)
            {
                PData.isInroom = false;
                PData.roomId = -1;
            }
            else 
            {
                this.parentt.handlePlayerLeave(data);
            }
            cc.log(data);
        }.bind(this));
        this.socket.on(Order.unLine,function(data)
        {
            var data = this.handleData(data);
            cc.log(JSON.stringify(data));
            Alert.show("unLine=> "+data.player.namee );
            if(data && PData.isInroom && data.player.namee != PData.namee)
            {
                this.parentt.handlePlayerLeave(data);
            }
        }.bind(this));
        GameMsg.addMessageListener(this.socket);
        this.socket.on('test',function(data)
        {
            this.parentt.testMassage(data);
        }.bind(this));
        this.socket.on(Order.login,function(data)
        {
            cc.log("----------------login success!----------------");
            cc.director.loadScene('gamescene',function()
            {
                PData.isInroom = true;
                Alert.show('------------enter game room---------------');
            });
        }.bind(this));
        this.socket.on(Order.roomInfo,function(data)
        {
            data = this.handleData(data);
            this.parentt.ResReceiveRoomInfo(data);
        }.bind(this));
        this.socket.on(Order.ready,function(data)
        {
            data = this.handleData(data);
            this.parentt.ResSetPlayerReady(data);
        }.bind(this));
        this.socket.on(Order.launchCard,function(data)
        {
            data = this.handleData(data);
            this.parentt.ResLunchLayoutCard(data);
        }.bind(this));
        this.socket.on(Order.first,function(data)
        {
            //第一个开始叫地主
            var pos = data;
            this.parentt.ResStartJiao(pos);
        }.bind(this));
        this.socket.on(Order.jiao,function(data)
        {
            data = this.handleData(data);
            this.parentt.ResRecievePlayerJiaoDZ(data);
        }.bind(this));
        this.socket.on(Order.qiang,function(data)
        {
            data = this.handleData(data);
            this.parentt.ResRecievePlayerQiangDZ(data);
        }.bind(this));
        this.socket.on(Order.jFinish,function(data)
        {
            data = this.handleData(data);
            this.parentt.ResJiaoDZFinish(data);
        }.bind(this));
        // this.socket.on(Order.dizhuCard,function(data)
        // {
        //     data = this.handleData(data);
        //     this.parentt.setDizhuCard(data);
        // }.bind(this));
        this.socket.on(Order.start,function(data)
        {
            data = this.handleData(data);
            this.parentt.ResStartOutCard(data);
        }.bind(this));
        this.socket.on(Order.sendcard,function(data)
        {
            data = this.handleData(data);
            this.parentt.ResSendcard(data);
        }.bind(this));
        this.socket.on(Order.gameover,function(data)
        {
            data = this.handleData(data);
            this.parentt.ResGameover(data);
        }.bind(this));
        this.socket.on(Order.errorr,function(data)
        {
            data = this.handleData(data);
            Alert.show(data.info);
        }.bind(this));
    },
    sendMsg:function(order,data)
    {
        this.socket.emit(order,data);
    }
});
var msg = msg || new Message();
module.exports = msg;