import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import DatePicker from "react-datepicker";
import DateUtils from '../../../utils/common/DateUtils';
import WSDateFormat from '../../../utils/constants/WSDateFormat';
import { useEffect } from 'react';
import ToastUtils from '../../../utils/ToastUtils';
import WsToastType from '../../../utils/constants/WsToastType';
import WsMessage from '../../../utils/constants/WsMessage';
import AxiosApi from '../../../api/AxiosApi';
import WsUrl from '../../../utils/constants/WsUrl';
import HashSpinner from '../../../component/spinner/HashSpinner';
import WsLineChart from '../../../component/charts/WsLineChart';
import ReportTimeType from '../../../utils/constants/ReportTimeType';

const initReq = {
    type: 'TODAY',
    start: null,
    end: null
}

const OverviewReportPage = () => {
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [times, setTimes] = useState([])
    const [loading, setLoading] = useState(false)
    const [type, setType] = useState()
    const [revenues, setRevenues] = useState([])
    const [users, setUsers] = useState([])
    const [data, setData] = useState()
    const [selectOptionTime, setSelectOptionTime] = useState(false)
    const [req, setReq] = useState(initReq)
    const [timeText, setTimeText] = useState(null)

    useEffect(() => {
        getTimes()
    }, [])

    useEffect(() => {
        getReportOverview()
    }, [req])

    const getReportOverview = async () => {
        console.log('getReportOverview() start with payload: ', req);
        setLoading(true)
        try {
            const axiosRes = await AxiosApi.postAuth(WsUrl.ADMIN_REPORT_OVERVIEW, req)
            console.log('getReportOverview() axiosRes: ', axiosRes);
            if (axiosRes) {
                const { data } = axiosRes
                setData(data)
                setRevenues(data.revenues)
                setUsers(data.users)
            }

        } catch (e) {
            ToastUtils.createToast(WsToastType.ERROR, e.response.data.message || WsMessage.INTERNAL_SERVER_ERROR)
        } finally {
            setLoading(false)
        }
    }

    const getTimes = async () => {
        setLoading(true)
        try {
            const axiosRes = await AxiosApi.getAuth(WsUrl.ADMIN_REPORT_TIME_TYPE)
            console.log("getTimes() res: ", axiosRes);
            if (axiosRes) {
                const { data } = axiosRes
                setTimes(data)
            }
        } catch (e) {
            ToastUtils.createToast(WsToastType.ERROR, e.response.data.message || WsMessage.INTERNAL_SERVER_ERROR)
        } finally {
            setLoading(false)
        }
    }

    const handleStartDateChange = date => {
        setSelectOptionTime(true)
        setType(null)
        if (date > endDate) {
            console.log('handleStartDateChange() if');
            setEndDate(date)
        }
        setStartDate(date)

    }, handleEndDateChange = date => {
        setSelectOptionTime(true)
        setType(null)
        if (date < startDate) {
            console.log('handleEndDateChange() if');
            setStartDate(date)
        }
        setEndDate(date)
    }, handleSubmit = async () => {
        const startDateStr = DateUtils.dateToString(startDate, WSDateFormat.F_DDMMYYYY)
        const endDateStr = DateUtils.dateToString(endDate, WSDateFormat.F_DDMMYYYY)
        const payload = {
            type: type || null,
            start: startDateStr,
            end: endDateStr,
        }
        console.log('handleSummitType start with payload: ', payload);
        setReq(payload)
        if (type) {
            setTimeText(ReportTimeType?.[type])
        } else {
            setTimeText(`${startDateStr} - ${endDateStr}`)
        }

    }, handleChangeTimeType = e => {
        setSelectOptionTime(false)
        const value = e.target.value
        console.log('handleChangeTimeType() value: ', value);
        setType(value)
    }

    return (
        <div className="container-fluid w-100 reponsive">
            <div className="card shadow mb-4">
                <div className="card-header py-3 d-flex justify-content-between">
                    <h3 className="m-0 font-weight-bold text-primary">Tổng quan báo cáo</h3>
                </div>
                <div className="card-body">
                    <div className='mb-3 d-flex align-items-center'>
                        <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exportModal">
                            Thời gian
                        </button>
                        <div className="modal fade" id="exportModal" tabIndex={-1} role="dialog">
                            <div className="modal-dialog modal-lg" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exportModal">Chọn thời gian</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">×</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="form-group mb-2">
                                            <label htmlFor="">Khoảng thời gian</label>
                                            <select className='form-control' onChange={handleChangeTimeType}>
                                                <option selected={selectOptionTime} value="">---Tùy chọn---</option>
                                                {times && times.map((obj, index) => (
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
                        <span className='mx-2'>{timeText}</span>
                    </div>

                    {loading ? <HashSpinner /> :
                        <div className='row d-flex py-1 align-items-stretch'>
                            <div className='col'>
                                <div className="card">
                                    <div className="card-header">
                                        <h4 className='text-dark'>Tổng doanh thu: <span className='text-success'>{data?.revenueTotalFmt}</span></h4>
                                    </div>
                                    <div className="card-body">
                                        {revenues ? <WsLineChart title='Doanh thu theo thời gian' label='DOANH THU' labels={revenues?.map(o => o.time)} data={revenues?.map(o => o.total)} /> : <span>Không có dữ liệu</span>}
                                    </div>
                                    <div className="card-foot p-3 d-flex justifyc-content-right">
                                        <Link to='/report/revenue-detail'>Xem thêm...</Link>
                                    </div>
                                </div>

                            </div>
                            <div className='col'>
                                <div className="card">
                                    <div className="card-header">
                                        <h4 className='text-dark'>Khách hàng mới: <span className='text-info'>{data?.userTotal}</span></h4>
                                    </div>
                                    <div className="card-body">
                                        {users ? <WsLineChart title='Khách hàng theo thời gian' label='KHÁCH HÀNG' labels={users?.map(o => o.time)} data={users?.map(o => parseInt(o.total))} /> : <span>Không có dữ liệu</span>}
                                    </div>
                                    <div className="card-foot p-3 d-flex justifyc-content-right">
                                        <Link to='/report/user-detail'>Xem thêm...</Link>
                                    </div>
                                </div>

                            </div>
                        </div>
                    }
                </div>
            </div >
        </div>
    )
}

export default OverviewReportPage