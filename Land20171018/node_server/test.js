var GameLogic = require('./gamelogic');
var list = GameLogic.route.m_cbCardListData;
var data = list.slice(0,13);
var arr = list;
var len = list.length;
for(var i = len - 1; i > 0; i--)
{
    var a = Math.floor(Math.random()*len)
    var temp = arr[i];
    arr[i] = arr[a];
    arr[a] =  temp;
}
// console.log(arr);
arr.sort(function(a,b){return a-b;});
// console.log(arr);
var count = 0;
var mm = setInterval(function()
{
	if(count == 3)
	{
		clearInterval(mm);
	}
	console.log(count);
	count++
},1000);