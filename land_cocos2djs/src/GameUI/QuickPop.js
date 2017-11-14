/**
 * Created by yangyupeng on 16/5/14.
 */

//快速充值弹窗（roomId 1 2 3 4 /新初中高）
var QuickPop = cc.Layer.extend({
    ctor: function (target, roomId, tiptext)
    {
        var self = this;
        this._super();
        this._roomId = roomId;

        this.parentView = ccs.load("res/landlord/cocosOut/QuickPop.json").node;
        this.addChild(this.parentView);
        this.parentView.ignoreAnchorPointForPosition(false);
        this.parentView.setAnchorPoint(0.5,0.5);
        var winSize = cc.director.getWinSize();
        this.parentView.setPosition(winSize.width/2,winSize.height/2);

        this.initWithRoomId();

        //提示文字
        if(tiptext)
        {
            var text_ttips = ccui.helper.seekWidgetByName(this.parentView,"text_ttips");
            text_ttips.setString(tiptext);
        }

        var btn_tips_ok = ccui.helper.seekWidgetByName(this.parentView,"btn_tips_ok");
        var btn_close = ccui.helper.seekWidgetByName(this.parentView,"btn_close");

        // ok按钮
        btn_tips_ok.setPressedActionEnabled(true);
        btn_tips_ok.addTouchEventListener(function (sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                lm.log("QuickPop btn_tips_ok " + self._roomId);
                quickPay(self._roomId);
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

    initWithRoomId:function()
    {
        var Image_glodIcon = ccui.helper.seekWidgetByName(this.parentView,"Image_glodIcon");
        var text_money = ccui.helper.seekWidgetByName(this.parentView,"text_money");
        var text_gold = ccui.helper.seekWidgetByName(this.parentView,"text_gold");

        switch (this._roomId)
        {
            case 1:
            {
                text_money.setString( "￥6" );
                text_gold.setString( "150000金币" );
            }
                break;
            case 2:
            {
                text_money.setString( "￥6" );
                text_gold.setString( "150000金币" );
            }
                break;
            case 3:
            {
                text_money.setString( "￥30" );
                text_gold.setString( "750000金币" );
            }
                break;
            case 4:
            {
                text_money.setString( "￥30" );
                text_gold.setString( "750000金币" );
            }
                break;
            default :
                break;
        }

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