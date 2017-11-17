var Player = function(name,roomId,pos,isRobot)
{
	this.userId = 0;
	this.namee = name;
	this.roomId = roomId;
	this.pos = pos;//0:left,1:top,2:right
	this.passworld = "";
	this.cards = [],
	this.onLinee = true;//在线
	this.isRoom = false;
	this.isReady = false;
	this.isDizhu = false;
	this.isRobot = isRobot;
	if(isRobot)
	{
		this.isReady = true;
	}
}

exports.route = Player;