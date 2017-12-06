import {API_URl} from "../../Constants";
import Frisbee from 'frisbee';

const Api = new Frisbee({
    baseURI: API_URl,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

Api.interceptor.register({
    response: function (response) {
        if(response.status === 401 || response.status === 403)
        {

        }
        return response;
    }
})


export default Api;