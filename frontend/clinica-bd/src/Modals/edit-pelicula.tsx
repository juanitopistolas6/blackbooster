/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { TextField } from '@mui/material'
import { HeroIcons } from '../utils/heroicons'
import { useResult } from '../contexts/result-context'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { useMutation, useQuery } from '@apollo/client'
import { GET_PELICULA } from '../graphql/queries'
import type { Pelicula } from '../types'
import { useEffect, useState } from 'react'
import { ADD_PELICULA, DELETE_PELICULA, EDIT_PELICULA } from '../graphql/mutations'

interface getData {
  getPelicula: Pelicula
}

interface formValues {
  id_pelicula: number
  titulo: string
  id_director: number
  id_genero: number
  id_clasificacion: number
  ano_estreno: string
}

export const EditPacientes = () => {
  const { handleCloseEdit, currentQuery, refetch, modalOption } = useResult()
  const { data } = useQuery<getData>(GET_PELICULA, {
    variables: {
      idPelicula: currentQuery.editVariables
    }
  })

  const emptyForm: formValues = {
    id_pelicula: 0,
    titulo: '',
    id_director: 0,
    id_genero: 0,
    id_clasificacion: 0,
    ano_estreno: ''
  }

  const [deleteTrigger] = useMutation(DELETE_PELICULA, {
    variables: {
      idPelicula: currentQuery.editVariables
    },
    update: () => {
      void refetch()
      handleCloseEdit()
    }
  })

  const {
    ano_estreno,
    id_clasificacion,
    id_director,
    id_genero,
    id_pelicula,
    titulo
  } = data?.getPelicula ?? {}

  const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm<formValues>({
    values: modalOption === 'Edit'
      ? {
          ano_estreno: ano_estreno ?? '',
          id_clasificacion: id_clasificacion ?? 0,
          id_director: id_director ?? 0,
          id_genero: id_genero ?? 0,
          id_pelicula: id_pelicula ?? 0,
          titulo: titulo ?? ''
        }
      : emptyForm
  })

  console.log(currentQuery.editVariables)
  const details = watch()

  const [values, setValues] = useState<formValues>({
    ano_estreno: ano_estreno ?? '',
    id_clasificacion: id_clasificacion ?? 0,
    id_director: id_director ?? 0,
    id_genero: id_genero ?? 0,
    id_pelicula: id_pelicula ?? 0,
    titulo: titulo ?? ''
  })

  const [addTrigger] = useMutation(ADD_PELICULA, {
    variables: values,
    update: () => {
      void refetch()
      handleCloseEdit()
    }
  })

  const [editTrigger] = useMutation(EDIT_PELICULA, {
    variables: values,
    update: () => {
      void refetch()
      handleCloseEdit()
    }
  })

  const handleEdit: SubmitHandler<formValues> = async (data) => {
    void editTrigger({
      variables: values,
      update: () => {
        void refetch()
        handleCloseEdit()
      }
    })
  }

  const handleAdd = () => {
    if (isValid) {
      void addTrigger({
        variables: details,
        update: () => {
          void refetch()
          handleCloseEdit()
        }
      })
    }
  }

  useEffect(() => {
    const subscription = watch((value) => {
      setValues(prev => {
        return {
          ...prev,
          ...value
        }
      })
    }
    )
    return () => { subscription.unsubscribe() }
  }, [details])

  console.log(details)

  return (
    <div className="w-[300px] bg-white h-auto rounded-xl">
      <div className="flex flex-col p-2">
        <div className="flex justify-between items-center mb-4">
          <button
              onClick={handleCloseEdit}
              className='rounded-full w-8 h-8 p-1 flex justify-center items-center hover:bg-gray-200'
            >
            <HeroIcons name='XMarkIcon' className='w-8 h-8' />
          </button>
        </div>
        <form className='px-3 flex flex-col gap-3 justify-center mb-2' onSubmit={handleSubmit(handleEdit)}>
          <TextField
            label="idPelicula"
            id="outlined-size-small"
            size="small"
            disabled ={ modalOption !== 'Add' }
            {...register('id_pelicula',
              {
                required: true,
                valueAsNumber: true,
                validate: value => value >= 0 || 'El idPaciente debe ser un numero'
              }
            )}
            error={!!errors.id_pelicula}
            helperText={errors.id_pelicula?.message}
          />
          <TextField
            label="Titulo"
            id="outlined-size-small"
            size="small"
            InputLabelProps={{
              shrink: true
            }}
            {...register('titulo',
              {
                required: true,
                validate: value => value.length > 4 || 'El titulo debe ser mayor a 4 caracteres'
              }
            )}
            error={!!errors.titulo}
            helperText={errors.titulo?.message}
          />
          <TextField
            label="idDirector"
            id="outlined-size-small"
            size="small"
            InputLabelProps={{
              shrink: true
            }}
            {...register('id_director',
              {
                required: true,
                valueAsNumber: true,
                validate: value => value > 0 || 'El campo debe ser un numero'
              }
            )}
            error={!!errors.id_director}
            helperText={errors.id_director?.message}
          />
          <TextField
            label="idClasificacion"
            id="outlined-size-small"
            size="small"
            InputLabelProps={{
              shrink: true
            }}
            {...register('id_clasificacion',
              {
                required: true,
                valueAsNumber: true,
                validate: value => value > 0 || 'El campo debe ser un numero'
              }
            )}
            error={!!errors.id_clasificacion}
            helperText={errors.id_clasificacion?.message}
          />
          <TextField
            label="idGenero"
            id="outlined-size-small"
            size="small"
            {...register('id_genero',
              {
                required: true,
                valueAsNumber: true,
                validate: value => value >= 0 || 'El campo debe ser un numero'
              }
            )}
            error={!!errors.id_genero}
            helperText={errors.id_genero?.message}
          />
          <TextField
            label="Año de estreno"
            id="outlined-size-small"
            size="small"
            InputLabelProps={{
              shrink: true
            }}
            {...register('ano_estreno',
              {
                required: true,
                validate: value => value.length === 4 || 'El año debe tener 4 caracteres'
              }
            )}
            error={!!errors.ano_estreno}
            helperText={errors.ano_estreno?.message}
          />
          <div className='flex px-3 justify-center gap-3 '>
            { modalOption === 'Edit'
              ? <>
                    <button
                      className='bg-green-500 text-white h-10 w-16 rounded-md'
                      type='submit'
                    >
                      Editar
                    </button>
                    <button className='bg-red-500 text-white h-10 w-16 rounded-md' onClick={() => { void deleteTrigger() }}>
                      Eliminar
                    </button>
                  </>
              : (
                  <button
                    onClick={handleAdd}
                    className='bg-green-500 text-white h-10 w-24 rounded-md'
                  >
                    Añadir
                  </button>
                )
            }
          </div>
        </form>
      </div>
    </div>
  )
}
