/**
 * Created by zfs on 16/6/6.
 */
var DragonZhuangList = cc.Layer.extend(
{
    ctor:function()
    {
        this._super();
        this.zinit();
        this.getUI();
        this.getButtonUI();
    },
    zinit:function()
    {
        var bgBtn = ccui.Button.create("btn_danmu_open.png","","",ccui.Widget.PLIST_TEXTURE);
        bgBtn.scale = 20;
        bgBtn.setPosition(winSize.width/2,winSize.height/2);
        bgBtn.setOpacity(0);
        this.addChild(bgBtn);
        bgBtn.addTouchEventListener(this.bgBtnEvent, this);

        this.ui = ccs.load("res/smartGame/shangzhuang.json").node;
        this.addChild(this.ui, 100);

        var offset = (this.ui.width * winSize.height / 640 - winSize.width) / 2;
        this.ui.x -= offset;

        //上庄金币
        this.upZhuangGoldTxt = ccui.helper.seekWidgetByName(this.ui,"text_1");
    },
    bgBtnEvent:function(target, state)
    {
        if ( state == ccui.Widget.TOUCH_ENDED )
        {
            this.removeFromParent();
            dragonFight_GameID_122.zhuangLayerList = null;
        }
    },
    getButtonUI:function()
    {
        this.cancelBtn = ccui.helper.seekWidgetByName(this.ui, "button_1_0");
        this.applayBtn = ccui.helper.seekWidgetByName(this.ui, "button_1");
        this.applayBtn.addTouchEventListener(this.applyEvent, this);
        this.cancelBtn.addTouchEventListener(this.cancelEvent, this);
        this.updateButtonVisible();
    },
    applyEvent:function(target, state)
    {
        if ( state == ccui.Widget.TOUCH_ENDED )
        {
            this.refreshInfo();
        }
    },
    cancelEvent:function(target, state)
    {
        if ( state == ccui.Widget.TOUCH_ENDED )
        {
            this.refreshInfo();
        }
    },
    getUI:function()
    {
        var clist = ccui.helper.seekWidgetByName(this.ui, "listView_1");
        var lv = new ccui.ListView();
        lv.setContentSize(cc.size(clist.width, clist.height));
        lv.setBounceEnabled(true);
        lv.setDirection(ccui.ScrollView.DIR_VERTICAL);
        lv.setPosition(clist.getPosition().x-130,clist.getPosition().y);
        this.ui.addChild(lv, 200);
        this.listView = lv;
        this.sendApplyListOrder();
    },
    //更新庄家列表
    updateListItems:function(data)
    {
        this.listView.removeAllItems();
        var temp = sparrowDirector.gameData.playerInfo;
        for ( var i = 0; i < data.wApplyChair.length; i++ )
        {
            for ( var j = 0; j < temp.length; j++ )
            {
                if ( data.wApplyChair[i] == temp[j].wChairID )
                {
                    var item = this.getListViewItem(temp[j]);
                    this.listView.pushBackCustomItem(item);
                }
            }
        }
        this.updateButtonVisible();
    },
    refreshInfo:function()
    {
        var that = dragonFight_GameID_122;
        //if ( !that.isGameKongXian )
        //{
        //    layerManager.PopTipLayer(new PopAutoTipsUILayer("游戏进行中不能申请庄家！", DefultPopTipsTime));
        //    return;
        //}
        if ( that.isApplayBanker )
        {
            that.isApplayBanker = false;
            that.sendServerOrderCancelBanker();
        }
        else
        {
            that.isApplayBanker = true;
            that.sendServerOrderApplayBanker();
        }
        dragonFight_GameID_122.sendServerOrderApplayBanker();
        this.sendApplyListOrder();
        this.updateButtonVisible();
    },
    updateButtonVisible:function()
    {
        var that = dragonFight_GameID_122;
        if ( that.isApplayBanker )
        {
            this.applayBtn.visible = false;
            this.cancelBtn.visible = true;
        }
        else
        {
            this.applayBtn.visible = true;
            this.cancelBtn.visible = false;
        }
    },
    sendApplyListOrder:function()
    {
        //向服务器获取庄家列表
        dragonFight_GameID_122.sendServerOrderGetApplyList();
    },
    getListViewItem:function(data)
    {
        var item = ccs.load("res/smartGame/shangzhuangliebiao.json").node;
        var playerHead = ccui.helper.seekWidgetByName(item, "image_touxiang_1");
        var playerName = ccui.helper.seekWidgetByName(item, "text_2_xingming1");
        playerName.setString(data.szNickName);
        dragonFight_GameID_122.setPlayerIco(data,playerHead);
        var layout = ccui.Layout.create();
        layout.setContentSize(item.width,item.height);
        layout.addChild(item);
        return layout;
    }
});
