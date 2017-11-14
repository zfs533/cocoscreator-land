/**
 * Created by lizhongqiang on 15/5/28.
 */



//游戏种类数据大小 sizeof(tagGameKind)
var tagGameKindSize = 146;

//游戏房间列表 sizeof(tagGameServer)
var tagGameServerSize = 182;

// 分割线颜色
var lineColor = cc.color(34, 115, 173, 230);

var AccountLoginUILayer = rootLayer.extend({
    ctor: function () {
        this._super();
        this.initLayer();
    },
    editBoxEditingDidBegin: function (sender) {
        if(GetDeviceType() != DeviceType.ANDROID)
        {
            this.btn_account_up.setVisible(false);
            this.btn_account_down.setVisible(true);
            this.listview_account.setVisible(false);
            this.parentView.setPosition(cc.p(this.org_pos.x, this.org_pos.y + winSize.height * 0.2));
            this.textfield_account.setPosition(cc.p(148, 35));
            this.textfield_password.setPosition(cc.p(148, 35));
        }


    },
    editBoxEditingDidEnd: function (sender) {

        if(GetDeviceType() != DeviceType.ANDROID)
        {
            this.parentView.setPosition(this.org_pos);
            this.textfield_account.setPosition(cc.p(148, 35));
            this.textfield_password.setPosition(cc.p(148, 35));
        }
    },
    initLayer: function () {

        this.parentView = ccs.load("res/cocosOut/accountUILayer.json").node;


        this.addChild(this.parentView);
        this.org_pos = this.parentView.getPosition();
        //this.parentView.setPosition((winSize.width-960)/2,0);
        //hanhu #调整登录坐标 2015/08/07
        var offset = (this.parentView.getContentSize().width * winSize.height / 640 - winSize.width) / 2;
        this.parentView.x -= offset;


        var panel_account_close = ccui.helper.seekWidgetByName(this.parentView, "panel_account_close");
        //hanhu #向下传递点击事件 2015/08/13
        panel_account_close.setSwallowTouches(false);
        //账号列表向下按钮
        this.btn_account_down = ccui.helper.seekWidgetByName(this.parentView, "btn_account_down");

        //账号列表向上按钮
        this.btn_account_up = ccui.helper.seekWidgetByName(this.parentView, "btn_account_up");

        //账号列表
        this.listview_account = ccui.helper.seekWidgetByName(this.parentView, "listview_account");

        //账号输入
        var panel_account = ccui.helper.seekWidgetByName(this.parentView, "panel_account");
        this.textfield_account = layerManager.CreateDefultEditBox(this, cc.size(300, 50), cc.p(0, 0.5), cc.p(148, 35), "请输入账号", cc.color(0, 0, 0, 240), false);
        panel_account.addChild(this.textfield_account);

        //密码输入
        var panel_password = ccui.helper.seekWidgetByName(this.parentView, "panel_password");
        this.textfield_password = layerManager.CreateDefultEditBox(this, cc.size(330, 50), cc.p(0, 0.5), cc.p(148, 35), "请输入密码", cc.color(0, 0, 0, 240), true);
        panel_password.addChild(this.textfield_password);


        //账号是否是一键注册
        this.type = false;

        //账号登陆按钮
        var btn_account_login = ccui.helper.seekWidgetByName(this.parentView, "btn_account_login");
        btn_account_login.setSwallowTouches(false);

        //设置背景颜色
        this.setDarkBg();

        //设置模版
        this.defaultItem = ccui.helper.seekWidgetByName(ccs.load("res/cocosOut/LoginChoseListUILayer.json").node, "panel_accounts").clone();
        this.listview_account.setItemModel(this.defaultItem);

        var self = this;

        //账号列表向下按钮事件处理
        this.btn_account_down.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                lm.log("btn btn_account_down button clicked");
                this.btn_account_up.setVisible(true);
                this.btn_account_down.setVisible(false);
                this.listview_account.setVisible(true);
                //lm.log("this is check the button ");
                this.RefreshAccountListView();
            }

        }, this);


        //账号列表向上按钮事件处理
        this.btn_account_up.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                lm.log("btn btn_account_up button clicked");
                this.btn_account_up.setVisible(false);
                this.btn_account_down.setVisible(true);
                this.listview_account.setVisible(false);
            }

        }, this);

        //账号登陆按钮事件处理
        btn_account_login.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                var userName = this.textfield_account.getString();
                if ((userName == null) || (userName.length == 0)) {
                    layerManager.addLayerToParent(new PopAutoTipsUILayer("账号不能为空，请输入账号！", DefultPopTipsTime), self);
                    return;
                }

                var passWord = this.textfield_password.getString();
                if ((passWord == null) || (passWord.length == 0)) {
                    layerManager.addLayerToParent(new PopAutoTipsUILayer("密码不符合规则，请重新输入！", DefultPopTipsTime), self);
                    return;
                }

                // 设置登录回调接口
                plazaMsgManager.SetLogonCallBack(
                    function () // 连接服务器失败
                    {
                        // 连接失败重试
                        var pop = new ConfirmPop(this, Poptype.yesno, matchName + "当前网络异常，请检查网络状态后重试！");//ok
                        pop.addToNode(cc.director.getRunningScene());
                        pop.hideCloseBtn();
                        pop.setYesNoCallback(
                            function(){
                                this.LoginPlaza();
                            }
                        );

                        //layerManager.PopTipLayer(new PopTipsUILayer("重试", "取消", "当前网络异常，请检查网络状态后重试！", function (id) {
                        //    if (id == clickid.ok) {
                        //        // 登录大厅
                        //        this.LoginPlaza();
                        //    }
                        //
                        //}), true);

                    },
                    function () // 登录大厅成功
                    {

                        if (SubMitAppstoreVersion == true || DoNotMatchRoomVersion == true) {
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

                            var curLayer = new PlazaUILayer();  //不在调用
                            curLayer.setTag(ClientModuleType.Plaza);
                            layerManager.repalceLayer(curLayer);
                        }

                    },
                    function (info) { // 登录大厅失败

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

                        //layerManager.PopTipLayer(new PopTipsUILayer("退出游戏", "取消", info, function (id) {
                        //    if (id == clickid.ok) {
                        //        ExitGame();
                        //    }
                        //
                        //}));

                    }, this);


                // 保存当前玩家信息
                userInfo.SetCurPlayerInFo(userName, passWord);

                layerManager.PopTipLayer(new WaitUILayer("正在登录服务器，请稍后...", function () {

                }, this));

                // 登录大厅
                this.LoginPlaza();

            }

        }, this);


        //注册账号
        var btn_account_register = ccui.helper.seekWidgetByName(this.parentView, "btn_account_register");
        btn_account_register.setSwallowTouches(false);
        btn_account_register.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {

                var registerurl = roomManager.GetNoticeData()["registerurl"];
                lm.log("registerurl: " + registerurl);
                if (registerurl !== undefined && registerurl !== null) {
                    var width = cc.director.getVisibleSize().width - webviewNotice_offset_x;
                    var height = cc.director.getVisibleSize().height - webviewNotice_offset_y;

                    var mwidth = 0, mheight = 0;
                    if (cc.director.getVisibleSize().width / cc.director.getVisibleSize().height <= 1.5) {
                        mwidth = Math.floor(cc.director.getVisibleSize().width);
                        mheight = Math.floor(cc.director.getVisibleSize().height);
                    } else {
                        mwidth = Math.floor(cc.director.getVisibleSize().width / 2);
                        mheight = Math.floor(cc.director.getVisibleSize().height / 2);
                    }

                    //有推广员账号的，传送推广员账号到服务器；
                    var staffacount =  DataUtil.GetStaffAccount();
                    var localUrl = registerurl + "&mwidth=" + mwidth + "&mheight=" + mheight ;
                    if(staffacount != null)
                    {
                        localUrl = registerurl + "&mwidth=" + mwidth + "&mheight=" + mheight + "&spreader=" + staffacount +"&gameid=" + Game_ID + "&devicetype="  + GetDeviceType();
                    }

                    layerManager.PopTipLayer(new WebViewUILayer(Math.floor(width), Math.floor(height), localUrl));
                }

            }
        }, this);


        //关闭按钮事件处理
        panel_account_close.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                lm.log("btn panel_account_close button clicked");
                this.removeFromParent();
            }

        }, this);

    },

    LoginPlaza:function()
    {
        var userName = this.textfield_account.getString();
        var passWord = this.textfield_password.getString();

        if (this.type == true) {
            lm.log("一键注册的账号: user-" + userName + " password-" + passWord);
            //一键注册的账号
            plazaMsgManager.LogonPlazaEx(userName, passWord, GetFuuID(), "");
        } else {
            //非一键注册的账号
            lm.log("非一键注册的账号: user - " + userName + " password - " + passWord);
            plazaMsgManager.LogonPlaza(userName, passWord, GetFuuID(), "");(userName, passWord, GetFuuID(), "");
        }
    },

    // 刷新账号列表
    RefreshAccountListView: function () {
        var self = this;
        this.listview_account.removeAllItems();
        for (var i = 0; i < userInfo.GetLocalDataCount(); i++) {
            var historydata = userInfo.GetLocalData(i);
            if (historydata === null)
                continue;
            if (historydata["url"] != plazaMsgManager.address)
                continue;

            this.listview_account.pushBackDefaultItem();
            var nextItem = this.getLastListItem();

            // 账号
            var btn_account_other = ccui.helper.seekWidgetByName(nextItem, "btn_account_other");

            //注销按钮
            var btn_account_closed = ccui.helper.seekWidgetByName(nextItem, "btn_account_closed_up");

            var image_line = ccui.helper.seekWidgetByName(nextItem, "image_line");


            var text_account_other = ccui.helper.seekWidgetByName(nextItem, "text_account_other");
            if (historydata["account"] !== null && historydata["account"] !== undefined) {
                text_account_other.setString(historydata["account"]);
            }

            image_line.setColor(lineColor);

            btn_account_other.account = historydata["account"];
            btn_account_other.password = historydata["password"];
            btn_account_other.reType = historydata["type"];

            lm.log("reType:" + historydata["type"] + " nickname " + historydata["nickname"]);
            //点击事件
            btn_account_other.addTouchEventListener(function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {

                    self.textfield_account.setString(sender.account);
                    self.textfield_password.setString(sender.password);
                    self.btn_account_up.setVisible(false);
                    self.btn_account_down.setVisible(true);
                    self.listview_account.setVisible(false);
                    self.type = sender.reType;

                }
            }, this);


            //注销的事件
            btn_account_closed.nextItem = nextItem;
            btn_account_closed.userid = historydata["userid"];
            btn_account_closed.url = historydata["url"];
            btn_account_closed.addTouchEventListener(function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {
                    //删除莫个固定的账号
                    userInfo.DeleteLocalData(sender.userid, sender.url);

                    self.listview_account.removeChild(sender.nextItem, true);

                }
            }, this);

        }

    },
    getLastListItem: function () {
        if (this.listview_account.getItems().length)
            return this.listview_account.getItems()[this.listview_account.getItems().length - 1];
    }
});