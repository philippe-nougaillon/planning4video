import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/fr";

const Cours = ({ item }) => {
  const progressBar = (
    <div className="w-full border border-gray-400 h-4 mt-1 rounded-md overflow-hidden">
      <div
        className="bg-[#e68708] h-3.5 rounded-md"
        style={{ opacity: 0.8, width: `${item.progress_bar_pct2}%` }}
      ></div>
    </div>
  );

  

  const badgeSalle = (
    <div
      className={` text-[#122e4c]  p-4 `}
    >
      <h3 className="text-2xl font-bold">{item.salle_json_v2}</h3>
    </div>
  );

  return (
    <div className="flex flex-row items-center justify-between border border-4 border-gray-200 py-6 w-full">
      <div className="w-1/5 min-w-[150px] p-2 border-r-6 border-gray-200 ">
        <h3 className=" p-3 text-center ">
          {item.debut_fin_json_v2}
          {progressBar}
        </h3>
      </div>

      <div className="flex-1 px-6">
        <h3 className="text-[#122e4c]  font-bold text-xl ">
          {item.formation_json_v2}
        </h3>
        <div className="flex items-center mt-2 text-gray-700 font-medium">
          {item.matiere_json}
        </div>
      </div>

      <div className="w-1/4 px-4 text-gray-800">
        <p className="font-semibold">{item.intervenant_json}</p>
        {item.intervenant_binome_json && (
          <p className="text-gray-500 italic text-sm">
            {item.intervenant_binome_json}
          </p>
        )}
      </div>

      <div className="w-[170px] flex justify-end p-2">
        <div className="w-full">{badgeSalle}</div>
      </div>
    </div>
  );
};
Cours.propTypes = {
  item: PropTypes.object,
};

export default Cours;
