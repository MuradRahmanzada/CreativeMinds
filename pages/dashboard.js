import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { auth, db } from "../utils/Firebase";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { BsTrash2Fill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";

// Components
import Message from "../components/Message";

const dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [user, loading] = useAuthState(auth);
  const route = useRouter();

  const getData = async () => {
    if (loading) return;
    if (!user) return route.push("/auth/login");

    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, where("user", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(
        snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });
    return unsubscribe;
  };

  const deletePost = async (id) => {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef);
  };

  useEffect(() => {
    getData();
  }, [loading, user]);

  return (
    <div>
      <h1 className="text- font-medium text-pink-600">Your Posts</h1>
      <div>
        {posts.map((post) => (
          <Message key={post.id} {...post}>
            <div className="mt-4 flex items-center gap-4">
              <button
                className="flex items-center justify-center gap-2 text-pink-600"
                onClick={() => deletePost(post.id)}
              >
                <BsTrash2Fill className="text-2xl" />
                <span>Delete</span>
              </button>
              <Link href={{pathname: '/post', query: post}}>
                <button className="flex items-center justify-center gap-2 text-cyan-600">
                  <AiFillEdit className="text-2xl" />
                  <span>Edit</span>
                </button>
              </Link>
            </div>
          </Message>
        ))}
        <button
          className="my-4 py-2 px-4 bg-gray-800 text-white font-medium "
          onClick={() => signOut(auth)}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default dashboard;
