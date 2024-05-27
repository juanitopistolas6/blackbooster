/* eslint-disable @typescript-eslint/naming-convention */
import { TextField } from '@mui/material'
import { HeroIcons } from '../utils/heroicons'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { useResult } from '../contexts/result-context'
import { useMutation, useQuery } from '@apollo/client'
import { type Entidad } from '../types'
import { GET_ENTIDAD } from '../graphql/queries'
import { useEffect, useState } from 'react'
import { ADD_PACIENTE_ASEGURADO, DELETE_PACIENTE_ASEGURADO, EDIT_PACIENTE_ASEGURADO } from '../graphql/mutations'

interface formValues {
  idEntidad: number
  idAseguradora: number
  idPaciente: number
}

interface getData {
  getEntidad: Entidad
}

export const EditPacienteAsegurado = () => {
  const { handleCloseEdit, currentQuery, refetch, modalOption } = useResult()
  const { data } = useQuery<getData>(GET_ENTIDAD, {
    variables: {
      idEntidad: currentQuery.editVariables
    }
  })
  const [deleteTrigger, { error: deleteError }] = useMutation(DELETE_PACIENTE_ASEGURADO, {
    variables: {
      idEntidad: currentQuery.editVariables
    }
  })

  const [addTrigger, { error: addError }] = useMutation(ADD_PACIENTE_ASEGURADO)

  const emptyValues: formValues = {
    idAseguradora: 0,
    idEntidad: 0,
    idPaciente: 0
  }

  const { id_entidad, id_paciente, id_aseguradora } = data?.getEntidad ?? {}

  const [details, setDetails] = useState<formValues>({
    idEntidad: id_entidad ?? 0,
    idAseguradora: id_aseguradora ?? 0,
    idPaciente: id_paciente ?? 0
  })

  const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm<formValues>({
    values: modalOption === 'Edit'
      ? {
          idEntidad: id_entidad ?? 0,
          idPaciente: id_paciente ?? 0,
          idAseguradora: id_aseguradora ?? 0
        }
      : emptyValues
  })

  const [triggerEdit, { error: editError }] = useMutation(EDIT_PACIENTE_ASEGURADO, {
    variables: details,
    update: () => {
      void refetch()
      handleCloseEdit()
    }
  })

  const formWatch = watch()

  useEffect(() => {
    const subscription = watch((values) => {
      setDetails(prev => {
        return { ...prev, ...values }
      })
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [formWatch])

  console.log(isValid)

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

  const handleEdit: SubmitHandler<formValues> = async (data) => {
    void triggerEdit()
  }
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
          { (addError ?? editError ?? deleteError) && <p className='bg-red-500 text-center text-white font-semibold'>ERROR</p> }
          <TextField
            label="idEntidad"
            id="outlined-size-small"
            size="small"
            disabled={modalOption !== 'Add'}
            {...register('idEntidad',
              {
                required: true,
                valueAsNumber: true,
                validate: value => value > 0 || 'El idEntidad debe ser un número positivo'
              })
            }
            error={!!errors.idEntidad}
            helperText={errors.idEntidad?.message}
          />
          <TextField
            label="idPaciente"
            id="outlined-size-small"
            size="small"
            InputLabelProps={{
              shrink: true
            }}
            {...register('idPaciente',
              {
                required: true,
                valueAsNumber: true,
                validate: value => value > 0 || 'El idPaciente debe ser un número positivo'
              })
            }
            error={!!errors.idPaciente}
            helperText={errors.idPaciente?.message}
          />
          <TextField
            label="idAseguradora"
            id="outlined-size-small"
            size="small"
            InputLabelProps={{
              shrink: true
            }}
            {...register('idAseguradora',
              {
                required: true,
                valueAsNumber: true,
                validate: value => value > 0 || 'El idAseguradora debe ser un número positivo'
              }
            )}
            error={!!errors.idAseguradora}
            helperText={errors.idAseguradora?.message}
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
