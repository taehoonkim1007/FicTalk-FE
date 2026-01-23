export function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">로그인</h1>
      <form className="mt-8 flex w-80 flex-col gap-4">
        <input type="email" placeholder="이메일" className="rounded-md border px-4 py-2" />
        <input type="password" placeholder="비밀번호" className="rounded-md border px-4 py-2" />
        <button
          type="submit"
          className="bg-primary hover:bg-primary/90 rounded-md px-4 py-2 text-white"
        >
          로그인
        </button>
      </form>
    </div>
  );
}
