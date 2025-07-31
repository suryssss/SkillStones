import { useState, useEffect } from 'react'
import { api } from '@/utils/api'

export function useProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProjects = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.getProjects()
      setProjects(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const createProject = async (projectData) => {
    try {
      setLoading(true)
      setError(null)
      const newProject = await api.createProject(projectData)
      setProjects(prev => [...prev, newProject])
      return newProject
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const deleteProject = async (projectId) => {
    try {
      setLoading(true)
      setError(null)
      await api.deleteProject(projectId)
      setProjects(prev => prev.filter(project => project.id !== projectId))
      return true
    } catch (error) {
      console.error('Error deleting project:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateProject = async (projectId, projectData) => {
    try {
      setLoading(true)
      setError(null)
      const updatedProject = await api.updateProject(projectId, projectData)
      setProjects(prev => prev.map(project => 
        project.id === projectId ? updatedProject : project
      ))
      return updatedProject
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  return {
    projects,
    loading,
    error,
    createProject,
    deleteProject,
    updateProject,
    refreshProjects: fetchProjects
  }
}
