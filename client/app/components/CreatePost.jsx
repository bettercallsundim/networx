"use client";
import { Button } from "@/components/ui/button";
import { getDataFromLocal } from "@/utils/localStorage";
import { gql, useMutation } from "@apollo/client";
import axios from "axios";
import { memo, useRef, useState } from "react";
import { BiSolidImageAdd } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { addPostRedux } from "../redux/globalSlice";
const CreatePost = memo(() => {
  const [doc, setDoc] = useState({ post: "", photo: "" });
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const [photo, setPhoto] = useState("");
  const [photoURL, setPhotoURL] = useState(null);
  const user = getDataFromLocal("user");
  const { token } = getDataFromLocal("token");
  const addPost = gql`
    mutation addPost($post: String!, $photo: String!, $email: String!) {
      addPost(post: $post, photo: $photo, email: $email) {
        post
        photo
        author
        time
        tags
        likes
      }
    }
  `;
  const [postStatus] = useMutation(addPost, {
    onError: (err) => {
      console.log(err);
    },
    context: {
      headers: {
        authorization: "Bearer " + token,
      },
    },
  });
  async function uploadPost(e) {
    e.preventDefault();
    console.log(doc, "doc");
    // if user uploads a photo
    if (fileRef.current.files.length > 0 && doc.photo) {
      const formData = new FormData();
      formData.append("file", doc.photo);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
      );
      console.log(typeof doc?.photo?.type, "type");
      // formData.append("public_id", "posts");
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_CLOUDINARY}${
            doc?.photo?.type?.includes("image") ? "image" : "video"
          }/upload`,
          formData
        )
        .then(async (res) => {
          postStatus({
            variables: {
              post: doc.post,
              photo: res.data.secure_url,
              email: user.email,
            },

            update: (
              cache,
              {
                data: {
                  addPost: { post, author, time, photo },
                },
              }
            ) => {
              dispatch(addPostRedux({ post, author, time, photo }));
              // console.log(data);
            },
          });
          console.log("yoy yoy", res);
          setDoc({ post: "", photo: "" });
        })
        .catch((error) => {
          console.error("Error uploading file", error);
        });
      fileRef.current.value = "";
    } else {
      // if user does not upload a photo
      // await axios.post(`${process.env.NEXT_PUBLIC_BACKEND}/post/createPost`, {
      //   photo: "",
      //   authorPhoto: user.photo,
      //   authorName: user.name,
      //   post: doc.post,
      //   uid: user.uid,
      // });
      // console.log(res);

      setDoc({ post: "", photo: "" });
    }
  }
  return (
    <div>
      <form
        className="w-[400px]"
        onSubmit={uploadPost}
        encType="multipart/form-data"
      >
        <textarea
          className=" border-2 border-gray-300 p-3 w-full rounded-lg outline-none bg-bng text-text"
          rows="3"
          placeholder="Write a post ..."
          onChange={(e) => setDoc({ ...doc, [e.target.name]: e.target.value })}
          value={doc.post}
          name="post"
          type="text"
        ></textarea>
        <br />
        <div className="flex items-center gap-x-8">
          {photoURL && (
            <div>
              <img
                className="w-10  h-10 border-gray-300 border-2 rounded"
                src={photoURL}
                alt=""
              />
            </div>
          )}
          <label htmlFor="photo">
            <button
              onClick={() => {
                fileRef.current.click();
              }}
            >
              <BiSolidImageAdd className="text-3xl hover:text-primary" />
            </button>
            <input
              ref={fileRef}
              onChange={(e) => {
                console.log(e.target.files[0]);

                if (e.target.files[0].type.includes("image")) {
                  setDoc({ ...doc, photo: e.target.files[0] });
                  setPhoto(e.target.files[0]);
                  setPhotoURL(URL.createObjectURL(e.target.files[0]));
                } else if (e.target.files[0].type.includes("video")) {
                  setDoc({ ...doc, photo: e.target.files[0] });

                  setPhoto(e.target.files[0]);
                }
              }}
              type="file"
              name="photo"
              id=""
              hidden
            />
          </label>
          <Button
            size="small"
            className="hover:bg-accent hover:text-text bg-text text-bng  px-6 pr-6 rounded-lg font-medium "
            variant="contained"
            type="submit"
          >
            Post
          </Button>
        </div>
      </form>
      <br />
      <br />
      <br />
    </div>
  );
});

export default CreatePost;
