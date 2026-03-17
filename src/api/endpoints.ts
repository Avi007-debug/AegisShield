import { api } from './client'
import type {
  ClassifyRequest,
  ClassifyResult,
  AnalyzeRequest,
  AnalyzeResult,
  GraphData,
  ThreatScoresResponse,
  ClusterInfoResponse,
  AuditLogResponse,
  ContainmentResult,
  ExtractTextResult,
} from '@/types'

export const endpoints = {
  health: () => api.get<{ status: string; version: string }>('/health'),

  classify: (data: ClassifyRequest) =>
    api.post<ClassifyResult>('/classify', data).then((r) => r.data),

  extractText: (file: File) => {
    const form = new FormData()
    form.append('file', file)
    return api
      .post<ExtractTextResult>('/extract-text', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data)
  },

  analyze: (data: AnalyzeRequest) =>
    api.post<AnalyzeResult>('/analyze', data).then((r) => r.data),

  getGraph: () => api.get<GraphData>('/graph').then((r) => r.data),

  contain: (nodeId: number) =>
    api.post<ContainmentResult>(`/contain/${nodeId}`).then((r) => r.data),

  getThreatScores: () =>
    api.get<ThreatScoresResponse>('/threat-scores').then((r) => r.data),

  getClusterInfo: () =>
    api.get<ClusterInfoResponse>('/cluster-info').then((r) => r.data),

  getAuditLog: () =>
    api.get<AuditLogResponse>('/audit-log').then((r) => r.data),
}
