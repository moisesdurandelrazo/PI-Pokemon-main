import { Link } from "react-router-dom";
import { addFav } from "../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
// import "./Pokemon.css";
import poke from "../../images/poke.png";
import PropTypes from "prop-types";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from "@mui/material";

const Pokemon = ({ name, img, types, id }) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites);
  // console.log({ moves });
  const isFavorite = favorites.some((p) => {
    return p.id === id;
  });

  return (
    <Card
      sx={{
        maxWidth: 280,
        minHeight: 400,
        borderRadius: 6,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        margin: "20px auto",
        background: "linear-gradient(0deg, #ffffff , #f0f0f0)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "10px",
        position: "relative",
      }}
    >
      <Link to={`/pokemons/${id}`} style={{ textDecoration: "none" }}>
        <CardMedia
          component="img"
          height="180"
          image={img || "https://media.giphy.com/media/DRfu7BT8ZK1uo/giphy.gif"}
          alt={name}
          sx={{
            objectFit: "contain",
            margin: "10px auto",
            transition: "transform 0.2s",
            "&:hover": {
              transform: "scale(1.1)",
            },
          }}
        />
        <CardContent>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              color: "#333",
            }}
          >
            {name.toUpperCase()}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              textAlign: "center",
              color: "#555",
              marginBottom: 1,
            }}
          >
            N.º {id.toString().padStart(3, "0")}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            {types &&
              types.map((t) => (
                <Chip
                  key={`${id}-${t.name}`}
                  label={t.name}
                  sx={{
                    backgroundColor: getTypeColor(t.name),
                    color: "white",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                    fontSize: "12px",
                  }}
                />
              ))}
          </Box>
        </CardContent>
      </Link>
      {isFavorite ? (
        <img style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          width: "30px",
          height: "30px",
        }} src={poke} alt="Favorite" />
      ) : (
        <Box
        onClick={() => dispatch(addFav( id ))}
        sx={{
          position: "absolute",
          bottom: 10,
          right: "50%",
          transform: "translateX(50%)",
          cursor: "pointer",
          padding: "8px 8px",
          borderRadius: "20px",
          backgroundColor: "#3f51b5",
          color: "white",
          fontWeight: "bold",
          fontSize: "10px",
          transition: "background-color 0.3s",
          height: "content",
          width: "fit-content",
          "&:hover": {
            backgroundColor: "#2c387e",
          },
        }}
        >
          Agregar a favoritos
        </Box>
      )}
    </Card>
  );
};
Pokemon.propTypes = {
  name: PropTypes.string.isRequired,
  img: PropTypes.string,
  types: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  id: PropTypes.number.isRequired,
  moves: PropTypes.array,
};

const getTypeColor = (type) => {
  const typeColors = {
    grass: "rgb(120,200,80)",
    fire: "rgb(240,80,48)",
    water: "rgb(56,153,248)",
    poison: "rgb(176,88,160)",
    flying: "#BAAAFF",
    normal: "rgb(168,160,144)",
    bug: "rgb(168,184,32)",
    electric: "rgb(248,208,48)",
    ground: "rgb(234,214,164)",
    psychic: "rgb(248,112,160)",
    rock: "rgb(184,160,88)",
    fighting: "rgb(160,80,56)",
    ice: "rgb(88,200,224)",
    ghost: "rgb(96,96,176)",
    steel: "rgb(168,168,192)",
    dragon: "#AB82FF",
    dark: "#705848",
    fairy: "#FFB0FF",
    shadow: "#A9A9A9",
    unknown: "transparent",
  };
  return typeColors[type.toLowerCase()] || "#ddd";
};

export default Pokemon;
