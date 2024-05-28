/* eslint-disable @typescript-eslint/naming-convention */
import { TextField } from '@mui/material'
import { HeroIcons } from '../utils/heroicons'
import { useResult } from '../contexts/result-context'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { useMutation, useQuery } from '@apollo/client'
import { GET_MEMBRESIA } from '../graphql/queries'
import type { Membresia } from '../types'
import { useEffect, useState } from 'react'
import { ADD_MEMBRESIA, DELETE_MEMBRESIA, EDIT_MEMBRESIA } from '../graphql/mutations'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { type Dayjs } from 'dayjs'

interface getData {
  getMembresia: Membresia
}

export const EditMedicoAsignado = () => {
  const { handleCloseEdit, modalOption, currentQuery, refetch } = useResult()
  const { data: medicoAsignadoData } = useQuery<getData>(GET_MEMBRESIA, {
    variables: {
      idMembresia: currentQuery.editVariables
    }
  })

  const { fecha_adquerida, id_cliente, id_membresia } = medicoAsignadoData?.getMembresia ?? {}

  const emptyValues: Membresia = {
    id_cliente: 0,
    id_membresia: 0,
    fecha_adquerida: ''
  }

  const [data, setData] = useState<Membresia>({
    id_cliente: id_cliente ?? 0,
    id_membresia: id_membresia ?? 0,
    fecha_adquerida: fecha_adquerida ?? ''
  })

  const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm<Membresia>({
    values: modalOption === 'Edit'
      ? {
          id_cliente: id_cliente ?? 0,
          id_membresia: id_membresia ?? 0,
          fecha_adquerida: fecha_adquerida ?? ''
        }
      : emptyValues
  })

  const [triggerEdit, { error: editError }] = useMutation(EDIT_MEMBRESIA)

  const fields = watch()

  const handleEdit: SubmitHandler<Membresia> = (values) => {
    void triggerEdit({
      variables: data,
      update: () => {
        void refetch()
        handleCloseEdit()
      }
    })
  }

  const [addTrigger, { error: addError }] = useMutation(ADD_MEMBRESIA, {
    variables: data,
    update: () => {
      void refetch()
      handleCloseEdit()
    }
  })

  const [deleteTrigger, { error: deleteError }] = useMutation(DELETE_MEMBRESIA, {
    variables: {
      idMembresia: currentQuery.editVariables
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

  console.log(data)

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

  const handleDatePicker = (value: Dayjs | null) => {
    setData(prev => {
      return {
        ...prev,
        fecha_adquerida: value?.toISOString() ?? ''
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
          { (addError ?? editError ?? deleteError) && <p className='bg-red-500 text-center text-white font-semibold'>ERROR</p> }
          <TextField
            label="idMembresia"
            id="outlined-size-small"
            size="small"
            disabled ={ modalOption !== 'Add' }
            {...register('id_membresia',
              {
                required: true,
                valueAsNumber: true,
                validate: value => value >= 0 || 'El idAsignado debe ser un número positivo'
              }
            )}
            error={!!errors.id_membresia}
            helperText={errors.id_membresia?.message}
          />
          <TextField
            label="idCliente"
            id="outlined-size-small"
            size="small"
            InputLabelProps={{
              shrink: true
            }}
            {...register('id_cliente',
              {
                required: true,
                valueAsNumber: true,
                validate: value => value >= 0 || 'El idMedico debe ser un número positivo'
              }
            )}
            error={!!errors.id_cliente}
            helperText={errors.id_cliente?.message}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label='Fecha adquirida'
              className='outline-none border-neutral-300 hover:border-sky-500 transition-colors'
              defaultValue={dayjs(fecha_adquerida)}
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
