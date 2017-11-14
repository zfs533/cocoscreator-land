/**
 * Created by lizhongqiang on 15/5/27.
 */



 // 修改原start UI 为 通用等待提示UI
var WaitUILayer = rootLayer.extend({
    ctor: function (info,timeoutcallback,target, waitTime)
    {
        this._super();
        this.waitTag = true;
        this.parentView = ccs.load("res/landlord/cocosOut/WaitUILayer.json").node;
        this.parentView.setPosition((winSize.width-960)/2,0);
        this.addChild(this.parentView, 999);

        var  Image_wait_animation = ccui.helper.seekWidgetByName(this.parentView, "Image_wait_animation");
        Image_wait_animation.setVisible(true);

        //一个旋转的Action，2秒转一圈
        var actionBy = cc.RotateBy.create(3, 360);
        //重复运行Action，不断的转圈
        Image_wait_animation.runAction(cc.RepeatForever.create(actionBy));


        var text_wait_info = ccui.helper.seekWidgetByName(this.parentView, "text_wait_info");
        text_wait_info.setString(info);

        this.setDarkBg();

        var self = this;

        var time = 35;
        if(waitTime != undefined && waitTime != null)
        {
            time = waitTime;
        }
        //启动定时器
        this.scheduleOnce(function ()
        {
            self.removeFromParent();
            if(timeoutcallback)
            {
                timeoutcallback.call(target);
            }

        },time,"autoclose");

        setTouchListener(this, true, this.onTouchBegan, this.onTouchMoved, this.onTouchEnded);

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
    }

});