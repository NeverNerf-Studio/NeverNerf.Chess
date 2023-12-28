<template>
  <div v-if="!asset.loading" class="q-pa-md">
    <q-img
      :src="asset.imx.metadata.animation_url"
      class="rounded-borders q-mx-auto row justify-between"
      style="max-height: 50vh; max-width: 50vh"
    />

    <div class="q-my-md text-center">
      <div class="text-h5 q-my-md">{{ asset.imx.metadata.name }}</div>
      <div class="text-subtitle2 q-my-md">{{ asset.imx.metadata.tagline }}</div>

      <q-list>
        <q-item
          v-for="(value, key) in filteredMetadata"
          :key="key"
          class="row justify-between"
        >
          <q-item-section>{{ key }}:</q-item-section>
          <q-item-section>{{ value }}</q-item-section>
        </q-item>
      </q-list>
    </div>

    <q-expansion-item icon="data_object" label="All Metadata" dense>
      <div v-for="(value, key) in asset.imx" :key="key">
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
                  dense
                />
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
                dense
              />
            </q-item-section>
          </q-item>
        </div>
      </div>
    </q-expansion-item>
  </div>
  <div v-else class="text-h6 text-center q-my-md">Loading...</div>
</template>

<script setup>
import { computed } from 'vue';
import { useAssetStore } from 'src/stores/asset-store';
const asset = computed(() => useAssetStore());

const filteredMetadata = computed(() => {
  const keysToInclude = [
    'class',
    'series',
    'element',
    'faction',
    'rarityStr',
    'specialEditionStr',
  ];
  const metadata = asset.value.imx.metadata;
  return keysToInclude.reduce((filtered, key) => {
    if (metadata[key] !== undefined) {
      filtered[key] = metadata[key];
    }
    return filtered;
  }, {});
});

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
