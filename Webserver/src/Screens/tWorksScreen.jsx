import React, { useState, useEffect } from 'react';

export const BankingPortfolio = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [animatedStats, setAnimatedStats] = useState({ experience: 0, clients: 0, transactions: 0, satisfaction: 0 });

  // Animate statistics on component mount
  useEffect(() => {
    const targets = { experience: 8, clients: 500, transactions: 10000, satisfaction: 98 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setAnimatedStats({
        experience: Math.floor(targets.experience * progress),
        clients: Math.floor(targets.clients * progress),
        transactions: Math.floor(targets.transactions * progress),
        satisfaction: Math.floor(targets.satisfaction * progress)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedStats(targets);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const services = [
    {
      icon: '🏦',
      title: 'Retail Banking',
      description: 'Expert in personal banking services, account management, and customer financial consultation.',
      skills: ['Account Management', 'Customer Service', 'Financial Planning', 'Loan Processing']
    },
    {
      icon: '📊',
      title: 'Investment Advisory',
      description: 'Providing strategic investment advice and portfolio management for high-net-worth clients.',
      skills: ['Portfolio Analysis', 'Risk Assessment', 'Market Research', 'Client Advisory']
    },
    {
      icon: '🔒',
      title: 'Risk Management',
      description: 'Specialized in identifying, analyzing, and mitigating financial risks across banking operations.',
      skills: ['Credit Analysis', 'Compliance', 'Regulatory Knowledge', 'Risk Assessment']
    },
    {
      icon: '💳',
      title: 'Digital Banking',
      description: 'Leading digital transformation initiatives and online banking platform optimization.',
      skills: ['Digital Platforms', 'Process Automation', 'Customer Experience', 'Technology Integration']
    }
  ];

  const achievements = [
    {
      year: '2023',
      title: 'Top Performer Award',
      description: 'Achieved highest customer satisfaction rating in the regional branch network',
      category: 'Excellence'
    },
    {
      year: '2022',
      title: 'Digital Innovation Leader',
      description: 'Led implementation of new mobile banking features, increasing customer engagement by 40%',
      category: 'Innovation'
    },
    {
      year: '2021',
      title: 'Risk Management Certification',
      description: 'Completed advanced certification in financial risk assessment and mitigation',
      category: 'Certification'
    },
    {
      year: '2020',
      title: 'Client Relationship Excellence',
      description: 'Managed portfolio of 200+ high-value clients with 99% retention rate',
      category: 'Achievement'
    }
  ];

  const experience = [
    {
      position: 'Senior Banking Advisor',
      company: 'National Trust Bank',
      period: '2020 - Present',
      description: 'Lead banking advisor managing premium client relationships and complex financial products.',
      achievements: ['Increased client portfolio by 150%', 'Implemented new digital onboarding process', 'Mentored 5 junior advisors']
    },
    {
      position: 'Relationship Manager',
      company: 'Capital Finance Group',
      period: '2018 - 2020',
      description: 'Managed corporate banking relationships and structured financial solutions.',
      achievements: ['Generated $2M+ in new business', 'Reduced client churn by 25%', 'Streamlined loan approval process']
    },
    {
      position: 'Banking Associate',
      company: 'Regional Community Bank',
      period: '2016 - 2018',
      description: 'Provided comprehensive banking services to retail and small business clients.',
      achievements: ['Exceeded sales targets by 30%', 'Improved customer satisfaction scores', 'Specialized in small business lending']
    }
  ];

  return (
    <div style={{ 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      minHeight: '100vh'
    }}>
      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
        padding: '0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          height: '70px'
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent'
          }}>
            Banking Professional
          </div>
          <div style={{ display: 'flex', gap: '30px' }}>
            {['About', 'Services', 'Experience', 'Achievements', 'Contact'].map((item) => (
              <button
                key={item}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#e2e8f0',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(59, 130, 246, 0.1)';
                  e.target.style.color = '#3b82f6';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'none';
                  e.target.style.color = '#e2e8f0';
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </nav>
      <div style={{height: '100vh', overflow: 'scroll', paddingTop: 100}}>

      {/* Hero Section */}
      <section style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '70px 20px 0',
        background: 'radial-gradient(ellipse at top, rgba(59, 130, 246, 0.1) 0%, transparent 50%)'
      }}>
        <div style={{
          maxWidth: '1200px',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '60px',
          alignItems: 'center'
        }}>
          {/* Left Content */}
          <div>
            <div style={{
              fontSize: '18px',
              color: '#3b82f6',
              fontWeight: '600',
              marginBottom: '20px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Banking Professional
            </div>
            <h1 style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#f8fafc',
              lineHeight: '1.2',
              marginBottom: '24px'
            }}>
              Transforming Financial
              <span style={{
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                display: 'block'
              }}>
                Futures Together
              </span>
            </h1>
            <p style={{
              fontSize: '20px',
              color: '#cbd5e1',
              lineHeight: '1.7',
              marginBottom: '40px'
            }}>
              With over 8 years of experience in banking and financial services, I specialize in 
              building lasting client relationships and delivering innovative financial solutions.
            </p>
            
            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <button style={{
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: 'white',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 15px 35px rgba(59, 130, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.3)';
              }}>
                View My Services
              </button>
              <button style={{
                background: 'transparent',
                color: '#3b82f6',
                border: '2px solid #3b82f6',
                padding: '14px 30px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#3b82f6';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#3b82f6';
              }}>
                Download Resume
              </button>
            </div>
          </div>

          {/* Right Content - Stats */}
          <div style={{
            background: 'rgba(148, 163, 184, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            borderRadius: '20px',
            padding: '40px'
          }}>
            <h3 style={{
              color: '#f8fafc',
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '30px',
              textAlign: 'center'
            }}>
              Professional Highlights
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '30px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: '#3b82f6',
                  marginBottom: '8px'
                }}>
                  {animatedStats.experience}+
                </div>
                <div style={{ color: '#cbd5e1', fontSize: '14px' }}>Years Experience</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: '#3b82f6',
                  marginBottom: '8px'
                }}>
                  {animatedStats.clients}+
                </div>
                <div style={{ color: '#cbd5e1', fontSize: '14px' }}>Clients Served</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: '#3b82f6',
                  marginBottom: '8px'
                }}>
                  {animatedStats.transactions.toLocaleString()}+
                </div>
                <div style={{ color: '#cbd5e1', fontSize: '14px' }}>Transactions Processed</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: '#3b82f6',
                  marginBottom: '8px'
                }}>
                  {animatedStats.satisfaction}%
                </div>
                <div style={{ color: '#cbd5e1', fontSize: '14px' }}>Client Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section style={{
        padding: '80px 20px',
        background: 'rgba(15, 23, 42, 0.5)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{
              fontSize: '40px',
              fontWeight: 'bold',
              color: '#f8fafc',
              marginBottom: '16px'
            }}>
              Banking Services & Expertise
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#cbd5e1',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Comprehensive financial solutions tailored to meet your banking and investment needs
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '30px'
          }}>
            {services.map((service, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(148, 163, 184, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(148, 163, 184, 0.1)',
                  borderRadius: '16px',
                  padding: '30px',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-8px)';
                  e.target.style.boxShadow = '0 20px 40px rgba(59, 130, 246, 0.1)';
                  e.target.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.borderColor = 'rgba(148, 163, 184, 0.1)';
                }}
              >
                <div style={{
                  fontSize: '40px',
                  marginBottom: '20px',
                  textAlign: 'center'
                }}>
                  {service.icon}
                </div>
                <h3 style={{
                  color: '#f8fafc',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  marginBottom: '16px',
                  textAlign: 'center'
                }}>
                  {service.title}
                </h3>
                <p style={{
                  color: '#cbd5e1',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  marginBottom: '20px'
                }}>
                  {service.description}
                </p>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  {service.skills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        color: '#3b82f6',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section style={{ padding: '80px 20px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{
              fontSize: '40px',
              fontWeight: 'bold',
              color: '#f8fafc',
              marginBottom: '16px'
            }}>
              Professional Experience
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#cbd5e1'
            }}>
              A journey of growth and excellence in banking and financial services
            </p>
          </div>

          <div style={{ position: 'relative' }}>
            {/* Timeline Line */}
            <div style={{
              position: 'absolute',
              left: '50%',
              top: '0',
              bottom: '0',
              width: '2px',
              background: 'linear-gradient(180deg, transparent, #3b82f6, transparent)',
              transform: 'translateX(-50%)'
            }} />

            {experience.map((exp, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '60px',
                flexDirection: index % 2 === 0 ? 'row' : 'row-reverse'
              }}>
                {/* Timeline Node */}
                <div style={{
                  position: 'absolute',
                  left: '50%',
                  width: '16px',
                  height: '16px',
                  background: '#3b82f6',
                  borderRadius: '50%',
                  transform: 'translateX(-50%)',
                  boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
                  zIndex: 2
                }} />

                {/* Content */}
                <div style={{
                  width: '45%',
                  background: 'rgba(148, 163, 184, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(148, 163, 184, 0.1)',
                  borderRadius: '16px',
                  padding: '30px',
                  marginLeft: index % 2 === 0 ? '0' : 'auto',
                  marginRight: index % 2 === 0 ? 'auto' : '0'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: '16px'
                  }}>
                    <div>
                      <h3 style={{
                        color: '#f8fafc',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        marginBottom: '8px'
                      }}>
                        {exp.position}
                      </h3>
                      <div style={{ color: '#3b82f6', fontSize: '16px', fontWeight: '600' }}>
                        {exp.company}
                      </div>
                    </div>
                    <span style={{
                      background: 'rgba(59, 130, 246, 0.1)',
                      color: '#3b82f6',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {exp.period}
                    </span>
                  </div>
                  <p style={{
                    color: '#cbd5e1',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    marginBottom: '20px'
                  }}>
                    {exp.description}
                  </p>
                  <div>
                    <h4 style={{
                      color: '#f8fafc',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '12px'
                    }}>
                      Key Achievements:
                    </h4>
                    <ul style={{
                      listStyle: 'none',
                      padding: '0',
                      margin: '0'
                    }}>
                      {exp.achievements.map((achievement, achIndex) => (
                        <li key={achIndex} style={{
                          color: '#cbd5e1',
                          fontSize: '13px',
                          marginBottom: '6px',
                          paddingLeft: '16px',
                          position: 'relative'
                        }}>
                          <span style={{
                            position: 'absolute',
                            left: '0',
                            color: '#3b82f6'
                          }}>
                            ✓
                          </span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section style={{
        padding: '80px 20px',
        background: 'rgba(15, 23, 42, 0.5)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{
              fontSize: '40px',
              fontWeight: 'bold',
              color: '#f8fafc',
              marginBottom: '16px'
            }}>
              Awards & Achievements
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#cbd5e1'
            }}>
              Recognition for excellence and innovation in banking services
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '25px'
          }}>
            {achievements.map((achievement, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(148, 163, 184, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(148, 163, 184, 0.1)',
                  borderRadius: '16px',
                  padding: '25px',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-5px)';
                  e.target.style.boxShadow = '0 15px 30px rgba(59, 130, 246, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '0',
                  right: '0',
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '0 16px 0 16px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {achievement.year}
                </div>
                <div style={{
                  marginTop: '20px'
                }}>
                  <span style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    color: '#3b82f6',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {achievement.category}
                  </span>
                  <h3 style={{
                    color: '#f8fafc',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    margin: '16px 0 12px 0'
                  }}>
                    {achievement.title}
                  </h3>
                  <p style={{
                    color: '#cbd5e1',
                    fontSize: '14px',
                    lineHeight: '1.5'
                  }}>
                    {achievement.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section style={{
        padding: '80px 20px',
        background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '40px',
            fontWeight: 'bold',
            color: '#f8fafc',
            marginBottom: '20px'
          }}>
            Let's Discuss Your Financial Goals
          </h2>
          <p style={{
            fontSize: '18px',
            color: '#cbd5e1',
            marginBottom: '40px',
            lineHeight: '1.6'
          }}>
            Ready to take the next step in your financial journey? I'm here to provide 
            expert guidance and personalized banking solutions tailored to your needs.
          </p>
          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button style={{
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: 'white',
              border: 'none',
              padding: '16px 32px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 15px 35px rgba(59, 130, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.3)';
            }}>
              Schedule Consultation
            </button>
            <button style={{
              background: 'transparent',
              color: '#3b82f6',
              border: '2px solid #3b82f6',
              padding: '14px 30px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#3b82f6';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#3b82f6';
            }}>
              View Credentials
            </button>
          </div>
        </div>
      </section>
      

      {/* Footer */}
      <footer style={{
        padding: '40px 20px',
        background: 'rgba(15, 23, 42, 0.9)',
        borderTop: '1px solid rgba(148, 163, 184, 0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div style={{
            color: '#cbd5e1',
            fontSize: '14px'
          }}>
            © 2024 Banking Professional Portfolio. All rights reserved.
          </div>
          <div style={{
            display: 'flex',
            gap: '20px'
          }}>
            {['LinkedIn', 'Email', 'Phone'].map((contact) => (
              <button
                key={contact}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = '#3b82f6'}
                onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
              >
                {contact}
              </button>
            ))}
          </div>
        </div>
      </footer>
      
      
</div>

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
            text-align: center;
          }
          .hero-title {
            font-size: 36px !important;
      }
            `
      }</style>
     </div>);
}