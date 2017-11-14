/**
 * Created by lizhongqiang on 15/6/29.
 */

var ProblemKindType=
{
    PROBLEM_KIND_PAY:0, // 支付问题
    PROBLEM_KIND_GAME:1,// 游戏故障
    PROBLEM_KIND_OTHER :2 //其他问题
};


var GameFeedBackUILayer = rootLayer.extend({
    ctor: function () {
        this._super();
        this.initLayer();
        this.initAndroidBackKey();
    },
    editBoxEditingDidBegin: function (sender) {

        if(GetDeviceType() != DeviceType.ANDROID)
        {
            this.parentView.setPosition(cc.p(this.org_pos.x, this.org_pos.y + winSize.height * 0.2));
            //this.textfaild_gamefeedback_mobile.setPosition(cc.p(0, 10));
        }

    },
    editBoxEditingDidEnd: function (sender) {

        if(GetDeviceType() != DeviceType.ANDROID)
        {
            this.parentView.setPosition(this.org_pos);
            //this.textfaild_gamefeedback_mobile.setPosition(cc.p(0, 10));
        }

    },

    //安卓back按钮
    initAndroidBackKey:function()
    {
        if(GetDeviceType() != DeviceType.ANDROID)
            return;

        var self = this;
        this.addChild(new AndroidBackKey(function(){
            self.removeFromParent();
        },this));
    },

    initLayer: function ()
    {
        this.parentView = ccs.load("res/landlord/cocosOut/GameFeedbackUILayer.json").node;
        this.addChild(this.parentView);
        this.parentView.setPosition((winSize.width - 960) / 2, 0);
        this.setDarkBg();


        // 关闭按钮
        var panel_gamefeedback_close = ccui.helper.seekWidgetByName(this.parentView,"panel_gamefeedback_close");
        panel_gamefeedback_close.setPressedActionEnabled(true);
        panel_gamefeedback_close.addTouchEventListener(function (sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                this.removeFromParent();
            }

        }, this);


        //支付问题
        this.btn_gamefeedback_payselect = ccui.helper.seekWidgetByName(this.parentView,"btn_gamefeedback_payselect");
        this.btn_gamefeedback_payunselect = ccui.helper.seekWidgetByName(this.parentView,"btn_gamefeedback_payunselect");


        // 游戏问题
        this.btn_gamefeedback_gameselect = ccui.helper.seekWidgetByName(this.parentView,"btn_gamefeedback_gameselect");
        this.btn_gamefeedback_gameunselect = ccui.helper.seekWidgetByName(this.parentView,"btn_gamefeedback_gameunselect");

        // 其他问题
        this.btn_gamefeedback_otherselect= ccui.helper.seekWidgetByName(this.parentView,"btn_gamefeedback_otherselect");
        this.btn_gamefeedback_otherunselect= ccui.helper.seekWidgetByName(this.parentView,"btn_gamefeedback_otherunselect");


        this.ShowProblem(ProblemKindType.PROBLEM_KIND_GAME);
        this.problemkind = 1;

        this.btn_gamefeedback_payunselect.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {

                this.ShowProblem(ProblemKindType.PROBLEM_KIND_PAY);
                this.problemkind = ProblemKindType.PROBLEM_KIND_PAY;
            }

        }, this);


        this.btn_gamefeedback_gameunselect.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                this.ShowProblem(ProblemKindType.PROBLEM_KIND_GAME);
                this.problemkind = ProblemKindType.PROBLEM_KIND_GAME;

            }

        }, this);

        this.btn_gamefeedback_otherunselect.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                this.ShowProblem(ProblemKindType.PROBLEM_KIND_OTHER);
                this.problemkind = ProblemKindType.PROBLEM_KIND_OTHER;
            }

        }, this);


        //联系方式
        //var Image_gamefeedback_contact = ccui.helper.seekWidgetByName(this.parentView, "Image_gamefeedback_contact");
        //this.textfaild_gamefeedback_mobile = layerManager.CreateDefultEditBox(this, cc.size(420, 38), cc.p(0, 0.5), cc.p(7, 28), "请输入您的手机号码，方便我们联系您！", cc.color(0, 0, 0, 240), false);
        //Image_gamefeedback_contact.addChild(this.textfaild_gamefeedback_mobile);
        this.textfaild_gamefeedback_mobile = ccui.helper.seekWidgetByName(this.parentView,"textfaild_gamefeedback_mobile");
        this.textfaild_gamefeedback_mobile.addEventListener(function(sender,type)
        {
            if (type == ccui.TextField.EVENT_ATTACH_WITH_IME)
            {
                this.parentView.setPosition(cc.p(this.org_pos.x, this.org_pos.y + winSize.height * 0.2));
            }
            else if(type == ccui.TextField.EVENT_DETACH_WITH_IME)
            {
                this.parentView.setPosition(this.org_pos);
            }

        },this);

        var self = this;
        this.org_pos = this.parentView.getPosition();

        //详细问题描述
        this.textfield_gamefeedback_problem = ccui.helper.seekWidgetByName(this.parentView,"textfield_gamefeedback_problem");
        this.textfield_gamefeedback_problem.addEventListener(function(sender,type)
        {
            if (type == ccui.TextField.EVENT_ATTACH_WITH_IME)
            {
                this.parentView.setPosition(cc.p(this.org_pos.x, this.org_pos.y + winSize.height * 0.2));
            }
            else if(type == ccui.TextField.EVENT_DETACH_WITH_IME)
            {
                this.parentView.setPosition(this.org_pos);
            }

        },this);

        // 上传图片
        var btn_image_upload= ccui.helper.seekWidgetByName(this.parentView,"btn_image_upload");
        btn_image_upload.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {

                ChooseImageFromAlbum(ChooseImageModule.GameFreedBack,0,0,0);
            }
        }, this);


        this.text_imageloadinfo   = ccui.helper.seekWidgetByName(this.parentView,"text_imageloadinfo");

        //自定义头像控件
        var CustomLayer = CustomFace.CGameCustomFaceLayer.create();
        CustomLayer.SetImageRect(40,40,84,84);
        CustomLayer.SetVisable(false);
        btn_image_upload.addChild(CustomLayer,9999);


        //提交问题
        var btn_gamefeedback_submit= ccui.helper.seekWidgetByName(this.parentView,"btn_gamefeedback_submit");
        var self = this;
        btn_gamefeedback_submit.setPressedActionEnabled(true);
        btn_gamefeedback_submit.addTouchEventListener(function(sender,type)
            {
                if (type == ccui.Widget.TOUCH_ENDED)
                {
                    //hanhu #检查是否已填写手机号码和反馈信息是否为空 2015/07/23
                    var textfaild_gamefeedback_mobileStr = self.textfaild_gamefeedback_mobile.getString();
                    var textfield_gamefeedback_problemStr = self.textfield_gamefeedback_problem.getString();
                    if(textfaild_gamefeedback_mobileStr.length == 0)
                    {
                        layerManager.addLayerToParent(new PopAutoTipsUILayer("请填写联系方式", DefultPopTipsTime), self);
                    }
                    else if(textfield_gamefeedback_problemStr.length == 0)
                    {
                        layerManager.addLayerToParent(new PopAutoTipsUILayer("请描述具体的问题", DefultPopTipsTime),self);
                    }
                    else
                    {
                        layerManager.PopTipLayer(new WaitUILayer("正在提交问题，请稍后....",function()
                        {
                            layerManager.PopTipLayer(new PopAutoTipsUILayer("连接服务器超时，请稍后重试！", DefultPopTipsTime),false);

                        },self));

                        webMsgManager.SendGpGameFeedBack(this.problemkind,
                            textfaild_gamefeedback_mobileStr,
                            textfield_gamefeedback_problemStr,
                            DataUtil.GetImageName(),function(data)
                        {
                            //self.removeFromParent();

                            // 上传图片
                            UpLoadImage(HttpRequestModuleType.GameFeedBack,
                                1,
                                userInfo.globalUserdData["dwUserID"],
                                data["imageid"],
                                true,
                                DataUtil.GetImageName(),
                                DataUtil.GetUpLoadWebURL(),
                                userInfo.globalUserdData["szLoginKey"]);

                            layerManager.PopTipLayer(new PopAutoTipsUILayer("提交问题成功，非常感谢您的反馈，我们会努力做得更好！", DefultPopTipsTime),false);


                        },function(errinfo)
                        {   //default
                            layerManager.PopTipLayer(new PopAutoTipsUILayer(errinfo, DefultPopTipsTime),false);

                        },self);
                    }


                }
            }, this);

    },
    
    //显示问题类型
    ShowProblem :function(ProblemType)
    {

        switch(ProblemType)
        {

            case ProblemKindType.PROBLEM_KIND_PAY:  // 支付问题
            {

                this.btn_gamefeedback_payselect.setVisible(true);
                this.btn_gamefeedback_payunselect.setVisible(false);

                // 游戏问题
                this.btn_gamefeedback_gameselect .setVisible(false);
                this.btn_gamefeedback_gameunselect.setVisible(true);

                // 其他问题
                this.btn_gamefeedback_otherselect.setVisible(false);
                this.btn_gamefeedback_otherunselect.setVisible(true);


            }
                break;
            case ProblemKindType.PROBLEM_KIND_GAME: // 游戏故障
            {

                this.btn_gamefeedback_payselect.setVisible(false);
                this.btn_gamefeedback_payunselect.setVisible(true);


                this.btn_gamefeedback_gameselect .setVisible(true);
                this.btn_gamefeedback_gameunselect.setVisible(false);


                this.btn_gamefeedback_otherselect.setVisible(false);
                this.btn_gamefeedback_otherunselect.setVisible(true);

            }

                break;
            case ProblemKindType.PROBLEM_KIND_OTHER:  //其他问题
            {

                this.btn_gamefeedback_payselect.setVisible(false);
                this.btn_gamefeedback_payunselect.setVisible(true);


                this.btn_gamefeedback_gameselect .setVisible(false);
                this.btn_gamefeedback_gameunselect.setVisible(true);


                this.btn_gamefeedback_otherselect.setVisible(true);
                this.btn_gamefeedback_otherunselect.setVisible(false);
            }

                break;

        }

    },
    //获取图片名称
    ShowChangeImage:function(bChange)
    {
        this.text_imageloadinfo.setString(bChange? "上传图片":"更换图片");

    }


});

