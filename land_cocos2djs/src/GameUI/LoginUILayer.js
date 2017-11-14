/**
 * Created by lizhongqiang on 15/5/28.
 */




var LoginUILayer = rootLayer.extend({
    ctor: function () {
        lm.log("yyp init LoginUILayer");
        this.selectPrivacyFlag = true; //hanhu #默认选中隐私条款 2015/12/02
        this._super();
        this.LoadImageFrame();
        this.initLayer();
        this.RequestAddress();
        //hanhu #增加获取登陆地址最大尝试次数 2015/10/12
        this.reconnect_num = 0;
        //hanhu #登录界面重置比赛数据 2015/12/24
        matchMsgManager.ClearMatchData();
        MatchSignInArray = [];
        MatchAttendingInfo = {};
        MatchUserInfoArray = [];
        MatchSitArray = [];
        MatchUserReadyArray = [];
        this.resetPosition();
        //hanhu #登陆界面重置任务数据 2016/01/16
        roomManager.taskdata = new Array();
    },
    // 加载图片帧缓存
    LoadImageFrame: function () {
        cc.spriteFrameCache.addSpriteFrames("res/cocosOut/userface/userface.plist");
        cc.spriteFrameCache.addSpriteFrames("res/landlord/cocosOut/texturepackerOutput/newDesk.plist");
    },
    initLayer: function () {
        //加载主界面
        this.parentView = ccs.load("res/cocosOut/LoginUILayer.json").node;
        this.addChild(this.parentView);

        if (cc.director.getVisibleSize().width / cc.director.getVisibleSize().height <= 960 / 640)
        {
            this.parentView.setPositionX((winSize.width - 1136) / 2);

        }else
        {
            this.parentView.setPositionX((cc.director.getVisibleSize().width - 1136) / 2);
        }

        this.text_version = ccui.helper.seekWidgetByName(this.parentView, "text_version");
        this.text_version.setString(DefultVersion);
        this.text_version.setPositionX(this.text_version.getPositionX() - 100);

        //创建自定义头像图层
        this.Image_userinfo_headerbk = ccui.helper.seekWidgetByName(this.parentView, "image_panel_userheader");
        this.CustomFaceLayer = CustomFace.CGameCustomFaceLayer.create();
        this.CustomFaceLayer.SetImageRect(42, 42, 84, 84);
        this.CustomFaceLayer.SetVisable(false);
        this.Image_userinfo_headerbk.addChild(this.CustomFaceLayer, 9999);

        //一键注册
        this.btn_privacy_select = ccui.helper.seekWidgetByName(this.parentView, "btn_privacy_select");
        this.btn_register = ccui.helper.seekWidgetByName(this.parentView, "btn_register");
        //hanhu #androidp平台隐藏一键注册功能 2015/10/08
        lm.log("DeviceType = " + GetDeviceType() + " android = " + DeviceType.ANDROID + " ChannelLabel =" + ChannelLabel);
        if(GetDeviceType() == DeviceType.ANDROID && ChannelLabel != "8633")
        {
            lm.log("隐藏一键注册按钮");
            this.btn_register.setVisible(false);
            this.btn_register.setTouchEnabled(false);
        }

        if(GetDeviceType() == DeviceType.ANDROID && ChannelLabel == "baiduSingle"){

            lm.log("百度单机打开一键注册按钮");
            this.btn_register.setVisible(true);
            this.btn_register.setTouchEnabled(true);
            //更改北京图片
            var inamgeBg = ccui.helper.seekWidgetByName(this.parentView,"login_bg");
            inamgeBg.loadTexture("res/cocosOut/backUILayer/01_login_bg_baidu.jpg");
        }


        this.btn_register.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                lm.log("yyp btn_register：" + VERSION_PLAZA);
                if (self.selectPrivacyFlag)
                {

                    //无网络，直接给出提示
                    if (!IsNetworkAvailable())
                    {
                        //layerManager.PopTipLayer(new PopTipsUILayer("重试", "取消", "当前网络异常，请检查网络状态后重试！", function (id) {
                        //    if (id == clickid.ok) {
                        //
                        //        self.AKeyRegister();
                        //    }
                        //}));

                    }else
                    {
                        self.AKeyRegister();
                    }

                }else {

                    layerManager.PopTipLayer(new PopAutoTipsUILayer("请查看并同意使用条款和隐私政策后再进行注册!", DefultPopTipsTime), true);
                }
            }

        }, this);

        //账号登陆按钮
        this.btn_login = ccui.helper.seekWidgetByName(this.parentView, "btn_login");
        if(GetDeviceType() == DeviceType.ANDROID && ChannelLabel != "8633" && ChannelLabel != "baiduSingle")
        {
            this.btn_login.y += winSize.height * 0.1
        }
        this.btn_login.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                lm.log("yyp btn_login：" + VERSION_PLAZA);
                //layerManager.PopTipLayer(new AccountLoginUILayer(), 999);

                //var scene = new MainGameScene();
                //
                //layerManager.addLayerToParent(new LoginUILayer(), scene);
                //cc.director.replaceScene(scene);
                //Android 从其他平台登录
                switch (Number(GetDeviceType())) {
                    case DeviceType.ANDROID://android
                    {
                        if(ChannelLabel != "8633" && ChannelLabel != "baiduSingle")
                        {
                            if(ChannelLabel == "baidu"){
                                lm.log("百度SDK登陆");
                                jsb.reflection.callStaticMethod(AndroidPackageName,"LoginSDK","()V");

                            }else{
                                lm.log("进行SDK登陆");
                                var sdkHelper = new lj.Ljsdkhelper();
                                sdkHelper.LoginGame("sdk登陆");
                            }

                        }
                        else
                        {
                            layerManager.PopTipLayer(new AccountLoginUILayer(), 999);
                        }

                    }
                        break;
                    case DeviceType.IOS://IOS
                    case DeviceType.IPAD://IPAD
                    {
                        lm.log("yyp登录历史数据 1:");
                        layerManager.PopTipLayer(new AccountLoginUILayer(), 999);
                    }
                }
            }
        }, this);

        // 获取最后登录历史
        //userInfo.AppendLocalData("p64559",
        //    "7E1DD49724AAFAE7D8339F1B4981D414",
        //    31550,
        //    1,
        //    0,
        //    "贵宾137554",
        //    10000,
        //    true,
        //    plazaMsgManager.address);
        userInfo.initLocalData();
        this.lastHistoryData = userInfo.GetLastLocalData(plazaMsgManager.address);

        lm.log("登录历史数据 :" + JSON.stringify(this.lastHistoryData));

        //立即登陆按钮
        this.btn_now_login = ccui.helper.seekWidgetByName(this.parentView, "btn_now_login");
        var self = this;
        this.btn_now_login.addTouchEventListener(function (sender, type)
        {
            // DownLoadImage(0, "test","192.168.5.99:9999/Upload/res/1.jpg");
            if (type == ccui.Widget.TOUCH_ENDED)
            {


                plazaMsgManager.SetLogonCallBack(
                    function () // 连接服务器失败
                    {
                        // 连接失败重试
                        //layerManager.PopTipLayer(new PopTipsUILayer("重试","取消","当前网络异常，请检查网络状态后重试！",function(id)
                        //{
                        //    if(id ==clickid.ok )
                        //    {
                        //        // 连接失败重试
                        //        if (self.lastHistoryData["type"] == true) {
                        //
                        //            // 登录大厅
                        //            plazaMsgManager.LogonPlazaEx(self.lastHistoryData["account"],
                        //                self.lastHistoryData["password"], GetFuuID(), "");//默认以前登录方式
                        //        } else {
                        //            // 登录大厅
                        //            plazaMsgManager.LogonPlaza(self.lastHistoryData["account"],
                        //                self.lastHistoryData["password"], GetFuuID(), "");//默认以前登录方式
                        //
                        //        }
                        //    }
                        //
                        //}),true);


                    },
                    function () // 登录大厅成功
                    {
                        if (SubMitAppstoreVersion == true ||  DoNotMatchRoomVersion == true) {
                            //先获取金币房间数据，如果是非法的就去服务器拉取
                            var roomdata = roomManager.GetGoldRoomData();
                            if ((roomdata === undefined) ||
                                (roomdata === null) ||
                                (roomdata.length === 0)) {

                                // 获取金币房间数据成功，立即进入场次列表
                                webMsgManager.SendGpGoldFiled(function (data) {

                                        roomManager.SetGoldRoomData(data);

                                        var curLayer = new RoomUILayer();
                                        curLayer.setTag(ClientModuleType.GoldField);
                                        layerManager.repalceLayer(curLayer);
                                        curLayer.refreshView(RoomType.ROOM_TYPE_GOLD);  //
                                        //DataUtil.SetGoToModule(ClientModuleType.Plaza);
                                    },
                                    function (errinfo) {
                                    },
                                    this);
                            } else {
                                var curLayer = new RoomUILayer();
                                curLayer.setTag(ClientModuleType.GoldField);
                                layerManager.repalceLayer(curLayer);
                                curLayer.refreshView(RoomType.ROOM_TYPE_GOLD);  //
                               // DataUtil.SetGoToModule(ClientModuleType.Plaza);
                            }

                        } else {

                            lm.log("logoin successed ");
                            var curLayer = new PlazaUILayer();  //不在调用
                            curLayer.setTag(ClientModuleType.Plaza);
                            layerManager.repalceLayer(curLayer);
                        }

                    },
                    function (info) { // 登录大厅失败

                        //layerManager.PopTipLayer(new PopTipsUILayer("退出游戏", "取消", info, function (id) {
                        //    if (id == clickid.ok) {
                        //        ExitGame();
                        //    }
                        //
                        //}));

                    }, this);


                if (this.lastHistoryData !== null) {
                    lm.log("this.lastHistoryData.account: " + this.lastHistoryData["account"]);
                    lm.log("this.lastHistoryData.password: " + this.lastHistoryData["password"]);


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



            }

        }, this);


        //使用条款隐私政策
        this.btn_privacy = ccui.helper.seekWidgetByName(this.parentView, "btn_privacy");
        if(GetDeviceType() == DeviceType.ANDROID && ChannelLabel != "8633" && ChannelLabel != "baiduSingle")
        {
            this.btn_privacy.y += winSize.height * 0.1;
            this.btn_privacy_select.y += winSize.height * 0.1;

        }
        this.btn_privacy.addTouchEventListener(function (sender, type) {

            if (type == ccui.Widget.TOUCH_ENDED) {
                var privacyurl = roomManager.GetNoticeData()["privacyurl"];
                if (privacyurl !== undefined && privacyurl !== null) {
                    var width = cc.director.getVisibleSize().width - webviewNotice_offset_x;
                    var height = cc.director.getVisibleSize().height - webviewNotice_offset_y;

                    var mwidth = 0, mheight = 0;
                    if (cc.director.getVisibleSize().width / cc.director.getVisibleSize().height <= 1.5) {
                        mwidth = Math.floor(cc.director.getVisibleSize().width);
                        mheight = Math.floor(cc.director.getVisibleSize().height);
                    } else {
                        mwidth = Math.floor(cc.director.getVisibleSize().width / 2);
                        mheight = Math.floor(cc.director.getVisibleSize().height / 2);
                    }

                    var localUrl = privacyurl + "&mwidth=" + mwidth + "&mheight=" + mheight;
                    layerManager.PopTipLayer(new WebViewUILayer(Math.floor(width), Math.floor(height), localUrl));
                }
            }
        }, this);


        //使用条款选择
        this.btn_privacy_select.addTouchEventListener(function (sender, type) {

            if (type == ccui.Widget.TOUCH_ENDED) {
                //self.btn_privacy_select.setVisible(false);
                //self.btn_privacy_unselect.setVisible(true);
                self.selectPrivacyFlag = !self.selectPrivacyFlag; //hanhu #使用选择标签来判定是否选中 2015/12/02

            }
        }, this);



        //增加电信登录入口
        this.btn_telcomregister = ccui.helper.seekWidgetByName(this.parentView, "btn_telcomregister");
        if(ChannelLabel == "telcom")
        {
            this.btn_register.setVisible(false);
            this.btn_login.setVisible(false);
            this.btn_telcomregister.addTouchEventListener(function (sender, type)
            {
                if (type == ccui.Widget.TOUCH_ENDED)
                {
                    self.OnTelcomLogin();

                }
            }, this);
        }else
        {
            this.btn_telcomregister.setVisible(false);
        }

        //设置登录历史

        if(GetDeviceType() != DeviceType.ANDROID || ChannelLabel == "8633" || ChannelLabel == "baiduSingle" || ChannelLabel == "telcom") //hanhu #android不提供立即登陆按钮 2015/10/08
        {
            this.SetLogonHistory();
        }
        else
        {
            var userInfoBack = ccui.helper.seekWidgetByName(this.parentView, "panel_user_info");
            userInfoBack.setVisible(false);
        }

        lm.log("登陆界面初始化完成");
    },
    //电信登录入口
    OnTelcomLogin:function()
    {
        layerManager.PopTipLayer(new TelcomMobileLogionLayer(), true);    },
 	resetPosition:function()
    {
        if(Game_ID != 378)
        {
            this.btn_login.setPositionX(this.btn_login.getPosition().x - 60);
            this.btn_register.setPositionX(this.btn_register.getPosition().x - 60);
            this.panel_user_info.setPositionX(this.panel_user_info.getPosition().x - 60);
            this.btn_privacy.setPositionX(this.btn_privacy.getPosition().x - 60);
            this.btn_now_login.setPositionX(this.btn_now_login.getPosition().x - 60);
            this.btn_privacy_select.setPositionX(this.btn_privacy_select.getPosition().x - 60);
            this.btn_telcomregister.setPositionX(this.btn_telcomregister.getPosition().x - 60);
        }
        cc.log("memeda-----------------------------");
    },
    //一键注册
    AKeyRegister:function()
    {
        var self = this;
        layerManager.PopTipLayer(new WaitUILayer("正在连接服务器，请稍后...", function()
        {
            //layerManager.PopTipLayer(new PopTipsUILayer("重试", "取消", "当前网络异常，请检查网络状态后重试！", function (id) {
            //    if (id == clickid.ok) {
            //
            //        self.AKeyRegister();
            //    }
            //}));
        },this));


        DataUtil.AkeyRegisterUser = true;
        //发送一键注册消息
        NewWebMsgManager.SendAkeyRegisterEx(GetFuuID(), function (data) {
            // 设置登录回调接口
            plazaMsgManager.SetLogonCallBack(
                function () // 连接服务器失败
                {
                    // 连接失败重试
                    //layerManager.PopTipLayer(new PopTipsUILayer("重试", "取消", "当前网络异常，请检查网络状态后重试！", function (id) {
                    //    if (id == clickid.ok) {
                    //        plazaMsgManager.LogonPlazaEx(data["accounts"], data["password"], GetFuuID(), "");//默认以前登录方式
                    //    }
                    //
                    //}));
                },
                function () // 登录大厅成功
                {
                    // 添加提交版本的开关
                    if (SubMitAppstoreVersion == true ||  DoNotMatchRoomVersion == true) {
                        //先获取金币房间数据，如果是非法的就去服务器拉取
                        var roomdata = roomManager.GetGoldRoomData();
                        if ((roomdata === undefined) ||
                            (roomdata === null) ||
                            (roomdata.length === 0)) {

                            // 获取金币房间数据成功，立即进入场次列表
                            webMsgManager.SendGpGoldFiled(function (data) {

                                    roomManager.SetGoldRoomData(data);

                                    var curLayer = new RoomUILayer();
                                    curLayer.setTag(ClientModuleType.GoldField);
                                    layerManager.repalceLayer(curLayer);
                                    curLayer.refreshView(RoomType.ROOM_TYPE_GOLD);  //
                                    //DataUtil.SetGoToModule(ClientModuleType.Plaza);
                                },
                                function (errinfo) {
                                },
                                this);
                        } else {
                            var curLayer = new RoomUILayer();
                            curLayer.setTag(ClientModuleType.GoldField);
                            layerManager.repalceLayer(curLayer);
                            curLayer.refreshView(RoomType.ROOM_TYPE_GOLD);  //
                            // DataUtil.SetGoToModule(ClientModuleType.Plaza);
                        }

                    } else {
                        var curLayer = new PlazaUILayer();  //不在调用
                        curLayer.setTag(ClientModuleType.Plaza);
                        layerManager.repalceLayer(curLayer);
                    }

                },
                function (info) { // 登录大厅失败

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
            layerManager.PopTipLayer(new PopAutoTipsUILayer(errinfo, DefultPopTipsTime), true);

        }, this);
    },
    // 设置公告信息
    SetNoticeInFo: function (info) {
        if (info.length == 0)
            return;

        // 这是公告文字，跑马灯效果
        var text_notice_info = ccui.helper.seekWidgetByName(this.parentView, "text_notice_info");
        text_notice_info.setString(info);

        //获取公告面板位置
        text_notice_info.unscheduleAllCallbacks();
        text_notice_info.schedule(function () {
            var width = this.getStringLength() * this.getFontSize();
            this.setPositionX(this.getPositionX() - 1.5);
            if (this.getPositionX() < -width) {
                text_notice_info.unscheduleUpdate();
                text_notice_info.unscheduleAllCallbacks();
            }

        }, 0.01, cc.REPEAT_FOREVER);
    },
    // 设置登录历史
    SetLogonHistory: function () {
        this.panel_user_info = ccui.helper.seekWidgetByName(this.parentView, "panel_user_info");
        if (this.lastHistoryData !== null) {
            this.ShowLogonPanel(true);
            this.SetLogonUserInFo(this.lastHistoryData);

        } else {
            this.ShowLogonPanel(false);
        }

        var self = this;
        //玩家板关闭按钮
        var btn_panel_close = ccui.helper.seekWidgetByName(this.parentView, "btn_panel_close");
        btn_panel_close.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                self.ShowLogonPanel(false);
            }
        }, this);


    },

    // 显示\隐藏登录面板
    ShowLogonPanel: function (bShow) {
        if (bShow) {
            //显示登录历史面板
            this.panel_user_info.setVisible(true);
            this.btn_register.setVisible(false);
            this.btn_now_login.setVisible(true);
            this.btn_login.setVisible(false);

            this.btn_privacy_select.setVisible(false);
            this.btn_privacy.setVisible(false);
            //this.btn_privacy_unselect.setVisible(false);
            this.btn_telcomregister.setVisible(false);

        } else {
            //隐藏登录历史面板
            this.panel_user_info.setVisible(false);
            if(GetDeviceType() != DeviceType.ANDROID || ChannelLabel == "8633" || ChannelLabel == "baiduSingle")
            {
                this.btn_register.setVisible(true);
            }
            this.btn_now_login.setVisible(false);
            this.btn_login.setVisible(true);

            this.btn_privacy_select.setVisible(true);
            this.btn_privacy.setVisible(true);
            //this.btn_privacy_unselect.setVisible(false);

            if(ChannelLabel == "telcom")
            {
                this.btn_telcomregister.setVisible(true);
                this.btn_login.setVisible(false);
            }
        }
    },

    //设置登录用户信息
    SetLogonUserInFo: function (lastHistoryData) {
        this.LoadImageFrame();
        lm.log("登录用户信息: " + JSON.stringify(lastHistoryData));

        //用户头像
        var image_panel_userheader = ccui.helper.seekWidgetByName(this.panel_user_info, "image_panel_userheader");

        //用户ID
        var text_panel_userid = ccui.helper.seekWidgetByName(this.panel_user_info, "text_panel_userid");
        text_panel_userid.setString("ID:" + String(lastHistoryData["account"]));

        //用户昵称
        var text_panel_usernick = ccui.helper.seekWidgetByName(this.panel_user_info, "text_panel_usernick");
        text_panel_usernick.setString(String(lastHistoryData["nickname"]));

        //用户积分
        var text_panel_userscore = ccui.helper.seekWidgetByName(this.panel_user_info, "text_panel_userscore");
        text_panel_userscore.setContentSize(cc.size(170, 30));
        //hanhu #当金币数据过长时采用截断功能 2015/12/15
        var gold = String(lastHistoryData["gold"]);
        if(gold.length > 9)
        {
            gold = gold.substring(0, gold.length - 4) + "万";
        }
        lm.log("最终的金币数据为:" + gold + " 长度为：" + gold.length);
        text_panel_userscore.setString("金币:" + gold);

        var faceid = Number(lastHistoryData["faceid"]);
        var customfaceid = Number(lastHistoryData["customfaceid"]);
        if (customfaceid != 0) {
            //自定义头像
            if (this.CustomFaceLayer.ShowUserCustomFace(Number(lastHistoryData["userid"]), customfaceid)) {
                this.CustomFaceLayer.SetVisable(true);
            } else {
                this.CustomFaceLayer.SetVisable(false);
                var name;
                if (faceid == 0 || faceid == null) {
                    name = "1.png";
                } else {
                    name = faceid + ".png";
                }
                image_panel_userheader.loadTexture(name, 1);
            }
        }
        else {
            //系统头像
            this.CustomFaceLayer.SetVisable(false);
            var name;
            if (faceid == 0 || faceid == null) {
                name = "1.png";
            } else {
                name = faceid + ".png";
            }
            image_panel_userheader.loadTexture(name, 1);

        }
    },

    //获取大厅登录地址
    RequestAddress: function () {
        var self = this;
        lm.log("获取大厅登录地址：");
        webMsgManager.SendGetAccessAddress(function (data) {
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




            //请求公告数据
            self.RequestNoticeData();

            //获取系统时间
            self.RequestSystemTime();

            userInfo.initLocalData();
            this.lastHistoryData = userInfo.GetLastLocalData(plazaMsgManager.address);

            lm.log("last hist :" + JSON.stringify(self.lastHistoryData));

            if(GetDeviceType() != DeviceType.ANDROID || ChannelLabel == "8633" || ChannelLabel == "baiduSingle" || ChannelLabel == "telcom") //hanhu #android隐藏立即登陆 2015/10/08
            {
                self.SetLogonHistory();
            }
            // 获取失败
        }, function (errinfo) {
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

    },
    // 请求公告数据
    RequestNoticeData: function () {

        // 当前notice数据定义
        if (CurWebDataType == WebDataType.WEBDATA_TYPE_DEBUG) {

            var noticedata = {
                "nearawardrecoeds": "最近一条获奖记录",
                "noticeurl": "http://www.buletin.html",
                "noticewidth": 400,
                "noticeheight": 400
            };

            roomManager.SetNoticeData(noticedata);


        } else if (CurWebDataType == WebDataType.WEBDATA_TYPE_RELEASE) {

            //获取数据
            webMsgManager.SendGpPerLoginBuletin(function (data) {

                    roomManager.SetNoticeData(data);

                },
                function (errinfo) {


                },
                this);
        }

    },
    onExit: function ()
    {
        this._super();
        lm.log("login界面被移除了拉拉拉拉拉拉拉拉拉拉");
    }


});