'use client';

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const [error, setError] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // API base URL
  const API_BASE_URL = 'http://localhost:5000/api';

  // Load projects from the backend and sync with local storage
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);

      try {
        // Try to get cached projects while waiting for API
        const cachedProjects = localStorage.getItem('adminProjects');
        if (cachedProjects) {
          const parsedProjects = JSON.parse(cachedProjects);
          setProjects(parsedProjects);
          filterProjects(activeTab, parsedProjects);
        }

        // Fetch fresh data from backend (session handled automatically)
        const res = await fetch(`${API_BASE_URL}/projects`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Ensures the session cookie is sent automatically
        });

        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const data = await res.json();
        
        if (data.success) {
          setProjects(data.projects);
          filterProjects(activeTab, data.projects);
          
          // Cache the fetched projects in localStorage
          localStorage.setItem('adminProjects', JSON.stringify(data.projects));
        } else {
          setError("Failed to load projects from the server.");
          console.error("Failed to load projects.");
        }
      } catch (error) {
        setError("Error connecting to the server. Using cached data if available.");
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();

    // Set up active tab from localStorage if available
    const savedTab = localStorage.getItem('adminActiveTab');
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('adminActiveTab', activeTab);
  }, [activeTab]);

  // Filter projects based on status tab
  const filterProjects = (status, projectsArray = projects) => {
    let filtered;
    if (status === "pending") {
      filtered = projectsArray.filter(project => project.status === "under review");
    } else if (status === "approved") {
      filtered = projectsArray.filter(project => project.status === "approved");
    } else if (status === "rejected") {
      filtered = projectsArray.filter(project => project.status === "rejected");
    } else {
      filtered = projectsArray;
    }
    
    setFilteredProjects(filtered);
    setActiveTab(status);
  };

  const handleTabChange = (value) => {
    filterProjects(value);
  };

  const openDetailsDialog = (project) => {
    setSelectedProject(project);
    setDetailsDialogOpen(true);
  };

  const closeDetailsDialog = () => {
    setDetailsDialogOpen(false);
  };

  const openReviewDialog = (project) => {
    setSelectedProject(project);
    setFeedbackMessage(project.adminMessage || "");
    setReviewDialogOpen(true);
  };

  const closeReviewDialog = () => {
    setReviewDialogOpen(false);
    setSelectedProject(null);
    setFeedbackMessage("");
  };

  const openPreviewDialog = (project, file) => {
    setSelectedProject(project);
    setSelectedFile(file);
    // Generate preview URL for the file using the preview endpoint
    const previewUrlPath = `${API_BASE_URL}/projects/preview/${project._id}/${file.filename}`;
    setPreviewUrl(previewUrlPath);
    setPreviewDialogOpen(true);
  };

  const closePreviewDialog = () => {
    setPreviewDialogOpen(false);
    setSelectedFile(null);
    setPreviewUrl("");
  };

  const updateLocalStorage = (updatedProjects) => {
    localStorage.setItem('adminProjects', JSON.stringify(updatedProjects));
  };

  const handleApprove = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/projects/approve/${selectedProject._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: feedbackMessage }),
        credentials: 'include', // Send session cookie with request
      });

      const data = await res.json();
      if (data.success) {
        // Update the project status in the local state
        const updatedProjects = projects.map(p => 
          p._id === selectedProject._id ? {...p, status: "approved", adminMessage: feedbackMessage} : p
        );
        setProjects(updatedProjects);
        filterProjects(activeTab, updatedProjects);
        
        // Update localStorage with the new project state
        updateLocalStorage(updatedProjects);
        
        closeReviewDialog();
      } else {
        alert('Failed to approve project.');
      }
    } catch (error) {
      console.error('Error approving project:', error);
      
      // Fallback to local state update if server connection fails
      const updatedProjects = projects.map(p => 
        p._id === selectedProject._id ? {...p, status: "approved", adminMessage: feedbackMessage} : p
      );
      setProjects(updatedProjects);
      filterProjects(activeTab, updatedProjects);
      
      // Update localStorage with the new project state
      updateLocalStorage(updatedProjects);
      
      closeReviewDialog();
      alert('Server connection error. Changes saved locally but may not be synced with the server.');
    }
  };

  const handleReject = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/projects/reject/${selectedProject._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: feedbackMessage }),
        credentials: 'include', // Send session cookie with request
      });

      const data = await res.json();
      if (data.success) {
        // Update the project status in the local state
        const updatedProjects = projects.map(p => 
          p._id === selectedProject._id ? {...p, status: "rejected", adminMessage: feedbackMessage} : p
        );
        setProjects(updatedProjects);
        filterProjects(activeTab, updatedProjects);
        
        // Update localStorage with the new project state
        updateLocalStorage(updatedProjects);
        
        closeReviewDialog();
      } else {
        alert('Failed to reject project.');
      }
    } catch (error) {
      console.error('Error rejecting project:', error);
      
      // Fallback to local state update if server connection fails
      const updatedProjects = projects.map(p => 
        p._id === selectedProject._id ? {...p, status: "rejected", adminMessage: feedbackMessage} : p
      );
      setProjects(updatedProjects);
      filterProjects(activeTab, updatedProjects);
      
      // Update localStorage with the new project state
      updateLocalStorage(updatedProjects);
      
      closeReviewDialog();
      alert('Server connection error. Changes saved locally but may not be synced with the server.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'under review':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Under Review</span>;
      case 'approved':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Approved</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Rejected</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100">Unknown</span>;
    }
  };

  const getFileIcon = (filename) => {
    // Check if filename is defined before using split
    if (!filename) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      );
    }
    
    const parts = filename.split('.');
    // If filename doesn't have an extension or split fails
    if (parts.length <= 1) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      );
    }
    
    const extension = parts.pop().toLowerCase();
    
    switch(extension) {
      case 'pdf':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        );
      case 'doc':
      case 'docx':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        );
      case 'jpg':
      case 'jpeg':
      case 'png':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  // Helper function to safely access file name
  const getFileName = (file) => {
    if (!file) return 'Unknown file';
    return file.originalname || file.name || file.filename || 'Unnamed file';
  };

  // Check if a file is a PDF (for preview functionality)
  const isPdf = (file) => {
    if (!file || !file.filename) return false;
    return file.filename.toLowerCase().endsWith('.pdf');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Review and manage submitted projects</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm">
          {error}
        </div>
      )}

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={handleTabChange} className="mb-8">
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="pending" className="text-sm">
            Pending Review
          </TabsTrigger>
          <TabsTrigger value="approved" className="text-sm">
            Approved
          </TabsTrigger>
          <TabsTrigger value="rejected" className="text-sm">
            Rejected
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>Loading projects...</p>
          </div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-700">No projects found</h3>
            <p className="text-gray-500 text-center mt-1">
              {activeTab === "pending" 
                ? "There are no projects waiting for review." 
                : activeTab === "approved" 
                  ? "No projects have been approved yet."
                  : "No projects have been rejected yet."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project._id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{project.name || 'Unnamed Project'}</CardTitle>
                  <div>
                    {getStatusBadge(project.status)}
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  {project.department && (
                    <Badge variant="outline" className="text-xs bg-blue-50">{project.department}</Badge>
                  )}
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatDate(project.createdAt || project.submittedAt)}</span>
                  </div>
                </div>
                {project.description && (
                  <p className="line-clamp-2 mt-2">
                    {project.description}
                  </p>
                )}
              </CardHeader>
              <CardContent className="pb-2">
                {project.files && project.files.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700 mb-1">Attached Files:</p>
                    <div className="flex flex-wrap gap-2">
                      {project.files.map((file, index) => (
                        <div 
                          key={index} 
                          className={`flex items-center px-2 py-1 bg-gray-50 rounded text-sm ${isPdf(file) ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                          onClick={() => isPdf(file) && openPreviewDialog(project, file)}
                          title={isPdf(file) ? "Click to preview PDF" : ""}
                        >
                          {getFileIcon(getFileName(file))}
                          <span className="ml-1 truncate max-w-xs">{getFileName(file)}</span>
                          {isPdf(file) && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between gap-2 pt-2">
                <Button size="sm" variant="ghost" onClick={() => openDetailsDialog(project)}>
                  View Details
                </Button>
                <Button size="sm" variant="default" onClick={() => openReviewDialog(project)}>
                  Review
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Review Project: {selectedProject?.name || 'Unnamed Project'}</DialogTitle>
          </DialogHeader>
          <div className="my-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Department</p>
                <p>{selectedProject?.department || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Submitted</p>
                <p>{selectedProject ? formatDate(selectedProject.createdAt || selectedProject.submittedAt) : 'N/A'}</p>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500">Description</p>
              <p className="mt-1">{selectedProject?.description || 'No description provided'}</p>
            </div>
            
            {/* Added File Preview Section */}
            {selectedProject?.files && selectedProject.files.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500 mb-2">Attached Files:</p>
                <div className="grid grid-cols-1 gap-2">
                  {selectedProject.files.map((file, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center p-2 bg-gray-50 rounded border border-gray-200 ${isPdf(file) ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                      onClick={() => isPdf(file) && openPreviewDialog(project, file)}
                    >
                      {getFileIcon(getFileName(file))}
                      <span className="ml-2 truncate">{getFileName(file)}</span>
                      {isPdf(file) && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="ml-auto text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            openPreviewDialog(selectedProject, file);
                          }}
                        >
                          Preview
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Feedback Message</label>
            <Textarea
              value={feedbackMessage}
              onChange={(e) => setFeedbackMessage(e.target.value)}
              className="resize-none"
              placeholder="Enter feedback for the submitter..."
            />
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={closeReviewDialog}>Cancel</Button>
            <Button 
              variant="default" 
              className="bg-green-600 hover:bg-green-700 ml-2" 
              onClick={handleApprove}
            >
              Approve
            </Button>
            <Button 
              variant="default" 
              className="bg-red-600 hover:bg-red-700 ml-2" 
              onClick={handleReject}
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedProject?.name || 'Unnamed Project'}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div className="flex gap-2">
              {getStatusBadge(selectedProject?.status)}
              {selectedProject?.department && (
                <Badge variant="outline" className="bg-blue-50">{selectedProject.department}</Badge>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Project ID</h3>
                <p className="mt-1 text-sm font-mono">{selectedProject?._id || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">User ID</h3>
                <p className="mt-1 text-sm font-mono">{selectedProject?.userId?._id || selectedProject?.userId || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                <p className="mt-1">{formatDate(selectedProject?.createdAt)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Updated At</h3>
                <p className="mt-1">{formatDate(selectedProject?.updatedAt)}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <p className="mt-1">{selectedProject?.description || 'No description provided'}</p>
            </div>
            
            {selectedProject?.adminMessage && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Admin Feedback</h3>
                <p className="mt-1 p-3 bg-gray-50 rounded-md">{selectedProject.adminMessage}</p>
              </div>
            )}
            
            {selectedProject?.files && selectedProject.files.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Attached Files</h3>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedProject.files.map((file, index) => (
                    <div 
                      key={index} 
                      className="flex items-center p-2 bg-gray-50 rounded border border-gray-200"
                    >
                      {getFileIcon(getFileName(file))}
                      <span className="ml-2 truncate">{getFileName(file)}</span>
                      {isPdf(file) && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="ml-auto text-xs"
                          onClick={() => openPreviewDialog(selectedProject, file)}
                        >
                          Preview
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDetailsDialog}>Close</Button>
            {selectedProject?.status === "under review" && (
              <Button variant="default" onClick={() => {
                closeDetailsDialog();
                openReviewDialog(selectedProject);
              }}>
                Review Project
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PDF Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-5xl max-h-screen">
          <DialogHeader>
            <DialogTitle>File Preview: {selectedFile ? getFileName(selectedFile) : ''}</DialogTitle>
          </DialogHeader>
          <div className="mt-2 bg-gray-100 rounded-md overflow-hidden" style={{ height: "70vh" }}>
            {previewUrl && (
              <iframe 
                src={previewUrl} 
                className="w-full h-full" 
                title="PDF Preview"
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closePreviewDialog}>Close</Button>
            {selectedProject?.status === "under review" && (
              <Button 
                variant="default" 
                onClick={() => {
                  closePreviewDialog();
                  openReviewDialog(selectedProject);
                }}
              >
                Review Project
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;