//this is all we need to sign a user out
import { auth, db } from "@/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState, useTransition } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { BsTrash2Fill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import Message from "@/components/Message";
import Link from "next/link";

export default function Dashboard() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const [posts, setPosts] = useState([]);

  const getData = async () => {
    //See if the user is logged in
    if (loading) return;
    if (!user) route.push("auth/login");
    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, where("user", "==", user.uid));
    //based off of this user.uid, only should this users posts.
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return unsubscribe;
  };

  //Delete post
  const deletePost = async (id) => {
    //Getting a reference to the individual document
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef);
  };

  //Get users data
  useEffect(() => {
    getData();
  }, [user, loading]);

  return (
    <div>
      <h1>Your Posts</h1>
      <div>
        {posts.map((post) => {
          return (
            <Message {...post} key={post.id}>
              <div className="flex gap-4">
                <button
                  onClick={() => deletePost(post.id)}
                  className=" text-black-500 flex items-center justify-center gap-2 py-2 text-sm "
                >
                  <BsTrash2Fill className="text-2xl" /> Delete
                </button>
                {/* When using the pathname, you can path to the page you want, but also include data. */}
                <Link href={{ pathname: "/post", query: post }}>
                  <button className="text-blue-500 flex items-center justify-center gap-2 py-2 text-sm">
                    <AiFillEdit className="text-2xl" /> Edit
                  </button>
                </Link>
              </div>
            </Message>
          );
        })}
      </div>
      <button
        className="font-medium text-white bg-gray-800 py-2 px-4 rounded-lg my-6 "
        onClick={() => auth.signOut()}
      >
        Sign out
      </button>
    </div>
  );
}
