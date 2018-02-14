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
                   dishId, like, deviceId) {
        let url = `/restaurant/${restaurantId}/menu/categories/${categoryId}/food/${dishId}/like`;
        let res = null;
        let body = {};
        if (deviceId) {
            body.device_id = deviceId;
        }
        if (like) {
            res = await this.Api.put(url, {
                body: body
            });
        }
        else {

            res = await this.Api.del(url, {
                body: body
            });
        }
        if (res.err) throw res;
        await new Promise(resolve =>
            setTimeout(resolve, 400)
        );
        res.body.dishId = dishId;
        res.body.restaurantId = restaurantId;
        res.body.categoryId = categoryId;
        res.body.like = like;
        return res.body;
    }

    async getDish(restaurantId,
                  categoryId,
                  dishId,
                  deviceId) {
        let body = {};
        if (deviceId) {
            body.device_id = deviceId;
        }
        let res = await this.Api.get(`/restaurant/${restaurantId}/menu/categories/${categoryId}/food/${dishId}`, {
            body: body
        });
        console.log(res.body)
        if (res.err) throw res;
        return res.body;
    }


    async buy(restaurantId,
              data: any) {

        let res = await this.Api.post(`/restaurant/` + restaurantId + '/buy', {
            body: {
                data: JSON.stringify(data)
            }
        });
        if (res.err) throw res;

        return res.body;
    }


}

export const RestaurantService = new RestaurantServiceImpl();