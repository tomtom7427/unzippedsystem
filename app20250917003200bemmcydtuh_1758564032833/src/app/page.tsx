
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Shield, 
  Users, 
  Truck, 
  DollarSign, 
  Calendar,
  BarChart3,
  FileText,
  Settings,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';

export default function Home() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'quality'>('dashboard');

  // Mock data for dashboard metrics
  const businessMetrics = {
    totalProjects: 156,
    activeProjects: 23,
    completedThisMonth: 18,
    revenue: 485000,
    customers: 89,
    employees: 12
  };

  const qualityMetrics = {
    openReports: 5,
    criticalIssues: 2,
    resolvedThisWeek: 8,
    averageResolutionTime: 3.2
  };

  const recentProjects = [
    { id: 1, name: "Fleet Truck Bed Lining", customer: "ABC Logistics", status: "In Progress", value: 15000 },
    { id: 2, name: "Industrial Floor Coating", customer: "Manufacturing Corp", status: "Completed", value: 25000 },
    { id: 3, name: "Trailer Lining Service", customer: "Transport Solutions", status: "Scheduled", value: 8500 },
  ];

  if (currentView === 'quality') {
    // Dynamically import and render the Quality Management Dashboard
    const QualityDashboard = require('./quality-dashboard').default;
    return <QualityDashboard onBack={() => setCurrentView('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Building2 className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold">Rhino Linings</h1>
                  <p className="text-sm text-muted-foreground">Business Management System</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => setCurrentView('quality')}
                className="flex items-center gap-2"
              >
                <Shield className="h-4 w-4" />
                Quality Management
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="container mx-auto px-4 py-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{businessMetrics.totalProjects}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{businessMetrics.activeProjects}</div>
              <p className="text-xs text-muted-foreground">
                Currently in progress
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${businessMetrics.revenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{businessMetrics.customers}</div>
              <p className="text-xs text-muted-foreground">
                +5 new this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Projects */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Recent Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{project.name}</h4>
                      <p className="text-sm text-muted-foreground">{project.customer}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={project.status === 'Completed' ? 'default' : 
                                project.status === 'In Progress' ? 'secondary' : 'outline'}
                      >
                        {project.status}
                      </Badge>
                      <span className="font-medium">${project.value.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Projects
              </Button>
            </CardContent>
          </Card>

          {/* Quality Control Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Quality Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Open Reports</span>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <span className="font-medium">{qualityMetrics.openReports}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Critical Issues</span>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="font-medium">{qualityMetrics.criticalIssues}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Resolved This Week</span>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="font-medium">{qualityMetrics.resolvedThisWeek}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Avg Resolution Time</span>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">{qualityMetrics.averageResolutionTime} days</span>
                </div>
              </div>

              <Button 
                onClick={() => setCurrentView('quality')} 
                className="w-full mt-4"
              >
                <Shield className="h-4 w-4 mr-2" />
                Open Quality Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Users className="h-6 w-6" />
              <span>Add Customer</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <FileText className="h-6 w-6" />
              <span>New Project</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => setCurrentView('quality')}
            >
              <Shield className="h-6 w-6" />
              <span>Quality Report</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <BarChart3 className="h-6 w-6" />
              <span>View Reports</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
