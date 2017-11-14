/**
 * 龙虎斗 by zfs 20160602
 */
var DragonFight_GameId_122 = cc.Layer.extend(
{
	ctor:function()
	{
		this._super();
		this.initVariable();
		this.zinit();
	},
	//初始化基本属性
	initVariable:function()
	{
		//是否打开弹幕
		this.isBarrage = true;
		//筹码类型
		this.chouMaType = -1;
		//是否申请庄家
		this.isApplayBanker = false;
		//倒计时时间
		this.countDownNumber = 10;
		//玩家椅子号
		this.playerChairID = -1;
		//下注数目
		this.betGoldNumber = 100;
		/******游戏状态******/
		//游戏空闲
		this.isGameKongXian = false;
		//游戏中
		this.isGamePlaying  = false;
		//游戏结束
		this.isGameEnd		= false;
		//龙虎斗结果
		this.dragonFinishType = -1;
		//玩家下注区域
		this.playerBetArea = [-1,-1,-1];
		//玩家自己下注
		this.selfBetArea   = [0, 0, 0];
		//庄家列表层
		this.zhuangLayerList = null;
	},
	//初始化
	zinit:function()
	{
		setTouchListener(this, true,function(){return true;},function(){return true;},function(){return true;});
		this.ui = ccs.load("res/smartGame/DvsT.json").node;
		this.addChild(this.ui);

		var offset = (this.ui.getContentSize().width * winSize.height / 640 - winSize.width) / 2;
		this.ui.x -= offset;
		this.uiOffset = offset;
		//下注按钮
		this.getStakeButton();
		//龙，虎，和点击区域按钮
		this.getStakeArea();
		//其他按钮
		this.getOtherButton();
		//玩家信息
		this.getPlayerInfo();
		//历史记录
		this.getHistroyRecord();
		//两张扑克牌
		this.getPuker();
		//结算UI
		this.getResultUI();
		//其他UI
		this.getOtherUI();
		//游戏结算界面
		this.dragonResultLayer = new DragonResultLayer_GameId_122();
		this.dragonResultLayer.hideLayer();
		this.ui.addChild(this.dragonResultLayer, 200);
		//筹码层
		this.chouMaLayer = cc.Layer.create();
		this.ui.addChild(this.chouMaLayer, 10);
		//初始化筹码选择数量
		this.getValidChouMa();
		//获取庄家列表
		this.sendServerOrderGetApplyList();
	},
	//获取下注按钮
	getStakeButton:function()
	{
		var str = "button_cm_";
		//100//1000//10000//100000//500000//1000000//5000000
		for ( var i = 1; i < 8; i++ )
		{
			var stakeBtn = ccui.helper.seekWidgetByName(this.ui, str+i);
			stakeBtn.index = i;
			stakeBtn.addTouchEventListener(this.stakeEvent, this);
		}
	},
	//龙，虎，和点击区域按钮
	getStakeArea:function()
	{
		//龙
		var dragonBtn = ccui.helper.seekWidgetByName(this.ui, "button_dxz");
		dragonBtn.index = 1;
		//虎
		var tigerBtn = ccui.helper.seekWidgetByName(this.ui, "button_txz");
		tigerBtn.index = 2;
		//和
		var sameBtn = ccui.helper.seekWidgetByName(this.ui, "button_hxz");
		sameBtn.index = 3;
		dragonBtn.addTouchEventListener(this.stakeAreaEvent, this);
		tigerBtn.addTouchEventListener(this.stakeAreaEvent, this);
		sameBtn.addTouchEventListener(this.stakeAreaEvent, this);
		//下注区的下注数目显示
		this.dragonImg = ccui.helper.seekWidgetByName(this.ui, "image_dxzbj");
		this.dragonTxt = ccui.helper.seekWidgetByName(this.ui, "text_dzxz");
		this.tigerImg  = ccui.helper.seekWidgetByName(this.ui, "image_txzbj");
		this.tigerTxt  = ccui.helper.seekWidgetByName(this.ui, "text_tzxz");
		this.pingImg   = ccui.helper.seekWidgetByName(this.ui, "image_hxzbj");
		this.pingTxt   = ccui.helper.seekWidgetByName(this.ui, "text_hzxz");
		this.allDTxt   = ccui.helper.seekWidgetByName(this.ui, "text_dxz");//龙
		this.allTTxt   = ccui.helper.seekWidgetByName(this.ui, "text_txz");//虎
		this.allPTxt   = ccui.helper.seekWidgetByName(this.ui, "text_hxz");//和
		//龙虎和下注区域
		this.dragonArea = cc.LayerColor.create(cc.color.BLUE);
		this.dragonArea.setContentSize(cc.size(dragonBtn.width-5, dragonBtn.height-75));
		this.dragonArea.y = 40;
		dragonBtn.addChild(this.dragonArea);
		//虎
		this.tigerArea  = cc.LayerColor.create(cc.color.GREEN);
		this.tigerArea.setContentSize(cc.size(tigerBtn.width-5, tigerBtn.height-75));
		this.tigerArea.y = 40;
		tigerBtn.addChild(this.tigerArea);
		//和
		this.pingaArea   = cc.LayerColor.create(cc.color.YELLOW);
		this.pingaArea.setContentSize(cc.size(sameBtn.width-5, sameBtn.height-75));
		this.pingaArea.y = 40;
		sameBtn.addChild(this.pingaArea);
		this.dragonArea.visible = this.tigerArea.visible = this.pingaArea.visible = false;
		this.hideBetArea();

		this.dragonTxt.setString(0);
		this.tigerTxt.setString(0);
		this.pingTxt.setString(0);
		this.allDTxt.setString(0);
		this.allTTxt.setString(0);
		this.allPTxt.setString(0);
	},
	//初始化文本金币显示
	reStartTxt:function()
	{
		this.dragonTxt.setString(0);
		this.tigerTxt.setString(0);
		this.pingTxt.setString(0);
		this.allDTxt.setString(0);
		this.allTTxt.setString(0);
		this.allPTxt.setString(0);
		this.playerBetArea = [-1,-1,-1];
		this.selfBetArea = [0,0,0];
	},
	//隐藏下注数目显示区域
	hideBetArea:function()
	{
		this.dragonImg.visible = this.tigerImg.visible = this.pingImg.visible = false;
	},
	//其他按钮
	getOtherButton:function()
	{
		// 还回按钮
		var backBtn = ccui.helper.seekWidgetByName(this.ui, "button_tc");
		backBtn.index = 1;
		backBtn.x += this.uiOffset;
		//申请上庄按钮
		var askBtn  = ccui.helper.seekWidgetByName(this.ui, "button_sqsz");
		askBtn.index = 2;
		//排行按钮
		var rankBtn = ccui.helper.seekWidgetByName(this.ui, "button_dyj");
		rankBtn.index = 3;
		rankBtn.x -= this.uiOffset;
		//帮助按钮
		var helperBtn = ccui.helper.seekWidgetByName(this.ui, "button_bz");
		helperBtn.index = 4;
		helperBtn.x -= this.uiOffset;
		//弹幕按钮
		var barrageBtn = ccui.helper.seekWidgetByName(this.ui, "button_dmkg");
		barrageBtn.index = 5;
		barrageBtn.x -= this.uiOffset;
		//聊天按钮
		var chatBtn = ccui.helper.seekWidgetByName(this.ui, "button_lt");
		chatBtn.index = 6;
		chatBtn.x -= this.uiOffset;
		//其他玩家按钮
		var otherBtn = ccui.helper.seekWidgetByName(this.ui, "button_bz_0");
		otherBtn.index = 7;
		otherBtn.x += this.uiOffset;
		this.otherBtn = otherBtn;
		var tip = ccui.helper.seekWidgetByName(this.ui, "zaixianrenshu");
		tip.x += this.uiOffset;
		tip.visible = false;
		otherBtn.tip = tip;
		
		backBtn.addTouchEventListener(this.otherBtnEvent, this);
		askBtn.addTouchEventListener(this.otherBtnEvent, this);
		rankBtn.addTouchEventListener(this.otherBtnEvent, this);
		helperBtn.addTouchEventListener(this.otherBtnEvent, this);
		barrageBtn.addTouchEventListener(this.otherBtnEvent, this);
		chatBtn.addTouchEventListener(this.otherBtnEvent, this);
		otherBtn.addTouchEventListener(this.otherBtnEvent, this);

		if ( this.isBarrage )
		{
			barrageBtn.loadTextureNormal("btn_danmu_open.png",ccui.Widget.PLIST_TEXTURE);
		}
		else
		{
			barrageBtn.loadTextureNormal("btn_danmu_close.png",ccui.Widget.PLIST_TEXTURE);
		}
		if ( this.isApplayBanker )
		{
			//askBtn.setTitleText("取消上庄");
		}
		else
		{
			//askBtn.setTitleText("申请上庄");
		}
	},
	//玩家信息
	getPlayerInfo:function()
	{
		//庄家
		this.bossHeadIco = ccui.helper.seekWidgetByName(this.ui, "image_zjtx");
		this.bossHeadIco.index = 1;
		this.bossName	 = ccui.helper.seekWidgetByName(this.ui, "text_zname");
		this.bossGold	 = ccui.helper.seekWidgetByName(this.ui, "text_zmoney");
		//玩家
		this.playerHeadIco = ccui.helper.seekWidgetByName(this.ui, "image_wjtx");
		this.playerHeadIco.index = 2;
		this.playerName	   = ccui.helper.seekWidgetByName(this.ui, "text_wname");
		this.playerGold	   = ccui.helper.seekWidgetByName(this.ui, "text_wmoney");
		
		this.bossHeadIco.setTouchEnabled(true);
		this.playerHeadIco.setTouchEnabled(true);
		
		this.bossHeadIco.addTouchEventListener(this.playerInfoEvent, this);
		this.playerHeadIco.addTouchEventListener(this.playerInfoEvent, this);
		
	},
	setPlayerInfo:function(data)
	{
		var temp = sparrowDirector.gameData.playerInfo;
		var playerInfo = null;
		var zhuangPlayer = null;
		for ( var i = 0; i < temp.length; i++ )
		{
			lm.log("playeraheaddatatemp======= "+JSON.stringify(temp[i]));
			//玩家自己
			if ( temp[i].wChairID == dragonFight_GameID_122.playerChairID )
			{
				playerInfo = temp[i];
			}
			//庄家
			if ( temp[i].wChairID == data.wBankerUser )
			{
				zhuangPlayer = temp[i];
			}
		}
		cc.log("playerInfo======= "+JSON.stringify(playerInfo));
		cc.log("zhuangPlayer======= "+JSON.stringify(zhuangPlayer));
		cc.log("dragonFight_GameID_122.playerChairID======= "+dragonFight_GameID_122.playerChairID);
		//玩家为普通玩家
		if ( playerInfo  )
		{
			this.playerName.setString(playerInfo.szNickName);
			var score = indentationGlod(userInfo.globalUserdData["lUserScore"]);
			this.playerGold.setString(score);

			this.setPlayerIco(playerInfo, this.playerHeadIco);
		}

		if ( data.wBankerUser == -1 )
		{
			lm.log("------------------------------1");
			//系统坐庄
			this.bossGold.setString("无限");
			this.bossName.setString("系统坐庄");
			this.setPlayerIco(zhuangPlayer, this.bossHeadIco);
		}
		else if ( zhuangPlayer && zhuangPlayer.wChairID != dragonFight_GameID_122.playerChairID )
		{
			lm.log("------------------------------2");
			//庄家且庄家不为玩家
			this.bossName.setString(zhuangPlayer.szNickName);
			var score = indentationGlod(zhuangPlayer.lScore);
			this.bossGold.setString(score);
			this.setPlayerIco(zhuangPlayer, this.bossHeadIco);
		}
		else if ( zhuangPlayer && zhuangPlayer.wChairID == dragonFight_GameID_122.playerChairID )
		{
			lm.log("------------------------------3");
			//玩家为庄家
			this.bossName.setString(zhuangPlayer.szNickName);
			var score = indentationGlod(userInfo.globalUserdData["lUserScore"]);
			this.bossGold.setString(score);

			this.setPlayerIco(zhuangPlayer, this.bossHeadIco);
		}
		else
		{
			lm.log("------------------------------4");
			//系统坐庄
			this.bossGold.setString("无限");
			this.bossName.setString("系统坐庄");
			this.setPlayerIco(zhuangPlayer, this.bossHeadIco);
		}
	},
	setPlayerIco:function(data,playerHead)
	{
		var data = data;
		var CustomFaceLayer = CustomFace.CGameCustomFaceLayer.create();
		CustomFaceLayer.SetImageRect(35, 35, 74, 73);
		CustomFaceLayer.SetVisable(false);
		playerHead.addChild(CustomFaceLayer, 9999);

		if ( data )
		{
			var userId = data.dwUserID, faceid = data.wFaceID, customfaceid = data.dwCustomID;
		}
		else
		{
			var userId = 0, faceid = 0, customfaceid = 0;
		}
		if (customfaceid != 0)
		{
			//自定义头像
			if (CustomFaceLayer.ShowUserCustomFace(userId, customfaceid))
			{
				CustomFaceLayer.SetVisable(true);
			}
			else
			{
				CustomFaceLayer.SetVisable(false);
				var name;

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


				playerHead.loadTexture(name, 1);
			}
		}
		else
		{
			//系统头像
			CustomFaceLayer.SetVisable(false);
			var name;
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
			playerHead.loadTexture(name, 1);
		}
		cc.log("playeraheaddata======= "+JSON.stringify(data)+"  ===name= "+name);
	},
	//历史记录
	getHistroyRecord:function()
	{
		ccui.helper.seekWidgetByName(this.ui, "image_zoushitu_7").x += this.uiOffset;
		var lv = new ccui.ListView();
		lv.setContentSize(cc.size(160, 100));
		lv.setBounceEnabled(true);
		lv.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
		lv.setPosition(80,10);
		this.ui.addChild(lv, 1);
		this.hListView = lv;
		this.hListView.x += this.uiOffset;

		for ( var i = 0; i < 13; i++ )
		{
			//this.updateRecordHistroy();
		}
		this.hListView.jumpToPercentBothDirection(cc.p(100, 100));
		//龙盘数
		this.dragonNumText = ccui.helper.seekWidgetByName(this.ui, "d_num");
		//虎盘数
		this.tigerText = ccui.helper.seekWidgetByName(this.ui, "t_num");
		//和盘数
		this.pingText = ccui.helper.seekWidgetByName(this.ui, "h_num");
		this.dragonNumText.setString(0);
		this.tigerText.setString(0);
		this.pingText.setString(0);
	},
	//刷新历史纪录
	updateRecordHistroy:function()
	{
		var item = this.getListViewItem();
		this.hListView.pushBackCustomItem(item);
		this.hListView.jumpToPercentBothDirection(cc.p(100, 100));
	},
	//下注按钮响应事件
	stakeEvent:function(target, state)
	{
		if ( state == ccui.Widget.TOUCH_BEGAN )
		{
			cc.log(target.index);
			this.chouMaType = target.index;
			DragonAnimation_GameID_122.playDragonChouMaAnimation(target);
			switch ( target.index )
			{
			case 1://100
				this.betGoldNumber = 100;
				break;

			case 2://1000
				this.betGoldNumber = 1000;
				break;
				
			case 3://10000
				this.betGoldNumber = 10000;
				break;
				
			case 4://100000
				this.betGoldNumber = 100000;
				break;
				
			case 5://500000
				this.betGoldNumber = 500000;
				break;
				
			case 6://1000000
				this.betGoldNumber = 1000000;
				break;

			case 7://5000000
				this.betGoldNumber = 5000000;
				break;

			default :
				break;

			}
		}
	},
	//设置筹码类型
	setChouMaType:function(number)
	{
		switch ( number )
		{
			case 100://100
				this.chouMaType = 1;
				break;

			case 1000://1000
				this.chouMaType = 2;
				break;

			case 10000://10000
				this.chouMaType = 3;
				break;

			case 100000://100000
				this.chouMaType = 4;
				break;

			case 500000://500000
				this.chouMaType = 5;
				break;

			case 1000000://1000000
				this.chouMaType = 6;
				break;

			case 5000000://5000000
				this.chouMaType = 7;
				break;

			default :
				break;

		}
		return this.chouMaType;
	},
	//龙，虎，和点击区域按钮响应事件
	stakeAreaEvent:function(target, state)
	{
		if ( state == ccui.Widget.TOUCH_ENDED )
		{
			lm.log(this.isGameKongXian +"--"+this.isGamePlaying+"--"+this.isGameEnd);
			if ( !this.isGamePlaying )
			{
				layerManager.PopTipLayer(new PopAutoTipsUILayer("当前不是下注时间，请在下注时间进行下注！", DefultPopTipsTime));
				return;
			}
			if ( this.chouMaType < 0 )
			{
				layerManager.PopTipLayer(new PopAutoTipsUILayer("请选择下注金额！", DefultPopTipsTime));
				return;
			}
			var type = 0;
			var goldNumber = this.betGoldNumber;
			switch ( target.index )
			{
			case 1://龙
				type = DragonData_GameId_122.AREA_LONG;

				break;

			case 2://虎
				type = DragonData_GameId_122.AREA_HU;

				break;

			case 3://和
				type = DragonData_GameId_122.AREA_PING;

				break;

			default :
				break;

			}
			//this.controlChouMa( target.index );
			lm.log("下注咯－－－－－－－－－－－－－－－－");
			this.sendServerOrderMakeABet(type, goldNumber);
		}

	},
	//其他按钮响应事件
	otherBtnEvent:function(target, state)
	{
		if ( state == ccui.Widget.TOUCH_ENDED )
		{
			cc.log(target.index);
			switch ( target.index )
			{
			case 1://还回按钮
				var scene = new rootScene();
				var curLayer = new PlazaUILayer();
				CloseGameSocket(KernelGame);
				DataUtil.SetGoToModule(ClientModuleType.Plaza);
				curLayer.setTag(ClientModuleType.Plaza);
				layerManager.addLayerToParent(curLayer, scene);
				cc.director.replaceScene(scene);
				DragonData_GameId_122.isPlayingGame = false;
				sparrowDirector.gameData.playerInfo.splice(0);
				break;

			case 2://申请上庄按钮
				var zhuangLayer = new DragonZhuangList();
				this.addChild(zhuangLayer, 300);
				this.zhuangLayerList = zhuangLayer;
				break;

			case 3://排行按钮
				this.sendServerOrderGetRankList();
				var rankLayer = new DragonRank_GameId_122();
				this.addChild(rankLayer, 300);
				this.rankLayerList = rankLayer;
				break;
				
			case 4://帮助按钮
				var help = new DragonHelper_GameId_122();
				this.addChild(help, 300);
				break;

			case 5://弹幕按钮
				if ( this.isBarrage )
				{
					target.loadTextureNormal("btn_danmu_close.png",ccui.Widget.PLIST_TEXTURE);
					this.isBarrage = false;
				}
				else
				{
					target.loadTextureNormal("btn_danmu_open.png",ccui.Widget.PLIST_TEXTURE);
					this.isBarrage = true;
				}
				break;

			case 6://聊天按钮
				var chatlayuer = new DragonChat_GameId_122()
				this.addChild(chatlayuer, 300);
				break;

			case 7://其他玩家按钮
				target.tip.visible = !target.tip.visible;
				break;

			default :
				break;

			}
		}
	},
	//点击玩家头像响应事件
	playerInfoEvent:function(target, state)
	{
		if ( state == ccui.Widget.TOUCH_ENDED )
		{
			cc.log(target.index);
			switch (target.index)
			{
			case 1://庄家
				break;
				
			case 2://玩家
				break;
				
				default:
					break;
			}
		}
	},
	//历史记录列表item
	getListViewItem:function()
	{
		var item = ccs.load("res/smartGame/Layer.json").node;
		var itemLayer =  ccui.Layout.create();
		itemLayer.setContentSize(cc.size(item.width,item.height));
		itemLayer.addChild(item);

		var itemYes = ccui.helper.seekWidgetByName(item, "Image_4");
		itemYes.visible = false;
		var itemNo  = ccui.helper.seekWidgetByName(item, "image_3");
		itemNo.visible = false;
		var itemInvalid = ccui.helper.seekWidgetByName(item, "image_2");
		var count = 0;
		for ( var i = 0; i < this.selfBetArea.length; i++ )
		{
			if ( this.selfBetArea[i] > 0 )
			{
				count++;
			}
		}
		if ( count > 0 )
		{
			itemNo.visible = true;
		}
		else
		{
			itemInvalid.visible = true;
		}

		if ( this.dragonFinishType == 0 )//龙
		{
			itemNo.y = 90;
			itemInvalid.y = 90;
			this.dragonNumText.setString(Number(this.dragonNumText.getString())+1);
		}
		else if ( this.dragonFinishType == 1 )//虎
		{
			itemNo.y = 57;
			itemInvalid.y = 57;
			this.tigerText.setString(Number(this.tigerText.getString())+1);
		}
		else if ( this.dragonFinishType == 2 )//和
		{
			itemNo.y = 30;
			itemInvalid.y = 30;
			this.pingText.setString(Number(this.pingText.getString())+1);
		}
		return itemLayer;
	},
	//两张扑克牌控制
	getPuker:function()
	{
		ccui.helper.seekWidgetByName(this.ui, "longhupai").setLocalZOrder(500);
		this.puker01 = ccui.helper.seekWidgetByName(this.ui, "image_tp");
		this.puker01Tag = ccui.helper.seekWidgetByName(this.ui, "Image_zhepai01");
		this.puker01.originScale = this.puker01.scale;
		this.puker02 = ccui.helper.seekWidgetByName(this.ui, "image_dp");
		this.puker02Tag = ccui.helper.seekWidgetByName(this.ui, "Image_zhepai02");
		this.puker02.originScale = this.puker02.scale;
		this.puker01Tag.setLocalZOrder(50);
		this.puker02Tag.setLocalZOrder(50);
		this.puker01Tag.pos = this.puker01Tag.getPosition();
		this.puker02Tag.pos = this.puker02Tag.getPosition();
		this.puker01Tag.visible = this.puker02Tag.visible = false;

		var pkbg01 = new GameCard();
		pkbg01.createPukerBack();
		//pkbg01.setPosition(17,18);
		pkbg01.setPosition(7,5);
		pkbg01.setScale(this.puker01.scaleX*2.3, this.puker01.scaleY*2.3);
		this.puker01.back = pkbg01;
		this.puker01.addChild(pkbg01, 100);

		var pkbg02 = new GameCard();
		pkbg02.createPukerBack();
		pkbg02.setPosition(7,5);
		pkbg02.setScale(this.puker01.scaleX*2.3, this.puker01.scaleY*2.3);
		this.puker02.back = pkbg02;
		this.puker02.addChild(pkbg02, 100);
	},
	//结算UI
	getResultUI:function()
	{
		this.shenglibiaoxian = ccui.helper.seekWidgetByName(this.ui, "shenglibiaoxian");
		this.shenglibiaoxian.setLocalZOrder(50);
		this.winDragon    = ccui.helper.seekWidgetByName(this.shenglibiaoxian, "long");
		this.winTiger 	  = ccui.helper.seekWidgetByName(this.shenglibiaoxian, "hu");
		this.winPing  	  = ccui.helper.seekWidgetByName(this.shenglibiaoxian, "he");
		this.hideResultUI();
	},
	//隐藏输赢结算表现
	hideResultUI:function()
	{
		this.shenglibiaoxian.visible = false;
		this.winDragon.visible = false;
		this.winTiger.visible  = false;
		this.winPing.visible   = false;
	},
	//飞金币动画
	playGoldFlyAction:function(type)
	{
		var children = this.chouMaLayer.getChildren();
		var playerBetArea = this.playerBetArea;
		var time = 0.4;
		var self = this;
		var count = 0, count00 = 0;
		this.schedule(function()
		{
			var child = children[count];
			if ( !child )
			{
				if ( count00 < 1 )
				{
					self.scheduleOnce(function()
					{
						self.playGoldFlyAction01(type);
					}, 0.5);
				}
				return;
			}
			if ( child.type == (type+1) && playerBetArea[type] != 0 ){}
			else if ( child.type == (type+1) ){}
			else
			{
				var pos = this.bossHeadIco.getWorldPosition ();
				var callFunc = cc.callFunc (function (target) {
					target.removeFromParent ()
				}, this);
				var moveTo = cc.moveTo (time, pos);
				var sequnce = cc.sequence (moveTo, callFunc);
				child.runAction (sequnce);
			}
			count++;
		}, 0.01, children.length);
		//this.scheduleOnce(function()
		//{
		//	self.playGoldFlyAction01(type);
		//}, children.length*0.01+0.2);
	},
	//从庄家发金币出来
	playGoldFlyAction01:function(type)
	{
		var self = this, time = 0.4;
		//从庄家发金币出来
		var endData = DragonData_GameId_122.endData;
		var lPlayScore = endData.lPlayScore;
		var obj = {}, dragon = lPlayScore[0], tiger = lPlayScore[1], ping = lPlayScore[2];
		if ( type == 0 )
		{
			obj = this.setDeskChouMaWhenSceneBack(dragon, 1, this.dragonArea);
		}
		else if ( type == 1 )
		{
			obj = this.setDeskChouMaWhenSceneBack(tiger, 2, this.tigerArea);
		}
		else
		{
			obj = this.setDeskChouMaWhenSceneBack(ping, 3, this.pingaArea);
		}
		//var obj = {count01:0,count02:0, type01:0, type02:0};
		for ( var i = 0; i < obj.count01; i++ )
		{
			this.chouMaType = obj.type01;
			this.controlChouMa(type+1,null, null, true);
		}
		//this.schedule(function()
		//{
		//	self.chouMaType = obj.type01;
		//	self.controlChouMa(type+1,null, null, true);
		//}, 0.01,obj.count01);
		//this.schedule(function()
		//{
		//	self.chouMaType = obj.type02;
		//	self.controlChouMa(type+1,null, null, true);
		//}, 0.015,obj.count02);
		for ( var j = 0; j < obj.count02; j++ )
		{
			this.chouMaType = obj.type02;
			this.controlChouMa(type+1,null, null, true);
		}
		this.scheduleOnce(function()
		{
			self.playGoldFlyAction02(type);
		}, time+0.5);
	},
	//从下注区飞向玩家
	playGoldFlyAction02:function(type)
	{
		var children = this.chouMaLayer.getChildren();
		var playerBetArea = this.playerBetArea;
		var count = 0, time = 0.4,self = this, count00 = 0;
		this.schedule(function()
		{
			var child = children[count];
			if ( !child )
			{
				if ( count00 < 1 )
				{
					self.scheduleOnce(this.refreshPlayerGold01, time*2);
				}
				count00++;
				return;
			}
			if (playerBetArea[type] > 0 )
			{
				var ranN = Math.random()*1;
				if ( ranN > 0.5 )
				{
					var pos = this.otherBtn.getWorldPosition();
				}
				else
				{
					var pos = this.playerHeadIco.getWorldPosition();
				}
				var callFunc = cc.callFunc(function(target){target.removeFromParent()},this);
				var moveTo = cc.moveTo(time,pos);
				var sequnce  = cc.sequence(moveTo, callFunc);
				child.runAction(sequnce);
			}
			else
			{
				//当局其他玩家赢
				var pos = this.otherBtn.getWorldPosition();
				var callFunc = cc.callFunc(function(target){target.removeFromParent()},this);
				var moveTo = cc.moveTo(time,pos);
				var sequnce  = cc.sequence(moveTo, callFunc);
				child.runAction(sequnce);
			}
			count++;
		}, 0.01, children.length);
	},
	//展示最后结果，龙，虎，和
	showDragonFightResult:function(type)
	{
		this.shenglibiaoxian.visible = true;
		switch (type)
		{
			case 0://龙赢
				this.winDragon.visible = true;
				DragonAnimation_GameID_122.playDragonAnimation();
				break

			case 1://虎赢
				this.winTiger.visible  = true;
				DragonAnimation_GameID_122.playDragonAnimation();
				break;

			case 2://和赢
				this.winPing.visible   = true;
				DragonAnimation_GameID_122.playDragonAnimation();
				break;

			default :
				break;
		}
		this.playGoldFlyAction(type);
	},
	//其他UI
	getOtherUI:function()
	{
		//倒计时
		this.downTimer = ccui.helper.seekWidgetByName(this.ui, "text_djs");
		this.downTimer.setString("100000");
		//游戏阶段
		this.currentGameTypeTxt = ccui.helper.seekWidgetByName(this.ui, "text_zt");
		//筹码动画
		ccui.helper.seekWidgetByName(this.ui, "choumaxuanzhong").visible = false;
	},
	//控制两张扑克牌开牌动画
	controlPukerAction:function(data)
	{
		this.dragonResultLayer.showLayer();
		var card01 = new GameCard();
		card01.createPuker(data.cbCardData[0]);
		card01.setPosition(7,5);
		card01.setScale(this.puker01.scaleX*2.3, this.puker01.scaleY*2.3);
		this.puker01.addChild(card01, 1, 100);

		var card02 = new GameCard();
		card02.createPuker(data.cbCardData[1]);
		card02.setPosition(7,5);
		card02.setScale(this.puker01.scaleX*2.3, this.puker01.scaleY*2.3);
		this.puker02.addChild(card02,1, 100);

		var time = 0.3;
		var action = this.getPukerAction(0, time);
		this.puker01.runAction(action);
		var action01 = this.getPukerAction(1, time);
		this.puker02.runAction(action01);

		this.setGameFinishType(card01.sortNumber01, card02.sortNumber01)

		this.scheduleOnce(this.showDragonResultLayer, time+1);
	},
	//设置游戏最后结果
	setGameFinishType:function(param01, param02)
	{
		if ( param01 == 14 )
		{
			param01 = 1;
		}
		else if ( param01 == 15 )
		{
			param01 = 2;
		}
		if ( param02 == 14 )
		{
			param02 = 1;
		}
		else if ( param02 == 15 )
		{
			param02 = 2;
		}

		if ( param01 > param02 )
		{
			this.dragonFinishType = 0;//龙
		}
		else if ( param01 < param02 )
		{
			this.dragonFinishType = 1;//虎
		}
		else
		{
			this.dragonFinishType = 2;
		}
		this.updateRecordHistroy();
	},
	//显示开牌结算界面
	showDragonResultLayer:function()
	{
		this.puker01Tag.visible = this.puker02Tag.visible = true;
		this.dragonResultLayer.showLayer();
		var time = 1.2, gap = 50;
		var time02 = 0.1;
		var time03 = 0.5;
		var child01 = this.puker01.back;
		var child02 = this.puker02.back;
		if ( child01 )
		{
			var moveBy = cc.moveBy(time, 45, 0);
			var de	   = cc.delayTime(time03);
			var delay  = cc.moveBy(time02, 70, 0);
			var callFun= cc.callFunc(function(target) {target.visible = false;target.setPosition(7,5);}, this);
			var sequnce= cc.sequence(moveBy,de,delay, callFun);
			child01.runAction(sequnce);
			var delay01 = cc.delayTime(time+time03);
			var moveBy01 = cc.moveBy(time02, -gap, gap);
			var callFunc01 = cc.callFunc(function(target){target.visible = false; target.setPosition(target.pos);});
			var sequnce01 = cc.sequence(delay01, moveBy01, callFunc01);
			this.puker01Tag.runAction(sequnce01);
		}
		if ( child02 )
		{
			this.scheduleOnce(function()
			{
				var moveBy = cc.moveBy(time, 45, 0);
				var de	   = cc.delayTime(time03);
				var delay  = cc.moveBy(time02, 70, 0);
				var callFun= cc.callFunc(function(target){target.visible = false;target.setPosition(7,5);}, this);
				var sequnce= cc.sequence(moveBy,de,delay, callFun);
				child02.runAction(sequnce);
				var delay01 = cc.delayTime(time+time03);
				var moveBy01 = cc.moveBy(time02, -gap, gap);
				var callFunc01 = cc.callFunc(function(target){target.visible = false; target.setPosition(target.pos);});
				var sequnce01 = cc.sequence(delay01, moveBy01, callFunc01);
				this.puker02Tag.runAction(sequnce01);
			}, time+1);
		}
		this.scheduleOnce(this.closeResultLayer, 6);
	},
	//关闭结算界面
	closeResultLayer:function()
	{
		var time = 0.3;
		var action = this.getPukerActionBack(0, time);
		this.puker01.runAction(action);
		var action01 = this.getPukerActionBack(1, time);
		this.puker02.runAction(action01);
	},
	//获取扑克还回动画
	getPukerActionBack:function(type, time)
	{
		var self = this;
		var moveBy = null;
		var scaleTo= null;
		var gapY = 230, gapX = 80;
		if ( type == 0 )
		{
			moveBy = cc.moveBy(time,-gapX, gapY);
			scaleTo= cc.scaleTo(time,this.puker01.originScale, this.puker01.originScale);
		}
		else
		{
			moveBy = cc.moveBy(time,gapX, gapY);
			scaleTo= cc.scaleTo(time,this.puker02.originScale, this.puker02.originScale);
		}
		var spaw   = cc.spawn(moveBy, scaleTo);
		var callBk = cc.callFunc(function()
		{
			self.dragonResultLayer.hideLayer();
			if (type == 1 )
			{
				self.scheduleOnce(function()
				{
					self.showDragonFightResult(this.dragonFinishType);
				}, 0.5);
			}
		}, this);
		var sequnce= cc.sequence(spaw, callBk);
		return sequnce;
	},
	//获取扑克动画
	getPukerAction:function(type, time)
	{
		var gapY = 230, gapX = 80;
		if ( type == 0 )
		{
			var moveTo = cc.moveBy(time,gapX, -gapY);
		}
		else
		{
			var moveTo = cc.moveBy(time,-gapX, -gapY);
		}
		var scaleTo= cc.scaleTo(time, 1, 1);
		var spaw   = cc.spawn(moveTo, scaleTo);
		var callBk = cc.callFunc(function(){}, this);
		var sequnce= cc.sequence(spaw, callBk);
		return sequnce;
	},
	//控制筹码发射动画
	controlChouMa:function(type, data, data02,isGameEnd)
	{
		lm.log("this.chouMaType======= "+this.chouMaType);
		lm.log("earetype ============= "+type);
		lm.log("betdata=============== "+JSON.stringify(data));

		if ( type > 4 )
		{
			DragonMusic_GameId_122.playBigBetEffct();
		}
		else
		{
			DragonMusic_GameId_122.playAddScore();
		}
		var time = 0.4;
		var gap = 20;
		if ( type == 1 )
		{
			var chouMa = this.getChouMaType();
			chouMa.type = type;
			if(data )
			{
				chouMa.setPosition(this.playerHeadIco.getWorldPosition());
			}
			else if ( isGameEnd )
			{
				chouMa.setPosition(this.bossHeadIco.getWorldPosition());
			}
			else
			{
				chouMa.setPosition(this.otherBtn.getWorldPosition());
			}
			this.chouMaLayer.addChild(chouMa, 10);
			var p01 = this.dragonArea.parent.convertToWorldSpace(this.dragonArea.getPosition());
			var moveTo = cc.moveTo(time,p01.x+gap+Math.random()*(this.dragonArea.width-gap*2), p01.y+gap+Math.random()*(this.dragonArea.height-gap*2));
			chouMa.runAction(moveTo);
			if ( data )
			{
				this.dragonImg.visible = true;
			}
		}
		else if ( type == 2 )
		{
			var chouMa = this.getChouMaType();
			chouMa.type = type;
			if(data )
			{
				chouMa.setPosition(this.playerHeadIco.getWorldPosition());
			}
			else if ( isGameEnd )
			{
				chouMa.setPosition(this.bossHeadIco.getWorldPosition());
			}
			else
			{
				chouMa.setPosition(this.otherBtn.getWorldPosition());
			}
			this.chouMaLayer.addChild(chouMa, 10);
			var p01 = this.tigerArea.parent.convertToWorldSpace(this.tigerArea.getPosition());
			var moveTo = cc.moveTo(time,p01.x+gap+Math.random()*(this.tigerArea.width-gap*2), p01.y+gap+Math.random()*(this.tigerArea.height-gap*2));
			chouMa.runAction(moveTo);
			if ( data )
			{
				this.tigerImg.visible = true;
			}
		}
		else if ( type == 3 )
		{
			var chouMa = this.getChouMaType();
			chouMa.type = type;
			if(data )
			{
				chouMa.setPosition(this.playerHeadIco.getWorldPosition());
			}
			else if ( isGameEnd )
			{
				chouMa.setPosition(this.bossHeadIco.getWorldPosition());
			}
			else
			{
				chouMa.setPosition(this.otherBtn.getWorldPosition());
			}
			this.chouMaLayer.addChild(chouMa, 10);
			var p01 = this.pingaArea.parent.convertToWorldSpace(this.pingaArea.getPosition());
			var moveTo = cc.moveTo(time,p01.x+gap+Math.random()*(this.pingaArea.width-gap*2), p01.y+gap+Math.random()*(this.pingaArea.height-gap*2));
			chouMa.runAction(moveTo);
			if ( data )
			{
				this.pingImg.visible = true;
			}
		}
		if (data)
		{
			this.dragonTxt.setString(this.selfBetArea[0]);
			this.tigerTxt.setString(this.selfBetArea[1]);
			this.pingTxt.setString(this.selfBetArea[2]);
		}
		if ( data02 )
		{
			this.allDTxt.setString(data02[0]);
			this.allTTxt.setString(data02[1]);
			this.allPTxt.setString(data02[2]);
		}
	},
	//获取筹码类型
	getChouMaType:function(type)
	{
		var str = "btn_chouma_0"+this.chouMaType + ".png";
		if ( type )
		{
			str = "btn_chouma_0"+type + ".png";
		}

		var chouMa = cc.Sprite.createWithSpriteFrameName(str);
		chouMa.scale = 0.5;
		return chouMa;
	},
	//刷新倒计时
	refreshCountDown:function(txt)
	{
		lm.log("------------------this.countDownNumber "+this.countDownNumber);
		lm.log("------------------this.downTimer "+this.downTimer);

		this.downTimer.setString("（"+this.countDownNumber+"）");
		this.currentGameTypeTxt.setString(txt);
		this.schedule(this.startCountDown, 1);
	},
	//开始倒计时
	startCountDown:function()
	{
		this.countDownNumber--;
		if ( this.countDownNumber == 5 )
		{
			DragonMusic_GameId_122.playCountDownEffct();
		}
		if ( this.countDownNumber <= 0 )
		{
			this.unschedule(this.startCountDown);
			return;
		}
		this.downTimer.setString("（"+this.countDownNumber+"）");
	},
	//设置游戏状态标志
	setGameStatusTag:function(type)
	{
		if ( type == 0 )
		{
			this.isGameEnd = this.isGamePlaying = false;
			this.isGameKongXian = true;
		}
		else if ( type == 1 )
		{
			this.isGameKongXian = this.isGamePlaying = false;
			this.isGameEnd = true;
		}
		else if ( type == 2 )
		{
			this.isGameEnd = this.isGameKongXian = false;
			this.isGamePlaying = true;
		}
	},
	//下注时刷新玩家金币
	refreshPlayerGold:function(data)
	{
		if ( data.wChairID == dragonFight_GameID_122.playerChairID )
		{
			var sc = 0;
			for ( var i = 0; i < this.selfBetArea.length; i++ )
			{
				sc += this.selfBetArea[i];
			}
			var score = indentationGlod(userInfo.globalUserdData["lUserScore"] - sc);
			this.playerGold.setString(score);
		}
	},
	refreshPlayerGold01:function()
	{
		var score = indentationGlod(userInfo.globalUserdData["lUserScore"] + DragonData_GameId_122.tempScore);
		this.playerGold.setString(score);
		if ( this.isGameEnd )
		{
			var animation = new DragonAnimation_GameID_122(DragonData_GameId_122.tempScore);
			this.addChild(animation, 999);
		}
		DragonAnimation_GameID_122.playDragonChouMaAnimation();
		DragonData_GameId_122.tempScore = 0;
	},
	//清除上一局扑克
	clearUpPuker: function ()
	{
		var child01 = this.puker01.getChildByTag(100);
		var child02 = this.puker02.getChildByTag(100);
		if ( child01 )
		{
			child01.removeFromParent();
		}
		if ( child02 )
		{
			child02.removeFromParent();
		}
		this.puker01.back.visible = true;
		this.puker02.back.visible = true;
	},
	//显示或隐藏玩家可下注筹码
	getValidChouMa:function(data)
	{
		var count = 7;
		var score = userInfo.globalUserdData["lUserScore"];
		if ( data )
		{
			if ( data.wChairID == dragonFight_GameID_122.playerChairID )
			{
				var sc = 0;
				for ( var i = 0; i < this.selfBetArea.length; i++ )
				{
					sc += this.selfBetArea[i];
				}
				score = userInfo.globalUserdData["lUserScore"] - sc;
			}
		}

		var arr = [100, 1000, 10000,100000, 500000,1000000, 5000000];
		for ( var i = 0; i < arr.length-1; i++ )
		{
			if ( score >= arr[i] && score <= arr[i+1] )
			{
				count = i+1;
			}
		}
		var str = "button_cm_";
		for ( var i = 1; i <= count; i++ )
		{
			var stakeBtn = ccui.helper.seekWidgetByName(this.ui, str+i);
			stakeBtn.visible = true;
		}
		for ( var j = count+1; j < 8; j++ )
		{
			var stakeBtn = ccui.helper.seekWidgetByName(this.ui, str+j);
			stakeBtn.visible = false;
		}
	},
	//收到游戏状态时的场景消息，展现桌上押注筹码
	showDeskChouMaWhenSceneBack:function(data)
	{
		var dragon = data.lAllBet[0], tiger = data.lAllBet[1], ping = data.lAllBet[2];
		this.setDeskChouMaWhenSceneBack(dragon, 1, this.dragonArea);
		this.setDeskChouMaWhenSceneBack(tiger, 2, this.tigerArea);
		this.setDeskChouMaWhenSceneBack(ping, 3, this.pingaArea);
		this.allDTxt.setString(dragon);
		this.allTTxt.setString(tiger);
		this.allPTxt.setString(ping);

		var dragon = data.lPlayBet[0], tiger = data.lPlayBet[1], ping = data.lPlayBet[2];
		this.setDeskChouMaWhenSceneBack(dragon, 1, this.dragonArea);
		this.setDeskChouMaWhenSceneBack(tiger, 2, this.tigerArea);
		this.setDeskChouMaWhenSceneBack(ping, 3, this.pingaArea);
		if( dragon > 0 )
		{
			this.dragonTxt.setString(dragon);
			this.dragonImg.visible = true;
		}
		if ( tiger > 0 )
		{
			this.tigerTxt.setString(tiger);
			this.tigerImg.visible = true;
		}
		if ( ping > 0 )
		{
			this.pingTxt.setString(ping);
			this.pingImg.visible = true;
		}
	},
	//筹码累计
	setDeskChouMaWhenSceneBack:function(dragon, type, parent)
	{
		var parentt = parent;
		var gap = 20;
		var obj = {count01:0,count02:0, type01:0, type02:0};
		if ( dragon >= 100 && dragon < 1000 )
		{
			var count = Math.floor(dragon/100);
			for ( var i = 0; i < count; i++ )
			{
				var chouMa = this.getChouMaType(1);
				chouMa.type = type;
				var p01 = parentt.parent.convertToWorldSpace(parentt.getPosition());
				chouMa.setPosition(p01.x+gap+Math.random()*(parentt.width-gap*2), p01.y+gap+Math.random()*(parentt.height-gap*2));
				this.chouMaLayer.addChild(chouMa, 10);
			}
			obj.count01 = count;
			obj.type01 = 1;
		}
		else if ( dragon >= 1000 && dragon < 10000 )
		{
			var count01 = Math.floor(dragon/1000), count02 = Math.floor((dragon-1000)/100);
			for ( var i = 0; i < count01; i++ )
			{
				var chouMa = this.getChouMaType(2);
				chouMa.type = type;
				var p01 = parentt.parent.convertToWorldSpace(parentt.getPosition());
				chouMa.setPosition(p01.x+gap+Math.random()*(parentt.width-gap*2), p01.y+gap+Math.random()*(parentt.height-gap*2));
				this.chouMaLayer.addChild(chouMa, 10);
			}
			for ( var i = 0; i < count02; i++ )
			{
				var chouMa = this.getChouMaType(1);
				chouMa.type = type;
				var p01 = parentt.parent.convertToWorldSpace(parentt.getPosition());
				chouMa.setPosition(p01.x+gap+Math.random()*(parentt.width-gap*2), p01.y+gap+Math.random()*(parentt.height-gap*2));
				this.chouMaLayer.addChild(chouMa, 10);
			}
			obj.count01 = count01;
			obj.type01 = 2;
			obj.count02 = count02;
			obj.type02 = 1;
		}
		else if ( dragon >= 10000 && dragon < 60000 )
		{
			var count01 = Math.floor(dragon/1000);
			for ( var i = 0; i < count01; i++ )
			{
				var chouMa = this.getChouMaType(2);
				chouMa.type = type;
				var p01 = parentt.parent.convertToWorldSpace(parentt.getPosition());
				chouMa.setPosition(p01.x+gap+Math.random()*(parentt.width-gap*2), p01.y+gap+Math.random()*(parentt.height-gap*2));
				this.chouMaLayer.addChild(chouMa, 10);
			}
			obj.count01 = count01;
			obj.type01 = 2;
		}
		else if ( dragon >= 60000 && dragon < 100000 )
		{
			var count01 = Math.floor(dragon/10000), count02 = Math.floor((dragon-10000)/1000);
			for ( var i = 0; i < count01; i++ )
			{
				var chouMa = this.getChouMaType(3);
				chouMa.type = type;
				var p01 = parentt.parent.convertToWorldSpace(parentt.getPosition());
				chouMa.setPosition(p01.x+gap+Math.random()*(parentt.width-gap*2), p01.y+gap+Math.random()*(parentt.height-gap*2));
				this.chouMaLayer.addChild(chouMa, 10);
			}
			for ( var i = 0; i < count02; i++ )
			{
				var chouMa = this.getChouMaType(2);
				chouMa.type = type;
				var p01 = parentt.parent.convertToWorldSpace(parentt.getPosition());
				chouMa.setPosition(p01.x+gap+Math.random()*(parentt.width-gap*2), p01.y+gap+Math.random()*(parentt.height-gap*2));
				this.chouMaLayer.addChild(chouMa, 10);
			}
			obj.count01 = count01;
			obj.type01 = 3;
			obj.count02 = count02;
			obj.type02 = 2;
		}
		else if ( dragon >= 100000 && dragon < 500000 )
		{
			var count01 = Math.floor(dragon/100000), count02 = Math.floor((dragon-100000)/10000);
			for ( var i = 0; i < count01; i++ )
			{
				var chouMa = this.getChouMaType(4);
				chouMa.type = type;
				var p01 = parentt.parent.convertToWorldSpace(parentt.getPosition());
				chouMa.setPosition(p01.x+gap+Math.random()*(parentt.width-gap*2), p01.y+gap+Math.random()*(parentt.height-gap*2));
				this.chouMaLayer.addChild(chouMa, 10);
			}
			for ( var i = 0; i < count02; i++ )
			{
				var chouMa = this.getChouMaType(3);
				chouMa.type = type;
				var p01 = parentt.parent.convertToWorldSpace(parentt.getPosition());
				chouMa.setPosition(p01.x+gap+Math.random()*(parentt.width-gap*2), p01.y+gap+Math.random()*(parentt.height-gap*2));
				this.chouMaLayer.addChild(chouMa, 10);
			}
			obj.count01 = count01;
			obj.type01 = 4;
			obj.count02 = count02;
			obj.type02 = 3;
		}
		else if ( dragon >= 500000 && dragon < 1000000 )
		{
			var count01 = Math.floor(dragon/500000), count02 = Math.floor((dragon-500000)/100000);
			var chouMa = this.getChouMaType(5);
			chouMa.type = type;
			var p01 = parentt.parent.convertToWorldSpace(parentt.getPosition());
			chouMa.setPosition(p01.x+gap+Math.random()*(parentt.width-gap*2), p01.y+gap+Math.random()*(parentt.height-gap*2));
			this.chouMaLayer.addChild(chouMa, 10);
			for ( var i = 0; i < count02; i++ )
			{
				var chouMa = this.getChouMaType(4);
				chouMa.type = type;
				var p01 = parentt.parent.convertToWorldSpace(parentt.getPosition());
				chouMa.setPosition(p01.x+gap+Math.random()*(parentt.width-gap*2), p01.y+gap+Math.random()*(parentt.height-gap*2));
				this.chouMaLayer.addChild(chouMa, 10);
			}
			obj.count01 = count01;
			obj.type01 = 5;
			obj.count02 = count02;
			obj.type02 = 4;
		}
		else if ( dragon >= 1000000 )
		{
			var count01 = Math.floor(dragon/1000000);
			for ( var i = 0; i < count01; i++ )
			{
				var chouMa = this.getChouMaType(6);
				chouMa.type = type;
				var p01 = parentt.parent.convertToWorldSpace(parentt.getPosition());
				chouMa.setPosition(p01.x+gap+Math.random()*(parentt.width-gap*2), p01.y+gap+Math.random()*(parentt.height-gap*2));
				this.chouMaLayer.addChild(chouMa, 10);
			}
			obj.count01 = count01;
			obj.type01 = 6;
		}
		return obj;
	},
	//显示聊天消息
	showChatContent:function(contentTxt)
	{
		if ( this.isBarrage )
		{
			var txt = ccui.Text.create(contentTxt,"", 24);
			txt.setPosition(winSize.width, winSize.height-100 + Math.random()*80);
			this.addChild(txt, 200);
			var moveTo = cc.moveTo(7 + Math.random()*5, -txt.width, txt.y);
			var callFu = cc.callFunc(function(target){target.removeFromParent();}, this);
			var sequn  = cc.sequence(moveTo, callFu);
			txt.runAction(sequn);
		}
	},
	/*******************************游戏消息***************************/
	//游戏空闲
	dragonGameXian:function(data)
	{
	//	{"type":"CMD_S_GameFree","cbTimeLeave":10}
		this.dragonResultLayer.hideLayer();
		//this.chouMaLayer.removeAllChildren();
		this.countDownNumber = data.cbTimeLeave;
		this.refreshCountDown("空闲时间");
		this.setGameStatusTag(0);
		this.refreshPlayerGold01();
		this.clearUpPuker();
		this.hideResultUI();
		this.getValidChouMa();
		this.hideBetArea();
		this.reStartTxt();
		DragonData_GameId_122.bankerTempScore = 0;
	},
	// 游戏开始
	dragonGameStart:function(data)
	{
    //{"type":"CMD_S_GameStart","cbTimeLeave":15,"wBankerUser":-1,"lBankerScore":2000000,"nListUserCount":0}
		this.countDownNumber = data.cbTimeLeave;
		this.refreshCountDown("下注时间");
		this.setPlayerInfo(data);
		this.setGameStatusTag(2);
	},
	//用户下注
	dragonGamePlaceBet:function(data)
	{
    //{"type":"CMD_S_PlaceBet","wChairID":8,"cbBetArea":0,"lBetScore":100,"lAllAreaBet":[100,0,0]}
		this.chouMaType = this.setChouMaType(data.lBetScore);

		if ( data.wChairID == dragonFight_GameID_122.playerChairID )
		{
			//玩家自己下注
			this.playerBetArea = data.lAllAreaBet;
			this.selfBetArea[data.cbBetArea] += data.lBetScore;
			this.controlChouMa( data.cbBetArea + 1 , data.lAllAreaBet, data.lAllAreaBet);
			this.refreshPlayerGold(data);
			this.getValidChouMa(data);
		}
		else
		{
			this.controlChouMa( data.cbBetArea + 1, null, data.lAllAreaBet);
		}
	},
	//下注失败
	dragonGameBetlose:function(data)
	{
    //{"type":"CMD_S_PlaceBetFail","wPlaceUser":8,"lBetArea":2,"lPlaceScore":100}
		layerManager.PopTipLayer(new PopAutoTipsUILayer("当前不是下注时间，请在下注时间进行下注！", DefultPopTipsTime));
	},
	//游戏结束
	dragonGameEnd:function(data)
	{
	//	{"type":"CMD_S_GameEnd","cbTimeLeave":20,"cbCardData":[0,0],"lBankerScore":0,"lBankerTotallScore":-200,"nBankerTime":2,"lPlayScore":[0,0,0],"lPlayAllScore":0,"lRevenue":0}
		DragonData_GameId_122.endData = data;
		this.countDownNumber = data.cbTimeLeave;
		this.refreshCountDown("开牌时间");
		this.controlPukerAction(data);
		//this.dragonResultLayer.showLayer();
		//this.dragonResultLayer.showResultPuker(data);
		this.isGameEnd = true;
		this.setGameStatusTag(1);
		DragonData_GameId_122.tempScore = data.lPlayAllScore;
		DragonData_GameId_122.bankerTempScore = data.lBankerScore;
	},
	//场景消息，空闲状态
	dragonGameXianScene:function(data)
	{
    //{"type":"CMD_S_StatusFree","cbTimeLeave":10,"lPlayFreeSocre":13000,"wBankerUser":-1,"lBankerScore":0,"lBankerWinScore":0,
    // "wBankerTime":73,"bEnableSysBanker":1,"lApplyBankerCondition":10000000,
    // "lAreaLimitScore":1000000000,"szGameRoomName":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}
		this.countDownNumber = data.cbTimeLeave;
		this.refreshCountDown("空闲时间");
		this.setPlayerInfo(data);
		this.setGameStatusTag(0);
	},
	//场景消息，游戏状态
	dragonGamePlayingScene:function(data)
	{
	//{"type":"CMD_S_StatusPlay","cbTimeLeave":14,"cbGameStatus":100,"lAllBet":[100,0,0],"lPlayBet":[100,0,0],"lPlayBetScore":13000,
	// "lPlayFreeSocre":13000,"lPlayScore":[0,0,0],"lPlayAllScore":0,"wBankerUser":-1,"lBankerScore":2000000,"lBankerWinScore":0,
	// "wBankerTime":73,"bEnableSysBanker":1,"lApplyBankerCondition":10000000,"lAreaLimitScore":1000000000,"cbTableCardData":[0,0],
	// "szGameRoomName":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}
		this.countDownNumber = data.cbTimeLeave;
		this.refreshCountDown("下注时间");
		this.setPlayerInfo(data);
		this.setGameStatusTag(2);
		this.showDeskChouMaWhenSceneBack(data);
	},
	//场景消息，游戏结束
	dragonGameEndScene:function(data)
	{
		this.countDownNumber = data.cbTimeLeave;
		this.refreshCountDown("空闲时间");
		this.setPlayerInfo(data);
		this.setGameStatusTag(2);
	},
	//庄家列表消息
	dragonGameApplyList:function(data)
	{
		if (this.zhuangLayerList)
		{
			for ( var i = 0;i <data.wApplyChair.length; i++ )
			{
				if ( data.wApplyChair[i] == DragonData_GameId_122.playerChairID )
				{
					this.isApplayBanker = true;
				}
			}
			this.zhuangLayerList.updateListItems(data);
		}
	},
	//排行列表消息
	dragonGameRanList:function(data)
	{
		if (this.rankLayerList)
		{
			this.rankLayerList.updateListItems(data);
		}
	},
	//服务器命令——下注
	sendServerOrderMakeABet:function(type, goldNumber)
	{
		lm.log("type= "+type+" goldNumber= "+goldNumber);
		//connectUtil.sendManual(KernelCurrent, LandCrazyExMainID,LandCrazyExGameMsg.SUB_C_PASS_CARD, 1, "8#" + 0);
		//return;
		connectUtil.sendManual(KernelCurrent, DragonData_GameId_122.GAME_MAIN_ID, DragonData_GameId_122.SUB_C_PLACE_JETTON,
			9,
			"8#" + type,
			"64#" + goldNumber);

	},
	//服务器命令——申请上庄
	sendServerOrderApplayBanker:function()
	{
		connectUtil.sendManual(KernelCurrent, DragonData_GameId_122.GAME_MAIN_ID, DragonData_GameId_122.SUB_C_APPLY_BANKER, 2, "16#" + 1 );
	},
	//服务器命令——取消上庄
	sendServerOrderCancelBanker:function()
	{
		connectUtil.sendManual(KernelCurrent, DragonData_GameId_122.GAME_MAIN_ID, DragonData_GameId_122.SUB_C_CANCEL_BANKER, 2, "16#" + 1  );
	},
	//服务器命令——获取庄家列表
	sendServerOrderGetApplyList:function()
	{
		connectUtil.sendManual(KernelCurrent, DragonData_GameId_122.GAME_MAIN_ID, DragonData_GameId_122.SUB_C_GET_APPLYLIST, 2, "16#" + 1  );
	},
	//服务器命令——获取排行列表
	sendServerOrderGetRankList:function()
	{
		lm.log("请求 服务器命令——获取排行列表");
		connectUtil.sendManual(KernelCurrent, DragonData_GameId_122.GAME_MAIN_ID, DragonData_GameId_122.SUB_C_GETRANK, 2, "16#" + DragonData_GameId_122.playerChairID );
	}
});

var dragonFight_GameID_122 = null;
var DragonFightScene_GameId_122 = rootScene.extend(
	{
		onEnter:function ()
		{
			this._super();
			DragonMusic_GameId_122.playBgMusic();
		},
		ctor:function()
		{
			this._super();
			var dragonLayer = new DragonFight_GameId_122();
			dragonFight_GameID_122 = dragonLayer;
			lm.log("dragonFight_GameId-122 "+dragonFight_GameID_122);
			this.addChild(dragonLayer);
		},
		onExit:function()
		{
			this._super();
			LandCEMusic.stopBgMusic();
			LandCEMusic.playBgMusic();
		}
	});











