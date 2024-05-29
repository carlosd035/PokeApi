"use client";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import axios from "axios";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [pokemonInfo, setPokemonInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState('front_default');
  const [pokemonId, setPokemonId] = useState(null);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`);
      const { data: info } = await axios.get(`https://pokeapi.co/api/v2/pokemon-form/${data.id}/`);
      setPokemonId(data.id);
      setPokemonInfo(info);
    } catch (error) {
      console.error(error);
      setPokemonInfo(null);
    }
    setLoading(false);
  }, [searchTerm]);

  useEffect(() => {
    if (!pokemonInfo) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev === 'front_default' ? 'back_default' : 'front_default'));
    }, 500);

    return () => clearInterval(interval);
  }, [pokemonInfo]);

  const next = async () => {
    if (pokemonId === null) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon-form/${pokemonId + 1}/`);
      setPokemonInfo(data);
      setPokemonId(pokemonId + 1);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };
  const last = async () => {
    if (pokemonId === null || pokemonId < 1) return;
    setLoading(true);
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon-form/${pokemonId - 1}/`);
      setPokemonInfo(response.data);
      setPokemonId(pokemonId - 1);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <main className="h-screen w-full p-10 bg-gradient-to-t from-yellow-600 via-yellow-500 to-yellow-300 relative">
      <div className="text-center text-black text-4xl font-mono">
        <h1>Welcome to the Pokemon World</h1>
      </div>

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <form className="mt-5 sm:flex sm:items-center" onSubmit={handleSubmit}>
            <input
              className="text-black inline w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-3 leading-5 placeholder-gray-500 focus:border-indigo-500 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
              placeholder="Search a pokemon"
              type="search"
              value={searchTerm}
              onChange={handleInputChange}
            />
            <button
              type="submit"
              className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-black text-4xl font-mono">Loading...</div>
      ) : (
        pokemonInfo && (
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-center text-black text-4xl font-mono ">{pokemonInfo.name}</h1>
            <div className="flex justify-center items-center">
              <Image
                src={pokemonInfo.sprites[currentImage]}
                alt={pokemonInfo.name}
                width={200}
                height={200}
              />
            </div>
            <div className="flex w-full justify-center gap-10">
              <div className="p-5 bg-slate-500 rounded-full cursor-pointer" onClick={last}>
                <MdKeyboardArrowLeft />
              </div>
              <div className="p-5 bg-slate-500 rounded-full cursor-pointer" onClick={next}>
                <MdKeyboardArrowRight />
              </div>
            </div>
          </div>
        )
      )}

      <div className="absolute bottom-0">
        <Image
          src="/images/pikachu.png"
          alt="logo"
          width={350}
          height={350}
        />
      </div>
    </main>
  );
}