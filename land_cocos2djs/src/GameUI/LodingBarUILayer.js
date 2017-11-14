/**
 * Created by lizhongqiang on 15/5/29.
 */

var LodingBarUILayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        this.initLayer();

    },
    initLayer: function () {
        var winSize = cc.director.getVisibleSize();
        if (winSize.width / winSize.height <= 960 / 640) {
            winSize = cc.size(960, 640);
        }


        var path = "res/landlord/cocosOut/LodingBarUILayer.json";

        if (!jsb.fileUtils.isFileExist(path))
        {
            path = jsb.fileUtils.getWritablePath() + "assetManagerTest/res/landlord/cocosOut/LodingBarUILayer.json";
        }
        lm.log("path---------11 "+path);


        this.parentView = ccs.load(path).node;
        this.addChild(this.parentView);

        if (cc.director.getVisibleSize().width / cc.director.getVisibleSize().height <= 960 / 640)
        {
            this.parentView.setPositionX((winSize.width - 1136) / 2);


        }else
        {
            this.parentView.setPositionX((cc.director.getVisibleSize().width - 1136) / 2);
        }

        this.lodingbar_bg = ccui.helper.seekWidgetByName(this.parentView,"lodingbar_bg");
        this.lodingbar_bg.setVisible(false);
        this.lodingbar_bg.setOpacity(0);
        this.lodingbar = ccui.helper.seekWidgetByName(this.parentView,"lodingbar");
        this.text_lodingbar_tips = ccui.helper.seekWidgetByName(this.parentView,"text_lodingbar_tips");
    },
    /**
     * @method SetProcessValue
     * @param {float} arg0
     */
    SetProcessValue: function (percent)
    {
        this.lodingbar.setPercent(percent);
        this.text_lodingbar_tips.setString(percent + "%");
        //this.text_lodingbar_tips.setString("正在努力加载...");
    },

    ShowProgcess:function()
    {
        lm.log("yyp ShowProgcess " + this.lodingbar_bg.isVisible());
        if(!this.lodingbar_bg.isVisible())
        {
            this.lodingbar_bg.setVisible(true);
            this.lodingbar_bg.runAction(cc.fadeIn(0.5));
        }

    },

    HideProgcess:function()
    {
        lm.log("yyp HideProgcess 1 " + this.lodingbar_bg.isVisible());
        if(this.lodingbar_bg.isVisible() && this.lodingbar_bg.getOpacity() == 0)
        {
            lm.log("yyp HideProgcess 2 " + this.lodingbar_bg.isVisible());
            this.lodingbar_bg.runAction(cc.sequence(cc.fadeOut(0.5),cc.hide()));
        }

    },

    /**
     * @method GetProcessValue
     * @return {float}
     */
    GetProcessValue: function ()
    {
        this.lodingbar.getPercent();
    }

});




