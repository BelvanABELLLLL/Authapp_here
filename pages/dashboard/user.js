import { signOut } from "next-auth/react";

function UserPage() {
  return (
    <div>
      <h1>User Dashboard</h1>
      <p>Welcome, User!</p>

      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}

export default UserPage;
