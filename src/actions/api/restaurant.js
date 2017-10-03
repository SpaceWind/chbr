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
        if (res.err) throw res.err;

        return res.body;
    }


    async getTime(restaurantId, data: { people_quantity: string, timestamp: string }) {
        let res = await this.Api.get(`/restaurant/` + restaurantId + '/reserve/check', {
            body: data
        });
        if (res.err) throw res.err;

        return res.body;
    }


    async reserve(restaurantId,
                  data: {
                      people_quantity: string,
                      timestamp: string,
                      comment: string
                  }) {

        let res = await this.Api.put(`/restaurant/` + restaurantId + '/reserve', {
            body:data
        });
        if (res.err) throw res.err;

        return res.body;
    }


}

export const RestaurantService = new RestaurantServiceImpl();