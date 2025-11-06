// services/leadService.ts
import type { Lead, LeadStatus } from '../types.ts';

const LEADS_KEY = 'advocaciaai_leads';

const getLeads = (): Lead[] => {
    try {
        const leadsJson = localStorage.getItem(LEADS_KEY);
        return leadsJson ? JSON.parse(leadsJson) : [];
    } catch (e) {
        console.error("Failed to parse leads from localStorage", e);
        return [];
    }
};

const saveLeads = (leads: Lead[]): void => {
    try {
        localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
    } catch (e) {
        console.error("Failed to save leads to localStorage", e);
    }
};

export const leadService = {
    getLeads,

    addLead: (newLead: Omit<Lead, 'status' | 'createdAt'>): Lead | null => {
        const leads = getLeads();
        if (leads.some(lead => lead.id === newLead.id || lead.name === newLead.name)) {
            // Already exists
            return null;
        }
        const leadWithDefaults: Lead = {
            ...newLead,
            status: 'Novo',
            createdAt: new Date().toISOString(),
        };
        const updatedLeads = [leadWithDefaults, ...leads];
        saveLeads(updatedLeads);
        return leadWithDefaults;
    },

    updateLeadStatus: (leadId: string, status: LeadStatus): Lead[] => {
        const leads = getLeads();
        const leadIndex = leads.findIndex(lead => lead.id === leadId);
        if (leadIndex > -1) {
            leads[leadIndex].status = status;
            saveLeads(leads);
        }
        return leads;
    },

    removeLead: (leadId: string): Lead[] => {
        let leads = getLeads();
        leads = leads.filter(lead => lead.id !== leadId);
        saveLeads(leads);
        return leads;
    },
};
