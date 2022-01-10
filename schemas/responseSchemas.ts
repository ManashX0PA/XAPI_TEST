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
    countryShort: { type: "string" },
    countryName: { type: "string" },
    countryCode: { type: "string" },
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

export const XapiDynamicResponseSchema = {
  type: "object",
  properties: {
    headers: {
      type: "array",
      items: {
        type: "object",
        properties: {
          key: { type: "string" },
          header: { type: "string" },
        }
      }
    },
    rows: { type: "array" },
  },
  required: ["headers", "rows"],
  additionalProperties: false,
}

export const ContactNoteSchema = {
  type: "object",
  properties: {
    noteId: { type: "string" },
    noteUuid: { type: "string" },
    companyId: { type: "string" },
    contactId: { type: "string" },
    notesData: { type: "string" },
    contactNoteType: { type: ["string", "null"] },
    createdBy: { type: "string" },
    modifiedBy: { type: "string" },
    isDeleted: { type: "boolean" },
    isPrivate: { type: "boolean" },
    createdAt: { type: "string" },
    updatedAt: { type: "string" },
    deletedAt: { type: ["string", "null"] },
  },
  required: ["noteId", "noteUuid", "companyId", "contactId", "notesData"],
  additionalProperties: true,
}

export const ContactNoteLogSchema = {
  type: "object",
  properties: {
    logId: { type: "string" },
    contactId: { type: "string" },
    performedById: { type: "string" },
    performedByCompanyId: { type: "string" },
    actionType: { type: "string" },
    logText: { type: "string" },
    logDescription: { type: "string" },
    createdAt: { type: "string" },
  },
  required: ["logId", "contactId", "performedById", "performedByCompanyId", "actionType", "logText", "logDescription", "createdAt"],
  additionalProperties: true,
}
