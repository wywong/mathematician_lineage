import { SELECT_MATHEMATICIAN } from './actions/actions';

const initialState = {
  mathId: null
};

function rootReducer(state = initialState, action) {
  switch(action.type) {
    case SELECT_MATHEMATICIAN:
      return {
        mathId: action.id,
        fullName: action.fullName
      };
    default:
      return state;
  }
}

export default rootReducer;
