import { NextRequest, NextResponse } from 'next/server'
import dns from 'dns'
import { promisify } from 'util'

const resolve4 = promisify(dns.resolve4)
const resolve6 = promisify(dns.resolve6)
const resolveMx = promisify(dns.resolveMx)
const resolveTxt = promisify(dns.resolveTxt)
const resolveCname = promisify(dns.resolveCname)
const resolveNs = promisify(dns.resolveNs)
const resolveSoa = promisify(dns.resolveSoa)
const reverse = promisify(dns.reverse)

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const domain = searchParams.get('domain')

    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 })
    }

    const records: Array<{ type: string; value: string; ttl?: number }> = []

    // A Records
    try {
      const aRecords = await resolve4(domain)
      aRecords.forEach((ip) => {
        records.push({ type: 'A', value: ip })
      })
    } catch {}

    // AAAA Records
    try {
      const aaaaRecords = await resolve6(domain)
      aaaaRecords.forEach((ip) => {
        records.push({ type: 'AAAA', value: ip })
      })
    } catch {}

    // MX Records
    try {
      const mxRecords = await resolveMx(domain)
      mxRecords.forEach((mx) => {
        records.push({ type: 'MX', value: `${mx.priority} ${mx.exchange}` })
      })
    } catch {}

    // TXT Records
    try {
      const txtRecords = await resolveTxt(domain)
      txtRecords.forEach((txt) => {
        records.push({ type: 'TXT', value: txt.join(' ') })
      })
    } catch {}

    // CNAME Records
    try {
      const cnameRecords = await resolveCname(domain)
      cnameRecords.forEach((cname) => {
        records.push({ type: 'CNAME', value: cname })
      })
    } catch {}

    // NS Records
    try {
      const nsRecords = await resolveNs(domain)
      nsRecords.forEach((ns) => {
        records.push({ type: 'NS', value: ns })
      })
    } catch {}

    // SOA Records
    try {
      const soaRecord = await resolveSoa(domain)
      records.push({
        type: 'SOA',
        value: `${soaRecord.nsname} ${soaRecord.hostmaster} ${soaRecord.serial} ${soaRecord.refresh} ${soaRecord.retry} ${soaRecord.expire} ${soaRecord.minttl}`,
      })
    } catch {}

    // PTR Records (reverse DNS)
    try {
      const ptrRecords = await reverse(domain)
      ptrRecords.forEach((ptr) => {
        records.push({ type: 'PTR', value: ptr })
      })
    } catch {}

    if (records.length === 0) {
      return NextResponse.json(
        { error: 'No DNS records found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ records })
  } catch (error: any) {
    console.error('DNS lookup error:', error)
    return NextResponse.json(
      { error: error.message || 'DNS lookup failed' },
      { status: 500 }
    )
  }
}

