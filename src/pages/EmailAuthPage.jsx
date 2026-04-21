import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmailInput from '../components/email/EmailInput';
import EmailOTPInput from '../components/email/EmailOTPInput';
import { useToast } from '../context/ToastContext';
import { useSendEmailOTP, useVerifyEmailOTP, useResendEmailOTP } from '../hooks/useAuth';

const EmailAuthPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');

  const sendOTPMutation = useSendEmailOTP();
  const verifyOTPMutation = useVerifyEmailOTP();
  const resendOTPMutation = useResendEmailOTP();

  const handleSendOTP = async (emailAddress) => {
    try {
      const data = await sendOTPMutation.mutateAsync(emailAddress);
      if (data.success) {
        setEmail(emailAddress);
        setStep('otp');
        showToast('OTP sent successfully to your email!', 'success');
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to send OTP', 'error');
    }
  };

  const handleVerifyOTP = async (otpCode) => {
    try {
      const data = await verifyOTPMutation.mutateAsync({ 
        email, 
        otpCode, 
        name: userName || 'User' 
      });
      if (data.verified) {
        showToast('✅ Email verified successfully!', 'success');
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        showToast(data.message || 'Invalid OTP', 'error');
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to verify OTP', 'error');
    }
  };

  const handleResendOTP = async () => {
    try {
      const data = await resendOTPMutation.mutateAsync(email);
      if (data.success) {
        showToast('OTP resent successfully!', 'success');
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to resend OTP', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <button onClick={() => navigate('/')} className="text-gray-500 mb-4 hover:text-gray-700">
            ← Back
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Email Verification
          </h1>
        </div>

        {step === 'email' ? (
          <>
            <div className="mb-4">
              <input 
                type="text" 
                value={userName} 
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Your Name (Optional)" 
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <EmailInput 
              onSubmit={handleSendOTP} 
              isLoading={sendOTPMutation.isPending} 
            />
          </>
        ) : (
          <EmailOTPInput 
            email={email} 
            onVerify={handleVerifyOTP}
            onResend={handleResendOTP} 
            isLoading={verifyOTPMutation.isPending}
            isResending={resendOTPMutation.isPending} 
          />
        )}
      </div>
    </div>
  );
};

export default EmailAuthPage;