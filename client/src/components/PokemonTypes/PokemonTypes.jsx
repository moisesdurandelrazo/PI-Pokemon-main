import PropTypes from "prop-types";
import { Chip, Stack } from "@mui/material";
import { typeNames, pokemonTypes } from "./utils.mjs";

const colors = {
  normal: ["#a4acaf", "#242b2e"], grass: ["#9bcc50", "#242b2e"],
  fire: ["#fd943e", "#242b2e"], water: ["#2676a9", "#fff"],
  electric: ["#eed535", "#242b2e"], poison: ["#8950a0", "#fff"],
  flying: ["#9fcfe2", "#242b2e"], ice: ["#51c4e7", "#242b2e"],
  fighting: ["#b84d22", "#fff"], ground: ["#d9c45a", "#242b2e"],
  psychic: ["#c33464", "#fff"], bug: ["#587c2e", "#fff"],
  rock: ["#7f6d19", "#fff"], ghost: ["#7b62a3", "#fff"],
  dragon: ["#5b58a5", "#fff"], dark: ["#565656", "#fff"],
  steel: ["#9eb7b8", "#242b2e"], fairy: ["#fdb9e9", "#242b2e"],
};

export default function PokemonTypes({ types }) {
  return (
    <Stack direction="row" useFlexGap flexWrap="wrap" gap={.75}>
      {[...new Set(pokemonTypes(types))].map(name => {
        const [background, color] = Object.hasOwn(colors, name) ? colors[name] : colors.normal;
        return <Chip key={name} label={typeNames[name] || name} sx={{ bgcolor: background, color, borderRadius: 1, minWidth: { xs: 55, sm: 70 }, fontSize: 11 }} />;
      })}
    </Stack>
  );
}
PokemonTypes.propTypes = { types: PropTypes.array };
