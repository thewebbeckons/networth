/**
 * Database schema types for IndexedDB via Dexie
 * These types match the target database schema for the NetWorth app
 */

// Account table schema
export interface DbAccount {
    id?: number
    legacyId?: string
    name: string
    bank: string
    categoryId: number
    owner: string
    ownerId?: number
    type: 'asset' | 'liability'
    createdAt: string
}

// Owner table schema
export interface DbOwner {
    id?: number
    name: string
    color?: string // Nuxt UI semantic color name (primary, secondary, error, info, success, warning, neutral)
}

// Balance table schema
export interface DbBalance {
    id?: number
    accountId: number
    date: string  // yyyy-mm-dd
    value: number
}

// Category table schema
export interface DbCategory {
    id?: number
    name: string
}

// Transaction table schema
export interface DbTransaction {
    id?: number
    legacyId?: string
    accountId: number
    date: string
    amount: number
    description: string
}

// Monthly snapshot schema (primary key: month)
export interface DbMonthlySnapshot {
    month: string  // yyyy-mm (primary key)
    assetsTotal: number
    liabilitiesTotal: number
    netWorth: number
    createdAt: string
}

// Category snapshot schema
export interface DbCategorySnapshot {
    id?: number
    month: string
    categoryId: number
    type: 'asset' | 'liability'
    total: number
}

// Liability category names for determining account type
export const LIABILITY_CATEGORIES = ['Loan', 'Mortgage', 'Credit Card'] as const

/**
 * Determines if a category should be treated as a liability
 */
export function isLiabilityCategory(categoryName: string): boolean {
    return LIABILITY_CATEGORIES.some(
        c => categoryName.toLowerCase().includes(c.toLowerCase())
    )
}
