
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
    // 获取地平面的 y 轴坐标
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

    this.score = 0;
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
    this.roundHost = roundHost;
    this.sendArray = sendArray;
    var sendCard = this.logicHelper.sendAIFollowCard(this.gameHost, roundHost, sendArray, this.pokerPlayer[currentPlayer]);
    sendArray.push(sendCard);
    this.saveRoundPoker(sendCard, currentPlayer + 1, 0);
  },

  /**
   * 玩家出牌 出牌按钮可以点击
   * @param gameHost
   * @param roundHost
   * @param sendArray
   * @param currentPlayer
   */
  onUserPlayCallBack: function onUserPlayCallBack(gameHost, roundHost, sendArray, currentPlayer) {},
  roundOverCallBack: function roundOverCallBack(winnerPosition, sumSocer) {
    PokerUtil.destoryArray(this.roundPoker);
    this.score = sumSocer + this.score;
    this.roundHost = null;
    this.logicHelper.roundProgram(this.onUserPlayCallBack, this.onRoundCallBack, this.roundOverCallBack, winnerPosition, this.gameHost, []);
  },
  refreshCallback: function refreshCallback(button) {
    this.publishPokers();
  },
  sendCallback: function sendCallback(button) {
    // let sendArray = [];
    var willSendCard = [];

    for (var i = 0; i < this.playerControlNodeArray.length; i++) {
      //判断是否可出
      var node = this.playerControlNodeArray[i].getComponent('Card');

      if (node.isCheck) {
        willSendCard.push(node.picNum);
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

    this.sendArray.push(willSendCard);
    this.logicHelper.roundProgram(this.onUserPlayCallBack, this.onRoundCallBack, this.roundOverCallBack, 0, this.gameHost, this.sendArray); // let secondCardArray = this.logicHelper.sendAIFollowCard(this.gameHost, 1, sendArray, this.pokerPlayer[1]);
    //
    // sendArray.push(secondCardArray);
    //
    // this.saveRoundPoker(secondCardArray, 2, 0);
    // let thridCardArray = this.logicHelper.sendAIFollowCard(this.gameHost, 2, sendArray, this.pokerPlayer[2]);
    // sendArray.push(thridCardArray);
    // this.saveRoundPoker(thridCardArray, 3, 0);
    // this.appendLog("我出" + sendArray + "下家出" + secondCardArray + "对家出" + thridCardArray);
  },
  //保存出牌  1 2 3 4 顺时针位
  saveRoundPoker: function saveRoundPoker(picNum, index, offset) {
    var newStar = cc.instantiate(this.cardPrefab); // newStar.setPicNum("i"+i);

    newStar.getComponent('Card').picNum = picNum;
    newStar.scaleX = 0.5;
    newStar.scaleY = 0.5;
    this.roundPoker.push(newStar); // this.node.addChild(newStar);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcR2FtZS5qcyJdLCJuYW1lcyI6WyJQb2tlclV0aWwiLCJyZXF1aXJlIiwiQUlIZWxwZXIiLCJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsInN0YXJQcmVmYWIiLCJ0eXBlIiwiUHJlZmFiIiwiY2FyZFByZWZhYiIsIm1heFN0YXJEdXJhdGlvbiIsIm1pblN0YXJEdXJhdGlvbiIsImN1cnJlbnRDYXJkUG9zaXRpb24iLCJzdGFydENhcmRQb3N0aW9uIiwiY2FyZFdpZHRoIiwibG9naWNIZWxwZXIiLCJjYXJkQXJyYXkiLCJTdHJpbmciLCJwb2tlclBsYXllciIsInJvdW5kUG9rZXIiLCJwbGF5ZXJDb250cm9sTm9kZUFycmF5IiwicmVmcmVzaEJ1dHRvbiIsIkJ1dHRvbiIsInNlbmRCdXR0b24iLCJjdXJyZW50V2lubmVyIiwiZ2FtZUhvc3QiLCJsYXlvdXRDb250YWluZXIiLCJMYXlvdXQiLCJsYXlvdXRCb3R0b20iLCJsYXlvdXRUb3AiLCJsYXlvdXRMZWZ0IiwibGF5b3V0UmlnaHQiLCJsb2dMYWJlbCIsIkxhYmVsIiwicGxheUxvZyIsImdyb3VuZCIsIk5vZGUiLCJwbGF5ZXIiLCJzY29yZURpc3BsYXkiLCJzY29yZUF1ZGlvIiwiQXVkaW9DbGlwIiwib25Mb2FkIiwiZ3JvdW5kWSIsInkiLCJoZWlnaHQiLCJ0aW1lciIsInN0YXJEdXJhdGlvbiIsImkiLCJwcmUiLCJqIiwic3RyIiwicHVzaCIsIm5vZGUiLCJvbiIsInJlZnJlc2hDYWxsYmFjayIsInNlbmRDYWxsYmFjayIsInB1Ymxpc2hQb2tlcnMiLCJzY29yZSIsInJvdW5kUHJvZ3JhbSIsIm9uVXNlclBsYXlDYWxsQmFjayIsIm9uUm91bmRDYWxsQmFjayIsInJvdW5kT3ZlckNhbGxCYWNrIiwicm91bmRIb3N0Iiwic2VuZEFycmF5IiwiY3VycmVudFBsYXllciIsInNlbmRDYXJkIiwic2VuZEFJRm9sbG93Q2FyZCIsInNhdmVSb3VuZFBva2VyIiwid2lubmVyUG9zaXRpb24iLCJzdW1Tb2NlciIsImRlc3RvcnlBcnJheSIsImJ1dHRvbiIsIndpbGxTZW5kQ2FyZCIsImxlbmd0aCIsImdldENvbXBvbmVudCIsImlzQ2hlY2siLCJwaWNOdW0iLCJtZXNzYWdlIiwiY2hlY2tVc2VyQ2FuU2VuZCIsImNvbnNvbGUiLCJsb2ciLCJkZXN0cm95Iiwic3BsaWNlIiwiaW5kZXgiLCJvZmZzZXQiLCJuZXdTdGFyIiwiaW5zdGFudGlhdGUiLCJzY2FsZVgiLCJzY2FsZVkiLCJhZGRDaGlsZCIsInJlbW92ZVBva2VyRnJvbUFycmF5Iiwic3Bhd25OZXdTdGFyIiwic2V0UG9zaXRpb24iLCJnZXROZXdTdGFyUG9zaXRpb24iLCJnYW1lIiwiTWF0aCIsInJhbmRvbSIsInNwYXduQm90dG9tQ2FyZCIsImRlc3RvcnlOb2RlIiwiY3JlYXRlQm90dG9tQ2FyZCIsInN0YXJ0UG9zaXRpb24iLCJ1c2VyT2JqIiwidG90YWwiLCJyYW5kWCIsInJhbmRZIiwianVtcEhlaWdodCIsIm1heFgiLCJ3aWR0aCIsInYyIiwiZ2V0Q2FyZEJvdHRvbVBvc2l0aW9uIiwidXBkYXRlIiwiZHQiLCJnYWluU2NvcmUiLCJzdHJpbmciLCJhdWRpb0VuZ2luZSIsInBsYXlFZmZlY3QiLCJnYW1lT3ZlciIsInN0b3BBbGxBY3Rpb25zIiwiZGlyZWN0b3IiLCJsb2FkU2NlbmUiLCJwb2tlckFycmF5Iiwic2xpY2UiLCJob3N0IiwicGFyc2VJbnQiLCJwbGF5ZXJQb2tlckFycmF5IiwicG9rZXJOdW0iLCJ2YWx1ZSIsInF1YXJ5UG9rZXJUeXBlVmFsdWUiLCJhcHBlbmRMb2ciLCJxdWFyeVBva2VyVmFsdWUiLCJleHBhbmRQbGF5ZXIiLCJwbGF5ZXJPYmoiLCJzb3J0UG9rZXJzIiwiSlNPTiIsInN0cmluZ2lmeSIsImxvY2F0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLElBQUlBLFNBQVMsR0FBR0MsT0FBTyxDQUFDLFdBQUQsQ0FBdkI7O0FBQ0EsSUFBSUMsUUFB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UyxHQUFHcEksU0FBUyxDQUFDcUksVUFBVixDQUFxQlYsSUFBckIsRUFBMkJFLGdCQUEzQixDQUFoQjtBQUNBN0MsTUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksV0FBWixFQUF5QnFELElBQUksQ0FBQ0MsU0FBTCxDQUFlSCxTQUFmLENBQXpCO0FBQ0EsV0FBS2pILFdBQUwsQ0FBaUJpQyxJQUFqQixDQUFzQmdGLFNBQXRCO0FBQ0g7O0FBQ0QsU0FBS2xDLGVBQUw7QUFFSCxHQTdXSTtBQThXTGlDLEVBQUFBLFlBQVksRUFBRSxzQkFBVUssUUFBVixFQUFvQjtBQUM5QixZQUFRQSxRQUFSO0FBQ0ksV0FBSyxDQUFMO0FBQVEsZUFBTyxJQUFQOztBQUNSLFdBQUssQ0FBTDtBQUFRLGVBQU8sSUFBUDs7QUFDUixXQUFLLENBQUw7QUFBUSxlQUFPLElBQVA7O0FBQ1IsV0FBSyxDQUFMO0FBQVEsZUFBTyxJQUFQO0FBSlo7QUFPSCxHQXRYSTtBQXVYTFAsRUFBQUEsU0FBUyxFQUFFLG1CQUFVZixNQUFWLEVBQWtCO0FBQ3pCLFNBQUsvRSxPQUFMLEdBQWUsS0FBS0EsT0FBTCxHQUFlLElBQWYsR0FBc0IrRSxNQUFyQztBQUNBLFNBQUtqRixRQUFMLENBQWNpRixNQUFkLEdBQXVCLEtBQUsvRSxPQUE1QjtBQUNIO0FBMVhJLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5sZXQgUG9rZXJVdGlsID0gcmVxdWlyZShcIlBva2VyVXRpbFwiKTtcclxubGV0IEFJSGVscGVyID0gcmVxdWlyZShcIkFJSGVscGVyXCIpO1xyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIC8vIOi/meS4quWxnuaAp+W8leeUqOS6huaYn+aYn+mihOWItui1hOa6kFxyXG4gICAgICAgIHN0YXJQcmVmYWI6IHtcclxuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcclxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBjYXJkUHJlZmFiOiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8g5pif5pif5Lqn55Sf5ZCO5raI5aSx5pe26Ze055qE6ZqP5py66IyD5Zu0XHJcbiAgICAgICAgbWF4U3RhckR1cmF0aW9uOiAwLFxyXG4gICAgICAgIG1pblN0YXJEdXJhdGlvbjogMCxcclxuICAgICAgICBjdXJyZW50Q2FyZFBvc2l0aW9uOiAwLFxyXG4gICAgICAgIHN0YXJ0Q2FyZFBvc3Rpb246IDAsXHJcbiAgICAgICAgY2FyZFdpZHRoOiA4MCxcclxuICAgICAgICBsb2dpY0hlbHBlcjogbnVsbCxcclxuICAgICAgICBjYXJkQXJyYXk6IFtjYy5TdHJpbmddLFxyXG4gICAgICAgIC8v5Yid5aeL54mM5pWw57uEIOmAhuaXtumSiCDkuLvop5LmmK/nrKzkuIDkuKrmlbDnu4RcclxuICAgICAgICBwb2tlclBsYXllcjogW10sXHJcbiAgICAgICAgLy/lvZPliY3ova7mrKHlh7rniYzoioLngrksXHJcbiAgICAgICAgcm91bmRQb2tlcjogW10sXHJcbiAgICAgICAgLy/kuLvop5LlvZPliY3niYzoioLngrlcclxuICAgICAgICBwbGF5ZXJDb250cm9sTm9kZUFycmF5OiBbXSxcclxuICAgICAgICAvL+a0l+eJjFxyXG4gICAgICAgIHJlZnJlc2hCdXR0b246IHtcclxuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcclxuICAgICAgICAgICAgdHlwZTogY2MuQnV0dG9uXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvL+WHuueJjFxyXG4gICAgICAgIHNlbmRCdXR0b246IHtcclxuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcclxuICAgICAgICAgICAgdHlwZTogY2MuQnV0dG9uXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy/lvZPliY3og5zmlrlcclxuICAgICAgICBjdXJyZW50V2lubmVyOiAxLFxyXG4gICAgICAgIC8v5pys6L2u5Li7XHJcbiAgICAgICAgZ2FtZUhvc3Q6IFwiMVwiLFxyXG4gICAgICAgIC8v546p5a625oul5pyJ54mMXHJcbiAgICAgICAgbGF5b3V0Q29udGFpbmVyOiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6IGNjLkxheW91dFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy/njqnlrrblh7rnmoTniYwgXHJcbiAgICAgICAgbGF5b3V0Qm90dG9tOiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6IGNjLkxheW91dFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy/lr7nlrrblh7rniYwg56ys5LiJ5L2NXHJcbiAgICAgICAgbGF5b3V0VG9wOiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6IGNjLkxheW91dFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy/kuIvlrrblh7rniYwg5bem5omL56ys5LqM5L2NXHJcbiAgICAgICAgbGF5b3V0TGVmdDoge1xyXG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxyXG4gICAgICAgICAgICB0eXBlOiBjYy5MYXlvdXRcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8v5LiK5a625Ye654mM77yM5Y+z5omL56ys5Zub5L2NXHJcbiAgICAgICAgbGF5b3V0UmlnaHQ6IHtcclxuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcclxuICAgICAgICAgICAgdHlwZTogY2MuTGF5b3V0XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvL+aImOaKpVxyXG4gICAgICAgIGxvZ0xhYmVsOiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBwbGF5TG9nOiBcIua4uOaIj+W8gOWni1wiLFxyXG4gICAgICAgIC8vIOWcsOmdouiKgueCue+8jOeUqOS6juehruWumuaYn+aYn+eUn+aIkOeahOmrmOW6plxyXG4gICAgICAgIGdyb3VuZDoge1xyXG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxyXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyBwbGF5ZXIg6IqC54K577yM55So5LqO6I635Y+W5Li76KeS5by56Lez55qE6auY5bqm77yM5ZKM5o6n5Yi25Li76KeS6KGM5Yqo5byA5YWzXHJcbiAgICAgICAgcGxheWVyOiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIHNjb3JlIGxhYmVsIOeahOW8leeUqFxyXG4gICAgICAgIHNjb3JlRGlzcGxheToge1xyXG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxyXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8g5b6X5YiG6Z+z5pWI6LWE5rqQXHJcbiAgICAgICAgc2NvcmVBdWRpbzoge1xyXG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxyXG4gICAgICAgICAgICB0eXBlOiBjYy5BdWRpb0NsaXBcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuXHJcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyDojrflj5blnLDlubPpnaLnmoQgeSDovbTlnZDmoIdcclxuICAgICAgICB0aGlzLmdyb3VuZFkgPSB0aGlzLmdyb3VuZC55ICsgdGhpcy5ncm91bmQuaGVpZ2h0IC8gMjtcclxuICAgICAgICAvLyDliJ3lp4vljJborqHml7blmahcclxuICAgICAgICB0aGlzLnRpbWVyID0gMDtcclxuICAgICAgICB0aGlzLnN0YXJEdXJhdGlvbiA9IDA7XHJcbiAgICAgICAgdGhpcy5sb2dpY0hlbHBlciA9IG5ldyBBSUhlbHBlcigpO1xyXG4gICAgICAgIC8v5Yib5bu65Zu+54mH6LWE5rqQXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMzsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBwcmUgPSAzICsgaTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDE7IGogPCA1OyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBzdHIgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgaWYgKHByZSA8IDEwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RyID0gXCIwXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBzdHIgPSBzdHIgKyBwcmUgKyBqO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYXJkQXJyYXkucHVzaChzdHIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYXJkQXJyYXkucHVzaChzdHIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY2FyZEFycmF5LnB1c2goXCIxNjFcIik7XHJcbiAgICAgICAgdGhpcy5jYXJkQXJyYXkucHVzaChcIjE2MVwiKTtcclxuICAgICAgICB0aGlzLmNhcmRBcnJheS5wdXNoKFwiMTcxXCIpO1xyXG4gICAgICAgIHRoaXMuY2FyZEFycmF5LnB1c2goXCIxNzFcIik7XHJcblxyXG5cclxuICAgICAgICB0aGlzLnJlZnJlc2hCdXR0b24ubm9kZS5vbignY2xpY2snLCB0aGlzLnJlZnJlc2hDYWxsYmFjaywgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5zZW5kQnV0dG9uLm5vZGUub24oJ2NsaWNrJywgdGhpcy5zZW5kQ2FsbGJhY2ssIHRoaXMpO1xyXG4gICAgICAgIHRoaXMucHVibGlzaFBva2VycygpO1xyXG4gICAgICAgIC8vIHRoaXMuc3Bhd25OZXdTdGFyKCk7XHJcbiAgICAgICAgLy8g5Yid5aeL5YyW6K6h5YiGXHJcbiAgICAgICAgdGhpcy5zY29yZSA9IDA7XHJcbiAgICAgICAgdGhpcy5sb2dpY0hlbHBlci5yb3VuZFByb2dyYW0odGhpcy5vblVzZXJQbGF5Q2FsbEJhY2ssdGhpcy5vblJvdW5kQ2FsbEJhY2ssdGhpcy5yb3VuZE92ZXJDYWxsQmFjaywwLHRoaXMuZ2FtZUhvc3QsW10pO1xyXG4gICAgfSxcclxuICAgIC8qKlxyXG4gICAgICog55S16ISR5Ye654mM77yM55u05o6l5riy5p+TXHJcbiAgICAgKiBAcGFyYW0gZ2FtZUhvc3RcclxuICAgICAqIEBwYXJhbSByb3VuZEhvc3RcclxuICAgICAqIEBwYXJhbSBzZW5kQXJyYXlcclxuICAgICAqIEBwYXJhbSBjdXJyZW50UGxheWVyXHJcbiAgICAgKi9cclxuICAgICBvblJvdW5kQ2FsbEJhY2s6ZnVuY3Rpb24oZ2FtZUhvc3QsIHJvdW5kSG9zdCwgc2VuZEFycmF5LCBjdXJyZW50UGxheWVyKXtcclxuICAgICAgICAgdGhpcy5yb3VuZEhvc3Q9cm91bmRIb3N0O1xyXG4gICAgICAgICB0aGlzLnNlbmRBcnJheT1zZW5kQXJyYXk7XHJcbiAgICAgICBsZXQgc2VuZENhcmQ9IHRoaXMubG9naWNIZWxwZXIuc2VuZEFJRm9sbG93Q2FyZCh0aGlzLmdhbWVIb3N0LCByb3VuZEhvc3QsIHNlbmRBcnJheSwgdGhpcy5wb2tlclBsYXllcltjdXJyZW50UGxheWVyXSk7XHJcbiAgICAgICAgc2VuZEFycmF5LnB1c2goc2VuZENhcmQpO1xyXG4gICAgICAgIHRoaXMuc2F2ZVJvdW5kUG9rZXIoc2VuZENhcmQsIGN1cnJlbnRQbGF5ZXIrMSwgMCk7XHJcbiAgICB9LFxyXG4gICAgLyoqXHJcbiAgICAgKiDnjqnlrrblh7rniYwg5Ye654mM5oyJ6ZKu5Y+v5Lul54K55Ye7XHJcbiAgICAgKiBAcGFyYW0gZ2FtZUhvc3RcclxuICAgICAqIEBwYXJhbSByb3VuZEhvc3RcclxuICAgICAqIEBwYXJhbSBzZW5kQXJyYXlcclxuICAgICAqIEBwYXJhbSBjdXJyZW50UGxheWVyXHJcbiAgICAgKi9cclxuICAgIG9uVXNlclBsYXlDYWxsQmFjazpmdW5jdGlvbiAoZ2FtZUhvc3QsIHJvdW5kSG9zdCwgc2VuZEFycmF5LCBjdXJyZW50UGxheWVyKSB7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICByb3VuZE92ZXJDYWxsQmFjazpmdW5jdGlvbih3aW5uZXJQb3NpdGlvbixzdW1Tb2Nlcil7XHJcbiAgICAgICAgUG9rZXJVdGlsLmRlc3RvcnlBcnJheSh0aGlzLnJvdW5kUG9rZXIpO1xyXG4gICAgICAgIHRoaXMuc2NvcmU9c3VtU29jZXIrdGhpcy5zY29yZTtcclxuICAgICAgICB0aGlzLnJvdW5kSG9zdD1udWxsO1xyXG4gICAgICAgIHRoaXMubG9naWNIZWxwZXIucm91bmRQcm9ncmFtKHRoaXMub25Vc2VyUGxheUNhbGxCYWNrLHRoaXMub25Sb3VuZENhbGxCYWNrLFxyXG4gICAgICAgICAgICB0aGlzLnJvdW5kT3ZlckNhbGxCYWNrLHdpbm5lclBvc2l0aW9uLHRoaXMuZ2FtZUhvc3QsW10pO1xyXG4gICAgfSxcclxuXHJcblxyXG4gICAgcmVmcmVzaENhbGxiYWNrOiBmdW5jdGlvbiAoYnV0dG9uKSB7XHJcbiAgICAgICAgdGhpcy5wdWJsaXNoUG9rZXJzKCk7XHJcbiAgICB9LFxyXG4gICAgc2VuZENhbGxiYWNrOiBmdW5jdGlvbiAoYnV0dG9uKSB7XHJcbiAgICAgICAgLy8gbGV0IHNlbmRBcnJheSA9IFtdO1xyXG4gICAgICAgIGxldCB3aWxsU2VuZENhcmQ9W107XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBsYXllckNvbnRyb2xOb2RlQXJyYXkubGVuZ3RoO2krKykge1xyXG4gICAgICAgICAgICAvL+WIpOaWreaYr+WQpuWPr+WHulxyXG4gICAgICAgICAgICBsZXQgbm9kZSA9IHRoaXMucGxheWVyQ29udHJvbE5vZGVBcnJheVtpXS5nZXRDb21wb25lbnQoJ0NhcmQnKTtcclxuICAgICAgICAgICAgaWYgKG5vZGUuaXNDaGVjaykge1xyXG4gICAgICAgICAgICAgICAgd2lsbFNlbmRDYXJkLnB1c2gobm9kZS5waWNOdW0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIHRoaXMucGxheWVyQ29udHJvbE5vZGVBcnJheVtpXS5kZXN0cm95KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBtZXNzYWdlPXRoaXMubG9naWNIZWxwZXIuY2hlY2tVc2VyQ2FuU2VuZCh0aGlzLmdhbWVIb3N0LHRoaXMucm91bmRIb3N0LHRoaXMucG9rZXJQbGF5ZXJbMF0sd2lsbFNlbmRDYXJkKTtcclxuICAgICAgICBpZighbWVzc2FnZSl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib25pb25cIixcIuS4jeiDveWHulwiK21lc3NhZ2UpO1xyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8v5Ye654mMIOenu+mZpOW5tua3u+WKoFxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJDb250cm9sTm9kZUFycmF5Lmxlbmd0aDspIHtcclxuICAgICAgICAgICAgLy/liKTmlq3mmK/lkKblj6/lh7pcclxuICAgICAgICAgICAgbGV0IG5vZGUgPSB0aGlzLnBsYXllckNvbnRyb2xOb2RlQXJyYXlbaV0uZ2V0Q29tcG9uZW50KCdDYXJkJyk7XHJcbiAgICAgICAgICAgIGlmIChub2RlLmlzQ2hlY2spIHtcclxuICAgICAgICAgICAgICAgIC8vIHdpbGxTZW5kQXJyYXkucHVzaChub2RlLnBpY051bSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNhdmVSb3VuZFBva2VyKG5vZGUucGljTnVtLCAxLCBpICogdGhpcy5jYXJkV2lkdGgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXJDb250cm9sTm9kZUFycmF5W2ldLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxheWVyQ29udHJvbE5vZGVBcnJheS5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gdGhpcy5wbGF5ZXJDb250cm9sTm9kZUFycmF5W2ldLmRlc3Ryb3koKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zZW5kQXJyYXkucHVzaCh3aWxsU2VuZENhcmQpO1xyXG4gICAgICAgIHRoaXMubG9naWNIZWxwZXIucm91bmRQcm9ncmFtKHRoaXMub25Vc2VyUGxheUNhbGxCYWNrLHRoaXMub25Sb3VuZENhbGxCYWNrLFxyXG4gICAgICAgICAgICB0aGlzLnJvdW5kT3ZlckNhbGxCYWNrLDAsdGhpcy5nYW1lSG9zdCx0aGlzLnNlbmRBcnJheSk7XHJcbiAgICAgICAgLy8gbGV0IHNlY29uZENhcmRBcnJheSA9IHRoaXMubG9naWNIZWxwZXIuc2VuZEFJRm9sbG93Q2FyZCh0aGlzLmdhbWVIb3N0LCAxLCBzZW5kQXJyYXksIHRoaXMucG9rZXJQbGF5ZXJbMV0pO1xyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gc2VuZEFycmF5LnB1c2goc2Vjb25kQ2FyZEFycmF5KTtcclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vIHRoaXMuc2F2ZVJvdW5kUG9rZXIoc2Vjb25kQ2FyZEFycmF5LCAyLCAwKTtcclxuICAgICAgICAvLyBsZXQgdGhyaWRDYXJkQXJyYXkgPSB0aGlzLmxvZ2ljSGVscGVyLnNlbmRBSUZvbGxvd0NhcmQodGhpcy5nYW1lSG9zdCwgMiwgc2VuZEFycmF5LCB0aGlzLnBva2VyUGxheWVyWzJdKTtcclxuICAgICAgICAvLyBzZW5kQXJyYXkucHVzaCh0aHJpZENhcmRBcnJheSk7XHJcbiAgICAgICAgLy8gdGhpcy5zYXZlUm91bmRQb2tlcih0aHJpZENhcmRBcnJheSwgMywgMCk7XHJcbiAgICAgICAgLy8gdGhpcy5hcHBlbmRMb2coXCLmiJHlh7pcIiArIHNlbmRBcnJheSArIFwi5LiL5a625Ye6XCIgKyBzZWNvbmRDYXJkQXJyYXkgKyBcIuWvueWutuWHulwiICsgdGhyaWRDYXJkQXJyYXkpO1xyXG4gICAgfSxcclxuICAgIC8v5L+d5a2Y5Ye654mMICAxIDIgMyA0IOmhuuaXtumSiOS9jVxyXG4gICAgc2F2ZVJvdW5kUG9rZXI6IGZ1bmN0aW9uIChwaWNOdW0sIGluZGV4LCBvZmZzZXQpIHtcclxuICAgICAgICB2YXIgbmV3U3RhciA9IGNjLmluc3RhbnRpYXRlKHRoaXMuY2FyZFByZWZhYik7XHJcbiAgICAgICAgLy8gbmV3U3Rhci5zZXRQaWNOdW0oXCJpXCIraSk7XHJcbiAgICAgICAgbmV3U3Rhci5nZXRDb21wb25lbnQoJ0NhcmQnKS5waWNOdW0gPSBwaWNOdW07XHJcbiAgICAgICAgbmV3U3Rhci5zY2FsZVggPSAwLjU7XHJcbiAgICAgICAgbmV3U3Rhci5zY2FsZVkgPSAwLjU7XHJcbiAgICAgICAgdGhpcy5yb3VuZFBva2VyLnB1c2gobmV3U3Rhcik7XHJcbiAgICAgICAgLy8gdGhpcy5ub2RlLmFkZENoaWxkKG5ld1N0YXIpO1xyXG4gICAgICAgIC8vIGxldCBoZWlnaHQgPSB0aGlzLmdyb3VuZC5oZWlnaHQgLyAyICogLTE7XHJcbiAgICAgICAgc3dpdGNoIChpbmRleCkge1xyXG4gICAgICAgICAgICBjYXNlIDE6IHRoaXMubGF5b3V0Qm90dG9tLm5vZGUuYWRkQ2hpbGQobmV3U3Rhcik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2ljSGVscGVyLnJlbW92ZVBva2VyRnJvbUFycmF5KHRoaXMuZ2FtZUhvc3QsIHBpY051bSwgdGhpcy5wb2tlclBsYXllclswXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAyOiB0aGlzLmxheW91dExlZnQubm9kZS5hZGRDaGlsZChuZXdTdGFyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9naWNIZWxwZXIucmVtb3ZlUG9rZXJGcm9tQXJyYXkodGhpcy5nYW1lSG9zdCwgcGljTnVtLCB0aGlzLnBva2VyUGxheWVyWzFdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDM6IHRoaXMubGF5b3V0VG9wLm5vZGUuYWRkQ2hpbGQobmV3U3Rhcik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2ljSGVscGVyLnJlbW92ZVBva2VyRnJvbUFycmF5KHRoaXMuZ2FtZUhvc3QsIHBpY051bSwgdGhpcy5wb2tlclBsYXllclsyXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSA0OiB0aGlzLmxheW91dFJpZ2h0Lm5vZGUuYWRkQ2hpbGQobmV3U3Rhcik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2ljSGVscGVyLnJlbW92ZVBva2VyRnJvbUFycmF5KHRoaXMuZ2FtZUhvc3QsIHBpY051bSwgdGhpcy5wb2tlclBsYXllclszXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gbmV3U3Rhci5zZXRQb3NpdGlvbihjYy52MigtMTUwICsgdGhpcy5zdGFydENhcmRQb3N0aW9uICsgb2Zmc2V0LCBoZWlnaHQpKTtcclxuICAgIH0sXHJcbiAgICBzcGF3bk5ld1N0YXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyDkvb/nlKjnu5nlrprnmoTmqKHmnb/lnKjlnLrmma/kuK3nlJ/miJDkuIDkuKrmlrDoioLngrlcclxuICAgICAgICB2YXIgbmV3U3RhciA9IGNjLmluc3RhbnRpYXRlKHRoaXMuc3RhclByZWZhYik7XHJcbiAgICAgICAgLy8g5bCG5paw5aKe55qE6IqC54K55re75Yqg5YiwIENhbnZhcyDoioLngrnkuIvpnaJcclxuICAgICAgICB0aGlzLm5vZGUuYWRkQ2hpbGQobmV3U3Rhcik7XHJcbiAgICAgICAgLy8g5Li65pif5pif6K6+572u5LiA5Liq6ZqP5py65L2N572uXHJcbiAgICAgICAgbmV3U3Rhci5zZXRQb3NpdGlvbih0aGlzLmdldE5ld1N0YXJQb3NpdGlvbigpKTtcclxuICAgICAgICAvLyDlnKjmmJ/mmJ/nu4Tku7bkuIrmmoLlrZggR2FtZSDlr7nosaHnmoTlvJXnlKhcclxuICAgICAgICBuZXdTdGFyLmdldENvbXBvbmVudCgnU3RhcicpLmdhbWUgPSB0aGlzO1xyXG4gICAgICAgIC8vIOmHjee9ruiuoeaXtuWZqO+8jOagueaNrua2iOWkseaXtumXtOiMg+WbtOmaj+acuuWPluS4gOS4quWAvFxyXG4gICAgICAgIHRoaXMuc3RhckR1cmF0aW9uID0gdGhpcy5taW5TdGFyRHVyYXRpb24gKyBNYXRoLnJhbmRvbSgpICogKHRoaXMubWF4U3RhckR1cmF0aW9uIC0gdGhpcy5taW5TdGFyRHVyYXRpb24pO1xyXG4gICAgICAgIHRoaXMudGltZXIgPSAwO1xyXG4gICAgfSxcclxuICAgIC8qKlxyXG4gICAgICog56e76Zmk5pen55qE6IqC54K5XHJcbiAgICAgKiDmt7vliqDmlrDoioLngrlcclxuICAgICAqL1xyXG4gICAgc3Bhd25Cb3R0b21DYXJkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGxheWVyQ29udHJvbE5vZGVBcnJheS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGxldCBkZXN0b3J5Tm9kZSA9IHRoaXMucGxheWVyQ29udHJvbE5vZGVBcnJheTtcclxuICAgICAgICAgICAgUG9rZXJVdGlsLmRlc3RvcnlBcnJheShkZXN0b3J5Tm9kZSk7XHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyQ29udHJvbE5vZGVBcnJheSA9IFtdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jcmVhdGVCb3R0b21DYXJkKClcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogdHlwZTFBcnJheTp0eXBlMUFycmF5LFxyXG4gICAgICAgICAgICB0eXBlMkFycmF5OnR5cGUyQXJyYXksXHJcbiAgICAgICAgICAgIHR5cGUzQXJyYXk6dHlwZTNBcnJheSxcclxuICAgICAgICAgICAgdHlwZTRBcnJheTp0eXBlNEFycmF5LFxyXG4gICAgICAgICAgICBob3N0QXJyYXk6aG9zdEFycmF5LFxyXG4gICAgICAgICAgICB0b3RhbDp0b3RhbFxyXG4gICAgICovXHJcbiAgICBjcmVhdGVCb3R0b21DYXJkOiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIGxldCBzdGFydFBvc2l0aW9uID0gMDtcclxuICAgICAgICBsZXQgdXNlck9iaiA9IHRoaXMucG9rZXJQbGF5ZXJbMF07XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB1c2VyT2JqLnRvdGFsLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIC8vIOS9v+eUqOe7meWumueahOaooeadv+WcqOWcuuaZr+S4reeUn+aIkOS4gOS4quaWsOiKgueCuVxyXG4gICAgICAgICAgICB2YXIgbmV3U3RhciA9IGNjLmluc3RhbnRpYXRlKHRoaXMuY2FyZFByZWZhYik7XHJcbiAgICAgICAgICAgIC8vIG5ld1N0YXIuc2V0UGljTnVtKFwiaVwiK2kpO1xyXG4gICAgICAgICAgICBuZXdTdGFyLmdldENvbXBvbmVudCgnQ2FyZCcpLnBpY051bSA9IHVzZXJPYmoudG90YWxbaV07XHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyQ29udHJvbE5vZGVBcnJheS5wdXNoKG5ld1N0YXIpO1xyXG4gICAgICAgICAgICAvLyB0aGlzLm5vZGUuYWRkQ2hpbGQobmV3U3Rhcik7XHJcbiAgICAgICAgICAgIHRoaXMubGF5b3V0Q29udGFpbmVyLm5vZGUuYWRkQ2hpbGQobmV3U3Rhcik7XHJcbiAgICAgICAgICAgIGxldCBoZWlnaHQgPSB0aGlzLmdyb3VuZC5oZWlnaHQgLyAyICogLTE7XHJcbiAgICAgICAgICAgIHN0YXJ0UG9zaXRpb24gPSBpICogdGhpcy5jYXJkV2lkdGg7XHJcbiAgICAgICAgICAgIGlmIChpID4gMTMpIHtcclxuICAgICAgICAgICAgICAgIGhlaWdodCA9IGhlaWdodCAtIDE1MFxyXG4gICAgICAgICAgICAgICAgc3RhcnRQb3NpdGlvbiA9IChpIC0gMTMpICogdGhpcy5jYXJkV2lkdGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gbmV3U3Rhci5zZXRQb3NpdGlvbihjYy52MigtMjAwICsgdGhpcy5zdGFydENhcmRQb3N0aW9uICsgc3RhcnRQb3NpdGlvbiwgaGVpZ2h0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcblxyXG4gICAgZ2V0TmV3U3RhclBvc2l0aW9uOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHJhbmRYID0gMDtcclxuICAgICAgICAvLyDmoLnmja7lnLDlubPpnaLkvY3nva7lkozkuLvop5Lot7Pot4Ppq5jluqbvvIzpmo/mnLrlvpfliLDkuIDkuKrmmJ/mmJ/nmoQgeSDlnZDmoIdcclxuICAgICAgICB2YXIgcmFuZFkgPSB0aGlzLmdyb3VuZFkgKyBNYXRoLnJhbmRvbSgpICogdGhpcy5wbGF5ZXIuZ2V0Q29tcG9uZW50KCdQbGF5ZXInKS5qdW1wSGVpZ2h0ICsgNTA7XHJcbiAgICAgICAgLy8g5qC55o2u5bGP5bmV5a695bqm77yM6ZqP5py65b6X5Yiw5LiA5Liq5pif5pifIHgg5Z2Q5qCHXHJcbiAgICAgICAgdmFyIG1heFggPSB0aGlzLm5vZGUud2lkdGggLyAyO1xyXG4gICAgICAgIHJhbmRYID0gKE1hdGgucmFuZG9tKCkgLSAwLjUpICogMiAqIG1heFg7XHJcbiAgICAgICAgLy8g6L+U5Zue5pif5pif5Z2Q5qCHXHJcbiAgICAgICAgcmV0dXJuIGNjLnYyKHJhbmRYLCByYW5kWSk7XHJcbiAgICB9LFxyXG4gICAgZ2V0Q2FyZEJvdHRvbVBvc2l0aW9uOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHJhbmRYID0gdGhpcy5jdXJyZW50Q2FyZFBvc2l0aW9uO1xyXG4gICAgICAgIHZhciByYW5kWSA9IDA7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50Q2FyZFBvc2l0aW9uID0gdGhpcy5jdXJyZW50Q2FyZFBvc2l0aW9uICsgdGhpcy5jYXJkV2lkdGg7XHJcbiAgICAgICAgcmV0dXJuIGNjLnYyKHJhbmRYLCByYW5kWSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcbiAgICAgICAgLy8g5q+P5bin5pu05paw6K6h5pe25Zmo77yM6LaF6L+H6ZmQ5bqm6L+Y5rKh5pyJ55Sf5oiQ5paw55qE5pif5pifXHJcbiAgICAgICAgLy8g5bCx5Lya6LCD55So5ri45oiP5aSx6LSl6YC76L6RXHJcbiAgICAgICAgLy8gaWYgKHRoaXMudGltZXIgPiB0aGlzLnN0YXJEdXJhdGlvbikge1xyXG4gICAgICAgIC8vICAgICB0aGlzLmdhbWVPdmVyKCk7XHJcbiAgICAgICAgLy8gICAgIHRoaXMuZW5hYmxlZCA9IGZhbHNlOyAgIC8vIGRpc2FibGUgZ2FtZU92ZXIgbG9naWMgdG8gYXZvaWQgbG9hZCBzY2VuZSByZXBlYXRlZGx5XHJcbiAgICAgICAgLy8gICAgIHJldHVybjtcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgLy8gdGhpcy50aW1lciArPSBkdDtcclxuICAgIH0sXHJcblxyXG4gICAgZ2FpblNjb3JlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5zY29yZSArPSAxO1xyXG4gICAgICAgIC8vIOabtOaWsCBzY29yZURpc3BsYXkgTGFiZWwg55qE5paH5a2XXHJcbiAgICAgICAgdGhpcy5zY29yZURpc3BsYXkuc3RyaW5nID0gJ1Njb3JlOiAnICsgdGhpcy5zY29yZTtcclxuICAgICAgICAvLyDmkq3mlL7lvpfliIbpn7PmlYhcclxuICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KHRoaXMuc2NvcmVBdWRpbywgZmFsc2UpO1xyXG4gICAgfSxcclxuXHJcbiAgICBnYW1lT3ZlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMucGxheWVyLnN0b3BBbGxBY3Rpb25zKCk7IC8v5YGc5q2iIHBsYXllciDoioLngrnnmoTot7Pot4PliqjkvZxcclxuICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoJ2dhbWUnKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAqIOaKiueJjOWPkee7meWbm+WutlxyXG4gICAgKi9cclxuICAgIHB1Ymxpc2hQb2tlcnM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnBva2VyUGxheWVyID0gW107XHJcbiAgICAgICAgdGhpcy5nYW1lSG9zdCA9IG51bGw7XHJcbiAgICAgICAgbGV0IHBva2VyQXJyYXkgPSB0aGlzLmNhcmRBcnJheS5zbGljZSgwKTtcclxuICAgICAgICBsZXQgaG9zdCA9IHBhcnNlSW50KE1hdGgucmFuZG9tKCkgKiA0KTsvL+maj+acuuS4u+eJjOiKseiJslxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBwbGF5ZXJQb2tlckFycmF5ID0gW107XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMjc7IGorKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHBva2VyTnVtID0gTWF0aC5yYW5kb20oKSAqIHBva2VyQXJyYXkubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgcG9rZXJOdW0gPSBwYXJzZUludChwb2tlck51bSk7XHJcbiAgICAgICAgICAgICAgICAvL+aPkuWFpeaJi+eJjOS4rVxyXG4gICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gcG9rZXJBcnJheS5zcGxpY2UocG9rZXJOdW0sIDEpO1xyXG4gICAgICAgICAgICAgICAgcGxheWVyUG9rZXJBcnJheS5wdXNoKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdhbWVIb3N0ID09IG51bGwpIHsvL+maj+acuuWIsOS4u+WQju+8jOesrOS4gOW8oOS4u+eJjOS6ruWHulxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChob3N0ID09IFBva2VyVXRpbC5xdWFyeVBva2VyVHlwZVZhbHVlKHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWVIb3N0ID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwZW5kTG9nKFwi5pys6L2u5ri45oiPLOS4u+eJjFwiICsgUG9rZXJVdGlsLnF1YXJ5UG9rZXJWYWx1ZSh2YWx1ZSkgKyBcIuWcqFwiICsgdGhpcy5leHBhbmRQbGF5ZXIoaSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgcGxheWVyT2JqID0gUG9rZXJVdGlsLnNvcnRQb2tlcnMoaG9zdCwgcGxheWVyUG9rZXJBcnJheSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib25pb249PT09XCIsIEpTT04uc3RyaW5naWZ5KHBsYXllck9iaikpO1xyXG4gICAgICAgICAgICB0aGlzLnBva2VyUGxheWVyLnB1c2gocGxheWVyT2JqKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zcGF3bkJvdHRvbUNhcmQoKTtcclxuXHJcbiAgICB9LFxyXG4gICAgZXhwYW5kUGxheWVyOiBmdW5jdGlvbiAobG9jYXRpb24pIHtcclxuICAgICAgICBzd2l0Y2ggKGxvY2F0aW9uKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIFwi6Ieq5bexXCJcclxuICAgICAgICAgICAgY2FzZSAxOiByZXR1cm4gXCLkuIvlrrZcIlxyXG4gICAgICAgICAgICBjYXNlIDI6IHJldHVybiBcIuWvueWutlwiXHJcbiAgICAgICAgICAgIGNhc2UgMzogcmV0dXJuIFwi5LiK5a62XCJcclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxuICAgIGFwcGVuZExvZzogZnVuY3Rpb24gKHN0cmluZykge1xyXG4gICAgICAgIHRoaXMucGxheUxvZyA9IHRoaXMucGxheUxvZyArIFwiXFxuXCIgKyBzdHJpbmc7XHJcbiAgICAgICAgdGhpcy5sb2dMYWJlbC5zdHJpbmcgPSB0aGlzLnBsYXlMb2c7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxufSk7XHJcbiJdfQ==