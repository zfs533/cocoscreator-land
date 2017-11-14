/**
 * Created by baibo on 15/6/3.
 */


//登录游戏主ID
var RoomLogonMainID = 1;

//用户消息主ID
var RoomUserMainID = 3;

//房间状态主ID
var RoomStatusMainID = 4;

//框架主ID
var FrameMainID = 100;

//hanhu #增加房间配置消息 2015/08/04
var RoomSettingMainID = 2;

//登录游戏消息
var RoomLogonMsg =
{
    SUB_GR_LOGON_MOBILE: 2,      //手机登录

    SUB_GR_LOGON_RECONNECT: 4,   //断线重连

    SUB_GR_LOGON_SUCCESS: 100,   //登录成功

    SUB_GR_LOGON_FAILURE: 101,   //登录失败

    SUB_GR_LOGON_FINSH: 102,     //登陆完成

    SUB_GR_LOGON_NEEDRELOGON: 103,//需要重新登录
    SUB_GR_LOGON_RECONNECTOK: 104,//重连成功

    SUB_GR_LOGON_SERVERSHUTDOWN: 105, //服务器正在维护

    SUB_GR_UPDATENOTIFY: 200    // 升级提示
};



//登录房间错误信息
var RoomLogonResultFailed =
{
    REQUEST_FAILURE_NORMAL: 0, // 常规原因
    REQUEST_FAILURE_NOGOLD: 1,   // 金币不足
    REQUEST_FAILURE_NOSCORE: 2,  // 积分不足
    REQUEST_FAILURE_PASSWORD: 3,   // 密码错误
    REQUEST_FAILURE_PLAYING:4//游戏中
};

//请求失败
var RoomLogonResultFailedEx =
{
    REQUEST_FAILURE_NORMAL:     0,  // 常规原因
    REQUEST_FAILURE_NOGOLD:     1,  // 金币不足
    REQUEST_FAILURE_NOSCORE:    2,  // 积分不足
    REQUEST_FAILURE_PASSWORD:   3,  // 密码错误
    REQUEST_FAILURE_MAXGOLD:    4,  // 身上金币大于最大金币
    REQUEST_FAILURE_MAXGOLDSUM: 5   // 保险箱和身上之和大于最大金币
};

var RoomSettingMsg = {
    SUB_GR_ROOMSETTING : 101
}
//hanhu #房间规则 2015/12/24
var RoomRule = {
    SR_FORFEND_ROOM_ENTER : 0x00001000,							//禁止进入
    SR_FORFEND_GAME_ENTER :	0x00002000,							//禁止进入
    SR_FORFEND_GAME_LOOKON : 0x00004000,						//禁止旁观
    SR_FORCE_LINE : 0x00008000                                  //制排队
}

//用户信息
var RoomUserMsg =
{
    SUB_GR_USER_STANDUP: 4,         //起立请求

    SUB_GR_USER_INFO_REQ: 9,        //请求用户信息

    SUB_GR_USER_CHAIR_REQ: 10,       //请求换桌

    SUB_GR_USER_CHAIR_INFO_REQ: 11,  // 请求椅子用户信息

    SUB_GR_ASK_STANDUP: 12,  // 请求站起

    SUB_GR_USER_ENTER: 100,         //用户进入

    SUB_GR_USER_SCORE: 101,         //用户分数

    SUB_GR_USER_STATUS: 102,        //用户状态

    SUB_GR_REQUEST_FAILURE: 103,    //请求失败

    SUB_GR_ASK_STANDUP_SUCCESS: 104, //请求站起成功

    SUB_GR_ASK_STANDUP_FAIL: 105,   //请求站起失败

    SUB_GR_USER_RELOADINFO: 106,    //更新用户信息

    SUB_GR_USER_DEVICETYPE: 107,     //用户设备信息

    SUB_GR_USER_SORT: 15,            //排队房继续排队

    SUB_GR_USER_CANCEL_SORT : 16,           //取消排队

    SUB_GR_USER_SORT_SHOWCARD: 20,   //排队房继续排队(明牌开始)

    SUB_GR_USER_LEAVE_SORT : 108,           //离开排队房成功
    SUB_GR_USER_CHAT_BORDER_ERROR : 302,  // 使用喇叭失败

    SUB_GR_USER_CHAT_BORDER : 305      //使用喇叭聊天
};


var ChatArea =
{
    PT_ISSUE_AREA_GAME : 0x02,   //游戏道具
    PT_ISSUE_AREA_SERVER : 0x04  //房间道具
}

var ChatItem =
{
    PROPERTY_ID_TRUMPET : 19, //小喇叭道具
    PROPERTY_ID_TYPHON : 20   //大喇叭道具
}



//房间状态信息
var RoomStatusMsg =
{

    SUB_GR_TABLE_INFO: 100,   //桌子信息

    SUB_GR_TABLE_STATUS: 101, //桌子状态

    SUB_GR_ONLINE_CHECK: 102,//心跳检测包

    SUB_GR_RESEND: 103,       //丢包重发

    SUB_GR_ROOMWAIT: 109  //hanhu  #等待分配 2015/08/04
};


//框架消息
var FrameMsg =
{

    SUB_GF_GAME_OPTION: 1,  // 游戏配置
    SUB_GF_USER_READY: 2,    // 用户准备
    SUB_GF_USER_CHAT: 10,      // 用户聊天
    SUB_GF_USER_EXPRESSION: 11, // 用户表情

    SUB_GF_GAME_STATUS: 100, //游戏状态

    SUB_GF_GAME_SCENE: 101, //游戏场景

    SUB_GF_LOOKON_STATUS: 102, //旁观消息

    SUB_GF_SYSTEM_MESSAGE: 200, //系统消息


    SUB_GF_SYSTEM_NOTICE: 1000 // 系统公告
};

var FrameBoxMsg = {
    SUB_GF_HITCHEST: 6,	//响应宝箱
    SUB_GF_CHESTCOUNT: 301,  //任务进度
    SUB_GF_CHESTINFO: 302    //任务消息
}

//比赛 ...


//视图模式
var VIEW_MODE =
{
    VIEW_MODE_ALL: 0x0001,  //全部可视
    VIEW_MODE_PART: 0x0002 //部分可视
};


//信息模式
var VIEW_INFO =
{
    VIEW_INFO_LEVEL_1: 0x0010,//部分信息
    VIEW_INFO_LEVEL_2: 0x0020,//部分信息
    VIEW_INFO_LEVEL_3: 0x0040,//部分信息
    VIEW_INFO_LEVEL_4: 0x0080//部分信息
};

//信息模式
var RECVICE =
{
    RECVICE_GAME_CHAT: 0x0100,//接收聊天
    RECVICE_ROOM_CHAT: 0x0200,//接收聊天
    RECVICE_ROOM_WHISPER: 0x0400//接收私聊
};

//行为标识
var BEHAVIOR_LOGON =
{
    BEHAVIOR_LOGON_NORMAL: 0x0000, //普通登录
    BEHAVIOR_LOGON_IMMEDIATELY: 0x1000   //立即登录
};


//用户附加信息
var DT_GR_USERINFO =
{

    DTP_GR_NICK_NAME: 10, //用户昵称
    DTP_GR_GROUP_NAME: 11,//社团名称
    DTP_GR_UNDER_WRITE: 12//个性名称

};

//附加数据结构体大小
var DataDescribeSize = 4;

//用户基础信息的大小
var MobileUserInfoHeadsize = 49;

//会员等级
var MemberOrder =
{
    MEMBER_ORDER_YELLOW: 1,  //黄钻
    MEMBER_ORDER_BLUE: 2,    //蓝钻
    MEMBER_ORDER_RED: 3      //红钻
};

var INVALID_CHAIR_TABLE = -1;

var BaseDirector = cc.Class.extend({
    updatenotify:false,
    roomport:0,
    ReConnectCount:0,       //游戏重连次数-直到收到重连成功消息、退出到登录界面，清空次数
    foceline:false,   //是否强制排队(排队房间)
    ctor: function () {
        this.initFrameListeners();
    },
    //获取保存的用户信息
    getInfoOfPlayers: function (userId) {
        for (var key in this.gameData.playerInfo) {
            if (this.gameData.playerInfo[key]["dwUserID"] == userId) {
                return this.gameData.playerInfo[key];
            }
        }
        //lm.log("未找到玩家 " + userId);
        return null;

    },
    getUserInfoOfDirection: function (chairID) {
        var allInfo = this.gameData.playerInfo;
        return allInfo;
    },
    pushInfoOfPlayers: function (data)
    {
        this.gameData.playerInfo.push(data);
        if (sparrowDirector && sparrowDirector.gameLayer)
        {
            sparrowDirector.gameLayer.autoSetPlayerPos();
        }
    },
    refreshInfoOfPlayer: function (data, todata) {
        data = todata;
    },
    getChairByUserID: function (userID) {
        var usr = this.getInfoOfPlayers(userID);
        return usr["wChairID"];
    },
    //框架监听
    initFrameListeners: function () {
        var self = this;
        /////////////////////////////////////////////////////////////////////////////////////////////////
        InitDragonFrameListeners(this);

        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU,KernelCurrent, RoomLogonMainID, RoomLogonMsg.SUB_GR_UPDATENOTIFY, function (SerializeObject, wDataSize) {
            var data = {};
            data["type"] = "CMD_GR_UpdateNotify";

            data["cbMustUpdatePlaza"] = DataUtil.ReadNumber(SerializeObject, 8);
            data["cbMustUpdateClient"] = DataUtil.ReadNumber(SerializeObject, 8);
            data["cbAdviceUpdateClient"] = DataUtil.ReadNumber(SerializeObject, 8);

            data["dwCurrentPlazaVersion"] = DataUtil.ReadNumber(SerializeObject, 32);
            data["cbCurrentFrameVersion"] = DataUtil.ReadNumber(SerializeObject, 32);
            data["dwCurrentClientVersion"] = DataUtil.ReadNumber(SerializeObject, 32);

            // 客户端是否必须升级
            if(data["cbMustUpdateClient"] == 1)
            {
                this.updatenotify = true;
                //提示更新，跳转到下载地址下载
                //layerManager.PopTipLayer(new PopTipsUILayerEx("确定", "游戏版本已升级，请重启更新！", function (id)
                //{
                //    CloseGameSocket(KernelPlaza);
                //    ExitGame();
                //
                //},false));

                var pop = new ConfirmPop(this, Poptype.ok, "游戏版本已升级，请重启更新！");//ok
                pop.addToNode(cc.director.getRunningScene());
                pop.hideCloseBtn();
                pop.setokCallback(
                    function()
                    {
                        CloseGameSocket(KernelPlaza);
                        ExitGameEx();
                    }
                );

            }
        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_LAI_ZI,KernelCurrent, RoomLogonMainID, RoomLogonMsg.SUB_GR_UPDATENOTIFY, function (SerializeObject, wDataSize) {
            var data = {};
            data["type"] = "CMD_GR_UpdateNotify";

            data["cbMustUpdatePlaza"] = DataUtil.ReadNumber(SerializeObject, 8);
            data["cbMustUpdateClient"] = DataUtil.ReadNumber(SerializeObject, 8);
            data["cbAdviceUpdateClient"] = DataUtil.ReadNumber(SerializeObject, 8);

            data["dwCurrentPlazaVersion"] = DataUtil.ReadNumber(SerializeObject, 32);
            data["cbCurrentFrameVersion"] = DataUtil.ReadNumber(SerializeObject, 32);
            data["dwCurrentClientVersion"] = DataUtil.ReadNumber(SerializeObject, 32);

            // 客户端是否必须升级
            if(data["cbMustUpdateClient"] == 1)
            {
                this.updatenotify = true;
                //提示更新，跳转到下载地址下载
                //layerManager.PopTipLayer(new PopTipsUILayerEx("确定", "游戏版本已升级，请重启更新！", function (id)
                //{
                //    CloseGameSocket(KernelPlaza);
                //    ExitGame();
                //
                //},false));

                var pop = new ConfirmPop(this, Poptype.ok, "游戏版本已升级，请重启更新！");//ok
                pop.addToNode(cc.director.getRunningScene());
                pop.hideCloseBtn();
                pop.setokCallback(
                    function()
                    {
                        CloseGameSocket(KernelPlaza);
                        ExitGameEx();
                    }
                );
            }
        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_HAPPY,KernelCurrent, RoomLogonMainID, RoomLogonMsg.SUB_GR_UPDATENOTIFY, function (SerializeObject, wDataSize)   //与DOU_DI_ZHU逻辑相同
        {
            lm.log("欢乐斗地主 -> BaseDirector -> 升级提示 ");

            var data = {};
            data["type"] = "CMD_GR_UpdateNotify";

            data["cbMustUpdatePlaza"] = DataUtil.ReadNumber(SerializeObject, 8);
            data["cbMustUpdateClient"] = DataUtil.ReadNumber(SerializeObject, 8);
            data["cbAdviceUpdateClient"] = DataUtil.ReadNumber(SerializeObject, 8);

            data["dwCurrentPlazaVersion"] = DataUtil.ReadNumber(SerializeObject, 32);
            data["cbCurrentFrameVersion"] = DataUtil.ReadNumber(SerializeObject, 32);
            data["dwCurrentClientVersion"] = DataUtil.ReadNumber(SerializeObject, 32);

            // 客户端是否必须升级
            if(data["cbMustUpdateClient"] == 1)
            {
                this.updatenotify = true;
                //提示更新，跳转到下载地址下载
                //layerManager.PopTipLayer(new PopTipsUILayerEx("确定", "游戏版本已升级，请重启更新！", function (id)
                //{
                //    CloseGameSocket(KernelPlaza);
                //    ExitGame();
                //
                //},false));

                var pop = new ConfirmPop(this, Poptype.ok, "游戏版本已升级，请重启更新！");//ok
                pop.addToNode(cc.director.getRunningScene());
                pop.hideCloseBtn();
                pop.setokCallback(
                    function()
                    {
                        CloseGameSocket(KernelPlaza);
                        ExitGameEx();
                    }
                );
            }
        });

        //游戏登录消息处理
        //登录成功
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU,KernelCurrent, RoomLogonMainID, RoomLogonMsg.SUB_GR_LOGON_SUCCESS, function (SerializeObject, wDataSize) {
            var data = {};
            data["type"] = "CMD_GR_LogonSuccess";

            //用户权限
            data["dwUserRight"] = DataUtil.ReadNumber(SerializeObject, 32);


            //管理权限
            data["dwMasterRight"] = DataUtil.ReadNumber(SerializeObject, 32);

            //重连KEY
            data["dwReConnectKey"] = DataUtil.ReadNumber(SerializeObject, 32);


            userInfo.globalUserdData["dwUserRight"] = data["dwUserRight"];
            userInfo.globalUserdData["dwMasterRightt"] = data["dwMasterRight"];
            userInfo.globalUserdData["dwReConnectKey"] = data["dwReConnectKey"];

            sparrowDirector.currentRoomServerId = sparrowDirector.tempRoomServerId;//当前房间ID
            sparrowDirector.tempRoomServerId = 0;
            sparrowDirector.gameData.isLanchFirstPuker = false;
            lm.log("经典斗地主 -> BaseDirector -> 登录成功 " + sparrowDirector.currentRoomServerId + " " + sparrowDirector.tempRoomServerId);

            lm.log("logoin room successed !");


        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_LAI_ZI,KernelCurrent, RoomLogonMainID, RoomLogonMsg.SUB_GR_LOGON_SUCCESS, function (SerializeObject, wDataSize) {
            var data = {};
            data["type"] = "CMD_GR_LogonSuccess";

            //用户权限
            data["dwUserRight"] = DataUtil.ReadNumber(SerializeObject, 32);


            //管理权限
            data["dwMasterRight"] = DataUtil.ReadNumber(SerializeObject, 32);

            //重连KEY
            data["dwReConnectKey"] = DataUtil.ReadNumber(SerializeObject, 32);


            userInfo.globalUserdData["dwUserRight"] = data["dwUserRight"];
            userInfo.globalUserdData["dwMasterRightt"] = data["dwMasterRight"];
            userInfo.globalUserdData["dwReConnectKey"] = data["dwReConnectKey"];

            sparrowDirector.currentRoomServerId = sparrowDirector.tempRoomServerId;//当前房间ID
            sparrowDirector.tempRoomServerId = 0;
            sparrowDirector.gameData.isLanchFirstPuker = false;
            lm.log("癞子斗地主 -> BaseDirector -> 登录成功 " + sparrowDirector.currentRoomServerId + " " + sparrowDirector.tempRoomServerId);


        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_HAPPY,KernelCurrent, RoomLogonMainID, RoomLogonMsg.SUB_GR_LOGON_SUCCESS, function (SerializeObject, wDataSize)    //与DOU_DI_ZHU逻辑相同
        {
            lm.log("欢乐斗地主 -> BaseDirector -> 登录成功 ");

            var data = {};
            data["type"] = "CMD_GR_LogonSuccess";

            //用户权限
            data["dwUserRight"] = DataUtil.ReadNumber(SerializeObject, 32);


            //管理权限
            data["dwMasterRight"] = DataUtil.ReadNumber(SerializeObject, 32);

            //重连KEY
            data["dwReConnectKey"] = DataUtil.ReadNumber(SerializeObject, 32);


            userInfo.globalUserdData["dwUserRight"] = data["dwUserRight"];
            userInfo.globalUserdData["dwMasterRightt"] = data["dwMasterRight"];
            userInfo.globalUserdData["dwReConnectKey"] = data["dwReConnectKey"];

            sparrowDirector.currentRoomServerId = sparrowDirector.tempRoomServerId;//当前房间ID
            sparrowDirector.tempRoomServerId = 0;
            sparrowDirector.gameData.isLanchFirstPuker = false;
            lm.log("欢乐斗地主 -> BaseDirector -> 登录成功 " + sparrowDirector.currentRoomServerId + " " + sparrowDirector.tempRoomServerId);


        });

        //登录失败
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU,KernelCurrent, RoomLogonMainID, RoomLogonMsg.SUB_GR_LOGON_FAILURE, function (SerializeObject, wDataSize) {

            lm.log("------------------登录失败--request failed001");
            // 无更新通知才处理登录失败消息
            if(self.updatenotify== false)
            {
                var data = {};
                data["type"] = "CMD_GR_LogonFailure";

                //错误代码
                data["lErrCode"] = DataUtil.ReadNumber(SerializeObject, 32);

                //房间号
                data["wServerID"] = DataUtil.ReadNumber(SerializeObject, 16);

                //描述信息
                data["szDescribeString"] = ReadString(SerializeObject, 0);


                // 获取自己的信息
                var myInfo = self.getInfoOfPlayers(userInfo.globalUserdData["dwUserID"]);
                cc.log("获取自己的信息: ", myInfo);
                if(myInfo == null ||  myInfo["cbUserStatus"] == PlayerStatus.US_FREE)
                {
                    cc.log("close game socket");
                    //主动关闭游戏链接，在登录时需要RebuildSocket;

                    //begin added by lizhongqiang 2015-09-11 16:50
                    self.updatenotify = false;
                    self.ReConnectCount=0;
                    self.foceline = false;
                    CloseGameSocket(KernelCurrent);

                    //end added by lizhongqiang
                }
lm.log("--------------------request failed001" + JSON.stringify(data));
                //lm.log("登录房间失败");
                switch (Number(data["lErrCode"]))
                {
                    case RoomLogonResultFailed.REQUEST_FAILURE_NOSCORE:
                    {
                        lm.log ("yyp 登录房间失败 11");

                        var pop = new ConfirmPop (this, Poptype.yesno, data["szDescribeString"]);//ok
                        pop.addToNode (cc.director.getRunningScene ());
                        pop.setYesNoCallback (
                            function () {

                                layerManager.PopTipLayer (new WaitUILayer ("正在努力加载中...", function () {
                                    layerManager.PopTipLayer (new PopAutoTipsUILayer ("连接服务器超时，请稍后重试！", DefultPopTipsTime), false);

                                }, self));

                                //add by yyp
                                if (roomManager.GetMallData () != null || roomManager.GetMallData () != undefined) {
                                    lm.log ("已有商城数据");
                                    var curLayer = new MallUILayer ();
                                    curLayer.setTag (ClientModuleType.Mall);
                                    curLayer.setMallDataType (MallDataType.MALL_DATA_GOLD);
                                    layerManager.repalceLayer (curLayer);
                                    DataUtil.SetGoToModule (ClientModuleType.Plaza);
                                }
                                else {
                                    webMsgManager.SendGpProperty (function (data) {
                                            roomManager.SetMallData (data);
                                            var curLayer = new MallUILayer ();
                                            curLayer.setTag (ClientModuleType.Mall);
                                            curLayer.setMallDataType (MallDataType.MALL_DATA_GOLD);
                                            layerManager.repalceLayer (curLayer);
                                            DataUtil.SetGoToModule (ClientModuleType.Plaza);
                                        },
                                        function (errinfo) {
                                            lm.log ("请求商城数据失败. info = " + errinfo);
                                            layerManager.PopTipLayer (new PopAutoTipsUILayer (errinfo, DefultPopTipsTime), true);
                                        },
                                        this);
                                }
                            }
                        );
                        break;
                    }
                    //玩家金币超过房间最高准入金币 by zfs 20160506
                    case RoomLogonResultFailed.REQUEST_FAILURE_NORMAL:
                    {
                        var pop = new ConfirmPop (this, Poptype.ok, data["szDescribeString"]);//ok
                        pop.addToNode (cc.director.getRunningScene ());
                        pop.setokCallback (
                            function () {
                                sparrowDirector.gotoBestGoldRoomPlay01 ();
                            },
                            function () {
                            }
                        );
                        break;
                    }
                    //玩家正在游戏中,进入游戏  by zfs 20160506
                    case RoomLogonResultFailed.REQUEST_FAILURE_PLAYING:
                    {
                        var pop = new ConfirmPop (this, Poptype.ok, data["szDescribeString"]);//ok
                        pop.addToNode (cc.director.getRunningScene ());
                        pop.setokCallback (
                            function ()
                            {
                                lm.log("经典斗地主 游戏进行中 重连 " + sparrowDirector.currentRoomServerId + " " + sparrowDirector.tempRoomServerId);
                                if(sparrowDirector.currentRoomServerId != 0)
                                {
                                    var serverdata =  GameServerKind.SearchServer(sparrowDirector.currentRoomServerId);

                                    Game_ID = serverdata["wKindID"];
                                    sparrowDirector.gameData.accessGold = serverdata["lMinTabScore"];
                                    sparrowDirector.roomAccessGold = serverdata["lMinTabScore"];
                                    sparrowDirector.roomName = serverdata["szServerName"];

                                    sparrowDirector.tempRoomServerId = sparrowDirector.currentRoomServerId;

                                    sparrowDirector.LogonRoom(serverdata["wServerPort"],
                                        userInfo.globalUserdData["dwUserID"],
                                        userInfo.GetCurPlayerPassword(),
                                        GetFuuID());

                                    layerManager.PopTipLayer(new WaitUILayer("正在入桌，请稍后....", function () {
                                        layerManager.PopTipLayer(new PopAutoTipsUILayer("连接服务器超时，请稍后重试！", DefultPopTipsTime), false);
                                    }));
                                }
                            },
                            function () {
                            }
                        );
                        break;
                    }

                    default :
                    {
                        lm.log("yyp 登录房间失败 12");
                        var pop = new ConfirmPop(this, Poptype.yesno, data["szDescribeString"]);//ok
                        pop.addToNode(cc.director.getRunningScene());

                        //登录房间失败
                        //layerManager.PopTipLayer(new PopTipsUILayer("确定","取消", data["szDescribeString"], function(id)
                        //{
                        //    if(id == clickid.ok)
                        //    {
                        //    }
                        //
                        //},this),false);
                    }
                        break;
                }
            }

        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_LAI_ZI,KernelCurrent, RoomLogonMainID, RoomLogonMsg.SUB_GR_LOGON_FAILURE, function (SerializeObject, wDataSize) {
            lm.log("--------------------request failed002" + JSON.stringify(data));
            // 无更新通知才处理登录失败消息
            if(self.updatenotify== false)
            {
                var data = {};
                data["type"] = "CMD_GR_LogonFailure";

                //错误代码
                data["lErrCode"] = DataUtil.ReadNumber(SerializeObject, 32);

                //房间号
                data["wServerID"] = DataUtil.ReadNumber(SerializeObject, 16);

                //描述信息
                data["szDescribeString"] = ReadString(SerializeObject, 0);

                // 获取自己的信息
                var myInfo = self.getInfoOfPlayers(userInfo.globalUserdData["dwUserID"]);
                cc.log("获取自己的信息: ", myInfo);
                if(myInfo == null ||  myInfo["cbUserStatus"] == PlayerStatus.US_FREE)
                {
                    cc.log("close game socket");
                    //主动关闭游戏链接，在登录时需要RebuildSocket;

                    //begin added by lizhongqiang 2015-09-11 16:50
                    self.updatenotify = false;
                    self.ReConnectCount=0;
                    self.foceline = false;
                    CloseGameSocket(KernelCurrent);

                    //end added by lizhongqiang
                }
                lm.log("--------------------request failed002" + JSON.stringify(data));

                //lm.log("登录房间失败");
                switch (Number(data["lErrCode"]))
                {
                    case RoomLogonResultFailed.REQUEST_FAILURE_NOSCORE:
                    {
                        lm.log("yyp 登录房间失败 21");
                        var pop = new ConfirmPop(this, Poptype.yesno, data["szDescribeString"]);//ok
                        pop.addToNode(cc.director.getRunningScene());
                        pop.setYesNoCallback(
                            function(){

                                layerManager.PopTipLayer(new WaitUILayer("正在努力加载中...",function()
                                {
                                    layerManager.PopTipLayer(new PopAutoTipsUILayer("连接服务器超时，请稍后重试！", DefultPopTipsTime),false);

                                },self));

                                //add by yyp
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
                            }
                        );

                        //layerManager.PopTipLayer(new PopTipsUILayer("购买金币","取消", data["szDescribeString"], function(id)
                        //{
                        //    if(id == clickid.ok )
                        //    {
                        //        layerManager.PopTipLayer(new WaitUILayer("正在努力加载中...",function()
                        //        {
                        //            layerManager.PopTipLayer(new PopAutoTipsUILayer("连接服务器超时，请稍后重试！", DefultPopTipsTime),false);
                        //
                        //        },self));
                        //
                        //        //add by yyp
                        //        if(roomManager.GetMallData() != null || roomManager.GetMallData() != undefined)
                        //        {
                        //            lm.log("已有商城数据");
                        //            var curLayer =  new MallUILayer();
                        //            curLayer.setTag(ClientModuleType.Mall);
                        //            curLayer.setMallDataType(MallDataType.MALL_DATA_GOLD);
                        //            layerManager.repalceLayer(curLayer);
                        //            DataUtil.SetGoToModule(ClientModuleType.Plaza);
                        //        }
                        //        else
                        //        {
                        //            webMsgManager.SendGpProperty(function (data)
                        //                {
                        //                    roomManager.SetMallData(data);
                        //                    var curLayer =  new MallUILayer();
                        //                    curLayer.setTag(ClientModuleType.Mall);
                        //                    curLayer.setMallDataType(MallDataType.MALL_DATA_GOLD);
                        //                    layerManager.repalceLayer(curLayer);
                        //                    DataUtil.SetGoToModule(ClientModuleType.Plaza);
                        //                },
                        //                function (errinfo) {
                        //                    lm.log("请求商城数据失败. info = " + errinfo);
                        //                    layerManager.PopTipLayer(new PopAutoTipsUILayer(errinfo, DefultPopTipsTime),true);
                        //                },
                        //                this);
                        //        }
                        //        /*
                        //        webMsgManager.SendGpProperty(function (data) {
                        //
                        //                roomManager.SetMallData(data);
                        //
                        //
                        //                //商城按钮
                        //                switch (Number(GetDeviceType())) {
                        //                    case DeviceType.ANDROID://android
                        //                    {
                        //
                        //                        var curLayer =  new MallUILayer();
                        //                        curLayer.setTag(ClientModuleType.Mall);
                        //                        curLayer.refreshViewByData(MallDataType.MALL_DATA_GOLD);
                        //                        layerManager.repalceLayer(curLayer);
                        //
                        //                    }
                        //                        break;
                        //                    case DeviceType.IOS://IOS
                        //                    case DeviceType.IPAD://android
                        //                    {
                        //                        //请求产品列表
                        //                        roomManager.RequestProduct(MallDataType.MALL_DATA_GOLD);
                        //
                        //                        // 显示等待标记
                        //                        layerManager.PopTipLayer(new WaitUILayer("正在获取产品信息，请稍后...",function()
                        //                        {
                        //                            layerManager.PopTipLayer(new PopAutoTipsUILayer("连接服务器超时，请稍后重试！", DefultPopTipsTime),false);
                        //
                        //                        },self));
                        //
                        //                    }
                        //                }
                        //                DataUtil.SetGoToModule(ClientModuleType.Plaza);
                        //
                        //            },
                        //            function (errinfo) {
                        //
                        //            },
                        //            this);
                        //        */
                        //    }
                        //
                        //},this),false);


                    }
                        break;
                    default :
                    {
                        lm.log("yyp 登录房间失败 22");
                        var pop = new ConfirmPop(this, Poptype.yesno, data["szDescribeString"]);//ok
                        pop.addToNode(cc.director.getRunningScene());
                        //登录房间失败
                        //layerManager.PopTipLayer(new PopTipsUILayer("确定","取消", data["szDescribeString"], function(id)
                        //{
                        //    if(id == clickid.ok)
                        //    {
                        //    }
                        //
                        //},this),false);
                    }
                        break;
                }
            }

        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_HAPPY,KernelCurrent, RoomLogonMainID, RoomLogonMsg.SUB_GR_LOGON_FAILURE, function (SerializeObject, wDataSize)    //与DOU_DI_ZHU逻辑相同
        {
            lm.log("欢乐斗地主 -> BaseDirector -> 登录失败 ");

            // 无更新通知才处理登录失败消息
            if(self.updatenotify== false)
            {
                var data = {};
                data["type"] = "CMD_GR_LogonFailure";

                //错误代码
                data["lErrCode"] = DataUtil.ReadNumber(SerializeObject, 32);

                //房间号
                data["wServerID"] = DataUtil.ReadNumber(SerializeObject, 16);

                //描述信息
                data["szDescribeString"] = ReadString(SerializeObject, 0);

                lm.log("欢乐斗地主 -> BaseDirector -> 登录失败 " + JSON.stringify(data));

                // 获取自己的信息
                var myInfo = self.getInfoOfPlayers(userInfo.globalUserdData["dwUserID"]);
                cc.log("获取自己的信息: ", myInfo);
                if(myInfo == null ||  myInfo["cbUserStatus"] == PlayerStatus.US_FREE)
                {
                    cc.log("close game socket");
                    //主动关闭游戏链接，在登录时需要RebuildSocket;

                    //begin added by lizhongqiang 2015-09-11 16:50
                    self.updatenotify = false;
                    self.ReConnectCount=0;
                    self.foceline = false;
                    CloseGameSocket(KernelCurrent);

                    //end added by lizhongqiang
                }

                //lm.log("登录房间失败");
                switch (Number(data["lErrCode"]))
                {
                    case RoomLogonResultFailed.REQUEST_FAILURE_NOSCORE:
                    {
                        lm.log("yyp 登录房间失败 21");
                        var pop = new ConfirmPop(this, Poptype.yesno, data["szDescribeString"]);//ok
                        pop.addToNode(cc.director.getRunningScene());
                        pop.setYesNoCallback(
                            function(){

                                layerManager.PopTipLayer(new WaitUILayer("正在努力加载中...",function()
                                {
                                    layerManager.PopTipLayer(new PopAutoTipsUILayer("连接服务器超时，请稍后重试！", DefultPopTipsTime),false);

                                },self));

                                //add by yyp
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
                            }
                        );
                        break;
                    }
                    //玩家金币超过房间最高准入金币 by zfs 20160506
                    case RoomLogonResultFailed.REQUEST_FAILURE_NORMAL:
                    {
                        var pop = new ConfirmPop (this, Poptype.ok, data["szDescribeString"]);//ok
                        pop.addToNode (cc.director.getRunningScene ());
                        pop.setokCallback (
                            function () {
                                sparrowDirector.gotoBestGoldRoomPlay01 ();
                            },
                            function () {
                            }
                        );
                        break;
                    }
                    //玩家正在游戏中,进入游戏  by zfs 20160506
                    case RoomLogonResultFailed.REQUEST_FAILURE_PLAYING:
                    {
                        var pop = new ConfirmPop (this, Poptype.ok, data["szDescribeString"]);//ok
                        pop.addToNode (cc.director.getRunningScene ());
                        pop.setokCallback (
                            function ()
                            {
                                lm.log("欢乐斗地主 游戏进行中 重连 1 " + sparrowDirector.currentRoomServerId + " " + sparrowDirector.tempRoomServerId);
                                if(sparrowDirector.currentRoomServerId != 0)
                                {
                                    var serverdata =  GameServerKind.SearchServer(sparrowDirector.currentRoomServerId);

                                    Game_ID = serverdata["wKindID"];
                                    sparrowDirector.gameData.accessGold = serverdata["lMinTabScore"];
                                    sparrowDirector.roomAccessGold = serverdata["lMinTabScore"];
                                    sparrowDirector.roomName = serverdata["szServerName"];

                                    sparrowDirector.tempRoomServerId = sparrowDirector.currentRoomServerId;

                                    sparrowDirector.LogonRoom(serverdata["wServerPort"],
                                        userInfo.globalUserdData["dwUserID"],
                                        userInfo.GetCurPlayerPassword(),
                                        GetFuuID());

                                    layerManager.PopTipLayer(new WaitUILayer("正在入桌，请稍后....", function () {
                                        layerManager.PopTipLayer(new PopAutoTipsUILayer("连接服务器超时，请稍后重试！", DefultPopTipsTime), false);
                                    }));
                                }
                            },
                            function () {
                            }
                        );
                        break;
                    }
                    default :
                    {
                        lm.log("yyp 登录房间失败 22");
                        var pop = new ConfirmPop(this, Poptype.yesno, data["szDescribeString"]);//ok
                        pop.addToNode(cc.director.getRunningScene());
                    }
                        break;
                }
            }

        });

        //hanhu #重连成功 2015/08/27
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU,KernelCurrent, RoomLogonMainID, RoomLogonMsg.SUB_GR_LOGON_RECONNECTOK, function(data, size){

            lm.log("游戏房间重连成功...");
            var IsOnTable = DataUtil.ReadNumber(data, 8);
            var RecieveIndex = DataUtil.ReadNumber(data, 64);
            if(IsOnTable)
            {
                //将本地缓存发往服务器
                //lm.log("SendIdex =" + connectUtil._lGameRecvIndex + " RecieveIndex =" + RecieveIndex);
                SendBuffer(KernelCurrent, RecieveIndex);

            }
        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_LAI_ZI,KernelCurrent, RoomLogonMainID, RoomLogonMsg.SUB_GR_LOGON_RECONNECTOK, function(data, size){

            lm.log("游戏房间重连成功...");
            var IsOnTable = DataUtil.ReadNumber(data, 8);
            var RecieveIndex = DataUtil.ReadNumber(data, 64);
            if(IsOnTable)
            {
                //将本地缓存发往服务器
                //lm.log("SendIdex =" + connectUtil._lGameRecvIndex + " RecieveIndex =" + RecieveIndex);
                SendBuffer(KernelCurrent, RecieveIndex);

            }
        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_HAPPY,KernelCurrent, RoomLogonMainID, RoomLogonMsg.SUB_GR_LOGON_RECONNECTOK, function(data, size)    //与DOU_DI_ZHU逻辑相同
        {
            lm.log("欢乐斗地主 -> BaseDirector -> 重连成功 ");

            lm.log("游戏房间重连成功...");
            var IsOnTable = DataUtil.ReadNumber(data, 8);
            var RecieveIndex = DataUtil.ReadNumber(data, 64);
            if(IsOnTable)
            {
                //将本地缓存发往服务器
                //lm.log("SendIdex =" + connectUtil._lGameRecvIndex + " RecieveIndex =" + RecieveIndex);
                SendBuffer(KernelCurrent, RecieveIndex);

            }
        });

        //hanhu #处理重新登录消息 2015/08/27
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU,KernelCurrent, RoomLogonMainID, RoomLogonMsg.SUB_GR_LOGON_NEEDRELOGON, function(data, size){
            //lm.log("收到需要重新登陆的消息");

            // begin added by lizhongqiang 2015-09-11 17:00
            self.updatenotify = false;
            self.foceline = false;
            plazaMsgManager.ReConnectCount = 0;
            self.ReConnectCount=0;
            // end added by lizhongqiang

            var pop = new ConfirmPop(this, Poptype.yesno, "当前网络出现异常，是否重新登录游戏？");//ok
            pop.addToNode(cc.director.getRunningScene());
            pop.hideCloseBtn();
            pop.setYesNoCallback(
                function(){
                    //关闭连接
                    CloseGameSocket(KernelPlaza);
                    CloseGameSocket(KernelCurrent);

                    userInfo.ClearUserData();

                    cc.director.runScene(new rootUIScene());
                    matchMsgManager.ClearMatchData();
                    sparrowDirector.ClearAllData();
                },
                function(){
                    CloseGameSocket(KernelPlaza);
                    CloseGameSocket(KernelCurrent);
                    ExitGameEx();
                }
            );

            //layerManager.PopTipLayer(new PopTipsUILayer("确定", "取消", "当前网络出现异常，是否重新登录游戏？", function (id) {
            //    if (id == clickid.ok) {
            //
            //        //关闭连接
            //        CloseGameSocket(KernelPlaza);
            //        CloseGameSocket(KernelCurrent);
            //
            //        // 回到登陆界面
            //        userInfo.ClearUserData();
            //
            //        //hanuh #采用切换场景的方式回到登陆界面，同时清除游戏数据 2015/09/30
            //        cc.director.runScene(new rootUIScene());
            //        //var scene = new rootScene();
            //        //layerManager.addLayerToParent(new LoginUILayer(), scene);
            //        //cc.director.replaceScene(scene);
            //        //userInfo.ClearUserData();
            //
            //        //hanhu #切换帐号时重置比赛数据 2015/09/24
            //        lm.log("游戏重新登录，清理数据");
            //        matchMsgManager.ClearMatchData();
            //        sparrowDirector.ClearAllData();
            //
            //    } else {
            //
            //        CloseGameSocket(KernelPlaza);
            //        CloseGameSocket(KernelCurrent);
            //        ExitGameEx();
            //    }
            //
            //}, this), false);
        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_LAI_ZI,KernelCurrent, RoomLogonMainID, RoomLogonMsg.SUB_GR_LOGON_NEEDRELOGON, function(data, size){
            //lm.log("收到需要重新登陆的消息");

            // begin added by lizhongqiang 2015-09-11 17:00
            self.updatenotify = false;
            self.foceline = false;
            plazaMsgManager.ReConnectCount = 0;
            self.ReConnectCount=0;
            // end added by lizhongqiang

            var pop = new ConfirmPop(this, Poptype.yesno, "当前网络出现异常，是否重新登录游戏？");//ok
            pop.addToNode(cc.director.getRunningScene());
            pop.hideCloseBtn();
            pop.setYesNoCallback(
                function(){
                    //关闭连接
                    CloseGameSocket(KernelPlaza);
                    CloseGameSocket(KernelCurrent);

                    // 回到登陆界面
                    userInfo.ClearUserData();

                    //hanuh #采用切换场景的方式回到登陆界面，同时清除游戏数据 2015/09/30
                    cc.director.runScene(new rootUIScene());
                    //var scene = new rootScene();
                    //layerManager.addLayerToParent(new LoginUILayer(), scene);
                    //cc.director.replaceScene(scene);
                    //userInfo.ClearUserData();

                    //hanhu #切换帐号时重置比赛数据 2015/09/24
                    lm.log("游戏重新登录，清理数据");
                    matchMsgManager.ClearMatchData();
                    sparrowDirector.ClearAllData();
                },
                function(){
                    CloseGameSocket(KernelPlaza);
                    CloseGameSocket(KernelCurrent);
                    ExitGameEx();
                }
            );
            //layerManager.PopTipLayer(new PopTipsUILayer("确定", "取消", "当前网络出现异常，是否重新登录游戏？", function (id) {
            //    if (id == clickid.ok) {
            //
            //        //关闭连接
            //        CloseGameSocket(KernelPlaza);
            //        CloseGameSocket(KernelCurrent);
            //
            //        // 回到登陆界面
            //        userInfo.ClearUserData();
            //
            //        //hanuh #采用切换场景的方式回到登陆界面，同时清除游戏数据 2015/09/30
            //        cc.director.runScene(new rootUIScene());
            //        //var scene = new rootScene();
            //        //layerManager.addLayerToParent(new LoginUILayer(), scene);
            //        //cc.director.replaceScene(scene);
            //        //userInfo.ClearUserData();
            //
            //        //hanhu #切换帐号时重置比赛数据 2015/09/24
            //        lm.log("游戏重新登录，清理数据");
            //        matchMsgManager.ClearMatchData();
            //        sparrowDirector.ClearAllData();
            //
            //    } else {
            //
            //        CloseGameSocket(KernelPlaza);
            //        CloseGameSocket(KernelCurrent);
            //        ExitGameEx();
            //    }
            //
            //}, this), false);

        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_HAPPY,KernelCurrent, RoomLogonMainID, RoomLogonMsg.SUB_GR_LOGON_NEEDRELOGON, function(data, size)    //与DOU_DI_ZHU逻辑相同
        {
            lm.log("欢乐斗地主 -> BaseDirector -> 重新登录 ");

            // begin added by lizhongqiang 2015-09-11 17:00
            self.updatenotify = false;
            self.foceline = false;
            plazaMsgManager.ReConnectCount = 0;
            self.ReConnectCount=0;
            // end added by lizhongqiang

            var pop = new ConfirmPop(this, Poptype.yesno, "当前网络出现异常，是否重新登录游戏？");//ok
            pop.addToNode(cc.director.getRunningScene());
            pop.hideCloseBtn();
            pop.setYesNoCallback(
                function(){
                    //关闭连接
                    CloseGameSocket(KernelPlaza);
                    CloseGameSocket(KernelCurrent);

                    userInfo.ClearUserData();

                    cc.director.runScene(new rootUIScene());
                    matchMsgManager.ClearMatchData();
                    sparrowDirector.ClearAllData();
                },
                function(){
                    CloseGameSocket(KernelPlaza);
                    CloseGameSocket(KernelCurrent);
                    ExitGameEx();
                }
            );

        });

        //用户进入
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU,KernelCurrent, RoomUserMainID, RoomUserMsg.SUB_GR_USER_ENTER, function (SerializeObject, wDataSize) {
            lm.log("斗地主 -> BaseDirector -> 用户进入 1 [" + KernelCurrent + " " + sparrowDirector._sortRoomFlag + " " + sparrowDirector.sortRoomUserInfoFlag);
            //比赛模式不进行下面的处理
            if(KernelCurrent == KernelMatch ) return;
            if(sparrowDirector._sortRoomFlag && sparrowDirector.sortRoomUserInfoFlag == false) //hanhu #排队房只有准备后才能接收用户消息 2015/12/14
            {
                return;
            }
            lm.log("斗地主 -> BaseDirector -> 用户进入 2 ");
            var data = {};
            data["type"] = "tagMobileUserInfoHead";

            //游戏ID
            data["dwGameID"] = DataUtil.ReadNumber(SerializeObject, 32);


            //用户ID
            data["dwUserID"] = DataUtil.ReadNumber(SerializeObject, 32);

            //头像索引
            data["wFaceID"] = DataUtil.ReadNumber(SerializeObject, 16);

            //自定标志
            data["dwCustomID"] = DataUtil.ReadNumber(SerializeObject, 32);


            //用户性别
            data["cbGender"] = DataUtil.ReadNumber(SerializeObject, 8);


            //会员等级
            data["cbMemberOrder"] = DataUtil.ReadNumber(SerializeObject, 8);


            //桌子索引
            data["wTableID"] = DataUtil.ReadNumber(SerializeObject, 16);


            //椅子索引
            data["wChairID"] = DataUtil.ReadNumber(SerializeObject, 16);


            //用户状态
            data["cbUserStatus"] = DataUtil.ReadNumber(SerializeObject, 8);


            //用户分数
            data["lScore"] = DataUtil.ReadNumber(SerializeObject, 64);


            //胜利盘数
            data["dwWinCount"] = DataUtil.ReadNumber(SerializeObject, 32);


            //失败盘数
            data["dwlostCount"] = DataUtil.ReadNumber(SerializeObject, 32);


            //和局盘数
            data["dwDrawCount"] = DataUtil.ReadNumber(SerializeObject, 32);


            //逃局盘数
            data["dwFleeCount"] = DataUtil.ReadNumber(SerializeObject, 32);


            //用户经验
            data["dwExperience"] = DataUtil.ReadNumber(SerializeObject, 32);

            //附加数据读取
            if ((wDataSize - MobileUserInfoHeadsize) > DataDescribeSize) {
                //数据大小
                var dataSize = DataUtil.ReadNumber(SerializeObject, 16);

                //数据描述
                var dataDescribe = DataUtil.ReadNumber(SerializeObject, 16);

                var wCurSize = wDataSize - MobileUserInfoHeadsize - DataDescribeSize;
                while (wCurSize > 0) {
                    switch (dataDescribe) {
                        case DT_GR_USERINFO.DTP_GR_NICK_NAME:
                        {
                            data["szNickName"] = ReadString(SerializeObject, dataSize / 2);
                        }
                            break;
                        case DT_GR_USERINFO.DTP_GR_GROUP_NAME:
                        {
                            data["szGroup"] = ReadString(SerializeObject, dataSize / 2);
                        }
                            break;
                        case DT_GR_USERINFO.DTP_GR_UNDER_WRITE:
                        {
                            data["szUnderWrite"] = ReadString(SerializeObject, dataSize / 2);
                        }
                            break;
                    }

                    wCurSize -= dataSize;
                    if (wCurSize > DataDescribeSize) {
                        //数据大小
                        dataSize = DataUtil.ReadNumber(SerializeObject, 16);

                        //数据描述
                        dataDescribe = DataUtil.ReadNumber(SerializeObject, 16);

                        wCurSize -= DataDescribeSize;
                    }
                }
            }
            cc.log("==================用户进入=========================");
            cc.log(JSON.stringify(data));
            //读取玩家信息
            if (self.getInfoOfPlayers(data["dwUserID"])) {
                for (var key in self.gameData.playerInfo) {
                    if (self.gameData.playerInfo[key]["dwUserID"] == data["dwUserID"]) {
                        self.gameData.playerInfo[key] = data;
                        break;
                    }
                }
            }
            else
            {
                self.pushInfoOfPlayers(data);
            }
            /*
            // 登录用户是自己更新全局用户信息
            cc.log("UserID = " + data["dwUserID"]);
            if (data["dwUserID"] == userInfo.globalUserdData["dwUserID"] && data["wChairID"] != -1)
            {
                if (sparrowDirector.isAutoReady && sparrowDirector.isPlayingGame == false)
                {
                    //self.gameData.tableIndex = data["wTableID"];
                    //self.gameLayer.deskLayer.deskNumber.setString(Number(data["wTableID"] + 1)+" 椅子:"+data["wChairID"]);
                    //self.gameData.myChairIndex = data["wChairID"];
                    sparrowDirector.isPlayingGame = true;
                    sparrowDirector.gotoDeskScene();

                }

                if(sparrowDirector.isChangingRoom == true && sparrowDirector.isAutoReady == true)
                {
                    //sparrowDirector.SendUserReady();
                }
                userInfo.globalUserdData["lUserScore"] = data["lScore"];
                //sparrowDirector.gameData.playerInfo = new Array();

                if (data["wTableID"] != INVALID_CHAIR_TABLE)
                {
                    self.gameData.tableIndex = data["wTableID"];
                    self.gameLayer.deskLayer.deskNumber.setString(Number(data["wTableID"] + 1)+" 椅子:"+data["wChairID"]);
                    self.gameData.myChairIndex = data["wChairID"];
                    sparrowDirector.setCenterDirection(data["wChairID"]);

                    //请求除自己之外其他玩家信息
                    var myIndex = data["wChairID"];
                    var allIndex = [0, 1, 2];
                    allIndex.splice(allIndex.indexOf(myIndex), 1);
                    for (var key in allIndex)
                    {
                        sparrowDirector.SendUserChairInFoReq(self.gameData.tableIndex, allIndex[key]);
                    }
                    var myInfo = self.getInfoOfPlayers(data["dwUserID"]);
                    myInfo["wTableID"] = data["wTableID"];
                    myInfo["wChairID"] = data["wChairID"];
                    myInfo["cbUserStatus"] = data["cbUserStatus"];
                    self.SendGameOption();
                }
            }
            */
            cc.log("ChairID = " + data["wChairID"]);
            if (data["wChairID"] != -1) {
                cc.log("收到用户进入消息, 玩家昵称为:" + data["szNickName"]);
                sparrowDirector.setPlayerStatus(data);
            }
        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_LAI_ZI,KernelCurrent, RoomUserMainID, RoomUserMsg.SUB_GR_USER_ENTER, function (SerializeObject, wDataSize) {
            //比赛模式不进行下面的处理
            if(KernelCurrent == KernelMatch ) return;
            if(sparrowDirector._sortRoomFlag && sparrowDirector.sortRoomUserInfoFlag == false) //hanhu #排队房只有准备后才能接收用户消息 2015/12/14
            {
                return;
            }
            cc.log("用户进入: --- ");
            lm.log("用户进入: --- ");
            var data = {};
            data["type"] = "tagMobileUserInfoHead";

            //游戏ID
            data["dwGameID"] = DataUtil.ReadNumber(SerializeObject, 32);


            //用户ID
            data["dwUserID"] = DataUtil.ReadNumber(SerializeObject, 32);

            //头像索引
            data["wFaceID"] = DataUtil.ReadNumber(SerializeObject, 16);

            //自定标志
            data["dwCustomID"] = DataUtil.ReadNumber(SerializeObject, 32);


            //用户性别
            data["cbGender"] = DataUtil.ReadNumber(SerializeObject, 8);


            //会员等级
            data["cbMemberOrder"] = DataUtil.ReadNumber(SerializeObject, 8);


            //桌子索引
            data["wTableID"] = DataUtil.ReadNumber(SerializeObject, 16);


            //椅子索引
            data["wChairID"] = DataUtil.ReadNumber(SerializeObject, 16);


            //用户状态
            data["cbUserStatus"] = DataUtil.ReadNumber(SerializeObject, 8);


            //用户分数
            data["lScore"] = DataUtil.ReadNumber(SerializeObject, 64);


            //胜利盘数
            data["dwWinCount"] = DataUtil.ReadNumber(SerializeObject, 32);


            //失败盘数
            data["dwlostCount"] = DataUtil.ReadNumber(SerializeObject, 32);


            //和局盘数
            data["dwDrawCount"] = DataUtil.ReadNumber(SerializeObject, 32);


            //逃局盘数
            data["dwFleeCount"] = DataUtil.ReadNumber(SerializeObject, 32);


            //用户经验
            data["dwExperience"] = DataUtil.ReadNumber(SerializeObject, 32);

            //附加数据读取
            if ((wDataSize - MobileUserInfoHeadsize) > DataDescribeSize) {
                //数据大小
                var dataSize = DataUtil.ReadNumber(SerializeObject, 16);

                //数据描述
                var dataDescribe = DataUtil.ReadNumber(SerializeObject, 16);

                var wCurSize = wDataSize - MobileUserInfoHeadsize - DataDescribeSize;
                while (wCurSize > 0) {
                    switch (dataDescribe) {
                        case DT_GR_USERINFO.DTP_GR_NICK_NAME:
                        {
                            data["szNickName"] = ReadString(SerializeObject, dataSize / 2);
                        }
                            break;
                        case DT_GR_USERINFO.DTP_GR_GROUP_NAME:
                        {
                            data["szGroup"] = ReadString(SerializeObject, dataSize / 2);
                        }
                            break;
                        case DT_GR_USERINFO.DTP_GR_UNDER_WRITE:
                        {
                            data["szUnderWrite"] = ReadString(SerializeObject, dataSize / 2);
                        }
                            break;
                    }

                    wCurSize -= dataSize;
                    if (wCurSize > DataDescribeSize) {
                        //数据大小
                        dataSize = DataUtil.ReadNumber(SerializeObject, 16);

                        //数据描述
                        dataDescribe = DataUtil.ReadNumber(SerializeObject, 16);

                        wCurSize -= DataDescribeSize;
                    }
                }
            }
            cc.log("==================用户进入=========================");
            cc.log(JSON.stringify(data));
            //读取玩家信息
            if (self.getInfoOfPlayers(data["dwUserID"])) {
                for (var key in self.gameData.playerInfo) {
                    if (self.gameData.playerInfo[key]["dwUserID"] == data["dwUserID"]) {
                        self.gameData.playerInfo[key] = data;
                        break;
                    }
                }
            }
            else
            {
                self.pushInfoOfPlayers(data);
            }
            /*
             // 登录用户是自己更新全局用户信息
             cc.log("UserID = " + data["dwUserID"]);
             if (data["dwUserID"] == userInfo.globalUserdData["dwUserID"] && data["wChairID"] != -1)
             {
             if (sparrowDirector.isAutoReady && sparrowDirector.isPlayingGame == false)
             {
             //self.gameData.tableIndex = data["wTableID"];
             //self.gameLayer.deskLayer.deskNumber.setString(Number(data["wTableID"] + 1)+" 椅子:"+data["wChairID"]);
             //self.gameData.myChairIndex = data["wChairID"];
             sparrowDirector.isPlayingGame = true;
             sparrowDirector.gotoDeskScene();

             }

             if(sparrowDirector.isChangingRoom == true && sparrowDirector.isAutoReady == true)
             {
             //sparrowDirector.SendUserReady();
             }
             userInfo.globalUserdData["lUserScore"] = data["lScore"];
             //sparrowDirector.gameData.playerInfo = new Array();

             if (data["wTableID"] != INVALID_CHAIR_TABLE)
             {
             self.gameData.tableIndex = data["wTableID"];
             self.gameLayer.deskLayer.deskNumber.setString(Number(data["wTableID"] + 1)+" 椅子:"+data["wChairID"]);
             self.gameData.myChairIndex = data["wChairID"];
             sparrowDirector.setCenterDirection(data["wChairID"]);

             //请求除自己之外其他玩家信息
             var myIndex = data["wChairID"];
             var allIndex = [0, 1, 2];
             allIndex.splice(allIndex.indexOf(myIndex), 1);
             for (var key in allIndex)
             {
             sparrowDirector.SendUserChairInFoReq(self.gameData.tableIndex, allIndex[key]);
             }
             var myInfo = self.getInfoOfPlayers(data["dwUserID"]);
             myInfo["wTableID"] = data["wTableID"];
             myInfo["wChairID"] = data["wChairID"];
             myInfo["cbUserStatus"] = data["cbUserStatus"];
             self.SendGameOption();
             }
             }
             */
            cc.log("ChairID = " + data["wChairID"]);
            if (data["wChairID"] != -1) {
                cc.log("收到用户进入消息, 玩家昵称为:" + data["szNickName"]);
                sparrowDirector.setPlayerStatus(data);
            }
        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_HAPPY,KernelCurrent, RoomUserMainID, RoomUserMsg.SUB_GR_USER_ENTER, function (SerializeObject, wDataSize)   //与DOU_DI_ZHU逻辑相同
        {
            lm.log("欢乐斗地主 -> BaseDirector -> 用户进入 1 [" + KernelCurrent + " " + sparrowDirector._sortRoomFlag + " " + sparrowDirector.sortRoomUserInfoFlag);

            //比赛模式不进行下面的处理
            if(KernelCurrent == KernelMatch ) return;
            if(sparrowDirector._sortRoomFlag && sparrowDirector.sortRoomUserInfoFlag == false) //hanhu #排队房只有准备后才能接收用户消息 2015/12/14
            {
                return;
            }

            lm.log("欢乐斗地主 -> BaseDirector -> 用户进入 2");

            var data = {};
            data["type"] = "tagMobileUserInfoHead";

            //游戏ID
            data["dwGameID"] = DataUtil.ReadNumber(SerializeObject, 32);


            //用户ID
            data["dwUserID"] = DataUtil.ReadNumber(SerializeObject, 32);

            //头像索引
            data["wFaceID"] = DataUtil.ReadNumber(SerializeObject, 16);

            //自定标志
            data["dwCustomID"] = DataUtil.ReadNumber(SerializeObject, 32);


            //用户性别
            data["cbGender"] = DataUtil.ReadNumber(SerializeObject, 8);


            //会员等级
            data["cbMemberOrder"] = DataUtil.ReadNumber(SerializeObject, 8);


            //桌子索引
            data["wTableID"] = DataUtil.ReadNumber(SerializeObject, 16);


            //椅子索引
            data["wChairID"] = DataUtil.ReadNumber(SerializeObject, 16);


            //用户状态
            data["cbUserStatus"] = DataUtil.ReadNumber(SerializeObject, 8);


            //用户分数
            data["lScore"] = DataUtil.ReadNumber(SerializeObject, 64);


            //胜利盘数
            data["dwWinCount"] = DataUtil.ReadNumber(SerializeObject, 32);


            //失败盘数
            data["dwlostCount"] = DataUtil.ReadNumber(SerializeObject, 32);


            //和局盘数
            data["dwDrawCount"] = DataUtil.ReadNumber(SerializeObject, 32);


            //逃局盘数
            data["dwFleeCount"] = DataUtil.ReadNumber(SerializeObject, 32);


            //用户经验
            data["dwExperience"] = DataUtil.ReadNumber(SerializeObject, 32);

            //附加数据读取
            if ((wDataSize - MobileUserInfoHeadsize) > DataDescribeSize) {
                //数据大小
                var dataSize = DataUtil.ReadNumber(SerializeObject, 16);

                //数据描述
                var dataDescribe = DataUtil.ReadNumber(SerializeObject, 16);

                var wCurSize = wDataSize - MobileUserInfoHeadsize - DataDescribeSize;
                while (wCurSize > 0) {
                    switch (dataDescribe) {
                        case DT_GR_USERINFO.DTP_GR_NICK_NAME:
                        {
                            data["szNickName"] = ReadString(SerializeObject, dataSize / 2);
                        }
                            break;
                        case DT_GR_USERINFO.DTP_GR_GROUP_NAME:
                        {
                            data["szGroup"] = ReadString(SerializeObject, dataSize / 2);
                        }
                            break;
                        case DT_GR_USERINFO.DTP_GR_UNDER_WRITE:
                        {
                            data["szUnderWrite"] = ReadString(SerializeObject, dataSize / 2);
                        }
                            break;
                    }

                    wCurSize -= dataSize;
                    if (wCurSize > DataDescribeSize) {
                        //数据大小
                        dataSize = DataUtil.ReadNumber(SerializeObject, 16);

                        //数据描述
                        dataDescribe = DataUtil.ReadNumber(SerializeObject, 16);

                        wCurSize -= DataDescribeSize;
                    }
                }
            }
            cc.log("==================用户进入=========================");
            cc.log(JSON.stringify(data));
            //读取玩家信息
            if (self.getInfoOfPlayers(data["dwUserID"])) {
                for (var key in self.gameData.playerInfo) {
                    if (self.gameData.playerInfo[key]["dwUserID"] == data["dwUserID"]) {
                        self.gameData.playerInfo[key] = data;
                        break;
                    }
                }
            }
            else
            {
                self.pushInfoOfPlayers(data);
            }

            lm.log("77777777777777777777777777777  " + sparrowDirector.gameData.playerInfo.length);
            cc.log("ChairID = " + data["wChairID"]);
            if (data["wChairID"] != -1) {
                cc.log("收到用户进入消息, 玩家昵称为:" + data["szNickName"]);
                sparrowDirector.setPlayerStatus(data);
            }
        });

        //用户分数
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU,KernelCurrent, RoomUserMainID, RoomUserMsg.SUB_GR_USER_SCORE, function (SerializeObject, wDataSize) {

            var data = {};
            data["type"] = "CMD_GR_UserScore";

            //用户ID
            data["dwUserID"] = DataUtil.ReadNumber(SerializeObject, 32);

            //用户分数
            data["lScore"] = DataUtil.ReadNumber(SerializeObject, 64);

            //用户成绩
            data["lGrade"] = DataUtil.ReadNumber(SerializeObject, 64);

            //用户银行
            data["lInsure"] = DataUtil.ReadNumber(SerializeObject, 64);

            //胜利盘数
            data["dwWinCount"] = DataUtil.ReadNumber(SerializeObject, 32);

            //失败盘数
            data["dwlostCount"] = DataUtil.ReadNumber(SerializeObject, 32);

            //和局盘数
            data["dwDrawCount"] = DataUtil.ReadNumber(SerializeObject, 32);

            //逃局盘数
            data["dwFleeCount"] = DataUtil.ReadNumber(SerializeObject, 32);

            //用户奖牌
            data["dwUserMedal"] = DataUtil.ReadNumber(SerializeObject, 32);

            //用户经验
            data["dwExperience"] = DataUtil.ReadNumber(SerializeObject, 32);

            //用户魅力
            data["lLoveliness"] = DataUtil.ReadNumber(SerializeObject, 32);
            cc.log("==================用户分数=========================");
            cc.log(JSON.stringify(data));
            //lm.log("用户分数 = " + data["lScore"]);
            //lm.log("data[\"dwUserID\"] = " + data["dwUserID"] + " UserID = " + userInfo.globalUserdData["dwUserID"] + " KernelCurrent = " + KernelCurrent);
            if(data["dwUserID"] == userInfo.globalUserdData["dwUserID"] && KernelCurrent ==KernelCurrent) //hanhu #更新用户金币 2015/09/09
            {
                //lm.log("更新本机玩家金币");

                //var curGold = Number(data["lScore"]);
                //if(curGold > userInfo.globalUserdData["lUserScore"])
                //{
                //    playGolgAnimation();
                //}

                userInfo.UpdateUserScore(Number(data["lScore"]));
                if(layerManager.getRuningLayer())
                {
                    layerManager.getRuningLayer().UpdateUserInFo();
                }

                if ( sparrowDirector.gameLayer && sparrowDirector.gameLayer.bottomLayer && sparrowDirector.gameLayer.bottomLayer.playerGoldNum)
                {
                    var score = indentationGlod(Number(data["lScore"]));
                    sparrowDirector.gameLayer.bottomLayer.playerGoldNum.setString(score);
                }
            }
        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_LAI_ZI,KernelCurrent, RoomUserMainID, RoomUserMsg.SUB_GR_USER_SCORE, function (SerializeObject, wDataSize) {

            var data = {};
            data["type"] = "CMD_GR_UserScore";

            //用户ID
            data["dwUserID"] = DataUtil.ReadNumber(SerializeObject, 32);

            //用户分数
            data["lScore"] = DataUtil.ReadNumber(SerializeObject, 64);

            //用户成绩
            data["lGrade"] = DataUtil.ReadNumber(SerializeObject, 64);

            //用户银行
            data["lInsure"] = DataUtil.ReadNumber(SerializeObject, 64);

            //胜利盘数
            data["dwWinCount"] = DataUtil.ReadNumber(SerializeObject, 32);

            //失败盘数
            data["dwlostCount"] = DataUtil.ReadNumber(SerializeObject, 32);

            //和局盘数
            data["dwDrawCount"] = DataUtil.ReadNumber(SerializeObject, 32);

            //逃局盘数
            data["dwFleeCount"] = DataUtil.ReadNumber(SerializeObject, 32);

            //用户奖牌
            data["dwUserMedal"] = DataUtil.ReadNumber(SerializeObject, 32);

            //用户经验
            data["dwExperience"] = DataUtil.ReadNumber(SerializeObject, 32);

            //用户魅力
            data["lLoveliness"] = DataUtil.ReadNumber(SerializeObject, 32);
            cc.log("==================用户分数=========================");
            cc.log(JSON.stringify(data));
            //lm.log("用户分数 = " + data["lScore"]);
            //lm.log("data[\"dwUserID\"] = " + data["dwUserID"] + " UserID = " + userInfo.globalUserdData["dwUserID"] + " KernelCurrent = " + KernelCurrent);
            if(data["dwUserID"] == userInfo.globalUserdData["dwUserID"] && KernelCurrent ==KernelCurrent) //hanhu #更新用户金币 2015/09/09
            {
                //lm.log("更新本机玩家金币");
                //var curGold = Number(data["lScore"]);
                //if(curGold > userInfo.globalUserdData["lUserScore"])
                //{
                //    playGolgAnimation();
                //}
                userInfo.UpdateUserScore(Number(data["lScore"]));
                if(layerManager.getRuningLayer())
                {
                    layerManager.getRuningLayer().UpdateUserInFo();
                }

                if ( sparrowDirector.gameLayer && sparrowDirector.gameLayer.bottomLayer && sparrowDirector.gameLayer.bottomLayer.playerGoldNum)
                {
                    var score = indentationGlod(Number(data["lScore"]));
                    sparrowDirector.gameLayer.bottomLayer.playerGoldNum.setString(score);
                }
            }
        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_HAPPY,KernelCurrent, RoomUserMainID, RoomUserMsg.SUB_GR_USER_SCORE, function (SerializeObject, wDataSize)   //与DOU_DI_ZHU逻辑相同
        {
            lm.log("欢乐斗地主 -> BaseDirector -> 用户分数 ");

            var data = {};
            data["type"] = "CMD_GR_UserScore";

            //用户ID
            data["dwUserID"] = DataUtil.ReadNumber(SerializeObject, 32);

            //用户分数
            data["lScore"] = DataUtil.ReadNumber(SerializeObject, 64);

            //用户成绩
            data["lGrade"] = DataUtil.ReadNumber(SerializeObject, 64);

            //用户银行
            data["lInsure"] = DataUtil.ReadNumber(SerializeObject, 64);

            //胜利盘数
            data["dwWinCount"] = DataUtil.ReadNumber(SerializeObject, 32);

            //失败盘数
            data["dwlostCount"] = DataUtil.ReadNumber(SerializeObject, 32);

            //和局盘数
            data["dwDrawCount"] = DataUtil.ReadNumber(SerializeObject, 32);

            //逃局盘数
            data["dwFleeCount"] = DataUtil.ReadNumber(SerializeObject, 32);

            //用户奖牌
            data["dwUserMedal"] = DataUtil.ReadNumber(SerializeObject, 32);

            //用户经验
            data["dwExperience"] = DataUtil.ReadNumber(SerializeObject, 32);

            //用户魅力
            data["lLoveliness"] = DataUtil.ReadNumber(SerializeObject, 32);


            if(data["dwUserID"] == userInfo.globalUserdData["dwUserID"] && KernelCurrent ==KernelCurrent) //hanhu #更新用户金币 2015/09/09
            {
                //lm.log("更新本机玩家金币");
                //var curGold = Number(data["lScore"]);
                //if(curGold > userInfo.globalUserdData["lUserScore"])
                //{
                //    playGolgAnimation();
                //}
                userInfo.UpdateUserScore(Number(data["lScore"]));
                if(layerManager.getRuningLayer())
                {
                    layerManager.getRuningLayer().UpdateUserInFo();
                }

                if ( sparrowDirector.gameLayer && sparrowDirector.gameLayer.bottomLayer && sparrowDirector.gameLayer.bottomLayer.playerGoldNum)
                {
                    var score = indentationGlod(Number(data["lScore"]));
                    sparrowDirector.gameLayer.bottomLayer.playerGoldNum.setString(score);
                }
            }
        });

        //hanhu #请求站起成功处理 2015/08/28
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU,KernelCurrent, RoomUserMainID, RoomUserMsg.SUB_GR_ASK_STANDUP_SUCCESS, function(SerializeObject, wDataSize){

            //begin added by lizhongqiang 2015-09-11 16:00
            //更新通知
            self.updatenotify = false;
            self.foceline = false;
            // end added by lizhongqiang 2015-09-11

            var scene = new rootScene();

            var curLayer = new RoomUILayer();
            if(KernelCurrent == KernelCurrent)
            {
                //begin added by lizhongqiang 2015-09-11 16:50
                //关闭游戏连接
                if(self.isChangingRoom != true) //hanhu #非换桌状态时才关闭连接 2015/09/15
                {
                    CloseGameSocket(KernelCurrent);
                }

                // end added by lizhongqiang 2015-09-11

                curLayer.setTag(ClientModuleType.GoldField);
                layerManager.addLayerToParent(curLayer, scene);
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
            }
            else if(KernelCurrent == KernelMatch)
            {
                curLayer.setTag(ClientModuleType.MathField);
                layerManager.addLayerToParent(curLayer, scene);
                curLayer.refreshView(RoomType.ROOM_TYPE_MATCH);
            }

            DataUtil.SetGoToModule(ClientModuleType.Plaza);

            if(self.isChangingRoom == true) //hanhu #换桌不做场景切换 2015/09/23
            {
                var curLayer = new MainGameLayer();
                layerManager.addLayerToParent(curLayer, scene);
                cc.director.replaceScene(scene);
            }
            else
            {
                cc.director.replaceScene(scene);
            }

            if(sparrowDirector.gotoMatch == true)
            {
                //lm.log("请求站起成功，进入比赛");
                sparrowDirector.gotoMatch = false;
                matchMsgManager.ReadyToLoginMatchcServer(MatchAttendingInfo.MatchID, MatchAttendingInfo.RoundID);
            }
        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_LAI_ZI,KernelCurrent, RoomUserMainID, RoomUserMsg.SUB_GR_ASK_STANDUP_SUCCESS, function(SerializeObject, wDataSize){

            //begin added by lizhongqiang 2015-09-11 16:00
            //更新通知
            self.updatenotify = false;
            self.foceline = false;
            // end added by lizhongqiang 2015-09-11

            var scene = new rootScene();

            var curLayer = new RoomUILayer();
            if(KernelCurrent == KernelCurrent)
            {
                //begin added by lizhongqiang 2015-09-11 16:50
                //关闭游戏连接
                if(self.isChangingRoom != true) //hanhu #非换桌状态时才关闭连接 2015/09/15
                {
                    CloseGameSocket(KernelCurrent);
                }

                // end added by lizhongqiang 2015-09-11

                curLayer.setTag(ClientModuleType.GoldField);
                layerManager.addLayerToParent(curLayer, scene);
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
            }
            else if(KernelCurrent == KernelMatch)
            {
                curLayer.setTag(ClientModuleType.MathField);
                layerManager.addLayerToParent(curLayer, scene);
                curLayer.refreshView(RoomType.ROOM_TYPE_MATCH);
            }

            DataUtil.SetGoToModule(ClientModuleType.Plaza);

            if(self.isChangingRoom == true) //hanhu #换桌不做场景切换 2015/09/23
            {
                var curLayer = new MainGameLayer();
                layerManager.addLayerToParent(curLayer, scene);
                cc.director.replaceScene(scene);
            }
            else
            {
                cc.director.replaceScene(scene);
            }

            if(sparrowDirector.gotoMatch == true)
            {
                //lm.log("请求站起成功，进入比赛");
                sparrowDirector.gotoMatch = false;
                matchMsgManager.ReadyToLoginMatchcServer(MatchAttendingInfo.MatchID, MatchAttendingInfo.RoundID);
            }
        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_HAPPY,KernelCurrent, RoomUserMainID, RoomUserMsg.SUB_GR_ASK_STANDUP_SUCCESS, function(SerializeObject, wDataSize)   //与DOU_DI_ZHU逻辑相同
        {
            lm.log("欢乐斗地主 -> BaseDirector -> 请求站起成功 ");

            //begin added by lizhongqiang 2015-09-11 16:00
            //更新通知
            self.updatenotify = false;
            self.foceline = false;
            // end added by lizhongqiang 2015-09-11

            var scene = new rootScene();

            var curLayer = new RoomUILayer();
            if(KernelCurrent == KernelCurrent)
            {
                //begin added by lizhongqiang 2015-09-11 16:50
                //关闭游戏连接
                if(self.isChangingRoom != true) //hanhu #非换桌状态时才关闭连接 2015/09/15
                {
                    CloseGameSocket(KernelCurrent);
                }

                // end added by lizhongqiang 2015-09-11

                curLayer.setTag(ClientModuleType.GoldField);
                layerManager.addLayerToParent(curLayer, scene);
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
            }
            else if(KernelCurrent == KernelMatch)
            {
                curLayer.setTag(ClientModuleType.MathField);
                layerManager.addLayerToParent(curLayer, scene);
                curLayer.refreshView(RoomType.ROOM_TYPE_MATCH);
            }

            DataUtil.SetGoToModule(ClientModuleType.Plaza);

            if(self.isChangingRoom == true) //hanhu #换桌不做场景切换 2015/09/23
            {
                var curLayer = new MainGameLayer();
                layerManager.addLayerToParent(curLayer, scene);
                cc.director.replaceScene(scene);
            }
            else
            {
                cc.director.replaceScene(scene);
            }

            if(sparrowDirector.gotoMatch == true)
            {
                //lm.log("请求站起成功，进入比赛");
                sparrowDirector.gotoMatch = false;
                matchMsgManager.ReadyToLoginMatchcServer(MatchAttendingInfo.MatchID, MatchAttendingInfo.RoundID);
            }
        });

        //用户状态
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU,KernelCurrent, RoomUserMainID, RoomUserMsg.SUB_GR_USER_STATUS, function (SerializeObject, wDataSize) {

            lm.log("斗地主 -> BaseDirector -> 用户状态 1");
            var data = {};
            data["type"] = "CMD_GR_UserStatus";

            //用户ID
            data["dwUserID"] = DataUtil.ReadNumber(SerializeObject, 32);

            //桌子索引
            data["wTableID"] = DataUtil.ReadNumber(SerializeObject, 16);

            //椅子索引
            data["wChairID"] = DataUtil.ReadNumber(SerializeObject, 16);

            //用户状态
            data["cbUserStatus"] = DataUtil.ReadNumber(SerializeObject, 8);
            if(sparrowDirector._sortRoomFlag) //hanhu #比赛房间不允许有用户消息时拒绝接收 2015/12/14
            {
                if(sparrowDirector.sortRoomUserInfoFlag != true)
                {
                    return;
                }
            }
            lm.log("斗地主 -> BaseDirector -> 用户状态 2");
            lm.log(JSON.stringify(data));

            if ((userInfo.globalUserdData["dwUserID"] !== null) && data["dwUserID"] == userInfo.globalUserdData["dwUserID"])
            {
                if (data["wTableID"] != INVALID_CHAIR_TABLE)
                {
                    if (  KernelCurrent != KernelMatch && data["wTableID"] != INVALID_CHAIR_TABLE &&data["wChairID"] != INVALID_CHAIR_TABLE)
                    {
                        if (sparrowDirector.isAutoReady && sparrowDirector.isPlayingGame == false)
                        {
                            lm.log("斗地主 -> BaseDirector -> 用户状态 1111111111111111111111");
                            self.gameData.myChairIndex = data["wChairID"];
                            self.gameData.tableIndex = data["wTableID"];
                            sparrowDirector.isPlayingGame = true;
                            sparrowDirector.gotoDeskScene();
                        }

                        if (data["wTableID"] != INVALID_CHAIR_TABLE)
                        {
                            lm.log("斗地主 -> BaseDirector -> 用户状态 22222222222222222222");
                            self.gameData.tableIndex = data["wTableID"];
                            self.gameLayer.deskLayer.deskNumber.setString(Number(data["wTableID"] + 1));
                            self.gameData.myChairIndex = data["wChairID"];
                            sparrowDirector.setCenterDirection(data["wChairID"]);

                            //请求除自己之外其他玩家信息
                            var myIndex = data["wChairID"];
                            var allIndex = [0, 1, 2];
                            allIndex.splice(allIndex.indexOf(myIndex), 1);
                            for (var key in allIndex)
                            {
                                sparrowDirector.SendUserChairInFoReq(self.gameData.tableIndex, allIndex[key]);
                            }
                            var myInfo = self.getInfoOfPlayers(data["dwUserID"]);
                            myInfo["wTableID"] = data["wTableID"];
                            myInfo["wChairID"] = data["wChairID"];
                            myInfo["cbUserStatus"] = data["cbUserStatus"];
                            self.SendGameOption ();
                        }
                    }


                    self.gameData.tableIndex = data["wTableID"];
                    self.gameData.myChairIndex = data["wChairID"];

                    if (data["cbUserStatus"] == PlayerStatus.US_SIT)
                    {
                        sparrowDirector.SendUserChairInFoReq(self.gameData.tableIndex, 0);
                        sparrowDirector.SendUserChairInFoReq(self.gameData.tableIndex, 1);
                        sparrowDirector.SendUserChairInFoReq(self.gameData.tableIndex, 2);
                    }

                    var myInfo = self.getInfoOfPlayers(data["dwUserID"]);
                    if (myInfo)
                    {
                        myInfo["wTableID"] = data["wTableID"];
                        myInfo["wChairID"] = data["wChairID"];
                        myInfo["cbUserStatus"] = data["cbUserStatus"];
                    }
                    //lm.log("用户状态为：" + data["cbUserStatus"]);
                    if(sparrowDirector.OptionIsAlreadyRequest == false)
                    {
                        lm.log("请求场景消息, flag =" + self.OptionIsAlreadyRequest);
                        sparrowDirector.OptionIsAlreadyRequest = true;
                        self.SendGameOption();

                    }

                } else {
                    //sparrowDirector.optionSended = false;
                }
            } else
            {
                if (data["wTableID"] == self.gameData.tableIndex)
                    if (!self.getInfoOfPlayers(data["dwUserID"])) {
                        self.SendUserInfoReq(data["dwUserID"]);
                    }
                //self.addDataToFrameReceiveArray(data);
            }

            var tempUserInfo = sparrowDirector.getInfoOfPlayers(data["dwUserID"]);
            if (tempUserInfo) {
                tempUserInfo["cbUserStatus"] = data["cbUserStatus"];
            }


            var chairID = data["wChairID"];
            cc.log(data["cbUserStatus"]);
            //lm.log("ChairID = " + chairID);
            if (data["cbUserStatus"] == PlayerStatus.US_FREE)
            {
                // 2015-07-30 18：46 begin by lizhongqiang
                if (tempUserInfo)
                {
                    chairID = tempUserInfo["wChairID"];
                }
                //lm.log("起立用户为:" + data["dwUserID"]);
                // end
                if (data["dwUserID"] == userInfo.globalUserdData["dwUserID"])
                {
                    //cc.log("memememememmememeemmememmememmemme------------------------- "+JSON.stringify(data));
                    //cc.log("memememememmememeemmememmememmemme------------------------- "+JSON.stringify(userInfo.globalUserdData));
                    if (!sparrowDirector.isChangingRoom)
                    {
                        lm.log("用户起立，退出牌桌");
                        var scene = new rootScene();
                        var curLayer = new RoomUILayer();
                        if( KernelCurrent == KernelGame )
                        {
                            // begin added by lizhongqiang 2015-09-11 17:02
                            if ( self.foceline == true )
                            {
                                lm.log("setTimeout 1");
                                //延迟2秒执行切换场景
                                //setTimeout(function()
                                //{
                                    lm.log("setTimeout 2");
                                    self.updatenotify = false;
                                    self.foceline = false;
                                lm.log("KernelGame  16");
                                    CloseGameSocket(KernelGame);
                                    // end added by lizhongqiang
                                    curLayer.setTag(ClientModuleType.GoldField);
                                    layerManager.addLayerToParent(curLayer, scene);
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
                                //}, 10000);
                            }
                            else
                            {
                                self.updatenotify = false;
                                self.foceline = false;
                                lm.log("KernelGame  15");
                                CloseGameSocket(KernelGame);
                                // end added by lizhongqiang
                                curLayer.setTag(ClientModuleType.GoldField);
                                layerManager.addLayerToParent(curLayer, scene);
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
                            }
                        }
                        else if(KernelCurrent == KernelMatch)
                        {
                            curLayer.setTag(ClientModuleType.MathField);
                            layerManager.addLayerToParent(curLayer, scene);
                            curLayer.refreshView(RoomType.ROOM_TYPE_MATCH);
                        }

                        DataUtil.SetGoToModule(ClientModuleType.Plaza);

                        cc.director.replaceScene(scene);
                        //hanhu #检查是否需要前往比赛 2015/08/17
                        if(sparrowDirector.gotoMatch == true)
                        {
                            //lm.log("起立完成，进入比赛");
                            sparrowDirector.gotoMatch = false;
                            matchMsgManager.ReadyToLoginMatchcServer(MatchAttendingInfo.MatchID, MatchAttendingInfo.RoundID);
                        }

                    }

                }
            } else if (data["cbUserStatus"] == PlayerStatus.US_SIT) {
                //chairID = tempUserInfo["wChairID"];
                chairID = data["wChairID"];
                //sparrowDirector.SendUserReady();
            } else {
                chairID = data["wChairID"];
            }
            cc.log("chairID is " + chairID);
            if (tempUserInfo)
            {
                sparrowDirector.setPlayerStatus(data);
            }

            if (tempUserInfo) {
                tempUserInfo["wTableID"] = data["wTableID"];
                tempUserInfo["wChairID"] = data["wChairID"];
            }
        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_LAI_ZI,KernelCurrent, RoomUserMainID, RoomUserMsg.SUB_GR_USER_STATUS, function (SerializeObject, wDataSize) {
            if(sparrowDirector._sortRoomFlag) //hanhu #比赛房间不允许有用户消息时拒绝接收 2015/12/14
            {
                lm.log("--------------------xixixixi");
                if(sparrowDirector.sortRoomUserInfoFlag != true)
                {
                    lm.log("--------------------xixixixi_hahahhahahahah");
                    return;
                }
            }
            lm.log("--------------------xixixixi_hahahhahahahah_duduudududu");

            var data = {};
            data["type"] = "CMD_GR_UserStatus";

            //用户ID
            data["dwUserID"] = DataUtil.ReadNumber(SerializeObject, 32);

            //桌子索引
            data["wTableID"] = DataUtil.ReadNumber(SerializeObject, 16);

            //椅子索引
            data["wChairID"] = DataUtil.ReadNumber(SerializeObject, 16);

            //用户状态
            data["cbUserStatus"] = DataUtil.ReadNumber(SerializeObject, 8);

            cc.log("==================用户状态=========================");
            cc.log(JSON.stringify(data));

            if ((userInfo.globalUserdData["dwUserID"] !== null) && data["dwUserID"] == userInfo.globalUserdData["dwUserID"])
            {
                if (data["wTableID"] != INVALID_CHAIR_TABLE)
                {
                    if ( KernelCurrent != KernelMatch && data["wTableID"] != INVALID_CHAIR_TABLE && data["wChairID"] != INVALID_CHAIR_TABLE)
                    {
                        if (sparrowDirector.isAutoReady && sparrowDirector.isPlayingGame == false)
                        {
                            lm.log("----------------====用户状态========---- "+data["wTableID"]+"  "+ data["wChairID"] )
                            self.gameData.myChairIndex = data["wChairID"];
                            self.gameData.tableIndex = data["wTableID"];
                            sparrowDirector.isPlayingGame = true;
                            sparrowDirector.gotoDeskScene();
                        }

                        if (data["wTableID"] != INVALID_CHAIR_TABLE)
                        {
                            self.gameData.tableIndex = data["wTableID"];
                            self.gameLayer.deskLayer.deskNumber.setString(Number(data["wTableID"] + 1));
                            self.gameData.myChairIndex = data["wChairID"];
                            sparrowDirector.setCenterDirection(data["wChairID"]);

                            //请求除自己之外其他玩家信息
                            var myIndex = data["wChairID"];
                            var allIndex = [0, 1, 2];
                            allIndex.splice(allIndex.indexOf(myIndex), 1);
                            for (var key in allIndex)
                            {
                                sparrowDirector.SendUserChairInFoReq(self.gameData.tableIndex, allIndex[key]);
                            }
                            var myInfo = self.getInfoOfPlayers(data["dwUserID"]);
                            myInfo["wTableID"] = data["wTableID"];
                            myInfo["wChairID"] = data["wChairID"];
                            myInfo["cbUserStatus"] = data["cbUserStatus"];
                            self.SendGameOption();
                        }
                    }


                    self.gameData.tableIndex = data["wTableID"];
                    self.gameData.myChairIndex = data["wChairID"];

                    if (data["cbUserStatus"] == PlayerStatus.US_SIT)
                    {
                        sparrowDirector.SendUserChairInFoReq(self.gameData.tableIndex, 0);
                        sparrowDirector.SendUserChairInFoReq(self.gameData.tableIndex, 1);
                        sparrowDirector.SendUserChairInFoReq(self.gameData.tableIndex, 2);
                    }

                    var myInfo = self.getInfoOfPlayers(data["dwUserID"]);
                    if (myInfo)
                    {
                        myInfo["wTableID"] = data["wTableID"];
                        myInfo["wChairID"] = data["wChairID"];
                        myInfo["cbUserStatus"] = data["cbUserStatus"];
                    }
                    //lm.log("用户状态为：" + data["cbUserStatus"]);
                    if(sparrowDirector.OptionIsAlreadyRequest == false)
                    {
                        lm.log("请求场景消息, flag =" + self.OptionIsAlreadyRequest);
                        sparrowDirector.OptionIsAlreadyRequest = true;
                        self.SendGameOption();

                    }

                } else {
                    //sparrowDirector.optionSended = false;
                }
            } else
            {
                if (data["wTableID"] == self.gameData.tableIndex)
                    if (!self.getInfoOfPlayers(data["dwUserID"])) {
                        self.SendUserInfoReq(data["dwUserID"]);
                    }
                //self.addDataToFrameReceiveArray(data);
            }

            var tempUserInfo = sparrowDirector.getInfoOfPlayers(data["dwUserID"]);
            if (tempUserInfo) {
                tempUserInfo["cbUserStatus"] = data["cbUserStatus"];
            }


            var chairID = data["wChairID"];
            cc.log(data["cbUserStatus"]);
            //lm.log("ChairID = " + chairID);
            if (data["cbUserStatus"] == PlayerStatus.US_FREE)
            {
                // 2015-07-30 18：46 begin by lizhongqiang
                if (tempUserInfo)
                {
                    chairID = tempUserInfo["wChairID"];
                }
                //lm.log("起立用户为:" + data["dwUserID"]);
                // end
                if (data["dwUserID"] == userInfo.globalUserdData["dwUserID"])
                {
                    //cc.log("memememememmememeemmememmememmemme------------------------- "+JSON.stringify(data));
                    //cc.log("memememememmememeemmememmememmemme------------------------- "+JSON.stringify(userInfo.globalUserdData));
                    if (!sparrowDirector.isChangingRoom)
                    {
                        //lm.log("用户起立，退出牌桌");
                        var scene = new rootScene();
                        var curLayer = new RoomUILayer();
                        if( KernelCurrent == KernelGame )
                        {
                            // begin added by lizhongqiang 2015-09-11 17:02
                            if ( self.foceline == true )
                            {
                                lm.log("setTimeout 1");
                                //延迟2秒执行切换场景
                                //setTimeout(function()
                                //{
                                    lm.log("setTimeout 2");
                                    self.updatenotify = false;
                                    self.foceline = false;
                                    lm.log("KernelGame  14");
                                    CloseGameSocket(KernelGame);
                                    // end added by lizhongqiang
                                    curLayer.setTag(ClientModuleType.GoldField);
                                    layerManager.addLayerToParent(curLayer, scene);
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
                                //}, 10000);
                            }
                            else
                            {
                                self.updatenotify = false;
                                self.foceline = false;
                                lm.log("KernelGame  13");
                                CloseGameSocket(KernelGame);
                                // end added by lizhongqiang
                                curLayer.setTag(ClientModuleType.GoldField);
                                layerManager.addLayerToParent(curLayer, scene);
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
                            }
                        }
                        else if(KernelCurrent == KernelMatch)
                        {
                            curLayer.setTag(ClientModuleType.MathField);
                            layerManager.addLayerToParent(curLayer, scene);
                            curLayer.refreshView(RoomType.ROOM_TYPE_MATCH);
                        }

                        DataUtil.SetGoToModule(ClientModuleType.Plaza);

                        cc.director.replaceScene(scene);
                        //hanhu #检查是否需要前往比赛 2015/08/17
                        if(sparrowDirector.gotoMatch == true)
                        {
                            //lm.log("起立完成，进入比赛");
                            sparrowDirector.gotoMatch = false;
                            matchMsgManager.ReadyToLoginMatchcServer(MatchAttendingInfo.MatchID, MatchAttendingInfo.RoundID);
                        }

                    }

                }
            } else if (data["cbUserStatus"] == PlayerStatus.US_SIT) {
                //chairID = tempUserInfo["wChairID"];
                chairID = data["wChairID"];
                //sparrowDirector.SendUserReady();
            } else {
                chairID = data["wChairID"];
            }
            cc.log("chairID is " + chairID);
            if (tempUserInfo)
            {
                sparrowDirector.setPlayerStatus(data);
            }

            if (tempUserInfo) {
                tempUserInfo["wTableID"] = data["wTableID"];
                tempUserInfo["wChairID"] = data["wChairID"];
            }
        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_HAPPY,KernelCurrent, RoomUserMainID, RoomUserMsg.SUB_GR_USER_STATUS, function (SerializeObject, wDataSize)   //与DOU_DI_ZHU逻辑相同
        {
            lm.log("欢乐斗地主 -> BaseDirector -> 用户状态 1");

            var data = {};
            data["type"] = "CMD_GR_UserStatus";

            //用户ID
            data["dwUserID"] = DataUtil.ReadNumber(SerializeObject, 32);

            //桌子索引
            data["wTableID"] = DataUtil.ReadNumber(SerializeObject, 16);

            //椅子索引
            data["wChairID"] = DataUtil.ReadNumber(SerializeObject, 16);

            //用户状态
            data["cbUserStatus"] = DataUtil.ReadNumber(SerializeObject, 8);

            if(sparrowDirector._sortRoomFlag) //hanhu #比赛房间不允许有用户消息时拒绝接收 2015/12/14
            {
                if(sparrowDirector.sortRoomUserInfoFlag != true)
                {
                    return;
                }
            }

            lm.log("欢乐斗地主 -> BaseDirector -> 用户状态 2");
            cc.log(JSON.stringify(data));

            if ((userInfo.globalUserdData["dwUserID"] !== null) && data["dwUserID"] == userInfo.globalUserdData["dwUserID"])
            {
                if (data["wTableID"] != INVALID_CHAIR_TABLE)
                {
                    if ( KernelCurrent != KernelMatch && data["wTableID"] != INVALID_CHAIR_TABLE && data["wChairID"] != INVALID_CHAIR_TABLE)
                    {
                        if (sparrowDirector.isAutoReady && sparrowDirector.isPlayingGame == false)
                        {
                            lm.log("欢乐斗地主 -> BaseDirector -> 用户状态 1111111111111111111111");
                            self.gameData.myChairIndex = data["wChairID"];
                            self.gameData.tableIndex = data["wTableID"];
                            sparrowDirector.isPlayingGame = true;
                            sparrowDirector.gotoDeskScene();
                        }

                        if (data["wTableID"] != INVALID_CHAIR_TABLE)
                        {
                            lm.log("欢乐斗地主 -> BaseDirector -> 用户状态 22222222222222222222222");

                            self.gameData.tableIndex = data["wTableID"];
                            self.gameLayer.deskLayer.deskNumber.setString(Number(data["wTableID"] + 1));
                            self.gameData.myChairIndex = data["wChairID"];
                            sparrowDirector.setCenterDirection(data["wChairID"]);

                            //请求除自己之外其他玩家信息
                            var myIndex = data["wChairID"];
                            var allIndex = [0, 1, 2];
                            allIndex.splice(allIndex.indexOf(myIndex), 1);
                            for (var key in allIndex)
                            {
                                sparrowDirector.SendUserChairInFoReq(self.gameData.tableIndex, allIndex[key]);
                            }
                            var myInfo = self.getInfoOfPlayers(data["dwUserID"]);
                            myInfo["wTableID"] = data["wTableID"];
                            myInfo["wChairID"] = data["wChairID"];
                            myInfo["cbUserStatus"] = data["cbUserStatus"];
                            self.SendGameOption();
                        }
                    }


                    self.gameData.tableIndex = data["wTableID"];
                    self.gameData.myChairIndex = data["wChairID"];

                    if (data["cbUserStatus"] == PlayerStatus.US_SIT)
                    {
                        sparrowDirector.SendUserChairInFoReq(self.gameData.tableIndex, 0);
                        sparrowDirector.SendUserChairInFoReq(self.gameData.tableIndex, 1);
                        sparrowDirector.SendUserChairInFoReq(self.gameData.tableIndex, 2);
                    }

                    var myInfo = self.getInfoOfPlayers(data["dwUserID"]);
                    if (myInfo)
                    {
                        myInfo["wTableID"] = data["wTableID"];
                        myInfo["wChairID"] = data["wChairID"];
                        myInfo["cbUserStatus"] = data["cbUserStatus"];
                    }
                    //lm.log("用户状态为：" + data["cbUserStatus"]);
                    if(sparrowDirector.OptionIsAlreadyRequest == false)
                    {
                        lm.log("请求场景消息, flag =" + self.OptionIsAlreadyRequest);
                        sparrowDirector.OptionIsAlreadyRequest = true;
                        self.SendGameOption();

                    }

                } else {
                    //sparrowDirector.optionSended = false;
                }
            } else
            {
                if (data["wTableID"] == self.gameData.tableIndex)
                    if (!self.getInfoOfPlayers(data["dwUserID"])) {
                        self.SendUserInfoReq(data["dwUserID"]);
                    }
                //self.addDataToFrameReceiveArray(data);
            }

            var tempUserInfo = sparrowDirector.getInfoOfPlayers(data["dwUserID"]);
            if (tempUserInfo) {
                tempUserInfo["cbUserStatus"] = data["cbUserStatus"];
            }


            var chairID = data["wChairID"];
            cc.log(data["cbUserStatus"]);
            //lm.log("ChairID = " + chairID);
            if (data["cbUserStatus"] == PlayerStatus.US_FREE)
            {
                // 2015-07-30 18：46 begin by lizhongqiang
                if (tempUserInfo)
                {
                    chairID = tempUserInfo["wChairID"];
                }
                //lm.log("起立用户为:" + data["dwUserID"]);
                // end
                if (data["dwUserID"] == userInfo.globalUserdData["dwUserID"])
                {
                    //cc.log("memememememmememeemmememmememmemme------------------------- "+JSON.stringify(data));
                    //cc.log("memememememmememeemmememmememmemme------------------------- "+JSON.stringify(userInfo.globalUserdData));
                    if (!sparrowDirector.isChangingRoom)
                    {
                        //lm.log("用户起立，退出牌桌");
                        var scene = new rootScene();
                        var curLayer = new RoomUILayer();
                        if( KernelCurrent == KernelGame )
                        {
                            // begin added by lizhongqiang 2015-09-11 17:02
                            if ( self.foceline == true )
                            {
                                lm.log("setTimeout 1");
                                //延迟2秒执行切换场景
                                //setTimeout(function()
                                //{
                                lm.log("setTimeout 2");
                                self.updatenotify = false;
                                self.foceline = false;
                                lm.log("KernelGame  12");
                                CloseGameSocket(KernelGame);
                                // end added by lizhongqiang
                                curLayer.setTag(ClientModuleType.GoldField);
                                layerManager.addLayerToParent(curLayer, scene);
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
                                //}, 10000);
                            }
                            else
                            {
                                self.updatenotify = false;
                                self.foceline = false;
                                lm.log("KernelGame  11");
                                CloseGameSocket(KernelGame);
                                // end added by lizhongqiang
                                curLayer.setTag(ClientModuleType.GoldField);
                                layerManager.addLayerToParent(curLayer, scene);
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
                            }
                        }
                        else if(KernelCurrent == KernelMatch)
                        {
                            curLayer.setTag(ClientModuleType.MathField);
                            layerManager.addLayerToParent(curLayer, scene);
                            curLayer.refreshView(RoomType.ROOM_TYPE_MATCH);
                        }

                        DataUtil.SetGoToModule(ClientModuleType.Plaza);

                        cc.director.replaceScene(scene);
                        //hanhu #检查是否需要前往比赛 2015/08/17
                        if(sparrowDirector.gotoMatch == true)
                        {
                            //lm.log("起立完成，进入比赛");
                            sparrowDirector.gotoMatch = false;
                            matchMsgManager.ReadyToLoginMatchcServer(MatchAttendingInfo.MatchID, MatchAttendingInfo.RoundID);
                        }

                    }

                }
            } else if (data["cbUserStatus"] == PlayerStatus.US_SIT) {
                //chairID = tempUserInfo["wChairID"];
                chairID = data["wChairID"];
                //sparrowDirector.SendUserReady();
            } else {
                chairID = data["wChairID"];
            }
            cc.log("chairID is " + chairID);
            if (tempUserInfo)
            {
                sparrowDirector.setPlayerStatus(data);
            }

            if (tempUserInfo) {
                tempUserInfo["wTableID"] = data["wTableID"];
                tempUserInfo["wChairID"] = data["wChairID"];
            }
        });



        //请求失败
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU,KernelCurrent, RoomUserMainID, RoomUserMsg.SUB_GR_REQUEST_FAILURE, function (SerializeObject, wDataSize) {
            var data = {};
            data["type"] = "CMD_GR_RequestFaiure";

            //错误代码
            data["lErrCode"] = DataUtil.ReadNumber(SerializeObject, 32);

            //描述信息
            data["szDescribeString"] = ReadString(SerializeObject, 0);

            // 获取自己的信息
            var myInfo = self.getInfoOfPlayers(userInfo.globalUserdData["dwUserID"]);
            lm.log("请求失败 DOU_DI_ZHU isPlayingGame : [" +  myInfo + "][" + myInfo["cbUserStatus"] + "][" + sparrowDirector.sortRoomUserInfoFlag);

            if(myInfo == null ||  myInfo["cbUserStatus"] == PlayerStatus.US_FREE)
            {
                cc.log("close game socket");
                // added by lizhongqiang 2015-09-11 16:50
                //主动关闭游戏链接，在登录时需要RebuildSocket;
                self.updatenotify = false;
                self.foceline = false;
                // end added by lizhongqiang

                CloseGameSocket(KernelCurrent);
            }

            //游戏状态不显示提示，会自动弹出购买金币界面
            //if (sparrowDirector.isPlayingGame == true)
            //    return;
            lm.log("--------------------request failed003" + JSON.stringify(data));

            lm.log("请求失败2 isPlayingGame : " +  sparrowDirector.isPlayingGame );

            switch (Number(data["lErrCode"])) {
                case RoomLogonResultFailedEx.REQUEST_FAILURE_NOGOLD:
                case RoomLogonResultFailedEx.REQUEST_FAILURE_NOSCORE:
                {
                    lm.log("yyp 登录房间失败 41");
                    var pop = null;
                    if(UserInfo.dwReliefCountOfDayMax - UserInfo.dwReliefCountOfDay > 0)
                    {
                        pop = new ReliefPop(this);
                        pop.addToNode(cc.director.getRunningScene());

                    }
                    else
                    {
                        if(UserInfo.cbPay != 0) //非首冲
                        {
                            pop = new QuickPop(this, 1);
                            pop.addToNode(cc.director.getRunningScene());
                        }
                        else
                        {
                            pop = new FisrtPayPop(this);
                            pop.addToNode(cc.director.getRunningScene());
                        }
                    }
                    pop.setCallback(function(){},function()
                    {
                        var scene = new rootScene();
                        var curLayer = new RoomUILayer();
                        sparrowDirector.updatenotify = false;
                        sparrowDirector.foceline = false;
                        CloseGameSocket(KernelGame);
                        curLayer.setTag(ClientModuleType.GoldField);
                        layerManager.addLayerToParent(curLayer, scene);
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
                        cc.director.replaceScene(scene);
                    });



                    break;
                }
                //身上金币大于最大金币
                case RoomLogonResultFailedEx.REQUEST_FAILURE_MAXGOLD:
                {
                    lm.log("欢乐斗地主 游戏进行中 重连 2 1 " + sparrowDirector.currentRoomServerId + " " + sparrowDirector.tempRoomServerId);
                    var pop = new ConfirmPop (this, Poptype.ok, data["szDescribeString"]);//ok
                    pop.addToNode (cc.director.getRunningScene ());
                    pop.setokCallback (
                        function () {
                            sparrowDirector.gotoBestGoldRoomPlay01 ();
                        },
                        function () {
                        }
                    );
                    break;
                }
                default :
                {
                    var runningScene = cc.director.getRunningScene();
                    var oldlayer = runningScene.getChildByTag(TIP_TAG);
                    if(sparrowDirector.gameLayer && sparrowDirector.isPlayingGame)
                        oldlayer = sparrowDirector.gameLayer.getChildByTag(TIP_TAG);
                    if(oldlayer != null)
                        oldlayer.removeFromParent();

                    lm.log("yyp 登录房间失败 32");
                    var pop = new ConfirmPop(this, Poptype.ok, data["szDescribeString"]);//ok
                    pop.addToNode(cc.director.getRunningScene());
                    pop.hideCloseBtn();
                    pop.setokCallback (
                        function ()
                        {
                            if(sparrowDirector.isPlayingGame == true)
                            {
                                var scene = new rootScene();
                                var curLayer = new RoomUILayer();
                                curLayer.setTag(ClientModuleType.GoldField);
                                layerManager.addLayerToParent(curLayer, scene);
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
                                cc.director.replaceScene(scene);
                            }
                        },
                        function () {
                        }
                    );
                }
                    break;

            }

        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_LAI_ZI,KernelCurrent, RoomUserMainID, RoomUserMsg.SUB_GR_REQUEST_FAILURE, function (SerializeObject, wDataSize) {
            var data = {};
            data["type"] = "CMD_GR_RequestFaiure";

            //错误代码
            data["lErrCode"] = DataUtil.ReadNumber(SerializeObject, 32);

            //描述信息
            data["szDescribeString"] = ReadString(SerializeObject, 0);

            // 获取自己的信息
            var myInfo = self.getInfoOfPlayers(userInfo.globalUserdData["dwUserID"]);
            lm.log("请求失败1 isPlayingGame : " +  sparrowDirector.isPlayingGame );
            if(myInfo == null ||  myInfo["cbUserStatus"] == PlayerStatus.US_FREE)
            {
                cc.log("close game socket");
                // added by lizhongqiang 2015-09-11 16:50
                //主动关闭游戏链接，在登录时需要RebuildSocket;
                self.updatenotify = false;
                self.foceline = false;
                // end added by lizhongqiang

                CloseGameSocket(KernelCurrent);
            }

            //游戏状态不显示提示，会自动弹出购买金币界面
            //if (sparrowDirector.isPlayingGame == true)
            //    return;

            lm.log("请求失败2 isPlayingGame : " +  sparrowDirector.isPlayingGame );
            lm.log("--------------------request failed004" + JSON.stringify(data));

            switch (Number(data["lErrCode"])) {
                case RoomLogonResultFailedEx.REQUEST_FAILURE_NOGOLD:
                case RoomLogonResultFailedEx.REQUEST_FAILURE_NOSCORE:
                {
                    lm.log("yyp 登录房间失败 41");
                    var pop = null;
                    if(UserInfo.dwReliefCountOfDayMax - UserInfo.dwReliefCountOfDay > 0)
                    {
                        pop = new ReliefPop(this);
                        pop.addToNode(cc.director.getRunningScene());

                    }
                    else
                    {
                        if(UserInfo.cbPay != 0) //非首冲
                        {
                            pop = new QuickPop(this, 1);
                            pop.addToNode(cc.director.getRunningScene());
                        }
                        else
                        {
                            pop = new FisrtPayPop(this);
                            pop.addToNode(cc.director.getRunningScene());
                        }
                    }
                    pop.setCallback(function(){},function()
                    {
                        var scene = new rootScene();
                        var curLayer = new RoomUILayer();
                        sparrowDirector.updatenotify = false;
                        sparrowDirector.foceline = false;
                        CloseGameSocket(KernelGame);
                        curLayer.setTag(ClientModuleType.GoldField);
                        layerManager.addLayerToParent(curLayer, scene);
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
                        cc.director.replaceScene(scene);
                    });



                    break;
                }
                //身上金币大于最大金币
                case RoomLogonResultFailedEx.REQUEST_FAILURE_MAXGOLD:
                {
                    lm.log("欢乐斗地主 游戏进行中 重连 2 1 " + sparrowDirector.currentRoomServerId + " " + sparrowDirector.tempRoomServerId);
                    var pop = new ConfirmPop (this, Poptype.ok, data["szDescribeString"]);//ok
                    pop.addToNode (cc.director.getRunningScene ());
                    pop.setokCallback (
                        function () {
                            sparrowDirector.gotoBestGoldRoomPlay01 ();
                        },
                        function () {
                        }
                    );
                    break;
                }
                default :
                {
                    var runningScene = cc.director.getRunningScene();
                    var oldlayer = runningScene.getChildByTag(TIP_TAG);
                    if(sparrowDirector.gameLayer && sparrowDirector.isPlayingGame)
                        oldlayer = sparrowDirector.gameLayer.getChildByTag(TIP_TAG);
                    if(oldlayer != null)
                        oldlayer.removeFromParent();

                    lm.log("yyp 登录房间失败 42");
                    var pop = new ConfirmPop(this, Poptype.ok, data["szDescribeString"]);//ok
                    pop.addToNode(cc.director.getRunningScene());
                    pop.hideCloseBtn();
                    pop.setokCallback (
                        function ()
                        {
                            if(sparrowDirector.isPlayingGame == true)
                            {
                                var scene = new rootScene();
                                var curLayer = new RoomUILayer();
                                curLayer.setTag(ClientModuleType.GoldField);
                                layerManager.addLayerToParent(curLayer, scene);
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
                                cc.director.replaceScene(scene);
                            }
                        },
                        function () {
                        }
                    );

                }
            }
        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_HAPPY,KernelCurrent, RoomUserMainID, RoomUserMsg.SUB_GR_REQUEST_FAILURE, function (SerializeObject, wDataSize)    //与DOU_DI_ZHU逻辑相同
        {
            lm.log("欢乐斗地主 -> BaseDirector -> 请求失败 ");

            var data = {};
            data["type"] = "CMD_GR_RequestFaiure";

            //错误代码
            data["lErrCode"] = DataUtil.ReadNumber(SerializeObject, 32);

            //描述信息
            data["szDescribeString"] = ReadString(SerializeObject, 0);

            lm.log("欢乐斗地主 -> BaseDirector -> 请求失败 " + JSON.stringify(data));

            // 获取自己的信息
            var myInfo = self.getInfoOfPlayers(userInfo.globalUserdData["dwUserID"]);
            lm.log("请求失败1 isPlayingGame : " + sparrowDirector.isPlayingGame + " " +  myInfo + " " + myInfo["cbUserStatus"] + " " + sparrowDirector.sortRoomUserInfoFlag);
            if(myInfo == null ||  myInfo["cbUserStatus"] == PlayerStatus.US_FREE)
            {
                cc.log("close game socket");
                // added by lizhongqiang 2015-09-11 16:50
                //主动关闭游戏链接，在登录时需要RebuildSocket;
                self.updatenotify = false;
                self.foceline = false;
                // end added by lizhongqiang

                CloseGameSocket(KernelCurrent);
            }

            //游戏状态不显示提示，会自动弹出购买金币界面
            //if (sparrowDirector.isPlayingGame == true)
            //    return;

            lm.log("请求失败2 isPlayingGame : " +  sparrowDirector.isPlayingGame );

            switch (Number(data["lErrCode"])) {
                case RoomLogonResultFailedEx.REQUEST_FAILURE_NOGOLD:
                case RoomLogonResultFailedEx.REQUEST_FAILURE_NOSCORE:
                {
                    lm.log("yyp 登录房间失败 41");
                    var pop = null;
                    if(UserInfo.dwReliefCountOfDayMax - UserInfo.dwReliefCountOfDay > 0)
                    {
                        pop = new ReliefPop(this);
                        pop.addToNode(cc.director.getRunningScene());

                    }
                    else
                    {
                        if(UserInfo.cbPay != 0) //非首冲
                        {
                            pop = new QuickPop(this, 1);
                            pop.addToNode(cc.director.getRunningScene());
                        }
                        else
                        {
                            pop = new FisrtPayPop(this);
                            pop.addToNode(cc.director.getRunningScene());
                        }
                    }
                    pop.setCallback(function(){},function()
                    {
                        var scene = new rootScene();
                        var curLayer = new RoomUILayer();
                        sparrowDirector.updatenotify = false;
                        sparrowDirector.foceline = false;
                        CloseGameSocket(KernelGame);
                        curLayer.setTag(ClientModuleType.GoldField);
                        layerManager.addLayerToParent(curLayer, scene);
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
                        cc.director.replaceScene(scene);
                    });



                    break;
                }
                //身上金币大于最大金币
                case RoomLogonResultFailedEx.REQUEST_FAILURE_MAXGOLD:
                {
                    lm.log("欢乐斗地主 游戏进行中 重连 2 1 " + sparrowDirector.currentRoomServerId + " " + sparrowDirector.tempRoomServerId);
                    var pop = new ConfirmPop (this, Poptype.ok, data["szDescribeString"]);//ok
                    pop.addToNode (cc.director.getRunningScene ());
                    pop.setokCallback (
                        function () {
                            sparrowDirector.gotoBestGoldRoomPlay01 ();
                        },
                        function () {
                        }
                    );
                    break;
                }
                default :
                {
                    var runningScene = cc.director.getRunningScene();
                    var oldlayer = runningScene.getChildByTag(TIP_TAG);
                    if(sparrowDirector.gameLayer && sparrowDirector.isPlayingGame)
                        oldlayer = sparrowDirector.gameLayer.getChildByTag(TIP_TAG);
                    if(oldlayer != null)
                        oldlayer.removeFromParent();

                    lm.log("yyp 登录房间失败 42");
                    var pop = new ConfirmPop(this, Poptype.ok, data["szDescribeString"]);//ok
                    pop.addToNode(cc.director.getRunningScene());
                    pop.hideCloseBtn();
                    pop.setokCallback (
                        function ()
                        {
                            if(sparrowDirector.isPlayingGame == true)
                            {
                                var scene = new rootScene();
                                var curLayer = new RoomUILayer();
                                curLayer.setTag(ClientModuleType.GoldField);
                                layerManager.addLayerToParent(curLayer, scene);
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
                                cc.director.replaceScene(scene);
                            }
                        },
                        function () {
                        }
                    );

                }
            }
        });

        //请求站起失败
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU,KernelCurrent, RoomUserMainID, RoomUserMsg.SUB_GR_ASK_STANDUP_FAIL, function (SerializeObject, wDataSize) {
            var data = {};
            data["type"] = "CMD_GR_AskStabdupFail";
            //是否允许强退
            data["cbAllowQuit"] = DataUtil.ReadNumber(SerializeObject, 8);

            //描述信息
            data["szDescribeString"] = ReadString(SerializeObject, 32);

            lm.log("是否允许强退 = " + data["cbAllowQuit"] + " 描述信息=" + data["szDescribeString"]);
            if (data["cbAllowQuit"]) {
                //cc.log("data is  " + JSON.stringify(data));

                var pop = new ConfirmPop(this, Poptype.yesno,data["szDescribeString"]);//ok
                pop.addToNode(cc.director.getRunningScene());
                pop.setYesNoCallback(
                    function(){
                        sparrowDirector.SendUserStandup(self.gameData.tableIndex, self.gameData.myChairIndex);
                    }
                );

                //var confirm = new ConfirmNode(data["szDescribeString"], this, function () {
                //    sparrowDirector.SendUserStandup(self.gameData.tableIndex, self.gameData.myChairIndex);
                //});
                //confirm.setPosition(winSize.width / 2, winSize.height / 2);
                //layerManager.addLayerToParent(confirm, sparrowDirector.gameLayer)
                //cc.director.getRunningScene().addChild(confirm, 999);
            }
            else //hanhu #不允许强退弹出提示 2015/08/20
            {
                //检测是否前往比赛 2015/08/25
                if(sparrowDirector.gotoMatch == true)
                {
                    matchMsgManager.ExitMatchGame();
                    //lm.log("无法前往比赛，自动退赛");
                    sparrowDirector.gotoMatch = false;
                    matchMsgManager.ReadyToLoginMatchcServer(MatchAttendingInfo.MatchID, MatchAttendingInfo.RoundID);
                }
                else
                {
                    lm.log("hahahhahahhahhahah----------information= "+data["szDescribeString"]);
                    layerManager.PopTipLayer(new PopAutoTipsUILayer(data["szDescribeString"], 3),false);
                }

            }
            //self.addDataToFrameReceiveArray(data);

        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_LAI_ZI,KernelCurrent, RoomUserMainID, RoomUserMsg.SUB_GR_ASK_STANDUP_FAIL, function (SerializeObject, wDataSize) {
            var data = {};
            data["type"] = "CMD_GR_AskStabdupFail";
            //是否允许强退
            data["cbAllowQuit"] = DataUtil.ReadNumber(SerializeObject, 8);

            //描述信息
            data["szDescribeString"] = ReadString(SerializeObject, 32);

            lm.log("是否允许强退 = " + data["cbAllowQuit"] + " 描述信息=" + data["szDescribeString"]);
            if (data["cbAllowQuit"]) {
                //cc.log("data is  " + JSON.stringify(data));
                var pop = new ConfirmPop(this, Poptype.yesno,data["szDescribeString"]);//ok
                pop.addToNode(cc.director.getRunningScene());
                pop.setYesNoCallback(
                    function(){
                        sparrowDirector.SendUserStandup(self.gameData.tableIndex, self.gameData.myChairIndex);
                    }
                );

                //var confirm = new ConfirmNode(data["szDescribeString"], this, function () {
                //    sparrowDirector.SendUserStandup(self.gameData.tableIndex, self.gameData.myChairIndex);
                //});
                //confirm.setPosition(winSize.width / 2, winSize.height / 2);
                //layerManager.addLayerToParent(confirm, sparrowDirector.gameLayer)
                //cc.director.getRunningScene().addChild(confirm, 999);
            }
            else //hanhu #不允许强退弹出提示 2015/08/20
            {
                //检测是否前往比赛 2015/08/25
                if(sparrowDirector.gotoMatch == true)
                {
                    matchMsgManager.ExitMatchGame();
                    //lm.log("无法前往比赛，自动退赛");
                    sparrowDirector.gotoMatch = false;
                    matchMsgManager.ReadyToLoginMatchcServer(MatchAttendingInfo.MatchID, MatchAttendingInfo.RoundID);
                }
                else
                {
                    layerManager.PopTipLayer(new PopAutoTipsUILayer(data["szDescribeString"], 3),false);
                }

            }
            //self.addDataToFrameReceiveArray(data);

        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_HAPPY,KernelCurrent, RoomUserMainID, RoomUserMsg.SUB_GR_ASK_STANDUP_FAIL, function (SerializeObject, wDataSize)     //与DOU_DI_ZHU逻辑相同
        {
            lm.log("欢乐斗地主 -> BaseDirector -> 请求站起失败 ");

            var data = {};
            data["type"] = "CMD_GR_AskStabdupFail";
            //是否允许强退
            data["cbAllowQuit"] = DataUtil.ReadNumber(SerializeObject, 8);

            //描述信息
            data["szDescribeString"] = ReadString(SerializeObject, 32);

            lm.log("是否允许强退 = " + data["cbAllowQuit"] + " 描述信息=" + data["szDescribeString"]);
            if (data["cbAllowQuit"]) {
                //cc.log("data is  " + JSON.stringify(data));
                var pop = new ConfirmPop(this, Poptype.yesno,data["szDescribeString"]);//ok
                pop.addToNode(cc.director.getRunningScene());
                pop.setYesNoCallback(
                    function(){
                        sparrowDirector.SendUserStandup(self.gameData.tableIndex, self.gameData.myChairIndex);
                    }
                );
            }
            else //hanhu #不允许强退弹出提示 2015/08/20
            {
                //检测是否前往比赛 2015/08/25
                if(sparrowDirector.gotoMatch == true)
                {
                    matchMsgManager.ExitMatchGame();
                    //lm.log("无法前往比赛，自动退赛");
                    sparrowDirector.gotoMatch = false;
                    matchMsgManager.ReadyToLoginMatchcServer(MatchAttendingInfo.MatchID, MatchAttendingInfo.RoundID);
                }
                else
                {
                    layerManager.PopTipLayer(new PopAutoTipsUILayer(data["szDescribeString"], 3),false);
                }

            }
            //self.addDataToFrameReceiveArray(data);

        });

        //更新用户信息
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU,KernelCurrent, RoomUserMainID, RoomUserMsg.SUB_GR_USER_RELOADINFO, function (SerializeObject, wDataSize) {
            var data = {};
            data["type"] = "CMD_GR_UserReloadInFo";

            //用户ID
            data["dwUserID"] = DataUtil.ReadNumber(SerializeObject, 32);

            //头像索引
            data["wFaceID"] = DataUtil.ReadNumber(SerializeObject, 16);

            //自定标志
            data["dwCustomID"] = DataUtil.ReadNumber(SerializeObject, 32);

            data["dwPresent"] = DataUtil.ReadNumber(SerializeObject, 32);

            data["dwUserMedal"] = DataUtil.ReadNumber(SerializeObject, 32);

            data["dwExperience"] = DataUtil.ReadNumber(SerializeObject, 32);

            data["dwLoveLiness"] = DataUtil.ReadNumber(SerializeObject, 32);

            data["dwUserRight"] = DataUtil.ReadNumber(SerializeObject, 32);

            //会员等级
            data["cbMemberOrder"] = DataUtil.ReadNumber(SerializeObject, 8);

            data["cbCustomFaceVer"] = DataUtil.ReadNumber(SerializeObject, 8);

            data["cbGender"] = DataUtil.ReadNumber(SerializeObject, 8);

            data["szNickName"] = ReadString(SerializeObject, 32);
            cc.log("szNickName is " + data["szNickName"]);

            /// data["szUnderWrite"] = ReadString(SerializeObject, 32);
            cc.log("szUnderWrite is " + data["szUnderWrite"]);


            var getUserData = self.getInfoOfPlayers(data["dwUserID"]);
            if (!getUserData) {
                self.pushInfoOfPlayers(data);
            } else {
                //sparrowDirector.refreshInfoOfPlayer(getUserData, data);
            }

            //self.addDataToFrameReceiveArray(data);

        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_LAI_ZI,KernelCurrent, RoomUserMainID, RoomUserMsg.SUB_GR_USER_RELOADINFO, function (SerializeObject, wDataSize) {
            var data = {};
            data["type"] = "CMD_GR_UserReloadInFo";

            //用户ID
            data["dwUserID"] = DataUtil.ReadNumber(SerializeObject, 32);

            //头像索引
            data["wFaceID"] = DataUtil.ReadNumber(SerializeObject, 16);

            //自定标志
            data["dwCustomID"] = DataUtil.ReadNumber(SerializeObject, 32);

            data["dwPresent"] = DataUtil.ReadNumber(SerializeObject, 32);

            data["dwUserMedal"] = DataUtil.ReadNumber(SerializeObject, 32);

            data["dwExperience"] = DataUtil.ReadNumber(SerializeObject, 32);

            data["dwLoveLiness"] = DataUtil.ReadNumber(SerializeObject, 32);

            data["dwUserRight"] = DataUtil.ReadNumber(SerializeObject, 32);

            //会员等级
            data["cbMemberOrder"] = DataUtil.ReadNumber(SerializeObject, 8);

            data["cbCustomFaceVer"] = DataUtil.ReadNumber(SerializeObject, 8);

            data["cbGender"] = DataUtil.ReadNumber(SerializeObject, 8);

            data["szNickName"] = ReadString(SerializeObject, 32);
            cc.log("szNickName is " + data["szNickName"]);

            /// data["szUnderWrite"] = ReadString(SerializeObject, 32);
            cc.log("szUnderWrite is " + data["szUnderWrite"]);


            var getUserData = self.getInfoOfPlayers(data["dwUserID"]);
            if (!getUserData) {
                self.pushInfoOfPlayers(data);
            } else {
                //sparrowDirector.refreshInfoOfPlayer(getUserData, data);
            }

            //self.addDataToFrameReceiveArray(data);

        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_HAPPY,KernelCurrent, RoomUserMainID, RoomUserMsg.SUB_GR_USER_RELOADINFO, function (SerializeObject, wDataSize)      //与DOU_DI_ZHU逻辑相同
        {
            lm.log("欢乐斗地主 -> BaseDirector -> 更新用户信息 ");

            var data = {};
            data["type"] = "CMD_GR_UserReloadInFo";

            //用户ID
            data["dwUserID"] = DataUtil.ReadNumber(SerializeObject, 32);

            //头像索引
            data["wFaceID"] = DataUtil.ReadNumber(SerializeObject, 16);

            //自定标志
            data["dwCustomID"] = DataUtil.ReadNumber(SerializeObject, 32);

            data["dwPresent"] = DataUtil.ReadNumber(SerializeObject, 32);

            data["dwUserMedal"] = DataUtil.ReadNumber(SerializeObject, 32);

            data["dwExperience"] = DataUtil.ReadNumber(SerializeObject, 32);

            data["dwLoveLiness"] = DataUtil.ReadNumber(SerializeObject, 32);

            data["dwUserRight"] = DataUtil.ReadNumber(SerializeObject, 32);

            //会员等级
            data["cbMemberOrder"] = DataUtil.ReadNumber(SerializeObject, 8);

            data["cbCustomFaceVer"] = DataUtil.ReadNumber(SerializeObject, 8);

            data["cbGender"] = DataUtil.ReadNumber(SerializeObject, 8);

            data["szNickName"] = ReadString(SerializeObject, 32);
            cc.log("szNickName is " + data["szNickName"]);

            /// data["szUnderWrite"] = ReadString(SerializeObject, 32);
            cc.log("szUnderWrite is " + data["szUnderWrite"]);


            var getUserData = self.getInfoOfPlayers(data["dwUserID"]);
            if (!getUserData) {
                self.pushInfoOfPlayers(data);
            } else {
                //sparrowDirector.refreshInfoOfPlayer(getUserData, data);
            }

            //self.addDataToFrameReceiveArray(data);

        });

        /////////////////////////////////////////////////////////////////////////////////////////////////
        //房间状态消息处理

        //桌子信息
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU,KernelCurrent, RoomStatusMainID, RoomStatusMsg.SUB_GR_TABLE_INFO, function (SerializeObject, wDataSize) {

            var data = {};
            data["type"] = "CMD_GR_TableInfo";

            //桌子数目
            data["wTableCount"] = DataUtil.ReadNumber(SerializeObject, 16);

            data["TabStatusArray"] = [];
            for (var i = 0; i < 512; i++) {
                var object = {};

                //锁定标志
                object["cbTableLock"] = DataUtil.ReadNumber(SerializeObject, 8);

                //游戏标志
                object["cbPlayStatus"] = DataUtil.ReadNumber(SerializeObject, 8);

                //单元积分
                object["lCellScore"] = DataUtil.ReadNumber(SerializeObject, 32);

                //桌子信息
                object["szTableInFo"] = ReadString(SerializeObject, 32);

                data["TabStatusArray"].push(object);
            }

            //self.addDataToFrameReceiveArray(data);
        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_LAI_ZI,KernelCurrent, RoomStatusMainID, RoomStatusMsg.SUB_GR_TABLE_INFO, function (SerializeObject, wDataSize) {

            var data = {};
            data["type"] = "CMD_GR_TableInfo";

            //桌子数目
            data["wTableCount"] = DataUtil.ReadNumber(SerializeObject, 16);

            data["TabStatusArray"] = [];
            for (var i = 0; i < 512; i++) {
                var object = {};

                //锁定标志
                object["cbTableLock"] = DataUtil.ReadNumber(SerializeObject, 8);

                //游戏标志
                object["cbPlayStatus"] = DataUtil.ReadNumber(SerializeObject, 8);

                //单元积分
                object["lCellScore"] = DataUtil.ReadNumber(SerializeObject, 32);

                //桌子信息
                object["szTableInFo"] = ReadString(SerializeObject, 32);

                data["TabStatusArray"].push(object);
            }

            //self.addDataToFrameReceiveArray(data);
        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_HAPPY,KernelCurrent, RoomStatusMainID, RoomStatusMsg.SUB_GR_TABLE_INFO, function (SerializeObject, wDataSize)       //与DOU_DI_ZHU逻辑相同
        {
            lm.log("欢乐斗地主 -> BaseDirector -> 桌子信息 ");

            var data = {};
            data["type"] = "CMD_GR_TableInfo";

            //桌子数目
            data["wTableCount"] = DataUtil.ReadNumber(SerializeObject, 16);

            data["TabStatusArray"] = [];
            for (var i = 0; i < 512; i++) {
                var object = {};

                //锁定标志
                object["cbTableLock"] = DataUtil.ReadNumber(SerializeObject, 8);

                //游戏标志
                object["cbPlayStatus"] = DataUtil.ReadNumber(SerializeObject, 8);

                //单元积分
                object["lCellScore"] = DataUtil.ReadNumber(SerializeObject, 32);

                //桌子信息
                object["szTableInFo"] = ReadString(SerializeObject, 32);

                data["TabStatusArray"].push(object);
            }

            //self.addDataToFrameReceiveArray(data);
        });

        //桌子状态
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU,KernelCurrent, RoomStatusMainID, RoomStatusMsg.SUB_GR_TABLE_STATUS, function (SerializeObject, wDataSize) {

            lm.log("yyp 处理珠子信息1");
            /*
            var data = {};
            data["type"] = "CMD_GR_TableStatus";

            //桌子号码
            data["wTableID"] = DataUtil.ReadNumber(SerializeObject, 16);


            //锁定标志
            data["cbTableLock"] = DataUtil.ReadNumber(SerializeObject, 8);

            //游戏标志

            data["cbPlayStatus"] = DataUtil.ReadNumber(SerializeObject, 8);

            //单元积分
            data["lCellScore"] = DataUtil.ReadNumber(SerializeObject, 32);

            //桌子信息
            data["szTableInFo"] = ReadString(SerializeObject, 32);

            lm.log("yyp 处理珠子信息2");
*/
            //self.addDataToFrameReceiveArray(data);
        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_LAI_ZI,KernelCurrent, RoomStatusMainID, RoomStatusMsg.SUB_GR_TABLE_STATUS, function (SerializeObject, wDataSize) {

            var data = {};
            data["type"] = "CMD_GR_TableStatus";

            //桌子号码
            data["wTableID"] = DataUtil.ReadNumber(SerializeObject, 16);


            //锁定标志
            data["cbTableLock"] = DataUtil.ReadNumber(SerializeObject, 8);

            //游戏标志

            data["cbPlayStatus"] = DataUtil.ReadNumber(SerializeObject, 8);

            //单元积分
            data["lCellScore"] = DataUtil.ReadNumber(SerializeObject, 32);

            //桌子信息
            data["szTableInFo"] = ReadString(SerializeObject, 32);


            //self.addDataToFrameReceiveArray(data);
        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_HAPPY,KernelCurrent, RoomStatusMainID, RoomStatusMsg.SUB_GR_TABLE_STATUS, function (SerializeObject, wDataSize)  //与DOU_DI_ZHU逻辑相同
        {
            lm.log("欢乐斗地主 -> BaseDirector -> 桌子状态 ");

            var data = {};
            data["type"] = "CMD_GR_TableStatus";

            //桌子号码
            data["wTableID"] = DataUtil.ReadNumber(SerializeObject, 16);


            //锁定标志
            data["cbTableLock"] = DataUtil.ReadNumber(SerializeObject, 8);

            //游戏标志

            data["cbPlayStatus"] = DataUtil.ReadNumber(SerializeObject, 8);

            //单元积分
            data["lCellScore"] = DataUtil.ReadNumber(SerializeObject, 32);

            //桌子信息
            data["szTableInFo"] = ReadString(SerializeObject, 32);


            //self.addDataToFrameReceiveArray(data);
        });

        //begin modified by lizhongqiang 2015-10-21 14:40
        //丢包重发 - 重新登录
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU,KernelCurrent, RoomStatusMainID, RoomStatusMsg.SUB_GR_RESEND, function (SerializeObject, wDataSize) {

            self.updatenotify = false;
            self.foceline = false;
            plazaMsgManager.ReConnectCount = 0;
            self.ReConnectCount=0;

            var pop = new ConfirmPop(this, Poptype.yesno, "当前网络出现异常，是否重新登录游戏？");//ok
            pop.addToNode(cc.director.getRunningScene());
            pop.hideCloseBtn();
            pop.setYesNoCallback(
                function(){
                    //关闭连接
                    CloseGameSocket(KernelPlaza);
                    CloseGameSocket(KernelCurrent);

                    userInfo.ClearUserData();

                    cc.director.runScene(new rootUIScene());
                    matchMsgManager.ClearMatchData();
                    sparrowDirector.ClearAllData();
                },
                function(){
                    CloseGameSocket(KernelPlaza);
                    CloseGameSocket(KernelCurrent);
                    ExitGameEx();
                }
            );

            //layerManager.PopTipLayer(new PopTipsUILayer("确定", "取消", "当前网络出现异常，是否重新登录游戏？", function (id) {
            //    if (id == clickid.ok) {
            //
            //        //关闭连接
            //        CloseGameSocket(KernelPlaza);
            //        CloseGameSocket(KernelCurrent);
            //
            //        // 回到登陆界面
            //        userInfo.ClearUserData();
            //
            //        //hanuh #采用切换场景的方式回到登陆界面，同时清除游戏数据 2015/09/30
            //        cc.director.runScene(new rootUIScene());
            //        //var scene = new rootScene();
            //        //layerManager.addLayerToParent(new LoginUILayer(), scene);
            //        //cc.director.replaceScene(scene);
            //        //userInfo.ClearUserData();
            //        //hanhu #切换帐号时重置比赛数据 2015/09/24
            //        lm.log("游戏重新登录，清理数据");
            //        matchMsgManager.ClearMatchData();
            //        sparrowDirector.ClearAllData();
            //    } else {
            //
            //        CloseGameSocket(KernelPlaza);
            //        CloseGameSocket(KernelCurrent);
            //        ExitGameEx();
            //    }
            //
            //}, this), false);

        });
        //end modified
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_LAI_ZI,KernelCurrent, RoomStatusMainID, RoomStatusMsg.SUB_GR_RESEND, function (SerializeObject, wDataSize) {

            self.updatenotify = false;
            plazaMsgManager.ReConnectCount = 0;
            self.ReConnectCount=0;

            var pop = new ConfirmPop(this, Poptype.yesno, "当前网络出现异常，是否重新登录游戏？");//ok
            pop.addToNode(cc.director.getRunningScene());
            pop.hideCloseBtn();
            pop.setYesNoCallback(
                function(){
                    //关闭连接
                    CloseGameSocket(KernelPlaza);
                    CloseGameSocket(KernelCurrent);

                    userInfo.ClearUserData();

                    cc.director.runScene(new rootUIScene());
                    matchMsgManager.ClearMatchData();
                    sparrowDirector.ClearAllData();
                },
                function(){
                    CloseGameSocket(KernelPlaza);
                    CloseGameSocket(KernelCurrent);
                    ExitGameEx();
                }
            );
            //layerManager.PopTipLayer(new PopTipsUILayer("确定", "取消", "当前网络出现异常，是否重新登录游戏？", function (id) {
            //    if (id == clickid.ok) {
            //
            //        //关闭连接
            //        CloseGameSocket(KernelPlaza);
            //        CloseGameSocket(KernelCurrent);
            //
            //        // 回到登陆界面
            //        userInfo.ClearUserData();
            //
            //        //hanuh #采用切换场景的方式回到登陆界面，同时清除游戏数据 2015/09/30
            //        cc.director.runScene(new rootUIScene());
            //        //var scene = new rootScene();
            //        //layerManager.addLayerToParent(new LoginUILayer(), scene);
            //        //cc.director.replaceScene(scene);
            //        //userInfo.ClearUserData();
            //        //hanhu #切换帐号时重置比赛数据 2015/09/24
            //        lm.log("游戏重新登录，清理数据");
            //        matchMsgManager.ClearMatchData();
            //        sparrowDirector.ClearAllData();
            //    } else {
            //
            //        CloseGameSocket(KernelPlaza);
            //        CloseGameSocket(KernelCurrent);
            //        ExitGameEx();
            //    }
            //
            //}, this), false);

        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_HAPPY,KernelCurrent, RoomStatusMainID, RoomStatusMsg.SUB_GR_RESEND, function (SerializeObject, wDataSize)   //与DOU_DI_ZHU逻辑相同
        {
            lm.log("欢乐斗地主 -> BaseDirector -> 丢包重发 - 重新登录 ");

            self.updatenotify = false;
            self.foceline = false;
            plazaMsgManager.ReConnectCount = 0;
            self.ReConnectCount=0;

            var pop = new ConfirmPop(this, Poptype.yesno, "当前网络出现异常，是否重新登录游戏？");//ok
            pop.addToNode(cc.director.getRunningScene());
            pop.hideCloseBtn();
            pop.setYesNoCallback(
                function(){
                    //关闭连接
                    CloseGameSocket(KernelPlaza);
                    CloseGameSocket(KernelCurrent);

                    userInfo.ClearUserData();

                    cc.director.runScene(new rootUIScene());
                    matchMsgManager.ClearMatchData();
                    sparrowDirector.ClearAllData();
                },
                function(){
                    CloseGameSocket(KernelPlaza);
                    CloseGameSocket(KernelCurrent);
                    ExitGameEx();
                }
            );

        });


        /////////////////////////////////////////////////////////////////////////////////////////////////
        //框架消息处理

        //游戏状态
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU,KernelCurrent, FrameMainID, FrameMsg.SUB_GF_GAME_STATUS, function (SerializeObject, wDataSize) {
            //游戏状态
            self.setGameData("cbGameStatus", DataUtil.ReadNumber(SerializeObject, 8));

            //旁观标志
            self.setGameData("cbAllowLookon", DataUtil.ReadNumber(SerializeObject, 8));

        });

        //旁观消息
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU,KernelCurrent, FrameMainID, FrameMsg.SUB_GF_LOOKON_STATUS, function (SerializeObject, wDataSize) {
            //旁观标志
            self.setGameData("cbAllowLookon", DataUtil.ReadNumber(SerializeObject, 8));

        });
//		游戏状态
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_LAI_ZI,KernelCurrent, FrameMainID, FrameMsg.SUB_GF_GAME_STATUS, function (SerializeObject, wDataSize) {
            //游戏状态
            self.setGameData("cbGameStatus", DataUtil.ReadNumber(SerializeObject, 8));

            //旁观标志
            self.setGameData("cbAllowLookon", DataUtil.ReadNumber(SerializeObject, 8));

        });

        //旁观消息
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_LAI_ZI,KernelCurrent, FrameMainID, FrameMsg.SUB_GF_LOOKON_STATUS, function (SerializeObject, wDataSize) {
            //旁观标志
            self.setGameData("cbAllowLookon", DataUtil.ReadNumber(SerializeObject, 8));

        });

        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_HAPPY,KernelCurrent, FrameMainID, FrameMsg.SUB_GF_GAME_STATUS, function (SerializeObject, wDataSize)    //与DOU_DI_ZHU逻辑相同
        {
            lm.log("欢乐斗地主 -> BaseDirector -> 游戏状态 ");
            //游戏状态
            self.setGameData("cbGameStatus", DataUtil.ReadNumber(SerializeObject, 8));

            //旁观标志
            self.setGameData("cbAllowLookon", DataUtil.ReadNumber(SerializeObject, 8));

        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_HAPPY,KernelCurrent, FrameMainID, FrameMsg.SUB_GF_LOOKON_STATUS, function (SerializeObject, wDataSize)     //与DOU_DI_ZHU逻辑相同
        {
             lm.log("欢乐斗地主 -> BaseDirector -> 旁观消息 ");
            //旁观标志
            self.setGameData("cbAllowLookon", DataUtil.ReadNumber(SerializeObject, 8));

        });

        //系统消息
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU,KernelCurrent, FrameMainID, FrameMsg.SUB_GF_SYSTEM_MESSAGE, function (SerializeObject, wDataSize) {

            var data = {};
            data["type"] = "CMD_CM_SystemMessage";

            //消息类型
            data["wType"] = DataUtil.ReadNumber(SerializeObject, 16);

            //消息长度
            data["wLength"] = DataUtil.ReadNumber(SerializeObject, 16);

            //消息内容
            data["szString"] = ReadString(SerializeObject, 0);

            layerManager.PopTipLayer(new PopAutoTipsUILayer(data["szString"], DefultPopTipsTime),false);
        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_LAI_ZI,KernelCurrent, FrameMainID, FrameMsg.SUB_GF_SYSTEM_MESSAGE, function (SerializeObject, wDataSize) {

            var data = {};
            data["type"] = "CMD_CM_SystemMessage";

            //消息类型
            data["wType"] = DataUtil.ReadNumber(SerializeObject, 16);

            //消息长度
            data["wLength"] = DataUtil.ReadNumber(SerializeObject, 16);

            //消息内容
            data["szString"] = ReadString(SerializeObject, 0);

            layerManager.PopTipLayer(new PopAutoTipsUILayer(data["szString"], DefultPopTipsTime),false);
        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_HAPPY,KernelCurrent, FrameMainID, FrameMsg.SUB_GF_SYSTEM_MESSAGE, function (SerializeObject, wDataSize)     //与DOU_DI_ZHU逻辑相同
        {
            lm.log("欢乐斗地主 -> BaseDirector -> 系统消息 ");

            var data = {};
            data["type"] = "CMD_CM_SystemMessage";

            //消息类型
            data["wType"] = DataUtil.ReadNumber(SerializeObject, 16);

            //消息长度
            data["wLength"] = DataUtil.ReadNumber(SerializeObject, 16);

            //消息内容
            data["szString"] = ReadString(SerializeObject, 0);

            layerManager.PopTipLayer(new PopAutoTipsUILayer(data["szString"], DefultPopTipsTime),false);
        });

        //系统公告消息
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU,KernelCurrent, FrameMainID, FrameMsg.SUB_GF_SYSTEM_NOTICE, function (SerializeObject, wDataSize) {

            var data = {};
            data["type"] = "CMD_GF_SystemNotice";

            //消息内容
            //lm.log("数据长度为：" + wDataSize);
            data["szNotice"] = ReadString(SerializeObject, wDataSize / 2);
            var str = data["szNotice"];

            lm.log("收到系统公告,内容为：" + data["szNotice"]);
            //self.SetNoticeInFo(data["szNotice"]);
            NoticeMessageArray.push(data["szNotice"]);
        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_LAI_ZI,KernelCurrent, FrameMainID, FrameMsg.SUB_GF_SYSTEM_NOTICE, function (SerializeObject, wDataSize) {

            var data = {};
            data["type"] = "CMD_GF_SystemNotice";

            //消息内容
            //lm.log("数据长度为：" + wDataSize);
            data["szNotice"] = ReadString(SerializeObject, wDataSize / 2);
            var str = data["szNotice"];

            lm.log("收到系统公告,内容为：" + data["szNotice"]);
            //self.SetNoticeInFo(data["szNotice"]);
            NoticeMessageArray.push(data["szNotice"]);
        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_HAPPY,KernelCurrent, FrameMainID, FrameMsg.SUB_GF_SYSTEM_NOTICE, function (SerializeObject, wDataSize)    //与DOU_DI_ZHU逻辑相同
        {
            lm.log("欢乐斗地主 -> BaseDirector -> 系统公告消息 ");

            var data = {};
            data["type"] = "CMD_GF_SystemNotice";

            //消息内容
            //lm.log("数据长度为：" + wDataSize);
            data["szNotice"] = ReadString(SerializeObject, wDataSize / 2);
            var str = data["szNotice"];

            lm.log("收到系统公告,内容为：" + data["szNotice"]);
            //self.SetNoticeInFo(data["szNotice"]);
            NoticeMessageArray.push(data["szNotice"]);
        });

        //用户聊天
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU,KernelCurrent, FrameMainID, FrameMsg.SUB_GF_USER_CHAT, function (SerializeObject, wDataSize) {

            var data = {};
            data["type"] = "CMD_GF_S_UserChat";

            //信息长度
            data["wChatLength"] = DataUtil.ReadNumber(SerializeObject, 16);

            //颜色信息
            data["dwChatColor"] = DataUtil.ReadNumber(SerializeObject, 32);

            //发送用户
            data["dwSendUserID"] = DataUtil.ReadNumber(SerializeObject, 32);
            //目标用户
            data["dwTargetUserID"] = DataUtil.ReadNumber(SerializeObject, 32);

            //聊天信息
            data["szChatString"] = ReadString(SerializeObject, data["wChatLength"]);

            sparrowDirector.playerTalk(false, sparrowDirector.getUserDirection(sparrowDirector.getChairByUserID(data["dwSendUserID"])), DataUtil.getRGBA(data["dwChatColor"]), data["szChatString"]);

            //self.addDataToFrameReceiveArray(data);
        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_LAI_ZI,KernelCurrent, FrameMainID, FrameMsg.SUB_GF_USER_CHAT, function (SerializeObject, wDataSize) {

            var data = {};
            data["type"] = "CMD_GF_S_UserChat";

            //信息长度
            data["wChatLength"] = DataUtil.ReadNumber(SerializeObject, 16);

            //颜色信息
            data["dwChatColor"] = DataUtil.ReadNumber(SerializeObject, 32);

            //发送用户
            data["dwSendUserID"] = DataUtil.ReadNumber(SerializeObject, 32);
            //目标用户
            data["dwTargetUserID"] = DataUtil.ReadNumber(SerializeObject, 32);

            //聊天信息
            data["szChatString"] = ReadString(SerializeObject, data["wChatLength"]);

            sparrowDirector.playerTalk(false, sparrowDirector.getUserDirection(sparrowDirector.getChairByUserID(data["dwSendUserID"])), DataUtil.getRGBA(data["dwChatColor"]), data["szChatString"]);

            //self.addDataToFrameReceiveArray(data);
        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_HAPPY,KernelCurrent, FrameMainID, FrameMsg.SUB_GF_USER_CHAT, function (SerializeObject, wDataSize)     //与DOU_DI_ZHU逻辑相同
        {
            lm.log("欢乐斗地主 -> BaseDirector -> 用户聊天 ");

            var data = {};
            data["type"] = "CMD_GF_S_UserChat";

            //信息长度
            data["wChatLength"] = DataUtil.ReadNumber(SerializeObject, 16);

            //颜色信息
            data["dwChatColor"] = DataUtil.ReadNumber(SerializeObject, 32);

            //发送用户
            data["dwSendUserID"] = DataUtil.ReadNumber(SerializeObject, 32);
            //目标用户
            data["dwTargetUserID"] = DataUtil.ReadNumber(SerializeObject, 32);

            //聊天信息
            data["szChatString"] = ReadString(SerializeObject, data["wChatLength"]);

            sparrowDirector.playerTalk(false, sparrowDirector.getUserDirection(sparrowDirector.getChairByUserID(data["dwSendUserID"])), DataUtil.getRGBA(data["dwChatColor"]), data["szChatString"]);

            //self.addDataToFrameReceiveArray(data);
        });

        //用户表情
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU,KernelCurrent, FrameMainID, FrameMsg.SUB_GF_USER_EXPRESSION, function (SerializeObject, wDataSize) {

            var data = {};
            data["type"] = "CMD_GF_S_UserExpression";

            //信息长度
            data["wItemIndex"] = DataUtil.ReadNumber(SerializeObject, 16);

            //发送用户
            data["dwSendUserID"] = DataUtil.ReadNumber(SerializeObject, 32);

            //目标用户
            data["dwTargetUserID"] = DataUtil.ReadNumber(SerializeObject, 32);


            sparrowDirector.playerTalk(true, sparrowDirector.getUserDirection(sparrowDirector.getChairByUserID(data["dwSendUserID"])), null, data["wItemIndex"]);

            //self.addDataToFrameReceiveArray(data);
        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_LAI_ZI,KernelCurrent, FrameMainID, FrameMsg.SUB_GF_USER_EXPRESSION, function (SerializeObject, wDataSize) {

            var data = {};
            data["type"] = "CMD_GF_S_UserExpression";

            //信息长度
            data["wItemIndex"] = DataUtil.ReadNumber(SerializeObject, 16);

            //发送用户
            data["dwSendUserID"] = DataUtil.ReadNumber(SerializeObject, 32);

            //目标用户
            data["dwTargetUserID"] = DataUtil.ReadNumber(SerializeObject, 32);


            sparrowDirector.playerTalk(true, sparrowDirector.getUserDirection(sparrowDirector.getChairByUserID(data["dwSendUserID"])), null, data["wItemIndex"]);

            //self.addDataToFrameReceiveArray(data);
        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_HAPPY,KernelCurrent, FrameMainID, FrameMsg.SUB_GF_USER_EXPRESSION, function (SerializeObject, wDataSize)     //与DOU_DI_ZHU逻辑相同
        {
            lm.log("欢乐斗地主 -> BaseDirector -> 用户表情 ");

            var data = {};
            data["type"] = "CMD_GF_S_UserExpression";

            //信息长度
            data["wItemIndex"] = DataUtil.ReadNumber(SerializeObject, 16);

            //发送用户
            data["dwSendUserID"] = DataUtil.ReadNumber(SerializeObject, 32);

            //目标用户
            data["dwTargetUserID"] = DataUtil.ReadNumber(SerializeObject, 32);


            sparrowDirector.playerTalk(true, sparrowDirector.getUserDirection(sparrowDirector.getChairByUserID(data["dwSendUserID"])), null, data["wItemIndex"]);

            //self.addDataToFrameReceiveArray(data);
        });

        //使用喇叭失败
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_LAI_ZI,KernelCurrent, RoomUserMainID, RoomUserMsg.SUB_GR_USER_CHAT_BORDER_ERROR, function(data, size){
            var Area = DataUtil.ReadNumber(data, 16);
            var ErrCode = DataUtil.ReadNumber(data, 32);
            var Msg = ReadString(data);
            lm.log("labaliaotiao==============shibai_laizi "+Msg);
            layerManager.PopTipLayer(new PopAutoTipsUILayer(Msg, 5),true);
        });
        //喇叭聊天内容
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_LAI_ZI,KernelCurrent, RoomUserMainID, RoomUserMsg.SUB_GR_USER_CHAT_BORDER, function(data, size){
            var ItemIdex = DataUtil.ReadNumber(data, 16);
            var UserID = DataUtil.ReadNumber(data, 32);
            var Color = DataUtil.ReadNumber(data, 32);
            var NickName = ReadString(data, 32);
            var Msg = ReadString(data);
            lm.log("labaliaotiao==============laizi "+"玩家 " + NickName + " 说：" + Msg);
            NoticeMessageArray.push("玩家 " + NickName + " 说：" + Msg);
        });

        //使用喇叭失败
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU,KernelCurrent, RoomUserMainID, RoomUserMsg.SUB_GR_USER_CHAT_BORDER_ERROR, function(data, size){
            var Area = DataUtil.ReadNumber(data, 16);
            var ErrCode = DataUtil.ReadNumber(data, 32);
            var Msg = ReadString(data);
            lm.log("labaliaotiao==============shibai "+Msg);

            layerManager.PopTipLayer(new PopAutoTipsUILayer(Msg, 5),true);
        });
        //喇叭聊天内容
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU,KernelCurrent, RoomUserMainID, RoomUserMsg.SUB_GR_USER_CHAT_BORDER, function(data, size){
            var ItemIdex = DataUtil.ReadNumber(data, 16);
            var UserID = DataUtil.ReadNumber(data, 32);
            var Color = DataUtil.ReadNumber(data, 32);
            var NickName = ReadString(data, 32);
            var Msg = ReadString(data);
            lm.log("labaliaotiao============== "+"玩家 " + NickName + " 说：" + Msg);
            NoticeMessageArray.push("玩家 " + NickName + " 说：" + Msg);
        });

        //使用喇叭失败
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_HAPPY,KernelCurrent, RoomUserMainID, RoomUserMsg.SUB_GR_USER_CHAT_BORDER_ERROR, function(data, size)    //与DOU_DI_ZHU逻辑相同
        {
            lm.log("欢乐斗地主 -> BaseDirector -> 使用喇叭失败 ");

            var Area = DataUtil.ReadNumber(data, 16);
            var ErrCode = DataUtil.ReadNumber(data, 32);
            var Msg = ReadString(data);
            lm.log("labaliaotiao==============shibai "+Msg);

            layerManager.PopTipLayer(new PopAutoTipsUILayer(Msg, 5),true);
        });
        //喇叭聊天内容
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_HAPPY,KernelCurrent, RoomUserMainID, RoomUserMsg.SUB_GR_USER_CHAT_BORDER, function(data, size)   //与DOU_DI_ZHU逻辑相同
        {
            lm.log("欢乐斗地主 -> BaseDirector -> 喇叭聊天内容 ");

            var ItemIdex = DataUtil.ReadNumber(data, 16);
            var UserID = DataUtil.ReadNumber(data, 32);
            var Color = DataUtil.ReadNumber(data, 32);
            var NickName = ReadString(data, 32);
            var Msg = ReadString(data);
            lm.log("labaliaotiao============== "+"玩家 " + NickName + " 说：" + Msg);
            NoticeMessageArray.push("玩家 " + NickName + " 说：" + Msg);
        });

        //游戏场景
        //connectUtil.dataListenerManualEx(200,KernelCurrent, FrameMainID, FrameMsg.SUB_GF_GAME_SCENE, this.onGameScene);
        //hanhu #将场景消息加入消息队列 2015/10/19
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU,KernelCurrent, FrameMainID, FrameMsg.SUB_GF_GAME_SCENE, function(SerializeObject, wDataSzie){
            cc.log("---------------------------收到斗地主场景消息");
            //根据场景消息类型进行数据读取
            var gamestatus = sparrowDirector.getGameData("cbGameStatus");
            sparrowDirector.handleDoudizu(gamestatus, SerializeObject, wDataSzie);

        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_LAI_ZI,KernelCurrent, FrameMainID, FrameMsg.SUB_GF_GAME_SCENE, function(SerializeObject, wDataSzie){
            cc.log("---------------------------收到癞子斗地主场景消息");
            //根据场景消息类型进行数据读取
            var gamestatus = sparrowDirector.getGameData("cbGameStatus");
            sparrowDirector.handleLizidoudiz(gamestatus, SerializeObject, wDataSzie);

        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_HAPPY,KernelCurrent, FrameMainID, FrameMsg.SUB_GF_GAME_SCENE, function(SerializeObject, wDataSzie)  //与DOU_DI_ZHU逻辑相同
        {
            lm.log("欢乐斗地主 -> BaseDirector -> 收到游戏场景消息 ");

            //根据场景消息类型进行数据读取
            var gamestatus = sparrowDirector.getGameData("cbGameStatus");
            sparrowDirector.handleDoudizuHappy(gamestatus, SerializeObject, wDataSzie);

        });
        //connectUtil.dataListenerManualEx(DragonData.GAMEID,KernelCurrent, FrameMainID, FrameMsg.SUB_GF_GAME_SCENE, function(SerializeObject, wDataSzie){
        //    cc.log("---------------------------收到龙虎斗场景消息");
        //    //根据场景消息类型进行数据读取
        //    var gamestatus = sparrowDirector.getGameData("cbGameStatus");
        //    DragonHandleSceneInfo(sparrowDirector,gamestatus, SerializeObject, wDataSzie);
        //
        //});

        //随机任务进度
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU,KernelCurrent, FrameMainID, FrameBoxMsg.SUB_GF_CHESTCOUNT, function (SerializeObject, wDataSize) {
            lm.log("经典 -> BaseDirector -> 随机任务进度 " + Game_ID);
            var currentValue = DataUtil.ReadNumber(SerializeObject,16);
            var maxValue = DataUtil.ReadNumber(SerializeObject, 16);
            lm.log("diyduzu宝箱进度为：" + currentValue + " / " + maxValue);
            RandomTaskAttending.cur = currentValue;
            RandomTaskAttending.total = maxValue;
            if(sparrowDirector.isPlayingGame && sparrowDirector.gameLayer)
            {
                sparrowDirector.gameLayer.showItemBox();
            }
        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_LAI_ZI,KernelCurrent, FrameMainID, FrameBoxMsg.SUB_GF_CHESTCOUNT, function (SerializeObject, wDataSize) {
            lm.log("癞子 -> BaseDirector -> 随机任务进度 " + Game_ID);
            var currentValue = DataUtil.ReadNumber(SerializeObject,16);
            var maxValue = DataUtil.ReadNumber(SerializeObject, 16);
            lm.log("宝箱进度为：" + currentValue + " / " + maxValue);
            RandomTaskAttending.cur = currentValue;
            RandomTaskAttending.total = maxValue;
            if(sparrowDirector.isPlayingGame && sparrowDirector.gameLayer)
            {
                sparrowDirector.gameLayer.showItemBox();
            }
        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_HAPPY,KernelCurrent, FrameMainID, FrameBoxMsg.SUB_GF_CHESTCOUNT, function (SerializeObject, wDataSize) //与DOU_DI_ZHU逻辑相同
        {
            lm.log("欢乐斗地主 -> BaseDirector -> 随机任务进度 " + Game_ID);

            var currentValue = DataUtil.ReadNumber(SerializeObject,16);
            var maxValue = DataUtil.ReadNumber(SerializeObject, 16);
            lm.log("宝箱进度为：" + currentValue + " / " + maxValue);
            RandomTaskAttending.cur = currentValue;
            RandomTaskAttending.total = maxValue;
            if(sparrowDirector.isPlayingGame && sparrowDirector.gameLayer)
            {
                sparrowDirector.gameLayer.showItemBox();
            }
        });

        //随机任务
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU,KernelCurrent, FrameMainID, FrameBoxMsg.SUB_GF_CHESTINFO, function (SerializeObject, wDataSize) {
            var taskType = DataUtil.ReadNumber(SerializeObject, 32);
            lm.log("当前diyduzu进行的随机任务为：" + taskType);
            cc.log("当前diyduzu进行的随机任务为：" + taskType);
            RandomTaskAttending.id = taskType;
        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_LAI_ZI,KernelCurrent, FrameMainID, FrameBoxMsg.SUB_GF_CHESTINFO, function (SerializeObject, wDataSize) {
            var taskType = DataUtil.ReadNumber(SerializeObject, 32);
            lm.log("当前进行的随机任务为：" + taskType);
            cc.log("当前进行的随机任务为：" + taskType);
            RandomTaskAttending.id = taskType;
        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_HAPPY,KernelCurrent, FrameMainID, FrameBoxMsg.SUB_GF_CHESTINFO, function (SerializeObject, wDataSize)  //与DOU_DI_ZHU逻辑相同
        {
            lm.log("欢乐斗地主 -> BaseDirector -> 随机任务 ");

            var taskType = DataUtil.ReadNumber(SerializeObject, 32);
            lm.log("当前进行的随机任务为：" + taskType);
            cc.log("当前进行的随机任务为：" + taskType);
            RandomTaskAttending.id = taskType;
        });

        //响应宝箱
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU,KernelCurrent, FrameMainID, FrameBoxMsg.SUB_GF_HITCHEST, function (SerializeObject, wDataSize) {
            var data = {};

            data["type"] = "SUB_GF_HITCHEST";
            //宝箱索引
            data["dwChestIndex"] = DataUtil.ReadNumber(SerializeObject, 32);

            //开宝箱的人
            data["dwUserID"] = DataUtil.ReadNumber(SerializeObject, 32);

            //开的宝箱
            data["cbIndex"] = DataUtil.ReadNumber(SerializeObject, 8);

            cc.log("SUB_GF_HITCHEST" + JSON.stringify(data));

            if ( !sparrowDirector.gameLayer.gameBoxLayer )
            {
                sparrowDirector.gameLayer.gameBoxLayer = new GameBoxLayer();
                sparrowDirector.gameLayer.addChild(sparrowDirector.gameLayer.gameBoxLayer, 9999999999);
            }
            sparrowDirector.gameLayer.gameBoxLayer.openBox(data);

        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_LAI_ZI,KernelCurrent, FrameMainID, FrameBoxMsg.SUB_GF_HITCHEST, function (SerializeObject, wDataSize) {
            var data = {};

            data["type"] = "SUB_GF_HITCHEST";
            //宝箱索引
            data["dwChestIndex"] = DataUtil.ReadNumber(SerializeObject, 32);

            //开宝箱的人
            data["dwUserID"] = DataUtil.ReadNumber(SerializeObject, 32);

            //开的宝箱
            data["cbIndex"] = DataUtil.ReadNumber(SerializeObject, 8);

            cc.log("SUB_GF_HITCHEST" + JSON.stringify(data));

            if ( !sparrowDirector.gameLayer.gameBoxLayer )
            {
                sparrowDirector.gameLayer.gameBoxLayer = new GameBoxLayer();
                sparrowDirector.gameLayer.addChild(sparrowDirector.gameLayer.gameBoxLayer, 9999999999);
            }
            sparrowDirector.gameLayer.gameBoxLayer.openBox(data);


        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_HAPPY,KernelCurrent, FrameMainID, FrameBoxMsg.SUB_GF_HITCHEST, function (SerializeObject, wDataSize)   //与DOU_DI_ZHU逻辑相同
        {
            lm.log("欢乐斗地主 -> BaseDirector -> 响应宝箱 ");

            var data = {};

            data["type"] = "SUB_GF_HITCHEST";
            //宝箱索引
            data["dwChestIndex"] = DataUtil.ReadNumber(SerializeObject, 32);

            //开宝箱的人
            data["dwUserID"] = DataUtil.ReadNumber(SerializeObject, 32);

            //开的宝箱
            data["cbIndex"] = DataUtil.ReadNumber(SerializeObject, 8);

            cc.log("SUB_GF_HITCHEST" + JSON.stringify(data));

            if ( !sparrowDirector.gameLayer.gameBoxLayer )
            {
                sparrowDirector.gameLayer.gameBoxLayer = new GameBoxLayer();
                sparrowDirector.gameLayer.addChild(sparrowDirector.gameLayer.gameBoxLayer, 9999999999);
            }
            sparrowDirector.gameLayer.gameBoxLayer.openBox(data);


        });

        //hanhu #处理房间等待信息 2015/08/04
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU,KernelCurrent, RoomUserMainID, RoomStatusMsg.SUB_GR_ROOMWAIT, function(SerializeObject, wDataSize){
            self._sortRoomFlag = true;
            self.foceline = true;
            sparrowDirector.sortRoomUserInfoFlag = true; //hanhu #允许接收用户消息 2015/12/14
            //layerManager.PopTipLayer(new WaitUILayer("正在排队入桌，请稍后....",function()
            //{
            //    layerManager.PopTipLayer(new PopAutoTipsUILayer("连接服务器超时，请稍后重试！", DefultPopTipsTime),false);
            //},self));
            lm.log("收到排队房等待消息");
            self.srotWaitlayer = new WaitUILayer("正在排队入桌，请稍后....",function()
            {
                self.CancelSort();
            },self, 60);
            layerManager.PopTipLayer(self.srotWaitlayer);
        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_LAI_ZI,KernelCurrent, RoomUserMainID, RoomStatusMsg.SUB_GR_ROOMWAIT, function(SerializeObject, wDataSize){
            self._sortRoomFlag = true;
            self.foceline = true;
            sparrowDirector.sortRoomUserInfoFlag = true; //hanhu #允许接收用户消息 2015/12/14
            //layerManager.PopTipLayer(new WaitUILayer("正在排队入桌，请稍后....",function()
            //{
            //    layerManager.PopTipLayer(new PopAutoTipsUILayer("连接服务器超时，请稍后重试！", DefultPopTipsTime),false);
            //},self));
            lm.log("收到排队房等待消息");
            self.srotWaitlayer = new WaitUILayer("正在排队入桌，请稍后....",function()
            {
                self.CancelSort();
            },self, 60);
            layerManager.PopTipLayer(self.srotWaitlayer);
        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_HAPPY,KernelCurrent, RoomUserMainID, RoomStatusMsg.SUB_GR_ROOMWAIT, function(SerializeObject, wDataSize)   //与DOU_DI_ZHU逻辑相同
        {
            lm.log("欢乐斗地主 -> BaseDirector -> 处理房间等待信息 ");

            self._sortRoomFlag = true;
            self.foceline = true;
            sparrowDirector.sortRoomUserInfoFlag = true; //hanhu #允许接收用户消息 2015/12/14
            //layerManager.PopTipLayer(new WaitUILayer("正在排队入桌，请稍后....",function()
            //{
            //    layerManager.PopTipLayer(new PopAutoTipsUILayer("连接服务器超时，请稍后重试！", DefultPopTipsTime),false);
            //},self));
            lm.log("收到排队房等待消息");
            self.srotWaitlayer = new WaitUILayer("正在排队入桌，请稍后....",function()
            {
                self.CancelSort();
            },self, 60);
            layerManager.PopTipLayer(self.srotWaitlayer);
        });

        //hanhu #处理离开排队房消息 2015/12/15
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_LAI_ZI,KernelGame, RoomUserMainID, RoomUserMsg.SUB_GR_USER_LEAVE_SORT, function(SerializeObject, wDataSize){
            lm.log("排队控制标签为: " + sparrowDirector.sortRoomUserInfoFlag);
            return;
            if(sparrowDirector.sortRoomUserInfoFlag != true && sparrowDirector.sortRoomExitFlag != true)
            {
                return;
            }
            var des = "连接服务器超时，请稍后重试！";
            if(sparrowDirector.sortRoomExitFlag == true)
            {
                des = "退出房间成功!";
            }
            layerManager.PopTipLayer(new PopAutoTipsUILayer(des, DefultPopTipsTime, function(){
                var scene = new rootScene();
                var curLayer = new RoomUILayer();
                lm.log("KernelGame  10");
                CloseGameSocket(KernelGame);

                curLayer.setTag(ClientModuleType.GoldField);
                layerManager.addLayerToParent(curLayer, scene);
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
                DataUtil.SetGoToModule(ClientModuleType.Plaza);
                cc.director.replaceScene(scene);
                sparrowDirector.sortRoomExitFlag = false;
            }),false);

        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU,KernelGame, RoomUserMainID, RoomUserMsg.SUB_GR_USER_LEAVE_SORT, function(SerializeObject, wDataSize){
            lm.log("排队控制标签为: " + sparrowDirector.sortRoomUserInfoFlag);
            return;
            if(sparrowDirector.sortRoomUserInfoFlag != true && sparrowDirector.sortRoomExitFlag != true)
            {
                return;
            }
            var des = "连接服务器超时，请稍后重试！";
            if(sparrowDirector.sortRoomExitFlag == true)
            {
                des = "退出房间成功!";
            }
            layerManager.PopTipLayer(new PopAutoTipsUILayer(des, DefultPopTipsTime, function(){
                var scene = new rootScene();
                var curLayer = new RoomUILayer();
                lm.log("KernelGame  09");
                CloseGameSocket(KernelGame);

                curLayer.setTag(ClientModuleType.GoldField);
                layerManager.addLayerToParent(curLayer, scene);
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
                DataUtil.SetGoToModule(ClientModuleType.Plaza);
                cc.director.replaceScene(scene);
                sparrowDirector.sortRoomExitFlag = false;
            }),false);

        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_HAPPY,KernelGame, RoomUserMainID, RoomUserMsg.SUB_GR_USER_LEAVE_SORT, function(SerializeObject, wDataSize)  //与DOU_DI_ZHU逻辑相同
        {
            lm.log("欢乐斗地主 -> BaseDirector -> 处理离开排队房消息 ");
            return;

            lm.log("排队控制标签为: " + sparrowDirector.sortRoomUserInfoFlag + " " + sparrowDirector.sortRoomExitFlag);
            if(sparrowDirector.sortRoomUserInfoFlag != true && sparrowDirector.sortRoomExitFlag != true)
            {
                lm.log("欢乐斗地主 -> BaseDirector -> 处理离开排队房消息 1");
                return;
            }
            lm.log("欢乐斗地主 -> BaseDirector -> 处理离开排队房消息 2");
            var des = "连接服务器超时，请稍后重试！";
            if(sparrowDirector.sortRoomExitFlag == true)
            {
                lm.log("欢乐斗地主 -> BaseDirector -> 处理离开排队房消息 3");
                des = "退出房间成功!";
            }
            lm.log("欢乐斗地主 -> BaseDirector -> 处理离开排队房消息 ");
            layerManager.PopTipLayer(new PopAutoTipsUILayer(des, DefultPopTipsTime, function(){
                lm.log("欢乐斗地主 -> BaseDirector -> 处理离开排队房消息 4");
                var scene = new rootScene();
                var curLayer = new RoomUILayer();
                lm.log("KernelGame  08");
                CloseGameSocket(KernelGame);

                curLayer.setTag(ClientModuleType.GoldField);
                layerManager.addLayerToParent(curLayer, scene);
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
                DataUtil.SetGoToModule(ClientModuleType.Plaza);
                cc.director.replaceScene(scene);
                sparrowDirector.sortRoomExitFlag = false;
            }),false);

        });

        //服务器正在维护
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_LAI_ZI,KernelGame, RoomLogonMainID, RoomLogonMsg.SUB_GR_LOGON_SERVERSHUTDOWN, function(data, size){
            lm.log("----------服务器正在维护-1");
            layerManager.PopTipLayer(new PopAutoTipsUILayer("服务器正在维护，请稍后重试！", DefultPopTipsTime));
        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU,KernelGame, RoomLogonMainID, RoomLogonMsg.SUB_GR_LOGON_SERVERSHUTDOWN, function(data, size){
            lm.log("----------服务器正在维护-2");
            layerManager.PopTipLayer(new PopAutoTipsUILayer("服务器正在维护，请稍后重试！", DefultPopTipsTime));
        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_HAPPY,KernelGame, RoomLogonMainID, RoomLogonMsg.SUB_GR_LOGON_SERVERSHUTDOWN, function(data, size)  //与DOU_DI_ZHU逻辑相同
        {
            lm.log("欢乐斗地主 -> BaseDirector -> 服务器正在维护 ");
            lm.log("----------服务器正在维护-3");
            layerManager.PopTipLayer(new PopAutoTipsUILayer("服务器正在维护，请稍后重试！", DefultPopTipsTime));
        });

        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_LAI_ZI,KernelGame, RoomSettingMainID, RoomSettingMsg.SUB_GR_ROOMSETTING, function(data, szie){
            var TableCount = DataUtil.ReadNumber(data, 16);
            var ChairCount = DataUtil.ReadNumber(data, 16);
            var ServerType = DataUtil.ReadNumber(data, 16);
            var ServerRule = DataUtil.ReadNumber(data, 32);
            if(ServerRule&RoomRule.SR_FORCE_LINE)
            {
                lm.log("用户选择进入的房间为排队房");
                self._sortRoomFlag = true;
                self.foceline = true;
                sparrowDirector.sortRoomUserInfoFlag = true; //hanhu #允许接收用户消息 2015/12/14
            }
        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU,KernelGame, RoomSettingMainID, RoomSettingMsg.SUB_GR_ROOMSETTING, function(data, szie){
            var TableCount = DataUtil.ReadNumber(data, 16);
            var ChairCount = DataUtil.ReadNumber(data, 16);
            var ServerType = DataUtil.ReadNumber(data, 16);
            var ServerRule = DataUtil.ReadNumber(data, 32);
            if(ServerRule&RoomRule.SR_FORCE_LINE)
            {
                lm.log("用户选择进入的房间为排队房");
                self._sortRoomFlag = true;
                self.foceline = true;
                sparrowDirector.sortRoomUserInfoFlag = true; //hanhu #允许接收用户消息 2015/12/14
            }
        });
        connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_HAPPY,KernelGame, RoomSettingMainID, RoomSettingMsg.SUB_GR_ROOMSETTING, function(data, szie)  //与DOU_DI_ZHU逻辑相同
        {
            lm.log("欢乐斗地主 -> BaseDirector -> SUB_GR_ROOMSETTING ");
            var TableCount = DataUtil.ReadNumber(data, 16);
            var ChairCount = DataUtil.ReadNumber(data, 16);
            var ServerType = DataUtil.ReadNumber(data, 16);
            var ServerRule = DataUtil.ReadNumber(data, 32);
            if(ServerRule&RoomRule.SR_FORCE_LINE)
            {
                lm.log("用户选择进入的房间为排队房");
                self._sortRoomFlag = true;
                self.foceline = true;
                sparrowDirector.sortRoomUserInfoFlag = true; //hanhu #允许接收用户消息 2015/12/14
            }
        });

    },
    //取消排队
    CancelSort : function()
    {
        if ( sparrowDirector.gameData.isCallBankerState || sparrowDirector.gameData.isCallScore )
        {
            return;
        }
        connectUtil.sendManual(KernelCurrent, RoomUserMainID, RoomUserMsg.SUB_GR_USER_CANCEL_SORT, 0);
        sparrowDirector.SendUserAskStandup();//退出游戏场景，回到大厅；
    },
    // begin added by lizhongqiang 2015-09-30 11:24
    // 登录房间接口 -IP 地址更新， 统一用大厅的IP
    // 登录房间
    LogonRoom: function (serverport, userid, password, machinid) {
        //保存游戏模式
        KernelCurrent = KernelGame;

        this.roomport = serverport;
        lm.log("connect server . IP: "  + plazaMsgManager.address  + "  port: " +   this.roomport );
        lm.log("Logonroom  Game_ID : "  + Game_ID);

        SetGameLogic(Is_LAIZI_ROOM());
        var self = this;
        // 连接服务器成功
        //var ip = "192.168.5.76";//plazaMsgManager.address 周方胜
        //var ip = "192.168.5.65";//plazaMsgManager.address 曾涛
        //var ip = "192.168.5.12";//plazaMsgManager.address
        //var ip = "192.168.5.11";//plazaMsgManager.address
        //var ip = "192.168.5.37";//plazaMsgManager.address 城西
        //var ip = "192.168.5.99";//plazaMsgManager.address

        var ip = plazaMsgManager.address;
        //this.roomport = 10013;
        connectUtil.init(ip,  this.roomport , KernelCurrent, function (target, location, state) {

                var pass = password;
                if(GetDeviceType() != DeviceType.ANDROID || ChannelLabel == "8633" || ChannelLabel == "baiduSingle")
                {
                    var  type = userInfo.GetCurPlyarType(plazaMsgManager.address);
                    if(type == false){
                        pass = MD5String(password);
                    }
                }
                lm.log("connectUtil sendManualNoCache suc");
                connectUtil.sendManualNoCache(KernelCurrent,
                    RoomLogonMainID,
                    RoomLogonMsg.SUB_GR_LOGON_MOBILE,
                    147, //总长度
                    "16#" + Game_ID,
                    "32#" + VERSION_GAME,
                    "8#" + DefultDeviceType,
                    "16#" + Number(VIEW_MODE.VIEW_MODE_ALL | BEHAVIOR_LOGON.BEHAVIOR_LOGON_IMMEDIATELY),
                    "16#1",
                    "32#" + userid,
                    "33:" + pass,
                    "33:" + machinid);
            },
            function (target, location, state)
            {
                // 连接失败重试
                var pop = new ConfirmPop(this, Poptype.yesno, matchName + "当前网络异常，请检查网络状态后重试！");//ok
                pop.addToNode(cc.director.getRunningScene());
                pop.hideCloseBtn();
                pop.setYesNoCallback(
                    function(){
                        self.LogonRoom(serverport,userid,password,machinid);
                    },
                    function()
                    {
                        ExitGameEx();
                    }
                );

                //layerManager.PopTipLayer(new PopTipsUILayer("重试","取消","当前网络异常，请检查网络状态后重试！",function(id)
                //{
                //    if(id == clickid.ok)
                //    {
                //        self.LogonRoom(serverport,userid,password,machinid);
                //    }
                //}),false);
            });

    },
    // end added by lizhongqiang 2015-09-22 12:17
    // 发送玩家信息请求
    SendUserInfoReq: function (userid) // 目标用户ID
    {
        //hanhu #使用当前的模式 2015/07/28
        connectUtil.sendManual(KernelCurrent, RoomUserMainID, RoomUserMsg.SUB_GR_USER_INFO_REQ, 6, "32#" + userid, "16#0");
    },
    //发送游戏设置请求
    SendGameOption: function () {
        lm.log("get a game option send");
        //hanhu #根据当前比赛模式进行请求
        connectUtil.sendManual(KernelCurrent, FrameMainID, FrameMsg.SUB_GF_GAME_OPTION, 9, "8#0", "32#-1", "32#-1");
    },

    //发送准备消息
    SendUserReady: function () {
        lm.log("发送准备消息--------------")
        //hanhu #使用当前的模式 2015/07/28
        connectUtil.sendManual(KernelCurrent, FrameMainID, FrameMsg.SUB_GF_USER_READY, 0);

    },
    stripscript: function (s) {
        var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&mdash;—|{}【】‘；：”“'。，、？]");
        var rs = "";
        for (var i = 0; i < s.length; i++) {
            rs = rs + s.substr(i, 1).replace(pattern, '');
        }
        return rs;
    },
    //发送聊天消息
    SendUserChat: function (chatType,       //聊天类型
                            dwTargetUserID, //目标玩家
                            szChatString,   //聊天文字
                            crColor)     //文字颜色 RGBA(255,0,0,255)
    {
        if (!crColor) crColor = 0xffffffff;
        //hanhu #进行特殊字符过滤 2016/02/22
        szChatString = this.stripscript(szChatString);
        lm.log("转换后的字符串 = " + szChatString+"  chatType= "+chatType);

        var strLength = szChatString.length + 1;
        //hanhu #使用当前的模式 2015/07/28
        if(chatType == 0)
        {
            connectUtil.sendManual(KernelCurrent, FrameMainID, FrameMsg.SUB_GF_USER_CHAT,
                10 + strLength * 2,
                "16#" + Number(GetStringUnicodeLength(szChatString) / 2), //文字长度
                "32#" + Number(crColor),
                "32#" + Number(dwTargetUserID),
                "0:" + szChatString);
        }
        else if(chatType == 1)
        {
            lm.log("发送喇叭消息");
            var size = 7 + strLength * 2;
            lm.log("Size = " + size);
            lm.log("content = " + szChatString);
            connectUtil.sendManual(KernelCurrent, RoomUserMainID, RoomUserMsg.SUB_GR_USER_CHAT_BORDER,
                7 + strLength * 2,
                "8#" + ChatArea.PT_ISSUE_AREA_SERVER, //全服显示
                "16#" + ChatItem.PROPERTY_ID_TYPHON,  //大喇叭
                "32#" + Number(crColor),
                "0:" + szChatString);
        }
    },

    //发送用户表情
    SendUserExpression: function (dwTargetUserID, //目标玩家
                                  wItemIndex)   //表情索引

    {
        //hanhu #使用当前的模式 2015/07/28
        connectUtil.sendManual(KernelCurrent, FrameMainID, FrameMsg.SUB_GF_USER_EXPRESSION,
            6,
            "16#" + Number(wItemIndex),
            "32#" + Number(dwTargetUserID));
    },

    //发送请求换桌消息
    SendUserChairReq: function () {
        //hanhu #使用当前的模式 2015/07/28
        connectUtil.sendManual(KernelCurrent, RoomUserMainID, RoomUserMsg.SUB_GR_USER_CHAIR_REQ, 0);
    },

    //请求椅子用户信息
    SendUserChairInFoReq: function (wTableID, wChairID) {
        //hanhu #使用当前的模式 2015/07/28
        connectUtil.sendManual(KernelCurrent, RoomUserMainID, RoomUserMsg.SUB_GR_USER_CHAIR_INFO_REQ, 4,
            "16#" + Number(wTableID),
            "16#" + Number(wChairID));
    },
    // 请求站起
    SendUserAskStandup: function () {
        //hanhu #使用当前的模式 2015/07/28
        connectUtil.sendManual(KernelCurrent, RoomUserMainID, RoomUserMsg.SUB_GR_ASK_STANDUP, 0);
    },
    // 请求站起
    SendUserStandup: function (tableID, chairID) {
        //hanhu #使用当前的模式 2015/07/28
        connectUtil.sendManual(KernelCurrent, RoomUserMainID, RoomUserMsg.SUB_GR_USER_STANDUP, 5, "16#" + tableID, "16#" + chairID, "8#1");
    },
    //请求打开宝箱
    SendOpenBox: function (chestIndex, userID, index) {
        //hanhu #使用当前的模式 2015/07/28
        connectUtil.sendManual(KernelCurrent, FrameMainID, FrameBoxMsg.SUB_GF_HITCHEST, 9, "32#" + chestIndex, "32#" + userID, "8#" + index);
    },
    EnterMatchRoom : function (UserData) {
        var self = this;
        var data = {};
        data["type"] = "tagMobileUserInfoHead";

        //游戏ID
        data["dwGameID"] = Game_ID;


        //用户ID
        data["dwUserID"] = UserData["UserID"];

        //头像索引
        data["wFaceID"] = UserData["FaceID"];

        //自定标志
        data["dwCustomID"] = UserData["CustomID"];


        //用户性别
        data["cbGender"] = UserData["Gender"];


        //会员等级
        data["cbMemberOrder"] = 0;


        //桌子索引
        data["wTableID"] = 1;


        //椅子索引
        data["wChairID"] = UserData["UserSit"];


        //用户状态
        data["cbUserStatus"] = PlayerStatus.US_READY;


        //用户分数
        data["lScore"] = UserData["Score"];


        //胜利盘数
        data["dwWinCount"] = 0;


        //失败盘数
        data["dwlostCount"] = 0;


        //和局盘数
        data["dwDrawCount"] = 0;


        //逃局盘数
        data["dwFleeCount"] = 0;


        //用户经验
        data["dwExperience"] = 0;

        data["szNickName"] = UserData["NickName"];
        //读取玩家信息
        //if (self.getInfoOfPlayers(data["dwUserID"]) == null) {
        //    self.pushInfoOfPlayers(data);
        //}
        //else
        //{
        //    for (var key in this.gameData.playerInfo) {
        //        if (this.gameData.playerInfo[key]["dwUserID"] == data["dwUserID"]) {
        //            this.gameData.playerInfo[key] = data;
        //        }
        //    }
        //}
        if (!self.getInfoOfPlayers(data["dwUserID"])) {
            self.pushInfoOfPlayers(data);
        }

        // 登录用户是自己更新全局用户信息
        lm.log("用户进入， UserID= " + data["dwUserID"] + " 本机id = " + userInfo.globalUserdData["dwUserID"])
        if (data["dwUserID"] == userInfo.globalUserdData["dwUserID"]) {
            if (sparrowDirector.isAutoReady && sparrowDirector.isPlayingGame != true) //hanhu 每场游戏只初始化一次 2015/09/25
            {
                //sparrowDirector.initDirector();

                self.gameData.myChairIndex = data["wChairID"];
                self.gameData.tableIndex = data["wTableID"];
                sparrowDirector.isPlayingGame = true;
                sparrowDirector.gotoDeskScene();

            }

            //hanhu #登陆用户是自己，播放音乐 2015/08/03
            lm.log("播放音乐");
            MusicUtil.playMusicRoom("GAME_BLACKGROUND.mp3", true);
            userInfo.globalUserdData["lUserScoreInMatch"] = data["lScore"];


            if (data["wTableID"] != INVALID_CHAIR_TABLE) {
                self.gameData.tableIndex = data["wTableID"];
                if(KernelCurrent != KernelMatch)
                {
                    self.gameLayer.deskLayer.deskNumber.setString("桌号:" + Number(data["wTableID"] + 1));
                }
                else
                {
                    //lm.log("显示剩余时间");
                    lm.log("yyp即将进行比赛!");
                    self.gameLayer.deskLayer.deskNumber.setVisible(false);
                    var pos = self.gameLayer.deskLayer.deskNumber.getPosition();
                    matchMsgManager.ShowMatchInfo(pos);
                }

                self.gameData.myChairIndex = data["wChairID"];
                sparrowDirector.setCenterDirection(data["wChairID"]);

                //请求除自己之外其他玩家信息
                var myIndex = data["wChairID"];
                var allIndex = [0, 1, 2, 3];
                allIndex.splice(allIndex.indexOf(myIndex), 1);
                for (var key in allIndex) {
                    sparrowDirector.SendUserChairInFoReq(self.gameData.tableIndex, allIndex[key]);
                }

                var myInfo = self.getInfoOfPlayers(data["dwUserID"]);
                myInfo["wTableID"] = data["wTableID"];
                myInfo["wChairID"] = data["wChairID"];
                myInfo["cbUserStatus"] = data["cbUserStatus"];

                cc.log("比赛中收到自己入桌的消息，请求场景消息");

                self.SendGameOption()
            }

        }
        //lm.log("入桌玩家的昵称为:" + data["szNickName"] + "金币为：" + data["lScore"]);
        //sparrowDirector.setPlayerStatus(sparrowDirector.getUserDirection(data["wChairID"]), sparrowDirector.getInfoOfPlayers(data["dwUserID"]));
    },
    sendSortMessage : function(showCard)
    {
        lm.log("发送排队消息");
        if(showCard == true)
        {
            connectUtil.sendManualNoCache(KernelCurrent, RoomUserMainID, RoomUserMsg.SUB_GR_USER_SORT_SHOWCARD, 0);
        }
        else
        {
            connectUtil.sendManualNoCache(KernelCurrent, RoomUserMainID, RoomUserMsg.SUB_GR_USER_SORT, 0);
        }
    }

})
