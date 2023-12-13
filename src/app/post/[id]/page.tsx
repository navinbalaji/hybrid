"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Loading from "@/component/Loading";

interface Post {
  title: string;
  points: number;
  children?: { id: string; text: string }[];
}

const HTML_REGEX = /(<([^>]+)>)/gi;

const PostDetail = (): JSX.Element => {
  const [post, setPost] = useState<Post>({ title: "", points: 0 });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<null | String>("");

  const router = useRouter();
  const routerParms = useParams();
  const { id } = routerParms;

  useEffect(() => {
    const fetchPostDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get<Post>(`https://hn.algolia.com/api/v1/items/${id}`);
        console.log(response);
        setPost(response.data);
      } catch (err) {
        setError("Failed to fetch post details");
      }
      setLoading(false);
    };

    if (id) {
      fetchPostDetails();
    }
  }, [id]);

  const handleGoBack = () => {
    router.push("/");
  };

  return (
    <motion.div
      className="container mx-auto mt-8 p-4 sm:min-w-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      <button
        onClick={handleGoBack}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring focus:ring-blue-300 mb-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 inline-block mr-2 -mt-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        Go Back
      </button>

      {loading && <Loading />}
      {error && <p className="text-red-600">{error}</p>}

      <motion.h2 className="text-2xl font-semibold" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {post.title}
      </motion.h2>
      <motion.p className="text-green-600" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        Points: {post.points}
      </motion.p>

      <motion.ul className="mt-4">
        {post.children &&
          post.children.map((comment) => (
            <motion.li
              key={comment.id}
              className="cursor-pointer py-2 border-gray-200 hover:bg-gray-100 hover:text-black transition duration-300 rounded-lg my-5 hover:p-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 py-2 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-black transition duration-300 ease-in-out text-white">
                {comment.text.replace(HTML_REGEX, "")}
              </div>
            </motion.li>
          ))}
      </motion.ul>
    </motion.div>
  );
};

export default PostDetail;

//https://vm-2dfcef88-0773-4c6f-9bf3-7064aaec468c-8000.in-vmprovider.projects.hrcdn.net
