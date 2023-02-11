import { httpService } from './http-service';

export const volunteeringProgramService = {
  query
};

const BASE_URL = 'volunteering-program';

function query({} = {}) {
  return httpService.get(`${BASE_URL}`);
}
