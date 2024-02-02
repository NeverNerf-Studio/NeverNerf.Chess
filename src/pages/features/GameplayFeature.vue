<template>
  <div v-if="assetStore?.imx?.metadata" class="q-pa-md">
    <ChessboardComponent :playable="true" :fen="assetFEN" />
    <div class="text-center" style="max-width: 100%">
      <div class="text-h4 q-my-md">{{ assetStore.imx.metadata.name }}</div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAssetStore } from 'src/stores/asset-store';
import ChessboardComponent from 'src/components/ChessboardComponent.vue';

const token_id = ref(useRoute().params.token_id);
const assetStore = useAssetStore();
const assetFEN = computed(() => assetStore.imx.metadata.FEN);

onMounted(async () => {
  await assetStore.loadMetadata(token_id.value);
});
</script>
