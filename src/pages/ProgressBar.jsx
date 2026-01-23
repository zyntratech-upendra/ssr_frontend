import '../styles/ProgressBar.css';

const ProgressBar = ({ currentStep, totalSteps }) => {
  const steps = [
    'Personal Details',
    'Address',
    'Contact',
    'Other Details',
    'Study History',
    'Preferences',
    'Office Use'
  ];

  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
      <div className="progress-steps">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`progress-step ${index + 1 <= currentStep ? 'active' : ''} ${index + 1 === currentStep ? 'current' : ''}`}
          >
            <div className="step-number">{index + 1}</div>
            <div className="step-label">{step}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
