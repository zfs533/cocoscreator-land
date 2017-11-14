/*
create by hanhu 2015/07/17
 */
var WaitMessageTag = 10002;
var AbandanceTag = 10003;

var MatchServerMainID = 6;
var MatchInfoMainID = 5;
var MatchRoomMainID = 7;
var MatchLoginMainID = 7;
var MatchServiceMainID = 6;
var MatchRankMainID = 6;
var MatchReconectMainID = 1;

var MatchWaitingType_TimeDispatchFailedPlayer = 10; //时限赛等待分配，人数不足
var MatchWaitingType_TimeDispatchFailedTime = 11; //时限赛等待分配-时间不足
var MatchWaitingType_RoundWaitingPlayerCount = 20; //轮回赛等待下一轮-人数不足
var MatchWaitingType_RoundWaitingGameEnd = 21; //轮回赛等待下一轮-轮次结束


var MatchReconectMsg =
{
    //比赛重连成功
    MATCH_RECONNECT_OK : 104,
    //需要重新登录
    MATCH_NEED_RECONNECT : 103
}

var MatchInfoMsg =
{
    //比赛信息
    MATCH_STATUS : 1,
    //比赛结束
    MATCH_END : 2,
    //用户信息
    MATCH_USERINFO : 3,
    //比赛开始
    MATCH_START : 4,
    //比赛排名信息
    MATCH_GM_RANK : 5,
    //比赛调度
    SUB_GP_MATCHDISPATCH : 6,
    //比赛切换
    SUB_GP_MATCHSWITCH : 7,
    //报名失败
    SUB_GP_SIGN_FAILED : 8,
    //比赛消息
    MATCH_TIP : 13,
    //参赛状态
    SUB_GP_SIGNSTATUS : 14,
    //玩家基础信息
    SUB_GP_USERBASEINFO : 15,
    //颁奖信息
    SUB_GP_MATCHREWARD : 20,
    //颁奖结束
    SUB_GP_MATCHREWARDEND : 21,
    //比赛等待信息
    SUB_GP_MATCHWAITINGINFO : 30,
    //比赛轮次信息
    SUB_GP_MATCHTYPECONFIG : 40,
    //预约成功
    SUB_GP_MATCHAPPOINTMENT : 16,
    //取消预约成功
    SUB_GP_MATCHCANCELLAPPOINTMENT : 17,
    //报名人数已满，预约取消
    SUB_GP_APPOINTMENTFORCECANCEL : 18
};

var MatchSignMsg =
{
    //用户报名
    MATCH_USER_SIGN_IN : 1,
    //报名成功
    MATCH_SIGN_IN_SUCCESS : 10,
    //报名失败
    MATCH_SIGN_IN_FAILED : 11,
    //用户退赛
    MATCH_SIGN_OUT : 2,
    //退赛失败
    MATCH_SIGN_OUT_FAILED : 12
};

var MatchMsg =
{
    //比赛开始
    MATCH_GM_START : 106,
    //玩家已准备好
    MATCH_GM_USERREADY : 3,
    //登陆游戏服务器
    MATCH_GR_LOGIN : 1,
    //客户端已准备好
    MATCH_GR_CLIENTOK : 10,
    //报到成功
    MATCH_GR_SIGNOK : 100,
    //返回玩家列表
    MATCH_GR_USERSIT : 101,
    //一局比赛结束
    MATCH_GM_OVER : 102,
    //比赛结果
    MATCH_GM_REWARDINFO : 107,
    //比赛结束
    MATCH_GM_END : 24,
    //比赛重连
    MATCH_GM_RECONNECT : 5,
    //重连完成
    MATCH_GM_RECONNECT_OK : 110,
    //强制退出游戏
    MATCH_GM_EXIT : 4,
    //轮回赛当前局数
    MATCH_GM_CIRCLE : 103,
    //请求比赛分配状态
    MATCH_GM_CALL_DISPATCH : 300
};

var MatchInfoArray = new Array();
var MatchInfo =
{
    MatchID : 0,
    RoundID : 0,
    SignCount : 0,
    Begin : 0,
    MatchType : 1,  //1是时限赛。2是轮回赛
    UserListCount : 0, //玩家列表
    StartType : 0,   //1是定时开赛，2是人满开赛
    NextMatchID : 0  //下一个关联比赛的ID

};

var MatchUserInfoArray = new Array();
var MatchUserInfo =
{
    UserID : 0,
    Gender : 0,
    FaceID : 0,
    CustomID : 0,
    NickName : "",
    Score : 0,
    Port : 0,
    RankChange : 0,
    RankChangeNum : 0
};
//用于计算排名的中间数组
var MatchUserInfoTempArray = new Array();
var MatchUserInfoTemp =
{
    UserID : 0,
    Score : 0
};

var MatchSignInArray = new Array();
var MatchSignInInfo =
{
    MatchID : 0,
    RoundID : 0,
    Ticket : ""
};

var MatchAttendingInfo =
{
    MatchID : 0,
    RoundID : 0,
    MatchType : 1,
    MatchDetail : null, //比赛详细信息
    RoundNum : 1        //轮回赛当前轮次
}

var MatchSitArray = new Array();
var MatchSitInfo =
{
    UserID : 0,
    UserSit : 0
}

var  MatchUserReadyArray = new Array(); //比赛分配信息队列
var MatchData = {}; //二级比赛数据
var MatchShowInfo = {}; //比赛展示信息

var SubMatchArray = new Array(); //二级比赛队列

//关于比赛的消息,每增加一个比赛消息都应加入到这个列表中
var MsgInMatch =
{
    "length" : 7,
    0 : "2_7_100",
    1 : "2_7_101",
    2 : "2_6_24",
    3 : "2_1_104",
    4 : "2_1_103",
    5 : "2_7_102",
    6 : "2_7_103"
};
//玩家状态
var UserStatus =
{
    wait : undefined,
    ready : 1,
    free : 2
};
var MatchMsgManager = cc.Class.extend({
    _signInFlag:false,
    _connectFlag:false,
    _reconnectPort:0,
    _userState:[],
    _matchInfoFlag:0,
    _reconnectKey:0,
    ReConnectCount:0,   //比赛重连次数-直到收到重连成功消息、退出到登录界面，清空次数
    _clearUserInfo:false,
    ctor: function()
    {
        //lm.log("初始化比赛监听接口成功");
        this.InitMatchMsgListenner();
    },
    InitMatchMsgListenner: function()
    {
        var self = this;
        //比赛状态信息
        connectUtil.dataListenerManual(KernelPlaza, MatchInfoMainID, MatchInfoMsg.MATCH_STATUS, function (data, wDataSize) {

            var matchID = DataUtil.ReadNumber(data, 32);
            var roundID = DataUtil.ReadNumber(data, 32);
            var signCount = DataUtil.ReadNumber(data, 32);
            var MatchProgress = DataUtil.ReadNumber(data, 32);
            var begin = DataUtil.ReadNumber(data, 8);

            var matchInfo = {};
            matchInfo.MatchID = matchID;
            matchInfo.RoundID = roundID;
            matchInfo.SignCount = signCount;
            matchInfo.MatchProgress = MatchProgress;
            matchInfo.Begin = begin;

            var org_RoundID = self.GetValueFromArray(MatchInfoArray, "MatchID", matchID, "RoundID");

            //lm.log("yyp_MatchID=" + matchID+" RoundID=" + roundID+" SignCount=" + signCount+" begin = " + begin+" 当前比赛进度为：" + MatchProgress);

            self.UpdataArray(MatchInfoArray, matchInfo, "MatchID", matchID);
            //lm.log("yyp_当前比赛数量为" + MatchInfoArray.length);

            //初始化比赛数组
            if(MatchUserInfoArray[matchID] == undefined)
            {
                MatchUserInfoArray[matchID] = new Array();
            }
            if(MatchUserInfoArray[matchID][roundID] == undefined)
            {
                MatchUserInfoArray[matchID][roundID] = new Array();
            }
            if(MatchSitArray[matchID] == undefined)
            {
                MatchSitArray[matchID] = new Array();
            }
            if(MatchSitArray[matchID][roundID] == undefined)
            {
                MatchSitArray[matchID][roundID] = new Array();
            }

            //获取比赛场数据
            lm.log("yyp_ matchInfo.MatchID = " + matchInfo.MatchID + "  matchInfo.RoundID =" + matchInfo.RoundID);
            var requestFunc = null;
            requestFunc = function(MatchID, RoundID){
                NewWebMsgManager.SendGpMatchFiled(MatchID,RoundID,function(data) {
                        matchInfo.MatchID = data[0]["matchid"];
                        //lm.log("将存储的matchid = " + matchInfo.MatchID);
                        matchInfo.RoundID = RoundID;
                        matchInfo.StartType = data[0]["startType"];
                        matchInfo.MatchType = data[0]["matchType"];
                        matchInfo.UserListCount = data[0]["userListCount"];
                        matchInfo.NextMatchID = data[0]["nextMatchID"];

                        //lm.log("yyp_——match 从服务器获取到比赛信息 = " + matchInfo.RoundID );

                        self.UpdataArray(MatchInfoArray, matchInfo, "MatchID", data[0]["matchid"]);
                        //lm.log(JSON.stringify(MatchInfoArray));
                        self.MatchUpdata(matchID);
                        self.updatePeopleMatchTips(matchID);
                        self.updateTimeMatchTips(matchID);
                        if(matchInfo.NextMatchID != "0")
                        {
                           // lm.log("保存子ID = " + data[0]["nextMatchID"]);
                            matchInfo = {};
                            SubMatchArray.push(data[0]["nextMatchID"]);
                            requestFunc(data[0]["nextMatchID"], 0);
                        }

                        var findFlag = false;
                        for(var k in SubMatchArray)
                        {
                            //lm.log("SubMatch = " + SubMatchArray[k]);
                            if(SubMatchArray[k] == MatchID)
                            {
                                findFlag = true;
                                break;
                            }
                        }
                        if(findFlag == false)
                        {
                            //lm.log("yyp_match保存主比赛=" + data[0]["matchid"])
                            roomManager.SetMatchRoomData(data);
                        }
                        else
                        {
                            MatchData[MatchID] = {};
                            MatchData[MatchID][RoundID] = {};
                           // lm.log("保存二级比赛信息， matchID = " + MatchID + " RoundID = " + RoundID);
                            MatchData[MatchID][RoundID] = data;
                        }
                    },
                    function(errinfo) {
                        lm.log("yyp——match 从服务器获取到比赛信息1 = " + errinfo);

                    },
                    this);
            }

            requestFunc(matchInfo.MatchID, matchInfo.RoundID);

            if(MatchShowInfo[matchID] == undefined)
            {
                NewWebMsgManager.SendGetMatchReward(matchID, function(data)
                {
                    lm.log("yyp——match 成功获取比赛展示信息 = " + JSON.stringify(data));
                    MatchShowInfo[matchID] = {};
                    MatchShowInfo[matchID] = data;
                },
                function(erroInfo)
                {
                   lm.log("yyp——match 获取比赛展示信息失败，erroInfo = " + erroInfo);
                })
            }

        });

        //比赛结束
        connectUtil.dataListenerManual(KernelPlaza, MatchInfoMainID, MatchInfoMsg.MATCH_END, function (data, wDataSize) {
            lm.log("收到比赛结束的消息");
            var matchID = DataUtil.ReadNumber(data, 32);
            var roundID = DataUtil.ReadNumber(data, 32);
            //self.RemoveMatch(matchID, roundID);
            //self.RemoveDataFromArray(MatchSignInArray, "MatchID", matchID);
            for(var i = 0; i < MatchSignInArray.length; i++)
            {
                if(MatchSignInArray[i]["MatchID"] == matchID && MatchSignInArray[i]["RoundID"] == roundID)
                {
                    MatchSignInArray.splice(i, 1);
                    self.MatchUpdata(matchID); //比赛结束更新比赛显示信息
                    self.updatePeopleMatchTips(matchID);
                    self.updateTimeMatchTips(matchID);
                    break;
                }
            }
            if(matchID == MatchAttendingInfo.MatchID && roundID == MatchAttendingInfo.RoundID)  //hanhu #只有当前比赛结束时才移除等待界面 2015/12/30
            {
                self.RemoveWaitMessage();
            }

        });

        //用户信息
        connectUtil.dataListenerManual(KernelPlaza, MatchInfoMainID, MatchInfoMsg.MATCH_USERINFO, function (data, wDataSize) {
            lm.log("收到用户信息的消息大小为: " + wDataSize);
            return;
            //hanhu 如果头与消息长度相同则用户消息接收结束  2015/11/11
            if(wDataSize == 8)
            {
                self._clearUserInfo = true;
                return;
            }

            var IsZip = DataUtil.ReadNumber(data, 8);
            var hHandle  = null;
            if(IsZip == 0)
            {
                hHandle = data
            }
            else
            {
                var nSize =  DataUtil.ReadNumber(hHandle, 32);
                hHandle  = unZip(data, 5);
            }

            var MatchId =  DataUtil.ReadUnZipNumber(hHandle, 32);
            var RoundID =  DataUtil.ReadUnZipNumber(hHandle, 32);
            var len = (nSize - 8) / 23;

            if(self._clearUserInfo == true)
            {
                //MatchUserInfoArray[MatchId][RoundID] = new Array();
                self._clearUserInfo = false;
            }

            lm.log("数据的长度为 :" + len);
            lm.log("MatchID = " + MatchId + "RoundID = " + RoundID);

            for(var i = 0; i < len; i++)
            {
                //lm.log("读入第 "+ i + "个玩家信息");
                var userInfo = {};
                userInfo.Score = DataUtil.ReadUnZipNumber(hHandle, 64);
                userInfo.UserID =  DataUtil.ReadUnZipNumber(hHandle, 32);
                userInfo.Gender = DataUtil.ReadUnZipNumber(hHandle, 8);
                userInfo.FaceID = DataUtil.ReadUnZipNumber(hHandle, 16);
                userInfo.CustomID = DataUtil.ReadUnZipNumber(hHandle, 32);
                userInfo.NickName = ReadUnZipString(hHandle, 32);

                self.UpdataArray(MatchUserInfoArray[MatchId][RoundID], userInfo, "UserID", userInfo.UserID);
            }
            FreeUnZipBuffer();

            MatchUserInfoArray[MatchId][RoundID].sort(function(a, b){
                if(a.Score < b.Score)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            })

        });

        //比赛开始
        connectUtil.dataListenerManual(KernelPlaza, MatchInfoMainID, MatchInfoMsg.MATCH_START, function (data, wDataSize) {
            lm.log("收到比赛开始的消息");
            var matchID = DataUtil.ReadNumber(data, 32);
            var roundID = DataUtil.ReadNumber(data, 32);

            if(self.GetValueFromArray(MatchSignInArray, "MatchID", matchID, "RoundID") == roundID)
            {
                //MatchData["MatchTicket "] = ReadString(data, 33);
                //lm.log("比赛开始获得的门票为 :" + MatchData["MatchTicket"]);
                MatchData[matchID] = {};
                MatchData[matchID][roundID] = {};
                var year = DataUtil.ReadNumber(data, 8);
                var month = DataUtil.ReadNumber(data, 8);
                var day = DataUtil.ReadNumber(data, 8);
                var hour = DataUtil.ReadNumber(data, 8);
                var minute = DataUtil.ReadNumber(data, 8);
                var secound = DataUtil.ReadNumber(data, 8);
                MatchData[matchID][roundID]["startTime"] = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + secound;
                self.MatchStart(matchID);
            }

        });

        //报名成功
        connectUtil.dataListenerManual(KernelPlaza, MatchInfoMainID, MatchSignMsg.MATCH_SIGN_IN_SUCCESS, function (data, size) {
            var matchID = DataUtil.ReadNumber(data, 32);
            var roundID = DataUtil.ReadNumber(data, 32);
            var ticket = ReadString(data, 33);
            lm.log("yyp -> 收到报名成功的消息，matchID = " + matchID + " roundID =" + roundID);

            var signInfo = {};
            signInfo.MatchID = matchID;
            signInfo.RoundID = roundID;
            signInfo.Ticket = ticket;
            lm.log("报名成功获得的门票为:" + ticket);
            self.UpdataArray(MatchSignInArray, signInfo, "MatchID", matchID);
            lm.log("报名成功，队列为：" + JSON.stringify(MatchSignInArray));
            self.AddMatchTag(matchID, 1);

            self.updatePeopleMatchTips(matchID);
            self.updateTimeMatchTips(matchID);

            //报名成功后请求奖励数据
            webMsgManager.SendGpMatchReward(matchID, roundID,function(data) {
                    //lm.log("从服务器获取到比赛奖励信息！");
                    roomManager.SetMatchRewardData(data);
                },
                function(errinfo) {

                },
                this);
        });

        //退赛成功或报名失败
        connectUtil.dataListenerManual(KernelPlaza, MatchInfoMainID, MatchSignMsg.MATCH_SIGN_IN_FAILED, function (data, size) {
            //lm.log("yyp -> 收到退赛成功或比赛失败的消息");
            var matchID = DataUtil.ReadNumber(data, 32);
            var roundID = DataUtil.ReadNumber(data, 32);
            if(self.GetValueFromArray(MatchSignInArray, "MatchID", matchID, "RoundID") == roundID)
            {
                lm.log("yyp -> 退赛成功");
                self.RemoveDataFromArray(MatchSignInArray, "MatchID", matchID);
                self.RemoveMatchSignTag(matchID);
                self.PopMsg( "退赛成功!", 3.0);

                self.updatePeopleMatchTips(matchID);
                self.updateTimeMatchTips(matchID);
            }
            else
            {
                lm.log("yyp -> 报名失败");
                self.PopMsg("报名失败,请确认是否有参赛券再重试！", 3.0);
            }

        });


        //退赛失败
        connectUtil.dataListenerManual(KernelPlaza, MatchInfoMainID, MatchSignMsg.MATCH_SIGN_OUT_FAILED, function (data, size) {
            this.PopMsg("yyp -> 退赛失败，请稍后再试!", 3.0);
        });

        //比赛tip
        connectUtil.dataListenerManual(KernelPlaza, MatchInfoMainID, MatchInfoMsg.MATCH_TIP, function (data, size) {
            var matchID = DataUtil.ReadNumber(data, 32);
            var roundID = DataUtil.ReadNumber(data, 32);
            var tipType = DataUtil.ReadNumber(data, 16);
            //lm.log("数据长度为 :" + size);
            var tipMsg = ReadString(data, (size - 10) / 2);
            lm.log("yyp弹出比赛提示 =" + tipMsg);
            self.PopMsg(tipMsg, 3.0);
        });

        //比赛开始
        connectUtil.dataListenerManual(KernelPlaza, MatchInfoMainID,  MatchInfoMsg.MATCH_START, function (data, size) {
            lm.log("收到比赛开始的消息2");
            var matchID = DataUtil.ReadNumber(data, 32);
            var roundID = DataUtil.ReadNumber(data, 32);
            var matchDetail = null;

            var SignInRoundID = self.GetValueFromArray(MatchSignInArray, "MatchID", matchID, "RoundID");
            lm.log("matchID = " + matchID + " RoundID = " + roundID);
            lm.log("SignInRoundID = " + SignInRoundID + " RoundID = " + roundID + " atMatchID = " + MatchAttendingInfo.MatchID + " atRoundID = " + MatchAttendingInfo.RoundID);

            if( SignInRoundID == roundID && (MatchAttendingInfo.MatchID != matchID || MatchAttendingInfo.RoundID != roundID))
            {

                MatchData[matchID] = {};
                MatchData[matchID][roundID] = {};
                var year = DataUtil.ReadNumber(data, 16);
                var month = DataUtil.ReadNumber(data, 16);
                var dayOfWeak = DataUtil.ReadNumber(data, 16);
                var day = DataUtil.ReadNumber(data, 16);
                var hour = DataUtil.ReadNumber(data, 16);
                var minute = DataUtil.ReadNumber(data, 16);
                var secound = DataUtil.ReadNumber(data, 16);
                var millionSecound = DataUtil.ReadNumber(data, 16);
                MatchData[matchID][roundID]["startTime"] = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + secound;

                //var matchRoomData = roomManager.GetMatchRoomData();
                var matchName = "";
                var CurMatchID = self.GetValueFromArray(MatchInfoArray, "MatchID", matchID, "MatchProgress");  //使用当前比赛进度获取比赛信息
                for(var i = 0; i < roomManager.matchroomdata.length; i++)
                {
                    if(roomManager.matchroomdata[i]["matchid"] == CurMatchID)
                    {
                        matchName = roomManager.matchroomdata[i]["matchname"];
                        roomManager.matchroomdata[i]["realstarttime"] = MatchData[matchID][roundID]["startTime"];
                        matchDetail = roomManager.matchroomdata[i];
                        lm.log("获取到比赛实际开始时间为：" + MatchData[matchID][roundID]["startTime"]);
                        break;
                    }
                }

                if(matchDetail == null)
                {
                    //lm.log("比赛详细信息设置未二级信息 = " + JSON.stringify(MatchData[CurMatchID][0][0]));
                    matchDetail = MatchData[CurMatchID][0][0];
                }

                lm.log("收到比赛开始消息，name= " + matchName + " matchID = " + matchID + " RoundID = " + roundID);
                //前往比赛
                if(matchName == "")
                {
                    matchName = "比赛";
                }

                var pop = new ConfirmPop(this, Poptype.yesno, matchName + "已开始，是否前往？");//ok
                pop.addToNode(cc.director.getRunningScene());
                pop.setYesNoCallback(
                    function(){
                        //lm.log("用户选择参加的比赛为：" + matchID);
                        //更新玩家状态为可进入游戏
                        self.StartMatchGame(matchID, roundID);
                        //记录用户选择参加的比赛
                        MatchAttendingInfo.MatchID = matchID;
                        MatchAttendingInfo.RoundID = roundID;
                        MatchAttendingInfo.MatchType =  matchDetail["matchType"];
                        MatchAttendingInfo.MatchDetail = matchDetail;
                        self.ExcuteUserReady();
                        //connectUtil.sendManual(KernelPlaza,
                        //    MatchServiceMainID,
                        //    MatchMsg.MATCH_GM_RECONNECT,
                        //    8,
                        //    "32#" + matchID,
                        //    "32#" + roundID);
                        //对用户参加的比赛进行统计
                        if(GetDeviceType() == DeviceType.ANDROID)
                        {
                            jsb.reflection.callStaticMethod(AndroidPackageName, "countTimeMatch", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", "1002", matchID, matchName);
                        }

                    },
                    function()
                    {
                        self.ExitMatchGame(matchID, roundID);
                    },
                    function()
                    {
                        self.ExitMatchGame(matchID, roundID);
                    }
                );
/*
                var Pop = new ConfirmNode(matchName + "已开始，是否前往？", this, function(){

                    //lm.log("用户选择参加的比赛为：" + matchID);
                    //更新玩家状态为可进入游戏
                    self.StartMatchGame(matchID, roundID);
                    //记录用户选择参加的比赛
                    MatchAttendingInfo.MatchID = matchID;
                    MatchAttendingInfo.RoundID = roundID;
                    MatchAttendingInfo.MatchType =  matchDetail["matchType"];
                    MatchAttendingInfo.MatchDetail = matchDetail;
                    self.ExcuteUserReady();
                    //connectUtil.sendManual(KernelPlaza,
                    //    MatchServiceMainID,
                    //    MatchMsg.MATCH_GM_RECONNECT,
                    //    8,
                    //    "32#" + matchID,
                    //    "32#" + roundID);
                    //对用户参加的比赛进行统计
                    if(GetDeviceType() == DeviceType.ANDROID)
                    {
                        jsb.reflection.callStaticMethod(AndroidPackageName, "countTimeMatch", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", "1002", matchID, matchName);
                    }

                },
                function(){
                    self.ExitMatchGame(matchID, roundID);
                });



                cc.director.getRunningScene().addChild(Pop, 999);
                var size = cc.director.getWinSize();
                Pop.setPosition(cc.p(size.width / 2, size.height / 2));
                */
            }
            else if(MatchAttendingInfo.MatchID == matchID && MatchAttendingInfo.RoundID == roundID)
            {
                lm.log("比赛进行中的重连，直接开启比赛");
                self.ReadyToLoginMatchcServer(matchID, roundID);
            }
        });

        //比赛房间消息
        connectUtil.dataListenerManual(KernelPlaza, MatchInfoMainID, MatchInfoMsg.SUB_GP_MATCHDISPATCH, function (data, size) {
            lm.log("收到比赛房间的消息 = USERREADY");
            lm.log("数据大小为：" + size);
            var IsZip = DataUtil.ReadNumber(data, 8);
            var nSize = 0;
            var hHandle  = null;
            var readNumber = null;
            var readString = null;
            if(IsZip == 0)
            {
                lm.log("数据未压缩");
                hHandle = data;
                nSize = size;
                readNumber = function(handle, len){
                    return DataUtil.ReadNumber(handle, len);
                };
                readString = function(handle, len){
                    return ReadString(handle, len);
                };
            }
            else
            {
                lm.log("数据已压缩");
                nSize =  DataUtil.ReadNumber(data, 32);
                hHandle  = unZip(data, 5);
                readNumber = function(handle, len){
                    return DataUtil.ReadUnZipNumber(handle, len);
                };
                readString = function(handle, len){
                    return ReadUnZipString(handle, len);
                };
            }

            var MatchID = readNumber(hHandle, 32);
            var RoundID = readNumber(hHandle, 32);
            var Port = readNumber(hHandle, 16);
            var UserCount = readNumber(hHandle, 16);
            var Score = readNumber(hHandle, 64);

            lm.log("收到的比赛ID = " + MatchID + " RoundID = " + RoundID + " Port = " + Port);
            for(var i = 0; i < UserCount; i++)
            {
                lm.log("读入第 "+ i + "个玩家信息");
                var MatchUserInfo = {};
                MatchUserInfo.UserID =  readNumber(hHandle, 32);
                lm.log("UserID = " + MatchUserInfo.UserID);
                MatchUserInfo.Gender = readNumber(hHandle, 8);
                lm.log("Gender = " + MatchUserInfo.Gender);
                MatchUserInfo.FaceID = readNumber(hHandle, 16);
                lm.log("FaceID = " + MatchUserInfo.FaceID);
                MatchUserInfo.CustomID = readNumber(hHandle, 32);
                lm.log("CustomID = " + MatchUserInfo.CustomID);
                MatchUserInfo.NickName = readString(hHandle, 32);
                lm.log("NickName = " + MatchUserInfo.NickName);

                self.UpdataArray(MatchUserInfoArray[MatchID][RoundID], MatchUserInfo, "UserID", MatchUserInfo.UserID);
            }
            FreeUnZipBuffer();


            //若不为当前进行的比赛，则进入等待队列
            lm.log("正在参加的比赛 MatchID = " + MatchAttendingInfo.MatchID + " RoundID = " + MatchAttendingInfo.RoundID)
            if(MatchID != MatchAttendingInfo.MatchID || RoundID != MatchAttendingInfo.RoundID)
            {
                var data = {};
                data["MatchID"] = MatchID;
                data["RoundID"] = RoundID;
                data["Score"] = Score;
                data["Port"] = Port;
                MatchUserReadyArray.push(data);
            }
            else //只有在用户确认时才执行入场操作
            {
                if(self.ConnectPort != Port)
                {
                    self.ConnectPort = Port;
                    self._connectFlag = false;
                }

                //lm.log("User Score = "+Score);
                //lm.log("Port = " + Port);
                self.SetArrayValue(MatchUserInfoArray[MatchID][RoundID], "UserID", userInfo.globalUserdData["dwUserID"], "Port", Port);
                if((self._userState[MatchID] == UserStatus.ready || KernelCurrent == KernelMatch) && connectUtil._MatchConneting == 0) //玩家已准备好进入游戏
                {
                    lm.log("玩家已准备好，直接进入比赛");
                    self._userState[MatchID] = UserStatus.wait;
                    self.LoginMatchServer(MatchID, RoundID, plazaMsgManager.address, Port);
                    //self.LoginMatchServer(MatchID, RoundID, "192.168.5.10", 20007);
                }
                else
                {
                    lm.log("玩家没有准备好，等待玩家确认");
                    self._userState[MatchID] = UserStatus.free;  //玩家可自由选择连接服务器时间
                }

                //更新比赛倍率
                self.orgMatchRate = Score;
                if(sparrowDirector.gameLayer != undefined)
                {
                    try{
                        sparrowDirector.gameLayer.matchCurrrentRate.setString("当前倍率：" + Score);
                    }
                    catch (exp){
                        lm.log("设置比赛当前倍率失败");
                    }

                }
            }

        });

        //登陆比赛房间消息
        connectUtil.dataListenerManual(KernelMatch, MatchLoginMainID, RoomLogonMsg.SUB_GR_LOGON_SUCCESS, function (SerializeObject, wDataSize) {
            //告知服务器客户端已准备好
            lm.log("报到成功");
            self._reconnectKey = DataUtil.ReadNumber(SerializeObject, 32);
            //lm.log("收到比赛重连KEY=" + self._reconnectKey);
            //重连标记
            var flag = 0;
            if(self._reconnectPort != 0)
            {
                //lm.log("进行重连, reconnectPort =" + self._reconnectPort);
                flag = 1;
                sparrowDirector.SendGameOption();
            }
            connectUtil.sendManual(KernelMatch,
                MatchLoginMainID,
                MatchMsg.MATCH_GR_CLIENTOK,
                8,
                "32#" + MatchAttendingInfo.MatchID,
                "32#" + MatchAttendingInfo.RoundID);
        });

        //座位消息
        connectUtil.dataListenerManual(KernelMatch, MatchLoginMainID, MatchMsg.MATCH_GR_USERSIT, function (data, size) {
            var len = size / 14;
            lm.log("收到比赛座位的消息共" + len + "条");
            //只有我这一桌的信息
            var sitComputeArray = [];
            for(var i = 0; i < len; i++)
            {
                var UserID = DataUtil.ReadNumber(data, 32);
                var ChairID = DataUtil.ReadNumber(data, 16);
                var Score = DataUtil.ReadNumber(data, 64);
                var sitInfo = {};
                sitInfo.UserID = UserID;
                sitInfo.UserSit = ChairID;
                sitInfo.Score = Score;
                sitComputeArray[i] = sitInfo;
                lm.log("UserID = " + UserID + " Score = " + Score);
                MatchSitArray[MatchAttendingInfo.MatchID][MatchAttendingInfo.RoundID][i] = sitInfo;
            }

            //轮回赛计算排名
            if(MatchAttendingInfo.MatchType == MatchType.RoundLimitedMatch)
            {
                sitComputeArray.sort(function(a, b){
                    if(a.Score < b.Score)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                });
                for(var i = 0; i < sitComputeArray.length; i++)
                {
                    if(sitComputeArray[i]["UserID"] == userInfo.globalUserdData["dwUserID"])
                    {
                        try{
                            sparrowDirector.gameLayer.matchCurrentRank.setString("当前排名：" + (i + 1));
                        }
                        catch (exp)
                        {
                            lm.log("设置当前排名失败");
                        }

                    }
                }
            }

            //打开比赛房间
            self.OpenMatchRoom(plazaMsgManager.address, self.GetValueFromArray(MatchUserInfoArray[MatchAttendingInfo.MatchID][MatchAttendingInfo.RoundID], "UserID", userInfo.globalUserdData["dwUserID"], "Port"));
        });

        connectUtil.dataListenerManual(KernelMatch, MatchLoginMainID, MatchMsg.MATCH_GM_OVER, function (data, size) {
            var OverStatus = DataUtil.ReadNumber(data, 8); //1一轮结束， 0一局解速
            var UserCount = DataUtil.ReadNumber(data, 16);
            var table = [];
            for(var i = 0; i < UserCount; i++)
            {
                var user = {};
                user.UserID = DataUtil.ReadNumber(data, 32);
                user.Score = DataUtil.ReadNumber(data, 64);
                table[i]= user;
                //更新玩家信息
                for(var j = 0; j < MatchUserInfoArray[MatchAttendingInfo.MatchID][MatchAttendingInfo.RoundID].length; j++)
                {
                    if(MatchUserInfoArray[MatchAttendingInfo.MatchID][MatchAttendingInfo.RoundID][j]["UserID"] == table[i]["UserID"])
                    {
                        lm.log("更新玩家信息ID = " + table[i]["UserID"] + " Score = " + table[i]["Score"]);
                        MatchUserInfoArray[MatchAttendingInfo.MatchID][MatchAttendingInfo.RoundID][j]["Score"] = table[i]["Score"];
                        var direction = sparrowDirector.getUserDirection(MatchUserInfoArray[MatchAttendingInfo.MatchID][MatchAttendingInfo.RoundID][j]["UserSit"]);
                        var target = sparrowDirector._getTargetOfInfo(direction);

                        if(target.coinNum != null && target.coinNum != _undefined)
                        {
                            target.coinNum.setString(table[i]["Score"]);
                        }
                        break;
                    }
                }
            }
            if(MatchAttendingInfo.MatchType == MatchType.RoundLimitedMatch)
            {
                table.sort(function(a, b){
                    if(a["Score"] < b["Score"])
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }

                });

                for(var i = 0; i < table.length; i++)
                {
                    if(table[i]["UserID"] == userInfo.globalUserdData["dwUserID"])
                    {
                        sparrowDirector.gameLayer.matchCurrentRank.setString("当前排名：" + (i + 1));
                    }
                }
            }

        });

        //比赛服务消息
        connectUtil.dataListenerManual(KernelPlaza, MatchInfoMainID, MatchInfoMsg.SUB_GP_MATCHREWARD ,function (data, size) {
            lm.log("收到比赛排名和奖励的消息");
            var matchID = DataUtil.ReadNumber(data, 32);
            var roundID = DataUtil.ReadNumber(data, 32);
            var rank = DataUtil.ReadNumber(data, 16);
            if(matchID != MatchAttendingInfo.MatchID || roundID != MatchAttendingInfo.RoundID) //hanhu #非当前进行的比赛不显示结算 2015/12/30
            {
                return;
            }
            //收到结算信息后立即排名
            //self.ComputeMatchRank();

            lm.log("读取奖励长度为: " + (size - 10) / 2);
            var msg = "";
            if((size - 10) / 2 > 1) //若奖励数据长度不大于1，则为被淘汰
            {
                msg = ReadString(data, (size - 10) / 2);
                msg = msg + "";
            }

            //移除等待界面
            self.RemoveWaitMessage();

            self.SetArrayValue(MatchUserInfoArray[matchID][roundID], "UserID", userInfo.globalUserdData["dwUserID"], "Rank", rank);
            //self.ShowRankView(type, msg);
            self.ShowMatchResultView(userInfo.globalUserdData["szNickName"], rank, msg);

            self.RemoveDataFromArray(MatchSignInArray, "MatchID", matchID);
            //重置数据
            MatchUserInfoArray[matchID][roundID] = [];
            MatchSitArray[matchID][roundID] = [];
            MatchAttendingInfo = {};
            self._userState[matchID] = UserStatus.wait;
        });
        //比赛结束
        connectUtil.dataListenerManual(KernelMatch, MatchServiceMainID, MatchMsg.MATCH_GM_END ,function (data, size) {
            lm.log("收到比赛完全结束的消息");
            sparrowDirector.SendUserAskStandup();
            //移除等待界面
            self.RemoveWaitMessage();
        });
        //比赛排名
        connectUtil.dataListenerManual(KernelPlaza, MatchInfoMainID, MatchInfoMsg.MATCH_GM_RANK ,function (data, size) {
            lm.log("收到玩家排名的消息");
            var matchID = DataUtil.ReadNumber(data, 32);
            var roundID = DataUtil.ReadNumber(data, 32);

            if(matchID == MatchAttendingInfo.MatchID && roundID == MatchAttendingInfo.RoundID)
            {
                var tempArray = new Array();
                lm.log("收到的排名玩家数量为" + ((size - 8) / 12));
                var count = (size - 8) / 12;
                for(var i = 0; i < count; i++)
                {
                    var UserID = DataUtil.ReadNumber(data, 32);
                    var Rank = DataUtil.ReadNumber(data, 32);
                    var Score = DataUtil.ReadNumber(data, 64);

                    //刷新玩家排名
                    if(UserID == userInfo.globalUserdData["dwUserID"] &&  sparrowDirector.gameLayer != undefined )
                    {
                        sparrowDirector.gameLayer.matchCurrentRank.setString("当前排名：" + Rank);
                        break;
                    }
                }

                //先进行小数组排序
                //tempArray.sort(function(a, b){
                //    if(a.Score < b.Score)
                //    {
                //        return true;
                //    }
                //    else
                //    {
                //        return false;
                //    }
                //});
                //
                //var deleteData = [];
                //var compute = 0;
                //for(var i = 0; i < count; i++)
                //{
                //    for(var j = 0; j < MatchUserInfoArray[matchID][roundID].length; j++) //删除原有数据
                //    {
                //        compute++;
                //        //lm.log("UserID = " + MatchUserInfoArray[j]["UserID"] + " tempUserID = " + tempArray[i]["UserID"]);
                //        if(MatchUserInfoArray[matchID][roundID][j]["UserID"] == tempArray[i]["UserID"]) {
                //            deleteData[i] = MatchUserInfoArray[matchID][roundID][j];
                //            MatchUserInfoArray[matchID][roundID].splice(j, 1);
                //            deleteData[i]["Score"] = tempArray[i]["Score"];
                //            //lm.log("保存的数据项为：j = " + j + " i = " + i + " data = " + JSON.stringify(deleteData[i]));
                //            break;
                //        }
                //    }
                //}
                //lm.log("用户数组长度为：" + MatchUserInfoArray[matchID][roundID].length);
                //for(var i = 0, index = 0; i < MatchUserInfoArray[matchID][roundID].length && index < count; i++) //插入新数据
                //{
                //    compute++;
                //    if(MatchUserInfoArray[matchID][roundID][i]["Score"] < tempArray[index]["Score"]) {
                //        //lm.log("插入的数据为：index = " + index + " i = "+ i + " data = " + JSON.stringify(deleteData[index]));
                //        deleteData[index]["Score"] = tempArray[index]["Score"];
                //        MatchUserInfoArray[matchID][roundID].splice(i, 0, deleteData[index]);
                //        index++;
                //    }
                //    else if(i == (MatchUserInfoArray[matchID][roundID].length - 1))
                //    {
                //        MatchUserInfoArray[matchID][roundID].splice(i, 0, deleteData[index]);
                //        index++;
                //    }
                //}
                ////lm.log("用户数组长度2为：" + MatchUserInfoArray.length);
                ////lm.log("排名计算次数为 ：" + compute);
                //self.ComputeMatchRank();
            }

        });
        //比赛重连成功
        connectUtil.dataListenerManual(KernelPlaza, MatchServiceMainID, MatchMsg.MATCH_GM_RECONNECT_OK ,function (data, size) {
            lm.log("收到比赛重连OK的消息");
            var MatchID = DataUtil.ReadNumber(data, 32);
            var RoundID = DataUtil.ReadNumber(data, 32);
            connectUtil.init(plazaMsgManager.address, self.ConnectPort, KernelMatch, function () {
            //connectUtil.init("192.168.5.10", 20007, KernelMatch, function () {
                lm.log("connect room success");
                //重置重连端口
                this._reconnectPort = 0;
                self._connectFlag = true;
                var dwUserID = userInfo.globalUserdData["dwUserID"];
                var sTicket = self.GetValueFromArray(MatchSignInArray, "MatchID", MatchID, "Ticket");
                //lm.log("发送的门票信息为:" + sTicket + " MatchID = " + MatchID);
                MatchAttendingInfo.MatchID = MatchID;
                MatchAttendingInfo.RoundID = RoundID;
                MatchAttendingInfo.MatchType = self.GetValueFromArray(MatchInfoArray, "MatchID", MatchID, "MatchType");
                connectUtil.sendManualNoCache(KernelMatch,
                    MatchLoginMainID,
                    MatchMsg.MATCH_GR_LOGIN,
                    78,
                    "32#" + MatchID,
                    "32#" + RoundID,
                    "32#" + dwUserID,
                    "33:" + sTicket);
            });
        });
        //比赛进行中重连OK
        connectUtil.dataListenerManual(KernelMatch, MatchReconectMainID, MatchReconectMsg.MATCH_RECONNECT_OK, function (SerializeObject, wDataSize) {
            lm.log("收到比赛重连成功的消息");
            self.ReConnectCount = 0;

            var RecieveIndex = DataUtil.ReadNumber(SerializeObject, 64);
            //lm.log("RecieveIndex = " + RecieveIndex);
            self.RecieveIndex = RecieveIndex;
            SendBuffer(KernelMatch, RecieveIndex);
        });

        //比赛需要重新登录
        connectUtil.dataListenerManual(KernelMatch, MatchReconectMainID , MatchReconectMsg.MATCH_NEED_RECONNECT, function (SerializeObject, wDataSize) {
            lm.log("收到比赛需要重新登陆的消息");
            self.RemoveWaitMessage();
            //self._matchInfoFlag = 0; //hanhu #退出比赛界面后重置显示标志 2015/08/31
            self._reconnectPort = self.ConnectPort;

            self._connectFlag = false;
            sparrowDirector.refreshAllScene();
            self.ReadyToLoginMatchcServer(MatchAttendingInfo.MatchID, MatchAttendingInfo.RoundID);
        });

        //比赛切换消息
        connectUtil.dataListenerManual(KernelPlaza, MatchInfoMainID, MatchInfoMsg.SUB_GP_MATCHSWITCH, function(data, size){
            var MatchID = DataUtil.ReadNumber(data, 32);
            var RoundID = DataUtil.ReadNumber(data, 32);
            var NextMatchID = DataUtil.ReadNumber(data, 32);

            self.RemoveWaitMessage();

            MatchAttendingInfo.MatchType = self.GetValueFromArray(MatchInfoArray,"MatchID", NextMatchID, "MatchType");
            lm.log("切换后的比赛数据为：" + JSON.stringify(MatchData[NextMatchID]));
            MatchAttendingInfo.MatchDetail = MatchData[NextMatchID][0][0];
            lm.log("收到切换比赛消息，需要切换的比赛ID为：" + NextMatchID + " 比赛类型为: " + MatchAttendingInfo.MatchType);
            self._matchInfoFlag = 0;  //重置标签以显示比赛信息
            //NewWebMsgManager.SendGpMatchFiled(NextMatchID, 0, function(data) {
            //        lm.log("从服务器获取到比赛信息 = " + JSON.stringify(data));
            //        MatchData[MatchID] = {};
            //        MatchData[MatchID][RoundID] = {};
            //        MatchData[MatchID][RoundID]["NextMatchInfo"] = data;
            //        //切换比赛数据
            //        for(var i in roomManager.matchroomdata)
            //        {
            //            if(roomManager.matchroomdata[i]["matchid"] == MatchID && roomManager.matchroomdata[i]["roundid"] == RoundID)
            //            {
            //                roomManager.matchroomdata[i] = data;
            //                roomManager.matchroomdata[i]["matchid"] = MatchID;
            //                roomManager.matchroomdata[i]["roundid"] = RoundID;
            //                break;
            //            }
            //        }
            //    },
            //    function(errinfo) {
            //
            //    },
            //    this);
        });

        //报名失败
        connectUtil.dataListenerManual(KernelPlaza, MatchInfoMainID, MatchInfoMsg.SUB_GP_SIGN_FAILED, function(data, size){
            var MatchID = DataUtil.ReadNumber(data, 32);
            var RoundID = DataUtil.ReadNumber(data, 32);
            self.MatchConditionNotice(MatchID);
            //var pop = new PopAutoTipsUILayer("条件不满足，无法进行预约/报名", 3);
            //layerManager.PopTipLayer(pop);
        });

        //报名状态消息
        connectUtil.dataListenerManual(KernelPlaza, MatchInfoMainID, MatchInfoMsg.SUB_GP_SIGNSTATUS, function(data, size){
            var MatchID = DataUtil.ReadNumber(data, 32);
            var RoundID = DataUtil.ReadNumber(data, 32);
            var ticket = ReadString(data, 33);

            var signInfo = {};
            signInfo.MatchID = MatchID;
            signInfo.RoundID = RoundID;
            signInfo.Ticket = ticket;
            //lm.log("报名成功获得的门票为:" + ticket);
            self.UpdataArray(MatchSignInArray, signInfo, "MatchID", MatchID);
            self.AddMatchTag(MatchID);

            //检测比赛是否已开始
            lm.log("MatchID = " + MatchID + " RoundID = " + RoundID);
            var isBegin = self.GetValueFromArray(MatchInfoArray, "MatchID", MatchID, "Begin");
            lm.log("比赛开始标签 = " + isBegin)
            if(isBegin == 1)
            {
                lm.log("发送重连消息");
                connectUtil.sendManual(KernelPlaza,
                    MatchServiceMainID,
                    MatchMsg.MATCH_GM_RECONNECT,
                    8,
                    "32#" + MatchID,
                    "32#" + RoundID);
                lm.log("MatchID = " + MatchID + " RoundID = " + RoundID);

            }

            //报名成功后请求奖励数据
            webMsgManager.SendGpMatchReward(MatchID, RoundID,function(data) {
                    //lm.log("从服务器获取到比赛奖励信息！");
                    roomManager.SetMatchRewardData(data);
                },
                function(errinfo) {

                }, this);
        });

        //比赛等待状态
        connectUtil.dataListenerManual(KernelPlaza, MatchInfoMainID, MatchInfoMsg.SUB_GP_MATCHWAITINGINFO, function(data, size){
            var MatchID = DataUtil.ReadNumber(data, 32);
            var RoundID = DataUtil.ReadNumber(data, 32);
            if(MatchID != MatchAttendingInfo.MatchID || RoundID != MatchAttendingInfo.RoundID || KernelCurrent != KernelMatch)
            {
                return;
            }
            var waitingType = DataUtil.ReadNumber(data, 8);
            var waitingInfo = DataUtil.ReadNumber(data, 32);
            lm.log("waitingType = " + waitingType + " info = " + waitingInfo);
            var des = "";
            switch(waitingType)
            {
                case MatchWaitingType_TimeDispatchFailedPlayer:
                {
                    des = "比赛人数不足，请等待分配......";
                    break;
                }
                case MatchWaitingType_TimeDispatchFailedTime:
                {
                    des = "比赛时间不足，请等待比赛结果......";
                    break;
                }
                case MatchWaitingType_RoundWaitingPlayerCount:
                {
                    des = "比赛人数不足，请等待下一轮......";
                    break;
                }
                case MatchWaitingType_RoundWaitingGameEnd:
                {
                    des = "请耐心等待下一轮分配......";
                    break
                }
            }
            self.RemoveWaitMessage();
            //self.ShowWaitMessage(des);

        });

        //比赛轮次信息
        connectUtil.dataListenerManual(KernelPlaza, MatchInfoMainID, MatchInfoMsg.SUB_GP_MATCHTYPECONFIG, function(data, size){
            var MatchID = DataUtil.ReadNumber(data, 32);
            var RoundID = DataUtil.ReadNumber(data, 32);
            var MatchType = DataUtil.ReadNumber(data, 32);
            var TypeInfo = DataUtil.ReadNumber(data, 32);
            lm.log("收到轮次信息 MactchType = " + MatchType + " TypeInfo = " + TypeInfo);
            if(MatchAttendingInfo.MatchType == MatchType && MatchID == MatchAttendingInfo.MatchID && RoundID == MatchAttendingInfo.RoundID)
            {
                if(self.subRoundLabel != null && self.subRoundLabel != undefined)
                {
                    self.subRoundLabel.setString(TypeInfo);
                }

                //更新直接晋级名次,总场次信息
                var roundInfo = MatchAttendingInfo.MatchDetail["MatchByRound"][TypeInfo - 1]
                lm.log("roundInfo = " + JSON.stringify(roundInfo));
                var directRise = roundInfo["DirectRiseRank"];
                var totalCount = roundInfo["PlayCount"];

                if(self.directRiseLabel != null && self.directRiseLabel != undefined)
                {
                    if(directRise > 1)
                    {
                        self.directRiseLabel.setString("前 " + directRise + " 名直接晋级");
                    }
                    else
                    {
                        self.directRiseLabel.setString("第 " + directRise + " 名直接晋级");
                    }
                }
                if(TypeInfo != MatchAttendingInfo.RoundNum)
                {
                    //hanhu #局数在这里不进行设置 2015/12/30
                    //self.subPlayCount.setString("1");
                    if(self.subRoundLabel != null && self.subRoundLabel != undefined)
                    {
                        self.subRoundLabel.setString(TypeInfo);
                    }
                    MatchAttendingInfo.RoundNum = TypeInfo;
                }

                if(self.totalPlayCount != null && self.totalPlayCount != undefined)
                {
                    self.totalPlayCount.setString("/" + totalCount + "局");
                }
            }

        });

        connectUtil.dataListenerManual(KernelMatch, MatchLoginMainID, MatchMsg.MATCH_GM_CIRCLE  , function (data, size)
        {
            var curCircul = DataUtil.ReadNumber(data, 16);
            lm.log("当前局数为:" + curCircul);
            if(self.subPlayCount != undefined)
            {
                self.subPlayCount.setString(curCircul);
            }

        });

        connectUtil.dataListenerManual(KernelPlaza, MatchInfoMainID, MatchInfoMsg.SUB_GP_MATCHAPPOINTMENT, function(data, size){
            lm.log("预约成功");
            var matchID = DataUtil.ReadNumber(data, 32);
            var roundID = DataUtil.ReadNumber(data, 32);
            var ticket = ReadString(data, 33);
            lm.log("收到预约成功的消息，matchID = " + matchID + " roundID =" + roundID);

            var signInfo = {};
            signInfo.MatchID = matchID;
            signInfo.RoundID = roundID;
            signInfo.Ticket = ticket;
            lm.log("预约成功获得的门票为:" + ticket);
            self.UpdataArray(MatchSignInArray, signInfo, "MatchID", matchID);
            lm.log("预约成功，队列为：" + JSON.stringify(MatchSignInArray));
            self.AddMatchTag(matchID, 2);
        });

        connectUtil.dataListenerManual(KernelPlaza, MatchInfoMainID, MatchInfoMsg.SUB_GP_MATCHCANCELLAPPOINTMENT, function(data, size){
            lm.log("取消预约成功");
            var matchID = DataUtil.ReadNumber(data, 32);
            var roundID = DataUtil.ReadNumber(data, 32);
            if(self.GetValueFromArray(MatchSignInArray, "MatchID", matchID, "RoundID") == roundID)
            {
                self.RemoveDataFromArray(MatchSignInArray, "MatchID", matchID);
                self.RemoveMatchSignTag(matchID);
                self.PopMsg( "取消预约成功!", 3.0);
            }
            else
            {
                self.PopMsg("预约失败,请确认是否有参赛券再重试！", 3.0);
            }
        });

        connectUtil.dataListenerManual(KernelPlaza, MatchInfoMainID, MatchInfoMsg.SUB_GP_APPOINTMENTFORCECANCEL, function(data, size){
            lm.log("报名人数已满，取消预约");
            var matchID = DataUtil.ReadNumber(data, 32);
            var roundID = DataUtil.ReadNumber(data, 32);
            var roomdata = roomManager.GetMatchRoomData();
            var matchName = "";
            for(var k in roomdata)
            {
                if(roomdata[k]["matchid"] == matchID)
                {
                    matchName = roomdata[k]["matchname"];
                    break;
                }
            }
            self.RemoveDataFromArray(MatchSignInArray, "MatchID", matchID);
            self.RemoveMatchSignTag(matchID);
            self.PopMsg("【" +matchName + "】报名人数已满，预约取消......", 3.0);
        });

    },
    PopMsg : function(des, time)
    {
        var pop = new PopAutoTipsUILayer(des, time);
        //cc.director.getRunningScene().addChild(pop, 99999);
        layerManager.PopTipLayer(pop);
        lm.log("设置弹出 = " + des);
    },

    MatchSignInEx : function(MatchID, autoSign)
    {
        if(matchMsgManager.peopleMatchTipsLayer != null && matchMsgManager.peopleMatchTipsLayer != undefined)
        {
            return;
        }

        //加载时间赛详情弹窗
        matchMsgManager.peopleMatchTipsLayer = ccs.load("res/landlord/cocosOut/PeopleMatchTips.json").node;
        matchMsgManager.peopleMatchTipsLayer.matchId = MatchID;
        cc.director.getRunningScene().addChild(matchMsgManager.peopleMatchTipsLayer, 999);
        matchMsgManager.peopleMatchTipsLayer.ignoreAnchorPointForPosition(false);
        matchMsgManager.peopleMatchTipsLayer.setAnchorPoint(0.5,0.5);
        matchMsgManager.peopleMatchTipsLayer.setPosition(cc.p(winSize.width / 2, winSize.height / 2));

        //关闭按钮
        var btn_tips_back = ccui.helper.seekWidgetByName(matchMsgManager.peopleMatchTipsLayer, "btn_tips_back");
        btn_tips_back.matchId = MatchID;
        btn_tips_back.addTouchEventListener(function(sender, type){

            if(type == ccui.Widget.TOUCH_ENDED)
            {
                var flag = matchMsgManager.GetMatchSignInStatus(sender.matchId);
                if(flag)
                {
                    lm.log("btn_tips_back removeChild");
                    this.MatchSignIn(sender.matchId);
                }
                else
                {
                    matchMsgManager.peopleMatchTipsLayer.removeFromParent();
                    matchMsgManager.peopleMatchTipsLayer = null;
                }
            }
        }, this);

        //获取相关信息
        var showData = MatchShowInfo[MatchID];
        var matchBasicData = roomManager.GetMatchRoomData();
        var matchData = null;
        for(var i = 0; i < matchBasicData.length; i++)
        {
            if(matchBasicData[i]["matchid"] == MatchID)
            {
                matchData = matchBasicData[i];
                break;
            }
        }

        //设置奖励页
        var layer_tips_reward = ccui.helper.seekWidgetByName(matchMsgManager.peopleMatchTipsLayer, "layer_tips_reward");   //奖励
        {
            for(var i = 1; i <= 4; i++)
            {
                var reward = "暂无奖励";
                var Rewards = showData["ListMatchReward"];
                for(var index = 0; index < Rewards.length; index++)
                {
                    if(Rewards[index]["Rank"] == i)
                    {
                        reward = Rewards[index]["RewardContent"];
                        break;
                    }
                }

                var text_reward = ccui.helper.seekWidgetByName(layer_tips_reward, "text_reward_" + i);   //奖励
                text_reward.setString(reward);

            }
        }

        //报名按钮
        var btn_tips_button = ccui.helper.seekWidgetByName(matchMsgManager.peopleMatchTipsLayer, "btn_tips_button");
        btn_tips_button.loadTextures("canjia.png", "canjia.png", "", ccui.Widget.PLIST_TEXTURE);
        btn_tips_button.matchId = MatchID;

        btn_tips_button.addTouchEventListener(function(sender, type){
            if(type == ccui.Widget.TOUCH_ENDED)
            {
                var flag = matchMsgManager.GetMatchSignInStatus(sender.matchId);
                if(flag)
                {
                    lm.log("btn_tips_button removeChild");
                    this.MatchSignIn(sender.matchId);
                    //matchMsgManager.peopleMatchTipsLayer.removeFromParent();
                    //matchMsgManager.peopleMatchTipsLayer = null;
                }
                else
                {
                    this.MatchSignIn(sender.matchId);
                }
            }
        }, this);


        var flag = matchMsgManager.GetMatchSignInStatus(MatchID);
        if(flag == false && autoSign == true)
        {
            lm.log("yyp -> MatchSignInEx");
            this.MatchSignIn(MatchID);
            btn_tips_button.setTouchEnabled(false);
        }

        //更新人满赛提示框信息
        this.updatePeopleMatchTips(MatchID);
    },

    //更新人满赛提示框信息
    updatePeopleMatchTips: function (MatchID)
    {
        var self = this;

        if(matchMsgManager.peopleMatchTipsLayer == null || matchMsgManager.peopleMatchTipsLayer == undefined)
        {
            return;
        }

        if(matchMsgManager.peopleMatchTipsLayer.matchId == MatchID )
        {
            var matchBasicData = roomManager.GetMatchRoomData();
            var matchData = null;
            for(var i = 0; i < matchBasicData.length; i++)
            {
                if(matchBasicData[i]["matchid"] == MatchID)
                {
                    matchData = matchBasicData[i];
                    break;
                }
            }

            var layer_tips_reward = ccui.helper.seekWidgetByName(matchMsgManager.peopleMatchTipsLayer, "layer_tips_reward");   //奖励

            //进度条
            var signCount = matchMsgManager.GetValueFromArray(MatchInfoArray, "MatchID", MatchID, "SignCount"); //报名人数
            var startCount = matchData["startCount"];
            var percent = signCount / startCount * 100;

            lm.log("yyp: " + signCount + " " + startCount + " " + percent + " ")
            var lodingbar = ccui.helper.seekWidgetByName(layer_tips_reward, "LoadingBar");
            lodingbar.setPercent(percent);

            var text_progress = ccui.helper.seekWidgetByName(layer_tips_reward, "text_progress");
            text_progress.setString(signCount + "/"+ startCount + "人");


            //报名按钮
            var btn_tips_button = ccui.helper.seekWidgetByName(matchMsgManager.peopleMatchTipsLayer, "btn_tips_button");
            btn_tips_button.loadTextures("canjia.png", "canjia.png", "", ccui.Widget.PLIST_TEXTURE);

            //显示是否已报名
            var matchStatus = matchMsgManager.getMatchStatus(MatchID);
            if(matchMsgManager.GetMatchSignInStatus(MatchID))
            {
                if(matchStatus != MatchSignStatus.Appointed)//hanhu #判断是否为预约状态 2015/12/28
                {
                    btn_tips_button.loadTextures("btn_logout.png", "btn_logout.png", "", ccui.Widget.PLIST_TEXTURE);
                    btn_tips_button.setTouchEnabled(true);
                }
            }



        }
    },

    //begin added by lizhongqiang 2015-11-19 15:58
    //修改 比赛报名－ 渠道 0
    MatchSignIn : function(dwMatchID)
    {
        lm.log("yyp -> MatchSignIn");

        var flag = matchMsgManager.GetMatchSignInStatus(dwMatchID);
        if(flag)
        {
            lm.log("yyp -> MatchSignIn -> 已报名");
            //退赛
            var pop = new ConfirmPop(this, Poptype.yesno,"您已报名该比赛,是否退赛？");//ok
            pop.setYesNoCallback(
                function()
                {
                    matchMsgManager.MatchSignOut(dwMatchID);
                    if(matchMsgManager.peopleMatchTipsLayer != null && matchMsgManager.peopleMatchTipsLayer != undefined)
                    {
                        matchMsgManager.peopleMatchTipsLayer.removeFromParent();
                        matchMsgManager.peopleMatchTipsLayer = null;
                    }
                }
            );

            pop.addToNode(cc.director.getRunningScene());

            /*
            var Pop = new ConfirmNode("您已报名该比赛,是否退赛？", this, function(){
                matchMsgManager.MatchSignOut(dwMatchID);
            });
            cc.director.getRunningScene().addChild(Pop, 9999);
            var size = cc.director.getWinSize();
            Pop.setPosition(cc.p(size.width / 2, size.height / 2));
            */
        }
        else
        {
            lm.log("yyp -> MatchSignIn -> 未报名");
            //报名比赛
            //lm.log("报名比赛");
            //检查玩家是否已报名比赛
            if(0)//(MatchSignInArray.length > 0)
            {
                var pop = new ConfirmPop(this, Poptype.yesno,"您已报名其他比赛，请先退赛！");//ok
                pop.addToNode(cc.director.getRunningScene());
                //var Pop = new ConfirmNode("您已报名其他比赛，请先退赛！", this, function(){
                //
                //});
                //cc.director.getRunningScene().addChild(Pop, 9999);
                //var size = cc.director.getWinSize();
                //Pop.setPosition(cc.p(size.width / 2, size.height / 2));
            }
            else
            {
                var dwRoundID = this.GetValueFromArray(MatchInfoArray, "MatchID", dwMatchID, "RoundID"); //MatchData["Matches"][dwMatchID]["MatchRoundID"];
                var dwUserID = userInfo.globalUserdData["dwUserID"];
                var dwMatchSubID = dwRoundID;
                //重置重连端口
                //this._reconnectPort = 0;
                this._signInFlag = true;
                lm.log("yyp -> MatchSignIn -> 报名信息为: matchID =" + dwMatchID + " roundID= " + dwRoundID + " dwMatchSubID= " + dwMatchSubID + " UserID= " + dwUserID);
                connectUtil.sendManual(KernelPlaza,
                    MatchServerMainID,
                    MatchSignMsg.MATCH_USER_SIGN_IN,
                    14,
                    "32#" + dwMatchID,
                    "32#" + dwMatchSubID,
                    "32#" + dwUserID,
                    "16#0");
            }

        }


    },
    // end added by lizhongqiang 2015-11-19

    MatchSignOut : function(MatchID)
    {
        lm.log("yyp -> MatchSignOut");
        var currentRoundID = this.GetValueFromArray(MatchInfoArray, "MatchID", MatchID, "RoundID");  //MatchData["Matches"][MatchID]["MatchRoundID"];
        if(this.GetValueFromArray(MatchSignInArray, "MatchID", MatchID, "RoundID") == currentRoundID && currentRoundID != null)
        {
            var dwMatchSubID = currentRoundID;
            var dwUserID = userInfo.globalUserdData["dwUserID"];
            lm.log("退赛信息为 MatchID = "+ MatchID + "RoundID = " + dwMatchSubID + " UserID = " + dwUserID + " MathchStatus = " + MathchStatus);
            var MathchStatus = this.GetValueFromArray(MatchInfoArray, "MatchID", MatchID, "Begin");
            if(MathchStatus == 1) //比赛已开始则调用强退
            {
                lm.log("yyp -> MatchSignOut -> 用户退赛 强制");
                connectUtil.sendManual(KernelPlaza,
                    MatchServerMainID,
                    MatchMsg.MATCH_GM_EXIT,
                    12,
                    "32#" + MatchID,
                    "32#" + currentRoundID,
                    "32#" + userInfo.globalUserdData["dwUserID"]);
                //更新比赛状态
                this.RemoveDataFromArray(MatchSignInArray, "MatchID", MatchID);
                this.RemoveMatchSignTag(MatchID);
                this.PopMsg( "退赛成功!", 3.0);
            }
            else
            {
                lm.log("yyp -> MatchSignOut -> 用户退赛");
                connectUtil.sendManual(KernelPlaza,
                    MatchServerMainID,
                    MatchSignMsg.MATCH_SIGN_OUT,
                    12,
                    "32#" + MatchID,
                    "32#" + dwMatchSubID,
                    "32#" + dwUserID);
            }

        }

    },
    RemoveMatch: function(matchID, roundID)
    {
        currentMatchRoom = cc.director.getRunningScene().getChildByTag(ClientModuleType.MathField);
        if(currentMatchRoom != null)
        {
            currentMatchRoom.RemoveEndMatch(matchID, roundID);
        }
    },
    MatchUpdata:function(matchID)
    {
        currentMatchRoom = cc.director.getRunningScene().getChildByTag(ClientModuleType.MathField);
        if(currentMatchRoom != null)
        {
            currentMatchRoom.UpdataMatchInfo(matchID);
        }
    },
    MatchStart:function(MatchID)
    {
        currentMatchRoom = cc.director.getRunningScene().getChildByTag(ClientModuleType.MathField);
        if(currentMatchRoom != null)
        {
            currentMatchRoom.ShowStartMatch(MatchID);
        }

    },

    AddMatchTag : function(MatchID, type)
    {
        currentMatchRoom = cc.director.getRunningScene().getChildByTag(ClientModuleType.MathField);
        if(currentMatchRoom != null) {
            //currentMatchRoom.AddMatchTag(MatchID, type);
        }
    },

    GetMatchSignInStatus : function(MatchID)
    {
        var currentRoundID = this.GetValueFromArray(MatchInfoArray, "MatchID", MatchID, "RoundID");
        //lm.log("当前比赛为" + MatchID + " 场次为:" + currentRoundID);
        //lm.log("已报名该比赛的场次为:" + this.GetValueFromArray(MatchSignInArray, "MatchID", MatchID, "RoundID"));
        if(this.GetValueFromArray(MatchSignInArray, "MatchID", MatchID, "RoundID") == currentRoundID && currentRoundID != null)
        {
            //lm.log("该比赛已报名");
            return true;
        }
        //lm.log("该比赛未报名");
        return false;
    },
    StartMatchGame : function(matchID, roundID)
    {
        //判断用户是否在比赛中
        if(matchID == MatchAttendingInfo.MatchID && roundID == MatchAttendingInfo.RoundID)
        {
            lm.log("玩家正在参与这场比赛");
            //不做任何操作
        }
        else if(KernelCurrent == KernelMatch)
        {
            //进行退赛操作
            lm.log("退赛");
            this.ExitMatchGame();
            //清除数据
            //MatchUserInfoArray[matchID][roundID] = [];
            //MatchSitArray[matchID][roundID] = [];
            //当前正在比赛则退出到比赛界面
            KernelCurrent = KernelPlaza;
            this.ClearMatchData();
            var scene = new rootScene();
            var curLayer = new MainGameLayer();
            layerManager.addLayerToParent(curLayer, scene);
            cc.director.replaceScene(scene);
        }
        //判断用户是否在游戏中
        //lm.log("this._userState = " + this._userState);
        if(sparrowDirector.isPlayingGame && KernelCurrent == KernelGame)
        {
            lm.log("用户处于游戏中，先请求站起");

            sparrowDirector.SendUserAskStandup();
            sparrowDirector.gotoMatch = true;
        }
        else
        {
            lm.log("用户不处于比赛中，直接开启比赛");
            this.ReadyToLoginMatchcServer(matchID, roundID);
        }

    },
    ReadyToLoginMatchcServer : function(matchID, roundID, scene)
    {
        if(this._userState[matchID] == UserStatus.free)
        {
            lm.log("连接服务器 matchID = " + matchID + " roundID = " + roundID + " address = " + plazaMsgManager.address + " port = " + this.ConnectPort);
            //var Port = this.GetValueFromArray(MatchUserInfoArray, "UserID", userInfo.globalUserdData["dwUserID"], "Port");
            this.LoginMatchServer(matchID, roundID, plazaMsgManager.address, this.ConnectPort);
            //this.LoginMatchServer(matchID, roundID, "192.168.5.10", 20007);
            this._userState[matchID] = UserStatus.wait;
        }
        else
        {
            lm.log("等待用户ready消息");
            this._userState[matchID] = UserStatus.ready;
        }
        //增加等待界面
        //this.runAction(cc.sequence(cc.DelayTime(1), this.ShowWaitMessage(null, scene)));
        this.ShowWaitMessage();
    },
    LoginMatchServer : function(MatchID, RoundID, Address, Port)
    {
        var self = this;
        lm.log("serveraddress + " + Address + " " + Port);
        lm.log("向服务器进行报到操作，MatchID = " + MatchID + " RoundID = " + RoundID);
        //要避免重复链接
        if(this._connectFlag == false)
        {
            this._connectFlag = true;
            lm.log("1111");
            connectUtil.init(Address, Port, KernelMatch, function () {
                lm.log("connect room success");
                var dwUserID = userInfo.globalUserdData["dwUserID"];
                var sTicket = self.GetValueFromArray(MatchSignInArray, "MatchID", MatchID, "Ticket");
                lm.log("发送的门票信息为:" + sTicket + " matchID = " + MatchID + " 玩家ID= " + dwUserID + " ROUNDID = " + RoundID);

                lm.log("登陆比赛服务器");
                connectUtil.sendManualNoCache(KernelMatch,
                    MatchLoginMainID,
                    MatchMsg.MATCH_GR_LOGIN,
                    78,
                    "32#" + MatchID,
                    "32#" + RoundID,
                    "32#" + dwUserID,
                    "33:" + sTicket);

            }, function () {
                lm.log("match connection failed");
            });
        }
        else if(connectUtil._MatchConneting == 0) //只有比赛连接正常时才登录比赛
        {
            var dwUserID = userInfo.globalUserdData["dwUserID"];
            var sTicket = self.GetValueFromArray(MatchSignInArray, "MatchID", MatchID, "Ticket");
            lm.log("直接登录比赛服务器，不进行连接初始化:" + sTicket);
            lm.log("发送的门票信息为:" + sTicket + " matchID = " + MatchID + "玩家ID= " + dwUserID + " ROUNDID = " + RoundID);
            //MatchAttendingInfo.MatchID = MatchID;
            //MatchAttendingInfo.RoundID = RoundID;
            //lm.log("2222");
            lm.log(" 比赛消息索引 = " + connectUtil._lMatchRecvIndex);
            connectUtil.sendManualNoCache(KernelMatch,
                MatchLoginMainID,
                MatchMsg.MATCH_GR_LOGIN,
                78,
                "32#" + MatchID,
                "32#" + RoundID,
                "32#" + dwUserID,
                "33:" + sTicket);
        }



    },

    OpenMatchRoom : function(ServerAddr, ServerPort)
    {
        //更新当前的游戏类型
        lm.log("更新当前游戏类型为比赛模式");
        KernelCurrent = KernelMatch;

        lm.log("KernelCurrent = " + KernelCurrent);
        currentMatchRoom = null;

        //lm.log("玩家入桌");
        //重置玩家信息
        sparrowDirector.gameData.playerInfo = new Array();
        //首先传入玩家自己的信息
        var selfInfo = this.GetSubDataFromArray(MatchUserInfoArray[MatchAttendingInfo.MatchID][MatchAttendingInfo.RoundID], "UserID", userInfo.globalUserdData["dwUserID"]);
        var sitID = this.GetValueFromArray(MatchSitArray[MatchAttendingInfo.MatchID][MatchAttendingInfo.RoundID], "UserID", userInfo.globalUserdData["dwUserID"], "UserSit");
        var score = this.GetValueFromArray(MatchSitArray[MatchAttendingInfo.MatchID][MatchAttendingInfo.RoundID], "UserID", userInfo.globalUserdData["dwUserID"], "Score");
        lm.log("自己的座位为："+ sitID);
        selfInfo["UserSit"] = sitID;
        selfInfo["Score"] = score;
        sparrowDirector.EnterMatchRoom(selfInfo);

        var length = MatchSitArray[MatchAttendingInfo.MatchID][MatchAttendingInfo.RoundID].length;
        //lm.log("座位长度为:" + length);
        for(var i = 0; i < length; i++)
        {
            //lm.log("v[UserID] = " + MatchSitArray[i]["UserID"]);
            if(MatchSitArray[MatchAttendingInfo.MatchID][MatchAttendingInfo.RoundID][i]["UserID"] != userInfo.globalUserdData["dwUserID"])
            {
                var data = this.GetSubDataFromArray(MatchUserInfoArray[MatchAttendingInfo.MatchID][MatchAttendingInfo.RoundID], "UserID", MatchSitArray[MatchAttendingInfo.MatchID][MatchAttendingInfo.RoundID][i]["UserID"]);
                data["UserSit"] = MatchSitArray[MatchAttendingInfo.MatchID][MatchAttendingInfo.RoundID][i]["UserSit"];
                data["Score"] = MatchSitArray[MatchAttendingInfo.MatchID][MatchAttendingInfo.RoundID][i]["Score"];
                sparrowDirector.EnterMatchRoom(data);
            }
        }
        this._userState[MatchAttendingInfo.MatchID] = UserStatus.wait;
    },

    RemoveMatchSignTag : function(MatchID)
    {
        currentMatchRoom = cc.director.getRunningScene().getChildByTag(ClientModuleType.MathField);
        if(currentMatchRoom != null)
        {
            var matchType = matchMsgManager.GetValueFromArray(MatchInfoArray, "MatchID", MatchID, "MatchType");

            var scrollItem = currentMatchRoom.getScrollItem(MatchID);
            lm.log("yyp RemoveMatchSignTag : " + scrollItem);
            if(scrollItem == null)
            {
                return;
            }

            var text_signUp = ccui.helper.seekWidgetByName(scrollItem, "text_signUp");          //报名按钮上的文字标签
            text_signUp.setString("已退赛");

            var text_peopleCount = ccui.helper.seekWidgetByName(scrollItem, "text_peopleCount");//报名人数
            text_peopleCount.setString("");
            currentMatchRoom.UpdataMatchInfo(MatchID);

            /*
            var data =  currentMatchRoom.GetMatchPage(MatchID);
            var signText = ccui.helper.seekWidgetByName(data[0], "text_item_slogan_" + data[1]);
            signText.setString("已退赛");
            //var back = ccui.helper.seekWidgetByName(data[0], "btn_item_bk_" + data[1]).getChildByTag(SignStatusTag);
            //back.setString("可报名");
            var signCountLabel = ccui.helper.seekWidgetByName(data[0], "btn_item_bk_" + data[1]).getChildByTag(SignCountTag)
            signCountLabel.setString("");
            currentMatchRoom.UpdataMatchInfo(MatchID);
            */
        }
    },
    //更新数组或添加新的数据
    UpdataArray : function(array, data, key, value)
    {
        lm.log("更新数据 KEY = " + key + " value = " + value);
        var length = array.length;
        var flag = false;
        for(var i = 0; i < length; i++)
        {
            if(array[i][key] == value)
            {
                array[i] = data;
                flag = true;
                break;
            }
        }
        if(flag == false)
        {
            array[length] = data;
        }
    },
    //檢查數組中是否有某個數據
    CheckArray : function(array, key, value)
    {
        var length = array.length;
        for(var i = 0; i < length; i++)
        {
            if(array[i][key] == value)
            {
                return true;
            }
        }
        return false;
    },

    //删除数组中某个数据
    RemoveDataFromArray : function(array, key, value)
    {
        var length = array.length;
        for(var i =0; i < length; i++)
        {
            if(array[i][key] == value)
            {
                //array.remove(i);
                array.splice(i, 1);
                break;
            }
        }
    },

    //设置数组中某个元素的值
    SetArrayValue : function(array, mainKey, mainValue, newKey, newValue)
    {
        var length = array.length;
        for(var i = 0; i <length; i++)
        {
            if(array[i][mainKey] == mainValue) {
                array[i][newKey] = newValue;
                break;
            }
        }
    },

    //获取数组中的某项数据
    GetValueFromArray : function(array, mainKey, mainValue, key)
    {
        var length = array.length;
        for(var i = 0; i <length; i++)
        {
            if(array[i][mainKey] == mainValue)
            {
               //lm.log(JSON.stringify(array[i]));
               return array[i][key];
            }
        }
        return null;
    },
    //获取数组的某个子项
    GetSubDataFromArray : function(array, key, value)
    {
        var length = array.length;
        //lm.log("数组长度为:"+ length);
        for(var i = 0; i < length; i++)
        {
            //lm.log("v[key] = " + array[i][key] + "value= " + value)
            if(array[i][key] == value)
            {
                //lm.log("找到数据");
                return array[i];
            }
        }
        return null;
    },
    //计算玩家排名
    ComputeMatchRank : function()
    {
        //MatchUserInfoArray.sort(function(a, b){
        //   return a.Score < b.Score;
        //});

        //更新玩家排名
        for(var i = 0; i < MatchUserInfoArray[MatchAttendingInfo.MatchID][MatchAttendingInfo.RoundID].length; i++)
        {
            if(MatchUserInfoArray[MatchAttendingInfo.MatchID][MatchAttendingInfo.RoundID][i]["UserID"] == userInfo.globalUserdData["dwUserID"] &&  sparrowDirector.gameLayer != undefined )
            {
                sparrowDirector.gameLayer.matchCurrentRank.setString("当前排名：" + (i + 1));
                break;
            }
        }
    },

    ShowMatchResultView : function(name, rank, rewards)
    {
        var backLayer = cc.LayerColor.create(cc.color(0, 0, 0, 200));
        cc.director.getRunningScene().addChild(backLayer, 9999);
        var backGround = cc.Sprite.create("res/Match/result/MatchRewardFrame.png");
        backLayer.addChild(backGround);
        backGround.setPosition(cc.p(winSize.width / 2, winSize.height / 2));

        var rankLabel = cc.LabelTTF.create(rank, "Arial", 30);
        rankLabel.setColor(cc.color(255, 1, 11));
        var des = null;
        if(rewards.length == 0)
        {
            des = cc.Sprite.create("res/Match/result/MatchRewardTextEliminate.png");
            des.addChild(rankLabel);
            rankLabel.setPosition(cc.p(des.getContentSize().width * 0.6, des.getContentSize().height * 0.48));
        }
        else
        {
            des = cc.Sprite.create("res/Match/result/MatchRewardTextWin.png")
            des.addChild(rankLabel);
            rankLabel.setPosition(cc.p(des.getContentSize().width * 0.88, des.getContentSize().height * 0.6));

            var rewardData = rewards.split("\r\n");
            for(var i = 0; i < rewardData.length; i++)
            {
                var rewardsLabel = cc.LabelTTF.create(rewardData[i], "Arial", 20);
                rewardsLabel.setAnchorPoint(cc.p(0, 0.5));
                rewardsLabel.setColor(cc.color(255, 103, 0));
                des.addChild(rewardsLabel);
                var x = des.getContentSize().width * 0.05 + des.getContentSize().width * 0.5 * (i % 2);
                var y = des.getContentSize().height * 0.2 * (Math.floor(i / 2) + 1);
                rewardsLabel.setPosition(cc.p(x, -y));
            }

        }
        backGround.addChild(des);
        des.setPosition(cc.p(backGround.getContentSize().width / 2, backGround.getContentSize().height * 0.6));

        var playerName = cc.LabelTTF.create(name, "Arial", 30);
        playerName.setAnchorPoint(cc.p(0, 0.5));
        playerName.setColor(cc.color(255, 1, 11));
        des.addChild(playerName);
        playerName.setPosition(cc.p(des.getContentSize().width * 0.15, des.getContentSize().height * 0.85));


        var shareButton = new ccui.Button();
        shareButton.loadTextures("btn_rd_nor.png", "btn_rd_nor.png", "", ccui.Widget.PLIST_TEXTURE);
        shareButton.setScale9Enabled(true);
        shareButton.setContentSize(cc.size(140, 80));
        shareButton.setTitleText("炫耀一下");
        shareButton.setTitleFontSize(30);
        backGround.addChild(shareButton, 99);
        var size = backGround.getContentSize();
        shareButton.setPosition(cc.p(size.width * 0.30, size.height * 0.20));
        shareButton.addTouchEventListener(function(sender, type){
            if(type == ccui.Widget.TOUCH_ENDED)
            {
                //进行分享操作
                DataUtil.ShareWeiXin();
            }
        }, this);

        var continueButton = new ccui.Button();
        continueButton.loadTextures("btn_gn_pre.png", "btn_gn_pre.png", "", ccui.Widget.PLIST_TEXTURE);
        continueButton.setScale9Enabled(true);
        continueButton.setContentSize(cc.size(140, 80));
        continueButton.setTitleText("退出游戏");
        continueButton.setTitleFontSize(30);
        backGround.addChild(continueButton, 99);
        continueButton.setPosition(cc.p(size.width * 0.62, size.height * 0.20));
        continueButton.addTouchEventListener(function(sender, type){
            if(type == ccui.Widget.TOUCH_ENDED)
            {
                cc.director.getRunningScene().removeChild(backLayer);
                var scene = new rootScene();
                var curLayer = new RoomUILayer();
                curLayer.setTag(ClientModuleType.MathField);
                layerManager.addLayerToParent(curLayer, scene);
                curLayer.refreshView(RoomType.ROOM_TYPE_MATCH);
                DataUtil.SetGoToModule(ClientModuleType.Plaza);
                cc.director.replaceScene(scene);

            }
        }, this)

        showActionFallDown(backGround, 1);
    },

    ShowRankView : function(type)
    {
        //测试结算界面
        //lm.log("显示排名界面");
        for(var i = 0; i < MatchUserInfoArray[MatchAttendingInfo.MatchID][MatchAttendingInfo.RoundID].length; i++)
        {
            if(MatchUserInfoArray[MatchAttendingInfo.MatchID][MatchAttendingInfo.RoundID][i]["UserID"] == userInfo.globalUserdData["dwUserID"])
            {
                lm.log("自己的排名为：" + (i + 1));
                var RankData = this.ConvertUserData(MatchUserInfoArray[MatchAttendingInfo.MatchID][MatchAttendingInfo.RoundID]);
                var RankLayer = new MatchRankLayer(this.currentMatchName, RankLayerType.MatchRankInEnd, RankData, i + 1, 0, type);
                cc.director.getRunningScene().addChild(RankLayer, 999);
            }
        }
    },
    ConvertUserData : function(org_data)
    {
        var data = {};
        var rewardData = roomManager.GetMatchRewardData();
        data.length = org_data.length;
        for(var i = 0; i < org_data.length; i++)
        {
            data[i] = {};
            data[i]["rankNumber"] = i + 1;
            data[i]["userHead"] = org_data[i]["FaceID"]+".png";
            data[i]["nickName"] = org_data[i]["NickName"];
            data[i]["score"] = org_data[i]["Score"];
            data[i]["change"] = org_data[i]["RankChange"];
            data[i]["changeNum"] = org_data[i]["RankChangeNum"];
            //lm.log("nickName = "+ org_data[i]["NickName"] + " changeNum = "+org_data[i]["RankChangeNum"]);
            //增加奖品
            for(var v in rewardData)
            {
                if(rewardData[v]["matchid"] == MatchAttendingInfo.MatchID && rewardData[v]["roundid"])
                {
                    var rewardList = rewardData[v]["rewardlist"];
                    for(var key in rewardList)
                    {
                        if(rewardList[key]["rankings"] == data[i]["rankNumber"])
                        {
                            data[i]["reward"] = rewardList[key]["descriptionlist"];
                            break;
                        }
                    }
                }
            }
        }
        return data;
    },
    ExitMatchGame : function(matchID, roundID)
    {
        var MatchID = 0;
        var RoundID = 0;
        if(matchID != undefined)
        {
            MatchID = matchID;
            RoundID = roundID;
        }
        else
        {
            MatchID = MatchAttendingInfo.MatchID;
            RoundID = MatchAttendingInfo.RoundID
        }
        connectUtil.sendManual(KernelPlaza,
            MatchServerMainID,
            MatchMsg.MATCH_GM_EXIT,
            12,
            "32#" + MatchID,
            "32#" + RoundID,
            "32#" + userInfo.globalUserdData["dwUserID"]);
        if(MatchID == MatchAttendingInfo.MatchID) //只有退出当前比赛时才会断开比赛连接
        {
            CloseGameSocket(KernelMatch);
            this._connectFlag = false;  //关闭比赛连接时将连接标志置为false
        }
        //更新比赛列表
        this.RemoveDataFromArray(MatchSignInArray, "MatchID", MatchID);
        this.RemoveMatchSignTag(MatchID);
        this._userState[matchID] = UserStatus.wait;

    },
    ShowWaitMessage : function(info, scene)
    {
        //等待标志
        var waitLayer = cc.Layer.create();

        //超过600秒后自动移出等待界面
        //waitLayer.schedule(function(){
        //    try{
        //        waitLayer.removeFromParent();
        //    }
        //    catch(exp){
        //        lm.log("移出等待界面失败");
        //    }
        //}, 900);

        waitLayer.onTouchBegan = function(sender, type){
            //lm.log("等待界面被点击");
            return true;
        };
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: waitLayer.onTouchBegan,
            onTouchMoved: waitLayer.onTouchMoved,
            onTouchEnded: waitLayer.onTouchEnded
        }, waitLayer);

        var wait = cc.Sprite.createWithSpriteFrameName("pop_tips_loading.png");
        var action = cc.repeatForever(cc.RotateBy.create(2, 360));
        wait.runAction(action);
        //背景
        var back = new cc.Scale9Sprite("pop_tips.png");
        back.setContentSize(cc.size(600, 60));
        back.setColor(cc.color(185 , 111, 4));
        back.addChild(wait);
        wait.setPosition(cc.p(30, 30));
        //描述
        var des = ccui.Text.create("正在分配比赛桌，请耐心等待。。。", "Arial", 25);
        if(info != null)
        {
            des.setString(info);
        }
        des.setAnchorPoint(cc.p(0, 0.5));
        back.addChild(des);
        des.setPosition(80, 30);
        waitLayer.addChild(back);
        var size = cc.director.getWinSize();
        back.setPosition(cc.p(size.width / 2, size.height * 0.06));
        back.setTag(Match_Wait_Image_Tag);
        if(scene != null)
        {
            scene.addChild(waitLayer, 999, WaitMessageTag);
        }
        else
        {
            cc.director.getRunningScene().addChild(waitLayer, 999, WaitMessageTag);
        }
    },
    RemoveWaitMessage : function()
    {
        //lm.log("移除等待界面");
        cc.director.getRunningScene().removeChildByTag(WaitMessageTag);
        //hanhu #比赛模式移除结算界面 2015/11/12
        try{
            sparrowDirector.gameLayer.removeChildByTag(10086);
        }
        catch (exp){
            lm.log("清除结算界面失败");
        }

    },
    ShowMatchInfo : function(pos)
    {
        lm.log("显示比赛剩余时间， flag = " +  this._matchInfoFlag);
        if(this._matchInfoFlag == 1)
        {
            return;
        }

        this._matchInfoFlag = 1;
        lm.log("matchData = " + JSON.stringify(MatchAttendingInfo.MatchDetail));
        var matchName = MatchAttendingInfo.MatchDetail["matchname"];
        this.currentMatchName = matchName;
        //lm.log("matchName0 = " + MatchAttendingInfo.MatchDetail[0]["matchname"]);
        lm.log("matchName = " + matchName);
        var Matchlabel = cc.LabelTTF.create(matchName, "Arial", 30);
        if(this.Matchlabel != undefined)
        {
            try{
                this.Matchlabel.removeFromParent();
            }
            catch (exp){
                lm.log("移出比赛名称失败");
            }
        }
        this.Matchlabel = Matchlabel;
        sparrowDirector.gameLayer.addChild(Matchlabel);
        Matchlabel.setAnchorPoint(0, 1);
        Matchlabel.setPosition(pos);
        Matchlabel.setColor(cc.color(255, 255, 11));
        //计算剩余时间
        lm.log("比赛类型为：" + MatchAttendingInfo.MatchType);
        if(MatchAttendingInfo.MatchDetail["matchType"] != MatchType.TimeLimitedMatch) //如果不为时限赛则不进行时间显示,直接显示轮回赛信息
        {
            matchMsgManager.showRoundMatchInfo(MatchAttendingInfo.MatchDetail);
            if(this.timelabel != undefined)
            {
                try{
                    this.timelabel.setVisible(false);
                }
                catch (exp){
                    lm.log("移出比赛时间失败");
                }
            }
            return;
        }
        else
        {
            matchMsgManager.hideRoundMatchInfo();
        }

        var matchEnd = MatchAttendingInfo.MatchDetail["endtime"];
        matchEnd =  matchEnd.replace(/-/g,"/");
        var EndTime = new Date(matchEnd);
        var matchStart = MatchAttendingInfo.MatchDetail["starttime"];
        matchStart = matchStart.replace(/-/g,"/");
        var StartTime = new Date(matchStart);
        var matchTime = this.computeTime(StartTime, EndTime);
        lm.log("StatTime = " + StartTime + " EndTime = " + EndTime + " matchTime = " + matchTime);
        //实际开始时间
        var realStartTime = MatchAttendingInfo.MatchDetail["realstarttime"];
        realStartTime = realStartTime.replace(/-/g,"/");
        var RealTime = new Date(realStartTime);

        var timeLabel = cc.LabelTTF.create("0:0:0", "", 22);
        this.timelabel = timeLabel;
        if(this.timelabel != undefined)
        {
            try{
                this.timelabel.removeFromParent();
            }
            catch (exp){
                lm.log("移出比赛时间失败");
            }
        }
        sparrowDirector.gameLayer.addChild(timeLabel);
        timeLabel.setAnchorPoint(0, 1);
        timeLabel.setPosition(cc.p(pos.x + 90 , pos.y - Matchlabel.getContentSize().height));
        var updataTime = function(){
            var curDate = new Date();
            var CurrentDate = new Date(curDate.getTime() + DataUtil.GetServerInterval());
            var timePassed = matchMsgManager.computeTime(RealTime, CurrentDate);
            var dif = matchTime - timePassed;
            lm.log("curDate = " + CurrentDate + " RealTime = " + RealTime + " timePass = " + timePassed);
            lm.log("比赛剩余时间为:" + dif);
            var hour = Math.floor(dif / 3600);
            var minute = Math.floor((dif - hour * 3600) / 60);
            var second = Math.floor(dif - hour * 3600 - minute * 60);

            if(hour < 0 || minute < 0 || second < 0)
            {
                sparrowDirector.gameLayer.unschedule();
                return;
            }
            //转换格式
            if(hour < 10)
            {
                if(hour == 0)
                {
                    hour = "";
                }
                else
                {
                    hour = 0 + "" + hour;
                }
            }

            if(minute < 10) minute = 0 + "" + minute;
            if(second < 10) second = 0 + "" + second;
            if(MatchAttendingInfo.MatchType == MatchType.TimeLimitedMatch)
            {
                timeLabel.setString("时间剩余" + hour+":"+minute+":"+second);
            }
        }
        if(MatchAttendingInfo.MatchType == MatchType.TimeLimitedMatch)
        {
            lm.log("启动计时器");
            sparrowDirector.gameLayer.schedule(updataTime, 1);
        }


    },

    computeTime : function(timeData1, timeData2)
    {
        var Hour1 = timeData1.getHours();
        var Minute1 = timeData1.getMinutes();
        var Second1 = timeData1.getSeconds();

        var Hour2 = timeData2.getHours();
        var Minute2 = timeData2.getMinutes();
        var Second2 = timeData2.getSeconds();

        var dif = (Hour2 * 3600 + Minute2 * 60 + Second2) - (Hour1 * 3600 + Minute1 * 60 + Second1);

        return dif;
    },

    showRoundMatchInfo : function(data) //显示轮回赛信息
    {
        lm.log("yyp showRoundMatchInfo" + JSON.stringify(data));
        var len = data["MatchByRound"].length; //总共有多少轮
        var totalPlayer = data["MatchByRound"][0]["RiseRank"];  //当前轮次总人数
        var totalCount = data["MatchByRound"][0]["PlayCount"];  //当前轮次要玩多少局
        var directRise = data["MatchByRound"][0]["DirectRiseRank"]; //直接晋级名次

        this.subRoundLabel = cc.LabelTTF.create("1", "Arial", 20);
        this.totalRoundLabel = cc.LabelTTF.create("/" + len + "轮", "Arial", 20);

        this.subPlayCount = cc.LabelTTF.create("1", "Arial", 20);
        this.totalPlayCount = cc.LabelTTF.create("/" + totalCount + "局", "Arial", 20);

        if(directRise > 1)
        {
            this.directRiseLabel = cc.LabelTTF.create("前 " + directRise + " 名直接晋级", "Arial", 20);
        }
        else
        {
            this.directRiseLabel = cc.LabelTTF.create("第 " + directRise + " 名直接晋级", "Arial", 20);
        }

        //sparrowDirector.gameLayer.matchCurrrentRate.setVisible(false);
        //sparrowDirector.gameLayer.matchCurrentRank.setVisible(false);

        sparrowDirector.gameLayer.addChild(this.subRoundLabel, 9999);
        this.subRoundLabel.setAnchorPoint(cc.p(0, 0.5));
        this.subRoundLabel.setPosition(cc.p(winSize.width * 0.8, winSize.height * 0.90));

        sparrowDirector.gameLayer.addChild(this.totalRoundLabel, 9999);
        this.totalRoundLabel.setAnchorPoint(cc.p(0, 0.5));
        this.totalRoundLabel.setPosition(cc.p(winSize.width * 0.8 + this.subRoundLabel.getContentSize().width, winSize.height * 0.90));

        sparrowDirector.gameLayer.addChild(this.subPlayCount, 9999);
        this.subPlayCount.setAnchorPoint(cc.p(0, 0.5));
        this.subPlayCount.setPosition(cc.p(winSize.width * 0.8, winSize.height * 0.85));

        sparrowDirector.gameLayer.addChild(this.totalPlayCount, 9999);
        this.totalPlayCount.setAnchorPoint(cc.p(0, 0.5));
        this.totalPlayCount.setPosition(cc.p(winSize.width * 0.8 + this.subPlayCount.getContentSize().width, winSize.height * 0.85));

        sparrowDirector.gameLayer.addChild(this.directRiseLabel, 9999);
        this.directRiseLabel.setAnchorPoint(cc.p(0, 0.5));
        this.directRiseLabel.setPosition(cc.p(winSize.width * 0.8, winSize.height * 0.8));
    },

    hideRoundMatchInfo : function()
    {
        if(this.subRoundLabel != undefined)
        {
            this.subRoundLabel.setVisible(false);
        }
        if(this.totalRoundLabel != undefined)
        {
            this.totalPlayCount.setVisible(false);
        }
        if(this.subPlayCount != undefined)
        {
            this.subPlayCount.setVisible(false);
        }
        if(this.totalPlayCount != undefined)
        {
            this.totalPlayCount.setVisible(false);
        }
        if(this.directRiseLabel != undefined)
        {
            this.directRiseLabel.setVisible(false);
        }
    },

    //清理比赛数据
    ClearMatchData : function()
    {
        lm.log("清理数据");
        //MatchUserInfoArray = [];
        //MatchSitArray = [];
        //MatchSignInArray = [];
        //MatchAttendingInfo = {};
        this._userState = [];//UserStatus.wait;
        this._connectFlag = false;
        this._signInFlag = false;
        this._reconnectKey = 0;
        this._reconnectPort = 0;
        this.RemoveWaitMessage();
        this._matchInfoFlag = 0;
        KernelCurrent = null;
        this.subRoundLabel = undefined;
        this.totalRoundLabel = undefined;
        this.subPlayCount = undefined;
        this.totalPlayCount = undefined;
        this.directRiseLabel = undefined;
    },

    ExcuteUserReady : function()
    {
        lm.log("执行用户准备消息，matchID = " + MatchAttendingInfo.MatchID);
        lm.log("准备队列信息为 : " + JSON.stringify(MatchUserReadyArray));
        for(var i = 0; i < MatchUserReadyArray.length; i++)
        {
            if(MatchUserReadyArray[i]["MatchID"] == MatchAttendingInfo.MatchID && MatchUserReadyArray[i]["RoundID"] == MatchAttendingInfo.RoundID)
            {
                this.ConnectPort = MatchUserReadyArray[i]["Port"];

                this.SetArrayValue(MatchUserInfoArray[MatchAttendingInfo.MatchID][MatchAttendingInfo.RoundID], "UserID", userInfo.globalUserdData["dwUserID"], "Port", MatchUserReadyArray[i]["Port"]);
                if(this._userState[MatchAttendingInfo.MatchID] == UserStatus.ready || KernelCurrent == KernelMatch) //玩家已准备好进入游戏
                {
                    this._userState[MatchAttendingInfo.MatchID] = UserStatus.wait;
                    this.LoginMatchServer(MatchUserReadyArray[i]["MatchID"], MatchUserReadyArray[i]["RoundID"], plazaMsgManager.address, MatchUserReadyArray[i]["Port"]);
                    //this.LoginMatchServer(MatchUserReadyArray[i]["MatchID"], MatchUserReadyArray[i]["RoundID"], "192.168.5.10", 20007);
                }
                else
                {
                    this._userState[MatchAttendingInfo.MatchID] = UserStatus.free;  //玩家可自由选择连接服务器时间
                }

                //更新比赛倍率
                this.orgMatchRate = MatchUserReadyArray[i]["Score"];
                if(sparrowDirector.gameLayer != undefined)
                {
                    try{
                        sparrowDirector.gameLayer.matchCurrrentRate.setString("当前倍率：" + MatchUserReadyArray[i]["Score"]);
                    }
                    catch (exp){
                        lm.log("处理准备队列，设置当前比赛倍率失败");
                    }

                }
                MatchUserReadyArray = [];
                break;
            }
        }
    },

    //显示时间赛详情弹窗
    showMatchAppointmentInfoEx : function(MatchID, autoSign)
    {
        if(matchMsgManager.timeMatchTipsLayer != null && matchMsgManager.timeMatchTipsLayer != undefined)
        {
            return;
        }

        var self = this;

        lm.log("yyp showMatchAppointmentInfoEx");
        //加载时间赛详情弹窗
        matchMsgManager.timeMatchTipsLayer = ccs.load("res/landlord/cocosOut/TimeMatchTips.json").node;
        matchMsgManager.timeMatchTipsLayer.matchId = MatchID;
        cc.director.getRunningScene().addChild(matchMsgManager.timeMatchTipsLayer, 999);
        matchMsgManager.timeMatchTipsLayer.ignoreAnchorPointForPosition(false);
        matchMsgManager.timeMatchTipsLayer.setAnchorPoint(0.5,0.5);
        matchMsgManager.timeMatchTipsLayer.setPosition(cc.p(winSize.width / 2, winSize.height / 2));

        //关闭按钮
        var btn_tips_back = ccui.helper.seekWidgetByName(matchMsgManager.timeMatchTipsLayer, "btn_tips_back");
        btn_tips_back.addTouchEventListener(function(sender, type){
            if(type == ccui.Widget.TOUCH_ENDED)
            {
                matchMsgManager.timeMatchTipsLayer.removeFromParent();
                matchMsgManager.timeMatchTipsLayer = null;
            }
        }, this);



        //切换按钮
        var btn_tips_details = ccui.helper.seekWidgetByName(matchMsgManager.timeMatchTipsLayer, "btn_tips_details");   //详情
        var btn_rules = ccui.helper.seekWidgetByName(matchMsgManager.timeMatchTipsLayer, "btn_rules");     //赛制
        var btn_reward = ccui.helper.seekWidgetByName(matchMsgManager.timeMatchTipsLayer, "btn_reward");   //奖励

        //切换的layer
        var layer_tips_details = ccui.helper.seekWidgetByName(matchMsgManager.timeMatchTipsLayer, "layer_tips_details");   //详情
        var layer_tips_rules = ccui.helper.seekWidgetByName(matchMsgManager.timeMatchTipsLayer, "layer_tips_rules");     //赛制
        var layer_tips_reward = ccui.helper.seekWidgetByName(matchMsgManager.timeMatchTipsLayer, "layer_tips_reward");   //奖励

        //初始化显示详情
        //btn_tips_details.setTouchEnabled(true);
        //btn_rules.setTouchEnabled(false);
        //btn_reward.setTouchEnabled(true);

        btn_tips_details.loadTextures("btn_tips_details_normal.png", "btn_tips_details_normal.png", "", ccui.Widget.PLIST_TEXTURE);
        btn_rules.loadTextures("btn_tip_rules_press.png", "btn_tip_rules_press.png", "", ccui.Widget.PLIST_TEXTURE);
        btn_reward.loadTextures("btn_tip_reward_normal.png", "btn_tip_reward_normal.png", "", ccui.Widget.PLIST_TEXTURE);

        layer_tips_details.setVisible(false);
        layer_tips_rules.setVisible(true);
        layer_tips_reward.setVisible(false);

        //为切换按钮添加点击事件
        btn_tips_details.addTouchEventListener(function(sender, type){
            if(type == ccui.Widget.TOUCH_ENDED)
            {
                //btn_tips_details.setTouchEnabled(false);
                //btn_rules.setTouchEnabled(true);
                //btn_reward.setTouchEnabled(true);

                btn_tips_details.loadTextures("btn_tips_details_press.png", "btn_tips_details_press.png", "", ccui.Widget.PLIST_TEXTURE);
                btn_rules.loadTextures("btn_tip_rules_normal.png", "btn_tip_rules_normal.png", "", ccui.Widget.PLIST_TEXTURE);
                btn_reward.loadTextures("btn_tip_reward_normal.png", "btn_tip_reward_normal.png", "", ccui.Widget.PLIST_TEXTURE);

                layer_tips_details.setVisible(true);
                layer_tips_rules.setVisible(false);
                layer_tips_reward.setVisible(false);
            }
        }, this);

        btn_rules.addTouchEventListener(function(sender, type){
            if(type == ccui.Widget.TOUCH_ENDED)
            {
                //btn_tips_details.setTouchEnabled(true);
                //btn_rules.setTouchEnabled(false);
                //btn_reward.setTouchEnabled(true);

                btn_tips_details.loadTextures("btn_tips_details_normal.png", "btn_tips_details_normal.png", "", ccui.Widget.PLIST_TEXTURE);
                btn_rules.loadTextures("btn_tip_rules_press.png", "btn_tip_rules_press.png", "", ccui.Widget.PLIST_TEXTURE);
                btn_reward.loadTextures("btn_tip_reward_normal.png", "btn_tip_reward_normal.png", "", ccui.Widget.PLIST_TEXTURE);

                layer_tips_details.setVisible(false);
                layer_tips_rules.setVisible(true);
                layer_tips_reward.setVisible(false);
            }
        }, this);

        btn_reward.addTouchEventListener(function(sender, type){
            if(type == ccui.Widget.TOUCH_ENDED)
            {
                //btn_tips_details.setTouchEnabled(true);
                //btn_rules.setTouchEnabled(true);
                //btn_reward.setTouchEnabled(false);

                btn_tips_details.loadTextures("btn_tips_details_normal.png", "btn_tips_details_normal.png", "", ccui.Widget.PLIST_TEXTURE);
                btn_rules.loadTextures("btn_tip_rules_normal.png", "btn_tip_rules_normal.png", "", ccui.Widget.PLIST_TEXTURE);
                btn_reward.loadTextures("btn_tip_eward_press.png", "btn_tip_eward_press.png", "", ccui.Widget.PLIST_TEXTURE);

                layer_tips_details.setVisible(false);
                layer_tips_rules.setVisible(false);
                layer_tips_reward.setVisible(true);
            }
        }, this);


        //获取相关信息
        var showData = MatchShowInfo[MatchID];
        var matchBasicData = roomManager.GetMatchRoomData();
        var matchData = null;
        for(var i = 0; i < matchBasicData.length; i++)
        {
            if(matchBasicData[i]["matchid"] == MatchID)
            {
                matchData = matchBasicData[i];
                break;
            }
        }

        //设置详情页
        {
            var text_matchName = ccui.helper.seekWidgetByName(layer_tips_details, "text_matchName");   //比赛名称
            text_matchName.setString(matchData["matchname"]);

            var text_signName = ccui.helper.seekWidgetByName(layer_tips_details, "text_signName");     //报名时间
            text_signName.setString(matchData["signtime"]);

            var text_matchTime = ccui.helper.seekWidgetByName(layer_tips_details, "text_matchTime");   //比赛时间
            text_matchTime.setString(matchData["starttime"]);

            var text_signCondition = ccui.helper.seekWidgetByName(layer_tips_details, "text_signCondition");  //报名条件
            text_signCondition.setString(showData["SignCondition"]);

            var text_signCount = ccui.helper.seekWidgetByName(layer_tips_details, "text_signCount");   //报名人数
            text_signCount.setString(this.GetValueFromArray(MatchInfoArray, "MatchID", MatchID, "SignCount"));

            var text_matchRules = ccui.helper.seekWidgetByName(layer_tips_details, "text_matchRules");   //赛事玩法
            text_matchRules.setString("目前没有配置这个数据!");
        }

        //设置奖励页
        {
            for(var i = 1; i <= 4; i++)
            {
                var reward = "暂无奖励";
                var Rewards = showData["ListMatchReward"];
                for(var index = 0; index < Rewards.length; index++)
                {
                    if(Rewards[index]["Rank"] == i)
                    {
                        reward = Rewards[index]["RewardContent"];
                        break;
                    }
                }

                var text_reward = ccui.helper.seekWidgetByName(layer_tips_reward, "text_reward_" + i);   //奖励
                text_reward.setString(reward);

            }
        }

        //设置赛制页
        {
            for(var i = 1; i <= 4; i++)
            {
                var text_tips_rules = ccui.helper.seekWidgetByName(layer_tips_rules, "text_tips_rules_" + i);   //奖励
                text_tips_rules.setString("目前没有配置这个数据!");
            }
        }

        //报名按钮
        var btn_tips_button = ccui.helper.seekWidgetByName(matchMsgManager.timeMatchTipsLayer, "btn_tips_button");
        btn_tips_button.addTouchEventListener(function(sender, type){
            if(type == ccui.Widget.TOUCH_ENDED)
            {
                var status = self.getMatchStatus(MatchID);
                switch(status)
                {
                    case MatchSignStatus.AppointmentAllowed://可预约
                    case MatchSignStatus.SignAllowed:       //可报名
                    {
                        self.MatchSignIn(MatchID);          //去预约 报名
                        break;
                    }
                    case MatchSignStatus.Appointed:         //已预约
                    case MatchSignStatus.Signed:            //已报名
                    {
                        self.MatchSignOut(MatchID);         //去取消预约 报名
                        break;
                    }
                    case MatchSignStatus.Start:             //比赛已开始 关闭提示页面
                    {
                        matchMsgManager.timeMatchTipsLayer.removeFromParent();
                        matchMsgManager.timeMatchTipsLayer = null;
                        break;
                    }
                }
            }
        }, this);

        //自动预约
        var status = this.getMatchStatus(MatchID);
        if( (status == MatchSignStatus.AppointmentAllowed || status == MatchSignStatus.SignAllowed) && autoSign )
        {
            self.MatchSignIn(MatchID);          //去预约 报名
            btn_tips_button.setTouchEnabled(false);
        }

        this.updateTimeMatchTips(MatchID);
    },

    updateTimeMatchTips:function(MatchID)
    {
        lm.log("yyp updateTimeMatchTips" + " " + MatchID);
        var self = this;

        if(matchMsgManager.timeMatchTipsLayer == null || matchMsgManager.timeMatchTipsLayer == undefined)
        {
            return;
        }
        lm.log("yyp updateTimeMatchTips 1" + " " + MatchID);


        //报名人数
        var layer_tips_details = ccui.helper.seekWidgetByName(matchMsgManager.timeMatchTipsLayer, "layer_tips_details");   //详情
        var text_signCount = ccui.helper.seekWidgetByName(layer_tips_details, "text_signCount");   //报名人数
        text_signCount.setString(this.GetValueFromArray(MatchInfoArray, "MatchID", MatchID, "SignCount"));

        //报名按钮
        if(matchMsgManager.timeMatchTipsLayer.matchId == MatchID )
        {
            lm.log("yyp updateTimeMatchTips 2" + " " + MatchID);

            var btn_tips_button = ccui.helper.seekWidgetByName(matchMsgManager.timeMatchTipsLayer, "btn_tips_button");

            var matchStatus = this.getMatchStatus(MatchID);

            lm.log("yyp updateTimeMatchTips 3" + " " + MatchID);

            if(matchStatus == MatchSignStatus.AppointmentAllowed)   //可预约
            {
                btn_tips_button.loadTextures("btn_status_1.png", "btn_status_1.png", "", ccui.Widget.PLIST_TEXTURE);
            }
            else if(matchStatus == MatchSignStatus.SignAllowed)   //可报名
            {
                btn_tips_button.loadTextures("btn_status_2.png", "btn_status_2.png", "", ccui.Widget.PLIST_TEXTURE);
            }
            else if(matchStatus == MatchSignStatus.Appointed)   //已预约
            {
                btn_tips_button.setTouchEnabled(true);
                btn_tips_button.loadTextures("btn_status_3.png", "btn_status_3.png", "", ccui.Widget.PLIST_TEXTURE);
            }
            else if(matchStatus == MatchSignStatus.Signed)   //已报名
            {
                btn_tips_button.setTouchEnabled(true);
                btn_tips_button.loadTextures("btn_status_4.png", "btn_status_4.png", "", ccui.Widget.PLIST_TEXTURE);
            }
            else if(matchStatus == MatchSignStatus.Start)   //比赛已开始
            {
                btn_tips_button.loadTextures("btn_status_5.png", "btn_status_5.png", "", ccui.Widget.PLIST_TEXTURE);
            }

        }

    },

    showMatchAppointmentInfo : function(MatchID)
    {
        lm.log("yyp--showMatchAppointmentInfo 1：" + MatchID);
        var layer = cc.LayerColor.create(cc.color(0, 0, 0, 200));
        cc.director.getRunningScene().addChild(layer, 999);

        layer.onTouchBegan = function(sender, type){
            //lm.log("等待界面被点击");
            return true;
        };
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: layer.onTouchBegan,
            onTouchMoved: layer.onTouchMoved,
            onTouchEnded: layer.onTouchEnded
        }, layer);

        lm.log("yyp--showMatchAppointmentInfo 2：" + MatchID);
        var backGround = cc.Scale9Sprite("pop_box_bg.png");
        backGround.setContentSize(cc.size(768, 512));
        layer.addChild(backGround);
        backGround.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
        var backSize = backGround.getContentSize();

        lm.log("yyp--showMatchAppointmentInfo 3：" + MatchShowInfo[MatchID]);
        var matchShowData = MatchShowInfo[MatchID];
        var matchBasicData = roomManager.GetMatchRoomData();
        for(var i = 0; i < matchBasicData.length; i++)
        {
            if(matchBasicData[i]["matchid"] == MatchID)
            {
                matchBasicData = matchBasicData[i];
                break;
            }
        }
        lm.log("yyp--showMatchAppointmentInfo 4：" + MatchID);

        //比赛名称
        var MatchName = matchShowData["MatchName"];
        var NameLabel = cc.LabelTTF.create(MatchName, "Arial", 30);
        NameLabel.setColor(cc.color(235, 0, 11));
        backGround.addChild(NameLabel);
        NameLabel.setPosition(cc.p(backSize.width / 2, backSize.height * 0.9));
        lm.log("yyp--showMatchAppointmentInfo 5：" + MatchID);
        //开始时间
        var StartTime = matchShowData["NextMatchStart"].substring(0, 19);
        var StartTimeLabel = cc.LabelTTF.create("开始时间：" + StartTime, "Arial", 20);
        StartTimeLabel.setColor(cc.color(235, 0, 11));
        backGround.addChild(StartTimeLabel);
        StartTimeLabel.setPosition(cc.p(backSize.width / 2, backSize.height * 0.85));
        lm.log("yyp--showMatchAppointmentInfo 6：" + MatchID);
        //报名条件
        var SignCondition = matchShowData["SignCondition"];
        var SignConditionLabel = cc.LabelTTF.create("报名条件：" + SignCondition, "Arial", 20);
        SignConditionLabel.setColor(cc.color(235, 0, 11));
        backGround.addChild(SignConditionLabel);
        SignConditionLabel.setPosition(cc.p(backSize.width / 2, backSize.height * 0.80));


        //比赛奖励
        var RewardLabel = cc.LabelTTF.create("比赛奖励", "Arial", 20);
        RewardLabel.setColor(cc.color(235, 0, 11));
        backGround.addChild(RewardLabel);
        RewardLabel.setPosition(cc.p(backSize.width / 2, backSize.height * 0.75));

        var RewardView = new ccui.ScrollView(); //cc.ScrollView.create(cc.size(420, 96));
        RewardView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        RewardView.setContentSize(cc.size(700, 280));
        RewardView.setTouchEnabled(true);
        RewardView.setBounceEnabled(true);
        var Rewards = matchShowData["ListMatchReward"];

        lm.log("yyp--showMatchAppointmentInfo 7：" + MatchID);
        var num = 0;
        if(Rewards.length != 0)
        {
            num = 1;
        }
        for(var i = 0; i < Rewards.length; i++)
        {
            if(i != (Rewards.length - 1) && Rewards[i]["Rank"] != Rewards[i + 1]["Rank"])
            {
                num++;
            }
        }
        lm.log("比赛奖励数量为：" + num);
        var height = 92 * num;
        RewardView.setInnerContainerSize(cc.size(700, height));
        RewardView.setBackGroundColor(cc.color(233, 0, 88));
        RewardView.setPosition(cc.p(backSize.width * 0.5, backSize.height * 0.44));
        RewardView.setAnchorPoint(cc.p(0.5, 0.5));
        backGround.addChild(RewardView);
        var rewardList = "";
        lm.log("奖品长度为：" + Rewards.length);
        for(var i = 0; i < Rewards.length; i++)
        {
            if(i != (Rewards.length - 1) && Rewards[i]["Rank"] == Rewards[i + 1]["Rank"])
            {
                rewardList = rewardList + Rewards[i]["RewardContent"] + "\n";
            }
            else
            {
                rewardList = rewardList + Rewards[i]["RewardContent"];
                var rank = Rewards[i]["Rank"];
                var RewardLabel = cc.LabelTTF.create("第 " + rank + "名", "Arial", 20);
                var RewardList = cc.LabelTTF.create(rewardList, "Arial", 15);

                var item = cc.Scale9Sprite("btn_rd_pre.png");
                item.setContentSize(cc.size(500, 90));
                item.setAnchorPoint(cc.p(0, 0));
                item.addChild(RewardLabel);
                item.addChild(RewardList);
                RewardLabel.setPosition(cc.p(40, 45));
                RewardList.setPosition(cc.p(400, 45));


                RewardView.addChild(item);
                item.setPosition(cc.p(backSize.width * 0.14, height - 92 * rank));

                rewardList = "";
            }
            //lm.log("奖品列表为 : " + rewardList);
        }


        var matchStatus = this.getMatchStatus(MatchID);

        var SignButton = new ccui.Button();
        SignButton.loadTextures("btn_gn_pre.png", "btn_gn_pre.png", "", ccui.Widget.PLIST_TEXTURE);
        SignButton.setScale9Enabled(true);
        SignButton.setContentSize(cc.size(140, 80));
        if(matchStatus == MatchSignStatus.AppointmentAllowed)   //可预约
        {
            SignButton.setTitleText("预约");
        }
        else if(matchStatus == MatchSignStatus.SignAllowed)   //可报名
        {
            SignButton.setTitleText("报名");
        }
        else if(matchStatus == MatchSignStatus.Appointed)   //已预约
        {
            SignButton.setTitleText("取消预约");
        }
        else if(matchStatus == MatchSignStatus.Signed)   //已报名
        {
            SignButton.setTitleText("取消报名");
        }
        else if(matchStatus == MatchSignStatus.Start)   //比赛已开始
        {
            SignButton.setTitleText("已过期");
        }
        SignButton.setTitleFontSize(30);
        backGround.addChild(SignButton);
        SignButton.setPosition(cc.p(backSize.width * 0.5, backSize.height * 0.10));

        var self = this;
        SignButton.addTouchEventListener(function(sender, type){
            if(type == ccui.Widget.TOUCH_ENDED)
            {
                cc.director.getRunningScene().removeChild(layer);
                var status = self.getMatchStatus(MatchID);
                switch(status)
                {
                    case MatchSignStatus.AppointmentAllowed:
                    case MatchSignStatus.SignAllowed:
                    {
                        self.MatchSignIn(MatchID);
                        break;
                    }
                    case MatchSignStatus.Appointed:
                    case MatchSignStatus.Signed:
                    {
                        self.MatchSignOut(MatchID);
                        break;
                    }
                    case MatchSignStatus.Start:
                    {
                        lm.log("比赛已开始");
                        break;
                    }
                }

            }
        }, this);

        var ExitButton = new ccui.Button();
        ExitButton.loadTextures("01_login_bt_logoff_nor.png", "01_login_bt_logoff_nor.png", "", ccui.Widget.PLIST_TEXTURE);
        backGround.addChild(ExitButton);
        ExitButton.setPosition(cc.p(backSize.width * 0.98, backSize.height * 0.97));
        ExitButton.addTouchEventListener(function(sender, type){
            if(type == ccui.Widget.TOUCH_ENDED)
            {
                cc.director.getRunningScene().removeChild(layer);
            }
        }, this);
    },

    getMatchStatus : function(matchID)
    {
        var matchData = roomManager.GetMatchRoomData();
        var data = {};
        for(var k in matchData) {
            if (matchData[k]["matchid"] == matchID)
            {
                data = matchData[k];
                break;
            }
        }
        var NowDate = new Date(new Date().getTime() + DataUtil.GetServerInterval());

        var SignTime = data["signtime"];
        SignTime = SignTime.replace(/-/g,"/");
        var SignDate = new Date(SignTime);

        var StartTime = data["starttime"];
        StartTime = StartTime.replace(/-/g, "/")
        var StartDate = new Date(StartTime);

        var isSigned = 1 && this.GetValueFromArray(MatchSignInArray, "MatchID", matchID, "RoundID");
        var result = 0;
        if(NowDate < SignDate)
        {
            if(isSigned)
            {
                result = MatchSignStatus.Appointed;
            }
            else
            {
                result = MatchSignStatus.AppointmentAllowed;
            }
        }
        else if(NowDate >= SignDate && NowDate < StartDate)
        {
            if(isSigned)
            {
                result = MatchSignStatus.Signed;
            }
            else
            {
                result = MatchSignStatus.SignAllowed;
            }
        }
        else
        {
            result = MatchSignStatus.Start
        }
        return result;
    },

    MatchConditionNotice : function(MatchID)
    {
        /*
        var matchData = MatchShowInfo[MatchID];

        var backGround = cc.Scale9Sprite("pop_box_bg.png");
        backGround.setContentSize(cc.size(600, 400));
        cc.director.getRunningScene().addChild(backGround, 9999);
        backGround.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
        var backSize = backGround.getContentSize();

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(){return true;},
            onTouchMoved: function(){return true;},
            onTouchEnded: function(){return true;}
        }, backGround);

        var title = cc.LabelTTF.create("报名失败", "Arial", 30);
        backGround.addChild(title);
        title.setPosition(cc.p(backSize.width / 2, backSize.height * 0.85));
        title.setColor(cc.color(255, 60, 20));

        var matchName = cc.LabelTTF.create("比赛名称：" + matchData["MatchName"], "Arial", 25);
        matchName.setAnchorPoint(cc.p(0, 0.5));
        backGround.addChild(matchName);
        matchName.setPosition(cc.p(backSize.width * 0.1, backSize.height * 0.75));
        matchName.setColor(cc.color(0, 0, 0));

        var matchCondition = cc.LabelTTF.create("比赛条件：" + matchData["SignCondition"], "Arial", 25);
        matchCondition.setAnchorPoint(cc.p(0, 0.5));
        backGround.addChild(matchCondition);
        matchCondition.setPosition(cc.p(backSize.width * 0.1, backSize.height * 0.6));
        matchCondition.setColor(cc.color(0, 0, 0));

        var tips = cc.LabelTTF.create("请确认满足所有参赛条件并再次报名", "Arial", 30);
        backGround.addChild(tips);
        tips.setPosition(cc.p(backSize.width / 2, backSize.height * 0.4));
        tips.setColor(cc.color(0, 0, 0));

        var CloseButton = new ccui.Button();
        CloseButton.loadTextures("btn_gn_pre.png", "btn_gn_pre.png", "", ccui.Widget.PLIST_TEXTURE);
        CloseButton.setScale9Enabled(true);
        CloseButton.setContentSize(cc.size(140, 80));
        CloseButton.setTitleText("关闭");
        CloseButton.setTitleFontSize(30);
        backGround.addChild(CloseButton);
        CloseButton.setPosition(cc.p(backSize.width * 0.5, backSize.height * 0.15));
        CloseButton.addTouchEventListener(function(sender, type){
            if(type == ccui.Widget.TOUCH_ENDED)
            {
                backGround.removeFromParent();
            }
        }, this);

*/
        //提示报名失败
        var pop = new ConfirmPop(this, Poptype.ok, "报名失败\n请确认满足所有参赛条件并再次报名");//ok
        pop.addToNode(cc.director.getRunningScene());

        //把时间赛提示-报名按钮重置为可点击
        if(matchMsgManager.timeMatchTipsLayer != null && matchMsgManager.timeMatchTipsLayer != undefined)
        {
            //报名按钮
            if(matchMsgManager.timeMatchTipsLayer.matchId == MatchID )
            {
                var btn_tips_button = ccui.helper.seekWidgetByName(matchMsgManager.timeMatchTipsLayer, "btn_tips_button");
                btn_tips_button.setTouchEnabled(true);
            }
        }

        //把人满赛赛提示-报名按钮重置为可点击
        if(matchMsgManager.peopleMatchTipsLayer != null && matchMsgManager.peopleMatchTipsLayer != undefined)
        {
            //报名按钮
            if(matchMsgManager.peopleMatchTipsLayer.matchId == MatchID )
            {
                var btn_tips_button = ccui.helper.seekWidgetByName(matchMsgManager.peopleMatchTipsLayer, "btn_tips_button");
                btn_tips_button.setTouchEnabled(true);
            }
        }


    }
});

var matchMsgManager = matchMsgManager || new MatchMsgManager();
