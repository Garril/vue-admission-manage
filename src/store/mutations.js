import {
  SAVE_PATHQUERY,
  
} from './mutation-types.js'

export default {
  [SAVE_PATHQUERY](state,payload) {
    state.pathQuery = payload;
  }

}

