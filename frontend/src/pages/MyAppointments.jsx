import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios';
import { toast } from 'react-toastify';

const MyAppointments = () => {
  const {backendUrl,token, getDoctorsData} = useContext(AppContext);
  const [appointments,setAppointments] = useState([]);
  
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const slotDateFormat = (slotDate)=>{
    const dateArray = slotDate.split('_');
    return dateArray[0]+" " + months[Number(dateArray[1])-1] + " " + dateArray[2]
  }

  const getUserAppointments = async()=>{
    try {
      const {data} = await axios.get(backendUrl + '/api/user/appointments',{headers:{token}})
      if(data.success){
        setAppointments(data.appointments.reverse());
        console.log(data.appointments); 

      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  const cancelAppointment = async(appointmentId)=>{
    try {
      const {data} = await axios.post(backendUrl + '/api/user/cancel-appointment',{appointmentId},{headers:{token}})

      if(data.success){
        toast.success(data.message);
        getUserAppointments();
        getDoctorsData();
      }else{
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  //! function for making the payments
  // const appointmentRazorpay = async(appointmentId)=>{
  //   try {
  //     //!11:50
  //   } catch (error) {
      
  //   }
  // }
  const appointmentRazorpay = async(appointmentId) => {
    try {
      // Get order details from backend
      const { data } = await axios.post(
        `${backendUrl}/api/user/payment`, 
        { appointmentId }, 
        { headers: { token } }
      );

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      // Configure Razorpay payment options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Doctor On Time",
        description: "Doctor Appointment Payment",
        order_id: data.order.id,
        handler: async (response) => {
          try {
            // Add payment verification API call here if needed
            const verifyData = await axios.post(
              `${backendUrl}/api/user/verify-payment`,
              {
                appointmentId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              },
              { headers: { token } }
            );

            if (verifyData.data.success) {
              toast.success("Payment Successful!");
              await getUserAppointments();
            }
          } catch (error) {
            console.log(error);
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          email: "",
          contact: ""
        },
        theme: {
          color: "#3399cc"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Payment initialization failed");
    }
  };

  useEffect(()=>{
    if(token){
      getUserAppointments();
    }
  },[token])
  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointments</p>
      <div>
        {
          appointments.map((item,index)=>(
            <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
              <div>
              <img className='w-32 bg-gradient-to-bl from-white to-sky-200 rounded-md shadow-md outline-none border-none' src={item.docData.image} alt="" />
              </div>
              <div className='flex-1 text-sm text-zinc-600'>
                <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
                <p>{item.docData.speciality}</p>
                <p className='text-zinc-700 font-medium mt-1'>Address:</p>
                <p className='text-xs'>{item.docData.address.line1}</p>
                <p className='text-xs'>{item.docData.address.line2}</p>
                <p className='text-xs mt-1'><span className='text-sm text-neutral-700 font-medium'>DATE & Time: </span>{slotDateFormat(item.slotDate)} | {item.slotTime}</p>
              </div>
              <div></div>
              <div className='flex flex-col gap-4 justify-end'>
                {!item.cancelled && <button onClick={()=>{appointmentRazorpay(item._id)}} className='text-sm text-stone-500 text-center sm:min-w-48 py-2  border rounded-full hover:bg-primary hover:outline-none hover:border-none hover:text-white hover:shadow-md hover:translate-y-[-5px] transition-all duration-500 '>Pay online</button>}
               {!item.cancelled && <button onClick={()=>cancelAppointment(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded-full hover:bg-red-600 hover:outline-none hover:border-none hover:text-white hover:shadow-md hover:translate-y-[-5px] transition-all duration-500 '>Cancel Appointment</button> } 
               {item.cancelled && <button className=' text-sm text-sky-900 text-center font-medium sm:min-w-48 py-2 border '>Appointment Cancelled</button>}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default MyAppointments
