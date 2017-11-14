/**
 * Created by lizhongqiang on 15/7/29.
 */

var webviewui_offset_x =80;
var webviewui_offset_y =110;
var WebViewUILayer = rootLayer.extend({
    ctor: function (width, height, url)
    {
        this._super();
        this._webView = null;
        this.initLayer(width, height, url);

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(sender, type)
            {
                return true;
            },
            onTouchMoved: function(sender, type)
            {

            },
            onTouchEnded: function(sender, type)
            {
                return true;
            }
        }, this);
    },
    initLayer: function (width, height, url)
    {
        this.parentView = ccs.load("res/cocosOut/WebViewUILayer.json").node;
        this.addChild(this.parentView);
        this.parentView.setPosition((winSize.width-960)/2,0);

        // panel
        //lm.log("notice width = " + width + " height =" + height);
        var panel_notice = ccui.helper.seekWidgetByName(this.parentView,"panel_webview");
        panel_notice.setContentSize(width + webviewNotice_offset_x, height + webviewNotice_offset_y);

        // web view
        var webview = CustomWebview.WebView.create();
        panel_notice.addChild(webview, -1);
        webview.setAnchorPoint(cc.p(0.5, 0.5));
        webview.setPosition(panel_notice.getContentSize().width / 2, panel_notice.getContentSize().height / 2);

        webview.loadURL(url);
        webview.setContentSize(cc.size(width,height));
        //webview.setScalesPageToFit(1);

        // btn close
        var panel_notice_close = ccui.helper.seekWidgetByName(panel_notice,"btn_webview_close");
        panel_notice_close.setAnchorPoint(0.5 , 0.5);
        //hanhu #采用新的适配 2015/09/24
        panel_notice_close.setPosition(width + webviewNotice_offset_x * 0.8, height + webviewNotice_offset_y * 0.6);
        //panel_notice_close.setLocalZOrder(999);
        panel_notice_close.addTouchEventListener(function (sender, type)
        {
            if (type == ccui.Widget.TOUCH_ENDED)
            {
                this.removeFromParent();
            }
        }, this);
    }

});