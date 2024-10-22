import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, login, logout } from "@/lib/handleLogin";

export default async function Login() {
  const session = await getSession();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

        <form
          className="space-y-4"
          action={async (formData) => {
            "use server";
            await login(formData);
            redirect("/login");
          }}
        >
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <form
            action={async () => {
              "use server";
              await logout();
              redirect("/login");
            }}
          >
            <button
              type="submit"
              className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Logout
            </button>
          </form>
        </div>

        <pre className="mt-4 p-2 bg-gray-100 rounded-lg text-sm overflow-auto">
          {JSON.stringify(session, null, 2)}
        </pre>

        <div className="mt-4 text-center">
          <Link href="/gallery" className="text-blue-500 hover:underline">
            To Gallery
          </Link>
        </div>
      </div>
    </div>
  );
}
