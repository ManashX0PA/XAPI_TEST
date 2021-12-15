export const ErrorSchema = {
  type: "object",
  properties: {
    error: { type: "boolean" },
    message: { type: "string" },
  },
  required: ["error", "message",],
  additionalProperties: false,
}

export const NotLoggedInSchema = {
  type: "object",
  properties: {
    d: { type: "string" },
  },
  required: ["d",],
  additionalProperties: false,
}


export const CallTemplateSchema = {
  type: "object",
  properties: {
    calltemplateId: { type: "string" },
    templateName: { type: "string" },
    desc: { type: "string" },
    templateBody: { type: "string" },
    companyId: { type: "string" },
    createdBy: { type: "string" },
    modifiedBy: { type: "string" },
    createdAt: { type: "string" },
    updatedAt: { type: "string" },
  },
  required: ["calltemplateId", "templateName"],
  additionalProperties: true,
}