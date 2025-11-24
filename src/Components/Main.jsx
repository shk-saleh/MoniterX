import React from 'react'
import Overview from './Overview';
import CPU from './CPU';
import Memory from './Memory';
import Disk from './Disk';
import Network from './Network';
import Processes from './Processes';
import Optimize from './Optimize';

const Main = ({activeTab}) => {


  const renderTab = () =>{
    switch (activeTab) {
      case 'overview':
         return <Overview/>
      case 'cpu':
        return <CPU/>
      case 'memory':
      return <Memory />;
      case 'disk':
        return <Disk/>;
      case 'network':
        return <Network/>;
      case 'processes':
        return <Processes/>;
      case 'optimize':
        return <Optimize/>;
      default:
        break;
    }
  }


  return (
    <div className='w-full h-auto'>

      {/* Dashboard Header  */}

      <div className='sticky top-0 flex justify-between items-center bg-white border-b border-gray-200 p-4'>
        <span>Moniter what's going on! </span>
        <div className='flex relative gap-2'>
          <span class="relative flex items-center">
            <span class="absolute inline-flex size-2 animate-ping rounded-full bg-purple-400 opacity-75"></span>
            <span class="relative inline-flex size-2 rounded-full bg-purple-500"></span>
          </span>
          <span className='text-sm'>Server Connected</span>
        </div>
      </div>
      <div className='bg-(--primary-color)/4 h-auto p-4'>
        {renderTab()}
      </div>
    </div>
  )
}

export default Main