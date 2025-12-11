// import React from "react";
// import { Box, Container, Typography, Grid } from "@mui/material";
// import style from "./Footer.module.css"; // Ensure this file exists

// const Footer = () => {
//   const data = [
//     {
//       title: "About",
//       txt1: "Career on Trendpad",
//       txt2: "Contact us",
//       txt3: "Trendstime Overview",
//       txt4: "Updates",
//     },
//     {
//       title: "Contents",
//       txt1: "Blog",
//       txt2: "Notices",
//       txt3: "Blockchain Dictionary",
//       txt4: "Agreements",
//     },
//     {
//       title: "Market Overview",
//       txt1: "Quick Buy",
//       txt2: "Best Sellers",
//       txt3: "New Tokens",
//       txt4: "Top Earners",
//     },
//     {
//       title: "Earn",
//       txt1: "Referral",
//       txt2: "Airdrop",
//     },
//     {
//       title: "Launchpad",
//       txt1: "Create Launchpad",
//       txt2: "Launchpool",
//     },
//     {
//       imgSrc: "/images/Frame284.png", // Corrected key
//     },
//   ];

//   const imgdata = [
//     { img: "/images/skill-icons_discord.png" },
//     { img: "/images/simple-icons_telegram.png" },
//     { img: "/images/fa6-brands_square-x-twitter.png" },
//     { img: "/images/entypo-social_facebook.png" },
//     { img: "/images/skill-icons_instagram.png" },
//   ];

//   return (
//     <Box mt={10} className={style.footerbox} sx={{ padding: "40px 0" }}>
//       <Container>
//         {/* Header */}
//         <Box>
//           <Typography variant="h4" sx={{ fontWeight: "700", color: "#fff" }}>
//             Trendpad
//           </Typography>
//         </Box>

//         {/* Grid Section */}
//         <Box mt={4}>
//           <Grid container spacing={3} justifyContent="center">
//             {data.map((item, index) => (
//               <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
//                 <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
//                   {item.title && (
//                     <Typography
//                       variant="h6"
//                       sx={{ fontWeight: "700", color: "#fff", mb: 1 }}
//                     >
//                       {item.title}
//                     </Typography>
//                   )}
//                   {item.txt1 && (
//                     <Typography
//                       variant="body2"
//                       sx={{ color: "#9B9797", mt: 1 }}
//                     >
//                       {item.txt1}
//                     </Typography>
//                   )}
//                   {item.txt2 && (
//                     <Typography
//                       variant="body2"
//                       sx={{ color: "#9B9797", mt: 1 }}
//                     >
//                       {item.txt2}
//                     </Typography>
//                   )}
//                   {item.txt3 && (
//                     <Typography
//                       variant="body2"
//                       sx={{ color: "#9B9797", mt: 1 }}
//                     >
//                       {item.txt3}
//                     </Typography>
//                   )}
//                   {item.txt4 && (
//                     <Typography
//                       variant="body2"
//                       sx={{ color: "#9B9797", mt: 1 }}
//                     >
//                       {item.txt4}
//                     </Typography>
//                   )}
//                   {item.imgSrc && (
//                     <Box
//                       sx={{ display: "flex", justifyContent: "center", mt: 2 }}
//                     >
//                       <img
//                         src={item.imgSrc}
//                         width={200}
//                         alt="Footer Logo"
//                         style={{ maxWidth: "100%", height: "auto" }}
//                       />
//                     </Box>
//                   )}
//                 </Box>
//               </Grid>
//             ))}
//           </Grid>
//         </Box>

//         {/* Community Section */}
//         <Box mt={4}>
//           <Typography variant="h6" sx={{ fontWeight: "700", color: "#fff" }}>
//             Community
//           </Typography>
//           <Box
//             className={style.iconBox}
//             mt={2}
//             sx={{ display: "flex", justifyContent: "flex-start", gap: 2 }}
//           >
//             {imgdata.map((item, index) => (
//               <img
//                 src={item.img}
//                 alt="Social Icon"
//                 key={index}
//                 style={{ width: "30px", height: "30px" }}
//               />
//             ))}
//           </Box>
//         </Box>
//       </Container>
//     </Box>
//   );
// };

// export default Footer;

import React from "react";
import { Box, Container, Typography, Grid } from "@mui/material";
import style from "./Footer.module.css"; // Make sure this CSS module exists
import { FaYoutubeSquare } from "react-icons/fa";

const Footer = () => {
  const data = [
    {
      imgSrc: "/images/Frame284.png",
      path: "https://t.me/+w6dhJ5cwNpU5NWQ1",
    },
  ];

  const imgdata = [
    {
      img: "/images/simple-icons_telegram.png",
      alt: "Telegram",
      path: "https://t.me/+Mdm1kgiwZPo5MDg1",
    },
    {
      img: "/images/fa6-brands_square-x-twitter.png",
      alt: "Twitter",
      path: "https://x.com/trendaitrnd?s=21",
    },
    {
      icon: <FaYoutubeSquare size={30} color="grey" />,
      alt: "YouTube",
      path: "https://www.youtube.com/@TrendAI-TRND",
    },
    {
      img: "/images/skill-icons_instagram.png",
      alt: "Instagram",
      path: "https://www.instagram.com/trendai.trnd/#",
    },
  ];

  return (
    <Box
      mt={10}
      className={style.footerbox}
      sx={{
        padding: "60px 0",
        backgroundColor: (theme) =>
          theme.palette.mode === "light" ? "#FFFFFF" : "#0C0C0F",
        borderTop: (theme) =>
          theme.palette.mode === "light" ? "1px solid #E0E0E0" : "none",
      }}
    >
      <Container>
        <Grid
          container
          spacing={4}
          alignItems="center"
          justifyContent="space-between"
        >
          {/* Logo Section */}
          {data.map((item, index) => (
            <Grid item xs={12} sm={6} md={6} key={index}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems={{ xs: "center", sm: "flex-start" }}
              >
                <img
                  src="/images/LogoTrendPad.png"
                  alt="Logo"
                  style={{
                    height: "40px",
                    filter: (theme) =>
                      theme?.palette?.mode === "light" ? "invert(1)" : "none",
                  }}
                />
                {item.imgSrc && (
                  <a
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "inline-block", marginTop: "12px" }}
                  >
                    <img
                      src={item.imgSrc}
                      width={200}
                      alt="Footer Logo"
                      style={{ maxWidth: "100%", height: "auto" }}
                    />
                  </a>
                )}
              </Box>
            </Grid>
          ))}

          {/* Community Section */}
          <Grid item xs={12} sm={6} md={6}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems={{ xs: "center", sm: "flex-end" }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: (theme) => theme.palette.text.primary,
                  mb: 2,
                }}
              >
                Community
              </Typography>
              <Box
                className={style.iconBox}
                sx={{
                  display: "flex",
                  gap: 2,
                  flexWrap: "wrap",
                  justifyContent: { xs: "center", sm: "flex-end" },
                  mb: 2,
                }}
              >
                {imgdata.map((item, index) => (
                  <a
                    key={index}
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "inline-block" }}
                  >
                    {item.img ? (
                      <img
                        src={item.img}
                        alt={item.alt}
                        style={{
                          width: "30px",
                          height: "30px",
                          cursor: "pointer",
                          filter: (theme) =>
                            theme?.palette?.mode === "light"
                              ? "invert(1)"
                              : "none", // Invert icons if needed
                        }}
                      />
                    ) : (
                      item.icon
                    )}
                  </a>
                ))}
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: (theme) => theme.palette.text.primary,
                }}
              >
                Powered By Trend AI
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
