"use client";

import React, { useState } from "react";

interface PinScreenProps {
  onBack: () => void;
  onLoginSuccess: () => void;
  onShowToast: (message: string) => void;
}

export default function PinScreen({ onBack, onLoginSuccess, onShowToast }: PinScreenProps) {
  const [enteredPin, setEnteredPin] = useState<string[]>([]);

  const handleKeyClick = (val: string) => {
    if (enteredPin.length < 4) {
      const newPin = [...enteredPin, val];
      setEnteredPin(newPin);

      if (newPin.length === 4) {
        setTimeout(() => {
          onLoginSuccess();
          onShowToast("¡Acceso exitoso! Bienvenido Edison");
          setEnteredPin([]);
        }, 400);
      }
    }
  };

  const handleDelete = () => {
    if (enteredPin.length > 0) {
      setEnteredPin(enteredPin.slice(0, -1));
    }
  };

  return (
    <div className="app-screen" id="screen-pin">
      <div className="pin-header">
        <button className="pin-back-btn" onClick={() => { setEnteredPin([]); onBack(); }}>
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <img src="/logo.png" className="welcome-logo-img logo-img--pin" alt="Deuna logo" style={{ height: "40px", width: "auto" }} />
      </div>

      <div className="pin-title-container">
        <h2>Ingresa tu PIN</h2>
        <p>Ingresa tu clave de 4 dígitos para acceder</p>
      </div>

      <div className="pin-dots-container">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={`pin-dot ${index < enteredPin.length ? "filled" : ""}`}
          ></div>
        ))}
      </div>

      <div className="pin-pad-container">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <div
            key={num}
            className="pin-key"
            onClick={() => handleKeyClick(num.toString())}
          >
            {num}
          </div>
        ))}
        <div className="pin-key empty"></div>
        <div className="pin-key" onClick={() => handleKeyClick("0")}>
          0
        </div>
        <div className="pin-key delete" onClick={handleDelete}>
          <i className="fa-solid fa-delete-left"></i>
        </div>
      </div>
    </div>
  );
}
