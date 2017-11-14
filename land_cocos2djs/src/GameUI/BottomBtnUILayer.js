/**
 * Created by fanxuehua on 16/4/7.
 */

var BottomBtnUILayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        this.initBottomBtnUILayer();
        this.initButtons();
        this.initButtonsEvent();
    },

    initBottomBtnUILayer: function ()
    {
        var self = this;

        lm.log("yyp : BottomBtnUILayer : initBottomBtnUILayer start");

        this.parentView = ccs.load("res/landlord/cocosOut/BottomButtonLayer.json").node;
        this.addChild(this.parentView);
        this.parentView.setPosition(0, 0);

        //做动作的层
        this.layer_bottom = ccui.helper.seekWidgetByName(this.parentView, "layer_bottom");
        this.layer_bottom.setPositionY(-100);

    },

    initButtons: function()
    {
        var layer_btn_android = ccui.helper.seekWidgetByName(this.parentView, "layer_btn_android");
        var layer_btn_iosCheck = ccui.helper.seekWidgetByName(this.parentView, "layer_btn_iosCheck");
        var layer_btn_ios = ccui.helper.seekWidgetByName(this.parentView, "layer_btn_ios");
        layer_btn_android.setVisible(false);
        layer_btn_iosCheck.setVisible(false);
        layer_btn_ios.setVisible(false);

        var layer_btn = null;
        //安卓机
        if(Number(GetDeviceType()) == DeviceType.ANDROID)
        {
            lm.log("yyp : BottomBtnUILayer : initButtons 1" + layer_btn);
            layer_btn = layer_btn_android;
            layer_btn.setVisible(true);
        }
        else //ios
        {
            //ios 审核
            if(SubMitAppstoreVersion==true)
            {
                lm.log("yyp : BottomBtnUILayer : initButtons 2" + layer_btn);
                layer_btn = layer_btn_iosCheck;
                layer_btn.setVisible(true);
            }
            else
            {
                lm.log("yyp : BottomBtnUILayer : initButtons 3" + layer_btn);
                layer_btn = layer_btn_ios;
                layer_btn.setVisible(true);
            }
        }

        lm.log("yyp : BottomBtnUILayer : initButtons [" + layer_btn);

        this.btn_mail = ccui.helper.seekWidgetByName(layer_btn, "btn_mail");            //商城
        this.btn_exchange = ccui.helper.seekWidgetByName(layer_btn, "btn_exchange");    //兑换
        this.btn_bag = ccui.helper.seekWidgetByName(layer_btn, "btn_bag");              //背包
        this.btn_task = ccui.helper.seekWidgetByName(layer_btn, "btn_task");            //任务
        this.btn_ranking = ccui.helper.seekWidgetByName(layer_btn, "btn_ranking");      //排行榜
        this.btn_safeBox = ccui.helper.seekWidgetByName(layer_btn, "btn_safeBox");      //保险箱
        this.btn_avi = ccui.helper.seekWidgetByName(layer_btn, "btn_avi");              //美女视频


        var animate = ccs.load("res/landlord/animate/ShangCheng.json").node;
        layer_btn.addChild(animate);
        animate.setPosition(this.btn_mail.getPositionX() + 8, this.btn_mail.getPositionY() - 40 );

        var animateAction = ccs.load("res/landlord/animate/ShangCheng.json").action;
        animateAction.gotoFrameAndPlay(0, 200, 0, true);
        animate.runAction(animateAction);
        this.btn_mail.setOpacity(0);


    },

    initButtonsEvent: function()
    {
        //商城
        if(this.btn_mail != undefined && this.btn_mail != null)
        {
            this.btn_mail.setPressedActionEnabled(true);
            this.btn_mail.addTouchEventListener(function (sender, type)
            {
                if (type == ccui.Widget.TOUCH_ENDED)
                {
                    this.OnMallClicked();
                }
            }, this);
        }

        //兑换
        if(this.btn_exchange != undefined && this.btn_exchange != null)
        {
            this.btn_exchange.setPressedActionEnabled(true);
            this.btn_exchange.addTouchEventListener(function (sender, type)
            {
                if (type == ccui.Widget.TOUCH_ENDED)
                {
                    this.OnTicketCliecked();
                }
            }, this);
        }

        //背包
        if(this.btn_bag != undefined && this.btn_bag != null)
        {
            this.btn_bag.setPressedActionEnabled(true);
            this.btn_bag.addTouchEventListener(function (sender, type)
            {
                if (type == ccui.Widget.TOUCH_ENDED)
                {
                    this.OnBagClicked();
                }
            }, this);
        }

        //任务
        if(this.btn_task != undefined && this.btn_task != null)
        {
            this.btn_task.setPressedActionEnabled(true);
            this.btn_task.addTouchEventListener(function (sender, type)
            {
                if (type == ccui.Widget.TOUCH_ENDED)
                {
                    this.OnTaskClicked();
                }
            }, this);
        }

        //排行榜
        if(this.btn_ranking != undefined && this.btn_ranking != null)
        {
            this.btn_ranking.setPressedActionEnabled(true);
            this.btn_ranking.addTouchEventListener(function (sender, type)
            {
                if (type == ccui.Widget.TOUCH_ENDED)
                {
                    this.OnRankClicked();
                }
            }, this);
        }

        //保险箱
        if(this.btn_safeBox != undefined && this.btn_safeBox != null)
        {
            this.btn_safeBox.setPressedActionEnabled(true);
            this.btn_safeBox.addTouchEventListener(function (sender, type)
            {
                if (type == ccui.Widget.TOUCH_ENDED)
                {
                    this.OnSafeBoxClicked();
                }
            }, this);
        }

        //美女视频
        if(this.btn_avi != undefined && this.btn_mail != null)
        {
            this.btn_avi.setPressedActionEnabled(true);
            this.btn_avi.addTouchEventListener(function (sender, type)
            {
                if (type == ccui.Widget.TOUCH_ENDED)
                {
                    this.OnAviClicked();
                }
            }, this);
        }

    },

    Show: function()
    {
        this.layer_bottom.runAction(cc.moveTo(0.2, 0, 0).easing(cc.easeInOut(1)));
    },

    Hide: function()
    {
        this.layer_bottom.runAction(cc.moveTo(0.2, 0, -100).easing(cc.easeInOut(1)));
    },

    // 按下商城按钮
    OnMallClicked: function()
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
                                layerManager.PopTipLayer(new WaitUILayer("正在获取产品信息，请稍后...",function()
                                {
                                    layerManager.PopTipLayer(new PopAutoTipsUILayer("连接服务器超时，请稍后重试！", DefultPopTipsTime),false);

                                },this));

                                //请求产品列表
                                roomManager.RequestProduct(MallDataType.MALL_DATA_GOLD);
                            }

                        }
                        default :
                            break;
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
            lm.log("yyp OnTicketCliecked 2");
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

/*
        if(CurWebDataType == WebDataType.WEBDATA_TYPE_DEBUG) {
            var ticketdata = {
                "prizeexchangelist":[{
                    "prizeid": 1,
                    "prizetype": 1,
                    "prizename": "Q币",
                    "prizeiconmd5": "md5",
                    "prizeiconurl": "http://www.icon.jpg",
                    "prizesurplusnum": 1000,
                    "prizeexchangeconditionstype":-1,
                    "prizeexchangerate": 100
                },
                    {
                        "prizeid": 1,
                        "prizetype": 1,
                        "prizename": "Q币",
                        "prizeiconmd5": "md5",
                        "prizeiconurl": "http://www.icon.jpg",
                        "prizesurplusnum": 1000,
                        "prizeexchangeconditionstype":-1,
                        "prizeexchangerate": 100
                    },
                    {
                        "prizeid": 1,
                        "prizetype": 1,
                        "prizename": "Q币",
                        "prizeiconmd5": "md5",
                        "prizeiconurl": "http://www.icon.jpg",
                        "prizesurplusnum": 1000,
                        "prizeexchangeconditionstype":-1,
                        "prizeexchangerate": 100
                    },
                    {
                        "prizeid": 1,
                        "prizetype": 1,
                        "prizename": "Q币",
                        "prizeiconmd5": "md5",
                        "prizeiconurl": "http://www.icon.jpg",
                        "prizesurplusnum": 1000,
                        "prizeexchangeconditionstype":-1,
                        "prizeexchangerate": 100
                    },
                    {
                        "prizeid": 1,
                        "prizetype": 1,
                        "prizename": "Q币",
                        "prizeiconmd5": "md5",
                        "prizeiconurl": "http://www.icon.jpg",
                        "prizesurplusnum": 1000,
                        "prizeexchangeconditionstype":-1,
                        "prizeexchangerate": 100
                    },
                    {
                        "prizeid": 1,
                        "prizetype": 1,
                        "prizename": "Q币",
                        "prizeiconmd5": "md5",
                        "prizeiconurl": "http://www.icon.jpg",
                        "prizesurplusnum": 1000,
                        "prizeexchangeconditionstype":-1,
                        "prizeexchangerate": 100
                    },
                    {
                        "prizeid": 1,
                        "prizetype": 1,
                        "prizename": "Q币",
                        "prizeiconmd5": "md5",
                        "prizeiconurl": "http://www.icon.jpg",
                        "prizesurplusnum": 1000,
                        "prizeexchangeconditionstype":-1,
                        "prizeexchangerate": 100
                    },
                    {
                        "prizeid": 1,
                        "prizetype": 1,
                        "prizename": "Q币",
                        "prizeiconmd5": "md5",
                        "prizeiconurl": "http://www.icon.jpg",
                        "prizesurplusnum": 1000,
                        "prizeexchangeconditionstype":-1,
                        "prizeexchangerate": 100
                    },
                    {
                        "prizeid": 1,
                        "prizetype": 1,
                        "prizename": "Q币",
                        "prizeiconmd5": "md5",
                        "prizeiconurl": "http://www.icon.jpg",
                        "prizesurplusnum": 1000,
                        "prizeexchangeconditionstype":-1,
                        "prizeexchangerate": 100
                    },
                    {
                        "prizeid": 1,
                        "prizetype": 1,
                        "prizename": "Q币",
                        "prizeiconmd5": "md5",
                        "prizeiconurl": "http://www.icon.jpg",
                        "prizesurplusnum": 1000,
                        "prizeexchangeconditionstype":-1,
                        "prizeexchangerate": 100
                    },
                    {
                        "prizeid": 1,
                        "prizetype": 1,
                        "prizename": "Q币",
                        "prizeiconmd5": "md5",
                        "prizeiconurl": "http://www.icon.jpg",
                        "prizesurplusnum": 1000,
                        "prizeexchangeconditionstype":-1,
                        "prizeexchangerate": 100
                    },
                    {
                        "prizeid": 1,
                        "prizetype": 1,
                        "prizename": "Q币",
                        "prizeiconmd5": "md5",
                        "prizeiconurl": "http://www.icon.jpg",
                        "prizesurplusnum": 1000,
                        "prizeexchangeconditionstype":-1,
                        "prizeexchangerate": 100
                    },
                    {
                        "prizeid": 1,
                        "prizetype": 1,
                        "prizename": "Q币",
                        "prizeiconmd5": "md5",
                        "prizeiconurl": "http://www.icon.jpg",
                        "prizesurplusnum": 1000,
                        "prizeexchangeconditionstype":-1,
                        "prizeexchangerate": 100
                    },
                    {
                        "prizeid": 1,
                        "prizetype": 1,
                        "prizename": "Q币",
                        "prizeiconmd5": "md5",
                        "prizeiconurl": "http://www.icon.jpg",
                        "prizesurplusnum": 1000,
                        "prizeexchangeconditionstype":-1,
                        "prizeexchangerate": 100
                    },
                    {
                        "prizeid": 1,
                        "prizetype": 1,
                        "prizename": "Q币",
                        "prizeiconmd5": "md5",
                        "prizeiconurl": "http://www.icon.jpg",
                        "prizesurplusnum": 1000,
                        "prizeexchangeconditionstype":-1,
                        "prizeexchangerate": 100
                    },
                    {
                        "prizeid": 1,
                        "prizetype": 1,
                        "prizename": "Q币",
                        "prizeiconmd5": "md5",
                        "prizeiconurl": "http://www.icon.jpg",
                        "prizesurplusnum": 1000,
                        "prizeexchangeconditionstype":-1,
                        "prizeexchangerate": 100
                    },
                    {
                        "prizeid": 1,
                        "prizetype": 1,
                        "prizename": "Q币",
                        "prizeiconmd5": "md5",
                        "prizeiconurl": "http://www.icon.jpg",
                        "prizesurplusnum": 1000,
                        "prizeexchangeconditionstype":-1,
                        "prizeexchangerate": 100
                    },
                    {
                        "prizeid": 1,
                        "prizetype": 1,
                        "prizename": "Q币",
                        "prizeiconmd5": "md5",
                        "prizeiconurl": "http://www.icon.jpg",
                        "prizesurplusnum": 1000,
                        "prizeexchangeconditionstype":-1,
                        "prizeexchangerate": 100
                    },
                    {
                        "prizeid": 1,
                        "prizetype": 1,
                        "prizename": "Q币",
                        "prizeiconmd5": "md5",
                        "prizeiconurl": "http://www.icon.jpg",
                        "prizesurplusnum": 1000,
                        "prizeexchangeconditionstype":-1,
                        "prizeexchangerate": 100
                    },
                    {
                        "prizeid": 1,
                        "prizetype": 1,
                        "prizename": "Q币",
                        "prizeiconmd5": "md5",
                        "prizeiconurl": "http://www.icon.jpg",
                        "prizesurplusnum": 1000,
                        "prizeexchangeconditionstype":-1,
                        "prizeexchangerate": 100
                    },
                    {
                        "prizeid": 1,
                        "prizetype": 1,
                        "prizename": "Q币",
                        "prizeiconmd5": "md5",
                        "prizeiconurl": "http://www.icon.jpg",
                        "prizesurplusnum": 1000,
                        "prizeexchangeconditionstype":-1,
                        "prizeexchangerate": 100
                    },
                    {
                        "prizeid": 1,
                        "prizetype": 1,
                        "prizename": "Q币",
                        "prizeiconmd5": "md5",
                        "prizeiconurl": "http://www.icon.jpg",
                        "prizesurplusnum": 1000,
                        "prizeexchangeconditionstype":-1,
                        "prizeexchangerate": 100
                    },
                    {
                        "prizeid": 2,
                        "prizetype": 1,
                        "prizename": "10元话费",
                        "prizeiconmd5": "md5",
                        "prizeiconurl": "http://www.icon.jpg",
                        "prizesurplusnum": 500,
                        "prizeexchangeconditionstype":-2,
                        "prizeexchangerate": 2000
                    },
                    {
                        "prizeid": 3,
                        "prizetype": 1,
                        "prizename": "20元话费",
                        "prizeiconmd5": "md5",
                        "prizeiconurl": "http://www.icon.jpg",
                        "prizesurplusnum": 300,
                        "prizeexchangeconditionstype":-2,
                        "prizeexchangerate": 1000
                    },
                    {
                        "prizeid": 4,
                        "prizetype": 1,
                        "prizename": "30元话费",
                        "prizeiconmd5": "md5",
                        "prizeiconurl": "http://www.icon.jpg",
                        "prizesurplusnum": 50,
                        "prizeexchangeconditionstype":-2,
                        "prizeexchangerate": 3000
                    },
                    {
                        "prizeid": 5,
                        "prizetype": 1,
                        "prizename": "50元话费",
                        "prizeiconmd5": "md5",
                        "prizeiconurl": "http://www.icon.jpg",
                        "prizesurplusnum": 10,
                        "prizeexchangeconditionstype":-2,
                        "prizeexchangerate": 5000
                    },
                    {
                        "prizeid": 6,
                        "prizetype": 1,
                        "prizename": "100元话费",
                        "prizeiconmd5": "md5",
                        "prizeiconurl": "http://www.icon.jpg",
                        "prizesurplusnum": 2000,
                        "prizeexchangeconditionstype":-2,
                        "prizeexchangerate": 10000
                    },
                    {
                        "prizeid": 7,
                        "prizetype": 2,
                        "prizename": "100元沃尔玛购物卡",
                        "prizeiconmd5": "md5",
                        "prizeiconurl": "http://www.icon.jpg",
                        "prizesurplusnum": 2000,
                        "prizeexchangeconditionstype":-1,
                        "prizeexchangerate": 10000
                    },
                    {
                        "prizeid": 8,
                        "prizetype": 2,
                        "prizename": "3D眼镜",
                        "prizeiconmd5": "md5",
                        "prizeiconurl": "http://www.icon.jpg",
                        "prizesurplusnum": 2000,
                        "prizeexchangeconditionstype":-1,
                        "prizeexchangerate": 39900
                    },
                    {
                        "prizeid": 9,
                        "prizetype": 2,
                        "prizename": "iPad mini",
                        "prizeiconmd5": "md5",
                        "prizeiconurl": "http://www.icon.jpg",
                        "prizesurplusnum": 2000,
                        "prizeexchangeconditionstype":-1,
                        "prizeexchangerate": 220000
                    },
                    {
                        "prizeid": 10,
                        "prizetype": 2,
                        "prizename": "按摩椅垫",
                        "prizeiconmd5": "md5",
                        "prizeiconurl": "http://www.icon.jpg",
                        "prizesurplusnum": 2000,
                        "prizeexchangeconditionstype":-1,
                        "prizeexchangerate": 39900
                    }
                ],

                "exchangerecodlist": [{
                    "prizename": "奖品1",
                    "exchangetime": "20150323",
                    "orderno": "123456789",
                    "status": 1
                },
                    {
                        "prizename": "奖品2",
                        "exchangetime": "20150323",
                        "orderno": "123456789",
                        "status": 1
                    },
                    {
                        "prizename": "奖品3",
                        "exchangetime": "20150323",
                        "orderno": "123456789",
                        "status": 2
                    },
                    {
                        "prizename": "奖品4",
                        "exchangetime": "20150323",
                        "orderno": "123456789",
                        "status": 3
                    },
                    {
                        "prizename": "奖品5",
                        "exchangetime": "20150323",
                        "orderno": "123456789",
                        "status": 3
                    },
                    {
                        "prizename": "奖品6",
                        "exchangetime": "20150323",
                        "orderno": "123456789",
                        "status": 4
                    },
                    {
                        "prizename": "奖品7",
                        "exchangetime": "20150323",
                        "orderno": "123456789",
                        "status": 5
                    }

                ],

                "selfmedalcount":100,
                "selfcallcount":100
            };


            roomManager.SetTicketData(ticketdata);

            var curLayer =  new TicketUILayer();
            curLayer.setTag(ClientModuleType.Ticket);
            layerManager.repalceLayer(curLayer);
            DataUtil.SetGoToModule(ClientModuleType.Plaza);

        }else
        {
            //获取奖牌兑换数据
            var org_ticketData = roomManager.GetTicketData();
            if(org_ticketData == undefined) //hanhu  #只有兑换数据为空时才请求新的数据 2015/12/09
            {
                webMsgManager.SendGpGetPrizeexchanheData(function(data) {
                        roomManager.SetTicketData(data);

                        //var recorddata = data["exchangerecodlist"];
                        lm.log(" AddRecordView data: " + JSON.stringify(data));
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
            else
            {
                var curLayer =  new TicketUILayer();
                curLayer.setTag(ClientModuleType.Ticket);
                layerManager.repalceLayer(curLayer);
                DataUtil.SetGoToModule(ClientModuleType.Plaza);
            }
        }

*/

    },

    // 按下背包按钮
    OnBagClicked: function()
    {
        lm.log("显示背包界面");
        DataUtil.SetGoToModule(ClientModuleType.Plaza);
        var curLayer = new BagUILayer();
        layerManager.repalceLayer(curLayer);

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
        // 请求排行榜 数据
        layerManager.PopTipLayer(new WaitUILayer("正在努力加载中...",function()
        {
            layerManager.PopTipLayer(new PopAutoTipsUILayer("连接服务器超时，请稍后重试！", DefultPopTipsTime),false);

        },this));

        DataUtil.SetGoToModule(ClientModuleType.Plaza);
        var curLayer = new RankUILayer();
        curLayer.setTag(ClientModuleType.Rank);
        layerManager.repalceLayer(curLayer);

        return;

        //获取排行榜数据
        this.rankLayer = curLayer;
        var self = this;
        webMsgManager.SendGpGetRankingsData(function(data)
            {
                roomManager.setRankGameData(data);
                self.rankLayer.refreshViewByData(roomManager.getRankGameData());

            },
            function(errinfo) {

                layerManager.PopTipLayer(new PopAutoTipsUILayer(errinfo, DefultPopTipsTime),true);
            },
            this);
/*
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
*/
    },

    //保险箱按下
    OnSafeBoxClicked:function()
    {
        var curLayer =  new SafeBoxUILayer();
        curLayer.setTag(ClientModuleType.SafeBox);
        layerManager.repalceLayer(curLayer);
        DataUtil.SetGoToModule(ClientModuleType.Plaza);

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
    }

});
