import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../utils/Firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import { toast } from "react-toastify";

const Post = () => {
  const [user, loading] = useAuthState(auth);
  const route = useRouter();
  const routeData = route.query;

  const [post, setPost] = useState({
    description: "",
  });

  const submitPost = async (e) => {
    e.preventDefault();

    if (!post.description) {
      toast("Description Field empty ❗", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
      return;
    }

    if (post.description.length > 300) {
      toast("Description too long ❗", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
      return;
    }

    if (post?.hasOwnProperty("id")) {
      const docRef = doc(db, "posts", post.id);
      const updatePost = { ...post, timestamp: serverTimestamp() };
      await updateDoc(docRef, updatePost);
      toast.success('Post has been updated 🚀', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500
      })
      return route.push('/')
    } else {
      // New post
      const collectionRef = collection(db, "posts");
      await addDoc(collectionRef, {
        ...post,
        timestamp: serverTimestamp(),
        user: user.uid,
        username: user.displayName,
        avatar: user.photoURL,
      }).catch((error) => console.log(error));
      setPost({ title: "", description: "" });
      toast.success('Post has been made 🚀', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500
      })
      return route.push("/");
    }
  };

  const checkUser = async () => {
    if (loading) return;
    if (!user) return route.push("/auth/login");
    if (routeData.id) {
      setPost({ description: routeData.description, id: routeData.id });
    }
  };

  useEffect(() => {
    checkUser();
  }, [user, loading]);

  return (
    <div className="my-20 p-12 shadow-lg max-w-xl">
      <form onSubmit={submitPost}>
        <h1 className="font-bold text-2xl">{post.hasOwnProperty("id") ? "Edit your post" : "Create a new post"}</h1>
        <div className="py-2">
          <h3 className="py-2">Description</h3>
          <textarea
            className="bg-gray-800 h-48 w-full resize-none rounded-lg text-sm p-3 text-white"
            value={post.description}
            onChange={(e) => setPost({ ...post, description: e.target.value })}
          ></textarea>
          <p
            className={`py-2 font-medium text-cyan-600 ${
              post.description.length > 300 ? "text-red-500" : ""
            }`}
          >
            {post.description.length}/300
          </p>
        </div>
        <button
          type="submit"
          className="w-full bg-cyan-600 text-white rounded-lg font-medium p-2"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Post;
