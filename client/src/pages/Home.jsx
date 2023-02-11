import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  loadVolunteers,
  searchVolunteers,
} from '../store/actions/volunteerActions';

import BasePage from '../pages/BasePage';
import MyTable from "../components/TableWExpend";
import StatusTabs from '../components/StatusTabs';

import { AiOutlineCaretDown, AiFillCaretLeft } from 'react-icons/ai';
import InnerVolunteerComp from "../components/InnerVolunteerComp";

import { ReactComponent as Standby } from '../assets/imgs/icons/status/standby.svg';
import { ReactComponent as Active } from '../assets/imgs/icons/status/active.svg';
import { ReactComponent as Inactive } from '../assets/imgs/icons/status/inactive.svg';

import ExportToCSV from "../components/ExportToCSV";

import NewVolunteerModal from '../components/NewVolunteerModal';
import { updateUserMsg } from '../store/actions/systemActions.js';
//*********************************************************************************** */

const Home = () => {
  const dispatch = useDispatch();

  // ===================== add new volunteer===================================

  const [isNewVolModalOpen, setNewVolModalOpen] = useState(false);

  // ===================== get data of volunteers ==========================
  //volunteersToShow ==> for the search part
  const { volunteers, volunteersToShow } = useSelector((state) => state.volunteerReducer);

  // get all volunteers data
  useEffect(() => {
    dispatch(loadVolunteers());
  }, [isNewVolModalOpen, dispatch]);


  // ===================== stauses ===========================================
  // for setting the circle status next to the first name 
  const statuses = [
    { type: 'active', label: 'פעיל', icon: <Active /> },
    { type: 'standby', label: 'מושהה', icon: <Standby /> },
    { type: 'inactive', label: 'לא פעיל', icon: <Inactive /> }
  ];

  //=====================  csv export =======================================

  const [exportData, setExportData] = useState(null);

  const handelCheckedRow = (row) =>
    setExportData(row)
  //console.log('row that is checked', exportData)

  // download to csv
  const handelExportToCSV = () => {
    console.log('chek data54654645', exportData)
    if (!exportData) {
      const msg = {
        txt: 'יש לסמן רשומות לפני ייצוא',
        type: 'failure',
      };
      dispatch(updateUserMsg(msg));
      return;
    }
    else {
      let newList = exportData.map(item => ({ 'שם פרטי': item.firstName, 'שם משפחה': item.lastName, 'תעודת זהות': item.taz }));
      const fileTitle = ' לשובע מתנדבים'
      ExportToCSV(newList, fileTitle)
      setExportData(null)
    }
  }

  //============================================================

  const columns = useMemo(
    () => [
      {
        Header: () => null,
        id: "expander",
        disableFilters: true,
        width: 30,
        Cell: ({ row }) => (
          <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? (
              <AiOutlineCaretDown />
            ) : (
              <AiFillCaretLeft />
            )}
          </span>
        )
      },
      {
        Header: "שם פרטי",
        accessor: "firstName",
        Cell: ({ row }) => {
          return (
            <div className="name-status">
              {statuses.find((status) => status.type === row.original.status)?.icon || <Standby />}
              {row.original.firstName}
            </div>
          )
        }
      },
      {
        Header: "שם משפחה",
        accessor: "lastName",
      },
      {
        Header: "ת.ז.",
        accessor: "taz",
      },
      {
        Header: "מסגרת",
        accessor: "volunteeringProgram.name",
      },
      {
        Header: "תוכנית",
        accessor: "volunteerType",
      }
    ], [])
    ;


  const expandedRows = useMemo((volunteers) => {
    if (volunteers != null && volunteers.length > 0) {
      let arr;
      let d = volunteers;
      arr = d.map((sid, ind) => {
        return { [ind]: true };
      });

      return arr;
    }
  }, []);


  // usecallback will run the subTable only once when the details will change
  const subTable = useCallback(
    ({ row }) =>
      <InnerVolunteerComp info={row.original} />

  );


  return (

    <BasePage
      title="טבלת מתנדבים"
      doSearch={(searchWord) => { dispatch(searchVolunteers(searchWord, undefined)) }}
      doExport={handelExportToCSV}
      onAdd={() => setNewVolModalOpen(true)}
    >
      <StatusTabs
        setStatusFilter={(status) => {
          dispatch(searchVolunteers(undefined, status));
        }}
      />

      {volunteers ? (
        <MyTable
          data={volunteersToShow}// use "volunteersToShow" so in case we search something, the list will be shorter per the search
          columns={columns}
          renderRowSubComponent={subTable}
          expandRows
          expandedRowObj={expandedRows}
          numOfRecords='20'
          handelCheckedRow={handelCheckedRow}
        />
      ) : (
        <span>
          <em>No data was found </em>
        </span>
      )}

      {isNewVolModalOpen && <NewVolunteerModal open={isNewVolModalOpen} setOpen={setNewVolModalOpen} />}

    </BasePage>

  )
};

export default Home;
