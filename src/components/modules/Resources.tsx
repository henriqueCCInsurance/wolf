import React, { useState } from 'react';
import { FileText, Download, ExternalLink, Search, Filter, BookOpen, Target, Users, TrendingUp, Briefcase, DollarSign, Shield } from 'lucide-react';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import CompetitiveIntelligence from '@/components/intelligence/CompetitiveIntelligence';
import { motion } from 'framer-motion';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: 'branding' | 'sales' | 'research' | 'events' | 'thought-leadership' | 'competitive';
  filename: string;
  size: string;
  icon: React.ElementType;
  featured?: boolean;
  lastUpdated: string;
}

const resources: Resource[] = [
  {
    id: '1',
    title: 'Campbell & Co Brand Guidelines',
    description: 'Complete brand identity guide including logos, colors, typography, and usage guidelines for all marketing materials.',
    category: 'branding',
    filename: 'Campbell_and_Co_Brand_Guideline_December2024.pdf',
    size: '21 MB',
    icon: BookOpen,
    featured: true,
    lastUpdated: 'December 2024'
  },
  {
    id: '2',
    title: 'Company Brochure 2025',
    description: 'Comprehensive overview of Campbell & Co services, capabilities, and value propositions for client presentations.',
    category: 'sales',
    filename: 'C&C_Brochure_8x8_2025.pdf',
    size: '4.8 MB',
    icon: Briefcase,
    featured: true,
    lastUpdated: '2025'
  },
  {
    id: '3',
    title: 'Market Research & Benchmark Report 2025',
    description: 'In-depth market analysis, industry benchmarks, and competitive intelligence for strategic planning.',
    category: 'research',
    filename: 'C&C_2025 -Market Research  & Benchmark_Report.pdf',
    size: '26 MB',
    icon: TrendingUp,
    featured: true,
    lastUpdated: '2025'
  },
  {
    id: '4',
    title: 'Brand and Culture Compass - Sales Edition',
    description: 'Sales-specific guide to Campbell & Co culture, values, and client engagement best practices.',
    category: 'sales',
    filename: '_Brand and Culture Compass_Campbell & Co_Sales Edition_5x8_Print_2024_November 29 2024 2024.pdf',
    size: '12.7 MB',
    icon: Target,
    lastUpdated: 'November 2024'
  },
  {
    id: '5',
    title: '2025 Employee Savings Summit',
    description: 'Event materials and insights from the annual Employee Savings Summit, featuring key trends and strategies.',
    category: 'events',
    filename: '2025 Employee Savings Summit.pdf',
    size: '3.1 MB',
    icon: Users,
    lastUpdated: '2025'
  },
  {
    id: '6',
    title: 'Business Acumen Focus During Uncertain Economic Times',
    description: 'Thought leadership piece on navigating economic uncertainty and positioning benefits strategically.',
    category: 'thought-leadership',
    filename: 'Business Acumen Focus During Uncertain Economic Times.pdf',
    size: '96 KB',
    icon: DollarSign,
    lastUpdated: '2024'
  },
  {
    id: '7',
    title: 'Competitive Intelligence Battle Cards',
    description: 'Interactive competitive intelligence tool with objection handlers, win/loss analysis, and battle cards for major competitors.',
    category: 'competitive',
    filename: 'competitive-intelligence',
    size: 'Interactive',
    icon: Shield,
    featured: true,
    lastUpdated: '2025'
  }
];

const Resources: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCompetitiveIntel, setShowCompetitiveIntel] = useState(false);

  const categories = [
    { id: 'all', label: 'All Resources', count: resources.length },
    { id: 'branding', label: 'Branding', count: resources.filter(r => r.category === 'branding').length },
    { id: 'sales', label: 'Sales Materials', count: resources.filter(r => r.category === 'sales').length },
    { id: 'research', label: 'Research', count: resources.filter(r => r.category === 'research').length },
    { id: 'events', label: 'Events', count: resources.filter(r => r.category === 'events').length },
    { id: 'thought-leadership', label: 'Thought Leadership', count: resources.filter(r => r.category === 'thought-leadership').length },
    { id: 'competitive', label: 'Competitive Intelligence', count: resources.filter(r => r.category === 'competitive').length }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredResources = filteredResources.filter(r => r.featured);
  const otherResources = filteredResources.filter(r => !r.featured);

  const handleDownload = (filename: string, title: string) => {
    const link = document.createElement('a');
    link.href = `/resources/${filename}`;
    link.download = filename;
    link.click();
    
    // Track download analytics (in production, this would send to analytics service)
    console.log(`Downloaded: ${title}`);
  };

  const handleView = (filename: string) => {
    if (filename === 'competitive-intelligence') {
      setShowCompetitiveIntel(true);
    } else {
      window.open(`/resources/${filename}`, '_blank');
    }
  };

  // Show competitive intelligence component if selected
  if (showCompetitiveIntel) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Competitive Intelligence</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Interactive battle cards and competitive analysis tool
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowCompetitiveIntel(false)}
          >
            Back to Resources
          </Button>
        </div>
        <CompetitiveIntelligence showFilters={true} maxCompetitors={10} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Marketing Resources</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Access Campbell & Co sales collateral, brand guidelines, and marketing materials
        </p>
      </div>

      {/* Search and Filter */}
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Search resources by title or description..."
            value={searchQuery}
            onChange={setSearchQuery}
            className="pl-10 pr-4 py-3"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <Filter className="text-gray-400 mt-2" size={20} />
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {category.label} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Featured Resources */}
      {featuredResources.length > 0 && (
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Featured Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredResources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
                        <Icon className="text-primary-600 dark:text-primary-400" size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                          {resource.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                          {resource.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                          <span>{resource.size}</span>
                          <span>Updated: {resource.lastUpdated}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleView(resource.filename)}
                            className="flex-1"
                          >
                            {resource.filename === 'competitive-intelligence' ? (
                              <>
                                <Shield size={14} className="mr-1" />
                                Open Tool
                              </>
                            ) : (
                              <>
                                <ExternalLink size={14} className="mr-1" />
                                View
                              </>
                            )}
                          </Button>
                          {resource.filename !== 'competitive-intelligence' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(resource.filename, resource.title)}
                              className="flex-1"
                            >
                              <Download size={14} className="mr-1" />
                              Download
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Other Resources */}
      {otherResources.length > 0 && (
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Additional Resources</h2>
          <div className="space-y-3">
            {otherResources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                          <Icon className="text-gray-600 dark:text-gray-400" size={20} />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-gray-100">
                            {resource.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {resource.description}
                          </p>
                          <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                            <span>{resource.size}</span>
                            <span>•</span>
                            <span>{resource.lastUpdated}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleView(resource.filename)}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                          title={resource.filename === 'competitive-intelligence' ? 'Open Tool' : 'View PDF'}
                        >
                          {resource.filename === 'competitive-intelligence' ? (
                            <Shield size={16} />
                          ) : (
                            <ExternalLink size={16} />
                          )}
                        </button>
                        {resource.filename !== 'competitive-intelligence' && (
                          <button
                            onClick={() => handleDownload(resource.filename, resource.title)}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                            title="Download PDF"
                          >
                            <Download size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* No Results */}
      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500 dark:text-gray-400">
            No resources found matching your search criteria.
          </p>
        </div>
      )}

      {/* Quick Tips */}
      <Card className="max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 border-blue-200 dark:border-blue-700">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
            <BookOpen className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Using Marketing Resources Effectively
            </h3>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
              <li>• Always use the latest version of brand guidelines for consistency</li>
              <li>• Customize sales materials with prospect-specific information</li>
              <li>• Reference market research data to support your value propositions</li>
              <li>• Share thought leadership content to establish expertise</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Resources;