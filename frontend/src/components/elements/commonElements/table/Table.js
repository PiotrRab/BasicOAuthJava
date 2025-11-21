import React from 'react';
import {useTable} from 'react-table';
import './table.scss';
import classNames from 'classnames';

const Table = ({
                   columns,
                   data,
                   className,
                   additionalRowProps,
               }) => {

    const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} = useTable({
        columns,
        data,
    });

    return (
        <table className={classNames('table', className)}>
            <thead {...getTableProps()}>
            {headerGroups.map((headerGroup) => (
                <tr
                    {...headerGroup.getHeaderGroupProps()}
                    key={headerGroup.id}
                >
                    {headerGroup.headers.map((column) => (
                        <th
                            {...column.getHeaderProps()}
                            key={column.id}
                            className={column.rowClass}
                        >
                            {column.render('Header')}
                        </th>
                    ))}
                </tr>
            ))}
            </thead>
            <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
                prepareRow(row);
                const rowProps = additionalRowProps
                    ? {...row.getRowProps(), ...additionalRowProps(row)}
                    : row.getRowProps();
                return (
                    <tr {...rowProps} key={row.id}>
                        {row.cells.map((cell) => (
                            <td
                                {...cell.getCellProps()}
                                key={cell.column.id}
                                className={cell.column.cellClass}
                            >
                                {cell.render('Cell')}
                            </td>
                        ))}
                    </tr>
                );
            })}
            </tbody>
        </table>
    );
}

export default Table;