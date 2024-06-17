// Import necessary modules for sending emails
import nodemailer from 'nodemailer';

// Function to generate a random verification code
export function generateVerificationCode() {
  // Generate a random 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000);
  return code.toString(); // Convert to string
}

  // Function to generate a random activation token
  export function generateActivationToken() {
    // Define the characters that can be used in the token
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const tokenLength = 32; // Length of the token
  
    let token = '';
    // Generate a random token by selecting random characters from the defined set
    for (let i = 0; i < tokenLength; i++) {
      token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  
    return token;
  }

export function sendActivationEmail(email, token) {
  // Configure nodemailer transporter
  const transporter = nodemailer.createTransport({
    // Specify your email service provider and authentication details
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
      user: 'montassartayari14@gmail.com',
      pass: 'xsmtpsib-42b7109b20fb2445b121adc30a03231b4c34c238d5ac2965cca864345fa01194-rjq63mJEaTFHAdzZ',
    },
  });

  // Email content
  const mailOptions = {
    from: 'montassartayari14@gmail.com',
    to: email,
    subject: 'Activate Your Account',
    text: `Click the following link to activate your account: http://localhost:3000/api/activate?token=${token}`
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending activation email:', error);
    } else {
      console.log('Activation email sent:', info.response);
    }
  });
}

// Function to send a verification email
export async function sendVerificationEmail(email, verificationCode) {
    try {
        console.log('Sending verification email...');
        // Remaining code for sending the email...
    
        console.log(verificationCode)
      // Create a Nodemailer transporter using SMTP transport
      let transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false,
        auth: {
          user: 'montassartayari14@gmail.com',
          pass: 'xsmtpsib-42b7109b20fb2445b121adc30a03231b4c34c238d5ac2965cca864345fa01194-rjq63mJEaTFHAdzZ',
        },
      });
  
      let info = await transporter.sendMail({
        from: 'montassartayari14@gmail.com',
        to: email,
        subject: 'Verification Code',
        text: `Your verification code is: ${verificationCode}`,
        html: `<b>Your verification code is:</b> ${verificationCode}`,
      });
      console.log('Verification email sent successfully');

      console.log('Message sent: %s', info.messageId);
    } catch (error) {
      console.error('Error sending verification email:', error);
    }
  }
  

