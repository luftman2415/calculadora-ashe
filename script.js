document.addEventListener('DOMContentLoaded', () => {
    // --- Referencias a los elementos del DOM ---
    const body = document.body;
    const printArea = document.getElementById('print-area');
    const facturaIdNumberInput = document.getElementById('facturaIdNumber');
    const valorFacturaTotalInput = document.getElementById('valorFacturaTotal');
    const valorSinIvaDirectoInput = document.getElementById('valorSinIvaDirecto');
    const fechaFacturaInput = document.getElementById('fechaFactura');
    const fechaPagoInput = document.getElementById('fechaPago');
    const diasManualInput = document.getElementById('diasManual');
    const calcularBtn = document.getElementById('calcularBtn');
    const limpiarBtn = document.getElementById('limpiarBtn');
    const addToListBtn = document.getElementById('addToListBtn');
    const printBtn = document.getElementById('printBtn');
    const generarNotaBtn = document.getElementById('generarNotaBtn');

    // Resultados
    const diasTranscurridosOutput = document.getElementById('diasTranscurridosOutput');
    const valorBaseDescuentoOutput = document.getElementById('valorBaseDescuentoOutput');
    const valorConIvaOutput = document.getElementById('valorConIvaOutput');
    const ivaCalculadoOutput = document.getElementById('ivaCalculadoOutput');
    const porcentajeDescuentoOutput = document.getElementById('porcentajeDescuentoOutput');
    const valorDescuentoOutput = document.getElementById('valorDescuentoOutput');
    const totalPagarOutput = document.getElementById('totalPagarOutput');
    
    // Notificaciones y Modales
    const notificationBar = document.getElementById('notification-bar');
    const undoContainer = document.getElementById('undo-container');
    const undoText = document.getElementById('undo-text');
    const undoBtn = document.getElementById('undo-btn');
    const confirmDeleteModal = document.getElementById('confirmDeleteModal');
    const modalDeleteConfirmBtn = document.getElementById('modalDeleteConfirmBtn');
    const modalDeleteCancelBtn = document.getElementById('modalDeleteCancelBtn');
    const confirmClearModal = document.getElementById('confirmClearModal');
    const modalClearConfirmBtn = document.getElementById('modalClearConfirmBtn');
    const modalClearCancelBtn = document.getElementById('modalClearCancelBtn');
    
    // Modal Borrador de Notas Corporativo
    const borradorNotasModal = document.getElementById('borradorNotasModal');
    const closeBorradorBtn = document.querySelector('.close-btn-corp');
    const printNotaBtn = document.getElementById('printNotaBtn');
    const notaSubtotalInput = document.getElementById('notaSubtotalInput');
    const notaIvaInput = document.getElementById('notaIvaInput');
    const notaTotalInput = document.getElementById('notaTotalInput');
    const notaValorInputs = document.querySelectorAll('.valor-input');
    const notaDetailInputs = document.querySelectorAll('.detail-item-input');
    const notaInputsNavegables = Array.from(borradorNotasModal.querySelectorAll('input[type="text"], input[type="radio"]'));

    // Lista y Tema
    const facturasTabla = document.getElementById('facturasTabla');
    const facturasTablaBody = document.querySelector('#facturasTabla tbody');
    const granTotalPagarSpan = document.getElementById('granTotalPagarSpan');
    const limpiarListaBtn = document.getElementById('limpiarListaBtn');
    const noFacturasMessage = document.getElementById('noFacturasMessage');
    const exportCsvBtn = document.getElementById('exportCsvBtn');
    const printSummaryBtn = document.getElementById('printSummaryBtn');
    const themeCheckbox = document.getElementById('theme-checkbox');

    // --- Estado de la Aplicación ---
    let facturasCalculadas = [];
    let lastDeleted = { factura: null, index: null };
    let currentCalculation = {};
    let undoTimeout, notificationTimeout;
    let indexToDelete = -1;

    // --- Constantes y Configuración ---
    const IVA_PERCENTAGE = 0.19;
    const tablaDescuentos = [ { dias: 1, porcentaje: 1.30 }, { dias: 2, porcentaje: 1.30 }, { dias: 3, porcentaje: 1.30 }, { dias: 4, porcentaje: 1.30 }, { dias: 5, porcentaje: 1.30 }, { dias: 6, porcentaje: 1.30 }, { dias: 7, porcentaje: 1.30 }, { dias: 8, porcentaje: 1.30 }, { dias: 9, porcentaje: 1.30 }, { dias: 10, porcentaje: 1.30 },{ dias: 11, porcentaje: 1.06 }, { dias: 12, porcentaje: 1.04 },{ dias: 13, porcentaje: 1.02 }, { dias: 14, porcentaje: 1.00 }, { dias: 15, porcentaje: 0.98 }, { dias: 16, porcentaje: 0.95 }, { dias: 17, porcentaje: 0.93 }, { dias: 18, porcentaje: 0.91 }, { dias: 19, porcentaje: 0.89 }, { dias: 20, porcentaje: 0.87 }, { dias: 21, porcentaje: 0.85 }, { dias: 22, porcentaje: 0.82 }, { dias: 23, porcentaje: 0.80 }, { dias: 24, porcentaje: 0.78 }, { dias: 25, porcentaje: 0.76 }, { dias: 26, porcentaje: 0.74 }, { dias: 27, porcentaje: 0.72 }, { dias: 28, porcentaje: 0.69 }, { dias: 29, porcentaje: 0.67 }, { dias: 30, porcentaje: 0.65 }, { dias: 31, porcentaje: 0.63 }, { dias: 32, porcentaje: 0.61 }, { dias: 33, porcentaje: 0.59 }, { dias: 34, porcentaje: 0.56 }, { dias: 35, porcentaje: 0.54 }, { dias: 36, porcentaje: 0.52 }, { dias: 37, porcentaje: 0.50 }, { dias: 38, porcentaje: 0.48 }, { dias: 39, porcentaje: 0.46 }, { dias: 40, porcentaje: 0.43 }, { dias: 41, porcentaje: 0.41 }, { dias: 42, porcentaje: 0.39 }, { dias: 43, porcentaje: 0.37 }, { dias: 44, porcentaje: 0.35 }, { dias: 45, porcentaje: 0.33 }, { dias: 46, porcentaje: 0.30 }, { dias: 47, porcentaje: 0.28 }, { dias: 48, porcentaje: 0.26 }, { dias: 49, porcentaje: 0.24 }, { dias: 50, porcentaje: 0.22 }, { dias: 51, porcentaje: 0.20 }, { dias: 52, porcentaje: 0.17 }, { dias: 53, porcentaje: 0.15 }, { dias: 54, porcentaje: 0.13 }, { dias: 55, porcentaje: 0.11 }, { dias: 56, porcentaje: 0.09 }, { dias: 57, porcentaje: 0.07 }, { dias: 58, porcentaje: 0.04 }, { dias: 59, porcentaje: 0.02 }, { dias: 60, porcentaje: 0.00 } ];

    // --- Funciones Auxiliares ---
    const formatCurrency = (value) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
    const parseFormattedCurrency = (formattedString) => parseFloat(String(formattedString).replace(/\$\s?|\./g, '').replace(/,/g, '.')) || 0;
    
    function toggleModal(modalElement, show) {
        if (modalElement) {
            modalElement.style.display = show ? 'flex' : 'none';
            body.classList.toggle('modal-open', show);
        }
    }

    function showNotification(msg, type = 'info') {
        clearTimeout(notificationTimeout);
        notificationBar.textContent = msg;
        notificationBar.className = `notification ${type}`;
        notificationBar.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    function showUndo(msg) {
        clearTimeout(undoTimeout);
        undoText.textContent = msg;
        undoContainer.className = 'notification info';
        undoContainer.style.display = 'block';
        undoTimeout = setTimeout(() => {
            undoContainer.style.display = 'none';
            lastDeleted = { factura: null, index: null };
        }, 6000);
    }

    const saveFacturas = () => localStorage.setItem('facturasCalculadas', JSON.stringify(facturasCalculadas));
    
    const loadFacturas = () => {
        const saved = localStorage.getItem('facturasCalculadas');
        if (saved) facturasCalculadas = JSON.parse(saved);
    };
    
    const applyTheme = (theme) => {
        document.body.classList.toggle('dark-mode', theme === 'dark');
        themeCheckbox.checked = theme === 'dark';
    };
    
    const toggleTheme = () => {
        const newTheme = themeCheckbox.checked ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    };

    function resetFields() {
        facturaIdNumberInput.value = '';
        valorFacturaTotalInput.value = '';
        valorSinIvaDirectoInput.value = '';
        fechaFacturaInput.value = '';
        fechaPagoInput.value = new Date().toISOString().split('T')[0];
        diasManualInput.value = '';
        diasTranscurridosOutput.textContent = '0 días';
        valorBaseDescuentoOutput.textContent = formatCurrency(0);
        valorConIvaOutput.textContent = formatCurrency(0);
        ivaCalculadoOutput.textContent = formatCurrency(0);
        porcentajeDescuentoOutput.textContent = '0.00%';
        valorDescuentoOutput.textContent = formatCurrency(0);
        totalPagarOutput.textContent = formatCurrency(0);
        addToListBtn.style.display = 'none';
        printBtn.style.display = 'none';
        generarNotaBtn.style.display = 'none';
        currentCalculation = {};
    }

    function renderFacturasLista() {
        facturasTablaBody.innerHTML = '';
        let granTotal = 0;
        const hayFacturas = facturasCalculadas.length > 0;
        facturasTabla.style.display = hayFacturas ? 'table' : 'none';
        document.getElementById('noFacturasContainer').style.display = hayFacturas ? 'none' : 'block';
        printSummaryBtn.style.display = hayFacturas ? 'inline-block' : 'none';
        exportCsvBtn.style.display = hayFacturas ? 'inline-block' : 'none';
        limpiarListaBtn.style.display = hayFacturas ? 'inline-block' : 'none';

        if (hayFacturas) {
            facturasCalculadas.forEach((factura, index) => {
                const row = facturasTablaBody.insertRow();
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${factura.id || 'N/A'}</td>
                    <td>${formatCurrency(factura.valorFacturaTotal)}</td>
                    <td>${factura.diasTranscurridos}</td>
                    <td>${factura.porcentajeDescuentoAplicado.toFixed(2)}%</td>
                    <td>${formatCurrency(factura.valorDescuento)}</td>
                    <td><strong>${formatCurrency(factura.totalPagar)}</strong></td>
                    <td><button class="delete-factura-btn danger-btn" data-index="${index}">X</button></td>
                `;
                granTotal += factura.totalPagar;
            });
        }
        granTotalPagarSpan.textContent = formatCurrency(granTotal);
        saveFacturas();
    }
    
    function prepareAndPrint(title, contentHtml) {
        const printDate = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
        printArea.innerHTML = `
            <div class="print-header">
                <img src="LOGO ASHE SIN FONDO.png" alt="Logo ASHE SAS">
                <div class="title-date-group"><h2>${title}</h2><p>Generado el: ${printDate}</p></div>
            </div>
            ${contentHtml}`;
        body.classList.add('printing-area');
        window.print();
        body.classList.remove('printing-area');
    }

    // --- Lógica de Eventos ---
    
    calcularBtn.addEventListener('click', () => {
        if (!valorFacturaTotalInput.value) return showNotification('El campo "Valor Total de la Factura" es obligatorio.', 'error');
        if (!fechaFacturaInput.value) return showNotification('El campo "Fecha de Emisión de Factura" es obligatorio.', 'error');
        if (!fechaPagoInput.value) return showNotification('El campo "Fecha de Pago" es obligatorio.', 'error');

        const valorFacturaTotal = parseFloat(valorFacturaTotalInput.value);
        if (isNaN(valorFacturaTotal) || valorFacturaTotal <= 0) return showNotification('Ingresa un Valor Total de Factura válido y mayor a cero.', 'error');
        
        const fechaFactura = new Date(fechaFacturaInput.value);
        const fechaPago = new Date(fechaPagoInput.value);
        fechaFactura.setUTCHours(0, 0, 0, 0);
        fechaPago.setUTCHours(0, 0, 0, 0);

        if (fechaPago < fechaFactura) return showNotification('La fecha de pago no puede ser anterior a la fecha de emisión.', 'error');
        
        const diasTranscurridos = Math.round((fechaPago - fechaFactura) / (1000 * 60 * 60 * 24)) + 1;
        const valorSinIvaDirecto = parseFloat(valorSinIvaDirectoInput.value) || 0;
        if (valorSinIvaDirecto < 0) return showNotification('El valor sin IVA no puede ser negativo.', 'error');
        if (valorSinIvaDirecto > valorFacturaTotal) return showNotification('La parte sin IVA no puede ser mayor al total de la factura.', 'error');
        
        const valorParteConIvaBruto = valorFacturaTotal - valorSinIvaDirecto;
        const baseImponibleParteConIva = valorParteConIvaBruto / (1 + IVA_PERCENTAGE);
        const valorBaseDescuentoTotal = valorSinIvaDirecto + baseImponibleParteConIva;
        
        const descuentoEncontrado = tablaDescuentos.find(d => d.dias === diasTranscurridos);
        const porcentajeDescuentoAplicado = descuentoEncontrado ? descuentoEncontrado.porcentaje : 0;
        
        // CAMBIO CLAVE: Lógica simplificada y corregida
        const valorDescuento = valorBaseDescuentoTotal * (porcentajeDescuentoAplicado / 100);
        const totalPagar = valorFacturaTotal - valorDescuento;
        
        // Lógica separada para la nota de crédito (cálculo del IVA del descuento)
        const descuentoSobreBaseConIva = baseImponibleParteConIva * (porcentajeDescuentoAplicado / 100);
        const ivaDelDescuento = descuentoSobreBaseConIva * IVA_PERCENTAGE;

        currentCalculation = {
            id: facturaIdNumberInput.value.trim() ? `MDVA-${facturaIdNumberInput.value.trim()}` : 'N/A',
            valorFacturaTotal,
            diasTranscurridos,
            porcentajeDescuentoAplicado,
            valorDescuento,       // El descuento puro sobre la base
            ivaDelDescuento,      // El IVA de ese descuento (para la nota)
            totalPagar            // El total final a pagar
        };

        diasTranscurridosOutput.textContent = `${diasTranscurridos} días`;
        valorBaseDescuentoOutput.textContent = formatCurrency(valorBaseDescuentoTotal);
        valorConIvaOutput.textContent = formatCurrency(valorParteConIvaBruto);
        ivaCalculadoOutput.textContent = formatCurrency(valorParteConIvaBruto - baseImponibleParteConIva);
        porcentajeDescuentoOutput.textContent = `${porcentajeDescuentoAplicado.toFixed(2)}%`;
        valorDescuentoOutput.textContent = formatCurrency(valorDescuento); // Muestra el descuento puro
        totalPagarOutput.textContent = formatCurrency(totalPagar);
        
        addToListBtn.style.display = 'inline-block';
        printBtn.style.display = 'inline-block';
        generarNotaBtn.style.display = 'inline-block';
    });
    
    addToListBtn.addEventListener('click', () => {
        if (!currentCalculation.hasOwnProperty('totalPagar')) return showNotification('No hay un cálculo válido para agregar.', 'error');
        facturasCalculadas.push(currentCalculation);
        renderFacturasLista();
        showNotification('Factura agregada a la lista.', 'success');
        resetFields();
    });

    printBtn.addEventListener('click', () => {
        const resultsGrid = document.querySelector('.results-section .output-grid');
        let resultsHtml = '<div class="print-results-grid">';
        resultsGrid.querySelectorAll('.output-group').forEach(group => {
            const label = group.querySelector('label').textContent;
            const value = group.querySelector('.value-container span').textContent;
            const isTotal = group.classList.contains('total');
            resultsHtml += `<div class="print-output-group ${isTotal ? 'total' : ''}"><span class="label">${label}</span><span class="value">${value}</span></div>`;
        });
        resultsHtml += '</div>';
        prepareAndPrint('Comprobante de Cálculo', resultsHtml);
    });

    printSummaryBtn.addEventListener('click', () => {
        const tableToPrint = facturasTabla.cloneNode(true);
        tableToPrint.querySelector('thead tr').deleteCell(-1);
        tableToPrint.querySelectorAll('tbody tr').forEach(row => row.deleteCell(-1));
        const tfoot = tableToPrint.querySelector('tfoot');
        if (tfoot) {
            const footerActionsCell = tfoot.querySelector('.footer-actions');
            if (footerActionsCell) footerActionsCell.remove();
            const totalCell = tfoot.querySelector('.total-cell');
            if (totalCell) {
                totalCell.querySelector('.copy-btn')?.remove();
                totalCell.colSpan = "1";
            }
        }
        tableToPrint.className = 'print-table';
        prepareAndPrint('Resumen de Facturas Liquidadas', tableToPrint.outerHTML);
    });
    
    function recalcularNotaSubtotal() {
        let subtotal = 0;
        notaValorInputs.forEach(input => {
            subtotal += parseFormattedCurrency(input.value);
        });
        notaSubtotalInput.value = formatCurrency(subtotal);
        recalcularNotaTotalFinal();
    }

    function recalcularNotaTotalFinal() {
        const subtotal = parseFormattedCurrency(notaSubtotalInput.value);
        const iva = parseFormattedCurrency(notaIvaInput.value);
        notaTotalInput.value = formatCurrency(subtotal + iva);
    }

    generarNotaBtn.addEventListener('click', () => {
        const now = new Date();
        document.getElementById('notaAnio').value = now.getFullYear();
        document.getElementById('notaMes').value = String(now.getMonth() + 1).padStart(2, '0');
        document.getElementById('notaDia').value = String(now.getDate()).padStart(2, '0');
        const facturaId = currentCalculation.id ? currentCalculation.id.replace('MDVA-', '') : facturaIdNumberInput.value.trim() || 'N/A';
        document.getElementById('notaFactura').value = facturaId;
        notaDetailInputs.forEach(input => input.value = '');
        notaValorInputs.forEach(input => input.value = '');
        const primerDetalleInput = document.querySelector('.detail-item-input');
        if (primerDetalleInput) primerDetalleInput.value = `Descuento por pronto pago factura MDVA-${facturaId}`;
        
        notaSubtotalInput.value = formatCurrency(currentCalculation.valorDescuento);
        notaIvaInput.value = formatCurrency(currentCalculation.ivaDelDescuento);
        
        const primerValorInput = document.querySelector('.valor-input');
        if (primerValorInput) primerValorInput.value = formatCurrency(currentCalculation.valorDescuento);
        
        ['notaAgencia', 'notaCliente', 'notaRepVentas', 'notaNit', 'notaDireccion', 'notaCiudad', 'notaElaborado', 'notaAutorizado'].forEach(id => document.getElementById(id).value = '');
        document.getElementById('notaCreditoRadio').checked = true;
        recalcularNotaTotalFinal();
        toggleModal(borradorNotasModal, true);
    });

    closeBorradorBtn.addEventListener('click', () => toggleModal(borradorNotasModal, false));
    printNotaBtn.addEventListener('click', () => {
        body.classList.add('printing-nota');
        window.print();
        body.classList.remove('printing-nota');
    });

    notaValorInputs.forEach(input => {
        input.addEventListener('input', recalcularNotaSubtotal);
        input.addEventListener('blur', (e) => {
            const rawValue = parseFormattedCurrency(e.target.value);
            e.target.value = rawValue > 0 ? formatCurrency(rawValue) : '';
        });
        input.addEventListener('focus', (e) => {
            const rawValue = parseFormattedCurrency(e.target.value);
            e.target.value = rawValue > 0 ? rawValue : '';
        });
    });

    notaIvaInput.addEventListener('input', recalcularNotaTotalFinal);
    notaIvaInput.addEventListener('blur', (e) => {
        const rawValue = parseFormattedCurrency(e.target.value);
        e.target.value = rawValue > 0 ? formatCurrency(rawValue) : '';
    });
    notaIvaInput.addEventListener('focus', (e) => {
        const rawValue = parseFormattedCurrency(e.target.value);
        e.target.value = rawValue > 0 ? rawValue : '';
    });
    
    borradorNotasModal.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const currentInput = e.target;
            const currentIndex = notaInputsNavegables.indexOf(currentInput);
            if (currentIndex > -1 && currentIndex < notaInputsNavegables.length - 1) {
                const nextInput = notaInputsNavegables[currentIndex + 1];
                if(nextInput && typeof nextInput.focus === 'function') {
                    nextInput.focus();
                    if(nextInput.select) nextInput.select();
                }
            }
        }
    });

    facturasTablaBody.addEventListener('click', e => {
        if (e.target.closest('.delete-factura-btn')) {
            indexToDelete = parseInt(e.target.closest('.delete-factura-btn').dataset.index, 10);
            toggleModal(confirmDeleteModal, true);
        }
    });
    
    modalDeleteConfirmBtn.addEventListener('click', () => {
        if (indexToDelete > -1) {
            const [deletedItem] = facturasCalculadas.splice(indexToDelete, 1);
            lastDeleted = { factura: deletedItem, index: indexToDelete };
            renderFacturasLista();
            showUndo('Factura eliminada.');
            indexToDelete = -1;
        }
        toggleModal(confirmDeleteModal, false);
    });

    limpiarListaBtn.addEventListener('click', () => {
        if (facturasCalculadas.length > 0) toggleModal(confirmClearModal, true);
    });

    modalClearConfirmBtn.addEventListener('click', () => {
        facturasCalculadas = [];
        renderFacturasLista();
        showNotification('La lista de facturas ha sido limpiada.', 'info');
        toggleModal(confirmClearModal, false);
    });

    undoBtn.addEventListener('click', () => {
        if (lastDeleted.factura) {
            facturasCalculadas.splice(lastDeleted.index, 0, lastDeleted.factura);
            lastDeleted = { factura: null, index: null };
            renderFacturasLista();
            undoContainer.style.display = 'none';
        }
    });
    
    document.addEventListener('click', e => {
        const copyBtn = e.target.closest('.copy-btn');
        if (copyBtn) {
            const targetId = copyBtn.dataset.target;
            const targetElement = document.getElementById(targetId);
            const valueToCopy = parseFormattedCurrency(targetElement.textContent);
            navigator.clipboard.writeText(valueToCopy).then(() => showNotification('¡Valor copiado!', 'success')).catch(() => showNotification('Error al copiar', 'error'));
        }
    });
    
    const escapeCsvField = (field) => {
        let stringField = String(field || '').replace(/\r\n/g, '\n');
        if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
            stringField = '"' + stringField.replace(/"/g, '""') + '"';
        }
        return stringField;
    };

    exportCsvBtn.addEventListener('click', () => {
        const headers = ["#", "ID Factura", "Valor Total", "Dias PP", "% Desc.", "Valor Desc.", "Total a Pagar"];
        let csvContent = headers.join(",") + "\n";
        
        facturasCalculadas.forEach((factura, index) => {
            const rowData = [
                index + 1,
                factura.id || "N/A",
                factura.valorFacturaTotal,
                factura.diasTranscurridos,
                factura.porcentajeDescuentoAplicado.toFixed(2),
                factura.valorDescuento,
                factura.totalPagar
            ].map(escapeCsvField);
            csvContent += rowData.join(",") + "\n";
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `liquidacion_facturas_${new Date().toISOString().slice(0,10)}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
    
    limpiarBtn.addEventListener('click', resetFields);
    themeCheckbox.addEventListener('change', toggleTheme);
    modalDeleteCancelBtn.addEventListener('click', () => toggleModal(confirmDeleteModal, false));
    modalClearCancelBtn.addEventListener('click', () => toggleModal(confirmClearModal, false));
    
    // Inicialización
    loadFacturas();
    applyTheme(localStorage.getItem('theme') || 'light');
    resetFields();
    renderFacturasLista();
    
    const yearSpan = document.getElementById('copyright-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});