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