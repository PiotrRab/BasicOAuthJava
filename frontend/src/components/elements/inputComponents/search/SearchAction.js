import axios from "axios";


export const search = (index, query, callback) => {

    const config = {
        url: `/${index}/?query=${encodeURIComponent(query)}`,
        data: {query},
    };
    axios.request(config).then(response => {
        callback(response.data);
    })
};