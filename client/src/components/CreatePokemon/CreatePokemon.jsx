import { useState, useEffect } from "react";
import { createPokemon, getTypes } from "../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { authStore } from "../../auth/store";
import "./CreatePokemon.css";

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
  return <div className="create-pokemon-container">
    <form className="form" onSubmit={submit}>
      <h1>Crea tu propio Pokemon</h1>
      <p className="question"><label htmlFor="pokemon-name">Nombre del pokemon</label>
        <input id="pokemon-name" type="text" name="name" value={data.name} onChange={change} pattern="[a-zA-Z0-9-]{1,80}" maxLength={80} required disabled={pending} />
      </p>
      {fields.map(([field, label]) => <p className="question" key={field}>
        <label htmlFor={`pokemon-${field}`}>{label}</label>
        <input id={`pokemon-${field}`} type="number" name={field} value={data[field]} onChange={change} min={0} max={100000} step={1} required disabled={pending} />
      </p>)}
      <h2>Tipos (máximo 2)</h2>
      <div className="types">
        {options?.map(type => <span className="types-select" key={type.slot}>
          <input type="checkbox" id={`type-${type.slot}`} checked={data.types.includes(type.name)} onChange={() => toggle(type.name)} disabled={pending || (!data.types.includes(type.name) && data.types.length >= 2)} />
          <label htmlFor={`type-${type.slot}`}>{type.name}</label>
        </span>)}
        {error && <p role="alert">{error}</p>}
        {success && <p role="status">{success}</p>}
        <input type="submit" className="submit" value={pending ? "Creando…" : "Crear Pokemon"} disabled={pending} />
      </div>
    </form>
  </div>;
}
