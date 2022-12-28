import React from "react";
import { Link } from "react-router-dom";

const ButtonInfo = ({ title, link }) => {
  return (
    <Link to={`./${link}`} className="btn btn-info btn-icon-split">
      <span className="icon text-white-50">
        <i className="fas fa-info-circle"></i>
      </span>
      <span className="text">{title}</span>
    </Link>
  );
};

export default ButtonInfo;
