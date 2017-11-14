/**
 * Created by lizhongqiang on 15/5/29.
 */

var webviewNotice_offset_x = 180;
var webviewNotice_offset_y = 99;
var info_offset_y = 30;

var PopNoticeUILayer = rootLayer.extend({
    ctor: function (width, height, url,info)
    {
        this._super();
        this._webView = null;
        this.initLayer(width, height, url,info);

        //hanhu #设定模态对话框 2015/07/23
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        }, this);
    },
    onTouchBegan : function(sender, type)
    {
        return true;
    },
    onTouchMoved : function(sender, type)
    {

    },
    onTouchEnded : function(sender, type)
    {
        return true;
    },
    initLayer: function (width, height, url,info)
    {
        ////lm.log(width + ".." + height);
        //var scale  =  (height/winSize.height);
        //var width  =   width/scale - webviewNotice_offset_x;
        //var height =   height /scale - webviewNotice_offset_y;
        //hanhu #宽度和高度不能超过屏幕尺寸 2015/08/06
        //if(width > winSize.width - 10)
        //{
        //    width = winSize.width - 10;
        //}
        //if(height > winSize.height - 10) {
        //    height = winSize.height - 10;
        //}

        this.parentView = ccs.load("res/cocosOut/PopNoticeUILayer.json").node;
        this.addChild(this.parentView, 999, 10086);
        this.parentView.setPosition((winSize.width-960)/2,0);


        // panel
        var panel_notice = ccui.helper.seekWidgetByName(this.parentView,"panel_notice");
        panel_notice.setContentSize(width + webviewNotice_offset_x, height + webviewNotice_offset_y);


        //lm.log("网页尺寸为" + width + " + " + height);
        var webview = CustomWebview.WebView.create();
        webview.setScalesPageToFit(1);
        webview.loadURL(url);
        webview.setContentSize(cc.size(width,height));
        panel_notice.addChild(webview,9999);
        webview.setAnchorPoint(0,0);
        webview.setPosition(webviewNotice_offset_x/2, 28);

        // info
        var text_notice_info = ccui.helper.seekWidgetByName(this.parentView,"text_notice_info");
        if(info === undefined || info === null || info.length ===0)
        {
            text_notice_info.setVisible(false);
        }else
        {
            text_notice_info.setVisible(true);
            text_notice_info.setAnchorPoint(0.5,0);
            text_notice_info.setPosition((width + webviewNotice_offset_x)/2,  height + webviewNotice_offset_y * 0.15);
            text_notice_info.setString(info);
            text_notice_info.setFontSize(35);
        }

        // btn close
        var panel_notice_close = ccui.helper.seekWidgetByName(this.parentView,"panel_notice_close");
        panel_notice_close.setAnchorPoint(0.5, 0.5);
        panel_notice_close.setPosition(width  + webviewNotice_offset_x * 0.8, height + webviewNotice_offset_y * 0.8);



        panel_notice_close.addTouchEventListener(function (sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED)
            {

                this.removeFromParent();


            }
        }, this);

    },
    SendGetImageHttpRequest:function(url,
                               SuccessedCallBack, //成功回调
                               FailedCallBack,    //失败回调
                               target)            //目标参数)
    {
        var httpRequest = cc.loader.getXMLHttpRequest();
        if(httpRequest === undefined|| httpRequest === null )
        {
            lm.log("httpRequest object is null");
            return;
        }

        httpRequest.open("GET", url, true);
        httpRequest.send();
        httpRequest.onreadystatechange = function()
        {

            lm.log("SendHttpRequest  status:" + httpRequest.status);
            if (httpRequest.readyState == 4 && httpRequest.status == 200)
            {
                var httpStatus = httpRequest.statusText;
                var response = httpRequest.responseText;

                if(SuccessedCallBack !== null)
                {
                    lm.log("http get text: " + httpRequest.responseText);
                    SuccessedCallBack.call(target, httpRequest.responseText);
                }

            }else
            {

                if(FailedCallBack != null)
                {
                    FailedCallBack.call(target, httpRequest.responseText);
                }
            }
        }


    }
});