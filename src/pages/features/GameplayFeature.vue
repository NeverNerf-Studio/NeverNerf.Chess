<template>
  <div v-if="!assetStore.loading" class="q-pa-md">
    <ChessboardComponent :playable="true" :rarity="assetRarity" />
    <div class="game-state-container" :class="backgroundClass">
      <img
        v-if="chessboardStore.check || chessboardStore.checkMate"
        :src="kingPieceIconSrc"
        class="state-icon" />
      <h5 class="asset-name">{{ assetName }}</h5>
      <img
        v-if="chessboardStore.check || chessboardStore.checkMate"
        :src="kingPieceIconSrc"
        class="state-icon" />
      <div class="text-subtitle">
        {{ assetDescription }}
      </div>
    </div>
    <div style="padding-bottom: 20px">
      <q-btn flat no-caps color="blue" @click="handleNewGame">
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
      <!-- <q-item class="q-py-xs">
        <q-item-section>
          <b>Turn: </b> {{ chessboardStore.turn }}</q-item-section
        >
        <q-item-section side>
          <q-btn
            icon="content_copy"
            @click="copyToClipboard(chessboardStore.turn)"
            flat
            dense></q-btn> </q-item-section
      ></q-item>
      <q-item class="q-py-xs">
        <q-item-section>
          <b>fen: </b>
          {{ chessboardStore.fen?.substr(0, 32) }}...</q-item-section
        >
        <q-item-section side>
          <q-btn
            icon="content_copy"
            @click="copyToClipboard(chessboardStore.fen)"
            flat
            dense></q-btn> </q-item-section
      ></q-item>
      <q-item class="q-py-xs">
        <q-item-section> <b>pgn: </b> {{ chessboardStore.pgn }}</q-item-section>
        <q-item-section side>
          <q-btn
            icon="content_copy"
            @click="copyToClipboard(chessboardStore.pgn)"
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
        <q-item-section>
          <b>Check: </b> {{ chessboardStore.check }}</q-item-section
        >
        <q-item-section side>
          <q-btn
            icon="content_copy"
            @click="copyToClipboard(chessboardStore.check)"
            flat
            dense></q-btn> </q-item-section
      ></q-item>
      <q-item class="q-py-xs">
        <q-item-section>
          <b>Checkmate: </b> {{ chessboardStore.checkMate }}</q-item-section
        >
        <q-item-section side>
          <q-btn
            icon="content_copy"
            @click="copyToClipboard(chessboardStore.checkMate)"
            flat
            dense></q-btn> </q-item-section
      ></q-item> -->
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
import { onMounted, watch, ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAssetStore } from 'src/stores/asset-store';
import ChessboardComponent from 'src/components/ChessboardComponent.vue';
import { useChessboardStore } from 'src/stores/chessboard-store';

const assetStore = useAssetStore();
const chessboardStore = useChessboardStore();
const router = useRouter();

const token_id = computed(() => useRoute().params.token_id);

const previousAssetName = ref('New Game');
const assetName = computed(() => {
  if (token_id.value == '0') {
    return `Child of ${previousAssetName.value}`;
  } else {
    return useAssetStore().imx.name;
  }
});

const backgroundClass = computed(() => {
  return chessboardStore.checkMate
    ? 'checkmate-bg'
    : chessboardStore.check
    ? 'check-bg'
    : '';
});

const kingPieceIconSrc = computed(() => {
  const pieceColor = chessboardStore.turn;
  const kingPiece = `/chesspieces/wikipedia/${pieceColor}K.png`;
  return kingPiece;
});

const assetDescription = computed(() => {
  if (chessboardStore.checkMate) return 'Checkmate';
  if (chessboardStore.check) return 'Check';
  if (token_id.value == '0') {
    return 'Striking off in unexplored territory';
  } else {
    return useAssetStore().imx.description;
  }
});

const assetRarity = computed(() => {
  if (token_id.value === '0') {
    return 'Common';
  } else {
    return assetStore.imx.metadata.rarity;
  }
});

// const copyToClipboard = (text) => {
//   navigator.clipboard.writeText(text);
// };

const handleNewGame = () => {
  chessboardStore.updateGameFromPGN('newgame');
};

const queryStringPgn = computed(() => useRoute().query.pgn);
onMounted(() => {
  // If we're on a token then load that as PGN
  if (token_id.value !== '0' && chessboardStore.pgn === '') {
    chessboardStore.updateGameFromPGN(assetStore.imx?.metadata.pgn);
  }
  //Otherwise load from the query string pgn
  else if (!chessboardStore.pgn && queryStringPgn.value) {
    chessboardStore.updateGameFromPGN(queryStringPgn.value);
  }
});

// Reactive watch on the chessboard store's state
watch(
  () => chessboardStore.fen,
  () => {
    if (token_id.value != '0') previousAssetName.value = assetStore.imx.name;
    const tokenExists = assetStore.getTokenIdByFen(chessboardStore.fen);
    if (tokenExists) {
      router.push(`/${tokenExists}/gameplay?pgn=${chessboardStore.pgn}`);
    } else {
      router.push(`/0/gameplay?pgn=${chessboardStore.pgn}`);
    }
  }
);
</script>
