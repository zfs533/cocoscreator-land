/**
 * Created by lizhongqiang on 15/5/29.
 */
var PLAZAUILAYER;
var PlazaUILayer = rootUILayer.extend({
    ctor: function () {
        this._super("MailUILayer");
        //this.initPlazaLayer();
        PLAZAUILAYER = this;
        //if (GetDeviceType() == DeviceType.ANDROID && ChannelLabel != "8633") {
        //    UpdataUserExtraData();
        //}
        //delete  by lizhongqiang 2015-11-19 16:20
        //取消登录时发送绑定推广员账号
    },

    onEnter: function () {
        this._super();
        this.initPlazaLayer();
    },

    onEnterTransitionDidFinish: function () {
        this._super();
        this.bottomBtnLayer.Show();
        this.shieldLayer.removeFromParent();
    },

    onExit: function () {
        this._super();
        PLAZAUILAYER = null;
    },

    initPlazaLayer: function () {

        //cc.spriteFrameCache.addSpriteFrames("res/landlord/cocosOut/plaza/plaza.plist");
        //cc.spriteFrameCache.addSpriteFrames("res/landlord/cocosOut/mark/mark.plist");
        //cc.spriteFrameCache.addSpriteFrames("res/landlord/cocosOut/chest/chest.plist");
        //cc.spriteFrameCache.addSpriteFrames("res/landlord/cocosOut/plaza/userInfo/userInfo.plist");
        //cc.spriteFrameCache.addSpriteFrames("res/landlord/cocosOut/general/general.plist");

        var self = this;
        this.parentView = ccs.load("res/landlord/cocosOut/PlazaUILayer.json").node;

        //hanhu #调整大厅UI坐标 2015/08/07
        var offset = (this.parentView.getContentSize().width * winSize.height / 640 - winSize.width) / 2;
        this.parentView.x -= offset;
        this.origin = cc.p((winSize.width - this.parentView.getContentSize().width)/2, (winSize.height - this.parentView.getContentSize().height)/2);

        //this.parentView.setPositionX(GlobleWinSize.width / 2);
        this.addChild(this.parentView);

        this.origin = cc.p((winSize.width - this.parentView.getContentSize().width)/2, (winSize.height - this.parentView.getContentSize().height)/2);

        lm.log("加载UI文件" + this.origin.x  + " " + this.origin.y);

        this.shieldLayer = cc.Layer.create();
        this.shieldLayer.setContentSize(winSize);
        this.shieldLayer.setPosition(0, 0);
        this.addChild(this.shieldLayer, 10000);

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(){return true;},
            onTouchMoved: function(){},
            onTouchEnded: function(){return true;}
        }, this.shieldLayer);



        // 大厅金币按钮
        var btn_plaza_gold = ccui.helper.seekWidgetByName(this.parentView, "btn_plaza_gold");
        btn_plaza_gold.setPressedActionEnabled(true);
        btn_plaza_gold.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {

                var curLayer = new RoomUILayer();
                curLayer.setTag(ClientModuleType.GoldField);
                layerManager.repalceLayer(curLayer);
                curLayer.refreshView(RoomType.ROOM_TYPE_GOLD);
                DataUtil.SetGoToModule(ClientModuleType.Plaza);
                //
                ////先获取金币房间数据，如果是非法的就去服务器拉取
                //var roomdata = roomManager.GetGoldRoomData();
                //if ((roomdata === undefined) ||
                //    (roomdata === null) ||
                //    (roomdata.length === 0)) {
                //
                //    layerManager.PopTipLayer(new WaitUILayer("正在努力加载中...", function () {
                //        layerManager.PopTipLayer(new PopAutoTipsUILayer("连接服务器超时，请稍后重试！", DefultPopTipsTime), false);
                //
                //    }, self));
                //
                //    // 获取金币房间数据成功，立即进入场次列表
                //    webMsgManager.SendGpGoldFiled(function (data) {
                //
                //            roomManager.SetGoldRoomData(data);
                //
                //            var curLayer = new RoomUILayer();
                //            curLayer.setTag(ClientModuleType.GoldField);
                //            layerManager.repalceLayer(curLayer);
                //            curLayer.refreshView(RoomType.ROOM_TYPE_GOLD);
                //            DataUtil.SetGoToModule(ClientModuleType.Plaza);
                //        },
                //        function (errinfo) {
                //        },
                //        this);
                //} else {
                //    var curLayer = new RoomUILayer();
                //    curLayer.setTag(ClientModuleType.GoldField);
                //    layerManager.repalceLayer(curLayer);
                //    curLayer.refreshView(RoomType.ROOM_TYPE_GOLD);
                //    DataUtil.SetGoToModule(ClientModuleType.Plaza);
                //}
            }

        }, this);

        // 大厅癞子按钮
        var btn_plaza_laizi = ccui.helper.seekWidgetByName(this.parentView, "btn_plaza_laizi");
        btn_plaza_laizi.setPressedActionEnabled(true);
        btn_plaza_laizi.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {

                var tag = 1;
                if(tag == 0)//屏蔽癞子场
                {
                    layerManager.PopTipLayer(new PopAutoTipsUILayer("癞子场将在今后的版本推出，敬请期待", DefultPopTipsTime), true);
                }
                else if(tag == 1)//进入癞子场
                {
                    var curLayer = new RoomUILayer();
                    curLayer.setTag(ClientModuleType.GoldField);
                    layerManager.repalceLayer(curLayer);
                    curLayer.refreshView(RoomType.ROOM_TYPE_LAIZI);
                    DataUtil.SetGoToModule(ClientModuleType.Plaza);
                }
            }

        }, this);

        // 大厅欢乐场按钮
        var btn_plaza_happy = ccui.helper.seekWidgetByName(this.parentView, "btn_plaza_happy");
        btn_plaza_happy.setPressedActionEnabled(true);
        btn_plaza_happy.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {


                this.enterDragonGame();
                return;
                var curLayer = new RoomUILayer();
                curLayer.setTag(ClientModuleType.GoldField);
                layerManager.repalceLayer(curLayer);
                curLayer.refreshView(RoomType.ROOM_TYPE_HAPPY);
                DataUtil.SetGoToModule(ClientModuleType.Plaza);
            }

        }, this);




        // 比赛按钮
        var btn_plaza_match = ccui.helper.seekWidgetByName(this.parentView, "btn_plaza_match");
        btn_plaza_match.setPressedActionEnabled(true);
        btn_plaza_match.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {

                layerManager.PopTipLayer(new PopAutoTipsUILayer("暂无比赛，敬请期待", DefultPopTipsTime), true);

                //var curLayer = new RoomUILayer();
                //curLayer.setTag(ClientModuleType.MathField);
                //layerManager.repalceLayer(curLayer);
                //curLayer.refreshView(RoomType.ROOM_TYPE_MATCH);
                //DataUtil.SetGoToModule(ClientModuleType.Plaza);

            }
        }, this);

        // 开始游戏按钮
        var self = this;
        var btn_plaza_startgame;
        var btn_start_game_temp = ccui.helper.seekWidgetByName(this.parentView, "btn_plaza_startgame");
        //hanhu #检测是否进行新手引导 2015/09/29
        var director_flag = cc.sys.localStorage.getItem("director_flag");
        lm.log("director_flag = " + director_flag);
        //if (director_flag != 0) {
        //    btn_plaza_startgame = btn_start_game_temp.clone();
        //    this.addChild(btn_plaza_startgame, 999);
        //    btn_plaza_startgame.setPosition(cc.p(winSize.width / 2, this.convertToNodeSpace(btn_start_game_temp.getPosition()).y));
        //    btn_start_game_temp.setVisible(false);
        //    btn_start_game_temp.setTouchEnabled(false);
        //
        //    this.showNewPlayerDirection(btn_plaza_startgame);
        //    cc.sys.localStorage.setItem("director_flag", 1);
        //}
        //else
        {
            btn_plaza_startgame = btn_start_game_temp;
        }
        btn_plaza_startgame.setTouchEnabled(true);
        btn_plaza_startgame.setPressedActionEnabled(true);
        btn_plaza_startgame.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                this.plaza_quick_startgame();
            }
        }, this);


        if(userInfo.isNewPlayer == 0)
        {
            if(roomManager.getNewPlayerData() === undefined || roomManager.getNewPlayerData() === null)
            {
                var chestUILayer = new ChestUILayer(this);
                this.addChild(chestUILayer,50000);
            }
        }
        else
        {
            var lastHistoryData = userInfo.GetLastLocalData(plazaMsgManager.address);
            if(lastHistoryData["autoMark"])
            {
                layerManager.AutoPopMarkUILayer();
            }
        }

        //首冲按钮
        this.btn_firstPay = ccui.helper.seekWidgetByName(this.parentView, "btn_firstPay");
        this.btn_firstPay.setPositionX(this.btn_firstPay.getPositionX() - this.origin.x);
        this.btn_firstPay.setPressedActionEnabled(true);
        this.btn_firstPay.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                var pop = new FisrtPayPop(this);
                pop.addToNode(cc.director.getRunningScene());
            }
        }, this);

        if(UserInfo.cbPay != 0)
        {
            this.btn_firstPay.visible = false;
        }


        //显示玩家头像
        this.ShowUserHeader(true);

        //隐藏下部按钮
        this.ShowButtomButtons(false);

        this.bottomBtnLayer = new BottomBtnUILayer();
        this.addChild(this.bottomBtnLayer);
        this.bottomBtnLayer.setPosition(winSize.width/2, 0);



        //播放快速开始动画
        this.actionView = ccs.load("res/landlord/cocosOut/PlazaUILayer.json").action;
        this.parentView.runAction(this.actionView);
        //下面这句话没法生效。
        //运行动画，开始帧，结束帧，当前帧，是否循环。
        this.actionView.gotoFrameAndPlay(0,400,true);
    },
//进入龙虎斗游戏
    enterDragonGame:function()
    {
        Game_ID = 122;
        var roomdata = roomManager.getDragonData();
        lm.log("longhudong------------- "+JSON.stringify(roomdata));
        sparrowDirector.LogonRoom(roomdata.wServerPort,
            userInfo.globalUserdData["dwUserID"],
            userInfo.GetCurPlayerPassword(),
            GetFuuID());

        layerManager.PopTipLayer(new WaitUILayer("正在入桌，请稍后....", function()
        {
            layerManager.PopTipLayer(new PopAutoTipsUILayer("连接服务器超时，请稍后重试！", DefultPopTipsTime),false);
        },this));
    },
    hideFirstPayBtn:function()
    {
        lm.log("PLAZAUILAYER hideFirstPayBtn " + UserInfo.cbPay)
        if(UserInfo.cbPay != 0)
        {
            this.btn_firstPay.visible = false;
        }
    },
    plaza_quick_startgame: function()
    {
        //hanhu #若存在新手引导，则清除 2015/10/08
        if (this.clipper) {
            this.clipper.removeFromParent();
            this.ArrowDown.removeFromParent();
            this.directorLabel.removeFromParent();
        }

        //先获取金币房间数据，如果是非法的就去服务器拉取
        var roomdata = roomManager.GetGoldRoomData();
        {
            GameServerKind.AutoSelectServer(roomdata, function (curServer) {
                lm.log("curServer=============== "+JSON.stringify(curServer));
                sparrowDirector.gameData.accessGold = curServer["lMinTabScore"];

                sparrowDirector.tempRoomServerId = curServer["wServerID"];//当前房间ID

                sparrowDirector.LogonRoom(curServer["wServerPort"],
                    userInfo.globalUserdData["dwUserID"],
                    userInfo.GetCurPlayerPassword(),
                    GetFuuID());

                layerManager.PopTipLayer(new WaitUILayer("正在入桌，请稍后....", function () {
                    layerManager.PopTipLayer(new PopAutoTipsUILayer("连接服务器超时，请稍后重试！", DefultPopTipsTime), false);

                }, this));

            }, function (tips,bless) {

                if(bless)
                {
                    //判断救济金是否领取，如果不能则弹出快充
                    lm.log("救济金 快速开始 " + UserInfo.dwReliefCountOfDayMax + " " + UserInfo.dwReliefCountOfDay);
                    if(UserInfo.dwReliefCountOfDayMax - UserInfo.dwReliefCountOfDay > 0)
                    {
                        var pop = new ReliefPop(this);
                        pop.addToNode(cc.director.getRunningScene());

                    }
                    else
                    {
                        if(UserInfo.cbPay != 0) //非首冲
                        {
                            var pop = new QuickPop(this, 1);
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
                    var pop = new ConfirmPop(this, Poptype.ok, errinfo);//ok
                    pop.addToNode(cc.director.getRunningScene());
                }

                //layerManager.PopTipLayer(new PopAutoTipsUILayer(tips, DefultPopTipsTime), true);

            }, this);

        }

    },

    //设置场次的在线人数
    setLineCount : function()
    {
        var personNum = 0;
        for (var key in GameServerKind.GameServerListArray) {

            if (GameServerKind.GameServerListArray[key]["wKindID"] = Game_ID) {
                var arrry = GameServerKind.GameServerListArray[key].GameServerDataArray
                for (var i in arrry) {
                    personNum = Number(personNum) + Number(arrry[i]["dwOnlineCount"]);
                }
            }
        }

        lm.log("在线人数： " + personNum);
        var line_cout = ccui.helper.seekWidgetByName(this.parentView, "text_goldroomonline_count");
        line_cout.setString("在线人数：" + personNum);
        //hanhu #隐藏比赛场人数 2015/08/12
        var matchMember = ccui.helper.seekWidgetByName(this.parentView, "text_mathroomonline_count");
        matchMember.setString("");
    },

    showNewPlayerDirection: function (button) {
        var parent = this;
        var layer = cc.LayerColor.create(cc.color(0, 0, 0, 200), winSize.width, winSize.height);
        layer.setAnchorPoint(cc.p(0.5, 0.5));

        var clipper = new cc.ClippingNode();
        this.clipper = clipper;
        clipper.attr({
            width: parent.width,
            height: parent.height,
            anchorX: 0.5,
            anchorY: 0.5,
            x: parent.width / 2,
            y: parent.height / 2
        });

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (sender, type) {
                var pos = button.convertToNodeSpace(sender.getLocation());
                var ret = button.getBoundingBox();
                ret.x = 0, ret.y = 0;
                lm.log("ret.width = " + ret.width + " ret.height = " + ret.height + " pos.x = " + pos.x + " pos.y = " + pos.y);
                if (cc.rectContainsPoint(ret, pos)) {

                    return false;
                }
                else {
                    return true;
                }
            }
        }, clipper);
        lm.log("parent.x = " + parent.width + " y = " + parent.height);
        parent.addChild(clipper, 999);

        clipper.stencil = button;//stencil;

        clipper.addChild(layer);
        clipper.setInverted(true);

        //动画
        var MoveUp = cc.MoveBy(0.6, cc.p(0, 20));
        var MoveDown = cc.MoveBy(0.6, cc.p(0, -20));
        var action = new cc.Sequence(MoveDown, MoveUp).repeatForever();
        var ArrowDown = cc.Sprite.createWithSpriteFrameName("Arrow_down.png");
        this.ArrowDown = ArrowDown;
        ArrowDown.runAction(cc.repeatForever(action));
        this.addChild(ArrowDown, 1000);
        ArrowDown.setAnchorPoint(cc.p(0.5, 0));
        ArrowDown.setScale(3);
        ArrowDown.setPosition(cc.p(button.x, button.y + 50));

        var label = cc.LabelTTF.create("点击“立刻游戏”迅速加入", "", 30);
        this.directorLabel = label;
        this.addChild(label, 1000);
        label.setPosition(cc.p(button.x, ArrowDown.y + 100));

    }
});
