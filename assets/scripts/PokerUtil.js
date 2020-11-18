let pokerWeight = [4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 3, 5, 16, 17, 18];//主5为18
let LEFT_WIN = -1;
let RIGHT_WIN = 1;
export default class PokerUtil {

    static testLogic = (testArray) => {
        let gamehost = Math.random() * 4;
        let roundhost = Math.random() * 4;
        gamehost = parseInt(gamehost) + 1;
        roundhost = parseInt(roundhost) + 1;
        console.log("onion", "当前游戏主" + gamehost + "本轮主" + roundhost);
        if (testArray.length == 1) {
            let testValue = testArray[0] + "";
            console.log("onion", PokerUtil.quaryPokerWeight(parseInt(testValue.substring(0, 2))));
        } else if (testArray.length >= 2) {
            console.log("onion", PokerUtil.comparePoker(gamehost, roundhost, testArray[0], testArray[1]));
        }
    }
    static testArrayLogic = (testArray1,testArray2) => {
        let gamehost = Math.random() * 4;
        let roundhost = Math.random() * 4;
        gamehost = parseInt(gamehost) + 1;
        roundhost = parseInt(roundhost) + 1;
        console.log("onion", "当前游戏主" + gamehost + "本轮主" + roundhost);
        console.log("onion", PokerUtil.comparePoker(gamehost, roundhost, testArray1, testArray2));

    }

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
    static comparePoker = (gamehost, roundhost, valueLeft, valueRight) => {
        console.log("onion", "comparePoker++" + PokerUtil.quaryPokerValue(valueLeft)+"/"+PokerUtil.quaryPokerValue(valueRight));
        if (Array.isArray(valueLeft) || Array.isArray(valueRight)) {
            console.error("onion", "暂不支持数组" );
            PokerUtil.compareArray(gamehost, roundhost, valueLeft, valueRight);
            return LEFT_WIN;
        }

        if (valueRight == valueLeft) {
            //完全相同，先牌大
            return LEFT_WIN;
        }
        valueRight = valueRight + "";
        valueLeft = valueLeft + "";
        //1 判断先牌后牌的花色
        let typeLeft = valueLeft.substring(2);
        let typeRight = valueRight.substring(2);
        //2判断先牌后牌值
        let contentLeft = valueLeft.substring(0, 2);
        let contentRight = valueRight.substring(0, 2);
        //3判断牌是否为主 活动主
        let leftIsHost = typeLeft == gamehost || PokerUtil.quaryIsHost(contentLeft);
        let rightIsHost = typeLeft == gamehost || PokerUtil.quaryIsHost(contentRight);
        //4比较
        if (leftIsHost && rightIsHost) {
            //同为主，主5最大
            if (parseInt(contentLeft) == 5) {
                return LEFT_WIN;
            } else if (parseInt(contentRight) == 5) {
                return RIGHT_WIN;
            } else {
                //直接比大小
                let result = PokerUtil.compareSinglePokerBigger(contentLeft, contentRight);
                if (result != 0) {
                    return result;
                } else {
                    //大小相同，存在活动主和花色主牌值相同情况
                    if (typeLeft == gamehost) {
                        return LEFT_WIN;
                    } else if (typeRight == gamehost) {
                        return RIGHT_WIN;
                    } else {//同为活动主
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
    }

    /**
     * 不判断花色，直接比大小 只接受两位
     * 允许返回0
     *
     */
    static compareSinglePokerBigger = (valueLeft, valueRight) => {
        if (valueLeft.length > 2 || valueRight.length > 2) {
            console.error("只接受两位的" + valueLeft + "/" + valueRight);
            return 1;
        }
        let leftNum = parseInt(valueLeft);
        let rightNum = parseInt(valueRight);
        let result = PokerUtil.quaryPokerWeight(rightNum) - PokerUtil.quaryPokerWeight(leftNum);
        if (result > 0) {
            result = RIGHT_WIN;
        } else if (result < 0) {
            result = LEFT_WIN;
        }
        return result;

    }

    /**
     * 判断牌的大小
     * @param {*} poker
     */
    static quaryPokerWeight(poker) {
        return pokerWeight.indexOf(poker);
    }

    /**
     * 判断牌是不是活动主 15 3 5对应 2 3 5
     */
    static quaryIsHost(poker) {
        let value = parseInt(poker);
        return value == 15 || value == 3 || value == 5 || value == 16 || value == 17 || value == 18;//2 3 5 小王 大王 主5
    }

    /**
     * 判断副牌谁大
     * @param {*} roundhost
     * @param {*} valueLeft
     * @param {*} valueRight
     */
    static compareVice(roundhost, typeLeft, typeRight, contentLeft, contentRight) {
        if (typeRight == typeLeft == roundhost) {
            return PokerUtil.compareSinglePokerBigger(contentLeft, contentRight);
        } else if (typeLeft == roundhost) {
            return LEFT_WIN;
        } else if (typeRight == roundhost) {
            return RIGHT_WIN;
        } else {//都是副牌 不是本轮主，多半是跟牌，意义不大
            return LEFT_WIN;
        }

    }

    static compareArray = (gamehost, roundhost, valueLeft, valueRight) => {
        //偶数张，排数不一致
        if (valueLeft.length != valueRight.length||valueLeft.length%2!=0) {
            console.error("onion", "数组长度不一致");
            return LEFT_WIN;
        }
        //1 排序
        let arrayLeft=valueLeft.sort();
        let arrayRight=valueRight.sort();
        //2 奇数和偶数一样，对子合法性

        //一对直接比
        //多对先校验合法性，1是否多对 2是否连对 3花色一致 4

    }
    /**
     * 比本轮大小，返回赢家 1234顺位
     */
    static compareRound = (playPokers) => {

    }

    static destoryArray = (destoryNode) => {
        if (destoryNode != null) {
            for (let i = 0; i < destoryNode.length; i++) {
                destoryNode[i].destroy();
            }
        }
    }

    static quaryType = (type) => {
        switch (type) {
            case "1":
                return "方块";
            case "2":
                return "梅花";
            case "3":
                return "红桃";
                break;
            case "4":
                return "黑桃";
        }
    }
    /**
     * 通过牌序查花色大小
     * 最后一位是花色
     */
    static quaryPokerValue = (value) => {
        let cardNum = value + "";
        if (cardNum == "171") {
            return "大王";
        } else if (cardNum == "161") {
            return "小王"
        } else if (cardNum == "181") {
            return "卡背"
        } else {
            let compare = cardNum.substring(0, 2);
            let type = cardNum.substring(2);
            let result = PokerUtil.quaryType(type);
            switch (compare) {
                case "03":
                    result = result + "3";
                    break;
                case "04":
                    result = result + "4";
                    break
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
    }

}