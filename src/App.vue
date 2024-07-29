<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { State } from './store/store' // Импортируем типы из store

import WeatherDisplay from '@/components/WeatherDisplay.vue'
import FavouritesLists from '@/components/FavouritesList.vue'

const wallpapers: Record<string, string> = {
  clear: './main.jpg',
  clouds: './clouds.png',
  rain: './rain.png',
  snow: './snow.png'
}
const store = useStore<State>()
const isFavouriteOpen = ref(false)
const weatherWallpaper = computed(() => store.state.weatherWallpaper)

const handleFavouritesOpen = () => {
  isFavouriteOpen.value = !isFavouriteOpen.value
}

onMounted(async () => {
  if (store.state.favourites.length === 1) {
    const [favouriteLocation] = store.state.favourites
    store.commit('setLocation', favouriteLocation)
  } else if (store.state.favourites.length > 1) {
    handleFavouritesOpen()
  }
  await store.dispatch('fetchItems')
})
</script>

<template>
  <div
    class="content h-screen w-full relative top-0 left-0 pt-48"
    :style="{
      background: weatherWallpaper
        ? `url(${wallpapers[weatherWallpaper]}) center center/cover no-repeat`
        : 'url(./nothing3.png) center center/cover no-repeat'
    }"
  >
    <WeatherDisplay />

    <FavouritesLists
      :is-favourite-open="isFavouriteOpen"
      @handle-favourites-open="handleFavouritesOpen"
    />

    <button
      v-if="store.state.favourites.length > 0"
      @click="handleFavouritesOpen"
      class="block mx-auto mt-4 text-white hover:text-gray-300 hover:scale-110 transition-all cursor-pointer text-lg font-semibold"
    >
      Favourites
    </button>
  </div>
</template>
