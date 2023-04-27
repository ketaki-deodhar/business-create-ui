import { ApprovalTypes, BusinessTypes, CoopTypes, DissolutionTypes, EntityState, FilingTypes,
  RestorationTypes, RelationshipTypes } from '@/enums'
import { CorpTypeCd, CorrectNameOptions } from '@bcrs-shared-components/enums/'
import { AccountInformationIF, AddressIF, BusinessAddressIF, BusinessWarningIF, CertifyIF,
  CompletingPartyIF, ContactPointIF, CourtOrderIF, CreateMemorandumIF, CreateResolutionIF,
  CreateRulesIF, DissolutionStatementIF, FeesIF, RegisteredRecordsAddressesIF,
  IncorporationAgreementIF, NaicsIF, NameRequestIF, NameTranslationIF, OfficeAddressIF,
  OrgInformationIF, OrgPersonIF, PartyIF, ResourceIF, ShareClassIF, StaffPaymentIF, StateIF,
  UploadAffidavitIF, ValidationDetailIF } from '@/interfaces'

// setBusinessId
export const mutateBusinessId = (state: StateIF, businessId: string) => {
  state.stateModel.business.businessId = businessId
}
// setBusinessAddress
export const mutateBusinessAddress = (state: StateIF, address: OfficeAddressIF) => {
  state.stateModel.business.officeAddress = address
}
// setLegalName
export const mutateLegalName = (state: StateIF, legalName: string) => {
  state.stateModel.business.legalName = legalName
}
// setFoundingDate
export const mutateFoundingDate = (state: StateIF, foundingDate: string) => {
  state.stateModel.business.foundingDate = foundingDate
}
// setFilingType
export const mutateFilingType = (state: StateIF, filingType: FilingTypes) => {
  state.stateModel.tombstone.filingType = filingType
}
// setDissolutionType
export const mutateDissolutionType = (state: StateIF, dissolutionType: DissolutionTypes) => {
  state.stateModel.dissolution.dissolutionType = dissolutionType
}
// setTempId
export const mutateTempId = (state: StateIF, tempId: string) => {
  state.stateModel.tempId = tempId
}
// setResources
export const mutateResources = (state: StateIF, resources: ResourceIF): void => {
  state.resourceModel = resources
}
// setAuthRoles
export const mutateAuthRoles = (state: StateIF, authRoles: Array<string>) => {
  state.stateModel.tombstone.authRoles = authRoles
}
// setCooperativeType
export const mutateCooperativeType = (state: StateIF, cooperativeType: CoopTypes) => {
  state.stateModel.defineCompanyStep.cooperativeType = cooperativeType
}
// setUserEmail
export const mutateUserEmail = (state: StateIF, userEmail: string) => {
  state.stateModel.tombstone.userEmail = userEmail
}
// setUserFirstName
export const mutateUserFirstName = (state: StateIF, userFirstName: string) => {
  state.stateModel.tombstone.userFirstName = userFirstName
}
// setUserPhone
export const mutateUserPhone = (state: StateIF, userPhone: string) => {
  state.stateModel.tombstone.userPhone = userPhone
}
// setUserLastName
export const mutateUserLastName = (state: StateIF, userLastName: string) => {
  state.stateModel.tombstone.userLastName = userLastName
}
// setUserKeycloakGuid
export const mutateUserKeycloakGuid = (state: StateIF, userKeycloakGuid: string) => {
  state.stateModel.tombstone.userKeycloakGuid = userKeycloakGuid
}
// setUserAddress
export const mutateUserAddress = (state: StateIF, userAddress: AddressIF) => {
  state.stateModel.tombstone.userAddress = userAddress
}
// setCurrentStep
export const mutateCurrentStep = (state: StateIF, currentStep: number) => {
  state.stateModel.currentStep = currentStep
}
// setIsSaving
export const mutateIsSaving = (state: StateIF, isSaving: boolean) => {
  state.stateModel.isSaving = isSaving
}
// setIsSavingResuming
export const mutateIsSavingResuming = (state: StateIF, isSavingResuming: boolean) => {
  state.stateModel.isSavingResuming = isSavingResuming
}
// setIsFilingPaying
export const mutateIsFilingPaying = (state: StateIF, isFilingPaying: boolean) => {
  state.stateModel.isFilingPaying = isFilingPaying
}
// setCurrentDate
export const mutateCurrentDate = (state: StateIF, currentDate: string) => {
  state.stateModel.currentDate = currentDate
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}
// setCurrentJsDate
export const mutateCurrentJsDate = (state: StateIF, date: Date) => {
  state.stateModel.currentJsDate = date
}
// setIsFutureEffective
export const mutateIsFutureEffective = (state: StateIF, isFutureEffective: boolean) => {
  state.stateModel.effectiveDateTime.isFutureEffective = isFutureEffective
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}
// setEffectiveDate
export const mutateEffectiveDate = (state: StateIF, effectiveDate: Date) => {
  state.stateModel.effectiveDateTime.effectiveDate = effectiveDate
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}
// setEffectiveDateTimeValid
export const mutateEffectiveDateTimeValid = (state: StateIF, effectiveDateTimeValid: boolean) => {
  state.stateModel.effectiveDateTime.valid = effectiveDateTimeValid
}
// setCertifyState
export const mutateCertifyState = (state: StateIF, certifyState: CertifyIF) => {
  state.stateModel.certifyState = certifyState
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}
// setBusinessContact
export const mutateBusinessContact = (state: StateIF, businessContact: ContactPointIF) => {
  state.stateModel.businessContact = businessContact
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}
// setDefineCompanyStepValidity
export const mutateDefineCompanyStepValidity = (state: StateIF, valid: boolean) => {
  state.stateModel.defineCompanyStep.valid = valid
}
// setOfficeAddresses
export const mutateOfficeAddresses = (state: StateIF, addresses: RegisteredRecordsAddressesIF) => {
  state.stateModel.defineCompanyStep.officeAddresses = addresses
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}
// setOrgPersonList
export const mutateOrgPersonList = (state: StateIF, orgPeople: OrgPersonIF[]) => {
  state.stateModel.addPeopleAndRoleStep.orgPeople = orgPeople
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}
// setAddPeopleAndRoleStepValidity
export const mutateAddPeopleAndRoleStepValidity = (state: StateIF, valid: boolean) => {
  state.stateModel.addPeopleAndRoleStep.valid = valid
}
// setFolioNumber
export const mutateFolioNumber = (state: StateIF, folioNumber: string) => {
  state.stateModel.tombstone.folioNumber = folioNumber
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}
// setTransactionalFolioNumber
export const mutateTransactionalFolioNumber = (state: StateIF, folioNumber: string) => {
  state.stateModel.tombstone.transactionalFolioNumber = folioNumber
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}
// setTransactionalFolioNumberValidity
export const mutateTransactionalFolioNumberValidity = (state: StateIF, valid: boolean) => {
  state.stateModel.tombstone.transactionalFolioNumberValid = valid
}
// setAccountInformation
export const mutateAccountInformation = (state: StateIF, accountInfo: AccountInformationIF) => {
  state.stateModel.accountInformation = accountInfo
}
// setOrgInformation
export const mutateOrgInformation = (state: StateIF, orgInfo: OrgInformationIF) => {
  state.stateModel.orgInformation = orgInfo
}
// setNameRequest
export const mutateNameRequest = (state: StateIF, nameRequest: NameRequestIF) => {
  state.stateModel.nameRequest = nameRequest
}
// setNameRequestApprovedName
export const mutateNameRequestApprovedName = (state: StateIF, name: string) => {
  state.stateModel.nameRequestApprovedName = name
}
// setCorrectNameOption
export const mutateCorrectNameOption = (state: StateIF, option: CorrectNameOptions) => {
  state.stateModel.correctNameOption = option
}
// setNameTranslations
export const mutateNameTranslations = (state: StateIF, nameTranslations: NameTranslationIF[]) => {
  state.stateModel.nameTranslations = nameTranslations
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}
// setNameTranslationsValid
export const mutateNameTranslationsValid = (state: StateIF, valid: boolean) => {
  state.stateModel.nameTranslationsValid = valid
}
// setFilingId
export const mutateFilingId = (state: StateIF, filingId: number) => {
  state.stateModel.filingId = filingId
}
// setRules
export const mutateRules = (state: StateIF, rules: CreateRulesIF) => {
  state.stateModel.createRulesStep = rules
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateRulesStepValidity = (state: StateIF, validationDetail: ValidationDetailIF) => {
  state.stateModel.createRulesStep.validationDetail = validationDetail
}
// setRulesStepValidity
export const mutateMemorandum = (state: StateIF, memorandum: CreateMemorandumIF) => {
  state.stateModel.createMemorandumStep = memorandum
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}
// setMemorandumStepValidity
export const mutateMemorandumStepValidity = (state: StateIF, validationDetail: ValidationDetailIF) => {
  state.stateModel.createMemorandumStep.validationDetail = validationDetail
}
// setAffidavit
export const mutateAffidavit = (state: StateIF, affidavit: UploadAffidavitIF) => {
  state.stateModel.uploadAffidavitStep = affidavit
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}
// setAffidavitStepValidity
export const mutateAffidavitStepValidity = (state: StateIF, validationDetail: ValidationDetailIF) => {
  state.stateModel.uploadAffidavitStep.validationDetail = validationDetail
}
// setResolution
export const mutateResolution = (state: StateIF, resolution: CreateResolutionIF) => {
  state.stateModel.createResolutionStep = resolution
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}
// setResolutionStepValidationDetail
export const mutateResolutionStepValidationDetail = (state: StateIF, validationDetail: ValidationDetailIF) => {
  state.stateModel.createResolutionStep.validationDetail = validationDetail
}
// setShareClasses
export const mutateShareClasses = (state: StateIF, shareClasses: ShareClassIF[]) => {
  state.stateModel.createShareStructureStep.shareClasses = shareClasses
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}
// setCreateShareStructureStepValidity
export const mutateCreateShareStructureStepValidity = (state: StateIF, valid: boolean) => {
  state.stateModel.createShareStructureStep.valid = valid
}
// setIncorporationAgreementStepData
export const mutateIncorporationAgreementStepData = (state: StateIF, stepData: IncorporationAgreementIF) => {
  state.stateModel.incorporationAgreementStep = stepData
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}
// setIgnoreChanges
export const mutateIgnoreChanges = (state: StateIF, ignoreChanges: boolean) => {
  state.stateModel.ignoreChanges = ignoreChanges
}
// setHaveChanges
// commented out for now
export const mutateHaveChanges = (state: StateIF, haveChanges: boolean) => {
  state.stateModel.haveChanges = haveChanges
}
// setEntityType
export const mutateEntityType = (state: StateIF, entityType: CorpTypeCd) => {
  state.stateModel.entityType = entityType
}
// setValidateSteps
export const mutateValidateSteps = (state: StateIF, validate: boolean) => {
  state.stateModel.validateSteps = validate
}

export const mutateShowErrors = (state: StateIF, showErrors: boolean) => {
  state.stateModel.showErrors = showErrors
}
// setShowErrors
export const mutateDissolutionStatementStepData = (state: StateIF, stepData: DissolutionStatementIF) => {
  state.stateModel.dissolution.dissolutionStatementStep = stepData
}
// setFeePrices
export const mutateFeePrices = (state: StateIF, feePrices: Array<FeesIF>) => {
  state.stateModel.feePrices = feePrices
}
// setStaffPayment
export const mutateStaffPayment = (state: StateIF, staffPayment: StaffPaymentIF) => {
  state.stateModel.staffPaymentStep.staffPayment = staffPayment
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}
// setStaffPaymentValidity
export const mutateStaffPaymentValidity = (state: StateIF, validity: boolean) => {
  state.stateModel.staffPaymentStep.valid = validity
}
// setCourtOrderFileNumber
export const mutateCourtOrderFileNumber = (state: StateIF, fileNumber: string) => {
  state.stateModel.courtOrderStep.courtOrder.fileNumber = fileNumber
}
// setHasPlanOfArrangement
export const mutateHasPlanOfArrangement = (state: StateIF, hasPoa: boolean) => {
  state.stateModel.courtOrderStep.courtOrder.hasPlanOfArrangement = hasPoa
}
// setCourtOrderValidity
export const mutateCourtOrderValidity = (state: StateIF, validity: boolean) => {
  state.stateModel.courtOrderStep.valid = validity
}
// setDocumentOptionalEmail
export const mutateDocumentOptionalEmail = (state: StateIF, documentOptionalEmail: string) => {
  state.stateModel.documentDelivery.documentOptionalEmail = documentOptionalEmail
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}
// setDocumentOptionalEmailValidity
export const mutateDocumentOptionalEmailValidity = (state: StateIF, validity: boolean) => {
  state.stateModel.documentDelivery.valid = validity
}
// setHasCertificateDestroyed
export const mutateHasCertificateDestroyed = (state: StateIF, hasCertificateDestroyed: boolean) => {
  state.stateModel.dissolution.hasCertificateDestroyed = hasCertificateDestroyed
}
// setCustodianValidity
export const mutateCustodianValidity = (state: StateIF, validity: boolean) => {
  state.stateModel.dissolution.custodianOfRecords.valid = validity
}
// setCustodianOfRecords
export const mutateCustodianOfRecords = (state: StateIF, custodian: OrgPersonIF) => {
  state.stateModel.dissolution.custodianOfRecords.custodian = custodian
}

//
// Registration mutations
//
// setRegistrationDefineBusinessValid
export const mutateRegistrationDefineBusinessValid = (state: StateIF, val: boolean) => {
  state.stateModel.registration.defineBusinessValid = val
}
// setRegistrationStartDate
export const mutateRegistrationStartDate = (state: StateIF, val: string) => {
  state.stateModel.registration.startDate = val
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}
// setRegistrationBusinessAddress
export const mutateRegistrationBusinessAddress = (state: StateIF, val: BusinessAddressIF) => {
  state.stateModel.registration.businessAddress = val
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}
// setRegistrationFeeAcknowledgement
export const mutateRegistrationFeeAcknowledgement = (state: StateIF, val: boolean) => {
  state.stateModel.registration.feeAcknowledgement = val
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}
// setRegistrationNaics
export const mutateRegistrationNaics = (state: StateIF, val: NaicsIF) => {
  state.stateModel.registration.naics = val
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}
// setRegistrationBusinessNumber
export const mutateRegistrationBusinessNumber = (state: StateIF, val: string) => {
  state.stateModel.registration.businessNumber = val
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}
// setIsAutoPopulatedBusinessNumber
export const mutateIsAutoPopulatedBusinessNumber = (state: StateIF, val: boolean) => {
  state.stateModel.registration.isAutoPopulatedBusinessNumber = val
}
// setRegistrationBusinessType
export const mutateRegistrationBusinessType = (state: StateIF, businessType: BusinessTypes) => {
  state.stateModel.registration.businessType = businessType
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}
// setRegistrationBusinessTypeConfirm
export const mutateRegistrationBusinessTypeConfirm = (state: StateIF, businessTypeConfirm: boolean) => {
  state.stateModel.registration.businessTypeConfirm = businessTypeConfirm
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}
// setCompletingParty
export const mutateCompletingParty = (state: StateIF, cp: CompletingPartyIF) => {
  state.stateModel.completingParty = cp
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}
// setCompletingPartyValidity
export const mutateCompletingPartyValidity = (state: StateIF, valid: boolean) => {
  state.stateModel.completingParty.valid = valid
}
// setDissolutionDate
export const mutateDissolutionDate = (state: StateIF, val: string) => {
  state.stateModel.dissolution.dissolutionDate = val
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}
// setParties
export const mutateParties = (state: StateIF, parties: Array<PartyIF>) => {
  state.stateModel.parties = parties
}
// setAdminFreeze
export const mutateAdminFreeze = (state: StateIF, adminFreeze: boolean) => {
  state.stateModel.business.adminFreeze = adminFreeze
}
// setEntityName
export const mutateEntityName = (state: StateIF, legalName: string) => {
  state.stateModel.business.legalName = legalName
}
// setEntityState
export const mutateEntityState = (state: StateIF, entityState: EntityState) => {
  state.stateModel.business.state = entityState
}
// setBusinessNumber
export const mutateBusinessNumber = (state: StateIF, taxId: string) => {
  state.stateModel.business.taxId = taxId
}
// setIdentifier
export const mutateIdentifier = (state: StateIF, identifier: string) => {
  state.stateModel.business.identifier = identifier
}
// setLastAnnualReportDate
export const mutateLastAnnualReportDate = (state: StateIF, date: string) => {
  state.stateModel.business.lastAnnualReportDate = date
}
// setLastAddressChangeDate
export const mutateLastAddressChangeDate = (state: StateIF, date: string) => {
  state.stateModel.business.lastAddressChangeDate = date
}
// setLastDirectorChangeDate
export const mutateLastDirectorChangeDate = (state: StateIF, date: string) => {
  state.stateModel.business.lastDirectorChangeDate = date
}
// setWarnings
export const mutateBusinessWarnings = (state: StateIF, businessWarnings: Array<BusinessWarningIF>) => {
  state.stateModel.business.warnings = businessWarnings
}
// setGoodStanding
export const mutateGoodStanding = (state: StateIF, goodStanding: boolean) => {
  state.stateModel.business.goodStanding = goodStanding
}
// setWindowWidth
export const mutateWindowWidth = (state: StateIF, width: number) => {
  state.stateModel.windowWidth = width
}
// setRestorationType
export const mutateRestorationType = (state: StateIF, type: RestorationTypes) => {
  state.stateModel.restoration.type = type
}
// setRestorationExpiry
export const mutateRestorationExpiry = (state: StateIF, expiry: string) => {
  state.stateModel.restoration.expiry = expiry
}
// setRestorationRelationships
export const mutateRestorationRelationships = (state: StateIF, relationships: RelationshipTypes[]) => {
  state.stateModel.restoration.relationships = relationships
}
// setBusinessNameValid
export const mutateBusinessNameValid = (state: StateIF, valid: boolean) => {
  state.stateModel.restoration.businessNameValid = valid
}
// setRestorationTypeValid
export const mutateRestorationTypeValid = (state: StateIF, valid: boolean) => {
  state.stateModel.restoration.restorationTypeValid = valid
}
// setRestorationApprovalType
export const mutateRestorationApprovalType = (state: StateIF, type: ApprovalTypes) => {
  state.stateModel.restoration.approvalType = type
}
// setRestorationCourtOrderNumber
export const mutateRestorationCourtOrderNumber = (state: StateIF, fileNumber: string) => {
  state.stateModel.restoration.courtOrder.fileNumber = fileNumber
}
// setRestorationCourtOrderNumber
export const mutateRestorationCourtOrder = (state: StateIF, courtOrder: CourtOrderIF) => {
  state.stateModel.restoration.courtOrder = courtOrder
}
// setRestorationNoticeDate
export const mutateRestorationNoticeDate = (state: StateIF, date: string) => {
  state.stateModel.restoration.noticeDate = date
}
// setRestorationApplicationDate
export const mutateRestorationApplicationDate = (state: StateIF, date: string) => {
  state.stateModel.restoration.applicationDate = date
}
// setApprovalTypeValid
export const mutateApprovalTypeValid = (state: StateIF, valid: boolean) => {
  state.stateModel.restoration.approvalTypeValid = valid
}
