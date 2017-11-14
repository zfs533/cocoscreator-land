
/**
 * 龙虎斗消息 by zfs 20160602
 * @param self
 * @constructor
 */
function DragonListener(self)
{
	lm.log("龙虎斗消息定义－－龙虎斗消息")
	//游戏空闲
	connectUtil.dataListenerManualEx(DragonData_GameId_122.GAMEID, KernelCurrent, DragonData_GameId_122.GAME_MAIN_ID, DragonData_GameId_122.SUB_S_GAME_FREE,function(SereverlizeObject,wDataSize)
	{
		var data = {};
		data.type = "CMD_S_GameFree";
		//剩余时间
		data.cbTimeLeave = DataUtil.ReadNumber(SereverlizeObject, 8);

		//lm.log("龙虎斗 －－－－－－－－－－－－－－ 游戏空闲 CMD_S_GameFree -> [ " + JSON.stringify(data) + "]");
		self.addDataToReceivedArray(data);

		//dragonFight_GameID_122.dragonGameXian(data);
	});

	//游戏开始
	connectUtil.dataListenerManualEx(DragonData_GameId_122.GAMEID, KernelCurrent, DragonData_GameId_122.GAME_MAIN_ID, DragonData_GameId_122.SUB_S_GAME_START,function(SereverlizeObject,wDataSize)
	{
		var data = {};
		data.type = "CMD_S_GameStart";
		//剩余时间
		data.cbTimeLeave = DataUtil.ReadNumber(SereverlizeObject, 8);
		//庄家位置
		data.wBankerUser = DataUtil.ReadNumber(SereverlizeObject, 16);
		//庄家金币
		data.lBankerScore = DataUtil.ReadNumber(SereverlizeObject, 64);
		//列表人数
		data.nListUserCount = DataUtil.ReadNumber(SereverlizeObject, 16);

		//lm.log("龙虎斗 -> 游戏开始 CMD_S_GameStart -> [ " + JSON.stringify(data) + "]");
		self.addDataToReceivedArray(data);

		//dragonFight_GameID_122.dragonGameStart(data);

	});

	//用户下注
	connectUtil.dataListenerManualEx(DragonData_GameId_122.GAMEID, KernelCurrent, DragonData_GameId_122.GAME_MAIN_ID, DragonData_GameId_122.SUB_S_PLACE_JETTON,function(SereverlizeObject,wDataSize)
	{
		var data = {};
		data.type = "CMD_S_PlaceBet";
		//用户位置
		data.wChairID = DataUtil.ReadNumber(SereverlizeObject, 16);
		//筹码区域
		data.cbBetArea = DataUtil.ReadNumber(SereverlizeObject, 8);
		//加注数目
		data.lBetScore = DataUtil.ReadNumber(SereverlizeObject, 64);
		//区域总下注
		data.lAllAreaBet = [];
		for ( var i = 0; i < DragonData_GameId_122.AREA_MAX; i++ )
		{
			data.lAllAreaBet.push(DataUtil.ReadNumber(SereverlizeObject, 64));
		}

		//lm.log("龙虎斗 -> 用户下注 CMD_S_PlaceBet -> [ " + JSON.stringify(data) + "]");
		self.addDataToReceivedArray(data);

		//dragonFight_GameID_122.dragonGamePlaceBet(data);

	});

	//游戏结束
	connectUtil.dataListenerManualEx(DragonData_GameId_122.GAMEID, KernelCurrent, DragonData_GameId_122.GAME_MAIN_ID, DragonData_GameId_122.SUB_S_GAME_END,function(SereverlizeObject,wDataSize)
	{
		var data = {};
		data.type = "CMD_S_GameEnd";
		//剩余时间
		data.cbTimeLeave = DataUtil.ReadNumber(SereverlizeObject, 8);
		//桌面扑克
		data.cbCardData = [];
		for (var i = 0; i < 2; i++ )
		{
			data.cbCardData.push(DataUtil.ReadNumber(SereverlizeObject, 8));
		}
		//庄家当局成绩
		data.lBankerScore = DataUtil.ReadNumber(SereverlizeObject, 64);
		//庄家总成绩
		data.lBankerTotallScore = DataUtil.ReadNumber(SereverlizeObject, 64);
		//做庄次数
		data.nBankerTime = DataUtil.ReadNumber(SereverlizeObject, 32);
		//玩家区域成绩
		data.lPlayScore = [];
		for ( var i = 0; i < DragonData_GameId_122.AREA_MAX; i++ )
		{
			data.lPlayScore.push(DataUtil.ReadNumber(SereverlizeObject, 64));
		}
		//玩家总成绩
		data.lPlayAllScore = DataUtil.ReadNumber(SereverlizeObject, 64);
		//游戏税收
		data.lRevenue = DataUtil.ReadNumber(SereverlizeObject, 64);

		lm.log("龙虎斗 -> 游戏结束 CMD_S_GameEnd -> [ " + JSON.stringify(data) + "]");
		self.addDataToReceivedArray(data);
		//dragonFight_GameID_122.dragonGameEnd(data);
	});

	//申请庄家
	connectUtil.dataListenerManualEx(DragonData_GameId_122.GAMEID, KernelCurrent, DragonData_GameId_122.GAME_MAIN_ID, DragonData_GameId_122.SUB_S_APPLY_BANKER,function(SereverlizeObject,wDataSize)
	{
		var data = {};
		data.type = "CMD_S_ApplyBanker";
		//申请玩家
		data.wApplyUser = DataUtil.ReadNumber(SereverlizeObject, 16);

		lm.log("龙虎斗 -> 申请庄家 CMD_S_ApplyBanker -> [ " + JSON.stringify(data) + "]");
		self.addDataToReceivedArray(data);
	});

	//取消申请庄家
	connectUtil.dataListenerManualEx(DragonData_GameId_122.GAMEID, KernelCurrent, DragonData_GameId_122.GAME_MAIN_ID, DragonData_GameId_122.SUB_S_CANCEL_BANKER,function(SereverlizeObject,wDataSize)
	{
		var data = {};
		data.type = "CMD_C_CancelBanker";
		//取消玩家
		data.wCancelUser = DataUtil.ReadNumber(SereverlizeObject, 16);

		//lm.log("龙虎斗 -> 取消申请庄家 CMD_C_CancelBanker -> [ " + JSON.stringify(data) + "]");
		self.addDataToReceivedArray(data);
	});

	//切换庄家
	connectUtil.dataListenerManualEx(DragonData_GameId_122.GAMEID, KernelCurrent, DragonData_GameId_122.GAME_MAIN_ID, DragonData_GameId_122.SUB_S_CHANGE_BANKER,function(SereverlizeObject,wDataSize)
	{
		var data = {};
		data.type = "CMD_S_ChangeBanker";
		//当庄玩家
		data.wBankerUser = DataUtil.ReadNumber(SereverlizeObject, 16);
		//庄家分数
		data.lBankerScore = DataUtil.ReadNumber(SereverlizeObject, 64);

		//lm.log("龙虎斗 -> 切换庄家 CMD_S_ChangeBanker -> [ " + JSON.stringify(data) + "]");
		self.addDataToReceivedArray(data);
		//dragonFight_GameID_122.setPlayerInfo(data);
	});

	//失败结构，下注失败
	connectUtil.dataListenerManualEx(DragonData_GameId_122.GAMEID, KernelCurrent, DragonData_GameId_122.GAME_MAIN_ID, DragonData_GameId_122.SUB_S_PLACE_JETTON_FAIL,function(SereverlizeObject,wDataSize)
	{
		var data = {};
		data.type = "CMD_S_PlaceBetFail";
		//下注玩家
		data.wPlaceUser = DataUtil.ReadNumber(SereverlizeObject, 16);
		//下注区域
		data.lBetArea = DataUtil.ReadNumber(SereverlizeObject, 8);
		//当前下注
		data.lPlaceScore = DataUtil.ReadNumber(SereverlizeObject, 64);

		lm.log("龙虎斗 -> 失败结构，下注失败 CMD_S_PlaceBetFail -> [ " + JSON.stringify(data) + "]");
		self.addDataToReceivedArray(data);
	});
	//庄家列表
	connectUtil.dataListenerManualEx(DragonData_GameId_122.GAMEID, KernelCurrent, DragonData_GameId_122.GAME_MAIN_ID, DragonData_GameId_122.SUB_S_SEND_APPLYLIST,function(SereverlizeObject,wDataSize)
	{
		var data = {};
		data.type = "CMD_S_ApplyBanker";
		//申请个数
		data.iCount = DataUtil.ReadNumber(SereverlizeObject, 32);
		//申请者椅子号
		data.wApplyChair = [];
		for ( var i = 0; i < data.iCount; i++ )
		{
			data.wApplyChair.push(DataUtil.ReadNumber(SereverlizeObject, 16));
		}

		lm.log("龙虎斗 -> 庄家列表 CMD_S_ApplyBanker -> [ " + JSON.stringify(data) + "]");
		self.addDataToReceivedArray(data);
		//dragonFight_GameID_122.dragonGameApplyList(data);
	});
	//排行列表
	connectUtil.dataListenerManualEx(DragonData_GameId_122.GAMEID, KernelCurrent, DragonData_GameId_122.GAME_MAIN_ID, DragonData_GameId_122.SUB_S_RANKINFO,function(SereverlizeObject,wDataSize)
	{
		var data = {};
		data.type = "CMD_S_RankInfo";
		//申请个数
		data.iCount = DataUtil.ReadNumber(SereverlizeObject, 32);
		//玩家金币输赢
		data.lUserPlayScore = DataUtil.ReadNumber(SereverlizeObject, 64);
		//排行
		data["UserRank"] = [];
		for (var i = 0; i < data["iCount"]; i++)
		{
			var rannkData = {};
			//排行id
			rannkData["dwRank"] = DataUtil.ReadNumber(SereverlizeObject, 32);
			//用户id
			rannkData["dwUserID"] = DataUtil.ReadNumber(SereverlizeObject, 32);
			//用户昵称
			rannkData["szNickName"] = ReadString(SereverlizeObject, 32);
			//头像索引
			rannkData["wFaceID"] = DataUtil.ReadNumber(SereverlizeObject, 16);
			//自定标识
			rannkData["dwCustomID"] = DataUtil.ReadNumber(SereverlizeObject, 32);
			//金额
			rannkData["lScore"] = DataUtil.ReadNumber(SereverlizeObject, 64);


			data["UserRank"].push(rannkData);
		}

		//lm.log("龙虎斗 -> 排行列表 CMD_S_RankInfo -> [ " + JSON.stringify(data) + "]");
		self.addDataToReceivedArray(data);
		//dragonFight_GameID_122.dragonGameRanList(data);
	});
}

/**
 * 龙虎斗场景消息处理
 */
function DragonHandleSceneInfo(self, gamestatus, SerializeObject, wDataSzie)
{
	var data = {};
	lm.log("龙虎斗场景消息处理gamestatus= "+gamestatus);
	//空闲状态
	if(gamestatus == DragonData_GameId_122.GAME_SCENE_FREE)
	{
		data["type"] = "CMD_S_StatusFree";
		//剩余时间
		data.cbTimeLeave = DataUtil.ReadNumber(SerializeObject, 8);
		//玩家自由金币
		data["lPlayFreeSocre"] = DataUtil.ReadNumber(SerializeObject, 64);
		//当前庄家
		data["wBankerUser"] = DataUtil.ReadNumber(SerializeObject, 16);
		//庄家分数
		data["lBankerScore"] = DataUtil.ReadNumber(SerializeObject, 64);
		//庄家赢分
		data["lBankerWinScore"] = DataUtil.ReadNumber(SerializeObject, 64);
		//庄家局数
		data["wBankerTime"] = DataUtil.ReadNumber(SerializeObject, 16);
		//系统做庄
		data["bEnableSysBanker"] = DataUtil.ReadNumber(SerializeObject, 8);
		//申请条件
		data["lApplyBankerCondition"] = DataUtil.ReadNumber(SerializeObject, 64);
		//区域限制
		data["lAreaLimitScore"] = DataUtil.ReadNumber(SerializeObject, 64);

		//房间名称
		data["szGameRoomName"] = [];
		for (var i = 0; i < DragonData_GameId_122.SERVER_LEN; i++)
		{
			data["szGameRoomName"].push(DataUtil.ReadNumber(SerializeObject, 1024));
		}

		self.addDataToReceivedArray(data);
		//lm.log("龙虎斗-------------------------------------------------------空闲状态  "+JSON.stringify(data));
		//dragonFight_GameID_122.dragonGameXianScene(data);
	}//游戏状态
	else if( gamestatus == DragonData_GameId_122.GAME_SCENE_PLAY )
	{
		data["type"] = "CMD_S_StatusPlay";
		//剩余时间
		data.cbTimeLeave = DataUtil.ReadNumber(SerializeObject, 8);
		//游戏状态
		data["cbGameStatus"] = DataUtil.ReadNumber (SerializeObject, 8);
		//区域总下注
		data.lAllBet = [];
		for ( var i = 0; i < DragonData_GameId_122.AREA_MAX; i++ )
		{
			data.lAllBet.push(DataUtil.ReadNumber(SerializeObject, 64));
		}
		//玩家下注
		data.lPlayBet = [];
		for ( var i = 0; i < DragonData_GameId_122.AREA_MAX; i++ )
		{
			data.lPlayBet.push(DataUtil.ReadNumber(SerializeObject, 64));
		}
		//玩家最大下注
		data["lPlayBetScore"] = DataUtil.ReadNumber (SerializeObject, 64);
		//玩家自由金币
		data["lPlayFreeSocre"] = DataUtil.ReadNumber (SerializeObject, 64);
		//玩家输赢
		data.lPlayScore = [];
		for ( var i = 0; i < DragonData_GameId_122.AREA_MAX; i++ )
		{
			data.lPlayScore.push(DataUtil.ReadNumber(SerializeObject, 64));
		}
		//玩家成绩
		data["lPlayAllScore"] = DataUtil.ReadNumber (SerializeObject, 64);
		//当前庄家
		data["wBankerUser"] = DataUtil.ReadNumber(SerializeObject, 16);
		//庄家分数
		data["lBankerScore"] = DataUtil.ReadNumber(SerializeObject, 64);
		//庄家赢分
		data["lBankerWinScore"] = DataUtil.ReadNumber(SerializeObject, 64);
		//庄家局数
		data["wBankerTime"] = DataUtil.ReadNumber(SerializeObject, 16);
		//系统做庄
		data["bEnableSysBanker"] = DataUtil.ReadNumber(SerializeObject, 8);
		//申请条件
		data["lApplyBankerCondition"] = DataUtil.ReadNumber(SerializeObject, 64);
		//区域限制
		data["lAreaLimitScore"] = DataUtil.ReadNumber(SerializeObject, 64);
		//桌面扑克
		data["cbTableCardData"] = [];
		for (var i = 0; i < 2; i++) {
			data["cbTableCardData"].push (DataUtil.ReadNumber (SerializeObject, 8));
		}
		//房间名称
		data["szGameRoomName"] = [];
		for (var i = 0; i < DragonData_GameId_122.SERVER_LEN; i++)
		{
			data["szGameRoomName"].push(DataUtil.ReadNumber(SerializeObject, 1024));
		}

		self.addDataToReceivedArray(data);
		//lm.log("龙虎斗-------------------------------------------------------游戏状态  "+JSON.stringify(data));

		//dragonFight_GameID_122.dragonGamePlayingScene(data);
	}
	else if( gamestatus == DragonData_GameId_122.GAME_SCENE_END )
	{
		data["type"] = "CMD_S_StatusPlayEnd";
		//剩余时间
		data.cbTimeLeave = DataUtil.ReadNumber(SerializeObject, 8);
		//游戏状态
		data["cbGameStatus"] = DataUtil.ReadNumber (SerializeObject, 8);
		//区域总下注
		data.lAllBet = [];
		for ( var i = 0; i < DragonData_GameId_122.AREA_MAX; i++ )
		{
			data.lAllBet.push(DataUtil.ReadNumber(SerializeObject, 64));
		}
		//玩家下注
		data.lPlayBet = [];
		for ( var i = 0; i < DragonData_GameId_122.AREA_MAX; i++ )
		{
			data.lPlayBet.push(DataUtil.ReadNumber(SerializeObject, 64));
		}
		//玩家最大下注
		data["lPlayBetScore"] = DataUtil.ReadNumber (SerializeObject, 64);
		//玩家自由金币
		data["lPlayFreeSocre"] = DataUtil.ReadNumber (SerializeObject, 64);
		//玩家输赢
		data.lPlayScore = [];
		for ( var i = 0; i < DragonData_GameId_122.AREA_MAX; i++ )
		{
			data.lPlayScore.push(DataUtil.ReadNumber(SerializeObject, 64));
		}
		//玩家成绩
		data["lPlayAllScore"] = DataUtil.ReadNumber (SerializeObject, 64);
		//当前庄家
		data["wBankerUser"] = DataUtil.ReadNumber(SerializeObject, 16);
		//庄家分数
		data["lBankerScore"] = DataUtil.ReadNumber(SerializeObject, 64);
		//庄家赢分
		data["lBankerWinScore"] = DataUtil.ReadNumber(SerializeObject, 64);
		//庄家局数
		data["wBankerTime"] = DataUtil.ReadNumber(SerializeObject, 16);
		//系统做庄
		data["bEnableSysBanker"] = DataUtil.ReadNumber(SerializeObject, 8);
		//申请条件
		data["lApplyBankerCondition"] = DataUtil.ReadNumber(SerializeObject, 64);
		//区域限制
		data["lAreaLimitScore"] = DataUtil.ReadNumber(SerializeObject, 64);
		//桌面扑克
		data["cbTableCardData"] = [];
		for (var i = 0; i < 2; i++) {
			data["cbTableCardData"].push (DataUtil.ReadNumber (SerializeObject, 8));
		}
		//房间名称
		data["szGameRoomName"] = [];
		for (var i = 0; i < DragonData_GameId_122.SERVER_LEN; i++)
		{
			data["szGameRoomName"].push(DataUtil.ReadNumber(SerializeObject, 1024));
		}

		self.addDataToReceivedArray(data);
		//lm.log("龙虎斗-------------------------------------------------------游戏结束  "+JSON.stringify(data));

		//dragonFight_GameID_122.dragonGameEndScene(data);
	}
}

/**
 * 初始化龙虎斗框架消息
 * @param self
 * @constructor
 */
function InitDragonFrameListeners(self)
{


	connectUtil.dataListenerManualEx(DragonData_GameId_122.GAMEID,KernelCurrent, RoomLogonMainID, RoomLogonMsg.SUB_GR_UPDATENOTIFY, function (SerializeObject, wDataSize) {
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
	//登录成功
	connectUtil.dataListenerManualEx(DragonData_GameId_122.GAMEID,KernelCurrent, RoomLogonMainID, RoomLogonMsg.SUB_GR_LOGON_SUCCESS, function (SerializeObject, wDataSize)    //与DOU_DI_ZHU逻辑相同
	{
		lm.log("龙虎斗框架消息 -> BaseDirector -> 登录成功 ");

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
		lm.log("龙虎斗框架消息 -> BaseDirector -> 登录成功 " + sparrowDirector.currentRoomServerId + " " + sparrowDirector.tempRoomServerId);


	});
	//登录失败
	connectUtil.dataListenerManualEx(DragonData_GameId_122.GAMEID,KernelCurrent, RoomLogonMainID, RoomLogonMsg.SUB_GR_LOGON_FAILURE, function (SerializeObject, wDataSize)    //与DOU_DI_ZHU逻辑相同
	{
		lm.log("龙虎斗框架消息 -> BaseDirector -> 登录失败 ");

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

	connectUtil.dataListenerManualEx(DragonData_GameId_122.GAMEID,KernelCurrent, RoomLogonMainID, RoomLogonMsg.SUB_GR_LOGON_RECONNECTOK, function(data, size)    //与DOU_DI_ZHU逻辑相同
	{
		lm.log("龙虎斗框架消息 -> BaseDirector -> 重连成功 ");

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

	//处理重新登录消息 2015/08/27
	connectUtil.dataListenerManualEx(DragonData_GameId_122.GAMEID,KernelCurrent, RoomLogonMainID, RoomLogonMsg.SUB_GR_LOGON_NEEDRELOGON, function(data, size){
		lm.log("龙虎斗框架消息  收到需要重新登陆的消息");
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

//	用户进入
	connectUtil.dataListenerManualEx(DragonData_GameId_122.GAMEID,KernelCurrent, RoomUserMainID, RoomUserMsg.SUB_GR_USER_ENTER, function (SerializeObject, wDataSize) {
		lm.log("龙虎斗框架消息 -> BaseDirector -> 用户进入 1 [" + KernelCurrent + " " + sparrowDirector._sortRoomFlag + " " + sparrowDirector.sortRoomUserInfoFlag);
		//比赛模式不进行下面的处理
		if(KernelCurrent == KernelMatch ) return;
		if(sparrowDirector._sortRoomFlag && sparrowDirector.sortRoomUserInfoFlag == false) //hanhu #排队房只有准备后才能接收用户消息 2015/12/14
		{
			return;
		}
		lm.log("龙虎斗框架消息 -> BaseDirector -> 用户进入 2 ");
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
		cc.log("龙虎斗框架消息==================用户进入=========================");
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
		cc.log("ChairID = " + data["wChairID"]);
		if (data["wChairID"] != -1) {
			cc.log("收到用户进入消息, 玩家昵称为:" + data["szNickName"]);
			sparrowDirector.setPlayerStatus(data);
		}
	});

	//用户分数
	connectUtil.dataListenerManualEx(DragonData_GameId_122.GAMEID,KernelCurrent, RoomUserMainID, RoomUserMsg.SUB_GR_USER_SCORE, function (SerializeObject, wDataSize) {

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
		cc.log("=龙虎斗框架消息=================用户分数=========================");
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

	//hanhu #请求站起成功处理 2015/08/28
	connectUtil.dataListenerManualEx(DragonData_GameId_122.GAMEID,KernelCurrent, RoomUserMainID, RoomUserMsg.SUB_GR_ASK_STANDUP_SUCCESS, function(SerializeObject, wDataSize){
		self.updatenotify = false;
		self.foceline = false;
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
	connectUtil.dataListenerManualEx(DragonData_GameId_122.GAMEID,KernelCurrent, RoomUserMainID, RoomUserMsg.SUB_GR_USER_STATUS, function (SerializeObject, wDataSize) {

		lm.log("龙虎斗框架消息 -> BaseDirector -> 用户状态 1");
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
		//if(sparrowDirector._sortRoomFlag) //hanhu #比赛房间不允许有用户消息时拒绝接收 2015/12/14
		//{
		//	if(sparrowDirector.sortRoomUserInfoFlag != true)
		//	{
		//		return;
		//	}
		//}
		lm.log("龙虎斗框架消息 -> BaseDirector -> 用户状态 2");
		lm.log(JSON.stringify(data));

		if ((userInfo.globalUserdData["dwUserID"] !== null) && data["dwUserID"] == userInfo.globalUserdData["dwUserID"])
		{
			if (data["wTableID"] != INVALID_CHAIR_TABLE)
			{
				if (  KernelCurrent != KernelMatch && data["wTableID"] != INVALID_CHAIR_TABLE &&data["wChairID"] != INVALID_CHAIR_TABLE)
				{
					if (sparrowDirector.isAutoReady && DragonData_GameId_122.isPlayingGame == false)
					{
						lm.log("龙虎斗框架消息 -> BaseDirector -> 用户状态 1111111111111111111111---------------------------");
						DragonData_GameId_122.isPlayingGame = true;
						cc.director.replaceScene(new DragonFightScene_GameId_122());
						dragonFight_GameID_122.playerChairID = data["wChairID"];
						sparrowDirector.SendUserReady();
						self.SendGameOption ();
					}

					//if (data["wTableID"] != INVALID_CHAIR_TABLE)
					//{
                    //
                    //
					//	//请求除自己之外其他玩家信息
					//	var myIndex = data["wChairID"];
					//	var allIndex = [0, 1, 2];
					//	allIndex.splice(allIndex.indexOf(myIndex), 1);
					//	for (var key in allIndex)
					//	{
					//		sparrowDirector.SendUserChairInFoReq(self.gameData.tableIndex, allIndex[key]);
					//	}
					//	var myInfo = self.getInfoOfPlayers(data["dwUserID"]);
					//	myInfo["wTableID"] = data["wTableID"];
					//	myInfo["wChairID"] = data["wChairID"];
					//	myInfo["cbUserStatus"] = data["cbUserStatus"];
					//	self.SendGameOption ();
					//}
				}

				//if (data["cbUserStatus"] == PlayerStatus.US_SIT)
				//{
				//	sparrowDirector.SendUserChairInFoReq(self.gameData.tableIndex, 0);
				//	sparrowDirector.SendUserChairInFoReq(self.gameData.tableIndex, 1);
				//	sparrowDirector.SendUserChairInFoReq(self.gameData.tableIndex, 2);
				//}
                //
				//var myInfo = self.getInfoOfPlayers(data["dwUserID"]);
				//if (myInfo)
				//{
				//	myInfo["wTableID"] = data["wTableID"];
				//	myInfo["wChairID"] = data["wChairID"];
				//	myInfo["cbUserStatus"] = data["cbUserStatus"];
				//}
				////lm.log("用户状态为：" + data["cbUserStatus"]);
				//if(sparrowDirector.OptionIsAlreadyRequest == false)
				//{
				//	lm.log("请求场景消息, flag =" + self.OptionIsAlreadyRequest);
				//	sparrowDirector.OptionIsAlreadyRequest = true;
				//	self.SendGameOption();
                //
				//}

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
				cc.log("memememememmememeemmememmememmemme------------------------- "+JSON.stringify(userInfo.globalUserdData));
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

	connectUtil.dataListenerManualEx(DragonData_GameId_122.GAMEID,KernelCurrent, RoomUserMainID, RoomUserMsg.SUB_GR_REQUEST_FAILURE, function (SerializeObject, wDataSize)    //与DOU_DI_ZHU逻辑相同
	{
		lm.log("龙虎斗框架消息 -> BaseDirector -> 请求失败 ");

		var data = {};
		data["type"] = "CMD_GR_RequestFaiure";

		//错误代码
		data["lErrCode"] = DataUtil.ReadNumber(SerializeObject, 32);

		//描述信息
		data["szDescribeString"] = ReadString(SerializeObject, 0);

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

	connectUtil.dataListenerManualEx(DragonData_GameId_122.GAMEID,KernelCurrent, RoomUserMainID, RoomUserMsg.SUB_GR_ASK_STANDUP_FAIL, function (SerializeObject, wDataSize)     //与DOU_DI_ZHU逻辑相同
	{
		lm.log("龙虎斗框架消息 -> BaseDirector -> 请求站起失败 ");

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
	connectUtil.dataListenerManualEx(DragonData_GameId_122.GAMEID,KernelCurrent, RoomUserMainID, RoomUserMsg.SUB_GR_USER_RELOADINFO, function (SerializeObject, wDataSize) {
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

	});


	//桌子信息
	connectUtil.dataListenerManualEx(DragonData_GameId_122.GAMEID,KernelCurrent, RoomStatusMainID, RoomStatusMsg.SUB_GR_TABLE_INFO, function (SerializeObject, wDataSize) {

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

	connectUtil.dataListenerManualEx(DragonData_GameId_122.GAMEID,KernelCurrent, RoomStatusMainID, RoomStatusMsg.SUB_GR_TABLE_STATUS, function (SerializeObject, wDataSize) {

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

	//丢包重发 - 重新登录
	connectUtil.dataListenerManualEx(DragonData_GameId_122.GAMEID,KernelCurrent, RoomStatusMainID, RoomStatusMsg.SUB_GR_RESEND, function (SerializeObject, wDataSize) {

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

//	框架消息处理

	//游戏状态
	connectUtil.dataListenerManualEx(DragonData_GameId_122.GAMEID,KernelCurrent, FrameMainID, FrameMsg.SUB_GF_GAME_STATUS, function (SerializeObject, wDataSize) {
		//游戏状态
		self.setGameData("cbGameStatus", DataUtil.ReadNumber(SerializeObject, 8));

		//旁观标志
		self.setGameData("cbAllowLookon", DataUtil.ReadNumber(SerializeObject, 8));

	});

	//旁观消息
	connectUtil.dataListenerManualEx(DragonData_GameId_122.GAMEID,KernelCurrent, FrameMainID, FrameMsg.SUB_GF_LOOKON_STATUS, function (SerializeObject, wDataSize) {
		//旁观标志
		self.setGameData("cbAllowLookon", DataUtil.ReadNumber(SerializeObject, 8));

	});

	//系统消息
	connectUtil.dataListenerManualEx(DragonData_GameId_122.GAMEID,KernelCurrent, FrameMainID, FrameMsg.SUB_GF_SYSTEM_MESSAGE, function (SerializeObject, wDataSize) {

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
	connectUtil.dataListenerManualEx(DragonData_GameId_122.GAMEID,KernelCurrent, FrameMainID, FrameMsg.SUB_GF_SYSTEM_NOTICE, function (SerializeObject, wDataSize) {

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
	connectUtil.dataListenerManualEx(DragonData_GameId_122.GAMEID,KernelCurrent, FrameMainID, FrameMsg.SUB_GF_USER_CHAT, function (SerializeObject, wDataSize) {

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
		lm.log("龙虎斗聊天－－－－－－"+JSON.stringify(data));

		var contentTxt = data["szChatString"];
		dragonFight_GameID_122.showChatContent(contentTxt);
		//sparrowDirector.playerTalk(false, sparrowDirector.getUserDirection(sparrowDirector.getChairByUserID(data["dwSendUserID"])), DataUtil.getRGBA(data["dwChatColor"]), data["szChatString"]);

		//self.addDataToFrameReceiveArray(data);
	});

	//用户表情
	connectUtil.dataListenerManualEx(DragonData_GameId_122.GAMEID,KernelCurrent, FrameMainID, FrameMsg.SUB_GF_USER_EXPRESSION, function (SerializeObject, wDataSize) {

		var data = {};
		data["type"] = "CMD_GF_S_UserExpression";

		//信息长度
		data["wItemIndex"] = DataUtil.ReadNumber(SerializeObject, 16);

		//发送用户
		data["dwSendUserID"] = DataUtil.ReadNumber(SerializeObject, 32);

		//目标用户
		data["dwTargetUserID"] = DataUtil.ReadNumber(SerializeObject, 32);

	});

	//使用喇叭失败
	connectUtil.dataListenerManualEx(DragonData_GameId_122.GAMEID,KernelCurrent, RoomUserMainID, RoomUserMsg.SUB_GR_USER_CHAT_BORDER_ERROR, function(data, size){
		var Area = DataUtil.ReadNumber(data, 16);
		var ErrCode = DataUtil.ReadNumber(data, 32);
		var Msg = ReadString(data);
		lm.log("龙虎斗 使用喇叭失败==============shibai "+Msg);

		layerManager.PopTipLayer(new PopAutoTipsUILayer(Msg, 5),true);
	});
	//喇叭聊天内容
	connectUtil.dataListenerManualEx(DragonData_GameId_122.GAMEID,KernelCurrent, RoomUserMainID, RoomUserMsg.SUB_GR_USER_CHAT_BORDER, function(data, size){
		var ItemIdex = DataUtil.ReadNumber(data, 16);
		var UserID = DataUtil.ReadNumber(data, 32);
		var Color = DataUtil.ReadNumber(data, 32);
		var NickName = ReadString(data, 32);
		var Msg = ReadString(data);
		lm.log("龙虎斗 使用喇叭============= "+"玩家 " + NickName + " 说：" + Msg);
		//NoticeMessageArray.push("玩家 " + NickName + " 说：" + Msg);
		var contentTxt = "玩家 " + NickName + " 说：" + Msg;
		dragonFight_GameID_122.showChatContent(contentTxt);
	});


	connectUtil.dataListenerManualEx(DragonData_GameId_122.GAMEID,KernelCurrent, FrameMainID, FrameMsg.SUB_GF_GAME_SCENE, function(SerializeObject, wDataSzie){
		cc.log("---------------------------收到龙虎斗场景消息");
		//根据场景消息类型进行数据读取
		var gamestatus = sparrowDirector.getGameData("cbGameStatus");
		DragonHandleSceneInfo(sparrowDirector,gamestatus, SerializeObject, wDataSzie);

	});

	//服务器正在维护
	connectUtil.dataListenerManualEx(DragonData_GameId_122.GAMEID,KernelGame, RoomLogonMainID, RoomLogonMsg.SUB_GR_LOGON_SERVERSHUTDOWN, function(data, size){
		lm.log("----------服务器正在维护-4");
		layerManager.PopTipLayer(new PopAutoTipsUILayer("服务器正在维护，请稍后重试！", DefultPopTipsTime));
	});

	cc.log("-----------------zoudaozhelile---------")
}



function DragonCastData_122(data, self)
{
	switch (data.type)
	{
		case "CMD_S_GameFree"://游戏空闲
			dragonFight_GameID_122.dragonGameXian(data);
			self.castNextData();
			lm.log("龙虎斗 －－－－－－－－－－－－－－ 游戏空闲 CMD_S_GameFree -> [ " + JSON.stringify(data) + "]");
			break;

		case "CMD_S_GameStart"://游戏开始
			dragonFight_GameID_122.dragonGameStart(data);
			self.castNextData();
			lm.log("龙虎斗 -> 游戏开始 CMD_S_GameStart -> [ " + JSON.stringify(data) + "]");
			break;

		case "CMD_S_PlaceBet"://用户下注
			dragonFight_GameID_122.dragonGamePlaceBet(data);
			self.castNextData();
			lm.log("龙虎斗 -> 用户下注 CMD_S_PlaceBet -> [ " + JSON.stringify(data) + "]");
			break;

		case "CMD_S_PlaceBetFail"://下注失败
			dragonFight_GameID_122.dragonGameBetlose(data);
			self.castNextData();
			lm.log("龙虎斗 -> 失败结构，下注失败 CMD_S_PlaceBetFail -> [ " + JSON.stringify(data) + "]");
			break;

		case "CMD_S_GameEnd"://游戏结束
			dragonFight_GameID_122.dragonGameEnd(data);
			self.castNextData();
			lm.log("龙虎斗 -> 游戏结束 CMD_S_GameEnd -> [ " + JSON.stringify(data) + "]");
			break;

		case "CMD_S_ApplyBanker"://申请庄家
			self.castNextData();
			lm.log("龙虎斗 -> 申请庄家 CMD_S_ApplyBanker -> [ " + JSON.stringify(data) + "]");
			break;

		case "CMD_C_CancelBanker"://取消申请
			self.castNextData();
			lm.log("龙虎斗 -> 取消申请庄家 CMD_C_CancelBanker -> [ " + JSON.stringify(data) + "]");
			break;

		case "CMD_S_ChangeBanker"://切换庄家
			dragonFight_GameID_122.setPlayerInfo(data);
			self.castNextData();
			lm.log("龙虎斗 -> 切换庄家 CMD_S_ChangeBanker -> [ " + JSON.stringify(data) + "]");
			break;


		case "CMD_C_GetApplyList"://庄家列表
			dragonFight_GameID_122.dragonGameApplyList(data);
			self.castNextData();
			lm.log("龙虎斗 -> 庄家列表 CMD_S_ApplyBanker -> [ " + JSON.stringify(data) + "]");
			break;

		case "CMD_S_RankInfo"://排行列表
			dragonFight_GameID_122.dragonGameRanList(data);
			self.castNextData();
			lm.log("龙虎斗 -> 排行列表 CMD_S_RankInfo -> [ " + JSON.stringify(data) + "]");
			break;
		//场景消息
		case "CMD_S_StatusFree"://空闲状态
			dragonFight_GameID_122.dragonGameXianScene(data);
			self.castNextData();
			lm.log("龙虎斗-------------------------------------------------------空闲状态  "+JSON.stringify(data));
			break;

		case "CMD_S_StatusPlay"://游戏状态
			dragonFight_GameID_122.dragonGamePlayingScene(data);
			self.castNextData();
			lm.log("龙虎斗-------------------------------------------------------游戏状态  "+JSON.stringify(data));
			break;

		case "CMD_S_StatusPlayEnd"://游戏结束状态
			dragonFight_GameID_122.dragonGameEndScene(data);
			self.castNextData();
			lm.log("龙虎斗-------------------------------------------------------游戏结束  "+JSON.stringify(data));
			break;

	}
}













