import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    if (!data?.email || !data?.name) return NextResponse.json({ ok:false }, { status: 400 })

    const key = process.env.SENDGRID_API_KEY
    const to  = process.env.QUOTE_TO || 'admin@example.com'

    if (key) {
      const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: 'no-reply@pgagates.com', name: 'Precision Gates Form' },
          subject: 'New Quote Request',
          content: [{ type: 'text/plain', value: JSON.stringify(data, null, 2) }]
        })
      })
      if (!res.ok) return NextResponse.json({ ok:false }, { status: 500 })
    } else {
      console.log('Quote request (no SENDGRID_API_KEY set):', data)
    }
    return NextResponse.json({ ok:true })
  } catch {
    return NextResponse.json({ ok:false }, { status: 500 })
  }
}
