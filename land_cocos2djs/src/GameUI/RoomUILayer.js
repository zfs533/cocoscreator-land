/**
 * Created by lizhongqiang on 15/6/2.
 */

var SignStatusTag = 1000;
var SignCountTag = 1001;
var RewardDesTag = 1002;
// 房间类型
var RoomType =
{
    ROOM_TYPE_NULL: 0,   // 无
    ROOM_TYPE_GOLD: 1,   // 金币场
    ROOM_TYPE_MATCH: 2,  // 比赛场
    ROOM_TYPE_LAIZI: 3,  // 癞子场
    ROOM_TYPE_HAPPY: 4   // 欢乐场
};

//保存当前比赛房间界面
var currentMatchRoom = null;

var RoomUILayer = rootUILayer.extend({
    curServer:null,
    ctor: function () {
        this._super();
        this.initLayer();
        cc.spriteFrameCache.addSpriteFrames("res/landlord/cocosOut/ddzRoom/ddzRoom.plist");
    },
    onExit: function ()
    {
        this._super();
        this.unschedule(this.updateItem);
    },

    onEnterTransitionDidFinish: function () {
        this._super();
        DataUtil.SetGoToModule(ClientModuleType.Plaza);

        this.bottomBtnLayer.Show();
    },

    initLayer: function () {

        cc.spriteFrameCache.addSpriteFrames("res/landlord/cocosOut/ddzRoom/ddzRoom.plist");

        var self = this;

        this.parentView = ccs.load("res/landlord/cocosOut/RoomUILayer.json").node;
        this.addChild(this.parentView);
        this.parentView.ignoreAnchorPointForPosition(false);
        this.parentView.setAnchorPoint(0.5,0.5);
        this.parentView.setPosition(winSize.width/2,winSize.height/2);

        // 显示title
        this.image_title = ccui.helper.seekWidgetByName(this.parentView, "image_title");

        //pageview-金币场和癞子场
        this.pageview_room = ccui.helper.seekWidgetByName(this.parentView, "pageview_room");
        //this.pageview_room.setContentSize(winSize.width,this.pageview_room.getContentSize().height);
        this.pageview_room.setCustomScrollThreshold(150);

        //scrollview-比赛场
        this.layer_ranking = ccui.helper.seekWidgetByName(this.parentView, "layer_ranking");

        //话费赛
        this.scrollView_room_huafei = ccui.helper.seekWidgetByName(this.parentView, "scrollView_room_huafei");
        this.scrollView_room_huafei.setDirection(ccui.ScrollView.DIR_VERTICAL);
        this.scrollView_room_huafei.setTouchEnabled(true);

        //金币赛
        this.scrollView_room_gold = ccui.helper.seekWidgetByName(this.parentView, "scrollView_room_gold");
        this.scrollView_room_gold.setDirection(ccui.ScrollView.DIR_VERTICAL);
        this.scrollView_room_gold.setTouchEnabled(true);
        this.scrollView_room_gold.setVisible(false);

        this.btn_huafei = ccui.helper.seekWidgetByName(this.parentView, "btn_huafei");
        this.btn_huafei.loadTextures("btn_huafei_press.png", "btn_huafei_press.png", "", ccui.Widget.PLIST_TEXTURE);
        //this.btn_huafei.setTouchEnabled(false);
        this.btn_huafei.addTouchEventListener(function (sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                this.btn_huafei.loadTextures("btn_huafei_press.png", "btn_huafei_press.png", "", ccui.Widget.PLIST_TEXTURE);

                this.btn_gold.loadTextures("btn_glod_normal.png", "btn_glod_normal.png", "", ccui.Widget.PLIST_TEXTURE);

                this.scrollView_room_huafei.setVisible(true);
                this.scrollView_room_gold.setVisible(false);
            }
        }, this);

        this.btn_gold = ccui.helper.seekWidgetByName(this.parentView, "btn_gold");
        this.btn_gold.loadTextures("btn_glod_normal.png", "btn_glod_normal.png", "", ccui.Widget.PLIST_TEXTURE);
        //this.btn_huafei.setTouchEnabled(true);
        this.btn_gold.addTouchEventListener(function (sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                this.btn_huafei.loadTextures("btn_huafei_normal.png", "btn_huafei_normal.png", "", ccui.Widget.PLIST_TEXTURE);
                //this.btn_huafei.setTouchEnabled(true);

                this.btn_gold.loadTextures("btn_glod_press.png", "btn_glod_press.png", "", ccui.Widget.PLIST_TEXTURE);
                //this.btn_gold.setTouchEnabled(false);

                this.scrollView_room_huafei.setVisible(false);
                this.scrollView_room_gold.setVisible(true);
            }
        }, this);

        //不显示玩家头像
        this.ShowUserHeader((SubMitAppstoreVersion == true ||  DoNotMatchRoomVersion == true));


        // 自动弹出签到
        if(SubMitAppstoreVersion == true ||  DoNotMatchRoomVersion == true)
        {
            // begin mdified by lizhongqiang 2015-08-17  11:50
            // 今日已签到，只显示公告面板，今日未签到，在签到面板关闭后显示公告面板
            // 尺寸弹出的公告面板、签到面板均是单例模式
            // 一键注册账号 没有签到，从账号列表删除后， 切换到另一个账号登录并签到，下次登录，每次都弹出签到界面BUG；2015-08-31 15：45
            if(roomManager.GetMarkData() === undefined ||roomManager.GetMarkData() === null )
            {
                webMsgManager.SendGpGetMarkData(function (data) {

                        roomManager.SetMarkData(data);
                        if(DataUtil.IsToDayChecked())
                        {
                            //layerManager.PopNoticeLayer();

                        }else
                        {
                            layerManager.AutoPopMarkUILayer();
                        }
                    },
                    function (errinfo) {

                    }, this);

            }else
            {
                if(DataUtil.IsToDayChecked())
                {
                    //layerManager.PopNoticeLayer();

                }else
                {
                    layerManager.AutoPopMarkUILayer();
                }
            }
            // end modifyed  by lizhongqiang
        }


        //推广员绑定
        this.InitPromotion();
        //end modified by lizhongqiang 2015/12/31


        //隐藏下部按钮
        this.ShowButtomButtons(false);


        //this.bottomBtnLayer = new BottomBtnUILayer();
        //this.addChild(this.bottomBtnLayer);
        //this.bottomBtnLayer.setPosition(winSize.width/2, 0);

        this.bottomBtnLayer = new BottomBtnUILayer();
        this.addChild(this.bottomBtnLayer);
        this.bottomBtnLayer.setPosition(winSize.width/2, 0);

    },

    //初始化活动兑换--功能已隐藏
    InitActiveCode:function()
    {
        return;
        var self = this;
        this.activityButton = ccui.Button.create("res/ActivityCode/activityButton.png",
            "res/ActivityCode/activityButton.png",
            "res/ActivityCode/activityButton.png",
            ccui.Widget.LOCAL_TEXTURE);
        var pos = this.btn_buildmobile.getPosition();

        this.activityButton.setPosition(cc.p(pos.x, pos.y + 150));
        this.activityButton.setPressedActionEnabled(true);
        this.parentView.addChild(this.activityButton, 9);

        this.activityButton.addTouchEventListener(function(sender, type){
            if(type == ccui.Widget.TOUCH_ENDED)
            {
                lm.log("打开兑换界面");
                self.OpenActivityPage();
            }
        }, this);

        var back = cc.Sprite.createWithSpriteFrameName("buildmobile_bk.png");
        var wheel = cc.Sprite.createWithSpriteFrameName("buildmobile_animation.png");
        var actionBy = cc.RotateBy.create(3, 360);
        wheel.runAction(cc.RepeatForever.create(actionBy));
        this.activityButton.addChild(wheel, -1);
        this.activityButton.addChild(back, -2);

        //wheel.setScale(4);
        wheel.setPosition(cc.p(this.activityButton.getContentSize().width / 2,  this.activityButton.getContentSize().height / 2));
        back.setPosition(cc.p(this.activityButton.getContentSize().width / 2,  this.activityButton.getContentSize().height / 2));
        this.ShowActiveCode(false);

    },

     //显示活动兑换--功能已隐藏
    ShowActiveCode:function(bShow)
    {
        if((bShow == true) && (SubMitAppstoreVersion == false))
        {
            this.activityButton.setVisible(true);
        }else
        {

            this.activityButton.setVisible(false);
        }

    },

    //begin added by lizhongqiang  2015/12/31
    //新增加推广员绑定入口 － 仅IOS生效--功能已隐藏
    InitPromotion:function()
    {
        return;
        var self = this;
        this.promotionButton = ccui.Button.create("res/ActivityCode/promotionButton.png",
            "res/ActivityCode/promotionButton.png",
            "res/ActivityCode/promotionButton.png",
            ccui.Widget.LOCAL_TEXTURE);

        this.promotionButton.setPosition(cc.p(90.5, 434));
        this.promotionButton.setPressedActionEnabled(true);
        this.parentView.addChild(this.promotionButton, 9);
        this.promotionButton.addTouchEventListener(function(sender, type){
            if(type == ccui.Widget.TOUCH_ENDED)
            {
                lm.log("打开推广员绑定界面");
                self.OpenPromotion();
            }
        }, this);

        var back = cc.Sprite.createWithSpriteFrameName("buildmobile_bk.png");
        var wheel = cc.Sprite.createWithSpriteFrameName("buildmobile_animation.png");
        var actionBy = cc.RotateBy.create(3, 360);
        wheel.runAction(cc.RepeatForever.create(actionBy));
        this.promotionButton.addChild(wheel, -1);
        this.promotionButton.addChild(back, -2);

        wheel.setPosition(cc.p(this.promotionButton.getContentSize().width / 2, this.promotionButton.getContentSize().height / 2));
        back.setPosition(cc.p(this.promotionButton.getContentSize().width / 2, this.promotionButton.getContentSize().height / 2));
        this.ShowPromotion();
    },

    //显示绑定推广员按钮 -仅 IOS、IPAD,并且非审核才显示--功能已隐藏
    ShowPromotion:function(bShow)
    {
        return;
        if((bShow == true) && (SubMitAppstoreVersion == false))
        {
            this.promotionButton.setVisible((Number(GetDeviceType()) !== DeviceType.ANDROID));

        }else
        {
            this.promotionButton.setVisible(false);
        }
    },

    //显示绑定推广员绑定界面 -仅 IOS、IPAD,并且非审核才显示--功能已隐藏
    OpenPromotion: function()
    {
        var self = this;
        var parent = ccs.load("res/cocosOut/BuildPromotionLayer.json").node;

        var panel_bulidpromotion_account = ccui.helper.seekWidgetByName(parent, "panel_bulidpromotion_account");
        var textfield_promotion_account = layerManager.CreateDefultEditBox(parent, cc.size(240, 30), cc.p(0, 0.5), cc.p(148, 28), "请输入推广员账号", cc.color(0, 0, 0, 240), false);
        panel_bulidpromotion_account.addChild(textfield_promotion_account);

        //绑定推广员按钮
        var btn_bulidpromotion = ccui.helper.seekWidgetByName(parent, "btn_bulidpromotion");
        btn_bulidpromotion.textfield_promotion_account = textfield_promotion_account;
        btn_bulidpromotion.addTouchEventListener(function(sender, type){
            if(type == ccui.Widget.TOUCH_ENDED)
            {

                var promotionaccount =  sender.textfield_promotion_account.getString();
                lm.log("promotionaccount:" + promotionaccount);
                if(promotionaccount == null || promotionaccount.length == 0)
                {
                    layerManager.PopTipLayer(new PopAutoTipsUILayer("推广员账号不能为空！", DefultPopTipsTime),self);
                    return;
                }

                NewWebMsgManager.SendBuildPromotion(Number(promotionaccount), function(data){
                        lm.log("绑定推广员成功！");
                        layerManager.PopTipLayer(new PopAutoTipsUILayer(data, DefultPopTipsTime), true);
                        try{
                            parent.removeFromParent(true);
                        }
                        catch(exp){

                        }

                    },
                    function(data){
                        lm.log("绑定推广员失败！");
                        layerManager.PopTipLayer(new PopAutoTipsUILayer(data, DefultPopTipsTime), true);
                    },this);
            }
        },this);

        var btn_bulidpromotion_close = ccui.helper.seekWidgetByName(parent, "btn_bulidpromotion_close");
        btn_bulidpromotion_close.addTouchEventListener(function(sender, type){
            if(type == ccui.Widget.TOUCH_ENDED)
            {
                parent.removeFromParent(true);
            }
        },this);

        setTouchListener(parent,true, function(){return true;});
        this.addChild(parent, 99999);

    },
    //end added by lizhongqiang 2015/12/31


    //hanhu #打开活动页面函数 2015/11/19
    OpenActivityPage : function()
    {
        var layer = cc.LayerColor.create(cc.color(0, 0, 0, 200));
        var page = ccs.load("res/cocosOut/ActivityCodePage.json").node
        var back = ccui.helper.seekWidgetByName(page, "Image_1");
        var inputBack = ccui.helper.seekWidgetByName(back, "Image_3");
        var textFiled = ccui.helper.seekWidgetByName(inputBack, "TextField_1");
        textFiled.setVisible(false);
        textFiled.setTouchEnabled(false);
        textFiled = layerManager.CreateDefultEditBox(this, cc.size(320, 50), cc.p(0.5, 0.5), cc.p(313, 35), "请输入活动码兑换奖励", cc.color(0, 0, 0, 240), false);
        textFiled.setPlaceholderFontName("Arial");
        textFiled.setPlaceholderFontSize(24);
        textFiled.x -= 5;
        inputBack.addChild(textFiled);

        var confirmButton = ccui.helper.seekWidgetByName(back, "Button_5");
        confirmButton.addTouchEventListener(function(sender, type){
            if(type == ccui.Widget.TOUCH_ENDED)
            {
                lm.log("提交激活码");
                layerManager.PopTipLayer(new PopAutoTipsUILayer("兑换码已提交，请耐心等到兑换结果", 1.5), true);
                var code = textFiled.getString();
                if(code.length == 0)
                {
                    layerManager.PopTipLayer(new PopAutoTipsUILayer("兑换码不能为空", 1.5), true);
                    return;
                }
                NewWebMsgManager.SendGetActivityAward(code, function(data){
                    lm.log("兑换奖励成功");
                    layerManager.PopTipLayer(new PopAutoTipsUILayer(data, 3), true);
                    try{
                        layer.removeFromParent(true);
                    }
                    catch(exp){
                        lm.log("移出兑换界面失败");
                    }

                },
                function(data){
                    lm.log("兑换奖励失败");
                    layerManager.PopTipLayer(new PopAutoTipsUILayer(data, 1.5), true);
                },this);
            }
        },this);

        var ExitButton = ccui.helper.seekWidgetByName(back, "Button_6");
        ExitButton.addTouchEventListener(function(sender, type){
            if(type == ccui.Widget.TOUCH_ENDED)
            {
                layer.removeFromParent(true);
            }
        },this);

        setTouchListener(layer,true, function(){return true;});
        layer.addChild(page);
        this.addChild(layer, 99999);
    },

    //显示列表--功能已去除
    ShowListView:function(bShow)
    {
        if(bShow)
        {
            this.backImage.setVisible(true);
            this.listView.setVisible(true);
            this.btn_room_dropdown.setVisible(false);
            this.btn_room_dropup.setVisible((SubMitAppstoreVersion == true ||  DoNotMatchRoomVersion == true)?false:true);

        }else
        {
            this.backImage.setVisible(false);
            this.listView.setVisible(false);
            this.btn_room_dropup.setVisible(false);
            this.btn_room_dropdown.setVisible((SubMitAppstoreVersion == true ||  DoNotMatchRoomVersion == true)?false:true);


        }
    },

    //显示手机绑定界面--功能已去除
    ShowBuildMobile:function(bShow)
    {

        if(SubMitAppstoreVersion == false)
           this.panel_build_mobile.setVisible(bShow);
        else
            this.panel_build_mobile.setVisible(false);
    },

    // 设置list 选择的文字--功能已去除
    SetListSelectText:function (text)
    {
        var  textbmfont_golditem_text =ccui.helper.seekWidgetByName(this.parentView, "textbmfont_golditem_text");
        textbmfont_golditem_text.setString(text);

    },

    // 刷新列表--功能已去除
    refreshList: function (listData) {

        var self = this;
        this.listView.removeAllItems();
        this.listView.setItemsMargin(5);
        for(var key in listData) {
            this.listView.pushBackDefaultItem();
            var lastItem = this.getLastListItem();
            var pos = lastItem.getPosition();
            //lm.log("Item pos = " + pos.x);
            lastItem.setPosition(cc.p(this.listView.getContentSize().width / 2, pos.y));
            //lm.log("Item pos = " + lastItem.getPosition().x);
            var textbmfont_listitem_text = ccui.helper.seekWidgetByName(lastItem, "textbmfont_listitem_text");
            textbmfont_listitem_text.setString(listData[key]["name"]);
            //hanhu #修改字体颜色 2015/08/13
            //textbmfont_listitem_text.setColor(cc.color(255, 255, 11));

            var btn_listitem = ccui.helper.seekWidgetByName(lastItem, "btn_listitem");
            btn_listitem.type = listData[key]["type"];
            //hanhu #修改背景颜色 2015/08/13
            //btn_listitem.setColor(cc.color(11, 157, 255));

            btn_listitem.addTouchEventListener(function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {

                    if (sender.type == RoomType.ROOM_TYPE_GOLD) {

                        //显示金币场
                        var curLayer = new RoomUILayer();
                        curLayer.setTag(ClientModuleType.GoldField);
                        layerManager.repalceLayer(curLayer);
                        curLayer.refreshView(RoomType.ROOM_TYPE_GOLD);

                        //var data = {};
                        //var popLayer = new WinPopDialog(data);
                        //cc.director.getRunningScene().addChild(popLayer, 99);
                    }
                    else if (sender.type == RoomType.ROOM_TYPE_LAIZI) {

                        //显示金币场
                        var curLayer = new RoomUILayer();
                        curLayer.setTag(ClientModuleType.GoldField);
                        layerManager.repalceLayer(curLayer);
                        curLayer.refreshView(RoomType.ROOM_TYPE_LAIZI);

                        //var data = {};
                        //var popLayer = new WinPopDialog(data);
                        //cc.director.getRunningScene().addChild(popLayer, 99);
                    }
                    else {

                        // 显示比赛场
                        var curLayer = new RoomUILayer();
                        curLayer.setTag(ClientModuleType.MathField);
                        layerManager.repalceLayer(curLayer);

                        //测试比赛结算界面
                        //var RankLayer = new MatchRankLayer("双雄杯血流精英赛", RankLayerType.MatchRankInEnd, testRankData, 101, 0);
                        //cc.director.getRunningScene().addChild(RankLayer, 9999);
                        //matchMsgManager.ShowWaitMessage();

                        curLayer.refreshView(RoomType.ROOM_TYPE_MATCH);



                    }
                }

            }, this);

        }
    },

    getLastListItem: function () {
    if (this.listView.getItems().length)
        return this.listView.getItems()[this.listView.getItems().length - 1];
    },

    //刷新金币、癞子、比赛场界面
    refreshView: function (roomtype)
    {
        if(SubMitAppstoreVersion == true ||  DoNotMatchRoomVersion == true)
        {
            //this.SetListSelectText(this.listdata[0].name);
            this.refreshViewByData(RoomType.ROOM_TYPE_GOLD);

        }else
        {
            switch (roomtype) {
                case RoomType.ROOM_TYPE_GOLD: //金币房间
                {
                    this.ShowPromotion(false);
                    lm.log("刷新 金币房间111");
                    this.refreshViewByData(RoomType.ROOM_TYPE_GOLD);

                }
                    break;
                case RoomType.ROOM_TYPE_LAIZI: //癞子房间
                {
                    this.ShowPromotion(false);
                    this.refreshViewByData(RoomType.ROOM_TYPE_LAIZI);

                }
                case RoomType.ROOM_TYPE_HAPPY: //欢乐房间
                {
                    this.ShowPromotion(false);
                    this.refreshViewByData(RoomType.ROOM_TYPE_HAPPY);

                }
                    break;
                case RoomType.ROOM_TYPE_MATCH: // 比赛房间
                {
                    this.ShowPromotion(false);

                    this.refreshViewByData(RoomType.ROOM_TYPE_MATCH);

                }
                    break;
            }
        }

        return true;
    },

    // 按下商城按钮
    OnMallClicked:function()
    {
        layerManager.PopTipLayer(new WaitUILayer("正在努力加载中...",function()
        {
            layerManager.PopTipLayer(new PopAutoTipsUILayer("连接服务器超时，请稍后重试！", DefultPopTipsTime),false);

        },this));

        if(roomManager.GetMallData() != null || roomManager.GetMallData() != undefined)
        {
            lm.log("已有商城数据");
            var curLayer =  new MallUILayer();
            curLayer.setTag(ClientModuleType.Mall);
            curLayer.setMallDataType(MallDataType.MALL_DATA_GOLD);
            layerManager.repalceLayer(curLayer);
            DataUtil.SetGoToModule(ClientModuleType.Plaza);
        }
        else
        {
            webMsgManager.SendGpProperty(function (data)
                {
                    roomManager.SetMallData(data);
                    var curLayer =  new MallUILayer();
                    curLayer.setTag(ClientModuleType.Mall);
                    curLayer.setMallDataType(MallDataType.MALL_DATA_GOLD);
                    layerManager.repalceLayer(curLayer);
                    DataUtil.SetGoToModule(ClientModuleType.Plaza);
                },
                function (errinfo) {
                    lm.log("请求商城数据失败. info = " + errinfo);
                    layerManager.PopTipLayer(new PopAutoTipsUILayer(errinfo, DefultPopTipsTime),true);
                },
                this);
        }

    },

    //根据数据刷新列表
    refreshViewByData: function (roomtype) {
        this.pageview_room.removeAllPages();

        var self = this;
        var roomdata = null;
        var length = 0;
        switch (roomtype) {
            case RoomType.ROOM_TYPE_GOLD: //金币房间
            {
                this.layer_ranking.setVisible(false);
                this.image_title.loadTexture("image_roomTitle_classic.png", 1);
                this.ShowGoldLaiziView(roomManager.GetGoldRoomData());
            }
                break;

            case RoomType.ROOM_TYPE_LAIZI: //癞子房间
            {
                this.layer_ranking.setVisible(false);
                this.image_title.loadTexture("image_roomTitle_laizi.png", 1);
                this.ShowGoldLaiziView(roomManager.GetLaiziRoomData());
            }
                break;

            case RoomType.ROOM_TYPE_HAPPY: //欢乐房间
            {
                this.layer_ranking.setVisible(false);
                this.image_title.loadTexture("image_roomTitle_happy.png", 1);
                this.ShowGoldLaiziView(roomManager.GetHappyRoomData());
            }
                break;

            case RoomType.ROOM_TYPE_MATCH: // 比赛房间
            {
                this.image_title.loadTexture("image_roomTitle_ranking.png", 1);
                this.ShowMatchViewEx();
            }
                break;
        }

    },

    //显示金币、癞子场界面
    ShowGoldLaiziView: function(roomdata)
    {
        //roomdata = roomManager.GetGoldRoomData();
        if (roomdata == undefined || roomdata == null )
        {
            lm.log("没有获取到金币数据" + roomdata);
            return ;
        }
        length = roomdata.length;
        //lm.log("金币房长度为:" + length);

        lm.log("refreshViewByData  length ： " + length);
        //加载文件
        for(var pageindex =0;pageindex<length/4;pageindex++)
        {
            lm.log("refreshViewByData  length1 ： " + length);
            var pageitem = ccs.load("res/landlord/cocosOut/RoomPageItem.json").node;
            lm.log("refreshViewByData  length2 ： " + length);
            if (pageitem !== null)
            {
                lm.log("ShowGoldLaiziView addPage" + pageindex);
                this.pageview_room.addPage(pageitem);
            }else
            {
            }
        }
        //hanhu #对金币场数据进行排序后显示 2015/08/03
        roomdata = roomdata.sort(function(a, b){
            //lm.log("a =" + a["accessgold"] + " b =" + b["accessgold"]);

            if(Number(a["accessgold"]) > Number(b["accessgold"]))
            {
                return true;
            }
            else
            {
                return false;
            }
        });
        //roomdata.sort(function(a, b){return a.SerType - b.SerType;});

        var pageindex = 0,itemindex = 0;
        for (var i=0;i<length;i++) {

            // 设置item 显示数据
            itemindex = i % 4;
            var pageitem = this.pageview_room.getPage(pageindex);
            lm.log("ShowGoldLaiziView i : " + i + ", pageindex : " + pageindex);
            if (pageitem !== null)
            {
                var subPageitem = ccui.helper.seekWidgetByName(pageitem, "panel_item_" + itemindex)

                var btn_item_bk = ccui.helper.seekWidgetByName(subPageitem, "btn_item_bk");
                btn_item_bk.itemindex = itemindex;
                btn_item_bk.setSwallowTouches(false);
                btn_item_bk.setPressedActionEnabled(true);

                //获取房间的在线人数 准入金额的上下限。
                var roomViewData = GameServerKind.GetRoomViewData(roomdata[i]);


                //场次显示
                var image_itemTitle = ccui.helper.seekWidgetByName(subPageitem, "image_itemTitle");
                lm.log("roomData[i] = "+JSON.stringify(roomdata[i]));
                image_itemTitle.loadTexture("image_itemTitle_" + roomdata[i]["SortID"] + ".png", 1);    //SortID 1234 新初中高

                //底金设置
                var fnt_di = ccui.helper.seekWidgetByName(subPageitem, "fnt_di");
                fnt_di.setString(roomdata[i]["accessgold"]);


                //在线人数
                var Text_noOnline = ccui.helper.seekWidgetByName(subPageitem, "Text_noOnline");
                Text_noOnline.setString("" + roomViewData["dwOnlineCount"]);

                //准入金额
                var Text_accessgold = ccui.helper.seekWidgetByName(subPageitem, "Text_accessgold");
                Text_accessgold.setString("" + indentationEnter(roomViewData["lMinTabScore"]) + "-" + indentationEnter(roomViewData["lMaxTableScore"]));
                if(roomViewData["lMaxTableScore"] == 0) //没有最高限制
                {
                    Text_accessgold.setString("" + indentationEnter(roomViewData["lMinTabScore"]) + "以上");
                }

                var self = this;

                var serveritem = roomdata[i];
                btn_item_bk.serveritem = serveritem;
                btn_item_bk.data = roomViewData;
                btn_item_bk.addTouchEventListener(function (sender, type)
                {
                    if (type == ccui.Widget.TOUCH_ENDED)
                    {
                        //获取当前房间准入金币 BY ZFS 20160315
                        sparrowDirector.gameData.accessGold = sender.data["lMinTabScore"];

                        if ( sender.serveritem.SerType == 5 )
                        {
                            Game_ID   = LandGameID.DOU_DI_ZHU_LAI_ZI;//游戏ID（laizi）
                        }
                        else if ( sender.serveritem.SerType == 6 )
                        {
                            Game_ID   = LandGameID.DOU_DI_ZHU_HAPPY;//游戏ID（欢乐）
                        }
                        else
                        {
                            Game_ID   = LandGameID.DOU_DI_ZHU;//游戏ID(普通)
                        }
                        //SetGameLogic(Is_LAIZI_ROOM());

                        // 查找可进入的房间
                        GameServerKind.GetNearServer(userInfo.globalUserdData["lUserScore"], sender.serveritem, sender.data,
                            function(curserver)
                            {
                                // 轮询获取地址
                                var serveritem = logonAddressListManger.GetNextAddress();

                                //hanhu #加入用户进入房间类型统计 2015/10/19
                                if(GetDeviceType() == DeviceType.ANDROID)
                                {
                                    //jsb.reflection.callStaticMethod(AndroidPackageName, "countTime", "(Ljava/lang/String;)V", "1001_" + sender.access_gold);
                                }

                                //SortID 1234 新初中高
                                sparrowDirector.gameData.currentRommLevel = sender.serveritem["SortID"];
                                lm.log("点击房间列表 进入房间 = "+sparrowDirector.gameData.currentRommLevel);

                                sparrowDirector.tempRoomServerId = curserver["wServerID"];//当前房间ID

                                sparrowDirector.LogonRoom(curserver["wServerPort"],
                                    userInfo.globalUserdData["dwUserID"],
                                    userInfo.GetCurPlayerPassword(),
                                    GetFuuID());

                                layerManager.PopTipLayer(new WaitUILayer("正在入桌，请稍后....", function()
                                {
                                    layerManager.PopTipLayer(new PopAutoTipsUILayer("连接服务器超时，请稍后重试！", DefultPopTipsTime),false);

                                },this));

                            },function(errinfo,bless)
                            {
                                // 查找失败，如果是因为金币不足，给出引导购买金币。
                                lm.log("查找失败，如果是因为金币不足，给出引导购买金币。= "+errinfo);
                                if(bless)
                                {
                                    lm.log("查找失败，如果是因为金币不足，给出引导购买金币。= 1");
                                    var roomId = sender.serveritem["SortID"];

                                    //判断救济金可领取，且是新手场弹出领取救济金窗口
                                    if(roomId == 1 && UserInfo.dwReliefCountOfDayMax - UserInfo.dwReliefCountOfDay > 0)
                                    {
                                        lm.log("查找失败，如果是因为金币不足，给出引导购买金币。= 2");
                                        var pop = new ReliefPop(this);
                                        pop.addToNode(cc.director.getRunningScene());

                                    }
                                    else
                                    {
                                        lm.log("查找失败，如果是因为金币不足，给出引导购买金币。= 3");
                                        if(UserInfo.cbPay != 0) //非首冲
                                        {
                                            var pop = new QuickPop(this, sender.serveritem["SortID"]);
                                            pop.addToNode(cc.director.getRunningScene());
                                        }
                                        else
                                        {
                                            var pop = new FisrtPayPop(this);
                                            pop.addToNode(cc.director.getRunningScene());
                                        }
                                    }

                                }else
                                {
                                    lm.log("查找失败，如果是因为金币不足，给出引导购买金币。= 4");
                                    var pop = new ConfirmPop(this, Poptype.ok, errinfo);//ok
                                    pop.addToNode(cc.director.getRunningScene());
                                }

                            },this);

                    }
                }, this);
            }

            if(itemindex == 3)
                pageindex++;
        }

        // 计算需要隐藏的item的数量
        var needhideitemcount = this.pageview_room.getChildrenCount() * 4 - length;
        // lm.log("refreshViewByData needhideitemcount: " + needhideitemcount);
        // 隐藏剩余的item项
        for(var i = 0;i<needhideitemcount;i++)
        {
            itemindex++;

            // 从上面显示的最后索引开始隐藏
            var pageitem = this.pageview_room.getPage(this.pageview_room.getChildrenCount() -1);

            //lm.log("refreshViewByData pageitem : " + pageitem);
            if (pageitem === null)
                continue;

            // lm.log("refreshViewByData itemindex : " + itemindex);
            var subPageitem = ccui.helper.seekWidgetByName(pageitem, "panel_item_" + itemindex);
            if(subPageitem === null)
                continue;

            subPageitem.setVisible(false);
        }

    },

    //显示比赛场界面
    ShowMatchViewEx: function()
    {
        //roomdata = [{
        //    "matchname": "时限排名赛",
        //    "firstreward": "冠名名称展示",
        //    "signcondition": "参赛条件规则",
        //    "starttime": "2015-7-30 15:50:12",
        //    "endtime" : "2015-7-30 16:50:12",
        //    "matchid": 1,
        //    "roundid": 10086,
        //    "signtime": "2015-7-30 15:40:12"
        //}];

        //获取比赛场数据，然后根据开始时间排序排序
        matchdata = roomManager.GetMatchRoomData();
        if (matchdata == undefined || matchdata == null )
        {
            lm.log("没有GetMatchRoomData" + matchdata);
            return ;
        }
        matchdata.sort(function(a, b){
            if(a["starttime"] > b["starttime"])
            {
                return true;
            }
            else
            {
                return false;
            }
        })


        length = matchdata.length;
        //若无比赛，则提示
        if(length == 0)
        {
            var notic = cc.LabelTTF.create("当前暂未有合适的比赛，敬请期待！", "Arial", 36);
            var size = cc.director.getWinSize();
            notic.setColor(cc.color.WHITE);
            //cc.director.getRunningScene().addChild(notic, 100);
            this.parentView.addChild(notic, 8);
            notic.setPosition(cc.p(size.width / 2, size.height / 2));
        }

        //获取话费赛、金币赛数量--然后设置滚动区域
        var huafeiCount = 0;
        var goldCount = 0;
        for(var i = 0; i < length; i++)
        {
            if(matchdata[i]["matchType"] == MatchType.TimeLimitedMatch)  //时限赛--(暂时把时限赛当成话费赛处理)
            {
                huafeiCount = huafeiCount + 1;
            }
            else if(matchdata[i]["matchType"] == MatchType.RoundLimitedMatch)   //轮回赛--(暂时把轮回赛当成金币赛处理)
            {
                goldCount = goldCount + 1;
            }
        }
        lm.log("yyp_ShowMatchViewEx : 比赛房间数据长度为" + length + " "+huafeiCount+ " " + goldCount);

        this.scrollView_room_huafei.setInnerContainerSize(cc.size(this.scrollView_room_huafei.getInnerContainerSize().width, 115 *huafeiCount));
        this.scrollView_room_gold.setInnerContainerSize(cc.size(this.scrollView_room_gold.getInnerContainerSize().width, 115 *goldCount));

        //加载文件--设置数据
        var huafeiIndex = 0;
        var goldIndex = 0;
        for(var i = 0; i < length; i++)
        {
            var scrollItem = ccs.load("res/landlord/cocosOut/RoomScrollItem.json").node;
            if (scrollItem !== null)
            {
                scrollItem.setTag(matchdata[i]["matchid"]);

                if(matchdata[i]["matchType"] == MatchType.TimeLimitedMatch)  //时限赛--(暂时把时限赛当成话费赛处理)
                {
                    //scrollItem.setPositionX(0);
                    //scrollItem.setPositionX(this.scrollView_room_huafei.getInnerContainerSize().width/2);
                    scrollItem.setPositionY(-115 * huafeiIndex + this.scrollView_room_huafei.getInnerContainerSize().height - scrollItem.getContentSize().height - 15);
                    this.scrollView_room_huafei.addChild(scrollItem);
                    huafeiIndex = huafeiIndex + 1;

                    var image_item_title = ccui.helper.seekWidgetByName(scrollItem, "image_item_title");
                    image_item_title.loadTexture("image_item_title_huafei.png", 1);
                }
                else if(matchdata[i]["matchType"] == MatchType.RoundLimitedMatch)   //轮回赛--(暂时把轮回赛当成金币赛处理)
                {
                    //scrollItem.setPositionX(this.scrollView_room_gold.getInnerContainerSize().width/2);
                    scrollItem.setPositionY(-115 * goldIndex + this.scrollView_room_gold.getInnerContainerSize().height - scrollItem.getContentSize().height - 15);
                    this.scrollView_room_gold.addChild(scrollItem);
                    goldIndex = goldIndex + 1;

                    var image_item_title = ccui.helper.seekWidgetByName(scrollItem, "image_item_title");
                    image_item_title.loadTexture("image_item_title_gold.png", 1);
                }

                //显示比赛信息的按钮
                var btn_item = ccui.helper.seekWidgetByName(scrollItem, "btn_item");
                btn_item.setSwallowTouches(false);
                btn_item.index = i;

                //报名按钮
                var btn_signUp = ccui.helper.seekWidgetByName(scrollItem, "btn_signUp");              //报名按钮
                btn_signUp.setSwallowTouches(false);

                btn_item.matchID = matchdata[i]["matchid"];                                           //设置比赛id
                btn_item.startType = matchdata[i]["startType"];                                       //设置比赛类型
                btn_signUp.matchID = matchdata[i]["matchid"];
                btn_signUp.startType = matchdata[i]["startType"];

                var text_matchName = ccui.helper.seekWidgetByName(scrollItem, "text_matchName");      //设置比赛名称
                text_matchName.setString(matchdata[i]["matchname"]);
                //text_matchName.setString(matchdata[i]["matchid"] + " " + matchdata[i]["matchname"]);


                var text_firstreward = ccui.helper.seekWidgetByName(scrollItem, "text_firstreward");  //设置冠军奖励
                text_firstreward.setString(matchdata[i]["firstreward"]);

                this.UpdataMatchInfo(matchdata[i]["matchid"]);

                //处理具体比赛流程
                btn_item.addTouchEventListener(function (sender, type)
                {
                    if (type == ccui.Widget.TOUCH_ENDED)
                    {
                        lm.log("yyp弹出预览界面1" + sender.matchType);
                        //判断玩家是否已报名该比赛
                        //hanhu #将报名比赛的判断移至MatchMsgManager 2015/12/01
                        //matchMsgManager.MatchSignIn(sender.matchID);
                        //lm.log("MatchID = " + sender.matchID);
                        if(sender.startType == MatchStartType.StartByTime)  //时间赛
                        {
                            lm.log("yyp弹出预览界面");
                            matchMsgManager.showMatchAppointmentInfoEx(sender.matchID, false);
                        }
                        else if(sender.startType == MatchStartType.StartByPlayer)   //人满赛
                        {
                            lm.log("yyp人满开赛直接报名");
                            matchMsgManager.MatchSignInEx(sender.matchID, false);
                        }

                    }
                }, this);

                btn_signUp.addTouchEventListener(function (sender, type)
                {
                    if (type == ccui.Widget.TOUCH_ENDED)
                    {
                        lm.log("yyp弹出预览界面1" + sender.matchType);
                        //判断玩家是否已报名该比赛
                        //hanhu #将报名比赛的判断移至MatchMsgManager 2015/12/01
                        //matchMsgManager.MatchSignIn(sender.matchID);
                        //lm.log("MatchID = " + sender.matchID);
                        if(sender.startType == MatchStartType.StartByTime)  //时间赛
                        {
                            lm.log("yyp弹出预览界面");
                            matchMsgManager.showMatchAppointmentInfoEx(sender.matchID, true);
                        }
                        else if(sender.startType == MatchStartType.StartByPlayer)   //人满赛
                        {
                            lm.log("yyp人满开赛直接报名");
                            matchMsgManager.MatchSignInEx(sender.matchID, true);
                        }

                    }
                }, this);


            }
        }


        this.schedule(this.updateItem);
    },

    updateItem:function()
    {
        matchdata = roomManager.GetMatchRoomData();
        if (matchdata == undefined || matchdata == null )
        {
            lm.log("没有GetMatchRoomData" + matchdata);
            return ;
        }

        for(var i = 0; i < matchdata.length; i++)
        {
            this.UpdataMatchInfo(matchdata[i]["matchid"]);
        }
    },

    ShowMatchView: function()
    {
        roomdata = roomManager.GetMatchRoomData();
        //hanhu #对比赛按时间进行排序 2015/09/17
        roomdata.sort(function(a, b){
            if(a["starttime"] > b["starttime"])
            {
                return true;
            }
            else
            {
                return false;
            }
        })

        //roomdata = [{
        //    "matchname": "时限排名赛",
        //    "firstreward": "冠名名称展示",
        //    "signcondition": "参赛条件规则",
        //    "starttime": "2015-7-30 15:50:12",
        //    "endtime" : "2015-7-30 16:50:12",
        //    "matchid": 1,
        //    "roundid": 10086,
        //    "signtime": "2015-7-30 15:40:12"
        //}];
        //roomManager.SetMatchRoomData(roomdata);
        if (roomdata == undefined || roomdata == null )
        {
            lm.log("没有GetMatchRoomData" + roomdata);
            return ;
        }
        length = roomdata.length;
        lm.log("yyp_ShowMatchView : 比赛房间信息的长度为" + length);
        //若无比赛，则提示
        if(length == 0)
        {
            var notic = cc.LabelTTF.create("当前暂未有合适的比赛，敬请期待！", "Arial", 36);
            var size = cc.director.getWinSize();
            notic.setColor(cc.color.WHITE);
            //cc.director.getRunningScene().addChild(notic, 100);
            this.parentView.addChild(notic, 8);
            notic.setPosition(cc.p(size.width / 2, size.height / 2));
        }

        lm.log("refreshViewByData ROOM_TYPE_MATCH");
        //加载文件
        for(var pageindex =0;pageindex<length/4;pageindex++)
        {
            var pageitem = ccs.load("res/cocosOut/RoomPageItem.json").node;
            if (pageitem !== null)
            {
                //lm.log("pageIndex = " + pageindex);
                this.pageview_room.addPage(pageitem);
            }
        }
        //hanhu #判断是否需要添加滑动提示 2015/09/15
        if(length / 4 > 1)
        {
            this.createSilderArrow(this.pageview_room);
        }

        var pageindex = 0,itemindex = 0;
        for (var i=0;i<length;i++) {

            // 设置item 显示数据
            itemindex = i % 4;
            var pageitem = this.pageview_room.getPage(pageindex);

            if (pageitem !== null)
            {

                //hanhu #设置滚动间距 2015/09/21
                this.pageview_room.setCustomScrollThreshold(50);

                //lm.log("初始化按钮 = " + itemindex);
                var btn_item_bk = ccui.helper.seekWidgetByName(pageitem, "btn_item_bk_" + itemindex);
                btn_item_bk.setPressedActionEnabled(true);
                btn_item_bk.itemindex = itemindex;
                //hanhu #下传点击事件 2015/09/15
                btn_item_bk.setSwallowTouches(false);

                //设置比赛id
                //lm.log("设置比赛MAtchID 为" + roomdata[i]["matchid"]);
                btn_item_bk.matchID = roomdata[i]["matchid"];
                //hanhu #设置比赛类型 2015/12/28
                btn_item_bk.matchType = roomdata[i]["startType"];

                var text_item_name = ccui.helper.seekWidgetByName(pageitem, "text_item_name_" + itemindex);
                lm.log("roomdata = " + JSON.stringify(roomdata[i]));
                text_item_name.setString(roomdata[i]["matchname"]);
                text_item_name.setFontSize(22);

                var text_item_slogan = ccui.helper.seekWidgetByName(pageitem, "text_item_slogan_" + itemindex);
                text_item_slogan.setString(roomdata[i]["firstreward"]);
                text_item_slogan.setFontSize(20);
                //hanhu #调整最高奖励位置
                text_item_slogan.y = text_item_slogan.y - 15;
                var desLabel = ccui.Text.create("最高奖励:", "", 15);
                desLabel.setAnchorPoint(cc.p(0, 0.5));
                desLabel.setColor(cc.color(255, 255, 11));
                btn_item_bk.addChild(desLabel, 999, RewardDesTag);
                var pos = text_item_slogan.getPosition();
                desLabel.setPosition(cc.p(pos.x - text_item_slogan.getContentSize().width / 2, pos.y + text_item_slogan.getContentSize().height / 2 + 8));


                var ruleexplain = ccui.helper.seekWidgetByName(pageitem, "text_item_status_" + itemindex);
                //lm.log("signCondition = " + roomdata[i]["signcondition"]);
                ruleexplain.setString(roomdata[i]["signcondition"]);
                ruleexplain.setFontSize(14);
                ruleexplain.setColor(cc.color(255, 255, 11));

                var timeexplain = ccui.helper.seekWidgetByName(pageitem, "text_item_access_" + itemindex);
                var timeData = roomdata[i]["starttime"];
                timeData = timeData.replace(/-/g, "/")
                var StartDate = new Date(timeData);
                timeData = timeData.replace(/-/g, "/").substring(5, 16);

                //timeexplain.setString(timeData["year"] + "/" + timeData["month"] + "/" + timeData["day"] + " " + hour + ":" + minute + ":" + second + " 开赛");
                if(roomdata[i]["startType"] == MatchStartType.StartByTime)
                {
                    timeexplain.setString(timeData + " 开赛");
                }
                else if(roomdata[i]["startType"] == MatchStartType.StartByPlayer)
                {
                    timeexplain.setString("满" + roomdata[i]["startCount"] + "人开赛");
                }

                timeexplain.setFontSize(18);
                var pos  = timeexplain.getPosition();
                timeexplain.setPosition(cc.p(pos.x, pos.y + 5));

                var text_item_needgold = ccui.helper.seekWidgetByName(pageitem, "text_item_needgold_" + itemindex);
                //可报名标签
                var signLabel = cc.LabelTTF.create("", "Arial", 15);
                signLabel.setColor(cc.color(255, 255, 11));
                btn_item_bk.addChild(signLabel, 1, SignStatusTag);
                signLabel.setPosition(cc.p(btn_item_bk.getContentSize().width * 0.8 - 8, btn_item_bk.getContentSize().height * 0.5 + 2));
                //报名人数
                var signCountLabel = cc.LabelTTF.create("", "Arial", 16);
                signCountLabel.setColor(cc.color(255, 255, 11));
                btn_item_bk.addChild(signCountLabel, 1, SignCountTag);
                signCountLabel.setPosition(cc.p(btn_item_bk.getContentSize().width * 0.8, btn_item_bk.getContentSize().height * 0.5));

                //显示是否已报名
                var matchStatus = matchMsgManager.getMatchStatus(roomdata[i]["matchid"]);
                if(matchMsgManager.GetMatchSignInStatus(roomdata[i]["matchid"]))
                {
                    //lm.log("显示已报名标签");
                    if(matchStatus == MatchSignStatus.Appointed)//hanhu #判断是否为预约状态 2015/12/28
                    {
                        text_item_slogan.setString("已预约");
                    }
                    else
                    {
                        text_item_slogan.setString("已报名");
                    }

                    desLabel.setString("");
                    //显示报名人数
                    var signCount = matchMsgManager.GetValueFromArray(MatchInfoArray, "MatchID", roomdata[i]["matchid"], "SignCount");
                    signCountLabel.setString("报名人数" + "[" + signCount + "]");
                }
                else if(roomdata[i]["startType"] == MatchStartType.StartByPlayer)
                {
                    //显示报名人数
                    var signCount = matchMsgManager.GetValueFromArray(MatchInfoArray, "MatchID", roomdata[i]["matchid"], "SignCount");
                    lm.log("报名人数为 : " + signCount);
                    signCountLabel.setString("报名人数" + "[" + signCount + "]");
                }
                else if(roomdata[i]["startType"] == MatchStartType.StartByTime)
                {
                    //判断是否可报名
                    var SignTime = roomdata[i]["signtime"]
                    SignTime = SignTime.replace(/-/g,"/");
                    var SignDate = new Date(SignTime);
                    var NowTime = new Date(new Date().getTime() + DataUtil.GetServerInterval());
                    //lm.log("判断是否可报名 NowTime:" + NowTime.toTimeString() + " SignDtate: " + SignDate.toTimeString() + " BeginDate :" + StartDate.toTimeString());
                    if(NowTime >= SignDate && NowTime <= StartDate)
                    {
                        signLabel.setString("可报名");
                    }
                    else if(NowTime < SignDate)
                    {

                        //var Totalsigntime = (StartDate.getHours() - SignDate.getHours()) * 60 + StartDate.getMinutes() - SignDate.getMinutes();
                        //signLabel.setString("开赛前" + Totalsigntime + "分钟报名");
                        signLabel.setString("可预约");
                    }
                    else
                    {
                        signLabel.setString("比赛正进行");
                        signCountLabel.setString("");
                    }
                }

                //处理具体比赛流程
                //btn_item_bk.setEnabled(true);
                //lm.log("初始化比赛按钮 = " + i);
                btn_item_bk.setTouchEnabled(true);
                btn_item_bk.addTouchEventListener(function (sender, type)
                {
                    if (type == ccui.Widget.TOUCH_ENDED)
                    {
                        //判断玩家是否已报名该比赛
                        //hanhu #将报名比赛的判断移至MatchMsgManager 2015/12/01
                        //matchMsgManager.MatchSignIn(sender.matchID);
                        //lm.log("MatchID = " + sender.matchID);
                        if(sender.matchType == MatchStartType.StartByTime)
                        {
                            lm.log("弹出预览界面");
                            matchMsgManager.showMatchAppointmentInfo(sender.matchID); //hanhu #比赛报名采用预约模式 2015/12/28
                        }
                        else if(sender.matchType == MatchStartType.StartByPlayer)
                        {
                            lm.log("人满开赛直接报名");
                            matchMsgManager.MatchSignIn(sender.matchID);
                        }

                    }
                }, this);

            }

            if(itemindex == 3)
                pageindex++;
        }

        // 计算需要隐藏的item的数量
        var needhideitemcount = this.pageview_room.getPages().length * 4 - length;
        //lm.log(this.pageview_room.getPages().length);
        lm.log("refreshViewByData needhideitemcount: " + needhideitemcount);
        // 隐藏剩余的item项
        for(var i = 0;i<needhideitemcount;i++)
        {
            itemindex++;

            // 从上面显示的最后索引开始隐藏
            var pageitem = this.pageview_room.getPage(this.pageview_room.getPages().length -1);

            //lm.log("refreshViewByData pageitem : " + pageitem);
            if (pageitem === null)
                continue;

            // lm.log("refreshViewByData itemindex : " + itemindex);
            var panel_item = ccui.helper.seekWidgetByName(pageitem, "panel_item_" + itemindex);
            if(panel_item === null)
                continue;

            //lm.log("隐藏标签");
            panel_item.setVisible(false);
        }

    },

    GetMatchPage : function(matchID)
    {
        return null;
        var roomdata = roomManager.GetMatchRoomData();
        //lm.log("当前的比赛数量为: " + roomdata.length);
        var pageindex = 0;
        var itemindex = 0;
        for(var i =0; i < roomdata.length; i++)
        {
            itemindex = i % 4;
            var pageitem = this.pageview_room.getPage(pageindex);
            var btn_item_bk = ccui.helper.seekWidgetByName(pageitem, "btn_item_bk_" + itemindex);
            var matchIDOfItem = btn_item_bk.matchID;
            //lm.log("比较 " + matchID + " ?= " + matchIDOfItem);
            if(matchIDOfItem == matchID)
            {
                return [pageitem, itemindex];
            }
            if(itemindex == 3 )
            {
                pageindex++;
            }
        }
        lm.log("未找到该比赛");
        return null;
    },

    RemoveEndMatch: function(MatchID, RoundID)
    {
        //lm.log("比赛结束，移出的比赛ID为" + MatchID);
        var data = this.GetMatchPage(MatchID);
        var matchAccess = ccui.helper.seekWidgetByName(data[0], "text_item_access_" + data[1]);
        matchAccess.setString("比赛已结束");
    },

    //获取一个时间的详细信息
    getTimeInfo: function(timeData)
    {
        var date;
        if(timeData == "" || timeData == undefined || timeData.length == 0)
        {
            date = new Date(new Date().getTime() + DataUtil.GetServerInterval());
        }
        else
        {
            date = new Date(timeData);
        }
        var week = date.getDay();


        var timeInfo = new Array();
        timeInfo["year"] = date.getYear();       //年
        timeInfo["month"] = date.getMonth();     //月
        timeInfo["date"] = date.getDate();       //日
        timeInfo["hour"] = date.getHours();      //小时数
        timeInfo["minute"] = date.getMinutes();  //分钟数
        timeInfo["second"] = date.getSeconds();  //秒数
        timeInfo["time"] = date.getTime();   //秒数(从1970.1.1开始的毫秒数)
        timeInfo["locale"] = date.toLocaleTimeString();  //总时间字符串
        //timeInfo["locale"] = timeInfo["hour"] + ":" + timeInfo["minute"];  //总时间字符串
        timeInfo["week"] = week;                 //星期几
        if(timeInfo["week"] == 0)
        {
            timeInfo["week"] = 7;
        }

        lm.log("比赛结束，移出的比赛ID为" + timeInfo["weekNum"]);

        return timeInfo;
    },

    getScrollItem: function(MatchID)
    {
        var matchType = matchMsgManager.GetValueFromArray(MatchInfoArray, "MatchID", MatchID, "MatchType");

        var scrollItem = null;
        if(matchType == MatchType.TimeLimitedMatch)  //时限赛--(暂时把时限赛当成话费赛处理)
        {
            scrollItem = this.scrollView_room_huafei.getChildByTag(MatchID);
        }
        else if(matchType == MatchType.RoundLimitedMatch)   //轮回赛--(暂时把轮回赛当成金币赛处理)
        {
            scrollItem = this.scrollView_room_gold.getChildByTag(MatchID);
        }

        return scrollItem;
    },

    //更新比赛信息
    UpdataMatchInfo: function(MatchID)
    {
        //获取比赛数据
        var matchdata = {};
        var roomData = roomManager.GetMatchRoomData();
        for(var k in roomData)
        {
            if (roomData[k]["matchid"] == MatchID)
            {
                matchdata = roomData[k];
                break;
            }
        }

        //获取显示比赛信息的item
        var scrollItem = this.getScrollItem(MatchID);

        lm.log("yyp : " + scrollItem + " " + matchdata);
        if(scrollItem == null || matchdata == null || matchdata.length == 0)
        {
            return;
        }



        lm.log("yyp UpdataMatchInfo : " + MatchID + " " + matchdata["starttime"]);

        //控件
        var layer_countdown = ccui.helper.seekWidgetByName(scrollItem, "layer_countdown");  //倒计时
        var layer_time = ccui.helper.seekWidgetByName(scrollItem, "layer_time");            //时间
        var layer_people = ccui.helper.seekWidgetByName(scrollItem, "layer_people");        //人满赛
        var btn_signUp = ccui.helper.seekWidgetByName(scrollItem, "btn_signUp");            //报名按钮
        var text_peopleCount = ccui.helper.seekWidgetByName(scrollItem, "text_peopleCount");//报名人数
        var text_signUpEx = ccui.helper.seekWidgetByName(scrollItem, "text_signUpEx");          //报名按钮上的文字标签


        //实时数据
        var signCount = matchMsgManager.GetValueFromArray(MatchInfoArray, "MatchID", MatchID, "SignCount"); //报名人数

        //显示是否已报名
        if (matchdata["startType"] == MatchStartType.StartByTime)  //时间赛
        {
            layer_countdown.setVisible(false);
            layer_time.setVisible(true);
            layer_people.setVisible(false);

            //报名人数
            text_peopleCount.setString("报名人数:" + signCount);

            var matchStatus = matchMsgManager.getMatchStatus(matchdata["matchid"]);
            lm.log("yyp UpdataMatchInfo : " + matchStatus);

            if (matchStatus == MatchSignStatus.AppointmentAllowed)//可预约
            {
                //text_signUp.setString("预约");
                text_signUpEx.loadTexture("text_status_1.png", 1);

                btn_signUp.loadTextures("btn_signUp_normal.png", "btn_signUp_normal.png", "", ccui.Widget.PLIST_TEXTURE);
                btn_signUp.setTouchEnabled(true);
            }
            else if (matchStatus == MatchSignStatus.Appointed)//已预约
            {
                //text_signUp.setString("已预约");
                text_signUpEx.loadTexture("text_status_2.png", 1);

                btn_signUp.loadTextures("btn_signUp_nottime.png", "btn_signUp_nottime.png", "", ccui.Widget.PLIST_TEXTURE);
                btn_signUp.setTouchEnabled(true);
            }
            else if (matchStatus == MatchSignStatus.SignAllowed)//可报名
            {
                //text_signUp.setString("报名");
                text_signUpEx.loadTexture("text_status_3.png", 1);

                btn_signUp.loadTextures("btn_signUp_normal.png", "btn_signUp_normal.png", "", ccui.Widget.PLIST_TEXTURE);
                btn_signUp.setTouchEnabled(true);
            }
            else if (matchStatus == MatchSignStatus.Signed)//已报名
            {
                //text_signUp.setString("已报名");
                text_signUpEx.loadTexture("text_status_4.png", 1);

                btn_signUp.loadTextures("btn_signUp_nottime.png", "btn_signUp_nottime.png", "", ccui.Widget.PLIST_TEXTURE);
                btn_signUp.setTouchEnabled(true);

            }
            else if (matchStatus == MatchSignStatus.Start)//比赛已开始
            {
                //var text_time = ccui.helper.seekWidgetByName(layer_time, "text_time");
                //text_time.setString("已开赛");

                //text_signUp.setString("已开赛");
                text_signUpEx.loadTexture("text_status_5.png", 1);

                btn_signUp.loadTextures("btn_signUp_overdue.png", "btn_signUp_overdue.png", "", ccui.Widget.PLIST_TEXTURE);
                btn_signUp.setTouchEnabled(false);

                //报名人数隐藏
                text_peopleCount.setVisible(false);

            }

            if (matchStatus == MatchSignStatus.Start)//比赛已开始
            {
                btn_signUp.loadTextures("btn_signUp_overdue.png", "btn_signUp_overdue.png", "", ccui.Widget.PLIST_TEXTURE);
                var text_time = ccui.helper.seekWidgetByName(layer_time, "text_time");
                text_time.setString("已开赛");
            }
            else
            {
                //现在时间
                var nowTimeInfo = this.getTimeInfo();

                //开始时间
                var startTimeData = matchdata["starttime"];
                startTimeData = startTimeData.replace(/-/g, "/");
                var startTimeInfo = this.getTimeInfo(startTimeData);

                //报名时间
                var signTimeData = matchdata["signtime"];
                signTimeData = signTimeData.replace(/-/g, "/");
                var signTimeInfo = this.getTimeInfo(signTimeData);

                //是同一天
                if (nowTimeInfo.year == startTimeInfo.year &&
                    nowTimeInfo.month == startTimeInfo.month &&
                    nowTimeInfo.date == startTimeInfo.date) {

                    //开赛20分钟之内
                    var secondsDiff = (startTimeInfo.time - nowTimeInfo.time) / (1000 * 60);
                    if (secondsDiff <= 20) {
                        layer_countdown.setVisible(true);
                        layer_time.setVisible(false);

                        var text_time_minute = ccui.helper.seekWidgetByName(layer_countdown, "text_time_minute");
                        var text_time_second = ccui.helper.seekWidgetByName(layer_countdown, "text_time_second");

                        var minuteDiff = startTimeInfo.minute - nowTimeInfo.minute;
                        var secondsDiff = startTimeInfo.second - nowTimeInfo.second;

                        if(startTimeInfo.hour > nowTimeInfo.hour)
                        {
                            minuteDiff = minuteDiff + 60;
                        }

                        if (secondsDiff < 0) {
                            if(minuteDiff >= 1)
                            {
                                minuteDiff = minuteDiff - 1;
                                secondsDiff = 60 + startTimeInfo.second - nowTimeInfo.second;
                            }
                            else
                            {
                                minuteDiff = 0;
                                secondsDiff = 0;
                            }
                        }

                        lm.log("yyp time " + minuteDiff + " " + secondsDiff);

                        if(minuteDiff<10)
                        {
                            text_time_minute.setString("0" + minuteDiff);
                        }
                        else
                        {
                            text_time_minute.setString("" + minuteDiff);
                        }
                        if(secondsDiff<10)
                        {
                            text_time_second.setString("0" + secondsDiff);
                        }
                        else
                        {
                            text_time_second.setString("" + secondsDiff);
                        }
                    }
                    else //20分钟以外
                    {
                        var text_time = ccui.helper.seekWidgetByName(layer_time, "text_time");
                        text_time.setString("今日 " + startTimeInfo.locale);
                    }
                }
                else    //判断星期数
                {
                    if (startTimeInfo.date - nowTimeInfo.date == startTimeInfo.week - nowTimeInfo.week)   //在同一周
                    {
                        var text_time = ccui.helper.seekWidgetByName(layer_time, "text_time");
                        text_time.setString("本周 " + nowTimeInfo.week + " " + startTimeInfo.locale);
                    }
                    else    //不在同一周
                    {
                        var text_time = ccui.helper.seekWidgetByName(layer_time, "text_time");
                        text_time.setString("下周 " + startTimeInfo.week + " " + startTimeInfo.locale);
                        lm.log("下周 " + startTimeInfo.week + " " + startTimeInfo.locale);
                    }
                }

            }
        }
        else if(matchdata["startType"] == MatchStartType.StartByPlayer)   //人满赛
        {
            layer_countdown.setVisible(false);
            layer_time.setVisible(false);
            layer_people.setVisible(true);

            var text_people = ccui.helper.seekWidgetByName(layer_people, "text_people");
            text_people.setString("满" + matchdata["startCount"] + "人开赛");

            //报名人数
            text_peopleCount.setString("报名人数:" + signCount);

            var flag = matchMsgManager.GetMatchSignInStatus(MatchID);
            if(flag)    //已报名
            {
                //text_signUp.setString("已报名");
                text_signUpEx.loadTexture("text_status_4.png", 1);
                btn_signUp.loadTextures("btn_signUp_nottime.png", "btn_signUp_nottime.png", "", ccui.Widget.PLIST_TEXTURE);
            }
            else
            {
                //text_signUp.setString("报名");
                text_signUpEx.loadTexture("text_status_3.png", 1);
                btn_signUp.loadTextures("btn_signUp_normal.png", "btn_signUp_normal.png", "", ccui.Widget.PLIST_TEXTURE);
            }
        }


/*
        var data = this.GetMatchPage(MatchID);
        var status = ccui.helper.seekWidgetByName(data[0], "text_item_access_" + data[1]);
        var signLabel = ccui.helper.seekWidgetByName(data[0], "btn_item_bk_" + data[1]).getChildByTag(SignStatusTag);
        var RoundID = matchMsgManager.GetValueFromArray(MatchInfoArray, "MatchID", MatchID, "RoundID");
        var roomdata = roomManager.GetMatchRoomData();
        for(var i in roomdata)
        {
            if(roomdata[i]["matchid"] == MatchID && roomdata[i]["roundid"] == RoundID)
            {
                var signCountLabel = ccui.helper.seekWidgetByName(data[0], "btn_item_bk_" + data[1]).getChildByTag(SignCountTag)
                var signCount = matchMsgManager.GetValueFromArray(MatchInfoArray, "MatchID", MatchID, "SignCount");
                //hanhu #设置报名状态 2015/12/22
                var text_item_slogan = ccui.helper.seekWidgetByName(data[0], "text_item_slogan_" + data[1]);
                var SignData = matchMsgManager.GetValueFromArray(MatchSignInArray, "MatchID", MatchID, "RoundID");
                if(SignData == null)
                {
                    text_item_slogan.setString(roomdata[i]["firstreward"]);
                }

                if(roomdata[i]["startType"] == MatchStartType.StartByTime)
                {
                    var timeData = roomdata[i]["starttime"];
                    timeData = timeData.replace(/-/g, "/");
                    var StartData = new Date(timeData);
                    timeData = timeData.replace(/-/g, "/").substring(5, 16);
                    status.setString(timeData + " 开赛");

                    var SignTime = roomdata[i]["signtime"]
                    SignTime = SignTime.replace(/-/g,"/");
                    var SignDate = new Date(SignTime);
                    var NowTime = new Date(new Date().getTime() + DataUtil.GetServerInterval());
                    //lm.log("NowTime = " + NowTime + " SignTime = " + SignDate + " StartData = " + StartData);
                    //lm.log("SignedRound = " + matchMsgManager.GetValueFromArray(MatchSignInArray, "MatchID", MatchID, "RoundID") + " CurrentRound = " + RoundID);

                    if(NowTime >= SignDate && NowTime <= StartData && matchMsgManager.GetValueFromArray(MatchSignInArray, "MatchID", MatchID, "RoundID") != RoundID)
                    {
                        signLabel.setString("可报名");
                        signCountLabel.setString("");
                    }
                    else if(NowTime > StartData)
                    {
                        signLabel.setString("比赛正进行");
                        signCountLabel.setString("");
                    }
                    else if(matchMsgManager.GetValueFromArray(MatchSignInArray, "MatchID", MatchID, "RoundID") != RoundID)
                    {
                        //var Totalsigntime = (StartData.getHours() - SignDate.getHours()) * 60 + StartData.getMinutes() - SignDate.getMinutes();
                        //signLabel.setString("开赛前" + Totalsigntime + "分钟报名");
                        signLabel.setString("可预约");
                        signCountLabel.setString("");
                    }
                    //判断是否显示报名人数
                    var SignRound = matchMsgManager.GetValueFromArray(MatchSignInArray, "MatchID", MatchID, "RoundID");
                    if(SignRound == RoundID && NowTime < StartData) //hanhu #比赛开始之前才显示报名人数 2015/11/12
                    {
                        signCountLabel.setString("报名人数" + "[" + signCount + "]");
                    }
                }
                else if(roomdata[i]["startType"] == MatchStartType.StartByPlayer)
                {
                    status.setString("满" + roomdata[i]["startCount"] + "人开赛");
                    signCountLabel.setString("报名人数" + "[" + signCount + "]");
                }
                break;
            }
        }
        */
    },

    //更新比赛item 状态
    AddMatchTag : function(MatchID, type)
    {
        var data = this.GetMatchPage(MatchID);
        //lm.log("隐藏报名状态标签");
        var back = ccui.helper.seekWidgetByName(data[0], "btn_item_bk_" + data[1]);
        var Signlabel = back.getChildByTag(SignStatusTag)
        Signlabel.setString("");
        var rewardDes = back.getChildByTag(RewardDesTag);
        rewardDes.setString("");
        var label = ccui.helper.seekWidgetByName(data[0], "text_item_slogan_" + data[1]);
        if(type == 1)
        {
            label.setString("已报名");
        }
        else if(type == 2)
        {
            label.setString("已预约");
        }
        //显示报名人数
        var signCountLabel = ccui.helper.seekWidgetByName(data[0], "btn_item_bk_" + data[1]).getChildByTag(SignCountTag)
        var signCount = matchMsgManager.GetValueFromArray(MatchInfoArray, "MatchID", MatchID, "SignCount");
        signCountLabel.setString("报名人数" + "[" + signCount + "]");
    },

    ShowStartMatch : function(MatchID)
    {
        var data = this.GetMatchPage(MatchID);
        var matchAccess = ccui.helper.seekWidgetByName(data[0], "text_item_access_" + data[1]);
        matchAccess.setString("比赛已开始");
    },

    createSilderArrow : function(pageView)
    {
        var MoveLeft = cc.MoveBy(0.6, cc.p(-20, 0));
        var MoveRight = cc.MoveBy(0.6, cc.p(20, 0));
        var MoveLeft2 = cc.MoveBy(0.6, cc.p(-20, 0));
        var MoveRight2 = cc.MoveBy(0.6, cc.p(20, 0));
        var action1 =  new cc.Sequence(MoveLeft, MoveRight).repeatForever();
        var action2 =  new cc.Sequence(MoveRight2, MoveLeft2).repeatForever();

        var LeftArrow = ccui.Button.create("Arrow_down.png", "Arrow_down.png", "", ccui.Widget.PLIST_TEXTURE);
        LeftArrow.setRotation(90);
        pageView.addChild(LeftArrow, 99);
        LeftArrow.setPosition(cc.p(pageView.getContentSize().width * 0.1, pageView.getContentSize().height * 0.5));
        LeftArrow.runAction(action1);
        LeftArrow.setVisible(false);

        var RightArrow = ccui.Button.create("Arrow_up.png", "Arrow_up.png", "", ccui.Widget.PLIST_TEXTURE);
        RightArrow.setRotation(90);
        pageView.addChild(RightArrow, 99);
        RightArrow.setPosition(cc.p(pageView.getContentSize().width * 0.9, pageView.getContentSize().height * 0.5));
        RightArrow.runAction(action2);

        //左右箭头注册点击事件
        LeftArrow.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {

                pageView.scrollToPage(pageView.getCurPageIndex() - 1);
                //左端隐藏左按钮,右端显示右按钮
                var currentPage = pageView.getCurPageIndex();
                if(currentPage == 0)
                {
                    LeftArrow.setVisible(false);
                }
                var totalpage = pageView.getPages().length - 1;
                if((currentPage + 1) == totalpage)
                {
                    RightArrow.setVisible(true);
                }
            }

        }, this);

        RightArrow.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                pageView.scrollToPage(pageView.getCurPageIndex() + 1);
                //右端隐藏右按钮，左端显示左按钮
                var currentPage = pageView.getCurPageIndex();
                var totalPage = pageView.getPages().length - 1;
                if(currentPage == totalPage)
                {
                    RightArrow.setVisible(false);
                }
                if(currentPage == 1)
                {
                    LeftArrow.setVisible(true);
                }
            }

        }, this);

        //增加滑动监听
        pageView.addEventListener(function()
        {
            var currentPage = pageView.getCurPageIndex();
            var totalPage = pageView.getPages().length - 1;
            //lm.log("页面翻转,totalPage= "+totalPage);
            if(currentPage == 0) //隐藏左侧箭头
            {
                LeftArrow.setVisible(false);
            }
            if(currentPage == totalPage)//隐藏右侧箭头
            {
                RightArrow.setVisible(false);
            }
            if(currentPage == 1) //显示左侧箭头
            {
                LeftArrow.setVisible(true);
            }
            if(currentPage == (totalPage - 1)) //显示右箭头
            {
                RightArrow.setVisible(true);
            }
        });
    },

    addMatchButton : function(layer, matchID)
    {
        var button = ccui.Button.create("btn_gn_nor.png", "btn_gn_nor.png", "btn_gn_nor.png", ccui.Widget.PLIST_TEXTURE);
        button.setScale9Enabled(true);
        button.setContentSize(200, 70);
        button.setPressedActionEnabled(true);
        button.setTitleText("预约比赛");
        button.setTitleFontSize(30);
        layer.parentView.addChild(button);
        button.setPosition(cc.p(layer.parentView.getContentSize().width / 2, layer.parentView.getContentSize().height * 0.1));
        button.addTouchEventListener(function(sender, type){
            if(type == ccui.Widget.TOUCH_ENDED)
            {
                layer.removeFromParent(true);
                matchMsgManager.MatchSignIn(matchID);
            }
        })
    }


    
});

