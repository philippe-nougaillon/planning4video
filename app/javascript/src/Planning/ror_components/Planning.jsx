import React, { useState, useReducer, useRef, useEffect } from "react";
import ListeCours from "./Liste_Cours";
import moment from "moment";
import "moment/locale/fr";

const API_ENDPOINT = "https://planning.iae-paris.com/api/v4/cours";
//const API_ENDPOINT = "https://planning-iae-staging-e617fc28ec21.herokuapp.com/api/v4/cours"
//const API_ENDPOINT = "http://100.115.92.199:4000/api/v4/cours"

const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => savedCallback.current();
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

const Planning = () => {
  const per_page = 4; // nombre de lignes par page
  const time_to_sleep = 10; // pause entre deux pages (en secondes)
  const reload_data_every = 60; // recharger les données chaque minute

  const [currentPage, setCurrentPage] = useState(-1);
  const [currentTick, setCurrentTick] = useState(time_to_sleep);
  const [paginatedPlanning, setPaginatedPlanning] = useState([]);

  const [isTransitioning, setIsTransitioning] = useState(false);

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
          totalPages: Math.max(
            0,
            Math.ceil(action.payload.length / per_page) - 1,
          ),
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
  }, [currentPage, planning.data]);

  //  countdown
  useInterval(() => {
    setCurrentTick((prev) => (prev > 0 ? prev - 1 : 0));
  }, 1000);

  //  changement de page (corrigé + stable)
  useInterval(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    setCurrentPage((prev) => {
      const total = planning.totalPages || 0;
      if (total === 0) return 0;
      return prev >= total ? 0 : prev + 1;
    });

    setCurrentTick(time_to_sleep);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  }, time_to_sleep * 1000);

  // 🔄 reload data (stable)
  useInterval(() => {
    fetchPlanning();
  }, reload_data_every * 1000);

  //  reload total (sécurisé pour EC Video)
  useInterval(
    () => {
      if (document.visibilityState === "visible") {
        window.location.reload();
      }
    },
    10 * 60 * 1000,
  );

  const footer = (
    <div className="flex flex-row gap-10 p-6 text-4xl text-[#122e4c] font-semibold ">
      <div>
        <h4>
          <div className="progress">
            <div
              className="progress-bar bg-warning"
              style={{
                opacity: 0.8,
                width: (currentTick - 1) * 10 + "%",
              }}
            ></div>
          </div>
        </h4>
      </div>

      <div>
        <h4>{`Page : ${currentPage + 1} sur ${planning.totalPages + 1}`}</h4>
      </div>
    </div>
  );

  return (
    <>
      {planning.isLoading && (
        <h1 className="text-center mt-10 text-2xl">Chargement...</h1>
      )}

      <div className="w-screen h-screen bg-white flex flex-col overflow-hidden px-10 border-gradient">
        
        <div className="flex items-center justify-between px-8 py-4">
          <img src="/LogoIAE.png" alt="Logo" className="h-48 w-fit" />
          <div className="text-[#122e4c] font-bold text-5xl tracking-widest uppercase">
           {moment().locale("fr").format("dddd D MMMM YYYY HH:mm")}
          </div>
        </div>

        <div className="flex flex-row text-5xl items-center justify-between px-20 w-full mb-20 mt-20 font-bold text-gray-500 tracking-widest">
          <div className="w-1/6 pr-6">HORAIRES</div>
          <div className="w-1/2 mx-16">FORMATION</div>
          <div className="w-1/5 mx-10">INTERVENANT</div>
          <div className="w-1/6">SALLE</div>
        </div>

        <ListeCours items={paginatedPlanning} />

        {currentPage !== -1 && footer}
        
      </div>
    </>
  );
};

export default Planning;
