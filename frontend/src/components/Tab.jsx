import React from "react";

const Tab = ({ label, isActive, onClick }) => {
    return (
        <button
        className={`admin-tab-btn ${isActive ? 'active' : ""}`}
        onClick={onClick}
        >
            {label}
        </button>
    );
};

export default Tab;