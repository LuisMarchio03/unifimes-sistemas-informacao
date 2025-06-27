import type { TextOperation } from "./types"

export class OperationalTransform {
  /**
   * Transform operation against another operation
   * This is a simplified OT implementation
   */
  static transform(op1: TextOperation, op2: TextOperation): TextOperation {
    // If operations are at different positions, no transformation needed
    if (op1.position !== op2.position) {
      if (op1.position < op2.position) {
        return this.transformAgainstEarlier(op2, op1)
      } else {
        return this.transformAgainstLater(op2, op1)
      }
    }

    // Handle concurrent operations at same position
    return this.transformConcurrent(op1, op2)
  }

  private static transformAgainstEarlier(op: TextOperation, earlierOp: TextOperation): TextOperation {
    if (earlierOp.type === "insert") {
      return {
        ...op,
        position: op.position + (earlierOp.content?.length || 0),
      }
    } else if (earlierOp.type === "delete") {
      return {
        ...op,
        position: Math.max(0, op.position - (earlierOp.length || 0)),
      }
    }
    return op
  }

  private static transformAgainstLater(op: TextOperation, laterOp: TextOperation): TextOperation {
    // No transformation needed if later operation is after current position
    return op
  }

  private static transformConcurrent(op1: TextOperation, op2: TextOperation): TextOperation {
    // For concurrent operations at same position, prioritize by user ID
    if (op1.userId < op2.userId) {
      return op1
    } else {
      if (op2.type === "insert") {
        return {
          ...op1,
          position: op1.position + (op2.content?.length || 0),
        }
      }
    }
    return op1
  }

  /**
   * Apply operation to text content
   */
  static applyOperation(content: string, operation: TextOperation): string {
    switch (operation.type) {
      case "insert":
        return content.slice(0, operation.position) + (operation.content || "") + content.slice(operation.position)
      case "delete":
        return content.slice(0, operation.position) + content.slice(operation.position + (operation.length || 0))
      case "retain":
        return content
      default:
        return content
    }
  }

  /**
   * Transform cursor position based on operation
   */
  static transformCursor(cursorPosition: number, operation: TextOperation): number {
    if (operation.position <= cursorPosition) {
      if (operation.type === "insert") {
        return cursorPosition + (operation.content?.length || 0)
      } else if (operation.type === "delete") {
        return Math.max(operation.position, cursorPosition - (operation.length || 0))
      }
    }
    return cursorPosition
  }
}
