<script setup lang="ts">
import { computed, ref, watch  } from 'vue'
import { Bell, Check } from 'lucide-vue-next'
import { notifyMovie } from '@/api/movies'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'
import type { Movie } from '@/types/api'
import { genreAndRuntime, movieKey, releaseDayLabel } from '@/utils/movie'

const props = defineProps<{ movie: Movie }>()

const status = ref<'idle' | 'loading' | 'done' | 'failed'>(props.movie.isNotified ? 'done' : 'idle')

watch(
  () => props.movie.isNotified,
  (notified) => {
    status.value = notified ? 'done' : 'idle'
  },
)

const label = computed(
  () => ({ idle: 'Notify Me', loading: 'Notify Me', done: 'Reminder set', failed: 'Try again' })[status.value],
)

const image = computed(() => props.movie.backdropUrl ?? props.movie.posterUrl ?? undefined)

async function notify() {
  if (status.value === 'loading' || status.value === 'done') return
  status.value = 'loading'
  try {
    await notifyMovie(movieKey(props.movie))
    status.value = 'done'
  } catch {
    status.value = 'failed'
  }
}
</script>

<template>
  <article
    class="flex h-[160px] w-[470px] shrink-0 items-center gap-[15px] rounded-[20px] bg-surface p-3 shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
  >
    <div class="h-full min-w-0 flex-1 overflow-hidden rounded-[14px] bg-surface-2">
      <img v-if="image" :src="image" alt="" loading="lazy" class="size-full object-cover" />
    </div>

    <div class="flex h-[132px] max-w-[260px] shrink-0 flex-col justify-between pr-[60px]">
      <div class="flex flex-col gap-[7px]">
        <p class="text-xs font-semibold uppercase leading-[normal] text-accent">
          In cinemas {{ releaseDayLabel(movie.releaseDate) }}
        </p>
        <div class="flex flex-col gap-[7px]">
          <h3 class="truncate text-lg font-semibold leading-[normal]">{{ movie.title }}</h3>
          <p class="text-sm leading-[1.3] text-muted">{{ genreAndRuntime(movie) }}</p>
        </div>
        <Badge variant="red" compact class="self-start">{{ movie.ageRating.code }}</Badge>
      </div>

      <Button
        variant="outline"
        class="self-start"
        :class="status === 'done' && 'bg-tint-white'"
        :loading="status === 'loading'"
        @click="notify"
      >
        <Check v-if="status === 'done'" class="size-4" />
        <Bell v-else class="size-4" />
        {{ label }}
      </Button>
    </div>
  </article>
</template>