import { useSession, signIn, signOut } from "next-auth/react";

const LoginPage = () => {
  const { data: session } = useSession();

  return (
    <div className="flex justify-center items-center mt-4">
      {session ? (
        <div className="text-center">
          <span className="block mb-2 text-sm font-medium text-gray-700">
            Signed in as {session.user?.email}
          </span>
          <button
            onClick={() => signOut()}
            className="px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-150"
          >
            Sign out
          </button>
        </div>
      ) : (
        <button
          onClick={() => signIn()}
          className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150"
        >
          Sign in
        </button>
      )}
    </div>
  );
};

export default LoginPage;
