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
import { loadVolunteeringProgram } from '../store/actions/volunteeringProgramAction';

import { ReactComponent as Standby } from '../assets/imgs/icons/status/standby.svg';
import { ReactComponent as Active } from '../assets/imgs/icons/status/active.svg';
import { ReactComponent as Inactive } from '../assets/imgs/icons/status/inactive.svg';
import { MdModeEdit } from 'react-icons/md';

import ExportToCSV from "../components/ExportToCSV";
import NewVolunteerModal from '../components/NewVolunteerModal';
import { updateUserMsg } from '../store/actions/systemActions.js';
//*********************************************************************************** */

const Home = () => {
  const dispatch = useDispatch();

  // ===================== add new volunteer===================================

  const [isNewVolModalOpen, setNewVolModalOpen] = useState(false);

  console.log('6666666666666666666666', isNewVolModalOpen)
  const [modalStatus, setModalStatus] = useState()
  const [volunteer2Edit, seVolunteer2Edit] = useState('')

  // ===================== get data of volunteers ==========================
  //volunteersToShow ==> for the search part
  const { volunteers, volunteersToShow } = useSelector((state) => state.volunteerReducer);

  // get all volunteers data
  useEffect(() => {
    dispatch(loadVolunteers());
    dispatch(loadVolunteeringProgram());
   
  }, [isNewVolModalOpen, dispatch]);

  console.log('isNewVolModalOpen in useEffect 12324234234', isNewVolModalOpen)
  // ===================== stauses ===========================================
  // for setting the circle status next to the first name 
  const statuses = [
    { type: 'active', label: 'פעיל', icon: <Active /> },
    { type: 'standby', label: 'מושהה', icon: <Standby /> },
    { type: 'inactive', label: 'לא פעיל', icon: <Inactive /> }
  ];

  // ===================== volunteeringProgram ===========================================
  const associatedPrograms = useSelector((state) => state.volunteeringProgramReducer.volunteeringProgram);

  //=====================  csv export =======================================

  const [exportData, setExportData] = useState(null);

  const handelCheckedRow = (row) =>
    setExportData(row)

  // download to csv
  const handelExportToCSV = () => {
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
      const fileTitle = 'Lasove_Volunteers'
      ExportToCSV(newList, fileTitle)
      setExportData(null)
    }
  }

  //==========  open the edit volunteer modal ==================
  const handleEdit = (row) => {
    seVolunteer2Edit(row)
    setModalStatus('Edit')
    setNewVolModalOpen(true)
  }


  //==========  open the New volunteer modal ==================
  const handleNew = () => {
    setModalStatus('New')
    setNewVolModalOpen(true)
  }

  //================ table columns =============================

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
        Header: "מסגרת התנדבות ",
        accessor: "",
        Cell: ({ row }) => {
          return (
            <div className="name-status">
              {associatedPrograms ? associatedPrograms.find((prog) => prog._id === row.original.volunteeringProgram[0])?.name:''}
            </div>
          )
        }
      },

      {
        Header: "מסגרת מפנה",
        accessor: "volunteerType",
      },
      {
        Header: "",
        accessor: "action",
        width: "10%",
        disableFilters: true,
        Cell: (row) => (
          <div >
            <button className='bton-icon' onClick={() => handleEdit(row.row.original)}><MdModeEdit /></button>
          </div>
        )
      }

    ], [associatedPrograms, statuses])
    ;

  //================ expand ==> provide extra data per volunteer  =============================
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


  //===== usecallback will run the subTable only once when the details will change ===========
  const subTable = useCallback(
    ({ row }) =>
      <InnerVolunteerComp info={row.original} />

  );


  return (
    <BasePage
      title="טבלת מתנדבים"
      doSearch={(searchWord) => { dispatch(searchVolunteers(searchWord, undefined)) }}
      doExport={handelExportToCSV}
      onAdd={handleNew}
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

      {/* ==============  adding new volunteer Modal ============================ */}
      {isNewVolModalOpen && modalStatus === 'New' && <NewVolunteerModal open={isNewVolModalOpen} setOpen={setNewVolModalOpen} modalStatus='New' valunteersList = {volunteers}/>}

      {/* ==============  Edit volunteer Modal ============================ */}
      {isNewVolModalOpen && modalStatus === 'Edit' && <NewVolunteerModal open={isNewVolModalOpen} setOpen={setNewVolModalOpen} data={volunteer2Edit} modalStatus='Edit' valunteersList = {volunteers} />}

    </BasePage>

  )
};

export default Home;