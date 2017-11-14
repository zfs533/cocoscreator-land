/**
 * Created by lizhongqiang on 15/6/29
 */



var SystemOptionUILayer = rootUILayer.extend({
    ctor: function ()
    {
        this._super();
        this.initLayer();
    },
    onExit: function () {
        this._super();
    },
    //输入框获得焦点
    editBoxEditingDidBegin: function (sender) {
        if(GetDeviceType() != DeviceType.ANDROID)
        {
            this.parentView.setPosition(cc.p(this.org_pos.x, this.org_pos.y + winSize.height * 0.4));
            //this.textfield_modifyuserinfo_nick.setPosition(cc.p(453, 314)) ;
        }
    },

    //输入框失去焦点
    editBoxEditingDidEnd: function (sender) {

        if(GetDeviceType() != DeviceType.ANDROID)
        {
            this.parentView.setPosition(this.org_pos);
            //this.textfield_modifyuserinfo_nick.setPosition(cc.p(453, 314)) ;
        }

    },
    initLayer: function ()
    {
        cc.spriteFrameCache.addSpriteFrames("res/landlord/cocosOut/setting/setting.plist");


        var self = this;
        this.parentView = ccs.load("res/landlord/cocosOut/SystemOptionUILayer.json").node;
        this.addChild(this.parentView);
        //hanhu #调整设置坐标 2015/08/07
        var offset = (this.parentView.getContentSize().width * winSize.height / 640 - winSize.width) / 2;
        this.parentView.x -= offset;

        this.org_pos = this.parentView.getPosition();
        this.origin = cc.p((winSize.width - this.parentView.getContentSize().width)/2, (winSize.height - this.parentView.getContentSize().height)/2);
        this.Image_label_bg = ccui.helper.seekWidgetByName(this.parentView, "Image_label_bg");          //label
        this.Image_label_bg.setPositionX(this.Image_label_bg.getPositionX() + this.origin.x);

        //音乐值
        var text_sysopt_musicendvalue = ccui.helper.seekWidgetByName(this.parentView,"text_sysopt_musicendvalue");

        //音乐滑动条
        var slider_sysopt_music = ccui.helper.seekWidgetByName(this.parentView,"slider_sysopt_music");

        var value = userInfo.GetSystemVolume(true);
        lm.log( "value====" + value );
        if(value === undefined || value === null)
            value = 50;

        slider_sysopt_music.setPercent(Math.floor(value));
        text_sysopt_musicendvalue.setString(String(Math.floor(value)));

        slider_sysopt_music.addEventListener(function(sender,type)
        {
            //滑动事件
            if(type == ccui.Slider.EVENT_PERCENT_CHANGED)
            {
                text_sysopt_musicendvalue.setString(String(sender.getPercent()));
            }

        },this );

        // 保存音乐值
        slider_sysopt_music.addTouchEventListener(function (sender, type) {
            if(type == ccui.Widget.TOUCH_ENDED){

                userInfo.SetSystemVolume(sender.getPercent(),true);

                cc.audioEngine.setMusicVolume(sender.getPercent()/100); //hanhu #音效和音量只在此处设置一次 2015/10/21
            }
        },this)


        //音效值
        var text_sysopt_soundendvale = ccui.helper.seekWidgetByName(this.parentView,"text_sysopt_soundendvale");
        var slider_sysopt_sound = ccui.helper.seekWidgetByName(this.parentView,"slider_sysopt_sound");
        
        var value = userInfo.GetSystemVolume(false);
        lm.log( "value2====" + value );
        if(value === undefined || value === null)
            value = 50;

        slider_sysopt_sound.setPercent(Math.floor(value));
        text_sysopt_soundendvale.setString(String(Math.floor(value)));


        slider_sysopt_sound.addEventListener(function(sender,type)
        {
            //滑动事件
            if(type == ccui.Slider.EVENT_PERCENT_CHANGED)
            {
                text_sysopt_soundendvale.setString(String(sender.getPercent()));
            }

        },this );

        //保存音效值
        slider_sysopt_sound.addTouchEventListener(function (sender, type) {
            if(type == ccui.Widget.TOUCH_ENDED){

                userInfo.SetSystemVolume(sender.getPercent(),false);
                cc.audioEngine.setEffectsVolume(sender.getPercent() / 100);
            }
        },this);

        var Image_sysopt_tgybk_0 = ccui.helper.seekWidgetByName(this.parentView,"Image_sysopt_tgybk_0");
        Image_sysopt_tgybk_0.setVisible(((SubMitAppstoreVersion== true) || (Number(GetDeviceType()) == DeviceType.IOS) || (Number(GetDeviceType()) == DeviceType.IPAD ) )?false:false);

        var image_sysopt_tgyinfo = ccui.helper.seekWidgetByName(this.parentView,"image_sysopt_tgyinfo");
        image_sysopt_tgyinfo.setVisible(((SubMitAppstoreVersion== true) || (Number(GetDeviceType()) == DeviceType.IOS) || (Number(GetDeviceType()) == DeviceType.IPAD ) )?false:false);

        //var textfiled_tgy = ccui.helper.seekWidgetByName(this.parentView,"textfiled_tgy");
        this.textfiled_tgy = layerManager.CreateDefultEditBox(this, cc.size(340, 35), cc.p(0, 0.5), cc.p(-173, -23), "在此输入推广员ID", cc.color(184, 78, 37, 240), false);
        this.textfiled_tgy.setMaxLength(18);
        image_sysopt_tgyinfo.getParent().addChild(this.textfiled_tgy);
        this.textfiled_tgy.setVisible(((SubMitAppstoreVersion== true) || (Number(GetDeviceType()) == DeviceType.IOS) || (Number(GetDeviceType()) == DeviceType.IPAD ) )?false:false);
        //hanhu #弹出软键盘时调整输入框位置 2015/09/22
        var self = this;
        //textfiled_tgy.addEventListener(function(sender,type)
        //{
        //    if (type == ccui.TextField.EVENT_ATTACH_WITH_IME)
        //    {
        //        self.parentView.runAction(cc.MoveBy(0.5, cc.p(0, winSize.height * 0.4)));
        //    }
        //    else if(type == ccui.TextField.EVENT_DETACH_WITH_IME)
        //    {
        //        self.parentView.runAction(cc.MoveBy(0.5, cc.p(0, -winSize.height * 0.4)));
        //    }
        //
        //},this);


        // 推广员账号绑定
        var btn_sysopt_tgyok = ccui.helper.seekWidgetByName(this.parentView,"btn_sysopt_tgyok");

        btn_sysopt_tgyok.setPressedActionEnabled(true);
        btn_sysopt_tgyok.setVisible(((SubMitAppstoreVersion== true) || (Number(GetDeviceType()) == DeviceType.IOS) || (Number(GetDeviceType()) == DeviceType.IPAD ) )?false:false);
        btn_sysopt_tgyok.addTouchEventListener(function (sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                var staffaccount = this.textfiled_tgy.getString();
                if ((staffaccount == null) || (staffaccount.length == 0))
                {
                    layerManager.PopTipLayer(new PopAutoTipsUILayer("推广员账号不能为空！", DefultPopTipsTime),false);
                    return;
                }

                // 发送绑定推广员账号消息
                webMsgManager.SendGpBuildStaff(staffaccount,   function (data) {

                        layerManager.PopTipLayer(new PopAutoTipsUILayer("绑定推广员账号成功！", DefultPopTipsTime),false);
                    },
                    function (errinfo)
                    {
                        layerManager.PopTipLayer(new PopAutoTipsUILayer("绑定推广员账号失败！", DefultPopTipsTime),false);
                    },
                    self);
            }
        }, this);

        //问题反馈
        var btn_sysopt_plrom = ccui.helper.seekWidgetByName(this.parentView,"btn_sysopt_plrom");
        btn_sysopt_plrom.setPressedActionEnabled(true);
        btn_sysopt_plrom.addTouchEventListener(function (sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                this.canBack = false;
                layerManager.PopTipLayer(new GameFeedBackUILayer(),true);
            }
        }, this);

        //切换账号
        var btn_sysopt_changeaccount = ccui.helper.seekWidgetByName(this.parentView,"btn_sysopt_changeaccount");
        btn_sysopt_changeaccount.setPressedActionEnabled(true);
        btn_sysopt_changeaccount.addTouchEventListener(function (sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                lm.log(" 账号管理 被点击了");


                if(GetDeviceType() == DeviceType.ANDROID)
                {
                    if ( ChannelLabel == "wangyou" )
                    {
                        var sdkhelper = new lj.Ljsdkhelper();
                        sdkhelper.doSdkSwitchAccount();
                    }
                    else
                    {
                        var curLayer = new AccountSettingUILayer();
                        layerManager.repalceLayer(curLayer);
                    }
                }
                else
                {
                    var curLayer = new AccountSettingUILayer();
                    layerManager.repalceLayer(curLayer);
                }

            }
        }, this);

        //退出游戏
        var btn_sysopt_exit = ccui.helper.seekWidgetByName(this.parentView,"btn_sysopt_exit");
        btn_sysopt_exit.setPressedActionEnabled(true);
        btn_sysopt_exit.addTouchEventListener(function (sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                var pop = new ConfirmPop(this, Poptype.yesno,"是否退出游戏？");//ok
                pop.addToNode(cc.director.getRunningScene());
                pop.setYesNoCallback(
                    function(){
                        ExitGameEx();
                    }
                );

                //switch (Number(GetDeviceType())) {
                //    case DeviceType.ANDROID://android的登出游戏
                //    {
                //        var Pop = new ConfirmNode("是否退出游戏？", this, function()
                //        {
                //            if(ChannelLabel == "8633" || ChannelLabel == "baidu" || ChannelLabel == "baiduSingle")
                //            {
                //                jsb.reflection.callStaticMethod(AndroidPackageName, "ExitGame", "()V");
                //            }
                //            else if(ChannelLabel == "anySDK")
                //            {
                //                var user_plugin = AnySDKAgent.getUserPlugin();
                //                if(!user_plugin || !user_plugin.exit) return;
                //                user_plugin.exit();
                //                jsb.reflection.callStaticMethod(AndroidPackageName, "ExitGame", "()V");
                //            }
                //            else
                //            {
                //                var sdkhelper = new lj.Ljsdkhelper();
                //                sdkhelper.existGame();
                //            }
                //        });
                //        this.addChild(Pop, 999);
                //        var size = cc.director.getWinSize();
                //        Pop.setPosition(cc.p(size.width / 2, size.height / 2));
                //
                //    }
                //        break;
                //    case DeviceType.IOS://IOS
                //    case DeviceType.IPAD://android
                //    default :
                //    {
                //        var Pop = new ConfirmNode("是否退出游戏？", this, function(){
                //            ExitGame();
                //        });
                //        this.addChild(Pop, 999);
                //        var size = cc.director.getWinSize();
                //        Pop.setPosition(cc.p(size.width / 2, size.height / 2));
                //
                //    }
                //        break;
                //}




            }
        }, this);


        var lastHistoryData = userInfo.GetLastLocalData(plazaMsgManager.address);
        if(lastHistoryData["type"] == true)
        {
            //btn_sysopt_changeaccount.setVisible(false);
            //btn_sysopt_plrom.setPositionX(btn_sysopt_plrom.getPositionX() + 80);
            //btn_sysopt_exit.setPositionX(btn_sysopt_exit.getPositionX() - 80);
        }

        //音乐开关
        var btn_music = ccui.helper.seekWidgetByName(this.parentView,"btn_music");
        var valueMusic = userInfo.GetSystemVolume(true);
        if(valueMusic >= 50)
        {
            btn_music.loadTextures("btn_music_on.png", "btn_music_on.png", "", 1);
        }
        else if(valueMusic < 50)
        {
            btn_music.loadTextures("btn_music_off.png", "btn_music_off.png", "",  1);
        }
        btn_music.addTouchEventListener(function (sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                var value = userInfo.GetSystemVolume(true);
                if(value < 50)
                {
                    userInfo.SetSystemVolume(100,true);
                    cc.audioEngine.setMusicVolume(1);
                    sender.loadTextures("btn_music_on.png", "btn_music_on.png", "",  1);
                }
                else if(value >= 50)
                {
                    userInfo.SetSystemVolume(0,true);
                    cc.audioEngine.setMusicVolume(0);
                    sender.loadTextures("btn_music_off.png", "btn_music_off.png", "",  1);
                }

            }
        }, this);


        //音效开关
        var btn_effect = ccui.helper.seekWidgetByName(this.parentView,"btn_effect");
        var valueEffect = userInfo.GetSystemVolume(false);
        if(valueEffect >= 50)
        {
            btn_effect.loadTextures("btn_music_on.png", "btn_music_on.png", "",  1);
        }
        else if(value < 50)
        {
            btn_effect.loadTextures("btn_music_off.png", "btn_music_off.png",  "", 1);
        }
        btn_effect.addTouchEventListener(function (sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                var value = userInfo.GetSystemVolume(false);
                if(value < 50)
                {
                    userInfo.SetSystemVolume(100,false);
                    cc.audioEngine.setEffectsVolume(1);
                    sender.loadTextures("btn_music_on.png", "btn_music_on.png", "",  1);
                }
                else if(value >= 50)
                {
                    userInfo.SetSystemVolume(0,false);
                    cc.audioEngine.setEffectsVolume(0);
                    sender.loadTextures("btn_music_off.png", "btn_music_off.png",  "", 1);
                }

            }
        }, this);


        this.ShowUserHeader(false);
        this.ShowTopButtons(false);
        this.ShowButtomButtons(false);
    }

});


var FeedBackUILayer = null;
