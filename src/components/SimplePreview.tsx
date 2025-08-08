'use client'

import React from 'react'
import type { UIFieldClientProps } from 'payload'

const SimplePreview: React.FC<UIFieldClientProps> = () => {
  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', margin: '10px 0' }}>
      <h3>Email Layout Preview</h3>
      <p>Configure your email layout to see the live preview here.</p>
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '20px', 
        borderRadius: '4px',
        textAlign: 'center',
        color: '#666'
      }}>
        Preview will appear here when you configure the layout settings.
      </div>
    </div>
  )
}

export default SimplePreview