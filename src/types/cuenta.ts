export type Empresa = 'eamx' | 'castle';
export type CuentaBancaria = 'rolo_banamex' | 'claudia_banamex' | 'castle_mxn' | 'castle_usd';
export type Firmante = 'rolo' | 'claudia';

export interface LineItem {
  id: string;
  concepto: string;
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

// Conceptos por empresa
export const CONCEPTOS_EAMX: Record<string, string> = {
  legal_consulting: 'Legal Consulting',
  real_estate_advisory: 'Real Estate Advisory Services',
  immigration_services: 'Immigration Services',
  fideicomiso_services: 'Fideicomiso Services',
  legal_representation: 'Legal Representation',
  tax_advisory: 'Tax Advisory',
  document_preparation: 'Document Preparation & Review',
  power_of_attorney: 'Power of Attorney Preparation',
  closing_coordination: 'Closing Coordination',
  otro: 'Other (custom)',
};

export const CONCEPTOS_CASTLE: Record<string, string> = {
  property_management: 'Property Management Services',
  administrative_services: 'Administrative Services',
  repairs_supervision: 'Repairs & Maintenance Supervision',
  renovations_supervision: 'Renovations Supervision',
  guest_services: 'Guest Services',
  cleaning_coordination: 'Cleaning Coordination',
  maintenance_coordination: 'Maintenance Coordination',
  owner_distributions: 'Owner Distributions',
  otro: 'Other (custom)',
};

export const EMPRESAS: Record<Empresa, { 
  nombre: string; 
  subtitulo: string;
  logo: string;
  direccion: string;
  telefono: string;
  email: string;
  web: string;
  conceptos: Record<string, string>;
}> = {
  eamx: {
    nombre: 'EXPAT ADVISOR MX',
    subtitulo: 'Legal & Real Estate Advisory Services',
    logo: 'logo-eamx',
    direccion: 'Puerto Vallarta, Jalisco',
    telefono: '+52 322 111 0294',
    email: 'rolo@expatadvisormx.com',
    web: 'expatadvisormx.com',
    conceptos: CONCEPTOS_EAMX,
  },
  castle: {
    nombre: 'CASTLE SOLUTIONS',
    subtitulo: 'Vacation Rental Management',
    logo: 'logo-castle',
    direccion: 'Paseo del Arque 59, Las Ceibas, Bahia de Banderas, Nay.',
    telefono: '+52 322 306 8482',
    email: 'contabilidad@castlesolutions.biz',
    web: 'castlesolutions.mx',
    conceptos: CONCEPTOS_CASTLE,
  },
};

export interface BankInfo {
  banco: string;
  swift: string;
  aba?: string;
  direccion: string;
  cuenta: string;
  clabe: string;
}

export interface BeneficiaryInfo {
  nombre: string;
  direccion: string;
  rfc: string;
  email: string;
  celular: string;
}

export interface IntermediaryBank {
  banco: string;
  swift: string;
  aba: string;
  ciudad: string;
}

export const CUENTAS_BANCARIAS: Record<CuentaBancaria, {
  label: string;
  moneda: 'USD' | 'MXN';
  intermediario?: IntermediaryBank;
  bancoBeneficiario: BankInfo;
  beneficiario: BeneficiaryInfo;
}> = {
  rolo_banamex: {
    label: 'Rolo - Banamex',
    moneda: 'USD',
    bancoBeneficiario: {
      banco: 'Banamex',
      swift: 'BNMXMXMM',
      direccion: 'Paseo de los Cocoteros 85, Local C-1 Paradise Plaza, Nuevo Vallarta, Nayarit, 63732',
      cuenta: '7016000007919578',
      clabe: '002375701679195789',
    },
    beneficiario: {
      nombre: 'Rolando Romero García',
      direccion: 'Brasil 1434, 5 de Diciembre, Puerto Vallarta, Jalisco, 48350',
      rfc: 'ROGR660427SK8',
      email: 'rolo@expatadvisormx.com',
      celular: '+52 322 111 0294',
    },
  },
  claudia_banamex: {
    label: 'Claudia - Banamex',
    moneda: 'MXN',
    bancoBeneficiario: {
      banco: 'Banamex',
      swift: 'BNMXMXMM',
      direccion: 'Paseo de los Cocoteros 85, Local C-1 Paradise Plaza, Nuevo Vallarta, Nayarit, 63732',
      cuenta: '7005248990',
      clabe: '002375700502489903',
    },
    beneficiario: {
      nombre: 'Claudia Rebeca Castillo Soto',
      direccion: '',
      rfc: 'CASC781111F20',
      email: '',
      celular: '',
    },
  },
  castle_mxn: {
    label: 'Castle Bay PV - Banorte MXN',
    moneda: 'MXN',
    intermediario: {
      banco: 'JP MORGAN CHASE BANK, NA',
      swift: 'CHASUS33XXX',
      aba: '021-000-021',
      ciudad: 'NEW YORK, NY. USA',
    },
    bancoBeneficiario: {
      banco: 'Banco Mercantil del Norte SA',
      swift: 'MENOMXMTXXX',
      direccion: 'Monterrey, NL. MEXICO',
      cuenta: '1333383970',
      clabe: '072560013333839704',
    },
    beneficiario: {
      nombre: 'CASTLE BAY PV, SRL DE CV',
      direccion: 'Paseo del Arque 59, Las Ceibas, Bahia de Banderas, Nay. CP. 63735',
      rfc: 'CBP250521I20',
      email: 'contabilidad@castlesolutions.biz',
      celular: '+52 322 306 8482',
    },
  },
  castle_usd: {
    label: 'Castle Bay PV - Banorte USD',
    moneda: 'USD',
    intermediario: {
      banco: 'JP MORGAN CHASE BANK, NA',
      swift: 'CHASUS33XXX',
      aba: '021-000-021',
      ciudad: 'NEW YORK, NY. USA',
    },
    bancoBeneficiario: {
      banco: 'Banco Mercantil del Norte SA',
      swift: 'MENOMXMTXXX',
      direccion: 'Monterrey, NL. MEXICO',
      cuenta: '1333388694',
      clabe: '072560013333886948',
    },
    beneficiario: {
      nombre: 'CASTLE BAY PV, SRL DE CV',
      direccion: 'Paseo del Arque 59, Las Ceibas, Bahia de Banderas, Nay. CP. 63735',
      rfc: 'CBP250521I20',
      email: 'contabilidad@castlesolutions.biz',
      celular: '+52 322 306 8482',
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
  servicios: [{ id: '1', concepto: '', description: '', amount: 0 }],
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
