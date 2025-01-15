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
        margin: "10px auto",
        background: "linear-gradient(0deg, #ffffff , #f0f0f0)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "10px",
        position: "relative",
      }}
    >
      <Link to={`/pokemons/${id}`} style={{ textDecoration: "none" }}>
        <Box sx={{ background: "#eeeeee" }}>
          <CardMedia
            component="img"
            height="180"
            image={
              img || "https://media.giphy.com/media/DRfu7BT8ZK1uo/giphy.gif"
            }
            alt={name}
            sx={{
              objectFit: "contain",
              margin: "5px auto",
              transition: "transform 0.2s",
              background: "#eeeeee",
              "&:hover": {
                transform: "scale(1.1)",
              },
            }}
          />
        </Box>
        <CardContent sx={{ padding: "0px" }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              color: "#333",
              margin: "0 0 0 0",
              padding: 1,
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
              padding: 0,
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
              padding: 1,
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
                    padding: "2px 8px",
                  }}
                />
              ))}
          </Box>
        </CardContent>
      </Link>
      {isFavorite ? (
        <img
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            width: "30px",
            height: "30px",
          }}
          src={poke}
          alt="Favorite"
        />
      ) : (
        <Box
          onClick={() => dispatch(addFav(id))}
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
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD",
    unknown: "transparent",
  };
  return typeColors[type.toLowerCase()] || "#ddd";
};

export default Pokemon;
