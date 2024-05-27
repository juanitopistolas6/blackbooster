import { CloseButton } from '../components/CloseButton'
import { useEffect, useState } from 'react'
import { useResult } from '../contexts/result-context'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { type Dayjs } from 'dayjs'
import { useForm } from 'react-hook-form'
import { TextField } from '@mui/material'

interface fechas {
  fechaInicio: string
  fechaFin: string
  generoId: number
}

interface formValue {
  generoId: number
}

type fechasType = 'inicio' | 'fin'

export const TopPeliculas = () => {
  const { updateVariables } = useResult()
  const { register, watch, formState: { errors, isValid } } = useForm<formValue>({
    values: {
      generoId: 0
    }
  })
  const [details, setDetails] = useState<fechas>({
    fechaFin: '',
    fechaInicio: '',
    generoId: 0
  })

  const genre = watch('generoId')

  useEffect(() => {
    const subscription = watch((values) => {
      console.log(values)
      setDetails(prev => {
        return { ...prev, ...values }
      })
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [genre])

  const handleSave = () => {
    if (isValid) {
      updateVariables(details)
    }
  }

  const handleDatePicker = (value: Dayjs | null, fecha: fechasType) => {
    if (fecha === 'inicio') {
      setDetails(prev => {
        return {
          ...prev,
          fechaInicio: value?.toISOString() ?? ''
        }
      })
    } else {
      setDetails(prev => {
        return {
          ...prev,
          fechaFin: value?.toISOString() ?? ''
        }
      })
    }
  }

  return (
    <div className="w-[300px] bg-white p-2 h-auto shadow-lg rounded-xl">
      <div className='flex flex-col gap-3'>
        <div className="flex justify-between">
          <CloseButton/>
        </div>
          <TextField
            InputLabelProps={{
              shrink: true
            }}
            label="GeneroID"
            id="outlined-size-small"
            size="small"
            {...register('generoId',
              {
                required: true,
                valueAsNumber: true,
                validate: value => value >= 0 || 'El generoID debe ser un numero positivo'
              }
            )}
            error={!!errors.generoId}
            helperText={errors.generoId?.message}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label='Pagado'
              className='outline-none border-neutral-300 hover:border-sky-500 transition-colors'
              onChange={(e) => { handleDatePicker(e, 'inicio') }}
            />
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label='Pagado'
              className='outline-none border-neutral-300 hover:border-sky-500 transition-colors'
              onChange={(e) => { handleDatePicker(e, 'fin') }}
            />
          </LocalizationProvider>
        <button
            className='text-white font-semibold bg-green-500 p-2'
            onClick={handleSave}
          >
            Guardar
          </button>
      </div>
    </div>
  )
}
