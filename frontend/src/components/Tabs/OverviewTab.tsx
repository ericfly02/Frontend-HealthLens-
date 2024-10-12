import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Cards';
import { BarChart2, MessageSquare, Settings } from 'lucide-react';

// receive user data as props
interface OverviewTabProps {
  userData: any;
}

const OverviewTab = ({ userData }: OverviewTabProps) => {
  console.log(userData);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome back, {userData?.name || ' '}!</CardTitle>
        <CardDescription>Here's an overview of your account activity.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
              <BarChart2 className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <p className="text-xs text-gray-500">+10% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
              <MessageSquare className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-gray-500">2 new since yesterday</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Saved Reports</CardTitle>
              <Settings className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-gray-500">View all reports</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default OverviewTab;
