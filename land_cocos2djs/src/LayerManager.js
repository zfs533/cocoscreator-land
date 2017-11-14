/**
 * Created by baibo on 15/6/4.
 */

var TIP_TAG = 1000;
var LayerManager = cc.Class.extend({
    IsAutoPopMark:false,
    IsNoticePop:false,
    repalceLayer: function (layer) {
        var runningScene = cc.director.getRunningScene();
        cc.sys.garbageCollect();
        runningScene.removeAllChildren();
        runningScene.addChild(layer, 99);


        //var newScene = cc.Scene.create();
        //newScene.addChild(layer, 99);
        ////cc.director.runScene(layer)
        //cc.director.runScene(cc.TransitionFade(0.3, newScene))

    },
    addLayerToParent: function (layer, parentLayer) {
        parentLayer.addChild(layer, 999);

    },
    //弹出提示面板 - 模态对话框
    PopTipLayer:function(layer, notclear)
    {
        if(layer === undefined || layer === null)
        {
            //lm.log("图层为空");
            return;
        }

        // 改为默认清掉上一个界面
        var runningScene = cc.director.getRunningScene();
        var oldlayer = runningScene.getChildByTag(TIP_TAG);
        if(sparrowDirector.gameLayer && sparrowDirector.isPlayingGame)
            oldlayer = sparrowDirector.gameLayer.getChildByTag(TIP_TAG);
        if(oldlayer != null)
            oldlayer.removeFromParent();

        lm.log(sparrowDirector.gameLayer+"  --  "+sparrowDirector.isPlayingGame);
        if ( sparrowDirector.gameLayer && sparrowDirector.isPlayingGame )
        {
            lm.log("yyp 是否需要清掉上一个界面1");
            var currentL = sparrowDirector.gameLayer.getChildByTag(12345);
            if ( currentL )
            {
                currentL.removeFromParent();
            }
            sparrowDirector.gameLayer.addChild(layer, 1200, 12345);
            layer.setTag(TIP_TAG);
        }
        else
        {
            //lm.log("yyp 是否需要清掉上一个界面2" + notclear);
            //if(notclear == false)
            //{
            //    lm.log("yyp 是否需要清掉上一个界面3" + notclear);
            //    runningScene.addChild(layer, 1000, 10085);
            //
            //}else
            {
                //lm.log("yyp 是否需要清掉上一个界面4" + notclear);
                //var oldlayer = runningScene.getChildByTag(TIP_TAG);
                //if(oldlayer != null)
                //    oldlayer.removeFromParent();

                runningScene.addChild(layer, 1200, 10085);
                layer.setTag(TIP_TAG);
            }
        }


        //hanhu #设定模态对话框 2015/07/23
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(sender, type) {return true;},
            onTouchMoved: function(sender, type){},
            onTouchEnded: function(sender, type){return true;}
        }, layer);


    },

    //自动弹出公告面板 - 每次打开都弹出
    PopNoticeLayer : function()
    {

        if((userInfo.globalUserdData["noticepop"] == undefined)  ||
            (userInfo.globalUserdData["noticepop"] == false))
        {
            lm.log("pop notice layer ")
            var notiveData = roomManager.GetNoticeData();
            //Android 从其他平台登录
            switch (Number(GetDeviceType())) {
                case DeviceType.ANDROID://android
                {

                    if ((notiveData !== undefined) && (notiveData["noticeurl"] !== undefined) && (notiveData["noticeurl"] !== null ))
                    {
                        var size = DataUtil.GetWebNoticeSize(notiveData["noticewidth"],notiveData["noticeheight"]);
                        var mwidth= 0,mheight=0;
                        if (cc.director.getVisibleSize().width / cc.director.getVisibleSize().height <= 1.5)
                        {
                            //hanhu #采用新的屏幕适配策略 2015/09/24
                            mwidth = Number(notiveData["noticewidth"]); //GlobleWinSize.width;
                            mheight = GlobleWinSize.height;
                            var localUrl = notiveData["noticeurl"] + "&mwidth="+ (mwidth) +"&mheight="+mheight;
                            layerManager.PopTipLayer(new PopNoticeUILayer(Number(notiveData["noticewidth"]) * 960 / GlobleWinSize.width, Number(notiveData["noticeheight"]) * 640 / GlobleWinSize.height,localUrl,"游戏公告"));
                        }else {
                            //hanhu #采用新的屏幕适配策略 2015/09/24
                            mwidth = Math.floor(Number(notiveData["noticewidth"]) * GlobleWinSize.height / 640); //GlobleWinSize.width;
                            mheight = GlobleWinSize.height;
                            var localUrl = notiveData["noticeurl"] + "&mwidth=" + (mwidth) + "&mheight=" + mheight;
                            layerManager.PopTipLayer(new PopNoticeUILayer(Number(notiveData["noticewidth"]), Number(notiveData["noticeheight"]), localUrl, "游戏公告"));
                        }

                        cc.director.getRunningScene().runAction(cc.sequence(cc.delayTime(2), cc.callFunc(function(){
                            jsb.reflection.callStaticMethod(AndroidPackageName, "addJSInterface", "()V");
                        }, this)));

                    }
                }
                    break;
                case DeviceType.IOS://IOS
                case DeviceType.IPAD://IPAD
                {
                    if ((notiveData !== undefined) && (notiveData["noticeurl"] !== undefined) && (notiveData["noticeurl"] !== null ))
                    {
                        var size = DataUtil.GetWebNoticeSize(notiveData["noticewidth"],notiveData["noticeheight"]);
                        var mwidth= 0,mheight=0;
                        if (cc.director.getVisibleSize().width / cc.director.getVisibleSize().height <= 1.5)
                        {
                            //hanhu #采用新的屏幕适配策略 2015/09/24
                            mwidth = Number(notiveData["noticewidth"]); //GlobleWinSize.width;
                            mheight = GlobleWinSize.height;
                            var localUrl = notiveData["noticeurl"] + "&mwidth="+ (mwidth) +"&mheight="+mheight;
                            layerManager.PopTipLayer(new PopNoticeUILayer(Number(notiveData["noticewidth"]) * 960 / GlobleWinSize.width, Number(notiveData["noticeheight"]) * 640 / GlobleWinSize.height,localUrl,"游戏公告"));
                        }else
                        {
                            //hanhu #采用新的屏幕适配策略 2015/09/24
                            mwidth = Math.floor(Number(notiveData["noticewidth"]) * GlobleWinSize.height / 640); //GlobleWinSize.width;
                            mheight = GlobleWinSize.height;
                            var localUrl = notiveData["noticeurl"] + "&mwidth="+ (mwidth) +"&mheight="+mheight;
                            layerManager.PopTipLayer(new PopNoticeUILayer(Number(notiveData["noticewidth"]), Number(notiveData["noticeheight"]) ,localUrl,"游戏公告"));
                        }

                    }
                }
            }

            userInfo.globalUserdData["noticepop"] = true;
        }
    },

    AutoPopMarkUILayer:function()
    {
        if(this.IsAutoPopMark == false)
        {
            webMsgManager.SendGpGetMarkData(function (data) {

                    roomManager.SetMarkData(data);
                    layerManager.PopTipLayer(new MarkUILayer());

                },
                function (errinfo) {
                    layerManager.PopTipLayer(new PopAutoTipsUILayer(errinfo, DefultPopTipsTime),true);
                },
                this);

            this.IsAutoPopMark = true;
        }
    },

    // 获取当前运行的Layer
    getRuningLayer :function()
   {
    var runningScene = cc.director.getRunningScene();
    var children =  runningScene.getChildren();
     // lm.log("children:" + children);
       for(var key in children){

        var tagNum = children[key].getTag();
         //  lm.log("tagNum:" + tagNum);
        if(tagNum>= ClientModuleType.GoldField && tagNum<=ClientModuleType.Plaza){

            return children[key];
        }
    }

       return null;
  },

    // 设置按钮按下播放动画
    SetButtonPressAction:function(button, scale)
    {
        if((button !== undefined) && (button !== null))
        {
            if(scale !== undefined)
            {
                button.setZoomScale(scale);
            }
            button.setPressedActionEnabled(true);
        }
    },

    //////////////////////////////////////////////////////////////////////////////////////////////////
    //begin modified by lizhongqiang 2015-10-26 19:35
    //创建editbox控件
    //delegate - 事件监控
    //size - 控件尺寸
    //anchorpoint - 锚点
    //postion - 位置
    //placeholder - 无输入显示的文字
    //fontColor - 字体颜色
    //passwordflag - 是否密码输入标志
    CreateDefultEditBox:function(delegate,size,anchorpoint,postion,placeholder,fontColor,passwordflag)
    {
        var scale9sprite = new cc.Scale9Sprite("res/cocosOut/Default/editback.png");
        var edit = new cc.EditBox(size,scale9sprite);
        lm.log("this.textfield_account1");
        edit.setAnchorPoint(anchorpoint);
        edit.setPosition(postion);
        edit.setPlaceHolder(placeholder);
        edit.setInputMode(cc.EDITBOX_INPUT_MODE_ANY);
        edit.setDelegate(delegate);
        if(passwordflag)
        {
            edit.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
        }

        edit.setFontColor(fontColor);
        return  edit;
    }
    //end modified by lizhongqiang

})
var layerManager = new LayerManager();