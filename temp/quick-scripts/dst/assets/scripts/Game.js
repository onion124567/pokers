
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

    for (var i = 0; i < 13; i++) {
      var pre = 3 + i;

      for (var j = 1; j < 5; j++) {
        var str = "";

        if (pre < 10) {
          str = "0";
        }

        str = str + pre + j;
        this.cardArray.push(str);
      }
    }

    this.spawnBottomCard(); // this.spawnNewStar();
    // 初始化计分

    this.score = 0;
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
  spawnBottomCard: function spawnBottomCard() {
    console.log("onion spawnBottomCard");

    for (var i = 0; i < 17; i++) {
      // 使用给定的模板在场景中生成一个新节点
      var newStar = cc.instantiate(this.cardPrefab); // newStar.setPicNum("i"+i);

      newStar.getComponent('Card').picNum = this.cardArray[i];
      this.node.addChild(newStar);
      newStar.setPosition(cc.v2(-200 + this.startCardPostion + i * this.cardWidth, this.ground.height / 2 * -1));
    } // // 在星星组件上暂存 Game 对象的引用
    // newStar.getComponent('Star').game = this;
    // // 重置计时器，根据消失时间范围随机取一个值
    // this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
    // this.timer = 0;

  },
  getPicNum: function getPicNum() {
    return this.cardArray[4];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcR2FtZS5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsInN0YXJQcmVmYWIiLCJ0eXBlIiwiUHJlZmFiIiwiY2FyZFByZWZhYiIsIm1heFN0YXJEdXJhdGlvbiIsIm1pblN0YXJEdXJhdGlvbiIsImN1cnJlbnRDYXJkUG9zaXRpb24iLCJzdGFydENhcmRQb3N0aW9uIiwiY2FyZFdpZHRoIiwiY2FyZEFycmF5IiwiU3RyaW5nIiwiZ3JvdW5kIiwiTm9kZSIsInBsYXllciIsInNjb3JlRGlzcGxheSIsIkxhYmVsIiwic2NvcmVBdWRpbyIsIkF1ZGlvQ2xpcCIsIm9uTG9hZCIsImdyb3VuZFkiLCJ5IiwiaGVpZ2h0IiwidGltZXIiLCJzdGFyRHVyYXRpb24iLCJpIiwicHJlIiwiaiIsInN0ciIsInB1c2giLCJzcGF3bkJvdHRvbUNhcmQiLCJzY29yZSIsInNwYXduTmV3U3RhciIsIm5ld1N0YXIiLCJpbnN0YW50aWF0ZSIsIm5vZGUiLCJhZGRDaGlsZCIsInNldFBvc2l0aW9uIiwiZ2V0TmV3U3RhclBvc2l0aW9uIiwiZ2V0Q29tcG9uZW50IiwiZ2FtZSIsIk1hdGgiLCJyYW5kb20iLCJjb25zb2xlIiwibG9nIiwicGljTnVtIiwidjIiLCJnZXRQaWNOdW0iLCJyYW5kWCIsInJhbmRZIiwianVtcEhlaWdodCIsIm1heFgiLCJ3aWR0aCIsImdldENhcmRCb3R0b21Qb3NpdGlvbiIsInVwZGF0ZSIsImR0IiwiZ2FpblNjb3JlIiwic3RyaW5nIiwiYXVkaW9FbmdpbmUiLCJwbGF5RWZmZWN0IiwiZ2FtZU92ZXIiLCJzdG9wQWxsQWN0aW9ucyIsImRpcmVjdG9yIiwibG9hZFNjZW5lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNMLGFBQVNELEVBQUUsQ0FBQ0UsU0FEUDtBQUdMQyxFQUFBQSxVQUFVLEVBQUU7QUFDUjtBQUNB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dCI6WyJjYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyDov5nkuKrlsZ7mgKflvJXnlKjkuobmmJ/mmJ/pooTliLbotYTmupBcbiAgICAgICAgc3RhclByZWZhYjoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYlxuICAgICAgICB9LFxuICAgICAgICBjYXJkUHJlZmFiOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiXG4gICAgICAgIH0sXG4gICAgICAgIC8vIOaYn+aYn+S6p+eUn+WQjua2iOWkseaXtumXtOeahOmaj+acuuiMg+WbtFxuICAgICAgICBtYXhTdGFyRHVyYXRpb246IDAsXG4gICAgICAgIG1pblN0YXJEdXJhdGlvbjogMCxcbiAgICAgICAgY3VycmVudENhcmRQb3NpdGlvbjowLFxuICAgICAgICBzdGFydENhcmRQb3N0aW9uOjAsXG4gICAgICAgIGNhcmRXaWR0aDo4MCxcbiAgICAgICAgY2FyZEFycmF5OltjYy5TdHJpbmddLFxuICAgICAgICAvLyDlnLDpnaLoioLngrnvvIznlKjkuo7noa7lrprmmJ/mmJ/nlJ/miJDnmoTpq5jluqZcbiAgICAgICAgZ3JvdW5kOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9LFxuICAgICAgICAvLyBwbGF5ZXIg6IqC54K577yM55So5LqO6I635Y+W5Li76KeS5by56Lez55qE6auY5bqm77yM5ZKM5o6n5Yi25Li76KeS6KGM5Yqo5byA5YWzXG4gICAgICAgIHBsYXllcjoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfSxcbiAgICAgICAgLy8gc2NvcmUgbGFiZWwg55qE5byV55SoXG4gICAgICAgIHNjb3JlRGlzcGxheToge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG4gICAgICAgIC8vIOW+l+WIhumfs+aViOi1hOa6kFxuICAgICAgICBzY29yZUF1ZGlvOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuQXVkaW9DbGlwXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIOiOt+WPluWcsOW5s+mdoueahCB5IOi9tOWdkOagh1xuICAgICAgICB0aGlzLmdyb3VuZFkgPSB0aGlzLmdyb3VuZC55ICsgdGhpcy5ncm91bmQuaGVpZ2h0LzI7XG4gICAgICAgIC8vIOWIneWni+WMluiuoeaXtuWZqFxuICAgICAgICB0aGlzLnRpbWVyID0gMDtcbiAgICAgICAgdGhpcy5zdGFyRHVyYXRpb24gPSAwO1xuICAgICAgICBmb3IobGV0IGk9MDtpPDEzO2krKyl7XG4gICAgICAgICAgICBsZXQgcHJlPTMraTtcbiAgICAgICAgICAgIGZvcihsZXQgaj0xO2o8NTtqKyspe1xuICAgICAgICAgICAgICAgIGxldCBzdHI9XCJcIjtcbiAgICAgICAgICAgICAgICBpZihwcmU8MTApe1xuICAgICAgICAgICAgICAgICAgICBzdHI9XCIwXCI7IFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzdHI9c3RyK3ByZStqO1xuICAgICAgICAgICAgICAgIHRoaXMuY2FyZEFycmF5LnB1c2goc3RyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgIHRoaXMuc3Bhd25Cb3R0b21DYXJkKCk7XG4gICAgICAgIC8vIHRoaXMuc3Bhd25OZXdTdGFyKCk7XG4gICAgICAgIC8vIOWIneWni+WMluiuoeWIhlxuICAgICAgICB0aGlzLnNjb3JlID0gMDtcbiAgICB9LFxuXG4gICAgc3Bhd25OZXdTdGFyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8g5L2/55So57uZ5a6a55qE5qih5p2/5Zyo5Zy65pmv5Lit55Sf5oiQ5LiA5Liq5paw6IqC54K5XG4gICAgICAgIHZhciBuZXdTdGFyID0gY2MuaW5zdGFudGlhdGUodGhpcy5zdGFyUHJlZmFiKTtcbiAgICAgICAgLy8g5bCG5paw5aKe55qE6IqC54K55re75Yqg5YiwIENhbnZhcyDoioLngrnkuIvpnaJcbiAgICAgICAgdGhpcy5ub2RlLmFkZENoaWxkKG5ld1N0YXIpO1xuICAgICAgICAvLyDkuLrmmJ/mmJ/orr7nva7kuIDkuKrpmo/mnLrkvY3nva5cbiAgICAgICAgbmV3U3Rhci5zZXRQb3NpdGlvbih0aGlzLmdldE5ld1N0YXJQb3NpdGlvbigpKTtcbiAgICAgICAgLy8g5Zyo5pif5pif57uE5Lu25LiK5pqC5a2YIEdhbWUg5a+56LGh55qE5byV55SoXG4gICAgICAgIG5ld1N0YXIuZ2V0Q29tcG9uZW50KCdTdGFyJykuZ2FtZSA9IHRoaXM7XG4gICAgICAgIC8vIOmHjee9ruiuoeaXtuWZqO+8jOagueaNrua2iOWkseaXtumXtOiMg+WbtOmaj+acuuWPluS4gOS4quWAvFxuICAgICAgICB0aGlzLnN0YXJEdXJhdGlvbiA9IHRoaXMubWluU3RhckR1cmF0aW9uICsgTWF0aC5yYW5kb20oKSAqICh0aGlzLm1heFN0YXJEdXJhdGlvbiAtIHRoaXMubWluU3RhckR1cmF0aW9uKTtcbiAgICAgICAgdGhpcy50aW1lciA9IDA7XG4gICAgfSxcbiAgICBzcGF3bkJvdHRvbUNhcmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIm9uaW9uIHNwYXduQm90dG9tQ2FyZFwiKTtcbiAgICAgICAgZm9yKGxldCBpPTA7aTwxNztpKyspe1xuICAgICAgICAgICAgIC8vIOS9v+eUqOe7meWumueahOaooeadv+WcqOWcuuaZr+S4reeUn+aIkOS4gOS4quaWsOiKgueCuVxuICAgICAgICB2YXIgbmV3U3RhciA9IGNjLmluc3RhbnRpYXRlKHRoaXMuY2FyZFByZWZhYik7XG4gICAgICAgIC8vIG5ld1N0YXIuc2V0UGljTnVtKFwiaVwiK2kpO1xuICAgICAgICBuZXdTdGFyLmdldENvbXBvbmVudCgnQ2FyZCcpLnBpY051bT10aGlzLmNhcmRBcnJheVtpXTtcbiAgICAgICAgdGhpcy5ub2RlLmFkZENoaWxkKG5ld1N0YXIpO1xuICAgICAgICBuZXdTdGFyLnNldFBvc2l0aW9uKGNjLnYyKC0yMDArdGhpcy5zdGFydENhcmRQb3N0aW9uK2kqdGhpcy5jYXJkV2lkdGgsdGhpcy5ncm91bmQuaGVpZ2h0LzIqLTEpKTtcbiAgICAgICAgXG4gICAgICAgIH1cbiAgICAgICBcbiAgICAgICAgLy8gLy8g5Zyo5pif5pif57uE5Lu25LiK5pqC5a2YIEdhbWUg5a+56LGh55qE5byV55SoXG4gICAgICAgIC8vIG5ld1N0YXIuZ2V0Q29tcG9uZW50KCdTdGFyJykuZ2FtZSA9IHRoaXM7XG4gICAgICAgIC8vIC8vIOmHjee9ruiuoeaXtuWZqO+8jOagueaNrua2iOWkseaXtumXtOiMg+WbtOmaj+acuuWPluS4gOS4quWAvFxuICAgICAgICAvLyB0aGlzLnN0YXJEdXJhdGlvbiA9IHRoaXMubWluU3RhckR1cmF0aW9uICsgTWF0aC5yYW5kb20oKSAqICh0aGlzLm1heFN0YXJEdXJhdGlvbiAtIHRoaXMubWluU3RhckR1cmF0aW9uKTtcbiAgICAgICAgLy8gdGhpcy50aW1lciA9IDA7XG4gICAgfSxcbiAgICBnZXRQaWNOdW06ZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FyZEFycmF5WzRdO1xuXG4gICAgfSxcblxuICAgIGdldE5ld1N0YXJQb3NpdGlvbjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcmFuZFggPSAwO1xuICAgICAgICAvLyDmoLnmja7lnLDlubPpnaLkvY3nva7lkozkuLvop5Lot7Pot4Ppq5jluqbvvIzpmo/mnLrlvpfliLDkuIDkuKrmmJ/mmJ/nmoQgeSDlnZDmoIdcbiAgICAgICAgdmFyIHJhbmRZID0gdGhpcy5ncm91bmRZICsgTWF0aC5yYW5kb20oKSAqIHRoaXMucGxheWVyLmdldENvbXBvbmVudCgnUGxheWVyJykuanVtcEhlaWdodCArIDUwO1xuICAgICAgICAvLyDmoLnmja7lsY/luZXlrr3luqbvvIzpmo/mnLrlvpfliLDkuIDkuKrmmJ/mmJ8geCDlnZDmoIdcbiAgICAgICAgdmFyIG1heFggPSB0aGlzLm5vZGUud2lkdGgvMjtcbiAgICAgICAgcmFuZFggPSAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiAyICogbWF4WDtcbiAgICAgICAgLy8g6L+U5Zue5pif5pif5Z2Q5qCHXG4gICAgICAgIHJldHVybiBjYy52MihyYW5kWCwgcmFuZFkpO1xuICAgIH0sXG4gICAgZ2V0Q2FyZEJvdHRvbVBvc2l0aW9uOmZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciByYW5kWCA9IHRoaXMuY3VycmVudENhcmRQb3NpdGlvbjtcbiAgICAgICAgdmFyIHJhbmRZID0gMDtcbiAgICAgICAgdGhpcy5jdXJyZW50Q2FyZFBvc2l0aW9uPXRoaXMuY3VycmVudENhcmRQb3NpdGlvbit0aGlzLmNhcmRXaWR0aDtcbiAgICAgICAgcmV0dXJuIGNjLnYyKHJhbmRYLCByYW5kWSk7XG4gICAgfSxcblxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG4gICAgICAgIC8vIOavj+W4p+abtOaWsOiuoeaXtuWZqO+8jOi2hei/h+mZkOW6pui/mOayoeacieeUn+aIkOaWsOeahOaYn+aYn1xuICAgICAgICAvLyDlsLHkvJrosIPnlKjmuLjmiI/lpLHotKXpgLvovpFcbiAgICAgICAgLy8gaWYgKHRoaXMudGltZXIgPiB0aGlzLnN0YXJEdXJhdGlvbikge1xuICAgICAgICAvLyAgICAgdGhpcy5nYW1lT3ZlcigpO1xuICAgICAgICAvLyAgICAgdGhpcy5lbmFibGVkID0gZmFsc2U7ICAgLy8gZGlzYWJsZSBnYW1lT3ZlciBsb2dpYyB0byBhdm9pZCBsb2FkIHNjZW5lIHJlcGVhdGVkbHlcbiAgICAgICAgLy8gICAgIHJldHVybjtcbiAgICAgICAgLy8gfVxuICAgICAgICAvLyB0aGlzLnRpbWVyICs9IGR0O1xuICAgIH0sXG5cbiAgICBnYWluU2NvcmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5zY29yZSArPSAxO1xuICAgICAgICAvLyDmm7TmlrAgc2NvcmVEaXNwbGF5IExhYmVsIOeahOaWh+Wtl1xuICAgICAgICB0aGlzLnNjb3JlRGlzcGxheS5zdHJpbmcgPSAnU2NvcmU6ICcgKyB0aGlzLnNjb3JlO1xuICAgICAgICAvLyDmkq3mlL7lvpfliIbpn7PmlYhcbiAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheUVmZmVjdCh0aGlzLnNjb3JlQXVkaW8sIGZhbHNlKTtcbiAgICB9LFxuXG4gICAgZ2FtZU92ZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5wbGF5ZXIuc3RvcEFsbEFjdGlvbnMoKTsgLy/lgZzmraIgcGxheWVyIOiKgueCueeahOi3s+i3g+WKqOS9nFxuICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoJ2dhbWUnKTtcbiAgICB9XG59KTtcbiJdfQ==