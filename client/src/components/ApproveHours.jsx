import React, { useEffect, useState } from 'react';
import { saveVolunteer } from '../store/actions/volunteerActions';
import { useSelector, useDispatch } from 'react-redux';

function ApproveHours(props) {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.authReducer);
  const [volunteer, setVolunteer] = useState(props.data.data.info);
  const volunteerHours = volunteer.hours;

  // convert from unix int to date per required format
  const convert2Date = (date) => {
    const volunteerDate = new Date(date);
    const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const formattedDate = volunteerDate.toLocaleDateString('he-IL', dateOptions);
    return `${formattedDate}`;
  };

  // convert from unix hour () to timestamp
  const convert2Hour = (start) => {
    const starttime = new Date(start);
    const starthour = starttime.getHours();
    const startminute = starttime.getMinutes();
    const formattedMinute = (startminute < 10 ? '0' : '') + startminute;
    return `${starthour}:${formattedMinute}`;
  };

  let TotalDuration2Approve = 0;
  // add keys to the volunteers' hour dict with actual dates & hours
  for (let i = 0; i < volunteerHours.length; i++) {
    if (volunteerHours[i]['verified'] == false) {
      volunteerHours[i]['updateDdate'] = convert2Date(volunteerHours[i]['date']);
      volunteerHours[i]['updatedStart'] = convert2Hour(volunteerHours[i]['start']);
      volunteerHours[i]['updatedEnd'] = convert2Hour(volunteerHours[i]['end']);
      let duration = volunteerHours[i]['end'] - volunteerHours[i]['start'];
      duration = Math.floor(duration / (1000 * 60 * 60));
      TotalDuration2Approve = TotalDuration2Approve + duration;
    }
  }

  useEffect(() => {
    props.handleTotalHours(TotalDuration2Approve);
  }, [TotalDuration2Approve]);

  // approve the table's row of date and hours
  const handleApproval = (row) => {
    let newHours = volunteer.hours;
    newHours[row.index].verified = true;
    setVolunteer({ ...volunteer, hours: newHours });
    dispatch(saveVolunteer(volunteer, user));
  };

  // delete the table's row of date and hours
  const handleDelete = (row) => {
    volunteer.hours.splice(row.index, 1);
    dispatch(saveVolunteer(volunteer, user));
  };

  return (
    <div>
      <table id="approvalHours">
        <thead>
          <tr>
            <th></th>
            <th>תאריך</th>
            <th>התחלה</th>
            <th>סיום</th>
            <th>אישור</th>
          </tr>
        </thead>

        <tbody>
          {volunteerHours.map(
            (item, index) =>
              item.verified == false && (
                <tr key={index}>
                  <td>
                    <button onClick={() => handleDelete({ item, index })}>+++</button>
                  </td>
                  <td>{item.updateDdate}</td>
                  <td>{item.updatedStart}</td>
                  <td>{item.updatedEnd}</td>
                  <td>
                    <button className="btn btn-primary" onClick={() => handleApproval({ item, index })}>
                      אישור
                    </button>
                  </td>
                </tr>
              )
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ApproveHours;
