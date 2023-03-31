// [slug].js is a dynamic page
//We will always get brought this page when there is a randomly generated number in the URL

import Message from "@/components/Message";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { auth, db } from "@/utils/firebase";
import { toast } from "react-toastify";
import {
  arrayUnion,
  Timestamp,
  doc,
  updateDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";

export default function Details() {
  const router = useRouter();
  const routeData = router.query;
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);

  //Submit a comment
  const submitMessage = async () => {
    //check if user is logged
    //Doing this without the firetools package, this is firebase code
    //If there is no current user
    if (!auth.currentUser) return router.push("auth/login");
    if (!message) {
      toast.error("Dont leave an empty message! 😳 ", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }
    //--------------------This is the post we are on
    const docRef = doc(db, "posts", routeData.id);
    await updateDoc(docRef, {
      //Adding a comments section to firebase.
      comments: arrayUnion({
        message,
        avatar: auth.currentUser.photoURL,
        userName: auth.currentUser.displayName,
        time: Timestamp.now(),
      }),
    });
    setMessage("");
  };

  //Get Comments
  const getComments = async () => {
    //Accessing the post
    const docRef = doc(db, "posts", routeData.id);
    //Getting the post
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      //Pulling out the comments array here
      setAllMessages(snapshot.data().comments);
    });
    return unsubscribe;
  };

  useEffect(() => {
    if (!router.isReady) return;
    getComments();
  }, [router.isReady]);

  return (
    <div>
      <Message {...routeData}></Message>
      <div className="my-4">
        <div className="flex gap-2">
          <input
            onChange={(event) => setMessage(event.target.value)}
            type="text"
            value={message}
            placeholder="Make a comment 😅 "
            className="bg-gray-800 w-full p-2 text-white rounded-lg "
          />
          <button
            onClick={submitMessage}
            className="bg-cyan-500 text-white py-2 px-4 rounded-lg text-sm"
          >
            Submit
          </button>
        </div>
        <div className="py-6">
          <h2 className="font-bold">Comments</h2>
          {allMessages?.map((message) => (
            // ----------------------------This should be an ID but its fine for this case.
            <div className="bg-white p-4 my-4 border-2" key={message.time}>
              <div className="flex items-center gap-2 mb-4  ">
                <img
                  className="w-10 rounded-full "
                  src={message.avatar}
                  alt="avatar of commenter"
                />
                <h2>{message.userName}</h2>
              </div>
              <h2 className="border-t-2 pt-3">{message.message}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
