/**
 * Created by study on 15/7/13.
 */

//背景颜色
var UserItemBKColor = cc.color(22,59,82,255);

var ActivityUILayer = rootUILayer.extend({
    ctor: function () {
        this._super();
        this.initLayer();
    },
    initLayer: function () {
        //进入活动界面
        lm.log("进入....ActivityUILayer.json");

        this.activityView = ccs.load("res/cocosOut/ActivityUILayer.json").node;
        this.addChild(this.activityView);
        //hanhu #调整活动坐标 2015/08/07
        var offset = (this.activityView.getContentSize().width * winSize.height / 640 - winSize.width) / 2;
        this.activityView.x -= offset;

        //隐藏下部按钮
        this.ShowButtomButtons(false);

        //活动列表
        this.list_activity = ccui.helper.seekWidgetByName(this.activityView, "list_activity");

        this.defaultItem = ccui.helper.seekWidgetByName(ccs.load("res/cocosOut/ActivityTaskUILayer.json").node, "_panel_activity").clone();
        this.list_activity.setItemModel(this.defaultItem);



        //not show the player header
        this.ShowUserHeader(false);


        this.refreshViewByData(roomManager.getCurActiveData());

        //begin modified by lizhongqiang 2015-09-06 16:29
        //当活动数目小于3禁止滑动
        var btn_activity_up = ccui.helper.seekWidgetByName(this.activityView, "btn_active_up");
        var btn_activity_down = ccui.helper.seekWidgetByName(this.activityView, "btn_active_down");
        btn_activity_up.setVisible(false);
        if((roomManager.getCurActiveData()==undefined) ||
            (roomManager.getCurActiveData()==null)||
            (roomManager.getCurActiveData().length <= 3))
        {
            this.list_activity.setBounceEnabled(false);
            btn_activity_down.setVisible(false);
        }
        //end modified bvy lizhongqiang
        ArrowAdpter(this, btn_activity_up, btn_activity_down, this.list_activity);
    },

    //刷新列表
    refreshViewByData: function (activedata) {


        //lm.log("refreshViewByData: " + JSON.stringify(activedata));

        var self = this;
        this.list_activity.removeAllItems();
        for (var key in activedata) {
            this.list_activity.pushBackDefaultItem();

            var lastItem = this.getLastListItem();

            // 标题，时间，介绍
            var text_activity_titile = ccui.helper.seekWidgetByName(lastItem, "_activity_titile");
            var text_activity_time   = ccui.helper.seekWidgetByName(lastItem, "_text_activity_time");
            var text_activity_intro  = ccui.helper.seekWidgetByName(lastItem, "_text_activity_intro");

            // 查看，进入
            var activity_but_check = ccui.helper.seekWidgetByName(lastItem, "_activity_but_check");
            var activity_but_join  = ccui.helper.seekWidgetByName(lastItem, "_activity_but_join");


            //进入活动
            activity_but_join.lastItem = lastItem;
            activity_but_join.itemdata =  activedata[key];
            activity_but_join.addTouchEventListener(function (sender, type) {

                if (type == ccui.Widget.TOUCH_ENDED) {

                    var width  =   cc.director.getVisibleSize().width - webviewNotice_offset_x ;
                    var height =   cc.director.getVisibleSize().height - webviewNotice_offset_y;

                    var mwidth= 0,mheight=0;
                    if(cc.director.getVisibleSize().width / cc.director.getVisibleSize().height <= 1.5)
                    {
                        //hanhu #采用新的屏幕适配策略 2015/09/24
                        mwidth = (GlobleWinSize.width - webviewNotice_offset_x) * 960 / GlobleWinSize.width;
                        mheight = GlobleWinSize.height;
                        var localUrl = sender.itemdata["activeurl"] + "&mwidth="+ mwidth  +"&mheight="+mheight;
                        lm.log("进入活动 localUrl: " + localUrl);
                        //jsb.reflection.callStaticMethod("com/ljapps/p2081/AppActivity", "ShowWebView", "(Ljava/lang/String;)V", localUrl);
                        layerManager.PopTipLayer(new WebViewUILayer(Math.floor(width * 960 / GlobleWinSize.width), Math.floor(height * 640 / GlobleWinSize.height), localUrl));
                    }else
                    {
                        //hanhu #采用新的屏幕适配策略 2015/09/24
                        mwidth = GlobleWinSize.width;
                        mheight = GlobleWinSize.height;
                        var localUrl = sender.itemdata["activeurl"] + "&mwidth="+ (mwidth - webviewNotice_offset_x) +"&mheight="+mheight;
                        lm.log("进入活动 localUrl: " + localUrl);
                        //jsb.reflection.callStaticMethod("com/ljapps/p2081/AppActivity", "ShowWebView", "(Ljava/lang/String;)V", localUrl);
                        layerManager.PopTipLayer(new WebViewUILayer(Math.floor(width) ,Math.floor(height) ,localUrl));
                    }


                }
            }, this);

            //查看活动
            activity_but_check.itemdata =  activedata[key];
            activity_but_check.addTouchEventListener(function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {

                    var activewidth = sender.itemdata["activerulewidth"];
                    var activeheight = sender.itemdata["activeruleheight"];
                    lm.log("activewidth = " + activewidth + "activeheight = " + activeheight);
                    //var size = DataUtil.GetWebNoticeSize(activewidth,activeheight);

                    var mwidth= 0,mheight=0;
                    if (cc.director.getVisibleSize().width / cc.director.getVisibleSize().height <= 1.5)
                    {
                        //hanhu #采用新的屏幕适配策略 2015/09/24
                        mwidth = Number(activewidth); //GlobleWinSize.width;
                        mheight = GlobleWinSize.height;
                        var localUrl = sender.itemdata["activerulesurl"] + "&mwidth="+ (mwidth) +"&mheight="+mheight;
                        lm.log("查看活动 localUrl: " + localUrl);
                        layerManager.PopTipLayer(new PopNoticeUILayer(Number(activewidth) * 960 / GlobleWinSize.width , Number(activeheight) * 640 / GlobleWinSize.height,localUrl,"规则说明"));

                    }else
                    {
                        //hanhu #采用新的屏幕适配策略 2015/09/24
                        mwidth = Math.floor(Number(activewidth) * GlobleWinSize.height / 640); //GlobleWinSize.width;
                        mheight = GlobleWinSize.height;
                        var localUrl = sender.itemdata["activerulesurl"] + "&mwidth="+ (mwidth) +"&mheight="+mheight;
                        lm.log("查看活动 localUrl: " + localUrl);
                        layerManager.PopTipLayer(new PopNoticeUILayer(Number(activewidth), Number(activeheight) ,localUrl,"规则说明"));
                    }


                }
            }, this);


             text_activity_titile.setString(activedata[key]["activetitle"]);
             text_activity_time.setString(activedata[key]["activetime"]);
             text_activity_intro.setString(activedata[key]["activedescription"]);


            var Image_taskitem_titile = ccui.helper.seekWidgetByName(lastItem, "_image_title")
            Image_taskitem_titile.setColor(UserItemBKColor);

            var Image_taskitem_intro = ccui.helper.seekWidgetByName(lastItem, "_image_intro")
            Image_taskitem_intro.setColor(UserItemBKColor);

        }

    },
    getLastListItem: function () {
        if (this.list_activity.getItems().length)
            return this.list_activity.getItems()[this.list_activity.getItems().length - 1];
    }

});