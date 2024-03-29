<template>
  <div id="metadata">{{ metadataOutput }}</div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Chess } from 'chess.js';

const pgn = computed(() => useRoute().query.pgn);
const fen = computed(() => useRoute().query.fen);
const openingName = computed(() => useRoute().query.openingName);
const creativeName = computed(() => useRoute().query.creativeName);
const description = computed(() => useRoute().query.description);
const baseUrl = computed(() => new URL(useRoute().query.baseUrl as string));
const assetUrl = computed(() => new URL(useRoute().query.assetUrl as string));
const rarity = computed(() => useRoute().query.rarity);

const token_id = computed(() => useRoute().params.token_id);
const metadataOutput = ref('');

function formatPGN(pgn: string): string {
  return pgn
    .split('. ')
    .reduce((acc, moves, index) => {
      const moveNumber = index + 1;
      const formattedMoves = moves.replace('.', '').trim(); // Remove any trailing periods and trim spaces
      return `${acc} ${moveNumber}. ${formattedMoves}`;
    }, '')
    .trim();
}

onMounted(() => {
  if (!description.value) return;

  const pgnBoard = new Chess();
  let pgnValue = pgn.value as string;
  try {
    pgnBoard.loadPgn(pgnValue);
  } catch (error) {
    try {
      const formattedPGN = formatPGN(pgnValue);
      pgnBoard.loadPgn(formattedPGN);
    } catch (error) {
      console.log(`Error loading formattedPGN: ${token_id.value}`);
    }

    pgnValue = pgnBoard.pgn();
  }

  let fenValue = fen.value;
  if (!fenValue) {
    fenValue = pgnBoard.fen();
  }

  // Construct JSON data
  const moveNumber = pgnBoard.history().length;
  const name = openingName.value || creativeName.value;
  const jsonData = {
    token_id: token_id.value,
    name,
    description: description.value,
    image: new URL(`${token_id.value}.png`, assetUrl.value).toString(),
    external_url: new URL(`#/${token_id.value}`, baseUrl.value).toString(),
    animation_url: new URL(`${token_id.value}.mp4`, assetUrl.value).toString(),
    opening: openingName.value,
    creativeName: creativeName.value,
    rarity: rarity.value,
    moves: moveNumber,
    fen: fenValue,
    pgn: pgnValue,
    attributes: [
      {
        type: 'rarity',
        value: rarity.value,
      },
      {
        type: 'moves',
        value: moveNumber,
      },
    ],
  };

  metadataOutput.value = JSON.stringify(jsonData, null, 2);
});
</script>
