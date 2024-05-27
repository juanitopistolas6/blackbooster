/* eslint-disable @typescript-eslint/naming-convention */
import { FormControl, InputLabel, MenuItem, Select, type SelectChangeEvent, TextField } from '@mui/material'
import { HeroIcons } from '../utils/heroicons'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { useResult } from '../contexts/result-context'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { type Dayjs } from 'dayjs'
import { useMutation, useQuery } from '@apollo/client'
import { GET_FACTURA } from '../graphql/queries'
import { useEffect, useState } from 'react'
import type { Factura } from '../types'
import { ADD_FACTURA, DELETE_FACTURA, EDIT_FACTURA } from '../graphql/mutations'

interface formValues {
  idFactura: number
  idPaciente: number
  monto: number
  fecha: string
  pagado: boolean
  idCita: number
}

interface getData {
  getFactura: Factura
}

export const EditFacturas = () => {
  const { currentQuery, handleCloseEdit, refetch, modalOption } = useResult()
  const { data } = useQuery<getData>(GET_FACTURA, {
    variables: {
      idFactura: currentQuery.editVariables
    }
  })

  const [deleteTrigger] = useMutation(DELETE_FACTURA, {
    variables: {
      idFactura: currentQuery.editVariables
    },
    update: () => {
      void refetch()
      handleCloseEdit()
    }
  })

  const emptyValues: formValues = {
    idPaciente: 0,
    idCita: 0,
    idFactura: 0,
    fecha: '',
    monto: 0,
    pagado: false
  }

  const { id_cita, id_factura, id_paciente, monto, fecha_emitida, pagado } = data?.getFactura ?? {}

  const [details, setDetails] = useState<formValues>({
    idFactura: id_factura ?? 0,
    idCita: id_cita ?? 0,
    idPaciente: id_paciente ?? 0,
    monto: monto ?? 0,
    pagado: pagado ?? false,
    fecha: fecha_emitida ?? ''
  })

  const [editTrigger] = useMutation(EDIT_FACTURA, {
    variables: details,
    update: () => {
      void refetch()
      handleCloseEdit()
    }
  })

  const handleDatePicker = (value: Dayjs | null) => {
    setDetails(prev => {
      return {
        ...prev,
        fecha: value?.toISOString() ?? ''
      }
    })
  }

  const handleEdit: SubmitHandler<formValues> = (values) => {
    void editTrigger()
  }

  const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm<formValues>({
    values: modalOption === 'Edit'
      ? {
          idFactura: id_factura ?? 0,
          idCita: id_cita ?? 0,
          idPaciente: id_paciente ?? 0,
          monto: monto ?? 0,
          pagado: pagado ?? false,
          fecha: fecha_emitida ?? ''
        }
      : emptyValues
  })

  const handleChange = (event: SelectChangeEvent<number>) => {
    const valor = event.target.value
    setDetails(prev => {
      return valor === 1
        ? { ...prev, pagado: true }
        : { ...prev, pagado: false }
    })
  }

  const [addTrigger] = useMutation(ADD_FACTURA, {
    variables: details,
    update: () => {
      console.log(details)
      void refetch()
      handleCloseEdit()
    }
  })

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

  const valores = watch()
  const pagadoValor = pagado === true ? 1 : 0

  useEffect(() => {
    const subscription = watch(values => {
      setDetails(prev => {
        return {
          ...prev,
          ...values
        }
      })
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [valores])
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
            label="idFactura"
            id="outlined-size-small"
            size="small"
            disabled={ modalOption !== 'Add' }
            {...register('idFactura',
              {
                required: true,
                valueAsNumber: true,
                validate: value => value >= 0 || 'El idFactura debe ser un numero'
              }
            )}
            error={!!errors.idFactura}
            helperText={errors.idFactura?.message}
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
                validate: value => value >= 0 || 'El idPaciente debe ser un numero'
              }
            )}
            error={!!errors.idPaciente}
            helperText={errors.idPaciente?.message}
          />
          <TextField
            label="Monto"
            id="outlined-size-small"
            size="small"
            InputLabelProps={{
              shrink: true
            }}
            {...register('monto',
              {
                required: true,
                valueAsNumber: true,
                validate: value => value >= 0 || 'El monto debe ser un numero'
              }
            )}
            error={!!errors.monto}
            helperText={errors.monto?.message}
          />
          <TextField
            label="idCita"
            id="outlined-size-small"
            size="small"
            InputLabelProps={{
              shrink: true
            }}
            {...register('idCita',
              {
                required: true,
                valueAsNumber: true,
                validate: value => value >= 0 || 'El idCita debe ser un numero'
              }
            )}
            error={!!errors.idCita}
            helperText={errors.idCita?.message}
          />
          <FormControl sx={{ minWidth: 140 }}>
            <InputLabel id="demo-select-small-label">Consulta</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              label="Consulta"
              defaultValue={pagadoValor}
              onChange={handleChange}
            >
              <MenuItem value={1}>Pagado</MenuItem>
              <MenuItem value={0}>No pagado</MenuItem>
            </Select>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label='Fecha emitida'
              className='outline-none border-neutral-300 hover:border-sky-500 transition-colors'
              defaultValue={dayjs(fecha_emitida)}
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
