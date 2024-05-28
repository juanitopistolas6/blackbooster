import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from '@apollo/server/standalone'
import { gql, UserInputError } from 'apollo-server'
import connection from'./db/mysql.js'

const typeDefs = gql`
  scalar Date

  type Pelicula {
    id_pelicula: Int!
    titulo: String!
    id_director: String!
    id_genero: Int!
    id_clasificacion: String!
    ano_estreno: String!
  }

  type RentaDB {
    id_renta: Int!
    id_usuario: Int!
    id_pelicula: Int!
    fecha_alquilada: String!
    fecha_retorno: String!
  }

  type Renta {
    id_renta: Int!
    titulo: String!
    fecha_alquilada: Date!
    fecha_retorno: Date!
  }

  type MembresiaDB {
    id_membresia: Int!
    id_cliente: Int!
    fecha_adquirida: Date!
  }

  type Usuario {
    id_usuario: Int!
    nombre: String!
    apellido: String!
    edad: Int!
    forma_pago: String!
  }
  
  type Membresia {
    id_membresia: Int!
    nombre: String
    apellido: String
    fecha_adquirida: Date
    fecha_expiracion: Date
  }

  type PeliculaInfo {
    id_pelicula: Int!
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
    getRenta(idRenta: Int!): RentaDB!
    getMembresia(idMembresia: Int!): MembresiaDB!
    getPelicula(idPelicula: Int!): Pelicula!
    getUsuario(idUsuario: Int!): Usuario!
    usuarios: [Usuario]!
    infoPelis: [PeliculaInfo]
    historialRentaCliente(clienteId: Int!): [Renta]
    membresiasExpiradasYProximas: [Membresia]
    montoRentaPorMesTipoGenero: [MontoRentaPorMesTipoGenero]
    peliculasConMultaPorFecha(fechaInicio: Date!, fechaFin: Date!): [PeliculaConMulta]
    top10PeliculasMasRentadas(fechaInicio: Date!, fechaFin: Date!, generoId: Int!): [TopPeliculasMasRentadas]
  }

  type Mutation {
    deleteMembresia(idMembresia: Int!): Boolean!
    deleteRenta(idRenta: Int!): Boolean!
    deletePelicula(idPelicula: Int!): Boolean!
    deleteUsuario(idUsuario: Int!): Boolean!

    updateMembresia(
      id_membresia: Int!
      id_cliente: Int!
      fecha_adquerida: String!
    ): Boolean!

    updateRenta(
      idRenta: Int!
      idUsuario: Int!
      idPelicula: Int!
      fecha_alquilada: String!
      fecha_retorno: String!
    ): Boolean!

    updatePelicula(
      id_pelicula: Int!
      titulo: String!
      id_director: Int!
      id_genero: Int!
      id_clasificacion: Int!
      ano_estreno: String!
    ): Boolean!

    updateUsuario(
      id_usuario: Int!
      nombre: String!
      apellido: String!
      edad: Int!
      forma_pago: String!
    ): Boolean!

    addMembresia(
      id_membresia: Int!
      id_cliente: Int!
      fecha_adquerida: String!
    ): Boolean!

    addRenta(
      idRenta: Int!
      idUsuario: Int!
      idPelicula: Int!
      fecha_alquilada: String!
      fecha_retorno: String!
    ): Boolean!

    addPelicula(
      id_pelicula: Int!
      titulo: String!
      id_director: Int!
      id_genero: Int!
      id_clasificacion: Int!
      ano_estreno: String!
    ): Boolean!

    addUsuario(
      id_usuario: Int!
      nombre: String!
      apellido: String!
      edad: Int!
      forma_pago: String!
    ): Boolean!
  }
`

const callDatabaseMutation = (query, variables) => {
  return new Promise((resolve, reject) => {
    connection.query(query, variables, (error, results) => {
      if (error) {
        console.log(error)
        reject(error)
        throw new UserInputError('ERROR')
      }

      resolve(true)
    })
  })
}

const callDatabase = (query, variables) => {
  return new Promise((resolve, reject) => {
    connection.query(query, variables, (error, results) => {
      if (error) {
        reject(error)
        return []
      }

      if (results.length > 2 ) {
        resolve(results)
      }
      
      resolve(results[0])
    })
  })
}

const resolvers = {
  Mutation: {
    addMembresia: async (root, args) => {
      const query = `
        INSERT INTO membresias (id_membresia, id_cliente, fecha_adquirida)
        VALUES (?, ?, ?)
      `;
      const { id_membresia, id_cliente, fecha_adquerida } = args

      const fecha_adqueridaDATE = new Date(fecha_adquerida)

      try {
        const result = await callDatabaseMutation(query, [id_membresia, id_cliente, fecha_adqueridaDATE]);
        return result;
      } catch (error) {
        console.error('Error in addMembresia resolver:', error);
        throw new UserInputError('Error adding membresia');
      }
    },
    updatePelicula: async (root, args) => {
      const query = `
        UPDATE peliculas
        SET titulo = ?, id_director = ?, id_genero = ?, id_clasificacion = ?, ano_estreno = ?
        WHERE id_pelicula = ?
      `;
      const { titulo, id_director, id_genero, id_clasificacion, ano_estreno, id_pelicula } = args

      try {
        const result = await callDatabaseMutation(query, [titulo, id_director, id_genero, id_clasificacion, ano_estreno, id_pelicula]);
        return result;
      } catch (error) {
        console.error('Error in updatePelicula resolver:', error);
        throw new UserInputError('Error updating pelicula');
      }
    },
    addPelicula: async (root, args) => {
      const query = `
        INSERT INTO peliculas (id_pelicula, titulo, id_director, id_genero, id_clasificacion, ano_estreno)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const { id_pelicula, titulo, id_director, id_genero, id_clasificacion, ano_estreno } = args

      try {
        const result = await callDatabaseMutation(query, [id_pelicula, titulo, id_director, id_genero, id_clasificacion, ano_estreno]);
        return result;
      } catch (error) {
        console.error('Error in addPelicula resolver:', error);
        throw new UserInputError('Error adding pelicula');
      }
    },
    addRenta: async (root, args) => {
      const query = `
        INSERT INTO rentas (id_renta, id_usuario, id_pelicula, fecha_alquilada, fecha_retorno)
        VALUES (?, ?, ?, ?, ?)
      `
      const { idRenta, idUsuario, idPelicula, fecha_alquilada, fecha_retorno } = args

      const fecha_adqueridaDATE = new Date(fecha_alquilada)
      const fecha_retornoDATE = new Date(fecha_retorno)

      try {
        const result = await callDatabaseMutation(query, [idRenta, idUsuario, idPelicula, fecha_adqueridaDATE, fecha_retornoDATE])
        return result
      } catch (error) {
        console.error('Error in addRenta resolver:', error)
        throw new UserInputError('Error adding renta')
      }
    },
    addUsuario: async (root, args) => {
      const query = `
        INSERT INTO usuarios (id_usuario, nombre, apellido, edad, forma_pago)
        VALUES (?, ?, ?, ?, ?)
      `
      const { id_usuario, nombre, apellido, edad, forma_pago } = args

      try {
        const result = await callDatabaseMutation(query, [id_usuario, nombre, apellido, edad, forma_pago]);
        return result;
      } catch (error) {
        console.error('Error in addUsuario resolver:', error);
        throw new UserInputError('Error adding usuario');
      }
    },
    updateMembresia: (root, args) => {
      console.log(args)
      const { id_membresia, id_cliente, fecha_adquerida } = args

      const fecha_adqueridaDATE = new Date(fecha_adquerida)

      return callDatabaseMutation(
        'UPDATE membresias SET id_cliente = ?, fecha_adquirida = ? WHERE id_membresia = ?',
        [id_cliente, fecha_adqueridaDATE, id_membresia]
      )
    },
    updateRenta: (root, args) => {
      const { idRenta, idPelicula, idUsuario, fecha_alquilada, fecha_retorno } = args

      const fecha_adquiridaDATE = new Date(fecha_alquilada)
      const fecha_retornoDATE = new Date(fecha_retorno)

      return callDatabaseMutation(
        'UPDATE rentas SET id_pelicula = ?, id_usuario = ?, fecha_alquilada = ?, fecha_retorno = ? WHERE id_renta = ?',
        [idPelicula, idUsuario, fecha_adquiridaDATE, fecha_retornoDATE, idRenta]
      )
    },
    updateUsuario: (root, args) => {
      const { id_usuario, edad, nombre, apellido, forma_pago } = args
      
      return callDatabaseMutation(
        'UPDATE usuarios SET nombre = ?, apellido = ?, edad = ?, forma_pago = ? WHERE id_usuario = ?',
        [nombre, apellido, edad, forma_pago, id_usuario]
      )
    },
    deleteUsuario: (root, args) => {
      const { idUsuario } = args
      
      return callDatabaseMutation('DELETE FROM usuarios WHERE id_usuario = ?', [idUsuario])
    },
    deletePelicula: (root, args) => {
      const { idPelicula } = args

      return callDatabaseMutation('DELETE FROM peliculas WHERE id_pelicula = ?', [idPelicula])
    },
    deleteMembresia: (root, args) => {
      const { idMembresia } = args

      return callDatabaseMutation('DELETE FROM membresias WHERE id_membresia = ?', [idMembresia])
    },
    deleteRenta: (root, args) => {
      const { idRenta } = args

      return callDatabaseMutation('DELETE FROM rentas WHERE id_renta = ?', [idRenta])
    }
  },
  Query: {
    getRenta: (root, args) => {
      const { idRenta } = args

      return callDatabase('SELECT * FROM rentas WHERE id_renta = ?', [idRenta])
    },
    getMembresia: (root, args) => {
      const { idMembresia } = args

      return callDatabase('SELECT * FROM membresias WHERE id_membresia = ?', [idMembresia])
    },
    getPelicula: (root, args) => {
      const { idPelicula } = args

      return callDatabase('SELECT * FROM peliculas WHERE id_pelicula = ?', [idPelicula])
    },
    getUsuario: (root, args) => {
      const { idUsuario } = args

      return callDatabase('SELECT * FROM usuarios WHERE id_usuario = ?', [idUsuario])
    },
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
