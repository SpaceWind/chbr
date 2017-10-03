export const ADD_DISH = 'ADD_DISH';
export const REMOVE_DISH = 'REMOVE_DISH';
export const CLEAR_BASKET = 'CLEAR_BASKET';
export const INIT_BASKET = 'INIT_BASKET';

export function addDish(dish) {
    return {
        type: ADD_DISH,
        payload: dish
    }
}

export function removeDish(dish) {
    return {
        type: REMOVE_DISH,
        payload: dish

    }
}

export function clearBasket() {
    return {
        type: CLEAR_BASKET
    }
}

export function initBasket(restaurantId) {
    return {
        type: INIT_BASKET,
        payload: {
            restaurantId
        }
    }
}




