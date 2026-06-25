'use client'

interface Props {
  deadline: string | null
}

export function DayBadge({ deadline }: Props) {
  if (!deadline) {
    return (
      <span className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-500">마감일 미확인</span>
    )
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(deadline)
  target.setHours(0, 0, 0, 0)
  const diff = Math.round((target.getTime() - today.getTime()) / 86400000)

  if (diff < 0)
    return <span className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-500">마감</span>
  if (diff === 0)
    return <span className="px-2 py-0.5 text-xs rounded bg-red-100 text-red-700 font-bold">D-Day</span>
  if (diff <= 7)
    return <span className="px-2 py-0.5 text-xs rounded bg-red-100 text-red-700 font-semibold">D-{diff}</span>
  return <span className="px-2 py-0.5 text-xs rounded bg-green-100 text-green-700">D-{diff}</span>
}
