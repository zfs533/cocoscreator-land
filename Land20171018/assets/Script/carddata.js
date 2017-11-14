var CardData = cc.Class(
{
    cardAtlas:null,
    ctor: function () 
    {

    },
    loadSpriteAtals:function(callback)
    {
        cc.loader.loadRes('texture/card',cc.SpriteAtlas,(err,atlas) => {
            this.cardAtlas = atlas;
            if(callback)
            {
                callback();
            }
        });
        cc.loader.loadRes('texture/newDesk',cc.SpriteAtlas,(err,atlas) => {
            this.deskAtlas = atlas;
        });
    }
});
var cd = cd || new CardData();
module.exports = cd;