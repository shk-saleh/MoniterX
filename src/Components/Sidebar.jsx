import React, { use, useState } from 'react'
import {PanelRightOpen, ChartBar, Cpu, MemoryStick, HardDrive, Network, Logs, PanelLeftClose, PanelLeftOpen} from 'lucide-react';

const Sidebar = ({activeTab, setactiveTab}) => {

  const [sidebar, setSidebar] = useState(true);

  const tabs = [
    {id: 'overview', name: 'Overview', icon: <ChartBar className='w-5 h-5 text-(--primary-color)/70'/>},
    {id: 'cpu', name: 'CPU', icon: <Cpu  className='w-5 h-5 text-(--primary-color)/70'/>},
    {id: 'memory', name: 'Memory', icon: <MemoryStick className='w-5 h-5 text-(--primary-color)/70' />},
    {id: 'disk', name: 'Disk', icon: <HardDrive  className='w-5 h-5 text-(--primary-color)/70'/>},
    {id: 'network', name: 'Network', icon: <Network  className='w-5 h-5 text-(--primary-color)/70'/>},
    {id: 'processes', name: 'Processes', icon: <Logs  className='w-5 h-5 text-(--primary-color)/70'/>},
  ];

  return (
    <div className={`sticky top-0 flex flex-col gap-10 items-center h-screen transition-all duration-300 border-r border-gray-200 ${ sidebar? 'w-84 py-4 px-4' : 'w-16 py-4 px-3' }`}>
      <div className={`w-full flex ${ sidebar? 'justify-between' : 'justify-center' }  items-center  border-b border-gray-200 pb-4`}>
        {sidebar ? <h1 className='text-xl font-medium'>Moniter<span className='text-(--primary-color) font-bold'>X</span></h1> : ''}
        {sidebar ? <PanelRightOpen onClick={()=> setSidebar(false)} className='w-6 h-6 text-gray-600 cursor-e-resize transform-all duration-200' /> : <PanelLeftOpen onClick={()=> setSidebar(true)} className='w-6 h-6 text-gray-600 cursor-e-resize transform-all duration-200' /> } 
      </div>
      <div className='w-full flex flex-col items-start gap-2'>
        {
          tabs.map((tab, i) => (
            <button key={i} onClick={() => setactiveTab(tab.id)} className={`w-full flex gap-2.5 items-center ${ sidebar ? 'justify-start' : 'justify-center' } ${ tab.id === activeTab ? 'bg-(--primary-color)/10' : 'bg-transparent' } transition-all duration-200 p-2 rounded-sm cursor-pointer`}>
              {tab.icon}
              { sidebar ? 
              <span className='text-md font-medium text-gray-700'>{tab.name}</span> 
              : '' }
            </button>
          )) 
        }
      </div>
      {
        sidebar ? 
          <div className='absolute bottom-2 text-sm text-gray-400'>
            <span>v.1.0 | </span>
            <span>About</span>
          </div>
         : ''
      }
      
    </div>
  )
}

export default Sidebar