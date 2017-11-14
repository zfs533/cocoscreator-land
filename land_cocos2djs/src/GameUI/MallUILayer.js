/**
 * Created by lizhongqiang on 15/6/30.
 */


// 商城数据类型
var MallDataType=
{
    MALL_DATA_GOLD:0,           // 金币
    MALL_DATA_PROPERTY:1,       // 道具
    MALL_DATA_USERPROPERTY:2,    // 我的道具
    MALL_DATA_LOSER_BUY:3
};

// 商城产品类型
var MallProduct=
{
    WeekMatchTickets : 8, // 周赛门票
    MonthMatchTickets: 9, //  月赛门票
    BuMarkTickets: 31, //  补签卡
    BaiduWaiMaiTickets : 38, //百度外卖门票

    yztcard20: 39, //燕知堂代金券20元
    baiducard30: 40, //百度代金券30元
    selfcard50: 41, //自己人代金券50元
    baiducard100: 42, //百度外卖代金券100元
    yansacard200: 43, //燕沙大酒店代金券200元
    selfcard300: 44   //自己人代金券300元
}




// 商城UI界面
var MALLUILAYER;
var MallUILayer = rootUILayer.extend({
    ctor: function () {
        this._super();
        MALLUILAYER = this;
        this.initLayer();
    },

    onEnter: function ()
    {
        this._super();
        this.refreshViewByData();
    },

    onExit: function ()
    {
        this._super();
        MALLUILAYER = null;
    },

    // 设置产品数据
    SetProductsData:function(products)
    {
        lm.log("yyp MallUILayer SetProductsData");
        this.products = products;
        //this.refreshViewByData(MallDataType.MALL_DATA_GOLD);
        //this.refreshViewByData();
    },

    setMallDataType:function(dataType)
    {
        this.mallDataType = dataType;
    },

    //onExit: function () {
    //    //this._super();
    //    //this.defultpageitem.release();
    //    //this.defultBuyGoldPageItem.release();
    //
    //},

    initLayer: function () {

        cc.spriteFrameCache.addSpriteFrames("res/landlord/cocosOut/plaza/mall/mall.plist");

        this.parentView = ccs.load("res/landlord/cocosOut/MallUILayer.json").node;
        this.addChild(this.parentView);
        //hanhu #调整商城坐标 2015/08/07
        var offset = (this.parentView.getContentSize().width * winSize.height / 640 - winSize.width) / 2;
        this.parentView.x -= offset;

        //话费赛
        this.scrollView_room_gold = ccui.helper.seekWidgetByName(this.parentView, "scrollView_room_gold");
        this.scrollView_room_gold.setDirection(ccui.ScrollView.DIR_VERTICAL);
        this.scrollView_room_gold.setTouchEnabled(true);
        this.scrollView_room_gold.setSwallowTouches(false);

        //pageview
        //this.pageview_gold = ccui.helper.seekWidgetByName(this.parentView, "pageview_gold");
        //this.pageview_gold.setVisible(true);
        //
        //this.pageview_property = ccui.helper.seekWidgetByName(this.parentView, "pageview_property");
        //this.pageview_property.setVisible(false);
        //
        //this.pageview_self_property = ccui.helper.seekWidgetByName(this.parentView, "pageview_self_property");
        //this.pageview_self_property.setVisible(false);
        //
        //this.defultpageitem = ccui.helper.seekWidgetByName(ccs.load("res/cocosOut/TicketPageItem.json").node,"panel_ticket_root");
        //this.defultpageitem.retain();

        this.defultBuyGoldPageItem = ccui.helper.seekWidgetByName(ccs.load("res/landlord/cocosOut/BuyGoldPageItem.json").node,"panel_buygoldpageitem");
        this.defultBuyGoldPageItem.retain();

        this.origin = cc.p((winSize.width - this.parentView.getContentSize().width)/2, (winSize.height - this.parentView.getContentSize().height)/2);
        this.Image_label_bg = ccui.helper.seekWidgetByName(this.parentView, "Image_label_bg");          //label
        this.Image_label_bg.setPositionX(this.Image_label_bg.getPositionX() + this.origin.x);

        //var self = this;
        //this.isTuning = false;
        //cc.eventManager.addListener({
        //    event: cc.EventListener.TOUCH_ONE_BY_ONE,
        //    swallowTouches: false,
        //    onTouchBegan: function (touch, event) {
        //        return true;
        //    },
        //    onTouchMoved: function (touch, event) {
        //
        //        self.isTuning = true;
        //    },
        //    onTouchEnded: function (touch, event) {
        //        self.isTuning = false;
        //    }
        //}, this.pageview_gold);
        //
        //cc.eventManager.addListener({
        //    event: cc.EventListener.TOUCH_ONE_BY_ONE,
        //    swallowTouches: false,
        //    onTouchBegan: function (touch, event) {
        //        return true;
        //    },
        //    onTouchMoved: function (touch, event) {
        //
        //        self.isTuning = true;
        //    },
        //    onTouchEnded: function (touch, event) {
        //        self.isTuning = false;
        //    }
        //}, this.pageview_property);
        //
        //
        //cc.eventManager.addListener({
        //    event: cc.EventListener.TOUCH_ONE_BY_ONE,
        //    swallowTouches: false,
        //    onTouchBegan: function (touch, event) {
        //        return true;
        //    },
        //    onTouchMoved: function (touch, event) {
        //
        //        self.isTuning = true;
        //    },
        //    onTouchEnded: function (touch, event) {
        //        self.isTuning = false;
        //    }
        //}, this.pageview_self_property);
        //
        //
        //添加拖动监听
        //this.pageview_self_property.addEventListener(function(sender, type){
        //
        //    if(type == ccui.PageView.EVENT_TURNING)
        //    {
        //        self.RefReshPageFlags();
        //        //self.pageview_ticket.setTouchEnabled(true);
        //    }
        //
        //},this);
        //
        //购买金币
        //this.btn_exchange_buygold = ccui.helper.seekWidgetByName(this.parentView, "btn_exchange_buygold");
        //this.Image_buygold_select  = ccui.helper.seekWidgetByName(this.btn_exchange_buygold, "Image_buygold_select");
        //this.Image_buygold_unselect = ccui.helper.seekWidgetByName(this.btn_exchange_buygold, "Image_buygold_unselect");
        //this.text_buygold_select  = ccui.helper.seekWidgetByName(this.btn_exchange_buygold, "text_buygold_select");
        //this.text_buygold_unselect  = ccui.helper.seekWidgetByName(this.btn_exchange_buygold, "text_buygold_unselect");
        //this.btn_exchange_buygold.addTouchEventListener(function (sender, type) {
        //    if (type == ccui.Widget.TOUCH_ENDED) {
        //
        //        this.SelectExchangeBtns(MallDataType.MALL_DATA_GOLD);
        //        this.refreshViewByData(MallDataType.MALL_DATA_GOLD);
        //    }
        //}, this);
        //
        //
        //购买道具
        //this.btn_exchange_buyprop = ccui.helper.seekWidgetByName(this.parentView, "btn_exchange_buyprop");
        //this.Image_buyprop_select  = ccui.helper.seekWidgetByName(this.btn_exchange_buyprop, "Image_buyprop_select");
        //this.Image_buyprop_unselect = ccui.helper.seekWidgetByName(this.btn_exchange_buyprop, "Image_buyprop_unselect");
        //this.text_buyprop_select  = ccui.helper.seekWidgetByName(this.btn_exchange_buyprop, "text_buyprop_select");
        //this.text_buyprop_unselect  = ccui.helper.seekWidgetByName(this.btn_exchange_buyprop, "text_buyprop_unselect");
        //this.btn_exchange_buyprop.addTouchEventListener(function (sender, type) {
        //    if (type == ccui.Widget.TOUCH_ENDED) {
        //
        //        this.SelectExchangeBtns(MallDataType.MALL_DATA_PROPERTY);
        //        this.refreshViewByData(MallDataType.MALL_DATA_PROPERTY);
        //    }
        //}, this);
        //
        //我的道具
        //this.btn_exchange_userprop = ccui.helper.seekWidgetByName(this.parentView, "btn_exchange_userprop");
        //this.Image_userprop_select  = ccui.helper.seekWidgetByName(this.btn_exchange_userprop, "Image_userprop_select");
        //this.Image_userprop_unselect = ccui.helper.seekWidgetByName(this.btn_exchange_userprop, "Image_userprop_unselect");
        //this.text_userprop_select  = ccui.helper.seekWidgetByName(this.parentView, "text_userprop_select");
        //this.text_userprop_unselect  = ccui.helper.seekWidgetByName(this.parentView, "text_userprop_unselect");
        //this.btn_exchange_userprop.addTouchEventListener(function (sender, type) {
        //    if (type == ccui.Widget.TOUCH_ENDED) {
        //
        //        this.SelectExchangeBtns(MallDataType.MALL_DATA_USERPROPERTY);
        //        this.refreshViewByData(MallDataType.MALL_DATA_USERPROPERTY);
        //    }
        //}, this);


        //显示用户头像信息
        this.ShowUserHeader(false);

        //隐藏上部按钮
        this.ShowTopButtons(false);

        //隐藏下部按钮
        this.ShowButtomButtons(false);
    },

    //订单完成回调（true 购买成功 false 购买失败）
    OnBuyCallback: function(success)
    {
        if(success == true)
        {
            var pop = new ConfirmPop(this, Poptype.ok, "商品购买成功!");//ok
            pop.addToNode(cc.director.getRunningScene());

        }
        else
        {
            var pop = new ConfirmPop(this, Poptype.yesno, "购买失败,是否重试?");//ok
            pop.addToNode(cc.director.getRunningScene());
            pop.setYesNoCallback(
                function()
                {
                    if(this.currentSeder)
                    {
                        roomManager.RequestPayment(this.currentSeder.identifier, this.currentSeder.proName, this.currentSeder.price, this.currentSeder.value);
                    }
                }
            );

        }
    },

    //显示按钮--隐藏 新版本 不需要切换
    SelectExchangeBtns:function(type)
    {
        switch (type)
        {
            case MallDataType.MALL_DATA_GOLD:   // 金币
            {

                this.Image_buygold_select.setVisible(true);
                this.Image_buygold_unselect.setVisible(false);
                this.text_buygold_select.setVisible(true);
                this.text_buygold_unselect.setVisible(false);

                this.Image_buyprop_select.setVisible(false);
                this.Image_buyprop_unselect.setVisible(true);
                this.text_buyprop_select.setVisible(false);
                this.text_buyprop_unselect.setVisible(true);

                this.Image_userprop_select.setVisible(false);
                this.Image_userprop_unselect.setVisible(true);
                this.text_userprop_select .setVisible(false);
                this.text_userprop_unselect.setVisible(true);

                this.pageview_gold.setVisible(true);
                this.pageview_property.setVisible(false);
                this.pageview_self_property.setVisible(false);
            }

                break;
            case MallDataType.MALL_DATA_PROPERTY:  // 道具
            {

                this.Image_buygold_select.setVisible(false);
                this.Image_buygold_unselect.setVisible(true);
                this.text_buygold_select.setVisible(false);
                this.text_buygold_unselect.setVisible(true);

                this.Image_buyprop_select.setVisible(true);
                this.Image_buyprop_unselect.setVisible(false);
                this.text_buyprop_select.setVisible(true);
                this.text_buyprop_unselect.setVisible(false);

                this.Image_userprop_select.setVisible(false);
                this.Image_userprop_unselect.setVisible(true);
                this.text_userprop_select .setVisible(false);
                this.text_userprop_unselect.setVisible(true);

                this.pageview_gold.setVisible(false);
                this.pageview_property.setVisible(true);
                this.pageview_self_property.setVisible(false);

            }
                break;
            case MallDataType.MALL_DATA_USERPROPERTY:   // 我的道具
            {
                this.Image_buygold_select.setVisible(false);
                this.Image_buygold_unselect.setVisible(true);
                this.text_buygold_select.setVisible(false);
                this.text_buygold_unselect.setVisible(true);

                this.Image_buyprop_select.setVisible(false);
                this.Image_buyprop_unselect.setVisible(true);
                this.text_buyprop_select.setVisible(false);
                this.text_buyprop_unselect.setVisible(true);

                this.Image_userprop_select.setVisible(true);
                this.Image_userprop_unselect.setVisible(false);
                this.text_userprop_select .setVisible(true);
                this.text_userprop_unselect.setVisible(false);

                this.pageview_gold.setVisible(false);
                this.pageview_property.setVisible(false);
                this.pageview_self_property.setVisible(true);

            }
                break;
        }
    },

    //--隐藏 新版本 不需要切换
    GetCurPageView:function()
    {

        if(this.pageview_gold.isVisible())
          return this.pageview_gold;

        if(this.pageview_property.isVisible())
            return this.pageview_property;

        if(this.pageview_self_property.isVisible())
            return this.pageview_self_property;
    },

    //查找道具数据--隐藏 新版本 不需要切换
    FindItemData:function(pid, propertydata)
    {
        for(var j = 0;j<propertydata.length; j++)
        {
            if(pid == propertydata[j]["pid"])
            {
                return propertydata[j];
            }
        }
        return null;
    },


    //添加每一页的标记--隐藏 新版本 不需要切换
    AddPageFlags:function(data)
    {
        if((data === null) || (data === undefined))
            return;

        var length = data.length;

        // 添加当前页标记
        this.pagecount = Math.ceil(length / DefultEarchPageItemCount);
        if(this.pagecount > 1)
        {
            var  posx =  this.getContentSize().width /2 -  (this.pagecount * DefultPageFlagXOffset) /2  - 80;
            for (var pageindex = 0; pageindex <  this.pagecount; pageindex++)
            {
                // 动态创建图片
                var  image = ccui.ImageView.create("pop_tips.png",1);
                image.setPosition(posx, DefultPageFlagY);
                image.setTag(DefultPageTag + pageindex);
                image.setScale(DefultScallRate);
                posx += DefultPageFlagXOffset;
                this.addChild(image);
            }

            // 刷新当前页标记
            this.RefReshPageFlags();
        }

    },

    //刷新每一页的标记，当前页高亮--隐藏 新版本 不需要切换
    RefReshPageFlags:function()
    {
        var curpageview = this.GetCurPageView();
        if(curpageview == undefined || curpageview == null )
            return;

        if(this.pagecount > 1)
        {
            for (var pageindex = 0; pageindex <  this.pagecount; pageindex++)
            {
                var tem =  this.getChildByTag(DefultPageTag + pageindex);
                if(tem !== null && tem!== undefined)
                {

                    if(curpageview.getCurPageIndex() == pageindex)
                    {
                        tem.setOpacity(DefultPageFlagSelOpacity);

                    }else
                    {
                        tem.setOpacity(DefultPageFlagNormalOpacity );
                    }
                }
            }
        }
    },

    //清空当前页标记--隐藏 新版本 不需要切换
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

    // 加载金币列表
    refreshViewByGold:function(golddata)
    {
        lm.log("yyp refreshViewByGold");

        this.ShowDonotMallTips(false);

        if(this.scrollView_room_gold.getChildrenCount() > 0)
            return;

        var self = this;

        var length = golddata.length;
        if(length == 0)
            return;
   
        golddata.sort(function (item1, item2) {
            return Number(item1.value) > Number(item2.value);
        });

        this.scrollView_room_gold.setInnerContainerSize(cc.size(this.scrollView_room_gold.getInnerContainerSize().width, 210 * Math.ceil(length / 3) + 15));
        //加载文件
        for (var pageindex = 0; pageindex <  Math.ceil(length / 3); pageindex++)
        {
            var customPageItem = this.defultBuyGoldPageItem.clone();
            customPageItem.setTag(pageindex);
            //customPageItem.setAnchorPoint(0,0);

            customPageItem.setPositionY(-210 * pageindex + this.scrollView_room_gold.getInnerContainerSize().height - customPageItem.getContentSize().height/2 - 15);
            this.scrollView_room_gold.addChild(customPageItem);
        }

       // console.log("refreshViewByGold： 2222");
        var pageindex = 0, itemindex = 0;
        for (var i = 0; i < length; i++) {

            // 设置item 显示数据
            itemindex = i % 3;
            var pageitem = this.scrollView_room_gold.getChildByTag(pageindex);
            if (pageitem !== null)
            {
                var btn_item_bk = ccui.helper.seekWidgetByName(pageitem, "button_buygolditem_" + itemindex);
                btn_item_bk.setSwallowTouches(false);

                //lm.log("yyp  " + golddata[i]["value"] + " " + golddata[i]["price"] + " " + golddata[i]["recommend"] );

                // 金币
                var gold = golddata[i]["value"];
                if(gold >= 100000000)
                {
                    gold = Math.floor(gold/100000000) + "亿金币";
                }
                else if(gold >= 10000)
                {
                    gold = Math.floor(gold/10000) + "万金币";
                }
                else
                {
                    gold = gold + "金币";
                }
                var textbmfont_buygoldtem_gold = ccui.helper.seekWidgetByName(btn_item_bk, "textbmfont_buygoldtem_gold");
                textbmfont_buygoldtem_gold.setString(gold);

                //价格
                var text_buygold_value = ccui.helper.seekWidgetByName(btn_item_bk, "text_buygold_value");
                text_buygold_value.setString( "￥" + golddata[i]["price"]  );

                //金币icon
                var Image_buygolditem_icon = ccui.helper.seekWidgetByName(btn_item_bk, "Image_buygolditem_icon");
                var showIndex;
                if(golddata[i]["price"] < 30)
                {
                    showIndex = 1;
                }
                else if(golddata[i]["price"] >= 30 && golddata[i]["price"] < 60)
                {
                    showIndex = 2;
                }
                else if(golddata[i]["price"] >= 60 && golddata[i]["price"] < 89)
                {
                    showIndex = 3;
                }
                else if(golddata[i]["price"] >= 90 && golddata[i]["price"] < 200)
                {
                    showIndex = 4;
                }
                else if(golddata[i]["price"] >= 200 && golddata[i]["price"] < 399)
                {
                    showIndex = 5;
                }
                else if(golddata[i]["price"] >= 400)
                {
                    showIndex = 6;
                }
                Image_buygolditem_icon.loadTexture("image_gold_title_" + showIndex  + ".png", 1);

                //推荐
                var Image_best_tips = ccui.helper.seekWidgetByName(btn_item_bk, "Image_best_tips");
                Image_best_tips.setVisible(Number(golddata[i]["recommend"])? true : false );

                //console.log("refreshViewByGold： 44444  : " + JSON.str);

                ////购买金币礼包按钮
                btn_item_bk.itemindex = itemindex;
                btn_item_bk.identifier = golddata[i]["identifier"];
                btn_item_bk.pageIndex = pageindex;
                btn_item_bk.price = golddata[i]["price"];
                btn_item_bk.proName = golddata[i]["pname"];
                btn_item_bk.value = golddata[i]["value"];
                btn_item_bk.setPressedActionEnabled(true);
                btn_item_bk.addTouchEventListener(function (sender, type) {

                    if (type == ccui.Widget.TOUCH_ENDED)
                    {
                        lm.log("buy gold :  " + sender.identifier);
                        this.currentSeder = sender;
                        roomManager.RequestPayment(sender.identifier, sender.proName, sender.price, sender.value);

                    }
                }, this);
            }


            if (itemindex == (3 -1))
                pageindex++;
        }

        // 计算需要隐藏的item的数量
        var needhideitemcount = this.scrollView_room_gold.getChildrenCount() * 3 - length;
        lm.log("refreshViewByData needhideitemcount: " + needhideitemcount + " " + this.scrollView_room_gold.getChildrenCount() * 3 + " " + length);
        // 隐藏剩余的item项
        for (var i = 0; i < needhideitemcount; i++) {
            itemindex++;

            // 从上面显示的最后索引开始隐藏
            var pageitem = this.scrollView_room_gold.getChildByTag(this.scrollView_room_gold.getChildrenCount() - 1);

            //lm.log("refreshViewByData pageitem : " + pageitem);
            if (pageitem === null)
                continue;

            // lm.log("refreshViewByData itemindex : " + itemindex);
            var panel_item = ccui.helper.seekWidgetByName(pageitem, "btn_ticketitem_" + itemindex);
            if (panel_item === null)
                continue;

            panel_item.setVisible(false);
        }
    },

    // 加载道具列表--隐藏 新版本 不需要切换
    refreshViewByProperty:function(propertydata)
    {
        this.ShowDonotMallTips(false);

        if(this.pageview_property.getPages().length  > 0)
            return;

        var length = propertydata.length;
        if(length == 0)return;

        propertydata.sort(function (item1, item2) {
            return Number(item1.price) > Number(item2.price);
        });


        var self = this;
        //加载文件
        for (var pageindex = 0; pageindex <  Math.ceil(length / DefultEarchPageItemCount); pageindex++)
        {
            var customPageItem = this.defultpageitem.clone();
            customPageItem.setAnchorPoint(0,0);
            this.pageview_property.addPage(customPageItem);
        }

        var pageindex = 0, itemindex = 0;
        for (var i = 0; i < length; i++) {

            // 设置item 显示数据
            itemindex = i % DefultEarchPageItemCount;
            var pageitem = this.pageview_property.getPage(pageindex);

            if (pageitem !== null)
            {
                var btn_item_bk = ccui.helper.seekWidgetByName(pageitem, "btn_ticketitem_" + itemindex);

                // 名称
                var text_tickitem_name = ccui.helper.seekWidgetByName(btn_item_bk, "text_tickitem_name_" + itemindex);
                text_tickitem_name.setString(propertydata[i]["pname"]);

                var text_tickitem_surplusinfo = ccui.helper.seekWidgetByName(btn_item_bk, "text_tickitem_surplusinfo_" + itemindex);
                text_tickitem_surplusinfo.setString("价格：");

                // 价格数量
                var text_tickitem_count = ccui.helper.seekWidgetByName(btn_item_bk, "text_tickitem_count_" + itemindex);
                text_tickitem_count.setString( "￥" + propertydata[i]["price"]);

                //描述
                var text_tickitem_exchangecondition = ccui.helper.seekWidgetByName(btn_item_bk, "text_tickitem_exchangecondition_" + itemindex);
                text_tickitem_exchangecondition.setString(propertydata[i]["directions"]);

                var Image_tickitem_texture = ccui.helper.seekWidgetByName(btn_item_bk, "Image_tickitem_texture_" + itemindex);
                // 商品类型
                switch (Number(propertydata[i]["type"]))
                {
                    case ProductType.product_type_gold:  // 金币
                        break;
                    case ProductType.product_type_vipyellow: // 黄钻
                    {
                        Image_tickitem_texture.loadTexture("icon_vip_yl_52.png",ccui.Widget.PLIST_TEXTURE);
                    }
                        break;
                    case ProductType.product_type_vipred: //红钻
                    {
                        Image_tickitem_texture.loadTexture("icon_vip_rd_52.png",ccui.Widget.PLIST_TEXTURE);
                    }
                        break;
                    case ProductType.product_type_vipblue: //蓝钻
                    {
                        Image_tickitem_texture.loadTexture("icon_vip_rd_52-1.png",ccui.Widget.PLIST_TEXTURE);
                    }
                        break;
                    default : //道具
                    {
                        Image_tickitem_texture.loadTexture("res/cocosOut/mall/" + propertydata[i]["pid"] + ".jpg", ccui.Widget.LOCAL_TEXTURE);
                    }
                        break;
                }

                //购买道具按钮
                btn_item_bk.itemindex = itemindex;
                btn_item_bk.identifier = propertydata[i]["identifier"];
                btn_item_bk.pageIndex = pageindex;

                //hanhu #增加用于sdk显示的价格和商品名称
                btn_item_bk.proName = propertydata[i]["pname"];
                btn_item_bk.price = propertydata[i]["price"];
                btn_item_bk.value = propertydata[i]["value"];
                btn_item_bk.setEnabled(true);
                btn_item_bk.addTouchEventListener(function (sender, type) {
                    if (type == ccui.Widget.TOUCH_ENDED)
                    {
                        if (sender.pageIndex !== self.pageview_property.getCurPageIndex())
                        {
                            return;
                        }

                        if (this.isTuning)
                        {

                            this.isTuning = false;
                            return;
                        }


                        lm.log("buy property :  " + sender.pid);
                        roomManager.RequestPayment(sender.identifier, sender.proName, sender.price, sender.value);

                    }
                }, this);
            }


            if (itemindex == (DefultEarchPageItemCount-1))
                pageindex++;
        }

        // 计算需要隐藏的item的数量
        var needhideitemcount = this.pageview_property.getChildrenCount() * DefultEarchPageItemCount - length;
        // lm.log("refreshViewByData needhideitemcount: " + needhideitemcount);
        // 隐藏剩余的item项
        for (var i = 0; i < needhideitemcount; i++) {
            itemindex++;

            // 从上面显示的最后索引开始隐藏
            var pageitem = this.pageview_property.getPage(this.pageview_property.getChildrenCount() - 1);

            //lm.log("refreshViewByData pageitem : " + pageitem);
            if (pageitem === null)
                continue;

            // lm.log("refreshViewByData itemindex : " + itemindex);
            var panel_item = ccui.helper.seekWidgetByName(pageitem, "btn_ticketitem_" + itemindex);
            if (panel_item === null)
                continue;

            panel_item.setVisible(false);
        }
    },

    //显示提示信息--隐藏 新版本 不需要切换
    ShowDonotMallTips:function(bShow)
    {
        var text_donotmall_tips = ccui.helper.seekWidgetByName(this.parentView, "text_donotmall_tips");
        if(text_donotmall_tips)
         text_donotmall_tips.setVisible(bShow);
    },

    // 加载我的列表--隐藏 新版本 不需要切换
    refreshViewByUserProperty:function(userpropertydata,propertydata)
    {
        //lm.log("self list : " + JSON.stringify(userpropertydata));
        //根据自己的道具ID在道具表中查找对应的名称，描述信息来显示
        var length = userpropertydata.length;
        console.log("refreshViewByUserProperty length=" + length);
        if(length==0)
        {
            this.ShowDonotMallTips(true);
            return;
        }

        if(this.pageview_self_property.getPages().length  > 0)
        {
            this.pageview_self_property.removeAllPages();
        }

        //加载文件
        for (var pageindex = 0; pageindex <Math.ceil(length / DefultEarchPageItemCount); pageindex++) {

            var customPageItem = this.defultpageitem.clone();
            customPageItem.setAnchorPoint(0,0);
            this.pageview_self_property.addPage(customPageItem);

        }

        var pageindex = 0, itemindex = 0;
        for (var i = 0; i < length; i++) {

            // 设置item 显示数据
            itemindex = i % DefultEarchPageItemCount;
            var pageitem = this.pageview_self_property.getPage(pageindex);
            var itemdata = this.FindItemData(userpropertydata[i]["pid"], propertydata);

            lm.log("用户道具为："+ JSON.stringify(userpropertydata));
            lm.log("物品数据数据：" + JSON.stringify(propertydata));

            if (pageitem !== null && itemdata !== null)
            {
                var btn_item_bk = ccui.helper.seekWidgetByName(pageitem, "btn_ticketitem_" + itemindex);
                // 名称
                var text_tickitem_name = ccui.helper.seekWidgetByName(btn_item_bk, "text_tickitem_name_" + itemindex);


                var text_tickitem_surplusinfo = ccui.helper.seekWidgetByName(btn_item_bk, "text_tickitem_surplusinfo_" + itemindex);
                text_tickitem_surplusinfo.setString("拥有：");

                // 数量
                var text_tickitem_count = ccui.helper.seekWidgetByName(btn_item_bk, "text_tickitem_count_" + itemindex);
                text_tickitem_count.setString( userpropertydata[i]["pcount"] );

                var Image_tickitem_texture = ccui.helper.seekWidgetByName(btn_item_bk, "Image_tickitem_texture_" + itemindex);

                switch (Number(itemdata["type"]))
                {
                    case ProductType.product_type_gold:  // 金币
                        break;
                    case ProductType.product_type_vipyellow: // 黄钻
                    {
                        Image_tickitem_texture.loadTexture("icon_vip_yl_52.png",ccui.Widget.PLIST_TEXTURE);
                        text_tickitem_name.setString(itemdata["pname"]);
                    }
                        break;
                    case ProductType.product_type_vipred: //红钻
                    {
                        Image_tickitem_texture.loadTexture("icon_vip_bu_52.png",ccui.Widget.PLIST_TEXTURE);
                        text_tickitem_name.setString(itemdata["pname"]);
                    }
                        break;
                    case ProductType.product_type_vipblue: //蓝钻
                    {
                        Image_tickitem_texture.loadTexture("icon_vip_rd_52.png",ccui.Widget.PLIST_TEXTURE);
                        text_tickitem_name.setString(itemdata["pname"]);
                    }
                        break;
                    default : //道具
                    {
                        switch (Number(itemdata["pid"]))
                        {
                            case MallProduct.WeekMatchTickets:// 周赛门票
                            {
                                text_tickitem_name.setString("周赛门票");
                            }
                                break;
                            case MallProduct.MonthMatchTickets://  月赛门票
                            {
                                text_tickitem_name.setString("月赛门票");
                            }
                                break;
                            case MallProduct.BuMarkTickets://  补签卡
                            {

                                text_tickitem_name.setString("补签卡");
                            }break;
                        }

                        //lm.log("道具ID：" + itemdata["pid"]);
                        Image_tickitem_texture.loadTexture("res/cocosOut/mall/" + itemdata["pid"] + ".jpg", ccui.Widget.LOCAL_TEXTURE);
                    }break;
                }

                //描述
                var text_tickitem_exchangecondition = ccui.helper.seekWidgetByName(btn_item_bk, "text_tickitem_exchangecondition_" + itemindex);
                text_tickitem_exchangecondition.setString(itemdata["directions"]);
            }
            else if(pageitem !== null)
            {
                var btn_item_bk = ccui.helper.seekWidgetByName(pageitem, "btn_ticketitem_" + itemindex);
                // 名称
                var text_tickitem_name = ccui.helper.seekWidgetByName(btn_item_bk, "text_tickitem_name_" + itemindex);
                text_tickitem_name.setString(userpropertydata[i]["pname"]);

                var text_tickitem_surplusinfo = ccui.helper.seekWidgetByName(btn_item_bk, "text_tickitem_surplusinfo_" + itemindex);
                text_tickitem_surplusinfo.setString("拥有：");

                // 数量
                var text_tickitem_count = ccui.helper.seekWidgetByName(btn_item_bk, "text_tickitem_count_" + itemindex);
                text_tickitem_count.setString( userpropertydata[i]["pcount"]);

                //图片
                var Image_tickitem_texture = ccui.helper.seekWidgetByName(btn_item_bk, "Image_tickitem_texture_" + itemindex);
                if(userpropertydata[i]["ConvertProductPid"] != 0)
                {
                    Image_tickitem_texture.loadTexture("res/cocosOut/product/" + userpropertydata[i]["ConvertProductPid"] + ".jpg", ccui.Widget.LOCAL_TEXTURE);
                    btn_item_bk.count = userpropertydata[i]["pcount"];
                    btn_item_bk.data = userpropertydata[i];
                    btn_item_bk.data["prizename"] = userpropertydata[i]["pname"];
                    btn_item_bk.data["prizeiconid"] = userpropertydata[i]["ConvertProductPid"];
                    btn_item_bk.data["prizeid"] = userpropertydata[i]["ConvertProductPid"];
                    var self = this;

                    var org_ticketData = roomManager.GetTicketData();
                    if(org_ticketData == undefined) //hanhu  #只有兑换数据为空时才请求新的数据 2015/12/09
                    {
                        layerManager.PopTipLayer(new WaitUILayer("正在努力加载兑换数据......",function()
                        {
                            layerManager.PopTipLayer(new PopAutoTipsUILayer("连接服务器超时，请稍后重试！", DefultPopTipsTime),false);

                        },this));
                        webMsgManager.SendGpGetPrizeexchanheData(function(data) {
                                layerManager.PopTipLayer(new PopAutoTipsUILayer("加载成功！", 1),false);
                                roomManager.SetTicketData(data);
                                var Data = data["prizeexchangelist"];
                                lm.log("加载成功，长度为 = " + Data.length);
                                for(var k in Data)
                                {
                                    lm.log(Data[k]["prizeid"] + " ?= " + btn_item_bk.data["prizeiconid"]);
                                    if(Data[k]["prizeid"] == btn_item_bk.data["prizeiconid"])
                                    {
                                        btn_item_bk.data["prizesummary"] = Data[k]["prizesummary"];
                                        break;
                                    }
                                }
                                btn_item_bk.addTouchEventListener(function(sender, type){
                                    if(type == ccui.Widget.TOUCH_ENDED)
                                    {
                                        var ticketInputUILayer  = new TicketInputUILayer(sender.data,
                                            sender.count,
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
                                },this);

                            },
                            function(errinfo) {

                                layerManager.PopTipLayer(new PopAutoTipsUILayer(errinfo, DefultPopTipsTime),true);
                            },
                            this);
                    }
                    else
                    {
                        var productData =  roomManager.GetTicketData()["prizeexchangelist"];
                        for(var k in productData)
                        {
                            if(productData[k]["prizeid"] == btn_item_bk.data["prizeiconid"])
                            {
                                btn_item_bk.data["prizesummary"] = productData[k]["prizesummary"];
                                break;
                            }
                        }
                        btn_item_bk.addTouchEventListener(function(sender, type){
                            if(type == ccui.Widget.TOUCH_ENDED)
                            {
                                var ticketInputUILayer  = new TicketInputUILayer(sender.data,
                                    sender.count,
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
                        },this);
                    }


                }
                else
                {
                    Image_tickitem_texture.loadTexture("res/cocosOut/mall/" + userpropertydata[i]["pid"] + ".jpg", ccui.Widget.LOCAL_TEXTURE);
                }

                //描述
                var text_tickitem_exchangecondition = ccui.helper.seekWidgetByName(btn_item_bk, "text_tickitem_exchangecondition_" + itemindex);
                text_tickitem_exchangecondition.setString(userpropertydata[i]["directions"]);

            }

            if (itemindex == (DefultEarchPageItemCount-1))
                pageindex++;
        }

        // 计算需要隐藏的item的数量
        var needhideitemcount = this.pageview_self_property.getChildrenCount() * DefultEarchPageItemCount - length;
        // lm.log("refreshViewByData needhideitemcount: " + needhideitemcount);
        // 隐藏剩余的item项
        for (var i = 0; i < needhideitemcount; i++) {
            itemindex++;

            // 从上面显示的最后索引开始隐藏
            var pageitem = this.pageview_self_property.getPage(this.pageview_self_property.getChildrenCount() - 1);

            //lm.log("refreshViewByData pageitem : " + pageitem);
            if (pageitem === null)
                continue;

            // lm.log("refreshViewByData itemindex : " + itemindex);
            var panel_item = ccui.helper.seekWidgetByName(pageitem, "btn_ticketitem_" + itemindex);
            if (panel_item === null)
                continue;

            panel_item.setVisible(false);
        }

    },

    //added by lizhongqiang 2016-01-22 11:00
    //过滤提交版本的道具 －会员、道具门票--隐藏 新版本 不需要切换
    FilterSubMitProperty:function(propertylist)
    {
        var resultlist=[];
        for(var key in propertylist)
        {
            switch (Number(propertylist[key]["type"]))
            {
                case ProductType.product_type_gold:  // 金币
                    break;
                case ProductType.product_type_vipyellow: // 黄钻
                    break;
                case ProductType.product_type_vipred: //红钻
                    break;
                case ProductType.product_type_vipblue: //蓝钻
                {
                    if(SubMitAppstoreVersion!=true)
                    {
                        resultlist.push( propertylist[key]);
                    }
                }
                    break;
                default : //道具
                {
                    if(SubMitAppstoreVersion!=true)
                    {
                        resultlist.push( propertylist[key]);

                    }else
                    {
                        if(propertylist[key]["pid"]=="31")
                        {
                            resultlist.push( propertylist[key]);
                        }
                    }
                }
                    break;
            }
        }

        return resultlist;

    },
    // end added by lizhongqiang 2016-01-22

    //刷新列表--有用
    refreshViewByData: function () {

        var datatype = this.mallDataType;
        if(datatype == null || datatype == undefined)
        {
            datatype == MallDataType.MALL_DATA_GOLD;     // 金币
        }

        var self = this;
        var malldata = roomManager.GetMallData();
        if((malldata === undefined) || (malldata === null))
            return;

        //var goldlist = null;
        //var propertylist = null;
        //switch (Number(GetDeviceType())) {
        //    case DeviceType.ANDROID://android
        //    {
        //         goldlist =malldata["goldlist"];
        //         propertylist = malldata["propertylist"];
        //    }
        //        break;
        //    case DeviceType.IOS://IOS
        //    case DeviceType.IPAD://IPAD
        //    {
        //        if(GET_CHANEL_ID() == ChanelID.IOS_BREAKOUT){
        //
        //            goldlist =malldata["goldlist"];
        //            propertylist = malldata["propertylist"];
        //
        //        }else{
        //
        //            goldlist = this.GetNewData(malldata["goldlist"]);
        //            propertylist = this.FilterSubMitProperty(this.GetNewData(malldata["propertylist"]));
        //
        //        }
        //    }
        //}

        var goldlist =malldata["goldlist"];
        var propertylist = malldata["propertylist"];
        switch (datatype)
        {
            case MallDataType.MALL_DATA_GOLD:     // 金币
            {
                if(goldlist != null)
                {
                    this.refreshViewByGold(goldlist);
                    //this.ClearPageFlags();
                    //this.AddPageFlags(goldlist);
                }
            }
                break;

            //case MallDataType.MALL_DATA_PROPERTY:     // 道具
            //{
            //
            //    if(propertylist != null)
            //    {
            //        this.refreshViewByProperty(propertylist);
            //        this.ClearPageFlags();
            //        this.AddPageFlags(propertylist);
            //    }
            //
            //}
            //    break;
            //
            //case MallDataType.MALL_DATA_USERPROPERTY:  // 我的道具
            //{
            //    var userproperty = malldata["userproperty"];
            //    if((userproperty !== undefined) && (userproperty !== null)&&
            //        (propertylist !== undefined) && (propertylist !== null))
            //    {
            //        this.refreshViewByUserProperty(userproperty,malldata["propertylist"]);
            //        this.ClearPageFlags();
            //        this.AddPageFlags(userproperty);
            //    }
            //}
            //    break;
        }
    },

    // 从根据苹果服务器返回列表数据查找本地应该显示的金币、道具数据--有用
    GetNewData:function(goldlist)
    {
        if((goldlist == null) || (goldlist == undefined) || (goldlist.length == 0))
        {
            lm.log("goldlist is null");
            return null;
        }

        lm.log("new products： " +this.products );
        if((this.products == null) || (this.products == undefined) || (this.products.length == 0))
        {
            lm.log("products is null" );
            return null;
        }


        var newgolddata =[];
        for (var i = 0; i < goldlist.length; i++)
        {
            if(this.FindProduct(goldlist[i]["identifier"],this.products))
            {
                newgolddata.push(goldlist[i]);
            }
        }


        return newgolddata;
    },

    //--有用
    FindProduct:function(pid,products)
    {
        for(var key in products)
        {
            if (products[key]["productIdentifier"] == pid)
            {
                return true;
            }
        }

        return false;
    },

    // 此处更新下载后的图片数据--隐藏 新版本 不需要切换
    UpdateCustomData:function(data)
    {
        //从道具目录加载图片显示










    }

});

