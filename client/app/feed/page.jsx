"use client";

import { getDataFromLocal } from "@/utils/localStorage";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreatePost from "../components/CreatePost";
import LeftSidebar from "../components/LeftSidebar";
import PostCard from "../components/PostCard";
import { setUser } from "../redux/globalSlice";
const GET_USER_POSTS = gql`
  query getPostByAuthor($email: String!) {
    getPostByAuthor(email: $email) {
      post
      approved
      authorPhoto
      comments
      dislikes
      isPaid
      likes
      name
      photo
      time
      _id
    }
  }
`;
export default function feed() {
  const user = useSelector((state) => state.globalSlice.user);

  const { loading, error, data, refetch } = useQuery(GET_USER_POSTS, {
    variables: {
      email: user?.email,
    },
  });
  const posts = data?.getPostByAuthor;
  console.log(posts, user?.email);
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    const user = getDataFromLocal("user");
    if (user?.id) {
      dispatch(setUser(user));
      router.push("/feed");
    }
  }, []);

  return (
    <div className="bg-bng text-text py-8 px-12 flex items-start h-[90vh] w-full overflow-hidden ">
      <LeftSidebar />
      <div className="hidescroll overflow-y-scroll h-[inherit]">
        <div>
          <CreatePost loading={loading} refetch={refetch} />
        </div>
        <div className=" ">
          {posts?.map((post, ind) => (
            <PostCard key={ind} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
