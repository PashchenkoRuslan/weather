<script lang="ts" setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { State } from '../store/store'

interface Props {
  isFavouriteOpen: boolean
}

const store = useStore<State>()

defineProps<Props>()

const emit = defineEmits<{
  (e: 'handle-favourites-open'): void
}>()

const favourites = computed<string[]>(() => store.state.favourites)

const useLocation = (tempLocation: string): Promise<void> =>
  store.dispatch('useLocation', tempLocation)
const removeFromFavourites = (location: string): Promise<void> =>
  store.dispatch('removeFromFavourites', location)
const clearFavourites = (): Promise<void> => store.dispatch('clearFavourites')

const onClickFavourites = (): void => {
  emit('handle-favourites-open')
  clearFavourites()
}

const onClickChangeLocation = (location: string): void => {
  useLocation(location)
  emit('handle-favourites-open')
}
</script>

<template>
  <div
    @click="$emit('handle-favourites-open')"
    v-if="isFavouriteOpen"
    class="w-full h-full absolute z-10 left-0 top-0 bg-black bg-opacity-40 fadeIn flex items-center justify-center"
  >
    <div
      class="w-full max-w-md h-3/4 sm:h-2/3 m-4 sm:m-auto p-4 sm:p-10 bg-gray-50 fadeIn rounded-3xl relative"
      @click.stop
    >
      <div class="flex items-center">
        <svg
          @click="$emit('handle-favourites-open')"
          class="opacity-30 cursor-pointer rotate-180 hover:opacity-100 hover:-translate-x-1 transition"
          width="16"
          height="14"
          viewBox="0 0 16 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 7H14.7143"
            stroke="black"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M8.71436 1L14.7144 7L8.71436 13"
            stroke="black"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <h2 class="text-xl sm:text-2xl font-bold ml-4">Favourites</h2>
      </div>

      <div class="mx-auto p-4 rounded mt-4" v-if="favourites.length > 0">
        <p class="text-gray-500 text-center mb-4 font-semibold text-xs sm:text-base">
          Choose a location from the list.
        </p>
        <div
          class="text-sm sm:text-lg mb-4 text-black font-semibold capitalize border border-gray-300 p-3 cursor-pointer hover:bg-gray-200 hover:scale-105 transition-all rounded-lg flex items-center justify-between"
          v-for="favourite in favourites"
          :key="favourite"
          @click="() => onClickChangeLocation(favourite)"
        >
          {{ favourite }}
          <button
            @click.stop="removeFromFavourites(favourite)"
            class="ml-4 relative hover:scale-110 border-none bg-red-400 text-white p-1 rounded-full hover:bg-red-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path fill="none" d="M0 0h24v24H0z" />
              <path
                fill="currentColor"
                d="M18.3 5.71a1 1 0 00-1.41 0L12 10.59 7.11 5.7a1 1 0 00-1.41 1.41L10.59 12l-4.89 4.88a1 1 0 001.41 1.41L12 13.41l4.88 4.88a1 1 0 001.41-1.41L13.41 12l4.88-4.88a1 1 0 000-1.41z"
              />
            </svg>
          </button>
        </div>
      </div>
      <button
        @click="onClickFavourites"
        class="btn btn-primary absolute bottom-4 left-[50%] transform -translate-x-[50%] text-black hover:text-black-300 hover:scale-110"
      >
        Clear all
      </button>
    </div>
  </div>
</template>
