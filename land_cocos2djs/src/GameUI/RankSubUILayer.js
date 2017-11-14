/**
 * Created by lizhongqiang on 15/6/5.
 */

var RankType =
{
    RANK_TYPE_FORTUNE: 0, // 金币排行
    RANK_TYPE_RECOED: 1, // 战绩排行
    RANK_TYPE_CHARM: 2   // 魅力排行

};


//设置默认背景颜色
var DefultItemBkColor = cc.color(29, 64, 81, 255);


var RankSubUILayer = rootUILayer.extend({
    ctor: function () {
        this._super();
        this.initLayer();
    },
    onExit: function () {
        this._super();
        this.unscheduleAllCallbacks();
    },
    initLayer: function () {

        this.parentView = ccs.load("res/cocosOut/RankSubUILayer.json").node;
        this.addChild(this.parentView);
        //hanhu #调整排行榜坐标 2015/08/07
        var offset = (this.parentView.getContentSize().width * winSize.height / 640 - winSize.width) / 2;
        this.parentView.x -= offset;

        //隐藏下部按钮
        this.ShowButtomButtons(false);


        var self = this;
        //分享
        var btn_subrank_share = ccui.helper.seekWidgetByName(this.parentView, "btn_subrank_share");
        btn_subrank_share.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {

                DataUtil.ShareWeiXin();


            }
        }, this);

        //自己排行榜
        var textbmfont_rankings = ccui.helper.seekWidgetByName(this.parentView, "textbmfont_rankings");

        //listview
        this.listview_subrank = ccui.helper.seekWidgetByName(this.parentView, "listview_subrank");

        var defaultItem = ccui.helper.seekWidgetByName(ccs.load("res/cocosOut/RankSubItem.json").node, "panel_ranksubitem_bk");
        this.listview_subrank.setItemModel(defaultItem);


        this.text_rank_tips = ccui.helper.seekWidgetByName(this.parentView, "text_rank_tips");

        this.ShowUserHeader(false);

    },

    //获取自己排行榜名次
    GetSelfRank: function (subindex, selfrank) {

        switch (subindex) {
            case RankType.RANK_TYPE_FORTUNE: // 金币排行
            {
                return selfrank["fortnuerank"];
            }
            case RankType.RANK_TYPE_RECOED: // 战绩排行
            {
                return selfrank["recordrank"];
            }
            case
            RankType.RANK_TYPE_CHARM: // 魅力排行
            {
                return selfrank["charmrank"];
            }
        }

        return 0;
    },
    //刷新列表
    refreshViewByData: function (subindex, rankdata, selfrank) {
        this.listview_subrank.removeAllItems();
        var text_subrank_info = ccui.helper.seekWidgetByName(this.parentView, "text_subrank_info");
        var textbmfont_ranking_gold = ccui.helper.seekWidgetByName(this.parentView, "textbmfont_ranking_gold");
        var textbmfont_ranking_charm = ccui.helper.seekWidgetByName(this.parentView, "textbmfont_ranking_charm");
        var selfrank = this.GetSelfRank(subindex,selfrank);

        lm.log("selfrank: " + JSON.stringify(selfrank));

        switch (subindex) {
            case RankType.RANK_TYPE_FORTUNE: // 金币排行
            {
                textbmfont_ranking_gold.setVisible(true);
                textbmfont_ranking_charm.setVisible(false);
                if((selfrank !== undefined) && (selfrank !== null))
                {
                    if(selfrank > 100){
                        textbmfont_ranking_gold.setVisible(false);
                    }else{
                        textbmfont_ranking_gold.setString(selfrank);
                    }

                }
                else
                {
                    textbmfont_ranking_gold.setVisible(false);
                }

                if( !textbmfont_ranking_gold.isVisible() ){
                    var goldLable = cc.LabelTTF.create("未上榜", "Arial", 20);
                    goldLable.setPosition( textbmfont_ranking_gold.getPosition().x - 5 , textbmfont_ranking_gold.getPosition().y - 2 );
                    goldLable.setColor(cc.color(255,255,255,255));
                    this.parentView.addChild(goldLable);
                }
                text_subrank_info.setString("我的财富排行：");
                this.RankGold(rankdata);
            }
                break;
            case RankType.RANK_TYPE_RECOED: //战绩排行
            {
                textbmfont_ranking_gold.setVisible(true);
                textbmfont_ranking_charm.setVisible(false);

                if((selfrank !== undefined) && (selfrank !== null))
                {
                    if(selfrank > 100){
                        textbmfont_ranking_gold.setVisible(false);
                    }else{
                        textbmfont_ranking_gold.setString(selfrank);
                    }
                }
                else
                {
                    textbmfont_ranking_gold.setVisible(false);
                }

                if( !textbmfont_ranking_gold.isVisible() ){
                    var goldLable = cc.LabelTTF.create("未上榜", "Arial", 20);
                    goldLable.setPosition( textbmfont_ranking_gold.getPosition().x - 5 , textbmfont_ranking_gold.getPosition().y - 2 );
                    goldLable.setColor(cc.color(255,255,255,255));
                    this.parentView.addChild(goldLable);
                }

                text_subrank_info.setString("我的战绩排行：");
                this.RankFight(rankdata);

            }
                break;
            case RankType.RANK_TYPE_CHARM:// 魅力排行
            {
                textbmfont_ranking_gold.setVisible(false);
                textbmfont_ranking_charm.setVisible(true);

                if((selfrank !== undefined) && (selfrank !== null))
                {
                    if(selfrank > 100){
                        textbmfont_ranking_charm.setVisible(false);
                    }else{
                        textbmfont_ranking_charm.setString(selfrank);
                    }
                }
                else
                {
                    textbmfont_ranking_charm.setVisible(false);
                }

                if( !textbmfont_ranking_charm.isVisible() ){
                    var goldLable = cc.LabelTTF.create("未上榜", "Arial", 20);
                    goldLable.setPosition( textbmfont_ranking_gold.getPosition().x - 5 , textbmfont_ranking_gold.getPosition().y - 2 );
                    goldLable.setColor(cc.color(255,255,255,255));
                    this.parentView.addChild(goldLable);
                }

                text_subrank_info.setString("我的魅力排行：");
                this.RankChakm(rankdata);

            }
                break;
        }
        //hanhu #设置箭头动画 2015/08/03

        var ArrowUp = ccui.helper.seekWidgetByName(this.parentView, "btn_rank_up");
        var ArrowDown = ccui.helper.seekWidgetByName(this.parentView, "btn_rank_down");
        //lm.log("列表偏移量为 ： " + this.listview_subrank.getInnerContainerSize().height);
        ArrowAdpter(this, ArrowUp, ArrowDown, this.listview_subrank);

    },
    getLastListItem: function () {
        if (this.listview_subrank.getItems().length)
            return this.listview_subrank.getItems()[this.listview_subrank.getItems().length - 1];
    },
    // 金币排行
    RankGold: function (rankdata) {

        if((rankdata === undefined) || (rankdata === null) || (rankdata.length === 0))
        {
            this.text_rank_tips.setVisible(true);
            this.text_rank_tips.setString("暂无财富排行信息，敬请期待！");

        }else
        {

            this.text_rank_tips.setVisible(false);
            rankdata.sort(function (item1, item2) {
                return item1.rankings > item2.rankings;
            });
            for (var key in rankdata) {
                this.listview_subrank.pushBackDefaultItem();
                var lastItem = this.getLastListItem();

                var Image_ranksubitem_first = ccui.helper.seekWidgetByName(lastItem, "Image_ranksubitem_first");
                var Image_ranksubitem_second = ccui.helper.seekWidgetByName(lastItem, "Image_ranksubitem_second");
                var Image_ranksubitem_third = ccui.helper.seekWidgetByName(lastItem, "Image_ranksubitem_third");
                var text_ranksubitem_name = ccui.helper.seekWidgetByName(lastItem, "text_ranksubitem_name");
                text_ranksubitem_name.setString(rankdata[key]["nickname"]);

                var Image_ranksubitem_header = ccui.helper.seekWidgetByName(lastItem, "Image_ranksubitem_header");
                var name,faceid = Number(rankdata[key]["faceid"]);
                if(faceid == undefined || faceid == null || faceid == 0)
                {
                    name =  "1.png";
                }else
                {
                    name = faceid + ".png";
                }
                Image_ranksubitem_header.loadTexture(name,ccui.Widget.PLIST_TEXTURE);

                //Image_ranksubitem_header.loadTexture(rankdata[key]["faceid"] + ".png");
                var text_ranksubitem_ranking = ccui.helper.seekWidgetByName(lastItem, "text_ranksubitem_ranking");

                var Image_ranksubitem_name_bk = ccui.helper.seekWidgetByName(lastItem, "Image_ranksubitem_name_bk");
                Image_ranksubitem_name_bk.setColor(DefultItemBkColor);

                var Image_ranksubitem_score_bk = ccui.helper.seekWidgetByName(lastItem, "Image_ranksubitem_score_bk");
                Image_ranksubitem_score_bk.setColor(DefultItemBkColor);


                var textbmfont_ranksubitem_goldinfo = ccui.helper.seekWidgetByName(lastItem, "textbmfont_ranksubitem_goldinfo");
                textbmfont_ranksubitem_goldinfo.setVisible(true);

                var textbmfont_ranksubitem_goldscore = ccui.helper.seekWidgetByName(lastItem, "textbmfont_ranksubitem_goldscore");
                textbmfont_ranksubitem_goldscore.setVisible(true);
                textbmfont_ranksubitem_goldscore.setString(rankdata[key]["gload"]);

                var textbmfont_ranksubitem_charminfo = ccui.helper.seekWidgetByName(lastItem, "textbmfont_ranksubitem_charminfo");
                textbmfont_ranksubitem_charminfo.setVisible(false);

                var textbmfont_ranksubitem_charmscore = ccui.helper.seekWidgetByName(lastItem, "textbmfont_ranksubitem_charmscore");
                textbmfont_ranksubitem_charmscore.setVisible(false);

                var rankings = rankdata[key]["rankings"];
                switch (rankings) {
                    case 1:
                    {
                        Image_ranksubitem_first.setVisible(true);
                        Image_ranksubitem_second.setVisible(false);
                        Image_ranksubitem_third.setVisible(false);
                        text_ranksubitem_ranking.setVisible(false);
                    }
                        break;
                    case 2:
                    {
                        Image_ranksubitem_first.setVisible(false);
                        Image_ranksubitem_second.setVisible(true);
                        Image_ranksubitem_third.setVisible(false);
                        text_ranksubitem_ranking.setVisible(false);
                    }
                        break;
                    case 3:
                    {
                        Image_ranksubitem_first.setVisible(false);
                        Image_ranksubitem_second.setVisible(false);
                        Image_ranksubitem_third.setVisible(true);
                        text_ranksubitem_ranking.setVisible(false);
                    }
                        break;
                    default :
                    {
                        Image_ranksubitem_first.setVisible(false);
                        Image_ranksubitem_second.setVisible(false);
                        Image_ranksubitem_third.setVisible(false);
                        text_ranksubitem_ranking.setVisible(true);
                        text_ranksubitem_ranking.setString(String(rankings));
                    }
                        break;
                }

            }
        }
    },
    // 战绩排行
    RankFight: function (rankdata) {

        if((rankdata == null) || (rankdata.length == 0))
        {
            this.text_rank_tips.setVisible(true);
            this.text_rank_tips.setString("暂无战绩排行信息，敬请期待！");

        }else
        {

            this.text_rank_tips.setVisible(false);
            rankdata.sort(function (item1, item2) {
                return item1.rankings > item2.rankings;
            });

            for (var key in rankdata) {
                this.listview_subrank.pushBackDefaultItem();
                var lastItem = this.getLastListItem();

                var Image_ranksubitem_first = ccui.helper.seekWidgetByName(lastItem, "Image_ranksubitem_first");
                var Image_ranksubitem_second = ccui.helper.seekWidgetByName(lastItem, "Image_ranksubitem_second");
                var Image_ranksubitem_third = ccui.helper.seekWidgetByName(lastItem, "Image_ranksubitem_third");
                var text_ranksubitem_name = ccui.helper.seekWidgetByName(lastItem, "text_ranksubitem_name");
                text_ranksubitem_name.setString(rankdata[key]["nickname"]);

                var Image_ranksubitem_header = ccui.helper.seekWidgetByName(lastItem, "Image_ranksubitem_header");
                var name,faceid = Number(rankdata[key]["faceid"]);
                if(faceid == undefined || faceid == null || faceid == 0)
                {
                    name =  "1.png";
                }else
                {
                    name = faceid + ".png";
                }
                Image_ranksubitem_header.loadTexture(name,ccui.Widget.PLIST_TEXTURE);


                var text_ranksubitem_ranking = ccui.helper.seekWidgetByName(lastItem, "text_ranksubitem_ranking");

                var Image_ranksubitem_name_bk = ccui.helper.seekWidgetByName(lastItem, "Image_ranksubitem_name_bk");
                Image_ranksubitem_name_bk.setColor(DefultItemBkColor);

                var Image_ranksubitem_score_bk = ccui.helper.seekWidgetByName(lastItem, "Image_ranksubitem_score_bk");
                Image_ranksubitem_score_bk.setColor(DefultItemBkColor);

                var textbmfont_ranksubitem_goldinfo = ccui.helper.seekWidgetByName(lastItem, "textbmfont_ranksubitem_goldinfo");
                textbmfont_ranksubitem_goldinfo.setVisible(true);
                textbmfont_ranksubitem_goldinfo.setString("战绩:");

                var textbmfont_ranksubitem_goldscore = ccui.helper.seekWidgetByName(lastItem, "textbmfont_ranksubitem_goldscore");
                textbmfont_ranksubitem_goldscore.setVisible(true);
                textbmfont_ranksubitem_goldscore.setString(rankdata[key]["gload"]);

                var textbmfont_ranksubitem_charminfo = ccui.helper.seekWidgetByName(lastItem, "textbmfont_ranksubitem_charminfo");
                textbmfont_ranksubitem_charminfo.setVisible(false);
                // textbmfont_ranksubitem_charminfo.setZOrder(1000);
                // textbmfont_ranksubitem_charminfo.setString(" 战绩：");

                var textbmfont_ranksubitem_charmscore = ccui.helper.seekWidgetByName(lastItem, "textbmfont_ranksubitem_charmscore");
                textbmfont_ranksubitem_charmscore.setVisible(false);
                // textbmfont_ranksubitem_charmscore.setString(rankdata[key]["gload"]);

                var rankings = rankdata[key]["rankings"];
                switch (rankings) {
                    case 1:
                    {
                        Image_ranksubitem_first.setVisible(true);
                        Image_ranksubitem_second.setVisible(false);
                        Image_ranksubitem_third.setVisible(false);
                        text_ranksubitem_ranking.setVisible(false);
                    }
                        break;
                    case 2:
                    {
                        Image_ranksubitem_first.setVisible(false);
                        Image_ranksubitem_second.setVisible(true);
                        Image_ranksubitem_third.setVisible(false);
                        text_ranksubitem_ranking.setVisible(false);
                    }
                        break;
                    case 3:
                    {
                        Image_ranksubitem_first.setVisible(false);
                        Image_ranksubitem_second.setVisible(false);
                        Image_ranksubitem_third.setVisible(true);
                        text_ranksubitem_ranking.setVisible(false);
                    }
                        break;
                    default :
                    {
                        Image_ranksubitem_first.setVisible(false);
                        Image_ranksubitem_second.setVisible(false);
                        Image_ranksubitem_third.setVisible(false);
                        text_ranksubitem_ranking.setVisible(true);
                        text_ranksubitem_ranking.setString(String(rankings));
                    }
                        break;
                }

            }
        }

    },

    //魅力排行
    RankChakm: function (rankdata) {
        if((rankdata == null) || (rankdata.length == 0))
        {
            this.text_rank_tips.setVisible(true);
            this.text_rank_tips.setString("暂无魅力排行信息，敬请期待！");

        }else
        {

            this.text_rank_tips.setVisible(false);
            rankdata.sort(function (item1, item2) {
                return item1.rankings > item2.rankings;
            });

            for (var key in rankdata) {
                this.listview_subrank.pushBackDefaultItem();
                var lastItem = this.getLastListItem();

                var Image_ranksubitem_first = ccui.helper.seekWidgetByName(lastItem, "Image_ranksubitem_first");
                var Image_ranksubitem_second = ccui.helper.seekWidgetByName(lastItem, "Image_ranksubitem_second");
                var Image_ranksubitem_third = ccui.helper.seekWidgetByName(lastItem, "Image_ranksubitem_third");

                //昵称
                var text_ranksubitem_name = ccui.helper.seekWidgetByName(lastItem, "text_ranksubitem_name");
                text_ranksubitem_name.setString(rankdata[key]["nickname"]);

                var Image_ranksubitem_header = ccui.helper.seekWidgetByName(lastItem, "Image_ranksubitem_header");
                var name,faceid = Number(rankdata[key]["faceid"]);

                if(faceid == undefined || faceid == null || faceid == 0)
                {
                    name =  "1.png";
                }else
                {
                    name = faceid + ".png";
                }
                lm.log("charkm  faceid : " + faceid);
                Image_ranksubitem_header.loadTexture(name,ccui.Widget.PLIST_TEXTURE);

                var text_ranksubitem_ranking = ccui.helper.seekWidgetByName(lastItem, "text_ranksubitem_ranking");

                var Image_ranksubitem_name_bk = ccui.helper.seekWidgetByName(lastItem, "Image_ranksubitem_name_bk");
                Image_ranksubitem_name_bk.setColor(DefultItemBkColor);

                var Image_ranksubitem_score_bk = ccui.helper.seekWidgetByName(lastItem, "Image_ranksubitem_score_bk");
                Image_ranksubitem_score_bk.setColor(DefultItemBkColor);

                var textbmfont_ranksubitem_goldinfo = ccui.helper.seekWidgetByName(lastItem, "textbmfont_ranksubitem_goldinfo");
                textbmfont_ranksubitem_goldinfo.setVisible(false);

                var textbmfont_ranksubitem_goldscore = ccui.helper.seekWidgetByName(lastItem, "textbmfont_ranksubitem_goldscore");
                textbmfont_ranksubitem_goldscore.setVisible(false);

                //魅力值
                var textbmfont_ranksubitem_charminfo = ccui.helper.seekWidgetByName(lastItem, "textbmfont_ranksubitem_charminfo");
                textbmfont_ranksubitem_charminfo.setVisible(true);

                var textbmfont_ranksubitem_charmscore = ccui.helper.seekWidgetByName(lastItem, "textbmfont_ranksubitem_charmscore");
                textbmfont_ranksubitem_charmscore.setVisible(true);
                textbmfont_ranksubitem_charmscore.setString(rankdata[key]["charm"]);

                //魅力排行榜
                var rankings = rankdata[key]["rankings"];
                switch (rankings) {
                    case 1:
                    {
                        Image_ranksubitem_first.setVisible(true);
                        Image_ranksubitem_second.setVisible(false);
                        Image_ranksubitem_third.setVisible(false);
                        text_ranksubitem_ranking.setVisible(false);
                    }
                        break;
                    case 2:
                    {
                        Image_ranksubitem_first.setVisible(false);
                        Image_ranksubitem_second.setVisible(true);
                        Image_ranksubitem_third.setVisible(false);
                        text_ranksubitem_ranking.setVisible(false);
                    }
                        break;
                    case 3:
                    {
                        Image_ranksubitem_first.setVisible(false);
                        Image_ranksubitem_second.setVisible(false);
                        Image_ranksubitem_third.setVisible(true);
                        text_ranksubitem_ranking.setVisible(false);
                    }
                        break;
                    default :
                    {
                        Image_ranksubitem_first.setVisible(false);
                        Image_ranksubitem_second.setVisible(false);
                        Image_ranksubitem_third.setVisible(false);
                        text_ranksubitem_ranking.setVisible(true);
                        text_ranksubitem_ranking.setString(String(rankings));
                    }
                        break;
                }
            }
        }
    }


});