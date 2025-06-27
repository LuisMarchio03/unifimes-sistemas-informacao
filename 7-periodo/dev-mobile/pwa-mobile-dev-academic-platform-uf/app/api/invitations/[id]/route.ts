import { type NextRequest, NextResponse } from "next/server"

interface InvitationResponse {
  action: "accept" | "decline"
  userId?: string
  userName?: string
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const invitationId = params.id
    const body: InvitationResponse = await request.json()

    if (!body.action || !["accept", "decline"].includes(body.action)) {
      return NextResponse.json({ error: 'Invalid action. Must be "accept" or "decline"' }, { status: 400 })
    }

    // In a real app, you would:
    // 1. Find the invitation in the database
    // 2. Validate it's still valid (not expired, not already responded)
    // 3. Update the invitation status
    // 4. If accepted, add the user to the team

    // Simulate database operations
    await new Promise((resolve) => setTimeout(resolve, 500))

    const updatedInvitation = {
      id: invitationId,
      status: body.action === "accept" ? "accepted" : "declined",
      respondedAt: new Date().toISOString(),
      respondedBy: body.userId,
      responderName: body.userName,
    }

    return NextResponse.json({
      success: true,
      invitation: updatedInvitation,
    })
  } catch (error) {
    console.error("Error responding to invitation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const invitationId = params.id

    // In a real app, you would fetch the invitation from the database
    // For now, we'll simulate a response
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Simulate invitation data
    const invitation = {
      id: invitationId,
      teamId: "team_123",
      teamName: "Dev Web Masters",
      teamDescription: "Equipe focada em desenvolvimento web moderno com React e Node.js",
      teamLogo: "DW",
      teamCategory: "desenvolvimento",
      inviterName: "Ana Carolina Silva",
      inviterEmail: "ana.silva@unifimes.edu.br",
      memberEmail: "novo.membro@email.com",
      message: "Gostaríamos de convidá-lo para participar da nossa equipe de desenvolvimento web!",
      status: "pending",
      sentAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    }

    return NextResponse.json({
      success: true,
      invitation,
    })
  } catch (error) {
    console.error("Error fetching invitation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
