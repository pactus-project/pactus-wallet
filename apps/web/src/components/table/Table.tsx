import React, { ReactElement } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  RowData,
} from '@tanstack/react-table';
import cn from '@/utils/cn';

interface TableProps<T extends RowData> {
  data: T[];
  columns: ColumnDef<T>[];
  className?: string;
}

export default function Table<T extends RowData>({
  data,
  columns,
  className = '',
}: TableProps<T>): ReactElement {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={cn('overflow-auto', className)}>
      <table className="min-w-full text-left text-sm">
        <thead className="text-text-tertiary font-medium text-xs">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="px-4 py-2 font-medium">
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
            <tr key={row.id} className="">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-4 py-2">
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
