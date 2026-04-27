import React, { useState, useReducer, useRef, useEffect } from "react";
import ListeCours from "./Liste_Cours";
import moment from "moment";
import "moment/locale/fr";

//const API_ENDPOINT = "https://planning.iae-paris.com/api/v4/cours"
//const API_ENDPOINT = "http://100.115.92.199:4000/api/v4/cours"
const API_ENDPOINT =
  "https://planning-iae-staging-e617fc28ec21.herokuapp.com/api/v4/cours";

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
      <div className="col-sm-6">
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
        <h1>Chargement des données...</h1>
      ) : currentPage === -1 ? (
        <div>
          <img
            src="/pageprincipal.png"
            alt="Loading..."
            width="auto"
            height={700}
          />
        </div>
      ) : (
        <div className="flex flex-col justify-between items-start">
          <div className="flex flex-row items-center  w-screen px-8 mb-4">
            <div className="flex-1 ">
              <img
                src="/LogoIAE.png"
                alt="Planning IAE Paris"
                className="h-auto w-80"
              />
            </div>
            <div className="flex-1 text-[#122e4c]  text-left font-bold text-3xl whitespace-nowrap capitalize">
              Cours du {moment().locale("fr").format("dddd D MMMM YYYY")}
            </div>
          </div>
          <div className="flex flex-row items-center w-full px-10 mb-4 mt-12  font-bold text-gray-500 uppercase text-sm tracking-wider">
            <div className="w-1/5 min-w-[150px] ">Horaires</div>
            <div className="flex-1 pl-2">Formation / Matière</div>
            <div className="w-1/4 pl-7">Intervenant</div>
            <div className="w-[170px] pl-8">Salle</div>
          </div>

          <ListeCours items={paginatedPlanning} />
        </div>
      )}
      {footer}
    </div>
  );
};

export default Planning;
