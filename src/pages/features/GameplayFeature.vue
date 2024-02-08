<template>
  <div v-if="assetStore?.imx?.metadata" class="q-pa-md">
    <ChessboardComponent
      @gameStateUpdate="handleGameStateUpdate"
      :playable="true"
      :pgn="assetPGN" />
    <div class="text-center">
      <h5>Name: {{ assetStore.imx.metadata.name }}</h5>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAssetStore } from 'src/stores/asset-store';
import ChessboardComponent from 'src/components/ChessboardComponent.vue';

const token_id = ref(useRoute().params.token_id);
const assetStore = useAssetStore();
const assetPGN = computed(() => assetStore.imx.metadata.pgn);
const router = useRouter();

onMounted(async () => {
  await assetStore.loadMetadata(token_id.value);
});

function handleGameStateUpdate(gameState) {
  const tokenExists = assetStore.getTokenIdByFen(gameState.fen);
  if (tokenExists) router.push(`/${tokenExists}/gameplay`);
}
</script>
