<script setup lang="ts">
const isAddAccountOpen = ref(false)
</script>

<template>
  <UDashboardPanel id="accounts">
    <template #header>
      <UDashboardNavbar title="Accounts" description="Manage your assets and liabilities">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <div class="flex gap-2">
            <ExportButton />
            <UButton label="Add Account" @click="isAddAccountOpen = true" icon="i-heroicons-plus" />
          </div>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UContainer class="py-6 space-y-6">
        <UCard variant="soft">
          <AccountList />
        </UCard>
      </UContainer>

      <UModal v-model:open="isAddAccountOpen" title="Add Account">
        <template #body>
          <AccountForm @close="isAddAccountOpen = false" />
        </template>
      </UModal>
    </template>
  </UDashboardPanel>
</template>
