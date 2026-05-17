"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ScrollReveal from "./scroll-reveal";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";

interface FeaturesSectionProps {
  features?: any;
  youtubeVideoId?: string;
}

// Default YouTube video ID
const DEFAULT_YOUTUBE_VIDEO_ID = "bu27ErSgjSs";

export function FeaturesSection({
  features,
  youtubeVideoId = DEFAULT_YOUTUBE_VIDEO_ID,
}: FeaturesSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const thumbnailUrl = `https://img.youtube.com/vi/${youtubeVideoId}/maxresdefault.jpg`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${youtubeVideoId}?autoplay=1&rel=0`;

  return (
    <Box
      component="section"
      id="features"
      sx={{
        px: 2,
        py: { xs: 6, md: 10 },
        background: "#FFFFFF",
        scrollMarginTop: "72px",
      }}
    >
      <Box sx={{ maxWidth: 1280, mx: "auto" }}>
        <ScrollReveal>
          <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
            <Typography
              variant="caption"
              sx={{ color: "primary.dark", mb: 1, display: "block" }}
            >
              Product Demo
            </Typography>
            <Typography
              variant="h2"
              sx={{ fontSize: { xs: "1.375rem", md: "2rem" }, mb: 1.5 }}
            >
              Built for Real Operations
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: "auto" }}
            >
              Created in collaboration with clinicians, administrators, and
              healthcare operators who needed systems that reflect real-world
              workflows.
            </Typography>
          </Box>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <Box sx={{ position: "relative", maxWidth: 900, mx: "auto" }}>
            {/* Video container */}
            <Box
              sx={{
                position: "relative",
                width: "100%",
                aspectRatio: "16/9",
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
                background: "#0F172A",
              }}
            >
              {!isPlaying ? (
                <>
                  {/* Thumbnail */}
                  <Box
                    component="img"
                    src={thumbnailUrl}
                    alt="Video preview"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      position: "absolute",
                      inset: 0,
                    }}
                  />
                  {/* Dark overlay */}
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(0,0,0,0.3)",
                      transition: "background 0.3s",
                      "&:hover": { background: "rgba(0,0,0,0.2)" },
                    }}
                  />
                  {/* Play button */}
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                    onClick={() => setIsPlaying(true)}
                  >
                    <IconButton
                      aria-label="Play video"
                      sx={{
                        width: { xs: 64, md: 80 },
                        height: { xs: 64, md: 80 },
                        background: "#14B8A6",
                        color: "#0B1120",
                        boxShadow: "0 8px 32px rgba(20,184,166,0.4)",
                        transition: "all 0.3s",
                        "&:hover": {
                          background: "#0D9488",
                          transform: "scale(1.1)",
                        },
                      }}
                    >
                      <PlayArrowRoundedIcon sx={{ fontSize: { xs: 32, md: 40 } }} />
                    </IconButton>
                    <Box
                      sx={{
                        mt: 2,
                        px: 2.5,
                        py: 0.75,
                        background: "rgba(255,255,255,0.9)",
                        backdropFilter: "blur(8px)",
                        borderRadius: 10,
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        color: "#0F172A",
                      }}
                    >
                      Watch Demo
                    </Box>
                  </Box>
                </>
              ) : (
                <iframe
                  src={embedUrl}
                  title="Product Demo Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    border: "none",
                  }}
                />
              )}
            </Box>

            {/* Decorative element */}
            <Box
              sx={{
                position: "absolute",
                zIndex: -1,
                top: -8,
                left: -8,
                right: -8,
                bottom: -8,
                borderRadius: 4,
                background:
                  "linear-gradient(135deg, rgba(20,184,166,0.15) 0%, rgba(59,130,246,0.1) 100%)",
              }}
            />
          </Box>
        </ScrollReveal>
      </Box>
    </Box>
  );
}
