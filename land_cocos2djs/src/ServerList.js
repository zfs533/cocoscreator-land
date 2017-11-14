/**
 * Created by lizhongqiang on 15/6/8.
 */

// 房间状态
var ROOM_STATUS=
{
    close :0,  // 关闭
    fluent : 1, // 流畅
    lively: 2, // 热闹
    fillup:3 // 爆满
}


//服务器房间列表
var ServerList = cc.Class.extend({
    GameServerDataArray:[],
    KindData:null,
    ctor: function (kinddata) {

      this.KindData = kinddata;
    },

    //获取KindData
    GetKindData:function()
    {
        return this.KindData;
    },
    // 添加服务器
    AddGameServer:function(data)
    {
        if(this.GameServerDataArray.length == 0)
        {
            this.GameServerDataArray.push(data);
            return;
        }

        // 找到就修改
        for(var key in this.GameServerDataArray)
        {
            if(Number(this.GameServerDataArray[key]["wServerID"]) == Number(data["wServerID"]))
            {
                this.GameServerDataArray[key] = data;
                return;
            }
        }

        //否则添加
        this.GameServerDataArray.push(data);
        cc.log("AddGameServer :  " + JSON.stringify(this.GameServerDataArray));
    },

    // 枚举服务器
    EnumGameServer:function (index)
    {
        if(this.GameServerDataArray.length == 0)
          return null;

        if((index >=0) && (index < this.GameServerDataArray.length))
           return this.GameServerDataArray[index];

        return null;
    },

    //搜索服务器
    SearchGameServer:function(serverid)
    {
        if(this.GameServerDataArray.length == 0)
            return null;

        cc.log("this.GameServerDataArray :  " + JSON.stringify(this.GameServerDataArray));

        for(var key in this.GameServerDataArray)
        {
            if(Number(this.GameServerDataArray[key]["wServerID"]) == serverid)
            {
                return    this.GameServerDataArray[key];
            }
        }

        return null;
    },

    //获取游戏服务数目
    GetGameServerCount:function()
    {
        return  this.GameServerDataArray.length;
    },
    //删除服务器列表
    RemoveAllGameServer:function()
    {
        this.GameServerDataArray.splice(0,this.GameServerDataArray.length);
    }

});


//服务器种类
var ServerKind = cc.Class.extend({

    GameServerListArray:[],

    // 添加服务器种类
    AddKind:function(kinddata)
    {
        lm.log("-------------------------------111111111111")
        // 服务器种类重复
        for(var key in this.GameServerListArray)
        {
            if(Number(this.GameServerListArray[key].GetKindData()["wKindID"]) == Number(kinddata["wKindID"]))
            {
                return;
            }
        }

        lm.log("-------------------------------0000000000000000")
        if ( PLAZAUILAYER )
        {
            //PLAZAUILAYER.initLayer();
        }
        this.GameServerListArray.push(new ServerList(kinddata));

    },


    //添加服务器
   AddServer:function(serverdata)
   {
       if ( serverdata && serverdata.wKindID == 122 )
       {
           roomManager.setDragonData(serverdata);
       }

       for(var key in this.GameServerListArray)
       {

           if(Number(this.GameServerListArray[key].GetKindData()["wKindID"]) == Number(serverdata["wKindID"]))
           {

               this.GameServerListArray[key].AddGameServer(serverdata);
               lm.log("-----------zfsflash---------- "+JSON.stringify(this.GameServerListArray));
               return;
           }
       }
       lm.log("-----------zfsflash---------- "+JSON.stringify(this.GameServerListArray));

   },

    log:function()
    {
        cc.log("this.GameServerListArray================== "+JSON.stringify(this.GameServerListArray));

    },

    //搜索服务器
  SearchServer:function(serverid)
  {
      for(var key in this.GameServerListArray)
      {
          var server = this.GameServerListArray[key].SearchGameServer(serverid);
          if(server === null)continue;
          return server;
      }

      return null;
  },
    // 枚举服务器列表
    EnumServerList:function(index)
    {
        if((index >=0) && (index < this.GameServerListArray.length))
            return this.GameServerListArray[index];

        return null;
    },

    //begin modifyed by lizhongqiang 2015-09-06 10:20
    // 搜索服务器列表- ID列表
    SearchServerList:function(kind)
    {
        var serverlistarray =[];
        var gameserverlistarray = this.GameServerListArray;
        for(var key in gameserverlistarray)
        {
            var serverlist = gameserverlistarray[key];
            if(serverlist == null)continue;

            if(Number(serverlist.GetKindData()["wKindID"]) == Number(kind))
            {
                //lm.log(" SearchServerList 0 ");
                for(var sec =0;sec < serverlist.GetGameServerCount(); sec++)
                {
                    var data =   serverlist.EnumGameServer(sec);
                    //lm.log(" SearchServerList : " + data["wServerID"]);
                    var object={};
                    object["serverid"] = data["wServerID"];
                    //lm.log(" SearchServerList 1");
                    serverlistarray.push(object);
                }
            }
        }

        return serverlistarray;
    },
    // end modifyed by lizhongqiang 2015-09-06


    // 获取服务器列表数目
    GetServerListCount:function()
    {
        return this.GameServerListArray.length;
    },

    //根据玩家金币智能查找服务器SERVER
    AutoSelectServer:function(goldroomdata,successedcallback,failedcallback,tager)
    {
        //数据为空
        if(goldroomdata===null || goldroomdata.length==0)
        {
            if(failedcallback)
            {
                failedcallback.call(tager,"未能连接服务器，请稍后再试！",false);
            }
            return;
        }

        // 根据金币排序从大到小的顺序排序
        goldroomdata = goldroomdata.sort(function(a, b){
            if(Number(a["accessgold"]) < Number(b["accessgold"]))
            {
                return true;
            }
            else
            {
                return false;
            }
        });
//var roomViewData = GameServerKind.GetRoomViewData(roomdata[i]);
        cc.log("房间排序：" + JSON.stringify(goldroomdata));
        var usergold = Number(userInfo.globalUserdData["lUserScore"]);
        // 遍历金币场数据， 获取服务器列表 - 优先获取满足条件的房间
        for(var key in goldroomdata)
        {
            if(usergold > Number(goldroomdata[key]["accessgold"]))
            {
                var serverlist =  goldroomdata[key]["serverlist"];
                // 获取游戏服务器信息
                for(var sec in serverlist)
                {
                    var serverdata =  this.SearchServer(serverlist[sec]["serverid"]);
                    var serveraccessgold =  roomManager.getServerAccessGold(serverlist[sec]["serverid"]);
                    //lm.log("serverid:" + serverlist[sec]["serverid"] + " "  + "serveraccessgold: " + serveraccessgold);
                    if((serverdata !== null) &&
                        (serveraccessgold !== null) &&
                        (Number(serverdata["dwOnlineCount"]) < (Number(serverdata["dwFullCount"]) * 0.95)) &&  // 在线人数小于总人数的 95%可进入
                        (usergold >= serveraccessgold))                      // 用户身上的金币大于坐下金币
                    {
                        if(successedcallback)
                        {
                            //lm.log("回调成功函数-----------0"+JSON.stringify(serverdata));
                            Game_ID = serverdata.wKindID;

                            //SortID 1234 新初中高
                            sparrowDirector.gameData.currentRommLevel = goldroomdata[key]["SortID"];
                            lm.log("快速开始 进入房间 = " + goldroomdata[key]["name"] + " " + sparrowDirector.gameData.currentRommLevel);

                            successedcallback.call(tager,serverdata);
                        }
                        cc.log("在线人数小于 总人数的90% serverdata:  " + JSON.stringify(serverdata));

                        return;
                    }
                }
            }
        }

        //lm.log("没有搜索到合适的房间，不管在线人数的限制， 只要房间时开启的, 并满足坐下金币限制， 由服务端判定能否进入（会员有可能优先进入）");
        // 没有搜索到合适的房间，不管在线人数的限制， 只要房间时开启的, 并满足坐下金币限制， 由服务端判定能否进入（会员有可能优先进入）
        for(var key in goldroomdata)
        {
            cc.log("accessgold: " + goldroomdata[key]["accessgold"]);
            var serverlist =  goldroomdata[key]["serverlist"];
            for(var sec in serverlist)
            {
                var serverdata =  this.SearchServer(serverlist[sec]["serverid"]);
                var serveraccessgold =  roomManager.getServerAccessGold(serverlist[sec]["serverid"]);
                if((serverdata !== null) && (usergold > serveraccessgold))
                {
                    if(successedcallback)
                    {
                        //lm.log("回调成功函数-----------1"+JSON.stringify(serverdata));
                        Game_ID = serverdata.wKindID;
                        successedcallback.call(tager,serverdata);
                    }
                    return;
                }
            }
        }

        if(failedcallback)
        {
            failedcallback.call(tager, "222哎呀，你的金币不足，不能玩牌哦，去搞点金币吧！",true);
        }
    },

    //获取房间状态
    GetRoomStatus:function(serveritemdata)
    {
        var roomstatus = 0;
        //数据为空
        if(serveritemdata === undefined || serveritemdata===null || serveritemdata.length==0)
        {
            roomstatus = ROOM_STATUS.close;
            return ;
        }

        var serverlist = serveritemdata["serverlist"];
        if(serverlist == null)
        {
            roomstatus = ROOM_STATUS.close;
            return ;
        }

        var onlinecount = 0;
        var totalcount = 0;
        for(var key in serverlist)
        {
            var serverdata = this.SearchServer(serverlist[key]["serverid"]);
            cc.log("serverid=============== "+serverlist[key]["serverid"]+" data= "+JSON.stringify(serverdata));
            if(serverdata != null)
            {
                onlinecount += Number(serverdata["dwOnlineCount"]);
                totalcount += Number(serverdata["dwFullCount"]);
            }
        }

        cc.log("本场次 onlinecount : " + onlinecount + " dwFullCount:"  + totalcount +" gameid= "+Game_ID);
        if(totalcount == 0 )
        {
            roomstatus = ROOM_STATUS.close;

        }else if(onlinecount < (totalcount * 0.1))  // 流畅
        {
            roomstatus = ROOM_STATUS.fluent;

        }else if(onlinecount < (totalcount * 0.95)) //热闹
        {
            roomstatus = ROOM_STATUS.lively;
        }
        else // 爆满
        {
            roomstatus = ROOM_STATUS.fillup;
        }

        return roomstatus;
    },

    // 根据玩家金币，获取该场次，能进入的服务器。
    GetNearServer:function(usergold,serveritemdata,serverViewdata,successedcallback,failedcallback,tager)
    {
        //sparrowDirector.tempRoomServerId = serveritemdata.serverlist[0].serverid;//当前房间ID
        //lm.log("-----sparrowDirector.tempRoomServerId "+sparrowDirector.tempRoomServerId);
        //数据为空
        if(serveritemdata === undefined || serveritemdata===null || serveritemdata.length==0)
        {
            if(failedcallback)
            {
                failedcallback.call(tager,"未能连接服务器，请稍后再试！",false);
            }
            return ;
        }
        // 小于最小的准入金币返回
        if(usergold < Number(serverViewdata["lMinTabScore"]))
        {
            if(failedcallback)
            {
                failedcallback.call(tager,"333哎呀，你的金币不足，不能玩牌哦，去搞点金币吧！",true);
            }
            return ;
        }

        var serverlist = serveritemdata["serverlist"];

        cc.log("serverlist :" + JSON.stringify(serverlist));
        // 获取游戏服务器信息
        for(var key in serverlist)
        {
            var serverdata = this.SearchServer(serverlist[key]["serverid"]);
            lm.log("-----------------zfsflash---------------- "+JSON.stringify(serverdata));
            if(serverdata == null)
            {
                continue;
            }

            if(Number(serverdata["dwOnlineCount"]) <  Number(serverdata["dwFullCount"]) * 0.95)
            {
                if(successedcallback)
                {

                    //lm.log("回调成功函数");
                    successedcallback.call(tager,serverdata);
                }

                cc.log("在线人数小于 总人数的95% serverdata:  " + JSON.stringify(serverdata));
                return;

            }
        }

        // 如果房间列表不是null ，强制进入第一个房间，由服务器判定能否进入房间。
        if((serverlist !== null) && (serverlist.length !== 0))
        {
            var serverdata = this.SearchServer(serverlist[0]["serverid"]);
            if((serverdata !== null) && (successedcallback))
            {
                cc.log("serverdata :" + JSON.stringify(serverdata));
                successedcallback.call(tager,serverdata);
                return;
            }
        }


        if(failedcallback)
        {
            failedcallback.call(tager,"该房间无法进入，请稍后再试或选择其他房间！", false);
        }
    },


    // 获取房间的在线人数 准入金额的上下限。
    GetRoomViewData:function(serveritemdata)
    {
        var roomViewData = new Array();
        //数据为空
        if(serveritemdata === undefined || serveritemdata===null || serveritemdata.length==0)
        {
            lm.log("未能连接服务器，请稍后再试！");
            return ;
        }

        var serverlist = serveritemdata["serverlist"];

        // 获取游戏服务器信息
        for(var key in serverlist)
        {
            var serverdata = this.SearchServer(serverlist[key]["serverid"]);
            if(serverdata == null)
            {
                lm.log("yyp+++ serverdata null :" + serverlist[key]["serverid"]);
                continue;
            }

            lm.log("yyp+++ serverdata :" + JSON.stringify(serverdata));

            roomViewData["dwOnlineCount"] = serverdata["dwOnlineCount"];
            roomViewData["lMinTabScore"] = serverdata["lMinTabScore"];
            roomViewData["lMaxTableScore"] = serverdata["lMaxTableScore"];

            break;
        }
        lm.log("yyp+++ －－－－－－－zfs-------------- :" + JSON.stringify(roomViewData));

        return roomViewData;

    }

});

// 服务器种类列表
var GameServerKind  = GameServerKind || new ServerKind();




/////////////////////////////////////////////////////////////////////////////////////////////////
//added begin by lizhongqiang 20150928 14:20
// 登录地址管理器

// 信用增、减规则
// 1.连接成功，信用 +1
// 2.连接失败，信用 -1
// 3.连接自动断开或异常， 信用 -1，并将该地址放在对尾
// 4.自己手动断开，信用不变；



// 初始信用值
var InitIncreaseValue = 100;


//登录地址管理
var LogonAddressListManager = cc.Class.extend({
    AddressDataArray:[],  // 地址列表
    AddressStorageName: "addresslist",
    firstAddressItem:{},
    userfistaddress:true,
    isNewUser:false,
    ctor: function ()
    {
        this.ReadAddressListData();
        if((this.AddressDataArray== undefined) ||
            (this.AddressDataArray == null)    ||
            (this.AddressDataArray.length == 0))
        {
            lm.log("this.isNewUser = true ");
            this.isNewUser = true;
        }else
        {
            lm.log("this.isNewUser = false ");
            this.isNewUser = false;
        }
    },

    FindAddress:function (address)
    {
        for(var key in this.AddressDataArray)
        {
            lm.log("FindAddress address: " + address + " dest :" + this.AddressDataArray[key]["serveradd"]);

            if(this.AddressDataArray[key]["serveradd"] == address)
            {
                lm.log("FindAddress 1: ");

                return true;
            }
        }
        lm.log("FindAddress 2 ");
        return false;
    },
    // 乱序
     shuffle :function()
     {
         var newarray = [];
         for (var k in  this.AddressDataArray)
         {
             if (this.AddressDataArray.hasOwnProperty(k))
             {
                 newarray.push(this.AddressDataArray[k]);
             }
        }
         newarray.sort(function ()
         {
             return 0.5 - Math.random();
         });

         this.AddressDataArray = [];
         this.AddressDataArray = newarray;
     },
    //更新登录地址列表
    UpdateAddressListData:function(addresslist)
    {
        var templist = addresslist;
        for(var key in templist)
        {
            // 获取该地址信用等级
            templist[key]["creditlevel"] = this.GetAddressCreditLevel(templist[key]["serveradd"]);
        }

        // 清空数组重新添加
        this.AddressDataArray=[];
        for(var key in templist)
        {
            if(this.FindAddress(templist[key]["serveradd"]) == false)
            {
                this.AddressDataArray.push(templist[key]);
            }
        }

        //若新用户，因为信用值一样，故需要乱序；
        if(this.isNewUser )
        {
            lm.log("UpdateAddressListData address old: " + JSON.stringify(this.AddressDataArray));
            this.shuffle();
            lm.log("UpdateAddressListData address new: " + JSON.stringify(this.AddressDataArray));

        }else
        {
            ///按照信用等级，从小到大排序
            this.AddressDataArray.sort(function(a, b){
                if(Number(a["creditlevel"]) < Number(b["creditlevel"]))
                {
                    return true;
                }
                else
                {
                    return false;
                }
            });
        }

        // 获取首地址
        if((this.AddressDataArray !== undefined) &&
            (this.AddressDataArray !== null) &&
            (this.AddressDataArray.length > 0))
        {
            this.firstAddressItem = this.AddressDataArray[0];
            lm.log("firstAddress address: " + this.firstAddressItem["serveradd"]);
        }

        this.userfistaddress = true;
        this.SaveAddressListData();
    },

    //获取地址的信用等级
    GetAddressCreditLevel:function(serveraddress)
    {
        var templist = this.AddressDataArray;
        for(var key in templist)
        {
            if(templist[key]["serveradd"]== serveraddress)
            {
                if(templist[key]["creditlevel"] != undefined )
                {
                  return  Number( templist[key]["creditlevel"]);
                }
            }
        }

        return  InitIncreaseValue;
    },

    //轮询地址
    GetNextAddress:function()
    {
        if((this.AddressDataArray !== null) &&
            (this.AddressDataArray !== undefined) &&
            (this.AddressDataArray.length > 0))
        {
            lm.log("GetNextAddress 0  " );
            if(this.userfistaddress == true)
            {
                this.userfistaddress = false;
                return this.AddressDataArray[0];
            }

            lm.log("GetNextAddress 1  " );
            if(this.AddressDataArray.length == 1)
            {
                lm.log("GetNextAddress: " + JSON.stringify(this.AddressDataArray[0]));
                return this.AddressDataArray[0];
            }

            // 大于1 个地址的情况，检测取出来的地址是否首地址，若不是就返回，否则获取失败；
            if((this.firstAddressItem["serveradd"] !== undefined) &&
                (this.AddressDataArray[0]["serveradd"] !== this.firstAddressItem["serveradd"]))
            {
                lm.log("GetNextAddress 2  " );
                return this.AddressDataArray[0];
            }
        }

        return null;
    },

    //增加信用，并将该地址放在队首
    AddCreditLevel:function(serveraddress)
    {
        var itemdata = null;
        for(var key in this.AddressDataArray)
        {
            if(this.AddressDataArray[key]["serveradd"]== serveraddress)
            {
                itemdata = this.AddressDataArray[key];
                this.AddressDataArray.splice(key, 1);
                break;
            }
        }

        if(itemdata != null)
        {
            var temvalue = itemdata["creditlevel"];
            if(temvalue != undefined )
                itemdata["creditlevel"] = Number(temvalue) + 1;
            else
                itemdata["creditlevel"] = InitIncreaseValue + 1;

            this.AddressDataArray.unshift(itemdata);
            this.SaveAddressListData();
            lm.log("IncreaseAddressCreditLevel: " + JSON.stringify(this.AddressDataArray));
        }
    },
    //减少信用，将该地址放到队尾
    ReduceCreditLevel:function(serveraddress)
    {
        var itemdata = null;
        for(var key in this.AddressDataArray)
        {
            if(this.AddressDataArray[key]["serveradd"]== serveraddress)
            {
                itemdata = this.AddressDataArray[key];
                this.AddressDataArray.splice(key, 1);
                break;
            }
        }

        if(itemdata != null)
        {
            var temvalue = itemdata["creditlevel"];
            if(temvalue != undefined )
                itemdata["creditlevel"] = Number(temvalue) - 1;
            else
                itemdata["creditlevel"] = InitIncreaseValue - 1;

            this.AddressDataArray.push(itemdata);
            this.SaveAddressListData();
            lm.log("ReduceAddressCreditLevel: " + JSON.stringify(this.AddressDataArray));
        }

    },
    // 保存本地数据
    SaveAddressListData: function () {
        try
        {
            if((this.AddressDataArray !== null) && (this.AddressDataArray !== undefined) && (this.AddressDataArray.length >0))
            {
                sys.localStorage.setItem(this.AddressStorageName, JSON.stringify(this.AddressDataArray));
                cc.log("SaveLocalData  " + JSON.stringify(this.AddressDataArray));
            }

        } catch (e)
        {
            if (e.name === "SECURITY_ERR" || e.name === "QuotaExceededError") {
                cc.warn("err: localStorage isn't enabled. Please confirm browser cookie or privacy option");
            }
        }
    },
    // 读取本地数据
    ReadAddressListData: function ()
    {
        try
        {
            var data = sys.localStorage.getItem(this.AddressStorageName);
            if(data !== null)
            {
                this.AddressDataArray =  JSON.parse(data);

                ///按照信用等级，从小到大排序
                this.AddressDataArray.sort(function(a, b){
                    if(Number(a["creditlevel"]) < Number(b["creditlevel"]))
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                });

                // 获取最后一个地址
                if((this.AddressDataArray !== undefined) &&
                    (this.AddressDataArray !== null) &&
                    (this.AddressDataArray.length > 0))
                {
                    this.firstAddressItem = this.AddressDataArray[0];
                    lm.log("firstAddress address: " + this.firstAddressItem["serveradd"]);
                }
            }

        } catch (e)
        {

            if (e.name === "SECURITY_ERR" || e.name === "QuotaExceededError") {
                cc.warn("Warning: localStorage isn't enabled. Please confirm browser cookie or privacy option");
            }
        }
    }

});

var logonAddressListManger =  new  LogonAddressListManager();
// end added by lizhongqiang 2015-09-28 14:20

