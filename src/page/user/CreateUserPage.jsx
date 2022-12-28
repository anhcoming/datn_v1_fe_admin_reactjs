import React, { useState } from 'react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import AxiosApi from '../../api/AxiosApi'
import HashSpinner from '../../component/spinner/HashSpinner'
import WsMessage from '../../utils/constants/WsMessage'
import WsToastType from '../../utils/constants/WsToastType'
import WsUrl from '../../utils/constants/WsUrl'
import ToastUtils from '../../utils/ToastUtils'
import DatePicker from "react-datepicker";
import WSSelected from '../../component/selecte/WSSelected'

const CreateUserPage = () => {

    const { register, handleSubmit, formState: { errors } } = useForm()
    const [loading, setLoading] = useState(false)
    const [roles, setRoles] = useState([])
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [customerTypesSelected, setCustomerTypesSelected] = useState([])
    const [showCustomerTypeForm, setShowCustomerTypeForm] = useState(false)
    const [customerTypes, setCustomerTypes] = useState([])

    useEffect(() => {
        getRoles()
        getCustomerTypes()
        //
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
            const res = await AxiosApi.get(WsUrl.NO_AUTH_ROLE_MODIFY)
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

    const handleSubmitForm = async values => {
        setLoading(true)
        console.log('handleSubmitForm() start with values: ', values);
        const payload = {
            ...values,
            dob: selectedDate,
            customerTypeIds: customerTypesSelected && customerTypesSelected.map(obj => (obj.value)) 
        }
        console.log('handleSubmitForm() payload: ', payload);
        try {
            const resAxios = await AxiosApi.postAuth(WsUrl.ADMIN_USER_CREATE, payload)
            console.log("handleSubmitForm() resAxios: ", resAxios)
            if (resAxios) {
                ToastUtils.createToast(WsToastType.SUCCESS, WsMessage.CREATED_DONE)
            }
        } catch (e) {
            console.log("handleSubmitForm() error: ", e)
            ToastUtils.createToast(WsToastType.ERROR, e.response.data.message || WsMessage.INTERNAL_SERVER_ERROR, 2000)
        } finally {
            setLoading(false)
        }
    }

    const handleSelectedDateChange = e => {

    }

    const handleChangeRoleFilter = e => {
        const value = e.target.value
        console.log('handleChangeRoleFilter() value: ', value);
        if ('ROLE_CUSTOMER' == value) {
            setShowCustomerTypeForm(true)
        } else {
            setShowCustomerTypeForm(false)
        }
    }

    return (
        <div className="container-fluid w-100 reponsive">
            <form className="card shadow mb-4" onSubmit={handleSubmit(handleSubmitForm)}>
                <div className="card-header py-3 d-flex align-items-center">
                    <Link to='/user' className=''><i className="fa fa-arrow-left" aria-hidden="true" /></Link>
                    <span className='mx-1'></span>
                    <h3 className="m-0 font-weight-bold text-primary">Thêm mới người dùng</h3>
                </div>
                {loading ? <HashSpinner /> : <div className="card-body d-flex justify-content-between">
                    <div className='col-8'>
                        <div className='form-group'>
                            <b><label htmlFor="" className="form-label">Phân Quyền<span className='text-danger'>*</span></label></b>
                            <select className='border-1 form-control' {...register('role')} onChange={handleChangeRoleFilter}>
                                {roles && roles.map((obj, index) => (
                                    <option key={index} value={obj?.roleCode}>{obj?.roleName}</option>
                                ))}
                            </select>
                        </div>
                        {showCustomerTypeForm && <div className='form-group'>
                            <b><label htmlFor="" className="form-label">Loại khách hàng</label></b>
                            <WSSelected options={customerTypes.map(o => ({ label: o.name, value: o.id }))} selected={customerTypesSelected} setSelected={setCustomerTypesSelected} />
                        </div>}
                        <div className='form-group'>
                            <b><label htmlFor="" className="form-label">Họ<span className='text-danger'>*</span></label></b>
                            <input type="input" className="form-control py-3" {...register("firstName", { required: true, minLength: 4 })} />
                            {errors.firstName && <>
                                {errors.firstName.type === 'required' && <span className='small text-danger'>Không được để trống</span>}
                                {errors.firstName.type === 'minLength' && <span className='small text-danger'>Độ dài phải lớn hơn 4 ký tự</span>} </>}
                        </div>

                        <div className='form-group'>
                            <b><label htmlFor="" className="form-label">Tên<span className='text-danger'>*</span></label></b>
                            <input type="input" className="form-control py-3" {...register("lastName", { required: true, minLength: 4 })} />
                            {errors.lastName && <>
                                {errors.lastName.type === 'required' && <span className='small text-danger'>Không được để trống</span>}
                                {errors.lastName.type === 'minLength' && <span className='small text-danger'>Độ dài phải lớn hơn 4 ký tự</span>} </>}
                        </div>

                        <div className='form-group'>
                            <b><label htmlFor="" className="form-label">Email<span className='text-danger'>*</span></label></b>
                            <input type="email" className="form-control py-3" {...register("email", { required: true, minLength: 4 })} />
                            {errors.email && <>
                                {errors.email.type === 'required' && <span className='small text-danger'>Không được để trống</span>}
                                {errors.email.type === 'minLength' && <span className='small text-danger'>Độ dài phải lớn hơn 4 ký tự</span>} </>}
                        </div>

                        <div className='form-group'>
                            <b><label htmlFor="" className="form-label">Mật khẩu<span className='text-danger'>*</span></label></b>
                            <input type="password" className="form-control py-3" {...register("password", { required: true, minLength: 4 })} />
                            {errors.password && <>
                                {errors.password.type === 'required' && <span className='small text-danger'>Không được để trống</span>}
                                {errors.password.type === 'minLength' && <span className='small text-danger'>Độ dài phải lớn hơn 4 ký tự</span>} </>}
                        </div>

                        <div className='form-group'>
                            <b><label htmlFor="" className="form-label">Số điện thoại<span className='text-danger'>*</span></label></b>
                            <input className="form-control py-3" {...register("phone", { required: true, length: 10 })} />
                            {errors.phone && <>
                                {errors.phone.type === 'required' && <span className='small text-danger'>Không được để trống</span>}
                                {errors.phone.type === 'length' && <span className='small text-danger'>Độ dài phải là 10 ký tự</span>} </>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="" className="form-label">Ngày sinh<span className='text-danger'>*</span></label>
                            <DatePicker className='form-control' selected={selectedDate} onChange={date => setSelectedDate(date)} dateFormat="dd/MM/yyyy" maxDate={new Date()} />
                        </div>

                    </div>

                </div>}
                <div className="card-footer d-flex justify-content-eight">
                    <input type='submit' className='btn btn-primary mt-2 px-4' value={'Lưu'} />
                </div>
            </form>
        </div>)
}

export default CreateUserPage