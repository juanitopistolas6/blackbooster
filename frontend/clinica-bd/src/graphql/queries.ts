import { gql } from '@apollo/client'

export const ALL_PELICULAS = gql`
  query {
    infoPelis {
      id_pelicula
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
      id_membresia
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
export const ALL_USUARIOS_V2 = gql`
  query {
    usuarios {
      id_usuario
      nombre
      apellido
      edad
      forma_pago
    }
  }
`

export const GET_MEMBRESIA = gql`
  query($idMembresia: Int!) {
    getMembresia(idMembresia: $idMembresia) {
      id_membresia
      id_cliente
      fecha_adquirida
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

export const GET_RENTA = gql`
  query($idRenta: Int!) {
    getRenta(idRenta: $idRenta) {
      id_renta
      id_pelicula
      id_usuario
      fecha_alquilada
      fecha_retorno
    }
  }
`

export const GET_USUARIO = gql`
  query($idUsuario: Int!) {
    getUsuario(idUsuario: $idUsuario) {
      apellido
      id_usuario
      nombre
      edad
      forma_pago
    }
  }
`

export const GET_PELICULA = gql`
  query($idPelicula: Int!) {
    getPelicula(idPelicula: $idPelicula) {
      id_pelicula
      titulo
      id_clasificacion
      id_director
      id_genero
      ano_estreno
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
