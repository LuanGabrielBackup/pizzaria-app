import axios from "axios";

const api = axios.create({
    //baseURL: 'http://localhost:3333'
    baseURL: 'http://192.168.1.64:3333'
})

export { api };