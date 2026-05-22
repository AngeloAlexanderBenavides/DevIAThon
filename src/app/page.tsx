"use client";

import React, { useState, useEffect } from "react";
import WelcomeScreen from "@/components/WelcomeScreen";
import PinScreen from "@/components/PinScreen";
import DashboardScreen, { Transaction } from "@/components/DashboardScreen";
import Modals from "@/components/Modals";
import Toast from "@/components/Toast";

export default function DeunaAppReplica() {
  const [currentScreen, setCurrentScreen] = useState<"welcome" | "pin" | "dashboard">("welcome");
  const [saldo, setSaldo] = useState(45.5);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState("");
  const [pendingRedirectToTransfer, setPendingRedirectToTransfer] = useState(false);

  const [transactions, setTransactions] = useState<Transaction[]>([
    { title: "Recarga desde cuenta", type: "in", amount: 20.0, date: "Hoy, 14:32" },
    { title: "Transferencia enviada", subtitle: "A: Juan Pérez", type: "out", amount: 15.0, date: "Ayer, 18:15" },
    { title: "Metro de Quito", type: "metro", amount: 0.45, date: "20 May, 08:05" },
    { title: "Recarga Claro", type: "out", amount: 5.0, date: "18 May, 11:20" },
  ]);

  // Clock Update
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      setCurrentTime(\`\${hours}:\${minutes} \${ampm}\`);
    };
    updateClock();
    const interval = setInterval(updateClock, 60000);
    return () => clearInterval(interval);
  }, []);

  // Toast Management
  let toastTimeout: NodeJS.Timeout;
  const showToast = (message: string) => {
    setToastMessage(message);
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => setToastMessage(null), 3000);
  };

  const addTransaction = (title: string, type: "in" | "out" | "metro", amount: number, subtitle?: string) => {
    const now = new Date();
    const timeStr = \`Hoy, \${String(now.getHours()).padStart(2, "0")}:\${String(now.getMinutes()).padStart(2, "0")}\`;
    setTransactions((prev) => [
      { title, type, amount, subtitle, date: timeStr },
      ...prev,
    ]);
  };

  const handleTransfer = (contact: string, amount: number) => {
    setSaldo((prev) => prev - amount);
    addTransaction("Transferencia enviada", "out", amount, \`A: \${contact}\`);
  };

  const handleRecharge = (amount: number) => {
    setSaldo((prev) => prev + amount);
    addTransaction("Recarga desde cuenta", "in", amount);
  };

  const handleQRScan = () => {
    setActiveModal("qr");
    // Simulate scan delay
    setTimeout(() => {
      if (activeModal !== "qr") return; // If user closed it manually
      
      setActiveModal(null);
      if (currentScreen !== "dashboard") {
        showToast("¡QR detectado! Ingresa tu PIN para continuar.");
        setPendingRedirectToTransfer(true);
        setCurrentScreen("pin");
      } else {
        showToast("¡QR detectado! Abriendo transferencia...");
        setTimeout(() => {
          setActiveModal("transfer");
        }, 500);
      }
    }, 2500);
  };

  const handleLoginSuccess = () => {
    setCurrentScreen("dashboard");
    if (pendingRedirectToTransfer) {
      setPendingRedirectToTransfer(false);
      setTimeout(() => {
        setActiveModal("transfer");
      }, 500);
    }
  };

  return (
    <div className="app-container">
      {/* Status Bar */}
      <div className="status-bar">
        <div className="status-left">
          <span className="status-time">{currentTime}</span>
          <i className="fa-solid fa-clock alarm-icon"></i>
          <i className="fa-brands fa-instagram notification-icon"></i>
          <i className="fa-brands fa-whatsapp notification-icon"></i>
        </div>
        <div className="status-right">
          <i className="fa-solid fa-signal"></i>
          <i className="fa-solid fa-wifi"></i>
          <span className="battery-pct">32</span>
          <i className="fa-solid fa-battery-quarter"></i>
        </div>
      </div>

      {currentScreen === "welcome" && (
        <WelcomeScreen
          onGotoPin={() => setCurrentScreen("pin")}
          onShowToast={showToast}
          onScanQRClick={handleQRScan}
          onMetroClick={() => setActiveModal("metro")}
        />
      )}

      {currentScreen === "pin" && (
        <PinScreen
          onBack={() => setCurrentScreen("welcome")}
          onLoginSuccess={handleLoginSuccess}
          onShowToast={showToast}
        />
      )}

      {currentScreen === "dashboard" && (
        <DashboardScreen
          saldo={saldo}
          transactions={transactions}
          onShowToast={showToast}
          onOpenModal={setActiveModal}
        />
      )}

      <Modals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        onTransfer={handleTransfer}
        onRecharge={handleRecharge}
        saldo={saldo}
        onShowToast={showToast}
      />

      <Toast message={toastMessage} />
    </div>
  );
}
