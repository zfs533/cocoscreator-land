/**
 * Created by lizhongqiang on 15/6/16.
 */

// 产品类型 1 - 金币  4 - 黄钻 5 - 红钻 6 - 蓝钻  其他是道具
var ProductType=
{
    product_type_gold : 1,   //
    product_type_vipyellow : 4,
    product_type_vipred : 5,
    product_type_vipblue : 6
};

var payThrough =
{
    alipay : 2, //支付宝,默认使用
    qihu : 21   //360支付渠道
}

//begin added by lizhongqiang 2016-02-23 14:40
//电信上次支付时间
var TelcomPayTime=0;
//从本将时间记录到本地
try
{
    TelcomPayTime = sys.localStorage.getItem("TelcomPayTime");

}catch(e)
{
    TelcomPayTime = 0;
}
var TelcompayRuning = false;
//end added by lizhongqiang



//房间数据管理
var RoomManager = cc.Class.extend({
    matchroomdata: new Array(),
    laziroomdata: new Array(),
    happyroomdata: new Array(),
    goldroomdata: new Array(),
    dragonFightData:{},//龙虎斗数据
    rewardData: new Array(),
    bSendVerify:false,  // 是否已经发送校验请求
    taskdata: new Array(),  //hanhu #增加任务队列 2016/01/14

    // 设置金币房间数据
    SetGoldRoomData: function (roomdata) {
        //this.goldroomdata = roomdata;
        //return;

        var laiziIndex = 0;
        var goldIndex = 0;
        var happyIndex = 0;
        for (var i=0;i<roomdata.length;i++) {
            //lm.log("roomdata＝＝SerType＝＝＝＝＝＝" + roomdata[i]["SerType"]);
            if(roomdata[i]["SerType"] == 5) //laizi
            {
                this.laziroomdata[laiziIndex] = roomdata[i];
                laiziIndex = laiziIndex + 1;
            }
            else if(roomdata[i]["SerType"] == 6) //欢乐
            {
                this.happyroomdata[happyIndex] = roomdata[i];
                happyIndex = happyIndex + 1;
            }
            else
            {
                this.goldroomdata[goldIndex] = roomdata[i];
                goldIndex = goldIndex + 1;
            }
        }

        lm.log("roomdata＝＝＝＝＝＝＝＝＝＝＝＝"+JSON.stringify(roomdata));
        //lm.log("laziroomdata＝＝＝＝＝＝＝＝＝＝＝＝"+JSON.stringify(this.laziroomdata));
        //lm.log("goldRoomdata＝＝＝＝＝＝＝＝＝＝＝＝"+JSON.stringify(this.goldroomdata));
        //lm.log("happyroomdata＝＝＝＝＝＝＝＝＝＝＝＝"+JSON.stringify(this.happyroomdata));
    },

    GetGoldRoomData:function ()
    {
        return this.goldroomdata;
    },

    GetLaiziRoomData:function ()
    {
        return this.laziroomdata;
    },

    GetHappyRoomData:function ()
    {
        return this.happyroomdata;
    },
    //龙虎斗数据
    setDragonData:function(data)
    {
        this.dragonFightData = data;
    },
    //获取龙虎斗数据
    getDragonData:function()
    {
        return this.dragonFightData;
    },
    // 设置比赛房间数据
    SetMatchRoomData: function (matchdata)
    {
        var matchroomdata = this.matchroomdata;
        //lm.log("matchroomdata＝＝＝＝＝＝＝＝＝＝＝＝"+JSON.stringify(matchdata));
        //matchdata = JSON.parse(matchdata);
        //lm.log(matchdata[0]["matchid"]);
        for(var v in matchdata)
        {
            for (var key in   matchroomdata) {
                //lm.log("获取到的比赛matchid = " + matchroomdata[key]["matchid"])
                if ((matchroomdata[key]["matchid"] === matchdata[v]["matchid"]) )
                {
                    //lm.log("获取到比赛信息, matchID = " + matchroomdata[key]["matchid"]);
                    this.matchroomdata[key] = matchdata[v];
                    return;
                }
            }

            this.matchroomdata.push(matchdata[v]);
        }

    },

    GetMatchRoomData:function ()
    {
        return  this.matchroomdata;
    },

    // 设置比赛奖励数据
    SetMatchRewardData: function (data)
    {
        var rewardData = this.rewardData;
        for (var key in   rewardData) {
            if ((rewardData[key]["matchid"] === data["matchid"]) &&
                (rewardData[key]["roundid"] === data["roundid"]))
            {
                this.rewardData[key] = data;
                return;
            }
        }

        this.rewardData.push(data);
    },
    GetMatchRewardData:function ()
    {
        return  this.rewardData;
    },

    // 设置兑奖数据
    SetTicketData:function(ticketdata)
    {
        this.ticketdata = ticketdata;

    },
    // 获取兑奖数据
    GetTicketData:function()
    {
        return this.ticketdata;
    },

    // 添加订单数据
    AddTicketOrderData:function(data)
    {
        if((data === null) || (data === undefined) || (data.length === 0))
            return;

        var tickdata = roomManager.GetTicketData();
        if((tickdata === null) ||(tickdata === undefined) ||(tickdata.length < 2) )
            return;

        roomManager.GetTicketData()["exchangerecodlist"].push(data);
        lm.log("this.prizeexchangelistdata:" + JSON.stringify(roomManager.GetTicketData()));
    },

    //签到数据
    SetMarkData:function(markdata)
    {
        this.markdata = markdata;
    },
    //获取签到数据
    GetMarkData:function()
    {
        return this.markdata;
    },
    //公告数据
    SetNoticeData:function(noticedata)
    {
        this.noticedata = noticedata;
    },
    //获取公告数据
    GetNoticeData:function()
    {
        return this.noticedata;
    },

    //设置商城数据
    SetMallData:function(malldata)
    {
        this.malldata = malldata;
    },
    //获取商城数据
    GetMallData:function()
    {
        return this.malldata;
    },

    //设置任务数据
    SetTaskData:function(taskdata)
    {
        this.taskdata = taskdata;
    },
    //获取任务数据
    GetTaskData:function()
    {
        return this.taskdata;
    },

    //设置所有任务数据
    SetAllTaskData:function(taskData)
    {
        this.alltaskdata = taskData;
    },

    //获取所有任务信息
    GetAllTaskData:function()
    {
        return this.alltaskdata;
    },

    SetItemData : function(itemdata)
    {
        this.itemdata = itemdata;
    },

    GetItemData : function()
    {
        return this.itemdata;
    },

    SetBagData : function(itemdata)
    {
        this.userItemData = itemdata;
    },

    GetBagData : function()
    {
        return this.userItemData;
    },

    //设置邮件数据
    SetMailData:function(maildata)
    {
        this.maildata =   maildata;
    },
    //
    GetMailData:function()
    {
        return this.maildata;
    },
    //设置更多游戏
    SetMoreGameData:function(gamedata)
    {
        this.gamedata = gamedata;
    },
    //获取更多游戏
    GetMoreGameData:function()
    {
        return this.gamedata;
    },
    // 设置排行榜数据
    setRankGameData:function(rankdata)
    {
        this.rankdata = rankdata;
    },
    // 获取排行榜数据
    getRankGameData:function()
    {
        return this.rankdata;
    },
    // 设置活动数据
    setCurActiveData:function(activeData)
    {
        this.activeData = activeData;
    },//获取活动数据
    getCurActiveData:function()
    {
        return this.activeData;
    },
    // 设置新人礼包数据
    setNewPlayerData:function(newPlayerData)
    {
        this.newPlayerData = newPlayerData;
    },//获取新人礼包数据
    getNewPlayerData:function()
    {
        return this.newPlayerData;
    },
    //设置房间列表的准入金币
    setServerListAccessGold:function(accssgold)
    {
        this.serverListAccessGold  = accssgold;

    },
    //获取房间列表的准入金币
    getServerListAccessGold:function()
    {
        return this.serverListAccessGold;
    },

    //获取服务器准入金币
    getServerAccessGold:function(serverid)
    {
        var serverlist = this.serverListAccessGold;
        for(var key in serverlist)
        {
            if(serverlist[key]["serverid"] == serverid )
            {
                return Number(serverlist[key]["accessgold"]);
            }
        }
        return null;
    },
    // 从商场数据中获取产品
    GetProductFromMallData:function(productIdentifie)
    {
        if( (this.malldata === undefined) ||
            (this.malldata === null) ||
            (this.malldata.length < 3))
        {
            return null;
        }

        var goldlist = this.malldata["goldlist"];
        if((goldlist !== undefined) && (goldlist !== null) && (goldlist.length != 0))
        {
            for(var key in goldlist)
            {
                if(goldlist[key]["identifier"] == productIdentifie)
                {
                    return goldlist[key];
                }
            }
        }

        var propertylist = this.malldata["propertylist"];
        if((propertylist !== undefined) && (propertylist !== null) && (propertylist.length != 0))
        {
            for(var key in propertylist)
            {
                if(propertylist[key]["identifier"] == productIdentifie)
                {
                    return propertylist[key];
                }
            }
        }

        return null;
    },
    //请求产品列表
    RequestProduct:function(nModule)
    {
        var malldata = roomManager.GetMallData();
        if((malldata === undefined) || (malldata === null))return;

        //请求苹果服务器，获取产品列表
        var goldlist = malldata["goldlist"];
        if((goldlist !== undefined) && (goldlist !== null))
        {
            for(var i = 0;i<goldlist.length;i++)
            {
                AddRequestProduct(goldlist[i]["identifier"]);
            }
        }

        var propertylist = malldata["propertylist"];
        if((propertylist !== undefined) && (propertylist !== null))
        {
            for(var i = 0;i<propertylist.length;i++)
            {
                AddRequestProduct(propertylist[i]["identifier"]);
            }
        }

        RequestProducts(nModule);


    },


    // 1.这里要做的事，发送消息生成订单
    // 2.将订单保存在本地，初始化完成状态为false;
    // 3.请求支付
    //支付产品
    RequestPayment:function(productIdentifier, name, price, value)
    {
        lm.log("yyp RequestPayment " );
        // 测试数据
        if (GetDeviceType() == DeviceType.ANDROID) //hanhu #android端采用棱镜支付 2015/10/08
        {
            lm.log("yyp RequestPayment 1" );
            //begin added by lizhongqiang 2016-02-23 14:40
            //电信渠道 时间限制- 10分钟之内不允许再次生成订单
            if(ChannelLabel == "telcom")
            {
                lm.log("yyp RequestPayment 2" );
                if(TelcompayRuning ==true)
                    return;

                lm.log("yyp RequestPayment 3" );
                var curDate = new Date();
                var curPayTime = curDate.getTime() / 1000;
                if(TelcomPayTime!=0)
                {
                    // 10 分钟之内不允许再次生成订单
                    if((curPayTime - TelcomPayTime) < 600 )
                    {
                        var tiptime = Math.floor(600 - (curPayTime - TelcomPayTime));
                        var tipinfo = "操作太频繁，请"+tiptime+"秒以后重试！";
                        layerManager.PopTipLayer(new PopAutoTipsUILayer(tipinfo,DefultPopTipsTime), this);
                        return;
                    }
                }
            }
            //end added by lizhongqiang 2016-02-23



            lm.log("yyp RequestPayment 4" );
            //RequestPayment(1,productIdentifier,1, name, price / 100, value);
            webMsgManager.SendGpGetOrderData(productIdentifier,function(data)
            {
                lm.log("yyp RequestPayment 5" );
                // 保存本地订单
                userInfo.AppendOrderData(userInfo.globalUserdData["dwUserID"],
                    data["orderid"],
                    data["approductid"],
                    data["orderamount"],
                    data["appletransaction"],
                    data["orderstatus"]);

                lm.log("before Trans price = " + price + "name = " + name + " 订单号为: " + data["orderid"]);
                //hanhu #针对联通渠道调用接口传递MAC,IME 2015/11/10
                var ChannelID = 0;
                if(ChannelLabel == "8633")  //hanhu #只有自己平台的包才调用这个接口 2015/12/11
                {
                    lm.log("yyp RequestPayment 6" );
                    ChannelID = jsb.reflection.callStaticMethod(AndroidPackageName, "getAndroidVersion", "()I");
                }
                lm.log("渠道ID = " + ChannelID);

                //hanhu #自有渠道使用自定义支付 2015/10/20
                if(ChannelLabel == "8633" && ChannelID != ChanelID.ANDROID_UNICOM && ChannelID != ChanelID.ANDROID_UNICOM4GOOPERATION)
                {
                    lm.log("yyp RequestPayment 7" );
                    lm.log("使用官方版本支付");
                    //var method = SDKPayMethod.UPPay;
                    //jsb.reflection.callStaticMethod(AndroidPackageName, "BuyItemMyself", "(Ljava/lang/String;ILjava/lang/String;I)V", data["orderid"], 1, name, price, SDKPayMethod.Alipay);
                    //this.showPaymentSelect(data["orderid"], name, price); //hanhu #需先选择支付方式 2015/12/31
                    jsb.reflection.callStaticMethod(AndroidPackageName, "BuyItemMyself", "(Ljava/lang/String;ILjava/lang/String;I)V", data["orderid"], 1, name, price);
                }
                else if(ChannelID == ChanelID.ANDROID_UNICOM || ChannelID == ChanelID.ANDROID_UNICOM4GOOPERATION) //hanhu #联通需先完成订单信息
                {
                    lm.log("yyp RequestPayment 8" );
                    lm.log("补全订单信息");
                    var IME = jsb.reflection.callStaticMethod(AndroidPackageName, "getAndroidIME", "()Ljava/lang/String;");
                    var MAC = jsb.reflection.callStaticMethod(AndroidPackageName, "getAndroidMAC", "()Ljava/lang/String;");
                    webMsgManager.SendGetCompleteOerderInfo(productIdentifier, data["orderid"], IME, MAC, function(res){
                        lm.log("成功完成订单信息，发送支付请求");
                        jsb.reflection.callStaticMethod(AndroidPackageName, "BuyItemMyself", "(Ljava/lang/String;ILjava/lang/String;I)V", data["orderid"], 1, name, price);
                    },function(res){
                        lm.log("完成订单信息失败 data = " + JSON.stringify(res));
                        layerManager.PopTipLayer(new PopAutoTipsUILayer("生成订单信息失败，请稍后重试！", DefultPopTipsTime));
                    },this);
                }
                else if(ChannelLabel == "baidu")
                {
                    lm.log("yyp RequestPayment 9" );
                    //请求支付
                    lm.log("调用百度支付接口");
                    jsb.reflection.callStaticMethod(AndroidPackageName,"BuyItemMyself","(Ljava/lang/String;Ljava/lang/String;I)V", data["orderid"], name, price);
                }
                else if(ChannelLabel == "wangyou")
                {
                    var pData = {
                        orderid:data["orderid"],    //订单号
                        approductid:data["approductid"],    //产品ID
                        productName:name,    //产品名字
                        orderamount:Number(data["orderamount"])*100    //钱
                    }
                    var strPData = JSON.stringify(pData);
                    var sdkHelper = new lj.Ljsdkhelper();
                    sdkHelper.do360SdkPay(strPData);
                    //jsb.reflection.callStaticMethod(AndroidPackageName, "BuyItemMyself", "(Ljava/lang/String;ILjava/lang/String;I)V", data["orderid"], 1, name, price);
                }
                else if(ChannelLabel == "baiduSingle")
                {
                    lm.log("yyp RequestPayment 10" );
                    lm.log("调用百度单机支付接口");
                    jsb.reflection.callStaticMethod(AndroidPackageName,"BuyItemMyself","(Ljava/lang/String;Ljava/lang/String;I)V", data["onlineid"]+"", name, price);
                }
                else  if(ChannelLabel == "telcom")//电信入口
                {
                    lm.log("yyp RequestPayment 11" );
                    lm.log("电信入口");
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

                    //通知服务器发送验证码给用户
                    NewWebMsgManager.SendGetTelcomCode("",imsi,data["orderid"], name, function(data2) {

                            TelcompayRuning = true;
                            //记录上次生成订单的时间
                            var curDate = new Date();
                            TelcomPayTime = curDate.getTime() /1000;

                            //将时间记录到本地
                            try
                            {
                                sys.localStorage.setItem("TelcomPayTime",String(TelcomPayTime));

                            }catch(e)
                            {
                            }


                            //弹出动态码输入图层
                            layerManager.PopTipLayer(new TelcomCodeLayer(data["orderid"],data2["transactionid"]),false);

                        },
                        function(responseText)
                        {
                            TelcompayRuning = false;
                            // 其他错误提示
                            layerManager.PopTipLayer(new PopAutoTipsUILayer(responseText,DefultPopTipsTime), this);


                        }, this);
                }
                else if(ChannelLabel == "anySDK")
                {
                    var iap_plugin = AnySDKAgent.getIAPPlugin();
                    anySDKPayInfo.Product_Id = productIdentifier;
                    anySDKPayInfo.Product_Name = name;
                    anySDKPayInfo.Product_Price = price + "";
                    anySDKPayInfo.Role_Id = userInfo.globalUserdData["dwUserID"] + "";
                    anySDKPayInfo.Role_Name = userInfo.globalUserdData["szNickName"];
                    anySDKPayInfo.EXT = data["orderid"];

                    iap_plugin.setListener(this.onAnySDKPayResult, this);
                    lm.log("anySDK订单数据为：" + anySDKPayInfo);
                    iap_plugin.payForProduct(anySDKPayInfo);
                }
                else
                {
                    lm.log("yyp RequestPayment 12" );
                    //请求支付
                    lm.log("调用棱镜支付接口");
                    RequestPayment(1, data["orderid"], 1, name, price, value);
                }

                //hanhu #统计购买事件 2015、10、19
                var through = 2;
                if(ChannelLabel == "360")
                {
                    through = payThrough.qihu;
                }
                else
                {
                    through = payThrough.alipay
                }
                jsb.reflection.callStaticMethod(AndroidPackageName, "payForItem", "(FLjava/lang/String;IFI)V", price, name, 1, price * 25000, through);

            }, function(errinfo)
            {
                lm.log("yyp RequestPayment 13" );
                // 连接服务器失败，请稍后重试；
                layerManager.PopTipLayer(new PopAutoTipsUILayer("获取产品信息失败，请稍后重试！", DefultPopTipsTime));

            },this);

        }else
        {
            lm.log("yyp RequestPayment 14" );
            //检测当前有没有未完成的交易，有未完成的，给出提示。
            var order =  userInfo.GetUnCompleteOrder(userInfo.globalUserdData["dwUserID"]);
            lm.log("当前未完成的订单：" + order);
            if((order !== null) && (order != undefined) && (order.length > 0))
            {
                lm.log("yyp RequestPayment 15" );
                this.AutoVerificationAppleOrder();
                layerManager.PopTipLayer(new PopAutoTipsUILayer("您当前还有未完成的交易，请稍后重试！", DefultPopTipsTime));
                return;
            }
            CurrentBuyIdentify = productIdentifier;
            AddRequestProduct(productIdentifier); //hanhu #只有在支付时才进行数据请求 2016/04/01
            RequestProducts(0);

            // 请求服务器订单数据
            //webMsgManager.SendGpGetOrderData(productIdentifier,function(data)
            //{
            //    lm.log("yyp RequestPayment 16" );
            //    // 保存本地订单
            //    userInfo.AppendOrderData(userInfo.globalUserdData["dwUserID"],
            //        data["orderid"],
            //        data["approductid"],
            //        data["orderamount"],
            //        data["appletransaction"],
            //        data["orderstatus"]);
            //
            //
            //    //请求支付
            //    if(GET_CHANEL_ID() == ChanelID.IOS_BREAKOUT){
            //        lm.log("yyp RequestPayment 17" );
            //        //hanhu #统计购买事件 2015、10、19
            //        var through = payThrough.alipay;
            //        RequestPayment(data["orderid"], name,1, price, AppPayCallBackName);
            //
            //        PayClickEvent(price, through, name, 1, price);
            //    }else{
            //
            //        lm.log("yyp RequestPayment 18" );
            //        RequestPayment(data["orderid"],productIdentifier,1);
            //    }
            //}, function(errinfo)
            //{
            //    // 连接服务器失败，请稍后重试；
            //    layerManager.PopTipLayer(new PopAutoTipsUILayer("获取产品信息失败，请稍后重试！", DefultPopTipsTime));
            //
            //},this);

            layerManager.PopTipLayer(new WaitUILayer("当前订单正在处理中，请稍后..."),true);  //hanhu #苹果支付才调用等待界面 2015/10/08
        }


    },

    // 自动校验没有完成的订单
    AutoVerificationAppleOrder:function()
    {
        if(userInfo.globalUserdData == null)
        {
            return false;
        }

        var data = userInfo.GetUnCompleteOrder(userInfo.globalUserdData["dwUserID"]);
        if( (data !== undefined) && (data !== null)  && (data.length !== 0 ) && (data[0]["receipt"] !== undefined) && (data[0]["receipt"] !== null))
        {
            this.VerificationOrderID(data[0]["orderid"],data[0]["approductid"], data[0]["receipt"]);
            return true
        }
        else
        {
            return false;
        }
    },
    //验证IOS端的交易是否完成
    VerificationOrderID:function(orderid,approductid,receipt)
    {
        if(this.bSendVerify == true)
            return;

        lm.log("yyyyyyyp购买失败，请联系客户！222");
        var self = this;
        // 验证成功
        webMsgManager.SendVerificationData(orderid,approductid,receipt,function(data)
        {
            lm.log("yyyyyyyp购买失败，请联系客户！111");
            var result= data["result"];
            lm.log("验证成功,完成订单: "  +  result);
            //1、 完成订单
            userInfo.CompleteOrder(data["orderid"]);
            self.bSendVerify = false;
            if(result == 1)
            {

                // {"cmd":2026, "sign":"xxxxxxxx","message":"这是提示信息","status" : true, "data": {"result":1,"orderid":1000,"approductid":4784846,
                //“memberlist":[{"memberorder":10,"activestatus":1,"memberoveryear":2015,"memberovermonth":5,"memberoverday":8,"memberoverhour":9,"memberoverminute":10,"memberoversecond":0},
                //   {"memberorder":8,"activestatus":0,"memberoveryear":2015,"memberovermonth":5,"memberoverday":8,"memberoverhour":9,"memberoverminute":10,"memberoversecond":0},
                //   {"memberorder":7,"activestatus":0,"memberoveryear":2015,"memberovermonth":5,"memberoverday":8,"memberoverhour":9,"memberoverminute":10,"memberoversecond":0}]，
                //"userproperty":[ {"pid":11,pcount:11}, {"pid":12,pcount:11}, {"pid":11,pcount:8}, {"pid":11,pcount:6}}}

                // 2、验证成功给奖励，更新用户数据
                var userdata = roomManager.GetProductFromMallData(data["approductid"]);

                var type= userdata["type"];
                // 金币数据
                var value = userdata["value"];

                var pname = userdata["pname"];

                lm.log("验证成功,完成订单: "  +  type + " "+  value + " "+  pname + " ");

                switch (Number(type))
                {
                    case ProductType.product_type_gold:
                        // 金币，直接增加到账户
                    {
                        //layerManager.PopTipLayer(new PopAutoTipsUILayer("您已成功购买:" + pname  + " 获得金币："+ value , DefultPopTipsTime),false);
                        if(MALLUILAYER)
                        {
                            MALLUILAYER.OnBuyCallback(true);
                        }
                    }
                        break;

                    case ProductType.product_type_vipyellow:
                    case ProductType.product_type_vipred:
                    case ProductType.product_type_vipblue:
                    {

                        // 更新会员列表
                        userInfo.globalUserdData["userinfoex"]["memberlist"] = data["memberlist"];
                        if(layerManager.getRuningLayer())
                            layerManager.getRuningLayer().UpdateUserInFo();

                        // VIP
                        layerManager.PopTipLayer(new PopAutoTipsUILayer("您已成功购买:" + pname +  " 会员资格已生效！", DefultPopTipsTime),false);

                    }
                        break;
                    default :
                        // 道具，直接添加到道具列表
                    {
                        // 更新用户自己的道具列表
                        this.malldata["userproperty"] = data["userproperty"];

                        //lm.log("更新用户自己的道具列表: "  +  data["userproperty"]);
                        layerManager.PopTipLayer(new PopAutoTipsUILayer("您已成功购买:" + pname + " 已放入您的道具栏中！", DefultPopTipsTime),false);

                    }
                        break;
                }

            }else
            {
                lm.log("yyyyyyyp购买失败，请联系客户！");
                // 购买失败
                //layerManager.PopTipLayer(new PopAutoTipsUILayer("购买失败，请联系客户！", DefultPopTipsTime),true);
                if(MALLUILAYER)
                {
                    MALLUILAYER.OnBuyCallback(false);
                }
            }


        },function(errinfo)
        {
            lm.log("自动完成订单 连接服务器失败，请稍后重试");
            self.bSendVerify = false;
            // 连接服务器失败，请稍后重试；
            layerManager.PopTipLayer(new PopAutoTipsUILayer(errinfo, DefultPopTipsTime),false);


        },self);

    },


    //根据服务器ID获取房间类型
    GetRoomType:function(serverid)
    {
        lm.log("GetRoomType: serverid: " + serverid);
        //依次从金币场，比赛场中查找房间
        var goldroomData =  roomManager.GetGoldRoomData();
        for(var key in goldroomData)
        {
            var serverlist = goldroomData[key]["serverlist"];
            if(serverlist === null)
                continue;

            for(var key1 in serverlist)
            {
                if(serverlist[key1]["serverid"] === serverid )
                {
                    lm.log("GetRoomType: ROOM_TYPE_GOLD");
                    return RoomType.ROOM_TYPE_GOLD;
                }
            }
        }

        var matchroomData =  roomManager.GetMatchRoomData();
        for(var key in matchroomData)
        {
            var serverlist = matchroomData[key]["serverlist"];
            if(serverlist === null)
                continue;

            for(var key1 in serverlist)
            {
                if(serverlist[key1]["serverid"] === serverid )
                {
                    lm.log("GetRoomType: ROOM_TYPE_MATCH");
                    return RoomType.ROOM_TYPE_MATCH;
                }
            }
        }
        lm.log("GetRoomType: ROOM_TYPE_NULL");

        return RoomType.ROOM_TYPE_NULL;
    },

    showPaymentSelect : function(orderID, name, price)
    {
        var layer = cc.Layer.create();
        setTouchListener(layer, true, function(){
            return true;
        });

        cc.director.getRunningScene().addChild(layer, 9999);

        var back = cc.Sprite.create("res/payment/payBack.png");
        layer.addChild(back);
        back.setPosition(cc.p(winSize.width / 2, winSize.height / 2));

        var des = cc.Sprite.create("res/payment/description.png");
        back.addChild(des);
        des.setPosition(cc.p(winSize.width * 0.1, winSize.height * 0.5));

        var alipayButton = new ccui.Button();
        alipayButton.loadTextures("res/payment/alipay.png", "res/payment/alipay.png", "res/payment/alipay.png", ccui.Widget.LOCAL_TEXTURE);
        layerManager.SetButtonPressAction(alipayButton);
        back.addChild(alipayButton);
        alipayButton.setPosition(cc.p(winSize.width * 0.5, winSize.height * 0.8));
        alipayButton.addTouchEventListener(function(sender, type){
            if(type == ccui.Widget.TOUCH_ENDED)
            {
                lm.log("使用支付宝支付");
                jsb.reflection.callStaticMethod(AndroidPackageName, "BuyItemMyself", "(Ljava/lang/String;ILjava/lang/String;II)V", orderID, 1, name, price, SDKPayMethod.Alipay);
            }
        },this);

        var uppayButton = new ccui.Button();
        uppayButton.loadTextures("res/payment/UPPay.png", "res/payment/UPPay.png", "res/payment/UPPay.png", ccui.Widget.LOCAL_TEXTURE);
        layerManager.SetButtonPressAction(uppayButton);
        back.addChild(uppayButton);
        uppayButton.setPosition(cc.p(winSize.width * 0.5, winSize.height * 0.5));
        uppayButton.addTouchEventListener(function(sender, type){
            if(type == ccui.Widget.TOUCH_ENDED)
            {
                lm.log("使用银联支付");
                webMsgManager.SendGetUPPAYORDERID(orderID, function(data){
                        var signedOrder = data;
                        lm.log("SignOrderID = " + data);
                        jsb.reflection.callStaticMethod(AndroidPackageName, "BuyItemMyself", "(Ljava/lang/String;ILjava/lang/String;II)V", signedOrder, 1, name, price, SDKPayMethod.UPPay);
                    },
                    function(data)
                    {
                        lm.log("获取银联签名订单失败，data = " + JSON.stringify(data));
                    }, this);

            }
        }, this);

        var wechatButton = new ccui.Button();
        wechatButton.loadTextures("res/payment/wechat.png", "res/payment/wechat.png", "res/payment/wechat.png", ccui.Widget.LOCAL_TEXTURE);
        layerManager.SetButtonPressAction(wechatButton);
        back.addChild(wechatButton);
        wechatButton.setPosition(cc.p(winSize.width * 0.5, winSize.height * 0.2));
        wechatButton.addTouchEventListener(function(sender, type){
            if(type == ccui.Widget.TOUCH_ENDED)
            {
                lm.log("使用微信支付");
                webMsgManager.SendGetUPPAYORDERID(orderID, function(data){
                        var signedOrder = data;
                        lm.log("SignOrderID = " + data);
                        jsb.reflection.callStaticMethod(AndroidPackageName, "BuyItemMyself", "(Ljava/lang/String;ILjava/lang/String;II)V", signedOrder, 1, name, price, SDKPayMethod.UPPay);
                    },
                    function(data)
                    {
                        lm.log("获取银联签名订单失败，data = " + JSON.stringify(data));
                    }, this);

            }
        }, this);

        var ExitButton = new ccui.Button();
        ExitButton.loadTextures("btn_back_gy_nor.png", "btn_back_gy_pre.png", "", ccui.Widget.PLIST_TEXTURE);
        back.addChild(ExitButton);
        ExitButton.setPosition(cc.p(winSize.width * 0.96, winSize.height * 0.95));
        ExitButton.addTouchEventListener(function(sender, type){
            if(type == ccui.Widget.TOUCH_ENDED)
            {
                cc.director.getRunningScene().removeChild(layer);
            }
        }, this);

    }

});

// 服务器数据管理类
var roomManager  = roomManager || new RoomManager();