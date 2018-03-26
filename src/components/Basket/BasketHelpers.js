/*
 * @flow
 */
export default class BasketHelpers {
    static calcAmount(dishes, lunch, lunchDiscount, userDiscount): { amount: number, discount: boolean, discountAmount: number, total: number } {
        let fullAmount = dishes.filter(dish => lunch || !dish.lunch).map(dish => dish.price * dish.count).reduce((a, b) => a + b, 0);
        let lunchDiscountAmount = Math.floor(dishes.filter(dish => !dish.lunch).map(dish => dish.price * dish.count * (lunchDiscount / 100)).reduce((a, b) => a + b, 0));
        let userDiscountAmount = Math.floor(dishes.filter(dish => !dish.lunch).map(dish => dish.price * dish.count * (userDiscount / 100)).reduce((a, b) => a + b, 0));
        if (lunch) {
            return {
                amount: fullAmount,
                discount: lunchDiscountAmount > 0,
                discountSize: 0,
                discountAmount: Math.round(lunchDiscountAmount),
                total: Math.round(fullAmount - lunchDiscountAmount)
            }
        }
        else {
            return {
                amount: fullAmount,
                discount: userDiscount > 0,
                discountSize: userDiscount,
                discountAmount: Math.round(userDiscountAmount),
                total: Math.round(fullAmount - userDiscountAmount)
            }
        }


    }
}