var __failCount = 0;
var AssetsManagerLoaderScene = cc.Scene.extend({
    _am: null,
    _progress: null,
    _percent: 0,
    _percentByFile: 0,
    _loadingBar: null,
    _fileLoadingBar: null,
    _loadingLabel: null,
    _filename: null,
    _groupVersionNow:"",
    _gameIsLoaded:false,
    ctor:function(){
        this._super();
        this.runThisTest();
        lm.addLogManagerEvent(this);
    },
    runThisTest: function () {

        var self = this;

        var tempsearchPath = jsb.fileUtils.getValueMapFromFile(jsb.fileUtils.getWritablePath() + "/searchPath")["searchePaths"];
        if(!tempsearchPath){
            tempsearchPath = [];
        }
        tempsearchPath.push("");
        lm.log("searchPath = " + tempsearchPath);
        jsb.fileUtils.setSearchPaths(tempsearchPath);

        var manifestPath = "res/project.manifest";
        var storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() + "assetManagerTest/" : "assetManagerTest/");
        lm.log("storagePath = " + storagePath);
        if(jsb.fileUtils.isFileExist(storagePath + manifestPath))
        {
            manifestPath = storagePath + manifestPath;
        }
        if (jsb.fileUtils.isFileExist(storagePath + "version.manifest")) {

            var versionConfig = null;
            //防止因版本文件错误导致更新失效
            try{
                versionConfig = JSON.parse(jsb.fileUtils.getStringFromFile(storagePath + "version.manifest"));
            }
            catch (exp){
                lm.log("解析version.manifest失败");
            }


            if (versionConfig) {
                for (var key in versionConfig["version"]) {
                    this._groupVersionNow =  versionConfig["version"];
                }
            }

        }

        if (!this._groupVersionNow) {
            this._groupVersionNow = "1.0.1";
        }

        this._loadLayer = new LodingBarUILayer();
        //this._loadLayer.addLoginItemUIL();
        this.addChild(this._loadLayer);
        jsb.fileUtils.setSearchPaths([""]);

        this._am = new jsb.AssetsManager(manifestPath, storagePath, PreUrl, Game_ID);

        this._am.retain();

        //begin modified by lizhongqiang 2016-01-06 15:56
        //读写文件增加安全检测，防止界面卡死
        var restart =0;
        try
        {
            restart = sys.localStorage.getItem("restartFlag"); //hanhu #若重启标签为1则不走更新 2015/01/05

        }catch(e)
        {
            restart =0;
        }
        //end modified by lizhongqiang 2016-01-06 15:56

        if(!this._am.getLocalManifest().isLoaded()) //hanhu #不再判定重启标志 2016/01/11
        {

            if (!self._gameIsLoaded) {
                self.loadGame();
                return;
            }
        }

        else {
            var listener = new jsb.EventListenerAssetsManager(this._am, function (event) {
                switch (event.getEventCode()) {
                    case jsb.EventAssetsManager.ASSET_UPDATED:
                        lm.log("yyp 单个资源被更新");
                        break;
                    case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                        lm.log("yyp 发现新版本，开始升级");
                        self._loadLayer.ShowProgcess();
                        break;
                    case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                        lm.log("yyp 发生错误:本地找不到manifest文件");

                        self.loadGame();
                        //if (!self._gameIsLoaded) {
                        //    self.loadGame(true);
                        //}
                        break;
                    case jsb.EventAssetsManager.UPDATE_PROGRESSION:

                        //begin  modified by lizhongqiang 2016-01-04 10:40
                        //解析文件增加安全处理
                        try
                        {
                            lm.log("yyp 更新进度 11= " + self._percent);
                            var storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() + "assetManagerTest/" : "assetManagerTest/");
                            //lm.log("版本文件 = " + jsb.fileUtils.getStringFromFile(storagePath + "version.manifest"));

                            //新版本号
                            var versionConfig = JSON.parse(jsb.fileUtils.getStringFromFile(storagePath + "version.manifest"));
                            var groupVersionNew=  versionConfig["version"];
                            if(!groupVersionNew){
                                groupVersionNew = this._groupVersionNow;
                            }

                            self._percent = Math.floor(event.getPercentByFile() );
                            self._percentByFile = event.getPercentByFile();
                            self._filename = self._am.getCurrentDownloadPath();

                            self._loadLayer.SetProcessValue(self._percent);
                            lm.log("最新版本：" + groupVersionNew,"当前版本：" + self._groupVersionNow);
                            //self._loadLayer.SetVersionInFo("最新版本：" + groupVersionNew,"当前版本：" + self._groupVersionNow);

                        }catch(e)
                        {
                            lm.log("yyp 更新进度 22= " + self._percent);
                            self._percent = Math.floor(event.getPercentByFile() );
                            self._percentByFile = event.getPercentByFile();
                            self._filename = self._am.getCurrentDownloadPath();

                            self._loadLayer.SetProcessValue(self._percent);
                            //self._loadLayer.SetVersionInFo("最新版本：" + this._groupVersionNow,"当前版本：" + self._groupVersionNow);
                        }
                        //end modified by lizhongqaing 2016-01-04 10:40

                        break;
                    case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                    case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                        lm.log("yyp 发生错误:下载manifest文件失败");

                        self.loadGame();
                        //if (!self._gameIsLoaded) {
                        //    self.loadGame(true);
                        //}

                        break;
                    case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                        lm.log("yyp 已经更新至最新版本了，进入游戏主界面 " + event.getMessage());
                        self.loadGame();
                        //if (!self._gameIsLoaded) {
                        //    self.loadGame(true);
                        //}
                        break;
                    case jsb.EventAssetsManager.UPDATE_FINISHED:
                        lm.log("yyp 更新成功事件" + event.getMessage());

                        // begin modified by lizhongqiang 2016-01-04 10:35
                        // 增加安全处理，防止文件解析失败，引起界面卡死问题
                        try
                        {
                            var storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() + "assetManagerTest/" : "assetManagerTest/");
                            var versionConfig = JSON.parse(jsb.fileUtils.getStringFromFile(storagePath + "version.manifest"));
                            if((versionConfig!== undefined) && (versionConfig.length !=0) && (versionConfig["restartFlag"] == "1"))
                            {
                                cc.sys.restartVM(); //hanhu #达到重启条件直接重启 2016/01/11
                            }
                            else
                            {
                                if (!self._gameIsLoaded)
                                {
                                    self.loadGame();
                                }
                            }

                        } catch(e)
                        {

                            if (!self._gameIsLoaded)
                            {
                                self.loadGame();
                            }

                        }
                        //end modified by lizhongqiang 2016-01-04


                        break;
                    case jsb.EventAssetsManager.UPDATE_FAILED:
                        lm.log("yyp 发生错误:更新失败 " + event.getMessage());

                        __failCount += 1;
                        if (__failCount <= 3) {
                            self._loadLayer.runAction(cc.sequence(cc.DelayTime((__failCount - 1) * 5), cc.CallFunc(function(){
                                self._am.downloadFailedAssets();
                                lm.log("下载失败文件");
                            }, this)));

                        }
                        else {
                            lm.log("Reach maximum fail count, exit update process");
                            __failCount = 0;
                            //if (!self._gameIsLoaded) {
                            //    self.loadGame();
                            //}

                            //var pop = new ConfirmPop(this, Poptype.yesno,"更新失败");//ok
                            // var pop = new AssetsConfirmNode("更新失败", self,function(){
                            //         ExitGameEx();
                            //     });
                            // pop.setPosition(winSize.width/2, winSize.height/2);
                            // cc.director.getRunningScene().addChild(pop, 10000);
                            // pop.addToNode(cc.director.getRunningScene());
                            // pop.hideCloseBtn();
                            // pop.setYesNoCallback(
                            //     function(){
                            //         ExitGameEx();
                            //     },
                            //     function(){
                            //         ExitGameEx();
                            //     }
                            // );

                            var Pop = new AssetsConfirmNode("更新文件失败，请切换网络环境重试！", this, function(){
                               ExitGame();
                            });
                            cc.director.getRunningScene().addChild(Pop, 999);
                            var size = cc.director.getWinSize();
                            Pop.setPosition(size.width/2,size.height/2);
                        }
                        break;
                    case jsb.EventAssetsManager.ERROR_UPDATING:
                        lm.log("yyp 更新过程中遇到错误" + event.getAssetId() + ", " + event.getMessage());

                        // var Pop = new AssetsConfirmNode("Asset update error: " + event.getAssetId() + ", " + event.getMessage(), this);
                        // cc.director.getRunningScene().addChild(Pop, 999);
                        // var size = cc.director.getWinSize();
                        // Pop.setPosition(cc.p(size.width / 2, size.height / 2));
                        break;
                    case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                        lm.log("yyp 解压缩失败" + event.getMessage());
                        break;
                    default:
                        break;
                }
            });

            cc.eventManager.addListener(listener, 1);

            this._am.update();

            cc.director.runScene(this);
        }

        //this.schedule(this.updateProgress, 0.5);

    },
    loadGame:function(isNotUpdate)
    {
        var self = this;
        var percent = 1;
        if ( isNotUpdate )
        {
            this.schedule(function(){
                lm.log("更新你大爷，percent = " + percent);
                self._loadLayer.SetProcessValue(percent);
                if(percent >= 100)
                {
                    self.loadingCallBack();
                    self.unschedule();
                    return;
                }
                percent+=1;
            },1/100);
        }
        else
        {
            this._loadLayer.HideProgcess();
            //cc.LoaderScene.preload(g_resources, function ()
            //{
                this.loadingCallBack();
            //}, this);

            lm.log("yyp HideProgcess ");
            //this._loadLayer.HideProgcess();
            //this.scheduleOnce(this.loadingCallBack, 0.1);
        }
    },

    loadingCallBack: function ()
    {
        //lm.log("loadGameStart");
        var self = this;
        this._gameIsLoaded = true;
        cc.loader.loadJs(["src/jsList.js"], function (err) {
            var storagePaths = jsb.fileUtils.getSearchPaths();
            //lm.log("搜索路径为 : " + JSON.stringify(storagePaths))
            for (var key1 in jsList) {
                for (var key in storagePaths) {
                    var jsFilename = jsList[key1];
                    var filename = jsFilename.substring(0, jsFilename.lastIndexOf('.'));
                    var jscFilename = filename + ".jsc";
                    //lm.log("storagePaths" + storagePaths[key]);
                    if(jsb.fileUtils.isFileExist(storagePaths[key] + jsFilename) || jsb.fileUtils.isFileExist(storagePaths[key] + jscFilename)) {
                        lm.log("加载更新后的：" + storagePaths[key] + jsList[key1]);
                        require(storagePaths[key] + jsList[key1]);
                        //lm.log("加载更新后的：" + storagePaths[key] + jsList[key1]);
                        break;
                    }
                }
            }
            //lm.log("loadGameEnd");
            cc.director.runScene(new rootUIScene());
        });
        var searchPaths = jsb.fileUtils.getSearchPaths();
        searchPaths.pop();
        jsb.fileUtils.writeToFile({"searchePaths": searchPaths}, jsb.fileUtils.getWritablePath() + "/searchPath");
    },

    updateProgress: function () {
        //lm.log("更新你妹，percent = " + this._percent);
        return;
        //lm.log("更新进度条，percent = " + this._percent);
        this._loadLayer.SetProcessValue(Math.floor(this._percent));
        if(this._percent == 100)
        {
            this.unschedule();
        }
    },

    onExit: function () {
        cc.spriteFrameCache.removeSpriteFrames();
        this._am.release();
        this._super();
    }
});

//确认界面
var AssetsConfirmNode = cc.Layer.extend({
    ctor: function (str, target, callback) {
        this._super();
        this.parentView = ccs.load("res/landlord/cocosOut/ConfirmPop.json").node;
        var desc_text = ccui.helper.seekWidgetByName(this.parentView, "text_ttips");
        var btn_ok = ccui.helper.seekWidgetByName(this.parentView, "btn_tips_yes");
        var btn_cancel = ccui.helper.seekWidgetByName(this.parentView, "btn_tips_no");
        var btn_close = ccui.helper.seekWidgetByName(this.parentView,"btn_close");
        btn_close.setVisible(false);

        this.ignoreAnchorPointForPosition(false);
        this.setAnchorPoint(0.5,0.5);

        var winSize = cc.director.getWinSize();
        this.parentView.ignoreAnchorPointForPosition(false);
        this.parentView.setAnchorPoint(0.5,0.5);
        this.parentView.setPosition(winSize.width/2,winSize.height/2);

        //hanhu  #隐藏取消按钮 2015/10/27
        //btn_cancel.setVisible(false);
        //btn_cancel.setTouchEnabled(false);
        //btn_ok.x = this.parentView.getContentSize().width / 2;

        //hanhu #设定模态对话框 2015/07/23
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan = function(){return true},
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        }, this);

        desc_text.setString(str);
        btn_cancel.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                if (callback) {
                    callback.call(target);
                }
                this.removeFromParent(true);
            }
        }, this)

        btn_ok.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                if (callback) {
                    callback.call(target);
                }
                this.removeFromParent(true);
            }
        }, this)
        this.addChild(this.parentView);
    }
})

