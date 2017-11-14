/**
 *
 * Created by baibo on 15/5/18.
 */


 // resource dri is /res/cocosOut/roomUILayer/
var ButtonItemID =
{
    safebox:0,    // 保险箱
    rank:1,    // 排行
    task:2,   // 任务
    mall:3,  // 商城
    award:4,  // 奖励
    active:5,  // 活动
    avi:6   // 视频
};



//HTTP 请求状态
var HttpRequestStatus=
{
    Failed :0,  // 请求失败
    Successed:1   // 请求成功
};


//模块类型
var HttpRequestModuleType=
{
    UserCustomFace:0,  // 用户自定义头像
    GameFeedBack:1,    // 游戏问题反馈 - 上传图片
    Mall:2             // 商城模块 - 下载图片
    // 其他 下载图标 ....

};

//hanhu #公告信息列表
var NoticeMessageArray = new Array();


var rootUILayer = rootLayer.extend({
    ctor: function () {
        this._super();
        this.LoadImageFrame();
        this.initRootUILayer();
        this.initAndroidBackKey();//监听back键
    },
    // 加载图片帧缓存
    LoadImageFrame: function () {
        //cc.spriteFrameCache.addSpriteFrames("res/cocosOut/userface/userface.plist");
    },
    onEnter: function () {
        this._super();
        LandCEMusic.playPlazaBgMusic();
    },
   initRootUILayer: function ()
    {
        var self = this;
        var backUI = ccs.load("res/landlord/cocosOut/rootUILayer.json").node;
        this.addChild(backUI);

        //backUI.setPositionX(cc.director.getVisibleSize().width/2 - 1136/2);
        //
        //lm.log("rootLayer pos =" + this.x);
        this.setPositionX(0);
        //this.setAnchorPoint(0.5, 0.5);
        //lm.log("BackUI size = " + backUI.getContentSize().width);

        if (cc.director.getVisibleSize().width / cc.director.getVisibleSize().height <= 960 / 640)
        {
            backUI.setPositionX((winSize.width - 1136) /2);

        }else
        {
            backUI.setPositionX((cc.director.getVisibleSize().width - 1136) /2);
        }

        lm.log(" getvisablesize w : " + cc.director.getVisibleSize().width + " h: "+ cc.director.getVisibleSize().height);

        //////////////////////////////////////////////////////////////////////////////
        //用户头像信息等
        this.userInfoNode = ccs.load("res/landlord/cocosOut/userInfoNode.json").node;
        this.userInfoNode.setPosition(0, winSize.height);
        //hanhu #调整用户头像坐标 2015/08/07
        //lm.log("win = " + winSize.height + " hei = " + this.userInfoNode.getContentSize().height + " offset = " + offset);
        //:this.userInfoNode.setPosition(cc.p(offset, winSize.height - 110 * winSize.height / 640));
        this.addChild(this.userInfoNode,100);


        //提示获取奖励信息并决定是否显示
        //如果已经绑定手机，就隐藏奖励提示
        this.textfield_root_tipsbg = ccui.helper.seekWidgetByName(this.userInfoNode, "Image_userinfo_bulidtipbk");
        this.textfield_root_tipsbg.setVisible(userInfo.IsHasBoundMobile()?false:true);
        this.textfield_root_tipsbg.setVisible(false);
        this.textfield_root_tipsgold  = ccui.helper.seekWidgetByName(this.userInfoNode, "text_bulidgold");
        this.textfield_root_tipsgold.setVisible(userInfo.IsHasBoundMobile()?false:true);
        this.textfield_root_tipsgold.setVisible(false);
        //lm.log("奖励信息为：" + userInfo.GetBoundMobileAwardInFo());
        if(userInfo.GetBoundMobileAwardInFo() !== null)
        {
            this.textfield_root_tipsgold.setString(userInfo.GetBoundMobileAwardInFo() );
        }

        //头像信息面板
        this.panel_headerinfo = ccui.helper.seekWidgetByName(this.userInfoNode, "panel_headerinfo");
        this.panel_result = ccui.helper.seekWidgetByName(this.userInfoNode, "panel_result");

        //创建自定义头像图层
        this.dedit_userInfo = ccui.helper.seekWidgetByName(this.userInfoNode,"Image_edit_userinfo");
        this.userId_header = ccui.helper.seekWidgetByName(this.userInfoNode,"Image_userinfo_header");
        this.btn_userinfo_edit = ccui.helper.seekWidgetByName(this.userInfoNode, "btn_userinfo_edit");
        this.CustomFaceLayer = CustomFace.CGameCustomFaceLayer.create();
        this.CustomFaceLayer.SetImageRect(37,39,58,58);
        this.CustomFaceLayer.SetVisable(false);
        this.btn_userinfo_edit.addChild(this.CustomFaceLayer,0);
        this.dedit_userInfo.setLocalZOrder(100);

        // buy money
        var btn_userinfo_addmoney = ccui.helper.seekWidgetByName(this.userInfoNode, "btn_userinfo_addmoney");

        //var btn_userinfo_gold = ccui.helper.seekWidgetByName(btn_userinfo_addmoney, "btn_userinfo_gold");
        //btn_userinfo_gold.setSwallowTouches(false);
        //layerManager.SetButtonPressAction(btn_userinfo_gold);

        btn_userinfo_addmoney.setPressedActionEnabled(true);
        btn_userinfo_addmoney.addTouchEventListener(function (sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED) {

                self.OnMallClicked();

            }
        }, this);

        this.btn_userinfo_edit.setPressedActionEnabled(true);
        this.btn_userinfo_edit.addTouchEventListener(function (sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                self.OnModifyUserInFo();
            }
        }, this);




        /////////////////////////////////////////////////////////////////////////////
        //签到、设置、电量、时间信息
        this.topbuttonlayer  = ccs.load("res/landlord/cocosOut/TopButtonLayer.json").node;
        this.addChild(this.topbuttonlayer,100);
        //this.topbuttonlayer.setPosition(winSize.width-300, 640 -80);
        //hanhu #修改顶部按钮层的坐标 2015/08/07
        this.topbuttonlayer.setPosition(winSize.width, winSize.height);
        //this.topbuttonlayer.setPosition(480,320);

        //this.text_toppanel_time = ccui.helper.seekWidgetByName(this.topbuttonlayer,"text_toppanel_time");
        //this.loadingbar_topanel_electricity = ccui.helper.seekWidgetByName(this.topbuttonlayer,"loadingbar_topanel_electricity");



        // 签到按钮
        this.btn_toppanel_checkin = ccui.helper.seekWidgetByName(this.topbuttonlayer,"btn_toppanel_checkin");
        this.btn_toppanel_checkin.setPressedActionEnabled(true);
        this.btn_toppanel_checkin.addTouchEventListener(function (sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
               self.OnMarkClicked();
            }

        }, this);

        // 设置按钮
        this.btn_toppanel_option = ccui.helper.seekWidgetByName(this.topbuttonlayer,"btn_toppanel_option");
        this.btn_toppanel_option.setPressedActionEnabled(true);
        this.btn_toppanel_option.addTouchEventListener(function (sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                lm.log("clickend  ......")
                self.OnSysOptionClicked();
            }

        }, this);


        // 邮件按钮
         /*this.btn_toppanel_email = ccui.helper.seekWidgetByName(this.topbuttonlayer,"btn_toppanel_email");

        this.btn_toppanel_email.setVisible((SubMitAppstoreVersion==true)?false:true);
        this.btn_toppanel_email.addTouchEventListener(function (sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
              self.OnEmailClicked();
              //lm.show(); //hanhu #测试日志管理器 2015/10/12
            }

        }, this);
*/

        // 玩家信息返回按钮
        var btn_userinfo_result = ccui.helper.seekWidgetByName(this.panel_result,"btn_userinfo_result");
        //hanhu #传递点击事件 2015/08/13
        btn_userinfo_result.setSwallowTouches(false);
        btn_userinfo_result.setPressedActionEnabled(true);
        btn_userinfo_result.addTouchEventListener(function (sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                self.OnResultClicked();
            }

        }, this);
    },

    // 更新下部按钮 ButtonItemData
    UpdateDownListButton:function()
    {
        return;
        var self = this;
        this.list_down_window.removeAllItems();
        for (var key in this.ButtonItemData ) {
            if (key == undefined && key === null) continue ;
            this.list_down_window.pushBackDefaultItem();

            var lastItem = this.getDownListButtonItem();
            var Panel_domo = ccui.helper.seekWidgetByName(lastItem, "_panel_dome");
            Panel_domo.setVisible(true);
            var Button_domo = ccui.helper.seekWidgetByName(lastItem, "_button_dome");
            lm.log("the image is " + this.ButtonItemData[key]["image"]);

            //设置资源
            Button_domo.loadTextures(this.ButtonItemData[key]["image"],this.ButtonItemData[key]["image"],this.ButtonItemData[key]["image"],1);
            Button_domo.id = this.ButtonItemData[key]["id"];
            Button_domo.setPressedActionEnabled(true);
            // 添加事件
            Button_domo.addTouchEventListener(function(sender,type)
                {
                    if (type == ccui.Widget.TOUCH_ENDED)
                    {
                        switch(sender.id)
                        {
                            case ButtonItemID.safebox:   // 保险箱
                            {
                                self.OnSafeBoxClicked();
                            }
                                break;

                            case ButtonItemID.rank:   // 排行榜
                            {
                                self.OnRankClicked();
                            }
                            break;
                            case ButtonItemID.task:   // 任务按钮
                            {
                                self.OnTaskClicked();
                            }
                            break;
                            case ButtonItemID.mall:   //商城按钮
                            {
                               self.OnMallClicked();
                            }
                            break;
                            case ButtonItemID.award:    //兑奖按钮
                            {
                                self.OnTicketCliecked();
                            }

                            break;
                            case ButtonItemID.active://活动按钮
                            {
                                self.OnActiveClicked();

                            }
                            break;
                            case ButtonItemID.avi:// 美女视屏
                             {
                                 self.OnAviClicked();
                             }
                            break;
           
                        }
                    }
                }, this);
        }
    },

    //签到按钮
    OnMarkClicked:function()
    {
        // 自动弹出时  - 今日已经签到，只弹出公告面板
            //请求签到数据
            //lm.log("请求签到数据");
            layerManager.PopTipLayer(new WaitUILayer("正在努力加载中...",function()
            {
                layerManager.PopTipLayer(new PopAutoTipsUILayer("连接服务器超时，请稍后重试！", DefultPopTipsTime),false);

            },this));

           //if (CurWebDataType == WebDataType.WEBDATA_TYPE_DEBUG)
           // {
           //     var markdata = [
           //         {"today":{"year":2015,"month":5,"date":12,"week":2}},
           //         {"reward_5_status":0,"reward_10_status":1,"reward_15_status":1,"reward_20_status":2,"reward_all_status":2,"retroactivedates":[1,2,3,5,7,9],"checkeddates":[4,6,8] },
           //         {"checkinreward":[
           //             {
           //                 "reward_5": [{
           //                     "itemvalue": 20000,
           //                     "itemcount": 0,
           //                     "itemtype": 1,
           //                     "itemiconid": 1000,
           //                     "itemiconmd5": "md5",
           //                     "itemiconurl": "http://icon1.png"
           //                 }, {
           //                     "itemvalue": 0,
           //                     "itemcount": 5,
           //                     "itemtype": 2,
           //                     "itemiconid": 1001,
           //                     "itemiconmd5": "md5",
           //                     "itemiconurl": "http://icon1.png"
           //                 }, {
           //                     "itemvalue": 0,
           //                     "itemcount": 2,
           //                     "itemtype": 3,
           //                     "itemiconid": 1002,
           //                     "itemiconmd5": "md5",
           //                     "itemiconurl": "http://icon1.png"
           //                 }]
           //             },
           //             {
           //                 "reward_10": [{
           //                     "itemvalue": 0,
           //                     "itemcount": 1,
           //                     "itemtype": 3,
           //                     "itemiconid": 1000,
           //                     "itemiconmd5": "md5",
           //                     "itemiconurl": "http://icon1.png"
           //                 }, {
           //                     "itemvalue":0,
           //                     "itemcount": 2,
           //                     "itemtype": 2,
           //                     "itemiconid": 1001,
           //                     "itemiconmd5": "md5",
           //                     "itemiconurl": "http://icon1.png"
           //                 }, {
           //                     "itemvalue": 0,
           //                     "itemcount": 2,
           //                     "itemtype": 3,
           //                     "itemiconid": 1002,
           //                     "itemiconmd5": "md5",
           //                     "itemiconurl": "http://icon1.png"
           //                 }]
           //             }, {
           //                 "reward_15": [{
           //                     "itemvalue": 100,
           //                     "itemcount": 0,
           //                     "itemtype": 1,
           //                     "itemiconid": 1000,
           //                     "itemiconmd5": "md5",
           //                     "itemiconurl": "http://icon1.png"
           //                 }, {
           //                     "itemvalue": 5,
           //                     "itemcount": 0,
           //                     "itemtype": 2,
           //                     "itemiconid": 1001,
           //                     "itemiconmd5": "md5",
           //                     "itemiconurl": "http://icon1.png"
           //                 }, {
           //                     "itemvalue": 0,
           //                     "itemcount": 2,
           //                     "itemtype": 3,
           //                     "itemiconid": 1002,
           //                     "itemiconmd5": "md5",
           //                     "itemiconurl": "http://icon1.png"
           //                 }]
           //             },
           //             {
           //                 "reward_20": [{
           //                     "itemvalue": 20000,
           //                     "itemcount": 0,
           //                     "itemtype": 1,
           //                     "itemiconid": 1000,
           //                     "itemiconmd5": "md5",
           //                     "itemiconurl": "http://icon1.png"
           //                 }, {
           //                     "itemvalue": 0,
           //                     "itemcount": 2,
           //                     "itemtype": 2,
           //                     "itemiconid": 1001,
           //                     "itemiconmd5": "md5",
           //                     "itemiconurl": "http://icon1.png"
           //                 }, {
           //                     "itemvalue": 0,
           //                     "itemcount": 2,
           //                     "itemtype": 3,
           //                     "itemiconid": 1002,
           //                     "itemiconmd5": "md5",
           //                     "itemiconurl": "http://icon1.png"
           //                 }]
           //             },
           //             {"reward_all":[{"itemvalue":20000,"itemcount":0,"itemtype":1,"itemiconid":1000,"itemiconmd5":"md5","itemiconurl":"http://icon1.png"},
           //                 {"itemvalue":0,"itemcount":2,"itemtype":2,"itemiconid":1001,"itemiconmd5":"md5","itemiconurl":"http://icon1.png"},
           //                 {"itemvalue":1,"itemcount":2,"itemtype":1,"itemiconid":1002,"itemiconmd5":"md5","itemiconurl":"http://icon1.png"}
           //             ]}
           //         ]}
           //     ];
           //
           //     roomManager.SetMarkData(markdata);
           //     layerManager.PopTipLayer(new MarkUILayer());
           // }
           // else
            {
                webMsgManager.SendGpGetMarkData(function (data) {

                        roomManager.SetMarkData(data);
                        //layerManager.PopTipLayer(new MarkUILayer());
                        var markLayer = new MarkUILayer();
                        markLayer.ignoreAnchorPointForPosition(false);
                        markLayer.setAnchorPoint(0.5,0.5);
                        markLayer.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
                        cc.director.getRunningScene().addChild(markLayer, 1100);

                    },
                    function (errinfo) {
                        layerManager.PopTipLayer(new PopAutoTipsUILayer(errinfo, DefultPopTipsTime),true);
                    },
                    this);
            }

    },

    //系统设置按钮
    OnSysOptionClicked:function()
    {

        lm.log(" system clicken");
        var curLayer = new SystemOptionUILayer();
        curLayer.setTag(ClientModuleType.SysOption);
        layerManager.repalceLayer(curLayer);
        DataUtil.SetGoToModule(ClientModuleType.Plaza);
    },

    //邮件按钮
    OnEmailClicked:function()
    {
        // 邮件数据 将从游戏服务器中传过来，在接收到的时候保存邮件数据
        // roomManager.SetMailData

        var curLayer = new MailUILayer();
        curLayer.setTag(ClientModuleType.Mail);
        layerManager.repalceLayer(curLayer);
        DataUtil.SetGoToModule(ClientModuleType.Plaza);
    },

    //安卓back按钮
    initAndroidBackKey:function()
    {
        if(GetDeviceType() != DeviceType.ANDROID)
            return;

        var self = this;
        this.addChild(new AndroidBackKey(function(){

            if(self.getTag() == ClientModuleType.Plaza)
            {
                var pop = new ConfirmPop(this, Poptype.yesno,"是否退出游戏？");//ok
                pop.addToNode(cc.director.getRunningScene());
                pop.setYesNoCallback(
                    function(){
                        ExitGameEx();
                    }
                );
            }
            else
            {
                self.OnResultClicked();
            }


        },this));
    },

    //返回按钮
    OnResultClicked:function()
    {
        switch (DataUtil.GetGoToModule())
        {
            case ClientModuleType.Plaza:// 大厅
            {
                //lm.log("yypyyp......1");
                //if (SubMitAppstoreVersion == true ||  DoNotMatchRoomVersion == true) {
                //    //先获取金币房间数据，如果是非法的就去服务器拉取
                //    var roomdata = roomManager.GetGoldRoomData();
                //    if ((roomdata === undefined) ||
                //        (roomdata === null) ||
                //        (roomdata.length === 0)) {
                //
                //        // 获取金币房间数据成功，立即进入场次列表
                //        webMsgManager.SendGpGoldFiled(function (data) {
                //
                //                roomManager.SetGoldRoomData(data);
                //
                //                var curLayer = new RoomUILayer();
                //                curLayer.setTag(ClientModuleType.GoldField);
                //                layerManager.repalceLayer(curLayer);
                //                curLayer.refreshView(RoomType.ROOM_TYPE_GOLD);
                //                //DataUtil.SetGoToModule(ClientModuleType.Plaza);
                //            },
                //            function (errinfo) {
                //            },
                //            this);
                //    } else
                //    {
                //        var curLayer = new RoomUILayer();
                //        curLayer.setTag(ClientModuleType.GoldField);
                //        layerManager.repalceLayer(curLayer);
                //        curLayer.refreshView(RoomType.ROOM_TYPE_GOLD);
                //        // DataUtil.SetGoToModule(ClientModuleType.Plaza);
                //    }
                //
                //} else
                {
                    var curLayer = new PlazaUILayer();
                    curLayer.setTag(ClientModuleType.Plaza);
                    layerManager.repalceLayer(curLayer);
                }

            }
                break;
            case ClientModuleType.Rank:// 排行榜
            {
                lm.log("yypyyp......2");

                DataUtil.SetGoToModule(ClientModuleType.Plaza);
                var curLayer = new RankUILayer();
                curLayer.setTag(ClientModuleType.Rank);
                layerManager.repalceLayer(curLayer);

            }break;

            default :
                lm.log("yypyyp......3");
                break;
        }
    },

    //修改用户资料
    OnModifyUserInFo:function()
    {
        //layerManager.PopTipLayer(new ModifyUserInFoUILayer(this));

        var curLayer = new ModifyUserInFoUILayer(this)
        cc.director.getRunningScene().addChild(curLayer, 1000);
        curLayer.ignoreAnchorPointForPosition(false);
        curLayer.setAnchorPoint(0.5,0.5);
        curLayer.setPosition(cc.p(winSize.width / 2, winSize.height / 2));

    },
    //按下美女视频按钮
    OnAviClicked:function()
    {

        if(Number(GetDeviceType()) == DeviceType.ANDROID)
        {
            //lm.log("开启美女视屏");
            var sdkhelper = new lj.Ljsdkhelper();
            sdkhelper.LoginYaYa(userInfo.globalUserdData["szNickName"]);
            DataUtil.SetGoToModule(ClientModuleType.Plaza);
        }
    },
    //活动按钮
    OnActiveClicked:function()
    {
        layerManager.PopTipLayer(new WaitUILayer("正在努力加载中..." ,function()
        {
            layerManager.PopTipLayer(new PopAutoTipsUILayer("连接服务器超时，请稍后重试！", DefultPopTipsTime),false);

        },this));

        // 当前web数据定义
            if (CurWebDataType == WebDataType.WEBDATA_TYPE_DEBUG) {

                var activedata = [
                    {"activeiconid" :1000,
                        "activeiconmd5" : "md5",
                        "activeiconurl" : "http://www.icon.png",
                        "activetitle"   : "活动标题",
                        "activetime"    : "2015-05-21 09:00",
                        "activedescription" : "活动简要说明",
                        "activerulesurl"    : "http://www.rules.com",
                        "activeurl"         : "http://www.huangjuinkuanggong.com"
                    },


                    { "activeiconid"    :2000,
                        "activeiconmd5" : "md5",
                        "activeiconurl" : "http://www.icon.png",
                        "activetitle"   : "活动标题",
                        "activetime"    : "2015-05-21 09:00",
                        "activedescription" : "活动简要说明",
                        "activerulesurl"    : "http://www.rules.com",
                        "activeurl"         : "http://www.huangjuinkuanggong.com" },


                    { "activeiconid"    :3000,
                        "activeiconmd5" : "md5",
                        "activeiconurl" : "http://www.icon.png",
                        "activetitle"   : "活动标题",
                        "activetime"    : "2015-05-21 09:00",
                        "activedescription" : "活动简要说明",
                        "activerulesurl"    : "http://www.rules.com",
                        "activeurl"         : "http://www.huangjuinkuanggong.com" }
                ];

                roomManager.setCurActiveData(activedata);


                var curLayer =  new ActivityUILayer();
                curLayer.setTag(ClientModuleType.Active);
                layerManager.repalceLayer(curLayer);
                DataUtil.SetGoToModule(ClientModuleType.Plaza);



            } else if (CurWebDataType == WebDataType.WEBDATA_TYPE_RELEASE) {
                webMsgManager.SendGpGetActiveData(function (data) {

                        // this.activedata = data;
                        roomManager.setCurActiveData(data);


                        var curLayer =  new ActivityUILayer();
                        curLayer.setTag(ClientModuleType.Active);
                        layerManager.repalceLayer(curLayer);
                        DataUtil.SetGoToModule(ClientModuleType.Plaza);

                    },
                    function (errinfo) {

                        layerManager.PopTipLayer(new PopAutoTipsUILayer(errinfo, DefultPopTipsTime),true);
                    },
                    this);
            }

    },
    //按下兑奖按钮
    OnTicketCliecked:function()
    {
        layerManager.PopTipLayer(new WaitUILayer("正在努力加载中...",function()
        {
            layerManager.PopTipLayer(new PopAutoTipsUILayer("连接服务器超时，请稍后重试！", DefultPopTipsTime),false);

        },this));

        var org_ticketData = roomManager.GetTicketData();
        if(org_ticketData != null || org_ticketData != undefined)
        {
            lm.log("yyp OnTicketCliecked 1");
            var curLayer =  new TicketUILayer();
            curLayer.setTag(ClientModuleType.Ticket);
            layerManager.repalceLayer(curLayer);
            DataUtil.SetGoToModule(ClientModuleType.Plaza);
        }
        else
        {
            lm.log("yyp OnTicketCliecked 1");
            webMsgManager.SendGpGetPrizeexchanheData(function(data)
                {
                    roomManager.SetTicketData(data);

                    var curLayer =  new TicketUILayer();
                    curLayer.setTag(ClientModuleType.Ticket);
                    layerManager.repalceLayer(curLayer);
                    DataUtil.SetGoToModule(ClientModuleType.Plaza);

                },
                function(errinfo) {

                    layerManager.PopTipLayer(new PopAutoTipsUILayer(errinfo, DefultPopTipsTime),true);
                },
                this);
        }
    },
    //保险箱按下
    OnSafeBoxClicked:function()
    {
        var curLayer =  new SafeBoxUILayer();
        curLayer.setTag(ClientModuleType.SafeBox);
        layerManager.repalceLayer(curLayer);
        DataUtil.SetGoToModule(ClientModuleType.Plaza);

    },
    // 按下任务按钮
    OnTaskClicked:function()
    {
        //请求任务数据
        layerManager.PopTipLayer(new WaitUILayer("正在努力加载中...",function()
        {
            layerManager.PopTipLayer(new PopAutoTipsUILayer("连接服务器超时，请稍后重试！", DefultPopTipsTime),false);

        },this));

        lm.log("显示任务界面");
        DataUtil.SetGoToModule(ClientModuleType.Plaza);
        var curLayer = new TaskUILayer();
        curLayer.setTag(ClientModuleType.Task);
        layerManager.repalceLayer(curLayer);
    },
    // 按下排行榜按钮
    OnRankClicked:function()
    {
        // 请求排行榜数据
        layerManager.PopTipLayer(new WaitUILayer("正在努力加载中...",function()
        {
            layerManager.PopTipLayer(new PopAutoTipsUILayer("连接服务器超时，请稍后重试！", DefultPopTipsTime),false);

        },this));


        // 当前web数据定义
            if(CurWebDataType == WebDataType.WEBDATA_TYPE_DEBUG)
            {

                var data = {"selfrank":{"fortnuerank":10,"charmrank":100,"recordrank":100},"fortunelist":[{"userid":1000,"nickname":"用户昵称1", "faceid" : 1, "customfaceid" : 100, "customfaceurl" : "http://www.1.data", "gload" : 1000, "rankings" : 10},
                    { "userid":1000,"nickname":"用户昵称2", "faceid" : 0, "customfaceid" : 100, "customfaceurl" : "http://www.1.data", "gload" : 2000, "rankings" : 9 },
                    { "userid":1000, "nickname":"用户昵称3", "faceid" : 1, "customfaceid" : 100, "customfaceurl" : "http://www.1.data", "gload" : 3000, "rankings" : 8 },
                    { "userid":1000, "nickname":"用户昵称4", "faceid" : 1, "customfaceid" : 100, "customfaceurl" : "http://www.1.data", "gload" : 4000, "rankings" : 7 },
                    { "userid":1000, "nickname":"用户昵称5", "faceid" : 1, "customfaceid" : 100, "customfaceurl" : "http://www.1.data", "gload" : 5000, "rankings" : 6 },
                    { "userid":1000, "nickname":"用户昵称6", "faceid" : 1, "customfaceid" : 100, "customfaceurl" : "http://www.1.data", "gload" : 6000, "rankings" : 5 },
                    { "userid":1000, "nickname":"用户昵称7", "faceid" : 1, "customfaceid" : 100, "customfaceurl" : "http://www.1.data", "gload" : 7000, "rankings" : 4 },
                    { "userid":1000,"nickname":"用户昵称8", "faceid" : 1, "customfaceid" : 100, "customfaceurl" : "http://www.1.data", "gload" : 8000, "rankings" : 3 },
                    { "userid":1000,"nickname":"用户昵称9", "faceid" : 1, "customfaceid" : 100, "customfaceurl" : "http://www.1.data", "gload" : 9000, "rankings" : 2 },
                    { "userid":1000,"nickname":"用户昵称10", "faceid" : 1, "customfaceid" : 100, "customfaceurl" : "http://www.1.data", "gload" : 10000, "rankings" : 1 }],
                    "recordlist":[{"userid":1000,"nickname":"用户昵称1", "faceid" : 1, "customfaceid" : 100, "customfaceurl" : "http://www.1.data", "gload" : 1000, "rankings" : 10},
                        { "userid":1000,"nickname":"用户昵称2", "faceid" : 0, "customfaceid" : 100, "customfaceurl" : "http://www.1.data", "gload" : 2000, "rankings" : 9 },
                        { "userid":1000,"nickname":"用户昵称3", "faceid" : 1, "customfaceid" : 100, "customfaceurl" : "http://www.1.data", "gload" : 3000, "rankings" : 8 },
                        { "userid":1000,"nickname":"用户昵称4", "faceid" : 1, "customfaceid" : 100, "customfaceurl" : "http://www.1.data", "gload" : 4000, "rankings" : 7 },
                        { "userid":1000, "nickname":"用户昵称5", "faceid" : 1, "customfaceid" : 100, "customfaceurl" : "http://www.1.data", "gload" : 5000, "rankings" : 6 },
                        { "userid":1000,"nickname":"用户昵称6", "faceid" : 1, "customfaceid" : 100, "customfaceurl" : "http://www.1.data", "gload" : 6000, "rankings" : 5 },
                        { "userid":1000, "nickname":"用户昵称7", "faceid" : 1, "customfaceid" : 100, "customfaceurl" : "http://www.1.data", "gload" : 7000, "rankings" : 4 },
                        { "userid":1000,"nickname":"用户昵称8", "faceid" : 1, "customfaceid" : 100, "customfaceurl" : "http://www.1.data", "gload" : 8000, "rankings" : 3 },
                        { "userid":1000, "nickname":"用户昵称9", "faceid" : 1, "customfaceid" : 100, "customfaceurl" : "http://www.1.data", "gload" : 9000, "rankings" : 2 },
                        { "userid":1000,"nickname":"用户昵称10", "faceid" : 1, "customfaceid" : 100, "customfaceurl" : "http://www.1.data", "gload" : 10000, "rankings" : 1 }],
                     "charmlist":[{"userid":1000,"nickname":"用户昵称1", "faceid" : 1, "customfaceid" : 100, "customfaceurl" : "http://www.1.data", "charm" : 1000, "rankings" : 10},
                        { "userid":1000,"nickname":"用户昵称2", "faceid" : 0, "customfaceid" : 100, "customfaceurl" : "http://www.1.data", "charm" : 2000, "rankings" : 9 },
                        { "userid":1000,"nickname":"用户昵称3", "faceid" : 1, "customfaceid" : 100, "customfaceurl" : "http://www.1.data", "charm" : 3000, "rankings" : 8 },
                        { "userid":1000, "nickname":"用户昵称4", "faceid" : 1, "customfaceid" : 100, "customfaceurl" : "http://www.1.data", "charm" : 4000, "rankings" : 7 },
                        { "userid":1000,"nickname":"用户昵称5", "faceid" : 1, "customfaceid" : 100, "customfaceurl" : "http://www.1.data", "charm" : 5000, "rankings" : 6 },
                        { "userid":1000, "nickname":"用户昵称6", "faceid" : 1, "customfaceid" : 100, "customfaceurl" : "http://www.1.data", "charm" : 6000, "rankings" : 5 },
                        { "userid":1000,"nickname":"用户昵称7", "faceid" : 1, "customfaceid" : 100, "customfaceurl" : "http://www.1.data", "charm" : 7000, "rankings" : 4 },
                        { "userid":1000,"nickname":"用户昵称8", "faceid" : 1, "customfaceid" : 100, "customfaceurl" : "http://www.1.data", "charm" : 8000, "rankings" : 3 },
                        { "userid":1000,"nickname":"用户昵称9", "faceid" : 1, "customfaceid" : 100, "customfaceurl" : "http://www.1.data", "charm" : 9000, "rankings" : 2 },
                        { "userid":1000, "nickname":"用户昵称10", "faceid" : 1, "customfaceid" : 100, "customfaceurl" : "http://www.1.data", "charm" : 10000, "rankings" : 1 }] };

                roomManager.setRankGameData(data);

                DataUtil.SetGoToModule(ClientModuleType.Plaza);
                var curLayer = new RankUILayer();
                curLayer.setTag(ClientModuleType.Rank);
                layerManager.repalceLayer(curLayer);


            }else if(CurWebDataType == WebDataType.WEBDATA_TYPE_RELEASE)
            {
                //获取排行榜数据
                webMsgManager.SendGpGetRankingsData(function(data) {

                        roomManager.setRankGameData(data);


                        DataUtil.SetGoToModule(ClientModuleType.Plaza);
                        var curLayer = new RankUILayer();
                        curLayer.setTag(ClientModuleType.Rank);
                        layerManager.repalceLayer(curLayer);

                    },
                    function(errinfo) {

                        layerManager.PopTipLayer(new PopAutoTipsUILayer(errinfo, DefultPopTipsTime),true);
                    },
                    this);
            }

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

  /*
        //请求获取商城数据
            if (CurWebDataType == WebDataType.WEBDATA_TYPE_DEBUG)
            {
                var malldata = {"goldlist":[{"type":1,pid:0, "identifier":"com.hbykrs.YKXLGOD6", "pname" : "6元金币套餐",   "price" : 6, "directions" : "1￥=25000金币", "value" : 150000,"recommend":1,"shortName": "金币" },
                    {"type":1,pid:0,"identifier":"com.hbykrs.YKXLGOD30", "pname" : "30元金币套餐", "price" : 30, "directions" : "1￥=25000金币", "value" : 750000,"recommend":1,"shortName": "金币"},
                    {"type":1,pid:0,"identifier":"com.hbykrs.YKXLGOD60", "pname" : "60元金币套餐",  "price" : 60, "directions" : "1￥=25000金币", "value" : 1500000,"recommend":1,"shortName": "金币"},
                    {"type":1,pid:0,"identifier":"com.hbykrs.YKXLGOD98", "pname" : "98元金币套餐",  "price" : 98, "directions" : "1￥=20408 金币", "value" : 2000000,"recommend":0,"shortName": "金币"},
                    {"type":1,pid:0,"identifier":"com.hbykrs.YKXLGOD288", "pname" : "288元金币套餐",  "price" : 288, "directions" : "1￥=20833 金币", "value" : 6000000,"recommend":0,"shortName": "金币"},
                    {"type":1,pid:0,"identifier":"com.hbykys.YKXLGOD488", "pname" : "488元金币套餐",  "price" : 488, "directions" : "1￥=20492 金币", "value" : 10000000,"recommend":0,"shortName": "金币"}],

                    "propertylist":[{"type":6,pid:0,"identifier":"com.hbykrs.YKXLVipBlue3", "pname" : "蓝钻会员3天", "imgmd5" : "md5", "imgurl" : "http://1000.png", "price" : 60, "directions" : "签到每天赠送15万金币","value":3,"shortName": "天蓝钻会员"},
                        {"type":6,pid:0,"identifier":"com.hbykys.YKXLVipBlueTen", "pname" : "蓝钻会员10天", "imgmd5" : "md5", "imgurl" : "http://1000.png", "price" : 108, "directions" : "签到每天赠送30万金币","value":10,"shortName": "天蓝钻会员"},
                        {"type":6,pid:0,"identifier":"com.hbykys.YKXLVipBlueNewTen", "pname" : "蓝钻会员7天",  "imgmd5" : "md5", "imgurl" : "http://1000.png", "price" : 198, "directions" : "签到每天赠送60万金币","value":7,"shortName": "天蓝钻会员"},

                        {"type":4,pid:0,"identifier":"com.hbykys.XLVipYellowNewTen", "pname" : "黄钻会员10天",  "imgmd5" : "md5", "imgurl" : "http://1000.png", "price" : 198, "directions" : "签到每天赠送60万金币","value":10,"shortName": "天黄钻会员"},
                        {"type":4,pid:0,"identifier":"com.hbykys.YKXLVipYellow3", "pname" : "黄钻会员3天",  "imgmd5" : "md5", "imgurl" : "http://1000.png", "price" : 198, "directions" : "签到每天赠送60万金币","value":3,"shortName": "天黄钻会员"},
                        {"type":6,pid:0,"identifier":"com.hbykys.KXLVipYellowSeven", "pname" : "蓝钻会员7天",  "imgmd5" : "md5", "imgurl" : "http://1000.png", "price" : 198, "directions" : "签到每天赠送60万金币","value":7,"shortName": "天黄钻会员"},

                        {"type":65536,pid:11,"identifier":"com.hbykrs.YKXLWTicket", "pname" : "周赛门票3张",  "imgmd5" : "md5", "imgurl" : "http://1000.png", "price" : 6, "directions" : "报名周赛","value":3,"shortName": "张周赛门票"},
                        {"type":65537,pid:12,"identifier":"com.hbykrs.YKXLMOTicket", "pname" : "月赛门票1张",  "imgmd5" : "md5", "imgurl" : "http://1000.png", "price" : 198, "directions" : "报名月赛","value":1,"shortName": "张月赛门票"}],
                    "userproperty":[ {"pid":11,pcount:11}, {"pid":12,pcount:11}, {"pid":11,pcount:8}, {"pid":11,pcount:6}]};


                roomManager.SetMallData(malldata);

            }else
            {
                layerManager.PopTipLayer(new WaitUILayer("正在努力加载中...",function()
                {
                    layerManager.PopTipLayer(new PopAutoTipsUILayer("连接服务器超时，请稍后重试！", DefultPopTipsTime),false);

                },this));
                console.log("请求商城数据");
                webMsgManager.SendGpProperty(function (data) {

                        roomManager.SetMallData(data);
                        lm.log("2商城数据 = " + JSON.stringify(data));
                        //商城按钮
                        switch (Number(GetDeviceType())) {
                            case DeviceType.ANDROID://android
                            {
                                lm.log("打开商城界面");
                                var curLayer =  new MallUILayer();
                                curLayer.setTag(ClientModuleType.Mall);
                                curLayer.refreshViewByData(MallDataType.MALL_DATA_GOLD);
                                layerManager.repalceLayer(curLayer);

                            }
                                break;
                            case DeviceType.IOS://IOS
                            case DeviceType.IPAD://android
                            {
                                if(GET_CHANEL_ID() == ChanelID.IOS_BREAKOUT){
                                    var curLayer =  new MallUILayer();
                                    curLayer.setTag(ClientModuleType.Mall);
                                    curLayer.refreshViewByData(MallDataType.MALL_DATA_GOLD);
                                    layerManager.repalceLayer(curLayer);
                                }else{

                                    // 显示等待标记
                                    //layerManager.PopTipLayer(new WaitUILayer("正在获取产品信息，请稍后...",function()
                                    //{
                                    //    layerManager.PopTipLayer(new PopAutoTipsUILayer("连接服务器超时，请稍后重试！", DefultPopTipsTime),false);
                                    //
                                    //},this));

                                    //请求产品列表
                                    roomManager.RequestProduct(MallDataType.MALL_DATA_GOLD);
                                }

                            }
                        }
                        DataUtil.SetGoToModule(ClientModuleType.Plaza);

                    },
                    function (errinfo) {
                        lm.log("请求商城数据失败. info = " + errinfo);
                        layerManager.PopTipLayer(new PopAutoTipsUILayer(errinfo, DefultPopTipsTime),true);
                    },
                    this);
            }
*/
    },
    // 获取下个控件
    getDownListButtonItem: function () {
        return;
        if (this.list_down_window.getItems().length)
            return this.list_down_window.getItems()[this.list_down_window.getItems().length - 1];
    },


    /**
     * 设置电量
     * @method SetCurElectricity
     * @param {number} arg0
     */
    SetCurElectricity: function (percent)
    {
        //this.loadingbar_topanel_electricity.setPercent(percent);
    },

    /**
     * 设置时间
     * @method SetProcessValue
     * @param {string} arg0
     */
    SetCurTime: function (time)
    {
        //this.text_toppanel_time.setString(time);
    },
    // 是否显示头像
    ShowUserHeader:function(bShow)
    {
        lm.log("is show?" + bShow);
        if(bShow)
        {
            this.panel_headerinfo.setVisible(true);
            this.panel_result.setVisible(false);
        }
        else
        {
            lm.log("ShowUserHeader fasle" );
            this.panel_headerinfo.setVisible(false);
            this.panel_result.setVisible(true);
        }

        this.UpdateUserInFo();
    },
    //更新大厅用户信息
    UpdateUserInFo:function()
    {
       //用户头像
       var wFaceID = userInfo.globalUserdData["wFaceID"];
       var wCustomFaceID = userInfo.globalUserdData["dwCustomID"];
       var wUserID = userInfo.globalUserdData["dwUserID"];

       if(wCustomFaceID != 0)
       {
            //自定义头像
            if(this.CustomFaceLayer.ShowUserCustomFace(wUserID,wCustomFaceID))
            {
                this.CustomFaceLayer.SetVisable(true);
                this.userId_header.setVisible(false);
            }else
            {
                this.CustomFaceLayer.SetVisable(false);
                this.userId_header.setVisible(true);
                var name="";
                lm.log("yyp UpdateUserInFo wUserID1 " + wUserID);
                if(userInfo.globalUserdData["cbGender"] == GenderDefine.GENDER_FEMAIL) //女
                {
                    if(wFaceID == 0 || wFaceID == null)
                    {
                        name =  "system_head_6.png";
                    }else
                    {
                        var newFaceId = (wFaceID-1)%5 + 1 + 5;
                        name = "system_head_" + newFaceId + ".png";
                    }
                }
                else
                {
                    if(wFaceID == 0 || wFaceID == null)
                    {
                        name =  "system_head_1.png";
                    }else
                    {
                        var newFaceId = (wFaceID-1)%5 + 1;
                        name = "system_head_" + newFaceId + ".png";
                    }
                }

                ////lm.log("wFaceID: " + name);
                //玩家系统头像
                //var Image_userinfo_header = ccui.helper.seekWidgetByName(this.userInfoNode, "Image_userinfo_header");
                this.userId_header.loadTexture(name,1);
            }
       }
       else
       {
            //系统头像
            this.CustomFaceLayer.SetVisable(false);
            this.userId_header.setVisible(true);
            var name="";

           lm.log("yyp UpdateUserInFo wUserID2 " + wUserID);
           if(userInfo.globalUserdData["cbGender"] == GenderDefine.GENDER_FEMAIL) //女
           {
               if(wFaceID == 0 || wFaceID == null)
               {
                   name =  "system_head_6.png";
               }else
               {
                   var newFaceId = (wFaceID-1)%5 + 1 + 5;
                   name = "system_head_" + newFaceId + ".png";
               }
           }
           else
           {
               if(wFaceID == 0 || wFaceID == null)
               {
                   name =  "system_head_1.png";
               }else
               {
                   var newFaceId = (wFaceID-1)%5 + 1;
                   name = "system_head_" + newFaceId + ".png";
               }
           }

            ////玩家系统头像
           //var Image_userinfo_header = ccui.helper.seekWidgetByName(this.userInfoNode, "Image_userinfo_header");
           this.userId_header.loadTexture(name,1);
       }

        //隐藏提示背景
        lm.log("隐藏提示背景");
        this.textfield_root_tipsbg.setVisible(userInfo.IsHasBoundMobile()?false:true);
        this.textfield_root_tipsgold.setVisible(userInfo.IsHasBoundMobile()?false:true);
        this.textfield_root_tipsbg.setVisible(false);
        this.textfield_root_tipsgold.setVisible(false);
        if(userInfo.GetBoundMobileAwardInFo() !== null)
        {
            this.textfield_root_tipsgold.setString(userInfo.GetBoundMobileAwardInFo() );
        }
        lm.log("userInfo.GetBoundMobileAwardInFo " + userInfo.GetBoundMobileAwardInFo());

        // 用户昵称
        var text_userinfo_nickname = ccui.helper.seekWidgetByName(this.userInfoNode, "text_userinfo_nickname");
        text_userinfo_nickname.setString(userInfo.globalUserdData["szNickName"]);

        // 用户得分
        var text_userinfo_gold = ccui.helper.seekWidgetByName(this.userInfoNode, "text_userinfo_gold");
        //lm.log("用户积分为：" + userInfo.globalUserdData["lUserScore"]);
        if(userInfo.globalUserdData["lUserScore"] !==null)
        {
            lm.log("设置用户分数为：" + userInfo.globalUserdData["lUserScore"]);
            text_userinfo_gold.setString(indentationGlod(userInfo.globalUserdData["lUserScore"]));
        }

/*
        // 当前激活的会员信息
        var Image_userinfo_redvip = ccui.helper.seekWidgetByName(this.userInfoNode, "Image_userinfo_redvip");
        var Image_userinfo_yellowvip = ccui.helper.seekWidgetByName(this.userInfoNode, "Image_userinfo_yellowvip");
        var Image_userinfo_bluevip = ccui.helper.seekWidgetByName(this.userInfoNode, "Image_userinfo_bluevip");
        var Image_userinfo_vipbk = ccui.helper.seekWidgetByName(this.userInfoNode, "Image_userinfo_vipbk");
        var text_userinfo_vipdelaydate = ccui.helper.seekWidgetByName(this.userInfoNode, "text_userinfo_vipdelaydate");
        var ActiveMemberData =  userInfo.GetCurActiveMemberData();
        if(ActiveMemberData == null)
        {
            Image_userinfo_vipbk.setVisible(false);
            text_userinfo_vipdelaydate.setVisible(false);
            Image_userinfo_yellowvip.setVisible(false);
            Image_userinfo_redvip.setVisible(false);
            Image_userinfo_bluevip.setVisible(false);

        }else
        {
            lm.log("userInfo.GetCurActiveMemberData: " + JSON.stringify(userInfo.GetCurActiveMemberData()));
            var memberoverday = new Date(ActiveMemberData["memberoveryear"],
                ActiveMemberData["memberovermonth"] -1,
                ActiveMemberData["memberoverday"],
                ActiveMemberData["memberoverhour"],
                ActiveMemberData["memberoverminute"],
                ActiveMemberData["memberoversecond"]);

            var curDate = new Date();
            var serverDate = new Date(curDate.getTime() + DataUtil.GetServerInterval());
            var elapsed = DataUtil.GetDays(serverDate,memberoverday);
            lm.log("elapsed " + elapsed);
            if(elapsed > 0)
            {
                //剩余天数
                var datestring = "剩余" +   elapsed + "天";
                text_userinfo_vipdelaydate.setString(datestring);

                //会员信息
                switch (Number(ActiveMemberData["memberorder"]))
                {
                    case MemberOrder.MEMBER_ORDER_YELLOW: //黄钻
                    {
                        Image_userinfo_vipbk.setVisible(true);
                        text_userinfo_vipdelaydate.setVisible(true);

                        Image_userinfo_yellowvip.setVisible(true);
                        Image_userinfo_redvip.setVisible(false);
                        Image_userinfo_bluevip.setVisible(false);

                    }
                        break;
                    case MemberOrder.MEMBER_ORDER_BLUE:  //蓝钻
                    {
                        Image_userinfo_vipbk.setVisible(true);
                        text_userinfo_vipdelaydate.setVisible(true);


                        Image_userinfo_bluevip.setVisible(true);
                        Image_userinfo_yellowvip.setVisible(false);
                        Image_userinfo_redvip.setVisible(false);
                    }
                        break;
                    case MemberOrder.MEMBER_ORDER_RED:     //红钻
                    {
                        Image_userinfo_vipbk.setVisible(true);
                        text_userinfo_vipdelaydate.setVisible(true);

                        Image_userinfo_yellowvip.setVisible(false);
                        Image_userinfo_redvip.setVisible(true);
                        Image_userinfo_bluevip.setVisible(false);
                    }
                        break;
                    default ://其他钻，隐藏
                    {
                        Image_userinfo_vipbk.setVisible(false);
                        text_userinfo_vipdelaydate.setVisible(false);
                        Image_userinfo_yellowvip.setVisible(false);
                        Image_userinfo_redvip.setVisible(false);
                        Image_userinfo_bluevip.setVisible(false);
                    }
                        break;
                }
            }
            else
            {
                Image_userinfo_vipbk.setVisible(false);
                text_userinfo_vipdelaydate.setVisible(false);
                Image_userinfo_yellowvip.setVisible(false);
                Image_userinfo_redvip.setVisible(false);
                Image_userinfo_bluevip.setVisible(false);

            }
        }
        */
    },

    RefreshNickName:function()
    {
        // 用户昵称
        var text_userinfo_nickname = ccui.helper.seekWidgetByName(this.userInfoNode, "text_userinfo_nickname");
        text_userinfo_nickname.setString(userInfo.globalUserdData["szNickName"]);
    },

    // 显示、隐藏顶部按钮  邮件-签到-设置
    ShowTopButtons: function(bShow)
    {
        if(bShow)
        {
            this.btn_toppanel_checkin.setVisible(true);
            this.btn_toppanel_option.setVisible(true);
            //this.btn_toppanel_email.setVisible((SubMitAppstoreVersion==true)?false:true);

        }else
        {
            this.btn_toppanel_checkin.setVisible(false);
            this.btn_toppanel_option.setVisible(false);
            //this.btn_toppanel_email.setVisible(false);
        }
    },
    // 显示、隐藏底部按钮
    ShowButtomButtons: function(bShow)
    {
        //this.underButtons.setVisible(bShow);
    },
    // 更新自定义数据 - 子类覆盖
    UpdateCustomData:function(data)
    {


    }

})


var rootUIScene = rootScene.extend({
    curLayer: null,
    ctor: function (ac, pw)
    {
        this._super();
        this.ac = ac;
        this.pw = pw;


        var winSize = cc.director.getVisibleSize();
        if (winSize.width / winSize.height <= 960 / 640) {
            winSize = cc.size(960, 640);
        }

        this.parentView = ccs.load("res/landlord/cocosOut/LodingBarUILayer.json").node;
        this.addChild(this.parentView);

        if (cc.director.getVisibleSize().width / cc.director.getVisibleSize().height <= 960 / 640)
        {
            this.parentView.setPositionX((winSize.width - 1136) / 2);


        }else
        {
            this.parentView.setPositionX((cc.director.getVisibleSize().width - 1136) / 2);
        }

        this.lodingbar_bg = ccui.helper.seekWidgetByName(this.parentView,"lodingbar_bg");
        this.lodingbar_bg.setVisible(false);
        this.lodingbar_bg.setOpacity(0);

        // 去除之前的start 界面，直接显示登录界面
        //this.addChild(new LoginUILayer(), 99);
        //return;

        this.RequestAddress();

    },

    AutoLogin:function()
    {
        //找回密码 账号升级后登陆
        if(this.ac != undefined && this.ac != null && this.pw != undefined && this.pw != null)
        {
            this.UpgradeLogin();
            return;
        }

        //如果是安卓平台 并且渠道不是8633 baiduSingle telcom 直接游客登录
        if(GetDeviceType() != DeviceType.ANDROID || ChannelLabel == "8633" || ChannelLabel == "baiduSingle" || ChannelLabel == "telcom") //hanhu #android不提供立即登陆按钮 2015/10/08
        {
            var lastHistoryData = userInfo.GetLastLocalData(plazaMsgManager.address);
            if (lastHistoryData !== null)//历史登录
            {
                this.HistoryLogin(lastHistoryData);
                return;
            }
        }
        //网游SDK
        if(ChannelLabel == "wangyou" && GetDeviceType() == DeviceType.ANDROID)
        {
            var sdkHelper = new lj.Ljsdkhelper();
            sdkHelper.doSdkLogin();
            return;
        }

        //游客登录
        {
            lm.log("yyp 一键注册 游客登录");
            //无网络，直接给出提示
            if (!IsNetworkAvailable())
            {
                var pop = new ConfirmPop(this, Poptype.yesno,"当前网络异常，请检查网络状态后重试！");//ok
                pop.addToNode(cc.director.getRunningScene());
                pop.hideCloseBtn();
                pop.setYesNoCallback(
                    function(){
                        this.AKeyRegister();
                    },
                    function()
                    {
                        ExitGameEx();
                    }
                );
                //layerManager.PopTipLayer(new PopTipsUILayer("重试", "取消", "当前网络异常，请检查网络状态后重试！", function (id) {
                //    if (id == clickid.ok)
                //    {
                //        this.AKeyRegister();
                //    }
                //}));

            }else
            {
                this.AKeyRegister();
            }
        }

    },
    //历史信息登录
    UpgradeLogin:function()
    {
        lm.log("yyp 升级登录");
        //设置登录接口回调
        plazaMsgManager.SetLogonCallBack(
            function () // 连接服务器失败
            {
                var pop = new ConfirmPop(this, Poptype.yesno,"当前网络异常，请检查网络状态后重试！");//ok
                pop.addToNode(cc.director.getRunningScene());
                pop.hideCloseBtn();
                pop.setYesNoCallback(
                    function(){
                        // 连接失败重试
                        plazaMsgManager.LogonPlaza(this.ac, this.pw, GetFuuID(), "");//默认以前登录方式
                    },
                    function()
                    {
                        ExitGameEx();
                    }
                );

            },
            function () // 登录大厅成功
            {
                var curLayer = new PlazaUILayer();
                curLayer.setTag(ClientModuleType.Plaza);
                layerManager.repalceLayer(curLayer);

            },
            function (info)// 登录大厅失败
            {
                var pop = new ConfirmPop(this, Poptype.ok, info);//ok
                pop.addToNode(cc.director.getRunningScene());
                pop.hideCloseBtn();
                pop.setYesNoCallback(
                    function(){
                        ExitGameEx();
                    }
                );

            }, this);

        //登录
        {
            //lm.log("this.lastHistoryData.account: " + lastHistoryData["account"]);
            //lm.log("this.lastHistoryData.password: " + lastHistoryData["password"]);

            layerManager.PopTipLayer(new WaitUILayer("正在登录服务器，请稍后...",function()
            {

            },this));

            //保存用户账号信息
            userInfo.SetCurPlayerInFo(this.ac, this.pw);

            // 登录大厅
            plazaMsgManager.LogonPlaza(this.ac, this.pw, GetFuuID(), "");//默认以前登录方式
        }

    },

    //历史信息登录
    HistoryLogin:function(lastHistoryData)
    {
        lm.log("yyp 历史记录登录");
        //设置登录接口回调
        plazaMsgManager.SetLogonCallBack(
            function () // 连接服务器失败
            {
                var pop = new ConfirmPop(this, Poptype.yesno,"当前网络异常，请检查网络状态后重试！");//ok
                pop.addToNode(cc.director.getRunningScene());
                pop.hideCloseBtn();
                pop.setYesNoCallback(
                    function(){
                        // 连接失败重试
                        if (lastHistoryData["type"] == true) {
                            plazaMsgManager.LogonPlazaEx(lastHistoryData["account"], lastHistoryData["password"], GetFuuID(), "");//默认以前登录方式
                        } else {
                            plazaMsgManager.LogonPlaza(lastHistoryData["account"], lastHistoryData["password"], GetFuuID(), "");//默认以前登录方式
                        }
                    },
                    function()
                    {
                        ExitGameEx();
                    }
                );

            },
            function () // 登录大厅成功
            {
                var curLayer = new PlazaUILayer();
                curLayer.setTag(ClientModuleType.Plaza);
                layerManager.repalceLayer(curLayer);

            },
            function (info)// 登录大厅失败
            {
                var pop = new ConfirmPop(this, Poptype.ok, info);//ok
                pop.addToNode(cc.director.getRunningScene());
                pop.hideCloseBtn();
                pop.setYesNoCallback(
                    function(){
                        ExitGameEx();
                    }
                );

            }, this);

        //登录
        {
            //lm.log("this.lastHistoryData.account: " + lastHistoryData["account"]);
            //lm.log("this.lastHistoryData.password: " + lastHistoryData["password"]);

            layerManager.PopTipLayer(new WaitUILayer("正在登录服务器，请稍后...",function()
            {

            },this));

            //保存用户账号信息
            userInfo.SetCurPlayerInFo(this.lastHistoryData["account"], this.lastHistoryData["password"]);

            // 登录大厅
            if ((this.lastHistoryData["type"] !== undefined) && (this.lastHistoryData["type"] == true))
            {
                plazaMsgManager.LogonPlazaEx(this.lastHistoryData["account"], this.lastHistoryData["password"], GetFuuID(), "");//默认以前登录方式
            }
            else
            {
                plazaMsgManager.LogonPlaza(this.lastHistoryData["account"], this.lastHistoryData["password"], GetFuuID(), "");//默认以前登录方式
            }
        }

    },

    //一键注册
    AKeyRegister:function()
    {
        lm.log("yyp 一键注册 游客登录 AKeyRegister");
        var self = this;
        layerManager.PopTipLayer(new WaitUILayer("正在连接服务器，请稍后...", function()
        {
            var pop = new ConfirmPop(this, Poptype.yesno,"当前网络异常，请检查网络状态后重试！");//ok
            pop.addToNode(cc.director.getRunningScene());
            pop.hideCloseBtn();
            pop.setYesNoCallback(
                function(){
                    self.AKeyRegister();
                },
                function()
                {
                    ExitGameEx();
                }
            );
            //layerManager.PopTipLayer(new PopTipsUILayer("重试", "取消", "当前网络异常，请检查网络状态后重试！", function (id) {
            //    if (id == clickid.ok) {
            //
            //        self.AKeyRegister();
            //    }
            //}));
        },this));


        lm.log("yyp 一键注册 游客登录 AKeyRegister 1");
        DataUtil.AkeyRegisterUser = true;
        //发送一键注册消息
        NewWebMsgManager.SendAkeyRegisterEx(GetFuuID(), function (data) {
            // 设置登录回调接口
            plazaMsgManager.SetLogonCallBack(
                function () // 连接服务器失败
                {
                    lm.log("yyp 一键注册 游客登录 AKeyRegister 2");
                    // 连接失败重试
                    var pop = new ConfirmPop(this, Poptype.yesno,"当前网络异常，请检查网络状态后重试！");//ok
                    pop.addToNode(cc.director.getRunningScene());
                    pop.hideCloseBtn();
                    pop.setYesNoCallback(
                        function(){
                            plazaMsgManager.LogonPlazaEx(data["accounts"], data["password"], GetFuuID(), "");//默认以前登录方式
                        },
                        function()
                        {
                            ExitGameEx();
                        }
                    );
                    //layerManager.PopTipLayer(new PopTipsUILayer("重试", "取消", "当前网络异常，请检查网络状态后重试！", function (id) {
                    //    if (id == clickid.ok) {
                    //        plazaMsgManager.LogonPlazaEx(data["accounts"], data["password"], GetFuuID(), "");//默认以前登录方式
                    //    }
                    //
                    //}));
                },
                function () // 登录大厅成功
                {
                    lm.log("yyp 一键注册 游客登录 AKeyRegister 3");
                    var curLayer = new PlazaUILayer();
                    curLayer.setTag(ClientModuleType.Plaza);
                    layerManager.repalceLayer(curLayer);

                },
                function (info) { // 登录大厅失败

                    lm.log("yyp 一键注册 游客登录 AKeyRegister 4");
                    var pop = new ConfirmPop(this, Poptype.ok, info);//ok
                    pop.addToNode(cc.director.getRunningScene());
                    pop.hideCloseBtn();
                    pop.setYesNoCallback(
                        function(){
                            ExitGameEx();
                        }
                    );
                    //layerManager.PopTipLayer(new PopTipsUILayer("退出游戏", "取消", info, function (id) {
                    //    if (id == clickid.ok)
                    //        ExitGame();
                    //
                    //}));

                }, this);

            lm.log("akey login accounts:" + data["accounts"] + "login password:" + data["password"]);

            userInfo.SetCurPlayerInFo(data["accounts"], data["password"]);
            // 登录大厅
            plazaMsgManager.LogonPlazaEx(data["accounts"], data["password"], GetFuuID(), "");//默认以前登录方式


        }, function (errinfo) {
            lm.log("yyp 一键注册 游客登录 AKeyRegister 5");
            layerManager.PopTipLayer(new PopAutoTipsUILayer(errinfo, DefultPopTipsTime), true);

        }, this);
    },

    //获取大厅登录地址
    RequestAddress: function () {
        var self = this;
        lm.log("获取大厅登录地址：");
        webMsgManager.SendGetAccessAddress(function (data)
        {
            lm.log("获取大厅登录地址成功：" + JSON.stringify(data));
            //获取 http web url
            var http_web_url = data["http_web_url"];
            if (http_web_url !== undefined && http_web_url !== null) {
                DataUtil.SetHttpWebURL(http_web_url);
            }

            // 设置上传地址
            var up_load_url = data["up_load_url"];
            if (up_load_url !== undefined && up_load_url !== null) {
                DataUtil.SetUpLoadWebURL(up_load_url);
            }

            // 设置App下载地址
            var app_url = data["app_url"];
            if (app_url !== undefined && app_url !== null) {
                DataUtil.SetAppURL(app_url);
            }

            // 设置APKMD5
            var apk_md5 = data["apk_md5"];
            if (apk_md5 !== undefined && apk_md5 !== null) {
                DataUtil.SetApkMD5(apk_md5);
            }

            // begin modified by lizhongqiang 2015-09-29 15:25
            //修改大厅登录地址获取方式，从IP地址队列中获取信用最好的地址；
            var serverlist = data["serveraddlist"];
            if ((serverlist !== undefined) && (serverlist !== null) && (serverlist.length > 0)) {
                logonAddressListManger.UpdateAddressListData(serverlist);

                var serveritem = logonAddressListManger.GetNextAddress();

                if(serveritem !== null)
                {
                    plazaMsgManager.SetPlazaLogonAddress(serveritem["serveradd"],serveritem["serverport"]);
                }
            }
            // end modified by lizhongqiang 2015-09-29

            //获取系统时间
            self.RequestSystemTime();

            userInfo.initLocalData();
            this.lastHistoryData = userInfo.GetLastLocalData(plazaMsgManager.address);

            lm.log("last hist :" + JSON.stringify(self.lastHistoryData));

            this.AutoLogin();

        },
        function (errinfo) // 获取失败
        {
            if(self.reconnect_num < 3)
            {
                self.reconnect_num++;
                self.RequestAddress();
            }
            else
            {
                lm.log(errinfo);
                var pop = new ConfirmPop(this, Poptype.yesno,"网络连接失败，请检查网络后再试！");//ok
                pop.addToNode(cc.director.getRunningScene());
                pop.hideCloseBtn();
                pop.setYesNoCallback(
                    function(){
                        ExitGameEx();
                    },
                    function(){
                        ExitGameEx();
                    }
                );

                //var Pop = new AssetsConfirmNode("网络连接失败，请检查网络后再试！", this, function(){
                //    ExitGame();
                //});
                //cc.director.getRunningScene().addChild(Pop, 999);
                //var size = cc.director.getWinSize();
                //Pop.setPosition(cc.p(size.width / 2, size.height / 2));
            }

        }, this);

    },

    //获取时间
    RequestSystemTime: function () {
        var startTime = new Date();
        webMsgManager.SendGpGetSystemTime(function (data) {
            // 计算误差（通讯时间）
            var endTime = new Date();
            DataUtil.SetServerInterval(data, (endTime.getTime() - startTime.getTime()));

            // 获取失败
        }, function (errinfo) {

        }, this);

    }

});




