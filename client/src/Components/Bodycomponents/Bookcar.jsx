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
  const navigate = useNavigate();

  const isReserveDisabled =
    !pickTime ||
    !dropTime ||
    !firstname ||
    !lastname ||
    !age ||
    !phone ||
    !email ||
    !address ||
    !city ||
    !zipcode;

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

    try {
      await axios.post('http://localhost:5000/api/reservation', {
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
      });
      navigate('/account/bookings');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {isDivVisible && (
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

            <div className="py-4 px-4 flex flex-col justify-center">
              <h2 className="font-bold text-lg">Car - <span className="text-orange">{carType}</span></h2>
              <img src={selectedImage} alt={carType} className="w-full mt-4" />
            </div>
          </div>

          <h2 className="text-orange py-4 font-bold text-xl">Personal Information</h2>

          <div className="grid lg:grid-cols-2 w-full bg-white px-4">
            <div className="py-2">
              <label className="text-[#777] font-semibold">First Name</label>
              <input value={firstname} onChange={e => setFirstname(e.target.value)} type="text" className="bg-[#dbdbdb] w-full px-2 py-3 my-2" placeholder='First Name' />
              <label className="text-[#777] font-semibold">Last Name</label>
              <input value={lastname} onChange={e => setLastName(e.target.value)} type="text" className="bg-[#dbdbdb] w-full px-2 py-3 my-2" placeholder='Last Name' />
            </div>
            <div className="py-2">
              <label className="text-[#777] font-semibold">Phone Number</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} type="text" className="bg-[#dbdbdb] w-full px-2 py-3 my-2" placeholder='Phone' />
              <label className="text-[#777] font-semibold">Age</label>
              <input value={age} onChange={e => setAge(e.target.value)} type="text" className="bg-[#dbdbdb] w-full px-2 py-3 my-2" placeholder='Age' />
            </div>
          </div>

          <div className="w-full bg-white px-4">
            <label className="text-[#777] font-semibold">Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="bg-[#dbdbdb] w-full px-2 py-3 my-2" placeholder='Email' />
            <label className="text-[#777] font-semibold">Address</label>
            <input value={address} onChange={e => setAddress(e.target.value)} type="text" className="bg-[#dbdbdb] w-full px-2 py-3 my-2" placeholder='Address' />
          </div>

          <div className="grid lg:grid-cols-2 w-full border-b px-4">
            <div className="py-2">
              <label className="text-[#777] font-semibold">City</label>
              <input value={city} onChange={e => setCity(e.target.value)} type="text" className="bg-[#dbdbdb] w-full px-2 py-3 my-2" placeholder='City' />
            </div>
            <div className="py-2">
              <label className="text-[#777] font-semibold">Zip Code</label>
              <input value={zipcode} onChange={e => setZipcode(e.target.value)} type="text" className="bg-[#dbdbdb] w-full px-2 py-3 my-2" placeholder='Zip Code' />
            </div>
          </div>

          <div className="px-4 py-4 w-full">
            <input type="checkbox" />
            <label className="text-[#777] font-semibold px-2">Please send me latest news and updates</label>
          </div>

          {showWarning && (
            <div className="px-4 py-2 bg-[#dbdbdb] w-full flex justify-center">
              <h2 className="text-orange">Please fill all the required fields.</h2>
            </div>
          )}

          <div className="w-full px-4 pb-4">
            <button
              onClick={ReserveCar}
              className={`w-full bg-orange text-white font-bold py-3 rounded-md hover:bg-[#dd6b20] transition-all duration-300 ${isReserveDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isReserveDisabled}
            >
              Reserve Now
            </button>
          </div>
        </div>
      )}
    </>
  );
}
