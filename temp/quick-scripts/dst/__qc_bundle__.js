
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
   * 返回分数值
   * @param poker
   * @returns {*}
   */
  ;

  PokerUtil.quaryIsSocer = function quaryIsSocer(poker) {
    if (poker == 5 || poker == 10) {
      return poker;
    } else if (poker == 13) {
      return 10;
    } else {
      return 0;
    }
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

PokerUtil.saveRecoder = function () {
  var userData = {
    name: 'Tracer',
    level: 1,
    gold: 100
  };
  cc.sys.localStorage.setItem('userData', JSON.stringify(userData));
};

PokerUtil.quaryReocder = function () {
  var userData = JSON.parse(cc.sys.localStorage.getItem('userData'));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcUG9rZXJVdGlsLmpzIl0sIm5hbWVzIjpbInBva2VyV2VpZ2h0IiwiTEVGVF9XSU4iLCJSSUdIVF9XSU4iLCJQb2tlclV0aWwiLCJxdWFyeVBva2VyV2VpZ2h0IiwicG9rZXIiLCJpbmRleE9mIiwicXVhcnlJc0hvc3QiLCJ2YWx1ZSIsInBhcnNlSW50IiwicXVhcnlJc1NvY2VyIiwiY29tcGFyZVZpY2UiLCJyb3VuZGhvc3QiLCJ0eXBlTGVmdCIsInR5cGVSaWdodCIsImNvbnRlbnRMZWZ0IiwiY29udGVudFJpZ2h0IiwiY29tcGFyZVNpbmdsZVBva2VyQmlnZ2VyIiwidGVzdExvZ2ljIiwidGVzdEFycmF5IiwiZ2FtZWhvc3QiLCJNYXRoIiwicmFuZG9tIiwiY29uc29sZSIsImxvZyIsImxlbmd0aCIsInRlc3RWYWx1ZSIsInN1YnN0cmluZyIsImNvbXBhcmVQb2tlciIsInRlc3RBcnJheUxvZ2ljIiwidGVzdEFycmF5MSIsInRlc3RBcnJheTIiLCJ2YWx1ZUxlZnQiLCJ2YWx1ZVJpZ2h0IiwicXVhcnlQb2tlclZhbHVlIiwiQXJyYXkiLCJpc0FycmF5IiwiZXJyb3IiLCJjb21wYXJlQXJyYXkiLCJsZWZ0SXNIb3N0IiwicmlnaHRJc0hvc3QiLCJyZXN1bHQiLCJsZWZ0TnVtIiwicmlnaHROdW0iLCJhcnJheUxlZnQiLCJzb3J0IiwiYXJyYXlSaWdodCIsInJlc3VsdExlZnQiLCJjaGVja0FycmF5VmFsdWUiLCJyZXN1bHRSaWdodCIsImFycmF5Iiwib2RkIiwiZXZlbiIsImxhc3RUeXBlIiwiaW5kZXgiLCJjYXJkTnVtIiwidHlwZSIsInN0ciIsInF1YXJ5VHlwZSIsImNvbXBhcmUiLCJjb21wYXJlUm91bmQiLCJwbGF5UG9rZXJzIiwiZGVzdG9yeUFycmF5IiwiZGVzdG9yeU5vZGUiLCJpIiwiZGVzdHJveSIsImEiLCJiIiwiZmxvb3IiLCJsZWZ0IiwicmlnaHQiLCJzb3J0SW5zZXJ0IiwiaXRlbSIsInB1c2giLCJ3ZWlnaHQiLCJmaXJzdFdlaWdodCIsImxhc3RXZWlnaHQiLCJxdWFyeVBva2VyVHlwZVZhbHVlIiwicG9rZXJWYWx1ZSIsInNvcnRQb2tlcnMiLCJnYW1lSG9zdCIsImNhcmRBcnJheSIsInR5cGUxQXJyYXkiLCJ0eXBlMkFycmF5IiwidHlwZTNBcnJheSIsInR5cGU0QXJyYXkiLCJob3N0QXJyYXkiLCJjcmVhdGVTdGF0aWMiLCJjb25jYXQiLCJ0b3RhbCIsInNhdmVSZWNvZGVyIiwidXNlckRhdGEiLCJuYW1lIiwibGV2ZWwiLCJnb2xkIiwiY2MiLCJzeXMiLCJsb2NhbFN0b3JhZ2UiLCJzZXRJdGVtIiwiSlNPTiIsInN0cmluZ2lmeSIsInF1YXJ5UmVvY2RlciIsInBhcnNlIiwiZ2V0SXRlbSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLFdBQVcsR0FBRyxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCLEVBQWhCLEVBQW9CLEVBQXBCLEVBQXdCLEVBQXhCLEVBQTRCLEVBQTVCLEVBQWdDLEVBQWhDLEVBQW9DLEVBQXBDLEVBQXdDLENBQXhDLEVBQTJDLENBQTNDLEVBQThDLEVBQTlDLEVBQWtELEVBQWxELEVBQXNELEVBQXRELENBQWxCLEVBQTRFOztBQUM1RSxJQUFJQyxRQUFRLEdBQUcsQ0FBQyxDQUFoQjtBQUNBLElBQUlDLFNBQVMsR0FBRyxDQUFoQjs7SUFDcUJDOzs7QUF3QmpCOzs7Ozs7Ozs7OztBQTRFQTs7Ozs7O0FBc0JBOzs7O1lBSU9DLG1CQUFQLDBCQUF3QkMsS0FBeEIsRUFBK0I7QUFDM0IsV0FBT0wsV0FBVyxDQUFDTSxPQUFaLENBQW9CRCxLQUFwQixDQUFQO0FBQ0g7QUFFRDs7Ozs7WUFHT0UsY0FBUCxxQkFBbUJGLEtBQW5CLEVBQTBCO0FBQ3RCLFFBQUlHLEtBQUssR0FBR0MsUUFBUSxDQUFDSixLQUFELENBQXBCO0FBQ0EsV0FBT0csS0FBSyxJQUFJLEVBQVQsSUFBZUEsS0FBSyxJQUFJLENB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QUksRUFBRTtBQUhLLEdBQWY7QUFNQUMsRUFBQUEsRUFBRSxDQUFDQyxHQUFILENBQU9DLFlBQVAsQ0FBb0JDLE9BQXBCLENBQTRCLFVBQTVCLEVBQXdDQyxJQUFJLENBQUNDLFNBQUwsQ0FBZVQsUUFBZixDQUF4QztBQUNIOztBQTNkaUJ4RixVQTRkWGtHLGVBQWEsWUFBSTtBQUNwQixNQUFJVixRQUFRLEdBQUdRLElBQUksQ0FBQ0csS0FBTCxDQUFXUCxFQUFFLENBQUNDLEdBQUgsQ0FBT0MsWUFBUCxDQUFvQk0sT0FBcEIsQ0FBNEIsVUFBNUIsQ0FBWCxDQUFmO0FBQ0giLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImxldCBwb2tlcldlaWdodCA9IFs0LCA2LCA3LCA4LCA5LCAxMCwgMTEsIDEyLCAxMywgMTQsIDE1LCAzLCA1LCAxNiwgMTcsIDE4XTsvL+S4uzXkuLoxOFxyXG5sZXQgTEVGVF9XSU4gPSAtMTtcclxubGV0IFJJR0hUX1dJTiA9IDE7XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBva2VyVXRpbCB7XHJcblxyXG4gICAgc3RhdGljIHRlc3RMb2dpYyA9ICh0ZXN0QXJyYXkpID0+IHtcclxuICAgICAgICBsZXQgZ2FtZWhvc3QgPSBNYXRoLnJhbmRvbSgpICogNDtcclxuICAgICAgICBsZXQgcm91bmRob3N0ID0gTWF0aC5yYW5kb20oKSAqIDQ7XHJcbiAgICAgICAgZ2FtZWhvc3QgPSBwYXJzZUludChnYW1laG9zdCkgKyAxO1xyXG4gICAgICAgIHJvdW5kaG9zdCA9IHBhcnNlSW50KHJvdW5kaG9zdCkgKyAxO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwib25pb25cIiwgXCLlvZPliY3muLjmiI/kuLtcIiArIGdhbWVob3N0ICsgXCLmnKzova7kuLtcIiArIHJvdW5kaG9zdCk7XHJcbiAgICAgICAgaWYgKHRlc3RBcnJheS5sZW5ndGggPT0gMSkge1xyXG4gICAgICAgICAgICBsZXQgdGVzdFZhbHVlID0gdGVzdEFycmF5WzBdICsgXCJcIjtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJvbmlvblwiLCBQb2tlclV0aWwucXVhcnlQb2tlcldlaWdodChwYXJzZUludCh0ZXN0VmFsdWUuc3Vic3RyaW5nKDAsIDIpKSkpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGVzdEFycmF5Lmxlbmd0aCA+PSAyKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib25pb25cIiwgUG9rZXJVdGlsLmNvbXBhcmVQb2tlcihnYW1laG9zdCwgcm91bmRob3N0LCB0ZXN0QXJyYXlbMF0sIHRlc3RBcnJheVsxXSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHN0YXRpYyB0ZXN0QXJyYXlMb2dpYyA9ICh0ZXN0QXJyYXkxLCB0ZXN0QXJyYXkyKSA9PiB7XHJcbiAgICAgICAgbGV0IGdhbWVob3N0ID0gTWF0aC5yYW5kb20oKSAqIDQ7XHJcbiAgICAgICAgbGV0IHJvdW5kaG9zdCA9IE1hdGgucmFuZG9tKCkgKiA0O1xyXG4gICAgICAgIGdhbWVob3N0ID0gcGFyc2VJbnQoZ2FtZWhvc3QpICsgMTtcclxuICAgICAgICByb3VuZGhvc3QgPSBwYXJzZUludChyb3VuZGhvc3QpICsgMTtcclxuICAgICAgXHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5q+U6L6D54mM55qE5aSn5bCPXHJcbiAgICAgKiDmnIDlkI7kuIDkvY3mmK/oirHoibLvvIzliY3pnaLnm7TmjqXmr5TlpKflsI9cclxuICAgICAqIOinhOWImSAx5ri45oiP5Li7Pui9ruasoeS4uz7lia9cclxuICAgICAqICAgICAgMiA1PueOiz4zPjJcclxuICAgICAqICAgICAgMyDlkIzkuLrlia/niYzvvIzoirHoibLmr5TlpKflsI9cclxuICAgICAqICAgICAgNFxyXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZUxlZnQgIOWFiOeJjFxyXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZVJpZ2h0IOWQjueJjFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY29tcGFyZVBva2VyID0gKGdhbWVob3N0LCByb3VuZGhvc3QsIHZhbHVlTGVmdCwgdmFsdWVSaWdodCkgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwib25pb25cIiwgXCJjb21wYXJlUG9rZXIrK1wiICsgUG9rZXJVdGlsLnF1YXJ5UG9rZXJWYWx1ZSh2YWx1ZUxlZnQpICsgXCIvXCIgKyBQb2tlclV0aWwucXVhcnlQb2tlclZhbHVlKHZhbHVlUmlnaHQpKTtcclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZUxlZnQpIHx8IEFycmF5LmlzQXJyYXkodmFsdWVSaWdodCkpIHtcclxuICAgICAgICAgICAgaWYodmFsdWVMZWZ0Lmxlbmd0aD09MSl7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZUxlZnQ9dmFsdWVMZWZ0WzBdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKHZhbHVlUmlnaHQubGVuZ3RoPT0xKXtcclxuICAgICAgICAgICAgICAgIHZhbHVlUmlnaHQ9dmFsdWVSaWdodFswXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWVMZWZ0KSB8fCBBcnJheS5pc0FycmF5KHZhbHVlUmlnaHQpKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJvbmlvblwiLCBcIuaaguS4jeaUr+aMgeaVsOe7hFwiKTtcclxuICAgICAgICAgICAgUG9rZXJVdGlsLmNvbXBhcmVBcnJheShnYW1laG9zdCwgcm91bmRob3N0LCB2YWx1ZUxlZnQsIHZhbHVlUmlnaHQpO1xyXG4gICAgICAgICAgICByZXR1cm4gTEVGVF9XSU47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh2YWx1ZVJpZ2h0ID09IHZhbHVlTGVmdCkge1xyXG4gICAgICAgICAgICAvL+WujOWFqOebuOWQjO+8jOWFiOeJjOWkp1xyXG4gICAgICAgICAgICByZXR1cm4gTEVGVF9XSU47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhbHVlUmlnaHQgPSB2YWx1ZVJpZ2h0ICsgXCJcIjtcclxuICAgICAgICB2YWx1ZUxlZnQgPSB2YWx1ZUxlZnQgKyBcIlwiO1xyXG4gICAgICAgIC8vMSDliKTmlq3lhYjniYzlkI7niYznmoToirHoibJcclxuICAgICAgICBsZXQgdHlwZUxlZnQgPSB2YWx1ZUxlZnQuc3Vic3RyaW5nKDIpO1xyXG4gICAgICAgIGxldCB0eXBlUmlnaHQgPSB2YWx1ZVJpZ2h0LnN1YnN0cmluZygyKTtcclxuICAgICAgICAvLzLliKTmlq3lhYjniYzlkI7niYzlgLxcclxuICAgICAgICBsZXQgY29udGVudExlZnQgPSB2YWx1ZUxlZnQuc3Vic3RyaW5nKDAsIDIpO1xyXG4gICAgICAgIGxldCBjb250ZW50UmlnaHQgPSB2YWx1ZVJpZ2h0LnN1YnN0cmluZygwLCAyKTtcclxuICAgICAgICAvLzPliKTmlq3niYzmmK/lkKbkuLrkuLsg5rS75Yqo5Li7XHJcbiAgICAgICAgbGV0IGxlZnRJc0hvc3QgPSB0eXBlTGVmdCA9PSBnYW1laG9zdCB8fCBQb2tlclV0aWwucXVhcnlJc0hvc3QoY29udGVudExlZnQpO1xyXG4gICAgICAgIGxldCByaWdodElzSG9zdCA9IHR5cGVMZWZ0ID09IGdhbWVob3N0IHx8IFBva2VyVXRpbC5xdWFyeUlzSG9zdChjb250ZW50UmlnaHQpO1xyXG4gICAgICAgIC8vNOavlOi+g1xyXG4gICAgICAgIGlmIChsZWZ0SXNIb3N0ICYmIHJpZ2h0SXNIb3N0KSB7XHJcbiAgICAgICAgICAgIC8v5ZCM5Li65Li777yM5Li7NeacgOWkp1xyXG4gICAgICAgICAgICBpZiAocGFyc2VJbnQoY29udGVudExlZnQpID09IDUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBMRUZUX1dJTjtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChwYXJzZUludChjb250ZW50UmlnaHQpID09IDUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBSSUdIVF9XSU47XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvL+ebtOaOpeavlOWkp+Wwj1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlc3VsdCA9IFBva2VyVXRpbC5jb21wYXJlU2luZ2xlUG9rZXJCaWdnZXIoY29udGVudExlZnQsIGNvbnRlbnRSaWdodCk7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0ICE9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvL+Wkp+Wwj+ebuOWQjO+8jOWtmOWcqOa0u+WKqOS4u+WSjOiKseiJsuS4u+eJjOWAvOebuOWQjOaDheWGtVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlTGVmdCA9PSBnYW1laG9zdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gTEVGVF9XSU47XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlUmlnaHQgPT0gZ2FtZWhvc3QpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJJR0hUX1dJTjtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Ugey8v5ZCM5Li65rS75Yqo5Li7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBMRUZUX1dJTjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChsZWZ0SXNIb3N0KSB7XHJcbiAgICAgICAgICAgIC8v5YWI54mM5piv5Li777yM5YWI54mM5aSnXHJcbiAgICAgICAgICAgIHJldHVybiBMRUZUX1dJTjtcclxuICAgICAgICB9IGVsc2UgaWYgKHJpZ2h0SXNIb3N0KSB7XHJcbiAgICAgICAgICAgIC8v5ZCO54mM5piv5Li777yM5ZCO54mM5aSnXHJcbiAgICAgICAgICAgIHJldHVybiBSSUdIVF9XSU47XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIFBva2VyVXRpbC5jb21wYXJlVmljZShyb3VuZGhvc3QsIHR5cGVMZWZ0LCB0eXBlUmlnaHQsIGNvbnRlbnRMZWZ0LCBjb250ZW50UmlnaHQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOS4jeWIpOaWreiKseiJsu+8jOebtOaOpeavlOWkp+WwjyDlj6rmjqXlj5fkuKTkvY1cclxuICAgICAqIOWFgeiuuOi/lOWbnjBcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjb21wYXJlU2luZ2xlUG9rZXJCaWdnZXIgPSAodmFsdWVMZWZ0LCB2YWx1ZVJpZ2h0KSA9PiB7XHJcbiAgICAgICAgaWYgKHZhbHVlTGVmdC5sZW5ndGggPiAyIHx8IHZhbHVlUmlnaHQubGVuZ3RoID4gMikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwi5Y+q5o6l5Y+X5Lik5L2N55qEXCIgKyB2YWx1ZUxlZnQgKyBcIi9cIiArIHZhbHVlUmlnaHQpO1xyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGxlZnROdW0gPSBwYXJzZUludCh2YWx1ZUxlZnQpO1xyXG4gICAgICAgIGxldCByaWdodE51bSA9IHBhcnNlSW50KHZhbHVlUmlnaHQpO1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBQb2tlclV0aWwucXVhcnlQb2tlcldlaWdodChyaWdodE51bSkgLSBQb2tlclV0aWwucXVhcnlQb2tlcldlaWdodChsZWZ0TnVtKTtcclxuICAgICAgICBpZiAocmVzdWx0ID4gMCkge1xyXG4gICAgICAgICAgICByZXN1bHQgPSBSSUdIVF9XSU47XHJcbiAgICAgICAgfSBlbHNlIGlmIChyZXN1bHQgPCAwKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IExFRlRfV0lOO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIpOaWreeJjOeahOWkp+Wwj1xyXG4gICAgICogQHBhcmFtIHsqfSBwb2tlclxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcXVhcnlQb2tlcldlaWdodChwb2tlcikge1xyXG4gICAgICAgIHJldHVybiBwb2tlcldlaWdodC5pbmRleE9mKHBva2VyKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIpOaWreeJjOaYr+S4jeaYr+a0u+WKqOS4uyAxNSAzIDXlr7nlupQgMiAzIDVcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHF1YXJ5SXNIb3N0KHBva2VyKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlID0gcGFyc2VJbnQocG9rZXIpO1xyXG4gICAgICAgIHJldHVybiB2YWx1ZSA9PSAxNSB8fCB2YWx1ZSA9PSAzIHx8IHZhbHVlID09IDUgfHwgdmFsdWUgPT0gMTYgfHwgdmFsdWUgPT0gMTcgfHwgdmFsdWUgPT0gMTg7Ly8yIDMgNSDlsI/njosg5aSn546LIOS4uzVcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOi/lOWbnuWIhuaVsOWAvFxyXG4gICAgICogQHBhcmFtIHBva2VyXHJcbiAgICAgKiBAcmV0dXJucyB7Kn1cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHF1YXJ5SXNTb2Nlcihwb2tlcil7XHJcbiAgICAgICAgaWYocG9rZXI9PTV8fHBva2VyPT0xMCl7XHJcbiAgICAgICAgICAgIHJldHVybiBwb2tlcjtcclxuICAgICAgICB9ZWxzZSBpZihwb2tlcj09MTMpe1xyXG4gICAgICAgICAgICByZXR1cm4gMTA7XHJcbiAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliKTmlq3lia/niYzosIHlpKdcclxuICAgICAqIEBwYXJhbSB7Kn0gcm91bmRob3N0XHJcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlTGVmdFxyXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZVJpZ2h0XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjb21wYXJlVmljZShyb3VuZGhvc3QsIHR5cGVMZWZ0LCB0eXBlUmlnaHQsIGNvbnRlbnRMZWZ0LCBjb250ZW50UmlnaHQpIHtcclxuICAgICAgICBpZiAodHlwZVJpZ2h0ID09IHR5cGVMZWZ0ID09IHJvdW5kaG9zdCkge1xyXG4gICAgICAgICAgICByZXR1cm4gUG9rZXJVdGlsLmNvbXBhcmVTaW5nbGVQb2tlckJpZ2dlcihjb250ZW50TGVmdCwgY29udGVudFJpZ2h0KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVMZWZ0ID09IHJvdW5kaG9zdCkge1xyXG4gICAgICAgICAgICByZXR1cm4gTEVGVF9XSU47XHJcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlUmlnaHQgPT0gcm91bmRob3N0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBSSUdIVF9XSU47XHJcbiAgICAgICAgfSBlbHNlIHsvL+mDveaYr+WJr+eJjCDkuI3mmK/mnKzova7kuLvvvIzlpJrljYrmmK/ot5/niYzvvIzmhI/kuYnkuI3lpKdcclxuICAgICAgICAgICAgcmV0dXJuIExFRlRfV0lOO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGNvbXBhcmVBcnJheSA9IChnYW1laG9zdCwgcm91bmRob3N0LCB2YWx1ZUxlZnQsIHZhbHVlUmlnaHQpID0+IHtcclxuICAgICAgICAvL+WBtuaVsOW8oO+8jOaOkuaVsOS4jeS4gOiHtFxyXG4gICAgICAgIGlmICh2YWx1ZUxlZnQubGVuZ3RoICE9IHZhbHVlUmlnaHQubGVuZ3RoIHx8IHZhbHVlTGVmdC5sZW5ndGggJSAyICE9IDApIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIm9uaW9uXCIsIFwi5pWw57uE6ZW/5bqm5LiN5LiA6Ie0XCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gTEVGVF9XSU47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vMSDmjpLluo9cclxuICAgICAgICBsZXQgYXJyYXlMZWZ0ID0gdmFsdWVMZWZ0LnNvcnQoKTtcclxuICAgICAgICBsZXQgYXJyYXlSaWdodCA9IHZhbHVlUmlnaHQuc29ydCgpO1xyXG4gICAgICAgIC8vMiDlpYfmlbDlkozlgbbmlbDkuIDmoLfvvIzliKTmlq3lr7nlrZDlkIjms5XmgKdcclxuICAgICAgICBsZXQgcmVzdWx0TGVmdCA9IFBva2VyVXRpbC5jaGVja0FycmF5VmFsdWUoYXJyYXlMZWZ0KTtcclxuICAgICAgICBsZXQgcmVzdWx0UmlnaHQgPSBQb2tlclV0aWwuY2hlY2tBcnJheVZhbHVlKGFycmF5UmlnaHQpO1xyXG4gICAgICAgIGlmIChyZXN1bHRMZWZ0WzBdID09IFwiLTFcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gUklHSFRfV0lOO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocmVzdWx0UmlnaHRbMF0gPT0gXCItMVwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBMRUZUX1dJTjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChnYW1laG9zdCA9PSByZXN1bHRMZWZ0WzBdID09IHJlc3VsdFJpZ2h0WzBdKSB7XHJcbiAgICAgICAgICAgIC8v6YO95piv5Li75a+5XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHRMZWZ0WzFdID4gcmVzdWx0UmlnaHRbMV0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBMRUZUX1dJTjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBSSUdIVF9XSU47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKGdhbWVob3N0ID09IHJlc3VsdExlZnRbMF0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIExFRlRfV0lOO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZ2FtZWhvc3QgPT0gcmVzdWx0UmlnaHRbMF0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIFJJR0hUX1dJTjtcclxuICAgICAgICB9IGVsc2UgaWYgKHJvdW5kaG9zdCA9PSByZXN1bHRMZWZ0WzBdID09IHJlc3VsdFJpZ2h0WzBdKSB7XHJcbiAgICAgICAgICAgIC8v6YO95piv5Ymv5a+5XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHRMZWZ0WzFdID4gcmVzdWx0UmlnaHRbMV0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBMRUZUX1dJTjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBSSUdIVF9XSU47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHJvdW5kaG9zdCA9PSByZXN1bHRMZWZ0WzBdKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBMRUZUX1dJTjtcclxuICAgICAgICB9IGVsc2UgaWYgKGdhbWVob3N0ID09IHJlc3VsdFJpZ2h0WzBdKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBSSUdIVF9XSU47XHJcbiAgICAgICAgfSBlbHNlIHsvL+mDveS4jeaYr+S4uyDot5/niYzlpKflsI/ml6DmhI/kuYlcclxuICAgICAgICAgICAgcmV0dXJuIExFRlRfV0lOO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy/kuIDlr7nnm7TmjqXmr5RcclxuICAgICAgICAvL+WkmuWvueWFiOagoemqjOWQiOazleaAp++8jDHmmK/lkKblpJrlr7kgMuaYr+WQpui/nuWvuSAz6Iqx6Imy5LiA6Ie0IDRcclxuXHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOWIpOaWreWvueWtkOWQiOazleaApyDov5Tlm55b6Iqx6ImyIOadg+mHjV1cclxuICAgICAqIEBwYXJhbSB7Kn0gYXJyYXkgXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjaGVja0FycmF5VmFsdWUgPSAoYXJyYXkpID0+IHtcclxuICAgICAgICBsZXQgb2RkID0gXCItMVwiO1xyXG4gICAgICAgIGxldCBldmVuID0gXCItMVwiXHJcbiAgICAgICAgbGV0IGxhc3RUeXBlID0gXCItMVwiO1xyXG4gICAgICAgIGxldCByZXN1bHQgPSAwO1xyXG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBhcnJheS5sZW5ndGg7IGluZGV4KyspIHtcclxuICAgICAgICAgICAgaWYgKGluZGV4ICUgMiA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBldmVuID0gYXJyYXlbaW5kZXhdO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgb2RkID0gYXJyYXlbaW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW4gIT0gb2RkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtcIi0xXCIsIC0xXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGxldCBjYXJkTnVtID0gb2RkO1xyXG4gICAgICAgICAgICAgICAgbGV0IHR5cGUgPSBcIjBcIjtcclxuICAgICAgICAgICAgICAgIGlmIChjYXJkTnVtID09IFwiMTcxXCIgfHwgY2FyZE51bSA9PSBcIjE2MVwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy/lpKflsI/njotcclxuICAgICAgICAgICAgICAgICAgICB0eXBlID0gXCI1XCI7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzdHIgPSBjYXJkTnVtLnN1YnN0cmluZygyKTtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlID0gUG9rZXJVdGlsLnF1YXJ5VHlwZShzdHIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGxhc3RUeXBlICE9IHR5cGUgJiYgbGFzdFR5cGUgIT0gXCItMVwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy/kuI3mmK/pppbmrKHkuJTkuI7kuYvliY3oirHoibLkuI3lkIzvvIzkuI3og73nrpflr7nlrZBcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW1wiLTFcIiwgLTFdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbGFzdFR5cGUgPSB0eXBlO1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvbXBhcmUgPSBjYXJkTnVtLnN1YnN0cmluZygwLCAyKTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdCArIFBva2VyVXRpbC5xdWFyeVBva2VyV2VpZ2h0KHBhcnNlSW50KGNvbXBhcmUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gW2xhc3RUeXBlLCByZXN1bHRdO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDmr5TmnKzova7lpKflsI/vvIzov5Tlm57otaLlrrYgMTIzNOmhuuS9jVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY29tcGFyZVJvdW5kID0gKHBsYXlQb2tlcnMpID0+IHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGRlc3RvcnlBcnJheSA9IChkZXN0b3J5Tm9kZSkgPT4ge1xyXG4gICAgICAgIGlmIChkZXN0b3J5Tm9kZSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGVzdG9yeU5vZGUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGRlc3RvcnlOb2RlW2ldLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHN0YXRpYyBzb3J0PShhLGIpPT57XHJcbiAgICAgICAgYT1NYXRoLmZsb29yKGEvMTApO1xyXG4gICAgICAgIGI9TWF0aC5mbG9vcihiLzEwKTtcclxuICAgICAgICBsZXQgbGVmdD1Qb2tlclV0aWwucXVhcnlQb2tlcldlaWdodChhKTtcclxuICAgICAgICBsZXQgcmlnaHQ9UG9rZXJVdGlsLnF1YXJ5UG9rZXJXZWlnaHQoYik7XHJcbiAgICAgICAgcmV0dXJuIGxlZnQtcmlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHNvcnRJbnNlcnQ9KGFycmF5LGl0ZW0pPT57XHJcbiAgICAgICAgaWYoYXJyYXkubGVuZ3RoPT09MCl7XHJcbiAgICAgICAgICAgIGFycmF5LnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgIHJldHVybiBhcnJheVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBsZXQgdmFsdWU9aXRlbS5zdWJzdHJpbmcoMCwyKTtcclxuICAgICAgICBsZXQgdmFsdWU9aXRlbS8xMDtcclxuICAgICAgICBsZXQgd2VpZ2h0PVBva2VyVXRpbC5xdWFyeVBva2VyV2VpZ2h0KHZhbHVlKTtcclxuICAgICAgICBsZXQgZmlyc3RXZWlnaHQ9UG9rZXJVdGlsLnF1YXJ5UG9rZXJXZWlnaHQoYXJyYXlbMF0vMTApO1xyXG4gICAgICAgIGxldCBsYXN0V2VpZ2h0PVBva2VyVXRpbC5xdWFyeVBva2VyV2VpZ2h0KGFycmF5W2FycmF5Lmxlbmd0aC0xXS8xMCk7XHJcbiAgICAgICAgaWYod2VpZ2h0PD1maXJzdFdlaWdodCl7XHJcbiAgICAgICAgICAgIGFycmF5PVtpdGVtLC4uLmFycmF5XTtcclxuICAgICAgICAgICAgLy8gYXJyYXkudW5zaGlmdChpdGVtKTtcclxuICAgICAgICB9ZWxzZSBpZih3ZWlnaHQ+PWxhc3RXZWlnaHQpe1xyXG4gICAgICAgICAgICBhcnJheS5wdXNoKGl0ZW0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXJyYXk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBxdWFyeVR5cGUgPSAodHlwZSkgPT4ge1xyXG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwiMVwiOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwi5pa55Z2XXCI7XHJcbiAgICAgICAgICAgIGNhc2UgXCIyXCI6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCLmooXoirFcIjtcclxuICAgICAgICAgICAgY2FzZSBcIjNcIjpcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIue6ouahg1wiO1xyXG4gICAgICAgICAgICBjYXNlIFwiNFwiOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwi6buR5qGDXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc3RhdGljIHF1YXJ5UG9rZXJUeXBlVmFsdWUgPSAocG9rZXJWYWx1ZSkgPT4ge1xyXG4gICAgICAgIHBva2VyVmFsdWU9cG9rZXJWYWx1ZStcIlwiO1xyXG4gICAgICAgIGlmIChwb2tlclZhbHVlID09IFwiMTcxXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiM1wiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocG9rZXJWYWx1ZSA9PSBcIjE2MVwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIjRcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJvbmlvblwiLFwicG9rZXJWYWx1ZVwiK3Bva2VyVmFsdWUpO1xyXG4gICAgICAgIHJldHVybiBwb2tlclZhbHVlLnN1YnN0cmluZygyKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog6YCa6L+H54mM5bqP5p+l6Iqx6Imy5aSn5bCPXHJcbiAgICAgKiDmnIDlkI7kuIDkvY3mmK/oirHoibJcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHF1YXJ5UG9rZXJWYWx1ZSA9ICh2YWx1ZSkgPT4ge1xyXG4gICAgICAgIGxldCBjYXJkTnVtID0gdmFsdWUgKyBcIlwiO1xyXG4gICAgICAgIGlmIChjYXJkTnVtID09IFwiMTcxXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwi5aSn546LXCI7XHJcbiAgICAgICAgfSBlbHNlIGlmIChjYXJkTnVtID09IFwiMTYxXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwi5bCP546LXCJcclxuICAgICAgICB9IGVsc2UgaWYgKGNhcmROdW0gPT0gXCIxODFcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gXCLljaHog4xcIlxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBjb21wYXJlID0gY2FyZE51bS5zdWJzdHJpbmcoMCwgMik7XHJcbiAgICAgICAgICAgIGxldCB0eXBlID0gY2FyZE51bS5zdWJzdHJpbmcoMik7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQgPSBQb2tlclV0aWwucXVhcnlUeXBlKHR5cGUpO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKGNvbXBhcmUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCIwM1wiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdCArIFwiM1wiO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIjA0XCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgXCI0XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCIwNVwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdCArIFwiNVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIjA2XCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgXCI2XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiMDdcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHQgKyBcIjdcIjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCIwOFwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdCArIFwiOFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIjA5XCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgXCI5XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiMTBcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHQgKyBcIjEwXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiMTFcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHQgKyBcIkpcIjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCIxMlwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdCArIFwiUVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIjEzXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgXCJLXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiMTRcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHQgKyBcIkFcIjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCIxNVwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdCArIFwiMlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5oqK54mM5oyJ6Iqx6Imy5o6S5aW9XHJcbiAgICAgKiBAcGFyYW0gZ2FtZUhvc3RcclxuICAgICAqIEBwYXJhbSBjYXJkQXJyYXlcclxuICAgICAqIEByZXR1cm5zXHJcbiAgICAgKiAge1xyXG4gICAgICAgICAgICB0eXBlMUFycmF5OnR5cGUxQXJyYXksXHJcbiAgICAgICAgICAgIHR5cGUyQXJyYXk6dHlwZTJBcnJheSxcclxuICAgICAgICAgICAgdHlwZTNBcnJheTp0eXBlM0FycmF5LFxyXG4gICAgICAgICAgICB0eXBlNEFycmF5OnR5cGU0QXJyYXksXHJcbiAgICAgICAgICAgIGhvc3RBcnJheTpob3N0QXJyYXksXHJcbiAgICAgICAgICAgIHRvdGFsOnRvdGFsXHJcbiAgICAgICAgfVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgc29ydFBva2Vycz0oZ2FtZUhvc3QsY2FyZEFycmF5KT0+e1xyXG4gICAgICAgIGxldCB0eXBlMUFycmF5PVtdO1xyXG4gICAgICAgIGxldCB0eXBlMkFycmF5PVtdO1xyXG4gICAgICAgIGxldCB0eXBlM0FycmF5PVtdO1xyXG4gICAgICAgIGxldCB0eXBlNEFycmF5PVtdO1xyXG4gICAgICAgIGxldCBob3N0QXJyYXk9W107Ly/mtLvliqjkuLtcclxuICAgICAgICBmb3IobGV0IGk9MDtpPGNhcmRBcnJheS5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgbGV0IGl0ZW09Y2FyZEFycmF5W2ldO1xyXG4gICAgICAgICAgICBpZihpdGVtPT0xNzF8fGl0ZW09PTE2MSl7XHJcbiAgICAgICAgICAgICAgICBob3N0QXJyYXkucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBsZXQgdHlwZT1wYXJzZUludChpdGVtLnN1YnN0cmluZygyKSk7XHJcbiAgICAgICAgICAgIGxldCB2YWx1ZT1NYXRoLmZsb29yKGl0ZW0vMTApO1xyXG4gICAgICAgICAgICBpZihQb2tlclV0aWwucXVhcnlJc0hvc3QodmFsdWUpKXtcclxuICAgICAgICAgICAgICAgIGhvc3RBcnJheS5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IHR5cGU9aXRlbSUxMDtcclxuICAgICAgICAgICAgc3dpdGNoICh0eXBlKXtcclxuICAgICAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgICAgICB0eXBlMUFycmF5LnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTJBcnJheS5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGUzQXJyYXkucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgICAgICAgICB0eXBlNEFycmF5LnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaG9zdEFycmF5LnNvcnQoUG9rZXJVdGlsLnNvcnQpO1xyXG4gICAgICAgIHR5cGUxQXJyYXkuc29ydChQb2tlclV0aWwuc29ydCk7XHJcbiAgICAgICAgdHlwZTJBcnJheS5zb3J0KFBva2VyVXRpbC5zb3J0KTtcclxuICAgICAgICB0eXBlM0FycmF5LnNvcnQoUG9rZXJVdGlsLnNvcnQpO1xyXG4gICAgICAgIHR5cGUzQXJyYXkuc29ydChQb2tlclV0aWwuc29ydCk7XHJcbiAgICAgICAgc3dpdGNoIChwYXJzZUludChnYW1lSG9zdCkpe1xyXG4gICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUG9rZXJVdGlsLmNyZWF0ZVN0YXRpYyh0eXBlMUFycmF5LHR5cGUyQXJyYXksdHlwZTNBcnJheSx0eXBlNEFycmF5LGhvc3RBcnJheSxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlMkFycmF5LmNvbmNhdCh0eXBlM0FycmF5KS5jb25jYXQodHlwZTRBcnJheSkuY29uY2F0KHR5cGUxQXJyYXkpLmNvbmNhdChob3N0QXJyYXkpKTtcclxuICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFBva2VyVXRpbC5jcmVhdGVTdGF0aWModHlwZTFBcnJheSx0eXBlMkFycmF5LHR5cGUzQXJyYXksdHlwZTRBcnJheSxob3N0QXJyYXksXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTNBcnJheS5jb25jYXQodHlwZTRBcnJheSkuY29uY2F0KHR5cGUxQXJyYXkpLmNvbmNhdCh0eXBlMkFycmF5KS5jb25jYXQoaG9zdEFycmF5KSk7XHJcbiAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICAgIHJldHVybiBQb2tlclV0aWwuY3JlYXRlU3RhdGljKHR5cGUxQXJyYXksdHlwZTJBcnJheSx0eXBlM0FycmF5LHR5cGU0QXJyYXksaG9zdEFycmF5LFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU0QXJyYXkuY29uY2F0KHR5cGUxQXJyYXkpLmNvbmNhdCh0eXBlMkFycmF5KS5jb25jYXQodHlwZTNBcnJheSkuY29uY2F0KGhvc3RBcnJheSkpO1xyXG4gICAgICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUG9rZXJVdGlsLmNyZWF0ZVN0YXRpYyh0eXBlMUFycmF5LHR5cGUyQXJyYXksdHlwZTNBcnJheSx0eXBlNEFycmF5LGhvc3RBcnJheSxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlMUFycmF5LmNvbmNhdCh0eXBlMkFycmF5KS5jb25jYXQodHlwZTNBcnJheSkuY29uY2F0KHR5cGU0QXJyYXkpLmNvbmNhdChob3N0QXJyYXkpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICBcclxuICAgc3RhdGljIGNyZWF0ZVN0YXRpYz0odHlwZTFBcnJheSx0eXBlMkFycmF5LHR5cGUzQXJyYXksdHlwZTRBcnJheSxob3N0QXJyYXksdG90YWwpPT57XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgdHlwZTFBcnJheTp0eXBlMUFycmF5LFxyXG4gICAgICAgICAgICB0eXBlMkFycmF5OnR5cGUyQXJyYXksXHJcbiAgICAgICAgICAgIHR5cGUzQXJyYXk6dHlwZTNBcnJheSxcclxuICAgICAgICAgICAgdHlwZTRBcnJheTp0eXBlNEFycmF5LFxyXG4gICAgICAgICAgICBob3N0QXJyYXk6aG9zdEFycmF5LFxyXG4gICAgICAgICAgICB0b3RhbDp0b3RhbFxyXG4gICAgICAgIH1cclxuXHJcbiAgIH1cclxuXHJcbiAgIHN0YXRpYyBzYXZlUmVjb2Rlcj0oKT0+e1xyXG4gICAgICAgbGV0IHVzZXJEYXRhID0ge1xyXG4gICAgICAgICAgIG5hbWU6ICdUcmFjZXInLFxyXG4gICAgICAgICAgIGxldmVsOiAxLFxyXG4gICAgICAgICAgIGdvbGQ6IDEwMFxyXG4gICAgICAgfTtcclxuXHJcbiAgICAgICBjYy5zeXMubG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3VzZXJEYXRhJywgSlNPTi5zdHJpbmdpZnkodXNlckRhdGEpKTtcclxuICAgfVxyXG4gICBzdGF0aWMgcXVhcnlSZW9jZGVyPSgpPT57XHJcbiAgICAgICBsZXQgdXNlckRhdGEgPSBKU09OLnBhcnNlKGNjLnN5cy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlckRhdGEnKSk7XHJcbiAgIH1cclxuXHJcbn0iXX0=
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
   * 检测用户出的牌是否合法
   * @param gameHost
   * @param roundHost
   * @param userCard
   * @param cardArray
   */
  _proto.checkUserCanSend = function checkUserCanSend(gameHost, roundHost, userPokerObj, willSendCard) {
    if (Array.isArray(willSendCard)) {
      //暂时不支持
      console.log("onion", "暂时不支持出对");
      return false;
    }

    if (!roundHost) {
      //没有本轮主，玩家头一个出牌
      return true;
    }

    if (gameHost == roundHost) {
      var targetArray = this.selectArrayFrom(true, roundHost, userPokerObj); //调主

      if (userPokerObj.hostArray.length > 0 || targetArray.length > 0) {
        //有主牌必须出主牌
        var flag1 = userPokerObj.hostArray.indexOf(willSendCard) !== -1;
        var flag2 = targetArray.indexOf(willSendCard) !== -1;
        return flag2 || flag1;
      } //没主了随便出

    } else {
      //花色相同可以出
      var _targetArray = this.selectArrayFrom(true, roundHost, userPokerObj);

      if (_targetArray.length > 0) {
        return _targetArray.indexOf(willSendCard) !== -1;
      } //无roundHost花色可以出

    } //出副牌时，有副牌必须出副牌


    return true;
  }
  /**
   * 游戏每轮逻辑，
   * 赢家出牌，确定本轮主
   * 下家出牌 调sendAIFollowCard
   * 4家都出完结算，积分计算，结束本轮，返回积分
   * @param onRoundCallBack  回调 该相应玩家出牌
   * @param winLocal 优先出牌方 索引从0开始
   * @param gameHost 当前游戏主
   */
  ;

  _proto.roundProgram = function roundProgram(onUserPlayCallBack, onRoundCallBack, roundOverCallBack, winLocal, gameHost, sendArray) {
    var roundHost = null;

    if (!sendArray || sendArray.length === 0) {
      sendArray = []; //本轮出的牌
    } else {
      var pokers = sendArray[0];

      if (Array.isArray(pokers)) {
        roundHost = this.intGetType(pokers[0]);
        console.log("onion", "暂不支持出对");
        return;
      } else {
        roundHost = this.intGetType(pokers);
      }
    }

    for (var i = 0; i < 4 - sendArray.length; i++) {
      var currentPlayer = (winLocal + i) % 4;

      if (currentPlayer == 0) {
        onUserPlayCallBack(gameHost, roundHost, sendArray, currentPlayer);
        return;
      }

      var _pokers = onRoundCallBack(gameHost, roundHost, sendArray, currentPlayer);

      if (sendArray.length == 0) {
        if (Array.isArray(_pokers)) {
          roundHost = this.intGetType(_pokers[0]);
          console.log("onion", "暂不支持出对");
          return;
        } else {
          roundHost = this.intGetType(_pokers);
        }
      }

      sendArray.push(_pokers);
    }

    var bigger = null;
    var sumSocer = 0;
    var winnerPosition = 0; //判断哪方牌大

    for (var _i = 0; _i < sendArray.length; _i++) {
      var item = sendArray[_i];
      var content = this.intGetContent(item);
      sumSocer += _PokerUtil["default"].quaryIsSocer(content);

      if (bigger == null) {
        bigger = item;
        winnerPosition = _i;
        continue;
      }

      var result = _PokerUtil["default"].comparePoker(gameHost, roundHost, item, bigger);

      if (result == LEFT_WIN) {
        bigger = item;
        winnerPosition = _i;
      }
    }

    winnerPosition += winLocal;
    winnerPosition = winnerPosition % 4;

    if (winnerPosition == 0 || winnerPosition == 2) {//加分
    } else {
      sumSocer = 0;
    }

    roundOverCallBack(winnerPosition, sumSocer);
  }
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
        return pokerObj.total[pokerObj.total.length - 1];
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
   * @param {*} isHost  固定主数组
   * @param {*} type    花色类型
   * @param {*} pokerObj  牌组对象
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcQUlIZWxwZXIuanMiXSwibmFtZXMiOlsicG9rZXJXZWlnaHQiLCJMRUZUX1dJTiIsIlJJR0hUX1dJTiIsIkFJSGVscGVyIiwiY2hlY2tVc2VyQ2FuU2VuZCIsImdhbWVIb3N0Iiwicm91bmRIb3N0IiwidXNlclBva2VyT2JqIiwid2lsbFNlbmRDYXJkIiwiQXJyYXkiLCJpc0FycmF5IiwiY29uc29sZSIsImxvZyIsInRhcmdldEFycmF5Iiwic2VsZWN0QXJyYXlGcm9tIiwiaG9zdEFycmF5IiwibGVuZ3RoIiwiZmxhZzEiLCJpbmRleE9mIiwiZmxhZzIiLCJyb3VuZFByb2dyYW0iLCJvblVzZXJQbGF5Q2FsbEJhY2siLCJvblJvdW5kQ2FsbEJhY2siLCJyb3VuZE92ZXJDYWxsQmFjayIsIndpbkxvY2FsIiwic2VuZEFycmF5IiwicG9rZXJzIiwiaW50R2V0VHlwZSIsImkiLCJjdXJyZW50UGxheWVyIiwicHVzaCIsImJpZ2dlciIsInN1bVNvY2VyIiwid2lubmVyUG9zaXRpb24iLCJpdGVtIiwiY29udGVudCIsImludEdldENvbnRlbnQiLCJQb2tlclV0aWwiLCJxdWFyeUlzU29jZXIiLCJyZXN1bHQiLCJjb21wYXJlUG9rZXIiLCJzZW5kQUlIb3N0Q2FyZCIsImdhbWVob3N0IiwiY2FyZEFycmF5Iiwic2VuZENhcmRJbmRleHMiLCJ0eXBlIiwic3Vic3RyaW5nIiwidmFsdWUiLCJpc0hvc3QiLCJxdWFyeUlzSG9zdCIsInNlbmRDYXJkIiwic2VuZFZhbHVlIiwiY29tcGFyZVNpbmdsZVBva2VyQmlnZ2VyIiwic2VuZEFJRm9sbG93Q2FyZCIsInVzZXJDYXJkIiwicG9rZXJPYmoiLCJlcnJvciIsInNlY29uZExvZ2ljIiwic2VuZFRocmlkUG9rZXIiLCJzZWxlY3RTaW5nbGVCaWdlclBva2VyIiwiZmlyc3RDYXJkIiwic2Vjb25kQ2FyZCIsInNlbGVjdFNvY2VyUG9rZXIiLCJzZW5kRm9ydGhQb2tlciIsInRocmlkQ2FyZCIsInRhcmdldFBva2VyIiwiY2FyZFZhbHVlIiwidHlwZVZhbHVlIiwiY29udGVudFZhbHVlIiwiYXJyYXkiLCJ0b3RhbCIsImlzQSIsInBva2VyQXJyYXkiLCJzZWxlY3RTY29lckZyb21BcnJheSIsInR5cGUxQXJyYXkiLCJ0eXBlMkFycmF5IiwidHlwZTNBcnJheSIsInR5cGU0QXJyYXkiLCJyZW1vdmVQb2tlckZyb21BcnJheSIsInBva2VyTnVtIiwiaW5kZXgiLCJzcGxpY2UiLCJNYXRoIiwiZmxvb3IiLCJzdHJHZXRUeXBlIiwic3RyR2V0Q29udGVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUVBLElBQUlBLFdBQVcsR0FBRyxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCLEVBQWhCLEVBQW9CLEVBQXBCLEVBQXdCLEVBQXhCLEVBQTRCLEVBQTVCLEVBQWdDLEVBQWhDLEVBQW9DLEVBQXBDLEVBQXdDLENBQXhDLEVBQTJDLENBQTNDLEVBQThDLEVBQTlDLEVBQWtELEVBQWxELEVBQXNELEVBQXRELENBQWxCLEVBQTRFOztBQUM1RSxJQUFJQyxRQUFRLEdBQUcsQ0FBQyxDQUFoQjtBQUNBLElBQUlDLFNBQVMsR0FBRyxDQUFoQjs7SUFDcUJDOzs7OztBQUVqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBOzs7Ozs7O1NBT0FDLG1CQUFBLDBCQUFpQkMsUUFBakIsRUFBMkJDLFNBQTNCLEVBQXNDQyxZQUF0QyxFQUFvREMsWUFBcEQsRUFBa0U7QUFDOUQsUUFBSUMsS0FBSyxDQUFDQyxPQUFOLENBQWNGLFlBQWQsQ0FBSixFQUFpQztBQUM3QjtBQUNBRyxNQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxPQUFaLEVBQXFCLFNBQXJCO0FBQ0EsYUFBTyxLQUFQO0FBQ0g7O0FBQ0QsUUFBRyxDQUFDTixTQUFKLEVBQWM7QUFDVjtBQUNBLGFBQU8sSUFBUDtBQUNIOztBQUNELFFBQUdELFFBQVEsSUFBRUMsU0FBYixFQUF1QjtBQUNuQixVQUFJTyxXQUFXLEdBQUMsS0FBS0MsZUFBTCxDQUFxQixJQUFyQixFQUEwQlIsU0FBMUIsRUFBb0NDLFlBQXBDLENBQWhCLENBRG1CLENBRW5COztBQUNBLFVBQUdBLFlBQVksQ0FBQ1EsU0FBYixDQUF1QkMsTUFBdkIsR0FBOEIsQ0FBOUIsSUFBaUNILFdBQVcsQ0FBQ0csTUFBWixHQUFtQixDQUF2RCxFQUF5RDtBQUNyRDtBQUNELFlBQUlDLEtBQUssR0FBRVYsWUFBWSxDQUFDUSxTQUFiLENBQXVCRyxPQUF2QixDQUErQlYsWUFBL0IsTUFBK0MsQ0FBQyxDQUEzRDtBQUNBLFlBQUlXLEtBQUssR0FBQ04sV0FBVyxDQUFDSyxPQUFaLENBQW9CVixZQUFwQixNQUFvQyxDQUFDLENBQS9DO0FBQ0EsZUFBT1csS0FBSyxJQUFFRixLQUFkO0FBQ0YsT0FSa0IsQ0FTbkI7O0FBQ0gsS0FWRCxNQVVNO0FBQ0Y7QUFDQSxVQUFJSixZQUFXLEdBQUMsS0FBS0MsZUFBTCxDQUFxQixJQUFyQixFQUEwQlIsU0FBMUIsRUFBb0NDLFlBQXBDLENBQWhCOztBQUNBLFVBQUdNLFlBQVcsQ0FBQ0csTUFBWixHQUFtQixDQUF0QixFQUF3QjtBQUNwQixlQUFPSCxZQUFXLENBQUNLLE9BQVosQ0FBb0JWLFlBQXBCLE1BQW9DLENBQUMsQ0FBNUM7QUFDSCxPQUxDLENBTUY7O0FBRUgsS0E1QjZELENBNkI5RDs7O0FBQ0EsV0FBTyxJQUFQO0FBR0g7QUFFRDs7Ozs7Ozs7Ozs7U0FTQVksZUFBQSxzQkFBYUMsa0JBQWIsRUFBaUNDLGVBQWpDLEVBQWtEQyxpQkFBbEQsRUFBb0VDLFFBQXBFLEVBQThFbkIsUUFBOUUsRUFBdUZvQixTQUF2RixFQUFrRztBQUM5RixRQUFJbkIsU0FBUyxHQUFHLElBQWhCOztBQUNBLFFBQUcsQ0FBQ21CLFNBQUQsSUFBWUEsU0FBUyxDQUFDVCxNQUFWLEtBQW1CLENBQWxDLEVBQW9DO0FBQ2hDUyxNQUFBQSxTQUFTLEdBQUMsRUFBVixDQURnQyxDQUNuQjtBQUNoQixLQUZELE1BRU07QUFDRixVQUFJQyxNQUFNLEdBQUVELFNBQVMsQ0FBQyxDQUFELENBQXJCOztBQUNBLFVBQUdoQixLQUFLLENBQUNDLE9BQU4sQ0FBY2dCLE1BQWQsQ0FBSCxFQUF5QjtBQUNyQnBCLFFBQUFBLFNBQVMsR0FBRyxLQUFLcUIsVUFBTCxDQUFnQkQsTUFBTSxDQUFDLENBQUQsQ0FBdEIsQ0FBWjtBQUNBZixRQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxPQUFaLEVBQW9CLFFBQXBCO0FBQ0E7QUFDSCxPQUpELE1BSU07QUFDRk4sUUFBQUEsU0FBUyxHQUFHLEtBQUtxQixVQUFMLENBQWdCRCxNQUFoQixDQUFaO0FBQ0g7QUFDSjs7QUFFRCxTQUFLLElBQUlFLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUcsSUFBRUgsU0FBUyxDQUFDVCxNQUFoQyxFQUF3Q1ksQ0FBQyxFQUF6QyxFQUE2QztBQUN6QyxVQUFJQyxhQUFhLEdBQUcsQ0FBQ0wsUUFBUSxHQUFHSSxDQUFaLElBQWUsQ0FBbkM7O0FBQ0EsVUFBR0MsYUFBYSxJQUFFLENBQWxCLEVBQW9CO0FBQ2hCUixRQUFBQSxrQkFBa0IsQ0FBQ2hCLFFBQUQsRUFBV0MsU0FBWCxFQUFzQm1CLFNBQXRCLEVBQWlDSSxhQUFqQyxDQUFsQjtBQUNBO0FBQ0g7O0FBQ0QsVUFBSUgsT0FBTSxHQUFFSixlQUFlLENBQUNqQixRQUFELEVBQVdDLFNBQVgsRUFBc0JtQixTQUF0QixFQUFpQ0ksYUFBakMsQ0FBM0I7O0FBQ0EsVUFBR0osU0FBUyxDQUFDVCxNQUFWLElBQWtCLENBQXJCLEVBQXVCO0FBQ25CLFlBQUdQLEtBQUssQ0FBQ0MsT0FBTixDQUFjZ0IsT0FBZCxDQUFILEVBQXlCO0FBQ3JCcEIsVUFBQUEsU0FBUyxHQUFHLEtBQUtxQixVQUFMLENBQWdCRCxPQUFNLENBQUMsQ0FBRCxDQUF0QixDQUFaO0FBQ0FmLFVBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLE9BQVosRUFBb0IsUUFBcEI7QUFDQTtBQUNILFNBSkQsTUFJTTtBQUNGTixVQUFBQSxTQUFTLEdBQUcsS0FBS3FCLFVBQUwsQ0FBZ0JELE9BQWhCLENBQVo7QUFDSDtBQUNKOztBQUNERCxNQUFBQSxTQUFTLENBQUNLLElBQVYsQ0FBZUosT0FBZjtBQUNIOztBQUNELFFBQUlLLE1BQU0sR0FBQyxJQUFYO0FBQ0EsUUFBSUMsUUFBUSxHQUFDLENBQWI7QUFDQSxRQUFJQyxjQUFjLEdBQUMsQ0FBbkIsQ0FuQzhGLENBb0M5Rjs7QUFDQSxTQUFJLElBQUlMLEVBQUMsR0FBQyxDQUFWLEVBQVlBLEVBQUMsR0FBQ0gsU0FBUyxDQUFDVCxNQUF4QixFQUErQlksRUFBQyxFQUFoQyxFQUFtQztBQUMvQixVQUFJTSxJQUFJLEdBQUNULFNBQVMsQ0FBQ0csRUFBRCxDQUFsQjtBQUNBLFVBQUlPLE9BQU8sR0FBQyxLQUFLQyxhQUFMLENBQW1CRixJQUFuQixDQUFaO0FBQ0FGLE1BQUFBLFFBQVEsSUFBRUssc0JBQVVDLFlBQVYsQ0FBdUJILE9BQXZCLENBQVY7O0FBQ0EsVUFBR0osTUFBTSxJQUFFLElBQVgsRUFBZ0I7QUFDWkEsUUFBQUEsTUFBTSxHQUFDRyxJQUFQO0FBQ0FELFFBQUFBLGNBQWMsR0FBQ0wsRUFBZjtBQUNBO0FBQ0g7O0FBQ0QsVUFBSVcsTUFBTSxHQUFDRixzQkFBVUcsWUFBVixDQUF1Qm5DLFFBQXZCLEVBQWdDQyxTQUFoQyxFQUEwQzRCLElBQTFDLEVBQStDSCxNQUEvQyxDQUFYOztBQUNBLFVBQUdRLE1BQU0sSUFBRXRDLFFBQVgsRUFBb0I7QUFDaEI4QixRQUFBQSxNQUFNLEdBQUNHLElBQVA7QUFDQUQsUUFBQUEsY0FBYyxHQUFDTCxFQUFmO0FBQ0g7QUFDSjs7QUFDREssSUFBQUEsY0FBYyxJQUFFVCxRQUFoQjtBQUNBUyxJQUFBQSxjQUFjLEdBQUNBLGNBQWMsR0FBQyxDQUE5Qjs7QUFDQSxRQUFHQSxjQUFjLElBQUUsQ0FBaEIsSUFBbUJBLGNBQWMsSUFBRSxDQUF0QyxFQUF3QyxDQUNwQztBQUNILEtBRkQsTUFFTTtBQUNGRCxNQUFBQSxRQUFRLEdBQUMsQ0FBVDtBQUNIOztBQUNEVCxJQUFBQSxpQkFBaUIsQ0FBQ1UsY0FBRCxFQUFnQkQsUUFBaEIsQ0FBakI7QUFDSDtBQUVEOzs7Ozs7Ozs7Ozs7U0FVQVMsaUJBQUEsd0JBQWVDLFFBQWYsRUFBeUJDLFNBQXpCLEVBQW9DO0FBQ2hDLFFBQUlDLGNBQWMsR0FBRyxFQUFyQjs7QUFDQSxTQUFLLElBQUloQixDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHZSxTQUFTLENBQUMzQixNQUE5QixFQUFzQ1ksQ0FBQyxFQUF2QyxFQUEyQztBQUN2QyxVQUFJaUIsSUFBSSxHQUFHRixTQUFTLENBQUNmLENBQUQsQ0FBVCxDQUFha0IsU0FBYixDQUF1QixDQUF2QixDQUFYO0FBQ0EsVUFBSUMsS0FBSyxHQUFHSixTQUFTLENBQUNmLENBQUQsQ0FBVCxDQUFha0IsU0FBYixDQUF1QixDQUF2QixFQUEwQixDQUExQixDQUFaOztBQUNBLFVBQUlFLE1BQU0sR0FBR0gsSUFBSSxJQUFJSCxRQUFSLElBQW9CTCxzQkFBVVksV0FBVixDQUFzQkYsS0FBdEIsQ0FBakM7O0FBQ0EsVUFBSSxDQUFDQyxNQUFMLEVBQWE7QUFDVCxZQUFJSixjQUFjLENBQUM1QixNQUFmLEtBQTBCLENBQTlCLEVBQWlDO0FBQzdCNEIsVUFBQUEsY0FBYyxDQUFDZCxJQUFmLENBQW9CRixDQUFwQjtBQUNILFNBRkQsTUFFTztBQUNILGNBQUllLFNBQVMsQ0FBQ0MsY0FBYyxDQUFDLENBQUQsQ0FBZixDQUFULElBQWdDRCxTQUFTLENBQUNmLENBQUQsQ0FBN0MsRUFBa0Q7QUFDOUNnQixZQUFBQSxjQUFjLENBQUNkLElBQWYsQ0FBb0JGLENBQXBCO0FBQ0E7QUFDSDs7QUFDRCxjQUFJc0IsUUFBUSxHQUFHUCxTQUFTLENBQUNDLGNBQWMsQ0FBQyxDQUFELENBQWYsQ0FBeEI7QUFDQSxjQUFJTyxTQUFTLEdBQUdELFFBQVEsQ0FBQ0osU0FBVCxDQUFtQixDQUFuQixFQUFzQixDQUF0QixDQUFoQjs7QUFDQSxjQUFJUCxNQUFNLEdBQUdGLHNCQUFVZSx3QkFBVixDQUFtQ0QsU0FBbkMsRUFBOENKLEtBQTlDLENBQWI7O0FBQ0EsY0FBSVIsTUFBTSxHQUFHckMsU0FBYixFQUF3QjtBQUNwQmdELFlBQUFBLFFBQVEsR0FBR0gsS0FBWDtBQUNIO0FBQ0o7QUFDSixPQWZELE1BZU87QUFDSCxZQUFJSCxjQUFjLENBQUM1QixNQUFmLEtBQTBCLENBQTlCLEVBQWlDO0FBQzdCO0FBQ0E0QixVQUFBQSxjQUFjLENBQUNkLElBQWYsQ0FBb0JGLENBQXBCO0FBQ0gsU0FIRCxNQUdPO0FBQ0gsY0FBSWUsU0FBUyxDQUFDQyxjQUFjLENBQUMsQ0FBRCxDQUFmLENBQVQsSUFBZ0NELFNBQVMsQ0FBQ2YsQ0FBRCxDQUE3QyxFQUFrRDtBQUM5Q2dCLFlBQUFBLGNBQWMsQ0FBQ2QsSUFBZixDQUFvQkYsQ0FBcEI7QUFDQTtBQUNIOztBQUNELGNBQUlzQixTQUFRLEdBQUdQLFNBQVMsQ0FBQ0MsY0FBYyxDQUFDLENBQUQsQ0FBZixDQUF4Qjs7QUFDQSxjQUFJTyxVQUFTLEdBQUdELFNBQVEsQ0FBQ0osU0FBVCxDQUFtQixDQUFuQixFQUFzQixDQUF0QixDQUFoQjs7QUFDQSxjQUFJUCxPQUFNLEdBQUdGLHNCQUFVZSx3QkFBVixDQUFtQ0QsVUFBbkMsRUFBOENKLEtBQTlDLENBQWI7O0FBQ0EsY0FBSVIsT0FBTSxHQUFHdEMsUUFBYixFQUF1QjtBQUNuQmlELFlBQUFBLFNBQVEsR0FBR0gsS0FBWDtBQUNIO0FBQ0o7QUFDSjtBQUNKOztBQUNELFdBQU9ILGNBQVA7QUFFSDtBQUVEOzs7Ozs7Ozs7Ozs7U0FVQVMsbUJBQUEsMEJBQWlCaEQsUUFBakIsRUFBMkJDLFNBQTNCLEVBQXNDZ0QsUUFBdEMsRUFBZ0RDLFFBQWhELEVBQTBEO0FBQ3RELFlBQVFELFFBQVEsQ0FBQ3RDLE1BQWpCO0FBQ0ksV0FBSyxDQUFMO0FBQU87QUFDSEwsUUFBQUEsT0FBTyxDQUFDNkMsS0FBUixDQUFjLE9BQWQsRUFBdUIsb0RBQXZCO0FBQ0E7O0FBRUosV0FBSyxDQUFMO0FBQU87QUFDSCxlQUFPLEtBQUtDLFdBQUwsQ0FBaUJwRCxRQUFqQixFQUEyQkMsU0FBM0IsRUFBc0NnRCxRQUF0QyxFQUFnREMsUUFBaEQsQ0FBUDs7QUFDSixXQUFLLENBQUw7QUFBTztBQUNILGVBQU8sS0FBS0csY0FBTCxDQUFvQnJELFFBQXBCLEVBQThCQyxTQUE5QixFQUF5Q2dELFFBQXpDLEVBQW1EQyxRQUFuRCxDQUFQO0FBUlI7QUFXSDs7U0FFREUsY0FBQSxxQkFBWXBELFFBQVosRUFBc0JDLFNBQXRCLEVBQWlDZ0QsUUFBakMsRUFBMkNDLFFBQTNDLEVBQXFEO0FBQ2pELFFBQUlELFFBQVEsQ0FBQyxDQUFELENBQVIsQ0FBWXRDLE1BQVosR0FBcUIsQ0FBekIsRUFBNEIsQ0FDeEI7QUFDSCxLQUZELE1BRU87QUFDSCxhQUFPLEtBQUsyQyxzQkFBTCxDQUE0QnRELFFBQTVCLEVBQXNDQyxTQUF0QyxFQUFpRGdELFFBQWpELEVBQTJEQyxRQUEzRCxDQUFQO0FBRUg7QUFDSjtBQUVEOzs7Ozs7U0FJQUcsaUJBQUEsd0JBQWVyRCxRQUFmLEVBQXlCQyxTQUF6QixFQUFvQ2dELFFBQXBDLEVBQThDQyxRQUE5QyxFQUF3RDtBQUNwRCxRQUFJSyxTQUFTLEdBQUdOLFFBQVEsQ0FBQyxDQUFELENBQXhCO0FBQ0EsUUFBSU8sVUFBVSxHQUFHUCxRQUFRLENBQUMsQ0FBRCxDQUF6Qjs7QUFFQSxRQUFJZixNQUFNLEdBQUdGLHNCQUFVRyxZQUFWLENBQXVCbkMsUUFBdkIsRUFBaUNDLFNBQWpDLEVBQTRDc0QsU0FBNUMsRUFBdURDLFVBQXZELENBQWI7O0FBQ0EsUUFBSXRCLE1BQU0sS0FBS3JDLFNBQWYsRUFBMEI7QUFDdEI7QUFDQSxhQUFPLEtBQUs0RCxnQkFBTCxDQUFzQnpELFFBQXRCLEVBQWdDQyxTQUFoQyxFQUEyQ3NELFNBQTNDLEVBQXNETCxRQUF0RCxDQUFQO0FBQ0gsS0FIRCxNQUdPO0FBQ0g7QUFDQTtBQUNBLGFBQU8sS0FBS0ksc0JBQUwsQ0FBNEJ0RCxRQUE1QixFQUFzQ0MsU0FBdEMsRUFBaURzRCxTQUFqRCxFQUE0REwsUUFBNUQsQ0FBUDtBQUNIO0FBR0o7QUFFRDs7Ozs7U0FHQVEsaUJBQUEsd0JBQWUxRCxRQUFmLEVBQXlCQyxTQUF6QixFQUFvQ2dELFFBQXBDLEVBQThDWCxTQUE5QyxFQUF5RDtBQUNyRCxRQUFJaUIsU0FBUyxHQUFHakIsU0FBUyxDQUFDLENBQUQsQ0FBekI7QUFDQSxRQUFJa0IsVUFBVSxHQUFHbEIsU0FBUyxDQUFDLENBQUQsQ0FBMUI7QUFDQSxRQUFJcUIsU0FBUyxHQUFHckIsU0FBUyxDQUFDLENBQUQsQ0FBekI7O0FBQ0EsUUFBSUosTUFBTSxHQUFHRixzQkFBVUcsWUFBVixDQUF1Qm9CLFNBQXZCLEVBQWtDQyxVQUFsQyxDQUFiOztBQUNBLFFBQUl0QixNQUFNLEtBQUtyQyxTQUFmLEVBQTBCO0FBQ3RCcUMsTUFBQUEsTUFBTSxHQUFHRixzQkFBVUcsWUFBVixDQUF1QndCLFNBQXZCLEVBQWtDSCxVQUFsQyxDQUFUO0FBQ0g7O0FBQ0QsUUFBSXRCLE1BQU0sS0FBS3JDLFNBQWYsRUFBMEIsQ0FDdEI7QUFDSCxLQUZELE1BRU8sQ0FDSDtBQUNBO0FBQ0g7QUFDSjtBQUVEOzs7OztTQUdBeUQseUJBQUEsZ0NBQXVCdEQsUUFBdkIsRUFBaUNDLFNBQWpDLEVBQTRDMkQsV0FBNUMsRUFBeURWLFFBQXpELEVBQW1FO0FBQy9EO0FBQ0EsUUFBSVcsU0FBUyxHQUFHRCxXQUFoQjtBQUNBLFFBQUlFLFNBQVMsR0FBRyxLQUFLeEMsVUFBTCxDQUFnQnVDLFNBQWhCLENBQWhCO0FBQ0EsUUFBSUUsWUFBWSxHQUFHLEtBQUtoQyxhQUFMLENBQW1COEIsU0FBbkIsQ0FBbkI7O0FBQ0EsUUFBSWxCLE1BQU0sR0FBR21CLFNBQVMsSUFBSTlELFFBQWIsSUFBeUJnQyxzQkFBVVksV0FBVixDQUFzQm1CLFlBQXRCLENBQXRDOztBQUNBLFFBQUlwQixNQUFKLEVBQVk7QUFDUjtBQUNBLFVBQUlxQixLQUFLLEdBQUcsS0FBS3ZELGVBQUwsQ0FBcUIsSUFBckIsRUFBMkJxRCxTQUEzQixFQUFzQ1osUUFBdEMsQ0FBWjs7QUFDQSxVQUFJYyxLQUFLLENBQUNyRCxNQUFOLEdBQWUsQ0FBbkIsRUFBc0I7QUFDbEIsWUFBSStCLEtBQUssR0FBR3NCLEtBQUssQ0FBQ0EsS0FBSyxDQUFDckQsTUFBTixHQUFlLENBQWhCLENBQWpCOztBQUNBLFlBQUl1QixNQUFNLEdBQUdGLHNCQUFVRyxZQUFWLENBQXVCTyxLQUF2QixFQUE4Qm1CLFNBQTlCLENBQWIsQ0FGa0IsQ0FHbEI7OztBQUNBLFlBQUkzQixNQUFNLEtBQUt0QyxRQUFmLEVBQXlCO0FBQ3JCLGlCQUFPOEMsS0FBUDtBQUNILFNBRkQsTUFFTztBQUFDO0FBQ0osaUJBQU9zQixLQUFLLENBQUMsQ0FBRCxDQUFaO0FBQ0g7QUFDSixPQVRELE1BU087QUFDSCxlQUFPZCxRQUFRLENBQUNlLEtBQVQsQ0FBZWYsUUFBUSxDQUFDZSxLQUFULENBQWV0RCxNQUFmLEdBQXdCLENBQXZDLENBQVA7QUFDSDtBQUNKLEtBZkQsTUFlTztBQUNIO0FBQ0EsVUFBSXVELEdBQUcsR0FBR0gsWUFBWSxJQUFJLEVBQTFCO0FBQ0F6RCxNQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxPQUFaLEVBQXFCcUQsV0FBVyxHQUFHLE1BQWQsR0FBdUJFLFNBQTVDLEVBSEcsQ0FJSDs7QUFDQSxVQUFJSyxVQUFVLEdBQUcsS0FBSzFELGVBQUwsQ0FBcUIsS0FBckIsRUFBNEJxRCxTQUE1QixFQUF1Q1osUUFBdkMsQ0FBakI7O0FBQ0EsVUFBSWlCLFVBQVUsQ0FBQ3hELE1BQVgsSUFBcUIsQ0FBekIsRUFBNEI7QUFDeEI7QUFDQSxlQUFPdUMsUUFBUSxDQUFDeEMsU0FBVCxDQUFtQixDQUFuQixDQUFQO0FBQ0gsT0FIRCxNQUdPLElBQUl3RCxHQUFKLEVBQVM7QUFDWixlQUFPQyxVQUFVLENBQUMsQ0FBRCxDQUFqQjtBQUNILE9BRk0sTUFFQTtBQUNILGVBQU9BLFVBQVUsQ0FBQ0EsVUFBVSxDQUFDeEQsTUFBWCxHQUFvQixDQUFyQixDQUFqQjtBQUNIO0FBQ0o7QUFDSjtBQUVEOzs7OztTQUdBOEMsbUJBQUEsMEJBQWlCekQsUUFBakIsRUFBMkJDLFNBQTNCLEVBQXNDMkQsV0FBdEMsRUFBbURWLFFBQW5ELEVBQTZEO0FBQ3pELFFBQUlXLFNBQVMsR0FBR0QsV0FBaEI7QUFDQSxRQUFJRSxTQUFTLEdBQUcsS0FBS3hDLFVBQUwsQ0FBZ0J1QyxTQUFoQixDQUFoQjtBQUNBLFFBQUlFLFlBQVksR0FBRyxLQUFLaEMsYUFBTCxDQUFtQjhCLFNBQW5CLENBQW5COztBQUNBLFFBQUlsQixNQUFNLEdBQUdtQixTQUFTLElBQUk5RCxRQUFiLElBQXlCZ0Msc0JBQVVZLFdBQVYsQ0FBc0JtQixZQUF0QixDQUF0Qzs7QUFDQSxRQUFJcEIsTUFBSixFQUFZO0FBQ1IsVUFBSXFCLEtBQUssR0FBRyxLQUFLdkQsZUFBTCxDQUFxQixJQUFyQixFQUEyQnFELFNBQTNCLEVBQXNDWixRQUF0QyxDQUFaOztBQUNBLFVBQUljLEtBQUssQ0FBQ3JELE1BQU4sR0FBZSxDQUFuQixFQUFzQjtBQUNsQixlQUFPLEtBQUt5RCxvQkFBTCxDQUEwQkosS0FBMUIsQ0FBUDtBQUNILE9BSk8sQ0FLUjs7O0FBQ0EsYUFBT2QsUUFBUSxDQUFDZSxLQUFULENBQWUsQ0FBZixDQUFQO0FBQ0gsS0FQRCxNQU9PO0FBQ0gsVUFBSUQsTUFBSyxHQUFHLEtBQUt2RCxlQUFMLENBQXFCLElBQXJCLEVBQTJCcUQsU0FBM0IsRUFBc0NaLFFBQXRDLENBQVo7O0FBQ0EsVUFBSWMsTUFBSyxDQUFDckQsTUFBTixHQUFlLENBQW5CLEVBQXNCO0FBQ2xCO0FBQ0EsZUFBTyxLQUFLeUQsb0JBQUwsQ0FBMEJKLE1BQTFCLENBQVA7QUFDSCxPQUxFLENBTUg7OztBQUNBQSxNQUFBQSxNQUFLLEdBQUdkLFFBQVEsQ0FBQ2UsS0FBakI7QUFDQSxhQUFPLEtBQUtHLG9CQUFMLENBQTBCSixNQUExQixDQUFQO0FBQ0g7QUFDSjs7U0FFREksdUJBQUEsOEJBQXFCSixLQUFyQixFQUE0QjtBQUN4QixTQUFLLElBQUl6QyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHeUMsS0FBSyxDQUFDckQsTUFBMUIsRUFBa0NZLENBQUMsRUFBbkMsRUFBdUM7QUFDbkMsVUFBSVcsTUFBTSxHQUFHRixzQkFBVUMsWUFBVixDQUF1QixLQUFLRixhQUFMLENBQW1CaUMsS0FBSyxDQUFDekMsQ0FBRCxDQUF4QixDQUF2QixDQUFiOztBQUNBLFVBQUlXLE1BQUosRUFBWTtBQUNSLGVBQU84QixLQUFLLENBQUN6QyxDQUFELENBQVo7QUFDSDtBQUNKOztBQUNELFdBQU95QyxLQUFLLENBQUMsQ0FBRCxDQUFaO0FBQ0g7QUFFRDs7Ozs7Ozs7U0FNQXZELGtCQUFBLHlCQUFnQmtDLE1BQWhCLEVBQXdCSCxJQUF4QixFQUE4QlUsUUFBOUIsRUFBd0M7QUFDcEMsUUFBSVAsTUFBSixFQUFZO0FBQ1IsYUFBT08sUUFBUSxDQUFDeEMsU0FBaEI7QUFDSDs7QUFDRCxZQUFROEIsSUFBUjtBQUNJLFdBQUssQ0FBTDtBQUNJLGVBQU9VLFFBQVEsQ0FBQ21CLFVBQWhCOztBQUNKLFdBQUssQ0FBTDtBQUNJLGVBQU9uQixRQUFRLENBQUNvQixVQUFoQjs7QUFDSixXQUFLLENBQUw7QUFDSSxlQUFPcEIsUUFBUSxDQUFDcUIsVUFBaEI7O0FBQ0osV0FBSyxDQUFMO0FBQ0ksZUFBT3JCLFFBQVEsQ0FBQ3NCLFVBQWhCO0FBUlI7QUFXSDs7U0FFREMsdUJBQUEsOEJBQXFCekUsUUFBckIsRUFBK0IwRSxRQUEvQixFQUF5Q3hCLFFBQXpDLEVBQW1EO0FBQy9DLFFBQUlZLFNBQVMsR0FBRyxLQUFLeEMsVUFBTCxDQUFnQm9ELFFBQWhCLENBQWhCO0FBQ0EsUUFBSVgsWUFBWSxHQUFHLEtBQUtoQyxhQUFMLENBQW1CMkMsUUFBbkIsQ0FBbkI7O0FBQ0EsUUFBSS9CLE1BQU0sR0FBR21CLFNBQVMsSUFBSTlELFFBQWIsSUFBeUJnQyxzQkFBVVksV0FBVixDQUFzQm1CLFlBQXRCLENBQXRDOztBQUNBLFFBQUlDLEtBQUssR0FBRyxLQUFLdkQsZUFBTCxDQUFxQmtDLE1BQXJCLEVBQTZCbUIsU0FBN0IsRUFBd0NaLFFBQXhDLENBQVosQ0FKK0MsQ0FLL0M7O0FBQ0EsUUFBSXlCLEtBQUssR0FBR1gsS0FBSyxDQUFDbkQsT0FBTixDQUFjNkQsUUFBZCxDQUFaO0FBQ0FWLElBQUFBLEtBQUssQ0FBQ1ksTUFBTixDQUFhRCxLQUFiLEVBQW9CLENBQXBCLEVBUCtDLENBUS9DOztBQUNBWCxJQUFBQSxLQUFLLEdBQUdkLFFBQVEsQ0FBQ2UsS0FBakI7QUFDQVUsSUFBQUEsS0FBSyxHQUFHWCxLQUFLLENBQUNuRCxPQUFOLENBQWM2RCxRQUFkLENBQVI7QUFDQVYsSUFBQUEsS0FBSyxDQUFDWSxNQUFOLENBQWFELEtBQWIsRUFBb0IsQ0FBcEI7QUFDSDs7U0FFRHJELGFBQUEsb0JBQVd1QyxTQUFYLEVBQXNCO0FBQ2xCLFdBQU9nQixJQUFJLENBQUNDLEtBQUwsQ0FBV2pCLFNBQVMsR0FBRyxFQUF2QixDQUFQO0FBRUg7O1NBRURrQixhQUFBLG9CQUFXbEIsU0FBWCxFQUFzQjtBQUNsQixXQUFPQSxTQUFTLENBQUNwQixTQUFWLENBQW9CLENBQXBCLENBQVA7QUFDSDs7U0FFRFYsZ0JBQUEsdUJBQWM4QixTQUFkLEVBQXlCO0FBQ3JCLFdBQU9nQixJQUFJLENBQUNDLEtBQUwsQ0FBV2pCLFNBQVMsR0FBRyxFQUF2QixDQUFQO0FBQ0g7O1NBRURtQixnQkFBQSx1QkFBY25CLFNBQWQsRUFBeUI7QUFDckIsV0FBT0EsU0FBUyxDQUFDcEIsU0FBVixDQUFvQixDQUFwQixFQUF1QixDQUF2QixDQUFQO0FBQ0giLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQb2tlclV0aWwgZnJvbSBcIi4vUG9rZXJVdGlsXCI7XHJcblxyXG5sZXQgcG9rZXJXZWlnaHQgPSBbNCwgNiwgNywgOCwgOSwgMTAsIDExLCAxMiwgMTMsIDE0LCAxNSwgMywgNSwgMTYsIDE3LCAxOF07Ly/kuLs15Li6MThcclxubGV0IExFRlRfV0lOID0gLTE7XHJcbmxldCBSSUdIVF9XSU4gPSAxO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBSUhlbHBlciB7XHJcblxyXG4gICAgLy8ge1xyXG4gICAgLy8gICAgIHR5cGUxQXJyYXk6dHlwZTFBcnJheSxcclxuICAgIC8vICAgICB0eXBlMkFycmF5OnR5cGUyQXJyYXksXHJcbiAgICAvLyAgICAgdHlwZTNBcnJheTp0eXBlM0FycmF5LFxyXG4gICAgLy8gICAgIHR5cGU0QXJyYXk6dHlwZTRBcnJheSxcclxuICAgIC8vICAgICBob3N0QXJyYXk6aG9zdEFycmF5LFxyXG4gICAgLy8gICAgIHRvdGFsOnRvdGFsXHJcbiAgICAvLyB9XHJcbiAgICAvKipcclxuICAgICAqIOajgOa1i+eUqOaIt+WHuueahOeJjOaYr+WQpuWQiOazlVxyXG4gICAgICogQHBhcmFtIGdhbWVIb3N0XHJcbiAgICAgKiBAcGFyYW0gcm91bmRIb3N0XHJcbiAgICAgKiBAcGFyYW0gdXNlckNhcmRcclxuICAgICAqIEBwYXJhbSBjYXJkQXJyYXlcclxuICAgICAqL1xyXG4gICAgY2hlY2tVc2VyQ2FuU2VuZChnYW1lSG9zdCwgcm91bmRIb3N0LCB1c2VyUG9rZXJPYmosIHdpbGxTZW5kQ2FyZCkge1xyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHdpbGxTZW5kQ2FyZCkpIHtcclxuICAgICAgICAgICAgLy/mmoLml7bkuI3mlK/mjIFcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJvbmlvblwiLCBcIuaaguaXtuS4jeaUr+aMgeWHuuWvuVwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZighcm91bmRIb3N0KXtcclxuICAgICAgICAgICAgLy/msqHmnInmnKzova7kuLvvvIznjqnlrrblpLTkuIDkuKrlh7rniYxcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGdhbWVIb3N0PT1yb3VuZEhvc3Qpe1xyXG4gICAgICAgICAgICBsZXQgdGFyZ2V0QXJyYXk9dGhpcy5zZWxlY3RBcnJheUZyb20odHJ1ZSxyb3VuZEhvc3QsdXNlclBva2VyT2JqKTtcclxuICAgICAgICAgICAgLy/osIPkuLtcclxuICAgICAgICAgICAgaWYodXNlclBva2VyT2JqLmhvc3RBcnJheS5sZW5ndGg+MHx8dGFyZ2V0QXJyYXkubGVuZ3RoPjApe1xyXG4gICAgICAgICAgICAgICAgLy/mnInkuLvniYzlv4Xpobvlh7rkuLvniYxcclxuICAgICAgICAgICAgICAgbGV0IGZsYWcxPSB1c2VyUG9rZXJPYmouaG9zdEFycmF5LmluZGV4T2Yod2lsbFNlbmRDYXJkKSE9PS0xO1xyXG4gICAgICAgICAgICAgICBsZXQgZmxhZzI9dGFyZ2V0QXJyYXkuaW5kZXhPZih3aWxsU2VuZENhcmQpIT09LTE7XHJcbiAgICAgICAgICAgICAgIHJldHVybiBmbGFnMnx8ZmxhZzE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy/msqHkuLvkuobpmo/kvr/lh7pcclxuICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgIC8v6Iqx6Imy55u45ZCM5Y+v5Lul5Ye6XHJcbiAgICAgICAgICAgIGxldCB0YXJnZXRBcnJheT10aGlzLnNlbGVjdEFycmF5RnJvbSh0cnVlLHJvdW5kSG9zdCx1c2VyUG9rZXJPYmopO1xyXG4gICAgICAgICAgICBpZih0YXJnZXRBcnJheS5sZW5ndGg+MCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0QXJyYXkuaW5kZXhPZih3aWxsU2VuZENhcmQpIT09LTE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy/ml6Byb3VuZEhvc3ToirHoibLlj6/ku6Xlh7pcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8v5Ye65Ymv54mM5pe277yM5pyJ5Ymv54mM5b+F6aG75Ye65Ymv54mMXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOa4uOaIj+avj+i9rumAu+i+ke+8jFxyXG4gICAgICog6LWi5a625Ye654mM77yM56Gu5a6a5pys6L2u5Li7XHJcbiAgICAgKiDkuIvlrrblh7rniYwg6LCDc2VuZEFJRm9sbG93Q2FyZFxyXG4gICAgICogNOWutumDveWHuuWujOe7k+eul++8jOenr+WIhuiuoeeul++8jOe7k+adn+acrOi9ru+8jOi/lOWbnuenr+WIhlxyXG4gICAgICogQHBhcmFtIG9uUm91bmRDYWxsQmFjayAg5Zue6LCDIOivpeebuOW6lOeOqeWutuWHuueJjFxyXG4gICAgICogQHBhcmFtIHdpbkxvY2FsIOS8mOWFiOWHuueJjOaWuSDntKLlvJXku44w5byA5aeLXHJcbiAgICAgKiBAcGFyYW0gZ2FtZUhvc3Qg5b2T5YmN5ri45oiP5Li7XHJcbiAgICAgKi9cclxuICAgIHJvdW5kUHJvZ3JhbShvblVzZXJQbGF5Q2FsbEJhY2ssIG9uUm91bmRDYWxsQmFjaywgcm91bmRPdmVyQ2FsbEJhY2ssd2luTG9jYWwsIGdhbWVIb3N0LHNlbmRBcnJheSkge1xyXG4gICAgICAgIGxldCByb3VuZEhvc3QgPSBudWxsO1xyXG4gICAgICAgIGlmKCFzZW5kQXJyYXl8fHNlbmRBcnJheS5sZW5ndGg9PT0wKXtcclxuICAgICAgICAgICAgc2VuZEFycmF5PVtdOy8v5pys6L2u5Ye655qE54mMXHJcbiAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgcG9rZXJzID1zZW5kQXJyYXlbMF07XHJcbiAgICAgICAgICAgIGlmKEFycmF5LmlzQXJyYXkocG9rZXJzKSl7XHJcbiAgICAgICAgICAgICAgICByb3VuZEhvc3QgPSB0aGlzLmludEdldFR5cGUocG9rZXJzWzBdKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib25pb25cIixcIuaaguS4jeaUr+aMgeWHuuWvuVwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcm91bmRIb3N0ID0gdGhpcy5pbnRHZXRUeXBlKHBva2Vycyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNC1zZW5kQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGN1cnJlbnRQbGF5ZXIgPSAod2luTG9jYWwgKyBpKSU0O1xyXG4gICAgICAgICAgICBpZihjdXJyZW50UGxheWVyPT0wKXtcclxuICAgICAgICAgICAgICAgIG9uVXNlclBsYXlDYWxsQmFjayhnYW1lSG9zdCwgcm91bmRIb3N0LCBzZW5kQXJyYXksIGN1cnJlbnRQbGF5ZXIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBwb2tlcnMgPW9uUm91bmRDYWxsQmFjayhnYW1lSG9zdCwgcm91bmRIb3N0LCBzZW5kQXJyYXksIGN1cnJlbnRQbGF5ZXIpO1xyXG4gICAgICAgICAgICBpZihzZW5kQXJyYXkubGVuZ3RoPT0wKXtcclxuICAgICAgICAgICAgICAgIGlmKEFycmF5LmlzQXJyYXkocG9rZXJzKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgcm91bmRIb3N0ID0gdGhpcy5pbnRHZXRUeXBlKHBva2Vyc1swXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJvbmlvblwiLFwi5pqC5LiN5pSv5oyB5Ye65a+5XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByb3VuZEhvc3QgPSB0aGlzLmludEdldFR5cGUocG9rZXJzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZW5kQXJyYXkucHVzaChwb2tlcnMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgYmlnZ2VyPW51bGw7XHJcbiAgICAgICAgbGV0IHN1bVNvY2VyPTA7XHJcbiAgICAgICAgbGV0IHdpbm5lclBvc2l0aW9uPTA7XHJcbiAgICAgICAgLy/liKTmlq3lk6rmlrnniYzlpKdcclxuICAgICAgICBmb3IobGV0IGk9MDtpPHNlbmRBcnJheS5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgbGV0IGl0ZW09c2VuZEFycmF5W2ldO1xyXG4gICAgICAgICAgICBsZXQgY29udGVudD10aGlzLmludEdldENvbnRlbnQoaXRlbSk7XHJcbiAgICAgICAgICAgIHN1bVNvY2VyKz1Qb2tlclV0aWwucXVhcnlJc1NvY2VyKGNvbnRlbnQpO1xyXG4gICAgICAgICAgICBpZihiaWdnZXI9PW51bGwpe1xyXG4gICAgICAgICAgICAgICAgYmlnZ2VyPWl0ZW07XHJcbiAgICAgICAgICAgICAgICB3aW5uZXJQb3NpdGlvbj1pO1xyXG4gICAgICAgICAgICAgICAgY29udGludWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgcmVzdWx0PVBva2VyVXRpbC5jb21wYXJlUG9rZXIoZ2FtZUhvc3Qscm91bmRIb3N0LGl0ZW0sYmlnZ2VyKTtcclxuICAgICAgICAgICAgaWYocmVzdWx0PT1MRUZUX1dJTil7XHJcbiAgICAgICAgICAgICAgICBiaWdnZXI9aXRlbTtcclxuICAgICAgICAgICAgICAgIHdpbm5lclBvc2l0aW9uPWk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgd2lubmVyUG9zaXRpb24rPXdpbkxvY2FsO1xyXG4gICAgICAgIHdpbm5lclBvc2l0aW9uPXdpbm5lclBvc2l0aW9uJTQ7XHJcbiAgICAgICAgaWYod2lubmVyUG9zaXRpb249PTB8fHdpbm5lclBvc2l0aW9uPT0yKXtcclxuICAgICAgICAgICAgLy/liqDliIZcclxuICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgIHN1bVNvY2VyPTA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJvdW5kT3ZlckNhbGxCYWNrKHdpbm5lclBvc2l0aW9uLHN1bVNvY2VyKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWFiOaJi+eUteiEkemAu+i+kVxyXG4gICAgICog5pmu6YCa5omT5rOV77yaXHJcbiAgICAgKiDmnInlia/lh7rmnIDlpKfnmoTlia/niYwg5oiW6ICF5Ymv54mM5a+5XHJcbiAgICAgKiDlhbbmrKHlh7rmnIDlsI/kuLvniYzvvIzkuI3osIPkuLvlr7lcclxuICAgICAqIOacgOWQjuS4gOi9ruWHuuS4u+WvuSDmiJbkuLtcclxuICAgICAqIOS4u+W6lOivpeWcqOWQjumdolxyXG4gICAgICogQHBhcmFtIGdhbWVIb3N0IOS4u1xyXG4gICAgICogQHBhcmFtIGNhcmRBcnJheSAg5b2T5YmN5omL54mMXHJcbiAgICAgKi9cclxuICAgIHNlbmRBSUhvc3RDYXJkKGdhbWVob3N0LCBjYXJkQXJyYXkpIHtcclxuICAgICAgICBsZXQgc2VuZENhcmRJbmRleHMgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNhcmRBcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgdHlwZSA9IGNhcmRBcnJheVtpXS5zdWJzdHJpbmcoMik7XHJcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IGNhcmRBcnJheVtpXS5zdWJzdHJpbmcoMCwgMik7XHJcbiAgICAgICAgICAgIGxldCBpc0hvc3QgPSB0eXBlID09IGdhbWVob3N0IHx8IFBva2VyVXRpbC5xdWFyeUlzSG9zdCh2YWx1ZSk7XHJcbiAgICAgICAgICAgIGlmICghaXNIb3N0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VuZENhcmRJbmRleHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VuZENhcmRJbmRleHMucHVzaChpKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhcmRBcnJheVtzZW5kQ2FyZEluZGV4c1swXV0gPT0gY2FyZEFycmF5W2ldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbmRDYXJkSW5kZXhzLnB1c2goaSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBsZXQgc2VuZENhcmQgPSBjYXJkQXJyYXlbc2VuZENhcmRJbmRleHNbMF1dO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzZW5kVmFsdWUgPSBzZW5kQ2FyZC5zdWJzdHJpbmcoMCwgMik7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlc3VsdCA9IFBva2VyVXRpbC5jb21wYXJlU2luZ2xlUG9rZXJCaWdnZXIoc2VuZFZhbHVlLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdCA9IFJJR0hUX1dJTikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZW5kQ2FyZCA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChzZW5kQ2FyZEluZGV4cy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAvL+ayoeacieWJr+eJjOS6hlxyXG4gICAgICAgICAgICAgICAgICAgIHNlbmRDYXJkSW5kZXhzLnB1c2goaSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjYXJkQXJyYXlbc2VuZENhcmRJbmRleHNbMF1dID09IGNhcmRBcnJheVtpXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZW5kQ2FyZEluZGV4cy5wdXNoKGkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNlbmRDYXJkID0gY2FyZEFycmF5W3NlbmRDYXJkSW5kZXhzWzBdXTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc2VuZFZhbHVlID0gc2VuZENhcmQuc3Vic3RyaW5nKDAsIDIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCByZXN1bHQgPSBQb2tlclV0aWwuY29tcGFyZVNpbmdsZVBva2VyQmlnZ2VyKHNlbmRWYWx1ZSwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgPSBMRUZUX1dJTikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZW5kQ2FyZCA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc2VuZENhcmRJbmRleHM7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5ZCO5omL55S16ISR6YC76L6RXHJcbiAgICAgKiDliKTmlq3lvZPliY3osIHlpKfvvIzpmJ/lj4vlpKflh7rliIbvvIzpmJ/lj4vlsI/lh7rlsI/niYzjgIJcclxuICAgICAqIOaXoOeJjOWHuuacgOWwj+WJr+eJjFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBnYW1lSG9zdCAg5ri45oiP5Li7XHJcbiAgICAgKiBAcGFyYW0gcm91bmRIb3N0IOacrOi9ruS4u1xyXG4gICAgICogQHBhcmFtIHVzZXJDYXJkICDkuInmlrnmiYDlh7rnmoTniYxcclxuICAgICAqIEBwYXJhbSBjYXJkQXJyYXkgIOiHquW3seWJqeS9meeahOeJjFxyXG4gICAgICovXHJcbiAgICBzZW5kQUlGb2xsb3dDYXJkKGdhbWVIb3N0LCByb3VuZEhvc3QsIHVzZXJDYXJkLCBwb2tlck9iaikge1xyXG4gICAgICAgIHN3aXRjaCAodXNlckNhcmQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMDovL+iHquW3seaYr+mmluWutiDnkIborrrkuIrkuI3lrZjlnKjvvIzlupTor6XosINzZW5kQUlIb3N0Q2FyZFxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIm9uaW9uXCIsIFwiZXJyb3Ig5ZCO5omL55S16ISR6LCD55So5LqGc2VuZEFJRm9sbG93Q2FyZCDlupTor6XosIPnlKggc2VuZEFJSG9zdENhcmQgXCIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIDE6Ly/lsL3ph4/lh7rlpKfniYxcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNlY29uZExvZ2ljKGdhbWVIb3N0LCByb3VuZEhvc3QsIHVzZXJDYXJkLCBwb2tlck9iaik7XHJcbiAgICAgICAgICAgIGNhc2UgMjovL1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VuZFRocmlkUG9rZXIoZ2FtZUhvc3QsIHJvdW5kSG9zdCwgdXNlckNhcmQsIHBva2VyT2JqKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHNlY29uZExvZ2ljKGdhbWVIb3N0LCByb3VuZEhvc3QsIHVzZXJDYXJkLCBwb2tlck9iaikge1xyXG4gICAgICAgIGlmICh1c2VyQ2FyZFswXS5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgIC8v5Ye65a+555qE6YC76L6RXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0U2luZ2xlQmlnZXJQb2tlcihnYW1lSG9zdCwgcm91bmRIb3N0LCB1c2VyQ2FyZCwgcG9rZXJPYmopO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnrKzkuInmiYvnlLXohJFcclxuICAgICAqIOWIpOaWreiwgeWHuueahOWkpyzlsJ3or5Xnm5bov4fkuIDmiYtcclxuICAgICAqL1xyXG4gICAgc2VuZFRocmlkUG9rZXIoZ2FtZUhvc3QsIHJvdW5kSG9zdCwgdXNlckNhcmQsIHBva2VyT2JqKSB7XHJcbiAgICAgICAgbGV0IGZpcnN0Q2FyZCA9IHVzZXJDYXJkWzBdO1xyXG4gICAgICAgIGxldCBzZWNvbmRDYXJkID0gdXNlckNhcmRbMV07XHJcblxyXG4gICAgICAgIGxldCByZXN1bHQgPSBQb2tlclV0aWwuY29tcGFyZVBva2VyKGdhbWVIb3N0LCByb3VuZEhvc3QsIGZpcnN0Q2FyZCwgc2Vjb25kQ2FyZCk7XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gUklHSFRfV0lOKSB7XHJcbiAgICAgICAgICAgIC8v5a+55a625aSn77yM5bCd6K+V5Ye65YiG5oiW5bCP54mMXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbGVjdFNvY2VyUG9rZXIoZ2FtZUhvc3QsIHJvdW5kSG9zdCwgZmlyc3RDYXJkLCBwb2tlck9iaik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy/lh7rmnIDlpKfniYzvvIzlsJ3or5Xljovov4dmaXJzdENhcmQg5pyA5aSn55qE54mM5Lmf5Y6L5LiN6L+H5bCx5Ye65bCP54mMXHJcbiAgICAgICAgICAgIC8vVE9ETyDlj6/ku6XoioLnuqbvvIzlh7rku4Xljovov4flr7nmlrnnmoTlpKfniYxcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0U2luZ2xlQmlnZXJQb2tlcihnYW1lSG9zdCwgcm91bmRIb3N0LCBmaXJzdENhcmQsIHBva2VyT2JqKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWbm+aJi+eUteiEkVxyXG4gICAgICovXHJcbiAgICBzZW5kRm9ydGhQb2tlcihnYW1lSG9zdCwgcm91bmRIb3N0LCB1c2VyQ2FyZCwgY2FyZEFycmF5KSB7XHJcbiAgICAgICAgbGV0IGZpcnN0Q2FyZCA9IGNhcmRBcnJheVswXTtcclxuICAgICAgICBsZXQgc2Vjb25kQ2FyZCA9IGNhcmRBcnJheVsxXTtcclxuICAgICAgICBsZXQgdGhyaWRDYXJkID0gY2FyZEFycmF5WzJdO1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBQb2tlclV0aWwuY29tcGFyZVBva2VyKGZpcnN0Q2FyZCwgc2Vjb25kQ2FyZCk7XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gUklHSFRfV0lOKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IFBva2VyVXRpbC5jb21wYXJlUG9rZXIodGhyaWRDYXJkLCBzZWNvbmRDYXJkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gUklHSFRfV0lOKSB7XHJcbiAgICAgICAgICAgIC8v5a+55a625aSn77yM5bCd6K+V5Ye65YiG5oiW5bCP54mMXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy/lh7rmnIDlpKfniYzvvIzlsJ3or5Xljovov4dmaXJzdENhcmQg5pyA5aSn55qE54mM5Lmf5Y6L5LiN6L+H5bCx5Ye65bCP54mMXHJcbiAgICAgICAgICAgIC8vVE9ETyDlj6/ku6XoioLnuqbvvIzlh7rku4Xljovov4flr7nmlrnnmoTlpKfniYxcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDpobbniYzpgLvovpFcclxuICAgICAqL1xyXG4gICAgc2VsZWN0U2luZ2xlQmlnZXJQb2tlcihnYW1lSG9zdCwgcm91bmRIb3N0LCB0YXJnZXRQb2tlciwgcG9rZXJPYmopIHtcclxuICAgICAgICAvL+WHuuWNleeahOmAu+i+kSAx6K+G5Yir5piv5ZCm5piv5Li754mMXHJcbiAgICAgICAgbGV0IGNhcmRWYWx1ZSA9IHRhcmdldFBva2VyO1xyXG4gICAgICAgIGxldCB0eXBlVmFsdWUgPSB0aGlzLmludEdldFR5cGUoY2FyZFZhbHVlKTtcclxuICAgICAgICBsZXQgY29udGVudFZhbHVlID0gdGhpcy5pbnRHZXRDb250ZW50KGNhcmRWYWx1ZSk7XHJcbiAgICAgICAgbGV0IGlzSG9zdCA9IHR5cGVWYWx1ZSA9PSBnYW1lSG9zdCB8fCBQb2tlclV0aWwucXVhcnlJc0hvc3QoY29udGVudFZhbHVlKTtcclxuICAgICAgICBpZiAoaXNIb3N0KSB7XHJcbiAgICAgICAgICAgIC8v6aG25aSn54mMXHJcbiAgICAgICAgICAgIGxldCBhcnJheSA9IHRoaXMuc2VsZWN0QXJyYXlGcm9tKHRydWUsIHR5cGVWYWx1ZSwgcG9rZXJPYmopO1xyXG4gICAgICAgICAgICBpZiAoYXJyYXkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gYXJyYXlbYXJyYXkubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0gUG9rZXJVdGlsLmNvbXBhcmVQb2tlcih2YWx1ZSwgY2FyZFZhbHVlKTtcclxuICAgICAgICAgICAgICAgIC8v6IO96aG26L+HIOWHuuWkp+eJjFxyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdCA9PT0gTEVGVF9XSU4pIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Ugey8v6aG25LiN6L+HIOWHuuWwj+eJjFxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcnJheVswXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwb2tlck9iai50b3RhbFtwb2tlck9iai50b3RhbC5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8v5LiK5a625piv5ZCm5Li6QSBcclxuICAgICAgICAgICAgbGV0IGlzQSA9IGNvbnRlbnRWYWx1ZSA9PSAxNDtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJvbmlvblwiLCB0YXJnZXRQb2tlciArIFwidHlwZVwiICsgdHlwZVZhbHVlKTtcclxuICAgICAgICAgICAgLy/oh6rlt7HmmK/lkKbov5jmnInor6XoirHoibJcclxuICAgICAgICAgICAgbGV0IHBva2VyQXJyYXkgPSB0aGlzLnNlbGVjdEFycmF5RnJvbShmYWxzZSwgdHlwZVZhbHVlLCBwb2tlck9iaik7XHJcbiAgICAgICAgICAgIGlmIChwb2tlckFycmF5Lmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAvL+WHuuacgOWwj+eahOeJjOadgFxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBva2VyT2JqLmhvc3RBcnJheVswXTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChpc0EpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwb2tlckFycmF5WzBdO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBva2VyQXJyYXlbcG9rZXJBcnJheS5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOS4iuWIhumAu+i+kSDlsI/niYzpgLvovpFcclxuICAgICAqL1xyXG4gICAgc2VsZWN0U29jZXJQb2tlcihnYW1lSG9zdCwgcm91bmRIb3N0LCB0YXJnZXRQb2tlciwgcG9rZXJPYmopIHtcclxuICAgICAgICBsZXQgY2FyZFZhbHVlID0gdGFyZ2V0UG9rZXI7XHJcbiAgICAgICAgbGV0IHR5cGVWYWx1ZSA9IHRoaXMuaW50R2V0VHlwZShjYXJkVmFsdWUpO1xyXG4gICAgICAgIGxldCBjb250ZW50VmFsdWUgPSB0aGlzLmludEdldENvbnRlbnQoY2FyZFZhbHVlKTtcclxuICAgICAgICBsZXQgaXNIb3N0ID0gdHlwZVZhbHVlID09IGdhbWVIb3N0IHx8IFBva2VyVXRpbC5xdWFyeUlzSG9zdChjb250ZW50VmFsdWUpO1xyXG4gICAgICAgIGlmIChpc0hvc3QpIHtcclxuICAgICAgICAgICAgbGV0IGFycmF5ID0gdGhpcy5zZWxlY3RBcnJheUZyb20odHJ1ZSwgdHlwZVZhbHVlLCBwb2tlck9iaik7XHJcbiAgICAgICAgICAgIGlmIChhcnJheS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RTY29lckZyb21BcnJheShhcnJheSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy9UT0RPIOW+heS8mOWMliDlh7rmnIDlsI/nmoTniYwg5b2T5YmN5piv5oC754mM5bqT55qE56ys5LiA5byg54mMIFxyXG4gICAgICAgICAgICByZXR1cm4gcG9rZXJPYmoudG90YWxbMF07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IGFycmF5ID0gdGhpcy5zZWxlY3RBcnJheUZyb20odHJ1ZSwgdHlwZVZhbHVlLCBwb2tlck9iaik7XHJcbiAgICAgICAgICAgIGlmIChhcnJheS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAvL+S7juivpeiKseiJsumAieeJjFxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0U2NvZXJGcm9tQXJyYXkoYXJyYXkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8v5YWo5bGA6YCJ54mMXHJcbiAgICAgICAgICAgIGFycmF5ID0gcG9rZXJPYmoudG90YWw7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbGVjdFNjb2VyRnJvbUFycmF5KGFycmF5KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZWN0U2NvZXJGcm9tQXJyYXkoYXJyYXkpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQgPSBQb2tlclV0aWwucXVhcnlJc1NvY2VyKHRoaXMuaW50R2V0Q29udGVudChhcnJheVtpXSkpO1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYXJyYXlbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFycmF5WzBdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6YCJ5Ye65a+55bqU55qE54mM57uEXHJcbiAgICAgKiBAcGFyYW0geyp9IGlzSG9zdCAg5Zu65a6a5Li75pWw57uEXHJcbiAgICAgKiBAcGFyYW0geyp9IHR5cGUgICAg6Iqx6Imy57G75Z6LXHJcbiAgICAgKiBAcGFyYW0geyp9IHBva2VyT2JqICDniYznu4Tlr7nosaFcclxuICAgICAqL1xyXG4gICAgc2VsZWN0QXJyYXlGcm9tKGlzSG9zdCwgdHlwZSwgcG9rZXJPYmopIHtcclxuICAgICAgICBpZiAoaXNIb3N0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwb2tlck9iai5ob3N0QXJyYXk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcG9rZXJPYmoudHlwZTFBcnJheTtcclxuICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBva2VyT2JqLnR5cGUyQXJyYXk7XHJcbiAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICAgIHJldHVybiBwb2tlck9iai50eXBlM0FycmF5O1xyXG4gICAgICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcG9rZXJPYmoudHlwZTRBcnJheTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZVBva2VyRnJvbUFycmF5KGdhbWVIb3N0LCBwb2tlck51bSwgcG9rZXJPYmopIHtcclxuICAgICAgICBsZXQgdHlwZVZhbHVlID0gdGhpcy5pbnRHZXRUeXBlKHBva2VyTnVtKTtcclxuICAgICAgICBsZXQgY29udGVudFZhbHVlID0gdGhpcy5pbnRHZXRDb250ZW50KHBva2VyTnVtKTtcclxuICAgICAgICBsZXQgaXNIb3N0ID0gdHlwZVZhbHVlID09IGdhbWVIb3N0IHx8IFBva2VyVXRpbC5xdWFyeUlzSG9zdChjb250ZW50VmFsdWUpO1xyXG4gICAgICAgIGxldCBhcnJheSA9IHRoaXMuc2VsZWN0QXJyYXlGcm9tKGlzSG9zdCwgdHlwZVZhbHVlLCBwb2tlck9iaik7XHJcbiAgICAgICAgLy/liIbnu4TmlbDnu4TliKDpmaRcclxuICAgICAgICBsZXQgaW5kZXggPSBhcnJheS5pbmRleE9mKHBva2VyTnVtKTtcclxuICAgICAgICBhcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgIC8v5YWo5bGA5pWw57uE5Yig6ZmkXHJcbiAgICAgICAgYXJyYXkgPSBwb2tlck9iai50b3RhbDtcclxuICAgICAgICBpbmRleCA9IGFycmF5LmluZGV4T2YocG9rZXJOdW0pO1xyXG4gICAgICAgIGFycmF5LnNwbGljZShpbmRleCwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgaW50R2V0VHlwZShjYXJkVmFsdWUpIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihjYXJkVmFsdWUgJSAxMCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHN0ckdldFR5cGUoY2FyZFZhbHVlKSB7XHJcbiAgICAgICAgcmV0dXJuIGNhcmRWYWx1ZS5zdWJzdHJpbmcoMilcclxuICAgIH1cclxuXHJcbiAgICBpbnRHZXRDb250ZW50KGNhcmRWYWx1ZSkge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKGNhcmRWYWx1ZSAvIDEwKTtcclxuICAgIH1cclxuXHJcbiAgICBzdHJHZXRDb250ZW50KGNhcmRWYWx1ZSkge1xyXG4gICAgICAgIHJldHVybiBjYXJkVmFsdWUuc3Vic3RyaW5nKDAsIDIpO1xyXG4gICAgfVxyXG5cclxuXHJcbn0iXX0=
//------QC-SOURCE-SPLIT------
