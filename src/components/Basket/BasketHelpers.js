/*
 * @flow
 */
export default class BasketHelpers {
    static calcAmount(dishes, lunch, lunchDiscount, userDiscount): { amount: number, discount: boolean, discountAmount: number, total: number } {

        let fullAmount = dishes.filter(dish => lunch || !dish.lunch).map(dish => dish.price * dish.count).reduce((a, b) => a + b, 0);
        let discountAmount = Math.floor(dishes.filter(dish => !dish.lunch).map(dish => dish.price * dish.count * (lunchDiscount / 100)).reduce((a, b) => a + b, 0));
        if (lunch) {
            return {
                amount: fullAmount,
                discount: discountAmount > 0,
                discountSize: 0,
                discountAmount: discountAmount,
                total: fullAmount - discountAmount
            }
        }
        else {

            return {
                amount: fullAmount,
                discount: userDiscount > 0,
                discountSize: userDiscount,
                discountAmount: discountAmount,
                total: fullAmount - discountAmount
            }
        }


    }
}