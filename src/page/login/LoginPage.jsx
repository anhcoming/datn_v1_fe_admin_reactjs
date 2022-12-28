import axios from 'axios'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import WsUrl from '../../utils/constants/WsUrl'
import ToastUtils from '../../utils/ToastUtils'
import AuthService from "../../service/AuthService";
import WsField from "../../utils/constants/WsField";
import WsToastType from "../../utils/constants/WsToastType";
import WsMessage from "../../utils/constants/WsMessage";
import WSCode from "../../utils/constants/WSCode";

const LoginPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const navigate = useNavigate()

    const handleLogin = async values => {
        const formData = new FormData()


        formData.append(WsField.EMAIL, values.email);
        formData.append(WsField.PASSWORD, values.password);

        try {
            const res = await axios.post(WsUrl.LOGIN, formData)
            if (res.status == WSCode.OK) {
                const { accessToken, refreshToken } = res.data
                const isLoginSuccess = AuthService.login(accessToken, refreshToken);
                if (isLoginSuccess) {
                    ToastUtils.createToast(WsToastType.SUCCESS, WsMessage.LOGIN_SUCCESS)
                    setTimeout(() => {
                        navigate("/")
                    }, 2000)
                } else {
                    ToastUtils.createToast(WsToastType.ERROR, WsMessage.LOGIN_FAILED)
                }
            }
        } catch (e) {
            ToastUtils.createToast(WsToastType.ERROR, WsMessage.LOGIN_FAILED)
        }
    }


    return (
        <div classname="container">
            <div classname="row justify-content-center">
                <div className="card-body p-0">
                    <div className="col-4 mx-auto">
                        <div className="p-5">
                            <div className="text-center">
                                <h1 className="h4 text-gray-900 mb-4">Welcome Back!</h1>
                            </div>
                            <form className="user" onSubmit={handleSubmit(handleLogin)}>
                                <div className="form-group">
                                    <input
                                        type="email"
                                        className="form-control form-control-user"
                                        id="exampleInputEmail"
                                        aria-describedby="emailHelp"
                                        placeholder="Email..."
                                        {...register("email", { required: true })} />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="password"
                                        className="form-control form-control-user"
                                        id="exampleInputPassword"
                                        placeholder="Password..."
                                        {...register("password", { required: true })} />
                                </div>
                                <hr />

                                {/* <div className="form-group">
                                    <div className="custom-control custom-checkbox small">
                                        <input type="checkbox" className="custom-control-input" id="customCheck"/>
                                        <label className="custom-control-label" htmlFor="customCheck">Remember
                                            Me</label>
                                    </div>
                                </div> */}
                                <input type='submit' className="btn btn-primary btn-user btn-block" value='Đăng nhập' />
                            </form>
                            {/* <div className="text-right">
                                <a className="small" href="forgot-password.html">Quên mật khẩu?</a>
                            </div> */}
                            {/* <div className="text-center">
                                <a className="small" href="register.html">Create an Account!</a>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage