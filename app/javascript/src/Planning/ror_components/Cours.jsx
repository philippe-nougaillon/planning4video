import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/fr";

const Cours = ({ item }) => {
  const progressBar = (
    <div className="w-full min-w-[50px] h-10 mt-20 rounded-full bg-gray-200 relative">
      <div
        className="bg-[#e68708] h-full rounded-full absolute left-0 top-0"
        style={{ width: `${item.progress_bar_pct2 || 0}%` }}
      >
      </div>
    </div>
  );

  return (
    <div className="flex flex-row items-center justify-between border-y-20 border-gray-100 py-20 px-10 w-full bg-white tracking-widest">
      <div className="w-1/6">
        <div className="font-bold text-center border-r-10 border-gray-200 pr-20 text-[#122e4c] ">
          <div className="text-5xl whitespace-nowrap mb-1">
            {item.debut_fin_json_v2}
          </div>
          <div className="px-1">{progressBar}</div>
        </div>
      </div>
      <div className="w-1/2 mx-16">
        <h3 className="font-black text-5xl leading-tight  text-[#122e4c]">
          {item.formation_json_v2}
        </h3>
        <div className="text-gray-500 text-5xl mt-1 italic font-medium">
          {item.matiere_json}
        </div>
      </div>
      <div className="w-1/5 mx-10">
        <p className="text-gray-800 font-semibold text-5xl">
          {item.intervenant_json}
        </p>
        {item.intervenant_binome_json && (
          <p className="text-gray-800 font-semibold text-5xl pt-16">
            {item.intervenant_binome_json}
          </p>
        )}
      </div>
      <div className="w-1/6 text-left">
        <span className="text-[#122e4c] text-5xl font-black">
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
