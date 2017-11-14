var DragonChat_GameId_122 = cc.Layer.extend(
{
	ctor:function()
	{
		this._super();
		this.initVariable();
		this.zinit();
		this.addUI();
	},
	zinit:function()
	{
		this.ui = ccs.load("res/smartGame/liaotian.json").node;
		this.addChild(this.ui, 100);

		var offset = (this.ui.getContentSize().width * winSize.height / 640 - winSize.width) / 2;
		this.ui.x -= offset;

		this.contentStr = [
			ccui.helper.seekWidgetByName(this.ui, "Text_2").getString(),
			ccui.helper.seekWidgetByName(this.ui, "Text_2_0").getString(),
			ccui.helper.seekWidgetByName(this.ui, "Text_2_0_0").getString(),
			ccui.helper.seekWidgetByName(this.ui, "Text_2_0_0_0").getString(),
			ccui.helper.seekWidgetByName(this.ui, "Text_2_0_0_0_0").getString(),
			ccui.helper.seekWidgetByName(this.ui, "Text_2_0_0_0_0_0").getString(),
			ccui.helper.seekWidgetByName(this.ui, "Text_2_0_0_0_0_0_0").getString()
		];

		var bgBtn = ccui.Button.create("btn_danmu_open.png","","",ccui.Widget.PLIST_TEXTURE);
		bgBtn.scale = 20;
		bgBtn.setPosition(winSize.width/2,winSize.height/2);
		bgBtn.setOpacity(0);
		this.addChild(bgBtn, 1);
		bgBtn.addTouchEventListener(this.bgBtnEvent, this);
	},
	initVariable:function()
	{
		this.wGap = 60;
		this.isMoveFinished = true;
	},
	addUI:function()
	{
		this.selectedTagImg = ccui.helper.seekWidgetByName(this.ui, "xuanzhong");
		this.launchImgButto = ccui.helper.seekWidgetByName(this.ui, "fasong");
		this.textField = ccui.helper.seekWidgetByName(this.ui, "TextField_1");
		var str = "Button_";
		for ( var i = 1; i < 8; i++ )
		{
			var btn = ccui.helper.seekWidgetByName(this.ui, str+i);
			btn.type = i;
			btn.addTouchEventListener(this.chatItemEvent, this);
		}
		this.launchImgButto.addTouchEventListener(this.launchEvent, this);
	},
	bgBtnEvent:function(target, state)
	{
		if ( state == ccui.Widget.TOUCH_ENDED )
		{
			closePlayerActions(this);
		}
	},
	chatItemEvent:function(target,state)
	{
		if( state == ccui.Widget.TOUCH_ENDED )
		{
			if (!this.isMoveFinished)
			{
				return;
			}
			var chatContent = this.contentStr[target.type-1];
			this.playSelectAction(target);
			//第一个参数0房间聊天，1喇叭喊话
			sparrowDirector.SendUserChat(0, 0, chatContent + " ");
			switch (target.type)
			{
			case 1:
				break;
			
			case 2:
				break;
				
			case 3:
				break;

			case 4:
				break;

			case 5:
				break;

			case 6:
				break;

			case 7:
				break;

			default :
				break;
			}
			this.bgBtnEvent("", 2);
		}
	},
	launchEvent:function(target, state)
	{
		if ( state == ccui.Widget.TOUCH_ENDED )
		{
			cc.log("launch chat event "+this.textField.getString());
			var chatStr = this.textField.getString();
			if ( chatStr < 1 )
			{
				layerManager.PopTipLayer(new PopAutoTipsUILayer("聊天内容不能为空！", DefultPopTipsTime));
				return;
			}
			//第一个参数0房间聊天，1喇叭喊话
			sparrowDirector.SendUserChat(0, 0, chatStr + " ");
			this.bgBtnEvent("", 2);
		}
	},
	playSelectAction:function(target)
	{
		var self = this,time = 0.1;
		self.isMoveFinished = false;
		var moveTo = cc.moveTo(time, this.selectedTagImg.x, target.getWorldPosition().y);
		var callFu = cc.callFunc(function()
		{
			self.isMoveFinished = true;
		}, this);
		var sequn = cc.sequence(moveTo, callFu);
		var sequ1 = cc.EaseElasticOut.create(sequn, time);
		this.selectedTagImg.runAction(sequn);
	}
});





