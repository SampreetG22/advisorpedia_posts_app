import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Feed.css";
import { Chip, CircularProgress } from "@mui/material";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import { backgroundColors } from "../assets/colors";
import gif from "../assets/Like.gif";

export default function Feed() {
  const [likedPost, setLikedPost] = useState(null);
  const [liked, setLiked] = useState({});
  const token = localStorage.getItem("token");
  const [allPosts, setAllPosts] = useState([]);
  const [totalCount, setTotalCount] = useState(0); // Track the total number of posts fetched
  const [loading, setLoading] = useState(false); // Track loading state
  const navigate = useNavigate();
  const bottomOfPageRef = useRef(null);

  useEffect(() => {
    if (token) {
      getAllPosts();
    } else {
      navigate("/signin");
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [allPosts]);

  const getAllPosts = async () => {
    setLoading(true); // Set loading to true when making API call
    axios({
      method: "GET",
      url: `https://dummyjson.com/posts?_limit=30`, // Fetch only 30 posts initially
    })
      .then((response) => {
        setAllPosts(response.data.posts);
        setTotalCount(response.data.totalCount); // Set the total count of posts
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false); // Set loading to false when API call completes
      });
  };

  const loadMorePosts = async () => {
    setLoading(true); // Set loading to true when making API call
    const nextPage = Math.ceil(allPosts.length / 30) + 1; // Calculate the next page number
    try {
      const response = await axios.get(
        `https://dummyjson.com/posts?_page=${nextPage}&_limit=30`
      );
      setAllPosts((prevPosts) => [...prevPosts, ...response.data.posts]); // Append new posts to the existing list
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Set loading to false when API call completes
    }
  };

  const handleLike = (postId) => {
    if (liked[postId]) {
      setLiked((prevLiked) => ({
        ...prevLiked,
        [postId]: false,
      }));
      setLikedPost(null);
    } else {
      setLikedPost(postId);
      setLiked((prevLiked) => ({
        ...prevLiked,
        [postId]: true,
      }));
      setTimeout(() => {
        setLikedPost(null);
      }, 2000);
    }
  };

  const handleScroll = () => {
    if (
      bottomOfPageRef.current &&
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000
    ) {
      loadMorePosts();
    }
  };

  return (
    <>
      {token && (
        <div className="mainContainer">
          {allPosts.map((post, i) => (
            <div key={post.id} className="eachPostCard">
              {likedPost === post.id && (
                <img src={gif} alt="likeGif" className="gif" />
              )}
              <div
                className="titleAndContent"
                style={{
                  background:
                    backgroundColors[i % backgroundColors.length].background,
                  color: backgroundColors[i % backgroundColors.length].text,
                }}
              >
                <h2 className="title">
                  <FormatQuoteIcon
                    style={{
                      transform: "rotate(180deg)",
                      marginBottom: "8px",
                    }}
                  />
                  {post.title}
                  <FormatQuoteIcon
                    style={{
                      marginBottom: "8px",
                    }}
                  />
                </h2>
                <p className="body">{post.body}</p>
              </div>
              <div className="tags">
                Tags: &nbsp;
                {post.tags.map((tag) => (
                  <Chip label={tag} className="chips" key={tag} />
                ))}
              </div>
              <p className="reactions">
                Reactions: {post.reactions}
                {liked[post.id] ? (
                  <span
                    className="likeText"
                    onClick={() => handleLike(post.id)}
                  >
                    LIKED
                  </span>
                ) : (
                  <span
                    className="likeText"
                    onClick={() => handleLike(post.id)}
                  >
                    LIKE THIS POST
                  </span>
                )}
              </p>
            </div>
          ))}
          {loading && (
            <CircularProgress
              style={{ margin: "20px auto", display: "block" }}
            />
          )}{" "}
          {/* Render loader when loading is true */}
          <div ref={bottomOfPageRef} />
        </div>
      )}
    </>
  );
}
