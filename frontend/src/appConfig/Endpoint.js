import axios from "axios";

export const GET = (url, id, data, callback, credentials=true) => {
    axios.get(!id ? url : url +"/"+ id, {params: data || {}, withCredentials: credentials})
        .then(response => callback(response.data))
}
export const POST = (url, data, callback, credentials=true) => {
    axios.post(url, data, {withCredentials: credentials})
        .then(response => callback(response.data));
}
export const PUT = (url, id, data, callback, credentials=true) => {
    axios.put(!id ? url : url +"/"+ id, data, {withCredentials: credentials})
        .then(response => callback(response.data))
}
export const DELETE = (url, id, credentials=true) => {
    axios.delete( url +"/"+ id, {withCredentials: credentials})
}