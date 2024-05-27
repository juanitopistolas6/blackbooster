/* eslint-disable @typescript-eslint/naming-convention */
import { TextField } from '@mui/material'
import { HeroIcons } from '../utils/heroicons'
import { useResult } from '../contexts/result-context'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { useMutation, useQuery } from '@apollo/client'
import { GET_MEDICO_ASIGNADO } from '../graphql/queries'
import type { PacienteAsignado } from '../types'
import { useEffect, useState } from 'react'
import { ADD_MEDICO_ASIGNADO, DELETE_MEDICO_ASIGNADO, EDIT_MEDICO_ASIGNADO } from '../graphql/mutations'

interface formValues {
  idAsignado: number
  idPaciente: number
  idMedico: number
}

interface getData {
  getMedicoAsignado: PacienteAsignado
}

export const EditMedicoAsignado = () => {
  const { handleCloseEdit, modalOption, currentQuery, refetch } = useResult()
  const { data: medicoAsignadoData } = useQuery<getData>(GET_MEDICO_ASIGNADO, {
    variables: {
      idAsignado: currentQuery.editVariables
    }
  })

  const { id_asignado, id_medico, id_paciente } = medicoAsignadoData?.getMedicoAsignado ?? {}

  const emptyValues: formValues = {
    idAsignado: 0,
    idMedico: 0,
    idPaciente: 0
  }

  const [data, setData] = useState<formValues>({
    idAsignado: id_asignado ?? 0,
    idMedico: id_medico ?? 0,
    idPaciente: id_paciente ?? 0
  })

  const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm<formValues>({
    values: modalOption === 'Edit'
      ? {
          idAsignado: id_asignado ?? 0,
          idMedico: id_medico ?? 0,
          idPaciente: id_paciente ?? 0
        }
      : emptyValues
  })

  const [triggerEdit, { error: editError }] = useMutation(EDIT_MEDICO_ASIGNADO)

  const fields = watch()

  const handleEdit: SubmitHandler<formValues> = (values) => {
    void triggerEdit({
      variables: data,
      update: () => {
        void refetch()
        handleCloseEdit()
      }
    })
  }

  const [addTrigger, { error: addError }] = useMutation(ADD_MEDICO_ASIGNADO, {
    variables: data,
    update: () => {
      void refetch()
      handleCloseEdit()
    }
  })

  const [deleteTrigger, { error: deleteError }] = useMutation(DELETE_MEDICO_ASIGNADO, {
    variables: {
      idAsignado: currentQuery.editVariables
    },
    update: () => {
      void refetch()
      handleCloseEdit()
    }
  })

  const handleAdd = () => {
    if (isValid) {
      void addTrigger({
        variables: data,
        update: () => {
          void refetch()
          handleCloseEdit()
        }
      })
    }
  }

  useEffect(() => {
    const subscription = watch(values => {
      setData(prev => {
        return { ...prev, ...values }
      })
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [fields])

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
            label="idAsignado"
            id="outlined-size-small"
            size="small"
            disabled ={ modalOption !== 'Add' }
            {...register('idAsignado',
              {
                required: true,
                valueAsNumber: true,
                validate: value => value >= 0 || 'El idAsignado debe ser un número positivo'
              }
            )}
            error={!!errors.idAsignado}
            helperText={errors.idAsignado?.message}
          />
          <TextField
            label="idMedico"
            id="outlined-size-small"
            size="small"
            InputLabelProps={{
              shrink: true
            }}
            {...register('idMedico',
              {
                required: true,
                valueAsNumber: true,
                validate: value => value >= 0 || 'El idMedico debe ser un número positivo'
              }
            )}
            error={!!errors.idMedico}
            helperText={errors.idMedico?.message}
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
                validate: value => value >= 0 || 'El idPaciente debe ser un número positivo'
              }
            )}
            error={!!errors.idPaciente}
            helperText={errors.idPaciente?.message}
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
