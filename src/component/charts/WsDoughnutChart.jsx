// import React from 'react'
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
// import { Doughnut } from 'react-chartjs-2';
// import ColorService from '../../service/ColorService';

// // ChartJS.register(ArcElement, Tooltip, Legend);

// const WsDoughnutChart = ({ labels, data }) => {

//     const source = {
//         labels: labels,
//         datasets: [
//             {
//                 label: '# of Votes',
//                 data: data,
//                 backgroundColor: ColorService.getColors(data.length),
//                 borderWidth: 1,
//             }
//         ]
//     }

//     return <Doughnut data={source} />

// }

// export default WsDoughnutChart