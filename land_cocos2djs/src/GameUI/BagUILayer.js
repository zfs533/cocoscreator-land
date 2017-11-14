/**
 * Created by fanxuehua on 16/4/7.
 */

var BagUILayer = rootUILayer.extend({
    ctor: function () {
        this._super();
        this.initBagLayer();
    },

    initBagLayer: function ()
    {
        cc.spriteFrameCache.addSpriteFrames("res/landlord/cocosOut/plaza/bag/bag.plist");

        var self = this;

        lm.log("yyp : BagUILayer : initBagLayer start");

        this.parentView = ccs.load("res/landlord/cocosOut/BagUILayer.json").node;
        this.addChild(this.parentView);
        this.parentView.ignoreAnchorPointForPosition(false);
        this.parentView.setAnchorPoint(0.5,0.5);
        this.parentView.setPosition(winSize.width/2,winSize.height/2);

        this.scrollView_bag = ccui.helper.seekWidgetByName(this.parentView, "scrollView_bag");
        this.scrollView_bag.setDirection(ccui.ScrollView.DIR_VERTICAL);
        this.scrollView_bag.setTouchEnabled(true);

        this.defultScrollItem = ccui.helper.seekWidgetByName(ccs.load("res/landlord/cocosOut/BagScrollItem.json").node,"layer_bagScrollitem");
        this.defultScrollItem.retain();

        this.origin = cc.p((winSize.width - this.parentView.getContentSize().width)/2, (winSize.height - this.parentView.getContentSize().height)/2);
        this.Image_label_bg = ccui.helper.seekWidgetByName(this.parentView, "Image_label_bg");          //label
        this.Image_label_bg.setPositionX(this.Image_label_bg.getPositionX() + this.origin.x);

        this.refreshViewBag();

        //显示用户头像信息
        this.ShowUserHeader(false);

        //隐藏上部按钮
        this.ShowTopButtons(false);

        //隐藏下部按钮
        this.ShowButtomButtons(false);
    },

    //加载道具列表
    refreshViewBag: function()
    {
        var itemCount = 3;

        this.text_bag_tips = ccui.helper.seekWidgetByName(this.parentView, "text_bag_tips");
        this.text_bag_tips.setVisible(true);

        var malldata = roomManager.GetMallData();
        lm.log("yypppp malldata" +  JSON.stringify(malldata));
        if((malldata === undefined) || (malldata === null))
            return;

        var userproperty = roomManager.GetBagData();
        var propertylist = malldata["propertylist"];
        lm.log("yypppp userproperty" +  JSON.stringify(userproperty));
        lm.log("yypppp propertylist" +  JSON.stringify(propertylist));
        if(userproperty == undefined || userproperty == null || propertylist == undefined || propertylist == null)
            return;

        var length = userproperty.length;
        if(length==0)
            return;

        //加载文件
        this.scrollView_bag.setInnerContainerSize(cc.size(this.scrollView_bag.getInnerContainerSize().width, 240 * Math.ceil(length / itemCount) + 10));
        for (var pageindex = 0; pageindex <  Math.ceil(length / itemCount); pageindex++)
        {
            var customPageItem = this.defultScrollItem.clone();
            customPageItem.setTag(pageindex);

            customPageItem.setPositionY(-240 * pageindex + this.scrollView_bag.getInnerContainerSize().height - customPageItem.getContentSize().height - 10);
            this.scrollView_bag.addChild(customPageItem);
        }

        var pageindex = 0, itemindex = 0;
        for (var i = 0; i < length; i++)
        {
            // 设置item 显示数据
            itemindex = i % itemCount;
            var pageitem = this.scrollView_bag.getChildByTag(pageindex);
            if (pageitem !== null)
            {
                var itemdata = this.FindItemData(userproperty[i]["pid"], propertylist);
                if (itemdata !== null)
                {
                    var button_bagitem = ccui.helper.seekWidgetByName(pageitem, "button_bagitem_" + itemindex);

                    //道具名称
                    var text_item_name = ccui.helper.seekWidgetByName(button_bagitem, "text_item_name");

                    //道具icon
                    var Image_item_icon = ccui.helper.seekWidgetByName(button_bagitem, "Image_item_icon");

                    switch (Number(itemdata["type"]))
                    {
                        case ProductType.product_type_gold:  // 金币
                            break;
                        case ProductType.product_type_vipyellow: // 黄钻
                        {
                            Image_item_icon.loadTexture("icon_vip_yl_52.png",ccui.Widget.PLIST_TEXTURE);
                            text_item_name.setString(itemdata["pname"]);
                        }
                            break;
                        case ProductType.product_type_vipred: //红钻
                        {
                            Image_item_icon.loadTexture("icon_vip_bu_52.png",ccui.Widget.PLIST_TEXTURE);
                            text_item_name.setString(itemdata["pname"]);
                        }
                            break;
                        case ProductType.product_type_vipblue: //蓝钻
                        {
                            Image_item_icon.loadTexture("icon_vip_rd_52.png",ccui.Widget.PLIST_TEXTURE);
                            text_item_name.setString(itemdata["pname"]);
                        }
                            break;
                        default : //道具
                        {
                            switch (Number(itemdata["pid"]))
                            {
                                case MallProduct.WeekMatchTickets:// 周赛门票
                                {
                                    text_item_name.setString("周赛门票");
                                }
                                    break;
                                case MallProduct.MonthMatchTickets://  月赛门票
                                {
                                    text_item_name.setString("月赛门票");
                                }
                                    break;
                                case MallProduct.BuMarkTickets://  补签卡
                                {

                                    text_item_name.setString("补签卡");
                                }
                                    break;
                            }

                            //lm.log("道具ID：" + itemdata["pid"]);
                            Image_item_icon.loadTexture("res/cocosOut/mall/" + itemdata["pid"] + ".jpg", ccui.Widget.LOCAL_TEXTURE);
                        }
                            break;
                    }

                    // 道具数量
                    var fnt_item_count = ccui.helper.seekWidgetByName(button_bagitem, "fnt_item_count");
                    fnt_item_count.setString("x" + userproperty[i]["pcount"]);

                    //描述
                    var text_item_explain = ccui.helper.seekWidgetByName(button_bagitem, "text_item_explain");
                    text_item_explain.setString(itemdata["directions"]);
                }
                else
                {
                    var button_bagitem = ccui.helper.seekWidgetByName(pageitem, "button_bagitem_" + itemindex);

                    //道具名称
                    var text_item_name = ccui.helper.seekWidgetByName(button_bagitem, "text_item_name");
                    text_item_name.setString(userproperty[i]["pname"]);

                    //道具icon
                    var Image_item_icon = ccui.helper.seekWidgetByName(button_bagitem, "Image_item_icon");
                    //if(userproperty[i]["ConvertProductPid"] != 0)
                    //{
                    //    Image_item_icon.loadTexture("res/cocosOut/product/" + userproperty[i]["ConvertProductPid"] + ".jpg", ccui.Widget.LOCAL_TEXTURE);
                    //}
                    //else
                    {
                        Image_item_icon.loadTexture("res/cocosOut/mall/" + userproperty[i]["pid"] + ".jpg", ccui.Widget.LOCAL_TEXTURE);
                    }

                    lm.log("yypppp propertylist 2 " +  userproperty[i]["pname"]);

                    // 道具数量
                    var fnt_item_count = ccui.helper.seekWidgetByName(button_bagitem, "fnt_item_count");
                    fnt_item_count.setString("x" + userproperty[i]["pcount"]);

                    //描述
                    var text_item_explain = ccui.helper.seekWidgetByName(button_bagitem, "text_item_explain");
                    text_item_explain.setString(userproperty[i]["directions"]);

                }

                if (itemindex == (itemCount - 1))
                    pageindex++;
            }
        }

        // 计算需要隐藏的item的数量
        var needhideitemcount = this.scrollView_bag.getChildrenCount() * itemCount - length;
        // 隐藏剩余的item项
        for (var i = 0; i < needhideitemcount; i++)
        {
            itemindex++;

            // 从上面显示的最后索引开始隐藏
            var pageitem = this.scrollView_bag.getChildByTag(this.scrollView_bag.getChildrenCount() - 1);

            if (pageitem === null)
                continue;

            var panel_item = ccui.helper.seekWidgetByName(pageitem, "button_bagitem_" + itemindex);
            if (panel_item === null)
                continue;

            panel_item.setVisible(false);
        }

        if(this.scrollView_bag.getChildrenCount() > 0)
        {
            this.text_bag_tips.setVisible(false);
        }
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
    }



});