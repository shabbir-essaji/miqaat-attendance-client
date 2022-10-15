import { useState, useEffect } from 'react';
import { useNavigate, useLoaderData } from 'react-router-dom';
import Select from 'react-select';
import service from './service';

const HomePage = () => {
  const [hofId, setHOFId] = useState();
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
  }, [miqaatResponse]);

  const onSubmit = (e) => {
    e.preventDefault();
    service
      .getMembersList(hofId, selectedMiqaat.miqaatId)
      .then((membersList) => {
        if (membersList?.length) {
          navigate('/members', {
            state: {
              membersList,
              miqaatId: selectedMiqaat.miqaatId
            }
          });
        } else {
          console.log('Incorrect HOF');
        }
      });
  };
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      {selectedMiqaat && <h1>{selectedMiqaat.name}</h1>}
      <input
        type="number"
        placeholder="Enter HOF ITS ID"
        maxLength={8}
        pattern={'[0-9]{0,8}'}
        required={true}
        onChange={(event) => setHOFId(Number(event.target.value))}
      />
      <Select
        options={miqaatOptions}
        placeholder={'Select Miqaat'}
        onChange={(value) => {
          setSelectedMiqaat(value.miqaat);
        }}
      />
      <button
        type="submit"
        onClick={onSubmit}
        disabled={!hofId || !selectedMiqaat}
      >
        {`Submit`}
      </button>
    </div>
  );
};

export default HomePage;
