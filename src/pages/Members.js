import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MemberRow from './MemberRow';
import service from './service';
import '../css/members.css';
import LoadingSpinner from './LoadingSpinner';

const Members = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [membersList, setMembersList] = useState([]);
  const [membersAttendance, setMembersAttendance] = useState();
  const [isMarkAttendanceDisabled, setMarkAttendanceDisabled] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const miqaatId = searchParams.get('miqaatId');
    const hofId = searchParams.get('hofId');

    if (miqaatId && hofId) {
      setIsLoading(true);
      service.getMembersList(hofId, miqaatId).then((membersList) => {
        if (membersList?.length) {
          const attendance = {};
          membersList.forEach((member) => {
            if (
              member.response !== null &&
              member.response !== undefined &&
              !isNaN(member.response)
            ) {
              attendance[member.its] = member.response;
            }
          });
          setMembersAttendance(attendance);
          setMembersList(membersList);
          setIsLoading(false);
        } else {
          navigate('/', {
            state: {
              showError: true
            }
          });
        }
      });
    } else {
      navigate('/', {
        state: {
          showError: true
        }
      });
    }
  }, []);

  useEffect(() => {
    if (membersAttendance && membersList) {
      setMarkAttendanceDisabled(
        membersList.length !== Object.keys(membersAttendance).length
      );
    } else {
      setMarkAttendanceDisabled(true);
    }
  }, [membersList, membersAttendance]);

  const markAttendance = () => {
    const miqaatId = searchParams.get('miqaatId');

    const attendancePayload = {
      miqaatId,
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
        navigate(`/dashboard?miqaatId=${miqaatId}`);
      } else {
        navigate('/');
      }
    });
  };

  return isLoading ? (
    <LoadingSpinner />
  ) : (
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
                key={member.its}
                member={member}
                setMembersAttendance={setMembersAttendance}
              />
            );
          })}
        </tbody>
      </table>
      <div className="mark-button">
        <button
          disabled={isMarkAttendanceDisabled}
          onClick={() => {
            !isMarkAttendanceDisabled && markAttendance();
          }}
        >
          {'Mark attendance'}
        </button>
      </div>
    </div>
  );
};
export default Members;
