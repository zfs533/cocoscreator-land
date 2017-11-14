/*
 * created By zhoufangsheng 20151104
 */

var winSize = cc.director.getVisibleSize();
if (winSize.width / winSize.height <= 960 / 640) {
	winSize = cc.size(960, 640);
}

var Control_pos =
{
	left:cc.p(220, winSize.height - 200),
	center:cc.p(winSize.width/2, 50),
	right : cc.p(winSize.width-220, winSize.height - 200)
}

//主层
var MainGameLayer = cc.Layer.extend(
	{
		ctor: function ()
		{
			this._super();
			this.setVariable();
			this.zinit();
		},
		setVariable:function()
		{
		},
		zinit:function()
		{
			this.setContentSize(winSize);
			//桌子层
			this.deskLayer = new DeskLayer();
			this.addChild(this.deskLayer, 0);
			//头像层
			this.playerLayer = cc.Layer.create();
			this.addChild(this.playerLayer, 5);

			//扑克层
			this.pukerLayer = new PukerLayer(this);
			this.addChild(this.pukerLayer, 10);

			//底部层
			this.bottomLayer = new BottomLayer();
			this.addChild(this.bottomLayer, 20);
			//命令层
			this.orderLayer = new OrderLayer();
			this.addChild(this.orderLayer, 30);
			//癞子命令层
			this.orderLaiziLayer = new OrderLaiziLayer();
			this.addChild(this.orderLaiziLayer, 35);
			//欢乐场命令层
			this.orderLayer_happy = new OrderLayerHappy();
			this.addChild(this.orderLayer_happy, 38);
			//倒计时层
			this.countDownLayer = new CountDownLayer();
			this.addChild(this.countDownLayer, 40);
			//记分层
			this.scoreLayer = new ScoreLayer();
			this.addChild(this.scoreLayer, 50);
			//动画层
			this.landAnimate = new LandAnimate();
			this.addChild(this.landAnimate, 60);
			//触摸层
			this.touchLayer = new TouchLayer();
			this.addChild(this.touchLayer, 70);
			//机器人层
			this.androidLayer = new AndroidLayer();
			this.addChild(this.androidLayer, 80);
			this.androidLayer.visible = false;
			//结算层
			this.resultLayer = new ResultLayer();
			this.addChild(this.resultLayer, 90);
			this.resultLayer.visible = true;
			//选择牌型层
			this.sePukerLayer = cc.Layer.create();
			this.addChild(this.sePukerLayer, 100);
			//玩家信息显示层
			this.playerInfoLayer = cc.Layer.create()
			this.addChild(this.playerInfoLayer, 110);
			//拖动出牌层
			this.dragPukerLayer = cc.Layer.create();
			this.addChild(this.dragPukerLayer, 130);

			this.handleShowBox();
			this.showItemBox();

			return;

			var self = this;
			this.scheduleOnce(function()
			{
				//self.deskLayer.refreshCurrentBeishu();
				//self.resultLayer.showResultAnimation(100);
				//self.scoreLayer.showCallScore();
			}, 2);
		},
		//宝箱显示
		handleShowBox:function()
		{
			//if ( Is_LAIZI_ROOM() )
			//{
			//	//癞子斗地主没有开宝箱；
			//	return;
			//}
			////宝箱显示
			//if (sparrowDirector.boxCount && KernelCurrent != KernelMatch)
			//{
			//	if (!this.itemBox)
			//	{
			//		this.itemBox = ccui.Button.create("btn_itemBox.png", "btn_itemBox.png", "btn_itemBox.png", 1);
			//		this.itemBox.setPosition(winSize.width - 80, winSize.height/2+50);
			//		this.addChild(this.itemBox, 1000);
			//		this.itemBox.addTouchEventListener(function (sender, type)
			//		{
			//			if (type == ccui.Widget.TOUCH_ENDED)
			//			{
			//				if (!sender.notifyText) {
			//					sender.notifyText = ccui.Text.create("坐庄地主且以三炸的情况赢牌即可开启福利宝箱，\n您当前剩余" + sparrowDirector.boxCount + "次抽奖机会！", "", 24);
			//					sender.notifyText.setAnchorPoint(0, 1);
			//					sender.notifyText.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
			//					sender.addChild(sender.notifyText, 2);
			//					sender.notifyText.setPosition(-winSize.width/2 - 200 + 100, -20+50);
            //
			//					sender.notifyBg = cc.Scale9Sprite("20_table_listenboxbg.png", cc.rect(12, 12, 1, 1));
			//					sender.notifyBg.setAnchorPoint(0, 1);
			//					sender.notifyBg.setPosition(-winSize.width/2 - 200 +80, -10+50);
			//					var bgSize = cc.size(50 + sender.notifyText.getContentSize().width, 30 + sender.notifyText.getContentSize().height);
			//					sender.notifyBg.setContentSize(bgSize);
			//					sender.addChild(sender.notifyBg, 1);
            //
			//					sender.notifyText.runAction(cc.sequence(cc.delayTime(3), cc.callFunc(function () {
			//						sender.notifyText.removeFromParent();
			//						sender.notifyBg.removeFromParent();
			//						sender.notifyText = null;
			//					}, this)))
			//				}
			//			}
			//		}, this)
			//	}
			//}
		},
		showItemBox : function()
		{
			if ( Is_LAIZI_ROOM() )
			{
				return;
			}
			if ( this.deskLayer)
			{
				if(RandomTaskAttending.id > 0)
				{
					this.deskLayer.taskTxt.setString(RandomTaskDescribe[RandomTaskAttending.id]["explain"]);
				}
			}
			if(RandomTaskAttending.cur >= RandomTaskAttending.total) //满足开宝箱条件
			{
				sparrowDirector.SendOpenBox();
				if ( this.back)
				{
					this.back.removeFromParent();
				}
				RandomTaskAttending.cur = 0;
				RandomTaskAttending.total = 99;
			}
		},
		/*
		 {"type":"tagMobileUserInfoHead","dwGameID":138490,"dwUserID":32450,"wFaceID":37,"dwCustomID":0,
		 "cbGender":0,"cbMemberOrder":0,"wTableID":8,"wChairID":2,"cbUserStatus":2,
		 "lScore":990000000,"dwWinCount":0,"dwlostCount":0,"dwDrawCount":0,"dwFleeCount":0,
		 "dwExperience":0,"szNickName":"o61193"}
		 */
		autoSetPlayerPos:function()
		{
			if ( sparrowDirector.gameData.myChairIndex < 0  ){return;}
			var a = 0, b = 0, c = 0;
			switch (sparrowDirector.gameData.myChairIndex)
			{
				case 0:
					a = 0; b = 2; c = 1;
					break;

				case 1:
					a = 1; b = 0; c = 2;
					break;

				case 2:
					a = 2; b = 1; c = 0;
					break;

				default :
					return;
			}
			this.scrollChangePlayerPos(a, b, c);
		},
		scrollChangePlayerPos:function(a, b, c)
		{
			var temp = this.handlePlayerInfo();
			if (!sparrowDirector.isPlayingGame){return;}
			var data01 = this.getPlayerInfoByChairID(a, temp);
			if (data01)
			{
				var mm = this.playerLayer.getChildByTag(100);
				if ( mm && mm.data.dwUserID == data01.dwUserID )
				{
					mm.refreshPlayerInfo(data01);
					//mm.nameBg02.visible = true;
					//mm.nameBg01.visible = false;
				}
				else
				{
					if ( mm ){mm.removeFromParent();}
					var head = new PlayerHead(0, data01);
					//head.nameBg02.visible = true;
					//head.nameBg01.visible = false;
					head.setPosition(0-5, 240);
					this.playerLayer.addChild(head, 0, 100);
				}
			}
			var data02 = this.getPlayerInfoByChairID(b, temp);
			if (data02)
			{
				var mm = this.playerLayer.getChildByTag(200);
				if ( mm && mm.data.dwUserID == data02.dwUserID )
				{
					mm.refreshPlayerInfo(data02);
				}
				else
				{
					if ( mm ){mm.removeFromParent();}
					var head = new PlayerHead(1, data02);
					head.setPosition(0-5, 442);
					this.playerLayer.addChild(head, 0, 200);
				}
			}
			var data03 = this.getPlayerInfoByChairID(c, temp);
			if (data03)
			{
				var mm = this.playerLayer.getChildByTag(300);
				if ( mm && mm.data.dwUserID == data03.dwUserID )
				{
					mm.refreshPlayerInfo(data03);
				}
				else
				{
					if ( mm ){mm.removeFromParent();}
					var head = new PlayerHead(2, data03);
					head.setPosition(winSize.width-head.width+50, 442);
					this.playerLayer.addChild(head, 0, 300);
				}
			}
			var childCount = this.playerLayer.getChildren().length;
			if ( childCount >=3 ){return;}
			//确保三个玩家上桌
			var self = this;
			this.scheduleOnce(function()
			{
				self.autoSetPlayerPos();
			}, 0.2);
			lm.log("------------------------------childcount== "+childCount);
		},
		getPlayerInfoByChairID:function(wChairID, playerInfo)
		{
			for ( var i = 0; i < playerInfo.length; i++ )
			{
				if ( playerInfo[i].wChairID == wChairID )
				{
					return playerInfo[i];
				}
			}
			return false;
		},
		handlePlayerInfo:function()
		{
			var temp = DataUtil.copyJson(sparrowDirector.gameData.playerInfo),currentTable = [];
			for ( var i = 0; i < temp.length; i++ )
			{
				if ( temp[i].wTableID == sparrowDirector.gameData.tableIndex && temp[i].wChairID > -1 )
				{
					currentTable.push(temp[i]);
				}
			}
			return currentTable;
		},
		/*
		 用户放弃
		 {"type":"CMD_S_PassCard","cbTureOver":0,"wCurrentUser":1,"wPassCardUser":0}
		 */
		orderPassCard:function(data, index)
		{
			if ( data )
			{
				var direction = sparrowDirector.gameLayer.countDownLayer.getDirection(data.wPassCardUser);
				this.controlPassTagVisible(direction, true);
			}
			else
			{
				this.controlPassTagVisible(index, false);
			}
			//一轮结束,清理牌桌
			if (data && data.cbTureOver>0 )
			{
				sparrowDirector.gameData.isTurnOver = true;
			}
		},
		/*
	 	一轮结束
		 */
		cbTurnOver:function()
		{
			this.controlPassTagVisible(0, false);
			this.controlPassTagVisible(1, false);
			this.controlPassTagVisible(2, false);
			var that = sparrowDirector.gameLayer.pukerLayer;
			for ( var i = 0; i < that.pukerArr04.length; i++ )
			{
				that.pukerArr04[i].removeFromParent();
			}
			that.pukerArr04.splice(0);
			for ( var i = 0; i < that.pukerArr03.length; i++ )
			{
				that.pukerArr03[i].removeFromParent();
			}
			that.pukerArr03.splice(0);
			for ( var i = 0; i < that.pukerArr02.length; i++ )
			{
				that.pukerArr02[i].removeFromParent();
			}
			that.pukerArr02.splice(0);
		},
		controlPassTagVisible:function(direction, bool)
		{
			var child01 = this.playerLayer.getChildByTag(100);
			var child02 = this.playerLayer.getChildByTag(200);
			var child03 = this.playerLayer.getChildByTag(300);
			if ( !child01 || !child02 || !child03 ){return;}
			switch (direction)
			{
				case 0:
				{
					child01.cancel.visible = bool;
					break;
				}
				case 1:
				{
					child03.cancel.visible = bool;
					break;
				}
				case 2:
				{
					child02.cancel.visible = bool;
					break;
				}
				default :
					break;
			}
		},
		updateUserGold:function(gold)
		{
			if ( sparrowDirector.isPlayingGame )
			{
				var child01 = this.playerLayer.getChildByTag(100);
				child01.gold.setString(gold);
				lm.log("购买金币chenggonglalalalla");
			}
		},
		/*
		 玩家角色显示
		 叫分结束，显示庄家信息
		 {"type":"CMD_S_BankerInfo","wBankerUser":0,"wCurrentUser":0,"cbBankerScore":3,"cbBankerCard":[50,61,29]}
		 */
		showRole:function(bool, data)
		{
			var child01 = this.playerLayer.getChildByTag(100);
			var child02 = this.playerLayer.getChildByTag(200);
			var child03 = this.playerLayer.getChildByTag(300);
			var arr = [];
			if ( child01 )
			{
				child01.data.wChairID = sparrowDirector.gameData.myChairIndex;
				arr.push(child01);
			}
			if ( child02 )
			{
				arr.push(child02);
			}
			if ( child03 )
			{
				arr.push(child03);
			}
			if ( bool )
			{
				this.setDizuTag(data.wBankerUser);
				for ( var i = 0; i < arr.length; i++ )
				{
					if ( arr[i].data.wChairID == data.wBankerUser)
					{
						//地主
						arr[i].showRole(true);
					}
					else
					{
						arr[i].showRole(false);
					}
				}
			}
			else
			{
				var child = arr;
				for ( var i = 0;i < child.length; i++ )
				{
					child[i].hideRole();
					child[i].cancel.visible = false;
				}
			}
		},
		hidePlayerTips:function()
		{
			for(var i=1;i<=3;i++)
			{
				var player = sparrowDirector.gameLayer.playerLayer.getChildByTag(100*i);
				if(player)
				{
					player.cancel.visible = false;
				}
			}
		},
		setDizuTag:function(wBankerUser)
		{
			var direction = sparrowDirector.gameLayer.countDownLayer.getDirection(wBankerUser);
			switch (direction)
			{
				case 0:
					sparrowDirector.gameData.isMyDizu = true;
					sparrowDirector.gameData.isLeftDizu = false;
					sparrowDirector.gameData.isRightDizu = false;
					break;
				case 1:
					sparrowDirector.gameData.isRightDizu = true;
					sparrowDirector.gameData.isMyDizu = false;
					sparrowDirector.gameData.isLeftDizu = false;
					break;
				case 2:
					sparrowDirector.gameData.isLeftDizu = true;
					sparrowDirector.gameData.isRightDizu = false;
					sparrowDirector.gameData.isMyDizu = false;
					break;
				default :
					break;
			}
		},
		/**
		 * 游戏结束
		 * @param data
		 * 癞子结束数据 {"type":"CMD_S_GameConclude","lCellScore":10,"lGameScore":[-320,0,160],"bChunTiam":0,"bFanChunTian":0,"cbBombCount":1,"cbEachBombCount":[0,0,1],"cbCardCount":[16,17,15],"cbHandCardData":[33,34,45,44,12,59,42,55,7,53,37,52,20,4,35,3,78,29,13,60,28,43,27,11,58,26,39,54,22,6,5,36,19,9,25,41,57,50,18,2,49,17,1,61,10,23,21,51,0,0,0,0,0,0]}
		 */
		gameOver:function(data)
		{
			sparrowDirector.gameLayer.countDownLayer.hideClock();
			sparrowDirector.gameData.isGaming = false;
			sparrowDirector.gameData.isTurnOver = false;
			sparrowDirector.gameData.isCallScore = false;
			sparrowDirector.gameData.isAutoAi = false;
			sparrowDirector.gameData.isPlayerOut = false;
			sparrowDirector.gameData.isReadied = false;
			sparrowDirector.gameData.isGameOver = true;
			sparrowDirector.gameData.isCallBankerState = false;
			sparrowDirector.gameData.isRodBankerState = false;
			sparrowDirector.gameData.isDoubledState = false;
			sparrowDirector.gameData.isMyDizu = false;
			sparrowDirector.gameData.isLeftDizu = false;
			sparrowDirector.gameData.isRightDizu = false;
			sparrowDirector.gameData.isLaunchPuker = false;
			sparrowDirector.gameData.isLaiziThreeByTwo = false;
			sparrowDirector.gameData.laiziValue = null;
			sparrowDirector.gameData.oTherPuker.splice(0);
			sparrowDirector.gameData.isOuteredPuker = false;
			sparrowDirector.gameData.isPassedPuker = false;
			sparrowDirector.gameLayer.androidLayer.visible = false;
			sparrowDirector.gameLayer.orderLaiziLayer.orderType = 0;

			this.scheduleOnce(function()
			{
				sparrowDirector.gameLayer.pukerLayer.pukerData.splice(0);
				sparrowDirector.gameLayer.pukerLayer.pukerDataLeft.splice(0);
				sparrowDirector.gameLayer.pukerLayer.pukerDataRight.splice(0);
				sparrowDirector.gameLayer.pukerLayer.cleaningShowCard();
				sparrowDirector.gameLayer.countDownLayer.hideClock();
				sparrowDirector.gameLayer.orderLayer.hideView();
				sparrowDirector.gameLayer.orderLaiziLayer.hideView();
				sparrowDirector.gameLayer.orderLayer_happy.hideView();
				sparrowDirector.gameData.happyRoomState = HappyRoomState.none;
				sparrowDirector.gameData.happyRoomShowCardCount = 0;
				sparrowDirector.gameData.happyRoomShowCardFlag = [];

				//sparrowDirector.gameLayer.showRole(false);
				sparrowDirector.gameLayer.hidePlayerTips();
				//sparrowDirector.gameLayer.countDownLayer.startCountDown(-1);
				sparrowDirector.gameLayer.landAnimate.clearning();
			}, 3);
		},
		//用户聊天
		playerChat: function (isFace, charDirection, color, chatContent)
		{
			var oldChat = this.getChildByTag(10000 + charDirection);
			if(oldChat)
				oldChat.removeFromParent();

			var chat = new chatText(isFace, charDirection, color, chatContent);
			chat.setTag(10000 + charDirection);
			this.addChild(chat, 10000);
		},
		//游戏开始，隐藏结算金币显示
		hideResultGold:function()
		{
			var player01 = sparrowDirector.gameLayer.playerLayer.getChildByTag(100);
			var player02 = sparrowDirector.gameLayer.playerLayer.getChildByTag(200);
			var player03 = sparrowDirector.gameLayer.playerLayer.getChildByTag(300);
			if ( player01 )
			{
				player01.hideResultGold();
			}
			if ( player02 )
			{
				player02.hideResultGold();
			}
			if ( player03 )
			{
				player03.hideResultGold();
			}
			//隐藏结算界面UI
			sparrowDirector.gameLayer.resultLayer.hideUI();
		}
	});


//主场景
var MainGameScene = rootScene.extend({
	ctor: function ()
	{
		this._super();
		this.mainGameLayer = new MainGameLayer();
		this.addChild(this.mainGameLayer);
	},
	onEnter: function () {
		this._super();
		sparrowDirector.isPlayingGame = true;
		LandCEMusic.playBgMusic();

		addDeskResource();
	},
	onEnterTransitionDidFinish:function()
	{
		this._super();
	},
	onExitTransitionDidStart:function()
	{
		this._super();
	},
	onExit: function ()
	{
		this._super();
		sparrowDirector.tempRoomServerId = 0;
		sparrowDirector.currentRoomServerId = 0;
		RandomTaskAttending.id = 0;
		LandCEMusic.stopBgMusic();
		sparrowDirector.isPlayingGame = false;
		sparrowDirector.gameData.playerInfo.splice(0);
		sparrowDirector.gameLayer.pukerLayer.resetData();
		sparrowDirector.gameLayer.gameOver();
		cc.log("============================= 退出场景");
		removeDeskResource();
		if ( !sparrowDirector._sortRoomFlag )
		{
			//sparrowDirector.SendUserAskStandup();//退出游戏场景，回到大厅；
		}
		if(sparrowDirector._sortRoomFlag) //hanhu 退出主场景重置排队标签 2015/12/14
		{
			sparrowDirector._sortRoomFlag = false;
		}

	}
})



















