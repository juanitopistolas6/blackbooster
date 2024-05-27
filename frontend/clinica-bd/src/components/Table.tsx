import { useResult } from '../contexts/result-context'
import { HeroIcons } from '../utils/heroicons'

export const Table = () => {
  const { tableCells, currentQuery, updateEditVariables, handleEditModal } = useResult()

  const handleClick = (object: any) => {
    updateEditVariables(object)
    handleEditModal('Edit')
  }

  return (
    <>
      <table className='w-full text-center border-separate border-spacing-y-2'>
        <thead>
          <tr className='text-gray-400'>
            { currentQuery.tableHeads?.map(cell => {
              return <td key={Math.random()}>{cell}</td>
            })}
            <th className='w-20'></th>
          </tr>
        </thead>

        <tbody>
          { tableCells?.map(cells => {
            const values = Object.entries(cells)
            return (
              <tr key={Math.random()} className='h-16 bg-white hover:shadow-xl'>
                {
                  values.map(value => {
                    return value[0] !== '__typename'
                      ? <td key={Math.random()}>{value[1]}</td>
                      : null
                  })
                }
                <td key={Math.random()}>
                  { currentQuery.labelBtn &&
                  <button className='rounded-full hover:bg-gray-200 p-2' onClick={() => { handleClick(values[1][1]) }}>
                    <HeroIcons name='EllipsisVerticalIcon' className='w-5 h-5'/>
                  </button>
                  }
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}
