import { useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import AxiosApi from "../../api/AxiosApi";
import WsUrl from "../../utils/constants/WsUrl";
import HashSpinner from "../../component/spinner/HashSpinner";
import WeekChart from "../../component/dashboard/WeekChart";
import ToastUtils from "../../utils/ToastUtils";
import WsToastType from "../../utils/constants/WsToastType";
import WsMessage from "../../utils/constants/WsMessage";
import CategoryChart from "../../component/dashboard/CategoryChart";
import GhnApi from "../../api/GhnApi";

const DashboardPage = () => {
    const [report, setReport] = useState()
    const [thisWeek, setThisWeek] = useState()
    const [lastWeek, setLastWeek] = useState()
    const [loading, setLoading] = useState(true)
    const [categories, setCategories] = useState()

    useEffect(() => {
        getDashboard()
        getProvinces()
    }, [])

    const getProvinces = async () => {
        console.log('getProvinces() start')
        const provinces = await GhnApi.ghn.address.getProvinces();

    }

    const getDashboard = async () => {
        console.log('getDashboard() start')
        setLoading(true)
        try {
            const axiosRes = await AxiosApi.getAuth(WsUrl.ADMIN_DASHBOARD)
            console.log('getDashboard() axiosRes: ', axiosRes)
            if (axiosRes) {
                const { data } = axiosRes
                setReport(data.report)
                setThisWeek(data.week.thisWeek)
                setLastWeek(data.week.lastWeek)
                setCategories(data.category)
            }

        } catch (e) {
            console.log("getDashboard() error: ", e)
            ToastUtils.createToast(WsToastType.ERROR, e.response.data.message || WsMessage.INTERNAL_SERVER_ERROR)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div id="content-wrapper" className="d-flex flex-column">
            {loading ? <HashSpinner /> :
                <div id="content">
                    <div className="container-fluid">
                        <div className="d-sm-flex align-items-center justify-content-between mb-4">
                            <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>
                            {/* <a href="#" className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i className="fas fa-download fa-sm text-white-50" /> Generate Report</a> */}
                        </div>
                        <div className="row">
                            <div className="col-xl col-md-6 mb-4">
                                <div className="card border-left-primary shadow h-100 py-2">
                                    <div className="card-body">
                                        <div className="row no-gutters align-items-center">
                                            <div className="col mr-2">
                                                <Link to='order/pending' className="text-xs font-weight-bold text-primary text-uppercase mb-1" >
                                                    Đơn hàng đang chờ xử lý</Link>
                                                <div className="h5 mb-0 font-weight-bold text-gray-800">{report?.pending}</div>
                                            </div>
                                            <div className="col-auto">
                                                <i className="fas fa-calendar fa-2x text-gray-300" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl col-md-6 mb-4">
                                <div className="card border-left-danger shadow h-100 py-2">
                                    <div className="card-body">
                                        <div className="row no-gutters align-items-center">
                                            <div className="col mr-2">
                                                <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">
                                                    ĐH bị hủy/từ chối hôm nay</div>
                                                <div className="h5 mb-0 font-weight-bold text-gray-800">{report?.cancel}</div>
                                            </div>
                                            <div className="col-auto">
                                                <i className="fas fa-comments fa-2x text-gray-300" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl col-md-6 mb-4">
                                <div className="card border-left-success shadow h-100 py-2">
                                    <div className="card-body">
                                        <div className="row no-gutters align-items-center">
                                            <div className="col mr-2">
                                                <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                                    Doanh thu hôm nay</div>
                                                <div className="h5 mb-0 font-weight-bold text-gray-800">{report?.today}</div>
                                            </div>
                                            <div className="col-auto">
                                                <i className="fas fa-dollar-sign fa-2x text-gray-300" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl col-md-6 mb-4">
                                <div className="card border-left-info shadow h-100 py-2">
                                    <div className="card-body">
                                        <div className="row no-gutters align-items-center">
                                            <div className="col mr-2">
                                                <div className="text-xs font-weight-bold text-info text-uppercase mb-1">Doanh thu tuần này
                                                </div>
                                                <div className="row no-gutters align-items-center">
                                                    <div className="col-auto">
                                                        <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">{report?.week}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-auto">
                                                <i className="fas fa-clipboard-list fa-2x text-gray-300" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl col-md-6 mb-4">
                                <div className="card border-left-warning shadow h-100 py-2">
                                    <div className="card-body">
                                        <div className="row no-gutters align-items-center">
                                            <div className="col mr-2">
                                                <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                                    Người dùng mới trong tuần</div>
                                                <div className="h5 mb-0 font-weight-bold text-gray-800">{report?.user}</div>
                                            </div>
                                            <div className="col-auto">
                                                <i className="fas fa-comments fa-2x text-gray-300" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xl-9 col-lg-8">
                                <div className="card shadow mb-4">
                                    <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                        <h6 className="m-0 font-weight-bold text-primary">Doanh Thu 2 Tuần Gần Đây</h6>
                                        <div className="dropdown no-arrow">
                                            <a className="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <i className="fas fa-ellipsis-v fa-sm fa-fw text-gray-400" />
                                            </a>
                                            <div className="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="dropdownMenuLink">
                                                <div className="dropdown-header">Dropdown Header:</div>
                                                <a className="dropdown-item" href="#">Action</a>
                                                <a className="dropdown-item" href="#">Another action</a>
                                                <div className="dropdown-divider" />
                                                <a className="dropdown-item" href="#">Something else here</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        {thisWeek && lastWeek ? <WeekChart thisWeek={thisWeek} lastWeek={lastWeek} /> : <></>}
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-4">
                                <div className="card shadow mb-4">
                                    <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                        <h6 className="m-0 font-weight-bold text-primary">Top danh mục có doanh thu cao</h6>
                                        <div className="dropdown no-arrow">
                                            <a className="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <i className="fas fa-ellipsis-v fa-sm fa-fw text-gray-400" />
                                            </a>
                                            <div className="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="dropdownMenuLink">
                                                <div className="dropdown-header">Dropdown Header:</div>
                                                <a className="dropdown-item" href="#">Action</a>
                                                <a className="dropdown-item" href="#">Another action</a>
                                                <div className="dropdown-divider" />
                                                <a className="dropdown-item" href="#">Something else here</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        {categories && <CategoryChart categories={categories} />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
        </div>
    )

}

export default DashboardPage