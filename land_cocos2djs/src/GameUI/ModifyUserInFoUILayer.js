/**
 * Created by lizhongqiang on 15/6/2.
 */


// 修改用户资料 操作定义
//var ModifyUserInfoDefine =
//{
//    //绑定手机
//    OPERATOR_BULID_MOBILE: 0,
//
//    //修改资料
//    OPERATOR_MODIFY_USERINFO: 1
//};

// 性别
var GenderDefine =
{
    // 女性性别
    GENDER_FEMAIL: 0,

    // 男性性别
    GENDER_MANKIND: 1
};

// VIP 状态
//var VIPStatusColor=
//{
//    ActiveColor:cc.color(73,255,45,255),
//    UnActiveColor:cc.color(252,229,46,255)
//};
//
//var VIPBackColor = cc.color(158,106,56,255);
//
//// 默认头像数目
//var DefultHeaderCount = 30 ;
//
//// 每一页ITEM 数目
//var EarchPageItemCount = 5;

// sex 1 - 男 0－女 2- 保密
var MODIFYUSERINFOUILAYER;
var ModifyUserInFoUILayer = cc.Layer.extend({
    _selected_Image: null, //hanhu #保存当前选中的头像 2015/08/08
    ctor: function (owner) {
        this._super();
        this.owner = owner;
        MODIFYUSERINFOUILAYER = this;
        this.initLayer();
        this.initTipsLayer();
        this.initAndroidBackKey();
    },

    onExit: function ()
    {
        this._super();
        MODIFYUSERINFOUILAYER = null;
    },

    initAndroidBackKey:function()
    {
        if(GetDeviceType() != DeviceType.ANDROID)
            return;

        var self = this;
        this.addChild(new AndroidBackKey(function(){
            self.removeFromParent();

        },this));
    },

    initLayer: function () {

        this.addChild(new cc.LayerColor(cc.color(0,0,0,100)));

        var self = this;
        this.parentView = ccs.load("res/landlord/cocosOut/ModifyUserUILayer.json").node;
        this.addChild(this.parentView);
        this.parentView.ignoreAnchorPointForPosition(false);
        this.parentView.setAnchorPoint(0.5,0.5);
        this.parentView.setPosition(winSize.width/2,winSize.height/2);

        this.origin = cc.p((winSize.width - this.parentView.getContentSize().width)/2, (winSize.height - this.parentView.getContentSize().height)/2);

        this.org_pos = this.parentView.getPosition();

        //调整位置
        var Image_label_bg = this.layer_view = ccui.helper.seekWidgetByName(this.parentView, "Image_label_bg");          //label
        Image_label_bg.setPositionX(Image_label_bg.getPositionX() + this.origin.x);

        //获取展示层控件
        {
            this.layer_view = ccui.helper.seekWidgetByName(this.parentView, "layer_view");          //展示层
            this.text_view_nick = ccui.helper.seekWidgetByName(this.layer_view, "text_view_nick");  //昵称
            this.text_view_sex = ccui.helper.seekWidgetByName(this.layer_view, "text_view_sex");    //性别

            this.text_view_gold = ccui.helper.seekWidgetByName(this.parentView, "text_view_gold");       //金币
            this.text_view_jianpai = ccui.helper.seekWidgetByName(this.parentView, "text_view_jianpai"); //奖牌
            this.text_view_total = ccui.helper.seekWidgetByName(this.parentView, "text_view_total");     //总牌局
            this.text_view_winRate = ccui.helper.seekWidgetByName(this.parentView, "text_view_winRate"); //胜率

            this.text_view_userid = ccui.helper.seekWidgetByName(this.parentView, "text_view_userid");   //用户id

            this.btn_modify = ccui.helper.seekWidgetByName(this.layer_view, "btn_modify");   //修改按钮
            this.btn_modify.setPressedActionEnabled(true);
            this.btn_modify.addTouchEventListener(function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED)
                {
                    this.layer_view.setVisible(false);
                    this.layer_modify.setVisible(true);
                }

            }, this);

        }

        //获取修改层控件
        {
            this.layer_modify = ccui.helper.seekWidgetByName(this.parentView, "layer_modify");  //修改层
            this.layer_modify.setVisible(false);

            //昵称显示
            this.textfield_modifyuserinfo_nick = layerManager.CreateDefultEditBox(this, cc.size(220, 30), cc.p(0, 0.5), cc.p(-176.26, 24), "昵称最多7个字", cc.color(191, 63, 42, 240), false);
            this.textfield_modifyuserinfo_nick.setMaxLength(7);
            this.layer_modify.addChild(this.textfield_modifyuserinfo_nick);

            //性别按钮
            {
                //选中男性/女性按钮
                this.btn_modifyuserinfo_malesex_select = ccui.helper.seekWidgetByName(this.layer_modify, "btn_modifyuserinfo_malesex_select");
                this.btn_modifyuserinfo_femalesex_select = ccui.helper.seekWidgetByName(this.layer_modify, "btn_modifyuserinfo_femalesex_select");

                //未选中男性按钮
                this.btn_modifyuserinfo_malesex_unselect = ccui.helper.seekWidgetByName(this.layer_modify, "btn_modifyuserinfo_malesex_unselect");
                this.btn_modifyuserinfo_malesex_unselect.addTouchEventListener(function (sender, type) {
                    if (type == ccui.Widget.TOUCH_ENDED) {

                        this.SetSex(false);
                    }

                }, this);

                //未选中女性按钮
                this.btn_modifyuserinfo_femalesex_unselect = ccui.helper.seekWidgetByName(this.layer_modify, "btn_modifyuserinfo_femalesex_unselect");
                this.btn_modifyuserinfo_femalesex_unselect.addTouchEventListener(function (sender, type) {
                    if (type == ccui.Widget.TOUCH_ENDED) {
                        this.SetSex(true);
                    }

                }, this);
            }

            //完成按钮
            //this.btn_modify = ccui.helper.seekWidgetByName(this.layer_view, "btn_modify");
            //layerManager.SetButtonPressAction(this.btn_modify);
            //this.btn_modify.addTouchEventListener(function (sender, type) {
            //    if (type == ccui.Widget.TOUCH_ENDED)
            //    {
            //        this.layer_view.setVisible(false);
            //        this.layer_modify.setVisible(true);
            //    }
            //
            //}, this);
        }
        //商城按钮
        this.btn_toMall = ccui.helper.seekWidgetByName(this.parentView, "btn_toMall");
        this.btn_toMall.setPressedActionEnabled(true);
        this.btn_toMall.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                this.owner.OnMallClicked();
            }

        }, this);

        // 更改头像按钮
        var Image_modifyuserinfo_header = ccui.helper.seekWidgetByName(this.parentView, "Image_modifyuserinfo_header");
        Image_modifyuserinfo_header.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {

                //begin modified by lizhongqiang 2016-01-27 10:00
                // IPHONE  8.0以下系统，屏蔽选择照片功能；
                if((Number(GetDeviceType()) == DeviceType.IOS) && (Number(GetSystemVersion()) < 8.0))
                {
                    WaittingLayerPopManager(new PopAutoTipsUILayer("您的系统版本过低，不支持此功能，请升级系统版本至8.0以上!", DefultPopTipsTime));

                }else{
                    ChooseImageFromAlbum(ChooseImageModule.ModifyUserCustomFace,80,80,1);
                }
                // end modified by lizhongqiang 2016-01-27
            }

        }, this);

        // 关闭按钮
        var panel_modifyuserinfo_close = ccui.helper.seekWidgetByName(this.parentView, "panel_modifyuserinfo_close");
        panel_modifyuserinfo_close.setPositionX(panel_modifyuserinfo_close.getPositionX() - this.origin.x);
        panel_modifyuserinfo_close.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                lm.log("btn panel_modifyuserinfo_close button clicked");
                this.removeFromParent();
            }

        }, this);

        // 确定按钮
        this.btn_complete = ccui.helper.seekWidgetByName(this.parentView, "btn_complete");
        this.btn_complete.setPressedActionEnabled(true);
        this.btn_complete.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                //修改昵称 性别
                {
                    var cursex =  self.GetSex();
                    var curnick = self.GetNickName();

                    lm.log("userInfo.globalUserdData cbGender: " +userInfo.globalUserdData["cbGender"] + " new ::" +cursex );
                    // 新昵称和旧昵称不同才修改
                    if(userInfo.globalUserdData["szNickName"] != curnick  ||
                        Number(userInfo.globalUserdData["cbGender"]) != cursex)
                    {
                        lm.log("username: " + userInfo.globalUserdData["szNickName"] + " destname:" +curnick );
                        plazaMsgManager.ModifyUserInFo(cursex,userInfo.globalUserdData["dwUserID"], userInfo.GetCurPlayerPassword(),curnick);

                        // 修改自定义头像
                        //if(!this.CustomFaceLayer.IsVisable())
                        {
                            if(cursex != userInfo.globalUserdData["cbGender"])
                            {
                                var wFaceID;
                                if(cursex == GenderDefine.GENDER_FEMAIL) //女
                                {
                                    wFaceID = Math.floor(Math.random()*5) + 6;
                                }
                                else
                                {
                                    wFaceID = Math.floor(Math.random()*5) + 1;

                                }
                                lm.log("new faceid: " + wFaceID );
                                userInfo.globalUserdData["wFaceID"] = wFaceID;
                                plazaMsgManager.ModifySystemFaceInFo(wFaceID,userInfo.globalUserdData["dwUserID"],userInfo.GetCurPlayerPassword(),"");
                            }
                        }

                    }
                    else
                    {
                        this.layer_view.setVisible(true);
                        this.layer_modify.setVisible(false);
                    }
                }

            }

        }, this);

        this.cusImageStr = DataUtil.GetImageName();
        this.UpdateUserInFoEx();

/*

        //如果已经绑定手机，就隐藏绑定奖励金币提示；
        //提示获取奖励信息并决定是否显示
        //var textfield_tipsbg    = ccui.helper.seekWidgetByName(this.parentView, "Image_modifyuserinfo_tip");
        //textfield_tipsbg.setVisible(userInfo.IsHasBoundMobile()?false:true);
        //var textfield_tipsgold  = ccui.helper.seekWidgetByName(this.parentView, "text_vip_tipsgold");
        //textfield_tipsgold.setVisible(userInfo.IsHasBoundMobile()?false:true);
        //if(userInfo.GetBoundMobileAwardInFo() !== null)
        //{
        //    textfield_tipsgold.setString(userInfo.GetBoundMobileAwardInFo() );
        //}



        // 自定义头像page视图
        //this.pageview_userface = ccui.helper.seekWidgetByName(this.parentView, "pageview_userface");


        //头像列表
        //this.RefreshUserHeaderView();

        // left btn
        var btn_modifyuserinfo_left = ccui.helper.seekWidgetByName(this.parentView, "btn_modifyuserinfo_left");
        // right btn
        var btn_modifyuserinfo_right = ccui.helper.seekWidgetByName(this.parentView, "btn_modifyuserinfo_right");

        btn_modifyuserinfo_left.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {

                self.pageview_userface.scrollToPage(self.pageview_userface.getCurPageIndex() - 1);
                //hanhu #左端隐藏左按钮,右端显示右按钮 2015/08/04
                var currentPage = self.pageview_userface.getCurPageIndex();
                if(currentPage == 0)
                {
                    btn_modifyuserinfo_left.setVisible(false);
                }
                var totalpage = self.pageview_userface.getPages().length - 1;
                if((currentPage + 1) == totalpage)
                {
                    btn_modifyuserinfo_right.setVisible(true);
                }
            }

        }, this);

        btn_modifyuserinfo_right.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                self.pageview_userface.scrollToPage(self.pageview_userface.getCurPageIndex() + 1);
                //hanhu #右端隐藏右按钮，左端显示左按钮
                var currentPage = self.pageview_userface.getCurPageIndex();
                var totalPage = self.pageview_userface.getPages().length - 1;
                if(currentPage == totalPage)
                {
                    btn_modifyuserinfo_right.setVisible(false);
                }
                if(currentPage == 1)
                {
                    btn_modifyuserinfo_left.setVisible(true);
                }
            }

        }, this);


        //hanhu #增加箭头动作
        var MoveLeft = cc.MoveBy(0.6, cc.p(-20, 0));
        var MoveRight = cc.MoveBy(0.6, cc.p(20, 0));
        var MoveLeft2 = cc.MoveBy(0.6, cc.p(-20, 0));
        var MoveRight2 = cc.MoveBy(0.6, cc.p(20, 0));
        var action1 =  new cc.Sequence(MoveLeft, MoveRight).repeatForever();
        var action2 =  new cc.Sequence(MoveRight2, MoveLeft2).repeatForever();
        btn_modifyuserinfo_left.runAction(action1);
        btn_modifyuserinfo_right.runAction(action2);
        btn_modifyuserinfo_left.x += 10;
        btn_modifyuserinfo_right.x += 10;
        //默认隐藏左箭头
        btn_modifyuserinfo_left.setVisible(false);
        //增加滑动监听
        self.pageview_userface.addEventListener(function()
        {
            var currentPage = self.pageview_userface.getCurPageIndex();
            var totalPage = self.pageview_userface.getPages().length - 1;
            //lm.log("页面翻转,totalPage= "+totalPage);
            if(currentPage == 0) //隐藏左侧箭头
            {
                btn_modifyuserinfo_left.setVisible(false);
            }
            if(currentPage == totalPage)//隐藏右侧箭头
            {
                btn_modifyuserinfo_right.setVisible(false);
            }
            if(currentPage == 1) //显示左侧箭头
            {
                btn_modifyuserinfo_left.setVisible(true);
            }
            if(currentPage == (totalPage - 1)) //显示右箭头
            {
                btn_modifyuserinfo_right.setVisible(true);
            }
        });





        //this.UpdateUserInFo();


        // 绑定手机按钮
        var btn_modifyuseinfo_bulidmobile = ccui.helper.seekWidgetByName(this.parentView, "btn_modifyuseinfo_bulidmobile");
        //hanhu 检查是否已绑定手机，绑定则不显示，未绑定则显示奖励信息 2015/08/13
        var bangdingFlag = userInfo.IsHasBoundMobile();
        btn_modifyuseinfo_bulidmobile.setVisible(!bangdingFlag);
        btn_modifyuseinfo_bulidmobile.setTouchEnabled(!bangdingFlag);
        var bangdingInfo = ccui.helper.seekWidgetByName(this.parentView, "text_vip_tipsgold");
        bangdingInfo.setVisible(!bangdingFlag);
        //lm.log("奖励信息为：" + userInfo.GetBoundMobileAwardInFo());
        if(userInfo.GetBoundMobileAwardInFo() !== null)
        {
            bangdingInfo.setString(userInfo.GetBoundMobileAwardInFo());
        }

        btn_modifyuseinfo_bulidmobile.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                WaittingLayerPopManager(new BulidMobileUILayer(self,function(tips)
                {
                    //增加金币，验证成功的回调
                    lm.log("更新金币，显示提示");
                    btn_modifyuseinfo_bulidmobile.setVisible(false);
                    textfield_tipsbg.setVisible(false);
                    textfield_tipsgold.setVisible(false);
                    //更新界面
                    plazaMsgManager.RequestMemberData();

                    WaittingLayerPopManager(new PopAutoTipsUILayer(tips,DefultPopTipsTime));

                }));
            }

        }, this);






        // 确定按钮
        var btn_complete = ccui.helper.seekWidgetByName(this.parentView, "btn_complete");
        btn_complete.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {

                var isCustomFace = self.CustomFaceLayer.IsVisable();
                var faceid = Number(self.Image_modifyuser_curface.getTag());
                var cursex =  self.GetSex();
                var curnick = self.GetNickName();

                // empty
                var newpassword = self.textfield_modifyuserinfo_newpassword.getString();
                var newpasswordagin = self.textfield_modifyuserinfo_newpassword_agin.getString();
                if(newpassword.length != 0 || newpasswordagin.length != 0)
                {
                    if ((newpassword == null) || (newpassword.length == 0)) {
                        WaittingLayerPopManager(new PopAutoTipsUILayer("新密码不能为空！", DefultPopTipsTime),self);
                        lm.log("newpassword is empty");
                        return;
                    }


                    if ((newpasswordagin == null) || (newpasswordagin.length == 0)) {
                        WaittingLayerPopManager(new PopAutoTipsUILayer("再次输入新密码不能为空！", DefultPopTipsTime),self);
                        lm.log("newpasswordagin is empty");
                        return;
                    }

                    if (newpassword != newpasswordagin) {
                        WaittingLayerPopManager(new PopAutoTipsUILayer("两次输入的密码不一致！", DefultPopTipsTime),self);
                        lm.log("newpasswordagin is empty");
                        return;
                    }
                }

                var bModify = false;

                lm.log("userInfo.globalUserdData cbGender: " +userInfo.globalUserdData["cbGender"] + " new ::" +cursex );
                // 新昵称和旧昵称不同才修改
                if(userInfo.globalUserdData["szNickName"] != curnick  ||
                    Number(userInfo.globalUserdData["cbGender"]) != cursex)
                {
                    bModify = true;
                    lm.log("username: " + userInfo.globalUserdData["szNickName"] + " destname:" +curnick );
                    WaittingLayerPopManager(new WaitUILayer("正在提交新资料，请稍后....", function()
                    {
                        WaittingLayerPopManager(new PopAutoTipsUILayer("连接服务器超时，请稍后重试！", DefultPopTipsTime));

                    },self),self);


                    // 用户资料修改
                    plazaMsgManager.ModifyUserInFo(cursex,userInfo.globalUserdData["dwUserID"], userInfo.GetCurPlayerPassword(),curnick);
                }

                // 修改自定义头像
                if(isCustomFace)
                {
                    if(cusImageStr != DataUtil.GetImageName()) {

                        bModify = true;
                        //lm.log("修改自定义头像................");
                        WaittingLayerPopManager(new WaitUILayer("正在提交新资料，请稍后....", function()
                        {
                            WaittingLayerPopManager(new PopAutoTipsUILayer("连接服务器超时，请稍后重试！", DefultPopTipsTime));

                        },self),self);

                        lm.log("dwUserID:"+ userInfo.globalUserdData["dwUserID"] + "-----name:"+ DataUtil.GetImageName() +"-----url:"+DataUtil.GetUpLoadWebURL() +"-----key:" +userInfo.globalUserdData["szLoginKey"]);
                        UpLoadUserCustomFace(2, userInfo.globalUserdData["dwUserID"], DataUtil.GetImageName(),DataUtil.GetUpLoadWebURL(),userInfo.globalUserdData["szLoginKey"]);

                    }

                }else
                {
                    // 系统头像修改 - 新头像和旧头像不一致才修改
                    if(faceid != 0){
                        if( faceid == Number(userInfo.globalUserdData["wFaceID"])){

                            if(userInfo.globalUserdData["dwCustomID"] != 0){

                                bModify = true;
                                //lm.log("修改系统头像");
                                WaittingLayerPopManager(new WaitUILayer("正在提交新资料，请稍后....", function()
                                {
                                    WaittingLayerPopManager(new PopAutoTipsUILayer("连接服务器超时，请稍后重试！", DefultPopTipsTime));

                                },self),self);

                                plazaMsgManager.ModifySystemFaceInFo(faceid,userInfo.globalUserdData["dwUserID"],userInfo.GetCurPlayerPassword(),"");

                            }

                        }else{
                            bModify = true;
                            //lm.log("修改系统头像");
                            WaittingLayerPopManager(new WaitUILayer("正在提交新资料，请稍后....", function()
                            {
                                WaittingLayerPopManager(new PopAutoTipsUILayer("连接服务器超时，请稍后重试！", DefultPopTipsTime));

                            },self),self);

                            plazaMsgManager.ModifySystemFaceInFo(faceid,userInfo.globalUserdData["dwUserID"],userInfo.GetCurPlayerPassword(),"");
                        }
                    }
                }

                if(bModify == false)self.removeFromParent();
            }

        }, this);





        //购买VIP
        this.text_vipinfo = ccui.helper.seekWidgetByName(this.parentView, "text_vipinfo");
        this.btn_modifyuseinfo_buyvip = ccui.helper.seekWidgetByName(this.parentView, "btn_modifyuseinfo_buyvip");
        this.btn_modifyuseinfo_buyvip.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {

                // 跳转到购买会员界面
                self.OnBuyMemberClicked();
            }

        }, this);


        this.listview_modifyuserinfo_vip = ccui.helper.seekWidgetByName(this.parentView, "listview_modifyuserinfo_vip");

        //hanhu #购买按钮居中 2015/08/03
        this.btn_modifyuseinfo_buyvip.x = this.listview_modifyuserinfo_vip.getContentSize().width - 30;

        //fanxuehua #购买按钮背景居中 2016/2/26
        //this.btn_modifyuseinfo_buyvipBg = ccui.helper.seekWidgetByName(this.parentView, "btn_modifyuseinfo_buyvip_bg");
        //this.btn_modifyuseinfo_buyvipBg.x = this.listview_modifyuserinfo_vip.getContentSize().width - 30;

        var defaultItem = ccui.helper.seekWidgetByName(ccs.load("res/cocosOut/ModifyUserVipItem.json").node, "panel_modifyuser_vip");
        this.listview_modifyuserinfo_vip.setItemModel(defaultItem);




        //this.UpdateUserMemberInFo();

*/
    },

    initTipsLayer: function()
    {
        var self = this;
        this.layer_tips = ccui.helper.seekWidgetByName(this.parentView, "layer_tips");
        this.layer_tips.setVisible(false);

        var text_ttips = ccui.helper.seekWidgetByName(this.layer_tips,"text_ttips");
        text_ttips.setString("头像选择成功，是否上传？");

        var btn_tips_yes = ccui.helper.seekWidgetByName(this.layer_tips, "btn_tips_yes");   //修改按钮
        btn_tips_yes.setPressedActionEnabled(true);
        btn_tips_yes.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                self.layer_tips.setVisible(false);
                lm.log("yyyp ->onChooseImageSuccessed 1");
                var isCustomFace = self.CustomFaceLayer.IsVisable();
                // 修改自定义头像
                if(isCustomFace)
                {
                    lm.log("yyyp cusImageStr2" + DataUtil.GetImageName());
                    if(self.cusImageStr != DataUtil.GetImageName()) {

                        bModify = true;

                        lm.log("dwUserID:"+ userInfo.globalUserdData["dwUserID"] + "-----name:"+ DataUtil.GetImageName() +"-----url:"+DataUtil.GetUpLoadWebURL() +"-----key:" +userInfo.globalUserdData["szLoginKey"]);
                        UpLoadUserCustomFace(2, userInfo.globalUserdData["dwUserID"], DataUtil.GetImageName(),DataUtil.GetUpLoadWebURL(),userInfo.globalUserdData["szLoginKey"]);
                    }
                }
            }

        }, this);


        var btn_tips_no = ccui.helper.seekWidgetByName(this.layer_tips, "btn_tips_no");   //修改按钮
        btn_tips_no.setPressedActionEnabled(true);
        btn_tips_no.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                lm.log("yyyp ->onChooseImageSuccessed 2");
                self.layer_tips.setVisible(false);
                if(self.customfaceid == 0)
                {
                    DataUtil.SetImageName("");
                    self.cusImageStr = DataUtil.GetImageName();
                    self.CustomFaceLayer.SetVisable(false);
                }
                self.UpdateUserInFoEx();
            }

        }, this);
    },
    //设置头像
    setHeadIcon:function(FaceLayer,CustomFaceLayer,faceid,customfaceid)
    {
        //自定义头像
        if(customfaceid  != 0 && CustomFaceLayer.ShowUserCustomFace(userInfo.globalUserdData["dwUserID"],customfaceid))
        {
            CustomFaceLayer.SetVisable(true);
            FaceLayer.setTag(0);
        }
        else    //系统头像
        {
            CustomFaceLayer.SetVisable(false);
            FaceLayer.setVisible(true);
            var name="";
            if(userInfo.globalUserdData["cbGender"] == GenderDefine.GENDER_FEMAIL) //女
            {
                if(faceid == 0 || faceid == null)
                {
                    name =  "system_head_6.png";
                }else
                {
                    var newFaceId = (faceid-1)%5 + 1 + 5;
                    name = "system_head_" + newFaceId + ".png";
                }
            }
            else
            {
                if(faceid == 0 || faceid == null)
                {
                    name =  "system_head_1.png";
                }else
                {
                    var newFaceId = (faceid-1)%5 + 1;
                    name = "system_head_" + newFaceId + ".png";
                }
            }

            //玩家系统头像
            FaceLayer.loadTexture(name,1);
            FaceLayer.setTag(faceid);
        }
    },

    //输入框获得焦点
    editBoxEditingDidBegin: function (sender) {
        if(GetDeviceType() != DeviceType.ANDROID)
        {
            this.parentView.setPosition(cc.p(this.org_pos.x, this.org_pos.y + winSize.height * 0.2));
            //this.textfield_modifyuserinfo_nick.setPosition(cc.p(453, 314)) ;
        }
    },

    //输入框失去焦点
    editBoxEditingDidEnd: function (sender) {

        if(GetDeviceType() != DeviceType.ANDROID)
        {
            this.parentView.setPosition(this.org_pos);
            //this.textfield_modifyuserinfo_nick.setPosition(cc.p(453, 314)) ;
        }

    },

    //用户信息更改成功回调
    onUserInfoModifySuccessed : function()
    {
        lm.log("yyyp ->更新界面显示图片444");
        userInfo.globalUserdData["szNickName"] = this.GetNickName();
        userInfo.globalUserdData["cbGender"] =  this.GetSex();
        lm.log("yyyp -> : " + userInfo.globalUserdData["szNickName"] + " " + userInfo.globalUserdData["cbGender"] + " " + userInfo.globalUserdData["dwUserID"] );
        this.owner.UpdateUserInFo();
        this.UpdateUserInFoEx();
        this.btn_complete.setTouchEnabled(true);
        this.layer_view.setVisible(true);
        this.layer_modify.setVisible(false);
        this.owner.RefreshNickName();
    },

    //自定义头像选择成功回调
    onChooseImageSuccessed : function()
    {
        lm.log("yyyp ->onChooseImageSuccessed");
        this.layer_tips.setVisible(true);

        //var pop = new ConfirmPop(this, Poptype.yesno, "头像选择成功，是否上传？");//ok
        //pop.addToNode(cc.director.getRunningScene());
        //pop.hideCloseBtn();
        //pop.setYesNoCallback(
        //    function()
        //    {
        //        lm.log("yyyp ->onChooseImageSuccessed 1");
        //        var isCustomFace = this.CustomFaceLayer.IsVisable();
        //        // 修改自定义头像
        //        if(isCustomFace)
        //        {
        //            lm.log("yyyp cusImageStr2" + DataUtil.GetImageName());
        //            if(this.cusImageStr != DataUtil.GetImageName()) {
        //
        //                bModify = true;
        //
        //                lm.log("dwUserID:"+ userInfo.globalUserdData["dwUserID"] + "-----name:"+ DataUtil.GetImageName() +"-----url:"+DataUtil.GetUpLoadWebURL() +"-----key:" +userInfo.globalUserdData["szLoginKey"]);
        //                UpLoadUserCustomFace(2, userInfo.globalUserdData["dwUserID"], DataUtil.GetImageName(),DataUtil.GetUpLoadWebURL(),userInfo.globalUserdData["szLoginKey"]);
        //            }
        //        }
        //    },
        //    function()
        //    {
        //        lm.log("yyyp ->onChooseImageSuccessed 2");
        //        if(this.customfaceid == 0)
        //        {
        //            DataUtil.SetImageName("");
        //            this.cusImageStr = DataUtil.GetImageName();
        //            this.CustomFaceLayer.SetVisable(false);
        //        }
        //        this.UpdateUserInFoEx();
        //    }
        //);
        //lm.log("yyyp ->onChooseImageSuccessed 3");
    },

    //更新显示玩家的信息
    UpdateUserInFoEx:function()
    {
        //显示层
        {
            //昵称
            this.text_view_nick.setString(userInfo.globalUserdData["szNickName"]);

            //性别
            if(userInfo.globalUserdData["cbGender"] == GenderDefine.GENDER_FEMAIL) //女
            {
                this.text_view_sex.setString("女");
            }
            else
            {
                this.text_view_sex.setString("男");
            }

            //金币
            this.text_view_gold.setString( userInfo.globalUserdData["lUserScore"] );
            this.text_view_gold.setString( userInfo.globalUserdData["lUserScore"] );

            //奖牌
            this.text_view_jianpai.setString(userInfo.globalUserdData["dwUserMedal"]);

            //总牌局
            this.text_view_total.setString(userInfo.globalUserdData["dwWinCount"] + userInfo.globalUserdData["dwLostCount"]);

            //胜率
            if( userInfo.globalUserdData["dwWinCount"] + userInfo.globalUserdData["dwLostCount"] == 0 )
            {
                this.text_view_winRate.setString("0%");
            }
            else
            {
                var winRate = userInfo.globalUserdData["dwWinCount"] / (userInfo.globalUserdData["dwWinCount"] + userInfo.globalUserdData["dwLostCount"]) * 100;
                this.text_view_winRate.setString(winRate.toFixed(2) + "%");
            }

            //用户id
            this.text_view_userid.setString("ID:" + userInfo.globalUserdData["dwUserID"]);
        }

        //修改层
        {
            //昵称
            this.textfield_modifyuserinfo_nick.setString(userInfo.globalUserdData["szNickName"]);

            //性别
            this.SetSex(userInfo.globalUserdData["cbGender"] == GenderDefine.GENDER_FEMAIL);
        }

        //头像
        {
            //玩家当前头像u
            this.Image_modifyuser_curface = ccui.helper.seekWidgetByName(this.parentView, "Image_modifyuser_curface");

            //自定义头像控件
            this.CustomFaceLayer = CustomFace.CGameCustomFaceLayer.create();
            this.CustomFaceLayer.SetImageRect(40,40,80,80);
            this.CustomFaceLayer.SetVisable(false);
            this.Image_modifyuser_curface.addChild(this.CustomFaceLayer,9999);

            // save user info
            this.faceid = userInfo.globalUserdData["wFaceID"];
            this.customfaceid = userInfo.globalUserdData["dwCustomID"];

            this.setHeadIcon(this.Image_modifyuser_curface,this.CustomFaceLayer,this.faceid,this.customfaceid);


        }

    },

    GetFaceID: function () {
        return this.faceid;
    },

    // 获取性别性别 1 为男性
    GetSex: function () {
        var sex = 0;
        if (this.btn_modifyuserinfo_malesex_select.isVisible())
            sex = GenderDefine.GENDER_MANKIND;
        else
            sex = GenderDefine.GENDER_FEMAIL;


        return sex;
    },

    // 设置用户性别 true为选中女
    SetSex: function (bFamail)
    {
        if(bFamail)
        {

            this.btn_modifyuserinfo_malesex_select.setVisible(false);
            this.btn_modifyuserinfo_malesex_unselect.setVisible(true);
            this.btn_modifyuserinfo_femalesex_select.setVisible(true);
            this.btn_modifyuserinfo_femalesex_unselect.setVisible(false);
        }else
        {
            this.btn_modifyuserinfo_malesex_select.setVisible(true);
            this.btn_modifyuserinfo_malesex_unselect.setVisible(false);

            this.btn_modifyuserinfo_femalesex_select.setVisible(false);
            this.btn_modifyuserinfo_femalesex_unselect.setVisible(true);
        }

    },

    GetNickName: function () {
        return this.textfield_modifyuserinfo_nick.getString();
    },

    GetPassword: function () {
        return this.textfield_modifyuserinfo_newpassword.getString();
    },





    //////以下代码 现在没有使用///////
    //更新用户信息-- 隐藏
    UpdateUserInFoOld:function()
    {

        return;
        //更新性别显示
        this.SetSex(userInfo.globalUserdData["cbGender"] == GenderDefine.GENDER_FEMAIL);

        //
        ////昵称显示
        //var panel_account_login = ccui.helper.seekWidgetByName(this.parentView, "panel_account_login");
        //this.textfield_modifyuserinfo_nick = layerManager.CreateDefultEditBox(this, cc.size(284, 30), cc.p(0, 0.5), cc.p(453, 314), "玩家昵称", cc.color(0, 0, 0, 240), false);
        //panel_account_login.addChild(this.textfield_modifyuserinfo_nick);
        //this.textfield_modifyuserinfo_nick.setString( userInfo.globalUserdData["szNickName"]);


        //hanhu #弹出软键盘时调整输入框位置 2015/09/22
        var self = this;
        //this.org_pos = this.parentView.getPosition();

        /*
         // textfield new password
         this.textfield_modifyuserinfo_newpassword = ccui.helper.seekWidgetByName(this.parentView, "textfield_modifyuserinfo_newpassword");
         this.textfield_modifyuserinfo_newpassword.setVisible(false);
         this.textfield_modifyuserinfo_newpassword.setTouchEnabled(false);

         // textfield new password agin
         this.textfield_modifyuserinfo_newpassword_agin = ccui.helper.seekWidgetByName(this.parentView, "textfield_modifyuserinfo_newpassword_agin");
         this.textfield_modifyuserinfo_newpassword_agin.setVisible(false);
         this.textfield_modifyuserinfo_newpassword_agin.setTouchEnabled(false);

         var passWordBack1 = ccui.helper.seekWidgetByName(this.parentView, "Image_modifyuserinfo_password");
         passWordBack1.setVisible(false);
         var passWordBack2 = ccui.helper.seekWidgetByName(this.parentView, "Image_modifyuserinfo_password2");
         passWordBack2.setVisible(false);
         var textlabel = ccui.helper.seekWidgetByName(this.parentView, "text_modifyuserinfo_passwprd");
         textlabel.setVisible(false);
         */

        // save user info
        this.faceid = userInfo.globalUserdData["wFaceID"];
        this.customfaceid = userInfo.globalUserdData["dwCustomID"];

        //用户头像
        var wUserID = userInfo.globalUserdData["dwUserID"];
        if(this.customfaceid  != 0)
        {
            //自定义头像
            /*this.CustomFaceLayer.SetVisable(true);
             this.CustomFaceLayer.ShowUserCustomFace(wUserID, this.customfaceid);
             this.Image_modifyuser_curface.setTag(0);*/

            //自定义头像
            if(this.CustomFaceLayer.ShowUserCustomFace(wUserID,this.customfaceid))
            {
                this.CustomFaceLayer.SetVisable(true);
                //this.Image_modifyuser_curface.setVisible(false);
                this.Image_modifyuser_curface.setTag(0);
            }else
            {
                this.CustomFaceLayer.SetVisable(false);
                this.Image_modifyuser_curface.setVisible(true);
                var name="";
                if(this.faceid  == 0 || this.faceid  == null)
                {
                    name =  "1.png";
                }else
                {
                    if(this.faceid > 200 )
                        name =  "1.png";
                    else
                        name = this.faceid  + ".png";
                }

                ////lm.log("wFaceID: " + name);
                //玩家系统头像
                this.Image_modifyuser_curface.loadTexture(name,1);
                this.Image_modifyuser_curface.setTag(this.faceid);
            }
        }
        else
        {
            //系统头像
            this.CustomFaceLayer.SetVisable(false);
            var name;
            if( this.faceid  == 0 ||  this.faceid  == null)
            {
                name =  "1.png";
            }else
            {
                name = this.faceid + ".png";
            }

            //玩家系统头像
            this.Image_modifyuser_curface.loadTexture(name,1);
            this.Image_modifyuser_curface.setTag(this.faceid);
        }

    },

    // 按下购买VIP按钮--新版本没有这个功能 隐藏
    OnBuyMemberClicked:function()
    {
        WaittingLayerPopManager(new WaitUILayer("正在努力加载中...",function()
        {
            WaittingLayerPopManager(new PopAutoTipsUILayer("连接服务器超时，请稍后重试！", DefultPopTipsTime));

        },this));
        if(roomManager.GetMallData() != null || roomManager.GetMallData() != undefined)
        {
            lm.log("已有商城数据");
            var curLayer =  new MallUILayer();
            curLayer.SelectExchangeBtns(MallDataType.MALL_DATA_PROPERTY);
            curLayer.refreshViewByData(MallDataType.MALL_DATA_PROPERTY);
            NormalLayerPopManager(curLayer, true, null, true);
        }
        else
        {
            webMsgManager.SendGpProperty(function (data) {

                    roomManager.SetMallData(data);
                    lm.log("2商城数据 = " + JSON.stringify(data));

                    var curLayer =  new MallUILayer();
                    curLayer.SelectExchangeBtns(MallDataType.MALL_DATA_PROPERTY);
                    curLayer.refreshViewByData(MallDataType.MALL_DATA_PROPERTY);
                    NormalLayerPopManager(curLayer, true, null, true);
                },
                function (errinfo) {
                    lm.log("请求商城数据失败. info = " + errinfo);
                    WaittingLayerPopManager(new PopAutoTipsUILayer(errinfo, DefultPopTipsTime));
                }, this);
        }
    },

    // 刷新用户头像列表--新版本没有这个功能 隐藏
    RefreshUserHeaderView: function () {
        this.pageview_userface.removeAllPages();
        var self = this;

        //加载文件
        for (var pageindex = 0; pageindex < DefultHeaderCount / EarchPageItemCount; pageindex++) {
            var pageitem = ccs.load("res/cocosOut/ModifyUserFaceItem.json").node;
            // lm.log("pageitem: ", pageitem);
            if (pageitem !== null) {
                this.pageview_userface.addPage(pageitem);
            }
        }


        var index = 0, itemindex = 0, pageindex = 0;
        for (var i = 1; i <= DefultHeaderCount; i++) {

            itemindex = index % 5;
            var pageitem = this.pageview_userface.getPage(pageindex);
            if (pageitem !== null) {
                var name = i + ".png";
                // lm.log("item name:" + name);
                var btn_modifyuser_item = ccui.helper.seekWidgetByName(pageitem, "btn_modifyuser_item_" + itemindex);
                var Image_face_select = ccui.helper.seekWidgetByName(btn_modifyuser_item, "Image_face_select_" + itemindex);

                // lm.log("itemindex  :" + itemindex);
                btn_modifyuser_item.loadTextureNormal(name, 1);
                btn_modifyuser_item.loadTexturePressed(name, 1);
                btn_modifyuser_item.Image_modifyuser_curface = self.Image_modifyuser_curface;
                btn_modifyuser_item.CustomFaceLayer = self.CustomFaceLayer;
                btn_modifyuser_item.name = name;
                btn_modifyuser_item.pageIndex = pageindex;
                btn_modifyuser_item.setTag(i);
                btn_modifyuser_item.setSwallowTouches(false);
                btn_modifyuser_item.Image_face_select = Image_face_select;
                btn_modifyuser_item.addTouchEventListener(function (sender, type) {
                    if (sender.pageIndex !== self.pageview_userface.getCurPageIndex())
                    {
                        return;
                    }

                    if (type == ccui.Widget.TOUCH_ENDED) {

                        sender.CustomFaceLayer.SetVisable(false);
                        sender.Image_modifyuser_curface.setTag(sender.getTag());
                        sender.Image_modifyuser_curface.loadTexture(sender.name, 1);
                        sender.Image_face_select.setVisible(true);
                        //hanhu #取消之前的选中标志 2015/08/04
                        if(this._selected_Image != null)
                        {
                            this._selected_Image.Image_face_select.setVisible(false);
                        }
                        this._selected_Image = sender;
                    }

                }, this);

            }

            index++;
            if (itemindex == 4)pageindex++;


        }
    },

    //更新用户会员信息--新版本没有这个功能 隐藏
    UpdateUserMemberInFo:function()
    {
        //是否隐藏VIP购买信息
        if(IsHideBuyVipInFo)
        {
            this.text_vipinfo.setVisible(false);
            this.btn_modifyuseinfo_buyvip.setVisible(false);
            this.listview_modifyuserinfo_vip.setVisible(false);
            //this.btn_modifyuseinfo_buyvipBg.setVisible(false);

            var buildmobiletitle = cc.LabelTTF.create("绑定手机福利", "", 20);
            var parent = this.btn_modifyuseinfo_buyvip.getParent();

            parent.addChild(buildmobiletitle, 999);
            buildmobiletitle.setPosition(this.text_vipinfo.getPosition());

            var info1 = cc.LabelTTF.create("1.绑定时可立刻获得金币奖励", "", 16);
            info1.setPositionX(this.btn_modifyuseinfo_buyvip.getPosition().x +8);
            info1.setPositionY(buildmobiletitle.getPosition().y - 60);
            parent.addChild(info1, 1000);


            var info2 = cc.LabelTTF.create("2.可获得每日3次保底金币福利", "", 16);
            info2.setPositionX(this.btn_modifyuseinfo_buyvip.getPosition().x +15);
            info2.setPositionY(info1.y - 50);
            parent.addChild(info2, 1001);

            return;
        }

        //若会员列表为空，就显示购买会员按钮，否则显示会员列表
        if( userInfo.globalUserdData["userinfoex"] === undefined||
            userInfo.globalUserdData["userinfoex"] === null  ||
            userInfo.globalUserdData["userinfoex"].length == 0 ||
            userInfo.globalUserdData["userinfoex"]["memberlist"] == undefined ||
            userInfo.globalUserdData["userinfoex"]["memberlist"] == null ||
            userInfo.globalUserdData["userinfoex"]["memberlist"].length == 0)
        {

            this.btn_modifyuseinfo_buyvip.setVisible(true);
            //this.btn_modifyuseinfo_buyvipBg.setVisible(true);
            this.listview_modifyuserinfo_vip.setVisible(false);
            //hanhu #若无VIP信息，则提示购买 2015/0803

            var notice = cc.LabelTTF.create("点击购买VIP获得特权", "", 20);
            this.btn_modifyuseinfo_buyvip.getParent().addChild(notice, 999);
            notice.setPosition(this.btn_modifyuseinfo_buyvip.getPosition());
            notice.setColor(cc.color(0,0,0,255));
            notice.y = notice.y + 50;


        }else
        {

            this.btn_modifyuseinfo_buyvip.setVisible(false);
            //this.btn_modifyuseinfo_buyvipBg.setVisible(false);
            this.listview_modifyuserinfo_vip.setVisible(true);
            this.RefReshUserMemberListView();
        }
    },

    //刷新用户会员列表--新版本没有这个功能 隐藏
    RefReshUserMemberListView:function()
    {
        this.listview_modifyuserinfo_vip.removeAllItems();
        var data = userInfo.globalUserdData["userinfoex"]["memberlist"];

        var bShowMemberList = false;
        for (var key in data) {
            //显示激活状态
            var memberoverday = new Date(data[key]["memberoveryear"],
                data[key]["memberovermonth"] - 1,
                data[key]["memberoverday"],
                data[key]["memberoverhour"],
                data[key]["memberoverminute"],
                data[key]["memberoversecond"]);


            //排除 0 天的
            var elapsed = DataUtil.GetDays(new Date(), memberoverday);
            if (elapsed <= 0) //VIP 没过期
                continue;

            bShowMemberList = true;
            this.listview_modifyuserinfo_vip.pushBackDefaultItem();
            var lastItem = this.getLastUserMemberListItem();
            var Image_vipitem_bluevip = ccui.helper.seekWidgetByName(lastItem, "Image_vipitem_bluevip");
            var Image_vipitem_redvip = ccui.helper.seekWidgetByName(lastItem, "Image_vipitem_redvip");
            var Image_vipitem_yellowvip = ccui.helper.seekWidgetByName(lastItem, "Image_vipitem_yellowvip");
            var text_vipitem_status = ccui.helper.seekWidgetByName(lastItem, "text_vipitem_status");
            var Image_vipitem_vipdelaydate = ccui.helper.seekWidgetByName(lastItem, "Image_vipitem_vipdelaydate");
            var Image_modifyuservip_bk = ccui.helper.seekWidgetByName(lastItem, "Image_modifyuservip_bk");
            Image_modifyuservip_bk.setColor(VIPBackColor);

            var activestatus = data[key]["activestatus"];
            // 显示会员标识
            var cbMemberOrder = data[key]["memberorder"];
            switch (cbMemberOrder) {
                case MemberOrder.MEMBER_ORDER_YELLOW: //黄钻
                {
                    Image_vipitem_yellowvip.setVisible(true);
                    Image_vipitem_redvip.setVisible(false);
                    Image_vipitem_bluevip.setVisible(false);

                }
                    break;
                case MemberOrder.MEMBER_ORDER_BLUE:  //蓝钻
                {
                    Image_vipitem_yellowvip.setVisible(false);
                    Image_vipitem_redvip.setVisible(false);
                    Image_vipitem_bluevip.setVisible(true);
                }
                    break;
                case MemberOrder.MEMBER_ORDER_RED:     //红钻
                {
                    Image_vipitem_yellowvip.setVisible(false);
                    Image_vipitem_redvip.setVisible(true);
                    Image_vipitem_bluevip.setVisible(false);
                }
                    break;
                default :
                    break;
            }

            //剩余天数
            var datestring = "剩余" + elapsed + "天";
            Image_vipitem_vipdelaydate.setString(datestring);

            //VIP状态
            //text_vipitem_status.setColor(activestatus ? VIPStatusColor.ActiveColor : VIPStatusColor.UnActiveColor);
            //text_vipitem_status.setString(activestatus ? "激活中" : "已封存");
            text_vipitem_status.loadTexture(activestatus ? "information_04.png":"information_17.png",ccui.Widget.PLIST_TEXTURE);

        }

        if(bShowMemberList == false)
        {
            this.btn_modifyuseinfo_buyvip.setVisible(true);
            //this.btn_modifyuseinfo_buyvipBg.setVisible(true);
            this.listview_modifyuserinfo_vip.setVisible(false);

            var notice = cc.LabelTTF.create("点击购买VIP获得特权", "", 20);
            this.btn_modifyuseinfo_buyvip.getParent().addChild(notice, 999);
            notice.setPosition(this.btn_modifyuseinfo_buyvip.getPosition());
            notice.setColor(cc.color(0,0,0,255));
            notice.y = notice.y + 50;
        }

    },

    //--新版本没有这个功能 隐藏
    getLastUserMemberListItem: function () {
        if (this.listview_modifyuserinfo_vip.getItems().length)
            return this.listview_modifyuserinfo_vip.getItems()[this.listview_modifyuserinfo_vip.getItems().length - 1];
    }


});


