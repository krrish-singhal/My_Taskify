"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Search, Mail, MessageCircle } from "lucide-react"

const Help = () => {
  const [activeQuestion, setActiveQuestion] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  const faqs = [
    {
      id: 1,
      question: "How do I create a new task?",
      answer:
        "To create a new task, click on the 'Create Task' button in the sidebar or the '+' button on the dashboard. Fill in the task details such as title, description, due date, and priority, then click 'Create Task' to save it.",
    },
    {
      id: 2,
      question: "How do I mark a task as important?",
      answer:
        "You can mark a task as important by clicking the star icon next to the task title. This will add the task to your 'Important' list for easy access. You can also mark a task as important when creating or editing it.",
    },
    {
      id: 3,
      question: "How do I set a due date for my task?",
      answer:
        "When creating or editing a task, you'll see a 'Due Date' field with a calendar icon. Click on it to open a date picker, then select the desired due date for your task.",
    },
    {
      id: 4,
      question: "How do I add subtasks to my task?",
      answer:
        "When viewing a task, you'll see a 'Subtasks' section. Click on 'Add Subtask', enter the subtask title, and click 'Add' or press Enter. You can mark subtasks as completed by clicking the checkbox next to them.",
    },
    {
      id: 5,
      question: "How do I filter my tasks?",
      answer:
        "You can filter your tasks using the sidebar navigation. Click on 'Today' to see tasks due today, 'Upcoming' for future tasks, 'Important' for starred tasks, or 'Completed' for finished tasks. You can also use the search bar to find specific tasks.",
    },
    {
      id: 6,
      question: "Can I change my account settings?",
      answer:
        "Yes, you can change your account settings by clicking on your profile picture in the top-right corner and selecting 'Profile' or 'Settings'. From there, you can update your personal information, change your password, and manage notification preferences.",
    },
    {
      id: 7,
      question: "How do I delete a task?",
      answer:
        "To delete a task, open the task details by clicking on it, then click the trash icon in the top-right corner. You'll be asked to confirm the deletion. Once confirmed, the task will be permanently removed.",
    },
  ]

  const toggleQuestion = (id) => {
    setActiveQuestion(activeQuestion === id ? null : id)
  }

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="py-6">
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-6">Help Center</h2>

      <div className="mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Getting Started</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Learn the basics of using Taskify</p>
          <button className="text-purple-600 dark:text-purple-400 font-medium hover:underline">View Guide</button>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Video Tutorials</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Watch tutorials on how to use features</p>
          <button className="text-purple-600 dark:text-purple-400 font-medium hover:underline">Watch Videos</button>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Contact Support</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Get help from our support team</p>
          <button className="text-purple-600 dark:text-purple-400 font-medium hover:underline">Contact Us</button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Frequently Asked Questions</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => (
              <div key={faq.id} className="p-6">
                <button
                  className="flex justify-between items-center w-full text-left focus:outline-none"
                  onClick={() => toggleQuestion(faq.id)}
                >
                  <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300">{faq.question}</h4>
                  {activeQuestion === faq.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  )}
                </button>
                {activeQuestion === faq.id && <p className="mt-4 text-gray-600 dark:text-gray-400">{faq.answer}</p>}
              </div>
            ))
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">No results found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 bg-purple-50 dark:bg-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">Still Need Help?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center">
            <Mail className="w-6 h-6 text-purple-600 mr-3" />
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300">Email Support</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">support@taskify.com</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center">
            <MessageCircle className="w-6 h-6 text-purple-600 mr-3" />
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300">Live Chat</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Available 9am-5pm EST</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Help
