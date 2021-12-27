import {
  SAVE_USER,

} from './mutation-types.js'

export default {
  [SAVE_USER](state,payload) {
    state.user = payload;
  }

}

