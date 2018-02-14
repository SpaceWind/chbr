import Api from "./api"
import moment from "moment";

class AuthServiceImpl {

    Api = Api;


    async confirmCode(code) {
        let res = await this.Api.post('/token/client/verification', {
            body: {
                code: code
            }
        });
        if (res.err) throw res;
        return res;
    }

    async sendCode(phone) {
        let res = await this.Api.get(`/token/client/%2B${phone}`);
        if (res.err) throw res;
        //Api.jwt(res.body.token);
        res.body.phone = phone;
        console.log(res.body);
        return res.body;
    }

    async getUserData() {
        let res = await this.Api.get(`/client/current`);
        if (res.err) throw res;
        return res.body;
    }

    async updateUserData(data) {
        let res = await this.Api.put(`/client/current`, {
            body: data
        });
        if (res.err) throw res;
        return res.body;
    }

    async sendTicket(data) {
        let res = await this.Api.post(`/ticket`, {
            body: data
        });
        if (res.err) throw res;
        return res.body;
    }


    async createDevice(uid, data) {
        let res = await this.Api.post(`/device/${uid}`, {
            body: data
        });
        if (res.err) throw res;
        return res.body;
    }

    async attachDevice(uid) {
        let res = await this.Api.put(`/device/${uid}/client`, {
            body: {}
        });
        if (res.err) throw res;
        return res.body;
    }


    async getTableReserves() {
        let res = await this.Api.get(`/client/current/operations`, {
            body: {timestamp: moment().add(-3, 'years').unix()}
        });
        if (res.err) throw res;
        return res.body;
    }

    async getOperation(operationId) {
        let res = await this.Api.get(`/client/current/operations`, {
            body: {timestamp: moment().add(-3, 'years').unix()}
        });
        if (res.err) throw res;

        let operation = res.body.list.find((item) => {
            return item.result_id === operationId
        });

        if (!operation) throw res;

        return operation;


    }

    async getResultOperation(resultId) {
        let res = await this.Api.get(`/client/current/operations/result-data/${resultId}`, {
            body: {}
        });
        if (res.err) throw res;
        return res.body;
    }

    async deleteOperation(id) {
        let res = await this.Api.del(`/client/current/operations`, {
            body: {id}
        });
        if (res.err) throw res;
        return res.body;
    }


    async getOrder(orderId)
    {
        let res = await this.Api.get('/orders/' + orderId, {
            body: {}
        });
        if (res.err) throw res;
        return res.body;
    }

    async getReserve(restaurantId, reserveId) {
        let res = await this.Api.get(`/restaurant/` + restaurantId + '/reserve/' + reserveId, {
            body: {}
        });
        if (res.err) throw res;
        return res.body;
    }

    async sendPushToken(token) {
        let res = await this.Api.post(`/token/for_push`, {
            body: {
                device_token: token
            }
        });
        if (res.err) throw res;
        return res.body;
    }

    async uploadPhoto(photoUri) {
        const form = new FormData();
        form.append('photo', {uri: photoUri, name: 'image.jpg', type: 'multipart/form-data'});

        let res = await this.Api.post(`/client/current/photo`, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: form
        });
        if (res.err) throw res;
        return res.body;
    }

    async getLikes() {
        let res = await this.Api.get(`/client/current/likes/food`, {
            body: {}
        });
        if (res.err) throw res;
        return res.body;
    }

    async checkBill(code) {
        let res = await this.Api.post(`/client/current/cheque`, {
            body: {
                cipher: code
            }
        });
        if (res.err) throw res;
        return res.body;
    }

    async getDiscountCode() {
        let res = await this.Api.get(`/client/current/discount-code`, {
            body: {}
        });
        if (res.err) throw res;
        return res.body;
    }

}

export const AuthService = new AuthServiceImpl();