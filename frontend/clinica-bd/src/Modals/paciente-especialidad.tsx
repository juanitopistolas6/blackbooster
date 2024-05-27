import { FormControl, InputLabel, Select, MenuItem, type SelectChangeEvent } from '@mui/material'
import { CloseButton } from '../components/CloseButton'
import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_ESPECIALIDADES } from '../graphql/queries'
import { type Especialidad } from '../types'
import { useResult } from '../contexts/result-context'

interface especialidades {
  allEspecialidades: Especialidad[]
}

export const PacienteEspecialidad = () => {
  const { updateVariables } = useResult()
  const [idEspecialidad, setIdEspecialidad] = useState<number>(0)
  const { data } = useQuery<especialidades>(ALL_ESPECIALIDADES)

  const handleSave = (event: SelectChangeEvent) => {
    setIdEspecialidad(parseInt(event.target.value))
  }

  return (
    <div className="w-[300px] bg-white p-2 h-44 shadow-lg rounded-xl">
      <div className='flex flex-col gap-3'>
        <div className="flex justify-between">
          <CloseButton/>
        </div>

        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="demo-select-small-label">Especialidad</InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            label="Especialidad"
            onChange={handleSave}
          >
            {
              data?.allEspecialidades.map(especialidad => {
                return (
                  <MenuItem
                    value={especialidad.id_especialidad}
                    key={especialidad.id_especialidad}
                  >
                    {especialidad.especialidad}
                  </MenuItem>
                )
              })
            }
          </Select>
        </FormControl>
        <button
            className='text-white font-semibold bg-green-500 p-2'
            onClick={() => { updateVariables({ idEspecialidad }) }}
          >
            Guardar
          </button>
      </div>
    </div>
  )
}
