
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
require('./assets/scripts/Other');
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
      if (willSendCard.length === 1) {
        willSendCard = willSendCard[0];
      } else {
        //暂时不支持
        console.log("onion", "暂时不支持出对====");
        return false;
      }
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
    console.log("onion", "轮次逻辑" + winLocal + "/" + sendArray);

    if (!sendArray || sendArray.length === 0) {
      sendArray = []; //本轮出的牌
    } else {
      var pokers = sendArray[0];

      if (Array.isArray(pokers) && pokers.length === 1) {
        pokers = pokers[0];
      }

      if (Array.isArray(pokers)) {
        roundHost = this.intGetType(pokers[0]);
        console.log("onion", "暂不支持出对");
        return;
      } else {
        roundHost = this.intGetType(pokers);
      }
    }

    var orgNum = sendArray.length;

    for (var i = orgNum; i <= 4 - orgNum; i++) {
      var currentPlayer = (winLocal + i) % 4;

      if (currentPlayer == 0) {
        onUserPlayCallBack(gameHost, roundHost, sendArray, currentPlayer);
        return;
      }

      var _pokers = onRoundCallBack(gameHost, roundHost, sendArray, currentPlayer);

      if (sendArray.length == 0) {
        if (Array.isArray(_pokers)) {
          roundHost = this.intGetType(_pokers[0]);

          if (_pokers.length !== 1) {
            console.log("onion", "暂不支持出对");
            return;
          }
        } else {
          roundHost = this.intGetType(_pokers);
        }
      }

      sendArray.push(_pokers);
      console.log("onion", "轮次迭代" + winLocal + "/" + _pokers + "数组" + sendArray);
    }

    console.log("onion", "跳出循环" + winLocal);
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
   * 2511165
   * @param gameHost 主
   * @param cardArray  当前手牌
   */
  ;

  _proto.sendAIHostCard = function sendAIHostCard(gamehost, userPokerObj) {
    var maxValue = null;
    var sendCard = null;

    for (var i = 0; i < 4; i++) {
      //判断副牌
      if (i == gamehost) {
        continue;
      } else {
        var array = this.selectArrayFrom(false, i + 1, userPokerObj);
        console.log("onion", "array" + array);

        if (array.length > 0) {
          var content = this.intGetContent(array[array.length - 1]);

          if (maxValue < content) {
            maxValue = content;
            sendCard = array[array.length - 1];
          }
        }
      }
    }

    if (sendCard) {
      return sendCard;
    }

    return userPokerObj.total[0];
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

      case 3:
        //
        return this.sendForthPoker(gameHost, roundHost, userCard, pokerObj);
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

  _proto.sendForthPoker = function sendForthPoker(gameHost, roundHost, userCard, pokerObj) {
    var firstCard = userCard[0];
    var secondCard = userCard[1];
    var thridCard = userCard[2];

    var result = _PokerUtil["default"].comparePoker(firstCard, secondCard);

    if (result === RIGHT_WIN) {
      result = _PokerUtil["default"].comparePoker(thridCard, secondCard);
    }

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
    console.log("onion", "pokerNum" + pokerNum);
    var typeValue = this.intGetType(pokerNum);
    var contentValue = this.intGetContent(pokerNum);

    var isHost = typeValue == gameHost || _PokerUtil["default"].quaryIsHost(contentValue);

    console.log("onion", "移除" + typeValue + "/" + contentValue + "/" + isHost);
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

  _proto.isRealNum = function isRealNum(val) {
    // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除，
    if (val === "" || val == null) {
      return false;
    }

    if (!isNaN(val)) {
      //对于空数组和只有一个数值成员的数组或全是数字组成的字符串，isNaN返回false，例如：'123'、[]、[2]、['123'],isNaN返回false,
      //所以如果不需要val包含这些特殊情况，则这个判断改写为if(!isNaN(val) && typeof val === 'number' )
      return true;
    } else {
      return false;
    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcQUlIZWxwZXIuanMiXSwibmFtZXMiOlsicG9rZXJXZWlnaHQiLCJMRUZUX1dJTiIsIlJJR0hUX1dJTiIsIkFJSGVscGVyIiwiY2hlY2tVc2VyQ2FuU2VuZCIsImdhbWVIb3N0Iiwicm91bmRIb3N0IiwidXNlclBva2VyT2JqIiwid2lsbFNlbmRDYXJkIiwiQXJyYXkiLCJpc0FycmF5IiwibGVuZ3RoIiwiY29uc29sZSIsImxvZyIsInRhcmdldEFycmF5Iiwic2VsZWN0QXJyYXlGcm9tIiwiaG9zdEFycmF5IiwiZmxhZzEiLCJpbmRleE9mIiwiZmxhZzIiLCJyb3VuZFByb2dyYW0iLCJvblVzZXJQbGF5Q2FsbEJhY2siLCJvblJvdW5kQ2FsbEJhY2siLCJyb3VuZE92ZXJDYWxsQmFjayIsIndpbkxvY2FsIiwic2VuZEFycmF5IiwicG9rZXJzIiwiaW50R2V0VHlwZSIsIm9yZ051bSIsImkiLCJjdXJyZW50UGxheWVyIiwicHVzaCIsImJpZ2dlciIsInN1bVNvY2VyIiwid2lubmVyUG9zaXRpb24iLCJpdGVtIiwiY29udGVudCIsImludEdldENvbnRlbnQiLCJQb2tlclV0aWwiLCJxdWFyeUlzU29jZXIiLCJyZXN1bHQiLCJjb21wYXJlUG9rZXIiLCJzZW5kQUlIb3N0Q2FyZCIsImdhbWVob3N0IiwibWF4VmFsdWUiLCJzZW5kQ2FyZCIsImFycmF5IiwidG90YWwiLCJzZW5kQUlGb2xsb3dDYXJkIiwidXNlckNhcmQiLCJwb2tlck9iaiIsImVycm9yIiwic2Vjb25kTG9naWMiLCJzZW5kVGhyaWRQb2tlciIsInNlbmRGb3J0aFBva2VyIiwic2VsZWN0U2luZ2xlQmlnZXJQb2tlciIsImZpcnN0Q2FyZCIsInNlY29uZENhcmQiLCJzZWxlY3RTb2NlclBva2VyIiwidGhyaWRDYXJkIiwidGFyZ2V0UG9rZXIiLCJjYXJkVmFsdWUiLCJ0eXBlVmFsdWUiLCJjb250ZW50VmFsdWUiLCJpc0hvc3QiLCJxdWFyeUlzSG9zdCIsInZhbHVlIiwiaXNBIiwicG9rZXJBcnJheSIsInNlbGVjdFNjb2VyRnJvbUFycmF5IiwidHlwZSIsInR5cGUxQXJyYXkiLCJ0eXBlMkFycmF5IiwidHlwZTNBcnJheSIsInR5cGU0QXJyYXkiLCJyZW1vdmVQb2tlckZyb21BcnJheSIsInBva2VyTnVtIiwiaW5kZXgiLCJzcGxpY2UiLCJNYXRoIiwiZmxvb3IiLCJzdHJHZXRUeXBlIiwic3Vic3RyaW5nIiwic3RyR2V0Q29udGVudCIsImlzUmVhbE51bSIsInZhbCIsImlzTmFOIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBRUEsSUFBSUEsV0FBVyxHQUFHLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0IsRUFBaEIsRUFBb0IsRUFBcEIsRUFBd0IsRUFBeEIsRUFBNEIsRUFBNUIsRUFBZ0MsRUFBaEMsRUFBb0MsRUFBcEMsRUFBd0MsQ0FBeEMsRUFBMkMsQ0FBM0MsRUFBOEMsRUFBOUMsRUFBa0QsRUFBbEQsRUFBc0QsRUFBdEQsQ0FBbEIsRUFBNEU7O0FBQzVFLElBQUlDLFFBQVEsR0FBRyxDQUFDLENBQWhCO0FBQ0EsSUFBSUMsU0FBUyxHQUFHLENBQWhCOztJQUNxQkM7Ozs7O0FBRWpCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7Ozs7Ozs7U0FPQUMsbUJBQUEsMEJBQWlCQyxRQUFqQixFQUEyQkMsU0FBM0IsRUFBc0NDLFlBQXRDLEVBQW9EQyxZQUFwRCxFQUFrRTtBQUM5RCxRQUFJQyxLQUFLLENBQUNDLE9BQU4sQ0FBY0YsWUFBZCxDQUFKLEVBQWlDO0FBQzdCLFVBQUlBLFlBQVksQ0FBQ0csTUFBYixLQUF3QixDQUE1QixFQUErQjtBQUMzQkgsUUFBQUEsWUFBWSxHQUFHQSxZQUFZLENBQUMsQ0FBRCxDQUEzQjtBQUNILE9BRkQsTUFFTztBQUNIO0FBQ0FJLFFBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLE9BQVosRUFBcUIsYUFBckI7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QVMsQ0FBQ3FCLFNBQVYsQ0FBb0IsQ0FBcEIsRUFBdUIsQ0FBdkIsQ0FBUDtBQUNIOztTQUVERSxZQUFBLG1CQUFVQyxHQUFWLEVBQWU7QUFDWDtBQUVBLFFBQUlBLEdBQUcsS0FBSyxFQUFSLElBQWNBLEdBQUcsSUFBSSxJQUF6QixFQUErQjtBQUMzQixhQUFPLEtBQVA7QUFDSDs7QUFDRCxRQUFJLENBQUNDLEtBQUssQ0FBQ0QsR0FBRCxDQUFWLEVBQWlCO0FBQ2I7QUFDQTtBQUNBLGFBQU8sSUFBUDtBQUNILEtBSkQsTUFNSztBQUNELGFBQU8sS0FBUDtBQUNIO0FBQ0oiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQb2tlclV0aWwgZnJvbSBcIi4vUG9rZXJVdGlsXCI7XHJcblxyXG5sZXQgcG9rZXJXZWlnaHQgPSBbNCwgNiwgNywgOCwgOSwgMTAsIDExLCAxMiwgMTMsIDE0LCAxNSwgMywgNSwgMTYsIDE3LCAxOF07Ly/kuLs15Li6MThcclxubGV0IExFRlRfV0lOID0gLTE7XHJcbmxldCBSSUdIVF9XSU4gPSAxO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBSUhlbHBlciB7XHJcblxyXG4gICAgLy8ge1xyXG4gICAgLy8gICAgIHR5cGUxQXJyYXk6dHlwZTFBcnJheSxcclxuICAgIC8vICAgICB0eXBlMkFycmF5OnR5cGUyQXJyYXksXHJcbiAgICAvLyAgICAgdHlwZTNBcnJheTp0eXBlM0FycmF5LFxyXG4gICAgLy8gICAgIHR5cGU0QXJyYXk6dHlwZTRBcnJheSxcclxuICAgIC8vICAgICBob3N0QXJyYXk6aG9zdEFycmF5LFxyXG4gICAgLy8gICAgIHRvdGFsOnRvdGFsXHJcbiAgICAvLyB9XHJcbiAgICAvKipcclxuICAgICAqIOajgOa1i+eUqOaIt+WHuueahOeJjOaYr+WQpuWQiOazlVxyXG4gICAgICogQHBhcmFtIGdhbWVIb3N0XHJcbiAgICAgKiBAcGFyYW0gcm91bmRIb3N0XHJcbiAgICAgKiBAcGFyYW0gdXNlckNhcmRcclxuICAgICAqIEBwYXJhbSBjYXJkQXJyYXlcclxuICAgICAqL1xyXG4gICAgY2hlY2tVc2VyQ2FuU2VuZChnYW1lSG9zdCwgcm91bmRIb3N0LCB1c2VyUG9rZXJPYmosIHdpbGxTZW5kQ2FyZCkge1xyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHdpbGxTZW5kQ2FyZCkpIHtcclxuICAgICAgICAgICAgaWYgKHdpbGxTZW5kQ2FyZC5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICAgIHdpbGxTZW5kQ2FyZCA9IHdpbGxTZW5kQ2FyZFswXTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8v5pqC5pe25LiN5pSv5oyBXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm9uaW9uXCIsIFwi5pqC5pe25LiN5pSv5oyB5Ye65a+5PT09PVwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFyb3VuZEhvc3QpIHtcclxuICAgICAgICAgICAgLy/msqHmnInmnKzova7kuLvvvIznjqnlrrblpLTkuIDkuKrlh7rniYxcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChnYW1lSG9zdCA9PSByb3VuZEhvc3QpIHtcclxuICAgICAgICAgICAgbGV0IHRhcmdldEFycmF5ID0gdGhpcy5zZWxlY3RBcnJheUZyb20odHJ1ZSwgcm91bmRIb3N0LCB1c2VyUG9rZXJPYmopO1xyXG4gICAgICAgICAgICAvL+iwg+S4u1xyXG4gICAgICAgICAgICBpZiAodXNlclBva2VyT2JqLmhvc3RBcnJheS5sZW5ndGggPiAwIHx8IHRhcmdldEFycmF5Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIC8v5pyJ5Li754mM5b+F6aG75Ye65Li754mMXHJcbiAgICAgICAgICAgICAgICBsZXQgZmxhZzEgPSB1c2VyUG9rZXJPYmouaG9zdEFycmF5LmluZGV4T2Yod2lsbFNlbmRDYXJkKSAhPT0gLTE7XHJcbiAgICAgICAgICAgICAgICBsZXQgZmxhZzIgPSB0YXJnZXRBcnJheS5pbmRleE9mKHdpbGxTZW5kQ2FyZCkgIT09IC0xO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZsYWcyIHx8IGZsYWcxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8v5rKh5Li75LqG6ZqP5L6/5Ye6XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy/oirHoibLnm7jlkIzlj6/ku6Xlh7pcclxuICAgICAgICAgICAgbGV0IHRhcmdldEFycmF5ID0gdGhpcy5zZWxlY3RBcnJheUZyb20odHJ1ZSwgcm91bmRIb3N0LCB1c2VyUG9rZXJPYmopO1xyXG4gICAgICAgICAgICBpZiAodGFyZ2V0QXJyYXkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldEFycmF5LmluZGV4T2Yod2lsbFNlbmRDYXJkKSAhPT0gLTE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy/ml6Byb3VuZEhvc3ToirHoibLlj6/ku6Xlh7pcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8v5Ye65Ymv54mM5pe277yM5pyJ5Ymv54mM5b+F6aG75Ye65Ymv54mMXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOa4uOaIj+avj+i9rumAu+i+ke+8jFxyXG4gICAgICog6LWi5a625Ye654mM77yM56Gu5a6a5pys6L2u5Li7XHJcbiAgICAgKiDkuIvlrrblh7rniYwg6LCDc2VuZEFJRm9sbG93Q2FyZFxyXG4gICAgICogNOWutumDveWHuuWujOe7k+eul++8jOenr+WIhuiuoeeul++8jOe7k+adn+acrOi9ru+8jOi/lOWbnuenr+WIhlxyXG4gICAgICogQHBhcmFtIG9uUm91bmRDYWxsQmFjayAg5Zue6LCDIOivpeebuOW6lOeOqeWutuWHuueJjFxyXG4gICAgICogQHBhcmFtIHdpbkxvY2FsIOS8mOWFiOWHuueJjOaWuSDntKLlvJXku44w5byA5aeLXHJcbiAgICAgKiBAcGFyYW0gZ2FtZUhvc3Qg5b2T5YmN5ri45oiP5Li7XHJcbiAgICAgKi9cclxuICAgIHJvdW5kUHJvZ3JhbShvblVzZXJQbGF5Q2FsbEJhY2ssIG9uUm91bmRDYWxsQmFjaywgcm91bmRPdmVyQ2FsbEJhY2ssIHdpbkxvY2FsLCBnYW1lSG9zdCwgc2VuZEFycmF5KSB7XHJcbiAgICAgICAgbGV0IHJvdW5kSG9zdCA9IG51bGw7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJvbmlvblwiLCBcIui9ruasoemAu+i+kVwiICsgd2luTG9jYWwgKyBcIi9cIiArIHNlbmRBcnJheSk7XHJcbiAgICAgICAgaWYgKCFzZW5kQXJyYXkgfHwgc2VuZEFycmF5Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICBzZW5kQXJyYXkgPSBbXTsvL+acrOi9ruWHuueahOeJjFxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBwb2tlcnMgPSBzZW5kQXJyYXlbMF07XHJcblxyXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShwb2tlcnMpICYmIHBva2Vycy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICAgIHBva2VycyA9IHBva2Vyc1swXTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocG9rZXJzKSkge1xyXG4gICAgICAgICAgICAgICAgcm91bmRIb3N0ID0gdGhpcy5pbnRHZXRUeXBlKHBva2Vyc1swXSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm9uaW9uXCIsIFwi5pqC5LiN5pSv5oyB5Ye65a+5XCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcm91bmRIb3N0ID0gdGhpcy5pbnRHZXRUeXBlKHBva2Vycyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgb3JnTnVtID0gc2VuZEFycmF5Lmxlbmd0aDtcclxuICAgICAgICBmb3IgKGxldCBpID0gb3JnTnVtOyBpIDw9IDQgLSBvcmdOdW07IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgY3VycmVudFBsYXllciA9ICh3aW5Mb2NhbCArIGkpICUgNDtcclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRQbGF5ZXIgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgb25Vc2VyUGxheUNhbGxCYWNrKGdhbWVIb3N0LCByb3VuZEhvc3QsIHNlbmRBcnJheSwgY3VycmVudFBsYXllcik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IHBva2VycyA9IG9uUm91bmRDYWxsQmFjayhnYW1lSG9zdCwgcm91bmRIb3N0LCBzZW5kQXJyYXksIGN1cnJlbnRQbGF5ZXIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHNlbmRBcnJheS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocG9rZXJzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJvdW5kSG9zdCA9IHRoaXMuaW50R2V0VHlwZShwb2tlcnNbMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHBva2Vycy5sZW5ndGghPT0xKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJvbmlvblwiLCBcIuaaguS4jeaUr+aMgeWHuuWvuVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcm91bmRIb3N0ID0gdGhpcy5pbnRHZXRUeXBlKHBva2Vycyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2VuZEFycmF5LnB1c2gocG9rZXJzKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJvbmlvblwiLCBcIui9ruasoei/reS7o1wiICsgd2luTG9jYWwgKyBcIi9cIiArIHBva2VycyArIFwi5pWw57uEXCIgKyBzZW5kQXJyYXkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmxvZyhcIm9uaW9uXCIsIFwi6Lez5Ye65b6q546vXCIgKyB3aW5Mb2NhbCk7XHJcbiAgICAgICAgbGV0IGJpZ2dlciA9IG51bGw7XHJcbiAgICAgICAgbGV0IHN1bVNvY2VyID0gMDtcclxuICAgICAgICBsZXQgd2lubmVyUG9zaXRpb24gPSAwO1xyXG4gICAgICAgIC8v5Yik5pat5ZOq5pa554mM5aSnXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZW5kQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGl0ZW0gPSBzZW5kQXJyYXlbaV07XHJcbiAgICAgICAgICAgIGxldCBjb250ZW50ID0gdGhpcy5pbnRHZXRDb250ZW50KGl0ZW0pO1xyXG4gICAgICAgICAgICBzdW1Tb2NlciArPSBQb2tlclV0aWwucXVhcnlJc1NvY2VyKGNvbnRlbnQpO1xyXG4gICAgICAgICAgICBpZiAoYmlnZ2VyID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGJpZ2dlciA9IGl0ZW07XHJcbiAgICAgICAgICAgICAgICB3aW5uZXJQb3NpdGlvbiA9IGk7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQgPSBQb2tlclV0aWwuY29tcGFyZVBva2VyKGdhbWVIb3N0LCByb3VuZEhvc3QsIGl0ZW0sIGJpZ2dlcik7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQgPT0gTEVGVF9XSU4pIHtcclxuICAgICAgICAgICAgICAgIGJpZ2dlciA9IGl0ZW07XHJcbiAgICAgICAgICAgICAgICB3aW5uZXJQb3NpdGlvbiA9IGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgd2lubmVyUG9zaXRpb24gKz0gd2luTG9jYWw7XHJcbiAgICAgICAgd2lubmVyUG9zaXRpb24gPSB3aW5uZXJQb3NpdGlvbiAlIDQ7XHJcbiAgICAgICAgaWYgKHdpbm5lclBvc2l0aW9uID09IDAgfHwgd2lubmVyUG9zaXRpb24gPT0gMikge1xyXG4gICAgICAgICAgICAvL+WKoOWIhlxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHN1bVNvY2VyID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcm91bmRPdmVyQ2FsbEJhY2sod2lubmVyUG9zaXRpb24sIHN1bVNvY2VyKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWFiOaJi+eUteiEkemAu+i+kVxyXG4gICAgICog5pmu6YCa5omT5rOV77yaXHJcbiAgICAgKiDmnInlia/lh7rmnIDlpKfnmoTlia/niYwg5oiW6ICF5Ymv54mM5a+5XHJcbiAgICAgKiDlhbbmrKHlh7rmnIDlsI/kuLvniYzvvIzkuI3osIPkuLvlr7lcclxuICAgICAqIOacgOWQjuS4gOi9ruWHuuS4u+WvuSDmiJbkuLtcclxuICAgICAqIOS4u+W6lOivpeWcqOWQjumdolxyXG4gICAgICogMjUxMTE2NVxyXG4gICAgICogQHBhcmFtIGdhbWVIb3N0IOS4u1xyXG4gICAgICogQHBhcmFtIGNhcmRBcnJheSAg5b2T5YmN5omL54mMXHJcbiAgICAgKi9cclxuICAgIHNlbmRBSUhvc3RDYXJkKGdhbWVob3N0LCB1c2VyUG9rZXJPYmopIHtcclxuICAgICAgICBsZXQgbWF4VmFsdWUgPSBudWxsO1xyXG4gICAgICAgIGxldCBzZW5kQ2FyZD1udWxsO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7Ly/liKTmlq3lia/niYxcclxuICAgICAgICAgICAgaWYgKGkgPT0gZ2FtZWhvc3QpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBhcnJheSA9IHRoaXMuc2VsZWN0QXJyYXlGcm9tKGZhbHNlLCBpKzEsIHVzZXJQb2tlck9iaik7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm9uaW9uXCIsXCJhcnJheVwiK2FycmF5KVxyXG4gICAgICAgICAgICAgICAgaWYgKGFycmF5Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgIGxldCBjb250ZW50PSB0aGlzLmludEdldENvbnRlbnQoYXJyYXlbYXJyYXkubGVuZ3RoIC0gMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgaWYobWF4VmFsdWU8Y29udGVudCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgbWF4VmFsdWU9Y29udGVudDtcclxuICAgICAgICAgICAgICAgICAgICAgICBzZW5kQ2FyZD1hcnJheVthcnJheS5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZihzZW5kQ2FyZCl7XHJcbiAgICAgICAgICAgIHJldHVybiBzZW5kQ2FyZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHVzZXJQb2tlck9iai50b3RhbFswXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWQjuaJi+eUteiEkemAu+i+kVxyXG4gICAgICog5Yik5pat5b2T5YmN6LCB5aSn77yM6Zif5Y+L5aSn5Ye65YiG77yM6Zif5Y+L5bCP5Ye65bCP54mM44CCXHJcbiAgICAgKiDml6DniYzlh7rmnIDlsI/lia/niYxcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZ2FtZUhvc3QgIOa4uOaIj+S4u1xyXG4gICAgICogQHBhcmFtIHJvdW5kSG9zdCDmnKzova7kuLtcclxuICAgICAqIEBwYXJhbSB1c2VyQ2FyZCAg5LiJ5pa55omA5Ye655qE54mMXHJcbiAgICAgKiBAcGFyYW0gY2FyZEFycmF5ICDoh6rlt7HliankvZnnmoTniYxcclxuICAgICAqL1xyXG4gICAgc2VuZEFJRm9sbG93Q2FyZChnYW1lSG9zdCwgcm91bmRIb3N0LCB1c2VyQ2FyZCwgcG9rZXJPYmopIHtcclxuICAgICAgICBzd2l0Y2ggKHVzZXJDYXJkLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBjYXNlIDA6Ly/oh6rlt7HmmK/pppblrrYg55CG6K665LiK5LiN5a2Y5Zyo77yM5bqU6K+l6LCDc2VuZEFJSG9zdENhcmRcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJvbmlvblwiLCBcImVycm9yIOWQjuaJi+eUteiEkeiwg+eUqOS6hnNlbmRBSUZvbGxvd0NhcmQg5bqU6K+l6LCD55SoIHNlbmRBSUhvc3RDYXJkIFwiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSAxOi8v5bC96YeP5Ye65aSn54mMXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zZWNvbmRMb2dpYyhnYW1lSG9zdCwgcm91bmRIb3N0LCB1c2VyQ2FyZCwgcG9rZXJPYmopO1xyXG4gICAgICAgICAgICBjYXNlIDI6Ly9cclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbmRUaHJpZFBva2VyKGdhbWVIb3N0LCByb3VuZEhvc3QsIHVzZXJDYXJkLCBwb2tlck9iaik7XHJcbiAgICAgICAgICAgIGNhc2UgMzovL1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VuZEZvcnRoUG9rZXIoZ2FtZUhvc3QsIHJvdW5kSG9zdCwgdXNlckNhcmQsIHBva2VyT2JqKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHNlY29uZExvZ2ljKGdhbWVIb3N0LCByb3VuZEhvc3QsIHVzZXJDYXJkLCBwb2tlck9iaikge1xyXG4gICAgICAgIGlmICh1c2VyQ2FyZFswXS5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgIC8v5Ye65a+555qE6YC76L6RXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0U2luZ2xlQmlnZXJQb2tlcihnYW1lSG9zdCwgcm91bmRIb3N0LCB1c2VyQ2FyZCwgcG9rZXJPYmopO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnrKzkuInmiYvnlLXohJFcclxuICAgICAqIOWIpOaWreiwgeWHuueahOWkpyzlsJ3or5Xnm5bov4fkuIDmiYtcclxuICAgICAqL1xyXG4gICAgc2VuZFRocmlkUG9rZXIoZ2FtZUhvc3QsIHJvdW5kSG9zdCwgdXNlckNhcmQsIHBva2VyT2JqKSB7XHJcbiAgICAgICAgbGV0IGZpcnN0Q2FyZCA9IHVzZXJDYXJkWzBdO1xyXG4gICAgICAgIGxldCBzZWNvbmRDYXJkID0gdXNlckNhcmRbMV07XHJcblxyXG4gICAgICAgIGxldCByZXN1bHQgPSBQb2tlclV0aWwuY29tcGFyZVBva2VyKGdhbWVIb3N0LCByb3VuZEhvc3QsIGZpcnN0Q2FyZCwgc2Vjb25kQ2FyZCk7XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gUklHSFRfV0lOKSB7XHJcbiAgICAgICAgICAgIC8v5a+55a625aSn77yM5bCd6K+V5Ye65YiG5oiW5bCP54mMXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbGVjdFNvY2VyUG9rZXIoZ2FtZUhvc3QsIHJvdW5kSG9zdCwgZmlyc3RDYXJkLCBwb2tlck9iaik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy/lh7rmnIDlpKfniYzvvIzlsJ3or5Xljovov4dmaXJzdENhcmQg5pyA5aSn55qE54mM5Lmf5Y6L5LiN6L+H5bCx5Ye65bCP54mMXHJcbiAgICAgICAgICAgIC8vVE9ETyDlj6/ku6XoioLnuqbvvIzlh7rku4Xljovov4flr7nmlrnnmoTlpKfniYxcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0U2luZ2xlQmlnZXJQb2tlcihnYW1lSG9zdCwgcm91bmRIb3N0LCBmaXJzdENhcmQsIHBva2VyT2JqKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWbm+aJi+eUteiEkVxyXG4gICAgICovXHJcbiAgICBzZW5kRm9ydGhQb2tlcihnYW1lSG9zdCwgcm91bmRIb3N0LCB1c2VyQ2FyZCwgcG9rZXJPYmopIHtcclxuICAgICAgICBsZXQgZmlyc3RDYXJkID0gdXNlckNhcmRbMF07XHJcbiAgICAgICAgbGV0IHNlY29uZENhcmQgPSB1c2VyQ2FyZFsxXTtcclxuICAgICAgICBsZXQgdGhyaWRDYXJkID0gdXNlckNhcmRbMl07XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IFBva2VyVXRpbC5jb21wYXJlUG9rZXIoZmlyc3RDYXJkLCBzZWNvbmRDYXJkKTtcclxuICAgICAgICBpZiAocmVzdWx0ID09PSBSSUdIVF9XSU4pIHtcclxuICAgICAgICAgICAgcmVzdWx0ID0gUG9rZXJVdGlsLmNvbXBhcmVQb2tlcih0aHJpZENhcmQsIHNlY29uZENhcmQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocmVzdWx0ID09PSBSSUdIVF9XSU4pIHtcclxuICAgICAgICAgICAgLy/lr7nlrrblpKfvvIzlsJ3or5Xlh7rliIbmiJblsI/niYxcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0U29jZXJQb2tlcihnYW1lSG9zdCwgcm91bmRIb3N0LCBmaXJzdENhcmQsIHBva2VyT2JqKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvL+WHuuacgOWkp+eJjO+8jOWwneivleWOi+i/h2ZpcnN0Q2FyZCDmnIDlpKfnmoTniYzkuZ/ljovkuI3ov4flsLHlh7rlsI/niYxcclxuICAgICAgICAgICAgLy9UT0RPIOWPr+S7peiKgue6pu+8jOWHuuS7heWOi+i/h+WvueaWueeahOWkp+eJjFxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RTaW5nbGVCaWdlclBva2VyKGdhbWVIb3N0LCByb3VuZEhvc3QsIGZpcnN0Q2FyZCwgcG9rZXJPYmopO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOmhtueJjOmAu+i+kVxyXG4gICAgICovXHJcbiAgICBzZWxlY3RTaW5nbGVCaWdlclBva2VyKGdhbWVIb3N0LCByb3VuZEhvc3QsIHRhcmdldFBva2VyLCBwb2tlck9iaikge1xyXG4gICAgICAgIC8v5Ye65Y2V55qE6YC76L6RIDHor4bliKvmmK/lkKbmmK/kuLvniYxcclxuICAgICAgICBsZXQgY2FyZFZhbHVlID0gdGFyZ2V0UG9rZXI7XHJcbiAgICAgICAgbGV0IHR5cGVWYWx1ZSA9IHRoaXMuaW50R2V0VHlwZShjYXJkVmFsdWUpO1xyXG4gICAgICAgIGxldCBjb250ZW50VmFsdWUgPSB0aGlzLmludEdldENvbnRlbnQoY2FyZFZhbHVlKTtcclxuICAgICAgICBsZXQgaXNIb3N0ID0gdHlwZVZhbHVlID09IGdhbWVIb3N0IHx8IFBva2VyVXRpbC5xdWFyeUlzSG9zdChjb250ZW50VmFsdWUpO1xyXG4gICAgICAgIGlmIChpc0hvc3QpIHtcclxuICAgICAgICAgICAgLy/pobblpKfniYxcclxuICAgICAgICAgICAgbGV0IGFycmF5ID0gdGhpcy5zZWxlY3RBcnJheUZyb20odHJ1ZSwgdHlwZVZhbHVlLCBwb2tlck9iaik7XHJcbiAgICAgICAgICAgIGlmIChhcnJheS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSBhcnJheVthcnJheS5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgICAgIGxldCByZXN1bHQgPSBQb2tlclV0aWwuY29tcGFyZVBva2VyKHZhbHVlLCBjYXJkVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgLy/og73pobbov4cg5Ye65aSn54mMXHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0ID09PSBMRUZUX1dJTikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7Ly/pobbkuI3ov4cg5Ye65bCP54mMXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFycmF5WzBdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBva2VyT2JqLnRvdGFsW3Bva2VyT2JqLnRvdGFsLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy/kuIrlrrbmmK/lkKbkuLpBIFxyXG4gICAgICAgICAgICBsZXQgaXNBID0gY29udGVudFZhbHVlID09IDE0O1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm9uaW9uXCIsIHRhcmdldFBva2VyICsgXCJ0eXBlXCIgKyB0eXBlVmFsdWUpO1xyXG4gICAgICAgICAgICAvL+iHquW3seaYr+WQpui/mOacieivpeiKseiJslxyXG4gICAgICAgICAgICBsZXQgcG9rZXJBcnJheSA9IHRoaXMuc2VsZWN0QXJyYXlGcm9tKGZhbHNlLCB0eXBlVmFsdWUsIHBva2VyT2JqKTtcclxuICAgICAgICAgICAgaWYgKHBva2VyQXJyYXkubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgIC8v5Ye65pyA5bCP55qE54mM5p2AXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcG9rZXJPYmouaG9zdEFycmF5WzBdO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlzQSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBva2VyQXJyYXlbMF07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcG9rZXJBcnJheVtwb2tlckFycmF5Lmxlbmd0aCAtIDFdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5LiK5YiG6YC76L6RIOWwj+eJjOmAu+i+kVxyXG4gICAgICovXHJcbiAgICBzZWxlY3RTb2NlclBva2VyKGdhbWVIb3N0LCByb3VuZEhvc3QsIHRhcmdldFBva2VyLCBwb2tlck9iaikge1xyXG4gICAgICAgIGxldCBjYXJkVmFsdWUgPSB0YXJnZXRQb2tlcjtcclxuICAgICAgICBsZXQgdHlwZVZhbHVlID0gdGhpcy5pbnRHZXRUeXBlKGNhcmRWYWx1ZSk7XHJcbiAgICAgICAgbGV0IGNvbnRlbnRWYWx1ZSA9IHRoaXMuaW50R2V0Q29udGVudChjYXJkVmFsdWUpO1xyXG4gICAgICAgIGxldCBpc0hvc3QgPSB0eXBlVmFsdWUgPT0gZ2FtZUhvc3QgfHwgUG9rZXJVdGlsLnF1YXJ5SXNIb3N0KGNvbnRlbnRWYWx1ZSk7XHJcbiAgICAgICAgaWYgKGlzSG9zdCkge1xyXG4gICAgICAgICAgICBsZXQgYXJyYXkgPSB0aGlzLnNlbGVjdEFycmF5RnJvbSh0cnVlLCB0eXBlVmFsdWUsIHBva2VyT2JqKTtcclxuICAgICAgICAgICAgaWYgKGFycmF5Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbGVjdFNjb2VyRnJvbUFycmF5KGFycmF5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL1RPRE8g5b6F5LyY5YyWIOWHuuacgOWwj+eahOeJjCDlvZPliY3mmK/mgLvniYzlupPnmoTnrKzkuIDlvKDniYwgXHJcbiAgICAgICAgICAgIHJldHVybiBwb2tlck9iai50b3RhbFswXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgYXJyYXkgPSB0aGlzLnNlbGVjdEFycmF5RnJvbSh0cnVlLCB0eXBlVmFsdWUsIHBva2VyT2JqKTtcclxuICAgICAgICAgICAgaWYgKGFycmF5Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIC8v5LuO6K+l6Iqx6Imy6YCJ54mMXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RTY29lckZyb21BcnJheShhcnJheSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy/lhajlsYDpgInniYxcclxuICAgICAgICAgICAgYXJyYXkgPSBwb2tlck9iai50b3RhbDtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0U2NvZXJGcm9tQXJyYXkoYXJyYXkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZWxlY3RTY29lckZyb21BcnJheShhcnJheSkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IFBva2VyVXRpbC5xdWFyeUlzU29jZXIodGhpcy5pbnRHZXRDb250ZW50KGFycmF5W2ldKSk7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhcnJheVtpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXJyYXlbMF07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDpgInlh7rlr7nlupTnmoTniYznu4RcclxuICAgICAqIEBwYXJhbSB7Kn0gaXNIb3N0ICDlm7rlrprkuLvmlbDnu4RcclxuICAgICAqIEBwYXJhbSB7Kn0gdHlwZSAgICDoirHoibLnsbvlnotcclxuICAgICAqIEBwYXJhbSB7Kn0gcG9rZXJPYmogIOeJjOe7hOWvueixoVxyXG4gICAgICovXHJcbiAgICBzZWxlY3RBcnJheUZyb20oaXNIb3N0LCB0eXBlLCBwb2tlck9iaikge1xyXG4gICAgICAgIGlmIChpc0hvc3QpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHBva2VyT2JqLmhvc3RBcnJheTtcclxuICAgICAgICB9XHJcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgIHJldHVybiBwb2tlck9iai50eXBlMUFycmF5O1xyXG4gICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcG9rZXJPYmoudHlwZTJBcnJheTtcclxuICAgICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBva2VyT2JqLnR5cGUzQXJyYXk7XHJcbiAgICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgICAgIHJldHVybiBwb2tlck9iai50eXBlNEFycmF5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlUG9rZXJGcm9tQXJyYXkoZ2FtZUhvc3QsIHBva2VyTnVtLCBwb2tlck9iaikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwib25pb25cIiwgXCJwb2tlck51bVwiICsgcG9rZXJOdW0pO1xyXG4gICAgICAgIGxldCB0eXBlVmFsdWUgPSB0aGlzLmludEdldFR5cGUocG9rZXJOdW0pO1xyXG4gICAgICAgIGxldCBjb250ZW50VmFsdWUgPSB0aGlzLmludEdldENvbnRlbnQocG9rZXJOdW0pO1xyXG4gICAgICAgIGxldCBpc0hvc3QgPSB0eXBlVmFsdWUgPT0gZ2FtZUhvc3QgfHwgUG9rZXJVdGlsLnF1YXJ5SXNIb3N0KGNvbnRlbnRWYWx1ZSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJvbmlvblwiLCBcIuenu+mZpFwiICsgdHlwZVZhbHVlICsgXCIvXCIgKyBjb250ZW50VmFsdWUgKyBcIi9cIiArIGlzSG9zdCk7XHJcbiAgICAgICAgbGV0IGFycmF5ID0gdGhpcy5zZWxlY3RBcnJheUZyb20oaXNIb3N0LCB0eXBlVmFsdWUsIHBva2VyT2JqKTtcclxuICAgICAgICAvL+WIhue7hOaVsOe7hOWIoOmZpFxyXG4gICAgICAgIGxldCBpbmRleCA9IGFycmF5LmluZGV4T2YocG9rZXJOdW0pO1xyXG4gICAgICAgIGFycmF5LnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgLy/lhajlsYDmlbDnu4TliKDpmaRcclxuICAgICAgICBhcnJheSA9IHBva2VyT2JqLnRvdGFsO1xyXG4gICAgICAgIGluZGV4ID0gYXJyYXkuaW5kZXhPZihwb2tlck51bSk7XHJcbiAgICAgICAgYXJyYXkuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgIH1cclxuXHJcbiAgICBpbnRHZXRUeXBlKGNhcmRWYWx1ZSkge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKGNhcmRWYWx1ZSAlIDEwKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgc3RyR2V0VHlwZShjYXJkVmFsdWUpIHtcclxuICAgICAgICByZXR1cm4gY2FyZFZhbHVlLnN1YnN0cmluZygyKVxyXG4gICAgfVxyXG5cclxuICAgIGludEdldENvbnRlbnQoY2FyZFZhbHVlKSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoY2FyZFZhbHVlIC8gMTApO1xyXG4gICAgfVxyXG5cclxuICAgIHN0ckdldENvbnRlbnQoY2FyZFZhbHVlKSB7XHJcbiAgICAgICAgcmV0dXJuIGNhcmRWYWx1ZS5zdWJzdHJpbmcoMCwgMik7XHJcbiAgICB9XHJcblxyXG4gICAgaXNSZWFsTnVtKHZhbCkge1xyXG4gICAgICAgIC8vIGlzTmFOKCnlh73mlbAg5oqK56m65LiyIOepuuagvCDku6Xlj4pOVWxsIOaMieeFpzDmnaXlpITnkIYg5omA5Lul5YWI5Y676Zmk77yMXHJcblxyXG4gICAgICAgIGlmICh2YWwgPT09IFwiXCIgfHwgdmFsID09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWlzTmFOKHZhbCkpIHtcclxuICAgICAgICAgICAgLy/lr7nkuo7nqbrmlbDnu4Tlkozlj6rmnInkuIDkuKrmlbDlgLzmiJDlkZjnmoTmlbDnu4TmiJblhajmmK/mlbDlrZfnu4TmiJDnmoTlrZfnrKbkuLLvvIxpc05hTui/lOWbnmZhbHNl77yM5L6L5aaC77yaJzEyMyfjgIFbXeOAgVsyXeOAgVsnMTIzJ10saXNOYU7ov5Tlm55mYWxzZSxcclxuICAgICAgICAgICAgLy/miYDku6XlpoLmnpzkuI3pnIDopoF2YWzljIXlkKvov5nkupvnibnmrormg4XlhrXvvIzliJnov5nkuKrliKTmlq3mlLnlhpnkuLppZighaXNOYU4odmFsKSAmJiB0eXBlb2YgdmFsID09PSAnbnVtYmVyJyApXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59Il19
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
                    var __filename = 'preview-scripts/assets/scripts/Other.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'cad1b5LmG9NiKt2jGuL7bHy', 'Other');
// scripts/Other.js

"use strict";

// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
cc.Class({
  "extends": cc.Component,
  properties: {
    backButton: {
      "default": null,
      type: cc.Button
    },
    playButton: {
      "default": null,
      type: cc.Button
    },
    // player 节点，用于获取主角弹跳的高度，和控制主角行动开关
    poker: {
      "default": null,
      type: cc.Node
    }
  },
  // LIFE-CYCLE CALLBACKS:
  onLoad: function onLoad() {
    this.backButton.node.on('click', this.backClick, this);
    this.playButton.node.on('click', this.playClick, this);
    var str = cc.sys.localStorage.getItem('userData');
    console.log("onion" + "str" + str);
  },
  backClick: function backClick(button) {
    cc.director.loadScene("game");
  },
  playClick: function playClick() {
    var str = cc.sys.localStorage.getItem('userData'); // var action = cc.moveTo(2, 100, 100);
    // 执行动作
    //   this.poker.runAction(action);

    var spawn = cc.spawn(cc.moveBy(2, 100, 100), cc.scaleTo(0.5, 0.8, 1.4));
    this.poker.runAction(spawn);
    this.saveTest();
  },
  //测试本地存储
  saveTest: function saveTest() {
    userData = {
      name: 'Tracer',
      level: 1,
      gold: 100
    };
    cc.sys.localStorage.setItem('userData', JSON.stringify(userData));
  },
  start: function start() {} // update (dt) {},

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcT3RoZXIuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJiYWNrQnV0dG9uIiwidHlwZSIsIkJ1dHRvbiIsInBsYXlCdXR0b24iLCJwb2tlciIsIk5vZGUiLCJvbkxvYWQiLCJub2RlIiwib24iLCJiYWNrQ2xpY2siLCJwbGF5Q2xpY2siLCJzdHIiLCJzeXMiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwiY29uc29sZSIsImxvZyIsImJ1dHRvbiIsImRpcmVjdG9yIiwibG9hZFNjZW5lIiwic3Bhd24iLCJtb3ZlQnkiLCJzY2FsZVRvIiwicnVuQWN0aW9uIiwic2F2ZVRlc3QiLCJ1c2VyRGF0YSIsIm5hbWUiLCJsZXZlbCIsImdvbGQiLCJzZXRJdGVtIiwiSlNPTiIsInN0cmluZ2lmeSIsInN0YXJ0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNMLGFBQVNELEVBQUUsQ0FBQ0UsU0FEUDtBQUdMQyxFQUFBQSxVQUFVLEVBQUU7QUFDUkMsSUFBQUEsVUFBVSxFQUFFO0FBQ1IsaUJBQVMsSUFERDtBQUVSQyxNQUFBQSxJQUFJLEVBQUVMLEVBQUUsQ0FBQ007QUFGRCxLQURKO0FBS1JDLElBQUFBLFVBQVUsRUFBRTtBQUNSLGlCQUFTLElBREQ7QUFFUkYsTUFBQUEsSUFBSSxFQUFFTCxFQUFFLENBQUNNO0FBRkQsS0FMSjtBQVNSO0FBQ0FFLElBQUFBLEtBQUssRUFBRTtBQUNILGlCQUFTLElBRE47QUFFSEgsTUFBQUEsSUFBSSxFQUFFTCxFQUFFLENBQUNTO0FBRk47QUFWQyxHQUhQO0FBbUJMO0FBRUFDLEVBQUFBLE1BckJLLG9CQXFCSTtBQUNMLFNBQUtOLFVBQUwsQ0FBZ0JPLElBQWhCLENBQXFCQyxFQUFyQixDQUF3QixPQUF4QixFQUFpQyxLQUFLQyxTQUF0QyxFQUFpRCxJQUFqRDtBQUNBLFNBQUtOLFVBQUwsQ0FBZ0JJLElBQWhCLENBQXFCQyxFQUFyQixDQUF3QixPQUF4QixFQUFpQyxLQUFLRSxTQUF0QyxFQUFpRCxJQUFqRDtBQUNBLFFBQUlDLEdBQUcsR0FBQ2YsRUFBRSxDQUFDZ0IsR0FBSCxDQUFPQyxZQUFQLENBQW9CQyxPQUFwQixDQUE0QixVQUE1QixDQUFSO0FBQ0FDLElBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLFVBQVEsS0FBUixHQUFjTCxHQUExQjtBQUVILEdBM0JJO0FBNEJMRixFQUFBQSxTQUFTLEVBQUUsbUJBQVVRLE1BQVYsRUFBa0I7QUFDekJyQixJQUFBQSxFQUFFLENBQUNzQixRQUFILENBQVlDLFNBQVosQ0FBc0IsTUFBdEI7QUFDSCxHQTlCSTtBQStCTFQsRUFBQUEsU0FBUyxFQUFFLHFCQUFZO0FBQ25CLFFBQUlDLEdBQUcsR0FBQ2YsRUFBRSxDQUFDZ0IsR0FBSCxDQUFPQyxZQUFQLENBQW9CQyxPQUFwQixDQUE0QixVQUE1QixDQUFSLENBRG1CLENBRW5CO0FBQ0E7QUFDQTs7QUFDQSxRQUFJTSxLQUFLLEdBQUd4QixFQUFFLENBQUN3QixLQUFILENBQVN4QixFQUFFLENBQUN5QixNQUFILENBQVUsQ0FBVixFQUFhLEdBQWIsRUFBa0IsR0FBbEIsQ0FBVCxFQUFpQ3pCLEVBQUUsQ0FBQzBCLE9BQUgsQ0FBVyxHQUFYLEVBQWdCLEdBQWhCLEVBQXFCLEdBQXJCLENBQWpDLENBQVo7QUFDQSxTQUFLbEIsS0FBTCxDQUFXbUIsU0FBWCxDQUFxQkgsS0FBckI7QUFDQSxTQUFLSSxRQUFMO0FBRUgsR0F4Q0k7QUF5Q0w7QUFDQUEsRUFBQUEsUUFBUSxFQUFDLG9CQUFVO0FBQ2ZDLElBQUFBLFFBQVEsR0FBRztBQUNQQyxNQUFBQSxJQUFJLEVBQUUsUUFEQztBQUVQQyxNQUFBQSxLQUFLLEVBQUUsQ0FGQTtBQUdQQyxNQUFBQSxJQUFJLEVBQUU7QUFIQyxLQUFYO0FBTUFoQyxJQUFBQSxFQUFFLENBQUNnQixHQUFILENBQU9DLFlBQVAsQ0FBb0JnQixPQUFwQixDQUE0QixVQUE1QixFQUF3Q0MsSUFBSSxDQUFDQyxTQUFMLENBQWVOLFFBQWYsQ0FBeEM7QUFDSCxHQWxESTtBQW1ETE8sRUFBQUEsS0FuREssbUJBbURHLENBRVAsQ0FyREksQ0F1REw7O0FBdkRLLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIi8vIExlYXJuIGNjLkNsYXNzOlxyXG4vLyAgLSBodHRwczovL2RvY3MuY29jb3MuY29tL2NyZWF0b3IvbWFudWFsL2VuL3NjcmlwdGluZy9jbGFzcy5odG1sXHJcbi8vIExlYXJuIEF0dHJpYnV0ZTpcclxuLy8gIC0gaHR0cHM6Ly9kb2NzLmNvY29zLmNvbS9jcmVhdG9yL21hbnVhbC9lbi9zY3JpcHRpbmcvcmVmZXJlbmNlL2F0dHJpYnV0ZXMuaHRtbFxyXG4vLyBMZWFybiBsaWZlLWN5Y2xlIGNhbGxiYWNrczpcclxuLy8gIC0gaHR0cHM6Ly9kb2NzLmNvY29zLmNvbS9jcmVhdG9yL21hbnVhbC9lbi9zY3JpcHRpbmcvbGlmZS1jeWNsZS1jYWxsYmFja3MuaHRtbFxyXG5cclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICBiYWNrQnV0dG9uOiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6IGNjLkJ1dHRvblxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcGxheUJ1dHRvbjoge1xyXG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxyXG4gICAgICAgICAgICB0eXBlOiBjYy5CdXR0b25cclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIHBsYXllciDoioLngrnvvIznlKjkuo7ojrflj5bkuLvop5LlvLnot7PnmoTpq5jluqbvvIzlkozmjqfliLbkuLvop5LooYzliqjlvIDlhbNcclxuICAgICAgICBwb2tlcjoge1xyXG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxyXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcblxyXG4gICAgLy8gTElGRS1DWUNMRSBDQUxMQkFDS1M6XHJcblxyXG4gICAgb25Mb2FkKCkge1xyXG4gICAgICAgIHRoaXMuYmFja0J1dHRvbi5ub2RlLm9uKCdjbGljaycsIHRoaXMuYmFja0NsaWNrLCB0aGlzKVxyXG4gICAgICAgIHRoaXMucGxheUJ1dHRvbi5ub2RlLm9uKCdjbGljaycsIHRoaXMucGxheUNsaWNrLCB0aGlzKVxyXG4gICAgICAgIGxldCBzdHI9Y2Muc3lzLmxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VyRGF0YScpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwib25pb25cIitcInN0clwiK3N0cik7XHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG4gICAgYmFja0NsaWNrOiBmdW5jdGlvbiAoYnV0dG9uKSB7XHJcbiAgICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKFwiZ2FtZVwiKTtcclxuICAgIH0sXHJcbiAgICBwbGF5Q2xpY2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBsZXQgc3RyPWNjLnN5cy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlckRhdGEnKTtcclxuICAgICAgICAvLyB2YXIgYWN0aW9uID0gY2MubW92ZVRvKDIsIDEwMCwgMTAwKTtcclxuICAgICAgICAvLyDmiafooYzliqjkvZxcclxuICAgICAgICAvLyAgIHRoaXMucG9rZXIucnVuQWN0aW9uKGFjdGlvbik7XHJcbiAgICAgICAgdmFyIHNwYXduID0gY2Muc3Bhd24oY2MubW92ZUJ5KDIsIDEwMCwgMTAwKSwgY2Muc2NhbGVUbygwLjUsIDAuOCwgMS40KSk7XHJcbiAgICAgICAgdGhpcy5wb2tlci5ydW5BY3Rpb24oc3Bhd24pO1xyXG4gICAgICAgIHRoaXMuc2F2ZVRlc3QoKTtcclxuXHJcbiAgICB9LFxyXG4gICAgLy/mtYvor5XmnKzlnLDlrZjlgqhcclxuICAgIHNhdmVUZXN0OmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdXNlckRhdGEgPSB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdUcmFjZXInLFxyXG4gICAgICAgICAgICBsZXZlbDogMSxcclxuICAgICAgICAgICAgZ29sZDogMTAwXHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICAgICBjYy5zeXMubG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3VzZXJEYXRhJywgSlNPTi5zdHJpbmdpZnkodXNlckRhdGEpKTtcclxuICAgIH0sXHJcbiAgICBzdGFydCgpIHtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIHVwZGF0ZSAoZHQpIHt9LFxyXG59KTtcclxuIl19
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
//------QC-SOURCE-SPLIT------
