import React from "react";

const Modal = ({ id, title, isOpen, onClose, children }) => {
  return (
    <div className={`modal ${isOpen ? "flex" : "hide"}`} id={id}>
      <div className="modal-content">
        <header className="modal-header">
          <h2>{title}</h2>
          <button className="btn-close" onClick={onClose}></button>
        </header>
        <main className="modal-body">{children}</main>
      </div>
    </div>
  );
};

export default Modal;
