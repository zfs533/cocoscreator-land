/**
 * Created by lizhongqiang on 15/7/6.
 */


// 物品类型
var PrizeType=
{
    PRIZE_TYPE_VIRTUALGOODS:1, // 虚拟物品
    PRIZE_TYPE_MATTERGOODS:2   // 实物
};


var TicketInputUILayer = rootLayer.extend({
    ctor: function (data,exchangecount,callback,target) {
        this._super();
        this.initLayer(data,exchangecount,callback,target);
    },
    editBoxEditingDidBegin: function (sender) {

        if(GetDeviceType() != DeviceType.ANDROID)
        {
            this.parentView.setPosition(cc.p(this.org_pos.x, this.org_pos.y + winSize.height * 0.2));
            this.textfiled_ticketinput_mobile.setPosition(cc.p(208, 304));
            //this.textfiled_ticketinput_qq.setPosition(cc.p(208, 253));
            this.textfiled_ticketinput_nickname.setPosition(cc.p(208, 202));
            //this.textfiled_ticketinput_num.setPosition(cc.p(208, 151));
        }
    },
    editBoxEditingDidEnd: function (sender) {

        if(GetDeviceType() != DeviceType.ANDROID)
        {
            this.parentView.setPosition(this.org_pos);
            this.textfiled_ticketinput_mobile.setPosition(cc.p(208, 304));
            //this.textfiled_ticketinput_qq.setPosition(cc.p(208, 253));
            this.textfiled_ticketinput_nickname.setPosition(cc.p(208, 202));
            //this.textfiled_ticketinput_num.setPosition(cc.p(208, 151));
        }
    },

    initLayer: function (data,exchangecount,callback,target)
    {
        lm.log("兑换物品的数据为：" + JSON.stringify(data));
        this.parentView = ccs.load("res/landlord/cocosOut/TicketInputUILayer.json").node;
        this.addChild(this.parentView);

        var self = this;
        this.org_pos = this.parentView.getPosition();

        ////道具名称
        //var text_icketinput_name = ccui.helper.seekWidgetByName(this.parentView,"text_icketinput_name");
        //text_icketinput_name.setString(data["prizename"]);
        //
        ////道具数量
        //var text_ticketinput_count = ccui.helper.seekWidgetByName(this.parentView,"text_ticketinput_count");
        //text_ticketinput_count.setString("数量：" + exchangecount);
        //
        ////道具图片
        //var Image_ticketinput_texture = ccui.helper.seekWidgetByName(this.parentView,"Image_ticketinput_texture");
        //Image_ticketinput_texture.loadTexture("res/cocosOut/product/" + data["prizeiconid"] +".jpg",0);



        //this.sourceDes = ccui.helper.seekWidgetByName(this.parentView, "Source");
        //this.sourceDes.setString(data["prizesummary"]);

        //this.textfiled_ticketinput_qq = layerManager.CreateDefultEditBox(this.parentView, cc.size(276, 30), cc.p(0, 0.5), cc.p(504, 256), "请输入QQ号码", cc.color(0, 0, 0, 240), false);
        //panel_ticketinput.addChild(this.textfiled_ticketinput_qq);

        //this.textfiled_ticketinput_num = layerManager.CreateDefultEditBox(this.parentView, cc.size(276, 30), cc.p(0, 0.5), cc.p(197, 154), "请输入兑换数目", cc.color(0, 0, 0, 240), false);
        //panel_ticketinput.addChild(this.textfiled_ticketinput_num);


        //var  panel_ticketinput = ccui.helper.seekWidgetByName(this.parentView,"panel_ticketinput");

        //电话号码
        //this.textfiled_ticketinput_mobile = layerManager.CreateDefultEditBox(this.parentView, cc.size(350, 35), cc.p(0, 0.5), cc.p(-200, 100), "点击填写联系电话", cc.color(208, 208, 208, 240), false);
        //this.textfiled_ticketinput_mobile.setFont("fnt/normal.TTF",21);
        //this.textfiled_ticketinput_mobile.setPlaceholderFont("fnt/normal.TTF",21);
        //this.textfiled_ticketinput_mobile.setPlaceholderFontColor(cc.color(208, 208, 208, 240));
        //this.textfiled_ticketinput_mobile.setMaxLength(10);
        //panel_ticketinput.addChild(this.textfiled_ticketinput_mobile);


        //联系人
        //this.textfiled_ticketinput_nickname = layerManager.CreateDefultEditBox(this.parentView, cc.size(350, 35), cc.p(0, 0.5), cc.p(-200, 34), "点击填写联系人", cc.color(208, 208, 208, 240), false);
        //this.textfiled_ticketinput_nickname.setFont("fnt/normal.TTF",21);
        //this.textfiled_ticketinput_nickname.setPlaceholderFont("fnt/normal.TTF",21);
        //this.textfiled_ticketinput_nickname.setPlaceholderFontColor(cc.color(208, 208, 208, 240));
        //this.textfiled_ticketinput_nickname.setMaxLength(20);
        //panel_ticketinput.addChild(this.textfiled_ticketinput_nickname);


        //地址
        //this.textfiled_ticketinput_address = layerManager.CreateDefultEditBox(this.parentView, cc.size(484, 55), cc.p(0, 0.5), cc.p(-200, -37), "点击填写寄件地址", cc.color(208, 208, 208, 240), false);
        //this.textfiled_ticketinput_address.setFont("fnt/normal.TTF",21);
        //this.textfiled_ticketinput_address.setPlaceholderFont("fnt/normal.TTF",21);
        //this.textfiled_ticketinput_address.setPlaceholderFontColor(cc.color(208, 208, 208, 240));
        //this.textfiled_ticketinput_address.setMaxLength(60);
        //
        //panel_ticketinput.addChild(this.textfiled_ticketinput_address);

        //电话号码
        this.textfiled_ticketinput_mobile = ccui.helper.seekWidgetByName(this.parentView,"textfiled_ticketinput_mobile");
        this.textfiled_ticketinput_mobile.addEventListener(function(sender,type)
        {
            if (type == ccui.TextField.EVENT_ATTACH_WITH_IME)
            {
                self.parentView.setPosition(cc.p(self.org_pos.x, self.org_pos.y + winSize.height * 0.2));
            }
            else if(type == ccui.TextField.EVENT_DETACH_WITH_IME)
            {
                self.parentView.setPosition(this.org_pos);
            }

        },this);

        //联系人
        this.textfiled_ticketinput_nickname = ccui.helper.seekWidgetByName(this.parentView,"textfiled_ticketinput_nickname");
        this.textfiled_ticketinput_nickname.addEventListener(function(sender,type)
        {
            if (type == ccui.TextField.EVENT_ATTACH_WITH_IME)
            {
                self.parentView.setPosition(cc.p(self.org_pos.x, self.org_pos.y + winSize.height * 0.2));
            }
            else if(type == ccui.TextField.EVENT_DETACH_WITH_IME)
            {
                self.parentView.setPosition(this.org_pos);
            }

        },this);

        //地址
        this.text_ticketinput_address = ccui.helper.seekWidgetByName(this.parentView,"text_ticketinput_address");
        this.text_ticketinput_address.addEventListener(function(sender,type)
        {
            if (type == ccui.TextField.EVENT_ATTACH_WITH_IME)
            {
                self.parentView.setPosition(cc.p(self.org_pos.x, self.org_pos.y + winSize.height * 0.2));
            }
            else if(type == ccui.TextField.EVENT_DETACH_WITH_IME)
            {
                self.parentView.setPosition(this.org_pos);
            }

        },this);


        // 关闭按钮
        var btn_ticketinput_close = ccui.helper.seekWidgetByName(this.parentView,"btn_ticketinput_close");
        btn_ticketinput_close.setPressedActionEnabled(true);
        btn_ticketinput_close.addTouchEventListener(function (sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                lm.log("btn btn_ticketinput_close button clicked");
                this.removeFromParent();
            }

        }, this);


        // 提交按钮
        var btn_ticketinput_ok = ccui.helper.seekWidgetByName(this.parentView,"btn_ticketinput_ok");
        btn_ticketinput_ok.setPressedActionEnabled(true);
        var self = this;
        btn_ticketinput_ok.addTouchEventListener(function (sender, type)
        {
            lm.log("yyp send 1");
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                lm.log("yyp send 2");
                if(self.IsCanExchange(data, exchangecount))
                {
                    lm.log("yyp send 3");
                    if(callback)
                    {
                        lm.log("yyp send 4");
                        var mobile  =self.textfiled_ticketinput_mobile.getString();
                        //var qq = self.textfiled_ticketinput_qq.getString();
                        var nickname =  self.textfiled_ticketinput_nickname.getString();
                        var address = self.text_ticketinput_address.getString();
                        //var num = self.textfiled_ticketinput_num.getString();
                        callback.call(target,data["prizeid"], "1",mobile,"",nickname,address);
                    }
                    self.removeFromParent();
                }
            }
        }, this);

    },

    // 能否兑换
    IsCanExchange:function(data, exchangecount)
    {
        var self = this;
        var mobile  = this.textfiled_ticketinput_mobile.getString();
        //var qq = this.textfiled_ticketinput_qq.getString();
        var qq = "";
        var nickname =  this.textfiled_ticketinput_nickname.getString();
        var address = this.text_ticketinput_address.getString();
        //var num = this.textfiled_ticketinput_num.getString();
        var num = 1;
        if(num == undefined || num.length == 0 || Number(num) == 0)
        {
            layerManager.addLayerToParent(new PopAutoTipsUILayer("请输入要兑换的数量！", DefultPopTipsTime),self);
            return false;
        }

        if(Number(num) < 1 || Number(num) > Number(exchangecount) )
        {
            layerManager.addLayerToParent(new PopAutoTipsUILayer("输入兑换数量不能高于可兑换数量，最小兑换1个！", DefultPopTipsTime),self);
            return false;
        }

        //// 奖品类型
        switch(Number(data["prizetype"]))
        {
            case PrizeType.PRIZE_TYPE_VIRTUALGOODS:// 虚拟物品
            {
                var pid =  Number(data["prizeid"]);
                lm.log("PrizeType.PRIZE_TYPE_VIRTUALGOODS pid: " + pid);
                if(pid == 1)
                {
                    if(qq == null ||qq.length == 0 )
                    {
                        //layerManager.addLayerToParent(new PopAutoTipsUILayer("请输入QQ号码，方便我们为您充值！", DefultPopTipsTime),self);
                        //return false;
                    }
                }
                else
                {
                    if(mobile == null || mobile.length == 0 )
                    {
                        layerManager.addLayerToParent(new PopAutoTipsUILayer("请输入手机号码，方便我们联系您！", DefultPopTipsTime),self);
                        return false;
                    }
                }
            }
                break;
            case PrizeType.PRIZE_TYPE_MATTERGOODS:  // 实物
            {
                //hanhu #实物检测所有信息 2015/08/03
                if(mobile == undefined || mobile.length == 0)
                {
                    layerManager.addLayerToParent(new PopAutoTipsUILayer("请输入手机号码,方便我们联系您！", DefultPopTipsTime),self);
                    return false;
                }
                if(qq == undefined || qq.length == 0)
                {
                    //layerManager.addLayerToParent(new PopAutoTipsUILayer("请输入QQ号码,方便我们联系您！", DefultPopTipsTime),self);
                    //return false;
                }
                if(nickname == null ||nickname.length == 0 )
                {
                    layerManager.addLayerToParent(new PopAutoTipsUILayer("请输入联系人，方便我们联系您！", DefultPopTipsTime),self);
                    return false;
                }

                if(address == null ||address.length == 0 )
                {
                    layerManager.addLayerToParent(new PopAutoTipsUILayer("请输入详细地址，方便我们进行礼品寄送！", DefultPopTipsTime),self);
                    return false;
                }

            }
                break;
            default :
                break;
        }

        return true;

    }

});

