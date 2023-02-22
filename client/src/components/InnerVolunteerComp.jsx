import React from 'react'

import GeneralData from './VolunteerData/GeneralData'
//import ExtraData from './VolunteerData/ExtraData'
import VolunteerHours from './VolunteerData/VolunteerHours'
import { MdRadioButtonChecked, MdRadioButtonUnchecked } from "react-icons/md";

function TestInnerComp(info) {
  const newVolunteer = info.info


  return (
    <div className='innerBox'>
      <div className='general-box1'>
        <GeneralData data={info} />
      </div>

      <div className='mid_innerBox'>

        <div className='general-box2'>
          <div className='col-lable'>מסלול</div>
          <div className='grouping'>
            <span className="student_btns">
              {(newVolunteer.studentoption == "נקז") ? <MdRadioButtonChecked /> : <MdRadioButtonUnchecked />}
              <label htmlFor="nakaz">נק"ז</label>
            </span>
            <span className="student_btns">
              {(newVolunteer.studentoption == "מלגה") ? <MdRadioButtonChecked /> : <MdRadioButtonUnchecked />}
              <label htmlFor="milga">מלגה</label>
            </span>
          </div>
        </div>

        <br />

        <div className='general-box2'>
          <label className="new_vol_modal_label">לשון פניה</label>
          <div className="gender_group"  >
            <span className="gender_btns">
              {(newVolunteer.gender == "זכר") ? <MdRadioButtonChecked /> : <MdRadioButtonUnchecked />}
              <label htmlFor="male">זכר</label>
            </span>
            <span className="gender_btns">
              {(newVolunteer.gender == "נקבה") ? <MdRadioButtonChecked /> : <MdRadioButtonUnchecked />}
              <label htmlFor="female">נקבה</label>
            </span>
            <span className="gender_btns">
              {(newVolunteer.gender == "אחר") ? <MdRadioButtonChecked /> : <MdRadioButtonUnchecked />}
              <label htmlFor="other">אחר</label>
            </span>
          </div>
        </div>

        <br />

        <div className='general-box2'>
          <label className="new_vol_modal_label">רשיון נהיגה</label>
          <div className="gender_group"  >
            <span className="gender_btns">
              {(newVolunteer.hasDrivingLicence == "יש") ? <MdRadioButtonChecked /> : <MdRadioButtonUnchecked />}
              <label htmlFor="has">יש</label>
            </span>
            <span className="gender_btns">
              {(newVolunteer.hasDrivingLicence == "אין") ? <MdRadioButtonChecked /> : <MdRadioButtonUnchecked />}
              <label htmlFor="doesnthave">אין</label>
            </span>
          </div>
        </div>

        <br />

        <div className='general-box2'>
          <label className="new_vol_modal_label">זמינות בחירום</label>
          <div className="gender_group"  >
            <span className="gender_btns">
              {(newVolunteer.availableInEmergency == "כן") ? <MdRadioButtonChecked /> : <MdRadioButtonUnchecked />}
              <label htmlFor="canemergency">כן</label>
            </span>
            <span className="gender_btns">
              {(newVolunteer.availableInEmergency == "לא") ? <MdRadioButtonChecked /> : <MdRadioButtonUnchecked />}
              <label htmlFor="cannotemergency">לא</label>
            </span>
          </div>


        </div>


      </div>

      <div className='general-box3'>
        <VolunteerHours data={info} />
      </div>

    </div>
  )
}

export default TestInnerComp