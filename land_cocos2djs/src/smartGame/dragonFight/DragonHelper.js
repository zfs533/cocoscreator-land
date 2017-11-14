/**
 * Created by zfs on 16/6/6.
 */

var DragonHelper_GameId_122 = cc.Layer.extend(
{
    ctor:function()
    {
        this._super();
        this.zinit();
    },
    zinit:function()
    {
        var bgBtn = ccui.Button.create("btn_danmu_open.png","","",ccui.Widget.PLIST_TEXTURE);
        bgBtn.scale = 20;
        bgBtn.setPosition(winSize.width/2,winSize.height/2);
        bgBtn.setOpacity(0);
        this.addChild(bgBtn, 100);
        bgBtn.addTouchEventListener(this.bgBtnEvent, this);

        this.pukerMaskLayer = cc.LayerColor.create(cc.color.BLACK);
        this.pukerMaskLayer.opacity = 200;
        this.addChild(this.pukerMaskLayer);

        this.ui = ccs.load("res/smartGame/youxiguize.json").node;
        this.addChild(this.ui, 10);

        var offset = (this.ui.getContentSize().width * winSize.height / 640 - winSize.width) / 2;
        this.ui.x -= offset;
    },
    bgBtnEvent:function(target, state)
    {
        if ( state == ccui.Widget.TOUCH_ENDED )
        {
            closePlayerActions(this);
        }
    }
});


/**
 * 排行榜
 */
var DragonRank_GameId_122 = cc.Layer.extend(
{
    ctor:function()
    {
        this._super();
        this.zinit();
        this.handleRankList();
    },
    zinit:function()
    {

        var bgBtn = ccui.Button.create("btn_danmu_open.png","","",ccui.Widget.PLIST_TEXTURE);
        bgBtn.scale = 20;
        bgBtn.setPosition(winSize.width/2,winSize.height/2);
        bgBtn.setOpacity(0);
        this.addChild(bgBtn, 1);
        bgBtn.addTouchEventListener(this.bgBtnEvent, this);

        this.pukerMaskLayer = cc.LayerColor.create(cc.color.BLACK);
        this.pukerMaskLayer.opacity = 200;
        this.addChild(this.pukerMaskLayer);

        this.ui = ccs.load("res/smartGame/dayingjia.json").node;
        this.addChild(this.ui, 10);

        var offset = (this.ui.getContentSize().width * winSize.height / 640 - winSize.width) / 2;
        this.ui.x -= offset;

        var closeBtn = ccui.helper.seekWidgetByName(this.ui, "Button_1");
        closeBtn.addTouchEventListener(this.bgBtnEvent, this);
    },
    bgBtnEvent:function(target, state)
    {
        if ( state == ccui.Widget.TOUCH_ENDED )
        {
            closePlayerActions(this);
            dragonFight_GameID_122.rankLayerList = null;
        }
    },
    handleRankList:function()
    {
        var lv = new ccui.ListView();
        lv.setContentSize(cc.size(660, 325));
        lv.setBounceEnabled(true);
        lv.setDirection(ccui.ScrollView.DIR_VERTICAL);
        lv.setPosition(200,100);
        this.ui.addChild(lv, 10);
        this.listView = lv;
    },
    //刷新排行列表
    updateListItems:function(data)
    {
        this.listView.removeAllItems();
        data.UserRank.sort(function(a, b){return a.dwRank - b.dwRank;})
        var temp = sparrowDirector.gameData.playerInfo;
        for ( var i = 0; i < data.UserRank.length; i++ )
        {
            var item = this.getRankItem(data.UserRank[i]);
            this.listView.pushBackCustomItem(item);
        }
    },
    getRankItem:function(data)
    {
        var item = ccs.load("res/smartGame/dayingjiaLayer.json").node;
        var layout = ccui.Layout.create();
        layout.addChild(item);
        layout.setContentSize(item.width, item.height);

        var playerHead = ccui.helper.seekWidgetByName(item, "touxiang");
        var playerName = ccui.helper.seekWidgetByName(item, "name");
        var playerGold = ccui.helper.seekWidgetByName(item, "gold");
        playerName.setString(data.szNickName);
        playerGold.setString(data.lScore);
        dragonFight_GameID_122.setPlayerIco(data,playerHead);


        var rankTxt01 = ccui.helper.seekWidgetByName(item, "num_1");
        var rankTxt02 = ccui.helper.seekWidgetByName(item, "num_2");
        var rankTxt03 = ccui.helper.seekWidgetByName(item, "num_3");
        var rankTxt04 = ccui.helper.seekWidgetByName(item, "num_0");
        rankTxt01.visible = false;
        rankTxt02.visible = false;
        rankTxt03.visible = false;
        rankTxt04.visible = false;

        if ( data.dwRank == 1 )
        {
            rankTxt01.visible = true;
            rankTxt01.setString(data.dwRank);
        }
        else if ( data.dwRank == 2 )
        {
            rankTxt02.visible = true;
            rankTxt02.setString(data.dwRank);
        }
        else if ( data.dwRank == 3 )
        {
            rankTxt03.visible = true;
            rankTxt03.setString(data.dwRank);
        }
        else
        {
            rankTxt04.visible = true;
            rankTxt04.setString(data.dwRank);
        }


        return layout;
    }
});














