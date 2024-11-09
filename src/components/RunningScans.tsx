"use client"

import * as React from "react"
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Define sample scan data
const data: Scan[] = [
  {
    id: "1",
    scanName: "Network Scan",
    target: "192.168.1.1",
    profile: "Aggressive",
    timeStarted: "2024-11-08 12:30 PM",
    completion: "25%",
  },
  {
    id: "2",
    scanName: "Quick Scan",
    target: "192.168.1.2",
    profile: "Quick",
    timeStarted: "2024-11-08 12:45 PM",
    completion: "50%",
  },
  {
    id: "3",
    scanName: "Full Scan",
    target: "192.168.1.3",
    profile: "Intense",
    timeStarted: "2024-11-08 1:00 PM",
    completion: "10%",
  },
  {
    id: "4",
    scanName: "Vulnerability Scan",
    target: "192.168.1.4",
    profile: "Vuln",
    timeStarted: "2024-11-08 1:15 PM",
    completion: "75%",
  },
  {
    id: "5",
    scanName: "Custom Scan",
    target: "192.168.1.5",
    profile: "Custom",
    timeStarted: "2024-11-08 1:30 PM",
    completion: "40%",
  },
]

export type Scan = {
  id: string
  scanName: string
  target: string
  profile: string
  timeStarted: string
  completion: string
}

export const columns: ColumnDef<Scan>[] = [
  {
    accessorKey: "scanName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Scan Name
        <ArrowUpDown />
      </Button>
    ),
  },
  {
    accessorKey: "target",
    header: "Target",
  },
  {
    accessorKey: "profile",
    header: "Profile",
  },
  {
    accessorKey: "timeStarted",
    header: "Time Started",
  },
  {
    accessorKey: "completion",
    header: "Completion",
    cell: ({ row }) => (
      <div className=" font-medium">{row.getValue("completion")}</div>
    ),
  },
]

export function ActiveScans() {
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    initialState: {
      pagination: { pageSize: 5 }, // Set to show only 5 rows per page
    },
  })

  return (
    <div className="w-full px-4">
      <div className="flex items-center justify-between py-3">
        <h2 className="text-xl font-bold">Active Scans</h2>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No active scans.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
