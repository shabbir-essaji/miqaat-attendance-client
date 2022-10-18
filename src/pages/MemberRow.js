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
    <tr>
      <td>{member.name}</td>
      <td className="switch-field">
        <input
          type="radio"
          id={`attending-${member.its}`}
          value={1}
          checked={option === 1}
          onChange={onRadioChange}
        />
        <label
          htmlFor={`attending-${member.its}`}
          className={option === 1 ? 'attending' : ''}
        >
          ATTENDING
        </label>
        <input
          type="radio"
          id={`tentative-${member.its}`}
          value={-1}
          checked={option === -1}
          onChange={onRadioChange}
        />
        <label
          htmlFor={`tentative-${member.its}`}
          className={option === -1 ? 'tentative' : ''}
        >
          TENTATIVE
        </label>
        <input
          type="radio"
          id={`notAttending-${member.its}`}
          value={0}
          checked={option === 0}
          onChange={onRadioChange}
        />
        <label
          htmlFor={`notAttending-${member.its}`}
          className={option === 0 ? 'notattending' : ''}
        >
          NOT ATTENDING
        </label>
      </td>
    </tr>
  );
};

export default MemberRow;
