import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { endpoints } from '@/api/endpoints'
import type { AnalyzeRequest, ContainmentResult } from '@/types'

// --------- Queries ---------

export function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: endpoints.health,
    refetchInterval: 10_000,
  })
}

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
    onSuccess: (result, nodeId) => {
      // Direct cache update for the results panel and charts
      qc.setQueryData(['containment-result'], result)

      // Invalidate related lists
      qc.invalidateQueries({ queryKey: ['graph'] })
      qc.invalidateQueries({ queryKey: ['threat-scores'] })
      qc.invalidateQueries({ queryKey: ['audit-log'] })

      // Update visual tracking for graph nodes
      const prev = qc.getQueryData<number[]>(['contained-nodes']) ?? []
      if (!prev.includes(nodeId)) {
        qc.setQueryData(['contained-nodes'], [...prev, nodeId])
      }
    },
  })
}

export function useContainmentResult() {
  return useQuery<ContainmentResult | null>({
    queryKey: ['containment-result'],
    queryFn: () => null,
    staleTime: Infinity,
    gcTime: Infinity,
  })
}
