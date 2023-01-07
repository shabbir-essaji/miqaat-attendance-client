import { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import LoadingSpinner from './LoadingSpinner';
import service from './service';

const Dashboard = () => {
  const [miqaatName, setMiqaatName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const miqaatId = searchParams?.get('miqaatId');
    if (miqaatId) {
      setIsLoading(true);
      service
        .getDashboard(miqaatId)
        .then((response) => {
          setMiqaatName(response.miqaatName);
          const pieData = [];
          if (response.attending.length) {
            pieData.push({
              name: 'Attending',
              value: response.attending.length,
              color: 'green'
            });
          }
          if (response.notAttending.length) {
            pieData.push({
              name: 'Not Attending',
              value: response.notAttending.length,
              color: 'red'
            });
          }
          if (response.tentative.length) {
            pieData.push({
              name: 'Tentative',
              value: response.tentative.length,
              color: 'yellow'
            });
          }
          setData(pieData);
        })
        .finally(() => setIsLoading(false));
    }
  }, []);

  const RADIAN = Math.PI / 180;
  const renderValue = (argu) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, payload } = argu;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {payload.value}
      </text>
    );
  };

  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <>
      <h2>{miqaatName}</h2>
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          labelLine={false}
          label={renderValue}
          dataKey="value"
          legendType="circle"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Legend
          formatter={(value) => <span style={{ color: 'black' }}>{value}</span>}
        />
      </PieChart>
    </>
  );
};

export default Dashboard;
