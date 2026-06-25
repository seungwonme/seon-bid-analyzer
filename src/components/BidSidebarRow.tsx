'use client'

import type { BidAnnouncement } from '@/types/bid'
import { DayBadge } from './DayBadge'

interface Props {
  bid: BidAnnouncement
  selected: boolean
  onClick: () => void
}

export function BidSidebarRow({ bid, selected, onClick }: Props) {
  const done = bid.checklist.filter(i => i.status === 'done').length
  const total = bid.checklist.length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 border-b transition-colors ${
        selected
          ? 'bg-blue-50 border-l-2 border-l-blue-600'
          : 'hover:bg-gray-100 border-l-2 border-l-transparent'
      }`}
    >
      <p className="text-sm font-medium text-gray-900 truncate">
        {bid.title ?? '공고명 미확인'}
      </p>
      <p className="text-xs text-gray-500 truncate mt-0.5">
        {bid.organization ?? '발주기관 미확인'}
      </p>
      <div className="flex items-center gap-2 mt-2">
        <DayBadge deadline={bid.deadline} />
        {total > 0 && (
          <div className="flex-1 flex items-center gap-1.5">
            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs text-gray-400">{pct}%</span>
          </div>
        )}
      </div>
    </button>
  )
}
