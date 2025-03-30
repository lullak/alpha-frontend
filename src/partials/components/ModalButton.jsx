import React from "react";

const ModalButton = ({ type, target, text, onClick }) => {
  return (
    <button
      type="button"
      data-modal="true"
      data-target={target}
      className={`btn btn-${type}`}
      onClick={onClick}
    >
      <span>{text}</span>
    </button>
  );
};

export default ModalButton;
