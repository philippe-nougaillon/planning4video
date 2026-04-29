import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/fr";

const Cours = ({ item }) => {
  const progressBar = (
    <div className="w-full border border-gray-300 h-4 mt-1 rounded-full overflow-hidden bg-gray-100">
      <div
        className="bg-[#e68708] h-full"
        style={{ width: `${item.progress_bar_pct2 || 0 }% ` }}
      ></div>
    </div>
  );

  return (
    <div className="flex flex-row items-center justify-between border-y-4 border-gray-100 p-8 w-full bg-white">
      
      <div className="w-1/6">
        <div className="font-bold text-center border-r-4 border-gray-200 pr-6 text-[#122e4c]">
          <div className="text-xl whitespace-nowrap mb-1">
            {item.debut_fin_json_v2}
          </div>
          <div className="px-1">{progressBar}</div>
        </div>
      </div>
      <div className="flex-1 px-8">
        <h3 className="font-black text-2xl leading-tight uppercase tracking-tight text-[#122e4c]" >
          {item.formation_json_v2}
        </h3>
      <div className="text-gray-500 text-base mt-1 italic font-medium">
          {item.matiere_json}
        </div>
      </div>
      <div className="flex-1 ">
        <p className="text-gray-800 font-semibold">{item.intervenant_json}</p>
        {/* {item.intervenant_binome_json && (
          <p className="text-red-500 italic text-xs">
            {item.intervenant_binome_json}
          </p>
        )} */}
      </div>
      <div className="flex-1 text-left">
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
