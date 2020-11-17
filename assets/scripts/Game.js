
 let PokerUtil = require("PokerUtil");
cc.Class({
    extends: cc.Component,

    properties: {
        // 这个属性引用了星星预制资源
        starPrefab: {
            default: null,
            type: cc.Prefab
        },
        cardPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 星星产生后消失时间的随机范围
        maxStarDuration: 0,
        minStarDuration: 0,
        currentCardPosition: 0,
        startCardPostion: 0,
        cardWidth: 80,
        
        cardArray: [cc.String],
        //初始牌数组 逆时针 主角是第一个数组
        pokerPlayer: [],
        //当前轮次出牌节点,
        roundPoker: [],
        //主角当前牌节点
        playerControlNodeArray: [],
        //洗牌
        refreshButton: {
            default: null,
            type: cc.Button
        },
        //出牌
        sendButton: {
            default: null,
            type: cc.Button
        },

        //当前主
        currentWinner:1,

        layoutContainer:{
            default:null,
            type:cc.Layout
        },
        layoutBottom:{
            default:null,
            type:cc.Layout
        },
        layoutTop:{
            default:null,
            type:cc.Layout
        },
        layoutLeft:{
            default:null,
            type:cc.Layout
        },
        layoutRight:{
            default:null,
            type:cc.Layout
        },
        // 地面节点，用于确定星星生成的高度
        ground: {
            default: null,
            type: cc.Node
        },
        // player 节点，用于获取主角弹跳的高度，和控制主角行动开关
        player: {
            default: null,
            type: cc.Node
        },
        // score label 的引用
        scoreDisplay: {
            default: null,
            type: cc.Label
        },
        // 得分音效资源
        scoreAudio: {
            default: null,
            type: cc.AudioClip
        },
    },

    onLoad: function () {
        // 获取地平面的 y 轴坐标
        this.groundY = this.ground.y + this.ground.height / 2;
        // 初始化计时器
        this.timer = 0;
        this.starDuration = 0;
        //创建图片资源
        for (let i = 0; i < 13; i++) {
            let pre = 3 + i;
            for (let j = 1; j < 5; j++) {
                let str = "";
                if (pre < 10) {
                    str = "0";
                }
                str = str + pre + j;
                this.cardArray.push(str);
                this.cardArray.push(str);
            }
        }
        this.cardArray.push("161");
        this.cardArray.push("161");
        this.cardArray.push("171");
        this.cardArray.push("171");


        this.refreshButton.node.on('click', this.refreshCallback, this);
        this.sendButton.node.on('click', this.sendCallback, this);
        this.publishPokers();
        // this.spawnNewStar();
        // 初始化计分
        this.score = 0;
    },
    refreshCallback: function (button) {
        this.publishPokers();
    },
    sendCallback: function (button) {
        let testArray=[];
        PokerUtil.destoryArray(this.roundPoker);
        for (let i = 0; i < this.playerControlNodeArray.length;) {
            //判断是否可出
            let node = this.playerControlNodeArray[i].getComponent('Card');
            if (node.isCheck) {
                console.log("onion 选中" + PokerUtil.quaryPokerValue(node.picNum));
                testArray.push(node.picNum);
                this.saveRoundPoker(node.picNum, 1, i * this.cardWidth);
                this.playerControlNodeArray[i].destroy();
                this.playerControlNodeArray.splice(i, 1);
            } else {
                i++;
            }
            // this.playerControlNodeArray[i].destroy();
        }
         PokerUtil.testLogic(testArray);
    },
    //保存出牌  1 2 3 4 顺时针位
    saveRoundPoker: function (picNum, index, offset) {
        var newStar = cc.instantiate(this.cardPrefab);
        // newStar.setPicNum("i"+i);
        newStar.getComponent('Card').picNum = picNum;
        newStar.scaleX = 0.5;
        newStar.scaleY = 0.5;
        this.roundPoker.push(newStar);
        // this.node.addChild(newStar);
        // let height = this.ground.height / 2 * -1;
        if (index === 1) {
            // height = height + 100;
            this.layoutBottom.node.addChild(newStar);
        }
        // newStar.setPosition(cc.v2(-150 + this.startCardPostion + offset, height));
    },
    spawnNewStar: function () {
        // 使用给定的模板在场景中生成一个新节点
        var newStar = cc.instantiate(this.starPrefab);
        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(newStar);
        // 为星星设置一个随机位置
        newStar.setPosition(this.getNewStarPosition());
        // 在星星组件上暂存 Game 对象的引用
        newStar.getComponent('Star').game = this;
        // 重置计时器，根据消失时间范围随机取一个值
        this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    },
    /**
     * 移除旧的节点
     * 添加新节点
     */
    spawnBottomCard: function () {
        if (this.playerControlNodeArray.length > 0) {
            let destoryNode = this.playerControlNodeArray;
            PokerUtil.destoryArray(destoryNode);
            this.playerControlNodeArray = [];
        }
        console.log("spawnBottomCard " + this.pokerPlayer[0].length);
        this.createBottomCard()

    },

    createBottomCard: function () {

        let startPosition = 0;
        for (let i = 0; i < this.pokerPlayer[0].length; i++) {
            // 使用给定的模板在场景中生成一个新节点
            var newStar = cc.instantiate(this.cardPrefab);
            // newStar.setPicNum("i"+i);
            newStar.getComponent('Card').picNum = this.pokerPlayer[0][i];
            this.playerControlNodeArray.push(newStar);
            // this.node.addChild(newStar);
            this.layoutContainer.node.addChild(newStar);
            let height = this.ground.height / 2 * -1;
            startPosition = i * this.cardWidth;
            if (i > 13) {
                height = height - 150
                startPosition = (i - 13) * this.cardWidth;
            }
            // newStar.setPosition(cc.v2(-200 + this.startCardPostion + startPosition, height));
        }
    },


    getNewStarPosition: function () {
        var randX = 0;
        // 根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标
        var randY = this.groundY + Math.random() * this.player.getComponent('Player').jumpHeight + 50;
        // 根据屏幕宽度，随机得到一个星星 x 坐标
        var maxX = this.node.width / 2;
        randX = (Math.random() - 0.5) * 2 * maxX;
        // 返回星星坐标
        return cc.v2(randX, randY);
    },
    getCardBottomPosition: function () {
        var randX = this.currentCardPosition;
        var randY = 0;
        this.currentCardPosition = this.currentCardPosition + this.cardWidth;
        return cc.v2(randX, randY);
    },

    update: function (dt) {
        // 每帧更新计时器，超过限度还没有生成新的星星
        // 就会调用游戏失败逻辑
        // if (this.timer > this.starDuration) {
        //     this.gameOver();
        //     this.enabled = false;   // disable gameOver logic to avoid load scene repeatedly
        //     return;
        // }
        // this.timer += dt;
    },

    gainScore: function () {
        this.score += 1;
        // 更新 scoreDisplay Label 的文字
        this.scoreDisplay.string = 'Score: ' + this.score;
        // 播放得分音效
        cc.audioEngine.playEffect(this.scoreAudio, false);
    },

    gameOver: function () {
        this.player.stopAllActions(); //停止 player 节点的跳跃动作
        cc.director.loadScene('game');
    },

    /**
    * 把牌发给四家
    */
    publishPokers: function () {
        this.pokerPlayer = [];
        let pokerArray = this.cardArray.slice(0);
        for (let i = 0; i < 4; i++) {
            let playerPokerArray = [];
            for (let j = 0; j < 27; j++) {
                let pokerNum = Math.random() * pokerArray.length;
                pokerNum = parseInt(pokerNum);
                let value = pokerArray.splice(pokerNum, 1);
                playerPokerArray.push(value);
            }
            this.pokerPlayer.push(playerPokerArray);
        }
        this.spawnBottomCard();

    },
    
    



});
