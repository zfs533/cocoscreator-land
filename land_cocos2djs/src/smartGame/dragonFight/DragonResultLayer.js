/**
 * Created by zfs on 16/6/6.
 */
var DragonResultLayer_GameId_122 = cc.Layer.extend(
{
    ctor:function()
    {
        this._super();
        this.zinit();
    },
    zinit:function()
    {
        //var bgBtn = ccui.Button.create("btn_danmu_open.png","","",ccui.Widget.PLIST_TEXTURE);
        //bgBtn.scale = 20;
        //bgBtn.setPosition(winSize.width/2,winSize.height/2);
        //bgBtn.setOpacity(0);
        //this.addChild(bgBtn);

        this.ui = ccs.load("res/smartGame/bipai.json").node;
        this.addChild(this.ui, 100);


        var offset = (this.ui.getContentSize().width * winSize.height / 640 - winSize.width) / 2;
        this.ui.x -= offset;

        this.pukerMaskLayer = cc.LayerColor.create(cc.color.BLACK);
        this.pukerMaskLayer.opacity = 200;
        this.addChild(this.pukerMaskLayer);
        this.pukerMaskLayer.x += offset;

        this.dragonPuker = ccui.helper.seekWidgetByName(this.ui, "Image_card_long");
        this.tigerPuker  = ccui.helper.seekWidgetByName(this.ui, "Image_card_hu");
        this.dragonPuker.visible = false;
        this.tigerPuker.visible = false;


    },
    hideLayer:function()
    {
        this.visible = false;
        this.scale = 0.01;
    },
    showLayer:function()
    {
        this.scale = 1;
        this.visible = true;
    },
    showResultPuker:function(data)
    {
        //	{"type":"CMD_S_GameEnd","cbTimeLeave":20,"cbCardData":[0,0],"lBankerScore":0,"lBankerTotallScore":-200,"nBankerTime":2,
        // "lPlayScore":[0,0,0],"lPlayAllScore":0,"lRevenue":0}
        this.removeHistroyPuker();

        var p01 = this.dragonPuker.getWorldPosition();
        var card01 = new GameCard();
        card01.createPuker(data.cbCardData[0]);
        card01.setPosition(p01.x-this.dragonPuker.width/2, p01.y-this.dragonPuker.height/2);
        this.addChild(card01, 200, 100);

        var p02 = this.tigerPuker.getWorldPosition();
        var card02 = new GameCard();
        card02.createPuker(data.cbCardData[1]);
        card02.setPosition(p02.x-this.tigerPuker.width/2, p02.y-this.tigerPuker.height/2);
        this.addChild(card02, 200, 200);

    },
    removeHistroyPuker:function()
    {
        var child01 = this.getChildByTag(100);
        var child02 = this.getChildByTag(200);
        if ( child01 )
        {
            child01.removeFromParent();
        }
        if ( child02 )
        {
            child02.removeFromParent();
        }
    }
});




















