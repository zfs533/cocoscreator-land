//游戏类型
var KernelPlaza = 0;
var KernelGame = 1;
var KernelMatch = 2;
//当前使用的游戏类型
var KernelCurrent = 1;

// 产品版本
var PRODUCT_VER = 6;


//获取内核版本
function GET_KERNEL_VERSION()
{
    var KernelVersion;
    try
    {
        KernelVersion = getKernelVersion();

    }catch (e)
    {
        KernelVersion  = 1;
    }

    return KernelVersion;
}

function Is_LAIZI_ROOM()
{
    //cc.log("--------------------------gameid= "+Game_ID);
    return (Game_ID==LandGameID.DOU_DI_ZHU_LAI_ZI)?true:false;
}

function Is_HAPPY_ROOM()
{
    //cc.log("--------------------------gameid= "+Game_ID);
    return (Game_ID==LandGameID.DOU_DI_ZHU_HAPPY)?true:false;
}

function Is_DRAGON_ROOM()
{
    return (Game_ID==DragonData_GameId_122.GAMEID)?true:false;
}

//获取渠道ID
function GET_CHANEL_ID()
{
    var chanelid;
    try
    {
        // 兼容已发出版本渠道
        if(GetDeviceType() == DeviceType.ANDROID)
        {
            if(ChannelLabel.length == 0)
            {
                ChannelLabel = jsb.reflection.callStaticMethod(AndroidPackageName, "getCurrentChannelLabel", "()Ljava/lang/String;");
            }
            if(ChannelLabel == CHANNELLABELS.ANDROID_DEFAULT)
            {
                chanelid = jsb.reflection.callStaticMethod(AndroidPackageName, "getAndroidVersion", "()I");

            }
            else if(ChannelLabel == CHANNELLABELS.ANDROID_LJ)
            {
                chanelid = ChannelID.ANDROID_OFFICIAL;
            }
            else if(ChannelLabel == CHANNELLABELS.ANDROID_360)
            {
                chanelid =   ChanelID.ANDROID_360;
            }
            else if(ChannelLabel == CHANNELLABELS.ANDROID_BAIDU){
                chanelid = ChanelID.ANDROID_BAIDU;
            }
            else if(ChannelLabel == CHANNELLABELS.ANDROID_TELCOM)
            {
                chanelid = ChanelID.ANDROID_TELCOM;
            }
        }
        else
        {
            //这里返回的是C++头文件GameCoreHead.h 定的宏－新打包时注意更新
            chanelid  = GetChanelID();
        }

    }catch(e)
    {
        chanelid = ChanelID.IOS_APPSTORE;
    }
    return chanelid;
}


//计算版本号
function PROCESS_VERSION(cbMainVer, cbSubVer) {

    return Number((Number(cbMainVer) & 0xffff) | ((Number(cbSubVer) & 0xffff) << 16));
}

//取低位
function LOWORD(dwVersion)
{
    return Number(Number(dwVersion) & 0xffff);
}

//取高位
function HIWORD(dwVersion)
{
    return Number((Number(dwVersion) >>16 ) & 0xffff);
}


//设备类型
var DefultDeviceType = GetDeviceType();

//默认大厅版本
var VERSION_PLAZA = 2;

//手机大厅登录版本
var VERSION_MOBILE_IOS = PROCESS_VERSION(GET_KERNEL_VERSION(), VERSION_PLAZA);

// 手机游戏登录版本
var VERSION_GAME = 2;



//////////////////////////////////////////////////////////
// 更新


//默认HTTP请求地址
var FIRST_HTTPWEBURL_LIST=
{
    FIRST_URL_8633:"http://appservices.8633.com/ddz/",  // 外网HTTP通讯首地址
    FIRST_URL_127:"http://115.29.14.127:9999/ddz/",     // 127 HTTP通讯首地址
    FIRST_URL_99:"http://192.168.5.99:9999/ddz/"       // 99 HTTP通讯首地址
};

// HTTP通讯首地址
var FIRST_HTTP_WEBURL = FIRST_HTTPWEBURL_LIST.FIRST_URL_127;  // 环境切换 需要修改这里



//begin added by lizhongqiang 2015-10-10 10:22
//增加更新地址 - 血流 、 牛牛 、炸金花 一致
//HTTP通讯获取更新地址
var UPDATE_HTTPWEBURL_LIST=
{
    UPDATE_URL_8633:"http://appservices.8633.com/hall/",  // 外网
    UPDATE_URL_127:"http://115.29.14.127:9999/hall/",     // 127
    UPDATE_URL_99:"http://192.168.5.99:9999/hall/"       // 99
};
var UPDATE_HTTPWEBURL = UPDATE_HTTPWEBURL_LIST.UPDATE_URL_127;  // 环境切换 需要修改这里
// end added by lizhongqiang


//游戏大厅默认端口
var DefultPlazaLogonPort = 8300;

// 默认微信Appid
var DefultWeiXinAppID = "wx7a3f57c1e19616f6";

var DefultVersion = "1.1.1836";


///////////////////////////////////


//begin modified by lizhongqiang 2015-10-27 18:30

//切记：每提交审核的版本，不管是苹果还是android，
//此版本号必须唯一，以真实的SVN版本号；
//同时在外网数据库中需要配置该版本返回的登录地址、接口头数据为127
//防止审核通过的版本和正在审核的版本产生冲突



// 当前版本号
var DefultCurVersion = 1836;//(苹果审核版本号)
//var DefultCurVersion = 648;//(苹果审核版本号)
// var DefultCurVersion = 911;//888,911


//end modified by lizhongqiang 2015-10-27 18:30



// 登录地址列表
var LOGON_ADDRESS_LIST=
{
    IP_8633:"112.124.12.140",    // 外网、127 公用
    IP_99:"192.168.5.99",         // 内网
    IP_94:"192.168.5.94",         // 外网
    IP_12:"192.168.5.12"          //开发环境
};

//游戏大厅默认登陆地址
var DefultPlazaLogonAddress = LOGON_ADDRESS_LIST.IP_8633;  //  环境切换 需要修改这里


//begin added by lizhongqiang 20150902
// 是否提交到苹果的版本，提交版本会屏蔽部分功能
// 屏蔽的功能：
// 1.大厅主界面 - 只显示金币场 ，其他页面直接返回金币场
// 2.下方按钮：商城兑换、任务、活动
// 3.上方按钮：邮件
// 4.设置界面的推广员 信息
// 5.金币场列表去除比赛信息
var SubMitAppstoreVersion = false;


//begin added by lizhongqiang 20150910
//屏蔽比赛、更多游戏的版本
//
var DoNotMatchRoomVersion = false;

//IOS 越狱版本支付回调名称 － 手机安装有支付宝的，将通过此名称回调，因此该名称唯一；
//同时 － 在工程 info文件中的 URL Type  URL Schemes 同步填入该名称；
var AppPayCallBackName = "alisdkpayNiu";

//游戏中购买金币的ID
var DefultIdentifier="com.hbykrs.doudizhu15W";



//为兼容牛牛、赢三张，增加是否屏蔽VIP购买开关
var IsHideBuyVipInFo = true;


var  IsSecondNewVersion = true;



//IOS 越狱版本支付回调名称 － 手机安装有支付宝的，将通过此名称回调，因此该名称唯一；
//同时 － 在工程 info文件中的 URL Type  URL Schemes 同步填入该名称；
var AppPayCallBackName = "alisdkpaySparrowXL";

//是否显示美女视频的开关
var IsShowAndroidAvi = false;
//end added by lizhongqiang



//////////////////////////////////////////////////////////



//设备类型
var DeviceType=
{
    ANDROID:0x10, // android
    IOS:0x40,   // ios
    IPAD:0x80   //OS_IPAD
};

//客户端模块
var ClientModuleType=
{
    GoldField: 0 ,  // 金币场
    MathField:1,    // 比赛场
    MoreGames:2,    // 更多游戏
    Rank:3,         // 排行榜
    Task:4,         // 任务
    Mall:5,         // 商城
    Ticket:6,       // 奖品兑换
    Active:7,       // 活动
    Avi:8,          // 美女视频
    Mark:9,         // 签到
    Mail:10,         // 邮件
    SysOption:11,  // 系统设置，
    SafeBox:12,   // 保险箱
    Plaza:13       // 大厅
};

//最大重连次数限制
var ReConnectMaxCount=
{
    plaza:2,  // 大厅
    game:2,  // 游戏
    match:2  // 比赛
}


//渠道ID
var ChanelID =
{
    IOS_APPSTORE:0,      //iosAppStore 渠道
    IOS_BREAKOUT:1,     //ios越狱 渠道
    ANDROID_OFFICIAL:2, //android官方渠道 －（百度外卖 － 推广版本）
    ANDROID_360:3,      //android360渠道
    ANDROID_UNICOM:4,    //android联通渠道
    ANDROID_UNICOM4GOOPERATION:5, //android联通4G合作渠道－推广使用版本
    ANDROID_BAIDU: 6, //android 百度渠道
    ANDROID_TELCOM: 7 //android 电信渠道
}

var CHANNELLABELS =
{
    ANDROID_DEFAULT: "8633",                //proj.android_myself
    ANDROID_BAIDU_SINGLE: "baiduSingle",    //proj.android_baidusingle
    ANDROID_LJ: "lj",
    ANDROID_360: "360",                     //proj.android_lj
    ANDROID_BAIDU: "baidu",
    ANDROID_TELCOM: "telcom",               //proj.android_telcom
    ANDROID_WANGYOU: "wangyou",
    ANDROID_ANY_SDK: "anySDK",
    ANDROID_TIANYI: "tianyi"                //proj.android_ty
}


var DataUtil = {};
DataUtil.copyJson = function (json) {
    var copy;
    if (Array.isArray(json)) {
        copy = [];
        for (var key in json) {
            copy.push(DataUtil.copyJson(json[key]));
        }
    } else if (typeof(json) == "object") {
        copy = {};
        for (var attribute in json) {
            if (typeof(json[attribute]) == "object") {
                if (Array.isArray(json[attribute])) {
                    var array = [];
                    for (var key in json[attribute]) {
                        array.push(DataUtil.copyJson(json[attribute][key]));
                    }
                    copy[attribute] = array;
                } else {
                    copy[attribute] = DataUtil.copyJson(json[attribute]);
                }
            } else {
                copy[attribute] = json[attribute];
            }
        }
    } else {
        copy = json;
    }
    return copy;
}
//麻将乱序
DataUtil.preSortData = function (data) {
    for (var i = 0; i < data.length; i++) {
        var temp = data[i];
        var randomNumber = DataUtil.getRandomInt(0, data.length - 1);
        data[i] = data[randomNumber];
        data[randomNumber] = temp;
    }
}
//数组或对象置空
DataUtil.ZeroMemory = function (obj, length) {
    if (Array.isArray(obj)) {
        for (var i = 0; i < length; i++) {
            obj.push(0);
        }
    } else if (typeof(obj) == "object") {
        for (var key in obj) {
            obj[key] = 0;
            if (Array.isArray(obj[key])) {
                obj[key] = [];
            } else if (typeof(obj) == "object") {
                obj[key] = {};
            } else {
                obj[key] = 0;
            }
        }
    } else {
        obj = 0;
    }
}
//随机数
DataUtil.getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//麻将16进制转化
DataUtil.ToUIData = function (data) {
    Number(data);
    if (!data) data = 1;
    return {"type": ["w", "t", "b"][Math.floor(data / 16)], "num": data % 16};
}
//空麻将数据
DataUtil.getNullDatas = function () {
    var data = [];
    for (var i = 0; i < 14; i++) {
        data.push(0x00);
    }
    return data;
}

//读取数字
DataUtil.ReadNumber = function (SerializeObject, size) {

    return Number(ReadNumber(SerializeObject, size));
}

//读取数字
DataUtil.ReadUnZipNumber = function (SerializeObject, size) {

    return Number(ReadUnZipNumber(SerializeObject, size));
}



DataUtil.getModifiedName = function (str) {
    var length = 0;
    for(var i = 0;i<str.length;i++){
        if(str.charCodeAt(i)>255){
            length +=2;
        }else{
            length++;
        }
        if(length >8){
            str = str.substr(0,i) +"…";
            break;
        }
    }
    return str;
}


//获取对象元素数目
DataUtil.GetObjectElementCount = function (object) {
    if (cc.isObject(object) == false)
        return 0;

    var nCount = 0;
    for (var key in object)
        nCount++;

    return nCount;
}



// 获取验证KEY
DataUtil.GetWebSign = function (loginkey, datastring) {

    lm.log("loginkey : " + loginkey);
    return MD5String(loginkey + datastring);
}


//颜色生成
DataUtil.RGBA = function (r, g, b, a) {
    return Number((((a) & 0xff) << 24) | (((r) & 0xff) << 16) | (((g) & 0xff) << 8) | ((b) & 0xff));
}

//颜色获取 -A
DataUtil.AValue = function (rgba) {
    return Number((rgba >> 24) & 0xff);
}

//颜色获取 -B
DataUtil.BValue = function (rgba) {
    return Number((rgba >> 16) & 0xff);
}
//颜色获取 -G
DataUtil.GValue = function (rgba) {
    return Number((rgba >> 8) & 0xff);
}

//颜色获取 -R
DataUtil.RValue = function (rgba) {
    return Number((rgba ) & 0xff);
}
DataUtil.getRGBA = function (data) {
    return cc.color(DataUtil.RValue(data), DataUtil.GValue(data), DataUtil.BValue(data), DataUtil.AValue(data))
}

DataUtil.Min = function (a, b) {
    if (a === undefined) a = 0;
    if (b === undefined) b = 0;
    return ((a > b) ? b : a);
}

// 设置当前界面返回的模块
DataUtil.SetGoToModule = function (module) {
    this.module = module;
}
//获取当前模块
DataUtil.GetGoToModule = function () {
    return this.module;
}

// 设置相差间隔
DataUtil.SetServerInterval = function (data, interval) {

    //data":{"second":18,"hour":10,"millsecond":412,"month":7,"year":2015,"day":29,"minute":24
    var servertime = new Date(Number(data["year"]),
        Number(data["month"] - 1),
        Number(data["day"]),
        Number(data["hour"]),
        Number(data["minute"]),
        Number(data["second"]),
        Number(data["millsecond"]));


    // 当前时间与服务器时间的间隔 =  当前时间 - 服务器时间 - 误差
    var curTime = new Date();

    var temp = curTime.getTime() -  interval  - servertime.getTime();
    this.serverInterval  =  (curTime.getTime() >  servertime.getTime())? (-temp):temp;
    lm.log("当前时间与服务器时间相差： "    + this.serverInterval /1000  + "秒");

    //var serverDate = new Date(curTime.getTime() + DataUtil.GetServerInterval());
    //lm.log("serverDate： " + serverDate.getDate()+ " hour:" + serverDate.getHours() + " minute:" + serverDate.getMinutes() + " second:" + serverDate.getSeconds());
}

// 获取间隔
DataUtil.GetServerInterval = function () {

    return this.serverInterval;
}

//获取两个日期相差天数
DataUtil.GetDays = function (startdate, enddate) {

    return Number(Math.ceil((enddate.getTime() - startdate.getTime()) /(24*60*60*1000) ));
}

// 截屏
DataUtil.ScreenShoot = function()
{
    //截屏
    var time =   new Date();
    var imagename = time.getTime() +  ".png";
    ScreenShoot(imagename);
    return  imagename;
}


// 分享到微信
DataUtil.ShareWeiXin = function()
{
    var gameurl ="";
    var url =  this.GetHttpWebURL();
    var url1 = url.substring(0,url.lastIndexOf("/"));
    var url2 = url1.substring(0,url1.lastIndexOf("/"));
    gameurl = url2  +"/mshare-"+Game_ID+"-" +GET_CHANEL_ID()+ ".html";
    lm.log("curgameurl:" + gameurl);
    sendToTimeLine("大家都来玩大家乐斗地主啊！", "看我玩得多棒，羡慕吗！",gameurl);
}

//下载游戏，跳转
DataUtil.DownloadGame = function(gameid,appurl,md5)
{
    lm.log("cheanel------" + GET_CHANEL_ID());
    switch (GET_CHANEL_ID())
    {
        case ChanelID.IOS_APPSTORE: //iosAppStore 渠道
        case ChanelID.IOS_BREAKOUT: //ios越狱 渠道
        {
            var url =  this.GetHttpWebURL();
            var url1 = url.substring(0,url.lastIndexOf("/"));
            var url2 = url1.substring(0,url1.lastIndexOf("/"));
            var gameurl = url2  +"/mdown-"+gameid+"-" +GET_CHANEL_ID()+ ".html";

            lm.log("gameurl = " + gameurl);
            OpenURL(gameurl);

        }break;

        case ChanelID.ANDROID_OFFICIAL: //android官方渠道 －（百度外卖 － 推广版本）
        case ChanelID.ANDROID_UNICOM4GOOPERATION:  //android联通4G合作渠道－推广使用版本
        case ChanelID.ANDROID_BAIDU: //android 百度SDK
        {
            lm.log("android = " + gameurl);

            OpenAppURL(appurl,md5);

        }break;

        default :
        break;
    }
}

DataUtil.SetImageName = function(imagename)
{
    this.imagename = imagename;

}

DataUtil.GetImageName = function()
{
   return this.imagename ;
}

//获取网页尺寸
DataUtil.GetWebNoticeSize = function (activewidth,activeheight)
{
    // 本地最大尺寸
    var localwidth = Number(cc.director.getVisibleSize().width) - Number(webviewNotice_offset_x);
    var localheight = Number(cc.director.getVisibleSize().height) - Number(webviewNotice_offset_y);

    //lm.log("屏幕分辨率 width: " + cc.director.getVisibleSize().width + " height:" + cc.director.getVisibleSize().height );

    var width = 0,height = 0;
    if((activewidth !== undefined) && (activewidth !== 0) &&
        (activeheight !== undefined) && (activeheight !== 0)) {
        // 尺寸在分辨率之内
        if ((Number(activewidth) <= Number(localwidth)) && (Number(activeheight) <= Number(localheight)))
        {
            width = Number(activewidth);
            height = Number(activeheight);
            //lm.log(" 尺寸在分辨率之内 width: " + width + " height:" + height + " activewidth: " + activewidth + " activeheight " + activeheight);
        }
        else
        {
            // 尺寸在分辨率之外
            if (Number(activeheight) > Number(cc.director.getVisibleSize().height)) {
                height = Number(cc.director.getVisibleSize().height) - Number(webviewNotice_offset_y);
            } else
            {
                height = Number(activeheight) - Number(webviewNotice_offset_y);
            }

            if (Number(activewidth) > Number(cc.director.getVisibleSize().width)) {
                    width = Number(cc.director.getVisibleSize().width) - Number(webviewNotice_offset_x);
            } else {
                width = Number(activewidth) - Number(webviewNotice_offset_x);
            }

            //lm.log(" 尺寸在分辨率之外 width: " + width + " height:" + height + " activewidth: " + activewidth + " activeheight " + activeheight);
        }
    }
    return  cc.p( width, height );
}





//begin modified by lizhongqiang 2015-10-23 13:50
//今日是否签到
DataUtil.IsToDayChecked = function () {
    var markdata = roomManager.GetMarkData();
    //lm.log("今日是否签到 1");
    if (markdata !== undefined && markdata !== null) {
        // 今日
        //lm.log("今日是否签到 2");
        var today = markdata["today"];
        if ((today !== undefined) && (today !== null)) {
            //lm.log("今日是否签到 3");
            var checkeddates = markdata["rewardstatusList"]["checkeddates"];
            for (var j = 0; j < checkeddates.length; j++) {
                //lm.log("今日是否签到 4, " + checkeddates[j] + "  today:" + today["date"] );
                // 当日是可补签的日期
                if (Number(today["date"]) == Number(checkeddates[j])) {
                    //lm.log("今日是否签到 4");

                    return true;
                }
            }
        }
    }
    lm.log("今日是否签到 5");
    return false;
}
//end modified by lizhongqiang 2015-10-23


DataUtil.Trim = function(string)
{
    var temp = string;
    while(temp.indexOf(" ")!=-1){
        temp = temp.replace(" ","");
    }
    return temp;
}

// 获取webUrl
DataUtil.GetHttpWebURL = function()
{
    return  this.HttpWebUrl;
}

// 设置webUrl
DataUtil.SetHttpWebURL = function(httpweburl)
{
    this.HttpWebUrl = this.Trim(httpweburl);
}

//上传地址URL
DataUtil.GetUpLoadWebURL = function()
{
    return this.UpLoadWebURL;
}

//设置webUrl
DataUtil.SetUpLoadWebURL = function(uploadweburl)
{
    this.UpLoadWebURL = this.Trim(uploadweburl);
}

//设置app 下载地址, IOS 为 appid, Android 为下载地址
DataUtil.SetAppURL= function(appurl)
{
    this.AppURL = this.Trim(appurl);
}

//获取appURL
DataUtil.GetAppURL = function()
{
    return this.AppURL;
}

DataUtil.SetApkMD5= function(apkmd5)
{
    this.ApkMD5 = apkmd5;
}

DataUtil.GetApkMD5 = function()
{
    return this.ApkMD5;
}

//获取推广员账号
DataUtil.GetStaffAccount = function()
{
    var staffAccount= null;
    //hanhu #判断是否需要绑定推广员ID 2015/11/13
    if(GetDeviceType() == DeviceType.ANDROID)
    {
        if(ChannelLabel.length == 0)
        {
            ChannelLabel = jsb.reflection.callStaticMethod(AndroidPackageName, "getCurrentChannelLabel", "()Ljava/lang/String;");
        }

        if (ChannelLabel == CHANNELLABELS.ANDROID_DEFAULT || ChannelLabel == CHANNELLABELS.ANDROID_BAIDU_SINGLE || ChannelLabel == CHANNELLABELS.ANDROID_TELCOM)
        {
            var ChannelID = jsb.reflection.callStaticMethod(AndroidPackageName, "getAndroidVersion", "()I");
            lm.log("ChannelID =" + ChannelID);
            if(ChannelID == ChanelID.ANDROID_OFFICIAL || ChannelID == ChanelID.ANDROID_UNICOM4GOOPERATION || ChannelID == ChanelID.ANDROID_BAIDU ||
                ChannelID == ChanelID.ANDROID_TELCOM)
            {
                try
                {
                    staffAccount  = cc.sys.localStorage.getItem("staffAccount"); //hanhu #将推广员ID绑定到本地 2015/11/16
                    if(staffAccount == undefined || staffAccount.length == 0 || staffAccount == null)
                    {
                        staffAccount = jsb.reflection.callStaticMethod(AndroidPackageName, "getStaffAccount", "()Ljava/lang/String;");
                        lm.log("staffAccount =" + staffAccount);
                        // - 1 表示无推广员
                        if(staffAccount != undefined && staffAccount != null && staffAccount.length != 0 && staffAccount!="-1")
                          cc.sys.localStorage.setItem("staffAccount", staffAccount);
                        else
                            staffAccount = null;
                    }

                }catch(e)
                {
                }
            }
        }
    }else{

        if(GET_CHANEL_ID() == ChanelID.IOS_BREAKOUT){
            //越狱版本
            try{

                staffAccount  = cc.sys.localStorage.getItem("staffAccount");
                if(staffAccount == undefined || staffAccount.length == 0 || staffAccount == null){
                    staffAccount = GetStaffID();
                    lm.log("staffAccount =" + staffAccount);
                    // - 1 表示无推广员
                    if(staffAccount != undefined && staffAccount != null && staffAccount.length != 0 && staffAccount!="-1")
                        cc.sys.localStorage.setItem("staffAccount", staffAccount);
                    else
                        staffAccount = null;
                }


            }catch(e){
            }
        }

    }

    return staffAccount;
}






// 是否一键注册用户
DataUtil.AkeyRegisterUser = false;

