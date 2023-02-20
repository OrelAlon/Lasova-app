import { useState, useEffect } from 'react';

import { DataGrid, GridToolbarContainer, GridToolbarDensitySelector } from '@mui/x-data-grid';
import MenuItem from '@mui/material/MenuItem';

import ExportCsvBtn from './ExportCsvBtn';
import CustomNoRowsOverlay from './dataGrid/CustomNoRowsOverlay';
import TableLoader from './dataGrid/TableLoader';

const BaseTable = ({
  entities,
  columns,
  exportRef,
  csvBtnRef,
  exportFileName,
  onEntityClick,
  activeFilter,
  dropdownPosition,
  filterOptions,
  onSetFilter,
  filter
}) => {
  const [rows, setRows] = useState(entities || []);

  useEffect(() => {
    exportRef.current = () => csvBtnRef.current.click();
  }, []);

  useEffect(() => {
    if (entities !== null) {
      let entitiesToShow = entities;
      for (let filterBy in filter) {
        const currFilter = filter[filterBy];
        if (currFilter) {
          if (currFilter !== 'בחר הכל') {
            entitiesToShow = entitiesToShow.filter((val) => val[filterBy] === currFilter);
          }
        }
      }
      setRows(entitiesToShow);
    }
  }, [entities, filter]);

  return (
    <>
      {activeFilter && (
        <div
          className="filter-menu"
          style={{
            ...dropdownPosition
          }}
        >
          {filterOptions[activeFilter].map((o) => (
            <MenuItem className="filter-option" key={o} onClick={() => onSetFilter(o)}>
              {o}
            </MenuItem>
          ))}
        </div>
      )}
      <section className="base-table">
        <DataGrid
          rows={rows}
          getRowId={(row) => row._id}
          columns={columns}
          components={{
            Toolbar: () => <ExportCsvBtn name={exportFileName} csvBtnRef={csvBtnRef} />,
            LoadingOverlay: () => <TableLoader />,
            NoRowsOverlay: () => <CustomNoRowsOverlay />
          }}
          loading={!rows}
          checkboxSelection
          disableSelectionOnClick
          onRowDoubleClick={(ev) => {
            onEntityClick(ev.row);
          }}
          pageSize={10}
          rowsPerPageOptions={[10]}
          getRowHeight={({ model, densityFactor }) => {
            //Naama - for actions columns
            if (!model.hours || !model.hours.length) {
              return null;
            }
            if (!model.hours[0].verified || model.hours[0].verified === 'false') {
              return 200 * densityFactor;
            }
            return null;
          }}
        />
      </section>
    </>
  );
};

export default BaseTable;
