// models/Attendance.js

const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  enrollmentNo: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, required: true } // e.g., 'Present', 'Absent'
});

module.exports = mongoose.model('Attendance', attendanceSchema);
