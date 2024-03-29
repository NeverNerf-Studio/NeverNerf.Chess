<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated justify-between>
      <q-toolbar v-if="asset.imx">
        <q-avatar>
          <img :src="asset.collection_icon_url" />
        </q-avatar>
        <q-toolbar-title>
          <span>{{ routeName }}</span>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- Page Container -->
    <q-page-container
      ><q-page class="q-pa-md"><router-view></router-view></q-page>
    </q-page-container>

    <!-- Bottom Tabs Navigation for Mobile -->
    <q-footer class="bg-primary fixed-bottom">
      <q-tabs class="text-white">
        <!-- Navigation tabs -->
        <q-route-tab
          v-for="route in accessibleRoutes"
          :key="route.name"
          :name="route.name"
          :icon="route.icon"
          :to="`/${token_id}/${route.path}`" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
import { usePassportStore } from '/src/stores/passport-store';
import { useAssetStore } from '/src/stores/asset-store';
import { onMounted, computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import routes from '/src/router/routes';

export default {
  setup() {
    const passport = usePassportStore();
    const assetStore = useAssetStore();

    const route = useRoute();
    const token_id = computed(() => route.params.token_id);
    const routeName = computed(() => route.name);

    const accessibleRoutes = ref([]);
    const updateAccessibleRoutes = () => {
      const menuRoutes = routes.find((route) => route.name === 'menuRoot');
      accessibleRoutes.value = passport.isAuthenticated
        ? menuRoutes.children
        : menuRoutes.children.filter(
            (childRoute) => childRoute.meta && !childRoute.meta.requiresAuth
          );
    };

    onMounted(() => {
      assetStore.loadMetadata(token_id.value);
      updateAccessibleRoutes();
    });

    watch(passport, () => {
      updateAccessibleRoutes(); // Update on userProfile change
    });

    return {
      routeName,
      token_id,
      asset: computed(() => assetStore),
      accessibleRoutes,
    };
  },
};
</script>
