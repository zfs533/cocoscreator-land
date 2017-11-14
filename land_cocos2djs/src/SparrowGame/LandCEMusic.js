/**
 * Created by zfs on 15/8/27.
 */


var LandCEMusic =
{
    rootUrl:"res/landlord/music/",
    rootUrl01:"res/landlord/music/com/",
    //播放背景音乐
    playBgMusic:function()
    {
        if(nowMusicType != MusicType.desk)
        {
            nowMusicType = MusicType.desk;
            cc.audioEngine.playMusic(this.rootUrl01 + "BACK_MUSIC.mp3", true);
        }
    },
    //播放背景音乐
    playPlazaBgMusic:function()
    {
        if(nowMusicType != MusicType.other)
        {
            nowMusicType = MusicType.other;
            cc.audioEngine.playMusic(this.rootUrl01 + "PLAZA_BACK_MUSIC.mp3", true);
        }
    },
    //停止背景音乐
    stopBgMusic:function()
    {
        nowMusicType = MusicType.none;
        cc.audioEngine.stopMusic(true);
        cc.audioEngine.stopAllEffects();
    },
    //按钮音效
    playBtnEffect:function()
    {
        lm.log("----------------------------  播放按钮音效 ---------------------------")
        cc.audioEngine.playEffect(this.rootUrl01 + "ui_click.mp3");
    },
    //游戏开始音效
    playStartEffect:function()
    {
        cc.audioEngine.playEffect(this.rootUrl01 + "GAME_START.mp3");
    },
    //逃跑音效
    playAddScoreEffect:function()
    {
        cc.audioEngine.playEffect(this.rootUrl01 + "BANKER_INFO.mp3");
    },
    //发牌音效
    playSendEffect:function()
    {
        cc.audioEngine.playEffect(this.rootUrl01 + "SEND_CARD.mp3");
    },
    //胜利音效
    playWinEffect:function()
    {
        cc.audioEngine.playEffect(this.rootUrl01 + "GAME_WIN.mp3");
    },
    //警告音效
    playWarnEffect:function()
    {
        cc.audioEngine.playEffect(this.rootUrl01 + "GAME_WARN.mp3");
    },
    //选中音效
    playSelectedEffect:function()
    {
        cc.audioEngine.playEffect(this.rootUrl01 + "select.mp3");
    },

    //叫分音效
    playCallScoreEffect:function(score)
    {
        var str = "";
        switch (score)
        {
            case 0://不叫
                str = "SCORE_NONE.mp3";
                break;

            case 1:
                str = "SCORE_1.mp3";
                break;

            case 2:
                str = "SCORE_2.mp3";
                break;

            case 3:
                str = "SCORE_3.mp3";
                break;

            default :
                break;
        }
        cc.audioEngine.playEffect(this.rootUrl + str);
    },
    //单牌/对子
    playSingleEffect:function(cardType, isSigle)
    {
        var str01 = "SINGLE_";
        if ( !isSigle )
        {
            str01 = "DOUBLE_";
        }
        var str02 = "";
        var str03 = ".mp3";

        switch (cardType)
        {
            case 1:
                str02 = "1";
                break;

            case 2:
                str02 = "2";
                break;

            case 3:
                str02 = "3";
                break;
            case 4:
                str02 = "4";
                break;

            case 5:
                str02 = "5";
                break;

            case 6:
                str02 = "6";
                break;

            case 7:
                str02 = "7";
                break;

            case 8:
                str02 = "8";
                break;

            case 9:
                str02 = "9";
                break;

            case 10:
                str02 = "10";
                break;

            case 11:
                str02 = "11";
                break;

            case 12:
                str02 = "12";
                break;

            case 13:
                str02 = "13";
                break;

            case 14:
                str02 = "14";
                break;

            case 15:
                str02 = "15";
                break;

            default :
                break;
        }
        var resultStr = str01 + str02 + str03;
        cc.audioEngine.playEffect(this.rootUrl + resultStr);
    },
    //对子
    playDoubleEf:function()
    {
        cc.audioEngine.playEffect(this.rootUrl + "DOUBLE.mp3");
        cc.audioEngine.playEffect(this.rootUrl01 + "LINE.mp3");
    },
    //顺子
    playSingleLineEf:function()
    {
        cc.audioEngine.playEffect(this.rootUrl + "SINGLE_LINE.mp3");
        cc.audioEngine.playEffect(this.rootUrl01 + "LINE.mp3");
    },
    //连对
    playDoubleByDoubleEf:function()
    {
        cc.audioEngine.playEffect(this.rootUrl + "DOUBLE_LINE.mp3");
    },
    //三张
    playThreeEf:function()
    {
        cc.audioEngine.playEffect(this.rootUrl + "THREE.mp3");
    },
    //三带一
    playThreeByOneEf:function()
    {
        cc.audioEngine.playEffect(this.rootUrl + "THREE_TAKE_ONE.mp3");
    },
    //三带一对
    playThreeByTwoEf:function()
    {
        cc.audioEngine.playEffect(this.rootUrl + "THREE_TAKE_TWO.mp3");
    },
    //炸弹
    playBoomEf:function()
    {
        cc.audioEngine.playEffect(this.rootUrl + "BOMB_CARD.mp3");
        cc.audioEngine.playEffect(this.rootUrl01 + "BOMB.mp3");
    },
    //王炸
    playMissileEf:function()
    {
        cc.audioEngine.playEffect(this.rootUrl + "MISSILE_CARD.mp3");
        cc.audioEngine.playEffect(this.rootUrl01 + "MISSILE.mp3");
    },
    //四带二
    playFourBySingleEf:function()
    {
        cc.audioEngine.playEffect(this.rootUrl + "FOUR_TAKE_ONE.mp3");
    },
    //四带二对
    playFourByDoubleEf:function()
    {
        cc.audioEngine.playEffect(this.rootUrl + "FOUR_TAKE_TWO.mp3");
    },
    //四带二对
    playOutcardEf:function()
    {
        cc.audioEngine.playEffect(this.rootUrl + "OUT_CARD.mp3");
    },
    //不要
    playPassEf:function()
    {
        cc.audioEngine.playEffect(this.rootUrl + "PASS_CARD.mp3");
    },
    //飞机
    playThreeOneLineEf:function()
    {
        cc.audioEngine.playEffect(this.rootUrl + "THREE_ONE_LINE.mp3");
        cc.audioEngine.playEffect(this.rootUrl01 + "PLANE.mp3");
    },
    //叫地主
    playCallBankerEf:function()
    {
        cc.audioEngine.playEffect(this.rootUrl + "CALL_BANKER.mp3");
    },
    //不叫
    playNotCallBankerEf:function()
    {
        cc.audioEngine.playEffect(this.rootUrl + "NO_CALL_BANKER.mp3");
    },
    //强地主
    playRodBankerEf:function()
    {
        cc.audioEngine.playEffect(this.rootUrl + "ROD_BANKER.mp3");
    },
    //不强
    playNotRodBankerEf:function()
    {
        cc.audioEngine.playEffect(this.rootUrl + "NO_ROD_BANKER.mp3");
    },
    //加倍
    playJiabeiEf:function()
    {
        cc.audioEngine.playEffect(this.rootUrl + "ADD_DOUBLE.mp3");
    },
    //不加被
    playNotJiabeiEf:function()
    {
        cc.audioEngine.playEffect(this.rootUrl + "NO_ADD_DOUBLE.mp3");
    },
    //警告
    playWarnEf:function()
    {
        cc.audioEngine.playEffect(this.rootUrl01 + "COUNT_WARN.mp3");
    },
    //胜利
    playWinEf:function()
    {
        cc.audioEngine.playEffect(this.rootUrl01 + "Win.mp3");
    },
    //失败
    playLostEf:function()
    {
        cc.audioEngine.playEffect(this.rootUrl01 + "Lost.mp3");
    },
    //剩一张牌
    playOneCardEf:function()
    {
        cc.audioEngine.playEffect(this.rootUrl01 + "OneCard.mp3");
    },
    //剩一张牌
    playTwoCardEf:function()
    {
        cc.audioEngine.playEffect(this.rootUrl01 + "TwoCard.mp3");
    }
};









