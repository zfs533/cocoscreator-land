/**
 * Created by lizhongqiang on 15/6/30.
 */


var DefultMoreGameItemColor = cc.color(31, 52, 66, 255);

var MoreGameUILayer = rootUILayer.extend({
    ctor: function () {
        this._super();
        this.initLayer();
    },
    initLayer: function () {
        var self = this;
        this.parentView = ccs.load("res/cocosOut/MoreGameUILayer.json").node;
        this.addChild(this.parentView);
        //hanhu #调整更多游戏坐标 2015/08/07
        var offset = (this.parentView.getContentSize().width * winSize.height / 640 - winSize.width) / 2;
        this.parentView.x -= offset;

        //列表
        this.listview_moregame = ccui.helper.seekWidgetByName(this.parentView, "listview_moregame");
        this.text_moregame_tips = ccui.helper.seekWidgetByName(this.parentView, "text_moregame_tips");


        this.defaultItem = ccui.helper.seekWidgetByName(ccs.load("res/cocosOut/MoreGameItem.json").node, "panel_moregameitem_bk").clone();
        this.listview_moregame.setItemModel(this.defaultItem);

        //hanhu #调整上下按钮 2015/07/23
        //向上按钮
        var btn_moregame_up = ccui.helper.seekWidgetByName(this.parentView, "btn_moregame_up");
        btn_moregame_up.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {

                lm.log("btn btn_task_up button clicked");
            }
        }, this);

        //向下按钮
        var btn_moregame_down = ccui.helper.seekWidgetByName(this.parentView, "btn_moregame_down");
        btn_moregame_down.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {

                lm.log("btn btn_task_down button clicked");
            }
        }, this);

        // 刷新视图
        this.refreshViewByData(roomManager.GetMoreGameData());

        //begin modifyed by lizhongqiang 2015-09-06 15:28
        // 增加没有新游戏推荐不需要显示下拉箭头
        btn_moregame_up.setVisible(false);
        if((roomManager.GetMoreGameData() === undefined) ||
            (roomManager.GetMoreGameData() === null) ||
            roomManager.GetMoreGameData().length <= 3)
        {
            btn_moregame_down.setVisible(false);
        }
        // end modifyed by lizhongqiang
        ArrowAdpter(this, btn_moregame_up, btn_moregame_down, this.listview_moregame);

        this.ShowUserHeader(false);
        this.ShowButtomButtons(false);
        this.ShowTopButtons(false);

    },
    //刷新列表
    refreshViewByData: function (gamedata) {

        if(gamedata === undefined || gamedata === null || gamedata.length ===0)
        {
            this.text_moregame_tips.setVisible(true);

        }else
        {
            this.text_moregame_tips.setVisible(false);

            var self = this;
            this.listview_moregame.removeAllItems();
            for (var key in gamedata) {

                //过滤本游戏
                if(gamedata[key]["ganmeid"] == Game_ID)
                   continue;

                this.listview_moregame.pushBackDefaultItem();

                var lastItem = this.getLastListItem();

                //begin modified by lizhongqiang 2015-10-30 17:05

                //有推广游戏的时后再添加对应游戏的图标资源 ,根据游戏ID 命名，并加载；
                //Image_moregameitem_icon
                var Image_moregameitem_icon = ccui.helper.seekWidgetByName(lastItem, "Image_moregameitem_icon");
                Image_moregameitem_icon.loadTexture("res/cocosOut/moregame/"+ gamedata[key]["ganmeid"] +".png",ccui.Widget.LOCAL_TEXTURE);

                //end modified

                var Image_mregameitem_totalbk = ccui.helper.seekWidgetByName(lastItem, "Image_mregameitem_totalbk")
                Image_mregameitem_totalbk.setColor(DefultMoreGameItemColor);

                //游戏简要说明
                var text_moregameitem_total = ccui.helper.seekWidgetByName(lastItem, "text_moregameitem_total");
                if((gamedata[key]["gamedescription"] != undefined) && (gamedata[key]["gamedescription"]!= null))
                {
                    text_moregameitem_total.setString(gamedata[key]["gamedescription"]);
                }

                //下载奖励
                var text_moregameitem_score = ccui.helper.seekWidgetByName(lastItem, "text_moregameitem_score");
                if((gamedata[key]["awardinfo"] != undefined) && (gamedata[key]["awardinfo"]!= null))
                {
                    text_moregameitem_score.setString(gamedata[key]["awardinfo"]);
                }

                lm.log("下载奖励  " + JSON.stringify(gamedata[key]))

                // 马上体验
                var btn_moregameitem_reward = ccui.helper.seekWidgetByName(lastItem, "btn_moregameitem_reward");
                btn_moregameitem_reward.app_url = gamedata[key]["app_url"];
                btn_moregameitem_reward.gameid = gamedata[key]["ganmeid"];
                btn_moregameitem_reward.md5 = gamedata[key]["apk_md5"];

                btn_moregameitem_reward.addTouchEventListener(function (sender, type) {
                    if (type == ccui.Widget.TOUCH_ENDED)
                    {
                        DataUtil.DownloadGame(sender.gameid,sender.app_url,sender.md5);

                        // 领取下载奖励
                        webMsgManager.SendGpReceiveDowloadAwards(sender.gameid,function(data)
                        {


                            layerManager.PopTipLayer(new PopAutoTipsUILayer(data["msg"], DefultPopTipsTime),true);

                        },function(errinfo)
                        {
                            layerManager.PopTipLayer(new PopAutoTipsUILayer(errinfo, DefultPopTipsTime),true);

                        },this);


                    }
                }, this);
            }
        }
    },
    getLastListItem: function () {
        if (this.listview_moregame.getItems().length)
            return this.listview_moregame.getItems()[this.listview_moregame.getItems().length - 1];
    }

});