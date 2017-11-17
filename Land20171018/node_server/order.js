var Order = 
{
	port:1314,
	connection:'connection',
	disconnect:'disconnect',
	connected:'connected',
	unLine:'unLine',
	leaveRoom:'leaveRoom',
	login:'login',
	roomInfo:'roomInfo',
	ready:'ready',
	launchCard:'launchCard',
	first:'first',
	jiao:'jiao',
	qiang:'qiang',
	jFinish:'jFinish',
	dizhuCard:'dizhuCard',
	start:'start',
	sendcard:'sendcard',
	errorr:'errorr',
	gameover:'gameover',
}

exports.route = Order;
exports.getName = function()
{
	var name = ['王昭君','安琪拉','鲁班七号','亚瑟','关于','马可菠萝','狄仁杰','张飞','刘备','项羽','孙尚香','妲己','貂蝉','宫本武藏','后裔','周瑜'];
	var ran = Math.floor(Math.random()*name.length);
	return name[ran];
};