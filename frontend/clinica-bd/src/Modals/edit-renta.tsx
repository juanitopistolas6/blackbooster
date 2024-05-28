/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/jsx-key */
import { useMutation, useQuery } from '@apollo/client'
import { useResult } from '../contexts/result-context'
import { HeroIcons } from '../utils/heroicons'
import { GET_RENTA } from '../graphql/queries'
import { type Cita } from '../types'
import { TextField } from '@mui/material'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { type Dayjs } from 'dayjs'
import { useEffect, useState } from 'react'
import { ADD_RENTA, DELETE_RENTA, EDIT_RENTA } from '../graphql/mutations'

interface getQuery {
  getRenta: Cita
}

type fechas = 'alquilada' | 'retorno'

interface formValues {
  idRenta: number
  idUsuario: number
  idPelicula: number
  fecha_alquilada: string
  fecha_retorno: string
}

export const EditIntervalo = () => {
  const { handleCloseEdit, currentQuery, refetch, modalOption } = useResult()
  const { data } = useQuery<getQuery>(GET_RENTA, {
    variables: {
      idRenta: currentQuery.editVariables
    }
  })

  const emptyVlue: formValues = {
    idRenta: 0,
    idPelicula: 0,
    idUsuario: 0,
    fecha_alquilada: '',
    fecha_retorno: ''
  }

  const [deleteTrigger] = useMutation(DELETE_RENTA, {
    variables: {
      idRenta: currentQuery.editVariables
    },
    update: () => {
      void refetch()
      handleCloseEdit()
    }
  })

  const {
    fecha_alquilada,
    fecha_retorno,
    id_pelicula,
    id_renta,
    id_usuario
  } = data?.getRenta ?? {}

  const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm<formValues>({
    values: modalOption === 'Edit'
      ? {
          fecha_alquilada: fecha_alquilada ?? '',
          fecha_retorno: fecha_retorno ?? '',
          idPelicula: id_pelicula ?? 0,
          idRenta: id_renta ?? 0,
          idUsuario: id_usuario ?? 0
        }
      : emptyVlue
  })

  const variables = watch()

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
  }, [variables])

  const [values, setValues] = useState<formValues>({
    fecha_alquilada: fecha_alquilada ?? '',
    fecha_retorno: fecha_retorno ?? '',
    idPelicula: id_pelicula ?? 0,
    idRenta: id_renta ?? 0,
    idUsuario: id_usuario ?? 0
  })

  const [editTrigger] = useMutation(EDIT_RENTA, {
    variables: values,
    update: () => {
      void refetch()
      handleCloseEdit()
    }
  })

  const [addTrigger] = useMutation(ADD_RENTA)

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
        variables: values,
        update: () => {
          void refetch()
          handleCloseEdit()
        }
      })
    }
  }

  const handleDatePicker = (value: Dayjs | null, to: fechas) => {
    setValues(prev => {
      return to === 'alquilada'
        ? { ...prev, fecha_alquilada: value?.toISOString() ?? '' }
        : { ...prev, fecha_retorno: value?.toISOString() ?? '' }
    })
  }

  console.log(values)

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
            label="idRenta"
            id="outlined-size-small"
            size="small"
            disabled={ modalOption !== 'Add' }
            {...register('idRenta',
              {
                required: true,
                valueAsNumber: true,
                validate: value => value >= 0 || 'El idCita debe ser un numero'
              }
            )}
            error={!!errors.idRenta}
            helperText={errors.idRenta?.message}
          />
          <TextField
            label="idUsuario"
            id="outlined-size-small"
            size="small"
            {...register('idUsuario',
              {
                required: true,
                valueAsNumber: true,
                validate: value => value >= 0 || 'El idPaciente debe ser un numero'
              }
            )}
            error={!!errors.idUsuario}
            helperText={errors.idUsuario?.message}
          />
          <TextField
            label="idPelicula"
            id="outlined-size-small"
            size="small"
            {...register('idPelicula',
              {
                required: true,
                valueAsNumber: true,
                validate: value => value >= 0 || 'El idMedico debe ser un numero'
              }
            )}
            error={!!errors.idPelicula}
            helperText={errors.idPelicula?.message}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label='Fecha alquilada'
              className='outline-none border-neutral-300 hover:border-sky-500 transition-colors'
              defaultValue={dayjs(values.fecha_alquilada)}
              onChange={(e) => { handleDatePicker(e, 'alquilada') }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label='Fecha de retorno'
              className='outline-none border-neutral-300 hover:border-sky-500 transition-colors'
              defaultValue={dayjs(values.fecha_retorno)}
              onChange={(e) => { handleDatePicker(e, 'retorno') }}
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
