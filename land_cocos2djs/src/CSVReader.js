/**
 * Created by hanhu on 16/4/6.
 */

var ConfigType =
{
    oldMall : 1,
    newMall : 2,
    ticket : 3,
    item : 4,
    goldroom : 5,
    matchGroup : 6,
    matchroom : 7,
    task : 8
}
var ConfigFileManager = cc.Class.extend({
    ctor : function()
    {

    },
/*
    LoadCSVFile : function(fileName)
    {
        lm.log("加载csv文件 = " + fileName);
        var fileString = jsb.fileUtils.getStringFromFile(fileName);
        lm.log("fileString：" + fileString);
        var data = fileString.split("\r\n");
        var recorder = [];
        var index = 0;
        var title = [];
        for(var k in data)
        {
            if(data[k].length != 0)
            {
                lm.log("data = " + data[k]);
                var subRecorder = data[k].split(",");
                if(k == 0) //第一行为字段名
                {
                    title = subRecorder;
                }
                else
                {
                    recorder[index] = {};
                    for(var i = 0; i < subRecorder.length; i++)
                    {
                        lm.log("tile = " + title[i] + " data = " + subRecorder[i]);
                        recorder[index][title[i]] = subRecorder[i];
                    }
                    lm.log("数据" + index +  "项为" + JSON.stringify(recorder[index]));
                    index++;
                }


            }
        }
        return recorder;
    },

    LoadMallData : function(fileName)
    {
        var data = this.LoadCSVFile(fileName);
        var mallData = {};
        mallData["goldlist"] = [];
        mallData["propertylist"] = [];
        for(var key in data)
        {
            if(Number(data[key]["type"]) == 1)
            {
                mallData["goldlist"].push(data[key]);
            }
            else
            {
                mallData["propertylist"].push(data[key]);
            }
        }
        lm.log("商城数据为：" + JSON.stringify(mallData));
        roomManager.SetMallData(mallData);
    },

    LoadTicketData : function(fileName)
    {
        var data = this.LoadCSVFile(fileName);
        var ticketData = {};
        ticketData["prizeexchangelist"] = data;
        lm.log("兑换数据为：" + JSON.stringify(ticketData));
        roomManager.SetTicketData(ticketData);
    },
*/
    LoadJsonConfig : function(data)
    {
        //商城配置
        {
            var localMallVersion = sys.localStorage.getItem("mallVersion");
            var localMallData = sys.localStorage.getItem("mallData");
            var mallData = JSON.parse(jsb.fileUtils.getStringFromFile("res/config/shangcheng.json"))["data"];
            roomManager.SetMallData(mallData["data"]);
            if(mallData["versionid"] >= data["mallVersion"])
            {
                roomManager.SetMallData(mallData["data"]);
            }
            else if(localMallVersion !== undefined && localMallVersion >= data["mallVersion"])
            {
                roomManager.SetMallData(JSON.parse(localMallData));
            }
            else
            {
                lm.log("商城数据更新");
                webMsgManager.SendConfigDataRequest(ConfigType.newMall, function(data)
                {
                    sys.localStorage.setItem("mallData", JSON.stringify(data["data"]));
                    sys.localStorage.setItem("mallVersion", data["versionid"]);
                    roomManager.SetMallData(data["data"]);
                });
            }
        }


        //兑换配置
        var localTicketVersion = sys.localStorage.getItem("ticketVersion");
        var localTicketData = sys.localStorage.getItem("ticketData");
        var ticketData = JSON.parse(jsb.fileUtils.getStringFromFile("res/config/duihuan.json"))["data"];
        roomManager.SetTicketData(ticketData["data"]);
        if(ticketData["versionid"] >= data["ticketVersion"])
        {
            lm.log("yyp OnTicketCliecked 3");
            roomManager.SetTicketData(ticketData["data"]);
        }
        else if(localTicketVersion !== undefined && localTicketVersion >= data["ticketVersion"])
        {
            lm.log("yyp OnTicketCliecked 4");
            roomManager.SetTicketData(JSON.parse(localTicketData));
        }
        else
        {
            lm.log("yyp OnTicketCliecked 5");
            webMsgManager.SendConfigDataRequest(ConfigType.ticket, function(data)
            {
                sys.localStorage.setItem("ticketData", JSON.stringify(data["data"]));
                sys.localStorage.setItem("ticketVersion", data["versionid"]);
                roomManager.SetTicketData(data["data"]);
            });
        }

        //任务
        var localTaskVersion = sys.localStorage.getItem("taskVersion");
        var localTaskData = sys.localStorage.getItem("taskData");
        var taskData = JSON.parse(jsb.fileUtils.getStringFromFile("res/config/renwu.json"))["data"];
        roomManager.SetAllTaskData(taskData["data"]);
        if(taskData["versionid"] >= data["taskVersion"])
        {
            roomManager.SetAllTaskData(taskData["data"]);
        }
        else if(localTaskVersion !== undefined && localTaskVersion >= data["taskVersion"])
        {
            roomManager.SetAllTaskData(JSON.parse(localTaskData));
        }
        else
        {
            lm.log("分组信息更新");
            webMsgManager.SendConfigDataRequest(ConfigType.task, function(data){
                lm.log("设置任务信息 = " + JSON.stringify(data["data"]));
                sys.localStorage.setItem("taskData", JSON.stringify(data["data"]));
                sys.localStorage.setItem("taskVersion", data["versionid"]);
                roomManager.SetAllTaskData(data["data"]);
            });
        }

        //金币场数据
        var localGoldVersion = sys.localStorage.getItem("goldVersion");
        var localGoldData = sys.localStorage.getItem("goldData");
        var goldData = JSON.parse(jsb.fileUtils.getStringFromFile("res/config/jinbichang.json"))["data"];
        if(goldData["versionid"] >= data["goldVersion"])
        {
            roomManager.SetGoldRoomData(goldData["data"]);
        }
        else if(localGoldVersion !== undefined && localGoldVersion >= data["goldVersion"])
        {
            roomManager.SetGoldRoomData(JSON.parse(localGoldData));
        }
        else
        {
            webMsgManager.SendConfigDataRequest(ConfigType.goldroom, function(data){
                sys.localStorage.setItem("goldData", JSON.stringify(data["data"]));
                sys.localStorage.setItem("goldVersion", data["versionid"]);
                roomManager.SetGoldRoomData(data["data"]);
            });
        }

        //道具
        var itemData = JSON.parse(jsb.fileUtils.getStringFromFile("res/config/daoju.json"))["data"];
        roomManager.SetItemData(itemData["data"]);

        return;


        
        //比赛场数据
        var localMatchVersion = sys.localStorage.getItem("matchVersion");
        var localMatchData = sys.localStorage.getItem("matchData");
        var matchData = JSON.parse(jsb.fileUtils.getStringFromFile("res/config/bisai.json"))["data"];
        roomManager.SetMatchRoomData(matchData["data"]);
        lm.log("比赛版本 = " + matchData["versionid"] + " 当前版本 = " + data["matchVersion"] + " 本地版本号为：" + localMatchVersion);
        if(matchData["versionid"] >= data["matchVersion"])
        {
            roomManager.SetMatchRoomData(matchData["data"]);
        }
        else if(localMatchVersion !== undefined && localMatchVersion >= data["matchVersion"])
        {
            roomManager.SetMatchRoomData(JSON.parse(localMatchData));
        }
        else
        {
            lm.log("比赛数据更新");
            webMsgManager.SendConfigDataRequest(ConfigType.matchroom, function(data){
                sys.localStorage.setItem("matchData", JSON.stringify(data["data"]));
                sys.localStorage.setItem("matchVersion", data["versionid"]);
                roomManager.SetMatchRoomData(data["data"]);
            });
        }


        //比赛分组
        var localMatchGroupVersion = sys.localStorage.getItem("matchGroupVersion");
        var localMatchGroupData = sys.localStorage.getItem("matchGroupData");
        var matchGroupData = JSON.parse(jsb.fileUtils.getStringFromFile("res/config/fenzu.json"))["data"];
        roomManager.SetMatchGroupData(matchGroupData["data"]);
        lm.log("分组信息版本 = " + matchGroupData["versionid"] + " 当前版本 = " + data["matchGroupVersion"] + " 本地版本 = " + localMatchGroupVersion);
        if(matchGroupData["versionid"] >= data["matchGroupVersion"])
        {
            roomManager.SetMatchGroupData(matchGroupData["data"]);
        }
        else if(localMatchGroupVersion !== undefined && localMatchGroupVersion >= data["matchGroupVersion"])
        {
            roomManager.SetMatchGroupData(JSON.parse(localMatchGroupData));
        }
        else
        {
            lm.log("比赛分组信息更新");
            webMsgManager.SendConfigDataRequest(ConfigType.matchGroup , function(data){
                sys.localStorage.setItem("matchGroupData", JSON.stringify(data["data"]));
                sys.localStorage.setItem("matchGroupVersion", data["versionid"]);
                roomManager.SetMatchGroupData(data["data"]);
            });
        }

    }

});

var configManager = configManager || new ConfigFileManager();


