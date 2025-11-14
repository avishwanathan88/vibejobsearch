import { JobPosting } from '@/types';

// Mock job data for testing
const mockJobs: JobPosting[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'TechCorp Inc.',
    location: 'New York, NY',
    description: 'We are looking for a senior software engineer to join our dynamic team. You will work on cutting-edge web applications using React, Node.js, and TypeScript. The role requires 5+ years of experience in full-stack development, strong problem-solving skills, and the ability to work in an agile environment. We offer competitive salary, excellent benefits, and opportunities for professional growth.',
    url: 'https://example.com/job1',
    salary: '$120,000 - $150,000',
    type: 'Full-time',
    remote: false,
    postedDate: '2024-11-10'
  },
  {
    id: '2',
    title: 'Data Scientist',
    company: 'DataFlow Analytics',
    location: 'San Francisco, CA',
    description: 'Join our data science team to build predictive models and analytics solutions. You will work with large datasets, implement machine learning algorithms, and collaborate with cross-functional teams. Requirements include PhD or Masters in Data Science, experience with Python, R, SQL, and machine learning frameworks like TensorFlow or PyTorch.',
    url: 'https://example.com/job2',
    salary: '$130,000 - $170,000',
    type: 'Full-time',
    remote: true,
    postedDate: '2024-11-12'
  },
  {
    id: '3',
    title: 'UX Designer',
    company: 'Design Studio',
    location: 'Austin, TX',
    description: 'We are seeking a creative UX Designer to create intuitive and engaging user experiences. You will conduct user research, create wireframes and prototypes, and collaborate with development teams. The ideal candidate has 3+ years of UX design experience, proficiency in Figma, Sketch, and understanding of design systems.',
    url: 'https://example.com/job3',
    salary: '$80,000 - $110,000',
    type: 'Full-time',
    remote: false,
    postedDate: '2024-11-13'
  },
  {
    id: '4',
    title: 'Frontend Developer',
    company: 'WebTech Solutions',
    location: 'Remote',
    description: 'Remote frontend developer position focusing on React and modern JavaScript. You will build responsive web applications, optimize performance, and collaborate with backend developers and designers. Requirements include strong knowledge of React, TypeScript, CSS, and experience with state management libraries.',
    url: 'https://example.com/job4',
    salary: '$90,000 - $120,000',
    type: 'Full-time',
    remote: true,
    postedDate: '2024-11-14'
  },
  {
    id: '5',
    title: 'Product Manager',
    company: 'InnovateNow',
    location: 'Seattle, WA',
    description: 'Product Manager role focusing on mobile applications and user growth. You will define product strategy, work with engineering and design teams, analyze user metrics, and drive product development. The role requires 4+ years of product management experience, strong analytical skills, and experience with Agile methodologies.',
    url: 'https://example.com/job5',
    salary: '$110,000 - $140,000',
    type: 'Full-time',
    remote: false,
    postedDate: '2024-11-11'
  }
];

export async function searchJobs(role: string, location?: string): Promise<JobPosting[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Filter mock jobs based on role and location
  const filtered = mockJobs.filter(job => {
    const matchesRole = job.title.toLowerCase().includes(role.toLowerCase()) ||
                       job.description.toLowerCase().includes(role.toLowerCase());
    const matchesLocation = !location || 
                           job.location.toLowerCase().includes(location.toLowerCase()) ||
                           job.remote;
    return matchesRole && matchesLocation;
  });
  
  return filtered.length > 0 ? filtered : mockJobs.slice(0, 3);
}
