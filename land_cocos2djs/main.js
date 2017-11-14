/**
 * A brief explanation for "project.json":
 * Here is the content of project.json file, this is the global configuration for your game, you can modify it to customize some behavior.
 * The detail of each field is under it.
 {
    "project_type": "javascript",
    // "project_type" indicate the program language of your project, you can ignore this field

    "debugMode"     : 1,
    // "debugMode" possible values :
    //      0 - No message will be printed.
    //      1 - cc.error, cc.assert, cc.warn, cc.log will print in console.
    //      2 - cc.error, cc.assert, cc.warn will print in console.
    //      3 - cc.error, cc.assert will print in console.
    //      4 - cc.error, cc.assert, cc.warn, cc.log will print on canvas, available only on web.
    //      5 - cc.error, cc.assert, cc.warn will print on canvas, available only on web.
    //      6 - cc.error, cc.assert will print on canvas, available only on web.

    "showFPS"       : true,
    // Left bottom corner fps information will show when "showFPS" equals true, otherwise it will be hide.

    "frameRate"     : 60,
    // "frameRate" set the wanted frame rate for your game, but the real fps depends on your game implementation and the running environment.

    "id"            : "gameCanvas",
    // "gameCanvas" sets the id of your canvas element on the web page, it's useful only on web.

    "renderMode"    : 0,
    // "renderMode" sets the renderer type, only useful on web :
    //      0 - Automatically chosen by engine
    //      1 - Forced to use canvas renderer
    //      2 - Forced to use WebGL renderer, but this will be ignored on mobile browsers

    "engineDir"     : "frameworks/cocos2d-html5/",
    // In debug mode, if you use the whole engine to develop your game, you should specify its relative path with "engineDir",
    // but if you are using a single engine file, you can ignore it.

    "modules"       : ["cocos2d"],
    // "modules" defines which modules you will need in your game, it's useful only on web,
    // using this can greatly reduce your game's resource size, and the cocos console tool can package your game with only the modules you set.
    // For details about modules definitions, you can refer to "../../frameworks/cocos2d-html5/modulesConfig.json".

    "jsList"        : [
    ]
    // "jsList" sets the list of js files in your game.
 }
 *
 */
var GlobleWinSize = 0;
var Game_ID = 200;
var PreUrl= "";
var ChannelLabel = "";


cc.game.onStart = function () {
    if (!cc.sys.isNative && document.getElementById("cocosLoading")) //If referenced loading.js, please remove it
        document.body.removeChild(document.getElementById("cocosLoading"));

    // Pass true to enable retina display, disabled by default to improve performance
    cc.view.enableRetina(false);
    // Adjust viewport meta
    cc.view.adjustViewPort(true);
    // Setup the resolution policy and design resolution size

    //窗口大小
    var winSize = cc.director.getVisibleSize();
    GlobleWinSize = winSize;
    console.log("device width = " + winSize.width + " device height = " + winSize.height);
    if (winSize.width / winSize.height <= 960 / 640) {
        //IPad按照拉伸策略适配
        cc.view.setDesignResolutionSize(960, 640, cc.ResolutionPolicy.EXACT_FIT);
    } else {
        cc.view.setDesignResolutionSize(960, 640, cc.ResolutionPolicy.FIXED_HEIGHT);
    }
    var winSize2 = cc.director.getVisibleSize();
    console.log("device width2 = " + winSize2.width + " device height2 = " + winSize2.height);

    //cc.LoaderScene.preload(g_resources, function () {}, this);

    // The game will be resized when browser size change
    //cc.view.resizeWithBrowserSize(true);
    //load resources
    //cc.LoaderScene.preload(g_resources, function () {

    //cc.loader.loadJs(["src/jsList.js"], function (err) {
    //    var storagePaths = jsb.fileUtils.getSearchPaths();
    //    //cc.log(JSON.stringify(storagePaths))
    //    for (var key1 in jsList) {
    //        for (var key in storagePaths) {
    //            var jsFilename = jsList[key1];
    //            var filename = jsFilename.substring(0, jsFilename.lastIndexOf('.'));
    //            var jscFilename = filename + ".jsc";
    //            if (jsb.fileUtils.isFileExist(storagePaths[key] + jsFilename) || jsb.fileUtils.isFileExist(storagePaths[key] + jscFilename)) {
    //                require(storagePaths[key] + jsList[key1]);
    //                break;
    //            }
    //        }
    //    }
    //    cc.director.runScene(new rootUIScene());
    //});
    //}, this);


    //hanhu #首先请求更新首地址 2015/09/17
    var scene = cc.Scene.create();
    scene.addChild( new LodingBarUILayer());

    cc.director.runScene(scene);
    //hanhu #增加日志触发事件 2015/10/13
    lm.addLogManagerEvent(scene);



    if(IsNetworkAvailable())
    {
        var vChanelID = GET_CHANEL_ID();
        // 官方渠道 和联通 4G合作渠道
        //if(vChanelID == ChanelID.ANDROID_OFFICIAL ||
        //    vChanelID == ChanelID.ANDROID_UNICOM4GOOPERATION)
        if(0)
        {
            webMsgManager.SendGetEngineVersion(function (data) {
                lm.log("获取引擎版本：" + JSON.stringify(data));

                if((data["app_url"] != undefined) &&
                    (data["engine_version"] != undefined) &&
                    (data["update_info"] != undefined) &&
                    (data["apk_md5"] != undefined))
                {
                    lm.log("GET_KERNEL_VERSION：" + JSON.stringify(data));
                    if(GET_KERNEL_VERSION() < Number(data["engine_version"]))
                    {
                        layerManager.PopTipLayer(new UpdateTipLayer(data["update_info"], function (id) {
                            if (id == clickid.ok) {
                                OpenAppURL(data["app_url"],data["apk_md5"]);
                            }else
                            {
                                ExitGame();
                            }
                        }));

                    }else
                    {
                        webMsgManager.SendGetUpdataAddress(function (data) {
                            lm.log("获取文件更新地址成功：" + JSON.stringify(data));
                            //获取 http web url
                            PreUrl = data["app_update_url"];

                            cc.director.runScene(new AssetsManagerLoaderScene());
                            // 获取失败
                        }, function (errinfo) {
                            lm.log("获取更新地址失败：" + errinfo);
                            //var Pop = new AssetsConfirmNode("更新文件失败，请切换网络环境重试！", this, function(){
                            //    ExitGame();
                            //});
                            //scene.addChild(Pop, 999);
                            //var size = cc.director.getWinSize();
                            //Pop.setPosition(cc.p(size.width / 2, size.height / 2));
                            cc.director.runScene(new AssetsManagerLoaderScene());
                        }, this);

                    }
                }

                // 获取失败
            }, function (errinfo)
            {
                lm.log("获取引擎版本失败：" + errinfo);
                cc.director.runScene(new AssetsManagerLoaderScene());
            },this);

        }
        else
        {

            webMsgManager.SendGetUpdataAddress(function (data) {
                lm.log("获取文件更新地址成功：" + JSON.stringify(data));
                //获取 http web url
                PreUrl = data["app_update_url"];

                cc.director.runScene(new AssetsManagerLoaderScene());
                // 获取失败
            }, function (errinfo) {
                lm.log("获取更新地址失败：" + errinfo);
                var Pop = new AssetsConfirmNode("更新文件失败，请切换网络环境重试！", this, function(){
                    ExitGame();
                });
                scene.addChild(Pop, 999);
                var size = cc.director.getWinSize();
                Pop.ignoreAnchorPointForPosition(false);
                Pop.setAnchorPoint(0.5,0.5);
                Pop.setPosition(cc.p(size.width / 2, size.height / 2));
                cc.director.runScene(new AssetsManagerLoaderScene());
            }, this);
        }
    }
    else
    {
        var Pop = new AssetsConfirmNode("连接网络失败，请检查网络是否正确连接！", this, function(){
            ExitGame();
        });
        Pop.ignoreAnchorPointForPosition(false);
        Pop.setAnchorPoint(0.5,0.5);
        scene.addChild(Pop, 999);
        var size = cc.director.getWinSize();
        Pop.setPosition(cc.p(size.width / 2, size.height / 2));
    }


    //cc.director.runScene(new rootUIScene());






};
cc.game.run();










