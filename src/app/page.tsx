"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import Loading from "@/component/Loading";

const Home = (): JSX.Element => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>("");

  const [sortBy, setSortBy] = useState<"author" | "title" | "date" | "points">("title");

  const router = useRouter();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query) {
        handleSearch();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://hn.algolia.com/api/v1/search?query=${query}`);
      setSearchResults(response.data.hits);
    } catch (err) {
      setError("Failed to fetch results");
    }
    setLoading(false);
  };

  const navigateToDetail = (id: string) => {
    router.push(`/post/${id}`);
  };

  const handleSortChange = (value: "title" | "author" | "date" | "points") => {
    setSortBy(value);
    const sortedResults = [...searchResults];
    if (value === "author") {
      sortedResults.sort((a, b) => a.points - b.points);
    } else if (value === "title") {
      sortedResults.sort((a, b) => a.title - b.title);
    } else if (value === "date") {
      sortedResults.sort((a, b): any => b.created_at_i - a.created_at_i);
    } else if (value === "points") {
      sortedResults.sort((a, b): any => a.points - b.points);
    }
    setSearchResults(sortedResults);
  };

  return (
    <motion.div
      className="container mx-auto mt-8 p-4 sm:min-w-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-center text-xl mb-2">Hacker News</p>
      <input
        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 text-black mb-4"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Hacker News"
      />
      {/* <div className="w-full flex justify-center">
        <button
          className="mt-2 w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
          onClick={handleSearch}
        >
          Search
        </button>
      </div> */}

      <div className="mt-4">
        <label htmlFor="sortSelect" className="mr-2 font-semibold">
          Sort By:
        </label>
        <select
          id="sortSelect"
          className="p-2 rounded-md border border-gray-300 focus:outline-none text-black"
          value={sortBy}
          onChange={(e) => handleSortChange(e.target.value as "author" | "title" | "date")}
        >
          <option value="author">Author</option>
          <option value="title">Title</option>
          <option value="date">Date</option>
          <option value="points">Points</option>
        </select>
      </div>

      {loading && <Loading />}
      {error && <p className="mt-4 text-red-600">{error}</p>}

      <ul className="mt-4">
        {searchResults.map((result: any) => {
          if (!result?.title) {
            return;
          }
          return (
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
          );
        })}
      </ul>
    </motion.div>
  );
};

export default Home;
