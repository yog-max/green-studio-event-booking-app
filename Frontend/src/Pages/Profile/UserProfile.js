import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import API_URLS from "../../config/api";

function MyProfile() {

  const [userDetails, setUserDetails] = useState(null);
  const [bookingDetails, setBookingDetails] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      // API 1 — Get User Details
     axios.get(API_URLS.GET_USER_BY_ID(userId))
    .then(res => {
    setUserDetails(res.data);
    toast.success("Profile loaded successfully!"); 
   })
  .catch(err => {
    console.error("Error fetching user details", err);
    toast.error("Failed to load profile. Please try again."); 
   });
        

      // API 2 — Get Booking Details
      axios.get(API_URLS.GET_USER_BOOKINGS(userId))
       
        .then(res => { setBookingDetails(res.data)
        toast.success("Bookings loaded successfully!");
      })
        .catch(err => { console.error("Error fetching booking details", err)
        toast.error("Failed to load bookings. Please try again.");
       });
        
    }
  }, []);

  // Status badge color based on status value
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-700 border border-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border border-yellow-400";
      case "cancelled":
        return "bg-red-100 text-red-700 border border-red-400";
      default:
        return "bg-gray-100 text-gray-600 border border-gray-300";
    }
  };

  // Loading state
  if (!userDetails) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">📷</div>
          <p className="text-white text-xl font-semibold tracking-wide">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-hidden pb-20 px-4 md:px-10 py-8">

      {/* OUTER CARD */}
      <div className="max-w-5xl mx-auto
                      bg-cyan-800
                      rounded-3xl shadow-2xl
                      p-6 md:p-10">

        {/* HEADING */}
        <h2 className="text-center text-white font-bold
                        text-2xl md:text-4xl tracking-wide mb-8">
          👤 My Profile
        </h2>

        {/* ── USER DETAILS SECTION ── */}
        <h3 className="text-white font-bold text-lg md:text-xl
                        mb-4 flex items-center gap-2">
          <span className="bg-white text-cyan-800 px-3 py-1
                           rounded-full text-sm font-bold">
            01
          </span>
          User Details
        </h3>

        {/* User Details Card */}
        <div className="bg-white rounded-2xl shadow-lg
                        overflow-hidden mb-8
                        hover:shadow-xl hover:-translate-y-1
                        transition-all duration-300">
          <table className="w-full">
            <tbody>

              {/* USERNAME ROW */}
              <tr className="border-b border-gray-100 hover:bg-green-50
                              transition-colors duration-200">
                <th className="bg-green-600 text-white font-semibold
                                text-sm px-6 py-4 text-left w-40">
                  👤 User Name
                </th>
                <td className="px-6 py-4 text-gray-700 font-medium text-sm">
                  {userDetails.userName}
                </td>
              </tr>

              {/* MOBILE ROW */}
              <tr className="hover:bg-green-50 transition-colors duration-200">
                <th className="bg-green-600 text-white font-semibold
                                text-sm px-6 py-4 text-left w-40">
                  📱 Mobile No
                </th>
                <td className="px-6 py-4 text-gray-700 font-medium text-sm">
                  {userDetails.mobileNo}
                </td>
              </tr>

            </tbody>
          </table>
        </div>

        {/* ── BOOKINGS SECTION ── */}
        <h3 className="text-white font-bold text-lg md:text-xl
                        mb-4 flex items-center gap-2">
          <span className="bg-white text-cyan-800 px-3 py-1
                           rounded-full text-sm font-bold">
            02
          </span>
          My Bookings
          {/* Booking count badge */}
          {bookingDetails.length > 0 && (
            <span className="bg-green-400 text-white text-xs
                             font-bold px-3 py-1 rounded-full ml-2">
              {bookingDetails.length} Booking{bookingDetails.length > 1 ? "s" : ""}
            </span>
          )}
        </h3>

        {/* NO BOOKINGS */}
        {bookingDetails.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-lg">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-red-500 font-semibold text-base">
              No bookings found.
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Your bookings will appear here once you book an event.
            </p>
          </div>

        ) : (

          // BOOKINGS TABLE
          <div className="w-full overflow-x-auto rounded-2xl shadow-lg
                          hover:shadow-xl hover:-translate-y-1
                          transition-all duration-300">
            <table className="w-full bg-white
                               border-collapse min-w-max">

              {/* TABLE HEADER */}
              <thead>
                <tr className="bg-green-600 text-white text-sm">
                  <th className="px-4 py-4 text-left font-semibold whitespace-nowrap">
                     Full Name
                  </th>
                  <th className="px-4 py-4 text-left font-semibold whitespace-nowrap">
                     Mobile No
                  </th>
                  <th className="px-4 py-4 text-left font-semibold whitespace-nowrap">
                     Location
                  </th>
                  <th className="px-4 py-4 text-left font-semibold whitespace-nowrap">
                     Event Type
                  </th>
                  <th className="px-4 py-4 text-left font-semibold whitespace-nowrap">
                     Start Date
                  </th>
                  <th className="px-4 py-4 text-left font-semibold whitespace-nowrap">
                     End Date
                  </th>
                  <th className="px-4 py-4 text-left font-semibold whitespace-nowrap">
                     Event Location
                  </th>
                  <th className="px-4 py-4 text-left font-semibold whitespace-nowrap">
                     Status
                  </th>
                </tr>
              </thead>

              {/* TABLE BODY */}
              <tbody>
                {bookingDetails.map((booking, index) => (
                  <tr
                    key={booking.eventId}
                    className={`
                      border-b border-gray-100
                      hover:bg-green-50
                      transition-colors duration-200
                      ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    `}
                  >
                    <td className="px-4 py-3 text-gray-700 text-sm whitespace-nowrap">
                      {booking.fullName}
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-sm whitespace-nowrap">
                      {booking.mobileNo}
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-sm whitespace-nowrap">
                      {booking.location}
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-sm whitespace-nowrap">
                      {booking.eventType}
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-sm whitespace-nowrap">
                      {booking.startDate}
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-sm whitespace-nowrap">
                      {booking.endDate}
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-sm whitespace-nowrap">
                      {booking.eventLocation}
                    </td>

                    {/* STATUS BADGE */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold
                                        ${getStatusStyle(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}

      </div>
    </div>
  );
}

export default MyProfile;
