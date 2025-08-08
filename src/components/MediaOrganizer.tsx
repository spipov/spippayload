'use client'

import React, { useState, useEffect } from 'react'

interface MediaStats {
  totalFiles: number
  byFolder: Record<string, number>
  byType: Record<string, number>
  recentUploads: Array<{
    filename: string
    folder: string
    fileType: string
    createdAt: string
  }>
}

const MediaOrganizer: React.FC = () => {
  const [stats, setStats] = useState<MediaStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedFolder, setSelectedFolder] = useState<string>('')

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/media?limit=1000')
        if (response.ok) {
          const data = await response.json()
          const files = data.docs || []
          
          const stats: MediaStats = {
            totalFiles: files.length,
            byFolder: {},
            byType: {},
            recentUploads: files
              .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 10)
              .map((file: any) => ({
                filename: file.filename,
                folder: file.folder || 'root',
                fileType: file.fileType || 'unknown',
                createdAt: file.createdAt,
              }))
          }
          
          files.forEach((file: any) => {
            const folder = file.folder || 'root'
            const type = file.fileType || 'unknown'
            
            stats.byFolder[folder] = (stats.byFolder[folder] || 0) + 1
            stats.byType[type] = (stats.byType[type] || 0) + 1
          })
          
          setStats(stats)
        }
      } catch (error) {
        console.error('Failed to fetch media stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const folderLabels: Record<string, string> = {
    'root': 'Root',
    'images': 'Images',
    'fonts': 'Fonts',
    'documents': 'Documents',
    'audio': 'Audio',
    'video': 'Video',
    'email-assets': 'Email Assets',
    'website-assets': 'Website Assets',
    'app-assets': 'App Assets',
    'system': 'System',
    'other': 'Other',
  }

  const typeLabels: Record<string, string> = {
    'image': 'Images',
    'font': 'Fonts',
    'document': 'Documents',
    'audio': 'Audio',
    'video': 'Video',
    'other': 'Other',
  }

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div>Loading media statistics...</div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
        <div>Unable to load media statistics</div>
      </div>
    )
  }

  return (
    <div style={{ 
      border: '1px solid #e1e5e9', 
      borderRadius: '8px', 
      overflow: 'hidden',
      backgroundColor: 'white'
    }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '16px', 
        borderBottom: '1px solid #e1e5e9',
        fontSize: '16px',
        fontWeight: '600'
      }}>
        Media Organization Overview
      </div>

      {/* Stats Grid */}
      <div style={{ padding: '16px' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '16px',
          marginBottom: '24px'
        }}>
          {/* Total Files */}
          <div style={{
            padding: '16px',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#007bff' }}>
              {stats.totalFiles}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>Total Files</div>
          </div>

          {/* By Folder */}
          <div style={{
            padding: '16px',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px'
          }}>
            <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
              Files by Folder
            </div>
            <div style={{ fontSize: '12px' }}>
              {Object.entries(stats.byFolder)
                .sort(([,a], [,b]) => b - a)
                .map(([folder, count]) => (
                  <div key={folder} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '4px'
                  }}>
                    <span>
                      {folderLabels[folder] || folder || 'root'}
                    </span>
                    <span style={{ fontWeight: '600' }}>{count}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* By Type */}
          <div style={{
            padding: '16px',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px'
          }}>
            <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
              Files by Type
            </div>
            <div style={{ fontSize: '12px' }}>
              {Object.entries(stats.byType)
                .sort(([,a], [,b]) => b - a)
                .map(([type, count]) => (
                  <div key={type} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '4px'
                  }}>
                    <span>
                      {typeLabels[type] || type}
                    </span>
                    <span style={{ fontWeight: '600' }}>{count}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Recent Uploads */}
        <div>
          <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
            Recent Uploads
          </div>
          <div style={{ 
            maxHeight: '200px', 
            overflowY: 'auto',
            border: '1px solid #e1e5e9',
            borderRadius: '4px'
          }}>
            {stats.recentUploads.map((file, index) => (
              <div key={index} style={{
                padding: '8px 12px',
                borderBottom: index < stats.recentUploads.length - 1 ? '1px solid #f0f0f0' : 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: '500' }}>{file.filename}</span>
                  <span style={{
                    backgroundColor: '#e3f2fd',
                    color: '#1565c0',
                    padding: '2px 6px',
                    borderRadius: '3px',
                    fontSize: '10px'
                  }}>
                    {folderLabels[file.folder] || file.folder}
                  </span>
                </div>
                <div style={{ color: '#666' }}>
                  {new Date(file.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Organization Tips */}
        <div style={{ 
          marginTop: '24px',
          padding: '16px',
          backgroundColor: '#e8f5e8',
          borderRadius: '6px',
          border: '1px solid #c8e6c9'
        }}>
          <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#2e7d32' }}>
            Organization Tips
          </div>
          <div style={{ fontSize: '12px', color: '#2e7d32', lineHeight: '1.4' }}>
            <div>• Files are automatically organized by type when uploaded</div>
            <div>• Use the folder dropdown to manually organize files</div>
            <div>• Add tags for better searchability (e.g., "logo", "header", "woff2")</div>
            <div>• Font files are automatically tagged with weight and style information</div>
            <div>• Use the usage field to track where files are intended to be used</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MediaOrganizer
