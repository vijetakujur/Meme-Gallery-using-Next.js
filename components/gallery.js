import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography } from "@mui/material";
import Modal from "react-modal";
import { Close as CloseIcon } from "@mui/icons-material";

const galleryStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
  gap: "20px",
  background: "#121212", // Dark background color
  padding: "20px",
  borderRadius: "15px",
};

const additionalContentStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: "10px",
  padding: "5px",
  position: "relative",
  borderRadius: "15px",
  background: "#1E1E1E", // Darker background color
  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
  color: "#FFFFFF", // Text color
};

const typographyStyle = {
  fontSize: "3.5rem",
  fontFamily: "Arial, sans-serif",
};

const modalStyle = {
  content: {
    maxWidth: "100%",
    maxHeight: "100%",
    margin: "auto",
    border: "none",
    borderRadius: "8px",
    overflow: "auto",
    position: "fixed",
    background: "#121212", // Dark background color
  },
  overlay: {
    background: "rgba(18, 18, 18, 0.75)", // Darker overlay color
  },
};

const closeButtonStyle = {
  zIndex: 1,
  cursor: "pointer",
  display: "none",
  color: "#FFFFFF", // Light color for the Close button
};

const Gallery = () => {
  const [memes, setMemes] = useState([]);
  const [after, setAfter] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");

  useEffect(() => {
    fetchMemes();
  }, []);

  const fetchMemes = async () => {
    try {
      const response = await axios.get(
        `https://www.reddit.com/r/memes.json${after ? `?after=${after}` : ""}`
      );
      const newMemes = response.data.data.children.map((child) => ({
        title: child.data.title,
        thumbnail: child.data.thumbnail,
        fullImage: child.data.url,
      }));

      setMemes((prevMemes) => [...prevMemes, ...newMemes]);
      setAfter(response.data.data.after);
    } catch (error) {
      console.error("Error fetching memes:", error);
    }
  };

  const openGallery = (index) => {
    setCurrentImage(memes[index].fullImage);
    setModalIsOpen(true);
  };

  const closeGallery = () => {
    setModalIsOpen(false);
  };

  const handleModalClick = (event) => {
    if (event.target === event.currentTarget) {
      closeGallery();
    }
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      fetchMemes();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Container
      style={{ background: "#000000", minHeight: "100vh", width: "100%" }}
    >
      <div
        style={{ background: "#121212", padding: "20px", borderRadius: "24px" }}
      >
        <div style={additionalContentStyle}>
          <Typography
            variant="h1"
            component="div"
            gutterBottom
            style={{ ...typographyStyle, color: "#FFFFFF" }}
          >
            Meme Gallery
          </Typography>
        </div>
        <br />
        <br />
        <div
          style={{
            position: "fixed",
            top: "10px",
            right: "10px",
            cursor: "pointer",
          }}
          onClick={closeGallery}
        >
          {modalIsOpen && (
            <CloseIcon fontSize="large" style={{ color: "#000000" }} />
          )}
        </div>
        <div style={galleryStyle}>
          {memes.map((meme, index) => (
            <div
              key={index}
              onClick={() => openGallery(index)}
              style={{ cursor: "pointer", position: "relative" }}
            >
              <img
                src={meme.thumbnail}
                alt={meme.title}
                loading="lazy"
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  height: Math.floor(Math.random() * 100 + 150) + "px",
                }}
              />
            </div>
          ))}
        </div>

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeGallery}
          style={modalStyle}
          overlayClassName="modal-overlay"
        >
          <div
            onClick={handleModalClick}
            style={{ width: "100%", height: "100%" }}
          >
            <img
              src={currentImage}
              alt="Full Resolution"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "none",
                borderRadius: "8px",
              }}
            />
          </div>
        </Modal>
      </div>
    </Container>
  );
};

export default Gallery;
