/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { TextField } from '@mui/material'
import { HeroIcons } from '../utils/heroicons'
import { useResult } from '../contexts/result-context'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { useMutation, useQuery } from '@apollo/client'
import { GET_USUARIO } from '../graphql/queries'
import type { Usuario } from '../types'
import { useEffect, useState } from 'react'
import { ADD_USUARIO, DELETE_USUARIO, EDIT_USUARIO } from '../graphql/mutations'

interface getData {
  getUsuario: Usuario
}

interface formValues {
  id_usuario: number
  nombre: string
  apellido: string
  edad: number
  forma_pago: string
}

export const EditUsuarios = () => {
  const { handleCloseEdit, currentQuery, refetch, modalOption } = useResult()
  const { data } = useQuery<getData>(GET_USUARIO, {
    variables: {
      idUsuario: currentQuery.editVariables
    }
  })

  const emptyForm: formValues = {
    id_usuario: 0,
    nombre: '',
    apellido: '',
    edad: 0,
    forma_pago: ''
  }

  const [deleteTrigger] = useMutation(DELETE_USUARIO, {
    variables: {
      idUsuario: currentQuery.editVariables
    },
    update: () => {
      void refetch()
      handleCloseEdit()
    }
  })

  const {
    apellido,
    edad,
    forma_pago,
    id_usuario,
    nombre
  } = data?.getUsuario ?? {}

  const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm<formValues>({
    values: modalOption === 'Edit'
      ? {
          id_usuario: id_usuario ?? 0,
          nombre: nombre ?? '',
          apellido: apellido ?? '',
          edad: edad ?? 0,
          forma_pago: forma_pago ?? ''
        }
      : emptyForm
  })

  const details = watch()

  const [values, setValues] = useState<formValues>({
    id_usuario: id_usuario ?? 0,
    nombre: nombre ?? '',
    apellido: apellido ?? '',
    edad: edad ?? 0,
    forma_pago: forma_pago ?? ''
  })

  console.log(values)

  const [addTrigger] = useMutation(ADD_USUARIO, {
    variables: values,
    update: () => {
      void refetch()
      handleCloseEdit()
    }
  })

  const [editTrigger] = useMutation(EDIT_USUARIO, {
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
            label="idUsuario"
            id="outlined-size-small"
            size="small"
            disabled ={ modalOption !== 'Add' }
            {...register('id_usuario',
              {
                required: true,
                valueAsNumber: true,
                validate: value => value >= 0 || 'El idPaciente debe ser un numero'
              }
            )}
            error={!!errors.id_usuario}
            helperText={errors.id_usuario?.message}
          />
          <TextField
            label="Nombre"
            id="outlined-size-small"
            size="small"
            InputLabelProps={{
              shrink: true
            }}
            {...register('nombre',
              {
                required: true,
                validate: value => value.length > 4 || 'El nombre debe ser mayor a 4 caracteres'
              }
            )}
            error={!!errors.nombre}
            helperText={errors.nombre?.message}
          />
          <TextField
            label="Apellido"
            id="outlined-size-small"
            size="small"
            InputLabelProps={{
              shrink: true
            }}
            {...register('apellido',
              {
                required: true,
                validate: value => value.length > 4 || 'El apellido debe ser mayor a 4 caracteres'
              }
            )}
            error={!!errors.apellido}
            helperText={errors.apellido?.message}
          />
          <TextField
            label="Edad"
            id="outlined-size-small"
            size="small"
            {...register('edad',
              {
                required: true,
                valueAsNumber: true,
                validate: value => value >= 0 || 'La edad debe ser un numero'
              }
            )}
            error={!!errors.edad}
            helperText={errors.edad?.message}
          />
          <TextField
            label="Forma de pago"
            id="outlined-size-small"
            size="small"
            InputLabelProps={{
              shrink: true
            }}
            {...register('forma_pago',
              {
                required: true,
                validate: value => value.length > 4 || 'El nombre debe ser mayor a 4 caracteres'
              }
            )}
            error={!!errors.nombre}
            helperText={errors.nombre?.message}
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
