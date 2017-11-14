/*
 * created By zhoufangsheng 20151104
 */
//扑克构造类
var GameCard = cc.Layer.extend(
	{
		ctor:function()
		{
			this._super();
			this.setVariable();
			this.zinit();
			this.yOffset = 38;
			this.Ypos = 46.45;
		},
		setVariable:function()
		{
			this.colorTexture   = {
				hei  : "card_spade.png",
				hong : "card_heart.png",
				mei  : "card_club.png",
				fang : "card_diamond.png"
			}
			this.m_cbCardListData =
				[
					0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08,0x09,0x0A,0x0B,0x0C,0x0D,	//方块 A - K
					0x11,0x12,0x13,0x14,0x15,0x16,0x17,0x18,0x19,0x1A,0x1B,0x1C,0x1D,	//梅花 A - K
					0x21,0x22,0x23,0x24,0x25,0x26,0x27,0x28,0x29,0x2A,0x2B,0x2C,0x2D,	//红桃 A - K
					0x31,0x32,0x33,0x34,0x35,0x36,0x37,0x38,0x39,0x3A,0x3B,0x3C,0x3D,	//黑桃 A - K
					0x4E,0x4F //双鬼
				];
			//是否被选中上移
			this.posNomal = true;
			//用于大小排序
			this.sortNumber = 0;
			this.sortNumber01 = 0;
			this.laiziNum = 0;
			//选中是向上移动距离
			this.moveDistance = 30;
			this.isEventEnabled = false;
			this.moveFinished = true;
		},
		zinit:function()
		{
			this.size = cc.size(142, 200);
			this.setContentSize(this.size);
			this.scale = winSize.width/1136, winSize.height/640;
		},
		//创建盖着的扑克
		createPukerBack:function()
		{
			var p               = cc.p(this.size.width*this.scale/2, this.size.height*this.scale/2);
			this.pukerBack      = ccui.ImageView.create("card_back.png", ccui.Widget.PLIST_TEXTURE);
			this.pukerBack.setPosition(p);
			this.addChild(this.pukerBack, 30);
		},
		//创建扑克
		createPuker:function(num, isDiZhu, isSmallCard)
		{
			var smStr = "";
			if ( isSmallCard )
			{
				smStr = "sm_";
			}
			num = num || 10;
			this.sortNumber = num;
			var p               = cc.p(this.size.width/2, this.size.height/2);
			this.pukerBg        = ccui.ImageView.create(smStr+"card_front.png", ccui.Widget.PLIST_TEXTURE);
			this.pukerBg.setPosition(p);
			this.addChild(this.pukerBg);

			var pukerData       = this.getPukerData(num);
			if ( isSmallCard )
			{
				pukerData 		= this.getPukerDataSmall(num);
			}
			this.sortNumber01 = pukerData.value == 2 ? 15 : pukerData.value;
			var strCenter       = pukerData.texture ? pukerData.texture : pukerData.huapai;//扑克花色
			this.pukerCenter    = ccui.ImageView.create(smStr+strCenter, ccui.Widget.PLIST_TEXTURE);
			this.pukerCenter.setPosition(p);
			this.addChild(this.pukerCenter, 10);

			var strColor        = pukerData.texture ? pukerData.colorTexture : pukerData.huapai;
			this.pukerColor     = ccui.ImageView.create(smStr+strColor, ccui.Widget.PLIST_TEXTURE);//扑克点数
			this.pukerColor.setPosition(p);
			this.addChild(this.pukerColor, 20);
			this.pukerColor.setTouchEnabled(true);
			this.pukerColor.addTouchEventListener(this.pukerEvent, this);

			var dizhuTag		= cc.Sprite.createWithSpriteFrameName("dizhu.png");
			this.pukerColor.addChild(dizhuTag,30);
			dizhuTag.setAnchorPoint(1,1);
			dizhuTag.setPosition(this.pukerColor.width-2, this.pukerColor.height-2);
			this.dizhuTag = dizhuTag;
			this.dizhuTag.visible = false;


			this.showCardTag		= cc.Sprite.createWithSpriteFrameName("image_showcard.png");
			this.pukerColor.addChild(this.showCardTag,31);
			this.showCardTag.setAnchorPoint(1,1);
			this.showCardTag.setPosition(this.pukerColor.width-2, this.pukerColor.height-2);
			this.showCardTag.visible = false;

			this.bgSprite = cc.Sprite.createWithSpriteFrameName(smStr+"card_front.png");
			this.bgSprite.opacity = 200;
			this.bgSprite.setPosition(p);
			this.addChild(this.bgSprite, 100);
			this.setGrayShader(this.bgSprite);
			this.bgSprite.visible = false;

			//癞子
			var laiTag = cc.Sprite.createWithSpriteFrameName("lai_big_tag.png");
			laiTag.setPosition(p);
			this.laizi = laiTag;
			if ( isSmallCard )
			{
				var laiTag = cc.Sprite.createWithSpriteFrameName("lai_small_tag.png");
				laiTag.setPosition(p);
				this.laizi = laiTag;
			}
			this.addChild(this.laizi, 50);
			this.hideLaizi();

			//this.showDiZhuTag();
		},
		//设置灰度
		setGrayShader:function(sprite)
		{
			var program = new cc.GLProgram("res/shaders/gray.vsh", "res/shaders/gray.fsh");
			program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
			program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
			program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
			program.link();
			program.updateUniforms();
			sprite.shaderProgram = program;
		},
		pukerEvent:function(target, state)
		{
			if ( !sparrowDirector.gameData.isCanOutPuker )
			{
				return;
			}
			if ( state == ccui.Widget.TOUCH_BEGAN )
			{
				if ( this.isEventEnabled )
				{
					this.showBlackLayer(true);
				}
			}
			if ( state == ccui.Widget.TOUCH_ENDED )
			{
				if ( this.isEventEnabled )
				{
					this.selectedCard();
					this.showBlackLayer(false);
					//LandCEMusic.playSelectedEffect();
					sparrowDirector.gameLayer.orderLayer.setOutPukerBtnEnable();
				}
			}
			if ( state == ccui.Widget.TOUCH_CANCELED )
			{
				this.isEventEnabled = false;
			}
		},
		showDiZhuTag:function(bool)
		{
			if ( bool )
			{
				this.dizhuTag.visible = true;
			}
			else
			{
				this.dizhuTag.visible = false;
			}
		},
		setShowCardTag:function(bool)
		{
			if ( bool )
			{
				this.showCardTag.visible = true;
			}
			else
			{
				this.showCardTag.visible = false;
			}
		},
		hideLaizi:function()
		{
			this.laizi.visible = false;
			this.pukerColor.visible = true;
		},
		showLaizi:function()
		{
			this.laizi.visible = true;
			this.pukerColor.visible = false;
		},
		showBlackLayer:function(bool, bool1)
		{
			if ( this.bgSprite.visible && bool )
			{
				return;
			}
			if ( !this.bgSprite.visible && !bool )
			{
				return;
			}
			this.bgSprite.visible = bool;
			if (!bool1)
			{
				LandCEMusic.playSelectedEffect();
			}
		},
		//扑克选中监听
		selectedCard:function()
		{
			lm.log("selectedCard------------------------")
			//this.stopAllActions();
			if (!this.moveFinished){return;}
			var self = this;
			var time = 0.03;
			if ( this.posNomal )
			{
				if ( this.moveFinished )
				{
					this.posNomal = false;
					//this.y+=this.moveDistance
					this.moveFinished = false;
					var moveTo = cc.moveBy(time, 0, this.moveDistance);
					var callfunc = cc.callFunc(function()
					{
						self.moveFinished = true;
						if ( self.y > self.Ypos + self.moveDistance)
						{
							self.y = self.Ypos + self.moveDistance;
						}
					}, this);
					var sequnce = cc.sequence(moveTo, callfunc);
					this.runAction(sequnce);
				}
			}
			else
			{
				if ( this.moveFinished )
				{
					this.posNomal = true;
					//this.y-=this.moveDistance
					this.moveFinished = false;
					var moveTo = cc.moveBy(time, 0, -this.moveDistance);
					var callfunc = cc.callFunc(function()
					{
						self.moveFinished = true;
						if ( self.y < self.Ypos)
						{
							self.y = self.Ypos;
						}
					}, this);
					var sequnce = cc.sequence(moveTo, callfunc);
					this.runAction(sequnce);
				}
			}
		},
		getPukerDataSmall:function(pukerN)
		{
			var cadLib = this.m_cbCardListData, puker = {texture:0, value:0, colorTexture:"", huapai:""};
			puker.laiziNum = 0;
			//双鬼处理
			if ( pukerN == 78 )
			{
				puker.value = 78;
				puker.huapai = "card_jokerbk.png";
				return puker;
			}
			else if ( pukerN == 79 )
			{
				puker.value = 79;
				puker.huapai = "card_jokerrd.png";
				return puker;
			}
			for ( var i = 0; i < cadLib.length; i++ )
			{
				if ( cadLib[i] == pukerN )
				{
					puker.value = i % 13 + 1;
					if ( puker.value == 1 )
					{
						//对A的特殊处理
						puker.value = 14;
					}
					if ( puker.value == 2 && puker.sValue < 52 )
					{
						//对2的特殊处理
						puker.value = 15;
					}
					puker.colorTexture = this.getPukerColor(i);
				}
			}
			//根据扑克点数和花色找到其纹理
			if ( puker.value <= 14 )
			{
				//红色数字
				if ( puker.colorTexture == this.colorTexture.fang || puker.colorTexture == this.colorTexture.hong )
				{
					if ( puker.value == 14 )
					{
						puker.texture = "card_code0" + 1 + ".png";
					}
					else
					{
						puker.texture = puker.value < 10 ? "card_code0" + puker.value + ".png" : "card_code" + puker.value + ".png";
					}
				}
				else
				{
					if ( puker.value == 14 )
					{
						puker.texture = "card_code00" + 1 + ".png";
					}
					else
					{
						puker.texture = puker.value < 10 ? "card_code00" + puker.value + ".png" : "card_code0" + puker.value + ".png";
					}
				}
			}
			return puker;
		},
		//pukerN 服务器换回的扑克数据,获取扑克1-K的值
		getPukerData:function(pukerN)
		{
			var cadLib = this.m_cbCardListData, puker = {texture:0, value:0, colorTexture:"", huapai:""};
			puker.laiziNum = 0;
			//双鬼处理
			if ( pukerN == 78 )
			{
				puker.value = 78;
				puker.huapai = "card_jokerbk.png";
				return puker;
			}
			else if ( pukerN == 79 )
			{
				puker.value = 79;
				puker.huapai = "card_jokerrd.png";
				return puker;
			}
			for ( var i = 0; i < cadLib.length; i++ )
			{
				if ( cadLib[i] == pukerN )
				{
					puker.value = i % 13 + 1;
					if ( puker.value == 1 )
					{
						//对A的特殊处理
						puker.value = 14;
					}
					if ( puker.value == 2 && puker.sValue < 52 )
					{
						//对2的特殊处理
						puker.value = 15;
					}
					puker.colorTexture = this.getPukerColor(i);
				}
			}
			//扑克点数大于10
			switch (puker.value)
			{
				case 11:
				{
					puker.huapai = this.getPukerSuperTen(puker.value, puker.colorTexture);
					break;
				}
				case 12:
				{
					puker.huapai = this.getPukerSuperTen(puker.value, puker.colorTexture);
					break;
				}
				case 13:
				{
					puker.huapai = this.getPukerSuperTen(puker.value, puker.colorTexture);
					break;
				}
				default :
					break;
			}
			//根据扑克点数和花色找到其纹理
			if ( puker.value < 11 || puker.value == 14 )
			{
				//红色数字
				if ( puker.colorTexture == this.colorTexture.fang || puker.colorTexture == this.colorTexture.hong )
				{
					if ( puker.value == 14 )
					{
						puker.texture = "card_code0" + 1 + ".png";
					}
					else
					{
						puker.texture = puker.value < 10 ? "card_code0" + puker.value + ".png" : "card_code" + puker.value + ".png";
					}
				}
				else
				{
					if ( puker.value == 14 )
					{
						puker.texture = "card_code00" + 1 + ".png";
					}
					else
					{
						puker.texture = puker.value < 10 ? "card_code00" + puker.value + ".png" : "card_code0" + puker.value + ".png";
					}
				}
			}
			return puker;
		},
		//获取扑克点数大于10的扑克
		getPukerSuperTen:function(value, type)
		{
			var huaTexture = "";
			switch (type)
			{
				case this.colorTexture.fang:
				{
					huaTexture = "card_diamond" + value + ".png";
					break;
				}
				case this.colorTexture.mei:
				{
					huaTexture = "card_club" + value + ".png";
					break;
				}
				case this.colorTexture.hong:
				{
					huaTexture = "card_heart" + value + ".png";
					break;
				}
				case this.colorTexture.hei:
				{
					huaTexture = "card_spade" + value + ".png";
					break;
				}
				default :
					break;
			}
			return huaTexture;
		},
		//获取扑克花色，黑，红，梅，方
		getPukerColor:function(num)
		{
			if ( num < 13 )
			{
				return this.colorTexture.fang;
			}
			else if ( num >= 13 && num < 26 )
			{
				return this.colorTexture.mei;
			}
			else if ( num >= 26 && num < 39 )
			{
				return this.colorTexture.hong;
			}
			else if ( num >= 39 && num < 52 )
			{
				return this.colorTexture.hei;
			}
		}
	});


