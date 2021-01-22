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
    static testArrayLogic = (testArray1, testArray2) => {
        let gamehost = Math.random() * 4;
        let roundhost = Math.random() * 4;
        gamehost = parseInt(gamehost) + 1;
        roundhost = parseInt(roundhost) + 1;
      

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
        console.log("onion", "comparePoker++" + PokerUtil.quaryPokerValue(valueLeft) + "/" + PokerUtil.quaryPokerValue(valueRight));
        if (Array.isArray(valueLeft) || Array.isArray(valueRight)) {
            if(valueLeft.length==1){
                valueLeft=valueLeft[0];
            }
            if(valueRight.length==1){
                valueRight=valueRight[0];
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
     * 返回分数值
     * @param poker
     * @returns {*}
     */
    static quaryIsSocer(poker){
        if(poker==5||poker==10){
            return poker;
        }else if(poker==13){
            return 10;
        }else {
            return 0;
        }
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
        if (valueLeft.length != valueRight.length || valueLeft.length % 2 != 0) {
            console.error("onion", "数组长度不一致");
            return LEFT_WIN;
        }
        //1 排序
        let arrayLeft = valueLeft.sort();
        let arrayRight = valueRight.sort();
        //2 奇数和偶数一样，判断对子合法性
        let resultLeft = PokerUtil.checkArrayValue(arrayLeft);
        let resultRight = PokerUtil.checkArrayValue(arrayRight);
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
        } else {//都不是主 跟牌大小无意义
            return LEFT_WIN;
        }

        //一对直接比
        //多对先校验合法性，1是否多对 2是否连对 3花色一致 4

    }
    /**
     * 判断对子合法性 返回[花色 权重]
     * @param {*} array 
     */
    static checkArrayValue = (array) => {
        let odd = "-1";
        let even = "-1"
        let lastType = "-1";
        let result = 0;
        for (let index = 0; index < array.length; index++) {
            if (index % 2 == 0) {
                even = array[index];
            } else {
                odd = array[index];
                if (even != odd) {
                    return ["-1", -1];
                }
                let cardNum = odd;
                let type = "0";
                if (cardNum == "171" || cardNum == "161") {
                    //大小王
                    type = "5";
                } else {
                    let str = cardNum.substring(2);
                    type = PokerUtil.quaryType(str);
                }
                if (lastType != type && lastType != "-1") {
                    //不是首次且与之前花色不同，不能算对子
                    return ["-1", -1];
                }
                lastType = type;
                let compare = cardNum.substring(0, 2);
                result = result + PokerUtil.quaryPokerWeight(parseInt(compare));
            }
        }
        return [lastType, result];
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
    static sort=(a,b)=>{
        a=Math.floor(a/10);
        b=Math.floor(b/10);
        let left=PokerUtil.quaryPokerWeight(a);
        let right=PokerUtil.quaryPokerWeight(b);
        return left-right;
    }

    static sortInsert=(array,item)=>{
        if(array.length===0){
            array.push(item);
            return array
        }
        // let value=item.substring(0,2);
        let value=item/10;
        let weight=PokerUtil.quaryPokerWeight(value);
        let firstWeight=PokerUtil.quaryPokerWeight(array[0]/10);
        let lastWeight=PokerUtil.quaryPokerWeight(array[array.length-1]/10);
        if(weight<=firstWeight){
            array=[item,...array];
            // array.unshift(item);
        }else if(weight>=lastWeight){
            array.push(item);
        }
        return array;

    }

    static quaryType = (type) => {
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
    }
    static quaryPokerTypeValue = (pokerValue) => {
        pokerValue=pokerValue+"";
        if (pokerValue == "171") {
            return "3";
        }
        if (pokerValue == "161") {
            return "4";
        }
        // console.log("onion","pokerValue"+pokerValue);
        return pokerValue.substring(2);
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

    /**
     * 把牌按花色排好
     * @param gameHost
     * @param cardArray
     * @returns
     *  {
            type1Array:type1Array,
            type2Array:type2Array,
            type3Array:type3Array,
            type4Array:type4Array,
            hostArray:hostArray,
            total:total
        }
     */
    static sortPokers=(gameHost,cardArray)=>{
        let type1Array=[];
        let type2Array=[];
        let type3Array=[];
        let type4Array=[];
        let hostArray=[];//活动主
        for(let i=0;i<cardArray.length;i++){
            let item=cardArray[i];
            if(item==171||item==161){
                hostArray.push(item);
                continue;
            }
            
            // let type=parseInt(item.substring(2));
            let value=Math.floor(item/10);
            if(PokerUtil.quaryIsHost(value)){
                hostArray.push(item);
                continue;
            }
            let type=item%10;
            switch (type){
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
        switch (parseInt(gameHost)){
            case 1:
                return PokerUtil.createStatic(type1Array,type2Array,type3Array,type4Array,hostArray,
                    type2Array.concat(type3Array).concat(type4Array).concat(type1Array).concat(hostArray));
            case 2:
                return PokerUtil.createStatic(type1Array,type2Array,type3Array,type4Array,hostArray,
                    type3Array.concat(type4Array).concat(type1Array).concat(type2Array).concat(hostArray));
            case 3:
                return PokerUtil.createStatic(type1Array,type2Array,type3Array,type4Array,hostArray,
                    type4Array.concat(type1Array).concat(type2Array).concat(type3Array).concat(hostArray));
            case 4:
                return PokerUtil.createStatic(type1Array,type2Array,type3Array,type4Array,hostArray,
                    type1Array.concat(type2Array).concat(type3Array).concat(type4Array).concat(hostArray));
        }
    }

   
   static createStatic=(type1Array,type2Array,type3Array,type4Array,hostArray,total)=>{
        return {
            type1Array:type1Array,
            type2Array:type2Array,
            type3Array:type3Array,
            type4Array:type4Array,
            hostArray:hostArray,
            total:total
        }

   }

   static saveRecoder=()=>{
       let userData = {
           name: 'Tracer',
           level: 1,
           gold: 100
       };

       cc.sys.localStorage.setItem('userData', JSON.stringify(userData));
   }
   static quaryReocder=()=>{
       let userData = JSON.parse(cc.sys.localStorage.getItem('userData'));
   }

}