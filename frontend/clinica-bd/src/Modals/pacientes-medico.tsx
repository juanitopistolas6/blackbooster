import { FormControl, InputLabel, Select, MenuItem, type SelectChangeEvent } from '@mui/material'
import { useResult } from '../contexts/result-context'
import { HeroIcons } from '../utils/heroicons'
import { useQuery } from '@apollo/client'
import { ALL_MEDICOS } from '../graphql/queries'
import { type Medico } from '../types.d'
import { useState } from 'react'

interface Medicos {
  allMedicos: Medico[]
}

export const PacientesMedicos = () => {
  const [idMedico, setIdMedico] = useState<number>(0)
  const { handleClose, updateVariables } = useResult()
  const { data } = useQuery<Medicos>(ALL_MEDICOS)

  const handleSave = (event: SelectChangeEvent) => {
    const value = event.target.value

    setIdMedico(parseInt(value))
  }

  return (
    <div className="w-[300px] bg-white h-44 shadow-lg rounded-xl">
      <div className='flex flex-col'>
        <div className='p-3 flex flex-col gap-2'>
          <div className='flex justify-between h-10'>
            <button
              onClick={handleClose}
              className='rounded-full w-8 h-8 p-1 flex justify-center items-center hover:bg-gray-200'
            >
              <HeroIcons name='XMarkIcon' className='w-8 h-8' />
            </button>
          </div>

          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="demo-select-small-label">Doctores</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              label="Consulta"
              onChange={handleSave}
            >
              {
                data?.allMedicos.map(medico => {
                  return (
                    <MenuItem
                      value={medico.id_medico}
                      key={medico.id_medico}
                    >
                      {`${medico.nombre} ${medico.apellido}`}
                    </MenuItem>
                  )
                })
              }
            </Select>
          </FormControl>
          <button
            className='text-white font-semibold bg-green-500 p-2'
            onClick={() => { updateVariables({ medicoId: idMedico }) }}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}
