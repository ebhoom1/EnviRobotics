import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from "../../redux/features/user/userSlice";
import { fetchIotDataByUserName } from "../../redux/features/iotData/iotDataSlice";
import AirGraphPopup from "./AirGraphPopup";
import './index.css';
import CalibrationPopup from "../Calibration/CalibrationPopup";
import CalibrationExceeded from '../Calibration/CalibrationExceeded';
import { useOutletContext } from 'react-router-dom';

const AmbientAir = () => {
  const dispatch = useDispatch();
  const { userData, userType } = useSelector((state) => state.user);
  const { latestData, userIotData } = useSelector((state) => state.iotData);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showCalibrationPopup, setShowCalibrationPopup] = useState(false);
  const { searchResults, submittedSearchTerm } = useOutletContext();

  const validateUser = async () => {
    const response = await dispatch(fetchUser()).unwrap();
  };

  if (!userData) {
    validateUser();
  }

  useEffect(() => {
    if (userData) {
      if (userType === 'user') {
        dispatch(fetchIotDataByUserName(userData.validUserOne.userName));
      }
    }
  }, [userData, userType, dispatch]);

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedCard(null);
  };

  const handleOpenCalibrationPopup = () => {
    setShowCalibrationPopup(true);
  };

  const handleCloseCalibrationPopup = () => {
    setShowCalibrationPopup(false);
  };

  const air = [
    { parameter: "PM 10", value: 'µg/m³', name: "PM10" },
    { parameter: "PM 2.5", value: 'µg/m³', name: "PM25" },
    { parameter: "NOH", value: 'µg/m³', name: "NOH" },
    { parameter: "NH3", value: 'µg/m³', name: "NH3" },
    { parameter: "Windspeed", value: 'm/s', name: "Windspeed" },
    { parameter: "Wind Dir", value: 'deg', name: "WindDir" },
    { parameter: "Temperature", value: '℃', name: "AirTemperature" },
    { parameter: "Humidity", value: '%', name: "Humidity" },
    { parameter: "Solar Radiation", value: 'w/m²', name: "solarRadiation" }
  ];

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="row page-title-header">
          <div className="col-12">
            <div className="page-header">
              <h4 className="page-title">Ambient Air DASHBOARD</h4>
              <p></p>
              <div className="quick-link-wrapper w-100 d-md-flex flex-md-wrap">
                <ul className="quick-links ml-auto">
                  {userData?.validUserOne && userData.validUserOne.userType === 'user' && (
                    <h5>Data Interval: <span className="span-class">{userData.validUserOne.dataInteval}</span></h5>
                  )}
                </ul>
                <ul className="quick-links ml-auto">
                  {latestData && (
                    <>
                      <h5>Analyser Health : </h5>
                      {userIotData.validationStatus ? (
                        <h5 style={{ color: "green" }}>Good</h5>
                      ) : (
                        <h5 style={{ color: "red" }}>Problem</h5>
                      )}
                    </>
                  )}
                </ul>
                {userData?.validUserOne && userData.validUserOne.userType === 'user' && (
                  <ul className="quick-links ml-auto">
                    <button type="submit" onClick={handleOpenCalibrationPopup} className="btn btn-primary mb-2 mt-2"> Calibration </button>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="p-2"></div>
        <div className="p-2"></div>
        <div className="row">
          {air.map((item, index) => (
            <div className="col-12 col-md-4 grid-margin" key={index}>
              <div className="card" onClick={() => handleCardClick({ title: item.parameter })}>
                <div className="card-body">
                  <div className="row">
                    <div className="col-12">
                      <h3 className="mb-3">{item.parameter}</h3>
                    </div>
                    <div className="col-12 mb-3">
                      <h6><strong className="strong-value">{searchResults[item.name] || 'N/A'}</strong> {item.value}</h6>
                    </div>
                    <div className="col-12">
                      <h5 className="text-dark">Average</h5>
                      <p className="mb-0">Last Week: {item.week}</p>
                      <p>Last Month: {item.month}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showPopup && selectedCard && (
          <AirGraphPopup
            isOpen={showPopup}
            onRequestClose={handleClosePopup}
            parameter={selectedCard.title}
            userName={submittedSearchTerm || userData?.validUserOne?.userName}
          />
        )}

        {showCalibrationPopup && (
          <CalibrationPopup
            onClose={handleCloseCalibrationPopup}
          />
        )}
      </div>

      <CalibrationExceeded />

      <footer className="footer">
        <div className="container-fluid clearfix">
          <span className="text-muted d-block text-center text-sm-left d-sm-inline-block">
            Ebhoom Control and Monitor System
          </span>
          <span className="float-none float-sm-right d-block mt-1 mt-sm-0 text-center">
            ©
            <a href="" target="_blank">
            EnviRobotics
            </a>
            2023
          </span>
        </div>
      </footer>
    </div>
  );
};

export default AmbientAir;
