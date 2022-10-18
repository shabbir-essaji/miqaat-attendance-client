import { useState } from 'react';
import '../css/memberRow.css';

const MemberRow = ({ member, setMembersAttendance }) => {
  const [option, setOption] = useState(member.response);

  const onRadioChange = (e) => {
    let selected;
    switch (e.target.value) {
      case '1':
        selected = 1;
        break;
      case '-1':
        selected = -1;
        break;
      case '0':
        selected = 0;
        break;
      default:
        selected = null;
    }
    if (!isNaN(selected)) {
      setMembersAttendance((prevState) => {
        return { ...prevState, [member.its]: selected };
      });
      setOption(selected);
    }
  };
  return (
    <div className="switch-field">
      <input
        type="radio"
        id="attending"
        value={1}
        checked={option === 1}
        onChange={onRadioChange}
      />
      <label htmlFor="attending" className={option === 1 ? 'attending' : ''}>
        ATTENDING
      </label>
      <input
        type="radio"
        id="tentative"
        value={-1}
        checked={option === -1}
        onChange={onRadioChange}
      />
      <label htmlFor="tentative" className={option === -1 ? 'tentative' : ''}>
        TENTATIVE
      </label>
      <input
        type="radio"
        id="notAttending"
        value={0}
        checked={option === 0}
        onChange={onRadioChange}
      />
      <label
        htmlFor="notAttending"
        className={option === 0 ? 'notattending' : ''}
      >
        NOT ATTENDING
      </label>
    </div>
  );
};

export default MemberRow;
