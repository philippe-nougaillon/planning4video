import React from "react";
import PropTypes from "prop-types";
import Cours from "./Cours";

const ListeCours = ({ items }) => {
  if (!items || items.length === 0) {
    return <div className="text-center p-40 ">
  <div className="text-9xl mb-30">📅</div>
  <p className="text-7xl font-semibold mb-10 text-gray-600">
    Aucun cours prévu aujourd'hui
  </p>
  <p className="text-7xl mt-2 text-gray-500">
    Les cours du prochain jour seront affichés automatiquement.
  </p>
</div>;
  }

  return (
    <div className="w-full px-8 py-4  "> 
      {items.map((item) => (
        <Cours key={item.id} item={item} />
      ))}
    </div>
  );
};

ListeCours.propTypes = {
  items: PropTypes.array
};

export default ListeCours;