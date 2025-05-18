// src/lib/api.ts

const API_BASE = 'http://localhost:3000/api';

export interface Campaign {
  id: string;
  name: string;
  description: string;
  status: "Active" | "Inactive" | "Deleted";
  leads: string[];
  accountIds: string[];
  createdAt: string;
  updatedAt: string;
}

export type CampaignInput = Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>;

export const fetchCampaigns = async (): Promise<Campaign[]> => {
  const res = await fetch(`${API_BASE}/campaigns`);
  if (!res.ok) throw new Error('Failed to fetch campaigns');
  return res.json();
};

export const createCampaign = async (data: CampaignInput): Promise<Campaign> => {
  const res = await fetch(`${API_BASE}/campaigns`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create campaign');
  return res.json();
};

export const updateCampaign = async (id: string, data: Partial<CampaignInput>): Promise<Campaign> => {
  const res = await fetch(`${API_BASE}/campaigns/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update campaign');
  return res.json();
};

export const deleteCampaign = async (id: string): Promise<void> => {
  const res = await fetch(`${API_BASE}/campaigns/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete campaign');
};


export const generatePersonalizedMessage = async (data: {
  name: string;
  job_title: string;
  company: string;
  location: string;
  summary: string;
}): Promise<string> => {
  const payload = {
    name: data.name,
    jobTitle: data.job_title,
    company: data.company,
    location: data.location,
    summary: data.summary
  };

  const res = await fetch(`${API_BASE}/personalized-message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to generate message');
  }

  const result = await res.json();
  return result.message;
};