import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { baseApiURL } from "../../baseUrl";
import { FiSearch } from "react-icons/fi";
import Heading from "../../components/Heading";

const Student = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState({
    enrollmentNo: "",
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    semester: "",
    branch: "",
    gender: "",
    profile: "",
  });
  const [id, setId] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState("Present");
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split("T")[0]);

  const searchStudentHandler = async (e) => {
    e.preventDefault();
    setId("");
    setData({
      enrollmentNo: "",
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      semester: "",
      branch: "",
      gender: "",
      profile: "",
    });
    toast.loading("Getting Student");

    try {
      const response = await axios.post(`${baseApiURL()}/student/details/getDetails`, { enrollmentNo: search });
      toast.dismiss();
      if (response.data.success) {
        if (response.data.user.length === 0) {
          toast.error("No Student Found!");
        } else {
          setData(response.data.user[0]);
          setId(response.data.user[0]._id);
          toast.success(response.data.message);
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const markAttendanceHandler = async (e) => {
    e.preventDefault();
    toast.loading("Marking Attendance");

    try {
      const response = await axios.post(`${baseApiURL()}/attendance/mark`, {
        enrollmentNo: data.enrollmentNo,
        date: attendanceDate,
        status: attendanceStatus,
      });
      toast.dismiss();
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="w-full mx-auto mt-10 flex justify-center items-start flex-col mb-10">
      <div className="flex justify-between items-center w-full">
        <Heading title="Student Details" />
      </div>
      <div className="my-6 mx-auto w-full">
        <form
          className="flex justify-center items-center border-2 border-blue-500 rounded w-[40%] mx-auto"
          onSubmit={searchStudentHandler}
        >
          <input
            type="text"
            className="px-6 py-3 w-full outline-none"
            placeholder="Enrollment No."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="px-4 text-2xl hover:text-blue-500" type="submit">
            <FiSearch />
          </button>
        </form>
        {id && (
          <>
            <div className="mx-auto w-full bg-blue-50 mt-10 flex justify-between items-center p-10 rounded-md shadow-md">
              <div>
                <p className="text-2xl font-semibold">
                  {data.firstName} {data.middleName} {data.lastName}
                </p>
                <div className="mt-3">
                  <p className="text-lg font-normal mb-2">
                    Enrollment No: {data.enrollmentNo}
                  </p>
                  <p className="text-lg font-normal mb-2">
                    Phone Number: +91 {data.phoneNumber}
                  </p>
                  <p className="text-lg font-normal mb-2">
                    Email Address: {data.email}
                  </p>
                  <p className="text-lg font-normal mb-2">
                    Branch: {data.branch}
                  </p>
                  <p className="text-lg font-normal mb-2">
                    Semester: {data.semester}
                  </p>
                </div>
              </div>
              <img
                src={process.env.REACT_APP_MEDIA_LINK + "/" + data.profile}
                alt="student profile"
                className="h-[200px] w-[200px] object-cover rounded-lg shadow-md"
              />
            </div>
            <form
              onSubmit={markAttendanceHandler}
              className="my-10 mx-auto w-[50%] flex flex-col gap-4"
            >
              <label htmlFor="attendanceDate" className="text-lg">Date</label>
              <input
                type="date"
                id="attendanceDate"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="px-3 py-2 border rounded"
              />
              <label htmlFor="attendanceStatus" className="text-lg">Status</label>
              <select
                id="attendanceStatus"
                value={attendanceStatus}
                onChange={(e) => setAttendanceStatus(e.target.value)}
                className="px-3 py-2 border rounded"
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
              <button
                type="submit"
                className="bg-blue-500 px-6 py-3 rounded-sm text-white"
              >
                Mark Attendance
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Student;
