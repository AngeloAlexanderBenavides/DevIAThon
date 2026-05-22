"use client";

import React, { useState } from "react";

interface ModalsProps {
  activeModal: string | null;
  onClose: () => void;
  onTransfer: (contact: string, amount: number) => void;
  onRecharge: (amount: number) => void;
  saldo: number;
  onShowToast: (message: string) => void;
}

export default function Modals({
  activeModal,
  onClose,
  onTransfer,
  onRecharge,
  saldo,
  onShowToast,
}: ModalsProps) {
  // Transfer State
  const [transferStep, setTransferStep] = useState<"form" | "success">("form");
  const [transferContact, setTransferContact] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferConcept, setTransferConcept] = useState("");

  // Recharge State
  const [rechargeStep, setRechargeStep] = useState<"form" | "success">("form");
  const [rechargeAmount, setRechargeAmount] = useState("");

  const formatCurrency = (value: number) => {
    return `$${value.toFixed(2).replace(".", ",")}`;
  };

  const handleTransfer = () => {
    const contact = transferContact.trim();
    const amount = parseFloat(transferAmount);

    if (!contact) {
      onShowToast("Ingresa un contacto o número celular.");
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      onShowToast("Monto de transferencia inválido.");
      return;
    }
    if (amount > saldo) {
      onShowToast("Saldo insuficiente.");
      return;
    }

    onTransfer(contact, amount);
    setTransferStep("success");
  };

  const handleRecharge = () => {
    const amount = parseFloat(rechargeAmount);

    if (isNaN(amount) || amount <= 0) {
      onShowToast("Monto de recarga inválido.");
      return;
    }

    onRecharge(amount);
    setRechargeStep("success");
  };

  // Reset steps when modals close
  React.useEffect(() => {
    if (!activeModal) {
      setTransferStep("form");
      setTransferContact("");
      setTransferAmount("");
      setTransferConcept("");
      setRechargeStep("form");
      setRechargeAmount("");
    }
  }, [activeModal]);

  return (
    <>
      {/* Transferir */}
      <div className={`modal-overlay ${activeModal === "transfer" ? "active" : ""}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="modal-card">
          <div className="modal-header">
            <button className="modal-close-btn" onClick={onClose}>
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <h2>Transferir dinero</h2>
          </div>
          <div className="modal-body">
            {transferStep === "form" ? (
              <div className="transfer-form">
                <div className="form-group">
                  <label>Contacto / Celular / Cédula</label>
                  <div className="input-with-icon">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input
                      type="text"
                      placeholder="Ej: Juan Pérez o 0998877665"
                      value={transferContact}
                      onChange={(e) => setTransferContact(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Monto a transferir ($)</label>
                  <div className="input-with-symbol">
                    <span className="currency-symbol">$</span>
                    <input
                      type="number"
                      placeholder="0,00"
                      step="0.01"
                      min="0.01"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Mensaje (Opcional)</label>
                  <input
                    type="text"
                    placeholder="Ej: Pago de almuerzo"
                    value={transferConcept}
                    onChange={(e) => setTransferConcept(e.target.value)}
                  />
                </div>
                <button className="btn-primary" onClick={handleTransfer}>
                  Transferir ahora
                </button>
              </div>
            ) : (
              <div className="success-screen">
                <div className="success-icon-wrapper">
                  <div className="success-icon">
                    <i className="fa-solid fa-check"></i>
                  </div>
                </div>
                <h2>¡Transferencia Exitosa!</h2>
                <p className="success-desc">El dinero ha sido enviado correctamente.</p>
                <div className="receipt-card">
                  <div className="receipt-row">
                    <span>Destinatario:</span>
                    <strong>{transferContact}</strong>
                  </div>
                  <div className="receipt-row">
                    <span>Monto:</span>
                    <strong>{formatCurrency(parseFloat(transferAmount))}</strong>
                  </div>
                  <div className="receipt-row">
                    <span>Fecha:</span>
                    <strong>Hoy</strong>
                  </div>
                </div>
                <button className="btn-primary" onClick={onClose}>
                  Listo
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recargar */}
      <div className={`modal-overlay ${activeModal === "recharge" ? "active" : ""}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="modal-card">
          <div className="modal-header">
            <button className="modal-close-btn" onClick={onClose}>
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <h2>Recargar deuna!</h2>
          </div>
          <div className="modal-body">
            {rechargeStep === "form" ? (
              <div className="recharge-form">
                <div className="form-group">
                  <label>Origen</label>
                  <div className="bank-source-card">
                    <i className="fa-solid fa-building-columns"></i>
                    <div className="bank-details">
                      <strong>Banco Pichincha Cuenta Ahorros</strong>
                      <span>Cuenta activa ****5678</span>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label>Monto a recargar ($)</label>
                  <div className="input-with-symbol">
                    <span className="currency-symbol">$</span>
                    <input
                      type="number"
                      placeholder="0,00"
                      step="0.01"
                      min="0.01"
                      value={rechargeAmount}
                      onChange={(e) => setRechargeAmount(e.target.value)}
                    />
                  </div>
                </div>
                <button className="btn-primary" onClick={handleRecharge}>
                  Recargar ahora
                </button>
              </div>
            ) : (
              <div className="success-screen">
                <div className="success-icon-wrapper">
                  <div className="success-icon">
                    <i className="fa-solid fa-check"></i>
                  </div>
                </div>
                <h2>¡Recarga Exitosa!</h2>
                <p className="success-desc">Tu saldo ha sido actualizado.</p>
                <div className="receipt-card">
                  <div className="receipt-row">
                    <span>Origen:</span>
                    <strong>Banco Pichincha Ahorros</strong>
                  </div>
                  <div className="receipt-row">
                    <span>Monto:</span>
                    <strong>{formatCurrency(parseFloat(rechargeAmount))}</strong>
                  </div>
                  <div className="receipt-row">
                    <span>Destino:</span>
                    <strong>Billetera Deuna!</strong>
                  </div>
                </div>
                <button className="btn-primary" onClick={onClose}>
                  Listo
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Escanear QR */}
      <div className={`modal-overlay ${activeModal === "qr" ? "active" : ""}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="modal-card full-screen">
          <div className="modal-header">
            <button className="modal-close-btn white" onClick={onClose}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            <h2 className="white">Escanear código QR</h2>
          </div>
          <div className="modal-body qr-body">
            <p className="qr-hint">Enfoca el código QR de un comercio o persona para pagar</p>
            <div className="camera-viewport">
              <div className="scanner-frame">
                <div className="corner top-left"></div>
                <div className="corner top-right"></div>
                <div className="corner bottom-left"></div>
                <div className="corner bottom-right"></div>
                <div className="scan-laser animate-laser"></div>
              </div>
            </div>
            <div className="qr-footer-actions">
              <button className="qr-footer-btn" onClick={() => onShowToast("Tu código QR para recibir cobros está visible en tu pantalla física.")}>
                <i className="fa-solid fa-qrcode"></i> Mostrar mi QR
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Metro UIO Ticket */}
      <div className={`modal-overlay ${activeModal === "metro" ? "active" : ""}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="modal-card">
          <div className="modal-header">
            <button className="modal-close-btn" onClick={onClose}>
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <h2>Metro de Quito UIO</h2>
          </div>
          <div className="modal-body">
            <div className="metro-ticket-container">
              <div className="metro-logo-wrapper">
                <i className="fa-solid fa-train-subway"></i>
                <span>METRO UIO</span>
              </div>
              <p className="metro-ticket-hint">Pasa este código por el lector de acceso en la estación</p>
              <div className="metro-qr-wrapper">
                <i className="fa-solid fa-qrcode"></i>
              </div>
              <div className="metro-ticket-details">
                <div className="metro-detail-row">
                  <span>Pasaje:</span>
                  <strong>$0,45</strong>
                </div>
                <div className="metro-detail-row">
                  <span>Estado:</span>
                  <span className="status-pill active-pill">Activo</span>
                </div>
                <div className="metro-detail-row">
                  <span>Descontado de:</span>
                  <strong>Saldo Deuna!</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
