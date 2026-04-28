import React from "react";
import PropTypes from "prop-types";
import Cours from "./Cours";

const ListeCours = ({ items }) => {
  if (!items || items.length === 0) {
    return <div className="p-10 text-center text-gray-400">Aucun cours prévu.</div>;
  }

  return (
    <div className="w-full px-8 py-4 "> 
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