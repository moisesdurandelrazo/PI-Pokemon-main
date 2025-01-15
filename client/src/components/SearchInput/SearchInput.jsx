import { useState } from "react";
import { getpokemon } from "../../redux/actions/index";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { Box, Button, TextField, Typography } from "@mui/material";
import CatchingPokemonIcon from "@mui/icons-material/CatchingPokemon";
import InputAdornment from "@mui/material/InputAdornment";

const SearchInput = ({ resetFilters }) => {
  const [name, setName] = useState("");
  const dispatch = useDispatch();
  const [error, setError] = useState(false);

  const handleSearch = () => {
    if (!name.trim()) {
      setError(true);
      return;
    }
    setError(false);
    resetFilters();
    dispatch(getpokemon(name.trim()));
    setName("");
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2} >
      <TextField
        id="input-with-icon-textfield"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <CatchingPokemonIcon sx={{ transform: "rotate(90deg)" }}  />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <CatchingPokemonIcon sx={{ transform: "rotate(-90deg)" }}  />
              </InputAdornment>
            ),
          },
        }}
        variant="standard"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={error}
        helperText={error ? "Por favor ingresa un nombre válido." : ""}
        sx={{
          width: "100%",
          maxWidth: "400px",
        }}
      />
      <Button
        variant="contained"
        onClick={handleSearch}
        startIcon={<CatchingPokemonIcon sx={{ transform: "rotate(180deg)" }}  />}
        sx={{
          backgroundColor: "#E3350D",
          color: "white",
          "&:hover": {
            backgroundColor: "#B32A0A",
          },
          textTransform: "none",
          fontSize: "16px",
        }}
      >
       Busca tu Pokémon
      </Button>
    </Box>
  );
};

SearchInput.propTypes = {
  resetFilters: PropTypes.func.isRequired,
};

export default SearchInput;
