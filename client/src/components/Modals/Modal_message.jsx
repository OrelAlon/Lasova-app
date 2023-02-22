import React from 'react'

import {  AiOutlineClose } from 'react-icons/ai';

function ModalComp(props) {

  return (props.trigger) ? (

    <div className="modalContainer">

      <div className='modal-inner'>

      <button className='close-btn' onClick={() => props.setTrigger(false)}><AiOutlineClose/> </button>
      {props.children}

        </div>

    </div>
  ) : "";
}

export default ModalComp