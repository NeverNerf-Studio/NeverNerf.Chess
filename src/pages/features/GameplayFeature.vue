<template>
  <div v-if="!assetStore.loading" class="q-pa-md">
    <ChessboardComponent
      @gameStateUpdate="handleGameStateUpdate"
      :playable="true"
      :rarity="assetRarity"
      :pgn="assetPGN" />
    <div class="game-state-container" :class="backgroundClass">
      <img
        v-if="gameState.check || gameState.checkMate"
        :src="iconSrc"
        class="state-icon" />
      <h5 class="asset-name">{{ assetName }}</h5>
      <img
        v-if="gameState.check || gameState.checkMate"
        :src="iconSrc"
        class="state-icon" />
      <div class="text-subtitle">
        {{ assetDescription }}
      </div>
    </div>
    <div style="padding-bottom: 20px">
      <q-btn flat no-caps color="blue" :to="`/1/gameplay?pgn=newgame`">
        <div class="text-center">New Game</div>
        <q-tooltip class="primary">Start new game</q-tooltip>
      </q-btn>
      <q-btn flat no-caps disable>
        <div class="text-center">Invite</div>
        <q-tooltip class="bg-negative">Coming Soon!</q-tooltip>
      </q-btn>
      <q-btn flat no-caps disable>
        <div class="text-center">Mint</div>
        <q-tooltip class="bg-negative">Coming Soon!</q-tooltip>
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

<style>
.game-state-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  margin-top: 5px;
  border-radius: 10px; /* Rounded corners */
  transition: all 0.3s ease; /* Smooth transition for background color */
}

.check-bg {
  background-color: #ff8c00;
  animation: pulseAnimation 1.5s infinite;
}

.checkmate-bg {
  background-color: #fa0101;
  animation: pulseAnimation 1.5s infinite;
}

@keyframes pulseAnimation {
  0% {
    box-shadow: 0 0 0 0px rgba(255, 255, 255, 0.2);
  }
  100% {
    box-shadow: 0 0 0 15px rgba(255, 255, 255, 0);
  }
}

.asset-name {
  font-weight: bold;
  margin: 0 10px;
  font-size: 1.5em; /* Larger text */
}

.state-icon {
  width: 24px; /* Adjust based on your icon size */
  height: 24px; /* Adjust based on your icon size */
  margin: 0 10px;
}
</style>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAssetStore } from 'src/stores/asset-store';
import ChessboardComponent from 'src/components/ChessboardComponent.vue';

const assetStore = useAssetStore();
const router = useRouter();
const gameState = ref({});

const token_id = computed(() => useRoute().params.token_id);
const queryStringPgn = computed(() => useRoute().query.pgn);

const previousAssetName = ref('New Game');
const assetName = computed(() => {
  if (token_id.value == '0') {
    return `Child of ${previousAssetName.value}`;
  } else {
    return useAssetStore().imx.name;
  }
});

const backgroundClass = computed(() => {
  if (gameState.value) {
    return gameState.value.checkMate
      ? 'checkmate-bg'
      : gameState.value.check
      ? 'check-bg'
      : '';
  }
  return '';
});

const iconSrc = computed(() => {
  if (gameState.value) {
    const pieceColor = gameState.value.turn.substr(0, 1).toLowerCase();
    const kingPiece = `/chesspieces/wikipedia/${pieceColor}K.png`;
    return kingPiece;
  }
  return '';
});

const assetDescription = computed(() => {
  if (gameState.value.checkMate) return 'Checkmate';
  if (gameState.value.check) return 'Check';
  if (token_id.value == '0') {
    return 'Striking off in unexplored territory';
  } else {
    return useAssetStore().imx.description;
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
  if (token_id.value != '0') previousAssetName.value = useAssetStore().imx.name;
  gameState.value = newGameState;
  const tokenExists = assetStore.getTokenIdByFen(newGameState.fen);
  if (tokenExists) {
    router.push(`/${tokenExists}/gameplay?pgn=${newGameState.pgn}`);
  } else {
    router.push(`/0/gameplay?pgn=${newGameState.pgn}`);
  }
}
</script>
