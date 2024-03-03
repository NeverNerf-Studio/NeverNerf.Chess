<template>
  <div v-if="asset.loading">Loading...</div>
  <div v-else>
    <div class="col-auto self-stretch">
      <q-card flat>
        <q-card-section class="text-center q-pa-none">
          <div class="text-h6">{{ asset.metadata.name }}</div>
          <div class="text-subtitle2">{{ asset.metadata.description }}</div>
        </q-card-section>
      </q-card>
    </div>
    <div class="row flex-center self-stretch">
      <q-card
        flat
        class="row"
        :style="$q.screen.lt.sm ? 'max-width: 450px;' : 'max-width: 500px;'">
        <q-card-section class="col-12 col-sm-10">
          <video
            class="video"
            style="width: 100%"
            muted
            autoplay
            loop
            webkit-playsinline
            playsinline>
            <source :src="asset.metadata.animation_url" type="video/mp4" />
          </video>
        </q-card-section>
        <q-card-section
          class="col-12 col-sm-2 justify-around"
          :class="$q.screen.lt.sm ? 'row' : 'col'">
          <div>
            <div class="text-h6">Rarity</div>
            <RaritySVGbox :rarity="asset.metadata.rarity" />
          </div>
          <div>
            <div class="text-h6">Move</div>
            <div class="text-h5">#{{ asset.metadata.moves }}</div>
          </div>
          <div class="align-bottom">
            <q-btn
              icon="content_copy"
              label="PGN"
              @click="copyToClipboard(asset.metadata.pgn)"
              flat
              dense />
            <q-btn
              icon="content_copy"
              label="FEN"
              @click="copyToClipboard(asset.metadata.fen)"
              flat
              dense />
          </div>
        </q-card-section>
        <q-card-section class="col-12 q-px-none flex-center">
          <q-expansion-item
            expand-separator
            class="col-12 q-px-none flex-center"
            icon="data_object"
            label="All Metadata"
            dense>
            <div
              class="col-12 q-px-none"
              v-for="(value, key) in asset.metadata"
              :key="key">
              <q-item
                class="q-px-none row justify-between"
                :style="$q.screen.lt.sm ? 'max-width: 310px;' : ''">
                <q-item-section class="col-2 text-weight-bold ellipsis"
                  >{{ key }}:</q-item-section
                >
                <q-item-section class="col-9 ellipsis">{{
                  value
                }}</q-item-section>
                <q-item-section class="col-1" side>
                  <q-btn
                    icon="content_copy"
                    @click="copyToClipboard(value)"
                    flat
                    dense />
                </q-item-section>
              </q-item>
            </div>
          </q-expansion-item>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAssetStore } from 'src/stores/asset-store';
import RaritySVGbox from 'src/components/RaritySVGbox.vue';

const asset = computed(() => assetStore);
const assetStore = useAssetStore();

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
};
</script>

<style scoped>
.rounded-borders {
  border-radius: 4px;
}
</style>
