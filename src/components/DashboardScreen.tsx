"use client";

import React, { useState, useEffect } from "react";

export type Transaction = {
  title: string;
  subtitle?: string;
  amount: number;
  type: "in" | "out" | "metro";
  date: string;
};

interface DashboardScreenProps {
  saldo: number;
  transactions: Transaction[];
  onShowToast: (message: string) => void;
  onOpenModal: (modalName: string) => void;
}

export default function DashboardScreen({
  saldo,
  transactions,
  onShowToast,
  onOpenModal,
}: DashboardScreenProps) {
  const [isSaldoVisible, setIsSaldoVisible] = useState(true);
  const [activeTab, setActiveTab] = useState("inicio");
  const [currentSlide, setCurrentSlide] = useState(0);

  const formatCurrency = (value: number) => {
    return \`$\${value.toFixed(2).replace(".", ",")}\`;
  };

  const handleToggleSaldo = () => {
    setIsSaldoVisible(!isSaldoVisible);
    onShowToast(!isSaldoVisible ? "Saldo visible" : "Saldo ocultado");
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (tab === "beneficios") {
      onShowToast("Beneficios: ¡Descubre tus cupones exclusivos!");
    } else if (tab === "billetera") {
      onShowToast("Billetera: Administra tus tarjetas y cuentas vinculadas.");
    } else if (tab === "tu") {
      onShowToast("Tú: Configuración de perfil y límites de cuenta.");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-screen" id="screen-dashboard" style={{ paddingBottom: "140px" }}>
      {/* App Custom Header */}
      <div className="app-header">
        <div className="user-profile">
          <div className="profile-avatar">
            <i className="fa-solid fa-user-astronaut"></i>
          </div>
          <div className="profile-greeting">
            <span className="greeting-sub">Hola,</span>
            <span className="greeting-name">Edison</span>
          </div>
        </div>
        <div className="app-logo">
          <img src="/logo.png" className="app-logo-img" alt="Deuna logo" style={{ height: "40px", width: "auto" }} />
        </div>
        <div className="header-actions">
          <div
            className="header-icon-btn"
            onClick={() => onShowToast("No tienes nuevas notificaciones de transferencias.")}
          >
            <i className="fa-regular fa-bell"></i>
            <span className="notification-badge"></span>
          </div>
        </div>
      </div>

      {/* Top Banner Recharge Promo */}
      <div
        className="top-banner"
        onClick={() => onShowToast("Promoción especial para recargas de celular. ¡Aprovecha!")}
      >
        <span className="banner-text">¡Ups! ¿Sin saldo? Sigue en línea y recarga tu cel aquí 👉</span>
        <i className="fa-solid fa-chevron-right"></i>
      </div>

      {/* Balance Card */}
      <div className="balance-card">
        <div className="balance-info">
          <h3>Saldo disponible</h3>
          <div className="balance-amount">
            <h1>{isSaldoVisible ? formatCurrency(saldo) : "***"}</h1>
            <i
              className={`fa-solid ${isSaldoVisible ? "fa-eye" : "fa-eye-slash"}`}
              onClick={handleToggleSaldo}
            ></i>
          </div>
        </div>
        <div className="balance-actions-header">
          <button className="header-btn" onClick={() => onOpenModal("recharge")}>
            <i className="fa-solid fa-plus"></i> Recargar
          </button>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="services-grid">
        <div className="service-item" onClick={() => onOpenModal("transfer")}>
          <div className="service-icon ic-transfer"><img src="/transferir.jpg" alt="Transferir" /></div>
          <span>Transferir</span>
        </div>
        <div className="service-item" onClick={() => onShowToast("Transferencias interbancarias activas sin costo adicional.")}>
          <div className="service-icon ic-bank"><img src="/transferirotrobanco.jpg" alt="Transferir a otros bancos" /></div>
          <span>A otros bancos</span>
        </div>
        <div className="service-item" onClick={() => onOpenModal("recharge")}>
          <div className="service-icon ic-recharge"><img src="/recargar.jpg" alt="Recargar" /></div>
          <span>Recargar</span>
        </div>
        <div className="service-item" onClick={() => onOpenModal("qr")}>
          <div className="service-icon ic-charge"><img src="/cobrar con qr.png" alt="Cobrar con QR" /></div>
          <span>Cobrar con QR</span>
        </div>
        <div className="service-item" onClick={() => onShowToast("Retiros sin tarjeta disponibles en corresponsales Banco Pichincha.")}>
          <div className="service-icon ic-withdraw"><img src="/retirar.jpg" alt="Retirar efectivo" /></div>
          <span>Retirar efectivo</span>
        </div>
        <div className="service-item" onClick={() => onShowToast("Recargas telefónicas para Claro, Movistar, CNT y Tuenti.")}>
          <div className="service-icon ic-phone"><img src="/recargarcelular.jpg" alt="Recarga celular" /></div>
          <span>Recarga celular</span>
        </div>
        <div className="service-item" onClick={() => onShowToast("Pago de servicios de luz, agua, teléfono y catálogos.")}>
          <div className="service-icon ic-pay"><img src="/pagarservicios.jpg" alt="Pagar servicios" /></div>
          <span>Pagar servicios</span>
        </div>
        <div className="service-item" onClick={() => onOpenModal("metro")}>
          <div className="service-icon ic-metro"><img src="/metrodequito.jpg" alt="Metro de Quito" /></div>
          <span>Metro de Quito</span>
        </div>
        <div className="service-item">
          <div className="service-icon ic-deuna-jovenes"><img src="/deunajovenes.jpg" alt="Deuna Jóvenes" /></div>
          <span>Deuna Jóvenes</span>
        </div>
      </div>

      {/* Promotions Section (Carousel) */}
      <div className="section-container">
        <h2 className="section-title">Mis promociones</h2>
        <div className="carousel-container">
          <div
            className="carousel-track"
            style={{ transform: \`translateX(-\${currentSlide * 33.333}%)\` }}
          >
            <div className="carousel-slide slide-1">
              <div className="slide-content">
                <h3>¡Gana una TV de 70"!</h3>
                <p>Haz 3 pagos deuna! o más y participa automáticamente.</p>
                <a href="#" className="slide-link">Conoce más <i className="fa-solid fa-arrow-up-right-from-square"></i></a>
              </div>
            </div>
            <div className="carousel-slide slide-2">
              <div className="slide-content">
                <h3>50% Cashback en Metro</h3>
                <p>Paga tu viaje con Deuna! en el Metro de Quito y ahorra.</p>
                <a href="#" className="slide-link">Ver detalles <i className="fa-solid fa-arrow-up-right-from-square"></i></a>
              </div>
            </div>
            <div className="carousel-slide slide-3">
              <div className="slide-content">
                <h3>Invita a un amigo</h3>
                <p>Recibe $2,00 por cada referido que haga su primer pago.</p>
                <a href="#" className="slide-link">Compartir link <i className="fa-solid fa-arrow-up-right-from-square"></i></a>
              </div>
            </div>
          </div>
        </div>
        <div className="dots">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={\`dot \${currentSlide === index ? "active" : ""}\`}
              onClick={() => setCurrentSlide(index)}
            ></div>
          ))}
        </div>
      </div>

      {/* Transactions Section ("Mis movimientos") */}
      <div className="section-container transactions-section">
        <div className="section-header-flex">
          <h2 className="section-title">Mis movimientos</h2>
          <a href="#" className="see-all" onClick={(e) => { e.preventDefault(); onShowToast("Tu historial completo de movimientos está disponible en la pestaña Billetera."); }}>Ver todos</a>
        </div>
        <div className="transactions-list">
          {transactions.map((tx, idx) => (
            <div key={idx} className="transaction-item">
              <div className={\`tx-icon \${tx.type === "in" ? "tx-in" : tx.type === "metro" ? "tx-metro" : "tx-out"}\`}>
                <i className={\`fa-solid \${tx.type === "in" ? "fa-arrow-down" : tx.type === "metro" ? "fa-train-subway" : "fa-arrow-up"}\`}></i>
              </div>
              <div className="tx-details">
                <span className="tx-title">{tx.title}</span>
                {tx.subtitle && <span className="tx-subtitle">{tx.subtitle}</span>}
                <span className="tx-date">{tx.date}</span>
              </div>
              <span className={\`tx-amount \${tx.type === "in" ? "positive" : "negative"}\`}>
                {tx.type === "in" ? "+" : "-"}{formatCurrency(tx.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="bottom-nav-container">
        <div className="scan-btn-container">
          <button className="scan-btn" onClick={() => onOpenModal("qr")}>
            <i className="fa-solid fa-qrcode"></i> Escanear QR
          </button>
        </div>
        <div className="nav-tabs">
          <div className={\`nav-item \${activeTab === "inicio" ? "active" : ""}\`} onClick={() => handleTabClick("inicio")}>
            <i className="fa-solid fa-house"></i>
            <span>Inicio</span>
          </div>
          <div className={\`nav-item \${activeTab === "beneficios" ? "active" : ""}\`} onClick={() => handleTabClick("beneficios")}>
            <i className="fa-solid fa-gift"></i>
            <span>Beneficios</span>
          </div>
          <div className={\`nav-item \${activeTab === "billetera" ? "active" : ""}\`} onClick={() => handleTabClick("billetera")}>
            <i className="fa-solid fa-wallet"></i>
            <span>Billetera</span>
          </div>
          <div className={\`nav-item \${activeTab === "tu" ? "active" : ""}\`} onClick={() => handleTabClick("tu")}>
            <i className="fa-regular fa-user"></i>
            <span>Tú</span>
          </div>
        </div>
      </div>
    </div>
  );
}
