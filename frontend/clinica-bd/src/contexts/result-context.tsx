/* eslint-disable @typescript-eslint/naming-convention */
import { type ApolloQueryResult, type DocumentNode, type OperationVariables, useQuery } from '@apollo/client'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { DefaultValues, TABLAS } from '../types.d'
import { useModal } from '../hooks/useModal'

interface resultProps {
  children: ReactNode
}

type editModal = 'Edit' | 'Add'

export interface Query {
  tabla: string
  query: DocumentNode
  labelBtn: string | null
  variables: Record<string, any>
  editVariables?: number
  tableHeads: string[] | undefined
  modal: JSX.Element | null
  editComponent: JSX.Element | null
}

interface ResultContext {
  currentQuery: Query
  tableCells: Array<Record<string, any>> | null
  updateTable: (table: TABLAS) => void
  updateVariables: (object: Record<string, any>) => void
  modalOption: editModal
  open: boolean
  openEdit: boolean
  handleOpen: () => void
  handleClose: () => void
  updateEditVariables: (value: any) => void
  handleCloseEdit: () => void
  handleEditModal: (value: editModal) => void
  refetch: (variables?: Partial<OperationVariables> | undefined) => Promise<ApolloQueryResult<data>>
}

type data = Record<string, any[]>

const resultContext = createContext<ResultContext | null>(null)

export const ResultProvider = ({ children }: resultProps) => {
  const { open, handleClose, handleOpen } = useModal()
  const { open: openEdit, handleClose: handleCloseEdit, handleOpen: handleOpenEdit } = useModal()
  const [modalOption, setModalOption] = useState<editModal>('Edit')
  const [tableCells, setTableCells] = useState<Array<Record<string, any>> | null>(null)
  const [currentQuery, setCurrentQuery] = useState<Query>(DefaultValues[TABLAS.PELICULAS])
  const { data: defaultOption, refetch } = useQuery<data>(currentQuery.query, {
    variables: currentQuery.variables
  })

  useEffect(() => {
    if (defaultOption) {
      const values: Array<Record<string, any>> = Object.values(defaultOption)[0]
      setTableCells(values)
    }
  }, [defaultOption])

  useEffect(() => {
    void refetch()
  }, [currentQuery.variables])

  const updateVariables = (object: Record<string, any>) => {
    setCurrentQuery(prev => {
      return { ...prev, variables: object }
    })
    handleClose()
  }

  const updateEditVariables = (values: number) => {
    setCurrentQuery(prev => {
      return { ...prev, editVariables: values }
    })
  }

  const handleEditModal = (value: editModal) => {
    setModalOption(value)
    handleOpenEdit()
  }

  const updateTable = (table: TABLAS) => {
    if (DefaultValues[table]?.modal) handleOpen()

    setCurrentQuery(DefaultValues[table])
  }

  const value: ResultContext = {
    tableCells,
    currentQuery,
    open,
    openEdit,
    modalOption,
    handleClose,
    handleOpen,
    updateEditVariables,
    updateTable,
    updateVariables,
    handleCloseEdit,
    handleEditModal,
    refetch
  }

  return (
    <resultContext.Provider value={value}>
      {children}
    </resultContext.Provider>
  )
}

export const useResult = () => {
  const context = useContext(resultContext)

  if (!context) throw new Error('Result context must be within its reach')

  return context
}
