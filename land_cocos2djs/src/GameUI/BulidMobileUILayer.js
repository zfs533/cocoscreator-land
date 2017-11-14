/**
 * Created by lizhongqiang on 15/6/2.
 */


var BulidMobileUILayer = rootLayer.extend({
    ctor: function (target,secuccssCallBack) {
        this._super();
        this.initLayer(target,secuccssCallBack);
    },
    initLayer: function (target,secuccssCallBack) {

        this.parentView = ccs.load("res/cocosOut/BulidMobileUILayer.json").node;
        this.addChild(this.parentView);
        this.parentView.setPosition((winSize.width-960)/2,0);

        //设置背景颜色
        this.setDarkBg();


        //手机号输入
        var panel_bulidmobile_mobile = ccui.helper.seekWidgetByName(this.parentView, "panel_bulidmobile_mobile");
        this.textfield_mobile = layerManager.CreateDefultEditBox(this, cc.size(240, 30), cc.p(0, 0.5), cc.p(148, 28), "请输入手机号", cc.color(0, 0, 0, 240), false);
        panel_bulidmobile_mobile.addChild(this.textfield_mobile);

        //请输入短信验证码
        var panel_bulidmobile_access = ccui.helper.seekWidgetByName(this.parentView, "panel_bulidmobile_access");
        this.textfield_access = layerManager.CreateDefultEditBox(this, cc.size(200, 30), cc.p(0, 0.5), cc.p(148, 28), "请输入短信验证码", cc.color(0, 0, 0, 240), true);
        panel_bulidmobile_access.addChild(this.textfield_access);

        //关闭按钮
        var panel_bulidmobile_close = ccui.helper.seekWidgetByName(this.parentView,"panel_bulidmobile_close");
        panel_bulidmobile_close.addTouchEventListener(function (sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
               this.removeFromParent();
            }

        }, this);


        //获取验证码按钮
        var  self = this ;
        var btn_bulidmobile_getaccess = ccui.helper.seekWidgetByName(this.parentView,"btn_bulidmobile_getaccess");
        btn_bulidmobile_getaccess.addTouchEventListener(function (sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                this.textfield_mobile.setEnabled(false);
                // 获取验证码
                if(CurWebDataType == WebDataType.WEBDATA_TYPE_DEBUG)
                {

                }else
                {
                    // 发送获取手机验证码
                   var mobile =  self.GetMobileString();
                   if(mobile == null || mobile.length == 0)
                   {
                       layerManager.addLayerToParent(new PopAutoTipsUILayer("手机号不能为空！", DefultPopTipsTime), self);
                       return;
                   }

                    webMsgManager.SendGpGetMobileVerificationCode (mobile, function(data)
                    {
                        // 获取手机号码完成，服务器无返回消息
                        layerManager.addLayerToParent(new PopAutoTipsUILayer("已发送验证码，请注意短信通知！",DefultPopTipsTime), self);
                    },
                    function(responseText)
                    {
                        // 其他错误提示
                        layerManager.addLayerToParent(new PopAutoTipsUILayer(responseText,DefultPopTipsTime), self);
                        this.textfield_mobile.setEnabled(true);

                    }, self);

                }
            }

        }, this);


        //确定绑定手机号码按钮
        var btn_mobilebulid = ccui.helper.seekWidgetByName(this.parentView,"btn_mobilebulid");
        btn_mobilebulid.addTouchEventListener(function (sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                // 获取验证码
                if(CurWebDataType == WebDataType.WEBDATA_TYPE_DEBUG)
                {
                    layerManager.addLayerToParent(new PopAutoTipsUILayer("绑定手机号码成功，获得金币：" + 20000, DefultPopTipsTime),self);

                }else
                {
                    // 发送获取手机验证码
                    var mobile =  this.GetMobileString();
                    var Access =  this.GetAccessString();

                    lm.log("mobile:" + mobile);
                    lm.log("access:" + Access);
                    if(Access == null || Access.length == 0)
                    {
                        layerManager.addLayerToParent(new PopAutoTipsUILayer("验证码不能为空！", DefultPopTipsTime),self);
                        return;
                    }

                    webMsgManager.SendGpBuildMobile (mobile,Access, function(data)
                        {
                            lm.log("绑定手机号码成功，获得金币x" + data["reward"]);
                            self.removeFromParent();

                            //hanhu 移除手机绑定界面 2015/12/10
                            //layerManager.getRuningLayer().panel_build_mobile.setVisible(false);

                            if (secuccssCallBack)
                             {
                                secuccssCallBack.call(target,data["tips"]);
                             }
                        },
                        function(responseText,data)
                        {
                            layerManager.addLayerToParent(new PopAutoTipsUILayer(responseText, DefultPopTipsTime),self);
                            
                        }, self);
                }
            }

        }, this);

    },


    // mobile
    GetMobileString:function()
    {
       return  this.textfield_mobile.getString();
    },

    // access
    GetAccessString:function()
    {

        return this.textfield_access.getString();
    }



});