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
            <div>מייל</div>
            <div>{volunteer.email}</div>

            <br/>
            <div>עיר</div>
            <div>{volunteer.city}</div>
          </div>

          <div className='col_inner'>
          <div>טלפון</div>
            <div>{volunteer.cellphone}</div>

            <br/>
            <div>תאריך לידה</div>
            <div>{formattedDate}</div>
          </div>


        </div>
        




      </div>
    
    

  )
}

export default GeneralData