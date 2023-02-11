const logger = require('../../services/logger.service');
const VolunteeringProgram = require('./volunteering-program.schema');

async function query({ volunteeringPrograms } = {}) {
  try {
    const volunteeringPrograms = await VolunteeringProgram.find();
    return volunteeringPrograms;
  } catch (err) {
    logger.error('failed to fetch volunteeringPrograms' + err);
    throw err;
  }
}

module.exports = {
  query
};
