const { query } = require('./volunteering-program.service');

async function getVolunteeringPrograms(req, res) {
  try {
    const queryOptions = req.query;
    const volunteeringPrograms = await query(queryOptions);
    res.send(volunteeringPrograms);
  } catch (err) {
    res.status(500).send({ err: 'Failed to fetch volunteeringPrograms' });
  }
}

module.exports = {
  getVolunteeringPrograms
};
