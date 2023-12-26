<template>
  <div class="column content-center" v-if="asset.imx">
    <q-img
      :src="asset.imx.metadata.image_url"
      style="
        max-width: 500px;
        max-height: 50vh;
        min-height: 50vh;
        width: 100%;
        height: 100%;
      "
    >
      <div class="absolute-top text-center q-gutter-y-sm">
        <span class="text-h5">
          {{ asset.imx.metadata.name }}: {{ asset.imx.metadata.tagline }}
        </span>
      </div>
    </q-img>
    <div>
      <span>Class: {{ asset.imx.metadata.class }}</span>
      <span>Series: {{ asset.imx.metadata.series }}</span>
      <span>Element: {{ asset.imx.metadata.element }}</span>
      <span>Faction: {{ asset.imx.metadata.faction }}</span>
      <span>Rarity: {{ asset.imx.metadata.rarityStr }}</span>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { watch, onMounted } from 'vue';
import { useMetadataStore } from 'src/stores/asset-store.ts';

const route = useRoute();
const token_id = route.params.token_id;

const asset = useMetadataStore();
// Load metadata when component is mounted or token_id changes
onMounted(() => asset.loadMetadata(token_id));
watch(
  () => token_id,
  () => asset.loadMetadata(token_id)
);
</script>
