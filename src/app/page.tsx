"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";

const Home = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://hn.algolia.com/api/v1/search?query=${query}`);
      setSearchResults(response.data.hits);
    } catch (err) {
      setError("Failed to fetch results");
    }
    setLoading(false);
  };

  const navigateToDetail = (id: string) => {
    router.push(`/post/${id}`);
  };

  return (
    <motion.div
      className="container mx-auto mt-8 p-4 sm:min-w-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      <input
        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 text-black"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Hacker News"
      />
      <div className="w-full flex justify-center">
        <button
          className="mt-2 w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {loading && <p className="mt-4 text-gray-600">Loading...</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}

      <ul className="mt-4">
        {searchResults.map((result: any) => (
          <motion.li
            key={result.objectID}
            onClick={() => navigateToDetail(result.objectID)}
            className="cursor-pointer py-2 border-b border-gray-200 hover:bg-gray-100 hover:text-black transition duration-300 hover:rounded-lg hover:p-5 my-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {result.title}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default Home;
