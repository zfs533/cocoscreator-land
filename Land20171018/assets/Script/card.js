var CardData = require('carddata');
var GameLogic= require('gamelogic');
cc.Class({
    extends: cc.Component,
    properties: 
    {
        card_color:null,
        card_code:null,
        card_back:null,
        sortNumber:0,
        cardNum:0,
        isSelected:false,
        isHandle:true,
    },

    // use this for initialization
    onLoad: function () 
    {
        this.initProperty();
        this.handleSelected();
    },
    initProperty:function()
    {
        this.card_color = this.node.getChildByName('card_color');
        this.card_code = this.node.getChildByName('card_code');
        this.card_back = this.node.getChildByName('card_back').getComponent(cc.Sprite);
        this.colorTexture = 
        {
            hei  : "card_spade.png",
            hong : "card_heart.png",
            mei  : "card_club.png",
            fang : "card_diamond.png"
        };
        this.m_cbCardListData =
        [
            0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08,0x09,0x0A,0x0B,0x0C,0x0D,	//方块 A - K
            0x11,0x12,0x13,0x14,0x15,0x16,0x17,0x18,0x19,0x1A,0x1B,0x1C,0x1D,	//梅花 A - K
            0x21,0x22,0x23,0x24,0x25,0x26,0x27,0x28,0x29,0x2A,0x2B,0x2C,0x2D,	//红桃 A - K
            0x31,0x32,0x33,0x34,0x35,0x36,0x37,0x38,0x39,0x3A,0x3B,0x3C,0x3D,	//黑桃 A - K
            0x4E,0x4F //双鬼
        ];
    },
    setIsHandle(bool)
    {
        this.isHandle = bool;
    },
    setParentt:function(parentt)
    {
        this.parentt = parentt;
    },
    handleSelected:function()
    {
        this.node.on(cc.Node.EventType.TOUCH_END,()=>
        {
            cc.log("this.sortNumber=> "+this.sortNumber);
            if(this.isHandle)
            {
                this.setSelectedCard();
            }
        });
    },
    setSelectedCard:function()
    {
        var gap = 40;
        if(!this.isSelected)
        {
            this.node.y +=gap;
            this.isSelected = true;
        }
        else 
        {
            this.node.y -=gap;
            this.isSelected = false;
        }
        // this.destroyTarget();
        
        this.parentt.putinOrOutCard(this.cardNum);
    },
    createCard:function(num)
    {
        this.initProperty();
        this.cardNum = num;
        this.card_back.enabled = false;
        num = num || this.m_cbCardListData[0];
        var pukerData = this.getPukerData(num);
        this.sortNumber = pukerData.value; 
        if(pukerData.huapai)
        {
            this.card_code.getComponent(cc.Sprite).spriteFrame = CardData.cardAtlas.getSpriteFrame(pukerData.huapai.substring(0,pukerData.huapai.length-4));
            this.card_code.setPosition(0,0);
            this.card_color.active = false;
        }
        else
        {
            this.card_code.getComponent(cc.Sprite).spriteFrame = CardData.cardAtlas.getSpriteFrame(pukerData.texture.substring(0,pukerData.texture.length-4));
            this.card_color.getComponent(cc.Sprite).spriteFrame = CardData.cardAtlas.getSpriteFrame(pukerData.colorTexture.substring(0,pukerData.colorTexture.length-4));
        }
    },
    getPukerData:function(pukerN)
    {
        var cadLib = this.m_cbCardListData, puker = {texture:null, value:0, colorTexture:"", huapai:null};
        //双鬼处理
        if ( pukerN == 0x4E )
        {
            puker.value = 0x4E;
            puker.huapai = "card_jokerbk.png";
            return puker;
        }
        else if ( pukerN == 0x4F )
        {
            puker.value = 0x4F;
            puker.huapai = "card_jokerrd.png";
            return puker;
        }
        for ( var i = 0; i < cadLib.length; i++ )
        {
            if ( cadLib[i] == pukerN )
            {
                puker.value = i % 13 + 1;
                if ( puker.value == 1 )
                {
                    //对A的特殊处理
                    puker.value = 14;
                }
                if ( puker.value == 2 )
                {
                    //对2的特殊处理
                    puker.value = 15;
                }
                puker.colorTexture = this.getPukerColor(pukerN);
            }
        }
        //扑克点数大于10
        switch (puker.value)
        {
            case 11:
            {
                puker.huapai = this.getPukerSuperTen(puker.value, puker.colorTexture);
                break;
            }
            case 12:
            {
                puker.huapai = this.getPukerSuperTen(puker.value, puker.colorTexture);
                break;
            }
            case 13:
            {
                puker.huapai = this.getPukerSuperTen(puker.value, puker.colorTexture);
                break;
            }
            default :
                break;
        }
        //根据扑克点数和花色找到其纹理
        if ( puker.value < 11 || puker.value == 14 || puker.value == 15 )
        {
            //红色数字
            if ( puker.colorTexture == this.colorTexture.fang || puker.colorTexture == this.colorTexture.hong )
            {
                if ( puker.value == 14 )
                {
                    puker.texture = "card_code0" + 1 + ".png";
                }
                else if(puker.value == 15)
                {
                    puker.texture = 'card_code0' + 2 + '.png';
                }
                else
                {
                    puker.texture = puker.value < 10 ? "card_code0" + puker.value + ".png" : "card_code" + puker.value + ".png";
                }
            }
            else
            {
                if ( puker.value == 14 )
                {
                    puker.texture = "card_code00" + 1 + ".png";
                }
                else if(puker.value == 15)
                {
                    puker.texture = 'card_code00' + 2 + '.png';
                }
                else 
                {
                    puker.texture = puker.value < 10 ? "card_code00" + puker.value + ".png" : "card_code0" + puker.value + ".png";
                }
            }
        }
        return puker;
    },
    //获取扑克点数大于10的扑克
    getPukerSuperTen:function(value, type)
    {
        var huaTexture = "";
        switch (type)
        {
            case this.colorTexture.fang:
            {
                huaTexture = "card_diamond" + value + ".png";
                break;
            }
            case this.colorTexture.mei:
            {
                huaTexture = "card_club" + value + ".png";
                break;
            }
            case this.colorTexture.hong:
            {
                huaTexture = "card_heart" + value + ".png";
                break;
            }
            case this.colorTexture.hei:
            {
                huaTexture = "card_spade" + value + ".png";
                break;
            }
            default :
                break;
        }
        return huaTexture;
    },
    //获取扑克花色，黑，红，梅，方
    getPukerColor:function(num)
    {
        if ( num < 0x11 )
        {
            return this.colorTexture.fang;
        }
        else if ( num >= 0x11 && num < 0x21 )
        {
            return this.colorTexture.mei;
        }
        else if ( num >= 0x21 && num < 0x31 )
        {
            return this.colorTexture.hong;
        }
        else if ( num >= 0x31 && num < 0x4E )
        {
            return this.colorTexture.hei;
        }
    },
    destroyTarget:function()
    {
        this.node.destroy();
    }
});
