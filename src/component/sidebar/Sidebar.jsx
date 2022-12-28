import React from "react";
import { Link, NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <ul
      className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
      id="accordionSidebar"
    >
      <a
        className="sidebar-brand d-flex align-items-center justify-content-center"
        href="/"
      >
        <div className="sidebar-brand-icon rotate-n-15">
          <i className="fas fa-laugh-wink" />
        </div>
        <div className="sidebar-brand-text mx-3">My Shop</div>
      </a>
      <hr className="sidebar-divider my-0" />
      <li className="nav-item active">
        <Link to="/" className="nav-link" href="index.html">
          <i className="fas fa-fw fa-tachometer-alt" />
          <span>Dashboard</span>
        </Link>
      </li>
      <hr className="sidebar-divider" />
      <div className="sidebar-heading">Management</div>
      <li className="nav-item">
        <a
          className="nav-link collapsed"
          href="#"
          data-toggle="collapse"
          data-target="#collapseTwo"
          aria-expanded="true"
          aria-controls="collapseTwo"
        >
          <i className="fas fa-fw fa-cog" />
          <span>Bán hàng</span>
        </a>
        <div
          id="collapseTwo"
          className="collapse"
          aria-labelledby="headingTwo"
          data-parent="#accordionSidebar"
        >
          <div className="bg-white py-2 collapse-inner rounded">
            <NavLink to="order" className="collapse-item">
              Danh sách đơn hàng
            </NavLink>
            <NavLink to="discount" className="collapse-item">
              Khuyến mãi
            </NavLink>
          </div>
        </div>
      </li>
      <li className="nav-item">
        <a
          className="nav-link collapsed"
          href="#"
          data-toggle="collapse"
          data-target="#collapseUtilities"
          aria-expanded="true"
          aria-controls="collapseUtilities"
        >
          <i className="fas fa-fw fa-wrench" />
          <span>Quản lý</span>
        </a>
        <div
          id="collapseUtilities"
          className="collapse"
          aria-labelledby="headingUtilities"
          data-parent="#accordionSidebar"
        >
          <div className="bg-white py-2 collapse-inner rounded">
            <NavLink to="./category" className="collapse-item">
              Danh mục sản phẩm
            </NavLink>
            <NavLink to="./product" className="collapse-item">
              Sản phẩm
            </NavLink>
            <NavLink to="./color" className="collapse-item">
              Màu sắc
            </NavLink> <NavLink to="./size" className="collapse-item">
              Kích cỡ
            </NavLink>
            <NavLink to="./user" className="collapse-item">
              Người dùng
            </NavLink>
            <NavLink className="collapse-item" to="./blog">
              Blog
            </NavLink>
          </div>
        </div>
      </li>
      <hr className="sidebar-divider" />
      <div className="sidebar-heading">Report</div>
      <li className="nav-item">
        <a
          className="nav-link collapsed"
          href="#"
          data-toggle="collapse"
          data-target="#collapsePages"
          aria-expanded="true"
          aria-controls="collapsePages"
        >
          <i className="fas fa-fw fa-chart-area" />
          <span>Báo cáo</span>
        </a>
        <div
          id="collapsePages"
          className="collapse"
          aria-labelledby="headingPages"
          data-parent="#accordionSidebar"
        >

          <div className="bg-white py-2 collapse-inner rounded">
            <NavLink to="./report/overview" className="collapse-item">
              Tổng quan báo cáo
            </NavLink>
            <h6 className="collapse-header">Doanh thu</h6>
            <NavLink to="./product-revenue" className="collapse-item">
              Theo sản phẩm
            </NavLink>
            <NavLink to="./customer-revenue" className="collapse-item">
              Theo khách hàng
            </NavLink>
            <NavLink to="./discount-revenue" className="collapse-item">
              Theo mã khuyến mãi
            </NavLink>
          </div>
        </div>
      </li>
    </ul>
  );
};

export default Sidebar;
