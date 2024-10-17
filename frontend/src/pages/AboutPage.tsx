import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/Button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/DropdownMenu";
import { User } from 'lucide-react';

export default function AboutPage() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-50 text-gray-800">
      <header className="p-4 flex justify-between items-center bg-white bg-opacity-80 backdrop-blur-md">
        <h1 className="text-2xl font-bold text-indigo-600">HealthLens</h1>
        <nav className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/')}>Home</Button>
          <Button variant="ghost" onClick={() => navigate('/encyclopedia')}>Encyclopedia</Button>
          <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6 text-red-600 hover:opacity-75 transition-opacity"
            >
              <path d="M19.615 6.035c-.556-.557-1.24-.84-2.055-.84-1.876-.03-3.755-.035-5.625-.035-1.87 0-3.745.005-5.625.035-.815 0-1.5.283-2.055.84-.556.556-.835 1.244-.835 2.06-.03 1.873-.035 3.752-.035 5.625s.005 3.745.035 5.625c0 .815.279 1.5.835 2.055.556.556 1.244.835 2.055.835 1.876.03 3.755.035 5.625.035 1.87 0 3.745-.005 5.625-.035.815 0 1.5-.279 2.055-.835.556-.556.835-1.24.835-2.055.03-1.876.035-3.755.035-5.625s-.005-3.755-.035-5.625c0-.815-.279-1.5-.835-2.055zm-10.905 8.46v-4.995l5.195 2.505-5.195 2.49z" />
            </svg>
          </a>
          <a href="https://github.com/ericfly02/Frontend-HealthLens" target="_blank" rel="noopener noreferrer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6 text-gray-800 hover:text-gray-600 transition-colors"
            >
              <path d="M12 0.297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.111.82-.261.82-.577 0-.285-.011-1.04-.017-2.04-3.338.724-4.042-1.415-4.042-1.415-.546-1.387-1.333-1.757-1.333-1.757-1.09-.744.083-.729.083-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.809 1.305 3.495.998.107-.775.418-1.305.762-1.605-2.665-.304-5.466-1.332-5.466-5.93 0-1.31.469-2.381 1.236-3.22-.123-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.289-1.552 3.295-1.23 3.295-1.23.655 1.653.242 2.873.12 3.176.77.839 1.235 1.91 1.235 3.22 0 4.61-2.807 5.623-5.48 5.921.43.371.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .32.218.694.825.576 4.765-1.589 8.2-6.086 8.2-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" onClick={toggleDropdown}>
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            {isDropdownOpen && (
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Login</DropdownMenuItem>
                <DropdownMenuItem>Sign Up</DropdownMenuItem>
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white bg-opacity-80 backdrop-blur-md rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-extrabold text-indigo-800 mb-8">About HealthLens</h1>
          
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">Our Mission</h2>
            <p className="text-indigo-600 leading-relaxed">
              At HealthLens, we believe that everyone deserves access to quality healthcare, regardless of their geographical location or economic status. Our mission is to empower individuals in developing countries by providing them with the tools and resources they need to take control of their health. We aim to bridge the gap between patients and healthcare professionals through innovative technology.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">What We Do</h2>
            <p className="text-indigo-600 leading-relaxed">
            HealthLens leverages cutting-edge artificial intelligence to analyze skin and eye conditions through user-uploaded images. Our pretrained Convolutional Neural Network (CNN) quickly assesses the uploaded photos and provides users with potential diagnoses, enabling them to understand their health concerns better. This initial analysis serves as a stepping stone for users to seek further medical advice if needed.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">Why HealthLens?</h2>
            <p className="text-indigo-600 leading-relaxed mb-4">
              Many people in developing countries face significant barriers to accessing healthcare, including a lack of medical professionals, long travel distances, and financial constraints. HealthLens addresses these challenges by offering:
            </p>
            <ul className="list-disc list-inside text-indigo-600 leading-relaxed">
              <li><strong>Accessibility:</strong> Users can analyze their conditions from the comfort of their homes using just a smartphone.</li>
              <li><strong>Affordability:</strong> Our platform is designed to be low-cost or free, ensuring that everyone can benefit from our services.</li>
              <li><strong>Education:</strong> We provide a comprehensive health encyclopedia that helps users learn about various skin and eye conditions, fostering informed health decisions.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">Join Us on This Journey</h2>
            <p className="text-indigo-600 leading-relaxed">
              We invite you to explore our platform and discover how HealthLens can help you understand your health better. Together, we can create a healthier future for everyone. If you have any questions or feedback, please don't hesitate to reach out!
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}