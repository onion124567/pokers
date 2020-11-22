
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
    //当前主
    currentWinner: 1,
    layoutContainer: {
      "default": null,
      type: cc.Layout
    },
    layoutBottom: {
      "default": null,
      type: cc.Layout
    },
    layoutTop: {
      "default": null,
      type: cc.Layout
    },
    layoutLeft: {
      "default": null,
      type: cc.Layout
    },
    layoutRight: {
      "default": null,
      type: cc.Layout
    },
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
    var pokerArray = this.cardArray.slice(0);

    for (var i = 0; i < 4; i++) {
      var playerPokerArray = [];

      for (var j = 0; j < 27; j++) {
        var pokerNum = Math.random() * pokerArray.length;
        pokerNum = parseInt(pokerNum);
        var value = pokerArray.splice(pokerNum, 1);
        playerPokerArray.push(value);
      }

      this.pokerPlayer.push(playerPokerArray);
    }

    this.spawnBottomCard();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcR2FtZS5qcyJdLCJuYW1lcyI6WyJQb2tlclV0aWwiLCJyZXF1aXJlIiwiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJzdGFyUHJlZmFiIiwidHlwZSIsIlByZWZhYiIsImNhcmRQcmVmYWIiLCJtYXhTdGFyRHVyYXRpb24iLCJtaW5TdGFyRHVyYXRpb24iLCJjdXJyZW50Q2FyZFBvc2l0aW9uIiwic3RhcnRDYXJkUG9zdGlvbiIsImNhcmRXaWR0aCIsImNhcmRBcnJheSIsIlN0cmluZyIsInBva2VyUGxheWVyIiwicm91bmRQb2tlciIsInBsYXllckNvbnRyb2xOb2RlQXJyYXkiLCJyZWZyZXNoQnV0dG9uIiwiQnV0dG9uIiwic2VuZEJ1dHRvbiIsImN1cnJlbnRXaW5uZXIiLCJsYXlvdXRDb250YWluZXIiLCJMYXlvdXQiLCJsYXlvdXRCb3R0b20iLCJsYXlvdXRUb3AiLCJsYXlvdXRMZWZ0IiwibGF5b3V0UmlnaHQiLCJncm91bmQiLCJOb2RlIiwicGxheWVyIiwic2NvcmVEaXNwbGF5IiwiTGFiZWwiLCJzY29yZUF1ZGlvIiwiQXVkaW9DbGlwIiwib25Mb2FkIiwiZ3JvdW5kWSIsInkiLCJoZWlnaHQiLCJ0aW1lciIsInN0YXJEdXJhdGlvbiIsImkiLCJwcmUiLCJqIiwic3RyIiwicHVzaCIsIm5vZGUiLCJvbiIsInJlZnJlc2hDYWxsYmFjayIsInNlbmRDYWxsYmFjayIsInB1Ymxpc2hQb2tlcnMiLCJzY29yZSIsImJ1dHRvbiIsInRlc3RBcnJheSIsImRlc3RvcnlBcnJheSIsImxlbmd0aCIsImdldENvbXBvbmVudCIsImlzQ2hlY2siLCJjb25zb2xlIiwibG9nIiwicXVhcnlQb2tlclZhbHVlIiwicGljTnVtIiwic2F2ZVJvdW5kUG9rZXIiLCJkZXN0cm95Iiwic3BsaWNlIiwidGVzdExvZ2ljIiwiaW5kZXgiLCJvZmZzZXQiLCJuZXdTdGFyIiwiaW5zdGFudGlhdGUiLCJzY2FsZVgiLCJzY2FsZVkiLCJhZGRDaGlsZCIsInNwYXduTmV3U3RhciIsInNldFBvc2l0aW9uIiwiZ2V0TmV3U3RhclBvc2l0aW9uIiwiZ2FtZSIsIk1hdGgiLCJyYW5kb20iLCJzcGF3bkJvdHRvbUNhcmQiLCJkZXN0b3J5Tm9kZSIsImNyZWF0ZUJvdHRvbUNhcmQiLCJzdGFydFBvc2l0aW9uIiwicmFuZFgiLCJyYW5kWSIsImp1bXBIZWlnaHQiLCJtYXhYIiwid2lkdGgiLCJ2MiIsImdldENhcmRCb3R0b21Qb3NpdGlvbiIsInVwZGF0ZSIsImR0IiwiZ2FpblNjb3JlIiwic3RyaW5nIiwiYXVkaW9FbmdpbmUiLCJwbGF5RWZmZWN0IiwiZ2FtZU92ZXIiLCJzdG9wQWxsQWN0aW9ucyIsImRpcmVjdG9yIiwibG9hZFNjZW5lIiwicG9rZXJBcnJheSIsInNsaWNlIiwicGxheWVyUG9rZXJBcnJheSIsInBva2VyTnVtIiwicGFyc2VJbnQiLCJ2YWx1ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQyxJQUFJQSxTQUFTLEdBQUdDLE9BQU8sQ0FBQyxXQUFELENBQXZCOztBQUNEQyxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNMLGFBQVNELEVBQUUsQ0FBQ0UsU0FEUDtBQUdMQyxFQUFBQSxVQUFVLEVBQUU7QUFDUjtBQUNBQyxJQUFBQSxVQUFVLEVBQUU7QUFDUixpQkFBUyxJQUREO0FBRVJDLE1BQUFBLElBQUksRUFBRUwsRUFBRSxDQUFDTTtBQUZELEtBRko7QUFNUkMsSUFBQUEsVUFBVSxFQUFFO0FBQ1IsaUJBQVMsSUFERDtBQUVSRixNQUFBQSxJQUFJLEVBQUVMLEVBQUUsQ0FBQ007QUFGRCxLQU5KO0FBVVI7QUFDQUUsSUFBQUEsZUFBZSxFQUFFLENBWFQ7QUFZUkMsSUFBQUEsZUFBZSxFQUFFLENBWlQ7QUFhUkMsSUFBQUEsbUJBQW1CLEVBQUUsQ0FiYjtBQWNSQyxJQUFBQSxnQkFBZ0IsRUFBRSxDQWRWO0FBZVJDLElBQUFBLFNBQVMsRUFBRSxFQWZIO0FBaUJSQyxJQUFBQSxTQUFTLEVBQUUsQ0FB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QkEsQ0FBQyxFQUF4QixFQUE0QjtBQUN4QixVQUFJNkQsZ0JBQWdCLEdBQUcsRUFBdkI7O0FBQ0EsV0FBSyxJQUFJM0QsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRyxFQUFwQixFQUF3QkEsQ0FBQyxFQUF6QixFQUE2QjtBQUN6QixZQUFJNEQsUUFBUSxHQUFHMUIsSUFBSSxDQUFDQyxNQUFMLEtBQWdCc0IsVUFBVSxDQUFDN0MsTUFBMUM7QUFDQWdELFFBQUFBLFFBQVEsR0FBR0MsUUFBUSxDQUFDRCxRQUFELENBQW5CO0FBQ0EsWUFBSUUsS0FBSyxHQUFHTCxVQUFVLENBQUNwQyxNQUFYLENBQWtCdUMsUUFBbEIsRUFBNEIsQ0FBNUIsQ0FBWjtBQUNBRCxRQUFBQSxnQkFBZ0IsQ0FBQ3pELElBQWpCLENBQXNCNEQsS0FBdEI7QUFDSDs7QUFDRCxXQUFLMUYsV0FBTCxDQUFpQjhCLElBQWpCLENBQXNCeUQsZ0JBQXRCO0FBQ0g7O0FBQ0QsU0FBS3ZCLGVBQUw7QUFFSDtBQXRRSSxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJcbiBsZXQgUG9rZXJVdGlsID0gcmVxdWlyZShcIlBva2VyVXRpbFwiKTtcbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIOi/meS4quWxnuaAp+W8leeUqOS6huaYn+aYn+mihOWItui1hOa6kFxuICAgICAgICBzdGFyUHJlZmFiOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiXG4gICAgICAgIH0sXG4gICAgICAgIGNhcmRQcmVmYWI6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5QcmVmYWJcbiAgICAgICAgfSxcbiAgICAgICAgLy8g5pif5pif5Lqn55Sf5ZCO5raI5aSx5pe26Ze055qE6ZqP5py66IyD5Zu0XG4gICAgICAgIG1heFN0YXJEdXJhdGlvbjogMCxcbiAgICAgICAgbWluU3RhckR1cmF0aW9uOiAwLFxuICAgICAgICBjdXJyZW50Q2FyZFBvc2l0aW9uOiAwLFxuICAgICAgICBzdGFydENhcmRQb3N0aW9uOiAwLFxuICAgICAgICBjYXJkV2lkdGg6IDgwLFxuICAgICAgICBcbiAgICAgICAgY2FyZEFycmF5OiBbY2MuU3RyaW5nXSxcbiAgICAgICAgLy/liJ3lp4vniYzmlbDnu4Qg6YCG5pe26ZKIIOS4u+inkuaYr+esrOS4gOS4quaVsOe7hFxuICAgICAgICBwb2tlclBsYXllcjogW10sXG4gICAgICAgIC8v5b2T5YmN6L2u5qyh5Ye654mM6IqC54K5LFxuICAgICAgICByb3VuZFBva2VyOiBbXSxcbiAgICAgICAgLy/kuLvop5LlvZPliY3niYzoioLngrlcbiAgICAgICAgcGxheWVyQ29udHJvbE5vZGVBcnJheTogW10sXG4gICAgICAgIC8v5rSX54mMXG4gICAgICAgIHJlZnJlc2hCdXR0b246IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5CdXR0b25cbiAgICAgICAgfSxcbiAgICAgICAgLy/lh7rniYxcbiAgICAgICAgc2VuZEJ1dHRvbjoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkJ1dHRvblxuICAgICAgICB9LFxuXG4gICAgICAgIC8v5b2T5YmN5Li7XG4gICAgICAgIGN1cnJlbnRXaW5uZXI6MSxcblxuICAgICAgICBsYXlvdXRDb250YWluZXI6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5MYXlvdXRcbiAgICAgICAgfSxcbiAgICAgICAgbGF5b3V0Qm90dG9tOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuTGF5b3V0XG4gICAgICAgIH0sXG4gICAgICAgIGxheW91dFRvcDp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLkxheW91dFxuICAgICAgICB9LFxuICAgICAgICBsYXlvdXRMZWZ0OntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuTGF5b3V0XG4gICAgICAgIH0sXG4gICAgICAgIGxheW91dFJpZ2h0OntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuTGF5b3V0XG4gICAgICAgIH0sXG4gICAgICAgIC8vIOWcsOmdouiKgueCue+8jOeUqOS6juehruWumuaYn+aYn+eUn+aIkOeahOmrmOW6plxuICAgICAgICBncm91bmQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH0sXG4gICAgICAgIC8vIHBsYXllciDoioLngrnvvIznlKjkuo7ojrflj5bkuLvop5LlvLnot7PnmoTpq5jluqbvvIzlkozmjqfliLbkuLvop5LooYzliqjlvIDlhbNcbiAgICAgICAgcGxheWVyOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9LFxuICAgICAgICAvLyBzY29yZSBsYWJlbCDnmoTlvJXnlKhcbiAgICAgICAgc2NvcmVEaXNwbGF5OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWxcbiAgICAgICAgfSxcbiAgICAgICAgLy8g5b6X5YiG6Z+z5pWI6LWE5rqQXG4gICAgICAgIHNjb3JlQXVkaW86IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5BdWRpb0NsaXBcbiAgICAgICAgfSxcbiAgICB9LFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIOiOt+WPluWcsOW5s+mdoueahCB5IOi9tOWdkOagh1xuICAgICAgICB0aGlzLmdyb3VuZFkgPSB0aGlzLmdyb3VuZC55ICsgdGhpcy5ncm91bmQuaGVpZ2h0IC8gMjtcbiAgICAgICAgLy8g5Yid5aeL5YyW6K6h5pe25ZmoXG4gICAgICAgIHRoaXMudGltZXIgPSAwO1xuICAgICAgICB0aGlzLnN0YXJEdXJhdGlvbiA9IDA7XG4gICAgICAgIC8v5Yib5bu65Zu+54mH6LWE5rqQXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTM7IGkrKykge1xuICAgICAgICAgICAgbGV0IHByZSA9IDMgKyBpO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDE7IGogPCA1OyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgc3RyID0gXCJcIjtcbiAgICAgICAgICAgICAgICBpZiAocHJlIDwgMTApIHtcbiAgICAgICAgICAgICAgICAgICAgc3RyID0gXCIwXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHN0ciA9IHN0ciArIHByZSArIGo7XG4gICAgICAgICAgICAgICAgdGhpcy5jYXJkQXJyYXkucHVzaChzdHIpO1xuICAgICAgICAgICAgICAgIHRoaXMuY2FyZEFycmF5LnB1c2goc3RyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNhcmRBcnJheS5wdXNoKFwiMTYxXCIpO1xuICAgICAgICB0aGlzLmNhcmRBcnJheS5wdXNoKFwiMTYxXCIpO1xuICAgICAgICB0aGlzLmNhcmRBcnJheS5wdXNoKFwiMTcxXCIpO1xuICAgICAgICB0aGlzLmNhcmRBcnJheS5wdXNoKFwiMTcxXCIpO1xuXG5cbiAgICAgICAgdGhpcy5yZWZyZXNoQnV0dG9uLm5vZGUub24oJ2NsaWNrJywgdGhpcy5yZWZyZXNoQ2FsbGJhY2ssIHRoaXMpO1xuICAgICAgICB0aGlzLnNlbmRCdXR0b24ubm9kZS5vbignY2xpY2snLCB0aGlzLnNlbmRDYWxsYmFjaywgdGhpcyk7XG4gICAgICAgIHRoaXMucHVibGlzaFBva2VycygpO1xuICAgICAgICAvLyB0aGlzLnNwYXduTmV3U3RhcigpO1xuICAgICAgICAvLyDliJ3lp4vljJborqHliIZcbiAgICAgICAgdGhpcy5zY29yZSA9IDA7XG4gICAgfSxcbiAgICByZWZyZXNoQ2FsbGJhY2s6IGZ1bmN0aW9uIChidXR0b24pIHtcbiAgICAgICAgdGhpcy5wdWJsaXNoUG9rZXJzKCk7XG4gICAgfSxcbiAgICBzZW5kQ2FsbGJhY2s6IGZ1bmN0aW9uIChidXR0b24pIHtcbiAgICAgICAgbGV0IHRlc3RBcnJheT1bXTtcbiAgICAgICAgUG9rZXJVdGlsLmRlc3RvcnlBcnJheSh0aGlzLnJvdW5kUG9rZXIpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGxheWVyQ29udHJvbE5vZGVBcnJheS5sZW5ndGg7KSB7XG4gICAgICAgICAgICAvL+WIpOaWreaYr+WQpuWPr+WHulxuICAgICAgICAgICAgbGV0IG5vZGUgPSB0aGlzLnBsYXllckNvbnRyb2xOb2RlQXJyYXlbaV0uZ2V0Q29tcG9uZW50KCdDYXJkJyk7XG4gICAgICAgICAgICBpZiAobm9kZS5pc0NoZWNrKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJvbmlvbiDpgInkuK1cIiArIFBva2VyVXRpbC5xdWFyeVBva2VyVmFsdWUobm9kZS5waWNOdW0pKTtcbiAgICAgICAgICAgICAgICB0ZXN0QXJyYXkucHVzaChub2RlLnBpY051bSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zYXZlUm91bmRQb2tlcihub2RlLnBpY051bSwgMSwgaSAqIHRoaXMuY2FyZFdpZHRoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllckNvbnRyb2xOb2RlQXJyYXlbaV0uZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgIHRoaXMucGxheWVyQ29udHJvbE5vZGVBcnJheS5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHRoaXMucGxheWVyQ29udHJvbE5vZGVBcnJheVtpXS5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICAgICAgIFBva2VyVXRpbC50ZXN0TG9naWModGVzdEFycmF5KTtcbiAgICB9LFxuICAgIC8v5L+d5a2Y5Ye654mMICAxIDIgMyA0IOmhuuaXtumSiOS9jVxuICAgIHNhdmVSb3VuZFBva2VyOiBmdW5jdGlvbiAocGljTnVtLCBpbmRleCwgb2Zmc2V0KSB7XG4gICAgICAgIHZhciBuZXdTdGFyID0gY2MuaW5zdGFudGlhdGUodGhpcy5jYXJkUHJlZmFiKTtcbiAgICAgICAgLy8gbmV3U3Rhci5zZXRQaWNOdW0oXCJpXCIraSk7XG4gICAgICAgIG5ld1N0YXIuZ2V0Q29tcG9uZW50KCdDYXJkJykucGljTnVtID0gcGljTnVtO1xuICAgICAgICBuZXdTdGFyLnNjYWxlWCA9IDAuNTtcbiAgICAgICAgbmV3U3Rhci5zY2FsZVkgPSAwLjU7XG4gICAgICAgIHRoaXMucm91bmRQb2tlci5wdXNoKG5ld1N0YXIpO1xuICAgICAgICAvLyB0aGlzLm5vZGUuYWRkQ2hpbGQobmV3U3Rhcik7XG4gICAgICAgIC8vIGxldCBoZWlnaHQgPSB0aGlzLmdyb3VuZC5oZWlnaHQgLyAyICogLTE7XG4gICAgICAgIGlmIChpbmRleCA9PT0gMSkge1xuICAgICAgICAgICAgLy8gaGVpZ2h0ID0gaGVpZ2h0ICsgMTAwO1xuICAgICAgICAgICAgdGhpcy5sYXlvdXRCb3R0b20ubm9kZS5hZGRDaGlsZChuZXdTdGFyKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBuZXdTdGFyLnNldFBvc2l0aW9uKGNjLnYyKC0xNTAgKyB0aGlzLnN0YXJ0Q2FyZFBvc3Rpb24gKyBvZmZzZXQsIGhlaWdodCkpO1xuICAgIH0sXG4gICAgc3Bhd25OZXdTdGFyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIOS9v+eUqOe7meWumueahOaooeadv+WcqOWcuuaZr+S4reeUn+aIkOS4gOS4quaWsOiKgueCuVxuICAgICAgICB2YXIgbmV3U3RhciA9IGNjLmluc3RhbnRpYXRlKHRoaXMuc3RhclByZWZhYik7XG4gICAgICAgIC8vIOWwhuaWsOWinueahOiKgueCuea3u+WKoOWIsCBDYW52YXMg6IqC54K55LiL6Z2iXG4gICAgICAgIHRoaXMubm9kZS5hZGRDaGlsZChuZXdTdGFyKTtcbiAgICAgICAgLy8g5Li65pif5pif6K6+572u5LiA5Liq6ZqP5py65L2N572uXG4gICAgICAgIG5ld1N0YXIuc2V0UG9zaXRpb24odGhpcy5nZXROZXdTdGFyUG9zaXRpb24oKSk7XG4gICAgICAgIC8vIOWcqOaYn+aYn+e7hOS7tuS4iuaaguWtmCBHYW1lIOWvueixoeeahOW8leeUqFxuICAgICAgICBuZXdTdGFyLmdldENvbXBvbmVudCgnU3RhcicpLmdhbWUgPSB0aGlzO1xuICAgICAgICAvLyDph43nva7orqHml7blmajvvIzmoLnmja7mtojlpLHml7bpl7TojIPlm7Tpmo/mnLrlj5bkuIDkuKrlgLxcbiAgICAgICAgdGhpcy5zdGFyRHVyYXRpb24gPSB0aGlzLm1pblN0YXJEdXJhdGlvbiArIE1hdGgucmFuZG9tKCkgKiAodGhpcy5tYXhTdGFyRHVyYXRpb24gLSB0aGlzLm1pblN0YXJEdXJhdGlvbik7XG4gICAgICAgIHRoaXMudGltZXIgPSAwO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICog56e76Zmk5pen55qE6IqC54K5XG4gICAgICog5re75Yqg5paw6IqC54K5XG4gICAgICovXG4gICAgc3Bhd25Cb3R0b21DYXJkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLnBsYXllckNvbnRyb2xOb2RlQXJyYXkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbGV0IGRlc3RvcnlOb2RlID0gdGhpcy5wbGF5ZXJDb250cm9sTm9kZUFycmF5O1xuICAgICAgICAgICAgUG9rZXJVdGlsLmRlc3RvcnlBcnJheShkZXN0b3J5Tm9kZSk7XG4gICAgICAgICAgICB0aGlzLnBsYXllckNvbnRyb2xOb2RlQXJyYXkgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhcInNwYXduQm90dG9tQ2FyZCBcIiArIHRoaXMucG9rZXJQbGF5ZXJbMF0ubGVuZ3RoKTtcbiAgICAgICAgdGhpcy5jcmVhdGVCb3R0b21DYXJkKClcblxuICAgIH0sXG5cbiAgICBjcmVhdGVCb3R0b21DYXJkOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgbGV0IHN0YXJ0UG9zaXRpb24gPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucG9rZXJQbGF5ZXJbMF0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIC8vIOS9v+eUqOe7meWumueahOaooeadv+WcqOWcuuaZr+S4reeUn+aIkOS4gOS4quaWsOiKgueCuVxuICAgICAgICAgICAgdmFyIG5ld1N0YXIgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmNhcmRQcmVmYWIpO1xuICAgICAgICAgICAgLy8gbmV3U3Rhci5zZXRQaWNOdW0oXCJpXCIraSk7XG4gICAgICAgICAgICBuZXdTdGFyLmdldENvbXBvbmVudCgnQ2FyZCcpLnBpY051bSA9IHRoaXMucG9rZXJQbGF5ZXJbMF1baV07XG4gICAgICAgICAgICB0aGlzLnBsYXllckNvbnRyb2xOb2RlQXJyYXkucHVzaChuZXdTdGFyKTtcbiAgICAgICAgICAgIC8vIHRoaXMubm9kZS5hZGRDaGlsZChuZXdTdGFyKTtcbiAgICAgICAgICAgIHRoaXMubGF5b3V0Q29udGFpbmVyLm5vZGUuYWRkQ2hpbGQobmV3U3Rhcik7XG4gICAgICAgICAgICBsZXQgaGVpZ2h0ID0gdGhpcy5ncm91bmQuaGVpZ2h0IC8gMiAqIC0xO1xuICAgICAgICAgICAgc3RhcnRQb3NpdGlvbiA9IGkgKiB0aGlzLmNhcmRXaWR0aDtcbiAgICAgICAgICAgIGlmIChpID4gMTMpIHtcbiAgICAgICAgICAgICAgICBoZWlnaHQgPSBoZWlnaHQgLSAxNTBcbiAgICAgICAgICAgICAgICBzdGFydFBvc2l0aW9uID0gKGkgLSAxMykgKiB0aGlzLmNhcmRXaWR0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIG5ld1N0YXIuc2V0UG9zaXRpb24oY2MudjIoLTIwMCArIHRoaXMuc3RhcnRDYXJkUG9zdGlvbiArIHN0YXJ0UG9zaXRpb24sIGhlaWdodCkpO1xuICAgICAgICB9XG4gICAgfSxcblxuXG4gICAgZ2V0TmV3U3RhclBvc2l0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciByYW5kWCA9IDA7XG4gICAgICAgIC8vIOagueaNruWcsOW5s+mdouS9jee9ruWSjOS4u+inkui3s+i3g+mrmOW6pu+8jOmaj+acuuW+l+WIsOS4gOS4quaYn+aYn+eahCB5IOWdkOagh1xuICAgICAgICB2YXIgcmFuZFkgPSB0aGlzLmdyb3VuZFkgKyBNYXRoLnJhbmRvbSgpICogdGhpcy5wbGF5ZXIuZ2V0Q29tcG9uZW50KCdQbGF5ZXInKS5qdW1wSGVpZ2h0ICsgNTA7XG4gICAgICAgIC8vIOagueaNruWxj+W5leWuveW6pu+8jOmaj+acuuW+l+WIsOS4gOS4quaYn+aYnyB4IOWdkOagh1xuICAgICAgICB2YXIgbWF4WCA9IHRoaXMubm9kZS53aWR0aCAvIDI7XG4gICAgICAgIHJhbmRYID0gKE1hdGgucmFuZG9tKCkgLSAwLjUpICogMiAqIG1heFg7XG4gICAgICAgIC8vIOi/lOWbnuaYn+aYn+WdkOagh1xuICAgICAgICByZXR1cm4gY2MudjIocmFuZFgsIHJhbmRZKTtcbiAgICB9LFxuICAgIGdldENhcmRCb3R0b21Qb3NpdGlvbjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcmFuZFggPSB0aGlzLmN1cnJlbnRDYXJkUG9zaXRpb247XG4gICAgICAgIHZhciByYW5kWSA9IDA7XG4gICAgICAgIHRoaXMuY3VycmVudENhcmRQb3NpdGlvbiA9IHRoaXMuY3VycmVudENhcmRQb3NpdGlvbiArIHRoaXMuY2FyZFdpZHRoO1xuICAgICAgICByZXR1cm4gY2MudjIocmFuZFgsIHJhbmRZKTtcbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcbiAgICAgICAgLy8g5q+P5bin5pu05paw6K6h5pe25Zmo77yM6LaF6L+H6ZmQ5bqm6L+Y5rKh5pyJ55Sf5oiQ5paw55qE5pif5pifXG4gICAgICAgIC8vIOWwseS8muiwg+eUqOa4uOaIj+Wksei0pemAu+i+kVxuICAgICAgICAvLyBpZiAodGhpcy50aW1lciA+IHRoaXMuc3RhckR1cmF0aW9uKSB7XG4gICAgICAgIC8vICAgICB0aGlzLmdhbWVPdmVyKCk7XG4gICAgICAgIC8vICAgICB0aGlzLmVuYWJsZWQgPSBmYWxzZTsgICAvLyBkaXNhYmxlIGdhbWVPdmVyIGxvZ2ljIHRvIGF2b2lkIGxvYWQgc2NlbmUgcmVwZWF0ZWRseVxuICAgICAgICAvLyAgICAgcmV0dXJuO1xuICAgICAgICAvLyB9XG4gICAgICAgIC8vIHRoaXMudGltZXIgKz0gZHQ7XG4gICAgfSxcblxuICAgIGdhaW5TY29yZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnNjb3JlICs9IDE7XG4gICAgICAgIC8vIOabtOaWsCBzY29yZURpc3BsYXkgTGFiZWwg55qE5paH5a2XXG4gICAgICAgIHRoaXMuc2NvcmVEaXNwbGF5LnN0cmluZyA9ICdTY29yZTogJyArIHRoaXMuc2NvcmU7XG4gICAgICAgIC8vIOaSreaUvuW+l+WIhumfs+aViFxuICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KHRoaXMuc2NvcmVBdWRpbywgZmFsc2UpO1xuICAgIH0sXG5cbiAgICBnYW1lT3ZlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnBsYXllci5zdG9wQWxsQWN0aW9ucygpOyAvL+WBnOatoiBwbGF5ZXIg6IqC54K555qE6Lez6LeD5Yqo5L2cXG4gICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZSgnZ2FtZScpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAqIOaKiueJjOWPkee7meWbm+WutlxuICAgICovXG4gICAgcHVibGlzaFBva2VyczogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnBva2VyUGxheWVyID0gW107XG4gICAgICAgIGxldCBwb2tlckFycmF5ID0gdGhpcy5jYXJkQXJyYXkuc2xpY2UoMCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcGxheWVyUG9rZXJBcnJheSA9IFtdO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAyNzsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHBva2VyTnVtID0gTWF0aC5yYW5kb20oKSAqIHBva2VyQXJyYXkubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHBva2VyTnVtID0gcGFyc2VJbnQocG9rZXJOdW0pO1xuICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IHBva2VyQXJyYXkuc3BsaWNlKHBva2VyTnVtLCAxKTtcbiAgICAgICAgICAgICAgICBwbGF5ZXJQb2tlckFycmF5LnB1c2godmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5wb2tlclBsYXllci5wdXNoKHBsYXllclBva2VyQXJyYXkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3Bhd25Cb3R0b21DYXJkKCk7XG5cbiAgICB9LFxuICAgIFxuICAgIFxuXG5cblxufSk7XG4iXX0=
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
    return value == 15 || value == 3 || value == 5; //2 3 5
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
      return this.compareSinglePokerBigger(contentLeft, contentRight);
    } else if (typeLeft == roundhost) {
      return LEFT_WIN;
    } else if (typeRight == roundhost) {
      return RIGHT_WIN;
    } else {
      //都是副牌 不是本轮主，意义不大
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
    console.log("onion", "当前游戏主" + testValue.substring(0, 2));
    console.log("onion", PokerUtil.quaryPokerWeight(parseInt(testValue.substring(0, 2))));
  } else if (testArray.length >= 2) {
    console.log("onion", PokerUtil.comparePoker(gamehost, roundhost, testArray[0], testArray[1]));
  }
};

PokerUtil.comparePoker = function (gamehost, roundhost, valueLeft, valueRight) {
  console.log("onion", "comparePoker++" + typeof valueLeft); // if (Array.isArray(valueLeft) || Array.isArray(valueRight)) {
  //     console.error("onion", "暂不支持数组" + typeof valueLeft + "/" + typeof valueRight);
  //     return LEFT_WIN;
  // }

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
  if (valueLeft.length != valueRight.length) {
    console.error("onion", "数组长度不一致");
    return LEFT_WIN;
  } //一对直接比
  //多对先校验合法性，1是否多对 2是否连对 3花色一致 4

};

PokerUtil.compareRound = function (playPokers) {};

PokerUtil.destoryArray = function (destoryNode) {
  if (destoryNode != null) {
    for (var i = 0; i < destoryNode.length; i++) {
      destoryNode[i].destroy();
    }
  }
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
    var result = "";

    switch (type) {
      case "1":
        result = "方块";
        break;

      case "2":
        result = "梅花";
        break;

      case "3":
        result = "红桃";
        break;

      case "4":
        result = "黑桃";
        break;
    }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcUG9rZXJVdGlsLmpzIl0sIm5hbWVzIjpbInBva2VyV2VpZ2h0IiwiTEVGVF9XSU4iLCJSSUdIVF9XSU4iLCJQb2tlclV0aWwiLCJxdWFyeVBva2VyV2VpZ2h0IiwicG9rZXIiLCJpbmRleE9mIiwicXVhcnlJc0hvc3QiLCJ2YWx1ZSIsInBhcnNlSW50IiwiY29tcGFyZVZpY2UiLCJyb3VuZGhvc3QiLCJ0eXBlTGVmdCIsInR5cGVSaWdodCIsImNvbnRlbnRMZWZ0IiwiY29udGVudFJpZ2h0IiwiY29tcGFyZVNpbmdsZVBva2VyQmlnZ2VyIiwidGVzdExvZ2ljIiwidGVzdEFycmF5IiwiZ2FtZWhvc3QiLCJNYXRoIiwicmFuZG9tIiwiY29uc29sZSIsImxvZyIsImxlbmd0aCIsInRlc3RWYWx1ZSIsInN1YnN0cmluZyIsImNvbXBhcmVQb2tlciIsInZhbHVlTGVmdCIsInZhbHVlUmlnaHQiLCJsZWZ0SXNIb3N0IiwicmlnaHRJc0hvc3QiLCJyZXN1bHQiLCJlcnJvciIsImxlZnROdW0iLCJyaWdodE51bSIsImNvbXBhcmVBcnJheSIsImNvbXBhcmVSb3VuZCIsInBsYXlQb2tlcnMiLCJkZXN0b3J5QXJyYXkiLCJkZXN0b3J5Tm9kZSIsImkiLCJkZXN0cm95IiwicXVhcnlQb2tlclZhbHVlIiwiY2FyZE51bSIsImNvbXBhcmUiLCJ0eXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsSUFBSUEsV0FBVyxHQUFHLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0IsRUFBaEIsRUFBb0IsRUFBcEIsRUFBd0IsRUFBeEIsRUFBNEIsRUFBNUIsRUFBZ0MsRUFBaEMsRUFBb0MsRUFBcEMsRUFBd0MsQ0FBeEMsRUFBMkMsQ0FBM0MsRUFBOEMsRUFBOUMsRUFBa0QsRUFBbEQsRUFBc0QsRUFBdEQsQ0FBbEIsRUFBNEU7O0FBQzVFLElBQUlDLFFBQVEsR0FBRyxDQUFD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LFdBQUssSUFBTDtBQUNJQSxRQUFBQSxNQUFNLEdBQUdBLE1BQU0sR0FBRyxHQUFsQjtBQUNBOztBQUNKLFdBQUssSUFBTDtBQUNJQSxRQUFBQSxNQUFNLEdBQUdBLE1BQU0sR0FBRyxHQUFsQjtBQUNBOztBQUNKLFdBQUssSUFBTDtBQUNJQSxRQUFBQSxNQUFNLEdBQUdBLE1BQU0sR0FBRyxHQUFsQjtBQUNBOztBQUNKLFdBQUssSUFBTDtBQUNJQSxRQUFBQSxNQUFNLEdBQUdBLE1BQU0sR0FBRyxHQUFsQjtBQUNBO0FBdkNSOztBQXlDQSxXQUFPQSxNQUFQO0FBQ0g7QUFDSiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbmxldCBwb2tlcldlaWdodCA9IFs0LCA2LCA3LCA4LCA5LCAxMCwgMTEsIDEyLCAxMywgMTQsIDE1LCAzLCA1LCAxNiwgMTcsIDE4XTsvL+S4uzXkuLoxOFxyXG5sZXQgTEVGVF9XSU4gPSAtMTtcclxubGV0IFJJR0hUX1dJTiA9IDE7XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBva2VyVXRpbCB7XHJcblxyXG4gICAgc3RhdGljIHRlc3RMb2dpYyA9ICh0ZXN0QXJyYXkpID0+IHtcclxuICAgICAgICBsZXQgZ2FtZWhvc3QgPSBNYXRoLnJhbmRvbSgpICogNDtcclxuICAgICAgICBsZXQgcm91bmRob3N0ID0gTWF0aC5yYW5kb20oKSAqIDQ7XHJcbiAgICAgICAgZ2FtZWhvc3QgPSBwYXJzZUludChnYW1laG9zdCkgKyAxO1xyXG4gICAgICAgIHJvdW5kaG9zdCA9IHBhcnNlSW50KHJvdW5kaG9zdCkgKyAxO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwib25pb25cIiwgXCLlvZPliY3muLjmiI/kuLtcIiArIGdhbWVob3N0ICsgXCLmnKzova7kuLtcIiArIHJvdW5kaG9zdCk7XHJcbiAgICAgICAgaWYgKHRlc3RBcnJheS5sZW5ndGggPT0gMSkge1xyXG4gICAgICAgICAgICBsZXQgdGVzdFZhbHVlID0gdGVzdEFycmF5WzBdICsgXCJcIjtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJvbmlvblwiLCBcIuW9k+WJjea4uOaIj+S4u1wiICsgdGVzdFZhbHVlLnN1YnN0cmluZygwLCAyKSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib25pb25cIiwgdGhpcy5xdWFyeVBva2VyV2VpZ2h0KHBhcnNlSW50KHRlc3RWYWx1ZS5zdWJzdHJpbmcoMCwgMikpKSk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0ZXN0QXJyYXkubGVuZ3RoID49IDIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJvbmlvblwiLCB0aGlzLmNvbXBhcmVQb2tlcihnYW1laG9zdCwgcm91bmRob3N0LCB0ZXN0QXJyYXlbMF0sIHRlc3RBcnJheVsxXSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOavlOi+g+eJjOeahOWkp+Wwj1xyXG4gICAgICog5pyA5ZCO5LiA5L2N5piv6Iqx6Imy77yM5YmN6Z2i55u05o6l5q+U5aSn5bCPXHJcbiAgICAgKiDop4TliJkgMea4uOaIj+S4uz7ova7mrKHkuLs+5YmvXHJcbiAgICAgKiAgICAgIDIgNT7njos+Mz4yXHJcbiAgICAgKiAgICAgIDMg5ZCM5Li65Ymv54mM77yM6Iqx6Imy5q+U5aSn5bCPXHJcbiAgICAgKiAgICAgIDQgXHJcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlTGVmdCAg5YWI54mMXHJcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlUmlnaHQg5ZCO54mMXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjb21wYXJlUG9rZXIgPSAoZ2FtZWhvc3QsIHJvdW5kaG9zdCwgdmFsdWVMZWZ0LCB2YWx1ZVJpZ2h0KSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJvbmlvblwiLCBcImNvbXBhcmVQb2tlcisrXCIrdHlwZW9mIHZhbHVlTGVmdCApOyBcclxuICAgICAgICAvLyBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZUxlZnQpIHx8IEFycmF5LmlzQXJyYXkodmFsdWVSaWdodCkpIHtcclxuICAgICAgICAvLyAgICAgY29uc29sZS5lcnJvcihcIm9uaW9uXCIsIFwi5pqC5LiN5pSv5oyB5pWw57uEXCIgKyB0eXBlb2YgdmFsdWVMZWZ0ICsgXCIvXCIgKyB0eXBlb2YgdmFsdWVSaWdodCk7XHJcbiAgICAgICAgLy8gICAgIHJldHVybiBMRUZUX1dJTjtcclxuICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgIGlmICh2YWx1ZVJpZ2h0ID09IHZhbHVlTGVmdCkge1xyXG4gICAgICAgICAgICAvL+WujOWFqOebuOWQjO+8jOWFiOeJjOWkp1xyXG4gICAgICAgICAgICByZXR1cm4gTEVGVF9XSU47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhbHVlUmlnaHQgPSB2YWx1ZVJpZ2h0ICsgXCJcIjtcclxuICAgICAgICB2YWx1ZUxlZnQgPSB2YWx1ZUxlZnQgKyBcIlwiO1xyXG4gICAgICAgIC8vMSDliKTmlq3lhYjniYzlkI7niYznmoToirHoibJcclxuICAgICAgICBsZXQgdHlwZUxlZnQgPSB2YWx1ZUxlZnQuc3Vic3RyaW5nKDIpO1xyXG4gICAgICAgIGxldCB0eXBlUmlnaHQgPSB2YWx1ZVJpZ2h0LnN1YnN0cmluZygyKTtcclxuICAgICAgICAvLzLliKTmlq3lhYjniYzlkI7niYzlgLxcclxuICAgICAgICBsZXQgY29udGVudExlZnQgPSB2YWx1ZUxlZnQuc3Vic3RyaW5nKDAsIDIpO1xyXG4gICAgICAgIGxldCBjb250ZW50UmlnaHQgPSB2YWx1ZVJpZ2h0LnN1YnN0cmluZygwLCAyKTtcclxuICAgICAgICAvLzPliKTmlq3niYzmmK/lkKbkuLrkuLsg5rS75Yqo5Li7XHJcbiAgICAgICAgbGV0IGxlZnRJc0hvc3QgPSB0eXBlTGVmdCA9PSBnYW1laG9zdCB8fCB0aGlzLnF1YXJ5SXNIb3N0KGNvbnRlbnRMZWZ0KTtcclxuICAgICAgICBsZXQgcmlnaHRJc0hvc3QgPSB0eXBlTGVmdCA9PSBnYW1laG9zdCB8fCB0aGlzLnF1YXJ5SXNIb3N0KGNvbnRlbnRSaWdodCk7XHJcbiAgICAgICAgLy805q+U6L6DXHJcbiAgICAgICAgaWYgKGxlZnRJc0hvc3QgJiYgcmlnaHRJc0hvc3QpIHtcclxuICAgICAgICAgICAgLy/lkIzkuLrkuLvvvIzkuLs15pyA5aSnXHJcbiAgICAgICAgICAgIGlmIChwYXJzZUludChjb250ZW50TGVmdCkgPT0gNSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIExFRlRfV0lOO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHBhcnNlSW50KGNvbnRlbnRSaWdodCkgPT0gNSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFJJR0hUX1dJTjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8v55u05o6l5q+U5aSn5bCPXHJcbiAgICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0gdGhpcy5jb21wYXJlU2luZ2xlUG9rZXJCaWdnZXIoY29udGVudExlZnQsIGNvbnRlbnRSaWdodCk7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0ICE9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvL+Wkp+Wwj+ebuOWQjO+8jOWtmOWcqOa0u+WKqOS4u+WSjOiKseiJsuS4u+eJjOWAvOebuOWQjOaDheWGtVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlTGVmdCA9PSBnYW1laG9zdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gTEVGVF9XSU47XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlUmlnaHQgPT0gZ2FtZWhvc3QpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJJR0hUX1dJTjtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Ugey8v5ZCM5Li65rS75Yqo5Li7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBMRUZUX1dJTjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChsZWZ0SXNIb3N0KSB7XHJcbiAgICAgICAgICAgIC8v5YWI54mM5piv5Li777yM5YWI54mM5aSnXHJcbiAgICAgICAgICAgIHJldHVybiBMRUZUX1dJTjtcclxuICAgICAgICB9IGVsc2UgaWYgKHJpZ2h0SXNIb3N0KSB7XHJcbiAgICAgICAgICAgIC8v5ZCO54mM5piv5Li777yM5ZCO54mM5aSnXHJcbiAgICAgICAgICAgIHJldHVybiBSSUdIVF9XSU47XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29tcGFyZVZpY2Uocm91bmRob3N0LCB0eXBlTGVmdCwgdHlwZVJpZ2h0LCBjb250ZW50TGVmdCwgY29udGVudFJpZ2h0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDkuI3liKTmlq3oirHoibLvvIznm7TmjqXmr5TlpKflsI8g5Y+q5o6l5Y+X5Lik5L2NIFxyXG4gICAgICog5YWB6K646L+U5ZueMFxyXG4gICAgICogXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjb21wYXJlU2luZ2xlUG9rZXJCaWdnZXIgPSAodmFsdWVMZWZ0LCB2YWx1ZVJpZ2h0KSA9PiB7XHJcbiAgICAgICAgaWYgKHZhbHVlTGVmdC5sZW5ndGggPiAyIHx8IHZhbHVlUmlnaHQubGVuZ3RoID4gMikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwi5Y+q5o6l5Y+X5Lik5L2N55qEXCIgKyB2YWx1ZUxlZnQgKyBcIi9cIiArIHZhbHVlUmlnaHQpO1xyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGxlZnROdW0gPSBwYXJzZUludCh2YWx1ZUxlZnQpO1xyXG4gICAgICAgIGxldCByaWdodE51bSA9IHBhcnNlSW50KHZhbHVlUmlnaHQpO1xyXG4gICAgICAgIGxldCByZXN1bHQ9dGhpcy5xdWFyeVBva2VyV2VpZ2h0KHJpZ2h0TnVtKSAtIHRoaXMucXVhcnlQb2tlcldlaWdodChsZWZ0TnVtKTtcclxuICAgICAgICBpZihyZXN1bHQ+MCl7XHJcbiAgICAgICAgICAgIHJlc3VsdD0gUklHSFRfV0lOO1xyXG4gICAgICAgIH1lbHNlIGlmKHJlc3VsdDwwKXtcclxuICAgICAgICAgICAgcmVzdWx0PUxFRlRfV0lOO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG5cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog5Yik5pat54mM55qE5aSn5bCPXHJcbiAgICAgKiBAcGFyYW0geyp9IHBva2VyIFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcXVhcnlQb2tlcldlaWdodChwb2tlcikge1xyXG4gICAgICAgIHJldHVybiBwb2tlcldlaWdodC5pbmRleE9mKHBva2VyKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog5Yik5pat54mM5piv5LiN5piv5rS75Yqo5Li7IDE1IDMgNeWvueW6lCAyIDMgNVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcXVhcnlJc0hvc3QocG9rZXIpIHtcclxuICAgICAgICBsZXQgdmFsdWUgPSBwYXJzZUludChwb2tlcik7XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlID09IDE1IHx8IHZhbHVlID09IDMgfHwgdmFsdWUgPT0gNTsvLzIgMyA1XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOWIpOaWreWJr+eJjOiwgeWkp1xyXG4gICAgICogQHBhcmFtIHsqfSByb3VuZGhvc3QgXHJcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlTGVmdCBcclxuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWVSaWdodCBcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNvbXBhcmVWaWNlKHJvdW5kaG9zdCwgdHlwZUxlZnQsIHR5cGVSaWdodCwgY29udGVudExlZnQsIGNvbnRlbnRSaWdodCkge1xyXG4gICAgICAgIGlmICh0eXBlUmlnaHQgPT0gdHlwZUxlZnQgPT0gcm91bmRob3N0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbXBhcmVTaW5nbGVQb2tlckJpZ2dlcihjb250ZW50TGVmdCwgY29udGVudFJpZ2h0KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVMZWZ0ID09IHJvdW5kaG9zdCkge1xyXG4gICAgICAgICAgICByZXR1cm4gTEVGVF9XSU47XHJcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlUmlnaHQgPT0gcm91bmRob3N0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBSSUdIVF9XSU47XHJcbiAgICAgICAgfSBlbHNlIHsvL+mDveaYr+WJr+eJjCDkuI3mmK/mnKzova7kuLvvvIzmhI/kuYnkuI3lpKdcclxuICAgICAgICAgICAgcmV0dXJuIExFRlRfV0lOO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGNvbXBhcmVBcnJheT0oZ2FtZWhvc3QsIHJvdW5kaG9zdCwgdmFsdWVMZWZ0LCB2YWx1ZVJpZ2h0KT0+e1xyXG4gICAgICAgIGlmKHZhbHVlTGVmdC5sZW5ndGghPXZhbHVlUmlnaHQubGVuZ3RoKXtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIm9uaW9uXCIsXCLmlbDnu4Tplb/luqbkuI3kuIDoh7RcIik7XHJcbiAgICAgICAgICAgIHJldHVybiBMRUZUX1dJTjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy/kuIDlr7nnm7TmjqXmr5RcclxuICAgICAgICAvL+WkmuWvueWFiOagoemqjOWQiOazleaAp++8jDHmmK/lkKblpJrlr7kgMuaYr+WQpui/nuWvuSAz6Iqx6Imy5LiA6Ie0IDRcclxuXHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOavlOacrOi9ruWkp+Wwj++8jOi/lOWbnui1ouWutiAxMjM06aG65L2NXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjb21wYXJlUm91bmQgPSAocGxheVBva2VycykgPT4ge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZGVzdG9yeUFycmF5ID0oZGVzdG9yeU5vZGUpPT57XHJcbiAgICAgICAgaWYoZGVzdG9yeU5vZGUhPW51bGwpe1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRlc3RvcnlOb2RlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBkZXN0b3J5Tm9kZVtpXS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDpgJrov4fniYzluo/mn6XoirHoibLlpKflsI9cclxuICAgICAqIOacgOWQjuS4gOS9jeaYr+iKseiJslxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcXVhcnlQb2tlclZhbHVlID0gKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgbGV0IGNhcmROdW0gPSB2YWx1ZSArIFwiXCI7XHJcbiAgICAgICAgaWYgKGNhcmROdW0gPT0gXCIxNzFcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gXCLlpKfnjotcIjtcclxuICAgICAgICB9IGVsc2UgaWYgKGNhcmROdW0gPT0gXCIxNjFcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gXCLlsI/njotcIlxyXG4gICAgICAgIH0gZWxzZSBpZiAoY2FyZE51bSA9PSBcIjE4MVwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIuWNoeiDjFwiXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IGNvbXBhcmUgPSBjYXJkTnVtLnN1YnN0cmluZygwLCAyKTtcclxuICAgICAgICAgICAgbGV0IHR5cGUgPSBjYXJkTnVtLnN1YnN0cmluZygyKTtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IFwiXCI7XHJcbiAgICAgICAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIjFcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBcIuaWueWdl1wiO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIjJcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBcIuaiheiKsVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIjNcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBcIue6ouahg1wiO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIjRcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBcIum7keahg1wiO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3dpdGNoIChjb21wYXJlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiMDNcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHQgKyBcIjNcIjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCIwNFwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdCArIFwiNFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiMDVcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHQgKyBcIjVcIjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCIwNlwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdCArIFwiNlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIjA3XCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgXCI3XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiMDhcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHQgKyBcIjhcIjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCIwOVwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdCArIFwiOVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIjEwXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgXCIxMFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIjExXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgXCJKXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiMTJcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHQgKyBcIlFcIjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCIxM1wiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdCArIFwiS1wiO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIjE0XCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgXCJBXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiMTVcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHQgKyBcIjJcIjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iXX0=
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
