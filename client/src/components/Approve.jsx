import React from 'react';
import { BsFillCheckCircleFill } from 'react-icons/bs';

export default function Approve({ row, approveHours }) {
 

  function showDate(date) {
    const userDate = new Date(date);
    const formattedDate = userDate.toLocaleDateString();

    return `date: ${formattedDate}`;
  }

  function calculateDuration(start, end) {
    if (isNaN(start) || isNaN(end)) {
      return 'Invalid input';
    }
    const duration = end - start;
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `hours: ${hours}
     minutes:  ${minutes}`;
  }
  return (
    <>
      {row.hours.length >= 0 && (row.hours[0]?.verified === false || row.hours[0]?.verified === 'false') && (
        <div className="approve-hours">
          <div>
            <p>{showDate(row.hours[0]?.date)}</p>
            <p>{calculateDuration(row.hours[0]?.start, row.hours[0]?.end)}</p>
          </div>
          <button className="approve-hours-btn" onClick={() => approveHours(row)}>
            אישור
          </button>
        </div>
      )}
      {row.hours[0]?.verified === true && <BsFillCheckCircleFill className="circle-approve" />}
    </>
  );
}
