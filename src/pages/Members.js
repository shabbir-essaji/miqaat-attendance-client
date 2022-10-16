import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MemberRow from './MemberRow';
import service from './service';
import DataTable, { createTheme } from 'react-data-table-component';
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
  }, [location]);

  const columns = [
    {
      name: 'ITS',
      selector: (row) => row.its
    },
    {
      name: 'Name',
      selector: (row) => row.name
    },
    {
      name: 'Action',
      cell: (member) => {
        return (
          <MemberRow
            member={member}
            setMembersAttendance={setMembersAttendance}
          />
        );
      }
    }
  ];

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

  createTheme('dark', {
    background: {
      default: 'transparent'
    }
  });

  return (
    <div className="members">
      <DataTable
        title={'Members'}
        columns={columns}
        data={membersList}
        theme="dark"
      />
      {/* <table>
        <thead>
          <tr>
            <th>ITS</th>
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
      </table> */}
      <button onClick={markAttendance}>{'Mark attendance'}</button>
    </div>
  );
};
export default Members;
