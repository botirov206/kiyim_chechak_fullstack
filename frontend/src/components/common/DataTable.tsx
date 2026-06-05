import type { ReactNode } from 'react'

export type Column<T> = {
  key: string
  header: ReactNode
  cell: (row: T) => ReactNode
  widthClassName?: string
}

export function DataTable<T extends { id?: string | number }>({
  rows,
  columns,
  getRowId,
}: {
  rows: T[]
  columns: Array<Column<T>>
  getRowId?: (row: T) => string
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5">
      <table className="min-w-full border-collapse">
        <thead className="bg-white/5">
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                className={[
                  'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/60',
                  c.widthClassName ?? '',
                ].join(' ')}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-6 text-sm text-white/60">
                No records found.
              </td>
            </tr>
          ) : (
            rows.map((row, idx) => {
              const rowId = getRowId ? getRowId(row) : row.id !== undefined ? String(row.id) : String(idx)
              return (
                <tr key={rowId} className="border-t border-white/10">
                  {columns.map((c) => (
                    <td key={c.key} className="px-4 py-3 text-sm text-white/80">
                      {c.cell(row)}
                    </td>
                  ))}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}

