// src/seed-enhanced.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Course = require('./models/Course');
const Feedback = require('./models/feedback');

// Sample data
const SAMPLE_COURSES = [
  { title: 'Web Development', code: 'CS101', description: 'Learn HTML, CSS, JavaScript and modern web frameworks' },
  { title: 'Data Structures', code: 'CS102', description: 'Fundamental data structures and algorithms' },
  { title: 'Database Systems', code: 'CS103', description: 'SQL, NoSQL, and database design principles' },
  { title: 'Machine Learning', code: 'CS104', description: 'Introduction to ML algorithms and applications' },
  { title: 'Computer Networks', code: 'CS201', description: 'Network protocols, security, and architecture' },
  { title: 'Software Engineering', code: 'CS202', description: 'Software development methodologies and practices' },
  { title: 'Artificial Intelligence', code: 'CS301', description: 'AI concepts, neural networks, and expert systems' },
  { title: 'Cloud Computing', code: 'CS302', description: 'Cloud platforms, services, and deployment' }
];

const SAMPLE_FEEDBACK_MESSAGES = [
  "Excellent course! The instructor was very knowledgeable and engaging.",
  "Good content, but the pace was a bit too fast for beginners.",
  "Loved the practical assignments. Really helped solidify the concepts.",
  "The course material could use more real-world examples.",
  "Outstanding course! Would highly recommend to others.",
  "The projects were challenging but very rewarding.",
  "Some topics felt rushed. Would benefit from more detailed explanations.",
  "Great balance between theory and practical applications.",
  "The instructor was very responsive to questions and provided helpful feedback.",
  "Course content was relevant and up-to-date with industry standards.",
  "Would have liked more interactive sessions and group discussions.",
  "The assessments were fair and tested understanding effectively.",
  "Some technical issues with the online platform, but overall good experience.",
  "The course exceeded my expectations in terms of content and delivery.",
  "Well-structured curriculum with clear learning objectives."
];

const generateRandomStudents = (count) => {
  const students = [];
  for (let i = 1; i <= count; i++) {
    students.push({
      name: `Student ${i}`,
      email: `student${i}@example.com`,
      password: `Student${i}@123`,
      role: 'student',
      phone: `+1-555-${100 + i}-${1000 + i}`,
      address: `${100 + i} Main St, City, State ${10000 + i}`,
      dateOfBirth: new Date(1995 + (i % 5), i % 12, (i % 28) + 1)
    });
  }
  return students;
};

const generateRandomFeedback = (students, courses, count) => {
  const feedbacks = [];
  for (let i = 0; i < count; i++) {
    const student = students[Math.floor(Math.random() * students.length)];
    const course = courses[Math.floor(Math.random() * courses.length)];
    const rating = Math.floor(Math.random() * 5) + 1; // 1-5
    const message = SAMPLE_FEEDBACK_MESSAGES[Math.floor(Math.random() * SAMPLE_FEEDBACK_MESSAGES.length)];
    
    feedbacks.push({
      student: student._id,
      course: course._id,
      rating,
      message,
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000) // Random date in last 90 days
    });
  }
  return feedbacks;
};

const seedEnhancedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await Feedback.deleteMany({});
    console.log('Cleared existing data');

    // Create Admin User
    const hashedAdminPassword = await bcrypt.hash('Admin@123', 10);
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedAdminPassword,
      role: 'admin',
      phone: '+1-555-0101',
      address: '123 Admin Blvd, Admin City, AC 12345',
      dateOfBirth: new Date(1980, 0, 1)
    });
    await adminUser.save();
    console.log('Admin user created:', adminUser.email);

    // Create Sample Students (20 students)
    const sampleStudents = generateRandomStudents(20);
    const createdStudents = [];
    
    for (const studentData of sampleStudents) {
      const hashedPassword = await bcrypt.hash(studentData.password, 10);
      const student = new User({
        ...studentData,
        password: hashedPassword
      });
      await student.save();
      createdStudents.push(student);
      console.log('Student created:', student.email);
    }

    // Block 2 random students
    const blockedStudents = createdStudents.slice(0, 2);
    for (const student of blockedStudents) {
      student.blocked = true;
      await student.save();
      console.log('Student blocked:', student.email);
    }

    // Create Courses
    const createdCourses = [];
    for (const courseData of SAMPLE_COURSES) {
      const course = new Course(courseData);
      await course.save();
      createdCourses.push(course);
      console.log('Course created:', course.title);
    }

    // Generate Feedback (100 feedback entries)
    const sampleFeedback = generateRandomFeedback(createdStudents, createdCourses, 100);
    for (const feedbackData of sampleFeedback) {
      const feedback = new Feedback(feedbackData);
      await feedback.save();
    }
    console.log('Generated 100 feedback entries');

    // Generate analytics summary
    const feedbackCount = await Feedback.countDocuments();
    const studentCount = await User.countDocuments({ role: 'student' });
    const blockedCount = await User.countDocuments({ role: 'student', blocked: true });

    console.log('\n=== DATABASE SUMMARY ===');
    console.log('Total Users:', await User.countDocuments());
    console.log('Admin Users:', await User.countDocuments({ role: 'admin' }));
    console.log('Student Users:', studentCount);
    console.log('Blocked Students:', blockedCount);
    console.log('Courses:', await Course.countDocuments());
    console.log('Feedback Entries:', feedbackCount);
    
    console.log('\n=== LOGIN CREDENTIALS ===');
    console.log('Admin: admin@example.com / Admin@123');
    console.log('Students: student1@example.com / Student1@123');
    console.log('Blocked Students: student1@example.com, student2@example.com');
    
    console.log('\n✅ Enhanced seed data created successfully!');

    process.exit(0);

  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedEnhancedData();
}

module.exports = { seedEnhancedData };