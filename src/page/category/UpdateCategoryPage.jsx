import React, { useEffect } from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useParams } from 'react-router-dom'
import AxiosApi from '../../api/AxiosApi'
import WSSelected from '../../component/selecte/WSSelected'
import HashSpinner from '../../component/spinner/HashSpinner'
import WsMessage from '../../utils/constants/WsMessage'
import WsToastType from '../../utils/constants/WsToastType'
import WsUrl from '../../utils/constants/WsUrl'
import ToastUtils from '../../utils/ToastUtils'

const UpdateCategoryPage = () => {
    const { id } = useParams()
    const { register, handleSubmit, formState: { errors }, reset } = useForm()
    const [loading, setLoading] = useState(false)
    const [productSelected, setProductSelected] = useState([])
    const [products, setProducts] = useState([])
    const [category, setCategory] = useState(null)
    const [types, setTypes] = useState([])

    useEffect(() => {
        getCategoryDetail()
    }, [reset])

    useEffect(() => {
        getTypes()
        getProductNoPageUpdate()
    }, [])

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

    const getCategoryDetail = async () => {
        setLoading(true)
        if (!id) {
            return false;
        }
        console.log('getCategoryDetail() start');
        try {
            const axiosRes = await AxiosApi.getAuth(`${WsUrl.ADMIN_CATEGORY_DETAIL}?id=${id}`)
            console.log('getCategoryDetail() axiosRes: ', axiosRes);
            const { data } = axiosRes
            setCategory(data)
            setProductSelected(data.products.map(o => ({ label: o.name, value: o.id })))
            reset(data)
        } catch (e) {
            ToastUtils.createToast(WsToastType.ERROR, e.response.data.message || WsMessage.INTERNAL_SERVER_ERROR)
        } finally {
            setLoading(false)
        }
    }

    const getProductNoPageUpdate = async () => {
        if (!id) {
            return false;
        }
        try {
            console.log("getProductNoPageUpdate() start")
            const res = await AxiosApi.getAuth(`${WsUrl.PRODUCT_NO_CATEGORY_UPDATE}?id=${id}`)
            console.log("getProductNoPageUpdate() res: ", res)
            const { data } = res
            setProducts(data)
        } catch (e) {
            ToastUtils.createToast(WsToastType.ERROR, e.response.data.message || WsMessage.INTERNAL_SERVER_ERROR)
        }
    }

    const handleSubmitForm = async values => {
        setLoading(true)
        console.log("handleSubmitForm() values: ", values);
        try {
            const payload = {
                id: id,
                name: values.name,
                des: values.des,
                productIds: productSelected.length > 0 ? productSelected.map(o => (o.value)) : [],
                typeId: values.typeId,
            }
            console.log("handleSubmitForm() payload: ", payload);
            const resAxios = await AxiosApi.postAuth(WsUrl.ADMIN_CATEGORY_UPDATE, payload)
            console.log("handleSubmitForm() resAxios: ", resAxios)
            if (resAxios) {
                ToastUtils.createToast(WsToastType.SUCCESS, WsMessage.UPDATE_SUCCESS)
            }
        } catch (e) {
            console.log("handleSubmitForm() error: ", e)
            ToastUtils.createToast(WsToastType.ERROR, e.response.data.message || WsMessage.INTERNAL_SERVER_ERROR, 2000)
        } finally {
            setLoading(false)
        }

    }

    return (
        <div className="container-fluid w-100 reponsive">
            <form className="card shadow mb-4" onSubmit={handleSubmit(handleSubmitForm)}>
                <div className="card-header py-3 d-flex align-items-center">
                    <Link to='/category' className=''><i className="fa fa-arrow-left" aria-hidden="true" /></Link>
                    <span className='mx-1'></span>
                    <h3 className="m-0 font-weight-bold text-primary">Chỉnh sửa danh mục</h3>
                </div>
                {loading === true ? <HashSpinner /> : <div className="card-body d-flex justify-content-between">
                    <div className='col-8'>
                        <div className='form-group'>
                            <b><label htmlFor="" className="form-label">Phân loại<span className='text-danger'>*</span></label></b>
                            <select className='border-1 form-control' {...register('typeId')}>
                                {types && types.map((obj, index) => (
                                    <option key={index} value={obj.id} selected={obj.id == category?.typeId}>{obj.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className='form-group'>
                            <b><label htmlFor="" className="form-label">Tên danh mục<span className='text-danger'>*</span></label></b>
                            <input type="input" className="form-control py-3" {...register("name", { required: true, minLength: 4 })} defaultValue={category?.name} />
                            {errors.name && <>
                                {errors.name.type === 'required' && <span className='small text-danger'>Không được để trống</span>}
                                {errors.name.type === 'minLength' && <span className='small text-danger'>Độ dài phải lớn hơn 4 ký tự</span>} </>}
                        </div>

                        <div className='form-group'>
                            <b><label htmlFor="" className="form-label">Mô tả<span className='text-danger'>*</span></label></b>
                            <textarea className='form-control' rows={6} {...register('des', { required: true, minLength: 4, maxLength: 500 })} defaultValue={category?.des}></textarea>
                            {errors.des &&
                                <>
                                    {'required' === errors.des.type && <span className='small text-danger'>Không được để trống</span>}
                                    {'minLength' === errors.des.type && <span className='small text-danger'>Độ dài phải lớn hơn 4 ký tự</span>}
                                    {'maxLength' === errors.des.type && <span className='small text-danger'>Độ dài phải nhỏ hơn 500 ký tự</span>}
                                </>}
                        </div>

                        <div className='form-group'>
                            <b><label htmlFor="" className="form-label">Danh sách sản phẩm</label></b>
                            <WSSelected options={products.map(o => ({ label: o.name, value: o.id }))} selected={productSelected} setSelected={setProductSelected} />
                        </div>
                    </div>

                </div>}
                <div className="card-footer d-flex justify-content-eight">
                    <input type='submit' className='btn btn-primary mt-2 px-4' value={'Lưu'} />
                </div>
            </form>
        </div>)
}

export default UpdateCategoryPage