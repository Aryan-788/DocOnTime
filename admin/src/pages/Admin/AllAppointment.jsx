
import React from 'react'
import { useContext, useEffect } from 'react'
import { AppContext } from '../../context/AppContext'
import { AdminContext } from '../../context/AdminContext'


function AllAppointment() {

  const {aToken, appointments, getAllAppointments} = useContext(AdminContext)
  const {calculateAge} = useContext(AppContext)

  useEffect(() => {
    if(aToken){
      getAllAppointments()
    }
  }, [aToken])
  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>
      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>

        </div>

        {/* {appointments.map((item, index)=>(
          <div className='flex flex-wrap justify-between max-sm:gap-2 sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={index}>
            <p>{index + 1}</p>
            <div>
              <img src={item.userData.image} alt="" />
              <p>{item.userData.name}</p>
            </div>
          </div>
        ))} */}

         {appointments && appointments.length > 0 ? (
          appointments.map((item, index) => (
            <div className='flex flex-wrap justify-between max-sm:gap-2 sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={index}>
              <p className='max-sm:hidden'>{index + 1}</p>
              <div className='flex items-center gap-2'>
                <img className='w-8 rounded-full' src={item.userData?.image} alt="" /> <p>{item.userData?.name}</p>
              </div>
              <p className='max-sm:hidden'>{calculateAge(item.userData?.dob)}</p>
              <p>{item.slotDate},{item.slotTime}</p>
            </div>
          ))
        ) : (
          <div  className="text-center py-4 text-gray-500">
            No appointments found
          </div>
        )}


      </div>
    </div>
  )
}

export default AllAppointment
