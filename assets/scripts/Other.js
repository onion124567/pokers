// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        backButton: {
            default: null,
            type: cc.Button
        },
        playButton: {
            default: null,
            type: cc.Button
        },
        // player 节点，用于获取主角弹跳的高度，和控制主角行动开关
        poker: {
            default: null,
            type: cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.backButton.node.on('click', this.backClick, this)
        this.playButton.node.on('click', this.playClick, this)
        let str=cc.sys.localStorage.getItem('userData');
        console.log("onion"+"str"+str);
        
    },
    backClick: function (button) {
        cc.director.loadScene("game");
    },
    playClick: function () {
        let str=cc.sys.localStorage.getItem('userData');
        // var action = cc.moveTo(2, 100, 100);
        // 执行动作
        //   this.poker.runAction(action);
        var spawn = cc.spawn(cc.moveBy(2, 100, 100), cc.scaleTo(0.5, 0.8, 1.4));
        this.poker.runAction(spawn);
        this.saveTest();

    },
    //测试本地存储
    saveTest:function(){
        userData = {
            name: 'Tracer',
            level: 1,
            gold: 100
        };
        
        cc.sys.localStorage.setItem('userData', JSON.stringify(userData));
    },
    start() {

    },

    // update (dt) {},
});
