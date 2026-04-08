import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import API_URLS from "../../config/api";

function Admin() {

  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const [showBookings, setShowBookings] = useState(false);
  const [visitors, setVisitors] = useState(0);

  const navigate = useNavigate();

  function handleLogout() {
    sessionStorage.removeItem("adminToken");
    navigate("/Admin-Login");
  }

  useEffect(() => {
    getUsers();
    getBookings();
    generateVisitors();
    return () => {
      sessionStorage.removeItem("adminToken");
      console.log("Admin left page — token cleared");
    }
  }, []);

  async function getUsers() {
    try {
      const result = await axios.get(API_URLS.GET_USERS);
      setUsers(result.data);
      toast.success("Users fetched successfully!");
    } catch (error) {
      toast.error("Error fetching users.");
    }
  }

  async function getBookings() {
    try {
      const result = await axios.get(API_URLS.GET_BOOKINGS);
      setBookings(result.data);
      toast.success("Bookings fetched successfully!");
    } catch (error) {
      toast.error("Error fetching bookings.");
    }
  }

  function generateVisitors() {
    setVisitors(Math.floor(Math.random() * 200) + 50);
  }

  const deleteUser = async (userId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This user will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(API_URLS.DELETE_USER(userId));
        toast.success("User deleted successfully!");
        setUsers(users.filter(user => user.userId !== userId));
      } catch (error) {
        toast.error("Failed to delete user.");
      }
    }
  };

  const deleteBooking = async (eventId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This booking will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(API_URLS.DELETE_BOOKING(eventId));
        toast.success("Booking deleted successfully!");
        setBookings(bookings.filter(bkg => bkg.eventId !== eventId));
      } catch (error) {
        toast.error("Failed to delete booking.");
      }
    }
  };

  const approveBooking = async (eventId) => {
    try {
      await axios.patch(API_URLS.APPROVE_BOOKING(eventId));
      toast.success("Booking Approved ");
      getBookings();
    } catch (error) {
      toast.error("Approval Failed.");
    }
  };

  const rejectBooking = async (eventId) => {
    try {
      await axios.patch(API_URLS.REJECT_BOOKING(eventId));
      toast.info("Booking Rejected ");
      getBookings();
    } catch (error) {
      toast.error("Reject Failed.");
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
        return "bg-green-100 text-green-700 border border-green-400";
      case "REJECTED":
        return "bg-red-100 text-red-700 border border-red-400";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 border border-yellow-400";
      default:
        return "bg-gray-100 text-gray-600 border border-gray-300";
    }
  };

  return (
    <div className="w-full min-h-screen overflow-x-hidden
                    bg-gray-100 px-4 md:px-10 py-8 pb-20">

     <div className="flex justify-between items-center mb-8">
  <h1 className="text-2xl md:text-4xl font-bold text-cyan-900 tracking-wide">
     Admin Dashboard
  </h1>
  <button
    onClick={handleLogout}
    className="bg-red-500 hover:bg-red-600 text-white
               font-bold px-5 py-2 rounded-lg
               transition-all duration-300 hover:scale-105"
  >
     Logout
  </button>
</div>

      <div className="flex flex-wrap justify-center gap-6 mb-10">

        <div
          onClick={() => { setShowUsers(!showUsers); setShowBookings(false); }}
          className="w-48 md:w-56 bg-white rounded-2xl shadow-lg
                     p-6 cursor-pointer text-center
                     hover:-translate-y-2 hover:shadow-2xl
                     transition-all duration-300
                     border-t-4 border-green-500"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-green-600">
            {users.length}
          </h2>
          <p className="mt-2 font-semibold text-gray-600 text-sm">
             Total Registrations
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {showUsers ? "Click to hide" : "Click to view"}
          </p>
        </div>

        <div
          onClick={() => { setShowBookings(!showBookings); setShowUsers(false); }}
          className="w-48 md:w-56 bg-white rounded-2xl shadow-lg
                     p-6 cursor-pointer text-center
                     hover:-translate-y-2 hover:shadow-2xl
                     transition-all duration-300
                     border-t-4 border-blue-500"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-blue-600">
            {bookings.length}
          </h2>
          <p className="mt-2 font-semibold text-gray-600 text-sm">
             Total Bookings
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {showBookings ? "Click to hide" : "Click to view"}
          </p>
        </div>

        {/* Visitors Today */}
        <div
          className="w-48 md:w-56 rounded-2xl shadow-lg
                     p-6 text-center
                     bg-gradient-to-br from-green-50 to-white
                     border-t-4 border-emerald-400
                     hover:-translate-y-2 hover:shadow-2xl
                     transition-all duration-300"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-600">
            {visitors}
          </h2>
          <p className="mt-2 font-semibold text-gray-600 text-sm">
             Visitors Today
          </p>
          <p className="text-xs text-gray-400 mt-1">Live count</p>
        </div>

      </div>

      {/* ── USERS TABLE ── */}
      {showUsers && (
        <div className="mb-10">

          {/* Section Header */}
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-lg md:text-2xl font-bold text-gray-700">
               User Registrations
            </h2>
            <span className="bg-green-500 text-white text-xs
                             font-bold px-3 py-1 rounded-full">
              {users.length} Users
            </span>
          </div>

          {/* Table Wrapper — horizontal scroll on mobile */}
          <div className="w-full overflow-x-auto rounded-2xl shadow-lg">
            <table className="w-full bg-white border-collapse min-w-max">

              {/* Header */}
              <thead>
                <tr className="bg-green-600 text-white text-sm">
                  <th className="px-4 py-4 text-left whitespace-nowrap"> ID</th>
                  <th className="px-4 py-4 text-left whitespace-nowrap"> Name</th>
                  <th className="px-4 py-4 text-left whitespace-nowrap"> Mobile</th>
                  <th className="px-4 py-4 text-left whitespace-nowrap"> Gender</th>
                  <th className="px-4 py-4 text-left whitespace-nowrap"> Action</th>
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {users.map((usr, index) => (
                  <tr
                    key={usr.userId}
                    className={`
                      border-b border-gray-100
                      hover:bg-green-50
                      transition-colors duration-200
                      ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    `}
                  >
                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                      #{usr.userId}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-700 whitespace-nowrap">
                      {usr.userName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                      {usr.mobileNo}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                      {usr.gender}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => deleteUser(usr.userId)}
                        className="bg-gradient-to-r from-red-500 to-pink-500
                                   hover:from-red-600 hover:to-pink-600
                                   text-white text-xs font-bold
                                   px-4 py-2 rounded-lg
                                   transition-all duration-300
                                   hover:scale-105 hover:shadow-md"
                      >
                         Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      )}

      {showBookings && (
        <div className="mb-10">

          {/* Section Header */}
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-lg md:text-2xl font-bold text-gray-700">
               Event Bookings
            </h2>
            <span className="bg-blue-500 text-white text-xs
                             font-bold px-3 py-1 rounded-full">
              {bookings.length} Bookings
            </span>
          </div>

          {/* Table Wrapper */}
          <div className="w-full overflow-x-auto rounded-2xl shadow-lg">
            <table className="w-full bg-white border-collapse min-w-max">

              {/* Header */}
              <thead>
                <tr className="bg-blue-600 text-white text-sm">
                  <th className="px-4 py-4 text-left whitespace-nowrap"> Event ID</th>
                  <th className="px-4 py-4 text-left whitespace-nowrap"> Full Name</th>
                  <th className="px-4 py-4 text-left whitespace-nowrap"> Mobile</th>
                  <th className="px-4 py-4 text-left whitespace-nowrap"> Location</th>
                  <th className="px-4 py-4 text-left whitespace-nowrap"> Event Type</th>
                  <th className="px-4 py-4 text-left whitespace-nowrap"> Start Date</th>
                  <th className="px-4 py-4 text-left whitespace-nowrap"> End Date</th>
                  <th className="px-4 py-4 text-left whitespace-nowrap"> Event Location</th>
                  <th className="px-4 py-4 text-left whitespace-nowrap"> Status</th>
                  <th className="px-4 py-4 text-left whitespace-nowrap"> Actions</th>
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {bookings.map((bkg, index) => (
                  <tr
                    key={bkg.eventId}
                    className={`
                      border-b border-gray-100
                      hover:bg-blue-50
                      transition-colors duration-200
                      ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    `}
                  >
                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                      #{bkg.eventId}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-700 whitespace-nowrap">
                      {bkg.fullName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                      {bkg.mobileNo}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                      {bkg.location}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                      {bkg.eventType}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                      {bkg.startDate}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                      {bkg.endDate}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                      {bkg.eventLocation}
                    </td>

                    {/* STATUS BADGE */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold
                                        ${getStatusStyle(bkg.status)}`}>
                        {bkg.status}
                      </span>
                    </td>

                    {/* ACTION BUTTONS */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2 flex-wrap">

                        {/* Delete */}
                        <button
                          onClick={() => deleteBooking(bkg.eventId)}
                          className="bg-gradient-to-r from-red-500 to-pink-500
                                     hover:from-red-600 hover:to-pink-600
                                     text-white text-xs font-bold
                                     px-3 py-2 rounded-lg
                                     transition-all duration-300
                                     hover:scale-105 hover:shadow-md"
                        >
                           Delete
                        </button>

                        {/* Approve and Reject — only for PENDING */}
                        {bkg.status?.toUpperCase() === "PENDING" && (
                          <>
                            <button
                              onClick={() => approveBooking(bkg.eventId)}
                              className="bg-green-500 hover:bg-green-600
                                         text-white text-xs font-bold
                                         px-3 py-2 rounded-lg
                                         transition-all duration-300
                                         hover:scale-105 hover:shadow-md"
                            >
                               Approve
                            </button>
                            <button
                              onClick={() => rejectBooking(bkg.eventId)}
                              className="bg-orange-400 hover:bg-orange-500
                                         text-white text-xs font-bold
                                         px-3 py-2 rounded-lg
                                         transition-all duration-300
                                         hover:scale-105 hover:shadow-md"
                            >
                               Reject
                            </button>
                          </>
                        )}

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      )}

    </div>
  );
}

export default Admin;
