import { useState } from "react";
import { Box, Button, Stack, TextField } from "@mui/material";
import PropTypes from "prop-types";
import SearchRounded from "@mui/icons-material/SearchRounded";

export default function SearchInput({ onSearch }) {
  const [value, setValue] = useState("");
  return (
    <Box component="form" onSubmit={event => { event.preventDefault(); onSearch(value.trim()); }}>
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <TextField slotProps={{ inputLabel: { shrink: true } }} id="dex-search" label="Nombre o número" type="search" placeholder="¿Qué Pokémon estás buscando?" value={value} onChange={event => { setValue(event.target.value); if (!event.target.value) onSearch(""); }} helperText="Busca entre los Pokémon de esta página." sx={{ "& .MuiInputLabel-root": { color: "#fff" }, "& .MuiInputLabel-root.Mui-focused": { color: "#fff" }, "& .MuiFormHelperText-root": { color: "#d0d3cf" }, "& .MuiOutlinedInput-notchedOutline": { borderColor: "#9aa39a" } }} />
        <Button type="submit" variant="contained" color="secondary" aria-label="Buscar Pokémon" sx={{ minWidth: 48, px: 1 }}><SearchRounded /></Button>
      </Stack>
    </Box>
  );
}
SearchInput.propTypes = { onSearch: PropTypes.func.isRequired };
