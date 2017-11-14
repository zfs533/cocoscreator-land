var Item = function(socket,player)
{
	this.socket = socket;
	this.player = player;
	this.roomId = player.roomId;
	this.pos = player.pos;
	this.updatePlayerPos = function(pos)
	{
		this.pos = pos;
		this.player.pos = pos;
	}.bind(this);
	this.updatePlayerReadyState = function(isReady)
	{
		this.player.isReady = isReady;
	}.bind(this);
}
exports.route = Item;