// temporary service to mimic server-DB requests
import { storageService } from '../../services/async-storage.service';
import { volunteeringProgramService } from '../../services/volunteeringProgram-service';
const STORAGE_KEY = 'volunteering-program';

/*******************************************************************************************/

export function loadVolunteeringProgram() {
  return async (dispatch) => {
    try {
      const volunteeringProgram = await volunteeringProgramService.query();
      dispatch({ type: 'LOAD_VOLUNTEERING_PROGRAM', volunteeringProgram });
    } catch (err) {
      console.log('Error loading groups:');
      console.error(err);
    }
  };
}
