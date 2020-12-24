import PokerUtil from "./PokerUtil";

let pokerWeight = [4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 3, 5, 16, 17, 18];//主5为18
let LEFT_WIN = -1;
let RIGHT_WIN = 1;
export default class AIUtil {
    /**
     * 检测哪些牌可以出
     * @param gameHost
     * @param roundHost
     * @param userCard
     * @param cardArray
     */
    checkUserCanSend(gameHost, roundHost, userCard, cardArray) {

    }

    /**
     * 游戏每轮逻辑，
     * 赢家出牌，确定本轮主 将主放进卡片数组里 调sendAIHostCard
     * 下家出牌 调sendAIFollowCard
     * 4家都出完结算，积分计算，结束本轮，返回积分
     */
    roundProgram() {

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
        let sendCardIndexs=[];
        for (let i = 0; i < cardArray.length; i++) {
            let type = cardArray[i].substring(2);
            let value = cardArray[i].substring(0, 2);
            let isHost = type == gamehost || PokerUtil.quaryIsHost(value);
            if(!isHost){
                if(sendCardIndexs.length===0){
                    sendCardIndexs.push(i);
                }else {
                    if(cardArray[sendCardIndexs[0]]==cardArray[i]){
                        sendCardIndexs.push(i);
                        break;
                    }
                    let sendCard=cardArray[sendCardIndexs[0]];
                    let sendValue=sendCard.substring(0, 2);
                    let result=PokerUtil.compareSinglePokerBigger(sendValue,value);
                    if(result=RIGHT_WIN){
                        sendCard=value;
                    }
                }
            }else {
                if(sendCardIndexs.length===0){
                    //没有副牌了
                    sendCardIndexs.push(i);
                }else {
                    if(cardArray[sendCardIndexs[0]]==cardArray[i]){
                        sendCardIndexs.push(i);
                        break;
                    }
                    let sendCard=cardArray[sendCardIndexs[0]];
                    let sendValue=sendCard.substring(0, 2);
                    let result=PokerUtil.compareSinglePokerBigger(sendValue,value);
                    if(result=LEFT_WIN){
                        sendCard=value;
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
    sendAIFollowCard(gameHost, roundHost, userCard, cardArray) {
        if(gameHost===roundHost){

        }

    }



}