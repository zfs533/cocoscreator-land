/**
 * Created by lizhongqiang on 15/6/2.
 */

//签到界面
// 2015-06-26 16:22 签到 待增加一个日期更新后，同步更新签到数据



//连续签到奖励状态
var ConituneMarkStatus=
{
    MARK_STATUS_OVER :0,    // 已经领取
    MARK_STATUS_CANRECEIVE:1,  // 可领取
    MARK_STATUS_DONOTCANRECVIE:2  // 不可领取
};

// 奖励物品类型
var   RewardItemType=
{
    REWARD_TYPE_GOLD: 1, //金币
    REWARD_ITEMTYPE_MEDAL:2, //奖牌
    REWARD_ITEMTYPE_PROP:3,   // 道具
    REWARD_ITEMTYPE_MEMBER:4   // 会员
};


// 签到日期
var   CheckInDate =
{
    data_5_continute: -5,  // 5日累计
    data_10_continute: -10, // 10 日累计
    data_15_continute: -15, // 15日累计
    data_20_continute: -20, //  20日累计
    data_All_continute: -99  // 全勤
};



// 签到日期颜色
var MarkDayTextColor =
{
    todayColor :  cc.color( 255,0,0,255),    // 今日颜色
    otherdayColor :  cc.color( 228,201,186,255)  // 其他日期颜色
};


var MarkUILayer = rootLayer.extend({
    ctor: function () {
        this._super();
        this.initLayer();
        this.initAndroidBackKey();
        //hanhu #设定模态对话框 2015/07/23
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        }, this);
    },
    onTouchBegan : function(sender, type)
    {
        return true;
    },
    onTouchMoved : function(sender, type)
    {

    },
    onTouchEnded : function(sender, type)
    {
        return true;
    },


    //安卓back按钮
    initAndroidBackKey:function()
    {
        if(GetDeviceType() != DeviceType.ANDROID)
            return;

        var self = this;
        this.addChild(new AndroidBackKey(function(){
            self.removeFromParent();
        },this));
    },

    initLayer: function () {

        //如果存在弹出提示 关掉
        var runningScene = cc.director.getRunningScene();
        var oldlayer = runningScene.getChildByTag(TIP_TAG);
        if(oldlayer != null)
            oldlayer.removeFromParent();

        this.parentView = ccs.load("res/landlord/cocosOut/MarkUILayer.json").node;
        this.addChild(this.parentView);
        this.parentView.setPosition((winSize.width - 960) / 2, 0);

        //获取签到数据
        var self = this;
        var markdata = roomManager.GetMarkData();
        lm.log("签到数据 " + JSON.stringify(markdata) );
        if (markdata !== undefined && markdata !== null) {
            var text_today_date = ccui.helper.seekWidgetByName(this.parentView, "text_today_date");
            // 今日
            var today = markdata["today"];
            if ((today!== undefined) && (today !== null)) {
                text_today_date.setString(today["month"] + "月" + today["date"] + "日");
            }else
            {
                var date = new Date();
                var month = Number(date.getMonth()) + Number(1) ;
                text_today_date.setString(month + "月" + date.getDay() + "日");
            }

            //累计签到天数
            var text_total_checkcount = ccui.helper.seekWidgetByName(this.parentView, "text_total_checkcount");

            var checkeddates = markdata["rewardstatusList"]["checkeddates"];
            if((checkeddates !== undefined) && (checkeddates !== null))
               text_total_checkcount.setString("累计签到:" + checkeddates.length + "天");
            else
                text_total_checkcount.setString("累计签到:0天");

            //可补签的天数
            var text_cancheck_count = ccui.helper.seekWidgetByName(this.parentView, "text_cancheck_count");
            var retroactivedates = markdata["rewardstatusList"]["retroactivedates"];
            if((retroactivedates !== undefined) && (retroactivedates !== null))
                text_cancheck_count.setString("可补签:" + retroactivedates.length + "天");
            else
                text_cancheck_count.setString("可补签:0天");

            //今日已经签到，就隐藏马上签到按钮
            this.btn_check_now =ccui.helper.seekWidgetByName(this.parentView, "btn_check_now");
            //已签到
            if (this.IsCheckedDate(checkeddates, today["date"]))
            {
                this.btn_check_now.setVisible(false);

            }else
            {
                this.btn_check_now.setVisible(true);
                this.btn_check_now.date = today["date"];
                this.btn_check_now.setPressedActionEnabled(true);
                this.btn_check_now.addTouchEventListener(function (sender, type) {
                    if (type == ccui.Widget.TOUCH_ENDED) {
                        //发送签到
                        webMsgManager.SendGpGetCheckin(sender.date, function (resultdata) {

                            layerManager.PopTipLayer(new PopAutoTipsUILayer("签到成功，您获得:" + self.GetRewardItemText(resultdata["rewardlist"]), DefultPopTipsTime), false);

                            //更新显示
                            self.btn_check_now.setVisible(false);

                            var text_total_checkcount = ccui.helper.seekWidgetByName(self.parentView, "text_total_checkcount");
                            var checkeddates = markdata["rewardstatusList"]["checkeddates"];
                            if((checkeddates !== undefined) && (checkeddates !== null)) {
                                var newlength = checkeddates.length + 1;
                                text_total_checkcount.setString("累计签到:" + newlength + "天");
                            }
                            else
                                text_total_checkcount.setString("累计签到:0天");


                            // 刷新列表
                            self.UpdateRewardBtnStatusEx(resultdata);

                            self.RefReshDateView();

                            self.image_markitem_signed.setVisible(true);
                            self.btn_markitem_normal.setTouchEnabled(false);

                        }, function (serverinfo) {
                            layerManager.PopTipLayer(new PopAutoTipsUILayer(serverinfo,DefultPopTipsTime),false);

                        }, this);
                    }

                }, this);
            }
        }

        // 签到关闭按钮
        var btn_mark_close = ccui.helper.seekWidgetByName(this.parentView,"btn_mark_close");
        btn_mark_close.setPressedActionEnabled(true);
        btn_mark_close.addTouchEventListener(function (sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                self.removeFromParent();

                //begin modified by lizhongqiang 2015-08-17 11:50
                //layerManager.PopNoticeLayer();

                // end modified by lizhongqiang
            }

        }, this);

        // 列表
        this.panel_mark_date=ccui.helper.seekWidgetByName(this.parentView, "panel_mark_date");

        // 刷新列表
        this.RefReshDateView();
        this.UpdateRewardBtnStatus();

        this.setDarkBg();

    },

    // 5日奖励状态
    Reward5Status:function(reward_status,rewarddata)
    {
        var self = this;
        var btn_reward =ccui.helper.seekWidgetByName(this.parentView, "btn_five_reward");

        //奖励文字
        var textbmfont_all_0 =ccui.helper.seekWidgetByName(btn_reward, "textbmfont_all_0");
        textbmfont_all_0.setString(this.getMarkRewardStr(rewarddata));

        //已领取
        var Image_nor =ccui.helper.seekWidgetByName(btn_reward, "Image_five_nor");

        //可领取
        var Image_pre =ccui.helper.seekWidgetByName(this.parentView, "Image_five_pre");

        switch (reward_status)
        {
            case ConituneMarkStatus.MARK_STATUS_OVER: // 已经领取
            {
                Image_pre.setVisible(false);
                Image_nor.setVisible(true);

            }
                break;
            case ConituneMarkStatus.MARK_STATUS_CANRECEIVE: // 可领取
            {
                Image_pre.setVisible(true);
                Image_nor.setVisible(false);

                btn_reward.Image_pre = Image_pre;
                btn_reward.Image_nor = Image_nor;
                btn_reward.setPressedActionEnabled(true);
                btn_reward.addTouchEventListener(function (sender, type)
                {
                    if (type == ccui.Widget.TOUCH_ENDED)
                    {
                        //发送签到
                        webMsgManager.SendGpGetCheckin(CheckInDate.data_5_continute,function(resultdata){

                            layerManager.PopTipLayer(new PopAutoTipsUILayer("领取奖励成功，您获得:" + self.GetRewardItemText(resultdata["rewardlist"]), DefultPopTipsTime),false);
                            sender.Image_pre.setVisible(false);
                            sender.Image_nor.setVisible(true);
                            sender.setTouchEnabled(false);

                            // 刷新列表
                            self.UpdateRewardBtnStatusEx(resultdata);

                        },function(serverinfo)
                        {
                            layerManager.PopTipLayer(new PopAutoTipsUILayer(serverinfo,DefultPopTipsTime),false);

                        },this);

                    }

                }, this);

            }
                break;
            case ConituneMarkStatus.MARK_STATUS_DONOTCANRECVIE: // 不可领取
            {
                Image_pre.setVisible(false);
                Image_nor.setVisible(false);

                return;
                //btn_reward.setPressedActionEnabled(true);
                btn_reward.addTouchEventListener(function (sender, type)
                {
                    if (type == ccui.Widget.TOUCH_BEGAN)
                    {
                        sender.canTouch = true;
                        sender.beganPos = sender.getTouchBeganPosition();

                        sender.stopAllActions();
                        sender.runAction(cc.scaleTo(0.05,1.05,1.05));
                        return true;
                    }
                    if (type == ccui.Widget.TOUCH_MOVED)
                    {
                        if(sender.canTouch == false)
                        {
                            return;
                        }

                        var movePos = sender.getTouchMovePosition();
                        if(cc.pDistance(movePos,sender.beganPos) > 50)
                        {
                            sender.stopAllActions();
                            sender.runAction(cc.scaleTo(0.05,1.0,1.0));
                            sender.canTouch = false;
                        }

                        // 获取当前触摸点相对于按钮所在的坐标
                        var locationInNode = sender.convertToNodeSpace(movePos);
                        var rect = cc.rect(0, 0, sender.getContentSize().width, sender.getContentSize().height);
                        if (cc.rectContainsPoint(rect, locationInNode) == false)
                        {
                            sender.stopAllActions();
                            sender.runAction(cc.scaleTo(0.05,1.0,1.0));
                            sender.canTouch = false;
                        }

                    }
                    if (type == ccui.Widget.TOUCH_ENDED)
                    {
                        sender.stopAllActions();
                        sender.runAction(cc.scaleTo(0.05,1.0,1.0));

                        if(sender.canTouch == false)
                        {
                            return ;
                        }
                        var markreward = new MarkRewardUILayer();
                        markreward.ignoreAnchorPointForPosition(false);
                        markreward.setAnchorPoint(0.5,0.5);
                        markreward.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
                        markreward.RefReshRewardListView(rewarddata);
                        cc.director.getRunningScene().addChild(markreward, 9999);

                        //var  markreward =  new  MarkRewardUILayer();
                        //markreward.RefReshRewardListView(rewarddata);
                        //layerManager.PopTipLayer(markreward, true);

                    }

                }, this);

            }
                break;
        }
    },

    // 10日奖励状态
    Reward10Status:function(reward_status,rewarddata)
    {
        lm.log("yyp Reward10Status" + reward_status);
        var self = this;
        var btn_reward =ccui.helper.seekWidgetByName(this.parentView, "btn_ten_reward");

        //奖励文字
        var textbmfont_all_0 =ccui.helper.seekWidgetByName(btn_reward, "textbmfont_all_0");
        textbmfont_all_0.setString(this.getMarkRewardStr(rewarddata));

        //已领取
        var Image_nor =ccui.helper.seekWidgetByName(btn_reward, "Image_ten_nor");

        //可领取
        var Image_pre =ccui.helper.seekWidgetByName(this.parentView, "Image_ten_pre");

        switch (reward_status)
        {
            case ConituneMarkStatus.MARK_STATUS_OVER: // 已经领取
            {
                lm.log("yyp Reward10Status 1");
                Image_pre.setVisible(false);
                Image_nor.setVisible(true);

            }
                break;
            case ConituneMarkStatus.MARK_STATUS_CANRECEIVE: // 可领取
            {
                lm.log("yyp Reward10Status 2");
                Image_pre.setVisible(true);
                Image_nor.setVisible(false);

                btn_reward.Image_pre = Image_pre;
                btn_reward.Image_nor = Image_nor;
                btn_reward.setPressedActionEnabled(true);
                btn_reward.addTouchEventListener(function (sender, type)
                {
                    if (type == ccui.Widget.TOUCH_ENDED)
                    {
                        //发送签到
                        webMsgManager.SendGpGetCheckin(CheckInDate.data_10_continute,function(resultdata){

                            layerManager.PopTipLayer(new PopAutoTipsUILayer("领取奖励成功，您获得:" + self.GetRewardItemText(resultdata["rewardlist"]), DefultPopTipsTime),false);
                            sender.Image_pre.setVisible(false);
                            sender.Image_nor.setVisible(true);
                            sender.setTouchEnabled(false);

                            // 刷新列表
                            self.UpdateRewardBtnStatusEx(resultdata);

                        },function(serverinfo)
                        {
                            layerManager.PopTipLayer(new PopAutoTipsUILayer(serverinfo,DefultPopTipsTime),false);

                        },this);

                    }

                }, this);

            }
                break;
            case ConituneMarkStatus.MARK_STATUS_DONOTCANRECVIE: // 不可领取
            {
                lm.log("yyp Reward10Status 3");
                Image_pre.setVisible(false);
                Image_nor.setVisible(false);

                return;
                //btn_reward.setPressedActionEnabled(true);
                btn_reward.addTouchEventListener(function (sender, type)
                {
                    if (type == ccui.Widget.TOUCH_BEGAN)
                    {
                        sender.canTouch = true;
                        sender.beganPos = sender.getTouchBeganPosition();

                        sender.stopAllActions();
                        sender.runAction(cc.scaleTo(0.05,1.05,1.05));
                        return true;
                    }
                    if (type == ccui.Widget.TOUCH_MOVED)
                    {
                        if(sender.canTouch == false)
                        {
                            return;
                        }

                        var movePos = sender.getTouchMovePosition();
                        if(cc.pDistance(movePos,sender.beganPos) > 50)
                        {
                            sender.stopAllActions();
                            sender.runAction(cc.scaleTo(0.05,1.0,1.0));
                            sender.canTouch = false;
                        }

                        // 获取当前触摸点相对于按钮所在的坐标
                        var locationInNode = sender.convertToNodeSpace(movePos);
                        var rect = cc.rect(0, 0, sender.getContentSize().width, sender.getContentSize().height);
                        if (cc.rectContainsPoint(rect, locationInNode) == false)
                        {
                            sender.stopAllActions();
                            sender.runAction(cc.scaleTo(0.05,1.0,1.0));
                            sender.canTouch = false;
                        }

                    }
                    if (type == ccui.Widget.TOUCH_ENDED)
                    {
                        sender.stopAllActions();
                        sender.runAction(cc.scaleTo(0.05,1.0,1.0));

                        if(sender.canTouch == false)
                        {
                            return ;
                        }
                        lm.log("yyp Reward10Status 31");
                        var markreward = new MarkRewardUILayer();
                        markreward.ignoreAnchorPointForPosition(false);
                        markreward.setAnchorPoint(0.5,0.5);
                        markreward.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
                        markreward.RefReshRewardListView(rewarddata);
                        cc.director.getRunningScene().addChild(markreward, 9999);

                        //var  markreward =  new  MarkRewardUILayer();
                        //markreward.RefReshRewardListView(rewarddata);
                        //layerManager.PopTipLayer(markreward, true);

                    }

                }, this);

            }
                break;
        }
    },

    // 15日奖励状态
    Reward15Status:function(reward_status,rewarddata)
    {
        var self = this;
        var btn_reward =ccui.helper.seekWidgetByName(this.parentView, "btn_fifteen_reward");

        //奖励文字
        var textbmfont_all_0 =ccui.helper.seekWidgetByName(btn_reward, "textbmfont_all_0");
        textbmfont_all_0.setString(this.getMarkRewardStr(rewarddata));

        //已领取
        var Image_nor =ccui.helper.seekWidgetByName(btn_reward, "Image_fifteen_nor");

        //可领取
        var Image_pre =ccui.helper.seekWidgetByName(this.parentView, "Image_fifteen_pre");

        switch (reward_status)
        {
            case ConituneMarkStatus.MARK_STATUS_OVER: // 已经领取
            {
                Image_pre.setVisible(false);
                Image_nor.setVisible(true);

            }
                break;
            case ConituneMarkStatus.MARK_STATUS_CANRECEIVE: // 可领取
            {
                Image_pre.setVisible(true);
                Image_nor.setVisible(false);

                btn_reward.Image_pre = Image_pre;
                btn_reward.Image_nor = Image_nor;
                btn_reward.setPressedActionEnabled(true);
                btn_reward.addTouchEventListener(function (sender, type)
                {
                    if (type == ccui.Widget.TOUCH_ENDED)
                    {
                        //发送签到
                        webMsgManager.SendGpGetCheckin(CheckInDate.data_15_continute,function(resultdata){

                            layerManager.PopTipLayer(new PopAutoTipsUILayer("领取奖励成功，您获得:" + self.GetRewardItemText(resultdata["rewardlist"]), DefultPopTipsTime),false);
                            sender.Image_pre.setVisible(false);
                            sender.Image_nor.setVisible(true);
                            sender.setTouchEnabled(false);

                            // 刷新列表
                            self.UpdateRewardBtnStatusEx(resultdata);

                        },function(serverinfo)
                        {
                            layerManager.PopTipLayer(new PopAutoTipsUILayer(serverinfo,DefultPopTipsTime),false);

                        },this);

                    }

                }, this);

            }
                break;
            case ConituneMarkStatus.MARK_STATUS_DONOTCANRECVIE: // 不可领取
            {
                Image_pre.setVisible(false);
                Image_nor.setVisible(false);

                return;
                //btn_reward.setPressedActionEnabled(true);
                btn_reward.addTouchEventListener(function (sender, type)
                {
                    if (type == ccui.Widget.TOUCH_BEGAN)
                    {
                        sender.canTouch = true;
                        sender.beganPos = sender.getTouchBeganPosition();

                        sender.stopAllActions();
                        sender.runAction(cc.scaleTo(0.05,1.05,1.05));
                        return true;
                    }
                    if (type == ccui.Widget.TOUCH_MOVED)
                    {
                        if(sender.canTouch == false)
                        {
                            return;
                        }

                        var movePos = sender.getTouchMovePosition();
                        if(cc.pDistance(movePos,sender.beganPos) > 50)
                        {
                            sender.stopAllActions();
                            sender.runAction(cc.scaleTo(0.05,1.0,1.0));
                            sender.canTouch = false;
                        }

                        // 获取当前触摸点相对于按钮所在的坐标
                        var locationInNode = sender.convertToNodeSpace(movePos);
                        var rect = cc.rect(0, 0, sender.getContentSize().width, sender.getContentSize().height);
                        if (cc.rectContainsPoint(rect, locationInNode) == false)
                        {
                            sender.stopAllActions();
                            sender.runAction(cc.scaleTo(0.05,1.0,1.0));
                            sender.canTouch = false;
                        }

                    }
                    if (type == ccui.Widget.TOUCH_ENDED)
                    {
                        sender.stopAllActions();
                        sender.runAction(cc.scaleTo(0.05,1.0,1.0));

                        if(sender.canTouch == false)
                        {
                            return ;
                        }
                        var markreward = new MarkRewardUILayer();
                        markreward.ignoreAnchorPointForPosition(false);
                        markreward.setAnchorPoint(0.5,0.5);
                        markreward.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
                        markreward.RefReshRewardListView(rewarddata);
                        cc.director.getRunningScene().addChild(markreward, 9999);

                        //var  markreward =  new  MarkRewardUILayer();
                        //markreward.RefReshRewardListView(rewarddata);
                        //layerManager.PopTipLayer(markreward, true);

                    }

                }, this);

            }
                break;
        }
    },

    // 20日奖励状态
    Reward20Status:function(reward_status,rewarddata)
    {
        var self = this;
        var btn_reward =ccui.helper.seekWidgetByName(this.parentView, "btn_twenty_reward");

        //奖励文字
        var textbmfont_all_0 =ccui.helper.seekWidgetByName(btn_reward, "textbmfont_all_0");
        textbmfont_all_0.setString(this.getMarkRewardStr(rewarddata));

        //已领取
        var Image_nor =ccui.helper.seekWidgetByName(btn_reward, "Image_twenty_nor");

        //可领取
        var Image_pre =ccui.helper.seekWidgetByName(this.parentView, "Image_twenty_pre");

        switch (reward_status)
        {
            case ConituneMarkStatus.MARK_STATUS_OVER: // 已经领取
            {
                Image_pre.setVisible(false);
                Image_nor.setVisible(true);

            }
                break;
            case ConituneMarkStatus.MARK_STATUS_CANRECEIVE: // 可领取
            {
                Image_pre.setVisible(true);
                Image_nor.setVisible(false);

                btn_reward.Image_pre = Image_pre;
                btn_reward.Image_nor = Image_nor;
                btn_reward.setPressedActionEnabled(true);
                btn_reward.addTouchEventListener(function (sender, type)
                {
                    if (type == ccui.Widget.TOUCH_ENDED)
                    {
                        //发送签到
                        webMsgManager.SendGpGetCheckin(CheckInDate.data_20_continute,function(resultdata){

                            layerManager.PopTipLayer(new PopAutoTipsUILayer("领取奖励成功，您获得:" + self.GetRewardItemText(resultdata["rewardlist"]), DefultPopTipsTime),false);
                            sender.Image_pre.setVisible(false);
                            sender.Image_nor.setVisible(true);
                            sender.setTouchEnabled(false);

                            // 刷新列表
                            self.UpdateRewardBtnStatusEx(resultdata);

                        },function(serverinfo)
                        {
                            layerManager.PopTipLayer(new PopAutoTipsUILayer(serverinfo,DefultPopTipsTime),false);

                        },this);

                    }

                }, this);

            }
                break;
            case ConituneMarkStatus.MARK_STATUS_DONOTCANRECVIE: // 不可领取
            {
                Image_pre.setVisible(false);
                Image_nor.setVisible(false);

                return;
                //btn_reward.setPressedActionEnabled(true);
                btn_reward.addTouchEventListener(function (sender, type)
                {
                    if (type == ccui.Widget.TOUCH_BEGAN)
                    {
                        sender.canTouch = true;
                        sender.beganPos = sender.getTouchBeganPosition();

                        sender.stopAllActions();
                        sender.runAction(cc.scaleTo(0.05,1.05,1.05));
                        return true;
                    }
                    if (type == ccui.Widget.TOUCH_MOVED)
                    {
                        if(sender.canTouch == false)
                        {
                            return;
                        }

                        var movePos = sender.getTouchMovePosition();
                        if(cc.pDistance(movePos,sender.beganPos) > 50)
                        {
                            sender.stopAllActions();
                            sender.runAction(cc.scaleTo(0.05,1.0,1.0));
                            sender.canTouch = false;
                        }

                        // 获取当前触摸点相对于按钮所在的坐标
                        var locationInNode = sender.convertToNodeSpace(movePos);
                        var rect = cc.rect(0, 0, sender.getContentSize().width, sender.getContentSize().height);
                        if (cc.rectContainsPoint(rect, locationInNode) == false)
                        {
                            sender.stopAllActions();
                            sender.runAction(cc.scaleTo(0.05,1.0,1.0));
                            sender.canTouch = false;
                        }

                    }
                    if (type == ccui.Widget.TOUCH_ENDED)
                    {
                        sender.stopAllActions();
                        sender.runAction(cc.scaleTo(0.05,1.0,1.0));

                        if(sender.canTouch == false)
                        {
                            return ;
                        }
                        var markreward = new MarkRewardUILayer();
                        markreward.ignoreAnchorPointForPosition(false);
                        markreward.setAnchorPoint(0.5,0.5);
                        markreward.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
                        markreward.RefReshRewardListView(rewarddata);
                        cc.director.getRunningScene().addChild(markreward, 9999);

                        //var  markreward =  new  MarkRewardUILayer();
                        //markreward.RefReshRewardListView(rewarddata);
                        //layerManager.PopTipLayer(markreward, true);

                    }

                }, this);

            }
                break;
        }

    },

    // All 奖励状态
    RewardAllStatus:function(reward_status,rewarddata)
    {
        var self = this;
        var btn_reward =ccui.helper.seekWidgetByName(this.parentView, "btn_all_reward");

        //奖励文字
        var textbmfont_all_0 =ccui.helper.seekWidgetByName(btn_reward, "textbmfont_all_0");
        textbmfont_all_0.setString(this.getMarkRewardStr(rewarddata));

        //已领取
        var Image_nor =ccui.helper.seekWidgetByName(btn_reward, "Image_all_nor");

        //可领取
        var Image_pre =ccui.helper.seekWidgetByName(this.parentView, "Image_all_pre");

        switch (reward_status)
        {
            case ConituneMarkStatus.MARK_STATUS_OVER: // 已经领取
            {
                Image_pre.setVisible(false);
                Image_nor.setVisible(true);

            }
                break;
            case ConituneMarkStatus.MARK_STATUS_CANRECEIVE: // 可领取
            {
                Image_pre.setVisible(true);
                Image_nor.setVisible(false);

                btn_reward.Image_pre = Image_pre;
                btn_reward.Image_nor = Image_nor;
                btn_reward.setPressedActionEnabled(true);
                btn_reward.addTouchEventListener(function (sender, type)
                {
                    if (type == ccui.Widget.TOUCH_ENDED)
                    {
                        //发送签到
                        webMsgManager.SendGpGetCheckin(CheckInDate.data_all_continute,function(resultdata){

                            layerManager.PopTipLayer(new PopAutoTipsUILayer("领取奖励成功，您获得:" + self.GetRewardItemText(resultdata["rewardlist"]), DefultPopTipsTime),false);
                            sender.Image_pre.setVisible(false);
                            sender.Image_nor.setVisible(true);
                            sender.setTouchEnabled(false);

                            // 刷新列表
                            self.UpdateRewardBtnStatusEx(resultdata);

                        },function(serverinfo)
                        {
                            layerManager.PopTipLayer(new PopAutoTipsUILayer(serverinfo,DefultPopTipsTime),false);

                        },this);

                    }

                }, this);

            }
                break;
            case ConituneMarkStatus.MARK_STATUS_DONOTCANRECVIE: // 不可领取
            {
                Image_pre.setVisible(false);
                Image_nor.setVisible(false);

                return;
                //btn_reward.setPressedActionEnabled(true);
                btn_reward.addTouchEventListener(function (sender, type)
                {
                    if (type == ccui.Widget.TOUCH_BEGAN)
                    {
                        sender.canTouch = true;
                        sender.beganPos = sender.getTouchBeganPosition();

                        sender.stopAllActions();
                        sender.runAction(cc.scaleTo(0.05,1.05,1.05));
                        return true;
                    }
                    if (type == ccui.Widget.TOUCH_MOVED)
                    {
                        if(sender.canTouch == false)
                        {
                            return;
                        }

                        var movePos = sender.getTouchMovePosition();
                        if(cc.pDistance(movePos,sender.beganPos) > 50)
                        {
                            sender.stopAllActions();
                            sender.runAction(cc.scaleTo(0.05,1.0,1.0));
                            sender.canTouch = false;
                        }

                        // 获取当前触摸点相对于按钮所在的坐标
                        var locationInNode = sender.convertToNodeSpace(movePos);
                        var rect = cc.rect(0, 0, sender.getContentSize().width, sender.getContentSize().height);
                        if (cc.rectContainsPoint(rect, locationInNode) == false)
                        {
                            sender.stopAllActions();
                            sender.runAction(cc.scaleTo(0.05,1.0,1.0));
                            sender.canTouch = false;
                        }

                    }
                    if (type == ccui.Widget.TOUCH_ENDED)
                    {
                        sender.stopAllActions();
                        sender.runAction(cc.scaleTo(0.05,1.0,1.0));

                        if(sender.canTouch == false)
                        {
                            return ;
                        }
                        lm.log("yyp winSize" + winSize.width + " " + winSize.height);
                        var markreward = new MarkRewardUILayer();
                        markreward.ignoreAnchorPointForPosition(false);
                        markreward.setAnchorPoint(0.5,0.5);
                        markreward.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
                        markreward.RefReshRewardListView(rewarddata);
                        cc.director.getRunningScene().addChild(markreward, 9999);

                        //var  markreward =  new  MarkRewardUILayer();
                        //markreward.RefReshRewardListView(rewarddata);
                        //layerManager.PopTipLayer(markreward, true);
                    }

                }, this);

            }
                break;
        }

    },

    //更新奖励按钮状态
    UpdateRewardBtnStatus:function()
    {
        var markdata = roomManager.GetMarkData();
        if((markdata !== undefined) && (markdata !== null) )
        {
            var rewarddata = markdata["checkinreward"];
            this.Reward5Status(markdata["rewardstatusList"]["reward_3_status"],rewarddata["reward_3"]);
            this.Reward10Status(markdata["rewardstatusList"]["reward_7_status"],rewarddata["reward_7"]);
            this.Reward15Status(markdata["rewardstatusList"]["reward_15_status"],rewarddata["reward_15"]);
            this.Reward20Status(markdata["rewardstatusList"]["reward_25_status"],rewarddata["reward_25"]);
            this.RewardAllStatus(markdata["rewardstatusList"]["reward_all_status"],rewarddata["reward_all"]);
        }
    },

    // 更新签到奖励按钮
    UpdateRewardBtnStatusEx:function(resultdata)
    {
        var markdata = roomManager.GetMarkData();
        if((markdata !== undefined) && (markdata !== null) )
        {
            var rewarddata = markdata["checkinreward"];
            this.Reward5Status(resultdata["reward_3_status"],rewarddata["reward_3"]);
            this.Reward10Status(resultdata["reward_7_status"],rewarddata["reward_7"]);
            this.Reward15Status(resultdata["reward_15_status"],rewarddata["reward_15"]);
            this.Reward20Status(resultdata["reward_25_status"],rewarddata["reward_25"]);
            this.RewardAllStatus(resultdata["reward_all_status"],rewarddata["reward_all"]);

        }
    },

    getMarkRewardStr:function(data)
    {
        if(data == undefined || data == null)
            return;


        var retStr = "";
        for (var key in data)
        {
            var itemvalue =  data[key]["itemvalue"];
            var itemcount =  data[key]["itemcount"];
            var itemtype =  data[key]["itemtype"];
            var itemname = data[key]["itemname"];


            switch (Number(itemtype))
            {
                case RewardItemType.REWARD_TYPE_GOLD:
                {
                    retStr = indentationGlod(itemvalue) + "金币";
                }
                    break;
                case RewardItemType.REWARD_ITEMTYPE_MEDAL:
                {
                    retStr = itemvalue + "奖牌";
                }
                    break;
                case RewardItemType.REWARD_ITEMTYPE_PROP:
                {
                    retStr = itemcount + "道具";
                }
                    break;
                case RewardItemType.REWARD_ITEMTYPE_MEMBER:
                {
                    switch (Number(itemvalue))
                    {
                        case MemberOrder.MEMBER_ORDER_YELLOW: //黄钻
                        {
                            retStr = itemcount + "天黄钻";
                        }
                            break;
                        case MemberOrder.MEMBER_ORDER_BLUE:  //蓝钻
                        {
                            retStr = itemcount + "天蓝钻";
                        }
                            break;
                        case MemberOrder.MEMBER_ORDER_RED:     //红钻
                        {
                            retStr = itemcount + "天红钻";
                        }
                            break;
                        default :
                            break;
                    }

                }break;
                default :
                {
                }
                    break;
            }
            break;
        }

        if(data.length > 1)
            retStr = retStr + "等";
        else if(data.length == 0)
            retStr = "神秘礼物";

        return retStr;

    },

    //获取某月日期天数
    DayNumOfMonth:function(year, month)
    {
        var day = new Date(year, month, 0);
       return  (day.getDate());

    },

    // 日期是否是可补签的日期
    IsRetroactiveDate: function(retroactivedates , day)
    {
        for(var j =0;j<retroactivedates.length;j++)
        {
            // 当日是可补签的日期
            if(day == retroactivedates[j])
            {
               return true;
            }
        }

        return false;
    },

    //显示已经签到的日期
    IsCheckedDate: function(checkeddates , day)
    {
        for(var j =0;j<checkeddates.length;j++)
        {
            // 当日是可补签的日期
            if(day == checkeddates[j])
            {
                return true;
            }
        }
        return false;
    },

    //连续几日
    CountOfContinuteDay:function(checkeddates)
    {
        for(var j =0;j<checkeddates.length;j++)
        {
            // 当日是可补签的日期
            if(day == checkeddates[j])
            {
                return true;
            }
        }
    },

    //刷新日期视图
    RefReshDateView:function() {

        this.panel_mark_date.removeAllChildren();
        var self = this;
        var markdata = roomManager.GetMarkData();
        var firstdayofweek = 0;
        var daycount = 0;
        var today = 0;
        if (markdata !== undefined && markdata !== null) {
            var todaydat = markdata["today"];

            //今日
            today = todaydat["date"];

            //此处 month - 0 -11
            var firstdate = new Date(todaydat["year"], todaydat["month"] - 1, 1);
            firstdayofweek = firstdate.getDay();

            daycount = this.DayNumOfMonth(todaydat["year"], todaydat["month"]);

            //可补签的日期数组
            var retroactivedates = markdata["rewardstatusList"]["retroactivedates"];

            //已经签到的日期数组
            var checkeddates = markdata["rewardstatusList"]["checkeddates"];


            var baseItem = ccui.helper.seekWidgetByName(ccs.load("res/landlord/cocosOut/MarkItemLayer.json").node, "panel_mark_item")
            var day= 0;
            var x,y;
            for(var i = 0;i < 42; i++)
            {
                x = Math.floor(i%7);
                y = Math.floor(i/7);

                var Item = baseItem.clone();
                Item.ignoreAnchorPointForPosition(false);
                Item.setAnchorPoint(0,1);
                Item.setPosition(x*(Item.getContentSize().width - 2),  this.panel_mark_date.getContentSize().height - y* (Item.getContentSize().height - 2));
                this.panel_mark_date.addChild(Item);
                // this.panel_mark_date.setItemModel(Item);
                // 本月1号星期几，开始设置数据，截止最后一天 其余都为默认
                if((i  >= firstdayofweek) &&  (day < daycount) )
                {
                    day++;

                    //日期
                    var text_markitem_day =ccui.helper.seekWidgetByName(Item, "text_markitem_day");
                    text_markitem_day.setString(String(day));
                    // lm.log("the day is " + text_markitem_day);
                    text_markitem_day.setVisible(true);

                    // 设置今日日期颜色和其他日期颜色
                    //text_markitem_day.setColor((today == day) ? MarkDayTextColor.todayColor : MarkDayTextColor.otherdayColor);
                    // 签到
                    var  btn_markitem_normal =ccui.helper.seekWidgetByName(Item, "btn_markitem_normal");

                    //已签到
                    var  Image_markitem_signed =ccui.helper.seekWidgetByName(Item, "Image_markitem_signed");

                    //默认背景
                    //Image_mark_normal =ccui.helper.seekWidgetByName(Item, "Image_mark_normal");

                    //可补签
                    var  btn_markitem_ret =ccui.helper.seekWidgetByName(Item, "btn_markitem_ret");

                    // 今日
                    if(day == today)
                    {
                        this.image_markitem_signed = Image_markitem_signed;
                        this.btn_markitem_normal = btn_markitem_normal;
                        //今日已签到
                        if(this.IsCheckedDate(checkeddates , day))
                        {
                            Image_markitem_signed.setVisible(true);
                            //btn_markitem_normal.setVisible(false);
                            btn_markitem_ret.setVisible(false);

                        }
                        // 今日可签到
                       else
                        {
                            Image_markitem_signed.setVisible(false);
                            btn_markitem_ret.setVisible(false);
                            btn_markitem_normal.setVisible(true);
                            btn_markitem_normal.Image_markitem_signed = Image_markitem_signed;
                            btn_markitem_normal.date = day;
                            btn_markitem_normal.addTouchEventListener(function (sender, type)
                            {
                                if (type == ccui.Widget.TOUCH_ENDED)
                                {
                                    //发送签到
                                    webMsgManager.SendGpGetCheckin(sender.date,function(resultdata){

                                        layerManager.PopTipLayer(new PopAutoTipsUILayer("签到成功，您获得:" + self.GetRewardItemText(resultdata["rewardlist"]), DefultPopTipsTime),false);

                                        //更新显示
                                        sender.setVisible(false);
                                        sender.Image_markitem_signed.setVisible(true);

                                        // 刷新列表
                                        self.UpdateRewardBtnStatusEx(resultdata);



                                    },function(serverinfo)
                                    {
                                        layerManager.PopTipLayer(new PopAutoTipsUILayer(serverinfo,DefultPopTipsTime),false);

                                    },this);
                                }

                            }, this);
                        }

                     // 显示可补签的日期
                    }else if(this.IsRetroactiveDate(retroactivedates , day))
                    {
                        continue;

                        //btn_markitem_normal.setVisible(false);
                        Image_markitem_signed.setVisible(false);
                        btn_markitem_ret.setVisible(true);
                        btn_markitem_ret.setSwallowTouches(false);
                        btn_markitem_ret.btn_markitem_normal = btn_markitem_normal;
                        btn_markitem_ret.Image_markitem_signed = Image_markitem_signed;
                        btn_markitem_ret.btn_markitem_ret = btn_markitem_ret;
                        btn_markitem_ret.date = day;
                        btn_markitem_ret.addTouchEventListener(function (sender, type)
                        {
                            if (type == ccui.Widget.TOUCH_ENDED)
                            {
                                lm.log("补签date " + sender.date);
                                //发送签到
                                webMsgManager.SendGpGetCheckin(sender.date,function(resultdata){

                                    layerManager.PopTipLayer(new PopAutoTipsUILayer("消耗补签卡x1,补签成功,获得:" + self.GetRewardItemText(resultdata["rewardlist"]), DefultPopTipsTime),false);

                                    lm.log("补签成功 " + sender.date);
                                    //更新显示
                                    sender.setVisible(false);
                                    sender.Image_markitem_signed.setVisible(true);
                                    sender.btn_markitem_ret.setVisible(false);

                                    // 刷新列表
                                    self.UpdateRewardBtnStatusEx(resultdata);

                                },function(serverinfo){

                                    lm.log("补签失败 " + sender.date);
                                    layerManager.PopTipLayer(new PopAutoTipsUILayer(serverinfo,DefultPopTipsTime),false);

                                },this);

                            }

                        }, this);

                    }
                    // 显示已经签到的日期
                    else  if(this.IsCheckedDate(checkeddates , day))
                    {
                        Image_markitem_signed.setVisible(true);
                        //btn_markitem_normal.setVisible(false);
                        btn_markitem_ret.setVisible(false);
                    }

                }
            }
        }
    },

    // 获取奖励提示文本
    GetRewardItemText:function(data)
    {
        // 签到成功提示
        var itemtiptext="";
        for(var key in data)
        {
            lm.log("msg : " +  data[key]["msg"]);
            if((key == 0) || (key == (data.length -1)))
            {
                itemtiptext += data[key]["msg"];
            }else
            {
                itemtiptext += data[key]["msg"] + "，";
            }
        }
        lm.log("rewardlist : " +  itemtiptext);
        return itemtiptext;
    }

});

