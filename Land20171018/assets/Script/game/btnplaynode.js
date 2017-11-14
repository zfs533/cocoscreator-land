var Order = require('order');
var Net = require('net');
var PData = require('playerData');
cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () 
    {
        this.setLocalProperty();
        this.handleButton();
    },
    setLocalProperty:function()
    {
        this.btnOut = this.node.getChildByName('btnOut');
        this.btnTip = this.node.getChildByName('btnTip');
        this.btnRe = this.node.getChildByName('btnRe');
        this.btnNo = this.node.getChildByName('btnNo');
    },
    handleButton:function()
    {
        this.btnOut.getComponent(cc.Button).node.on(cc.Node.EventType.TOUCH_END,()=>
        {
            this.parentt.handleSendcardButton();
        });
        this.btnTip.getComponent(cc.Button).node.on(cc.Node.EventType.TOUCH_END,()=>
        {
            
        });
        this.btnRe.getComponent(cc.Button).node.on(cc.Node.EventType.TOUCH_END,()=>
        {
            
        });
        this.btnNo.getComponent(cc.Button).node.on(cc.Node.EventType.TOUCH_END,()=>
        {
            if(this.parentt.currentCardType !=-1)
            {
                let data ={roomId:PData.roomId,pos:PData.pos,cards:[]};
                Net.sendMsg(Order.sendcard,data);
            }
        });
    },
    setParentt:function(parentt)
    {
        this.parentt = parentt;
    }
});
