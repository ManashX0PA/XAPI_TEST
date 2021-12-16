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

export const PersonMobileSchema = {
  type: "object",
  properties: {
    personMobId: { type: "string" },
    profileId: { type: "string" },
    codeId: { type: "number" },
    mobile: { type: "string" },
    createTimestamp: { type: "string" },
    updatedAt: { type: "string" },
    isPrimary: { type: "boolean" },
  },
  required: ["personMobId", "profileId", "mobile"],
  additionalProperties: true,
}

export const ProfileMetaSchema = {
  type: "object",
  properties: {
    profileMetaId: { type: "string" },
    profileId: { type: "string" },
    profileMeta: { type: "string" },
    createdAt: { type: "string" },
    updatedAt: { type: "string" },
    metaKey: { type: "string" },
    metaValue: { type: "string" },
    displayKey: { type: "string" },
  },
  required: ["profileMetaId", "profileId", "profileMeta", "displayKey", "metaKey", "metaValue"],
  additionalProperties: true,
}