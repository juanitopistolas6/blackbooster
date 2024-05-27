import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from '@apollo/server/standalone'
import { gql, UserInputError } from 'apollo-server'
import connection from'./db/mysql.js'

const typeDefs = gql`
  scalar Date

  type Renta {
    id_renta: Int!
    titulo: String!
    fecha_alquilada: Date!
    fecha_retorno: Date!
  }

  type Usuario {
    id_usuario: Int!
    nombre: String!
    apellido: String!
    edad: Int!
    forma_pago: String!
  }
  
  type Membresia {
    nombre: String
    apellido: String
    fecha_adquirida: Date
    fecha_expiracion: Date
  }

  type PeliculaInfo {
    titulo: String
    director_nombre: String
    director_apellido: String
    genero: String
    clasificacion: String
    elenco: String
  }
  
  type MontoRentaPorMesTipoGenero {
    ano: Int
    mes: Int
    genero: String
    clasificacion: String
    cantidad_rentas: Int
    monto_total: Float
  }
  
  type PeliculaConMulta {
    titulo: String
    fecha_alquilada: Date
    fecha_retorno: Date
    dias_multa: Int
    monto_multa: Float
  }
  
  type TopPeliculasMasRentadas {
    titulo: String
    cantidad_rentas: Int
  }

  type Query {
    usuarios: [Usuario]!
    infoPelis: [PeliculaInfo]
    historialRentaCliente(clienteId: Int!): [Renta]
    membresiasExpiradasYProximas: [Membresia]
    montoRentaPorMesTipoGenero: [MontoRentaPorMesTipoGenero]
    peliculasConMultaPorFecha(fechaInicio: Date!, fechaFin: Date!): [PeliculaConMulta]
    top10PeliculasMasRentadas(fechaInicio: Date!, fechaFin: Date!, generoId: Int!): [TopPeliculasMasRentadas]
  }
`

const callDatabase = (query, variables) => {
  return new Promise((resolve, reject) => {
    connection.query(query, variables, (error, results) => {
      if (error) {
        reject(error)
        return []
      }

      // console.log(results[0])

      if (results.length > 2 ) {
        console.log(results)
        resolve(results)
      }
      
      resolve(results[0])
    })
  })
}

const resolvers = {
  Query: {
    usuarios: (root, args) => {
      return callDatabase('SELECT * FROM usuarios')
    },
    infoPelis: (root, args) => {
      return callDatabase('CALL InfoPeliculas()')
    },
    top10PeliculasMasRentadas: (root, args) => {
      const { fechaInicio, fechaFin, generoId } = args
      let variables = []

      if (fechaInicio && fechaFin) {
        const fechaInicioDate = new Date(fechaInicio)
        const fechaFinDate = new Date(fechaFin)
        variables = [fechaInicioDate, fechaFinDate, generoId]
      }

      return callDatabase('CALL Top10PeliculasMasRentadas(?, ?, ?)', variables)
    },
    peliculasConMultaPorFecha: (root, args) => {
      const { fechaInicio, fechaFin } = args

      let variables = []

      if (fechaInicio && fechaFin) {
        const fechaInicioDate = new Date(fechaInicio);
        const fechaFinDate = new Date(fechaFin);
        variables = [fechaInicioDate, fechaFinDate];
      }

      return callDatabase('CALL PeliculasConMultaPorFecha(?, ?)', variables);
    },
    historialRentaCliente: async (root, args) => {
      const { clienteId } = args

      return callDatabase('CALL HistorialRentaCliente(?)', [clienteId])
    },
    membresiasExpiradasYProximas: (root, args) => {
      return callDatabase('CALL MembresiasExpiradasYProximas()')
    },
    montoRentaPorMesTipoGenero: () => {
      return callDatabase('CALL MontoRentaPorMesTipoGenero()')
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
})

console.log(`🚀  Server ready at: ${url}`)
