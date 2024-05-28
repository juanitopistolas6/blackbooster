import { gql } from '@apollo/client'

export const EDIT_RENTA = gql`
  mutation($idRenta: Int!, $idUsuario: Int!, $idPelicula: Int!, $fecha_alquilada: String!, $fecha_retorno: String!) {
    updateRenta(idRenta: $idRenta, idUsuario: $idUsuario, idPelicula: $idPelicula, fecha_alquilada: $fecha_alquilada, fecha_retorno: $fecha_retorno)
  }
`

export const DELETE_RENTA = gql`
  mutation($idRenta: Int!) {
    deleteRenta(idRenta: $idRenta)
  }
`

export const EDIT_USUARIO = gql`
  mutation($id_usuario: Int!, $nombre: String!, $apellido: String!, $edad: Int!, $forma_pago: String!){
    updateUsuario(id_usuario: $id_usuario, nombre: $nombre, apellido: $apellido, edad: $edad, forma_pago: $forma_pago)
  }
`

export const DELETE_PELICULA = gql`
  mutation($idPelicula: Int!) {
    deletePelicula(idPelicula: $idPelicula)
  }
`

export const DELETE_USUARIO = gql`
  mutation($idUsuario: Int!) {
    deleteUsuario(idUsuario: $idUsuario)
  }
`

export const EDIT_PELICULA = gql`
  mutation($id_pelicula: Int!, $titulo: String!, $id_director: Int!, $id_genero: Int!, $id_clasificacion: Int!, $ano_estreno: String!) {
    updatePelicula(id_pelicula: $id_pelicula, titulo: $titulo, id_director: $id_director, id_genero: $id_genero, id_clasificacion: $id_clasificacion, ano_estreno: $ano_estreno)
  }
`

export const ADD_USUARIO = gql`
  mutation($id_usuario: Int!, $nombre: String!, $apellido: String!, $edad: Int!, $forma_pago: String!) {
    addUsuario(id_usuario: $id_usuario, nombre: $nombre, apellido: $apellido, edad: $edad, forma_pago: $forma_pago)
  }
`

export const ADD_PELICULA = gql`
  mutation($id_pelicula: Int!, $titulo: String!, $id_director: Int!, $id_genero: Int!, $id_clasificacion: Int!, $ano_estreno: String!) {
    addPelicula(id_pelicula: $id_pelicula, titulo: $titulo, id_director: $id_director, id_genero: $id_genero, id_clasificacion: $id_clasificacion, ano_estreno: $ano_estreno)
  }
`

export const ADD_RENTA = gql`
  mutation($id_renta: Int!, $id_usuario: Int!, $id_pelicula: Int!, $fecha_alquilada: String!, $fecha_retorno: String!) {
    addRenta(idRenta: $id_renta, idUsuario: $id_usuario, idPelicula: $id_pelicula, fecha_alquilada: $fecha_alquilada, fecha_retorno: $fecha_retorno)
  }
`

export const DELETE_MEMBRESIA = gql`
  mutation($idMembresia: Int!) {
    deleteMembresia(idMembresia: $idMembresia)
  }
`

export const ADD_MEMBRESIA = gql`
  mutation($id_membresia: Int!, $id_cliente: Int!, $fecha_adquerida: String!) {
    addMembresia(id_membresia: $id_membresia, id_cliente: $id_cliente, fecha_adquerida: $fecha_adquerida)
  }
`

export const EDIT_MEMBRESIA = gql`
  mutation($id_membresia: Int!, $id_cliente: Int!, $fecha_adquerida: String!) {
    updateMembresia(id_membresia: $id_membresia, id_cliente: $id_cliente, fecha_adquerida: $fecha_adquerida)
  }
`
