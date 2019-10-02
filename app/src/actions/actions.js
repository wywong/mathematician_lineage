import axios from 'axios';

export const SELECT_MATHEMATICIAN = 'SELECT_MATHEMATICIAN';

export function selectMathematician(mathematician) {
  return {
    type: SELECT_MATHEMATICIAN,
    id: mathematician.id,
    fullName: mathematician.full_name,
    image_url: mathematician.image_url,
    wiki_url: mathematician.wiki_url,
  };
}

export const FETCH_STUDENTS_STARTED = 'FETCH_STUDENTS_STARTED';
export const FETCH_STUDENTS_SUCCESS = 'FETCH_STUDENTS_SUCCESS';
export const FETCH_STUDENTS_FAILED = 'FETCH_STUDENTS_FAILED';

export const DATA_STATE = Object.freeze({
  UNLOADED: Symbol('UNLOADED'),
  FETCHING: Symbol('FETCHING'),
  FAILED: Symbol('FAILED'),
  SUCCESS: Symbol('SUCCESS')
});

export const fetchStudents = id => {
  return dispatch => {
    dispatch(fetchStudentsStarted());
    axios.get(`/api/mathematician/${id}/students/`)
      .then(res => {
        dispatch(fetchStudentsSuccess(id, res.data));
      })
      .catch(err => {
        // todo
      });
  };
};


function fetchStudentsStarted() {
  return { type: FETCH_STUDENTS_STARTED };
};

export function fetchStudentsSuccess(id, mathematicians) {
  return {
    type: FETCH_STUDENTS_SUCCESS,
    id: id,
    students: mathematicians
  };
}

