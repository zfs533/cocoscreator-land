/**
 * Created by fanxuehua on 16/4/29.
 */
/**
 * Created by yangyupeng on 16/4/2.
 */

var s_backKeyEnabled = true;
var s_keyBackClickedTime = 0;
var AndroidBackKey = cc.Layer.extend({
    ctor: function (_backKeyCallback,_target) {
        this._super();
        this.target = _target;
        this.backKeyCallback = _backKeyCallback;
        this.initAndroidBackKey();
    },


    initAndroidBackKey: function (loginType)
    {
        var self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyReleased: function(keyCode, event) {
                if (keyCode == cc.KEY.back)
                {
                    self.backKeyListener();
                }
            }}, this);

    },

    //安卓back按钮
    backKeyListener:function()
    {
        if(s_backKeyEnabled && this.target && this.backKeyCallback)
        //if(s_backKeyEnabled == true && this.target != null && this.backKeyCallback != null)
        {
            var date = new Date();
            var t = date.getTime();
            if(t - s_keyBackClickedTime > 800)
            {
                s_keyBackClickedTime = t;
                this.backKeyCallback(this.target);
            }
        }
    },

    setBackKeyEnabled:function(bEnabled)
    {
        s_backKeyEnabled = bEnabled;
    }

});
