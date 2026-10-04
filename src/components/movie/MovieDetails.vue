<script setup lang="ts">
import { computed } from 'vue'
import type { MovieDetail } from '@/types/api'
import { formatLongDate } from '@/utils/dates'
import { formatPrice } from '@/utils/movie'

const props = defineProps<{ movie: MovieDetail }>()

const rows = computed(() =>
  [
    { label: 'Director', value: props.movie.director },
    { label: 'Main cast', value: props.movie.cast },
    { label: 'Duration', value: `${props.movie.runtimeMinutes} minutes` },
    { label: 'Release date', value: formatLongDate(props.movie.releaseDate) },
    { label: 'Formats', value: props.movie.formats.map((format) => format.name).join(', ') },
    { label: 'From', value: formatPrice(props.movie.fromPrice).replace('₾ ', '₾') },
  ].filter((row) => row.value),
)
</script>

<template>
  <aside class="flex flex-col gap-[17px] lg:pl-[26px]" aria-label="Details">
    <h2 class="text-xl font-extrabold leading-[normal]">Details</h2>

    <div v-for="row in rows" :key="row.label" class="flex flex-col gap-[7px]">
      <p class="text-xs font-semibold uppercase leading-[normal] tracking-[0.06em] text-muted">
        {{ row.label }}
      </p>
      <p class="text-sm font-semibold leading-[normal]">{{ row.value }}</p>
    </div>

    <div class="flex flex-col gap-[7px] rounded-xl bg-tint-warning px-[13px] pb-[11px] pt-[9px]">
      <p class="text-xs font-semibold uppercase leading-[normal] tracking-[0.06em] text-warning">
        Rating note
      </p>
      <p class="flex gap-[7px] text-xs leading-[1.3] text-warning">
        <span class="font-semibold">{{ movie.ageRating.code }}</span>
        <span>{{ movie.ageRating.description }}</span>
      </p>
    </div>
  </aside>
</template>