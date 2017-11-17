var Timer = 
{
	setTimeOut:function(callback,time)
	{
		return setTimeout(callback,time*1000);
	},
	setInterval:function(callback,time)
	{
		return setInterval(callback,time*1000);
	},
	clearTimeout:function(index)
	{
		clearTimeout(index);
	},
	clearInterval:function(index)
	{
		clearInterval(index);
	}
}

module.exports = Timer;