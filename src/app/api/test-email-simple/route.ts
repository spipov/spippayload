import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import emailService from '@/lib/emailService'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    emailService.setPayload(payload)

    const result = await emailService.sendSimpleTestEmail()

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error || result.message
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error in test-email-simple API:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
}