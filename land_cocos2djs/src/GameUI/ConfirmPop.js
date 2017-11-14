/**
 * Created by yangyupeng on 16/4/13.
 */

var Poptype =
{
    yesno : 0,  // 两个按钮
    ok : 1      // 一个按钮
}
//游戏内用到的所有小弹窗
var ConfirmPop = cc.Layer.extend({
    ctor: function (target, popType, tiptext)
    {
        var self = this;
        this._super();
        this._poptype = popType;

        this.parentView = ccs.load("res/landlord/cocosOut/ConfirmPop.json").node;
        this.addChild(this.parentView);
        this.parentView.ignoreAnchorPointForPosition(false);
        this.parentView.setAnchorPoint(0.5,0.5);
        var winSize = cc.director.getWinSize();
        this.parentView.setPosition(winSize.width/2,winSize.height/2);

        //提示文字
        var text_ttips = ccui.helper.seekWidgetByName(this.parentView,"text_ttips");
        text_ttips.setString(tiptext);

        var btn_tips_yes = ccui.helper.seekWidgetByName(this.parentView,"btn_tips_yes");
        var btn_tips_no = ccui.helper.seekWidgetByName(this.parentView,"btn_tips_no");
        var btn_tips_ok = ccui.helper.seekWidgetByName(this.parentView,"btn_tips_ok");
        var btn_close = ccui.helper.seekWidgetByName(this.parentView,"btn_close");

        if(this._poptype == Poptype.yesno)
        {
            btn_tips_yes.setVisible(true);
            btn_tips_no.setVisible(true);
            btn_tips_ok.setVisible(false);
        }
        else if(this._poptype == Poptype.ok)
        {
            btn_tips_yes.setVisible(false);
            btn_tips_no.setVisible(false);
            btn_tips_ok.setVisible(true);
        }

        // ok按钮
        btn_tips_ok.setPressedActionEnabled(true);
        btn_tips_ok.addTouchEventListener(function (sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                self.removeFromParent();
                if(this._poptype == Poptype.ok && self._okCallback)
                {
                    self._okCallback.call(target);
                }
            }

        }, this);

        // yes按钮
        btn_tips_yes.setPressedActionEnabled(true);
        btn_tips_yes.addTouchEventListener(function (sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                self.removeFromParent();
                if(this._poptype == Poptype.yesno && self._yesCallback)
                {
                    self._yesCallback.call(target);
                }
            }

        }, this);

        // no按钮
        btn_tips_no.setPressedActionEnabled(true);
        btn_tips_no.addTouchEventListener(function (sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                self.removeFromParent();
                if(this._poptype == Poptype.yesno && self._noCallback)
                {
                    self._noCallback.call(target);
                }
            }

        }, this);

        // close按钮
        btn_close.setPressedActionEnabled(true);
        btn_close.addTouchEventListener(function (sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                self.removeFromParent();
                if(self._closeCallback)
                {
                    self._closeCallback.call(target);
                }
            }

        }, this);


        //如果存在wait窗口 关掉
        var runningScene = cc.director.getRunningScene();
        var oldlayer = runningScene.getChildByTag(TIP_TAG);
        if(oldlayer != null)
            oldlayer.removeFromParent();


        this.initAndroidBackKey();
    },

    initAndroidBackKey:function()
    {
        if(GetDeviceType() != DeviceType.ANDROID)
            return;

        var self = this;
        this.addChild(new AndroidBackKey(function()
        {
            var btn_close = ccui.helper.seekWidgetByName(self.parentView, "btn_close");
            if(btn_close.isVisible())
            {
                self.removeFromParent();
                if(self._closeCallback)
                {
                    self._closeCallback.call(target);
                }
            }

        },this));
    },

    setYesNoCallback: function(yesCallback,noCallback,closeCallback)
    {
        this._yesCallback = yesCallback;
        this._noCallback = noCallback;
        this._closeCallback = closeCallback;
    },

    setokCallback: function(okCallback,closeCallback)
    {
        this._okCallback = okCallback;
        this._closeCallback = closeCallback;
    },

    addToNode:function(node)
    {
        var winSize = cc.director.getWinSize();
        node.addChild(this, 9999);
        this.ignoreAnchorPointForPosition(false);
        this.setAnchorPoint(0.5,0.5);
        this.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
    },

    hideCloseBtn:function()
    {
        var btn_close = ccui.helper.seekWidgetByName(this.parentView,"btn_close");
        btn_close.setVisible(false);
        btn_close.setTouchEnabled(false);
    }


});