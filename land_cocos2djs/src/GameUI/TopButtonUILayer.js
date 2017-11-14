/**
 * Created by lizhongqiang on 15/6/1.
 */

var TopButtonUILayer = rootLayer.extend({
    ctor: function () {
        this._super();
        this.initLayer();
    },
    initLayer: function () {

        this.parentView = ccs.load("res/cocosOut/TopButtonLayer.json").node;
        this.addChild(this.parentView);


        // 时间文本
        SetCurTime("13:13");

        // 电量进度条
        SetCurElectricity(95);

        // 签到按钮
        var btn_toppanel_checkin = ccui.helper.seekWidgetByName(this.parentView,"btn_toppanel_checkin");
        btn_toppanel_checkin.setTitleText(btnname);

        btn_toppanel_checkin.addTouchEventListener(function (sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                lm.log(" btn_toppanel_checkin button clicked");

            }

        }, this);

        // 设置按钮
        var btn_toppanel_option = ccui.helper.seekWidgetByName(this.parentView,"btn_toppanel_option");
        btn_toppanel_option.setTitleText(btnname);

        btn_toppanel_option.addTouchEventListener(function (sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                lm.log(" btn_toppanel_option button clicked");

            }

        }, this);

        // 邮件按钮
        var btn_toppanel_email = ccui.helper.seekWidgetByName(this.parentView,"btn_toppanel_email");
        btn_toppanel_email.setTitleText(btnname);

        btn_toppanel_email.addTouchEventListener(function (sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                lm.log(" btn_toppanel_email button clicked");

            }

        }, this);


    },
    /**
     * 设置电量
     * @method SetCurElectricity
     * @param {number} arg0
     */
    SetCurElectricity: function (percent)
    {
        var oadingbar_topanel_electricity = ccui.helper.seekWidgetByName(this.parentView,"oadingbar_topanel_electricity");
        oadingbar_topanel_electricity.setPercent(95);
    },
    /**
     * 设置时间
     * @method SetProcessValue
     * @param {string} arg0
     */
    SetCurTime: function (time)
    {
        var text_toppanel_time = ccui.helper.seekWidgetByName(this.parentView,"text_toppanel_time");
        text_toppanel_time.setString(time);
    }



});
