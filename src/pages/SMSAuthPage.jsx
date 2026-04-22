import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SMSPhoneInput from '../components/sms/SMSPhoneInput';
import SMSOTPInput from '../components/sms/SMSOTPInput';
import { useToast } from '../context/ToastContext';
import { useSendSMSOTP, useVerifySMSOTP, useResendSMSOTP } from '../hooks/useAuth';

const SMSAuthPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [step, setStep] = useState('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userName, setUserName] = useState('');

  const sendOTPMutation = useSendSMSOTP();
  const verifyOTPMutation = useVerifySMSOTP();
  const resendOTPMutation = useResendSMSOTP();

  const handleSendOTP = async (number) => {
    try {
      const data = await sendOTPMutation.mutateAsync(number);
      if (data.success) {
        setPhoneNumber(number);
        setStep('otp');
        showToast('OTP sent successfully to your mobile!', 'success');
        // ✅ OTP is NOT shown anywhere in UI
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to send OTP', 'error');
    }
  };

  const handleVerifyOTP = async (otpCode) => {
    try {
      const data = await verifyOTPMutation.mutateAsync({ 
        phoneNumber, 
        otpCode, 
        name: userName || 'User' 
      });
      if (data.verified) {
        showToast('✅ Phone number is verified successfully!', 'success');
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
      const data = await resendOTPMutation.mutateAsync(phoneNumber);
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            SMS Verification
          </h1>
          <p className="text-gray-500 text-sm mt-2">Enter the 6-digit code sent to your phone</p>
        </div>

        {step === 'phone' ? (
          <>
            <div className="mb-4">
              <input 
                type="text" 
                value={userName} 
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Your Name (Optional)" 
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <SMSPhoneInput 
              onSubmit={handleSendOTP} 
              isLoading={sendOTPMutation.isPending} 
            />
          </>
        ) : (
          <SMSOTPInput 
            phoneNumber={phoneNumber} 
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

export default SMSAuthPage;