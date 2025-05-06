import React, { ReactElement } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  RowData,
} from '@tanstack/react-table';
import cn from '@/utils/cn';

interface TanstackTableProps<T extends RowData> {
  data: T[];
  columns: ColumnDef<T>[];
  className?: string;
}

export function TanstackTable<T extends RowData>({
  data,
  columns,
  className = '',
}: TanstackTableProps<T>): ReactElement {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={cn('overflow-auto', className)}>
      <table className="min-w-full border border-gray-300 text-left text-sm">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="px-4 py-2 border-b border-gray-300 font-medium">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-4 py-2 border-b border-gray-200">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
