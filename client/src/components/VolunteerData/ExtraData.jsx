import React from 'react'

function ExtraData(props) {

  const newVolunteer = props.data.info

  return (
    <div className='mainContainer'>

      <div className='col-lable'>מסלול</div>
      <div className='grouping'>
        <span className="student_btns">
          <input type="radio" value="נקז" id='nakaz' name="studentoption" studentoption="student" className="disabled" checked={newVolunteer.studentoption === 'נקז'} disabled />
          <label htmlFor="nakaz">נק"ז</label>
        </span>
        <span className="student_btns">
          <input type="radio" value="מלגה" name="studentoption" studentoption="student" className="disabled" checked={newVolunteer.studentoption === 'מלגה'} disabled />
          <label htmlFor="milga">מלגה</label>
        </span>
      </div>



      <br />

      <div className='grouping'>
        <label className="new_vol_modal_label">לשון פניה</label>
        <div className="gender_group"  >
          <span className="gender_btns">
            <input type="radio" value="זכר" name="gender" checked={newVolunteer.gender === 'זכר'} disabled />
            <label htmlFor="male">זכר</label>
          </span>
          <span className="gender_btns">
            <input type="radio" value="נקבה" name="gender" checked={newVolunteer.gender === 'נקבה'} disabled />
            <label htmlFor="female">נקבה</label>
          </span>
          <span className="gender_btns">
            <input type="radio" value="אחר" name="gender" checked={newVolunteer.gender === 'אחר'} disabled />
            <label htmlFor="other">אחר</label>
          </span>
        </div>
      </div>

      <br />

      <div className='grouping'>
        <label className="new_vol_modal_label">רשיון נהיגה</label>
        <div className="gender_group"  >
          <span className="gender_btns">
            <input type="radio" value="יש" name="hasDrivingLicence" checked={newVolunteer.hasDrivingLicence === 'יש'} disabled />
            <label htmlFor="has">יש</label>
          </span>
          <span className="gender_btns">
            <input type="radio" value="אין" name="hasDrivingLicence" checked={newVolunteer.hasDrivingLicence === 'אין'} disabled />
            <label htmlFor="doesnthave">אין</label>
          </span>
        </div>
      </div>

      <div className='grouping'>
        <label className="new_vol_modal_label">זמינות בחירום</label>
        <div className="gender_group"  >
          <span className="gender_btns">
            <input type="radio" value="כן" name="availableInEmergency" checked={newVolunteer.availableInEmergency === 'כן'} disabled />
            <label htmlFor="canemergency">כן</label>
          </span>
          <span className="gender_btns">
            <input type="radio" value="לא" name="availableInEmergency" checked={newVolunteer.availableInEmergency === 'לא'}disabled />
            <label htmlFor="cannotemergency">לא</label>
          </span>
        </div>
      </div>




    </div>





  )
}

export default ExtraData