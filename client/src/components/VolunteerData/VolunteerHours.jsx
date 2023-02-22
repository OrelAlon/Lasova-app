import React , {useState} from 'react'
import ApproveHours from '../ApproveHours';
import { BsClock } from 'react-icons/bs';

function VolunteerHours(info) {

  const [totalApproveHours, setTotalApproveHours]=useState(0)

  const handleTotalHours=(total)=>
  {
    setTotalApproveHours(total)
  }

  return (
    <div className='mainContainer'>
        <div className='innerContainer'>
          <div className='titleName'>
            <BsClock/> שעות התנדבות 
          </div>
        </div>

        {/* <br/> */}
       
        <div className='innerContainer'>
          <input type='button' value='הוסף שעות'/>
        </div>

        {/* <br/> */}

        <div className='innerContainer'>
          <ApproveHours data={info} handleTotalHours={value=>handleTotalHours(value)} />
          
        </div>
        {/* <br/> */}

        <div className='total-hours-container'>
          <strong> סה"כ </strong>  {totalApproveHours} שעות
        </div>
        
    </div>
  )
}

export default VolunteerHours