<template>
  <q-layout view="hHh lpR fFf">
    <div v-if="!token_id">
      <div class="absolute-center text-center">
        <passport-login-component />
      </div>
    </div>
    <div v-else-if="asset.loading">Loading...</div>
    <div v-else>
      <q-header elevated justify-between>
        <q-toolbar v-if="asset.imx">
          <q-avatar>
            <img :src="asset.imx.collection.icon_url" />
          </q-avatar>
          <q-toolbar-title>
            <span>Login</span>
          </q-toolbar-title>
        </q-toolbar>
      </q-header>
      <q-page-container>
        <div v-if="asset.imx">
          <!-- Asset hero image -->
          <div class="fixed-full">
            <ChessboardComponent
              :playable="false"
              :fen="asset.imx.metadata.FEN" />
            <div class="absolute-bottom text-center">
              <span class="text-h5">
                {{ asset.imx.metadata.name }}: {{ asset.imx.metadata.tagline }}
              </span>
              <passport-login-component />
              <!-- Guest Access -->
              <div style="padding-bottom: 20px">
                <q-btn flat no-caps :to="`/${token_id}/asset`">
                  <div class="text-center"><u>View as Guest</u></div>
                </q-btn>
              </div>
            </div>
          </div>
        </div>
      </q-page-container>
    </div>
    <q-footer right>
      <q-btn flat href="https://nevernerf.com" push no-caps>
        <div class="row items-center no-wrap">
          <q-icon left name="img:/NeverNerfLogo.svg" />
          <div class="text-center">NeverNerf.com</div>
        </div>
      </q-btn>
    </q-footer>
  </q-layout>
</template>

<script>
import { usePassportStore } from '/src/stores/passport-store';
import { onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAssetStore } from 'src/stores/asset-store';
import PassportLoginComponent from 'src/components/PassportLoginComponent.vue';
import ChessboardComponent from 'src/components/ChessboardComponent.vue';

export default {
  components: {
    PassportLoginComponent,
    ChessboardComponent,
  },
  setup() {
    const passport = usePassportStore();
    const token_id = computed(() => useRoute().params.token_id);
    const assetStore = useAssetStore();
    const router = useRouter();

    onMounted(() => {
      checkAuthentication();
      if (token_id.value) assetStore.loadMetadata(token_id.value);
    });

    async function checkAuthentication() {
      try {
        const userInfo = await passport.getUserInfo();
        if (userInfo) {
          router.push(`/${token_id.value}/asset`);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    }

    return {
      token_id,
      asset: computed(() => assetStore),
    };
  },
};
</script>
