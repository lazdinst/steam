import * as constants from '../constants/app';

/** ============================================================
 * Define Initial State
 * ========================================================== */
const initialState = {
  app: {
    taskTitle: 'Tasks',
    tasks: [],
    nextTaskId: 0,
    toggleForm: false,
    toggleTitleInput: false
  }
};
export const exportedState = Object.assign({}, initialState);
/** ============================================================
 * Define Reducer
 * ========================================================== */
export default (state = initialState, action) => {
  switch (action.type) {
  case constants.GET_ALL_TASKS:
    return {
      ...state,
      tasks: action.tasks,
      nextTaskId: action.nextTaskId
    };
  case constants.DELETE_TASK:
    return {
      ...state,
      tasks : state.tasks.filter((task) => { return task.id !== action.id})
    };
  case constants.SAVE_ALL_TASKS : 
    return {
      ...state,
      postSuccess: action.postSuccess,
      postFailure: !action.postSuccess
    };
  default:
    return state;
  }
};