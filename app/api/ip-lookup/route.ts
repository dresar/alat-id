import { NextRequest, NextResponse } from 'next/server'
import geoip from 'geoip-lite'
import dns from 'dns'
import { promisify } from 'util'

const lookup = promisify(dns.lookup)
const reverse = promisify(dns.reverse)

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const input = searchParams.get('input')

    if (!input) {
      return NextResponse.json({ error: 'Input is required' }, { status: 400 })
    }

    let ip = input

    // If input is a domain, resolve it to IP
    if (!/^\d+\.\d+\.\d+\.\d+$/.test(input)) {
      try {
        const resolved = await lookup(input)
        ip = resolved.address
      } catch {
        return NextResponse.json(
          { error: 'Invalid domain or IP address' },
          { status: 400 }
        )
      }
    }

    // Get geo information
    const geo = geoip.lookup(ip)

    // Get reverse DNS
    let reverseDns = null
    try {
      const reverseRecords = await reverse(ip)
      reverseDns = reverseRecords[0] || null
    } catch {}

    const result: any = {
      ip,
    }

    if (geo) {
      result.country = geo.country || null
      result.city = geo.city || null
      result.region = geo.region || null
      result.timezone = geo.timezone || null
      result.coordinates = geo.ll || null
    }

    if (reverseDns) {
      result.reverse = reverseDns
    }

    // Try to get ISP/ASN info (basic)
    if (geo && (geo as any).asn) {
      result.isp = (geo as any).asn
    }

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('IP lookup error:', error)
    return NextResponse.json(
      { error: error.message || 'IP lookup failed' },
      { status: 500 }
    )
  }
}

