const state = {
  isLogin: false
}

const mutations = {
  SET_LOGIN_STATE (state, payload) {
    state.isLogin = payload
  }
}

const actions = {
  setLoginState ({ commit }, state) {
    // do something async
    commit('SET_LOGIN_STATE', state)
  }
}

const getters = {
  getLoginState (state) {
    return state.isLogin
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
