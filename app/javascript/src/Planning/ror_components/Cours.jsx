import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/fr";

const Cours = ({ item }) => {
  const pct = item.progress_bar_pct2 || 0;
  const estaPasando = pct > 0 && pct < 100;

  const colorCarrera = item.formation_color_json_v2 || "#122e4c";

  const progressBar = (
    <div className="w-full min-w-[50px] h-10 mt-20 rounded-full bg-gray-200 relative overflow-hidden">
      <div
        className="bg-[#e68708] h-full rounded-full absolute left-0 top-0 transition-all duration-700"
        style={{ width: `${pct}%` }}
      ></div>
    </div>
  );

  return (
    <div className="flex flex-row items-stretch justify-between border-b-20 border-gray-50 w-full bg-white tracking-widest relative">
      {/* horarires */}
      <div className="w-1/6 py-20 pl-12 pr-10 flex flex-col justify-center items-center">
        <div className="font-bold text-[#122e4c] text-center w-full">
          <div className="text-5xl whitespace-nowrap mb-1">
            {item.debut_fin_json_v2}
          </div>
          <div className="px-1">{progressBar}</div>
        </div>
      </div>

      {/* border */}
      <div
        className="w-4 transition-all duration-500"
        style={{
          backgroundColor: estaPasando ? colorCarrera : "#f3f4f6", 
          margin: "60px 0", 
        }}
      ></div>

      {/* formation */}
      <div className="w-1/2 py-20 px-16 flex flex-col justify-center mt-4">
        <h3 className="font-black text-6xl mr-20 leading-tight text-[#122e4c]">
          {item.formation_json_v2}
        </h3>
        <div className="text-gray-500 text-5xl mt-2 italic font-medium">
          {item.matiere_json}
        </div>
      </div>

      {/* intervenant */}
      <div className="w-1/4 py-20 px-10 flex flex-col justify-center">
        <p className="text-gray-800 font-bold text-5xl leading-snug">
          {item.intervenant_json}
          {item.intervenant_binome_json && (
            <span className="block text-gray-500 font-medium text-4xl mt-2">
              & {item.intervenant_binome_json}
            </span>
          )}
        </p>
      </div>

      {/*  salle  */}
      <div className="w-1/6 flex items-center justify-center pr-12">
        <div className="w-full text-white bg-[#122e4c] rounded-3xl text-6xl flex justify-center p-4 font-black ">
          {item.salle_json_v2}
        </div>
      </div>

      {/*  live ou pas? */}
     {estaPasando && (
        <div className="absolute top-10 right-2/5  bg-[#e68708] text-white text-3xl  px-6 py-2 rounded-full font-bold animate-expand-horizontally">
          En Cours
        </div>
      )}
    </div>
  );
};

Cours.propTypes = {
  item: PropTypes.object,
};

export default Cours;
