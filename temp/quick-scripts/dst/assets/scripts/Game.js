
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/Game.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '4e12fLSQu1L+KV6QmxDiavU', 'Game');
// scripts/Game.js

"use strict";

var PokerUtil = require("PokerUtil");

var AIHelper = require("AIHelper");

var self;
cc.Class({
  "extends": cc.Component,
  properties: {
    // 这个属性引用了星星预制资源
    starPrefab: {
      "default": null,
      type: cc.Prefab
    },
    cardPrefab: {
      "default": null,
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
    sendArray: [],
    //主角当前牌节点
    playerControlNodeArray: [],
    //洗牌
    refreshButton: {
      "default": null,
      type: cc.Button
    },
    //出牌
    sendButton: {
      "default": null,
      type: cc.Button
    },
    //出牌
    backButton: {
      "default": null,
      type: cc.Button
    },
    //当前胜方
    currentWinner: 1,
    //本轮主
    gameHost: "1",
    //玩家拥有牌
    layoutContainer: {
      "default": null,
      type: cc.Layout
    },
    //玩家出的牌 
    layoutBottom: {
      "default": null,
      type: cc.Layout
    },
    //对家出牌 第三位
    layoutTop: {
      "default": null,
      type: cc.Layout
    },
    //下家出牌 左手第二位
    layoutLeft: {
      "default": null,
      type: cc.Layout
    },
    //上家出牌，右手第四位
    layoutRight: {
      "default": null,
      type: cc.Layout
    },
    //战报
    logLabel: {
      "default": null,
      type: cc.Label
    },
    playLog: "游戏开始",
    // 地面节点，用于确定星星生成的高度
    ground: {
      "default": null,
      type: cc.Node
    },
    // player 节点，用于获取主角弹跳的高度，和控制主角行动开关
    player: {
      "default": null,
      type: cc.Node
    },
    // score label 的引用
    scoreDisplay: {
      "default": null,
      type: cc.Label
    },
    // 得分音效资源
    scoreAudio: {
      "default": null,
      type: cc.AudioClip
    }
  },
  onLoad: function onLoad() {
    self = this; // 获取地平面的 y 轴坐标

    this.groundY = this.ground.y + this.ground.height / 2; // 初始化计时器

    this.timer = 0;
    this.starDuration = 0;
    this.logicHelper = new AIHelper(); //创建图片资源

    for (var i = 0; i < 13; i++) {
      var pre = 3 + i;

      for (var j = 1; j < 5; j++) {
        var str = "";

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
    this.backButton.node.on('click', this.backClick, this);
    this.publishPokers(); // this.spawnNewStar();
    // 初始化计分

    this.score = 0; // this.onRoundCallBack=this.onRoundCallBack.bind(this);

    this.onRoundCallBack = this.onRoundCallBack.bind(this);
    this.logicHelper.roundProgram(this.onUserPlayCallBack, this.onRoundCallBack, this.roundOverCallBack, 0, this.gameHost, []);
  },

  /**
   * 电脑出牌，直接渲染
   * @param gameHost
   * @param roundHost
   * @param sendArray
   * @param currentPlayer
   */
  onRoundCallBack: function onRoundCallBack(gameHost, roundHost, sendArray, currentPlayer) {
    self.roundHost = roundHost;
    self.sendArray = sendArray;
    console.log("onion", "轮次回调" + sendArray);
    var sendCard = self.logicHelper.sendAIFollowCard(self.gameHost, roundHost, sendArray, self.pokerPlayer[currentPlayer]);
    console.log("onion", "轮次出牌" + sendCard); // sendArray.push(sendCard);

    self.saveRoundPoker(sendCard, currentPlayer + 1, 0);
    return sendCard;
  },

  /**
   * 玩家出牌 出牌按钮可以点击
   * @param gameHost
   * @param roundHost
   * @param sendArray
   * @param currentPlayer
   */
  onUserPlayCallBack: function onUserPlayCallBack(gameHost, roundHost, sendArray, currentPlayer) {
    console.log("onion", "回调到user" + sendArray);
  },
  roundOverCallBack: function roundOverCallBack(winnerPosition, sumSocer) {
    setTimeout(function () {
      PokerUtil.destoryArray(self.roundPoker);
      self.score = sumSocer + self.score;
      self.roundHost = null;
      self.appendLog(winnerPosition + "大,捞分" + sumSocer); // self.logicHelper.roundProgram(self.onUserPlayCallBack,self.onRoundCallBack,
      //     self.roundOverCallBack,winnerPosition,self.gameHost,[]);
    }, 1000);
  },
  refreshCallback: function refreshCallback(button) {
    this.publishPokers();
  },
  backClick: function backClick(button) {
    console.log("onion", "backClick");
    cc.director.loadScene("other");
  },
  sendCallback: function sendCallback(button) {
    // let sendArray = [];
    var willSendCard = null;

    for (var i = 0; i < this.playerControlNodeArray.length; i++) {
      //判断是否可出
      var node = this.playerControlNodeArray[i].getComponent('Card');

      if (node.isCheck) {
        if (willSendCard && !Array.isArray(willSendCard)) {
          willSendCard = [];
          willSendCard.push(node.picNum);
        } else {
          willSendCard = node.picNum;
        }
      } // this.playerControlNodeArray[i].destroy();

    }

    var message = this.logicHelper.checkUserCanSend(this.gameHost, this.roundHost, this.pokerPlayer[0], willSendCard);

    if (!message) {
      console.log("onion", "不能出" + message);
      return;
    } //出牌 移除并添加


    for (var _i = 0; _i < this.playerControlNodeArray.length;) {
      //判断是否可出
      var _node = this.playerControlNodeArray[_i].getComponent('Card');

      if (_node.isCheck) {
        // willSendArray.push(node.picNum);
        this.saveRoundPoker(_node.picNum, 1, _i * this.cardWidth);

        this.playerControlNodeArray[_i].destroy();

        this.playerControlNodeArray.splice(_i, 1);
      } else {
        _i++;
      } // this.playerControlNodeArray[i].destroy();

    }

    if (!this.sendArray) {
      this.sendArray = [];
    }

    this.sendArray.push(willSendCard);
    this.logicHelper.roundProgram(this.onUserPlayCallBack, this.onRoundCallBack, this.roundOverCallBack, 0, this.gameHost, this.sendArray);
  },
  //保存出牌  1 2 3 4 顺时针位
  saveRoundPoker: function saveRoundPoker(picNum, index, offset) {
    var newStar = cc.instantiate(this.cardPrefab); // newStar.setPicNum("i"+i);

    newStar.getComponent('Card').picNum = picNum;
    newStar.scaleX = 0.5;
    newStar.scaleY = 0.5;
    this.roundPoker.push(newStar);
    console.log("onion", "保存出牌" + picNum + "index" + index); // this.node.addChild(newStar);
    // let height = this.ground.height / 2 * -1;

    switch (index) {
      case 1:
        this.layoutBottom.node.addChild(newStar);
        this.logicHelper.removePokerFromArray(this.gameHost, picNum, this.pokerPlayer[0]);
        break;

      case 2:
        this.layoutLeft.node.addChild(newStar);
        this.logicHelper.removePokerFromArray(this.gameHost, picNum, this.pokerPlayer[1]);
        break;

      case 3:
        this.layoutTop.node.addChild(newStar);
        this.logicHelper.removePokerFromArray(this.gameHost, picNum, this.pokerPlayer[2]);
        break;

      case 4:
        this.layoutRight.node.addChild(newStar);
        this.logicHelper.removePokerFromArray(this.gameHost, picNum, this.pokerPlayer[3]);
        break;
    } // newStar.setPosition(cc.v2(-150 + this.startCardPostion + offset, height));

  },
  spawnNewStar: function spawnNewStar() {
    // 使用给定的模板在场景中生成一个新节点
    var newStar = cc.instantiate(this.starPrefab); // 将新增的节点添加到 Canvas 节点下面

    this.node.addChild(newStar); // 为星星设置一个随机位置

    newStar.setPosition(this.getNewStarPosition()); // 在星星组件上暂存 Game 对象的引用

    newStar.getComponent('Star').game = this; // 重置计时器，根据消失时间范围随机取一个值

    this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
    this.timer = 0;
  },

  /**
   * 移除旧的节点
   * 添加新节点
   */
  spawnBottomCard: function spawnBottomCard() {
    if (this.playerControlNodeArray.length > 0) {
      var destoryNode = this.playerControlNodeArray;
      PokerUtil.destoryArray(destoryNode);
      this.playerControlNodeArray = [];
    }

    this.createBottomCard();
  },

  /**
   * type1Array:type1Array,
          type2Array:type2Array,
          type3Array:type3Array,
          type4Array:type4Array,
          hostArray:hostArray,
          total:total
   */
  createBottomCard: function createBottomCard() {
    var startPosition = 0;
    var userObj = this.pokerPlayer[0];

    for (var i = 0; i < userObj.total.length; i++) {
      // 使用给定的模板在场景中生成一个新节点
      var newStar = cc.instantiate(this.cardPrefab); // newStar.setPicNum("i"+i);

      newStar.getComponent('Card').picNum = userObj.total[i];
      this.playerControlNodeArray.push(newStar); // this.node.addChild(newStar);

      this.layoutContainer.node.addChild(newStar);
      var height = this.ground.height / 2 * -1;
      startPosition = i * this.cardWidth;

      if (i > 13) {
        height = height - 150;
        startPosition = (i - 13) * this.cardWidth;
      } // newStar.setPosition(cc.v2(-200 + this.startCardPostion + startPosition, height));

    }
  },
  getNewStarPosition: function getNewStarPosition() {
    var randX = 0; // 根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标

    var randY = this.groundY + Math.random() * this.player.getComponent('Player').jumpHeight + 50; // 根据屏幕宽度，随机得到一个星星 x 坐标

    var maxX = this.node.width / 2;
    randX = (Math.random() - 0.5) * 2 * maxX; // 返回星星坐标

    return cc.v2(randX, randY);
  },
  getCardBottomPosition: function getCardBottomPosition() {
    var randX = this.currentCardPosition;
    var randY = 0;
    this.currentCardPosition = this.currentCardPosition + this.cardWidth;
    return cc.v2(randX, randY);
  },
  update: function update(dt) {// 每帧更新计时器，超过限度还没有生成新的星星
    // 就会调用游戏失败逻辑
    // if (this.timer > this.starDuration) {
    //     this.gameOver();
    //     this.enabled = false;   // disable gameOver logic to avoid load scene repeatedly
    //     return;
    // }
    // this.timer += dt;
  },
  gainScore: function gainScore() {
    this.score += 1; // 更新 scoreDisplay Label 的文字

    this.scoreDisplay.string = 'Score: ' + this.score; // 播放得分音效

    cc.audioEngine.playEffect(this.scoreAudio, false);
  },
  gameOver: function gameOver() {
    this.player.stopAllActions(); //停止 player 节点的跳跃动作

    cc.director.loadScene('game');
  },

  /**
  * 把牌发给四家
  */
  publishPokers: function publishPokers() {
    this.pokerPlayer = [];
    this.gameHost = null;
    var pokerArray = this.cardArray.slice(0);
    var host = parseInt(Math.random() * 4); //随机主牌花色

    for (var i = 0; i < 4; i++) {
      var playerPokerArray = [];

      for (var j = 0; j < 27; j++) {
        var pokerNum = Math.random() * pokerArray.length;
        pokerNum = parseInt(pokerNum); //插入手牌中

        var value = pokerArray.splice(pokerNum, 1);
        playerPokerArray.push(value);

        if (this.gameHost == null) {
          //随机到主后，第一张主牌亮出
          if (host == PokerUtil.quaryPokerTypeValue(value)) {
            this.gameHost = value;
            this.appendLog("本轮游戏,主牌" + PokerUtil.quaryPokerValue(value) + "在" + this.expandPlayer(i));
          }
        }
      }

      var playerObj = PokerUtil.sortPokers(host, playerPokerArray);
      console.log("onion====", JSON.stringify(playerObj));
      this.pokerPlayer.push(playerObj);
    }

    this.spawnBottomCard();
  },
  expandPlayer: function expandPlayer(location) {
    switch (location) {
      case 0:
        return "自己";

      case 1:
        return "下家";

      case 2:
        return "对家";

      case 3:
        return "上家";
    }
  },
  appendLog: function appendLog(string) {
    this.playLog = this.playLog + "\n" + string;
    this.logLabel.string = this.playLog;
  }
});

cc._RF.pop();
                    }
                    if (nodeEnv) {
                        __define(__module.exports, __require, __module);
                    }
                    else {
                        __quick_compile_project__.registerModuleFunc(__filename, function () {
                            __define(__module.exports, __require, __module);
                        });
                    }
                })();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcR2FtZS5qcyJdLCJuYW1lcyI6WyJQb2tlclV0aWwiLCJyZXF1aXJlIiwiQUlIZWxwZXIiLCJzZWxmIiwiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJzdGFyUHJlZmFiIiwidHlwZSIsIlByZWZhYiIsImNhcmRQcmVmYWIiLCJtYXhTdGFyRHVyYXRpb24iLCJtaW5TdGFyRHVyYXRpb24iLCJjdXJyZW50Q2FyZFBvc2l0aW9uIiwic3RhcnRDYXJkUG9zdGlvbiIsImNhcmRXaWR0aCIsImxvZ2ljSGVscGVyIiwiY2FyZEFycmF5IiwiU3RyaW5nIiwicG9rZXJQbGF5ZXIiLCJyb3VuZFBva2VyIiwic2VuZEFycmF5IiwicGxheWVyQ29udHJvbE5vZGVBcnJheSIsInJlZnJlc2hCdXR0b24iLCJCdXR0b24iLCJzZW5kQnV0dG9uIiwiYmFja0J1dHRvbiIsImN1cnJlbnRXaW5uZXIiLCJnYW1lSG9zdCIsImxheW91dENvbnRhaW5lciIsIkxheW91dCIsImxheW91dEJvdHRvbSIsImxheW91dFRvcCIsImxheW91dExlZnQiLCJsYXlvdXRSaWdodCIsImxvZ0xhYmVsIiwiTGFiZWwiLCJwbGF5TG9nIiwiZ3JvdW5kIiwiTm9kZSIsInBsYXllciIsInNjb3JlRGlzcGxheSIsInNjb3JlQXVkaW8iLCJBdWRpb0NsaXAiLCJvbkxvYWQiLCJncm91bmRZIiwieSIsImhlaWdodCIsInRpbWVyIiwic3RhckR1cmF0aW9uIiwiaSIsInByZSIsImoiLCJzdHIiLCJwdXNoIiwibm9kZSIsIm9uIiwicmVmcmVzaENhbGxiYWNrIiwic2VuZENhbGxiYWNrIiwiYmFja0NsaWNrIiwicHVibGlzaFBva2VycyIsInNjb3JlIiwib25Sb3VuZENhbGxCYWNrIiwiYmluZCIsInJvdW5kUHJvZ3JhbSIsIm9uVXNlclBsYXlDYWxsQmFjayIsInJvdW5kT3ZlckNhbGxCYWNrIiwicm91bmRIb3N0IiwiY3VycmVudFBsYXllciIsImNvbnNvbGUiLCJsb2ciLCJzZW5kQ2FyZCIsInNlbmRBSUZvbGxvd0NhcmQiLCJzYXZlUm91bmRQb2tlciIsIndpbm5lclBvc2l0aW9uIiwic3VtU29jZXIiLCJzZXRUaW1lb3V0IiwiZGVzdG9yeUFycmF5IiwiYXBwZW5kTG9nIiwiYnV0dG9uIiwiZGlyZWN0b3IiLCJsb2FkU2NlbmUiLCJ3aWxsU2VuZENhcmQiLCJsZW5ndGgiLCJnZXRDb21wb25lbnQiLCJpc0NoZWNrIiwiQXJyYXkiLCJpc0FycmF5IiwicGljTnVtIiwibWVzc2FnZSIsImNoZWNrVXNlckNhblNlbmQiLCJkZXN0cm95Iiwic3BsaWNlIiwiaW5kZXgiLCJvZmZzZXQiLCJuZXdTdGFyIiwiaW5zdGFudGlhdGUiLCJzY2FsZVgiLCJzY2FsZVkiLCJhZGRDaGlsZCIsInJlbW92ZVBva2VyRnJvbUFycmF5Iiwic3Bhd25OZXdTdGFyIiwic2V0UG9zaXRpb24iLCJnZXROZXdTdGFyUG9zaXRpb24iLCJnYW1lIiwiTWF0aCIsInJhbmRvbSIsInNwYXduQm90dG9tQ2FyZCIsImRlc3RvcnlOb2RlIiwiY3JlYXRlQm90dG9tQ2FyZCIsInN0YXJ0UG9zaXRpb24iLCJ1c2VyT2JqIiwidG90YWwiLCJyYW5kWCIsInJhbmRZIiwianVtcEhlaWdodCIsIm1heFgiLCJ3aWR0aCIsInYyIiwiZ2V0Q2FyZEJvdHRvbVBvc2l0aW9uIiwidXBkYXRlIiwiZHQiLCJnYWluU2NvcmUiLCJzdHJpbmciLCJhdWRpb0VuZ2luZSIsInBsYXlFZmZlY3QiLCJnYW1lT3ZlciIsInN0b3BBbGxBY3Rpb25zIiwicG9rZXJBcnJheSIsInNsaWNlIiwiaG9zdCIsInBhcnNlSW50IiwicGxheWVyUG9rZXJBcnJheSIsInBva2VyTnVtIiwidmFsdWUiLCJxdWFyeVBva2VyVHlwZVZhbHVlIiwicXVhcnlQb2tlclZhbHVlIiwiZXhwYW5kUGxheWVyIiwicGxheWVyT2JqIiwic29ydFBva2VycyIsIkpTT04iLCJzdHJpbmdpZnkiLCJsb2NhdGlvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7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Q0FBWixFQUFrRDtBQUM5QyxpQkFBSzFHLFFBQUwsR0FBZ0IwRyxLQUFoQjtBQUNBLGlCQUFLeEQsU0FBTCxDQUFlLFlBQVkvRSxTQUFTLENBQUN5SSxlQUFWLENBQTBCRixLQUExQixDQUFaLEdBQStDLEdBQS9DLEdBQXFELEtBQUtHLFlBQUwsQ0FBa0J2RixDQUFsQixDQUFwRTtBQUNIO0FBQ0o7QUFDSjs7QUFDRCxVQUFJd0YsU0FBUyxHQUFHM0ksU0FBUyxDQUFDNEksVUFBVixDQUFxQlQsSUFBckIsRUFBMkJFLGdCQUEzQixDQUFoQjtBQUNBL0QsTUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksV0FBWixFQUF5QnNFLElBQUksQ0FBQ0MsU0FBTCxDQUFlSCxTQUFmLENBQXpCO0FBQ0EsV0FBS3ZILFdBQUwsQ0FBaUJtQyxJQUFqQixDQUFzQm9GLFNBQXRCO0FBQ0g7O0FBQ0QsU0FBSy9CLGVBQUw7QUFFSCxHQXBZSTtBQXFZTDhCLEVBQUFBLFlBQVksRUFBRSxzQkFBVUssUUFBVixFQUFvQjtBQUM5QixZQUFRQSxRQUFSO0FBQ0ksV0FBSyxDQUFMO0FBQVEsZUFBTyxJQUFQOztBQUNSLFdBQUssQ0FBTDtBQUFRLGVBQU8sSUFBUDs7QUFDUixXQUFLLENBQUw7QUFBUSxlQUFPLElBQVA7O0FBQ1IsV0FBSyxDQUFMO0FBQVEsZUFBTyxJQUFQO0FBSlo7QUFPSCxHQTdZSTtBQThZTGhFLEVBQUFBLFNBQVMsRUFBRSxtQkFBVTZDLE1BQVYsRUFBa0I7QUFDekIsU0FBS3RGLE9BQUwsR0FBZSxLQUFLQSxPQUFMLEdBQWUsSUFBZixHQUFzQnNGLE1BQXJDO0FBQ0EsU0FBS3hGLFFBQUwsQ0FBY3dGLE1BQWQsR0FBdUIsS0FBS3RGLE9BQTVCO0FBQ0g7QUFqWkksQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbmxldCBQb2tlclV0aWwgPSByZXF1aXJlKFwiUG9rZXJVdGlsXCIpO1xyXG5sZXQgQUlIZWxwZXIgPSByZXF1aXJlKFwiQUlIZWxwZXJcIik7XHJcbmxldCBzZWxmO1xyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIC8vIOi/meS4quWxnuaAp+W8leeUqOS6huaYn+aYn+mihOWItui1hOa6kFxyXG4gICAgICAgIHN0YXJQcmVmYWI6IHtcclxuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcclxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBjYXJkUHJlZmFiOiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8g5pif5pif5Lqn55Sf5ZCO5raI5aSx5pe26Ze055qE6ZqP5py66IyD5Zu0XHJcbiAgICAgICAgbWF4U3RhckR1cmF0aW9uOiAwLFxyXG4gICAgICAgIG1pblN0YXJEdXJhdGlvbjogMCxcclxuICAgICAgICBjdXJyZW50Q2FyZFBvc2l0aW9uOiAwLFxyXG4gICAgICAgIHN0YXJ0Q2FyZFBvc3Rpb246IDAsXHJcbiAgICAgICAgY2FyZFdpZHRoOiA4MCxcclxuICAgICAgICBsb2dpY0hlbHBlcjogbnVsbCxcclxuICAgICAgICBjYXJkQXJyYXk6IFtjYy5TdHJpbmddLFxyXG4gICAgICAgIC8v5Yid5aeL54mM5pWw57uEIOmAhuaXtumSiCDkuLvop5LmmK/nrKzkuIDkuKrmlbDnu4RcclxuICAgICAgICBwb2tlclBsYXllcjogW10sXHJcbiAgICAgICAgLy/lvZPliY3ova7mrKHlh7rniYzoioLngrksXHJcbiAgICAgICAgcm91bmRQb2tlcjogW10sXHJcbiAgICAgICAgc2VuZEFycmF5OltdLFxyXG4gICAgICAgIC8v5Li76KeS5b2T5YmN54mM6IqC54K5XHJcbiAgICAgICAgcGxheWVyQ29udHJvbE5vZGVBcnJheTogW10sXHJcbiAgICAgICAgLy/mtJfniYxcclxuICAgICAgICByZWZyZXNoQnV0dG9uOiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6IGNjLkJ1dHRvblxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy/lh7rniYxcclxuICAgICAgICBzZW5kQnV0dG9uOiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6IGNjLkJ1dHRvblxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy/lh7rniYxcclxuICAgICAgICBiYWNrQnV0dG9uOiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6IGNjLkJ1dHRvblxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8v5b2T5YmN6IOc5pa5XHJcbiAgICAgICAgY3VycmVudFdpbm5lcjogMSxcclxuICAgICAgICAvL+acrOi9ruS4u1xyXG4gICAgICAgIGdhbWVIb3N0OiBcIjFcIixcclxuICAgICAgICAvL+eOqeWutuaLpeacieeJjFxyXG4gICAgICAgIGxheW91dENvbnRhaW5lcjoge1xyXG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxyXG4gICAgICAgICAgICB0eXBlOiBjYy5MYXlvdXRcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8v546p5a625Ye655qE54mMIFxyXG4gICAgICAgIGxheW91dEJvdHRvbToge1xyXG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxyXG4gICAgICAgICAgICB0eXBlOiBjYy5MYXlvdXRcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8v5a+55a625Ye654mMIOesrOS4ieS9jVxyXG4gICAgICAgIGxheW91dFRvcDoge1xyXG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxyXG4gICAgICAgICAgICB0eXBlOiBjYy5MYXlvdXRcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8v5LiL5a625Ye654mMIOW3puaJi+esrOS6jOS9jVxyXG4gICAgICAgIGxheW91dExlZnQ6IHtcclxuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcclxuICAgICAgICAgICAgdHlwZTogY2MuTGF5b3V0XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvL+S4iuWutuWHuueJjO+8jOWPs+aJi+esrOWbm+S9jVxyXG4gICAgICAgIGxheW91dFJpZ2h0OiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6IGNjLkxheW91dFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy/miJjmiqVcclxuICAgICAgICBsb2dMYWJlbDoge1xyXG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxyXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcGxheUxvZzogXCLmuLjmiI/lvIDlp4tcIixcclxuICAgICAgICAvLyDlnLDpnaLoioLngrnvvIznlKjkuo7noa7lrprmmJ/mmJ/nlJ/miJDnmoTpq5jluqZcclxuICAgICAgICBncm91bmQ6IHtcclxuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcclxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8gcGxheWVyIOiKgueCue+8jOeUqOS6juiOt+WPluS4u+inkuW8uei3s+eahOmrmOW6pu+8jOWSjOaOp+WItuS4u+inkuihjOWKqOW8gOWFs1xyXG4gICAgICAgIHBsYXllcjoge1xyXG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxyXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyBzY29yZSBsYWJlbCDnmoTlvJXnlKhcclxuICAgICAgICBzY29yZURpc3BsYXk6IHtcclxuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcclxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWxcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIOW+l+WIhumfs+aViOi1hOa6kFxyXG4gICAgICAgIHNjb3JlQXVkaW86IHtcclxuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcclxuICAgICAgICAgICAgdHlwZTogY2MuQXVkaW9DbGlwXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcblxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgc2VsZj10aGlzO1xyXG4gICAgICAgIC8vIOiOt+WPluWcsOW5s+mdoueahCB5IOi9tOWdkOagh1xyXG4gICAgICAgIHRoaXMuZ3JvdW5kWSA9IHRoaXMuZ3JvdW5kLnkgKyB0aGlzLmdyb3VuZC5oZWlnaHQgLyAyO1xyXG4gICAgICAgIC8vIOWIneWni+WMluiuoeaXtuWZqFxyXG4gICAgICAgIHRoaXMudGltZXIgPSAwO1xyXG4gICAgICAgIHRoaXMuc3RhckR1cmF0aW9uID0gMDtcclxuICAgICAgICB0aGlzLmxvZ2ljSGVscGVyID0gbmV3IEFJSGVscGVyKCk7XHJcbiAgICAgICAgLy/liJvlu7rlm77niYfotYTmupBcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEzOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IHByZSA9IDMgKyBpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMTsgaiA8IDU7IGorKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHN0ciA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJlIDwgMTApIHtcclxuICAgICAgICAgICAgICAgICAgICBzdHIgPSBcIjBcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHN0ciA9IHN0ciArIHByZSArIGo7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhcmRBcnJheS5wdXNoKHN0cik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhcmRBcnJheS5wdXNoKHN0cik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jYXJkQXJyYXkucHVzaChcIjE2MVwiKTtcclxuICAgICAgICB0aGlzLmNhcmRBcnJheS5wdXNoKFwiMTYxXCIpO1xyXG4gICAgICAgIHRoaXMuY2FyZEFycmF5LnB1c2goXCIxNzFcIik7XHJcbiAgICAgICAgdGhpcy5jYXJkQXJyYXkucHVzaChcIjE3MVwiKTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMucmVmcmVzaEJ1dHRvbi5ub2RlLm9uKCdjbGljaycsIHRoaXMucmVmcmVzaENhbGxiYWNrLCB0aGlzKTtcclxuICAgICAgICB0aGlzLnNlbmRCdXR0b24ubm9kZS5vbignY2xpY2snLCB0aGlzLnNlbmRDYWxsYmFjaywgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5iYWNrQnV0dG9uLm5vZGUub24oJ2NsaWNrJyx0aGlzLmJhY2tDbGljaywgdGhpcylcclxuICAgICAgICB0aGlzLnB1Ymxpc2hQb2tlcnMoKTtcclxuICAgICAgICAvLyB0aGlzLnNwYXduTmV3U3RhcigpO1xyXG4gICAgICAgIC8vIOWIneWni+WMluiuoeWIhlxyXG4gICAgICAgIHRoaXMuc2NvcmUgPSAwO1xyXG4gICAgICAgIC8vIHRoaXMub25Sb3VuZENhbGxCYWNrPXRoaXMub25Sb3VuZENhbGxCYWNrLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5vblJvdW5kQ2FsbEJhY2s9dGhpcy5vblJvdW5kQ2FsbEJhY2suYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmxvZ2ljSGVscGVyLnJvdW5kUHJvZ3JhbSh0aGlzLm9uVXNlclBsYXlDYWxsQmFjayx0aGlzLm9uUm91bmRDYWxsQmFjayx0aGlzLnJvdW5kT3ZlckNhbGxCYWNrLDAsdGhpcy5nYW1lSG9zdCxbXSk7XHJcbiAgICB9LFxyXG4gICAgLyoqXHJcbiAgICAgKiDnlLXohJHlh7rniYzvvIznm7TmjqXmuLLmn5NcclxuICAgICAqIEBwYXJhbSBnYW1lSG9zdFxyXG4gICAgICogQHBhcmFtIHJvdW5kSG9zdFxyXG4gICAgICogQHBhcmFtIHNlbmRBcnJheVxyXG4gICAgICogQHBhcmFtIGN1cnJlbnRQbGF5ZXJcclxuICAgICAqL1xyXG4gICAgIG9uUm91bmRDYWxsQmFjazooZ2FtZUhvc3QsIHJvdW5kSG9zdCwgc2VuZEFycmF5LCBjdXJyZW50UGxheWVyKT0+e1xyXG4gICAgICAgICBzZWxmLnJvdW5kSG9zdD1yb3VuZEhvc3Q7XHJcbiAgICAgICAgIHNlbGYuc2VuZEFycmF5PXNlbmRBcnJheTtcclxuICAgICAgICAgY29uc29sZS5sb2coXCJvbmlvblwiLFwi6L2u5qyh5Zue6LCDXCIrc2VuZEFycmF5KTtcclxuICAgICAgIGxldCBzZW5kQ2FyZD0gc2VsZi5sb2dpY0hlbHBlci5zZW5kQUlGb2xsb3dDYXJkKHNlbGYuZ2FtZUhvc3QsIHJvdW5kSG9zdCwgc2VuZEFycmF5LCBzZWxmLnBva2VyUGxheWVyW2N1cnJlbnRQbGF5ZXJdKTtcclxuICAgICAgIGNvbnNvbGUubG9nKFwib25pb25cIixcIui9ruasoeWHuueJjFwiK3NlbmRDYXJkKTtcclxuICAgICAgICAvLyBzZW5kQXJyYXkucHVzaChzZW5kQ2FyZCk7XHJcbiAgICAgICAgc2VsZi5zYXZlUm91bmRQb2tlcihzZW5kQ2FyZCwgY3VycmVudFBsYXllcisxLCAwKTtcclxuICAgICAgICByZXR1cm4gc2VuZENhcmQ7XHJcbiAgICB9LFxyXG4gICAgLyoqXHJcbiAgICAgKiDnjqnlrrblh7rniYwg5Ye654mM5oyJ6ZKu5Y+v5Lul54K55Ye7XHJcbiAgICAgKiBAcGFyYW0gZ2FtZUhvc3RcclxuICAgICAqIEBwYXJhbSByb3VuZEhvc3RcclxuICAgICAqIEBwYXJhbSBzZW5kQXJyYXlcclxuICAgICAqIEBwYXJhbSBjdXJyZW50UGxheWVyXHJcbiAgICAgKi9cclxuICAgIG9uVXNlclBsYXlDYWxsQmFjazooZ2FtZUhvc3QsIHJvdW5kSG9zdCwgc2VuZEFycmF5LCBjdXJyZW50UGxheWVyKT0+e1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwib25pb25cIixcIuWbnuiwg+WIsHVzZXJcIitzZW5kQXJyYXkpO1xyXG4gICAgfSxcclxuXHJcbiAgICByb3VuZE92ZXJDYWxsQmFjazood2lubmVyUG9zaXRpb24sc3VtU29jZXIpPT57XHJcbiAgICAgICAgc2V0VGltZW91dCgoKT0+e1xyXG4gICAgICAgICAgICBQb2tlclV0aWwuZGVzdG9yeUFycmF5KHNlbGYucm91bmRQb2tlcik7XHJcbiAgICAgICAgICAgIHNlbGYuc2NvcmU9c3VtU29jZXIrc2VsZi5zY29yZTtcclxuICAgICAgICAgICAgc2VsZi5yb3VuZEhvc3Q9bnVsbDtcclxuICAgICAgICAgICAgc2VsZi5hcHBlbmRMb2cod2lubmVyUG9zaXRpb24rXCLlpKcs5o2e5YiGXCIrc3VtU29jZXIpO1xyXG4gICAgICAgICAgICAvLyBzZWxmLmxvZ2ljSGVscGVyLnJvdW5kUHJvZ3JhbShzZWxmLm9uVXNlclBsYXlDYWxsQmFjayxzZWxmLm9uUm91bmRDYWxsQmFjayxcclxuICAgICAgICAgICAgLy8gICAgIHNlbGYucm91bmRPdmVyQ2FsbEJhY2ssd2lubmVyUG9zaXRpb24sc2VsZi5nYW1lSG9zdCxbXSk7XHJcbiAgICAgICAgfSwxMDAwKTtcclxuICAgICAgICBcclxuICAgIH0sXHJcblxyXG5cclxuICAgIHJlZnJlc2hDYWxsYmFjazogZnVuY3Rpb24gKGJ1dHRvbikge1xyXG4gICAgICAgIHRoaXMucHVibGlzaFBva2VycygpO1xyXG4gICAgfSxcclxuICAgIGJhY2tDbGljazpmdW5jdGlvbihidXR0b24pe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwib25pb25cIixcImJhY2tDbGlja1wiKTtcclxuICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJvdGhlclwiKTtcclxuICAgIH0sXHJcbiAgICBzZW5kQ2FsbGJhY2s6IGZ1bmN0aW9uIChidXR0b24pIHtcclxuICAgICAgICAvLyBsZXQgc2VuZEFycmF5ID0gW107XHJcbiAgICAgICAgbGV0IHdpbGxTZW5kQ2FyZD1udWxsO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJDb250cm9sTm9kZUFycmF5Lmxlbmd0aDtpKyspIHtcclxuICAgICAgICAgICAgLy/liKTmlq3mmK/lkKblj6/lh7pcclxuICAgICAgICAgICAgbGV0IG5vZGUgPSB0aGlzLnBsYXllckNvbnRyb2xOb2RlQXJyYXlbaV0uZ2V0Q29tcG9uZW50KCdDYXJkJyk7XHJcbiAgICAgICAgICAgIGlmIChub2RlLmlzQ2hlY2spIHtcclxuICAgICAgICAgICAgICAgIGlmKHdpbGxTZW5kQ2FyZCYmIUFycmF5LmlzQXJyYXkod2lsbFNlbmRDYXJkKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgd2lsbFNlbmRDYXJkPVtdO1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbGxTZW5kQ2FyZC5wdXNoKG5vZGUucGljTnVtKTtcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbGxTZW5kQ2FyZD1ub2RlLnBpY051bTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIHRoaXMucGxheWVyQ29udHJvbE5vZGVBcnJheVtpXS5kZXN0cm95KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBtZXNzYWdlPXRoaXMubG9naWNIZWxwZXIuY2hlY2tVc2VyQ2FuU2VuZCh0aGlzLmdhbWVIb3N0LHRoaXMucm91bmRIb3N0LHRoaXMucG9rZXJQbGF5ZXJbMF0sd2lsbFNlbmRDYXJkKTtcclxuICAgICAgICBpZighbWVzc2FnZSl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib25pb25cIixcIuS4jeiDveWHulwiK21lc3NhZ2UpO1xyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8v5Ye654mMIOenu+mZpOW5tua3u+WKoFxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJDb250cm9sTm9kZUFycmF5Lmxlbmd0aDspIHtcclxuICAgICAgICAgICAgLy/liKTmlq3mmK/lkKblj6/lh7pcclxuICAgICAgICAgICAgbGV0IG5vZGUgPSB0aGlzLnBsYXllckNvbnRyb2xOb2RlQXJyYXlbaV0uZ2V0Q29tcG9uZW50KCdDYXJkJyk7XHJcbiAgICAgICAgICAgIGlmIChub2RlLmlzQ2hlY2spIHtcclxuICAgICAgICAgICAgICAgIC8vIHdpbGxTZW5kQXJyYXkucHVzaChub2RlLnBpY051bSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNhdmVSb3VuZFBva2VyKG5vZGUucGljTnVtLCAxLCBpICogdGhpcy5jYXJkV2lkdGgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXJDb250cm9sTm9kZUFycmF5W2ldLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxheWVyQ29udHJvbE5vZGVBcnJheS5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gdGhpcy5wbGF5ZXJDb250cm9sTm9kZUFycmF5W2ldLmRlc3Ryb3koKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoIXRoaXMuc2VuZEFycmF5KXtcclxuICAgICAgICAgICAgdGhpcy5zZW5kQXJyYXk9W107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2VuZEFycmF5LnB1c2god2lsbFNlbmRDYXJkKTtcclxuICAgICAgICB0aGlzLmxvZ2ljSGVscGVyLnJvdW5kUHJvZ3JhbSh0aGlzLm9uVXNlclBsYXlDYWxsQmFjayx0aGlzLm9uUm91bmRDYWxsQmFjayxcclxuICAgICAgICAgICAgdGhpcy5yb3VuZE92ZXJDYWxsQmFjaywwLHRoaXMuZ2FtZUhvc3QsdGhpcy5zZW5kQXJyYXkpO1xyXG4gICAgICAgXHJcbiAgICB9LFxyXG4gICAgLy/kv53lrZjlh7rniYwgIDEgMiAzIDQg6aG65pe26ZKI5L2NXHJcbiAgICBzYXZlUm91bmRQb2tlcjogZnVuY3Rpb24gKHBpY051bSwgaW5kZXgsIG9mZnNldCkge1xyXG4gICAgICAgIHZhciBuZXdTdGFyID0gY2MuaW5zdGFudGlhdGUodGhpcy5jYXJkUHJlZmFiKTtcclxuICAgICAgICAvLyBuZXdTdGFyLnNldFBpY051bShcImlcIitpKTtcclxuICAgICAgICBuZXdTdGFyLmdldENvbXBvbmVudCgnQ2FyZCcpLnBpY051bSA9IHBpY051bTtcclxuICAgICAgICBuZXdTdGFyLnNjYWxlWCA9IDAuNTtcclxuICAgICAgICBuZXdTdGFyLnNjYWxlWSA9IDAuNTtcclxuICAgICAgICB0aGlzLnJvdW5kUG9rZXIucHVzaChuZXdTdGFyKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIm9uaW9uXCIsXCLkv53lrZjlh7rniYxcIitwaWNOdW0rXCJpbmRleFwiK2luZGV4KTtcclxuICAgICAgICAvLyB0aGlzLm5vZGUuYWRkQ2hpbGQobmV3U3Rhcik7XHJcbiAgICAgICAgLy8gbGV0IGhlaWdodCA9IHRoaXMuZ3JvdW5kLmhlaWdodCAvIDIgKiAtMTtcclxuICAgICAgICBzd2l0Y2ggKGluZGV4KSB7XHJcbiAgICAgICAgICAgIGNhc2UgMTogdGhpcy5sYXlvdXRCb3R0b20ubm9kZS5hZGRDaGlsZChuZXdTdGFyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9naWNIZWxwZXIucmVtb3ZlUG9rZXJGcm9tQXJyYXkodGhpcy5nYW1lSG9zdCwgcGljTnVtLCB0aGlzLnBva2VyUGxheWVyWzBdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDI6IHRoaXMubGF5b3V0TGVmdC5ub2RlLmFkZENoaWxkKG5ld1N0YXIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dpY0hlbHBlci5yZW1vdmVQb2tlckZyb21BcnJheSh0aGlzLmdhbWVIb3N0LCBwaWNOdW0sIHRoaXMucG9rZXJQbGF5ZXJbMV0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMzogdGhpcy5sYXlvdXRUb3Aubm9kZS5hZGRDaGlsZChuZXdTdGFyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9naWNIZWxwZXIucmVtb3ZlUG9rZXJGcm9tQXJyYXkodGhpcy5nYW1lSG9zdCwgcGljTnVtLCB0aGlzLnBva2VyUGxheWVyWzJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDQ6IHRoaXMubGF5b3V0UmlnaHQubm9kZS5hZGRDaGlsZChuZXdTdGFyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9naWNIZWxwZXIucmVtb3ZlUG9rZXJGcm9tQXJyYXkodGhpcy5nYW1lSG9zdCwgcGljTnVtLCB0aGlzLnBva2VyUGxheWVyWzNdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBuZXdTdGFyLnNldFBvc2l0aW9uKGNjLnYyKC0xNTAgKyB0aGlzLnN0YXJ0Q2FyZFBvc3Rpb24gKyBvZmZzZXQsIGhlaWdodCkpO1xyXG4gICAgfSxcclxuICAgIHNwYXduTmV3U3RhcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vIOS9v+eUqOe7meWumueahOaooeadv+WcqOWcuuaZr+S4reeUn+aIkOS4gOS4quaWsOiKgueCuVxyXG4gICAgICAgIHZhciBuZXdTdGFyID0gY2MuaW5zdGFudGlhdGUodGhpcy5zdGFyUHJlZmFiKTtcclxuICAgICAgICAvLyDlsIbmlrDlop7nmoToioLngrnmt7vliqDliLAgQ2FudmFzIOiKgueCueS4i+mdolxyXG4gICAgICAgIHRoaXMubm9kZS5hZGRDaGlsZChuZXdTdGFyKTtcclxuICAgICAgICAvLyDkuLrmmJ/mmJ/orr7nva7kuIDkuKrpmo/mnLrkvY3nva5cclxuICAgICAgICBuZXdTdGFyLnNldFBvc2l0aW9uKHRoaXMuZ2V0TmV3U3RhclBvc2l0aW9uKCkpO1xyXG4gICAgICAgIC8vIOWcqOaYn+aYn+e7hOS7tuS4iuaaguWtmCBHYW1lIOWvueixoeeahOW8leeUqFxyXG4gICAgICAgIG5ld1N0YXIuZ2V0Q29tcG9uZW50KCdTdGFyJykuZ2FtZSA9IHRoaXM7XHJcbiAgICAgICAgLy8g6YeN572u6K6h5pe25Zmo77yM5qC55o2u5raI5aSx5pe26Ze06IyD5Zu06ZqP5py65Y+W5LiA5Liq5YC8XHJcbiAgICAgICAgdGhpcy5zdGFyRHVyYXRpb24gPSB0aGlzLm1pblN0YXJEdXJhdGlvbiArIE1hdGgucmFuZG9tKCkgKiAodGhpcy5tYXhTdGFyRHVyYXRpb24gLSB0aGlzLm1pblN0YXJEdXJhdGlvbik7XHJcbiAgICAgICAgdGhpcy50aW1lciA9IDA7XHJcbiAgICB9LFxyXG4gICAgLyoqXHJcbiAgICAgKiDnp7vpmaTml6fnmoToioLngrlcclxuICAgICAqIOa3u+WKoOaWsOiKgueCuVxyXG4gICAgICovXHJcbiAgICBzcGF3bkJvdHRvbUNhcmQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5wbGF5ZXJDb250cm9sTm9kZUFycmF5Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgbGV0IGRlc3RvcnlOb2RlID0gdGhpcy5wbGF5ZXJDb250cm9sTm9kZUFycmF5O1xyXG4gICAgICAgICAgICBQb2tlclV0aWwuZGVzdG9yeUFycmF5KGRlc3RvcnlOb2RlKTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXJDb250cm9sTm9kZUFycmF5ID0gW107XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZUJvdHRvbUNhcmQoKVxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiB0eXBlMUFycmF5OnR5cGUxQXJyYXksXHJcbiAgICAgICAgICAgIHR5cGUyQXJyYXk6dHlwZTJBcnJheSxcclxuICAgICAgICAgICAgdHlwZTNBcnJheTp0eXBlM0FycmF5LFxyXG4gICAgICAgICAgICB0eXBlNEFycmF5OnR5cGU0QXJyYXksXHJcbiAgICAgICAgICAgIGhvc3RBcnJheTpob3N0QXJyYXksXHJcbiAgICAgICAgICAgIHRvdGFsOnRvdGFsXHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZUJvdHRvbUNhcmQ6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgbGV0IHN0YXJ0UG9zaXRpb24gPSAwO1xyXG4gICAgICAgIGxldCB1c2VyT2JqID0gdGhpcy5wb2tlclBsYXllclswXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHVzZXJPYmoudG90YWwubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgLy8g5L2/55So57uZ5a6a55qE5qih5p2/5Zyo5Zy65pmv5Lit55Sf5oiQ5LiA5Liq5paw6IqC54K5XHJcbiAgICAgICAgICAgIHZhciBuZXdTdGFyID0gY2MuaW5zdGFudGlhdGUodGhpcy5jYXJkUHJlZmFiKTtcclxuICAgICAgICAgICAgLy8gbmV3U3Rhci5zZXRQaWNOdW0oXCJpXCIraSk7XHJcbiAgICAgICAgICAgIG5ld1N0YXIuZ2V0Q29tcG9uZW50KCdDYXJkJykucGljTnVtID0gdXNlck9iai50b3RhbFtpXTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXJDb250cm9sTm9kZUFycmF5LnB1c2gobmV3U3Rhcik7XHJcbiAgICAgICAgICAgIC8vIHRoaXMubm9kZS5hZGRDaGlsZChuZXdTdGFyKTtcclxuICAgICAgICAgICAgdGhpcy5sYXlvdXRDb250YWluZXIubm9kZS5hZGRDaGlsZChuZXdTdGFyKTtcclxuICAgICAgICAgICAgbGV0IGhlaWdodCA9IHRoaXMuZ3JvdW5kLmhlaWdodCAvIDIgKiAtMTtcclxuICAgICAgICAgICAgc3RhcnRQb3NpdGlvbiA9IGkgKiB0aGlzLmNhcmRXaWR0aDtcclxuICAgICAgICAgICAgaWYgKGkgPiAxMykge1xyXG4gICAgICAgICAgICAgICAgaGVpZ2h0ID0gaGVpZ2h0IC0gMTUwXHJcbiAgICAgICAgICAgICAgICBzdGFydFBvc2l0aW9uID0gKGkgLSAxMykgKiB0aGlzLmNhcmRXaWR0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBuZXdTdGFyLnNldFBvc2l0aW9uKGNjLnYyKC0yMDAgKyB0aGlzLnN0YXJ0Q2FyZFBvc3Rpb24gKyBzdGFydFBvc2l0aW9uLCBoZWlnaHQpKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICBnZXROZXdTdGFyUG9zaXRpb246IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgcmFuZFggPSAwO1xyXG4gICAgICAgIC8vIOagueaNruWcsOW5s+mdouS9jee9ruWSjOS4u+inkui3s+i3g+mrmOW6pu+8jOmaj+acuuW+l+WIsOS4gOS4quaYn+aYn+eahCB5IOWdkOagh1xyXG4gICAgICAgIHZhciByYW5kWSA9IHRoaXMuZ3JvdW5kWSArIE1hdGgucmFuZG9tKCkgKiB0aGlzLnBsYXllci5nZXRDb21wb25lbnQoJ1BsYXllcicpLmp1bXBIZWlnaHQgKyA1MDtcclxuICAgICAgICAvLyDmoLnmja7lsY/luZXlrr3luqbvvIzpmo/mnLrlvpfliLDkuIDkuKrmmJ/mmJ8geCDlnZDmoIdcclxuICAgICAgICB2YXIgbWF4WCA9IHRoaXMubm9kZS53aWR0aCAvIDI7XHJcbiAgICAgICAgcmFuZFggPSAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiAyICogbWF4WDtcclxuICAgICAgICAvLyDov5Tlm57mmJ/mmJ/lnZDmoIdcclxuICAgICAgICByZXR1cm4gY2MudjIocmFuZFgsIHJhbmRZKTtcclxuICAgIH0sXHJcbiAgICBnZXRDYXJkQm90dG9tUG9zaXRpb246IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgcmFuZFggPSB0aGlzLmN1cnJlbnRDYXJkUG9zaXRpb247XHJcbiAgICAgICAgdmFyIHJhbmRZID0gMDtcclxuICAgICAgICB0aGlzLmN1cnJlbnRDYXJkUG9zaXRpb24gPSB0aGlzLmN1cnJlbnRDYXJkUG9zaXRpb24gKyB0aGlzLmNhcmRXaWR0aDtcclxuICAgICAgICByZXR1cm4gY2MudjIocmFuZFgsIHJhbmRZKTtcclxuICAgIH0sXHJcblxyXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcclxuICAgICAgICAvLyDmr4/luKfmm7TmlrDorqHml7blmajvvIzotoXov4fpmZDluqbov5jmsqHmnInnlJ/miJDmlrDnmoTmmJ/mmJ9cclxuICAgICAgICAvLyDlsLHkvJrosIPnlKjmuLjmiI/lpLHotKXpgLvovpFcclxuICAgICAgICAvLyBpZiAodGhpcy50aW1lciA+IHRoaXMuc3RhckR1cmF0aW9uKSB7XHJcbiAgICAgICAgLy8gICAgIHRoaXMuZ2FtZU92ZXIoKTtcclxuICAgICAgICAvLyAgICAgdGhpcy5lbmFibGVkID0gZmFsc2U7ICAgLy8gZGlzYWJsZSBnYW1lT3ZlciBsb2dpYyB0byBhdm9pZCBsb2FkIHNjZW5lIHJlcGVhdGVkbHlcclxuICAgICAgICAvLyAgICAgcmV0dXJuO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICAvLyB0aGlzLnRpbWVyICs9IGR0O1xyXG4gICAgfSxcclxuXHJcbiAgICBnYWluU2NvcmU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnNjb3JlICs9IDE7XHJcbiAgICAgICAgLy8g5pu05pawIHNjb3JlRGlzcGxheSBMYWJlbCDnmoTmloflrZdcclxuICAgICAgICB0aGlzLnNjb3JlRGlzcGxheS5zdHJpbmcgPSAnU2NvcmU6ICcgKyB0aGlzLnNjb3JlO1xyXG4gICAgICAgIC8vIOaSreaUvuW+l+WIhumfs+aViFxyXG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGhpcy5zY29yZUF1ZGlvLCBmYWxzZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGdhbWVPdmVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIuc3RvcEFsbEFjdGlvbnMoKTsgLy/lgZzmraIgcGxheWVyIOiKgueCueeahOi3s+i3g+WKqOS9nFxyXG4gICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZSgnZ2FtZScpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICog5oqK54mM5Y+R57uZ5Zub5a62XHJcbiAgICAqL1xyXG4gICAgcHVibGlzaFBva2VyczogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMucG9rZXJQbGF5ZXIgPSBbXTtcclxuICAgICAgICB0aGlzLmdhbWVIb3N0ID0gbnVsbDtcclxuICAgICAgICBsZXQgcG9rZXJBcnJheSA9IHRoaXMuY2FyZEFycmF5LnNsaWNlKDApO1xyXG4gICAgICAgIGxldCBob3N0ID0gcGFyc2VJbnQoTWF0aC5yYW5kb20oKSAqIDQpOy8v6ZqP5py65Li754mM6Iqx6ImyXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IHBsYXllclBva2VyQXJyYXkgPSBbXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAyNzsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcG9rZXJOdW0gPSBNYXRoLnJhbmRvbSgpICogcG9rZXJBcnJheS5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICBwb2tlck51bSA9IHBhcnNlSW50KHBva2VyTnVtKTtcclxuICAgICAgICAgICAgICAgIC8v5o+S5YWl5omL54mM5LitXHJcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSBwb2tlckFycmF5LnNwbGljZShwb2tlck51bSwgMSk7XHJcbiAgICAgICAgICAgICAgICBwbGF5ZXJQb2tlckFycmF5LnB1c2godmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2FtZUhvc3QgPT0gbnVsbCkgey8v6ZqP5py65Yiw5Li75ZCO77yM56ys5LiA5byg5Li754mM5Lqu5Ye6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGhvc3QgPT0gUG9rZXJVdGlsLnF1YXJ5UG9rZXJUeXBlVmFsdWUodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZUhvc3QgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHBlbmRMb2coXCLmnKzova7muLjmiI8s5Li754mMXCIgKyBQb2tlclV0aWwucXVhcnlQb2tlclZhbHVlKHZhbHVlKSArIFwi5ZyoXCIgKyB0aGlzLmV4cGFuZFBsYXllcihpKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBwbGF5ZXJPYmogPSBQb2tlclV0aWwuc29ydFBva2Vycyhob3N0LCBwbGF5ZXJQb2tlckFycmF5KTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJvbmlvbj09PT1cIiwgSlNPTi5zdHJpbmdpZnkocGxheWVyT2JqKSk7XHJcbiAgICAgICAgICAgIHRoaXMucG9rZXJQbGF5ZXIucHVzaChwbGF5ZXJPYmopO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNwYXduQm90dG9tQ2FyZCgpO1xyXG5cclxuICAgIH0sXHJcbiAgICBleHBhbmRQbGF5ZXI6IGZ1bmN0aW9uIChsb2NhdGlvbikge1xyXG4gICAgICAgIHN3aXRjaCAobG9jYXRpb24pIHtcclxuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gXCLoh6rlt7FcIlxyXG4gICAgICAgICAgICBjYXNlIDE6IHJldHVybiBcIuS4i+WutlwiXHJcbiAgICAgICAgICAgIGNhc2UgMjogcmV0dXJuIFwi5a+55a62XCJcclxuICAgICAgICAgICAgY2FzZSAzOiByZXR1cm4gXCLkuIrlrrZcIlxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG4gICAgYXBwZW5kTG9nOiBmdW5jdGlvbiAoc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5wbGF5TG9nID0gdGhpcy5wbGF5TG9nICsgXCJcXG5cIiArIHN0cmluZztcclxuICAgICAgICB0aGlzLmxvZ0xhYmVsLnN0cmluZyA9IHRoaXMucGxheUxvZztcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG59KTtcclxuIl19