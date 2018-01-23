import Api from "./api"
import moment from "moment";

class NewsServiceImpl {

    Api = Api;


    async getNews(restaurantId) {
        let res = null;

        if (restaurantId) {
            res = await this.Api.get('/news/combined', {
                body: {
                    restaurant_id:restaurantId
                }
            });
        }
        else {
            res = await this.Api.get('/news/combined');
        }


        if (res.err) throw res;

        return res.body;


        /*function delay(ms) {
            return new Promise((resolve, reject) => {
                setTimeout(resolve, ms);
            });
        }

        return delay(1000).then(() => {
            return {
                news: [
                    {

                        id: 1,
                        name: 'Открытие летней веранда рестобара',
                        description: 'Описание',
                        date: moment(),
                        restaurant: 'Рестобар Chester'
                    },
                    {
                        id: 2,
                        name: 'Открытие летней веранда рестобара',
                        description: 'Описание 2',
                        date: moment().add(-1, 'days'),
                        restaurant: 'Рестобар Chester'
                    },
                    {
                        id: 3,
                        name: 'Открытие летней веранда рестобара',
                        description: 'Описание 3',
                        date: moment().add(-2, 'days'),
                        restaurant: 'Рестобар Chester'
                    }
                ]
            }
        });*/
    }


    async getNew(restaurantId) {
        let res = null;

        if (restaurantId) {
            res = await this.Api.get('/news/combined', {
                body: {
                    restaurantId
                }
            });
        }
        else {
            res = await this.Api.get('/news/combined');
        }

        if (res.err) throw res;

        return res.body;

    }

    async getOneNews(id) {
        let res = await this.Api.get(`/news/${id}`, {});


        let photos = await this.Api.get(`/news/${id}/photo`, {});

        let restaurants = await this.Api.get(`/news/${id}/restaurants`, {});

        if (res.err || photos.err || restaurants.err) throw res;


        res.body.photos = photos.body;
        res.body.restaurants = restaurants.body;
        return res.body;
    }


}

export const NewsService = new NewsServiceImpl();