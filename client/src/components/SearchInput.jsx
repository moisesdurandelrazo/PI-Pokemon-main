import React from "react";
import { useState } from "react";
import { getpokemon } from "../redux/actions/index";
import { useDispatch } from "react-redux";

const SearchInput = ({ resetFilters }) => {
  const [name, setName] = React.useState("");
  const dispatch = useDispatch();

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button
        onClick={(e) => {
          resetFilters();
          dispatch(getpokemon(name));
        }}
      >
        buscar
      </button>
    </div>
  );
};

export default SearchInput;
