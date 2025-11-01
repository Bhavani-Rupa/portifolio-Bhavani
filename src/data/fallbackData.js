import profileImage from '../assets/profile.jpg';

export const fallbackSkills = {
  soft: [
    {
      name: 'Problem Solving',
      icon: '🧩',
      description: 'Breaking down complex challenges into manageable solutions',
      keywords: ['Analytical', 'Strategic', 'Innovative']
    },
    {
      name: 'Team Leadership',
      icon: '👥',
      description: 'Guiding teams to achieve collective excellence',
      keywords: ['Motivating', 'Mentoring', 'Empowering']
    },
    {
      name: 'Communication',
      icon: '💬',
      description: 'Articulating ideas with clarity and impact',
      keywords: ['Clear', 'Engaging', 'Persuasive']
    },
    {
      name: 'Adaptability',
      icon: '🔄',
      description: 'Thriving in dynamic environments and embracing change',
      keywords: ['Flexible', 'Resilient', 'Quick-learning']
    },
    {
      name: 'Time Management',
      icon: '⚡',
      description: 'Optimizing productivity and meeting deadlines effectively',
      keywords: ['Organized', 'Efficient', 'Prioritizing']
    },
    {
      name: 'Critical Thinking',
      icon: '🎯',
      description: 'Analyzing situations from multiple perspectives',
      keywords: ['Logical', 'Decisive', 'Insightful']
    }
  ],
  frontend: [
    { name: 'React.js', level: 50 },
    { name: 'JavaScript (ES6+)', level: 60 },
    { name: 'Bootstrap & Tailwind', level: 50 },
    { name: 'HTML5 & CSS3', level: 70 }
  ],
  backend: [
    { name: 'Java (Spring Boot)', level: 55 },
    { name: 'Node.js', level: 50 },
    { name: 'REST APIs', level: 50 },
    { name: 'SQL', level: 80 }
  ]
};

export const fallbackProjects = [
  {
    title: 'Social Media Fake News Detection System',
    description: 'The Social Media Fake News Detection project uses machine learning to identify fake news on social media platforms. It is implemented in Python on Google Colab and focuses on loading and analyzing news datasets to build the detection model',
    tags: ['Python', 'Natural Language Processing','Google Colab'],
    image: 'https://ik.imagekit.io/h7tblvgrb/New%20Folder/Social_Media_Fake_News_Detection_System.png?updatedAt=1757269867242',
    link: 'https://github.com/Bhavani-Rupa/Social-Media-Fake-News-Detection'
  },
  {
    title: '2048 GAME',
    description: 'Developed a fully functional 2048 game using HTML, CSS, and JavaScript.• HTML: Created the game board, score panel, and instructions.• CSS: Designed the interface with animations and ensured responsiveness.• JavaScript: Built the game logic for tile generation, movements, merging, scoring, and game state management.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    image: 'https://ik.imagekit.io/h7tblvgrb/New%20Folder/2048game.jpg?updatedAt=1757269867232',
    link: 'https://2048-urgame.netlify.app/'
  },
  {
    title: 'To-Do-List',
    description: 'Developed a dynamic To-Do List app using HTML, CSS, and JavaScript.• HTML: Structured the task list and interface elements.• CSS: Created a responsive and user-friendly design.• JavaScript: Enabled interactive features like adding, deleting, completing tasks, and handling user events.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    image: 'https://ik.imagekit.io/h7tblvgrb/New%20Folder/To-Do-List-using.jpg?updatedAt=1757269867209',
    link: 'https://to-do-list-ur.netlify.app/'
  },
  {
   title: 'Currency-Converter',
    description: 'Built a responsive, real-time Currency Converter using HTML, CSS, and JavaScript.• HTML & CSS: Designed a user-friendly and adaptable interface.• JavaScript: Fetched live exchange rates from an API to provide instant currency conversions.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    image: 'https://ik.imagekit.io/h7tblvgrb/New%20Folder/Currency-Converter.jpg?updatedAt=1757269867166',
    link: 'https://currencyconverter-ur.netlify.app/'
  },
  {
   title: 'UR-list',
    description: 'Built a responsive, real-time UR-list using HTML, CSS, and JavaScript.• HTML & CSS: Designed a user-friendly and adaptable interface.• JavaScript: Fetched live data from an API to provide instant UR-list information.',
    tags: ['HTML', 'CSS', 'Node.js'],
    image: 'https://ik.imagekit.io/h7tblvgrb/New%20Folder/3.png?updatedAt=1762014732702',
    link: 'https://ur-list.netlify.app/'
  },
  {
   title: 'Login-Registration-using-react',
    description: 'Built a responsive, real-time Login-Registration app using React.js, HTML, CSS, and JavaScript.• HTML & CSS: Designed a user-friendly and adaptable interface.• JavaScript: Developed interactive features for user authentication and management.',
    tags: ['HTML', 'CSS', 'React'],
    image: 'https://ik.imagekit.io/h7tblvgrb/New%20Folder/2.png?updatedAt=1762014732385',
    link: 'https://login-registration-react-bhavani.netlify.app/'
  },
  {
   title: 'Course-Manager',
    description: 'Built a responsive, real-time Course Manager using HTML, CSS, and JavaScript.• HTML & CSS: Designed a user-friendly and adaptable interface.• JavaScript: Developed interactive features for course management and user authentication.',
    tags: ['HTML', 'CSS', 'React'],
    image: 'https://ik.imagekit.io/h7tblvgrb/New%20Folder/1.png?updatedAt=1762014732619',
    link: 'https://course-manager-react-bhavani.netlify.app/'
  }

];

export const fallbackProfileImage = profileImage;