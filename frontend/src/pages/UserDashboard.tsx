import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Button } from "../components/ui/Button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Cards"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/Avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/DropdownMenu"
import { User, Mail } from 'lucide-react'
import axios from 'axios';
import OverviewTab from '../components/Tabs/OverviewTab';
import UploadTab from '../components/Tabs/UploadTab';
import HistoryTab from '../components/Tabs/HistoryTab';
import SettingsTab from '../components/Tabs/SettingsTab';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  height: number;
  weight: number;
  sex: string;
  totalScans: number;
  //recentSymptoms: string[];
}

export default function UserDashboard() {
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev)
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage

        const response = await axios.get('https://backend-health-lens.vercel.app/user/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(response.data);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEmailReport = async () => {
    try {
      const token = localStorage.getItem('token');
      const reportData = {
        firstName: userData?.firstName,
        lastName: userData?.lastName,
        email: userData?.email,
        username: userData?.username,
        height: userData?.height,
        weight: userData?.weight,
        sex: userData?.sex,
        totalScans: userData?.totalScans,
        //recentSymptoms: userData?.recentSymptoms,
      };
    
      await axios.post('https://backend-health-lens.vercel.app/user/email-report', reportData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    
      alert('Report has been sent to your email!');
    } catch (err) {
      console.error('Error sending report:', err);
      alert('Failed to send report. Please try again later.');
    }
  };
  
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-50 p-8">
      <header className="p-4 flex justify-between items-center bg-white bg-opacity-80 backdrop-blur-md">
        <h1 className="text-2xl font-bold text-indigo-600">SkinAI</h1>
        <nav className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/')}>Home</Button>
          <Button variant="ghost" onClick={() => navigate('/encyclopedia')}>Encyclopedia</Button>
          <Button variant="ghost" onClick={() => navigate('/about')}>About</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" onClick={toggleDropdown}>
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            {isDropdownOpen && (
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate('/')}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        </nav>
      </header>
      <main className="container mx-auto px-4 py-12">
        <Card className="w-full max-w-6xl mx-auto bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-xl overflow-hidden">
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-indigo-600">User Dashboard</CardTitle>
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  size="default"
                  onClick={handleEmailReport}
                  className="flex items-center space-x-2"
                >
                  <Mail className="h-4 w-4" />
                  <span>Email me my report</span>
                </Button>
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                  <AvatarFallback><User /></AvatarFallback>
                </Avatar>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 rounded-lg bg-indigo-100 p-1">
                <TabsTrigger value="overview" className="rounded-md py-2">Overview</TabsTrigger>
                <TabsTrigger value="upload" className="rounded-md py-2">Upload</TabsTrigger>
                <TabsTrigger value="history" className="rounded-md py-2">Chat History</TabsTrigger>
                <TabsTrigger value="settings" className="rounded-md py-2">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <OverviewTab userData={userData} />
              </TabsContent>
              <TabsContent value="upload">
                <UploadTab />
              </TabsContent>
              <TabsContent value="history">
                <HistoryTab />
              </TabsContent>
              <TabsContent value="settings">
                <SettingsTab userData={userData}/>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}