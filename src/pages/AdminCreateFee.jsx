import { useState, useEffect } from 'react';

import { PlusCircle, Trash2 } from 'lucide-react';
import { fetchBatchesByDepartment } from '../services/teacherAllocationService.jsx';
import { fetchSemsterByDepartment ,createFee,getAllCourses,fetchDepartementsByCousresData} from '../services/feeCreateService.jsx';
export default function FeeCreationForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    department: '',
    course: '',
    batch: '',
    semester: '',
    academicYear: '',
    amount: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [courses, setCourses] = useState([]);
  const [batches,setBatches] = useState([]);
  const [departements,setDepartments] = useState([]);
  const [semesters,setSemesters] = useState([]);
  const [error, setError] = useState('');



  
  const academicYears = ['2023-2024', '2024-2025', '2025-2026'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
const handleCourseChange = async (e) => {
  const courseId = e.target.value;

  if (!courseId) {
    setDepartments([]);
    setBatches([]);
    setSemesters([]);
    setFormData(prev => ({
      ...prev,
      course: courseId,
      department: '',
      batch: '',
      semester: ''
    }));
    return;
  }

  try {
    const response = await fetchDepartmentsbyCourses(courseId);

    if (response && response.success) {
      setFormData(prev => ({
        ...prev,
        course: courseId,
        department: ''
      }));
    }
  } catch (error) {
    console.error("Failed to fetch departments");
  }
};


 useEffect(() => {
  fetchAllCourses();
}, []);

  const fetchAllCourses = async () => {
      try {
        const response = await getAllCourses();
        console.log(response)
        if (response.success) {
          setCourses(response.data);
        } else {
          console.error('Error fetching courses:', response.message);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

const fetchDepartmentsbyCourses = async (courseId) => {
      try {
        const response = await fetchDepartementsByCousresData(courseId)
        console.log(response)
        if (response.success) {
          setDepartments(response.data);
          return response;
        } else {
          console.error('Error fetching departments:', response.message);
          return null;
        }
      }

      catch (error) {
        console.error('Error fetching departments:', error);
        return null;
      }
    };

const handleDepartmentChange = async (e) => {
  const departmentId = e.target.value;
  
  if (!departmentId) {
    setBatches([]);
    setSemesters([]);
    setFormData(prev => ({
      ...prev,
      department: departmentId,
      batch: '',
      semester: ''
    }));
    return;
  }

  setFormData(prev => ({
    ...prev,
    department: departmentId
  }));

  fetchBatches(departmentId);
  fetchSemster(departmentId);
};


  
    
       const fetchBatches = async (departmentId) => {
          try {
              const response = await fetchBatchesByDepartment(departmentId);
            if (response.success) {
              setBatches(response.data);
            } else {
                setError(response.message || 'Failed to fetch batches.');
            }
          } catch (err) {
            setError('Failed to fetch batches. Please try again.');
          } finally {
            setLoading(false);
          }
        };
        const fetchSemster = async (departmentId) => {
          try {
              const response = await fetchSemsterByDepartment(departmentId);
            if (response.success) {
              setSemesters(response.data);
            } else {
                setError(response.message || 'Failed to fetch semsters.');
            }
          } catch (err) {
            setError('Failed to fetch semsters. Please try again.');
          } finally {
            setLoading(false);
          }
        };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    const submitData = {
      ...formData,
      amount: parseFloat(formData.amount)
    };
    
    console.log(submitData);

    try {
      const data = await createFee(submitData);
      console.log(data);

      if (data.success) {
        setMessage({ type: 'success', text: `Fee created successfully for ${data.studentsAssigned} students` });
        setFormData({
          department: '',
          course: '',
          batch: '',
          semester: '',
          academicYear: '',
          amount: ''
        });
        if (onSuccess) onSuccess();
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to create fee' });
      }
    } catch (error) {
      console.error('Error creating fee:', error);
      setMessage({ type: 'error', text: error.message || 'Error creating fee. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      department: '',
      course: '',
      batch: '',
      semester: '',
      academicYear: '',
      amount: ''
    });
    setMessage({ type: '', text: '' });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Fee Structure</h2>

      {message.text && (
        <div className={`mb-4 p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course <span className="text-red-500">*</span>
            </label>
            <select
              name="course"
              value={formData.course}
              onChange={handleCourseChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Course</option>
              {courses.map(course => (
                <option key={course._id} value={course._id}>{course.courseName}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department <span className="text-red-500">*</span>
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleDepartmentChange}
              required
              disabled={!formData.course || departements.length === 0}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Department</option>
              {departements.map(branch => (
                <option key={branch._id} value={branch._id}>{branch.departmentName}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Batch <span className="text-red-500">*</span>
            </label>
            <select
              name="batch"
              value={formData.batch}
              onChange={handleChange}
              required
              disabled={!formData.course}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Batch</option>
              {batches.map(batch => (
                <option key={batch._id} value={batch._id}>{batch.batchName}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Semester <span className="text-red-500">*</span>
            </label>
            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              required
              disabled={!formData.course}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Semester</option>
              {semesters.map(sem => (
                <option key={sem._id} value={sem._id}>Semester {sem.semesterName}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Academic Year <span className="text-red-500">*</span>
            </label>
            <select
              name="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Academic Year</option>
              {academicYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fee Amount <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="Enter fee amount"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            {loading ? 'Creating...' : 'Create Fee'}
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
