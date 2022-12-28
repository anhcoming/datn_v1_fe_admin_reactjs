import axios from 'axios'
import React, { useEffect, useState } from 'react'
import AxiosApi from '../../api/AxiosApi'
import WsUrl from "../../utils/constants/WsUrl";
import { useForm } from "react-hook-form";
import ToastUtils from '../../utils/ToastUtils';
import WsToastType from '../../utils/constants/WsToastType';
import WsMessage from '../../utils/constants/WsMessage';
import { NavLink, useParams, useNavigate } from 'react-router-dom'
import HashSpinner from "../../component/spinner/HashSpinner";
import GhnApi from '../../api/GhnApi';
import WSOrderStatus from '../../utils/constants/WSOrderStatus';

let location = {
    provinceId: null,
    districtId: null,
    wardId: null
};

const initReq = {
    id: null,
    status: null,
    cusId: null,
    provinceId: null,
    districtId: null,
    wardCode: null,
    time: null,
    textSearch: null,
    pageReq: {
        page: 0,
        pageSize: 10,
        sortField: '',
        sortDirection: ''
    }
};

let initPageInfo = {
    page: null,
    pageSize: null,
    totalElements: null,
    totalPages: null,
};


const OrderPage = () => {

    const navigate = useNavigate()

    const [provinces, setProvinces] = useState([])
    const [districts, setDistricts] = useState([])
    const [wards, setWards] = useState([])
    const [req, setReq] = useState(initReq)
    const [orders, setOrders] = useState([])
    const [pageInfo, setPageInfo] = useState(initPageInfo)
    const [loading, setLoading] = useState(false)
    const { register, handleSubmit } = useForm()

    useEffect(() => {
        getProvincesFromOpenApi()
    }, [])

    useEffect(() => {
        console.log("HELLO ")
        getOrderList()
    }, [req])

    const getOrderList = async () => {
        setLoading(true)
        try {
            const axiosRes = await AxiosApi.postAuthV2(`${WsUrl.ADMIN_ORDER_SEARCH}`, req)
            if (axiosRes) {
                const { data } = axiosRes
                setOrders(data.data)
                setPageInfo({
                    ...pageInfo,
                    page: data.page,
                    pageSize: data.pageSize,
                    totalElements: data.totalElements,
                    totalPages: data.totalPages
                })
            }
        } catch (e) {
            console.log("Error: ", e)
            ToastUtils.createToast(WsToastType.ERROR, e.response.data.message || WsMessage.INTERNAL_SERVER_ERROR)
        } finally {
            setLoading(false)
        }
    }, getProvincesFromOpenApi = async () => {
        console.log('getProvincesFromOpenApi() start');
        const res = await GhnApi.getProvinces()
        console.log('getProvincesFromOpenApi() res: ', res);
        if (res) {
            setProvinces(res.data.data)
        }
    }, handleChangeProvinceFilter = e => {
        const value = e.target.value
        console.log('handleChangeProvinceFilter() value: ', value);
        location = {
            ...location,
            provinceId: value,
        }
        setReq({
            ...req,
            provinceId: value
        })
    }, handleChangeDistrictFilter = e => {
        const value = e.target.value
        console.log('handleChangeDistrictFilter() value: ', value);
        location = {
            ...location,
            districtId: value
        }
        setReq({
            ...req,
            districtId: value
        })
    }, handleChangeWardFilter = e => {
        setReq({
            ...req,
            wardCode: e.target.value
        })
    }, handleClickDistrictFilter = async () => {
        console.log('handleClickDistrictFilter() start with location: ', location);
        if (location && location.provinceId) {
            const res = await GhnApi.getDistricts(location.provinceId)
            console.log('handleClickDistrictFilter() res: ', res);
            if (res) {
                setDistricts(res.data.data)
            }
        }
    }, handleClickWardFilter = async () => {
        console.log('handleClickWardFilter() start with location: ', location);
        if (location && location.districtId) {
            const res = await GhnApi.getWards(location.districtId)
            console.log('handleClickWardFilter() res: ', res);
            if (res) {
                setWards(res.data.data)
            }
        }
    }, handleRemoveLocationFilter = () => {
        document.getElementById('provinceFilter').value = ''
        document.getElementById('districtFilter').value = ''
        document.getElementById('wardFilter').value = ''
        setReq({
            ...req,
            provinceId: null,
            districtId: null,
            wardCode: null,
        })
    }, handleChangeStatusFilter = e => {
        const value = e.target.value
        console.log('value: ', value);
        setReq({
            ...req,
            status: value || null
        })
    }, handleChangeTimeFilter = e => {
        setReq({
            ...req,
            time: e.target.value,
        })
    }, handleChangeTextSearchFilter = values => {
        const textSearch = values.textSearch.trim() == '' ? null : values.textSearch.trim()
        setReq({
            ...req,
            textSearch: textSearch
        })
    }, handleChangePageSizeFilter = e => {
        setReq({
            ...req,
            pageReq: {
                ...req.pageReq,
                pageSize: Number(e.target.value)
            }
        })
    }, handleChangePageFilter = newPage => {
        setReq({
            ...req,
            pageReq: {
                ...req.pageReq,
                page: Number(newPage)
            }
        })
    }, handleChangeStatus = async (id, status) => {
        try {
            const obj = {
                id: id,
                status: status,
                note: document.getElementById('reason').value
            }
            const axiosRes = await AxiosApi.postAuth(WsUrl.ADMIN_ORDER_CHANGE_STATUS, obj)
            getOrderList()
            console.log(axiosRes)
            ToastUtils.createToast(WsToastType.SUCCESS, WsMessage.CHANGE_ORDER_STATUS_SUCCESS)
        } catch (e) {
            ToastUtils.createToast(WsToastType.ERROR, e.response.data.message)
        }
    }, handleChangeOrderFilter = async e => {
        const input = e.target.value
        let sortField = ""
        let sortDirection = ""
        console.log("input: ", input, " - sortField: ", sortField, " - sortDirection: ", sortDirection)
        console.log("length: ", input.length)
        if (input.length > 0) {
            sortField = input.substring(0, input.indexOf('-'))
            console.log(sortField)
            sortDirection = input.substring(sortField.length + 1)
            console.log(sortDirection)
        }
        setReq({
            ...req,
            pageReq: {
                ...req.pageReq,
                sortField: sortField,
                sortDirection: sortDirection
            }
        })
    }

    return (
        <div className="container-fluid w-100 reponsive">
            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h3 className="m-0 font-weight-bold text-primary">Danh sách đơn hàng</h3>
                </div>
                <div className="card-body">
                    <div className='row d-flex align-items-center py-1'>
                        <div className='col d-flex align-items-center'>
                            <span className='' style={{ minWidth: '64px' }}>Trạng thái:</span>
                            <select className='border-1 form-control col-2 mx-2'
                                onChange={handleChangeStatusFilter}>
                                <option value="">Tất cả</option>
                                <option value={WSOrderStatus.PENDING}>Đang chờ xử lý</option>
                                <option value={WSOrderStatus.ACCEPTED}>Đã xác nhận</option>
                                <option value={WSOrderStatus.REJECTED}>Đã từ chối</option>
                                <option value={WSOrderStatus.CANCELED}>Đã hủy</option>
                                <option value={WSOrderStatus.SHIPPING}>Đang giao</option>
                                <option value={WSOrderStatus.RECEIVED}>Đã nhận hàng</option>
                            </select>
                        </div>

                        <form className="d-none d-sm-inline-block form-inline navbar-search col-4"
                            onSubmit={handleSubmit(handleChangeTextSearchFilter)}>
                            <div className="input-group">
                                <input type="text" className="form-control bg-light border-0 small"
                                    placeholder="Tìm kiếm..." aria-label="Search" aria-describedby="basic-addon2"
                                    defaultValue=""
                                    {...register("textSearch")} />
                                <div className="input-group-append">
                                    <button className="btn btn-primary" type="submit">
                                        <i className="fas fa-search fa-sm" />
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className='row d-flex align-items-center px-3 py-1'>
                        <span className='' style={{ minWidth: '64px' }}>Địa chỉ:</span>
                        <div className='col d-flex align-items-center'>
                            <select id='provinceFilter' className='border-1 form-control mx-1 col-2'
                                onChange={handleChangeProvinceFilter}>
                                <option value="" disabled selected text-muted>---Tỉnh/T.Phố---</option>
                                {provinces && provinces.map(p => (
                                    <option key={p?.ProvinceID} value={p?.ProvinceID}>{p?.ProvinceName}</option>
                                ))}
                            </select>
                            <select id='districtFilter' className='border-1 form-control mx-1 col-2'
                                onChange={handleChangeDistrictFilter} onClick={handleClickDistrictFilter}>
                                <option value="" disabled selected text-muted>---Quận/Huyện---</option>
                                {districts && districts.map(d => (
                                    <option key={d?.DistrictID} value={d?.DistrictID}>{d?.DistrictName}</option>
                                ))}
                            </select>
                            <select id='wardFilter' className='border-1 form-control mx-1 col-2'
                                onClick={handleClickWardFilter} onChange={handleChangeWardFilter}>
                                <option value="" disabled selected>---Phường/Xã---</option>
                                {wards && wards.map(w => (
                                    <option key={w?.WardCode} value={w?.WardCode}>{w?.WardName}</option>
                                ))}
                            </select>
                            <button className='btn btn-outline-danger' onClick={handleRemoveLocationFilter}>Xóa
                            </button>
                        </div>
                        <div className='row d-flex align-items-center'>
                            {/* <select className='form-control col mx-1' onChange={handleChangeTimeFilter}>
                                <option value="" disabled selected>---Thời gian đặt---</option>
                                <option value="">Mặc định</option>
                                <option value="day">Hôm nay</option>
                                <option value="week">Tuần này</option>
                                <option value="month">Tháng này</option>
                            </select> */}
                            <select className='form-control col mx-1' onChange={handleChangeOrderFilter}>
                                <option value="" disabled selected>---Sắp xếp---</option>
                                <option value="">Mặc định</option>
                                {/* <option value="user.lastName-asc">Tên Khách hàng(a-z)</option>
                                <option value="user.lastName-desc">Tên Khách hàng(z-a)</option> */}
                                <option value="total-asc">Tổng tiền(Thấp-cao)</option>
                                <option value="total-desc">Tổng tiền(Cao-thấp)</option>
                                <option value="createdDate-asc">Thời gian đặt(Cũ-mới)</option>
                                <option value="createdDate-desc">Thời gian đặt(Mới-cũ)</option>
                            </select>
                        </div>
                    </div>

                    <hr className='pb-2' />
                    <h6>Tìm thấy <b>{pageInfo.totalElements}</b> dữ liệu phù hợp.</h6>
                    <div className='table-responsive'>
                        <table className="table table-bordered mt-4" id="dataTable" width="100%" cellSpacing={0}>
                            <thead>
                                <tr className='text-bold text-dark'>
                                    <th className='text-center' style={{ maxWidth: '40px' }}>#</th>
                                    <th>Code</th>
                                    <th>Khách hàng</th>
                                    <th>SDT</th>
                                    <th>Thời gian đặt</th>
                                    <th>Địa chỉ giao</th>
                                    <th>Tổng tiền</th>
                                    {/* <th>Phương thức</th> */}
                                    <th>Ghi chú</th>
                                    <th>Trạng thái</th>
                                    <th>More</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? <HashSpinner /> :
                                    orders && orders.map((order, index) => (
                                        <tr key={order.id}>
                                            <td className='text-center' style={{ maxWidth: '40px' }}>{index + 1}</td>
                                            <td>{order.code}</td>
                                            <td className='col-1'>{order.customerName}</td>
                                            <td className="col-1">{order.phone}</td>
                                            <td>{order.createdDateFmt}</td>
                                            <td className="col-2">{order.addressCombination}</td>
                                            <td className='col-1'>{order.totalFmt}</td>
                                            {/* <td>{order.paymentName}</td> */}
                                            <td>{order.note}</td>
                                            <td className="col-2">{order.statusCombination}</td>
                                            <td>
                                                <div className="btn-group dropleft">
                                                    <a className="btn text-dark" type="button" id="dropdownMenuButton"
                                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                        <i className="fa fa-ellipsis-h" aria-hidden="true" />
                                                    </a>
                                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                        <NavLink to={`detail/${order.id}`} className="dropdown-item">Chi tiết</NavLink>
                                                        <a className="dropdown-item" href="#" data-toggle="modal"
                                                            data-target={`#statusModal${order.id}`}>Chỉnh sửa trạng thái</a>
                                                    </div>
                                                </div>
                                                <div className="modal fade" id={`statusModal${order.id}`} tabIndex={-1}
                                                    role="dialog"
                                                    aria-labelledby="statusModalLabel" aria-hidden="true">
                                                    <div className="modal-dialog modal-lg" role="document">
                                                        <div className="modal-content">
                                                            <div className="modal-header">
                                                                <h5 className="modal-title" id="exampleModalLabel">Chỉnh sửa
                                                                    trạng
                                                                    thái</h5>
                                                                <button type="button" className="close" data-dismiss="modal"
                                                                    aria-label="Close">
                                                                    <span aria-hidden="true">×</span>
                                                                </button>
                                                            </div>
                                                            {order.options &&
                                                                <div className="modal-body p-4">
                                                                    <div className="form-group mt-2">
                                                                        <h6 className='text-dark'><b>1. Lý do chỉnh
                                                                            sửa</b> (không bắt buộc)</h6>
                                                                        <textarea id='reason' className='form-control'
                                                                            rows={4}></textarea>
                                                                    </div>
                                                                    <h6 className='text-dark'><b>2. Chọn trạng thái mới cho đơn
                                                                        hàng</b></h6>
                                                                    <div className='row d-flex justify-content-left p-2'>
                                                                        {order.options.map((obj, index1) => (
                                                                            <button key={index1}
                                                                                className={`btn mr-2 btn-${obj.clazz}`}
                                                                                onClick={() => handleChangeStatus(order.id, obj.status)}
                                                                                data-dismiss="modal"
                                                                            >{obj.name}</button>
                                                                        ))}
                                                                    </div>
                                                                </div>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>))}
                            </tbody>
                        </table>
                    </div>

                    {pageInfo.totalElements > 0
                        &&
                        <div className='p-2 row align-items-center justify-content-between'>
                            <div className='col d-flex align-items-center'>
                                Hiển thị: <select className='border-1 form-control col-1 mx-2'
                                    onChange={handleChangePageSizeFilter}>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                            </div>
                            <div className=''>
                                <button className='btn btn-outline-dark btn-sm mx-1 px-2'
                                    onClick={() => handleChangePageFilter(pageInfo.page - 1)}
                                    disabled={pageInfo.page === 0}>Trước
                                </button>
                                <button className='btn btn-outline-dark btn-sm mx-1 px-2'
                                    onClick={() => handleChangePageFilter(pageInfo.page + 1)}
                                    disabled={pageInfo.page === pageInfo.totalPages - 1}>Sau
                                </button>
                                <span>Trang {pageInfo.page + 1}/{pageInfo.totalPages}</span>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default OrderPage