import { CloseButton } from '../components/CloseButton'
import { useState } from 'react'
import { useResult } from '../contexts/result-context'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { type Dayjs } from 'dayjs'

interface fechas {
  fechaInicio: string
  fechaFin: string
}

type fechasType = 'inicio' | 'fin'

export const FacturaDetails = () => {
  const { updateVariables } = useResult()
  const [details, setDetails] = useState<fechas>({
    fechaFin: '',
    fechaInicio: ''
  })

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
            onClick={() => { updateVariables(details) }}
          >
            Guardar
          </button>
      </div>
    </div>
  )
}
