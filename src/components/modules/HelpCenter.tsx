import React, { useState } from 'react';
import { HelpCircle, BookOpen, Video, MessageCircle, ChevronRight, Search, ExternalLink, PlayCircle, FileText, Users, Target } from 'lucide-react';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import CollapsibleSection from '@/components/common/CollapsibleSection';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store';

const HelpCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  // const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const tutorials = [
    {
      id: 'getting-started',
      title: 'Getting Started with W.O.L.F',
      duration: '5 min',
      category: 'basics',
      description: 'Learn the fundamentals of using the W.O.L.F sales enablement platform.',
      steps: [
        'Understanding the Dashboard',
        'Setting up your first prospect',
        'Navigating between modules',
        'Using keyboard shortcuts'
      ]
    },
    {
      id: 'call-planner',
      title: 'Mastering the Planner',
      duration: '8 min',
      category: 'modules',
      description: 'Deep dive into prospect research and preparation strategies.',
      steps: [
        'Entering prospect information',
        'Selecting the right persona',
        'Using industry intelligence',
        'Building your content library'
      ]
    },
    {
      id: 'battle-cards',
      title: 'Creating Effective Battle Cards',
      duration: '6 min',
      category: 'modules',
      description: 'Generate powerful reference cards for your sales calls.',
      steps: [
        'Selecting relevant content',
        'Customizing talking points',
        'Exporting to PDF',
        'Using during calls'
      ]
    },
    {
      id: 'live-call',
      title: 'Call Assistance',
      duration: '7 min',
      category: 'modules',
      description: 'Real-time support during your sales conversations.',
      steps: [
        'Accessing quick references',
        'Handling objections live',
        'Taking call notes',
        'Tracking conversation flow'
      ]
    },
    {
      id: 'post-game',
      title: 'Post-Call Analysis',
      duration: '5 min',
      category: 'modules',
      description: 'Log your calls and track performance metrics.',
      steps: [
        'Recording call outcomes',
        'Analyzing conversation quality',
        'Identifying improvement areas',
        'Building follow-up strategies'
      ]
    }
  ];
  
  const faqs = [
    {
      question: 'What is the W.O.L.F methodology?',
      answer: 'W.O.L.F. stands for Wisdom, Opportunity, Leadership, and Focus. It\'s our proven framework for sales excellence that helps you understand your prospect (Wisdom), identify their needs (Opportunity), guide the conversation (Leadership), and close with confidence (Focus).'
    },
    {
      question: 'How do I select the right persona for my prospect?',
      answer: 'Consider your contact\'s role, priorities, and decision-making style. Cost-conscious employers focus on budget, benefits optimizers seek comprehensive solutions, ROI-focused executives want measurable results, and gatekeepers control access to decision-makers.'
    },
    {
      question: 'Can I customize the content library?',
      answer: 'Yes! You can add your own talking points, objection handlers, and thought leadership content. Use the Content Library feature in the Planner to personalize your sales approach.'
    },
    {
      question: 'How does the live intelligence feature work?',
      answer: 'The system searches for recent industry news, trends, and company-specific information to provide you with timely talking points and conversation starters relevant to your prospect.'
    },
    {
      question: 'What\'s the best way to prepare for a cold call?',
      answer: 'Start with the Planner to research your prospect, create a Battle Card with key talking points, review the Call Assistance features, and have your objection handlers ready. The more prepared you are, the more confident you\'ll sound.'
    },
    {
      question: 'How can I track my performance over time?',
      answer: 'Use the Dashboard to monitor your call volume, success rates, and trends. The Results Analysis module helps you log detailed outcomes and identify patterns in your sales conversations.'
    }
  ];
  
  const bestPractices = [
    {
      icon: Target,
      title: 'Research First, Call Second',
      description: 'Spend 5-10 minutes in the Planner before each call. Knowledge builds confidence.'
    },
    {
      icon: Users,
      title: 'Match Your Approach to Their Persona',
      description: 'Tailor your language and value propositions to resonate with your contact\'s priorities.'
    },
    {
      icon: FileText,
      title: 'Keep Battle Cards Concise',
      description: 'Select 3-5 key talking points. Too much information can overwhelm during a live call.'
    },
    {
      icon: MessageCircle,
      title: 'Practice Active Listening',
      description: 'Use the Call Assistance to guide conversations, but always prioritize listening to your prospect.'
    }
  ];
  
  const filteredTutorials = tutorials.filter(tutorial => 
    tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tutorial.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Help Center</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Everything you need to master the W.O.L.F sales enablement platform
        </p>
      </div>
      
      {/* Search Bar */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Search tutorials, FAQs, and best practices..."
            value={searchQuery}
            onChange={setSearchQuery}
            className="pl-10 pr-4 py-3 text-lg"
          />
        </div>
      </div>
      
      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
              <Video className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Video Tutorials</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Step-by-step guides</p>
            </div>
            <ChevronRight className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" size={20} />
          </div>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
              <BookOpen className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Documentation</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Detailed guides</p>
            </div>
            <ChevronRight className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" size={20} />
          </div>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors">
              <MessageCircle className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Support</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Get help</p>
            </div>
            <ChevronRight className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" size={20} />
          </div>
        </Card>
      </div>
      
      {/* Tutorials Section */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Interactive Tutorials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTutorials.map((tutorial, index) => (
            <motion.div
              key={tutorial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">{tutorial.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{tutorial.description}</p>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-300 flex items-center">
                    <PlayCircle size={16} className="mr-1" />
                    {tutorial.duration}
                  </span>
                </div>
                <div className="space-y-2">
                  {tutorial.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <span className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs font-medium mr-2">
                        {stepIndex + 1}
                      </span>
                      {step}
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="mt-4 w-full">
                  Start Tutorial
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Best Practices */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Best Practices</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bestPractices.map((practice, index) => {
            const Icon = practice.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="flex items-start space-x-4">
                  <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                    <Icon className="text-primary-600 dark:text-primary-400" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">{practice.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{practice.description}</p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => (
            <CollapsibleSection
              key={index}
              title={faq.question}
              defaultExpanded={index === 0}
            >
              <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
            </CollapsibleSection>
          ))}
        </div>
      </div>
      
      {/* Marketing Resources Link */}
      <Card className="max-w-4xl mx-auto bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900 dark:to-purple-900 border-indigo-200 dark:border-indigo-700 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-800 rounded-lg">
              <FileText className="text-indigo-600 dark:text-indigo-400" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Marketing Resources</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Access Campbell & Co sales brochures, brand guidelines, and marketing materials to support your sales efforts.
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={() => useAppStore.getState().setCurrentModule('resources')}
          >
            <ExternalLink size={16} className="mr-2" />
            View Resources
          </Button>
        </div>
      </Card>

      {/* Contact Support */}
      <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900 dark:to-primary-800 border-primary-200 dark:border-primary-700">
        <div className="text-center">
          <HelpCircle className="mx-auto text-primary-600 dark:text-primary-400 mb-3" size={48} />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Need More Help?</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Our support team is here to help you succeed with the W.O.L.F platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="primary">
              <MessageCircle size={16} className="mr-2" />
              Contact Support
            </Button>
            <Button variant="outline">
              <ExternalLink size={16} className="mr-2" />
              Visit Knowledge Base
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HelpCenter;