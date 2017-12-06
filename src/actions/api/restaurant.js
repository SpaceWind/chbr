/*@flow*/
import Api from "./api"

class RestaurantServiceImpl {

    Api = Api;


    async getData(_hash) {

        let res = await this.Api.get(`/restaurant/combined`, {
            body: {
                _hash
            }
        });
        if (res.err) throw res;

        return res.body;
    }


    async getTime(restaurantId, data: { people_quantity: string, timestamp: string }) {
        let res = await this.Api.get(`/restaurant/` + restaurantId + '/reserve/check', {
            body: data
        });
        if (res.err) throw res;

        return res.body;
    }


    async reserve(restaurantId,
                  data: {
                      people_quantity: string,
                      timestamp: string,
                      comment: string
                  }) {

        let res = await this.Api.put(`/restaurant/` + restaurantId + '/reserve', {
            body: data
        });
        if (res.err) throw res;

        return res.body;
    }

    async cancelReserve(restaurantId, reserveId) {

        let res = await this.Api.del(`/restaurant/` + restaurantId + '/reserve/' + reserveId, {
            body: {}
        });
        if (res.err) throw res;

        return res.body;
    }


    async buyByBonus(restaurantId,
                     dishId) {

        let res = await this.Api.put(`/restaurant/` + restaurantId + '/buy/by-bonus/' + dishId, {
            body: {}
        });
        if (res.err) throw res;

        return res.body;
    }

    async likeDish(restaurantId, categoryId,
                   dishId, like) {


        let url = `/restaurant/${restaurantId}/menu/categories/${categoryId}/food/${dishId}/like`;
        let res = null;
        if (like) {
            res = await this.Api.put(url, {
                body: {}
            });
        }
        else {

            res = await this.Api.del(url, {
                body: {}
            });
        }

        if (res.err) throw res;

        res.body.dishId = dishId;
        res.body.restaurantId = restaurantId;
        res.body.categoryId = categoryId;
        res.body.like = like;
        return res.body;
    }

    async getDish(restaurantId,
                  categoryId,
                  dishId) {
        let res = await this.Api.get(`/restaurant/${restaurantId}/menu/categories/${categoryId}/food/${dishId}`, {
            body: {}
        });
        if (res.err) throw res;
        return res.body;
    }
}

export const RestaurantService = new RestaurantServiceImpl();