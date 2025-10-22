// app/admin/login/page.tsx
import LoginForm from './LoginForm';

export default function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  const next = searchParams?.next ?? '/admin';

  return (
    <main className="container section max-w-md">
      <h1 className="text-3xl font-semibold">Admin Login</h1>
      {/* Pass next from the server to the client component */}
      <LoginForm next={next} />
    </main>
  );
}



