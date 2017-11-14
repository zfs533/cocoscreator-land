/**
 * Created by lizhongqiang on 15/6/26.
 */

var DefultItemOffset  = 20;

var MarkRewardUILayer = rootLayer.extend({
    ctor: function () {
        this._super();
        this.initLayer();
    },
    initLayer: function ()
    {

        this.parentView = ccs.load("res/landlord/cocosOut/MarkRewardUILayerNew.json").node;
        this.addChild(this.parentView);
        this.parentView.setPosition((winSize.width - 960) / 2, 0);
        //this.parentView.setPosition(-200, -200);

        lm.log("yyp MarkRewardUILayerEx" + (winSize.width - 960) / 2);
        lm.log("yyp MarkRewardUILayerEXx" + (winSize.width - 960) / 2);

        // 关闭按钮
        var panel_reward_close = ccui.helper.seekWidgetByName(this.parentView,"panel_reward_close");
        panel_reward_close.setPressedActionEnabled(true);
        panel_reward_close.addTouchEventListener(function (sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                this.removeFromParent();
            }

        }, this);


        // 奖励道具列表视图
        this.panel_markreward_items = ccui.helper.seekWidgetByName(this.parentView,"panel_markreward_items");

        //
        this.defaultItem = ccui.helper.seekWidgetByName(ccs.load("res/landlord/cocosOut/MarkRewardItem.json").node, "panel_markrewarditem");


        this.setDarkBg();
        
    },

    // 刷新列表视图
    RefReshRewardListView:function(data)
    {
        if(data == undefined || data == null)
          return;

        var length = data.length * (this.defaultItem.getContentSize().width + DefultItemOffset);
        var startPos =  (this.panel_markreward_items.getContentSize().width  - length) / 2;

        lm.log("RefReshRewardListView panel_markreward_items: " + this.panel_markreward_items.getContentSize().width  + "  length " + length);


        for (var key in data)
        {
            var lastItem =   this.defaultItem.clone();
            this.panel_markreward_items.addChild(lastItem);
            lastItem.setAnchorPoint(0,0);
            lastItem.setPosition(startPos + key * (lastItem.getContentSize().width +DefultItemOffset),
                0);
                //this.panel_markreward_items.getPositionY() + DefultItemOffset);

            var itemvalue =  data[key]["itemvalue"];
            var itemcount =  data[key]["itemcount"];
            var itemtype =  data[key]["itemtype"];
            var itemurl = data[key]["itemiconurl"];
            var itemname = data[key]["itemname"];


            var text_rewarditem = ccui.helper.seekWidgetByName(lastItem, "text_goods_name");
            var text_rewardnumber = ccui.helper.seekWidgetByName(lastItem, "text_goods_number");
            var Image_rewarditem = ccui.helper.seekWidgetByName(lastItem, "Image_rewarditem");
            switch (Number(itemtype))
            {

                case RewardItemType.REWARD_TYPE_GOLD:
                {
                    text_rewarditem.setString("金币");
                    text_rewardnumber.setString("x" + itemvalue);
                    Image_rewarditem.loadTexture("itemicon_gold01.png",ccui.Widget.PLIST_TEXTURE);
                }
                    break;
                case RewardItemType.REWARD_ITEMTYPE_MEDAL:
                {

                    text_rewarditem.setString("奖牌");
                    text_rewardnumber.setString("x" + itemvalue );
                    Image_rewarditem.loadTexture("icon_medal_32.png",ccui.Widget.PLIST_TEXTURE);
                }
                    break;
                case RewardItemType.REWARD_ITEMTYPE_PROP:
                {

                    text_rewarditem.setString("道具");
                    text_rewardnumber.setString("x" + itemcount);
                    Image_rewarditem.loadTexture("res/cocosOut/product/" + itemvalue +".jpg",ccui.Widget.LOCAL_TEXTURE);
                }
                    break;
                case RewardItemType.REWARD_ITEMTYPE_MEMBER:
                {
                    lm.log("itemtype3: " + itemtype  + " itemvalue " + itemvalue +  " itemcount " + itemcount);

                    switch (Number(itemvalue))
                    {
                        case MemberOrder.MEMBER_ORDER_YELLOW: //黄钻
                        {
                            text_rewarditem.setString("黄钻");
                            text_rewardnumber.setString(itemcount + "天");
                            Image_rewarditem.loadTexture("icon_vip_yl_52.png",ccui.Widget.PLIST_TEXTURE);
                        }
                            break;
                        case MemberOrder.MEMBER_ORDER_BLUE:  //蓝钻
                        {
                            text_rewarditem.setString("蓝钻");
                            text_rewardnumber.setString(itemcount + "天");
                            Image_rewarditem.loadTexture("icon_vip_bu_52.png",ccui.Widget.PLIST_TEXTURE);
                        }
                            break;
                        case MemberOrder.MEMBER_ORDER_RED:     //红钻
                        {
                            text_rewarditem.setString("红钻");
                            text_rewardnumber.setString(itemcount + "天");
                            Image_rewarditem.loadTexture("icon_vip_rd_52.png",ccui.Widget.PLIST_TEXTURE);

                        }
                            break;
                        default :
                            break;
                    }

                }break;
                default :
                {
                    lm.log("itemtype4: " + itemtype  + " itemvalue " + itemvalue +  " itemcount " + itemcount);

                }
                    break;
            }

        }

    }

});

