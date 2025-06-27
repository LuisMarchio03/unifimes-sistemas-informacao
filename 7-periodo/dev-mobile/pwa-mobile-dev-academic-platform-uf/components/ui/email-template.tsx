interface EmailTemplateProps {
  teamName: string
  teamDescription?: string
  inviterName: string
  inviterEmail: string
  invitationLink: string
  message?: string
}

export function TeamInvitationEmailTemplate({
  teamName,
  teamDescription,
  inviterName,
  inviterEmail,
  invitationLink,
  message,
}: EmailTemplateProps) {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        backgroundColor: "#000000",
        color: "#ffffff",
        padding: "20px",
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "30px",
          padding: "20px",
          background: "linear-gradient(to right, #ef4444, #f97316)",
          borderRadius: "12px",
        }}
      >
        <h1 style={{ margin: "0", fontSize: "24px", fontWeight: "bold" }}>Convite para Equipe</h1>
        <p style={{ margin: "10px 0 0 0", opacity: "0.9" }}>Plataforma Acadêmica UNIFIMES</p>
      </div>

      {/* Content */}
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#ef4444", marginBottom: "15px" }}>
          Você foi convidado para participar da equipe "{teamName}"
        </h2>

        <p style={{ lineHeight: "1.6", marginBottom: "15px" }}>
          Olá! <strong>{inviterName}</strong> ({inviterEmail}) convidou você para participar da equipe{" "}
          <strong>{teamName}</strong> na Plataforma Acadêmica.
        </p>

        {teamDescription && (
          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "15px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <h3 style={{ margin: "0 0 10px 0", fontSize: "16px" }}>Sobre a equipe:</h3>
            <p style={{ margin: "0", lineHeight: "1.5" }}>{teamDescription}</p>
          </div>
        )}

        {message && (
          <div
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "15px",
              border: "1px solid rgba(239, 68, 68, 0.2)",
            }}
          >
            <h3 style={{ margin: "0 0 10px 0", fontSize: "16px", color: "#ef4444" }}>Mensagem pessoal:</h3>
            <p style={{ margin: "0", lineHeight: "1.5" }}>{message}</p>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <a
          href={invitationLink}
          style={{
            display: "inline-block",
            padding: "15px 30px",
            background: "linear-gradient(to right, #ef4444, #f97316)",
            color: "#ffffff",
            textDecoration: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          Aceitar Convite
        </a>
      </div>

      {/* Footer */}
      <div
        style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          paddingTop: "20px",
          textAlign: "center",
          fontSize: "14px",
          color: "rgba(255, 255, 255, 0.6)",
        }}
      >
        <p style={{ margin: "0 0 10px 0" }}>
          Este convite expira em 7 dias. Se você não deseja participar desta equipe, pode ignorar este email.
        </p>
        <p style={{ margin: "0" }}>© 2023 Plataforma Acadêmica UNIFIMES. Todos os direitos reservados.</p>
      </div>
    </div>
  )
}
