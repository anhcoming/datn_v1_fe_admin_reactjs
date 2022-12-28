// import React from 'react'
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
// import { Line } from 'react-chartjs-2';
// import ColorService from '../../service/ColorService';

// ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Title,
//     Tooltip,
//     Legend
// );


// const WsLineChart = ({title, label, labels, data}) => {

//     const color = ColorService.getColor();

//     const source = {
//         labels: labels,
//         datasets: [
//             {
//                 label: label,
//                 data: data,
//                 borderColor: color,
//                 backgroundColor: color,
//             }
//         ],
//     };

//     const options = {
//         responsive: true,
//         plugins: {
//             legend: {
//                 position: 'bottom',
//             },
//             title: {
//                 display: true,
//                 text: title,
//             },
//         },
//     };
    

//     return <Line options={options} data={source} />;

// }

// export default WsLineChart