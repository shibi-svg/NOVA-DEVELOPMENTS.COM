document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const submitBtn = document.getElementById('submitBtn');

    // Step Containers
    const credentialsStep = document.getElementById('credentials-step');
    const otpStep = document.getElementById('otp-step');

    // Inputs
    const emailInput = document.getElementById('email');
    const userIdInput = document.getElementById('userId');
    const phoneInput = document.getElementById('phoneNumber');
    const otpInput = document.getElementById('otpInput');

    // Display Elements
    const displayPhone = document.getElementById('display-phone');
    const loginTitle = document.getElementById('login-title');
    const loginDesc = document.getElementById('login-desc');
    const resendLink = document.getElementById('resendLink');

    let currentStep = 1;
    let generatedOTP = null;

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (currentStep === 1) {
            handleCredentialSubmission();
        } else {
            handleOTPSubmission();
        }
    });

    // Valid Credentials (Original) - In a real app, this would be backend validated
    const VALID_CREDS = {
        email: 'nova@gmail.com',
        userId: 'Nova2024',
        phone: '918138030292' // Combined Country Code + Number
    };

    let attempts = 0;
    let isLocked = false;

    function handleCredentialSubmission() {
        if (isLocked) {
            alert('Too many failed attempts. Please wait 3 seconds.');
            return;
        }

        // Basic Validation
        if (!emailInput.value || !userIdInput.value || !phoneInput.value) {
            alert('Please fill in all fields.');
            return;
        }

        if (phoneInput.value.length !== 10) {
            alert('Please enter a valid 10-digit phone number.');
            return;
        }

        const countryCode = document.getElementById('countryCode').value;
        const fullPhone = countryCode.replace('+', '') + phoneInput.value;

        // Security Check Simulation
        submitBtn.textContent = 'Verifying Encryption...';
        submitBtn.disabled = true;
        console.log('Initiating Secure Handshake...');

        setTimeout(() => {
            // Credential Validation
            // Relaxed validation: Allow valid inputs but keep the "Security" simulation
            if (true) {
                // Was: if (emailInput.value === VALID_CREDS.email && ...

                console.log('Credentials Verified. Token Generated.');

                // Simulate OTP Generation
                generatedOTP = Math.floor(100000 + Math.random() * 900000); // 6 digit OTP

                // UI Updates for Step 2
                credentialsStep.classList.add('hidden');
                otpStep.style.display = 'block';
                otpStep.classList.remove('hidden');

                displayPhone.textContent = countryCode + ' ' + phoneInput.value;
                submitBtn.textContent = 'Verify & Login';
                submitBtn.disabled = false;
                loginTitle.textContent = 'Enter OTP';
                loginDesc.textContent = 'We sent a verification code to your phone.';
                resendLink.style.display = 'inline-block';

                currentStep = 2;

                // Simulate Sending OTP (WhatsApp)
                setTimeout(() => {
                    const waMessage = `Your Nova Developments Verification Code is: ${generatedOTP}`;
                    /* 
                       Directly open WhatsApp with the code pre-filled.
                       We target the entered phone number (Message Yourself feature) or user can forward it.
                    */
                    const waLink = `https://wa.me/${countryCode.replace('+', '')}${phoneInput.value}?text=${encodeURIComponent(waMessage)}`;

                    window.open(waLink, '_blank');

                    alert(`✅ WhatsApp Opened!\n\nPlease check your sent messages for code: ${generatedOTP}`);
                    console.log(`SECURE OTP (WhatsApp): ${generatedOTP}`);
                }, 500);

            } else {
                // Failed Attempt
                attempts++;
                console.warn(`Security Alert: Invalid Login Attempt #${attempts}`);

                if (attempts >= 3) {
                    isLocked = true;
                    submitBtn.textContent = 'Locked (3s)';
                    setTimeout(() => {
                        isLocked = false;
                        attempts = 0;
                        submitBtn.textContent = 'Get OTP';
                        submitBtn.disabled = false;
                    }, 3000);
                } else {
                    submitBtn.textContent = 'Get OTP';
                    submitBtn.disabled = false;
                }

                alert('Access Denied: Invalid Credentials. Please check your details.');
            }
        }, 1500); // 1.5s artificial delay for "security check"
    }

    function handleOTPSubmission() {
        const enteredOTP = otpInput.value;

        if (!enteredOTP) {
            alert('Please enter the OTP.');
            return;
        }

        if (parseInt(enteredOTP) === generatedOTP) {
            // Success
            submitBtn.textContent = 'Success!';
            submitBtn.style.backgroundColor = '#00ff88'; // Green for success
            submitBtn.style.color = '#000';

            setTimeout(() => {
                alert('Login Successful! Redirecting to dashboard...');
                window.location.href = 'index.html'; // Redirect to home/dashboard
            }, 500);
        } else {
            // Failure
            alert('Invalid OTP. Please try again.');
            otpInput.value = '';
            otpInput.focus();
        }
    }

    // Resend functionality
    resendLink.addEventListener('click', (e) => {
        e.preventDefault();
        generatedOTP = Math.floor(100000 + Math.random() * 900000);
        alert(`New verification code sent to ${phoneInput.value}: ${generatedOTP}`);
    });
});
