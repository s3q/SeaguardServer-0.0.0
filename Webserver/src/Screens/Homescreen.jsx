import React, { Component, useEffect, useState } from "react";
import { Navbar, Nav, Container, Row } from "react-bootstrap";
import "../css/home.css";
import profileImg from "../assets/mbg.png";
import SkillsCylinder from "../components/SkillsCylinder";
import TypewriterEffect from "../components/TypewriterEffect";
import WorksPage from "./WorksPage";
import AboutPage from "./AboutPage";
import FooterHomePage from "./FooterHomePage";

import "../js/home.js"
import ContactMe from "./ContactPage.jsx";

const styles = {
  main: {
    background: "",
  },
  navlink: {},
};

const skills = [
  "Team Management",
  "Team Leadership",
  "Communication",
  "Business Relationship Management",
  "Leadership",
  "Credit Recovery",
  "Collection Strategy",
  "Business Analysis",
  "Mergers & Acquisitions (M&A)",
];

const skill2s = [
    { name: "Team Management", level: 90 },
    { name:  "Team Leadership", level: 85 },
    { name:  "Communication", level: 80 },
    { name:  "Business Relationship Management", level: 75 },
    { name: "Leadership", level: 88 },
    { name:  "Credit Recovery", level: 70 },
    { name: "Collection Strategy", level: 88 },
    { name:  "Business Analysis", level: 80 },
    { name:  "Mergers & Acquisitions (M&A)", level: 80 },
  ];

  const experiences = [
    {
      title: 'Senior Frontend Developer',
      company: 'Tech Solutions Inc.',
      period: '2022 - Present',
      description: 'Leading frontend development team, building scalable React applications'
    },
    {
      title: 'Full Stack Developer',
      company: 'Digital Agency',
      period: '2020 - 2022', 
      description: 'Developed web applications using MERN stack, improved performance by 40%'
    },
    {
      title: 'Junior Developer',
      company: 'StartupCo',
      period: '2019 - 2020',
      description: 'Built responsive websites and learned modern development practices'
    }
  ];

export default function () {
  const [skill, setSkill] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setSkill((prev) => (skills.length - 1 == prev ? 0 : prev + 1));
    }, 2000); // change skill every 2s
    return () => clearInterval(interval);
  }, []);

   useEffect(() => {
    const cards = document.querySelectorAll(".spcard, .spcard-light, .timeline-content");

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("showing-inscroll");
          observer.unobserve(entry.target); // run once
        }
      });
    }, { threshold: 0.2 });

    cards.forEach(card => observer.observe(card));

    // Cleanup on unmount
    return () => observer.disconnect();
  }, []);

useEffect(() => {
  // document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".stats-section");
  console.log(sections);

  const animateCounter = (el, target, suffix, duration) => {
    let start = null;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const value = Math.min(
        Math.floor((progress / duration) * target),
        target
      );
      el.textContent = value + (suffix || "");

      if (progress < duration) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries, observer) => {
      console.log(entries);
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const counters = entry.target.querySelectorAll(".stat-number");
          counters.forEach((counter) => {
            const target = +counter.getAttribute("data-target");
            const suffix = counter.getAttribute("data-suffix");
            const duration = +counter.getAttribute("data-duration") || 2000; // default 2s
            animateCounter(counter, target, suffix,  duration);
          });

          observer.unobserve(entry.target); // Run once per section
        }
      });
    },
    { threshold: 0.3 } // Trigger when 30% visible
  );

  sections.forEach((section) => observer.observe(section));
// });
 }, []);


  return (
    <div className="main ">
      
      <Navbar expand="lg" className="px-3 navbar " data-bs-theme="dark" >
        <Container>
          {/* Brand with image and name */}
          <Navbar.Brand
            href="#home"
            className="d-flex align-items-center nav-title"
          >
            {/* <img
              src={profileImg} // replace with your image URL
              alt="Yunos"
              width="40"
              height="40"
              className="d-inline-block align-top me-2" 
            /> */}
            Seaguard 0.0.0
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {" "}
              {/* Push links to the right */}
              <Nav.Link href="#home" className="mx-2 nav-link">
                Home
              </Nav.Link>
              <Nav.Link href="#about" className="mx-2 nav-link">
                About
              </Nav.Link>
              <Nav.Link href="#works" className="mx-2 nav-link">
                Works
              </Nav.Link>
              <Nav.Link href="#link4" className="mx-2 nav-link">
                Blogs
              </Nav.Link>
              <Nav.Link href="#link5" className="mx-2 nav-link">
                Service
              </Nav.Link>
              <Nav.Link href="#link6" className="mx-2 nav-link">
                Contact
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="overflow-auto h-100 body" id="#home">
        <div  id="home"></div>
        <div className="leading-container ">
          <div className="profile-container">
  

            <img
              src={profileImg}
              alt="Seaguard"
              className="profile-img"
            /> 
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
              viewBox="0 0 800 800"
            >
              <rect fill="#000000" width="800" height="800" />
              <g fill-opacity="1">
                <circle fill="#000000" cx="400" cy="400" r="600" />
                <circle fill="#001b25" cx="400" cy="400" r="500" />
                <circle fill="#022a35" cx="400" cy="400" r="400" />
                <circle fill="#163a46" cx="400" cy="400" r="300" />
                <circle fill="#294b58" cx="400" cy="400" r="200" />
                <circle fill="#3B5D6A" cx="400" cy="400" r="100" />
              </g>
            </svg> */}
          </div>
          <div className=" flex-column" style={{ display: "flex", flex: 1 }}>
            <div className="leading-info ">
              <h1 className="big-name">Seaguard</h1>
              <h1 className="big-name"></h1>
              <h3 className="skills-text">
                I have skills on <TypewriterEffect texts={skills} />
              </h3>
              <div></div>

              <p>
                A personal brief, also known as a personal profile or personal
                statement, is a concise introduction on a resume or application
                that highlights your
              </p>
            </div>

            <div className="leading-links" id="about">
              <a>
                <i class="fa-brands fa-instagram"></i>
              </a>
              <a>
                <i class="fa-brands fa-linkedin"></i>
              </a>
              <a>
                <i class="fa-brands fa-x-twitter"></i>
              </a>
              <a>
                <i class="fa-brands fa-discord"></i>
              </a>
              <a>
                <i class="fa-brands fa-youtube"></i>
              </a>
            </div>
          </div>
        </div>
        <h2></h2>
        {/* <div className="leading-stat">
          <div className="stat-item">
            <p>
              {" "}
              visitor<span>500+</span>
            </p>
          </div>
          <div className="stat-item">
            <p>
              {" "}
              Linkedin folowers<span>10k+</span>
            </p>
          </div>
          <div className="stat-item">
            <p>
              {" "}
              Projects<span>11+</span>
            </p>
          </div>
          <div className="stat-item">
            <p>
              {" "}
              Year of experince<span>20+</span>
            </p>
          </div>
        </div> */}
        <AboutPage/>

        <WorksPage/>

        <ContactMe/>

        <FooterHomePage/>


        
      </div>
    </div>
  );
}


