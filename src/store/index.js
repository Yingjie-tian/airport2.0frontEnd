import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({

  state: {
    // token 令牌
    token: '',
    // 登录的角色
    rolen: '',
    // 登录的用户名
    usernamen: '',
    // 测试数据名称
    testDataNameVuex: '',
    // 机场名称
    airportNameVuex: ''

  },
  mutations: {
    // 保存token
    set_token(state, token) {
      // 保存至vuex
      state.token = token
      // 保存至本地
      sessionStorage.token = token
    },
    // 删除token
    del_token(state) {
      state.token = ''
      sessionStorage.removeItem('token')
    },
    // 保存角色role
    set_role(state, rolen) {
      state.rolen = rolen
      sessionStorage.rolen = rolen
    },
    // 保存用户名username
    set_username(state, usernamen) {
      state.usernamen = usernamen
      sessionStorage.usernamen = usernamen
    },
    // 保存测试数据名称-用于共享
    set_testDataNameVuex(state, testDataNameVuex) {
      state.testDataNameVuex = testDataNameVuex
      sessionStorage.testDataNameVuex = testDataNameVuex
    },
    // 删除测试数据名称
    del_testDataNameVuex(state) {
      state.testDataNameVuex = ''
      sessionStorage.removeItem('testDataNameVuex')
    },
    // 保存机场名称-用于共享
    set_airportNameVuex(state, airportNameVuex) {
      state.airportNameVuex = airportNameVuex
      sessionStorage.airportNameVuex = airportNameVuex
    },
    // 删除机场名称
    del_airportNameVuex(state) {
      state.airportNameVuex = ''
      sessionStorage.removeItem('airportNameVuex')
    },
  },

})
