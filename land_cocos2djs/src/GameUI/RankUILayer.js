/**
 * Created by lizhongqiang on 15/6/4.
 */



var RankUILayer = rootUILayer.extend({
    ctor: function ()
    {
        this._super();
        this.initLayer();
    },
    onEnterTransitionDidFinish: function () {
        this._super();

        var self = this;
        webMsgManager.SendGpGetRankingsData(function(data)
            {
                roomManager.setRankGameData(data);
                self.refreshViewByData(roomManager.getRankGameData());
                self.changeMyRank(0);
            },
            function(errinfo) {

                layerManager.PopTipLayer(new PopAutoTipsUILayer(errinfo, DefultPopTipsTime),true);
            },
            this);

    },

    initLayer: function ()
    {
        cc.spriteFrameCache.addSpriteFrames("res/landlord/cocosOut/plaza/rank/rank.plist");
        cc.spriteFrameCache.addSpriteFrames("res/landlord/cocosOut/general/general.plist");

        this.parentView = ccs.load("res/landlord/cocosOut/RankUILayer.json").node;
        this.addChild(this.parentView);
        //hanhu #调整排行榜坐标 2015/08/07
        var offset = (this.parentView.getContentSize().width * winSize.height / 640 - winSize.width) / 2;
        this.parentView.x -= offset;

        this.origin = cc.p((winSize.width - this.parentView.getContentSize().width)/2, (winSize.height - this.parentView.getContentSize().height)/2);
        this.org_pos = this.parentView.getPosition();


        //任务列表
        this.scrollView_rank_gold = ccui.helper.seekWidgetByName(this.parentView, "scrollView_rank_gold");
        this.scrollView_rank_standings = ccui.helper.seekWidgetByName(this.parentView, "scrollView_rank_standings");

        this.defaultItem = ccui.helper.seekWidgetByName(ccs.load("res/landlord/cocosOut/RankSubItem.json").node,"panel_ranksubitem_bk");
        this.defaultItem.retain();

        this.text_rank_tips  = ccui.helper.seekWidgetByName(this.parentView, "text_rank_tips");
        this.text_my_rank  = ccui.helper.seekWidgetByName(this.parentView, "text_my_rank");
        this.text_my_rank.setVisible(false);
        this.Image_my_rank  = ccui.helper.seekWidgetByName(this.parentView, "Image_my_rank");
        this.Image_my_rank.setVisible(false);
        this.my_rank_gold = -1;      //未入榜
        this.my_standings_gold = -1; //未入榜

        this.initLabelBtn();


        //获取排行榜数据
        //this.refreshViewByData(roomManager.getRankGameData());

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

        this.text_title_2 = ccui.helper.seekWidgetByName(this.parentView, "text_title_2");
        this.Image_label_bg = ccui.helper.seekWidgetByName(this.layer_title_label, "Image_label_bg");
        this.btn_title_gold = ccui.helper.seekWidgetByName(this.layer_title_label, "btn_title_gold");
        this.btn_title_standings = ccui.helper.seekWidgetByName(this.layer_title_label, "btn_title_standings");

        this.btn_title_gold.addTouchEventListener(function(sender, type){
            if(type == ccui.Widget.TOUCH_ENDED)
            {
                self.btn_title_gold.loadTexture("image_gold_press.png", ccui.Widget.PLIST_TEXTURE);
                self.btn_title_standings.loadTexture("image_standings_normal.png", ccui.Widget.PLIST_TEXTURE);
                self.Image_label_bg.setPositionX(self.btn_title_gold.getPositionX());

                self.scrollView_rank_gold.setVisible(true);
                self.scrollView_rank_standings.setVisible(false);

                self.text_title_2.setString("持有金币总额");
                self.changeMyRank(0);

                if(self.scrollView_rank_gold.getChildrenCount() > 0)
                {
                    self.text_rank_tips.setVisible(false);
                }
                else
                {
                    self.text_rank_tips.setVisible(true);
                }
            }
        });

        this.btn_title_standings.addTouchEventListener(function(sender, type){
            if(type == ccui.Widget.TOUCH_ENDED)
            {
                self.btn_title_gold.loadTexture("image_gold_normal.png", ccui.Widget.PLIST_TEXTURE);
                self.btn_title_standings.loadTexture("image_standings_press.png", ccui.Widget.PLIST_TEXTURE);
                self.Image_label_bg.setPositionX(self.btn_title_standings.getPositionX());

                self.scrollView_rank_gold.setVisible(false);
                self.scrollView_rank_standings.setVisible(true);

                self.text_title_2.setString("单日赚取金币");
                self.changeMyRank(1);

                if(self.scrollView_rank_standings.getChildrenCount() > 0)
                {
                    self.text_rank_tips.setVisible(false);
                }
                else
                {
                    self.text_rank_tips.setVisible(true);
                }
            }
        });


        this.btn_title_gold.loadTexture("image_gold_press.png",ccui.Widget.PLIST_TEXTURE);
        this.btn_title_standings.loadTexture("image_standings_normal.png", ccui.Widget.PLIST_TEXTURE);
        this.Image_label_bg.setPositionX(this.btn_title_gold.getPositionX());
        this.text_title_2.setString("持有金币总额");

        this.scrollView_rank_gold.setVisible(true);
        this.scrollView_rank_standings.setVisible(false);

    },

    //刷新数据
    refreshViewByData:function(rankdata)
    {
        lm.log("yyp refreshViewByData: " + JSON.stringify(rankdata));

        if(rankdata != null && rankdata != undefined)
        {
            var fortunedata = rankdata["fortunelist"];//金币榜
            this.scrollView_rank_gold.setInnerContainerSize(cc.size(this.scrollView_rank_gold.getInnerContainerSize().width, 70 * fortunedata.length + 5));
            for(var i = 0; i < fortunedata.length; i++)
            {
                this.setRankItem(this.scrollView_rank_gold, i, fortunedata[i]);
                if(fortunedata[i]["userid"] == userInfo.globalUserdData["dwUserID"])
                {
                    this.my_rank_gold = i;
                }
            }


            var recorddata = rankdata["recordlist"];//每日赚金榜
            this.scrollView_rank_standings.setInnerContainerSize(cc.size(this.scrollView_rank_standings.getInnerContainerSize().width, 70 * recorddata.length + 5));
            for(var i = 0; i < recorddata.length; i++)
            {
                this.setRankItem(this.scrollView_rank_standings, i, recorddata[i]);
                if(recorddata[i]["userid"] == userInfo.globalUserdData["dwUserID"])
                {
                    this.my_standings_gold = i;
                }
            }
        }


        if(this.scrollView_rank_gold.getChildrenCount() > 0)
        {
            this.text_rank_tips.setVisible(false);
        }
        else
        {
            this.text_rank_tips.setVisible(true);
        }

    },

    //刷新自己的排行数据
    changeMyRank:function(rankId)
    {
        var index;
        if(rankId == 0) //金币总榜
        {
            index = this.my_rank_gold;
        }
        else if(rankId == 1) //每日赚金榜
        {
            index = this.my_standings_gold;
        }

        this.text_my_rank  = ccui.helper.seekWidgetByName(this.parentView, "text_my_rank");
        this.Image_my_rank  = ccui.helper.seekWidgetByName(this.parentView, "Image_my_rank");
        this.my_rank_gold = -1;      //未入榜
        this.my_standings_gold = -1; //未入榜

        if(index == -1)
        {
            this.text_my_rank.setString("未入榜");

            this.Image_my_rank.setVisible(false);
            this.text_my_rank.setVisible(true);
        }
        else if(index < 3)
        {
            var id = index + 1;
            this.Image_my_rank.loadTexture("image_rankScene_" + id + ".png", ccui.Widget.PLIST_TEXTURE);

            this.Image_my_rank.setVisible(true);
            this.text_my_rank.setVisible(false);
        }
        else
        {
            this.text_my_rank.setString(index + 1);

            this.Image_my_rank.setVisible(false);
            this.text_my_rank.setVisible(true);
        }
    },

    //设置排行数据
    setRankItem:function(scrollView, index, rankdata)
    {
        var scrollItem = this.defaultItem.clone();
        scrollItem.setPositionY(-70 * index + scrollView.getInnerContainerSize().height - scrollItem.getContentSize().height/2 - 40);
        scrollView.addChild(scrollItem);

        //排名信息
        var Image_ranksubitem_first = ccui.helper.seekWidgetByName(scrollItem, "Image_ranksubitem_first");
        var fnt_ranksubitem_first = ccui.helper.seekWidgetByName(scrollItem, "fnt_ranksubitem_first");
        if(index < 3)
        {
            var id = index + 1;
            Image_ranksubitem_first.loadTexture("image_rankScene_" + id + ".png", ccui.Widget.PLIST_TEXTURE);

            Image_ranksubitem_first.setVisible(true);
            fnt_ranksubitem_first.setVisible(false);
        }
        else
        {
            fnt_ranksubitem_first.setString(index + 1);

            Image_ranksubitem_first.setVisible(false);
            fnt_ranksubitem_first.setVisible(true);
        }

        //头像
        var Image_ranksubitem_header = ccui.helper.seekWidgetByName(scrollItem, "Image_ranksubitem_header");
        var name,faceid = Number(rankdata["faceid"]);


        var name="";
        if(faceid == 0 || faceid == null || faceid > 10 || faceid < 1)
        {
            name =  "system_head_default.png";
        }else
        {
            name = "system_head_" + faceid + ".png";
        }
        Image_ranksubitem_header.loadTexture(name,ccui.Widget.PLIST_TEXTURE);

        //昵称
        var text_ranksubitem_name = ccui.helper.seekWidgetByName(scrollItem, "text_ranksubitem_name");
        text_ranksubitem_name.setString(rankdata["nickname"]);

        //金币或战绩
        var text_ranksubitem_score = ccui.helper.seekWidgetByName(scrollItem, "text_ranksubitem_score");
        text_ranksubitem_score.setString(rankdata["gload"]);

    }


});