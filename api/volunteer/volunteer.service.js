const logger = require('../../services/logger.service');
const Volunteer = require('./volunteer.schema');
const { ErrorMessages } = require('../../lib/consts/ErrorMessages');
/**
 * Currently acceps isDefault and doReset as params,
 * doReset - flag that indicates whether should restore data to initial value
 * isDefault - flag that indicates whether should use initial data */
async function query(filter = {}) {
  console.log('query in the back');
  console.log('filter');
  console.log(filter);
  try {
    const criteria = _buildVolunteerQueryFilter(filter);
    console.log('criteria');
    console.log(criteria);
    const volunteers = await Volunteer.find(criteria);
    console.log('volunteerscriteria');
    console.log(volunteers);

    return volunteers;
  } catch (err) {
    logger.error('failed to fetch volunteers' + err);
    throw err;
  }
}

async function getById(volunteerId) {
  try {
    const volunteer = await Volunteer.findById(volunteerId);
    return volunteer;
  } catch (err) {
    logger.error('failed to fetch voluntter' + err);
    throw err;
  }
}

async function add(volunteer) {
  try {
    volunteer = new Volunteer(volunteer);
    volunteer.save((err, volunteer) => {
      if (err) return logger.error('couldnt save volunteer', err);
    });
    return volunteer;
  } catch (err) {
    logger.error("couldn't add volunteer ", err);
    throw err;
  }
}

async function remove(volunteerIds) {
  try {
    const res = await Volunteer.deleteMany({
      _id: { $in: volunteerIds }
    });
    return res;
  } catch (err) {
    logger.error(`error trying to delete ${volunteerIds.split(',')}`, err);
  }
}

async function adminUpdate(volunteer, currentUser) {
  try {
    console.log('adminUpdate');
    const originalVolunteer = await Volunteer.findById(volunteer._id);
    // check if the same user who posting
    var volunteerInHisProgram = false;
    if (currentUser.userType === 1) {
      console.log('currentUser.userType === 1');
      Object.values(currentUser.associatedPrograms).forEach((program) => {
        // orel enter this
        if (originalVolunteer.volunteeringProgram[0] === program['_id']) {
          // if (originalVolunteer.volunteeringProgram[0] === program['name']) { //orel delete this
          // if (originalVolunteer.volunteeringProgram[0] === program) {
          //Naama- changed for test
          volunteerInHisProgram = true;
        }
      });
    }
    if (currentUser.userType === 2) {
      volunteerInHisProgram = true;
    }
    if (!volunteerInHisProgram) {
      throw Error(ErrorMessages.DontHavePermission);
    }

    const res = await Volunteer.findByIdAndUpdate(volunteer._id, volunteer);
    return res;
  } catch (err) {
    logger.error(`error updating volunteer ${volunteer._id}`, err);
    throw err;
  }
}

async function volunteerUpdate(volunteer, currentUser) {
  console.log('volunteer');
  console.log(volunteer);

  try {
    const originalVolunteer = await Volunteer.findById(volunteer._id);
    // check if the same user who posting

    console.log('originalVolunteer', originalVolunteer)

    checkIfSameUser = query({ email: currentUser.email }).then((response) => {
      if (response[0].email !== originalVolunteer.email) {
        console.log('test0');

        throw Error(ErrorMessages.DontHavePermission);
      }
    });
    // check if volunteer only changed what he have permission to

    for (const [key, value] of Object.entries(volunteer)) {
      console.log(originalVolunteer[key]);
      if (key === 'hours') { 
        value.map((entry, index) => {
          console.log('entry');
          console.log(entry);
          // if (
          //   // ask namma why????
          //   originalVolunteer.hours.includes(originalVolunteer.hours[index]) === false &&
          //   entry['verified'] !== false
          // ) {
          //   console.log('test1');

          //   throw Error(ErrorMessages.DontHavePermission);
          // }
          // delete ==> orel
          // if (
          //   originalVolunteer.hours.includes(originalVolunteer.hours[index]) &&
          //   entry['verified'] == !originalVolunteer.hours[index]['verified']
          // ) {

          //   throw Error(ErrorMessages.DontHavePermission);
          // }
          if (
            originalVolunteer.hours.includes(originalVolunteer.hours[index]) &&
            [volunteer['hours'][0].date, volunteer['hours'][0].start, volunteer['hours'][0].end] !==
              [
                originalVolunteer.hours[index]['date'],
                originalVolunteer.hours[index]['start'],
                originalVolunteer.hours[index]['end']
              ] &&
            volunteer['hours'][0].verified !== false
          ) {
            console.log('test2');

            throw Error(ErrorMessages.DontHavePermission);
          }
        });
      } else if ((value == !originalVolunteer[key]) && key!='weekdayAvailability') {  //mayan - removed weekdayAvailability 16.2.23
        console.log('test3');
        console.log('value', value);
        console.log('key', key)
        console.log(originalVolunteer[key]);

        throw Error(ErrorMessages.DontHavePermission);
      }
    }

    const res = await Volunteer.findByIdAndUpdate(volunteer._id, volunteer);
    return res;
  } catch (err) {
    logger.error(`error updating volunteer ${volunteer.id}`, err);
    throw err;
  }
}

const _buildVolunteerQueryFilter = (query) => {
  const filter = {};
  Object.keys(query).forEach((currQueryKey) => {
    switch (currQueryKey) {
      case 'volunteeringPrograms':
        filter['volunteeringProgram._id'] = {
          $in: query.volunteeringPrograms?.map((vp) => {
            return vp._id;
          })
        };
        console.log(filter);
        break;
      default:
        filter[currQueryKey] = query[currQueryKey];
        break;
    }
  });

  return filter;
};

module.exports = {
  query,
  remove,
  adminUpdate,
  volunteerUpdate,
  getById,
  add
};
