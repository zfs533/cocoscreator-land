/*
 * created By zhoufangsheng 20151104
 */

var HappyRoomState =
{
    none     : -1,    //默认
    showcard :  0,    //明牌
    callLand :  1,    //叫地主
    robLand  :  2,    //抢地主
    play     :  3,    //出牌阶段
    finish   :  4     //结束
}
 
var GameData =
{
    playerInfo : [],     //玩家信息
    accessGold : 0,     //允许进入房间的金币底值
    startUser  : -1,     //游戏开始叫庄用户
    wCurrentUser : -1,   //癞子斗地主发牌结束判断该谁叫
    laiziValue  : null,    //癞子牌
    tableIndex : -1,      //桌号
    isTurnOver : false,      //一轮结束标志
    isGaming : false,      //是否在游戏中
    isCallScore : false,      //是否在叫分
    isPlayerOut : false,      //是否为玩家自己出牌
    isAutoAi : false,      //是否托管
    isReadied : false,      //是否准备
    isCallBankerState : false,      //是否叫地主状态
    isRodBankerState : false,      //是否强地主状态
    isDoubledState : false,      //是否加倍状态
    isMyDizu : false,            //是否为地主，打出的牌显示地主标志
    happyRoomState : HappyRoomState.none,      //欢乐场游戏状态
    happyRoomShowCardCount : 0,                //欢乐场发牌数
    happyRoomShowCardFlag: [0,0,0],                //欢乐场记录玩家是否明牌
    currentRommLevel: 0,    // 1 2 3 4 新初中高
    isLeftDizu : false,
    isRightDizu : false,
    isLaunchPuker: false,   //开始发牌
    isOuteredPuker : false,     //玩家是否已经出牌
    isPassedPuker : false,     //玩家是否已经放弃
    isFirstOutPuker:false,      //是否首出
    isLaiziThreeByTwo : false,  //癞子三带二可选
    isCanOutPuker    :  true, //是否可以出牌
    currentMPCountFirst   : 0,//明牌
    currentMPCountSecond   : 0,//明牌
    currentMPCountThrid   : 0,//明牌
    isLanchFirstPuker : false,
    currentCallScore : 1,//本局叫分
    currentCallScore01 : 1,//计算游戏过程中的倍数（temp）
    currentRodCount  : 1,//抢地主次数
    currentAddCount  : 1,//加倍次数
    currentMPCount   : 1,//明牌
    isGameOver : true,     //游戏是否结束
    serverTimes : "00:00",     //系统时间
    dianNiang  : 0,         //电量
    targetData : [],        //用于癞子飞机数据存储
    oTherPuker : [],      //上家玩家出牌数据
    oTherPuker01 : [],      //上家玩家出牌数据
    myChairIndex : -1       //椅子号
}

var GameData01 =
{
    tuoGuanArr:[],       //处理自动托管
    isDragOut:false      //是否可以拖动出牌，打出的判断
}

var GAME_NAME = "斗地主";//游戏名字
var LandCrazyExMainID = 200;//游戏主ID
var LandGameID =
{
    DOU_DI_ZHU:200,
    DOU_DI_ZHU_LAI_ZI:24,
    DOU_DI_ZHU_HAPPY:260,
    SLOTS_GAME:2016
}

//组件属性
var GAME_PLAYER = 3;//游戏人数
var VERSION_SERVER = "6.0.3";//程序版本
var VERSION_CLIENT = "6.0.3";//程序版本

//数目定义
var MAX_COUNT = 20;//最大数目
var FULL_COUNT = 54;//全牌数目

//逻辑数目
var NORMAL_COUNT = 17;//常规数目
var DISPLAY_COUNT = 51;//派发数目
var GOOD_CARD_COUNT = 38;//好牌数目

//数值掩码
var MASK_COLOR = 0xF0;//花色掩码
var MASK_VALUE = 0x0F;//数值掩码

//逻辑类型
var CT_ERROR = 0;//错误类型
var CT_SINGLE = 1;//单牌类型
var CT_DOUBLE = 2;//对牌类型
var CT_THREE  = 3;//三条类型
var CT_SINGLE_LINE = 4; //单连类型（顺子）
var CT_DOUBLE_LINE = 5; //对连类型（连对）
var CT_THREE_LINE  = 6; //三连类型（飞机）
var CT_THREE_TAKE_ONE = 7; //三带一单
var CT_THREE_TAKE_TWO = 8; //三带一对
var CT_FOUR_TAKE_ONE  = 9; //四带两单
var CT_FOUR_TAKE_TWO  = 10; //四带两对
var CT_BOME_CARD      = 11; //炸弹类型
var CT_MISSILE_CARD   = 12; //火箭类型

//状态定义
var LandCrazyExGameStatus =
{
    GAME_SCENE_FREE : 0,   //等待状态，等待开始
    GAME_SCENE_CALL : 100, //叫分状态
    GAME_SCENE_PLAY : 101  //游戏进行
}

/***********************命令定义****************************/
var LandCrazyExGameMsg =
{
    //服务器端操作
    SUB_S_GAME_START    : 100, //游戏开始
    SUB_S_CALL_SCORE    : 101, //用户叫分
    SUB_S_BANKER_INFO   : 102, //庄家信息
    SUB_S_OUT_CARD      : 103, //用户出牌
    SUB_S_PASS_CARD     : 104, //用户放弃
    SUB_S_GAME_CONCLUDE : 105, //游戏结束
    SUB_S_SET_BASESCORE : 106, //设置基数
    SUB_S_CHEAT_CARD    : 107, //作弊扑克
    SUB_S_ANDROID_CARD  : 108, //机器人聊天
    SUB_S_TRUSTEE       : 109, //玩家托管
    SUB_S_CONTINUE_WIN  : 110, //连胜信息

    //客户端操作
    SUB_C_CALL_SCORE    : 1,   //用户叫分
    SUB_C_OUT_CARD      : 2,   //用户出牌
    SUB_C_PASS_CARD     : 3,    //用户放弃
    SUB_C_TRUSTEE       : 4     //玩家托管
}

var PlayerStatus = {
    US_NULL: 0x00,				//没有状态
    US_FREE: 0x01,				//站立状态
    US_SIT: 0x02,				//坐下状态
    US_READY: 0x03,				//准备状态
    US_LOOKON: 0x04,			//旁观状态
    US_PLAYING: 0x05,			//游戏状态
    US_OFFLINE: 0x06			//断线状态
}


/*****************************************************************癞子斗地主*****************************************************************/
//var GAME_ID   = 24;//游戏ID
var GAME_NAME = "癞子斗地主";//游戏名称
//组件属性
var GAME_PLAYER = 3;//游戏人数
var VERSION_SERVER = "6.0.3";//程序版本
var VERSION_CLIENT = "6.0.3";//程序版本

//数目定义
var MAX_MAKE = 100; //最大组合
var MAX_COUNT = 20;//最大数目
var FULL_COUNT = 54;//全牌数目

//逻辑数目
var NORMAL_COUNT = 17;//常规数目
var DISPLAY_COUNT = 51;//派发数目
var GOOD_CARD_COUNT = 38;//好牌数目

//数值掩码
var MASK_COLOR = 0xF0;//花色掩码
var MASK_VALUE = 0x0F;//数值掩码

//逻辑类型
var CT_ERROR = 0;//错误类型
var CT_SINGLE = 1;//单牌类型
var CT_DOUBLE = 2;//对牌类型
var CT_THREE  = 3;//三条类型
var CT_SINGLE_LINE = 4; //单连类型（顺子）
var CT_DOUBLE_LINE = 5; //对连类型（连对）
var CT_THREE_LINE  = 6; //三连类型（飞机）
var CT_THREE_TAKE_ONE = 7; //三带一单
var CT_THREE_TAKE_TWO = 8; //三带一对
var CT_FOUR_TAKE_ONE  = 9; //四带两单
var CT_FOUR_TAKE_TWO  = 10; //四带两对
var CT_BOME_CARD      = 11; //炸弹类型
var CT_MISSILE_CARD   = 12; //火箭类型

var CT_RUAN_BOME      = 13; //软炸弹
var CT_LANZI_BOME     = 14; //癞子炸弹


//状态定义
var LandCrazyExGameStatusLz =
{
    GAME_SCENE_FREE : 0,   //等待状态，等待开始
    GAME_SCENE_CALL : 100, //叫地主状态
    //癞子斗地主
    GAME_SCENE_ROD  : 101,  //强地主状态
    GAME_SCEND_ADD  : 102,  //加倍状态
    GAME_SCEND_PLAY : 103 //游戏进行
}

//叫地主，强地主，加倍
var LandCrazyOrder =
{
    //叫地主
    CB_NOT_CALL : 0,//没叫
    CB_CALL_BENKER : 1, //叫地主
    CB_NO_CALL_BENKER : 2, //不叫地主
    //强地主
    CB_NOT_ROD : 0, //没抢地主
    CB_ROD_BANKER : 1, //强地主
    CB_NO_ROD_BANKER : 2, //不强地主
    CB_CAN_NO_ROD : 3, //不能强f
    //加倍信息
    CB_NOT_ADD_DOUBLE : 0, //没加倍
    CB_ADD_DOUBLE : 1, //加倍标志
    CB_NO_ADD_DOUBLE : 2 //不加倍
}

/***********************命令定义****************************/
var LandCrazyExGameMsgLz =
{
    //服务器端操作
    SUB_S_GAME_START      : 100, //游戏开始
    SUB_S_CALL_SCORE      : 101, //用户叫分
    SUB_S_CALL_BANKER     : 101, //叫地主
    SUB_S_BANKER_INFO     : 102, //庄家信息
    SUB_S_ROD_BANKER      : 103, //强地主
    SUB_S_DOUBLE          : 104, //加倍信息
    SUB_S_VALID_CARD      : 105, //用户明牌
    SUB_S_OUT_CARD        : 106, //用户出牌
    SUB_S_PASS_CARD       : 107, //用户放弃
    SUB_S_OUT_START_START : 108, //开始出牌
    SUB_S_GAME_CONCLUDE   : 109, //游戏结束
    SUB_S_SET_BASESCORE   : 110, //设置基数

    //客户端操作
    SUB_C_VALID_CARD     : 1,    //用户明牌
    SUB_C_CALL_BANKER    : 2,    //用户叫地主
    SUB_C_ROD_BANKER     : 3,    //用户强地主
    SUB_C_DOUBLE         : 4,    //用户加倍
    SUB_C_OUT_CARD       : 5,    //用户出牌
    SUB_C_PASS_CARD      : 6     //用户放弃
}

//玩家方位
var playerDirection =
{
    DOWN : 0,
    RIGHT: 2,
    LEFT : 1
}


/***********************欢乐斗****************************/
//状态定义
var LandCrazyExGameStatusHappy =
{
    GAME_SCENE_FREE : 0,   //等待状态，等待开始
    GAME_SCENE_SHOW : 100, //明牌状态
    //欢乐斗地主
    GAME_SCENE_LAND : 101, //叫分状态
    GAME_SCENE_PLAY : 102  //游戏进行
}

var LandCrazyExGameMsgHappy =
{
    //服务器端操作
    SUB_S_GAME_START         : 100, //游戏开始
    SUB_S_SHOW_CARD          : 101, //用户明牌
    SUB_S_NOTIFY_LAND        : 102, //通知玩家叫牌(叫，抢，放弃) - 欢乐
    SUB_S_NOTIFY_PLAY        : 103, //通知玩家玩游戏
    SUB_S_OUT_CARD           : 104, //用户出牌
    SUB_S_PASS_CARD          : 105, //用户放弃
    SUB_S_GAME_CONCLUDE      : 106, //游戏结束
    SUB_S_SET_BASESCORE      : 107, //设置基数
    SUB_S_CHEAT_CARD         : 108, //作弊扑克
    SUB_S_ANDROID_CHAT       : 109, //机器人聊天
    SUB_S_NOTIFY_SHOWDATA    : 110, //通知明牌数据
    SUB_S_TRUSTEE            : 111, //玩家托管
    SUB_S_CONTINUE_WIN       : 112, //连胜信息

    //客户端操作
    SUB_C_SHOW_CARD          : 1,    //用户明牌
    SUB_C_LAND               : 2,    //用户叫抢地主
    SUB_C_OUT_CARD           : 3,    //用户出牌
    SUB_C_PASS_CARD          : 4,    //用户放弃
    SUB_C_TRUSTEE            : 5,    //玩家托管
    SUB_C_SEND_CARD_FINISH   : 6     //发牌完成
}


