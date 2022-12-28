import UIDUtils from '../utils/common/UIDUtils'

const generateOptions = (colors, sizes) => {
    const result = []
    const colorNumber = colors.length
    const sizeNumber = sizes.length
    for (let i = 0; i < colorNumber; i++) {
        const color = colors[i]
        for (let j = 0; j < sizeNumber; j++) {
            const size = sizes[j]
            const item = {
                id: UIDUtils.generateUID(),
                colorId: color?.id,
                colorName: color?.name,
                sizeId: size?.id,
                sizeName: size?.name
            }
            result.push(item)
        }        
    }
    return result
}

export default {
    generateOptions
}