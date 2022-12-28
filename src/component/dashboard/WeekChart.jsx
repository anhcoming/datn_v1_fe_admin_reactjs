// import React from 'react'
// import { Line } from 'react-chartjs-2'
// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Title,
//     Tooltip,
//     Legend,
// } from 'chart.js';

// ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Title,
//     Tooltip,
//     Legend
// );

// export const options = {
//     responsive: true,
//     plugins: {
//         legend: {
//             position: 'bottom',
//         },
//         // title: {
//         //     display: true,
//         //     text: 'Chart.js Line Chart',
//         // },
//     },
// };

// const labels = ['Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy', 'Chủ nhật'];

// const WeekChart = ({thisWeek, lastWeek}) => {

//     const data = {
//         labels,
//         datasets: [
//             {
//                 label: 'Tuần trước',
//                 data: lastWeek && lastWeek.map(obj => obj.total),
//                 borderColor: '#36b9cc',
//                 // backgroundColor: 'rgba(255, 99, 132, 0.5)',
//             },
//             {
//                 label: 'Tuần này',
//                 data: thisWeek && thisWeek.map(obj => obj.total),
//                 borderColor: '#4e73df',
//                 // backgroundColor: 'rgba(53, 162, 235, 0.5)',
//             },
//         ],
//     };
//     return (
//         <Line data={data} options={options} />
//     )
// }

// export default WeekChart