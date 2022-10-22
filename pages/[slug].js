import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db, auth } from "../utils/Firebase";
import { toast } from "react-toastify";

// Components
import Message from "../components/Message";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import Image from "next/image";

const Details = () => {
  const route = useRouter();
  const routeData = route.query;
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);

  const submitMessage = async () => {
    if (!auth.currentUser) return route.push("/auth/login");

    if (!message) {
      toast.error("Don't leave message 😅", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }

    const docRef = doc(db, "posts", routeData.id);
    await updateDoc(docRef, {
      comments: arrayUnion({
        message,
        avatar: auth.currentUser.photoURL,
        username: auth.currentUser.displayName,
        time: Timestamp.now(),
      }),
    });

    setMessage("");
  };

  const getComments = async () => {
    const docRef = doc(db, "posts", routeData.id);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      setAllMessages(snapshot.data().comments);
    });
  };

  useEffect(() => {
    if (!route.isReady) return;
    getComments();
  }, [route.isReady]);

  return (
    <div>
      <Message {...routeData}>
        <div className="my-4">
          <div className="flex items-center ">
            <input
              type="text"
              placeholder="Send a message 😀"
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-gray-800 p-2 text-white text-sm"
            />
            <button
              type="submit"
              className="bg-cyan-500 py-2 px-4 text-sm text-white"
              onClick={submitMessage}
            >
              Submit
            </button>
          </div>

          <div className="py-6">
            <h2 className="font-bold">Comments</h2>
            {allMessages?.map((message) => (
              <div className="bg-white p-6 border-2" key={message.id}>
                <div className="flex items-center gap-2 mb-4">
                  <Image src={message.avatar} width={40} height={40} alt="user-photo" className="rounded-full" />
                  <h1 className="font-medium">{message.username}</h1>
                </div>
                <div>
                  <h1>{message.message}</h1>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Message>
    </div>
  );
};

export default Details;
