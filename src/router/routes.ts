import LoginLayout from 'layouts/LoginLayout.vue';
import MainLayout from 'layouts/MainLayout.vue';
import ErrorNotFound from 'pages/ErrorNotFound.vue';
import AssetFeature from 'pages/features/AssetFeature.vue';
import GameplayFeature from 'pages/features/GameplayFeature.vue';
import CraftingFeature from 'pages/features/CraftingFeature.vue';
import AssureFeature from 'pages/features/AssureFeature.vue';
import SettingsFeature from 'pages/features/SettingsFeature.vue';

export default [
  {
    path: '/',
    component: LoginLayout,
  },
  {
    path: '/feature',
    component: MainLayout,
    children: [
      {
        path: 'asset',
        component: AssetFeature,
      },
      {
        path: 'gameplay',
        meta: { requiresAuth: true },
        component: GameplayFeature,
      },
      {
        path: 'crafting',
        meta: { requiresAuth: true },
        component: CraftingFeature,
      },
      {
        path: 'assure',
        meta: { requiresAuth: true },
        component: AssureFeature,
      },
      {
        path: 'settings',
        meta: { requiresAuth: true },
        component: SettingsFeature,
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: ErrorNotFound,
  },
];
