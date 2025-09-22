
'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import NonconformanceDashboard from '@/components/nonconformance/NonconformanceDashboard';
import NonconformanceReportList from '@/components/nonconformance/NonconformanceReportList';
import NonconformanceReportForm from '@/components/nonconformance/NonconformanceReportForm';
import CorrectiveActionForm from '@/components/nonconformance/CorrectiveActionForm';
import { NonconformanceReport } from '@/types/nonconformance';
import { 
  BarChart3, 
  FileText, 
  Plus, 
  Settings, 
  Shield,
  Building2,
  ArrowLeft
} from 'lucide-react';

interface QualityDashboardProps {
  onBack: () => void;
}

export default function QualityDashboard({ onBack }: QualityDashboardProps) {
  const [selectedReport, setSelectedReport] = useState<NonconformanceReport | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleReportSelect = (report: NonconformanceReport) => {
    setSelectedReport(report);
    setActiveTab('report-details');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'pending_approval':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'closed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <div className="flex items-center space-x-2">
                <Building2 className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold">Rhino Linings</h1>
                  <p className="text-sm text-muted-foreground">Quality Management Dashboard</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Quality Control</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="new-report" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Report
            </TabsTrigger>
            <TabsTrigger value="report-details" className="flex items-center gap-2" disabled={!selectedReport}>
              <Settings className="h-4 w-4" />
              Details
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <NonconformanceDashboard />
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <NonconformanceReportList onSelectReport={handleReportSelect} />
          </TabsContent>

          <TabsContent value="new-report" className="mt-6">
            <div className="max-w-4xl mx-auto">
              <NonconformanceReportForm 
                onSuccess={(report) => {
                  setSelectedReport(report);
                  setActiveTab('report-details');
                }}
              />
            </div>
          </TabsContent>

          <TabsContent value="report-details" className="mt-6">
            {selectedReport ? (
              <div className="max-w-6xl mx-auto space-y-6">
                {/* Report Details Header */}
                <Card>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div>
                        <CardTitle className="text-2xl">{selectedReport.title}</CardTitle>
                        <p className="text-muted-foreground mt-1">
                          Report #{selectedReport.report_number}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getStatusColor(selectedReport.status)}>
                          {selectedReport.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <Badge className={getSeverityColor(selectedReport.severity_level)}>
                          {selectedReport.severity_level.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
                          Priority: {selectedReport.priority_score}/10
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Date Occurred:</span>
                        <p>{new Date(selectedReport.date_occurred).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="font-medium">Location:</span>
                        <p>{selectedReport.location || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="font-medium">Job Site:</span>
                        <p>{selectedReport.job_site || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="font-medium">Category:</span>
                        <p>{selectedReport.category.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <span className="font-medium">Customer Notified:</span>
                        <p>{selectedReport.customer_notified ? 'Yes' : 'No'}</p>
                      </div>
                      {selectedReport.estimated_cost && (
                        <div>
                          <span className="font-medium">Estimated Cost:</span>
                          <p>${selectedReport.estimated_cost.toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 space-y-3">
                      <div>
                        <span className="font-medium">Description:</span>
                        <p className="mt-1">{selectedReport.description}</p>
                      </div>
                      
                      {selectedReport.immediate_action_taken && (
                        <div>
                          <span className="font-medium">Immediate Action Taken:</span>
                          <p className="mt-1">{selectedReport.immediate_action_taken}</p>
                        </div>
                      )}
                      
                      {selectedReport.root_cause_analysis && (
                        <div>
                          <span className="font-medium">Root Cause Analysis:</span>
                          <p className="mt-1">{selectedReport.root_cause_analysis}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Corrective Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Corrective Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CorrectiveActionForm 
                      nonconformanceReportId={selectedReport.id}
                      onSuccess={() => {
                        // Refresh or update the view as needed
                      }}
                    />
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Select a report to view details</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
