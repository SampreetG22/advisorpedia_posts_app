import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Feed.css";
import { Chip, CircularProgress } from "@mui/material";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import { backgroundColors } from "../assets/colors";
import gif from "../assets/Like.gif";
import likeSound from "../assets/likeSound.mp3";
import LogoutIcon from "@mui/icons-material/Logout";
import { names } from "../assets/names";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

export default function Feed(props) {
  const { handleSnackBar } = props;
  const [likedPost, setLikedPost] = useState(null);
  const [liked, setLiked] = useState({});
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("user");
  const [allPosts, setAllPosts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleLogout = () => {
    setDialogOpen(true);
  };

  const logoutAndCloseDialog = () => {
    localStorage.removeItem("token");
    handleSnackBar(true, "Logged out successfully", "info");
    window.location.reload();
  };

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const bottomOfPageRef = useRef(null);
  const audioRef = useRef(new Audio(likeSound));
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
    setLoading(true);
    axios({
      method: "GET",
      url: `https://dummyjson.com/posts?_limit=30`,
    })
      .then((response) => {
        setAllPosts(response.data.posts);
        setTotalCount(response.data.totalCount);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const loadMorePosts = async () => {
    setLoading(true);
    const nextPage = Math.ceil(allPosts.length / 30) + 1; // Calculate the next page number
    try {
      const response = await axios.get(
        `https://dummyjson.com/posts?_page=${nextPage}&_limit=30`
      );
      setAllPosts((prevPosts) => [...prevPosts, ...response.data.posts]); // Append new posts to the existing list
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
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
      audioRef.current.play();
      setTimeout(() => {
        setLikedPost(null);
      }, 1900);
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
          <div className="headerAndOptions">
            <p style={{ fontSize: "2.5vw", color: "white", textAlign: "left" }}>
              Welcome, <span style={{ fontWeight: 550 }}>{username}!</span>
            </p>
            <p
              style={{ fontSize: "1.5vw" }}
              className="optionsButton"
              onClick={handleLogout}
            >
              {" "}
              <LogoutIcon style={{ marginRight: "0.5vw", fontSize: "1.5vw" }} />
              Logout
            </p>
          </div>
          {allPosts.map((post, i) => {
            return (
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
                  <h2
                    className="title"
                    style={{ fontSize: "2.5vw", marginBottom: "0.5vw" }}
                  >
                    <FormatQuoteIcon
                      style={{
                        fontSize: "1.5vw",
                        transform: "rotate(180deg)",
                        marginBottom: "8px",
                      }}
                    />
                    {post.title}
                    <FormatQuoteIcon
                      style={{
                        fontSize: "1.5vw",
                        marginBottom: "8px",
                      }}
                    />
                  </h2>
                  <p
                    className="body"
                    style={{ fontSize: "1.1vw", lineHeight: "2vw" }}
                  >
                    {post.body}
                  </p>
                </div>
                <div className="tags" style={{ fontSize: "1.2vw" }}>
                  Tags: &nbsp;
                  {post.tags.map((tag, i) => (
                    <p
                      key={i}
                      style={{
                        fontSize: "1vw",
                        backgroundColor: "silver",
                        padding: "0.2vw 0.5vw",
                        marginInline: "0.5vw",
                        borderRadius: "10px",
                      }}
                    >
                      {tag}
                    </p>
                  ))}
                </div>
                <div className="reactionAndLike">
                  <p className="reactions" style={{ fontSize: "1.1vw" }}>
                    By {names[i].name} -{" "}
                    <span style={{ fontSize: "1.1vw", color: "gray" }}>
                      {names[i].date.toLocaleDateString()}
                    </span>
                  </p>
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
                </div>
              </div>
            );
          })}
          {loading && (
            <CircularProgress size={70} style={{ marginTop: "10vw" }} />
          )}{" "}
          <div ref={bottomOfPageRef} />
          <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle id="alert-dialog-title">
              {"Confirmation Logout"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to logout?
              </DialogContentText>
            </DialogContent>
            <div style={{ marginLeft: "60%", marginBottom: "1.2vw" }}>
              <Button
                variant="outlined"
                onClick={() => setDialogOpen(false)}
                color="error"
                style={{ marginRight: "1.2vw", fontWeight: "500" }}
              >
                Cancel
              </Button>
              <Button
                variant="outlined"
                onClick={logoutAndCloseDialog}
                color="primary"
                style={{ fontWeight: "500" }}
              >
                Logout
              </Button>
            </div>
          </Dialog>
        </div>
      )}
    </>
  );
}
