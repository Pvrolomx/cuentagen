import jsPDF from 'jspdf';
import type { CuentaData } from '@/types/cuenta';
import { EMPRESAS, CUENTAS_BANCARIAS, FIRMANTES, loadAsset } from '@/types/cuenta';
import { formatDate, formatMoney } from './utils';

export async function generateCuentaPdf(data: CuentaData): Promise<Blob> {
  const empresa = EMPRESAS[data.empresa];
  const cuenta = CUENTAS_BANCARIAS[data.cuentaBancaria];
  const firmante = FIRMANTES[data.firmante];
  
  // Cargar assets
  const logoBase64 = await loadAsset(empresa.logo);
  const firmaBase64 = await loadAsset(firmante.firma);
  
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  
  let y = margin;
  
  // === HEADER ===
  if (logoBase64) {
    try {
      const logoWidth = data.empresa === 'eamx' ? 35 : 40;
      const logoHeight = data.empresa === 'eamx' ? 19 : 12;
      doc.addImage(
        `data:image/png;base64,${logoBase64}`,
        'PNG', margin, y, logoWidth, logoHeight
      );
    } catch (e) { console.error('Logo error:', e); }
  }
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(26, 26, 26);
  doc.text(empresa.nombre, pageWidth / 2, y + 8, { align: 'center' });
  
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(102, 102, 102);
  doc.text(empresa.subtitulo, pageWidth / 2, y + 14, { align: 'center' });
  
  y += 28;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(51, 51, 51);
  doc.text(`${empresa.direccion}, ${formatDate(data.fecha)}`, margin, y);
  
  if (data.referencia) {
    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('Re: ', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(data.referencia, margin + 8, y);
  }
  
  // === SERVICES TABLE ===
  y += 15;
  
  doc.setFillColor(245, 245, 245);
  doc.rect(margin, y - 4, contentWidth, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(51, 51, 51);
  doc.text('PROFESSIONAL FEES / CONCEPT', margin + 2, y);
  doc.text('AMOUNT (' + data.moneda + ')', pageWidth - margin - 2, y, { align: 'right' });
  
  y += 8;
  doc.setDrawColor(229, 229, 229);
  doc.line(margin, y - 4, pageWidth - margin, y - 4);
  
  let total = 0;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  // Services - mostrar si hay monto > 0
  for (const item of data.servicios) {
    if (item.amount <= 0) continue;
    
    const desc = item.description || 'Professional Services';
    const lines = doc.splitTextToSize(desc, contentWidth - 50);
    for (let i = 0; i < lines.length; i++) {
      doc.text(lines[i], margin + 2, y);
      if (i === 0) {
        doc.text(formatMoney(item.amount, data.moneda), pageWidth - margin - 2, y, { align: 'right' });
      }
      y += 5;
    }
    y += 3;
    total += item.amount;
  }
  
  // Additional expenses
  const validGastos = data.gastos.filter(g => g.amount > 0);
  if (validGastos.length > 0) {
    y += 5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setFillColor(250, 250, 250);
    doc.rect(margin, y - 4, contentWidth, 7, 'F');
    doc.text('ADDITIONAL OUT-OF-POCKET EXPENSES', margin + 2, y);
    y += 10;
    
    doc.setFont('helvetica', 'normal');
    for (const item of validGastos) {
      const desc = item.description || 'Additional expense';
      const lines = doc.splitTextToSize(desc, contentWidth - 50);
      for (let i = 0; i < lines.length; i++) {
        doc.text(lines[i], margin + 2, y);
        if (i === 0) {
          doc.text(formatMoney(item.amount, data.moneda), pageWidth - margin - 2, y, { align: 'right' });
        }
        y += 5;
      }
      y += 2;
      total += item.amount;
    }
  }
  
  // Total
  y += 5;
  doc.setDrawColor(51, 51, 51);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('TOTAL DUE', margin + 2, y);
  doc.text(formatMoney(total, data.moneda), pageWidth - margin - 2, y, { align: 'right' });
  
  // === WIRE TRANSFER INSTRUCTIONS ===
  y += 15;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(201, 168, 76);
  doc.text('WIRE TRANSFER INSTRUCTIONS', margin, y);
  
  y += 8;
  doc.setDrawColor(201, 168, 76);
  doc.setLineWidth(0.3);
  doc.line(margin, y - 3, pageWidth - margin, y - 3);
  
  const labelX = margin + 2;
  const valueX = margin + 45;
  doc.setFontSize(9);
  doc.setTextColor(51, 51, 51);
  
  const wireFields = [
    ['Beneficiary', cuenta.beneficiario],
    ['Address', cuenta.direccion],
    ['Bank', cuenta.banco],
    ['Bank Address', cuenta.direccionBanco],
    ['SWIFT', cuenta.swift],
    ['CLABE', cuenta.clabe],
    ['Account Number', cuenta.cuenta],
    ['RFC', cuenta.rfc],
  ].filter(([_, v]) => v);
  
  for (const [label, value] of wireFields) {
    doc.setFont('helvetica', 'bold');
    doc.text(label as string, labelX, y);
    doc.setFont('helvetica', 'normal');
    
    const lines = doc.splitTextToSize(value as string, contentWidth - 50);
    for (let i = 0; i < lines.length; i++) {
      doc.text(lines[i], valueX, y);
      y += 5;
    }
  }
  
  if (cuenta.intermediarios && cuenta.intermediarios.length > 0) {
    y += 3;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('Intermediary Bank (pick any):', labelX, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    for (const bank of cuenta.intermediarios) {
      doc.text('• ' + bank, labelX + 2, y);
      y += 4;
    }
  }
  
  // === SIGNATURE (CENTRADA) ===
  y += 15;
  const signatureWidth = 50;
  const signatureCenterX = pageWidth / 2 - (signatureWidth / 2);
  
  if (firmaBase64) {
    try {
      doc.addImage(
        `data:image/jpeg;base64,${firmaBase64}`,
        'JPEG',
        signatureCenterX,
        y,
        signatureWidth,
        25
      );
      y += 28;
    } catch {
      doc.setDrawColor(200, 200, 200);
      doc.line(signatureCenterX, y + 15, signatureCenterX + signatureWidth, y + 15);
      y += 20;
    }
  } else {
    doc.setDrawColor(200, 200, 200);
    doc.line(signatureCenterX, y + 15, signatureCenterX + signatureWidth, y + 15);
    y += 20;
  }
  
  // Nombre del firmante (centrado)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(26, 26, 26);
  doc.text(firmante.nombre, pageWidth / 2, y, { align: 'center' });
  
  if (firmante.titulo) {
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(firmante.titulo, pageWidth / 2, y, { align: 'center' });
  }
  
  // === FOOTER ===
  y = pageHeight - 15;
  doc.setFontSize(9);
  doc.setTextColor(201, 168, 76);
  doc.text(empresa.web, margin, y);
  doc.text(empresa.telefono, pageWidth - margin, y, { align: 'right' });
  
  return doc.output('blob');
}
