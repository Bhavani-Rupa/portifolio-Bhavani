import { motion, useScroll, useTransform, useSpring, useMotionValue, useVelocity, useAnimationFrame } from 'framer-motion';
import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { appwriteService } from '../services/appwrite';
import { fallbackSkills, fallbackProjects, fallbackProfileImage } from '../data/fallbackData';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import '../styles/smoothScroll.css';
import resume from '../assets/Bhavani- ATS Resume.pdf';

// Optimize parallax mouse movement effect
function useMouseParallax(strength = 1.5) { // Reduced strength for better performance
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let animationFrameId;
    let lastTime = 0;
    const throttle = 32; // Reduced to ~30fps for better performance

    const handleMouseMove = (e) => {
      const currentTime = performance.now();
      if (currentTime - lastTime < throttle) return;
      lastTime = currentTime;

      const x = (e.clientX / window.innerWidth - 0.5) * strength;
      const y = (e.clientY / window.innerHeight - 0.5) * strength;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [strength]);

  return mousePosition;
}

// Optimize parallax scroll effect
function useParallaxScroll(value, springConfig = { stiffness: 100, damping: 30 }) {
  const spring = useSpring(value, springConfig);
  const velocity = useVelocity(spring);
  const smoothVelocity = useSpring(velocity, {
    stiffness: 80,
    damping: 40,
    mass: 0.2
  });

  useAnimationFrame((time, delta) => {
    if (delta < 100) {
      spring.set(value.get());
    }
  });

  return { spring, smoothVelocity };
}

const Home = () => {
  const containerRef = useRef(null);
  const heroRef = useRef(null);

  const aboutRef = useRef(null);
  const skillsRef = useRef(null);
  const experienceRef = useRef(null);
  const interestsRef = useRef(null);
  const softSkillsRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);

  // State for data
  const [frontendSkills, setFrontendSkills] = useState(fallbackSkills.frontend);
  const [backendSkills, setBackendSkills] = useState(fallbackSkills.backend);
  
  const [softSkills, setSoftSkills] = useState(fallbackSkills.soft);
  const [projectsList, setProjectsList] = useState(fallbackProjects);
  const [currentProject, setCurrentProject] = useState(0);
  const [profileImageUrl, setProfileImageUrl] = useState(fallbackProfileImage);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add state for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch data from Appwrite
  const fetchData = useCallback(async () => {
    try {
      const [
        profileImage,
        frontendData,
        backendData,
        softData,
        projectsData
      ] = await Promise.all([
        appwriteService.getProfileImage('profile'),
        appwriteService.getFrontendSkills(),
        appwriteService.getBackendSkills(),
        appwriteService.getSoftSkills(),
        appwriteService.getProjects()
      ]);

      if (profileImage) setProfileImageUrl(profileImage.href);
      
      // Format frontend skills consistently
      if (frontendData?.length) {
        setFrontendSkills(frontendData.map(skill => ({
          name: skill.skillName,
          level: parseInt(skill.proficiency || skill.level || 0)
        })));
      }
      
      // Format backend skills consistently
      if (backendData?.length) {
        setBackendSkills(backendData.map(skill => ({
          name: skill.skillName,
          level: parseInt(skill.proficiency || skill.level || 0)
        })));
      }
      
      
      // Format soft skills consistently
      if (softData?.length) {
        setSoftSkills(softData.map(skill => ({
          name: skill.name || '',
          icon: skill.icon || '✨',
          description: skill.description || '',
          keywords: Array.isArray(skill.keywords) ? skill.keywords : 
                   (typeof skill.keywords === 'string' ? skill.keywords.split(',').map(k => k.trim()) : [])
        })));
      }
      
      if (projectsData?.length) setProjectsList(projectsData);

      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Smooth scroll progress
  const { scrollY } = useScroll();
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Memoize the parallax elements
  const parallaxElements = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => ({ // Reduced number of elements
      id: i,
      depth: Math.random() * 2 + 1, // Reduced depth range
      size: Math.random() * 60 + 30, // Reduced size range
      left: Math.random() * 100,
      top: Math.random() * 100
    }));
  }, []);

  // Optimize smooth transforms
  const smoothTransform = useMemo(() => ({
    type: "spring",
    stiffness: 60,
    damping: 20,
    restDelta: 0.001
  }), []);

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["50% start", "end start"]
  });

  const { scrollYProgress: aboutScroll } = useScroll({
    target: aboutRef,
    offset: ["70% start", "end start"]
  });

  const { scrollYProgress: skillsScroll } = useScroll({
    target: skillsRef,
    offset: ["70% start", "end start"]
  });

  const { scrollYProgress: experienceScroll } = useScroll({
    target: experienceRef,
    offset: ["70% start", "end start"]
  });

  const { scrollYProgress: interestsScroll } = useScroll({
    target: interestsRef,
    offset: ["70% start", "end start"]
  });

  const { scrollYProgress: projectsScroll } = useScroll({
    target: projectsRef,
    offset: ["30% start", "end start"]
  });

  const { scrollYProgress: contactScroll } = useScroll({
    target: contactRef,
    offset: ["start start", "end 0%"]
  });

  const { scrollYProgress: softSkillsScroll } = useScroll({
    target: softSkillsRef,
    offset: ["80% start", "end start"]
  });

  const heroY = useTransform(heroScroll, [0, 1], ["0%", "35%"]);
  const heroOpacity = useTransform(heroScroll, [0, 1], [1, 0]);

  const aboutY = useTransform(aboutScroll, [0, 1], ["0%", "25%"]);
  const aboutOpacity = useTransform(aboutScroll, [0, 1], [1, 0]);

  const skillsY = useTransform(skillsScroll, [0, 1], ["0%", "40%"]);
  const skillsOpacity = useTransform(skillsScroll, [0, 1], [1, 0]);

  const experienceY = useTransform(experienceScroll, [0, 1], ["0%", "30%"]);
  const experienceOpacity = useTransform(experienceScroll, [0, 1], [1, 0]);

  const interestsY = useTransform(interestsScroll, [0, 1], ["0%", "60%"]);
  const interestsOpacity = useTransform(interestsScroll, [0, 1], [1, 0]);

  const projectsY = useTransform(projectsScroll, [0, 1], ["0%", "30%"]);
  const projectsOpacity = useTransform(projectsScroll, [0, 1], [1, 0]);

  const contactY = useTransform(contactScroll, [0, 1], ["0%", "30%"]);
  const contactOpacity = useTransform(contactScroll, [0, 1], [1, 0]);

  const softSkillsY = useTransform(softSkillsScroll, [0, 1], ["0%", "40%"]);
  const softSkillsOpacity = useTransform(softSkillsScroll, [0, 1], [1, 0]);

  // Auto-sliding carousel effect
  useEffect(() => {
    const slideTimer = setInterval(() => {
      nextProject();
    }, 6000); // Change slide every 6 seconds (slowed down from 3 seconds)

    return () => clearInterval(slideTimer); // Cleanup on unmount
  }, [projectsList.length]); // Reset timer when projects list changes

  const nextProject = () => {
    setCurrentProject((prev) => (prev + 1) % projectsList.length);
  };

  const prevProject = () => {
    setCurrentProject((prev) => (prev - 1 + projectsList.length) % projectsList.length);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -100; // Account for navbar height and extra padding
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.target);
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      });
      
      // Reset form and show success message
      e.target.reset();
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 5000); // Hide success message after 5 seconds
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResumeDownload = (e) => {
    e.preventDefault();
    // Open resume in new tab for preview
    window.open(resume, '_blank');
    // Trigger download
    const link = document.createElement('a');
    link.href = resume;
    link.download = 'Bhavani_ATS_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div ref={containerRef} className="relative min-h-screen bg-gray-900">
      {/* Optimize parallax background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {parallaxElements.map((element) => {
          const { id, depth, size, left, top } = element;
          
          const y = useTransform(
            smoothScrollY,
            [0, document.body.scrollHeight - window.innerHeight],
            [0, 100 / depth] // Reduced movement range
          );
          
          const opacity = useTransform(
            scrollY,
            [0, document.body.scrollHeight / 2, document.body.scrollHeight],
            [0.1, 0.2, 0.1] // Reduced opacity range
          );
          
          return (
            <motion.div
              key={id}
              className="absolute rounded-full bg-gradient-to-br from-blue-400/5 to-cyan-400/5"
              style={{
                width: size,
                height: size,
                left: `${left}%`,
                top: `${top}%`,
                y,
                opacity,
                scale: 1 + (0.2 / depth) // Reduced scale effect
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={smoothTransform}
            />
          );
        })}
      </div>

      {/* Hero Section */}
      <motion.div
        ref={heroRef}
        style={{
          y: heroY,
          opacity: heroOpacity,
        }}
        className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 text-center z-20 overflow-hidden pt-16 pb-12 md:pt-12 md:pb-8"
        id="home"
      >
        {/* Animated Background Grid */}
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-1 opacity-20 pointer-events-none">
          {[...Array(64)].map((_, i) => (
            <motion.div
              key={i}
              className="bg-blue-500/10 rounded-lg"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [0.8, 1, 0.8],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Glowing Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-96 h-96 rounded-full"
              style={{
                background: `radial-gradient(circle, ${i === 0 ? 'rgba(16,185,129,0.1)' : i === 1 ? 'rgba(45,212,191,0.1)' : 'rgba(20,184,166,0.1)'} 0%, transparent 70%)`,
                left: `${i * 30}%`,
                top: `${i * 20}%`,
              }}
              animate={{
                x: [0, 30, 0],
                y: [0, -30, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 5 + i * 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={smoothTransform}
          className="relative animate-float flex flex-col-reverse md:flex-row items-center justify-center gap-6 md:gap-12 p-6 z-30"
        >
          {/* Floating particles */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
              animate={{
                x: [Math.random() * 200 - 100, Math.random() * 200 - 100],
                y: [Math.random() * 200 - 100, Math.random() * 200 - 100],
                opacity: [0, 1, 0],
                scale: [0, Math.random() * 2, 0]
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: Math.random() * 2
              }}
            />
          ))}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="relative">
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-900 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"
                animate={{
                  opacity: [0.2, 0.4, 0.2],
                  scale: [0.98, 1.02, 0.98],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
              <h1 className="relative text-5xl md:text-7xl font-bold mb-3 tracking-tight">
                <span className="text-gradient inline-block leading-normal py-1 mix-blend-overlay">
                  Bhavani Boddu
                </span>
              </h1>
            </div>

            <div className="relative group">
              <motion.div
                className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-300"
                animate={{
                  scale: [0.98, 1.02, 0.98],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
              <h2 className="relative text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl font-medium tracking-tight  py-2 px-4 rounded-lg border border-gray-700/50 shadow-lg shadow-blue-500/5">
                Full Stack Developer 
              </h2>
            </div>

          <div className="flex flex-wrap gap-4 justify-center relative group mt-6">
            <motion.div
              className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-cyan-400/20 rounded-xl blur-xl opacity-75 group-hover:opacity-100 transition duration-300"
              animate={{
                scale: [0.98, 1.02, 0.98],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
            <button 
              onClick={() => scrollToSection('projects')} 
              className="btn-primary font-medium relative overflow-hidden group/btn"
            >
              <span className="relative z-10">View Projects</span>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-900 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </button>
            <button
              onClick={handleResumeDownload}
              className="btn-secondary font-medium relative overflow-hidden group/btn"
            >
              <span className="relative z-10">Download Resume</span>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </button>
          </div>
          </div>

          {/* Profile Image with Parallax */}
          <motion.div 
            className="w-56 h-56 md:w-72 md:h-72 mb-6 md:mb-0 rounded-full overflow-hidden border-4 border-blue-400/40 shadow-[0_0_30px_5px_rgba(59,130,246,0.3)] transition-all duration-300 hover:border-blue-400/70 hover:shadow-[0_0_40px_10px_rgba(59,130,246,0.5)] relative"
            whileHover={{ scale: 1.05 }}
            style={{
              perspective: 1000
            }}
          >
            <motion.div
              className="w-full h-full"
              animate={{
                rotateX: [0, 5, 0],
                rotateY: [0, -5, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            >
              <img 
                src={profileImageUrl || fallbackProfileImage} 
                alt="Profile" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.log('Image load error, falling back to local image');
                  e.target.src = fallbackProfileImage;
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Divider */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-blue-400/50 to-transparent shadow-lg shadow-blue-500/30"></div>

      {/* About Section */}
      <motion.section
        ref={aboutRef}
        style={{ y: aboutY, opacity: aboutOpacity }}
        className="relative py-20 px-4 bg-gray-900"
        id="about"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={smoothTransform}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient tracking-tight">
              About Me
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="card backdrop-blur-sm bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              <h3 className="text-xl font-bold mb-4 text-gradient text-center">Professional Journey</h3>
              <p className="text-gray-300 leading-relaxed">
               Completed certifications and workshops in Python Programming (NPTEL), Salesforce Development (Smart Internz), Advanced Excel (Internshala), and Mobile App Development (APSSDC). Presented and published a research paper on “Social Media Fake News Detection System” at ICACT 2025, showcasing technical expertise and research skills.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="card backdrop-blur-sm bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              <h3 className="text-xl font-bold mb-4 text-gradient text-center">Development Approach</h3>
              <p className="text-gray-300 leading-relaxed">
                I am dedicated to writing clean, maintainable, and efficient code while following industry best practices. I leverage test-driven development to ensure reliability and robustness in every project. By implementing continuous integration and deployment pipelines, I deliver high-quality software solutions that are scalable and maintainable. My focus is always on creating reliable, efficient, and professional software.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="card backdrop-blur-sm bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              <h3 className="text-xl font-bold mb-4 text-gradient text-center">Technical Expertise</h3>
              <p className="text-gray-300 leading-relaxed">
                Proficient in developing robust backend systems using Java Spring Boot and Node.js, ensuring scalability and performance. Skilled in creating intuitive and responsive user interfaces with React.js, delivering seamless user experiences. Adept at integrating frontend and backend components to build efficient, full-stack applications 
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="card backdrop-blur-sm bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              <h3 className="text-xl font-bold mb-4 text-gradient text-center">Problem Solving</h3>
              <p className="text-gray-300 leading-relaxed">
                Adept at analyzing complex problems and delivering efficient, scalable solutions.

Experienced in optimizing application performance while maintaining code quality and best practices.

Proficient in leveraging modern frameworks, tools, and technologies for innovative development.

Committed to continuous learning and staying updated with emerging industry trends.


              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="mt-8"
          >
            <div className="card backdrop-blur-sm bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <h3 className="text-xl font-bold mb-4 text-gradient text-center">Continuous Learning</h3>
              <p className="text-gray-300 text-center leading-relaxed">
                Dedicated to continuous professional growth by staying updated with emerging technologies and industry best practices.
                Proactively exploring and mastering new frameworks, tools, and methodologies to enhance development efficiency and innovation.
                capabilities and deliver cutting-edge solutions.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Divider */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-blue-400/50 to-transparent shadow-lg shadow-blue-500/30"></div>

      {/* Education Section */}
      <motion.section
        className="relative py-20 px-4 bg-gray-900"
        id="education"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={smoothTransform}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient tracking-tight">
              Education
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">My academic journey and qualifications that have shaped my technical foundation</p>
          </motion.div>

          <div className="space-y-12">
            {/* Bachelor's Degree */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={smoothTransform}
              viewport={{ once: true }}
              className="relative pl-8 md:pl-0 group"
            >
              <div className="md:grid md:grid-cols-12 md:gap-8 card backdrop-blur-sm bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]">
                <div className="md:col-span-3 mb-4 md:mb-0">
                  <div className="flex flex-col">
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-blue-400 font-semibold">2021 - 2025</span>
                    </div>
                    <span className="text-gray-400 text-sm ml-5">Bachelor of Technology</span>
                    <span className="text-gray-500 font-medium text-sm ml-5">Computer Science and Engineering</span>
                  </div>
                </div>
                <div className="md:col-span-9">
                  <div className="prose prose-invert max-w-none">
                    <h3 className="text-xl font-bold text-gray-200 mb-3 flex items-center">
                      <span className="mr-2">📚</span> Vasireddy Venkatadri Institute of Technology
                    </h3>
                    <p className="text-gray-400 mb-2">Nambur-Guntur</p>
                    <div className="mt-3 flex items-center text-gray-300 bg-gray-800/30 p-3 rounded-lg w-fit">
                      <span className="font-semibold mr-2">📊 CGPA:</span> 8.1
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Intermediate */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={smoothTransform}
              viewport={{ once: true }}
              className="relative pl-8 md:pl-0 group"
            >
              <div className="md:grid md:grid-cols-12 md:gap-8 card backdrop-blur-sm bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]">
                <div className="md:col-span-3 mb-4 md:mb-0">
                  <div className="flex flex-col">
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-blue-400 font-semibold">2019 - 2021</span>
                    </div>
                    <span className="text-gray-400 text-sm ml-5">Intermediate (M.P.C)</span>
                  </div>
                </div>
                <div className="md:col-span-9">
                  <div className="prose prose-invert max-w-none">
                    <h3 className="text-xl font-bold text-gray-200 mb-3 flex items-center">
                      <span className="mr-2">🏫</span> Sri Chaitanya Junior College
                    </h3>
                    <p className="text-gray-400 mb-2">Guntur</p>
                    <div className="mt-3 flex items-center text-gray-300 bg-gray-800/30 p-3 rounded-lg w-fit">
                      <span className="font-semibold mr-2">📊 CGPA:</span> 9.2
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Secondary School */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={smoothTransform}
              viewport={{ once: true }}
              className="relative pl-8 md:pl-0 group"
            >
              <div className="md:grid md:grid-cols-12 md:gap-8 card backdrop-blur-sm bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]">
                <div className="md:col-span-3 mb-4 md:mb-0">
                  <div className="flex flex-col">
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-blue-400 font-semibold">2018 - 2019</span>
                    </div>
                    <span className="text-gray-400 text-sm ml-5">Secondary School Education</span>
                  </div>
                </div>
                <div className="md:col-span-9">
                  <div className="prose prose-invert max-w-none">
                    <h3 className="text-xl font-bold text-gray-200 mb-3 flex items-center">
                      <span className="mr-2">📘</span> Zilla Parishad High School
                    </h3>
                    <p className="text-gray-400 mb-2">Panidham, Sattenapalli</p>
                    <div className="mt-3 flex items-center text-gray-300 bg-gray-800/30 p-3 rounded-lg w-fit">
                      <span className="font-semibold mr-2">📊 CGPA:</span> 9.5
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Divider */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-blue-400/50 to-transparent shadow-lg shadow-blue-500/30"></div>

      {/* Certifications Section */}
      <motion.section
        className="relative py-20 px-4 bg-gray-900"
        id="certifications"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={smoothTransform}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient tracking-tight">
              Certifications
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Professional credentials that validate my technical expertise and commitment to continuous learning</p>
          </motion.div>

          <div className="space-y-12">
            {/* Java Full Stack Development Certificate */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={smoothTransform}
              viewport={{ once: true }}
              className="relative pl-8 md:pl-0 group"
            >
              <div className="md:grid md:grid-cols-12 md:gap-8 card backdrop-blur-sm bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]">
                <div className="md:col-span-3 mb-4 md:mb-0">
                  <div className="flex flex-col">
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-blue-400 font-semibold">Tech Mahindra SMART Academy</span>
                    </div>
                    <span className="text-gray-400 text-sm ml-5">Certificate Course</span>
                  </div>
                </div>
                <div className="md:col-span-9">
                  <div className="prose prose-invert max-w-none">
                    <h3 className="text-xl font-bold text-gray-200 mb-3 flex items-center">
                      <span className="mr-2">🎓</span> Java Full Stack Development
                    </h3>
                    <p className="text-gray-300 mb-4">Comprehensive training program covering both frontend and backend technologies with hands-on projects.</p>
                    <div className="mt-4 bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
                      <h4 className="text-lg font-semibold text-gray-300 mb-3 flex items-center">
                        <span className="mr-2">🚀</span> Key Skills Acquired:
                      </h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-300 list-disc list-inside">
                        <li className="py-1">Core Java Programming</li>
                        <li className="py-1">Advanced Java Concepts</li>
                        <li className="py-1">Spring Framework</li>
                        <li className="py-1">Spring Boot</li>
                        <li className="py-1">RESTful Web Services</li>
                        <li className="py-1">HTML, CSS, JavaScript</li>
                        <li className="py-1">Database Design with SQL</li>
                        <li className="py-1">Application Deployment</li>
                      </ul>
                    </div>
                    <div className="mt-4 flex items-center text-gray-300 bg-gray-800/30 p-3 rounded-lg">
                      <span className="font-semibold mr-2">🎯 Program Focus:</span> Full-stack application development using Java ecosystem
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* The Joy of Computing using Python */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={smoothTransform}
              viewport={{ once: true }}
              className="relative pl-8 md:pl-0 group"
            >
              <div className="md:grid md:grid-cols-12 md:gap-8 card backdrop-blur-sm bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]">
                <div className="md:col-span-3 mb-4 md:mb-0">
                  <div className="flex flex-col">
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-blue-400 font-semibold">NPTEL Online Certification</span>
                    </div>
                    <span className="text-gray-400 text-sm ml-5">Online Certification</span>
                  </div>
                </div>
                <div className="md:col-span-9">
                  <div className="prose prose-invert max-w-none">
                    <h3 className="text-xl font-bold text-gray-200 mb-3 flex items-center">
                      <span className="mr-2">🐍</span> The Joy of Computing using Python
                    </h3>
                    <p className="text-gray-300 mb-4">A comprehensive course introducing computational thinking and programming concepts using Python.</p>
                    <div className="mt-4 bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
                      <h4 className="text-lg font-semibold text-gray-300 mb-3 flex items-center">
                        <span className="mr-2">🌟</span> Course Highlights:
                      </h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-300 list-disc list-inside">
                        <li className="py-1">Python Programming Fundamentals</li>
                        <li className="py-1">Data Structures and Algorithms</li>
                        <li className="py-1">Problem Solving Techniques</li>
                        <li className="py-1">Computational Thinking</li>
                        <li className="py-1">Graphics and Visualization</li>
                        <li className="py-1">Web Scraping Basics</li>
                        <li className="py-1">Introduction to Machine Learning</li>
                        <li className="py-1">Project Development</li>
                      </ul>
                    </div>
                    <div className="mt-4 flex items-center text-gray-300 bg-gray-800/30 p-3 rounded-lg">
                      <span className="font-semibold mr-2">🎯 Course Focus:</span> Making computing and programming accessible and enjoyable through Python
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Divider */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-blue-400/50 to-transparent shadow-lg shadow-blue-500/30"></div>

      {/* Skills Section */}
      <motion.section
        ref={skillsRef}
        style={{ y: skillsY, opacity: skillsOpacity }}
        className="relative py-24 md:py-20 px-4 bg-gray-900 pb-32 md:pb-24"
        id="skills"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={smoothTransform}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient tracking-tight">
              Technical Skills
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Frontend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={smoothTransform}
              viewport={{ once: true }}
              className="card backdrop-blur-sm bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-colors duration-300"
            >
              <h3 className="text-xl font-bold mb-4 text-gradient">Frontend Development</h3>
              <div className="space-y-3">
                {frontendSkills.map((skill, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-300">{skill.name}</span>
                      <span className="text-blue-400">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
                      ></motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Backend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="card backdrop-blur-sm bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-colors duration-300"
            >
              <h3 className="text-xl font-bold mb-4 text-gradient">Backend Development</h3>
              <div className="space-y-3">
                {backendSkills.map((skill, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-300">{skill.name}</span>
                      <span className="text-blue-400">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
                      ></motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Divider */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-blue-400/50 to-transparent shadow-lg shadow-blue-500/30"></div>

      {/* Work Experience Section */}
      <motion.section
        ref={experienceRef}
        style={{ y: experienceY, opacity: experienceOpacity }}
        className="relative py-20 px-4 bg-gray-900"
        id="experience"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={smoothTransform}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
              Work Experience
            </h2>
          </motion.div>

          <div className="space-y-12">
            {/* SPFS Experience */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={smoothTransform}
              viewport={{ once: true }}
              className="relative pl-8 md:pl-0"
            >
              <div className="md:grid md:grid-cols-12 md:gap-8">
                <div className="md:col-span-3 mb-4 md:mb-0">
                  <div className="flex flex-col">
                    <span className="text-blue-400 font-semibold">May 2024 - July 2024</span>
                    <span className="text-gray-400">Data Analyst Intern</span>
                    <span className="text-gray-500 font-medium">DBAce Technologies Pvt. Ltd</span>
                  </div>
                </div>
                <div className="md:col-span-9">
                  <div className="prose prose-invert max-w-none">
                    <ul className="space-y-2 text-gray-300 list-disc marker:text-blue-400">
                      <li>Learned to work with data using Power BI, MySQL, and MS Excel.</li>
                      <li>Improved problem-solving skills and paid close attention to details with big data.</li>
                      <li>Good at doing detailed analysis</li>
                      
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Virtusa Experience */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={smoothTransform}
              viewport={{ once: true }}
              className="relative pl-8 md:pl-0"
            >
              <div className="md:grid md:grid-cols-12 md:gap-8">
                <div className="md:col-span-3 mb-4 md:mb-0">
                  <div className="flex flex-col">
                    <span className="text-blue-400 font-semibold">August 2024 - September 2024</span>
                    <span className="text-gray-400">Full Stack Internship </span>
                    <span className="text-gray-500 font-medium">ExcelR Edtech Pvt. Ltd</span>
                  </div>
                </div>
                <div className="md:col-span-9">
                  <div className="prose prose-invert max-w-none">
                    <ul className="space-y-2 text-gray-300 list-disc marker:text-blue-400">
                      <li>Learned the basics of front-end development with HTML, CSS, Bootstrap, and JavaScript</li>
                      <li>Got introduced to back-end technologies like Core Java, Advanced Java, Spring Framework, and Spring Boot.</li>
                      <li>Practiced using MySQL for databases.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Divider */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-blue-400/50 to-transparent shadow-lg shadow-blue-500/30"></div>

      {/* Soft Skills Section */}
      <motion.section
        ref={softSkillsRef}
        style={{ y: softSkillsY, opacity: softSkillsOpacity }}
        className="relative py-20 px-4 bg-gray-900"
        id="strengths"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={smoothTransform}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient tracking-tight">
              Core Strengths
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {softSkills.map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="card backdrop-blur-sm bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                <div className="h-full flex flex-col">
                  {/* Icon and Title */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-2 rounded-lg">
                      <span className="text-3xl block text-blue-400">{skill.icon}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gradient">
                      {skill.name}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 mb-auto leading-relaxed">
                    {skill.description}
                  </p>

                  {/* Keywords */}
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-700/30">
                    {skill.keywords.map((keyword, kidx) => (
                      <span
                        key={kidx}
                        className="px-2.5 py-1 text-sm bg-blue-500/10 text-blue-400 rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Divider */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-blue-400/50 to-transparent shadow-lg shadow-blue-500/30"></div>

      {/* Interests & Hobbies Section */}
      <motion.section
        ref={interestsRef}
        style={{ y: interestsY, opacity: interestsOpacity }}
        className="relative py-20 px-4 bg-gray-900"
        id="interests"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={smoothTransform}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
              Interests & Hobbies
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "📸",
                title: "Photography",
                description: "I enjoy capturing moments through the lens, focusing on landscapes, portraits, and creative compositions. It helps me pay attention to detail and aesthetics, which I also apply in my design and development work."
              },
              {
                icon: "🎨",
                title: "UI/UX Design & Creative Art",
                description: "Designing user-friendly interfaces and experimenting with creative visuals is both my passion and hobby. I often explore color theory, typography, and layouts to build engaging digital experiences."
              },
              {
                icon: "💻",
                title: "Developing Web Applications",
                description: "Build and deploy personal projects, such as task management or e-commerce apps, using Java (Spring Boot) for the backend and frameworks like React or Angular for the frontend."
              },
              {
                icon: "🗣️",
                title: "Public Speaking",
                description: "Practicing structured speech, voice modulation, and confidence-building techniques for better communication."
              },
              {
                icon: "🌐",
                title: "Languages",
                description: "Proficient in English and Telugu, enabling effective communication across diverse teams."
              }
            ].map((hobby, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card backdrop-blur-sm bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                <div className="text-4xl mb-4">{hobby.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gradient">{hobby.title}</h3>
                <p className="text-gray-300">{hobby.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Divider */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-blue-400/50 to-transparent shadow-lg shadow-blue-500/30"></div>

      {/* Projects Section */}
      <motion.section
        ref={projectsRef}
        style={{ y: projectsY, opacity: projectsOpacity }}
        className="relative py-20 px-4 overflow-hidden bg-gray-900"
        id="projects"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={smoothTransform}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
              My Projects
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
              Here are some of my recent projects that showcase my skills and experience.
            </p>
          </motion.div>

          <div className="relative h-[750px] md:h-[750px] perspective-1000">
            {/* Project Cards Container */}
            <div className="absolute inset-0">
              {/* Navigation Buttons */}
              <button
                onClick={prevProject}
                className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-40 bg-black/50 hover:bg-black/70 p-2 md:p-3 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm"
              >
                <ChevronLeftIcon className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </button>
              <button
                onClick={nextProject}
                className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-40 bg-black/50 hover:bg-black/70 p-2 md:p-3 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm"
              >
                <ChevronRightIcon className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </button>

              {/* Cards Container */}
              <div className="absolute inset-x-4 md:inset-x-16 top-0 bottom-16 flex items-center justify-center">
                {projectsList.map((project, index) => {
                  const position = (index - currentProject + projectsList.length) % projectsList.length;
                  const isActive = position === 0;
                  const isNext = position === 1;
                  const isPrev = position === projectsList.length - 1;

                  // Calculate x-offset based on position
                  let xOffset;
                  if (position === 0) xOffset = 0;
                  else if (position === 1) xOffset = 100;
                  else if (position === projectsList.length - 1) xOffset = -100;
                  else if (position > 1) xOffset = 200;
                  else xOffset = -200;

                  return (
                    <motion.div
                      key={index}
                      className={`absolute w-full max-w-sm md:max-w-2xl ${
                        isActive ? 'z-30' : isNext ? 'z-20' : isPrev ? 'z-10' : 'z-0'
                      }`}
                      initial={{ opacity: 0, scale: 0.8, y: 50 }}
                      animate={{
                        opacity: isActive ? 1 : isNext || isPrev ? 0.5 : 0.2,
                        scale: isActive ? 1 : isNext || isPrev ? 0.85 : 0.7,
                        x: `${xOffset}%`,
                        rotateY: isActive ? 0 : position > 0 ? 10 : -10,
                        y: 0,
                        z: isActive ? 0 : -Math.abs(position) * 100,
                      }}
                      transition={{ 
                        duration: 1.4, // Slowed down from 0.7 seconds
                        ease: [0.32, 0.72, 0, 1]
                      }}
                      whileHover={isActive ? {
                        scale: 1.02,
                        transition: { duration: 0.3 }
                      } : {}}
                    >
                      <div className="card group cursor-pointer transform transition-all duration-300 backdrop-blur-sm bg-gradient-to-br from-blue-400/10 to-cyan-400/10 border border-white/10 rounded-xl mx-auto w-[95%] md:w-[90%]">
                        <div className="aspect-video mb-4 md:mb-6 rounded-xl overflow-hidden shadow-xl shadow-cyan-500/20">
                          <img 
                            src={project.image} 
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="px-4 md:px-6 pb-4 md:pb-6">
                          <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 text-gradient">{project.title}</h3>
                          <p className="text-gray-300 mb-4 md:mb-6 text-base md:text-lg leading-relaxed">{project.description}</p>
                          <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
                            {project.tags.map((tag, tagIndex) => (
                              <span 
                                key={tagIndex}
                                className="px-3 md:px-4 py-1.5 md:py-2 bg-purple-500/20 text-purple-400 rounded-full text-xs md:text-sm font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary w-full text-center text-base md:text-lg py-3 md:py-4 hover:scale-105 transition-transform duration-300"
                          >
                            View Project
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Project Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 z-40">
                {projectsList.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentProject(index)}
                    className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                      index === currentProject
                        ? 'bg-purple-500 scale-125 shadow-lg shadow-purple-500/50'
                        : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Divider */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-blue-400/50 to-transparent shadow-lg shadow-blue-500/30"></div>

      {/* Contact Section */}
      <motion.section
        ref={contactRef}
        style={{ y: contactY, opacity: contactOpacity }}
        className="relative py-20 px-4 bg-gray-900 mb-8"
        id="contact"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={smoothTransform}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
              Get In Touch
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-8">
              I'm always open to new opportunities and collaborations. Feel free to reach out!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={smoothTransform}
            viewport={{ once: true }}
            className="card bg-gray-800 border border-gray-700 p-6 rounded-xl"
          >
            {submitSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6 text-blue-400 text-center"
              >
                Thank you for your message! I'll get back to you soon.
              </motion.div>
            )}
            
            <form 
              name="contact" 
              method="POST"
              data-netlify="true"
              netlify-honeypot="bot-field"
              className="space-y-6"
              onSubmit={handleSubmit}
            >
              <input type="hidden" name="form-name" value="contact" />
              <input type="hidden" name="bot-field" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-colors"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-colors"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-colors"
                  placeholder="What's this about?"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-colors"
                  placeholder="Your message here..."
                  required
                ></textarea>
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`btn-primary px-8 py-3 text-lg font-medium transition-all duration-300 ${
                    isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:scale-105'
                  }`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </motion.div>

          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <a 
              href="mailto:bhavani.sudhakar.2004@gmail.com" 
              className="btn-secondary font-medium relative overflow-hidden group/btn"
            >
              <span className="relative z-10">Send Email</span>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </a>
            <a 
              href="https://www.linkedin.com/in/bhavani-boddu-6b1486241" 
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary font-medium relative overflow-hidden group/btn"
              onClick={(e) => {
                if (!e.target.href.includes('ajay-sankar-1bb91b19a')) {
                  e.preventDefault();
                  console.warn('LinkedIn profile link is not properly configured');
                }
              }}
            >
              <span className="relative z-10">LinkedIn</span>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </a>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-900 border-t border-gray-800 mt-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Bhavani Boddu. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home; 
