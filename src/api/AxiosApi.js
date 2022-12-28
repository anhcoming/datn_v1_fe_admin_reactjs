import axios from "axios";
import WsField from "../utils/constants/WsField";
import WsUrl from "../utils/constants/WsUrl";
import WsValue from "../utils/constants/WsValue";

const axiosIns = axios.create({
    baseURL: WsUrl.BASEV1
})

const axiosInsV2 = axios.create({
    baseURL: WsUrl.BASEV2
})

const getConfig = () => {
    const accessToken = localStorage.getItem(WsField.ACCESS_TOKEN_ADMIN)
    if (accessToken) {
        const author = `${WsValue.BEARER}` + accessToken.trim()
        return {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `${author}`
            }
        }
    }
}

const getConfigFormData = () => {
    const accessToken = localStorage.getItem(WsField.ACCESS_TOKEN_ADMIN)
    if (accessToken) {
        const author = `${WsValue.BEARER}` + accessToken.trim()
        return {
            headers: {
                'Content-Type': 'multipart/form-data',
                "Authorization": `${author}`
            }
        }
    }
}


const getConfigExport = () => {
    const accessToken = localStorage.getItem(WsField.ACCESS_TOKEN_ADMIN)
    if (accessToken) {
        const author = `${WsValue.BEARER}` + accessToken.trim()
        return {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `${author}`
            },
            responseType: 'blob'
        }
    }
}

/** Auth */
const getAuth = url => {
    return axiosIns.get(url, getConfig())
}

const postAuth = (url, body) => {
    return axiosIns.post(`${url}`, body, getConfig())
}

const postAuthV2 = (url, body) => {
    return axiosInsV2.post(`${url}`, body, getConfig())
}

const postAuthExport = (url, body) => {
    return axiosIns.post(`${url}`, body, getConfigExport())
}

const deleteAuth = url => {
    return axiosIns.delete(url, getConfig())
}


/** No Auth */

const get = url => (
    axiosIns.get(`${WsValue.NO_AUTH}/${url}`)
)

const post = (url, body) => (
    axiosIns.post(`${WsValue.NO_AUTH}/${url}`, body)
)

const postAuthFormData = (url, payload) => (
    axiosIns.post(url, payload, getConfigFormData())
)


export default {
    getAuth,
    postAuth,
    postAuthExport,
    postAuthV2,
    deleteAuth,
    get,
    post,
    postAuthFormData
}
