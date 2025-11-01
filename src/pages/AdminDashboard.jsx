import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaTimes, FaHome, FaProjectDiagram, FaEnvelope, FaSignOutAlt, FaChartBar, FaGithub, FaLink, FaImage, FaEdit, FaTrash } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Form validation schema
const projectSchema = yup.object().shape({
  title: yup.string().required('Project title is required'),
  description: yup.string().required('Project description is required'),
  githubLink: yup.string().url('Must be a valid URL').required('GitHub link is required'),
  liveLink: yup.string().url('Must be a valid URL').nullable(),
});

const AdminDashboard = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(() => {
    return localStorage.getItem('isAuthenticated') !== 'true';
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddProject, setShowAddProject] = useState(false);
  const [projects, setProjects] = useState(() => {
    const savedProjects = localStorage.getItem('projects');
    return savedProjects ? JSON.parse(savedProjects) : [];
  });
  const [editingProject, setEditingProject] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const formRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize React Hook Form
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      githubLink: '',
      liveLink: '',
    }
  });

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
      setShowLogin(false);
    } else {
      setIsAuthenticated(false);
      setShowLogin(true);
    }
  }, [location.pathname]);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('isAuthenticated', 'true');
        setIsAuthenticated(true);
        setShowLogin(false);
        navigate('/admin/dashboard');
      } else {
        setError('Invalid credentials');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    setShowLogin(true);
    navigate('/');
  };

  const handleClose = () => {
    setShowLogin(false);
    navigate('/');
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setValue('title', project.title);
    setValue('description', project.description);
    setValue('githubLink', project.githubLink || '');
    setValue('liveLink', project.liveLink || '');
    setImagePreview(project.image || '');
    setImageFile(null);
    setShowAddProject(true);
  };

  const handleDeleteProject = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setProjects(prevProjects => prevProjects.filter(project => project.id !== projectId));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  const onSubmit = (data) => {
    if (!imagePreview) {
      alert('Project image is required');
      return;
    }

    if (editingProject) {
      const updatedProjects = projects.map(project => 
        project.id === editingProject.id
          ? {
              ...project,
              title: data.title,
              description: data.description,
              image: imagePreview,
              githubLink: data.githubLink,
              liveLink: data.liveLink,
            }
          : project
      );
      setProjects(updatedProjects);
      setEditingProject(null);
    } else {
      const newProjectData = {
        id: Date.now(),
        title: data.title,
        description: data.description,
        image: imagePreview,
        githubLink: data.githubLink,
        liveLink: data.liveLink,
        status: 'Live',
      };
      setProjects(prevProjects => [...prevProjects, newProjectData]);
    }
    
    setShowAddProject(false);
    setImagePreview('');
    setImageFile(null);
    reset();
  };

  const sidebarLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: FaHome },
    { id: 'projects', label: 'Projects', icon: FaProjectDiagram },
    { id: 'messages', label: 'Messages', icon: FaEnvelope },
    { id: 'analytics', label: 'Analytics', icon: FaChartBar },
  ];

  const DashboardContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-gradient-to-br from-blue-400/10 to-cyan-500/10 rounded-xl p-6 border border-blue-400/20">
        <h3 className="text-xl font-semibold mb-2">Total Projects</h3>
        <p className="text-3xl font-bold text-blue-400">12</p>
        <p className="text-gray-400 mt-2">+3 this month</p>
      </div>
      <div className="bg-gradient-to-br from-blue-400/10 to-cyan-500/10 rounded-xl p-6 border border-blue-400/20">
        <h3 className="text-xl font-semibold mb-2">Messages</h3>
        <p className="text-3xl font-bold text-blue-400">24</p>
        <p className="text-gray-400 mt-2">6 unread</p>
      </div>
      <div className="bg-gradient-to-br from-blue-400/10 to-cyan-500/10 rounded-xl p-6 border border-blue-400/20">
        <h3 className="text-xl font-semibold mb-2">Profile Views</h3>
        <p className="text-3xl font-bold text-blue-400">1.2k</p>
        <p className="text-gray-400 mt-2">+15% this week</p>
      </div>
    </div>
  );

  const ProjectsContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Projects</h2>
        <button 
          onClick={() => {
            setEditingProject(null);
            setShowAddProject(true);
            setImagePreview('');
            setImageFile(null);
            reset();
          }}
          className="btn-primary"
        >
          Add Project
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="card group cursor-pointer transform transition-all duration-300 backdrop-blur-sm bg-gradient-to-br from-blue-400/10 to-cyan-500/10 border border-white/10 rounded-xl mx-auto w-full"
          >
            <div className="aspect-video mb-4 md:mb-6 rounded-xl overflow-hidden shadow-xl shadow-blue-500/20">
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
                {project.tags?.map((tag, tagIndex) => (
                  <span 
                    key={tagIndex}
                    className="px-3 md:px-4 py-1.5 md:py-2 bg-purple-500/10 text-purple-400 rounded-full text-xs md:text-sm font-medium backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    GitHub
                  </a>
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-cyan-300 transition-colors"
                  >
                    Live Demo
                  </a>
                </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEditProject(project)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaEdit className="h-5 w-5" />
                </button>
                <button 
                    onClick={() => handleDeleteProject(project.id)}
                  className="text-red-400 hover:text-red-500 transition-colors"
                >
                  <FaTrash className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-gray-800 min-h-screen p-4">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gradient">Admin Panel</h1>
            </div>
            <nav className="space-y-2">
              {sidebarLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    activeTab === link.id
                      ? 'bg-blue-400/20 text-blue-400'
                      : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                  }`}
                >
                  <link.icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white transition-all duration-300"
              >
                <FaSignOutAlt className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8">
            <div className="max-w-6xl mx-auto">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'dashboard' && <DashboardContent />}
                {activeTab === 'projects' && <ProjectsContent />}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900">
      <AnimatePresence>
        {showLogin && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-md mx-4"
          >
            <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
              <div className="p-8">
                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                  <FaTimes className="h-6 w-6" />
                </button>

                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gradient mb-2">Welcome Back</h2>
                  <p className="text-gray-400">Please login to your admin account</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username"
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-colors"
                      required
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                      ) : (
                        <FaEye className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                      )}
                    </button>
                  </div>

                  {error && (
                    <div className="text-red-500 text-sm text-center bg-red-500/10 py-2 px-4 rounded-lg">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-300 ${
                      isLoading
                        ? 'bg-blue-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-400 to-cyan-500 hover:shadow-lg hover:shadow-blue-500/20'
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                        Logging in...
                      </div>
                    ) : (
                      'Login'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
