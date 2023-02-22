// temporary service to mimic server-DB requests
import { storageService } from '../../services/async-storage.service';
import { volunteerService } from '../../services/volunteer-service';
const STORAGE_KEY = 'volunteers';
// TEMPORARY IIFE to load volunteers from mock_data.json to localStorage
(function loadMockToStorage() {
  if (!JSON.parse(localStorage.getItem(STORAGE_KEY))) {
    const mockData = require('../../services/mock-data.json');
    localStorage[STORAGE_KEY] = JSON.stringify(mockData);
  }
})();

// serverService will be used to make requests to server:
// import { serverService } from "../../services/client-server.service"

/*******************************************************************************************/

export function loadVolunteers(email = null) {
  //naama-added email to try to get volunteer by user details
  console.log('email', email);
  return async (dispatch) => {
    try {
      if (!email) {
        const volunteers = await volunteerService.query();
        console.log('volunteers444444', volunteers);
        dispatch({ type: 'LOAD_VOLUNTEERS', volunteers });
      } else {
        // if (email) {
        const filteredVolunteers = await volunteerService.query({ email });
        const volunteerData = filteredVolunteers[0];
        // console.log('volunteerData:', volunteerData);
        //const volunteerData = volunteers.find((volunteer)=> volunteer.email=email) //naama
        dispatch({ type: 'LOAD_VOLUNTEER', volunteerData }); //naama
      }
    } catch (err) {
      console.log('Error loading volunteers:');
      console.error(err);
    }
  };
}

//naama
export function loadVolunteerById(userId) {
  return async (dispatch) => {
    try {
      const volunteerData = await volunteerService.getVolunteerById(userId);
      dispatch({ type: 'LOAD_VOLUNTEER', volunteerData });
    } catch (err) {
      console.log('Error loading volunteer:');
      console.error(err);
    }
  };
}

//Naama- tried to filter status with current search, i need to create 'filterBy' that will include both and send them together.
export function searchVolunteers(searchText, status) {
  return (dispatch, getState) => {
    console.log('searchText1111', searchText);
    console.log('status1111', status);
    const { volunteers } = getState().volunteerReducer;
    if (!searchText) {
      let filteredVolunteers = filterVolunteersByStatus(status, volunteers);
      dispatch({ type: 'SEARCH_VOLUNTEERS', filteredVolunteers });
    } else {
      let filteredVolunteers = volunteers.filter((volunteer) => {
        return (
          volunteer.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
          volunteer.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
          volunteer.taz.includes(searchText.toLowerCase())
        );
      });
      if (status) filteredVolunteers = filterVolunteersByStatus(status, filteredVolunteers);
      dispatch({ type: 'SEARCH_VOLUNTEERS', filteredVolunteers });
    }
  };
}

//Naama
function filterVolunteersByStatus(status, volunteers) {
  //return (dispatch) => {
  if (!status) return volunteers;
  let filteredVolunteers = volunteers.filter((volunteer) => {
    if (status === 'standby')
      return volunteer.status.toLowerCase() === status.toLowerCase() || volunteer.status.toLowerCase() === '';
    return volunteer.status.toLowerCase() === status.toLowerCase();
  });
  //dispatch({ type: 'SEARCH_VOLUNTEERS', filteredVolunteers });
  // };
  return filteredVolunteers;
}

/**
 * save refers both to put and post requests
 * if volunteer has id, we know it is an update request,
 * else it is post. */
export function saveVolunteer(volunteerToSave, user) {
  // console.log('saveVolunteersaveVolunteersaveVolunteer');
  // console.log(volunteerToSave);
  // console.log(volunteerToSave._id);
  // console.log(user);
  return async (dispatch) => {
    try {
      const type = volunteerToSave._id ? 'UPDATE_VOLUNTEER' : 'ADD_VOLUNTEER';

      if (type === 'UPDATE_VOLUNTEER') {
        console.log('OREL-UPDATE_VOLUNTEER');
        var updatedVolunteer = volunteerService.saveVolunteer(volunteerToSave, user); //Naama //why???
      } else {
        volunteerToSave = await volunteerService.saveVolunteer(volunteerToSave);
      }
      
      dispatch({ type, volunteer: volunteerToSave });
      return updatedVolunteer;
    } catch (err) {
      console.error(err);
    }
  };
}

export function removeVolunteer(volunteerId) {
  return async (dispatch) => {
    try {
      await storageService.remove(STORAGE_KEY, volunteerId);
      dispatch({ type: 'REMOVE_VOLUNTEER', volunteerId });
    } catch (err) {
      console.log('error removing volunteer with ID:', volunteerId);
      console.error(err);
    }
  };
}

// export function setFilter(newFilters) {
//   return (dispatch, getState) => {
//     const { volunteers } = getState().volunteerReducer;
//     const filteredVolunteers = volunteers; //volunteers.filter.....
//     dispatch({ type: "SET_AND_FILTER", newFilters, filteredVolunteers });
//   }
// }
