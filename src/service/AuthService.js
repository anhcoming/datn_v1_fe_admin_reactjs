import WsValue from "../utils/constants/WsValue"
import jwtDecode from "jwt-decode";
import WsField from "../utils/constants/WsField";
import WsMessage from "../utils/constants/WsMessage";

const login = (accessToken, refreshToken) => {
    if (isValidRole(accessToken)) {
        if (localStorage.getItem(WsField.ACCESS_TOKEN_ADMIN) && localStorage.getItem(WsField.REFRESH_TOKEN_ADMIN)) {
            removeTokenValues()
        }
        setTokenValues(accessToken, refreshToken)
        return true
    }
    return false
}

const logout = () => {
    removeTokenValues()
}

const removeTokenValues = () => {
    localStorage.removeItem(WsField.ACCESS_TOKEN_ADMIN)
    localStorage.removeItem(WsField.REFRESH_TOKEN_ADMIN)
}

const setTokenValues = (accessToken, refreshToken) => {
    localStorage.setItem(WsField.ACCESS_TOKEN_ADMIN, accessToken)
    localStorage.setItem(WsField.REFRESH_TOKEN_ADMIN, refreshToken)
}


const isValidRole = accessToken => {
    const user = jwtDecode(accessToken)
    console.log("isValidRole() user: ", user)
    if (!user || user.exp * 1000 > new Date().getTime) {
        return {
            isAccess: false,
            message: WsMessage.SESSION_EXPIRED_DATE
        }
    }
    if (user.role == WsValue.ROLE_ADMIN || user.role == WsValue.ROLE_STAFF) {
        return {
            isAccess: true,
        }
    }
}

const isAccess = () => {
    const accessToken = localStorage.getItem(WsField.ACCESS_TOKEN_ADMIN)
    console.log("isAccess() accessToken: ", accessToken);
    if (accessToken) {
        return isValidRole(accessToken)
    }
    return {
        isAccess: false,
        // message: WsMessage.INTERNAL_SERVER_ERROR
    }}

const getNameOfCurrentUser = () => {
    if (localStorage.getItem(WsField.ACCESS_TOKEN_ADMIN)) {
        const user = jwtDecode(localStorage.getItem(WsField.ACCESS_TOKEN_ADMIN))
        return user.name
    }
}

const isValidExpired = expTime => {
    return new Date() <= new Date(expTime)
}

export default {
    login,
    logout,
    isAdmin: isValidRole,
    isAccessAdminLayout: isAccess,
    getNameOfCurrentUser
}