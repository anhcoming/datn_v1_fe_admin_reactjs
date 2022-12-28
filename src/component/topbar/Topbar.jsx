import React, { useState } from 'react'
import { useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import AxiosApi from '../../api/AxiosApi'
import AuthService from '../../service/AuthService'
import WsUrl from '../../utils/constants/WsUrl'
import SockJsClient from 'react-stomp'
import ToastUtils from '../../utils/ToastUtils'
import WsToastType from '../../utils/constants/WsToastType'
import WsMessage from '../../utils/constants/WsMessage'
import { useNavigate } from 'react-router-dom'

const Topbar = () => {

    const [unreadNumber, setUnreadNumber] = useState(0)
    const [notifications, setNotifications] = useState([])
    const navigate = useNavigate()

    const name = AuthService.getNameOfCurrentUser()

    const handleLogout = () => {
        AuthService.logout()
    }

    //     <SockJsClient
    //     url={WsUrl.ADMIN_WEB_SOCKET}
    //     topics={['/topic/admin/notification']}
    //     onConnect={onConnected}
    //     onDisconnect={console.log("Disconnected!")}
    //     onMessage={onMessage}
    // />


    useEffect(() => {
        setInterval(() => {
            getNotification()
        }, 5000)
    }, [])

    const getNotification = async () => {
        console.log("getNotification() start")
        const res = await AxiosApi.getAuth(WsUrl.ADMIN_NOTIFICATION_TOP3)
        console.log("getNotification() res: ", res)
        if (res) {
            const { data } = res.data
            setUnreadNumber(data.unreadNumber)
            setNotifications(data.notifications)
        }
    }

    const readNotification = async () => {
        if (notifications && unreadNumber > 0) {
            const dto = notifications.filter(obj => !obj.isRead).map(obj => (obj.id))
            const res = await AxiosApi.postAuth(WsUrl.ADMIN_NOTIFICATION_READ, dto)
            if (res) {
                setUnreadNumber(res.data)
            }
        }
    }

    const handleReadAll = async () => {
        if (unreadNumber > 0) {
            const res = await AxiosApi.getAuth(WsUrl.ADMIN_NOTIFICATION_READ_ALL)
            if (res) {
                setUnreadNumber(res.data)
            }
        }
    }

    const onConnected = () => {
        console.log("Connected!!")
    }

    // const onMessage = payload => {
    //     console.log(`payload: ${payload}`)
    //     if (payload) {
    //         getNotification()
    //     }
    // }

    const handleReadById = async (id, type, objectId) => {
        try {
            const res = await AxiosApi.getAuth(`${WsUrl.ADMIN_NOTIFICATION_READ}?id=${id}`)
            if (res) {
                switch (type) {
                    case 'ORDER':
                        navigate(`/order/detail/${objectId}`)
                        break;
                    case 'USER':
                        navigate(`/user/detail/${objectId}`)
                        break
                    default:
                        break;
                }
            }
        } catch (e) {
            ToastUtils.createToast(WsToastType.ERROR, e.response.data.message || WsMessage.INTERNAL_SERVER_ERROR)
        }
    }

    return (
        <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
            <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
                <i className="fa fa-bars" />
            </button>

            <ul className="navbar-nav ml-auto">
                <li className="nav-item dropdown no-arrow d-sm-none">
                    <a className="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i className="fas fa-search fa-fw" />
                    </a>
                    <div className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in" aria-labelledby="searchDropdown">
                        <form className="form-inline mr-auto w-100 navbar-search">
                            <div className="input-group">
                                <input type="text" className="form-control bg-light border-0 small" placeholder="Search for..." aria-label="Search" aria-describedby="basic-addon2" />
                                <div className="input-group-append">
                                    <button className="btn btn-primary" type="button">
                                        <i className="fas fa-search fa-sm" />
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </li>
                <li className="nav-item dropdown no-arrow mx-1">
                    <a onClick={readNotification} className="nav-link dropdown-toggle" href="#" id="alertsDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i className="fas fa-bell fa-fw" />
                        {unreadNumber > 0 && <span className="badge badge-danger badge-counter">{unreadNumber}</span>}
                    </a>
                    <div className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="alertsDropdown">
                        <h6 className="dropdown-header">
                            Thông báo
                        </h6>
                        {notifications && notifications.map(obj => (
                            <button className="dropdown-item d-flex align-items-center bg-light" href="#" key={obj.id} onClick={() => handleReadById(obj?.id, obj?.objectType, obj?.objectTypeId)}>
                                <div className="mr-3">
                                    <div className={obj.div}>
                                        <i className={obj.icon} />
                                    </div>
                                </div>
                                <div>
                                    <div className="small text-gray-500">{obj.createdDate}</div>
                                    <span style={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical'
                                    }} className={obj.isRead || 'font-weight-bold'}>{obj.content}</span>
                                </div>
                            </button>
                        ))}
                        <div className='p-2 d-flex justify-content-between'>
                            <a onClick={handleReadAll} className="small text-left" href="#">Đánh dấu đã đọc tất cả</a>
                            <Link to='/notification' className="small text-right" href="#">Xem thêm...</Link>
                        </div>
                    </div>
                </li>
                <div className="topbar-divider d-none d-sm-block" />
                <li className="nav-item dropdown no-arrow">
                    <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span className="mr-2 d-none d-lg-inline text-gray-600 small">Xin chào {name}</span>
                        <img className="img-profile rounded-circle" src="/img/undraw_profile.svg" />
                    </a>
                    <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
                        {/* <a className="dropdown-item" href="#">
                            <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400" />
                            Cá nhân
                        </a>
                        <a className="dropdown-item" href="#">
                            <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400" />
                            Settings
                        </a>
                        <a className="dropdown-item" href="#">
                            <i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400" />
                            Activity Log
                        </a> */}
                        {/* <div className="dropdown-divider" /> */}
                        <NavLink to='/login' className="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal" onClick={handleLogout}>
                            <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400" />
                            Đăng xuất
                        </NavLink>
                    </div>
                </li>
            </ul>
        </nav>)
}

export default Topbar