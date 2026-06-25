export type ChecklistStatus = 'not-started' | 'in-progress' | 'done'

export interface ChecklistItem {
  id: string
  label: string
  status: ChecklistStatus
}

export interface BidAnnouncement {
  id: string
  fileName: string
  uploadedAt: string
  title: string | null
  organization: string | null
  estimatedAmount: string | null
  servicePeriod: string | null
  deadline: string | null
  qualification: string | null
  checklist: ChecklistItem[]
}

export interface CompanyInfo {
  name: string
  bizNumber: string
}

export interface SimilarProject {
  id: string
  projectName: string
  client: string
  amount: string
  period: string
  role: string
}

export interface Engineer {
  id: string
  name: string
  license: string
  acquiredDate: string
  affiliation: string
  field: string
}
