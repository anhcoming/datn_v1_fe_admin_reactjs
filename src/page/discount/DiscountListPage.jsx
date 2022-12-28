import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useEffect } from 'react';
import AxiosApi from '../../api/AxiosApi';
import WsUrl from '../../utils/constants/WsUrl';
import HashSpinner from '../../component/spinner/HashSpinner';
import WsToastType from '../../utils/constants/WsToastType';
import WsMessage from '../../utils/constants/WsMessage';
import ToastUtils from '../../utils/ToastUtils';

const initReq = {
    status: null,
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

const DiscountListPage = () => {
    const { register, handleSubmit } = useForm()
    const navigate = useNavigate()
    const [req, setReq] = useState(initReq)
    const [pageInfo, setPageInfo] = useState(initPageInfo)
    const [loading, setLoading] = useState(true)
    const [discounts, setDiscounts] = useState([])

    useEffect(() => {
        getDiscounts()
    }, [req])

    const getDiscounts = async () => {
        try {
            setLoading(true)
            const res = await AxiosApi.postAuth(WsUrl.ADMIN_DISCOUNT_SEARCH, req)
            console.log("res", res);
            if (res) {
                const { data } = res
                console.log("data: ", data);
                setDiscounts(data.data)
                setPageInfo({
                    ...pageInfo,
                    page: data.page,
                    pageSize: data.pageSize,
                    totalElements: data.totalElements,
                    totalPages: data.totalPages
                })
                setLoading(false)
            }
        } catch (e) {
            console.log("Error: ", e)
            ToastUtils.createToast(WsToastType.ERROR, e.response.data.message || WsMessage.INTERNAL_SERVER_ERROR)
        }
    }


    const handleChangeTextSearchFilter = values => {
        if (values.textSearch || values.textSearch.trim.length === 0) {
            setReq({
                ...req,
                textSearch: values.textSearch
            })
        }
    }

    const handleChangeStatusFilter = e => {
        const value = e.target.value
        console.log("status value: ", value)
        setReq({
            ...req,
            status: value || null
        })
    }

    const handleChangePageSizeFilter = e => {
        setReq({
            ...req,
            pageReq: {
                ...req.pageReq,
                pageSize: Number(e.target.value)
            }
        })
    }

    const handleChangePageFilter = newPage => {
        setReq({
            ...req,
            pageReq: {
                ...req.pageReq,
                page: Number(newPage)
            }
        })
    }

    const handleDelete = async (id, canEdit) => {
        console.log("handleDelete() start with payload: ", id);
        if (!canEdit) {
            ToastUtils.createToast(WsToastType.ERROR, WsMessage.DISCOUNT_HAS_USED_CAN_NOT_DELETE, 2000)
            return false
        }
        setLoading(true)
        try {
            const res = await AxiosApi.postAuth(`${WsUrl.ADMIN_DISCOUNT_DELETE}?id=${id}`)
            if (res) {
                ToastUtils.createToast(WsToastType.SUCCESS, WsMessage.DELETE_SUCCESS)
                getDiscounts()
            }
        } catch (e) {
            ToastUtils.createToast(WsToastType.ERROR, e.response.data.message || WsMessage.INTERNAL_SERVER_ERROR, 2000)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container-fluid w-100 reponsive">
            <div className="card shadow mb-4">
                <div className="card-header py-3 d-flex justify-content-between">
                    <h3 className="m-0 font-weight-bold text-primary">Danh sách khuyến mãi</h3>
                    <NavLink to={'/discount/create'} className='btn btn-primary'>Thêm mới</NavLink>
                </div>
                <div className="card-body">
                    <div className='row d-flex align-items-center py-1'>
                        <div className='col d-flex align-items-center'>
                            <span className='' style={{ minWidth: '64px' }}>Trạng thái:</span>
                            <select className='border-1 form-control col-2 mx-2'
                                onChange={handleChangeStatusFilter}>
                                <option value=''>Tất cả</option>
                                <option value="ACTIVE">Đang áp dụng</option>
                                <option value="PENDING">Chưa áp dụng</option>
                                <option value="DE_ACTIVE">Ngừng áp dụng</option>
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

                    <hr className='pb-2' />
                    <h6>Tìm thấy <b>{pageInfo.totalElements}</b> dữ liệu phù hợp.</h6>
                    <div className='table-responsive'>
                        <table className="table table-bordered mt-4" id="dataTable" width="100%" cellSpacing={0}>
                            <thead>
                                <tr className='text-bold text-dark'>
                                    <th className='text-center' style={{ maxWidth: '40px' }}>#</th>
                                    <th className=''>Mã</th>
                                    <th className=''>Chi tiết</th>
                                    <th className=''>Trạng thái</th>
                                    <th className=''>Đã dùng</th>
                                    <th className=''>Bắt đầu</th>
                                    <th className=''>Kết thúc</th>
                                    <th className=''>More</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    loading ? <HashSpinner /> : discounts && discounts.map((obj, index) => (
                                        <tr key={obj.id}>
                                            <td className='text-center' style={{ maxWidth: '40px' }}>{index + 1}</td>
                                            <td className=''>{obj.code}</td>
                                            <td><ul>
                                                {obj.des.map((item, index) => (
                                                    <li key={index}>{item}</li>
                                                ))}
                                            </ul></td>
                                            <td className={obj.statusClazz}>{obj.statusName}</td>
                                            <td>{obj.usageNumber} {obj.usageLimit && `/${obj.usageLimit}`}</td>
                                            <td>{obj?.startDateFmt}</td>
                                            <td>{obj?.endDateFmt}</td>
                                            <td>
                                                <div className="btn-group dropleft">
                                                    <a className="btn text-dark" type="button" id="dropdownMenuButton"
                                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                        <i className="fa fa-ellipsis-h" aria-hidden="true" />
                                                    </a>
                                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                        {/* <NavLink to={`detail/${obj.id}`} className="dropdown-item">Chỉnh sửa</NavLink> */}
                                                        <a className="dropdown-item" href="#" data-toggle="modal"
                                                            data-target={`#deleteDiscountModal${obj.id}`}>Xóa</a>
                                                    </div>
                                                </div>
                                                <div className="modal fade" id={`deleteDiscountModal${obj.id}`} tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                    <div className="modal-dialog" role="document">
                                                        <div className="modal-content">
                                                            <div className="modal-header">
                                                                <h5 className="modal-title" id="exampleModalLabel">Xóa mã khuyến mãi</h5>
                                                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                                    <span aria-hidden="true">×</span>
                                                                </button>
                                                            </div>
                                                            <div className="modal-body">
                                                                Bạn có chắc muốn xóa mã <b className=''>{obj.code}</b> không? <br />
                                                            </div>
                                                            <div className="modal-footer">
                                                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Hủy</button>
                                                                <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={() => handleDelete(obj.id, obj.canEdit)}>Xóa</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        {/* <div>
                            <b className='mt-2'>Note<span className='text-danger'>*</span>: Những mã khuyễn mãi đã được sử dụng sẽ không được chỉnh sửa</b>
                        </div>
                         */}
                    </div>

                    {pageInfo.totalElements > 0 && <div className='py-2 row align-items-center justify-content-between'>
                        <div className='col d-flex align-items-center'>
                            Hiển thị: <select className='border-1 form-control col-1 mx-2'
                                onChange={handleChangePageSizeFilter}>
                                <option value={1} defaultChecked>10</option>
                                <option value={2}>20</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                        </div>
                        <div className=''>
                            <button className='btn btn-outline-dark btn-sm mx-1 px-2'
                                onClick={() => handleChangePageFilter(pageInfo.page - 1)}
                                disabled={pageInfo.page == 0}>Trước
                            </button>
                            <button className='btn btn-outline-dark btn-sm mx-1 px-2'
                                onClick={() => handleChangePageFilter(pageInfo.page + 1)}
                                disabled={pageInfo.page == pageInfo.totalPages - 1}>Sau
                            </button>
                            <span>Trang {pageInfo.page + 1}/{pageInfo.totalPages}</span>
                        </div>
                    </div>}
                </div>
            </div>
        </div>)
}

export default DiscountListPage