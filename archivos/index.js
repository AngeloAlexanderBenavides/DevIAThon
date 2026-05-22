document.addEventListener('DOMContentLoaded', () => {
    // --- VARIABLES Y ESTADO PRINCIPAL ---
    let saldoReal = 45.50; // Saldo inicial
    let isSaldoVisible = true;
    let isAccountVisible = false;
    let isLoggedIn = false;
    let pendingRedirectToTransfer = false;
    let enteredPin = [];

    const saldoElement = document.getElementById('monto-saldo');
    const eyeIcon = document.getElementById('toggle-eye');
    const welcomeAccountSpan = document.getElementById('welcome-account-number');
    const btnToggleAccount = document.getElementById('btn-toggle-account');

    // --- RELOJ EN TIEMPO REAL (FORMATO 12 HORAS CON AM/PM) ---
    const updateClock = () => {
        const timeElement = document.getElementById('status-time');
        const now = new Date();
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // el 0 es 12
        timeElement.textContent = `${hours}:${minutes} ${ampm}`;
    };
    updateClock();
    setInterval(updateClock, 60000); // Actualizar cada minuto

    // --- FORMATEO DE MONEDA ---
    const formatCurrency = (value) => {
        return `$${value.toFixed(2).replace('.', ',')}`;
    };

    // --- ACTUALIZACIÓN DE SALDO ---
    const updateSaldoDisplay = () => {
        if (saldoElement) {
            if (isSaldoVisible) {
                saldoElement.textContent = formatCurrency(saldoReal);
                eyeIcon.classList.replace('fa-eye-slash', 'fa-eye');
            } else {
                saldoElement.textContent = '***';
                eyeIcon.classList.replace('fa-eye', 'fa-eye-slash');
            }
        }
    };
    updateSaldoDisplay();

    if (eyeIcon) {
        eyeIcon.addEventListener('click', () => {
            isSaldoVisible = !isSaldoVisible;
            updateSaldoDisplay();
            showToast(isSaldoVisible ? "Saldo visible" : "Saldo ocultado");
        });
    }

    // --- TOGGLE NÚMERO DE CUENTA (BIENVENIDA) ---
    if (btnToggleAccount && welcomeAccountSpan) {
        btnToggleAccount.addEventListener('click', () => {
            isAccountVisible = !isAccountVisible;
            if (isAccountVisible) {
                welcomeAccountSpan.textContent = "0109927833";
                btnToggleAccount.classList.replace('fa-eye-slash', 'fa-eye');
                showToast("Número de cuenta visible");
            } else {
                welcomeAccountSpan.textContent = "******7833";
                btnToggleAccount.classList.replace('fa-eye', 'fa-eye-slash');
                showToast("Número de cuenta ocultado");
            }
        });
    }

    // --- TOAST NOTIFICATIONS ---
    let toastTimeout;
    const showToast = (message) => {
        const toast = document.getElementById('toast-message');
        const toastText = document.getElementById('toast-text');

        if (toast && toastText) {
            toastText.textContent = message;
            toast.classList.add('show');

            clearTimeout(toastTimeout);
            toastTimeout = setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    };

    // --- NAVEGACIÓN Y TRANSICIÓN DE PANTALLAS ---
    const switchScreen = (fromId, toId) => {
        const fromScreen = document.getElementById(fromId);
        const toScreen = document.getElementById(toId);
        if (fromScreen && toScreen) {
            fromScreen.classList.add('hidden');
            toScreen.classList.remove('hidden');
        }
    };

    // Ir a pantalla PIN
    const btnGotoPin = document.getElementById('btn-goto-pin');
    if (btnGotoPin) {
        btnGotoPin.addEventListener('click', () => {
            switchScreen('screen-welcome', 'screen-pin');
            resetPinPad();
        });
    }

    // Volver a pantalla Bienvenida
    const btnPinBack = document.getElementById('btn-pin-back');
    if (btnPinBack) {
        btnPinBack.addEventListener('click', () => {
            switchScreen('screen-pin', 'screen-welcome');
            resetPinPad();
        });
    }

    // --- LÓGICA DE TECLADO PIN ---
    const pinKeys = document.querySelectorAll('.pin-key[data-value]');
    const pinDots = document.querySelectorAll('.pin-dot');
    const btnPinDelete = document.getElementById('btn-pin-delete');

    const updatePinDots = () => {
        pinDots.forEach((dot, index) => {
            if (index < enteredPin.length) {
                dot.classList.add('filled');
            } else {
                dot.classList.remove('filled');
            }
        });
    };

    const resetPinPad = () => {
        enteredPin = [];
        updatePinDots();
    };

    pinKeys.forEach(key => {
        key.addEventListener('click', () => {
            const val = key.getAttribute('data-value');
            if (enteredPin.length < 4) {
                enteredPin.push(val);
                updatePinDots();

                if (enteredPin.length === 4) {
                    // Validar PIN ingresado (cualquier pin de 4 dígitos es válido para la simulación)
                    setTimeout(() => {
                        isLoggedIn = true;
                        switchScreen('screen-pin', 'screen-dashboard');
                        showToast("¡Acceso exitoso! Bienvenido Edison");

                        // Si venía de una acción previa que requería login
                        if (pendingRedirectToTransfer) {
                            pendingRedirectToTransfer = false;
                            setTimeout(() => {
                                const transferModal = document.getElementById('modal-transfer');
                                if (transferModal) {
                                    transferModal.classList.add('active');
                                    document.getElementById('transfer-form-step').classList.remove('hidden');
                                    document.getElementById('transfer-success-screen').classList.add('hidden');
                                    document.getElementById('transfer-contact').value = "Comercio QR (La Esquina)";
                                    document.getElementById('transfer-amount').value = "3.50";
                                    document.getElementById('transfer-concept').value = "Compra rápida QR";
                                }
                            }, 500);
                        }
                    }, 400);
                }
            }
        });
    });

    if (btnPinDelete) {
        btnPinDelete.addEventListener('click', () => {
            if (enteredPin.length > 0) {
                enteredPin.pop();
                updatePinDots();
            }
        });
    }

    // --- NAVEGACIÓN INFERIOR (TABS DE PANEL) ---
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            const tab = item.getAttribute('data-tab');
            if (tab === 'beneficios') {
                showToast("Beneficios: ¡Descubre tus cupones exclusivos!");
            } else if (tab === 'billetera') {
                showToast("Billetera: Administra tus tarjetas y cuentas vinculadas.");
            } else if (tab === 'tu') {
                showToast("Tú: Configuración de perfil y límites de cuenta.");
            }
        });
    });

    // --- CARRUSEL DE PROMOCIONES ---
    const track = document.getElementById('carousel-track');
    const dots = document.querySelectorAll('#carousel-dots .dot');
    let currentSlide = 0;
    const totalSlides = dots.length;

    const goToSlide = (index) => {
        if (track && dots.length > 0) {
            track.style.transform = `translateX(-${index * 33.333}%)`;
            dots.forEach(d => d.classList.remove('active'));
            dots[index].classList.add('active');
            currentSlide = index;
        }
    };

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-slide'));
            goToSlide(index);
        });
    });

    // Desplazamiento automático
    setInterval(() => {
        if (isLoggedIn) {
            let nextSlide = (currentSlide + 1) % totalSlides;
            goToSlide(nextSlide);
        }
    }, 5000);

    // --- AGREGAR TRANSACCIONES DINÁMICAS ---
    const transactionsList = document.getElementById('transactions-list');
    const addTransaction = (title, type, amount, subtitle = '') => {
        if (!transactionsList) return;
        const item = document.createElement('div');
        item.className = 'transaction-item';

        const now = new Date();
        const timeStr = `Hoy, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        let iconClass = 'fa-arrow-up';
        let txIconType = 'tx-out';
        if (type === 'in') {
            iconClass = 'fa-arrow-down';
            txIconType = 'tx-in';
        } else if (type === 'metro') {
            iconClass = 'fa-train-subway';
            txIconType = 'tx-metro';
        }

        item.innerHTML = `
            <div class="tx-icon ${txIconType}"><i class="fa-solid ${iconClass}"></i></div>
            <div class="tx-details">
                <span class="tx-title">${title}</span>
                ${subtitle ? `<span class="tx-subtitle">${subtitle}</span>` : ''}
                <span class="tx-date">${timeStr}</span>
            </div>
            <span class="tx-amount ${type === 'in' ? 'positive' : 'negative'}">
                ${type === 'in' ? '+' : '-'}${formatCurrency(amount)}
            </span>
        `;
        transactionsList.insertBefore(item, transactionsList.firstChild);
    };

    // --- GESTIÓN DE MODALES ---
    const setupModal = (modalId, openBtns, closeBtnId) => {
        const modal = document.getElementById(modalId);
        const closeBtn = document.getElementById(closeBtnId);

        openBtns.forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => {
                    modal.classList.add('active');
                    // Resetear vistas internas del modal
                    const formStep = modal.querySelector('.transfer-form, .recharge-form');
                    const successScreen = modal.querySelector('.success-screen');
                    if (formStep) formStep.classList.remove('hidden');
                    if (successScreen) successScreen.classList.add('hidden');
                });
            }
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }
    };

    // Modales del Dashboard
    setupModal('modal-transfer', [document.getElementById('btn-transfer')], 'btn-close-transfer');
    setupModal('modal-recharge', [
        document.getElementById('quick-recharge-btn'),
        document.getElementById('btn-recharge-grid')
    ], 'btn-close-recharge');
    setupModal('modal-qr', [
        document.getElementById('btn-scan'),
        document.getElementById('btn-charge'),
        document.getElementById('btn-welcome-scan') // Acceso rápido desde bienvenida
    ], 'btn-close-qr');
    setupModal('modal-metro-ticket', [
        document.getElementById('btn-metro'),
        document.getElementById('btn-welcome-metro') // Acceso rápido desde bienvenida
    ], 'btn-close-metro-ticket');

    // Cerrar al hacer clic fuera del modal
    const overlays = document.querySelectorAll('.modal-overlay');
    overlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
            }
        });
    });

    // --- PROCESO: TRANSFERIR DINERO ---
    const btnConfirmTransfer = document.getElementById('btn-confirm-transfer-flow');
    if (btnConfirmTransfer) {
        btnConfirmTransfer.addEventListener('click', () => {
            const contactInput = document.getElementById('transfer-contact');
            const amountInput = document.getElementById('transfer-amount');
            const conceptInput = document.getElementById('transfer-concept');

            const contact = contactInput.value.trim();
            const amount = parseFloat(amountInput.value);

            if (!contact) {
                showToast("Ingresa un contacto o número celular.");
                return;
            }
            if (isNaN(amount) || amount <= 0) {
                showToast("Monto de transferencia inválido.");
                return;
            }
            if (amount > saldoReal) {
                showToast("Saldo insuficiente.");
                return;
            }

            saldoReal -= amount;
            updateSaldoDisplay();

            const conceptText = conceptInput.value.trim() ? `Concepto: ${conceptInput.value.trim()}` : '';
            addTransaction("Transferencia enviada", "out", amount, `A: ${contact} ${conceptText}`);

            document.getElementById('receipt-name').textContent = contact;
            document.getElementById('receipt-amount').textContent = formatCurrency(amount);
            const now = new Date();
            document.getElementById('receipt-date').textContent = `Hoy, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

            document.getElementById('transfer-form-step').classList.add('hidden');
            document.getElementById('transfer-success-screen').classList.remove('hidden');

            contactInput.value = '';
            amountInput.value = '';
            conceptInput.value = '';
        });
    }

    document.getElementById('btn-done-transfer').addEventListener('click', () => {
        document.getElementById('modal-transfer').classList.remove('active');
    });

    // --- PROCESO: RECARGAR SALDO ---
    const btnConfirmRecharge = document.getElementById('btn-confirm-recharge-flow');
    if (btnConfirmRecharge) {
        btnConfirmRecharge.addEventListener('click', () => {
            const amountInput = document.getElementById('recharge-amount');
            const amount = parseFloat(amountInput.value);

            if (isNaN(amount) || amount <= 0) {
                showToast("Monto de recarga inválido.");
                return;
            }

            saldoReal += amount;
            updateSaldoDisplay();

            addTransaction("Recarga desde cuenta", "in", amount);

            document.getElementById('recharge-receipt-amount').textContent = formatCurrency(amount);

            document.getElementById('recharge-form-step').classList.add('hidden');
            document.getElementById('recharge-success-screen').classList.remove('hidden');

            amountInput.value = '';
        });
    }

    document.getElementById('btn-done-recharge').addEventListener('click', () => {
        document.getElementById('modal-recharge').classList.remove('active');
    });

    // --- ESCÁNER QR SIMULADO (CON REDIRECCIÓN A PIN SI NO LOGUEADO) ---
    const modalQr = document.getElementById('modal-qr');
    const btnMyQr = document.getElementById('btn-my-qr');
    let qrScanTimeout;

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                const isActive = modalQr.classList.contains('active');
                if (isActive) {
                    clearTimeout(qrScanTimeout);
                    qrScanTimeout = setTimeout(() => {
                        modalQr.classList.remove('active');

                        if (!isLoggedIn) {
                            // Si no ha iniciado sesión, guardar redirección e ir a PIN
                            showToast("¡QR detectado! Ingresa tu PIN para continuar.");
                            pendingRedirectToTransfer = true;
                            switchScreen('screen-welcome', 'screen-pin');
                            resetPinPad();
                        } else {
                            // Si ya inició sesión, abrir transferencia directamente
                            showToast("¡QR detectado! Abriendo transferencia...");
                            setTimeout(() => {
                                const transferModal = document.getElementById('modal-transfer');
                                if (transferModal) {
                                    transferModal.classList.add('active');
                                    document.getElementById('transfer-form-step').classList.remove('hidden');
                                    document.getElementById('transfer-success-screen').classList.add('hidden');
                                    document.getElementById('transfer-contact').value = "Comercio QR (La Esquina)";
                                    document.getElementById('transfer-amount').value = "3.50";
                                    document.getElementById('transfer-concept').value = "Compra rápida QR";
                                }
                            }, 500);
                        }
                    }, 2500);
                } else {
                    clearTimeout(qrScanTimeout);
                }
            }
        });
    });

    if (modalQr) {
        observer.observe(modalQr, { attributes: true });
    }

    if (btnMyQr) {
        btnMyQr.addEventListener('click', () => {
            showToast("Tu código QR para recibir cobros está visible en tu pantalla física.");
        });
    }

    // --- ENLACES TOAST GENÉRICOS ---
    const bindToast = (elementId, message) => {
        const el = document.getElementById(elementId);
        if (el) {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                showToast(message);
            });
        }
    };

    bindToast('btn-transfer-bank', "Transferencias interbancarias activas sin costo adicional.");
    bindToast('btn-withdraw', "Retiros sin tarjeta disponibles en corresponsales Banco Pichincha.");
    bindToast('btn-phone-recharge', "Recargas telefónicas para Claro, Movistar, CNT y Tuenti.");
    bindToast('btn-pay-services', "Pago de servicios de luz, agua, teléfono y catálogos.");
    bindToast('btn-top-banner', "Promoción especial para recargas de celular. ¡Aprovecha!");
    bindToast('btn-notifications', "No tienes nuevas notificaciones de transferencias.");
    bindToast('btn-see-all', "Tu historial completo de movimientos está disponible en la pestaña Billetera.");
});