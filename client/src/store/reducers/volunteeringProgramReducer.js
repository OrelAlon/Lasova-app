const initialState = {
  volunteeringProgram: null,
  volunteeringProgramToShow: null
};

export function volunteeringProgramReducer(state = initialState, action) {
  switch (action.type) {
    case 'LOAD_VOLUNTEERING_PROGRAM':
      return {
        ...state,
        volunteeringProgram: action.volunteeringProgram,
        volunteeringProgramToShow: action.volunteeringProgram
      };

    default:
      return state;
  }
}
