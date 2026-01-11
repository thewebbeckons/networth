/**
 * Accounts Composable
 *
 * Provides account CRUD operations with automatic snapshot refresh.
 * Wraps the low-level database operations with UI-friendly APIs.
 */
import { useDatabase } from './useDatabase'
import { useSnapshots } from './useSnapshots'
import type { OwnerType } from '~/types/db'

export interface AccountInput {
  name: string
  bank: string
  category: string
  owner: OwnerType
  initialBalance: number
  notes?: string
}

export interface AccountUpdate {
  name: string
  bank: string
  category: string
  owner: OwnerType
  notes?: string
}

export interface BalanceEntry {
  date: string
  value: number
}

export function useAccounts() {
  const {
    addAccount: dbAddAccount,
    updateAccount: dbUpdateAccount,
    updateBalance: dbUpdateBalance,
    deleteAccount: dbDeleteAccount,
    getAccountBalances
  } = useDatabase()

  const { loadSnapshots } = useSnapshots()

  /**
   * Get full balance history for an account
   */
  async function getBalanceHistory(accountId: string | number): Promise<BalanceEntry[]> {
    const numericId = typeof accountId === 'number'
      ? accountId
      : parseInt(accountId, 10)

    if (isNaN(numericId)) return []

    const balances = await getAccountBalances(numericId)
    return balances.map(b => ({ date: b.date, value: b.value }))
  }

  /**
   * Add a new account
   */
  async function addAccount(account: AccountInput): Promise<void> {
    await dbAddAccount(account)
    await loadSnapshots() // Refresh snapshots after adding
  }

  /**
   * Update balance for an account
   */
  async function updateBalance(accountId: string, amount: number, date?: string): Promise<void> {
    const numericId = parseInt(accountId, 10)
    if (isNaN(numericId)) {
      console.error('[useAccounts] Invalid account ID:', accountId)
      return
    }

    const dateStr = date || new Date().toISOString().slice(0, 10)
    await dbUpdateBalance(numericId, amount, dateStr)
    await loadSnapshots() // Refresh snapshots after update
  }

  /**
   * Update account details
   */
  async function updateAccount(accountId: string, data: AccountUpdate): Promise<void> {
    const numericId = parseInt(accountId, 10)
    if (isNaN(numericId)) {
      console.error('[useAccounts] Invalid account ID:', accountId)
      return
    }

    await dbUpdateAccount(numericId, data)
    await loadSnapshots() // Refresh snapshots after update
  }

  /**
   * Delete an account
   */
  async function deleteAccount(accountId: string): Promise<void> {
    const numericId = parseInt(accountId, 10)
    if (isNaN(numericId)) {
      console.error('[useAccounts] Invalid account ID:', accountId)
      return
    }

    await dbDeleteAccount(numericId)
    await loadSnapshots() // Refresh snapshots after delete
  }

  return {
    getBalanceHistory,
    addAccount,
    updateBalance,
    updateAccount,
    deleteAccount
  }
}
