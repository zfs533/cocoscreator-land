/**
 * Created by yangyupeng on 16/4/2.
 */


var AccountRetrievePasswordUILayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        this.initAccountRetrievePasswordLayer();
        this.initAndroidBackKey();


    },

    //安卓back按钮
    initAndroidBackKey:function()
    {
        if(GetDeviceType() != DeviceType.ANDROID)
            return;

        var self = this;
        this.addChild(new AndroidBackKey(function(){
            if(self.Panel_step1_layer.isVisible())
            {
                var curLayer = new AccountSwitchUILayer();
                layerManager.repalceLayer(curLayer);
            }
            else
            {
                self.Panel_step1_layer.setVisible(true);
                self.Panel_step2_layer.setVisible(false);
            }

        },this));
    },

    initAccountRetrievePasswordLayer: function()
    {
        cc.spriteFrameCache.addSpriteFrames("res/landlord/cocosOut/setting/setting.plist");

        lm.log("yyp : AccountRetrievePasswordUILayer : initAccountRetrievePasswordLayer start");

        this.parentView = ccs.load("res/landlord/cocosOut/AccountRetrievePassword.json").node;
        this.addChild(this.parentView);
        this.parentView.ignoreAnchorPointForPosition(false);
        this.parentView.setAnchorPoint(0.5,0.5);
        this.parentView.setPosition(winSize.width/2,winSize.height/2);

        this.org_pos = this.parentView.getPosition();
        this.origin = cc.p((winSize.width - this.parentView.getContentSize().width)/2, (winSize.height - this.parentView.getContentSize().height)/2);
        this.Image_label_bg = ccui.helper.seekWidgetByName(this.parentView, "Image_label_bg");          //label
        this.Image_label_bg.setPositionX(this.Image_label_bg.getPositionX() + this.origin.x);

        //进入找回密码界面，首先隐藏第二步输入验证码的layer
        this.Panel_step1_layer = ccui.helper.seekWidgetByName(this.parentView, "Panel_step1");
        this.Panel_step1_layer.setVisible(true);
        this.Panel_step2_layer = ccui.helper.seekWidgetByName(this.parentView, "Panel_step2");
        this.Panel_step2_layer.setVisible(false);


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
        this.text_no_in = layerManager.CreateDefultEditBox(this, cc.size(330, 30), cc.p(0, 0.5), cc.p(-135, -17), "请输入11手机号码", cc.color(184, 78, 37, 240), false);
        this.text_no_in.setMaxLength(11);
        this.text_no_in.setInputMode(cc.EDITBOX_INPUT_MODE_PHONENUMBER);
        this.no_in.addChild(this.text_no_in);

        //密码输入框
        this.pw_in = ccui.helper.seekWidgetByName(this.parentView, "pw_in");
        //this.text_pw_in = ccui.helper.seekWidgetByName(this.pw_in, "text_in");
        //this.text_pw_in.addEventListener(this.textFieldEvent, this);
        this.text_pw_in = layerManager.CreateDefultEditBox(this, cc.size(330, 30), cc.p(0, 0.5), cc.p(-135, -55), "请输入6-18位密码", cc.color(184, 78, 37, 240), true);
        this.text_pw_in.setMaxLength(18);
        this.text_pw_in.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this.pw_in.addChild(this.text_pw_in);


        //验证码输入框 - 第二步
        this.testno_in = ccui.helper.seekWidgetByName(this.parentView, "testno_in");
        //this.text_testno_in = ccui.helper.seekWidgetByName(this.testno_in, "text_in");
        //this.text_testno_in.addEventListener(this.textFieldEvent, this);
        this.text_testno_in = layerManager.CreateDefultEditBox(this, cc.size(200, 30), cc.p(0, 0.5), cc.p(-140, 0), "短信验证码", cc.color(184, 78, 37, 240), false);
        this.text_testno_in.setMaxLength(6);
        this.text_testno_in.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
        this.testno_in.addChild(this.text_testno_in);

        this.pw_tip = ccui.helper.seekWidgetByName(this.parentView, "pw_tip");
    },

    //初始化一系列按钮
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
                lm.log("yyp : AccountRetrievePasswordUILayer : btn_back click! ");

                if(this.Panel_step1_layer.isVisible())
                {
                    var curLayer = new AccountSwitchUILayer();
                    layerManager.repalceLayer(curLayer);
                }
                else
                {
                    this.Panel_step1_layer.setVisible(true);
                    this.Panel_step2_layer.setVisible(false);
                }
            }
        }, this);


        //下一步
        this.btn_next_step1 = ccui.helper.seekWidgetByName(this.parentView, "btn_next_step1");
        this.btn_next_step1.setPressedActionEnabled(true);
        this.btn_next_step1.addTouchEventListener(function (sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                lm.log("yyp : AccountRetrievePasswordUILayer : btn_next_step1 click! ");

                //手机号码
                var mobile = this.text_no_in.getString();
                if ((mobile == null) || (mobile.length == 0)) {
                    layerManager.addLayerToParent(new PopAutoTipsUILayer("手机号不能为空！", DefultPopTipsTime), this);
                    return;
                }

                //密码
                var pw = this.text_pw_in.getString();
                if ((pw == null) || (pw.length == 0)) {
                    layerManager.addLayerToParent(new PopAutoTipsUILayer("密码不能为空！", DefultPopTipsTime), this);
                    return;
                }

                this.pw_tip.setString("您的新密码是" + this.getShowPw(pw) + ",请验证您的手机 ");
                this.Panel_step1_layer.setVisible(false);
                this.Panel_step2_layer.setVisible(true);
            }
        }, this);

        //下一步
        this.btn_next_step2 = ccui.helper.seekWidgetByName(this.parentView, "btn_next_step2");
        this.btn_next_step2.setPressedActionEnabled(true);
        this.btn_next_step2.addTouchEventListener(this.retrievePassword, this);

        //获取验证码
        var btn_getTestNo = ccui.helper.seekWidgetByName(this.parentView,"btn_getTestNo");
        btn_getTestNo.setPressedActionEnabled(true);
        btn_getTestNo.addTouchEventListener(this.getTestNo, this);
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
                //关闭连接
                CloseGameSocket(KernelPlaza);
                CloseGameSocket(KernelCurrent);

                userInfo.ClearUserData();

                cc.director.runScene(new rootUIScene(this.text_no_in.getString(),this.text_pw_in.getString()));
                matchMsgManager.ClearMatchData();
                sparrowDirector.ClearAllData();

            }
        }, this);


        this.tip_back = ccui.helper.seekWidgetByName(this.parentView, "tip_back");
        this.tip_back.setPressedActionEnabled(true);
        this.tip_back.setVisible(false);
        this.tip_back.setTouchEnabled(false);
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
        else if(sender.getParent().getName() == "testno_in")
        {
            //this.checkTestNo();
        }

    },

    //输入框事件判定
    textFieldEvent: function (sender, type)
    {
        switch (type)
        {
            //得到焦点
            case ccui.TextField.EVENT_ATTACH_WITH_IME:    break;
            //失去焦点
            case ccui.TextField.EVENT_DETACH_WITH_IME:
                lm.log(sender.getParent().getName() + "  lost focus");
                //判断是哪个输入框，做不同的事
                if(sender.getParent().getName() == "no_in")     //手机号码输入框
                {
                    this.checkMobileNo();
                }
                else if(sender.getParent().getName() == "pw_in")
                {
                    this.checkPassWord();
                }
                else if(sender.getParent().getName() == "testno_in")
                {
                    //this.checkTestNo();
                }

                break;
            //插入文字
            case ccui.TextField.EVENT_INSERT_TEXT:  break;
            //删除文字
            case ccui.TextField.EVENT_DELETE_BACKWARD:  break;
            default:    break;
        }
    },

    //检测手机号码是否被绑定
    checkMobileNo: function ()
    {
        // 发送获取手机验证码
        var mobile = this.text_no_in.getString();
        lm.log("yyp : AccountUpgradeUILayer : getTestNo ：phone no is [" + mobile + "]");

        if(mobile == null || mobile.length == 0)
        {
            layerManager.addLayerToParent(new PopAutoTipsUILayer("手机号码不能为空!",DefultPopTipsTime), this);
            return;
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
                    //this.tipLayer.setVisible(true);
                    //this.tip_text.setString("您的手机号未注册，请前往升级账号");

                    var pop = new ConfirmPop(this, Poptype.ok, "您的手机号未注册，请前往升级账号");//ok
                    pop.addToNode(cc.director.getRunningScene());
                    pop.setokCallback(
                        function()
                        {
                            var curLayer = new AccountUpgradeUILayer();
                            layerManager.repalceLayer(curLayer);
                        }
                    );
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
            var responseText = "密码是6-18个以字母开头、可带数字、“_”的字串";
            layerManager.addLayerToParent(new PopAutoTipsUILayer(responseText,DefultPopTipsTime), this);
        }
    },

    //判断密码是否合法
    isRegisterPassWord:function(pw)
    {
        var patrn=/^[a-zA-Z]{1}([a-zA-Z0-9]|[_]){5,17}$/;
        if (!patrn.exec(pw))
            return false;

        return true;
    },

    getShowPw: function(pw)
    {
        return pw.substring(0,2) + "***" + pw.substring(5);
    },

    //获取验证码按钮
    getTestNo: function (sender, type)
    {
        if (type == ccui.Widget.TOUCH_ENDED)
        {
            //使获取验证码按钮不可用
            this.text_no_in.setEnabled(false);
            sender.setTouchEnabled(false);
            sender.runAction(
                cc.sequence(
                    cc.delayTime(1.0),
                    cc.CallFunc(function()
                    {
                        sender.setTouchEnabled(true);
                    }, this)
                )
            );

            // 发送获取手机验证码
            var mobile = this.text_no_in.getString();
            lm.log("yyp : AccountUpgradeUILayer : phone no is [" + mobile + "]");

            //手机号码为空直接提示
            if(mobile == null || mobile.length == 0)
            {
                layerManager.addLayerToParent(new PopAutoTipsUILayer("手机号不能为空！", DefultPopTipsTime), this);
                this.text_no_in.setEnabled(true);
                sender.stopAllActions();
                sender.setTouchEnabled(true);
                return;
            }

            //发送验证码 及其回调函数
            webMsgManager.SendGpGetRetrievePwVerificationCode (mobile, function(data)
                {
                    // 获取手机号码完成，服务器无返回消息
                    lm.log("yyp : AccountRetrievePasswordUILayer : data is [" + data + "]");
                    this.userid = data["userid"];
                    layerManager.addLayerToParent(new PopAutoTipsUILayer("已发送验证码，请注意短信通知！",DefultPopTipsTime), this);
                },
                function(responseText)
                {
                    // 其他错误提示
                    layerManager.addLayerToParent(new PopAutoTipsUILayer(responseText,DefultPopTipsTime), this);
                    this.text_no_in.setEnabled(true);
                    sender.stopAllActions();
                    sender.setTouchEnabled(true);

                }, this);
        }
    },

    retrievePassword:function(sender, type)
    {
        if (type == ccui.Widget.TOUCH_ENDED)
        {
            // 发送获取手机验证码
            var mobile = this.text_no_in.getString();
            var pw = this.text_pw_in.getString();
            var testno = this.text_testno_in.getString();

            //if(mobile == null || mobile.length == 0 ||
            //    pw == null || pw.length == 0 ||
            //    nickname == null || nickname.length == 0 ||
            //    testno == null || testno.length == 0 )
            //{
            //    layerManager.addLayerToParent(new PopAutoTipsUILayer("必须都填好，不能空着！", DefultPopTipsTime), this);
            //    return;
            //}

            if(!this.userid)
            {
                var pop = new ConfirmPop(this, Poptype.ok, "请先获取验证码!");//ok
                pop.addToNode(cc.director.getRunningScene());
                pop.hideCloseBtn();

                return;
            }

            webMsgManager.SendGpretrievePassword (mobile, pw, this.userid, testno,function(data)
                {
                    // 获取手机号码完成，服务器无返回消息l
                    lm.log("----找回成功!");

                    //this.tipLayer.setVisible(true);
                    //this.tip_text.setString("找回成功，去登录吧!");

                    var pop = new ConfirmPop(this, Poptype.ok, "找回成功，去登录吧!");//ok
                    pop.addToNode(cc.director.getRunningScene());
                    pop.hideCloseBtn();
                    pop.setokCallback(
                        function()
                        {
                            //关闭连接
                            CloseGameSocket(KernelPlaza);
                            CloseGameSocket(KernelCurrent);

                            userInfo.ClearUserData();

                            cc.director.runScene(new rootUIScene(this.text_no_in.getString(),this.text_pw_in.getString()));
                            matchMsgManager.ClearMatchData();
                            sparrowDirector.ClearAllData();
                        }
                    );
                },
                function(responseText)
                {
                    // 其他错误提示
                    layerManager.addLayerToParent(new PopAutoTipsUILayer(responseText,DefultPopTipsTime), this);

                }, this);
        }

    }



});
