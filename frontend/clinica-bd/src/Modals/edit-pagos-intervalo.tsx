/* eslint-disable @typescript-eslint/naming-convention */
import { TextField } from '@mui/material'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { type Dayjs } from 'dayjs'
import { HeroIcons } from '../utils/heroicons'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import type { Pago } from '../types'
import { useMutation, useQuery } from '@apollo/client'
import { GET_PAGO } from '../graphql/queries'
import { useResult } from '../contexts/result-context'
import { ADD_PAGO, DELETE_PAGO, EDIT_PAGO } from '../graphql/mutations'

interface getData {
  getPago: Pago
}

interface formValues {
  idPago: number
  idFactura: number
  monto: number
  pago: string
  idEntidad: number
}

export const EditPagosIntervalo = () => {
  const { currentQuery, handleCloseEdit, refetch, modalOption } = useResult()
  const { data } = useQuery<getData>(GET_PAGO, {
    variables: {
      idPago: currentQuery.editVariables
    }
  })

  const emptyValues: formValues = {
    idEntidad: 0,
    idFactura: 0,
    idPago: 0,
    monto: 0,
    pago: ''
  }

  const { id_entidad, id_factura, id_pago, monto, pago_recibido } = data?.getPago ?? {}

  const [details, setDetails] = useState<formValues>({
    idEntidad: id_entidad ?? 0,
    idFactura: id_factura ?? 0,
    idPago: id_pago ?? 0,
    monto: monto ?? 0,
    pago: pago_recibido ?? ''
  })

  const [deleteTrigger] = useMutation(DELETE_PAGO, {
    variables: {
      idPago: details.idPago
    },
    update: () => {
      void refetch()
      handleCloseEdit()
    }
  })

  const [editTrigger] = useMutation(EDIT_PAGO, {
    variables: details,
    update: () => {
      void refetch()
      handleCloseEdit()
    }
  })

  const [addTrigger] = useMutation(ADD_PAGO, {
    variables: details,
    update: () => {
      void refetch()
      handleCloseEdit()
    }
  })

  const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm<formValues>({
    values: modalOption === 'Edit'
      ? {
          idEntidad: id_entidad ?? 0,
          idFactura: id_factura ?? 0,
          idPago: id_pago ?? 0,
          monto: monto ?? 0,
          pago: pago_recibido ?? ''
        }
      : emptyValues
  })

  const watchData = watch()

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
    void editTrigger()
  }

  const handleDatePicker = (value: Dayjs | null) => {
    setDetails(prev => {
      return {
        ...prev,
        pago: value?.toString() ?? ''

      }
    })
  }

  useEffect(() => {
    console.log(details)
    const subscribe = watch((values) => {
      setDetails(prev => {
        return { ...prev, ...values }
      })
    })

    return () => {
      subscribe.unsubscribe()
    }
  }, [watchData])

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
            label="idPago"
            id="outlined-size-small"
            size="small"
            disabled= { modalOption !== 'Add' }
            {...register('idPago', { required: true, valueAsNumber: true })}
            error={!!errors.idPago}
            helperText={errors.idPago?.message}
          />
          <TextField
            label="idFactura"
            id="outlined-size-small"
            size="small"
            {...register('idFactura', { required: true, valueAsNumber: true })}
            error={!!errors.idFactura}
            helperText={errors.idFactura?.message}
          />
          <TextField
            label="Monto"
            id="outlined-size-small"
            size="small"
            {...register('monto', { required: true, valueAsNumber: true })}
            error={!!errors.monto}
            helperText={errors.monto?.message}
          />
          <TextField
            label="idEntidad"
            id="outlined-size-small"
            size="small"
            InputLabelProps={{
              shrink: true
            }}
            {...register('idEntidad', { required: true, valueAsNumber: true })}
            error={!!errors.idEntidad}
            helperText={errors.idEntidad?.message}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label='Pagado'
              className='outline-none border-neutral-300 hover:border-sky-500 transition-colors'
              defaultValue={dayjs(pago_recibido)}
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
