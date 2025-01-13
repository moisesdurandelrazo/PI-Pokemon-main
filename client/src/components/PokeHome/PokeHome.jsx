
import { Link } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import logo from "../../assets/newtwo.jpg";

const fontFamily = "'Press Start 2P', cursive";

export const PokeHome = () => {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${logo})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        color: "#fff",
        padding: 2,
      }}
    >

      <Typography
        variant="h2"
        sx={{
          fontFamily: fontFamily,
          fontWeight: "bold",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
          marginBottom: "16px",
        }}
      >
        ¡Encuentra tus Pokémon!
      </Typography>

    
      <Typography
        variant="h5"
        sx={{
          fontFamily: fontFamily,
          textShadow: "1px 1px 3px rgba(0, 0, 0, 0.6)",
          marginBottom: "32px",
        }}
      >
        Podrás ver sus ataques, fuerza, vida, entre otras cosas...
      </Typography>

 
      <Link to="/Pokemons" style={{ textDecoration: "none" }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#ffcc00",
            color: "#3b4cca",
            fontFamily: fontFamily,
            fontSize: "16px",
            padding: "12px 24px",
            borderRadius: "8px",
            textTransform: "none",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.4)",
            "&:hover": {
              backgroundColor: "#ffd700",
              transform: "scale(1.05)",
              transition: "all 0.3s ease-in-out",
            },
          }}
        >
          Busca tu Pokémon
        </Button>
      </Link>
    </Box>
  );
};

export default PokeHome;
