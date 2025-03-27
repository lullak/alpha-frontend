import React from "react";

const ModalButton = ({ type, target, text }) => {
  return (
    <button
      type="button"
      data-modal="true"
      data-target={target}
      className={`btn btn-${type}`}
    >
      <span>{text}</span>
    </button>
  );
};

export default ModalButton;
