import { useState } from 'react';
import PersonalDetails from './AdmissonSections/PersonalDetails';
import AddressDetails from './AdmissonSections/AddressDetails';
import ContactDetails from './AdmissonSections/ContactDetails';
import OtherDetails from './AdmissonSections/OtherDetails';
import StudyDetails from './AdmissonSections/StudyDetails';
import PreferencesDetails from './AdmissonSections/PreferencesDetails';
import OfficeUseOnly from './AdmissonSections/OfficeUseOnly';
import '../styles/AdmissionForm.css';
import ProgressBar from './ProgressBar';

const AdmissionForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    studentName: '',
    fatherName: '',
    motherName: '',
    dateOfBirth: '',
    gender: '',
    studentAadhar: '',
    bloodGroup: '',
    interHallTicketNo: '',
    interGroup: '',
    tenthHallTicketNo: '',
    address: {
      houseNo: '',
      street: '',
      mandal: '',
      pinCode: '',
      district: '',
      secretariat: '',
      village: ''
    },
    contact: {
      mobile: '',
      parentsContact: '',
      guardianContact: '',
      email: ''
    },
    otherDetails: {
      religion: '',
      category: '',
      caste: '',
      physicallyChallenged: 'NO',
      casteCertificateMeeSeva: '',
      incomeCertificateMeeSeva: '',
      ewsCertificateMeeSeva: '',
      rationCardNo: '',
      riceCardNo: '',
      motherAadhar: '',
      bankName: '',
      bankIFSC: '',
      accountNo: ''
    },
    studyDetails: [
      { sno: 1, collegeName: '', academicYear: '', class: '2ND INTER', place: '' },
      { sno: 2, collegeName: '', academicYear: '', class: '1ST INTER', place: '' },
      { sno: 3, collegeName: '', academicYear: '', class: '10TH CLASS', place: '' },
      { sno: 4, collegeName: '', academicYear: '', class: '9TH CLASS', place: '' },
      { sno: 5, collegeName: '', academicYear: '', class: '8TH CLASS', place: '' },
      { sno: 6, collegeName: '', academicYear: '', class: '7TH CLASS', place: '' },
      { sno: 7, collegeName: '', academicYear: '', class: '6TH CLASS', place: '' }
    ],
    secondLanguage: '',
    degreeGroup: '',
    referenceLectureName: '',
    referenceLectureContact: '',
    collegePreferences: ['', '', '', '', ''],
    officeUseOnly: {
      applicationFeePaid: 'NO',
      studentIdGenerated: '',
      onlinePassword: '',
      appliedOnlineFirstPart: 'NO',
      collegeOptionsEntered: 'NO',
      collegeAllotmentStatus: ''
    }
  });

  const totalSteps = 7;

  const updateFormData = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    console.log('Form Data:', formData);
    alert('Application submitted successfully!');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalDetails
            data={formData}
            updateData={updateFormData}
            nextStep={nextStep}
          />
        );
      case 2:
        return (
          <AddressDetails
            data={formData.address}
            updateData={(data) => updateFormData('address', data)}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 3:
        return (
          <ContactDetails
            data={formData.contact}
            updateData={(data) => updateFormData('contact', data)}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 4:
        return (
          <OtherDetails
            data={formData.otherDetails}
            updateData={(data) => updateFormData('otherDetails', data)}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 5:
        return (
          <StudyDetails
            data={formData.studyDetails}
            updateData={(data) => updateFormData('studyDetails', data)}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 6:
        return (
          <PreferencesDetails
            data={formData}
            updateData={updateFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 7:
        return (
          <OfficeUseOnly
            data={formData.officeUseOnly}
            updateData={(data) => updateFormData('officeUseOnly', data)}
            prevStep={prevStep}
            handleSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="admission-form-container">
      <div className="form-header">
        <h1>Online Admission Module for Degree Colleges (OAMDC)</h1>
        <p className="academic-year">2025-2026</p>
        <p className="instruction">Application should be filled in CAPITAL LETTERS & according to 10th Marks list</p>
      </div>

      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

      <div className="form-content">
        {renderStep()}
      </div>
    </div>
  );
};

export default AdmissionForm;
