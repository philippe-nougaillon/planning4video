import React, { useState, useReducer, useRef, useEffect } from "react";
import ListeCours from "./Liste_Cours";
import moment from "moment";
import "moment/locale/fr";

//const API_ENDPOINT = "https://planning.iae-paris.com/api/v4/cours"
//const API_ENDPOINT = "http://100.115.92.199:4000/api/v4/cours"
const API_ENDPOINT =
  "https://planning.iae-paris.com/api/v4/cours";

const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => {
      savedCallback.current();
    };
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

const Planning = () => {
  const per_page = 7; // nombre de lignes par page
  const time_to_sleep = 11; // pause entre deux pages (en secondes)
  const [currentPage, setCurrentPage] = useState(-1);
  const [currentTick, setCurrentTick] = useState(time_to_sleep);
  const [paginatedPlanning, setPaginatedPlanning] = useState(new Array());

  const planningReducer = (state, action) => {
    switch (action.type) {
      case "PLANNING_FETCH_INIT":
        return {
          ...state,
          isLoading: true,
          isError: false,
        };
      case "PLANNING_FETCH_SUCCESS":
        return {
          ...state,
          isLoading: false,
          isError: false,
          data: action.payload,
          totalPages: Math.trunc(action.payload.length / per_page),
        };
      case "PLANNING_FETCH_FAILURE":
        return {
          ...state,
          isLoading: false,
          isError: true,
        };
      default:
        throw new Error();
    }
  };

  const [planning, dispatchPlanning] = useReducer(planningReducer, {
    data: [],
    isLoading: false,
    isError: false,
    totalPages: 0,
  });

  const fetchPlanning = () => {
    dispatchPlanning({ type: "PLANNING_FETCH_INIT" });

    fetch(`${API_ENDPOINT}`)
      .then((response) => response.json())
      .then((result) => {
        dispatchPlanning({
          type: "PLANNING_FETCH_SUCCESS",
          payload: result,
        });
      })
      .catch(() => dispatchPlanning({ type: "PLANNING_FETCH_FAILURE" }));
  };

  useEffect(() => {
    fetchPlanning();
  }, []);

  useEffect(() => {
    // Pagine la liste des cours par tranche de 'per_page'
    const item_position = per_page * currentPage;
    setPaginatedPlanning(
      planning.data.slice(item_position, item_position + per_page),
    );
    console.log(
      `data.length: ${planning.data.length} | pages: ${planning.data.length / per_page} | currentPage: ${currentPage} | slice start: ${item_position} | slice end: ${item_position + per_page}`,
    );
  }, [currentPage]);

  useInterval(() => {
    // Décompte les secondes avant le changement de page
    if (currentTick > 0) {
      setCurrentTick(currentTick - 1);
    }
    //console.log(currentTick);
  }, 1000);

  useInterval(() => {
    // Changer de page à l'expiration du délai et recharger si première page
    if (currentPage < planning.totalPages) {
      setCurrentPage(currentPage + 1);
    } else {
      //console.log("Fetching Planning...")
      fetchPlanning();
      setCurrentPage(0);
    }
    setCurrentTick(time_to_sleep);
  }, time_to_sleep * 1000);

  const footer = (
    <div className="flex flex-row gap-10 p-6">
      <div className="col-sm-6 capitalize">
        <h4>{moment().locale("fr").format("dddd D/MM HH:mm")}</h4>
      </div>
      <div className="col-sm-5">
        <h4>
          <div className="progress">
            <div
              className="progress-bar bg-warning"
              style={{ opacity: 0.8, width: (currentTick - 1) * 10 + "%" }}
            ></div>
          </div>
        </h4>
      </div>
      <div className="col-sm-1">
        <h4>{`Page: ${currentPage + 1} sur ${planning.totalPages + 1}`}</h4>
      </div>
    </div>
  );

  return (
    <div>
      {planning.isLoading ? (
        <h1 className="text-center mt-10 text-2xl">Chargement...</h1>
      ) : currentPage === -1 ? (
        <div className="flex justify-center">
          <img
            src="/pageprincipal.png"
            alt="Loading"
            className="max-w-full h-auto"
          />
        </div>
      ) : (
        <div className=" w-full h-screen">
          <div className="flex flex-row items-center justify-between pl-4 pr-8 py-4 gap-4">
            <img
              src="/LogoIAE.png"
              alt="Logo"
              className="h-auto w-48 md:w-80"
            />
            <div className="text-[#122e4c] font-bold text-base md:text-3xl text-left capitalize">
              Cours du {moment().locale("fr").format("dddd D MMMM YYYY")}
            </div>
          </div>

          <div className="flex flex-row text-sm items-center justify-between  px-8  w-full  mb-2 mt-8 font-bold text-gray-500 tracking-widest">
            <div className="w-1/6 pr-6">HORAIRES</div>
            <div className="flex-1 pl-8">FORMATION</div>
            <div className="flex-1 pl-10">INTERVENANT</div>
            <div className="flex-1">SALLE</div>
          </div>

          <ListeCours items={paginatedPlanning} />
        </div>
      )}
      {footer}
    </div>
  );
};

export default Planning;
