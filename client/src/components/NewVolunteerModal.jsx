import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadVolunteers, saveVolunteer } from '../store/actions/volunteerActions';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Button from '@mui/material/Button';
import Modal1Comp from '../components/Modals/Modal_message'
// import { UploadVolunteerFilesButton } from './UploadButton';


const NewVolunteerModal = (props) => {
  const dispatch = useDispatch();

  const associatedPrograms = useSelector((state) => state.volunteeringProgramReducer.volunteeringProgram);
  const { user } = useSelector((state) => state.authReducer);

  //=== make sure that there are no 2 emails alike ==============

  const volunteersEmails = props.valunteersList.map(elem => elem['email'])
  // in case of Edit we need to ignore current email
  if (props.modalStatus === 'Edit') {
    const index = volunteersEmails.indexOf(props.data['email']);
    delete volunteersEmails[index];
  }


  // ======= set the volunteer as blank or as Editone ======//
  const [newVolunteer, setNewVolunteer] = useState({
    taz: '',
    volunteeringProgram: '',
    firstName: '',
    lastName: '',
    cellphone: '',
    city: '',
    email: '',
    gender: '',
    summary: '',
    volunteerType: '',
    statue: '',
    files: [],
    talkSummary: '',
    studentoption: '',
    scholarshipName: '',
    officerName: '',
    officerPhone: '',
    hasDrivingLicence: '',
    availableInEmergency: '',
    educationalInstitution: '',
    address: ''


  });

  useEffect(() => {
    if (props.modalStatus === 'Edit') {
      setNewVolunteer({
        taz: props.data['taz'],
        volunteeringProgram: props.data['volunteeringProgram'][0],
        firstName: props.data['firstName'],
        lastName: props.data['lastName'],
        cellphone: props.data['cellphone'],
        city: props.data['city'],
        email: props.data['email'],
        gender: props.data['gender'],
        summary: props.data['summary'],
        volunteerType: props.data['volunteerType'],
        status: props.data['status'],
        files: [],
        talkSummary: props.data['talkSummary'],
        studentoption: props.data['studentoption'],
        scholarshipName: props.data['scholarshipName'],
        officerName: props.data['officerName'],
        officerPhone: props.data['officerPhone'],
        hasDrivingLicence: props.data['hasDrivingLicence'],
        availableInEmergency: props.data['availableInEmergency'],
        educationalInstitution: props.data['educationalInstitution'],
        address: props.data['address'],
        _id: props.data['_id'],
        hours: props.data['hours'],
      })
    }

  }, [])


  //===================================================


  const [enable, setEnable] = useState(true);

  const [emailIssue, setEmailIssue] = useState(false)
  const [emailValue, setEmailValue] = useState()

  const handleEditFileds = (e) => {
    if ([e.target.name] != 'email') {
      setNewVolunteer({ ...newVolunteer, [e.target.name]: e.target.value })
    }
    else {
      //=== make sure that there are no 2 emails alike ==============
      if (!volunteersEmails.includes(e.target.value)) {
        setNewVolunteer({ ...newVolunteer, [e.target.name]: e.target.value })
      }
      else {
        setEmailValue(e.target.value)
        setEmailIssue(true)

        // alert('?????????? ???????????? ?????? ???????? ????????????. ?????? ?????? ??????' + e.target.value)
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setNewVolunteer(newVolunteer);
    props.modalStatus === 'New' ? dispatch(saveVolunteer(newVolunteer)) : dispatch(saveVolunteer(newVolunteer, user));
    props.setOpen(false);
    dispatch(loadVolunteers())

  };

  return (
    <>
      <Modal open={props.open} onClose={() => props.setOpen(false)}>
        <Box className="new_vol_modal">
          <button className="new_vol_close-button" onClick={() => props.setOpen(false)} type="button" />

          <h1 className="new_vol_title">{props.modalStatus === 'New' ? '?????????? ?????????? ??????' : '?????????? ?????????? ??????????'}</h1>

          <div className="new_vol_modal_content">
            <form className="new_vol_modal_form" onSubmit={handleSubmit}>
              <div className="right">
                <label htmlFor="firstName" className="new_vol_modal_label">
                  ???? ????????*
                </label>
                <input
                  className="input"
                  type="text"
                  id="firstName"
                  name="firstName"
                  pattern=".{2,}"
                  value={newVolunteer.firstName}
                  title="?????? ?????? ???? ????????"
                  required
                  onChange={handleEditFileds}
                />

                <label htmlFor="lastName" className="new_vol_modal_label">
                  ???? ??????????*
                </label>
                <input
                  className="input"
                  type="text"
                  id="lastName"
                  name="lastName"
                  pattern=".{2,}"
                  value={newVolunteer.lastName}
                  title="?????? ?????? ???? ??????????"
                  required
                  onChange={handleEditFileds}
                />

                <label htmlFor="taz" className="new_vol_modal_label">
                  {' '}
                  ??.??*{' '}
                </label>
                <input
                  className="input"
                  type="text"
                  id="taz"
                  name="taz"
                  pattern=".{9}"
                  value={newVolunteer.taz}
                  title="?????? ?????? ?????????? ???????? ??????????"
                  required
                  onChange={handleEditFileds}
                />

                <label htmlFor="cellphone" className="new_vol_modal_label">
                  ??????????*{' '}
                </label>
                <input
                  className="input"
                  type="text"
                  id="cellphone"
                  name="cellphone"
                  pattern="05?[0-9]-?[0-9]{7}"
                  value={newVolunteer.cellphone}
                  title="?????? ?????? ???????? ???????????? ????????"
                  required
                  onChange={handleEditFileds}
                />
    
                <label htmlFor="email" className="new_vol_modal_label">
                  ????????*{' '}
                      {/*=======  modal in case of issues with data eneting  ===========  */}
                      <Modal1Comp trigger={emailIssue} setTrigger={setEmailIssue}>
                        <div className='modalMessage'> ?????????? {emailValue} ???????????? ?????? ???????? ????????????. ?????? ?????? ??????</div>
                      </Modal1Comp>
                </label>
                <input
                  className="input new_vol_modal_input_mail "
                  //type="email"
                  type="text"
                  id="email"
                  name="email"
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                  value={newVolunteer.email}
                  title="?????? ?????? ?????????? ???????? ??????????"
                  required
                  onChange={handleEditFileds}
                />

                <label htmlFor="address" className="new_vol_modal_label">
                  ??????????*
                </label>
                <input
                  className="input"
                  type="text"
                  id="address"
                  name="address"
                  pattern=".{2,}"
                  value={newVolunteer.address}
                  title="?????? ?????? ??????????"
                  required
                  onChange={handleEditFileds}
                />
              </div>
              <div className="center">
                <label htmlFor="city" className="new_vol_modal_label">
                  {' '}
                  ?????? ????????????*{' '}
                </label>
                <input
                  className="input"
                  type="text"
                  id="city"
                  name="city"
                  pattern=".{2,}"
                  value={newVolunteer.city}
                  title="?????? ?????? ??????"
                  required
                  //onChange={(e)=>setNewVolunteer({...newVolunteer, city: e.target.value})}
                  onChange={handleEditFileds}
                />

                <div className="grouping">
                  <label className="new_vol_modal_label">???????? ????????</label>
                  <div className="gender_group">
                    <span className="gender_btns">
                      <input
                        type="radio"
                        value="??????"
                        name="gender"
                        checked={newVolunteer.gender === '??????'}
                        onChange={handleEditFileds}
                      />
                      <label htmlFor="male">??????</label>
                    </span>
                    <span className="gender_btns">
                      <input
                        type="radio"
                        value="????????"
                        name="gender"
                        checked={newVolunteer.gender === '????????'}
                        onChange={handleEditFileds}
                      />
                      <label htmlFor="female">????????</label>
                    </span>
                    <span className="gender_btns">
                      <input
                        type="radio"
                        value="??????"
                        name="gender"
                        checked={newVolunteer.gender === '??????'}
                        onChange={handleEditFileds}
                      />
                      <label htmlFor="other">??????</label>
                    </span>
                  </div>
                </div>

                <div className="grouping">
                  <label className="new_vol_modal_label">?????????? ??????????</label>
                  <div className="gender_group">
                    <span className="gender_btns">
                      <input
                        type="radio"
                        value="????"
                        name="hasDrivingLicence"
                        checked={newVolunteer.hasDrivingLicence === '????'}
                        onChange={handleEditFileds}
                      />
                      <label htmlFor="has">????</label>
                    </span>
                    <span className="gender_btns">
                      <input
                        type="radio"
                        value="??????"
                        name="hasDrivingLicence"
                        checked={newVolunteer.hasDrivingLicence === '??????'}
                        onChange={handleEditFileds}
                      />
                      <label htmlFor="doesnthave">??????</label>
                    </span>
                  </div>
                </div>

                <div className="grouping">
                  <label className="new_vol_modal_label">???????????? ????????????</label>
                  <div className="gender_group">
                    <span className="gender_btns">
                      <input
                        type="radio"
                        value="????"
                        name="availableInEmergency"
                        checked={newVolunteer.availableInEmergency === '????'}
                        onChange={handleEditFileds}
                      />
                      <label htmlFor="canemergency">????</label>
                    </span>
                    <span className="gender_btns">
                      <input
                        type="radio"
                        value="????"
                        name="availableInEmergency"
                        checked={newVolunteer.availableInEmergency === '????'}
                        onChange={handleEditFileds}
                      />
                      <label htmlFor="cannotemergency">????</label>
                    </span>
                  </div>
                </div>

                <label className="new_vol_modal_label">?????????? ????????</label>
                <TextareaAutosize
                  type="text"
                  value={newVolunteer.talkSummary}
                  name="talkSummary"
                  className="summary_text"
                  onChange={handleEditFileds}
                />
              </div>

              <div className="left">
                <div>
                  <>
                    <label className="new_vol_modal_label">?????? ?????????? ??????????????</label>
                    <select
                      name="volunteeringProgram"
                      value={newVolunteer.volunteeringProgram}
                      className="input"
                      onChange={handleEditFileds}
                    >
                      {associatedPrograms.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </>

                  <label className="new_vol_modal_label">?????? ?????????? ????????</label>
                  <select
                    name="volunteerType"
                    className="input"
                    value={newVolunteer.volunteerType}
                    onChange={handleEditFileds}
                  >
                    <option id="0" value=" ?????? ?????????? ????????">
                      ?????? ?????????? ????????
                    </option>
                    <option id="1" value="??????????">
                      ??????????
                    </option>
                    <option id="2" value="????????????">
                      ????????????
                    </option>
                    <option id="3" value="??????">
                      ????"??
                    </option>
                  </select>
                  {newVolunteer.volunteerType === '????????????' && (
                    <>
                      <div className="student_group">
                        <span className="student_btns">
                          <input
                            type="checkbox"
                            value="??????"
                            name="studentoption"
                            studentoption="student"
                            checked={newVolunteer.studentoption === '??????'}
                            onChange={handleEditFileds}
                          />
                          <label htmlFor="nakaz">????"??</label>
                        </span>
                        <span className="student_btns">
                          <input
                            type="checkbox"
                            value="????????"
                            name="studentoption"
                            studentoption="student"
                            checked={newVolunteer.studentoption === '????????'}
                            onChange={handleEditFileds}
                          />
                          <label htmlFor="milga">????????</label>
                        </span>
                      </div>
                      <label className="new_vol_modal_label">???????? ??????????????</label>
                      <input
                        className="input"
                        type="text"
                        value={newVolunteer.educationalInstitution}
                        name="educationalInstitution"
                        required
                        onChange={handleEditFileds}
                      />

                      <label className="new_vol_modal_label">???? ??????????</label>
                      <input
                        className="input"
                        type="text"
                        value={newVolunteer.scholarshipName}
                        name="scholarshipName"
                        required
                        onChange={handleEditFileds}
                      />
                    </>
                  )}
                  {newVolunteer.volunteerType === '??????' && (
                    <>
                      <label className="new_vol_modal_label">???? ?????????? ????????</label>
                      <input
                        className="input"
                        type="text"
                        value={newVolunteer.officerName}
                        name="officerName"
                        required
                        onChange={handleEditFileds}
                      />
                      <label className="new_vol_modal_label">?????????? ?????????? ????????</label>
                      <input
                        className="input"
                        type="text"
                        value={newVolunteer.officerPhone}
                        name="officerPhone"
                        required
                        onChange={handleEditFileds}
                      />
                    </>
                  )}
                </div>
                <Button
                  variant="contained"
                  type="submit"
                  className={enable ? 'new_vol_modal_btn bton-icon' : 'new_vol_modal_btn bton-icon disable'}
                >
                  {props.modalStatus === 'New' ? ' ???????? ????????????' : '???????? ??????????'}
                </Button>
              </div>
            </form>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default NewVolunteerModal;
