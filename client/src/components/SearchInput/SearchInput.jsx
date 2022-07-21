import React from "react";
import { useState } from "react";
import { getpokemon } from "../../redux/actions/index";
import { useDispatch } from "react-redux";
import "./SearchInput.css";

const SearchInput = ({ resetFilters }) => {
  const [name, setName] = React.useState("");
  const dispatch = useDispatch();

  return (
    <div className="topnav">
      <input
        placeholder="Eje: pikachu..."
        className="input"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        className="button"
        onClick={(e) => {
          resetFilters();
          dispatch(getpokemon(name));
        }}
      >
        Buscar
      </button>
    </div>
  );
};

export default SearchInput;
