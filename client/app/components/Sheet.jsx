"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { DateTime } from "luxon";
import { memo, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import CommentSkeleton from "./CommentSkeleton";
import Spinner from "./Spinner";
const COMMENT_POST = gql`
  mutation commentPost($id: String!, $email: String!, $comment: String!) {
    comment(id: $id, email: $email, comment: $comment) {
      name
      comment
      time
      comment_by
      photo
    }
  }
`;
const MySheet = memo(({ commentRef }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const token = useSelector((state) => state.globalSlice.token);
  const user = useSelector((state) => state.globalSlice.user);
  const [commentPost, { loading: loadingNewComment }] = useMutation(
    COMMENT_POST,
    {
      onError: (err) => {
        console.log(err);
      },
      context: {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
    }
  );
  const GET_POST_BY_ID = gql`
    query getPostById($id: String!) {
      getPostById(id: $id) {
        comments {
          comment
          name
          time
          photo
        }
      }
    }
  `;
  const [refetch, { loading, data: commentData }] =
    useLazyQuery(GET_POST_BY_ID);
  const commentRequestPostID = useSelector(
    (state) => state.globalSlice.commentRequestPostID
  );
  console.log("what a data", commentRequestPostID);
  // Create a ref for the parent element

  // Function to scroll to the end of the parent element
  const lastElm = useRef(null);
  const scrollToBottom = async () => {
    function delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    if (lastElm.current) {
      lastElm.current.scrollIntoView({ behavior: "smooth" });
      await delay(1000);
    }
    // const parentElement = parentRef.current;
    // Scroll to the bottom of the parent element
    // parentElement.scrollBottom = "0px";
  };
  const array = [1, 2, 4, 5];
  useEffect(() => {
    if (commentRequestPostID) {
      refetch({
        variables: { id: commentRequestPostID },
      });
      scrollToBottom();
    }
  }, [commentRequestPostID]);
  useEffect(() => {
    if (commentData) {
      setComments(commentData.getPostById.comments);
      scrollToBottom();
    }
  }, [commentData]);

  useEffect(() => {
    scrollToBottom();
  }, [isOpen]);

  return (
    <div>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button ref={commentRef} className="hidden" variant="outline">
            Open
          </Button>
        </SheetTrigger>
        <SheetContent
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            scrollToBottom();
          }}
          className="bg-bng text-text overflow-y-scroll w-[80%]"
        >
          <SheetHeader>
            <SheetTitle>Comments</SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          <div className="">
            <div className="comments mt-4">
              {loading && array?.map((_, ind) => <CommentSkeleton key={ind} />)}

              {comments?.map((comment, ind) => {
                console.log("comment author photo : ", comment);
                return (
                  <div className="mb-8">
                    <p className="flex items-center gap-x-2 ">
                      <span>
                        <img
                          className="w-[40px] h-[40px] rounded-full"
                          src={comment?.photo}
                          alt=""
                        />
                      </span>
                      <p className="flex flex-col gap-1">
                        <p className="font-medium bg-primary text-white rounded-lg px-2 inline-block">
                          {comment?.name}
                        </p>
                        <p className="text-[10px] bg-slate-700 text-white rounded-lg px-2 inline-block ">
                          {DateTime.fromMillis(
                            parseInt(comment.time)
                          ).toLocaleString(DateTime.DATETIME_MED)}
                        </p>
                      </p>
                    </p>
                    <p className="mt-2 ml-12 text-text bg-sky-400 dark:text-black dark:bg-sky-300 p-2 rounded">
                      {comment?.comment}
                    </p>
                  </div>
                );
              })}
              <div ref={lastElm}></div>
            </div>
            <div className="comment-form">
              <form>
                <textarea
                  className=" border-2 border-gray-300 p-3 w-full rounded-lg outline-none bg-bng text-text"
                  rows="2"
                  placeholder="Write a commnent ..."
                  onChange={(e) => setComment(e.target.value)}
                  value={comment}
                  name="comment"
                  autofocus={false}
                ></textarea>
              </form>
              <p>
                <Button
                  onClick={() => {
                    commentPost({
                      variables: {
                        id: commentRequestPostID,
                        email: user.email,
                        comment: comment,
                      },
                      update: (cache, data) => {
                        console.log("hi from comment", data);
                        const commentArray = data.data.comment;
                        setComments(commentArray);
                      },
                    });
                    scrollToBottom();
                    setComment("");
                  }}
                  className="bg-accent text-text"
                  variant="contained"
                >
                  Comment
                </Button>
                <span className="ml-2">
                  {loadingNewComment && <Spinner inline={true} />}
                </span>
              </p>
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button className="hidden" type="submit">
                Save changes
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <div></div>
    </div>
  );
});

export default MySheet;
