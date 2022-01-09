import {
  SAVE_PATHQUERY,
  UPDATE_CLASSLIST,
  UPDATE_STULIST
} from './mutation-types.js'

export default {
  [SAVE_PATHQUERY](state,payload) {
    state.pathQuery = payload;
  },
  [UPDATE_STULIST](state,payload) {
    state.stuUpdate = payload;
  },
  [UPDATE_CLASSLIST](state,payload) {
    state.classUpdate = payload;
  }

}

