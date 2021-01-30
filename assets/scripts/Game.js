
let PokerUtil = require("PokerUtil");
let AIHelper = require("AIHelper");
let self;
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
        logicHelper: null,
        cardArray: [cc.String],
        //初始牌数组 逆时针 主角是第一个数组
        pokerPlayer: [],
        //当前轮次出牌节点,
        roundPoker: [],
        sendArray:[],
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
        //出牌
        backButton: {
            default: null,
            type: cc.Button
        },

        //当前胜方
        currentWinner: 1,
        //本轮主
        gameHost: "1",
        //玩家拥有牌
        layoutContainer: {
            default: null,
            type: cc.Layout
        },
        //玩家出的牌 
        layoutBottom: {
            default: null,
            type: cc.Layout
        },
        //对家出牌 第三位
        layoutTop: {
            default: null,
            type: cc.Layout
        },
        //下家出牌 左手第二位
        layoutLeft: {
            default: null,
            type: cc.Layout
        },
        //上家出牌，右手第四位
        layoutRight: {
            default: null,
            type: cc.Layout
        },
        //战报
        logLabel: {
            default: null,
            type: cc.Label
        },
        playLog: "游戏开始",
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
        self=this;
        // 获取地平面的 y 轴坐标
        this.groundY = this.ground.y + this.ground.height / 2;
        // 初始化计时器
        this.timer = 0;
        this.starDuration = 0;
        this.logicHelper = new AIHelper();
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
        this.backButton.node.on('click',this.backClick, this)
        this.publishPokers();
        // this.spawnNewStar();
        // 初始化计分
        this.score = 0;
        // this.onRoundCallBack=this.onRoundCallBack.bind(this);
        this.onRoundCallBack=this.onRoundCallBack.bind(this);
        this.logicHelper.roundProgram(this.onUserPlayCallBack,this.onRoundCallBack,this.roundOverCallBack,0,this.gameHost,[]);
    },
    /**
     * 电脑出牌，直接渲染
     * @param gameHost
     * @param roundHost
     * @param sendArray
     * @param currentPlayer
     */
     onRoundCallBack:(gameHost, roundHost, sendArray, currentPlayer)=>{
         self.roundHost=roundHost;
         self.sendArray=sendArray;
         console.log("onion","轮次回调"+sendArray);
       let sendCard= self.logicHelper.sendAIFollowCard(self.gameHost, roundHost, sendArray, self.pokerPlayer[currentPlayer]);
       console.log("onion","轮次出牌"+sendCard);
        // sendArray.push(sendCard);
        self.saveRoundPoker(sendCard, currentPlayer+1, 0);
        return sendCard;
    },
    /**
     * 玩家出牌 出牌按钮可以点击
     * @param gameHost
     * @param roundHost
     * @param sendArray
     * @param currentPlayer
     */
    onUserPlayCallBack:(gameHost, roundHost, sendArray, currentPlayer)=>{
        console.log("onion","回调到user"+sendArray);
    },

    roundOverCallBack:(winnerPosition,sumSocer)=>{
        setTimeout(()=>{
            PokerUtil.destoryArray(self.roundPoker);
            self.score=sumSocer+self.score;
            self.roundHost=null;
            self.appendLog(winnerPosition+"大,捞分"+sumSocer);
            // self.logicHelper.roundProgram(self.onUserPlayCallBack,self.onRoundCallBack,
            //     self.roundOverCallBack,winnerPosition,self.gameHost,[]);
        },1000);
        
    },


    refreshCallback: function (button) {
        this.publishPokers();
    },
    backClick:function(button){
        console.log("onion","backClick");
        cc.director.loadScene("other");
    },
    sendCallback: function (button) {
        // let sendArray = [];
        let willSendCard=null;
        for (let i = 0; i < this.playerControlNodeArray.length;i++) {
            //判断是否可出
            let node = this.playerControlNodeArray[i].getComponent('Card');
            if (node.isCheck) {
                if(willSendCard&&!Array.isArray(willSendCard)){
                    willSendCard=[];
                    willSendCard.push(node.picNum);
                }else{
                    willSendCard=node.picNum;
                }
                
            }
            // this.playerControlNodeArray[i].destroy();
        }
        let message=this.logicHelper.checkUserCanSend(this.gameHost,this.roundHost,this.pokerPlayer[0],willSendCard);
        if(!message){
            console.log("onion","不能出"+message);
            return
        }

        //出牌 移除并添加
        for (let i = 0; i < this.playerControlNodeArray.length;) {
            //判断是否可出
            let node = this.playerControlNodeArray[i].getComponent('Card');
            if (node.isCheck) {
                // willSendArray.push(node.picNum);
                this.saveRoundPoker(node.picNum, 1, i * this.cardWidth);
                this.playerControlNodeArray[i].destroy();
                this.playerControlNodeArray.splice(i, 1);
            } else {
                i++;
            }
            // this.playerControlNodeArray[i].destroy();
        }
        if(!this.sendArray){
            this.sendArray=[];
        }
        this.sendArray.push(willSendCard);
        this.logicHelper.roundProgram(this.onUserPlayCallBack,this.onRoundCallBack,
            this.roundOverCallBack,0,this.gameHost,this.sendArray);
       
    },
    //保存出牌  1 2 3 4 顺时针位
    saveRoundPoker: function (picNum, index, offset) {
        var newStar = cc.instantiate(this.cardPrefab);
        // newStar.setPicNum("i"+i);
        newStar.getComponent('Card').picNum = picNum;
        newStar.scaleX = 0.5;
        newStar.scaleY = 0.5;
        this.roundPoker.push(newStar);
        console.log("onion","保存出牌"+picNum+"index"+index);
        // this.node.addChild(newStar);
        // let height = this.ground.height / 2 * -1;
        switch (index) {
            case 1: this.layoutBottom.node.addChild(newStar);
                this.logicHelper.removePokerFromArray(this.gameHost, picNum, this.pokerPlayer[0]);
                break;
            case 2: this.layoutLeft.node.addChild(newStar);
                this.logicHelper.removePokerFromArray(this.gameHost, picNum, this.pokerPlayer[1]);
                break;
            case 3: this.layoutTop.node.addChild(newStar);
                this.logicHelper.removePokerFromArray(this.gameHost, picNum, this.pokerPlayer[2]);
                break;
            case 4: this.layoutRight.node.addChild(newStar);
                this.logicHelper.removePokerFromArray(this.gameHost, picNum, this.pokerPlayer[3]);
                break;
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

        this.createBottomCard()

    },

    /**
     * type1Array:type1Array,
            type2Array:type2Array,
            type3Array:type3Array,
            type4Array:type4Array,
            hostArray:hostArray,
            total:total
     */
    createBottomCard: function () {

        let startPosition = 0;
        let userObj = this.pokerPlayer[0];
        for (let i = 0; i < userObj.total.length; i++) {
            // 使用给定的模板在场景中生成一个新节点
            var newStar = cc.instantiate(this.cardPrefab);
            // newStar.setPicNum("i"+i);
            newStar.getComponent('Card').picNum = userObj.total[i];
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
        this.gameHost = null;
        let pokerArray = this.cardArray.slice(0);
        let host = parseInt(Math.random() * 4);//随机主牌花色
        for (let i = 0; i < 4; i++) {
            let playerPokerArray = [];
            for (let j = 0; j < 27; j++) {
                let pokerNum = Math.random() * pokerArray.length;
                pokerNum = parseInt(pokerNum);
                //插入手牌中
                let value = pokerArray.splice(pokerNum, 1);
                playerPokerArray.push(value);
                if (this.gameHost == null) {//随机到主后，第一张主牌亮出
                    if (host == PokerUtil.quaryPokerTypeValue(value)) {
                        this.gameHost = value;
                        this.appendLog("本轮游戏,主牌" + PokerUtil.quaryPokerValue(value) + "在" + this.expandPlayer(i));
                    }
                }
            }
            let playerObj = PokerUtil.sortPokers(host, playerPokerArray);
            console.log("onion====", JSON.stringify(playerObj));
            this.pokerPlayer.push(playerObj);
        }
        this.spawnBottomCard();

    },
    expandPlayer: function (location) {
        switch (location) {
            case 0: return "自己"
            case 1: return "下家"
            case 2: return "对家"
            case 3: return "上家"
        }

    },
    appendLog: function (string) {
        this.playLog = this.playLog + "\n" + string;
        this.logLabel.string = this.playLog;
    }





});
