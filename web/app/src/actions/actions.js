export const SELECT_MATHEMATICIAN = 'SELECT_MATHEMATICIAN';

export function selectMathematician(id, fullName) {
  return { type: SELECT_MATHEMATICIAN, id: id, fullName: fullName };
}
