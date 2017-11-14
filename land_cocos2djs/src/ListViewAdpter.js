/**
 * Created by hanhu on 15/8/3.
 */
var ArrowAdpter = function(target, buttonUp, buttonDown, listView)
{
    var MoveUp = cc.MoveBy(0.6, cc.p(0, 20));
    var MoveDown = cc.MoveBy(0.6, cc.p(0, -20));
    var MoveUp2 = cc.MoveBy(0.6, cc.p(0, 20));
    var MoveDown2 = cc.MoveBy(0.6, cc.p(0, -20));
    var action1 =  new cc.Sequence(MoveUp, MoveDown).repeatForever();
    var action2 =  new cc.Sequence(MoveDown2, MoveUp2).repeatForever();
    buttonUp.stopAllActions();
    buttonUp.runAction(action1);
    buttonDown.stopAllActions();
    buttonDown.runAction(action2);
    buttonUp.setVisible(false);
    lm.log("ContentSize = " + listView.getContentSize().height + " innerSize = " + listView.getInnerContainerSize().height);

    listView.addTouchEventListener(function(sender, event)
    {
        //lm.log("监听滑动事件");
        //lm.log("ContentSize = " + listView.getContentSize().height + " innerSize = " + listView.getInnerContainerSize().height);
        //if(event == ccui.Widget.TOUCH_ENDED)
       //{
            var r_height = listView.getContentSize().height;
            var c_height = listView.getInnerContainerSize().height;
            lm.log("r_height = " + r_height + " c_height = " + c_height);
            var MinY = r_height - c_height;
            var h = -MinY;
            lm.log("curPos = " + listView.getInnerContainer().getPosition().y);
            var currentPercent = (listView.getInnerContainer().getPosition().y - MinY) / h * 100;
            lm.log("Current percent = " + currentPercent);
            if(currentPercent <= 0)
            {
                buttonUp.setVisible(false);
                buttonDown.setVisible(true);
            }
            else if(currentPercent >= 100)
            {
                buttonUp.setVisible(true);
                buttonDown.setVisible(false);
            }
            else
            {
                buttonUp.setVisible(true);
                buttonDown.setVisible(true);
            }
            if(r_height >= c_height)//显示内容小于容积
            {
                buttonUp.setVisible(false);
                buttonDown.setVisible(false);
            }
        //}
    }, target);


}