import React, { useState } from 'react'
import Sidebar from '../Components/Sidebar.jsx'
import Main from '../Components/Main.jsx'

const Dashboard = () => {

  const [activeTab, setactiveTab] = useState('overview');

  return (
    <div className='w-full flex bg-white min-h-screen'>
        <Sidebar activeTab={activeTab} setactiveTab={setactiveTab}/>
        <Main activeTab={activeTab} />
    </div>
  )
}

export default Dashboard