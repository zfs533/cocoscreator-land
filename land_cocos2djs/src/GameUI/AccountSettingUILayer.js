/**
 * Created by yangyupeng on 16/4/2.
 */

var AccountSettingUILayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        this.initAccountSettingUILayer();
        this.initAndroidBackKey();

    },

    //安卓back按钮
    initAndroidBackKey:function()
    {
        if(GetDeviceType() != DeviceType.ANDROID)
            return;

        var self = this;
        this.addChild(new AndroidBackKey(function(){
            var curLayer = new SystemOptionUILayer();
            curLayer.setTag(ClientModuleType.SysOption);
            layerManager.repalceLayer(curLayer);
            DataUtil.SetGoToModule(ClientModuleType.Plaza);

        },this));
    },

    initAccountSettingUILayer: function ()
    {
        cc.spriteFrameCache.addSpriteFrames("res/landlord/cocosOut/setting/setting.plist");

        var self = this;

        lm.log("yyp : AccountSettingUILayer : initAccountSettingUILayer start");

        this.parentView = ccs.load("res/landlord/cocosOut/AccountSetting.json").node;
        this.addChild(this.parentView);
        this.parentView.ignoreAnchorPointForPosition(false);
        this.parentView.setAnchorPoint(0.5,0.5);
        this.parentView.setPosition(winSize.width/2,winSize.height/2);

        this.origin = cc.p((winSize.width - this.parentView.getContentSize().width)/2, (winSize.height - this.parentView.getContentSize().height)/2);
        this.Image_label_bg = ccui.helper.seekWidgetByName(this.parentView, "Image_label_bg");          //label
        this.Image_label_bg.setPositionX(this.Image_label_bg.getPositionX() + this.origin.x);

        //返回设置界面
        this.btn_back = ccui.helper.seekWidgetByName(this.parentView, "btn_back");
        this.btn_back.setPositionX(this.btn_back.getPositionX() - this.origin.x);
        this.btn_back.setTouchEnabled(true);
        this.btn_back.setPressedActionEnabled(true);
        this.btn_back.addTouchEventListener(function (sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                lm.log("yyp : AccountSettingUILayer : btn_back click! ");
                var curLayer = new SystemOptionUILayer();
                curLayer.setTag(ClientModuleType.SysOption);
                layerManager.repalceLayer(curLayer);
                DataUtil.SetGoToModule(ClientModuleType.Plaza);
            }
        }, this);

        //进入账号切换界面
        this.account_switch = ccui.helper.seekWidgetByName(this.parentView, "account_switch");
        this.account_switch.setTouchEnabled(true);
        //this.account_switch.setPressedActionEnabled(true);
        this.account_switch.addTouchEventListener(function (sender, type)
        {if (type == ccui.Widget.TOUCH_ENDED)
        {
            var curLayer = new AccountSwitchUILayer();
            layerManager.repalceLayer(curLayer);
        }

        }, this);


        //进入账号升级界面
        this.account_upgrade = ccui.helper.seekWidgetByName(this.parentView, "account_upgrade");
        this.account_upgrade.setTouchEnabled(true);
        this.account_upgrade.setPressedActionEnabled(true);
        this.account_upgrade.addTouchEventListener(function (sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                var curLayer = new AccountUpgradeUILayer();
                layerManager.repalceLayer(curLayer);
            }
        }, this);


    }

});
