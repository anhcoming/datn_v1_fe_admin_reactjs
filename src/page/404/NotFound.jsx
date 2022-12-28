import React from "react";
import styles from "./NotFound.module.css";

const NotFound = () => {
  return (
    <div className="d-flex flex-column align-items-center">
      <div 
      className={styles.error} 
      data-text="404"
      >
        404
      </div>
      <p className=" text-gray-800 mb-5">Trang không tồn tại</p>
      <p className="text-gray-500 mb-0">
        Có vẻ như là bạn đã nhập sai đường dẫn...
      </p>
      <a href="/">&larr; Quay lại trang chủ</a>
    </div>
  );
};

export default NotFound;
