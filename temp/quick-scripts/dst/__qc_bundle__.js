
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/__qc_index__.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}
require('./assets/migration/use_v2.0.x_cc.Toggle_event');
require('./assets/scripts/AIHelper');
require('./assets/scripts/Card');
require('./assets/scripts/Game');
require('./assets/scripts/Player');
require('./assets/scripts/PokerUtil');
require('./assets/scripts/Star');

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
//------QC-SOURCE-SPLIT------

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
  },
  refreshCallback: function refreshCallback(button) {
    this.publishPokers();
  },
  sendCallback: function sendCallback(button) {
    var sendArray = [];
    PokerUtil.destoryArray(this.roundPoker);

    for (var i = 0; i < this.playerControlNodeArray.length;) {
      //判断是否可出
      var node = this.playerControlNodeArray[i].getComponent('Card');

      if (node.isCheck) {
        sendArray.push(node.picNum);
        this.saveRoundPoker(node.picNum, 1, i * this.cardWidth);
        this.playerControlNodeArray[i].destroy();
        this.playerControlNodeArray.splice(i, 1);
      } else {
        i++;
      } // this.playerControlNodeArray[i].destroy();

    }

    console.log("onion", "helper" + this.logicHelper);
    var secondCardArray = this.logicHelper.sendAIFollowCard(this.gameHost, 1, sendArray, this.pokerPlayer[1]); //  PokerUtil.testLogic(testArray);

    sendArray.push(secondCardArray);
    this.saveRoundPoker(secondCardArray, 2, 0);
    var thridCardArray = this.logicHelper.sendAIFollowCard(this.gameHost, 2, sendArray, this.pokerPlayer[2]);
    sendArray.push(thridCardArray);
    this.saveRoundPoker(thridCardArray, 3, 0);
    this.appendLog("我出" + sendArray + "下家出" + secondCardArray + "对家出" + thridCardArray);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcR2FtZS5qcyJdLCJuYW1lcyI6WyJQb2tlclV0aWwiLCJyZXF1aXJlIiwiQUlIZWxwZXIiLCJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsInN0YXJQcmVmYWIiLCJ0eXBlIiwiUHJlZmFiIiwiY2FyZFByZWZhYiIsIm1heFN0YXJEdXJhdGlvbiIsIm1pblN0YXJEdXJhdGlvbiIsImN1cnJlbnRDYXJkUG9zaXRpb24iLCJzdGFydENhcmRQb3N0aW9uIiwiY2FyZFdpZHRoIiwibG9naWNIZWxwZXIiLCJjYXJkQXJyYXkiLCJTdHJpbmciLCJwb2tlclBsYXllciIsInJvdW5kUG9rZXIiLCJwbGF5ZXJDb250cm9sTm9kZUFycmF5IiwicmVmcmVzaEJ1dHRvbiIsIkJ1dHRvbiIsInNlbmRCdXR0b24iLCJjdXJyZW50V2lubmVyIiwiZ2FtZUhvc3QiLCJsYXlvdXRDb250YWluZXIiLCJMYXlvdXQiLCJsYXlvdXRCb3R0b20iLCJsYXlvdXRUb3AiLCJsYXlvdXRMZWZ0IiwibGF5b3V0UmlnaHQiLCJsb2dMYWJlbCIsIkxhYmVsIiwicGxheUxvZyIsImdyb3VuZCIsIk5vZGUiLCJwbGF5ZXIiLCJzY29yZURpc3BsYXkiLCJzY29yZUF1ZGlvIiwiQXVkaW9DbGlwIiwib25Mb2FkIiwiZ3JvdW5kWSIsInkiLCJoZWlnaHQiLCJ0aW1lciIsInN0YXJEdXJhdGlvbiIsImkiLCJwcmUiLCJqIiwic3RyIiwicHVzaCIsIm5vZGUiLCJvbiIsInJlZnJlc2hDYWxsYmFjayIsInNlbmRDYWxsYmFjayIsInB1Ymxpc2hQb2tlcnMiLCJzY29yZSIsImJ1dHRvbiIsInNlbmRBcnJheSIsImRlc3RvcnlBcnJheSIsImxlbmd0aCIsImdldENvbXBvbmVudCIsImlzQ2hlY2siLCJwaWNOdW0iLCJzYXZlUm91bmRQb2tlciIsImRlc3Ryb3kiLCJzcGxpY2UiLCJjb25zb2xlIiwibG9nIiwic2Vjb25kQ2FyZEFycmF5Iiwic2VuZEFJRm9sbG93Q2FyZCIsInRocmlkQ2FyZEFycmF5IiwiYXBwZW5kTG9nIiwiaW5kZXgiLCJvZmZzZXQiLCJuZXdTdGFyIiwiaW5zdGFudGlhdGUiLCJzY2FsZVgiLCJzY2FsZVkiLCJhZGRDaGlsZCIsInJlbW92ZVBva2VyRnJvbUFycmF5Iiwic3Bhd25OZXdTdGFyIiwic2V0UG9zaXRpb24iLCJnZXROZXdTdGFyUG9zaXRpb24iLCJnYW1lIiwiTWF0aCIsInJhbmRvbSIsInNwYXduQm90dG9tQ2FyZCIsImRlc3RvcnlOb2RlIiwiY3JlYXRlQm90dG9tQ2FyZCIsInN0YXJ0UG9zaXRpb24iLCJ1c2VyT2JqIiwidG90YWwiLCJyYW5kWCIsInJhbmRZIiwianVtcEhlaWdodCIsIm1heFgiLCJ3aWR0aCIsInYyIiwiZ2V0Q2FyZEJvdHRvbVBvc2l0aW9uIiwidXBkYXRlIiwiZHQiLCJnYWluU2NvcmUiLCJzdHJpbmciLCJhdWRpb0VuZ2luZSIsInBsYXlFZmZlY3QiLCJnYW1lT3ZlciIsInN0b3BBbGxBY3Rpb25zIiwiZGlyZWN0b3IiLCJsb2FkU2NlbmUiLCJwb2tlckFycmF5Iiwic2xpY2UiLCJob3N0IiwicGFyc2VJbnQiLCJwbGF5ZXJQb2tlckFycmF5IiwicG9rZXJOdW0iLCJ2YWx1ZSIsInF1YXJ5UG9rZXJUeXBlVmFsdWUiLCJxdWFyeVBva2VyVmFsdWUiLCJleHBhbmRQbGF5ZXIiLCJwbGF5ZXJPYmoiLCJzb3J0UG9rZXJzIiwiSlNPTiIsInN0cmluZ2lmeSIsImxvY2F0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLElBQUlBLFNBQVMsR0FBR0MsT0FBTyxDQUFDLFdBQUQsQ0FBdkI7O0FBQ0EsSUFBSUMsUUFBUSxHQUFHRCxPQUFPLENBQUMsVUFBRCxDQUF0Qjs7QUFDQUUsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDTCxhQUFTRCxFQUFFLENBQUNFLFNBRFA7QUFHTEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1I7QUFDQUMsSUFBQUEsVUFBVSxFQUFFO0FBQ1IsaUJBQVMsSUFERDtB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QUFLdEUsT0FBTCxHQUFlLEtBQUtBLE9BQUwsR0FBZSxJQUFmLEdBQXNCc0UsTUFBckM7QUFDQSxTQUFLeEUsUUFBTCxDQUFjd0UsTUFBZCxHQUF1QixLQUFLdEUsT0FBNUI7QUFDSDtBQXBVSSxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJcbmxldCBQb2tlclV0aWwgPSByZXF1aXJlKFwiUG9rZXJVdGlsXCIpO1xubGV0IEFJSGVscGVyID0gcmVxdWlyZShcIkFJSGVscGVyXCIpO1xuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8g6L+Z5Liq5bGe5oCn5byV55So5LqG5pif5pif6aKE5Yi26LWE5rqQXG4gICAgICAgIHN0YXJQcmVmYWI6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5QcmVmYWJcbiAgICAgICAgfSxcbiAgICAgICAgY2FyZFByZWZhYjoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYlxuICAgICAgICB9LFxuICAgICAgICAvLyDmmJ/mmJ/kuqfnlJ/lkI7mtojlpLHml7bpl7TnmoTpmo/mnLrojIPlm7RcbiAgICAgICAgbWF4U3RhckR1cmF0aW9uOiAwLFxuICAgICAgICBtaW5TdGFyRHVyYXRpb246IDAsXG4gICAgICAgIGN1cnJlbnRDYXJkUG9zaXRpb246IDAsXG4gICAgICAgIHN0YXJ0Q2FyZFBvc3Rpb246IDAsXG4gICAgICAgIGNhcmRXaWR0aDogODAsXG4gICAgICAgIGxvZ2ljSGVscGVyOiBudWxsLFxuICAgICAgICBjYXJkQXJyYXk6IFtjYy5TdHJpbmddLFxuICAgICAgICAvL+WIneWni+eJjOaVsOe7hCDpgIbml7bpkogg5Li76KeS5piv56ys5LiA5Liq5pWw57uEXG4gICAgICAgIHBva2VyUGxheWVyOiBbXSxcbiAgICAgICAgLy/lvZPliY3ova7mrKHlh7rniYzoioLngrksXG4gICAgICAgIHJvdW5kUG9rZXI6IFtdLFxuICAgICAgICAvL+S4u+inkuW9k+WJjeeJjOiKgueCuVxuICAgICAgICBwbGF5ZXJDb250cm9sTm9kZUFycmF5OiBbXSxcbiAgICAgICAgLy/mtJfniYxcbiAgICAgICAgcmVmcmVzaEJ1dHRvbjoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkJ1dHRvblxuICAgICAgICB9LFxuICAgICAgICAvL+WHuueJjFxuICAgICAgICBzZW5kQnV0dG9uOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuQnV0dG9uXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy/lvZPliY3og5zmlrlcbiAgICAgICAgY3VycmVudFdpbm5lcjogMSxcbiAgICAgICAgLy/mnKzova7kuLtcbiAgICAgICAgZ2FtZUhvc3Q6IFwiMVwiLFxuICAgICAgICAvL+eOqeWutuaLpeacieeJjFxuICAgICAgICBsYXlvdXRDb250YWluZXI6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYXlvdXRcbiAgICAgICAgfSxcbiAgICAgICAgLy/njqnlrrblh7rnmoTniYwgXG4gICAgICAgIGxheW91dEJvdHRvbToge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxheW91dFxuICAgICAgICB9LFxuICAgICAgICAvL+WvueWutuWHuueJjCDnrKzkuInkvY1cbiAgICAgICAgbGF5b3V0VG9wOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGF5b3V0XG4gICAgICAgIH0sXG4gICAgICAgIC8v5LiL5a625Ye654mMIOW3puaJi+esrOS6jOS9jVxuICAgICAgICBsYXlvdXRMZWZ0OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGF5b3V0XG4gICAgICAgIH0sXG4gICAgICAgIC8v5LiK5a625Ye654mM77yM5Y+z5omL56ys5Zub5L2NXG4gICAgICAgIGxheW91dFJpZ2h0OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGF5b3V0XG4gICAgICAgIH0sXG4gICAgICAgIC8v5oiY5oqlXG4gICAgICAgIGxvZ0xhYmVsOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWxcbiAgICAgICAgfSxcbiAgICAgICAgcGxheUxvZzogXCLmuLjmiI/lvIDlp4tcIixcbiAgICAgICAgLy8g5Zyw6Z2i6IqC54K577yM55So5LqO56Gu5a6a5pif5pif55Sf5oiQ55qE6auY5bqmXG4gICAgICAgIGdyb3VuZDoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfSxcbiAgICAgICAgLy8gcGxheWVyIOiKgueCue+8jOeUqOS6juiOt+WPluS4u+inkuW8uei3s+eahOmrmOW6pu+8jOWSjOaOp+WItuS4u+inkuihjOWKqOW8gOWFs1xuICAgICAgICBwbGF5ZXI6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH0sXG4gICAgICAgIC8vIHNjb3JlIGxhYmVsIOeahOW8leeUqFxuICAgICAgICBzY29yZURpc3BsYXk6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxuICAgICAgICB9LFxuICAgICAgICAvLyDlvpfliIbpn7PmlYjotYTmupBcbiAgICAgICAgc2NvcmVBdWRpbzoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9LFxuICAgIH0sXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8g6I635Y+W5Zyw5bmz6Z2i55qEIHkg6L205Z2Q5qCHXG4gICAgICAgIHRoaXMuZ3JvdW5kWSA9IHRoaXMuZ3JvdW5kLnkgKyB0aGlzLmdyb3VuZC5oZWlnaHQgLyAyO1xuICAgICAgICAvLyDliJ3lp4vljJborqHml7blmahcbiAgICAgICAgdGhpcy50aW1lciA9IDA7XG4gICAgICAgIHRoaXMuc3RhckR1cmF0aW9uID0gMDtcbiAgICAgICAgdGhpcy5sb2dpY0hlbHBlciA9IG5ldyBBSUhlbHBlcigpO1xuICAgICAgICAvL+WIm+W7uuWbvueJh+i1hOa6kFxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEzOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBwcmUgPSAzICsgaTtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAxOyBqIDwgNTsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHN0ciA9IFwiXCI7XG4gICAgICAgICAgICAgICAgaWYgKHByZSA8IDEwKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0ciA9IFwiMFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzdHIgPSBzdHIgKyBwcmUgKyBqO1xuICAgICAgICAgICAgICAgIHRoaXMuY2FyZEFycmF5LnB1c2goc3RyKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNhcmRBcnJheS5wdXNoKHN0cik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jYXJkQXJyYXkucHVzaChcIjE2MVwiKTtcbiAgICAgICAgdGhpcy5jYXJkQXJyYXkucHVzaChcIjE2MVwiKTtcbiAgICAgICAgdGhpcy5jYXJkQXJyYXkucHVzaChcIjE3MVwiKTtcbiAgICAgICAgdGhpcy5jYXJkQXJyYXkucHVzaChcIjE3MVwiKTtcblxuXG4gICAgICAgIHRoaXMucmVmcmVzaEJ1dHRvbi5ub2RlLm9uKCdjbGljaycsIHRoaXMucmVmcmVzaENhbGxiYWNrLCB0aGlzKTtcbiAgICAgICAgdGhpcy5zZW5kQnV0dG9uLm5vZGUub24oJ2NsaWNrJywgdGhpcy5zZW5kQ2FsbGJhY2ssIHRoaXMpO1xuICAgICAgICB0aGlzLnB1Ymxpc2hQb2tlcnMoKTtcbiAgICAgICAgLy8gdGhpcy5zcGF3bk5ld1N0YXIoKTtcbiAgICAgICAgLy8g5Yid5aeL5YyW6K6h5YiGXG4gICAgICAgIHRoaXMuc2NvcmUgPSAwO1xuICAgIH0sXG4gICAgcmVmcmVzaENhbGxiYWNrOiBmdW5jdGlvbiAoYnV0dG9uKSB7XG4gICAgICAgIHRoaXMucHVibGlzaFBva2VycygpO1xuICAgIH0sXG4gICAgc2VuZENhbGxiYWNrOiBmdW5jdGlvbiAoYnV0dG9uKSB7XG4gICAgICAgIGxldCBzZW5kQXJyYXkgPSBbXTtcbiAgICAgICAgUG9rZXJVdGlsLmRlc3RvcnlBcnJheSh0aGlzLnJvdW5kUG9rZXIpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGxheWVyQ29udHJvbE5vZGVBcnJheS5sZW5ndGg7KSB7XG4gICAgICAgICAgICAvL+WIpOaWreaYr+WQpuWPr+WHulxuICAgICAgICAgICAgbGV0IG5vZGUgPSB0aGlzLnBsYXllckNvbnRyb2xOb2RlQXJyYXlbaV0uZ2V0Q29tcG9uZW50KCdDYXJkJyk7XG4gICAgICAgICAgICBpZiAobm9kZS5pc0NoZWNrKSB7XG4gICAgICAgICAgICAgICAgc2VuZEFycmF5LnB1c2gobm9kZS5waWNOdW0pO1xuICAgICAgICAgICAgICAgIHRoaXMuc2F2ZVJvdW5kUG9rZXIobm9kZS5waWNOdW0sIDEsIGkgKiB0aGlzLmNhcmRXaWR0aCk7XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXJDb250cm9sTm9kZUFycmF5W2ldLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllckNvbnRyb2xOb2RlQXJyYXkuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB0aGlzLnBsYXllckNvbnRyb2xOb2RlQXJyYXlbaV0uZGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKFwib25pb25cIiwgXCJoZWxwZXJcIiArIHRoaXMubG9naWNIZWxwZXIpO1xuICAgICAgICBsZXQgc2Vjb25kQ2FyZEFycmF5ID0gdGhpcy5sb2dpY0hlbHBlci5zZW5kQUlGb2xsb3dDYXJkKHRoaXMuZ2FtZUhvc3QsIDEsIHNlbmRBcnJheSwgdGhpcy5wb2tlclBsYXllclsxXSk7XG4gICAgICAgIC8vICBQb2tlclV0aWwudGVzdExvZ2ljKHRlc3RBcnJheSk7XG5cbiAgICAgICAgc2VuZEFycmF5LnB1c2goc2Vjb25kQ2FyZEFycmF5KTtcblxuICAgICAgICB0aGlzLnNhdmVSb3VuZFBva2VyKHNlY29uZENhcmRBcnJheSwgMiwgMCk7XG4gICAgICAgIGxldCB0aHJpZENhcmRBcnJheSA9IHRoaXMubG9naWNIZWxwZXIuc2VuZEFJRm9sbG93Q2FyZCh0aGlzLmdhbWVIb3N0LCAyLCBzZW5kQXJyYXksIHRoaXMucG9rZXJQbGF5ZXJbMl0pO1xuICAgICAgICBzZW5kQXJyYXkucHVzaCh0aHJpZENhcmRBcnJheSk7XG4gICAgICAgIHRoaXMuc2F2ZVJvdW5kUG9rZXIodGhyaWRDYXJkQXJyYXksIDMsIDApO1xuICAgICAgICB0aGlzLmFwcGVuZExvZyhcIuaIkeWHulwiICsgc2VuZEFycmF5ICsgXCLkuIvlrrblh7pcIiArIHNlY29uZENhcmRBcnJheSArIFwi5a+55a625Ye6XCIgKyB0aHJpZENhcmRBcnJheSk7XG4gICAgfSxcbiAgICAvL+S/neWtmOWHuueJjCAgMSAyIDMgNCDpobrml7bpkojkvY1cbiAgICBzYXZlUm91bmRQb2tlcjogZnVuY3Rpb24gKHBpY051bSwgaW5kZXgsIG9mZnNldCkge1xuICAgICAgICB2YXIgbmV3U3RhciA9IGNjLmluc3RhbnRpYXRlKHRoaXMuY2FyZFByZWZhYik7XG4gICAgICAgIC8vIG5ld1N0YXIuc2V0UGljTnVtKFwiaVwiK2kpO1xuICAgICAgICBuZXdTdGFyLmdldENvbXBvbmVudCgnQ2FyZCcpLnBpY051bSA9IHBpY051bTtcbiAgICAgICAgbmV3U3Rhci5zY2FsZVggPSAwLjU7XG4gICAgICAgIG5ld1N0YXIuc2NhbGVZID0gMC41O1xuICAgICAgICB0aGlzLnJvdW5kUG9rZXIucHVzaChuZXdTdGFyKTtcbiAgICAgICAgLy8gdGhpcy5ub2RlLmFkZENoaWxkKG5ld1N0YXIpO1xuICAgICAgICAvLyBsZXQgaGVpZ2h0ID0gdGhpcy5ncm91bmQuaGVpZ2h0IC8gMiAqIC0xO1xuICAgICAgICBzd2l0Y2ggKGluZGV4KSB7XG4gICAgICAgICAgICBjYXNlIDE6IHRoaXMubGF5b3V0Qm90dG9tLm5vZGUuYWRkQ2hpbGQobmV3U3Rhcik7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dpY0hlbHBlci5yZW1vdmVQb2tlckZyb21BcnJheSh0aGlzLmdhbWVIb3N0LCBwaWNOdW0sIHRoaXMucG9rZXJQbGF5ZXJbMF0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAyOiB0aGlzLmxheW91dExlZnQubm9kZS5hZGRDaGlsZChuZXdTdGFyKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2ljSGVscGVyLnJlbW92ZVBva2VyRnJvbUFycmF5KHRoaXMuZ2FtZUhvc3QsIHBpY051bSwgdGhpcy5wb2tlclBsYXllclsxXSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDM6IHRoaXMubGF5b3V0VG9wLm5vZGUuYWRkQ2hpbGQobmV3U3Rhcik7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dpY0hlbHBlci5yZW1vdmVQb2tlckZyb21BcnJheSh0aGlzLmdhbWVIb3N0LCBwaWNOdW0sIHRoaXMucG9rZXJQbGF5ZXJbMl0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIC8vIG5ld1N0YXIuc2V0UG9zaXRpb24oY2MudjIoLTE1MCArIHRoaXMuc3RhcnRDYXJkUG9zdGlvbiArIG9mZnNldCwgaGVpZ2h0KSk7XG4gICAgfSxcbiAgICBzcGF3bk5ld1N0YXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8g5L2/55So57uZ5a6a55qE5qih5p2/5Zyo5Zy65pmv5Lit55Sf5oiQ5LiA5Liq5paw6IqC54K5XG4gICAgICAgIHZhciBuZXdTdGFyID0gY2MuaW5zdGFudGlhdGUodGhpcy5zdGFyUHJlZmFiKTtcbiAgICAgICAgLy8g5bCG5paw5aKe55qE6IqC54K55re75Yqg5YiwIENhbnZhcyDoioLngrnkuIvpnaJcbiAgICAgICAgdGhpcy5ub2RlLmFkZENoaWxkKG5ld1N0YXIpO1xuICAgICAgICAvLyDkuLrmmJ/mmJ/orr7nva7kuIDkuKrpmo/mnLrkvY3nva5cbiAgICAgICAgbmV3U3Rhci5zZXRQb3NpdGlvbih0aGlzLmdldE5ld1N0YXJQb3NpdGlvbigpKTtcbiAgICAgICAgLy8g5Zyo5pif5pif57uE5Lu25LiK5pqC5a2YIEdhbWUg5a+56LGh55qE5byV55SoXG4gICAgICAgIG5ld1N0YXIuZ2V0Q29tcG9uZW50KCdTdGFyJykuZ2FtZSA9IHRoaXM7XG4gICAgICAgIC8vIOmHjee9ruiuoeaXtuWZqO+8jOagueaNrua2iOWkseaXtumXtOiMg+WbtOmaj+acuuWPluS4gOS4quWAvFxuICAgICAgICB0aGlzLnN0YXJEdXJhdGlvbiA9IHRoaXMubWluU3RhckR1cmF0aW9uICsgTWF0aC5yYW5kb20oKSAqICh0aGlzLm1heFN0YXJEdXJhdGlvbiAtIHRoaXMubWluU3RhckR1cmF0aW9uKTtcbiAgICAgICAgdGhpcy50aW1lciA9IDA7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiDnp7vpmaTml6fnmoToioLngrlcbiAgICAgKiDmt7vliqDmlrDoioLngrlcbiAgICAgKi9cbiAgICBzcGF3bkJvdHRvbUNhcmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMucGxheWVyQ29udHJvbE5vZGVBcnJheS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBsZXQgZGVzdG9yeU5vZGUgPSB0aGlzLnBsYXllckNvbnRyb2xOb2RlQXJyYXk7XG4gICAgICAgICAgICBQb2tlclV0aWwuZGVzdG9yeUFycmF5KGRlc3RvcnlOb2RlKTtcbiAgICAgICAgICAgIHRoaXMucGxheWVyQ29udHJvbE5vZGVBcnJheSA9IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jcmVhdGVCb3R0b21DYXJkKClcblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiB0eXBlMUFycmF5OnR5cGUxQXJyYXksXG4gICAgICAgICAgICB0eXBlMkFycmF5OnR5cGUyQXJyYXksXG4gICAgICAgICAgICB0eXBlM0FycmF5OnR5cGUzQXJyYXksXG4gICAgICAgICAgICB0eXBlNEFycmF5OnR5cGU0QXJyYXksXG4gICAgICAgICAgICBob3N0QXJyYXk6aG9zdEFycmF5LFxuICAgICAgICAgICAgdG90YWw6dG90YWxcbiAgICAgKi9cbiAgICBjcmVhdGVCb3R0b21DYXJkOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgbGV0IHN0YXJ0UG9zaXRpb24gPSAwO1xuICAgICAgICBsZXQgdXNlck9iaiA9IHRoaXMucG9rZXJQbGF5ZXJbMF07XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdXNlck9iai50b3RhbC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgLy8g5L2/55So57uZ5a6a55qE5qih5p2/5Zyo5Zy65pmv5Lit55Sf5oiQ5LiA5Liq5paw6IqC54K5XG4gICAgICAgICAgICB2YXIgbmV3U3RhciA9IGNjLmluc3RhbnRpYXRlKHRoaXMuY2FyZFByZWZhYik7XG4gICAgICAgICAgICAvLyBuZXdTdGFyLnNldFBpY051bShcImlcIitpKTtcbiAgICAgICAgICAgIG5ld1N0YXIuZ2V0Q29tcG9uZW50KCdDYXJkJykucGljTnVtID0gdXNlck9iai50b3RhbFtpXTtcbiAgICAgICAgICAgIHRoaXMucGxheWVyQ29udHJvbE5vZGVBcnJheS5wdXNoKG5ld1N0YXIpO1xuICAgICAgICAgICAgLy8gdGhpcy5ub2RlLmFkZENoaWxkKG5ld1N0YXIpO1xuICAgICAgICAgICAgdGhpcy5sYXlvdXRDb250YWluZXIubm9kZS5hZGRDaGlsZChuZXdTdGFyKTtcbiAgICAgICAgICAgIGxldCBoZWlnaHQgPSB0aGlzLmdyb3VuZC5oZWlnaHQgLyAyICogLTE7XG4gICAgICAgICAgICBzdGFydFBvc2l0aW9uID0gaSAqIHRoaXMuY2FyZFdpZHRoO1xuICAgICAgICAgICAgaWYgKGkgPiAxMykge1xuICAgICAgICAgICAgICAgIGhlaWdodCA9IGhlaWdodCAtIDE1MFxuICAgICAgICAgICAgICAgIHN0YXJ0UG9zaXRpb24gPSAoaSAtIDEzKSAqIHRoaXMuY2FyZFdpZHRoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gbmV3U3Rhci5zZXRQb3NpdGlvbihjYy52MigtMjAwICsgdGhpcy5zdGFydENhcmRQb3N0aW9uICsgc3RhcnRQb3NpdGlvbiwgaGVpZ2h0KSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG5cbiAgICBnZXROZXdTdGFyUG9zaXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHJhbmRYID0gMDtcbiAgICAgICAgLy8g5qC55o2u5Zyw5bmz6Z2i5L2N572u5ZKM5Li76KeS6Lez6LeD6auY5bqm77yM6ZqP5py65b6X5Yiw5LiA5Liq5pif5pif55qEIHkg5Z2Q5qCHXG4gICAgICAgIHZhciByYW5kWSA9IHRoaXMuZ3JvdW5kWSArIE1hdGgucmFuZG9tKCkgKiB0aGlzLnBsYXllci5nZXRDb21wb25lbnQoJ1BsYXllcicpLmp1bXBIZWlnaHQgKyA1MDtcbiAgICAgICAgLy8g5qC55o2u5bGP5bmV5a695bqm77yM6ZqP5py65b6X5Yiw5LiA5Liq5pif5pifIHgg5Z2Q5qCHXG4gICAgICAgIHZhciBtYXhYID0gdGhpcy5ub2RlLndpZHRoIC8gMjtcbiAgICAgICAgcmFuZFggPSAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiAyICogbWF4WDtcbiAgICAgICAgLy8g6L+U5Zue5pif5pif5Z2Q5qCHXG4gICAgICAgIHJldHVybiBjYy52MihyYW5kWCwgcmFuZFkpO1xuICAgIH0sXG4gICAgZ2V0Q2FyZEJvdHRvbVBvc2l0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciByYW5kWCA9IHRoaXMuY3VycmVudENhcmRQb3NpdGlvbjtcbiAgICAgICAgdmFyIHJhbmRZID0gMDtcbiAgICAgICAgdGhpcy5jdXJyZW50Q2FyZFBvc2l0aW9uID0gdGhpcy5jdXJyZW50Q2FyZFBvc2l0aW9uICsgdGhpcy5jYXJkV2lkdGg7XG4gICAgICAgIHJldHVybiBjYy52MihyYW5kWCwgcmFuZFkpO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuICAgICAgICAvLyDmr4/luKfmm7TmlrDorqHml7blmajvvIzotoXov4fpmZDluqbov5jmsqHmnInnlJ/miJDmlrDnmoTmmJ/mmJ9cbiAgICAgICAgLy8g5bCx5Lya6LCD55So5ri45oiP5aSx6LSl6YC76L6RXG4gICAgICAgIC8vIGlmICh0aGlzLnRpbWVyID4gdGhpcy5zdGFyRHVyYXRpb24pIHtcbiAgICAgICAgLy8gICAgIHRoaXMuZ2FtZU92ZXIoKTtcbiAgICAgICAgLy8gICAgIHRoaXMuZW5hYmxlZCA9IGZhbHNlOyAgIC8vIGRpc2FibGUgZ2FtZU92ZXIgbG9naWMgdG8gYXZvaWQgbG9hZCBzY2VuZSByZXBlYXRlZGx5XG4gICAgICAgIC8vICAgICByZXR1cm47XG4gICAgICAgIC8vIH1cbiAgICAgICAgLy8gdGhpcy50aW1lciArPSBkdDtcbiAgICB9LFxuXG4gICAgZ2FpblNjb3JlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuc2NvcmUgKz0gMTtcbiAgICAgICAgLy8g5pu05pawIHNjb3JlRGlzcGxheSBMYWJlbCDnmoTmloflrZdcbiAgICAgICAgdGhpcy5zY29yZURpc3BsYXkuc3RyaW5nID0gJ1Njb3JlOiAnICsgdGhpcy5zY29yZTtcbiAgICAgICAgLy8g5pKt5pS+5b6X5YiG6Z+z5pWIXG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGhpcy5zY29yZUF1ZGlvLCBmYWxzZSk7XG4gICAgfSxcblxuICAgIGdhbWVPdmVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMucGxheWVyLnN0b3BBbGxBY3Rpb25zKCk7IC8v5YGc5q2iIHBsYXllciDoioLngrnnmoTot7Pot4PliqjkvZxcbiAgICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKCdnYW1lJyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICog5oqK54mM5Y+R57uZ5Zub5a62XG4gICAgKi9cbiAgICBwdWJsaXNoUG9rZXJzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMucG9rZXJQbGF5ZXIgPSBbXTtcbiAgICAgICAgdGhpcy5nYW1lSG9zdCA9IG51bGw7XG4gICAgICAgIGxldCBwb2tlckFycmF5ID0gdGhpcy5jYXJkQXJyYXkuc2xpY2UoMCk7XG4gICAgICAgIGxldCBob3N0ID0gcGFyc2VJbnQoTWF0aC5yYW5kb20oKSAqIDQpOy8v6ZqP5py65Li754mM6Iqx6ImyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcGxheWVyUG9rZXJBcnJheSA9IFtdO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAyNzsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHBva2VyTnVtID0gTWF0aC5yYW5kb20oKSAqIHBva2VyQXJyYXkubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHBva2VyTnVtID0gcGFyc2VJbnQocG9rZXJOdW0pO1xuICAgICAgICAgICAgICAgIC8v5o+S5YWl5omL54mM5LitXG4gICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gcG9rZXJBcnJheS5zcGxpY2UocG9rZXJOdW0sIDEpO1xuICAgICAgICAgICAgICAgIHBsYXllclBva2VyQXJyYXkucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2FtZUhvc3QgPT0gbnVsbCkgey8v6ZqP5py65Yiw5Li75ZCO77yM56ys5LiA5byg5Li754mM5Lqu5Ye6XG4gICAgICAgICAgICAgICAgICAgIGlmIChob3N0ID09IFBva2VyVXRpbC5xdWFyeVBva2VyVHlwZVZhbHVlKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lSG9zdCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHBlbmRMb2coXCLmnKzova7muLjmiI8s5Li754mMXCIgKyBQb2tlclV0aWwucXVhcnlQb2tlclZhbHVlKHZhbHVlKSArIFwi5ZyoXCIgKyB0aGlzLmV4cGFuZFBsYXllcihpKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgcGxheWVyT2JqID0gUG9rZXJVdGlsLnNvcnRQb2tlcnMoaG9zdCwgcGxheWVyUG9rZXJBcnJheSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm9uaW9uPT09PVwiLCBKU09OLnN0cmluZ2lmeShwbGF5ZXJPYmopKTtcbiAgICAgICAgICAgIHRoaXMucG9rZXJQbGF5ZXIucHVzaChwbGF5ZXJPYmopO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3Bhd25Cb3R0b21DYXJkKCk7XG5cbiAgICB9LFxuICAgIGV4cGFuZFBsYXllcjogZnVuY3Rpb24gKGxvY2F0aW9uKSB7XG4gICAgICAgIHN3aXRjaCAobG9jYXRpb24pIHtcbiAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIFwi6Ieq5bexXCJcbiAgICAgICAgICAgIGNhc2UgMTogcmV0dXJuIFwi5LiL5a62XCJcbiAgICAgICAgICAgIGNhc2UgMjogcmV0dXJuIFwi5a+55a62XCJcbiAgICAgICAgICAgIGNhc2UgMzogcmV0dXJuIFwi5LiK5a62XCJcbiAgICAgICAgfVxuXG4gICAgfSxcbiAgICBhcHBlbmRMb2c6IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5wbGF5TG9nID0gdGhpcy5wbGF5TG9nICsgXCJcXG5cIiArIHN0cmluZztcbiAgICAgICAgdGhpcy5sb2dMYWJlbC5zdHJpbmcgPSB0aGlzLnBsYXlMb2c7XG4gICAgfVxuXG5cblxuXG5cbn0pO1xuIl19
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/PokerUtil.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '637dcF7OOBKJbr2bHFrfFoQ', 'PokerUtil');
// scripts/PokerUtil.js

"use strict";

exports.__esModule = true;
exports["default"] = void 0;
var pokerWeight = [4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 3, 5, 16, 17, 18]; //主5为18

var LEFT_WIN = -1;
var RIGHT_WIN = 1;

var PokerUtil = /*#__PURE__*/function () {
  function PokerUtil() {}

  /**
   * 比较牌的大小
   * 最后一位是花色，前面直接比大小
   * 规则 1游戏主>轮次主>副
   *      2 5>王>3>2
   *      3 同为副牌，花色比大小
   *      4
   * @param {*} valueLeft  先牌
   * @param {*} valueRight 后牌
   */

  /**
   * 不判断花色，直接比大小 只接受两位
   * 允许返回0
   *
   */

  /**
   * 判断牌的大小
   * @param {*} poker
   */
  PokerUtil.quaryPokerWeight = function quaryPokerWeight(poker) {
    return pokerWeight.indexOf(poker);
  }
  /**
   * 判断牌是不是活动主 15 3 5对应 2 3 5
   */
  ;

  PokerUtil.quaryIsHost = function quaryIsHost(poker) {
    var value = parseInt(poker);
    return value == 15 || value == 3 || value == 5 || value == 16 || value == 17 || value == 18; //2 3 5 小王 大王 主5
  };

  PokerUtil.quaryIsSocer = function quaryIsSocer(poker) {
    return poker == 5 || poker == 10 || poker == 13;
  }
  /**
   * 判断副牌谁大
   * @param {*} roundhost
   * @param {*} valueLeft
   * @param {*} valueRight
   */
  ;

  PokerUtil.compareVice = function compareVice(roundhost, typeLeft, typeRight, contentLeft, contentRight) {
    if (typeRight == typeLeft == roundhost) {
      return PokerUtil.compareSinglePokerBigger(contentLeft, contentRight);
    } else if (typeLeft == roundhost) {
      return LEFT_WIN;
    } else if (typeRight == roundhost) {
      return RIGHT_WIN;
    } else {
      //都是副牌 不是本轮主，多半是跟牌，意义不大
      return LEFT_WIN;
    }
  };

  return PokerUtil;
}();

exports["default"] = PokerUtil;

PokerUtil.testLogic = function (testArray) {
  var gamehost = Math.random() * 4;
  var roundhost = Math.random() * 4;
  gamehost = parseInt(gamehost) + 1;
  roundhost = parseInt(roundhost) + 1;
  console.log("onion", "当前游戏主" + gamehost + "本轮主" + roundhost);

  if (testArray.length == 1) {
    var testValue = testArray[0] + "";
    console.log("onion", PokerUtil.quaryPokerWeight(parseInt(testValue.substring(0, 2))));
  } else if (testArray.length >= 2) {
    console.log("onion", PokerUtil.comparePoker(gamehost, roundhost, testArray[0], testArray[1]));
  }
};

PokerUtil.testArrayLogic = function (testArray1, testArray2) {
  var gamehost = Math.random() * 4;
  var roundhost = Math.random() * 4;
  gamehost = parseInt(gamehost) + 1;
  roundhost = parseInt(roundhost) + 1;
};

PokerUtil.comparePoker = function (gamehost, roundhost, valueLeft, valueRight) {
  console.log("onion", "comparePoker++" + PokerUtil.quaryPokerValue(valueLeft) + "/" + PokerUtil.quaryPokerValue(valueRight));

  if (Array.isArray(valueLeft) || Array.isArray(valueRight)) {
    if (valueLeft.length == 1) {
      valueLeft = valueLeft[0];
    }

    if (valueRight.length == 1) {
      valueRight = valueRight[0];
    }
  }

  if (Array.isArray(valueLeft) || Array.isArray(valueRight)) {
    console.error("onion", "暂不支持数组");
    PokerUtil.compareArray(gamehost, roundhost, valueLeft, valueRight);
    return LEFT_WIN;
  }

  if (valueRight == valueLeft) {
    //完全相同，先牌大
    return LEFT_WIN;
  }

  valueRight = valueRight + "";
  valueLeft = valueLeft + ""; //1 判断先牌后牌的花色

  var typeLeft = valueLeft.substring(2);
  var typeRight = valueRight.substring(2); //2判断先牌后牌值

  var contentLeft = valueLeft.substring(0, 2);
  var contentRight = valueRight.substring(0, 2); //3判断牌是否为主 活动主

  var leftIsHost = typeLeft == gamehost || PokerUtil.quaryIsHost(contentLeft);
  var rightIsHost = typeLeft == gamehost || PokerUtil.quaryIsHost(contentRight); //4比较

  if (leftIsHost && rightIsHost) {
    //同为主，主5最大
    if (parseInt(contentLeft) == 5) {
      return LEFT_WIN;
    } else if (parseInt(contentRight) == 5) {
      return RIGHT_WIN;
    } else {
      //直接比大小
      var result = PokerUtil.compareSinglePokerBigger(contentLeft, contentRight);

      if (result != 0) {
        return result;
      } else {
        //大小相同，存在活动主和花色主牌值相同情况
        if (typeLeft == gamehost) {
          return LEFT_WIN;
        } else if (typeRight == gamehost) {
          return RIGHT_WIN;
        } else {
          //同为活动主
          return LEFT_WIN;
        }
      }
    }
  } else if (leftIsHost) {
    //先牌是主，先牌大
    return LEFT_WIN;
  } else if (rightIsHost) {
    //后牌是主，后牌大
    return RIGHT_WIN;
  } else {
    return PokerUtil.compareVice(roundhost, typeLeft, typeRight, contentLeft, contentRight);
  }
};

PokerUtil.compareSinglePokerBigger = function (valueLeft, valueRight) {
  if (valueLeft.length > 2 || valueRight.length > 2) {
    console.error("只接受两位的" + valueLeft + "/" + valueRight);
    return 1;
  }

  var leftNum = parseInt(valueLeft);
  var rightNum = parseInt(valueRight);
  var result = PokerUtil.quaryPokerWeight(rightNum) - PokerUtil.quaryPokerWeight(leftNum);

  if (result > 0) {
    result = RIGHT_WIN;
  } else if (result < 0) {
    result = LEFT_WIN;
  }

  return result;
};

PokerUtil.compareArray = function (gamehost, roundhost, valueLeft, valueRight) {
  //偶数张，排数不一致
  if (valueLeft.length != valueRight.length || valueLeft.length % 2 != 0) {
    console.error("onion", "数组长度不一致");
    return LEFT_WIN;
  } //1 排序


  var arrayLeft = valueLeft.sort();
  var arrayRight = valueRight.sort(); //2 奇数和偶数一样，判断对子合法性

  var resultLeft = PokerUtil.checkArrayValue(arrayLeft);
  var resultRight = PokerUtil.checkArrayValue(arrayRight);

  if (resultLeft[0] == "-1") {
    return RIGHT_WIN;
  }

  if (resultRight[0] == "-1") {
    return LEFT_WIN;
  }

  if (gamehost == resultLeft[0] == resultRight[0]) {
    //都是主对
    if (resultLeft[1] > resultRight[1]) {
      return LEFT_WIN;
    } else {
      return RIGHT_WIN;
    }
  } else if (gamehost == resultLeft[0]) {
    return LEFT_WIN;
  } else if (gamehost == resultRight[0]) {
    return RIGHT_WIN;
  } else if (roundhost == resultLeft[0] == resultRight[0]) {
    //都是副对
    if (resultLeft[1] > resultRight[1]) {
      return LEFT_WIN;
    } else {
      return RIGHT_WIN;
    }
  } else if (roundhost == resultLeft[0]) {
    return LEFT_WIN;
  } else if (gamehost == resultRight[0]) {
    return RIGHT_WIN;
  } else {
    //都不是主 跟牌大小无意义
    return LEFT_WIN;
  } //一对直接比
  //多对先校验合法性，1是否多对 2是否连对 3花色一致 4

};

PokerUtil.checkArrayValue = function (array) {
  var odd = "-1";
  var even = "-1";
  var lastType = "-1";
  var result = 0;

  for (var index = 0; index < array.length; index++) {
    if (index % 2 == 0) {
      even = array[index];
    } else {
      odd = array[index];

      if (even != odd) {
        return ["-1", -1];
      }

      var cardNum = odd;
      var type = "0";

      if (cardNum == "171" || cardNum == "161") {
        //大小王
        type = "5";
      } else {
        var str = cardNum.substring(2);
        type = PokerUtil.quaryType(str);
      }

      if (lastType != type && lastType != "-1") {
        //不是首次且与之前花色不同，不能算对子
        return ["-1", -1];
      }

      lastType = type;
      var compare = cardNum.substring(0, 2);
      result = result + PokerUtil.quaryPokerWeight(parseInt(compare));
    }
  }

  return [lastType, result];
};

PokerUtil.compareRound = function (playPokers) {};

PokerUtil.destoryArray = function (destoryNode) {
  if (destoryNode != null) {
    for (var i = 0; i < destoryNode.length; i++) {
      destoryNode[i].destroy();
    }
  }
};

PokerUtil.sort = function (a, b) {
  a = Math.floor(a / 10);
  b = Math.floor(b / 10);
  var left = PokerUtil.quaryPokerWeight(a);
  var right = PokerUtil.quaryPokerWeight(b);
  return left - right;
};

PokerUtil.sortInsert = function (array, item) {
  if (array.length === 0) {
    array.push(item);
    return array;
  } // let value=item.substring(0,2);


  var value = item / 10;
  var weight = PokerUtil.quaryPokerWeight(value);
  var firstWeight = PokerUtil.quaryPokerWeight(array[0] / 10);
  var lastWeight = PokerUtil.quaryPokerWeight(array[array.length - 1] / 10);

  if (weight <= firstWeight) {
    array = [item].concat(array); // array.unshift(item);
  } else if (weight >= lastWeight) {
    array.push(item);
  }

  return array;
};

PokerUtil.quaryType = function (type) {
  switch (type) {
    case "1":
      return "方块";

    case "2":
      return "梅花";

    case "3":
      return "红桃";

    case "4":
      return "黑桃";
  }
};

PokerUtil.quaryPokerTypeValue = function (pokerValue) {
  pokerValue = pokerValue + "";

  if (pokerValue == "171") {
    return "3";
  }

  if (pokerValue == "161") {
    return "4";
  } // console.log("onion","pokerValue"+pokerValue);


  return pokerValue.substring(2);
};

PokerUtil.quaryPokerValue = function (value) {
  var cardNum = value + "";

  if (cardNum == "171") {
    return "大王";
  } else if (cardNum == "161") {
    return "小王";
  } else if (cardNum == "181") {
    return "卡背";
  } else {
    var compare = cardNum.substring(0, 2);
    var type = cardNum.substring(2);
    var result = PokerUtil.quaryType(type);

    switch (compare) {
      case "03":
        result = result + "3";
        break;

      case "04":
        result = result + "4";
        break;

      case "05":
        result = result + "5";
        break;

      case "06":
        result = result + "6";
        break;

      case "07":
        result = result + "7";
        break;

      case "08":
        result = result + "8";
        break;

      case "09":
        result = result + "9";
        break;

      case "10":
        result = result + "10";
        break;

      case "11":
        result = result + "J";
        break;

      case "12":
        result = result + "Q";
        break;

      case "13":
        result = result + "K";
        break;

      case "14":
        result = result + "A";
        break;

      case "15":
        result = result + "2";
        break;
    }

    return result;
  }
};

PokerUtil.sortPokers = function (gameHost, cardArray) {
  var type1Array = [];
  var type2Array = [];
  var type3Array = [];
  var type4Array = [];
  var hostArray = []; //活动主

  for (var i = 0; i < cardArray.length; i++) {
    var item = cardArray[i];

    if (item == 171 || item == 161) {
      hostArray.push(item);
      continue;
    } // let type=parseInt(item.substring(2));


    var value = Math.floor(item / 10);

    if (PokerUtil.quaryIsHost(value)) {
      hostArray.push(item);
      continue;
    }

    var type = item % 10;

    switch (type) {
      case 1:
        type1Array.push(item);
        break;

      case 2:
        type2Array.push(item);
        break;

      case 3:
        type3Array.push(item);
        break;

      case 4:
        type4Array.push(item);
        break;
    }
  }

  hostArray.sort(PokerUtil.sort);
  type1Array.sort(PokerUtil.sort);
  type2Array.sort(PokerUtil.sort);
  type3Array.sort(PokerUtil.sort);
  type3Array.sort(PokerUtil.sort);

  switch (parseInt(gameHost)) {
    case 1:
      return PokerUtil.createStatic(type1Array, type2Array, type3Array, type4Array, hostArray, type2Array.concat(type3Array).concat(type4Array).concat(type1Array).concat(hostArray));

    case 2:
      return PokerUtil.createStatic(type1Array, type2Array, type3Array, type4Array, hostArray, type3Array.concat(type4Array).concat(type1Array).concat(type2Array).concat(hostArray));

    case 3:
      return PokerUtil.createStatic(type1Array, type2Array, type3Array, type4Array, hostArray, type4Array.concat(type1Array).concat(type2Array).concat(type3Array).concat(hostArray));

    case 4:
      return PokerUtil.createStatic(type1Array, type2Array, type3Array, type4Array, hostArray, type1Array.concat(type2Array).concat(type3Array).concat(type4Array).concat(hostArray));
  }
};

PokerUtil.createStatic = function (type1Array, type2Array, type3Array, type4Array, hostArray, total) {
  return {
    type1Array: type1Array,
    type2Array: type2Array,
    type3Array: type3Array,
    type4Array: type4Array,
    hostArray: hostArray,
    total: total
  };
};

module.exports = exports["default"];

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcUG9rZXJVdGlsLmpzIl0sIm5hbWVzIjpbInBva2VyV2VpZ2h0IiwiTEVGVF9XSU4iLCJSSUdIVF9XSU4iLCJQb2tlclV0aWwiLCJxdWFyeVBva2VyV2VpZ2h0IiwicG9rZXIiLCJpbmRleE9mIiwicXVhcnlJc0hvc3QiLCJ2YWx1ZSIsInBhcnNlSW50IiwicXVhcnlJc1NvY2VyIiwiY29tcGFyZVZpY2UiLCJyb3VuZGhvc3QiLCJ0eXBlTGVmdCIsInR5cGVSaWdodCIsImNvbnRlbnRMZWZ0IiwiY29udGVudFJpZ2h0IiwiY29tcGFyZVNpbmdsZVBva2VyQmlnZ2VyIiwidGVzdExvZ2ljIiwidGVzdEFycmF5IiwiZ2FtZWhvc3QiLCJNYXRoIiwicmFuZG9tIiwiY29uc29sZSIsImxvZyIsImxlbmd0aCIsInRlc3RWYWx1ZSIsInN1YnN0cmluZyIsImNvbXBhcmVQb2tlciIsInRlc3RBcnJheUxvZ2ljIiwidGVzdEFycmF5MSIsInRlc3RBcnJheTIiLCJ2YWx1ZUxlZnQiLCJ2YWx1ZVJpZ2h0IiwicXVhcnlQb2tlclZhbHVlIiwiQXJyYXkiLCJpc0FycmF5IiwiZXJyb3IiLCJjb21wYXJlQXJyYXkiLCJsZWZ0SXNIb3N0IiwicmlnaHRJc0hvc3QiLCJyZXN1bHQiLCJsZWZ0TnVtIiwicmlnaHROdW0iLCJhcnJheUxlZnQiLCJzb3J0IiwiYXJyYXlSaWdodCIsInJlc3VsdExlZnQiLCJjaGVja0FycmF5VmFsdWUiLCJyZXN1bHRSaWdodCIsImFycmF5Iiwib2RkIiwiZXZlbiIsImxhc3RUeXBlIiwiaW5kZXgiLCJjYXJkTnVtIiwidHlwZSIsInN0ciIsInF1YXJ5VHlwZSIsImNvbXBhcmUiLCJjb21wYXJlUm91bmQiLCJwbGF5UG9rZXJzIiwiZGVzdG9yeUFycmF5IiwiZGVzdG9yeU5vZGUiLCJpIiwiZGVzdHJveSIsImEiLCJiIiwiZmxvb3IiLCJsZWZ0IiwicmlnaHQiLCJzb3J0SW5zZXJ0IiwiaXRlbSIsInB1c2giLCJ3ZWlnaHQiLCJmaXJzdFdlaWdodCIsImxhc3RXZWlnaHQiLCJxdWFyeVBva2VyVHlwZVZhbHVlIiwicG9rZXJWYWx1ZSIsInNvcnRQb2tlcnMiLCJnYW1lSG9zdCIsImNhcmRBcnJheSIsInR5cGUxQXJyYXkiLCJ0eXBlMkFycmF5IiwidHlwZTNBcnJheSIsInR5cGU0QXJyYXkiLCJob3N0QXJyYXkiLCJjcmVhdGVTdGF0aWMiLCJjb25jYXQiLCJ0b3RhbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLFdBQVcsR0FBRyxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCLEVBQWhCLEVBQW9CLEVBQXBCLEVBQXdCLEVBQXhCLEVBQTRCLEVBQTVCLEVBQWdDLEVBQWhDLEVBQW9DLEVBQXBDLEVBQXdDLENBQXhDLEVBQTJDLENBQTNDLEVBQThDLEVBQTlDLEVBQWtELEVBQWxELEVBQXNELEVBQXRELENBQWxCLEVBQTRFOztBQUM1RSxJQUFJQyxRQUFRLEdBQUcsQ0FBQyxDQUFoQjtBQUNBLElBQUlDLFNBQVMsR0FBRyxDQUFoQjs7SUFDcUJDOzs7QUF3QmpCOzs7Ozs7Ozs7OztBQTRFQTs7Ozs7O0FBc0JBOzs7O1lBSU9DLG1CQUFQLDBCQUF3QkMsS0FBeEIsRUFBK0I7QUFDM0IsV0FBT0wsV0FBVyxDQUFDTSxPQUFaLENBQW9CRCxLQUFwQixDQUFQO0FBQ0g7QUFFRDs7Ozs7WUFHT0UsY0FBUCxxQkFBbUJGLEtBQW5CLEVBQTBCO0FBQ3RCLFFBQUlHLEtBQUssR0FBR0MsUUFBUSxDQUFDSixLQUFELENBQXBCO0FBQ0EsV0FBT0csS0FBSyxJQUFJLEVBQVQsSUFBZUEsS0FBSyxJQUFJLENBQXhCLElBQTZCQSxLQUFLLElBQUksQ0FBdEMsSUFBMkNBLEtBQUssSUFBSSxFQUFwRCxJQUEwREEsS0FBSyxJQUFJLEVBQW5FLElBQXlFQSxLQUFLLElBQUksRUFBekYsQ0FGc0IsQ0FFc0U7QUFDL0Y7O1lBRU1FLGVBQVAsc0JBQW9CTCxL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LENBREcsQ0FBUDs7QUFFSixTQUFLLENBQUw7QUFDSSxhQUFPbkYsU0FBUyxDQUFDb0YsWUFBVixDQUF1QkwsVUFBdkIsRUFBa0NDLFVBQWxDLEVBQTZDQyxVQUE3QyxFQUF3REMsVUFBeEQsRUFBbUVDLFNBQW5FLEVBQ0hKLFVBQVUsQ0FBQ00sTUFBWCxDQUFrQkwsVUFBbEIsRUFBOEJLLE1BQTlCLENBQXFDSixVQUFyQyxFQUFpREksTUFBakQsQ0FBd0RILFVBQXhELEVBQW9FRyxNQUFwRSxDQUEyRUYsU0FBM0UsQ0FERyxDQUFQO0FBWFI7QUFjSDs7QUF6YmdCbkYsVUE0YlhvRixlQUFhLFVBQUNMLFVBQUQsRUFBWUMsVUFBWixFQUF1QkMsVUFBdkIsRUFBa0NDLFVBQWxDLEVBQTZDQyxTQUE3QyxFQUF1REcsS0FBdkQsRUFBK0Q7QUFDOUUsU0FBTztBQUNIUCxJQUFBQSxVQUFVLEVBQUNBLFVBRFI7QUFFSEMsSUFBQUEsVUFBVSxFQUFDQSxVQUZSO0FBR0hDLElBQUFBLFVBQVUsRUFBQ0EsVUFIUjtBQUlIQyxJQUFBQSxVQUFVLEVBQUNBLFVBSlI7QUFLSEMsSUFBQUEsU0FBUyxFQUFDQSxTQUxQO0FBTUhHLElBQUFBLEtBQUssRUFBQ0E7QUFOSCxHQUFQO0FBU0oiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImxldCBwb2tlcldlaWdodCA9IFs0LCA2LCA3LCA4LCA5LCAxMCwgMTEsIDEyLCAxMywgMTQsIDE1LCAzLCA1LCAxNiwgMTcsIDE4XTsvL+S4uzXkuLoxOFxyXG5sZXQgTEVGVF9XSU4gPSAtMTtcclxubGV0IFJJR0hUX1dJTiA9IDE7XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBva2VyVXRpbCB7XHJcblxyXG4gICAgc3RhdGljIHRlc3RMb2dpYyA9ICh0ZXN0QXJyYXkpID0+IHtcclxuICAgICAgICBsZXQgZ2FtZWhvc3QgPSBNYXRoLnJhbmRvbSgpICogNDtcclxuICAgICAgICBsZXQgcm91bmRob3N0ID0gTWF0aC5yYW5kb20oKSAqIDQ7XHJcbiAgICAgICAgZ2FtZWhvc3QgPSBwYXJzZUludChnYW1laG9zdCkgKyAxO1xyXG4gICAgICAgIHJvdW5kaG9zdCA9IHBhcnNlSW50KHJvdW5kaG9zdCkgKyAxO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwib25pb25cIiwgXCLlvZPliY3muLjmiI/kuLtcIiArIGdhbWVob3N0ICsgXCLmnKzova7kuLtcIiArIHJvdW5kaG9zdCk7XHJcbiAgICAgICAgaWYgKHRlc3RBcnJheS5sZW5ndGggPT0gMSkge1xyXG4gICAgICAgICAgICBsZXQgdGVzdFZhbHVlID0gdGVzdEFycmF5WzBdICsgXCJcIjtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJvbmlvblwiLCBQb2tlclV0aWwucXVhcnlQb2tlcldlaWdodChwYXJzZUludCh0ZXN0VmFsdWUuc3Vic3RyaW5nKDAsIDIpKSkpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGVzdEFycmF5Lmxlbmd0aCA+PSAyKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib25pb25cIiwgUG9rZXJVdGlsLmNvbXBhcmVQb2tlcihnYW1laG9zdCwgcm91bmRob3N0LCB0ZXN0QXJyYXlbMF0sIHRlc3RBcnJheVsxXSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHN0YXRpYyB0ZXN0QXJyYXlMb2dpYyA9ICh0ZXN0QXJyYXkxLCB0ZXN0QXJyYXkyKSA9PiB7XHJcbiAgICAgICAgbGV0IGdhbWVob3N0ID0gTWF0aC5yYW5kb20oKSAqIDQ7XHJcbiAgICAgICAgbGV0IHJvdW5kaG9zdCA9IE1hdGgucmFuZG9tKCkgKiA0O1xyXG4gICAgICAgIGdhbWVob3N0ID0gcGFyc2VJbnQoZ2FtZWhvc3QpICsgMTtcclxuICAgICAgICByb3VuZGhvc3QgPSBwYXJzZUludChyb3VuZGhvc3QpICsgMTtcclxuICAgICAgXHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5q+U6L6D54mM55qE5aSn5bCPXHJcbiAgICAgKiDmnIDlkI7kuIDkvY3mmK/oirHoibLvvIzliY3pnaLnm7TmjqXmr5TlpKflsI9cclxuICAgICAqIOinhOWImSAx5ri45oiP5Li7Pui9ruasoeS4uz7lia9cclxuICAgICAqICAgICAgMiA1PueOiz4zPjJcclxuICAgICAqICAgICAgMyDlkIzkuLrlia/niYzvvIzoirHoibLmr5TlpKflsI9cclxuICAgICAqICAgICAgNFxyXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZUxlZnQgIOWFiOeJjFxyXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZVJpZ2h0IOWQjueJjFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY29tcGFyZVBva2VyID0gKGdhbWVob3N0LCByb3VuZGhvc3QsIHZhbHVlTGVmdCwgdmFsdWVSaWdodCkgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwib25pb25cIiwgXCJjb21wYXJlUG9rZXIrK1wiICsgUG9rZXJVdGlsLnF1YXJ5UG9rZXJWYWx1ZSh2YWx1ZUxlZnQpICsgXCIvXCIgKyBQb2tlclV0aWwucXVhcnlQb2tlclZhbHVlKHZhbHVlUmlnaHQpKTtcclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZUxlZnQpIHx8IEFycmF5LmlzQXJyYXkodmFsdWVSaWdodCkpIHtcclxuICAgICAgICAgICAgaWYodmFsdWVMZWZ0Lmxlbmd0aD09MSl7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZUxlZnQ9dmFsdWVMZWZ0WzBdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKHZhbHVlUmlnaHQubGVuZ3RoPT0xKXtcclxuICAgICAgICAgICAgICAgIHZhbHVlUmlnaHQ9dmFsdWVSaWdodFswXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWVMZWZ0KSB8fCBBcnJheS5pc0FycmF5KHZhbHVlUmlnaHQpKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJvbmlvblwiLCBcIuaaguS4jeaUr+aMgeaVsOe7hFwiKTtcclxuICAgICAgICAgICAgUG9rZXJVdGlsLmNvbXBhcmVBcnJheShnYW1laG9zdCwgcm91bmRob3N0LCB2YWx1ZUxlZnQsIHZhbHVlUmlnaHQpO1xyXG4gICAgICAgICAgICByZXR1cm4gTEVGVF9XSU47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh2YWx1ZVJpZ2h0ID09IHZhbHVlTGVmdCkge1xyXG4gICAgICAgICAgICAvL+WujOWFqOebuOWQjO+8jOWFiOeJjOWkp1xyXG4gICAgICAgICAgICByZXR1cm4gTEVGVF9XSU47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhbHVlUmlnaHQgPSB2YWx1ZVJpZ2h0ICsgXCJcIjtcclxuICAgICAgICB2YWx1ZUxlZnQgPSB2YWx1ZUxlZnQgKyBcIlwiO1xyXG4gICAgICAgIC8vMSDliKTmlq3lhYjniYzlkI7niYznmoToirHoibJcclxuICAgICAgICBsZXQgdHlwZUxlZnQgPSB2YWx1ZUxlZnQuc3Vic3RyaW5nKDIpO1xyXG4gICAgICAgIGxldCB0eXBlUmlnaHQgPSB2YWx1ZVJpZ2h0LnN1YnN0cmluZygyKTtcclxuICAgICAgICAvLzLliKTmlq3lhYjniYzlkI7niYzlgLxcclxuICAgICAgICBsZXQgY29udGVudExlZnQgPSB2YWx1ZUxlZnQuc3Vic3RyaW5nKDAsIDIpO1xyXG4gICAgICAgIGxldCBjb250ZW50UmlnaHQgPSB2YWx1ZVJpZ2h0LnN1YnN0cmluZygwLCAyKTtcclxuICAgICAgICAvLzPliKTmlq3niYzmmK/lkKbkuLrkuLsg5rS75Yqo5Li7XHJcbiAgICAgICAgbGV0IGxlZnRJc0hvc3QgPSB0eXBlTGVmdCA9PSBnYW1laG9zdCB8fCBQb2tlclV0aWwucXVhcnlJc0hvc3QoY29udGVudExlZnQpO1xyXG4gICAgICAgIGxldCByaWdodElzSG9zdCA9IHR5cGVMZWZ0ID09IGdhbWVob3N0IHx8IFBva2VyVXRpbC5xdWFyeUlzSG9zdChjb250ZW50UmlnaHQpO1xyXG4gICAgICAgIC8vNOavlOi+g1xyXG4gICAgICAgIGlmIChsZWZ0SXNIb3N0ICYmIHJpZ2h0SXNIb3N0KSB7XHJcbiAgICAgICAgICAgIC8v5ZCM5Li65Li777yM5Li7NeacgOWkp1xyXG4gICAgICAgICAgICBpZiAocGFyc2VJbnQoY29udGVudExlZnQpID09IDUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBMRUZUX1dJTjtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChwYXJzZUludChjb250ZW50UmlnaHQpID09IDUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBSSUdIVF9XSU47XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvL+ebtOaOpeavlOWkp+Wwj1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlc3VsdCA9IFBva2VyVXRpbC5jb21wYXJlU2luZ2xlUG9rZXJCaWdnZXIoY29udGVudExlZnQsIGNvbnRlbnRSaWdodCk7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0ICE9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvL+Wkp+Wwj+ebuOWQjO+8jOWtmOWcqOa0u+WKqOS4u+WSjOiKseiJsuS4u+eJjOWAvOebuOWQjOaDheWGtVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlTGVmdCA9PSBnYW1laG9zdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gTEVGVF9XSU47XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlUmlnaHQgPT0gZ2FtZWhvc3QpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJJR0hUX1dJTjtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Ugey8v5ZCM5Li65rS75Yqo5Li7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBMRUZUX1dJTjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChsZWZ0SXNIb3N0KSB7XHJcbiAgICAgICAgICAgIC8v5YWI54mM5piv5Li777yM5YWI54mM5aSnXHJcbiAgICAgICAgICAgIHJldHVybiBMRUZUX1dJTjtcclxuICAgICAgICB9IGVsc2UgaWYgKHJpZ2h0SXNIb3N0KSB7XHJcbiAgICAgICAgICAgIC8v5ZCO54mM5piv5Li777yM5ZCO54mM5aSnXHJcbiAgICAgICAgICAgIHJldHVybiBSSUdIVF9XSU47XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIFBva2VyVXRpbC5jb21wYXJlVmljZShyb3VuZGhvc3QsIHR5cGVMZWZ0LCB0eXBlUmlnaHQsIGNvbnRlbnRMZWZ0LCBjb250ZW50UmlnaHQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOS4jeWIpOaWreiKseiJsu+8jOebtOaOpeavlOWkp+WwjyDlj6rmjqXlj5fkuKTkvY1cclxuICAgICAqIOWFgeiuuOi/lOWbnjBcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjb21wYXJlU2luZ2xlUG9rZXJCaWdnZXIgPSAodmFsdWVMZWZ0LCB2YWx1ZVJpZ2h0KSA9PiB7XHJcbiAgICAgICAgaWYgKHZhbHVlTGVmdC5sZW5ndGggPiAyIHx8IHZhbHVlUmlnaHQubGVuZ3RoID4gMikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwi5Y+q5o6l5Y+X5Lik5L2N55qEXCIgKyB2YWx1ZUxlZnQgKyBcIi9cIiArIHZhbHVlUmlnaHQpO1xyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGxlZnROdW0gPSBwYXJzZUludCh2YWx1ZUxlZnQpO1xyXG4gICAgICAgIGxldCByaWdodE51bSA9IHBhcnNlSW50KHZhbHVlUmlnaHQpO1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBQb2tlclV0aWwucXVhcnlQb2tlcldlaWdodChyaWdodE51bSkgLSBQb2tlclV0aWwucXVhcnlQb2tlcldlaWdodChsZWZ0TnVtKTtcclxuICAgICAgICBpZiAocmVzdWx0ID4gMCkge1xyXG4gICAgICAgICAgICByZXN1bHQgPSBSSUdIVF9XSU47XHJcbiAgICAgICAgfSBlbHNlIGlmIChyZXN1bHQgPCAwKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IExFRlRfV0lOO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIpOaWreeJjOeahOWkp+Wwj1xyXG4gICAgICogQHBhcmFtIHsqfSBwb2tlclxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcXVhcnlQb2tlcldlaWdodChwb2tlcikge1xyXG4gICAgICAgIHJldHVybiBwb2tlcldlaWdodC5pbmRleE9mKHBva2VyKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIpOaWreeJjOaYr+S4jeaYr+a0u+WKqOS4uyAxNSAzIDXlr7nlupQgMiAzIDVcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHF1YXJ5SXNIb3N0KHBva2VyKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlID0gcGFyc2VJbnQocG9rZXIpO1xyXG4gICAgICAgIHJldHVybiB2YWx1ZSA9PSAxNSB8fCB2YWx1ZSA9PSAzIHx8IHZhbHVlID09IDUgfHwgdmFsdWUgPT0gMTYgfHwgdmFsdWUgPT0gMTcgfHwgdmFsdWUgPT0gMTg7Ly8yIDMgNSDlsI/njosg5aSn546LIOS4uzVcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgcXVhcnlJc1NvY2VyKHBva2VyKXtcclxuICAgICAgICByZXR1cm4gcG9rZXI9PTV8fHBva2VyPT0xMHx8cG9rZXI9PTEzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yik5pat5Ymv54mM6LCB5aSnXHJcbiAgICAgKiBAcGFyYW0geyp9IHJvdW5kaG9zdFxyXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZUxlZnRcclxuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWVSaWdodFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY29tcGFyZVZpY2Uocm91bmRob3N0LCB0eXBlTGVmdCwgdHlwZVJpZ2h0LCBjb250ZW50TGVmdCwgY29udGVudFJpZ2h0KSB7XHJcbiAgICAgICAgaWYgKHR5cGVSaWdodCA9PSB0eXBlTGVmdCA9PSByb3VuZGhvc3QpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFBva2VyVXRpbC5jb21wYXJlU2luZ2xlUG9rZXJCaWdnZXIoY29udGVudExlZnQsIGNvbnRlbnRSaWdodCk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlTGVmdCA9PSByb3VuZGhvc3QpIHtcclxuICAgICAgICAgICAgcmV0dXJuIExFRlRfV0lOO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZVJpZ2h0ID09IHJvdW5kaG9zdCkge1xyXG4gICAgICAgICAgICByZXR1cm4gUklHSFRfV0lOO1xyXG4gICAgICAgIH0gZWxzZSB7Ly/pg73mmK/lia/niYwg5LiN5piv5pys6L2u5Li777yM5aSa5Y2K5piv6Lef54mM77yM5oSP5LmJ5LiN5aSnXHJcbiAgICAgICAgICAgIHJldHVybiBMRUZUX1dJTjtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjb21wYXJlQXJyYXkgPSAoZ2FtZWhvc3QsIHJvdW5kaG9zdCwgdmFsdWVMZWZ0LCB2YWx1ZVJpZ2h0KSA9PiB7XHJcbiAgICAgICAgLy/lgbbmlbDlvKDvvIzmjpLmlbDkuI3kuIDoh7RcclxuICAgICAgICBpZiAodmFsdWVMZWZ0Lmxlbmd0aCAhPSB2YWx1ZVJpZ2h0Lmxlbmd0aCB8fCB2YWx1ZUxlZnQubGVuZ3RoICUgMiAhPSAwKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJvbmlvblwiLCBcIuaVsOe7hOmVv+W6puS4jeS4gOiHtFwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIExFRlRfV0lOO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLzEg5o6S5bqPXHJcbiAgICAgICAgbGV0IGFycmF5TGVmdCA9IHZhbHVlTGVmdC5zb3J0KCk7XHJcbiAgICAgICAgbGV0IGFycmF5UmlnaHQgPSB2YWx1ZVJpZ2h0LnNvcnQoKTtcclxuICAgICAgICAvLzIg5aWH5pWw5ZKM5YG25pWw5LiA5qC377yM5Yik5pat5a+55a2Q5ZCI5rOV5oCnXHJcbiAgICAgICAgbGV0IHJlc3VsdExlZnQgPSBQb2tlclV0aWwuY2hlY2tBcnJheVZhbHVlKGFycmF5TGVmdCk7XHJcbiAgICAgICAgbGV0IHJlc3VsdFJpZ2h0ID0gUG9rZXJVdGlsLmNoZWNrQXJyYXlWYWx1ZShhcnJheVJpZ2h0KTtcclxuICAgICAgICBpZiAocmVzdWx0TGVmdFswXSA9PSBcIi0xXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFJJR0hUX1dJTjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlc3VsdFJpZ2h0WzBdID09IFwiLTFcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gTEVGVF9XSU47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZ2FtZWhvc3QgPT0gcmVzdWx0TGVmdFswXSA9PSByZXN1bHRSaWdodFswXSkge1xyXG4gICAgICAgICAgICAvL+mDveaYr+S4u+WvuVxyXG4gICAgICAgICAgICBpZiAocmVzdWx0TGVmdFsxXSA+IHJlc3VsdFJpZ2h0WzFdKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gTEVGVF9XSU47XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUklHSFRfV0lOO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChnYW1laG9zdCA9PSByZXN1bHRMZWZ0WzBdKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBMRUZUX1dJTjtcclxuICAgICAgICB9IGVsc2UgaWYgKGdhbWVob3N0ID09IHJlc3VsdFJpZ2h0WzBdKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBSSUdIVF9XSU47XHJcbiAgICAgICAgfSBlbHNlIGlmIChyb3VuZGhvc3QgPT0gcmVzdWx0TGVmdFswXSA9PSByZXN1bHRSaWdodFswXSkge1xyXG4gICAgICAgICAgICAvL+mDveaYr+WJr+WvuVxyXG4gICAgICAgICAgICBpZiAocmVzdWx0TGVmdFsxXSA+IHJlc3VsdFJpZ2h0WzFdKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gTEVGVF9XSU47XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUklHSFRfV0lOO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChyb3VuZGhvc3QgPT0gcmVzdWx0TGVmdFswXSkge1xyXG4gICAgICAgICAgICByZXR1cm4gTEVGVF9XSU47XHJcbiAgICAgICAgfSBlbHNlIGlmIChnYW1laG9zdCA9PSByZXN1bHRSaWdodFswXSkge1xyXG4gICAgICAgICAgICByZXR1cm4gUklHSFRfV0lOO1xyXG4gICAgICAgIH0gZWxzZSB7Ly/pg73kuI3mmK/kuLsg6Lef54mM5aSn5bCP5peg5oSP5LmJXHJcbiAgICAgICAgICAgIHJldHVybiBMRUZUX1dJTjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8v5LiA5a+555u05o6l5q+UXHJcbiAgICAgICAgLy/lpJrlr7nlhYjmoKHpqozlkIjms5XmgKfvvIwx5piv5ZCm5aSa5a+5IDLmmK/lkKbov57lr7kgM+iKseiJsuS4gOiHtCA0XHJcblxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDliKTmlq3lr7nlrZDlkIjms5XmgKcg6L+U5ZueW+iKseiJsiDmnYPph41dXHJcbiAgICAgKiBAcGFyYW0geyp9IGFycmF5IFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY2hlY2tBcnJheVZhbHVlID0gKGFycmF5KSA9PiB7XHJcbiAgICAgICAgbGV0IG9kZCA9IFwiLTFcIjtcclxuICAgICAgICBsZXQgZXZlbiA9IFwiLTFcIlxyXG4gICAgICAgIGxldCBsYXN0VHlwZSA9IFwiLTFcIjtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gMDtcclxuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgYXJyYXkubGVuZ3RoOyBpbmRleCsrKSB7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCAlIDIgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgZXZlbiA9IGFycmF5W2luZGV4XTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG9kZCA9IGFycmF5W2luZGV4XTtcclxuICAgICAgICAgICAgICAgIGlmIChldmVuICE9IG9kZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbXCItMVwiLCAtMV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsZXQgY2FyZE51bSA9IG9kZDtcclxuICAgICAgICAgICAgICAgIGxldCB0eXBlID0gXCIwXCI7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2FyZE51bSA9PSBcIjE3MVwiIHx8IGNhcmROdW0gPT0gXCIxNjFcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIC8v5aSn5bCP546LXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZSA9IFwiNVwiO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc3RyID0gY2FyZE51bS5zdWJzdHJpbmcoMik7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZSA9IFBva2VyVXRpbC5xdWFyeVR5cGUoc3RyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChsYXN0VHlwZSAhPSB0eXBlICYmIGxhc3RUeXBlICE9IFwiLTFcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIC8v5LiN5piv6aaW5qyh5LiU5LiO5LmL5YmN6Iqx6Imy5LiN5ZCM77yM5LiN6IO9566X5a+55a2QXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtcIi0xXCIsIC0xXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGxhc3RUeXBlID0gdHlwZTtcclxuICAgICAgICAgICAgICAgIGxldCBjb21wYXJlID0gY2FyZE51bS5zdWJzdHJpbmcoMCwgMik7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHQgKyBQb2tlclV0aWwucXVhcnlQb2tlcldlaWdodChwYXJzZUludChjb21wYXJlKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFtsYXN0VHlwZSwgcmVzdWx0XTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog5q+U5pys6L2u5aSn5bCP77yM6L+U5Zue6LWi5a62IDEyMzTpobrkvY1cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNvbXBhcmVSb3VuZCA9IChwbGF5UG9rZXJzKSA9PiB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBkZXN0b3J5QXJyYXkgPSAoZGVzdG9yeU5vZGUpID0+IHtcclxuICAgICAgICBpZiAoZGVzdG9yeU5vZGUgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRlc3RvcnlOb2RlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBkZXN0b3J5Tm9kZVtpXS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgc29ydD0oYSxiKT0+e1xyXG4gICAgICAgIGE9TWF0aC5mbG9vcihhLzEwKTtcclxuICAgICAgICBiPU1hdGguZmxvb3IoYi8xMCk7XHJcbiAgICAgICAgbGV0IGxlZnQ9UG9rZXJVdGlsLnF1YXJ5UG9rZXJXZWlnaHQoYSk7XHJcbiAgICAgICAgbGV0IHJpZ2h0PVBva2VyVXRpbC5xdWFyeVBva2VyV2VpZ2h0KGIpO1xyXG4gICAgICAgIHJldHVybiBsZWZ0LXJpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBzb3J0SW5zZXJ0PShhcnJheSxpdGVtKT0+e1xyXG4gICAgICAgIGlmKGFycmF5Lmxlbmd0aD09PTApe1xyXG4gICAgICAgICAgICBhcnJheS5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICByZXR1cm4gYXJyYXlcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gbGV0IHZhbHVlPWl0ZW0uc3Vic3RyaW5nKDAsMik7XHJcbiAgICAgICAgbGV0IHZhbHVlPWl0ZW0vMTA7XHJcbiAgICAgICAgbGV0IHdlaWdodD1Qb2tlclV0aWwucXVhcnlQb2tlcldlaWdodCh2YWx1ZSk7XHJcbiAgICAgICAgbGV0IGZpcnN0V2VpZ2h0PVBva2VyVXRpbC5xdWFyeVBva2VyV2VpZ2h0KGFycmF5WzBdLzEwKTtcclxuICAgICAgICBsZXQgbGFzdFdlaWdodD1Qb2tlclV0aWwucXVhcnlQb2tlcldlaWdodChhcnJheVthcnJheS5sZW5ndGgtMV0vMTApO1xyXG4gICAgICAgIGlmKHdlaWdodDw9Zmlyc3RXZWlnaHQpe1xyXG4gICAgICAgICAgICBhcnJheT1baXRlbSwuLi5hcnJheV07XHJcbiAgICAgICAgICAgIC8vIGFycmF5LnVuc2hpZnQoaXRlbSk7XHJcbiAgICAgICAgfWVsc2UgaWYod2VpZ2h0Pj1sYXN0V2VpZ2h0KXtcclxuICAgICAgICAgICAgYXJyYXkucHVzaChpdGVtKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFycmF5O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgcXVhcnlUeXBlID0gKHR5cGUpID0+IHtcclxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcIjFcIjpcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIuaWueWdl1wiO1xyXG4gICAgICAgICAgICBjYXNlIFwiMlwiOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwi5qKF6IqxXCI7XHJcbiAgICAgICAgICAgIGNhc2UgXCIzXCI6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCLnuqLmoYNcIjtcclxuICAgICAgICAgICAgY2FzZSBcIjRcIjpcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIum7keahg1wiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHN0YXRpYyBxdWFyeVBva2VyVHlwZVZhbHVlID0gKHBva2VyVmFsdWUpID0+IHtcclxuICAgICAgICBwb2tlclZhbHVlPXBva2VyVmFsdWUrXCJcIjtcclxuICAgICAgICBpZiAocG9rZXJWYWx1ZSA9PSBcIjE3MVwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIjNcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHBva2VyVmFsdWUgPT0gXCIxNjFcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gXCI0XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwib25pb25cIixcInBva2VyVmFsdWVcIitwb2tlclZhbHVlKTtcclxuICAgICAgICByZXR1cm4gcG9rZXJWYWx1ZS5zdWJzdHJpbmcoMik7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOmAmui/h+eJjOW6j+afpeiKseiJsuWkp+Wwj1xyXG4gICAgICog5pyA5ZCO5LiA5L2N5piv6Iqx6ImyXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBxdWFyeVBva2VyVmFsdWUgPSAodmFsdWUpID0+IHtcclxuICAgICAgICBsZXQgY2FyZE51bSA9IHZhbHVlICsgXCJcIjtcclxuICAgICAgICBpZiAoY2FyZE51bSA9PSBcIjE3MVwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIuWkp+eOi1wiO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY2FyZE51bSA9PSBcIjE2MVwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIuWwj+eOi1wiXHJcbiAgICAgICAgfSBlbHNlIGlmIChjYXJkTnVtID09IFwiMTgxXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwi5Y2h6IOMXCJcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgY29tcGFyZSA9IGNhcmROdW0uc3Vic3RyaW5nKDAsIDIpO1xyXG4gICAgICAgICAgICBsZXQgdHlwZSA9IGNhcmROdW0uc3Vic3RyaW5nKDIpO1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gUG9rZXJVdGlsLnF1YXJ5VHlwZSh0eXBlKTtcclxuICAgICAgICAgICAgc3dpdGNoIChjb21wYXJlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiMDNcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHQgKyBcIjNcIjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCIwNFwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdCArIFwiNFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiMDVcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHQgKyBcIjVcIjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCIwNlwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdCArIFwiNlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIjA3XCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgXCI3XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiMDhcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHQgKyBcIjhcIjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCIwOVwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdCArIFwiOVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIjEwXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgXCIxMFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIjExXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgXCJKXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiMTJcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHQgKyBcIlFcIjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCIxM1wiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdCArIFwiS1wiO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIjE0XCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgXCJBXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiMTVcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHQgKyBcIjJcIjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaKiueJjOaMieiKseiJsuaOkuWlvVxyXG4gICAgICogQHBhcmFtIGdhbWVIb3N0XHJcbiAgICAgKiBAcGFyYW0gY2FyZEFycmF5XHJcbiAgICAgKiBAcmV0dXJuc1xyXG4gICAgICogIHtcclxuICAgICAgICAgICAgdHlwZTFBcnJheTp0eXBlMUFycmF5LFxyXG4gICAgICAgICAgICB0eXBlMkFycmF5OnR5cGUyQXJyYXksXHJcbiAgICAgICAgICAgIHR5cGUzQXJyYXk6dHlwZTNBcnJheSxcclxuICAgICAgICAgICAgdHlwZTRBcnJheTp0eXBlNEFycmF5LFxyXG4gICAgICAgICAgICBob3N0QXJyYXk6aG9zdEFycmF5LFxyXG4gICAgICAgICAgICB0b3RhbDp0b3RhbFxyXG4gICAgICAgIH1cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHNvcnRQb2tlcnM9KGdhbWVIb3N0LGNhcmRBcnJheSk9PntcclxuICAgICAgICBsZXQgdHlwZTFBcnJheT1bXTtcclxuICAgICAgICBsZXQgdHlwZTJBcnJheT1bXTtcclxuICAgICAgICBsZXQgdHlwZTNBcnJheT1bXTtcclxuICAgICAgICBsZXQgdHlwZTRBcnJheT1bXTtcclxuICAgICAgICBsZXQgaG9zdEFycmF5PVtdOy8v5rS75Yqo5Li7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7aTxjYXJkQXJyYXkubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIGxldCBpdGVtPWNhcmRBcnJheVtpXTtcclxuICAgICAgICAgICAgaWYoaXRlbT09MTcxfHxpdGVtPT0xNjEpe1xyXG4gICAgICAgICAgICAgICAgaG9zdEFycmF5LnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gbGV0IHR5cGU9cGFyc2VJbnQoaXRlbS5zdWJzdHJpbmcoMikpO1xyXG4gICAgICAgICAgICBsZXQgdmFsdWU9TWF0aC5mbG9vcihpdGVtLzEwKTtcclxuICAgICAgICAgICAgaWYoUG9rZXJVdGlsLnF1YXJ5SXNIb3N0KHZhbHVlKSl7XHJcbiAgICAgICAgICAgICAgICBob3N0QXJyYXkucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCB0eXBlPWl0ZW0lMTA7XHJcbiAgICAgICAgICAgIHN3aXRjaCAodHlwZSl7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTFBcnJheS5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGUyQXJyYXkucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICAgICAgICB0eXBlM0FycmF5LnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTRBcnJheS5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGhvc3RBcnJheS5zb3J0KFBva2VyVXRpbC5zb3J0KTtcclxuICAgICAgICB0eXBlMUFycmF5LnNvcnQoUG9rZXJVdGlsLnNvcnQpO1xyXG4gICAgICAgIHR5cGUyQXJyYXkuc29ydChQb2tlclV0aWwuc29ydCk7XHJcbiAgICAgICAgdHlwZTNBcnJheS5zb3J0KFBva2VyVXRpbC5zb3J0KTtcclxuICAgICAgICB0eXBlM0FycmF5LnNvcnQoUG9rZXJVdGlsLnNvcnQpO1xyXG4gICAgICAgIHN3aXRjaCAocGFyc2VJbnQoZ2FtZUhvc3QpKXtcclxuICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFBva2VyVXRpbC5jcmVhdGVTdGF0aWModHlwZTFBcnJheSx0eXBlMkFycmF5LHR5cGUzQXJyYXksdHlwZTRBcnJheSxob3N0QXJyYXksXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTJBcnJheS5jb25jYXQodHlwZTNBcnJheSkuY29uY2F0KHR5cGU0QXJyYXkpLmNvbmNhdCh0eXBlMUFycmF5KS5jb25jYXQoaG9zdEFycmF5KSk7XHJcbiAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICAgIHJldHVybiBQb2tlclV0aWwuY3JlYXRlU3RhdGljKHR5cGUxQXJyYXksdHlwZTJBcnJheSx0eXBlM0FycmF5LHR5cGU0QXJyYXksaG9zdEFycmF5LFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGUzQXJyYXkuY29uY2F0KHR5cGU0QXJyYXkpLmNvbmNhdCh0eXBlMUFycmF5KS5jb25jYXQodHlwZTJBcnJheSkuY29uY2F0KGhvc3RBcnJheSkpO1xyXG4gICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUG9rZXJVdGlsLmNyZWF0ZVN0YXRpYyh0eXBlMUFycmF5LHR5cGUyQXJyYXksdHlwZTNBcnJheSx0eXBlNEFycmF5LGhvc3RBcnJheSxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlNEFycmF5LmNvbmNhdCh0eXBlMUFycmF5KS5jb25jYXQodHlwZTJBcnJheSkuY29uY2F0KHR5cGUzQXJyYXkpLmNvbmNhdChob3N0QXJyYXkpKTtcclxuICAgICAgICAgICAgY2FzZSA0OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFBva2VyVXRpbC5jcmVhdGVTdGF0aWModHlwZTFBcnJheSx0eXBlMkFycmF5LHR5cGUzQXJyYXksdHlwZTRBcnJheSxob3N0QXJyYXksXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTFBcnJheS5jb25jYXQodHlwZTJBcnJheSkuY29uY2F0KHR5cGUzQXJyYXkpLmNvbmNhdCh0eXBlNEFycmF5KS5jb25jYXQoaG9zdEFycmF5KSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgXHJcbiAgIHN0YXRpYyBjcmVhdGVTdGF0aWM9KHR5cGUxQXJyYXksdHlwZTJBcnJheSx0eXBlM0FycmF5LHR5cGU0QXJyYXksaG9zdEFycmF5LHRvdGFsKT0+e1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHR5cGUxQXJyYXk6dHlwZTFBcnJheSxcclxuICAgICAgICAgICAgdHlwZTJBcnJheTp0eXBlMkFycmF5LFxyXG4gICAgICAgICAgICB0eXBlM0FycmF5OnR5cGUzQXJyYXksXHJcbiAgICAgICAgICAgIHR5cGU0QXJyYXk6dHlwZTRBcnJheSxcclxuICAgICAgICAgICAgaG9zdEFycmF5Omhvc3RBcnJheSxcclxuICAgICAgICAgICAgdG90YWw6dG90YWxcclxuICAgICAgICB9XHJcblxyXG4gICB9XHJcblxyXG59Il19
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/Card.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'a33bdDMnNJPOoeK9yA2ZiuG', 'Card');
// scripts/Card.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    picNum: "181",
    isCheck: false,
    sprite: {
      "default": null,
      type: cc.SpriteFrame
    }
  },
  start: function start() {// var node = new cc.Node('Sprite');
    // var sp = node.addComponent(cc.Sprite);
    // sp.spriteFrame = cardPic;
    // node.parent = this.node;
  },
  setPicNum: function setPicNum(picNum) {
    console.log("onion setPicNum" + picNum);
    this.picNum = picNum;
  },
  // update: function (dt) {
  // },
  onLoad: function onLoad() {
    // add key down and key up event
    // let picNum=this.game.getPicNum();
    // cc.systemEvent.on();
    this.node.on("mousedown", this.onMouseDown, this);
    var self = this;
    cc.resources.load("pokers", cc.SpriteAtlas, function (err, atlas) {
      var frame = atlas.getSpriteFrame(self.picNum); // console.log('onion==='+self.getComponent(cc.Sprite));

      self.getComponent(cc.Sprite).spriteFrame = frame; // this.spriteFrame= frame;
    });
  },
  onDestroy: function onDestroy() {
    // cc.systemEvent.off("mousedown", this.onMouseDown);
    this.node.off('mousedown', this.onMouseDown, this);
  },
  onMouseDown: function onMouseDown(event) {
    console.log('Press a key');
    event.stopPropagation();

    if (this.isCheck) {
      this.isCheck = false;
      this.node.y = this.node.y - 50;
    } else {
      this.isCheck = true;
      this.node.y = this.node.y + 50;
    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcQ2FyZC5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsInBpY051bSIsImlzQ2hlY2siLCJzcHJpdGUiLCJ0eXBlIiwiU3ByaXRlRnJhbWUiLCJzdGFydCIsInNldFBpY051bSIsImNvbnNvbGUiLCJsb2ciLCJvbkxvYWQiLCJub2RlIiwib24iLCJvbk1vdXNlRG93biIsInNlbGYiLCJyZXNvdXJjZXMiLCJsb2FkIiwiU3ByaXRlQXRsYXMiLCJlcnIiLCJhdGxhcyIsImZyYW1lIiwiZ2V0U3ByaXRlRnJhbWUiLCJnZXRDb21wb25lbnQiLCJTcHJpdGUiLCJzcHJpdGVGcmFtZSIsIm9uRGVzdHJveSIsIm9mZiIsImV2ZW50Iiwic3RvcFByb3BhZ2F0aW9uIiwieSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDTCxhQUFTRCxFQUFFLENBQUNFLFNBRFA7QUFHTEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1ZDLElBQUFBLE1BQU0sRUFBQyxLQURHO0FBRVZDLElBQUFBLE9BQU8sRUFBQyxLQUZFO0FBR1JDLElBQUFBLE1BQU0sRUFBRTtBQUNOLGlCQUFTLElBREg7QUFFTkMsTUFBQUEsSUFBSSxFQUFFUCxFQUFFLENBQUNRO0FBRkg7QUFIQSxHQUhQO0FBV0hDLEVBQUFBLEtBQUssRUFBRSxpQkFBWSxDQUVqQjtBQUNBO0FBRUE7QUFDQTtBQUdELEdBcEJFO0FBc0JIQyxFQUFBQSxTQXRCRyxxQkFzQk9OLE1BdEJQLEVBc0JjO0FBQ2ZPLElBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLG9CQUFrQlIsTUFBOUI7QUFDQSxTQUFLQSxNQUFMLEdBQVlBLE1BQVo7QUFDRCxHQXpCRTtBQTJCTDtBQUNBO0FBRUFTLEVBQUFBLE1BQU0sRUFBRSxrQkFBWTtBQUNoQjtBQUNBO0FBQ0E7QUFDQSxTQUFLQyxJQUFMLENBQVVDLEVBQVYsQ0FBYSxXQUFiLEVBQTBCLEtBQUtDLFdBQS9CLEVBQTJDLElBQTNDO0FBRUYsUUFBSUMsSUFBSSxHQUFDLElBQVQ7QUFDRWpCLElBQUFBLEVBQUUsQ0FBQ2tCLFNBQUgsQ0FBYUMsSUFBYixDQUFrQixRQUFsQixFQUE0Qm5CLEVBQUUsQ0FBQ29CLFdBQS9CLEVBQTRDLFVBQVVDLEdBQVYsRUFBZUMsS0FBZixFQUFzQjtBQUVoRSxVQUFJQyxLQUFLLEdBQUdELEtBQUssQ0FBQ0UsY0FBTixDQUFxQlAsSUFBSSxDQUFDYixNQUExQixDQUFaLENBRmdFLENBSWhFOztBQUNBYSxNQUFBQSxJQUFJLENBQUNRLFlBQUwsQ0FBa0J6QixFQUFFLENBQUMwQixNQUFyQixFQUE2QkMsV0FBN0IsR0FBMENKLEtBQTFDLENBTGdFLENBTWhFO0FBQ0gsS0FQQztBQVFILEdBN0NJO0FBK0NMSyxFQUFBQSxTQS9DSyx1QkErQ1E7QUFDVDtBQUVBLFNBQUtkLElBQUwsQ0FBVWUsR0FBVixDQUFjLFdBQWQsRUFBMkIsS0FBS2IsV0FBaEMsRUFBNkMsSUFBN0M7QUFDSCxHQW5ESTtBQXFETEEsRUFBQUEsV0FBVyxFQUFFLHFCQUFVYyxLQUFWLEVBQWlCO0FBQzFCbkIsSUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksYUFBWjtBQUNBa0IsSUFBQUEsS0FBSyxDQUFDQyxlQUFOOztBQUNBLFFBQUcsS0FBSzFCLE9BQVIsRUFBZ0I7QUFDZCxXQUFLQSxPQUFMLEdBQWEsS0FBYjtBQUNBLFdBQUtTLElBQUwsQ0FBVWtCLENBQVYsR0FBWSxLQUFLbEIsSUFBTCxDQUFVa0IsQ0FBVixHQUFZLEVBQXhCO0FBQ0QsS0FIRCxNQUdLO0FBQ0gsV0FBSzNCLE9BQUwsR0FBYSxJQUFiO0FBQ0EsV0FBS1MsSUFBTCxDQUFVa0IsQ0FBVixHQUFZLEtBQUtsQixJQUFMLENBQVVrQixDQUFWLEdBQVksRUFBeEI7QUFDRDtBQUVKO0FBaEVJLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuICAgIFxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICBwaWNOdW06XCIxODFcIixcclxuICAgICAgaXNDaGVjazpmYWxzZSxcclxuICAgICAgICBzcHJpdGU6IHtcclxuICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXHJcbiAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVGcmFtZSxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICBzdGFydDogZnVuY3Rpb24gKCkge1xyXG4gICAgICBcclxuICAgICAgICAvLyB2YXIgbm9kZSA9IG5ldyBjYy5Ob2RlKCdTcHJpdGUnKTtcclxuICAgICAgICAvLyB2YXIgc3AgPSBub2RlLmFkZENvbXBvbmVudChjYy5TcHJpdGUpO1xyXG4gICAgXHJcbiAgICAgICAgLy8gc3Auc3ByaXRlRnJhbWUgPSBjYXJkUGljO1xyXG4gICAgICAgIC8vIG5vZGUucGFyZW50ID0gdGhpcy5ub2RlO1xyXG5cclxuICAgICAgIFxyXG4gICAgICB9LFxyXG5cclxuICAgICAgc2V0UGljTnVtKHBpY051bSl7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJvbmlvbiBzZXRQaWNOdW1cIitwaWNOdW0pO1xyXG4gICAgICAgIHRoaXMucGljTnVtPXBpY051bTtcclxuICAgICAgfSxcclxuXHJcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xyXG4gICAgLy8gfSxcclxuICAgIFxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLy8gYWRkIGtleSBkb3duIGFuZCBrZXkgdXAgZXZlbnRcclxuICAgICAgICAvLyBsZXQgcGljTnVtPXRoaXMuZ2FtZS5nZXRQaWNOdW0oKTtcclxuICAgICAgICAvLyBjYy5zeXN0ZW1FdmVudC5vbigpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbihcIm1vdXNlZG93blwiLCB0aGlzLm9uTW91c2VEb3duLHRoaXMpO1xyXG4gICAgICAgIFxyXG4gICAgICBsZXQgc2VsZj10aGlzO1xyXG4gICAgICAgIGNjLnJlc291cmNlcy5sb2FkKFwicG9rZXJzXCIsIGNjLlNwcml0ZUF0bGFzLCBmdW5jdGlvbiAoZXJyLCBhdGxhcykge1xyXG4gICAgICAgICBcclxuICAgICAgICAgIHZhciBmcmFtZSA9IGF0bGFzLmdldFNwcml0ZUZyYW1lKHNlbGYucGljTnVtKTtcclxuICAgICAgICBcclxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdvbmlvbj09PScrc2VsZi5nZXRDb21wb25lbnQoY2MuU3ByaXRlKSk7XHJcbiAgICAgICAgICBzZWxmLmdldENvbXBvbmVudChjYy5TcHJpdGUpLnNwcml0ZUZyYW1lID1mcmFtZVxyXG4gICAgICAgICAgLy8gdGhpcy5zcHJpdGVGcmFtZT0gZnJhbWU7XHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBvbkRlc3Ryb3kgKCkge1xyXG4gICAgICAgIC8vIGNjLnN5c3RlbUV2ZW50Lm9mZihcIm1vdXNlZG93blwiLCB0aGlzLm9uTW91c2VEb3duKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLm5vZGUub2ZmKCdtb3VzZWRvd24nLCB0aGlzLm9uTW91c2VEb3duLCB0aGlzKTtcclxuICAgIH0sXHJcblxyXG4gICAgb25Nb3VzZURvd246IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdQcmVzcyBhIGtleScpO1xyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIGlmKHRoaXMuaXNDaGVjayl7XHJcbiAgICAgICAgICB0aGlzLmlzQ2hlY2s9ZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLm5vZGUueT10aGlzLm5vZGUueS01MDtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgIHRoaXMuaXNDaGVjaz10cnVlO1xyXG4gICAgICAgICAgdGhpcy5ub2RlLnk9dGhpcy5ub2RlLnkrNTA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgXHJcbiAgICB9LFxyXG5cclxuXHJcbn0pO1xyXG4iXX0=
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/Player.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '6c688v72QdOKamCGCT+xaAd', 'Player');
// scripts/Player.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    // 主角跳跃高度
    jumpHeight: 0,
    // 主角跳跃持续时间
    jumpDuration: 0,
    // 最大移动速度
    maxMoveSpeed: 0,
    // 加速度
    accel: 0,
    // 跳跃音效资源
    jumpAudio: {
      "default": null,
      type: cc.AudioClip
    }
  },
  setJumpAction: function setJumpAction() {
    // 跳跃上升
    var jumpUp = cc.moveBy(this.jumpDuration, cc.v2(0, this.jumpHeight)).easing(cc.easeCubicActionOut()); // 下落

    var jumpDown = cc.moveBy(this.jumpDuration, cc.v2(0, -this.jumpHeight)).easing(cc.easeCubicActionIn()); // 添加一个回调函数，用于在动作结束时调用我们定义的其他方法

    var callback = cc.callFunc(this.playJumpSound, this); // 不断重复，而且每次完成落地动作后调用回调来播放声音

    return cc.repeatForever(cc.sequence(jumpUp, jumpDown, callback));
  },
  playJumpSound: function playJumpSound() {
    // 调用声音引擎播放声音
    cc.audioEngine.playEffect(this.jumpAudio, false);
  },
  onKeyDown: function onKeyDown(event) {
    // set a flag when key pressed
    console.log('Press a key');

    switch (event.keyCode) {
      case cc.macro.KEY.a:
        this.accLeft = true;
        break;

      case cc.macro.KEY.d:
        this.accRight = true;
        break;
    }
  },
  onKeyUp: function onKeyUp(event) {
    // unset a flag when key released
    switch (event.keyCode) {
      case cc.macro.KEY.a:
        this.accLeft = false;
        break;

      case cc.macro.KEY.d:
        this.accRight = false;
        break;
    }
  },
  onLoad: function onLoad() {
    // 初始化跳跃动作
    this.jumpAction = this.setJumpAction();
    this.node.runAction(this.jumpAction); // 加速度方向开关

    this.accLeft = false;
    this.accRight = false; // 主角当前水平方向速度

    this.xSpeed = 0; // 初始化键盘输入监听

    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
  },
  onDestroy: function onDestroy() {
    // 取消键盘输入监听
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
  },
  update: function update(dt) {
    // 根据当前加速度方向每帧更新速度
    if (this.accLeft) {
      this.xSpeed -= this.accel * dt;
    } else if (this.accRight) {
      this.xSpeed += this.accel * dt;
    } // 限制主角的速度不能超过最大值


    if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
      // if speed reach limit, use max speed with current direction
      this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
    } // 根据当前速度更新主角的位置


    this.node.x += this.xSpeed * dt;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcUGxheWVyLmpzIl0sIm5hbWVzIjpbImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwianVtcEhlaWdodCIsImp1bXBEdXJhdGlvbiIsIm1heE1vdmVTcGVlZCIsImFjY2VsIiwianVtcEF1ZGlvIiwidHlwZSIsIkF1ZGlvQ2xpcCIsInNldEp1bXBBY3Rpb24iLCJqdW1wVXAiLCJtb3ZlQnkiLCJ2MiIsImVhc2luZyIsImVhc2VDdWJpY0FjdGlvbk91dCIsImp1bXBEb3duIiwiZWFzZUN1YmljQWN0aW9uSW4iLCJjYWxsYmFjayIsImNhbGxGdW5jIiwicGxheUp1bXBTb3VuZCIsInJlcGVhdEZvcmV2ZXIiLCJzZXF1ZW5jZSIsImF1ZGlvRW5naW5lIiwicGxheUVmZmVjdCIsIm9uS2V5RG93biIsImV2ZW50IiwiY29uc29sZSIsImxvZyIsImtleUNvZGUiLCJtYWNybyIsIktFWSIsImEiLCJhY2NMZWZ0IiwiZCIsImFjY1JpZ2h0Iiwib25LZXlVcCIsIm9uTG9hZCIsImp1bXBBY3Rpb24iLCJub2RlIiwicnVuQWN0aW9uIiwieFNwZWVkIiwic3lzdGVtRXZlbnQiLCJvbiIsIlN5c3RlbUV2ZW50IiwiRXZlbnRUeXBlIiwiS0VZX0RPV04iLCJLRVlfVVAiLCJvbkRlc3Ryb3kiLCJvZmYiLCJ1cGRhdGUiLCJkdCIsIk1hdGgiLCJhYnMiLCJ4Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNMLGFBQVNELEVBQUUsQ0FBQ0UsU0FEUDtBQUdMQyxFQUFBQSxVQUFVLEVBQUU7QUFDUjtBQUNBQyxJQUFBQSxVQUFVLEVBQUUsQ0FGSjtBQUdSO0FBQ0FDLElBQUFBLFlBQVksRUFBRSxDQUpOO0FBS1I7QUFDQUMsSUFBQUEsWUFBWSxFQUFFLENBTk47QUFPUjtBQUNBQyxJQUFBQSxLQUFLLEVBQUUsQ0FSQztBQVNSO0FBQ0FDLElBQUFBLFNBQVMsRUFBRTtB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STtBQTRFTFksRUFBQUEsU0E1RUssdUJBNEVRO0FBQ1Q7QUFDQWpELElBQUFBLEVBQUUsQ0FBQzJDLFdBQUgsQ0FBZU8sR0FBZixDQUFtQmxELEVBQUUsQ0FBQzZDLFdBQUgsQ0FBZUMsU0FBZixDQUF5QkMsUUFBNUMsRUFBc0QsS0FBS3JCLFNBQTNELEVBQXNFLElBQXRFO0FBQ0ExQixJQUFBQSxFQUFFLENBQUMyQyxXQUFILENBQWVPLEdBQWYsQ0FBbUJsRCxFQUFFLENBQUM2QyxXQUFILENBQWVDLFNBQWYsQ0FBeUJFLE1BQTVDLEVBQW9ELEtBQUtYLE9BQXpELEVBQWtFLElBQWxFO0FBQ0gsR0FoRkk7QUFrRkxjLEVBQUFBLE1BQU0sRUFBRSxnQkFBVUMsRUFBVixFQUFjO0FBQ2xCO0FBQ0EsUUFBSSxLQUFLbEIsT0FBVCxFQUFrQjtBQUNkLFdBQUtRLE1BQUwsSUFBZSxLQUFLbkMsS0FBTCxHQUFhNkMsRUFBNUI7QUFDSCxLQUZELE1BRU8sSUFBSSxLQUFLaEIsUUFBVCxFQUFtQjtBQUN0QixXQUFLTSxNQUFMLElBQWUsS0FBS25DLEtBQUwsR0FBYTZDLEVBQTVCO0FBQ0gsS0FOaUIsQ0FPbEI7OztBQUNBLFFBQUtDLElBQUksQ0FBQ0MsR0FBTCxDQUFTLEtBQUtaLE1BQWQsSUFBd0IsS0FBS3BDLFlBQWxDLEVBQWlEO0FBQzdDO0FBQ0EsV0FBS29DLE1BQUwsR0FBYyxLQUFLcEMsWUFBTCxHQUFvQixLQUFLb0MsTUFBekIsR0FBa0NXLElBQUksQ0FBQ0MsR0FBTCxDQUFTLEtBQUtaLE1BQWQsQ0FBaEQ7QUFDSCxLQVhpQixDQWFsQjs7O0FBQ0EsU0FBS0YsSUFBTCxDQUFVZSxDQUFWLElBQWUsS0FBS2IsTUFBTCxHQUFjVSxFQUE3QjtBQUNIO0FBakdJLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG4gICAgXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyDkuLvop5Lot7Pot4Ppq5jluqZcbiAgICAgICAganVtcEhlaWdodDogMCxcbiAgICAgICAgLy8g5Li76KeS6Lez6LeD5oyB57ut5pe26Ze0XG4gICAgICAgIGp1bXBEdXJhdGlvbjogMCxcbiAgICAgICAgLy8g5pyA5aSn56e75Yqo6YCf5bqmXG4gICAgICAgIG1heE1vdmVTcGVlZDogMCxcbiAgICAgICAgLy8g5Yqg6YCf5bqmXG4gICAgICAgIGFjY2VsOiAwLFxuICAgICAgICAvLyDot7Pot4Ppn7PmlYjotYTmupBcbiAgICAgICAganVtcEF1ZGlvOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuQXVkaW9DbGlwXG4gICAgICAgIH0sXG4gICAgfSxcblxuICAgIHNldEp1bXBBY3Rpb246IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8g6Lez6LeD5LiK5Y2HXG4gICAgICAgIHZhciBqdW1wVXAgPSBjYy5tb3ZlQnkodGhpcy5qdW1wRHVyYXRpb24sIGNjLnYyKDAsIHRoaXMuanVtcEhlaWdodCkpLmVhc2luZyhjYy5lYXNlQ3ViaWNBY3Rpb25PdXQoKSk7XG4gICAgICAgIC8vIOS4i+iQvVxuICAgICAgICB2YXIganVtcERvd24gPSBjYy5tb3ZlQnkodGhpcy5qdW1wRHVyYXRpb24sIGNjLnYyKDAsIC10aGlzLmp1bXBIZWlnaHQpKS5lYXNpbmcoY2MuZWFzZUN1YmljQWN0aW9uSW4oKSk7XG4gICAgICAgIC8vIOa3u+WKoOS4gOS4quWbnuiwg+WHveaVsO+8jOeUqOS6juWcqOWKqOS9nOe7k+adn+aXtuiwg+eUqOaIkeS7rOWumuS5ieeahOWFtuS7luaWueazlVxuICAgICAgICB2YXIgY2FsbGJhY2sgPSBjYy5jYWxsRnVuYyh0aGlzLnBsYXlKdW1wU291bmQsIHRoaXMpO1xuICAgICAgICAvLyDkuI3mlq3ph43lpI3vvIzogIzkuJTmr4/mrKHlrozmiJDokL3lnLDliqjkvZzlkI7osIPnlKjlm57osIPmnaXmkq3mlL7lo7Dpn7NcbiAgICAgICAgcmV0dXJuIGNjLnJlcGVhdEZvcmV2ZXIoY2Muc2VxdWVuY2UoanVtcFVwLCBqdW1wRG93biwgY2FsbGJhY2spKTtcbiAgICB9LFxuXG4gICAgcGxheUp1bXBTb3VuZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyDosIPnlKjlo7Dpn7PlvJXmk47mkq3mlL7lo7Dpn7NcbiAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheUVmZmVjdCh0aGlzLmp1bXBBdWRpbywgZmFsc2UpO1xuICAgIH0sXG5cbiAgICBvbktleURvd24gKGV2ZW50KSB7XG4gICAgICAgIC8vIHNldCBhIGZsYWcgd2hlbiBrZXkgcHJlc3NlZFxuICAgICAgICBjb25zb2xlLmxvZygnUHJlc3MgYSBrZXknKTtcbiAgICAgICAgc3dpdGNoKGV2ZW50LmtleUNvZGUpIHtcbiAgICAgICAgICAgIGNhc2UgY2MubWFjcm8uS0VZLmE6XG4gICAgICAgICAgICAgICAgdGhpcy5hY2NMZWZ0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgY2MubWFjcm8uS0VZLmQ6XG4gICAgICAgICAgICAgICAgdGhpcy5hY2NSaWdodCA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25LZXlVcCAoZXZlbnQpIHtcbiAgICAgICAgLy8gdW5zZXQgYSBmbGFnIHdoZW4ga2V5IHJlbGVhc2VkXG4gICAgICAgIHN3aXRjaChldmVudC5rZXlDb2RlKSB7XG4gICAgICAgICAgICBjYXNlIGNjLm1hY3JvLktFWS5hOlxuICAgICAgICAgICAgICAgIHRoaXMuYWNjTGVmdCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBjYy5tYWNyby5LRVkuZDpcbiAgICAgICAgICAgICAgICB0aGlzLmFjY1JpZ2h0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8g5Yid5aeL5YyW6Lez6LeD5Yqo5L2cXG4gICAgICAgIHRoaXMuanVtcEFjdGlvbiA9IHRoaXMuc2V0SnVtcEFjdGlvbigpO1xuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKHRoaXMuanVtcEFjdGlvbik7XG5cbiAgICAgICAgLy8g5Yqg6YCf5bqm5pa55ZCR5byA5YWzXG4gICAgICAgIHRoaXMuYWNjTGVmdCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmFjY1JpZ2h0ID0gZmFsc2U7XG4gICAgICAgIC8vIOS4u+inkuW9k+WJjeawtOW5s+aWueWQkemAn+W6plxuICAgICAgICB0aGlzLnhTcGVlZCA9IDA7XG5cbiAgICAgICAgLy8g5Yid5aeL5YyW6ZSu55uY6L6T5YWl55uR5ZCsXG4gICAgICAgIGNjLnN5c3RlbUV2ZW50Lm9uKGNjLlN5c3RlbUV2ZW50LkV2ZW50VHlwZS5LRVlfRE9XTiwgdGhpcy5vbktleURvd24sIHRoaXMpO1xuICAgICAgICBjYy5zeXN0ZW1FdmVudC5vbihjYy5TeXN0ZW1FdmVudC5FdmVudFR5cGUuS0VZX1VQLCB0aGlzLm9uS2V5VXAsIHRoaXMpOyAgICBcbiAgICB9LFxuXG4gICAgb25EZXN0cm95ICgpIHtcbiAgICAgICAgLy8g5Y+W5raI6ZSu55uY6L6T5YWl55uR5ZCsXG4gICAgICAgIGNjLnN5c3RlbUV2ZW50Lm9mZihjYy5TeXN0ZW1FdmVudC5FdmVudFR5cGUuS0VZX0RPV04sIHRoaXMub25LZXlEb3duLCB0aGlzKTtcbiAgICAgICAgY2Muc3lzdGVtRXZlbnQub2ZmKGNjLlN5c3RlbUV2ZW50LkV2ZW50VHlwZS5LRVlfVVAsIHRoaXMub25LZXlVcCwgdGhpcyk7XG4gICAgfSwgICAgXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuICAgICAgICAvLyDmoLnmja7lvZPliY3liqDpgJ/luqbmlrnlkJHmr4/luKfmm7TmlrDpgJ/luqZcbiAgICAgICAgaWYgKHRoaXMuYWNjTGVmdCkge1xuICAgICAgICAgICAgdGhpcy54U3BlZWQgLT0gdGhpcy5hY2NlbCAqIGR0O1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYWNjUmlnaHQpIHtcbiAgICAgICAgICAgIHRoaXMueFNwZWVkICs9IHRoaXMuYWNjZWwgKiBkdDtcbiAgICAgICAgfVxuICAgICAgICAvLyDpmZDliLbkuLvop5LnmoTpgJ/luqbkuI3og73otoXov4fmnIDlpKflgLxcbiAgICAgICAgaWYgKCBNYXRoLmFicyh0aGlzLnhTcGVlZCkgPiB0aGlzLm1heE1vdmVTcGVlZCApIHtcbiAgICAgICAgICAgIC8vIGlmIHNwZWVkIHJlYWNoIGxpbWl0LCB1c2UgbWF4IHNwZWVkIHdpdGggY3VycmVudCBkaXJlY3Rpb25cbiAgICAgICAgICAgIHRoaXMueFNwZWVkID0gdGhpcy5tYXhNb3ZlU3BlZWQgKiB0aGlzLnhTcGVlZCAvIE1hdGguYWJzKHRoaXMueFNwZWVkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOagueaNruW9k+WJjemAn+W6puabtOaWsOS4u+inkueahOS9jee9rlxuICAgICAgICB0aGlzLm5vZGUueCArPSB0aGlzLnhTcGVlZCAqIGR0O1xuICAgIH0sXG59KTtcblxuXG4iXX0=
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/migration/use_v2.0.x_cc.Toggle_event.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'bbf567+dqBFRZRllau6BkR5', 'use_v2.0.x_cc.Toggle_event');
// migration/use_v2.0.x_cc.Toggle_event.js

"use strict";

/*
 * This script is automatically generated by Cocos Creator and is only compatible with projects prior to v2.1.0.
 * You do not need to manually add this script in any other project.
 * If you don't use cc.Toggle in your project, you can delete this script directly.
 * If your project is hosted in VCS such as git, submit this script together.
 *
 * 此脚本由 Cocos Creator 自动生成，仅用于兼容 v2.1.0 之前版本的工程，
 * 你无需在任何其它项目中手动添加此脚本。
 * 如果你的项目中没用到 Toggle，可直接删除该脚本。
 * 如果你的项目有托管于 git 等版本库，请将此脚本一并上传。
 */
if (cc.Toggle) {
  // Whether the 'toggle' and 'checkEvents' events are fired when 'toggle.check() / toggle.uncheck()' is called in the code
  // 在代码中调用 'toggle.check() / toggle.uncheck()' 时是否触发 'toggle' 与 'checkEvents' 事件
  cc.Toggle._triggerEventInScript_check = true;
}

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcbWlncmF0aW9uXFx1c2VfdjIuMC54X2NjLlRvZ2dsZV9ldmVudC5qcyJdLCJuYW1lcyI6WyJjYyIsIlRvZ2dsZSIsIl90cmlnZ2VyRXZlbnRJblNjcmlwdF9jaGVjayJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7QUFZQSxJQUFJQSxFQUFFLENBQUNDLE1BQVAsRUFBZTtBQUNYO0FBQ0E7QUFDQUQsRUFBQUEsRUFBRSxDQUFDQyxNQUFILENBQVVDLDJCQUFWLEdBQXdDLElBQXhDO0FBQ0giLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiAqIFRoaXMgc2NyaXB0IGlzIGF1dG9tYXRpY2FsbHkgZ2VuZXJhdGVkIGJ5IENvY29zIENyZWF0b3IgYW5kIGlzIG9ubHkgY29tcGF0aWJsZSB3aXRoIHByb2plY3RzIHByaW9yIHRvIHYyLjEuMC5cclxuICogWW91IGRvIG5vdCBuZWVkIHRvIG1hbnVhbGx5IGFkZCB0aGlzIHNjcmlwdCBpbiBhbnkgb3RoZXIgcHJvamVjdC5cclxuICogSWYgeW91IGRvbid0IHVzZSBjYy5Ub2dnbGUgaW4geW91ciBwcm9qZWN0LCB5b3UgY2FuIGRlbGV0ZSB0aGlzIHNjcmlwdCBkaXJlY3RseS5cclxuICogSWYgeW91ciBwcm9qZWN0IGlzIGhvc3RlZCBpbiBWQ1Mgc3VjaCBhcyBnaXQsIHN1Ym1pdCB0aGlzIHNjcmlwdCB0b2dldGhlci5cclxuICpcclxuICog5q2k6ISa5pys55SxIENvY29zIENyZWF0b3Ig6Ieq5Yqo55Sf5oiQ77yM5LuF55So5LqO5YW85a65IHYyLjEuMCDkuYvliY3niYjmnKznmoTlt6XnqIvvvIxcclxuICog5L2g5peg6ZyA5Zyo5Lu75L2V5YW25a6D6aG555uu5Lit5omL5Yqo5re75Yqg5q2k6ISa5pys44CCXHJcbiAqIOWmguaenOS9oOeahOmhueebruS4reayoeeUqOWIsCBUb2dnbGXvvIzlj6/nm7TmjqXliKDpmaTor6XohJrmnKzjgIJcclxuICog5aaC5p6c5L2g55qE6aG555uu5pyJ5omY566h5LqOIGdpdCDnrYnniYjmnKzlupPvvIzor7flsIbmraTohJrmnKzkuIDlubbkuIrkvKDjgIJcclxuICovXHJcblxyXG5pZiAoY2MuVG9nZ2xlKSB7XHJcbiAgICAvLyBXaGV0aGVyIHRoZSAndG9nZ2xlJyBhbmQgJ2NoZWNrRXZlbnRzJyBldmVudHMgYXJlIGZpcmVkIHdoZW4gJ3RvZ2dsZS5jaGVjaygpIC8gdG9nZ2xlLnVuY2hlY2soKScgaXMgY2FsbGVkIGluIHRoZSBjb2RlXHJcbiAgICAvLyDlnKjku6PnoIHkuK3osIPnlKggJ3RvZ2dsZS5jaGVjaygpIC8gdG9nZ2xlLnVuY2hlY2soKScg5pe25piv5ZCm6Kem5Y+RICd0b2dnbGUnIOS4jiAnY2hlY2tFdmVudHMnIOS6i+S7tlxyXG4gICAgY2MuVG9nZ2xlLl90cmlnZ2VyRXZlbnRJblNjcmlwdF9jaGVjayA9IHRydWU7XHJcbn1cclxuIl19
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/Star.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '4644f0m2WtABYRy+pn6dOaG', 'Star');
// scripts/Star.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    // 星星和主角之间的距离小于这个数值时，就会完成收集
    pickRadius: 0
  },
  getPlayerDistance: function getPlayerDistance() {
    // 根据 player 节点位置判断距离
    var playerPos = this.game.player.getPosition(); // 根据两点位置计算两点之间距离

    var dist = this.node.position.sub(playerPos).mag();
    return dist;
  },
  onPicked: function onPicked() {
    // 当星星被收集时，调用 Game 脚本中的接口，生成一个新的星星
    this.game.spawnNewStar(); // 调用 Game 脚本的得分方法

    this.game.gainScore(); // 然后销毁当前星星节点

    this.node.destroy();
  },
  update: function update(dt) {
    // 每帧判断和主角之间的距离是否小于收集距离
    if (this.getPlayerDistance() < this.pickRadius) {
      // 调用收集行为
      this.onPicked();
      return;
    } // 根据 Game 脚本中的计时器更新星星的透明度


    var opacityRatio = 1 - this.game.timer / this.game.starDuration;
    var minOpacity = 50;
    this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcU3Rhci5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsInBpY2tSYWRpdXMiLCJnZXRQbGF5ZXJEaXN0YW5jZSIsInBsYXllclBvcyIsImdhbWUiLCJwbGF5ZXIiLCJnZXRQb3NpdGlvbiIsImRpc3QiLCJub2RlIiwicG9zaXRpb24iLCJzdWIiLCJtYWciLCJvblBpY2tlZCIsInNwYXduTmV3U3RhciIsImdhaW5TY29yZSIsImRlc3Ryb3kiLCJ1cGRhdGUiLCJkdCIsIm9wYWNpdHlSYXRpbyIsInRpbWVyIiwic3RhckR1cmF0aW9uIiwibWluT3BhY2l0eSIsIm9wYWNpdHkiLCJNYXRoIiwiZmxvb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ0wsYUFBU0QsRUFBRSxDQUFDRSxTQURQO0FBR0xDLEVBQUFBLFVBQVUsRUFBRTtBQUNSO0FBQ0FDLElBQUFBLFVBQVUsRUFBRTtBQUZKLEdBSFA7QUFRTEMsRUFBQUEsaUJBQWlCLEVBQUUsNkJBQVk7QUFDM0I7QUFDQSxRQUFJQyxTQUFTLEdBQUcsS0FBS0MsSUFBTCxDQUFVQyxNQUFWLENBQWlCQyxXQUFqQixFQUFoQixDQUYyQixDQUczQjs7QUFDQSxRQUFJQyxJQUFJLEdBQUcsS0FBS0MsSUFBTCxDQUFVQyxRQUFWLENBQW1CQyxHQUFuQixDQUF1QlAsU0FBdkIsRUFBa0NRLEdBQWxDLEVBQVg7QUFDQSxXQUFPSixJQUFQO0FBQ0gsR0FkSTtBQWdCTEssRUFBQUEsUUFBUSxFQUFFLG9CQUFXO0FBQ2pCO0FBQ0EsU0FBS1IsSUFBTCxDQUFVUyxZQUFWLEdBRmlCLENBR2pCOztBQUNBLFNBQUtULElBQUwsQ0FBVVUsU0FBVixHQUppQixDQUtqQjs7QUFDQSxTQUFLTixJQUFMLENBQVVPLE9BQVY7QUFDSCxHQXZCSTtBQXlCTEMsRUFBQUEsTUFBTSxFQUFFLGdCQUFVQyxFQUFWLEVBQWM7QUFDbEI7QUFDQSxRQUFJLEtBQUtmLGlCQUFMLEtBQTJCLEtBQUtELFVBQXBDLEVBQWdEO0FBQzVDO0FBQ0EsV0FBS1csUUFBTDtBQUNBO0FBQ0gsS0FOaUIsQ0FRbEI7OztBQUNBLFFBQUlNLFlBQVksR0FBRyxJQUFJLEtBQUtkLElBQUwsQ0FBVWUsS0FBVixHQUFnQixLQUFLZixJQUFMLENBQVVnQixZQUFqRDtBQUNBLFFBQUlDLFVBQVUsR0FBRyxFQUFqQjtBQUNBLFNBQUtiLElBQUwsQ0FBVWMsT0FBVixHQUFvQkQsVUFBVSxHQUFHRSxJQUFJLENBQUNDLEtBQUwsQ0FBV04sWUFBWSxJQUFJLE1BQU1HLFVBQVYsQ0FBdkIsQ0FBakM7QUFDSDtBQXJDSSxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJjYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuICAgIFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8g5pif5pif5ZKM5Li76KeS5LmL6Ze055qE6Led56a75bCP5LqO6L+Z5Liq5pWw5YC85pe277yM5bCx5Lya5a6M5oiQ5pS26ZuGXG4gICAgICAgIHBpY2tSYWRpdXM6IDAsXG4gICAgfSxcblxuICAgIGdldFBsYXllckRpc3RhbmNlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIOagueaNriBwbGF5ZXIg6IqC54K55L2N572u5Yik5pat6Led56a7XG4gICAgICAgIHZhciBwbGF5ZXJQb3MgPSB0aGlzLmdhbWUucGxheWVyLmdldFBvc2l0aW9uKCk7XG4gICAgICAgIC8vIOagueaNruS4pOeCueS9jee9ruiuoeeul+S4pOeCueS5i+mXtOi3neemu1xuICAgICAgICB2YXIgZGlzdCA9IHRoaXMubm9kZS5wb3NpdGlvbi5zdWIocGxheWVyUG9zKS5tYWcoKTtcbiAgICAgICAgcmV0dXJuIGRpc3Q7XG4gICAgfSxcblxuICAgIG9uUGlja2VkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8g5b2T5pif5pif6KKr5pS26ZuG5pe277yM6LCD55SoIEdhbWUg6ISa5pys5Lit55qE5o6l5Y+j77yM55Sf5oiQ5LiA5Liq5paw55qE5pif5pifXG4gICAgICAgIHRoaXMuZ2FtZS5zcGF3bk5ld1N0YXIoKTtcbiAgICAgICAgLy8g6LCD55SoIEdhbWUg6ISa5pys55qE5b6X5YiG5pa55rOVXG4gICAgICAgIHRoaXMuZ2FtZS5nYWluU2NvcmUoKTtcbiAgICAgICAgLy8g54S25ZCO6ZSA5q+B5b2T5YmN5pif5pif6IqC54K5XG4gICAgICAgIHRoaXMubm9kZS5kZXN0cm95KCk7XG4gICAgfSxcblxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG4gICAgICAgIC8vIOavj+W4p+WIpOaWreWSjOS4u+inkuS5i+mXtOeahOi3neemu+aYr+WQpuWwj+S6juaUtumbhui3neemu1xuICAgICAgICBpZiAodGhpcy5nZXRQbGF5ZXJEaXN0YW5jZSgpIDwgdGhpcy5waWNrUmFkaXVzKSB7XG4gICAgICAgICAgICAvLyDosIPnlKjmlLbpm4booYzkuLpcbiAgICAgICAgICAgIHRoaXMub25QaWNrZWQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8g5qC55o2uIEdhbWUg6ISa5pys5Lit55qE6K6h5pe25Zmo5pu05paw5pif5pif55qE6YCP5piO5bqmXG4gICAgICAgIHZhciBvcGFjaXR5UmF0aW8gPSAxIC0gdGhpcy5nYW1lLnRpbWVyL3RoaXMuZ2FtZS5zdGFyRHVyYXRpb247XG4gICAgICAgIHZhciBtaW5PcGFjaXR5ID0gNTA7XG4gICAgICAgIHRoaXMubm9kZS5vcGFjaXR5ID0gbWluT3BhY2l0eSArIE1hdGguZmxvb3Iob3BhY2l0eVJhdGlvICogKDI1NSAtIG1pbk9wYWNpdHkpKTtcbiAgICB9LFxufSk7XG4iXX0=
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/AIHelper.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '440ccQTol9AqII0wAlYk8sK', 'AIHelper');
// scripts/AIHelper.js

"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _PokerUtil = _interopRequireDefault(require("./PokerUtil"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var pokerWeight = [4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 3, 5, 16, 17, 18]; //主5为18

var LEFT_WIN = -1;
var RIGHT_WIN = 1;

var AIHelper = /*#__PURE__*/function () {
  function AIHelper() {}

  var _proto = AIHelper.prototype;

  // {
  //     type1Array:type1Array,
  //     type2Array:type2Array,
  //     type3Array:type3Array,
  //     type4Array:type4Array,
  //     hostArray:hostArray,
  //     total:total
  // }

  /**
   * 检测哪些牌可以出
   * @param gameHost
   * @param roundHost
   * @param userCard
   * @param cardArray
   */
  _proto.checkUserCanSend = function checkUserCanSend(gameHost, roundHost, userCard, cardArray) {}
  /**
   * 游戏每轮逻辑，
   * 赢家出牌，确定本轮主 将主放进卡片数组里 调sendAIHostCard
   * 下家出牌 调sendAIFollowCard
   * 4家都出完结算，积分计算，结束本轮，返回积分
   */
  ;

  _proto.roundProgram = function roundProgram() {}
  /**
   * 先手电脑逻辑
   * 普通打法：
   * 有副出最大的副牌 或者副牌对
   * 其次出最小主牌，不调主对
   * 最后一轮出主对 或主
   * 主应该在后面
   * @param gameHost 主
   * @param cardArray  当前手牌
   */
  ;

  _proto.sendAIHostCard = function sendAIHostCard(gamehost, cardArray) {
    var sendCardIndexs = [];

    for (var i = 0; i < cardArray.length; i++) {
      var type = cardArray[i].substring(2);
      var value = cardArray[i].substring(0, 2);

      var isHost = type == gamehost || _PokerUtil["default"].quaryIsHost(value);

      if (!isHost) {
        if (sendCardIndexs.length === 0) {
          sendCardIndexs.push(i);
        } else {
          if (cardArray[sendCardIndexs[0]] == cardArray[i]) {
            sendCardIndexs.push(i);
            break;
          }

          var sendCard = cardArray[sendCardIndexs[0]];
          var sendValue = sendCard.substring(0, 2);

          var result = _PokerUtil["default"].compareSinglePokerBigger(sendValue, value);

          if (result = RIGHT_WIN) {
            sendCard = value;
          }
        }
      } else {
        if (sendCardIndexs.length === 0) {
          //没有副牌了
          sendCardIndexs.push(i);
        } else {
          if (cardArray[sendCardIndexs[0]] == cardArray[i]) {
            sendCardIndexs.push(i);
            break;
          }

          var _sendCard = cardArray[sendCardIndexs[0]];

          var _sendValue = _sendCard.substring(0, 2);

          var _result = _PokerUtil["default"].compareSinglePokerBigger(_sendValue, value);

          if (_result = LEFT_WIN) {
            _sendCard = value;
          }
        }
      }
    }

    return sendCardIndexs;
  }
  /**
   * 后手电脑逻辑
   * 判断当前谁大，队友大出分，队友小出小牌。
   * 无牌出最小副牌
   *
   * @param gameHost  游戏主
   * @param roundHost 本轮主
   * @param userCard  三方所出的牌
   * @param cardArray  自己剩余的牌
   */
  ;

  _proto.sendAIFollowCard = function sendAIFollowCard(gameHost, roundHost, userCard, pokerObj) {
    switch (userCard.length) {
      case 0:
        //自己是首家 理论上不存在，应该调sendAIHostCard
        console.error("onion", "error 后手电脑调用了sendAIFollowCard 应该调用 sendAIHostCard ");
        break;

      case 1:
        //尽量出大牌
        return this.secondLogic(gameHost, roundHost, userCard, pokerObj);

      case 2:
        //
        return this.sendThridPoker(gameHost, roundHost, userCard, pokerObj);
    }
  };

  _proto.secondLogic = function secondLogic(gameHost, roundHost, userCard, pokerObj) {
    if (userCard[0].length > 1) {//出对的逻辑
    } else {
      return this.selectSingleBigerPoker(gameHost, roundHost, userCard, pokerObj);
    }
  }
  /**
  * 第三手电脑
  * 判断谁出的大,尝试盖过一手
  */
  ;

  _proto.sendThridPoker = function sendThridPoker(gameHost, roundHost, userCard, pokerObj) {
    var firstCard = userCard[0];
    var secondCard = userCard[1];

    var result = _PokerUtil["default"].comparePoker(gameHost, roundHost, firstCard, secondCard);

    if (result === RIGHT_WIN) {
      //对家大，尝试出分或小牌
      return this.selectSocerPoker(gameHost, roundHost, firstCard, pokerObj);
    } else {
      //出最大牌，尝试压过firstCard 最大的牌也压不过就出小牌
      //TODO 可以节约，出仅压过对方的大牌
      return this.selectSingleBigerPoker(gameHost, roundHost, firstCard, pokerObj);
    }
  }
  /**
   * 四手电脑
   */
  ;

  _proto.sendForthPoker = function sendForthPoker(gameHost, roundHost, userCard, cardArray) {
    var firstCard = cardArray[0];
    var secondCard = cardArray[1];
    var thridCard = cardArray[2];

    var result = _PokerUtil["default"].comparePoker(firstCard, secondCard);

    if (result === RIGHT_WIN) {
      result = _PokerUtil["default"].comparePoker(thridCard, secondCard);
    }

    if (result === RIGHT_WIN) {//对家大，尝试出分或小牌
    } else {//出最大牌，尝试压过firstCard 最大的牌也压不过就出小牌
        //TODO 可以节约，出仅压过对方的大牌
      }
  }
  /**
   * 顶牌逻辑
   */
  ;

  _proto.selectSingleBigerPoker = function selectSingleBigerPoker(gameHost, roundHost, targetPoker, pokerObj) {
    //出单的逻辑 1识别是否是主牌
    var cardValue = targetPoker;
    var typeValue = this.intGetType(cardValue);
    var contentValue = this.intGetContent(cardValue);

    var isHost = typeValue == gameHost || _PokerUtil["default"].quaryIsHost(contentValue);

    if (isHost) {
      //顶大牌
      var array = this.selectArrayFrom(true, typeValue, pokerObj);

      if (array.length > 0) {
        var value = array[array.length - 1];

        var result = _PokerUtil["default"].comparePoker(value, cardValue); //能顶过 出大牌


        if (result === LEFT_WIN) {
          return value;
        } else {
          //顶不过 出小牌
          return array[0];
        }
      } else {
        return userCard.total[userCard.total.length - 1];
      }
    } else {
      //上家是否为A 
      var isA = contentValue == 14;
      console.log("onion", targetPoker + "type" + typeValue); //自己是否还有该花色

      var pokerArray = this.selectArrayFrom(false, typeValue, pokerObj);

      if (pokerArray.length == 0) {
        //出最小的牌杀
        return pokerObj.hostArray[0];
      } else if (isA) {
        return pokerArray[0];
      } else {
        return pokerArray[pokerArray.length - 1];
      }
    }
  }
  /**
   * 小牌逻辑
   */
  ;

  _proto.selectSmallerPoker = function selectSmallerPoker() {}
  /**
   * 上分逻辑 小牌逻辑
   */
  ;

  _proto.selectSocerPoker = function selectSocerPoker(gameHost, roundHost, targetPoker, pokerObj) {
    var cardValue = targetPoker;
    var typeValue = this.intGetType(cardValue);
    var contentValue = this.intGetContent(cardValue);

    var isHost = typeValue == gameHost || _PokerUtil["default"].quaryIsHost(contentValue);

    if (isHost) {
      var array = this.selectArrayFrom(true, typeValue, pokerObj);

      if (array.length > 0) {
        return this.selectScoerFromArray(array);
      } //TODO 待优化 出最小的牌 当前是总牌库的第一张牌 


      return pokerObj.total[0];
    } else {
      var _array = this.selectArrayFrom(true, typeValue, pokerObj);

      if (_array.length > 0) {
        //从该花色选牌
        return this.selectScoerFromArray(_array);
      } //全局选牌


      _array = pokerObj.total;
      return this.selectScoerFromArray(_array);
    }
  };

  _proto.selectScoerFromArray = function selectScoerFromArray(array) {
    for (var i = 0; i < array.length; i++) {
      var result = _PokerUtil["default"].quaryIsSocer(this.intGetContent(array[i]));

      if (result) {
        return array[i];
      }
    }

    return array[0];
  }
  /**
   * 选出对应的牌组
   * @param {*} isHost 
   * @param {*} type 
   * @param {*} pokerObj 
   */
  ;

  _proto.selectArrayFrom = function selectArrayFrom(isHost, type, pokerObj) {
    if (isHost) {
      return pokerObj.hostArray;
    }

    switch (type) {
      case 1:
        return pokerObj.type1Array;

      case 2:
        return pokerObj.type2Array;

      case 3:
        return pokerObj.type3Array;

      case 4:
        return pokerObj.type4Array;
    }
  };

  _proto.removePokerFromArray = function removePokerFromArray(gameHost, pokerNum, pokerObj) {
    var typeValue = this.intGetType(pokerNum);
    var contentValue = this.intGetContent(pokerNum);

    var isHost = typeValue == gameHost || _PokerUtil["default"].quaryIsHost(contentValue);

    var array = this.selectArrayFrom(isHost, typeValue, pokerObj); //分组数组删除

    var index = array.indexOf(pokerNum);
    array.splice(index, 1); //全局数组删除

    array = pokerObj.total;
    index = array.indexOf(pokerNum);
    array.splice(index, 1);
  };

  _proto.intGetType = function intGetType(cardValue) {
    return Math.floor(cardValue % 10);
  };

  _proto.strGetType = function strGetType(cardValue) {
    return cardValue.substring(2);
  };

  _proto.intGetContent = function intGetContent(cardValue) {
    return Math.floor(cardValue / 10);
  };

  _proto.strGetContent = function strGetContent(cardValue) {
    return cardValue.substring(0, 2);
  };

  return AIHelper;
}();

exports["default"] = AIHelper;
module.exports = exports["default"];

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcQUlIZWxwZXIuanMiXSwibmFtZXMiOlsicG9rZXJXZWlnaHQiLCJMRUZUX1dJTiIsIlJJR0hUX1dJTiIsIkFJSGVscGVyIiwiY2hlY2tVc2VyQ2FuU2VuZCIsImdhbWVIb3N0Iiwicm91bmRIb3N0IiwidXNlckNhcmQiLCJjYXJkQXJyYXkiLCJyb3VuZFByb2dyYW0iLCJzZW5kQUlIb3N0Q2FyZCIsImdhbWVob3N0Iiwic2VuZENhcmRJbmRleHMiLCJpIiwibGVuZ3RoIiwidHlwZSIsInN1YnN0cmluZyIsInZhbHVlIiwiaXNIb3N0IiwiUG9rZXJVdGlsIiwicXVhcnlJc0hvc3QiLCJwdXNoIiwic2VuZENhcmQiLCJzZW5kVmFsdWUiLCJyZXN1bHQiLCJjb21wYXJlU2luZ2xlUG9rZXJCaWdnZXIiLCJzZW5kQUlGb2xsb3dDYXJkIiwicG9rZXJPYmoiLCJjb25zb2xlIiwiZXJyb3IiLCJzZWNvbmRMb2dpYyIsInNlbmRUaHJpZFBva2VyIiwic2VsZWN0U2luZ2xlQmlnZXJQb2tlciIsImZpcnN0Q2FyZCIsInNlY29uZENhcmQiLCJjb21wYXJlUG9rZXIiLCJzZWxlY3RTb2NlclBva2VyIiwic2VuZEZvcnRoUG9rZXIiLCJ0aHJpZENhcmQiLCJ0YXJnZXRQb2tlciIsImNhcmRWYWx1ZSIsInR5cGVWYWx1ZSIsImludEdldFR5cGUiLCJjb250ZW50VmFsdWUiLCJpbnRHZXRDb250ZW50IiwiYXJyYXkiLCJzZWxlY3RBcnJheUZyb20iLCJ0b3RhbCIsImlzQSIsImxvZyIsInBva2VyQXJyYXkiLCJob3N0QXJyYXkiLCJzZWxlY3RTbWFsbGVyUG9rZXIiLCJzZWxlY3RTY29lckZyb21BcnJheSIsInF1YXJ5SXNTb2NlciIsInR5cGUxQXJyYXkiLCJ0eXBlMkFycmF5IiwidHlwZTNBcnJheSIsInR5cGU0QXJyYXkiLCJyZW1vdmVQb2tlckZyb21BcnJheSIsInBva2VyTnVtIiwiaW5kZXgiLCJpbmRleE9mIiwic3BsaWNlIiwiTWF0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MEIsYUFBQSxvQkFBVzFCLFNBQVgsRUFBc0I7QUFDbEIsV0FBT0EsU0FBUyxDQUFDeEIsU0FBVixDQUFvQixDQUFwQixDQUFQO0FBQ0g7O1NBQ0Q0QixnQkFBQSx1QkFBY0osU0FBZCxFQUF5QjtBQUNyQixXQUFPd0IsSUFBSSxDQUFDQyxLQUFMLENBQVd6QixTQUFTLEdBQUcsRUFBdkIsQ0FBUDtBQUNIOztTQUNEMkIsZ0JBQUEsdUJBQWMzQixTQUFkLEVBQXlCO0FBQ3JCLFdBQU9BLFNBQVMsQ0FBQ3hCLFNBQVYsQ0FBb0IsQ0FBcEIsRUFBdUIsQ0FBdkIsQ0FBUDtBQUNIIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUG9rZXJVdGlsIGZyb20gXCIuL1Bva2VyVXRpbFwiO1xyXG5cclxubGV0IHBva2VyV2VpZ2h0ID0gWzQsIDYsIDcsIDgsIDksIDEwLCAxMSwgMTIsIDEzLCAxNCwgMTUsIDMsIDUsIDE2LCAxNywgMThdOy8v5Li7NeS4ujE4XHJcbmxldCBMRUZUX1dJTiA9IC0xO1xyXG5sZXQgUklHSFRfV0lOID0gMTtcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQUlIZWxwZXIge1xyXG5cclxuICAgIC8vIHtcclxuICAgIC8vICAgICB0eXBlMUFycmF5OnR5cGUxQXJyYXksXHJcbiAgICAvLyAgICAgdHlwZTJBcnJheTp0eXBlMkFycmF5LFxyXG4gICAgLy8gICAgIHR5cGUzQXJyYXk6dHlwZTNBcnJheSxcclxuICAgIC8vICAgICB0eXBlNEFycmF5OnR5cGU0QXJyYXksXHJcbiAgICAvLyAgICAgaG9zdEFycmF5Omhvc3RBcnJheSxcclxuICAgIC8vICAgICB0b3RhbDp0b3RhbFxyXG4gICAgLy8gfVxyXG4gICAgLyoqXHJcbiAgICAgKiDmo4DmtYvlk6rkupvniYzlj6/ku6Xlh7pcclxuICAgICAqIEBwYXJhbSBnYW1lSG9zdFxyXG4gICAgICogQHBhcmFtIHJvdW5kSG9zdFxyXG4gICAgICogQHBhcmFtIHVzZXJDYXJkXHJcbiAgICAgKiBAcGFyYW0gY2FyZEFycmF5XHJcbiAgICAgKi9cclxuICAgIGNoZWNrVXNlckNhblNlbmQoZ2FtZUhvc3QsIHJvdW5kSG9zdCwgdXNlckNhcmQsIGNhcmRBcnJheSkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOa4uOaIj+avj+i9rumAu+i+ke+8jFxyXG4gICAgICog6LWi5a625Ye654mM77yM56Gu5a6a5pys6L2u5Li7IOWwhuS4u+aUvui/m+WNoeeJh+aVsOe7hOmHjCDosINzZW5kQUlIb3N0Q2FyZFxyXG4gICAgICog5LiL5a625Ye654mMIOiwg3NlbmRBSUZvbGxvd0NhcmRcclxuICAgICAqIDTlrrbpg73lh7rlroznu5PnrpfvvIznp6/liIborqHnrpfvvIznu5PmnZ/mnKzova7vvIzov5Tlm57np6/liIZcclxuICAgICAqL1xyXG4gICAgcm91bmRQcm9ncmFtKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWFiOaJi+eUteiEkemAu+i+kVxyXG4gICAgICog5pmu6YCa5omT5rOV77yaXHJcbiAgICAgKiDmnInlia/lh7rmnIDlpKfnmoTlia/niYwg5oiW6ICF5Ymv54mM5a+5XHJcbiAgICAgKiDlhbbmrKHlh7rmnIDlsI/kuLvniYzvvIzkuI3osIPkuLvlr7lcclxuICAgICAqIOacgOWQjuS4gOi9ruWHuuS4u+WvuSDmiJbkuLtcclxuICAgICAqIOS4u+W6lOivpeWcqOWQjumdolxyXG4gICAgICogQHBhcmFtIGdhbWVIb3N0IOS4u1xyXG4gICAgICogQHBhcmFtIGNhcmRBcnJheSAg5b2T5YmN5omL54mMXHJcbiAgICAgKi9cclxuICAgIHNlbmRBSUhvc3RDYXJkKGdhbWVob3N0LCBjYXJkQXJyYXkpIHtcclxuICAgICAgICBsZXQgc2VuZENhcmRJbmRleHMgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNhcmRBcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgdHlwZSA9IGNhcmRBcnJheVtpXS5zdWJzdHJpbmcoMik7XHJcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IGNhcmRBcnJheVtpXS5zdWJzdHJpbmcoMCwgMik7XHJcbiAgICAgICAgICAgIGxldCBpc0hvc3QgPSB0eXBlID09IGdhbWVob3N0IHx8IFBva2VyVXRpbC5xdWFyeUlzSG9zdCh2YWx1ZSk7XHJcbiAgICAgICAgICAgIGlmICghaXNIb3N0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VuZENhcmRJbmRleHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VuZENhcmRJbmRleHMucHVzaChpKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhcmRBcnJheVtzZW5kQ2FyZEluZGV4c1swXV0gPT0gY2FyZEFycmF5W2ldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbmRDYXJkSW5kZXhzLnB1c2goaSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBsZXQgc2VuZENhcmQgPSBjYXJkQXJyYXlbc2VuZENhcmRJbmRleHNbMF1dO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzZW5kVmFsdWUgPSBzZW5kQ2FyZC5zdWJzdHJpbmcoMCwgMik7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlc3VsdCA9IFBva2VyVXRpbC5jb21wYXJlU2luZ2xlUG9rZXJCaWdnZXIoc2VuZFZhbHVlLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdCA9IFJJR0hUX1dJTikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZW5kQ2FyZCA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChzZW5kQ2FyZEluZGV4cy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAvL+ayoeacieWJr+eJjOS6hlxyXG4gICAgICAgICAgICAgICAgICAgIHNlbmRDYXJkSW5kZXhzLnB1c2goaSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjYXJkQXJyYXlbc2VuZENhcmRJbmRleHNbMF1dID09IGNhcmRBcnJheVtpXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZW5kQ2FyZEluZGV4cy5wdXNoKGkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNlbmRDYXJkID0gY2FyZEFycmF5W3NlbmRDYXJkSW5kZXhzWzBdXTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc2VuZFZhbHVlID0gc2VuZENhcmQuc3Vic3RyaW5nKDAsIDIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCByZXN1bHQgPSBQb2tlclV0aWwuY29tcGFyZVNpbmdsZVBva2VyQmlnZ2VyKHNlbmRWYWx1ZSwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgPSBMRUZUX1dJTikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZW5kQ2FyZCA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc2VuZENhcmRJbmRleHM7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5ZCO5omL55S16ISR6YC76L6RXHJcbiAgICAgKiDliKTmlq3lvZPliY3osIHlpKfvvIzpmJ/lj4vlpKflh7rliIbvvIzpmJ/lj4vlsI/lh7rlsI/niYzjgIJcclxuICAgICAqIOaXoOeJjOWHuuacgOWwj+WJr+eJjFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBnYW1lSG9zdCAg5ri45oiP5Li7XHJcbiAgICAgKiBAcGFyYW0gcm91bmRIb3N0IOacrOi9ruS4u1xyXG4gICAgICogQHBhcmFtIHVzZXJDYXJkICDkuInmlrnmiYDlh7rnmoTniYxcclxuICAgICAqIEBwYXJhbSBjYXJkQXJyYXkgIOiHquW3seWJqeS9meeahOeJjFxyXG4gICAgICovXHJcbiAgICBzZW5kQUlGb2xsb3dDYXJkKGdhbWVIb3N0LCByb3VuZEhvc3QsIHVzZXJDYXJkLCBwb2tlck9iaikge1xyXG4gICAgICAgIHN3aXRjaCAodXNlckNhcmQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMDovL+iHquW3seaYr+mmluWutiDnkIborrrkuIrkuI3lrZjlnKjvvIzlupTor6XosINzZW5kQUlIb3N0Q2FyZFxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIm9uaW9uXCIsIFwiZXJyb3Ig5ZCO5omL55S16ISR6LCD55So5LqGc2VuZEFJRm9sbG93Q2FyZCDlupTor6XosIPnlKggc2VuZEFJSG9zdENhcmQgXCIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIDE6Ly/lsL3ph4/lh7rlpKfniYxcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNlY29uZExvZ2ljKGdhbWVIb3N0LCByb3VuZEhvc3QsIHVzZXJDYXJkLCBwb2tlck9iaik7XHJcbiAgICAgICAgICAgIGNhc2UgMjovL1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VuZFRocmlkUG9rZXIoZ2FtZUhvc3QsIHJvdW5kSG9zdCwgdXNlckNhcmQsIHBva2VyT2JqKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG4gICAgc2Vjb25kTG9naWMoZ2FtZUhvc3QsIHJvdW5kSG9zdCwgdXNlckNhcmQsIHBva2VyT2JqKSB7XHJcbiAgICAgICAgaWYgKHVzZXJDYXJkWzBdLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgLy/lh7rlr7nnmoTpgLvovpFcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RTaW5nbGVCaWdlclBva2VyKGdhbWVIb3N0LCByb3VuZEhvc3QsIHVzZXJDYXJkLCBwb2tlck9iaik7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICog56ys5LiJ5omL55S16ISRXHJcbiAqIOWIpOaWreiwgeWHuueahOWkpyzlsJ3or5Xnm5bov4fkuIDmiYtcclxuICovXHJcbiAgICBzZW5kVGhyaWRQb2tlcihnYW1lSG9zdCwgcm91bmRIb3N0LCB1c2VyQ2FyZCwgcG9rZXJPYmopIHtcclxuICAgICAgICBsZXQgZmlyc3RDYXJkID0gdXNlckNhcmRbMF07XHJcbiAgICAgICAgbGV0IHNlY29uZENhcmQgPSB1c2VyQ2FyZFsxXTtcclxuXHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IFBva2VyVXRpbC5jb21wYXJlUG9rZXIoZ2FtZUhvc3QsIHJvdW5kSG9zdCxmaXJzdENhcmQsIHNlY29uZENhcmQpO1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT09IFJJR0hUX1dJTikge1xyXG4gICAgICAgICAgICAvL+WvueWutuWkp++8jOWwneivleWHuuWIhuaIluWwj+eJjFxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RTb2NlclBva2VyKGdhbWVIb3N0LCByb3VuZEhvc3QsIGZpcnN0Q2FyZCwgcG9rZXJPYmopO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8v5Ye65pyA5aSn54mM77yM5bCd6K+V5Y6L6L+HZmlyc3RDYXJkIOacgOWkp+eahOeJjOS5n+WOi+S4jei/h+WwseWHuuWwj+eJjFxyXG4gICAgICAgICAgICAvL1RPRE8g5Y+v5Lul6IqC57qm77yM5Ye65LuF5Y6L6L+H5a+55pa555qE5aSn54mMXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbGVjdFNpbmdsZUJpZ2VyUG9rZXIoZ2FtZUhvc3QsIHJvdW5kSG9zdCwgZmlyc3RDYXJkLCBwb2tlck9iaik7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlm5vmiYvnlLXohJFcclxuICAgICAqL1xyXG4gICAgc2VuZEZvcnRoUG9rZXIoZ2FtZUhvc3QsIHJvdW5kSG9zdCwgdXNlckNhcmQsIGNhcmRBcnJheSkge1xyXG4gICAgICAgIGxldCBmaXJzdENhcmQgPSBjYXJkQXJyYXlbMF07XHJcbiAgICAgICAgbGV0IHNlY29uZENhcmQgPSBjYXJkQXJyYXlbMV07XHJcbiAgICAgICAgbGV0IHRocmlkQ2FyZCA9IGNhcmRBcnJheVsyXTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gUG9rZXJVdGlsLmNvbXBhcmVQb2tlcihmaXJzdENhcmQsIHNlY29uZENhcmQpO1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT09IFJJR0hUX1dJTikge1xyXG4gICAgICAgICAgICByZXN1bHQgPSBQb2tlclV0aWwuY29tcGFyZVBva2VyKHRocmlkQ2FyZCwgc2Vjb25kQ2FyZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyZXN1bHQgPT09IFJJR0hUX1dJTikge1xyXG4gICAgICAgICAgICAvL+WvueWutuWkp++8jOWwneivleWHuuWIhuaIluWwj+eJjFxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8v5Ye65pyA5aSn54mM77yM5bCd6K+V5Y6L6L+HZmlyc3RDYXJkIOacgOWkp+eahOeJjOS5n+WOi+S4jei/h+WwseWHuuWwj+eJjFxyXG4gICAgICAgICAgICAvL1RPRE8g5Y+v5Lul6IqC57qm77yM5Ye65LuF5Y6L6L+H5a+55pa555qE5aSn54mMXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDpobbniYzpgLvovpFcclxuICAgICAqL1xyXG4gICAgc2VsZWN0U2luZ2xlQmlnZXJQb2tlcihnYW1lSG9zdCwgcm91bmRIb3N0LCB0YXJnZXRQb2tlciwgcG9rZXJPYmopIHtcclxuICAgICAgICAvL+WHuuWNleeahOmAu+i+kSAx6K+G5Yir5piv5ZCm5piv5Li754mMXHJcbiAgICAgICAgbGV0IGNhcmRWYWx1ZSA9IHRhcmdldFBva2VyO1xyXG4gICAgICAgIGxldCB0eXBlVmFsdWUgPSB0aGlzLmludEdldFR5cGUoY2FyZFZhbHVlKTtcclxuICAgICAgICBsZXQgY29udGVudFZhbHVlID0gdGhpcy5pbnRHZXRDb250ZW50KGNhcmRWYWx1ZSk7XHJcbiAgICAgICAgbGV0IGlzSG9zdCA9IHR5cGVWYWx1ZSA9PSBnYW1lSG9zdCB8fCBQb2tlclV0aWwucXVhcnlJc0hvc3QoY29udGVudFZhbHVlKTtcclxuICAgICAgICBpZiAoaXNIb3N0KSB7XHJcbiAgICAgICAgICAgIC8v6aG25aSn54mMXHJcbiAgICAgICAgICAgIGxldCBhcnJheSA9IHRoaXMuc2VsZWN0QXJyYXlGcm9tKHRydWUsIHR5cGVWYWx1ZSwgcG9rZXJPYmopO1xyXG4gICAgICAgICAgICBpZiAoYXJyYXkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gYXJyYXlbYXJyYXkubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0gUG9rZXJVdGlsLmNvbXBhcmVQb2tlcih2YWx1ZSwgY2FyZFZhbHVlKTtcclxuICAgICAgICAgICAgICAgIC8v6IO96aG26L+HIOWHuuWkp+eJjFxyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdCA9PT0gTEVGVF9XSU4pIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Ugey8v6aG25LiN6L+HIOWHuuWwj+eJjFxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcnJheVswXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB1c2VyQ2FyZC50b3RhbFt1c2VyQ2FyZC50b3RhbC5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8v5LiK5a625piv5ZCm5Li6QSBcclxuICAgICAgICAgICAgbGV0IGlzQSA9IGNvbnRlbnRWYWx1ZSA9PSAxNDtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJvbmlvblwiLHRhcmdldFBva2VyK1widHlwZVwiK3R5cGVWYWx1ZSk7XHJcbiAgICAgICAgICAgIC8v6Ieq5bex5piv5ZCm6L+Y5pyJ6K+l6Iqx6ImyXHJcbiAgICAgICAgICAgIGxldCBwb2tlckFycmF5ID0gdGhpcy5zZWxlY3RBcnJheUZyb20oZmFsc2UsIHR5cGVWYWx1ZSwgcG9rZXJPYmopO1xyXG4gICAgICAgICAgICBpZiAocG9rZXJBcnJheS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgLy/lh7rmnIDlsI/nmoTniYzmnYBcclxuICAgICAgICAgICAgICAgIHJldHVybiBwb2tlck9iai5ob3N0QXJyYXlbMF07XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNBKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcG9rZXJBcnJheVswXTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwb2tlckFycmF5W3Bva2VyQXJyYXkubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOWwj+eJjOmAu+i+kVxyXG4gICAgICovXHJcbiAgICBzZWxlY3RTbWFsbGVyUG9rZXIoKSB7XHJcblxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDkuIrliIbpgLvovpEg5bCP54mM6YC76L6RXHJcbiAgICAgKi9cclxuICAgIHNlbGVjdFNvY2VyUG9rZXIoZ2FtZUhvc3QsIHJvdW5kSG9zdCwgdGFyZ2V0UG9rZXIsIHBva2VyT2JqKSB7XHJcbiAgICAgICAgbGV0IGNhcmRWYWx1ZSA9IHRhcmdldFBva2VyO1xyXG4gICAgICAgIGxldCB0eXBlVmFsdWUgPSB0aGlzLmludEdldFR5cGUoY2FyZFZhbHVlKTtcclxuICAgICAgICBsZXQgY29udGVudFZhbHVlID0gdGhpcy5pbnRHZXRDb250ZW50KGNhcmRWYWx1ZSk7XHJcbiAgICAgICAgbGV0IGlzSG9zdCA9IHR5cGVWYWx1ZSA9PSBnYW1lSG9zdCB8fCBQb2tlclV0aWwucXVhcnlJc0hvc3QoY29udGVudFZhbHVlKTtcclxuICAgICAgICBpZiAoaXNIb3N0KSB7XHJcbiAgICAgICAgICAgIGxldCBhcnJheSA9IHRoaXMuc2VsZWN0QXJyYXlGcm9tKHRydWUsIHR5cGVWYWx1ZSwgcG9rZXJPYmopO1xyXG4gICAgICAgICAgICBpZiAoYXJyYXkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0U2NvZXJGcm9tQXJyYXkoYXJyYXkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vVE9ETyDlvoXkvJjljJYg5Ye65pyA5bCP55qE54mMIOW9k+WJjeaYr+aAu+eJjOW6k+eahOesrOS4gOW8oOeJjCBcclxuICAgICAgICAgICAgcmV0dXJuIHBva2VyT2JqLnRvdGFsWzBdO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBhcnJheSA9IHRoaXMuc2VsZWN0QXJyYXlGcm9tKHRydWUsIHR5cGVWYWx1ZSwgcG9rZXJPYmopO1xyXG4gICAgICAgICAgICBpZiAoYXJyYXkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgLy/ku47or6XoirHoibLpgInniYxcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbGVjdFNjb2VyRnJvbUFycmF5KGFycmF5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL+WFqOWxgOmAieeJjFxyXG4gICAgICAgICAgICBhcnJheSA9IHBva2VyT2JqLnRvdGFsO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RTY29lckZyb21BcnJheShhcnJheSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNlbGVjdFNjb2VyRnJvbUFycmF5KGFycmF5KSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gUG9rZXJVdGlsLnF1YXJ5SXNTb2Nlcih0aGlzLmludEdldENvbnRlbnQoYXJyYXlbaV0pKTtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFycmF5W2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhcnJheVswXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOmAieWHuuWvueW6lOeahOeJjOe7hFxyXG4gICAgICogQHBhcmFtIHsqfSBpc0hvc3QgXHJcbiAgICAgKiBAcGFyYW0geyp9IHR5cGUgXHJcbiAgICAgKiBAcGFyYW0geyp9IHBva2VyT2JqIFxyXG4gICAgICovXHJcbiAgICBzZWxlY3RBcnJheUZyb20oaXNIb3N0LCB0eXBlLCBwb2tlck9iaikge1xyXG4gICAgICAgIGlmIChpc0hvc3QpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHBva2VyT2JqLmhvc3RBcnJheTtcclxuICAgICAgICB9XHJcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMTogcmV0dXJuIHBva2VyT2JqLnR5cGUxQXJyYXk7XHJcbiAgICAgICAgICAgIGNhc2UgMjogcmV0dXJuIHBva2VyT2JqLnR5cGUyQXJyYXk7XHJcbiAgICAgICAgICAgIGNhc2UgMzogcmV0dXJuIHBva2VyT2JqLnR5cGUzQXJyYXk7XHJcbiAgICAgICAgICAgIGNhc2UgNDogcmV0dXJuIHBva2VyT2JqLnR5cGU0QXJyYXk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIHJlbW92ZVBva2VyRnJvbUFycmF5KGdhbWVIb3N0LCBwb2tlck51bSwgcG9rZXJPYmopIHtcclxuICAgICAgICBsZXQgdHlwZVZhbHVlID0gdGhpcy5pbnRHZXRUeXBlKHBva2VyTnVtKTtcclxuICAgICAgICBsZXQgY29udGVudFZhbHVlID0gdGhpcy5pbnRHZXRDb250ZW50KHBva2VyTnVtKTtcclxuICAgICAgICBsZXQgaXNIb3N0ID0gdHlwZVZhbHVlID09IGdhbWVIb3N0IHx8IFBva2VyVXRpbC5xdWFyeUlzSG9zdChjb250ZW50VmFsdWUpO1xyXG4gICAgICAgIGxldCBhcnJheSA9IHRoaXMuc2VsZWN0QXJyYXlGcm9tKGlzSG9zdCwgdHlwZVZhbHVlLCBwb2tlck9iaik7XHJcbiAgICAgICAgLy/liIbnu4TmlbDnu4TliKDpmaRcclxuICAgICAgICBsZXQgaW5kZXggPSBhcnJheS5pbmRleE9mKHBva2VyTnVtKTtcclxuICAgICAgICBhcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgIC8v5YWo5bGA5pWw57uE5Yig6ZmkXHJcbiAgICAgICAgYXJyYXkgPSBwb2tlck9iai50b3RhbDtcclxuICAgICAgICBpbmRleCA9IGFycmF5LmluZGV4T2YocG9rZXJOdW0pO1xyXG4gICAgICAgIGFycmF5LnNwbGljZShpbmRleCwgMSk7XHJcbiAgICB9XHJcbiAgICBpbnRHZXRUeXBlKGNhcmRWYWx1ZSkge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKGNhcmRWYWx1ZSAlIDEwKTtcclxuXHJcbiAgICB9XHJcbiAgICBzdHJHZXRUeXBlKGNhcmRWYWx1ZSkge1xyXG4gICAgICAgIHJldHVybiBjYXJkVmFsdWUuc3Vic3RyaW5nKDIpXHJcbiAgICB9XHJcbiAgICBpbnRHZXRDb250ZW50KGNhcmRWYWx1ZSkge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKGNhcmRWYWx1ZSAvIDEwKTtcclxuICAgIH1cclxuICAgIHN0ckdldENvbnRlbnQoY2FyZFZhbHVlKSB7XHJcbiAgICAgICAgcmV0dXJuIGNhcmRWYWx1ZS5zdWJzdHJpbmcoMCwgMik7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbn0iXX0=
//------QC-SOURCE-SPLIT------
