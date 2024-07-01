import './index.css';
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from "../../redux/features/user/userSlice";
import { fetchIotDataByUserName } from "../../redux/features/iotData/iotDataSlice";
import NoiseGraphPopup from './NoiseGraphPopup';
import CalibrationPopup from '../Calibration/CalibrationPopup';
import CalibrationExceeded from '../Calibration/CalibrationExceeded';
import { useOutletContext } from 'react-router-dom';

const Noise = () => {
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

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="row page-title-header">
          <div className="col-12">
            <div className="page-header">
              <h4 className="page-title">Noise DASHBOARD</h4>
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
          <div className="col-12 col-md-4 grid-margin">
            <div className="card" onClick={() => handleCardClick({ title: "Limits in DB" })}>
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <h3 className="mb-3">Limits in DB</h3>
                  </div>
                  <div className="col-12 mb-3">
                    <h6><strong className="strong-value">{searchResults.db || 'N/A'}</strong> dB</h6>
                  </div>
                  <div className="col-12"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showPopup && selectedCard && (
          <NoiseGraphPopup
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

export default Noise;
