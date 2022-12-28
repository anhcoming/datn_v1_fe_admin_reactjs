export default {
    /**base*/
    BASEV1: 'http://localhost:8080/api/v1',
    BASEV2: 'http://localhost:8080/api/v2',
    LOGIN: 'http://localhost:8080/api/v1/login',

    // BASEV1: 'https://ws-master-server.herokuapp.com/api/v1',
    // BASEV2: 'https://ws-master-server.herokuapp.com/api/v2',
    // LOGIN: 'https://ws-master-server.herokuapp.com/api/v1/login',

    GHN_BASE: 'https://online-gateway.ghn.vn/shiip/public-api/master-data',
    ADMIN_WEB_SOCKET: 'http://localhost:8080/ws',

    /**page*/
    LOGIN_PAGE: '/login',
    DASHBOARD_PAGE: "/",

    /**layout*/
    ADMIN_LAYOUT: '',

    /**order*/
    ADMIN_ORDER_SEARCH: "/admin/order/search",
    ADMIN_ORDER_DETAIL: "/admin/order/detail",
    ADMIN_ORDER_CHANGE_STATUS: "/admin/order/change-status",

    /**user*/
    ADMIN_USER_SEARCH: "/admin/user/search",
    ADMIN_USER_DETAIL: "/admin/user/detail",
    ADMIN_USER_CHANGE_STATUS: "/admin/user/change-status",
    ADMIN_USER_CREATE: "/admin/user/create",
    ADMIN_USER_DELETE: "/admin/user/delete",
    ADMIN_USER_UPDATE: "/admin/user/update",

    ADMIN_DASHBOARD: '/admin/dashboard',
    ADMIN_DASHBOARD_REPORT: '/admin/dashboard/report',
    ADMIN_DASHBOARD_CATEGORY_REVENUE: '/admin/dashboard/category-revenue',
    ADMIN_DASHBOARD_WEEK_REVENUE: '/admin/dashboard/week-revenue',
    ADMIN_NOTIFICATION: '/admin/notification',
    ADMIN_NOTIFICATION_TOP3: '/admin/notification/top3',
    ADMIN_NOTIFICATION_SEARCH: '/admin/notification/search',
    ADMIN_NOTIFICATION_READ_ALL: '/admin/notification/read-all',
    ADMIN_NOTIFICATION_READ: '/admin/notification/read',

    ADMIN_DISCOUNT_SEARCH: '/admin/discount/search',
    ADMIN_DISCOUNT_CREATE: '/admin/discount/create',
    ADMIN_DISCOUNT_DELETE: '/admin/discount/delete',
    ADMIN_DISCOUNT_DETAIL: '/admin/discount/detail',

    CATEGORY_NO_PAGE: '/category/no-page',

    PRODUCT_NO_PAGE: '/product/no-page',
    PRODUCT_NO_CATEGORY_UPDATE: '/admin/product/no-category-update',
    CUSTOMER_TYPE_NO_PAGE: '/customer-type/no-page',
    CUSTOMER_NO_PAGE: '/customer/no-page',

    /**Category*/
    ADMIN_CATEGORY_SEARCH: "/admin/category/search",
    ADMIN_CATEGORY_CREATE: "/admin/category/create",
    ADMIN_CATEGORY_DELETE: "/admin/category/delete",
    ADMIN_CATEGORY_DETAIL: "/admin/category/detail",
    ADMIN_CATEGORY_UPDATE: "/admin/category/update",
    ADMIN_CATEGORY_CHANGE_STATUS: "/admin/category/change-status",

    /**report*/
    ADMIN_REPORT_REVENUE_BY_PRODUCT: "/admin/report/revenue/product",
    ADMIN_REPORT_REVENUE_BY_PRODUCT_EXPORT: "/admin/report/revenue/product/export",
    ADMIN_REPORT_TIME_TYPE: "/admin/report/time-type",
    ADMIN_REPORT_OVERVIEW: '/admin/report/overview',
    ADMIN_REPORT_REVENUE_DETAIL: '/admin/report/revenue-detail',
    ADMIN_REPORT_REVENUE_DETAIL_EXPORT: '/admin/report/revenue-detail/export',
    ADMIN_REPORT_USER_DETAIL: '/admin/report/user-detail',
    ADMIN_REPORT_USER_DETAIL_EXPORT: '/admin/report/user-detail/export',
    ADMIN_REPORT_REVENUE_BY_CUSTOMER: "/admin/report/revenue/customer",
    ADMIN_REPORT_REVENUE_BY_CUSTOMER_EXPORT: "/admin/report/revenue/customer/export",
    ADMIN_REPORT_REVENUE_BY_DISCOUNT: "/admin/report/revenue/discount",
    ADMIN_REPORT_REVENUE_BY_DISCOUNT_EXPORT: "/admin/report/revenue/discount/export",

    // product 
    ADMIN_PRODUCT_SEARCH: '/admin/product/search',
    ADMIN_PRODUCT_CREATE: '/admin/product/create',
    ADMIN_PRODUCT_CHANGE_STATUS: '/admin/product/change-status',
    ADMIN_PRODUCT_DELETE: '/admin/product/delete',
    ADMIN_PRODUCT_DETTAIL: '/admin/product/detail',
    ADMIN_PRODUCT_DELETE_OPTION: '/admin/product/delete-option',
    ADMIN_PRODUCT_UPDATE: '/admin/product/update',
    ADMIN_PRODUCT_NO_CATEGORY: '/admin/product/no-category',
    ADMIN_PRODUCT_NO_CATEGORY_UPDATE: '/admin/product/no-category-update',


    //color
    ADMIN_PRODUCT_COLOR: '/color',
    ADMIN_PRODUCT_COLOR_V2: '/admin/color',

    ADMIN_COLOR_DETAIL: '/admin/color/detail',
    ADMIN_COLOR_CREATE: '/admin/color/create',
    ADMIN_COLOR_UPDATE: '/admin/color/update',
    ADMIN_DELETE_COLOR: '/admin/color/delete',
    ADMIN_CHANGE_STATUS_COLOR: '/admin/color/change-status',
    ADMIN_COLOR_SEARCH: '/admin/color/search',

    //size
    ADMIN_SIZE_DETAIL: '/admin/size/detail',
    ADMIN_SIZE_CREATE: '/admin/size/create',
    ADMIN_SIZE_UPDATE: '/admin/size/update',
    ADMIN_SIZE_DELETE: '/admin/size/delete',
    ADMIN_SIZE_CHANGE_STATUS: '/admin/size/change-status',
    ADMIN_SIZE_SEARCH: '/admin/size/search',

    //blog
    ADMIN_BLOG: '/blog',
    ADMIN_CREATE_BLOG: '/blog/create',
    ADMIN_DETAIL_BLOG: '/blog/detail',
    ADMIN_UPDATE_BLOG: '/blog/update',
    ADMIN_CHANGE_STATUS_BLOG: '/blog/change-status',
    ADMIN_DELETE_BLOG: '/blog/delete',
    ADMIN_BLOG_SEARCH: '/blog/search',


    //topic
    ADMIN_TOPIC: '/topic',
    ADMIN_PRODUCT_SIZE: '/size',

    /**no-auth*/
    NO_AUTH_ROLE_SEARCH: 'role/search',
    NO_AUTH_ROLE_MODIFY: 'role/modify',
    NO_AUTH_CATEGORY_NO_PAGE: 'category/no-page',
    NO_AUTH_SIZE_NO_PAGE: 'size/no-page',
    NO_AUTH_COLOR_NO_PAGE: 'color/no-page',
    NO_AUTH_MATERIAL_NO_PAGE: 'material/no-page',
    NO_AUTH_TYPE_NO_PAGE: 'type/no-page',

    /**file*/
    FILE_UPLOAD_IMAGE: '/file/upload/image',
    DELETE_FILE: '/file/delete'
}