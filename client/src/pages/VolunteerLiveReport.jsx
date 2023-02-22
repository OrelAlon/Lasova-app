import React from 'react';
import { useState, useEffect } from 'react';
import Logo from '../assets/imgs/logo-mobile.png';
// import BasePage from './BasePage';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useSelector, useDispatch } from 'react-redux';
import { /*loadVolunteerById, */loadVolunteers, saveVolunteer } from '../store/actions/volunteerActions';
// import Loader from '../components/Loader';
import Modal1Comp from '../components/Modals/Modal_message'


export default function VolunteerLiveReport() {
  const [isStarted, setIsStarted] = useState(false);
  const [btn, setBtn] = useState({ color: '#92CE7F', text: 'התחל' });

  const [modalStat, setModalStat] = useState(false)
  const [message, setMessage] = useState('')

  const [startTime, setStartTime] = useState(0);
  const [timeToShow, setTimeToShow] = useState();
  const [endTime, setEndTime] = useState(null);

  const [forgotToReport, setForgotToReport] = useState(false);
  const [formValues, setFormValues] = useState({ date: '', startHour: '', endHour: '', verified: false });

  const { /*isAuthenticated,*/ user } = useSelector((state) => state.authReducer);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!volunteer) {

      //dispatch(loadVolunteerById(user._id));
      dispatch(loadVolunteers(user.email)); // working but not getting the correct volunteer, maybe better to use ref in the backend to get the same id from the user
      //dispatch(loadVolunteerById("62a5c9a42071b52f89b35c82")); //for example only-"Reemos"
    }
  }, []);

  let { volunteer } = useSelector((state) => state.volunteerReducer);


  const [editVolunteer, setEditVolunteer] = useState({
    ...volunteer
  });
  let reportedHours = { date: '', start: '', end: '', verified: false };
  let hours = [];

  const toggleBtn = () => {
    setIsStarted(!isStarted);
  };

  const reportManually = () => {
    setForgotToReport(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const confirmHours = () => {
    let { date, startHour, endHour } = formValues;
    if (date && startHour && endHour) {
      startHour = new Date(`${date} ${startHour}`).getTime();
      endHour = new Date(`${date} ${endHour}`).getTime();
      date = new Date(date).getTime();
      const currentDate=new Date().getTime();
      if (startHour < endHour && currentDate>=date) {
        let timeValues = { date, start: startHour, end: endHour, verified: false }
        hours = [timeValues, ...volunteer.hours];

        // in order to go back to the "start" screen
        setEditVolunteer({ ...volunteer, hours })
        setIsStarted(false)
        setEndTime(null)
        setStartTime(null)
        setTimeToShow()
        setForgotToReport(false)
        setMessage('')
        setModalStat(false)
        setFormValues({ date: '', startHour: '', endHour: '', verified: false })
      }
      else {
        setMessage('הוכנס תאריך עתידי או שעת התחלה הגדולה משעת סיום')
        setModalStat(true)
      }
    }
    else {
      setMessage('יש להכניס תאריך, שעת התחלה ושעת סיום')
      setModalStat(true)
    }
  };

  useEffect(() => {
    if (volunteer) {
      hours = [...JSON.parse(JSON.stringify(volunteer.hours))];
    }
  }, [volunteer]);

  
  useEffect(() => {
    if (isStarted) {
      setStartTime(Date.now());
    } else if (!isStarted && startTime > 0) {
      setEndTime(Date.now());
    }
    setBtn(isStarted ? { color: '#C87575', text: 'סיום' } : { color: '#92CE7F', text: 'התחל' });
  }, [isStarted]);

  // set the clock of runtime
  useEffect(() => {
    let intervalId = null;
    if (isStarted) {
      intervalId = setInterval(() => {
        setTimeToShow(new Date(Date.now() - startTime - 7200000).toString().split(' ')[4]);
      }, 1000);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [isStarted, startTime]);


  useEffect(() => {
    if (endTime > 0) {
      setTimeToShow(new Date(endTime - startTime).toString().split(' ')[4]);
      reportedHours = { date: startTime, start: startTime, end: endTime, verified: false };
      hours = [reportedHours, ...volunteer.hours];
      setEditVolunteer({ ...volunteer, hours });
    }
  }, [endTime]);

  useEffect(() => {
    if (volunteer) {
      volunteer = dispatch(saveVolunteer(editVolunteer));
    }
  }, [editVolunteer]);

  // convert hh:mm:ss to PM/AM mode
  const handleContinue = () => {
    setIsStarted(false)
    setEndTime(null)
    setStartTime(null)
    setTimeToShow()
    setForgotToReport(false)
    setMessage('')
    setModalStat(false)
    setFormValues({ date: '', startHour: '', endHour: '', verified: false })
  }

  // convert hh:mm:ss to PM/AM mode
  const tConvert = (time) => {
    // Check correct time format and split into components
    console.log('time', time)

    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
      time = time.slice(1);  // Remove full string match value
      time = time.slice(0, -1) // remove the seconds
      time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(''); // return adjusted time or original string
  }


  return (
    <>

      {volunteer && (
        <div className="volunteer-report">
          <Footer />
          <div className="logo-img">
            <img src={Logo} alt="laSova" className="logo-mobile" />
          </div>
          {!isStarted && !endTime && !forgotToReport && <h2 className="header">היי {user.firstname}, חיכינו רק לך!</h2>}

          {isStarted && !forgotToReport && <h2 className="header">תודה שהשתתפת</h2>}

          {!endTime && !forgotToReport && (
            <div className="report-form">
              <p className="report-program">{volunteer.groupName}</p>
              <button className="report-btn bton-icon" style={{ backgroundColor: btn.color }} onClick={toggleBtn}>
                {btn.text}
              </button>

              {!isStarted && !endTime && (
                <button className="report-text" onClick={reportManually}>
                  שכחת לדווח?
                </button>
              )}

              {/* present the clock of run time */}
              {isStarted && <p className="report-text">{timeToShow}</p>}
              {!isStarted && endTime && <p className="report-text">{timeToShow}</p>}
            </div>
          )}

          {(endTime || forgotToReport) && <h2 className="header">אז מה היה לנו?</h2>}
          {(endTime || forgotToReport) && (
            <div className="report-form">
              <p className="report-program">{volunteer.groupName}</p>

              {/*=======  modal in case of issues with data eneting  ===========  */}
              <div>
                <Modal1Comp trigger={modalStat} setTrigger={setModalStat}>
                  <div className='modalMessage'> {message} </div>
                </Modal1Comp>

              </div>


              <div className="input-date">
                <p className="date-text"> תאריך הפעילות (MM-DD-YYYY) </p>

                {/*=======  date  ===========  */}
                {endTime?
                <input
                  type='text' 
                  name="date"
                  value={
                      (new Date(volunteer.hours[0]?.start).getMonth() + 1) +
                      '/' +
                      (new Date(volunteer.hours[0]?.start).getDate()) +
                      '/' +
                      new Date(volunteer.hours[0]?.start).getFullYear()
                        }
                  readOnly
                />
                :
                  <input
                  type='date'
                  name="date"
                  onChange={(ev) => handleChange(ev)}
                  placeholder= ''
                   />
              }

              </div>

              {/*=======  start & end time ===========  */}
              <div className="hours">
                <div className="input-start">
                  <p className="start-hour-text">שעת התחלה</p>
                    {endTime ?
                    
                   <input
                    type= 'text' 
                    name="startHour"
                    value={tConvert(new Date(volunteer.hours[0]?.start).toString().split(' ')[4])}
                    readOnly
                   />
                  :

                  <input
                    type= 'time'
                    name="startHour"
                    placeholder= ''
                    onChange={(ev) => handleChange(ev)}       />
                  
                  }

                    

                </div>
                <div className="input-end">
                  <p className="end-hour-text">שעת סיום</p>

                  {endTime ?
                    <input
                     type= 'text' 
                     name="endHour"
                     value={tConvert(new Date(volunteer.hours[0]?.end).toString().split(' ')[4])}
                     readOnly
                    />
                   :
 
                   <input
                     type= 'time'
                     name="endHour"
                     placeholder= ''
                     onChange={(ev) => handleChange(ev)}       />
                   
                   }
 


                </div>
              </div>

              {/*=======  in case we are after "סיום" ===========  */}
              {!isStarted && !forgotToReport &&
                <button className="confirm-btn bton-icon" onClick={handleContinue}>
                  המשך
                </button>
              }

              {/*=======  in case we are after "שכחת לדווח" ====  */}
              <div className='confirm_cancel_addtime'>
                {forgotToReport && (
                  <button className="back-btn bton-icon" onClick={confirmHours}>
                    אישור
                  </button>
                )}

                {forgotToReport &&
                  <button className="back-btn bton-icon" onClick={handleContinue}>
                    חזור
                  </button>
                }
              </div>


            </div>
          )}

          <div className="volunteer-user">
            <Header />
          </div>

        </div>
      )}
    </>
  );
}
