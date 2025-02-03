<script lang="ts" setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { State } from '../store/store'

const store = useStore<State>()
const isAdded = computed<boolean>(() => store.getters.isAdded)
const isShow = computed<boolean>(() => store.getters.isShow)
const isError = computed<number>(() => store.state.isError)
const isLoading = computed<boolean>(() => store.state.isLoading)
const weatherData = computed(() => store.state.weatherData)
const locationInput = computed<string>({
  get: () => store.state.locationInput,
  set: (value: string) => store.commit('setLocationInput', value)
})

const addToFavourites = () => store.dispatch('addToFavourites')
const useLocation = (tempLocation: string) => store.dispatch('useLocation', tempLocation)

const kelvinToCelsius = (temp: number): number => {
  return Math.round(temp - 273.15)
}

const unixToReadableDate = (unixTime: number): string => {
  const date = new Date(unixTime * 1000)
  return date.toLocaleString()
}
</script>

<template>
  <div
    class="w-full max-w-xs mx-auto p-6 sm:p-10 border border-gray-400 rounded-3xl shadow bg-gray-50"
  >
    <div class="container mx-auto">
      <div class="relative">
        <img
          v-if="locationInput"
          @click="() => useLocation(locationInput)"
          src="/search.svg"
          class="absolute right-4 sm:right-6 top-4 cursor-pointer hover:scale-110"
          alt="Search"
        />
        <input
          class="w-full block mx-auto h-12 border-2 border-black/10 rounded-full outline-none bg-transparent text-base px-6 transition-all duration-400 mt-4 mb-4 focus:bg-white focus:shadow-md focus:border-opacity-5 focus:font-semibold mb-5"
          type="text"
          v-model="locationInput"
          placeholder="Enter Location"
          @keydown.enter="() => useLocation(locationInput)"
        />
      </div>
    </div>

    <div
      v-if="isLoading"
      class="flex flex-col items-center justify-center h-full text-center text-gray-500"
    >
      <p class="text-lg font-semibold">Loading...</p>
    </div>

    <div
      v-else-if="isError === 400"
      class="flex flex-col items-center justify-center h-full text-center text-gray-500"
    >
      <img src="/no-data.svg" alt="No Data" class="w-16 h-16 mb-4" />
      <p class="text-lg font-semibold">Please enter a location</p>
      <p class="text-sm">Please enter a valid location to see the weather information.</p>
    </div>

    <div
      v-else-if="isError === 404"
      class="flex flex-col items-center justify-center h-full text-center text-gray-500"
    >
      <img src="/no-data.svg" alt="No Data" class="w-16 h-16 mb-4" />
      <p class="text-lg font-semibold">404 Not Found</p>
      <p class="text-sm">The server is not responding.</p>
    </div>

    <div v-else-if="isShow && weatherData">
      <div class="flex flex-col sm:flex-row justify-between">
        <div>
          <div class="text-gray-500 text-l font-bold mt-4">{{ weatherData.name }}</div>
          <div v-if="isShow && weatherData" class="text-xs font-semibold mb-4 text-gray-500">
            Updated: {{ unixToReadableDate(weatherData.dt) }}
          </div>
        </div>
        <button @click="() => addToFavourites()" class="btn btn-primary">
          <img
            class="hover:scale-110"
            :src="!isAdded ? '/like-1.svg' : '/like-2.svg'"
            alt="Favourite"
          />
        </button>
      </div>

      <div class="flex flex-col sm:flex-row items-center mt-4">
        <div class="text-6xl font-bold">{{ kelvinToCelsius(weatherData.main.temp) }}°</div>
        <div class="ml-0 sm:ml-2 flex items-center">
          <div class="text-gray-500">
            <img
              :src="`https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`"
              alt="weather icon"
              class="bg-gray-200 rounded-full w-8 h-8"
            />
          </div>
          <div class="text-gray-500 ml-2 capitalize">
            {{ weatherData.weather[0].description }}
          </div>
        </div>
      </div>

      <div class="line w-full bg-gray-200 h-[1px] my-4"></div>
      <div class="mt-4 text-sm">
        <div class="flex justify-between">
          <span class="text-gray-500">Feels like</span>
          <span class="font-semibold">{{ kelvinToCelsius(weatherData.main.feels_like) }}°C</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">Wind</span>
          <span class="font-semibold">{{ weatherData.wind.speed }} m/s</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">Probability of rain</span>
          <span class="font-semibold">0%</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">Humidity </span>
          <span class="font-semibold">{{ weatherData.main.humidity }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>
