import React, { useState } from "react";
import "../css/contact.css";

const ContactMe = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    serviceType: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("");

    // Simulate form submission
    try {
      // Create email content
      const emailBody = `
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Service Interest: ${formData.serviceType}
Subject: ${formData.subject}

Message:
${formData.message}
      `;

      // Create mailto link
      const mailtoLink = `mailto:your-email@bank.com?subject=${encodeURIComponent(
        formData.subject
      )}&body=${encodeURIComponent(emailBody)}`;

      // Open email client
      window.location.href = mailtoLink;

      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        serviceType: "",
        message: "",
      });
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: "📧",
      title: "Email",
      subtitle: "your-email@bank.com",
      description: "Send me a detailed message about your banking needs",
      action: () => (window.location.href = "mailto:your-email@bank.com"),
    },
    {
      icon: "📱",
      title: "WhatsApp",
      subtitle: "+1 (555) 123-4567",
      description: "Quick consultation and immediate responses",
      action: () =>
        window.open(
          "https://wa.me/15551234567?text=Hello, I would like to discuss banking services",
          "_blank"
        ),
      color: "#25D366",
    },
    {
      icon: "💼",
      title: "LinkedIn",
      subtitle: "Connect Professionally",
      description: "Network and view my professional background",
      action: () =>
        window.open("https://linkedin.com/in/your-profile", "_blank"),
      color: "#0077B5",
    },
    {
      icon: "📞",
      title: "Phone",
      subtitle: "+1 (555) 123-4567",
      description: "Direct line for urgent banking consultations",
      action: () => (window.location.href = "tel:+15551234567"),
    },
  ];

  const serviceTypes = [
    "Personal Banking",
    "Business Banking",
    "Investment Advisory",
    "Loan Services",
    "Risk Management",
    "Digital Banking Solutions",
    "Other",
  ];

  const officeHours = [
    { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM" },
    { day: "Saturday", hours: "10:00 AM - 2:00 PM" },
    { day: "Sunday", hours: "By Appointment" },
  ];

  return (
    <div className="contact-container">

    
          <div className="title-divider" style={{ marginBottom: "20px" }}>
            Get In Touch
            </div>
      
        
        <p
          style={{
            fontSize: "20px",
            color: "#cbd5e1",
            maxWidth: "700px",
            margin: "0 auto",
            lineHeight: "1.7",
          }}
        >
          Ready to discuss your financial goals? Let's connect and explore how I
          can help you achieve success through expert banking solutions and
          personalized service.
        </p>
     

      <div style={{ padding: "40px 0" }}>
        {/* Main Content Grid */}
        <div
        className="contact-grid"
          style={{   
      
          }}
        >
            <div class="contact-form">
  <h2 class="form-title">Send Me a Message</h2>
  <p class="form-subtitle">
    Fill out the form below and I'll get back to you within 24 hours
  </p>

  <form class="form-body">
    <div class="form-row">
      <div class="form-group">
        <label>Full Name *</label>
        <input type="text" placeholder="Enter your full name" required />
      </div>
      <div class="form-group">
        <label>Email Address *</label>
        <input type="email" placeholder="your.email@example.com" required />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label>Phone Number</label>
        <input type="tel" placeholder="+1 (555) 123-4567" />
      </div>
      <div class="form-group">
        <label>Service Interest</label>
        <select>
          <option value="">Select a service</option>
          <option value="Web Development">Web Development</option>
          <option value="UI/UX Design">UI/UX Design</option>
          <option value="SEO">SEO</option>
        </select>
      </div>
    </div>

    <div class="form-group">
      <label>Subject *</label>
      <input type="text" placeholder="Brief description of your inquiry" required />
    </div>

    <div class="form-group">
      <label>Message *</label>
      <textarea
        rows="5"
        placeholder="Please provide details about your banking needs, questions, or how I can assist you..."
        required
      ></textarea>
    </div>

    <button type="submit" class="submit-but">Send Message</button>
  </form>
</div>


{/* Sidebar Info */}
<div className="sidebar">

  {/* Office Hours */}
  <div className="spcard cocard">
    <h3 className="sidebar-title">Office Hours</h3>
    {officeHours.map((schedule, index) => (
      <div
        key={index}
        className={`office-hour ${index < officeHours.length - 1 ? "with-border" : ""}`}
      >
        <span className="day">{schedule.day}</span>
        <span className="hours">{schedule.hours}</span>
      </div>
    ))}
  </div>

  {/* Quick Actions */}
  <div className="spcard cocard">
    <h3 className="sidebar-title">Quick Connect</h3>
    <div className="quick-actions">
      <button className="but whatsapp">📱 WhatsApp Chat</button>
      <button className="but linkedin">💼 LinkedIn Profile</button>
      <button className="but call">📞 Call Direct</button>
    </div>
  </div>

  {/* Location Info */}
  <div className="spcard cocard">
    <h3 className="sidebar-title">Location</h3>
    <div className="location">
      <div className="location-icon">🏦</div>
      <p>
        National Trust Bank <br />
        Downtown Financial District <br />
        123 Banking Street, Suite 456 <br />
        Financial City, FC 12345
      </p>
      <button className="but-map">View on Map</button>
    </div>
  </div>

</div>

        </div>

        {/* Response Time Promise */}
        <section
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
            borderRadius: "20px",
            padding: "50px 30px",
            textAlign: "center",
            marginBottom: "50px",
            border: "1px solid rgba(148, 163, 184, 0.1)",
          }}
        >
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>⚡</div>
            <h3
              style={{
                color: "#f8fafc",
                fontSize: "24px",
                fontWeight: "bold",
                marginBottom: "16px",
              }}
            >
              Fast Response Guarantee
            </h3>
            <p
              style={{
                color: "#cbd5e1",
                fontSize: "16px",
                lineHeight: "1.6",
                marginBottom: "25px",
              }}
            >
              I understand that banking needs can be urgent. I'm committed to
              responding to all inquiries within 24 hours, and often much
              sooner. For urgent matters, please call or use WhatsApp for
              immediate assistance.
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "30px",
                flexWrap: "wrap",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    color: "#3b82f6",
                    fontSize: "20px",
                    fontWeight: "bold",
                    marginBottom: "4px",
                  }}
                >
                  &lt; 1 Hour
                </div>
                <div style={{ color: "#cbd5e1", fontSize: "12px" }}>
                  WhatsApp Response
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    color: "#3b82f6",
                    fontSize: "20px",
                    fontWeight: "bold",
                    marginBottom: "4px",
                  }}
                >
                  &lt; 4 Hours
                </div>
                <div style={{ color: "#cbd5e1", fontSize: "12px" }}>
                  Email Response
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    color: "#3b82f6",
                    fontSize: "20px",
                    fontWeight: "bold",
                    marginBottom: "4px",
                  }}
                >
                  &lt; 24 Hours
                </div>
                <div style={{ color: "#cbd5e1", fontSize: "12px" }}>
                  Detailed Consultation
                </div>
              </div>
            </div>
          </div>
          {/* Responsive Styles */}
          <style jsx>{`
            @media (max-width: 768px) {
              .main-grid {
                grid-template-columns: 1fr !important;
                gap: 30px !important;
              }
              .contact-methods {
                grid-template-columns: 1fr !important;
              }
              .form-row {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>
        </section>
      </div>
    </div>
  );
};

export default ContactMe;
