"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SparklesIcon,
  UserCircleIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  DocumentTextIcon,
  ClipboardDocumentIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import toast, { Toaster } from "react-hot-toast";

const API_URL =
  "https://outflo-assignment-backend-7k8c.onrender.com/api/personalized-message";

export default function MessageGenerator() {
  const [formData, setFormData] = useState({
    name: "",
    job_title: "",
    company: "",
    location: "",
    summary: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          jobTitle: formData.job_title,
          company: formData.company,
          location: formData.location,
          summary: formData.summary,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate message");
      }

      const data = await response.json();
      setMessage(data.message);
      toast.success("Message generated successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to generate message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSampleData = () => {
    setFormData({
      name: "Elon Musk",
      job_title: "CEO",
      company: "Tesla",
      location: "Texas",
      summary: "Building sustainable energy solutions",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#1F2937",
            color: "#fff",
            border: "1px solid #374151",
            borderRadius: "12px",
          },
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        {/* Main Card */}
        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/10">
          <div className="h-2 bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse" />

          <div className="p-8 lg:p-12">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-4 mb-12"
            >
              <div className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl">
                <SparklesIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  AI Message Craft
                </h1>
                <p className="text-gray-400 mt-1">
                  Generate professional outreach messages powered by AI
                </p>
              </div>
            </motion.div>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <motion.div
                    initial={{ x: -20 }}
                    animate={{ x: 0 }}
                    className="relative group"
                  >
                    <UserCircleIcon className="w-6 h-6 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full pl-12 pr-4 py-4 bg-white/5 rounded-xl border border-white/10 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 backdrop-blur-sm transition-all duration-300"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ x: -20 }}
                    animate={{ x: 0 }}
                    className="relative group"
                  >
                    <BriefcaseIcon className="w-6 h-6 text-blue-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Job Title"
                      value={formData.job_title}
                      onChange={(e) =>
                        setFormData({ ...formData, job_title: e.target.value })
                      }
                      className="w-full pl-12 pr-4 py-4 bg-white/5 rounded-xl border border-white/10 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 backdrop-blur-sm transition-all duration-300"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ x: -20 }}
                    animate={{ x: 0 }}
                    className="relative group"
                  >
                    <BuildingOfficeIcon className="w-6 h-6 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Company"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                      className="w-full pl-12 pr-4 py-4 bg-white/5 rounded-xl border border-white/10 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 backdrop-blur-sm transition-all duration-300"
                    />
                  </motion.div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <motion.div
                    initial={{ x: 20 }}
                    animate={{ x: 0 }}
                    className="relative group"
                  >
                    <MapPinIcon className="w-6 h-6 text-blue-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Location"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      className="w-full pl-12 pr-4 py-4 bg-white/5 rounded-xl border border-white/10 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 backdrop-blur-sm transition-all duration-300"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ x: 20 }}
                    animate={{ x: 0 }}
                    className="relative group"
                  >
                    <DocumentTextIcon className="w-6 h-6 text-purple-400 absolute left-3 top-3" />
                    <textarea
                      required
                      placeholder="Professional Summary"
                      value={formData.summary}
                      onChange={(e) =>
                        setFormData({ ...formData, summary: e.target.value })
                      }
                      className="w-full pl-12 pr-4 py-4 bg-white/5 rounded-xl border border-white/10 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 backdrop-blur-sm h-40 resize-none transition-all duration-300"
                    />
                  </motion.div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col lg:flex-row gap-4 mt-12">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="text-lg font-semibold">
                        Generating...
                      </span>
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="w-6 h-6 text-white" />
                      <span className="text-lg font-semibold">
                        Generate Message
                      </span>
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={handleSampleData}
                  className="flex-1 px-8 py-5 border border-white/20 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <span className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Load Sample Data
                  </span>
                </motion.button>
              </div>
            </form>
          </div>
        </div>

        {/* Result Section */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-12 bg-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden"
            >
              <div className="p-8 lg:p-12">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-cyan-500 rounded-lg">
                      <SparklesIcon className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                      Generated Message
                    </h2>
                  </div>
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        navigator.clipboard.writeText(message);
                        toast.success("Copied to clipboard!");
                      }}
                      className="p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all"
                    >
                      <ClipboardDocumentIcon className="w-5 h-5 text-cyan-400" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setMessage("")}
                      className="p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all"
                    >
                      <TrashIcon className="w-5 h-5 text-red-400" />
                    </motion.button>
                  </div>
                </div>
                <div className="p-6 bg-black/20 rounded-xl border border-white/10 backdrop-blur-sm">
                  <p className="text-gray-200 leading-relaxed whitespace-pre-line">
                    {message}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
