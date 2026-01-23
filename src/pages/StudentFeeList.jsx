import { useState, useEffect } from 'react';
import { Search, Edit2, Save, X, DollarSign } from 'lucide-react';
import { fetchStudentFee ,handleFeeEdit,handlesSaveDiscount} from '../services/feeCreateService';


export default function StudentFeeList() {
  const [studentFees, setStudentFees] = useState([]);
  const [filteredFees, setFilteredFees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ originalAmount: 0, discount: 0 });
  const [discountingId, setDiscountingId] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    fetchStudentFees();
  }, []);

  useEffect(() => {
    const filtered = studentFees.filter(fee =>
      fee.studentName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFees(filtered);
  }, [searchTerm, studentFees]);

  const fetchStudentFees = async () => {
    try {
      const response = await fetchStudentFee();
      const data = response.studentFees;
      if (response.success) {
        setStudentFees(data);
        setFilteredFees(data);
      }
    } catch (error) {
      console.error('Error fetching student fees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (fee) => {
    setEditingId(fee._id);
    setEditData({
      originalAmount: fee.originalAmount,
      discount: fee.discount
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      const response = await handleFeeEdit(id, editData);
      console.log(response)
      const data =  response;
      if (response.success) {
        setStudentFees(prev =>
          prev.map(fee => (fee._id === id ? data.studentFee : fee))
        );
        setEditingId(null);
      }
    } catch (error) {
      console.error('Error updating fee:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({ originalAmount: 0, discount: 0 });
  };

  const handleDiscount = (fee) => {
    setDiscountingId(fee._id);
    setDiscountAmount(fee.discount);
  };

  const handleSaveDiscount = async (id) => {
    try {
      const response = await handlesSaveDiscount(id, discountAmount);


      const data = response;
      if (response.success) {
        setStudentFees(prev =>
          prev.map(fee => (fee._id === id ? data.studentFee : fee))
        );
        setDiscountingId(null);
      }
    } catch (error) {
      console.error('Error applying discount:', error);
    }
  };

  const handleCancelDiscount = () => {
    setDiscountingId(null);
    setDiscountAmount(0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Student Fee Management</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by student name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
          />
        </div>
      </div>

      {filteredFees.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No student fees found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Student Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Branch</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Batch</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Semester</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Academic Year</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Original Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Discount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Final Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredFees.map((fee) => (
                <tr key={fee._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{fee.studentName}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{fee.department.departmentName}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{fee.batch.batchName}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{fee.semester.semesterName}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{fee.academicYear}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {editingId === fee._id ? (
                      <input
                        type="number"
                        value={editData.originalAmount}
                        onChange={(e) => setEditData({ ...editData, originalAmount: parseFloat(e.target.value) })}
                        className="w-24 px-2 py-1 border border-gray-300 rounded"
                      />
                    ) : (
                      `₹${fee.originalAmount.toFixed(2)}`
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-green-600">
                    {discountingId === fee._id ? (
                      <input
                        type="number"
                        value={discountAmount}
                        onChange={(e) => setDiscountAmount(parseFloat(e.target.value))}
                        className="w-24 px-2 py-1 border border-gray-300 rounded"
                      />
                    ) : editingId === fee._id ? (
                      <input
                        type="number"
                        value={editData.discount}
                        onChange={(e) => setEditData({ ...editData, discount: parseFloat(e.target.value) })}
                        className="w-24 px-2 py-1 border border-gray-300 rounded"
                      />
                    ) : (
                      `₹${fee.discount.toFixed(2)}`
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                    ₹{fee.finalAmount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {editingId === fee._id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(fee._id)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Save"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : discountingId === fee._id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveDiscount(fee._id)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Save Discount"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCancelDiscount}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(fee)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit Fee"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDiscount(fee)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Apply Discount"
                        >
                          <DollarSign className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        Showing {filteredFees.length} of {studentFees.length} students
      </div>
    </div>
  );
}
