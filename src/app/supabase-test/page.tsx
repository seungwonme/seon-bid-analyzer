import { createClient } from "@/lib/supabase/server";

export default async function SupabaseTestPage() {
  const supabase = await createClient();

  let status: "success" | "error" = "success";
  let message = "";
  let tables: string[] = [];

  // auth.getSession()으로 API 도달 가능 여부 확인
  const { error: authError } = await supabase.auth.getSession();

  if (authError) {
    status = "error";
    message = authError.message;
  } else {
    // public 스키마 테이블 목록 (없으면 빈 배열)
    const { data, error: tableError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .eq("table_type", "BASE TABLE");

    if (tableError) {
      // information_schema 접근 불가는 연결 성공으로 처리
      message = "연결 성공 (테이블 목록 조회 권한 없음)";
    } else {
      tables = (data ?? []).map((r: { table_name: string }) => r.table_name);
      message = `연결 성공 — public 스키마 테이블 ${tables.length}개`;
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 w-full max-w-lg p-8 space-y-6">
        <h1 className="text-xl font-semibold text-gray-900">Supabase 연결 확인</h1>

        <div
          className={`flex items-start gap-3 rounded-xl p-4 ${
            status === "success"
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          <span className="text-lg">{status === "success" ? "✓" : "✗"}</span>
          <span className="text-sm font-medium">{message}</span>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">연결 정보</p>
          <dl className="text-sm space-y-1">
            <div className="flex gap-2">
              <dt className="text-gray-400 w-12">URL</dt>
              <dd className="text-gray-700 font-mono text-xs truncate">
                {process.env.NEXT_PUBLIC_SUPABASE_URL}
              </dd>
            </div>
          </dl>
        </div>

        {tables.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">테이블 목록</p>
            <ul className="space-y-1">
              {tables.map((t) => (
                <li key={t} className="text-sm text-gray-700 font-mono bg-gray-50 rounded px-3 py-1">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        )}

        {tables.length === 0 && status === "success" && (
          <p className="text-sm text-gray-400">아직 생성된 테이블이 없습니다.</p>
        )}
      </div>
    </main>
  );
}
