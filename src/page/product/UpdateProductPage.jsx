import React, { useState } from 'react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useParams } from 'react-router-dom'
import AxiosApi from '../../api/AxiosApi'
import HashSpinner from '../../component/spinner/HashSpinner'
import WSStar from '../../component/star/WSStar'
import WsMessage from '../../utils/constants/WsMessage'
import WsToastType from '../../utils/constants/WsToastType'
import WsUrl from '../../utils/constants/WsUrl'
import ToastUtils from '../../utils/ToastUtils'

const UpdateProductPage = () => {
    const { id } = useParams()
    const { register, handleSubmit, formState: { errors }, reset } = useForm()
    const [loading, setLoading] = useState(false)
    const [materials, setMaterials] = useState([])
    const [categories, setCategories] = useState([])
    const [colors, setColors] = useState([])
    const [sizes, setSizes] = useState([])
    const [disableBtn, setDisableBtn] = useState(false)
    const [options, setOptions] = useState([])
    const [product, setProduct] = useState(null)
    const [reviews, setReviews] = useState(null)

    useEffect(() => {
        getSize()
        getCategories()
        getColor()
        getMaterials()
    }, [])

    useEffect(() => {
        getProductById()
    }, [reset])

    const getProductById = async () => {
        setLoading(true)
        try {
            const res = await AxiosApi.getAuth(`${WsUrl.ADMIN_PRODUCT_DETTAIL}?id=${id}`)
            console.log('getProductById() res: ', res);
            if (res) {
                const { data } = res
                console.log('getProductById() data: ', data);
                setProduct(data)
                const { options, reviews } = data
                setOptions(options)
                setReviews(reviews)
                reset(data)
            }
        } catch (e) {
            ToastUtils.createToast(WsToastType.ERROR, e.response.data.message || WsMessage.INTERNAL_SERVER_ERROR)
        } finally {
            setLoading(false)
        }
    }

    const getMaterials = async () => {
        setLoading(true)
        try {
            const res = await AxiosApi.get(WsUrl.NO_AUTH_MATERIAL_NO_PAGE)
            const { data } = res
            if (data) {
                setMaterials(data)
            }
        } catch (e) {
            ToastUtils.createToast(WsToastType.ERROR, e.response.data.message || WsMessage.INTERNAL_SERVER_ERROR)
        } finally {
            setLoading(false)
        }
    }

    const getColor = async () => {
        try {
            const res = await AxiosApi.get(WsUrl.NO_AUTH_COLOR_NO_PAGE)
            const { data } = res
            if (data) {
                setColors(data)
            }
        } catch (e) {
            ToastUtils.createToast(WsToastType.ERROR, e.response.data.message || WsMessage.INTERNAL_SERVER_ERROR)
        }
    }
    const getSize = async () => {
        try {
            const res = await AxiosApi.get(WsUrl.NO_AUTH_SIZE_NO_PAGE)
            const { data } = res
            if (data) {
                setSizes(data)
            }
        } catch (e) {
            ToastUtils.createToast(WsToastType.ERROR, e.response.data.message || WsMessage.INTERNAL_SERVER_ERROR)
        }
    }

    const getCategories = async () => {
        try {
            console.log("getCategories() start")
            const res = await AxiosApi.get(WsUrl.NO_AUTH_CATEGORY_NO_PAGE)
            console.log("getCategories() res: ", res)
            const { data } = res
            if (data) {
                setCategories(data)
            }
        } catch (e) {
            ToastUtils.createToast(WsToastType.ERROR, e.response.data.message || WsMessage.INTERNAL_SERVER_ERROR)
        }
    }

    const handleSubmitForm = async values => {
        setLoading(true)
        console.log('handleSubmitForm() start with values: ', values);
        try {
            const payload = {
                ...values,
                id: id,
                options: options,
            }
            console.log("handleSubmitForm() payload: ", payload)
            const axiosRes = await AxiosApi.postAuth(WsUrl.ADMIN_PRODUCT_UPDATE, payload)
            if (axiosRes) {
                getProductById()
                ToastUtils.createToast(WsToastType.SUCCESS, WsMessage.UPDATE_SUCCESS)
            }
        } catch (e) {
            ToastUtils.createToast(WsToastType.ERROR, e.response.data.message || WsMessage.INTERNAL_SERVER_ERROR)
        } finally {
            setLoading(false)
        }

    }

    const handleChange = (key, index, isImage) => async (event) => {
        console.log('handleChange key - index - isImage: ', key, index, isImage);
        let data = [...options]
        try {
            if (isImage) {
                setDisableBtn(true)
                const file = event.target.files[0];
                const oldImage = data[index][key]
                console.log("handleChange() oldImage: ", oldImage);
                if (oldImage) {
                    AxiosApi.deleteAuth(`${WsUrl.DELETE_FILE}?url=${oldImage}`)
                }
                let formData = new FormData()
                formData.append('file', file)
                const axiosRes = await AxiosApi.postAuthFormData(WsUrl.FILE_UPLOAD_IMAGE, formData)
                console.log('axiosRes: ', axiosRes);
                if (axiosRes) {
                    data[index][key] = axiosRes.data
                }
            } else {
                const value = event.target.value
                console.log('handleChange() value: ', value);
                data[index][key] = value
            }
            setOptions(data)
        } catch (e) {
            ToastUtils.createToast(WsToastType.ERROR, e.response.data.message || WsMessage.INTERNAL_SERVER_ERROR)
        } finally {
            setDisableBtn(false)
        }

    }

    const handleDeleteOption = async (index, productId, optionId) => {
        console.log('handleDeleteOption() start with index, productId, optionId: ', index, productId, optionId)
        console.log('handleDeleteOption() options: ', options);
        try {
            setDisableBtn(true)
            const optionDeleted = options[index]
            console.log('handleDeleteOption() optionDeleted: ', optionDeleted);
            if (productId && optionId) {
                await AxiosApi.deleteAuth(`${WsUrl.ADMIN_PRODUCT_DELETE_OPTION}?productId=${productId}&optionId=${optionId}`)
            } else {
                await AxiosApi.deleteAuth(`${WsUrl.DELETE_FILE}?url=${optionDeleted.image}`)
            }
            var optionsClone = [...options]
            console.log('handleDeleteOption() optionsClone: ', optionsClone);
            optionsClone.splice(index, 1)
            console.log('handleDeleteOption() optionsClone splice: ', optionsClone);

            setOptions(optionsClone)
        } catch (e) {
            ToastUtils.createToast(WsToastType.ERROR, e.response.data.message || WsMessage.INTERNAL_SERVER_ERROR)
        } finally {
            setDisableBtn(false)
        }
    }

    const handleAddNewOption = () => {
        console.log('handleAddNewOption() options: ', options);
        const cloneOptions = [...options]
        cloneOptions.push({
            id: null,
            colorId: colors[0]?.id,
            sizeId: sizes[0]?.id,
            price: null,
            qty: null,
            image: null
        })
        console.log('handleAddNewOption() cloneOptions: ', cloneOptions);
        setOptions(cloneOptions)
    }

    return (
        <div className="container-fluid w-100 reponsive">
            <form className="card shadow mb-4" onSubmit={handleSubmit(handleSubmitForm)}>
                <div className="card-header py-3 d-flex align-items-center">
                    <Link to='/product' className=''><i className="fa fa-arrow-left" aria-hidden="true" /></Link>
                    <span className='mx-1'></span>
                    <h3 className="m-0 font-weight-bold text-primary">Chỉnh sửa sản phẩm</h3>
                </div>
                {loading ? <HashSpinner /> :
                    <div className="row card-body d-flex">
                        <div className='col-10'>
                            <div className='form-group'>
                                <b><label htmlFor="" className="form-label">Danh mục sản phẩm<span
                                    className='text-danger'>*</span></label></b>
                                <select className='form-control' {...register('categoryId')}>
                                    {categories && categories.map((obj, index) => (
                                        <option key={index} value={obj?.id}
                                            selected={obj?.id == product?.categoryId}>{obj?.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className='form-group'>
                                <b><label htmlFor="" className="form-label">Tên sản phẩm<span
                                    className='text-danger'>*</span></label></b>
                                <input type="input" className="form-control py-3"
                                    defaultValue={product?.name} {...register("name", {
                                        required: true,
                                        minLength: 4
                                    })} />
                                {errors.name && <>
                                    {errors.name.type === 'required' &&
                                        <span className='small text-danger'>Không được để trống</span>}
                                    {errors.name.type === 'minLength' &&
                                        <span className='small text-danger'>Độ dài phải lớn hơn 4 ký tự</span>}
                                    {errors.name.type === 'maxLength' &&
                                        <span className='small text-danger'>Độ dài phải nhỏ hơn 100 ký tự</span>} </>}
                            </div>
                            <div className='form-group'>
                                <b><label htmlFor="" className="form-label">Chất liệu<span
                                    className='text-danger'>*</span></label></b>
                                <select className='form-control' {...register('materialId')}>
                                    {materials && materials.map((obj, index) => (
                                        <option key={index} value={obj?.id}
                                            selected={obj?.id == product?.materialId}>{obj?.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className='form-group'>
                                <b><label htmlFor="" className="form-label">Mô tả<span className='text-danger'>*</span></label></b>
                                <textarea className='form-control' rows={6} {...register('des', {
                                    required: true,
                                    // maxLength: 250
                                })} defaultValue={product?.des}></textarea>
                                {errors.des &&
                                    <>
                                        {'required' === errors.des.type &&
                                            <span className='small text-danger'>Không được để trống</span>}
                                        {/* {'maxLength' === errors.des.type &&
                                            <span className='small text-danger'>Độ dài phải nhỏ hơn 250 ký tự</span>} */}
                                    </>}
                            </div>
                            {reviews && <div>
                                <a className="btn btn-outline-secondary" data-toggle="modal" data-target={`#reviewsModal${id}`}>
                                    Xem đánh giá
                                </a>
                                <div className="modal fade" id={`reviewsModal${id}`} tabIndex={-1} role="dialog">
                                    <div className="modal-dialog modal-lg" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id="exampleModalLabel">Danh sách đánh giá({reviews.length})</h5>
                                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">×</span>
                                                </button>
                                            </div>
                                            <div className="modal-body">
                                                {reviews.map((obj, index) => (
                                                    <div key={index}>
                                                        <div className="d-flex justify-content-between">
                                                            <b>{obj?.userFullName}</b>
                                                            <WSStar value={obj?.rating} />
                                                        </div>
                                                        <p>{obj?.content}</p>
                                                        <p className='small'>{obj?.createdDateFmt}</p>
                                                        <hr />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Đóng</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>}

                            <div className='mt-2'>
                                <b><label htmlFor="" className="form-label">Phân loại<span
                                    className='text-danger'>*</span></label></b>

                                <div className='table-responsive'>
                                    <table className="table table-bordered" id="dataTable" width="100%" cellSpacing={0}>
                                        <thead>
                                            <tr>
                                                <th className='text-center' style={{ maxWidth: '40px' }}>#</th>
                                                <th className=''>Màu</th>
                                                <th className=''>Size</th>
                                                <th className=''>Đơn giá</th>
                                                <th className=''>Số lượng</th>
                                                <th className=''>Ảnh</th>
                                                <th className='text-center'>Xóa</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {options && options.map((obj, index) => (
                                                <tr key={index} className=''>
                                                    <td className='text-center' style={{ maxWidth: '40px' }}>{index + 1}</td>
                                                    <td className=''>
                                                        <select className='form-control'
                                                            {...register(`options.${index}.colorId`)}
                                                            onChange={handleChange('colorId', index)} >
                                                            {colors && colors.map((color, index) => (
                                                                <option key={index} value={color?.id}
                                                                    selected={color?.id == obj?.colorId}>{color?.name}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td className=''>
                                                        <select className='form-control'
                                                            {...register(`options.${index}.sizeId`)}
                                                            onChange={handleChange('sizeId', index)} >
                                                            {sizes && sizes.map((size, index) => (
                                                                <option key={index} value={size?.id}
                                                                    selected={size?.id == obj?.sizeId}>{size?.name}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td className=''>
                                                        <input className='form-control' type='number'
                                                            defaultValue={obj?.price} {...register(`options.${index}.price`)}
                                                            onChange={handleChange('price', index)} />
                                                    </td>
                                                    <td className=''>
                                                        <input className='form-control' type='number'
                                                            defaultValue={obj?.qty} {...register(`options.${index}.qty`)}
                                                            onChange={handleChange('qty', index)} />
                                                    </td>
                                                    <td className='d-flex'>
                                                        <input className='form-control-file' type='file' multiple={false}
                                                            accept="image/*"
                                                            onChange={handleChange('image', index, true)} />
                                                        {obj?.image && <img src={obj?.image} style={{
                                                            objectFit: 'cover',
                                                            width: '80px',
                                                            height: '80px',
                                                            borderRadius: '50%'
                                                        }} />}
                                                        <input className='form-control' hidden defaultValue={obj?.image} {...register(`options.${index}.image`)} />
                                                    </td>
                                                    <td className='text-center'>
                                                        <button type='button' className='btn btn-outline-danger'
                                                            onClick={() => handleDeleteOption(index, id, obj?.id)}>
                                                            <i className="fa fa-trash fa-1x" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div>
                                        <button type='button' onClick={handleAddNewOption}
                                            className='btn btn-outline-primary mt-2'>Thêm
                                            phân loại</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>}
                <div className="card-footer d-flex justify-content-eight">
                    <input disabled={disableBtn} type='submit' className='btn btn-primary mt-2 px-4' value={'Lưu'} />
                </div>
            </form>
        </div>
    )
}

export default UpdateProductPage