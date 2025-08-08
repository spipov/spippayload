'use client'

import React, { useState, useEffect } from 'react'
import { useField } from '@payloadcms/ui'
import type { GroupFieldClientProps } from 'payload/types'

interface ColorPaletteFieldProps extends GroupFieldClientProps {
  path: string
}

export const ColorPaletteField: React.FC<ColorPaletteFieldProps> = (props) => {
  const { path } = props
  const primaryField = useField({ path: `${path}.primary` })
  const secondaryField = useField({ path: `${path}.secondary` })
  const accentField = useField({ path: `${path}.accent` })
  const backgroundField = useField({ path: `${path}.background` })
  const textField = useField({ path: `${path}.text` })
  const textLightField = useField({ path: `${path}.textLight` })

  const [showPreview, setShowPreview] = useState(false)

  const colors = {
    primary: primaryField.value || '#007bff',
    secondary: secondaryField.value || '#6c757d',
    accent: accentField.value || '#28a745',
    background: backgroundField.value || '#ffffff',
    text: textField.value || '#333333',
    textLight: textLightField.value || '#666666',
  }

  // Color harmony suggestions
  const generateColorHarmony = (baseColor: string) => {
    // Simple color harmony generator (this could be more sophisticated)
    const hex = baseColor.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    
    // Generate complementary color
    const compR = 255 - r
    const compG = 255 - g
    const compB = 255 - b
    
    // Generate analogous colors
    const analog1R = Math.min(255, r + 30)
    const analog1G = Math.max(0, g - 30)
    const analog1B = b
    
    const analog2R = Math.max(0, r - 30)
    const analog2G = Math.min(255, g + 30)
    const analog2B = b
    
    return {
      complementary: `#${compR.toString(16).padStart(2, '0')}${compG.toString(16).padStart(2, '0')}${compB.toString(16).padStart(2, '0')}`,
      analogous1: `#${analog1R.toString(16).padStart(2, '0')}${analog1G.toString(16).padStart(2, '0')}${analog1B.toString(16).padStart(2, '0')}`,
      analogous2: `#${analog2R.toString(16).padStart(2, '0')}${analog2G.toString(16).padStart(2, '0')}${analog2B.toString(16).padStart(2, '0')}`,
    }
  }

  const applyColorScheme = (scheme: 'modern' | 'warm' | 'cool' | 'monochrome') => {
    const schemes = {
      modern: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        accent: '#06b6d4',
        background: '#ffffff',
        text: '#1f2937',
        textLight: '#6b7280',
      },
      warm: {
        primary: '#f59e0b',
        secondary: '#ef4444',
        accent: '#10b981',
        background: '#fefbf3',
        text: '#451a03',
        textLight: '#92400e',
      },
      cool: {
        primary: '#3b82f6',
        secondary: '#1e40af',
        accent: '#06b6d4',
        background: '#f8fafc',
        text: '#0f172a',
        textLight: '#475569',
      },
      monochrome: {
        primary: '#374151',
        secondary: '#6b7280',
        accent: '#9ca3af',
        background: '#ffffff',
        text: '#111827',
        textLight: '#6b7280',
      },
    }

    const selectedScheme = schemes[scheme]
    Object.entries(selectedScheme).forEach(([colorKey, colorValue]) => {
      switch (colorKey) {
        case 'primary':
          primaryField.setValue(colorValue)
          break
        case 'secondary':
          secondaryField.setValue(colorValue)
          break
        case 'accent':
          accentField.setValue(colorValue)
          break
        case 'background':
          backgroundField.setValue(colorValue)
          break
        case 'text':
          textField.setValue(colorValue)
          break
        case 'textLight':
          textLightField.setValue(colorValue)
          break
      }
    })
  }

  return (
    <div className="color-palette-field">
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Color Palette</h4>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            style={{
              padding: '6px 12px',
              backgroundColor: colors.primary,
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>

        {/* Quick Color Schemes */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
            Quick Schemes:
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { name: 'Modern', scheme: 'modern' as const },
              { name: 'Warm', scheme: 'warm' as const },
              { name: 'Cool', scheme: 'cool' as const },
              { name: 'Monochrome', scheme: 'monochrome' as const },
            ].map(({ name, scheme }) => (
              <button
                key={scheme}
                type="button"
                onClick={() => applyColorScheme(scheme)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f5f5f5'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white'
                }}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Color Overview */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
          gap: '12px',
          marginBottom: '16px'
        }}>
          {Object.entries(colors).map(([key, value]) => (
            <div key={key} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '100%',
                  height: '60px',
                  backgroundColor: value,
                  borderRadius: '8px',
                  border: '1px solid #e1e5e9',
                  marginBottom: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: key.includes('text') ? value : (key === 'background' ? colors.text : 'white'),
                  fontSize: '12px',
                  fontWeight: 'bold',
                  textShadow: key === 'background' ? 'none' : '0 1px 2px rgba(0,0,0,0.3)',
                }}
              >
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
              </div>
              <div style={{ fontSize: '11px', color: '#666', fontFamily: 'monospace' }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Live Preview */}
        {showPreview && (
          <div style={{ 
            border: '1px solid #e1e5e9', 
            borderRadius: '8px', 
            overflow: 'hidden',
            marginBottom: '16px'
          }}>
            <div style={{ 
              padding: '12px', 
              backgroundColor: '#f8f9fa', 
              borderBottom: '1px solid #e1e5e9',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              Live Preview
            </div>
            
            {/* Email Preview */}
            <div style={{ 
              backgroundColor: colors.background,
              padding: '20px',
              fontFamily: 'Arial, sans-serif'
            }}>
              {/* Header */}
              <div style={{
                backgroundColor: colors.primary,
                color: 'white',
                padding: '20px',
                textAlign: 'center',
                marginBottom: '20px',
                borderRadius: '8px'
              }}>
                <h2 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>Your App Name</h2>
                <p style={{ margin: 0, opacity: 0.9 }}>Welcome to our platform</p>
              </div>
              
              {/* Content */}
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: colors.text, margin: '0 0 12px 0' }}>Hello John Doe,</h3>
                <p style={{ color: colors.text, lineHeight: 1.6, margin: '0 0 16px 0' }}>
                  Thank you for joining our platform. We're excited to have you on board!
                </p>
                <p style={{ color: colors.textLight, lineHeight: 1.6, margin: '0 0 20px 0' }}>
                  This is how your secondary text will look in emails and other content.
                </p>
                
                {/* Button */}
                <div style={{ textAlign: 'center', margin: '20px 0' }}>
                  <a href="#" style={{
                    display: 'inline-block',
                    backgroundColor: colors.accent,
                    color: 'white',
                    padding: '12px 24px',
                    textDecoration: 'none',
                    borderRadius: '6px',
                    fontWeight: 'bold'
                  }}>
                    Get Started
                  </a>
                </div>
              </div>
              
              {/* Footer */}
              <div style={{
                borderTop: `1px solid ${colors.secondary}`,
                paddingTop: '16px',
                textAlign: 'center',
                color: colors.textLight,
                fontSize: '14px'
              }}>
                <p style={{ margin: '0 0 8px 0' }}>Follow us on social media</p>
                <div style={{ marginBottom: '12px' }}>
                  <a href="#" style={{ color: colors.primary, margin: '0 8px' }}>Facebook</a>
                  <a href="#" style={{ color: colors.primary, margin: '0 8px' }}>Twitter</a>
                  <a href="#" style={{ color: colors.primary, margin: '0 8px' }}>Instagram</a>
                </div>
                <p style={{ margin: 0, fontSize: '12px' }}>
                  © 2024 Your App Name. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Accessibility Check */}
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '12px', 
          borderRadius: '6px',
          fontSize: '12px'
        }}>
          <div style={{ fontWeight: '600', marginBottom: '8px' }}>Accessibility Check:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {[
              { bg: colors.primary, text: 'white', label: 'Primary/White' },
              { bg: colors.background, text: colors.text, label: 'Background/Text' },
              { bg: colors.background, text: colors.textLight, label: 'Background/Light Text' },
            ].map(({ bg, text, label }) => {
              // Simple contrast ratio calculation (simplified)
              const getLuminance = (hex: string) => {
                const rgb = parseInt(hex.slice(1), 16)
                const r = (rgb >> 16) & 0xff
                const g = (rgb >> 8) & 0xff
                const b = (rgb >> 0) & 0xff
                return (0.299 * r + 0.587 * g + 0.114 * b) / 255
              }
              
              const bgLum = getLuminance(bg)
              const textLum = getLuminance(text)
              const contrast = (Math.max(bgLum, textLum) + 0.05) / (Math.min(bgLum, textLum) + 0.05)
              const isGood = contrast >= 4.5
              
              return (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: bg,
                    color: text,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    borderRadius: '2px',
                    border: '1px solid #ddd'
                  }}>
                    Aa
                  </div>
                  <span style={{ color: isGood ? '#28a745' : '#dc3545' }}>
                    {label}: {contrast.toFixed(1)}:1 {isGood ? '✓' : '✗'}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ColorPaletteField