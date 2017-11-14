/**
 * Created by yangyupeng on 16/4/2.
 */



var LoginType = {
    phone : 2,           //手机登录
    other : 1            //其他登录
};

var AccountSwitchUILayer = cc.Layer.extend({
    loginType:null,
    ctor: function (loginType) {
        this._super();
        this.initAccountSwitchLayer(loginType);
        this.initAndroidBackKey();


    },

    //安卓back按钮
    initAndroidBackKey:function()
    {
        if(GetDeviceType() != DeviceType.ANDROID)
            return;

        var self = this;
        this.addChild(new AndroidBackKey(function(){
            var curLayer = new AccountSettingUILayer();
            layerManager.repalceLayer(curLayer);

        },this));
    },

    initAccountSwitchLayer: function (loginType)
    {
        cc.spriteFrameCache.addSpriteFrames("res/landlord/cocosOut/setting/setting.plist");

        lm.log("yyp : AccountSwitchUILayer : initAccountSwitchLayer " + loginType);

        if(loginType == null || loginType == undefined)
        {
            lm.log("yyp : AccountSwitchUILayer : initAccountSwitchLayer start -> phone");
            AccountSwitchUILayer.loginType = LoginType.phone;
        }
        else
        {
            lm.log("yyp : AccountSwitchUILayer : initAccountSwitchLayer start -> phone");
            AccountSwitchUILayer.loginType = loginType;
        }
        lm.log("yyp : AccountSwitchUILayer : initAccountSwitchLayer " + AccountSwitchUILayer.loginType);

        var self = this;


        this.parentView = ccs.load("res/landlord/cocosOut/AccountSwitch.json").node;
        this.addChild(this.parentView);
        this.parentView.ignoreAnchorPointForPosition(false);
        this.parentView.setAnchorPoint(0.5,0.5);
        this.parentView.setPosition(winSize.width/2,winSize.height/2);

        this.org_pos = this.parentView.getPosition();
        this.origin = cc.p((winSize.width - this.parentView.getContentSize().width)/2, (winSize.height - this.parentView.getContentSize().height)/2);
        this.Image_label_bg = ccui.helper.seekWidgetByName(this.parentView, "Image_label_bg");          //label
        this.Image_label_bg.setPositionX(this.Image_label_bg.getPositionX() + this.origin.x);

        this.initTextField();
        this.initButton();
        this.initTipLayer();

    },

    //初始化一系列输入框
    initTextField: function ()
    {
        //手机号输入框
        this.no_in = ccui.helper.seekWidgetByName(this.parentView, "no_in");
        //this.text_no_in = ccui.helper.seekWidgetByName(this.no_in, "text_in");
        //this.text_no_in.addEventListener(this.textFieldEvent, this);
        this.text_no_in = layerManager.CreateDefultEditBox(this, cc.size(330, 30), cc.p(0, 0.5), cc.p(-140, 0), "请输入手机号码/邮箱账号/自定义账号", cc.color(184, 78, 37, 240), false);
        this.text_no_in.setMaxLength(17);
        this.text_no_in.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this.no_in.addChild(this.text_no_in);

        //密码输入框
        this.pw_in = ccui.helper.seekWidgetByName(this.parentView, "pw_in");
        //this.text_pw_in = ccui.helper.seekWidgetByName(this.pw_in, "text_in");
        //this.text_pw_in.addEventListener(this.textFieldEvent, this);
        this.text_pw_in = layerManager.CreateDefultEditBox(this, cc.size(200, 30), cc.p(0, 0.5), cc.p(-140, 0), "请输入6-18位密码", cc.color(184, 78, 37, 240), true);
        this.text_pw_in.setMaxLength(18);
        this.text_pw_in.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this.pw_in.addChild(this.text_pw_in);

    },

    initTipLayer: function()
    {
        var self = this;

        this.tipLayer = ccui.helper.seekWidgetByName(this.parentView, "tipLayer");
        this.tip_text = ccui.helper.seekWidgetByName(this.parentView, "tip_text");
        this.tip_login = ccui.helper.seekWidgetByName(this.parentView, "tip_login");
        this.tip_login.setPressedActionEnabled(true);
        this.tip_login.addTouchEventListener(function (sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                var curLayer = new AccountUpgradeUILayer();
                layerManager.repalceLayer(curLayer);
            }
        }, this);


        this.tip_back = ccui.helper.seekWidgetByName(this.parentView, "tip_back");
        this.tip_back.setPressedActionEnabled(true);
        this.tip_back.addTouchEventListener(function (sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                this.tipLayer.setVisible(false);
            }
        }, this);

    },

    //输入框获得焦点
    editBoxEditingDidBegin: function (sender) {
        if(GetDeviceType() != DeviceType.ANDROID)
        {
            this.parentView.setPosition(cc.p(this.org_pos.x, this.org_pos.y + winSize.height * 0.2))
        }
    },

    //输入框失去焦点
    editBoxEditingDidEnd: function (sender) {

        if(GetDeviceType() != DeviceType.ANDROID)
        {
            this.parentView.setPosition(this.org_pos);
        }

        //判断是哪个输入框，做不同的事
        if(sender.getParent().getName() == "no_in")     //手机号码输入框
        {
            this.checkMobileNo();
        }
        else if(sender.getParent().getName() == "pw_in")
        {
            this.checkPassWord();
        }

    },

    //初始化一系列输入框
    initButton: function ()
    {
        var self = this;

        //返回账号设置界面按钮
        this.btn_back = ccui.helper.seekWidgetByName(this.parentView, "btn_back");
        //this.btn_back.setPositionX(this.btn_back.getPositionX() - this.origin.x);
        this.btn_back.setPressedActionEnabled(true);
        this.btn_back.addTouchEventListener(function (sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                lm.log("yyp : AccountSwitchUILayer : btn_back click! ");
                var curLayer = new AccountSettingUILayer();
                layerManager.repalceLayer(curLayer);
            }
        }, this);




        //登录按钮
        this.btn_login = ccui.helper.seekWidgetByName(this.parentView, "btn_login");
        this.btn_login.setPressedActionEnabled(true);
        this.btn_login.addTouchEventListener(this.tologin, this);


        //注册账号按钮
        this.btn_register = ccui.helper.seekWidgetByName(this.parentView, "btn_register");
        this.btn_register.setPressedActionEnabled(true);
        this.btn_register.addTouchEventListener(function (sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                lm.log("yyp : AccountSwitchUILayer : btn_register click! ");
                var curLayer = new AccountUpgradeUILayer();
                layerManager.repalceLayer(curLayer);
            }
        }, this);

        //找回密码
        this.btn_findpassword = ccui.helper.seekWidgetByName(this.parentView, "btn_findpassword");
        this.btn_findpassword.setPressedActionEnabled(true);
        this.btn_findpassword.addTouchEventListener(function (sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                lm.log("yyp : AccountSwitchUILayer : btn_before_login click! ");
                var curLayer = new AccountRetrievePasswordUILayer();
                layerManager.repalceLayer(curLayer);
            }
        }, this);

        //为他账号登录
        //this.btn_other = ccui.helper.seekWidgetByName(this.parentView, "btn_other");
        //this.btn_other.setVisible(false);
        //this.btn_other.setPressedActionEnabled(true);
        //this.btn_other.addTouchEventListener(function (sender, type)
        //{
        //    if (type == ccui.Widget.TOUCH_ENDED)
        //    {
        //        lm.log("yyp : AccountSwitchUILayer : btn_other click! ");
        //        var curLayer = new AccountSwitchUILayer(LoginType.other);
        //        layerManager.repalceLayer(curLayer);
        //    }
        //}, this);
        //
        //if(AccountSwitchUILayer.loginType == LoginType.phone)
        //{
        //    this.btn_other.setVisible(true);
        //
        //}

    },

    //检测手机号码是否被绑定
    checkMobileNo: function ()
    {
        //不在需要检测 以为此处可以输入旧账号
        return;
        var self = this;
        // 发送获取手机验证码
        var mobile = this.text_no_in.getString();
        lm.log("yyp : AccountUpgradeUILayer : getTestNo ：phone no is [" + mobile + "]");

        if(mobile == null || mobile.length == 0)
        {
            layerManager.addLayerToParent(new PopAutoTipsUILayer("手机号不能为空！",DefultPopTipsTime), this);
        }
        webMsgManager.SendGpCheckMobileNoBinding_EX (mobile, function(data)
            {
                // 手机号码符合要求
                lm.log("yyp : AccountUpgradeUILayer : getTestNo ：mobile is binding!");
            },
            function(responseText)
            {
                if(responseText == "该手机号码没有绑定任何帐号！")
                {
                    this.tipLayer.setVisible(true);
                    this.tip_text.setString("您的手机号未注册，请前往升级账号");
                }
                else
                {
                    // 其他错误提示
                    layerManager.addLayerToParent(new PopAutoTipsUILayer(responseText,DefultPopTipsTime), this);
                }

            }, this);

    },

    //检测密码是否符合规定
    checkPassWord: function ()
    {
        // 发送获取手机验证码
        var pw = this.text_pw_in.getString();
        lm.log("yyp : AccountUpgradeUILayer : checkPassWord ：password is [" + pw + "]");

        if(this.isRegisterPassWord(pw))
        {
            return;
        }
        else
        {
            // 提示
            var responseText = "密码不能为空";
            layerManager.addLayerToParent(new PopAutoTipsUILayer(responseText,DefultPopTipsTime), this);
            this.text_pw_in.setString("");
        }
    },

    //判断密码是否合法
    isRegisterPassWord:function(pw)
    {
        if(pw != null && pw.length != 0)
            return true;
        return false;

        //var patrn=/^[a-zA-Z]{1}([a-zA-Z0-9]|[_]){5,17}$/;
        //if (!patrn.exec(pw))
        //    return false;
        //
        //return true;
    },

    //登录
    tologin: function (sender, type)
    {
        if (type == ccui.Widget.TOUCH_ENDED)
        {
            lm.log("yyp : AccountSwitchUILayer : btn_login click! ");

            //手机号码或者用户名
            var userName = this.text_no_in.getString();
            if ((userName == null) || (userName.length == 0)) {
                layerManager.addLayerToParent(new PopAutoTipsUILayer("账号不能为空，请输入账号！", DefultPopTipsTime), this);
                return;
            }

            var passWord = this.text_pw_in.getString();
            if ((passWord == null) || (passWord.length == 0)) {
                layerManager.addLayerToParent(new PopAutoTipsUILayer("密码不符合规则，请重新输入！", DefultPopTipsTime), this);
                return;
            }

            // 设置登录回调接口
            plazaMsgManager.SetLogonCallBack(
                function () // 连接服务器失败
                {
                    lm.log("yyp : AccountSwitchUILayer : tologin 连接失败重试");
                    // 连接失败重试
                    var pop = new ConfirmPop(this, Poptype.yesno,"当前网络异常，请检查网络状态后重试！");//ok
                    pop.addToNode(cc.director.getRunningScene());
                    pop.hideCloseBtn();
                    pop.setYesNoCallback(
                        function(){
                            plazaMsgManager.LogonPlaza(userName, passWord, GetFuuID(), "");
                        },
                        function()
                        {
                            ExitGameEx();
                        }
                    );

                    //layerManager.PopTipLayer(new PopTipsUILayer("重试", "取消", "当前网络异常，请检查网络状态后重试！", function (id) {
                    //    if (id == clickid.ok) {
                    //        // 登录大厅
                    //        //if(AccountSwitchUILayer.loginType == LoginType.phone)
                    //        //{
                    //        //    plazaMsgManager.LogonPlazaByMobileNo(userName, passWord, GetFuuID(), "");
                    //        //}
                    //        //else
                    //        {
                    //            plazaMsgManager.LogonPlaza(userName, passWord, GetFuuID(), "");
                    //        }
                    //    }
                    //
                    //}), true);

                },
                function () // 登录大厅成功
                {
                    lm.log("切换帐号，清理数据");
                    matchMsgManager.ClearMatchData();
                    MatchSignInArray = [];
                    plazaMsgManager.updatenofify = false;
                    plazaMsgManager.needinputinsturepass = false;
                    plazaMsgManager.ReConnectCount = 0;
                    sparrowDirector.ReConnectCount=0;
                    matchMsgManager.ReConnectCount = 0;

                    lm.log("yyp : AccountSwitchUILayer : tologin 登录大厅成功");
                    if (SubMitAppstoreVersion == true || DoNotMatchRoomVersion == true) {
                        //先获取金币房间数据，如果是非法的就去服务器拉取

                        var curLayer = new RoomUILayer();
                        curLayer.setTag(ClientModuleType.GoldField);
                        layerManager.repalceLayer(curLayer);
                        if ( Is_LAIZI_ROOM())
                        {
                            curLayer.refreshView(RoomType.ROOM_TYPE_LAIZI);
                        }
                        else if ( Is_HAPPY_ROOM())
                        {
                            curLayer.refreshView(RoomType.ROOM_TYPE_HAPPY);
                        }
                        else
                        {
                            curLayer.refreshView(RoomType.ROOM_TYPE_GOLD);
                        }

                    } else {

                        var curLayer = new PlazaUILayer();
                        curLayer.setTag(ClientModuleType.Plaza);
                        layerManager.repalceLayer(curLayer);
                    }

                },
                function (info) { // 登录大厅失败
                    var pop = new ConfirmPop(this, Poptype.ok, info);//ok
                    pop.addToNode(cc.director.getRunningScene());
                }, this);


            // 保存当前玩家信息
            userInfo.SetCurPlayerInFo(userName, passWord);

            layerManager.PopTipLayer(new WaitUILayer("正在登录服务器，请稍后...", function () {

            }, this));

            // 登录大厅
            //if(AccountSwitchUILayer.loginType == LoginType.phone)
            //{
            //    lm.log("yyp : AccountSwitchUILayer : LogonPlazaByMobileNo " + userName + "  " + passWord);
            //    plazaMsgManager.LogonPlazaByMobileNo(userName, passWord, GetFuuID(), "");
            //}
            //else
            {
                lm.log("yyp : AccountSwitchUILayer : LogonPlaza " + userName + "  " + passWord);
                plazaMsgManager.LogonPlaza(userName, passWord, GetFuuID(), "");
            }

        }
    }

});
