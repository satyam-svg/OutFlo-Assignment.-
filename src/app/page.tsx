"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
  fetchCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  Campaign,
  CampaignInput,
} from "@/lib/api";

export default function CampaignPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CampaignInput>({
    name: "",
    description: "",
    status: "Active",
    leads: [],
    accountIds: [],
  });

  useEffect(() => {
    const loadCampaigns = async () => {
      setIsLoading(true);
      try {
        const data = await fetchCampaigns();
        setCampaigns(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCampaigns();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const campaignData = {
        ...formData,
        leads: formData.leads.filter((l) => l.trim()),
        accountIds: formData.accountIds.filter((a) => a.trim()),
      };

      let updatedCampaign: Campaign;
      if (selectedCampaign) {
        updatedCampaign = await updateCampaign(
          selectedCampaign.id,
          campaignData
        );
        setCampaigns(
          campaigns.map((c) =>
            c.id === updatedCampaign.id ? updatedCampaign : c
          )
        );
      } else {
        updatedCampaign = await createCampaign(campaignData);
        setCampaigns([...campaigns, updatedCampaign]);
      }

      setIsModalOpen(false);
      setSelectedCampaign(null);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    setIsLoading(true);
    try {
      await deleteCampaign(id);
      setCampaigns(campaigns.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusToggle = async (id: string) => {
    setIsLoading(true);
    try {
      const campaign = campaigns.find((c) => c.id === id);
      if (!campaign) return;

      const newStatus = campaign.status === "Active" ? "Inactive" : "Active";
      const updatedCampaign = await updateCampaign(id, { status: newStatus });
      setCampaigns(campaigns.map((c) => (c.id === id ? updatedCampaign : c)));
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCampaign) {
      setFormData({
        name: selectedCampaign.name,
        description: selectedCampaign.description,
        status: selectedCampaign.status,
        leads: selectedCampaign.leads,
        accountIds: selectedCampaign.accountIds,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        status: "Active",
        leads: [],
        accountIds: [],
      });
    }
  }, [selectedCampaign]);

  const handleAddInput = (field: "leads" | "accountIds") => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const handleInputChange = (
    field: "leads" | "accountIds",
    value: string,
    index: number
  ) => {
    const newValues = [...formData[field]];
    newValues[index] = value;
    setFormData((prev) => ({ ...prev, [field]: newValues }));
  };

  const handleRemoveInput = (field: "leads" | "accountIds", index: number) => {
    const newValues = formData[field].filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, [field]: newValues }));
  };

  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="flex items-center gap-4"
          >
            <div className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl">
              <PlusIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Campaign Manager
            </h1>
          </motion.div>

          <div className="flex gap-4 w-full md:w-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all"
            >
              <PlusIcon className="w-5 h-5 text-white" />
              <span className="text-white">Create Campaign</span>
            </motion.button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8 relative"
        >
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 backdrop-blur-sm text-white placeholder-gray-400"
          />
        </motion.div>

        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 backdrop-blur-xl flex items-center justify-center"
            >
              <svg
                className="animate-spin h-12 w-12 text-purple-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredCampaigns.map((campaign, index) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-white">
                  {campaign.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      campaign.status === "Active"
                        ? "bg-green-500/20 text-green-400"
                        : campaign.status === "Inactive"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400" // Added deleted state styling
                    }`}
                  >
                    {campaign.status}
                  </span>
                  {campaign.status !== "Deleted" && (
                    <button
                      onClick={() => handleStatusToggle(campaign.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        campaign.status === "Active"
                          ? "bg-green-500"
                          : "bg-gray-500"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          campaign.status === "Active"
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-gray-300 mb-4">{campaign.description}</p>

              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-400 mb-2">
                  Leads
                </h4>
                <div className="space-y-1">
                  {campaign.leads.map((lead, i) => (
                    <a
                      key={i}
                      href={lead}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-purple-400 truncate text-sm hover:text-purple-300 transition-colors"
                    >
                      {lead}
                    </a>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-400 mb-2">
                  Account IDs
                </h4>
                <div className="space-y-1">
                  {campaign.accountIds.map((accountId, i) => (
                    <div key={i} className="text-blue-400 truncate text-sm">
                      {accountId}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setSelectedCampaign(campaign);
                    setIsModalOpen(true);
                  }}
                  className="p-2 text-gray-400 hover:text-purple-400 transition-colors"
                >
                  <PencilIcon className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDelete(campaign.id)}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <TrashIcon className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center p-4 z-50"
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: -20, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                  duration: 0.5,
                }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-900 rounded-2xl p-6 w-full max-w-md max-h-[90vh] flex flex-col border border-white/10 shadow-2xl relative"
              >
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex justify-between items-center mb-6"
                >
                  <h2 className="text-2xl font-bold text-white">
                    {selectedCampaign ? "Edit Campaign" : "Create New Campaign"}
                  </h2>
                </motion.div>

                <motion.form
                  onSubmit={handleSubmit}
                  className="flex-1 overflow-y-auto scrollbar-hide pr-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="space-y-5">
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Campaign Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                        required
                      />
                    </motion.div>

                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.35 }}
                    >
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white min-h-[100px]"
                        required
                      />
                    </motion.div>

                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-sm font-medium text-gray-300">
                          Lead URLs
                        </label>
                        <motion.button
                          type="button"
                          onClick={() => handleAddInput("leads")}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1"
                        >
                          <PlusIcon className="w-4 h-4" />
                          Add URL
                        </motion.button>
                      </div>
                      <div className="space-y-3">
                        <AnimatePresence>
                          {formData.leads.map((lead, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="flex gap-2 items-center"
                            >
                              <input
                                type="url"
                                value={lead}
                                onChange={(e) =>
                                  handleInputChange(
                                    "leads",
                                    e.target.value,
                                    index
                                  )
                                }
                                className="flex-1 px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-500"
                                placeholder="https://example.com/lead"
                              />
                              {formData.leads.length > 1 && (
                                <motion.button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveInput("leads", index)
                                  }
                                  whileHover={{ scale: 1.1 }}
                                  className="p-1 text-red-400 hover:text-red-300"
                                >
                                  <TrashIcon className="w-5 h-5" />
                                </motion.button>
                              )}
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.45 }}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-sm font-medium text-gray-300">
                          Account IDs
                        </label>
                        <motion.button
                          type="button"
                          onClick={() => handleAddInput("accountIds")}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1"
                        >
                          <PlusIcon className="w-4 h-4" />
                          Add Account ID
                        </motion.button>
                      </div>
                      <div className="space-y-3">
                        <AnimatePresence>
                          {formData.accountIds.map((accountId, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="flex gap-2 items-center"
                            >
                              <input
                                type="text"
                                value={accountId}
                                onChange={(e) =>
                                  handleInputChange(
                                    "accountIds",
                                    e.target.value,
                                    index
                                  )
                                }
                                className="flex-1 px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-500"
                                placeholder="65f1a2b3c8d1e62b14a7b3a1"
                              />
                              {formData.accountIds.length > 1 && (
                                <motion.button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveInput("accountIds", index)
                                  }
                                  whileHover={{ scale: 1.1 }}
                                  className="p-1 text-red-400 hover:text-red-300"
                                >
                                  <TrashIcon className="w-5 h-5" />
                                </motion.button>
                              )}
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </motion.div>

                    {/* Status Field */}
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Status
                      </label>
                      <motion.select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            status: e.target.value as Campaign["status"], // Type assertion
                          })
                        }
                        whileFocus={{ scale: 1.02 }}
                        className="w-full px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-purple-500 text-white"
                      >
                        <option value="Active" className="bg-gray-800">
                          Active
                        </option>
                        <option value="Inactive" className="bg-gray-800">
                          Inactive
                        </option>
                      </motion.select>
                    </motion.div>
                  </div>

                  {/* Form Actions */}
                  <motion.div
                    className="mt-8 flex justify-end gap-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <motion.button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-5 py-2 text-gray-300 hover:text-white border border-gray-600 rounded-lg transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg transition-all"
                    >
                      {selectedCampaign ? "Update Campaign" : "Create Campaign"}
                    </motion.button>
                  </motion.div>
                </motion.form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
