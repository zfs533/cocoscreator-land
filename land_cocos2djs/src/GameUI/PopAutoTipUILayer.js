/**
 * Created by lizhongqiang on 15/6/2.
 */

var DefultPopTipsTime = 3.0;


var PopAutoTipsUILayer = rootLayer.extend({
    ctor: function (tiptext,showtime, callFuc) {
        this._super();
        this.initLayer(tiptext,showtime, callFuc);
    },
    initLayer: function (tiptext,showtime, callFuc)
    {
        this.showTipInfo(tiptext,showtime);
        return;
        this.parentView = ccs.load("res/cocosOut/PopAutoTipUILayer.json").node;
        this.addChild(this.parentView);
        this.parentView.setPosition((winSize.width-960)/2,0);

        var text_autotips_info = ccui.helper.seekWidgetByName(this.parentView,"text_autotips_info");
        text_autotips_info.setString(tiptext);

        //启动定时器
        this.scheduleOnce(function ()
        {
            if(callFuc)
            {
                callFuc.call();
            }
            this.removeFromParent();

        },showtime,"autoclose");

    },
    showTipInfo:function(contents,showtime)
    {
        var sp = new cc.Sprite("res/landlord/desk031.png");
        //var sp = cc.Sprite.createWithSpriteFrameName("desk031.png");
        sp.setPosition(winSize.width/2, winSize.height/2);
        this.addChild(sp, 100);

        var content = contents
        var gap = 20, len = 25;
        var txt01 = ccui.Text.create(content.substring(0, len), "", 20);
        txt01.setSizeType(ccui.Widget.SIZE_ABSOLUTE);
        txt01.setPosition(sp.width/2, sp.height/2);
        //txt01.setColor(cc.color.YELLOW);
        sp.addChild(txt01, 1);

        if ( content.length >len )
        {
            txt01.setPosition(sp.width/2, sp.height/2+gap/2);
            var txt02 = ccui.Text.create(content.substring(len, content.length), "", 20);
            txt02.setSizeType(ccui.Widget.SIZE_ABSOLUTE);
            txt02.setPosition(sp.width/2, sp.height/2-gap+3);
            sp.addChild(txt02, 1);
        }
        /**********************************/
        sp.opacity = 0;sp.y = 200;
        txt01.setOpacity(0);
        if ( txt02 ){txt02.setOpacity(0);}
        var actionTime = 0.3;
        var delayTime = 2;
        var moveTo  = (cc.moveTo(actionTime, sp.x, winSize.height/2+50));
        var fadeIn  = cc.fadeIn(actionTime);
        var delay   = cc.delayTime(delayTime);
        var moveBy  = cc.moveBy(actionTime, 0, 40);
        var fadeOut = cc.fadeOut(actionTime);
        var spaw01  = cc.spawn(moveTo, fadeIn);
        var spaw02  = cc.spawn(moveBy, fadeOut);
        var callFunc= cc.callFunc(function(){this.removeFromParent();}, this);
        var sequnce = cc.sequence(spaw01, delay,spaw02,callFunc);
        sp.runAction(sequnce);
        txt01.runAction(cc.sequence(fadeIn.clone(), delay.clone(), fadeOut.clone()));
        if ( txt02 )
        {
            txt02.runAction(cc.sequence(fadeIn.clone(), delay.clone(), fadeOut.clone()));
        }
    }

});
