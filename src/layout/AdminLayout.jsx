import React from 'react'
import {Outlet} from 'react-router-dom'
import Sidebar from '../component/sidebar/Sidebar'
import Topbar from '../component/topbar/Topbar'
import AuthService from "../service/AuthService";
import {useNavigate} from 'react-router-dom'
import {useEffect} from 'react'
import ToastUtils from "../utils/ToastUtils";
import WsToastType from "../utils/constants/WsToastType";

const AdminLayout = () => {

    const navigate = useNavigate()

    useEffect(() => {
        const checkUser = () => {
            const obj = AuthService.isAccessAdminLayout();
            console.log("checkUser() res: ", obj)
            if (!obj.isAccess) {
                ToastUtils.createToast(WsToastType.ERROR, obj.message)
                navigate("/login");
            }
        };
        checkUser()
    });

    return (
        <div id="page-top">
            <div id="wrapper">
                <Sidebar/>
                <div id="content-wrapper" class="d-flex flex-column">
                    <div id="content">
                        <Topbar/>
                        <Outlet/>
                        {/*<Footer />*/}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default AdminLayout