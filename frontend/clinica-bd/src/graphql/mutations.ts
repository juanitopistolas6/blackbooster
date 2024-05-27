import { gql } from '@apollo/client'

export const EDIT_INTERVALO = gql`
mutation($idCita: Int!, $idPaciente: Int!, $idMedico: Int!, $motivo: String!, $fecha: Date!) {
  editCitasIntervalo(idCita: $idCita, idPaciente: $idPaciente, idMedico: $idMedico, motivo: $motivo, fecha: $fecha)
}
`

export const DELETE_INTERVALO = gql`
  mutation($idCita: Int!) {
    deleteCitasIntervalo(idCita: $idCita)
  }
`

export const EDIT_PACIENTE = gql`
  mutation($idPaciente: Int!, $nombre: String!, $apellido: String!) {
    editPaciente(idPaciente: $idPaciente, nombre: $nombre, apellido: $apellido)
  }
`

export const DELETE_PACIENTE = gql`
  mutation($idPaciente: Int!) {
    deletePaciente(idPaciente: $idPaciente)
  }
`

export const EDIT_PACIENTE_ASEGURADO = gql`
  mutation($idEntidad: Int!, $idPaciente: Int!, $idAseguradora: Int!) {
    editPacientesAsegurados(idEntidad: $idEntidad, id_paciente: $idPaciente, id_aseguradora: $idAseguradora)
  }
`

export const DELETE_PACIENTE_ASEGURADO = gql`
  mutation($idEntidad: Int!) {
    deletePacienteAsegurado(idEntidad: $idEntidad)
  }
`

export const EDIT_PAGO = gql`
  mutation($idPago: Int!, $idFactura: Int!, $monto: Float!, $pago: Date!, $idEntidad: Int!) {
    editPago(idPago: $idPago, idFactura: $idFactura, monto: $monto, pago: $pago, idEntidad: $idEntidad)
  }
`

export const DELETE_PAGO = gql`
  mutation($idPago: Int!) {
    deletePago(idPago: $idPago)
  }
`

export const DELETE_FACTURA = gql`
  mutation($idFactura: Int!) {
    deleteFactura(idFactura: $idFactura)
  }
`

export const EDIT_FACTURA = gql`
  mutation($idFactura: Int!, $idPaciente: Int!, $idCita: Int!, $monto: Float!, $fecha: Date!, $pagado: Boolean!) {
    editFactura(idFactura: $idFactura, idPaciente: $idPaciente, idCita: $idCita, monto: $monto, fecha: $fecha, pagado: $pagado)
  }
`

export const ADD_PACIENTE = gql`
  mutation($idPaciente: Int!, $nombre: String!, $apellido: String!) {
    addPaciente(idPaciente: $idPaciente, nombre: $nombre, apellido: $apellido)
  }
`

export const ADD_PAGO = gql`
  mutation($idPago: Int!, $idFactura: Int!, $monto: Float!, $pago: Date, $idEntidad: Int!) {
    addPago(idPago: $idPago, idFactura: $idFactura, monto: $monto, pago: $pago, idEntidad: $idEntidad)
  }
`

export const ADD_PACIENTE_ASEGURADO = gql`
  mutation($idEntidad: Int!, $idPaciente: Int!, $idAseguradora: Int!) {
    addPacienteAsegurado(idEntidad: $idEntidad, idPaciente: $idPaciente, idAseguradora: $idAseguradora)
  }
`

export const ADD_FACTURA = gql`
  mutation($idFactura: Int!, $idPaciente: Int!, $idCita: Int!, $monto: Float!, $fecha: Date!, $pagado: Boolean!) {
    addFactura(idFactura: $idFactura, idPaciente: $idPaciente, idCita: $idCita, monto: $monto, fecha: $fecha, pagado: $pagado)
  }
`

export const ADD_CITA = gql`
  mutation($idCita: Int!, $idPaciente: Int!, $idMedico: Int!, $motivo: String!, $fecha: Date!) {
    addCita(idCita: $idCita, idPaciente: $idPaciente, idMedico: $idMedico, motivo: $motivo, fecha: $fecha)
  }
`

export const DELETE_MEDICO_ASIGNADO = gql`
  mutation($idAsignado: Int!) {
    deleteMedicoAsignado(idAsignado: $idAsignado)
  }
`

export const ADD_MEDICO_ASIGNADO = gql`
  mutation($idAsignado: Int!, $idMedico: Int!, $idPaciente: Int!) {
    addMedicoAsignado(idAsignado: $idAsignado, idMedico: $idMedico, idPaciente: $idPaciente)
  }
`

export const EDIT_MEDICO_ASIGNADO = gql`
  mutation($idAsignado: Int!, $idPaciente: Int!, $idMedico: Int!) {
    editMedicoAsignado(idAsignado: $idAsignado, idPaciente: $idPaciente, idMedico: $idMedico)
  }
`
