/**
 * Created by hanhu on 15/7/21.
 */
var RankLayerType =
{
    MatchRankInGame : 1,
    MatchRankInEnd : 2
};

var testRankData =
{
    "length" : 10,
    0  : {
        rankNumber : 1,
        userHead : "100.png",
        nickName : "test001",
        score : 999,
        change : 1,
        changeNum : 13,
        reward : [{"reward":"金币X999"},{"reward":"奖牌 X 100"}],
        rewardNum : 9999
    },
    1  : {
        rankNumber : 2,
        userHead : "101.png",
        nickName : "test002",
        score : 998,
        change : 1,
        changeNum : 11,
        reward : [{"reward":"金币X999"},{"reward":"奖牌 X 100"},{"reward":"门票x10"}],
        rewardNum : 9999
    },
    2  : {
        rankNumber : 3,
        userHead : "102.png",
        nickName : "test003",
        score : 997,
        change : 1,
        changeNum : 9,
        reward : [{"reward":"金币X999"},{"reward":"奖牌 X 100"},{"reward":"门票x10"}],
        rewardNum : 9999
    },
    3  : {
        rankNumber : 4,
        userHead : "103.png",
        nickName : "test004",
        score : 996,
        change : 0,
        changeNum : 1,
        reward : [{"reward":"金币X999"},{"reward":"奖牌 X 100"},{"reward":"门票x10"}],
        rewardNum : 9999
    },
    4  : {
        rankNumber : 5,
        userHead : "104.png",
        nickName : "test005",
        score : 995,
        change : 1,
        changeNum : 13,
        reward : [{"reward":"金币X999"},{"reward":"奖牌 X 100"},{"reward":"门票x10"}],
        rewardNum : 9999
    },
    5  : {
        rankNumber : 6,
        userHead : "106.png",
        nickName : "test006",
        score : 994,
        change : 1,
        changeNum : 13,
        reward : [{"reward":"金币X999"},{"reward":"奖牌 X 100"},{"reward":"门票x10"}],
        rewardNum : 9999
    },
    6  : {
        rankNumber : 7,
        userHead : "107.png",
        nickName : "test007",
        score : 993,
        change : 1,
        changeNum : 13,
        reward : [{"reward":"金币X999"},{"reward":"奖牌 X 100"},{"reward":"门票x10"}],
        rewardNum : 9999
    },
    7  : {
        rankNumber : 8,
        userHead : "108.png",
        nickName : "test008",
        score : 992,
        change : 1,
        changeNum : 13,
        reward : [{"reward":"金币X999"},{"reward":"奖牌 X 100"},{"reward":"门票x10"}],
        rewardNum : 9999
    },
    8  : {
        rankNumber : 9,
        userHead : "109.png",
        nickName : "test009",
        score : 991,
        change : 1,
        changeNum : 13,
        reward : [{"reward":"金币X999"},{"reward":"奖牌 X 100"},{"reward":"门票x10"}],
        rewardNum : 9999
    },
    9  : {
        rankNumber : 10,
        userHead : "110.png",
        nickName : "test010",
        score : 990,
        change : 1,
        changeNum : 13,
        reward : [{"reward":"金币X999"},{"reward":"奖牌 X 100"},{"reward":"门票x10"}],
        rewardNum : 9999
    }
};
var Match_Wait_Image_Tag = 10001;
var MatchRankLayer = rootLayer.extend({
    _RankView : null,
    _data : null,
    _type : 0,
    ctor : function(TitleName, type, Data, myRank, waitNum, showType)
    {
        this._super();
        this._data = Data;
        this._type = type;
        this._showType = showType;
        this.setColor(cc.color(0, 0, 0, 100));
        //加载图片资源
        cc.spriteFrameCache.addSpriteFrames("res/cocosOut/userface/userface.plist");
        cc.spriteFrameCache.addSpriteFrames("res/cocosOut/roomUILayer/room002.plist");
        cc.spriteFrameCache.addSpriteFrames("res/cocosOut/roomUILayer/room001.plist");
        this.InitMatchRankLayer(TitleName, myRank, waitNum);
    },

    InitMatchRankLayer : function(TitleName, myRank, waitNum)
    {
        var self = this;
        //lm.log("加载json文件");
        this._RankView = ccs.load("res/cocosOut/MatchRankLayer.json").node;

        var Title = ccui.helper.seekWidgetByName(this._RankView, "Title");
        Title.setAnchorPoint(cc.p(0.5, 0.5));
        Title.setString(TitleName);
        if(this._type == RankLayerType.MatchRankInGame)
        {
            this.CreateWaiteImage(waitNum);
        }
        else if(this._type == RankLayerType.MatchRankInEnd)
        {
            this.CreateEndButton();
        }

        //箭头动画
        var ArrowUp = ccui.helper.seekWidgetByName(this._RankView, "ArrowUp");
        var ArrowDown = ccui.helper.seekWidgetByName(this._RankView, "ArrowDown");
        //显示我的排名
        var MyRank = ccui.helper.seekWidgetByName(this._RankView, "MyRankNumber");
        lm.log("myRank = " + myRank);
        MyRank.setString(String(myRank));
        MyRank.x += 5;
        lm.log("myRank = " + MyRank.getString());

        //hanhu #创建透明背景层 2015/11/12
        var colorLayer = cc.LayerColor.create(cc.color(0, 0 , 0, 200));
        this.addChild(colorLayer);

        //创建滚动展示菜单
        this.CreateTableView();
        ArrowAdpter(this, ArrowUp, ArrowDown, this.listView);
        colorLayer.addChild(this._RankView);
        var size = cc.director.getWinSize();
        this._RankView.setPosition(cc.p(size.width / 2, size.height / 2));
        this._RankView.setAnchorPoint(cc.p(0.5, 0.5));

        showActionFallDown(this._RankView, 1);
    },

    CreateWaiteImage : function(waitNum)
    {
        //等待标志
        var wait = cc.Sprite.createWithSpriteFrameName("pop_tips_loading.png");
        var action = cc.repeatForever(cc.RotateBy.create(2, 360));
        wait.runAction(action);
        //背景
        var back = new cc.Scale9Sprite("btn_todo_rd_pre.png");
        back.setContentSize(cc.size(600, 60));
        back.addChild(wait);
        wait.setPosition(cc.p(30, 30));
        //描述
        var des = ccui.Text.create("还有"+waitNum+"桌用户处于游戏中，请耐心等待。。。", "Arial", 25);
        des.setAnchorPoint(cc.p(0, 0.5));
        back.addChild(des);
        des.setPosition(80, 30);
        this.addChild(back, 99);
        var size = cc.director.getWinSize();
        back.setPosition(cc.p(size.width / 2, size.height * 0.06));
        back.setTag(Match_Wait_Image_Tag);
    },
    CreateEndButton : function()
    {
        var self = this;
        var shareButton = new ccui.Button();
        shareButton.loadTextures("btn_rd_nor.png", "btn_rd_nor.png", "", ccui.Widget.PLIST_TEXTURE);
        shareButton.setScale9Enabled(true);
        shareButton.setContentSize(cc.size(240, 80));
        shareButton.setTitleText("炫耀一下");
        shareButton.setTitleFontSize(30);
        this._RankView.addChild(shareButton, 99);
        var size = this._RankView.getContentSize();
        shareButton.setPosition(cc.p(size.width * 0.25, size.height * 0.15));
        shareButton.addTouchEventListener(function(sender, type){
            if(type == ccui.Widget.TOUCH_ENDED)
            {
                //进行分享操作
                DataUtil.ShareWeiXin();
            }
        }, this);

        var continueButton = new ccui.Button();
        continueButton.loadTextures("btn_gn_pre.png", "btn_gn_pre.png", "", ccui.Widget.PLIST_TEXTURE);
        continueButton.setScale9Enabled(true);
        continueButton.setContentSize(cc.size(240, 80));
        continueButton.setTitleText("退出游戏");
        continueButton.setTitleFontSize(30);
        this._RankView.addChild(continueButton, 99);
        continueButton.setPosition(cc.p(size.width * 0.75, size.height * 0.15));
        continueButton.addTouchEventListener(function(sender, type){
            if(type == ccui.Widget.TOUCH_ENDED)
            {
                cc.director.getRunningScene().removeChild(self);

                var scene = new rootScene();
                var curLayer = new RoomUILayer();
                curLayer.setTag(ClientModuleType.MathField);
                layerManager.addLayerToParent(curLayer, scene);
                curLayer.refreshView(RoomType.ROOM_TYPE_MATCH);
                DataUtil.SetGoToModule(ClientModuleType.Plaza);
                cc.director.replaceScene(scene);

            }
        }, this)

    },

    CreateTableView : function()
    {
        //var tableView = new cc.TableView(this, cc.size(600, 270));
        //tableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        //tableView.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
        //tableView.setAnchorPoint(cc.p(0, 1));
        //var backGround = ccui.helper.seekWidgetByName(this._RankView, "backGround");
        ////lm.log("加入tableView");
        //this._RankView.addChild(tableView, 999);
        //tableView.setPosition(cc.p(backGround.getContentSize().width * 0.01, backGround.getContentSize().height * 0.25));
        //tableView.setDelegate(this);
        //tableView.reloadData();
        //tableView.setColor(cc.color(255, 0, 0, 0));
        //var upOffset = -this._data.length * 90 + 310;
        //tableView.setContentOffset(cc.p(0, upOffset));

        //var upOffset = -this._data.length * 90 + 310;
        var listView = ccui.ListView.create();
        this.listView = listView;
        listView.setContentSize(cc.size(600, 270));
        listView.setInnerContainerSize(cc.size(600, 270));
        listView.setAnchorPoint(cc.p(0.5, 0.5));
        var backGround = ccui.helper.seekWidgetByName(this._RankView, "backGround");
        this._RankView.addChild(listView, 999);
        listView.setPosition(cc.p(backGround.getContentSize().width * 0.41, backGround.getContentSize().height * 0.53));
        //listView.setContentOffset(cc.p(0, upOffset));

        var defaultItem = ccui.Layout.create();
        defaultItem.setContentSize(cc.size(600, 90));
        defaultItem.setAnchorPoint(cc.p(0, 0));
        listView.setItemModel(defaultItem);
        //defaultItem.setPosition(cc.p(5, upOffset));

        for(var i = 0; i < this._data.length; i++)
        {
            if(i > 100) //hanhu #只显示100条记录 2015/11/12
            {
                break;
            }
            listView.pushBackDefaultItem();
            var defaultBack = listView.getItem(i);
            var item = cc.Scale9Sprite("btn_rd_pre.png");
            item.setContentSize(cc.size(600, 90));
            item.setAnchorPoint(cc.p(0, 0));
            defaultBack.addChild(item, 11);

            var rankNum = ccui.Text.create(this._data[i]["rankNumber"], "Arial", 30);
            item.addChild(rankNum);
            rankNum.x = 30;
            rankNum.y = 45;
            //头像
            //lm.log("添加头像"+this._data[idx]["userHead"]);
            if(this._data[i]["userHead"] == "0.png")
            {
                this._data[i]["userHead"] = "1.png";
            }
            var head = cc.Sprite.createWithSpriteFrameName(this._data[i]["userHead"]);
            item.addChild(head);
            head.x = 80;
            head.y = 45;
            //昵称
            //lm.log("添加昵称"+this._data[idx]["nickName"]);
            var nickName = ccui.Text.create(this._data[i]["nickName"], "Arial", 30);
            item.addChild(nickName);
            if(this._type == 1)
            {
                nickName.x = 190;
                nickName.y = 45;
            }
            else if(this._type == 2)
            {
                nickName.x = 190;
                nickName.y = 60;
                nickName.setFontSize(24);
            }
            //当前积分
            //lm.log("添加当前积分"+this._data[idx]["score"]);
            var score = ccui.Text.create("当前积分：" + this._data[i]["score"], "Arial", 30);
            score.setAnchorPoint(cc.p(0, 0.5));
            item.addChild(score);
            if(this._type == 1)
            {
                score.x = 250;
                score.y = 45;
            }
            else if(this._type == 2)
            {
                score.x = 110;
                score.y = 30;
                score.setFontSize(24);
            }
            if(this._type == RankLayerType.MatchRankInGame)
            {
                //变化标签
                var pictureName = "";
                if(this._data[idx]["change"] == 0)
                {
                    pictureName = "Arrow_result_down.png";
                }
                else
                {
                    pictureName = "Arrow_result_up.png";
                }
                //lm.log("显示变化图标 "+pictureName);
                var arrow = cc.Sprite.createWithSpriteFrameName(pictureName);
                arrow.setRotation(180);
                item.addChild(arrow);
                arrow.x = 540;
                arrow.y = 45;
                //变化量
                //lm.log("显示变化量 "+this._data[idx]["changeNum"]);
                var changeNum = ccui.Text.create(this._data[i]["changeNum"], "Arial", 30);
                item.addChild(changeNum);
                changeNum.x = 570;
                changeNum.y = 45;
            }
            else if(this._type == RankLayerType.MatchRankInEnd && this._showType != 1)
            {
                //奖励标签
                var reward = this._data[i]["reward"];
                var label = ccui.Text.create("奖励：", "Arial", 30);
                label.setColor(cc.color(255, 255, 0));
                label.setAnchorPoint(cc.p(0, 0.5));
                item.addChild(label);
                label.setPosition(300, 45);
                for(var idx in reward) {
                    //lm.log("显示奖励, i=" + i);
                    //lm.log(reward[i]["reward"]);
                    var rewardLabel = cc.LabelTTF.create(reward[idx]["reward"], "Arial", 16);
                    rewardLabel.setColor(cc.color(255, 255, 0));
                    rewardLabel.setAnchorPoint(cc.p(0, 0.5));
                    item.addChild(rewardLabel);
                    var num = Number(idx);
                    if (reward.length == 1) {
                        rewardLabel.setPosition(cc.p(380, 45));
                    }
                    else if (reward.length == 2) {
                        rewardLabel.setPosition(cc.p(380, 90 - 30 * (num + 1)));
                    }
                    else if (reward.length == 3) {
                        //lm.log(num);
                        //lm.log(num + 1);
                        //lm.log(22 * (num + 1));
                        var y = 90 - 22 * (num + 1);
                        //lm.log("pos = "+ y)
                        rewardLabel.setPosition(cc.p(380, y));
                    }
                    else if(reward.length == 4)
                    {
                        var y = 90 - 18 * (num + 1);
                        rewardLabel.setPosition(cc.p(380, y));
                    }
                }
            }
        }

    },
    scrollViewDidScroll:function (view) {
        var point = view.getContentOffset();
        var upOffset = -this._data.length * 90 + 310;
        //lm.log("current offsetY = " + point.y);
        if(point.y < upOffset)
        {
            view.setContentOffset(cc.p(0, upOffset));
        }
        else if(point.y == 0)
        {
            view.setContentOffset(cc.p(0, 50));
        }
        else if(point.y == upOffset)
        {
            var ArrowUp = ccui.helper.seekWidgetByName(this._RankView, "ArrowUp");
            ArrowUp.setVisible(false);
        }
        else if(point.y == 50)
        {
            var ArrowDown = ccui.helper.seekWidgetByName(this._RankView, "ArrowDown");
            ArrowDown.setVisible(false);
        }
        else
        {
            var ArrowUp = ccui.helper.seekWidgetByName(this._RankView, "ArrowUp");
            ArrowUp.setVisible(true);
            var ArrowDown = ccui.helper.seekWidgetByName(this._RankView, "ArrowDown");
            ArrowDown.setVisible(true);
        }
    },
    scrollViewDidZoom:function (view) {
    },

    tableCellTouched:function (table, cell) {
        lm.log("cell touched at index: " + cell.getIdx());
    },
    tableCellTouched2:function () {
        lm.log("cell touched at index: ");
    },

    tableCellSizeForIndex:function (table, idx) {
        //lm.log("返回cell尺寸");
        return cc.size(600, 90);
    },

    tableCellAtIndex:function (table, idx) {
        //lm.log("增加tableCell" + idx);
        var tableCell = new cc.TableViewCell();
        //lm.log("添加背景");
        var backGround = new cc.Scale9Sprite("btn_rd_pre.png");
        backGround.setContentSize(cc.size(600, 90));
        backGround.setAnchorPoint(cc.p(0, 0.5));
        tableCell.addChild(backGround);
        //名次
        //lm.log("添加名次"+this._data[idx]["rankNumber"]);
        var rankNum = ccui.Text.create(this._data[idx]["rankNumber"], "Arial", 30);
        backGround.addChild(rankNum);
        rankNum.x = 30;
        rankNum.y = 45;
        //头像
        //lm.log("添加头像"+this._data[idx]["userHead"]);
        if(this._data[idx]["userHead"] == "0.png")
        {
            this._data[idx]["userHead"] = "1.png";
        }
        var head = cc.Sprite.createWithSpriteFrameName(this._data[idx]["userHead"]);
        backGround.addChild(head);
        head.x = 80;
        head.y = 45;
        //昵称
        //lm.log("添加昵称"+this._data[idx]["nickName"]);
        var nickName = ccui.Text.create(this._data[idx]["nickName"], "Arial", 30);
        backGround.addChild(nickName);
        if(this._type == 1)
        {
            nickName.x = 190;
            nickName.y = 45;
        }
        else if(this._type == 2)
        {
            nickName.x = 190;
            nickName.y = 60;
            nickName.setFontSize(24);
        }
        //当前积分
        //lm.log("添加当前积分"+this._data[idx]["score"]);
        var score = ccui.Text.create("当前积分：" + this._data[idx]["score"], "Arial", 30);
        score.setAnchorPoint(cc.p(0, 0.5));
        backGround.addChild(score);
        if(this._type == 1)
        {
            score.x = 250;
            score.y = 45;
        }
        else if(this._type == 2)
        {
            score.x = 110;
            score.y = 30;
            score.setFontSize(24);
        }
        if(this._type == RankLayerType.MatchRankInGame)
        {
            //变化标签
            var pictureName = "";
            if(this._data[idx]["change"] == 0)
            {
                pictureName = "Arrow_result_down.png";
            }
            else
            {
                pictureName = "Arrow_result_up.png";
            }
            //lm.log("显示变化图标 "+pictureName);
            var arrow = cc.Sprite.createWithSpriteFrameName(pictureName);
            arrow.setRotation(180);
            backGround.addChild(arrow);
            arrow.x = 540;
            arrow.y = 45;
            //变化量
            //lm.log("显示变化量 "+this._data[idx]["changeNum"]);
            var changeNum = ccui.Text.create(this._data[idx]["changeNum"], "Arial", 30);
            backGround.addChild(changeNum);
            changeNum.x = 570;
            changeNum.y = 45;
        }
        else if(this._type == RankLayerType.MatchRankInEnd && this._showType != 1)
        {
            //奖励标签
            var reward = this._data[idx]["reward"];
            var label = ccui.Text.create("奖励：", "Arial", 30);
            label.setColor(cc.color(255, 255, 0));
            label.setAnchorPoint(cc.p(0, 0.5));
            backGround.addChild(label);
            label.setPosition(380, 45);
            for(var i in reward) {
                //lm.log("显示奖励, i=" + i);
                //lm.log(reward[i]["reward"]);
                var rewardLabel = cc.LabelTTF.create(reward[i]["reward"], "Arial", 16);
                rewardLabel.setColor(cc.color(255, 255, 0));
                rewardLabel.setAnchorPoint(cc.p(0, 0.5));
                backGround.addChild(rewardLabel);
                var num = Number(i);
                if (reward.length == 1) {
                    rewardLabel.setPosition(cc.p(460, 45));
                }
                else if (reward.length == 2) {
                    rewardLabel.setPosition(cc.p(460, 90 - 30 * (num + 1)));
                }
                else if (reward.length == 3) {
                    //lm.log(num);
                    //lm.log(num + 1);
                    //lm.log(22 * (num + 1));
                    var y = 90 - 22 * (num + 1);
                    //lm.log("pos = "+ y)
                    rewardLabel.setPosition(cc.p(460, y));
                }
                else if(reward.length == 4)
                {
                    var y = 90 - 18 * (num + 1);
                    rewardLabel.setPosition(cc.p(460, y));
                }
            }
        }


        tableCell.setAnchorPoint(cc.p(0, 1));
        return tableCell;

    },

    numberOfCellsInTableView:function (table) {
        var length = this._data.length;
        //lm.log("数据长度为:" + length);
        return length;
    }

});

 showActionRotation = function(node, time)
{
    var scTime = 0.1;
    var perAgl = 360 / (time / scTime);
    var perSize = 0.5 / (time / scTime);
    var curSize = 0.5;
    var curAgl = 0;
    node.schedule(function(){
        if(curSize >= 1)
        {
            node.unschedule();
            return;
        }
        else
        {
            curAgl += perAgl;
            curSize += perSize;
            node.setRotation3D(cc.math.vec3(0, curAgl, 0));
            node.setScale(curSize);
        }
    }, scTime)
}

var showActionFallDown = function(node, time)
{
    var size = cc.director.getWinSize();
    var pos = node.getPosition();
    node.y = pos.y + size.height;
    var perY = size.height / time;
    var scTime = 0.1;
    var gravity = 10;
    var speed = gravity * scTime;
    var drop = function(){
        var curY = node.y;
        if(curY <= pos.y)
        {
            return;
        }
        else
        {
            lm.log("启用回调");
            speed += gravity * scTime;
            var fallTime = perY / speed;
            node.runAction(cc.Sequence(cc.MoveBy(fallTime, cc.p(0, -perY)), cc.CallFunc(drop, this)));
        }
    }
    node.runAction(cc.Sequence(cc.MoveBy(0.5, cc.p(0, -perY)), cc.CallFunc(drop, this)));

}