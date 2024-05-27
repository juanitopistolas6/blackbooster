/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { TextField } from '@mui/material'
import { HeroIcons } from '../utils/heroicons'
import { useResult } from '../contexts/result-context'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { useMutation, useQuery } from '@apollo/client'
import { GET_PACIENTE } from '../graphql/queries'
import type { Paciente } from '../types.d'
import { useEffect, useState } from 'react'
import { ADD_PACIENTE, DELETE_PACIENTE, EDIT_PACIENTE } from '../graphql/mutations'

interface getData {
  getPaciente: Paciente
}

interface formValues {
  idPaciente: number
  nombre: string
  apellido: string
}

export const EditPacientes = () => {
  const { handleCloseEdit, currentQuery, refetch, modalOption } = useResult()
  const { data } = useQuery<getData>(GET_PACIENTE, {
    variables: {
      idPaciente: currentQuery.editVariables
    }
  })

  const emptyForm: formValues = {
    idPaciente: 0,
    apellido: '',
    nombre: ''
  }

  const [deleteTrigger] = useMutation(DELETE_PACIENTE, {
    variables: {
      idPaciente: currentQuery.editVariables
    },
    update: () => {
      void refetch()
      handleCloseEdit()
    }
  })

  const {
    id_paciente,
    nombre,
    apellido
  } = data?.getPaciente ?? {}

  const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm<formValues>({
    values: modalOption === 'Edit'
      ? {
          idPaciente: id_paciente ?? 0,
          nombre: nombre ?? '',
          apellido: apellido ?? ''
        }
      : emptyForm
  })

  const details = watch()

  const [values, setValues] = useState<formValues>({
    idPaciente: id_paciente ?? 0,
    nombre: nombre ?? '',
    apellido: apellido ?? ''
  })

  const [addTrigger] = useMutation(ADD_PACIENTE, {
    variables: values,
    update: () => {
      void refetch()
      handleCloseEdit()
    }
  })

  const [editTrigger] = useMutation(EDIT_PACIENTE, {
    variables: values,
    update: () => {
      void refetch()
      handleCloseEdit()
    }
  })

  const handleEdit: SubmitHandler<formValues> = async (data) => {
    void editTrigger()
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
            label="idPaciente"
            id="outlined-size-small"
            size="small"
            disabled ={ modalOption !== 'Add' }
            {...register('idPaciente',
              {
                required: true,
                valueAsNumber: true,
                validate: value => value >= 0 || 'El idPaciente debe ser un numero'
              }
            )}
            error={!!errors.idPaciente}
            helperText={errors.idPaciente?.message}
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
