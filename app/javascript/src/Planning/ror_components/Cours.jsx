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
    <div className="flex flex-col md:flex-row md:items-center justify-between border-b md:border-4 border-gray-200 p-8  w-full  ">
      <div className="w-1/6">
        <div className="text-[#122e4c] font-bold  md:text-center border-r-4 border-gray-300 pr-6">
          <div className="whitespace-nowrap">{item.debut_fin_json_v2}</div>
          <div className="md:px-2">{progressBar}</div>
        </div>
      </div>
      <div className="flex-1 pl-8">
        <h3 className="text-[#122e4c] font-bold text-lg md:text-xl leading-tight">
          {item.formation_json_v2}
        </h3>
        <div className="text-gray-600 text-sm md:text-base mt-1 italic">
          {item.matiere_json}
        </div>
      </div>
      <div className="flex-1 pl-10">
        <p className="text-gray-800 font-semibold">{item.intervenant_json}</p>
        {/* {item.intervenant_binome_json && (
          <p className="text-red-500 italic text-xs">
            {item.intervenant_binome_json}
          </p>
        )} */}
      </div>
      <div className="flex-1">
        <span className="text-[#122e4c] text-xl md:text-2xl font-black">
          {item.salle_json_v2}
        </span>
      </div>
    </div>
  );
};
Cours.propTypes = {
  item: PropTypes.object,
};

export default Cours;
