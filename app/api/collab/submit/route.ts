import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { name, email, spark, sonic_blueprint, head_start, goal, value } = body

    if (!name || !email || !spark || !sonic_blueprint || !goal) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from("submissions")
      .insert({
        name,
        email,
        spark,
        sonic_blueprint,
        head_start: head_start || null,
        goal,
        value: value || null,
      })

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json(
        { error: "Failed to submit form" },
        { status: 500 }
      )
    }

    // Send thank you email — non-fatal if it fails
    try {
      if (!process.env.RESEND_API_KEY) {
        throw new Error("RESEND_API_KEY is not set")
      }
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: "Rising J <noreply@risingj.com>",
        to: email,
        subject: "Re: Your song idea / Collab with Rising J",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
            <p>Hi ${name},</p>

            <p>Thanks so much for reaching out and sharing a bit of your creative world with me.</p>

            <p>As an artist myself, I know it takes a lot to put an idea out there, so I want to personally confirm that I've received your materials. Whether you sent over a full lyric sheet or just a rough concept, rest assured that <strong>your ideas stay 100% yours</strong>. I won't touch or develop anything without us both sitting down and agreeing on a path forward.</p>

            <h3 style="color: #8d29f9; margin-top: 30px;">What's next?</h3>

            <p>I'm currently in a "feeler" phase for this project, hand-selecting a few collaborations that really click with my style and where I know I can add the most value.</p>

            <p>I'm going to spend some time with what you sent over. If I feel like we'd be a great match to build something special together, I'll reach out to schedule a quick chat to talk through the vision, the 50/50 publishing split, and a fair price for the session.</p>

            <p>In the meantime, keep humming that melody and stay creative. I'll be in touch soon!</p>

            <p style="margin-top: 30px;">
              Best,<br/>
              <strong style="font-size: 18px;">Jesse</strong><br/>
              <em>aka Rising J</em>
            </p>

            <p style="margin-top: 20px;">
              <a href="https://risingj.com" style="color: #8d29f9; text-decoration: none;">RisingJ.com</a>
            </p>
          </div>
        `,
      })
    } catch (emailError) {
      console.error("Email error:", emailError)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
