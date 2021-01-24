import PokerUtil from "./PokerUtil";

let pokerWeight = [4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 3, 5, 16, 17, 18];//主5为18
let LEFT_WIN = -1;
let RIGHT_WIN = 1;
export default class AIHelper {

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
    checkUserCanSend(gameHost, roundHost, userPokerObj, willSendCard) {
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
            let targetArray = this.selectArrayFrom(true, roundHost, userPokerObj);
            //调主
            if (userPokerObj.hostArray.length > 0 || targetArray.length > 0) {
                //有主牌必须出主牌
                let flag1 = userPokerObj.hostArray.indexOf(willSendCard) !== -1;
                let flag2 = targetArray.indexOf(willSendCard) !== -1;
                return flag2 || flag1;
            }
            //没主了随便出
        } else {
            //花色相同可以出
            let targetArray = this.selectArrayFrom(true, roundHost, userPokerObj);
            if (targetArray.length > 0) {
                return targetArray.indexOf(willSendCard) !== -1;
            }
            //无roundHost花色可以出

        }
        //出副牌时，有副牌必须出副牌
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
    roundProgram(onUserPlayCallBack, onRoundCallBack, roundOverCallBack, winLocal, gameHost, sendArray) {
        let roundHost = null;
        console.log("onion","轮次逻辑"+winLocal+"/"+sendArray);
        if (!sendArray || sendArray.length === 0) {
            sendArray = [];//本轮出的牌
        } else {
            let pokers = sendArray[0];
            
            if(Array.isArray(pokers)&&pokers.length===1){
                pokers=pokers[0];
            }
         
            if (Array.isArray(pokers)) {
                roundHost = this.intGetType(pokers[0]);
                console.log("onion", "暂不支持出对");
                return;
            } else {
                roundHost = this.intGetType(pokers);
            }
           
        }
      
        let orgNum=sendArray.length;
        for (let i = orgNum; i <= 4 - orgNum; i++) {
            let currentPlayer = (winLocal + i) % 4;
            if (currentPlayer == 0) {
                onUserPlayCallBack(gameHost, roundHost, sendArray, currentPlayer);
                return;
            }
            let pokers = onRoundCallBack(gameHost, roundHost, sendArray, currentPlayer);
           
            if (sendArray.length == 0) {
                if (Array.isArray(pokers)) {
                    roundHost = this.intGetType(pokers[0]);
                    console.log("onion", "暂不支持出对");
                    return;
                } else {
                    roundHost = this.intGetType(pokers);
                }
            }
            sendArray.push(pokers);
            console.log("onion","轮次迭代"+winLocal+"/"+pokers+"数组"+sendArray);
        }
        console.log("onion","跳出循环"+winLocal);
        let bigger = null;
        let sumSocer = 0;
        let winnerPosition = 0;
        //判断哪方牌大
        for (let i = 0; i < sendArray.length; i++) {
            let item = sendArray[i];
            let content = this.intGetContent(item);
            sumSocer += PokerUtil.quaryIsSocer(content);
            if (bigger == null) {
                bigger = item;
                winnerPosition = i;
                continue
            }
            let result = PokerUtil.comparePoker(gameHost, roundHost, item, bigger);
            if (result == LEFT_WIN) {
                bigger = item;
                winnerPosition = i;
            }
        }
        winnerPosition += winLocal;
        winnerPosition = winnerPosition % 4;
        if (winnerPosition == 0 || winnerPosition == 2) {
            //加分
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
    sendAIHostCard(gamehost, cardArray) {
        let sendCardIndexs = [];
        for (let i = 0; i < cardArray.length; i++) {
            let type = cardArray[i].substring(2);
            let value = cardArray[i].substring(0, 2);
            let isHost = type == gamehost || PokerUtil.quaryIsHost(value);
            if (!isHost) {
                if (sendCardIndexs.length === 0) {
                    sendCardIndexs.push(i);
                } else {
                    if (cardArray[sendCardIndexs[0]] == cardArray[i]) {
                        sendCardIndexs.push(i);
                        break;
                    }
                    let sendCard = cardArray[sendCardIndexs[0]];
                    let sendValue = sendCard.substring(0, 2);
                    let result = PokerUtil.compareSinglePokerBigger(sendValue, value);
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
                    let sendCard = cardArray[sendCardIndexs[0]];
                    let sendValue = sendCard.substring(0, 2);
                    let result = PokerUtil.compareSinglePokerBigger(sendValue, value);
                    if (result = LEFT_WIN) {
                        sendCard = value;
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
    sendAIFollowCard(gameHost, roundHost, userCard, pokerObj) {
        switch (userCard.length) {
            case 0://自己是首家 理论上不存在，应该调sendAIHostCard
                console.error("onion", "error 后手电脑调用了sendAIFollowCard 应该调用 sendAIHostCard ");
                break;

            case 1://尽量出大牌
                return this.secondLogic(gameHost, roundHost, userCard, pokerObj);
            case 2://
                return this.sendThridPoker(gameHost, roundHost, userCard, pokerObj);
                case 3://
                return this.sendForthPoker(gameHost, roundHost, userCard, pokerObj);
        }

    }

    secondLogic(gameHost, roundHost, userCard, pokerObj) {
        if (userCard[0].length > 1) {
            //出对的逻辑
        } else {
            return this.selectSingleBigerPoker(gameHost, roundHost, userCard, pokerObj);

        }
    }

    /**
     * 第三手电脑
     * 判断谁出的大,尝试盖过一手
     */
    sendThridPoker(gameHost, roundHost, userCard, pokerObj) {
        let firstCard = userCard[0];
        let secondCard = userCard[1];

        let result = PokerUtil.comparePoker(gameHost, roundHost, firstCard, secondCard);
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
    sendForthPoker(gameHost, roundHost, userCard, pokerObj) {
        let firstCard = userCard[0];
        let secondCard = userCard[1];
        let thridCard = userCard[2];
        let result = PokerUtil.comparePoker(firstCard, secondCard);
        if (result === RIGHT_WIN) {
            result = PokerUtil.comparePoker(thridCard, secondCard);
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
    selectSingleBigerPoker(gameHost, roundHost, targetPoker, pokerObj) {
        //出单的逻辑 1识别是否是主牌
        let cardValue = targetPoker;
        let typeValue = this.intGetType(cardValue);
        let contentValue = this.intGetContent(cardValue);
        let isHost = typeValue == gameHost || PokerUtil.quaryIsHost(contentValue);
        if (isHost) {
            //顶大牌
            let array = this.selectArrayFrom(true, typeValue, pokerObj);
            if (array.length > 0) {
                let value = array[array.length - 1];
                let result = PokerUtil.comparePoker(value, cardValue);
                //能顶过 出大牌
                if (result === LEFT_WIN) {
                    return value;
                } else {//顶不过 出小牌
                    return array[0];
                }
            } else {
                return pokerObj.total[pokerObj.total.length - 1];
            }
        } else {
            //上家是否为A 
            let isA = contentValue == 14;
            console.log("onion", targetPoker + "type" + typeValue);
            //自己是否还有该花色
            let pokerArray = this.selectArrayFrom(false, typeValue, pokerObj);
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
    selectSocerPoker(gameHost, roundHost, targetPoker, pokerObj) {
        let cardValue = targetPoker;
        let typeValue = this.intGetType(cardValue);
        let contentValue = this.intGetContent(cardValue);
        let isHost = typeValue == gameHost || PokerUtil.quaryIsHost(contentValue);
        if (isHost) {
            let array = this.selectArrayFrom(true, typeValue, pokerObj);
            if (array.length > 0) {
                return this.selectScoerFromArray(array);
            }
            //TODO 待优化 出最小的牌 当前是总牌库的第一张牌 
            return pokerObj.total[0];
        } else {
            let array = this.selectArrayFrom(true, typeValue, pokerObj);
            if (array.length > 0) {
                //从该花色选牌
                return this.selectScoerFromArray(array);
            }
            //全局选牌
            array = pokerObj.total;
            return this.selectScoerFromArray(array);
        }
    }

    selectScoerFromArray(array) {
        for (let i = 0; i < array.length; i++) {
            let result = PokerUtil.quaryIsSocer(this.intGetContent(array[i]));
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
    selectArrayFrom(isHost, type, pokerObj) {
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

    }

    removePokerFromArray(gameHost, pokerNum, pokerObj) {
        console.log("onion","pokerNum"+pokerNum);
        let typeValue = this.intGetType(pokerNum);
        let contentValue = this.intGetContent(pokerNum);
        let isHost = typeValue == gameHost || PokerUtil.quaryIsHost(contentValue);
        console.log("onion","移除"+typeValue+"/"+contentValue+"/"+isHost);
        let array = this.selectArrayFrom(isHost, typeValue, pokerObj);
        //分组数组删除
        let index = array.indexOf(pokerNum);
        array.splice(index, 1);
        //全局数组删除
        array = pokerObj.total;
        index = array.indexOf(pokerNum);
        array.splice(index, 1);
    }

    intGetType(cardValue) {
        return Math.floor(cardValue % 10);

    }

    strGetType(cardValue) {
        return cardValue.substring(2)
    }

    intGetContent(cardValue) {
        return Math.floor(cardValue / 10);
    }

    strGetContent(cardValue) {
        return cardValue.substring(0, 2);
    }
    isRealNum(val){
        // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除，
        
    　　if(val === "" || val ==null){
            return false;
    　　}
       if(!isNaN(val)){　　　　
    　　//对于空数组和只有一个数值成员的数组或全是数字组成的字符串，isNaN返回false，例如：'123'、[]、[2]、['123'],isNaN返回false,
       //所以如果不需要val包含这些特殊情况，则这个判断改写为if(!isNaN(val) && typeof val === 'number' )
    　　　 return true; 
    　　}
    
    　else{ 
    　　　　return false; 
    　　} 
    }

}