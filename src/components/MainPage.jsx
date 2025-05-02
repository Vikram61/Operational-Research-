import React from 'react'
import { Link } from 'react-router-dom'

const MainPage = () => {


  return (
<div>
<div className="home-container">
      <h1 className="home-heading">Linear Programming Problem</h1>
        <div className="link-boxes">
          <Link to='lpp' className='link-box'>LPP</Link>
          <Link to='bigm' className='link-box'>Big-M Method</Link>
          <Link to='/' className='link-box'>Duality Principle</Link>
          <Link to='/' className='link-box'>Two Phase Method</Link>
        </div>
        <br/>
        <h1 className="home-heading">Job Sequencing Problem</h1>
        <div className="link-boxes">
          <Link to='job' className='link-box'>Job Seq</Link>
        </div>
      </div>
    </div>
  )
}

export default MainPage
