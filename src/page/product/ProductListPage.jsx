import React, { useEffect, useState } from 'react'
import HashSpinner from '../../component/spinner/HashSpinner';
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from 'react-router-dom';
import WsUrl from '../../utils/constants/WsUrl';
import ToastUtils from '../../utils/ToastUtils';
import WsToastType from '../../utils/constants/WsToastType';
import WsMessage from '../../utils/constants/WsMessage';
import AxiosApi from '../../api/AxiosApi';

const initReq = {
  id: null,
  active: null,
  textSearch: null,
  minPrice: null,
  maxPrice: null,
  pageReq: {
    page: 0,
    pageSize: 10,
    sortField: "",
    sortDirection: ""
  },
  typeId: null,
  categoryId: null,
}

let initPageInfo = {
  page: null,
  pageSize: null,
  totalElements: null,
  totalPages: null,
};

const ProductListPage = () => {

  const { register, handleSubmit } = useForm()
  const [req, setReq] = useState(initReq)
  const [pageInfo, setPageInfo] = useState(initPageInfo)
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [types, setTypes] = useState([])
  const [products, setProducts] = useState([])

  useEffect(() => {
    getProducts()
  }, [req])

  useEffect(() => {
    getTypes()
    getCategories()
  }, [])

  const getCategories = async () => {
    console.log("getCategories() start");
    setLoading(true)
    try {
      const res = await AxiosApi.get(WsUrl.NO_AUTH_CATEGORY_NO_PAGE)
      console.log("getCategories() res", res);
      if (res) {
        const { data } = res
        console.log("getCategories() data: ", data);
        setCategories(data)
      }
    } catch (e) {
      console.log("getCategories()() error: ", e);
      ToastUtils.createToast(WsToastType.ERROR, e.response.data.message || WsMessage.INTERNAL_SERVER_ERROR)
    } finally {
      setLoading(false)
    }
  }

  const getTypes = async () => {
    console.log("getTypes() start");
    setLoading(true)
    try {
      const res = await AxiosApi.get(WsUrl.NO_AUTH_TYPE_NO_PAGE)
      console.log("res", res);
      if (res) {
        const { data } = res
        console.log("getTypes data: ", data);
        setTypes(data)
      }
    } catch (e) {
      console.log("getTypes() error: ", e);
      ToastUtils.createToast(WsToastType.ERROR, e.response.data.message || WsMessage.INTERNAL_SERVER_ERROR)
    } finally {
      setLoading(false)
    }
  }

  const getProducts = async () => {
    console.log("getProducts() start");
    setLoading(true)
    try {
      const res = await AxiosApi.postAuth(WsUrl.ADMIN_PRODUCT_SEARCH, req)
      console.log("res", res);
      if (res) {
        const { data } = res
        console.log("data: ", data);
        setProducts(data.data)
        setPageInfo({
          ...pageInfo,
          page: data.page,
          pageSize: data.pageSize,
          totalElements: data.totalElements,
          totalPages: data.totalPages
        })
      }
    } catch (e) {
      console.log("getProducts() error: ", e);
      ToastUtils.createToast(WsToastType.ERROR, e.response.data.message || WsMessage.INTERNAL_SERVER_ERROR)
    } finally {
      setLoading(false)
    }
  }

  const handleChangeStatusFilter = e => {
    let value = e.target.value
    console.log("handleChangeStatusFilter() value: ", value)
    if (value.length == 0) value = null;
    console.log("handleChangeStatusFilter() status: ", value)
    setReq({
      ...req,
      active: value,
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
        pageReq: {
          ...req.pageReq,
          page: 0,
        },
        textSearch: values.textSearch
      })
    }
  }

  const handleDelete = async (id) => {
    console.log("handleDelete() start with payload: ", id);
    setLoading(true)
    try {
      const res = await AxiosApi.deleteAuth(`${WsUrl.ADMIN_PRODUCT_DELETE}?id=${id}`)
      if (res) {
        ToastUtils.createToast(WsToastType.SUCCESS, WsMessage.DELETE_SUCCESS)
        getProducts()
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

  const handleChangeStatus = async id => {
    console.log("handleChangeStatus() start with payload: ", id);
    setLoading(true)
    try {
      const res = await AxiosApi.getAuth(`${WsUrl.ADMIN_PRODUCT_CHANGE_STATUS}?id=${id}`)
      if (res) {
        ToastUtils.createToast(WsToastType.SUCCESS, WsMessage.UPDATE_SUCCESS)
        getProducts()
      }
    } catch (e) {
      ToastUtils.createToast(WsToastType.ERROR, e.response.data.message || WsMessage.INTERNAL_SERVER_ERROR, 2000)
    } finally {
      setLoading(false)
    }
  }

  const handleChangeOrderFilter = e => {
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
        sortDirection: sortDirection
      }
    })
  }

  const handleChangeTypeFilter = e => {
    let value = e.target.value
    if (value.length == 0) value = null
    console.log('handleChangeTypeFilter start with value: ', value);
    setReq({
      ...req,
      pageReq: {
        ...req.pageReq,
        page: 0,
      },
      typeId: value
    })
  }

  const handleChangeCategoryFilter = e => {
    let value = e.target.value
    if (value == 'all') value = null
    console.log('handleChangeCategoryFilter() start with value: ', value);
    setReq({
      ...req,
      pageReq: {
        ...req.pageReq,
        page: 0,
      },
      categoryId: value
    })
  }

  return (
    <div className="container-fluid w-100 reponsive">
      <div className="card shadow mb-4">
        <div className="card-header py-3 d-flex justify-content-between">
          <h3 className="m-0 font-weight-bold text-primary">Danh s??ch s???n ph???m</h3>
          <NavLink to={'/product/create'} className='btn btn-primary'>Th??m m???i</NavLink>
        </div>
        <div className="card-body">
          <div className='row d-flex align-items-center py-1'>
            <div className='col d-flex align-items-center'>
              <span className='' style={{ minWidth: '64px' }}>Tr???ng th??i:</span>
              <select className='border-1 form-control col-2 mx-2'
                onChange={handleChangeStatusFilter}>
                <option value=''>T???t c???</option>
                <option value={true}>Ho???t ?????ng</option>
                <option value={false}>Ng??ng ho???t ?????ng</option>
              </select>

              <span className='' style={{ minWidth: '64px' }}>Lo???i:</span>
              <select className='border-1 form-control col-2 mx-2'
                onChange={handleChangeTypeFilter}>
                <option value=''>T???t c???</option>
                {types && types.map((obj, index) => (
                  <option key={index} value={obj.id}>{obj.name}</option>
                ))}
              </select>

              <span className='' style={{ minWidth: '64px' }}>Danh m???c:</span>
              <select className='border-1 form-control col-2 mx-2'
                onChange={handleChangeCategoryFilter}>
                <option value='all'>T???t c???</option>
                {categories && categories.map((obj, index) => (
                  <option key={index} value={obj.id}>{obj.name}</option>
                ))}
                <option value=''>Kh??c</option>
              </select>
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
                <option value='name-asc'>T??n (a-z)</option>
                <option value='name-desc'>T??n (z-a)</option>
              </select>
            </div>
          </div>
          <div className='table-responsive'>
            <table className="table table-bordered mt-4" id="dataTable" width="100%" cellSpacing={0}>
              <thead>
                <tr className='text-bold text-dark'>
                  <th className='text-center' style={{ maxWidth: '40px' }}>#</th>
                  <th className=''>T??n</th>
                  <th className=''>Lo???i</th>
                  <th className=''>Danh m???c</th>
                  <th className=''>Ch???t li???u</th>
                  <th className=''>Ph??n lo???i</th>
                  <th className=''>Gi?? b??n</th>
                  <th className=''>???? b??n</th>
                  <th className='' style={{ minWidth: '80px' }}>Tr???ng th??i</th>
                  <th className=''>Ng??y t???o</th>
                  <th className=''>More</th>
                </tr>
              </thead>
              <tbody>
                {
                  loading ? <HashSpinner /> : products && products.map((obj, index) => (
                    <tr key={obj.id}>
                      <td className='text-center' style={{ maxWidth: '40px' }}>{index + 1}</td>
                      <td title={obj?.des}>{obj?.name}</td>
                      <td>{obj.typeName}</td>
                      <td>{obj.categoryName}</td>
                      <td>{obj.materialName}</td>
                      <td title={obj?.specifications}>{obj?.productOptionNumber}</td>
                      <td>{`${obj?.minPrice} - ${obj?.maxPrice}`}</td>
                      <td>{`${obj.soldNumber}/${obj?.qty}`}</td>
                      <td className='' style={{ minWidth: '80px' }}>
                        <span className={`btn text-light badge badge-pill badge-${obj?.activeClazz}`}
                          data-toggle="modal"
                          data-target={`#changeStatusModal${obj.id}`}>{obj?.activeName}</span>
                      </td>
                      <td>{obj.createdDateFmt}</td>
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
                                <h5 className="modal-title" id="exampleModalLabel">X??a danh m???c s???n ph???m</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                  <span aria-hidden="true">??</span>
                                </button>
                              </div>
                              <div className="modal-body">
                                B???n c?? ch???c mu???n x??a danh m???c <b className=''>{obj.name}</b> kh??ng? <br />
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
                                B???n c?? ch???c mu???n thay ?????i tr???ng th??i <b className=''>{obj.name}</b> kh??ng? <br />
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
}

export default ProductListPage