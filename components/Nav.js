import Link from "next/link";
import { auth } from "@/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Nav(props) {
  const [user, loading] = useAuthState(auth);
  return (
    <nav className="flex justify-between items-center py-10">
      <Link href="/">
        <button className="text-lg font-medium">Inquisitive Minds</button>
      </Link>
      <ul className="flex items-center gap-10">
        {/* If there is no user, show the Login button */}
        {!user && (
          <Link href={"/auth/login/"}>
            <button className="py-2 px-4 text-sm bg-cyan-500 text-white rounded-lg font-medium ml-8">
              Join Now
            </button>
          </Link>
        )}
        {/* If there IS a user, show them this content */}
        {user && (
          <div className="flex items-center gap-6">
            <Link href="/post">
              <button className="font-medium bg-cyan-500 text-white py-2 px-4 rounded-mg text-sm ">
                Post
              </button>
            </Link>
            <Link href="/dashboard">
              <img
                className="w-14 rounded-full cursor-pointer"
                src={user.photoURL}
              />
            </Link>
          </div>
        )}
      </ul>
    </nav>
  );
}
