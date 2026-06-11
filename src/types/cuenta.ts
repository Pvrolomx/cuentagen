export type Empresa = 'eamx' | 'castle';
export type CuentaBancaria = 'rolo_banamex' | 'claudia_banamex' | 'castle_mxn' | 'castle_usd';
export type Firmante = 'rolo' | 'claudia';

export interface LineItem {
  id: string;
  description: string;
  amount: number;
}

export interface CuentaData {
  empresa: Empresa;
  fecha: string;
  cliente: string;
  referencia: string;
  servicios: LineItem[];
  gastos: LineItem[];
  cuentaBancaria: CuentaBancaria;
  firmante: Firmante;
  moneda: 'USD' | 'MXN';
}

export const EMPRESAS: Record<Empresa, { 
  nombre: string; 
  subtitulo: string;
  logo: string;
  direccion: string;
  telefono: string;
  email: string;
  web: string;
}> = {
  eamx: {
    nombre: 'EXPAT ADVISOR MX',
    subtitulo: 'Legal & Real Estate Advisory Services',
    logo: 'logo-eamx',
    direccion: 'Puerto Vallarta, Jalisco',
    telefono: '+52 322 111 0294',
    email: 'rolo@expatadvisormx.com',
    web: 'expatadvisormx.com',
  },
  castle: {
    nombre: 'CASTLE SOLUTIONS',
    subtitulo: 'Vacation Rental Management',
    logo: 'logo-castle',
    direccion: 'Paseo del Arque 59, Las Ceibas, Bahia de Banderas, Nay.',
    telefono: '+52 322 111 0294',
    email: 'contabilidad@castlesolutions.biz',
    web: 'castlesolutions.mx',
  },
};

export const CUENTAS_BANCARIAS: Record<CuentaBancaria, {
  label: string;
  beneficiario: string;
  direccion: string;
  banco: string;
  direccionBanco: string;
  swift: string;
  clabe: string;
  cuenta: string;
  rfc: string;
  moneda: 'USD' | 'MXN';
  intermediario?: {
    banco: string;
    swift: string;
    aba: string;
    ciudad: string;
  };
}> = {
  rolo_banamex: {
    label: 'Rolo - Banamex',
    beneficiario: 'Rolando Romero García',
    direccion: 'Brasil 1434, 5 de Diciembre, Puerto Vallarta, Jalisco, 48350',
    banco: 'Banamex',
    direccionBanco: 'Paseo de los Cocoteros 85, Local C-1 Paradise Plaza, Nuevo Vallarta, Nayarit, 63732',
    swift: 'BNMXMXMM',
    clabe: '002375701679195789',
    cuenta: '7016000007919578',
    rfc: 'ROGR660427SK8',
    moneda: 'USD',
  },
  claudia_banamex: {
    label: 'Claudia - Banamex',
    beneficiario: 'Claudia Rebeca Castillo Soto',
    direccion: '',
    banco: 'Banamex',
    direccionBanco: 'Paseo de los Cocoteros 85, Local C-1 Paradise Plaza, Nuevo Vallarta, Nayarit, 63732',
    swift: 'BNMXMXMM',
    clabe: '002375700502489903',
    cuenta: '7005248990',
    rfc: 'CASC781111F20',
    moneda: 'MXN',
  },
  castle_mxn: {
    label: 'Castle Bay PV - Banorte MXN',
    beneficiario: 'CASTLE BAY PV, SRL DE CV',
    direccion: 'Paseo del Arque 59, Las Ceibas, Bahia de Banderas, Nay. CP. 63735',
    banco: 'Banco Mercantil del Norte SA (Banorte)',
    direccionBanco: 'Monterrey, NL. MEXICO',
    swift: 'MENOMXMTXXX',
    clabe: '072560013333839704',
    cuenta: '1333383970',
    rfc: 'CBP250521I20',
    moneda: 'MXN',
  },
  castle_usd: {
    label: 'Castle Bay PV - Banorte USD',
    beneficiario: 'CASTLE BAY PV, SRL DE CV',
    direccion: 'Paseo del Arque 59, Las Ceibas, Bahia de Banderas, Nay. CP. 63735',
    banco: 'Banco Mercantil del Norte SA (Banorte)',
    direccionBanco: 'Monterrey, NL. MEXICO',
    swift: 'MENOMXMTXXX',
    clabe: '072560013333886948',
    cuenta: '1333388694',
    rfc: 'CBP250521I20',
    moneda: 'USD',
    intermediario: {
      banco: 'JP MORGAN CHASE BANK, NA',
      swift: 'CHASUS33XXX',
      aba: '021-000-021',
      ciudad: 'NEW YORK, NY, USA',
    },
  },
};

export const FIRMANTES: Record<Firmante, {
  nombre: string;
  titulo: string;
  firma: string;
}> = {
  rolo: {
    nombre: 'Lic. Rolando Romero García',
    titulo: '',
    firma: 'firma-rolo',
  },
  claudia: {
    nombre: 'Claudia Castillo',
    titulo: 'Castle Solutions',
    firma: 'firma-claudia',
  },
};

export const DEFAULT_CUENTA: CuentaData = {
  empresa: 'eamx',
  fecha: new Date().toISOString().slice(0, 10),
  cliente: '',
  referencia: '',
  servicios: [{ id: '1', description: '', amount: 0 }],
  gastos: [],
  cuentaBancaria: 'rolo_banamex',
  firmante: 'rolo',
  moneda: 'USD',
};

export async function loadAsset(name: string): Promise<string> {
  try {
    const response = await fetch(`/${name}.b64`);
    return await response.text();
  } catch {
    return '';
  }
}
