/**
 * Created by study on 16/6/12.
 */
var DragonMusic_GameId_122 =
{
    str:"res/smartGame/music/",
    playBgMusic : function()
    {
        cc.audioEngine.playMusic(this.str + "background.mp3", true);
    },
    playBigBetEffct:function()
    {
        cc.audioEngine.playEffect(this.str + "bigBet.mp3", false);
    },
    playStartEffct:function()
    {
        cc.audioEngine.playEffect(this.str + "start.mp3", false);
    },
    playCountDownEffct:function()
    {
        cc.audioEngine.playEffect(this.str + "countDown.mp3", false);
    },
    playloseEndEffct:function()
    {
        cc.audioEngine.playEffect(this.str + "loseEnd.mp3", false);
    },
    playWinEndEffct:function()
    {
        cc.audioEngine.playEffect(this.str + "winEnd.mp3", false);
    },
    playAddScore:function()
    {
        cc.audioEngine.playEffect(this.str + "addScore.mp3", false);
    }
}