import axios from "axios";
import React, { useEffect, useState } from "react";
import AxiosApi from "../../api/AxiosApi";
import WsUrl from "../../utils/constants/WsUrl";
import { useForm } from "react-hook-form";
import ToastUtils from "../../utils/ToastUtils";
import WsToastType from "../../utils/constants/WsToastType";
import WsMessage from "../../utils/constants/WsMessage";
import { NavLink } from "react-router-dom";
import HashSpinner from "../../component/spinner/HashSpinner";

const initReq = {
  status: null,
  textSearch: null,
  typeId: null,
  customerTypeId: null,
  pageReq: {
    page: 0,
    pageSize: 10,
    sortField: '',
    sortDirection: ''
  },
};

let initPageInfo = {
  page: null,
  pageSize: null,
  totalElements: null,
  totalPages: null,
};

const UserListPage = () => {

  const { register, handleSubmit } = useForm()
  const [req, setReq] = useState(initReq)
  const [pageInfo, setPageInfo] = useState(initPageInfo)
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [roles, setRoles] = useState([])
  const [users, setUsers] = useState([])
  const [customerTypes, setCustomerTypes] = useState([])
  const [showCustomerTypeFilter, setShowCustomerTypeFilter] = useState(false)

  useEffect(() => {
    getUsers()
  }, [req])

  useEffect(() => {
    getRoles()
    getCustomerTypes()
  }, [])

  const getCustomerTypes = async () => {
    console.log("getCustomerTypes() start");
    setLoading(true)
    try {
      const res = await AxiosApi.getAuth(WsUrl.CUSTOMER_TYPE_NO_PAGE)
      console.log("res", res);
      if (res) {
        const { data } = res
        console.log("getCustomerTypes() data: ", data);
        setCustomerTypes(data)
      }
    } catch (e) {
      console.log("getCustomerTypes() error: ", e);
      ToastUtils.createToast(WsToastType.ERROR, e.response.data.message || WsMessage.INTERNAL_SERVER_ERROR)
    } finally {
      setLoading(false)
    }
  }

  const getRoles = async () => {
    console.log("getRoles() start");
    setLoading(true)
    try {
      const res = await AxiosApi.get(WsUrl.NO_AUTH_ROLE_SEARCH)
      console.log("res", res);
      if (res) {
        const { data } = res
        console.log("getRoles data: ", data);
        setRoles(data)
      }
    } catch (e) {
      console.log("getRoles() error: ", e);
      ToastUtils.createToast(WsToastType.ERROR, e.response.data.message || WsMessage.INTERNAL_SERVER_ERROR)
    } finally {
      setLoading(false)
    }
  }

  const getUsers = async () => {
    console.log("getUsers() start");
    setLoading(true)
    try {
      const res = await AxiosApi.postAuth(WsUrl.ADMIN_USER_SEARCH, req)
      console.log("res", res);
      if (res) {
        const { data } = res
        console.log("getUsers data: ", data);
        setUsers(data.data)
        setPageInfo({
          page: data.page,
          pageSize: data.pageSize,
          totalPages: data.totalPages,
          totalElements: data.totalElements,
        })
      }
    } catch (e) {
      console.log("getUsers() error: ", e);
      ToastUtils.createToast(WsToastType.ERROR, e.response.data.message || WsMessage.INTERNAL_SERVER_ERROR)
    } finally {
      setLoading(false)
    }
  }

  const handleChangeStatusFilter = e => {
    const value = e.target.value
    console.log("handleChangeStatusFilter() value: ", value)
    let status = value === 'active' ? true : value === 'de-active' ? false : null
    console.log("handleChangeStatusFilter() status: ", status)
    setReq({
      ...req,
      active: status,
      pageReq: {
        ...req.pageReq,
        page: 0,
      }
    })
  }

  const handleChangeRoleFilter = (e) => {
    let value = e.target.value
    if (value.length == 0) {
      value = null;
      setShowCustomerTypeFilter(false)
    } else if ('ROLE_CUSTOMER' == value) {
      setShowCustomerTypeFilter(true)
    } else {
      setShowCustomerTypeFilter(false)
    }
    console.log('handleChangeRoleFilter() start with value: ', value)
    setReq({
      ...req,
      role: value,
      customerTypeId: null,
      pageReq: {
        ...req.pageReq,
        page: 0,
      }
    })
  }

  const handleChangeCustomerTypeFilter = e => {
    let value = e.target.value
    if (value.length == 0) {
      value = null;
    }
    console.log('handleChangeCustomerTypeFilter() start with value: ', value)
    setReq({
      ...req,
      customerTypeId: value,
      pageReq: {
        ...req.pageReq,
        page: 0,
      }
    })
  }

  const handleChangeTextSearchFilter = values => {
    if (values.textSearch || values.textSearch.trim.length === 0) {
      setReq({
        ...req,
        textSearch: values.textSearch,
        pageReq: {
          ...req.pageReq,
          page: 0,
        }
      })
    }
  }
  const handleChangeOrderFilter = (e) => {
    const value = e.target.value
    console.log('handleChangeOrderFilter start with value: '.value);
    let sortField = ""
    let sortDirection = ""
    if (value.length > 0) {
      sortField = value.substring(0, value.indexOf('-'))
      console.log(sortField)
      sortDirection = value.substring(sortField.length + 1)
      console.log(sortDirection)
    }
    console.log("input: ", value, " - sortField: ", sortField, " - sortDirection: ", sortDirection)
    setReq({
      ...req,
      pageReq: {
        ...req.pageReq,
        sortField: sortField,
        sortDirection: sortDirection,
        page: 0,
      }
    })
  }

  const handleDelete = async (id) => {
    console.log("handleDelete() start with payload: ", id);
    setLoading(true)
    try {
      const res = await AxiosApi.deleteAuth(`${WsUrl.ADMIN_USER_DELETE}?id=${id}`)
      if (res) {
        ToastUtils.createToast(WsToastType.SUCCESS, WsMessage.DELETE_SUCCESS)
        getUsers()
      }
    } catch (e) {
      ToastUtils.createToast(WsToastType.ERROR, e.response.data.message || WsMessage.INTERNAL_SERVER_ERROR, 2000)
    } finally {
      setLoading(false)
    }
  }

  const handleChangeStatus = async (id) => {
    console.log("handleChangeStatus() start with payload: ", id);
    setLoading(true)
    try {
      const res = await AxiosApi.getAuth(`${WsUrl.ADMIN_USER_CHANGE_STATUS}?id=${id}`)
      if (res) {
        ToastUtils.createToast(WsToastType.SUCCESS, WsMessage.UPDATE_SUCCESS)
        getUsers()
      }
    } catch (e) {
      ToastUtils.createToast(WsToastType.ERROR, e.response.data.message || WsMessage.INTERNAL_SERVER_ERROR, 2000)
    } finally {
      setLoading(false)
    }
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

  return (
    <div className="container-fluid w-100 reponsive">
      <div className="card shadow mb-4">
        <div className="card-header py-3 d-flex justify-content-between">
          <h3 className="m-0 font-weight-bold text-primary">Danh s??ch ng?????i d??ng</h3>
          <NavLink to={'/user/create'} className='btn btn-primary'>Th??m m???i</NavLink>
        </div>
        <div className="card-body">
          <div className='row d-flex align-items-center py-1'>
            <div className='col d-flex align-items-center'>
              <span className='' style={{ minWidth: '64px' }}>Tr???ng th??i:</span>
              <select className='border-1 form-control col-2 mx-2'
                onChange={handleChangeStatusFilter}>
                <option value='all'>T???t c???</option>
                <option value='active'>Ho???t ?????ng</option>
                <option value='de-active'>Ng??ng ho???t ?????ng</option>
              </select>
              <span className='' style={{ minWidth: '64px' }}>Ph??n lo???i:</span>
              <select className='border-1 form-control col-2 mx-2'
                onChange={handleChangeRoleFilter}>
                {roles && roles.map((obj, index) => (
                  <option key={index} value={obj?.roleCode}>{obj?.roleName}</option>
                ))}
              </select>
              {showCustomerTypeFilter && <>
                <span className='' style={{ minWidth: '64px' }}>Lo???i kh??ch h??ng:</span>
                <select className='border-1 form-control col-2 mx-2'
                  onChange={handleChangeCustomerTypeFilter}>
                  <option value=''>T???t c???</option>
                  {customerTypes && customerTypes.map((obj, index) => (
                    <option key={index} value={obj?.id}>{obj?.name}</option>
                  ))}
                </select>
              </>}
            </div>

            <form className="d-none d-sm-inline-block form-inline navbar-search col-4"
              onSubmit={handleSubmit(handleChangeTextSearchFilter)}>
              <div className="input-group">
                <input type="text" className="form-control bg-light border-0 small"
                  placeholder="T??m ki???m..." aria-label="Search" aria-describedby="basic-addon2"
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
            <div><h6>T??m th???y <b>{pageInfo.totalElements}</b> d??? li???u ph?? h???p.</h6>
            </div>
            <div className='col-2'>
              <select className='form-control' onChange={handleChangeOrderFilter}>
                <option value='createdDate-desc'>Ng??y t???o (M???i nh???t)</option>
                <option value='createdDate-asc'>Ng??y t???o (C?? nh???t)</option>
                <option value='lastName-asc'>T??n (a-z)</option>
                <option value='lastName-desc'>T??n (z-a)</option>
              </select>
            </div>
          </div>
          <div className='table-responsive'>
            <table className="table table-bordered mt-4" id="dataTable" width="100%" cellSpacing={0}>
              <thead>
                <tr className='text-bold text-dark'>
                  <th className='text-center' style={{ maxWidth: '40px' }}>No</th>
                  <th className=''>T??n</th>
                  <th className=''>Email</th>
                  <th className=''>S??? ??i???n tho???i</th>
                  <th className=''>Ng??y sinh</th>
                  <th className=''>Role</th>
                  <th className=''>S??? l?????ng ????n h??ng</th>
                  <th className=''>Ng??y t???o</th>
                  <th className=''>Tr???ng th??i</th>
                  <th className=''>More</th>
                </tr>
              </thead>
              <tbody>
                {
                  loading ? <HashSpinner /> : users && users.map((obj, index) => (
                    <tr key={index}>
                      <td className='text-center' style={{ maxWidth: '40px' }}>{index + 1}</td>
                      <td>{obj?.combinationName}</td>
                      <td>{obj?.email}</td>
                      <td>{obj?.phone}</td>
                      <td>{obj?.dobFmt}</td>
                      <td>{obj?.roleName}</td>
                      <td>{obj?.orderNumber}</td>
                      <td>{obj?.createdDateFmt}</td>
                      <td className='' style={{ minWidth: '80px' }}>
                        <span className={`btn text-light badge badge-pill badge-${obj?.activeClazz}`}
                          data-toggle="modal"
                          data-target={`#changeStatusModal${obj.id}`}>{obj?.activeName}</span>
                      </td>
                      <td>
                        <div className="btn-group dropleft">
                          <a className="btn text-dark" type="button" id="dropdownMenuButton"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i className="fa fa-ellipsis-h" aria-hidden="true" />
                          </a>
                          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <NavLink to={`detail/${obj.id}`} className="dropdown-item">Ch???nh s???a</NavLink>
                            <a className="dropdown-item" href="#" data-toggle="modal"
                              data-target={`#deleteModal${obj.id}`}>X??a</a>
                          </div>
                        </div>
                        <div className="modal fade" id={`deleteModal${obj.id}`} tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                          <div className="modal-dialog" role="document">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">X??a ng?????i d??ng</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                  <span aria-hidden="true">??</span>
                                </button>
                              </div>
                              <div className="modal-body">
                                B???n c?? ch???c mu???n x??a ng?????i d??ng <b className=''>{obj.name}</b> kh??ng? <br />
                              </div>
                              <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">H???y</button>
                                <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={() => handleDelete(obj.id, obj.canEdit)}>X??a</button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="modal fade" id={`changeStatusModal${obj.id}`} tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                          <div className="modal-dialog" role="document">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Thay ?????i tr???ng th??i</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                  <span aria-hidden="true">??</span>
                                </button>
                              </div>
                              <div className="modal-body">
                                B???n c?? ch???c mu???n thay ?????i tr???ng th??i ng?????i d??ng <b className=''>{obj.name}</b> kh??ng? <br />
                              </div>
                              <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">H???y</button>
                                <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => handleChangeStatus(obj.id)}>X??c nh???n</button>
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
          </div>

          {pageInfo.totalElements > 0 && <div className='py-2 row align-items-center justify-content-between'>
            <div className='col d-flex align-items-center'>
              Hi???n th???: <select className='border-1 form-control col-1 mx-2'
                onChange={handleChangePageSizeFilter}>
                <option value={10} defaultChecked>10</option>
                <option value={20}>20</option>
                <option value={10}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            <div className=''>
              <button className='btn btn-outline-dark btn-sm mx-1 px-2'
                onClick={() => handleChangePageFilter(pageInfo.page - 1)}
                disabled={pageInfo.page == 0}>Tr?????c
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
    ;
};

export default UserListPage;
