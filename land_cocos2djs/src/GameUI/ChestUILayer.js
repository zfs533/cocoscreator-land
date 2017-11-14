/**
 * Created by yangyupeng on 16/3/30.
 */

var ChestStep =
{
    Step_none : 0,
    Step_chestBox : 1,
    Step_showItem : 2,
    Step_sure :     3
};

var ChestUILayer = cc.Layer.extend({
//var ChestUILayer = cc.Layer.extend({
    ctor: function (owner) {
        this._super();

        cc.spriteFrameCache.addSpriteFrames("res/landlord/chest/chest.plist");
        cc.spriteFrameCache.addSpriteFrames("res/landlord/chest/OpenPackage.plist");

        this.owner = owner;
        this.initChestLayer();
        this.initChestBox();
        this.initShowItem();
        this.initSureLayer();
        this.initPackage();

        this.chestStep = ChestStep.Step_none;
        setTouchListener(this, true, function(){return true;},function(){return true;},function(){return true;});
    },

    onEnter: function () {
        lm.log("yyp : ChestUILayer : onEnter start");
        this._super();
        this.chestStep = ChestStep.Step_chestBox;
        this.liwuArr = [];
    },

    initPackage:function()
    {
        var eyeSp = cc.Sprite.createWithSpriteFrameName("baoxiang_0.png");
        eyeSp.setPosition(winSize.width/2+10, winSize.height/2+60);
        //eyeSp.scale = 0.5;
        this.packagee = eyeSp;
        this.addChild(eyeSp, 10);
        //eyeSp.y += winSize.height;
        //var moveBy = cc.moveBy(1,0,-winSize.height);
        //eyeSp.runAction(moveBy.easing(cc.easeElasticOut(1)));

        var back = cc.Sprite.create("res/landlord/chest/baoxiang_background.png");
        back.setPosition(eyeSp.getPosition().x,eyeSp.getPosition().y-40);
        this.addChild(back, 9);
        //back.opacity = 200;
        this.pBack = back;
        var rotate = cc.rotateBy(20,720,720);
        back.runAction(rotate.repeatForever());

        eyeSp.scale = 0.3;
        var scaleGap01 = 1.8;
        var scaleGap02 = 0.5;
        var scaleGap03 = 1.5;
        var time01 = 0.25;
        var time02 = 0.1;
        var time03 = 0.1;
        var scaleTo = cc.scaleTo(time01,scaleGap01, scaleGap01);
        var scaleBy01 = cc.scaleTo(time02, scaleGap02, scaleGap02);
        var scaleBy02 = cc.scaleTo(time03, scaleGap03, scaleGap03);
        var sequnce = cc.sequence(scaleTo,scaleBy01, scaleBy02);
        eyeSp.runAction(cc.EaseIn.create(sequnce, 0.5));


    },

    initChestLayer: function ()
    {
        lm.log("yyp : ChestUILayer : initChestLayer start");

        this.parentView = ccs.load("res/landlord/cocosOut/ChestLayer.json").node;
        this.addChild(this.parentView);
        this.parentView.ignoreAnchorPointForPosition(false);
        this.parentView.setAnchorPoint(0.5,0.5);
        this.parentView.setPosition(winSize.width/2,winSize.height/2);

        this.maskLayer = ccui.helper.seekWidgetByName(this.parentView, "maskLayer");
        this.maskLayer.setColor(cc.color(0, 0, 0));
        this.maskLayer.setOpacity(0);
        var layer = cc.LayerColor.create(cc.color(0, 0, 0, 230));
        this.addChild(layer,-1);
        this.maskLayer = layer;

        //添加宝箱界面点击事件
        this.touchLayer = ccui.helper.seekWidgetByName(this.parentView, "touchLayer");
        this.touchLayer.setTouchEnabled(true);
        this.touchLayer.addTouchEventListener(function (sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                if (this.chestStep == ChestStep.Step_chestBox)
                {
                    //玩家在宝箱界面点击领取记录
                    if(GetDeviceType() == DeviceType.ANDROID) {
                        jsb.reflection.callStaticMethod(AndroidPackageName, "countTime", "(Ljava/lang/String;)V", "10001");
                    }
                    this.touchLayer.setTouchEnabled(false);
                    this.openChest();
                }
            }
        }, this);

    },


    initChestBox: function()
    {
        //获取控件
        this.chest_normal = ccui.helper.seekWidgetByName(this.parentView, "chest_normal");  // 宝箱
        this.chest_open = ccui.helper.seekWidgetByName(this.parentView, "chest_open");      // 宝箱 打开的
        this.chestBox = ccui.helper.seekWidgetByName(this.parentView, "chestBox");          // 展示宝箱的界面

        this.chest_light = ccui.helper.seekWidgetByName(this.parentView, "chest_light");    // 宝箱后边光效
        //this.chest_light.runAction(cc.repeatForever(cc.rotateBy(5.0,360)));
        this.chest_normal.setVisible(false);
        this.chest_open.setVisible(false);
        this.chest_light.setVisible(false);
    },

    initShowItem: function()
    {
        //获取控件
        this.showItem = ccui.helper.seekWidgetByName(this.parentView, "showItem");          // 展示获取的道具层
        this.show_ok = ccui.helper.seekWidgetByName(this.parentView, "show_ok");            // 展示道具层确定按钮 接收点击事件 只有点击后才会真正的获取道具



        //添加确定按钮点击事件
        this.show_ok.addTouchEventListener(function (sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                var self = this;
                //玩家在第二个弹窗界面点击确认记录
                if(GetDeviceType() == DeviceType.ANDROID) {
                    jsb.reflection.callStaticMethod(AndroidPackageName, "countTime", "(Ljava/lang/String;)V", "10002");
                }

                if (this.chestStep == ChestStep.Step_showItem)
                {
                    self.sendMessageServer(true);
                }
            }

        }, this);


    },

    initSureLayer: function()
    {
        //获取控件
        this.surelayer = ccui.helper.seekWidgetByName(this.parentView, "XXXLayer");         // 展示获取的道具层
        this.sure_ok = ccui.helper.seekWidgetByName(this.parentView, "sure_ok");            // 展示道具层确定按钮 接收点击事件 只有点击后才会真正的获取道具
        this.sure_text = ccui.helper.seekWidgetByName(this.parentView, "sure_text");            // 展示道具层确定按钮 接收点击事件 只有点击后才会真正的获取道具


        this.surelayer.visible = false;


        //添加确定按钮点击事件
        this.sure_ok.addTouchEventListener(function (sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                //if (this.chestStep == ChestStep.Step_sure)
                {
                    //玩家在第三个弹窗界面点击进入游戏记录
                    if(GetDeviceType() == DeviceType.ANDROID) {
                        jsb.reflection.callStaticMethod(AndroidPackageName, "countTime", "(Ljava/lang/String;)V", "10003");
                    }
                    this.removeFromParent();
                    this.owner.plaza_quick_startgame();
                }
            }

        }, this);


    },


    openChest:function()
    {
        var animaFrames = [];
        for(var i = 1; i <= 22; i++)
        {
            var str ="baoxiang_" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animaFrames.push(frame);
        }
        var animation = cc.Animation.create(animaFrames, 0.05);
        var animate = cc.Animate.create(animation);
        var scaleTo = cc.scaleTo(0.3, 0, 0);
        var callFunc = cc.callFunc(this.getNewPlayerData, this);
        var sequence = cc.sequence(animate,scaleTo, callFunc);
        this.packagee.runAction(sequence);
        var self = this;
        this.scheduleOnce(function()
        {
            var scaleTo = cc.scaleTo(0.3, 0, 0);
            self.pBack.runAction(scaleTo);
        }, 1);

        var forward = cc.Sprite.create("res/landlord/chest/baoxiang_forward.png");
        forward.setPosition(this.pBack.getPosition());
        this.addChild(forward, 20);
        forward.scale = 0;

        this.scheduleOnce(function()
        {
            var scaleTo = cc.scaleTo(0.1, 1.5,1.5);
            var scaleToo= cc.scaleTo(0.2, 0,0);
            var sequnce = cc.sequence(scaleTo, scaleToo);
            self.pBack.setOpacity(0);
            forward.runAction(sequnce);
        }, 0.8);

        return;
    },

    getNewPlayerData:function()
    {
        var self = this;

        var data = {"listreward":[
            {"RewardType":65601,"Name":"1元话费","Explain":"集齐30张可兑换30元话费","RewardValue":1},
            {"RewardType":65567,"Name":"补签卡","Explain":"补签消耗道具","RewardValue":2},
            {"RewardType":3,"Name":"奖牌","Explain":"集齐一定数量可兑换话费、手机等实物。","RewardValue":10},
            {"RewardType":1,"Name":"金币","Explain":"高富帅的象征，多多益善。","RewardValue":10000}
        ]};

        lm.log("yyp------新手大礼包数据 = " + JSON.stringify(data));
        roomManager.setNewPlayerData(data);
        this.parseNewPlayerData(data);
        this.chestBox.visible = false;
        this.showItem.visible = true;
        startPlayerActions(this.showItem);
        this.maskLayer.setOpacity(220);

        this.touchLayer.setTouchEnabled(true);
        this.chestStep = ChestStep.Step_showItem;
    },

    sendMessageServer:function(isHome)
    {
        var self = this;
        plazaMsgManager.GpNewPlayerChest(userInfo.globalUserdData["dwUserID"],Game_ID);
        plazaMsgManager.SetNewplayerchestCallBack(function(data){
            //data["ret"] = 0;
            //判断是否领取成功
            lm.log("---------------datadatadatadata= "+JSON.stringify(data));
            if ( !isHome ){return;}
            if(data["ret"] == 0) //成功
            {
                self.show_ok.setTouchEnabled(false);
                //self.surelayer.visible = true;
                closePlayerActions(self.showItem,function()
                {
                    self.scheduleOnce(function()
                    {
                        self.surelayer.visible = true;
                        startPlayerActions(self.surelayer);
                    },1.3);
                });
                self.maskLayer.setOpacity(0);
                self.flyGoods();
                self.chestStep = ChestStep.Step_sure;
            }
            else if(data["ret"] == 1) //已领取
            {
                lm.log("----------------------已领取");
                self.removeFromParent();
                layerManager.PopTipLayer(new PopAutoTipsUILayer("已领取奖励！", DefultPopTipsTime), false);

            }
            else if(data["ret"] == 2) //失败
            {
                lm.log("----------------------领取奖励失败,请重试！");
                self.removeFromParent();
                layerManager.PopTipLayer(new PopAutoTipsUILayer("领取奖励失败,请重试！", DefultPopTipsTime), false);
            }
            else if(data["ret"] == 3) //失败
            {
                lm.log("----------------------领取奖励失败,请重试！");
                self.removeFromParent();
                layerManager.PopTipLayer(new PopAutoTipsUILayer("参数传递错误！", DefultPopTipsTime), false);
            }
        },self);
    },
    //物品飞起动画
    flyGoods:function()
    {
        var time = 0.7, gd = [];
        for ( var i = 0; i < this.liwuArr.length; i++ )
        {
            var bg = cc.Sprite.create("res/landlord/chest/kuang.png");
            var good = cc.Sprite.create(this.liwuArr[i].texture);
            good.setPosition(this.liwuArr[i].pos);
            good.setScale(96/good.width, 96/good.height);
            this.addChild(good, 1000);
            gd.push(good);
            gd.push(bg);
            bg.setPosition(good.getPosition());
            this.addChild(bg, 9999);

            var moveBy = cc.EaseBounceOut.create(cc.moveBy(time, 0, 150));

            var moveTo = cc.moveTo(time,0,winSize.height-30);
            var scaleTo = cc.scaleTo(time, 0.1, 0.1);
            var spawn = cc.spawn(moveTo, scaleTo);
            var sequence = cc.sequence(moveBy, spawn);
            good.runAction(sequence);
            bg.runAction(sequence.clone());
        }
        this.scheduleOnce(function()
        {
            for ( var i = 0; i < gd.length; i++ )
            {
                gd[i].removeFromParent();
            }
        }, time*2);
    },

    parseNewPlayerData:function(maildata)
    {
        if ( this.liwuArr)
        {
            this.liwuArr.splice(0);
        }
        this.chestData = maildata;
        if((maildata === undefined) ||(maildata === null) || (maildata.length === 0) )
        {
            this.text_mai_tips.setVisible(true);
            this.btn_mail_up.setVisible(false);
            this.btn_mail_down.setVisible(false);

        }else
        {
            var dataList = maildata.listreward;
            for ( var i= 0; i < dataList.length; i++ )
            {
                lm.log("yyp RewardType" + Number(dataList[i]["RewardType"]));

                var itemBg = ccui.helper.seekWidgetByName(this.parentView, "item_bg" + (i+1));                          // 道具1 背景

                var mallid = Number(dataList[i]["RewardType"]);
                var id;
                if(mallid > 65536)  //大于65536的为道具ID
                {
                    id = mallid - 65536;
                }
                else
                {
                    id = "0000" + mallid;
                }
                var item = cc.Sprite.create("res/cocosOut/mall/" + id + ".jpg");
                //lm.log("res/cocosOut/mall/" + id + ".jpg");

                if(item) {
                    item.setPosition(itemBg.getPosition().x,itemBg.getPosition().y+1);
                    item.setScale(80/item.width, 80/item.height);
                    item.setLocalZOrder(itemBg.getLocalZOrder());
                    this.showItem.addChild(item, 500);
                    var obj = {pos:item.getParent().convertToWorldSpace(item.getPosition()), texture:"res/cocosOut/mall/" + id + ".jpg"}
                    this.liwuArr.push(obj);

                    var name = ccui.helper.seekWidgetByName(this.parentView, "namee" + (i+1));
                    if(dataList[i]["Name"] != "1元话费")
                    {
                        name.setString(dataList[i]["RewardValue"] + dataList[i]["Name"]);
                    }
                    else
                    {
                        name.setString(dataList[i]["Name"]);
                    }
                    //
                    //lm.log("yyp cheast1 " + "namee" + (i+1));
                    //lm.log("yyp cheast2 " + "namee" + (i+1)+"_0");
                    //ccui.helper.seekWidgetByName(this.parentView, "namee" + (i+1)).setString(dataList[i]["Name"]);
                    //var numG = ccui.helper.seekWidgetByName(this.parentView, "namee" + (i+1)+"_0");
                    //numG.setString("X"+dataList[i]["RewardValue"]);
                    //numG.setLocalZOrder(600);
                }
            }
        }
    },


    //打开宝箱动画
    playOpenChestAnimation:function()
    {
        lm.log("playOpenChestAnimation");
        var sp = cc.Sprite.create();
        sp.setPosition(200,400);
        this.addChild(sp,8000);

        var animaFrames = [];
        for ( var i = 1; i < 3; i++ )
        {
            var str = "";
            if ( i == 1 )
            {
                str = "chest_normal.png";
            }
            else
            {
                str = "chest_open.png";
            }
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animaFrames.push(frame);
        }
        var animation = cc.Animation.create(animaFrames, 0.2);
        var animate = cc.Animate.create(animation);
        sp.runAction(animate.repeatForever());

        lm.log("playOpenChestAnimation end ");
    }

});
