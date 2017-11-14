/**
 * Created by baibo on 15/5/18.
 */

var MailUILayer = rootUILayer.extend({
    ctor: function () {
        this._super();
        this.initLayer();
    },
    initLayer: function () {

        this.parentView = ccs.load("res/cocosOut/mailUILayer.json").node;
        this.addChild(this.parentView);
        //hanhu #调整邮箱坐标 2015/08/07
        var offset = (this.parentView.getContentSize().width * winSize.height / 640 - winSize.width) / 2;
        this.parentView.x -= offset;

        this.mail_listView = ccui.helper.seekWidgetByName(this.parentView, "mail_listView");

        this.text_mai_tips = ccui.helper.seekWidgetByName(this.parentView, "text_mai_tips");
        this.text_mai_tips.setColor(cc.color.WHITE);
        this.text_mai_tips.setOpacity(255);
        this.btn_mail_up = ccui.helper.seekWidgetByName(this.parentView, "btn_mail_up");
        this.btn_mail_down  = ccui.helper.seekWidgetByName(this.parentView, "btn_mail_down");

        var defaultItem = ccui.helper.seekWidgetByName(ccs.load("res/cocosOut/mailUIItems.json").node, "itemPanel");
        this.mail_listView.setItemModel(defaultItem);





        this.refreshViewByData(roomManager.GetMailData());


        this.ShowUserHeader(false);
        this.ShowTopButtons(false);
        this.ShowButtomButtons(false);
    },
    //刷新列表
    refreshViewByData: function (maildata) {

        if((maildata === undefined) ||(maildata === null) || (maildata.length === 0) )
        {
            this.text_mai_tips.setVisible(true);
            this.btn_mail_up.setVisible(false);
            this.btn_mail_down.setVisible(false);

        }else
        {

            this.text_mai_tips.setVisible(false);
            this.mail_listView.removeAllItems();
            for (var key in maildata) {
                this.mail_listView.pushBackDefaultItem();
                var lastItem = this.getLastListItem();
                var mail_title = ccui.helper.seekWidgetByName(lastItem, "mail_title");
                var mail_content = ccui.helper.seekWidgetByName(lastItem, "mail_content");
                var mail_date = ccui.helper.seekWidgetByName(lastItem, "mail_date");
                var btn_mail = ccui.helper.seekWidgetByName(lastItem, "btn_mail");

                mail_title.setString(maildata[key]["mail_title"]);
                mail_content.setString(maildata[key]["mail_content"]);
                mail_date.setString(maildata[key]["mail_date"]);
                btn_mail.mailInfo = maildata[key];

                btn_mail.addTouchEventListener(function (sender, type) {
                    if (type == ccui.Widget.TOUCH_ENDED) {
                        lm.log(sender.mailInfo["mail_title"] + " clicked");
                    }
                }, this)
            }
        }
    },
    getLastListItem: function () {
        if (this.mail_listView.getItems().length)
            return this.mail_listView.getItems()[this.mail_listView.getItems().length - 1];
    }
});