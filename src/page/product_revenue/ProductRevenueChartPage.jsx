import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import AxiosApi from '../../api/AxiosApi'
import WsDoughnutChart from '../../component/charts/WsDoughnutChart'
import WsPieChart from '../../component/charts/WsPieChart'
import WsMessage from '../../utils/constants/WsMessage'
import WsToastType from '../../utils/constants/WsToastType'
import WsUrl from '../../utils/constants/WsUrl'
import ToastUtils from '../../utils/ToastUtils'

const ProductRevenueChartPage = () => {
    const [loading, setLoading] = useState(true)
    const [revenues, setRevenues] = useState([])
    const [type, setType] = useState('pie')
    const [labels, setLabels] = useState([])
    const [data, setData] = useState([])

    useEffect(() => {
        setLoading(true)
        try {
            getReport()
        } catch (e) {
            console.log("Error: ", e)
            ToastUtils.createToast(WsToastType.ERROR, e.response.data.message || WsMessage.INTERNAL_SERVER_ERROR)
        } finally {
            setLoading(false)
        }
    }, [])

    const getReport = async () => {
        console.log("getReport() start");
        const axiosRes = await AxiosApi.postAuth(WsUrl.ADMIN_REPORT_REVENUE_BY_PRODUCT, {
            pageReq: {
                page: 0,
                pageSize: 999999,
                sortField: '',
                sortDirection: ''
            }
        })
        console.log('getReport() axiosRes: ', axiosRes);
        if (axiosRes) {
            const { data } = axiosRes
            // setRevenues(data)
            console.log("getReport() data: ", data.data);
            setLabels(data.data.map(o => (o.name)))
            setData(data.data.map(o => (o.revenue)))
        }
    }

    const handleChangeType = e => {
        const value = e.target.value
        console.log('handleChangeType() start with value: ', value);
        setType(value)
    }

    return (
        <div className="container-fluid w-100 reponsive">
            <div className="card shadow mb-4">
                <div className="card-header py-3 d-flex justify-content-between">
                    <h3 className="m-0 font-weight-bold text-primary">Doanh thu theo sản phẩm</h3>
                    <div className='d-flex justify-content-center'>
                        <NavLink to="/product-revenue" className="btn btn-outline-primary mx-2">
                            <i className="fas fa-fw fa-table" />
                        </NavLink>
                    </div>
                </div>
            </div>
            <div className="card-body">
                <div className='form-group col-2'>
                    <label htmlFor="">Dạng biểu đồ</label>
                    <select className='form-control' onChange={handleChangeType}>
                        <option value='pie'>PIE</option>
                        <option value='doughnut'>DOUGHNUT</option>
                    </select>
                </div>
                <div className='d-flex justify-content-center'>
                    <div className='col-4'>
                        {type === 'pie' && <WsPieChart labels={labels} data={data} />}
                        {type === 'doughnut' && <WsDoughnutChart labels={labels} data={data} />}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ProductRevenueChartPage