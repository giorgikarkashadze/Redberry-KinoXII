<script setup lang="ts"></script>

<template>
  <div class="flex flex-col items-start gap-4 p-8">
    <Button>Buy tickets</Button>
    <Button variant="light">Log in</Button>
    <Button variant="secondary">All sessions</Button>
    <Button loading>Saving</Button>
    <Button disabled>Disabled</Button>
    <Skeleton class="h-6 w-40" />
  </div>
</template>
