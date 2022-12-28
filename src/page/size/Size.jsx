import React, { useState } from "react";
import { useEffect } from "react";
import AxiosApi from "../../api/AxiosApi";
import WsUrl from "../../utils/constants/WsUrl";
import { useForm } from "react-hook-form";
import ToastUtils from "../../utils/ToastUtils";
import WsToastType from "../../utils/constants/WsToastType";
import WsMessage from "../../utils/constants/WsMessage";
import HashSpinner from '../../component/spinner/HashSpinner';

let initPageInfo = {
  page: null,
  pageSize: null,
  totalElements: null,
  totalPages: null,
};

const initReq = {
  active: null,
  textSearch: null,
  pageReq: {
    page: 0,
    pageSize: 10,
    sortField: "",
    sortDirection: ""
  },
}

const Size = () => {
  const { register, handleSubmit } = useForm();
  const { register: registerUpdate, handleSubmit: handleSubmitUpdate, reset: resetUpdate } = useForm()
  const [loading, setLoading] = useState(false)
  const [sizes, setSizes] = useState([]);
  const [size, setSize] = useState()
  const [pageInfo, setPageInfo] = useState(initPageInfo)
  const [req, setReq] = useState(initReq)


  useEffect(() => {
    getSizes();
  }, [req])

  const getSizes = async () => {
    console.log("getSizes() start");
    setLoading(true)
    try {
      const axiosRes = await AxiosApi.postAuth(WsUrl.ADMIN_SIZE_SEARCH, req)
      console.log("getSizes() axiosRes", axiosRes);
      if (axiosRes) {
        const { data } = axiosRes
        setSizes(data.data)
        setPageInfo({
          ...pageInfo,
          page: data.page,
          pageSize: data.pageSize,
          totalElements: data.totalElements,
          totalPages: data.totalPages
        })
      }
    } catch (e) {
      console.log("getSizes() error: ", e);
      ToastUtils.createToast(WsToastType.ERROR, e.response.data.message || WsMessage.INTERNAL_SERVER_ERROR)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (values) => {
    console.log("handleSubmitForm() start with values: ", values)
    setLoading(true)
    try {
      let payload = {
        name: values.sizeName
      }
      const res = await AxiosApi.postAuth(WsUrl.ADMIN_SIZE_CREATE, payload)
      if (res) {
        ToastUtils.createToast(WsToastType.SUCCESS, WsMessage.CREATED_DONE, 1000)
        getSizes()
      }
    } catch (error) {
      ToastUtils.createToast(WsToastType.ERROR, error.response.data.message || WsMessage.INTERNAL_SERVER_ERROR, 2000)
    } finally {
      setLoading(false)
    }
  }

  const deleteSize = async (id) => {
    setLoading(true)
    console.log(id)
    try {
      const res = await AxiosApi.deleteAuth(`${WsUrl.ADMIN_SIZE_DELETE}?id=${id}`)
      if (res) {
        ToastUtils.createToast(WsToastType.SUCCESS, WsMessage.DELETE_SUCCESS)
      }
    } catch (error) {
      ToastUtils.createToast(WsToastType.ERROR, error.response.data.message || WsMessage.INTERNAL_SERVER_ERROR, 2000)
    } finally {
      setLoading(false)
      getSizes();
    }
  }

  const getSize = async (id) => {
    // setLoading(true)
    try {
      const res = await AxiosApi.getAuth(`${WsUrl.ADMIN_SIZE_DETAIL}?id=${id}`)
      if (res) {
        const { data } = res
        setSize(data)
        resetUpdate(data)
      }
    } catch (error) {
      ToastUtils.createToast(WsToastType.ERROR, error.response.data.message || WsMessage.INTERNAL_SERVER_ERROR, 2000)
    } finally {
      // setLoading(false)
    }
  }

  const handleChangeStatus = async (id) => {
    setLoading(true)
    console.log(id)
    try {
      const res = await AxiosApi.getAuth(`${WsUrl.ADMIN_SIZE_CHANGE_STATUS}?id=${id}`)
      if (res) {
        ToastUtils.createToast(WsToastType.SUCCESS, WsMessage.UPDATE_SUCCESS)
        getSizes()
      }
    } catch (error) {
      ToastUtils.createToast(WsToastType.ERROR, error.response.data.message || WsMessage.INTERNAL_SERVER_ERROR, 2000)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateSize = async (values) => {
    setLoading(true)
    try {
      console.log('handleupdateSize() values: ', values);
      const payload = {
        id: values.id,
        name: values.name4Update
      }
      console.log('handleupdateSize() payload: ', payload);
      const axiosRes = await AxiosApi.postAuth(WsUrl.ADMIN_SIZE_UPDATE, payload)
      if (axiosRes) {
        getSizes()
        ToastUtils.createToast(WsToastType.SUCCESS, WsMessage.UPDATE_SUCCESS)
      }
    } catch (error) {
      ToastUtils.createToast(WsToastType.ERROR, error.response.data.message || WsMessage.INTERNAL_SERVER_ERROR, 2000)
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


  return (
    <div className="container-fluid w-100 reponsive">
      <div className="card shadow mb-4">
        <div className="card-header py-3 d-flex justify-content-between">
          <h3 className="m-0 font-weight-bold text-primary">Danh sách kích cỡ</h3>
          <a className='btn btn-primary' data-toggle="modal"
            data-target={`#addModal`}>Thêm mới</a>
          <div className="modal fade" id={`addModal`} tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel"><b>Thêm kích cỡ</b></h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <form className=" modal-body p-4">
                  <label htmlFor="">Tên</label>
                  <input type="text" className="form-control" {...register("sizeName")} required /><br />
                  <div className="modal-footer p-0 pt-4">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Hủy</button>
                    <button type="submit" className="btn btn-primary" onClick={handleSubmit(onSubmit)} data-dismiss="modal" >Thêm mới</button>
                  </div>
                </form>

              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className='row d-flex align-items-center py-1'>
            <div className='col d-flex align-items-center'>
              <span className='' style={{ minWidth: '64px' }}>Trạng thái:</span>
              <select className='border-1 form-control col-2 mx-2'
                onChange={handleChangeStatusFilter}>
                <option value=''>Tất cả</option>
                <option value={true}>Hoạt động</option>
                <option value={false}>Ngưng hoạt động</option>
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

          <hr />
          <div className='table-responsive'>
            <table className="table table-bordered mt-4" id="dataTable" width="100%" cellSpacing={0}>
              <thead>
                <tr className='text-bold text-dark'>
                  <th className='text-center' style={{ maxWidth: '40px' }}>#</th>
                  <th className=''>Tên</th>
                  <th className='' style={{ minWidth: '80px' }}>Trạng thái</th>
                  <th className='text-center'>More</th>
                </tr>
              </thead>
              <tbody>
                {loading ? <HashSpinner /> : sizes && sizes.map((obj, index) => (
                  <tr className="border" key={index}>
                    <td className='text-center' style={{ maxWidth: '40px' }}>{index + 1}</td>
                    <td>{obj?.name}</td>
                    <td className='' style={{ minWidth: '80px' }}>
                      <span className={`btn text-light badge badge-pill badge-${obj?.status.clazz}`}
                        data-toggle="modal"
                        data-target={`#changeStatusModal${obj.id}`}>{obj?.status.title}</span>
                    </td>

                    <td className='text-center' >
                      <div className="btn-group dropleft">
                        <a className="btn text-dark" type="button" id="dropdownMenuButton"
                          data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          <i className="fa fa-ellipsis-h" aria-hidden="true" />
                        </a>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                          <a className="dropdown-item" href="#" data-toggle="modal"
                            data-target={`#editModal${obj.id}`} onClick={() => getSize(obj.id)}>Chỉnh sửa</a>
                          <a className="dropdown-item" href="#" data-toggle="modal"
                            data-target={`#deleteModal${obj.id}`}>Xóa</a>
                        </div>
                      </div>
                      <div className="text-left modal fade" id={`deleteModal${obj.id}`} tabIndex={-1} role="dialog">
                        <div className="modal-dialog" role="document">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5 className="modal-title" id="exampleModalLabel">Xóa kích cỡ</h5>
                              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                              </button>
                            </div>
                            <div className="modal-body">
                              Bạn có chắc muốn xóa kích cỡ<b className=''> {obj.name}</b> không? <br />
                            </div>
                            <div className="modal-footer">
                              <button type="button" className="btn btn-secondary" data-dismiss="modal">Hủy</button>
                              <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={() => deleteSize(obj.id)} >Xóa</button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-left modal fade" id={`editModal${obj.id}`} tabIndex={-1} role="dialog">
                        <div className="modal-dialog" role="document">
                          <form className="modal-content">
                            <div className="modal-header">
                              <h5 className="modal-title" id="exampleModalLabel">Chỉnh sửa kích cỡ</h5>
                              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                              </button>
                            </div>
                            <div className="modal-body">
                              <input hidden {...registerUpdate('id')} defaultValue={size?.id} />
                              <label>Tên</label>
                              <input className="form-control" {...registerUpdate('name4Update')} defaultValue={size && size?.name} />
                            </div>
                            <div className="modal-footer">
                              <button type="button" className="btn btn-secondary" data-dismiss="modal">Hủy</button>
                              <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={handleSubmitUpdate(handleUpdateSize)}>Lưu</button>
                            </div>
                          </form>
                        </div>
                      </div>
                      <div className="text-left modal fade" id={`changeStatusModal${obj?.id}`} tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5 className="modal-title" id="exampleModalLabel">Thay đổi trạng thái</h5>
                              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                              </button>
                            </div>
                            <div className="modal-body">
                              Bạn có chắc muốn thay đổi trạng thái kích cỡ <b className=''>{obj?.name}</b> không? <br />
                            </div>
                            <div className="modal-footer">
                              <button type="button" className="btn btn-secondary" data-dismiss="modal">Hủy</button>
                              <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => handleChangeStatus(obj?.id)}>Xác nhận</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>

                  </tr>
                ))}

              </tbody>
            </table>

          </div>

          {pageInfo.totalElements > 0 && <div className='py-2 row align-items-center justify-content-between'>
            <div className='col d-flex align-items-center'>
              Hiển thị: <select className='border-1 form-control col-1 mx-2'
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
  );
};

export default Size;
