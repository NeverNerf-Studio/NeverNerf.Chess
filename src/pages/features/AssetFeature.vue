<template>
  <div v-if="asset.loading">Loading...</div>
  <div v-else class="q-pa-md">
    <video class="video" muted autoplay loop style="height: 80%; width: 100%">
      <source :src="asset.metadata.animation_url" type="video/mp4" />
    </video>
    <div class="q-my-md text-center">
      <div class="text-h4 q-my-md">{{ asset.metadata.name }}</div>
      <div class="text-subtitle2 q-my-md">{{ asset.metadata.description }}</div>

      <q-item class="q-py-xs">
        <q-item-section>
          Rarity:
          <RaritySVGbox :rarity="asset.metadata.rarity"
        /></q-item-section>
        <q-item-section>
          Moves:
          <div class="text-h4">{{ asset.metadata.moves }}</div>
        </q-item-section>
        <q-item-section side>
          <q-btn
            icon="content_copy"
            label="PGN"
            @click="copyToClipboard(asset.metadata.pgn)"
            flat />
          <q-btn
            icon="content_copy"
            label="FEN"
            @click="copyToClipboard(asset.metadata.fen)"
            flat />
        </q-item-section>
      </q-item>
    </div>

    <q-expansion-item icon="data_object" label="All Metadata" dense>
      <div v-for="(value, key) in asset.metadata" :key="key">
        <div v-if="isObjectType(value)">
          <div class="text-subtitle1 q-my-md">{{ key }}</div>
          <q-separator />
          <div v-for="(nestedValue, nestedKey) in value" :key="nestedKey">
            <q-item class="q-py-xs">
              <q-item-section>{{ nestedKey }}:</q-item-section>
              <q-item-section>{{ formatValue(nestedValue) }}</q-item-section>
              <q-item-section side>
                <q-btn
                  icon="content_copy"
                  @click="copyToClipboard(nestedValue)"
                  flat
                  dense />
              </q-item-section>
            </q-item>
          </div>
        </div>
        <div v-else>
          <q-item class="q-py-xs">
            <q-item-section>{{ key }}:</q-item-section>
            <q-item-section>{{ formatValue(value) }}</q-item-section>
            <q-item-section side>
              <q-btn
                icon="content_copy"
                @click="copyToClipboard(value)"
                flat
                dense />
            </q-item-section>
          </q-item>
        </div>
      </div>
    </q-expansion-item>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAssetStore } from 'src/stores/asset-store';
import RaritySVGbox from 'src/components/RaritySVGbox.vue';

const asset = computed(() => assetStore);
const assetStore = useAssetStore();

const truncateText = (text) => {
  if (typeof text === 'string' && text.length > 20) {
    return text.substr(0, 5) + '...' + text.substr(-5);
  }
  return text;
};

const formatValue = (value) => {
  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2);
  }
  return truncateText(value);
};

const isObjectType = (value) => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
};

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
};
</script>

<style scoped>
.rounded-borders {
  border-radius: 4px;
}
</style>
