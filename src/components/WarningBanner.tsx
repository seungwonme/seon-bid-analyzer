export function WarningBanner() {
  return (
    <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 flex items-center gap-2 text-sm text-yellow-800">
      <span aria-hidden>⚠</span>
      <span>AI가 아닌 키워드 추출 방식입니다. 추출 결과가 틀릴 수 있으니 반드시 원문을 확인하세요.</span>
    </div>
  )
}
