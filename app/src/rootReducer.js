import { SELECT_MATHEMATICIAN, DATA_STATE, FETCH_STUDENTS_STARTED, FETCH_STUDENTS_SUCCESS } from './actions/actions';
import { LineageTree, LineageNode } from './models/tree';

const initialState = {
  mathId: null,
  fullName: null,
  tree: null,
  studentsState: DATA_STATE.UNLOADED
};

function rootReducer(state = initialState, action) {
  switch(action.type) {
    case SELECT_MATHEMATICIAN:
      let tree = new LineageTree(new LineageNode(action.id, action.fullName, []));
      return {
        mathId: action.id,
        fullName: action.fullName,
        students: [],
        tree: tree
      };
    case FETCH_STUDENTS_STARTED:
      return Object.assign(
        {}, state, {
          studentsState: DATA_STATE.FETCHING
        });
    case FETCH_STUDENTS_SUCCESS:
      let students = action.students.map(student => {
        return {
          id: student.id,
          fullName: student.full_name,
          students: []
        };
      });
      state.tree.setStudents(action.id, students);

      return Object.assign(
        {}, state, {
          tree: state.tree,
          studentsState: DATA_STATE.SUCCESS
        }
      );
    default:
      return state;
  }
}

export default rootReducer;
