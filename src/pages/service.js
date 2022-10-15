const url = 'https://miqaat-attendance-service.herokuapp.com';
const JSON_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
};
const getMembersList = async (hofId, miqaatId) => {
  const membersResponse = await fetch(
    `${url}/${hofId}/members?miqaatId=${miqaatId}`
  );
  return await membersResponse.json();
};

const getMiqaats = async () => {
  try {
    const miqaatResponse = await fetch(`${url}/miqaat`);
    return await miqaatResponse.json();
  } catch (err) {
    return console.log(err);
  }
};

const markAttendance = async (payload) => {
  const response = await fetch(`${url}/markAttendance`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: JSON_HEADERS
  });
  return await response.json();
};

const getDashboard = async (miqaatId) => {
  const response = await fetch(`${url}/dashboard?miqaatId=${miqaatId}`);
  return await response.json();
};

const serviceObj = {
  getDashboard,
  getMiqaats,
  getMembersList,
  markAttendance
};
export default serviceObj;
