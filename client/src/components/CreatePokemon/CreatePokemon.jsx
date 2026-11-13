import { Alert, Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Paper, Stack, TextField, Typography } from "@mui/material";
import { typeNames } from "../PokemonTypes/utils.mjs";
import { useState, useEffect } from "react";
import { createPokemon, getTypes } from "../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { authStore } from "../../auth/store";

const initialValues = { name: "", hp: "", attack: "", defense: "", speed: "", height: "", weigth: "", types: [] };
const fields = [["hp", "Vida"], ["attack", "Ataque"], ["defense", "Defensa"], ["speed", "Velocidad"], ["height", "Altura"], ["weigth", "Peso"]];

export default function CreatePokemon() {
  const dispatch = useDispatch();
  const options = useSelector(store => store.types);
  const [data, setData] = useState(initialValues);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pending, setPending] = useState(false);
  useEffect(() => { dispatch(getTypes()); }, [dispatch]);
  function change(event) {
    const { name, value } = event.target;
    setData(previous => ({ ...previous, [name]: value }));
  }
  function toggle(type) {
    setData(previous => ({ ...previous, types: previous.types.includes(type)
      ? previous.types.filter(value => value !== type) : [...previous.types, type] }));
  }
  async function submit(event) {
    event.preventDefault();
    if (pending) return;
    setError(""); setSuccess("");
    if (!data.types.length || data.types.length > 2) { setError("Selecciona uno o dos tipos."); return; }
    const values = { ...data, name: data.name.trim() };
    for (const [field] of fields) values[field] = Number(data[field]);
    setPending(true);
    try {
      await dispatch(createPokemon(values));
      setSuccess("Pokémon creado correctamente.");
      setData(initialValues);
    } catch (failure) {
      if (failure.status === 401) authStore.signedOut();
      setError(failure.message || "No se pudo crear el Pokémon.");
    } finally { setPending(false); }
  }
  return (
    <Box component="main" sx={{ width: "min(720px, calc(100% - 40px))", mx: "auto", py: 4 }}>
      <Paper component="form" onSubmit={submit} variant="outlined" sx={{ p: { xs: 3, sm: 4 }, borderTop: 5, borderTopColor: "info.main" }}>
        <Typography variant="overline" color="text.secondary">Imagina tu próximo compañero</Typography>
        <Typography component="h1" variant="h2" mb={3}>Crea tu propio Pokémon</Typography>
        <Stack spacing={3}>
          <TextField id="pokemon-name" label="Nombre del Pokémon" name="name" value={data.name} onChange={change} slotProps={{ htmlInput: { pattern: "[a-zA-Z0-9-]{1,80}", maxLength: 80 } }} helperText="Letras, números y guiones. Máximo 80 caracteres." required disabled={pending} />
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2.5 }}>
            {fields.map(([field, label]) => <TextField key={field} id={`pokemon-${field}`} label={label} type="number" name={field} value={data[field]} onChange={change} slotProps={{ htmlInput: { min: 0, max: 100000, step: 1 } }} required disabled={pending} />)}
          </Box>
          <FormControl component="fieldset">
            <FormLabel component="legend">Tipos (selecciona uno o dos)</FormLabel>
            <FormGroup row sx={{ mt: 1 }}>
              {(options || []).map(type => <FormControlLabel key={type.slot} label={typeNames[type.name] || type.name} control={<Checkbox checked={data.types.includes(type.name)} onChange={() => toggle(type.name)} disabled={pending || (!data.types.includes(type.name) && data.types.length >= 2)} />} />)}
            </FormGroup>
          </FormControl>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success" role="status">{success}</Alert>}
          <Button type="submit" variant="contained" disabled={pending}>{pending ? "Creando…" : "Crear Pokémon"}</Button>
        </Stack>
      </Paper>
    </Box>
  );
}
