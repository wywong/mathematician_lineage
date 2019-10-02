import { SELECT_MATHEMATICIAN, DATA_STATE, FETCH_STUDENTS_STARTED, FETCH_STUDENTS_SUCCESS } from './actions/actions';
import { LineageTree, LineageNode } from './models/tree';

const initialState = {
  rootMathematician: null,
  tree: null,
  studentsState: DATA_STATE.UNLOADED
};

function rootReducer(state = initialState, action) {
  switch(action.type) {
    case SELECT_MATHEMATICIAN:
      let root = new LineageNode(
        action.id,
        action.fullName,
        action.image_url,
        action.wiki_url,
        []
      );
      let tree = new LineageTree(root);
      return {
        rootMathematician: root,
        tree: tree
      };
    case FETCH_STUDENTS_STARTED:
      return Object.assign(
        {}, state, {
          studentsState: DATA_STATE.FETCHING
        });
    case FETCH_STUDENTS_SUCCESS:
      let students = action.students.map(student => {
        return new LineageNode(
          student.id,
          student.full_name,
          student.image_url,
          student.wiki_url,
          []
        );
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
