import { gql } from '@apollo/client'

export const ALL_PELICULAS = gql`
  query {
    infoPelis {
      titulo
      director_nombre
      director_apellido
      elenco
      genero
    }
  }
`

export const ALL_USUARIOS = gql`
  query {
    usuarios {
      id_usuario
      nombre
      apellido
    }
  }
`

export const MEMBRESIAS_EXPIRADAS_PROXIMAS = gql`
  query {
    membresiasExpiradasYProximas {
      nombre
      apellido
      fecha_adquirida
      fecha_expiracion
    }
  }
`

export const HISTORIAL_RENTA = gql`
  query($clienteId: Int!) {
    historialRentaCliente(clienteId: $clienteId) {
      id_renta
      titulo
      fecha_alquilada
      fecha_retorno
    }
  }
`

export const MONTO_RENTA_MES = gql`
  query {
    montoRentaPorMesTipoGenero {
      mes
      genero
      cantidad_rentas
      monto_total
      ano
    }
  }
`

export const FECHA_MULTAS = gql`
  query($fechaInicio: Date!, $fechaFin: Date!) {
    peliculasConMultaPorFecha(fechaInicio: $fechaInicio, fechaFin: $fechaFin) {
      titulo
      monto_multa
      fecha_alquilada
      fecha_retorno
      dias_multa
    }
  }
`

export const TOP_PELICULAS = gql`
  query($fechaInicio: Date!, $fechaFin: Date!, $generoId: Int!) {
    top10PeliculasMasRentadas(fechaInicio: $fechaInicio, fechaFin: $fechaFin, generoId: $generoId) {
      titulo
      cantidad_rentas
    }
  }
`
export const FACTUA_DETAILS = gql`
  query {
    facturasDetails {
      id_factura
      Paciente
      motivo
    }
  }
`

export const PACIENTES_ESPECIALIDAD = gql`
  query($idEspecialidad: Int!) {
    pacientesEspecialidad(idEspecialidad: $idEspecialidad) {
      Paciente
      especialidad
    }
  }
`

export const ALL_ESPECIALIDADES = gql`
  query {
    allEspecialidades {
      id_especialidad
      especialidad
    }
  }
`

export const FACTURAS_INTERVALO = gql`
  query($fecha1: Date!, $fecha2: Date!) {
    facturasIntervalo(fecha1: $fecha1, fecha2: $fecha2) {
      id_factura
      motivo
      Paciente
      monto
      fecha_emitida
      pagado
    }
  }
`

export const GET_INTERVAL_CITAS = gql`
  query($idCita: Int!) {
    getCitasIntervalo(idCita: $idCita) {
      id_citas
      id_medico
      id_paciente
      fecha
      motivo
    }
  }
`

export const GET_PACIENTE = gql`
  query($idPaciente: Int!) {
    getPaciente(idPaciente: $idPaciente) {
      id_paciente
      nombre
      apellido
    }
  }
`

export const GET_ENTIDAD = gql`
  query($idEntidad: Int!) {
    getEntidad(idEntidad: $idEntidad) {
      id_aseguradora
      id_paciente
      id_entidad
    }
  }
`

export const GET_PAGO = gql`
  query($idPago: Int!) {
    getPago(idPago: $idPago) {
      id_entidad
      id_factura
      id_pago
      monto
      pago_recibido
    }
  }
`

export const GET_FACTURA = gql`
  query($idFactura: Int!) {
    getFactura(idFactura: $idFactura) {
      id_factura
      id_cita
      id_paciente
      monto
      pagado
      fecha_emitida
    }
  }
`

export const GET_MEDICO_ASIGNADO = gql`
  query($idAsignado: Int!) {
    getMedicoAsignado(idAsignado: $idAsignado) {
      id_asignado
      id_medico
      id_paciente
    }
  }
`
