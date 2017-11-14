/**
 * Created by baibo on 15/11/27.
 */
var New_WEBREQUEST_CMD_TYPE =
{
    /**
     * 命令ID:	SUB_GP_ACTIVITYCODE
     * 功能描述: 兑换活动兑换码
     * JSON参数:
     *     @Param1 ： cmd   命令
     *	  @Param2 ： sign  校验码
     *	  @Param3 ： data -  orderid 、imei 、macaddress
     *
     * JSON示例:
     *     {"cmd":1033, "sign":"xxxxxxxx", "data":{"userid":"","code":""}}
     */
    SUB_GP_ACTIVITYCODE : 1033,



    /**
     * 命令ID:	SUB_GP_BUILDPROMOTION
     * 功能描述: 绑定推广员－ IOS 平台
     * JSON参数:
     *     @Param1 ： cmd   命令
     *	  @Param2 ： sign  校验码
     *	  @Param3 ： data -  orderid 、imei 、macaddress
     *
     * JSON示例:
     *     {"cmd":1038, "sign":"xxxxxxxx", "data":{"userid":"","devicetype":64,"spreadgameid":12345}}
     */
    SUB_GP_BUILDPROMOTION : 1038,

    /**
     * 命令ID:	SUB_GP_TASKINFO
     * 功能描述: 获取任务信息
     * JSON参数:
     *     @Param1 ： cmd   命令
     *	  @Param2 ： sign  校验码
     *	  @Param3 ： data -  userid 、deviceType, taskid
     *
     * JSON示例:
     *     {"cmd":1041, "sign":"xxxxxxxx", "data":{"userid":"","devicetype":64, "taskid":11}}
     */
    SUB_GP_TASKINFO : 1041,

    /**
     * 命令ID:	SUB_GP_TASKGROUP
     * 功能描述: 获取任务信息
     * JSON参数:
     *     @Param1 ： cmd   命令
     *	  @Param2 ： sign  校验码
     *	  @Param3 ： data -  userid 、deviceType
     *
     * JSON示例:
     *     {"cmd":1042, "sign":"xxxxxxxx", "data":{"userid":"","devicetype":64}}
     */
    SUB_GP_TASKGROUP : 1042,

    /**
     * 命令ID:	SUB_GP_TELCOMGETCODE
     * 功能描述: 电信-获取动态验证码
     * JSON参数:
     *     @Param1 ： cmd   命令
     *	  @Param2 ： sign  校验码
     *	  @Param3 ： data -  userid 、deviceType、mobile、password
     *
     * JSON示例:
     *     {"cmd":1043, "sign":"xxxxxxxx", "data":{"userid":"","devicetype":64,"mobile":13809234567,"orderid":“订单号”，"name":"产品名称",""}}
     */
    SUB_GP_TELCOMGETCODE : 1043,


    /**
     * 命令ID:	SUB_GP_TELCOMREGISTER
     * 功能描述: 电信注册- 返回账号、密码
     * JSON参数:
     *     @Param1 ： cmd   命令
     *	  @Param2 ： sign  校验码
     *	  @Param3 ： data -  userid 、deviceType、mobile、password
     *
     * JSON示例:
     *     {"cmd":1044, "sign":"xxxxxxxx", "data":{"userid":"","devicetype":64,"mobile":13809234567,"code":12345,"imsi":"fhfjhfjfj181888383883","spreader":111111}
     */
    SUB_GP_TELCOMREGISTER : 1044,


    /**
     * 命令ID:	SUB_GP_TELCOMVERIFYPASSWORD
     * 功能描述: 验证动态密码 -支付
     * JSON参数:
     *     @Param1 ： cmd   命令
     *	  @Param2 ： sign  校验码
     *	  @Param3 ： data -  userid 、deviceType、mobile、password
     *
     * JSON示例:
     *     {"cmd":1045, "sign":"xxxxxxxx", "data":{"userid":"","devicetype":64,"code":12345,"orderid":"11111111"}
     */
    SUB_GP_TELCOMVERIFYCODE : 1045

}



var New_WEBRESULT_CMD_TYPE =
{


    /**
     * 命令ID:	SUB_GP_ACTIVITYCODE_FINISH
     * 功能描述: 获取引擎版本号和跳转地址
     * JSON参数:
     *     @Param1 ： cmd   命令
     *	  @Param2 ： sign  校验码
     *	  @Param3 ： data -  orderid 、imei 、macaddress
     *
     * JSON示例:
     *    {"cmd":2037, "sign":"xxxxxxxx","message":"这是提示信息", "status" : true,"data":"}
     */
    SUB_GP_ACTIVITYCODE_FINISH : 2033,

    /**
     * 命令ID:	SUB_GP_BUILDPROMOTION_FINISH
     * 功能描述: 绑定推广员完成
     * JSON参数:
     *     @Param1 ： cmd   命令
     *	  @Param2 ： sign  校验码
     *	  @Param3 ： data -  orderid 、imei 、macaddress
     *
     * JSON示例:
     *     {"cmd":2038, "sign":"xxxxxxxx","message":"这是提示信息", "status" : true,"data":null}
     */
    SUB_GP_BUILDPROMOTION_FINISH : 2038,

    /**
     * 命令ID:	SUB_GP_TASKINFO_FINISH
     * 功能描述: 获取任务信息
     * JSON参数:
     *     @Param1 ： cmd   命令
     *	  @Param2 ： sign  校验码
     *	  @Param3 ： data -  userid 、deviceType, taskid
     *
     * JSON示例:
     *     {"cmd":2041, "sign":"xxxxxxxx", "data":}
     */
    SUB_GP_TASKINFO_FINISH : 2041,

    /**
     * 命令ID:	SUB_GP_TASKGROUP_FINISH
     * 功能描述: 获取任务信息
     * JSON参数:
     *     @Param1 ： cmd   命令
     *	  @Param2 ： sign  校验码
     *	  @Param3 ： data -  userid 、deviceType, taskid
     *
     * JSON示例:
     *     {"cmd":2041, "sign":"xxxxxxxx", "data":}
     */
    SUB_GP_TASKGROUP_FINISH : 2042,



    /**
     * 命令ID:	SUB_GP_TELCOMGETCODE_FINISH
     * 功能描述: 获取验证码完成
     * JSON参数:
     *     @Param1 ： cmd   命令
     *	  @Param2 ： sign  校验码
     *	  @Param3 ： data -  userid 、deviceType, taskid
     *
     * JSON示例:
     *     {"cmd":2043, "sign":"xxxxxxxx", "status" : true, "data":{"tips":"提示信息","transactionid":"id"}}
     */
    SUB_GP_TELCOMGETCODE_FINISH:2043,


    /**
     * 命令ID:	SUB_GP_TELCOMREGISTER_FINISH
     * 功能描述: 注册完成 - 返回账号、密码(MD5加密后的内容)
     * JSON参数:
     *     @Param1 ： cmd   命令
     *	  @Param2 ： sign  校验码
     *	  @Param3 ： data -account, password
     *
     * JSON示例:
     *     {"cmd":2044, "sign":"xxxxxxxx", "status" : true, "data":{"account":"fffff","password":"fkfkfmd5","tips":""}}
     */
    SUB_GP_TELCOMREGISTER_FINISH:2044,


    /**
     * 命令ID:	SUB_GP_TELCOMVERIFYCODE_FINISH
     * 功能描述: 验证码完成 - 是否需要重新输入、提示信息
     * JSON参数:
     *     @Param1 ： cmd   命令
     *	  @Param2 ： sign  校验码
     *	  @Param3 ： data -  userid 、deviceType, taskid
     *
     * JSON示例:
     *     {"cmd":2045, "sign":"xxxxxxxx", "status" : true, "data":{"needinput":1, "tips":"yryryyryr"}
     */
    SUB_GP_TELCOMVERIFYCODE_FINISH:2045




}

//任务消息主ID
var MDM_GP_TASK = 6;

var TaskMsg = {
    SUB_GP_USERTASKINFO: 1, //任务信息
    SUB_GP_USERTASKREMOVE: 2, //任务删除
    SUB_GP_USERTASKREWARD: 3 //任务奖励
}


var newWebMsgManager = cc.Class.extend({

    ctor: function () {

        //监听任务信息
        connectUtil.dataListenerManual(KernelPlaza, MDM_GP_TASK, TaskMsg.SUB_GP_USERTASKINFO, function(SerializeObject, size){
            var num = size / 20;
            var getTaskInfo = function(mainID, realID, cur, max)
            {
                var allTaskData = roomManager.GetAllTaskData();
                for(var key in allTaskData)
                {
                    if(allTaskData[key]["tId"] == mainID)
                    {
                        var mainTaskInfo = allTaskData[key];
                        mainTaskInfo["currentValue"] = cur;
                        mainTaskInfo["maxValue"] = max;
                        for(var v in allTaskData)
                        {
                            if(allTaskData[v]["tId"] == realID)
                            {
                                mainTaskInfo["tDesc"] =  allTaskData[v]["tDesc"];
                                mainTaskInfo["Rewards"] = allTaskData[v]["Rewards"];
                                var findFlag = false;
                                for(var k in roomManager.taskdata)
                                {
                                    if(roomManager.taskdata[k]["tId"] == mainTaskInfo["tId"])
                                    {
                                        roomManager.taskdata[k] = mainTaskInfo;
                                        findFlag = true;
                                        break;
                                    }
                                }

                                if(findFlag == false)
                                {
                                    lm.log("添加主任务信息为：" + JSON.stringify(mainTaskInfo));
                                    roomManager.taskdata.push(mainTaskInfo);
                                }

                                roomManager.taskdata.sort(function(a, b){
                                    if(a["tSort"] > b["tSort"])
                                    {
                                        return true;
                                    }
                                    else
                                    {
                                        return false;
                                    }
                                });
                                break;
                            }
                        }
                        break;
                    }
                }
                //NewWebMsgManager.SendGetTaskInfo(mainID, taskKey, function(data){
                //        lm.log("成功获取任务信息：" + JSON.stringify(data));
                //        var mainTaskInfo = data;
                //        mainTaskInfo["currentValue"] = cur;
                //        mainTaskInfo["maxValue"] = max;
                //
                //        NewWebMsgManager.SendGetTaskInfo(realID, taskKey, function(subData){
                //                mainTaskInfo["tDesc"] =  subData["tDesc"];
                //                mainTaskInfo["Rewards"] = subData["Rewards"];
                //
                //                var findFlag = false;
                //                for(var k in roomManager.taskdata)
                //                {
                //                    if(roomManager.taskdata[k]["tId"] == mainTaskInfo["tId"])
                //                    {
                //                        roomManager.taskdata[k] = mainTaskInfo;
                //                        findFlag = true;
                //                        break;
                //                    }
                //                }
                //
                //                if(findFlag == false)
                //                {
                //                    roomManager.taskdata.push(mainTaskInfo);
                //                }
                //
                //                roomManager.taskdata.sort(function(a, b){
                //                    if(a["tSort"] > b["tSort"])
                //                    {
                //                        return true;
                //                    }
                //                    else
                //                    {
                //                        return false;
                //                    }
                //                });
                //
                //            },
                //            function(subData)
                //            {
                //                lm.log("获取子任务信息失败");
                //            }, this);
                //
                //    },
                //    function(data)
                //    {
                //        lm.log("获取主任务信息失败");
                //    }, this);
            }
            for(var i = 0; i < num; i++)
            {
                var taskID = DataUtil.ReadNumber(SerializeObject, 16);
                var realTaskID = DataUtil.ReadNumber(SerializeObject, 16);
                var taskKey = DataUtil.ReadNumber(SerializeObject, 32);
                var currentTaskValue = DataUtil.ReadNumber(SerializeObject, 32);
                var maxTaskValue = DataUtil.ReadNumber(SerializeObject, 32);
                var Service = DataUtil.ReadNumber(SerializeObject, 16);
                var KindID = DataUtil.ReadNumber(SerializeObject, 16);
                lm.log("taskID = " + taskID + " realID = " + realTaskID + "taskKey =" + taskKey + " cur = " + currentTaskValue + " max = " + maxTaskValue + "KINDID = " + KindID);
                if(KindID == Game_ID || KindID == 0)
                {
                    getTaskInfo(taskID, realTaskID, currentTaskValue, maxTaskValue);
                }
            }

        });
        //删除任务
        connectUtil.dataListenerManual(KernelPlaza, MDM_GP_TASK, TaskMsg.SUB_GP_USERTASKREMOVE, function(SerialzieObject, size)
        {
            var taskID = DataUtil.ReadNumber(SerialzieObject, 16);
            lm.log("删除任务id = " + taskID);
            for(var k in roomManager.taskdata)
            {
                lm.log("Tid = " + roomManager.taskdata[k]["tId"]);
                if(roomManager.taskdata[k]["tId"] == taskID)
                {
                    roomManager.taskdata.splice(k, 1);
                    break;
                }
            }

        });

        //任务奖励
        connectUtil.dataListenerManual(KernelPlaza, MDM_GP_TASK, TaskMsg.SUB_GP_USERTASKREWARD, function(SerialzieObject, size){
            var taskID = DataUtil.ReadNumber(SerialzieObject, 16);
            var des = ReadString(SerialzieObject, 0);

            lm.log("收到奖励信息为：" + des);
            NoticeMessageArray.push(des);

        });
    },

    SendGetActivityAward : function (activityCode, successedcallback, failedcallback, target) {

        var data = {};
        data["packagecdkey"] = activityCode;
        data["userid"] = userInfo.globalUserdData["dwUserID"];
        data["devicetype"] = GetDeviceType();

        lm.log("SendGetActivityAward" + JSON.stringify(data));

        //发送请求
        connectUtil.SenGetHttpRequest(UPDATE_HTTPWEBURL,
            New_WEBREQUEST_CMD_TYPE.SUB_GP_ACTIVITYCODE,
            DataUtil.GetWebSign(userInfo.globalUserdData["szLoginKey"], JSON.stringify(data)),
            JSON.stringify(data),
            function (responseText) {

                var resultdata = JSON.parse(responseText);
                if(webMsgManager.VerificationMsg(userInfo.globalUserdData["szLoginKey"],
                        resultdata,
                        New_WEBRESULT_CMD_TYPE.SUB_GP_ACTIVITYCODE_FINISH,
                        failedcallback,
                        target))
                {
                    // 解析真实数据
                    if (successedcallback !== null) {
                        successedcallback.call(target, resultdata["message"]);
                    }
                }
            },
            function (responseText) {
                // 其他网络错误
                var resultdata = JSON.parse(responseText);
                if (failedcallback) {
                    failedcallback.call(target, resultdata["message"]);
                }

            },
            this);
    },

    SendGpMatchFiled: function (matchid, roundid,successedcallback, failedcallback, target) {
        //发送请求
        lm.log("yyp——match SendGpMatchFiled ");
        //hanhu #比赛信息请求采用伪静态页面 2015/12/18
        var OldUrl = DataUtil.GetHttpWebURL();
        var pos = OldUrl.indexOf("ddz");
        var newUrl = OldUrl.substring(0, pos) + "mobile-1006-"+ matchid + "-" + roundid + ".html";
        lm.log("yyp——match123 SendGpMatchFiled =" + OldUrl);
        lm.log("yyp——match123 SendGpMatchFiled =" + newUrl);
        this.SenGetHttpRequestHTML(newUrl,
            function (responseText) {

                var resultdata = JSON.parse(responseText);
                ////lm.log("yyp_match SendGpMatchFiled = " + responseText);
               // lm.log("yyp_match SendGpMatchFiled = " + resultdata);
               // lm.log("yyp_match SendGpMatchFiled = " + resultdata["data"]);

                // 解析真实数据
                if (successedcallback !== null) {
                    successedcallback.call(target, resultdata["data"]);
                }

            },
            function (responseText) {
                // 其他网络错误
                lm.log("yyp_match responseText = " + responseText);
                if (failedcallback) {
                    failedcallback.call(responseText);
                }

            },
            this);

    },

    SendGetMatchReward : function(matchid, successedcallback, failedcallback, target)
    {
        var OldUrl = DataUtil.GetHttpWebURL();
        //var newUrl = OldUrl + "cdn/2001-"+ matchid  + ".html";
        var pos = OldUrl.indexOf("ddz");
        var newUrl = OldUrl.substring(0, pos) + "xl/" + "cdn/2001-"+ matchid  + ".html";
        lm.log("yyp——match234 SendGpMatchFiled =" + OldUrl);
        lm.log("yyp——match234 SendGpMatchFiled =" + newUrl);
        this.SenGetHttpRequestHTML(newUrl,
            function (responseText) {

                var resultdata = JSON.parse(responseText);

                // 解析真实数据
                if (successedcallback !== null) {
                    successedcallback.call(target, resultdata);
                }

            },
            function (responseText) {
                // 其他网络错误
                //lm.log("responseText = " + responseText);
                if (failedcallback) {
                    failedcallback.call(responseText);
                }

            },
            this);
    },

    SenGetHttpRequestHTML: function (weburl,
                                     SuccessedCallBack, //成功回调
                                     FailedCallBack,    //失败回调
                                     target)            //目标参数)
    {
        var httpRequest = cc.loader.getXMLHttpRequest();
        if (httpRequest === undefined || httpRequest === null) {
            lm.log("httpRequest object is null");
            return;
        }

        var url = weburl;
        var url2 = weburl;
        lm.log("urla:" + url2);
        httpRequest.open("GET", url, true);
        httpRequest.send();
        httpRequest.onreadystatechange = function () {

            //lm.log("SendHttpRequest  status:" + httpRequest.status);
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                var httpStatus = httpRequest.statusText;
                var response = httpRequest.responseText;

                if (SuccessedCallBack !== null) {
                    //lm.log("http get text: " + httpRequest.responseText);
                    SuccessedCallBack.call(target, httpRequest.responseText);
                }

            } else {
                if (FailedCallBack != null) {
                    FailedCallBack.call(target, httpRequest.responseText);
                }
            }
        }

    },

    //绑定推广员账号
    SendBuildPromotion:function(spreadgameid,successedcallback, failedcallback, target)
    {
        var data = {};
        data["userid"] = userInfo.globalUserdData["dwUserID"];
        data["devicetype"] = GetDeviceType();
        data["spreadgameid"] = spreadgameid;

        lm.log("SendBuildPromotion" + JSON.stringify(data));

        connectUtil.SenGetHttpRequest(UPDATE_HTTPWEBURL,
            New_WEBREQUEST_CMD_TYPE.SUB_GP_BUILDPROMOTION,
            DataUtil.GetWebSign(userInfo.globalUserdData["szLoginKey"], JSON.stringify(data)),
            JSON.stringify(data),
            function (responseText) {

                var resultdata = JSON.parse(responseText);
                if(webMsgManager.VerificationMsg(userInfo.globalUserdData["szLoginKey"],
                        resultdata,
                        New_WEBRESULT_CMD_TYPE.SUB_GP_BUILDPROMOTION_FINISH,
                        failedcallback,
                        target))
                {
                    // 解析真实数据
                    if (successedcallback !== null) {
                        successedcallback.call(target, resultdata["message"]);
                    }
                }
            },
            function (responseText) {
                // 其他网络错误
                var resultdata = JSON.parse(responseText);
                if (failedcallback) {
                    failedcallback.call(target, resultdata["message"]);
                }

            },
            this);

    },

    SendGetTaskInfo : function(taskid, key, successedcallback, failedcallback, target)
    {
        var data = {};
        data["userid"] = userInfo.globalUserdData["dwUserID"];
        data["devicetype"] = GetDeviceType();
        data["taskid"] = taskid;

        lm.log("SendGetTaskInfo : " + JSON.stringify(data));

        this.SenGetHttpRequestByKey(UPDATE_HTTPWEBURL,
            New_WEBREQUEST_CMD_TYPE.SUB_GP_TASKINFO,
            key,
            DataUtil.GetWebSign(userInfo.globalUserdData["szLoginKey"], JSON.stringify(data)),
            JSON.stringify(data),
            function (responseText) {

                var resultdata = JSON.parse(responseText);
                if(webMsgManager.VerificationMsg(userInfo.globalUserdData["szLoginKey"],
                        resultdata,
                        New_WEBRESULT_CMD_TYPE.SUB_GP_TASKINFO_FINISH,
                        failedcallback,
                        target))
                {
                    // 解析真实数据
                    if (successedcallback !== null) {
                        successedcallback.call(target, resultdata["data"]);
                    }
                }
            },
            function (responseText) {
                // 其他网络错误
                var resultdata = JSON.parse(responseText);
                if (failedcallback) {
                    failedcallback.call(target, resultdata["data"]);
                }

            },
            this);
    },

    SendGetTaskGroup : function(successedcallback, failedcallback, target)
    {
        var data = {};
        data["userid"] = userInfo.globalUserdData["dwUserID"];
        data["devicetype"] = GetDeviceType();

        lm.log("SendGetTaskInfo : " + JSON.stringify(data));

        connectUtil.SenGetHttpRequest(UPDATE_HTTPWEBURL,
            New_WEBREQUEST_CMD_TYPE.SUB_GP_TASKGROUP,
            DataUtil.GetWebSign(userInfo.globalUserdData["szLoginKey"], JSON.stringify(data)),
            JSON.stringify(data),
            function (responseText) {

                var resultdata = JSON.parse(responseText);
                if(webMsgManager.VerificationMsg(userInfo.globalUserdData["szLoginKey"],
                        resultdata,
                        New_WEBRESULT_CMD_TYPE.SUB_GP_TASKGROUP_FINISH,
                        failedcallback,
                        target))
                {
                    // 解析真实数据
                    if (successedcallback !== null) {
                        successedcallback.call(target, resultdata["data"]);
                    }
                }
            },
            function (responseText) {
                // 其他网络错误
                var resultdata = JSON.parse(responseText);
                if (failedcallback) {
                    failedcallback.call(target, resultdata["data"]);
                }

            },
            this);
    },

    SenGetHttpRequestByKey: function (weburl,
                                 cmd,
                                 key,
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

        var url = weburl + cmd + "?key=" + key +"&sign=" + sign + "&data=" + encodeURIComponent(data);
        var url2 = weburl + cmd + "?key=" + key +"&sign=" + sign + "&data=" + data;
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
    //获取电信动态验证码
    SendGetTelcomCode:function(mobile,imsi,orderid, name, successedcallback,failedcallback,target)
    {
        var data = {};

        data["userid"] = ((userInfo.globalUserdData !== null) && (userInfo.globalUserdData !==undefined)) ? userInfo.globalUserdData["dwUserID"]:"";
        data["devicetype"] = GetDeviceType();
        data["mobile"] = mobile;
        data["orderid"] = orderid;
        data["imsi"] = imsi;
        data["name"] = name;

        lm.log("SendGetTelcomCode : " + JSON.stringify(data));

        connectUtil.SenGetHttpRequest(UPDATE_HTTPWEBURL,
            New_WEBREQUEST_CMD_TYPE.SUB_GP_TELCOMGETCODE,
            DataUtil.GetWebSign(DefultWebSignKey, JSON.stringify(data)),
            JSON.stringify(data),
            function (responseText) {

                var resultdata = JSON.parse(responseText);
                if(webMsgManager.VerificationMsg(DefultWebSignKey,
                        resultdata,
                        New_WEBRESULT_CMD_TYPE.SUB_GP_TELCOMGETCODE_FINISH,
                        failedcallback,
                        target))
                {
                    // 解析真实数据
                    if (successedcallback !== null) {
                        successedcallback.call(target, resultdata["data"]);
                    }
                }
            },
            function (responseText) {
                // 其他网络错误
                var resultdata = JSON.parse(responseText);
                if (failedcallback) {
                    failedcallback.call(target, resultdata["data"]);
                }

            },
            this);

    },

    //电信注册
    SendTelcomRegister:function(mobile,imsi,code,successedcallback,failedcallback,target)
    {
        var data = {};
        data["userid"] = ((userInfo.globalUserdData !== null) && (userInfo.globalUserdData !==undefined)) ? userInfo.globalUserdData["dwUserID"]:"";
        data["devicetype"] = GetDeviceType();
        data["mobile"] = mobile;
        data["code"] = code;
        data["imsi"] = imsi;
        data["gameid"] = Game_ID;
        var staffaccount =  DataUtil.GetStaffAccount();
        if(staffaccount != null)
        {
            //推广员账号不是空的，就传入推广员账号
            data["spreader"] = staffaccount;
        }

        lm.log("SendTelcomRegister : " + JSON.stringify(data));
        connectUtil.SenGetHttpRequest(UPDATE_HTTPWEBURL,
            New_WEBREQUEST_CMD_TYPE.SUB_GP_TELCOMREGISTER,
            DataUtil.GetWebSign(DefultWebSignKey, JSON.stringify(data)),
            JSON.stringify(data),
            function (responseText) {

                var resultdata = JSON.parse(responseText);
                if(this.VerificationMsg(DefultWebSignKey,
                        resultdata,
                        New_WEBRESULT_CMD_TYPE.SUB_GP_TELCOMREGISTER_FINISH,
                        failedcallback,
                        target))
                {
                    // 解析真实数据
                    if (successedcallback !== null) {
                        successedcallback.call(target, resultdata["data"]);
                    }
                }
            },
            function (responseText) {
                // 其他网络错误
                var resultdata = JSON.parse(responseText);
                if (failedcallback) {
                    failedcallback.call(target, resultdata["data"]);
                }

            },
            this);
    },

    // 验证消息合法性- 合法返回true, 否则返回false
    VerificationMsg: function (signkey, resultdata, cmdtype, faiedcallback, target) {
        // 返回数据是否为 null
        if (resultdata === null) {
            lm.log("VerificationMsg resultdata is null");
            if (faiedcallback !== null) {
                faiedcallback.call(target, "获取服务器数据异常，请稍后重试!");
            }

            return false;
        }

        if ((resultdata["cmd"] === null) ||
            (resultdata["cmd"] !== cmdtype)) {
            lm.log("VerificationMsg result cmd: " + resultdata["cmd"] + "  err");
            if (faiedcallback) {
                faiedcallback.call(target, "获取服务器数据异常，请稍后重试!");
            }

            return false;
        }

        // sign 不匹配
        if ((resultdata["sign"] === null) ||
            (resultdata["sign"] !== DataUtil.GetWebSign(signkey, JSON.stringify(resultdata["data"])))) {
            lm.log("VerificationMsg  sign 不匹配 :", DataUtil.GetWebSign(signkey, JSON.stringify(resultdata["data"])));
            if (faiedcallback !== null) {
                faiedcallback.call(target, "获取服务器数据异常，请稍后重试!");
            }

            return false;
        }

        // status 失败
        if ((resultdata["sign"] === null) || (resultdata["status"] == false)) {
            lm.log("VerificationMsg result status ,msg: " + resultdata["message"]);
            if (faiedcallback !== null) {

                if(resultdata["data"] && (String(resultdata["data"]["resultcode"]) == "-911"))
                    faiedcallback.call(target, "验证码已过期，请重新获取！");
                else
                    faiedcallback.call(target, resultdata["message"]);
            }


            return false;
        }

        //绑定手机获取验证码 不需要验证数据
        if(WEBRESULT_CMD_TYPE.SUB_GP_GETMOBILEVERIFICATIONCODE_FINISH != cmdtype)
        {
            // data 数据为空
            if (resultdata["data"] === null) {
                lm.log("VerificationMsg result data is null ");
                if (faiedcallback !== null) {
                    faiedcallback.call(target, "获取服务器数据异常，请稍后重试!");
                }

                return false;
            }
        }
        lm.log("VerificationMsg cmdtype: " + cmdtype + "  Successed!");
        return true;
    },



    //验证动态密码 -支付
    SendTelcomVerifyCode:function(code,orderid,transactionid,successedcallback,failedcallback,target)
    {
        var data = {};
        data["userid"] = ((userInfo.globalUserdData !== null) && (userInfo.globalUserdData !==undefined)) ? userInfo.globalUserdData["dwUserID"]:"";
        data["devicetype"] = GetDeviceType();
        data["code"] = code;
        data["transactionid"] = transactionid;
        data["orderid"] = orderid;

        lm.log("SendTelcomVerifyCode----------1111 : transactionid-" +  data["transactionid"] + "orderid-" +  data["orderid"]);
        connectUtil.SenGetHttpRequest(UPDATE_HTTPWEBURL,
            New_WEBREQUEST_CMD_TYPE.SUB_GP_TELCOMVERIFYCODE,
            DataUtil.GetWebSign(DefultWebSignKey, JSON.stringify(data)),
            JSON.stringify(data),
            function (responseText) {

                var resultdata = JSON.parse(responseText);
                if(webMsgManager.VerificationMsg(DefultWebSignKey,
                        resultdata,
                        New_WEBRESULT_CMD_TYPE.SUB_GP_TELCOMVERIFYCODE_FINISH,
                        failedcallback,
                        target))
                {
                    // 解析真实数据
                    if (successedcallback !== null) {
                        successedcallback.call(target, resultdata["data"]);
                    }
                }
            },
            function (responseText) {
                // 其他网络错误
                var resultdata = JSON.parse(responseText);
                if (failedcallback) {
                    failedcallback.call(target, resultdata["data"]);
                }
            },
            this);
    },

    //发送一键注册请求扩展 -增加gameid
    SendAkeyRegisterEx: function (machid, successedcallback, failedcallback, target) {

        var self = this;

        // 组织发送内容
        var data = {};
        data["userid"] = "";
        data["machid"] = MD5String(machid);
        data["devicetype"] = GetDeviceType();
        data["gameid"] = Game_ID;

        var staffaccount =  DataUtil.GetStaffAccount();
        if(staffaccount != null)
        {
            //推广员账号不是空的，就传入推广员账号
            data["spreader"] = staffaccount;
        }

        lm.log("sendAkeyRegister" + JSON.stringify(data));

        //发送请求
        connectUtil.SenGetHttpRequest(DataUtil.GetHttpWebURL(),
            WEBREQUEST_CMD_TYPE.SUB_GP_AKEY_REGISTER,
            DataUtil.GetWebSign(DefultWebSignKey, JSON.stringify(data)),
            JSON.stringify(data),
            function (responseText) {

                var resultdata = JSON.parse(responseText);
                if(self.VerificationMsg(DefultWebSignKey, resultdata,
                        WEBRESULT_CMD_TYPE.SUB_GP_AKEY_REGISTERFINISH,
                        failedcallback,
                        target))
                {
                    // 解析真实数据
                    if (successedcallback !== null) {
                        successedcallback.call(target, resultdata["data"]);
                    }
                }
            },
            function (responseText) {
                // 其他网络错误
                if (failedcallback) {
                    failedcallback.call(target, responseText);
                }

            },
            this);

    }

});

var NewWebMsgManager = NewWebMsgManager || new newWebMsgManager();