import axios from "axios";

export const loadAttributes = (callback) => {
    const config = {
        url:'/attributes',
    };
    axios.request(config).then(response => callback(response.data));
}