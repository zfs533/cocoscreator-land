/*
 * created By zhoufangsheng 20151104
 */
//TODO
//桌子层 
var DeskLayer = cc.Layer.extend(
	{
		ctor:function()
		{
			this._super();
			this.setVariable();//变量设置
			this.zinit();//层初始化
			this.addUI();//加载ui
			this.initInformation();
		},
		onEnter:function(){
			this._super();
			this._touchListener = cc.EventListener.create({
				event: cc.EventListener.TOUCH_ONE_BY_ONE,
				swallowTouches: false,
				onTouchBegan:function(touch, event){
					sparrowDirector.gameData01.tuoGuanArr.splice(0);
					//if ( this.setBg && this.setBg.visible)
					//{
					//	this.setBg.visible = false;
					//}
					//点击任意位置让玩家扑克复位
					var isOut = false;
					this.pukerArr01 = sparrowDirector.gameLayer.pukerLayer.pukerArr01;
					for ( var i = 0; i < this.pukerArr01.length; i++ )
					{
						if ( !this.pukerArr01[i].posNomal )
						{
							isOut = true;
							break;
						}
					}
					if ( isOut )
					{
						sparrowDirector.gameLayer.pukerLayer.reLayoutPuker();
						sparrowDirector.gameLayer.orderLayer.setOutPukerBtnEnable();
					}
					return true;
				}.bind(this)
			});
			cc.eventManager.addListener(this._touchListener, this);
		},
		setVariable:function()
		{
			this.count01 = 0;
			this.count02 = 0;
			this.count03 = 0;
			this.countNumber = 90;
		},
		//初始化
		zinit:function()
		{
			this.setContentSize(winSize);
			this.ui = ccs.load("res/landlord/cocosOut/DeskLayer.json").node;
			var offset = (this.ui.getContentSize().width * winSize.height / 640 - winSize.width) / 2;
			this.ui.x -= offset;
			this.addChild(this.ui, 0);
		},
		addUI:function()
		{
			//桌号
			this.deskNumber = ccui.helper.seekWidgetByName(this.ui, "deskNumber");
			/**********************************顶部栏********************************/
			this.addTopUI();
			/**********************************底分********************************/
			//底分
			this.baseScore = ccui.helper.seekWidgetByName(this.ui, "baseScore");
			this.baseScore.setString("");
			this.taskBg = ccui.helper.seekWidgetByName(this.ui, "taskBg");
			this.showRandomTask(false);
			//随机任务描述信息
			this.taskTxt = ccui.helper.seekWidgetByName(this.ui, "taskTxt");
			this.taskTxt.setString("");
			//叫分
			this.calledscore = ccui.helper.seekWidgetByName(this.ui, "calledscore");
			this.calledscore.setString("");
			//倒计时时钟
			this.clickImg = ccui.helper.seekWidgetByName(this.ui, "clickImg");
			this.countDownTxt = ccui.helper.seekWidgetByName(this.ui, "countDownTxt");
			this.clickImg.visible = false;

		},
		//游戏结束倒计时显示
		showGameOverCountDown:function(isVisible)
		{
			if ( isVisible )
			{
				this.clickImg.visible = true;
				this.schedule(this.startCountD, 1);
			}
			else
			{
				this.unschedule(this.startCountD);
				this.countNumber = 90;
				this.clickImg.visible = false;
			}
		},
		startCountD:function()
		{
			this.countDownTxt.setString(this.countNumber);
			if ( this.countNumber <= 0 )
			{
				this.unschedule(this.startCountD);
				this.countNumber = 90;
				LandCEMusic.playBtnEffect();
				sparrowDirector.SendUserAskStandup();
				sparrowDirector.gameLayer.deskLayer.showGameOverCountDown(false);
				return;
			}
			this.countNumber--;
		},
		//顶部栏
		addTopUI:function()
		{
			this.topInfo = ccui.helper.seekWidgetByName(this.ui, "topInfo");
			this.topInfo.savePos = this.topInfo.getPosition();
			//退出按钮
			this.settingBtn = ccui.helper.seekWidgetByName(this.ui, "quit_btn");
			this.settingBtn.addTouchEventListener(this.settingBtnEvent, this);
			this.settingBtn.tag = 1;	//0 无响应 1 弹出 2 收起
			//退出按钮
			this.quit_btn = ccui.helper.seekWidgetByName(this.ui, "exitBtn");
			this.quit_btn.addTouchEventListener(this.qiutGame, this);
			//托管按钮
			this.ai_btn = ccui.helper.seekWidgetByName(this.ui, "ai_btn");
			this.ai_btn.addTouchEventListener(this.aiEvent, this);
			//聊天按钮
			this.chat_btn = ccui.helper.seekWidgetByName(this.ui, "chat_btn");
			this.chat_btn.addTouchEventListener(this.chatEvent, this);
			//音效
			this.setBg = ccui.helper.seekWidgetByName(this.ui, "setBg");
			this.setBg.visible = true;
			this.setBg.savePos = this.setBg.getPosition();
			this.setBg.setPositionY(this.setBg.getPosition().y + 100);

			this.chat_btn = ccui.helper.seekWidgetByName(this.ui, "musicBtn");
			this.chat_btn.addTouchEventListener(this.musicBtnEvent, this);
			//当前时间
			this.currentTime = ccui.helper.seekWidgetByName(this.ui, "currentTime");
			//当前电量
			this.battery_loading = ccui.helper.seekWidgetByName(this.ui, "battery_loading");
			this.dianBg = ccui.helper.seekWidgetByName(this.ui, "dianBg");
			this.dianBg.visible = false;
			this.layer_dian = ccui.helper.seekWidgetByName(this.ui, "layer_dian");
			this.layer_dian.addTouchEventListener(this.dianBgEvent, this);
			//四张底牌
			for(var i = 0; i < 4; i++ )
			{
				this["card" + i] = ccui.helper.seekWidgetByName(this.ui, "card" + i);
				//this["card" + i].addTouchEventListener(this.dianBgEvent, this);
			}
			if ( !Is_LAIZI_ROOM() )
			{
				this.card3.visible = false;
				this.card0.x += 20 - 3;
				this.card1.x += 20;
				this.card2.x += 20 + 3;
			}
		},
		//显示电量和时间
		dianBgEvent:function(target, state)
		{
			if ( state == ccui.Widget.TOUCH_ENDED )
			{
				if ( !this.topInfo.getChildByTag(100) )
				{
					if ( this.card1.visible )
					{
						for(var i = 0; i < 3; i++ )
						{
							this["card" + i].visible = false;
						}
						this.dianBg.visible = true;
					}
					else
					{
						for(var i = 0; i < 3; i++ )
						{
							this["card" + i].visible = true;
						}
						this.dianBg.visible = false;
					}
				}
				else
				{
					if ( this.dianBg.visible )
					{
						for ( var i = 100; i < 120; i++ )
						{
							var obj = this.topInfo.getChildByTag(i);
							if ( obj )
							{
								obj.visible = true;
							}
						}
						this.dianBg.visible = false;
					}
					else
					{
						for ( var i = 100; i < 120; i++ )
						{
							var obj = this.topInfo.getChildByTag(i);
							if ( obj )
							{
								obj.visible = false;
							}
						}
						this.dianBg.visible = true;
					}
				}
			}
		},
		musicBtnEvent:function(target, state)
		{
			if ( state == ccui.Widget.TOUCH_ENDED )
			{
				if(this.settingBtn.tag != 2)
					return;
				this.aniSettingBtn(2);

				showVolumeSetting();
			}
		},
		//显示或者隐藏随机任务
		showRandomTask:function(bool)
		{
			this.taskBg.visible = bool;
			if(Is_LAIZI_ROOM())
				this.taskBg.visible = false;
		},
		hideTxtTipImage:function()
		{
			sparrowDirector.gameData.isCanOutPuker = true;
			sparrowDirector.gameLayer.pukerLayer.maskLayer.visible = false;
		},
		showTxtTipImage:function()
		{
			sparrowDirector.gameData.isCanOutPuker = false;
			var fadeOut = cc.fadeOut(0.5);
			var delta	= cc.delayTime(2);
			var fadeIn  = cc.fadeIn(0.5);
			var sequnce = cc.sequence(fadeIn, delta);
			sparrowDirector.gameLayer.pukerLayer.maskLayer.visible = true;
			sparrowDirector.gameLayer.pukerLayer.tipTxt.setOpacity(0);
			sparrowDirector.gameLayer.pukerLayer.tipTxt.runAction(sequnce);
			sparrowDirector.gameLayer.countDownLayer.startCountDown(sparrowDirector.gameData.myChairIndex, 5);
		},
		/**
		 * 设置时间
		 * @method SetProcessValue
		 * @param {string} arg0
		 */
		SetCurTime: function (time)
		{
			if ( !sparrowDirector.isPlayingGame ){return;}
			try{
				this.currentTime.setString(time);
			}
			catch (e)
			{
				cc.log("设置时间错误啦啦啦  " + e.name+"  "+ e.message);
			}
		},
		/**
		 * 设置电量
		 * @method SetCurElectricity
		 * @param {number} arg0
		 */
		SetCurElectricity: function (percent)
		{
			if ( !sparrowDirector.isPlayingGame ){return;}
			if ( percent < 0 || percent > 100 )
			{
				this.battery_loading.setPercent(0);
				return;
			}
			try{
				this.battery_loading.setPercent(percent);
			}
			catch (e)
			{
				cc.log("设置电量出错啦啦啦  "+ e.name+"  "+ e.message);
			}
		},
		chatEvent:function(target, state)
		{
			if ( state == ccui.Widget.TOUCH_ENDED )
			{
				LandCEMusic.playBtnEffect();
				sparrowDirector.gameLayer.addChild(new popUpTalkDialog(), 99999);
			}
		},
		initInformation:function()
		{
			this.calledscore.setString("");
			//this.baseScore.setString("");
		},
		//设置地主牌
		setDizuPuker:function(data)
		{
			var len = data.cbBankerCard.length;
			if ( Is_LAIZI_ROOM() )
			{
				len += 1;
			}
			for ( var i = 0; i < len; i++ )
			{
				var card = new GameCard();
				if ( i == 3 && len > 3 )
				{
					card.createPuker(data["cbLaiziCard"] ? data["cbLaiziCard"] : data.cbLaiZiCard, false, true);
					card.showLaizi();
				}
				else
				{
					card.createPuker(data.cbBankerCard[i], false, true);
					if ( Is_LAIZI_ROOM() )
					{
						if ( card.sortNumber01 == sparrowDirector.gameData.laiziValue.value )
						{
							card.showLaizi();
						}
					}
				}
				this.topInfo.addChild(card, 0, 100 + i);
				card.setPosition(this["card"+i].getPosition().x - 70 , this["card"+i].getPosition().y-100);
				card.pukerColor.setTouchEnabled(false);
				this["card" + i].visible = false;
				//card.pukerColor.setTouchEnabled(true);
				//card.pukerColor.addTouchEventListener(this.dianBgEvent, this);
			}
		},
		removeDizuPuker:function()
		{
			for ( var i = 100; i < 120; i++ )
			{
				var obj = this.topInfo.getChildByTag(i);
				if ( obj )
				{
					obj.removeFromParent();
				}
			}
			var len = 3;
			if ( Is_LAIZI_ROOM() )
			{
				len += 1;
			}
			for ( var i = 0; i < len; i++ )
			{
				this["card" + i].visible = true;
			}
		},
		//设置庄家叫分信息
		setBankerScore:function(data)
		{
			this.calledscore.setString(data.cbBankerScore);
			if ( data.lCellScore )
			{
				this.setBaseScore(data.lCellScore);
			}
			sparrowDirector.gameData.currentCallScore = data.cbBankerScore;
			sparrowDirector.gameData.currentCallScore01 = data.cbBankerScore;
		},
		refreshCurrentBeishu:function(times)
		{
			lm.log("refreshCurrentBeishu " + times);

			var self = this;
			if ( !self.calledscore ){return;}

			if(times == undefined)
				times = 2;

			var beishu = ccui.TextBMFont.create();
			beishu.setFntFile("res/landlord/cocosOut/fnt/jia-export.fnt");
			beishu.setPosition(winSize.width/2, winSize.height/2+50);
			beishu.setString("x" + times);
			sparrowDirector.gameLayer.playerInfoLayer.addChild(beishu, 100);

			beishu.scale = 0;
			var time01   = 0.2;
			var time02   = 0.5;
			var time03   = 0.4;
			var moveBy    = cc.moveBy(time01, 0, 20);
			var scaleTo01 = cc.scaleTo(time01, 3, 3);
			var scaleTo02 = cc.scaleTo(time03, 1, 1);
			var moveTo    = cc.moveTo(time03, self.calledscore.getParent().convertToWorldSpace(self.calledscore.getPosition()));
			var spawn     = cc.spawn(moveBy, scaleTo01);
			var spawn02   = cc.spawn(moveTo, scaleTo02);
			var delayT    = cc.delayTime(time02);
			var callfunc  = cc.callFunc(function(){
				self.setCurrentBeishu(times);
			});
			var sequence  = cc.sequence(spawn,delayT, spawn02,callfunc,cc.removeSelf());
			beishu.runAction(sequence);
		},
		//设置倍数
		setCurrentBeishu:function(addtimes,beisuNumber)
		{
			if(addtimes == null)
				addtimes = 2;

			var beishu = Number(this.calledscore.getString()) * addtimes;

			if ( beisuNumber )
			{
				beishu = beisuNumber;
			}

			this.calledscore.setString(beishu);
		},
		//设置低分
		setBaseScore:function(score)
		{
			this.baseScore.setString(score);
		},
		//设置用户叫分
		/*
		 叫分结束，显示庄家信息
		 {"type":"CMD_S_BankerInfo","wBankerUser":0,"wCurrentUser":0,"cbBankerScore":3,"cbBankerCard":[50,61,29]}
		 癞子
		 {"type":"CMD_S_BankerInfo","wBankerUser":0,"wCurrentUser":0,"cbLaiZiCard":58,"cbBankerCard":[24,79,54],"bDoubleInfo":[1,1,1]}
		 */
		showBankerInfo:function(data)
		{
			sparrowDirector.gameData.isGaming = true;
			//var len = data.cbBankerCard.length;
			if ( Is_LAIZI_ROOM() )
			{
				//len += 1;
				//设置癞子牌
				setLaiziNumber(data.cbLaiZiCard);
				sparrowDirector.gameLayer.orderLaiziLayer.resetData();
			}
			else if ( Is_HAPPY_ROOM() )
			{
				this.setCurrentScore(data.wTotalAddTimes);
			}
			else
			{
				this.setBankerScore(data);
			}
			this.setDizuPuker(data);
			var direction = sparrowDirector.gameLayer.countDownLayer.getDirection(data.wBankerUser);
			sparrowDirector.gameLayer.showRole(true, data);
			if ( Is_LAIZI_ROOM() )
			{
				sparrowDirector.gameLayer.countDownLayer.startCountDown(sparrowDirector.gameData.myChairIndex);//加倍倒计时
				if ( data.wBankerUser == sparrowDirector.gameData.myChairIndex )
				{
					sparrowDirector.gameLayer.pukerLayer.reLayoutPukerFirst(data.cbBankerCard, data.cbLaiZiCard);
				}
				else
				{
					sparrowDirector.gameLayer.pukerLayer.reLayoutPukerFirst(null, data.cbLaiZiCard);
				}
			}
			else
			{
				this.scheduleOnce(function()
				{
					//清空叫抢状态
					for(var i=1;i<=3;i++)
					{
						var player = sparrowDirector.gameLayer.playerLayer.getChildByTag(100*i);
						player.Image_nocall.visible = false;
						player.Image_norob.visible = false;
						player.Image_call.visible = false;
						player.Image_rob.visible = false;
					}
					sparrowDirector.gameLayer.countDownLayer.startCountDown(data.wBankerUser);
					if ( data.wBankerUser == sparrowDirector.gameData.myChairIndex )
					{
						sparrowDirector.gameData01.isDragOut = true;
						sparrowDirector.gameLayer.pukerLayer.reLayoutPukerFirst(data.cbBankerCard);
						//出牌
						sparrowDirector.gameLayer.orderLayer.refreshTextures();
						sparrowDirector.gameLayer.orderLayer.setOutPukerBtnEnable();
					}
				}, 1.5);
			}
			this.refreshPukerCount(direction, data.cbBankerCard.length);
			//sparrowDirector.gameLayer.countDownLayer.startCountDown(data.wBankerUser);
		},

		//设置当前倍数
		setCurrentScore : function(currentTimes)
		{
			if(sparrowDirector.gameData.happyRoomState == HappyRoomState.showcard)	//明牌阶段
			{
				if(currentTimes > sparrowDirector.gameData.currentCallScore)
				{
					sparrowDirector.gameData.currentCallScore = currentTimes;
					sparrowDirector.gameData.currentCallScore01 = currentTimes;
					this.calledscore.setString(sparrowDirector.gameData.currentCallScore);
				}
			}
			if(sparrowDirector.gameData.happyRoomState == HappyRoomState.callLand)	//叫地主阶段
			{
				sparrowDirector.gameData.currentCallScore = sparrowDirector.gameData.currentCallScore * 3;
				sparrowDirector.gameData.currentCallScore01 = sparrowDirector.gameData.currentCallScore * 3;
				this.calledscore.setString(sparrowDirector.gameData.currentCallScore);
			}
			if(sparrowDirector.gameData.happyRoomState == HappyRoomState.robLand)	//抢地主阶段
			{
				sparrowDirector.gameData.currentCallScore = sparrowDirector.gameData.currentCallScore * 2;
				sparrowDirector.gameData.currentCallScore01 = sparrowDirector.gameData.currentCallScore * 2;
				this.calledscore.setString(sparrowDirector.gameData.currentCallScore);
			}
		},

		//清理其他玩家的明牌
		cleaningShowCard:function(direction)
		{
			switch (direction) {
				case 0:	//自己
				{
					break;
				}
				case 1:	//右
				{
					sparrowDirector.gameLayer.pukerLayer.pukerDataRight.splice(0);
					for(var j = sparrowDirector.gameLayer.pukerLayer.pukerArrRight.length - 1; j >= 0 ; j--)
					{
						sparrowDirector.gameLayer.pukerLayer.pukerArrRight[j].removeFromParent();
						sparrowDirector.gameLayer.pukerLayer.pukerArrRight.splice(j, 1);
					}
					break;
				}
				case 2:	//左
				{
					sparrowDirector.gameLayer.pukerLayer.pukerDataLeft.splice(0);
					for(var j = sparrowDirector.gameLayer.pukerLayer.pukerArrLeft.length - 1; j >= 0 ; j--)
					{
						sparrowDirector.gameLayer.pukerLayer.pukerArrLeft[j].removeFromParent();
						sparrowDirector.gameLayer.pukerLayer.pukerArrLeft.splice(j, 1);
					}
					break;
				}
				default :
					break;
			}

		},

		//显示明牌玩家信息
		showCardInfo:function(data)
		{
			lm.log("显示明牌玩家信息 " + JSON.stringify(data));

			for(var i = 0; i < data.cbHandCardData.length; i++)
			{
				if (i != sparrowDirector.gameData.myChairIndex && sparrowDirector.gameData.happyRoomShowCardFlag[i] == 1)	//不是玩家自己 且 明牌了
				{
					//获取玩家方向
					var direction = sparrowDirector.gameLayer.countDownLayer.getDirection(i);
					switch (direction) {
						case 0:	//自己
						{
							break;
						}
						case 1:	//右
						{
							lm.log("showCardInfo right [" + JSON.stringify(data.cbHandCardData[i]) + "]");
							this.cleaningShowCard(1);
							sparrowDirector.gameLayer.pukerLayer.pukerDataRight = data.cbHandCardData[i];
							sparrowDirector.gameLayer.pukerLayer.layoutPuker_showcard(1);

							lm.log("showCardInfo right 2");
							//明牌时隐藏剩余牌数
							var playHead = sparrowDirector.gameLayer.playerLayer.getChildByTag(300);
							if (playHead)
							{
								lm.log("showCardInfo right 3");

								playHead.cardBg.visible = false;
								playHead.remainCard.visible = false;
							}

							break;
						}
						case 2:	//左
						{
							this.cleaningShowCard(2);
							sparrowDirector.gameLayer.pukerLayer.pukerDataLeft = data.cbHandCardData[i];
							sparrowDirector.gameLayer.pukerLayer.layoutPuker_showcard(2);

							//明牌时隐藏剩余牌数
							var playHead = sparrowDirector.gameLayer.playerLayer.getChildByTag(200);
							if (playHead)
							{
								playHead.cardBg.visible = false;
								playHead.remainCard.visible = false;
							}

							break;
						}
						default :
							break;
					}
				}
			}
		},
		/*
		 刷新玩家剩余扑克
		 */
		refreshPukerCount:function(direction , count)
		{
			if ( direction < 0 )
			{
				this.count01 = this.count02 = this.count03 = sparrowDirector.gameLayer.pukerLayer.pukerArr01.length;
			}
			else
			{
				switch ( direction )
				{
					case 0:	//自己
					{
						this.count01 += count;
						if ( this.count01 < 0 )
						{
							this.count01 = 0;
						}
						var playHead = sparrowDirector.gameLayer.playerLayer.getChildByTag(100);
						if(playHead.twoCard == false && this.count01 == 2)
						{
							playHead.twoCard = true;
							LandCEMusic.playTwoCardEf();
						}
						if(playHead.oneCard == false && this.count01 == 1)
						{
							playHead.oneCard = true;
							LandCEMusic.playOneCardEf();
						}

						break;
					}
					case 1:	//右
					{
						this.count03 += count;
						if ( this.count03 < 0 )
						{
							this.count03 = 0;
						}
						var playHead = sparrowDirector.gameLayer.playerLayer.getChildByTag(300);
						if(playHead.twoCard == false && this.count03 == 2)
						{
							playHead.twoCard = true;
							LandCEMusic.playTwoCardEf();
						}
						if(playHead.oneCard == false && this.count03 == 1)
						{
							playHead.oneCard = true;
							LandCEMusic.playOneCardEf();
						}
						break;
					}
					case 2: //左
					{
						this.count02 += count;
						if ( this.count02 < 0 )
						{
							this.count02 = 0;
						}
						var playHead = sparrowDirector.gameLayer.playerLayer.getChildByTag(200);
						if(playHead.twoCard == false && this.count02 == 2)
						{
							playHead.twoCard = true;
							LandCEMusic.playTwoCardEf();
						}
						if(playHead.oneCard == false && this.count02 == 1)
						{
							playHead.oneCard = true;
							LandCEMusic.playOneCardEf();
						}
						break;
					}
					default :
						break;
				}
				if ( this.count01 < 3 && this.count01 > 0)
				{
					sparrowDirector.gameLayer.landAnimate.showWarnAnimate(0);
				}
				if ( this.count02 < 3 && this.count02 > 0 )
				{
					sparrowDirector.gameLayer.landAnimate.showWarnAnimate(1);
				}
				if ( this.count03 < 3 && this.count03 > 0)
				{
					sparrowDirector.gameLayer.landAnimate.showWarnAnimate(2);
				}

			}
			var child = sparrowDirector.gameLayer.playerLayer.getChildren();
			if ( child.length < 3 ){return;}
			sparrowDirector.gameLayer.playerLayer.getChildByTag(100).remainCard.setString(this.count01);
			sparrowDirector.gameLayer.playerLayer.getChildByTag(200).remainCard.setString(this.count02);
			sparrowDirector.gameLayer.playerLayer.getChildByTag(300).remainCard.setString(this.count03);
		},
		resetData:function()
		{
			this.count01 = 0;
			this.count02 = 0;
			this.count03 = 0;
		},
		//设置
		settingBtnEvent:function(target, state)
		{
			if ( state == ccui.Widget.TOUCH_ENDED ) {

				if(this.settingBtn.tag == 1)
				{
					LandCEMusic.playBtnEffect ();
					this.aniSettingBtn(1);

				}
				else if(this.settingBtn.tag == 2)
				{
					LandCEMusic.playBtnEffect ();
					this.aniSettingBtn(2);

				}
			}
		},
		aniSettingBtn:function(type)
		{
			var time = 0.3;

			if(type == 1)	//弹出
			{
				this.settingBtn.tag = 0;
				this.settingBtn.loadTextures("image_setting_close.png","","",ccui.Widget.PLIST_TEXTURE);

				this.topInfo.runAction(cc.moveTo(time,cc.p(this.topInfo.savePos.x,this.topInfo.savePos.y + 100)));

				this.setBg.stopAllActions();
				this.setBg.runAction(
					cc.sequence(
						cc.moveTo(time,cc.p(this.setBg.savePos.x,this.setBg.savePos.y)),
						cc.callFunc(function()
						{
							this.settingBtn.tag = 2;
						}, this)
						,
						cc.delayTime(5.0),
						cc.callFunc(function()
						{
							this.aniSettingBtn(2);
						}, this)
					));
			}
			else if(type == 2)	//收起
			{
				this.settingBtn.tag = 0;
				this.settingBtn.loadTextures("desk007.png","","",ccui.Widget.PLIST_TEXTURE);

				this.topInfo.runAction(cc.moveTo(time,cc.p(this.topInfo.savePos.x,this.topInfo.savePos.y)));

				this.setBg.stopAllActions();
				this.setBg.runAction(
					cc.sequence(
						cc.moveTo(time,cc.p(this.setBg.savePos.x,this.setBg.savePos.y + 100)),
						cc.callFunc(function()
						{
							this.settingBtn.tag = 1;
						}, this)
					));
			}

/*
			if(type == 1)	//弹出
			{
				this.settingBtn.tag = 0;
				this.settingBtn.loadTextures("image_setting_close.png","","",ccui.Widget.PLIST_TEXTURE);

				this.topInfo.runAction(
					cc.Spawn(cc.moveTo(time,cc.p(this.topInfo.savePos.x,this.topInfo.savePos.y + 100)),
						cc.fadeOut(time)));

				this.setBg.stopAllActions();
				this.setBg.runAction(
					cc.sequence(
						cc.Spawn(cc.moveTo(time,cc.p(this.setBg.savePos.x,this.setBg.savePos.y)),
							cc.fadeIn(time)),
						cc.callFunc(function()
						{
							this.settingBtn.tag = 2;
						}, this)
						,
						cc.delayTime(5.0),
						cc.callFunc(function()
						{
							this.aniSettingBtn(2);
						}, this)
					));
			}
			else if(type == 2)	//收起
			{
				this.settingBtn.tag = 0;
				this.settingBtn.loadTextures("desk007.png","","",ccui.Widget.PLIST_TEXTURE);

				this.topInfo.runAction(
					cc.Spawn(cc.moveTo(time,cc.p(this.topInfo.savePos.x,this.topInfo.savePos.y)),
						cc.fadeIn(time)));

				this.setBg.stopAllActions();
				this.setBg.runAction(
					cc.sequence(
						cc.Spawn(cc.moveTo(time,cc.p(this.setBg.savePos.x,this.setBg.savePos.y + 100)),
							cc.fadeOut(time)),
						cc.callFunc(function()
						{
							this.settingBtn.tag = 1;
						}, this)
					));
			}
*/
		},
		//退出游戏
		qiutGame:function(target, state)
		{
			if ( state == ccui.Widget.TOUCH_ENDED )
			{
				if(this.settingBtn.tag != 2)
					return;
				this.aniSettingBtn(2);

				LandCEMusic.playBtnEffect();
				if ( !sparrowDirector.gameData.isGameOver )
				{
					this.qiutGame01();
					//WaittingLayerPopManager(new PopAutoTipsUILayer("打牌期间不能退出，凑一桌是缘分，打完这把再走呗！！", DefultPopTipsTime));
				}
				else
				{
					LandCEMusic.playBtnEffect();
					sparrowDirector.SendUserAskStandup();
				}
			}
		},
		qiutGame01:function()
		{
			var scene = new rootScene();
			var curLayer = new RoomUILayer();
			sparrowDirector.updatenotify = false;
			sparrowDirector.foceline = false;
			CloseGameSocket(KernelGame);
			DataUtil.SetGoToModule(ClientModuleType.Plaza);
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
		},
		//托管
		aiEvent:function(target, state)
		{
			if ( state == ccui.Widget.TOUCH_ENDED )
			{
				if(this.settingBtn.tag != 2)
					return;
				this.aniSettingBtn(2);

				if (sparrowDirector.gameData.isGameOver)
				{
					return;
				}
				LandCEMusic.playBtnEffect();
				sparrowDirector.gameData.isAutoAi = true;
				sparrowDirector.gameLayer.androidLayer.visible = true;

				if(Is_HAPPY_ROOM())
				{
					sparrowDirector.sendTrustee_happy(1);
				}
				else
				{
					sparrowDirector.sendTuoGuanOrder(1);
				}

				if ( sparrowDirector.gameLayer.orderLayer.ui.visible || sparrowDirector.gameLayer.orderLaiziLayer.orderLayer01.visible )
				{
					sparrowDirector.gameLayer.orderLayer.checkAutoAi();
				}
			}
		},
		onExit:function()
		{
			this._super();
		}
	});
//TODO
//扑克层
var PukerLayer = cc.Layer.extend(
	{
		ctor:function()
		{
			this._super();
			this.setVariable();
			this.zinit();
		},
		zinit:function()
		{
			this.size = winSize;
			this.setContentSize(this.size);

			this.maskLayer = cc.Layer.create();
			this.maskLayer.setContentSize(cc.size(winSize.width,210));
			this.maskLayer.setPosition(0, 40);
			this.addChild(this.maskLayer, 10000);
			this.tipTxt = cc.Sprite.createWithSpriteFrameName("tip.png");
			this.tipTxt.setPosition(winSize.width/2, this.maskLayer.height/2-20);
			this.maskLayer.addChild(this.tipTxt, 10);
			this.maskLayer.visible = false;
		},
		setVariable:function()
		{
			this.backPuker = [];
			this.count = 0;
			this.pukerData = [];	//玩家手牌数字
			this.pukerArr01 = [];	//玩家手里真正的牌

			this.pukerDataLeft = [];	//左边玩家手牌数字
			this.pukerArrLeft = [];		//左边玩家手里真正的牌
			this.pukerDataRight = [];	//右边玩家手牌数字
			this.pukerArrRight = [];	//右边玩家手里真正的牌

			this.pukerArr02 = [];	//左边玩家出的牌
			this.pukerArr03 = [];	//右边玩家出的牌
			this.pukerArr04 = [];	//玩家自己出的牌
			//玩牌过程中摆放扑克
			this.pukerPlane = cc.Layer.create();
			this.addChild(this.pukerPlane, 3);
		},
		//扣着，播放发牌动作的扑克
		setLaunchPuker:function(data)
		{
			var runningScene = cc.director.getRunningScene();
			var oldlayer = runningScene.getChildByTag(TIP_TAG);
			if(sparrowDirector.gameLayer && sparrowDirector.isPlayingGame)
				oldlayer = sparrowDirector.gameLayer.getChildByTag(TIP_TAG);
			if(oldlayer != null)
				oldlayer.removeFromParent();

			sparrowDirector.gameLayer.deskLayer.initInformation();
			LandCEMusic.playStartEffect();
			this.resetData();
			this.resetData01();
			this.pukerData = data.cbCardData;
			for ( var i = 0; i < 51; i++ )
			{
				var backpuker = new GameCard();
				backpuker.scale = 0.4;
				backpuker.createPukerBack();
				this.backPuker.push(backpuker);
				this.addChild(backpuker, 1000);
			}
			var gap = 10;
			for ( var i = 0; i < this.backPuker.length; i++ )
			{
				this.backPuker[i].x = this.size.width/2-this.backPuker[i].width*0.4/2 - 50 ;//- 60 - gap*(this.backPuker.length - 1)/2 + gap*i;
				this.backPuker[i].y = Control_pos.left.y-50-i/10;
			}
			sparrowDirector.gameData.isLaunchPuker = true;
			sparrowDirector.gameData.happyRoomShowCardCount = 0;
			this.launchPuker(50);
		},
		resetData01:function()
		{
			sparrowDirector.gameData.isGameOver = false;
			sparrowDirector.gameLayer.deskLayer.removeDizuPuker();
			sparrowDirector.gameLayer.countDownLayer.hideClock();
			sparrowDirector.gameLayer.orderLaiziLayer.resetData();
			sparrowDirector.gameLayer.orderLaiziLayer.orderType = 0;
			sparrowDirector.gameData.isLanchFirstPuker = true;
			sparrowDirector.gameLayer.orderLaiziLayer.refreshTextures();
			sparrowDirector.gameLayer.deskLayer.calledscore.setString(0);
		},
		resetData:function()
		{
			sparrowDirector.gameLayer.playerLayer.visible = true;
			this.count = 0;
			sparrowDirector.gameLayer.deskLayer.count01 = 0;
			sparrowDirector.gameLayer.deskLayer.count02 = 0;
			sparrowDirector.gameLayer.deskLayer.count03 = 0;
			var that = this;
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
			for ( var i = 0; i < that.pukerArr01.length; i++ )
			{
				that.pukerArr01[i].removeFromParent();
			}
			that.pukerArr01.splice(0);
			for ( var i = 0; i < that.backPuker.length; i++ )
			{
				that.backPuker[i].removeFromParent();
			}
			that.backPuker.splice(0);
			this.pukerData.splice(0);
			this.pukerPlane.removeAllChildren();
			sparrowDirector.gameLayer.orderLayer.startBtn.visible = false;
			sparrowDirector.isPlayingAnimate = false;
			sparrowDirector.overData = null;
			sparrowDirector.taskTimes = 1;
		},
		//发牌动作
		launchPuker:function(index)
		{
			LandCEMusic.playSendEffect();//Control_pos.left.y-50-i/10
			var time 	 = 0.14;
			var moveTo01 = cc.moveTo(time, cc.p(Control_pos.left.x-100, Control_pos.left.y-50));
			var moveTo02 = cc.moveTo(time, cc.p(/*Control_pos.center.x*/this.size.width/2-this.backPuker[index].width*0.4/2 - 50, Control_pos.center.y));
			var moveTo03 = cc.moveTo(time, cc.p(Control_pos.right.x-50, Control_pos.left.y-50));
			var callBack = cc.callFunc(function()
			{
				if ( Is_HAPPY_ROOM() )//欢乐斗地主
				{
					sparrowDirector.gameData.happyRoomShowCardCount = sparrowDirector.gameData.happyRoomShowCardCount + 1;	//发牌张数加1
					sparrowDirector.gameLayer.orderLayer_happy.reloadShowCardBtn(sparrowDirector.gameData.happyRoomShowCardCount);
				}
				this.backPuker[index].visible = false;
				this.backPuker[index-1].visible = false;
				this.backPuker[index-2].visible = false;
				this.layoutPuker();
				if ( (index-3) < 0 )
				{
					sparrowDirector.gameLayer.deskLayer.showRandomTask(true);//显示随机任务
					if ( Is_LAIZI_ROOM() )//wCurrentUser
					{
						sparrowDirector.gameLayer.orderLaiziLayer.startCallBanker(sparrowDirector.gameData.wCurrentUser);//启动叫地主
						//sparrowDirector.gameLayer.orderLaiziLayer.startCallBanker(sparrowDirector.gameData.startUser);//启动叫地主
					}
					if ( Is_HAPPY_ROOM() )//欢乐斗地主
					{
						lm.log("欢乐斗地主 用户明牌状态信息 发完牌 [ " + " " + sparrowDirector.gameData.myChairIndex + " " + sparrowDirector.gameData.happyRoomShowCardFlag + "]");
						if(sparrowDirector.gameData.happyRoomShowCardFlag[sparrowDirector.gameData.myChairIndex] == 0 )	//自己没有明牌 告知服务器
						{
							sparrowDirector.sendShowCard_happy(0, sparrowDirector.gameData.happyRoomShowCardFlag);
						}
						sparrowDirector.sendCardFinish_happy();		//告诉服务器发牌完成了
						sparrowDirector.gameData.happyRoomState = HappyRoomState.callLand;	//进入叫地主阶段
						sparrowDirector.gameLayer.orderLayer_happy.hideView();
					}
					else
					{
						sparrowDirector.gameLayer.orderLayer.startCallScore(sparrowDirector.gameData.startUser);//启动叫分
					}
					return;
				}
				this.launchPuker(index-3)
			}, this);
			var sequnce = cc.sequence(moveTo03, callBack);
			this.backPuker[index].runAction(moveTo01);
			this.backPuker[index-1].runAction(moveTo02);
			this.backPuker[index-2].runAction(sequnce);
		},
		/*
		 场景消息，游戏中
		 {"type":"CMD_S_StatusPlay","cbTimeCallBanker":"ᐔḔᐞ\n","cbTimeRodBanker":1,"cbTimeAddDouble":0,"cbTimeHeadOutCard":1,"cbTimeOutCard":0,
		 "lCellScore":16842754,"wCurrentUser":514,"wBankerUser":0,"wStartTime":256,"wValidCardTime":514,"wRodBankerTime":0,"wBombTime":512,"cbBombCount":0,"bValidCardInfo":[1,34,0],
		 "cbCallBankerInfo":[0,0,0],"cbRodBankerInfo":[0,0,0],"cbAddDoubleInfo":[0,0,0],"wTurnWiner":0,"cbTurnCardCount":0,"cbTurnLaiziCount":0,"cbLaiziCard":0,
		 "cbTurnCardData":[0,0,0,0,0,37,28,51,4,5,13,10,0,0,0,0,0,0,0,0],"cbBankerCard":[0,0,0],"cbHandCardCount":[0,0,0],
		 "cbHandCardData":[[0,0,0,0,0,0,50,2,45,13,43,11,58,42,9,55,23,6,19,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],"lTurnScore":[0,0,0],"lCollectScore":[0,712813663165087700,4294967297],"bAvertCheat":112}
		 */
		sceneGamePlayingLaizi:function(data)
		{
			sparrowDirector.gameLayer.orderLayer.startBtn.visible = false;
			//癞子牌
			setLaiziNumber(data["cbLaiziCard"] ? data["cbLaiziCard"] : data.cbLaiZiCard);
			var temp = [];
			var puker = data.cbHandCardData[sparrowDirector.gameData.myChairIndex];
			//显示角色
			sparrowDirector.gameLayer.showRole(true, {wBankerUser:data.wBankerUser ? data.wBankerUser : data["wBankerUser"]});
			for ( var i =  0; i < puker.length; i++ )
			{
				if ( puker[i] > 0 )
				{
					temp.push(puker[i]);
				}
			}
			if ( this.pukerArr01.length > 0 ){return;}
			this.pukerData = temp;
			for ( var j = 0; j < temp.length; j++ )
			{
				cc.log(j);
				var gap = 50;
				var card = new GameCard();
				gap = 55*card.scale;
				var m = this.pukerData[j];
				card.createPuker(m, false);
				this.pukerArr01.push(card);
				this.pukerArr01.sort(function(param1,param2){return (-param1.sortNumber01+param2.sortNumber01)});
				this.addChild(card);
				if ( card.sortNumber01 == sparrowDirector.gameData.laiziValue.value )
				{
					card.laiziNum = 1;
					card.showLaizi();
				}
			}
			this.pukerArr01.sort(function(param1,param2){return (-param1.laiziNum+param2.laiziNum)});
			for ( var i = 0; i < this.pukerArr01.length; i++ )
			{
				this.pukerArr01[i].x = Control_pos.center.x - 60 - gap*(this.pukerArr01.length - 1 )/2 + gap*i;
				this.pukerArr01[i].y = (Control_pos.center.y - 40)*this.pukerArr01[i].scale+this.pukerArr01[i].yOffset;
				this.pukerArr01[i].posNomal = true;
				this.pukerArr01[i].setLocalZOrder(50 + i);
			}
			if ( sparrowDirector.gameData.isMyDizu )
			{
				if(this.pukerArr01[this.pukerArr01.length - 1])
				{
					this.pukerArr01[this.pukerArr01.length - 1].showDiZhuTag(true);
				}
			}
			if(this.pukerArr01[this.pukerArr01.length - 1])
			{
				this.pukerArr01[this.pukerArr01.length - 1].isEventEnabled = true;
			}
			//设置地主牌
			sparrowDirector.gameLayer.deskLayer.setDizuPuker(data);

			//出牌信息
			var tempData = {"type":"CMD_S_OutCard","cbCardCount":data.cbTurnCardCount,
				"wCurrentUser":data.wCurrentUser,
				"wOutCardUser":data.wTurnWiner,
				"cbOutCardData":data.cbTurnCardData,
				"cbCardData":data.cbTurnCardData}
			sparrowDirector.gameLayer.pukerLayer.savedOutPukerOrder(tempData);
			if (tempData.wOutCardUser == sparrowDirector.gameData.myChairIndex)
			{
				sparrowDirector.gameLayer.pukerLayer.outPuker (tempData.wOutCardUser, tempData);
			}
			this.scheduleOnce(function()
			{
				//剩余牌数
				for ( var i = 0; i < data.cbHandCardCount.length; i++ )
				{
					var direction = sparrowDirector.gameLayer.countDownLayer.getDirection(i);
					sparrowDirector.gameLayer.deskLayer.refreshPukerCount(direction, data.cbHandCardCount[i]);
				}
			}, 1);
		},
		/*
		 场景消息，游戏中
		 {"type":"CMD_S_StatusPlay","cbTimeCallBanker":"ᐔḔᐞ\n","cbTimeRodBanker":1,"cbTimeAddDouble":0,"cbTimeHeadOutCard":1,"cbTimeOutCard":0,
		 "lCellScore":16842754,"wCurrentUser":514,"wBankerUser":0,"wStartTime":256,"wValidCardTime":514,"wRodBankerTime":0,"wBombTime":512,"cbBombCount":0,"bValidCardInfo":[1,34,0],
		 "cbCallBankerInfo":[0,0,0],"cbRodBankerInfo":[0,0,0],"cbAddDoubleInfo":[0,0,0],"wTurnWiner":0,"cbTurnCardCount":0,"cbTurnLaiziCount":0,"cbLaiziCard":0,
		 "cbTurnCardData":[0,0,0,0,0,37,28,51,4,5,13,10,0,0,0,0,0,0,0,0],"cbBankerCard":[0,0,0],"cbHandCardCount":[0,0,0],
		 "cbHandCardData":[[0,0,0,0,0,0,50,2,45,13,43,11,58,42,9,55,23,6,19,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],"lTurnScore":[0,0,0],"lCollectScore":[0,712813663165087700,4294967297],"bAvertCheat":112}
		 */
		sceneGamePlaying_happy:function(data)
		{
			sparrowDirector.gameLayer.orderLayer.startBtn.visible = false;

			var temp = [];
			var puker = data.cbHandCardData[sparrowDirector.gameData.myChairIndex];


			//显示角色
			this.scheduleOnce(function()
			{
				sparrowDirector.gameLayer.showRole(true, data);
				sparrowDirector.gameLayer.deskLayer.showCardInfo(data);
				sparrowDirector.gameLayer.deskLayer.setDizuPuker(data);
			}, 1);

			for ( var i =  0; i < puker.length; i++ )
			{
				if ( puker[i] > 0 )
				{
					temp.push(puker[i]);
				}
			}
			if ( this.pukerArr01.length > 0 ){return;}
			this.pukerData = temp;
			for ( var j = 0; j < temp.length; j++ )
			{
				cc.log(j);
				var gap = 50;
				var card = new GameCard();
				gap = 55*card.scale;
				var m = this.pukerData[j];
				card.createPuker(m, false);
				this.pukerArr01.push(card);
				this.pukerArr01.sort(function(param1,param2){return (-param1.sortNumber01+param2.sortNumber01)});
				this.addChild(card);
			}
			this.pukerArr01.sort(function(param1,param2){return (-param1.laiziNum+param2.laiziNum)});
			for ( var i = 0; i < this.pukerArr01.length; i++ )
			{
				this.pukerArr01[i].x = Control_pos.center.x - 60 - gap*(this.pukerArr01.length - 1 )/2 + gap*i;
				this.pukerArr01[i].y = (Control_pos.center.y - 40)*this.pukerArr01[i].scale+this.pukerArr01[i].yOffset;
				this.pukerArr01[i].posNomal = true;
				this.pukerArr01[i].setLocalZOrder(50 + i);
				if ( sparrowDirector.gameData.happyRoomShowCardFlag[sparrowDirector.gameData.myChairIndex] == 1 )  //明牌了
				{
					this.pukerArr01[i].setShowCardTag(true);
				}
			}
			if ( sparrowDirector.gameData.isMyDizu )
			{
				if(this.pukerArr01[this.pukerArr01.length - 1])
				{
					this.pukerArr01[this.pukerArr01.length - 1].showDiZhuTag(true);
				}
			}
			if(this.pukerArr01[this.pukerArr01.length - 1])
			{
				this.pukerArr01[this.pukerArr01.length - 1].isEventEnabled = true;
			}
			//设置地主牌
			sparrowDirector.gameLayer.deskLayer.setDizuPuker(data);

			//出牌信息
			var tempData = {"type":"CMD_S_OutCard","cbCardCount":data.cbTurnCardCount,
				"wCurrentUser":data.wCurrentUser,
				"wOutCardUser":data.wTurnWiner,
				"cbOutCardData":data.cbTurnCardData,
				"cbCardData":data.cbTurnCardData}
			sparrowDirector.gameLayer.pukerLayer.savedOutPukerOrder(tempData);
			if (tempData.wOutCardUser == sparrowDirector.gameData.myChairIndex)
			{
				sparrowDirector.gameLayer.pukerLayer.outPuker (tempData.wOutCardUser, tempData);
			}
			this.scheduleOnce(function()
			{
				//剩余牌数
				for ( var i = 0; i < data.cbHandCardCount.length; i++ )
				{
					var direction = sparrowDirector.gameLayer.countDownLayer.getDirection(i);
					sparrowDirector.gameLayer.deskLayer.refreshPukerCount(direction, data.cbHandCardCount[i]);
				}
			}, 1);

			//玩家托管
			var tuoData = data.bUserTrustee;
			for(var i = 0;i < tuoData.length;i++)
			{
				if( sparrowDirector.gameData.myChairIndex != i )  //不是玩家自己
				{
					var direction = sparrowDirector.gameLayer.countDownLayer.getDirection(data.wChairID);
					var tag = (direction == 1) ? 300 : ((direction == 2) ? 200 : 100);
					if (tag == 200 || tag == 300) {
						var playerHead = sparrowDirector.gameLayer.playerLayer.getChildByTag(tag);
						playerHead.playerHead_ai.visible = (tuoData[i] == 1) ? true : false;
					}
				}
				else
				{
					if(tuoData[i])
					{
						sparrowDirector.gameData.isAutoAi = true;
						sparrowDirector.gameLayer.androidLayer.visible = true;
					}
				}
			}
		},
		/**
		 * 叫地主 抢地主状态--欢乐场
		 * @param data
		 * {"type":"CMD_S_StatusCall","cbTimeCallBanker":20,"cbTimeRodBanker":20,"cbTimeAddDouble":20,"cbTimeStartGame":30,"cbTimeHeadOutCard":30,"cbTimeOutCard":20,
		 * "lCellScore":100,"wFirstUser":0,"wFirstValidUser":-1,"wCurrentUser":1,"wStartTime":1,"wValidCardTime":1,"bValidCardInfo":[0,0,0],"cbCallBankerInfo":[2,0,0],
		 * "cbHandCardData":[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[38,50,34,2,61,60,44,43,24,8,55,53,37,52,20,35,3],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],
		 * "lTurnScore":[0,0,0],"lCollectScore":[800,0,0],"bAvertCheat":0}
		 */
		sceneGameCallBanker_happy:function(data)
		{
			lm.log("sceneGameCallBanker_happy 1");
			if ( sparrowDirector.gameData.isLanchFirstPuker )
			{
				sparrowDirector.gameData.isLanchFirstPuker = false;
				return;
			}

			lm.log("sceneGameCallBanker_happy 2");

			//刷新手里扑克
			this.scheduleOnce(function()
			{
				for ( var i = 0; i < GAME_PLAYER; i++ )
				{
					sparrowDirector.gameLayer.deskLayer.refreshPukerCount(i, 17);
				}
			}, 1);

			//当前手上操作
			if(data.cbLandOperate == 3)//叫地主
			{
				sparrowDirector.gameData.happyRoomState = HappyRoomState.callLand;
				sparrowDirector.gameLayer.deskLayer.setCurrentBeishu(null,data.wAddTimes);
			}
			else if(data.cbLandOperate == 4)//抢地主
			{
				sparrowDirector.gameData.happyRoomState = HappyRoomState.robLand;
				sparrowDirector.gameLayer.deskLayer.setCurrentBeishu(null,data.wAddTimes*3);
			}

			lm.log("sceneGameCallBanker_happy 3");

			//显示欢乐场叫抢地主命令
			sparrowDirector.gameLayer.orderLayer.startBtn.visible = false;
			if(data.wCurrentUser == sparrowDirector.gameData.myChairIndex ) //是玩家自己开始操作
			{
				if(sparrowDirector.gameData.happyRoomState == HappyRoomState.callLand)
				{
					sparrowDirector.gameLayer.orderLayer_happy.setOrderType(0);
				}
				else if(sparrowDirector.gameData.happyRoomState == HappyRoomState.robLand)
				{
					sparrowDirector.gameLayer.orderLayer_happy.setOrderType(1);
				}

				lm.log("sceneGameCallBanker_happy me");
				data.cbTimeTickCount = data.cbTimeTickCount - 3;
				if(data.cbTimeTickCount < 2)
					data.cbTimeTickCount = 2;
				sparrowDirector.gameLayer.countDownLayer.startCountDown(data.wCurrentUser, data.cbTimeTickCount);	//显示闹钟
			}
			else
			{
				lm.log("sceneGameCallBanker_happy other");
				sparrowDirector.gameLayer.countDownLayer.startCountDown(data.wCurrentUser);	//显示闹钟
			}


			//癞子牌
			var temp = [];
			lm.log("sceneGameCallBanker_happy aaa" + sparrowDirector.gameData.myChairIndex);
			var puker = data.cbHandCardData[sparrowDirector.gameData.myChairIndex];
			lm.log("sceneGameCallBanker_happy bbb [ " + JSON.stringify(puker) + "]");
			for ( var i =  0; i < puker.length; i++ )
			{
				if ( puker[i] > 0 )
				{
					temp.push(puker[i]);
				}
			}
			lm.log("sceneGameCallBanker_happy ccc [ " + JSON.stringify(temp) + "]");
			if ( this.pukerArr01.length > 0 ){return;}
			this.pukerData = temp;
			lm.log("sceneGameCallBanker_happy ddd [ " + JSON.stringify(this.pukerData) + "]");
			for ( var j = 0; j < temp.length; j++ )
			{
				cc.log(j);
				var gap = 50;
				var card = new GameCard();
				gap = 55*card.scale;
				var m = this.pukerData[j];
				card.createPuker(m, false);
				this.pukerArr01.push(card);
				this.pukerArr01.sort(function(param1,param2){return (-param1.sortNumber01+param2.sortNumber01)});
				this.addChild(card);
			}
			lm.log("sceneGameCallBanker_happy eee [ " + this.pukerArr01.length + "]");
			for ( var i = 0; i < this.pukerArr01.length; i++ )
			{
				var gap = 50*this.pukerArr01[i].scale;
				this.pukerArr01[i].x = Control_pos.center.x - 60 - gap*(this.pukerArr01.length - 1 )/2 + gap*i;
				this.pukerArr01[i].y = (Control_pos.center.y - 40)*this.pukerArr01[i].scale+this.pukerArr01[i].yOffset;
				this.pukerArr01[i].posNomal = true;
				this.pukerArr01[i].setLocalZOrder(50 + i);
				if ( sparrowDirector.gameData.happyRoomShowCardFlag[sparrowDirector.gameData.myChairIndex] == 1 )  //明牌了
				{
					this.pukerArr01[i].setShowCardTag(true);
				}
			}
			this.pukerArr01[this.pukerArr01.length - 1].isEventEnabled = true;


			//var callData = data.cbCallBankerInfo;
			//var tempData = {wCurrentUser:data.wCurrentUser, wLastUer:0, cbCallInfo:0}
			//for ( var i = 0; i < callData.length; i++ )
			//{
			//	if ( callData[i] != 0 )
			//	{
			//		tempData.wLastUer = i;
			//		tempData.cbCallInfo = callData[i];
			//		sparrowDirector.gameLayer.orderLaiziLayer.showBankerResult(tempData);
			//	}
			//	else if( i == sparrowDirector.gameData.myChairIndex )
			//	{
			//		sparrowDirector.gameLayer.orderLaiziLayer.refreshTextures();
			//		sparrowDirector.gameLayer.orderLaiziLayer.showView();
			//		sparrowDirector.gameLayer.countDownLayer.currntDirection = 0;
			//		sparrowDirector.gameLayer.countDownLayer.startCountDown(-1);
			//	}
			//}


			//玩家托管
			var tuoData = data.bUserTrustee;
			for(var i = 0;i < data.bUserTrustee;i++)
			{
				if( sparrowDirector.gameData.myChairIndex != i )  //不是玩家自己
				{
					var direction = sparrowDirector.gameLayer.countDownLayer.getDirection(data.wChairID);
					var tag = (direction == 1) ? 300 : ((direction == 2) ? 200 : 100);
					if (tag == 200 || tag == 300) {
						var playerHead = sparrowDirector.gameLayer.playerLayer.getChildByTag(tag);
						playerHead.playerHead_ai.visible = (tuoData[i] == 1) ? true : false;
					}
				}
				else
				{
					if(tuoData[i])
					{
						sparrowDirector.gameData.isAutoAi = true;
						sparrowDirector.gameLayer.androidLayer.visible = true;
					}
				}
			}
		},
		/**
		 * 叫地主状态
		 * @param data
		 * {"type":"CMD_S_StatusCall","cbTimeCallBanker":20,"cbTimeRodBanker":20,"cbTimeAddDouble":20,"cbTimeStartGame":30,"cbTimeHeadOutCard":30,"cbTimeOutCard":20,
		 * "lCellScore":100,"wFirstUser":0,"wFirstValidUser":-1,"wCurrentUser":1,"wStartTime":1,"wValidCardTime":1,"bValidCardInfo":[0,0,0],"cbCallBankerInfo":[2,0,0],
		 * "cbHandCardData":[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[38,50,34,2,61,60,44,43,24,8,55,53,37,52,20,35,3],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],
		 * "lTurnScore":[0,0,0],"lCollectScore":[800,0,0],"bAvertCheat":0}
		 */
		sceneGameCallBanker:function(data)
		{
			if ( sparrowDirector.gameData.isLanchFirstPuker )
			{
				sparrowDirector.gameData.isLanchFirstPuker = false;
				return;
			}
			sparrowDirector.gameLayer.orderLayer.startBtn.visible = false;
			sparrowDirector.gameLayer.orderLaiziLayer.orderType = 0;
			//癞子牌
			var temp = [];
			var puker = data.cbHandCardData[sparrowDirector.gameData.myChairIndex];
			for ( var i =  0; i < puker.length; i++ )
			{
				if ( puker[i] > 0 )
				{
					temp.push(puker[i]);
				}
			}
			if ( this.pukerArr01.length > 0 ){return;}
			this.pukerData = temp;
			for ( var j = 0; j < temp.length; j++ )
			{
				cc.log(j);
				var gap = 50;
				var card = new GameCard();
				gap = 55*card.scale;
				var m = this.pukerData[j];
				card.createPuker(m, false);
				this.pukerArr01.push(card);
				this.pukerArr01.sort(function(param1,param2){return (-param1.sortNumber01+param2.sortNumber01)});
				this.addChild(card);
			}
			for ( var i = 0; i < this.pukerArr01.length; i++ )
			{
				this.pukerArr01[i].x = Control_pos.center.x - 60 - gap*(this.pukerArr01.length - 1 )/2 + gap*i;
				this.pukerArr01[i].y = (Control_pos.center.y - 40)*this.pukerArr01[i].scale+this.pukerArr01[i].yOffset;
				this.pukerArr01[i].posNomal = true;
				this.pukerArr01[i].setLocalZOrder(50 + i);
			}
			this.pukerArr01[this.pukerArr01.length - 1].isEventEnabled = true;
			var callData = data.cbCallBankerInfo;
			var tempData = {wCurrentUser:data.wCurrentUser, wLastUer:0, cbCallInfo:0}
			for ( var i = 0; i < callData.length; i++ )
			{
				if ( callData[i] != 0 )
				{
					tempData.wLastUer = i;
					tempData.cbCallInfo = callData[i];
					sparrowDirector.gameLayer.orderLaiziLayer.showBankerResult(tempData);
				}
				else if( i == sparrowDirector.gameData.myChairIndex )
				{
					sparrowDirector.gameLayer.orderLaiziLayer.refreshTextures();
					sparrowDirector.gameLayer.orderLaiziLayer.showView();
					sparrowDirector.gameLayer.countDownLayer.currntDirection = 0;
					sparrowDirector.gameLayer.countDownLayer.startCountDown(-1);
				}
			}
			for ( var i = 0; i < GAME_PLAYER; i++ )
			{
				sparrowDirector.gameLayer.deskLayer.refreshPukerCount(i, 17);
			}
		},
		/**
		 * 强地主状态
		 * @param data
		 * {"type":"CMD_S_StatusRod","cbTimeCallBanker":20,"cbTimeRodBanker":20,"cbTimeAddDouble":20,"cbTimeStartGame":30,"cbTimeHeadOutCard":30,"cbTimeOutCard":20,"lCellScore":100,
		 * "wFirstUser":2,"wFirstValidUser":-1,"wBankerUser":2,"wCurrentUser":0,"wStartTime":1,"wValidCardTime":1,"wRodBankerTime":2,"bValidCardInfo":[0,0,0],
		 * "cbCallBankerInfo":[0,1,0,[26,78,2,17,1,61,13,27,11,57,9,8,7,20,4,35,19],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],
		 * "cbRodBankerInfo":[0,0,1],"cbValidCardInfo":[0,0,0],"cbHandCardData":[],"lTurnScore":[0,0,0],"lCollectScore":[0,0,0],"bAvertCheat":0}
		 */
		sceneGameRodedBanker:function(data)
		{
			sparrowDirector.gameLayer.orderLayer.startBtn.visible = false;
			//癞子牌
			var temp = [];
			var puker = data.cbHandCardData[sparrowDirector.gameData.myChairIndex];
			for ( var i =  0; i < puker.length; i++ )
			{
				if ( puker[i] > 0 )
				{
					temp.push(puker[i]);
				}
			}
			if ( this.pukerArr01.length > 0 ){return;}
			this.pukerData = temp;
			for ( var j = 0; j < temp.length; j++ )
			{
				cc.log(j);
				var gap = 50;
				var card = new GameCard();
				gap = 55*card.scale;
				var m = this.pukerData[j];
				card.createPuker(m, false);
				this.pukerArr01.push(card);
				this.pukerArr01.sort(function(param1,param2){return (-param1.sortNumber01+param2.sortNumber01)});
				this.addChild(card);
			}
			for ( var i = 0; i < this.pukerArr01.length; i++ )
			{
				this.pukerArr01[i].x = Control_pos.center.x - 60 - gap*(this.pukerArr01.length - 1 )/2 + gap*i;
				this.pukerArr01[i].y = (Control_pos.center.y - 40)*this.pukerArr01[i].scale+this.pukerArr01[i].yOffset;
				this.pukerArr01[i].posNomal = true;
				this.pukerArr01[i].setLocalZOrder(50 + i);
			}
			this.pukerArr01[this.pukerArr01.length - 1].isEventEnabled = true;
			var callData = data.cbCallBankerInfo;
			var tempData = {wCurrentUser:data.wCurrentUser, wLastUer:0, cbCallInfo:0}
			sparrowDirector.gameLayer.orderLaiziLayer.orderType = 0;
			for ( var i = 0; i < callData.length; i++ )
			{
				if ( callData[i] != 0 )
				{
					tempData.wLastUer = i;
					tempData.cbCallInfo = callData[i];
					sparrowDirector.gameLayer.orderLaiziLayer.showBankerResult(tempData);
				}
			}
			sparrowDirector.gameLayer.orderLaiziLayer.orderType = 1;
			var rodData = data.cbRodBankerInfo;
			var tempRData = {wCurrentUser:data.wCurrentUser, wLastUer:0, cbCallInfo:0}
			for ( var i = 0; i < rodData.length; i++ )
			{
				if ( rodData[i] != 0 )
				{
					tempRData.wLastUer = i;
					tempRData.cbCallInfo = rodData[i];
					sparrowDirector.gameLayer.orderLaiziLayer.showRodBanker(tempRData);
				}
				else if( i == sparrowDirector.gameData.myChairIndex )
				{
					sparrowDirector.gameLayer.orderLaiziLayer.refreshTextures();
					sparrowDirector.gameLayer.orderLaiziLayer.showView();
					sparrowDirector.gameLayer.countDownLayer.currntDirection = 0;
					sparrowDirector.gameLayer.countDownLayer.startCountDown(-1);
				}
			}
			//剩余扑克数目
			for ( var i = 0; i < GAME_PLAYER; i++ )
			{
				sparrowDirector.gameLayer.deskLayer.refreshPukerCount(i, 17);
			}
		},
		/**
		 *  场景消息，加倍状态
		 * @param data
		 * {"type":"CMD_S_StatusDouble","cbTimeCallBanker":20,"cbTimeRodBanker":20,"cbTimeAddDouble":20,"cbTimeStartGame":30,"cbTimeHeadOutCard":30,"cbTimeOutCard":20,"lCellScore":100,
		 * "wBankerUser":1,"wCurrentUser":0,"wStartTime":1,"wValidCardTime":1,"wRodBankerTime":4,"bValidCardInfo":[0,0,0],"cbCallBankerInfo":[2,1,0],"cbRodBankerInfo":[0,1,1],
		 * "cbAddDoubleInfo":[1,0,2],"cbBankerCard":[0,0,0],"cbHandCardCount":[17,20,17],
		 * "cbHandCardData":[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[11,43,59,78,50,2,29,44,28,12,26,9,56,40,53,21,5,20,35,19],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],
		 * "cbLaiziCard":59,"lTurnScore":[0,0,0],"lCollectScore":[0,0,0],"bAvertCheat":0}
		 */
		sceneGameDouble:function(data)
		{
			sparrowDirector.gameLayer.orderLayer.startBtn.visible = false;
			sparrowDirector.gameLayer.orderLaiziLayer.orderType = 2;
			//显示角色
			sparrowDirector.gameLayer.showRole(true, {wBankerUser:data.wBankerUser ? data.wBankerUser : data["wBankerUser"]});
			//癞子牌
			setLaiziNumber(data["cbLaiziCard"] ? data["cbLaiziCard"] : data.cbLaiZiCard);
			var temp = [];
			var puker = data.cbHandCardData[sparrowDirector.gameData.myChairIndex];
			for ( var i =  0; i < puker.length; i++ )
			{
				if ( puker[i] > 0 )
				{
					temp.push(puker[i]);
				}
			}
			if ( this.pukerArr01.length > 0 ){return;}
			this.pukerData = temp;
			for ( var j = 0; j < temp.length; j++ )
			{
				cc.log(j);
				var gap = 50;
				var card = new GameCard();
				gap = 55*card.scale;
				var m = this.pukerData[j];
				card.createPuker(m, false);
				this.pukerArr01.push(card);
				this.pukerArr01.sort(function(param1,param2){return (-param1.sortNumber01+param2.sortNumber01)});
				this.addChild(card);
				if ( card.sortNumber01 == sparrowDirector.gameData.laiziValue.value )
				{
					card.laiziNum = 1;
					card.showLaizi();
				}
			}
			this.pukerArr01.sort(function(param1,param2){return (-param1.laiziNum+param2.laiziNum)});
			for ( var i = 0; i < this.pukerArr01.length; i++ )
			{
				this.pukerArr01[i].x = Control_pos.center.x - 60 - gap*(this.pukerArr01.length - 1 )/2 + gap*i;
				this.pukerArr01[i].y = (Control_pos.center.y - 40)*this.pukerArr01[i].scale+this.pukerArr01[i].yOffset;
				this.pukerArr01[i].posNomal = true;
				this.pukerArr01[i].setLocalZOrder(50 + i);
			}
			if ( sparrowDirector.gameData.isMyDizu )
			{
				this.pukerArr01[this.pukerArr01.length - 1].showDiZhuTag(true);
			}
			this.pukerArr01[this.pukerArr01.length - 1].isEventEnabled = true;
			var doubleData = data.cbAddDoubleInfo;
			var tempData = {wCurrentUser:data.wCurrentUser, cbDouble:0}
			for ( var i = 0; i < doubleData.length; i++ )
			{
				if ( doubleData[i] != 0 )
				{
					tempData.wCurrentUser = i;
					tempData.cbDouble = doubleData[i];
					sparrowDirector.gameLayer.orderLaiziLayer.showDoubleInfo(tempData);
				}
				else if ( i == sparrowDirector.gameData.myChairIndex )
				{
					sparrowDirector.gameLayer.orderLaiziLayer.doubleOrder();
					sparrowDirector.gameLayer.countDownLayer.currntDirection = 0;
					sparrowDirector.gameLayer.countDownLayer.startCountDown(-1);
					sparrowDirector.gameLayer.orderLaiziLayer.showView();
				}
			}
			//设置地主牌
			sparrowDirector.gameLayer.deskLayer.setDizuPuker(data);
			//剩余牌数
			for ( var i = 0; i < data.cbHandCardCount.length; i++ )
			{
				var direc = sparrowDirector.gameLayer.countDownLayer.getDirection(i);
				sparrowDirector.gameLayer.deskLayer.refreshPukerCount(direc, data.cbHandCardCount[i]);
			}
			cc.log("=============================== 11 "+this.pukerArr01.length);
		},
		/**
		 * 场景消息处理，游戏进行中
		 * @param data
		 * {"type":"CMD_S_StatusPlay","cbTimeOutCard":20,"cbTimeCallScore":20,"cbTimeStartGame":30,"cbTimeHeadOutCard":30,"lCellScore":5000,
		 * "wBankerUser":1,"cbBombCount":0,"wCurrentUser":2,"cbBankerScore":3,"wTurnWiner":1,"cbTurnCardCount":1,
		 * "cbTurnCardData":[22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		 * "cbBankerCard":[10,8,7],
		 * "cbHandCardData":[34,17,13,42,10,40,8,23,7,0,0,0,0,0,0,0,0,0,0,0],"cbHandCardCount":[9,10,13],"lTurnScore":[0,15000,15000],"lCollectScore":[0,0,0]}
		 */
		sceneGamePlaying:function(data)
		{
			sparrowDirector.gameLayer.orderLayer.startBtn.visible = false;
			//显示角色
			sparrowDirector.gameLayer.showRole(true, {wBankerUser:data.wBankerUser ? data.wBankerUser : data["wBankerUser"]});
			var temp = [];
			var puker = data.cbHandCardData;
			for ( var i =  0; i < puker.length; i++ )
			{
				if ( puker[i] > 0 )
				{
					temp.push(puker[i]);
				}
			}
			if ( this.pukerArr01.length > 0 ){return;}
			this.pukerData = temp;
			for ( var j = 0; j < temp.length; j++ )
			{
				cc.log(j);
				var gap = 50;
				var card = new GameCard();
				gap = 55*card.scale;
				var m = this.pukerData[j];
				card.createPuker(m, false);
				this.pukerArr01.push(card);
				this.pukerArr01.sort(function(param1,param2){return (-param1.sortNumber01+param2.sortNumber01)});
				this.addChild(card);
			}
			for ( var i = 0; i < this.pukerArr01.length; i++ )
			{
				gap = 50*this.pukerArr01[i].scale;
				this.pukerArr01[i].x = Control_pos.center.x - 60 - gap*(this.pukerArr01.length - 1 )/2 + gap*i;
				this.pukerArr01[i].y = (Control_pos.center.y - 40)*this.pukerArr01[i].scale+this.pukerArr01[i].yOffset;
				this.pukerArr01[i].posNomal = true;
				this.pukerArr01[i].setLocalZOrder(50 + i);
			}
			this.pukerArr01[this.pukerArr01.length - 1].isEventEnabled = true;
			if ( sparrowDirector.gameData.isMyDizu )
			{
				this.pukerArr01[this.pukerArr01.length - 1].showDiZhuTag(true);
			}
			//设置地主牌
			sparrowDirector.gameLayer.deskLayer.setDizuPuker(data);
			sparrowDirector.gameLayer.deskLayer.setBankerScore(data);
			//出牌信息
			 var tempData = {"type":"CMD_S_OutCard","cbCardCount":data.cbTurnCardCount,
				 "wCurrentUser":data.wCurrentUser,
				 "wOutCardUser":data.wTurnWiner,
				 "cbCardData":data.cbTurnCardData}
			sparrowDirector.gameLayer.pukerLayer.savedOutPukerOrder(tempData);
			if (tempData.wOutCardUser == sparrowDirector.gameData.myChairIndex)
			{
				sparrowDirector.gameLayer.pukerLayer.outPuker (tempData.wOutCardUser, tempData);
			}
			this.scheduleOnce(function()
			{
				//剩余牌数
				for ( var i = 0; i < data.cbHandCardCount.length; i++ )
				{
					var direction = sparrowDirector.gameLayer.countDownLayer.getDirection(i);
					sparrowDirector.gameLayer.deskLayer.refreshPukerCount(direction, data.cbHandCardCount[i]);
				}
			});
			//玩家托管
			var tuoData = data.bUserTrustee;
			if ( tuoData[sparrowDirector.gameData.myChairIndex] )
			{
				sparrowDirector.gameData.isAutoAi = true;
				sparrowDirector.gameLayer.androidLayer.visible = true;
			}
			lm.log("游戏状态---------------------------------------- "+sparrowDirector.gameData.myChairIndex)
		},
		/**
		 * 场景消息，叫分状态
		 * @param data  bUserTrustee
		 * {"type":"CMD_S_StatusCall","cbTimeOutCard":20,"cbTimeCallScore":20,"cbTimeStartGame":30,"cbTimeHeadOutCard":30,
		 * "lCellScore":5000,"wCurrentUser":0,"cbBankerScore":0,"cbScoreInfo":[0,0,-1],"bUserTrustee":[0,0,1],
		 * "cbHandCardData":[78,18,49,1,29,13,42,9,56,40,24,22,6,37,5,20,19],"lTurnScore":[-20000,0,40000],"lCollectScore":[-50000,0,-35000]}
		 */
		sceneCallScore:function(data)
		{
			if ( sparrowDirector.gameData.isLanchFirstPuker )
			{
				sparrowDirector.gameData.isLanchFirstPuker = false;
				return;
			}
			sparrowDirector.gameLayer.orderLayer.startBtn.visible = false;
			var temp = [];
			var puker = data.cbHandCardData;
			for ( var i =  0; i < puker.length; i++ )
			{
				if ( puker[i] > 0 )
				{
					temp.push(puker[i]);
				}
			}
			if ( this.pukerArr01.length > 0 ){return;}
			this.pukerData = temp;
			for ( var j = 0; j < temp.length; j++ )
			{
				cc.log(j);
				var gap = 50;
				var card = new GameCard();
				gap = 55*card.scale;
				var m = this.pukerData[j];
				card.createPuker(m, false);
				this.pukerArr01.push(card);
				this.pukerArr01.sort(function(param1,param2){return (-param1.sortNumber01+param2.sortNumber01)});
				this.addChild(card);
			}
			for ( var i = 0; i < this.pukerArr01.length; i++ )
			{
				gap = 50*this.pukerArr01[i].scale;
				this.pukerArr01[i].x = Control_pos.center.x - 60 - gap*(this.pukerArr01.length - 1 )/2 + gap*i;
				this.pukerArr01[i].y = (Control_pos.center.y - 40)*this.pukerArr01[i].scale+this.pukerArr01[i].yOffset;
				this.pukerArr01[i].posNomal = true;
				this.pukerArr01[i].setLocalZOrder(50 + i);
			}
			this.pukerArr01[this.pukerArr01.length - 1].isEventEnabled = true;
			//设置低分
			sparrowDirector.gameLayer.deskLayer.setBaseScore(data.lCellScore);
			//显示当前玩家叫分情况
			var tempData = {"type":"CMD_S_CallScore","wCurrentUser":data.wCurrentUser,"wCallScoreUser":1,"cbCurrentScore":0,"cbUserCallScore":-1}
			var callScore = data.cbScoreInfo;
			for ( var i = 0; i < callScore.length; i++ )
			{
				if ( callScore[i] != 0 )
				{
					tempData.wCallScoreUser = i;
					tempData.cbUserCallScore = callScore[i];
					sparrowDirector.gameLayer.scoreLayer.showCallScore(tempData);
				}
			}
			//剩余牌数
			for ( var i = 0; i < GAME_PLAYER; i++ )
			{
				sparrowDirector.gameLayer.deskLayer.refreshPukerCount(i, 17);
			}
			//玩家托管
			var tuoData = data.bUserTrustee;
			if ( tuoData[sparrowDirector.gameData.myChairIndex] )
			{
				sparrowDirector.gameData.isAutoAi = true;
				sparrowDirector.gameLayer.androidLayer.visible = true;
			}
		},

		//排列扑克-明牌玩家（1右 2左）
		layoutPuker_showcard:function(direction)
		{
			var pukerData = [];
			var pukerDataArr = [];
			if(direction == 1)
			{
				pukerDataArr = this.pukerArrRight;
				lm.log("layoutPuker_showcard right AAAAAAAAAAAAAAAAAA1 " + JSON.stringify(pukerData));
				for ( var i = 0; i < this.pukerDataRight.length; i++ )
				{
					if(this.pukerDataRight[i] != 0)
						pukerData[i] = this.pukerDataRight[i];

				}
				this.pukerDataRight = pukerData;
				lm.log("layoutPuker_showcard right AAAAAAAAAAAAAAAAAA2 " + JSON.stringify(this.pukerArrRight));
				lm.log("layoutPuker_showcard right AAAAAAAAAAAAAAAAAA3 " + JSON.stringify(pukerData));
			}
			else if(direction == 2)
			{
				pukerDataArr = this.pukerArrLeft;
				for ( var i = 0; i < this.pukerDataLeft.length; i++ )
				{
					if(this.pukerDataLeft[i] != 0)
						pukerData[i] = this.pukerDataLeft[i];
				}
				this.pukerDataLeft = pukerData;
			}
			else
			{
				return;
			}

			//创建扑克
			for ( var i = 0; i < pukerData.length; i++ )
			{
				var card = new GameCard();
				card.createPuker(pukerData[i], false, true);
				card.scale = 0.8;
				card.posNomal = true;
				card.setLocalZOrder(i);
				card.isEventEnabled = false;
				this.addChild(card);
				pukerDataArr.push(card);
			}

			this.relayoutPuker_showcard(direction);
		},

		//重新排列扑克-明牌玩家（1右 2左）
		relayoutPuker_showcard:function(direction,outPukerData)
		{
			//获取玩家牌数据
			var pukerData = [];
			var pukerDataArr = [];
			var startPos = [];
			var gap = 20 * 0.8;
			if(direction == 1)
			{
				pukerData = this.pukerDataRight;
				pukerDataArr = this.pukerArrRight;

				startPos.x = Control_pos.right.x - 130;
				startPos.y = Control_pos.right.y;

				var playHead = sparrowDirector.gameLayer.playerLayer.getChildByTag(300);
				if (playHead)
				{
					var pos = this.convertToNodeSpace(playHead.cardBg.getParent().convertToWorldSpace(playHead.cardBg.getPosition()));
					startPos.x = pos.x - 71;
					startPos.y = pos.y - 90;
				}
			}
			else if(direction == 2)
			{
				pukerData = this.pukerDataLeft;
				pukerDataArr = this.pukerArrLeft;

				startPos.x = Control_pos.left.x;
				startPos.y = Control_pos.left.y;

				var playHead = sparrowDirector.gameLayer.playerLayer.getChildByTag(200);
				if (playHead)
				{
					var pos = this.convertToNodeSpace(playHead.cardBg.getParent().convertToWorldSpace(playHead.cardBg.getPosition()));
					startPos.x = pos.x - 71;
					startPos.y = pos.y - 90;
				}
			}
			else
			{
				return;
			}
			//startPos.y = startPos.y - 150;
			//从玩家牌数据中删除要出的牌
			if(outPukerData)
			{
				for(var i = 0; i < outPukerData.length; i++)
				{
					for(var j = 0; j < pukerData.length; j++)
					{
						if(pukerData[j] == outPukerData[i])
						{
							pukerData.splice(j, 1);
							break;
						}
					}

					for(var j = 0; j < pukerDataArr.length; j++)
					{
						if(pukerDataArr[j].sortNumber == outPukerData[i])
						{
							pukerDataArr[j].removeFromParent();
							pukerDataArr.splice(j, 1);
							break;
						}
					}
				}
			}

			if(direction == 1)
			{
				lm.log("relayoutPuker_showcard right BBBBBBBBBBBBBB " + JSON.stringify(this.pukerDataRight));
				lm.log("relayoutPuker_showcard right BBBBBBBBBBBBBB " + JSON.stringify(pukerData));
				if(pukerData.length >= 10)
				{
					startPos.x = startPos.x - gap * 9;
				}
				else
				{
					startPos.x = startPos.x - gap * (pukerData.length - 1);
				}
			}

			//排序
			pukerDataArr.sort(function(param1,param2){return (-param1.sortNumber01+param2.sortNumber01)});

			//重置位置
			for ( var i = 0; i < pukerDataArr.length; i++ )
			{
				if(i < 10)
				{
					pukerDataArr[i].x = startPos.x + gap*i;
					pukerDataArr[i].y = startPos.y;
				}
				else
				{
					pukerDataArr[i].x = startPos.x + gap*(i - 10);
					pukerDataArr[i].y = startPos.y - 25;
				}
			}


			if(direction == 1)
			{
				lm.log("layoutPuker_showcard 右" +  " " + this.pukerArrRight.length + " " + pukerDataArr.length);
			}
			else if(direction == 2)
			{
				lm.log("layoutPuker_showcard 左" +  " " + this.pukerDataLeft.length + " " + pukerDataArr.length);
			}

		},
		//game over 时清理玩家明的牌
		cleaningShowCard:function()
		{
			//右
			for(var j = this.pukerArrRight.length - 1; j >= 0; j--)
			{
				this.pukerArrRight[j].removeFromParent();
				this.pukerArrRight.splice(j, 1);
			}

			//左
			for(var j = this.pukerArrLeft.length - 1; j >= 0; j--)
			{
				this.pukerArrLeft[j].removeFromParent();
				this.pukerArrLeft.splice(j, 1);
			}

		},
		//排列扑克
		layoutPuker:function()
		{
			var gap = 50;
			var card = new GameCard();
			gap = 55*card.scale;
			var m = this.pukerData[this.count];
			card.createPuker(m, false);
			this.pukerArr01.push(card);
			this.pukerArr01.sort(function(param1,param2){return (-param1.sortNumber01+param2.sortNumber01)});
			if ( Is_LAIZI_ROOM() )
			{
				this.pukerArr01.sort(function(param1,param2){return (-param1.laiziNum+param2.laiziNum)});
			}
			for ( var i = 0; i < this.pukerArr01.length; i++ )
			{
				gap = 50*this.pukerArr01[i].scale;
				this.pukerArr01[i].x = Control_pos.center.x - 60 - gap*(this.pukerArr01.length - 1 )/2 + gap*i;
				this.pukerArr01[i].y = (Control_pos.center.y - 40)*this.pukerArr01[i].scale+this.pukerArr01[i].yOffset;
				this.pukerArr01[i].posNomal = true;
				this.pukerArr01[i].setLocalZOrder(50 + i);
				//this.pukerArr01[i].setZOrder(50+i);
				if ( this.pukerArr01[i].isEventEnabled )
				{
					this.pukerArr01[i].isEventEnabled = false;
				}
				if ( i == this.pukerArr01.length - 1 )
				{
					this.addChild(card);
				}
			}
			if ( this.pukerArr01.length == 17 )
			{
				this.pukerArr01[this.pukerArr01.length - 1].isEventEnabled = true;
			}
			this.count++;
			sparrowDirector.gameLayer.deskLayer.refreshPukerCount(-1);
		},
		//玩家为庄家，重排扑克
		reLayoutPukerFirst:function(data,laizi)
		{
			var gap = 50;
			if ( data )
			{
				for ( var i = 0; i < data.length; i++ )
				{
					var card = new GameCard();
					gap = 40*card.scale;
					var m = data[i];
					card.createPuker(m, true);
					card.isZhuang = true;
					this.addChild(card);
					this.pukerArr01.push(card);
				}
			}
			//将癞子牌排在前面
			if (laizi)
			{
				var tempCard = new GameCard();
				tempCard.createPuker(laizi, false);
				for ( var i = 0; i < this.pukerArr01.length; i++ )
				{
					if ( this.pukerArr01[i].sortNumber01 == tempCard.sortNumber01 )
					{
						this.pukerArr01[i].laiziNum = 1;
						this.pukerArr01[i].showLaizi();
					}
				}
			}

			this.pukerArr01.sort(function(param1,param2){return (-param1.sortNumber01+param2.sortNumber01)});
			if ( Is_LAIZI_ROOM() )
			{
				this.pukerArr01.sort(function(param1,param2){return (-param1.laiziNum+param2.laiziNum)});
			}
			for ( var i = 0; i < this.pukerArr01.length; i++ )
			{
				gap = 50*this.pukerArr01[i].scale;
				this.pukerArr01[i].x = Control_pos.center.x - 66 - gap*(this.pukerArr01.length - 1 )/2 + gap*i;
				this.pukerArr01[i].y = (Control_pos.center.y - 40)*this.pukerArr01[i].scale+this.pukerArr01[i].yOffset;
				this.pukerArr01[i].posNomal = true;
				this.pukerArr01[i].setLocalZOrder(50 + i);
				if ( this.pukerArr01[i].isEventEnabled )
				{
					this.pukerArr01[i].isEventEnabled = false;
				}
				//this.pukerArr01[i].showDiZhuTag(true);
				if ( this.pukerArr01[i].isZhuang )
				{
					this.pukerArr01[i].selectedCard();
				}
			}
			if ( sparrowDirector.gameData.isMyDizu )
			{
				this.pukerArr01[this.pukerArr01.length - 1].showDiZhuTag(true);
			}
			if ( sparrowDirector.gameData.happyRoomShowCardFlag[sparrowDirector.gameData.myChairIndex] == 1 )	//明牌了
			{
				this.pukerArr01[this.pukerArr01.length - 1].setShowCardTag(true);
			}
			this.pukerArr01[this.pukerArr01.length - 1].isEventEnabled = true;
			sparrowDirector.gameLayer.deskLayer.refreshPukerCount();
			this.scheduleOnce(function()
			{
				sparrowDirector.gameLayer.pukerLayer.reLayoutPuker();
				sparrowDirector.gameLayer.orderLayer.setOutPukerBtnEnable();
			}, 1);
		},
		/*
		接收到出牌命令
		 {"type":"CMD_S_OutCard","cbCardCount":2,"wCurrentUser":0,"wOutCardUser":2,
		 "cbCardData":[52,4,16,-5,-46,44,52,-4,7,0,48,80,40,-51,66,-61,127,0,0,72]}
		 */
		savedOutPukerOrder:function(data)
		{
			if (sparrowDirector.gameData.isTurnOver && data.wOutCardUser != sparrowDirector.gameData.myChairIndex)
			{
				//一轮结束
				sparrowDirector.gameData.isTurnOver = false;
				sparrowDirector.gameLayer.cbTurnOver ();
			}
			else
			{
				sparrowDirector.gameData.isTurnOver = false;
			}
			sparrowDirector.gameLayer.countDownLayer.startCountDown (data.wCurrentUser);
			sparrowDirector.gameData.isPassedPuker = false;
			if (data.wOutCardUser != sparrowDirector.gameData.myChairIndex)
			{
				sparrowDirector.gameData01.isDragOut = false;

				lm.log("chupailalallalal_-____________checkebeishu--------");
				if ( Is_LAIZI_ROOM() )
				{
					if ( data.cbOutCardData )
					{
						sparrowDirector.gameData.oTherPuker = data.cbOutCardData.slice(0,data.cbCardCount);
						sparrowDirector.gameData.oTherPuker01 = data.cbCardData.slice(0,data.cbCardCount);
					}
				}
				else
				{
					if ( data.cbCardData )
					{
						sparrowDirector.gameData.oTherPuker = data.cbCardData.slice(0,data.cbCardCount);
					}
				}
				sparrowDirector.gameLayer.pukerLayer.outPuker (data.wOutCardUser, data);
				sparrowDirector.gameLayer.deskLayer.hideTxtTipImage();
			}
			if (data.wCurrentUser == sparrowDirector.gameData.myChairIndex)
			{
				sparrowDirector.gameData01.isDragOut = true;
				sparrowDirector.gameData.isOuteredPuker  = false;
				sparrowDirector.gameLayer.orderLayer.refreshTextures ();
				sparrowDirector.gameLayer.orderLayer.setOutPukerBtnEnable ();
				//检测是否托管
				sparrowDirector.gameLayer.orderLayer.checkAutoAi ();
			}

			var that = this;
			if(data.wCurrentUser == data.wOutCardUser)
			{
				sparrowDirector.gameData.isOuteredPuker  = false;
				this.scheduleOnce(function()
				{
					that.clearningPukerPlane(0);
					that.clearningPukerPlane(1);
					that.clearningPukerPlane(2);
					sparrowDirector.gameData01.isDragOut = true;
				}, 1);
			}
			else
			{
				this.clearningPukerPlane(data.wCurrentUser);
			}
			sparrowDirector.gameLayer.orderLayer.mm = 0;
			sparrowDirector.gameLayer.orderLayer.nn = 0;
			sparrowDirector.gameLayer.orderLayer.tipCount = 0;

		},
		//玩牌时清理当前桌面
		clearningPukerPlane:function(direction)
		{
			direction = sparrowDirector.gameLayer.countDownLayer.getDirection(direction);
			sparrowDirector.gameLayer.orderPassCard(null, direction);
			switch (direction)
			{
				case 0:
				{
					for ( var i = 0; i < this.pukerArr04.length; i++ )
					{
						this.pukerArr04[i].removeFromParent();
					}
					this.pukerArr04.splice(0);
					break;
				}
				case 1:
				{
					for ( var i = 0; i < this.pukerArr03.length; i++ )
					{
						this.pukerArr03[i].removeFromParent();
					}
					this.pukerArr03.splice(0);
					break;
				}
				case 2:
				{
					for ( var i = 0; i < this.pukerArr02.length; i++ )
					{
						this.pukerArr02[i].removeFromParent();
					}
					this.pukerArr02.splice(0);
					break;
				}
				default :
				{
					break;
				}
			}
		},
		//检测是否有炸弹，火箭，飞机牌型
		checkAnimation:function(data, direction)
		{
			//var type = gameLogic.getType(data);
			//sparrowDirector.gameLayer.landAnimate.playRocketAnimation();
			//LandCEMusic.playThreeOneLineEf()
			//return;

			//lm.log("检测是否有炸弹，火箭，飞机牌型----------------------")
			var type = gameLogic.getType(data);
			if ( !type ){return;}
			switch (type)
			{
				case CT_MISSILE_CARD://王炸
				{
					sparrowDirector.isPlayingAnimate = true;
					sparrowDirector.gameLayer.landAnimate.playRocketAnimation(direction, type);
					sparrowDirector.gameLayer.deskLayer.refreshCurrentBeishu();
					LandCEMusic.playMissileEf();
					break;
				}
				case CT_THREE_LINE://飞机
				{
					sparrowDirector.isPlayingAnimate = true;
					sparrowDirector.gameLayer.landAnimate.playPlaneAnimation(direction, type);
					LandCEMusic.playThreeOneLineEf()
					break;
				}
				case CT_BOME_CARD://炸弹
				{
					sparrowDirector.isPlayingAnimate = true;
					sparrowDirector.gameLayer.landAnimate.playBomeAnimation(direction, type);
					sparrowDirector.gameLayer.deskLayer.refreshCurrentBeishu();
					LandCEMusic.playBoomEf();
					break;
				}
				case CT_SINGLE_LINE://顺子
				{
					sparrowDirector.isPlayingAnimate = true;
					sparrowDirector.gameLayer.landAnimate.playShunziAnimation(direction, type);
					LandCEMusic.playSingleLineEf();
					break;
				}
				case CT_DOUBLE_LINE://连对
				{
					sparrowDirector.isPlayingAnimate = true;
					sparrowDirector.gameLayer.landAnimate.playLianDuiAnimation(direction, type);
					LandCEMusic.playDoubleByDoubleEf();
					break;
				}
				case CT_DOUBLE://对子
				{
					//LandCEMusic.playDoubleEf();
					var card = gameLogic.getPukerData(data)[0];
					switch (card.value)
					{
						case 3:
							LandCEMusic.playSingleEffect (card.value);
							break;
						case 4:
							LandCEMusic.playSingleEffect (card.value);
							break;
						case 5:
							LandCEMusic.playSingleEffect (card.value);
							break;
						case 6:
							LandCEMusic.playSingleEffect (card.value);
							break;
						case 7:
							LandCEMusic.playSingleEffect (card.value);
							break;
						case 8:
							LandCEMusic.playSingleEffect (card.value);
							break;
						case 9:
							LandCEMusic.playSingleEffect (card.value);
							break;
						case 10:
							LandCEMusic.playSingleEffect (card.value);
							break;
						case 11:
							LandCEMusic.playSingleEffect (card.value);
							break;
						case 12:
							LandCEMusic.playSingleEffect (card.value);
							break;
						case 13:
							LandCEMusic.playSingleEffect (card.value);
							break;
						case 14:
							LandCEMusic.playSingleEffect (1);
							break;
						case 15:
							LandCEMusic.playSingleEffect (2);
							break;
						default :
							break;
					}
					break;
				}
				case CT_THREE://三条类型
				{
					LandCEMusic.playThreeEf();
					break;
				}
				case CT_THREE_TAKE_ONE://三带一
				{
					LandCEMusic.playThreeByOneEf();
					break;
				}
				case CT_THREE_TAKE_TWO://三带一对
				{
					LandCEMusic.playThreeByTwoEf();
					break;
				}
				case CT_FOUR_TAKE_ONE://四带两单
				{
					LandCEMusic.playFourBySingleEf();
					break;
				}
				case CT_FOUR_TAKE_TWO:
				{
					LandCEMusic.playFourByDoubleEf();
					break;
				}
				case CT_SINGLE://单牌
				{
					var card = gameLogic.getPukerData(data)[0];
					switch (card.value)
					{
						case 3:
							LandCEMusic.playSingleEffect(card.value, true);
							break;
						case 4:
							LandCEMusic.playSingleEffect(card.value, true);
							break;
						case 5:
							LandCEMusic.playSingleEffect(card.value, true);
							break;
						case 6:
							LandCEMusic.playSingleEffect(card.value, true);
							break;
						case 7:
							LandCEMusic.playSingleEffect(card.value, true);
							break;
						case 8:
							LandCEMusic.playSingleEffect(card.value, true);
							break;
						case 9:
							LandCEMusic.playSingleEffect(card.value, true);
							break;
						case 10:
							LandCEMusic.playSingleEffect(card.value, true);
							break;
						case 11:
							LandCEMusic.playSingleEffect(card.value, true);
							break;
						case 12:
							LandCEMusic.playSingleEffect(card.value, true);
							break;
						case 13:
							LandCEMusic.playSingleEffect(card.value, true);
							break;
						case 14:
							LandCEMusic.playSingleEffect(1, true);
							break;
						case 15:
							LandCEMusic.playSingleEffect(2, true);
							break;
						case 78:
							LandCEMusic.playSingleEffect(14, true);
							break;
						case 79:
							LandCEMusic.playSingleEffect(15, true);
							break;
					}
					break;
				}

				default :
					break;
			}


			//最后一首牌任务相关判断
			//if(direction == 0 && sparrowDirector.gameLayer.deskLayer.count01 == 0)	//是玩家自己 且 牌出完了
			//{
			//	var typeList = RandomTaskDescribe[RandomTaskAttending.id]["type"];
			//	for(var i in typeList)
			//	{
			//		if(typeList[i] == type)	//最后一手的牌型符合随机任务中的牌型
			//		{
			//			sparrowDirector.gameLayer.deskLayer.refreshCurrentBeishu(RandomTaskDescribe[RandomTaskAttending.id]["times"]);
			//			sparrowDirector.taskTimes = RandomTaskDescribe[RandomTaskAttending.id]["times"];
			//			break;
			//		}
			//	}
			//}


		},
		//出牌
		outPuker:function(type, pData, resultLaiziData, resultOriginData)
		{
			type = sparrowDirector.gameLayer.countDownLayer.getDirection(type);
			var gap = 50;
			var outScale = 0.5;
			switch (type)
			{
				case 0://玩家自己
				{
					sparrowDirector.gameData.isOuteredPuker = true;
					this.reLayoutPuker();
					if ( pData )
					{
						if( !pData.cbCardData )
						{
							return;
						}
						//游戏中,场景消息出牌显示
						var puker = pData.cbCardData.slice(0, pData.cbCardCount);
						if ( Is_LAIZI_ROOM() )
						{
							puker = pData.cbOutCardData.slice(0, pData.cbCardCount);
						}
						for ( var j = 0; j < puker.length; j++ )
						{
							var item = new GameCard();
							item.createPuker(puker[j], true);
							if (sparrowDirector.gameData.isMyDizu)
							{
								//item.showDiZhuTag(true);
							}
							item.scaleX = outScale;
							item.scaleY = outScale;
							//item.x = Control_pos.center.x - 50 - (gap-25)*(puker.length - 1 )/2 + (gap-25)*j;
							item.y = Control_pos.center.y + 500;
							this.pukerArr04.push(item);
							this.pukerPlane.addChild(item);
						}
						if (sparrowDirector.gameData.isMyDizu && this.pukerArr04[this.pukerArr04.length-1])
						{
							this.pukerArr04[this.pukerArr04.length-1].showDiZhuTag(true);
						}
						return;
					}
					sparrowDirector.gameData.oTherPuker.splice(0);
					this.pukerArr04.sort(function(param1,param2){return (-param1.sortNumber01+param2.sortNumber01)});
					if ( Is_LAIZI_ROOM() )
					{
						this.pukerArr04.sort(function(param1,param2){return (-param1.laiziNum+param2.laiziNum)});
						var tempData = DataUtil.copyJson({originData:resultOriginData,laiziData:resultLaiziData});
						var laiPuker = [];
						if ( tempData.originData.length > 1 )
						{
							laiPuker = this.selectOutLaizi(tempData.originData,tempData.laiziData,this.pukerArr04.length);
						}
						else
						{
							var mm = gameLogic.getPukerData(tempData.originData);
							if (mm[0] && mm[0].value == sparrowDirector.gameData.laiziValue.value )
							{
								laiPuker = tempData.originData;
							}
						}

						if ( laiPuker.length > 0 )
						{
							//选出已出牌中得癞子，并显示癞子标志
							var laiN = 0;
							for ( var i = 0; i < this.pukerArr04.length; i++ )
							{
								if (sparrowDirector.gameData.isMyDizu && (i == this.pukerArr04.length-1))
								{
									//this.pukerArr04[i].showDiZhuTag(true);
								}
								var sorN = this.pukerArr04[i].sortNumber;
								for ( var j = 0; j < laiPuker.length; j++ )
								{
									if ( sorN == laiPuker[j] )
									{
										if ( laiN == laiPuker.length )
										{
											break;
										}
										laiN++;
										this.pukerArr04[i].showLaizi();
										break;
									}
								}
							}
						}
					}
					for ( var i = 0; i < this.pukerArr04.length; i++ )
					{
						this.pukerPlane.addChild(this.pukerArr04[i]);
					}
					if (sparrowDirector.gameData.isMyDizu && this.pukerArr04[this.pukerArr04.length-1])
					{
						this.pukerArr04[this.pukerArr04.length-1].showDiZhuTag(true);
					}
					if ( sparrowDirector.gameData.happyRoomShowCardFlag[sparrowDirector.gameData.myChairIndex] == 1 )  //明牌了
					{
						this.pukerArr04[this.pukerArr04.length-1].setShowCardTag(true);
					}
					var i = 0, n = this.pukerArr04.length, that =this;
					if ( n < 1){return;}
					var that = this;
					//递归播放出牌动画
					var func = function()
					{
						for(var i=0;i<that.pukerArr04.length;i++)
						{
							that.pukerArr04[i].scaleX = outScale;
							that.pukerArr04[i].scaleY = outScale;
							that.pukerArr04[i].setPositionX(Control_pos.center.x - 70 - (gap-25)*(n - 1 )/2 + (gap-25)*i);
							that.pukerArr04[i].setPositionY(Control_pos.center.y + 50);

							var xx = Control_pos.center.x - 70 - (gap-25)*(n - 1 )/2 + (gap-25)*i;
							var yy = Control_pos.center.y + 165;
							var time = 0.05;
							var moveTo = cc.moveTo(time,cc.p(xx, yy));
							var scaleTo= cc.scaleTo(time,outScale,outScale);
							var sq = cc.Spawn(moveTo, scaleTo);
							var callFunc = cc.callFunc(function()
							{
								if ( i >=n )
								{
									return;
								}
							}, this);
							var sequnce = cc.sequence(sq,callFunc);
							that.pukerArr04[i].runAction(sequnce);
						}
					};
					func();
					sparrowDirector.gameLayer.deskLayer.refreshPukerCount(type, (-this.pukerArr04.length));

					//发送出牌消息
					var arr = that.pukerArr04, temp = [],outData = {};
					for ( var m = 0; m < arr.length; m++ )
					{
						temp.push(arr[m].sortNumber);
					}
					sparrowDirector.gameLayer.pukerLayer.checkAnimation(temp, type);
					if ( pData )//场景消息回来
					{
						return;
					}
					for ( var j = 0; j < 20-arr.length; j++ )
					{
						temp.push(0);
					}
					var length = arr.length;
					outData.length = length;
					if ( !Is_LAIZI_ROOM() )
					{
						if(Is_HAPPY_ROOM())
						{
							outData.pData  = temp;
							sparrowDirector.sendOutCard_happy(outData);
						}
						else
						{
							outData.pData  = temp;
							sparrowDirector.sendOutCard(outData);
						}
					}
					else
					{
						for ( var j = 0; j < 20-arr.length; j++ )
						{
							resultOriginData.push(0);
						}
						outData.pData = resultOriginData.slice(0, 20);
						for ( var k = 0; k< 20-arr.length; k++ )
						{
							resultLaiziData.push(0);
						}
						outData.pLData = resultLaiziData.slice(0, 20);
						sparrowDirector.sendOutCardLaiZi(outData);
					}
					break;
				}

				case 2:// 左上玩家
				{
					sparrowDirector.gameData.isOuteredPuker = false;
					//if ( !pData ){return;}
					this.relayoutPuker_showcard(type, pData.cbCardData);

					var puker = pData.cbCardData;
					if( !pData.cbCardData )
					{
						return;
					}
					if ( Is_LAIZI_ROOM() )
					{
						puker = pData.cbOutCardData;
						var tempData = DataUtil.copyJson(pData);
						var laiPuker = [];
						if ( tempData.cbCardCount < 2 )
						{
							var mm = gameLogic.getPukerData(tempData.cbCardData.slice(0, 1));
							if (mm[0] &&  mm[0].value == sparrowDirector.gameData.laiziValue.value )
							{
								laiPuker = tempData.cbCardData.slice(0, 1);
							}
						}
						else
						{
							laiPuker = this.selectOutLaizi(tempData.cbCardData,tempData.cbOutCardData,tempData.cbCardCount);
						}
					}
					var laiN = 0;
					for ( var j = 0; j < pData.cbCardCount; j++ )
					{
						var card = new GameCard();
						card.createPuker(puker[j]);
						card.scale = outScale;
						this.pukerPlane.addChild(card, pData.cbCardCount-j+1000);
						card.setPosition(Control_pos.left.x-180,Control_pos.left.y-80);
						this.pukerArr02.push(card);
						//打出的 癞子牌显示
						if (laiPuker && laiPuker.length > 0 )
						{
							for ( var k = 0; k < laiPuker.length; k++ )
							{
								if ( puker[j] == laiPuker[k] )
								{
									if ( laiN == laiPuker.length )
									{
										break;
									}
									laiN++;
									card.showLaizi();
									break;
								}
							}
						}
					}
					this.pukerArr02.sort(function(param1,param2){return (-param1.sortNumber01+param2.sortNumber01)});
					if (sparrowDirector.gameData.isLeftDizu)
					{
						if (this.pukerArr02[this.pukerArr02.length-1])
						{
							this.pukerArr02[this.pukerArr02.length-1].showDiZhuTag(true);
						}
					}
					var i = 0, n = this.pukerArr02.length, that =this;
					if ( n < 1){return;}
					var func = function()
					{

						//
						for(var i=0;i<that.pukerArr02.length;i++)
						{
							var xx = Control_pos.left.x - 103 + (gap-25)*i;
							var yy = Control_pos.left.y - 80;
							var time = 0;
							var moveTo = cc.moveTo(time,cc.p(xx, yy));
							var scaleTo= cc.scaleTo(time,outScale,outScale);
							var sq = cc.Spawn(moveTo, scaleTo);
							var callFunc = cc.callFunc(function()
							{
								if ( i >=n )
								{
									//sparrowDirector.gameLayer.pukerLayer.checkAnimation(sparrowDirector.gameData.oTherPuker, type);
									return;
								}
							}, this);
							var sequnce = cc.sequence(sq,callFunc);
							that.pukerArr02[i].runAction(sequnce);
							that.pukerArr02[i].setLocalZOrder(i);
						}
					};
					func();
					sparrowDirector.gameLayer.pukerLayer.checkAnimation(sparrowDirector.gameData.oTherPuker, type);
					sparrowDirector.gameLayer.deskLayer.refreshPukerCount(type, (-this.pukerArr02.length));
					break;
				}

				case 1://右上玩家
				{
					sparrowDirector.gameData.isOuteredPuker = false;
					//if ( !pData ){return;}
					this.relayoutPuker_showcard(type, pData.cbCardData);

					var puker = pData.cbCardData;
					if( !pData.cbCardData )
					{
						return;
					}
					if ( Is_LAIZI_ROOM() )
					{
						puker = pData.cbOutCardData;
						var tempData = DataUtil.copyJson(pData);
						var laiPuker = [];
						if ( tempData.cbCardCount < 2 )
						{
							var mm = gameLogic.getPukerData(tempData.cbCardData.slice(0, 1));
							if (mm[0] && mm[0].value == sparrowDirector.gameData.laiziValue.value )
							{
								laiPuker = tempData.cbCardData.slice(0, 1);
							}
						}
						else
						{
							laiPuker = this.selectOutLaizi(tempData.cbCardData,tempData.cbOutCardData,tempData.cbCardCount);
						}
					}
					var laiN = 0;
					for ( var j = 0; j < pData.cbCardCount; j++ )
					{
						var card = new GameCard();
						card.createPuker(puker[j]);
						if (sparrowDirector.gameData.isRightDizu)
						{
							//card.showDiZhuTag(true);
						}
						card.scale = outScale;
						this.pukerPlane.addChild(card, pData.cbCardCount-j+1000);
						card.setPosition(Control_pos.right.x+50,Control_pos.left.y-80);
						this.pukerArr03.push(card);
						//打出的 癞子牌显示
						if (laiPuker && laiPuker.length > 0 )
						{
							for ( var k = 0; k < laiPuker.length; k++ )
							{
								if ( puker[j] == laiPuker[k])
								{
									if ( laiN == laiPuker.length )
									{
										break;
									}
									laiN++;
									card.showLaizi();
									break;
								}
							}
						}
					}
					this.pukerArr03.sort(function(param1,param2){return (-param1.sortNumber01+param2.sortNumber01)});
					if (sparrowDirector.gameData.isRightDizu)
					{
						if ( this.pukerArr03[this.pukerArr03.length-1] )
						{
							this.pukerArr03[0].showDiZhuTag(true);
						}
					}
					var i = 0, n = this.pukerArr03.length, that =this;
					if ( n < 1){return;}
					var func = function()
					{

						//
						for(var i=0;i<that.pukerArr03.length;i++)
						{
							var xx = Control_pos.right.x - 41 - (gap-25)*(that.pukerArr03.length - i);
							var yy = Control_pos.left.y - 80;
							var time = 0;
							var moveTo = cc.moveTo(time,cc.p(xx, yy));
							var scaleTo= cc.scaleTo(time,outScale,outScale);
							var sq = cc.Spawn(moveTo, scaleTo);
							var callFunc = cc.callFunc(function()
							{
								if ( i >=n )
								{
									//sparrowDirector.gameLayer.pukerLayer.checkAnimation(sparrowDirector.gameData.oTherPuker, type);
									return;
								}
							}, this);
							var sequnce = cc.sequence(sq,callFunc);
							that.pukerArr03[i].setLocalZOrder(i);//右方玩家
							that.pukerArr03[i].runAction(sequnce);
						}

					};
					func();
					sparrowDirector.gameLayer.pukerLayer.checkAnimation(sparrowDirector.gameData.oTherPuker, type);
					sparrowDirector.gameLayer.deskLayer.refreshPukerCount(type, (-this.pukerArr03.length));
					break;
				}

				default:
					break;
			}

			//this.checkGameOver();
		},
		/*
		 癞子斗地主时，将打出来的癞子塞选出来，显示癞子标志
		 arr01:原牌
		 arr02:替换后的癞子牌
		 len:牌的长度
		 return {Array}
		 */
		selectOutLaizi:function(arr01, arr02, len)
		{
			if ( !arr01 || !arr02 )
			{
				return [];
			}
			arr01.slice(0, len);
			arr02.slice(0, len);
			(function()
			{
				for ( var i = 0; i < arr02.length; i++ )
				{
					for ( var j = 0; j < arr01.length; j++ )
					{
						if ( arr02[i] == arr01[j] )
						{
							arr01.splice(j, 1);
							arr02.splice(i, 1);
							arguments.callee();
						}
					}
				}
			})();
			return arr02;
		},
		checkGameOver:function()
		{
			var m = sparrowDirector.gameLayer.deskLayer.count01;
			var n = sparrowDirector.gameLayer.deskLayer.count02;
			var o = sparrowDirector.gameLayer.deskLayer.count03;
			cc.log(m+"  "+n+"  "+o);
			if ( m == 0 || n == 0 || o == 0 )
			{
				//游戏结束
				sparrowDirector.gameLayer.gameOver();
			}
		},
		reLayoutPuker:function()
		{
			var gap = 50;
			this.pukerArr01.sort(function(param1,param2){return (-param1.sortNumber01+param2.sortNumber01)});
			if ( Is_LAIZI_ROOM() )
			{
				this.pukerArr01.sort(function(param1,param2){return (-param1.laiziNum+param2.laiziNum)});
			}
			for ( var i = 0; i < this.pukerArr01.length; i++ )
			{
				gap = 50*this.pukerArr01[i].scale;
				this.pukerArr01[i].x = Control_pos.center.x - 60 - gap*(this.pukerArr01.length - 1 )/2 + gap*i;
				this.pukerArr01[i].y = (Control_pos.center.y - 40)*this.pukerArr01[i].scale+this.pukerArr01[i].yOffset;
				this.pukerArr01[i].posNomal = true;
				this.pukerArr01[i].setLocalZOrder(50 + i);
				if ( this.pukerArr01[i].isEventEnabled )
				{
					this.pukerArr01[i].isEventEnabled = false;
				}
			}
			if ( sparrowDirector.gameData.isMyDizu )
			{
				if(this.pukerArr01[this.pukerArr01.length - 1])
				{
					this.pukerArr01[this.pukerArr01.length - 1].showDiZhuTag(true);
				}
			}
			if(this.pukerArr01[this.pukerArr01.length - 1])
			{
				this.pukerArr01[this.pukerArr01.length - 1].isEventEnabled = true;
			}
			if ( sparrowDirector.gameData.happyRoomShowCardFlag[sparrowDirector.gameData.myChairIndex] == 1 )  //明牌了
			{
				if(this.pukerArr01[this.pukerArr01.length - 1])
					this.pukerArr01[this.pukerArr01.length - 1].setShowCardTag(true);
			}
			//sparrowDirector.gameLayer.deskLayer.refreshPukerCount();
		}
	});
//TODO
//底部ui（话，讲，排名，血量）
var BottomLayer = cc.Layer.extend(
	{
		ctor:function()
		{
			this._super();
			this.zinit();
			this.addBottomUI();
		},
		zinit:function()
		{
			this.ui = ccs.load("res/landlord/cocosOut/BottomLayer.json").node;
			this.ui.setPosition(winSize.width - this.ui.width >> 1, -2);
			this.addChild(this.ui);
			this.offset = (this.ui.getContentSize().width * winSize.height / 640 - winSize.width) / 2;
			this.ui.x -= this.offset;
		},
		//底部ui（话，讲，排名，血量）
		addBottomUI:function()
		{
			this.controlBg = ccui.helper.seekWidgetByName(this.ui, "controlBg");
			this.controlBg.x += this.offset*2;
			this.playerGoldNum = ccui.helper.seekWidgetByName(this.ui, "playerGoldNum");
			this.chatBtn = ccui.helper.seekWidgetByName(this.ui, "chatBtn");
			this.buyGoldBtn = ccui.helper.seekWidgetByName(this.ui, "buyGoldBtn");

			this.chatBtn.addTouchEventListener(this.chatBtnEvent,this);
			this.buyGoldBtn.addTouchEventListener(this.buyGoldBtnEvent,this);
		},
		chatBtnEvent:function(target, state)
		{
			if ( state == ccui.Widget.TOUCH_ENDED )
			{
				var pop = new popUpTalkDialog(this);
				pop.addToNode(cc.director.getRunningScene());
				sparrowDirector.gameLayer.talkDialog = pop;
			}
		},
		buyGoldBtnEvent:function(target, state)
		{
			if ( state == ccui.Widget.TOUCH_ENDED )
			{

			}
		}
	});

//TODO
//命令层
var OrderLayer = cc.Layer.extend(
	{
		ctor:function()
		{
			this._super();
			this.setVariable();
			this.zinit();
			this.addUI();
		},
		setVariable:function()
		{
			this.orderType = 0;
			//提示数据计数
			this.tipCount = 0;
			this.mm = 0;
			this.nn = 0;
		},
		zinit:function()
		{
			this.ui = ccs.load("res/landlord/cocosOut/OrderLayer.json").node;
			//this.ui.scale = 0.8;
			this.ui.setPosition(winSize.width-this.ui.width*this.ui.scaleX>>1, winSize.height/2 - 35);
			this.addChild(this.ui, 0);
			this.ui.visible = false;
			this.startBtn = ccui.Button.create("","","",ccui.Widget.PLIST_TEXTURE);
			//this.startBtn.scale = 0.8;
			this.startBtn.setPosition(winSize.width/2, this.ui.y+1000);
			this.startBtn.visible = false;
			this.addChild(this.startBtn, 10);
			this.startBtn.addTouchEventListener(this.startGameEvent, this);
		},
		//准备，开始游戏
		startGameEvent:function(target, state)
		{
			if ( state == ccui.Widget.TOUCH_ENDED )
			{
				LandCEMusic.playBtnEffect();
				sparrowDirector.SendUserReady();
				target.visible = false;
				sparrowDirector.gameLayer.pukerLayer.resetData();
				sparrowDirector.gameData.isReadied = true;
				sparrowDirector.gameLayer.countDownLayer.hideClock();
				if (sparrowDirector.gameLayer.playerLayer.getChildByTag(100))
				{
					sparrowDirector.gameLayer.playerLayer.getChildByTag(100).remainCard.setString(0);
				}
				if (sparrowDirector.gameLayer.playerLayer.getChildByTag(200))
				{
					sparrowDirector.gameLayer.playerLayer.getChildByTag(200).remainCard.setString(0);
				}
				if (sparrowDirector.gameLayer.playerLayer.getChildByTag(300))
				{
					sparrowDirector.gameLayer.playerLayer.getChildByTag(300).remainCard.setString(0);
				}
			}
		},
		//显示
		showView:function()
		{
			this.ui.visible = true;
			//var btnArr = [];
			//this.btn2.visible = false;
			//var arr = [this.btn0, this.btn2, this.btn1, this.btn3];
			//for ( var i = 0; i < arr.length; i++ )
			//{
			//	var btn = arr[i];
			//	if( btn.visible )
			//	{
			//		btnArr.push(btn);
			//	}
			//}
			//var gap = 100;
			//var len = btnArr.length;
			//for ( var i = 0; i < btnArr.length; i++ )
			//{
			//	btnArr.x = winSize.width/2 - gap*(len-1)/2 + gap*(i)+10;
			//}

		},
		//隐藏
		hideView:function()
		{
			this.ui.visible = false;
		},
		addUI:function()
		{
			/*
			 * 0不出，一分
			 * 1提示，二分
			 * 2重选，三分
			 * 3出牌，不叫
			 */
			this.layer_callStore = ccui.helper.seekWidgetByName(this.ui, "layer_callStore");
			for ( var i = 0; i < 4; i++ )
			{
				this["btn_callStore" + i] = ccui.helper.seekWidgetByName(this.layer_callStore, "btn"+i);
				this["btn_callStore" + i].name = i;
				this["btn_callStore" + i].addTouchEventListener(this.orderEvent, this);
			}
			this.layer_outCard = ccui.helper.seekWidgetByName(this.ui, "layer_outCard");
			for ( var i = 0; i < 4; i++ )
			{
				this["btn_outCard" + i] = ccui.helper.seekWidgetByName(this.layer_outCard, "btn"+i);
				this["btn_outCard" + i].name = i;
				this["btn_outCard" + i].addTouchEventListener(this.orderEvent, this);
			}
		},
		/**
		 * 启动叫分
		 * 显示叫分信息
		 * {"type":"CMD_S_CallScore","wCurrentUser":2,"wCallScoreUser":1,"cbCurrentScore":0,"cbUserCallScore":-1}
		 */
		startCallScore:function(direction, data)
		{
			sparrowDirector.gameLayer.countDownLayer.startCountDown(direction);
			if ( direction == sparrowDirector.gameData.myChairIndex )
			{
				this.refreshTextures(0);
				if(!data){return;}
				if ( data.cbCurrentScore == 1 )
				{
					this.btn_callStore0.loadTextures("but_desk_gray.png","but_desk_gray.png","",ccui.Widget.PLIST_TEXTURE);
					this.btn_callStore0.setTouchEnabled(false);
					ccui.helper.seekWidgetByName(this.btn_callStore0, "text").setFntFile("res/landlord/cocosOut/fnt/desk_gray_btn.fnt");;
				}
				else if ( data.cbCurrentScore == 2 )
				{
					this.btn_callStore0.loadTextures("but_desk_gray.png","but_desk_gray.png","",ccui.Widget.PLIST_TEXTURE);
					this.btn_callStore0.setTouchEnabled(false);
					ccui.helper.seekWidgetByName(this.btn_callStore0, "text").setFntFile("res/landlord/cocosOut/fnt/desk_gray_btn.fnt");;
					this.btn_callStore2.loadTextures("but_desk_gray.png","but_desk_gray.png","",ccui.Widget.PLIST_TEXTURE);
					this.btn_callStore2.setTouchEnabled(false);
					ccui.helper.seekWidgetByName(this.btn_callStore2, "text").setFntFile("res/landlord/cocosOut/fnt/desk_gray_btn.fnt");;
				}
				sparrowDirector.gameLayer.orderLayer.checkAutoAi(direction);
			}
		},
		refreshTextures:function(orderType)
		{
			this.showView();
			this.orderType = orderType;
			if ( this.orderType == 0 )
			{
				this.btn_callStore0.setTouchEnabled(true);
				this.btn_callStore1.setTouchEnabled(true);
				this.btn_callStore2.setTouchEnabled(true);
				this.btn_callStore3.setTouchEnabled(true);
				this.layer_callStore.visible = true;
				this.layer_outCard.visible = false;
			}
			else
			{
				this.btn_outCard0.setTouchEnabled(true);
				this.btn_outCard1.setTouchEnabled(true);
				this.btn_outCard2.setTouchEnabled(true);
				this.btn_outCard3.setTouchEnabled(true);
				this.btn_outCard0.loadTextures("but_desk_green.png","but_desk_green.png","",ccui.Widget.PLIST_TEXTURE);
				ccui.helper.seekWidgetByName(this.btn_outCard0, "text").setFntFile("res/landlord/cocosOut/fnt/desk_green_btn.fnt");

				var pukerArr01 = sparrowDirector.gameLayer.pukerLayer.pukerArr01;
				var bool = this.jugementOutPuker();
				if ( !bool )
				{
					this.showTipinfo(true);//智能检测是否有能大过上家的牌
				}
				this.checkDizuAndLastPuker();
				this.layer_callStore.visible = false;
				this.layer_outCard.visible = true;
			}
		},
		orderEvent:function(target, state)
		{
			if ( state == ccui.Widget.TOUCH_ENDED )
			{
				LandCEMusic.playBtnEffect();
				switch ( Number(target.name) )
				{
					case 0://不出，一分
					{
						this.orderEvent01();
						break;
					}

					case 1://提示，二分
					{
						this.orderEvent02();
						break;
					}
					case 2://重选，三分
					{
						this.orderEvent03();
						break;
					}
					case 3://出牌，不叫
					{
						this.orderEvent04();
						break;
					}
					default:
						break;
				}
			}
		},
		//不出
		orderEvent01:function()
		{
			//叫分－一分
			if ( this.orderType == 0 )
			{
				sparrowDirector.sendCallScore(1);
			}
			else//玩牌过程－不出
			{
				//防止倒计时最后一秒自动和手动重复放弃
				if ( sparrowDirector.gameData.isPassedPuker )
				{
					sparrowDirector.gameData.isPassedPuker = false;
					return;
				}
				sparrowDirector.gameData.isPassedPuker = true;

				if ( Is_LAIZI_ROOM() )
				{
					sparrowDirector.sendPassCardLaizi();
				}
				else if ( Is_HAPPY_ROOM() )
				{
					lm.log("欢乐场  放弃出牌 手动点击");
					sparrowDirector.sendPassCard_happy();
				}
				else
				{
					sparrowDirector.sendPassCard ();
				}
				sparrowDirector.gameLayer.pukerLayer.reLayoutPuker();
				sparrowDirector.gameLayer.countDownLayer.hideClock();
			}
			this.hideView();
		},
		//提示
		orderEvent02:function()
		{
			//叫分－二分
			if ( this.orderType == 0 )
			{
				sparrowDirector.sendCallScore(3);
				this.hideView();
			}
			else//玩牌过程－提示
			{
				this.showTipinfo();
			}
		},
		//重选
		orderEvent03:function()
		{
			//叫分－三分
			if ( this.orderType == 0 )
			{
				sparrowDirector.sendCallScore(2);
				this.hideView();
			}
			else//玩牌过程－重选
			{
				var arr = sparrowDirector.gameLayer.pukerLayer.pukerArr01;
				sparrowDirector.gameLayer.pukerLayer.reLayoutPuker();
				sparrowDirector.gameLayer.orderLayer.setOutPukerBtnEnable();
				cc.log("玩牌过程");
			}
		},
		//出牌
		orderEvent04:function(pukerData)
		{
			this.hideView();
			//叫分－不叫
			if ( this.orderType == 0 )
			{
				sparrowDirector.sendCallScore(0);
			}
			else//玩牌过程－出牌
			{
				sparrowDirector.gameData01.isDragOut = false;
				//清除托管判断数组
				sparrowDirector.gameData01.tuoGuanArr.splice(0);
				if ( sparrowDirector.gameData.isOuteredPuker )
				{
					return;
				}

				var arr01 = sparrowDirector.gameLayer.pukerLayer.pukerArr01;
				var arr02 = sparrowDirector.gameLayer.pukerLayer.pukerArr04;
				var s_data = sparrowDirector.gameData.oTherPuker;//上家出牌数据
				for ( var i = 0; i < arr02.length; i++ )
				{
					arr02[i].removeFromParent();
				}
				arr02.splice(0);
				if ( pukerData && pukerData[0]&&pukerData[0].sortNumber)
				{
					arr01 = pukerData;
				}
				//扑克原始数据
				if ( Is_LAIZI_ROOM() )
				{
					var temp01 = [];
					for ( var i = 0; i < arr01.length; i++ )
					{
						if ( !arr01[i].posNomal )
						{
							temp01.push(arr01[i].sortNumber);
						}
					}
					var resultLaiziData = gameLogic.handleOutPuker(temp01);
					var resultOriginData = temp01;
					lm.log("resultlaizidata=========== "+JSON.stringify(resultLaiziData));
					lm.log("resultOriginData=========== "+JSON.stringify(resultOriginData));

					if ( resultLaiziData.length > 1 && s_data.length < 1)
					{
						sparrowDirector.gameData.isLaiziThreeByTwo = true;
						this.handleLaiziOutPuker(arr02, resultLaiziData,resultOriginData);
						(function()
						{
							for ( var i = 0;i < arr01.length; i++ )
							{
								if ( !arr01[i].posNomal )
								{
									arr01[i].removeFromParent();
									arr01.splice(i, 1);
									arguments.callee();
								}
							}
						})();
						return;
					}
					else
					{
						resultLaiziData = resultLaiziData[0];
						for ( var i = 0;i < resultLaiziData.length; i++ )
						{
							var item = new GameCard();
							item.createPuker(resultLaiziData[i], true);
							item.setPosition(Control_pos.center.x+(i+2)-item.width*item.scale/2, Control_pos.center.y - 60);
							arr02.push(item);
						}
					}

				}
				else if ( Is_HAPPY_ROOM() )
				{
					for ( var i = 0;i < arr01.length; i++ )
					{
						if ( !arr01[i].posNomal )
						{
							var item = new GameCard();
							item.createPuker(arr01[i].sortNumber, true);
							item.setPosition(Control_pos.center.x+(i+2)-item.width*item.scale/2, Control_pos.center.y - 60);
							arr02.push(item);
						}
					}
				}
				else
				{
					for ( var i = 0;i < arr01.length; i++ )
					{
						if ( !arr01[i].posNomal )
						{
							var item = new GameCard();
							item.createPuker(arr01[i].sortNumber, true);
							item.setPosition(Control_pos.center.x+(i+2)-item.width*item.scale/2, Control_pos.center.y - 60);
							arr02.push(item);
						}
					}
				}

				if  ( !pukerData || !pukerData[0] || !pukerData[0].sortNumber)
				{
					(function()
					{
						for ( var i = 0;i < arr01.length; i++ )
						{
							if ( !arr01[i].posNomal )
							{
								arr01[i].removeFromParent();
								arr01.splice(i, 1);
								arguments.callee();
							}
						}
					})();
				}
				sparrowDirector.gameData.oTherPuker.splice(0);
				sparrowDirector.gameLayer.pukerLayer.outPuker(sparrowDirector.gameData.myChairIndex,null, resultLaiziData, resultOriginData);
				sparrowDirector.gameLayer.countDownLayer.hideClock();
				cc.log("玩牌过程");
			}
		},
		handleLaiziOutPuker:function(arr02, resultLaiziData, resultOriginData)
		{
			var temp = resultLaiziData;
			this.selectPukerTypeEvent = function(target, state)
			{
				if ( state == ccui.Widget.TOUCH_ENDED )
				{
					cc.log("target========= "+target.row);
					cc.log("resultLaiziData[target.row]========= "+resultLaiziData[target.row]);

					var outData = resultLaiziData[target.row]
					for ( var i = 0;i < outData.length; i++ )
					{
						var item = new GameCard();
						item.createPuker(outData[i], true);
						item.setPosition(Control_pos.center.x+(i+2)-item.width*item.scale/2, Control_pos.center.y - 60);
						arr02.push(item);
					}
					sparrowDirector.gameData.isLaiziThreeByTwo = false;
					sparrowDirector.gameData.oTherPuker.splice(0);
					sparrowDirector.gameLayer.pukerLayer.outPuker(sparrowDirector.gameData.myChairIndex,null, resultLaiziData[target.row], resultOriginData);
					sparrowDirector.gameLayer.sePukerLayer.removeAllChildren();
				}

			}
			for ( var i = 0; i < temp.length; i++ )
			{
				var item = temp[i];
				for ( var j = 0; j < item.length; j++ )
				{
					var card = new GameCard();
					card.createPuker(item[j]);
					card.scale = 0.7;
					card.showDiZhuTag(false);
					sparrowDirector.gameLayer.sePukerLayer.addChild(card,i);
					card.pukerColor.row = i;
					card.x = winSize.width/2 + (card.width*card.scale-80*card.scale)*j - (card.width*card.scale-80*card.scale)*item.length/2 - 20*card.scale;
					card.y = winSize.height/3 - i*60*card.scale;
					card.pukerColor.addTouchEventListener(this.selectPukerTypeEvent, this);
				}
			}
			sparrowDirector.gameLayer.sePukerLayer.data = {index:sparrowDirector.gameData.myChairIndex,rD:resultLaiziData[0],rod:resultOriginData};
		},
		setOutPukerBtnEnable:function()
		{
			var bool = this.jugementOutPuker();
			if ( !bool )
			{
				this.btn_outCard3.loadTextures("but_desk_gray.png","but_desk_gray.png","",ccui.Widget.PLIST_TEXTURE);
				this.btn_outCard3.setTouchEnabled(false);
				ccui.helper.seekWidgetByName(this.btn_outCard3, "text").setFntFile("res/landlord/cocosOut/fnt/desk_gray_btn.fnt");
			}
			else
			{
				this.btn_outCard3.loadTextures("but_desk_red.png","but_desk_red.png","",ccui.Widget.PLIST_TEXTURE);
				this.btn_outCard3.setTouchEnabled(true);
				ccui.helper.seekWidgetByName(this.btn_outCard3, "text").setFntFile("res/landlord/cocosOut/fnt/desk_red_btn.fnt");
			}
		},
		//判断是否可以出牌
		jugementOutPuker:function(pukerData)
		{
			//检测是否有选中的扑克，没有则出牌按钮不能点击
			var arr = sparrowDirector.gameLayer.pukerLayer.pukerArr01, data = [], count = 0;
			var s_data = sparrowDirector.gameData.oTherPuker;//上家出牌数据
			if ( s_data.length > 0 )
			{
				sparrowDirector.gameData.isPlayerOut = false;
			}
			else
			{
				sparrowDirector.gameData.isPlayerOut = true;
			}
			cc.log("----------------------------sparrowDirector.gameData.isPlayerOut =  "+sparrowDirector.gameData.isPlayerOut+"  s_data.length= "+s_data.length )
			if ( pukerData )
			{
				for ( var i = 0; i < pukerData.length; i++ )
				{
					data.push(pukerData[i].sortNumber);
					count++;
				}
			}
			else
			{
				for ( var i = 0; i < arr.length; i++ )
				{
					if ( !arr[i].posNomal )
					{
						data.push(arr[i].sortNumber);
						count++;
					}
				}
			}

			//检测所选牌是否符合出牌类型
			cc.log("s_data.length= "+s_data.length+"  "+JSON.stringify(s_data));

			if ( s_data.length > 0 )
			{
				var type = gameLogic.getType(s_data);
				if ( Is_LAIZI_ROOM() )
				{
					data = gameLogic.handleOutPuker(data);
					data = data[0];
				}
				cc.log("data.length================ "+"  "+JSON.stringify(data));
				var type_select = gameLogic.getType(data);

				if ( type_select == CT_BOME_CARD || type_select == CT_MISSILE_CARD )
				{
					if ( type_select == CT_BOME_CARD )
					{
						return gameLogic.jugementData(data, s_data, type, type_select);
					}
					return true;
				}
				else if ( type != type_select )
				{
					return false;
				}
				return gameLogic.jugementData(data, s_data, type);
			}
			else
			{
				this.btn_outCard0.loadTextures("but_desk_gray.png","but_desk_gray.png","",ccui.Widget.PLIST_TEXTURE);
				this.btn_outCard0.setTouchEnabled(false);
				ccui.helper.seekWidgetByName(this.btn_outCard0, "text").setFntFile("res/landlord/cocosOut/fnt/desk_gray_btn.fnt");
				var type_select = gameLogic.getType(data);
				if ( type_select < 1 )
				{
					return false;
				}
			}
			if ( count < 1 )
			{
				return false;
			}
			return true;
		},
		//点击单张牌时，判断是否可以出牌
		jugementOutPukerSgleClick:function()
		{
			//检测是否有选中的扑克，没有则出牌按钮不能点击
			var arr = sparrowDirector.gameLayer.pukerLayer.pukerArr01, data = [], count = 0;
			var s_data = sparrowDirector.gameData.oTherPuker;//上家出牌数据
			if ( s_data.length > 0 )
			{
				sparrowDirector.gameData.isPlayerOut = false;
			}
			else
			{
				sparrowDirector.gameData.isPlayerOut = true;
			}
			for ( var i = 0; i < arr.length; i++ )
			{
				if ( !arr[i].posNomal )
				{
					data.push(arr[i].sortNumber);
					count++;
				}
			}
			if ( s_data.length > 0 )
			{
				var type = gameLogic.getType(s_data);
				if ( Is_LAIZI_ROOM() )
				{
					data = gameLogic.handleOutPuker(data);
					data = data[0];
				}
				var type_select = gameLogic.getType(data);

				if ( type_select == CT_BOME_CARD || type_select == CT_MISSILE_CARD )
				{
					if ( type_select == CT_BOME_CARD )
					{
						return gameLogic.jugementData(data, s_data, type, type_select);
					}
					return true;
				}
				else if ( type != type_select )
				{
					return false;
				}
				return gameLogic.jugementData(data, s_data, type);
			}
			if ( count < 1 )
			{
				return false;
			}
			return true;
		},

		/**
		 * 提示处理
		 * @param isJugement bool 是否智能判断
		 * @param huadongData bool 是否根据滑动选出牌去判断
		 */
		showTipinfo:function(isJugement,huadongData)
		{
			var arr = sparrowDirector.gameLayer.pukerLayer.pukerArr01, data = [];
			if ( huadongData )
			{
				arr = huadongData;
			}
			if ( !isJugement )
			{
				sparrowDirector.gameLayer.pukerLayer.reLayoutPuker();
			}
			for ( var i = 0; i < arr.length; i++ )
			{
				data.push(arr[i].sortNumber);
			}
			var s_data = sparrowDirector.gameData.oTherPuker;//上家出牌数据
			//玩家自己出牌
			if ( s_data.length < 1 )
			{
				if ( isJugement )
				{
					return;
				}
				var targetData = gameLogic.getRandomPuker();
				targetData.sort(function(a, b)
				{
					if ( a[0] && b[0] )
					{
						return a[0].value - b[0].value;
					}
					else
					{
						return 0;
					}
				});
				targetData.sort(function(a, b)
				{
					if ( a[0] && b[0] )
					{
						return a[0].sortTag - b[0].sortTag;
					}
					else
					{
						return 0;
					}
				});
				targetData.sort(function(a, b)
				{
					if ( a[0] && b[0] )
					{
						return a[0].laiziNum - b[0].laiziNum;
					}
					else
					{
						return 0;
					}
				});
				cc.log("targetData = "+JSON.stringify(targetData));
				if ( targetData[this.mm][this.nn] )
				{
					for ( var j = 0; j < targetData[this.mm][this.nn].length; j++ )
					{
						for ( var k = 0; k < arr.length; k++ )
						{
							if ( arr[k].sortNumber == targetData[this.mm][this.nn][j].sortNumber )
							{
								arr[k].selectedCard();
								break;
							}
						}
					}
					this.nn++;
					if ( this.nn >= targetData[this.mm].length )
					{
						this.mm++;
						this.nn = 0;
					}
					if ( this.mm >= targetData.length )
					{
						this.mm = 0;
						this.nn = 0;
					}
				}
				else
				{
					this.mm = 0;
					this.nn = 0;
				}
			}
			else
			{
				var type = gameLogic.getType (s_data);
				cc.log ("type========= " + type);
				//没有可出牌
				if (type < 1)
				{
					sparrowDirector.gameLayer.deskLayer.showTxtTipImage();
					sparrowDirector.gameLayer.orderLayer.orderEvent01();
					return;
				}
				var targetData = gameLogic.getCardForType (data, s_data, type);
				cc.log ("targetdATA.length111=  " + targetData.length+"  "+JSON.stringify(targetData));
				targetData.sort(function(a, b)
				{
					if ( a[0] && b[0] )
					{
						return a[0].value - b[0].value;
					}
					else
					{
						return 0;
					}
				});
				targetData.sort(function(a, b){return a.length - b.length;});
				targetData.sort(function(a, b)
				{
					if ( a[0] && b[0] )
					{
						return a[0].sortTag - b[0].sortTag;
					}
					else
					{
						return 0;
					}
				});
				targetData.sort(function(a, b)
				{
					if ( a[0] && b[0] )
					{
						return a[0].laiziNum - b[0].laiziNum;
					}
					else
					{
						return 0;
					}
				});

				if (targetData.length < 1)
				{
					if ( isJugement )
					{
						sparrowDirector.gameLayer.deskLayer.showTxtTipImage();
						return;
					}
					sparrowDirector.gameLayer.orderLayer.orderEvent01();
					sparrowDirector.gameLayer.orderLayer.hideView ();
					return;
				}
				if ( isJugement )
				{
					return;
				}
				var len = targetData.length;
				if (!Is_LAIZI_ROOM())
				{
					for (var j = 0; j < targetData[this.tipCount].length; j++)
					{
						for (var i = 0; i < arr.length; i++)
						{
							if (targetData[this.tipCount][j].sortNumber && arr[i].sortNumber == targetData[this.tipCount][j].sortNumber)
							{
								arr[i].selectedCard ();
								break;
							}
						}
					}
				}
				else
				{
					var that = this;
					var laizi = gameLogic.getLaiziNumber(targetData[this.tipCount]);
					cc.log("laizi================= "+JSON.stringify(laizi));
					sparrowDirector.gameData.targetData = DataUtil.copyJson(targetData[that.tipCount]);
					var currentLNum = 0;
					if (!targetData[that.tipCount])
					{
						cc.log("targetData[that.tipCount]无效拉拉拉拉拉拉拉拉拉拉拉拉拉拉");
						return;
					}
					for ( var j = 0; j < targetData[that.tipCount].length; j++ )
					{
						if ( laizi.count > 0 )
						{
							if ( targetData[that.tipCount][j].value == laizi.laizi.value )
							{
								currentLNum++;
								continue;
							}
						}
						for ( var i = 0; i < arr.length; i++ )
						{
							if ( arr[i].sortNumber == targetData[that.tipCount][j].sortNumber )
							{
								arr[i].selectedCard();
							}
						}
					}
					//将玩家癞子牌选出来
					if ( laizi.count > 0 )
					{
						var temp = [];
						for ( var i = 0; i < arr.length; i++ )
						{
							if ( arr[i].sortNumber01 == laizi.laizi.value )
							{
								temp.push(arr[i]);
							}
						}
						for ( var j = 0; j < currentLNum; j++ )
						{
							temp[j].selectedCard();
						}
					}
				}

				this.tipCount++;
				if ( this.tipCount >= len )
				{
					this.tipCount = 0;
				}
			}
			sparrowDirector.gameLayer.orderLayer.setOutPukerBtnEnable();
		},
		//智能选牌功能
		intelligenceTipPuker:function(arr)
		{
			var pukerArr01 = sparrowDirector.gameLayer.pukerLayer.pukerArr01;
			for ( var i = 0; i < pukerArr01.length; i++ )
			{
				if ( !pukerArr01[i].posNomal )
				{
					pukerArr01[i].selectedCard();
				}
			}
			var targetData = gameLogic.getRandomPuker(arr);
			lm.log("targetData======== "+JSON.stringify(targetData));

			targetData.sort(function(a, b)
			{
				if ( a[0] && b[0] )
				{
					return a[0][0].value - b[0][0].value;
				}
				else
				{
					return 0;
				}
			});
			targetData.sort(function(a, b)
			{
				if ( a[0] && b[0] )
				{
					return a[0][0].sortTag - b[0][0].sortTag;
				}
				else
				{
					return 0;
				}
			});

			if ( Is_LAIZI_ROOM() )
			{
				targetData.sort(function(a, b)
				{
					if ( a[0] && b[0] )
					{
						return a[0][0].laiziNum - b[0][0].laiziNum;
					}
					else
					{
						return 0;
					}
				});
				var laizi = gameLogic.getLaiziNumber(targetData[0][0]);
				var currentLNum = 0;
				for ( var j = 0; j < targetData[0][0].length; j++ )
				{
					if ( laizi.count > 0 )
					{
						if ( targetData[0][0][j].value == laizi.laizi.value )
						{
							currentLNum++;
							continue;
						}
					}
					for ( var i = 0; i < arr.length; i++ )
					{
						if ( arr[i].sortNumber == targetData[0][0][j].sortNumber )
						{
							arr[i].selectedCard();
						}
					}
				}
				//将玩家癞子牌选出来
				if ( laizi.count > 0 )
				{
					var temp = [];
					for ( var i = 0; i < arr.length; i++ )
					{
						if ( arr[i].sortNumber01 == laizi.laizi.value )
						{
							temp.push(arr[i]);
						}
					}
					for ( var j = 0; j < currentLNum; j++ )
					{
						temp[j].selectedCard();
					}
				}
			}
			else
			{
				for ( var j = 0; j < targetData[0][0].length; j++ )
				{
					for ( var k = 0; k < arr.length; k++ )
					{
						if ( arr[k].sortNumber == targetData[0][0][j].sortNumber )
						{
							arr[k].selectedCard();
							break;
						}
					}
				}
			}
		},
		//检测托管
		checkAutoAi:function()
		{
			if ( sparrowDirector.gameData.isAutoAi )
			{
				var s_data = sparrowDirector.gameData.oTherPuker;//上家出牌数据
				if ( s_data.length > 0 )
				{
					this.scheduleOnce(function()
					{
						//if ( Is_LAIZI_ROOM() )
						//{
						//	sparrowDirector.sendPassCardLaizi();
						//}
						//else
						//{
						//	sparrowDirector.sendPassCard ();
						//}
						sparrowDirector.gameLayer.orderLayer.orderEvent01();
						sparrowDirector.gameLayer.orderLayer.hideView();
					}, 2);
				}
				else
				{
					this.scheduleOnce(function()
					{
						sparrowDirector.gameLayer.orderLayer.hideView();
						if(Is_HAPPY_ROOM())
						{
							if(sparrowDirector.gameData.happyRoomState == HappyRoomState.callLand)	//叫地主阶段
							{
								sparrowDirector.sendNoCallBanker_happy();
								return;
							}
							else if(sparrowDirector.gameData.happyRoomState == HappyRoomState.robLand)	//抢地主阶段
							{
								sparrowDirector.sendNoRodBanker_happy();
								return;
							}
						}
						else
						{
							if ( sparrowDirector.gameData.isCallScore )
							{
								//不叫分
								sparrowDirector.sendCallScore(0);
								cc.log("----------------------------------------1")
								return;
							}
							if ( sparrowDirector.gameData.isCallBankerState )
							{
								//不叫地主
								sparrowDirector.sendCallBanker(2);
								sparrowDirector.gameLayer.orderLaiziLayer.hideView();
								cc.log("----------------------------------------2")
								return;
							}
							if ( sparrowDirector.gameData.isRodBankerState )
							{
								//不强地主
								sparrowDirector.gameLayer.orderLaiziLayer.hideView();
								cc.log("----------------------------------------3")
								sparrowDirector.sendRodBanker(2);
								return;
							}
							if ( sparrowDirector.gameData.isDoubledState )
							{
								//不加倍
								sparrowDirector.gameLayer.orderLaiziLayer.hideView();
								sparrowDirector.sendDouble(2);
								cc.log("----------------------------------------4")
								return;
							}
						}
						sparrowDirector.gameLayer.countDownLayer.autoOutPuker();
					}, 2);
				}
			}
		},
		//检测是否最后一张牌，且玩家未地主
		checkDizuAndLastPuker:function()
		{
			var child = sparrowDirector.gameLayer.playerLayer.getChildByTag(100);
			var puker = sparrowDirector.gameLayer.pukerLayer.pukerArr01;
			if ( child && puker.length == 1 && child.isDizhu )
			{
				this.showTipinfo();
				if ( this.jugementOutPuker() )
				{
					//lm.log("检测是否最后一张牌，且玩家未地主")
					this.scheduleOnce(this.orderEvent04, 0.1);
				}
			}
		}
	});

//TODO
//触摸层，用于滑动选牌（多选）
var TouchLayer = ccui.Layout.extend(
	{
		ctor:function()
		{
			this._super();
			this.setVariable();
			this.zinit();
			this.addTouchEventListener(this.touchEvent, this);
		},
		setVariable:function()
		{
			this.pukerArr  = [];
			this.originPos = cc.p(0, 0);
			this.endPos    = cc.p(0, 0);
			this.movePos   = cc.p(0, 0);
			this.selectedPuker = [];//当前选中的扑克列表
			this.targetOffset = 230;
			this.isSelecting  = true;
			this.offsetXRight = 0;
			this.offsetXLeft  = winSize.width;
			this.currentSelectedSinglePuker = null;
		},
		zinit:function()
		{
			this.setTouchEnabled(true);
			this.size = cc.size(winSize.width, 250);
			this.setContentSize(this.size);
			this.setSwallowTouches(false);

			var cl = cc.LayerColor.create(cc.color(255, 0, 0, 100), this.size.width, this.size.height);
//		this.addChild(cl);

		},
		//刷新玩家手牌数组
		refreshPukerArr:function()
		{
			this.pukerArr  = sparrowDirector.gameLayer.pukerLayer.pukerArr01;
			var len = this.pukerArr.length;
			if ( len > 0 )
			{
				this.offsetXLeft  = this.pukerArr[0].x-50;
				this.offsetXRight = this.pukerArr[len-1].x+this.pukerArr[len-1].width;
			}
		},
		touchEvent:function(target, state)
		{
			if ( !sparrowDirector.gameData.isCanOutPuker )
			{
				var child = sparrowDirector.gameLayer.dragPukerLayer.getChildren();
				if ( child < 1 )
				{
					return;
				}
			}
			if ( state == ccui.Widget.TOUCH_BEGAN )
			{
				this.refreshPukerArr();
				this.originPos = this.getTouchBeganPosition();
				this.startHandlePukerMove(this.originPos, this.originPos);
				//拖动出牌逻辑
				this.startPos = this.getTouchBeganPosition();
			}
			else if ( state == ccui.Widget.TOUCH_MOVED )
			{
				this.movePos = this.getTouchMovePosition();
				var child = sparrowDirector.gameLayer.dragPukerLayer.getChildren();
				if ( child == 0 )
				{
					this.startHandlePukerMove(this.originPos, this.movePos);
				}
				//拖动出牌逻辑
				if (child.length > 0 ||this.movePos.y > this.targetOffset || this.movePos.x > this.offsetXRight || this.movePos.x < this.offsetXLeft)
				{
					this.isSelecting = false;
					var dragLayer = sparrowDirector.gameLayer.dragPukerLayer;
					var pos01 = target.getTouchMovePosition();
					var xOffset = -this.startPos.x + pos01.x;
					var yOffset = -this.startPos.y + pos01.y;
					dragLayer.setPosition(dragLayer.x+xOffset,dragLayer.y+yOffset);
					this.addPukerToDragLayer(this.selectedPuker,cc.p(this.movePos.x-dragLayer.x,this.movePos.y));
					this.startPos = pos01;
				}
			}
			else if ( state == ccui.Widget.TOUCH_ENDED || state == ccui.Widget.TOUCH_CANCELED )
			{
				this.endPos = this.getTouchEndPosition();
				this.refreshPukerArr();
				this.startHandlePuker(this.originPos, this.endPos);
				//叫分过程中不做判断
				if ( !sparrowDirector.gameData.isCallScore )
				{
					sparrowDirector.gameLayer.orderLayer.setOutPukerBtnEnable();
				}
				for ( var i = 0; i < this.pukerArr.length; i++ )
				{
					this.pukerArr[i].showBlackLayer(false, 1);
				}
				//拖动出牌
				var child = sparrowDirector.gameLayer.dragPukerLayer.getChildren();
				if (child.length > 0)
				{
					if ( !sparrowDirector.gameData01.isDragOut )
					{
						this.addPukerToPlayer(this.selectedPuker);
					}
					else
					{
						var bool = sparrowDirector.gameLayer.orderLayer.jugementOutPuker(this.selectedPuker);
						lm.log("----------bool--------"+bool+"------"+JSON.stringify(this.selectedPuker));
						if ( bool  && this.endPos.y > this.targetOffset)
						{
							for ( var i = 0; i < this.selectedPuker.length; i++ )
							{
								this.selectedPuker[i].posNomal = false;
							}
							sparrowDirector.gameLayer.orderLayer.orderEvent04(this.selectedPuker);
						}
						else
						{
							this.addPukerToPlayer(this.selectedPuker);
						}
					}

					this.selectedPuker.splice(0);
				}
				sparrowDirector.gameLayer.dragPukerLayer.removeAllChildren();
				sparrowDirector.gameLayer.dragPukerLayer.setPosition(0,0);
				this.cancelPukerSelectedTag();
				this.isSelecting = true;
				sparrowDirector.gameLayer.orderLayer.setOutPukerBtnEnable();
			}
		},
		startHandlePukerMove:function(start, end)
		{
			var arr = [], startX = Math.min(start.x, end.x), endX = Math.max(start.x, end.x), gap = 55;
			for ( var i = 0; i < this.pukerArr.length; i++ )
			{
				var temp = this.pukerArr[i];
				gap = temp.scale*50;
				if ( start.y >= temp.y && start.y <= (temp.y + temp.height))
				{
					if ( end.y >= temp.y /*&& end.y <= (temp.y + temp.height)*/)
					{
						if ( (temp.x + gap) >= startX && (temp.x) <= endX )
						{
							temp.showBlackLayer(true);
							this.currentSelectedSinglePuker = temp;
						}
						else
						{
							temp.showBlackLayer(false);
						}
					}
					else
					{
						temp.showBlackLayer(false);
					}
				}
				else
				{
					temp.showBlackLayer(false);
				}
			}
			var child = sparrowDirector.gameLayer.dragPukerLayer.getChildren();
			if ( child.length > 0 ){return;}
			if ( end.y > this.targetOffset || end.x > this.offsetXRight || end.x < this.offsetXLeft)
			{
				for ( var i = 0; i < this.pukerArr.length; i++ )
				{
					if ( this.pukerArr[i].bgSprite.visible || !this.pukerArr[i].posNomal )
					{
						this.selectedPuker.push(this.pukerArr[i]);
					}
				}
			}
			var self = this;
			//清除重复项
			(function()
			{
				var pk = self.selectedPuker;
				for ( var i = 0; i < pk.length-1; i++ )
				{
					for ( var j = i+1; j < pk.length; j++ )
					{
						if ( pk[i].sortNumber == pk[j].sortNumber )
						{
							pk.splice(i,1);
							arguments.callee();
						}
					}
				}
			})();
		},
		startHandlePuker:function(start, end)
		{
			var arr = [], startX = Math.min(start.x, end.x), endX = Math.max(start.x, end.x), gap = 55;
			var len = this.pukerArr.length;
			if ( this.isSelecting )
			{
				for ( var i = 0; i < this.pukerArr.length; i++ )
				{
					var temp = this.pukerArr[i];
					gap = 50*temp.scale;
					if ( start.y >= temp.y && start.y <= (temp.y + temp.height))
					{
						if ( end.y >= temp.y && end.y <= (temp.y + temp.height))
						{
							if ( (temp.x + gap) >= startX && (temp.x) <= endX )
							{
								arr.push(temp);
							}
						}
					}
				}
			}

			this.makeUpPuker(arr);
		},
		makeUpPuker:function(arr)
		{
			(function()
			{
				var item = sparrowDirector.gameLayer.pukerLayer.pukerArr01;
				if ( item.length > 0 )
				{
					for ( var i = 0; i < arr.length; i++ )
					{
						var target = item[item.length - 1];
						if ( arr[i].sortNumber == target.sortNumber && arr.length < 2 )
						{
							arr.splice(i, 0);
							break;
						}
					}
					item[item.length - 1].isEventEnabled = true;
				}
			})();
			var length = sparrowDirector.gameData.oTherPuker.length;//上家出牌数据
			if ( arr.length < 1 )
			{
				return;
			}
			else if ( length > 0 )
			{

				var type = gameLogic.getType(sparrowDirector.gameData.oTherPuker);
				//接牌，滑动选牌只选择顺子，连对，飞机，炸弹
				if ( type == 4 || type == 5 || type == 6 || type == 11 )
				{
					this.smartShowTip(type,arr,length);
					return;
				}
				else if ( arr.length <= length && arr[0].posNomal)
				{
					this.smartShowTip(type,arr,length);
					return;
				}
			}

			for ( var i = 0; i < arr.length; i++ )
			{
				if ( length > 0 )
				{
					arr[i].selectedCard();
				}
				arr[i].showBlackLayer(false, 1);
			}
			if ( length < 1 )
			{
				var pukerArr01 = sparrowDirector.gameLayer.pukerLayer.pukerArr01, bool = false;
				for ( var i = 0; i < pukerArr01.length; i++ )
				{
					if ( !pukerArr01[i].posNomal )
					{
						bool = true;
					}
				}
				if ( !bool )
				{
					sparrowDirector.gameLayer.orderLayer.intelligenceTipPuker(arr);
				}
				else
				{
					for ( var i = 0; i < arr.length; i++ )
					{
						arr[i].selectedCard();
					}
				}
			}
		},
		addPukerToDragLayer:function(arr,pos)
		{
			var child = sparrowDirector.gameLayer.dragPukerLayer.getChildren();
			if ( child.length > 0 ){return;}
			var dragData = [];
			for ( var i = 0; i < arr.length; i++ )
			{
				dragData.push(arr[i].sortNumber);
			}

			var gap = 50;
			var card = new GameCard();
			gap = 50*0.7;
			for ( var i = 0; i < dragData.length; i++ )
			{
				var card = new GameCard();
				card.scale = 0.7;
				card.createPuker(dragData[i]);
				card.posNomal = false;
				card.x = /*winSize.width/2 - 60*/pos.x - 60 - gap*(dragData.length - 1 )/2 + gap*i;
				card.y = 50;//(50 - 40)*card.scale+50;
				card.setLocalZOrder(i);
				sparrowDirector.gameLayer.dragPukerLayer.addChild(card);
			}
			this.deletePukerFromPlayer(dragData);
		},
		getDragLayerPuker:function()
		{
			var temp = this.selectedPuker[this.selectedPuker.length-1];
			this.addPukerToPlayer([temp]);
			this.deletePukerFromDragLayer([temp]);
			return sparrowDirector.gameLayer.pukerLayer.pukerArr01;
		},
		//从玩家手牌中删除拖出的扑克列表
		deletePukerFromPlayer:function(dragData)
		{
			var puker = sparrowDirector.gameLayer.pukerLayer.pukerArr01;
			zfsLabel:
				for (var i = 0; i < dragData.length; i++ )
				{
					for ( var j = 0; j < puker.length; j++ )
					{
						if ( dragData[i] == puker[j].sortNumber )
						{
							puker[j].removeFromParent();
							puker.splice(j, 1);
							continue zfsLabel;
						}
					}
				}
			sparrowDirector.gameLayer.pukerLayer.reLayoutPuker();
		},
		//从拖动层删除一张扑克牌
		deletePukerFromDragLayer:function(puker)
		{
			var child = sparrowDirector.gameLayer.dragPukerLayer.getChildren();
			for ( var i = 0; i < child.length; i++ )
			{
				if ( child[i].sortNumber == puker[0].sortNumber )
				{
					child[i].removeFromParent();
					break;
				}
			}
			for ( var i = 0; i < this.selectedPuker.length; i++ )
			{
				if ( this.selectedPuker[i].sortNumber == puker[0].sortNumber )
				{
					this.selectedPuker.splice(i, 1);
				}
			}
		},
		//将拖出的扑克加到玩家扑克列表
		addPukerToPlayer:function(arr)
		{
			var puker = sparrowDirector.gameLayer.pukerLayer.pukerArr01;
			var dragData = [];
			for ( var i = 0; i < arr.length; i++ )
			{
				dragData.push(arr[i].sortNumber);
			}

			var card = new GameCard();
			for ( var i = 0; i < dragData.length; i++ )
			{
				var card = new GameCard();
				card.createPuker(dragData[i]);
				sparrowDirector.gameLayer.pukerLayer.addChild(card);
				puker.push(card);
			}
			sparrowDirector.gameLayer.pukerLayer.reLayoutPuker();
			for ( var i = 0; i < dragData.length; i++ )
			{
				for ( var j = 0; j < puker.length; j++ )
				{
					if ( puker[j].sortNumber == dragData[i] )
					{
						puker[j].selectedCard();
						break;
					}
				}
			}
		},
		//取消扑克选中状态
		cancelPukerSelectedTag:function()
		{
			var puker = sparrowDirector.gameLayer.pukerLayer.pukerArr01;
			for ( var i = 0; i < puker.length; i++ )
			{
				puker[i].showBlackLayer(false);
			}
		},
		/**
		 * 自动补全
		 * @param type 4, 5, 6
		 */
		smartShowTip:function(type, arr,length)
		{
			//this.showTouchTipinfo(arr,type);
			//return;
			var isContains = true;
			var count = 0;
			var currentData = [];
			//switch (type)
			//{
			//	case 4://顺子
					var allSun = gameLogic.getAllSunzi(type);
					if ( allSun.length > 0 && length > arr.length)
					{
						zfsLabel:
						for (var i = 0; i < allSun.length; i++ )
						{
							for ( var j = 0;  j < allSun[i].length; j++ )
							{
								var sunzi = allSun[i][j];
								count = 0;
								for ( var m = 0; m < arr.length; m++ )
								{
									for ( var n = 0; n < sunzi.length; n++ )
									{
										if ( arr[m].sortNumber01 == sunzi[n].value )
										{
											count++;
											//sunzi[n] = arr[m];
											if ( count == arr.length )
											{
												currentData = sunzi;
												break zfsLabel;
											}
										}
										else if ( n == sunzi.length - 1 )
										{
											isContains = false;
										}
									}
								}
							}
						}
						lm.log("current------------data------- "+JSON.stringify(currentData));
						if ( currentData.length > 0 )
						{
							var temp = [];
							var currentPuker = sparrowDirector.gameLayer.pukerLayer.pukerArr01;
							if ( type == 2 )//对牌单独处理
							{
								var index = 0;
								for ( var i = 0; i < currentPuker.length; i++ )
								{
									if ( this.currentSelectedSinglePuker.sortNumber == currentPuker[i].sortNumber )
									{
										temp.push(currentPuker[i]);
										index = i;
										break;
									}
								}
								if ( currentPuker[index-1] && currentPuker[index-1].sortNumber01 == this.currentSelectedSinglePuker.sortNumber01 )
								{
									temp.push(currentPuker[index-1]);
								}
								else
								{
									temp.push(currentPuker[index+1]);
								}
								this.showTouchTipinfo(temp,type);
							}
							else
							{
								for ( var i = 0; i < currentData.length; i++ )
								{
									for ( var j = 0; j < currentPuker.length; j++ )
									{
										if ( currentData[i].sortNumber == currentPuker[j].sortNumber )
										{
											temp.push(currentPuker[j]);
										}
									}
								}
							}
							this.showTouchTipinfo(temp,type);
							//this.showTouchTipinfo(currentData,type);
						}
						else
						{
							this.showTouchTipinfo(arr,type);
						}
					}
					else
					{
						this.showTouchTipinfo(arr,type);
					}

					//break;

				//case 5://连对
				//	var allSun = gameLogic.getAllDoubleSun(type);
				//	if ( allSun.length > 0 && length > arr.length)
				//	{
				//		zfsLabel:
				//			for (var i = 0; i < allSun.length; i++ )
				//			{
				//				for ( var j = 0;  j < allSun[i].length; j++ )
				//				{
				//					var sunzi = allSun[i][j];
				//					count = 0;
				//					for ( var m = 0; m < arr.length; m++ )
				//					{
				//						for ( var n = 0; n < sunzi.length; n++ )
				//						{
				//							if ( arr[m].sortNumber01 == sunzi[n].value )
				//							{
				//								count++;
				//								if ( count == arr.length )
				//								{
				//									currentData = sunzi;
				//									break zfsLabel;
				//								}
				//							}
				//							else if ( n == sunzi.length - 1 )
				//							{
				//								isContains = false;
				//							}
				//						}
				//					}
				//				}
				//			}
				//		lm.log("current------------data------- "+JSON.stringify(currentData));
				//		if ( currentData.length > 0 )
				//		{
				//			var temp = [];
				//			var currentPuker = sparrowDirector.gameLayer.pukerLayer.pukerArr01;
				//			for ( var i = 0; i < currentData.length; i++ )
				//			{
				//				for ( var j = 0; j < currentPuker.length; j++ )
				//				{
				//					if ( currentData[i].sortNumber == currentPuker[j].sortNumber )
				//					{
				//						temp.push(currentPuker[j]);
				//					}
				//				}
				//			}
				//			this.showTouchTipinfo(temp,type);
				//			//this.showTouchTipinfo(currentData,type);
				//		}
				//		else
				//		{
				//			this.showTouchTipinfo(arr,type);
				//		}
				//	}
				//	else
				//	{
				//		this.showTouchTipinfo(arr,type);
				//	}
				//	break;

				//case 6://飞机
				//	var allSun = gameLogic.getAllThreeByThree(type);
				//	if ( allSun.length > 0 && length > arr.length)
				//	{
				//		zfsLabel:
				//			for (var i = 0; i < allSun.length; i++ )
				//			{
				//				for ( var j = 0;  j < allSun[i].length; j++ )
				//				{
				//					var sunzi = allSun[i][j];
				//					count = 0;
				//					for ( var m = 0; m < arr.length; m++ )
				//					{
				//						for ( var n = 0; n < sunzi.length; n++ )
				//						{
				//							if ( arr[m].sortNumber01 == sunzi[n].value )
				//							{
				//								count++;
				//								if ( count == arr.length )
				//								{
				//									currentData = sunzi;
				//									break zfsLabel;
				//								}
				//							}
				//							else if ( n == sunzi.length - 1 )
				//							{
				//								isContains = false;
				//							}
				//						}
				//					}
				//				}
				//			}
				//		lm.log("current------------data------- "+JSON.stringify(currentData));
				//		if ( currentData.length > 0 )
				//		{
				//			var temp = [];
				//			var currentPuker = sparrowDirector.gameLayer.pukerLayer.pukerArr01;
				//			for ( var i = 0; i < currentData.length; i++ )
				//			{
				//				for ( var j = 0; j < currentPuker.length; j++ )
				//				{
				//					if ( currentData[i].sortNumber == currentPuker[j].sortNumber )
				//					{
				//						temp.push(currentPuker[j]);
				//					}
				//				}
				//			}
				//			this.showTouchTipinfo(temp,type);
				//			//this.showTouchTipinfo(currentData,type);
				//		}
				//		else
				//		{
				//			this.showTouchTipinfo(arr,type);
				//		}
				//	}
				//	else
				//	{
				//		this.showTouchTipinfo(arr,type);
				//	}
				//	break;

				//default :
				//	break;
			//}
		},
		/**
		 * 提示处理
		 * @param isJugement bool 是否智能判断
		 * @param huadongData bool 是否根据滑动选出牌去判断
		 */
		showTouchTipinfo:function(huadongData,type)
		{
			var arr = huadongData, data = [];
			//sparrowDirector.gameLayer.pukerLayer.reLayoutPuker(true);
			for ( var i = 0; i < arr.length; i++ )
			{
				if ( !arr[i].posNomal )
				{
					arr[i].selectedCard();
				}
				data.push(arr[i].sortNumber);
			}
			var s_data = sparrowDirector.gameData.oTherPuker;//上家出牌数据

			var type = gameLogic.getType (s_data);
			cc.log ("type========= " + type);
			//没有可出牌
			if (type < 1)
			{
				return;
			}
			var targetData = gameLogic.getCardForType (data, s_data, type);
			cc.log ("targetdATA.length111=  " + targetData.length+"  "+JSON.stringify(targetData));
			targetData.sort(function(a, b)
			{
				if ( a[0] && b[0] )
				{
					return a[0].value - b[0].value;
				}
				else
				{
					return 0;
				}
			});
			targetData.sort(function(a, b){return a.length - b.length;});
			targetData.sort(function(a, b)
			{
				if ( a[0] && b[0] )
				{
					return a[0].sortTag - b[0].sortTag;
				}
				else
				{
					return 0;
				}
			});
			targetData.sort(function(a, b)
			{
				if ( a[0] && b[0] )
				{
					return a[0].laiziNum - b[0].laiziNum;
				}
				else
				{
					return 0;
				}
			});

			if (targetData.length < 1)
			{
				targetData = [arr];
			}
			this.tipCount = 0;
			var len = targetData.length;
			if (!Is_LAIZI_ROOM())
			{
				for (var j = 0; j < targetData[this.tipCount].length; j++)
				{
					for (var i = 0; i < arr.length; i++)
					{
						if (targetData[this.tipCount][j].sortNumber && arr[i].sortNumber == targetData[this.tipCount][j].sortNumber)
						{
							arr[i].selectedCard ();
							break;
						}
					}
				}
			}
			else
			{
				var that = this;
				var laizi = gameLogic.getLaiziNumber(targetData[this.tipCount]);
				cc.log("laizi================= "+JSON.stringify(laizi));
				sparrowDirector.gameData.targetData = DataUtil.copyJson(targetData[that.tipCount]);
				var currentLNum = 0;
				if (!targetData[that.tipCount])
				{
					cc.log("targetData[that.tipCount]无效拉拉拉拉拉拉拉拉拉拉拉拉拉拉");
					return;
				}
				for ( var j = 0; j < targetData[that.tipCount].length; j++ )
				{
					if ( laizi.count > 0 )
					{
						if ( targetData[that.tipCount][j].value == laizi.laizi.value )
						{
							currentLNum++;
							continue;
						}
					}
					for ( var i = 0; i < arr.length; i++ )
					{
						if ( arr[i].sortNumber == targetData[that.tipCount][j].sortNumber )
						{
							arr[i].selectedCard();
						}
					}
				}
				//将玩家癞子牌选出来
				if ( laizi.count > 0 )
				{
					var temp = [];
					for ( var i = 0; i < arr.length; i++ )
					{
						if ( arr[i].sortNumber01 == laizi.laizi.value )
						{
							temp.push(arr[i]);
						}
					}
					for ( var j = 0; j < currentLNum; j++ )
					{
						temp[j].selectedCard();
					}
				}
			}

			this.tipCount++;
			if ( this.tipCount >= len )
			{
				this.tipCount = 0;
			}

			sparrowDirector.gameLayer.orderLayer.setOutPukerBtnEnable();
		}
	});

/**
 * 倒计时层
 */
var CountDownLayer = cc.Layer.extend(
	{
		ctor:function()
		{
			this._super();
			this.setVariable();
			this.zinit();
			this.addUI();
		},
		setVariable:function()
		{
			//倒计时时间
			this.countDownNumber = 15;
			this.size = cc.winSize;
			this.currntDirection = -1;
			//叫地主时间
			this.cbTimeCallBanker = 15;
			//抢地主时间
			this.cbTimeRodBanker = 15;
			//加倍时间
			this.cbTimeAddDouble = 15;
			//开始时间
			this.cbTimeStartGame = 15;
			//首出时间
			this.cbTimeHeadOutCard = 15;
			//出牌时间
			this.cbTimeOutCard = 15;
			//叫分时间
			this.cbTimeCallScore = 15;
		},
		zinit:function()
		{
			this.setContentSize(this.size);
		},
		addUI:function()
		{
			this.clock = cc.Sprite.createWithSpriteFrameName("desk005.png");
			this.addChild(this.clock, 0);
			this.clock.setPosition(winSize.width/2, winSize.height/2);

			this.countText = ccui.Text.create();
			this.countText.setString(this.countDownNumber);
			this.countText.setFontSize(28);
			this.countText.setColor(cc.color(0, 0, 0, 255));
			this.clock.addChild(this.countText, 0);
			//this.countText.setPosition(this.clock.width/2, this.clock.height/2);
			this.countText.setPosition(37.64, 45);
			this.countText.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
			this.clock.visible = false;
		},
		startCountDown:function(direction,defaultNum)
		{
			if(defaultNum)
				this.showClock(defaultNum);
			else
				this.showClock();

			direction = this.getDirection(direction);
			this.currntDirection = direction;
			switch (direction)
			{
				case 0:	//自己
				{
					//第一次倒计时结束出牌时间减去5
					if ( sparrowDirector.gameData01.tuoGuanArr.length == 1 )
					{
						this.countDownNumber -= 5;
					}
					this.clock.setPosition(Control_pos.left.x - 50, Control_pos.left.y-70);
					var clockPos = [];
					clockPos.x = Control_pos.left.x - 50;
					clockPos.y = Control_pos.left.y-70;
					var playHead = sparrowDirector.gameLayer.playerLayer.getChildByTag(100);
					if (playHead)
					{
						var pos = this.convertToNodeSpace(playHead.cardBg.getParent().convertToWorldSpace(playHead.cardBg.getPosition()));
						clockPos.x = pos.x + 40;
						clockPos.y = pos.y - 25;
					}

					this.clock.setPosition(clockPos.x, clockPos.y);
					break;
				}
				case 1:	//右
				{
					var clockPos = [];
					clockPos.x = this.size.width-Control_pos.left.x;
					clockPos.y = Control_pos.left.y+120;
					var playHead = sparrowDirector.gameLayer.playerLayer.getChildByTag(300);
					if (playHead)
					{
						var pos = this.convertToNodeSpace(playHead.cardBg.getParent().convertToWorldSpace(playHead.cardBg.getPosition()));
						clockPos.x = pos.x - 70;
						clockPos.y = pos.y - 90;
					}

					this.clock.setPosition(clockPos.x, clockPos.y);

					break;
				}
				case 2: //左
				{
					var clockPos = [];
					clockPos.x = Control_pos.left.x;
					clockPos.y = Control_pos.left.y+12;
					var playHead = sparrowDirector.gameLayer.playerLayer.getChildByTag(200);
					if (playHead)
					{
						var pos = this.convertToNodeSpace(playHead.cardBg.getParent().convertToWorldSpace(playHead.cardBg.getPosition()));
						clockPos.x = pos.x + 70;
						clockPos.y = pos.y - 90;
					}

					this.clock.setPosition(clockPos.x, clockPos.y);
					break;
				}
				default:
					break;
			}
			if ( direction != 0 )
			{
				//sparrowDirector.gameLayer.pukerLayer.reLayoutPuker();
			}
			this.unschedule(this.countDowning);
			this.countText.setString(this.countDownNumber);
			this.schedule(this.countDowning, 0.9);
		},
		countDowning:function()
		{
			this.countDownNumber--;
			this.countText.setString(this.countDownNumber);
			lm.log("this.countDownNumber==========this.cbTimeHeadOutCard==== "+this.countDownNumber+"  --- "+this.cbTimeHeadOutCard);

			if ( this.countDownNumber == 1 )
			{
				sparrowDirector.gameLayer.orderLayer.hideView ();
				sparrowDirector.gameLayer.orderLayer_happy.hideView();
			}
			if ( this.countDownNumber < 1 )
			{
				if ( !Is_LAIZI_ROOM() && !Is_HAPPY_ROOM() )	//经典
				{
					if ( this.currntDirection == 0 )
					{
						sparrowDirector.gameLayer.orderLayer.hideView();
						//自动托管数组
						sparrowDirector.gameData01.tuoGuanArr.push("1");
						this.setAutoAndroid();
						if ( !sparrowDirector.gameData.isReadied )
						{
							//退出
							sparrowDirector.SendUserAskStandup();
							return;
						}
						if  ( sparrowDirector.gameData.isGaming )
						{
							if ( sparrowDirector.gameData.isPlayerOut )
							{
								sparrowDirector.gameData.isPlayerOut = false;
								this.autoOutPuker();
							}
							else
							{
								//不出
								if ( !sparrowDirector.gameData.isOuteredPuker )
								{
									sparrowDirector.sendPassCard();

								}
							}
						}
						else
						{
							//不叫
							sparrowDirector.sendCallScore(0);
						}

					}
				}
				else if ( Is_HAPPY_ROOM() )	//欢乐
				{
					if ( this.currntDirection == 0 )
					{
						sparrowDirector.gameLayer.orderLayer_happy.hideView();
						sparrowDirector.gameLayer.orderLayer.hideView();
						//自动托管数组
						sparrowDirector.gameData01.tuoGuanArr.push("1");
						this.setAutoAndroid();
						lm.log("sceneGameCallBanker_happy countDowning ");
						if ( !sparrowDirector.gameData.isReadied )
						{
							//退出
							sparrowDirector.SendUserAskStandup();
							return;
						}
						//if (sparrowDirector.gameData.happyRoomState == HappyRoomState.robLand) {
						if  ( sparrowDirector.gameData.isGaming )
						{
							if ( sparrowDirector.gameData.isPlayerOut )
							{
								sparrowDirector.gameData.isPlayerOut = false;
								this.autoOutPuker();
							}
							else
							{
								//防止倒计时最后一秒自动和手动重复放弃
								if ( sparrowDirector.gameData.isPassedPuker )
								{
									sparrowDirector.gameData.isPassedPuker = false;
									return;
								}
								sparrowDirector.gameData.isPassedPuker = true;
								lm.log("欢乐场  放弃出牌 倒计时结束");
								//不出
								sparrowDirector.sendPassCard_happy();
							}
						}
						else
						{
							lm.log("sceneGameCallBanker_happy countDowning 2");
							//叫地主状态
							if ( sparrowDirector.gameData.happyRoomState == HappyRoomState.callLand )
							{
								lm.log("sceneGameCallBanker_happy countDowning 2 1");
								sparrowDirector.sendNoCallBanker_happy();
							}
							//抢地主状态
							else if ( sparrowDirector.gameData.happyRoomState == HappyRoomState.robLand )
							{
								lm.log("sceneGameCallBanker_happy countDowning 2 2");
								sparrowDirector.sendNoRodBanker_happy();
							}
						}
					}
				}
				else if ( Is_LAIZI_ROOM() )
				{
					sparrowDirector.gameLayer.orderLaiziLayer.hideView();
					sparrowDirector.gameLayer.orderLayer.hideView();
					if ( this.currntDirection == 0 )
					{
						//自动托管数组
						sparrowDirector.gameData01.tuoGuanArr.push("1");
						this.setAutoAndroid();
						if ( !sparrowDirector.gameData.isReadied )
						{
							//退出
							sparrowDirector.SendUserAskStandup();
							return;
						}

						if  ( sparrowDirector.gameData.isGaming && !sparrowDirector.gameData.isDoubledState)
						{
							if ( sparrowDirector.gameData.isPlayerOut )
							{
								sparrowDirector.gameData.isPlayerOut = false;
								this.autoOutPuker();
							}
							else
							{
								//不出
								if ( !sparrowDirector.gameData.isOuteredPuker )
								{
									sparrowDirector.sendPassCardLaizi();
								}

							}
						}
						else
						{
							//叫地主状态
							if ( sparrowDirector.gameData.isCallBankerState )
							{
								sparrowDirector.sendCallBanker(2);
							}
							//强地主状态
							if ( sparrowDirector.gameData.isRodBankerState )
							{
								sparrowDirector.sendRodBanker(2);
							}
							//加倍状态
							if ( sparrowDirector.gameData.isDoubledState )
							{
								sparrowDirector.sendDouble(2);
							}
						}
					}
				}

				this.unschedule(this.countDowning);
				this.hideClock();
			}
		},
		setAutoAndroid:function()
		{
			//检测是否托管
			if ( sparrowDirector.gameData01.tuoGuanArr.length >= 2 )
			{
				sparrowDirector.gameData.isAutoAi = true;
				sparrowDirector.gameLayer.androidLayer.visible = true;
				if(Is_HAPPY_ROOM())
				{
					sparrowDirector.sendTrustee_happy(1);
				}
				else
				{
					sparrowDirector.sendTuoGuanOrder(1);
				}
			}
		},
		autoOutPuker:function()
		{
			if ( sparrowDirector.gameData.isLaiziThreeByTwo )
			{
				sparrowDirector.gameData.isLaiziThreeByTwo = false;
				var arr02 = sparrowDirector.gameLayer.pukerLayer.pukerArr04;
				var data = sparrowDirector.gameLayer.sePukerLayer.data;
				var outData = data.rD;
				for ( var i = 0;i < outData.length; i++ )
				{
					var item = new GameCard();
					item.createPuker(outData[i], true);
					item.setPosition(Control_pos.center.x+(i+2)-item.width*item.scale/2, Control_pos.center.y - 60);
					arr02.push(item);
				}
				sparrowDirector.gameData.oTherPuker.splice(0);
				sparrowDirector.gameLayer.pukerLayer.outPuker(data.index,null, data.rD, data.rod);
				sparrowDirector.gameLayer.sePukerLayer.removeAllChildren();
				return;
			}
			//防止倒计时最后一秒自动和手动重复出牌
			if ( sparrowDirector.gameData.isOuteredPuker )
			{
				return;
			}

			//出第一张牌
			var arr01 = sparrowDirector.gameLayer.pukerLayer.pukerArr01;
			var arr02 = sparrowDirector.gameLayer.pukerLayer.pukerArr04;
			if ( arr01.length < 1 )
			{
				arr01 = sparrowDirector.gameLayer.touchLayer.getDragLayerPuker();
				if ( arr01.length < 1 )
				{
					return;
				}
			}
			var len = arr01.length - 1;
			for ( var i = 0; i < arr02.length; i++ )
			{
				arr02[i].removeFromParent();
			}
			lm.log("autoOutpuker------------------------- "+arr01.length);
			arr02.splice(0);
			var item = new GameCard();
			var pukerData = [arr01[len].sortNumber];
			item.createPuker(arr01[len].sortNumber);
			var i = 0;
			item.setPosition(Control_pos.center.x+(i+2)-item.width*item.scale/2, Control_pos.center.y - 60);
			arr02.push(item);

			(function()
			{
				arr01[len].removeFromParent();
				arr01.splice(len, 1);
			})();
			sparrowDirector.gameLayer.pukerLayer.outPuker(sparrowDirector.gameData.myChairIndex,null,pukerData,pukerData);

		},
		showClock:function(defaultNum)
		{
			//this.countDownNumber = 15;
			if(defaultNum)
				this.countDownNumber = defaultNum;
			else
				this.countDownNumber = this.updateCountDownTime();
			this.clock.visible = true;
		},
		updateCountDownTime:function() {
			//var bool = Is_LAIZI_ROOM ();
			if (Is_LAIZI_ROOM()) {
				//叫地主状态
				if (sparrowDirector.gameData.isCallBankerState) {
					return this.cbTimeCallBanker;
				}
				//强地主状态
				if (sparrowDirector.gameData.isRodBankerState) {
					return this.cbTimeRodBanker;
				}
				//加倍状态
				if (sparrowDirector.gameData.isDoubledState) {
					return this.cbTimeAddDouble;
				}
				//首出
				if (sparrowDirector.gameData.isFirstOutPuker)
				{
					return this.cbTimeHeadOutCard;
				}
			}
			if (Is_HAPPY_ROOM()) {
				//叫地主状态
				if (sparrowDirector.gameData.happyRoomState == HappyRoomState.callLand) {
					return this.cbTimeCallBanker;
				}
				//强地主状态
				if (sparrowDirector.gameData.happyRoomState == HappyRoomState.robLand) {
					return this.cbTimeRodBanker;
				}
				//首出
				if (sparrowDirector.gameData.isFirstOutPuker)
				{
					return this.cbTimeHeadOutCard;
				}
			}
			else
			{
				//叫分状态
				if ( sparrowDirector.gameData.isCallScore )
				{
					return this.cbTimeCallScore;
				}
				//首出
				if (sparrowDirector.gameData.isFirstOutPuker)
				{
					return this.cbTimeHeadOutCard;
				}
			}
			return this.cbTimeOutCard;
		},
		setCountDownTime:function(data)
		{
			if ( Is_LAIZI_ROOM() )
			{
				this.cbTimeCallBanker = data.cbTimeCallBanker;
				this.cbTimeRodBanker  = data.cbTimeRodBanker;
				this.cbTimeAddDouble  = data.cbTimeAddDouble;
				this.cbTimeStartGame  = data.cbTimeStartGame-5;
				this.cbTimeHeadOutCard= data.cbTimeHeadOutCard  > 0 ? data.cbTimeHeadOutCard-5 : this.cbTimeHeadOutCard;
				this.cbTimeOutCard    = data.cbTimeOutCard;
			}
			else if ( Is_HAPPY_ROOM() )
			{
				this.cbTimeCallBanker = data.cbTimeCallScore;
				this.cbTimeRodBanker  = data.cbTimeCallScore;
				this.cbTimeStartGame  = data.cbTimeStartGame;
				this.cbTimeHeadOutCard= data.cbTimeHeadOutCard  > 0 ? data.cbTimeHeadOutCard-5 : this.cbTimeHeadOutCard;
				this.cbTimeOutCard    = data.cbTimeOutCard;
			}
			else
			{
				this.cbTimeCallScore  = data.cbTimeCallScore;
				this.cbTimeStartGame  = data.cbTimeStartGame;
				this.cbTimeHeadOutCard= data.cbTimeHeadOutCard  > 0 ? data.cbTimeHeadOutCard-5 : this.cbTimeHeadOutCard;
				this.cbTimeOutCard    = data.cbTimeOutCard;
			}
		},
		hideClock:function()
		{
			this.unschedule(this.countDowning);
			this.clock.visible = false;
		},
		getDirection:function(direction)
		{
			if ( direction < 0 ){return direction;}//准备开始倒计时位置
			switch (sparrowDirector.gameData.myChairIndex)
			{
				case 0:
				{
					return direction;
				}

				case 1:
				{
					if ( direction ==  0 )
					{
						return 2;
					}
					else if ( direction == 1 )
					{
						return 0;
					}
					else if ( direction == 2 )
					{
						return 1;
					}
					break;
				}

				case 2:
				{
					if ( direction ==  0 )
					{
						return 1;
					}
					else if ( direction == 1 )
					{
						return 2;
					}
					else if ( direction == 2 )
					{
						return 0;
					}
					break;
				}

				default :
					return ;
			}
		}
	});


/*
 * 记分层
 */
var ScoreLayer = cc.Layer.extend(
	{
		ctor:function()
		{
			this._super();
			this.setVariable();
			this.zinit();
		},
		setVariable:function()
		{
			this.size = cc.winSize;
		},
		zinit:function()
		{
			this.setContentSize(this.size);
		},
		/**
		 * 显示叫分信息
		 * {"type":"CMD_S_CallScore","wCurrentUser":2,"wCallScoreUser":1,"cbCurrentScore":0,"cbUserCallScore":-1}
		 */
		showCallScore:function(data)
		{
			var direction = sparrowDirector.gameLayer.countDownLayer.getDirection(data.wCallScoreUser);
			var score = this.getScoreTexture(data.cbUserCallScore);
			switch (direction)
			{
				case 0:
				{
					score.setPosition(Control_pos.center.x, Control_pos.center.y+230);
					var player01 = sparrowDirector.gameLayer.playerLayer.getChildByTag(100);
					var pos = player01.cancel.getParent().convertToWorldSpace(player01.cancel.getPosition());
					score.setPosition(pos.x, pos.y);
					break;
				}
				case 1:
				{
					score.setPosition(this.size.width-Control_pos.left.x, Control_pos.left.y+50);
					var player01 = sparrowDirector.gameLayer.playerLayer.getChildByTag(300);
					var pos = player01.cancel.getParent().convertToWorldSpace(player01.cancel.getPosition());
					score.setPosition(pos.x, pos.y);
					break;
				}
				case 2:
				{
					score.setPosition(Control_pos.left.x, Control_pos.left.y+50);
					var player01 = sparrowDirector.gameLayer.playerLayer.getChildByTag(200);
					var pos = player01.cancel.getParent().convertToWorldSpace(player01.cancel.getPosition());
					score.setPosition(pos.x, pos.y);
					break;
				}

				default:
					break;
			}

			if ( data.wCurrentUser < 0 )
			{
				this.clearning();
			}
			else
			{
				sparrowDirector.gameLayer.orderLayer.startCallScore(data.wCurrentUser,data);
			}
		},
		clearning:function()
		{
			this.removeAllChildren();
			sparrowDirector.gameLayer.countDownLayer.hideClock();
			cc.log("------------------- "+"叫分结束");
		},
		//叫分纹理
		getScoreTexture:function(score)
		{
			var scoreImag = ccui.ImageView.create();
			if ( score == -1 )
			{
				LandCEMusic.playCallScoreEffect(0);
				scoreImag.loadTexture("not_call.png", 1);
			}
			else if ( score == 1 )
			{
				scoreImag.loadTexture("image_yifen.png", 1);
				LandCEMusic.playCallScoreEffect(score);
			}
			else if ( score == 2 )
			{
				scoreImag.loadTexture("image_erfen.png", 1);
				LandCEMusic.playCallScoreEffect(score);
			}
			else if( score == 3 )
			{
				scoreImag.loadTexture("image_sanfen.png", 1);
				LandCEMusic.playCallScoreEffect(score);
			}
			this.addChild(scoreImag, 0);
			return scoreImag;
		}
	});

//机器人层
var AndroidLayer = ccui.Layout.extend(
	{
		ctor:function()
		{
			this._super();

			this.parentView = ccs.load("res/landlord/cocosOut/AndroidLayer.json").node;
			this.addChild(this.parentView);
			this.parentView.ignoreAnchorPointForPosition(false);
			this.parentView.setAnchorPoint(0.5,0.5);
			this.parentView.setPosition(winSize.width/2,winSize.height/2);

			this.touchLayer = ccui.helper.seekWidgetByName(this.parentView, "touchLayer");
			this.touchLayer.addTouchEventListener(this.cancelAiEvent, this);

			//var layerColor = cc.LayerColor.create(cc.color(0, 0, 0, 0), winSize.width, winSize.height);
			//this.addChild(layerColor);
			//layerColor.opacity = 100;
            //
			//var bg = ccui.Button.create("res/landlord/cocosOut/backUILayer/deskBackground.png","","");
			//bg.setPosition(winSize.width/2, winSize.height/2);
			//this.addChild(bg, 1);
			//bg.setSwallowTouches(true);
			//bg.setOpacity(0);
			//bg.setTouchEnabled(true);
			//bg.addTouchEventListener(this.cancelAiEvent, this);
            //
			//var tipImg01 = cc.Sprite.createWithSpriteFrameName("desk039.png");
			//tipImg01.setPosition(winSize.width/2, 50+30);
			//this.addChild(tipImg01, 100);
            //
			//var tipImg02 = cc.Sprite.createWithSpriteFrameName("desk040.png");
			//tipImg02.setPosition(winSize.width/2, 100+30);
			//this.addChild(tipImg02, 100);

			//var cancel_ai_btn = ccui.Button.create("desk034.png","","",ccui.Widget.PLIST_TEXTURE);
			//cancel_ai_btn.setPosition(winSize.width/2, 100);
			//this.addChild(cancel_ai_btn, 100);
			//cancel_ai_btn.addTouchEventListener(this.cancelAiEvent, this);
		},
		//取消托管
		cancelAiEvent:function(target, state)
		{
			if ( state == ccui.Widget.TOUCH_ENDED )
			{
				if(Is_HAPPY_ROOM())
				{
					sparrowDirector.sendTrustee_happy(0);
				}
				else
				{
					sparrowDirector.sendTuoGuanOrder(0);
				}
				//清除托管判断数组
				sparrowDirector.gameData01.tuoGuanArr.splice(0);
				sparrowDirector.gameData.isAutoAi = false;
				LandCEMusic.playBtnEffect();
				this.visible = false;
				this.pukerArr01 = sparrowDirector.gameLayer.pukerLayer.pukerArr01;
				for ( var i = 0; i < this.pukerArr01.length; i++ )
				{
					if ( !this.pukerArr01[i].posNomal )
					{
						this.pukerArr01[i].selectedCard();
					}
				}
			}
		}
	});


/**********************************************************癞子场**********************************************************/
var OrderLaiziLayer = cc.Layer.extend(
	{
		//this.ui.setPosition(winSize.width-this.ui.width*this.ui.scaleX>>1, winSize.height/2 - 80);
		ctor:function()
		{
			this._super();
			this.setVariable();
			this.zinit();
			this.addUI();
			this.hideView();
		},
		setVariable:function()
		{
			this.orderType = 0;//0叫地主，1强地主，2加倍

			this.orderLayer01 = cc.Layer.create();
			this.addChild(this.orderLayer01, 110);

			this.infoLayer = cc.Layer.create();
			this.addChild(this.infoLayer, 10);
		},
		zinit:function()
		{
			this.size = winSize;
			this.setContentSize(this.size);
		},
		addUI:function()
		{
			//this.btn01 = ccui.Button.create("20_table_btncalled.png","","",ccui.Widget.PLIST_TEXTURE);
			//this.btn02 = ccui.Button.create("20_table_btnnocalled.png","","",ccui.Widget.PLIST_TEXTURE);
			this.btn01 = ccui.Button.create("but_desk_red.png","","",ccui.Widget.PLIST_TEXTURE);
			this.btn02 = ccui.Button.create("but_desk_red.png","","",ccui.Widget.PLIST_TEXTURE);
			var arr = [this.btn01, this.btn02], gap = 30;
			for ( var i = 0; i < arr.length; i++ )
			{
				//arr[i].scale = 0.8;
				arr[i].x = (this.size.width - (arr.length-1)*arr[i].width)/2 + (arr[i].width + gap)*i;
				arr[i].y = this.size.height/2-0;
				this.orderLayer01.addChild(arr[i], 0);
			}
			this.btn01.addTouchEventListener(this.orderbtn01Event, this);
			this.btn02.addTouchEventListener(this.orderbtn02Event, this);
		},
		startCallBanker:function(direction)
		{
			sparrowDirector.gameLayer.countDownLayer.startCountDown(direction);
			if ( direction == sparrowDirector.gameData.myChairIndex )
			{
				this.showView();
				sparrowDirector.gameLayer.orderLayer.checkAutoAi(direction);
				cc.log("+++++++++++++++++++++++showView+++++++++++++++++++++++++++++++++++++++++")
			}
		},
		/**
		 * 叫地主
		 * {"type":"CMD_S_CallBanker","wCurrentUser":-1,"wLastUer":0,"cbCallInfo":1}
		 * 用户强地主  {"type":"CMD_S_RodBanker","wRodBankerTime":1,"wBankerUser":0,"wCurrentUser":-1,"wLastUer":2,"cbRodInfo":2}
		 */
		showBankerResult:function(data)
		{
			var direction = sparrowDirector.gameLayer.countDownLayer.getDirection(data.wLastUer);
			this.orderType = 0;
			var score = this.getScoreTexture(data.cbCallInfo);
			switch (direction)
			{
				case 0:
				{
					score.setPosition(Control_pos.center.x, Control_pos.center.y+230);
					var player01 = sparrowDirector.gameLayer.playerLayer.getChildByTag(100);
					var pos = player01.cancel.getParent().convertToWorldSpace(player01.cancel.getPosition());
					score.setPosition(pos.x, pos.y);
					break;
				}
				case 1:
				{
					score.setPosition(this.size.width-Control_pos.left.x, Control_pos.left.y+50);
					var player01 = sparrowDirector.gameLayer.playerLayer.getChildByTag(300);
					var pos = player01.cancel.getParent().convertToWorldSpace(player01.cancel.getPosition());
					score.setPosition(pos.x, pos.y);
					break;
				}
				case 2:
				{
					score.setPosition(Control_pos.left.x, Control_pos.left.y+50);
					var player01 = sparrowDirector.gameLayer.playerLayer.getChildByTag(200);
					var pos = player01.cancel.getParent().convertToWorldSpace(player01.cancel.getPosition());
					score.setPosition(pos.x, pos.y);
					break;
				}

				default:
					break;
			}
			if ( data.wCurrentUser < 0 )
			{
				//this.resetData();
			}
			else
			{
				this.startCallBanker(data.wCurrentUser,data);
			}
		},
		/*
		 {"type":"CMD_S_RodBanker","wRodBankerTime":1,"wBankerUser":0,"wCurrentUser":1,"wLastUer":-1,"cbRodInfo":0}
		 强地主
		 */
		showRodBanker:function(data)
		{
			this.orderType = 1;
			this.refreshTextures();
			if ( data.wLastUer < 0 )
			{
				this.startCallBanker(data.wCurrentUser);
				return;
			}
			var direction = sparrowDirector.gameLayer.countDownLayer.getDirection(data.wLastUer);
			this.orderType = 1;
			this.refreshTextures();
			var score = this.getScoreTexture(data.cbRodInfo);
			switch ( direction )
			{
				case 0:
				{
					score.setPosition(Control_pos.center.x, Control_pos.center.y+230);
					var player01 = sparrowDirector.gameLayer.playerLayer.getChildByTag(100);
					var pos = player01.cancel.getParent().convertToWorldSpace(player01.cancel.getPosition());
					score.setPosition(pos.x, pos.y);
					break;
				}
				case 1:
				{
					score.setPosition(this.size.width-Control_pos.left.x, Control_pos.left.y+50);
					var player01 = sparrowDirector.gameLayer.playerLayer.getChildByTag(300);
					var pos = player01.cancel.getParent().convertToWorldSpace(player01.cancel.getPosition());
					score.setPosition(pos.x, pos.y);
					break;
				}
				case 2:
				{
					score.setPosition(Control_pos.left.x, Control_pos.left.y+50);
					var player01 = sparrowDirector.gameLayer.playerLayer.getChildByTag(200);
					var pos = player01.cancel.getParent().convertToWorldSpace(player01.cancel.getPosition());
					score.setPosition(pos.x, pos.y);
					break;
				}

				default:
					break;
			}
			if ( data.wCurrentUser < 0 )
			{
				this.resetData();
				sparrowDirector.gameData.isCallBankerState = false;
				sparrowDirector.gameData.isRodBankerState = false;
				sparrowDirector.gameData.isDoubledState = true;
				sparrowDirector.gameLayer.countDownLayer.currntDirection = 0;
			}
			else
			{
				this.startCallBanker(data.wCurrentUser,data);
			}
		},
		/*
		 {"type":"CMD_S_Double","wCurrentUser":0,"cbDouble":1}
		 加倍
		 */
		showDoubleInfo:function(data)
		{
			var direction = sparrowDirector.gameLayer.countDownLayer.getDirection(data.wCurrentUser);
			var score = this.getScoreTexture(data.cbDouble);
			switch ( direction )
			{
				case 0:
				{
					score.setPosition(Control_pos.center.x, Control_pos.center.y+230);
					var player01 = sparrowDirector.gameLayer.playerLayer.getChildByTag(100);
					var pos = player01.cancel.getParent().convertToWorldSpace(player01.cancel.getPosition());
					score.setPosition(pos.x, pos.y);
					break;
				}
				case 1:
				{
					score.setPosition(this.size.width-Control_pos.left.x, Control_pos.left.y+50);
					var player01 = sparrowDirector.gameLayer.playerLayer.getChildByTag(300);
					var pos = player01.cancel.getParent().convertToWorldSpace(player01.cancel.getPosition());
					score.setPosition(pos.x, pos.y);
					break;
				}
				case 2:
				{
					score.setPosition(Control_pos.left.x, Control_pos.left.y+50);
					var player01 = sparrowDirector.gameLayer.playerLayer.getChildByTag(200);
					var pos = player01.cancel.getParent().convertToWorldSpace(player01.cancel.getPosition());
					score.setPosition(pos.x, pos.y);
					break;
				}
				default:
					break;
			}
		},
		/**
		 * 开始游戏
		 * @param data
		 *{"type":"CMD_S_Game_Start","wBankerUser":0,"wCurrentUser":0,"cbCardData":[6,61,28,59,43,27,11,26,57,41,56,24,23,7,37,52,35,21,36,3]}
		 */
		laiziStart:function(data)
		{
			sparrowDirector.gameLayer.countDownLayer.startCountDown(data.wBankerUser);
			if ( data.wBankerUser == sparrowDirector.gameData.myChairIndex )
			{
				//出牌
				sparrowDirector.gameLayer.orderLayer.refreshTextures();
				sparrowDirector.gameLayer.orderLayer.setOutPukerBtnEnable();
			}
			this.resetData();
		},
		//是否加倍
		doubleOrder:function()
		{
			this.orderType = 2;
			this.refreshTextures();
			this.showView();
			sparrowDirector.gameLayer.countDownLayer.currntDirection = 0;
			sparrowDirector.gameLayer.orderLayer.checkAutoAi(sparrowDirector.gameData.myChairIndex);
		},
		getScoreTexture:function(bool)
		{
			var img = ccui.ImageView.create();
			if ( this.orderType == 0 )
			{
				if ( bool == 1 )
				{
					img.loadTexture("call.png", ccui.Widget.PLIST_TEXTURE);
					LandCEMusic.playCallBankerEf();
				}
				else
				{
					img.loadTexture("not_call.png", ccui.Widget.PLIST_TEXTURE);
					LandCEMusic.playNotCallBankerEf();
				}
			}
			else if ( this.orderType == 1 )
			{
				if ( bool == 1 )
				{
					img.loadTexture("rod.png", ccui.Widget.PLIST_TEXTURE);
					LandCEMusic.playRodBankerEf();
					sparrowDirector.gameData.currentRodCount++;
					sparrowDirector.gameLayer.deskLayer.refreshCurrentBeishu();
				}
				else
				{
					img.loadTexture("not_rod.png", ccui.Widget.PLIST_TEXTURE);
					LandCEMusic.playNotRodBankerEf();
				}
			}
			else if ( this.orderType == 2 )
			{
				if ( bool == 1 )
				{
					img.loadTexture("add.png", ccui.Widget.PLIST_TEXTURE);
					LandCEMusic.playJiabeiEf();
					sparrowDirector.gameData.currentAddCount++;
					sparrowDirector.gameLayer.deskLayer.refreshCurrentBeishu();
				}
				else
				{
					img.loadTexture("not_add.png", ccui.Widget.PLIST_TEXTURE);
					LandCEMusic.playNotJiabeiEf();
				}
			}

			var len = this.infoLayer.getChildren().length;
			var tagg = 10000+len;
			this.infoLayer.addChild(img, 0, tagg);
			if ( len >=2 )
			{
				var child = this.infoLayer.getChildByTag(tagg-2);
				if ( child )
				{
					if ( sparrowDirector.gameLayer.orderLaiziLayer.orderType < 2 )
					{
						child.visible = false;
					}
				}
			}
			return img;
		},
		resetData:function()
		{
			this.infoLayer.removeAllChildren();
			this.orderType = 0;
		},
		refreshTextures:function()
		{
			cc.log("---------------this.orderType  "+this.orderType);
			//0叫地主，1强地主，2加倍
			switch (this.orderType)
			{
				case 0:
				{
					//this.btn01.loadTextures("20_table_btncalled.png", "", "", ccui.Widget.PLIST_TEXTURE);
					//this.btn02.loadTextures("20_table_btnnocalled.png", "", "", ccui.Widget.PLIST_TEXTURE);
					this.btn01.loadTextures("but_desk_red.png", "", "", ccui.Widget.PLIST_TEXTURE);
					this.btn02.loadTextures("but_desk_red.png", "", "", ccui.Widget.PLIST_TEXTURE);
					break;
				}
				case 1:
				{
					//this.btn01.loadTextures("20_table_btngrab.png", "", "", ccui.Widget.PLIST_TEXTURE);
					//this.btn02.loadTextures("20_table_btnnograb.png", "", "", ccui.Widget.PLIST_TEXTURE);
					this.btn01.loadTextures("but_desk_red.png", "", "", ccui.Widget.PLIST_TEXTURE);
					this.btn02.loadTextures("but_desk_red.png", "", "", ccui.Widget.PLIST_TEXTURE);
					break;
				}
				case 2:
				{
					//this.btn01.loadTextures("20_table_btndouble.png", "", "", ccui.Widget.PLIST_TEXTURE);
					//this.btn02.loadTextures("20_table_btnnodouble.png", "", "", ccui.Widget.PLIST_TEXTURE);
					this.btn01.loadTextures("but_desk_red.png", "", "", ccui.Widget.PLIST_TEXTURE);
					this.btn02.loadTextures("but_desk_red.png", "", "", ccui.Widget.PLIST_TEXTURE);
					break;
				}
				default:
					break;
			}
		},
		//叫地主，强地主，加倍//0叫地主，1强地主，2加倍
		orderbtn01Event:function(target, state)
		{
			if ( state == ccui.Widget.TOUCH_ENDED )
			{
				if ( this.orderType == 0 )
				{
					sparrowDirector.sendCallBanker(1);
				}
				else if ( this.orderType == 1 )
				{
					sparrowDirector.sendRodBanker(1);
				}
				else if ( this.orderType == 2 )
				{
					sparrowDirector.sendDouble(1);
					sparrowDirector.gameLayer.countDownLayer.hideClock();
				}
				this.hideView();
			}
		},
		//不叫，不强，不加倍//0叫地主，1强地主，2加倍
		orderbtn02Event:function(target, state)
		{
			if ( state == ccui.Widget.TOUCH_ENDED )
			{
				if ( this.orderType == 0 )
				{
					sparrowDirector.sendCallBanker(2);
				}
				else if ( this.orderType == 1 )
				{
					sparrowDirector.sendRodBanker(2);
				}
				else if ( this.orderType == 2 )
				{
					sparrowDirector.sendDouble(2);
					sparrowDirector.gameLayer.countDownLayer.hideClock();
				}
				this.hideView();
			}
		},
		hideView:function()
		{
			this.orderLayer01.visible = false;
		},
		showView:function()
		{
			this.orderLayer01.visible = true;
		}
	});

//欢乐场 命令层
var OrderLayerHappy = cc.Layer.extend(
	{
		ctor:function()
		{
			this._super();
			this.setVariable();
			this.zinit();
			this.hideView();
		},
		setVariable:function()
		{
			this.orderType = 0;//0 叫地主，1强地主
		},
		zinit:function()
		{
			this.ui = ccs.load("res/landlord/cocosOut/OrderLayer_happy.json").node;
			this.addChild(this.ui);
			this.ui.ignoreAnchorPointForPosition(false);
			this.ui.setAnchorPoint(0.5,0.5);
			this.ui.setPosition(winSize.width/2,winSize.height/2);

			var self = this;
			//叫地主层
			{
				this.layer_land_call = ccui.helper.seekWidgetByName(this.ui, "layer_land_call");
				this.layer_land_call.visible = false;

				//叫地主
				var btn_yes = ccui.helper.seekWidgetByName(this.layer_land_call, "btn_yes");
				btn_yes.setPressedActionEnabled(true);
				btn_yes.addTouchEventListener(function (sender, type)
				{
					if (type == ccui.Widget.TOUCH_ENDED)
					{
						sparrowDirector.sendCallBanker_happy();
						self.hideView();
						sparrowDirector.gameLayer.countDownLayer.hideClock();
					}
				}, this);

				//不叫
				var btn_no = ccui.helper.seekWidgetByName(this.layer_land_call, "btn_no");
				btn_no.setPressedActionEnabled(true);
				btn_no.addTouchEventListener(function (sender, type)
				{
					if (type == ccui.Widget.TOUCH_ENDED)
					{
						sparrowDirector.sendNoCallBanker_happy();
						self.hideView();
						sparrowDirector.gameLayer.countDownLayer.hideClock();
					}
				}, this);

			}

			//抢地主层
			{
				this.layer_land_rob = ccui.helper.seekWidgetByName(this.ui, "layer_land_rob");
				this.layer_land_rob.visible = false;

				//抢地主
				var btn_yes = ccui.helper.seekWidgetByName(this.layer_land_rob, "btn_yes");
				btn_yes.setPressedActionEnabled(true);
				btn_yes.addTouchEventListener(function (sender, type)
				{
					if (type == ccui.Widget.TOUCH_ENDED)
					{
						sparrowDirector.sendRodBanker_happy();
						self.hideView();
						sparrowDirector.gameLayer.countDownLayer.hideClock();
					}
				}, this);

				//不抢
				var btn_no = ccui.helper.seekWidgetByName(this.layer_land_rob, "btn_no");
				btn_no.setPressedActionEnabled(true);
				btn_no.addTouchEventListener(function (sender, type)
				{
					if (type == ccui.Widget.TOUCH_ENDED)
					{
						sparrowDirector.sendNoRodBanker_happy();
						self.hideView();
						sparrowDirector.gameLayer.countDownLayer.hideClock();
					}
				}, this);

			}

			//明牌层
			{
				this.layer_land_showcard = ccui.helper.seekWidgetByName(this.ui, "layer_land_showcard");
				this.layer_land_showcard.visible = false;

				//明牌
				var btn_showcard = ccui.helper.seekWidgetByName(this.layer_land_showcard, "btn_showcard");
				btn_showcard.setPressedActionEnabled(true);
				btn_showcard.visible = false;
				btn_showcard.addTouchEventListener(function (sender, type)
				{
					if (type == ccui.Widget.TOUCH_ENDED)
					{
						sparrowDirector.sendShowCard_happy(1, sparrowDirector.gameData.happyRoomShowCardCount);
						self.hideView();
					}
				}, this);

			}

			//显示其他玩家叫抢信息
			{
				this.Image_call = ccui.helper.seekWidgetByName(this.ui, "Image_call");
				this.Image_rob = ccui.helper.seekWidgetByName(this.ui, "Image_rob");
				this.Image_nocall = ccui.helper.seekWidgetByName(this.ui, "Image_nocall");
				this.Image_norob = ccui.helper.seekWidgetByName(this.ui, "Image_norob");

				this.Image_call.visible = false;
				this.Image_rob.visible = false;
				this.Image_nocall.visible = false;
				this.Image_norob.visible = false;
			}

		},

		reloadShowCardBtn:function(ShowCardCount)
		{
			var beishu = 4;
			if(ShowCardCount <= 6)
			{
				beishu = 4;
			}
			else if(ShowCardCount <= 12)
			{
				beishu = 3;
			}
			else if(ShowCardCount <= 17)
			{
				beishu = 2;
			}

			lm.log("reloadShowCardBtn .............. " + "btn_showcard_" + beishu + ".png");

			var btn_showcard = ccui.helper.seekWidgetByName(this.layer_land_showcard, "btn_showcard");
			ccui.helper.seekWidgetByName(btn_showcard, "text").setString("明牌x"+beishu);
		},

		showUserOrder:function(data)
		{
			//首先隐藏计时器
			sparrowDirector.gameLayer.countDownLayer.hideClock();
			this.hideView();

			var wLandUser = data.wLandUser;                    //叫牌操作玩家
			var wNextUser = data.wNextUser;                    //下一个叫牌玩家
			var cbLandOption = data.cbLandOption;              //当前叫牌操作,叫牌码
			var cbNextLandOption = data.cbNextLandOption;      //下一个玩家的叫牌操作，叫牌码

			//显示其他玩家叫 抢命令
			if(cbLandOption != 0)
			{
				var direction = sparrowDirector.gameLayer.countDownLayer.getDirection(wLandUser);
				switch ( direction )
				{
					case 0:	//自己
					{
						var player = sparrowDirector.gameLayer.playerLayer.getChildByTag(100);
						var order = this.getOtherUserOrder(player, cbLandOption);
						order.visible = true;
						break;
					}
					case 1:	//左
					{
						var player = sparrowDirector.gameLayer.playerLayer.getChildByTag(300);
						var order = this.getOtherUserOrder(player, cbLandOption);
						order.visible = true;
						break;
					}
					case 2:	//右
					{
						var player = sparrowDirector.gameLayer.playerLayer.getChildByTag(200);
						var order = this.getOtherUserOrder(player, cbLandOption);
						order.visible = true;
						break;
					}
					default:
						break;
				}


				//根据命令，加倍
				if(cbLandOption == 3 || cbLandOption == 4)
					sparrowDirector.gameLayer.deskLayer.setCurrentScore();
			}

			//显示自己命令
			if(cbNextLandOption != 0)
			{
				sparrowDirector.gameLayer.countDownLayer.startCountDown(wNextUser);	//显示闹钟

				//清空叫抢状态
				var direction = sparrowDirector.gameLayer.countDownLayer.getDirection(wNextUser);
				var player;
				switch ( direction )
				{
					case 0:	//自己
					{
						player = sparrowDirector.gameLayer.playerLayer.getChildByTag(100);
						break;
					}
					case 1:	//左
					{
						player = sparrowDirector.gameLayer.playerLayer.getChildByTag(300);
						break;
					}
					case 2:	//右
					{
						player = sparrowDirector.gameLayer.playerLayer.getChildByTag(200);
						break;
					}
					default:
						break;
				}
				if(player)
				{
					player.Image_nocall.visible = false;
					player.Image_norob.visible = false;
					player.Image_call.visible = false;
					player.Image_rob.visible = false;
				}

				if(cbNextLandOption == 3)//叫地主
				{
					sparrowDirector.gameData.happyRoomState = HappyRoomState.callLand;	//进入叫地主阶段
				}
				else if(cbNextLandOption == 4)//抢地主
				{
					sparrowDirector.gameData.happyRoomState = HappyRoomState.robLand;	//进入抢地主阶段
				}

				if(sparrowDirector.gameData.myChairIndex == wNextUser)	//自己
				{
					this.setOrderType(cbNextLandOption == 3 ? 0 : 1);
					sparrowDirector.gameLayer.orderLayer.checkAutoAi();
				}
				else
				{
					this.hideView();
				}
			}


		},

		getOtherUserOrder:function(player, orderIndex)
		{
			player.Image_nocall.visible = false;
			player.Image_norob.visible = false;
			player.Image_call.visible = false;
			player.Image_rob.visible = false;

			var rt = null;
			switch ( orderIndex )
			{
				case 1:	//不叫
				{
					LandCEMusic.playNotCallBankerEf();
					rt = player.Image_nocall;
					break;
				}
				case 2:	//不抢
				{
					LandCEMusic.playNotRodBankerEf();
					rt = player.Image_norob;
					break;
				}
				case 3:	//叫
				{
					LandCEMusic.playCallBankerEf();
					rt = player.Image_call;
					break;
				}
				case 4:	//抢
				{
					LandCEMusic.playRodBankerEf();
					rt = player.Image_rob;
					break;
				}
				default:
					break;
			}

			return rt;
		},

		/**
		 * 开始游戏
		 * @param data
		 *{"type":"CMD_S_Game_Start","wBankerUser":0,"wCurrentUser":0,"cbCardData":[6,61,28,59,43,27,11,26,57,41,56,24,23,7,37,52,35,21,36,3]}
		 */
		//laiziStart:function(data)
		//{
		//	sparrowDirector.gameLayer.countDownLayer.startCountDown(data.wBankerUser);
		//	if ( data.wBankerUser == sparrowDirector.gameData.myChairIndex )
		//	{
		//		//出牌
		//		sparrowDirector.gameLayer.orderLayer.refreshTextures();
		//		sparrowDirector.gameLayer.orderLayer.setOutPukerBtnEnable();
		//	}
		//	this.resetData();
		//},

		resetData:function()
		{
			this.infoLayer.removeAllChildren();
			this.orderType = 0;
		},

		setOrderType:function(_orderType)
		{
			this.orderType = _orderType;

			//0叫地主，1强地主， 2明牌
			switch (this.orderType)
			{
				case 0:
				{
					this.layer_land_call.visible = true;
					this.layer_land_rob.visible = false;
					this.layer_land_showcard.visible = false;
					break;
				}
				case 1:
				{
					this.layer_land_call.visible = false;
					this.layer_land_rob.visible = true;
					this.layer_land_showcard.visible = false;
					break;
				}
				case 2:
				{
					this.layer_land_call.visible = false;
					this.layer_land_rob.visible = false;
					this.layer_land_showcard.visible = true;
					break;
				}
				default:
					break;
			}

		},

		//隐藏欢乐场命令
		hideViewEx:function()
		{
			this.Image_call.visible = false;
			this.Image_rob.visible = false;
			this.Image_nocall.visible = false;
			this.Image_norob.visible = false;

			this.hideView();
		},

		//隐藏欢乐场命令
		hideTip:function()
		{
			this.Image_call.visible = false;
			this.Image_rob.visible = false;
			this.Image_nocall.visible = false;
			this.Image_norob.visible = false;

		},

		//隐藏欢乐场命令
		hideView:function()
		{
			this.layer_land_call.visible = false;
			this.layer_land_rob.visible = false;
			this.layer_land_showcard.visible = false;
		},


		//显示欢乐场命令
		showView:function()
		{
			this.layer_land_call.visible = true;
			this.layer_land_rob.visible = true;
			this.layer_land_showcard.visible = true;
		}
	});


//结算界面
var ResultLayer = cc.Layer.extend(
	{
		ctor:function()
		{
			this._super();
			this.setVariable();
			this.initResultUILayer();
			this.initStraightLayer();
			this.zinit();
			//this.addUI();
			this.addCocosUI();
			this.hideUI();
		},
		setVariable:function()
		{
			this.resultScore = 0;
			this.currentRoom = null;//当前所在房间
		},
		zinit:function()
		{
			this.setContentSize(winSize);
		},
		initResultUILayer:function()
		{
			this.ui = ccs.load("res/landlord/cocosOut/ResultUILayer.json").node;
			this.addChild(this.ui, 0);
			var offset = (this.ui.getContentSize().width * winSize.height / 640 - winSize.width) / 2;
			this.ui.x -= offset;

			this.layer_btn_happy = ccui.helper.seekWidgetByName(this.ui, "layer_happy");
			this.layer_btn_default = ccui.helper.seekWidgetByName(this.ui, "layer_default");

			if(Is_HAPPY_ROOM())
			{
				this.layer_btn_happy.visible = true;
				this.layer_btn_default.visible = false;

				//继续 + 明牌
				{
					this.layer_continue = ccui.helper.seekWidgetByName(this.layer_btn_happy, "layer_continue");
					this.layer_continue.visible = false;

					var btn_continue = ccui.helper.seekWidgetByName(this.layer_continue, "btn_continue");
					btn_continue.setPressedActionEnabled(true);
					btn_continue.addTouchEventListener(this.continueGame, this);

					//var btn_continue_showcard = ccui.helper.seekWidgetByName(this.layer_continue, "btn_continue_showcard");
					//btn_continue_showcard.setPressedActionEnabled(true);
					//btn_continue_showcard.addTouchEventListener(this.continueGame_showCard, this);
				}

				//继续 + 明牌 + 晋升高级场
				{
					this.layer_continue_up = ccui.helper.seekWidgetByName(this.layer_btn_happy, "layer_continue_up");
					this.layer_continue_up.visible = false;

					var btn_continue = ccui.helper.seekWidgetByName(this.layer_continue_up, "btn_continue");
					btn_continue.setPressedActionEnabled(true);
					btn_continue.addTouchEventListener(this.continueGame, this);

					//var btn_continue_showcard = ccui.helper.seekWidgetByName(this.layer_continue_up, "btn_continue_showcard");
					//btn_continue_showcard.setPressedActionEnabled(true);
					//btn_continue_showcard.addTouchEventListener(this.continueGame_showCard, this);

					var btn_continue_up = ccui.helper.seekWidgetByName(this.layer_continue_up, "btn_continue_up");
					btn_continue_up.setPressedActionEnabled(true);
					btn_continue_up.addTouchEventListener(this.continueGame01, this);
				}

				//晋升高级场
				{
					this.layer_up = ccui.helper.seekWidgetByName(this.layer_btn_happy, "layer_up");
					this.layer_up.visible = false;

					var btn_continue_up = ccui.helper.seekWidgetByName(this.layer_up, "btn_continue_up");
					btn_continue_up.setPressedActionEnabled(true);
					btn_continue_up.addTouchEventListener(this.continueGame01, this);

				}
			}
			else
			{
				this.layer_btn_happy.visible = false;
				this.layer_btn_default.visible = true;

				//继续
				{
					this.layer_continue = ccui.helper.seekWidgetByName(this.layer_btn_default, "layer_continue");
					this.layer_continue.visible = false;

					var btn_continue = ccui.helper.seekWidgetByName(this.layer_continue, "btn_continue");
					btn_continue.setPressedActionEnabled(true);
					btn_continue.addTouchEventListener(this.continueGame, this);
				}

				//继续 + 晋升高级场
				{
					this.layer_continue_up = ccui.helper.seekWidgetByName(this.layer_btn_default, "layer_continue_up");
					this.layer_continue_up.visible = false;

					var btn_continue = ccui.helper.seekWidgetByName(this.layer_continue_up, "btn_continue");
					btn_continue.setPressedActionEnabled(true);
					btn_continue.addTouchEventListener(this.continueGame, this);

					var btn_continue_up = ccui.helper.seekWidgetByName(this.layer_continue_up, "btn_continue_up");
					btn_continue_up.setPressedActionEnabled(true);
					btn_continue_up.addTouchEventListener(this.continueGame01, this);
				}

				//晋升高级场
				{
					this.layer_up = ccui.helper.seekWidgetByName(this.layer_btn_default, "layer_up");
					this.layer_up.visible = false;

					var btn_continue_up = ccui.helper.seekWidgetByName(this.layer_up, "btn_continue_up");
					btn_continue_up.setPressedActionEnabled(true);
					btn_continue_up.addTouchEventListener(this.continueGame01, this);
				}
			}
		},
		initStraightLayer:function()
		{
			this.StraightLayer = ccs.load("res/landlord/cocosOut/DeskStraight.json").node;
			this.StraightLayer.ignoreAnchorPointForPosition(false);
			this.StraightLayer.setAnchorPoint(0.5,0.5);
			this.StraightLayer.setPosition(winSize.width/2,winSize.height/2);
			this.ui.addChild(this.StraightLayer, this.layer_btn_happy.getZOrder());
			this.StraightLayer.visible = false;

			this.Straight_fnt_wintitle = ccui.helper.seekWidgetByName(this.StraightLayer, "fnt_wintitle");			//连胜文字
			this.Straight_fnt_failtitle = ccui.helper.seekWidgetByName(this.StraightLayer, "fnt_failtitle");		//连胜失败文字
			this.Straight_Panel_threewins = ccui.helper.seekWidgetByName(this.StraightLayer, "Panel_threewins");	//连胜次数小于3的进度条
			this.Straight_loadingBar_win = ccui.helper.seekWidgetByName(this.StraightLayer, "loadingBar_win");		//进度条
			this.Straight_text_threewins = ccui.helper.seekWidgetByName(this.StraightLayer, "text_threewins");		//进度
			this.Straight_Panel_uptw = ccui.helper.seekWidgetByName(this.StraightLayer, "Panel_uptw");				//连胜次数大于3的奖励
			this.Straight_fnt_prize = ccui.helper.seekWidgetByName(this.StraightLayer, "fnt_prize");				//获取的奖励数量
			this.Straight_Image_prize_model = ccui.helper.seekWidgetByName(this.StraightLayer, "Image_prize_model");//奖励是奖牌
			this.Straight_Image_prize_gold = ccui.helper.seekWidgetByName(this.StraightLayer, "Image_prize_gold");	//奖励是金币
		},
		addCocosUI:function()
		{
			//this.ui = ccs.load("res/landlord/cocosOut/ResultUILayer.json").node;
			//this.ui.addChild(new cc.LayerColor(cc.color(0,0,0,150)),-1);
			//this.addChild(this.ui, 0);
			//var offset = (this.ui.getContentSize().width * winSize.height / 640 - winSize.width) / 2;
			//this.ui.x -= offset;
			//this.ui.visible = false;

			this.layer_chest = ccui.helper.seekWidgetByName(this.ui, "layer_chest");
			this.layer_chest.visible = false;

			//价钱
			this.practice = ccui.helper.seekWidgetByName(this.ui, "title_0_1");
			this.practiceGoldTxt = ccui.helper.seekWidgetByName(this.ui, "title_0");

			this.dijiBtn = ccui.helper.seekWidgetByName(this.layer_chest, "dijiBtn");
			this.libaoBtn = ccui.helper.seekWidgetByName(this.layer_chest, "libaoBtn");
			this.closeBtn = ccui.helper.seekWidgetByName(this.layer_chest, "closeBtn");

			this.dijiBtn.addTouchEventListener(this.continueGame01, this);
			this.libaoBtn.addTouchEventListener(this.libaoBtnEvent, this);
			this.closeBtn.addTouchEventListener(this.outGameCallFunc, this);
		},
		//刷新购买金币
		refreshByGoldNumAndValue:function(SortID)
		{

			lm.log("sortid------------ "+SortID);
			switch (SortID)
			{
				case 1:
					this.practice.setString("￥6");
					this.practiceGoldTxt.setString("150000金币");
					break;

				case 2:
					this.practice.setString("￥6");
					this.practiceGoldTxt.setString("150000金币");
					break;

				case 3:
					this.practice.setString("￥30");
					this.practiceGoldTxt.setString("750000金币");
					break;

				case 4:
					this.practice.setString("￥30");
					this.practiceGoldTxt.setString("750000金币");
					break;

				default :
					break;
			}
		},
		addUI:function()
		{
			var gap = 50;
			var gapY = 50;
			//继续游戏
			var continueBtn = ccui.Button.create("desk028.png","","",1);
			continueBtn.setPosition(winSize.width/3+gap, winSize.height/3 + gapY);
			this.addChild(continueBtn, 10);
			//晋升高级场
			var upBtn = ccui.Button.create("desk037.png","","",1);
			upBtn.setPosition(winSize.width*2/3-gap, winSize.height/3 + gapY);
			this.addChild(upBtn, 10);
			var continueBtn_showCard = ccui.Button.create("20_table_btnmpstart.png","","",1);
			continueBtn_showCard.setPosition(winSize.width/2, winSize.height*2/3);
			this.addChild(continueBtn_showCard, 10);

			continueBtn_showCard.addTouchEventListener(this.continueGame_showCard, this);
			continueBtn.addTouchEventListener(this.continueGame, this);

			upBtn.addTouchEventListener(this.continueGame01, this);

			continueBtn_showCard.visible = false;
			continueBtn.visible = false;
			upBtn.visible = false;
			this.cotinueBtn_showCard = continueBtn_showCard;
			this.cotinueBtn = continueBtn;
			this.upBtn = upBtn;
		},

		resetStraightLayer:function()
		{
			lm.log("resetStraightLayer");
			if(sparrowDirector.continueWinData == "")
			{
				lm.log("resetStraightLayer 1");
				this.StraightLayer.visible = false;
			}
			else
			{
				lm.log("resetStraightLayer 2");
				this.StraightLayer.visible = true;
				//连胜标题
				if(sparrowDirector.continueWinData.wContinueWinCount == 0)
				{
					lm.log("resetStraightLayer 3");
					this.Straight_fnt_failtitle.visible = true;
					this.Straight_fnt_wintitle.visible = false;
				}
				else
				{
					lm.log("resetStraightLayer 4");
					this.Straight_fnt_failtitle.visible = false;
					this.Straight_fnt_wintitle.visible = true;
					this.Straight_fnt_wintitle.setString(sparrowDirector.continueWinData.wContinueWinCount + "连胜");
				}

				//连胜目标
				if(sparrowDirector.continueWinData.wContinueWinCount < 3)
				{
					lm.log("resetStraightLayer 5");
					this.Straight_Panel_threewins.visible = true;
					this.Straight_Panel_uptw.visible = false;

					this.Straight_loadingBar_win.setPercent(sparrowDirector.continueWinData.wContinueWinCount/3);
					this.Straight_text_threewins.setString(sparrowDirector.continueWinData.wContinueWinCount + "/3")
				}
				else	//连胜奖励
				{
					lm.log("resetStraightLayer 6");
					this.Straight_Panel_threewins.visible = false;
					this.Straight_Panel_uptw.visible = true;

					this.Straight_fnt_prize.setString("x" + sparrowDirector.continueWinData.lPrizeCount);

					if(sparrowDirector.continueWinData.cbPrizeType == 1)	//金币
					{
						lm.log("resetStraightLayer 7");
						this.Straight_Image_prize_gold.visible = true;
						this.Straight_Image_prize_model.visible = false;
					}
					else if(sparrowDirector.continueWinData.cbPrizeType == 2)	//奖牌
					{
						lm.log("resetStraightLayer 8");
						this.Straight_Image_prize_gold.visible = false;
						this.Straight_Image_prize_model.visible = true;
					}

					this.scheduleOnce(function()
					{
						sparrowDirector.SendUserInfoReq(userInfo.globalUserdData["dwUserID"]);

					}, 1);
				}
				sparrowDirector.continueWinData = "";
			}

		},
		getRusultUIEffect:function(scoreArr, isLostGold)
		{
			var self = this;
			this.scheduleOnce(function()
			{
				if ( scoreArr.length < 3 ){return;}
				var player01 = sparrowDirector.gameLayer.playerLayer.getChildByTag(100);
				var player02 = sparrowDirector.gameLayer.playerLayer.getChildByTag(200);
				var player03 = sparrowDirector.gameLayer.playerLayer.getChildByTag(300);
				if ( player01 )
				{
					player01.playResultGoldAnimate(scoreArr[player01.data.wChairID]);
				}
				if ( player02 )
				{
					player02.playResultGoldAnimate(scoreArr[player02.data.wChairID]);
				}
				if ( player03 )
				{
					player03.playResultGoldAnimate(scoreArr[player03.data.wChairID]);
				}

			}, 0);
			this.scheduleOnce(function()
			{
				self.resetStraightLayer();
				sparrowDirector.gameLayer.pukerLayer.resetData();
				sparrowDirector.gameLayer.playerLayer.visible = false;
				sparrowDirector.gameLayer.playerLayer.removeAllChildren();

				sparrowDirector.gameLayer.deskLayer.showGameOverCountDown(true);
				//self.cotinueBtn.scale = 0;
				//self.upBtn.scale = 0;
				//if(Is_HAPPY_ROOM())
				//	self.cotinueBtn_showCard.visible = true;
				//self.cotinueBtn.visible = true;
				//self.upBtn.visible = true;
				//self.dijiBtn.visible = true;
                //
				//var gap = 50;
				//var gapY = 50;
				//判断当前玩家金币是否高于当前房间金币上限，或者低于当前房间准入金币
				var resultType = this.jugementResultRoomSelected();
				lm.log("resulttype============ "+resultType);
				switch ( resultType )
				{
					case -2:
						//金币不足以进入初级场
						self.layer_continue.visible = true;

						//判断救济金可领取 则弹出领取救济金窗口
						if(UserInfo.dwReliefCountOfDayMax - UserInfo.dwReliefCountOfDay > 0)
						{
							var pop = new ReliefPop(this);
							pop.addToNode(cc.director.getRunningScene());
							//pop.setCallback(function(){},function()
							//{
							//	self.outGameCallFunc();
							//})
						}
						else
						{
							if(UserInfo.cbPay != 0) //非首冲
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

								var currentRoom = function()
								{
									for ( var i = 0; i < goldRoomData.length; i++ )
									{
										var gold = goldRoomData[i];

										if ( sparrowDirector.currentRoomServerId == gold.serverlist[0].serverid )
										{
											return gold;
										}
									}
									return goldRoomData[goldRoomData.length-1];
								}();
																
								var pop = new QuickPop(this, currentRoom["SortID"]);	//暂时写为新手场
								pop.addToNode(cc.director.getRunningScene());
								pop.setCallback(function(){},function()
								{
									self.outGameCallFunc();
								})
							}
							else
							{
								var pop = new FisrtPayPop(this);
								pop.addToNode(cc.director.getRunningScene());
								pop.setCallback(function(){},function()
								{
									self.outGameCallFunc();
								})
							}
						}


						break;
					case 0://继续//this.layer_continue
						self.layer_continue.visible = true;
						self.layer_chest.visible = false;
						//startPlayerActions(self.cotinueBtn);
						//self.cotinueBtn.setPosition(winSize.width/2, winSize.height/3 + gapY);
						break;

					case 1://晋升高级场＋继续
						self.layer_continue_up.visible = true;
						//startPlayerActions(self.cotinueBtn);
						//startPlayerActions(self.upBtn);
						//self.upBtn.setPosition(winSize.width*2/3-gap, winSize.height/3 + gapY);
						//self.cotinueBtn.setPosition(winSize.width/3+gap, winSize.height/3 + gapY);
						break;

					case -1://去低级场
						//startPlayerActions(self.dijiBtn);
						self.layer_continue.visible = true;
						self.layer_chest.visible = true;
						break;

					case 2://晋升高级场
						self.layer_up.visible = true;
						//startPlayerActions(self.upBtn);
						//self.upBtn.setPosition(winSize.width/2, winSize.height/3 + gapY);
						break;
				}
				//清除除玩家以外的其他玩家
				var arr = sparrowDirector.gameData.playerInfo;
				(function()
				{
					for ( var i = 0; i < sparrowDirector.gameData.playerInfo.length; i++ )
					{
						lm.log(sparrowDirector.gameData.playerInfo[i].dwUserID+" -------zfsflahsshshshhshshs------- "+userInfo.globalUserdData["dwUserID"])
						if ( sparrowDirector.gameData.playerInfo[i].dwUserID == userInfo.globalUserdData["dwUserID"] )
						{
							continue;
						}
						else
						{
							sparrowDirector.gameData.playerInfo.splice(i, 1);
							arguments.callee();
						}
					}
				})();
			}, 8);
		},
		//退出游戏
		outGameCallFunc:function()
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
		},
		showResultAnimation:function(score)
		{
			this.resultScore = score;
			this.showResultAnimation01();
			//this.scheduleOnce(this.showResultAnimation01, 3);

		},
		showResultAnimation01:function()
		{
			var score = this.resultScore;
			var resultA = this.getChildByTag(12345);
			if ( resultA )
			{
				resultA.removeFromParent();
			}

			var resultAnimate;
			if ( score <= 0 )
			{
				resultAnimate = PlayUIAnimate("res/landlord/cocosOut/Anim_shibai.json",0,321,false);
				LandCEMusic.playLostEf();
			}
			else
			{
				resultAnimate = PlayUIAnimate("res/landlord/cocosOut/Anim_shengli.json",0,301,false);
				LandCEMusic.playWinEf();
			}
			resultAnimate.setPosition(winSize.width/2, winSize.height/2);
			this.addChild(resultAnimate, 0, 12345);
		},
		/**
		 * 游戏结束
		 * @param data
		 * 癞子结束数据 {"type":"CMD_S_GameConclude","lCellScore":10,"lGameScore":[-320,0,160],"bChunTiam":0,"bFanChunTian":0,"cbBombCount":1,
		 * "cbEachBombCount":[0,0,1],"cbCardCount":[16,17,15],"cbHandCardData":[33,34,45,44,12,59,42,55,7,53,37,52,20,4,35,3,78,29,13,60,28,43,27,11,58,26,39,54,22,6,5,36,19,9,25,41,57,50,18,2,49,17,1,61,10,23,21,51,0,0,0,0,0,0]}
		 */
		refreshTextures:function(data)
		{
			var self = this;
			this.scheduleOnce(function()
			{
				self.refreshTextures01(data);
			}, 1);
		},
		refreshTextures01:function(data)
		{
			// 欢乐斗地主结束
			// {"type":"CMD_S_GameConclude","lCellScore":0,"lGameScore":[0,0,0],"wTotalAddTimes":0,"bChunTiam":0,"bFanChunTian":0,"cbBombCount":0,"cbEachBombCount":[0,0,0],"cbCardCount":[17,17,17],"cbHandCardData":[1,45,44,12,43,58,42,26,25,24,53,37,21,5,36,35,3,50,34,2,33,17,61,29,13,60,11,57,41,38,52,20,4,19,79,78,18,49,28,27,10,9,56,8,55,39,23,7,54,22,6,0,0,0]}
			sparrowDirector.gameLayer.deskLayer.showRandomTask(false);//隐藏随机任务
			sparrowDirector.gameLayer.deskLayer.hideTxtTipImage();
			this.visible = true;
			var score = data.lGameScore[sparrowDirector.gameData.myChairIndex];
			score = Number(score);
			lm.log("sparrowDirector.gameData.accessGold============= "+score);
			var lScore = userInfo.globalUserdData["lUserScore"];
			lm.log("sparrowDirector.gameData.accessGold============= "+lScore);

			//炸弹个数
			var bomdCount = function()
			{
				var bbcc = data.cbEachBombCount;
				var bbct = 0;
				for ( var i = 0; i < bbcc.length; i++ )
				{
					bbct += bbcc[i];
				}
				//判断玩家是否逃跑，逃跑则加倍
				if (sparrowDirector.gameLayer.deskLayer.count01 != 0 && sparrowDirector.gameLayer.deskLayer.count02 != 0 && sparrowDirector.gameLayer.deskLayer.count03 != 0 )
				{
					bbct++;
				}
				return bbct;
			}();

			var cbb = bomdCount  > 0 ? Math.pow(2, bomdCount)  : 1;
			var bc  = data.bChunTiam    > 0 ? Math.pow(2, data.bChunTiam)    : 1;
			var fbc = data.bFanChunTian > 0 ? Math.pow(2, data.bFanChunTian) : 1;
			if ( Is_LAIZI_ROOM() )
			{
				var mp = function()
				{
					var mpRusult = 1;
					var a = sparrowDirector.gameData.currentMPCountThrid;
					var b = sparrowDirector.gameData.currentMPCountSecond;
					var c = sparrowDirector.gameData.currentMPCountFirst;
					if ( c > 0 )
					{
						mpRusult *= c;
					}
					if ( b > 0 )
					{
						mpRusult *= b;
					}
					if ( a > 0 )
					{
						mpRusult *= a;
					}
					return mpRusult;
				}();//明牌
				var bsun = Math.pow(2,sparrowDirector.gameData.currentAddCount-1)*Math.pow(2,sparrowDirector.gameData.currentRodCount-1);//抢地主，加倍
				var beisuNumber = sparrowDirector.gameData.currentCallScore*cbb*bc*fbc*bsun*mp;

				lm.log("-------------------zhoufangsheng------------------laizi"+bsun+" "+data.cbBombCount+"  "+data.bChunTiam+"  "+data.bFanChunTian+" "+beisuNumber+" "+mp);
			}
			else
			{
				var beisuNumber = sparrowDirector.gameData.currentCallScore*cbb*bc*fbc*sparrowDirector.taskTimes;

			}
			//sparrowDirector.gameLayer.deskLayer.calledscore.setString(beisuNumber);
			sparrowDirector.gameData.currentCallScore = 1;
			sparrowDirector.gameData.currentCallScore01 = 1;
			sparrowDirector.gameData.currentAddCount  = 1;
			sparrowDirector.gameData.currentRodCount  = 1;
			sparrowDirector.gameData.currentMPCountThrid = 0;
			sparrowDirector.gameData.currentMPCountSecond = 0;
			sparrowDirector.gameData.currentMPCountFirst = 0;
			sparrowDirector.gameData.isCanOutPuker = false;

			//剩余扑克显示
			var pukerLast = data.cbCardCount;
			var pukerList01 = data.cbHandCardData.slice(0, pukerLast[0]);
			var pukerList02 = data.cbHandCardData.slice(pukerLast[0], pukerLast[0]+pukerLast[1]);
			var pukerList03 = data.cbHandCardData.slice(pukerLast[0]+pukerLast[1], pukerLast[0]+pukerLast[1]+pukerLast[2]);
			sparrowDirector.gameLayer.pukerLayer.resetData();
			for ( var i = 0; i < 3; i++ )
			{
				var direction = i;
				if ( sparrowDirector.gameData.myChairIndex == 0 )
				{
					this.showGameEndPuker(direction, pukerList02, pukerList03);
				}
				else if ( sparrowDirector.gameData.myChairIndex == 1 )
				{
					this.showGameEndPuker(direction, pukerList03, pukerList01);
				}
				else if ( sparrowDirector.gameData.myChairIndex == 2 )
				{
					this.showGameEndPuker(direction, pukerList01, pukerList02);
				}
			}

			//金币不足，退出房间
			lm.log("sparrowDirector.gameData.accessGold============= "+sparrowDirector.gameData.accessGold);
			lm.log("sparrowDirector.gameData.accessGold============= "+lScore);
			//sparrowDirector.gameData.accessGold = 0;
			var isLostGold = false;
			if ( lScore < sparrowDirector.gameData.accessGold || sparrowDirector.gameData.accessGold == 0)
			{
				isLostGold = true;
			}
			this.getRusultUIEffect(data.lGameScore, isLostGold);
			this.showResultAnimation(score);
		},
		showGameEndPuker:function(direction, pukerList03, pukerList02)
		{
			var gap = 45;
			var outScale = 0.4;
			if ( direction == 2 )
			{
				for ( var j = 0; j < pukerList03.length; j++ )
				{
					var card = new GameCard();
					card.createPuker(pukerList03[j]);
					card.scale = outScale;
					sparrowDirector.gameLayer.pukerLayer.pukerPlane.addChild(card, pukerList03.length - j+200000);
					var xx = Control_pos.right.x -70 - (gap-25)*j;
					var yy = Control_pos.right.y - 70;
					card.setPosition(xx, yy);
				}
			}
			if ( direction == 1 )
			{
				for ( var j = 0; j < pukerList02.length; j++ )
				{
					var card = new GameCard();
					card.createPuker(pukerList02[j]);
					card.scale = outScale;
					sparrowDirector.gameLayer.pukerLayer.pukerPlane.addChild(card, j+200000);
					var xx = Control_pos.left.x - 80 + (gap-25)*j;
					var yy = Control_pos.left.y - 70;
					card.setPosition(xx, yy);
				}
			}
		},
		showBaoxiang:function()
		{
			//this.baoxiang.visible = true;
		},
		hideBaoxiang:function()
		{
			//this.baoxiang.visible = false;
		},
		jugementResultRoomSelected:function()
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
				//获取房间的在线人数 准入金额的上下限。
				var roomViewData = GameServerKind.GetRoomViewData(gold);
				goldRoomData[i].topGoldNum = roomViewData.lMaxTableScore;
				goldRoomData[i].besGoldNum = roomViewData.lMinTabScore;
				//高一级场次的准入金币值
				var goldNext = goldRoomData[i-1];
				if ( goldNext )
				{
					var roomViewDataNext = GameServerKind.GetRoomViewData(goldNext);
					goldRoomData[i].upRoomGoldBeseNum = roomViewDataNext.lMinTabScore;
				}
				else
				{
					goldRoomData[i].upRoomGoldBeseNum = 0;
				}

				lm.log("roomViewData============================ "+JSON.stringify(roomViewData));
				lm.log("roomViewData============================ "+JSON.stringify(roomViewData.lMinTabScore));
				lm.log("roomViewData============================ "+JSON.stringify(roomViewData.lMaxTableScore));

				//判断是否没有上限标志
				var regexp02 = /以上/;
				var isNotTop = str.match(regexp02);
				goldRoomData[i].isNotTop = isNotTop;
			}

			if ( playerGold < goldRoomData[goldRoomData.length-1].besGoldNum)
			{
				this.currentRoom = goldRoomData[goldRoomData.length-1];
				this.refreshByGoldNumAndValue(this.currentRoom.SortID);
				//金币不足以进入初级场
				return -2;
			}

			lm.log("goldRoomData============================ "+JSON.stringify(goldRoomData));
			//找到当前房间
			var currentRoom = function()
			{
				for ( var i = 0; i < goldRoomData.length; i++ )
				{
					var gold = goldRoomData[i];
					lm.log("-------goldserverid======= "+gold.serverlist[0].serverid+" ------- "+sparrowDirector.tempRoomServerId+" ------------- "+sparrowDirector.currentRoomServerId);

					if ( sparrowDirector.currentRoomServerId == gold.serverlist[0].serverid )
					{
						return gold;
					}
				}
				return goldRoomData[goldRoomData.length-1];
			}();
			this.currentRoom = currentRoom;
			this.refreshByGoldNumAndValue(this.currentRoom.SortID);


			lm.log("获得当前最佳推荐房间数据result "+JSON.stringify(currentRoom));
			lm.log("playerGold获得当前最佳推荐房间数据result "+JSON.stringify(playerGold));
			//跳转到最佳房间,type:-1低级场，0当前场，1晋升高级场＋继续，2:晋升高级场
			var type = 0;
			if ( currentRoom.topGoldNum != 0)
			{
				//房间金币有上限值的情况
				if ( playerGold < currentRoom.besGoldNum )
				{
					//玩家金币小于当前房间下限值，去低级场
					type = -1;
				}
				else if ( playerGold >= currentRoom.topGoldNum )
				{
					//玩家金币高于当前房间金币上限，晋升高级场
					type = 2;
				}
				else if ( playerGold > currentRoom.besGoldNum && playerGold > currentRoom.upRoomGoldBeseNum )
				{
					//玩家金币低于当前房间最高上限，同时达到高一级房间准入下限
					type = 1;
				}
				else if ( playerGold > currentRoom.besGoldNum && playerGold < currentRoom.upRoomGoldBeseNum )
				{
					//仅满足当前房间金币限制条件，继续游戏
					type = 0;
				}
			}
			else
			{
				//房间金币没有上限值的情况
				if ( playerGold < currentRoom.besGoldNum )
				{
					//玩家金币小于当前房间下限值，去低级场
					type = -1;
				}
				else if ( playerGold >= currentRoom.upRoomGoldBeseNum && currentRoom.upRoomGoldBeseNum != 0 )
				{
					//达到高一级场次准入金币－继续，晋升高级场
					type = 1;
				}
				else
				{
					//仅满足当前房间金币限制条件，继续游戏
					type = 0;
				}
			}

			lm.log("type------------------sdfasdfasf"+type);
			return type;

		},
		//开宝箱
		openBaoxiangEvent:function(target, state)
		{
			if ( state == ccui.Widget.TOUCH_ENDED )
			{
				//this.hideBaoxiang();
				if (Number(GetDeviceType()) == DeviceType.ANDROID) {
					// android 端购买待增加
					webMsgManager.SendGpGetOrderData(DefultIdentifier,function(data)
					{
						// 保存本地订单
						userInfo.AppendOrderData(userInfo.globalUserdData["dwUserID"],
							data["orderid"],
							data["approductid"],
							data["orderamount"],
							data["appletransaction"],
							data["orderstatus"]);

						lm.log("before Trans price = 6"  + "name = 金币"  + " 订单号为: " + data["orderid"]);

						//hanhu #针对联通渠道调用接口传递MAC,IME 2015/11/11
						var ChannelID = jsb.reflection.callStaticMethod("com/ljapps/p2685/AppActivity", "getAndroidVersion", "()I");

						//hanhu #自有渠道使用自定义方式进行支付 2015/10/20
						if(ChannelLabel == CHANNELLABELS.ANDROID_DEFAULT && ChannelID != ChanelID.ANDROID_UNICOM  && ChannelID != ChanelID.ANDROID_UNICOM4GOOPERATION)
						{
							jsb.reflection.callStaticMethod("com/ljapps/p2685/AppActivity", "BuyItemMyself", "(Ljava/lang/String;ILjava/lang/String;I)V", data["orderid"], 1, "金币", 6);
						}
						else if(ChannelID == ChanelID.ANDROID_UNICOM || ChannelID == ChanelID.ANDROID_UNICOM4GOOPERATION) //hanhu #联通需先完成订单信息
						{
							var IME = jsb.reflection.callStaticMethod("com/ljapps/p2685/AppActivity", "getAndroidIME", "()Ljava/lang/String;");
							var MAC = jsb.reflection.callStaticMethod("com/ljapps/p2685/AppActivity", "getAndroidMAC", "()Ljava/lang/String;");
							webMsgManager.SendGetCompleteOerderInfo(DefultIdentifier, data["orderid"], IME, MAC, function(res){
								lm.log("成功完成订单信息，发送支付请求");
								jsb.reflection.callStaticMethod("com/ljapps/p2685/AppActivity", "BuyItemMyself", "(Ljava/lang/String;ILjava/lang/String;I)V", data["orderid"], 1, "6元金币套餐", 6);
							},function(res){
								lm.log("完成订单信息失败 data = " + JSON.stringify(res));
								layerManager.PopTipLayer(new PopAutoTipsUILayer("生成订单信息失败，请稍后重试！", DefultPopTipsTime));
							},this);
						
						}else if(ChannelLabel == CHANNELLABELS.ANDROID_BAIDU_SINGLE){
                            lm.log("调用百度单机支付接口");
                            jsb.reflection.callStaticMethod(AndroidPackageName,"BuyItemMyself","(Ljava/lang/String;Ljava/lang/String;I)V", data["onlineid"]+"", "6元金币套餐", 6);

                        }
						
               				 //电信入口
               				 else  if(ChannelLabel == CHANNELLABELS.ANDROID_TELCOM)
                			 {
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
                    NewWebMsgManager.SendGetTelcomCode("",imsi,data["orderid"], "6元金币套餐", function(data2) {

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
						else
						{
							//请求支付
							RequestPayment(1,data["orderid"],1, "金币", 6, 150000);
						}

						//hanhu #统计购买事件 2015、10、19
						var through = 2;
						if(ChannelLabel == CHANNELLABELS.ANDROID_360)
						{
							through = payThrough.qihu;
						}
						else
						{
							through = payThrough.alipay
						}
						jsb.reflection.callStaticMethod("com/ljapps/p2685/AppActivity", "payForItem", "(FLjava/lang/String;IFI)V", price, name, 1, price * 25000, through);

					}, function(errinfo)
					{
						// 连接服务器失败，请稍后重试；
						layerManager.PopTipLayer(new PopAutoTipsUILayer("获取产品信息失败，请稍后重试！", DefultPopTipsTime));

					},this);
				}
				else
				{
					layerManager.PopTipLayer(new WaitUILayer("正在购买，请稍后..."));
					console.log("购买金币");

					if(GET_CHANEL_ID() == ChanelID.IOS_BREAKOUT)
					{
						webMsgManager.SendGpGetOrderData(DefultIdentifier,function(data)
						{
							// 保存本地订单
							userInfo.AppendOrderData(userInfo.globalUserdData["dwUserID"],
								data["orderid"],
								data["approductid"],
								data["orderamount"],
								data["appletransaction"],
								data["orderstatus"]);

							//请求支付
							RequestPayment(data["orderid"],"6元金币套餐",1, 6,AppPayCallBackName);

						}, function(errinfo)
						{
							// 连接服务器失败，请稍后重试；
							layerManager.PopTipLayer(new PopAutoTipsUILayer("获取产品信息失败，请稍后重试！", DefultPopTipsTime));

						},this);
					}
					else
					{
						AddRequestProduct(DefultIdentifier);
						RequestProducts(MallDataType.MALL_DATA_LOSER_BUY);
					}
				}
			}
		},
		//晋升高级场,去低级场
		continueGame01:function(target, state)
		{
			if ( state == ccui.Widget.TOUCH_ENDED )
			{
				this.layer_chest.visible = false;
				sparrowDirector.gotoBestGoldRoomPlay01();
				sparrowDirector.gameLayer.orderLayer.startBtn.visible = false;
				sparrowDirector.gameData.isReadied = true;
				sparrowDirector.gameLayer.deskLayer.showGameOverCountDown(false);
				this.StraightLayer.visible = false;
				sparrowDirector.continueWinData = "";
			}
		},
		//领取礼包//TODO
		libaoBtnEvent:function(target, state)
		{
			if ( state == ccui.Widget.TOUCH_ENDED )
			{
				//this.openBaoxiangEvent("", 2);
				//layerManager.PopTipLayer(new PopAutoTipsUILayer("领取礼包借口暂时没写 哈哈哈哈哈哈！", DefultPopTipsTime),false);

				this.layer_chest.visible = false;
				quickPay(sparrowDirector.gameData.currentRommLevel);
			}
		},
		//继续游戏-明牌开始
		continueGame_showCard:function(target, state)
		{
			if ( state == ccui.Widget.TOUCH_ENDED )
			{

				//sparrowDirector.SendUserReady();
				if(sparrowDirector._sortRoomFlag)
				{
					sparrowDirector.sendSortMessage(true);
				}
				else
				{
					sparrowDirector.SendUserReady();
				}
				sparrowDirector.gameLayer.orderLayer.startBtn.visible = false;
				sparrowDirector.gameData.isReadied = true;
				sparrowDirector.gameLayer.deskLayer.showGameOverCountDown(false);
			}
		},

		//继续游戏
		continueGame:function(target, state)
		{
			if ( state == ccui.Widget.TOUCH_ENDED )
			{
				var playerGold = userInfo.globalUserdData["lUserScore"];
				if ( playerGold < this.currentRoom.besGoldNum )
				{
					sparrowDirector.gotoBestGoldRoomPlay01();
				}
				else
				{
					if(sparrowDirector._sortRoomFlag)
					{
						lm.log("sendSortMessagesendSortMessagesendSortMessagesendSortMessagesendSortMessagesendSortMessagesendSortMessagesendSortMessagesendSortMessage");
						sparrowDirector.sendSortMessage(false);
					}
					else
					{
						lm.log("SendUserReadySendUserReadySendUserReadySendUserReadySendUserReadySendUserReadySendUserReadySendUserReadySendUserReadySendUserReady");
						sparrowDirector.SendUserReady();
					}
				}

				sparrowDirector.gameLayer.orderLayer.startBtn.visible = false;
				sparrowDirector.gameData.isReadied = true;
				sparrowDirector.gameLayer.deskLayer.showGameOverCountDown(false);
				this.StraightLayer.visible = false;
				sparrowDirector.continueWinData = "";
			}
		},
		//炫耀分享
		shareGame:function(target, state)
		{
			if ( state == ccui.Widget.TOUCH_ENDED )
			{
				DataUtil.ShareWeiXin();
			}
		},
		hideUI:function()
		{
			this.layer_continue.visible = false;
			this.layer_continue_up.visible = false;
			this.layer_up.visible = false;
			this.layer_chest.visible = false;
			this.visible = false;
		}
	});




//聊天框
var chatText = cc.Node.extend({
	ctor: function (isFace, chatDirection, color, chatContent) {
		this._super();

		this.parentView = ccs.load("res/landlord/cocosOut/DeskchatNode.json").node;
		this.addChild(this.parentView);
		this.parentView.ignoreAnchorPointForPosition(false);
		this.parentView.setAnchorPoint(0.5,0.5);

		//背景
		var chatBg = ccui.helper.seekWidgetByName(this.parentView, "Image_chatBg");
		var text_chat = ccui.helper.seekWidgetByName(this.parentView, "text_chat");
		var icon_chat = ccui.helper.seekWidgetByName(this.parentView, "icon_chat");

		//chatDirection = 2;
		switch (chatDirection) {
			case 0:	//自己
				var playHead = sparrowDirector.gameLayer.playerLayer.getChildByTag(100);
				if (playHead)
				{
					var pos = this.convertToNodeSpace(playHead.cardBg.getParent().convertToWorldSpace(playHead.cardBg.getPosition()));
					this.setPosition(pos.x - 0,pos.y - 0);
				}
				else
				{
					this.setPosition(100, 350);
				}
				break;

			case 1:	//右
				chatBg.setFlippedX(true);
				var playHead = sparrowDirector.gameLayer.playerLayer.getChildByTag(300);
				if (playHead)
				{
					var pos = this.convertToNodeSpace(playHead.cardBg.getParent().convertToWorldSpace(playHead.cardBg.getPosition()));
					this.setPosition(pos.x + 0,pos.y + 0);
				}
				else
				{
					this.setPosition(winSize.width - 100, 550);
				}
				break;

			case 2:	//左
				var playHead = sparrowDirector.gameLayer.playerLayer.getChildByTag(200);
				if (playHead)
				{
					var pos = this.convertToNodeSpace(playHead.cardBg.getParent().convertToWorldSpace(playHead.cardBg.getPosition()));
					this.setPosition(pos.x + 0,pos.y + 0);
				}
				else
				{
					this.setPosition(200, winSize.height / 2 + 200);
				}
				break;
		}

		if (isFace)
		{
			text_chat.visible = false;
			//表情
			icon_chat.loadTexture("expression_" + chatContent + ".png",ccui.Widget.PLIST_TEXTURE);
			if(chatDirection == 1)
				icon_chat.setPositionX(-1 * icon_chat.getPositionX());
		}
		else
		{
			icon_chat.visible = false;
			//文字
			var modifieContentArray = [];
			var numPerRow = 10;
			for (var i = 0; i < chatContent.length; i += numPerRow)
			{
				modifieContentArray.push(chatContent.substr(i, numPerRow));
			}
			var modifiedContent = modifieContentArray.join("\n");
			var contentText = ccui.Text.create(modifiedContent, "", 20);
			var contentSize = contentText.getContentSize();

			chatBg.setContentSize(cc.size(contentSize.width + 68, contentSize.height + 50));
			text_chat.setString(chatContent);
			text_chat.setContentSize(contentSize);
			text_chat.setPosition(chatBg.getContentSize().width/2,chatBg.getContentSize().height/2);
			if(chatDirection == 1)
				text_chat.setPositionX(-1 * text_chat.getPositionX());

		}

		//首先获取到玩家信息
		//chatDirection = oxNowDirector.gameLayer.betLayerr.changeBetAnimPosition(chatDirection);
		//var data = sparrowDirector.getPlayerInfo(chatDirection);

		this.runAction(cc.Sequence(cc.DelayTime(4), cc.CallFunc(function () {
			this.removeFromParent();
		}, this)))
	}
});

var popUpTalkDialog = cc.Layer.extend({
	ctor: function ()
	{
		var self = this;
		this._super();

		this.parentView = ccs.load("res/landlord/cocosOut/DeskChat.json").node;
		this.addChild(this.parentView);
		this.parentView.ignoreAnchorPointForPosition(false);
		this.parentView.setAnchorPoint(0.5,0.5);
		var winSize = cc.director.getWinSize();
		this.parentView.setPosition(winSize.width/2,winSize.height/2);

		this.org_pos = this.parentView.getPosition();

		this.initFace();
		this.initDefText();
		this.initInput();

		// close按钮
		var btn_close = ccui.helper.seekWidgetByName(this.parentView,"Button_close");
		btn_close.setPressedActionEnabled(true);
		btn_close.addTouchEventListener(function (sender, type)
		{
			if (type == ccui.Widget.TOUCH_ENDED)
			{
				self.removeFromParent();
				sparrowDirector.gameLayer.talkDialog = null;
			}

		}, this);


	},

	initInput: function()
	{
		this.layer_input = ccui.helper.seekWidgetByName(this.parentView, "layer_input");

		this.text_in = layerManager.CreateDefultEditBox(this, cc.size(494, 31), cc.p(0.5, 0.5), cc.p(485, 182), "输入聊天内容", cc.color(191, 191, 191, 240), false);
		this.text_in.setMaxLength(38);
		this.text_in.setInputMode(cc.EDITBOX_INPUT_MODE_ANY);
		this.layer_input.addChild(this.text_in);

		// close按钮
		var self = this;
		var btn_send = ccui.helper.seekWidgetByName(this.parentView,"Button_send");
		btn_send.setPressedActionEnabled(true);
		btn_send.addTouchEventListener(function (sender, type)
		{
			if (type == ccui.Widget.TOUCH_ENDED)
			{
				sparrowDirector.SendUserChat(0, 0, self.text_in.getString());
				self.removeFromParent();
				sparrowDirector.gameLayer.talkDialog = null;
			}

		}, this);

	},

	//输入框获得焦点
	editBoxEditingDidBegin: function (sender)
	{
		if(GetDeviceType() != DeviceType.ANDROID)
		{
			this.parentView.setPosition(cc.p(this.org_pos.x, this.org_pos.y + winSize.height * 0.2))
		}
	},

	//输入框失去焦点
	editBoxEditingDidEnd: function (sender)
	{
		if(GetDeviceType() != DeviceType.ANDROID)
		{
			this.parentView.setPosition(this.org_pos);
		}
	},

	initFace: function()
	{
		var ScrollView_expression = ccui.helper.seekWidgetByName(this.parentView, "ScrollView_expression");
		ScrollView_expression.setDirection(ccui.ScrollView.DIR_VERTICAL);
		ScrollView_expression.setTouchEnabled(true);

		var defultScrollItem = ccui.helper.seekWidgetByName(this.parentView, "expression");

		var itemCount = 4;
		var itemMax = 16;


		//加载文件
		ScrollView_expression.setInnerContainerSize(cc.size(ScrollView_expression.getInnerContainerSize().width, 80 * Math.ceil(itemMax / itemCount) ));
		for (var pageindex = 0; pageindex <  Math.ceil(itemMax / itemCount); pageindex++)
		{
			var customPageItem = defultScrollItem.clone();

			customPageItem.setTag(pageindex);

			customPageItem.setPositionX(ScrollView_expression.getInnerContainerSize().width / 2);
			customPageItem.setPositionY(-80 * pageindex + ScrollView_expression.getInnerContainerSize().height - customPageItem.getContentSize().height/2);
			ScrollView_expression.addChild(customPageItem);
		}

		var pageindex = 0, itemindex = 0;
		for (var i = 0; i < itemMax; i++)
		{
			// 设置item 显示数据
			itemindex = i % itemCount;
			var pageitem = ScrollView_expression.getChildByTag(pageindex);

			var button_bagitem = ccui.helper.seekWidgetByName(pageitem, "expression_item_" + itemindex);

			//道具名称
			var btn_icon = ccui.helper.seekWidgetByName(button_bagitem, "btn_icon");
			btn_icon.tag = i + 1;
			btn_icon.setSwallowTouches(false);
			btn_icon.loadTextures("expression_" + btn_icon.tag + ".png","expression_" + btn_icon.tag + ".png","",ccui.Widget.PLIST_TEXTURE);

			btn_icon.setPressedActionEnabled(true);
			btn_icon.addTouchEventListener(function(sender, type)
			{
				if (type == ccui.Widget.TOUCH_ENDED)
				{
					sparrowDirector.SendUserExpression(0, sender.tag);
					this.removeFromParent();
					sparrowDirector.gameLayer.talkDialog = null;
				}
			}, this);

			if (itemindex == (itemCount - 1))
				pageindex++;
		}

		// 计算需要隐藏的item的数量
		var needhideitemcount = ScrollView_expression.getChildrenCount() * itemCount - itemMax;
		// 隐藏剩余的item项
		for (var i = 0; i < needhideitemcount; i++)
		{
			itemindex++;

			// 从上面显示的最后索引开始隐藏
			var pageitem = ScrollView_expression.getChildByTag(ScrollView_expression.getChildrenCount() - 1);

			if (pageitem === null)
				continue;

			var panel_item = ccui.helper.seekWidgetByName(pageitem, "expression_item_" + itemindex);
			if (panel_item === null)
				continue;

			panel_item.setVisible(false);
		}

	},

	initDefText: function()
	{
		var SparrowChatTip =[
			"快点快点，时间就是金钱！",
			"不怕狼对手，就怕猪队友！",
			"哈哈哈，合作愉快！",
			"哎呀，不好意思，手滑出错了！",
			"我炸你个桃花朵朵开！"];

		var ScrollView_idiom = ccui.helper.seekWidgetByName(this.parentView, "ScrollView_idiom");
		ScrollView_idiom.setDirection(ccui.ScrollView.DIR_VERTICAL);
		ScrollView_idiom.setTouchEnabled(true);

		var defultScrollItem = ccui.helper.seekWidgetByName(this.parentView, "idiom");

		var itemMax = 5;

		//加载文件
		ScrollView_idiom.setInnerContainerSize(cc.size(ScrollView_idiom.getInnerContainerSize().width, 60 * itemMax ));
		for (var i = 0; i <  itemMax; i++)
		{
			var customPageItem = defultScrollItem.clone();

			customPageItem.setTag(i);

			customPageItem.setPositionX(ScrollView_idiom.getInnerContainerSize().width / 2);
			customPageItem.setPositionY(-60 * i + ScrollView_idiom.getInnerContainerSize().height - customPageItem.getContentSize().height/2);
			ScrollView_idiom.addChild(customPageItem);
		}

		for (var i = 0; i < itemMax; i++)
		{
			// 设置item 显示数据
			var pageitem = ScrollView_idiom.getChildByTag(i);

			var Image_idiom_bg = ccui.helper.seekWidgetByName(pageitem, "Image_idiom_bg");

			var Text_idiom = ccui.helper.seekWidgetByName(Image_idiom_bg, "Text_idiom");
			Text_idiom.setString(SparrowChatTip[i]);

			Image_idiom_bg.str = SparrowChatTip[i];
			Image_idiom_bg.setPressedActionEnabled(true);
			Image_idiom_bg.addTouchEventListener(function(sender, type)
			{
				if (type == ccui.Widget.TOUCH_ENDED)
				{
					sparrowDirector.SendUserChat(0, 0, sender.str);
					this.removeFromParent();
					sparrowDirector.gameLayer.talkDialog = null;
				}
			}, this);
		}



	},

	addToNode:function(node)
	{
		var winSize = cc.director.getWinSize();
		node.addChild(this, 9999);
		this.ignoreAnchorPointForPosition(false);
		this.setAnchorPoint(0.5,0.5);
		this.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
	}
});


var showVolumeSetting = function()
{
	var layer = cc.LayerColor.create(cc.color(0, 0, 0, 150));
	sparrowDirector.gameLayer.addChild(layer, 99999);
	setTouchListener(layer, true, function(){
			return true;
		},
		function(){

		},
		function(){
			return true;
		});

	var parentView = ccs.load("res/landlord/cocosOut/DeskSetting.json").node;
	layer.addChild(parentView);
	//hanhu #调整设置坐标 2015/08/07
	var offset = (parentView.getContentSize().width * winSize.height / 640 - winSize.width) / 2;
	parentView.x -= offset;
/*	var musicBtn = ccui.helper.seekWidgetByName(parentView,"musicBtn");
	musicBtn.addTouchEventListener(function(target, state)
	{
		if(state == ccui.Widget.TOUCH_ENDED)
		{
			var value = userInfo.GetSystemVolume(true);
			if ( !value )
			{
				userInfo.SetSystemVolume(100,true);
				cc.audioEngine.setMusicVolume(1);
				musicBtn.loadTextureNormal("btn_music_on.png", 1);
			}
			else
			{
				userInfo.SetSystemVolume(0,true);
				cc.audioEngine.setMusicVolume(0);
				musicBtn.loadTextureNormal("btn_music_off.png", 1);
			}
			lm.log("musicBtnvalue=========== "+value);
		}
	}, this);

	var effectBtn = ccui.helper.seekWidgetByName(parentView,"effectBtn");
	effectBtn.addTouchEventListener(function(target, state)
	{
		if(state == ccui.Widget.TOUCH_ENDED)
		{
			var value = userInfo.GetSystemVolume(false);
			if ( !value )
			{
				userInfo.SetSystemVolume(100,false);
				cc.audioEngine.setEffectsVolume(1);
				effectBtn.loadTextureNormal("btn_music_on.png", 1);
			}
			else
			{
				userInfo.SetSystemVolume(0,false);
				cc.audioEngine.setEffectsVolume(0);
				effectBtn.loadTextureNormal("btn_music_off.png", 1);
			}
			lm.log("effectvalue=========== "+value);
		}
	}, this);

	var value = userInfo.GetSystemVolume(false);
	if ( !value )
	{
		effectBtn.loadTextureNormal("btn_music_off.png", 1);
	}
	else
	{
		effectBtn.loadTextureNormal("btn_music_on.png", 1);
	}
	var value = userInfo.GetSystemVolume(true);
	if ( !value )
	{
		musicBtn.loadTextureNormal("btn_music_off.png", 1);
	}
	else
	{
		musicBtn.loadTextureNormal("btn_music_on.png", 1);
	}
	*/

	//音乐开关
	var btn_music = ccui.helper.seekWidgetByName(parentView,"musicBtn");
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
	var btn_effect = ccui.helper.seekWidgetByName(parentView,"effectBtn");
	var valueEffect = userInfo.GetSystemVolume(false);
	if(valueEffect >= 50)
	{
		btn_effect.loadTextures("btn_music_on.png", "btn_music_on.png", "",  1);
	}
	else if(valueEffect < 50)
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



	//退出按钮
	var ExitButton = ccui.helper.seekWidgetByName(parentView,"closeBtn");
	ExitButton.addTouchEventListener(function(sender, type)
	{
		if(type == ccui.Widget.TOUCH_ENDED)
		{
			//closePlayerActions(layer);
			layer.removeFromParent();
		}
	}, layer);
}


//玩家信息弹出框
var userInfoPopup = cc.Node.extend({
	ctor: function (data) {
		this._super();
		this.parentView = ccs.load("res/landlord/cocosOut/deskUserInfoNode.json").node;
		this.addChild(this.parentView);

		var btn_close = ccui.helper.seekWidgetByName(this.parentView, "btn_close");
		var label_name = ccui.helper.seekWidgetByName(this.parentView, "label_name");
		var playerHead = ccui.helper.seekWidgetByName(this.parentView, "playerHead");
		var label_id = ccui.helper.seekWidgetByName(this.parentView, "label_id");


		var label_sex = ccui.helper.seekWidgetByName(this.parentView, "label_sex");

		var label_winP = ccui.helper.seekWidgetByName(this.parentView, "label_winP");

		var label_gold = ccui.helper.seekWidgetByName(this.parentView, "label_gold");

		var total = Number(Number(data["dwWinCount"]) + Number(data["dwlostCount"]));
		var percentage;
		if (total) {
			percentage = Math.floor(Number(data["dwWinCount"] / total) * 100);
		} else {
			percentage = 100;
		}

		//hanhu #只显示胜率 2015/10/30
		//var winCountString = percentage + "% " + data["dwWinCount"] + "胜" + data["dwlostCount"] + "负";
		var winCountString = percentage + "% ";
		var sexString = ["女", "男", "密"][Number(data["cbGender"])];

		label_name.setString(data["szNickName"]);
		label_id.setString(data["dwUserID"]);
		label_gold.setString(indentationGlod(data["lScore"]));
		if ( userInfo.globalUserdData["dwUserID"] == data["dwUserID"] )
		{
			label_gold.setString(indentationGlod(userInfo.globalUserdData["lUserScore"]));
		}
		label_sex.setString(sexString);
		label_winP.setString(winCountString);

		//todo 增加头像
		//用户头像

		//hanhu #增加头像背景 2015/09/02
		//var head_back = ccui.ImageView.create();
		var head_back = playerHead;
		var size = cc.size(playerHead.width, playerHead.height);

		this.CustomFaceLayer = CustomFace.CGameCustomFaceLayer.create();
		this.CustomFaceLayer.SetImageRect(0,0,size.width,size.height);
		this.CustomFaceLayer.SetVisable(false);
		head_back.addChild(this.CustomFaceLayer);

		this.CustomFaceLayer.setPosition(cc.p(head_back.getContentSize().width * 0.5, head_back.getContentSize().height / 2));
		var wFaceID = data["wFaceID"];
		var wCustomFaceID = data["dwCustomID"];
		var wUserID = data["dwUserID"];

		var head = playerHead;
		if(wCustomFaceID != 0 )
		{
			//自定义头像
			if(this.CustomFaceLayer.ShowUserCustomFace(wUserID,wCustomFaceID))//创建自定义头像失败
			{
				this.CustomFaceLayer.SetVisable(true);
			}
			else
			{
				this.CustomFaceLayer.SetVisable(false);

				lm.log("yyp aaaaa+  " + wFaceID + " " + wCustomFaceID + " " + wUserID + " ");

				var name="";
				if(userInfo.globalUserdData["cbGender"] == GenderDefine.GENDER_FEMAIL) //女
				{
					if(wFaceID == 0 || wFaceID == null)
					{
						name =  "system_head_6.png";
					}else
					{
						var newFaceId = (wFaceID-1)%5 + 1 + 5;
						name = "system_head_" + newFaceId + ".png";
					}
				}
				else
				{
					if(wFaceID == 0 || wFaceID == null)
					{
						name =  "system_head_1.png";
					}else
					{
						var newFaceId = (wFaceID-1)%5 + 1;
						name = "system_head_" + newFaceId + ".png";
					}
				}

				//玩家系统头像
				head.loadTexture(name, 1);
			}

		}
		else
		{
			lm.log("yyp bbbbb+  " + wFaceID + " " + wCustomFaceID + " " + wUserID + " ");
			//系统头像
			this.CustomFaceLayer.SetVisable(false);
			head.setVisible(true);
			var name;
			var faceid = wFaceID;
			if(userInfo.globalUserdData["cbGender"] == GenderDefine.GENDER_FEMAIL) //女
			{
				if(faceid == 0 || faceid == null)
				{
					name =  "system_head_6.png";
				}else
				{
					var newFaceId = (faceid-1)%5 + 1 + 5;
					name = "system_head_" + newFaceId + ".png";
				}
			}
			else
			{
				if(faceid == 0 || faceid == null)
				{
					name =  "system_head_1.png";
				}else
				{
					var newFaceId = (faceid-1)%5 + 1;
					name = "system_head_" + newFaceId + ".png";
				}
			}

			//玩家系统头像
			head.loadTexture(name, 1);
		}
		//head.setScale(0.66);
		head.setAnchorPoint(cc.p(0.5, 0.5));

		btn_close.addTouchEventListener(function (sender, type) {
			if (type == ccui.Widget.TOUCH_ENDED) {
				this.getParent().userInfoPop = null;
				closePlayerActions(this);
			}
		}, this);
	},

	onEnter:function(){
		this._super();
		this._touchListener = cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: false,
			onTouchBegan:function(touch, event){
				this.getParent().userInfoPop = null;

				closePlayerActions(this);
				return true;
			}.bind(this)
		});
		cc.eventManager.addListener(this._touchListener, this);
	}
})