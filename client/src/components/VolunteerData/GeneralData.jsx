import React , {useState} from 'react'

function GeneralData(props) {
  //const [volunteer, setVolunteer] =useState(props.data.info)
  const volunteer=props.data.info

  const bithDate = new Date(volunteer.birth);     
  const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const formattedDate = bithDate.toLocaleDateString('he-IL', dateOptions);
 
  
  return (
    <div className='mainContainer'>
        
        <div className='inner'>
          <div className='col_inner'>
            <div className='col-lable'>מייל</div>
            <div className='col-data'>{volunteer.email}</div>

            <br/>
            <div className='col-lable'>כתובת</div>
            <div className='col-data'>{volunteer.address}, {volunteer.city}</div>

            <br/>
            <div className='col-lable'>מקום לימודים</div>
            <div className='col-data'>{volunteer.educationalInstitution}</div>


          </div>

          <div className='col_inner'>
            <div className='col-lable'>טלפון</div>
            <div className='col-data'>{volunteer.cellphone}</div>

            <br/>
            <div className='col-lable'>תאריך לידה</div>
            <div className='col-data'>{formattedDate}</div>

            <br/>
            <div className='col-lable'>שם מלגה</div>
            <div className='col-data'>{volunteer.scholarshipName}</div>
          </div>
        </div>
      
           
        {/* <br/>
            <div className='col-lable'> סיכום שיחה</div>
            <div className='col-data'>{volunteer.talkSummary}</div> */}

 

    </div>
    
    

  )
}

export default GeneralData