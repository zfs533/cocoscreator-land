/**
 * Created by 李中强 on 16/2/18.
 */

    //测试用的EIMS
var debugims ="460031383974930";
var debugmobile="17771726207";
var debug = false;
var TelcomMobileLogionLayer = rootLayer.extend({
    ctor: function () {
        this._super();
        this.initLayer();
    },
    initLayer: function () {

        this.parentView = ccs.load("res/cocosOut/TelcomMobileInputLayer.json").node;
        this.addChild(this.parentView);
        this.parentView.setPosition((winSize.width-960)/2,0);

        //设置背景颜色
        this.setDarkBg();


        //手机号输入
        var panel_bulidmobile_mobile = ccui.helper.seekWidgetByName(this.parentView, "panel_telcommobile_mobile");
        this.textfield_mobile = layerManager.CreateDefultEditBox(this, cc.size(190, 30), cc.p(0, 0.5), cc.p(148, 28), "请输入本机号码", cc.color(0, 0, 0, 240), false,true);
        panel_bulidmobile_mobile.addChild(this.textfield_mobile);

        //请输入短信验证码
        var panel_bulidmobile_access = ccui.helper.seekWidgetByName(this.parentView, "panel_telcommobile_access");
        this.textfield_access = layerManager.CreateDefultEditBox(this, cc.size(190, 30), cc.p(0, 0.5), cc.p(148, 28), "请输入短信验证码", cc.color(0, 0, 0, 240), false);
        panel_bulidmobile_access.addChild(this.textfield_access);

        if(debug)
        {
            this.textfield_mobile.setString(debugmobile);
        }

        //关闭按钮
        var btn_telcommobile_close = ccui.helper.seekWidgetByName(this.parentView,"btn_telcommobile_close");
        btn_telcommobile_close.addTouchEventListener(function (sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                this.removeFromParent();
            }

        }, this);


        //获取验证码按钮
        var  self = this ;
        var btn_telcommobile_getaccess = ccui.helper.seekWidgetByName(this.parentView,"btn_telcommobile_getaccess");
        btn_telcommobile_getaccess.addTouchEventListener(function (sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                // 发送获取手机验证码
                var mobile =  self.GetMobileString();
                if(mobile == null || mobile.length == 0)
                {
                    layerManager.addLayerToParent(new PopAutoTipsUILayer("手机号不能为空！", DefultPopTipsTime), self);
                    return;
                }

                //手机号长度不足
                if(mobile.length != 11)
                {
                    layerManager.addLayerToParent(new PopAutoTipsUILayer("请输入合法的手机号！", DefultPopTipsTime), self);
                    return;
                }


                var imsi ="";
                if(debug)
                {
                    imsi = debugims;
                }else
                {
                    try
                    {
                        imsi =  jsb.reflection.callStaticMethod(AndroidPackageName, "getIMSIId", "()Ljava/lang/String;");

                    }catch(e)
                    {
                    }
                }

                //this.textfield_access.setString(imsi);
                this.textfield_mobile.setEnabled(false);
                NewWebMsgManager.SendGetTelcomCode (mobile, imsi,"","",function(data)
                    {
                        lm.log("data-----------------------------------: " + JSON.stringify(data));

                        // 获取手机号码完成，服务器无返回消息
                       layerManager.addLayerToParent(new PopAutoTipsUILayer(data["tips"],DefultPopTipsTime), self);
                    },
                   function(responseText)
                   {
                            // 其他错误提示
                       layerManager.addLayerToParent(new PopAutoTipsUILayer(responseText,DefultPopTipsTime), self);
                       this.textfield_mobile.setEnabled(true);

                   }, self);
            }

        }, this);


        //确定绑定手机号码按钮
        var btn_telcommobilelogin = ccui.helper.seekWidgetByName(this.parentView,"btn_telcommobilelogin");
        btn_telcommobilelogin.addTouchEventListener(function (sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED)
            {

               self.Login();

            }

        }, self);
    },

    Login:function()
    {
        var self = this;
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

        layerManager.PopTipLayer(new WaitUILayer("正在连接服务器，请稍后...", function()
        {
        },self));



        DataUtil.AkeyRegisterUser = true;
        var imsi ="";
        if(debug)
        {
            imsi = debugims;
        }else
        {
            try
            {
                imsi =  jsb.reflection.callStaticMethod(AndroidPackageName, "getIMSIId", "()Ljava/lang/String;");

            }catch(e)
            {
            }
        }
        NewWebMsgManager.SendTelcomRegister (mobile,imsi,Access, function(data)
        {
            // 设置登录回调接口
            plazaMsgManager.SetLogonCallBack(
                function () // 连接服务器失败
                {
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
                                    //DataUtil.SetGoToModule(ClientModuleType.Plaza);
                                },
                                function (errinfo) {
                                },
                                this);
                        } else {
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
                            // DataUtil.SetGoToModule(ClientModuleType.Plaza);
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
                    pop.setYesNoCallback(
                        function(){
                            ExitGameEx();
                        },
                        function(){
                            ExitGameEx();
                        }
                    );
                    //layerManager.PopTipLayer(new PopTipsUILayer("退出游戏", "取消", info, function (id) {
                    //    if (id == clickid.ok)
                    //        ExitGame();
                    //
                    //}));

                }, self);

            lm.log("akey login accounts:" + data["accounts"] + "login password:" + data["password"]);

            userInfo.SetCurPlayerInFo(data["accounts"], data["password"]);
            // 登录大厅
            plazaMsgManager.LogonPlazaEx(data["accounts"], data["password"], GetFuuID(), "");//默认以前登录方式


        }, function (tips)
        {
            layerManager.PopTipLayer(new PopAutoTipsUILayer(tips, DefultPopTipsTime), false);

        }, self);

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



//短信验证码输入框 - 支付时使用
var TelcomCodeLayer = rootLayer.extend({
    ctor: function (orderid,transactionid) {
        this._super();
        this.initLayer(orderid,transactionid);
    },
    onExit: function ()
    {
        TelcompayRuning = false;
    },
    initLayer: function (orderid,transactionid) {

        this.parentView = ccs.load("res/cocosOut/TelcomCodeInputLayer.json").node;
        this.addChild(this.parentView);
        this.parentView.setPosition((winSize.width - 960) / 2, 0);

        //设置背景颜色
        this.setDarkBg();

        //请输入短信验证码
        var panel_telcomcode_access = ccui.helper.seekWidgetByName(this.parentView, "panel_telcomcode_access");
        this.textfield_access = layerManager.CreateDefultEditBox(this, cc.size(190, 30), cc.p(0, 0.5), cc.p(148, 28), "请输入短信验证码", cc.color(0, 0, 0, 240), true,true);
        panel_telcomcode_access.addChild(this.textfield_access);

        //关闭按钮
        var btn_telcomcode_close = ccui.helper.seekWidgetByName(this.parentView, "btn_telcomcode_close");
        btn_telcomcode_close.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                this.removeFromParent();
            }

        }, this);


        //确定按钮
        var self = this;
        var btn_telcomok = ccui.helper.seekWidgetByName(this.parentView, "btn_telcomok");
        btn_telcomok.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {

                // 发送获取手机验证码
                var code =  self.GetAccessString();
                if(code == null || code.length == 0)
                {
                    layerManager.addLayerToParent(new PopAutoTipsUILayer("验证码不能为空！", DefultPopTipsTime), self);
                    return;
                }

                self.textfield_access.setEnabled(false);
                NewWebMsgManager.SendTelcomVerifyCode (code, orderid,transactionid,function(data)
                    {
                        self.removeFromParent();

                        //重置时间
                        TelcomPayTime = 0;

                        //将时间记录到本地
                        try
                        {
                            sys.localStorage.setItem("TelcomPayTime",String(TelcomPayTime));

                        }catch(e)
                        {
                        }
                        // 验证完成
                        layerManager.PopTipLayer(new PopAutoTipsUILayer(data["tips"],DefultPopTipsTime), true);


                    },
                    function(responseText)
                    {
                        // 其他错误提示
                        layerManager.addLayerToParent(new PopAutoTipsUILayer(responseText,DefultPopTipsTime), self);
                        self.textfield_access.setEnabled(true);

                    }, self);
            }

        }, self);
    },
    // access
    GetAccessString:function()
    {

        return this.textfield_access.getString();
    }
});

