/*
 * created By zhoufangsheng 20151118
 */
var LandAnimate = rootLayer.extend(
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
			this.aLayer = cc.Layer.create();
			this.addChild(this.aLayer, 10);
			this.warnLayer = cc.Layer.create();
			this.addChild(this.warnLayer, 0);
			this.isWenzi = false;
			this.directionArr = [];//用于警告处理，警告动画只播放6秒
		},
		zinit:function()
		{
			this.setContentSize(this.size);
		},
		//火箭
		playRocketAnimation:function(direction, type)
		{
			this.aLayer.removeAllChildren(true);
			var rocketAnimate = PlayUIAnimate("res/landlord/cocosOut/Anim_rocket.json",0,81,false,cc.callFunc(function()
			{
				sparrowDirector.isPlayingAnimate = false;
				if(sparrowDirector.overData)
					sparrowDirector.gameFinshfunc();
			}));
			rocketAnimate.setPosition(this.size.width/2, this.size.height/2);
			this.aLayer.addChild(rocketAnimate);
		},
		//炸弹
		playBomeAnimation:function(direction, type)
		{
			this.aLayer.removeAllChildren(true);
			var bombAnimate = PlayUIAnimate("res/landlord/cocosOut/Anim_bomb.json",0,111,false,cc.callFunc(function()
			{
				sparrowDirector.isPlayingAnimate = false;
				if(sparrowDirector.overData)
					sparrowDirector.gameFinshfunc();
			}));
			bombAnimate.setPosition(this.size.width/2, this.size.height/2);
			this.aLayer.addChild(bombAnimate);
		},
		//飞机
		playPlaneAnimation:function(direction, type)
		{
			this.isWenzi = false;
			this.aLayer.removeAllChildren(true);
			var sp = cc.Sprite.create();
			sp.setPosition(this.size.width+415/2, this.size.height/2+50);
			this.aLayer.addChild(sp, 100);
			var animaFrames = [];
			for ( var i = 1; i <= 4; i++ )
			{
				var str = "CARTOON_PLAN_0"+i.toString() +".png";
				var frame = cc.spriteFrameCache.getSpriteFrame(str);
				animaFrames.push(frame);
			}
			var animation = cc.Animation.create(animaFrames, 0.07);
			var animate = cc.Animate.create(animation);
			sp.runAction(animate.repeatForever());

			var moveTo = cc.moveTo(2, cc.p(-415, this.size.height/2));
			var sequnce = cc.sequence(
				moveTo,
				cc.callFunc(function()
				{
					sparrowDirector.isPlayingAnimate = false;
					if(sparrowDirector.overData)
						sparrowDirector.gameFinshfunc();
				}),
				cc.removeSelf());
			sp.runAction(sequnce);
		},
		//春天
		playChunTianAnimation:function(func)
		{
			this.isWenzi = false;
			this.aLayer.removeAllChildren(true);
			var sp = cc.Sprite.create();
			sp.setPosition(this.size.width/2, this.size.height*2/3 + 0);
			this.aLayer.addChild(sp, 100);
			var animaFrames = [];
			for ( var i = 0; i <= 13; i++ )
			{
				var str = "";
				if ( i < 10 )
				{
					str = "DDZ_chuntian_0000"+i.toString() +".png";
				}
				else
				{
					str = "DDZ_chuntian_000"+i.toString() +".png";
				}
				var frame = cc.spriteFrameCache.getSpriteFrame(str);
				animaFrames.push(frame);
			}
			var animation = cc.Animation.create(animaFrames, 0.07);
			var animate = cc.Animate.create(animation);
			var sequnce = cc.sequence(
				cc.delayTime(0.15),
				cc.callFunc(function(){
					sparrowDirector.gameLayer.deskLayer.refreshCurrentBeishu();
				}),
				animate,
				func,
				cc.removeSelf());
			sp.runAction(sequnce);
		},
		//连对
		playLianDuiAnimation:function(direction, type)
		{
			this.isWenzi = false;
			this.aLayer.removeAllChildren(true);
			var sp = cc.Sprite.create();
			sp.setPosition(this.size.width/2, this.size.height*2/3);
			this.aLayer.addChild(sp, 100);
			var animaFrames = [];
			for ( var i = 0; i <= 15; i++ )
			{
				var str = "";
				if ( i < 10 )
				{
					str = "DDZ_liandui_0000"+i.toString() +".png";
				}
				else
				{
					str = "DDZ_liandui_000"+i.toString() +".png";
				}
				var frame = cc.spriteFrameCache.getSpriteFrame(str);
				animaFrames.push(frame);
			}
			var animation = cc.Animation.create(animaFrames, 0.1);
			var animate = cc.Animate.create(animation);
			var sequnce = cc.sequence(
				animate,
				cc.callFunc(function()
				{
					sparrowDirector.isPlayingAnimate = false;
					if(sparrowDirector.overData)
						sparrowDirector.gameFinshfunc();
				}),
				cc.removeSelf());
			sp.runAction(sequnce);
		},
		//顺子
		playShunziAnimation:function(direction, type)
		{
			this.isWenzi = false;
			this.aLayer.removeAllChildren(true);
			var sp = cc.Sprite.create();
			sp.setPosition(this.size.width/2, this.size.height*2/3 + 10);
			this.aLayer.addChild(sp, 100);
			var animaFrames = [];
			for ( var i = 0; i <= 16; i++ )
			{
				var str = "";
				if ( i < 10 )
				{
					str = "DDZ_shunzi_0000"+i.toString() +".png";
				}
				else
				{
					str = "DDZ_shunzi_000"+i.toString() +".png";
				}
				var frame = cc.spriteFrameCache.getSpriteFrame(str);
				animaFrames.push(frame);
			}
			var animation = cc.Animation.create(animaFrames, 0.1);
			var animate = cc.Animate.create(animation);
			var sequnce = cc.sequence(
				animate,
				cc.callFunc(function()
				{
					sparrowDirector.isPlayingAnimate = false;
					if(sparrowDirector.overData)
						sparrowDirector.gameFinshfunc();
				}),
				cc.removeSelf());
			sp.runAction(sequnce);
		},
		//显示文字图片
		showTxtImage:function(direction,type)
		{
			this.isWenzi = true;
			var img = ccui.ImageView.create();
			this.aLayer.addChild(img, 0);
			switch (type)
			{
				case CT_SINGLE_LINE://顺子
				{
					img.loadTexture("shunzi.png", ccui.Widget.PLIST_TEXTURE);
					break;
				}
				case CT_DOUBLE_LINE://连对
				{
					img.loadTexture("liandui.png", ccui.Widget.PLIST_TEXTURE);
					break;
				}
				case CT_THREE_LINE://飞机
				{
					img.loadTexture("feiji.png", ccui.Widget.PLIST_TEXTURE);
					break;
				}
				case CT_BOME_CARD://炸弹
				{
					img.loadTexture("zhadan.png", ccui.Widget.PLIST_TEXTURE);
					break;
				}
				case CT_MISSILE_CARD://火箭
				{
					img.loadTexture("zhadan.png", ccui.Widget.PLIST_TEXTURE);
					break;
				}
				default:
					break;
			}

			switch (direction)
			{
				case 0:
				{
					img.setPosition(winSize.width/2 + 20, winSize.height/2-40);
					break;
				}
				case 2:
				{
					img.setPosition(Control_pos.left.x, Control_pos.right.y);
					break;
				}
				case 1:
				{
					img.setPosition(Control_pos.right.x, Control_pos.right.y);
					break;
				}
				default:
					break;
			}
			var self = this;
			var fadeOut = cc.fadeOut(2);
			var callFunc = cc.callFunc(function(target)
			{
				self.isWenzi = false;
				target.removeFromParent();
			}, this);
			var sequence = cc.sequence(fadeOut, callFunc);
			if ( img )
			{
				img.runAction(sequence);
			}
			else
			{
				this.scheduleOnce(function()
				{
					//if ( img && self.isWenzi)
					{
						//self.isWenzi = false;
						//img.removeFromParent();
						self.aLayer.removeAllChildren();
					}
				}, 2);
			}

		},
		showWarnAnimate:function(direction)
		{

			var warnAnimate = this.getWarnAnimate(direction);
			switch (direction)
			{
				case 0:	//自己
				{
					var clockPos = [];
					var playHead = sparrowDirector.gameLayer.playerLayer.getChildByTag(100);
					if (playHead)
					{
						var pos = this.convertToNodeSpace(playHead.cardBg.getParent().convertToWorldSpace(playHead.cardBg.getPosition()));
						clockPos.x = pos.x + 15;
						clockPos.y = pos.y - 30;
					}

					warnAnimate.setPosition(clockPos.x,clockPos.y);

					break;
				}
				case 1:	//左
				{
					var clockPos = [];
					var playHead = sparrowDirector.gameLayer.playerLayer.getChildByTag(200);
					if (playHead)
					{
						var pos = this.convertToNodeSpace(playHead.cardBg.getParent().convertToWorldSpace(playHead.cardBg.getPosition()));
						clockPos.x = pos.x - 2;
						clockPos.y = pos.y + 60;
					}

					warnAnimate.setPosition(clockPos.x,clockPos.y);
					break;
				}
				case 2:	//右
				{
					var clockPos = [];
					var playHead = sparrowDirector.gameLayer.playerLayer.getChildByTag(300);
					if (playHead)
					{
						var pos = this.convertToNodeSpace(playHead.cardBg.getParent().convertToWorldSpace(playHead.cardBg.getPosition()));
						clockPos.x = pos.x + 2;
						clockPos.y = pos.y + 60;
					}

					warnAnimate.setPosition(clockPos.x,clockPos.y);
					break;
				}
				default :
					break;
			}
		},
		getWarnAnimate:function(direction)
		{
			var sp = cc.Sprite.create();
			for ( var i = 0; i < this.directionArr.length; i++ )
			{
				if ( this.directionArr[i] == direction )
				{
					return sp;
				}
			}
			LandCEMusic.playWarnEf();

			this.warnLayer.addChild(sp, 100);
			var animaFrames = [];
			for ( var i = 1; i <= 4; i++ )
			{
				var str = "COUNT_WARN_0"+i.toString() +".png";
				var frame = cc.spriteFrameCache.getSpriteFrame(str);
				animaFrames.push(frame);
			}
			var animation = cc.Animation.create(animaFrames, 0.1);
			var animate = cc.Animate.create(animation);
			sp.runAction(animate.repeatForever());

			this.scheduleOnce(function()
			{
				if (sparrowDirector.gameData.isGameOver)
				{
					return;
				}
				sp.removeFromParent();
			}, 6);
			this.directionArr.push(direction);

			return sp;
		},
		clearning:function()
		{
			this.directionArr.splice(0);
			this.warnLayer.removeAllChildren(true);
		}
	});






