<script setup lang="ts">
const props = defineProps<{
  title?: string
}>()

const { isOnline } = useNetworkStatus()
</script>

<template>
  <UDashboardNavbar>
    <template #left>
      <div class="flex items-center gap-3">
        <UDashboardSidebarCollapse size="sm" />
        <slot name="title">
          <span class="text-lg font-semibold">{{ props.title }}</span>
        </slot>
      </div>
    </template>
    <template #right>
      <slot name="right" />
      <UBadge v-if="!isOnline" color="warning" variant="subtle" size="sm" class="ml-2">
        <UIcon name="i-lucide-wifi-off" class="mr-1" />
        Offline
      </UBadge>
      <UColorModeButton />
    </template>
  </UDashboardNavbar>
</template>
