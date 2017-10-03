import {API_URl} from "../../Constants";
import Frisbee from 'frisbee';

const Api = new Frisbee({
    baseURI: API_URl,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});
export default Api;