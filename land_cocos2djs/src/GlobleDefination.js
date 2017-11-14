/**
 * Created by hanhu on 15/12/1.
 */
var normalWaittingTag = 10008;   //普通等待标签

var waitLayerDisplay = 999;    //等待界面显示层级

var HtmlCmdList = {
    SignInMatch : 1  //报名比赛
};

var MatchType = {
  TimeLimitedMatch : 1, //时限赛
  RoundLimitedMatch : 2  //轮回赛
};

var SDKPayMethod = {
    Alipay : 1,           //支付宝
    UPPay : 2             //银联
};

var MatchStartType = {
  StartByTime : 1,  //按时间开赛
  StartByPlayer : 2 //人满开赛
};

var MatchSignStatus = {
    SignAllowed : 1,          //可报名
    AppointmentAllowed : 2,   //可预约
    Signed : 3,               //已报名
    Appointed : 4,            //已预约
    Start : 5                 //比赛已开始
};

var MusicType=
{
    desk:0,  // 牌桌
    other:1,    // 牌桌以外
    none:2             // 没有播放

};
var nowMusicType = MusicType.none;

var TaskType = {
    DailyTask : 1,        //日常任务
    Achievement : 2       //成就任务
};

var RandomTaskDes =     //随机任务的描述信息
{
    1: "以3带一或3带二结尾获胜",
    2: "以五连及以上顺子结尾获胜",
    3: "以连对结尾获胜",
    4: "以炸弹数超过2炸获胜",
    5: "以春天或者反春获胜"
}
var RandomTaskDescribe =     //随机任务的描述信息
[
    "",
    "以3带一或3带二结尾获胜",
    "以五连及以上顺子结尾获胜",
    "以连对结尾获胜",
    "以炸弹数超过2炸获胜",
    "以春天或者反春获胜"
]
var AndroidPackageName = "com/ljapps/p2685/AppActivity";


var CurrentBuyIdentify = ""; //当前购买的物品

//hanhu #在C++层获取报名，没有则使用默认值 2016/01/27
try{
    if(GetDeviceType() == DeviceType.ANDROID)
    {
        AndroidPackageName = GetAndroidPackageName();
        lm.log("获取到的包名为 ：" + AndroidPackageName);
    }
}catch(exp) {
    lm.log("获取包名失败");
}
var addNormalResource = function()
{
    //cc.spriteFrameCache.addSpriteFrames("res/cocosOut/roomUILayer/room001.plist");
    //cc.spriteFrameCache.addSpriteFrames("res/cocosOut/roomUILayer/room002.plist");
    //cc.SpriteFrameCache.getInstance().addSpriteFrames("res/cocosOut/roomUILayer/room003.plist");
}

var removeNormalResource = function()
{
    //cc.spriteFrameCache.removeSpriteFramesFromFile("res/cocosOut/roomUILayer/room001.plist");
    //cc.spriteFrameCache.removeSpriteFramesFromFile("res/cocosOut/roomUILayer/room002.plist");
    //cc.SpriteFrameCache.getInstance().removeSpriteFramesFromFile("res/cocosOut/roomUILayer/room003.plist");
}

var RandomTaskAttending = //增在进行的随机任务
{
    id : 0,             //任务ID
    cur : 0,            //当前进度
    total : 99          //总进度
}



var addPlazzResource = function()
{
    //大厅
    cc.spriteFrameCache.addSpriteFrames("res/landlord/cocosOut/plaza/plaza.plist");
    cc.spriteFrameCache.addSpriteFrames("res/landlord/cocosOut/mark/mark.plist");
    cc.spriteFrameCache.addSpriteFrames("res/landlord/cocosOut/chest/chest.plist");
    cc.spriteFrameCache.addSpriteFrames("res/landlord/cocosOut/plaza/userInfo/userInfo.plist");
    cc.spriteFrameCache.addSpriteFrames("res/landlord/cocosOut/general/general.plist");
    //Room
    cc.spriteFrameCache.addSpriteFrames("res/landlord/cocosOut/ddzRoom/ddzRoom.plist");
    //商城
    cc.spriteFrameCache.addSpriteFrames("res/landlord/cocosOut/plaza/mall/mall.plist");
    //兑换
    cc.spriteFrameCache.addSpriteFrames("res/landlord/cocosOut/plaza/exchange/exchange.plist");
    //背包
    cc.spriteFrameCache.addSpriteFrames("res/landlord/cocosOut/plaza/bag/bag.plist");
    //任务
    cc.spriteFrameCache.addSpriteFrames("res/landlord/cocosOut/plaza/task/task.plist");
    //排行榜
    cc.spriteFrameCache.addSpriteFrames("res/landlord/cocosOut/plaza/rank/rank.plist");
    cc.spriteFrameCache.addSpriteFrames("res/landlord/cocosOut/general/general.plist");
    //保险箱
    cc.spriteFrameCache.addSpriteFrames("res/landlord/cocosOut/plaza/safeBox/safeBox.plist");
    //设置及账号升级
    cc.spriteFrameCache.addSpriteFrames("res/landlord/cocosOut/setting/setting.plist");
    //牌桌
    cc.spriteFrameCache.addSpriteFrames("res/cocosOut/roomUILayer/room002.plist");
    cc.spriteFrameCache.addSpriteFrames("res/landlord/cocosOut/card/card.plist");
    cc.spriteFrameCache.addSpriteFrames("res/landlord/cocosOut/card/cardSmall.plist");
    cc.spriteFrameCache.addSpriteFrames("res/landlord/cocosOut/desk/desk01.plist");
    cc.spriteFrameCache.addSpriteFrames("res/landlord/cocosOut/desk/desk02.plist");
    cc.spriteFrameCache.addSpriteFrames("res/landlord/cocosOut/texturepackerOutput/newDesk.plist");
    cc.spriteFrameCache.addSpriteFrames("res/landlord/cocosOut/general/general.plist");

}

/**
 *
 * @param self：cc.Layer
 * 关闭弹窗动画
 */
function closePlayerActions(self,callBack)
{
    if ( !self ){return;}
    var scaleTo = cc.scaleTo(0.1, 1.1, 1.1);
    var scaleBy = cc.scaleBy(0.1, 0, 0);
    var callFunc = cc.callFunc(function()
    {
        self.removeFromParent();
        if (callBack)
        {
            callBack();
        }
    },self);
    var sequnce = cc.sequence(scaleTo, scaleBy,callFunc);
    self.runAction(sequnce);
}

//等待弹出框
var WaittingLayerPopManager = function(layer, scene)
{
    var curScene = null;
    if(!scene)
    {
        curScene = cc.director.getRunningScene();
    }
    else
    {
        curScene = scene;
    }

    if (curScene.getChildByTag(normalWaittingTag))
    {
        curScene.removeChildByTag(normalWaittingTag);
    }

    if(layer)
    {
        lm.log("添加等待界面");
        curScene.addChild(layer, waitLayerDisplay, normalWaittingTag);
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(sender, type) {return true;},
            onTouchMoved: function(sender, type){},
            onTouchEnded: function(sender, type){return true;}
        }, layer);
    }
}



/**
 *
 * @param view
 * 弹窗动画
 */
function startPlayerActions(view)
{
    //var size = winSize;
    //view = view.parentView;
    //view.setPosition(size.width/2, size.height/2);
    //view.setAnchorPoint(0.5, 0.5);
    if ( !view ){return;}

    view.scale = 0.3;
    var scaleGap01 = 1.15;
    var scaleGap02 = 0.9;
    var scaleGap03 = 1;
    var time01 = 0.25;
    var time02 = 0.1;
    var time03 = 0.1;
    var scaleTo = cc.scaleTo(time01,scaleGap01, scaleGap01);
    var scaleBy01 = cc.scaleBy(time02, scaleGap02, scaleGap02);
    var scaleBy02 = cc.scaleBy(time03, scaleGap03, scaleGap03);
    var sequnce = cc.sequence(scaleTo,scaleBy01, scaleBy02);
    view.runAction(cc.EaseIn.create(sequnce, 0.5));
}

function ExitGameEx()
{
    lm.log("yyp ExitGameEx 1");
    switch (Number(GetDeviceType())) {
        case DeviceType.ANDROID://android的登出游戏
        {
            lm.log("yyp ExitGameEx 2");
            if(ChannelLabel == "8633" || ChannelLabel == "baidu" || ChannelLabel == "baiduSingle")
            {
                jsb.reflection.callStaticMethod(AndroidPackageName, "ExitGame", "()V");
            }
            else if(ChannelLabel == "anySDK")
            {
                var user_plugin = AnySDKAgent.getUserPlugin();
                if(!user_plugin || !user_plugin.exit) return;
                user_plugin.exit();
                jsb.reflection.callStaticMethod(AndroidPackageName, "ExitGame", "()V");
            }
            else
            {
                var sdkhelper = new lj.Ljsdkhelper();
                sdkhelper.existGame();
            }
        }
            break;
        case DeviceType.IOS://IOS
        case DeviceType.IPAD://android
        default :
        {
            lm.log("yyp ExitGameEx 3");
            ExitGame();
        }
            break;
    }
}

function indentationGlod(num)
{
    var ret="";
    if (num >= 10000 && num < 100000000)    //缩进四位
    {
        var newNum = num / 10000;
        var newNumStr = newNum + "";

        var arr=newNumStr.split(".");
        if(arr[0].length >= 5)
        {
            ret = arr[0];
        }
        else
        {
            ret = newNum.toFixed(5 - arr[0].length);
        }
        return parseFloat(ret) + "万";
    }
    else if(num >= 100000000)    //缩进8位
    {
        var newNum = num / 100000000;
        var newNumStr = newNum + "";

        var arr=newNumStr.split(".");
        if(arr[0].length >= 5)
        {
            ret = arr[0];
        }
        else
        {
            ret = newNum.toFixed(5 - arr[0].length);// "亿";
        }
        return parseFloat(ret) + "亿";
    }

    //alert(parseFloat(a))
    return num;
}

function indentationEnter(num)
{
    if (num >= 10000 && num < 100000000)    //缩进四位
    {
        var newNum = num / 10000;
        return parseFloat(newNum.toFixed(1)) + "万";
    }
    else if(num >= 100000000)    //缩进8位
    {
        var newNum = num / 100000000;
        return parseFloat(newNum.toFixed(1)) + "亿";
    }

    return num;
}



//昵称转换 by zfs
var nickNameConvert = function(nickName)
{
    var max_length = 6; //昵称最长7个中文字符，14个英文字符
    var index = 0;
    var len = 0;
    var len2 = 0;
    var str = ""
    for(var i = 0; i < nickName.length; i++)
    {
        var reg = /[\u4e00-\u9fa5]+/;//匹配汉字
        var mm = nickName[i].match(reg);
        if(mm)
        {
            len += 2;
        }
        else
        {
            len2 += 1;
        }
        if((len+len2) >= max_length)
        {
            str = "..."
            break;
        }
    }
    var endLen = Math.floor(len/2)+len2;
    var namee = nickName.substring(0, endLen) + str;
    return namee;

}

//根据房间号 处理快速充值逻辑（roomId 1 2 3 4 /新初中高）
var quickPay = function(roomId)
{
    var price = 6;
    switch (roomId)
    {
        case 1:
        {
            price = 6;
        }
            break;
        case 2:
        {
            price = 6;
        }
            break;
        case 3:
        {
            price = 30;
        }
            break;
        case 4:
        {
            price = 30;
        }
            break;
        default :
            break;
    }

    lm.log("quickPay 000 " + price);
    var golddata = roomManager.GetMallData()["goldlist"];
    if(golddata)
    {
        lm.log("quickPay 111 ");
        var quickGoldData = null;
        for(var key in golddata)
        {
            if(golddata[key].price == price)
            {
                quickGoldData = golddata[key];
                break;
            }
        }

        if(quickGoldData)
        {
            lm.log("quickPay 222 " + quickGoldData["identifier"] + quickGoldData["pname"] + quickGoldData["price"] + quickGoldData["value"]);
            roomManager.RequestPayment(quickGoldData["identifier"], quickGoldData["pname"], quickGoldData["price"], quickGoldData["value"]);
        }
    }

}

//播放金币动画
var playGolgAnimation = function()
{
    var totalNum = 35;
    for(var i = 0; i < totalNum; i++)
    {
        var animNum = 26;
        var type =Math.floor(Math.random() * 10) % 3 + 1;
        if(type == 1)
        {
            animNum = 26;
        }
        else if(type == 2)
        {
            animNum = 31;
        }
        else if(type == 3)
        {
            animNum = 32;
        }
        var animation = cc.Animation.create();
        for (var j = 1; j <= animNum; j++)
        {
            var str;
            if (j < 10) {
                str = "0" + j;
            } else {
                str = j;
            }
            animation.addSpriteFrameWithFile("res/normal/Gold_" + type + "/Gold_" + type + "_00" + str + ".png");
        }
        animation.setDelayPerUnit(0.04);
        var sp = cc.Sprite.createWithSpriteFrame(animation.getFrames()[0].getSpriteFrame());
        sp.setScale(1.5);
        cc.director.getRunningScene().addChild(sp, 1500);

        var delay = cc.DelayTime(Math.random());
        sp.runAction(cc.Sequence(delay, cc.Animate.create(animation), cc.CallFunc(function () {
            this.removeFromParent();
        }, sp)));
        sp.setPosition(cc.p(winSize.width / totalNum * i, winSize.height / 2));
    }
    //MusicUtil.playEffectOut("goldEffect.mp3");
}







