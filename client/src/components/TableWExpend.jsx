import React, { useState , useMemo } from "react";
//import GlobalFilter from "./../components/GlobalFilter";
import ColumnFilter from "./../components/ColumnFilter";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  useTable,
  useSortBy,
  useGlobalFilter,
  useFilters,
  useFlexLayout,
  useResizeColumns,
  useExpanded,
  usePagination
} from "react-table";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faArrowDown,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";

//============================================================================= 




const MyTable = ({
  columns: userColumns,
  data,
  numOfRecords,
  handelCheckedRow,
  renderRowSubComponent,
//   rowOnClick,
//   rowClickHandler,
  headerColor,
//   showGlobalFilter,
  expandRows,
  expandedRowObj
}) => {
  
 // in case the devloper decide that each page needs to have more records in each page
 const numRecords = parseInt(numOfRecords)

 const numPageList = (numRecords < 10 ? [numRecords, 10, 20, 30, 40, 50] :
   numRecords >= 10 && numRecords < 20 ? [numRecords, 20, 30, 40, 50] :
     numRecords >= 20 && numRecords < 30 ? [numRecords, 30, 40, 50] :
       numRecords >= 30 && numRecords < 40 ? [numRecords, 40, 50] :
         [numRecords, 50])


   //======== for column definition - for filtering, sizing etc. ==========================
  const defaultColumn = useMemo(
    () => ({
      Filter: ColumnFilter,
      minWidth: 30,
      width: 150,
      maxWidth: 400
    }),
    []
  );

  //======== CheckBox =======================================
  // in order to check the rows
  const [checked, setChecked] = useState([]);

  // check checkbox of specific row
  const toggleCheckbox = (row) => {
   
    if (checked.includes(row._id)) {
      setChecked(checked.filter((item) => item !== row._id));
     

    } else {
      setChecked([...checked, row._id])
      // send the data back to "Home" for the csv export
      handelCheckedRow ([row])
      
    }
  };

  // check checkbox of all rows
  const toggleAllCheckboxes = () => {
    if (checked.length === data.length) {
      setChecked([]);
    } else {
      setChecked(data.map((item) => item._id))
      // send the data back to "Home" for the csv export
      handelCheckedRow (data)
     
    }
  };


    //===================  useTable ==================================

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    pageOptions,
    gotoPage,
    setPageSize,
    setGlobalFilter,
    state: { globalFilter, pageIndex, pageSize,  filters: []}
    } = useTable(
        {
            columns: userColumns,
            data,
            initialState: {
                            pageSize: numRecords,
                            expanded:
                            expandRows && expandedRowObj.hasOwnProperty(0) ? expandedRowObj : {}
                            },
            defaultColumn,
            //filterTypes,
        },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useResizeColumns,
    useExpanded,
    usePagination,
    useFlexLayout  // this make sure that the row can extand w/o moving the titles.
  );

  //////Naama-Test
  const saveData = (ev,row) => {
    let prefix = /cell_\d+_/
  //   // let colName = (ev.target.__reactFiber$tbfqxyn4qg.alternate.key).replace(prefix, "");
  //  if (colName!='expander')
  //   {   
  //   console.log("innerText",ev.target.innerText)
  //   // console.log('colName', colName)
  //   console.log("volunteer id",row.original._id)
    // console.log("ev",ev)
    // console.log('row', row)
    // console.log('row_id', row.id)
    //}

    }
    
  


  return (
    <React.Fragment>
           <table   className="table" {...getTableProps()}>
            <thead >
              {headerGroups.map((headerGroup, i) => (
                <React.Fragment key={headerGroup.headers.length + "_hfrag"}>
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    <th className="table-header">
                         <input
                        type="checkbox"
                        checked={checked.length === data.length}
                        onChange={toggleAllCheckboxes}
                        /> 
                    </th>
                    {headerGroup.headers.map((column, index) => (
                      <th
                        key={column.id}
                        className="table-header"
                        {...column.getHeaderProps()}
                      >


                        {/* ============  for columns sorting ====================== */}
                        <span {...column.getSortByToggleProps()}>
                          {column.render("Header")}
                        

                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <FontAwesomeIcon className="ms-3"  icon={faArrowDown}    />
                            ) : (
                              <FontAwesomeIcon className="ms-3" icon={faArrowUp} />
                            )
                          ) : (
                            ""
                          )}
                        </span>
                    

                        {/* ============  for columns filtering ====================== */}
                         {/* <div>
                           
                          {column.canFilter ? column.render("Filter") : null}  
                        </div>  */}


                        {/* ================== give the ability to resize the column === */}  
                        {/* <div
                          {...column.getResizerProps()}
                          className="resizer"
                        />
                        {column.canResize && (
                          <div  {...column.getResizerProps()} className={`resizer ${column.isResizing ? "isResizing" : "" }`}/>
                        )} */}
                        
                      </th>
                    ))}
                  </tr>
                </React.Fragment>
              ))}
            </thead>

            
            <tbody {...getTableBodyProps()}>
              {page.map((row, i) => {
                prepareRow(row);
                return (
                  <React.Fragment key={i + "_frag"}>
                    <tr className="table-row" {...row.getRowProps()}

                      // =========== in case we want to do something by clicking on the enrite row===========
                    //   onClick={
                    //     rowOnClick
                    //       ? () => rowClickHandler(row.original)
                    //       : () => ""
                    //   }
                    >
                        <td className="td-cell" >
                            <input
                            type="checkbox"
                            checked={checked.includes(row.original._id)}
                            onChange={() => toggleCheckbox(row.original)}
                            />
                        </td> 
                      
                      {row.cells.map((cell) => {
                        return (
                          <td  contentEditable='true' className="td-cell" suppressContentEditableWarning={true} onBlur={(ev)=>saveData(ev,row)}  {...cell.getCellProps()}>
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>
                    {row.isExpanded ? (
                      <tr>
                         <td className="td-subtable"> 
                          <span  className="subTable">
                             {renderRowSubComponent({ row })} 
                          </span>
                         </td> 
                      </tr>
                    ) : null}
                 </React.Fragment>
                );
              })}
            </tbody>

          </table>


            
        {/*================= pagination ============================== */}
        <div className="pagination">
          
          <span style={{marginRight: '30px' }}>

            עמוד{" "}
            <strong>
              {pageIndex + 1} מתוך {pageOptions.length}
            </strong>
          </span>

          <span style={{ marginRight: '30px' }}>

            <select style={{ padding: '4%' }} value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)) }}>
              {numPageList.map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  הראה {pageSize}
                </option>
              ))}
            </select>
          </span>

          <span style={{ marginRight: '30px' }}>
            גש לעמוד:
            <input type="number"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              style={{ paddinRight: "4%", width: "20%" }}
            />
          </span>
          </div>
          
  </React.Fragment>
  );
};

MyTable.defaultProps = {
  rowOnClick: false,

  expandRows: false,
  expandedRowObj: {}
};

export default MyTable;