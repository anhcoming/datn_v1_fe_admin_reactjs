import React, { useState } from 'react'
import { useEffect } from 'react';
import { useForm } from 'react-hook-form'
import { Link, NavLink } from 'react-router-dom';
import AxiosApi from '../../api/AxiosApi';
import HashSpinner from '../../component/spinner/HashSpinner';
import FileService from '../../service/FileService';
import WsMessage from '../../utils/constants/WsMessage';
import WsToastType from '../../utils/constants/WsToastType';
import WsUrl from '../../utils/constants/WsUrl';
import ToastUtils from '../../utils/ToastUtils';

const initReq = {
    textSearch: null,
    categoryId: null,
    pageReq: {
        page: 0,
        pageSize: 10,
        sortField: 'name',
        sortDirection: 'asc'
    }
};

let initPageInfo = {
    page: null,
    pageSize: null,
    totalElements: null,
    totalPages: null,
};


const ProductRevenuePage = () => {
    const { register, handleSubmit } = useForm()
    const [req, setReq] = useState(initReq)
    const [pageInfo, setPageInfo] = useState(initPageInfo)
    const [loading, setLoading] = useState(true)
    const [categories, setCategories] = useState([])
    const [revenues, setRevenues] = useState([])

    useEffect(() => {
        setLoading(true)
        try {
            getReport()
            getCategoriesNoPage()
        } catch (e) {
            console.log("Error: ", e)
            ToastUtils.createToast(WsToastType.ERROR, e.response.data.message || WsMessage.INTERNAL_SERVER_ERROR)
        } finally {
            setLoading(false)
        }
    }, [req])

    const getReport = async () => {
        console.log('getReport() start with payload: ', req);
        setLoading(true)
        try {
            const resData = await AxiosApi.postAuth(WsUrl.ADMIN_REPORT_REVENUE_BY_PRODUCT, req)
            if (resData) {
                const { data } = resData
                setRevenues(data.data)
                setPageInfo({
                    ...pageInfo,
                    page: data.page,
                    pageSize: data.pageSize,
                    totalElements: data.totalElements,
                    totalPages: data.totalPages
                })
            }
        } catch (e) {
            ToastUtils.createToast(WsToastType.ERROR, e.response.data.message || WsMessage.INTERNAL_SERVER_ERROR)
        } finally {
            setLoading(false)
        }

    }

    const getCategoriesNoPage = async () => {
        const resData = await AxiosApi.getAuth(WsUrl.CATEGORY_NO_PAGE)
        if (resData) {
            setCategories(resData.data.data)
        }
    }

    const handleChangeCategoryFilter = e => {
        let value = e.target.value
        if ('all' === value) value = null
        console.log("handleChangeCategoryFilter() start with value: ", value);
        setReq({
            ...req,
            categoryId: value
        })
    }

    const handleChangeTextSearchFilter = values => {
        console.log('handleChangeTextSearchFilter() start with value: ', values);
        if (values.textSearch || values.textSearch.trim.length === 0) {
            setReq({
                ...req,
                textSearch: values.textSearch
            })
        }
    }

    const handleChangePageSizeFilter = e => {
        setReq({
            ...req,
            pageReq: {
                ...req.pageReq,
                page: 0,
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

    const handleChangeOrderFilter = e => {
        const value = e.target.value
        console.log('handleChangeOrderFilter start with value: '.value);
        let sortField = ""
        let sortDirection = ""
        if (value.length > 0) {
            sortField = value.substring(0, value.indexOf('-'))
            sortDirection = value.substring(sortField.length + 1)
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

    const handleExport = async (values) => {
        console.log("handleExport() start with value: ", values);
        setLoading(true)
        try {
            const axiosRes = await AxiosApi.postAuthExport(WsUrl.ADMIN_REPORT_REVENUE_BY_PRODUCT_EXPORT, values)
            console.log("handleExport axiosRes: ", axiosRes);
            if (axiosRes) {
                FileService.saveByteArray(axiosRes, "Doanhthutheosanpham")
            }
        } catch (e) {
            console.log("handleExport() error: ", e);
            ToastUtils.createToast(WsToastType.ERROR, WsMessage.EXPORT_FAILED, 2000)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container-fluid w-100 reponsive">
            <div className="card shadow mb-4">
                <div className="card-header py-3 d-flex justify-content-between">
                    <h3 className="m-0 font-weight-bold text-primary">Doanh thu theo sản phẩm</h3>
                    <div>
                        {/* <NavLink to="chart" className="btn btn-outline-primary mx-2">
                            <i className="fas fa-fw fa-chart-area" />
                        </NavLink> */}
                        <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exportModal">
                            <i className="fas fa-download fa-sm text-white-50" />
                        </button>
                        <div className="modal fade" id="exportModal" tabIndex={-1} role="dialog">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exportModal">Xuất File</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">×</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        Chọn kiểu xuất file...
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-outline-primary" data-dismiss="modal" onClick={() => handleExport({
                                            ...req,
                                            exportType: 'FILTER'
                                        })}>Theo bộ lọc</button>
                                        <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => handleExport({
                                            pageReq: initReq,
                                            exportType: 'ALL'
                                        })}>Tất cả</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <div className='row d-flex align-items-center py-1'>
                        <div className='col d-flex align-items-center'>
                            <span className='' style={{ minWidth: '64px' }}>Danh mục:</span>
                            <select className='border-1 form-control col-2 mx-2'
                                onChange={handleChangeCategoryFilter}>
                                <option value='all'>Tất cả</option>
                                {categories && categories.map((obj, index) => (
                                    <option key={index} value={obj.id}>{obj.name}</option>
                                ))}
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
                    <div className='d-flex justify-content-between align-items-center'>
                        <div><h6>Tìm thấy <b>{pageInfo.totalElements || 0}</b> dữ liệu phù hợp.</h6>
                        </div>
                        <div className='col-2'>
                            <select className='form-control' onChange={handleChangeOrderFilter}>
                                <option value='name-asc'>Tên (a-z)</option>
                                <option value='name-desc'>Tên (z-a)</option>
                                <option value='total-asc'>Doanh thu (thấp - cao)</option>
                                <option value='total-desc'>Doanh thu (cao - thấp)</option>
                            </select>
                        </div>
                    </div>
                    <div className='table-responsive'>
                        <table className="table table-bordered mt-4" id="dataTable" width="100%" cellSpacing={0}>
                            <thead>
                                <tr className='text-bold text-dark'>
                                    <th className='text-center' style={{ maxWidth: '40px' }}>No</th>
                                    <th className=''>Tên</th>
                                    <th className=''>Danh mục</th>
                                    <th className=''>Tổng số phân loại</th>
                                    <th className=''>Doanh thu</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    loading ? <HashSpinner /> : revenues && revenues.map((obj, index) => (
                                        <tr key={obj.id}>
                                            <td className='text-center' style={{ maxWidth: '40px' }}>{index + 1}</td>
                                            <td><Link to={`/product/detail/${obj.id}`}>{obj.name}</Link></td>
                                            <td>{obj?.categoryName}</td>
                                            <td>{obj?.optionNumber}</td>
                                            <td>{obj?.revenueFmt}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>

                    {pageInfo.totalElements > 0 && <div className='py-2 row align-items-center justify-content-between'>
                        <div className='col d-flex align-items-center'>
                            Hiển thị: <select className='border-1 form-control col-1 mx-2'
                                onChange={handleChangePageSizeFilter}>
                                <option value={10} defaultChecked>10</option>
                                <option value={20}>20</option>
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
        </div>
    )
}

export default ProductRevenuePage