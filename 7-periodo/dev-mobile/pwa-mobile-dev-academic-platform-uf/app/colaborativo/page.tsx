"use client"

// Replace the CollaborativeDocumentList with the new editor with comments
import { CollaborativeEditorWithComments } from "@/components/collaborative/collaborative-editor-with-comments"

export default function CollaborativePage() {
  return (
    <div className="h-screen">
      <CollaborativeEditorWithComments
        documentId="demo-document"
        userId="current_user"
        userName="Current User"
        className="h-full"
      />
    </div>
  )
}
