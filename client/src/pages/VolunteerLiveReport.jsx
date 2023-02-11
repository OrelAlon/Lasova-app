import React from 'react';
import { useState, useEffect } from 'react';
import Logo from '../assets/imgs/logo-mobile.png';
import BasePage from './BasePage';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useSelector, useDispatch } from 'react-redux';
import { loadVolunteerById, loadVolunteers, saveVolunteer } from '../store/actions/volunteerActions';
import Loader from '../components/Loader';


export default function VolunteerLiveReport() {
  const [isStarted, setIsStarted] = useState(false);
  const [btn, setBtn] = useState({ color: '#92CE7F', text: 'התחל' });

  const [startTime, setStartTime] = useState(0);
  const [timeToShow, setTimeToShow] = useState();
  const [endTime, setEndTime] = useState(null);

  const [forgotToReport, setForgotToReport] = useState(false);
  const [formValues, setFormValues] = useState({ date: '', startHour: '', endHour: '', verified: false });

  const { isAuthenticated, user } = useSelector((state) => state.authReducer);

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
      startHour = new Date(`${date} ${endHour}`).getTime();
      endHour = new Date(`${date} ${endHour}`).getTime();
      date = new Date(date).getTime();
      let timeValues = { date, start: startHour, end: endHour, verified: false };
      hours = [timeValues, ...volunteer.hours];
      setEditVolunteer({ ...volunteer, hours });
    }
  };

  useEffect(() => {
    // console.log('volunteer: ', volunteer);
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
      console.log('saveVolunteer in live report');
      volunteer = dispatch(saveVolunteer(editVolunteer));
    }
  }, [editVolunteer]);

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
              <button className="report-btn" style={{ backgroundColor: btn.color }} onClick={toggleBtn}>
                {btn.text}
              </button>
              {!isStarted && !endTime && (
                <button className="report-text" onClick={reportManually}>
                  שכחת לדווח?
                </button>
              )}
              {isStarted && <p className="report-text">{timeToShow}</p>}
              {!isStarted && endTime && <p className="report-text">{timeToShow}</p>}
            </div>
          )}
          {(endTime || forgotToReport) && <h2 className="header">אז מה היה לנו?</h2>}
          {(endTime || forgotToReport) && (
            <div className="report-form">
              <p className="report-program">{volunteer.groupName}</p>
              <div className="input-date">
                <p className="date-text">תאריך הפעילות</p>
                <input
                  type={endTime ? 'text' : 'date'}
                  name="date"
                  onChange={(ev) => handleChange(ev)}
                  placeholder={
                    endTime
                      ? new Date(volunteer.hours[0]?.start).getDate() +
                        '/' +
                        (+new Date(volunteer.hours[0]?.start).getMonth() + 1) +
                        '/' +
                        new Date(volunteer.hours[0]?.start).getFullYear()
                      : ''
                  }
                />
              </div>

              <div className="hours">
                <div className="input-start">
                  <p className="start-hour-text">שעת התחלה</p>
                  <input
                    type="time"
                    name="startHour"
                    placeholder={endTime ? new Date(volunteer.hours[0]?.start).toString().split(' ')[4] : ''}
                    onChange={(ev) => handleChange(ev)}
                  />
                </div>
                <div className="input-end">
                  <p className="end-hour-text">שעת סיום</p>
                  <input
                    type="time"
                    name="endHour"
                    placeholder={endTime ? new Date(volunteer.hours[0]?.end).toString().split(' ')[4] : ''}
                    onChange={(ev) => handleChange(ev)}
                  />
                </div>
              </div>
              {forgotToReport && (
                <button className="confirm-btn" onClick={confirmHours}>
                  אישור
                </button>
              )}
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
