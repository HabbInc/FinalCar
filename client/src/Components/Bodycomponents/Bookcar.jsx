import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../Context/Clientcontext';
import audi from "../images/audi.jpg";
import benz from "../images/benz.jpg";
import bmw from "../images/bmw.jpg";
import golf from "../images/golf.jpg";
import passat from "../images/passat.jpg";
import toyota from "../images/toyota.jpg";

export default function Bookcar({
  isDivVisible,
  setDivVisible,
  carType,
  pickPlace,
  dropPlace,
  pickDate,
  dropDate,
}) {
  const { user } = useContext(UserContext);
  const [pickTime, setPickTime] = useState('');
  const [dropTime, setDropTime] = useState('');
  const [selectedImage, setSelectedimage] = useState();
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [showWarning, setShowwarning] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const isReserveDisabled = !pickTime || !dropTime || !firstname || !lastname || !age || !phone || !email || !address || !city || !zipcode;

  const Cars = [
    { name: "Audi A1 S-Line", image: audi },
    { name: "VW Golf 6", image: golf },
    { name: "Toyota Camry", image: toyota },
    { name: "BMW 320 ModernLine", image: bmw },
    { name: "Mercedes-Benz GLK", image: benz },
    { name: "VW Passat CC", image: passat },
  ];

  useEffect(() => {
    const selectedCar = Cars.find(car => car.name === carType);
    if (selectedCar) setSelectedimage(selectedCar.image);
  }, [carType]);

  const ReserveCar = async () => {
    if (isReserveDisabled) {
      setShowwarning(true);
      setTimeout(() => setShowwarning(false), 1500);
      return;
    }

    if (!user) {
      navigate('/login');
      return;
    }

    const reservationData = {
      carType,
      pickPlace,
      dropPlace,
      pickDate,
      dropDate,
      pickTime,
      dropTime,
      firstname,
      lastname,
      age,
      phone,
      email,
      address,
      city,
      zipcode,
    };

    try {
      await axios.post('http://localhost:5000/api/reservation', reservationData);

      const formData = new FormData();
      formData.append("access_key", "b317a408-bb69-40fb-85ad-3fd77039046b");
      formData.append("subject", "New Car Reservation");
      for (const key in reservationData) {
        formData.append(key, reservationData[key]);
      }

      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      setSuccessMessage("Reservation successful! Redirecting to bookings...");
      setTimeout(() => {
        setSuccessMessage("");
        navigate('/account/bookings');
      }, 2000);

    } catch (error) {
      console.error("Reservation failed:", error);
    }
  };

  return (
    isDivVisible && (
      <div className="container border-4 border-white shadow-2xl overflow-x-hidden mx-auto bg-white absolute z-50 w-3/5 flex flex-col justify-center items-center" style={{ top: '170%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <div className="flex justify-between px-4 py-2 bg-orange w-full">
          <h2 className="font-bold font-sans text-3xl text-white">COMPLETE RESERVATION</h2>
          <CloseIcon onClick={() => setDivVisible(false)} className="text-white cursor-pointer" />
        </div>

        <div className="bg-[#ffeae6] py-4 px-4 w-full">
          <h2 className="font-bold text-2xl py-2 text-orange">Upon completing this reservation enquiry, you will receive:</h2>
          <p className="text-[#777]">Your rental voucher to produce on arrival at the rental desk and a toll-free customer support number.</p>
        </div>

        <div className="grid lg:grid-cols-2 w-full border-b">
          <div className="py-4 px-4">
            <h2 className="text-orange font-bold text-xl">Location & Date</h2>
            <div className="py-2">
              <h3 className="font-bold text-lg"><CalendarMonthOutlinedIcon /> Pick up Date & Time</h3>
              <p className="text-[#777]">{pickDate}</p>
              <input value={pickTime} onChange={e => setPickTime(e.target.value)} max={dropTime} type="time" className="border-2 focus:outline-none w-full" />
            </div>
            <div className="py-2">
              <h3 className="font-bold text-lg"><CalendarMonthOutlinedIcon /> Drop off Date & Time</h3>
              <p className="text-[#777]">{dropDate}</p>
              <input value={dropTime} onChange={e => setDropTime(e.target.value)} min={pickTime} type="time" className="border-2 focus:outline-none w-full" />
            </div>
            <div className="py-2">
              <h3 className="font-bold text-lg"><LocationOnOutlinedIcon /> Pick up Location</h3>
              <p className="text-[#777]">{pickPlace}</p>
            </div>
            <div className="py-2">
              <h3 className="font-bold text-lg"><LocationOnOutlinedIcon /> Drop off Location</h3>
              <p className="text-[#777]">{dropPlace}</p>
            </div>
          </div>

          <div className="py-4 px-4">
            <h2 className="text-orange font-bold text-xl">Personal Information</h2>
            <input value={firstname} onChange={e => setFirstname(e.target.value)} placeholder="First Name" className="border-2 w-full my-1 p-2" />
            <input value={lastname} onChange={e => setLastName(e.target.value)} placeholder="Last Name" className="border-2 w-full my-1 p-2" />
            <input value={age} onChange={e => setAge(e.target.value)} placeholder="Age" className="border-2 w-full my-1 p-2" />
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone Number" className="border-2 w-full my-1 p-2" />
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="border-2 w-full my-1 p-2" />
            <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Address" className="border-2 w-full my-1 p-2" />
            <input value={city} onChange={e => setCity(e.target.value)} placeholder="City" className="border-2 w-full my-1 p-2" />
            <input value={zipcode} onChange={e => setZipcode(e.target.value)} placeholder="Zip Code" className="border-2 w-full my-1 p-2" />
          </div>
        </div>

        <div className="w-full p-4 flex flex-col justify-center items-center">
          <button onClick={ReserveCar} className="bg-orange text-white px-6 py-2 text-lg rounded hover:bg-darkorange">
            Reserve Now
          </button>
          {showWarning && <p className="text-red-500 mt-2">Please fill out all fields!</p>}
          {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
        </div>
      </div>
    )
  );
}
