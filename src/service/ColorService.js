const COLORS =[
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)',
  ]

const getColors = size => {
    var list = []
    const colorsSize = COLORS.length
    for (let i = 0; i < size; i++) {
        list.push(COLORS[generateRandomNumberWithRange(0, colorsSize)])
    }
    return list
}

const getColor = () => {
    return COLORS[generateRandomNumberWithRange(0, COLORS.length)]
}

const generateRandomNumberWithRange = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export default {
    getColors,
    getColor,
}