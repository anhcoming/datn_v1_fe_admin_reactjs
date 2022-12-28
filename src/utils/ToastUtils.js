import {toast} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import WsToastType from "./constants/WsToastType";



// toast.configure()
const createToast = (type, mess, time) => {

    const options = {
        autoClose: time || 500,
        theme: 'colored',
    }

    switch (type) {
        case WsToastType.SUCCESS: {
            toast.success(mess, options)
            break
        }
        case WsToastType.ERROR: {
            toast.error(mess, options)
            break
        }
        case WsToastType.INFO: {
            toast.info(mess, options)
            break
        }
        case WsToastType.WARNING: {
            toast.warning(mess, options)
            break
        }
        default:
            break
    }

}

export default {
    createToast
}