/**
 * Created by lizhongqiang on 15/8/4.
 */


// 最小存入限制
var MinInGold = 10000;

// 最小取出限制
var MinOutGold = 1;


var SafeBoxUILayer = rootUILayer.extend({
    ctor: function () {
        this._super();

        cc.spriteFrameCache.addSpriteFrames("res/landlord/cocosOut/plaza/safeBox/safeBox.plist");

        this.parentView = ccs.load("res/landlord/cocosOut/SafeBoxLayer.json").node;
        this.addChild(this.parentView);
        //hanhu #调整保险箱坐标 2015/08/07
        var offset = (this.parentView.getContentSize().width * winSize.height / 640 - winSize.width) / 2;
        this.parentView.x -= offset;

        //hanhu #弹出软键盘时调整输入框位置 2015/09/22
        var self = this;
        this.origin = cc.p((winSize.width - this.parentView.getContentSize().width)/2, (winSize.height - this.parentView.getContentSize().height)/2);
        this.org_pos = this.parentView.getPosition();

        //调整位置
        var Image_label_bg = ccui.helper.seekWidgetByName(this.parentView, "Image_label_bg");          //label
        Image_label_bg.setPositionX(Image_label_bg.getPositionX() + this.origin.x);

        //保险箱界面
        {
            this.layer_safeBox = ccui.helper.seekWidgetByName(this.parentView, "layer_safeBox");

            // 宝箱箱内现有金币
            this.text_safedeposbox_inglod = ccui.helper.seekWidgetByName(this.parentView, "text_safedeposbox_inglod");

            // 存取输入框
            var text_safedeposbox_outgold_old = ccui.helper.seekWidgetByName(this.parentView, "text_safedeposbox_outgold");
            text_safedeposbox_outgold_old.setVisible(false);
            this.text_safedeposbox_outgold = layerManager.CreateDefultEditBox(this.parentView, cc.size(400, 40), cc.p(0.5, 0.5), cc.p(199, 54), "点击输入需要存取的金额", cc.color(184, 78, 37, 240), false);
            this.text_safedeposbox_outgold.setLocalZOrder(text_safedeposbox_outgold_old.getLocalZOrder());
            this.layer_safeBox.addChild(this.text_safedeposbox_outgold);

            // 存入
            this.btn_safedeposbox_in = ccui.helper.seekWidgetByName(this.parentView, "btn_safedeposbox_in");
            this.btn_safedeposbox_in.setPressedActionEnabled(true);
            this.btn_safedeposbox_in.addTouchEventListener(function (sender, type)
            {
                if (type == ccui.Widget.TOUCH_ENDED)
                {
                    var gold =  self.text_safedeposbox_outgold.getString();
                    lm.log("yyyp in [" + gold + " " + Number(gold) + "]");
                    if(gold === null || gold.length === 0 || Number(gold) < MinInGold || isNaN(Number(gold))  )
                    {
                        layerManager.PopTipLayer(new PopAutoTipsUILayer("存入保险箱最低额度为"+ MinInGold +"金币，请重新输入金额", DefultPopTipsTime),true);
                        return true;
                    }

                    // 这里发送消息时从游戏里面，在palzamsg里会受到返回消息，再做对应处理
                    plazaMsgManager.GpUserSaveScore(userInfo.globalUserdData["dwUserID"],Number(gold),"");
                }

            }, this);

            // 取出
            this.btn_safedeposbox_out  = ccui.helper.seekWidgetByName(this.parentView, "btn_safedeposbox_out");
            this.btn_safedeposbox_out.setPressedActionEnabled(true);
            this.btn_safedeposbox_out.addTouchEventListener(function (sender, type)
            {
                if (type == ccui.Widget.TOUCH_ENDED)
                {
                    var gold =  self.text_safedeposbox_outgold.getString();
                    lm.log("yyyp out [" + gold + " " + Number(gold) + "]");
                    if(gold === null || gold.length === 0 || Number(gold) < MinOutGold || isNaN(Number(gold))  )
                    {
                        layerManager.PopTipLayer(new PopAutoTipsUILayer("取出保险箱最低额度为"+ MinOutGold + "金币，请重新输入金额", DefultPopTipsTime),true);
                        return true;
                    }

                    // 这里发送消息时从游戏里面，在palzamsg里会受到返回消息，再做对应处理
                    plazaMsgManager.GpUserTakeScore(userInfo.globalUserdData["dwUserID"],Number(gold), userInfo.GetCurPlayerPassword(),GetFuuID());

                    //self.layer_safeBox_tips.setVisible(true);
                    //return;
                    //
                    //begin added by lizhongqiang 2015-10-10 16:10
                    ////需要输入密码
                    //
                    //var lastHistoryData = userInfo.GetLastLocalData(plazaMsgManager.address);
                    //
                    //if (lastHistoryData["type"] == true)   //一键注册用户
                    //{
                    //    // 这里发送消息时从游戏里面，在palzamsg里会受到返回消息，再做对应处理
                    //    plazaMsgManager.GpUserTakeScore(userInfo.globalUserdData["dwUserID"],Number(gold), userInfo.GetCurPlayerPassword(),GetFuuID());
                    //}
                    //else
                    //{
                    //    if(plazaMsgManager.needinputinsturepass == true)
                    //    {
                    //        lm.log("需要输入密码............");
                    //        self.layer_safeBox_tips.setVisible(true);
                    //    }else
                    //    {
                    //        // 这里发送消息时从游戏里面，在palzamsg里会受到返回消息，再做对应处理
                    //        plazaMsgManager.GpUserTakeScore(userInfo.globalUserdData["dwUserID"],Number(gold), userInfo.GetCurPlayerPassword(),GetFuuID());
                    //
                    //    }
                    //}
                    //
                    // end added by lizhongqiang 2015-10-10 16:10

                }

            }, this);
        }

        //保险箱取钱输入密码 界面
        {
            this.layer_safeBox_tips = ccui.helper.seekWidgetByName(this.parentView, "layer_safeBox_tips");

            // 存取输入框
            var text_safeBox_tips_pw_old = ccui.helper.seekWidgetByName(this.layer_safeBox_tips, "text_safeBox_tips_pw");
            text_safeBox_tips_pw_old.setVisible(false);

            this.text_safeBox_tips_pw = layerManager.CreateDefultEditBox(this.parentView, cc.size(320, 30), cc.p(0.0, 0.5), cc.p(-160, 33), "输入密码", cc.color(184, 78, 37, 240), true);
            this.text_safeBox_tips_pw.setLocalZOrder(text_safeBox_tips_pw_old.getLocalZOrder());
            this.layer_safeBox_tips.addChild(this.text_safeBox_tips_pw);

            // 确定
            var btn_safeBox_tips_ok = ccui.helper.seekWidgetByName(this.layer_safeBox_tips, "btn_safeBox_tips_ok");
            btn_safeBox_tips_ok.addTouchEventListener(function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {
                    var password = self.text_safeBox_tips_pw.getString();
                    if (password == undefined || password.length == 0) {
                        layerManager.addLayerToParent(new PopAutoTipsUILayer("请输入保险箱密码！", DefultPopTipsTime), self);
                        return;
                    }

                    var gold = self.text_safedeposbox_outgold.getString();
                    plazaMsgManager.GpUserTakeScore(userInfo.globalUserdData["dwUserID"], Number(gold), password, GetFuuID());

                    self.text_safeBox_tips_pw.setString("");
                    self.layer_safeBox_tips.setVisible(false);
                }

            }, this);


            // 关闭按钮
            var btn_safeBox_tips_back = ccui.helper.seekWidgetByName(this.layer_safeBox_tips, "btn_safeBox_tips_back");
            btn_safeBox_tips_back.addTouchEventListener(function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {
                    self.text_safeBox_tips_pw.setString("");
                    self.layer_safeBox_tips.setVisible(false);
                }

            }, this);
        }


        //存取款与赠送切换
        // 存入、取出金币
        //this.Panel_banOp = ccui.helper.seekWidgetByName(this.parentView, "Panel_banOp"); //hanhu #存取相关控件已转移到容器中 2016/01/21
        //this.Panel_give = ccui.helper.seekWidgetByName(this.parentView, "Panel_give");
        //this.Panel_give.setVisible(false);
        //this.Text_notice = ccui.helper.seekWidgetByName(this.parentView, "Text_notice");
        //this.Text_notice.setVisible(false);
        //this.bankButton = ccui.helper.seekWidgetByName(this.parentView, "Button_get");
        //this.bankButton.setContentSize(cc.size(395, 54));
        //this.bankButton.setScale9Enabled(true);
        //this.transButton = ccui.helper.seekWidgetByName(this.parentView, "Button_trans");
        //this.sendButton = ccui.helper.seekWidgetByName(this.Panel_give, "Button_give");
        //
        //this.text_safedeposbox_userName = layerManager.CreateDefultEditBox(this.parentView, cc.size(270, 45), cc.p(0.0, 0.5), cc.p(355, 160), "请输入玩家昵称", cc.color(255, 255, 255, 240), false);
        //this.Panel_give.addChild(this.text_safedeposbox_userName);
        //
        //this.text_safedeposbox_giveNum = layerManager.CreateDefultEditBox(this.parentView, cc.size(270, 45), cc.p(0.0, 0.5), cc.p(355, 78), "请输入金币数量", cc.color(255, 255, 255, 240), false);
        //this.Panel_give.addChild(this.text_safedeposbox_giveNum);
        //
        //this.text_safedeposbox_pwd = layerManager.CreateDefultEditBox(this.parentView, cc.size(270, 45), cc.p(0.0, 0.5), cc.p(355, -2), "请输入银行密码", cc.color(255, 255, 255, 240), true);
        //this.Panel_give.addChild(this.text_safedeposbox_pwd);
        //
        //一键注册用户自动填入密码
        //var lastData = userInfo.GetLastLocalData(plazaMsgManager.address);
        //if(lastData["type"] == true) //一键注册用户
        //{
        //    this.text_safedeposbox_pwd.setString(lastData["password"]);
        //}
        //
        //this.bankButton.addTouchEventListener(function(sender, type){
        //    if(type == ccui.Widget.TOUCH_ENDED)
        //    {
        //        this.Panel_banOp.setVisible(true);
        //        this.Panel_banOp.setTouchEnabled(true);
        //
        //        this.Text_notice.setVisible(false);
        //        this.Panel_give.setVisible(false);
        //        this.Panel_give.setTouchEnabled(false);
        //
        //        this.bankButton.loadTextureNormal("10_room_mall_navbar_l_pre.png", ccui.Widget.PLIST_TEXTURE);
        //        this.bankButton.setCapInsets(cc.rect(24, 11, 3, 32));
        //        this.transButton.loadTextureNormal("10_room_mall_navbar_l_nor.png", ccui.Widget.PLIST_TEXTURE);
        //        this.transButton.setCapInsets(cc.rect(24, 11, 3, 32));
        //    }
        //}, this);
        //
        //this.transButton.addTouchEventListener(function(sender, type){
        //    if(type == ccui.Widget.TOUCH_ENDED)
        //    {
        //        this.Panel_banOp.setVisible(false);
        //        this.Panel_banOp.setTouchEnabled(false);
        //
        //        this.Text_notice.setVisible(true);
        //        this.Panel_give.setVisible(true);
        //        this.Panel_give.setTouchEnabled(true);
        //
        //
        //        this.bankButton.loadTextureNormal("10_room_mall_navbar_l_nor.png", ccui.Widget.PLIST_TEXTURE);
        //        this.bankButton.setCapInsets(cc.rect(24, 11, 3, 32));
        //        this.transButton.loadTextureNormal("10_room_mall_navbar_l_pre.png", ccui.Widget.PLIST_TEXTURE);
        //        this.transButton.setCapInsets(cc.rect(24, 11, 3, 32));
        //    }
        //}, this);
        //
        //this.sendButton.addTouchEventListener(function(sender, type){
        //    if(type == ccui.Widget.TOUCH_ENDED)
        //    {
        //        var userName = this.text_safedeposbox_userName.getString();
        //        var goldNum = this.text_safedeposbox_giveNum.getString();
        //        var pwd = this.text_safedeposbox_pwd.getString();
        //        if(userName.length == 0 || goldNum < MinOutGold || (Number(this.text_safedeposbox_inglod.getString()) - goldNum) < 1000)
        //        {
        //            layerManager.PopTipLayer(new PopAutoTipsUILayer("填写的昵称或金额有误，请确认后再提交！", DefultPopTipsTime),true);
        //        }
        //        else if(pwd.length == 0)
        //        {
        //            layerManager.PopTipLayer(new PopAutoTipsUILayer("请填写银行密码！", DefultPopTipsTime),true);
        //        }
        //        else
        //        {
        //            if(lastData["type"] != true)
        //            {
        //                pwd = MD5String(pwd);
        //            }
        //            connectUtil.sendManualNoCache(KernelPlaza,
        //                3,
        //                402,
        //                209, //总长
        //                "32#" + userInfo.globalUserdData["dwUserID"],
        //                "8#1",
        //                "64#" + goldNum,
        //                "33:" + pwd,
        //                "32:" + userName,
        //                "33:" + GetFuuID());
        //            //plazaMsgManager.GiveGoldToPlayer(goldNum, pwd, userName);
        //        }
        //    }
        //}, this)

        this.updateSafeBoxData();

        //显示用户头像信息
        this.ShowUserHeader(false);

        //隐藏上部按钮
        this.ShowTopButtons(false);

        //隐藏下部按钮
        this.ShowButtomButtons(false);

    },

    //更新保险箱内金币数量
    updateSafeBoxData:function()
    {
        if( (userInfo.globalUserdData["lUserInsure"] !== undefined) &&
            (userInfo.globalUserdData["lUserInsure"] !== null))
        {
            this.text_safedeposbox_inglod.setString(userInfo.globalUserdData["lUserInsure"]);

        }else
        {
            this.text_safedeposbox_inglod.setString("0");
        }
        this.text_safedeposbox_outgold.setString("");
    },

    editBoxEditingDidBegin: function (sender)
    {
        lm.log("yyp editBoxEditingDidBegin");
        if(GetDeviceType() != DeviceType.ANDROID)
        {
            lm.log("yyp editBoxEditingDidBegin");

            this.parentView.setPosition(cc.p(this.org_pos.x, this.org_pos.y + winSize.height * 0.2));
            //this.text_safedeposbox_outgold.setPosition(cc.p(321, 332));

            if(sender == this.text_safedeposbox_outgold)
            {
                lm.log("yyp editBoxEditingDidBegin 0 0");
            }
            else
            {
                lm.log("yyp editBoxEditingDidBegin 0 1");
            }

        }
    },

    editBoxEditingDidEnd: function (sender)
    {
        lm.log("yyp editBoxEditingDidEnd");
        if(GetDeviceType() != DeviceType.ANDROID)
        {
            lm.log("yyp editBoxEditingDidEnd");

            this.parentView.setPosition(this.org_pos);
            //this.text_safedeposbox_outgold.setPosition(cc.p(321, 332));

            if(sender == this.text_safedeposbox_outgold)
            {
                lm.log("yyp editBoxEditingDidEnd 1 0");
            }
            else
            {
                lm.log("yyp editBoxEditingDidEnd 1 1");
            }
        }
    }
});


// begin added by lizhongqiang 2015-10-10 16:45
//保险箱密码输入
//var PassWordInputLayer = rootLayer.extend({
//    ctor: function (callback, target) {
//        this._super();
//
//        var self = this;
//        this.parentView = ccs.load("res/cocosOut/PassWordInputLayer.json").node;
//        this.addChild(this.parentView);
//
//        //账号输入
//        var panel_password_input = ccui.helper.seekWidgetByName(this.parentView, "panel_password_input");
//        this.textfiled_inputpassword_text = layerManager.CreateDefultEditBox(this, cc.size(276, 30), cc.p(0.5, 0.5), cc.p(211, 153), "输入密码", cc.color(0, 0, 0, 240), true);
//        panel_password_input.addChild(this.textfiled_inputpassword_text);
//
//        this.parentpos =  this.parentView.getPosition();
//
//        // 关闭按钮
//        this.btn_inputpassword_close = ccui.helper.seekWidgetByName(this.parentView, "btn_inputpassword_close");
//        this.btn_inputpassword_close.addTouchEventListener(function (sender, type) {
//
//            self.removeFromParent();
//        });
//
//        //确定按钮
//        this.btn_inputpassword_ok = ccui.helper.seekWidgetByName(this.parentView, "btn_inputpassword_ok");
//        this.btn_inputpassword_ok.addTouchEventListener(function (sender, type) {
//
//            var password = self.textfiled_inputpassword_text.getString();
//            if(password == undefined  || password.length == 0)
//            {
//                layerManager.addLayerToParent(new PopAutoTipsUILayer("请输入保险箱密码！", DefultPopTipsTime),self);
//                return;
//            }
//
//            if(callback)
//            {
//                callback.call(target,password);
//            }
//
//            self.removeFromParent();
//
//        });
//    },
//    editBoxEditingDidBegin: function (sender) {
//
//        if(GetDeviceType() != DeviceType.ANDROID)
//        {
//            this.parentView.setPosition(cc.p(this.parentpos.x, this.parentpos.y + winSize.height * 0.2));
//            this.textfiled_inputpassword_text.setPosition(cc.p(211, 153));
//        }
//
//    },
//    editBoxEditingDidEnd: function (sender) {
//
//        if(GetDeviceType() != DeviceType.ANDROID)
//        {
//            this.parentView.setPosition(this.parentpos);
//            this.textfiled_inputpassword_text.setPosition(cc.p(211, 153));
//        }
//
//
//    }
//
//});
// end added by lizhongqiang 2015-10-10 16:15
