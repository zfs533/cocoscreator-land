/*
 * created By zhoufangsheng 20151104
 */
 
//麻将导演类
var SparrowDirector = BaseDirector.extend(
	{
		ctor:function()
		{
			this._super();
			this.setVariable();
			this.initListeners();
		},
		//切换到游戏场景
		gotoDeskScene:function()
		{
			lm.log("lalallalalalallalala  "+sparrowDirector.gameData.playerInfo.length);
			removeNormalResource();
			cc.spriteFrameCache.addSpriteFrames("res/landlord/laizi/laizi.plist");
			if( sparrowDirector.gameData.loadTexture)
			{
				cc.spriteFrameCache.addSpriteFrames("res/landlord/cocosOut/card/card.plist");
				cc.spriteFrameCache.addSpriteFrames("res/landlord/cocosOut/desk/desk01.plist");
				cc.spriteFrameCache.addSpriteFrames("res/landlord/cocosOut/desk/desk02.plist");
				lm.log("切换到游戏场景lalallala---------------------------加载游戏房间支援");
			}
			else
			{
				sparrowDirector.gameData.loadTexture = true;
			}

			var deskScene = new MainGameScene();
			this.gameLayer = deskScene.mainGameLayer;
			cc.director.replaceScene(deskScene);
			//cc.director.runWithScene(deskScene);
			this.gameLayer.autoSetPlayerPos();

			this.gameLayer.deskLayer.SetCurTime(sparrowDirector.gameData.serverTimes);
			this.gameLayer.deskLayer.SetCurElectricity(sparrowDirector.gameData.dianNiang);
		},
		setVariable:function()
		{
			this.isPlayingGame = false;
			this.isAutoReady = false;
			this.gameData = DataUtil.copyJson(GameData);
			this.gameData01 = DataUtil.copyJson(GameData01);
			//是否自动准备
			this.isAutoReady = true;
			//是否再游戏中
			this.isPlayingGame = false;
			//服务器消息队列
			this.receivedData = [];
			this.isChangingRoom = false;
			this.sortRoomUserInfoFlag = true; //hanhu  排队房是否接受用户信息 2015/12/14
			this.tempRoomServerId = 0;//玩家当前所在游戏房间
			this.currentRoomServerId = 0;//玩家当前所在游戏房间
			this.gameData.isCanOutPuker = false;

		},
		setPlayerStatus:function(data)
		{
			if ( sparrowDirector.isPlayingGame && sparrowDirector.gameLayer )
			{
				var child = sparrowDirector.gameLayer.playerLayer.getChildren();
				for ( var i = 0; i < child.length; i++ )
				{
					if ( child[i].data.dwUserID == data.dwUserID )
					{
						child[i].refreshPlayerStatus(data.cbUserStatus);
						if ( data.cbUserStatus == PlayerStatus.US_FREE )
						{
							child[i].removeFromParent();
							this.removeChildFromPInfo(data.dwUserID);
							break;
						}
					}
				}
			}
		},
		removeChildFromPInfo:function(id)
		{
			var temp = sparrowDirector.gameData.playerInfo;
			for ( var i = 0; i < temp.length; i++ )
			{
				if ( temp[i].dwUserID == id )
				{
					temp.splice(i, 1);
					return;
				}
			}
		},
		setCenterDirection:function()
		{

		},
		//设置游戏数据
		setGameData: function (key, value)
		{
			this.gameData[key] = value;
			lm.log("======================= 设置游戏数据 " + key + "="+value);
		},
		//获取游戏数据
		getGameData: function (key)
		{
			lm.log("======================= 获取游戏数据 " +this.gameData[key]);
			return this.gameData[key];
		},
		//获取玩家信息
		getPlayerInfo: function (direction)
		{
			console.log("direction = " + direction);
			console.log("获取玩家信息");
			var info = this._getTargetOfInfo(direction);
			return info.data;
		},
		//获取玩家信息层
		_getTargetOfInfo: function (direction)
		{
			var target;
			if(this.gameLayer == null)
				return null;
			var node = this.gameLayer.playerLayer;
			switch (direction)
			{
				case playerDirection.DOWN:
					target = node.getChildByTag(100);
					break;
				case playerDirection.LEFT:
					target = node.getChildByTag(200);
					break;
				case playerDirection.RIGHT:
					target = node.getChildByTag(300);
					break;
			}
			return target;
		},
		//聊天内容显示
		playerTalk: function (isFace, direction, color, content)
		{
			this.gameLayer.playerChat(isFace, direction, color, content);
		},
		//获取玩家方向
		getUserDirection:function(chairID)
		{
			var direction = chairID - sparrowDirector.gameData.myChairIndex;
			return direction >= 0 ? direction : direction + 3;
		},
		//服务器消息加入队列
		addDataToReceivedArray: function (data)
		{
			lm.log("消息队列长度为:" + this.receivedData.length);
			for(var i = 0; i < this.receivedData.length; i++)
			{
				//lm.log("消息队列第 " + i + " 项数据为：" + this.receivedData[i]["type"]);
			}

			if (this.receivedData.length == 0)
			{
				this.receivedData.push(data);
				//lm.log("消息队列为空，执行当前消息");
				this.castNextData(true);
			} else {
				this.receivedData.push(data);
			}
		},
		castNextData: function (firstIn) {
			if (!firstIn) {
				//lm.log("移除消息队列数据");
				this.receivedData.shift();
			}
			var data = DataUtil.copyJson(this.receivedData[0]);

			if (data) {
				//lm.log(data["type"]);
				this.castData(data);

			}
			else
			{
				//lm.log("数据为空");
			}
		},
		initListeners:function()
		{
			lm.log("欢乐斗地主 -> initListeners");
			this.doudizuListeners();
			this.lizidoudizuListener();
			this.happydoudizuListeners();
			this.dragonListener();//龙虎斗
		},
		//龙虎斗
		dragonListener:function()
		{
			cc.log("*******************开始监听龙虎斗****************************");
			DragonListener(this);
		},
		//欢乐斗地主
		happydoudizuListeners:function()
		{
			cc.log("*******************开始监听欢乐斗地主****************************");
			var self = this;
			//TODO
			//游戏开始
			connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_HAPPY, KernelCurrent, LandCrazyExMainID, LandCrazyExGameMsgHappy.SUB_S_GAME_START,function(SereverlizeObject,wDataSize)
			{
				var data = {};
				data.type = "CMD_S_GameStart";
				//桌费
				data.lServiceScore = DataUtil.ReadNumber(SereverlizeObject, 64);
				//是不是明牌开始
				data["bShowCardStart"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["bShowCardStart"].push(DataUtil.ReadNumber(SereverlizeObject, 8));
				}
				//扑克列表
				data.cbCardData = [];
				for ( var i = 0; i < NORMAL_COUNT; i++ )
				{
					data.cbCardData.push(DataUtil.ReadNumber(SereverlizeObject, 8));
				}

				lm.log("欢乐斗地主 -> 游戏开始 CMD_S_GameStart -> [ " + JSON.stringify(data) + "]");
				self.addDataToReceivedArray(data);
			});

			//用户明牌
			connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_HAPPY,KernelCurrent, LandCrazyExMainID, LandCrazyExGameMsgHappy.SUB_S_SHOW_CARD,function(SereverlizeObject, wDataSize)
			{
				var data = {};
				data.type = "CMD_S_ShowCard";
				//明牌玩家
				data.wShowCardUser = DataUtil.ReadNumber(SereverlizeObject, 16);
				//明牌倍数
				data.wShowCardTimes = DataUtil.ReadNumber(SereverlizeObject, 16);

				lm.log("欢乐斗地主 -> 用户明牌 CMD_S_ShowCard -> [ " + JSON.stringify(data) + "]");
				self.addDataToReceivedArray(data);
			});

			//用户叫 抢 放弃
			connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_HAPPY, KernelCurrent, LandCrazyExMainID, LandCrazyExGameMsgHappy.SUB_S_NOTIFY_LAND,function(ServerlizeObject, wDataSize)
			{
				var data = {};
				data.type  = "CMD_S_NotifyLand";
				//叫牌操作玩家
				data.wLandUser = DataUtil.ReadNumber(ServerlizeObject, 16);
				//下一个叫牌玩家
				data.wNextUser = DataUtil.ReadNumber(ServerlizeObject, 16);
				//当前叫牌操作,叫牌码
				data.cbLandOption = DataUtil.ReadNumber(ServerlizeObject, 8);
				//下一个玩家的叫牌操作，叫牌码
				data.cbNextLandOption = DataUtil.ReadNumber(ServerlizeObject, 8);

				lm.log("欢乐斗地主 -> 用户叫 抢 放弃 CMD_S_NotifyLand -> [ " + JSON.stringify(data) + "]");
				self.addDataToReceivedArray(data);
			});

			//通知明牌数据
			connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_HAPPY,KernelCurrent, LandCrazyExMainID, LandCrazyExGameMsgHappy.SUB_S_NOTIFY_SHOWDATA,function(ServerlizeObject, wDataSize)
			{
				var data = {};
				data.type = "CMD_S_NotifyShowCardData";

				//是否明牌
				data["bShowCard"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["bShowCard"].push(DataUtil.ReadNumber(ServerlizeObject, 8));
				}

				//手上扑克，明牌玩家的扑克一直显示
				data.cbHandCardData = [];
				for ( var i = 0; i < GAME_PLAYER; i++ )
				{
					data.cbHandCardData[i] = [];
					for ( var j = 0; j < MAX_COUNT; j++ )
					{
						data.cbHandCardData[i].push(DataUtil.ReadNumber(ServerlizeObject, 8));
					}
				}

				lm.log("欢乐斗地主 -> 通知明牌数据 CMD_S_NotifyShowCardData -> [ " + JSON.stringify(data) + "]");
				self.addDataToReceivedArray(data);
			});

			//通知玩家玩游戏
			connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_HAPPY,KernelCurrent, LandCrazyExMainID, LandCrazyExGameMsgHappy.SUB_S_NOTIFY_PLAY,function(ServerlizeObject, wDataSize)
			{
				var data = {};
				data.type = "CMD_S_NotifyPlay";
				//地主玩家
				data.wBankerUser = DataUtil.ReadNumber(ServerlizeObject, 16);
				//总的加倍倍数
				data.wTotalAddTimes = DataUtil.ReadNumber(ServerlizeObject, 16);

				//底牌
				data.cbBankerCard = [];
				for ( var i = 0; i < GAME_PLAYER; i++ )
				{
					data.cbBankerCard.push(DataUtil.ReadNumber(ServerlizeObject, 8));
				}

				//手上扑克，明牌玩家的扑克一直显示
				data.cbHandCardData = [];
				for ( var i = 0; i < GAME_PLAYER; i++ )
				{
					data.cbHandCardData[i] = [];
					for ( var j = 0; j < MAX_COUNT; j++ )
					{
						data.cbHandCardData[i].push(DataUtil.ReadNumber(ServerlizeObject, 8));
					}
				}

				lm.log("欢乐斗地主 -> 通知玩家玩游戏 CMD_S_NotifyPlay -> [ " + JSON.stringify(data) + "]");
				self.addDataToReceivedArray(data);
			});

			//通知玩家托管
			connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_HAPPY,KernelCurrent, LandCrazyExMainID, LandCrazyExGameMsgHappy.SUB_S_TRUSTEE,function(ServerlizeObject, wDataSize)
			{
				var data = {};
				data.type = "CMD_S_Trustee";
				//椅子号
				data.wChairID = DataUtil.ReadNumber(ServerlizeObject, 16);
				//取消托管，还是托管（0，1）
				data.bTrustee = DataUtil.ReadNumber(ServerlizeObject, 8);

				lm.log("欢乐斗地主 -> 通知玩家托管 CMD_S_Trustee -> [ " + JSON.stringify(data) + "]");
				self.addDataToReceivedArray(data);
			});

			//用户出牌
			connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_HAPPY,KernelCurrent, LandCrazyExMainID, LandCrazyExGameMsgHappy.SUB_S_OUT_CARD,function(ServerlizeObject, wDataSize)
			{
				var data = {};
				data.type = "CMD_S_OutCard";
				//出牌数目
				data.cbCardCount = DataUtil.ReadNumber(ServerlizeObject, 8);
				//当前玩家
				data.wCurrentUser = DataUtil.ReadNumber(ServerlizeObject, 16);
				//出牌玩家
				data.wOutCardUser = DataUtil.ReadNumber(ServerlizeObject, 16);
				//扑克列表
				data.cbCardData = [];
				for ( var i = 0; i < MAX_COUNT; i++ )
				{
					data.cbCardData.push(DataUtil.ReadNumber(ServerlizeObject, 8));
				}

				lm.log("欢乐斗地主 -> 用户出牌 CMD_S_OutCard -> [ " + JSON.stringify(data) + "]");
				self.addDataToReceivedArray(data);
			});

			//用户放弃
			connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_HAPPY,KernelCurrent, LandCrazyExMainID, LandCrazyExGameMsgHappy.SUB_S_PASS_CARD,function(SereverlizeObject,wDataSize)
			{
				var data = {};
				data.type = "CMD_S_PassCard";
				//一轮结束
				data.cbTureOver = DataUtil.ReadNumber(SereverlizeObject, 8);
				//当前玩家
				data.wCurrentUser = DataUtil.ReadNumber(SereverlizeObject, 16);
				//放弃玩家
				data.wPassCardUser = DataUtil.ReadNumber(SereverlizeObject, 16);

				lm.log("欢乐斗地主 -> 用户放弃 CMD_S_PassCard -> [ " + JSON.stringify(data) + "]");
				self.addDataToReceivedArray(data);
			});

			//游戏结束
			connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_HAPPY,KernelCurrent, LandCrazyExMainID, LandCrazyExGameMsgHappy.SUB_S_GAME_CONCLUDE,function(ServerlizeObject, wDataSize)
			{
				var data = {};
				data.type = "CMD_S_GameConclude";

				//单元积分
				data.lCellScore = DataUtil.ReadNumber(ServerlizeObject,32);
				//游戏积分
				data.lGameScore = [];
				for ( var i = 0; i < GAME_PLAYER; i++ )
				{
					data.lGameScore.push(DataUtil.ReadNumber(ServerlizeObject, 64));
				}
				//加倍倍数
				data.wTotalAddTimes = DataUtil.ReadNumber(ServerlizeObject, 16);

				//春天标志
				data.bChunTiam = DataUtil.ReadNumber(ServerlizeObject, 8);
				//反春标志
				data.bFanChunTian = DataUtil.ReadNumber(ServerlizeObject, 8);

				//炸弹个数
				data.cbBombCount = DataUtil.ReadNumber(ServerlizeObject, 8);
				//玩家放炸弹个数
				data.cbEachBombCount = [];
				for ( var i = 0; i < GAME_PLAYER; i++ )
				{
					data.cbEachBombCount.push(DataUtil.ReadNumber(ServerlizeObject, 8));
				}

				//扑克数目
				data.cbCardCount = [];
				for ( var i = 0; i < GAME_PLAYER; i++ )
				{
					data.cbCardCount.push(DataUtil.ReadNumber(ServerlizeObject, 8));
				}
				//扑克列表
				data.cbHandCardData = [];
				for ( var i = 0; i < FULL_COUNT; i++ )
				{
					data.cbHandCardData.push(DataUtil.ReadNumber(ServerlizeObject, 8));
				}

				lm.log("欢乐斗地主 -> 游戏结束 CMD_S_GameConclude -> [ " + JSON.stringify(data) + "]");
				self.addDataToReceivedArray(data);
				if(sparrowDirector._sortRoomFlag) //hanhu #收到游戏结束消息立即改变排队房状态 2015/12/14
				{
					sparrowDirector.sortRoomUserInfoFlag = false;
				}
			});

			//设置基数
			connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_HAPPY,KernelCurrent, LandCrazyExMainID, LandCrazyExGameMsgHappy.SUB_S_SET_BASESCORE,function(SereverlizeObject,wDataSize)
			{
				//var data = {};
				//data.type = "CMD_S_AndroidCard";
				////手上扑克
				//data.cbHandCard = [];
				//for ( var i = 0; i < GAME_PLAYER; i++ )
				//{
				//	var arr = [];
				//	for ( var i = 0; i < NORMAL_COUNT; i++ )
				//	{
				//		arr.push(DataUtil.ReadNumber(SereverlizeObject,8));
				//	}
				//	data.cbHandCard.push(arr);
				//}
				////当前玩家
				//data.wCurrentUser = DataUtil.ReadNumber(SereverlizeObject, 16);
				////底牌扑克
				//data.cbBanckCard = [];
				//for ( var i = 0; i < GAME_PLAYER; i++ )
				//{
				//	data.cbBanckCard.push(DataUtil.ReadNumber(SereverlizeObject, 8));
				//}
                //
				//self.addDataToReceivedArray(data);
				lm.log("欢乐斗地主 -> 设置基数 （未处理消息） ");
			});

			//作弊扑克
			connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_HAPPY,KernelCurrent, LandCrazyExMainID, LandCrazyExGameMsgHappy.SUB_S_CHEAT_CARD,function(ServerlizeObject, wDataSize)
			{
				//var data = {};
				//data.type  = "CMD_S_CheatCard";
				////作弊玩家
				//data.wCardUser = [];
				//for ( var i = 0; i < GAME_PLAYER; i++ )
				//{
				//	data.wCardUser.push(DataUtil.ReadNumber(ServerlizeObject, 16));
				//}
				////作弊数量
				//data.cbUserCount = DataUtil.ReadNumber(ServerlizeObject, 8);
				////扑克列表
				//data.cbCardData = [];
				//for ( var i = 0; i < GAME_PLAYER; i++ )
				//{
				//	var arr = [];
				//	for ( var j = 0; j < MAX_COUNT; j++ )
				//	{
				//		arr.push(DataUtil.ReadNumber(ServerlizeObject, 8));
				//	}
				//	data.cbCardData.push(arr);
				//}
				////扑克数量
				//data.cbCardCount = [];
				//for ( var i = 0; i < GAME_PLAYER; i++ )
				//{
				//	data.cbCardCount.push(DataUtil.ReadNumber(ServerlizeObject, 8));
				//}
                //
				//self.addDataToReceivedArray(data);
				lm.log("欢乐斗地主 -> 作弊扑克 （未处理消息） ");
			});

			//机器人聊天
			connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_HAPPY,KernelCurrent, LandCrazyExMainID, LandCrazyExGameMsgHappy.SUB_S_ANDROID_CHAT,function(ServerlizeObject, wDataSize)
			{
				//var data = {};
				//data.type  = "CMD_S_AndroidChat";
				////机器人ID
				//data.wChatChairID = DataUtil.ReadNumber(ServerlizeObject, 16);
				////消息类型(0:文字 1:表情 2:都发)
				//data.cbSendType = DataUtil.ReadNumber(ServerlizeObject, 8);
                //
				//self.addDataToReceivedArray(data);
				lm.log("欢乐斗地主 -> 机器人聊天 （未处理消息） ");
			});

			//TODO
			//场景消息


		},
		//癞子斗地主
		lizidoudizuListener:function()
		{
			lm.log("*******************开始监听癞子斗地主****************************");
			var self = this;
			//游戏开始
			connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_LAI_ZI,KernelCurrent, LandCrazyExMainID, LandCrazyExGameMsgLz.SUB_S_GAME_START,function(SereverlizeObject,wDataSize)
			{
				var data = {};
				data.type = "CMD_S_GameStart";
				//开始玩家
				data.wStartUser = DataUtil.ReadNumber(SereverlizeObject, 16);
				//当前玩家
				data.wCurrentUser = DataUtil.ReadNumber(SereverlizeObject, 16);
				//初始倍数
				data.wStartTime  = DataUtil.ReadNumber(SereverlizeObject, 16);
				//是否明牌
				data.bValidCard = DataUtil.ReadNumber(SereverlizeObject, 8);
				//明牌扑克
				data.cbValidCardData = DataUtil.ReadNumber(SereverlizeObject, 8);
				//明牌位置
				data.cbValidCardIndex = DataUtil.ReadNumber(SereverlizeObject, 8);
				//扑克列表
				data.cbCardData = [];
				for ( var i = 0; i < NORMAL_COUNT; i++ )
				{
					data.cbCardData.push(DataUtil.ReadNumber(SereverlizeObject, 8));
				}

				self.addDataToReceivedArray(data);

				//sparrowDirector.gameLayer.pukerLayer.setLaunchPuker(data);
				//sparrowDirector.gameData.startUser = data.wStartUser;
				//sparrowDirector.gameData.wCurrentUser = data.wCurrentUser;
				//sparrowDirector.gameData.isCallBankerState = true;
				//cc.log("-------------------------------------------------------游戏开始  "+JSON.stringify(data));
			});
			//用户叫地主
			connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_LAI_ZI,KernelCurrent, LandCrazyExMainID, LandCrazyExGameMsgLz.SUB_S_CALL_BANKER,function(ServerlizeObject, wDataSize)
			{
				var data = {};
				data.type = "CMD_S_CallBanker";
				//当前玩家
				data.wCurrentUser = DataUtil.ReadNumber(ServerlizeObject, 16);
				//叫地主玩家
				data.wLastUer = DataUtil.ReadNumber(ServerlizeObject, 16);
				//叫地主
				data.cbCallInfo = DataUtil.ReadNumber(ServerlizeObject, 8);
				self.addDataToReceivedArray(data);
				cc.log("-------------------------------------------------------用户叫地主  "+JSON.stringify(data));
				//sparrowDirector.gameLayer.orderLaiziLayer.showBankerResult(data);

			});
			//用户强地主
			connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_LAI_ZI,KernelCurrent, LandCrazyExMainID, LandCrazyExGameMsgLz.SUB_S_ROD_BANKER,function(SereverlizeObject, wDataSize)
			{
				var data = {};
				data.type = "CMD_S_RodBanker";
				//强地主倍数
				data.wRodBankerTime = DataUtil.ReadNumber(SereverlizeObject, 16);
				//庄家玩家
				data.wBankerUser = DataUtil.ReadNumber(SereverlizeObject, 16);
				//当前玩家
				data.wCurrentUser = DataUtil.ReadNumber(SereverlizeObject, 16);
				//强地主玩家
				data.wLastUer = DataUtil.ReadNumber(SereverlizeObject, 16);
				//强地主
				data.cbRodInfo = DataUtil.ReadNumber(SereverlizeObject, 8);
				self.addDataToReceivedArray(data);
				cc.log("-------------------------------------------------------用户强地主  "+JSON.stringify(data));
				//sparrowDirector.gameLayer.orderLaiziLayer.showRodBanker(data);
				//sparrowDirector.gameData.isCallBankerState = false;
				//sparrowDirector.gameData.isRodBankerState = true;

			});
			//加倍信息
			connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_LAI_ZI,KernelCurrent, LandCrazyExMainID, LandCrazyExGameMsgLz.SUB_S_DOUBLE,function(SereverlizeObject, wDataSize)
			{
				var data = {};
				data.type = "CMD_S_Double";
				//当前玩家
				data.wCurrentUser = DataUtil.ReadNumber(SereverlizeObject, 16);
				//是否加倍
				data.cbDouble = DataUtil.ReadNumber(SereverlizeObject, 8);

				self.addDataToReceivedArray(data);
				cc.log("-------------------------------------------------------加倍信息  "+JSON.stringify(data));
				//sparrowDirector.gameLayer.orderLaiziLayer.showDoubleInfo(data);

			});
			//用户明牌
			connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_LAI_ZI,KernelCurrent, LandCrazyExMainID, LandCrazyExGameMsgLz.SUB_S_VALID_CARD,function(SereverlizeObject, wDataSize)
			{
				var data = {};
				data.type = "CMD_S_ValidCard";
				//首叫明牌
				data.wFirstValidUser = DataUtil.ReadNumber(SereverlizeObject, 16);
				//明牌倍数
				data.wValidCardTime = DataUtil.ReadNumber(SereverlizeObject, 16);
				//明牌用户
				data.wValidUser = DataUtil.ReadNumber(SereverlizeObject, 16);
				//明牌数目
				data.cbCardCount = DataUtil.ReadNumber(SereverlizeObject, 8);
				//扑克数据
				data.cbCardData = [];
				for ( var i = 0; i < MAX_COUNT; i++ )
				{
					data.cbCardData.push(DataUtil.ReadNumber(SereverlizeObject, 8));
				}

				self.addDataToReceivedArray(data);
				cc.log("-------------------------------------------------------用户明牌  "+JSON.stringify(data));
			});
			//庄家信息
			connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_LAI_ZI,KernelCurrent, LandCrazyExMainID, LandCrazyExGameMsgLz.SUB_S_BANKER_INFO,function(SereverlizeObject, wDataSize)
			{
				var data = {};
				data.type = "CMD_S_BankerInfo";
				//庄家玩家
				data.wBankerUser = DataUtil.ReadNumber(SereverlizeObject, 16);
				//当前玩家
				data.wCurrentUser = DataUtil.ReadNumber(SereverlizeObject, 16);
				//癞子牌
				data.cbLaiZiCard = DataUtil.ReadNumber(SereverlizeObject, 8);
				//庄家扑克
				data.cbBankerCard = [];
				for ( var i = 0; i < GAME_PLAYER; i++ )
				{
					data.cbBankerCard.push(DataUtil.ReadNumber(SereverlizeObject, 8));
				}
				//能否加倍
				data.bDoubleInfo = [];
				for ( var i = 0; i < GAME_PLAYER; i++ )
				{
					data.bDoubleInfo.push(DataUtil.ReadNumber(SereverlizeObject, 8));
				}

				self.addDataToReceivedArray(data);
				cc.log("-------------------------------------------------------庄家信息  "+JSON.stringify(data));
				//sparrowDirector.gameLayer.deskLayer.showBankerInfo(data);
				//sparrowDirector.gameLayer.orderLaiziLayer.doubleOrder();
			});
			//开始信息
			connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_LAI_ZI,KernelCurrent, LandCrazyExMainID, LandCrazyExGameMsgLz.SUB_S_OUT_START_START,function(SereverlizeObject, wDataSize)
			{
				var data = {};
				data.type = "CMD_S_Game_Start";
				//庄家玩家
				data.wBankerUser = DataUtil.ReadNumber(SereverlizeObject, 16);
				//当前玩家
				data.wCurrentUser = DataUtil.ReadNumber(SereverlizeObject, 16);
				//扑克数据
				data.cbCardData = [];
				for ( var i = 0; i < MAX_COUNT; i++ )
				{
					data.cbCardData.push(DataUtil.ReadNumber(SereverlizeObject, 8));
				}
				self.addDataToReceivedArray(data);
				cc.log("-------------------------------------------------------开始信息  "+JSON.stringify(data));
				//sparrowDirector.gameLayer.orderLaiziLayer.laiziStart(data);
				//sparrowDirector.gameData.isGaming = true;
				//sparrowDirector.gameData.isCallBankerState = false;
				//sparrowDirector.gameData.isRodBankerState = false;
				//sparrowDirector.gameData.isDoubledState = false;
			});
			//用户出牌
			connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_LAI_ZI,KernelCurrent, LandCrazyExMainID, LandCrazyExGameMsgLz.SUB_S_OUT_CARD,function(SereverlizeObject, wDataSize)
			{
				var data = {};
				data.type = "CMD_S_OutCard";
				//出牌数目
				data.cbCardCount = DataUtil.ReadNumber(SereverlizeObject, 8);
				//当前玩家
				data.wCurrentUser = DataUtil.ReadNumber(SereverlizeObject, 16);
				//出牌玩家
				data.wOutCardUser = DataUtil.ReadNumber(SereverlizeObject, 16);
				//扑克列表
				data.cbCardData = [];
				for ( var i = 0; i < MAX_COUNT; i++ )
				{
					data.cbCardData.push(DataUtil.ReadNumber(SereverlizeObject, 8));
				}
				//扑克列表
				data.cbOutCardData = [];
				for ( var i = 0; i < MAX_COUNT; i++ )
				{
					data.cbOutCardData.push(DataUtil.ReadNumber(SereverlizeObject, 8));
				}
				self.addDataToReceivedArray(data);
				//sparrowDirector.gameLayer.pukerLayer.savedOutPukerOrder(data);
				cc.log("-------------------------------------------------------用户出牌  "+JSON.stringify(data));
			});
			//用户放弃
			connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_LAI_ZI,KernelCurrent, LandCrazyExMainID, LandCrazyExGameMsgLz.SUB_S_PASS_CARD,function(SereverlizeObject,wDataSize)
			{
				var data = {};
				data.type = "CMD_S_PassCard";
				//一轮结束
				data.cbTureOver = DataUtil.ReadNumber(SereverlizeObject, 8);
				//当前玩家
				data.wCurrentUser = DataUtil.ReadNumber(SereverlizeObject, 16);
				//放弃玩家
				data.wPassCardUser = DataUtil.ReadNumber(SereverlizeObject, 16);

				//sparrowDirector.gameLayer.orderPassCard(data);
				//sparrowDirector.gameLayer.pukerLayer.savedOutPukerOrder(data);

				self.addDataToReceivedArray(data);
				cc.log("-------------------------------------------------------用户放弃  "+JSON.stringify(data));
			});
			//游戏结束
			connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU_LAI_ZI,KernelCurrent, LandCrazyExMainID, LandCrazyExGameMsgLz.SUB_S_GAME_CONCLUDE,function(ServerlizeObject, wDataSize)
			{
				var data = {};
				data.type = "CMD_S_GameConclude";
				//积分变量
				//单元积分
				data.lCellScore = DataUtil.ReadNumber(ServerlizeObject,32);
				//游戏积分
				data.lGameScore = [];
				for ( var i = 0; i < GAME_PLAYER; i++ )
				{
					data.lGameScore.push(DataUtil.ReadNumber(ServerlizeObject, 64));
				}
				//春天标志
				data.bChunTiam = DataUtil.ReadNumber(ServerlizeObject, 8);
				//反春标志
				data.bFanChunTian = DataUtil.ReadNumber(ServerlizeObject, 8);

				//炸弹信息
				//炸弹个数
				data.cbBombCount = DataUtil.ReadNumber(ServerlizeObject, 8);
				//玩家放炸弹个数
				data.cbEachBombCount = [];
				for ( var i = 0; i < GAME_PLAYER; i++ )
				{
					data.cbEachBombCount.push(DataUtil.ReadNumber(ServerlizeObject, 8));
				}

				//游戏信息
				//扑克数目
				data.cbCardCount = [];
				for ( var i = 0; i < GAME_PLAYER; i++ )
				{
					data.cbCardCount.push(DataUtil.ReadNumber(ServerlizeObject, 8));
				}
				//扑克列表
				data.cbHandCardData = [];
				for ( var i = 0; i < FULL_COUNT; i++ )
				{
					data.cbHandCardData.push(DataUtil.ReadNumber(ServerlizeObject, 8));
				}

				self.addDataToReceivedArray(data);
				if(sparrowDirector._sortRoomFlag) //hanhu #收到游戏结束消息立即改变排队房状态 2015/12/14
				{
					sparrowDirector.sortRoomUserInfoFlag = false;
				}
				//sparrowDirector.gameLayer.gameOver(data);
				//sparrowDirector.gameLayer.resultLayer.refreshTextures(data);
				cc.log("-------------------------------------------------------laizi游戏结束  "+JSON.stringify(data));
			});

		},
		//斗地主
		doudizuListeners:function()
		{
			cc.log("*******************开始监听斗地主****************************");
			var self = this;




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

				lm.log("龙虎斗 -> 用户下注 CMD_S_PlaceBet -> [ " + JSON.stringify(data) + "]");
				self.addDataToReceivedArray(data);
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






			//TODO
			//游戏开始
			connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU,KernelCurrent, LandCrazyExMainID, LandCrazyExGameMsg.SUB_S_GAME_START,function(SereverlizeObject,wDataSize)
			{
				var data = {};
				data.type = "CMD_S_GameStart";
				//开始玩家
				data.wStartUser = DataUtil.ReadNumber(SereverlizeObject, 16);
				//当前玩家
				data.wCurrentUser = DataUtil.ReadNumber(SereverlizeObject, 16);
				//明牌扑克
				data.cbValidCardData = DataUtil.ReadNumber(SereverlizeObject, 8);
				//明牌位置
				data.cbValidCardIndex = DataUtil.ReadNumber(SereverlizeObject, 8);
				//扑克列表
				data.cbCardData = [];
				for ( var i = 0; i < NORMAL_COUNT; i++ )
				{
					data.cbCardData.push(DataUtil.ReadNumber(SereverlizeObject, 8));
				}

				self.addDataToReceivedArray(data);

				//sparrowDirector.gameLayer.pukerLayer.setLaunchPuker(data);
				//sparrowDirector.gameData.startUser = data.wStartUser;
				//sparrowDirector.gameData.isCallScore = true;
				//cc.log("-------------------------------------------------------游戏开始  "+JSON.stringify(data));
			});

			//用户叫分
			connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU,KernelCurrent, LandCrazyExMainID, LandCrazyExGameMsg.SUB_S_CALL_SCORE,function(ServerlizeObject, wDataSize)
			{
				var data = {};
				data.type  = "CMD_S_CallScore";
				//当前玩家
				data.wCurrentUser = DataUtil.ReadNumber(ServerlizeObject, 16);
				//叫分玩家
				data.wCallScoreUser = DataUtil.ReadNumber(ServerlizeObject, 16);
				//当前叫分
				data.cbCurrentScore = DataUtil.ReadNumber(ServerlizeObject, 8);
				//上次叫分
				data.cbUserCallScore = DataUtil.ReadNumber(ServerlizeObject, 8);

				self.addDataToReceivedArray(data);
				//sparrowDirector.gameLayer.scoreLayer.showCallScore(data);
				//cc.log("-------------------------------------------------------用户叫分  "+JSON.stringify(data));
			});

			//庄家信息
			connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU,KernelCurrent, LandCrazyExMainID, LandCrazyExGameMsg.SUB_S_BANKER_INFO,function(ServerlizeObject, wDataSize)
			{
				var data = {};
				data.type = "CMD_S_BankerInfo";
				//庄家玩家
				data.wBankerUser = DataUtil.ReadNumber(ServerlizeObject, 16);
				//当前玩家
				data.wCurrentUser = DataUtil.ReadNumber(ServerlizeObject, 16);
				//庄家叫分
				data.cbBankerScore = DataUtil.ReadNumber(ServerlizeObject, 8);
				//庄家扑克
				data.cbBankerCard = [];
				for ( var i = 0; i < GAME_PLAYER; i++ )
				{
					data.cbBankerCard.push(DataUtil.ReadNumber(ServerlizeObject, 8));
				}
				self.addDataToReceivedArray(data);
				//sparrowDirector.gameLayer.deskLayer.showBankerInfo(data);
				//sparrowDirector.gameData.isCallScore = false;
				//cc.log("-------------------------------------------------------庄家信息  "+JSON.stringify(data));
			});

			//用户出牌
			connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU,KernelCurrent, LandCrazyExMainID, LandCrazyExGameMsg.SUB_S_OUT_CARD,function(ServerlizeObject, wDataSize)
			{
				var data = {};
				data.type = "CMD_S_OutCard";
				//出牌数目
				data.cbCardCount = DataUtil.ReadNumber(ServerlizeObject, 8);
				//当前玩家
				data.wCurrentUser = DataUtil.ReadNumber(ServerlizeObject, 16);
				//出牌玩家
				data.wOutCardUser = DataUtil.ReadNumber(ServerlizeObject, 16);
				//扑克列表
				data.cbCardData = [];
				for ( var i = 0; i < MAX_COUNT; i++ )
				{
					data.cbCardData.push(DataUtil.ReadNumber(ServerlizeObject, 8));
				}

				self.addDataToReceivedArray(data);
				//sparrowDirector.gameLayer.pukerLayer.savedOutPukerOrder(data);
				//cc.log("-------------------------------------------------------用户出牌  "+JSON.stringify(data));
			});

			//用户放弃
			connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU,KernelCurrent, LandCrazyExMainID, LandCrazyExGameMsg.SUB_S_PASS_CARD,function(SereverlizeObject,wDataSize)
			{
				var data = {};
				data.type = "CMD_S_PassCard";
				//一轮结束
				data.cbTureOver = DataUtil.ReadNumber(SereverlizeObject, 8);
				//当前玩家
				data.wCurrentUser = DataUtil.ReadNumber(SereverlizeObject, 16);
				//放弃玩家
				data.wPassCardUser = DataUtil.ReadNumber(SereverlizeObject, 16);

				//sparrowDirector.gameLayer.pukerLayer.savedOutPukerOrder(data);
				//sparrowDirector.gameLayer.orderPassCard(data);
				self.addDataToReceivedArray(data);
				//cc.log("-------------------------------------------------------用户放弃  "+JSON.stringify(data));
			});

			//游戏结束
			connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU,KernelCurrent, LandCrazyExMainID, LandCrazyExGameMsg.SUB_S_GAME_CONCLUDE,function(ServerlizeObject, wDataSize)
			{
				var data = {};
				data.type = "CMD_S_GameConclude";
				//积分变量
				//单元积分
				data.lCellScore = DataUtil.ReadNumber(ServerlizeObject,32);
				//游戏积分
				data.lGameScore = [];
				for ( var i = 0; i < GAME_PLAYER; i++ )
				{
					data.lGameScore.push(DataUtil.ReadNumber(ServerlizeObject, 64));
				}
				//春天标志
				data.bChunTiam = DataUtil.ReadNumber(ServerlizeObject, 8);
				//反春标志
				data.bFanChunTian = DataUtil.ReadNumber(ServerlizeObject, 8);

				//炸弹信息
				//炸弹个数
				data.cbBombCount = DataUtil.ReadNumber(ServerlizeObject, 8);
				//玩家放炸弹个数
				data.cbEachBombCount = [];
				for ( var i = 0; i < GAME_PLAYER; i++ )
				{
					data.cbEachBombCount.push(DataUtil.ReadNumber(ServerlizeObject, 8));
				}

				//游戏信息
				//叫分数目
				data.cbBankerScore = DataUtil.ReadNumber(ServerlizeObject, 8);
				//扑克数目
				data.cbCardCount = [];
				for ( var i = 0; i < GAME_PLAYER; i++ )
				{
					data.cbCardCount.push(DataUtil.ReadNumber(ServerlizeObject, 8));
				}
				//扑克列表
				data.cbHandCardData = [];
				for ( var i = 0; i < FULL_COUNT; i++ )
				{
					data.cbHandCardData.push(DataUtil.ReadNumber(ServerlizeObject, 8));
				}

				self.addDataToReceivedArray(data);
				if(sparrowDirector._sortRoomFlag) //hanhu #收到游戏结束消息立即改变排队房状态 2015/12/14
				{
					sparrowDirector.sortRoomUserInfoFlag = false;
				}
				//sparrowDirector.gameLayer.gameOver(data);
				//sparrowDirector.gameLayer.resultLayer.refreshTextures(data);
				cc.log("-------------------------------------------------------游戏结束  "+JSON.stringify(data));
			});

			//设置基数
			connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU,KernelCurrent, LandCrazyExMainID, LandCrazyExGameMsg.SUB_S_SET_BASESCORE,function(SereverlizeObject,wDataSize)
			{
				var data = {};
				data.type = "CMD_S_AndroidCard";
				//手上扑克
				data.cbHandCard = [];
				for ( var i = 0; i < GAME_PLAYER; i++ )
				{
					var arr = [];
					for ( var i = 0; i < NORMAL_COUNT; i++ )
					{
						arr.push(DataUtil.ReadNumber(SereverlizeObject,8));
					}
					data.cbHandCard.push(arr);
				}
				//当前玩家
				data.wCurrentUser = DataUtil.ReadNumber(SereverlizeObject, 16);
				//底牌扑克
				data.cbBanckCard = [];
				for ( var i = 0; i < GAME_PLAYER; i++ )
				{
					data.cbBanckCard.push(DataUtil.ReadNumber(SereverlizeObject, 8));
				}

				self.addDataToReceivedArray(data);
				//cc.log("-------------------------------------------------------设置基数  "+JSON.stringify(data));
			});

			//作弊扑克
			connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU,KernelCurrent, LandCrazyExMainID, LandCrazyExGameMsg.SUB_S_CHEAT_CARD,function(ServerlizeObject, wDataSize)
			{
				var data = {};
				data.type  = "CMD_S_CheatCard";
				//作弊玩家
				data.wCardUser = [];
				for ( var i = 0; i < GAME_PLAYER; i++ )
				{
					data.wCardUser.push(DataUtil.ReadNumber(ServerlizeObject, 16));
				}
				//作弊数量
				data.cbUserCount = DataUtil.ReadNumber(ServerlizeObject, 8);
				//扑克列表
				data.cbCardData = [];
				for ( var i = 0; i < GAME_PLAYER; i++ )
				{
					var arr = [];
					for ( var j = 0; j < MAX_COUNT; j++ )
					{
						arr.push(DataUtil.ReadNumber(ServerlizeObject, 8));
					}
					data.cbCardData.push(arr);
				}
				//扑克数量
				data.cbCardCount = [];
				for ( var i = 0; i < GAME_PLAYER; i++ )
				{
					data.cbCardCount.push(DataUtil.ReadNumber(ServerlizeObject, 8));
				}

				self.addDataToReceivedArray(data);
				//cc.log("-------------------------------------------------------作弊扑克  "+JSON.stringify(data));
			});

			//机器人聊天
			connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU,KernelCurrent, LandCrazyExMainID, LandCrazyExGameMsg.SUB_S_ANDROID_CARD,function(ServerlizeObject, wDataSize)
			{
				var data = {};
				data.type  = "CMD_S_AndroidChat";
				//机器人ID
				data.wChatChairID = DataUtil.ReadNumber(ServerlizeObject, 16);
				//消息类型(0:文字 1:表情 2:都发)
				data.cbSendType = DataUtil.ReadNumber(ServerlizeObject, 8);

				self.addDataToReceivedArray(data);
				//cc.log("-------------------------------------------------------机器人聊天  "+JSON.stringify(data));
			});

			//TODO
			//用户托管
			connectUtil.dataListenerManualEx(LandGameID.DOU_DI_ZHU,KernelCurrent, LandCrazyExMainID, LandCrazyExGameMsg.SUB_S_TRUSTEE,function(ServerlizeObject, wDataSize)
			{
				var data = {};
				data.type  = "SUB_S_TRUSTEE";
				//椅子号
				data.wChairID = DataUtil.ReadNumber(ServerlizeObject, 16);
				//取消托管，还是托管（0， 1）
				data.bTrustee = DataUtil.ReadNumber(ServerlizeObject, 8);

				self.addDataToReceivedArray(data);
				lm.log("-用户托管------------------------------------------------------玩家托管  "+JSON.stringify(data));
			});


		},
		castData:function(data)
		{
			//lm.log("-------------------------------------------------------收到消息啦啦啦  "+data.type+"  "+JSON.stringify(data));
			try{
				if(sparrowDirector._sortRoomFlag)
				{
					lm.log("去除排队准备界面");
					if ( sparrowDirector.srotWaitlayer && !sparrowDirector.gameData.isLaunchPuker && sparrowDirector.srotWaitlayer.waitTag)
					{
						sparrowDirector.srotWaitlayer.waitTag = false;
						sparrowDirector.srotWaitlayer.removeFromParent();
						sparrowDirector.srotWaitlayer = null;
					}
				}
			}catch (exp){
				lm.log("移出等待界面失败");
			}

			if ( Is_LAIZI_ROOM() )
			{
				this.laiziCastData(data);
				return;
			}
			else if(Is_HAPPY_ROOM())
			{
				this.happyCastData(data);
				return;
			}
			else if (Is_DRAGON_ROOM())
			{
				this.dragonCastData(data);
				return;
			}

			switch (data.type)
			{
				//游戏开始
				case "CMD_S_GameStart":
				{
					sparrowDirector.gameLayer.pukerLayer.setLaunchPuker(data);
					sparrowDirector.gameData.startUser = data.wStartUser;
					sparrowDirector.gameData.isCallScore = true;
					sparrowDirector.gameData.isReadied = true;
					sparrowDirector.gameLayer.hideResultGold();
					lm.log("-------------------------------------------------------doudizhu游戏开始  "+JSON.stringify(data));
					this.castNextData();
					break;
				}
				//用户叫分
				case "CMD_S_CallScore":
				{
					sparrowDirector.gameLayer.scoreLayer.showCallScore(data);
					sparrowDirector.gameData.isReadied = true;
					lm.log("-------------------------------------------------------用户叫分  "+JSON.stringify(data));
					this.castNextData();
					break;
				}
				//机器人扑克－设置基数
				case "CMD_S_AndroidCard":
				{
					lm.log("-------------------------------------------------------设置基数  "+JSON.stringify(data));
					this.castNextData();
					break;
				}
				//庄家信息
				case "CMD_S_BankerInfo":
				{
					sparrowDirector.gameData.isCallScore = false;
					sparrowDirector.gameData.isReadied = true;
					sparrowDirector.gameData.isFirstOutPuker = true;
					sparrowDirector.gameData.isCanOutPuker = true;
					sparrowDirector.gameLayer.deskLayer.showBankerInfo(data);
					lm.log("-------------------------------------------------------庄家信息  "+JSON.stringify(data));
					this.castNextData();
					break;
				}
				//机器人聊天
				case "CMD_S_AndroidChat":
				{
					lm.log("-------------------------------------------------------机器人聊天  "+JSON.stringify(data));
					this.castNextData();
					break;
				}
				//作弊扑克
				case "CMD_S_CheatCard":
				{
					lm.log("-------------------------------------------------------作弊扑克  "+JSON.stringify(data));
					this.castNextData();
					break;
				}
				//用户出牌
				case "CMD_S_OutCard":
				{
					sparrowDirector.gameData.isFirstOutPuker = false;
					sparrowDirector.gameLayer.pukerLayer.savedOutPukerOrder(data);
					lm.log("-------------------------------------------------------用户出牌  "+JSON.stringify(data));
					this.castNextData();
					break;
				}
				//用户放弃
				case "CMD_S_PassCard":
				{
					sparrowDirector.gameData.isOuteredPuker  = false;

					sparrowDirector.gameLayer.orderLayer.hideView ();
					if ( data.wPassCardUser == sparrowDirector.gameData.myChairIndex )
					{
						sparrowDirector.gameData.isOuteredPuker  = true;
						lm.log("passcard--------------- "+data.wPassCardUser+"  "+sparrowDirector.gameData.myChairIndex);
					}
					lm.log("passcard--------------- "+data.wPassCardUser+"  "+sparrowDirector.gameData.myChairIndex);

					sparrowDirector.gameLayer.pukerLayer.savedOutPukerOrder(data);
					sparrowDirector.gameLayer.orderPassCard(data);
					LandCEMusic.playPassEf();
					lm.log("-------------------------------------------------------用户放弃  "+JSON.stringify(data));
					this.castNextData();
					break;
				}
				//游戏结束
				case "CMD_S_GameConclude":
				{
					//春天 反春
					if(data.bChunTiam == 1 || data.bFanChunTian)
					{
						this.overData = data;
						var self = this;
						sparrowDirector.gameLayer.landAnimate.playChunTianAnimation(cc.callFunc(function()
						{
							sparrowDirector.gameLayer.gameOver(self.overData);
							sparrowDirector.gameLayer.resultLayer.refreshTextures(self.overData);
						}));
					}
					else
					{
						sparrowDirector.gameLayer.gameOver(data);
						sparrowDirector.gameLayer.resultLayer.refreshTextures(data);
					}
					lm.log("-------------------------------------------------------游戏结束  "+JSON.stringify(data));
					this.castNextData();
					break;
				}
				//玩家托管
				case "SUB_S_TRUSTEE":
				{
					lm.log("-------------------------------------------------------玩家托管  "+JSON.stringify(data));

					this.castNextData();
					break;
				}
				//TODO
				//场景消息
				//空闲状态
				case "CMD_S_StatusFree":
				{
					sparrowDirector.gameLayer.countDownLayer.setCountDownTime(data);
					if ( !sparrowDirector.gameData.isReadied && !sparrowDirector.sortRoomUserInfoFlag)
					{
						sparrowDirector.gameLayer.orderLayer.startBtn.visible = true;
						sparrowDirector.gameLayer.countDownLayer.startCountDown(-1);
					}
					else
					{
						sparrowDirector.gameLayer.orderLayer.startBtn.visible = false;
					}
					sparrowDirector.gameLayer.deskLayer.setBaseScore(data.lCellScore);

					lm.log("-------------------------------------------------------空闲状态  "+JSON.stringify(data));
					sparrowDirector.gameData.isGameOver = false;
					sparrowDirector.gameData.isCanOutPuker = false;
					this.castNextData();
					break;
				}
				//叫分状态
				case "CMD_S_StatusCall":
				{
					lm.log("-------------------------------------------------------叫分状态  "+JSON.stringify(data));
					sparrowDirector.gameLayer.countDownLayer.setCountDownTime(data);
					sparrowDirector.gameLayer.pukerLayer.sceneCallScore(data);
					sparrowDirector.gameData.isReadied = true;
					sparrowDirector.gameData.isCallScore = true;
					sparrowDirector.gameData.isGameOver = false;
					sparrowDirector.gameLayer.deskLayer.setBaseScore(data.lCellScore);
					sparrowDirector.gameLayer.deskLayer.showRandomTask(true);
					this.castNextData();
					break;
				}
				//游戏状态
				case "CMD_S_StatusPlay":
				{
					lm.log("-------------------------------------------------------游戏状态  "+JSON.stringify(data));
					sparrowDirector.gameLayer.countDownLayer.setCountDownTime(data);
					sparrowDirector.gameLayer.pukerLayer.sceneGamePlaying(data);
					sparrowDirector.gameData.isGaming = true;
					sparrowDirector.gameData.isReadied = true;
					sparrowDirector.gameData.isGameOver = false;
					sparrowDirector.gameLayer.deskLayer.setBaseScore(data.lCellScore);
					data.cbBombCount = data.cbBombCount ? data.cbBombCount : 0;
					sparrowDirector.gameLayer.deskLayer.setCurrentBeishu(null,Math.pow(2,data.cbBombCount)*data.cbBankerScore);
					sparrowDirector.gameLayer.deskLayer.showRandomTask(true);
					sparrowDirector.gameData.isCanOutPuker = true;
					this.castNextData();
					break;
				}

				default :
					break;
			}
		},
		laiziCastData:function(data)
		{
			switch (data.type)
			{
				//游戏开始
				case "CMD_S_GameStart":
				{
					sparrowDirector.gameLayer.pukerLayer.setLaunchPuker(data);
					sparrowDirector.gameData.startUser = data.wStartUser;
					sparrowDirector.gameData.wCurrentUser = data.wCurrentUser;
					sparrowDirector.gameData.isCallBankerState = true;
					sparrowDirector.gameData.isReadied = true;
					sparrowDirector.gameLayer.hideResultGold();
					lm.log("-------------------------------------------------------laizi游戏开始  "+JSON.stringify(data));
					this.castNextData();
					break;
				}
				//用户叫地主
				case "CMD_S_CallBanker":
				{
					lm.log("-------------------------------------------------------用户叫地主  "+JSON.stringify(data));
					sparrowDirector.gameLayer.orderLaiziLayer.showBankerResult(data);
					sparrowDirector.gameData.isReadied = true;
					this.castNextData();
					break;
				}
				//用户强地主
				case "CMD_S_RodBanker":
				{
					lm.log("-------------------------------------------------------用户强地主  "+JSON.stringify(data));
					sparrowDirector.gameLayer.orderLaiziLayer.showRodBanker(data);
					sparrowDirector.gameData.isCallBankerState = false;
					sparrowDirector.gameData.isRodBankerState = true;
					sparrowDirector.gameData.isReadied = true;
					this.castNextData();
					break;
				}
				//加倍信息
				case "CMD_S_Double":
				{
					lm.log("-------------------------------------------------------加倍信息  "+JSON.stringify(data));
					sparrowDirector.gameLayer.orderLaiziLayer.showDoubleInfo(data);
					sparrowDirector.gameData.isReadied = true;
					this.castNextData();
					break;
				}
				//用户明牌
				case "CMD_S_ValidCard":
				{
					lm.log("-------------------------------------------------------用户明牌  "+JSON.stringify(data));
					if ( !sparrowDirector.gameData.currentMPCountFirst )
					{
						sparrowDirector.gameData.currentMPCountFirst = data.wValidCardTime;
					}
					else if ( sparrowDirector.gameData.currentMPCountFirst && !sparrowDirector.gameData.currentMPCountSecond )
					{
						sparrowDirector.gameData.currentMPCountSecond = data.wValidCardTime;
					}
					else if ( sparrowDirector.gameData.currentMPCountFirst && sparrowDirector.gameData.currentMPCountSecond && !sparrowDirector.gameData.currentMPCountThrid )
					{
						sparrowDirector.gameData.currentMPCountThrid = data.wValidCardTime;
					}
					this.castNextData();
					break;
				}
				//庄家信息
				case "CMD_S_BankerInfo":
				{
					lm.log("-------------------------------------------------------庄家信息  "+JSON.stringify(data));
					sparrowDirector.gameData.isReadied = true;
					sparrowDirector.gameData.isDoubledState = true;
					sparrowDirector.gameData.isCallBankerState = false;
					sparrowDirector.gameData.isRodBankerState = false;
					sparrowDirector.gameData.isCanOutPuker = true;
					sparrowDirector.gameLayer.deskLayer.showBankerInfo(data);
					sparrowDirector.gameLayer.orderLaiziLayer.doubleOrder();
					this.castNextData();
					break;
				}
				//开始信息
				case "CMD_S_Game_Start":
				{
					lm.log("-------------------------------------------------------开始信息  "+JSON.stringify(data));

					sparrowDirector.gameData.isGaming = true;
					sparrowDirector.gameData.isCallBankerState = false;
					sparrowDirector.gameData.isRodBankerState = false;
					sparrowDirector.gameData.isDoubledState = false;
					sparrowDirector.gameData.isFirstOutPuker = true;
					sparrowDirector.gameLayer.orderLaiziLayer.laiziStart(data);
					this.castNextData();
					break;
				}
				//用户出牌
				case "CMD_S_OutCard":
				{
					sparrowDirector.gameData.isFirstOutPuker = false;
					sparrowDirector.gameLayer.pukerLayer.savedOutPukerOrder(data);
					lm.log("-------------------------------------------------------用户出牌  "+JSON.stringify(data));
					this.castNextData();
					break;
				}
				//用户放弃
				case "CMD_S_PassCard":
				{
					sparrowDirector.gameData.isOuteredPuker = false;
					//春天 反春
					if(data.bChunTiam == 1 || data.bFanChunTian)
					{
						this.overData = data;
						var self = this;
						sparrowDirector.gameLayer.landAnimate.playChunTianAnimation(cc.callFunc(function()
						{
							sparrowDirector.gameLayer.gameOver(self.overData);
							sparrowDirector.gameLayer.resultLayer.refreshTextures(self.overData);
						}));
					}
					else
					{
						sparrowDirector.gameLayer.gameOver(data);
						sparrowDirector.gameLayer.resultLayer.refreshTextures(data);
					}
					lm.log("-------------------------------------------------------游戏结束  "+JSON.stringify(data));
					this.castNextData();
					break;
				}
				//游戏结束
				case "CMD_S_GameConclude":
				{
					sparrowDirector.gameLayer.gameOver(data);
					sparrowDirector.gameLayer.resultLayer.refreshTextures(data);
					lm.log("-------------------------------------------------------游戏结束  "+JSON.stringify(data));
					this.castNextData();
					break;
				}
				//TODO
				//场景消息
				//空闲状态
				case "CMD_S_StatusFree":
				{
					sparrowDirector.gameLayer.countDownLayer.setCountDownTime(data);
					lm.log("空闲状态"+sparrowDirector.gameData.isReadied);
					lm.log("空闲状态"+sparrowDirector.sortRoomUserInfoFlag);
					if ( !sparrowDirector.gameData.isReadied && !sparrowDirector.sortRoomUserInfoFlag)
					{
						sparrowDirector.gameLayer.orderLayer.startBtn.visible = true;
						sparrowDirector.gameLayer.countDownLayer.startCountDown(-1);
					}
					else
					{
						sparrowDirector.gameLayer.orderLayer.startBtn.visible = false;
					}
					lm.log("-------------------------------------------------------空闲状态  "+JSON.stringify(data));
					sparrowDirector.gameData.isGameOver = false;
					sparrowDirector.gameLayer.deskLayer.setBaseScore(data.lCellScore);
					sparrowDirector.gameData.isCanOutPuker = false;
					this.castNextData();
					break;
				}
				//叫地主状态
				case "CMD_S_StatusCall":
				{
					lm.log("-------------------------------------------------------加地主状态  "+JSON.stringify(data));
					sparrowDirector.gameLayer.countDownLayer.setCountDownTime(data);
					sparrowDirector.gameLayer.pukerLayer.sceneGameCallBanker(data);
					sparrowDirector.gameData.isCallBankerState = true;
					sparrowDirector.gameData.isReadied = true;
					sparrowDirector.gameData.isGaming = false;
					sparrowDirector.gameData.isGameOver = false;
					sparrowDirector.gameLayer.deskLayer.setBaseScore(data.lCellScore);
					data.cbBombCount = data.cbBombCount ? data.cbBombCount : 0;
					sparrowDirector.gameLayer.deskLayer.setCurrentBeishu(null,Math.pow(2,data.cbBombCount));
					sparrowDirector.gameLayer.deskLayer.showRandomTask(true);
					this.castNextData();
					break;
				}
				//强地主状态
				case "CMD_S_StatusRod":
				{
					lm.log("-------------------------------------------------------强地主状态  "+JSON.stringify(data));
					sparrowDirector.gameLayer.countDownLayer.setCountDownTime(data);
					sparrowDirector.gameLayer.pukerLayer.sceneGameRodedBanker(data);
					sparrowDirector.gameData.isRodBankerState = true;
					sparrowDirector.gameData.isReadied = true;
					sparrowDirector.gameData.isGaming = false;
					sparrowDirector.gameLayer.deskLayer.setBaseScore(data.lCellScore);
					data.cbBombCount = data.cbBombCount ? data.cbBombCount : 0;
					sparrowDirector.gameLayer.deskLayer.setCurrentBeishu(null,Math.pow(2,data.cbBombCount));
					sparrowDirector.gameLayer.deskLayer.showRandomTask(true);
					this.castNextData();
					break;
				}
				//加倍状态
				case "CMD_S_StatusDouble":
				{
					lm.log("-------------------------------------------------------加倍状态  "+JSON.stringify(data));
					sparrowDirector.gameLayer.countDownLayer.setCountDownTime(data);
					sparrowDirector.gameLayer.pukerLayer.sceneGameDouble(data);
					sparrowDirector.gameData.isDoubledState = true;
					sparrowDirector.gameData.isReadied = true;
					sparrowDirector.gameData.isGaming = false;
					sparrowDirector.gameData.isGameOver = false;
					sparrowDirector.gameLayer.deskLayer.setBaseScore(data.lCellScore);
					data.cbBombCount = data.cbBombCount ? data.cbBombCount : 0;
					sparrowDirector.gameLayer.deskLayer.setCurrentBeishu(null,Math.pow(2,data.cbBombCount));
					sparrowDirector.gameLayer.deskLayer.showRandomTask(true);
					this.castNextData();
					break;
				}

				//游戏状态
				case "CMD_S_StatusPlay":
				{
					lm.log("------------------------------------------12-------------游戏进行状态  "+JSON.stringify(data));
					lm.log("===================mychairindex= "+sparrowDirector.gameData.myChairIndex);
					sparrowDirector.gameLayer.countDownLayer.setCountDownTime(data);
					sparrowDirector.gameData.isGaming = true;
					sparrowDirector.gameData.isReadied = true;
					sparrowDirector.gameData.isGameOver = false;
					sparrowDirector.gameLayer.pukerLayer.sceneGamePlayingLaizi(data);
					sparrowDirector.gameLayer.deskLayer.setBaseScore(data.lCellScore);
					data.cbBombCount = data.cbBombCount ? data.cbBombCount : 0;
					sparrowDirector.gameLayer.deskLayer.setCurrentBeishu(null,Math.pow(2,data.cbBombCount));
					sparrowDirector.gameLayer.deskLayer.showRandomTask(true);
					sparrowDirector.gameData.isCanOutPuker = true;
					this.castNextData();
					break;
				}

				default :
					break;
			}
		},
		happyCastData:function(data)
		{
			switch (data.type)
			{
				//游戏开始
				case "CMD_S_GameStart":
				{
					lm.log("欢乐斗地主 happyCastData -> 游戏开始 CMD_S_GameStart -> [ " + JSON.stringify(data) + "]");

					sparrowDirector.gameLayer.deskLayer.cleaningShowCard(1);
					sparrowDirector.gameLayer.deskLayer.cleaningShowCard(2);

					//清空叫抢状态
					for(var i=1;i<=3;i++)
					{
						var player = sparrowDirector.gameLayer.playerLayer.getChildByTag(100*i);
						if(player)
						{
							player.Image_nocall.visible = false;
							player.Image_norob.visible = false;
							player.Image_call.visible = false;
							player.Image_rob.visible = false;
						}
					}
					////////////////////////////////////////////////////////////////////////////

					sparrowDirector.gameData.happyRoomShowCardFlag = data["bShowCardStart"];	//是否明牌了
					lm.log("欢乐斗地主 用户明牌状态信息 CMD_S_GameStart [ " + " " + sparrowDirector.gameData.myChairIndex + " " + sparrowDirector.gameData.happyRoomShowCardFlag + "]");

					sparrowDirector.gameLayer.pukerLayer.setLaunchPuker(data);

					sparrowDirector.gameData.isReadied = true;
					sparrowDirector.gameData.happyRoomState = HappyRoomState.showcard;	//开始发牌 即进入明牌阶段
					sparrowDirector.gameData.isFirstOutPuker = true;
					sparrowDirector.gameLayer.orderLayer_happy.hideViewEx();
					sparrowDirector.gameLayer.hideResultGold();

					if(sparrowDirector.gameData.happyRoomShowCardFlag[sparrowDirector.gameData.myChairIndex] == 0)	//如果自己没有明牌开始则显示明牌按钮
					{
						sparrowDirector.gameLayer.orderLayer_happy.setOrderType(2);	//显示明牌按钮
					}
					else
					{
						sparrowDirector.gameLayer.deskLayer.setCurrentScore(5);
					}

					this.castNextData();
					break;
				}
				//通知明牌数据
				case "CMD_S_NotifyShowCardData":
				{
					lm.log("欢乐斗地主 happyCastData -> 通知明牌数据 CMD_S_NotifyShowCardData -> [ " + JSON.stringify(data) + "]");
					sparrowDirector.gameData.happyRoomShowCardFlag = data.bShowCard;	//用户明牌了
					lm.log("欢乐斗地主 用户明牌状态信息 CMD_S_NotifyShowCardData [ " + " " + sparrowDirector.gameData.myChairIndex + " " + sparrowDirector.gameData.happyRoomShowCardFlag + "]");

					sparrowDirector.gameLayer.deskLayer.showCardInfo(data);

					this.castNextData();
					break;
				}
				//通知玩家托管
				case "CMD_S_Trustee":
				{
					lm.log("欢乐斗地主 happyCastData -> 通知玩家托管 CMD_S_Trustee -> [ " + JSON.stringify(data) + "]");
					if( sparrowDirector.gameData.myChairIndex != data.wChairID )  //不是玩家自己
					{
						var direction = sparrowDirector.gameLayer.countDownLayer.getDirection(data.wChairID);
						var tag = (direction == 1) ? 300 : ((direction == 2) ? 200 : 100);
						if (tag == 200 || tag == 300) {
							var playerHead = sparrowDirector.gameLayer.playerLayer.getChildByTag(tag);
							playerHead.playerHead_ai.visible = (data.bTrustee == 1) ? true : false;
						}
					}

					this.castNextData();
					break;
				}
				//玩家明牌
				case "CMD_S_ShowCard":
				{
					//{"type":"CMD_S_StatusShow","bShowCard":[0,0,0],"cbHandCardData":[79,50,34,2,17,60,44,12,11,10,57,41,25,9,56,52,35],"lTurnScore":[0,0,0],"lCollectScore":[0,0,0],"lServiceScore":0,"lCellScore":100}
					lm.log("欢乐斗地主 happyCastData -> 玩家明牌 CMD_S_ShowCard -> [ " + JSON.stringify(data) + "]");
					sparrowDirector.gameData.happyRoomShowCardFlag[data.wShowCardUser] = 1;	//用户明牌了
					lm.log("欢乐斗地主 用户明牌状态信息 CMD_S_ShowCard [ " + " " + sparrowDirector.gameData.myChairIndex + " " + sparrowDirector.gameData.happyRoomShowCardFlag + "]");
					sparrowDirector.gameLayer.deskLayer.setCurrentScore(data.wShowCardTimes);
					this.castNextData();
					break;
				}
				//用户叫 抢 放弃
				case "CMD_S_NotifyLand":
				{
					lm.log("欢乐斗地主 happyCastData -> 用户叫 抢 放弃 CMD_S_NotifyLand -> [ " + JSON.stringify(data) + "]");
					sparrowDirector.gameLayer.orderLayer_happy.showUserOrder(data);
					sparrowDirector.gameData.isReadied = true;

					this.castNextData();
					break;
				}
				//通知玩家玩游戏
				case "CMD_S_NotifyPlay":
				{
					lm.log("欢乐斗地主 happyCastData -> 通知玩家玩游戏 CMD_S_NotifyPlay -> [ " + JSON.stringify(data) + "]");

					sparrowDirector.gameData.isReadied = true;
					sparrowDirector.gameData.isGaming = true;
					sparrowDirector.gameData.happyRoomState = HappyRoomState.play;	//进入出牌阶段
					sparrowDirector.gameData.isCallBankerState = false;
					sparrowDirector.gameData.isRodBankerState = false;
					sparrowDirector.gameLayer.orderLayer_happy.hideViewEx();

					sparrowDirector.gameLayer.deskLayer.showBankerInfo(data);
					sparrowDirector.gameLayer.deskLayer.showCardInfo(data);
					sparrowDirector.gameData.isCanOutPuker = true;

					sparrowDirector.gameLayer.deskLayer.setCurrentBeishu(null,data.wTotalAddTimes);

					this.castNextData();
					break;
				}
				//用户出牌
				case "CMD_S_OutCard":
				{
					lm.log("欢乐斗地主 happyCastData -> 用户出牌 CMD_S_OutCard -> [ " + JSON.stringify(data) + "]");
					sparrowDirector.gameData.isFirstOutPuker = false;
					sparrowDirector.gameLayer.pukerLayer.savedOutPukerOrder(data);
					this.castNextData();
					break;
				}
				//用户放弃
				case "CMD_S_PassCard":
				{
					lm.log("欢乐斗地主 happyCastData -> 用户放弃 CMD_S_PassCard -> [ " + JSON.stringify(data) + "]");
					sparrowDirector.gameLayer.pukerLayer.savedOutPukerOrder(data);
					sparrowDirector.gameLayer.orderPassCard(data);
					lm.log("-------------------------------------------------------用户放弃  "+JSON.stringify(data));
					LandCEMusic.playPassEf();
					this.castNextData();
					break;
				}
				//游戏结束
				case "CMD_S_GameConclude":
				{
					lm.log("欢乐斗地主 happyCastData -> 游戏结束 CMD_S_GameConclude -> [ " + JSON.stringify(data) + "]");

					//春天 反春
					if(data.bChunTiam == 1 || data.bFanChunTian)
					{
						this.overData = data;
						var self = this;
						sparrowDirector.gameLayer.landAnimate.playChunTianAnimation(cc.callFunc(function()
						{
							sparrowDirector.gameData.happyRoomState = HappyRoomState.finish;	//进入结束阶段
							sparrowDirector.gameLayer.gameOver(self.overData);
							sparrowDirector.gameLayer.resultLayer.refreshTextures(self.overData);
						}));
					}
					else
					{
						sparrowDirector.gameData.happyRoomState = HappyRoomState.finish;	//进入结束阶段
						sparrowDirector.gameLayer.gameOver(data);
						sparrowDirector.gameLayer.resultLayer.refreshTextures(data);
					}
					this.castNextData();

					break;
				}

				//todo
				//场景消息--等待状态，等待开始
				case "CMD_S_StatusFree":
				{
					lm.log("欢乐斗地主 happyCastData -> 空闲状态 CMD_S_PassCard -> [ " + JSON.stringify(data) + "]");

					sparrowDirector.gameLayer.countDownLayer.setCountDownTime(data);
					sparrowDirector.gameData.isGameOver = false;
					sparrowDirector.gameLayer.deskLayer.setBaseScore(data.lCellScore);	//设置底分

					if ( !sparrowDirector.gameData.isReadied && !sparrowDirector.sortRoomUserInfoFlag)
					{
						sparrowDirector.gameLayer.orderLayer.startBtn.visible = true;
						sparrowDirector.gameLayer.countDownLayer.startCountDown(-1);
					}
					else
					{
						sparrowDirector.gameLayer.orderLayer.startBtn.visible = false;
					}
					sparrowDirector.gameData.isCanOutPuker = false;
					this.castNextData();
					break;
				}
				//场景消息--叫分状态
				case "CMD_S_StatusLand":
				{
					lm.log("欢乐斗地主 happyCastData -> 叫分状态 CMD_S_StatusLand -> [ " + JSON.stringify(data) + "]");
					sparrowDirector.gameLayer.countDownLayer.setCountDownTime(data);

					sparrowDirector.gameData.isReadied = true;
					sparrowDirector.gameData.isGaming = false;
					sparrowDirector.gameData.isGameOver = false;
					sparrowDirector.gameLayer.deskLayer.setBaseScore(data.lCellScore);	//设置底分

					sparrowDirector.gameLayer.orderLayer_happy.hideViewEx();
					sparrowDirector.gameLayer.pukerLayer.sceneGameCallBanker_happy(data);
					sparrowDirector.gameLayer.deskLayer.showCardInfo(data);

					sparrowDirector.gameData.happyRoomShowCardFlag = data["bShowCard"];	//是否明牌了
					lm.log("欢乐斗地主 用户明牌状态信息 CMD_S_GameStart [ " + " " + sparrowDirector.gameData.myChairIndex + " " + sparrowDirector.gameData.happyRoomShowCardFlag + "]");

					sparrowDirector.gameLayer.deskLayer.showRandomTask(true);

					this.castNextData();
					break;
				}
				//场景消息--游戏进行
				case "CMD_S_StatusPlay":
				{
					lm.log("欢乐斗地主 happyCastData -> 游戏进行 CMD_S_StatusPlay -> [ " + JSON.stringify(data) + "]");
					sparrowDirector.gameLayer.countDownLayer.setCountDownTime(data);

					sparrowDirector.gameData.isGaming = true;
					sparrowDirector.gameData.isReadied = true;
					sparrowDirector.gameData.isGameOver = false;
					sparrowDirector.gameLayer.deskLayer.setBaseScore(data.lCellScore);

					data.cbBombCount = data.cbBombCount ? data.cbBombCount : 0;
					sparrowDirector.gameLayer.deskLayer.setCurrentBeishu(null,Math.pow(2,data.cbBombCount)*data.wTotalAddTimes);

					sparrowDirector.gameLayer.orderLayer_happy.hideViewEx();
					sparrowDirector.gameLayer.pukerLayer.sceneGamePlaying_happy(data);

					sparrowDirector.gameData.happyRoomShowCardFlag = data["bShowCard"];	//是否明牌了
					lm.log("欢乐斗地主 用户明牌状态信息 CMD_S_GameStart [ " + " " + sparrowDirector.gameData.myChairIndex + " " + sparrowDirector.gameData.happyRoomShowCardFlag + "]");

					sparrowDirector.gameData.isCanOutPuker = true;
					this.castNextData();
					break;
				}
				default :
					lm.log("欢乐斗地主 past happyCastData -> [ " + JSON.stringify(data) + "]");
					break;
			}
		},
		dragonCastData:function(data)
		{
			DragonCastData_122(data, this);
		},
		//癞子场景消息
		handleLizidoudiz:function(gamestatus, SerializeObject, wDataSzie)
		{
			lm.log("==================================== 癞子场景消息 ====================================")
			var data = {};
			var self = this;
			//空闲状态
			if(gamestatus == LandCrazyExGameStatusLz.GAME_SCENE_FREE)
			{
				data["type"] = "CMD_S_StatusFree";

				//基础积分
				data["lCellScore"] = DataUtil.ReadNumber(SerializeObject, 32);
				//防做弊场
				data["bAvertCheat"] = DataUtil.ReadNumber(SerializeObject, 8);
				//叫地主时间
				data["cbTimeCallBanker"] = DataUtil.ReadNumber(SerializeObject, 8);
				//抢地主时间
				data["cbTimeRodBanker"] = DataUtil.ReadNumber(SerializeObject, 8);
				//加倍时间
				data["cbTimeAddDouble"] = DataUtil.ReadNumber(SerializeObject, 8);
				//开始时间
				data["cbTimeStartGame"] = DataUtil.ReadNumber(SerializeObject, 8);
				//首出时间
				data["cbTimeHeadOutCard"] = DataUtil.ReadNumber(SerializeObject, 8);
				//出牌时间
				data["cbTimeOutCard"] = DataUtil.ReadNumber(SerializeObject, 8);

				//历史积分信息
				data["lTurnScore"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["lTurnScore"].push(DataUtil.ReadNumber(SerializeObject, 64));
				}
				//积分信息
				data["lCollectScore"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["lCollectScore"].push(DataUtil.ReadNumber(SerializeObject, 64));
				}
				self.addDataToReceivedArray(data);
				//sparrowDirector.gameLayer.orderLayer.startBtn.visible = true;
				//sparrowDirector.gameLayer.countDownLayer.startCountDown(-1);
				//cc.log("-------------------------------------------------------空闲状态  "+JSON.stringify(data));
			}//叫地主状态
			else if (gamestatus == LandCrazyExGameStatusLz.GAME_SCENE_CALL)
			{
				data["type"] = "CMD_S_StatusCall";
				//叫地主时间
				data["cbTimeCallBanker"] = DataUtil.ReadNumber(SerializeObject, 8);
				//抢地主时间
				data["cbTimeRodBanker"] = DataUtil.ReadNumber(SerializeObject, 8);
				//加倍时间
				data["cbTimeAddDouble"] = DataUtil.ReadNumber(SerializeObject, 8);
				//开始时间
				data["cbTimeStartGame"] = DataUtil.ReadNumber(SerializeObject, 8);
				//首出时间
				data["cbTimeHeadOutCard"] = DataUtil.ReadNumber(SerializeObject, 8);
				//出牌时间
				data["cbTimeOutCard"] = DataUtil.ReadNumber(SerializeObject, 8);

				//基础积分
				data["lCellScore"] = DataUtil.ReadNumber(SerializeObject, 32);
				//首叫用户
				data["wFirstUser"] = DataUtil.ReadNumber(SerializeObject, 16);
				//首叫明牌
				data["wFirstValidUser"] = DataUtil.ReadNumber(SerializeObject, 16);
				//当前玩家
				data["wCurrentUser"] = DataUtil.ReadNumber(SerializeObject, 16);
				//初始倍数
				data["wStartTime"] = DataUtil.ReadNumber(SerializeObject, 16);
				//明牌倍数
				data["wValidCardTime"] = DataUtil.ReadNumber(SerializeObject, 16);
				//明牌信息
				data["bValidCardInfo"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["bValidCardInfo"].push(DataUtil.ReadNumber(SerializeObject, 8));
				}
				//叫地主信息
				data["cbCallBankerInfo"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["cbCallBankerInfo"].push(DataUtil.ReadNumber(SerializeObject, 8));
				}
				//手上扑克
				data["cbHandCardData"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					var arr = [];
					for ( var j = 0; j < NORMAL_COUNT; j++ )
					{
						arr.push(DataUtil.ReadNumber(SerializeObject, 8))
					}
					data["cbHandCardData"].push(arr);
				}

				//历史积分信息
				data["lTurnScore"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["lTurnScore"].push(DataUtil.ReadNumber(SerializeObject, 64));
				}
				//积分信息
				data["lCollectScore"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["lCollectScore"].push(DataUtil.ReadNumber(SerializeObject, 64));
				}
				//防做弊场
				data["bAvertCheat"] = DataUtil.ReadNumber(SerializeObject, 8);
				self.addDataToReceivedArray(data);
				//cc.log("-------------------------------------------------------加地主状态  "+JSON.stringify(data));
				//sparrowDirector.gameLayer.pukerLayer.sceneGameCallBanker(data);
				//sparrowDirector.gameData.isCallBankerState = true;
				//sparrowDirector.gameData.isReadied = true;
				//sparrowDirector.gameData.isGaming = false;

			}//强地主状态
			else if (gamestatus == LandCrazyExGameStatusLz.GAME_SCENE_ROD)
			{
				data["type"] = "CMD_S_StatusRod";
				//叫地主时间
				data["cbTimeCallBanker"] = DataUtil.ReadNumber(SerializeObject, 8);
				//抢地主时间
				data["cbTimeRodBanker"] = DataUtil.ReadNumber(SerializeObject, 8);
				//加倍时间
				data["cbTimeAddDouble"] = DataUtil.ReadNumber(SerializeObject, 8);
				//开始时间
				data["cbTimeStartGame"] = DataUtil.ReadNumber(SerializeObject, 8);
				//首出时间
				data["cbTimeHeadOutCard"] = DataUtil.ReadNumber(SerializeObject, 8);
				//出牌时间
				data["cbTimeOutCard"] = DataUtil.ReadNumber(SerializeObject, 8);

				//基础积分
				data["lCellScore"] = DataUtil.ReadNumber(SerializeObject, 32);
				//首叫用户
				data["wFirstUser"] = DataUtil.ReadNumber(SerializeObject, 16);
				//首叫明牌
				data["wFirstValidUser"] = DataUtil.ReadNumber(SerializeObject, 16);
				//庄家用户
				data["wBankerUser"] = DataUtil.ReadNumber(SerializeObject, 16);
				//当前玩家
				data["wCurrentUser"] = DataUtil.ReadNumber(SerializeObject, 16);


				//初始倍数
				data["wStartTime"] = DataUtil.ReadNumber(SerializeObject, 16)
				//明牌倍数
				data["wValidCardTime"] = DataUtil.ReadNumber(SerializeObject, 16);
				//抢地主倍数
				data["wRodBankerTime"] = DataUtil.ReadNumber(SerializeObject, 16);

				//明牌信息，bool
				data["bValidCardInfo"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["bValidCardInfo"].push(DataUtil.ReadNumber(SerializeObject, 8));
				}
				//叫地主信息
				data["cbCallBankerInfo"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["cbCallBankerInfo"].push(DataUtil.ReadNumber(SerializeObject, 8));
				}
				//抢地主信息
				data["cbRodBankerInfo"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["cbRodBankerInfo"].push(DataUtil.ReadNumber(SerializeObject, 8));
				}
				//明牌用户信息，叫地主信息
				data["cbValidCardInfo"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["cbValidCardInfo"].push(DataUtil.ReadNumber(SerializeObject, 8));
				}

				//手上扑克
				data["cbHandCardData"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					var arr = [];
					for ( var j = 0; j < NORMAL_COUNT; j++ )
					{
						arr.push(DataUtil.ReadNumber(SerializeObject, 8))
					}
					data["cbHandCardData"].push(arr);
				}

				//历史积分信息
				data["lTurnScore"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["lTurnScore"].push(DataUtil.ReadNumber(SerializeObject, 64));
				}
				//积分信息
				data["lCollectScore"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["lCollectScore"].push(DataUtil.ReadNumber(SerializeObject, 64));
				}
				//防做弊场
				data["bAvertCheat"] = DataUtil.ReadNumber(SerializeObject, 8);
				self.addDataToReceivedArray(data);
				//cc.log("-------------------------------------------------------强地主状态  "+JSON.stringify(data));
				//sparrowDirector.gameLayer.pukerLayer.sceneGameRodedBanker(data);
				//sparrowDirector.gameData.isRodBankerState = true;
				//sparrowDirector.gameData.isReadied = true;
				//sparrowDirector.gameData.isGaming = false;

			}//加倍状态
			else if (gamestatus == LandCrazyExGameStatusLz.GAME_SCEND_ADD)
			{
				data["type"] = "CMD_S_StatusDouble";
				//叫地主时间
				data["cbTimeCallBanker"] = DataUtil.ReadNumber(SerializeObject, 8);
				//抢地主时间
				data["cbTimeRodBanker"] = DataUtil.ReadNumber(SerializeObject, 8);
				//加倍时间
				data["cbTimeAddDouble"] = DataUtil.ReadNumber(SerializeObject, 8);
				//开始时间
				data["cbTimeStartGame"] = DataUtil.ReadNumber(SerializeObject, 8);
				//首出时间
				data["cbTimeHeadOutCard"] = DataUtil.ReadNumber(SerializeObject, 8);
				//出牌时间
				data["cbTimeOutCard"] = DataUtil.ReadNumber(SerializeObject, 8);

				//基础积分
				data["lCellScore"] = DataUtil.ReadNumber(SerializeObject, 32);
				//庄家用户
				data["wBankerUser"] = DataUtil.ReadNumber(SerializeObject, 16);
				//当前玩家
				data["wCurrentUser"] = DataUtil.ReadNumber(SerializeObject, 16);
				//初始倍数
				data["wStartTime"] = DataUtil.ReadNumber(SerializeObject, 16)
				//明牌倍数
				data["wValidCardTime"] = DataUtil.ReadNumber(SerializeObject, 16);
				//抢地主倍数
				data["wRodBankerTime"] = DataUtil.ReadNumber(SerializeObject, 16);

				//明牌信息，bool
				data["bValidCardInfo"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["bValidCardInfo"].push(DataUtil.ReadNumber(SerializeObject, 8));
				}
				//叫地主信息
				data["cbCallBankerInfo"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["cbCallBankerInfo"].push(DataUtil.ReadNumber(SerializeObject, 8));
				}
				//抢地主信息
				data["cbRodBankerInfo"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["cbRodBankerInfo"].push(DataUtil.ReadNumber(SerializeObject, 8));
				}
				//加倍信息
				data["cbAddDoubleInfo"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["cbAddDoubleInfo"].push(DataUtil.ReadNumber(SerializeObject, 8));
				}

				//游戏底牌
				data["cbBankerCard"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["cbBankerCard"].push(DataUtil.ReadNumber(SerializeObject, 8));
				}
				//扑克数目
				data["cbHandCardCount"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["cbHandCardCount"].push(DataUtil.ReadNumber(SerializeObject, 8));
				}
				//手上扑克
				data["cbHandCardData"] = [];
				for ( var j = 0; j < GAME_PLAYER; j++ )
				{
					data["cbHandCardData"].push([]);
					for( var k = 0; k < MAX_COUNT; k++ )
					{
						data["cbHandCardData"][j].push(DataUtil.ReadNumber(SerializeObject, 8));
					}
				}
				//癞子扑克
				data["cbLaiziCard"] = DataUtil.ReadNumber(SerializeObject, 8);

				//历史积分信息
				data["lTurnScore"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["lTurnScore"].push(DataUtil.ReadNumber(SerializeObject, 64));
				}
				//积分信息
				data["lCollectScore"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["lCollectScore"].push(DataUtil.ReadNumber(SerializeObject, 64));
				}
				//防做弊场
				data["bAvertCheat"] = DataUtil.ReadNumber(SerializeObject, 8);

				self.addDataToReceivedArray(data);
				//cc.log("-------------------------------------------------------加倍状态  "+JSON.stringify(data));
				//sparrowDirector.gameLayer.pukerLayer.sceneGameDouble(data);
				//sparrowDirector.gameData.isDoubledState = true;
				//sparrowDirector.gameData.isReadied = true;
				//sparrowDirector.gameData.isGaming = false;

			}//游戏进行状态
			else if (gamestatus == LandCrazyExGameStatusLz.GAME_SCEND_PLAY)
			{
				data["type"] = "CMD_S_StatusPlay";
				//叫地主时间
				data["cbTimeCallBanker"] = DataUtil.ReadNumber(SerializeObject, 8);
				//抢地主时间
				data["cbTimeRodBanker"] = DataUtil.ReadNumber(SerializeObject, 8);
				//加倍时间
				data["cbTimeAddDouble"] = DataUtil.ReadNumber(SerializeObject, 8);
				//首出时间
				data["cbStartTime"] = DataUtil.ReadNumber(SerializeObject, 8);
				//首出时间
				data["cbTimeHeadOutCard"] = DataUtil.ReadNumber(SerializeObject, 8);
				//出牌时间
				data["cbTimeOutCard"] = DataUtil.ReadNumber(SerializeObject, 8);


				//基础积分
				data["lCellScore"] = DataUtil.ReadNumber(SerializeObject, 32);
				//庄家用户
				data["wBankerUser"] = DataUtil.ReadNumber(SerializeObject, 16);
				//当前玩家
				data["wCurrentUser"] = DataUtil.ReadNumber(SerializeObject, 16);
				//初始倍数
				data["wStartTime"] = DataUtil.ReadNumber(SerializeObject, 16)
				//明牌倍数
				data["wValidCardTime"] = DataUtil.ReadNumber(SerializeObject, 16);
				//抢地主倍数
				data["wRodBankerTime"] = DataUtil.ReadNumber(SerializeObject, 16);
				//炸弹倍数
				data["wBombTime"] = DataUtil.ReadNumber(SerializeObject, 16);
				//炸弹次数
				data["cbBombCount"] = DataUtil.ReadNumber(SerializeObject, 8);

				//明牌信息，bool
				data["bValidCardInfo"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["bValidCardInfo"].push(DataUtil.ReadNumber(SerializeObject, 8));
				}
				//叫地主信息
				data["cbCallBankerInfo"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["cbCallBankerInfo"].push(DataUtil.ReadNumber(SerializeObject, 8));
				}
				//抢地主信息
				data["cbRodBankerInfo"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["cbRodBankerInfo"].push(DataUtil.ReadNumber(SerializeObject, 8));
				}
				//加倍信息
				data["cbAddDoubleInfo"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["cbAddDoubleInfo"].push(DataUtil.ReadNumber(SerializeObject, 8));
				}
				//胜利玩家
				data["wTurnWiner"] = DataUtil.ReadNumber(SerializeObject, 16);
				//出牌数目
				data["cbTurnCardCount"] = DataUtil.ReadNumber(SerializeObject, 8);
				//出牌数据
				data["cbTurnCardData"] = [];
				for (var i = 0; i < MAX_COUNT; i++)
				{
					data["cbTurnCardData"].push(DataUtil.ReadNumber(SerializeObject, 8));
				}

				//出牌癞子数
				data["cbTurnLaiziCount"] = DataUtil.ReadNumber(SerializeObject, 8);
				//癞子扑克
				data["cbLaiziCard"] = DataUtil.ReadNumber(SerializeObject, 8);

				//游戏底牌
				data["cbBankerCard"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["cbBankerCard"].push(DataUtil.ReadNumber(SerializeObject, 8));
				}
				//扑克数目
				data["cbHandCardCount"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["cbHandCardCount"].push(DataUtil.ReadNumber(SerializeObject, 8));
				}
				//手上扑克
				data["cbHandCardData"] = [];
				for ( var j = 0; j < GAME_PLAYER; j++ )
				{
					data["cbHandCardData"].push([]);
					for( var k = 0; k < MAX_COUNT; k++ )
					{
						data["cbHandCardData"][j].push(DataUtil.ReadNumber(SerializeObject, 8));
					}
				}

				//历史积分信息
				data["lTurnScore"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["lTurnScore"].push(DataUtil.ReadNumber(SerializeObject, 64));
				}
				//积分信息
				data["lCollectScore"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["lCollectScore"].push(DataUtil.ReadNumber(SerializeObject, 64));
				}
				//防做弊场
				data["bAvertCheat"] = DataUtil.ReadNumber(SerializeObject, 8);

				self.addDataToReceivedArray(data);

				//cc.log("------------------------------------------12-------------游戏进行状态  "+JSON.stringify(data));
				//cc.log("===================mychairindex= "+sparrowDirector.gameData.myChairIndex);
				//sparrowDirector.gameLayer.pukerLayer.sceneGamePlayingLaizi(data);
				//sparrowDirector.gameData.isGaming = true;
				//sparrowDirector.gameData.isReadied = true;
			}
		},
		//斗地主场景消息
		handleDoudizu:function(gamestatus, SerializeObject, wDataSzie)
		{
			var self = this;
			var data = {};
			//空闲状态
			if(gamestatus == LandCrazyExGameStatus.GAME_SCENE_FREE)
			{
				data["type"] = "CMD_S_StatusFree";
				//基础积分
				data["lCellScore"] = DataUtil.ReadNumber(SerializeObject, 32);
				//出牌时间
				data["cbTimeOutCard"] = DataUtil.ReadNumber(SerializeObject, 8);
				//叫分时间
				data["cbTimeCallScore"] = DataUtil.ReadNumber(SerializeObject, 8);
				//开始时间
				data["cbTimeStartGame"] = DataUtil.ReadNumber(SerializeObject, 8);
				//首出时间
				data["cbTimeHeadOutCard"] = DataUtil.ReadNumber(SerializeObject, 8);

				//历史积分信息
				data["lTurnScore"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["lTurnScore"].push(DataUtil.ReadNumber(SerializeObject, 64));
				}
				//积分信息
				data["lCollectScore"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["lCollectScore"].push(DataUtil.ReadNumber(SerializeObject, 64));
				}

				self.addDataToReceivedArray(data);
				//cc.log("-------------------------------------------------------空闲状态  "+JSON.stringify(data));
				//sparrowDirector.gameLayer.orderLayer.startBtn.visible = true;
				//sparrowDirector.gameLayer.deskLayer.setBaseScore(data.lCellScore);
				//sparrowDirector.gameLayer.countDownLayer.startCountDown(-1);
			}//叫分状态
			else if(gamestatus == LandCrazyExGameStatus.GAME_SCENE_CALL)
			{
				data["type"] = "CMD_S_StatusCall";

				//出牌时间
				data["cbTimeOutCard"] = DataUtil.ReadNumber(SerializeObject, 8);
				//叫分时间
				data["cbTimeCallScore"] = DataUtil.ReadNumber(SerializeObject, 8);
				//开始时间
				data["cbTimeStartGame"] = DataUtil.ReadNumber(SerializeObject, 8);
				//首出时间
				data["cbTimeHeadOutCard"] = DataUtil.ReadNumber(SerializeObject, 8);

				//单元积分
				data["lCellScore"] = DataUtil.ReadNumber(SerializeObject, 32);
				//当前玩家
				data["wCurrentUser"] = DataUtil.ReadNumber(SerializeObject, 16);
				//庄家叫分
				data["cbBankerScore"] = DataUtil.ReadNumber(SerializeObject, 8);

				//叫分信息
				data["cbScoreInfo"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["cbScoreInfo"].push(DataUtil.ReadNumber(SerializeObject, 8));
				}
				//手上扑克
				data["cbHandCardData"] = [];
				for (var i = 0; i < NORMAL_COUNT; i++)
				{
					data["cbHandCardData"].push(DataUtil.ReadNumber(SerializeObject, 8));
				}
				//玩家托管
				data["bUserTrustee"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["bUserTrustee"].push(DataUtil.ReadNumber(SerializeObject, 8));
				}
				//积分信息
				data["lTurnScore"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["lTurnScore"].push(DataUtil.ReadNumber(SerializeObject, 64));
				}
				//积分信息
				data["lCollectScore"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["lCollectScore"].push(DataUtil.ReadNumber(SerializeObject, 64));
				}

				self.addDataToReceivedArray(data);
				//cc.log("-------------------------------------------------------叫分状态  "+JSON.stringify(data));
				//sparrowDirector.gameLayer.pukerLayer.sceneCallScore(data);

			}//游戏状态
			else if(gamestatus == LandCrazyExGameStatus.GAME_SCENE_PLAY)
			{
				data["type"] = "CMD_S_StatusPlay";

				//出牌时间
				data["cbTimeOutCard"] = DataUtil.ReadNumber (SerializeObject, 8);
				//叫分时间
				data["cbTimeCallScore"] = DataUtil.ReadNumber (SerializeObject, 8);
				//开始时间
				data["cbTimeStartGame"] = DataUtil.ReadNumber (SerializeObject, 8);
				//首出时间
				data["cbTimeHeadOutCard"] = DataUtil.ReadNumber (SerializeObject, 8);

				//单元积分
				data["lCellScore"] = DataUtil.ReadNumber (SerializeObject, 32);
				//炸弹次数
				data["cbBombCount"] = DataUtil.ReadNumber (SerializeObject, 8);
				//庄家用户
				data["wBankerUser"] = DataUtil.ReadNumber (SerializeObject, 16);
				//当前玩家
				data["wCurrentUser"] = DataUtil.ReadNumber (SerializeObject, 16);
				//庄家叫分
				data["cbBankerScore"] = DataUtil.ReadNumber (SerializeObject, 8);

				//胜利玩家
				data["wTurnWiner"] = DataUtil.ReadNumber (SerializeObject, 16);
				//出牌数目
				data["cbTurnCardCount"] = DataUtil.ReadNumber (SerializeObject, 8);
				//出牌数据
				data["cbTurnCardData"] = [];
				for (var i = 0; i < MAX_COUNT; i++) {
					data["cbTurnCardData"].push (DataUtil.ReadNumber (SerializeObject, 8));
				}

				//游戏底牌
				data["cbBankerCard"] = [];
				for (var i = 0; i < GAME_PLAYER; i++) {
					data["cbBankerCard"].push (DataUtil.ReadNumber (SerializeObject, 8));
				}
				//手上扑克
				data["cbHandCardData"] = [];
				for (var i = 0; i < MAX_COUNT; i++) {
					data["cbHandCardData"].push (DataUtil.ReadNumber (SerializeObject, 8));
				}
				//扑克数目
				data["cbHandCardCount"] = [];
				for (var i = 0; i < GAME_PLAYER; i++) {
					data["cbHandCardCount"].push (DataUtil.ReadNumber (SerializeObject, 8));
				}
				//玩家托管
				data["bUserTrustee"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["bUserTrustee"].push(DataUtil.ReadNumber(SerializeObject, 8));
				}
				//积分信息
				data["lTurnScore"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["lTurnScore"].push (DataUtil.ReadNumber (SerializeObject, 64));
				}
				//积分信息
				data["lCollectScore"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["lCollectScore"].push (DataUtil.ReadNumber (SerializeObject, 64));
				}

				self.addDataToReceivedArray(data);
				//cc.log("-------------------------------------------------------游戏状态  "+JSON.stringify(data));
				//sparrowDirector.gameLayer.pukerLayer.sceneGamePlaying(data);
				//sparrowDirector.gameData.isGaming = true;
				//sparrowDirector.gameData.isReadied = true;
			}
		},
		//欢乐斗地主场景消息
		handleDoudizuHappy:function(gamestatus, SerializeObject, wDataSzie)
		{
			lm.log("欢乐斗地主 -> handleDoudizuHappy -> [ " + gamestatus + "]");
			var self = this;
			var data = {};
			//等待状态，等待开始
			if(gamestatus == LandCrazyExGameStatusHappy.GAME_SCENE_FREE)
			{
				data["type"] = "CMD_S_StatusFree";
				//基础积分
				data["lCellScore"] = DataUtil.ReadNumber(SerializeObject, 32);
				//出牌时间
				data["cbTimeOutCard"] = DataUtil.ReadNumber(SerializeObject, 8);
				//叫分时间
				data["cbTimeCallScore"] = DataUtil.ReadNumber(SerializeObject, 8);
				//开始时间
				data["cbTimeStartGame"] = DataUtil.ReadNumber(SerializeObject, 8);
				//首出时间
				data["cbTimeHeadOutCard"] = DataUtil.ReadNumber(SerializeObject, 8);

				//历史积分信息
				data["lTurnScore"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["lTurnScore"].push(DataUtil.ReadNumber(SerializeObject, 64));
				}
				//积分信息
				data["lCollectScore"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["lCollectScore"].push(DataUtil.ReadNumber(SerializeObject, 64));
				}

				//桌费
				data["lServiceScore"] = DataUtil.ReadNumber(SerializeObject, 64);

				self.addDataToReceivedArray(data);
				lm.log("欢乐斗地主 -> 等待开始 CMD_S_StatusFree -> [ " + JSON.stringify(data) + "]");
			}
			//明牌状态--已去除
			//else if(gamestatus == LandCrazyExGameStatusHappy.GAME_SCENE_SHOW)
			//{
			//	data["type"] = "CMD_S_StatusShow";
            //
			//	//是否明牌
			//	data["bShowCard"] = [];
			//	for (var i = 0; i < GAME_PLAYER; i++)
			//	{
			//		data["bShowCard"].push(DataUtil.ReadNumber(SerializeObject, 8));
			//	}
			//	//手上扑克
			//	data["cbHandCardData"] = [];
			//	for (var i = 0; i < NORMAL_COUNT; i++)
			//	{
			//		data["cbHandCardData"].push(DataUtil.ReadNumber(SerializeObject, 8));
			//	}
            //
			//	//积分信息
			//	data["lTurnScore"] = [];
			//	for (var i = 0; i < GAME_PLAYER; i++)
			//	{
			//		data["lTurnScore"].push(DataUtil.ReadNumber(SerializeObject, 64));
			//	}
			//	//积分信息
			//	data["lCollectScore"] = [];
			//	for (var i = 0; i < GAME_PLAYER; i++)
			//	{
			//		data["lCollectScore"].push(DataUtil.ReadNumber(SerializeObject, 64));
			//	}
			//	//桌费
			//	data["lServiceScore"] = DataUtil.ReadNumber(SerializeObject, 64);
			//	//单元积分
			//	data["lCellScore"] = DataUtil.ReadNumber(SerializeObject, 32);
            //
			//	self.addDataToReceivedArray(data);
			//	lm.log("欢乐斗地主 -> 明牌状态 CMD_S_StatusShow -> [ " + JSON.stringify(data) + "]");
            //
			//}

			//叫分状态
			else if(gamestatus == LandCrazyExGameStatusHappy.GAME_SCENE_LAND)
			{
				data["type"] = "CMD_S_StatusLand";

				//出牌时间
				data["cbTimeOutCard"] = DataUtil.ReadNumber(SerializeObject, 8);
				//叫分时间
				data["cbTimeCallScore"] = DataUtil.ReadNumber(SerializeObject, 8);
				//开始时间
				data["cbTimeStartGame"] = DataUtil.ReadNumber(SerializeObject, 8);
				//首出时间
				data["cbTimeHeadOutCard"] = DataUtil.ReadNumber(SerializeObject, 8);
				//当前的时间计数
				data["cbTimeTickCount"] = DataUtil.ReadNumber(SerializeObject, 8);

				//是否明牌
				data["bShowCard"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["bShowCard"].push(DataUtil.ReadNumber(SerializeObject, 8));
				}
				//玩家托管
				data["bUserTrustee"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["bUserTrustee"].push(DataUtil.ReadNumber(SerializeObject, 8));
				}
				//单元积分
				data["lCellScore"] = DataUtil.ReadNumber(SerializeObject, 32);
				//当前玩家
				data["wCurrentUser"] = DataUtil.ReadNumber (SerializeObject, 16);
				//叫牌操作
				data["cbLandOperate"] = DataUtil.ReadNumber(SerializeObject, 8);
				//手上扑克
				data.cbHandCardData = [];
				for ( var i = 0; i < GAME_PLAYER; i++ )
				{
					data.cbHandCardData[i] = [];
					for ( var j = 0; j < MAX_COUNT; j++ )
					{
						data.cbHandCardData[i].push(DataUtil.ReadNumber(SerializeObject, 8));
					}
				}

				//当前加倍倍数
				data["wAddTimes"] = DataUtil.ReadNumber (SerializeObject, 16);
				//积分信息
				data["lTurnScore"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["lTurnScore"].push(DataUtil.ReadNumber(SerializeObject, 64));
				}
				//积分信息
				data["lCollectScore"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["lCollectScore"].push(DataUtil.ReadNumber(SerializeObject, 64));
				}
				//桌费
				data["lServiceScore"] = DataUtil.ReadNumber(SerializeObject, 64);

				self.addDataToReceivedArray(data);
				lm.log("欢乐斗地主 -> 叫分状态 CMD_S_StatusLand -> [ " + JSON.stringify(data) + "]");
			}
			//游戏状态
			else if(gamestatus == LandCrazyExGameStatusHappy.GAME_SCENE_PLAY)
			{
				data["type"] = "CMD_S_StatusPlay";

				//出牌时间
				data["cbTimeOutCard"] = DataUtil.ReadNumber(SerializeObject, 8);
				//叫分时间
				data["cbTimeCallScore"] = DataUtil.ReadNumber(SerializeObject, 8);
				//开始时间
				data["cbTimeStartGame"] = DataUtil.ReadNumber(SerializeObject, 8);
				//首出时间
				data["cbTimeHeadOutCard"] = DataUtil.ReadNumber(SerializeObject, 8);

				//是否明牌
				data["bShowCard"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["bShowCard"].push(DataUtil.ReadNumber(SerializeObject, 8));
				}
				//玩家托管
				data["bUserTrustee"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["bUserTrustee"].push(DataUtil.ReadNumber(SerializeObject, 8));
				}
				//单元积分
				data["lCellScore"] = DataUtil.ReadNumber(SerializeObject, 32);
				//炸弹次数
				data["cbBombCount"] = DataUtil.ReadNumber (SerializeObject, 8);
				//庄家用户
				data["wBankerUser"] = DataUtil.ReadNumber (SerializeObject, 16);
				//当前玩家
				data["wCurrentUser"] = DataUtil.ReadNumber (SerializeObject, 16);
				//加倍倍数
				data["wTotalAddTimes"] = DataUtil.ReadNumber (SerializeObject, 16);

				//胜利玩家
				data["wTurnWiner"] = DataUtil.ReadNumber (SerializeObject, 16);
				//出牌数目
				data["cbTurnCardCount"] = DataUtil.ReadNumber (SerializeObject, 8);
				//出牌数据
				data["cbTurnCardData"] = [];
				for (var i = 0; i < MAX_COUNT; i++) {
					data["cbTurnCardData"].push (DataUtil.ReadNumber (SerializeObject, 8));
				}

				//游戏底牌
				data["cbBankerCard"] = [];
				for (var i = 0; i < GAME_PLAYER; i++) {
					data["cbBankerCard"].push (DataUtil.ReadNumber (SerializeObject, 8));
				}
				//手上扑克
				data["cbHandCardData"] = [];
				for (var i = 0; i < GAME_PLAYER; i++) {
					data["cbHandCardData"][i] = [];
					for (var j = 0; j < MAX_COUNT; j++) {
						data["cbHandCardData"][i].push (DataUtil.ReadNumber (SerializeObject, 8));
					}
				}
				//扑克数目
				data["cbHandCardCount"] = [];
				for (var i = 0; i < GAME_PLAYER; i++) {
					data["cbHandCardCount"].push (DataUtil.ReadNumber (SerializeObject, 8));
				}

				//积分信息
				data["lTurnScore"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["lTurnScore"].push(DataUtil.ReadNumber(SerializeObject, 64));
				}
				//积分信息
				data["lCollectScore"] = [];
				for (var i = 0; i < GAME_PLAYER; i++)
				{
					data["lCollectScore"].push(DataUtil.ReadNumber(SerializeObject, 64));
				}
				//桌费
				data["lServiceScore"] = DataUtil.ReadNumber(SerializeObject, 64);

				self.addDataToReceivedArray(data);
				lm.log("欢乐斗地主 -> 游戏状态 CMD_S_StatusPlay -> [ " + JSON.stringify(data) + "]");

			}
		},

		//////欢乐场命令///////

		//自己明牌-欢乐
		sendShowCard_happy : function(bShowCard, cbShowCardCount)
		{
			lm.log("欢乐斗地主 自己明牌 SUB_C_SHOW_CARD -> [ " + bShowCard + " " + cbShowCardCount + "]");
			if(bShowCard == 1)
			{
				sparrowDirector.gameData.happyRoomShowCardFlag[sparrowDirector.gameData.myChairIndex] = 1;	//自己明牌 先记录下来
			}
			connectUtil.sendManual(KernelCurrent,LandCrazyExMainID,LandCrazyExGameMsgHappy.SUB_C_SHOW_CARD,
				2,
				"8#" + bShowCard,
				"8#" + cbShowCardCount);
		},

		//自己叫地主
		sendCallBanker_happy : function()
		{
			lm.log("欢乐斗地主 自己叫地主 SUB_C_LAND");
			connectUtil.sendManual(KernelCurrent, LandCrazyExMainID, LandCrazyExGameMsgHappy.SUB_C_LAND, 1, "8#" + 3);
		},
		//自己不叫地主
		sendNoCallBanker_happy : function()
		{
			lm.log("欢乐斗地主 自己不叫地主 SUB_C_LAND");
			connectUtil.sendManual(KernelCurrent, LandCrazyExMainID, LandCrazyExGameMsgHappy.SUB_C_LAND, 1, "8#" + 1);
		},
		//自己抢地主
		sendRodBanker_happy : function()
		{
			lm.log("欢乐斗地主 自己抢地主 SUB_C_LAND");
			connectUtil.sendManual(KernelCurrent, LandCrazyExMainID, LandCrazyExGameMsgHappy.SUB_C_LAND, 1, "8#" + 4);
		},
		//自己不抢地主
		sendNoRodBanker_happy : function()
		{
			lm.log("欢乐斗地主 自己不抢地主 SUB_C_LAND");
			connectUtil.sendManual(KernelCurrent, LandCrazyExMainID, LandCrazyExGameMsgHappy.SUB_C_LAND, 1, "8#" + 2);
		},
		//自己放弃出牌
		sendPassCard_happy : function(data)
		{
			lm.log("欢乐斗地主 自己放弃出牌 SUB_C_PASS_CARD");
			connectUtil.sendManual(KernelCurrent, LandCrazyExMainID,LandCrazyExGameMsgHappy.SUB_C_PASS_CARD, 1, "8#" + 0);
		},
		//自己托管
		sendTrustee_happy : function(data)
		{
			lm.log("欢乐斗地主 自己托管 SUB_C_TRUSTEE");
			connectUtil.sendManual(KernelCurrent, LandCrazyExMainID,LandCrazyExGameMsgHappy.SUB_C_TRUSTEE, 1, "8#" + data);
		},
		//自己发牌完成
		sendCardFinish_happy : function()
		{
			lm.log("欢乐斗地主 自己发牌完成 SUB_C_SEND_CARD_FINISH");
			connectUtil.sendManual(KernelCurrent, LandCrazyExMainID,LandCrazyExGameMsgHappy.SUB_C_SEND_CARD_FINISH, 1, "8#" + 1);
		},

		/*
		 自己出牌命令
		 data.length = length;
		 data.pData  = temp;
		 */
		sendOutCard_happy : function(data)
		{
			lm.log("欢乐斗地主 自己出牌 SUB_C_OUT_CARD");
			CreateNewPacket(21-data.pData.length+data.length);
			AddDataToNewPacket(0, 8, data.length);
			for ( var i = 0; i < data.pData.length; i++ )
			{
				AddDataToNewPacket(0, 8, data.pData[i]);
			}
			SendNewPacket(KernelCurrent,LandCrazyExMainID,LandCrazyExGameMsgHappy.SUB_C_OUT_CARD);
		},

		//////欢乐场命令///////


		//自己叫分命令
		sendCallScore : function(lScore)
		{
			cc.log("-------------------------------------------自己叫分= "+lScore);
			connectUtil.sendManual(KernelCurrent,LandCrazyExMainID,LandCrazyExGameMsg.SUB_C_CALL_SCORE, 1, "8#" + lScore);
		},
		/*
		 自己出牌命令
		 data.length = length;
		 data.pData  = temp;
		 */
		sendOutCard : function(data)
		{
			CreateNewPacket(21-data.pData.length+data.length);
			AddDataToNewPacket(0, 8, data.length);
			for ( var i = 0; i < data.pData.length; i++ )
			{
				AddDataToNewPacket(0, 8, data.pData[i]);
			}
			SendNewPacket(KernelCurrent,LandCrazyExMainID,LandCrazyExGameMsg.SUB_C_OUT_CARD);
		},
		//不出
		sendPassCard : function(data)
		{
			connectUtil.sendManual(KernelCurrent, LandCrazyExMainID,LandCrazyExGameMsg.SUB_C_PASS_CARD, 1, "8#" + 0);
		},
		//不出
		sendPassCardLaizi : function(data)
		{
			connectUtil.sendManual(KernelCurrent, LandCrazyExMainID,LandCrazyExGameMsgLz.SUB_C_PASS_CARD, 1, "8#" + 0);
		},
		//托管（0取消，1托管）
		sendTuoGuanOrder :function(data)
		{
			lm.log("-sendTuoGuanOrder------------------------------------------------------玩家托管  "+JSON.stringify(data));
			connectUtil.sendManual(KernelCurrent, LandCrazyExMainID,LandCrazyExGameMsg.SUB_C_TRUSTEE, 1, "8#" + data);
		},
		//自己叫地主
		sendCallBanker : function(data)
		{
			connectUtil.sendManual(KernelCurrent, LandCrazyExMainID, LandCrazyExGameMsgLz.SUB_C_CALL_BANKER, 1, "8#" + data);
		},
		//自己强地主
		sendRodBanker : function(data)
		{
			connectUtil.sendManual(KernelCurrent, LandCrazyExMainID, LandCrazyExGameMsgLz.SUB_C_ROD_BANKER, 1, "8#" + data);
		},
		//自己加倍
		sendDouble : function(data)
		{
			connectUtil.sendManual(KernelCurrent, LandCrazyExMainID, LandCrazyExGameMsgLz.SUB_C_DOUBLE, 1, "8#" + data);
		},
		/*
		 自己出牌（癞子）
		 data.length = length;
		 data.pData  = temp;
		 data.pLData = pLData;
		 */
		sendOutCardLaiZi : function(data)
		{
			CreateNewPacket(41);
			AddDataToNewPacket(0, 8, data.length);
			for ( var i = 0; i < data.pData.length; i++ )
			{
				AddDataToNewPacket(0, 8, data.pData[i]);
			}
			for ( var i = 0; i < data.pLData.length; i++ )
			{
				AddDataToNewPacket(0, 8, data.pLData[i]);
			}
			SendNewPacket(KernelCurrent,LandCrazyExMainID,LandCrazyExGameMsgLz.SUB_C_OUT_CARD);
		},
		//玩家金币高于房间当前最高上限，塞选跳转到最佳房间游戏 by zfs 20160506
		gotoBestGoldRoomPlay01:function()
		{
			var goldRoomData = roomManager.GetGoldRoomData();//array
			if(Is_HAPPY_ROOM())
			{
				goldRoomData = roomManager.GetHappyRoomData();//array
			}
			else if(Is_LAIZI_ROOM())
			{
				goldRoomData = roomManager.GetLaiziRoomData();//array
			}
			var playerGold = userInfo.globalUserdData["lUserScore"];
			//金币房间底限 倒序排列
			goldRoomData.sort(function(a, b){return b.accessgold- a.accessgold;});
			//金币房间上限值
			for ( var i = 0; i < goldRoomData.length; i++ )
			{
				var gold = goldRoomData[i];
				var str = gold.slogans;
				//var regexp = /\d+万/g;
				//var topGold = str.match(regexp).toString();
				//var topGoldNum = Number(topGold.substring(0, topGold.length-1));


				//获取房间的在线人数 准入金额的上下限。
				var roomViewData = GameServerKind.GetRoomViewData(gold);



				lm.log("roomViewData============================1 "+JSON.stringify(roomViewData));
				lm.log("roomViewData============================1 "+JSON.stringify(roomViewData.lMinTabScore));
				lm.log("roomViewData============================1 "+JSON.stringify(roomViewData.lMaxTableScore));



				goldRoomData[i].topGoldNum = roomViewData.lMaxTableScore;
				goldRoomData[i].besGoldNum = roomViewData.lMinTabScore;

				//判断是否没有上限标志
				var regexp02 = /以上/;
				var isNotTop = str.match(regexp02);
				goldRoomData[i].isNotTop = isNotTop;
			}
			//获得当前最佳推荐房间数据
			var targetData = function()
			{
				for ( var i = 0; i < goldRoomData.length; i++ )
				{
					var gold = goldRoomData[i];
					if ( gold.topGoldNum != 0 )
					{
						if ( (playerGold >= gold.besGoldNum && playerGold <= gold.topGoldNum) || (playerGold >= gold.besGoldNum && gold.isNotTop))
						{
							return gold;
						}
					}
					else
					{
						if (playerGold >= gold.besGoldNum)
						{
							return gold;
						}
					}

				}
				if ( sparrowDirector.isPlayingGame )
				{
					return false;

				}
				else
				{
					return goldRoomData[0];
				}
			}();
			if ( !targetData )
			{
				lm.log("晋升高级场,去低级场 error");
				var pop = new ConfirmPop(this, Poptype.ok, "哎呀，你的金币不足，不能玩牌哦，去搞点金币吧！");//ok
				pop.addToNode(cc.director.getRunningScene());
				pop.setokCallback(
					function(){
						sparrowDirector.gameLayer.deskLayer.qiutGame01();
					}
				);
				return;
			}
			lm.log("获得当前最佳推荐房间数据"+JSON.stringify(targetData));
			// 查找可进入的房间
			GameServerKind.GetNearServer(userInfo.globalUserdData["lUserScore"], targetData, [],
				function(curserver)
				{
					//SortID 1234 新初中高
					sparrowDirector.gameData.currentRommLevel = targetData["SortID"];
					lm.log("晋升高级场,去低级场 进入房间 = "+sparrowDirector.gameData.currentRommLevel);

					sparrowDirector.tempRoomServerId = curserver["wServerID"];//当前房间ID

					sparrowDirector.LogonRoom(curserver["wServerPort"],
						userInfo.globalUserdData["dwUserID"],
						userInfo.GetCurPlayerPassword(),
						GetFuuID());

					layerManager.PopTipLayer(new WaitUILayer("正在入桌，请稍后....", function()
					{
						layerManager.PopTipLayer(new PopAutoTipsUILayer("连接服务器超时，请稍后重试！", DefultPopTipsTime),false);

					},this));

				},function(errinfo,bless)
				{
					// 查找失败，如果是因为金币不足，给出引导购买金币。
					if(bless)
					{
						var pop = new ConfirmPop(this, Poptype.ok, errinfo);//ok
						pop.addToNode(cc.director.getRunningScene());
						pop.setokCallback(
							function(){
								self.OnMallClicked();
							}
						);
					}else
					{
						var pop = new ConfirmPop(this, Poptype.ok, errinfo);//ok
						pop.addToNode(cc.director.getRunningScene());
					}

				},this);
		},
		ClearAllData:function()
		{

		}
	});
var sparrowDirector = sparrowDirector || new SparrowDirector();





