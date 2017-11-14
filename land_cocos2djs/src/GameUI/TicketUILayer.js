/**
 * Created by lizhongqiang on 15/6/18.
 */


// 奖品兑换状态
var PrizeOrderStatus =
{
    PRIZEORDER_STATUS_NEW : 0,  // 新建
    PRIZEORDER_STATUS_COMPLETE :1, // 完结
    PRIZEORDER_STATUS_PROCESSING: 2,// 处理中
    PRIZEORDER_STATUS_ARTIFICIAL :3,// 人工处理
    PRIZEORDER_STATUS_ARTIFICIAL_PROCESSING : 4,// 人工处理中
    PRIZEORDER_STATUS_SCRAPPED : 5    // 	作废订单
};



// 奖品兑换条件类型
var PrizeExchangeConditionsType =
{
    CONDITIONS_TYPE_CALL : -2,  // 话费卷
    CONDITIONS_TYPE_MEDAL :-1 // 奖牌
};





//已完成兑奖状态颜色
var CompleteColor = cc.color(3,200,45,255);

// 默认page标记，用户查找
var DefultPageTag = 100;

// 默认 page标记Y位置
var DefultPageFlagY = 125;

//默认page间隔
var DefultPageFlagXOffset = 30;

//默认缩放比例
var DefultScallRate = 0.4;

//当前选择的透明度
var DefultPageFlagSelOpacity = 255;

//常规透明度
var DefultPageFlagNormalOpacity = 100;

//每一页显示的item 数目
var DefultEarchPageItemCount  = 6;



// 兑奖UI界面
var TicketUILayer = rootUILayer.extend({
    ctor: function () {
        this._super();
        this.initLayer();
        //cc.SpriteFrameCache.getInstance().removeSpriteFramesFromFile("res/cocosOut/userface/userface.plist");

    },
    onEnter: function () {
        this._super();

    },

    onEnterTransitionDidFinish: function () {
        this._super();

        //初始化兑换记录
        this.scheduleOnce(this.AddExchangeView, 0.01);
    },
    onExit: function () {
        this._super();
        //cc.TextureCache.getInstance().removeUnusedTextures();
        //cc.SpriteFrameCache.getInstance().removeUnusedSpriteFrames();
    },
    initLayer: function ()
    {
        cc.spriteFrameCache.addSpriteFrames("res/landlord/cocosOut/plaza/exchange/exchange.plist");

        this.parentView = ccs.load("res/landlord/cocosOut/TicketUILayer.json").node;
        this.addChild(this.parentView);
        //hanhu #调整兑奖界面坐标 2015/08/07
        var offset = (this.parentView.getContentSize().width * winSize.height / 640 - winSize.width) / 2;
        this.parentView.x -= offset;

        this.origin = cc.p((winSize.width - this.parentView.getContentSize().width)/2, (winSize.height - this.parentView.getContentSize().height)/2);
        this.org_pos = this.parentView.getPosition();


        //兑换列表
        this.scrollView_exchange = ccui.helper.seekWidgetByName(this.parentView, "scrollView_exchange");

        //兑换记录
        this.layer_record = ccui.helper.seekWidgetByName(this.parentView, "layer_record");
        this.scrollView_record = ccui.helper.seekWidgetByName(this.parentView, "scrollView_record");

        this.defultExchangeitem = ccui.helper.seekWidgetByName(ccs.load("res/landlord/cocosOut/TicketScrollItem.json").node, "layer_ticketScrollitem");
        this.defultExchangeitem.retain();

        this.defultRecodeitem = ccui.helper.seekWidgetByName(ccs.load("res/landlord/cocosOut/TicketRecordItem.json").node, "panel_ticketrecorditem_bk");
        this.defultRecodeitem.retain();

        this.text_record_tips  = ccui.helper.seekWidgetByName(this.parentView, "text_record_tips");

        this.initLabelBtn();



        //pageview
        //this.pageview_ticket = ccui.helper.seekWidgetByName(this.parentView, "pageview_ticket");
        //this.panel_ticket_record = ccui.helper.seekWidgetByName(this.parentView, "panel_ticket_record");
        //this.listview_ticket = ccui.helper.seekWidgetByName(this.panel_ticket_record, "listview_ticket");
        //
        //var defaultItem = ccui.helper.seekWidgetByName(ccs.load("res/cocosOut/TicketRecordItem.json").node, "panel_ticketrecorditem_bk");
        //this.listview_ticket.setItemModel(defaultItem);
        //
        //
        //var self = this;
        //
        //this.pageview_ticket.setCustomScrollThreshold(50);
        //
        ////添加拖动监听
        //this.pageview_ticket.addEventListener(function(sender, type){
        //
        //    if(type == ccui.PageView.EVENT_TURNING)
        //    {
        //        self.RefReshPageFlags();
        //        //self.pageview_ticket.setTouchEnabled(true);
        //    }
        //
        //},this);
        //
        //奖品兑换
        //this.btn_exchange_ticket = ccui.helper.seekWidgetByName(this.parentView, "btn_exchange_ticket");
        //this.Image_exchangetick_select =ccui.helper.seekWidgetByName(this.parentView, "Image_exchangetick_select");
        //this.Image_exchangetick_unselect =ccui.helper.seekWidgetByName(this.parentView, "Image_exchangetick_unselect");
        //this.btn_exchange_ticket.addTouchEventListener(function (sender, type) {
        //    if (type == ccui.Widget.TOUCH_ENDED) {
        //
        //        this.SelectExchangeBtns(true);
        //
        //        // 清空当前页标记
        //        this.ClearPageFlags();
        //        this.AddPageFlags(true);
        //    }
        //}, this);
        //
        //
        ////奖品兑换记录
        //this.btn_exchange_record = ccui.helper.seekWidgetByName(this.parentView, "btn_exchange_record");
        //this.Image_exchangerecord_unselect  = ccui.helper.seekWidgetByName(this.parentView, "Image_exchangerecord_unselect");
        //this.Image_exchangerecord_select  = ccui.helper.seekWidgetByName(this.parentView, "Image_exchangerecord_select");
        //this.btn_exchange_record.addTouchEventListener(function (sender, type) {
        //    if (type == ccui.Widget.TOUCH_ENDED) {
        //
        //        this.RefReshRecordView();
        //        this.SelectExchangeBtns(false);
        //        this.ClearPageFlags();
        //    }
        //}, this);


        // 我的奖牌、话费卷
        var layer_medal = ccui.helper.seekWidgetByName(this.parentView, "layer_medal");
        layer_medal.setPositionX(layer_medal.getPositionX() - this.origin.x);
        this.text_ticket_medal = ccui.helper.seekWidgetByName(this.parentView, "text_ticket_medal");
        //this.text_ticket_call = ccui.helper.seekWidgetByName(this.parentView, "text_ticket_call");


        //this.text_avtiveinfo = ccui.helper.seekWidgetByName(this.parentView, "text_avtiveinfo");
        //this.text_avtiveinfo.setVisible((Number(GetDeviceType()) == DeviceType.ANDROID)?false:true);

        //this.AddPageFlags(true);
        //this.SelectExchangeBtns(true);

        //设置奖牌数
        this.SetSelfTickMedal();

        //初始化兑换记录
        //this.AddExchangeView();

        //显示用户头像信息
        this.ShowUserHeader(false);

        //隐藏上部按钮
        this.ShowTopButtons(false);

        //隐藏下部按钮
        this.ShowButtomButtons(false);

    },

    //初始化标签按钮
    initLabelBtn:function()
    {
        var self = this;

        //标签按钮
        this.layer_title_label = ccui.helper.seekWidgetByName(this.parentView, "layer_title_label");          //label
        this.layer_title_label.setPositionX(this.layer_title_label.getPositionX() + this.origin.x);

        this.Image_label_bg = ccui.helper.seekWidgetByName(this.layer_title_label, "Image_label_bg");
        this.btn_title_exchange = ccui.helper.seekWidgetByName(this.layer_title_label, "btn_title_exchange");
        this.btn_title_record = ccui.helper.seekWidgetByName(this.layer_title_label, "btn_title_record");

        this.btn_title_exchange.addTouchEventListener(function(sender, type){
            if(type == ccui.Widget.TOUCH_ENDED)
            {
                self.btn_title_exchange.loadTexture("image_title_label_exchange_press.png", ccui.Widget.PLIST_TEXTURE);
                self.btn_title_record.loadTexture("image_title_label_record_normal.png", ccui.Widget.PLIST_TEXTURE);
                self.Image_label_bg.setPositionX(self.btn_title_exchange.getPositionX());

                self.scrollView_exchange.setVisible(true);
                self.layer_record.setVisible(false);

                self.text_record_tips.setVisible(false);
            }
        });

        this.btn_title_record.addTouchEventListener(function(sender, type){
            if(type == ccui.Widget.TOUCH_ENDED)
            {
                self.btn_title_exchange.loadTexture("image_title_label_exchange_normal.png", ccui.Widget.PLIST_TEXTURE);
                self.btn_title_record.loadTexture("image_title_label_record_press.png", ccui.Widget.PLIST_TEXTURE);
                self.Image_label_bg.setPositionX(self.btn_title_record.getPositionX());

                self.scrollView_exchange.setVisible(false);
                self.layer_record.setVisible(true);

                webMsgManager.SendGpGetPrizeexchangeRecorder(function(data)
                    {
                        lm.log("兑换记录为：" + JSON.stringify(data["exchangerecodlist"]));
                        roomManager.ticketdata["exchangerecodlist"] = data["exchangerecodlist"];
                        self.RefReshRecordView();
                    },
                    function(data)
                    {
                        layerManager.PopTipLayer(new PopAutoTipsUILayer("获取兑换记录失败，请稍后再试！", DefultPopTipsTime),true);
                    }, this)

            }
        });

        self.btn_title_exchange.loadTexture("image_title_label_exchange_press.png", ccui.Widget.PLIST_TEXTURE);
        self.btn_title_record.loadTexture("image_title_label_record_normal.png", ccui.Widget.PLIST_TEXTURE);
        self.Image_label_bg.setPositionX(self.btn_title_exchange.getPositionX());

        this.scrollView_exchange.setVisible(true);
        this.layer_record.setVisible(false);

    },


    // 设置我的奖牌、话费卷
    SetSelfTickMedal:function()
    {
        var tickdata = roomManager.GetTicketData();
        if((tickdata === null) || (tickdata === undefined) || (tickdata.length < 3))
            return;

        this.text_ticket_medal.setString(userInfo.globalUserdData["dwUserMedal"]);
        //this.SetSelfTickData(tickdata["selfmedalcount"],tickdata["selfcallcount"]);
    },

    // 设置我的奖牌，话费卷
    SetSelfTickData:function(medal, call)
    {
        userInfo.globalUserdData["dwUserMedal"] = medal;
        this.text_ticket_medal.setString(medal);
        //this.text_ticket_call.setString(call);

    },
    //显示按钮
    SelectExchangeBtns:function(bRecord)
    {
        if(bRecord)
        {
            this.Image_exchangetick_select.setVisible(true);
            this.Image_exchangetick_unselect.setVisible(false);

            this.Image_exchangerecord_unselect.setVisible(true);
            this.Image_exchangerecord_select.setVisible(false);


            this.pageview_ticket.setVisible(true);
            this.panel_ticket_record.setVisible(false);

        }else
        {

            this.pageview_ticket.setVisible(false);
            this.panel_ticket_record.setVisible(true);

            this.Image_exchangetick_select.setVisible(false);
            this.Image_exchangetick_unselect.setVisible(true);


            this.Image_exchangerecord_unselect.setVisible(false);
            this.Image_exchangerecord_select.setVisible(true);

        }
    },

    //添加每一页的标记
    AddPageFlags:function(exchangelist)
    {
        var tickdata = roomManager.GetTicketData();
        if((tickdata === null) || (tickdata === undefined) || (tickdata.length < 2))
            return;

        var length = exchangelist ? tickdata["prizeexchangelist"].length : tickdata["exchangerecodlist"].length;
        if(length ==0)
            return;

        // 添加当前页标记
        this.pagecount = Math.ceil(length / DefultEarchPageItemCount);
        if(this.pagecount > 1)
        {
            var  posx =  this.getContentSize().width /2 -  (this.pagecount * DefultPageFlagXOffset) /2;
            for (var pageindex = 0; pageindex <  this.pagecount; pageindex++)
            {
                // 动态创建图片
                var  image = ccui.ImageView.create("pop_tips.png",1);
                image.setPosition(posx, DefultPageFlagY);
                image.setTag(DefultPageTag + pageindex);
                image.setScale(DefultScallRate);
                //image.setContentSize(20,20);
                //image.setScale9Enabled(true);
                //image.setCapInsets(cc.rect(10,10,1,1));
                posx += DefultPageFlagXOffset;
                this.addChild(image);
            }
            // 刷新当前页标记
            this.RefReshPageFlags();
        }

    },

    //刷新每一页的标记，当前页高亮
    RefReshPageFlags:function()
    {
        if(this.pagecount > 1)
        {
            for (var pageindex = 0; pageindex <  this.pagecount; pageindex++)
            {
                var tem =  this.getChildByTag(DefultPageTag + pageindex);
                if(tem !== null && tem!== undefined)
                {
                    if(this.pageview_ticket.getCurPageIndex() == pageindex)
                    {
                        tem.setOpacity(DefultPageFlagSelOpacity);


                    }else
                    {
                        tem.setOpacity(DefultPageFlagNormalOpacity);

                    }
                }
            }
        }
    },

    //清空当前页标记
   ClearPageFlags:function()
   {
       if(this.pagecount > 1)
       {
           for (var pageindex = 0; pageindex <  this.pagecount; pageindex++)
           {
               this.removeChildByTag(DefultPageTag + pageindex);
           }
       }

   },

    //// 获取当前页应该显示的数据
    //GetCurPageData:function()
    //{
    //   return this.GetPageIndexData(this.pageview_ticket.getCurPageIndex());
    //},
    ////获取指定 index 的数据
    //GetPageIndexData:function(index)
    //{
    //    var tickdata = roomManager.GetTicketData();
    //    if((tickdata === null) || (tickdata === undefined) || (tickdata.length < 2))
    //        return null;
    //
    //    var length = tickdata["prizeexchangelist"].length;
    //    var prizeexchangelistdata = tickdata["prizeexchangelist"];
    //    var pageindex = 0, itemindex = 0;
    //    var data=[];
    //    for (var i = 0; i < length; i++) {
    //
    //        itemindex = i % DefultEarchPageItemCount;
    //        if(index == pageindex)
    //            data.push(prizeexchangelistdata[i]);
    //
    //        if(data.length == DefultEarchPageItemCount)
    //            return data;
    //
    //        if (itemindex == (DefultEarchPageItemCount -1))
    //            pageindex++;
    //    }
    //
    //    return  null;
    //},

    //添加可兑换物品列表--有用的
    AddExchangeView: function () {
        var self = this;
        var itemCount = 3;

        if (this.scrollView_exchange.getChildrenCount() > 0)
            return;

        var tickdata = roomManager.GetTicketData();
        if ((tickdata === null) || (tickdata === undefined))
            return;

        // 将兑换数据按兑换比例大小排序
        var prizeexchangelistdata = tickdata["prizeexchangelist"];

        //prizeexchangelistdata.sort(function (item1, item2) {
        //    return item1.prizeexchangerate > item2.prizeexchangerate;
        //});

        lm.log("yyp AddExchangeView" + tickdata.length);

        var length = prizeexchangelistdata.length;
        //加载文件
        this.scrollView_exchange.setInnerContainerSize(cc.size(this.scrollView_exchange.getInnerContainerSize().width, 210 * Math.ceil(length / itemCount) + 10));
        for (var pageindex = 0; pageindex <  Math.ceil(length / itemCount); pageindex++)
        {
            var customPageItem = this.defultExchangeitem.clone();
            customPageItem.setTag(pageindex);

            customPageItem.setPositionY(-210 * pageindex + this.scrollView_exchange.getInnerContainerSize().height - customPageItem.getContentSize().height - 10);
            this.scrollView_exchange.addChild(customPageItem);
        }

        //hanhu #对兑换数据进行排序 2015/08/03
        prizeexchangelistdata.sort(function (a, b) {
            var num1 = self.GetCanExchangeCount(a);
            var num2 = self.GetCanExchangeCount(b);
            if (num1 == 0 && num2 != 0) {
                return true
            }
            else {
                return false;
            }
        });

        // add scroll
        var pageindex = 0, itemindex = 0;
        for (var i = 0; i < prizeexchangelistdata.length; i++)
        {
            itemindex = i % itemCount;
            var pageitem = this.scrollView_exchange.getChildByTag(pageindex);
            if(pageitem)
            {
                var customPageItem = ccui.helper.seekWidgetByName(pageitem, "btn_item_" + itemindex);
                //customPageItem.setPositionY(-210 * i + this.scrollView_exchange.getInnerContainerSize().height - customPageItem.getContentSize().height / 2 - 10);
                //this.scrollView_exchange.addChild(customPageItem);

                //兑换的商品图片
                var Image_tickitem_texture = ccui.helper.seekWidgetByName(customPageItem, "Image_tickitem_texture");
                Image_tickitem_texture.loadTexture("res/cocosOut/product/" + prizeexchangelistdata[i]["prizeiconid"] + ".jpg", 0);

                //商品名称
                var text_tickitem_name = ccui.helper.seekWidgetByName(customPageItem, "text_tickitem_name");
                if ((prizeexchangelistdata[i]["prizename"] !== undefined) && prizeexchangelistdata[i]["prizename"] != null) {
                    text_tickitem_name.setString(prizeexchangelistdata[i]["prizename"]);
                }

                //兑换条件
                var Image_ticket_medal_icon = ccui.helper.seekWidgetByName(customPageItem, "Image_ticket_medal_icon");
                var text_tickitem_price = ccui.helper.seekWidgetByName(customPageItem, "text_tickitem_price");
                switch (Number(prizeexchangelistdata[i]["prizeexchangeconditionstype"])) {
                    case PrizeExchangeConditionsType.CONDITIONS_TYPE_CALL: // 话费卷
                    {
                        Image_ticket_medal_icon.loadTexture("image_task_huafei.png", 1);
                        text_tickitem_price.setString(prizeexchangelistdata[i]["prizeexchangerate"] + "话费卷");
                        customPageItem.tipsStr = "话费卷";
                    }
                        break;
                    case PrizeExchangeConditionsType.CONDITIONS_TYPE_MEDAL:// 奖牌
                    {
                        Image_ticket_medal_icon.loadTexture("image_task_jiangpai.png", 1);
                        text_tickitem_price.setString(prizeexchangelistdata[i]["prizeexchangerate"] + "奖牌");
                        customPageItem.tipsStr = "奖牌";
                    }
                        break;
                    default :
                    {
                        Image_ticket_medal_icon.setScale(0.3);
                        Image_ticket_medal_icon.loadTexture("res/cocosOut/product/" + prizeexchangelistdata[i]["prizeiconid"] + ".jpg", 0);
                        text_tickitem_price.setString(prizeexchangelistdata[i]["prizeexchangerate"] + "道具");
                        customPageItem.tipsStr = "道具";
                    }
                        break;
                }

                //库存
                var btn_signUp = ccui.helper.seekWidgetByName(customPageItem, "btn_signUp");
                var text_signUpEx = ccui.helper.seekWidgetByName(customPageItem, "text_signUpEx");
                var text_tickitem_count = ccui.helper.seekWidgetByName(customPageItem, "text_tickitem_count");
                if ((prizeexchangelistdata[i]["prizesurplusnum"] !== undefined) && (prizeexchangelistdata[i]["prizesurplusnum"] != null)) {
                    text_tickitem_count.setString("库存：" + prizeexchangelistdata[i]["prizesurplusnum"]);
                    customPageItem.prizesurplusnum = prizeexchangelistdata[i]["prizesurplusnum"];
                    if (prizeexchangelistdata[i]["prizesurplusnum"] > 0) {
                        btn_signUp.loadTextures("btn_signUp_normal.png", "btn_signUp_normal.png", "", ccui.Widget.PLIST_TEXTURE);
                        text_signUpEx.loadTexture("image_exchange.png", 1);
                    }
                    else {
                        btn_signUp.loadTextures("btn_signUp_overdue.png", "btn_signUp_overdue.png", "", ccui.Widget.PLIST_TEXTURE);
                        text_signUpEx.loadTexture("image_soldOut.png", 1);
                    }
                } else {
                    text_tickitem_count.setString("库存：0");
                    customPageItem.prizesurplusnum = 0;
                    btn_signUp.loadTextures("btn_signUp_overdue.png", "btn_signUp_overdue.png", "", ccui.Widget.PLIST_TEXTURE);
                    text_signUpEx.loadTexture("image_soldOut.png", 1);
                }

                //点击购买
                customPageItem.data = prizeexchangelistdata[i];
                customPageItem.setSwallowTouches(false);
                customPageItem.setPressedActionEnabled(true);
                customPageItem.addTouchEventListener(function (sender, type) {
                    lm.log("yyp addTouchEventListener ");
                    if (type == ccui.Widget.TOUCH_ENDED) {
                        //没有库存
                        if (sender.prizesurplusnum <= 0) {
                            var pop = new ConfirmPop(this, Poptype.ok, "这件商品已经没有库存啦，明天再来看看吧!");
                            pop.addToNode(cc.director.getRunningScene());
                            return;
                        }

                        // 检测是否满足兑换条件
                        var canExchangeCount = self.GetCanExchangeCount(sender.data);
                        if (canExchangeCount == 0) {
                            var pop = new ConfirmPop(this, Poptype.ok, "您需要更多的" + sender.tipsStr + "才能兑换这件商品哦!");
                            pop.addToNode(cc.director.getRunningScene());

                            return;
                        }

                        // 兑换奖品
                        var pop = new ConfirmPop(this, Poptype.yesno, "确定要兑换商品" + sender.data["prizename"] + "吗？");
                        pop.addToNode(cc.director.getRunningScene());
                        pop.setYesNoCallback(
                            function () {
                                var ticketInputUILayer = new TicketInputUILayer(sender.data, 1,  //只能1个1个的兑换
                                    function (prizeid, num, mobile, qq, nickname, address) {
                                        //请求兑换奖品 -
                                        webMsgManager.SendGpExchangePrize(prizeid, num, mobile, qq, nickname, address, function (data) {
                                                //更新自己的奖牌、话费券
                                                self.SetSelfTickData(data["selfmedalcount"], data["selfcallcount"]);

                                                // 将道具兑换记录写入订单中
                                                //lm.log("从服务器获取到兑换数据 = " + JSON.stringify(data));
                                                roomManager.AddTicketOrderData(data);

                                                layerManager.PopTipLayer(new PopAutoTipsUILayer("兑换成功，工作人员会在3天内处理，请注意查收！", DefultPopTipsTime));

                                            },
                                            function (errinfo) {
                                                layerManager.PopTipLayer(new PopAutoTipsUILayer("兑换失败，" + errinfo, DefultPopTipsTime));

                                            }, self);
                                    },
                                    self);

                                //layerManager.PopTipLayer(ticketInputUILayer);
                                this.addChild(ticketInputUILayer, 9999);
                                ticketInputUILayer.ignoreAnchorPointForPosition(false);
                                ticketInputUILayer.setAnchorPoint(0.5,0.5);
                                ticketInputUILayer.setPosition(cc.p(winSize.width / 2, winSize.height / 2));


                            }
                        );


                    }
                }, self);

                if (itemindex == (itemCount - 1))
                    pageindex++;
            }
        }

        // 计算需要隐藏的item的数量
        var needhideitemcount = this.scrollView_exchange.getChildrenCount() * itemCount - length;
        // 隐藏剩余的item项
        for (var i = 0; i < needhideitemcount; i++)
        {
            itemindex++;

            // 从上面显示的最后索引开始隐藏
            var pageitem = this.scrollView_exchange.getChildByTag(this.scrollView_exchange.getChildrenCount() - 1);

            if (pageitem === null)
                continue;

            var panel_item = ccui.helper.seekWidgetByName(pageitem, "btn_item_" + itemindex);
            if (panel_item === null)
                continue;

            panel_item.setVisible(false);
        }

            /*
             var pageindex = 0, itemindex = 0;
             var length = tickdata["prizeexchangelist"].length;
             for (var i = 0; i < length; i++) {

             // 设置item 显示数据
             itemindex = i % DefultEarchPageItemCount;
             var pageitem = this.pageview_ticket.getPage(pageindex);

             if (pageitem !== null)
             {
             var btn_item_bk = ccui.helper.seekWidgetByName(pageitem, "btn_ticketitem_" + itemindex);

             //lm.log("refreshViewByData i : " +i ,"pageindex : " + pageindex,"itemindex : " + itemindex);

             var text_tickitem_name = ccui.helper.seekWidgetByName(btn_item_bk, "text_tickitem_name_" + itemindex);
             if((prizeexchangelistdata[i]["prizename"] !== undefined) && prizeexchangelistdata[i]["prizename"] != null)
             {
             text_tickitem_name.setString(prizeexchangelistdata[i]["prizename"]);
             lm.log("商品名称为：" + prizeexchangelistdata[i]["prizename"] + " ID = " + prizeexchangelistdata[i]["prizeiconid"]);
             }

             var text_tickitem_count = ccui.helper.seekWidgetByName(btn_item_bk, "text_tickitem_count_" + itemindex);
             if((prizeexchangelistdata[i]["prizesurplusnum"] !== undefined) && (prizeexchangelistdata[i]["prizesurplusnum"] != null))
             {
             text_tickitem_count.setString(prizeexchangelistdata[i]["prizesurplusnum"]);
             }

             var text_tickitem_exchangecondition = ccui.helper.seekWidgetByName(btn_item_bk, "text_tickitem_exchangecondition_" + itemindex);
             switch (Number(prizeexchangelistdata[i]["prizeexchangeconditionstype"]))
             {
             case PrizeExchangeConditionsType.CONDITIONS_TYPE_CALL: // 话费卷
             {
             text_tickitem_exchangecondition.setString("需要话费券：" + prizeexchangelistdata[i]["prizeexchangerate"]);
             }
             break;
             case PrizeExchangeConditionsType.CONDITIONS_TYPE_MEDAL:// 奖牌
             {
             text_tickitem_exchangecondition.setString("需要奖牌：" + prizeexchangelistdata[i]["prizeexchangerate"]);
             }
             break;
             default :
             {
             text_tickitem_exchangecondition.setString("需要道具：" + prizeexchangelistdata[i]["prizeexchangerate"]);
             }
             break;
             }

             var Image_tickitem_texture = ccui.helper.seekWidgetByName(btn_item_bk, "Image_tickitem_texture_" + itemindex);
             lm.log("加载兑换图片 name = " + prizeexchangelistdata[i]["prizename"] + " id =" + prizeexchangelistdata[i]["prizeiconid"]);
             Image_tickitem_texture.loadTexture("res/cocosOut/product/" + prizeexchangelistdata[i]["prizeiconid"] +".jpg",0);
             Image_tickitem_texture.setSwallowTouches(false);


             var Image_disabled = ccui.helper.seekWidgetByName(btn_item_bk, "Image_disabled_" + itemindex);

             // 检测是否满足兑换条件
             var exchangecount = self.GetCanExchangeCount(prizeexchangelistdata[i]);
             if(exchangecount == 0)
             {
             btn_item_bk.setEnabled(false);
             Image_disabled.setVisible(true);

             }else
             {
             Image_disabled.setVisible(false);
             // 可兑换
             btn_item_bk.exchangecount = exchangecount;
             btn_item_bk.itemindex = itemindex;
             btn_item_bk.prizeid = prizeexchangelistdata[i]["prizeid"];
             btn_item_bk.prizetype = prizeexchangelistdata[i]["prizetype"];
             btn_item_bk.curServer = this.curServer;
             btn_item_bk.pageIndex = pageindex;
             btn_item_bk.data = prizeexchangelistdata[i];
             btn_item_bk.setEnabled(true);
             btn_item_bk.setSwallowTouches(false);
             layerManager.SetButtonPressAction(btn_item_bk);
             btn_item_bk.addTouchEventListener(function (sender, type) {
             if (type == ccui.Widget.TOUCH_ENDED) {

             //lm.log("兑换按钮被点击");
             if (sender.pageIndex !== self.pageview_ticket.getCurPageIndex())
             {
             //lm.log("111");
             return;
             }

             // 兑换奖品
             var ticketInputUILayer  = new TicketInputUILayer(sender.data,
             sender.exchangecount,
             function(prizeid,num,mobile,qq,nickname,address)
             {
             if (CurWebDataType == WebDataType.WEBDATA_TYPE_DEBUG)
             {
             var  data = {"prizename":"奖品0000","exchangetime":"20150323","orderno":"123456789","status":1};
             roomManager.AddTicketOrderData(data);
             layerManager.PopTipLayer(new PopAutoTipsUILayer("兑换成功，工作人员会在3天内处理，请注意查收！", DefultPopTipsTime));

             }else
             {
             webMsgManager.SendGpExchangePrize(prizeid,num,mobile,qq,nickname,address,function(data)
             {
             //更新自己的奖牌、话费券
             self.SetSelfTickData(data["selfmedalcount"],data["selfcallcount"]);

             // 将道具兑换记录写入订单中
             //lm.log("从服务器获取到兑换数据 = " + JSON.stringify(data));
             roomManager.AddTicketOrderData(data);

             layerManager.PopTipLayer(new PopAutoTipsUILayer("兑换成功，工作人员会在3天内处理，请注意查收！", DefultPopTipsTime));

             },
             function(errinfo)
             {
             layerManager.PopTipLayer(new PopAutoTipsUILayer("兑换失败，" + errinfo, DefultPopTipsTime));

             },self);
             }

             },
             self);

             layerManager.PopTipLayer(ticketInputUILayer);

             }
             }, self);

             }
             }


             if (itemindex == (DefultEarchPageItemCount-1))
             pageindex++;
             }

             // 计算需要隐藏的item的数量
             var needhideitemcount = this.pageview_ticket.getChildrenCount() * DefultEarchPageItemCount - length;
             // lm.log("refreshViewByData needhideitemcount: " + needhideitemcount);
             // 隐藏剩余的item项
             for (var i = 0; i < needhideitemcount; i++) {
             itemindex++;

             // 从上面显示的最后索引开始隐藏
             var pageitem = this.pageview_ticket.getPage(this.pageview_ticket.getChildrenCount() - 1);

             //lm.log("refreshViewByData pageitem : " + pageitem);
             if (pageitem === null)
             continue;

             // lm.log("refreshViewByData itemindex : " + itemindex);
             var panel_item = ccui.helper.seekWidgetByName(pageitem, "btn_ticketitem_" + itemindex);
             if (panel_item === null)
             continue;

             panel_item.setVisible(false);
             }
             */

    },

    //添加我的订单记录
    RefReshRecordView:function()
    {
        var self = this;

        var tickdata = roomManager.GetTicketData();
        if((tickdata === null) ||(tickdata === undefined))
        {
            this.text_record_tips.setVisible(true);
            return;
        }

        if (this.scrollView_record.getChildrenCount() > 0)
        {
            this.scrollView_record.removeAllChildren();
        }

        var recorddata = tickdata["exchangerecodlist"];
        if (recorddata == undefined || recorddata == null )
        {
            this.text_record_tips.setVisible(true);
            return;
        }
        this.scrollView_record.setInnerContainerSize(cc.size(this.scrollView_record.getInnerContainerSize().width, 45 * recorddata.length + 5));

        for (var i = 0; i < recorddata.length; i++)
        {
            var lastItem = this.defultRecodeitem.clone();
            lastItem.setPositionY(-45 * i + this.scrollView_record.getInnerContainerSize().height - lastItem.getContentSize().height / 2 - 5);
            this.scrollView_record.addChild(lastItem);

            var text_ticketrecord_name = ccui.helper.seekWidgetByName(lastItem, "text_ticketrecord_name");
            text_ticketrecord_name.setString(recorddata[i]["prizename"]);

            var text_ticketrecord_time = ccui.helper.seekWidgetByName(lastItem, "text_ticketrecord_time");
            text_ticketrecord_time.setString(recorddata[i]["exchangetime"]);

            var text_ticketrecord_order = ccui.helper.seekWidgetByName(lastItem, "text_ticketrecord_order");
            text_ticketrecord_order.setString(recorddata[i]["orderno"]);

            var text_ticketrecord_status = ccui.helper.seekWidgetByName(lastItem, "text_ticketrecord_status");
            switch (Number(recorddata[i]["status"]))
            {
                case PrizeOrderStatus.PRIZEORDER_STATUS_NEW: // 新建
                {
                    text_ticketrecord_status.setString("未发货");
                }
                    break;

                case PrizeOrderStatus.PRIZEORDER_STATUS_COMPLETE: // 完结
                {
                    text_ticketrecord_status.setString("完结");
                }

                    break;
                case PrizeOrderStatus.PRIZEORDER_STATUS_PROCESSING:// 处理中
                {
                    text_ticketrecord_status.setString("未发货");
                }
                    break;
                case PrizeOrderStatus.PRIZEORDER_STATUS_ARTIFICIAL:// 人工处理
                {
                    text_ticketrecord_status.setString("已发货");
                    text_ticketrecord_status.setColor(CompleteColor);
                }
                    break;
                case PrizeOrderStatus.PRIZEORDER_STATUS_ARTIFICIAL_PROCESSING:// 人工处理中
                {
                    text_ticketrecord_status.setString("已发货");
                    text_ticketrecord_status.setColor(CompleteColor);
                }
                    break;
                case PrizeOrderStatus.PRIZEORDER_STATUS_SCRAPPED: // 	作废订单
                {
                    text_ticketrecord_status.setString("作废订单");
                }
                    break;
            }
        }

        if(this.scrollView_record.getChildrenCount() > 0)
        {
            this.text_record_tips.setVisible(false);
        }
        else
        {
            this.text_record_tips.setVisible(true);
        }
    },

    getLastListItem: function ()
    {
           if (this.listview_ticket.getItems().length)
            return this.listview_ticket.getItems()[this.listview_ticket.getItems().length - 1];
    },
    //可兑换的数量
    GetCanExchangeCount:function(data)
    {
        if(data === null || data === undefined)
        {
            return 0;
        }

        var tickdata = roomManager.GetTicketData();
        if((tickdata === null) || (tickdata === undefined) )
        {
            return 0;
        }

        var selfmedalcount = Number(userInfo.globalUserdData["dwUserMedal"]);
        var selfcallcount = Number(userInfo.globalUserdData["dwTicketCount"]);
        //lm.log("selfmedalcount" + selfmedalcount + "  selfcallcount  " + selfcallcount);
        var exchangecount = 0;
        switch (data["prizeexchangeconditionstype"])
        {
            case PrizeExchangeConditionsType.CONDITIONS_TYPE_CALL: // 话费卷
            {
                if(selfcallcount >= Number(data["prizeexchangerate"]))
                {
                    exchangecount =  Math.floor(selfcallcount / Number(data["prizeexchangerate"]));
                    return exchangecount;
                }

            }
                break;
            case PrizeExchangeConditionsType.CONDITIONS_TYPE_MEDAL:// 奖牌
            {
                if(selfmedalcount >= Number(data["prizeexchangerate"]))
                {
                    exchangecount =  Math.floor(selfmedalcount / Number(data["prizeexchangerate"]));
                    return exchangecount;
                }

            }
                break;
            default : // 道具兑换
            {
                // 获取我的道具
                var malldata = roomManager.GetMallData();
                if((malldata === undefined) || (malldata === null) ||(malldata.length < 3))
                {
                    return 0;
                }

                var userproperty = malldata["userproperty"];
                if((userproperty == undefined) || (userproperty == null))
                {
                    return 0;
                }

                // 道具兑换条件的道具ID， 在自己的道具列表中
                var pid = data["prizeexchangeconditionstype"];
                for(var j = 0;j<userproperty.length; j++)
                {
                    if(Number(pid) == Number(userproperty[j]["pid"]))
                    {
                        console.log("兑换数目：" + exchangecount);
                        // 可兑换的数量 = 自己道具的数量 /兑换比例
                        exchangecount =  Math.floor(Number(userproperty[j]["pcount"]) / Number(data["prizeexchangerate"]));
                       return exchangecount;
                    }
                }

            }
                break;
        }
        return 0;

    }


});