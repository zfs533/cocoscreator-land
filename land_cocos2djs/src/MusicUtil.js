/**
 * Created by baibo on 15/6/15.
 */
var MusicUtil = {
    outSrc: "res/musics/",
    roomSrc: "res/SparrowGames/musics/",
    playMusicRoom: function (src, bool) {
        cc.audioEngine.stopMusic();
        lm.log("播放音乐");
        lm.log("music log  " + this.roomSrc + src);
        cc.audioEngine.playMusic(this.roomSrc + src, bool);
        //cc.audioEngine.setMusicVolume(userInfo.GetSystemVolume(true) / 100);

        cc.log( "音乐音量为：" +  userInfo.GetSystemVolume(true) );
    },
    stopMusic:function(){
        lm.log("停止播放音乐");
        cc.audioEngine.stopMusic();
    },
    playEffectRoom: function (src) {
        lm.log("播放音效 = " + this.roomSrc + src);
        cc.audioEngine.playEffect(this.roomSrc + src);
        //cc.audioEngine.setEffectsVolume(userInfo.GetSystemVolume(false));

        lm.log( "音效音量为：" +  userInfo.GetSystemVolume(false)/100 );
    },
    playMusicOut: function (src, bool) {
        lm.log("执行PlayMusicOut = " + this.outSrc + src);
        cc.audioEngine.stopMusic();
        cc.audioEngine.playMusic(this.outSrc + src, bool);
       // cc.audioEngine.setEffectsVolume( userInfo.GetSystemVolume(true) );

        cc.log( "music log3============" +  userInfo.GetSystemVolume(true)/100 );
    },
    playEffectOut: function (src) {
        lm.log("执行efectOut = " + this.outSrc + src);
        cc.audioEngine.playEffect(this.outSrc + src);
        //cc.audioEngine.setEffectsVolume( userInfo.GetSystemVolume(false)/100 );

        cc.log( "music log============" +  userInfo.GetSystemVolume(false) );
    }
}