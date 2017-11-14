var PData = require('playerData');
var Net = require('net');
var Order = require('order');
var CardData = require('carddata');
var GameLogic= require('gamelogic');
var Alert = require('alert');
cc.Class(
{
    extends: cc.Component,
    properties: 
    {
        cardPrefab:null,
        TOP:0, 
        LEFT:1,
        RIGHT:2,
        isReady:false,
        isJiao:false,
        isGaming:false,
        list:null,
        currentCardType:-1,
        noCount:0,//不出次数
        jiaoCount:0,
    },
    onLoad: function ()
    {
        // CardData.loadSpriteAtals(()=>
        // {
        //     if(!this.cardPrefab)
        //     {
        //         cc.loader.loadRes('prefab/card',cc.Prefab,(err,prefab) => {
        //             this.cardPrefab = prefab;
        //             this.ResLunchLayoutCard();
        //             this.ResJiaoDZFinish();
        //         });
        //     }
        // });
        if(!this.cardPrefab)
        {
            cc.loader.loadRes('prefab/card',cc.Prefab,(err,prefab) => {
                this.cardPrefab = prefab;
            });
        }
        this.initProperty();
        this.handleButton();
    },
    start:function()
    {
        // return;
        this.roomLabel.string = PData.roomId;
        Net.setParentt(this);
        // //请求房间信息
        Net.sendMsg(Order.roomInfo,PData.roomId);        
    },
    initProperty:function()
    {
        this.roomLabel = this.node.getChildByName('roomId').getComponent(cc.Label);
        this.label0 = this.node.getChildByName('player0').getComponent(cc.Label);
        this.label1 = this.node.getChildByName('player1').getComponent(cc.Label);
        this.label2 = this.node.getChildByName('player2').getComponent(cc.Label);
        this.equip0 = this.node.getChildByName('equip0');
        this.equip1 = this.node.getChildByName('equip1');
        this.equip2 = this.node.getChildByName('equip2');
        this.cardNum1 = this.node.getChildByName('cardNum1').getComponent(cc.Label);
        this.cardNum2 = this.node.getChildByName('cardNum2').getComponent(cc.Label);
        this.setEquipLabelActive();
        this.cardNum1.enabled = this.cardNum2.enabled = false;
        this.btnequip = this.node.getChildByName('btnequip');
        this.btnequip.active = true;
        this.btnUp = this.node.getChildByName('btnUp');
        this.btnDown = this.node.getChildByName('btnDown');
        this.pCard1 = this.node.getChildByName('pCard1');
        this.pCard2 = this.node.getChildByName('pCard2');
        this.pCard1.active = this.pCard2.active = false;
        this.btnUp.active = this.btnDown.active = false;
        this.clockPos = [cc.p(21,46),cc.p(-244,157),cc.p(244,157)];
        this.clock = this.node.getChildByName('clock');
        this.clock.active = false;
        this.btnPlayNode = this.node.getChildByName('btnPlayNode');
        this.btnPlayNode.getComponent('btnplaynode').setParentt(this);
        this.btnPlayNode.active = false;
        this.playerCards = [];//玩家手上
        this.outCards = [];
        this.deskCards=[[],[],[]];
        this.currentCards = [];//上家出
        this.sendCardPos = [cc.p(0,13),cc.p(-219,114),cc.p(219,114)];
    },
    handleButton:function()
    {
        // return;
        this.btnequip.getComponent(cc.Button).node.on(cc.Node.EventType.TOUCH_END,()=>
        {
            this.isReady = this.isReady ? false :true;
            var data = {roomId:PData.roomId,pos:PData.pos,isReady:this.isReady};
            Net.sendMsg(Order.ready,data);
        });
        this.btnUp.getComponent(cc.Button).node.on(cc.Node.EventType.TOUCH_END,()=>
        {
            this.handleJiaoDZ(true);
        });
        this.btnDown.getComponent(cc.Button).node.on(cc.Node.EventType.TOUCH_END,()=>
        {
            this.handleJiaoDZ(false);
        });
    },
    ResReceiveRoomInfo:function(data)
    {
        var list = {left:null,top:null,right:null};
        var player = null;
        for(var i = 0; i<data.length;i++)
        {
            if(data[i] && data[i].namee == PData.namee)
            {
                list.top = data[i];
                player = data[i];
                PData.pos = data[i].pos;
                data.splice(i,1);
                break;
            }
        }
        for(var i = 0; i<data.length;i++)
        {
            if(data[i] && player)
            {
                switch(player.pos)
                {
                    case this.TOP:
                    {
                        if(data[i].pos == this.LEFT)
                        {
                            list.left = data[i];
                        }
                        else if(data[i].pos == this.RIGHT)
                        {
                            list.right = data[i];
                        }
                        break;
                    }
                    case this.LEFT:
                    {
                        if(data[i].pos == this.RIGHT)
                        {
                            list.left = data[i];
                        }
                        else if(data[i].pos == this.TOP)
                        {
                            list.right = data[i];
                        }
                        break;
                    }
                    case this.RIGHT:
                    {
                        if(data[i].pos == this.TOP)
                        {
                            list.left = data[i];
                        }
                        else if(data[i].pos == this.LEFT)
                        {
                            list.right = data[i];
                        }
                        break;
                    }
                    default:break;
                }
            }
        }
        if(list.left)
        {
            this.equip1.active = list.left.isReady;
            this.label1.string = list.left.namee;
        }
        if(list.top)
        {
            this.equip0.active = list.top.isReady;
            this.label0.string = list.top.namee;
        }
        if(list.right)
        {
            this.equip2.active = list.right.isReady;
            this.label2.string = list.right.namee;
        }
        this.list = list;
    },
    //准备 data = {player:player};
    ResSetPlayerReady:function(data)
    {
        let pData = data;
        if(this.list.left && pData.pos == this.list.left.pos)
        {
            this.equip1.active = pData.isReady;
        }
        else if(this.list.top && pData.pos == this.list.top.pos)
        {
            this.equip0.active = pData.isReady;
        }
        else if(this.list.right && pData.pos == this.list.right.pos)
        {
            this.equip2.active = pData.isReady;
        }
    },
    resetProperty:function()
    {
        this.setButtonShow(-1);
        this.setPlayButtonShow(-1);
        this.setEquipLabelActive(-1);
        if(this.playerCards.length>0)
        {
            for(let i = 0; i<this.playerCards.length;i++)
            {
                this.playerCards[i].node.distroy();
            }
        }
        this.playerCards = [];
        this.setLastCardNumber();
        this.cardNum1.enabled = this.cardNum2.enabled = false;
    },
    //发牌 {card:[data[0],zero,zero],pos:room.left.pos};
    ResLunchLayoutCard:function(data)
    {
        this.resetProperty();
        // var arr = function(){
        //     var a = [];
        //     for(var i = 0; i<17;i++)
        //     {
        //         a.push(null);
        //     }
        //     return a;
        // }();
        // data = {card:[GameLogic.m_cbCardListData.splice(0,13),arr,arr],pos:0};
        cc.log("-----------------------card--------------")
        cc.log(JSON.stringify(data));
        let list = data.card[data.pos];
        for(let i = 0; i<list.length;i++)
        {
            let card = this.getCard(list[i]);
            this.playerCards.push(card);
        }
        this.cardNum1.enabled = this.cardNum2.enabled = true;
        this.pCard1.active = this.pCard2.active = true;
        this.setLastCardNumber(data.card);
        this.sortAndLayoutCard();
    },
    getCard:function(num)
    {
        let card = cc.instantiate(this.cardPrefab);
        card.getComponent('card').createCard(num);
        card.getComponent('card').setParentt(this);
        this.node.addChild(card);
        return card;
    },
    sortAndLayoutCard:function(list,p)
    {
        if(!list)
        {
            this.playerCards.sort(function(a,b){return a.getComponent('card').sortNumber - b.getComponent('card').sortNumber;});
            let ww = cc.winSize.width;
            let hh = cc.winSize.height;
            var gap = 35;
            for(let i = 0; i<this.playerCards.length;i++)
            {
                let card = this.playerCards[i];
                card.setLocalZOrder(i);
                card.x =-ww/2 + (ww-gap*this.playerCards.length)/2 +gap*i;
                card.y = -205;
            }
        }
        else
        {
            let gap = 30;
            list.sort(function(a,b){return a.getComponent('card').sortNumber - b.getComponent('card').sortNumber;});
            for(let i = 0; i<list.length;i++)
            {
                let card = list[i];
                card.setPosition(p.x - (gap*list.length)/2 +gap*i,p.y);
            }
        }
    },
    handleJiaoDZ:function(bool)
    {
        if(this.isJiao)
        {
            var data = {roomId:PData.roomId,pos:PData.pos,isJiao:bool};
            Net.sendMsg(Order.jiao,data);
        }
        else
        {
            var data = {roomId:PData.roomId,pos:PData.pos,isQiang:bool};
            Net.sendMsg(Order.qiang,data);
        }
    },
    // {roomId:PData.roomId,pos:PData.pos,isJiao:bool,nPos:0}
    ResRecievePlayerJiaoDZ:function(data)
    {
        this.jiaoCount++;
        this.setJiaoOrQiangTexture(data.pos,data.isJiao);
        if(this.jiaoCount>=3)
        {
            this.jiaoCount = 0;
            return;
        }
        if(data.isJiao)
        {
            this.startQiang(data.nPos);
        }
        else
        {
            this.setClockPos(data.nPos);
            this.setButtonShow(data.nPos);
        }
        
    },
    // {roomId:PData.roomId,pos:PData.pos,isQiang:bool,nPos:0}
    ResRecievePlayerQiangDZ:function(data)
    {
        this.jiaoCount++;
        this.setJiaoOrQiangTexture(data.pos,data.isQiang);
        if(this.jiaoCount>=3)
        {
            this.jiaoCount = 0;
            return;
        }
        this.setClockPos(data.nPos);
        this.setButtonShow(data.nPos);
    },
    // {dizhu:room.dizhu,card:dizhuCard};
    ResJiaoDZFinish:function(data)
    {
        this.isGaming = true;
        this.setButtonShow(-1);
        this.setEquipLabelActive();
        let ww = cc.winSize.width;
        let gap = 40;
        let list = data.card;
        // let list = [21,22,23];
        for(let i = 0; i<list.length;i++)
        {
            // if(data.dizhu == PData.pos)
            {
                let card = this.getCard(list[i]);
                this.playerCards.push(card);
            }
            let card = this.getCard(list[i]);
            card.scale = 0.5;
            card.getComponent('card').setIsHandle(false);
            card.setPosition(-ww/2 + (ww-gap*list.length)/2 +gap*i,250);
        }
        this.sortAndLayoutCard();
    },
    // setDizhuCard:function()
    // {

    // },
    // {dizhu:room.dizhu};
    ResStartOutCard:function(data)
    {
        this.currentCards = [];
        this.currentCardType = -1;
        this.setClockPos(data.pos);
        this.setPlayButtonShow(data.pos);
        if(data.pos == PData.pos)
        {
            
        }
    },
    //todo
    ResStartJiao:function(pos)
    {
        this.isJiao = true;
        this.btnequip.active = false;
        this.setEquipLabelActive();
        this.btnUp.getComponent(cc.Sprite).spriteFrame = CardData.deskAtlas.getSpriteFrame('20_table_btncalled');
        this.btnDown.getComponent(cc.Sprite).spriteFrame = CardData.deskAtlas.getSpriteFrame('20_table_btnnocalled');
        this.setClockPos(pos);
        this.setButtonShow(pos);
    },
    startQiang:function(pos)
    {
        this.isJiao = false;
        this.btnUp.getComponent(cc.Sprite).spriteFrame = CardData.deskAtlas.getSpriteFrame('20_table_btngrab');
        this.btnDown.getComponent(cc.Sprite).spriteFrame = CardData.deskAtlas.getSpriteFrame('20_table_btnnograb');
        this.setClockPos(pos);
        this.setButtonShow(pos);
    },
    setEquipLabelActive:function(pos)
    {
        if(pos == this.TOP)
        {
            this.equip0.active = false;
        }
        else if(pos == this.LEFT)
        {
            this.equip1.active = false;
        }
        else if(pos == this.RIGHT)
        {
            this.equip2.active = false;
        }
        else
        {
            this.equip0.active = this.equip1.active = this.equip2.active = false;
        }
    },
    setClockPos:function(pos)
    {
        this.clock.active = true;
        switch(PData.pos)
        {
            case this.TOP:
            {
                this.clock.setPosition(this.clockPos[pos]);
                this.setEquipLabelActive(pos);
                break;
            }
            case this.LEFT:
            {
                var p = 0;
                if(pos==0)
                {
                    p = 2;
                }
                else if(pos == 2)
                {
                    p = 1;
                }
                this.setEquipLabelActive(p);
                this.clock.setPosition(this.clockPos[p]);
                break;
            }
            case this.RIGHT:
            {
                var p = 0;
                if(pos == 0)
                {
                    p = 1;
                }
                else if(pos == 1)
                {
                    p = 2;
                }
                this.setEquipLabelActive(p);
                this.clock.setPosition(this.clockPos[p]);
                break;
            }
            default:
            {
                break;
            }
        }
    },
    setButtonShow:function(pos)
    {
        if(PData.pos == pos)
        {
            this.btnDown.active = this.btnUp.active = true;
        }
        else
        {
            this.btnDown.active = this.btnUp.active = false;
        }
    },
    setPlayButtonShow:function(pos)
    {
        if(PData.pos == pos)
        {
            this.btnPlayNode.active = true;
        }
        else
        {
            this.btnPlayNode.active = false;
        }
    },
    setLastCardNumber:function(list,pos,lastNum)
    {
        let len = arguments.length;
        if(list)
        {
            switch(PData.pos)
            {
                case this.TOP:
                {
                    if(len>1)
                    {
                        if(pos == this.LEFT)
                        {
                            this.cardNum1.string = lastNum;
                        }
                        else if(pos == this.RIGHT)
                        {
                            this.cardNum2.string = lastNum;
                        }
                    }
                    else
                    {
                        this.cardNum1.string = list[this.LEFT].length;
                        this.cardNum2.string = list[this.RIGHT].length;
                    }
                    break;
                }
                case this.LEFT:
                {
                    if(len>1)
                    {
                        if(pos == this.RIGHT)
                        {
                            this.cardNum1.string = lastNum;
                        }
                        else if(pos == this.TOP)
                        {
                            this.cardNum2.string = lastNum;
                        }
                    }
                    else
                    {
                        this.cardNum1.string = list[this.RIGHT].length;
                        this.cardNum2.string = list[this.TOP].length;
                    }
                    break;
                }
                case this.RIGHT:
                {
                    if(len>1)
                    {
                        if(pos == this.TOP)
                        {
                            this.cardNum1.string = lastNum;
                        }
                        else if(pos == this.LEFT)
                        {
                            this.cardNum2.string = lastNum;
                        }
                    }
                    else
                    {
                        this.cardNum1.string = list[this.TOP].length;
                        this.cardNum2.string = list[this.LEFT].length;
                    }
                    break;
                }
                default:
                {
                    this.cardNum1.string = list[this.LEFT].length;
                    this.cardNum2.string = list[this.RIGHT].length;
                    break;
                }
            }
        }
        else
        {
            this.cardNum1.string = this.cardNum2.string = 0;
        }
    },
    setJiaoOrQiangTexture:function(pos,bool)
    {
        switch(PData.pos)
        {
            case this.TOP:
            {
                this.setEquipLabelTexture(pos,bool);
                break;
            }
            case this.LEFT:
            {
                var p = 0;
                if(pos==0)
                {
                    p = 2;
                }
                else if(pos == 2)
                {
                    p = 1;
                }
                this.setEquipLabelTexture(p,bool);
                break;
            }
            case this.RIGHT:
            {
                var p = 0;
                if(pos == 0)
                {
                    p = 1;
                }
                else if(pos == 1)
                {
                    p = 2;
                }
                this.setEquipLabelTexture(p,bool);
                break;
            }
            default:
            {
                break;
            }
        }
    },
    setEquipLabelTexture:function(pos,bool)
    {
        switch (pos)
        {
            case 0:
            {
                this.equip0.active = true;
                if(bool)
                {
                    if(this.isJiao)
                    {
                        this.equip0.getComponent(cc.Sprite).spriteFrame = CardData.deskAtlas.getSpriteFrame('call');
                    }
                    else if(this.isGaming)
                    {
                        this.equip0.active = false;
                    }
                    else
                    {
                        this.equip0.getComponent(cc.Sprite).spriteFrame = CardData.deskAtlas.getSpriteFrame('rod');
                    }
                }
                else
                {
                    if(this.isJiao)
                    {
                        this.equip0.getComponent(cc.Sprite).spriteFrame = CardData.deskAtlas.getSpriteFrame('not_call');
                    }
                    else if(this.isGaming)
                    {
                        this.equip2.getComponent(cc.Sprite).spriteFrame = CardData.deskAtlas.getSpriteFrame('desk032');
                    }
                    else
                    {
                        this.equip0.getComponent(cc.Sprite).spriteFrame = CardData.deskAtlas.getSpriteFrame('not_rod');
                    }
                }
                break;
            }
            case 1:
            {
                this.equip1.active = true;
                if(bool)
                {
                    if(this.isJiao)
                    {
                        this.equip1.getComponent(cc.Sprite).spriteFrame = CardData.deskAtlas.getSpriteFrame('call');
                    }
                    else if(this.isGaming)
                    {
                        this.equip1.active = false;
                    }
                    else
                    {
                        this.equip1.getComponent(cc.Sprite).spriteFrame = CardData.deskAtlas.getSpriteFrame('rod');
                    }
                }
                else
                {
                    if(this.isJiao)
                    {
                        this.equip1.getComponent(cc.Sprite).spriteFrame = CardData.deskAtlas.getSpriteFrame('not_call');
                    }
                    else if(this.isGaming)
                    {
                        this.equip2.getComponent(cc.Sprite).spriteFrame = CardData.deskAtlas.getSpriteFrame('desk032');
                    }
                    else
                    {
                        this.equip1.getComponent(cc.Sprite).spriteFrame = CardData.deskAtlas.getSpriteFrame('not_rod');
                    }
                }
                break;
            }
            case 2:
            {
                this.equip2.active = true;
                if(bool)
                {
                    if(this.isJiao)
                    {
                        this.equip2.getComponent(cc.Sprite).spriteFrame = CardData.deskAtlas.getSpriteFrame('call');
                    }
                    else if(this.isGaming)
                    {
                        this.equip2.active = false;
                    }
                    else
                    {
                        this.equip2.getComponent(cc.Sprite).spriteFrame = CardData.deskAtlas.getSpriteFrame('rod');
                    }
                }
                else
                {
                    if(this.isJiao)
                    {
                        this.equip2.getComponent(cc.Sprite).spriteFrame = CardData.deskAtlas.getSpriteFrame('not_call');
                    }
                    else if(this.isGaming)
                    {
                        this.equip2.getComponent(cc.Sprite).spriteFrame = CardData.deskAtlas.getSpriteFrame('desk032');
                    }
                    else
                    {
                        this.equip2.getComponent(cc.Sprite).spriteFrame = CardData.deskAtlas.getSpriteFrame('not_rod');
                    }
                }
                break;
            }
            default:break;
        }
    },
    putinOrOutCard:function(cardNum)
    {
        var list = this.outCards;
        for(let i = 0; i<list.length;i++)
        {
            if(list[i] == cardNum)
            {
                list.splice(i,1);
                return;
            }
        }
        list.push(cardNum);
    },
    handleSendcardButton:function()
    {
        let list = this.outCards;
        let type = GameLogic.getType(list);
        if(type && this.currentCardType == -1)//新一轮开始
        {
            Alert.show('新一轮');
            let data ={roomId:PData.roomId,pos:PData.pos,cards:list};
            Net.sendMsg(Order.sendcard,data);
        }
        else if (type && this.currentCardType == type)
        {
            //这里还要判断所选list是否能大过上家
            let cards = GameLogic.getCardForType(list,this.currentCards,type);
            if(cards || cards.length>0)
            {
                cc.log(JSON.stringify(list));
                cc.log(JSON.stringify(this.currentCards));
                cc.log(JSON.stringify(cards));
                let data ={roomId:PData.roomId,pos:PData.pos,cards:list};
                Net.sendMsg(Order.sendcard,data);
            }
            else
            {
                Alert.show('GameLogic error!');
            }
        }
        else
        {
            Alert.show('类型错误！')
        }
        cc.log(type);
        cc.log(JSON.stringify(list));
    },
    //收到玩家出card {roomId:1,pos:0,cards:[],nPos:0,lastCount:0}//lastCount剩余数量
    //1：记住一轮中的类型，上家出的card，一直更新直到该轮结束
    ResSendcard:function(data)
    {
        this.setLastCardNumber(true,data.pos,data.lastCount);
        let bool = data.cards.length>0 ? true : false;
        this.setEquipLabelTexture(data.pos,bool);//不出标签显示处理
        if(bool)
        {
            this.noCount = 0;
            this.currentCardType = GameLogic.getType(data.cards);
            this.currentCards = data.cards;
        }
        else 
        {
            this.noCount++;
        }
        if(this.noCount !=2)
        {
            this.setClockPos(data.nPos);
            this.setPlayButtonShow(data.nPos);
            this.clearDeskCards(nPos);
            this.layoutSendcards(data.pos,data.cards);
        }
    },
    layoutSendcards:function(pos,list)
    {
        if(list.length<1){return;}
        let centerP = cc.p(0,0);
        let scale = 0.5;
        let p = 0;
        switch(PData.pos)
        {
            case this.TOP:
            {
                p = pos;
                break;
            }
            case this.LEFT:
            {
                if(pos==0)
                {
                    p = 2;
                }
                else if(pos == 2)
                {
                    p = 1;
                }
                break;
            }
            case this.RIGHT:
            {
                if(pos == 0)
                {
                    p = 1;
                }
                else if(pos == 1)
                {
                    p = 2;
                }
                break;
            }
            default:
            {
                break;
            }
        }
        centerP = this.sendCardPos(p);
        for(let i = 0; i<list.length;i++)
        {
            let card = this.getCard(list[i]);
            card.scale = scale;
            card.getComponent('card').setIsHandle(false);
            this.deskCards[p].push(card);
        }
        if(PData.pos == pos)
        {
            this.clearCardFromPlayercards(list);
        }
        this.sortAndLayoutCard(this.deskCards[p],centerP);
    },
    clearDeskCards:function(pos)
    {
        if(pos>-1)
        {
            let list = this.deskCards[pos];
            for(let i = 0; i<list.length;i++)
            {
                list[i].node.distroy();
            }
            this.deskCards[pos] = [];
        }
        else
        {
            for(let i = 0; i<this.deskCards.length;i++)
            {
                for(let j =0; j<this.deskCards[i].length;j++)
                {
                    this.deskCards[i][j].node.distroy();
                }
            }
            this.deskCards = [[],[],[]];
        }
    },
    clearCardFromPlayercards:function(list)
    {
        for(let j = 0;j<list.length;j++)
        {
            for(let i = 0; i<this.playerCards.length;i++)
            {
                let num = this.playerCards[i].getComponent('card').cardNum;
                if(num == list[i])
                {
                    this.playerCards[i].node.distroy();
                    this.playerCards.splice(i,1);
                    break;
                }
            }   
        }
        this.sortAndLayoutCard();
    },
    //展开剩余
    ResGameover:function(data)
    {
        
    },
    //掉线，离开房间处理data = {player:item.player,roomId:item.roomId,pos:item.pos};
    handlePlayerLeave:function(data)
    {
        if(data.player.namee == this.label1.string)
        {
            this.label1.string = "离开";
        }
        else if(data.player.namee == this.label2.string)
        {
            this.label2.string = "离开";
        }
    }
    // update: function (dt) {

    // },
});
