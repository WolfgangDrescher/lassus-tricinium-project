<template>
  <div class="layout">
    <div class="navigation">
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
    </div>
    <div class="content"><slot /></div>
  </div>
</template>

<script setup>
import Link from './Link.vue'
</script>
