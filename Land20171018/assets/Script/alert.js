var Alert = cc.Class(
{
    ctor:function()
    {
        this.size = cc.director.getWinSize();
    },
    show:function(info)
    {
        let Hgap = 100;
        let node = new cc.Node();
        node.setPosition(this.size.width/2,this.size.height/2-Hgap);
        let scene = cc.director.getScene();
        scene.addChild(node);
        node.addComponent(cc.Label);
        node.getComponent(cc.Label).string = info;
        node.opacity = 0;
        
        let fadeIn = cc.fadeIn(1);
        let moveBy = cc.moveBy(1,0,Hgap);
        let spawn = cc.spawn(fadeIn,moveBy);
        let delay = cc.delayTime(1.5);
        let fadeOut = cc.fadeOut(1);
        let moveBy2 = cc.moveBy(1,0,Hgap);
        let spawn2 = cc.spawn(fadeOut,moveBy2);
        let callfunc = cc.callFunc((target) => 
        {
            target.distroy();
        });
        let sequence = cc.sequence(spawn,delay,spawn2);
        node.runAction(sequence);
    }
});
let alert = alert || new Alert();
module.exports = alert;