import { type NextRequest, NextResponse } from "next/server"

interface InvitationRequest {
  teamId: string
  teamName: string
  inviterName: string
  inviterEmail: string
  memberEmail: string
  message?: string
}

// Simulate email sending (in a real app, you'd use a service like SendGrid, Resend, etc.)
async function sendInvitationEmail(invitation: InvitationRequest) {
  // Simulate email sending delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // In a real app, you would send an actual email here
  console.log("Sending invitation email:", {
    to: invitation.memberEmail,
    subject: `Convite para participar da equipe ${invitation.teamName}`,
    teamName: invitation.teamName,
    inviterName: invitation.inviterName,
  })

  return {
    success: true,
    messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: InvitationRequest = await request.json()

    // Validate required fields
    if (!body.teamId || !body.teamName || !body.inviterName || !body.memberEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.memberEmail)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Send the invitation email
    const emailResult = await sendInvitationEmail(body)

    if (!emailResult.success) {
      return NextResponse.json({ error: "Failed to send invitation email" }, { status: 500 })
    }

    // In a real app, you would save the invitation to a database
    const invitation = {
      id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      teamId: body.teamId,
      teamName: body.teamName,
      inviterName: body.inviterName,
      inviterEmail: body.inviterEmail,
      memberEmail: body.memberEmail,
      message: body.message,
      status: "pending",
      sentAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      emailMessageId: emailResult.messageId,
    }

    return NextResponse.json({
      success: true,
      invitation,
    })
  } catch (error) {
    console.error("Error sending invitation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
