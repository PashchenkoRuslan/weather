import { createStore } from 'vuex'
import axios from 'axios'

export interface State {
  location: string
  weatherData: any // можно заменить на более конкретный тип данных
  favourites: string[]
  weatherWallpaper: string | null
  locationInput: string
  isError: number
  isLoading: boolean
}

const store = createStore<State>({
  state: () => ({
    location: '',
    weatherData: null,
    favourites: JSON.parse(localStorage.getItem('favourites') || '[]'),
    weatherWallpaper: null,
    locationInput: '',
    isError: 0,
    isLoading: false
  }),
  getters: {
    isAdded(state) {
      return state.weatherData && state.favourites.includes(state.weatherData.name)
    },
    isShow(state) {
      return !!state.weatherData
    }
  },
  mutations: {
    setLocation(state, location: string) {
      state.location = location
    },
    setWeatherData(state, data: any) {
      // Замените 'any' на конкретный тип
      state.weatherData = data
    },
    setFavourites(state, favourites: string[]) {
      state.favourites = favourites
      localStorage.setItem('favourites', JSON.stringify(favourites))
    },
    setWeatherWallpaper(state, data: string) {
      state.weatherWallpaper = data.toLowerCase()
    },
    setLocationInput(state, locationInput: string) {
      state.locationInput = locationInput
    },
    setError(state, isError: number) {
      // Теперь принимает код ошибки
      state.isError = isError
    },
    setLoading(state, isLoading: boolean) {
      state.isLoading = isLoading
    }
  },
  actions: {
    async fetchItems({ commit, state }) {
      commit('setLoading', true)
      try {
        const { data } = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${state.location}&appid=6f762ff567a5ccaf339a0744bd179852`
        )
        if (data) {
          commit('setWeatherData', data)
          commit('setWeatherWallpaper', data.weather[0].main)
          commit('setError', 0)
        }
      } catch (error: any) {
        if (error.response) {
          commit('setError', error.response.status)
        } else {
          commit('setError', 500)
        }
      } finally {
        commit('setLoading', false)
      }
    },
    addToFavourites({ state, commit }) {
      const locationName = state.weatherData?.name
      if (locationName && state.favourites.length < 5 && !state.favourites.includes(locationName)) {
        const newFavourites = [...state.favourites, locationName]
        commit('setFavourites', newFavourites)
      } else if (state.favourites.includes(locationName)) {
        const newFavourites = state.favourites.filter((fav) => fav !== locationName)
        commit('setFavourites', newFavourites)
      }
    },
    removeFromFavourites({ state, commit }, location: string) {
      const newFavourites = state.favourites.filter((fav) => fav !== location)
      commit('setFavourites', newFavourites)
    },
    clearFavourites({ commit }) {
      commit('setFavourites', [])
    },
    useLocation({ commit, dispatch }, tempLocation: string) {
      commit('setLocation', tempLocation)
      commit('setLocationInput', '')
      dispatch('fetchItems')
    }
  }
})

export default store
