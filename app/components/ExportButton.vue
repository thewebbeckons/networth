<script setup lang="ts">
const isModalOpen = ref(false)

const { accounts } = useNetWorth()
const { categories } = useDatabase()
const toast = useToast()

// UI state
const showExcludeOptions = ref(false)

// Exclusion state
const excludedCategoryIds = ref<Set<number>>(new Set())
const excludedAccountIds = ref<Set<string>>(new Set())

// Group accounts by category for display
const accountsByCategory = computed(() => {
  const grouped: Record<string, typeof accounts.value> = {}
  
  for (const acc of accounts.value) {
    if (!grouped[acc.category]) {
      grouped[acc.category] = []
    }
    grouped[acc.category]!.push(acc)
  }
  
  return grouped
})

// Get category ID by name
const getCategoryId = (categoryName: string): number | undefined => {
  const cat = categories.value.find(c => c.name === categoryName)
  return cat?.id
}

// Check if a category is excluded
const isCategoryExcluded = (categoryName: string): boolean => {
  const catId = getCategoryId(categoryName)
  return catId !== undefined && excludedCategoryIds.value.has(catId)
}

// Toggle category exclusion
const toggleCategory = (categoryName: string) => {
  const catId = getCategoryId(categoryName)
  if (catId === undefined) return
  
  const newSet = new Set(excludedCategoryIds.value)
  if (newSet.has(catId)) {
    newSet.delete(catId)
  } else {
    newSet.add(catId)
  }
  excludedCategoryIds.value = newSet
}

// Check if an account is excluded
const isAccountExcluded = (accountId: string): boolean => {
  return excludedAccountIds.value.has(accountId)
}

// Toggle account exclusion
const toggleAccount = (accountId: string) => {
  const newSet = new Set(excludedAccountIds.value)
  if (newSet.has(accountId)) {
    newSet.delete(accountId)
  } else {
    newSet.add(accountId)
  }
  excludedAccountIds.value = newSet
}

// Get filtered accounts based on exclusions
const filteredAccounts = computed(() => {
  return accounts.value.filter(acc => {
    // Check if account is directly excluded
    if (excludedAccountIds.value.has(acc.id)) {
      return false
    }
    
    // Check if account's category is excluded
    const catId = getCategoryId(acc.category)
    if (catId !== undefined && excludedCategoryIds.value.has(catId)) {
      return false
    }
    
    return true
  })
})

// Count of accounts that will be exported
const exportCount = computed(() => filteredAccounts.value.length)
const totalCount = computed(() => accounts.value.length)

// Export to CSV
const exportToCsv = () => {
  const today = new Date().toISOString().slice(0, 10)
  
  // CSV header
  const header = 'date,name,bank,category,owner,balance'
  
  // CSV rows from filtered accounts
  const rows = filteredAccounts.value.map(account => {
    // Escape fields that might contain commas or quotes
    const escapeCsvField = (field: string) => {
      if (field.includes(',') || field.includes('"') || field.includes('\n')) {
        return `"${field.replace(/"/g, '""')}"`
      }
      return field
    }
    
    return [
      today,
      escapeCsvField(account.name),
      escapeCsvField(account.bank),
      escapeCsvField(account.category),
      escapeCsvField(account.owner),
      account.latestBalance.toString()
    ].join(',')
  })
  
  const csvContent = [header, ...rows].join('\n')
  
  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `account-balances-${today}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  
  toast.add({ title: `Exported ${exportCount.value} accounts`, color: 'success' })
  isModalOpen.value = false
}

// Reset state when modal closes
watch(isModalOpen, (isOpen) => {
  if (!isOpen) {
    showExcludeOptions.value = false
    excludedCategoryIds.value = new Set()
    excludedAccountIds.value = new Set()
  }
})
</script>

<template>
  <div>
    <UButton label="Export" @click="isModalOpen = true" icon="i-heroicons-arrow-down-tray" variant="outline" />
    
    <UModal v-model:open="isModalOpen" title="Export Accounts">
      <template #body>
        <div class="space-y-4">
          <!-- Export summary -->
          <p class="text-muted text-sm">
            Export your account balances to a CSV file.
          </p>

          <!-- Toggle for exclude options -->
          <div v-if="!showExcludeOptions" class="flex justify-center">
            <UButton
              label="Customize Export"
              variant="ghost"
              color="neutral"
              size="sm"
              icon="i-heroicons-adjustments-horizontal"
              @click="showExcludeOptions = true"
            />
          </div>

          <!-- Exclude options panel -->
          <div v-if="showExcludeOptions" class="space-y-4">
            <UDivider label="Exclude from export" />
            
            <!-- Categories section -->
            <div class="space-y-2">
              <h4 class="text-sm font-medium">By Category</h4>
              <div class="flex flex-wrap gap-2">
                <UButton
                  v-for="cat in Object.keys(accountsByCategory)"
                  :key="cat"
                  :label="cat"
                  size="sm"
                  :variant="isCategoryExcluded(cat) ? 'solid' : 'outline'"
                  :color="isCategoryExcluded(cat) ? 'error' : 'neutral'"
                  @click="toggleCategory(cat)"
                />
              </div>
            </div>

            <!-- Accounts section -->
            <div class="space-y-2">
              <h4 class="text-sm font-medium">By Account</h4>
              <div class="max-h-48 overflow-y-auto space-y-3 pr-1">
                <div v-for="(accs, category) in accountsByCategory" :key="category" class="space-y-1">
                  <p class="text-xs text-muted font-medium">{{ category }}</p>
                  <div class="flex flex-wrap gap-1">
                    <UButton
                      v-for="acc in accs"
                      :key="acc.id"
                      :label="acc.name"
                      size="xs"
                      :variant="isAccountExcluded(acc.id) ? 'solid' : 'soft'"
                      :color="isAccountExcluded(acc.id) ? 'error' : 'neutral'"
                      :disabled="isCategoryExcluded(acc.category)"
                      @click="toggleAccount(acc.id)"
                    />
                  </div>
                </div>
              </div>
            </div>

            <UDivider />
          </div>

          <!-- Export count indicator -->
          <p class="text-sm text-center" :class="exportCount < totalCount ? 'text-warning' : 'text-muted'">
            <template v-if="exportCount < totalCount">
              Exporting {{ exportCount }} of {{ totalCount }} accounts
            </template>
            <template v-else>
              Exporting all {{ totalCount }} accounts
            </template>
          </p>

          <!-- Action buttons -->
          <div class="flex justify-end gap-2 pt-2">
            <UButton
              label="Cancel"
              color="neutral"
              variant="ghost"
              @click="isModalOpen = false"
            />
            <UButton
              label="Export CSV"
              icon="i-heroicons-arrow-down-tray"
              :disabled="exportCount === 0"
              @click="exportToCsv"
            />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
