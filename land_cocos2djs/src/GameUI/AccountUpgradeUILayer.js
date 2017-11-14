/**
 * Created by yangyupeng on 16/4/2.
 */


var AccountUpgradeUILayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        this.initAccountUpgradeLayer();
        this.initAndroidBackKey();

    },

    //安卓back按钮
    initAndroidBackKey:function()
    {
        if(GetDeviceType() != DeviceType.ANDROID)
            return;

        var self = this;
        this.addChild(new AndroidBackKey(function(){
            if(self.tipLayer.isVisible())
            {
                self.tipLayer.setVisible(false);
            }
            else
            {
                var curLayer = new AccountSettingUILayer();
                layerManager.repalceLayer(curLayer);
            }
        },this));
    },

    initAccountUpgradeLayer: function ()
    {
        cc.spriteFrameCache.addSpriteFrames("res/landlord/cocosOut/setting/setting.plist");

        var self = this;

        lm.log("yyp : AccountUpgradeUILayer : initAccountUpgradeLayer start");

        this.parentView = ccs.load("res/landlord/cocosOut/AccountUpgrade.json").node;
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
        this.text_no_in = layerManager.CreateDefultEditBox(this, cc.size(330, 30), cc.p(0, 0.5), cc.p(-140, 0), "请输入11手机号码", cc.color(184, 78, 37, 240), false);
        this.text_no_in.setMaxLength(11);
        this.text_no_in.setInputMode(cc.EDITBOX_INPUT_MODE_PHONENUMBER);
        this.no_in.addChild(this.text_no_in);

        //密码输入框
        this.pw_in = ccui.helper.seekWidgetByName(this.parentView, "pw_in");
        //this.text_pw_in = ccui.helper.seekWidgetByName(this.pw_in, "text_in");
        //this.text_pw_in.addEventListener(this.textFieldEvent, this);
        this.text_pw_in = layerManager.CreateDefultEditBox(this, cc.size(330, 30), cc.p(0, 0.5), cc.p(-140, 0), "请输入6-18位密码", cc.color(184, 78, 37, 240), true);
        this.text_pw_in.setMaxLength(18);
        this.text_pw_in.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this.pw_in.addChild(this.text_pw_in);

        //确认密码输入框
        this.pw_confirm = ccui.helper.seekWidgetByName(this.parentView, "pw_confirm");
        //this.text_pw_confirm = ccui.helper.seekWidgetByName(this.pw_confirm, "text_in");
        //this.text_pw_confirm.addEventListener(this.textFieldEvent, this);
        this.text_pw_confirm = layerManager.CreateDefultEditBox(this, cc.size(330, 30), cc.p(0, 0.5), cc.p(-140, 0), "再次输入密码", cc.color(184, 78, 37, 240), true);
        this.text_pw_confirm.setMaxLength(18);
        this.text_pw_confirm.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this.pw_confirm.addChild(this.text_pw_confirm);

        //游戏昵称输入框
        this.nickname_in = ccui.helper.seekWidgetByName(this.parentView, "nickname_in");
        //this.text_nickname_in = ccui.helper.seekWidgetByName(this.nickname_in, "text_in");
        //this.text_nickname_in.addEventListener(this.textFieldEvent, this);
        this.text_nickname_in = layerManager.CreateDefultEditBox(this, cc.size(330, 30), cc.p(0, 0.5), cc.p(-140, 0), "请输入属于您的专属昵称", cc.color(184, 78, 37, 240), false);
        this.text_nickname_in.setMaxLength(20);
        this.text_nickname_in.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this.nickname_in.addChild(this.text_nickname_in);

        //验证码输入框
        this.testno_in = ccui.helper.seekWidgetByName(this.parentView, "testno_in");
        //this.text_testno_in = ccui.helper.seekWidgetByName(this.testno_in, "text_in");
        //this.text_testno_in.addEventListener(this.textFieldEvent, this);
        this.text_testno_in = layerManager.CreateDefultEditBox(this, cc.size(200, 30), cc.p(0, 0.5), cc.p(-140, 0), "短信验证码", cc.color(184, 78, 37, 240), false);
        this.text_testno_in.setMaxLength(6);
        this.text_testno_in.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
        this.testno_in.addChild(this.text_testno_in);
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
            this.needConfirm == false;
            this.checkMobileNo();
        }
        else if(sender.getParent().getName() == "pw_in")
        {
            this.checkPassWord();
        }
        else if(sender.getParent().getName() == "pw_confirm")
        {
            this.checkPassWordConfirm();
        }
        else if(sender.getParent().getName() == "nickname_in")
        {
            this.checkNickname();
        }
        else if(sender.getParent().getName() == "testno_in")
        {
            this.checkTestNo();

        }
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
                lm.log("yyp : AccountUpgradeUILayer : btn_back click! ");
                var curLayer = new AccountSettingUILayer();
                layerManager.repalceLayer(curLayer);
            }
        }, this);


        //获取验证码按钮
        var btn_getTestNo = ccui.helper.seekWidgetByName(this.parentView,"btn_getTestNo");
        btn_getTestNo.setPressedActionEnabled(true);
        btn_getTestNo.addTouchEventListener(this.getTestNo, this);


        //马上注册按钮
        this.btn_register = ccui.helper.seekWidgetByName(this.parentView, "btn_register");
        this.btn_register.setPressedActionEnabled(true);
        this.btn_register.addTouchEventListener(this.register_atonce, this);


        //已有账号登录按钮
        this.btn_before_login = ccui.helper.seekWidgetByName(this.parentView, "btn_before_login");
        this.btn_before_login.setPressedActionEnabled(true);
        this.btn_before_login.addTouchEventListener(function (sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                lm.log("yyp : AccountUpgradeUILayer : btn_before_login click! ");
                var curLayer = new AccountSwitchUILayer();
                layerManager.repalceLayer(curLayer);
            }
        }, this);

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
                if(sender.getTag() == 1)
                {
                    //关闭连接
                    CloseGameSocket(KernelPlaza);
                    CloseGameSocket(KernelCurrent);

                    userInfo.ClearUserData();

                    cc.director.runScene(new rootUIScene(this.text_no_in.getString(),this.text_pw_in.getString()));
                    matchMsgManager.ClearMatchData();
                    sparrowDirector.ClearAllData();
                }
                else
                {
                    var curLayer = new AccountSwitchUILayer();
                    layerManager.repalceLayer(curLayer);
                }
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
                else if(sender.getParent().getName() == "pw_confirm")
                {
                    this.checkPassWordConfirm();
                }
                else if(sender.getParent().getName() == "nickname_in")
                {
                    this.checkNickname();
                }
                else if(sender.getParent().getName() == "testno_in")
                {
                    this.checkTestNo();

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
        var self = this;
        // 发送获取手机验证码
        var mobile = this.text_no_in.getString();
        lm.log("yyp : AccountUpgradeUILayer : getTestNo ：phone no is [" + mobile + "]");

        if(mobile == null || mobile.length == 0)
        {
            layerManager.addLayerToParent(new PopAutoTipsUILayer("手机号不能为空！",DefultPopTipsTime), this);
        }
        webMsgManager.SendGpCheckMobileNoBinding (mobile, function(data)
            {

                // 手机号码符合要求
                lm.log("yyp : AccountUpgradeUILayer : getTestNo ：mobile no is right!" + JSON.stringify(data));
                if(data["state"] == 1)
                {
                    self.tipLayer.setVisible(true);
                    self.tip_login.setTag(0);
                    self.tip_back.setVisible(true);
                    self.tip_back.setTouchEnabled(true);
                    self.tip_text.setString("此手机号码已绑定平台账号,请前往登录！");
                    self.text_no_in.setString("");
                }
                else if(data["state"] == 2)
                {
                    //layerManager.addLayerToParent(new PopAutoTipsUILayer("可以覆盖渠道账号",DefultPopTipsTime), this);
                    self.needConfirm = true;
                }
                
            },
            function(responseText)
            {
                if(responseText == "此手机号码已绑定其它账号！")
                {
                    self.tipLayer.setVisible(true);
                    self.tip_login.setTag(0);
                    self.tip_back.setVisible(true);
                    self.tip_back.setTouchEnabled(true);
                    self.tip_text.setString("您的手机号码已经注册，是否去登录?");
                    self.text_no_in.setString("");
                }
                else
                {
                    // 其他错误提示
                    layerManager.addLayerToParent(new PopAutoTipsUILayer(responseText,DefultPopTipsTime), this);
                    self.text_no_in.setString("");
                }

            }, this);
        return true;
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
            webMsgManager.SendGpGetMobileVerificationCode (mobile, function(data)
                {
                    // 获取手机号码完成，服务器无返回消息
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
        return true;
    },

    //立即注册按钮
    register_atonce: function (sender, type)
    {
        if (type == ccui.Widget.TOUCH_ENDED)
        {
            if (!this.checkInputTxt())
            {
                return;
            }

            var mobile = this.text_no_in.getString();
            var pw = this.text_pw_in.getString();
            var nickname = this.text_nickname_in.getString();
            var testno = this.text_testno_in.getString();

            var self = this;
            if(this.needConfirm != undefined || self.needConfirm != null)
            {
                if(this.needConfirm == true)
                {
                    var pop = new ConfirmPop(this, Poptype.yesno, "是否要解绑并绑定至此手机?");//ok
                    pop.addToNode(cc.director.getRunningScene());
                    pop.setYesNoCallback(
                        function()
                        {
                            webMsgManager.SendGpBuildMobileEx (mobile, pw, nickname, testno,function(data)
                                {
                                    // 获取手机号码完成，服务器无返回消息
                                    lm.log("----绑定成功!");

                                    this.tipLayer.setVisible(true);
                                    this.tip_login.setTag(1);
                                    this.tip_back.setVisible(false);
                                    this.tip_back.setTouchEnabled(false);
                                    this.tip_text.setString("绑定成功，去登录吧!");

                                },
                                function(responseText)
                                {
                                    // 其他错误提示
                                    layerManager.addLayerToParent(new PopAutoTipsUILayer(responseText,DefultPopTipsTime), this);

                                }, this);
                        },
                        function()
                        {
                        }
                    );
                    return;
                }
            }
            webMsgManager.SendGpBuildMobileEx (mobile, pw, nickname, testno,function(data)
                {
                    // 获取手机号码完成，服务器无返回消息
                    lm.log("----绑定成功!");

                    this.tipLayer.setVisible(true);
                    this.tip_login.setTag(1);
                    this.tip_back.setVisible(false);
                    this.tip_back.setTouchEnabled(false);
                    this.tip_text.setString("绑定成功，去登录吧!");

                },
                function(responseText)
                {
                    // 其他错误提示
                    layerManager.addLayerToParent(new PopAutoTipsUILayer(responseText,DefultPopTipsTime), this);

                }, this);
        }
    },

//输入框事件判定
    checkInputTxt: function ()
    {
        var mobile = this.text_no_in.getString();
        var pw = this.text_pw_in.getString();
        var pw_confirm = this.text_pw_confirm.getString();
        var nickname = this.text_nickname_in.getString();
        var testno = this.text_testno_in.getString();

        if ( mobile == null || mobile.length == 0 )
        {
            layerManager.addLayerToParent(new PopAutoTipsUILayer("手机号不能为空！",DefultPopTipsTime), this);
            return false;
        }
        if ( pw == null || pw.length == 0 )
        {
            layerManager.addLayerToParent(new PopAutoTipsUILayer("密码不能为空！",DefultPopTipsTime), this);
            return false;
        }
        if ( pw_confirm == null || pw_confirm.length == 0 )
        {
            layerManager.addLayerToParent(new PopAutoTipsUILayer("确认密码不能为空！",DefultPopTipsTime), this);
            return false;
        }
        if ( pw != pw_confirm )
        {
            layerManager.addLayerToParent(new PopAutoTipsUILayer("两次输入密码不一致！",DefultPopTipsTime), this);
            return false;
        }
        if ( nickname == null || nickname.length == 0 )
        {
            layerManager.addLayerToParent(new PopAutoTipsUILayer("昵称不能为空！",DefultPopTipsTime), this);
            return false;
        }
        if ( testno == null || testno.length == 0 )
        {
            layerManager.addLayerToParent(new PopAutoTipsUILayer("验证码不能为空！",DefultPopTipsTime), this);
            return false;
        }

        return true;
    },

    //检测密码是否符合规定
    checkPassWord: function ()
    {
        // 发送获取手机验证码
        var pw = this.text_pw_in.getString();
        lm.log("yyp : AccountUpgradeUILayer : checkPassWord ：password is [" + pw + "]");

        if(this.isRegisterPassWord(pw))
        {
            this.text_pw_confirm.setString("");
            return;
        }
        else
        {
            // 提示
            var responseText = "密码是6-18个以字母开头、可带数字、“_”的字串";
            layerManager.addLayerToParent(new PopAutoTipsUILayer(responseText,DefultPopTipsTime), this);
            this.text_pw_in.setString("");
        }
    },

    //检测两次密码是否一致
    checkPassWordConfirm: function ()
    {
        // 发送获取手机验证码
        var pw = this.text_pw_in.getString();
        var pw_confirm = this.text_pw_confirm.getString();
        lm.log("yyp : AccountUpgradeUILayer : checkPassWord ：password is [" + pw + "]");
        lm.log("yyp : AccountUpgradeUILayer : checkPassWord ：password_confirm is [" + pw_confirm + "]");

        if(pw == pw_confirm)
        {
            return;
        }
        else
        {
            // 提示
            var responseText = "两次密码应该保持一致!";
            layerManager.addLayerToParent(new PopAutoTipsUILayer(responseText,DefultPopTipsTime), this);
        }
    },

    //检测昵称是否符合规定
    checkNickname: function ()
    {
        // 发送获取手机验证码
        var nickname = this.text_nickname_in.getString();
        lm.log("yyp : AccountUpgradeUILayer : checkNickname ：nickname is [" + nickname + "]");

        if(this.isRegisterNickname(nickname))
        {
            return;
        }
        else
        {
            // 提示
            var responseText = "游戏昵称必须小于12个字符!";
            layerManager.addLayerToParent(new PopAutoTipsUILayer(responseText,DefultPopTipsTime), this);
            this.text_nickname_in.setString("");
        }
    },

    //检测验证码是否符合规定
    checkTestNo: function ()
    {
        // 发送获取手机验证码
        var testNo = this.text_testno_in.getString();
        lm.log("yyp : AccountUpgradeUILayer : checkNickname ：testNo is [" + testNo + "]");

        if(this.isRegisterTestNo(testNo))
        {
            return;
        }
        else
        {
            // 提示
            var responseText = "验证码是6个数字!";
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

    //判断昵称是否合法
    isRegisterNickname:function(nickname)
    {
        if (nickname.length > 12)
            return false;

        return true;
    },


    //判断马上注册按钮是否可用
    isRegisterTestNo:function(testno)
    {
        var patrn=/^[0-9]{1,20}$/;
        if (!patrn.exec(testno))
            return false;

        return true;
    }
});
