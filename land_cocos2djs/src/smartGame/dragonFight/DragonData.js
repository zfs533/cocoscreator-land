var DragonData_GameId_122 =
{
	//自定义属性
	isPlayingGame:false,
	tempScore:0,
	playerChairID:0,
	bankerTempScore:0,//庄家当局总成绩
	endData:{},//游戏结束成绩


	//公共宏定义
	GAMEID:122,//游戏id
	GAME_MAIN_ID:200,//游戏主id
	GAME_PLAYER:100,//游戏人数
	GAME_NAME:"龙虎争霸",//游戏名字
	CONFIGFILENAME:"BaccaratNewConfig.ini",//机器人配置文件名
	
	//状态定义
	GAME_SCENE_FREE:0,//等待开始
	GAME_SCENE_PLAY:100,//游戏进行
	GAME_SCENE_BET:100,//下注状态
	GAME_SCENE_END:101,//结束状态
	
	//玩家索引， 下注类型
	AREA_LONG:0,//龙
	AREA_HU:1,//虎
	AREA_PING:2,//和
	AREA_MAX:3,//最大区域
	
	//区域倍数multiple
	MULTIPLE_LONG	:1,//闲家倍数
	MULTIPLE_HU		:1,//平家倍数
	MULTIPLE_PING	:7,//庄家倍数
	
	//赔率定义
	RATE_TWO_PAIR	:12,//对子赔率
	SERVER_LEN		:32,//房间长度

	//服务器命令结构
	SUB_S_GAME_FREE				:100,//游戏空闲
	SUB_S_GAME_START			:101,//游戏开始
	SUB_S_PLACE_JETTON			:102,//用户下注
	SUB_S_GAME_END				:103,//游戏结束
	SUB_S_APPLY_BANKER			:104,//申请庄家
	SUB_S_CHANGE_BANKER			:105,//切换庄家
	SUB_S_PLACE_JETTON_FAIL		:106,//下注失败
	SUB_S_CANCEL_BANKER			:107,//取消申请
	SUB_S_SEND_APPLYLIST        :108,//发送申请列表
	SUB_S_RANKINFO              :109,//排行榜信息
	
	//客户端命令结构
	SUB_C_PLACE_JETTON			:1,//用户下注
	SUB_C_APPLY_BANKER			:2,//申请庄家
	SUB_C_CANCEL_BANKER			:3,//取消申请
	SUB_C_GET_APPLYLIST         :4,//获取申请列表
	SUB_C_GETRANK               :5//获取排行榜
	
}





