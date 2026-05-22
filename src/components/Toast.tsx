"use client";

import React from "react";

interface ToastProps {
  message: string | null;
}

export default function Toast({ message }: ToastProps) {
  return (
    <div className="toast-container" id="toast-container">
      <div className={`toast ${message ? "show" : ""}`} id="toast-message">
        <i className="fa-solid fa-circle-info"></i>
        <span id="toast-text">{message || ""}</span>
      </div>
    </div>
  );
}
