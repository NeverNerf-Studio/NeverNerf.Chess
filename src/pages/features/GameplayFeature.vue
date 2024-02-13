<template>
  <div v-if="assetPGN" class="q-pa-md">
    <ChessboardComponent
      @gameStateUpdate="handleGameStateUpdate"
      :playable="true"
      :rarity="assetRarity"
      :pgn="assetPGN" />
    <div class="text-center">
      <h5>{{ assetName }}</h5>
    </div>
    <div style="padding-bottom: 20px">
      <q-btn flat no-caps :to="`/1/gameplay`">
        <div class="text-center">New Game</div>
      </q-btn>
      <q-btn flat no-caps disable="true">
        <div class="text-center">Invite</div>
      </q-btn>
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
        <q-item-section> <b>Rarity: </b> {{ assetRarity }}</q-item-section>
        <q-item-section side>
          <q-btn
            icon="content_copy"
            @click="copyToClipboard(assetRarity)"
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
import { watch, ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAssetStore } from 'src/stores/asset-store';
import ChessboardComponent from 'src/components/ChessboardComponent.vue';

const assetStore = useAssetStore();
const router = useRouter();
const gameState = ref({});

const token_id = computed(() => useRoute().params.token_id);
const queryStringPgn = computed(() => useRoute().query.pgn);

const previousAssetName = ref('New Game');
watch(
  () => useAssetStore().imx?.metadata.name,
  (newName) => {
    //Persist past assetName
    if (previousAssetName.value != newName) {
      previousAssetName.value = newName;
    }
  }
);

const assetName = computed(() => {
  if (token_id.value == '0') {
    return `Child of ${previousAssetName.value}`;
  } else {
    return useAssetStore().imx.metadata.name;
  }
});

const assetPGN = computed(() => {
  if (token_id.value == 0) {
    return queryStringPgn.value || 'newgame';
  } else {
    return assetStore.imx.metadata.pgn;
  }
});

const assetRarity = computed(() => {
  if (token_id.value == 0) {
    return 'Common';
  } else {
    return assetStore.imx.metadata.rarity;
  }
});

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
};

function handleGameStateUpdate(newGameState) {
  gameState.value = newGameState;
  const tokenExists = assetStore.getTokenIdByFen(newGameState.fen);
  if (tokenExists) {
    router.push(`/${tokenExists}/gameplay?pgn=${newGameState.pgn}`);
  } else {
    router.push(`/0/gameplay?pgn=${newGameState.pgn}`);
  }
}
</script>
