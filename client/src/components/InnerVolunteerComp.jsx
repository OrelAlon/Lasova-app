import React from 'react'

import GeneralData from './VolunteerData/GeneralData'
import ExtraData from './VolunteerData/ExtraData'
import VolunteerHours from './VolunteerData/VolunteerHours'

function TestInnerComp(info) {
  

 
  return (
    <div className='innerBox'>
       <div className='general-box'>
        <GeneralData data={info}/>    
       </div>

       {/* <div className='general-box'>
        <ExtraData data={info}/>    
       </div> */}

       <div className='general-box'>
        <VolunteerHours data={info}/>    
       </div>
    
    </div>
  )
}

export default TestInnerComp