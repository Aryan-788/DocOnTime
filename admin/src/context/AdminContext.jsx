import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  //! to fetch all the doctors
  const [doctors, setDoctors] = useState([]);
  const [aToken, setAToken] = useState(
    localStorage.getItem("aToken") ? localStorage.getItem("aToken") : ""
  );

  const [apppointments, setAppointments] = useState([]);

  // const backendUrl = "https://docontime.onrender.com";
  const backendUrl = "http://localhost:4000";

  const getAllDoctors = async () => {
    try {
      const { data } = await axios.get(backendUrl + `/api/admin/all-doctors`, {
        headers: { aToken },
      });
      if (data.success) {
        setDoctors(data.doctors);
        console.log(data.doctors);
      } else {
        toast.error(`Something went wrong!`);
      }
    } catch (error) {
      toast.error(`something went wrong!`);
    }
  };

  //! function to change the doctor availablity
  const changeAvailability = async (docId) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/admin/change-availability',
        { docId },
        { headers: {aToken} }
      );
      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getAllAppointments = async () => {

    try{
      const { data } = await axios.get(backendUrl + '/api/admin/appointments', { headers: { aToken } });

      if(data.success){
        setAppointments(data.appointments);
        console.log(data.appointments);
      }else{
        toast.error(data.message);
      }
    }catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  const value = {
    aToken,
    setAToken,
    backendUrl,
    doctors,
    getAllDoctors,
    changeAvailability,
    apppointments,
    getAllAppointments,
    setAppointments
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};
export default AdminContextProvider;
