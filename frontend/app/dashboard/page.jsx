'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Search, BookOpen, User, ChevronDown, Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip } from "@/components/ui/tooltip";

// combobox imports
import { Check, ChevronsUpDown } from "lucide-react"
 
import { cn } from "@/lib/utils"
import DropdownMenuBox from '@/components/combobox';
import Department from '@/components/department';

const RESEARCH_PAPERS = [
  { id: 1, title: "AI in Education: A Comprehensive Review", author: "Dr. Jane Smith", department: "Computer Science", abstract: "An in-depth analysis of AI's role in modern education systems." },
  { id: 2, title: "The Impact of Climate Change on Biodiversity", author: "Prof. John Doe", department: "Environmental Science", abstract: "A study on the effects of climate change on global biodiversity." },
  { id: 3, title: "Advancements in Quantum Computing", author: "Dr. Alice Johnson", department: "Physics", abstract: "A look into the latest breakthroughs in quantum computing." },
  { id: 4, title: "Machine Learning in Healthcare Diagnostics", author: "Dr. Robert Chen", department: "Computer Science", abstract: "Exploring the applications of ML algorithms in medical diagnosis and patient care." },
  { id: 5, title: "Sustainable Energy Solutions", author: "Prof. Maria Garcia", department: "Engineering", abstract: "Analysis of renewable energy technologies and their implementation challenges." },
  { id: 6, title: "Cognitive Development in Early Childhood", author: "Dr. Sarah Williams", department: "Psychology", abstract: "Research on cognitive development patterns in children aged 2-5 years." },
  { id: 7, title: "Modern Cryptography Methods", author: "Prof. David Miller", department: "Mathematics", abstract: "Advanced cryptographic techniques and their applications in cybersecurity." },
  { id: 8, title: "Novel Drug Delivery Systems", author: "Dr. Emily Brown", department: "Medicine", abstract: "Innovation in pharmaceutical delivery mechanisms for improved treatment outcomes." },
  { id: 9, title: "Economic Impact of Remote Work", author: "Prof. Michael Wilson", department: "Economics", abstract: "Analysis of how remote work trends affect global economic patterns." },
  { id: 10, title: "Sustainable Urban Planning", author: "Dr. Lisa Anderson", department: "Environmental Science", abstract: "Strategies for developing environmentally conscious urban spaces." },
  { id: 11, title: "Quantum Entanglement Studies", author: "Prof. James Lee", department: "Physics", abstract: "New findings in quantum entanglement and their implications for quantum computing." },
  { id: 12, title: "Digital Privacy in Social Media", author: "Dr. Kevin Park", department: "Computer Science", abstract: "Examining privacy concerns and protection measures in social networks." },
  { id: 13, title: "Green Chemistry Innovations", author: "Prof. Rachel Green", department: "Chemistry", abstract: "Developments in environmentally friendly chemical processes." },
  { id: 14, title: "Modern Poetry Analysis", author: "Dr. Thomas Wright", department: "Literature", abstract: "Critical analysis of contemporary poetic forms and themes." },
  { id: 15, title: "Brain-Computer Interfaces", author: "Prof. Nina Patel", department: "Engineering", abstract: "Latest developments in BCI technology and neural interfaces." },
  { id: 16, title: "Financial Market Prediction Models", author: "Dr. Andrew Thompson", department: "Economics", abstract: "Advanced statistical models for market trend analysis." },
  { id: 17, title: "Renewable Material Science", author: "Prof. Laura Martinez", department: "Chemistry", abstract: "Research on biodegradable and sustainable materials." },
  { id: 18, title: "Mental Health in Digital Age", author: "Dr. Helen Carter", department: "Psychology", abstract: "Impact of digital technology on mental health and well-being." },
  { id: 19, title: "Graph Theory Applications", author: "Prof. Steven Black", department: "Mathematics", abstract: "Novel applications of graph theory in network analysis." },
  { id: 20, title: "Cancer Treatment Innovations", author: "Dr. Patricia White", department: "Medicine", abstract: "Breakthrough treatments in cancer therapy and prevention." }
];

// Component for the Paper Card
const PaperCard = ({ paper, isLoading, onBookmark, onAISummary, isBookmarked }) => (
  <Tooltip content={paper.abstract}>
    <Card className="hover:shadow-lg transition-all duration-300 border-gray-200 rounded-xl p-4 bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">{paper.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-800 font-medium">{paper.author}</p>
        <p className="text-sm text-gray-600 mt-1">{paper.department}</p>
        <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onAISummary(paper.id)}
            className="hover:bg-gray-100 border-black"
          >
            {isLoading ? 'Loading...' : 'AI Summary'}
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onBookmark(paper.id)}
            className={`hover:bg-gray-100 border-black ${isBookmarked ? 'bg-black text-white' : ''}`}
          >
            {isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </Button>
        </div>
      </CardContent>
    </Card>
  </Tooltip>
);

// Main Dashboard Component
export default function Dashboard() {
  // State Management
  const [state, setState] = useState({
    language: 'en',
    selectedDepartment: '',
    loadMore: false,
    searchQuery: '',
    isLoading: false,
    isSidebarOpen: false,
    autocompleteSuggestions: [],
  });

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setState(prev => ({
      ...prev,
      searchQuery: query,
      autocompleteSuggestions: RESEARCH_PAPERS.filter(paper => 
        paper.title.toLowerCase().includes(query.toLowerCase())
      )
    }));
  };

  const fetchAISummary = async (paperId) => {
    setState(prev => ({ ...prev, isLoading: true }));
    setTimeout(() => {
      alert(`Fetched AI summary for paper ID: ${paperId}`);
      setState(prev => ({ ...prev, isLoading: false }));
    }, 2000);
  };

  // Filter papers based on selected department
  const filteredPapers = state.selectedDepartment
    ? RESEARCH_PAPERS.filter(paper => paper.department === state.selectedDepartment)
    : RESEARCH_PAPERS;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Menu Toggle */}
      <Button
        variant="ghost"
        className="fixed bottom-4 right-4 z-50 lg:hidden bg-black text-white hover:bg-gray-800 rounded-full p-3 shadow-lg"
        onClick={() => setState(prev => ({ ...prev, isSidebarOpen: !prev.isSidebarOpen }))}
      >
        {state.isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <aside className={`w-64 bg-black text-white fixed h-full left-0 top-0 z-40 transition-transform duration-300 lg:translate-x-0 ${
        state.isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } p-6`}>
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-white">Research Hub</h2>
        </div>
        <nav>
          <ul className="space-y-4">
            {['Home', 'Trending Topics', 'Bookmarks', 'Account Settings'].map(item => (
              <li key={item}>
                <Button variant="ghost" className="w-full justify-start text-gray-200 hover:text-white hover:bg-gray-800">
                  {item}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto pt-6 border-t border-gray-700">
          <Button variant="ghost" className="w-full justify-start text-gray-200 hover:text-white hover:bg-gray-800">
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30 px-4 lg:px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between max-w-7xl mx-auto gap-4">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                type="search" 
                placeholder="Search papers..." 
                className="pl-10 w-full bg-white border-gray-200 rounded-lg" 
                value={state.searchQuery}
                onChange={handleSearchChange} 
              />
              {state.autocompleteSuggestions.length > 0 && (
                <ul className="absolute bg-white border mt-1 w-full rounded-lg shadow-lg max-h-48 overflow-y-auto z-50">
                  {state.autocompleteSuggestions.map(suggestion => (
                    <li key={suggestion.id} className="p-3 hover:bg-gray-50 cursor-pointer">
                      {suggestion.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="text-gray-800 hover:text-black">
                <Bell className="h-5 w-5" />
              </Button>
              <section>
                <DropdownMenuBox />
              </section>
              <Button variant="ghost" className="text-gray-800 hover:text-black">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-4 lg:p-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Papers Grid */}
            <div className="col-span-1 lg:col-span-2">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900">Latest Research</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                {filteredPapers.slice(0, state.loadMore ? filteredPapers.length : 6).map(paper => (
                  <PaperCard
                    key={paper.id}
                    paper={paper}
                    isLoading={state.isLoading}
                    onAISummary={fetchAISummary}
                  />
                ))}
              </div>
              {!state.loadMore && filteredPapers.length > 6 && (
                <Button 
                  variant="outline" 
                  className="mt-6 w-full border-black hover:bg-gray-100"
                  onClick={() => setState(prev => ({ ...prev, loadMore: true }))}
                >
                  Load More
                </Button>
              )}
            </div>

            {/* Filters Sidebar */}
            <aside className="w-full lg:w-72">
              <Card className="sticky top-24 bg-white">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Filters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-2">Department</label>
                      <Select 
                        value={state.selectedDepartment} 
                        onValueChange={(value) => setState(prev => ({ ...prev, selectedDepartment: value }))}
                      >
                      </Select>
                      <Department />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}