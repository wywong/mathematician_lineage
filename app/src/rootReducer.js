import { SELECT_MATHEMATICIAN, DATA_STATE, FETCH_STUDENTS_SUCCESS } from './actions/actions';

const initialState = {
  mathId: null,
  fullName: null,
  students: []
};

function rootReducer(state = initialState, action) {
  switch(action.type) {
    case SELECT_MATHEMATICIAN:
      return {
        mathId: action.id,
        fullName: action.fullName,
        students: []
      };
    case FETCH_STUDENTS_SUCCESS:
      return Object.assign(
        {}, state, {
          students: action.students.map(student => {
            return {
              id: student.id,
              fullName: student.full_name
            };
          })
        }
      );
    default:
      return state;
  }
}

export default rootReducer;
