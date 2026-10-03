<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { ChevronLeft, ChevronRight, Ticket, Timer } from 'lucide-vue-next'
import type { FeaturedMovie } from '@/api/movies'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'

const props = defineProps<{ movies: FeaturedMovie[] }>()

const AUTOPLAY_MS = 6000
const index = ref(0)
const paused = ref(false)
let timer: number | undefined

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

function go(target: number) {
  const total = props.movies.length
  index.value = (target + total) % total
}

function stop() {
  window.clearInterval(timer)
}

function start() {
  stop()
  if (props.movies.length > 1 && !prefersReducedMotion) {
    timer = window.setInterval(() => {
      if (!paused.value) go(index.value + 1)
    }, AUTOPLAY_MS)
  }
}

function select(target: number) {
  go(target)
  start()
}

onMounted(start)
onBeforeUnmount(stop)

function backdropOf(movie: FeaturedMovie) {
  return movie.backdropUrl ?? movie.posterUrl ?? undefined
}

function premiereLabel(releaseDate: string) {
  const date = new Date(releaseDate)
  if (Number.isNaN(date.getTime())) return null
  const month = date.toLocaleString('en-GB', { month: 'short' }).toUpperCase()
  return `PREMIERE · WEEK OF ${date.getDate()} ${month}`
}
</script>

<template>
  <section
    class="relative h-[760px] overflow-hidden bg-bg"
    aria-roledescription="carousel"
    aria-label="Featured films"
    @mouseenter="paused = true"
    @mouseleave="paused = false"
    @focusin="paused = true"
    @focusout="paused = false"
  >
    <article
      v-for="(movie, i) in movies"
      :key="movie.id"
      class="absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none"
      :class="i === index ? 'opacity-100' : 'pointer-events-none opacity-0'"
      :inert="i !== index"
      :aria-hidden="i !== index"
    >
      <img
        v-if="backdropOf(movie)"
        :src="backdropOf(movie)"
        alt=""
        class="absolute inset-0 size-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-l from-black/[0.08] to-black/80" />

      <div class="absolute inset-x-0 bottom-[179px] px-6 lg:px-[67px]">
        <div class="flex w-[580px] max-w-full flex-col gap-[18px]">
          <Badge v-if="premiereLabel(movie.releaseDate)" variant="red" class="self-start">
            {{ premiereLabel(movie.releaseDate) }}
          </Badge>

          <div class="flex flex-col gap-6">
            <div class="flex flex-col gap-[18px]">
              <h2 class="text-display font-extrabold uppercase leading-[normal]">{{ movie.title }}</h2>

              <div class="flex flex-wrap gap-2">
                <Badge variant="red">{{ movie.ageRating.code }}</Badge>
                <Badge>
                  <Timer class="size-3.5" />
                  {{ movie.runtimeMinutes }} Min
                </Badge>
                <Badge v-for="format in movie.formats" :key="format.id">{{ format.name }}</Badge>
              </div>

              <p v-if="movie.synopsis" class="line-clamp-4 max-w-[560px] text-base leading-[1.3]">
                {{ movie.synopsis }}
              </p>
            </div>

            <div class="flex gap-3">
              <Button :to="{ name: 'movie', params: { movie: movie.slug } }">
                <Ticket class="size-4" />
                Buy tickets
              </Button>
              <Button variant="transparent" :to="{ name: 'sessions' }">All sessions</Button>
            </div>
          </div>
        </div>
      </div>
    </article>

    <div
      v-if="movies.length > 1"
      class="absolute inset-x-0 bottom-[42px] z-10 flex items-center gap-6 px-6 lg:px-[67px]"
    >
      <div class="flex flex-1 items-center gap-2">
        <button
          v-for="(movie, i) in movies"
          :key="movie.id"
          type="button"
          class="group flex-1 py-3"
          :aria-label="`Show ${movie.title}`"
          :aria-current="i === index"
          @click="select(i)"
        >
          <span
            class="block h-[3px] rounded-full transition-colors"
            :class="i === index ? 'bg-accent' : 'bg-white group-hover:bg-white/70'"
          />
        </button>
      </div>

      <div class="flex gap-3">
        <button
          type="button"
          aria-label="Previous film"
          class="grid size-[54px] place-items-center rounded-full bg-bg/20 transition-colors hover:bg-bg/40"
          @click="select(index - 1)"
        >
          <ChevronLeft class="size-8" :stroke-width="1.5" />
        </button>
        <button
          type="button"
          aria-label="Next film"
          class="grid size-[54px] place-items-center rounded-full bg-bg/20 transition-colors hover:bg-bg/40"
          @click="select(index + 1)"
        >
          <ChevronRight class="size-8" :stroke-width="1.5" />
        </button>
      </div>
    </div>
  </section>
</template>