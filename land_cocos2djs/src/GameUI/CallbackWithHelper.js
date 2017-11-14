/**
 * Created by apple on 15/7/18.
 */

// c++ 层全局回调函数

var ChooseImageModule=
{
    GameFreedBack:0,    // 问题反馈
    ModifyUserCustomFace:1   // 修改用户自定义头像
};

var lastdidentertime = 0;
var maxintervaltime = 0;

//游戏进入后台
function  OnApplicationDidEnterBackground() {

    lastdidentertime = new Date();

}

//游戏进入前台
function  OnApplicationWillEnterForeground() {

    //if(IsNetworkAvailable())
    //{
    //    var curtime = new  Date();
    //    // 回到登录界面
    //    if( (curtime.getTime() / 60000 - lastdidentertime) >= maxintervaltime)
    //    {
    //        userInfo.ClearUserData();
    //
    //        var scene = new rootScene();
    //        layerManager.addLayerToParent(new LoginUILayer(), scene);
    //        cc.director.replaceScene(scene);
    //    }
    //
    //}else
    //{
    //    // 没有网络断开连接
    //    lm.log("没有网络断开连接");
    //    layerManager.PopTipLayer(new PopTipsUILayer("确定","取消", "当前网络出现异常，请检查网络，重新登录游戏！", function(id)
    //    {
    //        if(id == clickid.ok)
    //        {
    //            // 回到登陆界面
    //            userInfo.ClearUserData();
    //
    //            var scene = new rootScene();
    //            layerManager.addLayerToParent(new LoginUILayer(), scene);
    //            cc.director.replaceScene(scene);
    //        }else
    //        {
    //            ExitGame();
    //        }
    //
    //    },this),false);
    //
    //}
}


function OnUpLoadCustomFaceComplete( nStatus,
                                     nUserid,
                                     nUserFaceID,
                                     nUserCustomFaceID)
{
    // 更新用户数据
    if(nStatus == HttpRequestStatus.Successed)
    {
        //layerManager.PopTipLayer(new PopAutoTipsUILayer("头像上传成功，请等待审核！",DefultPopTipsTime),false);
    }
    else
    {
        // 上传用户头像失败
        //layerManager.PopTipLayer(new PopAutoTipsUILayer("您提交的头像上传失败，请重新选择提交，给您带来不便深表歉意！",DefultPopTipsTime),false);

    }

}



/**
 *
 * JS函数名称: OnUpLoadImageComplete
 * 功能描述: 上传用户图片完成
 * JS参数:无
 *     @Param0 ：number - nModeType
 *     @Param1 ：number - nStatus    0- 失败  1 - 成功
 *	   @Param2 ：string -imagename
 *
 */
function OnUpLoadImageComplete( nModeType, nStatus,helper)
{
    if(nStatus == HttpRequestStatus.Successed)
    {
        var imagename =  ReadStringParam(helper,0);
        switch (nModeType)
        {
            case ClientModuleType.Mall: // 下载图片成功，保存到道具目录
            {
                var curLayer = layerManager.getRuningLayer();
                if(curLayer !== null)
                {
                    curLayer.UpdateCustomData(imagename);
                }

            }
                break;
            default:
                break;
        }
    }
}




/**
 *
 * JS函数名称: OnDownLoadCustomFaceComplete
 * 功能描述: 下载用户自定义头像完成
 * JS参数:无
 *     @Param0 ：number - nModeType          模块类型
 *    @Param1 ：number - nStatus            0- 失败  1 - 成功
 *     @Param2 ：number - nUserID      头像ID
 *	   @Param3 ：number - nUserCustomFaceID 用户自定头像ID
 *
 */
function OnDownLoadCustomFaceComplete( nStatus, nUserID, nUserCustomFaceID)
{

    if( nStatus == HttpRequestStatus.Successed ){
        //下载成功
        lm.log( "下载成功===useid=" + nUserID + "==cusetomfaceid==" + nUserCustomFaceID );
        //更新头像
        if( layerManager.getRuningLayer() != null ){
            layerManager.getRuningLayer().UpdateUserInFo();
        }

    }else{
        //下载失败
        lm.log( "下载失败-----------");

    }



}


/**
 *
 * JS函数名称: OnDownLoadCustomFaceComplete
 * 功能描述: 下载用户自定义头像完成
 * JS参数:
 *     @Param0 ：number - nModeType         模块类型
 *     @Param1 ：number - nStatus           0- 失败  1 - 成功
 *     @Param2 ：number - handle
 *
 */
function OnDownLoadImageComplete( nModeType, nStatus,helper)
{

    if( nStatus == 1 ){

        var imagename =  ReadStringParam(helper,0);
        lm.log("downlaod image successed: " + imagename);

    }else{
    }


}




/**
 * JS函数名称: OnRequestProductComplete
 * 功能描述: 请求产品信息完成
 * JS参数:无
 *     @Param0 ：string - szProducts  json 格式的产品信息数组
 {“products”：{“productIdentifier”：“abcdefg”, " productIdentifier":"abcdt","localizedDescription":"ddddd", "localizedPrice":"fffff"}}
 *
 */
function OnRequestProductComplete(module,helper)
{
    lm.log("yyp OnRequestProductComplete 1" );
    if(1)
    //if(module == MallDataType.MALL_DATA_LOSER_BUY)
    {
        lm.log("yyp OnRequestProductComplete 2" );
        webMsgManager.SendGpGetOrderData(CurrentBuyIdentify,function(data)
        {
            lm.log("yyp OnRequestProductComplete 3" );
            // 保存本地订单
            userInfo.AppendOrderData(userInfo.globalUserdData["dwUserID"],
                data["orderid"],
                data["approductid"],
                data["orderamount"],
                data["appletransaction"],
                data["orderstatus"]);

            //请求支付
            RequestPayment(data["orderid"],DefultIdentifier,1);


        }, function(errinfo)
        {
            lm.log("yyp OnRequestProductComplete 4" );
            // 连接服务器失败，请稍后重试；
            layerManager.PopTipLayer(new PopAutoTipsUILayer("获取产品信息失败，请稍后重试！", DefultPopTipsTime),false);

        },this);
    }
    else
    {
        var productsstring =  ReadStringParam(helper,0);
        if(productsstring !== null && productsstring != undefined )
        {
            // 显示产品信息
            var curLayer  = new MallUILayer();
            var data = JSON.parse(productsstring);
            curLayer.SetProductsData(data["products"]);
            curLayer.setTag(ClientModuleType.Mall);
            layerManager.repalceLayer(curLayer);
            //curLayer.SelectExchangeBtns((module == 0) ? MallDataType.MALL_DATA_GOLD :MallDataType.MALL_DATA_PROPERTY);
            curLayer.refreshViewByData((module == 0) ? MallDataType.MALL_DATA_GOLD :MallDataType.MALL_DATA_PROPERTY);
        }
    }
}

/**
 *
 * JS函数名称: OnRequestProductsError
 * 功能描述: 请求产品失败
 * JS参数:无
 *     @Param0 ：long - code  请求失败信息
 *
 */

function OnRequestProductsError( code)
{
    lm.log("OnRequestProductsError code:" + code);
    layerManager.PopTipLayer(new PopAutoTipsUILayer("获取产品信息失败，请稍后重试！", DefultPopTipsTime),false);
}

/**
 *
 * JS函数名称: OnPaymentProductComplete
 * 功能描述: 交易完成
 * JS参数:无
 *     @Param0 ：string identifier
 @Param1 ：number quantity
 *
 1.将购买凭证 strReceipt 存储在本地
 2.发送消息到服务器验证凭证
 3.根据服务器返回，更新本地订单状态，成功的完成交易，刷新玩家数据；
 4.失败的，启动后台定时器

 后台定时检测未完成的订单，本地有支付凭证的，每隔15秒请求一个到服务器进行处理；
 *
 */
function OnPaymentProductComplete(helper, quantity)
{

    var orderid = ReadStringParam(helper,0);
    var identifier = ReadStringParam(helper,1);
    var szReceipt =  ReadStringParam(helper,2);

    // 1、存储交易凭证
    lm.log("JS  OnPaymentProductComplete lOrder:" + orderid + ",identifier:" + identifier)
    userInfo.SetOrderReceipt(orderid,szReceipt);


    // 2.发送消息到服务器验证凭证
    roomManager.VerificationOrderID(orderid,identifier,szReceipt);

}


/**
 *
 * JS函数名称: OnPaymentProductFailed
 * 功能描述: 交易失败
 * JS参数:无
 *     @Param0 ：string identifier
 @Param1 ：number quantity
 @Param2 ：number quantity

 *
 1. 完成本地订单（此时应该应该没有生成凭证）
 2. 提示用户
 *
 */
function OnPaymentProductFailed(helper,  quantity,  code)
{
    var order = ReadStringParam(helper,0);
    var identifier = ReadStringParam(helper,1);

    //1、 完成订单
    userInfo.CompleteOrder(order);
    layerManager.PopTipLayer(new PopAutoTipsUILayer((code ==2) ? "交易已取消！":"购买失败，请联系客户！", DefultPopTipsTime),false);

    // 购买失败
    //lm.log("yyyyyp OnPaymentProductFailed identifier:"  + identifier + ",quantity:" + quantity + ",code:" + code);

    if(MALLUILAYER)
    {
        MALLUILAYER.OnBuyCallback(false);
    }

}


/**
 *
 * JS函数名称: OnPaymentProductRestored
 * 功能描述: 交易被还原
 * JS参数:无
 *     @Param0 ：string identifier
 @Param1 ：number quantity
 @Param2 ：number quantity

 1、完成订单
 2、提示用户
 *
 */
function OnPaymentProductRestored(helper, lOrder, quantity)
{

    var identifier = ReadStringParam(helper,0);
    //1、 完成订单
    userInfo.CompleteOrder(lOrder);

    // 已购买
    layerManager.PopTipLayer(new PopAutoTipsUILayer("您已经成功购买了该产品！",DefultPopTipsTime));

    lm.log("OnPaymentProductRestored identifier:" + identifier +",quantity:" + quantity);
}



// 选择图片完成
function OnChooseImageSuccessed(module, helper) {
    //lm.log("更新界面显示图片");
    switch (module)
    {
        case ChooseImageModule.GameFreedBack:  // 游戏问题反馈
        {
            lm.log("yyyp ->更新界面显示图片111");
            DataUtil.SetImageName(ReadStringParam(helper,0));
            //lm.log("更新界面显示图片222");
            if(FeedBackUILayer !== null)
            {
                //lm.log("更新界面显示图片333");
                FeedBackUILayer.ShowChangeImage(true);
                //lm.log("更新界面显示图片444");
            }

        }break;
        case ChooseImageModule.ModifyUserCustomFace:
        {
            lm.log("yyyp ->更新界面显示图片222");
            DataUtil.SetImageName(ReadStringParam(helper,0));
            if(MODIFYUSERINFOUILAYER) {
                lm.log("yyyp ->更新界面显示图片223");
                MODIFYUSERINFOUILAYER.onChooseImageSuccessed();
            }
        }break;

    }

}







// 棱镜SDK登录
function ShowImageInGame(helper)
{
    //var sdkhelper = new lj.Ljsdkhelper();
    //sdkhelper.LoginYaYa(userInfo.globalUserdData["szNickName"]);
}

// 登录棱镜SDK成功回调
function OnAndroidChannelLoginSuccess(helper)
{
    var account = ReadStringParam(helper,0);
    var password = ReadStringParam(helper,1);
    var channelID = ReadStringParam(helper,2);
    var productCode = ReadStringParam(helper,3);

    DataUtil.AkeyRegisterUser = true; //hanhu #将棱镜用户作为一键注册用户处理 2016/01/26

    lm.log("account = " + account + "password = " + password + "channelID =" + channelID + " ProductCode = " + productCode);


    webMsgManager.SendLjsdkLogin(account, password, channelID, GetFuuID(), productCode, function(data){
        var result_account = data["accounts"];
        var result_password = data["password"];
        userInfo.SetCurPlayerInFo(result_account, result_password);
        lm.log("account = " + result_account + " password = " + result_password);
        plazaMsgManager.SetLogonCallBack(
            function() // 连接服务器失败
                {
                    var pop = new ConfirmPop(this, Poptype.yesno,"当前网络异常，请检查网络状态后重试！");//ok
                    pop.addToNode(cc.director.getRunningScene());
                    pop.hideCloseBtn();
                    pop.setYesNoCallback(
                        function(){
                            plazaMsgManager.LogonPlazaEx(result_account, result_password, GetFuuID(), "");  //默认以前登录方式
                        },
                        function()
                        {
                            ExitGameEx();
                        }
                    );
                    // 连接失败重试
                    //self.addChild(new PopTipsUILayer("重试","取消","当前网络异常，请检查网络状态后重试！",function(id)
                    //{
                    //    if(id == clickid.ok)
                    //    {
                    //        plazaMsgManager.LogonPlazaEx(result_account, result_password, GetFuuID(), "");  //默认以前登录方式
                    //    }
                    //
                    //
                    //}));

                },
            function() // 登录大厅成功
                {
                    lm.log("登陆大厅成功");
                    if (SubMitAppstoreVersion == true ||  DoNotMatchRoomVersion == true) {
                        //先获取金币房间数据，如果是非法的就去服务器拉取
                        var roomdata = roomManager.GetGoldRoomData();
                        if ((roomdata === undefined) ||
                            (roomdata === null) ||
                            (roomdata.length === 0)) {

                            // 获取金币房间数据成功，立即进入场次列表
                            webMsgManager.SendGpGoldFiled(function (data) {

                                    roomManager.SetGoldRoomData(data);

                                    var curLayer = new RoomUILayer();
                                    curLayer.setTag(ClientModuleType.GoldField);
                                    layerManager.repalceLayer(curLayer);
                                    if ( Is_LAIZI_ROOM())
                                    {
                                        curLayer.refreshView(RoomType.ROOM_TYPE_LAIZI);
                                    }
                                    else if ( Is_HAPPY_ROOM())
                                    {
                                        curLayer.refreshView(RoomType.ROOM_TYPE_HAPPY);
                                    }
                                    else
                                    {
                                        curLayer.refreshView(RoomType.ROOM_TYPE_GOLD);
                                    }

                                },
                                function (errinfo) {
                                },
                                this);
                        } else {
                            var curLayer = new RoomUILayer();
                            curLayer.setTag(ClientModuleType.GoldField);
                            layerManager.repalceLayer(curLayer);
                            if ( Is_LAIZI_ROOM())
                            {
                                curLayer.refreshView(RoomType.ROOM_TYPE_LAIZI);
                            }
                            else if ( Is_HAPPY_ROOM())
                            {
                                curLayer.refreshView(RoomType.ROOM_TYPE_HAPPY);
                            }
                            else
                            {
                                curLayer.refreshView(RoomType.ROOM_TYPE_GOLD);
                            }

                        }

                    } else {

                        var curLayer = new PlazaUILayer();
                        curLayer.setTag(ClientModuleType.Plaza);
                        layerManager.repalceLayer(curLayer);
                    }

                },
            function(info)
                { // 登录大厅失败

                    var pop = new ConfirmPop(this, Poptype.yesno, info);//ok
                    pop.addToNode(cc.director.getRunningScene());
                    pop.hideCloseBtn();
                    pop.setYesNoCallback(
                        function(){
                            ExitGameEx();
                        },
                        function(){
                            ExitGameEx();
                        }
                    );
                    //layerManager.PopTipLayer(new PopTipsUILayer("退出游戏","取消",info,function(id)
                    //{
                    //    if(id == clickid.ok)
                    //    {
                    //        lm.log("退出游戏！");
                    //        // 调用C++退出游戏进程接口
                    //        ExitGame();
                    //    }
                    //
                    //}));
                }
        ,this);
        plazaMsgManager.LogonPlazaEx(result_account, result_password, GetFuuID(), "");  //默认以前登录方式

    },
    function(data){
        lm.log("棱镜登陆失败, message = " + JSON.stringify(data));
        //log_label.setString("棱镜登陆失败, message = " + JSON.stringify(data));
    }, this)
}

// 登录百度SDK成功回调
function OnAndroidBaiduLoginSuccess(helper)
{
    var self = this;
    var LoginAccessToken = ReadStringParam(helper,0);
    lm.log("LoginAccessToken = " + LoginAccessToken );
    var staffacount =  DataUtil.GetStaffAccount();
    lm.log("staffacount——百度 = " + staffacount );
    webMsgManager.SendBaiduLogin(LoginAccessToken, staffacount,function(data){
            DataUtil.AkeyRegisterUser = true;
            var result_account = data["accounts"];
            var result_password = data["password"];
            userInfo.SetCurPlayerInFo(result_account, result_password);
            lm.log("account=== = " + result_account + " password = " + result_password);
            plazaMsgManager.SetLogonCallBack(
                function() // 连接服务器失败
                {
                    // 连接失败重试
                    var pop = new ConfirmPop(this, Poptype.yesno,"当前网络异常，请检查网络状态后重试！");//ok
                    pop.addToNode(cc.director.getRunningScene());
                    pop.hideCloseBtn();
                    pop.setYesNoCallback(
                        function(){
                            plazaMsgManager.LogonPlazaEx(result_account, result_password, GetFuuID(), "");  //默认以前登录方式
                        },
                        function()
                        {
                            ExitGameEx();
                        }
                    );
                    //self.addChild(new PopTipsUILayer("重试","取消","当前网络异常，请检查网络状态后重试！",function(id)
                    //{
                    //    if(id == clickid.ok)
                    //    {
                    //        plazaMsgManager.LogonPlazaEx(result_account, result_password, GetFuuID(), "");  //默认以前登录方式
                    //    }
                    //
                    //
                    //}));

                },
                function() // 登录大厅成功
                {
                    lm.log("登陆大厅成功");
                    if (SubMitAppstoreVersion == true ||  DoNotMatchRoomVersion == true) {
                        //先获取金币房间数据，如果是非法的就去服务器拉取
                        var roomdata = roomManager.GetGoldRoomData();
                        if ((roomdata === undefined) ||
                            (roomdata === null) ||
                            (roomdata.length === 0)) {

                            // 获取金币房间数据成功，立即进入场次列表
                            webMsgManager.SendGpGoldFiled(function (data) {

                                    roomManager.SetGoldRoomData(data);

                                    var curLayer = new RoomUILayer();
                                    curLayer.setTag(ClientModuleType.GoldField);
                                    layerManager.repalceLayer(curLayer);
                                    if ( Is_LAIZI_ROOM())
                                    {
                                        curLayer.refreshView(RoomType.ROOM_TYPE_LAIZI);
                                    }
                                    else if ( Is_HAPPY_ROOM())
                                    {
                                        curLayer.refreshView(RoomType.ROOM_TYPE_HAPPY);
                                    }
                                    else
                                    {
                                        curLayer.refreshView(RoomType.ROOM_TYPE_GOLD);
                                    }

                                },
                                function (errinfo) {
                                },
                                this);
                        } else {
                            var curLayer = new RoomUILayer();
                            curLayer.setTag(ClientModuleType.GoldField);
                            layerManager.repalceLayer(curLayer);
                            if ( Is_LAIZI_ROOM())
                            {
                                curLayer.refreshView(RoomType.ROOM_TYPE_LAIZI);
                            }
                            else if ( Is_HAPPY_ROOM())
                            {
                                curLayer.refreshView(RoomType.ROOM_TYPE_HAPPY);
                            }
                            else
                            {
                                curLayer.refreshView(RoomType.ROOM_TYPE_GOLD);
                            }

                        }

                    } else {

                        var curLayer = new PlazaUILayer();
                        curLayer.setTag(ClientModuleType.Plaza);
                        layerManager.repalceLayer(curLayer);
                    }

                },
                function(info)
                { // 登录大厅失败
                    var pop = new ConfirmPop(this, Poptype.yesno, info);//ok
                    pop.addToNode(cc.director.getRunningScene());
                    pop.hideCloseBtn();
                    pop.setYesNoCallback(
                        function(){
                            ExitGameEx();
                        },
                        function(){
                            ExitGameEx();
                        }
                    );

                    //layerManager.PopTipLayer(new PopTipsUILayer("退出游戏","取消",info,function(id)
                    //{
                    //    if(id == clickid.ok)
                    //    {
                    //        lm.log("退出游戏！");
                    //        // 调用C++退出游戏进程接口
                    //        ExitGame();
                    //    }
                    //
                    //}));
                }
                ,this);
            plazaMsgManager.LogonPlazaEx(result_account, result_password, GetFuuID(), "");  //默认以前登录方式

        },
        function(data){
            lm.log("百度登陆失败, message = " + JSON.stringify(data));
        }, this)
}

function OnBaiDuChangeAccount(helper)
{
    //关闭连接
    CloseGameSocket(KernelPlaza);
    CloseGameSocket(KernelGame);
    CloseGameSocket(KernelMatch);

    //hanhu #切换帐号时重置比赛数据 2015/09/21
    lm.log("切换帐号，清理数据");
    matchMsgManager.ClearMatchData();
    MatchSignInArray = []; //韩虎 #切换帐号清除报名列表 2015/12/22

    plazaMsgManager.updatenofify = false;
    plazaMsgManager.needinputinsturepass = false;

    plazaMsgManager.ReConnectCount = 0;
    sparrowDirector.ReConnectCount=0;
    matchMsgManager.ReConnectCount = 0;
    roomManager.SetMallData(null);
    // 回到登陆界面
    userInfo.ClearUserData();

    cc.director.runScene(new rootUIScene());
    //layerManager.repalceLayer(new LoginUILayer());
}


//用于上传的用户信息
var userExtraData = {
    _id: "enterServer",
    roleId: 123,
    roleName: "test",
    roleLevel: 1,
    zoneId: 1,
    zoneName: "血流成河1服",
    balance: 0,
    vip: 1,
    partyName: "无帮派"
}

//上传用户信息
function UpdataUserExtraData()
{
    userExtraData.roleId = userInfo.globalUserdData["dwUserID"];
    userExtraData.roleName = userInfo.globalUserdData["szNickName"];
    userExtraData.balance = userInfo.globalUserdData["lUserScore"];
    var num = Math.floor(Math.random() * 100) % 3;
    var scene = 0;
    if(num == 0)
    {
        scene = "enterServer";
    }
    else if(num == 1)
    {
        scene = "createRole";
    }
    else
    {
        scene = "levelUp";
    }
    var string = cc.formatStr("{_id:\"%s\",roleId:%d,roleName:\"%s\",roleLevel:1,zoneId:1,zoneName:\"血流成河1服\",balance:%d,vip:1,partyName:\"无帮派\"}", scene, userExtraData.roleId, userExtraData.roleName, userExtraData.balance);
    var sdkHelper = new lj.Ljsdkhelper();
    lm.log("roleID = " +userExtraData.roleId+ "roleName = "+userExtraData.roleName+" balance = "+ userExtraData.balance);

    sdkHelper.setExtraData(string);

}

//超链接调用函数
function ExcuteHtmlCmd(helper)
{
    var cmdString = ReadStringParam(helper,0);
    lm.log("超链接函数被调用,cmdString = " + cmdString);
    var cmd = cmdString.substring(1, cmdString.length);
    var params = cmd.split("&");
    switch (Number(params[0]))
    {
        case HtmlCmdList.SignInMatch :
        {
            var MatchID = params[1];
            lm.log("MatchID = " + MatchID);
            matchMsgManager.MatchSignIn(MatchID);
        }
    }
}

/**
 *
 * JS函数名称: saveSystemError
 * 功能描述: 接收系统错误日志
 * JS参数:无
 *
 @Param1 ：string fileName
 @Param2 ：string lineNo
 @Param3 ：string message
 */
function saveSystemError(helper)
{
    var message = ReadStringParam(helper, 0);
    lm.log("Sys.Error = " + message);
    lm.sendLogToServer(); //hanhu #出现系统错误时自动向服务器发送日志 2015/01/08
}


/**
 *
 * JS函数名称: OnPaymentProductFailedZFB
 * 功能描述: 支付宝交易失败
 * JS参数:无
 *
 @Param1 ：string order
 @Param2 ：string message

 */
function OnPaymentProductFailedZFB(helper,  quantity,  code)
{
    var order = ReadStringParam(helper,0);
    var message = ReadStringParam(helper,1);

    //1、 完成订单
    userInfo.CompleteOrder(order);
    layerManager.PopTipLayer(new PopAutoTipsUILayer( message, DefultPopTipsTime),false);
    // 购买失败
    lm.log("支付宝交易失败: " + order + "失败信息"+ message  );

}

/**
 *
 * JS函数名称: OnPaymentProductCompleteZFB
 * 功能描述: 支付宝交易成功
 * JS参数:无
 *     @Param0 ：string order
 *
 */
function OnPaymentProductCompleteZFB(helper,  quantity,  code)
{
    var order = ReadStringParam(helper,0);

    //1、 完成订单
    userInfo.CompleteOrder(order);
    layerManager.PopTipLayer(new PopAutoTipsUILayer("您已经成功购买了该产品！", DefultPopTipsTime),false);
    // 购买失败
    lm.log("支付宝交易成功:"  + order );
    webMsgManager.SendGpProperty(function (data) {

            roomManager.SetMallData(data);
            lm.log("支付成功后商城数据 = " + JSON.stringify(data));

        },
        function (errinfo) {
        },
        this);

}




// 登录网游wangyouSDK成功回调
function OnAndroidTuYouLoginSuccess(helper)
{
    var self = this;
    var LoginAccessToken = ReadStringParam(helper,0);
    lm.log("doudizhuLoginAccessToken = " + LoginAccessToken );
    var staffacount =  DataUtil.GetStaffAccount();
    lm.log("wangyou = " + staffacount );
    lm.log("wangyou = " + helper );
    var data = JSON.parse(LoginAccessToken);
    lm.log("data.uuptid============= "+data.uuptid);
    lm.log("data.token ============= "+data.token);
    //return;
    webMsgManager.SendWangyouLogin(data.token,data.uuptid, 0,function(data){
            DataUtil.AkeyRegisterUser = true;
            var result_account = data["accounts"];
            var result_password = data["password"];
            //设置userId
            var sdkHelper = new lj.Ljsdkhelper();
            sdkHelper.setUserInfo(JSON.stringify(data));

            userInfo.SetCurPlayerInFo(result_account, result_password);
            lm.log("account=== = " + result_account + " password = " + result_password);
            plazaMsgManager.SetLogonCallBack(
                function() // 连接服务器失败
                {
                    // 连接失败重试
                    var pop = new ConfirmPop(this, Poptype.yesno,"当前网络异常，请检查网络状态后重试！");//ok
                    pop.addToNode(cc.director.getRunningScene());
                    pop.hideCloseBtn();
                    pop.setYesNoCallback(
                        function(){
                            plazaMsgManager.LogonPlazaEx(result_account, result_password, GetFuuID(), "");  //默认以前登录方式
                        },
                        function()
                        {
                            ExitGameEx();
                        }
                    );
                    //self.addChild(new PopTipsUILayer("重试","取消","当前网络异常，请检查网络状态后重试！",function(id)
                    //{
                    //    if(id == clickid.ok)
                    //    {
                    //        plazaMsgManager.LogonPlazaEx(result_account, result_password, GetFuuID(), "");  //默认以前登录方式
                    //    }
                    //
                    //
                    //}));

                },
                function() // 登录大厅成功
                {
                    lm.log("登陆大厅成功");
                    if (SubMitAppstoreVersion == true ||  DoNotMatchRoomVersion == true) {
                        //先获取金币房间数据，如果是非法的就去服务器拉取
                        var roomdata = roomManager.GetGoldRoomData();
                        if ((roomdata === undefined) ||
                            (roomdata === null) ||
                            (roomdata.length === 0)) {

                            // 获取金币房间数据成功，立即进入场次列表
                            webMsgManager.SendGpGoldFiled(function (data) {

                                    roomManager.SetGoldRoomData(data);

                                    var curLayer = new RoomUILayer();
                                    curLayer.setTag(ClientModuleType.GoldField);
                                    layerManager.repalceLayer(curLayer);
                                    curLayer.refreshView(RoomType.ROOM_TYPE_GOLD);

                                },
                                function (errinfo) {
                                },
                                this);
                        } else {
                            var curLayer = new RoomUILayer();
                            curLayer.setTag(ClientModuleType.GoldField);
                            layerManager.repalceLayer(curLayer);
                            curLayer.refreshView(RoomType.ROOM_TYPE_GOLD);

                        }

                    } else {

                        var curLayer = new PlazaUILayer();
                        curLayer.setTag(ClientModuleType.Plaza);
                        layerManager.repalceLayer(curLayer);
                    }

                },
                function(info)
                { // 登录大厅失败
                    var pop = new ConfirmPop(this, Poptype.yesno, info);//ok
                    pop.addToNode(cc.director.getRunningScene());
                    pop.hideCloseBtn();
                    pop.setYesNoCallback(
                        function(){
                            ExitGameEx();
                        },
                        function(){
                            ExitGameEx();
                        }
                    );

                    //layerManager.PopTipLayer(new PopTipsUILayer("退出游戏","取消",info,function(id)
                    //{
                    //    if(id == clickid.ok)
                    //    {
                    //        lm.log("退出游戏！");
                    //        // 调用C++退出游戏进程接口
                    //        ExitGame();
                    //    }
                    //
                    //}));
                }
                ,this);
            plazaMsgManager.LogonPlazaEx(result_account, result_password, GetFuuID(), "");  //默认以前登录方式

        },
        function(data){
            lm.log("百度登陆失败, message = " + JSON.stringify(data));
        }, this)
}




