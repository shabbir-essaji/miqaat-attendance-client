import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MemberRow from './MemberRow';
import service from './service';
import '../css/members.css';

const Members = () => {
  const [membersList, setMembersList] = useState([]);
  const [membersAttendance, setMembersAttendance] = useState();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state && location.state.membersList?.length) {
      const attendance = {};
      location.state.membersList.forEach((member) => {
        if (member.response) {
          attendance[member.its] = member.response;
        }
      });
      setMembersAttendance(attendance);
      setMembersList(location.state.membersList);
    } else {
      navigate('/');
    }
  }, []);

  const markAttendance = () => {
    const attendancePayload = {
      miqaatId: location.state.miqaatId,
      attending: [],
      notAttending: [],
      tentative: []
    };
    Object.entries(membersAttendance).forEach(([its, option]) => {
      switch (option) {
        case 1:
          attendancePayload.attending.push(its);
          break;
        case 0:
          attendancePayload.notAttending.push(its);
          break;
        case -1:
          attendancePayload.tentative.push(its);
          break;
        default:
      }
    });
    service.markAttendance(attendancePayload).then((value) => {
      if (value) {
        navigate('/dashboard', {
          state: {
            miqaatId: location.state.miqaatId
          }
        });
      } else {
        navigate('/');
      }
    });
  };

  return (
    <div className="members">
      <table className="memberTable">
        <thead>
          <tr>
            <th>NAME</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {membersList.map((member) => {
            return (
              <MemberRow
                member={member}
                setMembersAttendance={setMembersAttendance}
              />
            );
          })}
        </tbody>
      </table>
      <div class="mark-button">
        <button onClick={markAttendance}>{'Mark attendance'}</button>
      </div>
    </div>
  );
};
export default Members;
