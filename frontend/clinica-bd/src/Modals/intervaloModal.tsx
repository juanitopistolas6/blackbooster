import { HeroIcons } from '../utils/heroicons'
import { useResult } from '../contexts/result-context'
import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_USUARIOS } from '../graphql/queries'
import { FormControl, InputLabel, Select, MenuItem, type SelectChangeEvent } from '@mui/material'

interface IntervalVariables {
  clienteId: number
}

interface getAll {
  usuarios: Usuario[]
}

interface Usuario {
  id_usuario: string
  nombre: string
  apellido: string
}

export const IntervaloModal = () => {
  const { handleClose, updateVariables } = useResult()
  const [details, setDetails] = useState<IntervalVariables>({
    clienteId: 0
  })
  const { data } = useQuery<getAll>(ALL_USUARIOS)

  console.log(data)

  const handleSave = (event: SelectChangeEvent) => {
    setDetails(prev => {
      return { ...prev, clienteId: parseInt(event.target.value) }
    })
  }

  return (
    <div className="w-[300px] h-48 bg-white rounded-xl shadow">
      <div className='p-3 flex flex-col gap-2'>
        <div className='flex justify-between h-10'>
          <button
            onClick={handleClose}
            className='rounded-full w-8 h-8 p-1 flex justify-center items-center hover:bg-gray-200'
          >
            <HeroIcons name='XMarkIcon' className='w-8 h-8' />
          </button>
        </div>
        <div className='flex flex-col gap-5 ml-auto mr-auto'>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="demo-select-small-label">Usuarios</InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            label="Usuarios"
            onChange={handleSave}
          >
            {
              data?.usuarios.map(especialidad => {
                return (
                  <MenuItem
                    value={especialidad.id_usuario}
                    key={especialidad.id_usuario}
                  >
                    {especialidad.nombre}
                  </MenuItem>
                )
              })
            }
          </Select>
        </FormControl>
          <button
            className='text-white font-semibold bg-green-500 p-2'
            onClick={() => { updateVariables(details) }}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}
