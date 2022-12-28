// import React from 'react'
// import { Doughnut } from 'react-chartjs-2'
// import {
//     Chart as ChartJS,
//     ArcElement,
//     Tooltip,
//     Legend,
// } from 'chart.js';

// ChartJS.register(ArcElement, Tooltip, Legend);


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

// const CategoryChart = ({categories}) => {

//     console.log("CategoryChart categories: ", categories)

//     const data = {
//         labels: categories && categories.map(o => (o.name)),
//         datasets: [
//           {
//             label: '# of Votes',
//             data: categories && categories.map(o => (o.revenue)),
//             backgroundColor: [
//               'rgba(255, 99, 132, 0.2)',
//               'rgba(54, 162, 235, 0.2)',
//               'rgba(255, 206, 86, 0.2)',
//             //   'rgba(75, 192, 192, 0.2)',
//             //   'rgba(153, 102, 255, 0.2)',
//             //   'rgba(255, 159, 64, 0.2)',
//             ],
//             borderColor: [
//               'rgba(255, 99, 132, 1)',
//               'rgba(54, 162, 235, 1)',
//               'rgba(255, 206, 86, 1)',
//             //   'rgba(75, 192, 192, 1)',
//             //   'rgba(153, 102, 255, 1)',
//             //   'rgba(255, 159, 64, 1)',
//             ],
//             borderWidth: 1,
//           },
//         ],
//       }

//       return (
//         <>{categories && <Doughnut data={data} options={options} />}</>   
//     )
// }

// export default CategoryChart