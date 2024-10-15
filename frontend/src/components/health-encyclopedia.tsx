import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "./ui/Button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/DropdownMenu";
import { User, Search, ChevronDown, ChevronUp, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

interface ConditionInfo {
    [key: string]: string;
}

export default function HealthEncyclopedia() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedCondition, setExpandedCondition] = useState<string | null>(null);
  const [conditionInfo, setConditionInfo] = useState<ConditionInfo>({});
  const [searchTerm, setSearchTerm] = useState('');

  const mainCategories = [
    { name: "All", icon: "🔍" },
    { name: "Skin Conditions", icon: "🧴" },
    { name: "Eye Conditions", icon: "👁️" },
    { name: "Nail Conditions", icon: "💅" },
    { name: "Melanoma", icon: "🔬" },
  ];

  const allConditions = [
    // Skin Conditions
    { name: "Acne and Rosacea", category: "Skin Conditions", severity: "Mild to Moderate", info: "Acne is a skin condition that occurs when hair follicles become plugged with oil and dead skin cells. Rosacea is a common skin condition that causes redness and visible blood vessels in your face." },
    { name: "Actinic Keratosis Basal Cell Carcinoma", category: "Skin Conditions", severity: "Severe", info: "Actinic keratosis is a rough, scaly patch on the skin that develops from years of sun exposure. Basal cell carcinoma is a type of skin cancer that begins in the basal cells." },
    { name: "Atopic Dermatitis", category: "Skin Conditions", severity: "Moderate", info: "Atopic dermatitis (eczema) is a condition that makes your skin red and itchy. It's common in children but can occur at any age." },
    { name: "Bullous Disease", category: "Skin Conditions", severity: "Moderate", info: "Bullous disease refers to a group of disorders that cause fluid-filled blisters to develop on the skin." },
    { name: "Cellulitis Impetigo", category: "Skin Conditions", severity: "Moderate", info: "Cellulitis is a common bacterial skin infection. Impetigo is a highly contagious skin infection that mainly affects infants and children." },
    { name: "Eczema", category: "Skin Conditions", severity: "Mild to Moderate", info: "Eczema is a term for a group of conditions that cause the skin to become itchy, inflamed, or have a rash-like appearance." },
    { name: "Exanthems and Drug Eruptions", category: "Skin Conditions", severity: "Moderate", info: "Exanthems are widespread rashes that occur as a symptom of a viral or bacterial infection. Drug eruptions are adverse drug reactions that affect the skin." },
    { name: "Herpes HPV and other STDs", category: "Skin Conditions", severity: "Moderate", info: "Herpes and HPV are sexually transmitted infections that can cause skin symptoms. Other STDs can also affect the skin." },
    { name: "Light Diseases and Disorders of Pigmentation", category: "Skin Conditions", severity: "Mild", info: "These conditions affect skin pigmentation and can be caused or exacerbated by light exposure." },
    { name: "Lupus and other Connective Tissue Diseases", category: "Skin Conditions", severity: "Severe", info: "Lupus is a systemic autoimmune disease that occurs when your body's immune system attacks your own tissues and organs. Other connective tissue diseases can also affect the skin." },
    { name: "Poison Ivy and other Contact Dermatitis", category: "Skin Conditions", severity: "Mild", info: "Contact dermatitis is a red, itchy rash caused by direct contact with a substance or an allergic reaction to it. Poison ivy is a common cause of allergic contact dermatitis." },
    { name: "Psoriasis", category: "Skin Conditions", severity: "Moderate", info: "Psoriasis is a skin disease that causes red, itchy scaly patches, most commonly on the knees, elbows, trunk and scalp." },
    { name: "Scabies Lyme Disease", category: "Skin Conditions", severity: "Moderate", info: "Scabies is an itchy skin condition caused by tiny burrowing mites. Lyme disease is a tick-borne illness that can cause a characteristic skin rash." },
    { name: "Seborrheic Keratoses", category: "Skin Conditions", severity: "Mild", info: "Seborrheic keratoses are common noncancerous skin growths that often appear during middle age and later." },
    { name: "Systemic Diseases", category: "Skin Conditions", severity: "Severe", info: "Many systemic diseases can have skin manifestations or complications." },
    { name: "Tinea Ringworm Candidiasis", category: "Skin Conditions", severity: "Mild", info: "Tinea and ringworm are fungal infections of the skin. Candidiasis is a fungal infection caused by yeasts that belong to the genus Candida." },
    { name: "Urticaria Hives", category: "Skin Conditions", severity: "Moderate", info: "Urticaria, also known as hives, is an outbreak of swollen, pale red bumps or plaques on the skin that appear suddenly." },
    { name: "Vascular Tumors", category: "Skin Conditions", severity: "Moderate", info: "Vascular tumors are benign (non-cancerous) growths made up of blood vessels." },
    { name: "Vasculitis", category: "Skin Conditions", severity: "Moderate", info: "Vasculitis is a general term for a group of uncommon diseases that feature inflammation of the blood vessels." },
    { name: "Warts Molluscum", category: "Skin Conditions", severity: "Mild", info: "Warts are small, granular growths on the skin caused by a virus. Molluscum contagiosum is a viral skin infection that causes round, firm, painless bumps." },

    // Eye Conditions
    { name: "Cataract", category: "Eye Conditions", severity: "Moderate", info: "A cataract is a clouding of the normally clear lens of your eye. For people who have cataracts, seeing through cloudy lenses is a bit like looking through a frosty or fogged-up window." },

    // Nail Conditions
    { name: "Darier's Disease", category: "Nail Conditions", severity: "Moderate", info: "Darier's disease is a rare genetic skin disorder characterized by dark, crusty patches on the skin and nail abnormalities." },
    { name: "Muehrck-e's lines", category: "Nail Conditions", severity: "Mild", info: "Muehrcke's lines are paired, white, transverse lines that extend all the way across the nail and lie parallel to the lunula." },
    { name: "Beau's lines", category: "Nail Conditions", severity: "Mild", info: "Beau's lines are deep grooved lines that run from side to side on the fingernail or toenail." },
    { name: "Bluish nail", category: "Nail Conditions", severity: "Mild", info: "Bluish nails can indicate a lack of oxygen in the blood or a circulation problem." },
    { name: "Clubbing", category: "Nail Conditions", severity: "Moderate", info: "Clubbing is a condition where the fingernails curve around the fingertips, often associated with low blood oxygen levels." },
    { name: "Half and Half Nails (Lindsay's nails)", category: "Nail Conditions", severity: "Mild", info: "Half and half nails, also known as Lindsay's nails, are nails that are white on the proximal half and dark on the distal half." },
    { name: "Koilonychia", category: "Nail Conditions", severity: "Mild", info: "Koilonychia is a nail disease that can be a sign of iron-deficiency anemia. It causes the nails to be thin and concave." },
    { name: "Leukonychia", category: "Nail Conditions", severity: "Mild", info: "Leukonychia is a condition where white lines or dots appear on your fingernails or toenails. This is very common and usually harmless." },
    { name: "Onycholycis", category: "Nail Conditions", severity: "Mild", info: "Onycholysis is a common condition where the nail separates from the nail bed. It can be caused by injury, infection, or certain medications." },
    { name: "Pale Nail", category: "Nail Conditions", severity: "Mild", info: "Pale nails can be a sign of several conditions, including anemia, liver disease, or heart failure." },
    { name: "Red Lunula", category: "Nail Conditions", severity: "Mild", info: "Red lunula refers to a condition where the usually white crescent-shaped area at the base of a fingernail becomes red." },
    { name: "Splinter Hemmorrages", category: "Nail Conditions", severity: "Mild", info: "Splinter hemorrhages are tiny blood clots that tend to run vertically under the nails." },
    { name: "Terry's nail", category: "Nail Conditions", severity: "Mild", info: "Terry's nails are a type of apparent leukonychia, characterized by ground glass opacification of nearly the entire nail." },
    { name: "White nail", category: "Nail Conditions", severity: "Mild", info: "White nails, or leukonychia, can be a sign of liver or kidney disease." },
    { name: "Yellow nails", category: "Nail Conditions", severity: "Mild", info: "Yellow nails can be caused by a fungal infection or a more serious condition like lung disease or rheumatoid arthritis." },

    // Melanoma
    { name: "Melanoma Skin Cancer Nevi and Moles", category: "Melanoma", severity: "Severe", info: "Melanoma is a serious form of skin cancer that begins in cells known as melanocytes. Nevi and moles are usually harmless but can sometimes develop into melanoma." },
    { name: "Benign", category: "Melanoma", severity: "Mild", info: "Benign melanoma refers to non-cancerous growths of melanocytes. These are typically harmless but should be monitored for changes." },
    { name: "Malignant", category: "Melanoma", severity: "Severe", info: "Malignant melanoma is the most serious type of skin cancer. It develops in the cells that produce melanin and can spread to other parts of the body if not caught early." },
  ];

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const filteredConditions = allConditions.filter(condition => 
    (selectedCategory === 'All' || condition.category === selectedCategory) &&
    (condition.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     condition.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleConditionInfo = (conditionName: string) => {
    setExpandedCondition(expandedCondition === conditionName ? null : conditionName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-50 text-gray-800">
      <header className="p-4 flex justify-between items-center bg-white bg-opacity-80 backdrop-blur-md">
        <h1 className="text-xl md:text-2xl font-bold text-indigo-600">HealthLens</h1>
        <nav className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" onClick={() => handleNavigation('/')}>Home</Button>
          <Button variant="ghost" onClick={() => handleNavigation('/about')}>About</Button>
          <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
              <path d="M19.615 6.035c-.556-.557-1.24-.84-2.055-.84-1.876-.03-3.755-.035-5.625-.035-1.87 0-3.745.005-5.625.035-.815 0-1.5.283-2.055.84-.556.556-.835 1.244-.835 2.06-.03 1.873-.035 3.752-.035 5.625s.005 3.745.035 5.625c0 .815.279 1.5.835 2.055.556.556 1.244.835 2.055.835 1.876.03 3.755.035 5.625.035 1.87 0 3.745-.005 5.625-.035.815 0 1.5-.279 2.055-.835.556-.556.835-1.24.835-2.055.03-1.876.035-3.755.035-5.625s-.005-3.755-.035-5.625c0-.815-.279-1.5-.835-2.055zm-10.905 8.46v-4.995l5.195 2.505-5.195 2.49z" />
            </svg>
          </a>
          <a href="https://github.com/ericfly02/Frontend-HealthLens" target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
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
                <DropdownMenuItem onSelect={() => handleNavigation('/login')}>Login</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleNavigation('/signup')}>Sign Up</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleNavigation('/dashboard')}>Dashboard</DropdownMenuItem>
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        </nav>
        <Button variant="outline" size="icon" className="md:hidden" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white shadow-lg p-4 absolute top-16 left-0 right-0 z-50"
          >
            <Button variant="ghost" className="w-full justify-start mb-2" onClick={() => handleNavigation('/')}>Home</Button>
            <Button variant="ghost" className="w-full justify-start mb-2" onClick={() => handleNavigation('/about')}>About</Button>
            <Button variant="ghost" className="w-full justify-start mb-2" onClick={() => handleNavigation('/login')}>Login</Button>
            <Button variant="ghost" className="w-full justify-start mb-2" onClick={() => handleNavigation('/signup')}>Sign Up</Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => handleNavigation('/dashboard')}>Dashboard</Button>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-indigo-800 mb-4">HealthLens Health Encyclopedia</h1>
            <p className="text-indigo-600 mb-6">Your Comprehensive Guide to Skin, Eye, and Nail Conditions</p>
            
            <section className="mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-indigo-700 mb-4">Major Categories</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {mainCategories.map((category) => (
                  <Button
                    key={category.name}
                    variant={selectedCategory === category.name ? "default" : "outline"}
                    className="h-16 md:h-24 text-sm md:text-lg flex flex-col items-center justify-center"
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    <span className="text-2xl md:text-3xl mb-1 md:mb-2">{category.icon}</span>
                    {category.name}
                  </Button>
                ))}
              </div>
            </section>

            <div className="relative mb-8">
              <input
                type="text"
                placeholder="Search conditions..."
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            <section>
              <h2 className="text-xl md:text-2xl font-bold text-indigo-700 mb-4">Condition List</h2>
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {filteredConditions.map((condition) => (
                    <li key={condition.name}>
                      <div className="block hover:bg-indigo-50">
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <button 
                              onClick={() => toggleConditionInfo(condition.name)}
                              className="text-sm font-medium text-indigo-600 truncate flex items-center"
                            >
                              {condition.name}
                              {expandedCondition === condition.name ? (
                                <ChevronUp className="ml-2 h-4 w-4" />
                              ) : (
                                <ChevronDown className="ml-2 h-4 w-4" />
                              )}
                            </button>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                condition.severity === 'Mild' ? 'bg-green-100 text-green-800' :
                                condition.severity === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                                condition.severity === 'Mild to Moderate' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {condition.severity}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-indigo-500">
                                {condition.category}
                              </p>
                            </div>
                          </div>
                          
                          {expandedCondition === condition.name && (
                            <div className="mt-2 text-sm text-gray-600">
                              <p
                                dangerouslySetInnerHTML={{ __html: conditionInfo[condition.name] || condition.info }}
                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>
        </motion.div>
      </main>
    </div>
  );
}