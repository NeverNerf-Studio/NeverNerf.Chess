<template>
  <div id="image">
    <ChessboardComponent
      :playable="false"
      :fen="fen"
      :pgn="pgn"
      :rarity="rarity" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import ChessboardComponent from 'src/components/ChessboardComponent.vue';

const fen = computed(() => useRoute().query.fen);
const pgn = computed(() => useRoute().query.pgn);
const rarity = computed(() => useRoute().query.rarity);
</script>
