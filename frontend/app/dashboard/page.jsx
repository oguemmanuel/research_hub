'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Search, User, Menu, X, LogOut, Upload, Calendar, FileText, CheckCircle, AlertCircle, Download, File } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import DropdownMenuBox from '@/components/combobox';
import Department from '@/components/department';
import { useRouter } from 'next/navigation';

// Language translations
const translations = {
  en: {
    researchHub: "Research Hub",
    latestResearch: "Latest Research",
    searchPapers: "Search papers...",
    aiSummary: "AI Summary",
    bookmark: "Bookmark",
    bookmarked: "Bookmarked",
    loading: "Loading...",
    noProjects: "No projects available",
    department: "Department",
    status: "Status",
    createdAt: "Created At",
    notifications: "Notifications",
    noNotifications: "No notifications",
    files: "Files",
    viewFile: "View File",
    downloadFile: "Download File",
    noFiles: "No files available",
    uploadForm: {
      title: "Upload Document",
      name: "Name",
      description: "Description",
      submit: "Submit"
    }
  },
  es: {
    researchHub: "Centro de Investigación",
    latestResearch: "Última Investigación",
    searchPapers: "Buscar documentos...",
    aiSummary: "Resumen IA",
    bookmark: "Guardar",
    bookmarked: "Guardado",
    loading: "Cargando...",
    noProjects: "No hay proyectos disponibles",
    department: "Departamento",
    status: "Estado",
    createdAt: "Creado El",
    notifications: "Notificaciones",
    noNotifications: "No hay notificaciones",
    files: "Archivos",
    viewFile: "Ver Archivo",
    downloadFile: "Descargar Archivo",
    noFiles: "No hay archivos disponibles",
    uploadForm: {
      title: "Subir Documento",
      name: "Nombre",
      description: "Descripción",
      submit: "Enviar"
    }
  },
  it: {
    researchHub: "Centro di Ricerca",
    latestResearch: "Ultime Ricerche",
    searchPapers: "Cerca documenti...",
    aiSummary: "Riepilogo IA",
    bookmark: "Segnalibro",
    bookmarked: "Salvato",
    loading: "Caricamento...",
    noProjects: "Nessun progetto disponibile",
    department: "Dipartimento",
    status: "Stato",
    createdAt: "Creato Il",
    notifications: "Notifiche",
    noNotifications: "Nessuna notifica",
    files: "File",
    viewFile: "Visualizza File",
    downloadFile: "Scarica File",
    noFiles: "Nessun file disponibile",
    uploadForm: {
      title: "Carica Documento",
      name: "Nome",
      description: "Descrizione",
      submit: "Invia"
    }
  },
  fr: {
    researchHub: "Centre de Recherche",
    latestResearch: "Dernières Recherches",
    searchPapers: "Rechercher des documents...",
    aiSummary: "Résumé IA",
    bookmark: "Marquer",
    bookmarked: "Marqué",
    loading: "Chargement...",
    noProjects: "Aucun projet disponible",
    department: "Département",
    status: "Statut",
    createdAt: "Créé Le",
    notifications: "Notifications",
    noNotifications: "Aucune notification",
    files: "Fichiers",
    viewFile: "Voir le Fichier",
    downloadFile: "Télécharger le Fichier",
    noFiles: "Aucun fichier disponible",
    uploadForm: {
      title: "Télécharger un Document",
      name: "Nom",
      description: "Description",
      submit: "Soumettre"
    }
  }
};

// Department Form Component
const DepartmentForm = ({ department, language }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    files: []
  });

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      files: Array.from(e.target.files)
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.description || formData.files.length === 0) {
      alert("Please fill out all fields and upload files.");
      return;
    }
  
    // Prepare the form data
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('department', department);
    
    // Append each file to formData
    formData.files.forEach((file) => {
      formDataToSend.append('files', file);
    });
  
    try {
      // Make the POST request to the server
      const response = await fetch('http://localhost:5000/api/projects/submit', {
        method: 'POST',
        body: formDataToSend,
        credentials: 'include', // Ensure cookies are sent with the request
      });
  
      // Check if the request was successful
      if (response.ok) {
        const data = await response.json();
        console.log('Form submitted successfully:', data);
        // <AlertComponents />
        alert("Your project submitted successfully, this usually takes 24hrs to review your project, we will get back to you soon.");
        
        // Reset form after successful submission
        setFormData({
          name: '',
          description: '',
          files: []
        });
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Failed to submit project'}`);
      }
    } catch (error) {
      // Handle any unexpected errors
      console.error('Error submitting form:', error);
      alert(`Error: ${error.message || 'Network or server error'}`);
    }
  };
  
  const t = translations[language];

  return (
    <Card className="mt-4 p-4">
      <CardHeader>
        <CardTitle>{t.uploadForm.title} - {department}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Form to dynamically upload project. */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t.uploadForm.name}</label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              placeholder='Project Name'
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t.uploadForm.description}</label>
            <textarea
              className="w-full border rounded-md p-2"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              required
              placeholder='Project description...'
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Project Files</label>
            <div className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="w-full cursor-pointer"
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            {t.uploadForm.submit}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

// File Item Component
const FileItem = ({ file, language }) => {
  const t = translations[language];
  
  // Get file extension to determine icon
  const getFileExtension = (filename) => {
    return filename.split('.').pop().toLowerCase();
  };
  
  const extension = getFileExtension(file.filename);
  
  // Get base URL for the server
  const serverBaseUrl = 'http://localhost:5000';
  const fileUrl = `${serverBaseUrl}${file.fileUrl}`;
  
  return (
    <div className="flex items-center justify-between p-2 border rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="flex items-center space-x-2">
        <File className="h-4 w-4 text-blue-500" />
        <span className="text-sm text-gray-700 truncate max-w-xs">
          {file.filename}
        </span>
      </div>
      <div className="flex space-x-1">
        <Button
          size="sm"
          variant="ghost"
          className="p-1 h-8"
          onClick={() => window.open(fileUrl, '_blank')}
          title={t.viewFile}
        >
          <FileText className="h-4 w-4 text-blue-600" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="p-1 h-8"
          onClick={() => {
            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = file.filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          title={t.downloadFile}
        >
          <Download className="h-4 w-4 text-green-600" />
        </Button>
      </div>
    </div>
  );
};

const PaperCard = ({ paper, isLoading, onAISummary, language }) => {
  const t = translations[language];
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <TooltipProvider>
      <Card className="hover:shadow-lg transition-all duration-300 border-gray-200 rounded-xl overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-gray-900">{paper.name}</CardTitle>
        </CardHeader>
        <CardContent className="pb-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-sm text-gray-600 line-clamp-2 cursor-help">
                {paper.description}
              </p>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>{paper.description}</p>
            </TooltipContent>
          </Tooltip>
          
          <div className="mt-4 space-y-2">
            <div className="flex items-center text-sm">
              <FileText className="h-4 w-4 mr-2 text-gray-500" />
              <span className="font-medium mr-2">{t.department}:</span>
              <Badge variant="outline" className="font-normal">
                {paper.department}
              </Badge>
            </div>
            
            <div className="flex items-center text-sm">
              <CheckCircle className="h-4 w-4 mr-2 text-gray-500" />
              <span className="font-medium mr-2">{t.status}:</span>
              <Badge className={getStatusColor(paper.status)}>
                {paper.status}
              </Badge>
            </div>
            
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              <span className="font-medium mr-2">{t.createdAt}:</span>
              <span>{formatDate(paper.createdAt)}</span>
            </div>
            
            {/* Files Section */}
            <div className="mt-3">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <FileText className="h-4 w-4 mr-2 text-gray-500" />
                {t.files}:
              </h4>
              
              {paper.files && paper.files.length > 0 ? (
                <div className="space-y-2">
                  {paper.files.map((file, index) => (
                    <FileItem key={file._id || index} file={file} language={language} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">{t.noFiles}</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2 pb-4">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onAISummary(paper._id)}
            className="hover:bg-gray-100 border-black w-full"
          >
            {isLoading ? t.loading : t.aiSummary}
          </Button>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
};

export default function Dashboard() {
  const [state, setState] = useState({
    language: 'en',
    selectedDepartment: '',
    loadMore: false,
    searchQuery: '',
    isLoading: false,
    isSidebarOpen: false,
    autocompleteSuggestions: [],
  });

  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(false);
  const [projects, setProjects] = useState([]);
  const [fetchingProjects, setFetchingProjects] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const router = useRouter();

  // Fetch user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/user-info', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user info');
        }

        const data = await response.json();
        if (data.success) {
          setUser(data.data.user);
        } else {
          console.log('User data not available or error:', data.message);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  // Fetch projects from the backend
  useEffect(() => {
    const fetchProjects = async () => {
      setFetchingProjects(true);
      try {
        // Fetch approved projects from the API
        const response = await fetch(`http://localhost:5000/api/projects/approved`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }

        const data = await response.json();
        if (data.success) {
          const projects = data.projects || [];
          setProjects(projects);
          
          // Extract admin messages as notifications
          const newNotifications = projects
            .filter(project => project.adminMessage)
            .map(project => ({
              id: project._id,
              message: project.adminMessage,
              projectName: project.name,
              date: project.updatedAt || project.createdAt,
              read: false
            }));
          
          setNotifications(newNotifications);
          setUnreadNotificationsCount(newNotifications.length);
        } else {
          console.error('Failed to load projects:', data.message);
          setProjects([]);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
      } finally {
        setFetchingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  const handleLanguageChange = (newLanguage) => {
    setState(prev => ({ ...prev, language: newLanguage }));
  };

  const handleDepartmentChange = (department) => {
    setState(prev => ({ ...prev, selectedDepartment: department }));
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setState(prev => ({
      ...prev,
      searchQuery: query,
      autocompleteSuggestions: projects.filter(project => 
        project.name.toLowerCase().includes(query.toLowerCase())
      )
    }));
  };

  const fetchAISummary = async (projectId) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      // In a real application, you would make an API call to get the AI summary
      // For demo purposes, we'll use a setTimeout to simulate the API call
      setTimeout(() => {
        alert(`Fetched AI summary for project ID: ${projectId}`);
        setState(prev => ({ ...prev, isLoading: false }));
      }, 2000);
    } catch (error) {
      console.error('Error fetching AI summary:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleLogout = () => {
    // Clear session info and user state
    sessionStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  // Format date for notifications
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Toggle notifications panel
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    // Reset userProfile panel if it's open
    if (userProfile) setUserProfile(false);
  };

  // Mark a notification as read
  const markNotificationAsRead = (notificationId) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === notificationId ? { ...notification, read: true } : notification
      )
    );
    
    // Update the unread count
    const updatedUnreadCount = notifications.filter(notification => 
      notification.id !== notificationId && !notification.read
    ).length;
    
    setUnreadNotificationsCount(updatedUnreadCount);
  };

  // Get the count of unread notifications
  useEffect(() => {
    const unreadCount = notifications.filter(notification => !notification.read).length;
    setUnreadNotificationsCount(unreadCount);
  }, [notifications]);

  // Filter projects based on selected department and search
  const filteredProjects = projects.filter(project => {
    // Department filter
    if (state.selectedDepartment && project.department !== state.selectedDepartment) {
      return false;
    }
    
    // Search filter
    if (state.searchQuery && !project.name.toLowerCase().includes(state.searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const t = translations[state.language];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        className="fixed bottom-4 right-4 z-50 lg:hidden bg-black text-white hover:bg-gray-800 rounded-full p-3 shadow-lg"
        onClick={() => setState(prev => ({ ...prev, isSidebarOpen: !prev.isSidebarOpen }))}
      >
        {state.isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>
      
      {/* Sidebar */}
      <aside className={`w-64 bg-black text-white fixed h-full left-0 top-0 z-40 transition-transform duration-300 lg:translate-x-0 ${state.isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} p-6`}>
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-white">{t.researchHub}</h2>
        </div>
        <nav>
          <h1 className='text-white text-2xl'>Trending Topics</h1>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30 px-4 lg:px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between max-w-7xl mx-auto gap-4">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                type="search" 
                placeholder={t.searchPapers}
                className="pl-10 w-full bg-white border-gray-200 rounded-lg" 
                value={state.searchQuery}
                onChange={handleSearchChange} 
              />
              {state.autocompleteSuggestions.length > 0 && state.searchQuery.length > 0 && (
                <ul className="absolute bg-white border mt-1 w-full rounded-lg shadow-lg max-h-48 overflow-y-auto z-50">
                  {state.autocompleteSuggestions.map(suggestion => (
                    <li 
                      key={suggestion._id} 
                      className="p-3 hover:bg-gray-50 cursor-pointer"
                      onClick={() => setState(prev => ({ ...prev, searchQuery: suggestion.name }))}
                    >
                      {suggestion.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex items-center gap-4">
              {/* Notification Bell with Counter */}
              <div className="relative">
                <Button variant="ghost" className="text-gray-800 hover:text-black relative" onClick={toggleNotifications}>
                  <Bell className="h-5 w-5" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </Button>
                
                {/* Notifications Panel */}
                {showNotifications && (
                  <div className="absolute top-10 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80 max-h-96 overflow-y-auto z-50">
                    <h3 className="font-bold text-lg mb-3">{t.notifications}</h3>
                    {notifications.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">{t.noNotifications}</p>
                    ) : (
                      <div className="space-y-3">
                        {notifications.map(notification => (
                          <div 
                            key={notification.id} 
                            className={`border-b border-gray-100 pb-3 ${notification.read ? 'opacity-70' : ''}`}
                            onClick={() => !notification.read && markNotificationAsRead(notification.id)}
                          >
                            <div className="flex items-start cursor-pointer">
                              <AlertCircle className={`h-5 w-5 mt-0.5 flex-shrink-0 mr-2 ${notification.read ? 'text-gray-400' : 'text-blue-500'}`} />
                              <div>
                                <p className="font-medium text-sm">{notification.projectName}</p>
                                <p className="text-sm text-gray-600">{notification.message}</p>
                                <p className="text-xs text-gray-400 mt-1">{formatDate(notification.date)}</p>
                                {!notification.read && (
                                  <Badge className="mt-2 bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer">
                                    Click to mark as read
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <section>
                <DropdownMenuBox onLanguageChange={handleLanguageChange} />
              </section>

              {/* Display user info and logout */}
              <div className="cursor-pointer relative bg-blue-600 py-2 px-2 rounded-full ring-[0.3rem] ring-indigo-500 ring-opacity-50">
                <User 
                  onClick={() => {
                    setUserProfile(!userProfile);
                    if (showNotifications) setShowNotifications(false);
                  }} 
                  className='text-white'
                />                          
                {userProfile && (
                  <div className="absolute top-10 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-[15rem] flex flex-col gap-2 z-50">
                    <p className='font-bold'>{user?.name}</p>
                    <p className='font-bold'>{user?.email}</p>
                    <p className='font-bold'>ID: {user?.indexNumber || "Regular User"}</p>
                    <Button variant="ghost" className="text-gray-800 flex gap-2 hover:text-white mt-2" onClick={handleLogout}>
                      <LogOut className="h-5 w-5" /> <p>Logout</p>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-4 lg:p-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Papers Grid */}
            <div className="col-span-1 lg:col-span-2">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900">{t.latestResearch}</h2>
              
              {fetchingProjects ? (
                <div className="flex justify-center items-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p>{t.loading}</p>
                  </div>
                </div>
              ) : filteredProjects.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                  <div className="text-center">
                    <p className="text-gray-500">{t.noProjects}</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                  {filteredProjects.map(project => (
                    <PaperCard 
                      key={project._id} 
                      paper={project} 
                      isLoading={state.isLoading}
                      onAISummary={fetchAISummary}
                      language={state.language}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar Section */}
            <div className="hidden lg:block">
              <Department onDepartmentChange={handleDepartmentChange} />
              {state.selectedDepartment && (
                <DepartmentForm 
                  department={state.selectedDepartment}
                  language={state.language}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}