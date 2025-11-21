import axios from "axios";

export const GET = (url, id, data, callback) => {
    axios.get(!id ? url : url + id, {params: data || {}})
        .then(response => callback(response.data))
}
export const POST = (url, data, callback) => {
    axios.post(url, data)
        .then(response => callback(response.data));
}
export const PUT = (url, id, data, callback) => {
    axios.put(!id ? url : url + id, data,)
        .then(response => callback(response.data))
}
export const DELETE = (url, id) => {
    axios.delete(!id ? url : url + id)
}