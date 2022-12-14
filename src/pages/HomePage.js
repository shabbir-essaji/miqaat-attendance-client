import { useState, useEffect } from 'react';
import {
  useNavigate,
  useLoaderData,
  useLocation,
  Link
} from 'react-router-dom';
import Select from 'react-select';
import { ToastContainer, toast, Slide } from 'react-toastify';
import '../css/homepage.css';
import 'react-toastify/dist/ReactToastify.css';

const HomePage = () => {
  const [hofIdObj, setHOFIdObj] = useState({
    hofId: null,
    isValid: false
  });
  const [selectedMiqaat, setSelectedMiqaat] = useState();
  const [miqaatOptions, setMiqaatOptions] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const miqaatResponse = useLoaderData();

  useEffect(() => {
    //if its coming from reload, clear prev state.
    window.history.replaceState({}, document.title);
    if (location?.state?.showError) {
      toast.error('Incorrect HOF ITS ID', {
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        transition: Slide,
        theme: 'light'
      });
    }
  }, []);

  useEffect(() => {
    const miqaatOptions = miqaatResponse.map((miqaat) => {
      return {
        value: miqaat.name,
        label: miqaat.name,
        miqaat
      };
    });
    if (miqaatOptions?.length) {
      setMiqaatOptions(miqaatOptions);
      if (miqaatOptions.length === 1) {
        setSelectedMiqaat(miqaatOptions[0].miqaat);
      }
    }
  }, [miqaatResponse]);

  const onSubmit = (e) => {
    e.preventDefault();
    navigate(
      `/members?miqaatId=${selectedMiqaat.miqaatId}&hofId=${hofIdObj.hofId}`
    );
  };

  const onHOFIdChange = (event) => {
    const ITSRegex = new RegExp('^[0-9]{8,8}$');
    const hofIdObj = { hofId: Number(event.target.value) };
    hofIdObj.isValid = ITSRegex.test(hofIdObj.hofId);
    setHOFIdObj(hofIdObj);
  };

  return (
    <>
      <div className="linkDiv">
        <Link to={'/dashboard'}>DASHBOARD</Link>
      </div>
      <div className="homepage_box">
        {miqaatOptions.length ? (
          <div className="user-box">
            <h1>{selectedMiqaat ? selectedMiqaat.name : 'Select a miqaat'}</h1>
            {selectedMiqaat ? (
              <>
                <input
                  type="number"
                  placeholder="Enter HOF ITS ID"
                  required={true}
                  onChange={onHOFIdChange}
                  onInvalid={(event) =>
                    event.target.setCustomValidity('HOF ITS ID is required')
                  }
                />
                {hofIdObj?.isValid ? (
                  <button
                    type="submit"
                    className={
                      !hofIdObj.isValid
                        ? 'button button-enable'
                        : 'button button-disable'
                    }
                    pattern="[0-9]{0,8}"
                    onClick={onSubmit}
                    disabled={!hofIdObj?.isValid}
                  >
                    Submit
                  </button>
                ) : null}
              </>
            ) : (
              <Select
                options={miqaatOptions}
                placeholder={''}
                onChange={(value) => {
                  setSelectedMiqaat(value.miqaat);
                }}
              />
            )}
          </div>
        ) : (
          <h1>{'No miqaat available'}</h1>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default HomePage;
