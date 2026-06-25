'use client'

import { useState } from 'react'
import type { BidAnnouncement, ChecklistItem, ChecklistStatus } from '@/types/bid'

interface Props {
  bid: BidAnnouncement
  onUpdate: (checklist: ChecklistItem[]) => void
}

const STATUS_LABELS: Record<ChecklistStatus, string> = {
  'not-started': '미시작',
  'in-progress': '준비중',
  done: '완료',
}

const STATUS_COLORS: Record<ChecklistStatus, string> = {
  'not-started': 'bg-gray-100 text-gray-600',
  'in-progress': 'bg-yellow-100 text-yellow-700',
  done: 'bg-green-100 text-green-700',
}

const NEXT_STATUS: Record<ChecklistStatus, ChecklistStatus> = {
  'not-started': 'in-progress',
  'in-progress': 'done',
  done: 'not-started',
}

export function ChecklistPanel({ bid, onUpdate }: Props) {
  const [newLabel, setNewLabel] = useState('')

  const done = bid.checklist.filter(i => i.status === 'done').length
  const total = bid.checklist.length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  const toggle = (id: string) =>
    onUpdate(bid.checklist.map(i => i.id === id ? { ...i, status: NEXT_STATUS[i.status] } : i))

  const addItem = () => {
    if (!newLabel.trim()) return
    onUpdate([
      ...bid.checklist,
      { id: crypto.randomUUID(), label: newLabel.trim(), status: 'not-started' },
    ])
    setNewLabel('')
  }

  const deleteItem = (id: string) => onUpdate(bid.checklist.filter(i => i.id !== id))

  return (
    <div className="flex flex-col h-full">
      {/* Progress */}
      <div className="px-6 py-4 border-b">
        <div className="flex justify-between text-sm mb-1.5">
          <span>진행률</span>
          <span className="font-medium">{pct}% ({done}/{total})</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-2">
        {bid.checklist.length === 0 && (
          <p className="text-sm text-gray-400 text-center mt-8">
            항목이 없습니다. 아래에서 추가해 주세요.
          </p>
        )}
        {bid.checklist.map(item => (
          <div key={item.id} className="flex items-center gap-2">
            <button
              onClick={() => toggle(item.id)}
              className={`text-xs px-2 py-1 rounded shrink-0 ${STATUS_COLORS[item.status]}`}
            >
              {STATUS_LABELS[item.status]}
            </button>
            <span
              className={`flex-1 text-sm leading-snug ${
                item.status === 'done' ? 'line-through text-gray-400' : 'text-gray-700'
              }`}
            >
              {item.label}
            </span>
            <button
              onClick={() => deleteItem(item.id)}
              aria-label="항목 삭제"
              className="text-gray-300 hover:text-red-400 shrink-0"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Add */}
      <div className="px-6 py-4 border-t flex gap-2">
        <input
          value={newLabel}
          onChange={e => setNewLabel(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addItem()}
          placeholder="항목 입력 후 엔터"
          className="flex-1 text-sm border rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-blue-400"
        />
        <button
          onClick={addItem}
          className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
        >
          추가
        </button>
      </div>
    </div>
  )
}
