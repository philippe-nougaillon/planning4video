import React, { useState, useReducer, useRef, useEffect } from "react";
import ListeCours from "./Liste_Cours";
import moment from "moment";
import "moment/locale/fr";

const API_ENDPOINT = "https://planning-iae-staging-e617fc28ec21.herokuapp.com/api/v4/cours"
//const API_ENDPOINT = "http://100.115.92.199:4000/api/v4/cours"
//const API_ENDPOINT = "https://planning.iae-paris.com/api/v4/cours";

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
  const per_page = 2; // nombre de lignes par page
  const time_to_sleep = 10; // pause entre deux pages (en secondes)
  const reload_data_every = 60 // recharger les données chaque minute 
  const [currentPage, setCurrentPage] = useState(-1);
  const [currentTick, setCurrentTick] = useState(time_to_sleep);
  const [paginatedPlanning, setPaginatedPlanning] = useState([]);

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
          totalPages: Math.max(0, Math.ceil(action.payload.length / per_page) - 1),

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
        //console.log("PLANNING_FETCH_SUCCESS");
        setCurrentPage((prev) => (prev === -1 ? 0 : prev));
      })
      .catch(() => dispatchPlanning({ type: "PLANNING_FETCH_FAILURE" }));
  };

  useEffect(() => {
    //console.log("PLANNING_EFFECT #1 (app first run)")
    fetchPlanning();
  }, []);

  useEffect(() => {
    if (currentPage === -1) return;
    // Pagine la liste des cours par tranche de 'per_page'
    const item_position = per_page * currentPage;
    setPaginatedPlanning(
      planning.data.slice(item_position, item_position + per_page),
    );
    // console.log(
    //   `PLANNING_PAGINATE data.length: ${planning.data.length} | pages: ${planning.data.length / per_page} | currentPage: ${currentPage} | slice start: ${item_position} | slice end: ${item_position + per_page}`,
    // );
  }, [currentPage, planning.data]);

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
      setCurrentPage(0);
    }
    setCurrentTick(time_to_sleep);
  }, time_to_sleep * 1000);

  useInterval(() => {
    //console.log("Planning Fetching new DATA...");
    fetchPlanning();
  }, reload_data_every * 1000);

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
    <>
      {planning.isLoading && (
        <h1 className="text-center mt-10 text-2xl">Chargement...</h1>
      )}

      <div className="w-full h-screen bg-white justify-center overflow-hidden px-20 py-10">
        <div className="w-full max-w-[3960px] h-full">
          <div className="flex flex-row items-center justify-between pl-4 pr-8 py-4 gap-4">
            <img
              src="/LogoIAE.png"
              alt="Logo"
              className="h-64 w-fit"
            />
            <div className="text-[#122e4c] font-bold text-5xl text-left tracking-widest uppercase">
              Cours du {moment().locale("fr").format("dddd D MMMM YYYY")}
            </div>
          </div>

          <div className="flex flex-row text-5xl items-center justify-between  px-20   w-full  mb-20 mt-50 font-bold text-gray-500 tracking-widest">
            <div className="w-1/6 pr-6">HORAIRES</div>
            <div className="flex-1 px-20 ">FORMATION</div>
            <div className="flex-1 pl-10">INTERVENANT</div>
            <div className="flex-1">SALLE</div>
          </div>

          <ListeCours items={paginatedPlanning} />

        </div>
      </div>
      {currentPage !== -1 && footer}
    </>
  );
};

export default Planning;
