import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import AxiosApi from '../../api/AxiosApi'
import WsUrl from '../../utils/constants/WsUrl'
import HashSpinner from "../../component/spinner/HashSpinner";

const OrderDetailPage = () => {

    const [detail, setDetail] = useState({})
    const [loading, setLoading] = useState(false)

    const { id } = useParams()

    console.log("id: ", id)

    useEffect(() => {
        const fetchDetail = async () => {
            setLoading(true)
            const axiosRes = await AxiosApi.getAuth(`${WsUrl.ADMIN_ORDER_DETAIL}?id=${id}`)
            if (axiosRes) {
                setDetail(axiosRes.data)
                setLoading(false)
            }
        }
        fetchDetail()
    }, [id])

    return (
        <>
            {loading ? <HashSpinner /> :
                <div className="container-fluid">
                    <div className="card shadow mb-4">
                        <div className="card-header py-3 d-flex align-items-center">
                            <Link to='/order' className=''><i className="fa fa-arrow-left" aria-hidden="true" /></Link>
                            <span className='mx-1'></span>
                            <h3 className="m-0 font-weight-bold text-primary">Chi tiết đơn hàng</h3>
                        </div>
                        <div className="card-body">
                            <h6 className='text-dark'><b>1. Thông tin chung</b></h6>
                            <ul>
                                <li>Trạng thái: {detail?.statusName}</li>
                                <li>Mã đơn hàng: {detail?.code}</li>
                                <li>Khách hàng: <Link to={`/user/detail/${detail?.customerId}`}>{detail?.customerName}</Link></li>
                                <li>SĐT: {detail?.phone}</li>
                                <li>Tên người nhận: {detail?.nameOfRecipient}</li>
                                <li>Địa chỉ giao: {detail?.addressCombination}</li>
                                <li>Loại thanh toán: {detail?.paymentName} {detail.payed && '(Đã thanh toán)'}</li>
                                <li>Phương thức vận chuyển: {detail?.shipMethod}</li>
                                <li>Mã khuyến mãi:

                                    <span className="mx-2 link text-primary" data-toggle="modal" data-target={`#discount${detail?.discountId}`}>
                                        {detail?.discountCode}
                                    </span>
                                    <div className="modal fade" id={`discount${detail?.discountId}`} tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                        <div className="modal-dialog" role="document">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title text-primary" id="exampleModalLabel">{detail?.discountCode}</h5>
                                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">×</span>
                                                    </button>
                                                </div>
                                                <div className="modal-body">
                                                    {detail.discountDes && detail.discountDes.map((obj, index) => (
                                                        <p key={index}>{obj}</p>
                                                    ))}
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Đóng</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                </li>
                                <li>Ghi chú: {detail?.note}</li>
                            </ul>
                            <hr className='mt-4' />


                            <h6 className='text-dark'><b>2. Lịch sử đơn hàng</b></h6>
                            <ul>
                                {detail.history && detail.history.map((obj, index) => (
                                    <li key={index} className='mt-2'>{obj}</li>
                                ))}
                            </ul>
                            <hr className='mt-4' />

                            <h6 className='text-dark'><b>3. Sản phẩm</b></h6>
                            <table className="table table-bordered mt-4" id="dataTable" width="100%" cellSpacing={0}>
                                <thead>
                                    <tr className='text-bold text-dark'>
                                        <th className='text-center' style={{ width: '10px' }}>No</th>
                                        <th>Sản phẩm</th>
                                        <th>Size</th>
                                        <th>Màu sắc</th>
                                        <th>Chất liệu</th>
                                        <th>Đơn giá</th>
                                        <th>Số lượng</th>
                                        <th>Giảm giá</th>
                                        <th>Tổng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detail.items && detail.items.map((obj, index) => (
                                        <tr key={index}>
                                            <td className='text-center' style={{ width: '10px' }}>{index + 1}</td>
                                            <td>{obj?.productName}</td>
                                            <td>{obj?.size}</td>
                                            <td>{obj?.color}</td>
                                            <td>{obj?.materialName}</td>
                                            <td>{obj?.priceFmt}</td>
                                            <td>{obj?.qty}</td>
                                            <td>{obj?.discountFmt}</td>
                                            <td>{obj?.totalFmt}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan={5} className='text-left'><b>Tạm tính</b></td>
                                        <td>{detail?.totalPriceItemsFmt}</td>
                                        <td>{detail?.totalQtyItems}</td>
                                        <td>{detail?.totalDiscountItemsFmt}</td>
                                        <td>{detail?.totalItemsFmt}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={5} className='text-left'><b>Vận chuyển</b></td>
                                        <td>{detail?.shipPriceFmt}</td>
                                        <td></td>
                                        <td>{detail?.shipDiscountFmt}</td>
                                        <td>{detail?.shipTotalFmt}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={5} className='text-left'><b>Tổng tiền</b></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>{detail?.totalFmt}</td>
                                    </tr>
                                </tfoot>
                            </table>
                            {/* <hr className='mt-4' />
                            <h6 className='text-dark'><b>4. Khuyến mãi</b></h6>
                            <ul>
                                <li>Mã khuyến mãi: {detail?.discountCode}</li>
                                <li>Chi tiết:</li>
                                <ul>
                                    {detail.discountDes && detail.discountDes.map((obj, index) => (
                                        <li key={index}>{obj}</li>
                                    ))}
                                </ul>
                            </ul> */}
                        </div>
                    </div>
                </div>}</>
    )
}

export default OrderDetailPage