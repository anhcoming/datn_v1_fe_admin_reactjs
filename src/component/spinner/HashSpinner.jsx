import React from 'react'
import HashLoader from 'react-spinners/HashLoader'

const HashSpinner = () => {
  return (
      <HashLoader
        color={`#7b92db`}
        loading={true}
        size={40}
      style={{
        textAlign: 'center',
        display: 'block',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100vh'
      }}
      ></HashLoader>
  )
}

export default HashSpinner