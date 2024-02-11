<template>
  <div v-if="assetStore?.imx?.metadata" class="q-pa-md">
    <ChessboardComponent
      @gameStateUpdate="handleGameStateUpdate"
      :playable="true"
      :pgn="assetPGN" />
    <div class="text-center">
      <h5>Name: {{ assetStore.imx.metadata.name }}</h5>
    </div>
    <div>
      <q-item class="q-py-xs">
        <q-item-section> <b>Turn: </b> {{ gameState.turn }}</q-item-section>
        <q-item-section side>
          <q-btn
            icon="content_copy"
            @click="copyToClipboard(gameState.turn)"
            flat
            dense></q-btn> </q-item-section
      ></q-item>
      <q-item class="q-py-xs">
        <q-item-section>
          <b>fen: </b> {{ gameState.fen?.substr(0, 32) }}...</q-item-section
        >
        <q-item-section side>
          <q-btn
            icon="content_copy"
            @click="copyToClipboard(gameState.fen)"
            flat
            dense></q-btn> </q-item-section
      ></q-item>
      <q-item class="q-py-xs">
        <q-item-section> <b>pgn: </b> {{ gameState.pgn }}</q-item-section>
        <q-item-section side>
          <q-btn
            icon="content_copy"
            @click="copyToClipboard(gameState.pgn)"
            flat
            dense></q-btn> </q-item-section
      ></q-item>
      <q-item class="q-py-xs">
        <q-item-section> <b>Check: </b> {{ gameState.check }}</q-item-section>
        <q-item-section side>
          <q-btn
            icon="content_copy"
            @click="copyToClipboard(gameState.check)"
            flat
            dense></q-btn> </q-item-section
      ></q-item>
      <q-item class="q-py-xs">
        <q-item-section>
          <b>Checkmate: </b> {{ gameState.checkMate }}</q-item-section
        >
        <q-item-section side>
          <q-btn
            icon="content_copy"
            @click="copyToClipboard(gameState.checkMate)"
            flat
            dense></q-btn> </q-item-section
      ></q-item>
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
const gameState = ref({});

onMounted(async () => {
  await assetStore.loadMetadata(token_id.value);
});

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
};

function handleGameStateUpdate(newGameState) {
  gameState.value = newGameState;
  const tokenExists = assetStore.getTokenIdByFen(newGameState.fen);
  if (tokenExists) router.push(`/${tokenExists}/gameplay`);
}
</script>
