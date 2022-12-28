import React, { useEffect, useState } from 'react'
import AxiosApi from '../../../api/AxiosApi'
import WsMessage from '../../../utils/constants/WsMessage'
import WsToastType from '../../../utils/constants/WsToastType'
import WsUrl from '../../../utils/constants/WsUrl'
import ToastUtils from '../../../utils/ToastUtils'
import ReportTimeType from '../../../utils/constants/ReportTimeType'
import DatePicker from "react-datepicker";
import DateUtils from '../../../utils/common/DateUtils'
import WSDateFormat from '../../../utils/constants/WSDateFormat'
import FileService from '../../../service/FileService'
import HashSpinner from '../../../component/spinner/HashSpinner'

const initReq = {
    type: 'DAYS_AGO7',
    start: null,
    end: null,
}

const UserDetailReportPage = () => {
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [timeText, setTimeText] = useState(ReportTimeType.DAYS_AGO7)
    const [timeTypes, setTimeTypes] = useState([])
    const [loading, setLoading] = useState(false)
    const [timeTypeSelected, setTimeTypeSelected] = useState('DAYS_AGO7')
    const [selectedOptionTime, setSelectedOptionTime] = useState(false)
    const [total, setTotal] = useState(null)
    const [req, setReq] = useState(initReq)
    const [details, setDetails] = useState(null)
    const [direction, setDirection] = useState(null)

    useEffect(() => {
        getTimeTypes()
    }, [])

    useEffect(() => {
        getUserDetails()
    }, [req])

    const getTimeTypes = async () => {
        setLoading(true)
        try {
            const axiosRes = await AxiosApi.getAuth(WsUrl.ADMIN_REPORT_TIME_TYPE)
            console.log("getTimeTypes() res: ", axiosRes);
            if (axiosRes) {
                const { data } = axiosRes
                setTimeTypes(data)
            }
        } catch (e) {
            ToastUtils.createToast(WsToastType.ERROR, e.response.data.message || WsMessage.INTERNAL_SERVER_ERROR)
        } finally {
            setLoading(false)
        }
    }

    const getUserDetails = async () => {
        setLoading(true)
        try {
            console.log("getUserDetails() start with payload: ", req);
            const axiosRes = await AxiosApi.postAuth(WsUrl.ADMIN_REPORT_USER_DETAIL, req)
            console.log("getUserDetails() res: ", axiosRes);
            if (axiosRes) {
                const { data } = axiosRes
                setDetails(data.data)
                setTotal(data.total)
            }
        } catch (e) {
            ToastUtils.createToast(WsToastType.ERROR, e.response.data.message || WsMessage.INTERNAL_SERVER_ERROR)
        } finally {
            setLoading(false)
        }
    }

    const handleStartDateChange = date => {
        setSelectedOptionTime(true)
        setTimeTypeSelected(null)
        if (date > endDate) {
            setEndDate(date)
        }
        setStartDate(date)
    }

    const handleEndDateChange = date => {
        setSelectedOptionTime(true)
        setTimeTypeSelected(null)
        if (date < startDate) {
            setStartDate(date)
        }
        setEndDate(date)
    }

    const handleSubmit = async () => {
        const startDateStr = DateUtils.dateToString(startDate, WSDateFormat.F_DDMMYYYY)
        const endDateStr = DateUtils.dateToString(endDate, WSDateFormat.F_DDMMYYYY)
        const payload = {
            'type': timeTypeSelected || null,
            'start': startDateStr,
            'end': endDateStr,
        }
        console.log('handleSummitType start with payload: ', payload);
        setReq(payload)
        if (timeTypeSelected) {
            setTimeText(ReportTimeType?.[timeTypeSelected])
        } else {
            setTimeText(`${startDateStr} - ${endDateStr}`)
        }
    }

    const handleChangeTimeType = e => {
        setSelectedOptionTime(false)
        const value = e.target.value
        console.log('handleChangeTimeType() value: ', value);
        setTimeTypeSelected(value)
    }

    const handleExport = async () => {
        console.log("handleExport() start with payload: ", req);
        setLoading(true)
        try {
            const axiosRes = await AxiosApi.postAuthExport(WsUrl.ADMIN_REPORT_USER_DETAIL_EXPORT, req)
            if (axiosRes) {
                FileService.saveByteArray(axiosRes, 'Baocaokhachhang')
            }
        } catch (e) {
            console.log("handleExport() error: ", e);
            ToastUtils.createToast(WsToastType.ERROR, WsMessage.EXPORT_FAILED, 2000)
        } finally {
            setLoading(false)
        }
    }

    const handleChangeDirection = e => {
        const value = e.target.value
        console.log('handleChangeDirection() start with value: ', value);
        setReq({
            ...req,
            direction: value
        })
    }


    return (
        <div className="container-fluid w-100 reponsive">
            <div className="card shadow mb-4">
                <div className="card-header py-3 d-flex justify-content-between">
                    <h3 className="m-0 font-weight-bold text-primary">Khách hàng theo thời gian</h3>
                </div>
                <div className="card-body">
                    <div className='mb-3 d-flex justify-content-between'>
                        <div className='d-flex align-items-center'>
                            <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#timeModal">
                                Thời gian
                            </button>
                            <span className='mx-2'>{timeText}</span>

                            <div className="modal fade" id="timeModal" tabIndex={-1} role="dialog">
                                <div className="modal-dialog modal-lg" role="document">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="timeModal">Chọn thời gian</h5>
                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">×</span>
                                            </button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="form-group mb-2">
                                                <label htmlFor="">Khoảng thời gian</label>
                                                <select className='form-control' onChange={handleChangeTimeType}>
                                                    <option selected={selectedOptionTime} value="">---Tùy chọn---</option>
                                                    {timeTypes?.map((obj, index) => (
                                                        <option key={index} value={obj.code}>{obj.value}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <hr />
                                            <div className="form-group mb-2 d-flex justify-content-between">
                                                <div className=''>
                                                    <label htmlFor="">Bắt đầu</label>
                                                    <DatePicker className='form-control btn btn-outline-primary' selected={startDate} onChange={handleStartDateChange} dateFormat="dd/MM/yyyy" maxDate={new Date()} />
                                                </div>
                                                <div className=''>
                                                    <label htmlFor="">Kết thúc</label>
                                                    <DatePicker className='form-control btn btn-outline-primary' selected={endDate} onChange={handleEndDateChange} dateFormat="dd/MM/yyyy" maxDate={new Date()} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button className="btn btn-secondary" data-dismiss="modal">Hủy</button>
                                            <button className="btn btn-primary" data-dismiss="modal" onClick={handleSubmit}>Áp dụng</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button type="button" className="btn btn-primary" onClick={handleExport}>
                            <i className="fas fa-download fa-sm text-white-50" /> Xuất File
                        </button>
                    </div>
                    <hr />
                    <div className='d-flex justify-content-between align-items-center'>
                        <div className=''><b><h6>Tổng số lượng khách hàng: {total}</h6></b></div>
                        <div className='form-group col-2 d-flex justify-content-between align-items-center'>
                            <select className='form-control' onChange={handleChangeDirection}>
                                <option value='asc'>Cũ nhất</option>
                                <option value='desc'>Mới nhất</option>
                            </select>
                        </div>
                    </div>
                    <div className='table-responsive'>
                        <table className="table table-bordered mt-2" id="dataTable" width="100%" cellSpacing={0}>
                            <thead>
                                <tr className='text-bold text-dark'>
                                    <th className=''>Thời gian</th>
                                    <th className=''>Số lượng khách hàng mới</th>
                                </tr>
                            </thead>
                            {loading ? <HashSpinner /> : <tbody>
                                {details?.map((obj, index) => (
                                    <tr key={index}>
                                        <td>{obj?.time}</td>
                                        <td>{obj?.total}</td>
                                    </tr>
                                ))}
                            </tbody>}
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserDetailReportPage