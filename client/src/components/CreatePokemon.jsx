import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { createPokemon } from "../redux/actions";

// import { getPokemons } from "../../actions";
// import style from "./form.module.css";

const initialValues = {
  name: "",
  hp: 0,
  attack: 0,
  defense: 0,
  speed: 0,
  height: 0,
  weigth: 0,
  types: [],
};

export const CreatePokemon = () => {
  //   const dispatch = useDispatch();
  const options = useSelector((store) => store.types);

  // UseEffect que haga dispatch de getTypes

  console.log({ options });
  const validate = (input) => {
    let errors = {};
    if (!input.name) {
      errors.name = "El name es obligatorio";
    }

    return errors;
  };

  const [data, setData] = useState(initialValues);

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    if (e.target.name !== "name") {
      setData({
        ...data,
        [e.target.name]: Number(e.target.value) <= 0 ? 0 : e.target.value,
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
    if (data.types.includes(e.target.value)) {
      data.types = data.types.filter((id) => id !== e.target.value);
      setData({
        ...data,
        types: data.types,
      });
    } else {
      setData({
        ...data,
        types: [...data.types, e.target.value],
      });
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    // const crear = await fetch("https://kevindex.herokuapp.com/pokemons", {
    //   method: "POST",
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(data),
    // });

    // createPokemon(data) yo hice
    // setData(initialValues);
  };

  return (
    <div className="containercreate">
      <form className="form" onSubmit={submit}>
        <div className="">
          <h1>Crea tu propio Pokemon</h1>
          <p className={errors.name ? "danger" : "question"}>
            <label>Pokemon name</label>
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
            <label>hp</label>
            <input
              type="number"
              name="hp"
              value={data.hp}
              onChange={handleInputChange}
            />
          </p>
          <p className="question">
            <label>attack</label>
            <input
              type="number"
              name="attack"
              value={data.attack}
              onChange={handleInputChange}
            />
          </p>
          <p className="question">
            <label>defense</label>
            <input
              type="number"
              name="defense"
              value={data.defense}
              onChange={handleInputChange}
            />
          </p>
          <p className="question">
            <label>speed</label>
            <input
              type="number"
              name="speed"
              value={data.speed}
              onChange={handleInputChange}
            />
          </p>
          <p className="question">
            <label>height</label>
            <input
              type="number"
              name="height"
              value={data.height}
              onChange={handleInputChange}
            />
          </p>
          <p className="question">
            <label>weigth</label>
            <input
              type="number"
              name="weigth"
              value={data.weigth}
              onChange={handleInputChange}
            />
          </p>
        </div>

        <h1>types</h1>
        <div className="types">
          {/* {options?.map((t) => (
              <div key={t.id}>
                <input
                  type="checkbox"
                  name={t.name}
                  value={t.id}
                  id={t.id}
                  onChange={checkbox}
                />
                <label htmlFor={t.id}>{t.name}</label>
                {t.id % 4 === 0 ? <br /> : null}
              </div>
            ))} */}
          <input type="submit" className="submit" />
        </div>
      </form>
    </div>
  );
};

export default CreatePokemon;
