'use client'

import React, { useState, useEffect } from 'react'
import { SYSTEM_VARIABLES, getSystemVariablesByCategory, type SystemVariable } from '@/lib/systemVariables'

interface GlobalVariable {
  id: string
  name: string
  displayName: string
  description: string
  value: string
  category: string
  isActive: boolean
}

interface VariableReferenceProps {
  showTemplateVariables?: boolean
  templateVariables?: Array<{
    name: string
    description: string
    required: boolean
    defaultValue?: string
  }>
  compact?: boolean
  path?: string
}

const VariableReference: React.FC<VariableReferenceProps> = ({
  showTemplateVariables = false,
  templateVariables = [],
  compact = false,
  path = ''
}) => {
  const [globalVariables, setGlobalVariables] = useState<GlobalVariable[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'system' | 'global' | 'template'>('system')
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch global variables
  useEffect(() => {
    const fetchGlobalVariables = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/global-variables?limit=100')
        if (response.ok) {
          const data = await response.json()
          setGlobalVariables(data.docs || [])
        }
      } catch (error) {
        console.error('Failed to fetch global variables:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGlobalVariables()
  }, [])

  const systemVariablesByCategory = getSystemVariablesByCategory()
  const globalVariablesByCategory = globalVariables.reduce((acc, variable) => {
    if (!acc[variable.category]) {
      acc[variable.category] = []
    }
    acc[variable.category].push(variable)
    return acc
  }, {} as Record<string, GlobalVariable[]>)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(`{{${text}}}`)
  }

  const filterVariables = (variables: any[], searchTerm: string) => {
    if (!searchTerm) return variables
    return variables.filter(v => 
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  const VariableCard: React.FC<{ variable: SystemVariable | GlobalVariable | any, type: 'system' | 'global' | 'template' }> = ({ variable, type }) => (
    <div style={{
      border: '1px solid #e1e5e9',
      borderRadius: '6px',
      padding: '12px',
      marginBottom: '8px',
      backgroundColor: 'white',
      transition: 'box-shadow 0.2s',
    }}
    onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'}
    onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <code style={{
              backgroundColor: type === 'system' ? '#e3f2fd' : type === 'global' ? '#f3e5f5' : '#fff3e0',
              color: type === 'system' ? '#1565c0' : type === 'global' ? '#7b1fa2' : '#ef6c00',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              {`{{${variable.name}}}`}
            </code>
            {variable.isRequired && (
              <span style={{ color: '#d32f2f', fontSize: '12px', fontWeight: '600' }}>Required</span>
            )}
          </div>
          <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>
            {variable.displayName || variable.name}
          </div>
          <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.4' }}>
            {variable.description}
          </div>
          {variable.example && (
            <div style={{ fontSize: '12px', color: '#888', marginTop: '4px', fontStyle: 'italic' }}>
              Example: {variable.example}
            </div>
          )}
          {variable.defaultValue && (
            <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
              Default: {variable.defaultValue}
            </div>
          )}
        </div>
        <button
          onClick={() => copyToClipboard(variable.name)}
          style={{
            padding: '4px 8px',
            fontSize: '11px',
            backgroundColor: '#f5f5f5',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
            marginLeft: '8px'
          }}
          title="Copy variable to clipboard"
        >
          Copy
        </button>
      </div>
    </div>
  )

  if (compact) {
    return (
      <details style={{ marginTop: '16px' }}>
        <summary style={{ cursor: 'pointer', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
          Variable Reference ({SYSTEM_VARIABLES.length + globalVariables.length} available)
        </summary>
        <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #e1e5e9', borderRadius: '6px', padding: '12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '12px' }}>
            {Object.entries(systemVariablesByCategory).map(([category, variables]) => (
              <div key={category}>
                <strong style={{ textTransform: 'capitalize', color: '#1565c0' }}>{category}:</strong>
                <div style={{ fontFamily: 'monospace', marginTop: '4px' }}>
                  {variables.map(v => (
                    <div key={v.name} style={{ marginBottom: '2px' }}>
                      <code onClick={() => copyToClipboard(v.name)} style={{ cursor: 'pointer' }}>
                        {`{{${v.name}}}`}
                      </code> - {v.displayName}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </details>
    )
  }

  return (
    <div style={{ border: '1px solid #e1e5e9', borderRadius: '8px', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#f8f9fa', padding: '16px', borderBottom: '1px solid #e1e5e9' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>
          Variable Reference
        </h3>
        <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
          All available variables for use in email templates, headers, and footers
        </p>
      </div>

      {/* Search */}
      <div style={{ padding: '16px', borderBottom: '1px solid #e1e5e9' }}>
        <input
          type="text"
          placeholder="Search variables..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e1e5e9' }}>
        <button
          onClick={() => setActiveTab('system')}
          style={{
            flex: 1,
            padding: '12px',
            border: 'none',
            backgroundColor: activeTab === 'system' ? 'white' : '#f8f9fa',
            borderBottom: activeTab === 'system' ? '2px solid #1565c0' : 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: activeTab === 'system' ? '600' : '400'
          }}
        >
          System Variables ({SYSTEM_VARIABLES.length})
        </button>
        <button
          onClick={() => setActiveTab('global')}
          style={{
            flex: 1,
            padding: '12px',
            border: 'none',
            backgroundColor: activeTab === 'global' ? 'white' : '#f8f9fa',
            borderBottom: activeTab === 'global' ? '2px solid #7b1fa2' : 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: activeTab === 'global' ? '600' : '400'
          }}
        >
          Global Variables ({globalVariables.length})
        </button>
        {showTemplateVariables && (
          <button
            onClick={() => setActiveTab('template')}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              backgroundColor: activeTab === 'template' ? 'white' : '#f8f9fa',
              borderBottom: activeTab === 'template' ? '2px solid #ef6c00' : 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: activeTab === 'template' ? '600' : '400'
            }}
          >
            Template Variables ({templateVariables.length})
          </button>
        )}
      </div>

      {/* Content */}
      <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '16px' }}>
        {activeTab === 'system' && (
          <div>
            {Object.entries(systemVariablesByCategory).map(([category, variables]) => {
              const filteredVariables = filterVariables(variables, searchTerm)
              if (filteredVariables.length === 0) return null
              
              return (
                <div key={category} style={{ marginBottom: '24px' }}>
                  <h4 style={{ 
                    margin: '0 0 12px 0', 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    textTransform: 'capitalize',
                    color: '#1565c0',
                    borderBottom: '1px solid #e3f2fd',
                    paddingBottom: '4px'
                  }}>
                    {category} Variables
                  </h4>
                  {filteredVariables.map(variable => (
                    <VariableCard key={variable.name} variable={variable} type="system" />
                  ))}
                </div>
              )
            })}
          </div>
        )}

        {activeTab === 'global' && (
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                Loading global variables...
              </div>
            ) : Object.keys(globalVariablesByCategory).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                No global variables defined yet. Create some in the Global Variables collection.
              </div>
            ) : (
              Object.entries(globalVariablesByCategory).map(([category, variables]) => {
                const filteredVariables = filterVariables(variables, searchTerm)
                if (filteredVariables.length === 0) return null
                
                return (
                  <div key={category} style={{ marginBottom: '24px' }}>
                    <h4 style={{ 
                      margin: '0 0 12px 0', 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      textTransform: 'capitalize',
                      color: '#7b1fa2',
                      borderBottom: '1px solid #f3e5f5',
                      paddingBottom: '4px'
                    }}>
                      {category} Variables
                    </h4>
                    {filteredVariables.map(variable => (
                      <VariableCard key={variable.id} variable={variable} type="global" />
                    ))}
                  </div>
                )
              })
            )}
          </div>
        )}

        {activeTab === 'template' && showTemplateVariables && (
          <div>
            {templateVariables.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                No template-specific variables defined for this template.
              </div>
            ) : (
              <div>
                <h4 style={{ 
                  margin: '0 0 12px 0', 
                  fontSize: '14px', 
                  fontWeight: '600',
                  color: '#ef6c00',
                  borderBottom: '1px solid #fff3e0',
                  paddingBottom: '4px'
                }}>
                  Template-Specific Variables
                </h4>
                {filterVariables(templateVariables, searchTerm).map((variable, index) => (
                  <VariableCard key={index} variable={variable} type="template" />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default VariableReference
