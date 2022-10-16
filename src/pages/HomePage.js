import { useState, useEffect } from 'react';
import { useNavigate, useLoaderData } from 'react-router-dom';
import Select from 'react-select';
import { ToastContainer, toast, Slide } from 'react-toastify';
import service from './service';
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
  const miqaatResponse = useLoaderData();

  useEffect(() => {
    const miqaatOptions = miqaatResponse.map((miqaat) => {
      return {
        value: miqaat.name,
        label: miqaat.name,
        miqaat
      };
    });
    setMiqaatOptions(miqaatOptions);
    if (miqaatOptions.length === 1) {
      setSelectedMiqaat(miqaatOptions[0].miqaat);
    }
  }, [miqaatResponse]);

  const onSubmit = (e) => {
    e.preventDefault();
    service
      .getMembersList(hofIdObj.hofId, selectedMiqaat.miqaatId)
      .then((membersList) => {
        if (membersList?.length) {
          navigate('/members', {
            state: {
              membersList,
              miqaatId: selectedMiqaat.miqaatId
            }
          });
        } else {
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
      });
  };

  const onHOFIdChange = (event) => {
    const ITSRegex = new RegExp('^[0-9]{8,8}$');
    const hofIdObj = { hofId: Number(event.target.value) };
    hofIdObj.isValid = ITSRegex.test(hofIdObj.hofId);
    setHOFIdObj(hofIdObj);
  };

  return (
    <>
      <div className="homepage">
        <h1>{selectedMiqaat ? selectedMiqaat.name : 'Select a miqaat'}</h1>
        <div className="user-box">
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
      </div>
      <ToastContainer />
    </>
  );
};

export default HomePage;
