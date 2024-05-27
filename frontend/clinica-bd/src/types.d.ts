import { type DocumentNode } from 'graphql'
import { type Query } from './contexts/result-context'
import { ALL_PELICULAS, FACTURAS_INTERVALO, FECHA_MULTAS, HISTORIAL_RENTA, MEMBRESIAS_EXPIRADAS_PROXIMAS, MONTO_RENTA_MES, TOP_PELICULAS } from './graphql/queries'
import { FacturaDetails } from './Modals/factura-details'
import { IntervaloModal } from './Modals/intervaloModal'
import { FacturasIntervalo, HistorialRentas, Membresias, MontoRentasMes, Peliculas, PeliculasMulta, Top10 } from './tableHeads'
import { EditIntervalo } from './Modals/edit-intervalo'
import { EditPacientes } from './Modals/edit-pacientes'
import { EditPacienteAsegurado } from './Modals/edit-paciente-asegurado'
import { EditPagosIntervalo } from './Modals/edit-pagos-intervalo'
import { EditFacturas } from './Modals/edit-facturas-intervalo'
import { EditMedicoAsignado } from './Modals/edit-medico-asignado'
import { TopPeliculas } from './Modals/top10'

export interface Paciente {
  id_paciente: number
  nombre: string
  apellido: string
}

export interface Pago {
  id_pago: number
  id_factura: number
  monto: float
  pago_recibido: string
  id_entidad: number
}

export interface Cita {
  id_citas: number
  id_medico: number
  id_paciente: number
  fecha: string
  motivo: string
}

export interface Entidad {
  id_entidad: number
  id_paciente: number
  id_aseguradora: number | null
}

export interface PacienteAsignado {
  id_asignado: number
  id_paciente: number
  id_medico: number
}

export interface Medico {
  id_medico: number
  nombre: string
  apellido: string
  id_especialidad?: number
}

export interface Factura {
  id_factura: number
  id_cita: number
  id_paciente: number
  monto: number
  fecha_emitida: string
  pagado: boolean
}

export interface FacturaDetail {
  id_factura: number
  Paciente: string
  motivo: string
}

export interface Especialidad {
  id_especialidad: number
  especialidad: string
}

export interface EditQuery {
  query: DocumentNode
  type: number
}

export enum TABLAS {
  PELICULAS = 'Peliculas',
  MEMBRESIAS = 'Membresias',
  HISTORIAL_RENTA = 'Historial de renta',
  MONTO_TOTAL = 'Renta por mes y monto total',
  PELICULAS_MULTA = 'Peliculas con multa',
  TOP10_PELICULAS = 'Top 10 peliculas',
  FACTURAS_INTERVALO = 'Facturas por intervalo'
}

export const DefaultValues: { [key in TABLAS]: Query } = {
  [TABLAS.PELICULAS]: {
    tabla: 'Peliculas',
    query: ALL_PELICULAS,
    labelBtn: 'Añadir pelicula',
    tableHeads: Peliculas,
    variables: {},
    modal: null,
    editComponent: EditPacientes
  },
  [TABLAS.MEMBRESIAS]: {
    tabla: 'Membresias expiradas / por expirar',
    query: MEMBRESIAS_EXPIRADAS_PROXIMAS,
    labelBtn: 'Añadir paciente asignado',
    tableHeads: Membresias,
    variables: {
      medicoId: 0
    },
    editComponent: EditMedicoAsignado
  },
  [TABLAS.MONTO_TOTAL]: {
    tabla: 'Monto de renta por mes',
    query: MONTO_RENTA_MES,
    tableHeads: MontoRentasMes,
    variables: {},
    editComponent: EditPacienteAsegurado
  },
  [TABLAS.HISTORIAL_RENTA]: {
    tabla: 'Historial de renta',
    query: HISTORIAL_RENTA,
    labelBtn: 'Añadir renta',
    tableHeads: HistorialRentas,
    variables: {
      clienteId: 0
    },
    modal: IntervaloModal,
    editComponent: EditIntervalo
  },
  [TABLAS.PELICULAS_MULTA]: {
    tabla: 'Peliculas con multa por fecha',
    query: FECHA_MULTAS,
    tableHeads: PeliculasMulta,
    variables: {
      fechaInicio: '',
      fechaFin: ''
    },
    modal: FacturaDetails,
    editComponent: EditPagosIntervalo
  },
  [TABLAS.TOP10_PELICULAS]: {
    tabla: 'Top 10 peliculas',
    labelBtn: null,
    query: TOP_PELICULAS,
    tableHeads: Top10,
    variables: {
      fechaInicio: '',
      fechaFin: ''
    },
    modal: TopPeliculas,
    editComponent: null
  },
  [TABLAS.FACTURAS_INTERVALO]: {
    tabla: 'Facturas por intervalo',
    query: FACTURAS_INTERVALO,
    tableHeads: FacturasIntervalo,
    labelBtn: 'Añadir factura',
    variables: {
      fecha1: '',
      fecha2: ''
    },
    modal: IntervaloModal,
    editComponent: EditFacturas
  }
}
