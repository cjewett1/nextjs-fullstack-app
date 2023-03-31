import { auth } from "@/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

//passing the spread out props to this function
export default function Message({ children, avatar, username, description }) {
  return (
    <div className="bg-white p-8 border-b-2 rounded-lg">
      <div className="flex items-center">
        <img src={avatar} className="w-12 rounded-full" />
        <h2 className="px-2">{username}</h2>
      </div>
      <div className="py-4">
        <p>{description}</p>
      </div>
      {children}
    </div>
  );
}
