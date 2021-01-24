
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcR2FtZS5qcyJdLCJuYW1lcyI6WyJQb2tlclV0aWwiLCJyZXF1aXJlIiwiQUlIZWxwZXIiLCJzZWxmIiwiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJzdGFyUHJlZmFiIiwidHlwZSIsIlByZWZhYiIsImNhcmRQcmVmYWIiLCJtYXhTdGFyRHVyYXRpb24iLCJtaW5TdGFyRHVyYXRpb24iLCJjdXJyZW50Q2FyZFBvc2l0aW9uIiwic3RhcnRDYXJkUG9zdGlvbiIsImNhcmRXaWR0aCIsImxvZ2ljSGVscGVyIiwiY2FyZEFycmF5IiwiU3RyaW5nIiwicG9rZXJQbGF5ZXIiLCJyb3VuZFBva2VyIiwic2VuZEFycmF5IiwicGxheWVyQ29udHJvbE5vZGVBcnJheSIsInJlZnJlc2hCdXR0b24iLCJCdXR0b24iLCJzZW5kQnV0dG9uIiwiY3VycmVudFdpbm5lciIsImdhbWVIb3N0IiwibGF5b3V0Q29udGFpbmVyIiwiTGF5b3V0IiwibGF5b3V0Qm90dG9tIiwibGF5b3V0VG9wIiwibGF5b3V0TGVmdCIsImxheW91dFJpZ2h0IiwibG9nTGFiZWwiLCJMYWJlbCIsInBsYXlMb2ciLCJncm91bmQiLCJOb2RlIiwicGxheWVyIiwic2NvcmVEaXNwbGF5Iiwic2NvcmVBdWRpbyIsIkF1ZGlvQ2xpcCIsIm9uTG9hZCIsImdyb3VuZFkiLCJ5IiwiaGVpZ2h0IiwidGltZXIiLCJzdGFyRHVyYXRpb24iLCJpIiwicHJlIiwiaiIsInN0ciIsInB1c2giLCJub2RlIiwib24iLCJyZWZyZXNoQ2FsbGJhY2siLCJzZW5kQ2FsbGJhY2siLCJwdWJsaXNoUG9rZXJzIiwic2NvcmUiLCJvblJvdW5kQ2FsbEJhY2siLCJiaW5kIiwicm91bmRQcm9ncmFtIiwib25Vc2VyUGxheUNhbGxCYWNrIiwicm91bmRPdmVyQ2FsbEJhY2siLCJyb3VuZEhvc3QiLCJjdXJyZW50UGxheWVyIiwiY29uc29sZSIsImxvZyIsInNlbmRDYXJkIiwic2VuZEFJRm9sbG93Q2FyZCIsInNhdmVSb3VuZFBva2VyIiwid2lubmVyUG9zaXRpb24iLCJzdW1Tb2NlciIsInNldFRpbWVvdXQiLCJkZXN0b3J5QXJyYXkiLCJhcHBlbmRMb2ciLCJidXR0b24iLCJ3aWxsU2VuZENhcmQiLCJsZW5ndGgiLCJnZXRDb21wb25lbnQiLCJpc0NoZWNrIiwiQXJyYXkiLCJpc0FycmF5IiwicGljTnVtIiwibWVzc2FnZSIsImNoZWNrVXNlckNhblNlbmQiLCJkZXN0cm95Iiwic3BsaWNlIiwiaW5kZXgiLCJvZmZzZXQiLCJuZXdTdGFyIiwiaW5zdGFudGlhdGUiLCJzY2FsZVgiLCJzY2FsZVkiLCJhZGRDaGlsZCIsInJlbW92ZVBva2VyRnJvbUFycmF5Iiwic3Bhd25OZXdTdGFyIiwic2V0UG9zaXRpb24iLCJnZXROZXdTdGFyUG9zaXRpb24iLCJnYW1lIiwiTWF0aCIsInJhbmRvbSIsInNwYXduQm90dG9tQ2FyZCIsImRlc3RvcnlOb2RlIiwiY3JlYXRlQm90dG9tQ2FyZCIsInN0YXJ0UG9zaXRpb24iLCJ1c2VyT2JqIiwidG90YWwiLCJyYW5kWCIsInJhbmRZIiwianVtcEhlaWdodCIsIm1heFgiLCJ3aWR0aCIsInYyIiwiZ2V0Q2FyZEJvdHRvbVBvc2l0aW9uIiwidXBkYXRlIiwiZHQiLCJnYWluU2NvcmUiLCJzdHJpbmciLCJhdWRpb0VuZ2luZSIsInBsYXlFZmZlY3QiLCJnYW1lT3ZlciIsInN0b3BBbGxBY3Rpb25zIiwiZGlyZWN0b3IiLCJsb2FkU2NlbmUiLCJwb2tlckFycmF5Iiwic2xpY2UiLCJob3N0IiwicGFyc2VJbnQiLCJwbGF5ZXJQb2tlckFycmF5IiwicG9rZXJOdW0iLCJ2YWx1ZSIsInF1YXJ5UG9rZXJUeXBlVmFsdWUiLCJxdWFyeVBva2VyVmFsdWUiLCJleHBhbmRQbGF5ZXIiLCJwbGF5ZXJPYmoiLCJzb3J0UG9rZXJzIiwiSlNPTiIsInN0cmluZ2lmeSIsImxvY2F0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLElBQUlBLFNB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QUFzQm1GLFNBQXRCO0FBQ0g7O0FBQ0QsU0FBS2pDLGVBQUw7QUFFSCxHQTFYSTtBQTJYTGdDLEVBQUFBLFlBQVksRUFBRSxzQkFBVUssUUFBVixFQUFvQjtBQUM5QixZQUFRQSxRQUFSO0FBQ0ksV0FBSyxDQUFMO0FBQVEsZUFBTyxJQUFQOztBQUNSLFdBQUssQ0FBTDtBQUFRLGVBQU8sSUFBUDs7QUFDUixXQUFLLENBQUw7QUFBUSxlQUFPLElBQVA7O0FBQ1IsV0FBSyxDQUFMO0FBQVEsZUFBTyxJQUFQO0FBSlo7QUFPSCxHQW5ZSTtBQW9ZTGhFLEVBQUFBLFNBQVMsRUFBRSxtQkFBVTJDLE1BQVYsRUFBa0I7QUFDekIsU0FBS25GLE9BQUwsR0FBZSxLQUFLQSxPQUFMLEdBQWUsSUFBZixHQUFzQm1GLE1BQXJDO0FBQ0EsU0FBS3JGLFFBQUwsQ0FBY3FGLE1BQWQsR0FBdUIsS0FBS25GLE9BQTVCO0FBQ0g7QUF2WUksQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbmxldCBQb2tlclV0aWwgPSByZXF1aXJlKFwiUG9rZXJVdGlsXCIpO1xyXG5sZXQgQUlIZWxwZXIgPSByZXF1aXJlKFwiQUlIZWxwZXJcIik7XHJcbmxldCBzZWxmO1xyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIC8vIOi/meS4quWxnuaAp+W8leeUqOS6huaYn+aYn+mihOWItui1hOa6kFxyXG4gICAgICAgIHN0YXJQcmVmYWI6IHtcclxuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcclxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBjYXJkUHJlZmFiOiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8g5pif5pif5Lqn55Sf5ZCO5raI5aSx5pe26Ze055qE6ZqP5py66IyD5Zu0XHJcbiAgICAgICAgbWF4U3RhckR1cmF0aW9uOiAwLFxyXG4gICAgICAgIG1pblN0YXJEdXJhdGlvbjogMCxcclxuICAgICAgICBjdXJyZW50Q2FyZFBvc2l0aW9uOiAwLFxyXG4gICAgICAgIHN0YXJ0Q2FyZFBvc3Rpb246IDAsXHJcbiAgICAgICAgY2FyZFdpZHRoOiA4MCxcclxuICAgICAgICBsb2dpY0hlbHBlcjogbnVsbCxcclxuICAgICAgICBjYXJkQXJyYXk6IFtjYy5TdHJpbmddLFxyXG4gICAgICAgIC8v5Yid5aeL54mM5pWw57uEIOmAhuaXtumSiCDkuLvop5LmmK/nrKzkuIDkuKrmlbDnu4RcclxuICAgICAgICBwb2tlclBsYXllcjogW10sXHJcbiAgICAgICAgLy/lvZPliY3ova7mrKHlh7rniYzoioLngrksXHJcbiAgICAgICAgcm91bmRQb2tlcjogW10sXHJcbiAgICAgICAgc2VuZEFycmF5OltdLFxyXG4gICAgICAgIC8v5Li76KeS5b2T5YmN54mM6IqC54K5XHJcbiAgICAgICAgcGxheWVyQ29udHJvbE5vZGVBcnJheTogW10sXHJcbiAgICAgICAgLy/mtJfniYxcclxuICAgICAgICByZWZyZXNoQnV0dG9uOiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6IGNjLkJ1dHRvblxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy/lh7rniYxcclxuICAgICAgICBzZW5kQnV0dG9uOiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6IGNjLkJ1dHRvblxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8v5b2T5YmN6IOc5pa5XHJcbiAgICAgICAgY3VycmVudFdpbm5lcjogMSxcclxuICAgICAgICAvL+acrOi9ruS4u1xyXG4gICAgICAgIGdhbWVIb3N0OiBcIjFcIixcclxuICAgICAgICAvL+eOqeWutuaLpeacieeJjFxyXG4gICAgICAgIGxheW91dENvbnRhaW5lcjoge1xyXG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxyXG4gICAgICAgICAgICB0eXBlOiBjYy5MYXlvdXRcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8v546p5a625Ye655qE54mMIFxyXG4gICAgICAgIGxheW91dEJvdHRvbToge1xyXG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxyXG4gICAgICAgICAgICB0eXBlOiBjYy5MYXlvdXRcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8v5a+55a625Ye654mMIOesrOS4ieS9jVxyXG4gICAgICAgIGxheW91dFRvcDoge1xyXG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxyXG4gICAgICAgICAgICB0eXBlOiBjYy5MYXlvdXRcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8v5LiL5a625Ye654mMIOW3puaJi+esrOS6jOS9jVxyXG4gICAgICAgIGxheW91dExlZnQ6IHtcclxuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcclxuICAgICAgICAgICAgdHlwZTogY2MuTGF5b3V0XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvL+S4iuWutuWHuueJjO+8jOWPs+aJi+esrOWbm+S9jVxyXG4gICAgICAgIGxheW91dFJpZ2h0OiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6IGNjLkxheW91dFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy/miJjmiqVcclxuICAgICAgICBsb2dMYWJlbDoge1xyXG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxyXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcGxheUxvZzogXCLmuLjmiI/lvIDlp4tcIixcclxuICAgICAgICAvLyDlnLDpnaLoioLngrnvvIznlKjkuo7noa7lrprmmJ/mmJ/nlJ/miJDnmoTpq5jluqZcclxuICAgICAgICBncm91bmQ6IHtcclxuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcclxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8gcGxheWVyIOiKgueCue+8jOeUqOS6juiOt+WPluS4u+inkuW8uei3s+eahOmrmOW6pu+8jOWSjOaOp+WItuS4u+inkuihjOWKqOW8gOWFs1xyXG4gICAgICAgIHBsYXllcjoge1xyXG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxyXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyBzY29yZSBsYWJlbCDnmoTlvJXnlKhcclxuICAgICAgICBzY29yZURpc3BsYXk6IHtcclxuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcclxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWxcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIOW+l+WIhumfs+aViOi1hOa6kFxyXG4gICAgICAgIHNjb3JlQXVkaW86IHtcclxuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcclxuICAgICAgICAgICAgdHlwZTogY2MuQXVkaW9DbGlwXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcblxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgc2VsZj10aGlzO1xyXG4gICAgICAgIC8vIOiOt+WPluWcsOW5s+mdoueahCB5IOi9tOWdkOagh1xyXG4gICAgICAgIHRoaXMuZ3JvdW5kWSA9IHRoaXMuZ3JvdW5kLnkgKyB0aGlzLmdyb3VuZC5oZWlnaHQgLyAyO1xyXG4gICAgICAgIC8vIOWIneWni+WMluiuoeaXtuWZqFxyXG4gICAgICAgIHRoaXMudGltZXIgPSAwO1xyXG4gICAgICAgIHRoaXMuc3RhckR1cmF0aW9uID0gMDtcclxuICAgICAgICB0aGlzLmxvZ2ljSGVscGVyID0gbmV3IEFJSGVscGVyKCk7XHJcbiAgICAgICAgLy/liJvlu7rlm77niYfotYTmupBcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEzOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IHByZSA9IDMgKyBpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMTsgaiA8IDU7IGorKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHN0ciA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJlIDwgMTApIHtcclxuICAgICAgICAgICAgICAgICAgICBzdHIgPSBcIjBcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHN0ciA9IHN0ciArIHByZSArIGo7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhcmRBcnJheS5wdXNoKHN0cik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhcmRBcnJheS5wdXNoKHN0cik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jYXJkQXJyYXkucHVzaChcIjE2MVwiKTtcclxuICAgICAgICB0aGlzLmNhcmRBcnJheS5wdXNoKFwiMTYxXCIpO1xyXG4gICAgICAgIHRoaXMuY2FyZEFycmF5LnB1c2goXCIxNzFcIik7XHJcbiAgICAgICAgdGhpcy5jYXJkQXJyYXkucHVzaChcIjE3MVwiKTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMucmVmcmVzaEJ1dHRvbi5ub2RlLm9uKCdjbGljaycsIHRoaXMucmVmcmVzaENhbGxiYWNrLCB0aGlzKTtcclxuICAgICAgICB0aGlzLnNlbmRCdXR0b24ubm9kZS5vbignY2xpY2snLCB0aGlzLnNlbmRDYWxsYmFjaywgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5wdWJsaXNoUG9rZXJzKCk7XHJcbiAgICAgICAgLy8gdGhpcy5zcGF3bk5ld1N0YXIoKTtcclxuICAgICAgICAvLyDliJ3lp4vljJborqHliIZcclxuICAgICAgICB0aGlzLnNjb3JlID0gMDtcclxuICAgICAgICAvLyB0aGlzLm9uUm91bmRDYWxsQmFjaz10aGlzLm9uUm91bmRDYWxsQmFjay5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMub25Sb3VuZENhbGxCYWNrPXRoaXMub25Sb3VuZENhbGxCYWNrLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5sb2dpY0hlbHBlci5yb3VuZFByb2dyYW0odGhpcy5vblVzZXJQbGF5Q2FsbEJhY2ssdGhpcy5vblJvdW5kQ2FsbEJhY2ssdGhpcy5yb3VuZE92ZXJDYWxsQmFjaywwLHRoaXMuZ2FtZUhvc3QsW10pO1xyXG4gICAgfSxcclxuICAgIC8qKlxyXG4gICAgICog55S16ISR5Ye654mM77yM55u05o6l5riy5p+TXHJcbiAgICAgKiBAcGFyYW0gZ2FtZUhvc3RcclxuICAgICAqIEBwYXJhbSByb3VuZEhvc3RcclxuICAgICAqIEBwYXJhbSBzZW5kQXJyYXlcclxuICAgICAqIEBwYXJhbSBjdXJyZW50UGxheWVyXHJcbiAgICAgKi9cclxuICAgICBvblJvdW5kQ2FsbEJhY2s6KGdhbWVIb3N0LCByb3VuZEhvc3QsIHNlbmRBcnJheSwgY3VycmVudFBsYXllcik9PntcclxuICAgICAgICAgc2VsZi5yb3VuZEhvc3Q9cm91bmRIb3N0O1xyXG4gICAgICAgICBzZWxmLnNlbmRBcnJheT1zZW5kQXJyYXk7XHJcbiAgICAgICAgIGNvbnNvbGUubG9nKFwib25pb25cIixcIui9ruasoeWbnuiwg1wiK3NlbmRBcnJheSk7XHJcbiAgICAgICBsZXQgc2VuZENhcmQ9IHNlbGYubG9naWNIZWxwZXIuc2VuZEFJRm9sbG93Q2FyZChzZWxmLmdhbWVIb3N0LCByb3VuZEhvc3QsIHNlbmRBcnJheSwgc2VsZi5wb2tlclBsYXllcltjdXJyZW50UGxheWVyXSk7XHJcbiAgICAgICBjb25zb2xlLmxvZyhcIm9uaW9uXCIsXCLova7mrKHlh7rniYxcIitzZW5kQ2FyZCk7XHJcbiAgICAgICAgLy8gc2VuZEFycmF5LnB1c2goc2VuZENhcmQpO1xyXG4gICAgICAgIHNlbGYuc2F2ZVJvdW5kUG9rZXIoc2VuZENhcmQsIGN1cnJlbnRQbGF5ZXIrMSwgMCk7XHJcbiAgICAgICAgcmV0dXJuIHNlbmRDYXJkO1xyXG4gICAgfSxcclxuICAgIC8qKlxyXG4gICAgICog546p5a625Ye654mMIOWHuueJjOaMiemSruWPr+S7peeCueWHu1xyXG4gICAgICogQHBhcmFtIGdhbWVIb3N0XHJcbiAgICAgKiBAcGFyYW0gcm91bmRIb3N0XHJcbiAgICAgKiBAcGFyYW0gc2VuZEFycmF5XHJcbiAgICAgKiBAcGFyYW0gY3VycmVudFBsYXllclxyXG4gICAgICovXHJcbiAgICBvblVzZXJQbGF5Q2FsbEJhY2s6KGdhbWVIb3N0LCByb3VuZEhvc3QsIHNlbmRBcnJheSwgY3VycmVudFBsYXllcik9PntcclxuICAgICAgICBjb25zb2xlLmxvZyhcIm9uaW9uXCIsXCLlm57osIPliLB1c2VyXCIrc2VuZEFycmF5KTtcclxuICAgIH0sXHJcblxyXG4gICAgcm91bmRPdmVyQ2FsbEJhY2s6KHdpbm5lclBvc2l0aW9uLHN1bVNvY2VyKT0+e1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCk9PntcclxuICAgICAgICAgICAgUG9rZXJVdGlsLmRlc3RvcnlBcnJheShzZWxmLnJvdW5kUG9rZXIpO1xyXG4gICAgICAgICAgICBzZWxmLnNjb3JlPXN1bVNvY2VyK3NlbGYuc2NvcmU7XHJcbiAgICAgICAgICAgIHNlbGYucm91bmRIb3N0PW51bGw7XHJcbiAgICAgICAgICAgIHNlbGYuYXBwZW5kTG9nKHdpbm5lclBvc2l0aW9uK1wi5aSnLOaNnuWIhlwiK3N1bVNvY2VyKTtcclxuICAgICAgICAgICAgLy8gc2VsZi5sb2dpY0hlbHBlci5yb3VuZFByb2dyYW0oc2VsZi5vblVzZXJQbGF5Q2FsbEJhY2ssc2VsZi5vblJvdW5kQ2FsbEJhY2ssXHJcbiAgICAgICAgICAgIC8vICAgICBzZWxmLnJvdW5kT3ZlckNhbGxCYWNrLHdpbm5lclBvc2l0aW9uLHNlbGYuZ2FtZUhvc3QsW10pO1xyXG4gICAgICAgIH0sMTAwMCk7XHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICByZWZyZXNoQ2FsbGJhY2s6IGZ1bmN0aW9uIChidXR0b24pIHtcclxuICAgICAgICB0aGlzLnB1Ymxpc2hQb2tlcnMoKTtcclxuICAgIH0sXHJcbiAgICBzZW5kQ2FsbGJhY2s6IGZ1bmN0aW9uIChidXR0b24pIHtcclxuICAgICAgICAvLyBsZXQgc2VuZEFycmF5ID0gW107XHJcbiAgICAgICAgbGV0IHdpbGxTZW5kQ2FyZD1udWxsO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJDb250cm9sTm9kZUFycmF5Lmxlbmd0aDtpKyspIHtcclxuICAgICAgICAgICAgLy/liKTmlq3mmK/lkKblj6/lh7pcclxuICAgICAgICAgICAgbGV0IG5vZGUgPSB0aGlzLnBsYXllckNvbnRyb2xOb2RlQXJyYXlbaV0uZ2V0Q29tcG9uZW50KCdDYXJkJyk7XHJcbiAgICAgICAgICAgIGlmIChub2RlLmlzQ2hlY2spIHtcclxuICAgICAgICAgICAgICAgIGlmKHdpbGxTZW5kQ2FyZCYmIUFycmF5LmlzQXJyYXkod2lsbFNlbmRDYXJkKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgd2lsbFNlbmRDYXJkPVtdO1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbGxTZW5kQ2FyZC5wdXNoKG5vZGUucGljTnVtKTtcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbGxTZW5kQ2FyZD1ub2RlLnBpY051bTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIHRoaXMucGxheWVyQ29udHJvbE5vZGVBcnJheVtpXS5kZXN0cm95KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBtZXNzYWdlPXRoaXMubG9naWNIZWxwZXIuY2hlY2tVc2VyQ2FuU2VuZCh0aGlzLmdhbWVIb3N0LHRoaXMucm91bmRIb3N0LHRoaXMucG9rZXJQbGF5ZXJbMF0sd2lsbFNlbmRDYXJkKTtcclxuICAgICAgICBpZighbWVzc2FnZSl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib25pb25cIixcIuS4jeiDveWHulwiK21lc3NhZ2UpO1xyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8v5Ye654mMIOenu+mZpOW5tua3u+WKoFxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJDb250cm9sTm9kZUFycmF5Lmxlbmd0aDspIHtcclxuICAgICAgICAgICAgLy/liKTmlq3mmK/lkKblj6/lh7pcclxuICAgICAgICAgICAgbGV0IG5vZGUgPSB0aGlzLnBsYXllckNvbnRyb2xOb2RlQXJyYXlbaV0uZ2V0Q29tcG9uZW50KCdDYXJkJyk7XHJcbiAgICAgICAgICAgIGlmIChub2RlLmlzQ2hlY2spIHtcclxuICAgICAgICAgICAgICAgIC8vIHdpbGxTZW5kQXJyYXkucHVzaChub2RlLnBpY051bSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNhdmVSb3VuZFBva2VyKG5vZGUucGljTnVtLCAxLCBpICogdGhpcy5jYXJkV2lkdGgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXJDb250cm9sTm9kZUFycmF5W2ldLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxheWVyQ29udHJvbE5vZGVBcnJheS5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gdGhpcy5wbGF5ZXJDb250cm9sTm9kZUFycmF5W2ldLmRlc3Ryb3koKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoIXRoaXMuc2VuZEFycmF5KXtcclxuICAgICAgICAgICAgdGhpcy5zZW5kQXJyYXk9W107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2VuZEFycmF5LnB1c2god2lsbFNlbmRDYXJkKTtcclxuICAgICAgICB0aGlzLmxvZ2ljSGVscGVyLnJvdW5kUHJvZ3JhbSh0aGlzLm9uVXNlclBsYXlDYWxsQmFjayx0aGlzLm9uUm91bmRDYWxsQmFjayxcclxuICAgICAgICAgICAgdGhpcy5yb3VuZE92ZXJDYWxsQmFjaywwLHRoaXMuZ2FtZUhvc3QsdGhpcy5zZW5kQXJyYXkpO1xyXG4gICAgICAgXHJcbiAgICB9LFxyXG4gICAgLy/kv53lrZjlh7rniYwgIDEgMiAzIDQg6aG65pe26ZKI5L2NXHJcbiAgICBzYXZlUm91bmRQb2tlcjogZnVuY3Rpb24gKHBpY051bSwgaW5kZXgsIG9mZnNldCkge1xyXG4gICAgICAgIHZhciBuZXdTdGFyID0gY2MuaW5zdGFudGlhdGUodGhpcy5jYXJkUHJlZmFiKTtcclxuICAgICAgICAvLyBuZXdTdGFyLnNldFBpY051bShcImlcIitpKTtcclxuICAgICAgICBuZXdTdGFyLmdldENvbXBvbmVudCgnQ2FyZCcpLnBpY051bSA9IHBpY051bTtcclxuICAgICAgICBuZXdTdGFyLnNjYWxlWCA9IDAuNTtcclxuICAgICAgICBuZXdTdGFyLnNjYWxlWSA9IDAuNTtcclxuICAgICAgICB0aGlzLnJvdW5kUG9rZXIucHVzaChuZXdTdGFyKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIm9uaW9uXCIsXCLkv53lrZjlh7rniYxcIitwaWNOdW0rXCJpbmRleFwiK2luZGV4KTtcclxuICAgICAgICAvLyB0aGlzLm5vZGUuYWRkQ2hpbGQobmV3U3Rhcik7XHJcbiAgICAgICAgLy8gbGV0IGhlaWdodCA9IHRoaXMuZ3JvdW5kLmhlaWdodCAvIDIgKiAtMTtcclxuICAgICAgICBzd2l0Y2ggKGluZGV4KSB7XHJcbiAgICAgICAgICAgIGNhc2UgMTogdGhpcy5sYXlvdXRCb3R0b20ubm9kZS5hZGRDaGlsZChuZXdTdGFyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9naWNIZWxwZXIucmVtb3ZlUG9rZXJGcm9tQXJyYXkodGhpcy5nYW1lSG9zdCwgcGljTnVtLCB0aGlzLnBva2VyUGxheWVyWzBdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDI6IHRoaXMubGF5b3V0TGVmdC5ub2RlLmFkZENoaWxkKG5ld1N0YXIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dpY0hlbHBlci5yZW1vdmVQb2tlckZyb21BcnJheSh0aGlzLmdhbWVIb3N0LCBwaWNOdW0sIHRoaXMucG9rZXJQbGF5ZXJbMV0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMzogdGhpcy5sYXlvdXRUb3Aubm9kZS5hZGRDaGlsZChuZXdTdGFyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9naWNIZWxwZXIucmVtb3ZlUG9rZXJGcm9tQXJyYXkodGhpcy5nYW1lSG9zdCwgcGljTnVtLCB0aGlzLnBva2VyUGxheWVyWzJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDQ6IHRoaXMubGF5b3V0UmlnaHQubm9kZS5hZGRDaGlsZChuZXdTdGFyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9naWNIZWxwZXIucmVtb3ZlUG9rZXJGcm9tQXJyYXkodGhpcy5nYW1lSG9zdCwgcGljTnVtLCB0aGlzLnBva2VyUGxheWVyWzNdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBuZXdTdGFyLnNldFBvc2l0aW9uKGNjLnYyKC0xNTAgKyB0aGlzLnN0YXJ0Q2FyZFBvc3Rpb24gKyBvZmZzZXQsIGhlaWdodCkpO1xyXG4gICAgfSxcclxuICAgIHNwYXduTmV3U3RhcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vIOS9v+eUqOe7meWumueahOaooeadv+WcqOWcuuaZr+S4reeUn+aIkOS4gOS4quaWsOiKgueCuVxyXG4gICAgICAgIHZhciBuZXdTdGFyID0gY2MuaW5zdGFudGlhdGUodGhpcy5zdGFyUHJlZmFiKTtcclxuICAgICAgICAvLyDlsIbmlrDlop7nmoToioLngrnmt7vliqDliLAgQ2FudmFzIOiKgueCueS4i+mdolxyXG4gICAgICAgIHRoaXMubm9kZS5hZGRDaGlsZChuZXdTdGFyKTtcclxuICAgICAgICAvLyDkuLrmmJ/mmJ/orr7nva7kuIDkuKrpmo/mnLrkvY3nva5cclxuICAgICAgICBuZXdTdGFyLnNldFBvc2l0aW9uKHRoaXMuZ2V0TmV3U3RhclBvc2l0aW9uKCkpO1xyXG4gICAgICAgIC8vIOWcqOaYn+aYn+e7hOS7tuS4iuaaguWtmCBHYW1lIOWvueixoeeahOW8leeUqFxyXG4gICAgICAgIG5ld1N0YXIuZ2V0Q29tcG9uZW50KCdTdGFyJykuZ2FtZSA9IHRoaXM7XHJcbiAgICAgICAgLy8g6YeN572u6K6h5pe25Zmo77yM5qC55o2u5raI5aSx5pe26Ze06IyD5Zu06ZqP5py65Y+W5LiA5Liq5YC8XHJcbiAgICAgICAgdGhpcy5zdGFyRHVyYXRpb24gPSB0aGlzLm1pblN0YXJEdXJhdGlvbiArIE1hdGgucmFuZG9tKCkgKiAodGhpcy5tYXhTdGFyRHVyYXRpb24gLSB0aGlzLm1pblN0YXJEdXJhdGlvbik7XHJcbiAgICAgICAgdGhpcy50aW1lciA9IDA7XHJcbiAgICB9LFxyXG4gICAgLyoqXHJcbiAgICAgKiDnp7vpmaTml6fnmoToioLngrlcclxuICAgICAqIOa3u+WKoOaWsOiKgueCuVxyXG4gICAgICovXHJcbiAgICBzcGF3bkJvdHRvbUNhcmQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5wbGF5ZXJDb250cm9sTm9kZUFycmF5Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgbGV0IGRlc3RvcnlOb2RlID0gdGhpcy5wbGF5ZXJDb250cm9sTm9kZUFycmF5O1xyXG4gICAgICAgICAgICBQb2tlclV0aWwuZGVzdG9yeUFycmF5KGRlc3RvcnlOb2RlKTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXJDb250cm9sTm9kZUFycmF5ID0gW107XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZUJvdHRvbUNhcmQoKVxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiB0eXBlMUFycmF5OnR5cGUxQXJyYXksXHJcbiAgICAgICAgICAgIHR5cGUyQXJyYXk6dHlwZTJBcnJheSxcclxuICAgICAgICAgICAgdHlwZTNBcnJheTp0eXBlM0FycmF5LFxyXG4gICAgICAgICAgICB0eXBlNEFycmF5OnR5cGU0QXJyYXksXHJcbiAgICAgICAgICAgIGhvc3RBcnJheTpob3N0QXJyYXksXHJcbiAgICAgICAgICAgIHRvdGFsOnRvdGFsXHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZUJvdHRvbUNhcmQ6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgbGV0IHN0YXJ0UG9zaXRpb24gPSAwO1xyXG4gICAgICAgIGxldCB1c2VyT2JqID0gdGhpcy5wb2tlclBsYXllclswXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHVzZXJPYmoudG90YWwubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgLy8g5L2/55So57uZ5a6a55qE5qih5p2/5Zyo5Zy65pmv5Lit55Sf5oiQ5LiA5Liq5paw6IqC54K5XHJcbiAgICAgICAgICAgIHZhciBuZXdTdGFyID0gY2MuaW5zdGFudGlhdGUodGhpcy5jYXJkUHJlZmFiKTtcclxuICAgICAgICAgICAgLy8gbmV3U3Rhci5zZXRQaWNOdW0oXCJpXCIraSk7XHJcbiAgICAgICAgICAgIG5ld1N0YXIuZ2V0Q29tcG9uZW50KCdDYXJkJykucGljTnVtID0gdXNlck9iai50b3RhbFtpXTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXJDb250cm9sTm9kZUFycmF5LnB1c2gobmV3U3Rhcik7XHJcbiAgICAgICAgICAgIC8vIHRoaXMubm9kZS5hZGRDaGlsZChuZXdTdGFyKTtcclxuICAgICAgICAgICAgdGhpcy5sYXlvdXRDb250YWluZXIubm9kZS5hZGRDaGlsZChuZXdTdGFyKTtcclxuICAgICAgICAgICAgbGV0IGhlaWdodCA9IHRoaXMuZ3JvdW5kLmhlaWdodCAvIDIgKiAtMTtcclxuICAgICAgICAgICAgc3RhcnRQb3NpdGlvbiA9IGkgKiB0aGlzLmNhcmRXaWR0aDtcclxuICAgICAgICAgICAgaWYgKGkgPiAxMykge1xyXG4gICAgICAgICAgICAgICAgaGVpZ2h0ID0gaGVpZ2h0IC0gMTUwXHJcbiAgICAgICAgICAgICAgICBzdGFydFBvc2l0aW9uID0gKGkgLSAxMykgKiB0aGlzLmNhcmRXaWR0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBuZXdTdGFyLnNldFBvc2l0aW9uKGNjLnYyKC0yMDAgKyB0aGlzLnN0YXJ0Q2FyZFBvc3Rpb24gKyBzdGFydFBvc2l0aW9uLCBoZWlnaHQpKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICBnZXROZXdTdGFyUG9zaXRpb246IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgcmFuZFggPSAwO1xyXG4gICAgICAgIC8vIOagueaNruWcsOW5s+mdouS9jee9ruWSjOS4u+inkui3s+i3g+mrmOW6pu+8jOmaj+acuuW+l+WIsOS4gOS4quaYn+aYn+eahCB5IOWdkOagh1xyXG4gICAgICAgIHZhciByYW5kWSA9IHRoaXMuZ3JvdW5kWSArIE1hdGgucmFuZG9tKCkgKiB0aGlzLnBsYXllci5nZXRDb21wb25lbnQoJ1BsYXllcicpLmp1bXBIZWlnaHQgKyA1MDtcclxuICAgICAgICAvLyDmoLnmja7lsY/luZXlrr3luqbvvIzpmo/mnLrlvpfliLDkuIDkuKrmmJ/mmJ8geCDlnZDmoIdcclxuICAgICAgICB2YXIgbWF4WCA9IHRoaXMubm9kZS53aWR0aCAvIDI7XHJcbiAgICAgICAgcmFuZFggPSAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiAyICogbWF4WDtcclxuICAgICAgICAvLyDov5Tlm57mmJ/mmJ/lnZDmoIdcclxuICAgICAgICByZXR1cm4gY2MudjIocmFuZFgsIHJhbmRZKTtcclxuICAgIH0sXHJcbiAgICBnZXRDYXJkQm90dG9tUG9zaXRpb246IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgcmFuZFggPSB0aGlzLmN1cnJlbnRDYXJkUG9zaXRpb247XHJcbiAgICAgICAgdmFyIHJhbmRZID0gMDtcclxuICAgICAgICB0aGlzLmN1cnJlbnRDYXJkUG9zaXRpb24gPSB0aGlzLmN1cnJlbnRDYXJkUG9zaXRpb24gKyB0aGlzLmNhcmRXaWR0aDtcclxuICAgICAgICByZXR1cm4gY2MudjIocmFuZFgsIHJhbmRZKTtcclxuICAgIH0sXHJcblxyXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcclxuICAgICAgICAvLyDmr4/luKfmm7TmlrDorqHml7blmajvvIzotoXov4fpmZDluqbov5jmsqHmnInnlJ/miJDmlrDnmoTmmJ/mmJ9cclxuICAgICAgICAvLyDlsLHkvJrosIPnlKjmuLjmiI/lpLHotKXpgLvovpFcclxuICAgICAgICAvLyBpZiAodGhpcy50aW1lciA+IHRoaXMuc3RhckR1cmF0aW9uKSB7XHJcbiAgICAgICAgLy8gICAgIHRoaXMuZ2FtZU92ZXIoKTtcclxuICAgICAgICAvLyAgICAgdGhpcy5lbmFibGVkID0gZmFsc2U7ICAgLy8gZGlzYWJsZSBnYW1lT3ZlciBsb2dpYyB0byBhdm9pZCBsb2FkIHNjZW5lIHJlcGVhdGVkbHlcclxuICAgICAgICAvLyAgICAgcmV0dXJuO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICAvLyB0aGlzLnRpbWVyICs9IGR0O1xyXG4gICAgfSxcclxuXHJcbiAgICBnYWluU2NvcmU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnNjb3JlICs9IDE7XHJcbiAgICAgICAgLy8g5pu05pawIHNjb3JlRGlzcGxheSBMYWJlbCDnmoTmloflrZdcclxuICAgICAgICB0aGlzLnNjb3JlRGlzcGxheS5zdHJpbmcgPSAnU2NvcmU6ICcgKyB0aGlzLnNjb3JlO1xyXG4gICAgICAgIC8vIOaSreaUvuW+l+WIhumfs+aViFxyXG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGhpcy5zY29yZUF1ZGlvLCBmYWxzZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGdhbWVPdmVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIuc3RvcEFsbEFjdGlvbnMoKTsgLy/lgZzmraIgcGxheWVyIOiKgueCueeahOi3s+i3g+WKqOS9nFxyXG4gICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZSgnZ2FtZScpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICog5oqK54mM5Y+R57uZ5Zub5a62XHJcbiAgICAqL1xyXG4gICAgcHVibGlzaFBva2VyczogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMucG9rZXJQbGF5ZXIgPSBbXTtcclxuICAgICAgICB0aGlzLmdhbWVIb3N0ID0gbnVsbDtcclxuICAgICAgICBsZXQgcG9rZXJBcnJheSA9IHRoaXMuY2FyZEFycmF5LnNsaWNlKDApO1xyXG4gICAgICAgIGxldCBob3N0ID0gcGFyc2VJbnQoTWF0aC5yYW5kb20oKSAqIDQpOy8v6ZqP5py65Li754mM6Iqx6ImyXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IHBsYXllclBva2VyQXJyYXkgPSBbXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAyNzsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcG9rZXJOdW0gPSBNYXRoLnJhbmRvbSgpICogcG9rZXJBcnJheS5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICBwb2tlck51bSA9IHBhcnNlSW50KHBva2VyTnVtKTtcclxuICAgICAgICAgICAgICAgIC8v5o+S5YWl5omL54mM5LitXHJcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSBwb2tlckFycmF5LnNwbGljZShwb2tlck51bSwgMSk7XHJcbiAgICAgICAgICAgICAgICBwbGF5ZXJQb2tlckFycmF5LnB1c2godmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2FtZUhvc3QgPT0gbnVsbCkgey8v6ZqP5py65Yiw5Li75ZCO77yM56ys5LiA5byg5Li754mM5Lqu5Ye6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGhvc3QgPT0gUG9rZXJVdGlsLnF1YXJ5UG9rZXJUeXBlVmFsdWUodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZUhvc3QgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHBlbmRMb2coXCLmnKzova7muLjmiI8s5Li754mMXCIgKyBQb2tlclV0aWwucXVhcnlQb2tlclZhbHVlKHZhbHVlKSArIFwi5ZyoXCIgKyB0aGlzLmV4cGFuZFBsYXllcihpKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBwbGF5ZXJPYmogPSBQb2tlclV0aWwuc29ydFBva2Vycyhob3N0LCBwbGF5ZXJQb2tlckFycmF5KTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJvbmlvbj09PT1cIiwgSlNPTi5zdHJpbmdpZnkocGxheWVyT2JqKSk7XHJcbiAgICAgICAgICAgIHRoaXMucG9rZXJQbGF5ZXIucHVzaChwbGF5ZXJPYmopO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNwYXduQm90dG9tQ2FyZCgpO1xyXG5cclxuICAgIH0sXHJcbiAgICBleHBhbmRQbGF5ZXI6IGZ1bmN0aW9uIChsb2NhdGlvbikge1xyXG4gICAgICAgIHN3aXRjaCAobG9jYXRpb24pIHtcclxuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gXCLoh6rlt7FcIlxyXG4gICAgICAgICAgICBjYXNlIDE6IHJldHVybiBcIuS4i+WutlwiXHJcbiAgICAgICAgICAgIGNhc2UgMjogcmV0dXJuIFwi5a+55a62XCJcclxuICAgICAgICAgICAgY2FzZSAzOiByZXR1cm4gXCLkuIrlrrZcIlxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG4gICAgYXBwZW5kTG9nOiBmdW5jdGlvbiAoc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5wbGF5TG9nID0gdGhpcy5wbGF5TG9nICsgXCJcXG5cIiArIHN0cmluZztcclxuICAgICAgICB0aGlzLmxvZ0xhYmVsLnN0cmluZyA9IHRoaXMucGxheUxvZztcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG59KTtcclxuIl19