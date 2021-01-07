
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
require('./assets/scripts/AIUtil');
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
    this.starDuration = 0; //创建图片资源

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
    var testArray = [];
    PokerUtil.destoryArray(this.roundPoker);

    for (var i = 0; i < this.playerControlNodeArray.length;) {
      //判断是否可出
      var node = this.playerControlNodeArray[i].getComponent('Card');

      if (node.isCheck) {
        console.log("onion 选中" + PokerUtil.quaryPokerValue(node.picNum));
        testArray.push(node.picNum);
        this.saveRoundPoker(node.picNum, 1, i * this.cardWidth);
        this.playerControlNodeArray[i].destroy();
        this.playerControlNodeArray.splice(i, 1);
      } else {
        i++;
      } // this.playerControlNodeArray[i].destroy();

    }

    PokerUtil.testLogic(testArray);
    this.appendLog("追加牌内容");
  },
  //保存出牌  1 2 3 4 顺时针位
  saveRoundPoker: function saveRoundPoker(picNum, index, offset) {
    var newStar = cc.instantiate(this.cardPrefab); // newStar.setPicNum("i"+i);

    newStar.getComponent('Card').picNum = picNum;
    newStar.scaleX = 0.5;
    newStar.scaleY = 0.5;
    this.roundPoker.push(newStar); // this.node.addChild(newStar);
    // let height = this.ground.height / 2 * -1;

    if (index === 1) {
      // height = height + 100;
      this.layoutBottom.node.addChild(newStar);
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

    console.log("spawnBottomCard " + this.pokerPlayer[0].length);
    this.createBottomCard();
  },
  createBottomCard: function createBottomCard() {
    var startPosition = 0;

    for (var i = 0; i < this.pokerPlayer[0].length; i++) {
      // 使用给定的模板在场景中生成一个新节点
      var newStar = cc.instantiate(this.cardPrefab); // newStar.setPicNum("i"+i);

      newStar.getComponent('Card').picNum = this.pokerPlayer[0][i];
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
            this.appendLog("本轮游戏主" + PokerUtil.quaryType(this.gameHost) + ",主牌" + PokerUtil.quaryPokerValue(value) + "在" + this.expandPlayer(i));
          }
        }
      }

      var playerObj = PokerUtil.sortPokers(host, playerPokerArray);
      console.log("onion", JSON.stringify(playerObj));
      this.pokerPlayer.push(playerObj.total);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcR2FtZS5qcyJdLCJuYW1lcyI6WyJQb2tlclV0aWwiLCJyZXF1aXJlIiwiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJzdGFyUHJlZmFiIiwidHlwZSIsIlByZWZhYiIsImNhcmRQcmVmYWIiLCJtYXhTdGFyRHVyYXRpb24iLCJtaW5TdGFyRHVyYXRpb24iLCJjdXJyZW50Q2FyZFBvc2l0aW9uIiwic3RhcnRDYXJkUG9zdGlvbiIsImNhcmRXaWR0aCIsImNhcmRBcnJheSIsIlN0cmluZyIsInBva2VyUGxheWVyIiwicm91bmRQb2tlciIsInBsYXllckNvbnRyb2xOb2RlQXJyYXkiLCJyZWZyZXNoQnV0dG9uIiwiQnV0dG9uIiwic2VuZEJ1dHRvbiIsImN1cnJlbnRXaW5uZXIiLCJnYW1lSG9zdCIsImxheW91dENvbnRhaW5lciIsIkxheW91dCIsImxheW91dEJvdHRvbSIsImxheW91dFRvcCIsImxheW91dExlZnQiLCJsYXlvdXRSaWdodCIsImxvZ0xhYmVsIiwiTGFiZWwiLCJwbGF5TG9nIiwiZ3JvdW5kIiwiTm9kZSIsInBsYXllciIsInNjb3JlRGlzcGxheSIsInNjb3JlQXVkaW8iLCJBdWRpb0NsaXAiLCJvbkxvYWQiLCJncm91bmRZIiwieSIsImhlaWdodCIsInRpbWVyIiwic3RhckR1cmF0aW9uIiwiaSIsInByZSIsImoiLCJzdHIiLCJwdXNoIiwibm9kZSIsIm9uIiwicmVmcmVzaENhbGxiYWNrIiwic2VuZENhbGxiYWNrIiwicHVibGlzaFBva2VycyIsInNjb3JlIiwiYnV0dG9uIiwidGVzdEFycmF5IiwiZGVzdG9yeUFycmF5IiwibGVuZ3RoIiwiZ2V0Q29tcG9uZW50IiwiaXNDaGVjayIsImNvbnNvbGUiLCJsb2ciLCJxdWFyeVBva2VyVmFsdWUiLCJwaWNOdW0iLCJzYXZlUm91bmRQb2tlciIsImRlc3Ryb3kiLCJzcGxpY2UiLCJ0ZXN0TG9naWMiLCJhcHBlbmRMb2ciLCJpbmRleCIsIm9mZnNldCIsIm5ld1N0YXIiLCJpbnN0YW50aWF0ZSIsInNjYWxlWCIsInNjYWxlWSIsImFkZENoaWxkIiwic3Bhd25OZXdTdGFyIiwic2V0UG9zaXRpb24iLCJnZXROZXdTdGFyUG9zaXRpb24iLCJnYW1lIiwiTWF0aCIsInJhbmRvbSIsInNwYXduQm90dG9tQ2FyZCIsImRlc3RvcnlOb2RlIiwiY3JlYXRlQm90dG9tQ2FyZCIsInN0YXJ0UG9zaXRpb24iLCJyYW5kWCIsInJhbmRZIiwianVtcEhlaWdodCIsIm1heFgiLCJ3aWR0aCIsInYyIiwiZ2V0Q2FyZEJvdHRvbVBvc2l0aW9uIiwidXBkYXRlIiwiZHQiLCJnYWluU2NvcmUiLCJzdHJpbmciLCJhdWRpb0VuZ2luZSIsInBsYXlFZmZlY3QiLCJnYW1lT3ZlciIsInN0b3BBbGxBY3Rpb25zIiwiZGlyZWN0b3IiLCJsb2FkU2NlbmUiLCJwb2tlckFycmF5Iiwic2xpY2UiLCJob3N0IiwicGFyc2VJbnQiLCJwbGF5ZXJQb2tlckFycmF5IiwicG9rZXJOdW0iLCJ2YWx1ZSIsInF1YXJ5UG9rZXJUeXBlVmFsdWUiLCJxdWFyeVR5cGUiLCJleHBhbmRQbGF5ZXIiLCJwbGF5ZXJPYmoiLCJzb3J0UG9rZXJzIiwiSlNPTiIsInN0cmluZ2lmeSIsInRvdGFsIiwibG9jYXRpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0MsSUFBSUEsU0FBUyxHQUFHQyxPQUFPLENBQUMsV0FBRCxDQUF2Qjs7QUFDREMsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDTCxhQUFTRCxFQUFFLENBQUNFLFNBRFA7QUFHTEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1I7QUFDQUMsSUFBQUEsVUFBVSxFQUFFO0FBQ1IsaUJBQVMsSUFERDtBQUVSQyxNQUFBQSxJQUFJLEVBQUVMLEVBQUUsQ0FBQ007QUFGRCxLQUZKO0FBTVJDLElBQUFBLFVBQVUsRUFBRTtBQUNSLGlCQUFTLElBREQ7QUFFUkYsTUFBQUEsSUFBSSxFQUFFTCxFQUFFLENBQUNNO0FBRkQsS0FOSjtBQVVSO0FB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LyIsInNvdXJjZXNDb250ZW50IjpbIlxuIGxldCBQb2tlclV0aWwgPSByZXF1aXJlKFwiUG9rZXJVdGlsXCIpO1xuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8g6L+Z5Liq5bGe5oCn5byV55So5LqG5pif5pif6aKE5Yi26LWE5rqQXG4gICAgICAgIHN0YXJQcmVmYWI6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5QcmVmYWJcbiAgICAgICAgfSxcbiAgICAgICAgY2FyZFByZWZhYjoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYlxuICAgICAgICB9LFxuICAgICAgICAvLyDmmJ/mmJ/kuqfnlJ/lkI7mtojlpLHml7bpl7TnmoTpmo/mnLrojIPlm7RcbiAgICAgICAgbWF4U3RhckR1cmF0aW9uOiAwLFxuICAgICAgICBtaW5TdGFyRHVyYXRpb246IDAsXG4gICAgICAgIGN1cnJlbnRDYXJkUG9zaXRpb246IDAsXG4gICAgICAgIHN0YXJ0Q2FyZFBvc3Rpb246IDAsXG4gICAgICAgIGNhcmRXaWR0aDogODAsXG4gICAgICAgIFxuICAgICAgICBjYXJkQXJyYXk6IFtjYy5TdHJpbmddLFxuICAgICAgICAvL+WIneWni+eJjOaVsOe7hCDpgIbml7bpkogg5Li76KeS5piv56ys5LiA5Liq5pWw57uEXG4gICAgICAgIHBva2VyUGxheWVyOiBbXSxcbiAgICAgICAgLy/lvZPliY3ova7mrKHlh7rniYzoioLngrksXG4gICAgICAgIHJvdW5kUG9rZXI6IFtdLFxuICAgICAgICAvL+S4u+inkuW9k+WJjeeJjOiKgueCuVxuICAgICAgICBwbGF5ZXJDb250cm9sTm9kZUFycmF5OiBbXSxcbiAgICAgICAgLy/mtJfniYxcbiAgICAgICAgcmVmcmVzaEJ1dHRvbjoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkJ1dHRvblxuICAgICAgICB9LFxuICAgICAgICAvL+WHuueJjFxuICAgICAgICBzZW5kQnV0dG9uOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuQnV0dG9uXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy/lvZPliY3og5zmlrlcbiAgICAgICAgY3VycmVudFdpbm5lcjoxLFxuICAgICAgICAvL+acrOi9ruS4u1xuICAgICAgICBnYW1lSG9zdDpcIjFcIixcbiAgICAgICAgLy/njqnlrrbmi6XmnInniYxcbiAgICAgICAgbGF5b3V0Q29udGFpbmVyOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuTGF5b3V0XG4gICAgICAgIH0sXG4gICAgICAgIC8v546p5a625Ye655qE54mMIFxuICAgICAgICBsYXlvdXRCb3R0b206e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5MYXlvdXRcbiAgICAgICAgfSxcbiAgICAgICAgLy/lr7nlrrblh7rniYwg56ys5LiJ5L2NXG4gICAgICAgIGxheW91dFRvcDp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLkxheW91dFxuICAgICAgICB9LFxuICAgICAgICAvL+S4i+WutuWHuueJjCDlt6bmiYvnrKzkuozkvY1cbiAgICAgICAgbGF5b3V0TGVmdDp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLkxheW91dFxuICAgICAgICB9LFxuICAgICAgICAgLy/kuIrlrrblh7rniYzvvIzlj7PmiYvnrKzlm5vkvY1cbiAgICAgICAgbGF5b3V0UmlnaHQ6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5MYXlvdXRcbiAgICAgICAgfSxcbiAgICAgICAgLy/miJjmiqVcbiAgICAgICAgbG9nTGFiZWw6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5MYWJlbFxuICAgICAgICB9LFxuICAgICAgICBwbGF5TG9nOlwi5ri45oiP5byA5aeLXCIsXG4gICAgICAgIC8vIOWcsOmdouiKgueCue+8jOeUqOS6juehruWumuaYn+aYn+eUn+aIkOeahOmrmOW6plxuICAgICAgICBncm91bmQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH0sXG4gICAgICAgIC8vIHBsYXllciDoioLngrnvvIznlKjkuo7ojrflj5bkuLvop5LlvLnot7PnmoTpq5jluqbvvIzlkozmjqfliLbkuLvop5LooYzliqjlvIDlhbNcbiAgICAgICAgcGxheWVyOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9LFxuICAgICAgICAvLyBzY29yZSBsYWJlbCDnmoTlvJXnlKhcbiAgICAgICAgc2NvcmVEaXNwbGF5OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWxcbiAgICAgICAgfSxcbiAgICAgICAgLy8g5b6X5YiG6Z+z5pWI6LWE5rqQXG4gICAgICAgIHNjb3JlQXVkaW86IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5BdWRpb0NsaXBcbiAgICAgICAgfSxcbiAgICB9LFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIOiOt+WPluWcsOW5s+mdoueahCB5IOi9tOWdkOagh1xuICAgICAgICB0aGlzLmdyb3VuZFkgPSB0aGlzLmdyb3VuZC55ICsgdGhpcy5ncm91bmQuaGVpZ2h0IC8gMjtcbiAgICAgICAgLy8g5Yid5aeL5YyW6K6h5pe25ZmoXG4gICAgICAgIHRoaXMudGltZXIgPSAwO1xuICAgICAgICB0aGlzLnN0YXJEdXJhdGlvbiA9IDA7XG4gICAgICAgIC8v5Yib5bu65Zu+54mH6LWE5rqQXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTM7IGkrKykge1xuICAgICAgICAgICAgbGV0IHByZSA9IDMgKyBpO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDE7IGogPCA1OyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgc3RyID0gXCJcIjtcbiAgICAgICAgICAgICAgICBpZiAocHJlIDwgMTApIHtcbiAgICAgICAgICAgICAgICAgICAgc3RyID0gXCIwXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHN0ciA9IHN0ciArIHByZSArIGo7XG4gICAgICAgICAgICAgICAgdGhpcy5jYXJkQXJyYXkucHVzaChzdHIpO1xuICAgICAgICAgICAgICAgIHRoaXMuY2FyZEFycmF5LnB1c2goc3RyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNhcmRBcnJheS5wdXNoKFwiMTYxXCIpO1xuICAgICAgICB0aGlzLmNhcmRBcnJheS5wdXNoKFwiMTYxXCIpO1xuICAgICAgICB0aGlzLmNhcmRBcnJheS5wdXNoKFwiMTcxXCIpO1xuICAgICAgICB0aGlzLmNhcmRBcnJheS5wdXNoKFwiMTcxXCIpO1xuXG5cbiAgICAgICAgdGhpcy5yZWZyZXNoQnV0dG9uLm5vZGUub24oJ2NsaWNrJywgdGhpcy5yZWZyZXNoQ2FsbGJhY2ssIHRoaXMpO1xuICAgICAgICB0aGlzLnNlbmRCdXR0b24ubm9kZS5vbignY2xpY2snLCB0aGlzLnNlbmRDYWxsYmFjaywgdGhpcyk7XG4gICAgICAgIHRoaXMucHVibGlzaFBva2VycygpO1xuICAgICAgICAvLyB0aGlzLnNwYXduTmV3U3RhcigpO1xuICAgICAgICAvLyDliJ3lp4vljJborqHliIZcbiAgICAgICAgdGhpcy5zY29yZSA9IDA7XG4gICAgfSxcbiAgICByZWZyZXNoQ2FsbGJhY2s6IGZ1bmN0aW9uIChidXR0b24pIHtcbiAgICAgICAgdGhpcy5wdWJsaXNoUG9rZXJzKCk7XG4gICAgfSxcbiAgICBzZW5kQ2FsbGJhY2s6IGZ1bmN0aW9uIChidXR0b24pIHtcbiAgICAgICAgbGV0IHRlc3RBcnJheT1bXTtcbiAgICAgICAgUG9rZXJVdGlsLmRlc3RvcnlBcnJheSh0aGlzLnJvdW5kUG9rZXIpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGxheWVyQ29udHJvbE5vZGVBcnJheS5sZW5ndGg7KSB7XG4gICAgICAgICAgICAvL+WIpOaWreaYr+WQpuWPr+WHulxuICAgICAgICAgICAgbGV0IG5vZGUgPSB0aGlzLnBsYXllckNvbnRyb2xOb2RlQXJyYXlbaV0uZ2V0Q29tcG9uZW50KCdDYXJkJyk7XG4gICAgICAgICAgICBpZiAobm9kZS5pc0NoZWNrKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJvbmlvbiDpgInkuK1cIiArIFBva2VyVXRpbC5xdWFyeVBva2VyVmFsdWUobm9kZS5waWNOdW0pKTtcbiAgICAgICAgICAgICAgICB0ZXN0QXJyYXkucHVzaChub2RlLnBpY051bSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zYXZlUm91bmRQb2tlcihub2RlLnBpY051bSwgMSwgaSAqIHRoaXMuY2FyZFdpZHRoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllckNvbnRyb2xOb2RlQXJyYXlbaV0uZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgIHRoaXMucGxheWVyQ29udHJvbE5vZGVBcnJheS5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHRoaXMucGxheWVyQ29udHJvbE5vZGVBcnJheVtpXS5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICAgICAgIFBva2VyVXRpbC50ZXN0TG9naWModGVzdEFycmF5KTtcbiAgICAgICAgIHRoaXMuYXBwZW5kTG9nKFwi6L+95Yqg54mM5YaF5a65XCIpO1xuICAgIH0sXG4gICAgLy/kv53lrZjlh7rniYwgIDEgMiAzIDQg6aG65pe26ZKI5L2NXG4gICAgc2F2ZVJvdW5kUG9rZXI6IGZ1bmN0aW9uIChwaWNOdW0sIGluZGV4LCBvZmZzZXQpIHtcbiAgICAgICAgdmFyIG5ld1N0YXIgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmNhcmRQcmVmYWIpO1xuICAgICAgICAvLyBuZXdTdGFyLnNldFBpY051bShcImlcIitpKTtcbiAgICAgICAgbmV3U3Rhci5nZXRDb21wb25lbnQoJ0NhcmQnKS5waWNOdW0gPSBwaWNOdW07XG4gICAgICAgIG5ld1N0YXIuc2NhbGVYID0gMC41O1xuICAgICAgICBuZXdTdGFyLnNjYWxlWSA9IDAuNTtcbiAgICAgICAgdGhpcy5yb3VuZFBva2VyLnB1c2gobmV3U3Rhcik7XG4gICAgICAgIC8vIHRoaXMubm9kZS5hZGRDaGlsZChuZXdTdGFyKTtcbiAgICAgICAgLy8gbGV0IGhlaWdodCA9IHRoaXMuZ3JvdW5kLmhlaWdodCAvIDIgKiAtMTtcbiAgICAgICAgaWYgKGluZGV4ID09PSAxKSB7XG4gICAgICAgICAgICAvLyBoZWlnaHQgPSBoZWlnaHQgKyAxMDA7XG4gICAgICAgICAgICB0aGlzLmxheW91dEJvdHRvbS5ub2RlLmFkZENoaWxkKG5ld1N0YXIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIG5ld1N0YXIuc2V0UG9zaXRpb24oY2MudjIoLTE1MCArIHRoaXMuc3RhcnRDYXJkUG9zdGlvbiArIG9mZnNldCwgaGVpZ2h0KSk7XG4gICAgfSxcbiAgICBzcGF3bk5ld1N0YXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8g5L2/55So57uZ5a6a55qE5qih5p2/5Zyo5Zy65pmv5Lit55Sf5oiQ5LiA5Liq5paw6IqC54K5XG4gICAgICAgIHZhciBuZXdTdGFyID0gY2MuaW5zdGFudGlhdGUodGhpcy5zdGFyUHJlZmFiKTtcbiAgICAgICAgLy8g5bCG5paw5aKe55qE6IqC54K55re75Yqg5YiwIENhbnZhcyDoioLngrnkuIvpnaJcbiAgICAgICAgdGhpcy5ub2RlLmFkZENoaWxkKG5ld1N0YXIpO1xuICAgICAgICAvLyDkuLrmmJ/mmJ/orr7nva7kuIDkuKrpmo/mnLrkvY3nva5cbiAgICAgICAgbmV3U3Rhci5zZXRQb3NpdGlvbih0aGlzLmdldE5ld1N0YXJQb3NpdGlvbigpKTtcbiAgICAgICAgLy8g5Zyo5pif5pif57uE5Lu25LiK5pqC5a2YIEdhbWUg5a+56LGh55qE5byV55SoXG4gICAgICAgIG5ld1N0YXIuZ2V0Q29tcG9uZW50KCdTdGFyJykuZ2FtZSA9IHRoaXM7XG4gICAgICAgIC8vIOmHjee9ruiuoeaXtuWZqO+8jOagueaNrua2iOWkseaXtumXtOiMg+WbtOmaj+acuuWPluS4gOS4quWAvFxuICAgICAgICB0aGlzLnN0YXJEdXJhdGlvbiA9IHRoaXMubWluU3RhckR1cmF0aW9uICsgTWF0aC5yYW5kb20oKSAqICh0aGlzLm1heFN0YXJEdXJhdGlvbiAtIHRoaXMubWluU3RhckR1cmF0aW9uKTtcbiAgICAgICAgdGhpcy50aW1lciA9IDA7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiDnp7vpmaTml6fnmoToioLngrlcbiAgICAgKiDmt7vliqDmlrDoioLngrlcbiAgICAgKi9cbiAgICBzcGF3bkJvdHRvbUNhcmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMucGxheWVyQ29udHJvbE5vZGVBcnJheS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBsZXQgZGVzdG9yeU5vZGUgPSB0aGlzLnBsYXllckNvbnRyb2xOb2RlQXJyYXk7XG4gICAgICAgICAgICBQb2tlclV0aWwuZGVzdG9yeUFycmF5KGRlc3RvcnlOb2RlKTtcbiAgICAgICAgICAgIHRoaXMucGxheWVyQ29udHJvbE5vZGVBcnJheSA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKFwic3Bhd25Cb3R0b21DYXJkIFwiICsgdGhpcy5wb2tlclBsYXllclswXS5sZW5ndGgpO1xuICAgICAgICB0aGlzLmNyZWF0ZUJvdHRvbUNhcmQoKVxuXG4gICAgfSxcblxuICAgIGNyZWF0ZUJvdHRvbUNhcmQ6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICBsZXQgc3RhcnRQb3NpdGlvbiA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wb2tlclBsYXllclswXS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgLy8g5L2/55So57uZ5a6a55qE5qih5p2/5Zyo5Zy65pmv5Lit55Sf5oiQ5LiA5Liq5paw6IqC54K5XG4gICAgICAgICAgICB2YXIgbmV3U3RhciA9IGNjLmluc3RhbnRpYXRlKHRoaXMuY2FyZFByZWZhYik7XG4gICAgICAgICAgICAvLyBuZXdTdGFyLnNldFBpY051bShcImlcIitpKTtcbiAgICAgICAgICAgIG5ld1N0YXIuZ2V0Q29tcG9uZW50KCdDYXJkJykucGljTnVtID0gdGhpcy5wb2tlclBsYXllclswXVtpXTtcbiAgICAgICAgICAgIHRoaXMucGxheWVyQ29udHJvbE5vZGVBcnJheS5wdXNoKG5ld1N0YXIpO1xuICAgICAgICAgICAgLy8gdGhpcy5ub2RlLmFkZENoaWxkKG5ld1N0YXIpO1xuICAgICAgICAgICAgdGhpcy5sYXlvdXRDb250YWluZXIubm9kZS5hZGRDaGlsZChuZXdTdGFyKTtcbiAgICAgICAgICAgIGxldCBoZWlnaHQgPSB0aGlzLmdyb3VuZC5oZWlnaHQgLyAyICogLTE7XG4gICAgICAgICAgICBzdGFydFBvc2l0aW9uID0gaSAqIHRoaXMuY2FyZFdpZHRoO1xuICAgICAgICAgICAgaWYgKGkgPiAxMykge1xuICAgICAgICAgICAgICAgIGhlaWdodCA9IGhlaWdodCAtIDE1MFxuICAgICAgICAgICAgICAgIHN0YXJ0UG9zaXRpb24gPSAoaSAtIDEzKSAqIHRoaXMuY2FyZFdpZHRoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gbmV3U3Rhci5zZXRQb3NpdGlvbihjYy52MigtMjAwICsgdGhpcy5zdGFydENhcmRQb3N0aW9uICsgc3RhcnRQb3NpdGlvbiwgaGVpZ2h0KSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG5cbiAgICBnZXROZXdTdGFyUG9zaXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHJhbmRYID0gMDtcbiAgICAgICAgLy8g5qC55o2u5Zyw5bmz6Z2i5L2N572u5ZKM5Li76KeS6Lez6LeD6auY5bqm77yM6ZqP5py65b6X5Yiw5LiA5Liq5pif5pif55qEIHkg5Z2Q5qCHXG4gICAgICAgIHZhciByYW5kWSA9IHRoaXMuZ3JvdW5kWSArIE1hdGgucmFuZG9tKCkgKiB0aGlzLnBsYXllci5nZXRDb21wb25lbnQoJ1BsYXllcicpLmp1bXBIZWlnaHQgKyA1MDtcbiAgICAgICAgLy8g5qC55o2u5bGP5bmV5a695bqm77yM6ZqP5py65b6X5Yiw5LiA5Liq5pif5pifIHgg5Z2Q5qCHXG4gICAgICAgIHZhciBtYXhYID0gdGhpcy5ub2RlLndpZHRoIC8gMjtcbiAgICAgICAgcmFuZFggPSAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiAyICogbWF4WDtcbiAgICAgICAgLy8g6L+U5Zue5pif5pif5Z2Q5qCHXG4gICAgICAgIHJldHVybiBjYy52MihyYW5kWCwgcmFuZFkpO1xuICAgIH0sXG4gICAgZ2V0Q2FyZEJvdHRvbVBvc2l0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciByYW5kWCA9IHRoaXMuY3VycmVudENhcmRQb3NpdGlvbjtcbiAgICAgICAgdmFyIHJhbmRZID0gMDtcbiAgICAgICAgdGhpcy5jdXJyZW50Q2FyZFBvc2l0aW9uID0gdGhpcy5jdXJyZW50Q2FyZFBvc2l0aW9uICsgdGhpcy5jYXJkV2lkdGg7XG4gICAgICAgIHJldHVybiBjYy52MihyYW5kWCwgcmFuZFkpO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuICAgICAgICAvLyDmr4/luKfmm7TmlrDorqHml7blmajvvIzotoXov4fpmZDluqbov5jmsqHmnInnlJ/miJDmlrDnmoTmmJ/mmJ9cbiAgICAgICAgLy8g5bCx5Lya6LCD55So5ri45oiP5aSx6LSl6YC76L6RXG4gICAgICAgIC8vIGlmICh0aGlzLnRpbWVyID4gdGhpcy5zdGFyRHVyYXRpb24pIHtcbiAgICAgICAgLy8gICAgIHRoaXMuZ2FtZU92ZXIoKTtcbiAgICAgICAgLy8gICAgIHRoaXMuZW5hYmxlZCA9IGZhbHNlOyAgIC8vIGRpc2FibGUgZ2FtZU92ZXIgbG9naWMgdG8gYXZvaWQgbG9hZCBzY2VuZSByZXBlYXRlZGx5XG4gICAgICAgIC8vICAgICByZXR1cm47XG4gICAgICAgIC8vIH1cbiAgICAgICAgLy8gdGhpcy50aW1lciArPSBkdDtcbiAgICB9LFxuXG4gICAgZ2FpblNjb3JlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuc2NvcmUgKz0gMTtcbiAgICAgICAgLy8g5pu05pawIHNjb3JlRGlzcGxheSBMYWJlbCDnmoTmloflrZdcbiAgICAgICAgdGhpcy5zY29yZURpc3BsYXkuc3RyaW5nID0gJ1Njb3JlOiAnICsgdGhpcy5zY29yZTtcbiAgICAgICAgLy8g5pKt5pS+5b6X5YiG6Z+z5pWIXG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGhpcy5zY29yZUF1ZGlvLCBmYWxzZSk7XG4gICAgfSxcblxuICAgIGdhbWVPdmVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMucGxheWVyLnN0b3BBbGxBY3Rpb25zKCk7IC8v5YGc5q2iIHBsYXllciDoioLngrnnmoTot7Pot4PliqjkvZxcbiAgICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKCdnYW1lJyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICog5oqK54mM5Y+R57uZ5Zub5a62XG4gICAgKi9cbiAgICBwdWJsaXNoUG9rZXJzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMucG9rZXJQbGF5ZXIgPSBbXTtcbiAgICAgICAgdGhpcy5nYW1lSG9zdD1udWxsO1xuICAgICAgICBsZXQgcG9rZXJBcnJheSA9IHRoaXMuY2FyZEFycmF5LnNsaWNlKDApO1xuICAgICAgICBsZXQgaG9zdD1wYXJzZUludChNYXRoLnJhbmRvbSgpICogNCk7Ly/pmo/mnLrkuLvniYzoirHoibJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcbiAgICAgICAgICAgIGxldCBwbGF5ZXJQb2tlckFycmF5ID0gW107XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDI3OyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgcG9rZXJOdW0gPSBNYXRoLnJhbmRvbSgpICogcG9rZXJBcnJheS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgcG9rZXJOdW0gPSBwYXJzZUludChwb2tlck51bSk7XG4gICAgICAgICAgICAgICAgLy/mj5LlhaXmiYvniYzkuK1cbiAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSBwb2tlckFycmF5LnNwbGljZShwb2tlck51bSwgMSk7XG4gICAgICAgICAgICAgICAgcGxheWVyUG9rZXJBcnJheS5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgICAgICBpZih0aGlzLmdhbWVIb3N0PT1udWxsKXsvL+maj+acuuWIsOS4u+WQju+8jOesrOS4gOW8oOS4u+eJjOS6ruWHulxuICAgICAgICAgICAgICAgICAgICBpZihob3N0PT1Qb2tlclV0aWwucXVhcnlQb2tlclR5cGVWYWx1ZSh2YWx1ZSkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lSG9zdD12YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwZW5kTG9nKFwi5pys6L2u5ri45oiP5Li7XCIrUG9rZXJVdGlsLnF1YXJ5VHlwZSh0aGlzLmdhbWVIb3N0KVxuICAgICAgICAgICAgICAgICAgICAgICAgK1wiLOS4u+eJjFwiK1Bva2VyVXRpbC5xdWFyeVBva2VyVmFsdWUodmFsdWUpK1wi5ZyoXCIrdGhpcy5leHBhbmRQbGF5ZXIoaSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IHBsYXllck9iaj1Qb2tlclV0aWwuc29ydFBva2Vycyhob3N0LHBsYXllclBva2VyQXJyYXkpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJvbmlvblwiLEpTT04uc3RyaW5naWZ5KHBsYXllck9iaikpO1xuICAgICAgICAgICAgdGhpcy5wb2tlclBsYXllci5wdXNoKHBsYXllck9iai50b3RhbCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zcGF3bkJvdHRvbUNhcmQoKTtcblxuICAgIH0sXG4gICAgZXhwYW5kUGxheWVyOmZ1bmN0aW9uKGxvY2F0aW9uKXtcbiAgICAgICAgc3dpdGNoKGxvY2F0aW9uKXtcbiAgICAgICAgICAgIGNhc2UgMDpyZXR1cm4gXCLoh6rlt7FcIlxuICAgICAgICAgICAgY2FzZSAxOnJldHVybiBcIuS4i+WutlwiXG4gICAgICAgICAgICBjYXNlIDI6cmV0dXJuIFwi5a+55a62XCJcbiAgICAgICAgICAgIGNhc2UgMzpyZXR1cm4gXCLkuIrlrrZcIiAgIFxuICAgICAgICB9XG5cbiAgICB9LFxuICAgIGFwcGVuZExvZzpmdW5jdGlvbihzdHJpbmcpe1xuICAgICAgICB0aGlzLnBsYXlMb2c9dGhpcy5wbGF5TG9nK1wiXFxuXCIrc3RyaW5nO1xuICAgICAgICB0aGlzLmxvZ0xhYmVsLnN0cmluZz10aGlzLnBsYXlMb2c7XG4gICAgfVxuICAgIFxuICAgIFxuXG5cblxufSk7XG4iXX0=
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
                    var __filename = 'preview-scripts/assets/scripts/AIUtil.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '2ef645+VVtA/qMBpIgtWp09', 'AIUtil');
// scripts/AIUtil.js

"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _PokerUtil = _interopRequireDefault(require("./PokerUtil"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var pokerWeight = [4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 3, 5, 16, 17, 18]; //主5为18

var LEFT_WIN = -1;
var RIGHT_WIN = 1;

var AIUtil = /*#__PURE__*/function () {
  function AIUtil() {}

  var _proto = AIUtil.prototype;

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

  _proto.sendAIFollowCard = function sendAIFollowCard(gameHost, roundHost, userCard, cardArray) {
    if (gameHost === roundHost) {}
  };

  return AIUtil;
}();

exports["default"] = AIUtil;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcQUlVdGlsLmpzIl0sIm5hbWVzIjpbInBva2VyV2VpZ2h0IiwiTEVGVF9XSU4iLCJSSUdIVF9XSU4iLCJBSVV0aWwiLCJjaGVja1VzZXJDYW5TZW5kIiwiZ2FtZUhvc3QiLCJyb3VuZEhvc3QiLCJ1c2VyQ2FyZCIsImNhcmRBcnJheSIsInJvdW5kUHJvZ3JhbSIsInNlbmRBSUhvc3RDYXJkIiwiZ2FtZWhvc3QiLCJzZW5kQ2FyZEluZGV4cyIsImkiLCJsZW5ndGgiLCJ0eXBlIiwic3Vic3RyaW5nIiwidmFsdWUiLCJpc0hvc3QiLCJQb2tlclV0aWwiLCJxdWFyeUlzSG9zdCIsInB1c2giLCJzZW5kQ2FyZCIsInNlbmRWYWx1ZSIsInJlc3VsdCIsImNvbXBhcmVTaW5nbGVQb2tlckJpZ2dlciIsInNlbmRBSUZvbGxvd0NhcmQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFFQSxJQUFJQSxXQUFXLEdBQUcsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQixFQUFoQixFQUFvQixFQUFwQixFQUF3QixFQUF4QixFQUE0QixFQUE1QixFQUFnQyxFQUFoQyxFQUFvQyxFQUFwQyxFQUF3QyxDQUF4QyxFQUEyQyxDQUEzQyxFQUE4QyxFQUE5QyxFQUFrRCxFQUFsRCxFQUFzRCxFQUF0RCxDQUFsQixFQUE0RTs7QUFDNUUsSUFBSUMsUUFBUSxHQUFHLENBQUMsQ0FBaEI7QUFDQSxJQUFJQyxTQUFTLEdBQUcsQ0FBaEI7O0lBQ3FCQzs7Ozs7QUFDakI7Ozs7Ozs7U0FPQUMsbUJBQUEsMEJBQWlCQyxRQUFqQixFQUEyQkMsU0FBM0IsRUFBc0NDLFFBQXRDLEVBQWdEQyxTQUFoRCxFQUEyRCxDQUUxRDtBQUVEOzs7Ozs7OztTQU1BQyxlQUFBLHdCQUFlLENBRWQ7QUFFRDs7Ozs7Ozs7Ozs7O1NBVUFDLGlCQUFBLHdCQUFlQyxRQUFmLEVBQXlCSCxTQUF6QixFQUFvQztBQUNoQyxRQUFJSSxjQUFjLEdBQUMsRUFBbkI7O0FBQ0EsU0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHTCxTQUFTLENBQUNNLE1BQTlCLEVBQXNDRCxDQUFDLEVBQXZDLEVBQTJDO0FBQ3ZDLFVBQUlFLElBQUksR0FBR1AsU0FBUyxDQUFDSyxDQUFELENBQVQsQ0FBYUcsU0FBYixDQUF1QixDQUF2QixDQUFYO0FBQ0EsVUFBSUMsS0FBSyxHQUFHVCxTQUFTLENBQUNLLENBQUQsQ0FBVCxDQUFhRyxTQUFiLENBQXVCLENBQXZCLEVBQTBCLENBQTFCLENBQVo7O0FBQ0EsVUFBSUUsTUFBTSxHQUFHSCxJQUFJLElBQUlKLFFBQVIsSUFBb0JRLHNCQUFVQyxXQUFWLENBQXNCSCxLQUF0QixDQUFqQzs7QUFDQSxVQUFHLENBQUNDLE1BQUosRUFBVztBQUNQLFlBQUdOLGNBQWMsQ0FBQ0UsTUFBZixLQUF3QixDQUEzQixFQUE2QjtBQUN6QkYsVUFBQUEsY0FBYyxDQUFDUyxJQUFmLENBQW9CUixDQUFwQjtBQUNILFNBRkQsTUFFTTtBQUNGLGNBQUdMLFNBQVMsQ0FBQ0ksY0FBYyxDQUFDLENBQUQsQ0FBZixDQUFULElBQThCSixTQUFTLENBQUNLLENBQUQsQ0FBMUMsRUFBOEM7QUFDMUNELFlBQUFBLGNBQWMsQ0FBQ1MsSUFBZixDQUFvQlIsQ0FBcEI7QUFDQTtBQUNIOztBQUNELGNBQUlTLFFBQVEsR0FBQ2QsU0FBUyxDQUFDSSxjQUFjLENBQUMsQ0FBRCxDQUFmLENBQXRCO0FBQ0EsY0FBSVcsU0FBUyxHQUFDRCxRQUFRLENBQUNOLFNBQVQsQ0FBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsQ0FBZDs7QUFDQSxjQUFJUSxNQUFNLEdBQUNMLHNCQUFVTSx3QkFBVixDQUFtQ0YsU0FBbkMsRUFBNkNOLEtBQTdDLENBQVg7O0FBQ0EsY0FBR08sTUFBTSxHQUFDdEIsU0FBVixFQUFvQjtBQUNoQm9CLFlBQUFBLFFBQVEsR0FBQ0wsS0FBVDtBQUNIO0FBQ0o7QUFDSixPQWZELE1BZU07QUFDRixZQUFHTCxjQUFjLENBQUNFLE1BQWYsS0FBd0IsQ0FBM0IsRUFBNkI7QUFDekI7QUFDQUYsVUFBQUEsY0FBYyxDQUFDUyxJQUFmLENBQW9CUixDQUFwQjtBQUNILFNBSEQsTUFHTTtBQUNGLGNBQUdMLFNBQVMsQ0FBQ0ksY0FBYyxDQUFDLENBQUQsQ0FBZixDQUFULElBQThCSixTQUFTLENBQUNLLENBQUQsQ0FBMUMsRUFBOEM7QUFDMUNELFlBQUFBLGNBQWMsQ0FBQ1MsSUFBZixDQUFvQlIsQ0FBcEI7QUFDQTtBQUNIOztBQUNELGNBQUlTLFNBQVEsR0FBQ2QsU0FBUyxDQUFDSSxjQUFjLENBQUMsQ0FBRCxDQUFmLENBQXRCOztBQUNBLGNBQUlXLFVBQVMsR0FBQ0QsU0FBUSxDQUFDTixTQUFULENBQW1CLENBQW5CLEVBQXNCLENBQXRCLENBQWQ7O0FBQ0EsY0FBSVEsT0FBTSxHQUFDTCxzQkFBVU0sd0JBQVYsQ0FBbUNGLFVBQW5DLEVBQTZDTixLQUE3QyxDQUFYOztBQUNBLGNBQUdPLE9BQU0sR0FBQ3ZCLFFBQVYsRUFBbUI7QUFDZnFCLFlBQUFBLFNBQVEsR0FBQ0wsS0FBVDtBQUNIO0FBQ0o7QUFDSjtBQUNKOztBQUNELFdBQU9MLGNBQVA7QUFFSDtBQUVEOzs7Ozs7Ozs7Ozs7U0FVQWMsbUJBQUEsMEJBQWlCckIsUUFBakIsRUFBMkJDLFNBQTNCLEVBQXNDQyxRQUF0QyxFQUFnREMsU0FBaEQsRUFBMkQ7QUFDdkQsUUFBR0gsUUFBUSxLQUFHQyxTQUFkLEVBQXdCLENBRXZCO0FBRUoiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQb2tlclV0aWwgZnJvbSBcIi4vUG9rZXJVdGlsXCI7XHJcblxyXG5sZXQgcG9rZXJXZWlnaHQgPSBbNCwgNiwgNywgOCwgOSwgMTAsIDExLCAxMiwgMTMsIDE0LCAxNSwgMywgNSwgMTYsIDE3LCAxOF07Ly/kuLs15Li6MThcclxubGV0IExFRlRfV0lOID0gLTE7XHJcbmxldCBSSUdIVF9XSU4gPSAxO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBSVV0aWwge1xyXG4gICAgLyoqXHJcbiAgICAgKiDmo4DmtYvlk6rkupvniYzlj6/ku6Xlh7pcclxuICAgICAqIEBwYXJhbSBnYW1lSG9zdFxyXG4gICAgICogQHBhcmFtIHJvdW5kSG9zdFxyXG4gICAgICogQHBhcmFtIHVzZXJDYXJkXHJcbiAgICAgKiBAcGFyYW0gY2FyZEFycmF5XHJcbiAgICAgKi9cclxuICAgIGNoZWNrVXNlckNhblNlbmQoZ2FtZUhvc3QsIHJvdW5kSG9zdCwgdXNlckNhcmQsIGNhcmRBcnJheSkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOa4uOaIj+avj+i9rumAu+i+ke+8jFxyXG4gICAgICog6LWi5a625Ye654mM77yM56Gu5a6a5pys6L2u5Li7IOWwhuS4u+aUvui/m+WNoeeJh+aVsOe7hOmHjCDosINzZW5kQUlIb3N0Q2FyZFxyXG4gICAgICog5LiL5a625Ye654mMIOiwg3NlbmRBSUZvbGxvd0NhcmRcclxuICAgICAqIDTlrrbpg73lh7rlroznu5PnrpfvvIznp6/liIborqHnrpfvvIznu5PmnZ/mnKzova7vvIzov5Tlm57np6/liIZcclxuICAgICAqL1xyXG4gICAgcm91bmRQcm9ncmFtKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWFiOaJi+eUteiEkemAu+i+kVxyXG4gICAgICog5pmu6YCa5omT5rOV77yaXHJcbiAgICAgKiDmnInlia/lh7rmnIDlpKfnmoTlia/niYwg5oiW6ICF5Ymv54mM5a+5XHJcbiAgICAgKiDlhbbmrKHlh7rmnIDlsI/kuLvniYzvvIzkuI3osIPkuLvlr7lcclxuICAgICAqIOacgOWQjuS4gOi9ruWHuuS4u+WvuSDmiJbkuLtcclxuICAgICAqIOS4u+W6lOivpeWcqOWQjumdolxyXG4gICAgICogQHBhcmFtIGdhbWVIb3N0IOS4u1xyXG4gICAgICogQHBhcmFtIGNhcmRBcnJheSAg5b2T5YmN5omL54mMXHJcbiAgICAgKi9cclxuICAgIHNlbmRBSUhvc3RDYXJkKGdhbWVob3N0LCBjYXJkQXJyYXkpIHtcclxuICAgICAgICBsZXQgc2VuZENhcmRJbmRleHM9W107XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjYXJkQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IHR5cGUgPSBjYXJkQXJyYXlbaV0uc3Vic3RyaW5nKDIpO1xyXG4gICAgICAgICAgICBsZXQgdmFsdWUgPSBjYXJkQXJyYXlbaV0uc3Vic3RyaW5nKDAsIDIpO1xyXG4gICAgICAgICAgICBsZXQgaXNIb3N0ID0gdHlwZSA9PSBnYW1laG9zdCB8fCBQb2tlclV0aWwucXVhcnlJc0hvc3QodmFsdWUpO1xyXG4gICAgICAgICAgICBpZighaXNIb3N0KXtcclxuICAgICAgICAgICAgICAgIGlmKHNlbmRDYXJkSW5kZXhzLmxlbmd0aD09PTApe1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbmRDYXJkSW5kZXhzLnB1c2goaSk7XHJcbiAgICAgICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoY2FyZEFycmF5W3NlbmRDYXJkSW5kZXhzWzBdXT09Y2FyZEFycmF5W2ldKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VuZENhcmRJbmRleHMucHVzaChpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzZW5kQ2FyZD1jYXJkQXJyYXlbc2VuZENhcmRJbmRleHNbMF1dO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzZW5kVmFsdWU9c2VuZENhcmQuc3Vic3RyaW5nKDAsIDIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCByZXN1bHQ9UG9rZXJVdGlsLmNvbXBhcmVTaW5nbGVQb2tlckJpZ2dlcihzZW5kVmFsdWUsdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHJlc3VsdD1SSUdIVF9XSU4pe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZW5kQ2FyZD12YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmKHNlbmRDYXJkSW5kZXhzLmxlbmd0aD09PTApe1xyXG4gICAgICAgICAgICAgICAgICAgIC8v5rKh5pyJ5Ymv54mM5LqGXHJcbiAgICAgICAgICAgICAgICAgICAgc2VuZENhcmRJbmRleHMucHVzaChpKTtcclxuICAgICAgICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZihjYXJkQXJyYXlbc2VuZENhcmRJbmRleHNbMF1dPT1jYXJkQXJyYXlbaV0pe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZW5kQ2FyZEluZGV4cy5wdXNoKGkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNlbmRDYXJkPWNhcmRBcnJheVtzZW5kQ2FyZEluZGV4c1swXV07XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNlbmRWYWx1ZT1zZW5kQ2FyZC5zdWJzdHJpbmcoMCwgMik7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlc3VsdD1Qb2tlclV0aWwuY29tcGFyZVNpbmdsZVBva2VyQmlnZ2VyKHNlbmRWYWx1ZSx2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYocmVzdWx0PUxFRlRfV0lOKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VuZENhcmQ9dmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzZW5kQ2FyZEluZGV4cztcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlkI7miYvnlLXohJHpgLvovpFcclxuICAgICAqIOWIpOaWreW9k+WJjeiwgeWkp++8jOmYn+WPi+Wkp+WHuuWIhu+8jOmYn+WPi+Wwj+WHuuWwj+eJjOOAglxyXG4gICAgICog5peg54mM5Ye65pyA5bCP5Ymv54mMXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGdhbWVIb3N0ICDmuLjmiI/kuLtcclxuICAgICAqIEBwYXJhbSByb3VuZEhvc3Qg5pys6L2u5Li7XHJcbiAgICAgKiBAcGFyYW0gdXNlckNhcmQgIOS4ieaWueaJgOWHuueahOeJjFxyXG4gICAgICogQHBhcmFtIGNhcmRBcnJheSAg6Ieq5bex5Ymp5L2Z55qE54mMXHJcbiAgICAgKi9cclxuICAgIHNlbmRBSUZvbGxvd0NhcmQoZ2FtZUhvc3QsIHJvdW5kSG9zdCwgdXNlckNhcmQsIGNhcmRBcnJheSkge1xyXG4gICAgICAgIGlmKGdhbWVIb3N0PT09cm91bmRIb3N0KXtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcblxyXG5cclxufSJdfQ==
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
  console.log("onion", "当前游戏主" + gamehost + "本轮主" + roundhost);
  console.log("onion", PokerUtil.comparePoker(gamehost, roundhost, testArray1, testArray2));
};

PokerUtil.comparePoker = function (gamehost, roundhost, valueLeft, valueRight) {
  console.log("onion", "comparePoker++" + PokerUtil.quaryPokerValue(valueLeft) + "/" + PokerUtil.quaryPokerValue(valueRight));

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
  console.log("onion==" + a + "/" + b);
  console.log("onion==" + left + "/" + right);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcUG9rZXJVdGlsLmpzIl0sIm5hbWVzIjpbInBva2VyV2VpZ2h0IiwiTEVGVF9XSU4iLCJSSUdIVF9XSU4iLCJQb2tlclV0aWwiLCJxdWFyeVBva2VyV2VpZ2h0IiwicG9rZXIiLCJpbmRleE9mIiwicXVhcnlJc0hvc3QiLCJ2YWx1ZSIsInBhcnNlSW50IiwiY29tcGFyZVZpY2UiLCJyb3VuZGhvc3QiLCJ0eXBlTGVmdCIsInR5cGVSaWdodCIsImNvbnRlbnRMZWZ0IiwiY29udGVudFJpZ2h0IiwiY29tcGFyZVNpbmdsZVBva2VyQmlnZ2VyIiwidGVzdExvZ2ljIiwidGVzdEFycmF5IiwiZ2FtZWhvc3QiLCJNYXRoIiwicmFuZG9tIiwiY29uc29sZSIsImxvZyIsImxlbmd0aCIsInRlc3RWYWx1ZSIsInN1YnN0cmluZyIsImNvbXBhcmVQb2tlciIsInRlc3RBcnJheUxvZ2ljIiwidGVzdEFycmF5MSIsInRlc3RBcnJheTIiLCJ2YWx1ZUxlZnQiLCJ2YWx1ZVJpZ2h0IiwicXVhcnlQb2tlclZhbHVlIiwiQXJyYXkiLCJpc0FycmF5IiwiZXJyb3IiLCJjb21wYXJlQXJyYXkiLCJsZWZ0SXNIb3N0IiwicmlnaHRJc0hvc3QiLCJyZXN1bHQiLCJsZWZ0TnVtIiwicmlnaHROdW0iLCJhcnJheUxlZnQiLCJzb3J0IiwiYXJyYXlSaWdodCIsInJlc3VsdExlZnQiLCJjaGVja0FycmF5VmFsdWUiLCJyZXN1bHRSaWdodCIsImFycmF5Iiwib2RkIiwiZXZlbiIsImxhc3RUeXBlIiwiaW5kZXgiLCJjYXJkTnVtIiwidHlwZSIsInN0ciIsInF1YXJ5VHlwZSIsImNvbXBhcmUiLCJjb21wYXJlUm91bmQiLCJwbGF5UG9rZXJzIiwiZGVzdG9yeUFycmF5IiwiZGVzdG9yeU5vZGUiLCJpIiwiZGVzdHJveSIsImEiLCJiIiwiZmxvb3IiLCJsZWZ0IiwicmlnaHQiLCJzb3J0SW5zZXJ0IiwiaXRlbSIsInB1c2giLCJ3ZWlnaHQiLCJmaXJzdFdlaWdodCIsImxhc3RXZWlnaHQiLCJxdWFyeVBva2VyVHlwZVZhbHVlIiwicG9rZXJWYWx1ZSIsInNvcnRQb2tlcnMiLCJnYW1lSG9zdCIsImNhcmRBcnJheSIsInR5cGUxQXJyYXkiLCJ0eXBlMkFycmF5IiwidHlwZTNBcnJheSIsInR5cGU0QXJyYXkiLCJob3N0QXJyYXkiLCJjcmVhdGVTdGF0aWMiLCJjb25jYXQiLCJ0b3RhbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLFdBQVcsR0FBRyxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCLEVBQWhCLEVBQW9CLEVBQXBCLEVBQXdCLEVBQXhCLEVBQTRCLEVBQTVCLEVBQWdDLEVBQWhDLEVBQW9DLEVBQXBDLEVBQXdDLENBQXhDLEVBQTJDLENBQTNDLEVBQThDLEVBQTlDLEVBQWtELEVBQWxELEVBQXNELEVBQXRELENBQWxCLEVBQTRFOztBQUM1RSxJQUFJQyxRQUFRLEdBQUcsQ0FBQyxDQUFoQjtBQUNBLElBQUlDLFNBQVMsR0FBRyxDQUFoQjs7SUFDcUJDOzs7QUF5QmpCOzs7Ozs7Ozs7OztBQW9FQTs7Ozs7O0FBc0JBOzs7O1lBSU9DLG1CQUFQLDBCQUF3QkMsS0FBeEIsRUFBK0I7QUFDM0IsV0FBT0wsV0FBVyxDQUFDTSxPQUFaLENBQW9CRCxLQUFwQixDQUFQO0FBQ0g7QUFFRDs7Ozs7WUFHT0UsY0FBUCxxQkFBbUJGLEtBQW5CLEVBQTBCO0FBQ3RCLFFBQUlHLEtBQUssR0FBR0MsUUFBUSxDQUFDSixLQUFELENBQXBCO0FBQ0EsV0FBT0csS0FBSyxJQUFJLEVBQVQsSUFBZUEsS0FBSyxJQUFJLENBQXhCLElBQTZCQSxLQUFLLElBQUksQ0FBdEMsSUFBMkNBLEtBQUssSUFBSSxFQUFwRCxJQUEwREEsS0FBSyxJQUFJLEVBQW5FLElBQXlFQSxLQUFLLElBQUksRUFBekYsQ0FGc0IsQ0FFc0U7QUFDL0Y7QUFFRDs7Ozs7Ozs7WUFNT0UsY0FBUCxxQkFBbUJDLFNBQW5C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QUFQO0FBWFI7QUFjSDs7QUEzYWdCbEYsVUE2YVhtRixlQUFhLFVBQUNMLFVBQUQsRUFBWUMsVUFBWixFQUF1QkMsVUFBdkIsRUFBa0NDLFVBQWxDLEVBQTZDQyxTQUE3QyxFQUF1REcsS0FBdkQsRUFBK0Q7QUFDOUUsU0FBTztBQUNIUCxJQUFBQSxVQUFVLEVBQUNBLFVBRFI7QUFFSEMsSUFBQUEsVUFBVSxFQUFDQSxVQUZSO0FBR0hDLElBQUFBLFVBQVUsRUFBQ0EsVUFIUjtBQUlIQyxJQUFBQSxVQUFVLEVBQUNBLFVBSlI7QUFLSEMsSUFBQUEsU0FBUyxFQUFDQSxTQUxQO0FBTUhHLElBQUFBLEtBQUssRUFBQ0E7QUFOSCxHQUFQO0FBU0oiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImxldCBwb2tlcldlaWdodCA9IFs0LCA2LCA3LCA4LCA5LCAxMCwgMTEsIDEyLCAxMywgMTQsIDE1LCAzLCA1LCAxNiwgMTcsIDE4XTsvL+S4uzXkuLoxOFxyXG5sZXQgTEVGVF9XSU4gPSAtMTtcclxubGV0IFJJR0hUX1dJTiA9IDE7XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBva2VyVXRpbCB7XHJcblxyXG4gICAgc3RhdGljIHRlc3RMb2dpYyA9ICh0ZXN0QXJyYXkpID0+IHtcclxuICAgICAgICBsZXQgZ2FtZWhvc3QgPSBNYXRoLnJhbmRvbSgpICogNDtcclxuICAgICAgICBsZXQgcm91bmRob3N0ID0gTWF0aC5yYW5kb20oKSAqIDQ7XHJcbiAgICAgICAgZ2FtZWhvc3QgPSBwYXJzZUludChnYW1laG9zdCkgKyAxO1xyXG4gICAgICAgIHJvdW5kaG9zdCA9IHBhcnNlSW50KHJvdW5kaG9zdCkgKyAxO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwib25pb25cIiwgXCLlvZPliY3muLjmiI/kuLtcIiArIGdhbWVob3N0ICsgXCLmnKzova7kuLtcIiArIHJvdW5kaG9zdCk7XHJcbiAgICAgICAgaWYgKHRlc3RBcnJheS5sZW5ndGggPT0gMSkge1xyXG4gICAgICAgICAgICBsZXQgdGVzdFZhbHVlID0gdGVzdEFycmF5WzBdICsgXCJcIjtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJvbmlvblwiLCBQb2tlclV0aWwucXVhcnlQb2tlcldlaWdodChwYXJzZUludCh0ZXN0VmFsdWUuc3Vic3RyaW5nKDAsIDIpKSkpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGVzdEFycmF5Lmxlbmd0aCA+PSAyKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib25pb25cIiwgUG9rZXJVdGlsLmNvbXBhcmVQb2tlcihnYW1laG9zdCwgcm91bmRob3N0LCB0ZXN0QXJyYXlbMF0sIHRlc3RBcnJheVsxXSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHN0YXRpYyB0ZXN0QXJyYXlMb2dpYyA9ICh0ZXN0QXJyYXkxLCB0ZXN0QXJyYXkyKSA9PiB7XHJcbiAgICAgICAgbGV0IGdhbWVob3N0ID0gTWF0aC5yYW5kb20oKSAqIDQ7XHJcbiAgICAgICAgbGV0IHJvdW5kaG9zdCA9IE1hdGgucmFuZG9tKCkgKiA0O1xyXG4gICAgICAgIGdhbWVob3N0ID0gcGFyc2VJbnQoZ2FtZWhvc3QpICsgMTtcclxuICAgICAgICByb3VuZGhvc3QgPSBwYXJzZUludChyb3VuZGhvc3QpICsgMTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIm9uaW9uXCIsIFwi5b2T5YmN5ri45oiP5Li7XCIgKyBnYW1laG9zdCArIFwi5pys6L2u5Li7XCIgKyByb3VuZGhvc3QpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwib25pb25cIiwgUG9rZXJVdGlsLmNvbXBhcmVQb2tlcihnYW1laG9zdCwgcm91bmRob3N0LCB0ZXN0QXJyYXkxLCB0ZXN0QXJyYXkyKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5q+U6L6D54mM55qE5aSn5bCPXHJcbiAgICAgKiDmnIDlkI7kuIDkvY3mmK/oirHoibLvvIzliY3pnaLnm7TmjqXmr5TlpKflsI9cclxuICAgICAqIOinhOWImSAx5ri45oiP5Li7Pui9ruasoeS4uz7lia9cclxuICAgICAqICAgICAgMiA1PueOiz4zPjJcclxuICAgICAqICAgICAgMyDlkIzkuLrlia/niYzvvIzoirHoibLmr5TlpKflsI9cclxuICAgICAqICAgICAgNFxyXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZUxlZnQgIOWFiOeJjFxyXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZVJpZ2h0IOWQjueJjFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY29tcGFyZVBva2VyID0gKGdhbWVob3N0LCByb3VuZGhvc3QsIHZhbHVlTGVmdCwgdmFsdWVSaWdodCkgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwib25pb25cIiwgXCJjb21wYXJlUG9rZXIrK1wiICsgUG9rZXJVdGlsLnF1YXJ5UG9rZXJWYWx1ZSh2YWx1ZUxlZnQpICsgXCIvXCIgKyBQb2tlclV0aWwucXVhcnlQb2tlclZhbHVlKHZhbHVlUmlnaHQpKTtcclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZUxlZnQpIHx8IEFycmF5LmlzQXJyYXkodmFsdWVSaWdodCkpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIm9uaW9uXCIsIFwi5pqC5LiN5pSv5oyB5pWw57uEXCIpO1xyXG4gICAgICAgICAgICBQb2tlclV0aWwuY29tcGFyZUFycmF5KGdhbWVob3N0LCByb3VuZGhvc3QsIHZhbHVlTGVmdCwgdmFsdWVSaWdodCk7XHJcbiAgICAgICAgICAgIHJldHVybiBMRUZUX1dJTjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh2YWx1ZVJpZ2h0ID09IHZhbHVlTGVmdCkge1xyXG4gICAgICAgICAgICAvL+WujOWFqOebuOWQjO+8jOWFiOeJjOWkp1xyXG4gICAgICAgICAgICByZXR1cm4gTEVGVF9XSU47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhbHVlUmlnaHQgPSB2YWx1ZVJpZ2h0ICsgXCJcIjtcclxuICAgICAgICB2YWx1ZUxlZnQgPSB2YWx1ZUxlZnQgKyBcIlwiO1xyXG4gICAgICAgIC8vMSDliKTmlq3lhYjniYzlkI7niYznmoToirHoibJcclxuICAgICAgICBsZXQgdHlwZUxlZnQgPSB2YWx1ZUxlZnQuc3Vic3RyaW5nKDIpO1xyXG4gICAgICAgIGxldCB0eXBlUmlnaHQgPSB2YWx1ZVJpZ2h0LnN1YnN0cmluZygyKTtcclxuICAgICAgICAvLzLliKTmlq3lhYjniYzlkI7niYzlgLxcclxuICAgICAgICBsZXQgY29udGVudExlZnQgPSB2YWx1ZUxlZnQuc3Vic3RyaW5nKDAsIDIpO1xyXG4gICAgICAgIGxldCBjb250ZW50UmlnaHQgPSB2YWx1ZVJpZ2h0LnN1YnN0cmluZygwLCAyKTtcclxuICAgICAgICAvLzPliKTmlq3niYzmmK/lkKbkuLrkuLsg5rS75Yqo5Li7XHJcbiAgICAgICAgbGV0IGxlZnRJc0hvc3QgPSB0eXBlTGVmdCA9PSBnYW1laG9zdCB8fCBQb2tlclV0aWwucXVhcnlJc0hvc3QoY29udGVudExlZnQpO1xyXG4gICAgICAgIGxldCByaWdodElzSG9zdCA9IHR5cGVMZWZ0ID09IGdhbWVob3N0IHx8IFBva2VyVXRpbC5xdWFyeUlzSG9zdChjb250ZW50UmlnaHQpO1xyXG4gICAgICAgIC8vNOavlOi+g1xyXG4gICAgICAgIGlmIChsZWZ0SXNIb3N0ICYmIHJpZ2h0SXNIb3N0KSB7XHJcbiAgICAgICAgICAgIC8v5ZCM5Li65Li777yM5Li7NeacgOWkp1xyXG4gICAgICAgICAgICBpZiAocGFyc2VJbnQoY29udGVudExlZnQpID09IDUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBMRUZUX1dJTjtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChwYXJzZUludChjb250ZW50UmlnaHQpID09IDUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBSSUdIVF9XSU47XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvL+ebtOaOpeavlOWkp+Wwj1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlc3VsdCA9IFBva2VyVXRpbC5jb21wYXJlU2luZ2xlUG9rZXJCaWdnZXIoY29udGVudExlZnQsIGNvbnRlbnRSaWdodCk7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0ICE9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvL+Wkp+Wwj+ebuOWQjO+8jOWtmOWcqOa0u+WKqOS4u+WSjOiKseiJsuS4u+eJjOWAvOebuOWQjOaDheWGtVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlTGVmdCA9PSBnYW1laG9zdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gTEVGVF9XSU47XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlUmlnaHQgPT0gZ2FtZWhvc3QpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJJR0hUX1dJTjtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Ugey8v5ZCM5Li65rS75Yqo5Li7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBMRUZUX1dJTjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChsZWZ0SXNIb3N0KSB7XHJcbiAgICAgICAgICAgIC8v5YWI54mM5piv5Li777yM5YWI54mM5aSnXHJcbiAgICAgICAgICAgIHJldHVybiBMRUZUX1dJTjtcclxuICAgICAgICB9IGVsc2UgaWYgKHJpZ2h0SXNIb3N0KSB7XHJcbiAgICAgICAgICAgIC8v5ZCO54mM5piv5Li777yM5ZCO54mM5aSnXHJcbiAgICAgICAgICAgIHJldHVybiBSSUdIVF9XSU47XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIFBva2VyVXRpbC5jb21wYXJlVmljZShyb3VuZGhvc3QsIHR5cGVMZWZ0LCB0eXBlUmlnaHQsIGNvbnRlbnRMZWZ0LCBjb250ZW50UmlnaHQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOS4jeWIpOaWreiKseiJsu+8jOebtOaOpeavlOWkp+WwjyDlj6rmjqXlj5fkuKTkvY1cclxuICAgICAqIOWFgeiuuOi/lOWbnjBcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjb21wYXJlU2luZ2xlUG9rZXJCaWdnZXIgPSAodmFsdWVMZWZ0LCB2YWx1ZVJpZ2h0KSA9PiB7XHJcbiAgICAgICAgaWYgKHZhbHVlTGVmdC5sZW5ndGggPiAyIHx8IHZhbHVlUmlnaHQubGVuZ3RoID4gMikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwi5Y+q5o6l5Y+X5Lik5L2N55qEXCIgKyB2YWx1ZUxlZnQgKyBcIi9cIiArIHZhbHVlUmlnaHQpO1xyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGxlZnROdW0gPSBwYXJzZUludCh2YWx1ZUxlZnQpO1xyXG4gICAgICAgIGxldCByaWdodE51bSA9IHBhcnNlSW50KHZhbHVlUmlnaHQpO1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBQb2tlclV0aWwucXVhcnlQb2tlcldlaWdodChyaWdodE51bSkgLSBQb2tlclV0aWwucXVhcnlQb2tlcldlaWdodChsZWZ0TnVtKTtcclxuICAgICAgICBpZiAocmVzdWx0ID4gMCkge1xyXG4gICAgICAgICAgICByZXN1bHQgPSBSSUdIVF9XSU47XHJcbiAgICAgICAgfSBlbHNlIGlmIChyZXN1bHQgPCAwKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IExFRlRfV0lOO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIpOaWreeJjOeahOWkp+Wwj1xyXG4gICAgICogQHBhcmFtIHsqfSBwb2tlclxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcXVhcnlQb2tlcldlaWdodChwb2tlcikge1xyXG4gICAgICAgIHJldHVybiBwb2tlcldlaWdodC5pbmRleE9mKHBva2VyKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIpOaWreeJjOaYr+S4jeaYr+a0u+WKqOS4uyAxNSAzIDXlr7nlupQgMiAzIDVcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHF1YXJ5SXNIb3N0KHBva2VyKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlID0gcGFyc2VJbnQocG9rZXIpO1xyXG4gICAgICAgIHJldHVybiB2YWx1ZSA9PSAxNSB8fCB2YWx1ZSA9PSAzIHx8IHZhbHVlID09IDUgfHwgdmFsdWUgPT0gMTYgfHwgdmFsdWUgPT0gMTcgfHwgdmFsdWUgPT0gMTg7Ly8yIDMgNSDlsI/njosg5aSn546LIOS4uzVcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIpOaWreWJr+eJjOiwgeWkp1xyXG4gICAgICogQHBhcmFtIHsqfSByb3VuZGhvc3RcclxuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWVMZWZ0XHJcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlUmlnaHRcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNvbXBhcmVWaWNlKHJvdW5kaG9zdCwgdHlwZUxlZnQsIHR5cGVSaWdodCwgY29udGVudExlZnQsIGNvbnRlbnRSaWdodCkge1xyXG4gICAgICAgIGlmICh0eXBlUmlnaHQgPT0gdHlwZUxlZnQgPT0gcm91bmRob3N0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBQb2tlclV0aWwuY29tcGFyZVNpbmdsZVBva2VyQmlnZ2VyKGNvbnRlbnRMZWZ0LCBjb250ZW50UmlnaHQpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZUxlZnQgPT0gcm91bmRob3N0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBMRUZUX1dJTjtcclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVSaWdodCA9PSByb3VuZGhvc3QpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFJJR0hUX1dJTjtcclxuICAgICAgICB9IGVsc2Ugey8v6YO95piv5Ymv54mMIOS4jeaYr+acrOi9ruS4u++8jOWkmuWNiuaYr+i3n+eJjO+8jOaEj+S5ieS4jeWkp1xyXG4gICAgICAgICAgICByZXR1cm4gTEVGVF9XSU47XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgY29tcGFyZUFycmF5ID0gKGdhbWVob3N0LCByb3VuZGhvc3QsIHZhbHVlTGVmdCwgdmFsdWVSaWdodCkgPT4ge1xyXG4gICAgICAgIC8v5YG25pWw5byg77yM5o6S5pWw5LiN5LiA6Ie0XHJcbiAgICAgICAgaWYgKHZhbHVlTGVmdC5sZW5ndGggIT0gdmFsdWVSaWdodC5sZW5ndGggfHwgdmFsdWVMZWZ0Lmxlbmd0aCAlIDIgIT0gMCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwib25pb25cIiwgXCLmlbDnu4Tplb/luqbkuI3kuIDoh7RcIik7XHJcbiAgICAgICAgICAgIHJldHVybiBMRUZUX1dJTjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8xIOaOkuW6j1xyXG4gICAgICAgIGxldCBhcnJheUxlZnQgPSB2YWx1ZUxlZnQuc29ydCgpO1xyXG4gICAgICAgIGxldCBhcnJheVJpZ2h0ID0gdmFsdWVSaWdodC5zb3J0KCk7XHJcbiAgICAgICAgLy8yIOWlh+aVsOWSjOWBtuaVsOS4gOagt++8jOWIpOaWreWvueWtkOWQiOazleaAp1xyXG4gICAgICAgIGxldCByZXN1bHRMZWZ0ID0gUG9rZXJVdGlsLmNoZWNrQXJyYXlWYWx1ZShhcnJheUxlZnQpO1xyXG4gICAgICAgIGxldCByZXN1bHRSaWdodCA9IFBva2VyVXRpbC5jaGVja0FycmF5VmFsdWUoYXJyYXlSaWdodCk7XHJcbiAgICAgICAgaWYgKHJlc3VsdExlZnRbMF0gPT0gXCItMVwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBSSUdIVF9XSU47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyZXN1bHRSaWdodFswXSA9PSBcIi0xXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIExFRlRfV0lOO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGdhbWVob3N0ID09IHJlc3VsdExlZnRbMF0gPT0gcmVzdWx0UmlnaHRbMF0pIHtcclxuICAgICAgICAgICAgLy/pg73mmK/kuLvlr7lcclxuICAgICAgICAgICAgaWYgKHJlc3VsdExlZnRbMV0gPiByZXN1bHRSaWdodFsxXSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIExFRlRfV0lOO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFJJR0hUX1dJTjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoZ2FtZWhvc3QgPT0gcmVzdWx0TGVmdFswXSkge1xyXG4gICAgICAgICAgICByZXR1cm4gTEVGVF9XSU47XHJcbiAgICAgICAgfSBlbHNlIGlmIChnYW1laG9zdCA9PSByZXN1bHRSaWdodFswXSkge1xyXG4gICAgICAgICAgICByZXR1cm4gUklHSFRfV0lOO1xyXG4gICAgICAgIH0gZWxzZSBpZiAocm91bmRob3N0ID09IHJlc3VsdExlZnRbMF0gPT0gcmVzdWx0UmlnaHRbMF0pIHtcclxuICAgICAgICAgICAgLy/pg73mmK/lia/lr7lcclxuICAgICAgICAgICAgaWYgKHJlc3VsdExlZnRbMV0gPiByZXN1bHRSaWdodFsxXSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIExFRlRfV0lOO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFJJR0hUX1dJTjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAocm91bmRob3N0ID09IHJlc3VsdExlZnRbMF0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIExFRlRfV0lOO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZ2FtZWhvc3QgPT0gcmVzdWx0UmlnaHRbMF0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIFJJR0hUX1dJTjtcclxuICAgICAgICB9IGVsc2Ugey8v6YO95LiN5piv5Li7IOi3n+eJjOWkp+Wwj+aXoOaEj+S5iVxyXG4gICAgICAgICAgICByZXR1cm4gTEVGVF9XSU47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL+S4gOWvueebtOaOpeavlFxyXG4gICAgICAgIC8v5aSa5a+55YWI5qCh6aqM5ZCI5rOV5oCn77yMMeaYr+WQpuWkmuWvuSAy5piv5ZCm6L+e5a+5IDPoirHoibLkuIDoh7QgNFxyXG5cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog5Yik5pat5a+55a2Q5ZCI5rOV5oCnIOi/lOWbnlvoirHoibIg5p2D6YeNXVxyXG4gICAgICogQHBhcmFtIHsqfSBhcnJheSBcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNoZWNrQXJyYXlWYWx1ZSA9IChhcnJheSkgPT4ge1xyXG4gICAgICAgIGxldCBvZGQgPSBcIi0xXCI7XHJcbiAgICAgICAgbGV0IGV2ZW4gPSBcIi0xXCJcclxuICAgICAgICBsZXQgbGFzdFR5cGUgPSBcIi0xXCI7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGFycmF5Lmxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICAgICAgICBpZiAoaW5kZXggJSAyID09IDApIHtcclxuICAgICAgICAgICAgICAgIGV2ZW4gPSBhcnJheVtpbmRleF07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBvZGQgPSBhcnJheVtpbmRleF07XHJcbiAgICAgICAgICAgICAgICBpZiAoZXZlbiAhPSBvZGQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW1wiLTFcIiwgLTFdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbGV0IGNhcmROdW0gPSBvZGQ7XHJcbiAgICAgICAgICAgICAgICBsZXQgdHlwZSA9IFwiMFwiO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNhcmROdW0gPT0gXCIxNzFcIiB8fCBjYXJkTnVtID09IFwiMTYxXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL+Wkp+Wwj+eOi1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGUgPSBcIjVcIjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHN0ciA9IGNhcmROdW0uc3Vic3RyaW5nKDIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGUgPSBQb2tlclV0aWwucXVhcnlUeXBlKHN0cik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAobGFzdFR5cGUgIT0gdHlwZSAmJiBsYXN0VHlwZSAhPSBcIi0xXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL+S4jeaYr+mmluasoeS4lOS4juS5i+WJjeiKseiJsuS4jeWQjO+8jOS4jeiDveeul+WvueWtkFxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbXCItMVwiLCAtMV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsYXN0VHlwZSA9IHR5cGU7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29tcGFyZSA9IGNhcmROdW0uc3Vic3RyaW5nKDAsIDIpO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgUG9rZXJVdGlsLnF1YXJ5UG9rZXJXZWlnaHQocGFyc2VJbnQoY29tcGFyZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBbbGFzdFR5cGUsIHJlc3VsdF07XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOavlOacrOi9ruWkp+Wwj++8jOi/lOWbnui1ouWutiAxMjM06aG65L2NXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjb21wYXJlUm91bmQgPSAocGxheVBva2VycykgPT4ge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZGVzdG9yeUFycmF5ID0gKGRlc3RvcnlOb2RlKSA9PiB7XHJcbiAgICAgICAgaWYgKGRlc3RvcnlOb2RlICE9IG51bGwpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkZXN0b3J5Tm9kZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZGVzdG9yeU5vZGVbaV0uZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc3RhdGljIHNvcnQ9KGEsYik9PntcclxuICAgICAgICBhPU1hdGguZmxvb3IoYS8xMCk7XHJcbiAgICAgICAgYj1NYXRoLmZsb29yKGIvMTApO1xyXG4gICAgICAgIGxldCBsZWZ0PVBva2VyVXRpbC5xdWFyeVBva2VyV2VpZ2h0KGEpO1xyXG4gICAgICAgIGxldCByaWdodD1Qb2tlclV0aWwucXVhcnlQb2tlcldlaWdodChiKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIm9uaW9uPT1cIithK1wiL1wiK2IpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwib25pb249PVwiK2xlZnQrXCIvXCIrcmlnaHQpO1xyXG4gICAgICAgIHJldHVybiBsZWZ0LXJpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBzb3J0SW5zZXJ0PShhcnJheSxpdGVtKT0+e1xyXG4gICAgICAgIGlmKGFycmF5Lmxlbmd0aD09PTApe1xyXG4gICAgICAgICAgICBhcnJheS5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICByZXR1cm4gYXJyYXlcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gbGV0IHZhbHVlPWl0ZW0uc3Vic3RyaW5nKDAsMik7XHJcbiAgICAgICAgbGV0IHZhbHVlPWl0ZW0vMTA7XHJcbiAgICAgICAgbGV0IHdlaWdodD1Qb2tlclV0aWwucXVhcnlQb2tlcldlaWdodCh2YWx1ZSk7XHJcbiAgICAgICAgbGV0IGZpcnN0V2VpZ2h0PVBva2VyVXRpbC5xdWFyeVBva2VyV2VpZ2h0KGFycmF5WzBdLzEwKTtcclxuICAgICAgICBsZXQgbGFzdFdlaWdodD1Qb2tlclV0aWwucXVhcnlQb2tlcldlaWdodChhcnJheVthcnJheS5sZW5ndGgtMV0vMTApO1xyXG4gICAgICAgIGlmKHdlaWdodDw9Zmlyc3RXZWlnaHQpe1xyXG4gICAgICAgICAgICBhcnJheT1baXRlbSwuLi5hcnJheV07XHJcbiAgICAgICAgICAgIC8vIGFycmF5LnVuc2hpZnQoaXRlbSk7XHJcbiAgICAgICAgfWVsc2UgaWYod2VpZ2h0Pj1sYXN0V2VpZ2h0KXtcclxuICAgICAgICAgICAgYXJyYXkucHVzaChpdGVtKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFycmF5O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgcXVhcnlUeXBlID0gKHR5cGUpID0+IHtcclxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcIjFcIjpcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIuaWueWdl1wiO1xyXG4gICAgICAgICAgICBjYXNlIFwiMlwiOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwi5qKF6IqxXCI7XHJcbiAgICAgICAgICAgIGNhc2UgXCIzXCI6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCLnuqLmoYNcIjtcclxuICAgICAgICAgICAgY2FzZSBcIjRcIjpcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIum7keahg1wiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHN0YXRpYyBxdWFyeVBva2VyVHlwZVZhbHVlID0gKHBva2VyVmFsdWUpID0+IHtcclxuICAgICAgICBwb2tlclZhbHVlPXBva2VyVmFsdWUrXCJcIjtcclxuICAgICAgICBpZiAocG9rZXJWYWx1ZSA9PSBcIjE3MVwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIjNcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHBva2VyVmFsdWUgPT0gXCIxNjFcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gXCI0XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwib25pb25cIixcInBva2VyVmFsdWVcIitwb2tlclZhbHVlKTtcclxuICAgICAgICByZXR1cm4gcG9rZXJWYWx1ZS5zdWJzdHJpbmcoMik7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOmAmui/h+eJjOW6j+afpeiKseiJsuWkp+Wwj1xyXG4gICAgICog5pyA5ZCO5LiA5L2N5piv6Iqx6ImyXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBxdWFyeVBva2VyVmFsdWUgPSAodmFsdWUpID0+IHtcclxuICAgICAgICBsZXQgY2FyZE51bSA9IHZhbHVlICsgXCJcIjtcclxuICAgICAgICBpZiAoY2FyZE51bSA9PSBcIjE3MVwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIuWkp+eOi1wiO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY2FyZE51bSA9PSBcIjE2MVwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIuWwj+eOi1wiXHJcbiAgICAgICAgfSBlbHNlIGlmIChjYXJkTnVtID09IFwiMTgxXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwi5Y2h6IOMXCJcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgY29tcGFyZSA9IGNhcmROdW0uc3Vic3RyaW5nKDAsIDIpO1xyXG4gICAgICAgICAgICBsZXQgdHlwZSA9IGNhcmROdW0uc3Vic3RyaW5nKDIpO1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gUG9rZXJVdGlsLnF1YXJ5VHlwZSh0eXBlKTtcclxuICAgICAgICAgICAgc3dpdGNoIChjb21wYXJlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiMDNcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHQgKyBcIjNcIjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCIwNFwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdCArIFwiNFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiMDVcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHQgKyBcIjVcIjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCIwNlwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdCArIFwiNlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIjA3XCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgXCI3XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiMDhcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHQgKyBcIjhcIjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCIwOVwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdCArIFwiOVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIjEwXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgXCIxMFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIjExXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgXCJKXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiMTJcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHQgKyBcIlFcIjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCIxM1wiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdCArIFwiS1wiO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIjE0XCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgXCJBXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiMTVcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHQgKyBcIjJcIjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaKiueJjOaMieiKseiJsuaOkuWlvVxyXG4gICAgICogQHBhcmFtIGdhbWVIb3N0XHJcbiAgICAgKiBAcGFyYW0gY2FyZEFycmF5XHJcbiAgICAgKiBAcmV0dXJuc1xyXG4gICAgICogIHtcclxuICAgICAgICAgICAgdHlwZTFBcnJheTp0eXBlMUFycmF5LFxyXG4gICAgICAgICAgICB0eXBlMkFycmF5OnR5cGUyQXJyYXksXHJcbiAgICAgICAgICAgIHR5cGUzQXJyYXk6dHlwZTNBcnJheSxcclxuICAgICAgICAgICAgdHlwZTRBcnJheTp0eXBlNEFycmF5LFxyXG4gICAgICAgICAgICBob3N0QXJyYXk6aG9zdEFycmF5LFxyXG4gICAgICAgICAgICB0b3RhbDp0b3RhbFxyXG4gICAgICAgIH1cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHNvcnRQb2tlcnM9KGdhbWVIb3N0LGNhcmRBcnJheSk9PntcclxuICAgICAgICBsZXQgdHlwZTFBcnJheT1bXTtcclxuICAgICAgICBsZXQgdHlwZTJBcnJheT1bXTtcclxuICAgICAgICBsZXQgdHlwZTNBcnJheT1bXTtcclxuICAgICAgICBsZXQgdHlwZTRBcnJheT1bXTtcclxuICAgICAgICBsZXQgaG9zdEFycmF5PVtdOy8v5rS75Yqo5Li7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7aTxjYXJkQXJyYXkubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIGxldCBpdGVtPWNhcmRBcnJheVtpXTtcclxuICAgICAgICAgICAgaWYoaXRlbT09MTcxfHxpdGVtPT0xNjEpe1xyXG4gICAgICAgICAgICAgICAgaG9zdEFycmF5LnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gbGV0IHR5cGU9cGFyc2VJbnQoaXRlbS5zdWJzdHJpbmcoMikpO1xyXG4gICAgICAgICAgICBsZXQgdHlwZT1pdGVtJTEwO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKHR5cGUpe1xyXG4gICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGUxQXJyYXkucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICAgICAgICB0eXBlMkFycmF5LnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTNBcnJheS5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OlxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU0QXJyYXkucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBob3N0QXJyYXkuc29ydChQb2tlclV0aWwuc29ydCk7XHJcbiAgICAgICAgdHlwZTFBcnJheS5zb3J0KFBva2VyVXRpbC5zb3J0KTtcclxuICAgICAgICB0eXBlMkFycmF5LnNvcnQoUG9rZXJVdGlsLnNvcnQpO1xyXG4gICAgICAgIHR5cGUzQXJyYXkuc29ydChQb2tlclV0aWwuc29ydCk7XHJcbiAgICAgICAgdHlwZTNBcnJheS5zb3J0KFBva2VyVXRpbC5zb3J0KTtcclxuICAgICAgICBzd2l0Y2ggKHBhcnNlSW50KGdhbWVIb3N0KSl7XHJcbiAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgIHJldHVybiBQb2tlclV0aWwuY3JlYXRlU3RhdGljKHR5cGUxQXJyYXksdHlwZTJBcnJheSx0eXBlM0FycmF5LHR5cGU0QXJyYXksaG9zdEFycmF5LFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGUyQXJyYXkuY29uY2F0KHR5cGUzQXJyYXkpLmNvbmNhdCh0eXBlNEFycmF5KS5jb25jYXQodHlwZTFBcnJheSkuY29uY2F0KGhvc3RBcnJheSkpO1xyXG4gICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUG9rZXJVdGlsLmNyZWF0ZVN0YXRpYyh0eXBlMUFycmF5LHR5cGUyQXJyYXksdHlwZTNBcnJheSx0eXBlNEFycmF5LGhvc3RBcnJheSxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlM0FycmF5LmNvbmNhdCh0eXBlNEFycmF5KS5jb25jYXQodHlwZTFBcnJheSkuY29uY2F0KHR5cGUyQXJyYXkpLmNvbmNhdChob3N0QXJyYXkpKTtcclxuICAgICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFBva2VyVXRpbC5jcmVhdGVTdGF0aWModHlwZTFBcnJheSx0eXBlMkFycmF5LHR5cGUzQXJyYXksdHlwZTRBcnJheSxob3N0QXJyYXksXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTRBcnJheS5jb25jYXQodHlwZTFBcnJheSkuY29uY2F0KHR5cGUyQXJyYXkpLmNvbmNhdCh0eXBlM0FycmF5KS5jb25jYXQoaG9zdEFycmF5KSk7XHJcbiAgICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgICAgIHJldHVybiBQb2tlclV0aWwuY3JlYXRlU3RhdGljKHR5cGUxQXJyYXksdHlwZTJBcnJheSx0eXBlM0FycmF5LHR5cGU0QXJyYXksaG9zdEFycmF5LFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGUxQXJyYXkuY29uY2F0KHR5cGUyQXJyYXkpLmNvbmNhdCh0eXBlM0FycmF5KS5jb25jYXQodHlwZTRBcnJheSkuY29uY2F0KGhvc3RBcnJheSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgIHN0YXRpYyBjcmVhdGVTdGF0aWM9KHR5cGUxQXJyYXksdHlwZTJBcnJheSx0eXBlM0FycmF5LHR5cGU0QXJyYXksaG9zdEFycmF5LHRvdGFsKT0+e1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHR5cGUxQXJyYXk6dHlwZTFBcnJheSxcclxuICAgICAgICAgICAgdHlwZTJBcnJheTp0eXBlMkFycmF5LFxyXG4gICAgICAgICAgICB0eXBlM0FycmF5OnR5cGUzQXJyYXksXHJcbiAgICAgICAgICAgIHR5cGU0QXJyYXk6dHlwZTRBcnJheSxcclxuICAgICAgICAgICAgaG9zdEFycmF5Omhvc3RBcnJheSxcclxuICAgICAgICAgICAgdG90YWw6dG90YWxcclxuICAgICAgICB9XHJcblxyXG4gICB9XHJcblxyXG59Il19
//------QC-SOURCE-SPLIT------
