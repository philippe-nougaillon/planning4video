import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/fr";

const Cours = ({ item }) => {
  const progressBar = (
    <div className="w-full border border-gray-300 h-4 mt-1 rounded-full overflow-hidden bg-gray-100">
      <div
        className="bg-[#e68708] h-full"
        style={{ width: `${item.progress_bar_pct2}%` }}
      ></div>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between border-b md:border-4 border-gray-200 p-8 md:py-6 w-full bg-white mb-2 md:mb-0">
      
      {/* 1. Horarios */}
      <div className="w-full md:w-1/6 mb-3 md:mb-0">
        <div className="text-[#122e4c] font-bold text-lg md:text-center border-r-4 border-gray-300 pr-6">
          {item.debut_fin_json_v2}
          <div className="md:px-2">{progressBar}</div>
        </div>
      </div>

      {/* 2. Formación y Materia */}
      <div className="flex-1 md:px-6 mb-3 md:mb-0">
        <h3 className="text-[#122e4c] font-bold text-lg md:text-xl leading-tight">
          {item.formation_json_v2}
        </h3>
        <div className="text-gray-600 text-sm md:text-base mt-1 italic">
          {item.matiere_json}
        </div>
      </div>

      {/* 3. Intervenant */}
      <div className="w-full md:w-1/4 mb-3 md:mb-0 border-t md:border-t-0 pt-2 md:pt-0">
        <p className="text-gray-800 font-semibold">{item.intervenant_json}</p>
        {item.intervenant_binome_json && (
          <p className="text-gray-500 italic text-xs">{item.intervenant_binome_json}</p>
        )}
      </div>

      {/* 4. Salle */}
      <div className="w-full md:w-1/6 flex md:justify-end items-center">
        <div className="bg-[#122e4c] text-white md:bg-transparent md:text-[#122e4c] px-4 py-2 md:p-0 rounded-lg w-full md:w-auto text-center">
           <span className="md:hidden text-xs uppercase mr-2 opacity-70">Salle:</span>
           <span className="text-xl md:text-2xl font-black">{item.salle_json_v2}</span>
        </div>
      </div>
      
    </div>
  );
};
Cours.propTypes = {
  item: PropTypes.object,
};

export default Cours;
