'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useFormFields } from '@payloadcms/ui'

const FontPreview: React.FC = () => {
  const [previewText, setPreviewText] = useState('The quick brown fox jumps over the lazy dog')
  const [previewSize, setPreviewSize] = useState(16)

  // Get form field values directly without causing re-renders
  const fields = useFormFields(([fields]) => ({
    fontFamily: fields.fontFamily,
    webSafeFallbacks: fields.webSafeFallbacks,
    fontWeights: fields.fontWeights,
    emailSettings: fields.emailSettings,
    fontFiles: fields.fontFiles,
  }))

  // Directly compute font data without state - prevents infinite loops
  const fontData = useMemo(() => {
    if (fields && typeof fields === 'object') {
      return {
        fontFamily: fields.fontFamily?.value || 'Arial, sans-serif',
        webSafeFallbacks: fields.webSafeFallbacks?.value || 'Arial, sans-serif',
        fontWeights: fields.fontWeights?.value || [],
        emailSettings: fields.emailSettings?.value || {},
        fontFiles: fields.fontFiles?.value || {},
      }
    }
    return {
      fontFamily: 'Arial, sans-serif',
      webSafeFallbacks: 'Arial, sans-serif',
      fontWeights: [],
      emailSettings: {},
      fontFiles: {},
    }
  }, [fields])

  const generateFontFace = () => {
    if (!fontData.fontFiles) return ''
    
    const fontName = fontData.fontFamily?.split(',')[0]?.trim() || 'CustomFont'
    let fontFaceCSS = ''

    if (fontData.fontFiles.woff2 || fontData.fontFiles.woff || fontData.fontFiles.ttf) {
      fontFaceCSS = `
        @font-face {
          font-family: '${fontName}';
          src: ${[
            fontData.fontFiles.woff2 && `url('${fontData.fontFiles.woff2.url}') format('woff2')`,
            fontData.fontFiles.woff && `url('${fontData.fontFiles.woff.url}') format('woff')`,
            fontData.fontFiles.ttf && `url('${fontData.fontFiles.ttf.url}') format('truetype')`
          ].filter(Boolean).join(', ')};
          font-display: swap;
        }
      `
    }

    return fontFaceCSS
  }

  const getFontStack = () => {
    const customFont = fontData.fontFamily?.split(',')[0]?.trim()
    const fallbacks = fontData.webSafeFallbacks || 'Arial, sans-serif'
    return customFont ? `${customFont}, ${fallbacks}` : fallbacks
  }

  const emailLineHeight = fontData.emailSettings?.lineHeight || 1.4
  const emailLetterSpacing = fontData.emailSettings?.letterSpacing || 0

  return (
    <div style={{ 
      border: '1px solid #e1e5e9', 
      borderRadius: '8px', 
      overflow: 'hidden',
      backgroundColor: 'white'
    }}>
      {/* Font Face CSS */}
      <style dangerouslySetInnerHTML={{ __html: generateFontFace() }} />
      
      {/* Header */}
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '12px 16px', 
        borderBottom: '1px solid #e1e5e9',
        fontSize: '14px',
        fontWeight: '600'
      }}>
        Font Preview
      </div>

      {/* Controls */}
      <div style={{ 
        padding: '16px', 
        borderBottom: '1px solid #e1e5e9',
        backgroundColor: '#fafafa'
      }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', marginBottom: '4px', display: 'block' }}>
              Preview Text:
            </label>
            <input
              type="text"
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              style={{
                padding: '6px 8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '12px',
                width: '300px'
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', marginBottom: '4px', display: 'block' }}>
              Size:
            </label>
            <input
              type="range"
              min="12"
              max="48"
              value={previewSize}
              onChange={(e) => setPreviewSize(Number(e.target.value))}
              style={{ width: '100px' }}
            />
            <span style={{ fontSize: '12px', marginLeft: '8px' }}>{previewSize}px</span>
          </div>
        </div>
      </div>

      {/* Font Information */}
      <div style={{ padding: '16px', borderBottom: '1px solid #e1e5e9', backgroundColor: '#f9f9f9' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '12px' }}>
          <div>
            <strong>Font Stack:</strong>
            <div style={{ fontFamily: 'monospace', marginTop: '4px', color: '#666' }}>
              {getFontStack()}
            </div>
          </div>
          <div>
            <strong>Email Settings:</strong>
            <div style={{ marginTop: '4px', color: '#666' }}>
              Line Height: {emailLineHeight}<br/>
              Letter Spacing: {emailLetterSpacing}px
            </div>
          </div>
          <div>
            <strong>Available Weights:</strong>
            <div style={{ marginTop: '4px', color: '#666' }}>
              {fontData.fontWeights?.length > 0 
                ? fontData.fontWeights.map((w: any) => `${w.weight} (${w.name})`).join(', ')
                : 'No weights defined'
              }
            </div>
          </div>
        </div>
      </div>

      {/* Preview Samples */}
      <div style={{ padding: '16px' }}>
        {/* Main Preview */}
        <div style={{
          fontFamily: getFontStack(),
          fontSize: `${previewSize}px`,
          lineHeight: emailLineHeight,
          letterSpacing: `${emailLetterSpacing}px`,
          marginBottom: '24px',
          padding: '16px',
          backgroundColor: '#fff',
          border: '1px solid #eee',
          borderRadius: '4px'
        }}>
          {previewText}
        </div>

        {/* Weight Samples */}
        {fontData.fontWeights?.length > 0 && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
              Font Weight Samples:
            </h4>
            <div style={{ display: 'grid', gap: '8px' }}>
              {fontData.fontWeights.map((weight: any, index: number) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '4px'
                }}>
                  <div style={{ 
                    fontSize: '12px', 
                    fontWeight: '600', 
                    minWidth: '80px',
                    color: weight.isDefault ? '#1565c0' : '#666'
                  }}>
                    {weight.weight} {weight.name}
                    {weight.isDefault && ' (Default)'}
                  </div>
                  <div style={{
                    fontFamily: getFontStack(),
                    fontWeight: weight.weight,
                    fontSize: '16px',
                    lineHeight: emailLineHeight,
                    letterSpacing: `${emailLetterSpacing}px`,
                  }}>
                    The quick brown fox jumps over the lazy dog
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Email Client Preview */}
        <div style={{ marginTop: '24px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
            Email Client Preview:
          </h4>
          <div style={{
            padding: '16px',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            border: '1px solid #ddd'
          }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
              How it will look in email clients (with fallback fonts):
            </div>
            <div style={{
              fontFamily: fontData.emailSettings?.emailFallback || fontData.webSafeFallbacks || 'Arial, sans-serif',
              fontSize: '16px',
              lineHeight: emailLineHeight,
              letterSpacing: `${emailLetterSpacing}px`,
              padding: '12px',
              backgroundColor: 'white',
              borderRadius: '4px'
            }}>
              {previewText}
            </div>
          </div>
        </div>

        {/* CSS Output */}
        <div style={{ marginTop: '24px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
            Generated CSS:
          </h4>
          <pre style={{
            backgroundColor: '#f8f9fa',
            padding: '12px',
            borderRadius: '4px',
            fontSize: '11px',
            fontFamily: 'monospace',
            overflow: 'auto',
            border: '1px solid #e1e5e9'
          }}>
{`font-family: ${getFontStack()};
line-height: ${emailLineHeight};
letter-spacing: ${emailLetterSpacing}px;${generateFontFace()}`}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default FontPreview
