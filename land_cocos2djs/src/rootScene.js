/**
 * Created by baibo on 15/5/22.
 */
var rootScene = cc.Scene.extend({
    ctor: function () {
        this._super();
        lm.addLogManagerEvent(this);
    },
    onEnter: function () {
        this._super();
        this.scheduleUpdate();
        if(GetDeviceType() != DeviceType.ANDROID){

            this.UpdateGameLogic();

        }
        this.UpdateSystemTime();

        // 用户进入游戏，注册我们企业微信 APPID 此ID到时候要填写正式的，现在时测试号

        //hanhu #设置渠道标签 2015/10/14
        if(GetDeviceType() == DeviceType.ANDROID)
        {
            var sdkhelper = new lj.Ljsdkhelper();
            ChannelLabel = sdkhelper.getChannelLabel();
            if(ChannelLabel == "lj")
            {
                ChannelLabel = "8633";
            }
            lm.log("ChannelLabel = " + ChannelLabel);
        }

        if(ChannelLabel == "360" || GetDeviceType() != DeviceType.ANDROID) //非360渠道都在android层进行微信初始化 2015/11/10
        {
            registerWeiXinApp(DefultWeiXinAppID);
        }

    },
    update: function (dt) {
        this._super(dt);
        UpdateGameCore();
    },
    onExit: function () {
        this._super();
        this.unscheduleUpdate();
        this.unscheduleAllCallbacks();
    },
    //更新系统时间 1 - 分钟一次
    UpdateSystemTime:function()
    {
        this.schedule(function()
        {
            ////计算服务器时间
            var curDate = new Date();
            var serverDate = new Date(curDate.getTime() + DataUtil.GetServerInterval());
            // 定时更新
            var curLayer = layerManager.getRuningLayer();
            if(curLayer != null)
            {
                // 时间文本
                if(Number(serverDate.getMinutes()) < 10)
                {
                    curLayer.SetCurTime(serverDate.getHours() + ":0" + serverDate.getMinutes());
                    if (sparrowDirector)
                    {
                        sparrowDirector.gameData.serverTimes = serverDate.getHours() + ":0" + serverDate.getMinutes();
                    }
                }
                else
                {
                    curLayer.SetCurTime(serverDate.getHours() + ":" + serverDate.getMinutes());
                    if (sparrowDirector)
                    {
                        sparrowDirector.gameData.serverTimes = serverDate.getHours() + ":" + serverDate.getMinutes();
                    }
                }
                // 电量进度条
                curLayer.SetCurElectricity(GetBatteryLevel());
                if (sparrowDirector)
                {
                    sparrowDirector.gameData.dianNiang = GetBatteryLevel();
                }
            }
            if ( sparrowDirector.gameLayer && sparrowDirector.gameLayer.deskLayer )
            {
                // 时间文本
                if(Number(serverDate.getMinutes()) < 10)
                {
                    sparrowDirector.gameLayer.deskLayer.SetCurTime(serverDate.getHours() + ":0" + serverDate.getMinutes());
                }
                else
                {
                    sparrowDirector.gameLayer.deskLayer.SetCurTime(serverDate.getHours() + ":" + serverDate.getMinutes());
                }
                // 电量进度条
                sparrowDirector.gameLayer.deskLayer.SetCurElectricity(GetBatteryLevel());
            }


        },1,cc.REPEAT_FOREVER);
    },
    // 定时更新(每隔15秒)
    UpdateGameLogic:function()
    {
        this.schedule(function()
        {
            // 1.定时尝试自动检验服务器订单
            roomManager.AutoVerificationAppleOrder();

        },60,cc.REPEAT_FOREVER);

    }
})

var currentInfo =  "";
var currentTime = 0;
var fontSize = 20;
var rootLayer = cc.Layer.extend({
    ctor:function(layerName){
        this._super();
        this.layerName = layerName;
        var self = this;
        //lm.log("增加rootLayer");
        //////////////////////////////////////////////////////////////////////////////
        //公告信息
        this.NoticeUINode = ccs.load("res/landlord/cocosOut/NoticeUILayer.json").node;
        this.addChild(this.NoticeUINode, 9999);
        this.NoticeUINode.setPosition(320, 640 - 120);
        this.panel_notice = ccui.helper.seekWidgetByName(this.NoticeUINode, "panel_noticeui");

        //this.SetNoticeInFo("这是公告测试，游戏内的公告");
        var showtime = 5;
        this.schedule(function(){
            //lm.log("刷新公告， 公告长度为" + NoticeMessageArray.length);
            //检测是否显示完成
            if(currentTime < currentInfo.length * fontSize * 2 / 60)
            {
                currentTime = currentTime + showtime;
                //lm.log("当前显示时间=" + currentTime );
                return;
            }
            else
            {
                currentTime = 0;
            }

            if(NoticeMessageArray.length != 0)
            {
                currentInfo = NoticeMessageArray.pop();
                lm.log("NoticeMessageArray--------------- "+currentInfo);

                var str = currentInfo;
                var infoPos = str.indexOf("info", 0);
                //lm.log("info 的位置在：" + infoPos);
                var beginPos = str.indexOf("\"", infoPos) + 1;
                //lm.log("beginPos = " + beginPos);
                var endPos = str.indexOf("\"", beginPos);
                //lm.log("endPos = " + endPos);
                var message = str.substring(beginPos, endPos);
                //lm.log("message = " + message);
                self.SetNoticeInFo(currentInfo);
            }
            else
            {
                lm.log("NoticeMessageArray--------------- 空");
                self.SetNoticeInFo("");
            }
        }, showtime, cc.REPEAT_FOREVER);
    },
    setDarkBg:function(color)
    {
        if(!color)
        {
            color = cc.color(0,0,0,120);
        }

        this.addChild(cc.LayerColor.create(color),-1);
    },
    // 设置公告信息
    SetNoticeInFo:function(info)
    {
        //return;
        cc.log("thisnoticeuinode=============== "+this.NoticeUINode);
        //var panel_notice = ccui.helper.seekWidgetByName(this.NoticeUINode, "panel_noticeui");
        this.panel_notice.removeAllChildren();
                                
        // 这是公告文字，跑马灯效果
        var text_notice_info = ccui.Text.create(info,"",fontSize);
        this.panel_notice.addChild(text_notice_info);

        //lm.log("设置公告内容= " + info);
        text_notice_info.setString(info);
        text_notice_info.setColor(cc.color(0,255,0,255));
        text_notice_info.setPosition(this.panel_notice.getContentSize().width/2, this.panel_notice.getContentSize().height/2);
        text_notice_info.setAnchorPoint(cc.p(0, 0.5));


        //获取公告面板位置
        text_notice_info.pannelpositionX = this.panel_notice.getPositionX() + this.panel_notice.getContentSize().width;
        text_notice_info.unscheduleAllCallbacks();
        text_notice_info.schedule(function ()
        {
            //var width = this.getStringLength() * this.getFontSize();
            this.setPositionX(this.getPositionX() - 1.0);
            //if (this.getPositionX() < -width)
            //{
            //    this.setPositionX( this.pannelpositionX);
            //}

        }, 0.01, cc.REPEAT_FOREVER);
    }


});