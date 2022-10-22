import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../utils/Firebase";

const Nav = () => {
  const [user, loading] = useAuthState(auth);

  return (
    <nav className="flex items-center justify-between py-10">
      <Link href="/">
        <button className="text-lg font-medium">Creative Minds</button>
      </Link>
      <ul className="flex items-center gap-10">
        {!user && (
          <Link href={`/auth/login`}>
            <a className="py-2 px-8 bg-cyan-500 text-white rounded-lg text-sm font-medium ml-10">
              Join Now
            </a>
          </Link>
        )}
        {user && (
          <div className="flex items-center gap-6">
            <Link href="/post">
                <button className="py-2 px-6 rounded-lg text-white font-medium  bg-cyan-500">Post</button>
            </Link>

            <Link href="/dashboard">
              <Image src={user.photoURL} alt="" width={48} height={48} className="rounded-full cursor-pointer" />
            </Link>
          </div>
        )}
      </ul>
    </nav>
  );
};

export default Nav;
