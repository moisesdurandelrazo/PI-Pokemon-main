import React, { useState, useEffect } from "react";
import { createPokemon, getTypes } from "../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import "./CreatePokemon.css";

// import { getPokemons } from "../../actions";
// import style from "./form.module.css";

const initialValues = {
  name: "",
  hp: "",
  attack: "",
  defense: "",
  speed: "",
  height: "",
  weigth: "",
  types: [],
};

export const CreatePokemon = (props) => {
  const dispatch = useDispatch();

  const options = useSelector((store) => store.types);
  //   // UseEffect que haga dispatch de getTypes
  useEffect(() => {
    dispatch(getTypes());
  }, [dispatch]);

  const validate = (input) => {
    let errors = {};
    if (!input.name) {
      errors.name = "El name es obligatorio";
    }

    return errors;
  };

  const [data, setData] = useState(initialValues);

  // console.log({ data });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    if (e.target.name !== "name") {
      setData({
        ...data,
        [e.target.name]:
          Number(e.target.value) <= 0 ? 0 : Number(e.target.value),
      });
    } else {
      setErrors(
        validate({
          ...data,
          [e.target.name]: e.target.value,
        })
      );
      setData({
        ...data,
        [e.target.name]: e.target.value,
      });
    }
  };

  const checkbox = (e) => {
    console.log({ e });
    if (data.types.includes(e.target.value)) {
      data.types = data.types.filter((id) => id !== e.target.value);
      setData({
        ...data,
        types: data.types,
      });
    } else {
      setData({
        ...data,
        types: [...data.types, e.target.name],
      });
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    dispatch(createPokemon(data));
    setData(initialValues);
    document
      .querySelectorAll("input[type=checkbox]")
      .forEach((e) => (e.checked = false));
  };

  return (
    <div className="create-pokemon-container">
      <form className="form" onSubmit={submit}>
        <div className="">
          <h1>Crea tu propio Pokemon</h1>
          <p className={errors.name ? "danger" : "question"}>
            <label>Nombre del pokemon</label>
            <input
              type="text"
              placeholder="pikachu.."
              name="name"
              value={data.name}
              onChange={handleInputChange}
              required
            />
          </p>
          {errors.name ? <p className="danger">{errors.username}</p> : null}
          <p className="question">
            <label>Vida</label>
            <input
              type="number"
              name="hp"
              value={data.hp}
              onChange={handleInputChange}
            />
          </p>
          <p className="question">
            <label>Ataque</label>
            <input
              type="number"
              name="attack"
              value={data.attack}
              onChange={handleInputChange}
            />
          </p>
          <p className="question">
            <label>Defensa</label>
            <input
              type="number"
              name="defense"
              value={data.defense}
              onChange={handleInputChange}
            />
          </p>
          <p className="question">
            <label>Velocidad</label>
            <input
              type="number"
              name="speed"
              value={data.speed}
              onChange={handleInputChange}
            />
          </p>
          <p className="question">
            <label>Altura</label>
            <input
              type="number"
              name="height"
              value={data.height}
              onChange={handleInputChange}
            />
          </p>
          <p className="question">
            <label>Peso</label>
            <input
              type="number"
              name="weigth"
              value={data.weigth}
              onChange={handleInputChange}
            />
          </p>
        </div>

        <h1>Tipos</h1>
        <div className="types">
          {options?.map((t) => (
            <div key={t.slot}>
              <input
                type="checkbox"
                name={t.name}
                value={t.slot}
                id={t.slot}
                onChange={checkbox}
              />
              <label htmlFor={t.slot}>{t.name}</label>
              {t.slot % 4 === 0 ? <br /> : null}
            </div>
          ))}
          <input type="submit" className="submit" />
        </div>
      </form>
    </div>
  );
};

export default CreatePokemon;
