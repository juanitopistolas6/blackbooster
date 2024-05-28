import { type DocumentNode } from 'graphql'
import { type Query } from './contexts/result-context'
import { ALL_PELICULAS, ALL_USUARIOS_V2, FECHA_MULTAS, HISTORIAL_RENTA, MEMBRESIAS_EXPIRADAS_PROXIMAS, MONTO_RENTA_MES, TOP_PELICULAS } from './graphql/queries'
import { FacturaDetails } from './Modals/fechas'
import { IntervaloModal } from './Modals/intervaloModal'
import { HistorialRentas, Membresias, MontoRentasMes, Peliculas, PeliculasMulta, Top10, Usuarios } from './tableHeads'
import { EditIntervalo } from './Modals/edit-renta'
import { EditPacientes } from './Modals/edit-pelicula'
import { EditMedicoAsignado } from './Modals/edit-membresia'
import { TopPeliculas } from './Modals/top10'
import { EditUsuarios } from './Modals/edit-usuario'

export interface Usuario {
  id_usuario: number
  nombre: string
  apellido: string
  edad: number
  forma_pago: string
}

export interface Pelicula {
  id_pelicula: number
  titulo: string
  id_director: number
  id_genero: number
  id_clasificacion: number
  ano_estreno: string
}

export interface Cita {
  id_renta: number
  id_usuario: number
  id_pelicula: number
  fecha_alquilada: string
  fecha_retorno: string
}

export interface Entidad {
  id_entidad: number
  id_paciente: number
  id_aseguradora: number | null
}

export interface Membresia {
  id_membresia: number
  id_cliente: number
  fecha_adquerida: string
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
  USUARIOS = 'Usuarios'
}

export const DefaultValues: { [key in TABLAS]: Query } = {
  [TABLAS.PELICULAS]: {
    tabla: 'Peliculas',
    query: ALL_PELICULAS,
    labelBtn: 'Añadir pelicula',
    tableHeads: Peliculas,
    variables: {
      idUsuario: 0
    },
    modal: null,
    editComponent: EditPacientes
  },
  [TABLAS.MEMBRESIAS]: {
    tabla: 'Membresias expiradas / por expirar',
    query: MEMBRESIAS_EXPIRADAS_PROXIMAS,
    labelBtn: 'Añadir membresia',
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
    variables: {}
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
    modal: FacturaDetails
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
  [TABLAS.USUARIOS]: {
    tabla: 'Usuarios',
    query: ALL_USUARIOS_V2,
    tableHeads: Usuarios,
    labelBtn: 'Añadir usuario',
    variables: {
      fecha1: '',
      fecha2: ''
    },
    editComponent: EditUsuarios
  }
}
