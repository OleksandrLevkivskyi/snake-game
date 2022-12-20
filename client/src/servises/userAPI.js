import axios from "axios";

export const fetchUsers = async () => {
    const {data} = await axios.create({
        baseURL: process.env.REACT_APP_API_URL
    }).get('api/')
    return data
}

export const createUser = async (name, points) => {
    const {data} = await axios.create({
        baseURL: process.env.REACT_APP_API_URL
    }).post('api/', {
        name, points
    })
    return data
}