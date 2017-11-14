/**
 * Created by baibo on 15/5/21.
 */


// begin added by lizhongqiang 20150824
// 连接状态
var ConnectStatus =
{
    MBSS_NORMAL: 0,     // 常规状态
    MBSS_CONNECTING: 1,  // 正在连接状态  根据 recvindex 区分是否重连
    MBSS_CONNECTED: 2,    // 连接成功状态
    MBSS_SERVICE: 3,      // 读取服务器数据
    MBSS_ERROR: 4,        // 连接失败，超时
    MBSS_CLOSING: 5      // 连接关闭
};
//end added by lizhongqiang


var MDM_GP_LOGON = 1; //大厅登陆主ID
var ReconnectCMD =
{
    SUB_GP_LOGON_RECONNECT : 6,
    SUB_GP_RESEND : 7,
    SUB_GP_GAME_RECONNECT : 4
};


//连接失败最大次数
var ConnectMaxCount = 2;

var ConnectUtil = cc.Class.extend({
    _PlazaConneting:0,
    _GameConneting:0,
    _MatchConneting:0,
    _lPlazaRecvIndex: 0,
    _lGameRecvIndex: 0,
    _lMatchRecvIndex: 0,

    plazaConnectFailedCount:0,  // 大厅连接失败次数
    gameConnectFailedCount:0,   // 游戏连接失败次数
    matchConnectFailedCount:0,  // 比赛连接失败次数

    ctor: function () {
        var plazaPath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() + "assetManagerTest/src/gameConfigs/plaza.json" : "assetManagerTest/src/gameConfigs/plaza.json");
        if(!jsb.fileUtils.isFileExist(plazaPath))
        {
            plazaPath = "src/gameConfigs/plaza.json";
        }
        this.interfaceConfig = JSON.parse(jsb.fileUtils.getStringFromFile(plazaPath));
    },
    sendAuto: function () {
        var modifiedArguments = [];
        modifiedArguments.push(arguments[0]);
        modifiedArguments.push(arguments[1]);
        modifiedArguments.push(arguments[2]);

        var dataConfig = this.interfaceConfig[arguments[1]][arguments[2]];
        var dataTotalLength = dataConfig["totalLength"];
        modifiedArguments.push(dataTotalLength);

        for (var i = 3; i < arguments.length; i++) {
            var dataType = dataConfig["datas"][i - 3]["type"];
            var dataLength = dataConfig["datas"][i - 3]["length"];
            var dataModified;
            switch (dataType) {
                case 0:
                    dataModified = dataLength + "#" + arguments[i];
                    break;
                case 1:
                    dataModified = dataLength + ":" + arguments[i];
                    break;
            }
            modifiedArguments.push(dataModified);
        }
        SendPacket.apply(this, modifiedArguments);
    },
    sendAutoNoCache: function () {
        var modifiedArguments = [];
        modifiedArguments.push(arguments[0]);
        modifiedArguments.push(arguments[1]);
        modifiedArguments.push(arguments[2]);

        lm.log("yyp------- " + arguments[1]);
        lm.log("yyp------- " + arguments[2]);
        var dataConfig = this.interfaceConfig[arguments[1]][arguments[2]];
        var dataTotalLength = dataConfig["totalLength"];
        modifiedArguments.push(dataTotalLength);

        for (var i = 3; i < arguments.length; i++) {
            var dataType = dataConfig["datas"][i - 3]["type"];
            var dataLength = dataConfig["datas"][i - 3]["length"];
            var dataModified;
            switch (dataType) {
                case 0:
                    dataModified = dataLength + "#" + arguments[i];
                    break;
                case 1:
                    dataModified = dataLength + ":" + arguments[i];
                    break;
            }
            modifiedArguments.push(dataModified);
        }


        SendPacketNoCache.apply(this, modifiedArguments);
    },
    sendManualNoCache: function () {
        SendPacketNoCache.apply(this, arguments);
    },
    sendManual: function () {
        SendPacket.apply(this, arguments);
    },
    init: function (host, port, location, successCallback, failedCallbak) {
        this.rebuildSocket(location);
        lm.log("连接服务器 location=" + location + " host = " + host + " port = " + port);
        Connect(location, host, port);
        lm.log("连接完成");
        this._connectSucess = successCallback;
        this._connectFailed = failedCallbak;
    },
    rebuildSocket: function (type) {
        RebuildSocket(type);
    },
    dataListenerAuto: function (server, wMainCmdID, func) {
        var funcName = "func_" + server + "_" + wMainCmdID;
        this[funcName] = func;
    },
    dataListenerManual: function (server, wMainCmdID, wSubCmdID, func) {


        var funcName = "func_"+ server + "_" + wMainCmdID + "_" + wSubCmdID;
        lm.log("绑定消息" + funcName );
        this[funcName] = func;
    },

    dataListenerManualEx: function (gameid,server, wMainCmdID, wSubCmdID, func) {

        var funcName = "func_" +gameid+"_"+ server + "_" + wMainCmdID + "_" + wSubCmdID;
        lm.log("绑定消息" + funcName );
        this[funcName] = func;
    },


    _emitData: function (server, wMainCmdID, wSubCmdID, SerializeObject, wDataSize) {
        var readInterfaceConfig = {};
        if (server == 0) {
            readInterfaceConfig = this.interfaceConfig;
        }

        var getData;
        if (readInterfaceConfig.hasOwnProperty(wMainCmdID)) {
            if (readInterfaceConfig.hasOwnProperty(wSubCmdID)) {
                getData = {};
                var subCmdIdConfig = readInterfaceConfig[wMainCmdID][wSubCmdID];
                for (var key in subCmdIdConfig["datas"]) {
                    var data;
                    switch (subCmdIdConfig["datas"][key]["type"]) {
                        case 0:
                            data = Number(DataUtil.ReadNumber(SerializeObject, subCmdIdConfig["datas"][key]["length"]));
                            break;
                        case 1:
                            data = ReadString(SerializeObject, subCmdIdConfig["datas"][key]["length"]);
                            break;
                    }
                    getData[subCmdIdConfig["datas"][key]["name"]] = data;
                }
            }
        }
        //区分比赛消息和游戏内消息
        if (server == KernelMatch) {
            var length = MsgInMatch.length;
            ////lm.log("比赛消息长度为:" + length);
            var flag = true;
            var value = server + "_" + wMainCmdID + "_" + wSubCmdID;
            for (var i = 0; i < length; i++) {
                if (MsgInMatch[i] == value) {
                    flag = false;
                    break
                }
            }
            if (flag) {
                server = KernelGame;
            }
        }


        if (getData) {
            var funcName = "func_"+ server + "_" + wMainCmdID;
            if (this[funcName]) {
                this[funcName].call(this, wSubCmdID, getData, wDataSize);
            } else {
                lm.log("auto UnCasted: " + server + "_" + wMainCmdID + "_" + wSubCmdID);
            }
        } else {

            var funcName = "func_" +Game_ID+"_"+ server + "_" + wMainCmdID + "_" + wSubCmdID;
            lm.log("处理消息" + funcName + " 0 ");
            if (this[funcName]) {
                lm.log("处理消息" + funcName + " 1");
                this[funcName].call(this, SerializeObject, wDataSize)
            }
            else {

                lm.log("处理消息" + funcName + " 2");
                funcName = "func_" + server + "_" + wMainCmdID + "_" + wSubCmdID;
                if (this[funcName]) {
                    lm.log("处理消息" + funcName + " 3");
                    this[funcName].call(this, SerializeObject, wDataSize)
                }

            }
        }
    },

    //发送http 请求
    SendPostHttpRequest: function (weburl,
                                   cmd,               //命令
                                   strContent,        //内容
                                   SuccessedCallBack, //成功回调
                                   FailedCallBack,    //失败回调
                                   target)            //目标参数
    {
        console.log("SendHttpRequest content: " + strContent);

        var httpRequest = cc.loader.getXMLHttpRequest();

        lm.log( String(weburl + cmd));
        httpRequest.open("POST", String(weburl + cmd), true);
        httpRequest.setRequestHeader("Content-Type", "application/json");
        httpRequest.send(strContent);
        httpRequest.onreadystatechange = function () {
            lm.log("SendHttpRequest  readyState:" + httpRequest.readyState);
            lm.log("SendHttpRequest  status:" + httpRequest.status);
            if (httpRequest.readyState == 4 && (httpRequest.status >= 200 && httpRequest.status <= 207)) {
                var httpStatus = httpRequest.statusText;
                var response = httpRequest.responseText;

                if (SuccessedCallBack !== null) {
                    lm.log("http get text: " + httpRequest.responseText);
                    SuccessedCallBack.call(target, httpRequest.responseText);
                }

            } else {
                if (FailedCallBack != null) {
                    FailedCallBack.call(target, httpRequest.responseText);
                }
            }
        }
    },
    // get
    SenGetHttpRequest: function (weburl,
                                 cmd,
                                 sign,
                                 data,
                                 SuccessedCallBack, //成功回调
                                 FailedCallBack,    //失败回调
                                 target)            //目标参数)
    {
        var httpRequest = cc.loader.getXMLHttpRequest();
        if (httpRequest === undefined || httpRequest === null) {
            lm.log("httpRequest object is null");
            return;
        }

        var url = weburl + cmd + "?sign=" + sign + "&data=" + encodeURIComponent(data);
        var url2 = weburl + cmd + "?sign=" + sign + "&data=" + data;
        lm.log("urla:" + url2);
        httpRequest.open("GET", url, true);
        httpRequest.send();
        httpRequest.onreadystatechange = function () {

            lm.log("SendHttpRequest  status:" + httpRequest.status);
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                var httpStatus = httpRequest.statusText;
                var response = httpRequest.responseText;

                if (SuccessedCallBack !== null) {
                    lm.log("http get text: " + httpRequest.responseText);
                    SuccessedCallBack.call(target, httpRequest.responseText);
                }

            } else {
                if (FailedCallBack != null) {
                    FailedCallBack.call(target, httpRequest.responseText);
                }
            }
        }

    },
    // get
    SenGetHttpRequestHTML: function (weburl,
                                 data,
                                 SuccessedCallBack, //成功回调
                                 FailedCallBack,    //失败回调
                                 target)            //目标参数)
    {
        var httpRequest = cc.loader.getXMLHttpRequest();
        if (httpRequest === undefined || httpRequest === null) {
            lm.log("httpRequest object is null");
            return;
        }

        var url = weburl + "?data=" + encodeURIComponent(data);
        var url2 = weburl + "?data=" + data;
        lm.log("urla:" + url2);
        httpRequest.open("GET", url, true);
        httpRequest.send();
        httpRequest.onreadystatechange = function () {

            lm.log("SendHttpRequest  status:" + httpRequest.status);
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                var httpStatus = httpRequest.statusText;
                var response = httpRequest.responseText;

                if (SuccessedCallBack !== null) {
                    lm.log("http get text: " + httpRequest.responseText);
                    SuccessedCallBack.call(target, httpRequest.responseText);
                }

            } else {
                if (FailedCallBack != null) {
                    FailedCallBack.call(target, httpRequest.responseText);
                }
            }
        }

    },
    // 大厅连接
    OnPlazaSocketLickStatus: function (state) {
        lm.log("大厅状态更新" + state);
        var self = this;
        switch (state) {
            case ConnectStatus.MBSS_NORMAL:   // 常规状态
            {
                lm.log("大厅处于常规状态");
            }
                break;
            case ConnectStatus.MBSS_CONNECTING: // 正在连接状态根据 recvindex 区分是否重连
            {
                lm.log("大厅处于正在连接状态");
            }
                break;
            case ConnectStatus.MBSS_CLOSING: // 连接关闭
            {
                lm.log("大厅连接已断开...");
                //begin added by lizhongqiang 2015-09-29 15:30
                //自动断开连接信用减少
                logonAddressListManger.ReduceCreditLevel(plazaMsgManager.address);

                var serveritem = logonAddressListManger.GetNextAddress();
                if(serveritem !== null) {
                    plazaMsgManager.SetPlazaLogonAddress(serveritem["serveradd"], serveritem["serverport"]);
                }

                // 无全局用户数据
                if (userInfo.globalUserdData !== null)
                {
                    //lm.log("大厅处于连接关闭状态");
                    this._PlazaConneting = 2;


                    //新增加大厅重连次数限制- added by lizhongqiang 2015-10-21 15:35
                    if(plazaMsgManager.ReConnectCount < ReConnectMaxCount.plaza)
                    {
                        lm.log("大厅断线，游戏中的重连...");
                        Connect(KernelPlaza, plazaMsgManager.address, plazaMsgManager.port);

                        //累计本次重连的次数
                        plazaMsgManager.ReConnectCount++;

                    }else
                    {
                        plazaMsgManager.ReConnectCount=0;

                        var pop = new ConfirmPop(this, Poptype.yesno, "当前网络出现异常，请检查网络，重新登录游戏！");//ok
                        pop.addToNode(cc.director.getRunningScene());
                        pop.hideCloseBtn();
                        pop.setYesNoCallback(
                            function(){
                                userInfo.ClearUserData();
                                cc.director.runScene(new rootUIScene());
                            },
                            function()
                            {
                                ExitGameEx();
                            }
                        );

                        //layerManager.PopTipLayer(new PopTipsUILayer("确定", "取消", "当前网络出现异常，请检查网络，重新登录游戏！", function (id) {
                        //    if (id == clickid.ok) {
                        //        // 回到登陆界面
                        //        userInfo.ClearUserData();
                        //        cc.director.runScene(new rootUIScene());
                        //
                        //        //var scene = new rootScene();
                        //        //layerManager.addLayerToParent(new LoginUILayer(), scene);
                        //        //cc.director.replaceScene(scene);
                        //    } else {
                        //        ExitGameEx();
                        //    }
                        //
                        //}, this), false);
                    }
                    //end added by lizhongqiang 2015-10-21

                }else
                {
                    lm.log("大厅断线，登录界面的重连...");

                    var pop = new ConfirmPop(this, Poptype.yesno, "当前网络异常，请检查网络状态后重试！");//ok
                    pop.addToNode(cc.director.getRunningScene());
                    pop.hideCloseBtn();
                    pop.setYesNoCallback(
                        function(){
                            // 连接失败，轮询IP，重新连接， 若没有再获取到地址就说明真的失败了；
                            var serveritem = logonAddressListManger.GetNextAddress();
                            if (serveritem !== null) {

                                layerManager.PopTipLayer(new WaitUILayer("正在登录服务器，请稍后...",function()
                                {
                                },this));

                                plazaMsgManager.SetPlazaLogonAddress(serveritem["serveradd"], serveritem["serverport"]);

                                //登录界面的登录超时
                                //区分一键注册 和 账号登录
                                if (DataUtil.AkeyRegisterUser) {
                                    lm.log("大厅连接失败, 一键注册 重新登录");
                                    // 登录大厅
                                    plazaMsgManager.LogonPlazaEx(userInfo.GetCurPlayerAccount(), userInfo.GetCurPlayerPassword(), GetFuuID(), "");

                                } else {
                                    lm.log("大厅连接失败, 重新登录");
                                    var IsAkeyRegisterUser = false;
                                    var IsMobileNoLogin = false;
                                    for (var i = 0; i < userInfo.GetLocalDataCount(); i++) {
                                        var historydata = userInfo.GetLocalData(i);
                                        if ((historydata["account"] == userInfo.GetCurPlayerAccount()) &&
                                            (userInfo.GetCurPlayerPassword() == historydata["password"])) {
                                            IsAkeyRegisterUser = historydata["type"];
                                            IsMobileNoLogin = historydata["loginType"];
                                            break;
                                        }
                                    }

                                    // 一键注册的账户登录
                                    if (IsAkeyRegisterUser == true) {
                                        // 登录大厅
                                        plazaMsgManager.LogonPlazaEx(userInfo.GetCurPlayerAccount(),
                                            userInfo.GetCurPlayerPassword(),
                                            GetFuuID(), "");

                                    } else {
                                        // 登录大厅
                                        //if(IsMobileNoLogin == LoginType.phone)
                                        //{
                                        //    plazaMsgManager.LogonPlazaByMobileNo(userInfo.GetCurPlayerAccount(),
                                        //        userInfo.GetCurPlayerPassword(),
                                        //        GetFuuID(), "");
                                        //}
                                        //else
                                        {
                                            plazaMsgManager.LogonPlaza(userInfo.GetCurPlayerAccount(),
                                                userInfo.GetCurPlayerPassword(),
                                                GetFuuID(), "");
                                        }

                                    }
                                }
                            }
                        },
                        function()
                        {
                            ExitGameEx();
                        }
                    );

                    // 连接失败重试
                    //layerManager.PopTipLayer(new PopTipsUILayer("重试","取消","当前网络异常，请检查网络状态后重试！",function(id)
                    //{
                    //    if(id ==clickid.ok ) {
                    //        // 连接失败，轮询IP，重新连接， 若没有再获取到地址就说明真的失败了；
                    //        var serveritem = logonAddressListManger.GetNextAddress();
                    //        if (serveritem !== null) {
                    //
                    //            layerManager.PopTipLayer(new WaitUILayer("正在登录服务器，请稍后...",function()
                    //            {
                    //            },this));
                    //
                    //            plazaMsgManager.SetPlazaLogonAddress(serveritem["serveradd"], serveritem["serverport"]);
                    //
                    //            //登录界面的登录超时
                    //            //区分一键注册 和 账号登录
                    //            if (DataUtil.AkeyRegisterUser) {
                    //                lm.log("大厅连接失败, 一键注册 重新登录");
                    //                // 登录大厅
                    //                plazaMsgManager.LogonPlazaEx(userInfo.GetCurPlayerAccount(), userInfo.GetCurPlayerPassword(), GetFuuID(), "");
                    //
                    //            } else {
                    //                lm.log("大厅连接失败, 重新登录");
                    //                var IsAkeyRegisterUser = false;
                    //                var IsMobileNoLogin = false;
                    //                for (var i = 0; i < userInfo.GetLocalDataCount(); i++) {
                    //                    var historydata = userInfo.GetLocalData(i);
                    //                    if ((historydata["account"] == userInfo.GetCurPlayerAccount()) &&
                    //                        (userInfo.GetCurPlayerPassword() == historydata["password"])) {
                    //                        IsAkeyRegisterUser = historydata["type"];
                    //                        IsMobileNoLogin = historydata["loginType"];
                    //                        break;
                    //                    }
                    //                }
                    //
                    //                // 一键注册的账户登录
                    //                if (IsAkeyRegisterUser == true) {
                    //                    // 登录大厅
                    //                    plazaMsgManager.LogonPlazaEx(userInfo.GetCurPlayerAccount(),
                    //                        userInfo.GetCurPlayerPassword(),
                    //                        GetFuuID(), "");
                    //
                    //                } else {
                    //                    // 登录大厅
                    //                    //if(IsMobileNoLogin == LoginType.phone)
                    //                    //{
                    //                    //    plazaMsgManager.LogonPlazaByMobileNo(userInfo.GetCurPlayerAccount(),
                    //                    //        userInfo.GetCurPlayerPassword(),
                    //                    //        GetFuuID(), "");
                    //                    //}
                    //                    //else
                    //                    {
                    //                        plazaMsgManager.LogonPlaza(userInfo.GetCurPlayerAccount(),
                    //                            userInfo.GetCurPlayerPassword(),
                    //                            GetFuuID(), "");
                    //                    }
                    //
                    //                }
                    //            }
                    //        }
                    //
                    //
                    //
                    //    }
                    //
                    //}),false);
                }
                //end added by lizhongqiang 2015-09-29
            }
                break;
            case ConnectStatus.MBSS_CONNECTED: // 连接成功状态
            {
                lm.log("大厅连接成功");
                //begin added by lizhongqiang 2015-09-29 15:30
                //连接成功信用增加
                logonAddressListManger.AddCreditLevel(plazaMsgManager.address);

                this.plazaConnectFailedCount = 0;
                //end added by lizhongqiang 2015-09-29

                if(this._PlazaConneting == 2) //首次登陆不进行数据包请求
                {
                    this._PlazaConneting = 0;
                    lm.log("大厅连接成功，请求数据包");
                    lm.log("key = " +  plazaMsgManager.ReconnectKey + " id = " + userInfo.globalUserdData["dwUserID"] + " sendIndex = " +  this._lPlazaRecvIndex);
                    this.sendManualNoCache(KernelPlaza,
                        MDM_GP_LOGON,
                        ReconnectCMD.SUB_GP_LOGON_RECONNECT,
                        16,
                        "32#" + plazaMsgManager.ReconnectKey,
                        "32#" + userInfo.globalUserdData["dwUserID"],
                        "64#" + this._lPlazaRecvIndex);
                }
                else
                {
                    lm.log("调用成功回调");
                    this._connectSucess.call(this, KernelPlaza, 1);
                }

            }
                break;
            case ConnectStatus.MBSS_ERROR: // 连接失败
            {
                //begin added by lizhongqiang 2015-09-29 15:30
                //连接失败信用减少
                logonAddressListManger.ReduceCreditLevel(plazaMsgManager.address);

                if (this._lPlazaRecvIndex != 0) {

                    plazaMsgManager.ReConnectCount = 0;
                    var pop = new ConfirmPop(this, Poptype.yesno, "当前网络出现异常，请检查网络，重新登录游戏！");//ok
                    pop.addToNode(cc.director.getRunningScene());
                    pop.hideCloseBtn();
                    pop.setYesNoCallback(
                        function(){
                            userInfo.ClearUserData();
                            cc.director.runScene(new rootUIScene());
                        },
                        function()
                        {
                            ExitGameEx();
                        }
                    );
                    //layerManager.PopTipLayer(new PopTipsUILayer("确定", "取消", "当前网络出现异常，请检查网络，重新登录游戏！", function (id) {
                    //    if (id == clickid.ok) {
                    //        // 回到登陆界面
                    //        userInfo.ClearUserData();
                    //        cc.director.runScene(new rootUIScene());
                    //
                    //        //var scene = new rootScene();
                    //        //layerManager.addLayerToParent(new LoginUILayer(), scene);
                    //        //cc.director.replaceScene(scene);
                    //    } else {
                    //        ExitGameEx();
                    //    }
                    //
                    //}, this), false);

                } else
                {
                    // 连接失败，轮询IP，重新连接， 若没有再获取到地址就说明真的失败了；
                    var serveritem = logonAddressListManger.GetNextAddress();
                    if(serveritem !== null)
                    {
                        plazaMsgManager.SetPlazaLogonAddress(serveritem["serveradd"],serveritem["serverport"]);
                        // 仅有1个地址，并且是首地址,连接失败通知上层
                        if((logonAddressListManger.firstAddressItem["serveradd"] !== undefined) &&
                            (serveritem["serveradd"] == logonAddressListManger.firstAddressItem["serveradd"]))
                        {
                            if(this.plazaConnectFailedCount <= ConnectMaxCount)
                            {
                                Connect(KernelPlaza, plazaMsgManager.address, plazaMsgManager.port);
                                this.plazaConnectFailedCount++;

                            }else
                            {
                                this.plazaConnectFailedCount = 0;
                                this._connectSucess.call(this, KernelPlaza, 0);
                            }
                        }else
                        {
                            Connect(KernelPlaza, plazaMsgManager.address, plazaMsgManager.port);
                        }

                    }else
                    {
                        this._connectSucess.call(this, KernelPlaza, 0);
                    }
                }

                // end added by lizhongqiang 2015-09-29
            }
                break;
            case ConnectStatus.MBSS_SERVICE:   // 读取服务器数据
                break;
            default :
                break;
        }
    },

    OnGameSocketLickStatus: function (state) {

        ////lm.log("OnGameSocketLickStatus  state:  " + state);
        switch (state) {
            case ConnectStatus.MBSS_NORMAL:   // 常规状态
            {
            }
                break;
            case ConnectStatus.MBSS_CONNECTING: // 正在连接状态根据 recvindex 区分是否重连
            {
            }
                break;
            case ConnectStatus.MBSS_CLOSING: // 连接关闭
            {

                //begin added by lizhongqiang 2015-09-29 15:30
                //自动断开连接信用减少
                logonAddressListManger.ReduceCreditLevel(plazaMsgManager.address);

                this._GameConneting = 2;

                // 断线重连，优先使用信用最高的地址
                var serveritem = logonAddressListManger.GetNextAddress();
                if(serveritem !== null)
                {
                    plazaMsgManager.SetPlazaLogonAddress(serveritem["serveradd"],serveritem["serverport"]);
                }

                //游戏重连次数限制，大于3次，给出提示
                if(sparrowDirector.ReConnectCount < ReConnectMaxCount.game)
                {
                    lm.log("游戏断线，重连...");
                    Connect(KernelGame, plazaMsgManager.address, sparrowDirector.roomport);

                    //累计本次重连的次数
                    sparrowDirector.ReConnectCount++;

                }else
                {
                    plazaMsgManager.ReConnectCount=0;
                    sparrowDirector.ReConnectCount=0;

                    //还没有回到登录界面就给出提示
                    if (userInfo.globalUserdData !== null)
                    {
                        var pop = new ConfirmPop(this, Poptype.yesno, "当前网络出现异常，请检查网络，重新登录游戏！");//ok
                        pop.addToNode(cc.director.getRunningScene());
                        pop.hideCloseBtn();
                        pop.setYesNoCallback(
                            function(){
                                userInfo.ClearUserData();
                                cc.director.runScene(new rootUIScene());
                            },
                            function()
                            {
                                ExitGameEx();
                            }
                        );
                        //layerManager.PopTipLayer(new PopTipsUILayer("确定", "取消", "当前网络出现异常，请检查网络，重新登录游戏！", function (id) {
                        //    if (id == clickid.ok) {
                        //        // 回到登陆界面
                        //        userInfo.ClearUserData();
                        //        cc.director.runScene(new rootUIScene());
                        //
                        //        //var scene = new rootScene();
                        //        //layerManager.addLayerToParent(new LoginUILayer(), scene);
                        //        //cc.director.replaceScene(scene);
                        //    } else {
                        //        ExitGameEx();
                        //    }
                        //
                        //}, this), false);
                    }

                }
                //end added by lizhongqiang 2015-10-21

            }
                break;
            case ConnectStatus.MBSS_CONNECTED: // 连接成功状态
            {
                ////lm.log("游戏连接成功状态");

                //begin added by lizhongqiang 2015-09-29 16:40
                //连接成功信用增加
                logonAddressListManger.AddCreditLevel(plazaMsgManager.address);

                this.gameConnectFailedCount = 0;
                //end added by lizhongqiang 2015-09-29


                if(this._GameConneting == 2) //首次登陆不进行数据包请求
                {
                    this._GameConneting = 0;
                    ////lm.log("游戏连接成功，请求数据包");
                    ////lm.log("key = " +  plazaMsgManager.ReconnectKey + " id = " + userInfo.globalUserdData["dwUserID"] + " sendIndex = " +  this._lGameRecvIndex + "machineID =" + sparrowDirector.LoginInfo["machinid"]);
                    this.sendManualNoCache(KernelGame,
                        MDM_GP_LOGON,
                        ReconnectCMD.SUB_GP_GAME_RECONNECT,
                        82,
                        "32#" + userInfo.globalUserdData["dwReConnectKey"],
                        "32#" + userInfo.globalUserdData["dwUserID"],
                        "64#" + this._lGameRecvIndex,
                        "33:" + GetFuuID());
                }
                else
                {
                    this._connectSucess.call(this, KernelGame, 1);
                }

            }
                break;
            case ConnectStatus.MBSS_ERROR: // 连接失败
            {

                //begin added by lizhongqiang 2015-09-29 16:40
                //连接失败信用减少
                logonAddressListManger.ReduceCreditLevel(plazaMsgManager.address);

                //end added by lizhongqiang 2015-09-29

                CloseGameSocket(KernelPlaza);
                CloseGameSocket(KernelGame);

                plazaMsgManager.ReConnectCount = 0;
                sparrowDirector.ReConnectCount = 0;

                //////lm.log("reconnect Plaza 连接失败  err.");
                if (this._lGameRecvIndex != 0) {

                    var pop = new ConfirmPop(this, Poptype.yesno, "当前网络出现异常，请检查网络，重新登录游戏！");//ok
                    pop.addToNode(cc.director.getRunningScene());
                    pop.hideCloseBtn();
                    pop.setYesNoCallback(
                        function(){
                            userInfo.ClearUserData();
                            cc.director.runScene(new rootUIScene());
                        },
                        function()
                        {
                            ExitGameEx();
                        }
                    );
                    //layerManager.PopTipLayer(new PopTipsUILayer("确定", "取消", "当前网络出现异常，请检查网络，重新登录游戏！", function (id) {
                    //    if (id == clickid.ok) {
                    //        // 回到登陆界面
                    //        userInfo.ClearUserData();
                    //        cc.director.runScene(new rootUIScene());
                    //
                    //        //var scene = new rootScene();
                    //        //layerManager.addLayerToParent(new LoginUILayer(), scene);
                    //        //cc.director.replaceScene(scene);
                    //    } else {
                    //        ExitGameEx();
                    //    }
                    //
                    //}, this), false);
                } else
                {
                    // begin added by lizhongqiang 2015-09-29 16:45
                    // 连接失败，轮询IP，重新连接， 若没有再获取到地址就说明真的失败了；
                    var serveritem = logonAddressListManger.GetNextAddress();
                    if(serveritem !== null)
                    {
                        plazaMsgManager.SetPlazaLogonAddress(serveritem["serveradd"],serveritem["serverport"]);
                        // 仅有1个地址，并且是首地址
                        if((logonAddressListManger.firstAddressItem["serveradd"] !== undefined) &&
                            (serveritem["serveradd"] == logonAddressListManger.firstAddressItem["serveradd"]))
                        {
                            // 尝试连接2次，若再失败就提示错误
                            if(this.gameConnectFailedCount <= ConnectMaxCount)
                            {
                                Connect(KernelGame, plazaMsgManager.address, sparrowDirector.roomport);
                                this.gameConnectFailedCount++;

                            }else
                            {
                                this.gameConnectFailedCount = 0;
                                this._connectSucess.call(this, KernelGame, 0);
                            }

                        }else
                        {
                            Connect(KernelGame, plazaMsgManager.address, sparrowDirector.roomport);
                        }

                    }else
                    {
                        this._connectSucess.call(this, KernelGame, 0);
                    }
                    // end added by lizhongqiang 2015-09-29
                }

            }
                break;
            case ConnectStatus.MBSS_SERVICE:   // 读取服务器数据
                break;

            default :
                break;
        }
    },


    OnMatchSocketLickStatus: function (state) {
        switch (state) {
            case ConnectStatus.MBSS_NORMAL:   // 常规状态
            {
                //////lm.log("比赛处于常规状态");

            }
                break;
            case ConnectStatus.MBSS_CONNECTING: // 正在连接状态根据 recvindex 区分是否重连
            {
                //////lm.log("比赛处于正在连接状态");

            }
                break;
            case ConnectStatus.MBSS_CLOSING: // 连接关闭
            {
                lm.log("比赛连接关闭+++++++++++++++");
                //begin added by lizhongqiang 2015-10-21 16:09
                //自动断开连接信用减少
                logonAddressListManger.ReduceCreditLevel(plazaMsgManager.address);

                this._MatchConneting = 2;

                // 断线重连，优先使用信用最高的地址
                var serveritem = logonAddressListManger.GetNextAddress();
                if(serveritem !== null)
                {
                    plazaMsgManager.SetPlazaLogonAddress(serveritem["serveradd"],serveritem["serverport"]);
                }

                //游戏重连次数限制，大于3次，给出提示
                if(matchMsgManager.ReConnectCount < ReConnectMaxCount.match)
                {
                    lm.log("比赛断线，重连...");
                    Connect(KernelMatch, plazaMsgManager.address, matchMsgManager.ConnectPort);

                    //累计本次重连的次数
                    matchMsgManager.ReConnectCount++;

                }else
                {
                    plazaMsgManager.ReConnectCount=0;
                    matchMsgManager.ReConnectCount=0;

                    //还没有回到登录界面就给出提示
                    if (userInfo.globalUserdData !== null)
                    {
                        var pop = new ConfirmPop(this, Poptype.yesno, "当前网络出现异常，请检查网络，重新登录游戏！");//ok
                        pop.addToNode(cc.director.getRunningScene());
                        pop.hideCloseBtn();
                        pop.setYesNoCallback(
                            function(){
                                userInfo.ClearUserData();
                                cc.director.runScene(new rootUIScene());
                            },
                            function()
                            {
                                ExitGameEx();
                            }
                        );
                        //layerManager.PopTipLayer(new PopTipsUILayer("确定", "取消", "当前网络出现异常，请检查网络，重新登录游戏！", function (id) {
                        //    if (id == clickid.ok) {
                        //        // 回到登陆界面
                        //        userInfo.ClearUserData();
                        //        cc.director.runScene(new rootUIScene());
                        //
                        //        //var scene = new rootScene();
                        //        //layerManager.addLayerToParent(new LoginUILayer(), scene);
                        //        //cc.director.replaceScene(scene);
                        //    } else {
                        //        ExitGameEx();
                        //    }
                        //
                        //}, this), false);
                    }
                }
                //end added by lizhongqiang 2015-10-21

            }
                break;
            case ConnectStatus.MBSS_CONNECTED: // 连接成功状态
            {
                //////lm.log("比赛处于连接成功状态");

                //begin added by lizhongqiang 2015-09-29 16:50
                //连接成功信用增加
                logonAddressListManger.AddCreditLevel(plazaMsgManager.address);

                this.matchConnectFailedCount = 0;
                //end added by lizhongqiang 2015-09-29


                if(this._MatchConneting == 2) //首次登陆不进行数据包请求
                {
                    this._MatchConneting = 0;
                    lm.log("比赛连接成功，请求数据包");
                    lm.log("key = " +  matchMsgManager._reconnectKey + " Matchid = " + MatchAttendingInfo.MatchID + " roundID = " +  MatchAttendingInfo.RoundID + " Sendindex" +  this._lMatchRecvIndex);
                    this.sendManualNoCache(KernelMatch,
                        MDM_GP_LOGON,
                        ReconnectCMD.SUB_GP_GAME_RECONNECT,
                        24,
                        "32#" + matchMsgManager._reconnectKey,
                        "32#" + userInfo.globalUserdData["dwUserID"],
                        "64#" + this._lMatchRecvIndex,
                        "32#" + MatchAttendingInfo.MatchID,
                        "32#" + MatchAttendingInfo.RoundID);
                }
                else
                {
                    this._connectSucess.call(this, KernelMatch, 1);
                }
            }
                break;
            case ConnectStatus.MBSS_ERROR: // 连接失败，超时
            {
                lm.log("比赛连接失败！");
                if (this._lMatchRecvIndex != 0) {

                    plazaMsgManager.ReConnectCount = 0;

                    lm.log("比赛连接失败 1！");
                    var pop = new ConfirmPop(this, Poptype.yesno, "当前网络出现异常，请检查网络，重新登录游戏！");//ok
                    pop.addToNode(cc.director.getRunningScene());
                    pop.hideCloseBtn();
                    pop.setYesNoCallback(
                        function(){
                            userInfo.ClearUserData();
                            cc.director.runScene(new rootUIScene());
                        },
                        function()
                        {
                            ExitGameEx();
                        }
                    );
                    //layerManager.PopTipLayer(new PopTipsUILayer("确定", "取消", "当前网络出现异常，请检查网络，重新登录游戏3！", function (id) {
                    //    if (id == clickid.ok) {
                    //        // 回到登陆界面
                    //        userInfo.ClearUserData();
                    //        cc.director.runScene(new rootUIScene());
                    //
                    //        //var scene = new rootScene();
                    //        //layerManager.addLayerToParent(new LoginUILayer(), scene);
                    //        //cc.director.replaceScene(scene);
                    //
                    //    } else {
                    //        ExitGameEx();
                    //    }
                    //
                    //}, this), false);
                } else {

                    lm.log("比赛连接失败 2！");
                    // begin added by lizhongqiang 2015-09-29 16:56
                    // 连接失败，轮询IP，重新连接， 若没有再获取到地址就说明真的失败了；
                    var serveritem = logonAddressListManger.GetNextAddress();
                    if(serveritem !== null)
                    {
                        plazaMsgManager.SetPlazaLogonAddress(serveritem["serveradd"],serveritem["serverport"]);

                        // 仅有1个地址，并且是首地址,连接失败通知上层
                        if((logonAddressListManger.firstAddressItem["serveradd"] !== undefined) &&
                            (serveritem["serveradd"] == logonAddressListManger.firstAddressItem["serveradd"]))
                        {
                            if(this.matchConnectFailedCount <= ConnectMaxCount)
                            {
                                Connect(KernelMatch, plazaMsgManager.address, matchMsgManager.ConnectPort);
                                this.matchConnectFailedCount++;

                            }else
                            {
                                this.matchConnectFailedCount = 0;
                                this._connectSucess.call(this, KernelGame, 0);
                            }

                        }else
                        {
                            Connect(KernelMatch, plazaMsgManager.address, matchMsgManager.ConnectPort);
                        }

                    }else
                    {
                        this._connectSucess.call(this, KernelGame, 0);
                    }
                    // end added by lizhongqiang 2015-09-29
                }

            }
                break;
            case ConnectStatus.MBSS_SERVICE:   // 读取服务器数据
                break;
            default :
                break;
        }

    }

});

var connectUtil = connectUtil || new ConnectUtil();


//C++层回调方法
// begin  added by lizhongqiang 201508024
//返回连接状态
function OnSocketLickStatus(location, state) {
    //////lm.log("连接位置为：" + location);
    if (location == KernelPlaza) {
        connectUtil.OnPlazaSocketLickStatus(state);

    } else if (location == KernelGame) {
        connectUtil.OnGameSocketLickStatus(state);
    }
    else if (location == KernelMatch) {
        connectUtil.OnMatchSocketLickStatus(state);
    }
}

//接受服务器消息
function OnSocketCmd(server, wMainCmdID, wSubCmdID, lRecvindex, lSendindex, SerializeObject, wDataSize) {
    //lm.log("got a message from server");
    lm.log("lSendindex" + "   " + lSendindex);

    // 保存服务器的发送索引,断线重连时需要使用。
    if(lSendindex == 18446744073709552000)
    {
        ////lm.log("收到特殊值18446744073709552000");
    }
    if (lSendindex > 0 && lSendindex != 18446744073709552000) {
        if (server == KernelPlaza) {

            connectUtil._lPlazaRecvIndex = lSendindex;
        } else if (server == KernelGame) {
            ////lm.log("Sendindex = " + lSendindex);
            connectUtil._lGameRecvIndex = lSendindex;
        }
        else if (server == KernelMatch) {
            connectUtil._lMatchRecvIndex = lSendindex;
        }
    }

    // end added by lizhongqiang

    connectUtil._emitData(server, wMainCmdID, wSubCmdID, SerializeObject, wDataSize);
}


////below is test
//connectUtil.init("192.168.5.99", 8300, 0, function (a, b) {
//    //connectUtil.init("192.168.5.10", 8300, 0, function (a, b) {
//    lm.log("connect success");
//    lm.log(a + " " + b);
//    //connectUtil.sendAuto(0, 100, 2, 378, 101056516, 64, MD5String("123456"), "蓝钻", "12432123", "2432432423423227");
//    //connectUtil.send(0, 100, 2, 227, "16#378", "32#101056516", "8#64", "33:" + MD5String("123456"), "32:蓝钻", "33:12432123", "12:2432432423423227");
//}, function (a, b) {
//    lm.log("connection failed");
//    lm.log(a + "  " + b);
//});

//connectUtil.dataListenerAuto(0, ConnectionDefine.MDM_MB_LOGON, function (wSbuCmdID, data, size) {
//    if (wSbuCmdID == ConnectionDefine.SUB_MB_LOGON_SUCCESS) {
//        lm.log(data);
//        userInfo.serverInfoData = data;
//    }
//});

//connectUtil.dataListenerManual(0,ConnectionDefine.MDM_MB_SERVER_LIST, ConnectionDefine.SUB_MB_LIST_SERVER, function (SerializeObject, wDataSize) {
//    var count = wDataSize / 146;
//    lm.log("data LIST_SERVER " + count);
//    for (var i = 0; i < Math.floor(count); i++) {
//        var data = {};
//        data["wKindID"] = DataUtil.ReadNumber(SerializeObject, 16);
//        data["wNodeID"] = DataUtil.ReadNumber(SerializeObject, 16);
//        data["wSortID"] = DataUtil.ReadNumber(SerializeObject, 16);
//        data["wServerID"] = DataUtil.ReadNumber(SerializeObject, 16);
//        data["wServerPort"] = DataUtil.ReadNumber(SerializeObject, 16);
//        data["dwOnLineCount"] = DataUtil.ReadNumber(SerializeObject, 32);
//        data["dwFullCount"] = DataUtil.ReadNumber(SerializeObject, 32);
//        //data["szServerAddr"] = ReadString(SerializeObject,32);
//        //data["szServerName"] = ReadString(SerializeObject,32);
//
//        lm.log("server list is " + JSON.stringify(data));
//    }
//
//})


//var xhr = cc.loader.getXMLHttpRequest();
//xhr.open("POST","http://www.baidu.com");
//xhr.setRequestHeader("Content-Type","text/plain");
//xhr.send(new Uint8Array([1,2,3,4,5]));
//xhr.onreadystatechange = function(){
//    if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
//        var httpStatus = xhr.statusText;
//        var response = xhr.responseText;
//        lm.log("http get response is " + response);
//    }
//}
