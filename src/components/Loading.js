import React from 'react'

export default function Loading() {
  return (
    <div className='loader'>
        <img src={require('../assets/svg/loader.svg').default} alt='loading' />
    </div>
  )
}