
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
    var pokerArray = this.cardArray.slice(0);
    var host = parseInt(Math.random() * 4);

    for (var i = 0; i < 4; i++) {
      var playerPokerArray = [];

      for (var j = 0; j < 27; j++) {
        var pokerNum = Math.random() * pokerArray.length;
        pokerNum = parseInt(pokerNum);
        var value = pokerArray.splice(pokerNum, 1);
        playerPokerArray.push(value);

        if (i == host && j == 26) {
          //随机方的最后一张牌做主
          this.gameHost = PokerUtil.quaryPokerTypeValue(value);
          this.appendLog("本轮游戏主" + PokerUtil.quaryType(this.gameHost) + ",主牌" + PokerUtil.quaryPokerValue(value) + "在" + this.expandPlayer(i));
        }
      }

      this.pokerPlayer.push(playerPokerArray);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcR2FtZS5qcyJdLCJuYW1lcyI6WyJQb2tlclV0aWwiLCJyZXF1aXJlIiwiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJzdGFyUHJlZmFiIiwidHlwZSIsIlByZWZhYiIsImNhcmRQcmVmYWIiLCJtYXhTdGFyRHVyYXRpb24iLCJtaW5TdGFyRHVyYXRpb24iLCJjdXJyZW50Q2FyZFBvc2l0aW9uIiwic3RhcnRDYXJkUG9zdGlvbiIsImNhcmRXaWR0aCIsImNhcmRBcnJheSIsIlN0cmluZyIsInBva2VyUGxheWVyIiwicm91bmRQb2tlciIsInBsYXllckNvbnRyb2xOb2RlQXJyYXkiLCJyZWZyZXNoQnV0dG9uIiwiQnV0dG9uIiwic2VuZEJ1dHRvbiIsImN1cnJlbnRXaW5uZXIiLCJnYW1lSG9zdCIsImxheW91dENvbnRhaW5lciIsIkxheW91dCIsImxheW91dEJvdHRvbSIsImxheW91dFRvcCIsImxheW91dExlZnQiLCJsYXlvdXRSaWdodCIsImxvZ0xhYmVsIiwiTGFiZWwiLCJwbGF5TG9nIiwiZ3JvdW5kIiwiTm9kZSIsInBsYXllciIsInNjb3JlRGlzcGxheSIsInNjb3JlQXVkaW8iLCJBdWRpb0NsaXAiLCJvbkxvYWQiLCJncm91bmRZIiwieSIsImhlaWdodCIsInRpbWVyIiwic3RhckR1cmF0aW9uIiwiaSIsInByZSIsImoiLCJzdHIiLCJwdXNoIiwibm9kZSIsIm9uIiwicmVmcmVzaENhbGxiYWNrIiwic2VuZENhbGxiYWNrIiwicHVibGlzaFBva2VycyIsInNjb3JlIiwiYnV0dG9uIiwidGVzdEFycmF5IiwiZGVzdG9yeUFycmF5IiwibGVuZ3RoIiwiZ2V0Q29tcG9uZW50IiwiaXNDaGVjayIsImNvbnNvbGUiLCJsb2ciLCJxdWFyeVBva2VyVmFsdWUiLCJwaWNOdW0iLCJzYXZlUm91bmRQb2tlciIsImRlc3Ryb3kiLCJzcGxpY2UiLCJ0ZXN0TG9naWMiLCJhcHBlbmRMb2ciLCJpbmRleCIsIm9mZnNldCIsIm5ld1N0YXIiLCJpbnN0YW50aWF0ZSIsInNjYWxlWCIsInNjYWxlWSIsImFkZENoaWxkIiwic3Bhd25OZXdTdGFyIiwic2V0UG9zaXRpb24iLCJnZXROZXdTdGFyUG9zaXRpb24iLCJnYW1lIiwiTWF0aCIsInJhbmRvbSIsInNwYXduQm90dG9tQ2FyZCIsImRlc3RvcnlOb2RlIiwiY3JlYXRlQm90dG9tQ2FyZCIsInN0YXJ0UG9zaXRpb24iLCJyYW5kWCIsInJhbmRZIiwianVtcEhlaWdodCIsIm1heFgiLCJ3aWR0aCIsInYyIiwiZ2V0Q2FyZEJvdHRvbVBvc2l0aW9uIiwidXBkYXRlIiwiZHQiLCJnYWluU2NvcmUiLCJzdHJpbmciLCJhdWRpb0VuZ2luZSIsInBsYXlFZmZlY3QiLCJnYW1lT3ZlciIsInN0b3BBbGxBY3Rpb25zIiwiZGlyZWN0b3IiLCJsb2FkU2NlbmUiLCJwb2tlckFycmF5Iiwic2xpY2UiLCJob3N0IiwicGFyc2VJbnQiLCJwbGF5ZXJQb2tlckFycmF5IiwicG9rZXJOdW0iLCJ2YWx1ZSIsInF1YXJ5UG9rZXJUeXBlVmFsdWUiLCJxdWFyeVR5cGUiLCJleHBhbmRQbGF5ZXIiLCJsb2NhdGlvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQyxJQUFJQSxTQUFTLEdBQUdDLE9BQU8sQ0FBQyxXQUFELENBQXZCOztBQUNEQyxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNMLGFBQVNELEVBQUUsQ0FBQ0UsU0FEUDtBQUdMQyxFQUFBQSxVQUFVLEVBQUU7QUFDUjtBQUNBQyxJQUFBQSxVQUFVLEVBQUU7QUFDUixpQkFBUyxJQUREO0FBRVJDLE1BQUFBLElBQUksRUFBRUwsRUFBRSxDQUFDTTtBQUZELEtBRko7QUFNUkMsSUFBQUEsVUFBVSxFQUFFO0FBQ1IsaUJBQVMsSUFERDtBQUVSRixNQUFBQSxJQUFJLEVBQUVMLEVBQUUsQ0FBQ007QUFGRCxLQU5KO0FBVVI7QUFDQUUsSUFBQUEsZUFBZSxFQUFFLENBWFQ7QUFZUkMsSUFBQUEsZUFBZSxFQUFFLENBWlQ7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LENBQUNrSCxTQUFWLENBQW9CLEtBQUsxRixRQUF6QixDQUFSLEdBQ2QsS0FEYyxHQUNSeEIsU0FBUyxDQUFDaUUsZUFBVixDQUEwQitDLEtBQTFCLENBRFEsR0FDeUIsR0FEekIsR0FDNkIsS0FBS0csWUFBTCxDQUFrQnJFLENBQWxCLENBRDVDO0FBRUg7QUFDSjs7QUFDRCxXQUFLN0IsV0FBTCxDQUFpQmlDLElBQWpCLENBQXNCNEQsZ0JBQXRCO0FBQ0g7O0FBQ0QsU0FBS3pCLGVBQUw7QUFFSCxHQTFSSTtBQTJSTDhCLEVBQUFBLFlBQVksRUFBQyxzQkFBU0MsUUFBVCxFQUFrQjtBQUMzQixZQUFPQSxRQUFQO0FBQ0ksV0FBSyxDQUFMO0FBQU8sZUFBTyxJQUFQOztBQUNQLFdBQUssQ0FBTDtBQUFPLGVBQU8sSUFBUDs7QUFDUCxXQUFLLENBQUw7QUFBTyxlQUFPLElBQVA7O0FBQ1AsV0FBSyxDQUFMO0FBQU8sZUFBTyxJQUFQO0FBSlg7QUFPSCxHQW5TSTtBQW9TTDdDLEVBQUFBLFNBQVMsRUFBQyxtQkFBUzRCLE1BQVQsRUFBZ0I7QUFDdEIsU0FBS2xFLE9BQUwsR0FBYSxLQUFLQSxPQUFMLEdBQWEsSUFBYixHQUFrQmtFLE1BQS9CO0FBQ0EsU0FBS3BFLFFBQUwsQ0FBY29FLE1BQWQsR0FBcUIsS0FBS2xFLE9BQTFCO0FBQ0g7QUF2U0ksQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiXG4gbGV0IFBva2VyVXRpbCA9IHJlcXVpcmUoXCJQb2tlclV0aWxcIik7XG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyDov5nkuKrlsZ7mgKflvJXnlKjkuobmmJ/mmJ/pooTliLbotYTmupBcbiAgICAgICAgc3RhclByZWZhYjoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYlxuICAgICAgICB9LFxuICAgICAgICBjYXJkUHJlZmFiOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiXG4gICAgICAgIH0sXG4gICAgICAgIC8vIOaYn+aYn+S6p+eUn+WQjua2iOWkseaXtumXtOeahOmaj+acuuiMg+WbtFxuICAgICAgICBtYXhTdGFyRHVyYXRpb246IDAsXG4gICAgICAgIG1pblN0YXJEdXJhdGlvbjogMCxcbiAgICAgICAgY3VycmVudENhcmRQb3NpdGlvbjogMCxcbiAgICAgICAgc3RhcnRDYXJkUG9zdGlvbjogMCxcbiAgICAgICAgY2FyZFdpZHRoOiA4MCxcbiAgICAgICAgXG4gICAgICAgIGNhcmRBcnJheTogW2NjLlN0cmluZ10sXG4gICAgICAgIC8v5Yid5aeL54mM5pWw57uEIOmAhuaXtumSiCDkuLvop5LmmK/nrKzkuIDkuKrmlbDnu4RcbiAgICAgICAgcG9rZXJQbGF5ZXI6IFtdLFxuICAgICAgICAvL+W9k+WJjei9ruasoeWHuueJjOiKgueCuSxcbiAgICAgICAgcm91bmRQb2tlcjogW10sXG4gICAgICAgIC8v5Li76KeS5b2T5YmN54mM6IqC54K5XG4gICAgICAgIHBsYXllckNvbnRyb2xOb2RlQXJyYXk6IFtdLFxuICAgICAgICAvL+a0l+eJjFxuICAgICAgICByZWZyZXNoQnV0dG9uOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuQnV0dG9uXG4gICAgICAgIH0sXG4gICAgICAgIC8v5Ye654mMXG4gICAgICAgIHNlbmRCdXR0b246IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5CdXR0b25cbiAgICAgICAgfSxcblxuICAgICAgICAvL+W9k+WJjeiDnOaWuVxuICAgICAgICBjdXJyZW50V2lubmVyOjEsXG4gICAgICAgIC8v5pys6L2u5Li7XG4gICAgICAgIGdhbWVIb3N0OlwiMVwiLFxuICAgICAgICAvL+eOqeWutuaLpeacieeJjFxuICAgICAgICBsYXlvdXRDb250YWluZXI6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5MYXlvdXRcbiAgICAgICAgfSxcbiAgICAgICAgLy/njqnlrrblh7rnmoTniYwgXG4gICAgICAgIGxheW91dEJvdHRvbTp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLkxheW91dFxuICAgICAgICB9LFxuICAgICAgICAvL+WvueWutuWHuueJjCDnrKzkuInkvY1cbiAgICAgICAgbGF5b3V0VG9wOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuTGF5b3V0XG4gICAgICAgIH0sXG4gICAgICAgIC8v5LiL5a625Ye654mMIOW3puaJi+esrOS6jOS9jVxuICAgICAgICBsYXlvdXRMZWZ0OntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuTGF5b3V0XG4gICAgICAgIH0sXG4gICAgICAgICAvL+S4iuWutuWHuueJjO+8jOWPs+aJi+esrOWbm+S9jVxuICAgICAgICBsYXlvdXRSaWdodDp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLkxheW91dFxuICAgICAgICB9LFxuICAgICAgICAvL+aImOaKpVxuICAgICAgICBsb2dMYWJlbDp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLkxhYmVsXG4gICAgICAgIH0sXG4gICAgICAgIHBsYXlMb2c6XCLmuLjmiI/lvIDlp4tcIixcbiAgICAgICAgLy8g5Zyw6Z2i6IqC54K577yM55So5LqO56Gu5a6a5pif5pif55Sf5oiQ55qE6auY5bqmXG4gICAgICAgIGdyb3VuZDoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfSxcbiAgICAgICAgLy8gcGxheWVyIOiKgueCue+8jOeUqOS6juiOt+WPluS4u+inkuW8uei3s+eahOmrmOW6pu+8jOWSjOaOp+WItuS4u+inkuihjOWKqOW8gOWFs1xuICAgICAgICBwbGF5ZXI6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH0sXG4gICAgICAgIC8vIHNjb3JlIGxhYmVsIOeahOW8leeUqFxuICAgICAgICBzY29yZURpc3BsYXk6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxuICAgICAgICB9LFxuICAgICAgICAvLyDlvpfliIbpn7PmlYjotYTmupBcbiAgICAgICAgc2NvcmVBdWRpbzoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9LFxuICAgIH0sXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8g6I635Y+W5Zyw5bmz6Z2i55qEIHkg6L205Z2Q5qCHXG4gICAgICAgIHRoaXMuZ3JvdW5kWSA9IHRoaXMuZ3JvdW5kLnkgKyB0aGlzLmdyb3VuZC5oZWlnaHQgLyAyO1xuICAgICAgICAvLyDliJ3lp4vljJborqHml7blmahcbiAgICAgICAgdGhpcy50aW1lciA9IDA7XG4gICAgICAgIHRoaXMuc3RhckR1cmF0aW9uID0gMDtcbiAgICAgICAgLy/liJvlu7rlm77niYfotYTmupBcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMzsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcHJlID0gMyArIGk7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMTsgaiA8IDU7IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBzdHIgPSBcIlwiO1xuICAgICAgICAgICAgICAgIGlmIChwcmUgPCAxMCkge1xuICAgICAgICAgICAgICAgICAgICBzdHIgPSBcIjBcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc3RyID0gc3RyICsgcHJlICsgajtcbiAgICAgICAgICAgICAgICB0aGlzLmNhcmRBcnJheS5wdXNoKHN0cik7XG4gICAgICAgICAgICAgICAgdGhpcy5jYXJkQXJyYXkucHVzaChzdHIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2FyZEFycmF5LnB1c2goXCIxNjFcIik7XG4gICAgICAgIHRoaXMuY2FyZEFycmF5LnB1c2goXCIxNjFcIik7XG4gICAgICAgIHRoaXMuY2FyZEFycmF5LnB1c2goXCIxNzFcIik7XG4gICAgICAgIHRoaXMuY2FyZEFycmF5LnB1c2goXCIxNzFcIik7XG5cblxuICAgICAgICB0aGlzLnJlZnJlc2hCdXR0b24ubm9kZS5vbignY2xpY2snLCB0aGlzLnJlZnJlc2hDYWxsYmFjaywgdGhpcyk7XG4gICAgICAgIHRoaXMuc2VuZEJ1dHRvbi5ub2RlLm9uKCdjbGljaycsIHRoaXMuc2VuZENhbGxiYWNrLCB0aGlzKTtcbiAgICAgICAgdGhpcy5wdWJsaXNoUG9rZXJzKCk7XG4gICAgICAgIC8vIHRoaXMuc3Bhd25OZXdTdGFyKCk7XG4gICAgICAgIC8vIOWIneWni+WMluiuoeWIhlxuICAgICAgICB0aGlzLnNjb3JlID0gMDtcbiAgICB9LFxuICAgIHJlZnJlc2hDYWxsYmFjazogZnVuY3Rpb24gKGJ1dHRvbikge1xuICAgICAgICB0aGlzLnB1Ymxpc2hQb2tlcnMoKTtcbiAgICB9LFxuICAgIHNlbmRDYWxsYmFjazogZnVuY3Rpb24gKGJ1dHRvbikge1xuICAgICAgICBsZXQgdGVzdEFycmF5PVtdO1xuICAgICAgICBQb2tlclV0aWwuZGVzdG9yeUFycmF5KHRoaXMucm91bmRQb2tlcik7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJDb250cm9sTm9kZUFycmF5Lmxlbmd0aDspIHtcbiAgICAgICAgICAgIC8v5Yik5pat5piv5ZCm5Y+v5Ye6XG4gICAgICAgICAgICBsZXQgbm9kZSA9IHRoaXMucGxheWVyQ29udHJvbE5vZGVBcnJheVtpXS5nZXRDb21wb25lbnQoJ0NhcmQnKTtcbiAgICAgICAgICAgIGlmIChub2RlLmlzQ2hlY2spIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm9uaW9uIOmAieS4rVwiICsgUG9rZXJVdGlsLnF1YXJ5UG9rZXJWYWx1ZShub2RlLnBpY051bSkpO1xuICAgICAgICAgICAgICAgIHRlc3RBcnJheS5wdXNoKG5vZGUucGljTnVtKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNhdmVSb3VuZFBva2VyKG5vZGUucGljTnVtLCAxLCBpICogdGhpcy5jYXJkV2lkdGgpO1xuICAgICAgICAgICAgICAgIHRoaXMucGxheWVyQ29udHJvbE5vZGVBcnJheVtpXS5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXJDb250cm9sTm9kZUFycmF5LnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdGhpcy5wbGF5ZXJDb250cm9sTm9kZUFycmF5W2ldLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgICAgICAgUG9rZXJVdGlsLnRlc3RMb2dpYyh0ZXN0QXJyYXkpO1xuICAgICAgICAgdGhpcy5hcHBlbmRMb2coXCLov73liqDniYzlhoXlrrlcIik7XG4gICAgfSxcbiAgICAvL+S/neWtmOWHuueJjCAgMSAyIDMgNCDpobrml7bpkojkvY1cbiAgICBzYXZlUm91bmRQb2tlcjogZnVuY3Rpb24gKHBpY051bSwgaW5kZXgsIG9mZnNldCkge1xuICAgICAgICB2YXIgbmV3U3RhciA9IGNjLmluc3RhbnRpYXRlKHRoaXMuY2FyZFByZWZhYik7XG4gICAgICAgIC8vIG5ld1N0YXIuc2V0UGljTnVtKFwiaVwiK2kpO1xuICAgICAgICBuZXdTdGFyLmdldENvbXBvbmVudCgnQ2FyZCcpLnBpY051bSA9IHBpY051bTtcbiAgICAgICAgbmV3U3Rhci5zY2FsZVggPSAwLjU7XG4gICAgICAgIG5ld1N0YXIuc2NhbGVZID0gMC41O1xuICAgICAgICB0aGlzLnJvdW5kUG9rZXIucHVzaChuZXdTdGFyKTtcbiAgICAgICAgLy8gdGhpcy5ub2RlLmFkZENoaWxkKG5ld1N0YXIpO1xuICAgICAgICAvLyBsZXQgaGVpZ2h0ID0gdGhpcy5ncm91bmQuaGVpZ2h0IC8gMiAqIC0xO1xuICAgICAgICBpZiAoaW5kZXggPT09IDEpIHtcbiAgICAgICAgICAgIC8vIGhlaWdodCA9IGhlaWdodCArIDEwMDtcbiAgICAgICAgICAgIHRoaXMubGF5b3V0Qm90dG9tLm5vZGUuYWRkQ2hpbGQobmV3U3Rhcik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gbmV3U3Rhci5zZXRQb3NpdGlvbihjYy52MigtMTUwICsgdGhpcy5zdGFydENhcmRQb3N0aW9uICsgb2Zmc2V0LCBoZWlnaHQpKTtcbiAgICB9LFxuICAgIHNwYXduTmV3U3RhcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyDkvb/nlKjnu5nlrprnmoTmqKHmnb/lnKjlnLrmma/kuK3nlJ/miJDkuIDkuKrmlrDoioLngrlcbiAgICAgICAgdmFyIG5ld1N0YXIgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnN0YXJQcmVmYWIpO1xuICAgICAgICAvLyDlsIbmlrDlop7nmoToioLngrnmt7vliqDliLAgQ2FudmFzIOiKgueCueS4i+mdolxuICAgICAgICB0aGlzLm5vZGUuYWRkQ2hpbGQobmV3U3Rhcik7XG4gICAgICAgIC8vIOS4uuaYn+aYn+iuvue9ruS4gOS4qumaj+acuuS9jee9rlxuICAgICAgICBuZXdTdGFyLnNldFBvc2l0aW9uKHRoaXMuZ2V0TmV3U3RhclBvc2l0aW9uKCkpO1xuICAgICAgICAvLyDlnKjmmJ/mmJ/nu4Tku7bkuIrmmoLlrZggR2FtZSDlr7nosaHnmoTlvJXnlKhcbiAgICAgICAgbmV3U3Rhci5nZXRDb21wb25lbnQoJ1N0YXInKS5nYW1lID0gdGhpcztcbiAgICAgICAgLy8g6YeN572u6K6h5pe25Zmo77yM5qC55o2u5raI5aSx5pe26Ze06IyD5Zu06ZqP5py65Y+W5LiA5Liq5YC8XG4gICAgICAgIHRoaXMuc3RhckR1cmF0aW9uID0gdGhpcy5taW5TdGFyRHVyYXRpb24gKyBNYXRoLnJhbmRvbSgpICogKHRoaXMubWF4U3RhckR1cmF0aW9uIC0gdGhpcy5taW5TdGFyRHVyYXRpb24pO1xuICAgICAgICB0aGlzLnRpbWVyID0gMDtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIOenu+mZpOaXp+eahOiKgueCuVxuICAgICAqIOa3u+WKoOaWsOiKgueCuVxuICAgICAqL1xuICAgIHNwYXduQm90dG9tQ2FyZDogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5wbGF5ZXJDb250cm9sTm9kZUFycmF5Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGxldCBkZXN0b3J5Tm9kZSA9IHRoaXMucGxheWVyQ29udHJvbE5vZGVBcnJheTtcbiAgICAgICAgICAgIFBva2VyVXRpbC5kZXN0b3J5QXJyYXkoZGVzdG9yeU5vZGUpO1xuICAgICAgICAgICAgdGhpcy5wbGF5ZXJDb250cm9sTm9kZUFycmF5ID0gW107XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coXCJzcGF3bkJvdHRvbUNhcmQgXCIgKyB0aGlzLnBva2VyUGxheWVyWzBdLmxlbmd0aCk7XG4gICAgICAgIHRoaXMuY3JlYXRlQm90dG9tQ2FyZCgpXG5cbiAgICB9LFxuXG4gICAgY3JlYXRlQm90dG9tQ2FyZDogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIGxldCBzdGFydFBvc2l0aW9uID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBva2VyUGxheWVyWzBdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAvLyDkvb/nlKjnu5nlrprnmoTmqKHmnb/lnKjlnLrmma/kuK3nlJ/miJDkuIDkuKrmlrDoioLngrlcbiAgICAgICAgICAgIHZhciBuZXdTdGFyID0gY2MuaW5zdGFudGlhdGUodGhpcy5jYXJkUHJlZmFiKTtcbiAgICAgICAgICAgIC8vIG5ld1N0YXIuc2V0UGljTnVtKFwiaVwiK2kpO1xuICAgICAgICAgICAgbmV3U3Rhci5nZXRDb21wb25lbnQoJ0NhcmQnKS5waWNOdW0gPSB0aGlzLnBva2VyUGxheWVyWzBdW2ldO1xuICAgICAgICAgICAgdGhpcy5wbGF5ZXJDb250cm9sTm9kZUFycmF5LnB1c2gobmV3U3Rhcik7XG4gICAgICAgICAgICAvLyB0aGlzLm5vZGUuYWRkQ2hpbGQobmV3U3Rhcik7XG4gICAgICAgICAgICB0aGlzLmxheW91dENvbnRhaW5lci5ub2RlLmFkZENoaWxkKG5ld1N0YXIpO1xuICAgICAgICAgICAgbGV0IGhlaWdodCA9IHRoaXMuZ3JvdW5kLmhlaWdodCAvIDIgKiAtMTtcbiAgICAgICAgICAgIHN0YXJ0UG9zaXRpb24gPSBpICogdGhpcy5jYXJkV2lkdGg7XG4gICAgICAgICAgICBpZiAoaSA+IDEzKSB7XG4gICAgICAgICAgICAgICAgaGVpZ2h0ID0gaGVpZ2h0IC0gMTUwXG4gICAgICAgICAgICAgICAgc3RhcnRQb3NpdGlvbiA9IChpIC0gMTMpICogdGhpcy5jYXJkV2lkdGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBuZXdTdGFyLnNldFBvc2l0aW9uKGNjLnYyKC0yMDAgKyB0aGlzLnN0YXJ0Q2FyZFBvc3Rpb24gKyBzdGFydFBvc2l0aW9uLCBoZWlnaHQpKTtcbiAgICAgICAgfVxuICAgIH0sXG5cblxuICAgIGdldE5ld1N0YXJQb3NpdGlvbjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcmFuZFggPSAwO1xuICAgICAgICAvLyDmoLnmja7lnLDlubPpnaLkvY3nva7lkozkuLvop5Lot7Pot4Ppq5jluqbvvIzpmo/mnLrlvpfliLDkuIDkuKrmmJ/mmJ/nmoQgeSDlnZDmoIdcbiAgICAgICAgdmFyIHJhbmRZID0gdGhpcy5ncm91bmRZICsgTWF0aC5yYW5kb20oKSAqIHRoaXMucGxheWVyLmdldENvbXBvbmVudCgnUGxheWVyJykuanVtcEhlaWdodCArIDUwO1xuICAgICAgICAvLyDmoLnmja7lsY/luZXlrr3luqbvvIzpmo/mnLrlvpfliLDkuIDkuKrmmJ/mmJ8geCDlnZDmoIdcbiAgICAgICAgdmFyIG1heFggPSB0aGlzLm5vZGUud2lkdGggLyAyO1xuICAgICAgICByYW5kWCA9IChNYXRoLnJhbmRvbSgpIC0gMC41KSAqIDIgKiBtYXhYO1xuICAgICAgICAvLyDov5Tlm57mmJ/mmJ/lnZDmoIdcbiAgICAgICAgcmV0dXJuIGNjLnYyKHJhbmRYLCByYW5kWSk7XG4gICAgfSxcbiAgICBnZXRDYXJkQm90dG9tUG9zaXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHJhbmRYID0gdGhpcy5jdXJyZW50Q2FyZFBvc2l0aW9uO1xuICAgICAgICB2YXIgcmFuZFkgPSAwO1xuICAgICAgICB0aGlzLmN1cnJlbnRDYXJkUG9zaXRpb24gPSB0aGlzLmN1cnJlbnRDYXJkUG9zaXRpb24gKyB0aGlzLmNhcmRXaWR0aDtcbiAgICAgICAgcmV0dXJuIGNjLnYyKHJhbmRYLCByYW5kWSk7XG4gICAgfSxcblxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG4gICAgICAgIC8vIOavj+W4p+abtOaWsOiuoeaXtuWZqO+8jOi2hei/h+mZkOW6pui/mOayoeacieeUn+aIkOaWsOeahOaYn+aYn1xuICAgICAgICAvLyDlsLHkvJrosIPnlKjmuLjmiI/lpLHotKXpgLvovpFcbiAgICAgICAgLy8gaWYgKHRoaXMudGltZXIgPiB0aGlzLnN0YXJEdXJhdGlvbikge1xuICAgICAgICAvLyAgICAgdGhpcy5nYW1lT3ZlcigpO1xuICAgICAgICAvLyAgICAgdGhpcy5lbmFibGVkID0gZmFsc2U7ICAgLy8gZGlzYWJsZSBnYW1lT3ZlciBsb2dpYyB0byBhdm9pZCBsb2FkIHNjZW5lIHJlcGVhdGVkbHlcbiAgICAgICAgLy8gICAgIHJldHVybjtcbiAgICAgICAgLy8gfVxuICAgICAgICAvLyB0aGlzLnRpbWVyICs9IGR0O1xuICAgIH0sXG5cbiAgICBnYWluU2NvcmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5zY29yZSArPSAxO1xuICAgICAgICAvLyDmm7TmlrAgc2NvcmVEaXNwbGF5IExhYmVsIOeahOaWh+Wtl1xuICAgICAgICB0aGlzLnNjb3JlRGlzcGxheS5zdHJpbmcgPSAnU2NvcmU6ICcgKyB0aGlzLnNjb3JlO1xuICAgICAgICAvLyDmkq3mlL7lvpfliIbpn7PmlYhcbiAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheUVmZmVjdCh0aGlzLnNjb3JlQXVkaW8sIGZhbHNlKTtcbiAgICB9LFxuXG4gICAgZ2FtZU92ZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5wbGF5ZXIuc3RvcEFsbEFjdGlvbnMoKTsgLy/lgZzmraIgcGxheWVyIOiKgueCueeahOi3s+i3g+WKqOS9nFxuICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoJ2dhbWUnKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgKiDmiorniYzlj5Hnu5nlm5vlrrZcbiAgICAqL1xuICAgIHB1Ymxpc2hQb2tlcnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5wb2tlclBsYXllciA9IFtdO1xuICAgICAgICBsZXQgcG9rZXJBcnJheSA9IHRoaXMuY2FyZEFycmF5LnNsaWNlKDApO1xuICAgICAgICBsZXQgaG9zdD1wYXJzZUludChNYXRoLnJhbmRvbSgpICogNCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcGxheWVyUG9rZXJBcnJheSA9IFtdO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAyNzsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHBva2VyTnVtID0gTWF0aC5yYW5kb20oKSAqIHBva2VyQXJyYXkubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHBva2VyTnVtID0gcGFyc2VJbnQocG9rZXJOdW0pO1xuICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IHBva2VyQXJyYXkuc3BsaWNlKHBva2VyTnVtLCAxKTtcbiAgICAgICAgICAgICAgICBwbGF5ZXJQb2tlckFycmF5LnB1c2godmFsdWUpO1xuICAgICAgICAgICAgICAgIGlmKGk9PWhvc3QmJmo9PTI2KXtcbiAgICAgICAgICAgICAgICAgICAgLy/pmo/mnLrmlrnnmoTmnIDlkI7kuIDlvKDniYzlgZrkuLtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lSG9zdD0gUG9rZXJVdGlsLnF1YXJ5UG9rZXJUeXBlVmFsdWUodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcGVuZExvZyhcIuacrOi9rua4uOaIj+S4u1wiK1Bva2VyVXRpbC5xdWFyeVR5cGUodGhpcy5nYW1lSG9zdClcbiAgICAgICAgICAgICAgICAgICAgK1wiLOS4u+eJjFwiK1Bva2VyVXRpbC5xdWFyeVBva2VyVmFsdWUodmFsdWUpK1wi5ZyoXCIrdGhpcy5leHBhbmRQbGF5ZXIoaSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucG9rZXJQbGF5ZXIucHVzaChwbGF5ZXJQb2tlckFycmF5KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNwYXduQm90dG9tQ2FyZCgpO1xuXG4gICAgfSxcbiAgICBleHBhbmRQbGF5ZXI6ZnVuY3Rpb24obG9jYXRpb24pe1xuICAgICAgICBzd2l0Y2gobG9jYXRpb24pe1xuICAgICAgICAgICAgY2FzZSAwOnJldHVybiBcIuiHquW3sVwiXG4gICAgICAgICAgICBjYXNlIDE6cmV0dXJuIFwi5LiL5a62XCJcbiAgICAgICAgICAgIGNhc2UgMjpyZXR1cm4gXCLlr7nlrrZcIlxuICAgICAgICAgICAgY2FzZSAzOnJldHVybiBcIuS4iuWutlwiICAgXG4gICAgICAgIH1cblxuICAgIH0sXG4gICAgYXBwZW5kTG9nOmZ1bmN0aW9uKHN0cmluZyl7XG4gICAgICAgIHRoaXMucGxheUxvZz10aGlzLnBsYXlMb2crXCJcXG5cIitzdHJpbmc7XG4gICAgICAgIHRoaXMubG9nTGFiZWwuc3RyaW5nPXRoaXMucGxheUxvZztcbiAgICB9XG4gICAgXG4gICAgXG5cblxuXG59KTtcbiJdfQ==
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
  }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcUG9rZXJVdGlsLmpzIl0sIm5hbWVzIjpbInBva2VyV2VpZ2h0IiwiTEVGVF9XSU4iLCJSSUdIVF9XSU4iLCJQb2tlclV0aWwiLCJxdWFyeVBva2VyV2VpZ2h0IiwicG9rZXIiLCJpbmRleE9mIiwicXVhcnlJc0hvc3QiLCJ2YWx1ZSIsInBhcnNlSW50IiwiY29tcGFyZVZpY2UiLCJyb3VuZGhvc3QiLCJ0eXBlTGVmdCIsInR5cGVSaWdodCIsImNvbnRlbnRMZWZ0IiwiY29udGVudFJpZ2h0IiwiY29tcGFyZVNpbmdsZVBva2VyQmlnZ2VyIiwidGVzdExvZ2ljIiwidGVzdEFycmF5IiwiZ2FtZWhvc3QiLCJNYXRoIiwicmFuZG9tIiwiY29uc29sZSIsImxvZyIsImxlbmd0aCIsInRlc3RWYWx1ZSIsInN1YnN0cmluZyIsImNvbXBhcmVQb2tlciIsInRlc3RBcnJheUxvZ2ljIiwidGVzdEFycmF5MSIsInRlc3RBcnJheTIiLCJ2YWx1ZUxlZnQiLCJ2YWx1ZVJpZ2h0IiwicXVhcnlQb2tlclZhbHVlIiwiQXJyYXkiLCJpc0FycmF5IiwiZXJyb3IiLCJjb21wYXJlQXJyYXkiLCJsZWZ0SXNIb3N0IiwicmlnaHRJc0hvc3QiLCJyZXN1bHQiLCJsZWZ0TnVtIiwicmlnaHROdW0iLCJhcnJheUxlZnQiLCJzb3J0IiwiYXJyYXlSaWdodCIsInJlc3VsdExlZnQiLCJjaGVja0FycmF5VmFsdWUiLCJyZXN1bHRSaWdodCIsImFycmF5Iiwib2RkIiwiZXZlbiIsImxhc3RUeXBlIiwiaW5kZXgiLCJjYXJkTnVtIiwidHlwZSIsInN0ciIsInF1YXJ5VHlwZSIsImNvbXBhcmUiLCJjb21wYXJlUm91bmQiLCJwbGF5UG9rZXJzIiwiZGVzdG9yeUFycmF5IiwiZGVzdG9yeU5vZGUiLCJpIiwiZGVzdHJveSIsInF1YXJ5UG9rZXJUeXBlVmFsdWUiLCJwb2tlclZhbHVlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEs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O0FBQ0lBLFFBQUFBLE1BQU0sR0FBR0EsTUFBTSxHQUFHLEdBQWxCO0FBQ0E7O0FBQ0osV0FBSyxJQUFMO0FBQ0lBLFFBQUFBLE1BQU0sR0FBR0EsTUFBTSxHQUFHLEdBQWxCO0FBQ0E7O0FBQ0osV0FBSyxJQUFMO0FBQ0lBLFFBQUFBLE1BQU0sR0FBR0EsTUFBTSxHQUFHLEdBQWxCO0FBQ0E7QUF2Q1I7O0FBeUNBLFdBQU9BLE1BQVA7QUFDSDtBQUNKIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgcG9rZXJXZWlnaHQgPSBbNCwgNiwgNywgOCwgOSwgMTAsIDExLCAxMiwgMTMsIDE0LCAxNSwgMywgNSwgMTYsIDE3LCAxOF07Ly/kuLs15Li6MThcclxubGV0IExFRlRfV0lOID0gLTE7XHJcbmxldCBSSUdIVF9XSU4gPSAxO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQb2tlclV0aWwge1xyXG5cclxuICAgIHN0YXRpYyB0ZXN0TG9naWMgPSAodGVzdEFycmF5KSA9PiB7XHJcbiAgICAgICAgbGV0IGdhbWVob3N0ID0gTWF0aC5yYW5kb20oKSAqIDQ7XHJcbiAgICAgICAgbGV0IHJvdW5kaG9zdCA9IE1hdGgucmFuZG9tKCkgKiA0O1xyXG4gICAgICAgIGdhbWVob3N0ID0gcGFyc2VJbnQoZ2FtZWhvc3QpICsgMTtcclxuICAgICAgICByb3VuZGhvc3QgPSBwYXJzZUludChyb3VuZGhvc3QpICsgMTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIm9uaW9uXCIsIFwi5b2T5YmN5ri45oiP5Li7XCIgKyBnYW1laG9zdCArIFwi5pys6L2u5Li7XCIgKyByb3VuZGhvc3QpO1xyXG4gICAgICAgIGlmICh0ZXN0QXJyYXkubGVuZ3RoID09IDEpIHtcclxuICAgICAgICAgICAgbGV0IHRlc3RWYWx1ZSA9IHRlc3RBcnJheVswXSArIFwiXCI7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib25pb25cIiwgUG9rZXJVdGlsLnF1YXJ5UG9rZXJXZWlnaHQocGFyc2VJbnQodGVzdFZhbHVlLnN1YnN0cmluZygwLCAyKSkpKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRlc3RBcnJheS5sZW5ndGggPj0gMikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm9uaW9uXCIsIFBva2VyVXRpbC5jb21wYXJlUG9rZXIoZ2FtZWhvc3QsIHJvdW5kaG9zdCwgdGVzdEFycmF5WzBdLCB0ZXN0QXJyYXlbMV0pKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgdGVzdEFycmF5TG9naWMgPSAodGVzdEFycmF5MSwgdGVzdEFycmF5MikgPT4ge1xyXG4gICAgICAgIGxldCBnYW1laG9zdCA9IE1hdGgucmFuZG9tKCkgKiA0O1xyXG4gICAgICAgIGxldCByb3VuZGhvc3QgPSBNYXRoLnJhbmRvbSgpICogNDtcclxuICAgICAgICBnYW1laG9zdCA9IHBhcnNlSW50KGdhbWVob3N0KSArIDE7XHJcbiAgICAgICAgcm91bmRob3N0ID0gcGFyc2VJbnQocm91bmRob3N0KSArIDE7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJvbmlvblwiLCBcIuW9k+WJjea4uOaIj+S4u1wiICsgZ2FtZWhvc3QgKyBcIuacrOi9ruS4u1wiICsgcm91bmRob3N0KTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIm9uaW9uXCIsIFBva2VyVXRpbC5jb21wYXJlUG9rZXIoZ2FtZWhvc3QsIHJvdW5kaG9zdCwgdGVzdEFycmF5MSwgdGVzdEFycmF5MikpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOavlOi+g+eJjOeahOWkp+Wwj1xyXG4gICAgICog5pyA5ZCO5LiA5L2N5piv6Iqx6Imy77yM5YmN6Z2i55u05o6l5q+U5aSn5bCPXHJcbiAgICAgKiDop4TliJkgMea4uOaIj+S4uz7ova7mrKHkuLs+5YmvXHJcbiAgICAgKiAgICAgIDIgNT7njos+Mz4yXHJcbiAgICAgKiAgICAgIDMg5ZCM5Li65Ymv54mM77yM6Iqx6Imy5q+U5aSn5bCPXHJcbiAgICAgKiAgICAgIDRcclxuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWVMZWZ0ICDlhYjniYxcclxuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWVSaWdodCDlkI7niYxcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNvbXBhcmVQb2tlciA9IChnYW1laG9zdCwgcm91bmRob3N0LCB2YWx1ZUxlZnQsIHZhbHVlUmlnaHQpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIm9uaW9uXCIsIFwiY29tcGFyZVBva2VyKytcIiArIFBva2VyVXRpbC5xdWFyeVBva2VyVmFsdWUodmFsdWVMZWZ0KSArIFwiL1wiICsgUG9rZXJVdGlsLnF1YXJ5UG9rZXJWYWx1ZSh2YWx1ZVJpZ2h0KSk7XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWVMZWZ0KSB8fCBBcnJheS5pc0FycmF5KHZhbHVlUmlnaHQpKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJvbmlvblwiLCBcIuaaguS4jeaUr+aMgeaVsOe7hFwiKTtcclxuICAgICAgICAgICAgUG9rZXJVdGlsLmNvbXBhcmVBcnJheShnYW1laG9zdCwgcm91bmRob3N0LCB2YWx1ZUxlZnQsIHZhbHVlUmlnaHQpO1xyXG4gICAgICAgICAgICByZXR1cm4gTEVGVF9XSU47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodmFsdWVSaWdodCA9PSB2YWx1ZUxlZnQpIHtcclxuICAgICAgICAgICAgLy/lrozlhajnm7jlkIzvvIzlhYjniYzlpKdcclxuICAgICAgICAgICAgcmV0dXJuIExFRlRfV0lOO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YWx1ZVJpZ2h0ID0gdmFsdWVSaWdodCArIFwiXCI7XHJcbiAgICAgICAgdmFsdWVMZWZ0ID0gdmFsdWVMZWZ0ICsgXCJcIjtcclxuICAgICAgICAvLzEg5Yik5pat5YWI54mM5ZCO54mM55qE6Iqx6ImyXHJcbiAgICAgICAgbGV0IHR5cGVMZWZ0ID0gdmFsdWVMZWZ0LnN1YnN0cmluZygyKTtcclxuICAgICAgICBsZXQgdHlwZVJpZ2h0ID0gdmFsdWVSaWdodC5zdWJzdHJpbmcoMik7XHJcbiAgICAgICAgLy8y5Yik5pat5YWI54mM5ZCO54mM5YC8XHJcbiAgICAgICAgbGV0IGNvbnRlbnRMZWZ0ID0gdmFsdWVMZWZ0LnN1YnN0cmluZygwLCAyKTtcclxuICAgICAgICBsZXQgY29udGVudFJpZ2h0ID0gdmFsdWVSaWdodC5zdWJzdHJpbmcoMCwgMik7XHJcbiAgICAgICAgLy8z5Yik5pat54mM5piv5ZCm5Li65Li7IOa0u+WKqOS4u1xyXG4gICAgICAgIGxldCBsZWZ0SXNIb3N0ID0gdHlwZUxlZnQgPT0gZ2FtZWhvc3QgfHwgUG9rZXJVdGlsLnF1YXJ5SXNIb3N0KGNvbnRlbnRMZWZ0KTtcclxuICAgICAgICBsZXQgcmlnaHRJc0hvc3QgPSB0eXBlTGVmdCA9PSBnYW1laG9zdCB8fCBQb2tlclV0aWwucXVhcnlJc0hvc3QoY29udGVudFJpZ2h0KTtcclxuICAgICAgICAvLzTmr5TovoNcclxuICAgICAgICBpZiAobGVmdElzSG9zdCAmJiByaWdodElzSG9zdCkge1xyXG4gICAgICAgICAgICAvL+WQjOS4uuS4u++8jOS4uzXmnIDlpKdcclxuICAgICAgICAgICAgaWYgKHBhcnNlSW50KGNvbnRlbnRMZWZ0KSA9PSA1KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gTEVGVF9XSU47XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocGFyc2VJbnQoY29udGVudFJpZ2h0KSA9PSA1KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUklHSFRfV0lOO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy/nm7TmjqXmr5TlpKflsI9cclxuICAgICAgICAgICAgICAgIGxldCByZXN1bHQgPSBQb2tlclV0aWwuY29tcGFyZVNpbmdsZVBva2VyQmlnZ2VyKGNvbnRlbnRMZWZ0LCBjb250ZW50UmlnaHQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdCAhPSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy/lpKflsI/nm7jlkIzvvIzlrZjlnKjmtLvliqjkuLvlkozoirHoibLkuLvniYzlgLznm7jlkIzmg4XlhrVcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZUxlZnQgPT0gZ2FtZWhvc3QpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIExFRlRfV0lOO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZVJpZ2h0ID09IGdhbWVob3N0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBSSUdIVF9XSU47XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHsvL+WQjOS4uua0u+WKqOS4u1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gTEVGVF9XSU47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAobGVmdElzSG9zdCkge1xyXG4gICAgICAgICAgICAvL+WFiOeJjOaYr+S4u++8jOWFiOeJjOWkp1xyXG4gICAgICAgICAgICByZXR1cm4gTEVGVF9XSU47XHJcbiAgICAgICAgfSBlbHNlIGlmIChyaWdodElzSG9zdCkge1xyXG4gICAgICAgICAgICAvL+WQjueJjOaYr+S4u++8jOWQjueJjOWkp1xyXG4gICAgICAgICAgICByZXR1cm4gUklHSFRfV0lOO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBQb2tlclV0aWwuY29tcGFyZVZpY2Uocm91bmRob3N0LCB0eXBlTGVmdCwgdHlwZVJpZ2h0LCBjb250ZW50TGVmdCwgY29udGVudFJpZ2h0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDkuI3liKTmlq3oirHoibLvvIznm7TmjqXmr5TlpKflsI8g5Y+q5o6l5Y+X5Lik5L2NXHJcbiAgICAgKiDlhYHorrjov5Tlm54wXHJcbiAgICAgKlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY29tcGFyZVNpbmdsZVBva2VyQmlnZ2VyID0gKHZhbHVlTGVmdCwgdmFsdWVSaWdodCkgPT4ge1xyXG4gICAgICAgIGlmICh2YWx1ZUxlZnQubGVuZ3RoID4gMiB8fCB2YWx1ZVJpZ2h0Lmxlbmd0aCA+IDIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIuWPquaOpeWPl+S4pOS9jeeahFwiICsgdmFsdWVMZWZ0ICsgXCIvXCIgKyB2YWx1ZVJpZ2h0KTtcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBsZWZ0TnVtID0gcGFyc2VJbnQodmFsdWVMZWZ0KTtcclxuICAgICAgICBsZXQgcmlnaHROdW0gPSBwYXJzZUludCh2YWx1ZVJpZ2h0KTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gUG9rZXJVdGlsLnF1YXJ5UG9rZXJXZWlnaHQocmlnaHROdW0pIC0gUG9rZXJVdGlsLnF1YXJ5UG9rZXJXZWlnaHQobGVmdE51bSk7XHJcbiAgICAgICAgaWYgKHJlc3VsdCA+IDApIHtcclxuICAgICAgICAgICAgcmVzdWx0ID0gUklHSFRfV0lOO1xyXG4gICAgICAgIH0gZWxzZSBpZiAocmVzdWx0IDwgMCkge1xyXG4gICAgICAgICAgICByZXN1bHQgPSBMRUZUX1dJTjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliKTmlq3niYznmoTlpKflsI9cclxuICAgICAqIEBwYXJhbSB7Kn0gcG9rZXJcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHF1YXJ5UG9rZXJXZWlnaHQocG9rZXIpIHtcclxuICAgICAgICByZXR1cm4gcG9rZXJXZWlnaHQuaW5kZXhPZihwb2tlcik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliKTmlq3niYzmmK/kuI3mmK/mtLvliqjkuLsgMTUgMyA15a+55bqUIDIgMyA1XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBxdWFyeUlzSG9zdChwb2tlcikge1xyXG4gICAgICAgIGxldCB2YWx1ZSA9IHBhcnNlSW50KHBva2VyKTtcclxuICAgICAgICByZXR1cm4gdmFsdWUgPT0gMTUgfHwgdmFsdWUgPT0gMyB8fCB2YWx1ZSA9PSA1IHx8IHZhbHVlID09IDE2IHx8IHZhbHVlID09IDE3IHx8IHZhbHVlID09IDE4Oy8vMiAzIDUg5bCP546LIOWkp+eOiyDkuLs1XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliKTmlq3lia/niYzosIHlpKdcclxuICAgICAqIEBwYXJhbSB7Kn0gcm91bmRob3N0XHJcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlTGVmdFxyXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZVJpZ2h0XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjb21wYXJlVmljZShyb3VuZGhvc3QsIHR5cGVMZWZ0LCB0eXBlUmlnaHQsIGNvbnRlbnRMZWZ0LCBjb250ZW50UmlnaHQpIHtcclxuICAgICAgICBpZiAodHlwZVJpZ2h0ID09IHR5cGVMZWZ0ID09IHJvdW5kaG9zdCkge1xyXG4gICAgICAgICAgICByZXR1cm4gUG9rZXJVdGlsLmNvbXBhcmVTaW5nbGVQb2tlckJpZ2dlcihjb250ZW50TGVmdCwgY29udGVudFJpZ2h0KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVMZWZ0ID09IHJvdW5kaG9zdCkge1xyXG4gICAgICAgICAgICByZXR1cm4gTEVGVF9XSU47XHJcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlUmlnaHQgPT0gcm91bmRob3N0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBSSUdIVF9XSU47XHJcbiAgICAgICAgfSBlbHNlIHsvL+mDveaYr+WJr+eJjCDkuI3mmK/mnKzova7kuLvvvIzlpJrljYrmmK/ot5/niYzvvIzmhI/kuYnkuI3lpKdcclxuICAgICAgICAgICAgcmV0dXJuIExFRlRfV0lOO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGNvbXBhcmVBcnJheSA9IChnYW1laG9zdCwgcm91bmRob3N0LCB2YWx1ZUxlZnQsIHZhbHVlUmlnaHQpID0+IHtcclxuICAgICAgICAvL+WBtuaVsOW8oO+8jOaOkuaVsOS4jeS4gOiHtFxyXG4gICAgICAgIGlmICh2YWx1ZUxlZnQubGVuZ3RoICE9IHZhbHVlUmlnaHQubGVuZ3RoIHx8IHZhbHVlTGVmdC5sZW5ndGggJSAyICE9IDApIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIm9uaW9uXCIsIFwi5pWw57uE6ZW/5bqm5LiN5LiA6Ie0XCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gTEVGVF9XSU47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vMSDmjpLluo9cclxuICAgICAgICBsZXQgYXJyYXlMZWZ0ID0gdmFsdWVMZWZ0LnNvcnQoKTtcclxuICAgICAgICBsZXQgYXJyYXlSaWdodCA9IHZhbHVlUmlnaHQuc29ydCgpO1xyXG4gICAgICAgIC8vMiDlpYfmlbDlkozlgbbmlbDkuIDmoLfvvIzliKTmlq3lr7nlrZDlkIjms5XmgKdcclxuICAgICAgICBsZXQgcmVzdWx0TGVmdCA9IFBva2VyVXRpbC5jaGVja0FycmF5VmFsdWUoYXJyYXlMZWZ0KTtcclxuICAgICAgICBsZXQgcmVzdWx0UmlnaHQgPSBQb2tlclV0aWwuY2hlY2tBcnJheVZhbHVlKGFycmF5UmlnaHQpO1xyXG4gICAgICAgIGlmIChyZXN1bHRMZWZ0WzBdID09IFwiLTFcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gUklHSFRfV0lOO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocmVzdWx0UmlnaHRbMF0gPT0gXCItMVwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBMRUZUX1dJTjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChnYW1laG9zdCA9PSByZXN1bHRMZWZ0WzBdID09IHJlc3VsdFJpZ2h0WzBdKSB7XHJcbiAgICAgICAgICAgIC8v6YO95piv5Li75a+5XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHRMZWZ0WzFdID4gcmVzdWx0UmlnaHRbMV0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBMRUZUX1dJTjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBSSUdIVF9XSU47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKGdhbWVob3N0ID09IHJlc3VsdExlZnRbMF0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIExFRlRfV0lOO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZ2FtZWhvc3QgPT0gcmVzdWx0UmlnaHRbMF0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIFJJR0hUX1dJTjtcclxuICAgICAgICB9IGVsc2UgaWYgKHJvdW5kaG9zdCA9PSByZXN1bHRMZWZ0WzBdID09IHJlc3VsdFJpZ2h0WzBdKSB7XHJcbiAgICAgICAgICAgIC8v6YO95piv5Ymv5a+5XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHRMZWZ0WzFdID4gcmVzdWx0UmlnaHRbMV0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBMRUZUX1dJTjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBSSUdIVF9XSU47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHJvdW5kaG9zdCA9PSByZXN1bHRMZWZ0WzBdKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBMRUZUX1dJTjtcclxuICAgICAgICB9IGVsc2UgaWYgKGdhbWVob3N0ID09IHJlc3VsdFJpZ2h0WzBdKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBSSUdIVF9XSU47XHJcbiAgICAgICAgfSBlbHNlIHsvL+mDveS4jeaYr+S4uyDot5/niYzlpKflsI/ml6DmhI/kuYlcclxuICAgICAgICAgICAgcmV0dXJuIExFRlRfV0lOO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy/kuIDlr7nnm7TmjqXmr5RcclxuICAgICAgICAvL+WkmuWvueWFiOagoemqjOWQiOazleaAp++8jDHmmK/lkKblpJrlr7kgMuaYr+WQpui/nuWvuSAz6Iqx6Imy5LiA6Ie0IDRcclxuXHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHsqfSBhcnJheSBcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNoZWNrQXJyYXlWYWx1ZSA9IChhcnJheSkgPT4ge1xyXG4gICAgICAgIGxldCBvZGQgPSBcIi0xXCI7XHJcbiAgICAgICAgbGV0IGV2ZW4gPSBcIi0xXCJcclxuICAgICAgICBsZXQgbGFzdFR5cGUgPSBcIi0xXCI7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGFycmF5Lmxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICAgICAgICBpZiAoaW5kZXggJSAyID09IDApIHtcclxuICAgICAgICAgICAgICAgIGV2ZW4gPSBhcnJheVtpbmRleF07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBvZGQgPSBhcnJheVtpbmRleF07XHJcbiAgICAgICAgICAgICAgICBpZiAoZXZlbiAhPSBvZGQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW1wiLTFcIiwgLTFdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbGV0IGNhcmROdW0gPSBvZGQ7XHJcbiAgICAgICAgICAgICAgICBsZXQgdHlwZSA9IFwiMFwiO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNhcmROdW0gPT0gXCIxNzFcIiB8fCBjYXJkTnVtID09IFwiMTYxXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL+Wkp+Wwj+eOi1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGUgPSBcIjVcIjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHN0ciA9IGNhcmROdW0uc3Vic3RyaW5nKDIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGUgPSBQb2tlclV0aWwucXVhcnlUeXBlKHN0cik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAobGFzdFR5cGUgIT0gdHlwZSAmJiBsYXN0VHlwZSAhPSBcIi0xXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL+S4jeaYr+mmluasoeS4lOS4juS5i+WJjeiKseiJsuS4jeWQjO+8jOS4jeiDveeul+WvueWtkFxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbXCItMVwiLCAtMV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsYXN0VHlwZSA9IHR5cGU7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29tcGFyZSA9IGNhcmROdW0uc3Vic3RyaW5nKDAsIDIpO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgUG9rZXJVdGlsLnF1YXJ5UG9rZXJXZWlnaHQocGFyc2VJbnQoY29tcGFyZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBbbGFzdFR5cGUsIHJlc3VsdF07XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOavlOacrOi9ruWkp+Wwj++8jOi/lOWbnui1ouWutiAxMjM06aG65L2NXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjb21wYXJlUm91bmQgPSAocGxheVBva2VycykgPT4ge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZGVzdG9yeUFycmF5ID0gKGRlc3RvcnlOb2RlKSA9PiB7XHJcbiAgICAgICAgaWYgKGRlc3RvcnlOb2RlICE9IG51bGwpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkZXN0b3J5Tm9kZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZGVzdG9yeU5vZGVbaV0uZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBxdWFyeVR5cGUgPSAodHlwZSkgPT4ge1xyXG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwiMVwiOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwi5pa55Z2XXCI7XHJcbiAgICAgICAgICAgIGNhc2UgXCIyXCI6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCLmooXoirFcIjtcclxuICAgICAgICAgICAgY2FzZSBcIjNcIjpcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIue6ouahg1wiO1xyXG4gICAgICAgICAgICBjYXNlIFwiNFwiOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwi6buR5qGDXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc3RhdGljIHF1YXJ5UG9rZXJUeXBlVmFsdWUgPSAocG9rZXJWYWx1ZSkgPT4ge1xyXG4gICAgICAgIHBva2VyVmFsdWU9cG9rZXJWYWx1ZStcIlwiO1xyXG4gICAgICAgIGlmIChwb2tlclZhbHVlID09IFwiMTcxXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiM1wiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocG9rZXJWYWx1ZSA9PSBcIjE2MVwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIjRcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBva2VyVmFsdWUuc3Vic3RyaW5nKDIpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDpgJrov4fniYzluo/mn6XoirHoibLlpKflsI9cclxuICAgICAqIOacgOWQjuS4gOS9jeaYr+iKseiJslxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcXVhcnlQb2tlclZhbHVlID0gKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgbGV0IGNhcmROdW0gPSB2YWx1ZSArIFwiXCI7XHJcbiAgICAgICAgaWYgKGNhcmROdW0gPT0gXCIxNzFcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gXCLlpKfnjotcIjtcclxuICAgICAgICB9IGVsc2UgaWYgKGNhcmROdW0gPT0gXCIxNjFcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gXCLlsI/njotcIlxyXG4gICAgICAgIH0gZWxzZSBpZiAoY2FyZE51bSA9PSBcIjE4MVwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIuWNoeiDjFwiXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IGNvbXBhcmUgPSBjYXJkTnVtLnN1YnN0cmluZygwLCAyKTtcclxuICAgICAgICAgICAgbGV0IHR5cGUgPSBjYXJkTnVtLnN1YnN0cmluZygyKTtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IFBva2VyVXRpbC5xdWFyeVR5cGUodHlwZSk7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoY29tcGFyZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIjAzXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgXCIzXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiMDRcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHQgKyBcIjRcIjtcclxuICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIjA1XCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgXCI1XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiMDZcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHQgKyBcIjZcIjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCIwN1wiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdCArIFwiN1wiO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIjA4XCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgXCI4XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiMDlcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHQgKyBcIjlcIjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCIxMFwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdCArIFwiMTBcIjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCIxMVwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdCArIFwiSlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIjEyXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgXCJRXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiMTNcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHQgKyBcIktcIjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCIxNFwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdCArIFwiQVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIjE1XCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgXCIyXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59Il19
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
var pokerWeight = [4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 3, 5, 16, 17, 18]; //主5为18

var LEFT_WIN = -1;
var RIGHT_WIN = 1;

var AIUtil = /*#__PURE__*/function () {
  function AIUtil() {}

  var _proto = AIUtil.prototype;

  _proto.checkUserCanSend = function checkUserCanSend(gameHost, roundHost, userCard, cardArray) {};

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcQUlVdGlsLmpzIl0sIm5hbWVzIjpbInBva2VyV2VpZ2h0IiwiTEVGVF9XSU4iLCJSSUdIVF9XSU4iLCJBSVV0aWwiLCJjaGVja1VzZXJDYW5TZW5kIiwiZ2FtZUhvc3QiLCJyb3VuZEhvc3QiLCJ1c2VyQ2FyZCIsImNhcmRBcnJheSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLFdBQVcsR0FBRyxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCLEVBQWhCLEVBQW9CLEVBQXBCLEVBQXdCLEVBQXhCLEVBQTRCLEVBQTVCLEVBQWdDLEVBQWhDLEVBQW9DLEVBQXBDLEVBQXdDLENBQXhDLEVBQTJDLENBQTNDLEVBQThDLEVBQTlDLEVBQWtELEVBQWxELEVBQXNELEVBQXRELENBQWxCLEVBQTRFOztBQUM1RSxJQUFJQyxRQUFRLEdBQUcsQ0FBQyxDQUFoQjtBQUNBLElBQUlDLFNBQVMsR0FBRyxDQUFoQjs7SUFDcUJDOzs7OztTQUVsQkMsbUJBQUEsMEJBQWlCQyxRQUFqQixFQUEwQkMsU0FBMUIsRUFBb0NDLFFBQXBDLEVBQTZDQyxTQUE3QyxFQUF1RCxDQUV0RCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsibGV0IHBva2VyV2VpZ2h0ID0gWzQsIDYsIDcsIDgsIDksIDEwLCAxMSwgMTIsIDEzLCAxNCwgMTUsIDMsIDUsIDE2LCAxNywgMThdOy8v5Li7NeS4ujE4XHJcbmxldCBMRUZUX1dJTiA9IC0xO1xyXG5sZXQgUklHSFRfV0lOID0gMTtcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQUlVdGlsIHtcclxuXHJcbiAgIGNoZWNrVXNlckNhblNlbmQoZ2FtZUhvc3Qscm91bmRIb3N0LHVzZXJDYXJkLGNhcmRBcnJheSl7XHJcblxyXG4gICB9XHJcblxyXG59Il19
//------QC-SOURCE-SPLIT------
