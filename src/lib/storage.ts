import type { BidAnnouncement, CompanyInfo } from '@/types/bid'

const BIDS_KEY = 'bid-analyzer:bids'
const COMPANY_KEY = 'bid-analyzer:company'

export function loadBids(): BidAnnouncement[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(BIDS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveBids(bids: BidAnnouncement[]): void {
  localStorage.setItem(BIDS_KEY, JSON.stringify(bids))
}

export function loadCompanyInfo(): CompanyInfo {
  if (typeof window === 'undefined') return { name: '', bizNumber: '' }
  try {
    const raw = localStorage.getItem(COMPANY_KEY)
    return raw ? JSON.parse(raw) : { name: '', bizNumber: '' }
  } catch {
    return { name: '', bizNumber: '' }
  }
}

export function saveCompanyInfo(info: CompanyInfo): void {
  localStorage.setItem(COMPANY_KEY, JSON.stringify(info))
}
