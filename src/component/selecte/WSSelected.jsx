import React from 'react'
import { MultiSelect } from 'react-multi-select-component'

const WSSelected = ({ options, selected, setSelected, }) => {
    return (
        <MultiSelect
            className=''
            options={options}
            value={selected}
            onChange={setSelected}
            overrideStrings={{
                "allItemsAreSelected": "Đã chọn tất cả.",
                "selectAll": "Chọn tất cả",
                "search": "Tìm kiếm",
                "selectAllFiltered": "Tìm kiếm (Lọc)",
                "selectSomeItems": "Chọn...",
            }}
            defaultValue={selected}
        />
    )
}

export default WSSelected