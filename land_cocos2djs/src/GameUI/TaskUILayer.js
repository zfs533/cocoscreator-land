/**
 * Created by lizhongqiang on 15/6/12.
 */

// 任务奖励类型
var TaskRewardType =
{
    TASKREWARD_TYPE_GOLD: 1, // 金币

    TASKREWARD_TYPE_EXP: 2, // 经验值

    TASKREWARD_TYPE_MEDAL: 3, // 奖牌

    TASKREWARD_TYPE_YELLOWVIP: 4, //黄钻

    TASKREWARD_TYPE_REDVIP: 5, // 红钻

    TASKREWARD_TYPE_BLUEVIP: 6 // 蓝钻
};


var TaskUILayer = rootUILayer.extend({
    ctor: function () {
        this._super();
        this.initLayer();
    },
    initLayer: function () {

        cc.spriteFrameCache.addSpriteFrames("res/landlord/cocosOut/plaza/task/task.plist");

        this.parentView = ccs.load("res/landlord/cocosOut/TaskUILayer.json").node;
        this.addChild(this.parentView);
        //hanhu #调整任务坐标 2015/08/07
        var offset = (this.parentView.getContentSize().width * winSize.height / 640 - winSize.width) / 2;
        this.parentView.x -= offset;

        this.origin = cc.p((winSize.width - this.parentView.getContentSize().width)/2, (winSize.height - this.parentView.getContentSize().height)/2);
        this.org_pos = this.parentView.getPosition();

        //任务列表
        this.scrollView_room_Daily = ccui.helper.seekWidgetByName(this.parentView, "scrollView_room_Daily");
        this.scrollView_room_Achievement = ccui.helper.seekWidgetByName(this.parentView, "scrollView_room_Achievement");

        this.defaultItem = ccui.helper.seekWidgetByName(ccs.load("res/landlord/cocosOut/TaskItemLayer.json").node,"btn_item");
        this.defaultItem.retain();

        ////向上按钮
        //var btn_task_up = ccui.helper.seekWidgetByName(this.parentView, "btn_task_up");
        //this.btn_task_up = btn_task_up;
        //btn_task_up.setVisible(false);
        //btn_task_up.addTouchEventListener(function (sender, type) {
        //    if (type == ccui.Widget.TOUCH_ENDED) {
        //
        //        lm.log("btn btn_task_up button clicked");
        //    }
        //}, this);
        //
        ////向下按钮
        //var btn_task_down = ccui.helper.seekWidgetByName(this.parentView, "btn_task_down");
        //this.btn_task_down = btn_task_down;
        //btn_task_down.setVisible(false);
        //btn_task_down.addTouchEventListener(function (sender, type) {
        //    if (type == ccui.Widget.TOUCH_ENDED) {
        //
        //        lm.log("btn btn_task_down button clicked");
        //    }
        //}, this);


        //显示提示文字
        var text_task_tips  = ccui.helper.seekWidgetByName(this.parentView, "text_task_tips");
        this.text_task_tips = text_task_tips;
        text_task_tips.setVisible(true);

        this.initLabelBtn();

        this.refreshViewByData(roomManager.GetTaskData());

        //hanhu #调整按钮位置 2016/01/19
        //btn_task_up.y -= 30;
        //btn_task_down.y += 30;
        //
        //ArrowAdpter(this, btn_task_up, btn_task_down, this.listview_task);
        //this.ShowUserHeader(false);
        //
        //this.ShowButtomButtons(false);


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
        this.btn_title_daily = ccui.helper.seekWidgetByName(this.layer_title_label, "btn_title_daily");
        this.btn_title_achievement = ccui.helper.seekWidgetByName(this.layer_title_label, "btn_title_achievement");

        this.btn_title_daily.addTouchEventListener(function(sender, type){
            if(type == ccui.Widget.TOUCH_ENDED)
            {
                self.btn_title_daily.loadTexture("btn_daily_press.png", ccui.Widget.PLIST_TEXTURE);
                self.btn_title_achievement.loadTexture("btn_achievement_normal.png", ccui.Widget.PLIST_TEXTURE);
                self.Image_label_bg.setPositionX(self.btn_title_daily.getPositionX());

                self.scrollView_room_Daily.setVisible(true);
                self.scrollView_room_Achievement.setVisible(false);

                if(self.scrollView_room_Daily.getChildrenCount() > 0)
                {
                    self.text_task_tips.setVisible(false);
                }
                else
                {
                    self.text_task_tips.setVisible(true);
                }
            }
        });

        this.btn_title_achievement.addTouchEventListener(function(sender, type){
            if(type == ccui.Widget.TOUCH_ENDED)
            {
                self.btn_title_daily.loadTexture("btn_daily_normal.png", ccui.Widget.PLIST_TEXTURE);
                self.btn_title_achievement.loadTexture("btn_achievement_press.png", ccui.Widget.PLIST_TEXTURE);
                self.Image_label_bg.setPositionX(self.btn_title_achievement.getPositionX());

                self.scrollView_room_Daily.setVisible(false);
                self.scrollView_room_Achievement.setVisible(true);

                if(self.scrollView_room_Achievement.getChildrenCount() > 0)
                {
                    self.text_task_tips.setVisible(false);
                }
                else
                {
                    self.text_task_tips.setVisible(true);
                }
            }
        });

        self.btn_title_daily.loadTexture("btn_daily_press.png", ccui.Widget.PLIST_TEXTURE);
        self.btn_title_achievement.loadTexture("btn_achievement_normal.png", ccui.Widget.PLIST_TEXTURE);
        self.Image_label_bg.setPositionX(self.btn_title_daily.getPositionX());

        self.scrollView_room_Daily.setVisible(true);
        self.scrollView_room_Achievement.setVisible(false);

        if(self.scrollView_room_Daily.getChildrenCount() > 0)
        {
            self.text_task_tips.setVisible(false);
        }
        else
        {
            self.text_task_tips.setVisible(true);
        }

    },

    //刷新列表
    refreshViewByData: function (taskdata)
    {
        //lm.log("yyp taskdata" + JSON.stringify(taskdata));

        //设置滚动区域
        var dailyCount = 0;
        var achievementCount = 0;
        for(var i = 0; i < taskdata.length; i++)
        {
            if(taskdata[i]["tGroup"] == TaskType.DailyTask)
            {
                dailyCount = dailyCount + 1;
            }
            else if(taskdata[i]["tGroup"] == TaskType.Achievement)
            {
                achievementCount = achievementCount + 1;
            }
        }
        this.scrollView_room_Daily.setInnerContainerSize(cc.size(this.scrollView_room_Daily.getInnerContainerSize().width, 125 *dailyCount + 15));
        this.scrollView_room_Achievement.setInnerContainerSize(cc.size(this.scrollView_room_Achievement.getInnerContainerSize().width, 125 *achievementCount + 15));




        //遍历任务数据
        var dailyIndex = 0;
        var achievementIndex = 0;
        for (var key in taskdata)
        {
            var scrollItem = this.defaultItem.clone();
            if(taskdata[key]["tGroup"] == TaskType.DailyTask)
            {
                scrollItem.setPositionX(this.scrollView_room_Daily.getInnerContainerSize().width/2);
                scrollItem.setPositionY(-125 * dailyIndex + this.scrollView_room_Daily.getInnerContainerSize().height - scrollItem.getContentSize().height/2 - 15);
                this.scrollView_room_Daily.addChild(scrollItem);
                dailyIndex = dailyIndex + 1;

                lm.log("yyp scrollItem" + scrollItem.getPositionY() + this.scrollView_room_Daily.getInnerContainerSize().height + " " + scrollItem.getContentSize().height);
            }
            else if(taskdata[key]["tGroup"] == TaskType.Achievement)
            {
                scrollItem.setPositionX(this.scrollView_room_Achievement.getInnerContainerSize().width/2);
                scrollItem.setPositionY(-125 * achievementIndex + this.scrollView_room_Achievement.getInnerContainerSize().height - scrollItem.getContentSize().height/2 - 15);
                this.scrollView_room_Achievement.addChild(scrollItem);
                achievementIndex = achievementIndex + 1;
            }




            var rewards = taskdata[key]["Rewards"];
            var reward = rewards[0];


            //标题图片
            var image_item_title = ccui.helper.seekWidgetByName(scrollItem, "image_item_title")
            //奖励信息
            var text_taskitem_info = ccui.helper.seekWidgetByName(scrollItem, "text_taskitem_info");

            if(reward["rType"] == 1)    //金币
            {
                image_item_title.loadTexture("image_task_gold.png", 1);
                text_taskitem_info.setString(reward["rValue"] + "金币");
            }
            else if(reward["rType"] == 3)    //奖牌
            {
                image_item_title.loadTexture("image_task_jiangpai.png", 1);
                text_taskitem_info.setString(reward["rValue"] + "奖牌");
            }
            else if(reward["rType"] == 65601)    //话费卷
            {
                image_item_title.loadTexture("image_task_huafei.png", 1);
                text_taskitem_info.setString(reward["rValue"] + "话费劵");
            }
            else
            {
                image_item_title.loadTexture("image_task_huafei.png", 1);
                text_taskitem_info.setString(reward["rValue"] + "宝物");
                image_item_title.setScale(0.5);
                lm.log("yyp " + reward["rType"] + " " + taskdata[key]["tDesc"]);
            }

            //任务说明
            var text_taskitem_total = ccui.helper.seekWidgetByName(scrollItem, "text_taskitem_total");
            text_taskitem_total.setString(taskdata[key]["tDesc"]);

            //任务进度
            var lodingbar = ccui.helper.seekWidgetByName(scrollItem, "LoadingBar");
            lodingbar.setPercent(taskdata[key]["currentValue"] / taskdata[key]["maxValue"] * 100);

            var text_progress = ccui.helper.seekWidgetByName(scrollItem, "text_progress");
            text_progress.setString(taskdata[key]["currentValue"] + "/"+ taskdata[key]["maxValue"]);

        }



        if(this.scrollView_room_Daily.getChildrenCount() > 0)
        {
            this.text_task_tips.setVisible(false);
        }
        else
        {
            this.text_task_tips.setVisible(true);
        }

    },

    getLastListItem: function () {
        if (this.listview_task.getItems().length)
            return this.listview_task.getItems()[this.listview_task.getItems().length - 1];
    },

    // 根据任务ID， 子任务ID查找任务数据
    FindTaskData: function (taskid, targetsubid) {

        var taskdata = roomManager.GetTaskData();
        for (var key in taskdata) {
            if ((taskdata[key]["taskid"] === taskid) &&
                (taskdata[key]["targetsubid"] === targetsubid)) {
                return taskdata[key];
            }
        }
        return null;
    },

    // 根据任务ID， 子任务ID删除
    RemoveTaskData: function (taskid, targetsubid) {

        var taskdata = roomManager.GetTaskData();
        for (var i =0;i<taskdata.length;i++) {
            if ((taskdata[i]["taskid"] === taskid) &&
                (taskdata[i]["targetsubid"] === targetsubid)) {

                taskdata.slice(i,1);
                lm.log("remove  taskid:" + taskid + "targetsubid: " +  targetsubid);
                return;

            }
        }
    }

});