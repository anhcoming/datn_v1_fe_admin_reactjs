import WsUrl from "../utils/constants/WsUrl"
import axios from "axios";

const token_GHN = '1356329a-0133-11ed-8636-7617f3863de9';

const axiosIns = axios.create({
    baseURL: WsUrl.GHN_BASE
})


const config = {
    headers: {
        'token': token_GHN
    }
}

const getProvinces = () => {
    return axiosIns.get("/province", config)
}

const getDistricts = provinceId => {
    return axiosIns.get(`/district?province_id=${provinceId}`, config)
}

const getWards = districtId => {
    return axiosIns.get(`/ward?district_id=${districtId}`, config) 
}

export default {
    getProvinces,
    getDistricts,
    getWards
}

