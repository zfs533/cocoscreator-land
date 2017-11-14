/**
 * Created by lizhongqiang on 15/6/9.
 */

//游戏大厅登陆主ID
var PlazaLogonMainID = 100;
 
//服务器列表主ID
var ServerlistMainID = 101;


//大厅用户服务
var GpUserServiceMainID = 3;


//大厅登录主命令
var GpLogonMainID = 1 ;

////任务消息主ID
//var MDM_GP_TASK = 6;
//
//var TaskMsg = {
//    SUB_GP_USERTASKINFO : 1, //任务信息
//    SUB_GP_USERTASKREMOVE : 2, //任务删除
//    SUB_GP_USERTASKREWARD : 3 //任务奖励
//}

//大厅登录消息
var PlazaLogonMsg =
{
    //I D 登录
    SUB_MB_LOGON_GAMEID: 1,
    //帐号登录-其他账号
    SUB_MB_LOGON_ACCOUNTS: 2,
    //帐号登录-手机
    SUB_MB_LOGON_MOBILE: 8,

    //其他登录
    SUB_MB_LOGON_OTHERPLATFORM: 3,
    //注册帐号
    SUB_MB_REGISTER_ACCOUNTS: 4,
    //游客登录
    SUB_MB_LOGON_VISITOR: 5,
    //在线检测
    SUB_MB_ONLINE_CHECK: 6,
    //新手奖励
    SUB_MB_NOVICE_AWARD: 7,
    //重新发送消息
    SUB_MB_RESENDMSG:7,
    //领取救济金
    SUB_GP_RELIEF_GOLD_RES:8,

    //登录成功
    SUB_MB_LOGON_SUCCESS: 100,
    //登录失败
    SUB_MB_LOGON_FAILURE: 101,
    //登录完成
    SUB_MB_LOGON_FINISH: 102,

    //新手奖励返回
    SUB_MB_NOVICE_AWARD_RES: 104,
    //新手奖励领奖状态 0为未领取1为领取
    SUB_MB_NOVICE_AWARD_STATE: 105,

    //升级提示
    SUB_MB_UPDATE_NOTIFY: 200,
    //列表信息
    MDM_MB_SERVER_LIST: 101,
    //种类列表
    SUB_MB_LIST_KIND: 100,
    //房间列表
    SUB_MB_LIST_SERVER: 101,
    //列表完成
    SUB_MB_LIST_FINISH: 200,

    //需要重新登陆
    SUB_GP_LOGON_NEEDRELOGON : 104,
    //重连成功
    SUB_GP_LOGON_RECONNECTOK : 105,

    //需要输入保险箱密码 - 取款时用
    SUB_MB_LOGON_NEEDINPUTINSTURE:106,
    //游戏维护
    SUB_GP_SERVICE_MODIFY : 107,
    //领取救济金
    SUB_GP_RELIEF_GOLD_RESP : 108,

//请求服务器房间列表子消息ID
    SUB_MB_REQUESTKINDLIST:100,

    //自动重连回房间
    SUB_GP_AUTOLOGIN_ROOM : 103,

    //配置文件版本信息
    SUB_MB_CONFIG_UPDATE : 106
};

//列表消息
var ServerListMsg =
{
    SUB_MB_LIST_KIND: 100, //种类列表
    SUB_MB_LIST_SERVER: 101, //房间列表
    SUB_MB_LIST_FINISH: 200  //列表完成
};


//大厅用户服务消息
var GpUserServiceMsg =
{
    SUB_GP_ONLINE_CHECK:1,          // 心跳消息
    SUB_GP_MODIFY_LOGON_PASS: 101, //修改登录密码
    SUB_GP_MODIFY_INSUREPASS: 102, //修改银行密码
    SUB_GP_USER_FACE_INFO:  200, //头像信息
    SUB_GP_SYSTEM_FACE_INFO	: 201,  //系统头像
    SUB_GP_CUSTOM_FACE_INFO :202, //自定头像
    SUB_GP_MODIFY_INDIVIDUAL:303,  // 修改资料

    SUB_GP_USER_SAVE_SCORE:400, //存款操作
    SUB_GP_USER_TAKE_SCORE:401, //取款操作
    SUB_GP_USER_GIVE_SCORE:402, //赠送金币


    SUB_GP_USER_INSURE_SUCCESS:405, //银行成功
    SUB_GP_USER_INSURE_FAILURE:406, //银行失败

    //比赛
    SUB_GP_MATCH_SIGNUP:500,      //比赛报名
    SUB_GP_MATCH_UNSIGNUP:501,    //取消报名
    SUB_GP_MATCH_SIGNUP_RESULT:503, //报名结果

    SUB_GP_OPERATE_SUCCESS:900,  //操作成功
    SUB_GP_OPERATE_FAILURE:901,  //操作失败

    SUB_GP_USERINFOUPDATE:1000,   //用户信息更新

    SUB_GP_USERPROPERTYUPDATE:1002 //用户道具更新
};

// 大厅用户登录消息
var GpLogonMsg =
{
    SUB_GP_SYSTEM_NOTIFY : 201    // 系统提示消息
};

// 控制掩码
var GpLogonControlFlag=
{

    SMT_CLOSE_ROOM : 0x0100,   //关闭房间
    SMT_CLOSE_GAME : 0x0200,  //关闭游戏
    SMT_CLOSE_LINK : 0x0400  // 中断连接

};



// 更新用户信息类型
var UpdateUserInFoType=
{
    UPDATETYPE_GOLD: 0x00000001,  // 金币
    UPDATETYPE_FACE: 0x00000002,  // 头像
    UPDATETYPE_VIP: 0x00000004,    // 会员
    UPDATETYPE_ITEM: 0x00000020,   //更新道具
    UPDATETYPE_MEDEL: 0x00000040,   //奖牌更新
    UPDATETYPE_MOBILE: 0x00000080,   //话费券更新
    UPDATETYPE_PAY : 0x00000100      //更新充值记录
};


// 用户携带信息
var DtpGpUserinfo =
{

    DTP_GP_UI_NICKNAME:1,         // 用户昵称
    DTP_GP_UI_USER_NOTE:2,      // 用户说明
    DTP_GP_UI_UNDER_WRITE:3,    // 个性签名
    DTP_GP_UI_QQ:4,             // QQ号码
    DTP_GP_UI_EMAIL:5,          // 电子邮件
    DTP_GP_UI_SEAT_PHONE:6,     // 固定电话
    DTP_GP_UI_MOBILE_PHONE:7,   // 移动电话
    DTP_GP_UI_COMPELLATION:8,   // 真实姓名
    DTP_GP_UI_DWELLING_PLACE:9  // 联系地址

};


var PlazaMsgManager = cc.Class.extend({
    address: DefultPlazaLogonAddress,  //初始化默认登录地址
    port: DefultPlazaLogonPort,        //初始化默认登录端口
    updatenofify:false,                //是否需要更新
    needinputinsturepass:false,        //取款是否需要输入保险箱密码

    ReConnectCount:0,      //大厅重连次数-直到收到重连成功消息、退出到登录界面，清空次数

    ctor: function () {
        this.initPlazaListeners();
        this.ReconnectKey = 0;
        this.RecieveIndex = 0;
    },

    // 设置大厅登录地址
    SetPlazaLogonAddress: function (address, port) {
        this.address = address;
        this.port = port;
    },

    //登录回调接口
    SetLogonCallBack: function (linkfailedcallback, logonsuccessedcallback, logonfailedcallback, target) {
        //连接失败回调
        this.LinkFailedCallBack = linkfailedcallback;

        //登录成功回调
        this.LogonSuccessedCallBack = logonsuccessedcallback;

        //登录失败回调
        this.LogonFailedCallBack = logonfailedcallback;

        //目标
        this.Target = target;
    },

    //获取新手奖励回调接口
    SetNewplayerchestCallBack: function (newplayerchestcallback, target) {
        //新手奖励回调
        for ( var i = 0; i < arguments.length; i++ )
        {
            lm.log("---------------123456789  "+arguments[i]);
        }
        this.newplayerchestcallback = newplayerchestcallback;

        //目标
        this.Target = target;
    },

    //大厅监听
    initPlazaListeners: function () {
        var self = this;
        lm.log("初始化大厅消息监听");
        // 升级提示
        connectUtil.dataListenerManual(KernelPlaza, PlazaLogonMainID, PlazaLogonMsg.SUB_MB_UPDATE_NOTIFY, function (SerializeObject, wDataSize)
        {
            lm.log("CMD_MB_UpdateNotify 0");
            var data = {};
            data["type"] = "CMD_MB_UpdateNotify";

            //必须升级
            data["cbMustUpdate"] = DataUtil.ReadNumber(SerializeObject, 8);

            //建议升级
            data["cbAdviceUpdate"] = DataUtil.ReadNumber(SerializeObject, 8);

            //当前版本
            data["dwCurrentVersion"] = DataUtil.ReadNumber(SerializeObject, 32);

            var kenerVsersion = LOWORD(  data["dwCurrentVersion"] );
            var plazaVsersion = HIWORD(  data["dwCurrentVersion"] );

            lm.log("CMD_MB_UpdateNotify : " + JSON.stringify(data));
            // 如果是必须更新
            if(data["cbMustUpdate"] == 1)
            {
                self.updatenofify = true;

                // 当前的内核版本比服务器的内核版本小
                if(GET_KERNEL_VERSION() < kenerVsersion)
                {
                    switch(Number(GET_CHANEL_ID())) {
                        case ChanelID.IOS_APPSTORE: // iosAppStore 渠道
                        {
                            //layerManager.PopTipLayer(new PopTipsUILayerEx("立即更新", "游戏版本已升级，请到AppStore下载完整包更新！", function (id) {
                            //    if (id == clickid.ok) {
                            //        OpenAppURL(DataUtil.GetAppURL());
                            //    }else
                            //    {
                            //        ExitGame();
                            //    }
                            //}));

                            var pop = new ConfirmPop(this, Poptype.ok, "游戏版本已升级，请到AppStore下载完整包更新！");//ok
                            pop.addToNode(cc.director.getRunningScene());
                            pop.setokCallback(
                                function()
                                {
                                    OpenAppURL(DataUtil.GetAppURL());
                                },
                                function()
                                {
                                    ExitGameEx();
                                }
                            );
                        }
                            break;
                        case ChanelID.IOS_BREAKOUT: // ios越狱 渠道
                        {
                            //layerManager.PopTipLayer(new PopTipsUILayerEx("立即更新", "游戏版本已升级，请更新完整包！", function (id) {
                            //    if (id == clickid.ok) {
                            //        OpenAppURL(DataUtil.GetAppURL());
                            //    }else
                            //    {
                            //        ExitGame();
                            //    }
                            //}));

                            var pop = new ConfirmPop(this, Poptype.ok, "游戏版本已升级，请更新完整包！");//ok
                            pop.addToNode(cc.director.getRunningScene());
                            pop.setokCallback(
                                function()
                                {
                                    OpenAppURL(DataUtil.GetAppURL());
                                },
                                function()
                                {
                                    ExitGameEx();
                                }
                            );
                        }
                            break;
                        case ChanelID.ANDROID_OFFICIAL: // Android 官方渠道
                        {
                            //layerManager.PopTipLayer(new PopTipsUILayerEx("立即更新", "游戏版本已升级，请更新完整包！", function (id) {
                            //    if (id == clickid.ok) {
                            //        OpenAppURL(DataUtil.GetAppURL(),DataUtil.GetApkMD5());
                            //    }else
                            //    {
                            //        ExitGame();
                            //    }
                            //}));
                            var pop = new ConfirmPop(this, Poptype.ok, "游戏版本已升级，请更新完整包！");//ok
                            pop.addToNode(cc.director.getRunningScene());
                            pop.setokCallback(
                                function()
                                {
                                    OpenAppURL(DataUtil.GetAppURL(),DataUtil.GetApkMD5());
                                },
                                function()
                                {
                                    ExitGameEx();
                                }
                            );
                        }
                            break;

                        case ChanelID.ANDROID_UNICOM4GOOPERATION: // Android 联通渠道
                        {
                            //layerManager.PopTipLayer(new PopTipsUILayerEx("立即更新", "游戏版本已升级，请更新完整包！", function (id) {
                            //    if (id == clickid.ok) {
                            //        OpenAppURL(DataUtil.GetAppURL(),DataUtil.GetApkMD5());
                            //    }else
                            //    {
                            //        ExitGame();
                            //    }
                            //}));
                            var pop = new ConfirmPop(this, Poptype.ok, "游戏版本已升级，请更新完整包！");//ok
                            pop.addToNode(cc.director.getRunningScene());
                            pop.setokCallback(
                                function()
                                {
                                    OpenAppURL(DataUtil.GetAppURL(),DataUtil.GetApkMD5());
                                },
                                function()
                                {
                                    ExitGameEx();
                                }
                            );
                        }
                            break;

                        default :
                            break;
                    }

                }else if(VERSION_PLAZA < plazaVsersion ) // 大厅版本比服务器的版本小
                {
                    //layerManager.PopTipLayer(new PopTipsUILayerEx("确定", "游戏版本已升级，请重启游戏，更新后重新进入！", function (id)
                    //{
                    //    ExitGame();
                    //
                    //}));
                    var pop = new ConfirmPop(this, Poptype.ok, "游戏版本已升级，请重启游戏，更新后重新进入！");//ok
                    pop.addToNode(cc.director.getRunningScene());
                    pop.hideCloseBtn();
                    pop.setokCallback(
                        function()
                        {
                            ExitGameEx();
                        }
                    );
                }

            }
            //lm.log("CMD_MB_UpdateNotify: " +    data["dwCurrentVersion"] +" kenervsrsion"+ kenerVsersion + "  plazaVsersion: " + plazaVsersion);
        });


        // 登录返回消息
        connectUtil.dataListenerAuto(KernelPlaza, PlazaLogonMainID, function (wSbuCmdID, data, size)
        {
         // 登录大厅成功
            if (wSbuCmdID ==PlazaLogonMsg.SUB_MB_LOGON_SUCCESS )
            {
                addPlazzResource();//zfs
                lm.log("===================================addPlazzResource();//zfs")
                //if ( Is_LAIZI_ROOM() )
                //{
                //    self.SendRequestKindList(200);
                //}
                //else
                {
                    self.SendRequestKindList(24);
                    self.SendRequestKindList(260);
                    self.SendRequestKindList(DragonData_GameId_122.GAMEID);
                }
                self.updatenofify = false;
                lm.log("登录返回消息 got suceess: " + JSON.stringify(data));
                    userInfo.globalUserdData = data;

                    ////lm.log("login key :",data["szLoginKey"]);

                    // 1- 金币 4 - 黄钻 5 - 红钻 6 - 蓝钻

                    // 保存登录历史
                    userInfo.AppendLocalData(userInfo.GetCurPlayerAccount(),
                        userInfo.GetCurPlayerPassword(),
                        data["dwUserID"],
                        data["wFaceID"],
                        data["dwCustomID"],
                        data["szNickName"],
                        data["lUserScore"],
                        data["dwCustomID"], //手机登录标志
                        DataUtil.AkeyRegisterUser,
                        plazaMsgManager.address);

                    UserInfo.cbPay = data["cbPay"];
                    UserInfo.dwReliefCountOfDay = data["dwReliefCountOfDay"];
                    UserInfo.dwReliefCountOfDayMax = data["dwReliefCountOfDayMax"];
                    UserInfo.dwReliefGold = data["dwReliefGold"];

                    //请求VIP信息
                    //self.RequestMemberData();

                    //请求获取金币场数据
                    //self.RequestGoldRoomData();

                    //请求用户头像数据
                    self.RequestUseFace();

                    //请求商城数据 -防止游戏中购买无数据提示
                    //self.RequestMallData();

                if (self.LogonSuccessedCallBack)
                {
                    lm.log("调用登陆成功函数 " );
                    self.LogonSuccessedCallBack.call(self.target);
                }


            }
        });

        // 登录失败接口
        connectUtil.dataListenerManual(KernelPlaza, PlazaLogonMainID, PlazaLogonMsg.SUB_MB_LOGON_FAILURE, function (SerializeObject, wDataSize)
        {
            // 非升级提示才处理登录失败消息
            if(self.updatenofify == false)
            {
                var data = {};
                data["type"] = "tagCmdLoginFairlure";

                //类型索引
                data["lResultCode"] = DataUtil.ReadNumber(SerializeObject, 32);

                //挂接索引
                data["szDescribeString"] = ReadString(SerializeObject, 0);

                lm.log("登录大厅失败 !" +    data["szDescribeString"]);
                if (self.LogonFailedCallBack)
                {
                    self.LogonFailedCallBack.call(self.target, data["szDescribeString"]);
                }
            }
        });

        // 登录时的 是否领取了新手礼包
        connectUtil.dataListenerManual(KernelPlaza, PlazaLogonMainID , PlazaLogonMsg.SUB_MB_NOVICE_AWARD_STATE, function (SerializeObject, wDataSize) {
            lm.log("yyp msg 系统登录  - 新账号判定接口 ");

            var isNewPlayer = DataUtil.ReadNumber(SerializeObject, 8);
            userInfo.isNewPlayer = isNewPlayer;

            lm.log("yyp msg 系统登录  - 新账号判定接口 " + isNewPlayer);

        });

        // 登录时的 是否领取了新手礼包
        connectUtil.dataListenerManual(KernelPlaza, PlazaLogonMainID , PlazaLogonMsg.SUB_MB_NOVICE_AWARD_RES, function (SerializeObject, wDataSize) {
            lm.log("yyp msg   - 新手领奖返回 " + SerializeObject);


            var data = {};
            data["ret"] = DataUtil.ReadNumber(SerializeObject, 8);
            data["cbNoviceAward"] = DataUtil.ReadNumber(SerializeObject, 8);
            data["lUserScore"] = DataUtil.ReadNumber(SerializeObject, 64);
            data["dwUserMedal"] = DataUtil.ReadNumber(SerializeObject, 32);
            data["dwTicketCount"] = DataUtil.ReadNumber(SerializeObject, 32);

            lm.log("新手领奖返回 " +    data["ret"]);
            lm.log("新手领奖返回 " +    data["cbNoviceAward"]);
            lm.log("新手领奖返回 " +    data["lUserScore"]);
            lm.log("新手领奖返回 " +    data["dwUserMedal"]);
            lm.log("新手领奖返回 " +    data["dwTicketCount"]);

            if (self.newplayerchestcallback)
            {
                lm.log("新手领奖返回123456789 " + JSON.stringify(data) );
                self.newplayerchestcallback.call(self.target,data);
            }

        });

        // 服务器列表种类
        connectUtil.dataListenerManual(KernelPlaza, ServerlistMainID, ServerListMsg.SUB_MB_LIST_KIND, function (SerializeObject, wDataSize) {
            var count = wDataSize / tagGameKindSize;
            for (var i = 0; i < count; i++) {
                var data = {};
                data["type"] = "tagGameKind";

                //类型索引
                data["wTypeID"] = DataUtil.ReadNumber(SerializeObject, 16);

                //挂接索引
                data["wJoinID"] = DataUtil.ReadNumber(SerializeObject, 16);

                //排序索引
                data["wSortID"] = DataUtil.ReadNumber(SerializeObject, 16);

                //类型索引
                data["wKindID"] = DataUtil.ReadNumber(SerializeObject, 16);

                //模块索引
                data["wGameID"] = DataUtil.ReadNumber(SerializeObject, 16);

                //在线人数
                data["dwOnlineCount"] = DataUtil.ReadNumber(SerializeObject, 32);

                //满员人数
                data["dwFullCount"] = DataUtil.ReadNumber(SerializeObject, 32);

                //游戏名称
                data["szkindName"] = ReadString(SerializeObject, 32);

                //进程名称
                data["szProcessName"] = ReadString(SerializeObject, 32);
                //lm.log("服务器列表种类: " + JSON.stringify(data));
                GameServerKind.AddKind(data);
                lm.log("服务器列表种类--------------------------------------"+JSON.stringify(data));
            }

        });


        // 房间列表
        connectUtil.dataListenerManual(KernelPlaza, ServerlistMainID, ServerListMsg.SUB_MB_LIST_SERVER, function (SerializeObject, wDataSize) {
            // 148 = sizeof(tagGameServer)
            var count = wDataSize / tagGameServerSize;
            for (var i = 0; i < count; i++) {
                var data = {};
                data["type"] = "tagGameServer";

                //名称索引
                data["wKindID"] = DataUtil.ReadNumber(SerializeObject, 16);

                //节点索引
                data["wNodeID"] = DataUtil.ReadNumber(SerializeObject, 16);

                //排序索引
                data["wSortID"] = DataUtil.ReadNumber(SerializeObject, 16);

                //房间索引
                data["wServerID"] = DataUtil.ReadNumber(SerializeObject, 16);

                //房间端口
                data["wServerPort"] = DataUtil.ReadNumber(SerializeObject, 16);

                //房间类型
                data["wServerType"] = DataUtil.ReadNumber(SerializeObject, 16);

                //桌子数量
                data["wTableCount"] = DataUtil.ReadNumber(SerializeObject, 16);

                //在线人数
                data["dwOnlineCount"] = DataUtil.ReadNumber(SerializeObject, 32);

                //满员人数
                data["dwFullCount"] = DataUtil.ReadNumber(SerializeObject, 32);

                //房间名称
                data["szServerAddr"] = ReadString(SerializeObject, 32);

                //房间名称
                data["szServerName"] = ReadString(SerializeObject, 32);

                //最小准入
                data["lMinEnterScore"] = DataUtil.ReadNumber(SerializeObject, 64);
                //最大准入
                data["lMaxEnterScore"] = DataUtil.ReadNumber(SerializeObject, 64);
                //最小入桌
                data["lMinTabScore"] = DataUtil.ReadNumber(SerializeObject, 64);
                //最大入桌
                data["lMaxTableScore"] = DataUtil.ReadNumber(SerializeObject, 64);

                console.log("服务器房间列表: －－－－－zzz" + JSON.stringify(data));

                GameServerKind.AddServer(data);
            }

        });


        // 列表完成
        connectUtil.dataListenerManual(KernelPlaza, ServerlistMainID, ServerListMsg.SUB_MB_LIST_FINISH, function (SerializeObject, wDataSize) {

            //服务器列表完成，获取serverid列表
            var serverlist = GameServerKind.SearchServerList(Game_ID);
            lm.log("serverlist:"  + JSON.stringify(serverlist));
            if((serverlist !== undefined) && (serverlist !== null) && (serverlist.length > 0))
            {
                //获取每个房间的准入金币
                webMsgManager.SendGetServerListAccessGold(serverlist,function(data)
                {
                    roomManager.setServerListAccessGold(data);

                },function(errinfo){},self);
            }

            lm.log("房间列表完成 " );
            //if (self.LogonSuccessedCallBack)
            //{
            //    lm.log("房间列表完成2 " );
            //    self.LogonSuccessedCallBack.call(self.target);
            //}
            //hanhu #房间数据返回时刷新大厅界面 2016/02/02
            var layer = layerManager.getRuningLayer();

            if(layer && layer.getTag() == ClientModuleType.Plaza)
            {
                lm.log("设置玩家数量");
                layer.setLineCount();
            }

        });

        // 操作成功
        connectUtil.dataListenerManual(KernelPlaza, GpUserServiceMainID, GpUserServiceMsg.SUB_GP_OPERATE_SUCCESS, function (SerializeObject, wDataSize) {

            var data = {};
            //操作代码
            data["lResultCode"] = DataUtil.ReadNumber(SerializeObject, 32);

            //节点索引
            data["szDescribeString"] = ReadString(SerializeObject, 0);

            //layerManager.PopTipLayer(new PopAutoTipsUILayer(data["szDescribeString"]+"", DefultPopTipsTime),false);

            if(MODIFYUSERINFOUILAYER) {
                MODIFYUSERINFOUILAYER.onUserInfoModifySuccessed();
            }

        });

        // 操作失败
        connectUtil.dataListenerManual(KernelPlaza, GpUserServiceMainID, GpUserServiceMsg.SUB_GP_OPERATE_FAILURE, function (SerializeObject, wDataSize) {

            var data = {};
            //操作代码
            data["lResultCode"] = DataUtil.ReadNumber(SerializeObject, 32);

            //节点索引
            data["szDescribeString"] = ReadString(SerializeObject, 0);
            layerManager.PopTipLayer(new PopAutoTipsUILayer(data["szDescribeString"], DefultPopTipsTime),false);

        });



        // 银行成功
        connectUtil.dataListenerManual(KernelPlaza, GpUserServiceMainID, GpUserServiceMsg.SUB_GP_USER_INSURE_SUCCESS, function (SerializeObject, wDataSize) {
            lm.log("银行成功－－－－－－－－");
            var data = {};
            //用户ID
            data["dwUserID"] = DataUtil.ReadNumber(SerializeObject, 32);

            //用户金币
            data["lUserScore"] = DataUtil.ReadNumber(SerializeObject, 64);

            //用户金币
            data["lUserInsure"] = DataUtil.ReadNumber(SerializeObject, 64);

            //描述信息
            data["szDescribeString"] = ReadString(SerializeObject, 0);

           if( (data["dwUserID"] !== undefined) &&
             (data["dwUserID"].length !== 0) &&
             (data["dwUserID"] !== null) &&
             (data["dwUserID"] ==  userInfo.globalUserdData["dwUserID"]))
          {
              userInfo.globalUserdData["lUserInsure"] = data["lUserInsure"];   // 银行金币
              userInfo.globalUserdData["lUserScore"] =  data["lUserScore"];   // 用户金币
              userInfo.UpdateUserScore(userInfo.globalUserdData["lUserScore"]);
          }
            layerManager.getRuningLayer().UpdateUserInFo();
            layerManager.getRuningLayer().updateSafeBoxData();
            //提示
            layerManager.PopTipLayer(new PopAutoTipsUILayer("操作成功，保险柜余额"+data["lUserInsure"]+"现金余额为"+data["lUserScore"], DefultPopTipsTime),true);


        });

        // 银行失败
        connectUtil.dataListenerManual(KernelPlaza, GpUserServiceMainID, GpUserServiceMsg.SUB_GP_USER_INSURE_FAILURE, function (SerializeObject, wDataSize) {

            var data = {};
            //操作代码
            data["lResultCode"] = DataUtil.ReadNumber(SerializeObject, 32);


            //节点索引
            data["szDescribeString"] = ReadString(SerializeObject, 0);

            // 操作失败给出提示
            layerManager.PopTipLayer(new PopAutoTipsUILayer(data["szDescribeString"], DefultPopTipsTime),true);
        });


        // 用户信息更新
        connectUtil.dataListenerManual(KernelPlaza, GpUserServiceMainID, GpUserServiceMsg.SUB_GP_USERINFOUPDATE, function (SerializeObject, wDataSize) {

            lm.log("用户信息更新.......");
            var dwUpdateType = 0;
            dwUpdateType  = DataUtil.ReadNumber(SerializeObject, 32);
            switch (dwUpdateType)
            {
                case UpdateUserInFoType.UPDATETYPE_GOLD: // 金币
                {
                    var curGold = DataUtil.ReadNumber(SerializeObject, 64);
                    if(curGold > userInfo.globalUserdData["lUserScore"])
                    {
                        playGolgAnimation();
                    }

                    userInfo.globalUserdData["lUserScore"] =  curGold;   // 用户金币
                    userInfo.globalUserdData["lUserInsure"] =  DataUtil.ReadNumber(SerializeObject, 64);   // 银行金币

                    userInfo.UpdateUserScore(userInfo.globalUserdData["lUserScore"]);

                    lm.log("用户信息更新 用户金币 : "  +  userInfo.globalUserdData["lUserScore"] + "  保险柜金币： " +     userInfo.globalUserdData["lUserInsure"] );
                }
                    break;
                case UpdateUserInFoType.UPDATETYPE_FACE:  // 头像
                {

                    userInfo.globalUserdData["wFaceID"] =  DataUtil.ReadNumber(SerializeObject, 16);   // 用户头像ID
                    userInfo.globalUserdData["dwCustomID"] =  DataUtil.ReadNumber(SerializeObject, 32);    // 用户自定义头像ID

                    userInfo.UpdateUserFaceID(userInfo.globalUserdData["dwUserID"],
                        userInfo.globalUserdData["wFaceID"],
                        userInfo.globalUserdData["dwCustomID"],
                        plazaMsgManager.address);

                    lm.log("用户信息更新 用户头像更新......., customid:" +       userInfo.globalUserdData["dwCustomID"]);

                }
                    break;
                case UpdateUserInFoType.UPDATETYPE_VIP:  // 会员
                {
                    var data={};
                    data["memberorder"] =  DataUtil.ReadNumber(SerializeObject, 8);
                    data["memberoveryear"] = DataUtil.ReadNumber(SerializeObject, 16);
                    data["memberovermonth"] = DataUtil.ReadNumber(SerializeObject, 16);
                    DataUtil.ReadNumber(SerializeObject, 16);
                    data["memberoverday"] = DataUtil.ReadNumber(SerializeObject, 16);
                    data["memberoverhour"] = DataUtil.ReadNumber(SerializeObject, 16);
                    data["memberoverminute"] = DataUtil.ReadNumber(SerializeObject, 16);
                    data["memberoversecond"] = DataUtil.ReadNumber(SerializeObject, 16);
                    data["activestatus"] = 1;
                    userInfo.UpdateMemberData(data);

                }
                    break;
                case UpdateUserInFoType.UPDATETYPE_ITEM: //道具
                {
                    webMsgManager.SendGpProperty(function (data) {
                        roomManager.SetMallData(data);
                        },
                        function (errinfo) {
                            lm.log("请求商城数据失败. info = " + errinfo);
                            layerManager.PopTipLayer(new PopAutoTipsUILayer(errinfo, DefultPopTipsTime),true);
                        },
                        this);
                }
                    break;
                case UpdateUserInFoType.UPDATETYPE_MEDEL: //奖牌
                {
                    var medalNum = DataUtil.ReadNumber(SerializeObject, 32);
                    lm.log("最新奖牌数量为：" + medalNum);
                    userInfo.globalUserdData["dwUserMedal"] = medalNum;
                    //yangyupeng #更新奖牌数量显示 2016/03/25
                    if(sparrowDirector.isPlayingGame == true) //hanhu #只有用户在游戏中时才刷新话费券 2016/04/09
                    {
                        var UserInfoNode = sparrowDirector._getTargetOfInfo(playerDirection.DOWN);
                        if(UserInfoNode)
                        {
                            //UserInfoNode.rewardNum.setString(medalNum);
                        }
                    }

                }
                    break;
                case UpdateUserInFoType.UPDATETYPE_MOBILE:  //话费券
                {
                    var mobilebilling = DataUtil.ReadNumber(SerializeObject, 32);
                    lm.log("最新话费券数量为：" + mobilebilling);
                    userInfo.globalUserdData["dwTicketCount"] = mobilebilling;

                    //yangyupeng #更新话费券显示 2016/03/25
                    if(sparrowDirector.isPlayingGame == true) //hanhu #只有用户在游戏中时才刷新话费券 2016/04/09
                    {
                        var UserInfoNode = sparrowDirector._getTargetOfInfo(playerDirection.DOWN);
                        if(UserInfoNode)
                        {
                            //UserInfoNode.cellNum.setString(mobilebilling);
                        }
                    }
                }
                    break;
                case UpdateUserInFoType.UPDATETYPE_PAY: //充值成功
                {
                    UserInfo.cbPay = 1;
                }
                    break;
            }

            if ( layerManager.getRuningLayer() )
            {
                lm.log("用户信息更新 更新玩家信息");
                layerManager.getRuningLayer().UpdateUserInFo();
            }
            if(PLAZAUILAYER)
            {
                PLAZAUILAYER.hideFirstPayBtn();
            }

            var runningScene = cc.director.getRunningScene();
            var oldlayer = runningScene.getChildByTag(TIP_TAG);
            if(oldlayer != null)
                oldlayer.removeFromParent();
            
        });

        // 更改系统头像
        connectUtil.dataListenerManual(KernelPlaza, GpUserServiceMainID , GpUserServiceMsg.SUB_GP_USER_FACE_INFO, function (SerializeObject, wDataSize) {
            userInfo.globalUserdData["wFaceID"] = DataUtil.ReadNumber(SerializeObject,16);
            userInfo.globalUserdData["dwCustomID"] = DataUtil.ReadNumber(SerializeObject,32);

            userInfo.AppendLocalData(
                userInfo.GetCurPlayerAccount(),
                userInfo.GetCurPlayerPassword(),
                userInfo.globalUserdData["dwUserID"],
                userInfo.globalUserdData["wFaceID"],
                userInfo.globalUserdData["dwCustomID"],
                userInfo.globalUserdData["szNickName"],
                userInfo.globalUserdData["lUserScore"],
                userInfo.GetCurPlyarType(plazaMsgManager.address),
                plazaMsgManager.address

            );

            layerManager.PopTipLayer(new PopAutoTipsUILayer("您的头像已成功修改！", DefultPopTipsTime),false);
            if(layerManager.getRuningLayer())
            {
                lm.log("您的头像已成功修改 " + userInfo.globalUserdData["wFaceID"]);
                layerManager.getRuningLayer().UpdateUserInFo();
            }

        });


        // 大厅心跳消息
        connectUtil.dataListenerManual(KernelPlaza, GpUserServiceMainID, GpUserServiceMsg.SUB_GP_ONLINE_CHECK, function (SerializeObject, wDataSize) {

            connectUtil.sendManual(KernelPlaza, GpUserServiceMainID, GpUserServiceMsg.SUB_GP_ONLINE_CHECK, 0);
        });

        //配置文件版本信息
        connectUtil.dataListenerManual(KernelPlaza, PlazaLogonMainID , PlazaLogonMsg.SUB_MB_CONFIG_UPDATE, function (SerializeObject, wDataSize) {
            lm.log("yyp 收版本信息消息");
            var num = DataUtil.ReadNumber(SerializeObject, 16);
            lm.log("yyp 版本号个数为：" + num);
            var data = {};
            for(var i = 0; i < num; i++)
            {
                var id = DataUtil.ReadNumber(SerializeObject, 16);
                var version = DataUtil.ReadNumber(SerializeObject, 16);
                lm.log("yyp 版本id为：" + id + " version = " + version);
                switch (id)
                {
                    case ConfigType.oldMall:
                        data["oldMallVersion"] = version;
                        break;
                    case ConfigType.newMall:
                        data["mallVersion"] = version;
                        break;
                    case ConfigType.ticket:
                        data["ticketVersion"] = version;
                        break;
                    case ConfigType.item:
                        data["itemVersion"] = version;
                        break;
                    case ConfigType.goldroom:
                        data["goldVersion"] = version;
                        break;
                    case ConfigType.matchGroup:
                        data["matchGroupVersion"]  = version;
                        break;
                    case ConfigType.matchroom:
                        data["matchVersion"] = version;
                        break;
                    case ConfigType.task:
                        data["taskVersion"] = version;
                        break;
                    default :
                        break;
                }
            }

            configManager.LoadJsonConfig(data);
        });

        //断线重连
        connectUtil.dataListenerManual(KernelPlaza, PlazaLogonMainID , PlazaLogonMsg.SUB_GP_AUTOLOGIN_ROOM, function (SerializeObject, wDataSize) {
            lm.log("游戏正在进行，进行房间重连");
            var serverID = DataUtil.ReadNumber(SerializeObject, 32);
            var accessGold = DataUtil.ReadNumber(SerializeObject, 32);
            var serverdata =  GameServerKind.SearchServer(serverID);

            sparrowDirector.tempRoomServerId = serverID;//当前房间ID
            lm.log("-----sparrowDirector.tempRoomServerId "+sparrowDirector.tempRoomServerId);

            Game_ID = serverdata["wKindID"];
            sparrowDirector.gameData.accessGold = accessGold;
            sparrowDirector.roomAccessGold = accessGold;
            sparrowDirector.roomName = serverdata["szServerName"];

            sparrowDirector.LogonRoom(serverdata["wServerPort"],
                userInfo.globalUserdData["dwUserID"],
                userInfo.GetCurPlayerPassword(),
                GetFuuID());

            layerManager.PopTipLayer(new WaitUILayer("正在入桌，请稍后....", function () {
                layerManager.PopTipLayer(new PopAutoTipsUILayer("连接服务器超时，请稍后重试！", DefultPopTipsTime), false);
            }));
        });

        //玩家道具信息
        connectUtil.dataListenerManual(KernelPlaza, GpUserServiceMainID , GpUserServiceMsg.SUB_GP_USERPROPERTYUPDATE, function (SerializeObject, wDataSize) {
            var num = DataUtil.ReadNumber(SerializeObject, 16);
            lm.log("收到玩家道具更新, 数量为：" + num);
            var userItem = new Array();
            var itemData = roomManager.GetItemData()["propertylist"];
            for(var i = 0; i < num; i++)
            {
                var id = DataUtil.ReadNumber(SerializeObject, 32);
                var count = DataUtil.ReadNumber(SerializeObject, 32);
                lm.log("道具id为：" + id + " 数量为：" + count);
                for(var key in itemData)
                {
                    if(Number(itemData[key]["pid"]) == id)
                    {
                        itemData[key]["pcount"] = count + "";
                        userItem.push(itemData[key]);
                        break;
                    }
                }
            }
            roomManager.SetBagData(userItem);
        });

        // 系统登录  - 通知
        connectUtil.dataListenerManual(KernelPlaza, GpLogonMainID , GpLogonMsg.SUB_GP_SYSTEM_NOTIFY, function (SerializeObject, wDataSize) {

            lm.log("系统登录  - 通知 ");
            var data={};
            data["wType"] =  DataUtil.ReadNumber(SerializeObject,16);  // 掩码
            data["wLength"] =  DataUtil.ReadNumber(SerializeObject,16);  // 长度
            data["szString"] =  ReadString(SerializeObject, 0);

            // 服务器通知中断连接，直接关闭
            if(data["wType"] & GpLogonControlFlag.SMT_CLOSE_LINK)
            {
                lm.log("KernelGame  06");
                //关闭连接
                CloseGameSocket(KernelPlaza);
                CloseGameSocket(KernelGame);
                CloseGameSocket(KernelMatch);


                self.updatenofify = false;
                self.ReConnectCount = 0;
                sparrowDirector.ReConnectCount=0;
                matchMsgManager.ReConnectCount = 0;

                MusicUtil.stopMusic();

                lm.log("yyp 系统登录  - 通知 " + data["szString"]);
                var pop = new ConfirmPop(this, Poptype.yesno, data["szString"]);//ok
                pop.hideCloseBtn();
                pop.addToNode(cc.director.getRunningScene());
                pop.setYesNoCallback(
                    function(){
                        userInfo.ClearUserData();
                        cc.director.runScene(new rootUIScene());
                    },
                    function()
                    {
                        ExitGameEx();
                    }
                );

                //layerManager.PopTipLayer(new PopTipsUILayer("确定","取消", data["szString"], function(id)
                //{
                //    if(id == clickid.ok)
                //    {
                //        userInfo.ClearUserData();
                //        cc.director.runScene(new rootUIScene());
                //
                //        //var scene = new rootScene();
                //        //layerManager.addLayerToParent(new LoginUILayer(), scene);
                //        //cc.director.replaceScene(scene);
                //
                //    }
                //    else if(id == clickid.cancel)
                //    {
                //        ExitGameEx();
                //    }
                //
                //},this),false);
            }
            else
            {
                var pop = new ConfirmPop(this, Poptype.yesno, data["szString"]);//ok
                pop.addToNode(cc.director.getRunningScene());
                //layerManager.PopTipLayer(new PopTipsUILayer("确定","取消", data["szString"], function(id)
                //{
                //    if(id == clickid.ok )
                //    {
                //
                //    }
                //
                //},this),false);
            }

        });

        connectUtil.dataListenerManual(KernelPlaza, GpLogonMainID , PlazaLogonMsg.SUB_GP_LOGON_NEEDRELOGON, function (SerializeObject, wDataSize) {
            lm.log("收到需要重新登陆的消息， KernelCurrent = " + KernelCurrent);
            if(KernelCurrent == KernelMatch)
            {
                matchMsgManager.RemoveWaitMessage();
            }

            self.ReConnectCount = 0;
            self.updatenofify = false;
            sparrowDirector.ReConnectCount=0;
            matchMsgManager.ReConnectCount = 0;


            var pop = new ConfirmPop(this, Poptype.yesno, "当前网络出现异常，是否重新登录大厅？");//ok
            pop.addToNode(cc.director.getRunningScene());
            pop.hideCloseBtn();
            pop.setYesNoCallback(
                function(){
                    //关闭连接
                    lm.log("KernelGame  05");
                    CloseGameSocket(KernelPlaza);
                    CloseGameSocket(KernelGame);
                    CloseGameSocket(KernelMatch);
                    userInfo.ClearUserData();
                    // 回到登陆界面
                    //hanuh #采用切换场景的方式回到登陆界面，同时清除游戏数据 2015/09/28
                    cc.director.runScene(new rootUIScene());
                    //var scene = new rootScene();
                    //
                    //layerManager.addLayerToParent(new LoginUILayer(), scene);
                    //cc.director.replaceScene(scene);

                    //hanhu #切换帐号时重置比赛数据 2015/09/24
                    lm.log("大厅重新登录，清理数据");
                    matchMsgManager.ClearMatchData();
                    sparrowDirector.ClearAllData();
                },
                function()
                {
                    ExitGameEx();
                }
            );

            //layerManager.PopTipLayer(new PopTipsUILayer("确定", "取消", "当前网络出现异常，是否重新登录大厅？", function (id) {
            //    if (id == clickid.ok) {
            //        //关闭连接
            //        CloseGameSocket(KernelPlaza);
            //        CloseGameSocket(KernelGame);
            //        CloseGameSocket(KernelMatch);
            //        userInfo.ClearUserData();
            //        // 回到登陆界面
            //        //hanuh #采用切换场景的方式回到登陆界面，同时清除游戏数据 2015/09/28
            //        cc.director.runScene(new rootUIScene());
            //        //var scene = new rootScene();
            //        //
            //        //layerManager.addLayerToParent(new LoginUILayer(), scene);
            //        //cc.director.replaceScene(scene);
            //
            //        //hanhu #切换帐号时重置比赛数据 2015/09/24
            //        lm.log("大厅重新登录，清理数据");
            //        matchMsgManager.ClearMatchData();
            //        sparrowDirector.ClearAllData();
            //    } else {
            //        ExitGameEx();
            //    }
            //
            //}, this), false);


        });

        connectUtil.dataListenerManual(KernelPlaza, GpLogonMainID , PlazaLogonMsg.SUB_GP_LOGON_RECONNECTOK, function (SerializeObject, wDataSize) {
            lm.log("收到大厅重连成功的消息");
            var RecieveIndex = DataUtil.ReadNumber(SerializeObject, 64);
            self.RecieveIndex = RecieveIndex;
            SendBuffer(KernelPlaza, RecieveIndex);

            //清空大厅重连次数
            self.ReConnectCount= 0;

        });

        connectUtil.dataListenerManual(KernelPlaza, GpLogonMainID , PlazaLogonMsg.SUB_MB_LOGON_FINISH, function (SerializeObject, wDataSize) {
            lm.log("收到大厅登陆成功的消息");

            var wIntermitTime = DataUtil.ReadNumber(SerializeObject, 16);
            var wOnLineCountTime = DataUtil.ReadNumber(SerializeObject, 16);
            var dwReconnectKey = DataUtil.ReadNumber(SerializeObject, 32);
            var lRevIdx = DataUtil.ReadNumber(SerializeObject, 64);
            self.ReconnectKey = dwReconnectKey;
            self.RecieveIndex = lRevIdx;
            //lm.log("登陆KEY = " + dwReconnectKey);
        });



        //收到需要输入保险箱密码的消息
        connectUtil.dataListenerManual(KernelPlaza, GpLogonMainID , PlazaLogonMsg.SUB_MB_LOGON_NEEDINPUTINSTURE, function (SerializeObject, wDataSize) {
            //lm.log("收到重连成功的消息");


            lm.log("收到需要输入保险箱密码的消息");
            self.needinputinsturepass = true;
        });


        //需要重新发送丢失的消息
        connectUtil.dataListenerManual(KernelPlaza, GpLogonMainID , PlazaLogonMsg.SUB_MB_RESENDMSG, function (SerializeObject, wDataSize) {

            lm.log("需要重新发送大厅连接丢失的消息");
            var RecieveIndex = DataUtil.ReadNumber(SerializeObject, 64);

            self.ReConnectCount =0;
            sparrowDirector.ReConnectCount=0;
            matchMsgManager.ReConnectCount = 0;


            var pop = new ConfirmPop(this, Poptype.yesno, "当前网络出现异常，是否重新登录大厅？");//ok
            pop.addToNode(cc.director.getRunningScene());
            pop.hideCloseBtn();
            pop.setYesNoCallback(
                function(){
                    //关闭连接
                    lm.log("KernelGame  04");
                    CloseGameSocket(KernelPlaza);
                    CloseGameSocket(KernelGame);
                    CloseGameSocket(KernelMatch);
                    userInfo.ClearUserData();
                    // 回到登陆界面
                    //hanuh #采用切换场景的方式回到登陆界面，同时清除游戏数据 2015/09/28
                    cc.director.runScene(new rootUIScene());

                    //layerManager.addLayerToParent(new LoginUILayer(), scene);
                    //cc.director.replaceScene(scene);

                    //hanhu #切换帐号时重置比赛数据 2015/09/24
                    lm.log("大厅重新登录，清理数据");
                    matchMsgManager.ClearMatchData();
                    sparrowDirector.ClearAllData();
                },
                function()
                {
                    ExitGameEx();
                }
            );

            //layerManager.PopTipLayer(new PopTipsUILayer("确定", "取消", "当前网络出现异常，是否重新登录大厅？", function (id) {
            //    if (id == clickid.ok) {
            //        //关闭连接
            //        CloseGameSocket(KernelPlaza);
            //        CloseGameSocket(KernelGame);
            //        CloseGameSocket(KernelMatch);
            //        userInfo.ClearUserData();
            //        // 回到登陆界面
            //        //hanuh #采用切换场景的方式回到登陆界面，同时清除游戏数据 2015/09/28
            //        cc.director.runScene(new rootUIScene());
            //
            //        //layerManager.addLayerToParent(new LoginUILayer(), scene);
            //        //cc.director.replaceScene(scene);
            //
            //        //hanhu #切换帐号时重置比赛数据 2015/09/24
            //        lm.log("大厅重新登录，清理数据");
            //        matchMsgManager.ClearMatchData();
            //        sparrowDirector.ClearAllData();
            //    } else {
            //        ExitGameEx();
            //    }
            //
            //}, this), false);

        });

        connectUtil.dataListenerManual(KernelPlaza, GpLogonMainID , PlazaLogonMsg.SUB_GP_SERVICE_MODIFY, function (SerializeObject, wDataSize) {
            lm.log("需要重新发送大厅连接丢失的消息");
            layerManager.PopTipLayer(new PopAutoTipsUILayer("服务器正在维护，请稍后重试！", DefultPopTipsTime));
        });

        //领取救济金
        connectUtil.dataListenerManual(KernelPlaza, GpLogonMainID , PlazaLogonMsg.SUB_GP_RELIEF_GOLD_RESP, function (SerializeObject, wDataSize) {
            var ret = DataUtil.ReadNumber(SerializeObject, 8);
            var dwReliefCountOfDay = DataUtil.ReadNumber(SerializeObject, 32);
            lm.log("得到了添加救济金的消息 " + ret + " " + dwReliefCountOfDay);

            if(ret == 0)
            {
                lm.log("救济金领取：成功！");
                layerManager.PopTipLayer(new PopAutoTipsUILayer("救济金领取成功！", DefultPopTipsTime));
                UserInfo.dwReliefCountOfDay = dwReliefCountOfDay;

                playGolgAnimation();
            }
            else
            {
                layerManager.PopTipLayer(new PopAutoTipsUILayer("救济金领取失败！", DefultPopTipsTime));
                if(ret == 1)
                {
                    lm.log("救济金领取：失败！");
                }
                else if(ret == 2)
                {
                    lm.log("救济金领取：位次不够！");
                }
                else if(ret == 3)
                {
                    lm.log("救济金领取：金币太多！");
                }
                else if(ret == 4)
                {
                    lm.log("救济金领取：数据库错误！");
                }
            }

            var runningScene = cc.director.getRunningScene();
            var oldlayer = runningScene.getChildByTag(TIP_TAG);
            if(oldlayer != null)
                oldlayer.removeFromParent();

        });

    },


    // 大厅登录接口（其他账号登录（非手机））
    LogonPlaza: function (username, password, machineid, mobilephone) {
        var self = this;
        lm.log("VERSION_MOBILE_IOS : " + VERSION_MOBILE_IOS);
        // 连接服务器成功
        connectUtil.init(this.address, this.port, KernelPlaza, function (target, location, state) {
                //connectUtil.init("192.168.5.123", "008300", KernelPlaza, function (target, location, state) {

                //发送登录大厅消息
                connectUtil.sendAutoNoCache(KernelPlaza,
                    PlazaLogonMainID,
                    PlazaLogonMsg.SUB_MB_LOGON_ACCOUNTS,
                    Game_ID,
                    VERSION_MOBILE_IOS,
                    DefultDeviceType,
                    MD5String(password),
                    username,
                    machineid,
                    mobilephone);
            },
            function (target, location, state) {
                //连接服务器失败
                if (self.LinkFailedCallBack) {
                    self.LinkFailedCallBack.call( self.Target );
                }
            });
    },

    // 大厅登录接口(手机登录)
    LogonPlazaByMobileNo: function (username, password, machineid, mobilephone) {
        var self = this;
        lm.log("VERSION_MOBILE_IOS : " + VERSION_MOBILE_IOS);
        // 连接服务器成功
        connectUtil.init(this.address, this.port, KernelPlaza, function (target, location, state) {
                //connectUtil.init("192.168.5.12", "8300", KernelPlaza, function (target, location, state) {

                //发送登录大厅消息
                connectUtil.sendAutoNoCache(KernelPlaza,
                    PlazaLogonMainID,
                    PlazaLogonMsg.SUB_MB_LOGON_MOBILE,
                    Game_ID,
                    VERSION_MOBILE_IOS,
                    DefultDeviceType,
                    MD5String(password),
                    username,
                    machineid,
                    mobilephone);
            },
            function (target, location, state) {
                //连接服务器失败
                if (self.LinkFailedCallBack) {
                    self.LinkFailedCallBack.call( self.Target );
                }
            });
    },

    // 大厅登录接口 - 密码已经是MD5加密
    LogonPlazaEx: function (username, password, machineid, mobilephone) {
        var self = this;
        lm.log("VERSION_MOBILE_IOS : " + VERSION_MOBILE_IOS);
        // 连接服务器成功
        lm.log("address = " + this.address + " KernelPlaza = " + KernelPlaza + " port = " + this.port);
        connectUtil.init(this.address, this.port,KernelPlaza, function (target, location, state) {
            //connectUtil.init("192.168.5.123", "008300", KernelPlaza, function (target, location, state) {

        //username = "nanji5188";
        //password = "123456";
        //connectUtil.init("192.168.5.12", "8300", KernelPlaza, function (target, location, state) {
                lm.log("连接服务器 成功， 发送大厅登陆消息 ");
                //发送登录大厅消息
                connectUtil.sendAutoNoCache(KernelPlaza,
                    PlazaLogonMainID,
                    PlazaLogonMsg.SUB_MB_LOGON_ACCOUNTS,
                    Game_ID,
                    VERSION_MOBILE_IOS,
                    DefultDeviceType,
                    password,
                    username,
                    machineid,
                    mobilephone);
            },
            function (target, location, state)
            {
                lm.log("连接服务器 连接服务器失败" + state);
                //连接服务器失败
                if (self.LinkFailedCallBack) {
                    self.LinkFailedCallBack(self.target);
                }
            });
    },

    // hanhu #增加棱镜sdk登陆接口 2015/10/08
    LogonPlazaByLjSdk: function (username, password, machineid, mobilephone, channelID) {
        var self = this;
        //lm.log("大厅登录接口: " + this.address + " port: " + this.port);
        // 连接服务器成功
        connectUtil.init(this.address, this.port,KernelPlaza, function (target, location, state) {

                //lm.log("连接服务器 成功 ");
                //发送登录大厅消息
                connectUtil.sendAutoNoCache(KernelPlaza,
                    PlazaLogonMainID,
                    PlazaLogonMsg.SUB_MB_LOGON_ACCOUNTS,
                    Game_ID,
                    VERSION_MOBILE_IOS,
                    DefultDeviceType,
                    password,
                    username,
                    machineid,
                    mobilephone,
                    channelID);
            },
            function (target, location, state)
            {
                //lm.log("连接服务器 连接服务器失败");
                //连接服务器失败
                if (self.LinkFailedCallBack) {
                    self.LinkFailedCallBack(self.target);
                }
            });
    },

    //领取新手奖励确认
    GpNewPlayerChest:function(dwUserID, cbKindID)
    {
        connectUtil.sendManual(KernelPlaza,
            PlazaLogonMainID,
            PlazaLogonMsg.SUB_MB_NOVICE_AWARD,
            6,
            "32#" + dwUserID,
            "16#" + cbKindID);
    },

    //领取救济金
    GpReliefGold:function()
    {
        layerManager.PopTipLayer(new WaitUILayer("正在领取救济金，请稍后....", function () {}, this));

        connectUtil.sendManual(KernelPlaza,
            GpLogonMainID,
            PlazaLogonMsg.SUB_GP_RELIEF_GOLD_RES,
            0,
            "");
    },

    //修改密码
    ModifyLogonPass:function(dwUserID, szDesPassWord, szSrcPassWord)
    {
        connectUtil.sendManual(KernelPlaza,
            GpUserServiceMainID,
            GpUserServiceMsg.SUB_GP_MODIFY_LOGON_PASS,
            136,
            "32#" + dwUserID,
            "33:" + szDesPassWord,
            "33:" + szSrcPassWord);


    },

    //修改密码
    ModifyInsurePass:function(dwUserID, szDesPassWord, szSrcPassWord)
    {

        connectUtil.sendManual(KernelPlaza,
            GpUserServiceMainID,
            GpUserServiceMsg.SUB_GP_MODIFY_INSUREPASS,
            136,
            "32#" + dwUserID,
            "33:" + szDesPassWord,
            "33:" + szSrcPassWord);

    },

    //修改系统头像
    ModifySystemFaceInFo:function(wFaceID, dwUserID, szPassWord, szMachineID)
    {
        //GpUserServiceMsg.SUB_GP_SYSTEM_FACE_INFO
        var pass = szPassWord;
        if(GetDeviceType() != DeviceType.ANDROID || ChannelLabel == "8633" || ChannelLabel == "baiduSingle")
        {
            if(userInfo.GetCurPlyarType(plazaMsgManager.address) == false){
                pass = MD5String(szPassWord);
            }
        }

        connectUtil.sendManual(KernelPlaza,
            GpUserServiceMainID,
            GpUserServiceMsg.SUB_GP_SYSTEM_FACE_INFO,
            138,
            "16#" + wFaceID,
            "32#" + dwUserID,
            "33:" + pass,
            "33:" + szMachineID);
    },
    //修改用户信息
    ModifyUserInFo:function(cbGender,dwUserID, password, nickname)
    {

        lm.log("修改用户信息, Gender = " + cbGender + " UserID = " + dwUserID + " password = " + password + " nickname = " + nickname);
        var pass = password;

        if(GetDeviceType() != DeviceType.ANDROID || ChannelLabel == "8633" || ChannelLabel == "baiduSingle")
        {
            if(userInfo.GetCurPlyarType(plazaMsgManager.address) == false)
            {
                pass = MD5String(password);
            }
        }
        var nicknamesize = (nickname.length + 1) * 2;
        connectUtil.sendManual(KernelPlaza,
            GpUserServiceMainID,
            GpUserServiceMsg.SUB_GP_MODIFY_INDIVIDUAL,
            71 + 4 +  nicknamesize,
            "8#" + cbGender,
            "32#" + dwUserID,
            "33:" + pass,
            "16#" + nicknamesize,
            "16#" + DtpGpUserinfo.DTP_GP_UI_NICKNAME,
            "0:" + nickname);
    },

    //存款操作
    GpUserSaveScore:function(dwUserID, lSaveScore, machineid)
    {
        connectUtil.sendManual(KernelPlaza,
            GpUserServiceMainID,
            GpUserServiceMsg.SUB_GP_USER_SAVE_SCORE,
            78,
            "32#" + dwUserID,
            "64#" + lSaveScore,
            "33:" + machineid);

    },
    //取款操作
    GpUserTakeScore:function(dwUserID, lSaveScore, password, machineid)
    {
        var pass = password;
        if(GetDeviceType() != DeviceType.ANDROID || ChannelLabel == "8633" || ChannelLabel == "baiduSingle")
        {
            if(userInfo.GetCurPlyarType(plazaMsgManager.address) == false)
            {
                pass = MD5String(password);
            }
        }
        connectUtil.sendManual(KernelPlaza,
            GpUserServiceMainID,
            GpUserServiceMsg.SUB_GP_USER_TAKE_SCORE,
            144,
            "32#" + dwUserID,
            "64#" + lSaveScore,
            "33:" + pass,
            "33:" + machineid);
    },

    // 请求获取金币场数据
    RequestGoldRoomData:function()
    {
        //lm.log("获取金币场数据");
        //保存金币场数据
        if (CurWebDataType == WebDataType.WEBDATA_TYPE_DEBUG)
        {
            var goldroomdata = [{
                "name": "练习场",
                "slogans": "五湖四海 血战到底",
                "accessgold": 10000,
                "serverlist": [{"serverid": 123}, {"serverid": 2}, {"serverid": 3}, {"serverid": 4}]
            },
                {
                    "name": "新手场",
                    "slogans": "大杀四方 血流成河",
                    "accessgold": 50000,
                    "serverlist": [{"serverid": 123}, {"serverid": 2}, {"serverid": 3}, {"serverid": 4}]
                },
                {
                    "name": "进阶场",
                    "slogans": "雀坛新星 闪亮登场",
                    "accessgold": 100000,
                    "serverlist": [{"serverid": 123}, {"serverid": 2}, {"serverid": 3}, {"serverid": 4}]
                },
                {
                    "name": "麻神场",
                    "slogans": "红手光环 雀神无敌",
                    "accessgold": 20000000000,
                    "serverlist": [{"serverid": 123}, {"serverid": 2}, {"serverid": 3}, {"serverid": 4}]
                },
                {
                    "name": "进阶场1",
                    "slogans": "雀坛新星 闪亮登场",
                    "accessgold": 100000,
                    "serverlist": [{"serverid": 123}, {"serverid": 2}, {"serverid": 3}, {"serverid": 4}]
                },
                {
                    "name": "麻神场2",
                    "slogans": "红手光环 雀神无敌",
                    "accessgold": 20000000000,
                    "serverlist": [{"serverid": 123}, {"serverid": 2}, {"serverid": 3}, {"serverid": 4}]
                }
            ];

            roomManager.SetGoldRoomData(goldroomdata);

        } else {
            //获取金币场数据
            webMsgManager.SendGpGoldFiled(function (data) {
                    //lm.log("取到金币场数据 =" + data.length);

                    roomManager.SetGoldRoomData(data);
                },
                function (errinfo) {

                },
                this);
        }
    },



    //下载道具图标，有更新才下载
    DownLoadMallImage:function()
    {
        var malldata = roomManager.GetMallData();
        var propertylist = malldata["propertylist"]
        if(propertylist != undefined && propertylist != null && propertylist.length )
        {
            for(var key in propertylist)
            {
                var fileimagename = propertylist["pid"] + ".jpg";
                var filemd5 = MD5Image("res/cocosOut/product",fileimagename);
                var url =  propertylist["imgurl"];
                if(filemd5 != propertylist["imgmd5"])
                {
                    DownLoadImage(ClientModuleType.Mall,fileimagename, url);
                }
            }
        }
    },

    //获取VIP信息
    RequestMemberData:function()
    {
        if (CurWebDataType == WebDataType.WEBDATA_TYPE_DEBUG)
        {
            userInfo.globalUserdData["userinfoex"] = {"hasBoundMobile":1,"memberlist":[{"memberorder":10,"activestatus":1,"memberoveryear":2015,"memberovermonth":5,"memberoverday":8,"memberoverhour":9,"memberoverminute":10,"memberoversecond":0},
                {"memberorder":8,"activestatus":0,"memberoveryear":2015,"memberovermonth":5,"memberoverday":8,"memberoverhour":9,"memberoverminute":10,"memberoversecond":0},
                {"memberorder":7,"activestatus":0,"memberoveryear":2015,"memberovermonth":5,"memberoverday":8,"memberoverhour":9,"memberoverminute":10,"memberoversecond":0}]};
        }
        else
        {
            //获取会员信息
            webMsgManager.SendGpUserInFoEx(function (data) {

                    userInfo.globalUserdData["userinfoex"] = data;

                    lm.log("获取会员信息:" + JSON.stringify(userInfo.globalUserdData["userinfoex"]) );
                   var curLayer =  layerManager.getRuningLayer();
                    if(curLayer)
                    {
                        // 更新用户信息
                        lm.log("更新会员信息" );
                        curLayer.UpdateUserInFo();
                    }
                },
                function (errinfo) {

                },
                this);
        }

    },
    // 请求比赛房间数据
    RequestMatchRoomData:function(matchid, roundid)
    {
        if(CurWebDataType == WebDataType.WEBDATA_TYPE_DEBUG)
        {
            var matchroomdata = [{
                "matchname": "时限排名赛",
                "firstreward": "冠名名称展示",
                "signcondition": "参赛条件规则",
                "starttime": "2015-7-30 15:50:12",
                "endtime" : "2015-7-30 16:50:12",
                "matchid": 1,
                "roundid": 10086,
                "signtime": "2015-7-30 15:40:12"
            }];//,
                //{
                //    "name": "话费专场赛",
                //    "slogans": "最高奖励话费1000元",
                //    "ruleexplain": "参赛条件规则",
                //    "timeexplain": "参赛时间说明",
                //    "matchid": 2,
                //    "serverlist": [{"serverid": 123}, {"serverid": 2}, {"serverid": 3}, {"serverid": 4}]
                //},
                //{
                //    "name": "实物奖品赛",
                //    "slogans": "最高奖励IPHONE6一部",
                //    "ruleexplain": "参赛条件规则",
                //    "timeexplain": "参赛时间说明",
                //    "matchid": 3,
                //    "serverlist": [{"serverid": 123}, {"serverid": 2}, {"serverid": 3}, {"serverid": 4}]
                //},
                //{
                //    "name": "轻松赚金赛",
                //    "slogans": "最高奖励100000金币",
                //    "ruleexplain": "参赛条件规则",
                //    "timeexplain": "参赛时间说明",
                //    "matchid": 4,
                //    "serverlist": [{"serverid": 123}, {"serverid": 2}, {"serverid": 3}, {"serverid": 4}]
                //}
           //];
            lm.log("yyp——match设置比赛房间数据");
            roomManager.SetMatchRoomData(matchroomdata);

        }else
        {
            //获取比赛场数据
            webMsgManager.SendGpMatchFiled(matchid,roundid,function(data) {
                    lm.log("yyp——match从服务器获取到比赛信息！");
                    roomManager.SetMatchRoomData(data);
                },
                function(errinfo) {
                    lm.log("yyp——match从网站获取比赛数据出错: " +errinfo);
                },
                this);
        }
    },
    //请求用户头像数据
    RequestUseFace:function(){

        //SendGpUseFace
        webMsgManager.SendGpUseFace(function( data ){

                lm.log("用户头像数据:" + JSON.stringify(data) );
                userInfo.globalUserdData[ "wFaceID "] = data["faceid"];
                userInfo.globalUserdData[ "dwCustomID"] = data["customfaceid"];

                var fileName = userInfo.globalUserdData[ "dwUserID"] + "_" + data["customfaceid"]+".png";
                var fileurl =  jsb.fileUtils.getWritablePath() + "/userface/";
                lm.log("fileurl---------" + fileurl + "fileName-----" + fileName);
                var fileMD5 = MD5Image( fileurl, fileName );
                lm.log("fileMD5 = " + fileMD5);
                if(data["customfacemd5"] != fileMD5.toLocaleLowerCase()){
                    //更新头像
                    DownLoadUserCustomFace(userInfo.globalUserdData["dwUserID"],userInfo.globalUserdData["dwCustomID"],data["customfaceurl"]);

                }
            },
            function( errinfo ){
                lm.log(" 用户头像数据error " );
            },
            this);
    },
    // 请求商城数据
    RequestMallData:function()
    {
        webMsgManager.SendGpProperty(function (data) {
                roomManager.SetMallData(data);
            },
            function (errinfo) {
            },
            this);
    },

    //赠送玩家金币
    GiveGoldToPlayer : function(goldNum, pwd, userName)
    {
        connectUtil.sendManualNoCache(KernelPlaza,
            GpUserServiceMainID,
            GpUserServiceMsg.SUB_GP_USER_GIVE_SCORE,
            209, //总长
            "32#" + userInfo.globalUserdData["dwUserID"],
            "8#1",
            "64#" + goldNum,
            "33:" + pwd,
            "32:" + userName,
            "33:" + GetFuuID());
    },
    //获取房间列表消息
    SendRequestKindList:function(wkindID)
    {
        connectUtil.sendManual(KernelPlaza,
            ServerlistMainID,
            PlazaLogonMsg.SUB_MB_REQUESTKINDLIST,
            2,
            "16#" + wkindID);
        cc.log("ServerlistMainID= "+ServerlistMainID+"  PlazaLogonMsg.SUB_MB_REQUESTKINDLIST= "+PlazaLogonMsg.SUB_MB_REQUESTKINDLIST)
        cc.log("wkindid= "+wkindID)

    }

});


// 大厅消息管理
var plazaMsgManager = plazaMsgManager || new PlazaMsgManager();