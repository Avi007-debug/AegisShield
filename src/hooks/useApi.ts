import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { endpoints } from '@/api/endpoints'
import type { ClassifyRequest, AnalyzeRequest } from '@/types'

// --------- Queries ---------

export function useGraph() {
  return useQuery({
    queryKey: ['graph'],
    queryFn: endpoints.getGraph,
  })
}

export function useThreatScores() {
  return useQuery({
    queryKey: ['threat-scores'],
    queryFn: endpoints.getThreatScores,
    refetchInterval: 10_000,
  })
}

export function useClusterInfo() {
  return useQuery({
    queryKey: ['cluster-info'],
    queryFn: endpoints.getClusterInfo,
  })
}

export function useAuditLog() {
  return useQuery({
    queryKey: ['audit-log'],
    queryFn: endpoints.getAuditLog,
    refetchInterval: 5_000,
  })
}

// --------- Mutations ---------

export function useClassify() {
  return useMutation({
    mutationFn: (data: ClassifyRequest) => endpoints.classify(data),
  })
}

export function useExtractText() {
  return useMutation({
    mutationFn: (file: File) => endpoints.extractText(file),
  })
}

export function useAnalyze() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: AnalyzeRequest) => endpoints.analyze(data),
    onSuccess: (result) => {
      qc.setQueryData(['graph'], result.graph)
    },
  })
}

export function useContain() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (nodeId: number) => endpoints.contain(nodeId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['graph'] })
      qc.invalidateQueries({ queryKey: ['threat-scores'] })
      qc.invalidateQueries({ queryKey: ['audit-log'] })
    },
  })
}
