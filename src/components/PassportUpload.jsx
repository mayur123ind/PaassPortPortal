import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const PassportUpload = () => {
  const [dealersCode, setDealersCode] = useState('');
  const [dealershipName, setDealershipName] = useState('');
  const [selfPassport, setSelfPassport] = useState(null);
  const [selfPreviewUrl, setSelfPreviewUrl] = useState(null);
  const [spousePassport, setSpousePassport] = useState(null);
  const [spousePreviewUrl, setSpousePreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if user is verified
  const isVerified = location.state?.verified || false;
  const mobileNumber = location.state?.mobileNumber || '';
  
  // Redirect to login if not verified
  if (!isVerified) {
    navigate('/');
    return null;
  }

  const handleFileChange = (e, type) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      // Check file type
      if (!selectedFile.type.includes('image/')) {
        setErrors(prev => ({
          ...prev,
          [type]: 'Please upload an image file'
        }));
        if (type === 'self') {
          setSelfPassport(null);
          setSelfPreviewUrl(null);
        } else {
          setSpousePassport(null);
          setSpousePreviewUrl(null);
        }
        return;
      }
      
      // Check file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          [type]: 'File size should be less than 5MB'
        }));
        if (type === 'self') {
          setSelfPassport(null);
          setSelfPreviewUrl(null);
        } else {
          setSpousePassport(null);
          setSpousePreviewUrl(null);
        }
        return;
      }
      
      // Clear error
      setErrors(prev => ({
        ...prev,
        [type]: ''
      }));
      
      // Set file and create preview URL
      if (type === 'self') {
        setSelfPassport(selectedFile);
        
        const reader = new FileReader();
        reader.onload = () => {
          setSelfPreviewUrl(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setSpousePassport(selectedFile);
        
        const reader = new FileReader();
        reader.onload = () => {
          setSpousePreviewUrl(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    
    if (!dealersCode.trim()) {
      newErrors.dealersCode = 'Dealers Code is required';
    }
    
    if (!dealershipName.trim()) {
      newErrors.dealershipName = 'Dealership Name is required';
    }
    
    if (!selfPassport) {
      newErrors.self = 'Self Passport is required';
    }
    
    // If there are errors, update state and return
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setUploading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setUploading(false);
      setSuccess(true);
      // In a real app, we would send the form data to a server
    }, 2000);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Upload Passport</h4>
            </div>
            <div className="card-body">
              {success ? (
                <div className="text-center">
                  <div className="alert alert-success">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    Documents uploaded successfully!
                  </div>
                  <p>Your documents have been uploaded successfully. You will receive a confirmation on your mobile number {mobileNumber}.</p>
                  <button 
                    className="btn btn-primary mt-3" 
                    onClick={() => navigate('/')}
                  >
                    Back to Home
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {/* Dealers Code */}
                  <div className="mb-3">
                    <label htmlFor="dealersCode" className="form-label">Dealers Code</label>
                    <input
                      type="text"
                      className={`form-control ${errors.dealersCode ? 'is-invalid' : ''}`}
                      id="dealersCode"
                      value={dealersCode}
                      onChange={(e) => setDealersCode(e.target.value)}
                    />
                    {errors.dealersCode && <div className="invalid-feedback">{errors.dealersCode}</div>}
                  </div>
                  
                  {/* Dealership Name */}
                  <div className="mb-3">
                    <label htmlFor="dealershipName" className="form-label">Dealership Name</label>
                    <input
                      type="text"
                      className={`form-control ${errors.dealershipName ? 'is-invalid' : ''}`}
                      id="dealershipName"
                      value={dealershipName}
                      onChange={(e) => setDealershipName(e.target.value)}
                    />
                    {errors.dealershipName && <div className="invalid-feedback">{errors.dealershipName}</div>}
                  </div>
                  
                  {/* Self Passport */}
                  <div className="mb-4">
                    <label htmlFor="selfPassport" className="form-label">Self Passport</label>
                    <input
                      type="file"
                      className={`form-control ${errors.self ? 'is-invalid' : ''}`}
                      id="selfPassport"
                      name="self"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'self')}
                    />
                    <div className="form-text">Upload a clear image of your passport (Max size: 5MB)</div>
                    {errors.self && <div className="invalid-feedback">{errors.self}</div>}
                  </div>
                  
                  {selfPreviewUrl && (
                    <div className="mb-4 text-center">
                      <p className="fw-bold">Self Passport Preview:</p>
                      <img 
                        src={selfPreviewUrl} 
                        alt="Self Passport Preview" 
                        className="img-fluid border" 
                        style={{ maxHeight: '200px' }} 
                      />
                    </div>
                  )}
                  
                  {/* Spouse Passport (Optional) */}
                  <div className="mb-4">
                    <label htmlFor="spousePassport" className="form-label">Spouse Passport (Optional)</label>
                    <input
                      type="file"
                      className={`form-control ${errors.spouse ? 'is-invalid' : ''}`}
                      id="spousePassport"
                      name="spouse"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'spouse')}
                    />
                    <div className="form-text text-warning">This field is optional. Upload a clear image of spouse's passport if applicable (Max size: 5MB)</div>
                    {errors.spouse && <div className="invalid-feedback">{errors.spouse}</div>}
                  </div>
                  
                  {spousePreviewUrl && (
                    <div className="mb-4 text-center">
                      <p className="fw-bold">Spouse Passport Preview:</p>
                      <img 
                        src={spousePreviewUrl} 
                        alt="Spouse Passport Preview" 
                        className="img-fluid border" 
                        style={{ maxHeight: '200px' }} 
                      />
                    </div>
                  )}
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary w-100"
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Uploading...
                      </>
                    ) : 'Submit Documents'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassportUpload;