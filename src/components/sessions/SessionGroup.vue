<script setup lang="ts">
import { ref } from 'vue'
import SessionCard from '@/components/sessions/SessionCard.vue'
import Badge from '@/components/ui/Badge.vue'
import { useDragScroll } from '@/composables/useDragScroll'
import type { Session, SessionGroup } from '@/types/api'
import { movieKey } from '@/utils/movie'

defineProps<{ group: SessionGroup }>()
const emit = defineEmits<{ select: [session: Session] }>()

const row = ref<HTMLElement | null>(null)
const { dragging } = useDragScroll(row)
</script>

<template>
  <article class="flex flex-col gap-3.5">
    <RouterLink
      :to="{ name: 'movie', params: { movie: movieKey(group.movie) } }"
      class="flex w-fit items-center gap-4"
    >
      <img
        v-if="group.movie.posterUrl"
        :src="group.movie.posterUrl"
        alt=""
        loading="lazy"
        class="h-20 w-14 shrink-0 rounded-lg object-cover"
      />
      <div v-else class="h-20 w-14 shrink-0 rounded-lg bg-surface-2" />
      <div class="flex flex-col gap-3">
        <div class="flex items-center gap-3">
          <h2 class="text-lg font-extrabold leading-[normal]">{{ group.movie.title }}</h2>
          <Badge variant="red" compact>{{ group.movie.ageRating.code }}</Badge>
        </div>
        <p class="text-sm leading-[1.3] text-muted">{{ group.movie.runtimeMinutes }} min</p>
      </div>
    </RouterLink>

    <div
      ref="row"
      class="no-scrollbar flex gap-3 overflow-x-auto"
      :class="dragging ? 'cursor-grabbing select-none' : 'cursor-grab'"
    >
      <SessionCard
        v-for="session in group.sessions"
        :key="session.id"
        :session="session"
        @select="emit('select', $event)"
      />
    </div>
  </article>
</template>