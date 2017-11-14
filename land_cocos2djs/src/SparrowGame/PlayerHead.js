/**
 * Created by zhoufangsheng on 15/11/10.
 */
var PlayerHead = cc.Layer.extend(
    {
        /*
         {"type":"tagMobileUserInfoHead","dwGameID":138490,"dwUserID":32450,"wFaceID":37,"dwCustomID":0,
         "cbGender":0,"cbMemberOrder":0,"wTableID":8,"wChairID":2,"cbUserStatus":2,
         "lScore":990000000,"dwWinCount":0,"dwlostCount":0,"dwDrawCount":0,"dwFleeCount":0,
         "dwExperience":0,"szNickName":"o61193"}
         */
        ctor:function(type, data)
        {
            this._super();
            this.setVariable(type,data);
            this.zinit();
            this.addUI();
            this.setPosAndScale();
            this.setInformation();
            this.hideOrshowThings(data);
        },
        setVariable:function(type,data)
        {
            this.size = cc.size(148, 144);
            this.type = type;
            this.data = data;
            //是否为地主
            this.isDizhu = false;
        },
        zinit:function()
        {
            this.setContentSize(this.size);
            this.ui = ccs.load("res/landlord/cocosOut/PlayerHead.json").node;
            this.addChild(this.ui, 0);
        },
        addUI:function()
        {
            //头像节点（左上）
            this.head = ccui.helper.seekWidgetByName(this.ui, "head01");
            //玩家头像
            this.playerHead = this.head.getChildByName("playerHead");
            //玩家头像
            this.playerHead_ai = this.head.getChildByName("playerHead_ai");
            this.playerHead_ai.visible = false;
            //角色（地主，农民）
            this.role = this.head.getChildByName("role");
            //玩家名字
            this.playerName = this.head.getChildByName("playerName");
            //剩余牌数量
            this.remainCard = this.head.getChildByName("remainCard");
            //扣着的牌
            this.cardBg = this.head.getChildByName("cardBg");
            //玩家金币
            this.gold = this.head.getChildByName("gold");
            this.resultGold = this.head.getChildByName("resultGold");
            //VIP标记
            //this.vip = this.head.getChildByName("vip");
            this.layer_tips = this.head.getChildByName("layer_tips");
            this.Image_call = this.layer_tips.getChildByName("Image_call");
            this.Image_rob = this.layer_tips.getChildByName("Image_rob");
            this.Image_nocall = this.layer_tips.getChildByName("Image_nocall");
            this.Image_norob = this.layer_tips.getChildByName("Image_norob");
            //准备状态
            this.readied = this.layer_tips.getChildByName("readied");
            //不出
            this.cancel = this.layer_tips.getChildByName("cancel");
            this.cancel_0 = this.cancel.getChildByName("cancel_0");
            this.cancelText = this.cancel.getChildByName("cancelText");
            //非玩家
            this.nameBg01 = this.head.getChildByName("nameBg01");
            //玩家
            this.nameBg02 = this.head.getChildByName("nameBg02");

            this.role.visible = false;
            //this.vip.visible = false;
            this.Image_call.visible = false;
            this.Image_rob.visible = false;
            this.Image_nocall.visible = false;
            this.Image_norob.visible = false;
            this.readied.visible = false;
            this.cancel.visible = false;
            this.playerHead.addTouchEventListener(this.showPlayerInfo, this);

            this.oneCard = false;
            this.twoCard = false;
        },
        //设置用户信息
        setInformation:function()
        {
            var data = this.data;
            var str = nickNameConvert(data.szNickName);
            this.playerName.setString(str);
            this.remainCard.setString(0);
            this.hideResultGold();
            this.setPlayerIco();
            var score = indentationGlod(data.lScore);
            this.gold.setString(score);
        },
        hideResultGold:function()
        {
            this.resultGold.setString(0);
            this.resultGold.visible = false;
            if ( this.data.wChairID == sparrowDirector.gameData.myChairIndex ){return;}
            this.remainCard.visible = true;
            this.cardBg.visible     = true;
        },
        //刷新用户信息
        refreshPlayerStatus:function(status)
        {
            if ( status == PlayerStatus.US_READY )
            {
                this.readied.visible = true;
                if ( this.data.wChairID == sparrowDirector.gameData.myChairIndex )
                {
                    sparrowDirector.gameLayer.orderLayer.startBtn.visible = false;
                }
            }
            else
            {
                this.readied.visible = false;
            }
        },
        setPlayerIco:function()
        {
            var data = this.data;
            var CustomFaceLayer = CustomFace.CGameCustomFaceLayer.create();
            CustomFaceLayer.SetImageRect(35, 35, 74, 73);
            CustomFaceLayer.SetVisable(false);
            this.playerHead.addChild(CustomFaceLayer, 9999);

            var userId = data.dwUserID, faceid = data.wFaceID, customfaceid = data.dwCustomID;
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


                    this.playerHead.loadTexture(name, 1);
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
                this.playerHead.loadTexture(name, 1);
            }
            cc.log("playeraheaddata======= "+JSON.stringify(data)+"  ===name= "+name);
        },
        setPosAndScale:function()
        {
            switch (this.type)
            {
                case 0:
                    this.ui.setPositionX(8);
                    this.readied.setPosition(Control_pos.center);
                    this.readied.scale = 1.4;
                    this.layer_tips.setPositionX(this.layer_tips.getPositionX() + 10);
                    this.layer_tips.setPositionY(this.layer_tips.getPositionY() + 85);
                    break;

                case 1:
                    this.ui.setPositionX(8);
                    this.layer_tips.setPositionX(this.layer_tips.getPositionX() + 10);
                    break;

                case 2:
                    this.ui.setPositionX(-8);
                    this.head.scaleX = -1;
                    this.playerHead.scaleX = - 1.05;
                    this.role.scaleX = -1;
                    this.playerName.scaleX = -1;
                    this.remainCard.scaleX = -1;
                    this.gold.scaleX *= -1;
                    this.resultGold.scaleX *= -1;
                    //this.gold.anchorX = 1;
                    //this.vip.scaleX = -1;
                    this.Image_call.scaleX = -1;
                    this.Image_rob.scaleX = -1;
                    this.Image_nocall.scaleX = -1;
                    this.Image_norob.scaleX = -1;
                    this.readied.scaleX = -1;
                    this.cancel.scaleX *= -1;
                    this.cancelText.scaleX *= -1;
                    this.cancel_0.scaleX *= -1;
                    this.remainCard.x +=2;
                    this.layer_tips.setPositionX(this.layer_tips.getPositionX() + 13);
                    break;

                default:
                    break;
            }
        },
        showRole:function(bool)
        {
            this.role.visible = true;
            if ( bool )
            {
                this.role.loadTexture("desk003.png",ccui.Widget.PLIST_TEXTURE);
            }
            else
            {
                this.role.loadTexture("desk006.png",ccui.Widget.PLIST_TEXTURE);
            }
            this.isDizhu = bool;
        },

        hideRole:function()
        {
            if ( sparrowDirector.gameData.isGaming ){return;}
            this.role.visible = false;
        },
        refreshPlayerInfo:function(data)
        {
            this.data = data;
            this.hideOrshowThings(data);
            this.setInformation();
        },
        hideOrshowThings:function(data)
        {
            if ( data.wChairID == sparrowDirector.gameData.myChairIndex )
            {
                this.gold.visible = false;
                this.cardBg.visible = false;
                this.remainCard.visible = false;
                this.nameBg02.visible = true;
                this.nameBg01.visible = false;
                if ( sparrowDirector.gameLayer.bottomLayer )
                {
                    var score = indentationGlod(userInfo.globalUserdData["lUserScore"]);
                    sparrowDirector.gameLayer.bottomLayer.playerGoldNum.setString(score);
                }

            }
        },
        playResultGoldAnimate:function(goldNum)
        {
            this.remainCard.visible = false;
            this.cardBg.visible     = false;
            this.resultGold.visible = true;
            var timeGap = 20;
            var fuhao = function(that)
            {
                if ( goldNum > 0 )
                {
                    that.resultGold.setFntFile("res/landlord/cocosOut/fnt/jia-export.fnt");
                    return "+";
                }
                that.resultGold.setFntFile("res/landlord/cocosOut/fnt/jian-export.fnt");
                return "-";
            }(this);
            var gold = 0;
            var count = 0;
            this.schedule(function()
            {
                count++;
                gold += Math.random()*(Math.abs(goldNum)/20);
                var str = fuhao + Math.floor(gold);
                this.resultGold.setString(str);
                if ( count >= timeGap )
                {
                    this.resultGold.setString(fuhao+Math.abs(goldNum));
                    this.unscheduleAllCallbacks();
                    this.updateScore(goldNum);
                }
            }, 0.05, timeGap);
        },
        //游戏结算刷新用户分数
        updateScore:function(scoreNum)
        {
            var data = this.data;
            var scoree = data.lScore + scoreNum;
            this.data.lScore = scoree;
            var score = indentationGlod(scoree);
            this.gold.setString(score);



            if ( this.data.wChairID == sparrowDirector.gameData.myChairIndex )
            {
                if ( sparrowDirector.gameLayer.bottomLayer )
                {
                    var mm = sparrowDirector.gameLayer.bottomLayer.playerGoldNum;
                    score = indentationGlod(userInfo.globalUserdData["lUserScore"]);
                    mm.setString(score);
                }
            }
            var myInfo = sparrowDirector.getInfoOfPlayers(data["dwUserID"]);
            if( myInfo )
            {
                myInfo.lScore = scoree;
                lm.log(myInfo.lScore+" zzzzzzzzzzz------------z-z-z-z-z-z--z-z");
            }
        },
        //显示玩家信息
        showPlayerInfo:function(target, state)
        {
            if ( state == ccui.Widget.TOUCH_ENDED )
            {
                var parentLayer = sparrowDirector.gameLayer.playerInfoLayer;
                if(parentLayer.getChildren().length > 0)
                {
                    return;
                }
                //parentLayer.removeAllChildren();
                var data = this.data;

                var infoLayer = new userInfoPopup(data);
                var pos = this.getParent().convertToWorldSpace(this.getPosition());
                if (pos.x > winSize.width/2 )
                {
                    pos.x -= 230;
                }
                else
                {
                    pos.x += 330;
                }
                infoLayer.setPosition(pos);
                parentLayer.addChild(infoLayer);
            }
        }
    });
