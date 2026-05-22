"use client";

import React, { useState } from "react";

interface WelcomeScreenProps {
  onGotoPin: () => void;
  onShowToast: (message: string) => void;
  onScanQRClick: () => void;
  onMetroClick: () => void;
}

export default function WelcomeScreen({
  onGotoPin,
  onShowToast,
  onScanQRClick,
  onMetroClick,
}: WelcomeScreenProps) {
  const [isAccountVisible, setIsAccountVisible] = useState(false);

  const handleToggleAccount = () => {
    setIsAccountVisible(!isAccountVisible);
    onShowToast(
      !isAccountVisible ? "Número de cuenta visible" : "Número de cuenta ocultado"
    );
  };

  return (
    <div className="app-screen" id="screen-welcome">
      <div className="welcome-header">
        <img src="/logo.png" className="welcome-logo-img" alt="Deuna logo" />
      </div>

      <div className="welcome-qr-section">
        <div className="qr-frame-container">
          <div className="qr-frame-corner qr-top-left"></div>
          <div className="qr-frame-corner qr-top-right"></div>
          <div className="qr-frame-corner qr-bottom-left"></div>
          <div className="qr-frame-corner qr-bottom-right"></div>

          <div className="qr-code-display">
            <img
              src="/qr.png"
              className="qr-code-img"
              width="200"
              height="200"
              alt="QR code"
            />
          </div>
        </div>

        <p className="welcome-qr-hint">Usa este QR o Nro de cuenta para cobrar</p>
        <div className="welcome-account-row">
          <span className="welcome-account-label">
            Nro.{" "}
            <span>
              {isAccountVisible ? "0109927833" : "******7833"}
            </span>
          </span>
          <i
            className={`fa-solid ${isAccountVisible ? "fa-eye" : "fa-eye-slash"}`}
            onClick={handleToggleAccount}
            style={{ cursor: "pointer" }}
          ></i>
        </div>
      </div>

      <div className="welcome-actions-row">
        <div className="welcome-shortcut-card" onClick={onMetroClick}>
          <div className="shortcut-icon-wrapper">
            <i className="fa-solid fa-train-subway"></i>
          </div>
          <span>Metro UIO</span>
        </div>
        <div className="welcome-shortcut-card" onClick={onScanQRClick}>
          <div className="shortcut-icon-wrapper">
            <i className="fa-solid fa-qrcode"></i>
          </div>
          <span>Escanear QR</span>
        </div>
      </div>

      <div className="welcome-footer">
        <button className="btn-enter-app" onClick={onGotoPin}>
          Ingresar a Deuna
        </button>
      </div>
    </div>
  );
}
