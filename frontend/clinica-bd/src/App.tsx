import { Modal } from './Modals/Modal'
import { Table } from './components/Table'
import { HeroIcons } from './utils/heroicons'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { type SelectChangeEvent } from '@mui/material/Select'
import { useResult } from './contexts/result-context'
import { TABLAS } from './types.d'

function App () {
  const {
    currentQuery,
    updateTable,
    open,
    handleClose,
    handleOpen,
    openEdit,
    handleCloseEdit,
    handleEditModal
  } = useResult()

  const handleChange = (event: SelectChangeEvent) => {
    const selectedTable = event.target.value as TABLAS
    updateTable(selectedTable)
  }

  return (
    <>
      <Modal
        closeModal={handleCloseEdit}
        open={openEdit}
        className='flex justify-center items-start top-40'
      >
        {currentQuery.editComponent}
      </Modal>
      <Modal
        open={open}
        closeModal={handleClose}
        className='flex justify-center top-32'
      >
        {currentQuery.modal}
      </Modal>
      <div className="w-full h-screen flex">
        <div className="border-r w-20 flex flex-col">
          <div className="h-20 border-b flex items-center justify-center">
            <HeroIcons
              name="CircleStackIcon"
              className="w-10 h-10 text-green-500 hover:rotate-12"
            />
          </div>
        </div>

        <div className="h-full w-full">
          <div className="h-20 border-b">
          </div>

          <div className="bg-gray-200 w-full h-full py-12 px-24">
            <div className="h-full w-full flex flex-col gap-4">
              <div className="flex justify-between">
                <div className='flex gap-1'>
                  <h1 className="text-3xl font-semibold text-left">BackBooster -</h1>
                  <h1 className="text-3xl font-semibold text-left">{currentQuery.tabla}</h1>

                </div>
                { currentQuery.labelBtn &&
                  <button
                    className="rounded-md p-2 h-10a bg-green-500 text-white font-semibold flex gap-1 items-center"
                    onClick={() => { handleEditModal('Add') }}
                  >
                    <HeroIcons
                      name='PlusIcon'
                      className='w-5 h-5'
                    />
                    {currentQuery.labelBtn}
                  </button>
                }
              </div>

              <div className='flex items-center'>

                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                  <InputLabel id="demo-select-small-label">Consulta</InputLabel>
                  <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={currentQuery.tabla}
                    label="Consulta"
                    onChange={handleChange}
                  >
                    <MenuItem value={TABLAS.MEMBRESIAS}>Membresias</MenuItem>
                    <MenuItem value={TABLAS.HISTORIAL_RENTA}>Historial de rentas</MenuItem>
                    <MenuItem value={TABLAS.MONTO_TOTAL}>Montos totales por mes</MenuItem>
                    <MenuItem value={TABLAS.PELICULAS}>Peliculas</MenuItem>
                    <MenuItem value={TABLAS.PELICULAS_MULTA}>Peliculas con multa</MenuItem>
                    <MenuItem value={TABLAS.TOP10_PELICULAS}>Top 10 peliculas</MenuItem>
                    <MenuItem value={TABLAS.USUARIOS}>Usuarios</MenuItem>
                  </Select>
                </FormControl>

                {
                  currentQuery.modal &&
                  (
                    <div className='flex items-center'>
                      <button onClick={handleOpen}>
                        <HeroIcons
                          name='VariableIcon'
                          className='w-8 h-8 text-green-500'
                        />
                      </button>
                    </div>
                  )
                }
              </div>

              <div className='w-full h-full overflow-y-auto p-2'>
                <Table/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
