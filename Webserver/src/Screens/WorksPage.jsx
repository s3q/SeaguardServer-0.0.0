import React, { useEffect, useState } from "react";
import "../css/works.css";

const achievements = [
  {
    year: "2023",
    title: "Top Performer Award",
    description:
      "Achieved highest customer satisfaction rating in the regional branch network",
    category: "Excellence",
  },
  {
    year: "2022",
    title: "Digital Innovation Leader",
    description:
      "Led implementation of new mobile banking features, increasing customer engagement by 40%",
    category: "Innovation",
  },
  {
    year: "2021",
    title: "Risk Management Certification",
    description:
      "Completed advanced certification in financial risk assessment and mitigation",
    category: "Certification",
  },
  {
    year: "2020",
    title: "Client Relationship Excellence",
    description:
      "Managed portfolio of 200+ high-value clients with 99% retention rate",
    category: "Achievement",
  },
];
const projects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    category: "fullstack",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=300&fit=crop",
    description:
      "A modern e-commerce platform built with React and Node.js, featuring real-time inventory management and secure payment processing.",
    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
    liveUrl: "#",
    githubUrl: "#",
    featured: true,
  },
  {
    id: 2,
    title: "AI-Powered Dashboard",
    category: "frontend",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop",
    description:
      "Interactive dashboard with AI analytics, data visualization, and real-time monitoring capabilities.",
    technologies: ["React", "D3.js", "Chart.js", "TensorFlow.js"],
    liveUrl: "#",
    githubUrl: "#",
    featured: true,
  },
  {
    id: 3,
    title: "Task Management API",
    category: "backend",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=300&fit=crop",
    description:
      "RESTful API for task management with authentication, real-time updates, and comprehensive documentation.",
    technologies: ["Node.js", "Express", "PostgreSQL", "Socket.io"],
    liveUrl: "#",
    githubUrl: "#",
    featured: false,
  },
  {
    id: 4,
    title: "Mobile Banking App",
    category: "mobile",
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=500&h=300&fit=crop",
    description:
      "Secure mobile banking application with biometric authentication and seamless user experience.",
    technologies: ["React Native", "Firebase", "Redux", "Biometrics"],
    liveUrl: "#",
    githubUrl: "#",
    featured: true,
  },
  {
    id: 5,
    title: "Portfolio Website",
    category: "frontend",
    image:
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=500&h=300&fit=crop",
    description:
      "Responsive portfolio website with modern design, smooth animations, and optimized performance.",
    technologies: ["React", "CSS3", "Framer Motion", "Webpack"],
    liveUrl: "#",
    githubUrl: "#",
    featured: false,
  },
  {
    id: 6,
    title: "Social Media Analytics",
    category: "fullstack",
    image:
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500&h=300&fit=crop",
    description:
      "Comprehensive social media analytics platform with sentiment analysis and engagement tracking.",
    technologies: ["Python", "Django", "React", "PostgreSQL"],
    liveUrl: "#",
    githubUrl: "#",
    featured: false,
  },
];

const categories = [
  { key: "all", label: "All Projects", count: projects.length },
  {
    key: "featured",
    label: "Featured",
    count: projects.filter((p) => p.featured).length,
  },
  {
    key: "fullstack",
    label: "Full Stack",
    count: projects.filter((p) => p.category === "fullstack").length,
  },
  {
    key: "frontend",
    label: "Frontend",
    count: projects.filter((p) => p.category === "frontend").length,
  },
  {
    key: "backend",
    label: "Backend",
    count: projects.filter((p) => p.category === "backend").length,
  },
  {
    key: "mobile",
    label: "Mobile",
    count: projects.filter((p) => p.category === "mobile").length,
  },
];


const WorksPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [hoveredProject, setHoveredProject] = useState(null);

  const filteredProjects = projects.filter((project) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "featured") return project.featured;
    return project.category === activeFilter;
  });
  

  return (
    <div className="works" style={{}}>
      <div className="title-divider">My Works & Projects</div>

      {/* Filter Navigation */}
      <div className="filter-nav" style={{}}>
        {categories.map((category) => (
          <button
            key={category.key}
            onClick={() => setActiveFilter(category.key)}
            style={{
              background:
                activeFilter === category.key
                  ? "linear-gradient(135deg, #a06043, #b86d4a)"
                  : "rgba(0, 0, 0, 0.3)",

              border:
                activeFilter === category.key
                  ? "2px solid #a06043"
                  : "2px solid rgba(160, 96, 67, 0.5)",
              color: activeFilter === category.key ? "white" : "#ffccb5",

              boxShadow:
                activeFilter === category.key
                  ? "0 0 20px rgba(160, 96, 67, 0.5)"
                  : "none",
            }}
            onMouseEnter={(e) => {
              if (activeFilter !== category.key) {
                e.target.style.borderColor = "#a06043";
                e.target.style.color = "white";
                e.target.style.boxShadow = "0 0 15px rgba(160, 96, 67, 0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (activeFilter !== category.key) {
                e.target.style.borderColor = "rgba(160, 96, 67, 0.5)";
                e.target.style.color = "#ffccb5";
                e.target.style.boxShadow = "none";
              }
            }}
          >
            {category.label}
            <span style={{}}>{category.count}</span>
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="proj-grid" style={{}}>
        {filteredProjects.map((project, index) => (
          <div className="proj-card" key={project.id}>
            {/* Featured Badge */}
            {project.featured && (
              <div
                className="card-edge"
                style={{
                  position: "absolute",
                  top: "15px",
                  right: "15px",
                  backgroundColor: "#a06043",
                  color: "white",
                  padding: "5px 12px",
                  borderRadius: "15px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  zIndex: 2,
                  boxShadow: "0 0 15px rgba(160, 96, 67, 0.7)",
                }}
              >
                FEATURED
              </div>
            )}

            {/* Project Image */}
            <div className="card-img">
              <img src={project.image} alt={project.title} />
              {/* Overlay on hover */}
              <div className="card-overlay">
                <button
                  style={{
                    backgroundColor: "white",
                    border: "none",
                    padding: "12px 20px",
                    borderRadius: "25px",
                    color: "#a06043",
                    fontWeight: "bold",
                    cursor: "pointer",
                    fontSize: "14px",
                    transition: "transform 0.2s ease",
                  }}
                >
                  Live Demo
                </button>
                <button className="button-outline">GitHub</button>
              </div>
            </div>

            {/* Project Content */}
            <div className="card-content" style={{}}>
              <h5 className="sph-light">{project.title}</h5>

              <p className="content-desc">{project.description}</p>

              {/* Technologies */}
              {/* Technologies */}
              <div className="technologies-container">
                {project.technologies.map((tech, techIndex) => (
                  <span key={techIndex} className="technology-badge">
                    {tech}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                }}
              >
                <button
                  className="button-outline"
                  style={{
                    flex: 1,
                  }}
                >
                  View Details
                </button>
                <button
                  className="custom-btn-outline"
                  style={{
                    flex: 1,
                  }}
                >
                  Source Code
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="last-section">
        {/* Stats Section */}
        <div className="proj-stat spcard">
          <h3 className="sph" style={{ marginBottom: 20 }}>
            Project Statistics
          </h3>
          <div
            className="stats-section"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "30px",
              textAlign: "center",
            }}
          >
            <div>
              <h2
                className="sph stat-number"
                style={{
                  marginBottom: "8px",
                }}
                data-target={projects.length}
                data-suffix=""
              >
                {projects.length}
              </h2>
              <p style={{}}>Total Projects</p>
            </div>
            <div>
              <h2
                className="sph stat-number"
                style={{
                  marginBottom: "8px",
                }}
                data-target={projects.filter((p) => p.featured).length}
                data-suffix=""
              ></h2>
              <p>Featured Works</p>
            </div>
            <div>
              <h2
                className="sph stat-number"
                style={{
                  marginBottom: "8px",
                }}
                data-target={
                  [...new Set(projects.flatMap((p) => p.technologies))].length
                }
                data-suffix=""
              >
                {/* {[...new Set(projects.flatMap((p) => p.technologies))].length} */}
              </h2>
              <p>Technologies Used</p>
            </div>
            <div>
              <h2
                className="sph stat-number"
                style={{
                  marginBottom: "8px",
                }}
                data-target="100"
                data-suffix="%"
              ></h2>
              <p>Client Satisfaction</p>
            </div>
          </div>
        </div>

        <div style={{ flex: 0.1 }}></div>

        {/* Call to Action */}
        <div className="callaction spcard">
          <h3 className="sph">Have a Project in Mind?</h3>
          <p
            style={{
              fontSize: "18px",
            }}
          >
            I'm always excited to collaborate on new projects and bring
            innovative ideas to life. Let's discuss how we can work together to
            create something amazing.
          </p>
          <button className="btn-gradient-purple">Start a Project</button>
        </div>
      </div>

      <div className="achivments-container">
        <div className="title-divider" style={{ marginBottom: "20px" }}>
          Achivments
        </div>

        <div style={{ margin: "30px auto", maxWidth: 800 }}>
          <p>
            A personal brief, also known as a personal profile or personal
            statement, is a concise introduction on a resume or application that
            highlights your
          </p>
        </div>
        <div className="achivments-grid">
          {achievements.map((achievement, index) => (
            <div className="achievement-card" key={index}>
              <div className="achievement-year">{achievement.year}</div>
              <div className="achievement-content">
                <span className="achievement-category">
                  {achievement.category}
                </span>
                <h3 className="achievement-title">{achievement.title}</h3>
                <p className="achievement-description">
                  {achievement.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .projects-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .filter-buttons {
            flex-direction: column !important;
            align-items: center !important;
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 20px !important;
          }
        }
        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default WorksPage;
