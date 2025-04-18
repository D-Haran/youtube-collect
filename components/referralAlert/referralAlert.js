import { useEffect, useState } from 'react';

const ReferralAlert = ({ referralCode }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (referralCode) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 3000); // Auto-close after 3s
      return () => clearTimeout(timer);
    }
  }, [referralCode]);

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: '#d4edda',
      color: '#155724',
      padding: '12px 20px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      zIndex: 9999
    }}>
      <span style={{ fontSize: '20px', marginRight: '10px' }}>✅</span>
      <span>Referral Code Detected!</span>
    </div>
  );
};

export default ReferralAlert;
