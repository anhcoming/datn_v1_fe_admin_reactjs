import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import LoginPage from "./page/login/LoginPage";
import AdminLayout from "./layout/AdminLayout";
import OrderPage from "./page/order/OrderPage";
import OrderDetailPage from "./page/order/OrderDetailPage";
import NotificationPage from "./page/notification/NotificationPage";
import UserListPage from "./page/user/UserListPage";
import NotFound from "./page/404/NotFound";
import DiscountListPage from "./page/discount/DiscountListPage";
import CreateDiscountPage from "./page/discount/CreateDiscountPage";
import "react-datepicker/dist/react-datepicker.css";
import DiscountDetailPage from "./page/discount/DiscountDetailPage";
import CategoryListPage from "./page/category/CategoryListPage";
import CreateCategoryPage from "./page/category/CreateCategoryPage";
import UpdateCategoryPage from "./page/category/UpdateCategoryPage";
import DashboardPage from "./page/dashboard/DashboardPage";
import Blog from "./page/blog/Blog";
import CreateBlog from "./page/blog/CreateBlog";
import BlogDetails from "./page/blog/BlogDetails";
import ProductRevenuePage from "./page/product_revenue/ProductRevenuePage";
import ProductRevenueChartPage from "./page/product_revenue/ProductRevenueChartPage";
import OverviewReportPage from "./page/report/overview/OverviewReportPage";
import ReportListPage from "./page/report/list/ReportListPage";
import CreateProductPage from "./page/product/CreateProductPage";
import ProductListPage from "./page/product/ProductListPage";
import RevenueDetailReportPage from "./page/report/revenue_detail/RevenueDetailReportPage";
import UserDetailReportPage from "./page/report/user_detail/UserDetailReportPage";
import CreateUserPage from "./page/user/CreateUserPage";
import UpdateUserPage from "./page/user/UpdateUserPage";
import Color from "./page/color/Color";
import Size from "./page/size/Size";
import UpdateProductPage from "./page/product/UpdateProductPage";
import CustomerRevenuePage from './page/customer_revenue/CustomerRevenuePage';
import DiscountRevenuePage from "./page/discount_revenue/DiscountRevenuePage";
import DiscountUpdatePage from "./page/discount/DiscountUpdatePage";


function App() {

  return (
    <div className="page-top">
      <div className="wrapper">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="" element={<AdminLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="order" element={<OrderPage />} />
            <Route path="order/:status" element={<OrderPage />} />
            <Route path="order/detail/:id" element={<OrderDetailPage />} />
            <Route path="user" element={<UserListPage />} />
            <Route path="user/create" element={<CreateUserPage />} />
            <Route path="user/detail/:id" element={<UpdateUserPage />} />
            <Route path="category" element={<CategoryListPage />} />
            <Route path="category/detail/:id" element={<UpdateCategoryPage />} />
            <Route path="category/create" element={<CreateCategoryPage />} />
            <Route path="color" element={<Color />} />
            <Route path="notification" element={<NotificationPage />} />
            <Route path="404" element={<NotFound />} />
            <Route path="discount" element={<DiscountListPage />} />
            <Route path="discount/create" element={<CreateDiscountPage />} />
            <Route path="discount/detail/:id" element={<DiscountUpdatePage />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/create" element={<CreateBlog />} />
            <Route path="blog/detail/:id" element={<BlogDetails />} />
            <Route path="product-revenue" element={<ProductRevenuePage />} />
            <Route path="product-revenue/chart" element={<ProductRevenueChartPage />} />
            <Route path="customer-revenue" element={<CustomerRevenuePage />} />
            <Route path="report/overview" element={<OverviewReportPage />} />
            <Route path="report/list" element={<ReportListPage />} />
            <Route path="product" element={<ProductListPage />} />
            <Route path="product/create" element={<CreateProductPage />} />
            <Route path="product/detail/:id" element={<UpdateProductPage />} />
            <Route path="report/revenue-detail" element={<RevenueDetailReportPage />} />
            <Route path="report/user-detail" element={<UserDetailReportPage />} />
            <Route path="size" element={<Size />} />
            <Route path="product-revenue" element={<ProductRevenuePage />} />
            <Route path="product-revenue-chart" element={<ProductRevenueChartPage />} />
            <Route path="discount-revenue" element={<DiscountRevenuePage />} />

          </Route>
        </Routes>
        <ToastContainer />
      </div>
    </div>
  );
}

export default App;
