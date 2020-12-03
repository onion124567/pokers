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
   checkUserCanSend(gameHost,roundHost,userCard,cardArray){

   }

    /**
     * 游戏每轮逻辑，
     * 赢家出牌，确定本轮主 将主放进卡片数组里 调sendAIHostCard
     * 下家出牌 调sendAICard
     * 4家都出完结算，积分计算，结束本轮，返回积分
     */
   roundProgram(){

   }

    /**
     * 先手电脑逻辑
     * 普通打法：
     * 有副出最大的副牌
     * 其次出最小主牌，不调主对
     * 最后一轮出主对
     * @param gameHost
     * @param cardArray
     */
   sendAIHostCard(gameHost,cardArray){

   }

    /**
     * 后手电脑逻辑
     *
     * @param gameHost
     * @param roundHost
     * @param userCard
     * @param cardArray
     */
   sendAIFollowCard(gameHost,roundHost,userCard,cardArray){

   }

}