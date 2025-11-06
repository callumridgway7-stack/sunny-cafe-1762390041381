const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/menu', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'menu.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// Contact form handler
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  // SMTP configuration (use environment variables for production)
  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER || 'your-email@gmail.com',
      pass: process.env.SMTP_PASS || 'your-app-password'
    }
  });

  const mailOptions = {
    from: '"Sunny Cafe" <hello@sunnycafe.com>',
    to: 'hello@sunnycafe.com',
    replyTo: email,
    subject: `Contact Form: Message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});