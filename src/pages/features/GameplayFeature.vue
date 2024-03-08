<template>
  <div v-if="token_id != '0' && !asset.metadata">Loading...</div>
  <div v-else>
    <div class="row flex-center">
      <q-card flat class="row flex-center" style="width: 100%">
        <q-card-section
          class="col-12 col-sm-10"
          :style="
            $q.screen.lt.sm
              ? 'max-width: 450px; width:100%;'
              : 'max-width: 500px; width:100%;'
          ">
          <ChessboardComponent :playable="true" :rarity="assetRarity" />
        </q-card-section>
        <q-card-section
          class="col-12 col-sm-2 justify-around"
          :class="$q.screen.lt.sm ? 'row' : 'col'">
          <div class="justify-left">
            <q-btn
              flat
              no-caps
              icon="refresh"
              color="blue"
              dense
              @click="handleNewGame">
              <div class="text-center">New Game</div>
              <q-tooltip class="primary">Start new game</q-tooltip>
            </q-btn>
            <q-btn flat no-caps icon="videogame_asset" disable>
              <div class="text-center">Invite</div>
              <q-tooltip class="bg-negative">Coming Soon!</q-tooltip>
            </q-btn>
            <q-btn flat no-caps icon="shopping_cart" disable>
              <div class="text-center">Mint</div>
              <q-tooltip class="bg-negative">Coming Soon!</q-tooltip>
            </q-btn>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-auto self-stretch">
      <q-card flat>
        <q-card-section
          class="text-center q-pa-none game-state-container"
          :class="backgroundClass">
          <div class="text-h6">
            <img
              v-if="chessboardStore.check || chessboardStore.checkMate"
              :src="kingPieceIconSrc"
              class="state-icon" />
            {{ assetName }}
            <img
              v-if="chessboardStore.check || chessboardStore.checkMate"
              :src="kingPieceIconSrc"
              class="state-icon" />
          </div>

          <div class="text-subtitle2">
            {{ assetDescription }}
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<style>
/* .game-state-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  margin-top: 5px;
  border-radius: 10px;
  transition: all 0.3s ease;
} */

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

const asset = computed(() => useAssetStore());
const chessboardStore = useChessboardStore();
const router = useRouter();

const token_id = computed(() => useRoute().params.token_id);

const previousAssetName = ref('New Game');
const assetName = computed(() => {
  if (token_id.value == '0') {
    return `Child of ${previousAssetName.value}`;
  } else {
    return useAssetStore().metadata.name;
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
  const kingPiece = `chess/chesspieces/wikipedia/${pieceColor}k.png`;
  return kingPiece;
});

const assetDescription = computed(() => {
  if (chessboardStore.checkMate) return 'Checkmate';
  if (chessboardStore.check) return 'Check';
  if (token_id.value == '0') {
    return 'Striking off in unexplored territory';
  } else {
    return useAssetStore().metadata.description;
  }
});

const assetRarity = computed(() => {
  if (token_id.value === '0') {
    return 'Common';
  } else {
    return useAssetStore().metadata.rarity;
  }
});

const handleNewGame = () => {
  chessboardStore.updateGameFromPGN('newgame');
};

const queryStringPgn = computed(() => useRoute().query.pgn);

onMounted(() => {
  // If we're on a token then load that as PGN
  if (token_id.value !== '0' && chessboardStore.pgn === '') {
    chessboardStore.updateGameFromPGN(useAssetStore().metadata.pgn);
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
    if (token_id.value != '0')
      previousAssetName.value = useAssetStore().metadata.name;
    const tokenExists = useAssetStore().getTokenIdByFen(chessboardStore.fen);
    if (tokenExists) {
      router.push(`/${tokenExists}/gameplay?pgn=${chessboardStore.pgn}`);
    } else {
      router.push(`/0/gameplay?pgn=${chessboardStore.pgn}`);
    }
  }
);
</script>
