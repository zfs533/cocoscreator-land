var Net = require('net');
var GameMsg = require('handmessage');
var CardData = require('carddata');
var GameLogic= require('gamelogic');
var Order = require('order');
var PData = require('playerData');
var Alert = require('alert');
cc.Class(
{
    extends: cc.Component,
    properties: 
    {
        loginBtn:cc.Button,
        leaveBtn:cc.Button,
        cardPrefab:cc.Prefab,
        label:cc.Label,
        editbox:cc.EditBox,
        roomEBox:cc.EditBox,
    },
    onLoad: function () 
    {
        CardData.loadSpriteAtals();
        if(!this.cardPrefab)
        {
            cc.loader.loadRes('prefab/card',cc.Prefab,(err,prefab) => {
                this.cardPrefab = prefab;
            });
        }
        let lba = this.node.getChildByName('label0');
    },
    start:function()
    {
        Net.setParentt(this);
        this.loginBtn.node.on(cc.Node.EventType.TOUCH_END,this.handleLoginButton.bind(this));
        this.leaveBtn.node.on(cc.Node.EventType.TOUCH_END,this.handleLeaveRoom.bind(this));
    },
    handleLoginButton:function()
    {
        

        if(!this.cardPrefab){
            Alert.show("this.cardPrefab is null");
            return;
        }
        let name = this.editbox.string;
        let roomId = this.roomEBox.string;
        if( name.length<1 || roomId.length<1)
        {
            Alert.show("name or password is empty!");
            return;
        }
        Net.connectServer(this,()=>{this.loginGame();});
        // let list = GameLogic.m_cbCardListData.splice(0,13);
        // var arr = [];
        // for(let i = 0; i<list.length;i++)
        // {
        //     let card = cc.instantiate(this.cardPrefab);
        //     card.getComponent('card').createCard(list[i]);
        //     card.x = -cc.winSize.width/2 + card.width/2 +30*i;
        //     card.y = 0;
        //     this.node.addChild(card);
        //     arr.push(card);
        // }
        // arr.sort(function(a,b){return a.getComponent('card').sortNumber - b.getComponent('card').sortNumber;});
        // for(let i = 0; i<arr.length;i++)
        // {
        //     let card = arr[i];
        //     card.setLocalZOrder(i);
        //     card.x = -cc.winSize.width/2 + card.width/2 +30*i;
        // }
    },
    loginGame:function()
    {
        let name = this.editbox.string;
        let roomId = this.roomEBox.string;
        if( name.length<1 || roomId.length<1)
        {
            Alert.show("name is empty!");
            return;
        }
        var data = {name:name,roomId:roomId,pos:null};
        PData.roomId = roomId;
        PData.namee = name;
        Net.sendMsg(Order.login,data);
    },
    handleLeaveRoom:function()
    {
        let name = this.editbox.string;
        let roomId = this.roomEBox.string;
        var data = {name:name,roomId:roomId,pos:null};
        Net.sendMsg(Order.leaveRoom,data);
    },
    testMassage:function(data)
    {
        this.label.string = data;
    },
    layoutCard:function(data)
    {
        let list = data.card[data.pos];
        for(let i = 0; i<list.length;i++)
        {
            let card = cc.instantiate(this.cardPrefab);
            card.getComponent('card').createCard(list[i]);
            this.node.addChild(card);
            let ww = cc.winSize.width;
            let hh = cc.winSize.height;
            var gap = 35;
            if(data.pos == 0)
            {
                card.x = -ww/2 + ww/5 +gap*i;
                card.y = -hh/2;
            }
            else if(data.pos == 1)
            {
                card.x = +gap*i
                card.y = 0
            }
            else if(data.pos == 2)
            {
                card.x = 50+gap*i;
                card.y = -hh/2;
            }
        }
    },
    update: function (dt) 
    {

    },
});
