import { auth, db } from "@/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";

export default function Post() {
  //Form state
  //Taking this object out and spread it into another object
  const [post, setPost] = useState({ description: "" });
  const [user, loading] = useAuthState(auth);

  const route = useRouter();
  //Route is where the data is stored from the pathname: post, we did in the dashboard component.
  const editData = route.query;

  //Function to submit the post
  const submitPost = async (event) => {
    //Preventing the web page refresh
    event.preventDefault();

    //Run some checks if the user is allowed to post it or not.
    if (!post.description) {
      //ctrl + cmd + space to bring up emoji keyboard!!!
      toast.error("Description Field Empty! 🤷‍♂️ Fill it out! 😅", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }

    //Run some checks if the user is allowed to post it or not.
    if (post.description.length > 300) {
      //ctrl + cmd + space to bring up emoji keyboard!!!
      toast.error("Description too long. Try again. 🤷‍♂️", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }

    if (post?.hasOwnProperty("id")) {
      const docRef = doc(db, "posts", post.id);
      const updatedPost = { ...post, timestamp: serverTimestamp() };
      await updateDoc(docRef, updatedPost);
      return route.push("/");
      //If there is no post.id the else statement will then run the below function to create a post
    } else {
      //Make a new post
      //Referencing a collection
      const collectionRef = collection(db, "posts");
      //Adding a document to it.
      await addDoc(collectionRef, {
        ...post,
        //What time the post is submitted
        timestamp: serverTimestamp(),
        user: user.uid,
        avatar: user.photoURL,
        username: user.displayName,
      });
      //After the post is submitted, clear the text area.
      setPost({ description: "" });
      toast.success("Post has been made! 🚀 ", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return route.push("/");
    }
  };

  //Check our user
  const checkUser = async () => {
    if (loading) return;
    if (!user) route.push("auth/login");
    //if it has an ID, then it will show up, that means it was existing in the DB. When we are creating a post, there is no ID associated with it.
    if (editData.id) {
      setPost({ description: editData.description, id: editData.id });
    }
  };

  useEffect(() => {
    checkUser();
  }, [user, loading]);

  return (
    <div className="my-20 p-12 shadow-lg rounded-lg max-w-l mx-auto">
      <form onSubmit={submitPost}>
        <h1 className="text-2xl font-bold">
          {/* If the post has an ID, it will display Edit your post!, if not, Create a post! */}
          {post.hasOwnProperty("id") ? "Edit your post!" : "Create a post!"}
        </h1>
        <div className="py-2">
          <h3 className="text-lg font-medium">Description</h3>
          <textarea
            value={post.description} //Always an empty string as set in the useState declaration.
            onChange={(event) =>
              setPost({ ...post, description: event.target.value })
            } //setting the state to what is being typed.the events value
            className="bg-gray-800 h-48 text-white w-full rounded-lg p-2 text-sm"
          ></textarea>
          <p
            className={`text-cyan-600 font-medium text-sm ${
              post.description.length > 300 ? "text-red-600" : ""
            } `}
          >
            {post.description.length}/300
          </p>
        </div>
        <button
          type="submit"
          className="bg-cyan-600 text-white font-medium p-2 my-2 rounded-lg text-sm "
        >
          {post.hasOwnProperty("id") ? "Save Edits" : "Submit"}
        </button>
      </form>
    </div>
  );
}
