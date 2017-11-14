/**
 * Created by hanhu on 15/10/12.
 */

var LogManager = cc.Class.extend({
    _logData : new Array(),
    ctor : function()
    {
        this.init();
    },
    init : function()
    {

    },
    pushLogData : function(log_mes)
    {
        this._logData.push(log_mes);
        if(this._logData.length > 100)

        {
            this._logData.splice(0, 1);
        }
    },
    log : function(log_mes)
    {
        //日志时间修改为服务器时间
        var curDate = new Date();
        var serverDate = new Date(curDate.getTime() + DataUtil.GetServerInterval());
        this.pushLogData(serverDate.toTimeString() + "::" + log_mes);
        console.log(log_mes);
    },

    logNoShow : function(log_mes) //hanhu #只保存日志内容 2016/01/06
    {
        var curDate = new Date();
        var serverDate = new Date(curDate.getTime() + DataUtil.GetServerInterval());
        this.pushLogData(serverDate.toTimeString() + "::" + log_mes);
    },

    show : function()
    {
        var self = this;
        if(this.showFlag == true) //hanhu #只创建一次日志界面 2015/01/08
        {
            return;
        }
        else
        {
            this.showFlag = true;
        }
        //创建显示层
        var winSize = cc.director.getWinSize();
        var show_scene = cc.Layer.create();
        setTouchListener(show_scene, true, function(){return true;}, function(){}, function(){return true});
        cc.director.getRunningScene().addChild(show_scene, 999);
        var show_layer = cc.LayerColor.create(cc.color(0, 0, 0, 200), winSize.width, winSize.height);
        show_scene.addChild(show_layer);

        //创建层容器
        var listView = ccui.ListView.create();
        listView.setContentSize(cc.size(winSize.width * 0.8, winSize.height * 0.8));
        listView.setInnerContainerSize(cc.size(winSize.width * 0.8, winSize.height * 0.8));
        listView.setSwallowTouches(false);

        show_layer.addChild(listView);
        listView.setAnchorPoint(cc.p(0.5, 0.5));
        listView.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
        var defultItem = ccui.Layout.create();
        defultItem.setBackGroundColor(cc.color(73, 73, 236, 255));
        defultItem.setContentSize(cc.size(800, 60));
        var defaultLabel = ccui.Text.create("", "", 15);
        //defaultLabel.setTouchEnabled(false);
        defaultLabel.setContentSize(cc.size(780, 55));
        defaultLabel.setAnchorPoint(cc.p(0, 0.5));
        defultItem.addChild(defaultLabel);
        defaultLabel.setPosition(5, 30);
        defaultLabel.setTag(100);
        listView.setItemModel(defultItem);

        //加载日志数据
        var self = this;
        var touchFlag = false; //双击事件标记
        var touchItem = null;
        for(var i = 0; i < this._logData.length; i++)
        {
            listView.pushBackDefaultItem();
            var item = listView.getItem(i);
            item.setTag(i);
            var label = item.getChildByTag(100);
            label.setString(this._logData[i]);
            //双击日志弹出详细信息
            setTouchListener(item, false, function(touch, event){
                var target = event.getCurrentTarget();
                var pos = target.convertToNodeSpace(touch.getLocation());
                var rect = cc.rect(0, 0, 800, 60);
                if(cc.rectContainsPoint(rect, pos))
                {
                    return true;
                }
                else
                {
                    return false;
                }
            },
            null,
            function(touch, event){
                var target = event.getCurrentTarget();
                var pos = target.convertToNodeSpace(touch.getLocation());
                var rect = cc.rect(0, 0, 800, 60);
                if(cc.rectContainsPoint(rect, pos))
                {
                    if(touchFlag == false)
                    {
                        touchFlag = true;
                        touchItem = target;
                    }
                    else
                    {
                        if(touchItem.getTag() == target.getTag()) //两次点击的对象一致
                        {
                            self.showLogDetail(target.getChildByTag(100).getString());
                            touchFlag = false;
                        }
                        else
                        {
                            touchItem = target;
                        }
                    }
                }
            });

        }

        //退出日志界面按钮
        var close_button = ccui.Text.create("退出日志模式", "", 30);
        show_layer.addChild(close_button);
        close_button.setPosition(cc.p(winSize.width / 2, winSize.height * 0.05));

        setTouchListener(close_button, false, function(touch, type){
            var pos = show_layer.convertToNodeSpace(touch.getLocation());
            var rect = close_button.getBoundingBox();
            if(cc.rectContainsPoint(rect, pos))
            {
                lm.log("关闭按钮被点击");
                return true;
            }
            return false;
        },
        function(){

        },
        function(touch, evnet){
            var pos = show_layer.convertToNodeSpace(touch.getLocation());
            var rect = close_button.getBoundingBox();
            if(cc.rectContainsPoint(rect, pos))
            {
                lm.log("关闭日志界面");
                self.showFlag = false;
                show_scene.removeFromParent();
                return true;
            }
            return false;
        });
        //发送日志按钮
        var self = this;
        var send_button = ccui.Text.create("发送日志", "", 30);
        show_layer.addChild(send_button);
        send_button.setPosition(cc.p(winSize.width * 0.2, winSize.height * 0.05));
        setTouchListener(send_button, false, function(touch, type){
            var pos = show_layer.convertToNodeSpace(touch.getLocation());
            var rect = send_button.getBoundingBox();
            if(cc.rectContainsPoint(rect, pos))
            {
                send_button.setScale(1.4);
                self.sendLogToServer();
            }
            return true;
        },
        null,
        function(){
            send_button.setScale(1);
        })
    },
    sendLogToServer : function()
    {
        var logData = "";
        for(var i = 0; i < this._logData.length; i++)
        {
            logData = logData + this._logData[i] + "\n";
        }
        webMsgManager.SendPostLogData(logData, function(data){
            lm.log("上传日志成功 time = " + new Date().toTimeString());
            lm.log("message = " + data["message"])
        },
        function(data){
            lm.log("上传日志失败，message=" + data["message"])
        });
    },
    addLogManagerEvent : function(scene)
    {
        var beginX = 0;
        var beginY = 0;
        setTouchListener(scene, false, function(touch){
                beginX = touch.getLocation().x;
                beginY = touch.getLocation().y;
                return true;
            },
            function(){

            },
            function(touch){
                var endX = touch.getLocation().x;
                var endY = touch.getLocation().y;
                if((endX - beginX) > 500 && (endY - beginY) > 400)
                {
                    lm.show();
                }
            });
    },
    showLogDetail : function(log_mes)
    {
        var showData = new Array();
        for(var i = 0, index = 0; i < log_mes.length; i += 60, index++)
        {
            showData[index] = log_mes.substring(i, i + 60);
        }

        //创建显示层
        var winSize = cc.director.getWinSize();
        var show_layer = cc.LayerColor.create(cc.color(0, 0, 0, 0), winSize.width, winSize.height);
        show_layer.setScale(0.2);
        cc.director.getRunningScene().addChild(show_layer, 9999);
        show_layer.runAction(cc.ScaleTo(0.5, 1));
        setTouchListener(show_layer, true, function(){return true;});

        //创建层容器
        var listView = ccui.ListView.create();
        listView.setContentSize(cc.size(winSize.width * 0.8, winSize.height * 0.8));
        listView.setInnerContainerSize(cc.size(winSize.width * 0.8, winSize.height * 0.8));
        show_layer.addChild(listView);
        listView.setAnchorPoint(cc.p(0.5, 0.5));
        listView.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
        var defultItem = ccui.Layout.create();
        defultItem.setBackGroundColor(cc.color(73, 73, 236, 255));
        defultItem.setContentSize(cc.size(800, 60));
        var defaultLabel = ccui.Text.create("", "", 15);
        defaultLabel.setContentSize(cc.size(780, 55));
        defaultLabel.setAnchorPoint(cc.p(0, 0.5));
        defultItem.addChild(defaultLabel);
        defaultLabel.setPosition(5, 30);
        defaultLabel.setTag(100);
        listView.setItemModel(defultItem);

        //加载日志数据
        for(var i = 0; i < showData.length; i++) {
            listView.pushBackDefaultItem();
            var item = listView.getItem(i);
            item.setTag(i);
            var label = item.getChildByTag(100);
            label.setString(showData[i]);
        }

        //关闭详细信息按钮
        var close_button = ccui.Text.create("关闭", "", 30);
        show_layer.addChild(close_button);
        close_button.setPosition(cc.p(winSize.width / 2, winSize.height * 0.05));

        setTouchListener(close_button, true, function(touch, type){
            var pos = show_layer.convertToNodeSpace(touch.getLocation());
            var rect = close_button.getBoundingBox();
            if(cc.rectContainsPoint(rect, pos))
            {
                return true;
            }
            return false;
        },
        null,
        function(touch, event){
            var pos = show_layer.convertToNodeSpace(touch.getLocation());
            var rect = close_button.getBoundingBox();
            if(cc.rectContainsPoint(rect, pos))
            {
                show_layer.removeFromParent();
                return true;
            }
            return false;
        });
    }

});

var setTouchListener = function(target, swallowTouches, beganFunction, moveFunction, endFunction)
{
    cc.eventManager.addListener({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: swallowTouches,
        onTouchBegan: beganFunction,
        onTouchMoved: moveFunction,
        onTouchEnded: endFunction
    }, target);
}

var lm = lm || new LogManager();