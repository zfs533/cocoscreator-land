var Order = require('order');
var HandMessage = cc.Class(
{
    socket:null,
    ctor:function()
    {

    },
    addMessageListener:function(socket)
    {
        this.socket = socket;
        
    }
});
var msg = msg || new HandMessage();
module.exports = msg;