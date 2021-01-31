
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
    console.log("onion", "roundHost" + roundHost + "/" + sendArray);

    if (!roundHost || sendArray.length == 0) {
      var sendCard = self.logicHelper.sendAIHostCard(gameHost, self.pokerPlayer[currentPlayer]);
      self.saveRoundPoker(sendCard, currentPlayer + 1, 0);
      return sendCard;
    } else {
      self.roundHost = roundHost;
      self.sendArray = sendArray;
      console.log("onion", "轮次回调" + sendArray);

      var _sendCard = self.logicHelper.sendAIFollowCard(self.gameHost, roundHost, sendArray, self.pokerPlayer[currentPlayer]);

      console.log("onion", "轮次出牌" + _sendCard); // sendArray.push(sendCard);

      self.saveRoundPoker(_sendCard, currentPlayer + 1, 0);
      return _sendCard;
    }
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
      self.appendLog(winnerPosition + "大,捞分" + sumSocer);
      self.logicHelper.roundProgram(self.onUserPlayCallBack, self.onRoundCallBack, self.roundOverCallBack, winnerPosition, self.gameHost, []);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcR2FtZS5qcyJdLCJuYW1lcyI6WyJQb2tlclV0aWwiLCJyZXF1aXJlIiwiQUlIZWxwZXIiLCJzZWxmIiwiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJzdGFyUHJlZmFiIiwidHlwZSIsIlByZWZhYiIsImNhcmRQcmVmYWIiLCJtYXhTdGFyRHVyYXRpb24iLCJtaW5TdGFyRHVyYXRpb24iLCJjdXJyZW50Q2FyZFBvc2l0aW9uIiwic3RhcnRDYXJkUG9zdGlvbiIsImNhcmRXaWR0aCIsImxvZ2ljSGVscGVyIiwiY2FyZEFycmF5IiwiU3RyaW5nIiwicG9rZXJQbGF5ZXIiLCJyb3VuZFBva2VyIiwic2VuZEFycmF5IiwicGxheWVyQ29udHJvbE5vZGVBcnJheSIsInJlZnJlc2hCdXR0b24iLCJCdXR0b24iLCJzZW5kQnV0dG9uIiwiYmFja0J1dHRvbiIsImN1cnJlbnRXaW5uZXIiLCJnYW1lSG9zdCIsImxheW91dENvbnRhaW5lciIsIkxheW91dCIsImxheW91dEJvdHRvbSIsImxheW91dFRvcCIsImxheW91dExlZnQiLCJsYXlvdXRSaWdodCIsImxvZ0xhYmVsIiwiTGFiZWwiLCJwbGF5TG9nIiwiZ3JvdW5kIiwiTm9kZSIsInBsYXllciIsInNjb3JlRGlzcGxheSIsInNjb3JlQXVkaW8iLCJBdWRpb0NsaXAiLCJvbkxvYWQiLCJncm91bmRZIiwieSIsImhlaWdodCIsInRpbWVyIiwic3RhckR1cmF0aW9uIiwiaSIsInByZSIsImoiLCJzdHIiLCJwdXNoIiwibm9kZSIsIm9uIiwicmVmcmVzaENhbGxiYWNrIiwic2VuZENhbGxiYWNrIiwiYmFja0NsaWNrIiwicHVibGlzaFBva2VycyIsInNjb3JlIiwib25Sb3VuZENhbGxCYWNrIiwiYmluZCIsInJvdW5kUHJvZ3JhbSIsIm9uVXNlclBsYXlDYWxsQmFjayIsInJvdW5kT3ZlckNhbGxCYWNrIiwicm91bmRIb3N0IiwiY3VycmVudFBsYXllciIsImNvbnNvbGUiLCJsb2ciLCJsZW5ndGgiLCJzZW5kQ2FyZCIsInNlbmRBSUhvc3RDYXJkIiwic2F2ZVJvdW5kUG9rZXIiLCJzZW5kQUlGb2xsb3dDYXJkIiwid2lubmVyUG9zaXRpb24iLCJzdW1Tb2NlciIsInNldFRpbWVvdXQiLCJkZXN0b3J5QXJyYXkiLCJhcHBlbmRMb2ciLCJidXR0b24iLCJkaXJlY3RvciIsImxvYWRTY2VuZSIsIndpbGxTZW5kQ2FyZCIsImdldENvbXBvbmVudCIsImlzQ2hlY2siLCJBcnJheSIsImlzQXJyYXkiLCJwaWNOdW0iLCJtZXNzYWdlIiwiY2hlY2tVc2VyQ2FuU2VuZCIsImRlc3Ryb3kiLCJzcGxpY2UiLCJpbmRleCIsIm9mZnNldCIsIm5ld1N0YXIiLCJpbnN0YW50aWF0ZSIsInNjYWxlWCIsInNjYWxlWSIsImFkZENoaWxkIiwicmVtb3ZlUG9rZXJGcm9tQXJyYXkiLCJzcGF3bk5ld1N0YXIiLCJzZXRQb3NpdGlvbiIsImdldE5ld1N0YXJQb3NpdGlvbiIsImdhbWUiLCJNYXRoIiwicmFuZG9tIiwic3Bhd25Cb3R0b21DYXJkIiwiZGVzdG9yeU5vZGUiLCJjcmVhdGVCb3R0b21DYXJkIiwic3RhcnRQb3NpdGlvbiIsInVzZXJPYmoiLCJ0b3RhbCIsInJhbmRYIiwicmFuZFkiLCJqdW1wSGVpZ2h0IiwibWF4WCIsIndpZHRoIiwidjIiLCJnZXRDYXJkQm90dG9tUG9zaXRpb24iLCJ1cGRhdGUiLCJkdCIsImdhaW5TY29yZSIsInN0cmluZyIsImF1ZGlvRW5naW5lIiwicGxheUVmZmVjdCIsImdhbWVPdmVyIiwic3RvcEFsbEFjdGlvbnMiLCJwb2tlckFycmF5Iiwic2xpY2UiLCJob3N0IiwicGFyc2VJbnQiLCJwbGF5ZXJQb2tlckFycmF5IiwicG9rZXJOdW0iLCJ2YWx1ZSIsInF1YXJ5UG9rZXJUeXBlVmFsdWUiLCJxdWFyeVBva2VyVmFsdWUiLCJleHBhbmRQbGF5ZXIiLCJwbGF5ZXJPYmoiLCJzb3J0UG9rZXJzIiwiSlNPTiIsInN0cmluZ2lmeSIsImxvY2F0aW9uIl0s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QWlCbUMsSUFBakIsQ0FBc0JxRixTQUF0QjtBQUNIOztBQUNELFNBQUsvQixlQUFMO0FBRUgsR0EzWUk7QUE0WUw4QixFQUFBQSxZQUFZLEVBQUUsc0JBQVVLLFFBQVYsRUFBb0I7QUFDOUIsWUFBUUEsUUFBUjtBQUNJLFdBQUssQ0FBTDtBQUFRLGVBQU8sSUFBUDs7QUFDUixXQUFLLENBQUw7QUFBUSxlQUFPLElBQVA7O0FBQ1IsV0FBSyxDQUFMO0FBQVEsZUFBTyxJQUFQOztBQUNSLFdBQUssQ0FBTDtBQUFRLGVBQU8sSUFBUDtBQUpaO0FBT0gsR0FwWkk7QUFxWkwvRCxFQUFBQSxTQUFTLEVBQUUsbUJBQVU0QyxNQUFWLEVBQWtCO0FBQ3pCLFNBQUt2RixPQUFMLEdBQWUsS0FBS0EsT0FBTCxHQUFlLElBQWYsR0FBc0J1RixNQUFyQztBQUNBLFNBQUt6RixRQUFMLENBQWN5RixNQUFkLEdBQXVCLEtBQUt2RixPQUE1QjtBQUNIO0FBeFpJLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5sZXQgUG9rZXJVdGlsID0gcmVxdWlyZShcIlBva2VyVXRpbFwiKTtcclxubGV0IEFJSGVscGVyID0gcmVxdWlyZShcIkFJSGVscGVyXCIpO1xyXG5sZXQgc2VsZjtcclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICAvLyDov5nkuKrlsZ7mgKflvJXnlKjkuobmmJ/mmJ/pooTliLbotYTmupBcclxuICAgICAgICBzdGFyUHJlZmFiOiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2FyZFByZWZhYjoge1xyXG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxyXG4gICAgICAgICAgICB0eXBlOiBjYy5QcmVmYWJcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIOaYn+aYn+S6p+eUn+WQjua2iOWkseaXtumXtOeahOmaj+acuuiMg+WbtFxyXG4gICAgICAgIG1heFN0YXJEdXJhdGlvbjogMCxcclxuICAgICAgICBtaW5TdGFyRHVyYXRpb246IDAsXHJcbiAgICAgICAgY3VycmVudENhcmRQb3NpdGlvbjogMCxcclxuICAgICAgICBzdGFydENhcmRQb3N0aW9uOiAwLFxyXG4gICAgICAgIGNhcmRXaWR0aDogODAsXHJcbiAgICAgICAgbG9naWNIZWxwZXI6IG51bGwsXHJcbiAgICAgICAgY2FyZEFycmF5OiBbY2MuU3RyaW5nXSxcclxuICAgICAgICAvL+WIneWni+eJjOaVsOe7hCDpgIbml7bpkogg5Li76KeS5piv56ys5LiA5Liq5pWw57uEXHJcbiAgICAgICAgcG9rZXJQbGF5ZXI6IFtdLFxyXG4gICAgICAgIC8v5b2T5YmN6L2u5qyh5Ye654mM6IqC54K5LFxyXG4gICAgICAgIHJvdW5kUG9rZXI6IFtdLFxyXG4gICAgICAgIHNlbmRBcnJheTpbXSxcclxuICAgICAgICAvL+S4u+inkuW9k+WJjeeJjOiKgueCuVxyXG4gICAgICAgIHBsYXllckNvbnRyb2xOb2RlQXJyYXk6IFtdLFxyXG4gICAgICAgIC8v5rSX54mMXHJcbiAgICAgICAgcmVmcmVzaEJ1dHRvbjoge1xyXG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxyXG4gICAgICAgICAgICB0eXBlOiBjYy5CdXR0b25cclxuICAgICAgICB9LFxyXG4gICAgICAgIC8v5Ye654mMXHJcbiAgICAgICAgc2VuZEJ1dHRvbjoge1xyXG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxyXG4gICAgICAgICAgICB0eXBlOiBjYy5CdXR0b25cclxuICAgICAgICB9LFxyXG4gICAgICAgIC8v5Ye654mMXHJcbiAgICAgICAgYmFja0J1dHRvbjoge1xyXG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxyXG4gICAgICAgICAgICB0eXBlOiBjYy5CdXR0b25cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvL+W9k+WJjeiDnOaWuVxyXG4gICAgICAgIGN1cnJlbnRXaW5uZXI6IDEsXHJcbiAgICAgICAgLy/mnKzova7kuLtcclxuICAgICAgICBnYW1lSG9zdDogXCIxXCIsXHJcbiAgICAgICAgLy/njqnlrrbmi6XmnInniYxcclxuICAgICAgICBsYXlvdXRDb250YWluZXI6IHtcclxuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcclxuICAgICAgICAgICAgdHlwZTogY2MuTGF5b3V0XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvL+eOqeWutuWHuueahOeJjCBcclxuICAgICAgICBsYXlvdXRCb3R0b206IHtcclxuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcclxuICAgICAgICAgICAgdHlwZTogY2MuTGF5b3V0XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvL+WvueWutuWHuueJjCDnrKzkuInkvY1cclxuICAgICAgICBsYXlvdXRUb3A6IHtcclxuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcclxuICAgICAgICAgICAgdHlwZTogY2MuTGF5b3V0XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvL+S4i+WutuWHuueJjCDlt6bmiYvnrKzkuozkvY1cclxuICAgICAgICBsYXlvdXRMZWZ0OiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6IGNjLkxheW91dFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy/kuIrlrrblh7rniYzvvIzlj7PmiYvnrKzlm5vkvY1cclxuICAgICAgICBsYXlvdXRSaWdodDoge1xyXG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxyXG4gICAgICAgICAgICB0eXBlOiBjYy5MYXlvdXRcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8v5oiY5oqlXHJcbiAgICAgICAgbG9nTGFiZWw6IHtcclxuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcclxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHBsYXlMb2c6IFwi5ri45oiP5byA5aeLXCIsXHJcbiAgICAgICAgLy8g5Zyw6Z2i6IqC54K577yM55So5LqO56Gu5a6a5pif5pif55Sf5oiQ55qE6auY5bqmXHJcbiAgICAgICAgZ3JvdW5kOiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIHBsYXllciDoioLngrnvvIznlKjkuo7ojrflj5bkuLvop5LlvLnot7PnmoTpq5jluqbvvIzlkozmjqfliLbkuLvop5LooYzliqjlvIDlhbNcclxuICAgICAgICBwbGF5ZXI6IHtcclxuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcclxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8gc2NvcmUgbGFiZWwg55qE5byV55SoXHJcbiAgICAgICAgc2NvcmVEaXNwbGF5OiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyDlvpfliIbpn7PmlYjotYTmupBcclxuICAgICAgICBzY29yZUF1ZGlvOiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6IGNjLkF1ZGlvQ2xpcFxyXG4gICAgICAgIH0sXHJcbiAgICB9LFxyXG5cclxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHNlbGY9dGhpcztcclxuICAgICAgICAvLyDojrflj5blnLDlubPpnaLnmoQgeSDovbTlnZDmoIdcclxuICAgICAgICB0aGlzLmdyb3VuZFkgPSB0aGlzLmdyb3VuZC55ICsgdGhpcy5ncm91bmQuaGVpZ2h0IC8gMjtcclxuICAgICAgICAvLyDliJ3lp4vljJborqHml7blmahcclxuICAgICAgICB0aGlzLnRpbWVyID0gMDtcclxuICAgICAgICB0aGlzLnN0YXJEdXJhdGlvbiA9IDA7XHJcbiAgICAgICAgdGhpcy5sb2dpY0hlbHBlciA9IG5ldyBBSUhlbHBlcigpO1xyXG4gICAgICAgIC8v5Yib5bu65Zu+54mH6LWE5rqQXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMzsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBwcmUgPSAzICsgaTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDE7IGogPCA1OyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBzdHIgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgaWYgKHByZSA8IDEwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RyID0gXCIwXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBzdHIgPSBzdHIgKyBwcmUgKyBqO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYXJkQXJyYXkucHVzaChzdHIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYXJkQXJyYXkucHVzaChzdHIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY2FyZEFycmF5LnB1c2goXCIxNjFcIik7XHJcbiAgICAgICAgdGhpcy5jYXJkQXJyYXkucHVzaChcIjE2MVwiKTtcclxuICAgICAgICB0aGlzLmNhcmRBcnJheS5wdXNoKFwiMTcxXCIpO1xyXG4gICAgICAgIHRoaXMuY2FyZEFycmF5LnB1c2goXCIxNzFcIik7XHJcblxyXG5cclxuICAgICAgICB0aGlzLnJlZnJlc2hCdXR0b24ubm9kZS5vbignY2xpY2snLCB0aGlzLnJlZnJlc2hDYWxsYmFjaywgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5zZW5kQnV0dG9uLm5vZGUub24oJ2NsaWNrJywgdGhpcy5zZW5kQ2FsbGJhY2ssIHRoaXMpO1xyXG4gICAgICAgIHRoaXMuYmFja0J1dHRvbi5ub2RlLm9uKCdjbGljaycsdGhpcy5iYWNrQ2xpY2ssIHRoaXMpXHJcbiAgICAgICAgdGhpcy5wdWJsaXNoUG9rZXJzKCk7XHJcbiAgICAgICAgLy8gdGhpcy5zcGF3bk5ld1N0YXIoKTtcclxuICAgICAgICAvLyDliJ3lp4vljJborqHliIZcclxuICAgICAgICB0aGlzLnNjb3JlID0gMDtcclxuICAgICAgICAvLyB0aGlzLm9uUm91bmRDYWxsQmFjaz10aGlzLm9uUm91bmRDYWxsQmFjay5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMub25Sb3VuZENhbGxCYWNrPXRoaXMub25Sb3VuZENhbGxCYWNrLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5sb2dpY0hlbHBlci5yb3VuZFByb2dyYW0odGhpcy5vblVzZXJQbGF5Q2FsbEJhY2ssdGhpcy5vblJvdW5kQ2FsbEJhY2ssdGhpcy5yb3VuZE92ZXJDYWxsQmFjaywwLHRoaXMuZ2FtZUhvc3QsW10pO1xyXG4gICAgfSxcclxuICAgIC8qKlxyXG4gICAgICog55S16ISR5Ye654mM77yM55u05o6l5riy5p+TXHJcbiAgICAgKiBAcGFyYW0gZ2FtZUhvc3RcclxuICAgICAqIEBwYXJhbSByb3VuZEhvc3RcclxuICAgICAqIEBwYXJhbSBzZW5kQXJyYXlcclxuICAgICAqIEBwYXJhbSBjdXJyZW50UGxheWVyXHJcbiAgICAgKi9cclxuICAgICBvblJvdW5kQ2FsbEJhY2s6KGdhbWVIb3N0LCByb3VuZEhvc3QsIHNlbmRBcnJheSwgY3VycmVudFBsYXllcik9PntcclxuICAgICAgICAgY29uc29sZS5sb2coXCJvbmlvblwiLFwicm91bmRIb3N0XCIrcm91bmRIb3N0K1wiL1wiK3NlbmRBcnJheSk7XHJcbiAgICAgICAgIGlmKCFyb3VuZEhvc3R8fHNlbmRBcnJheS5sZW5ndGg9PTApe1xyXG4gICAgICAgICAgICAgbGV0IHNlbmRDYXJkID0gc2VsZi5sb2dpY0hlbHBlci5zZW5kQUlIb3N0Q2FyZChnYW1lSG9zdCxzZWxmLnBva2VyUGxheWVyW2N1cnJlbnRQbGF5ZXJdKTtcclxuICAgICAgICAgICAgIHNlbGYuc2F2ZVJvdW5kUG9rZXIoc2VuZENhcmQsIGN1cnJlbnRQbGF5ZXIrMSwgMCk7XHJcbiAgICAgICAgICAgICByZXR1cm4gc2VuZENhcmQ7XHJcbiAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgIHNlbGYucm91bmRIb3N0PXJvdW5kSG9zdDtcclxuICAgICAgICAgICAgIHNlbGYuc2VuZEFycmF5PXNlbmRBcnJheTtcclxuICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib25pb25cIixcIui9ruasoeWbnuiwg1wiK3NlbmRBcnJheSk7XHJcbiAgICAgICAgICAgICBsZXQgc2VuZENhcmQ9IHNlbGYubG9naWNIZWxwZXIuc2VuZEFJRm9sbG93Q2FyZChzZWxmLmdhbWVIb3N0LCByb3VuZEhvc3QsIHNlbmRBcnJheSwgc2VsZi5wb2tlclBsYXllcltjdXJyZW50UGxheWVyXSk7XHJcbiAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm9uaW9uXCIsXCLova7mrKHlh7rniYxcIitzZW5kQ2FyZCk7XHJcbiAgICAgICAgICAgICAvLyBzZW5kQXJyYXkucHVzaChzZW5kQ2FyZCk7XHJcbiAgICAgICAgICAgICBzZWxmLnNhdmVSb3VuZFBva2VyKHNlbmRDYXJkLCBjdXJyZW50UGxheWVyKzEsIDApO1xyXG4gICAgICAgICAgICAgcmV0dXJuIHNlbmRDYXJkO1xyXG4gICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgLyoqXHJcbiAgICAgKiDnjqnlrrblh7rniYwg5Ye654mM5oyJ6ZKu5Y+v5Lul54K55Ye7XHJcbiAgICAgKiBAcGFyYW0gZ2FtZUhvc3RcclxuICAgICAqIEBwYXJhbSByb3VuZEhvc3RcclxuICAgICAqIEBwYXJhbSBzZW5kQXJyYXlcclxuICAgICAqIEBwYXJhbSBjdXJyZW50UGxheWVyXHJcbiAgICAgKi9cclxuICAgIG9uVXNlclBsYXlDYWxsQmFjazooZ2FtZUhvc3QsIHJvdW5kSG9zdCwgc2VuZEFycmF5LCBjdXJyZW50UGxheWVyKT0+e1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwib25pb25cIixcIuWbnuiwg+WIsHVzZXJcIitzZW5kQXJyYXkpO1xyXG4gICAgfSxcclxuXHJcbiAgICByb3VuZE92ZXJDYWxsQmFjazood2lubmVyUG9zaXRpb24sc3VtU29jZXIpPT57XHJcbiAgICAgICAgc2V0VGltZW91dCgoKT0+e1xyXG4gICAgICAgICAgICBQb2tlclV0aWwuZGVzdG9yeUFycmF5KHNlbGYucm91bmRQb2tlcik7XHJcbiAgICAgICAgICAgIHNlbGYuc2NvcmU9c3VtU29jZXIrc2VsZi5zY29yZTtcclxuICAgICAgICAgICAgc2VsZi5yb3VuZEhvc3Q9bnVsbDtcclxuICAgICAgICAgICAgc2VsZi5hcHBlbmRMb2cod2lubmVyUG9zaXRpb24rXCLlpKcs5o2e5YiGXCIrc3VtU29jZXIpO1xyXG4gICAgICAgICAgICBzZWxmLmxvZ2ljSGVscGVyLnJvdW5kUHJvZ3JhbShzZWxmLm9uVXNlclBsYXlDYWxsQmFjayxzZWxmLm9uUm91bmRDYWxsQmFjayxcclxuICAgICAgICAgICAgICAgIHNlbGYucm91bmRPdmVyQ2FsbEJhY2ssd2lubmVyUG9zaXRpb24sc2VsZi5nYW1lSG9zdCxbXSk7XHJcbiAgICAgICAgfSwxMDAwKTtcclxuICAgICAgICBcclxuICAgIH0sXHJcblxyXG5cclxuICAgIHJlZnJlc2hDYWxsYmFjazogZnVuY3Rpb24gKGJ1dHRvbikge1xyXG4gICAgICAgIHRoaXMucHVibGlzaFBva2VycygpO1xyXG4gICAgfSxcclxuICAgIGJhY2tDbGljazpmdW5jdGlvbihidXR0b24pe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwib25pb25cIixcImJhY2tDbGlja1wiKTtcclxuICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJvdGhlclwiKTtcclxuICAgIH0sXHJcbiAgICBzZW5kQ2FsbGJhY2s6IGZ1bmN0aW9uIChidXR0b24pIHtcclxuICAgICAgICAvLyBsZXQgc2VuZEFycmF5ID0gW107XHJcbiAgICAgICAgbGV0IHdpbGxTZW5kQ2FyZD1udWxsO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJDb250cm9sTm9kZUFycmF5Lmxlbmd0aDtpKyspIHtcclxuICAgICAgICAgICAgLy/liKTmlq3mmK/lkKblj6/lh7pcclxuICAgICAgICAgICAgbGV0IG5vZGUgPSB0aGlzLnBsYXllckNvbnRyb2xOb2RlQXJyYXlbaV0uZ2V0Q29tcG9uZW50KCdDYXJkJyk7XHJcbiAgICAgICAgICAgIGlmIChub2RlLmlzQ2hlY2spIHtcclxuICAgICAgICAgICAgICAgIGlmKHdpbGxTZW5kQ2FyZCYmIUFycmF5LmlzQXJyYXkod2lsbFNlbmRDYXJkKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgd2lsbFNlbmRDYXJkPVtdO1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbGxTZW5kQ2FyZC5wdXNoKG5vZGUucGljTnVtKTtcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbGxTZW5kQ2FyZD1ub2RlLnBpY051bTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIHRoaXMucGxheWVyQ29udHJvbE5vZGVBcnJheVtpXS5kZXN0cm95KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBtZXNzYWdlPXRoaXMubG9naWNIZWxwZXIuY2hlY2tVc2VyQ2FuU2VuZCh0aGlzLmdhbWVIb3N0LHRoaXMucm91bmRIb3N0LHRoaXMucG9rZXJQbGF5ZXJbMF0sd2lsbFNlbmRDYXJkKTtcclxuICAgICAgICBpZighbWVzc2FnZSl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib25pb25cIixcIuS4jeiDveWHulwiK21lc3NhZ2UpO1xyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8v5Ye654mMIOenu+mZpOW5tua3u+WKoFxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJDb250cm9sTm9kZUFycmF5Lmxlbmd0aDspIHtcclxuICAgICAgICAgICAgLy/liKTmlq3mmK/lkKblj6/lh7pcclxuICAgICAgICAgICAgbGV0IG5vZGUgPSB0aGlzLnBsYXllckNvbnRyb2xOb2RlQXJyYXlbaV0uZ2V0Q29tcG9uZW50KCdDYXJkJyk7XHJcbiAgICAgICAgICAgIGlmIChub2RlLmlzQ2hlY2spIHtcclxuICAgICAgICAgICAgICAgIC8vIHdpbGxTZW5kQXJyYXkucHVzaChub2RlLnBpY051bSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNhdmVSb3VuZFBva2VyKG5vZGUucGljTnVtLCAxLCBpICogdGhpcy5jYXJkV2lkdGgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXJDb250cm9sTm9kZUFycmF5W2ldLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxheWVyQ29udHJvbE5vZGVBcnJheS5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gdGhpcy5wbGF5ZXJDb250cm9sTm9kZUFycmF5W2ldLmRlc3Ryb3koKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoIXRoaXMuc2VuZEFycmF5KXtcclxuICAgICAgICAgICAgdGhpcy5zZW5kQXJyYXk9W107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2VuZEFycmF5LnB1c2god2lsbFNlbmRDYXJkKTtcclxuICAgICAgICB0aGlzLmxvZ2ljSGVscGVyLnJvdW5kUHJvZ3JhbSh0aGlzLm9uVXNlclBsYXlDYWxsQmFjayx0aGlzLm9uUm91bmRDYWxsQmFjayxcclxuICAgICAgICAgICAgdGhpcy5yb3VuZE92ZXJDYWxsQmFjaywwLHRoaXMuZ2FtZUhvc3QsdGhpcy5zZW5kQXJyYXkpO1xyXG4gICAgICAgXHJcbiAgICB9LFxyXG4gICAgLy/kv53lrZjlh7rniYwgIDEgMiAzIDQg6aG65pe26ZKI5L2NXHJcbiAgICBzYXZlUm91bmRQb2tlcjogZnVuY3Rpb24gKHBpY051bSwgaW5kZXgsIG9mZnNldCkge1xyXG4gICAgICAgIHZhciBuZXdTdGFyID0gY2MuaW5zdGFudGlhdGUodGhpcy5jYXJkUHJlZmFiKTtcclxuICAgICAgICAvLyBuZXdTdGFyLnNldFBpY051bShcImlcIitpKTtcclxuICAgICAgICBuZXdTdGFyLmdldENvbXBvbmVudCgnQ2FyZCcpLnBpY051bSA9IHBpY051bTtcclxuICAgICAgICBuZXdTdGFyLnNjYWxlWCA9IDAuNTtcclxuICAgICAgICBuZXdTdGFyLnNjYWxlWSA9IDAuNTtcclxuICAgICAgICB0aGlzLnJvdW5kUG9rZXIucHVzaChuZXdTdGFyKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIm9uaW9uXCIsXCLkv53lrZjlh7rniYxcIitwaWNOdW0rXCJpbmRleFwiK2luZGV4KTtcclxuICAgICAgICAvLyB0aGlzLm5vZGUuYWRkQ2hpbGQobmV3U3Rhcik7XHJcbiAgICAgICAgLy8gbGV0IGhlaWdodCA9IHRoaXMuZ3JvdW5kLmhlaWdodCAvIDIgKiAtMTtcclxuICAgICAgICBzd2l0Y2ggKGluZGV4KSB7XHJcbiAgICAgICAgICAgIGNhc2UgMTogdGhpcy5sYXlvdXRCb3R0b20ubm9kZS5hZGRDaGlsZChuZXdTdGFyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9naWNIZWxwZXIucmVtb3ZlUG9rZXJGcm9tQXJyYXkodGhpcy5nYW1lSG9zdCwgcGljTnVtLCB0aGlzLnBva2VyUGxheWVyWzBdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDI6IHRoaXMubGF5b3V0TGVmdC5ub2RlLmFkZENoaWxkKG5ld1N0YXIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dpY0hlbHBlci5yZW1vdmVQb2tlckZyb21BcnJheSh0aGlzLmdhbWVIb3N0LCBwaWNOdW0sIHRoaXMucG9rZXJQbGF5ZXJbMV0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMzogdGhpcy5sYXlvdXRUb3Aubm9kZS5hZGRDaGlsZChuZXdTdGFyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9naWNIZWxwZXIucmVtb3ZlUG9rZXJGcm9tQXJyYXkodGhpcy5nYW1lSG9zdCwgcGljTnVtLCB0aGlzLnBva2VyUGxheWVyWzJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDQ6IHRoaXMubGF5b3V0UmlnaHQubm9kZS5hZGRDaGlsZChuZXdTdGFyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9naWNIZWxwZXIucmVtb3ZlUG9rZXJGcm9tQXJyYXkodGhpcy5nYW1lSG9zdCwgcGljTnVtLCB0aGlzLnBva2VyUGxheWVyWzNdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBuZXdTdGFyLnNldFBvc2l0aW9uKGNjLnYyKC0xNTAgKyB0aGlzLnN0YXJ0Q2FyZFBvc3Rpb24gKyBvZmZzZXQsIGhlaWdodCkpO1xyXG4gICAgfSxcclxuICAgIHNwYXduTmV3U3RhcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vIOS9v+eUqOe7meWumueahOaooeadv+WcqOWcuuaZr+S4reeUn+aIkOS4gOS4quaWsOiKgueCuVxyXG4gICAgICAgIHZhciBuZXdTdGFyID0gY2MuaW5zdGFudGlhdGUodGhpcy5zdGFyUHJlZmFiKTtcclxuICAgICAgICAvLyDlsIbmlrDlop7nmoToioLngrnmt7vliqDliLAgQ2FudmFzIOiKgueCueS4i+mdolxyXG4gICAgICAgIHRoaXMubm9kZS5hZGRDaGlsZChuZXdTdGFyKTtcclxuICAgICAgICAvLyDkuLrmmJ/mmJ/orr7nva7kuIDkuKrpmo/mnLrkvY3nva5cclxuICAgICAgICBuZXdTdGFyLnNldFBvc2l0aW9uKHRoaXMuZ2V0TmV3U3RhclBvc2l0aW9uKCkpO1xyXG4gICAgICAgIC8vIOWcqOaYn+aYn+e7hOS7tuS4iuaaguWtmCBHYW1lIOWvueixoeeahOW8leeUqFxyXG4gICAgICAgIG5ld1N0YXIuZ2V0Q29tcG9uZW50KCdTdGFyJykuZ2FtZSA9IHRoaXM7XHJcbiAgICAgICAgLy8g6YeN572u6K6h5pe25Zmo77yM5qC55o2u5raI5aSx5pe26Ze06IyD5Zu06ZqP5py65Y+W5LiA5Liq5YC8XHJcbiAgICAgICAgdGhpcy5zdGFyRHVyYXRpb24gPSB0aGlzLm1pblN0YXJEdXJhdGlvbiArIE1hdGgucmFuZG9tKCkgKiAodGhpcy5tYXhTdGFyRHVyYXRpb24gLSB0aGlzLm1pblN0YXJEdXJhdGlvbik7XHJcbiAgICAgICAgdGhpcy50aW1lciA9IDA7XHJcbiAgICB9LFxyXG4gICAgLyoqXHJcbiAgICAgKiDnp7vpmaTml6fnmoToioLngrlcclxuICAgICAqIOa3u+WKoOaWsOiKgueCuVxyXG4gICAgICovXHJcbiAgICBzcGF3bkJvdHRvbUNhcmQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5wbGF5ZXJDb250cm9sTm9kZUFycmF5Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgbGV0IGRlc3RvcnlOb2RlID0gdGhpcy5wbGF5ZXJDb250cm9sTm9kZUFycmF5O1xyXG4gICAgICAgICAgICBQb2tlclV0aWwuZGVzdG9yeUFycmF5KGRlc3RvcnlOb2RlKTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXJDb250cm9sTm9kZUFycmF5ID0gW107XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZUJvdHRvbUNhcmQoKVxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiB0eXBlMUFycmF5OnR5cGUxQXJyYXksXHJcbiAgICAgICAgICAgIHR5cGUyQXJyYXk6dHlwZTJBcnJheSxcclxuICAgICAgICAgICAgdHlwZTNBcnJheTp0eXBlM0FycmF5LFxyXG4gICAgICAgICAgICB0eXBlNEFycmF5OnR5cGU0QXJyYXksXHJcbiAgICAgICAgICAgIGhvc3RBcnJheTpob3N0QXJyYXksXHJcbiAgICAgICAgICAgIHRvdGFsOnRvdGFsXHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZUJvdHRvbUNhcmQ6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgbGV0IHN0YXJ0UG9zaXRpb24gPSAwO1xyXG4gICAgICAgIGxldCB1c2VyT2JqID0gdGhpcy5wb2tlclBsYXllclswXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHVzZXJPYmoudG90YWwubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgLy8g5L2/55So57uZ5a6a55qE5qih5p2/5Zyo5Zy65pmv5Lit55Sf5oiQ5LiA5Liq5paw6IqC54K5XHJcbiAgICAgICAgICAgIHZhciBuZXdTdGFyID0gY2MuaW5zdGFudGlhdGUodGhpcy5jYXJkUHJlZmFiKTtcclxuICAgICAgICAgICAgLy8gbmV3U3Rhci5zZXRQaWNOdW0oXCJpXCIraSk7XHJcbiAgICAgICAgICAgIG5ld1N0YXIuZ2V0Q29tcG9uZW50KCdDYXJkJykucGljTnVtID0gdXNlck9iai50b3RhbFtpXTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXJDb250cm9sTm9kZUFycmF5LnB1c2gobmV3U3Rhcik7XHJcbiAgICAgICAgICAgIC8vIHRoaXMubm9kZS5hZGRDaGlsZChuZXdTdGFyKTtcclxuICAgICAgICAgICAgdGhpcy5sYXlvdXRDb250YWluZXIubm9kZS5hZGRDaGlsZChuZXdTdGFyKTtcclxuICAgICAgICAgICAgbGV0IGhlaWdodCA9IHRoaXMuZ3JvdW5kLmhlaWdodCAvIDIgKiAtMTtcclxuICAgICAgICAgICAgc3RhcnRQb3NpdGlvbiA9IGkgKiB0aGlzLmNhcmRXaWR0aDtcclxuICAgICAgICAgICAgaWYgKGkgPiAxMykge1xyXG4gICAgICAgICAgICAgICAgaGVpZ2h0ID0gaGVpZ2h0IC0gMTUwXHJcbiAgICAgICAgICAgICAgICBzdGFydFBvc2l0aW9uID0gKGkgLSAxMykgKiB0aGlzLmNhcmRXaWR0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBuZXdTdGFyLnNldFBvc2l0aW9uKGNjLnYyKC0yMDAgKyB0aGlzLnN0YXJ0Q2FyZFBvc3Rpb24gKyBzdGFydFBvc2l0aW9uLCBoZWlnaHQpKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICBnZXROZXdTdGFyUG9zaXRpb246IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgcmFuZFggPSAwO1xyXG4gICAgICAgIC8vIOagueaNruWcsOW5s+mdouS9jee9ruWSjOS4u+inkui3s+i3g+mrmOW6pu+8jOmaj+acuuW+l+WIsOS4gOS4quaYn+aYn+eahCB5IOWdkOagh1xyXG4gICAgICAgIHZhciByYW5kWSA9IHRoaXMuZ3JvdW5kWSArIE1hdGgucmFuZG9tKCkgKiB0aGlzLnBsYXllci5nZXRDb21wb25lbnQoJ1BsYXllcicpLmp1bXBIZWlnaHQgKyA1MDtcclxuICAgICAgICAvLyDmoLnmja7lsY/luZXlrr3luqbvvIzpmo/mnLrlvpfliLDkuIDkuKrmmJ/mmJ8geCDlnZDmoIdcclxuICAgICAgICB2YXIgbWF4WCA9IHRoaXMubm9kZS53aWR0aCAvIDI7XHJcbiAgICAgICAgcmFuZFggPSAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiAyICogbWF4WDtcclxuICAgICAgICAvLyDov5Tlm57mmJ/mmJ/lnZDmoIdcclxuICAgICAgICByZXR1cm4gY2MudjIocmFuZFgsIHJhbmRZKTtcclxuICAgIH0sXHJcbiAgICBnZXRDYXJkQm90dG9tUG9zaXRpb246IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgcmFuZFggPSB0aGlzLmN1cnJlbnRDYXJkUG9zaXRpb247XHJcbiAgICAgICAgdmFyIHJhbmRZID0gMDtcclxuICAgICAgICB0aGlzLmN1cnJlbnRDYXJkUG9zaXRpb24gPSB0aGlzLmN1cnJlbnRDYXJkUG9zaXRpb24gKyB0aGlzLmNhcmRXaWR0aDtcclxuICAgICAgICByZXR1cm4gY2MudjIocmFuZFgsIHJhbmRZKTtcclxuICAgIH0sXHJcblxyXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcclxuICAgICAgICAvLyDmr4/luKfmm7TmlrDorqHml7blmajvvIzotoXov4fpmZDluqbov5jmsqHmnInnlJ/miJDmlrDnmoTmmJ/mmJ9cclxuICAgICAgICAvLyDlsLHkvJrosIPnlKjmuLjmiI/lpLHotKXpgLvovpFcclxuICAgICAgICAvLyBpZiAodGhpcy50aW1lciA+IHRoaXMuc3RhckR1cmF0aW9uKSB7XHJcbiAgICAgICAgLy8gICAgIHRoaXMuZ2FtZU92ZXIoKTtcclxuICAgICAgICAvLyAgICAgdGhpcy5lbmFibGVkID0gZmFsc2U7ICAgLy8gZGlzYWJsZSBnYW1lT3ZlciBsb2dpYyB0byBhdm9pZCBsb2FkIHNjZW5lIHJlcGVhdGVkbHlcclxuICAgICAgICAvLyAgICAgcmV0dXJuO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICAvLyB0aGlzLnRpbWVyICs9IGR0O1xyXG4gICAgfSxcclxuXHJcbiAgICBnYWluU2NvcmU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnNjb3JlICs9IDE7XHJcbiAgICAgICAgLy8g5pu05pawIHNjb3JlRGlzcGxheSBMYWJlbCDnmoTmloflrZdcclxuICAgICAgICB0aGlzLnNjb3JlRGlzcGxheS5zdHJpbmcgPSAnU2NvcmU6ICcgKyB0aGlzLnNjb3JlO1xyXG4gICAgICAgIC8vIOaSreaUvuW+l+WIhumfs+aViFxyXG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGhpcy5zY29yZUF1ZGlvLCBmYWxzZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGdhbWVPdmVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIuc3RvcEFsbEFjdGlvbnMoKTsgLy/lgZzmraIgcGxheWVyIOiKgueCueeahOi3s+i3g+WKqOS9nFxyXG4gICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZSgnZ2FtZScpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICog5oqK54mM5Y+R57uZ5Zub5a62XHJcbiAgICAqL1xyXG4gICAgcHVibGlzaFBva2VyczogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMucG9rZXJQbGF5ZXIgPSBbXTtcclxuICAgICAgICB0aGlzLmdhbWVIb3N0ID0gbnVsbDtcclxuICAgICAgICBsZXQgcG9rZXJBcnJheSA9IHRoaXMuY2FyZEFycmF5LnNsaWNlKDApO1xyXG4gICAgICAgIGxldCBob3N0ID0gcGFyc2VJbnQoTWF0aC5yYW5kb20oKSAqIDQpOy8v6ZqP5py65Li754mM6Iqx6ImyXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IHBsYXllclBva2VyQXJyYXkgPSBbXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAyNzsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcG9rZXJOdW0gPSBNYXRoLnJhbmRvbSgpICogcG9rZXJBcnJheS5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICBwb2tlck51bSA9IHBhcnNlSW50KHBva2VyTnVtKTtcclxuICAgICAgICAgICAgICAgIC8v5o+S5YWl5omL54mM5LitXHJcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSBwb2tlckFycmF5LnNwbGljZShwb2tlck51bSwgMSk7XHJcbiAgICAgICAgICAgICAgICBwbGF5ZXJQb2tlckFycmF5LnB1c2godmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2FtZUhvc3QgPT0gbnVsbCkgey8v6ZqP5py65Yiw5Li75ZCO77yM56ys5LiA5byg5Li754mM5Lqu5Ye6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGhvc3QgPT0gUG9rZXJVdGlsLnF1YXJ5UG9rZXJUeXBlVmFsdWUodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZUhvc3QgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHBlbmRMb2coXCLmnKzova7muLjmiI8s5Li754mMXCIgKyBQb2tlclV0aWwucXVhcnlQb2tlclZhbHVlKHZhbHVlKSArIFwi5ZyoXCIgKyB0aGlzLmV4cGFuZFBsYXllcihpKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBwbGF5ZXJPYmogPSBQb2tlclV0aWwuc29ydFBva2Vycyhob3N0LCBwbGF5ZXJQb2tlckFycmF5KTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJvbmlvbj09PT1cIiwgSlNPTi5zdHJpbmdpZnkocGxheWVyT2JqKSk7XHJcbiAgICAgICAgICAgIHRoaXMucG9rZXJQbGF5ZXIucHVzaChwbGF5ZXJPYmopO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNwYXduQm90dG9tQ2FyZCgpO1xyXG5cclxuICAgIH0sXHJcbiAgICBleHBhbmRQbGF5ZXI6IGZ1bmN0aW9uIChsb2NhdGlvbikge1xyXG4gICAgICAgIHN3aXRjaCAobG9jYXRpb24pIHtcclxuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gXCLoh6rlt7FcIlxyXG4gICAgICAgICAgICBjYXNlIDE6IHJldHVybiBcIuS4i+WutlwiXHJcbiAgICAgICAgICAgIGNhc2UgMjogcmV0dXJuIFwi5a+55a62XCJcclxuICAgICAgICAgICAgY2FzZSAzOiByZXR1cm4gXCLkuIrlrrZcIlxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG4gICAgYXBwZW5kTG9nOiBmdW5jdGlvbiAoc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5wbGF5TG9nID0gdGhpcy5wbGF5TG9nICsgXCJcXG5cIiArIHN0cmluZztcclxuICAgICAgICB0aGlzLmxvZ0xhYmVsLnN0cmluZyA9IHRoaXMucGxheUxvZztcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG59KTtcclxuIl19