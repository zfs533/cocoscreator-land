/**
 * Created by zfs on 16/6/8.
 */
var DragonAnimation_GameID_122 = cc.Layer.extend(
{
    ctor:function(score)
    {
        this._super();
        this.zinit(score);
        this.score = score;
        var that = this;
        this.scheduleOnce(function()
        {
            that.removeFromParent();
        }, 2.6);

    },
    zinit:function(score)
    {
        this.ui = ccs.load("res/smartGame/animation.json").node;
        this.addChild(this.ui,100);
        this.loseTxt = ccui.helper.seekWidgetByName(this.ui, "lose_number");
        this.winTxt  = ccui.helper.seekWidgetByName(this.ui, "win_number");
        ccui.helper.seekWidgetByName(this.ui, "lose").visible = false;
        ccui.helper.seekWidgetByName(this.ui, "win").visible  = false;
        this.winBtn   = ccui.helper.seekWidgetByName(this.ui, "Button_1");
        this.loseBtn  = ccui.helper.seekWidgetByName(this.ui, "Button_1_3");
        this.winBtn.addTouchEventListener(this.winBtnEvent, this);
        this.loseBtn.addTouchEventListener(this.loseBtnEvent, this);

        if ( score > 0 )
        {
            this.playWinAnimation();
            this.winTxt.setString("+"+score);
        }
        else if ( score < 0 )
        {
            this.playLosAnimation();
            this.loseTxt.setString(score);
        }
    },
    winBtnEvent:function(target, state)
    {
      if ( state == ccui.Widget.TOUCH_ENDED )
      {
          lm.log("winBtnEvent---------------------------------------------------");
      }
    },
    loseBtnEvent:function(target, state)
    {
        if ( state == ccui.Widget.TOUCH_ENDED )
        {
            lm.log("loseBtnEvent---------------------------------------------------");
        }
    },
    playWinAnimation:function()
    {
        DragonMusic_GameId_122.playWinEndEffct();
        ccui.helper.seekWidgetByName(this.ui, "lose").visible = false;
        ccui.helper.seekWidgetByName(this.ui, "win").visible  = true;
        this.playAnimation();

        var goldA = ccs.load("res/smartGame/Anim_CoinDrop.json").node;
        goldA.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.addChild(goldA, 200);
        var winAction = ccs.load("res/smartGame/Anim_CoinDrop.json").action;

        goldA.runAction(winAction);
        winAction.gotoFrameAndPlay(0, 170, 0, false);
    },
    playLosAnimation:function()
    {
        DragonMusic_GameId_122.playloseEndEffct();
        ccui.helper.seekWidgetByName(this.ui, "lose").visible = true;
        ccui.helper.seekWidgetByName(this.ui, "win").visible  = false;
        this.playAnimation();
    },
    playAnimation:function()
    {
        var action = ccs.load("res/smartGame/animation.json").action;
        this.ui.runAction(action);
        action.gotoFrameAndPlay(0, 150, 0, false);
    }
});

/*
 *播放龙虎和赢动画
 */
DragonAnimation_GameID_122.playDragonAnimation = function()
{
    var parentUi = dragonFight_GameID_122.ui;
    parentUi.stopAllActions();
    var action = ccs.load("res/smartGame/DvsT.json").action;
    parentUi.runAction(action);
    action.gotoFrameAndPlay(0, 150, 0, false);
}

/*
 *播放筹码选中动画  choumaxuanzhong
 */
DragonAnimation_GameID_122.playDragonChouMaAnimation = function(parent)
{
    dragonFight_GameID_122.hideResultUI();
    var parentUi = dragonFight_GameID_122.ui;
    var action = ccs.load("res/smartGame/DvsT.json").action;
    parentUi.runAction(action);
    action.gotoFrameAndPlay(0, 480, 0, true);
    var node = ccui.helper.seekWidgetByName(parentUi, "choumaxuanzhong");
    if ( parent )
    {
        node.visible = true;
        node.setPosition(parent.getWorldPosition());
    }

}














