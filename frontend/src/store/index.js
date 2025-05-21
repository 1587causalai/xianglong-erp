import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || '',
    user: JSON.parse(localStorage.getItem('user')) || null,
    loading: false
  },
  getters: {
    isAuthenticated: state => !!state.token,
    currentUser: state => state.user
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
    },
    SET_USER(state, user) {
      state.user = user
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    CLEAR_AUTH(state) {
      state.token = ''
      state.user = null
    }
  },
  actions: {
    // 登录
    async login({ commit }, credentials) {
      commit('SET_LOADING', true)
      try {
        const response = await axios.post('/auth/login', credentials)
        const { token, user } = response.data
        
        if (!token || !user) {
            console.error('Failed to destructure token or user from response.data', response.data);
            throw new Error('从后端响应中未能正确获取token或用户信息');
        }

        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        
        commit('SET_TOKEN', token)
        commit('SET_USER', user)
        
        return response
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    // 登出
    logout({ commit }) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      commit('CLEAR_AUTH')
    },
    
    // 获取用户信息
    async fetchUserInfo({ commit }) {
      commit('SET_LOADING', true)
      try {
        const response = await axios.get('/auth/me')
        const user = response.data.user
        
        if (!user || Object.keys(user).length === 0) {
            console.error('Failed to get user info from response.data.user', response.data);
            throw new Error('未能从后端响应中获取有效的用户信息');
        }

        localStorage.setItem('user', JSON.stringify(user))
        commit('SET_USER', user)
        
        return user
      } finally {
        commit('SET_LOADING', false)
      }
    }
  }
})
