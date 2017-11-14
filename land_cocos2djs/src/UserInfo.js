/**
 * Created by baibo on 15/6/3.
 */


// 订单状态
var UserOrderStatus=
{
    uncomplete:0,    // 未完成
    wait:1,          // 等待处理
    complete:2       // 已完成
};


// 会员状态
var MemberStatus=
{
    Seal:0, // 激活
    Active:1 //封存
}

var UserInfo = cc.Class.extend({
    globalUserdData: null,
    accountArrayStorageName: "userdata",
    accountDataArray:[],       // 本地账号相关数据 -金币、 音量、音效
    
    orderArrayStorageName: "orderData",
    orderDataArray:[],        // 订单数组
    
    curPlayerAccount: null,
    curPlayerPassword: null,

    isNewPlayer: 1,

    cbPay:0,                    //首冲标志
    dwReliefCountOfDay:0,       //已经领取的次数
    dwReliefCountOfDayMax:0,    //总共可以领的次数
    dwReliefGold:0,             //救济金金额
    initLocalData: function ()
    {
        this.ReadLocalData();
    },

    // 设置当前用户信息
    SetCurPlayerInFo: function (account, password) {
        this.curPlayerAccount = account;
        this.curPlayerPassword = password;

    },
    // 获取当前用户账户
    GetCurPlayerAccount: function (account, password) {
        return this.curPlayerAccount;
    },

    //获取当前用户密码
    GetCurPlayerPassword: function (account, password) {
        //lm.log("发送的密码为:" + this.curPlayerPassword)
        return this.curPlayerPassword;
    },
    //获取用户的类型是否为注册用户
    GetCurPlyarType: function( url ){

        for(var key in this.accountDataArray){
            if(this.accountDataArray[key]["account"] == this.curPlayerAccount && this.accountDataArray[key]["url"] == url){

                return this.accountDataArray[key]["type"]
            }
        }
        return false;
    },

    // 获取当前激活会员
    GetCurActiveMemberData:function()
    {

        if((userInfo.globalUserdData["userinfoex"] !== undefined) &&
            (userInfo.globalUserdData["userinfoex"] !== null) &&
            (userInfo.globalUserdData["userinfoex"]["memberlist"] != undefined) &&
            (userInfo.globalUserdData["userinfoex"]["memberlist"] != null))
        {
            var memberlist = userInfo.globalUserdData["userinfoex"]["memberlist"];
            lm.log("GetCurActiveMemberData  memberlist : " + JSON.stringify(memberlist));
            for(var key in  memberlist)
            {

                if(Number(memberlist[key]["activestatus"]) == MemberStatus.Active)
                {
                    return memberlist[key];
                }
            }
        }

        return null;
    },

    // 更新会员数据
    UpdateMemberData:function(data)
    {
        if((userInfo.globalUserdData["userinfoex"] !== undefined) &&
            (userInfo.globalUserdData["userinfoex"] !== null) &&
            (userInfo.globalUserdData["userinfoex"]["memberlist"] != undefined) &&
            (userInfo.globalUserdData["userinfoex"]["memberlist"] != null)) {
            var memberlist = userInfo.globalUserdData["userinfoex"]["memberlist"];

            for (var key in memberlist) {
                // 查找到该会员，就修改信息
                if (memberlist[key]["memberorder"] === data["memberorder"]) {
                    memberlist[key] = data;
                    this.SaveLocalData();
                    return;
                }
            }
        }else{

            if(userInfo.globalUserdData["userinfoex"] == undefined || userInfo.globalUserdData["userinfoex"] == null){
                userInfo.globalUserdData["userinfoex"] = [];
            }
            userInfo.globalUserdData["userinfoex"]["memberlist"] = [];
            userInfo.globalUserdData["userinfoex"]["memberlist"].push(data);
            this.SaveLocalData();

        }
    },

    //更新用户得分
    UpdateUserScore:function(score)
    {
        userInfo.globalUserdData["lUserScore"] = score;
        //lm.log("更新用户金币 = " + userInfo.globalUserdData["lUserScore"]);
        for(var key in userInfo.accountDataArray){
            if( userInfo.accountDataArray[key]["userid"] == userInfo.globalUserdData["dwUserID"] && userInfo.accountDataArray[key]["url"] == plazaMsgManager.address){

                userInfo.accountDataArray[key]["gold"] = score;
            }
        }

        this.SaveLocalData();
    },
    //获取用户得分
    GetUserScore:function()
    {
        return  userInfo.globalUserdData["lUserScore"];
    },
    //用户是否已经绑定手机
    IsHasBoundMobile:function()
    {
        if((userInfo.globalUserdData["userinfoex"] !== undefined) &&
            (userInfo.globalUserdData["userinfoex"] !== null) &&
            (userInfo.globalUserdData["userinfoex"]["hasBoundMobile"] != undefined))
        {

            return (Number(userInfo.globalUserdData["userinfoex"]["hasBoundMobile"]));
        }

        return false;
    },

    //获取绑定手机的奖励信息
   GetBoundMobileAwardInFo:function()
    {
        if((userInfo.globalUserdData["userinfoex"] !== undefined) &&
            (userInfo.globalUserdData["userinfoex"] !== null) &&
            (userInfo.globalUserdData["userinfoex"]["BoundAwardInfo"] != undefined))
        {

            return  userInfo.globalUserdData["userinfoex"]["BoundAwardInfo"];
        }

        return null;
    },



    // 添加用户数据
    AppendLocalData: function (account, password, userid, faceid, customfaceid, nickname, gold, loginType, type, url)
    {
        //查找用户，从数组中删除，并返回原数据；
        var userdata = this.FindLocalData(userid,url);

        if(userdata !== null)
        {
            lm.log("modify user info: " + url)
            userdata["account"] = account;
            userdata["password"] = password;
            userdata["faceid"] = faceid;
            userdata["customfaceid"] = customfaceid;
            userdata["nickname"] = nickname;
            userdata["gold"] = gold;
            userdata["type"] = userdata["type"];
            userdata["url"] = url;
            userdata["loginType"] = loginType;

            var oldDay = userdata["loginDay"];
            var date = new Date();
            var newDay = date.getDate();
            if(oldDay != newDay)
            {
                userdata["loginDay"] = newDay;
                userdata["autoMark"] = true;
            }
            else
            {
                userdata["autoMark"] = false;
            }



            if(userdata["muicvolume"] == undefined){
                userdata["muicvolume"] = 50;
            }
            if(userdata["soundvolume"] == undefined){
                userdata["soundvolume"] = 50;
            }
            this.accountDataArray.push(userdata);

            //hanhu #用户登录成功后使用之前的音量配置 2015/12/02
            lm.log("音乐音量为：" + userInfo.GetSystemVolume(true));
            lm.log("音效音量为：" + userInfo.GetSystemVolume(false));
            cc.audioEngine.setMusicVolume(userdata["muicvolume"] / 100);
            cc.audioEngine.setEffectsVolume(userdata["soundvolume"] / 100);

        }else
        {
            lm.log("YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY");
            // 没有找到该用户就加入；
            var user = {};
            user["account"] = account;
            user["password"] = password;
            user["userid"] = userid;
            user["faceid"] = faceid;
            user["customfaceid"] = customfaceid;
            user["nickname"] = nickname;
            user["gold"] = gold;
            user["type"] = type;
            user["url"] = url;
            user["loginType"] = loginType;
            user["muicvolume"] = 50;
            user["soundvolume"] = 50;

            var date = new Date();
            var newDay = date.getDate();
            user["loginDay"] = newDay;
            user["autoMark"] = true;

            this.accountDataArray.push(user);

            cc.audioEngine.setMusicVolume(user["muicvolume"] / 100);
            cc.audioEngine.setEffectsVolume(user["soundvolume"] / 100);
        }

        this.SaveLocalData();
        DataUtil.AkeyRegisterUser  = false;
    },

    //更新用户本地存储的头像信息
    UpdateUserFaceID:function(userid, faceid, customfaceid,url)
    {
        for (var key in this.accountDataArray) {

            lm.log("AppendLocalData " + JSON.stringify(this.accountDataArray[key]));
            // 找到该用户，修改
            if (this.accountDataArray[key]["userid"] == userid && this.accountDataArray[key]["url"] == url) {
                lm.log("modify user info:")
                this.accountDataArray[key]["faceid"] = faceid;
                this.accountDataArray[key]["customfaceid"] = customfaceid;
                lm.log("ModifyLogonHistoryData " + JSON.stringify(this.accountDataArray[key]));
                this.SaveLocalData();
                return;
            }
        }
    },

    // 删除指定用户数据 返回拷贝数据
    FindLocalData:function(userid,url)
    {
        for (var key in this.accountDataArray) {

            lm.log("AppendLocalData：" + JSON.stringify(this.accountDataArray[key]));

            // 找到该用户，修改
            if (this.accountDataArray[key]["userid"] == userid && this.accountDataArray[key]["url"] == url) {

                var  userdata = DataUtil.copyJson(this.accountDataArray[key]);
                this.accountDataArray.splice(key,1);
                return userdata;
            }
        }

        return null;
    },
    DeleteLocalData:function(userid,url)
    {
        for (var key in this.accountDataArray) {

            // 找到该用户，修改
            if (this.accountDataArray[key]["userid"] == userid && this.accountDataArray[key]["url"] == url) {

                this.accountDataArray.splice(key,1);
                return true;
            }
        }

        return false;
    },

    //设置系统音量
    SetSystemVolume: function(volume,  bMusic)
    {
        for (var key in this.accountDataArray) {

            lm.log("SetSystemVolume " + JSON.stringify(this.accountDataArray[key]));
            // 找到该用户，修改
            if (this.accountDataArray[key]["userid"] == this.globalUserdData["dwUserID"] && this.accountDataArray[key]["url"] == plazaMsgManager.address)
            {
                lm.log("modify user muicvolume :" + volume)
                if(bMusic)
                {
                    lm.log("muicvolume---------------------"+ volume);
                    this.accountDataArray[key]["muicvolume"] = volume;
                }
                else
                {
                    lm.log("soundvolume---------------------"+ volume);
                    this.accountDataArray[key]["soundvolume"] = volume;
                }

                this.SaveLocalData();
                return;
            }
        }

        // 没有找到该用户就加入；
        var user = {};
        if(bMusic)
        {
            user["muicvolume"] = volume;
        }
        else
        {
            user["soundvolume"] = volume;
        }
        //hanhu #补全userInfo 2015/08/13
        user["userid"] = this.globalUserdData["dwUserID"];
        user["url"] = plazaMsgManager.address;

        this.accountDataArray.push(user);
        lm.log("SetSystemVolume " + JSON.stringify(user));
        this.SaveLocalData();
    },

    //获取音量
    GetSystemVolume: function(bMusic){

        for(var key in this.accountDataArray){

            if (this.accountDataArray[key]["userid"] == this.globalUserdData["dwUserID"] && this.accountDataArray[key]["url"] == plazaMsgManager.address){
                //if(bMusic){
                //
                //    return this.accountDataArray[key]["muicvolume"];
                //
                //}else{
                //
                //    return this.accountDataArray[key]["soundvolume"];
                //
                //}
                //hanhu #检测音效音量是否正确获取 2015/09/24
                var effectVolume;
                if(bMusic)
                {
                    effectVolume = this.accountDataArray[key]["muicvolume"];
                }
                else
                {
                    effectVolume = this.accountDataArray[key]["soundvolume"];
                }

                if(effectVolume == undefined || effectVolume < 0)
                {
                    effectVolume = 50;
                }

                return effectVolume;
            }
        }
        return 50;

    },


    // 保存本地数据
    SaveLocalData: function () {
        try
        {
            if((this.accountDataArray !== null) && (this.accountDataArray !== undefined) && (this.accountDataArray.length !== 0))
            {
                sys.localStorage.setItem(this.accountArrayStorageName, JSON.stringify(this.accountDataArray));
                lm.log("SaveLocalData  " + JSON.stringify(this.accountDataArray));
            }

        } catch (e)
        {
            if (e.name === "SECURITY_ERR" || e.name === "QuotaExceededError") {
                cc.warn("err: localStorage isn't enabled. Please confirm browser cookie or privacy option");
            }
        }

    },

    // 读取本地数据
    ReadLocalData: function () {
        try
        {
            var data = sys.localStorage.getItem(this.accountArrayStorageName);
            if(data !== null)
            {
                this.accountDataArray =  JSON.parse(data);
            }

        } catch (e)
        {

            if (e.name === "SECURITY_ERR" || e.name === "QuotaExceededError") {
                cc.warn("Warning: localStorage isn't enabled. Please confirm browser cookie or privacy option");
            }
        }

    },
    //获取最近账号本地数据
    GetLastLocalData: function (url) {
        if (this.accountDataArray === null)
        {

            lm.log("GetLastLocalData 0:")
            return null;
        }

        var lenth = this.accountDataArray.length;
        if (lenth > 0) {
            for( var key = lenth - 1; key >= 0; key-- )
            {
                lm.log("GetLastLocalData url1: " + this.accountDataArray[key]["url"]  +  "  url 2  "  + url);
                if(this.accountDataArray[key]["url"] == url)
                {
                    return this.accountDataArray[key];
                }
            }
        }

        return null;
    },
    // 获取指定index数据
    GetLocalData: function (index) {
        if (this.accountDataArray === null)
            return null;

        var lenth = this.accountDataArray.length;
        if (lenth >= 0 && index < lenth) {
            return this.accountDataArray[index];
        }

        return null;
    },

    //获取本地账户数据数量
    GetLocalDataCount:function()
    {
       return  ((this.accountDataArray === null)? 0 :this.accountDataArray.length );
    },

    // 清空本地账户数据
    RemoveAccountData: function () {

        this.accountDataArray = [];
        sys.localStorage.removeItem(this.accountArrayStorageName);
    },

    // 读取订单数据
    ReadOrderData: function () {
        try
        {
            var data = sys.localStorage.getItem(this.accountArrayStorageName);
            if((data !== null) && (data !== undefined))
            {
                this.accountDataArray =  JSON.parse(data);
            }
        } catch (e)
        {

            if (e.name === "SECURITY_ERR" || e.name === "QuotaExceededError") {
                cc.warn("Warning: localStorage isn't enabled. Please confirm browser cookie or privacy option");
            }
        }
    },

    // 添加订单数据
    AppendOrderData: function (userid, orderid, approductid, orderamount, appletransaction, orderstatus)
    {
        var orderdata = {};
        orderdata["userid"] = userid;
        orderdata["orderid"] = orderid;
        orderdata["approductid"] = approductid;
        orderdata["orderamount"] = orderamount;
        orderdata["appletransaction"] = appletransaction;
        orderdata["orderstatus"] = orderstatus;
        this.orderDataArray.push(orderdata);
        lm.log("AppendOrderData " + JSON.stringify(orderdata));
        this.SaveOrderData();
    },

    // 修改凭证
    SetOrderReceipt:function(orderid, receipt)
    {
        if(this.orderDataArray.length==0)
        {
            this.ReadOrderData();
        }

        for (var key in this.orderDataArray) {

            lm.log("JS AppendOrderReceipt " + JSON.stringify(this.orderDataArray[key]));
            // 找到该订单，修改
            if ((this.orderDataArray[key]["orderid"] == orderid))
            {

                this.orderDataArray[key]["receipt"] = receipt;
                this.SaveOrderData();
                return;
            }
        }
    },

    // 保存订单数据
    SaveOrderData: function () {
        try {

            if((this.orderDataArray !== null) && (this.orderDataArray !== undefined) && (this.orderDataArray.length !== 0 ))
            {
                sys.localStorage.setItem(this.orderArrayStorageName, JSON.stringify(this.orderDataArray));
                lm.log("SaveOrderData  " + JSON.stringify(this.orderDataArray));
            }

        } catch (e) {
            if (e.name === "SECURITY_ERR" || e.name === "QuotaExceededError") {
                lm.log("err: localStorage isn't enabled. Please confirm browser cookie or privacy option");
            }
        }
    },


    // 读取订单数据
    ReadOrderData: function () {
        try
        {
            var data = sys.localStorage.getItem(this.orderArrayStorageName);
            if((data !== null) && (data !== undefined))
            {
                this.orderDataArray =  JSON.parse(data);
            }

        } catch (e)
        {

            if (e.name === "SECURITY_ERR" || e.name === "QuotaExceededError")
            {
                lm.log("Warning: localStorage isn't enabled. Please confirm browser cookie or privacy option");
            }
        }
    },

    // 获取指定用户没有完成的订单
    GetUnCompleteOrder:function(userid) {
        if ((this.orderDataArray === undefined) ||
            (this.orderDataArray === null) ||
            (this.orderDataArray.length === 0)) {
            this.ReadOrderData();
        }
       // lm.log("GetUnCompleteOrder data: " + JSON.stringify( this.orderDataArray));
        var data = [];
        for (var key in this.orderDataArray) {
            if (Number(this.orderDataArray[key]["userid"]) == Number(userid))
            {
                if (Number(this.orderDataArray[key]["orderstatus"]) ==  UserOrderStatus.uncomplete)
                {
                    data.push(this.orderDataArray[key]);
                }
            }
        }
        return data;

    },
    // 完成订单
    CompleteOrder:function(orderid)
    {
        for (var key in this.orderDataArray)
        {
            if (this.orderDataArray[key]["orderid"] == orderid)
            {
                lm.log("完成订单: " + this.orderDataArray[key]["orderid"]);
                this.orderDataArray[key]["orderstatus"] = UserOrderStatus.complete;
                this.SaveOrderData();
                return;
            }
        }
    },

    //清空用户订单数据
    RemoveOrderData:function()
    {
        this.orderDataArray =[];
        sys.localStorage.removeItem(this.orderArrayStorageName);

    },
    //清空用户数据
    ClearUserData:function()
    {
        layerManager.IsNoticePop = false;
        layerManager.IsAutoPopMark = false;
       this.globalUserdData = null;
    }


})
var userInfo = userInfo || new UserInfo();