<template>
  <q-layout view="hHh lpR fFf">
    <!-- Header with Hamburger Menu for Desktop -->
    <q-header elevated class="bg-primary text-white desktop-only">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <!-- Other header content -->
      </q-toolbar>
    </q-header>

    <!-- Left Drawer for Desktop -->
    <q-drawer v-model="leftDrawerOpen" side="left" class="desktop-only">
      <q-tabs vertical>
        <!-- Navigation tabs -->
        <q-route-tab
          name="Asset"
          icon="diamond"
          to="/feature/asset"
          label="Asset"
        />
        <q-route-tab
          name="Gameplay"
          icon="sports_esports"
          to="/feature/gameplay"
          label="Gameplay"
        />
        <q-route-tab
          name="Crafting"
          icon="join_full"
          to="/feature/crafting"
          label="Crafting"
        />
        <q-route-tab
          name="Assure"
          icon="gpp_good"
          to="/feature/assure"
          label="Assure"
        />
        <q-route-tab
          name="Settings"
          icon="settings"
          to="/feature//settings"
          label="Settings"
        />
      </q-tabs>
    </q-drawer>

    <!-- Page Container -->
    <q-page-container>
      <router-view></router-view>
    </q-page-container>

    <!-- Bottom Tabs Navigation for Mobile -->
    <q-footer reveal class="bg-primary mobile-only">
      <q-tabs class="text-white">
        <!-- Navigation tabs -->
        <q-route-tab name="Asset" to="/feature/asset" icon="diamond" />
        <q-route-tab
          name="Gameplay"
          to="/feature/gameplay"
          icon="sports_esports"
        />
        <q-route-tab name="Crafting" to="/feature/crafting" icon="join_full" />
        <q-route-tab name="Assure" to="/feature/assure" icon="gpp_good" />
        <q-route-tab name="Settings" to="/feature/settings" icon="settings" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'MainLayout',
  setup() {
    const leftDrawerOpen = ref(false);

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    return {
      leftDrawerOpen,
      toggleLeftDrawer,
    };
  },
});
</script>
