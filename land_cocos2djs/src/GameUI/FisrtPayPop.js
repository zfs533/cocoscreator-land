/**
 * Created by yangyupeng on 16/5/14.
 */

//救济金弹窗
var FisrtPayPop = cc.Layer.extend({
    ctor: function (target)
    {
        var self = this;
        this._super();

        this.parentView = ccs.load("res/landlord/cocosOut/Newplayer_pop_window.json").node;
        this.addChild(this.parentView);
        this.parentView.ignoreAnchorPointForPosition(false);
        this.parentView.setAnchorPoint(0.5,0.5);
        var winSize = cc.director.getWinSize();
        this.parentView.setPosition(winSize.width/2,winSize.height/2);

        this.initItem();

        var btn_tips_ok = ccui.helper.seekWidgetByName(this.parentView,"btn_tips_ok");
        var btn_close = ccui.helper.seekWidgetByName(this.parentView,"btn_close");

        // ok按钮
        btn_tips_ok.setPressedActionEnabled(true);
        btn_tips_ok.addTouchEventListener(function (sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                quickPay(1);

                self.removeFromParent();
                if(self._okCallback)
                {
                    self._okCallback.call(target);
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

    initItem:function()
    {
        var item_1 = ccui.helper.seekWidgetByName(this.parentView, "Image_item_1");
        var itemNum_1 = ccui.helper.seekWidgetByName(this.parentView, "Text_item_num_1");

        var item_2 = ccui.helper.seekWidgetByName(this.parentView, "Image_item_2");
        var itemNum_2 = ccui.helper.seekWidgetByName(this.parentView, "Text_item_num_2");

        var item_3 = ccui.helper.seekWidgetByName(this.parentView, "Image_item_3");
        //item_3.loadTexture("res/cocosOut/mall/31.jpg", ccui.Widget.LOCAL_TEXTURE);
        var itemNum_3 = ccui.helper.seekWidgetByName(this.parentView, "Text_item_num_3");

    },

    setCallback: function(okCallback,closeCallback)
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
    }


});