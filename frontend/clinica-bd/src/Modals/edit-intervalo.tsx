/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/jsx-key */
import { useMutation, useQuery } from '@apollo/client'
import { useResult } from '../contexts/result-context'
import { HeroIcons } from '../utils/heroicons'
import { GET_INTERVAL_CITAS } from '../graphql/queries'
import { type Cita } from '../types'
import { TextField } from '@mui/material'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { type Dayjs } from 'dayjs'
import { useEffect, useState } from 'react'
import { ADD_CITA, DELETE_INTERVALO, EDIT_INTERVALO } from '../graphql/mutations'

interface getQuery {
  getCitasIntervalo: Cita
}

interface formValues {
  cita: number
  medico: number
  paciente: number
  motivo: string
}

interface value {
  idCita: number
  idPaciente: number
  idMedico: number
  fecha: string
  motivo: string
}

export const EditIntervalo = () => {
  const { handleCloseEdit, currentQuery, refetch, modalOption } = useResult()
  const { data } = useQuery<getQuery>(GET_INTERVAL_CITAS, {
    variables: {
      idCita: currentQuery.editVariables
    }
  })

  const emptyVlue: formValues = {
    cita: 0,
    medico: 0,
    motivo: '',
    paciente: 0
  }

  const [deleteTrigger] = useMutation(DELETE_INTERVALO, {
    variables: {
      idCita: currentQuery.editVariables
    },
    update: () => {
      void refetch()
      handleCloseEdit()
    }
  })

  const {
    fecha,
    id_citas,
    id_medico,
    id_paciente,
    motivo
  } = data?.getCitasIntervalo ?? {}

  const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm<formValues>({
    values: modalOption === 'Edit'
      ? {
          cita: id_citas ?? -1,
          medico: id_medico ?? -1,
          paciente: id_paciente ?? -1,
          motivo: motivo ?? ''
        }
      : emptyVlue
  })

  const variables = watch()

  const [values, setValues] = useState<value>({
    fecha: fecha ?? '',
    idCita: id_citas ?? 0,
    idMedico: id_medico ?? 0,
    idPaciente: id_paciente ?? 0,
    motivo: motivo ?? ''
  })

  const [editTrigger] = useMutation(EDIT_INTERVALO, {
    variables: values,
    update: () => {
      void refetch()
      handleCloseEdit()
    }
  })

  const [addTrigger] = useMutation(ADD_CITA)

  useEffect(() => {
    const subscription = watch((value) => {
      // console.log(value)
      setValues(prev => {
        return {
          ...prev,
          idCita: value.cita ?? 0,
          idMedico: value.medico ?? 0,
          idPaciente: value.paciente ?? 0,
          motivo: value.motivo ?? ''
        }
      })
    }
    )
    return () => { subscription.unsubscribe() }
  }, [variables])

  useEffect(() => {
    console.log(values)
  }, [values])

  const handleEdit: SubmitHandler<formValues> = async (data) => {
    void editTrigger()
  }

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

  const handleDatePicker = (value: Dayjs | null) => {
    setValues(prev => {
      return {
        ...prev,
        fecha: value?.toISOString() ?? ''
      }
    })
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
          <TextField
            label="idCita"
            id="outlined-size-small"
            size="small"
            disabled={ modalOption !== 'Add' }
            {...register('cita',
              {
                required: true,
                valueAsNumber: true,
                validate: value => value >= 0 || 'El idCita debe ser un numero'
              }
            )}
            error={!!errors.cita}
            helperText={errors.cita?.message}
          />
          <TextField
            label="idPaciente"
            id="outlined-size-small"
            size="small"
            {...register('paciente',
              {
                required: true,
                valueAsNumber: true,
                validate: value => value >= 0 || 'El idPaciente debe ser un numero'
              }
            )}
            error={!!errors.paciente}
            helperText={errors.paciente?.message}
          />
          <TextField
            label="idMedico"
            id="outlined-size-small"
            size="small"
            {...register('medico',
              {
                required: true,
                valueAsNumber: true,
                validate: value => value >= 0 || 'El idMedico debe ser un numero'
              }
            )}
            error={!!errors.medico}
            helperText={errors.medico?.message}
          />
          <TextField
            label="Motivo"
            id="outlined-size-small"
            size="small"
            InputLabelProps={{
              shrink: true
            }}
            {...register('motivo',
              {
                required: true,
                validate: value => value.length > 8 || 'El motivo tiene que tener 8 caracteres min'
              }
            )}
            error={!!errors.motivo}
            helperText={errors.motivo?.message}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label='Fecha'
              className='outline-none border-neutral-300 hover:border-sky-500 transition-colors'
              defaultValue={dayjs(fecha)}
              onChange={handleDatePicker}
            />
          </LocalizationProvider>
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
