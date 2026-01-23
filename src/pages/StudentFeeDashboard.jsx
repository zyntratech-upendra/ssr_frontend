import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Card, Button, Badge, Modal, Form, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const StudentFeeDashboard = ({ user }) => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFee, setSelectedFee] = useState(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [paymentMode, setPaymentMode] = useState("online");
  const [transactionId, setTransactionId] = useState("");

  const fetchFees = async () => {
    try {
      // Fetch all fees assigned to this student (from backend)
      const { data } = await axios.get(`/api/student/fees/${user._id}`);
      setFees(data.fees || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const handlePayClick = (fee) => {
    setSelectedFee(fee);
    setShowPayModal(true);
  };

  const handlePayment = async () => {
    if (!transactionId.trim()) {
      alert("Please enter transaction ID");
      return;
    }
    try {
      await axios.patch(`/api/fees/${selectedFee._id}/pay/${user._id}`, {
        paymentMode,
        transactionId,
      });
      alert("Payment Successful!");
      setShowPayModal(false);
      fetchFees();
    } catch (err) {
      console.error(err);
      alert("Error marking payment!");
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    );

  return (
    <div className="container my-4">
      <h3 className="text-center mb-4 fw-bold text-primary">
        💳 My Fee Dashboard
      </h3>

      {fees.length === 0 ? (
        <div className="text-center text-muted">No fees assigned yet.</div>
      ) : (
        <div className="row g-3">
          {fees.map((fee) => (
            <div className="col-lg-6 col-md-12" key={fee._id}>
              <Card className="shadow-sm border-0 rounded-4">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Card.Title className="fw-semibold mb-0">
                      {fee.feeName}
                    </Card.Title>
                    <Badge bg={fee.isPaid ? "success" : "warning"} pill>
                      {fee.isPaid ? "Paid" : "Pending"}
                    </Badge>
                  </div>

                  <p className="mb-1 text-secondary">
                    <strong>Batch:</strong> {fee.batch?.batchName}
                  </p>
                  <p className="mb-1 text-secondary">
                    <strong>Department:</strong>{" "}
                    {fee.department?.departmentName}
                  </p>
                  <p className="mb-1 text-secondary">
                    <strong>Semester:</strong> {fee.semester?.semesterName}
                  </p>
                  <p className="mb-1 text-secondary">
                    <strong>Academic Year:</strong> {fee.academicYear}
                  </p>

                  <hr />

                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="mb-1">
                        <strong>Total:</strong> ₹{fee.totalAmount}
                      </p>
                      <p className="mb-1 text-success">
                        <strong>Discount:</strong> ₹{fee.discount || 0}
                      </p>
                      <p className="mb-0 fw-bold text-primary">
                        Payable: ₹{fee.amountAfterDiscount || fee.totalAmount}
                      </p>
                    </div>

                    {!fee.isPaid && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handlePayClick(fee)}
                      >
                        Pay Now
                      </Button>
                    )}
                  </div>

                  {fee.isPaid && (
                    <div className="mt-2 small text-success">
                      Payment Date:{" "}
                      {new Date(fee.paymentDate).toLocaleDateString("en-IN")}
                      <br />
                      Mode: {fee.paymentMode}
                    </div>
                  )}
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Payment Modal */}
      <Modal show={showPayModal} onHide={() => setShowPayModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Pay Fee - {selectedFee?.feeName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Payment Mode</Form.Label>
              <Form.Select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
              >
                <option value="online">Online</option>
                <option value="upi">UPI</option>
                <option value="card">Card</option>
                <option value="cash">Cash</option>
                <option value="bank">Bank Transfer</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Transaction ID</Form.Label>
              <Form.Control
                placeholder="Enter transaction ID"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
              />
            </Form.Group>

            <div className="text-end">
              <Button variant="success" onClick={handlePayment}>
                Confirm Payment
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default StudentFeeDashboard;
