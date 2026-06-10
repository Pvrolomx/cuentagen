'use client';

import { useState, useEffect } from 'react';
import type { CuentaData, Empresa, CuentaBancaria, Firmante, LineItem } from '@/types/cuenta';
import { DEFAULT_CUENTA, EMPRESAS, CUENTAS_BANCARIAS, FIRMANTES } from '@/types/cuenta';
import { generateId } from '@/lib/utils';

export default function Home() {
  const [data, setData] = useState<CuentaData>(DEFAULT_CUENTA);
  const [loading, setLoading] = useState(false);

  const updateData = (partial: Partial<CuentaData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  };

  // Auto-save
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cuentagen_draft');
      if (saved) setData({ ...DEFAULT_CUENTA, ...JSON.parse(saved) });
    } catch {}
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      try { localStorage.setItem('cuentagen_draft', JSON.stringify(data)); } catch {}
    }, 1000);
    return () => clearTimeout(t);
  }, [data]);

  // Line items handlers
  const addServicio = () => {
    updateData({ servicios: [...data.servicios, { id: generateId(), description: '', amount: 0 }] });
  };
  const updateServicio = (id: string, field: keyof LineItem, value: string | number) => {
    updateData({
      servicios: data.servicios.map(s => s.id === id ? { ...s, [field]: value } : s)
    });
  };
  const removeServicio = (id: string) => {
    if (data.servicios.length > 1) {
      updateData({ servicios: data.servicios.filter(s => s.id !== id) });
    }
  };

  const addGasto = () => {
    updateData({ gastos: [...data.gastos, { id: generateId(), description: '', amount: 0 }] });
  };
  const updateGasto = (id: string, field: keyof LineItem, value: string | number) => {
    updateData({
      gastos: data.gastos.map(g => g.id === id ? { ...g, [field]: value } : g)
    });
  };
  const removeGasto = (id: string) => {
    updateData({ gastos: data.gastos.filter(g => g.id !== id) });
  };

  const total = [...data.servicios, ...data.gastos]
    .reduce((sum, item) => sum + (item.amount || 0), 0);

  const handleGenerate = async () => {
    if (!data.cliente) {
      alert('Por favor ingresa el nombre del cliente');
      return;
    }
    setLoading(true);
    try {
      const { generateCuentaPdf } = await import('@/lib/generatePdf');
      const blob = await generateCuentaPdf(data);
      
      const clientName = data.cliente.split(' ')[0].toUpperCase();
      const filename = `Cuenta_${clientName}_${data.fecha}.pdf`;
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert('Error generando PDF');
    }
    setLoading(false);
  };

  const handleReset = () => {
    setData(DEFAULT_CUENTA);
    try { localStorage.removeItem('cuentagen_draft'); } catch {}
  };

  return (
    <div className="min-h-screen py-6 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-light tracking-wide text-gray-800">CUENTAGEN</h1>
          <p className="text-gray-400 text-xs">Generador de Cuentas de Cobro</p>
        </div>

        <div className="space-y-4">
          {/* Empresa y Fecha */}
          <div className="cg-card">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="cg-label">Empresa</label>
                <div className="cg-radio-group">
                  {Object.entries(EMPRESAS).map(([key, emp]) => (
                    <div key={key} className="cg-radio-option flex-1">
                      <input type="radio" id={`emp-${key}`} name="empresa" value={key}
                        checked={data.empresa === key}
                        onChange={() => updateData({ empresa: key as Empresa })}
                      />
                      <label htmlFor={`emp-${key}`}>{key === 'eamx' ? '🏢 EAMx' : '🏠 Castle'}</label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="cg-label">Fecha</label>
                <input type="date" className="cg-input" value={data.fecha}
                  onChange={(e) => updateData({ fecha: e.target.value })}
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="cg-label">Cliente</label>
              <input type="text" className="cg-input" placeholder="Nombre del cliente"
                value={data.cliente} onChange={(e) => updateData({ cliente: e.target.value })}
              />
            </div>
            
            <div>
              <label className="cg-label">Referencia (Re:)</label>
              <input type="text" className="cg-input" 
                placeholder="e.g., Unit 5204 – La Joya de Mismaloya – Closing"
                value={data.referencia} onChange={(e) => updateData({ referencia: e.target.value })}
              />
            </div>
          </div>

          {/* Servicios */}
          <div className="cg-card">
            <div className="flex justify-between items-center mb-3">
              <label className="cg-label mb-0">Servicios Profesionales</label>
              <select className="text-xs border rounded px-2 py-1" value={data.moneda}
                onChange={(e) => updateData({ moneda: e.target.value as 'USD' | 'MXN' })}>
                <option value="USD">USD</option>
                <option value="MXN">MXN</option>
              </select>
            </div>
            
            {data.servicios.map((item, idx) => (
              <div key={item.id} className="flex gap-2 mb-2">
                <input type="text" className="cg-input flex-1" placeholder="Descripción del servicio"
                  value={item.description}
                  onChange={(e) => updateServicio(item.id, 'description', e.target.value)}
                />
                <input type="number" className="cg-input w-28" placeholder="Monto" min="0" step="0.01"
                  value={item.amount || ''}
                  onChange={(e) => updateServicio(item.id, 'amount', parseFloat(e.target.value) || 0)}
                />
                {data.servicios.length > 1 && (
                  <button onClick={() => removeServicio(item.id)} className="text-red-400 hover:text-red-600 px-2">✕</button>
                )}
              </div>
            ))}
            <button onClick={addServicio} className="text-xs text-brand-gold hover:underline">+ Agregar servicio</button>
          </div>

          {/* Gastos */}
          <div className="cg-card">
            <label className="cg-label">Gastos Adicionales (opcional)</label>
            
            {data.gastos.map((item) => (
              <div key={item.id} className="flex gap-2 mb-2">
                <input type="text" className="cg-input flex-1" placeholder="Descripción del gasto"
                  value={item.description}
                  onChange={(e) => updateGasto(item.id, 'description', e.target.value)}
                />
                <input type="number" className="cg-input w-28" placeholder="Monto" min="0" step="0.01"
                  value={item.amount || ''}
                  onChange={(e) => updateGasto(item.id, 'amount', parseFloat(e.target.value) || 0)}
                />
                <button onClick={() => removeGasto(item.id)} className="text-red-400 hover:text-red-600 px-2">✕</button>
              </div>
            ))}
            <button onClick={addGasto} className="text-xs text-brand-gold hover:underline">+ Agregar gasto</button>
            
            {/* Total */}
            <div className="mt-4 pt-3 border-t flex justify-between items-center">
              <span className="font-medium text-gray-600">TOTAL</span>
              <span className="text-xl font-bold text-gray-800">
                {data.moneda === 'USD' ? '$' : 'MX$'}{total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Cuenta Bancaria */}
          <div className="cg-card">
            <label className="cg-label">Cuenta Bancaria</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(CUENTAS_BANCARIAS).map(([key, cuenta]) => (
                <div key={key} className="cg-radio-option">
                  <input type="radio" id={`cuenta-${key}`} name="cuenta" value={key}
                    checked={data.cuentaBancaria === key}
                    onChange={() => updateData({ cuentaBancaria: key as CuentaBancaria })}
                  />
                  <label htmlFor={`cuenta-${key}`} className="text-left">
                    <span className="block font-medium">{cuenta.label}</span>
                    <span className="text-[10px] text-gray-400">{cuenta.moneda}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Firmante */}
          <div className="cg-card">
            <label className="cg-label">Firmante</label>
            <div className="cg-radio-group">
              {Object.entries(FIRMANTES).map(([key, f]) => (
                <div key={key} className="cg-radio-option flex-1">
                  <input type="radio" id={`firma-${key}`} name="firmante" value={key}
                    checked={data.firmante === key}
                    onChange={() => updateData({ firmante: key as Firmante })}
                  />
                  <label htmlFor={`firma-${key}`}>{key === 'rolo' ? '✍️ Rolo' : '✍️ Claudia'}</label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="mt-6 space-y-3">
          <button onClick={handleGenerate} disabled={loading || !data.cliente}
            className="cg-btn-primary">
            {loading ? 'Generando...' : 'Generar PDF'}
          </button>
          <button onClick={handleReset} className="w-full py-2 text-sm text-gray-500 hover:text-gray-700">
            Limpiar formulario
          </button>
        </div>

        <p className="text-center text-gray-300 text-xs mt-6">
          EXPAT ADVISOR MX · CASTLE SOLUTIONS · 2026
        </p>
      </div>
    </div>
  );
}
