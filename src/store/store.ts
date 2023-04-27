// Pinia store
import { defineStore } from 'pinia'
import Vuetify from 'vuetify'
import { resourceModel, stateModel } from './state'
import {
  AccountTypes,
  ApprovalTypes,
  BusinessTypes,
  CoopTypes,
  DissolutionTypes,
  EntityState,
  FilingNames,
  FilingTypes,
  RelationshipTypes,
  RestorationTypes
} from '@/enums'
import { CorpTypeCd, CorrectNameOptions } from '@bcrs-shared-components/enums/'
import {
  AccountInformationIF,
  AddressIF,
  AffidavitResourceIF,
  BusinessAddressIF,
  BusinessIF,
  BusinessWarningIF,
  CertifyIF,
  CompletingPartyIF,
  ContactPointIF,
  CourtOrderIF,
  CourtOrderStepIF,
  CreateMemorandumIF,
  CreateMemorandumResourceIF,
  CreateResolutionResourceIF,
  CreateResolutionIF,
  CreateRulesIF,
  CreateRulesResourceIF,
  CompletingPartyStatementIF,
  CustodianResourceIF,
  DefineCompanyIF,
  DissolutionStatementIF,
  DissolutionStateIF,
  DocumentDeliveryIF,
  EffectiveDateTimeIF,
  FeesIF,
  FilingDataIF,
  IncorporationAgreementIF,
  IncorporationAgreementTypeIF,
  KeyValueIF,
  NaicsIF,
  NameRequestIF,
  NameTranslationIF,
  OrgInformationIF,
  OrgPersonIF,
  PartyIF,
  PeopleAndRoleIF,
  RegisteredRecordsAddressesIF,
  RegistrationStateIF,
  ResourceIF,
  RestorationStateIF,
  ShareClassIF,
  ShareStructureIF,
  StaffPaymentStepIF,
  StateIF,
  StepIF,
  TombstoneIF,
  UploadAffidavitIF,
  ValidationDetailIF
} from '@/interfaces'

// Possible to move getters / actions into seperate files:
// https://github.com/vuejs/pinia/issues/802#issuecomment-1018780409
// Not sure if I'd recommend that though.
export const useStore = defineStore('store', {
  state: (): StateIF => ({ resourceModel, stateModel }),
  getters: {
    /** True if current screen width is mobile. */
    isMobile (): boolean {
    // fall back to base window width if no window size changes have occurred
      const width = this.stateModel.windowWidth || window.innerWidth
      return (width < new Vuetify().framework.breakpoint.thresholds.sm)
    },

    /** Whether the current filing is an Incorporation. */
    isIncorporationFiling (): boolean {
      return (this.stateModel.tombstone.filingType === FilingTypes.INCORPORATION_APPLICATION)
    },

    /** Whether the current filing is a Dissolution. */
    isDissolutionFiling (): boolean {
      return (this.stateModel.tombstone.filingType === FilingTypes.DISSOLUTION)
    },

    /** Whether the current filing is a Registration. */
    isRegistrationFiling (): boolean {
      return (this.stateModel.tombstone.filingType === FilingTypes.REGISTRATION)
    },

    /** Whether the current filing is a Restoration. */
    isRestorationFiling (): boolean {
      return (this.stateModel.tombstone.filingType === FilingTypes.RESTORATION)
    },

    /** Whether the current filing is a Limited Restoration. */
    isLimitedRestorationFiling (): boolean {
      return (this.getRestoration.type === RestorationTypes.LIMITED)
    },

    /** Whether the current filing is a Full Restoration. */
    isFullRestorationFiling (): boolean {
      return (this.getRestoration.type === RestorationTypes.FULL)
    },

    /** The current filing type. */
    getFilingType (): FilingTypes {
      return this.stateModel.tombstone.filingType
    },

    /** The current filing name. */
    getFilingName (): FilingNames {
      switch (this.getFilingType) {
        case FilingTypes.INCORPORATION_APPLICATION: return FilingNames.INCORPORATION_APPLICATION
        case FilingTypes.REGISTRATION: return FilingNames.REGISTRATION
        case FilingTypes.RESTORATION: return FilingNames.RESTORATION_APPLICATION
        case FilingTypes.DISSOLUTION:
          return this.isTypeFirm ? FilingNames.DISSOLUTION_FIRM : FilingNames.VOLUNTARY_DISSOLUTION
        default: return null // should never happen
      }
    },

    /** Whether the user has "staff" auth role. */
    isRoleStaff (): boolean {
      return this.getTombstone.authRoles.includes('staff')
    },

    /** Whether the user is authorized to edit. */
    isAuthEdit (): boolean {
      return this.getTombstone.authRoles.includes('edit')
    },

    /** Whether the user is authorized to view. */
    isAuthView (): boolean {
      return this.getTombstone.authRoles.includes('view')
    },

    /** Whether the user has "gov account user" auth role. */
    isGovAccountUser (): boolean {
      return this.getTombstone.authRoles.includes('gov_account_user')
    },

    /** Whether the entity type has been identified. */
    isEntityType (): boolean {
      return !!this.getEntityType
    },

    /** The current entityType. */
    getEntityType (): CorpTypeCd {
      return this.stateModel.entityType
    },

    /** The account folio number. */
    getFolioNumber (): string {
      return this.getTombstone.folioNumber
    },

    /** The transactional folio number. */
    getTransactionalFolioNumber (): string {
      return this.getTombstone.transactionalFolioNumber
    },

    /** Is true when the transactional folio number is valid. */
    getTransactionalFolioNumberValid (): boolean {
      return this.getTombstone.transactionalFolioNumberValid
    },

    /** The staff payment folio number. */
    getStaffPaymentFolioNumber (): string {
      return this.getStaffPaymentStep.staffPayment.folioNumber
    },

    /** Whether the entity is a Benefit Company. */
    isTypeBcomp (): boolean {
      return (this.getEntityType === CorpTypeCd.BENEFIT_COMPANY)
    },

    /** Whether the entity is a Cooperative Assocation. */
    isTypeCoop (): boolean {
      return (this.getEntityType === CorpTypeCd.COOP)
    },

    /** Whether the entity is a BC Community Contribution Company. */
    isTypeBcCcc (): boolean {
      return (this.getEntityType === CorpTypeCd.BC_CCC)
    },

    /** Whether the entity is a BC Company. */
    isTypeBcCompany (): boolean {
      return (this.getEntityType === CorpTypeCd.BC_COMPANY)
    },

    /** Whether the entity is a BC ULC Company. */
    isTypeBcUlcCompany (): boolean {
      return (this.getEntityType === CorpTypeCd.BC_ULC_COMPANY)
    },

    /** Whether the entity is a Sole Proprietorship. */
    isTypeSoleProp (): boolean {
      return (this.getEntityType === CorpTypeCd.SOLE_PROP)
    },

    /** Whether the entity is a General Partnership. */
    isTypePartnership (): boolean {
      return (this.getEntityType === CorpTypeCd.PARTNERSHIP)
    },

    /** Is True if entity is a Sole Proprietorship or General Partnership. */
    isTypeFirm (): boolean {
      return (this.isTypeSoleProp || this.isTypePartnership)
    },

    /** The Account Information object. */
    getAccountInformation (): AccountInformationIF {
      return this.stateModel.accountInformation
    },

    /** Whether the entity is a base company (BEN, CC, BC, ULC). */
    isBaseCompany (): boolean {
      return (
        this.isTypeBcomp ||
        this.isTypeBcCcc ||
        this.isTypeBcCompany ||
        this.isTypeBcUlcCompany
      )
    },

    /** Whether the current account is a premium account. */
    isPremiumAccount (): boolean {
      return (this.getAccountInformation.accountType === AccountTypes.PREMIUM)
    },

    /** Whether the user is SBC Staff (which is not the same as Staff). */
    isSbcStaff (): boolean {
      return (this.getAccountInformation.accountType === AccountTypes.SBC_STAFF)
    },

    /** The Org Information object. */
    getOrgInformation (): OrgInformationIF {
      return this.stateModel.orgInformation
    },

    /** The current date, which is refreshed every time the app inits (YYYY-MM-DD). */
    getCurrentDate (): string {
      return this.stateModel.currentDate
    },

    /** The current JS Date object, which is refreshed every minute. */
    getCurrentJsDate (): Date {
      return this.stateModel.currentJsDate
    },

    /** The Filing ID. */
    getFilingId (): number {
      return this.stateModel.filingId
    },

    /** The Temporary Business Identifier. */
    getTempId (): string {
      return this.stateModel.tempId
    },

    /** The Business Identifier. */
    getBusinessId (): string {
      return this.stateModel.business.businessId
    },

    /** The Business Number (aka Tax ID). */
    getBusinessNumber (): string {
      return this.stateModel.business.taxId
    },

    getEntityIdentifier (): string {
      switch (this.getFilingType) {
        case FilingTypes.INCORPORATION_APPLICATION: return this.getTempId
        case FilingTypes.REGISTRATION: return this.getTempId
        case FilingTypes.RESTORATION: return this.getBusinessId
        case FilingTypes.DISSOLUTION: return this.getBusinessId
      }
    },

    /** The Business Legal Name. */
    getBusinessLegalName (): string {
      return this.stateModel.business.legalName
    },

    /** The Business Founding Date. */
    getBusinessFoundingDate (): string {
      return this.stateModel.business.foundingDate
    },

    /** The Business Data. */
    getBusiness (): BusinessIF {
      return this.stateModel.business
    },

    /** The Name Request object. */
    getNameRequest (): NameRequestIF {
      return this.stateModel.nameRequest
    },

    /** The Name Request approved name. */
    getNameRequestApprovedName (): string {
      return this.stateModel.nameRequestApprovedName
    },

    /** The Correct Name Option. */
    getCorrectNameOption (): CorrectNameOptions {
      return this.stateModel.correctNameOption
    },

    /** The Name Request number. */
    getNameRequestNumber (): string {
      return this.getNameRequest?.nrNum
    },

    /** The Tombstone object. */
    getTombstone (): TombstoneIF {
      return this.stateModel.tombstone
    },

    /** The Company Step object. */
    getDefineCompanyStep (): DefineCompanyIF {
      return this.stateModel.defineCompanyStep
    },

    /** The Cooperative association type. */
    getCooperativeType (): CoopTypes {
      return this.getDefineCompanyStep.cooperativeType
    },

    /** The Business Contact object. */
    getBusinessContact (): ContactPointIF {
      return this.stateModel.businessContact
    },

    /** The Memorandum object. */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getMemorandum (): any {
      return {} // FUTURE: implement this
    },

    /** The Add People and Role object. */
    getAddPeopleAndRoleStep (): PeopleAndRoleIF {
      return this.stateModel.addPeopleAndRoleStep
    },

    /** The Create Share Structure object. */
    getCreateShareStructureStep (): ShareStructureIF {
      return this.stateModel.createShareStructureStep
    },

    /** The Create Rules object. */
    getCreateRulesStep (): CreateRulesIF {
      return this.stateModel.createRulesStep
    },

    /** Is true when the step is valid. */
    isRulesValid (): boolean {
      return this.getCreateRulesStep.validationDetail.valid
    },

    /** The Incorporation Agreement object. */
    getIncorporationAgreementStep (): IncorporationAgreementIF {
      return this.stateModel.incorporationAgreementStep
    },

    /** Is true when the step is valid. */
    isMemorandumValid (): boolean {
      return this.getCreateMemorandumStep.validationDetail.valid
    },

    /** The Create Memorandum object. */
    getCreateMemorandumStep (): CreateMemorandumIF {
      return this.stateModel.createMemorandumStep
    },

    /** Is true when the step is valid. */
    isAffidavitValid (): boolean {
      if (this.isTypeCoop) {
        return this.getAffidavitStep.validationDetail.valid
      } else {
      // Just validate the confirm checkbox for Corps
        return this.getAffidavitStep.validationDetail.validationItemDetails[0]?.valid
      }
    },

    /** The upload Affidavit object. */
    getAffidavitStep (): UploadAffidavitIF {
      return this.stateModel.uploadAffidavitStep
    },

    /** Is true when the step is valid. */
    isResolutionValid (): boolean {
      return this.getCreateResolutionStep.validationDetail.valid
    },

    /** The Create Special Resolution object. */
    getCreateResolutionStep (): CreateResolutionIF {
      return this.stateModel.createResolutionStep
    },

    /** The Effective Date-Time object. */
    getEffectiveDateTime (): EffectiveDateTimeIF {
      return this.stateModel.effectiveDateTime
    },

    /** The Name Translations object array. */
    getNameTranslations (): NameTranslationIF[] {
      return this.stateModel.nameTranslations
    },

    /** The Name Translations oject validity. */
    getNameTranslationsValid (): boolean {
      return this.stateModel.nameTranslationsValid
    },

    /** Whether we are ignoring data changes. */
    ignoreChanges (): boolean {
      return this.stateModel.ignoreChanges
    },

    /** Whether there are unsaved data changes. */
    getHaveChanges (): boolean {
      return this.stateModel.haveChanges
    },

    //
    // Below is the business logic that allows the Stepper, the Actions, etc
    // to know how they should behave (ie, what to show or enable).
    //

    /** The current step. */
    getCurrentStep (): number {
      return this.stateModel.currentStep
    },

    /** Whether the app is busy saving. */
    isSaving (): boolean {
      return this.stateModel.isSaving
    },

    /** Whether the app is busy saving and resuming. */
    isSavingResuming (): boolean {
      return this.stateModel.isSavingResuming
    },

    /** Whether the app is busy filing and paying. */
    isFilingPaying (): boolean {
      return this.stateModel.isFilingPaying
    },

    /** Whether the Review and Confirm button should be displayed. */
    isShowReviewConfirmBtn (): boolean {
      return (!!this.getEntityType && this.getCurrentStep < this.getMaxStep)
    },

    /** Whether the File and Pay button should be displayed. */
    isShowFilePayBtn (): boolean {
      return (this.getCurrentStep === this.getMaxStep)
    },

    /** Whether the app is busy saving or resuming. */
    isBusySaving (): boolean {
      return (this.isSaving || this.isSavingResuming || this.isFilingPaying)
    },

    /** Is true when the step is valid. */
    isDefineCompanyValid (): boolean {
      if (this.isTypeCoop) {
        return (!!this.getCooperativeType && this.getDefineCompanyStep.valid)
      }
      return this.getDefineCompanyStep.valid
    },

    /** Is true when the step is valid. */
    isRestoreBusinessNameValid (): boolean {
      return (
        this.getBusinessNameValid &&
        this.getNameTranslationsValid &&
        this.getRestorationTypeValid &&
        this.getApprovalTypeValid
      )
    },

    /** Is true when the step is valid. */
    isAddPeopleAndRolesValid (): boolean {
      return this.getAddPeopleAndRoleStep.valid
    },

    /** Is true when the step is valid. */
    isCreateShareStructureValid (): boolean {
      return this.getCreateShareStructureStep.valid
    },

    /** Is true when the step is valid. */
    isIncorporationAgreementValid (): boolean {
      return this.getIncorporationAgreementStep.valid
    },

    /** Whether the subject filing is valid. */
    isFilingValid (): boolean {
      if (this.isIncorporationFiling) return this.isIncorporationApplicationValid
      if (this.isDissolutionFiling) return this.isDissolutionValid
      if (this.isRegistrationFiling) return this.isRegistrationValid
      if (this.isRestorationFiling) return this.isRestorationValid
      return false // should never happen
    },

    /** Whether all the dissolution steps are valid. */
    isDissolutionValid (): boolean {
      const isDocumentDeliveryValid = this.getDocumentDelivery.valid
      const isCertifyValid = this.getCertifyState.valid && !!this.getCertifyState.certifiedBy

      // only for Premium account
      const isTransactionalFnValid = !this.isPremiumAccount || this.getTransactionalFolioNumberValid

      // only for Staff role
      const isCourtOrderValid = this.isRoleStaff ? this.getCourtOrderStep.valid : true
      const isStaffPaymentValid = this.isRoleStaff ? this.getStaffPaymentStep.valid : true
      const isCompletingPartyValid = this.isRoleStaff ? this.getCompletingParty?.valid : true

      const isDissolutionDateValid = !!this.getDissolutionDate

      const isEffectiveDateTimeValid = (this.isBaseCompany)
        ? this.getEffectiveDateTime.valid
        : true

      if (this.isTypeFirm) {
        return (
          isDocumentDeliveryValid &&
            isTransactionalFnValid &&
            isCertifyValid &&
            isCourtOrderValid &&
            isStaffPaymentValid &&
            isDissolutionDateValid &&
            isCompletingPartyValid
        )
      }
      return (
        this.isDissolutionDefineDissolutionValid &&
        this.isAffidavitValid &&
        this.isResolutionValid &&
        isDocumentDeliveryValid &&
        isTransactionalFnValid &&
        isCertifyValid &&
        isEffectiveDateTimeValid &&
        isCourtOrderValid &&
        isStaffPaymentValid
      )
    },

    /** Whether all the incorporation steps are valid. */
    isIncorporationApplicationValid (): boolean {
    // Base company steps
      const isBaseStepsValid = (
        this.getCreateShareStructureStep.valid &&
        this.getEffectiveDateTime.valid &&
        this.getIncorporationAgreementStep.valid &&
        this.getCourtOrderStep.valid
      )

      // Coop steps
      const isCoopStepsValid = (
        this.getCooperativeType &&
        this.getCreateRulesStep.validationDetail.valid &&
        this.getCreateMemorandumStep.validationDetail.valid
      )

      // Validate different steps for Base Companies vs Coops
      const isDocumentValid = this.isBaseCompany ? isBaseStepsValid : isCoopStepsValid

      const isCertifyValid = this.getCertifyState.valid && !!this.getCertifyState.certifiedBy

      return (
        this.isDefineCompanyValid &&
        this.isAddPeopleAndRolesValid &&
        isDocumentValid &&
        isCertifyValid
      )
    },

    /** Whether all the registration steps are valid. */
    isRegistrationValid (): boolean {
      const isCertifyValid = this.getCertifyState.valid && !!this.getCertifyState.certifiedBy
      // const isFeeAcknowledgementValid = getRegistration.feeAcknowledgement
      const isFeeAcknowledgementValid = true // FUTURE: use line above instead
      const isStaffPaymentValid = this.isRoleStaff ? this.getStaffPaymentStep.valid : true

      return (
        this.getRegistration.defineBusinessValid &&
        this.isAddPeopleAndRolesValid &&
        isCertifyValid &&
        isFeeAcknowledgementValid &&
        isStaffPaymentValid
      )
    },

    /** Whether all the restoration steps are valid. */
    isRestorationValid (): boolean {
      const isCertifyValid = this.getCertifyState.valid && !!this.getCertifyState.certifiedBy
      const isStaffPaymentValid = this.isRoleStaff ? this.getStaffPaymentStep.valid : true

      return (
        this.isRestoreBusinessNameValid && // step 1
        this.isAddPeopleAndRolesValid && // step 2
        this.isDefineCompanyValid && // step 3
        isCertifyValid && // step 4
        isStaffPaymentValid // step 4
      )
    },

    /**
   * Is true when the user has tried to submit a filing,
   * ie, after clicking File and Pay.
   */
    getValidateSteps (): boolean {
      return this.stateModel.validateSteps
    },

    /**
   * Is true when the user should see the validation errors,
   * ie, after navigating to review page.
   */
    getShowErrors (): boolean {
      return this.stateModel.showErrors
    },

    /** The Certify State object. */
    getCertifyState (): CertifyIF {
      return this.stateModel.certifyState
    },

    /** The users's email address. */
    getUserEmail (): string {
      return (this.getTombstone.userEmail)
    },

    /** The users's phone number. */
    getUserPhone (): string {
      return this.getTombstone.userPhone
    },

    /** The user's first name. */
    getUserFirstName (): string {
      return (this.getTombstone.userFirstName)
    },

    /** The user's last name. */
    getUserLastName (): string {
      return (this.getTombstone.userLastName)
    },

    /** The user's keycloak guid. */
    getUserKeycloakGuid (): string {
      return (this.getTombstone.userKeycloakGuid)
    },

    /** The user's address. */
    getUserAddress (): AddressIF {
      return (this.getTombstone.userAddress)
    },

    /** The fee prices. */
    getFeePrices (): Array<FeesIF> {
      return this.stateModel.feePrices
    },

    /** The staff payment step. */
    getStaffPaymentStep (): StaffPaymentStepIF {
      return this.stateModel.staffPaymentStep
    },

    /** The court order step this. */
    getCourtOrderStep (): CourtOrderStepIF {
      return this.stateModel.courtOrderStep
    },

    getDocumentDelivery (): DocumentDeliveryIF {
      return this.stateModel.documentDelivery
    },

    /** The restoration object. */
    getRestoration (): RestorationStateIF {
      return this.stateModel.restoration
    },

    /** The business name validity. */
    getBusinessNameValid (): boolean {
      return this.stateModel.restoration.businessNameValid
    },

    /** The restoration type validity. */
    getRestorationTypeValid (): boolean {
      return this.stateModel.restoration.restorationTypeValid
    },

    /** The approval type validity. */
    getApprovalTypeValid (): boolean {
      return this.stateModel.restoration.approvalTypeValid
    },

    //
    // Dissolution getters
    //

    /** The dissolution object. */
    getDissolution (): DissolutionStateIF {
      return this.stateModel.dissolution
    },

    /** The dissolution statement step. */
    getDissolutionStatementStep (): DissolutionStatementIF {
      return this.getDissolution.dissolutionStatementStep
    },

    /** The dissolution type. */
    getDissolutionType (): DissolutionTypes {
      return this.getDissolution.dissolutionType
    },

    getDissolutionHasCertificateDestroyed (): boolean {
      return this.getDissolution.hasCertificateDestroyed
    },

    /** Is true when the custodian data is valid. */
    isDissolutionCustodianValid (): boolean {
      return this.getDissolution.custodianOfRecords.valid
    },

    /** The dissolution custodian of records. */
    getDissolutionCustodian (): OrgPersonIF {
      return this.getDissolution.custodianOfRecords.custodian
    },

    /** The custodian email. */
    getDissolutionCustodianEmail (): string {
      return this.getDissolutionCustodian?.officer.email
    },

    /** Is true when the Define Dissolution page is valid. */
    isDissolutionDefineDissolutionValid (): boolean {
      const isCoopDefineDissolutionValid = this.isTypeCoop
        ? (this.getDissolutionStatementStep.valid && this.getDissolutionHasCertificateDestroyed)
        : true

      return isCoopDefineDissolutionValid && this.isDissolutionCustodianValid
    },

    /** The registration object. */
    getRegistration (): RegistrationStateIF {
      return this.stateModel.registration
    },

    /** The completing party data. */
    getCompletingParty (): CompletingPartyIF {
      return this.stateModel.completingParty
    },

    /** The dissolution date. */
    getDissolutionDate (): string {
      return this.getDissolution.dissolutionDate
    },

    /** The parties list. */
    getParties (): Array<PartyIF> {
      return this.stateModel.parties
    },

    //
    // The getters below return values from the current resource
    // model -- in other words, for the currently-selected entity type.
    //

    /** The company display name. */
    getCompanyDisplayName (): string {
      return this.resourceModel.displayName
    },

    /** The People and Roles object. */
    getPeopleAndRolesResource (): any {
      return this.resourceModel.peopleAndRoles
    },

    /** The Incorporation Articles */
    getIncorporationArticlesResource (): any {
      return this.resourceModel.incorporationArticles
    },

    /** The Create Rules object. */
    getCreateRulesResource (): CreateRulesResourceIF {
      return this.resourceModel.createRules
    },

    /** The Create Memorandum object. */
    getCreateMemorandumResource (): CreateMemorandumResourceIF {
      return this.resourceModel.createMemorandum
    },

    /** The Create Resolution object. */
    getCreateResolutionResource (): CreateResolutionResourceIF {
      return this.resourceModel.createResolution
    },

    /** The completing party statement object. */
    getCompletingPartyStatement (): CompletingPartyStatementIF {
      return this.resourceModel.reviewAndConfirm.completingPartyStatement
    },

    /** The Incoporation Agreement object. */
    getIncorporationAgreementResource (): any {
      return this.resourceModel.incorporationAgreement
    },

    /** The array of steps. */
    getSteps (): Array<StepIF> {
      return this.resourceModel.steps
    },

    /** The resource filing data. */
    getFilingData (): Array<FilingDataIF> {
      if (this.isFullRestorationFiling) {
        return [this.resourceModel.filingData[0]]
      }
      if (this.isLimitedRestorationFiling) {
        return [this.resourceModel.filingData[1]]
      }
      return this.resourceModel.filingData
    },

    /** The incorporation agreement sample article. */
    getSampleArticle (): string {
      return this.getIncorporationAgreementResource.article
    },

    /** The incorporation agreement options. */
    getIncorporationAgreementDocuments (): Array<IncorporationAgreementTypeIF> {
      return this.getIncorporationAgreementResource.documents
    },

    /** The maximum number of steps. */
    getMaxStep (): number {
      const steps = this.getSteps
      return (steps ? steps.filter(step => step.step !== -1).length : -1)
    },

    /** The dissolution details title. */
    getDissolutionDetailsTitle (): string {
      return this.resourceModel.detailsTitle
    },

    /** The dissolution statement options. */
    getDissolutionStatements (): Array<KeyValueIF> {
      return this.resourceModel.dissolutionStatements
    },

    /** The dissolution custodial records resources. */
    getCustodialRecordsResources (): CustodianResourceIF {
      return this.resourceModel.custodialRecords
    },

    /** The dissolution statement options. */
    getAffidavitResources (): AffidavitResourceIF {
      return this.resourceModel.affidavit
    }
  },
  actions: {
    setBusinessId (businessId) {
      this.stateModel.business.businessId = businessId
    },
    setBusinessAddress (address) {
      this.stateModel.business.officeAddress = address
    },
    setLegalName (legalName) {
      this.stateModel.business.legalName = legalName
    },
    setFoundingDate (foundingDate) {
      this.stateModel.business.foundingDate = foundingDate
    },
    setFilingType (filingType: FilingTypes) {
      this.stateModel.tombstone.filingType = filingType
    },
    setDissolutionType (dissolutionType: DissolutionTypes) {
      this.stateModel.dissolution.dissolutionType = dissolutionType
    },
    setEntityType (entityType: CorpTypeCd) {
      this.stateModel.entityType = entityType
    },
    setResources (resources: ResourceIF) {
      this.resourceModel = resources
    },
    setTempId (tempId: string) {
      this.stateModel.tempId = tempId
    },
    setCurrentStep (currentStep: number) {
      this.stateModel.currentStep = currentStep
    },
    setIsSaving (isSaving: boolean) {
      this.stateModel.isSaving = isSaving
    },
    setIsSavingResuming (isSavingResuming: boolean) {
      this.stateModel.isSavingResuming = isSavingResuming
    },
    setIsFilingPaying (isFilingPaying: boolean) {
      this.stateModel.isFilingPaying = isFilingPaying
    },
    setAuthRoles (authRoles: Array<string>) {
      this.stateModel.tombstone.authRoles = authRoles
    },
    setUserEmail (userEmail: string) {
      this.stateModel.tombstone.userEmail = userEmail
    },
    setUserPhone (userPhone: string) {
      this.stateModel.tombstone.userPhone = userPhone
    },
    setUserFirstName (userFirstName: string) {
      this.stateModel.tombstone.userFirstName = userFirstName
    },
    setUserLastName (userLastName: string) {
      this.stateModel.tombstone.userLastName = userLastName
    },
    setUserKeycloakGuid (userKeycloakGuid: string) {
      this.stateModel.tombstone.userKeycloakGuid = userKeycloakGuid
    },
    setUserAddress (userAddress: AddressIF) {
      this.stateModel.tombstone.userAddress = userAddress
    },
    setCurrentDate (currentDate: string) {
      this.stateModel.currentDate = currentDate
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setCurrentJsDate (date: Date) {
      this.stateModel.currentJsDate = date
    },
    setIsFutureEffective (isFutureEffective: boolean) {
      this.stateModel.effectiveDateTime.isFutureEffective = isFutureEffective
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setEffectiveDate (effectiveDate: Date) {
      this.stateModel.effectiveDateTime.effectiveDate = effectiveDate
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setEffectiveDateTimeValid (effectiveDateTimeValid: boolean) {
      this.stateModel.effectiveDateTime.valid = effectiveDateTimeValid
    },
    setCertifyState (certifyState: CertifyIF) {
      this.stateModel.certifyState = certifyState
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setBusinessContact (businessContact: ContactPointIF) {
      this.stateModel.businessContact = businessContact
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setCooperativeType (cooperativeType: CoopTypes) {
      this.stateModel.defineCompanyStep.cooperativeType = cooperativeType
    },
    setDefineCompanyStepValidity (valid: boolean) {
      this.stateModel.defineCompanyStep.valid = valid
    },
    setOfficeAddresses (addresses: RegisteredRecordsAddressesIF) {
      this.stateModel.defineCompanyStep.officeAddresses = addresses
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setFolioNumber (folioNumber: string) {
      this.stateModel.tombstone.folioNumber = folioNumber
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setTransactionalFolioNumber (folioNumber: string) {
      this.stateModel.tombstone.transactionalFolioNumber = folioNumber
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setTransactionalFolioNumberValidity (valid: boolean) {
      this.stateModel.tombstone.transactionalFolioNumberValid = valid
    },
    setAccountInformation (accountInfo: AccountInformationIF) {
      this.stateModel.accountInformation = accountInfo
    },
    setOrgInformation (orgInfo: OrgInformationIF) {
      this.stateModel.orgInformation = orgInfo
    },
    setNameRequest (nameRequest: NameRequestIF) {
      this.stateModel.nameRequest = nameRequest
    },
    setNameRequestApprovedName (name: string) {
      this.stateModel.nameRequestApprovedName = name
    },
    setCorrectNameOption (option: CorrectNameOptions) {
      this.stateModel.correctNameOption = option
    },
    setNameTranslations (nameTranslations: NameTranslationIF[]) {
      this.stateModel.nameTranslations = nameTranslations
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setNameTranslationsValid (valid: boolean) {
      this.stateModel.nameTranslationsValid = valid
    },
    setFilingId (filingId: number) {
      this.stateModel.filingId = filingId
    },
    setOrgPersonList (orgPeople: OrgPersonIF[]) {
      this.stateModel.addPeopleAndRoleStep.orgPeople = orgPeople
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setAddPeopleAndRoleStepValidity (valid: boolean) {
      this.stateModel.addPeopleAndRoleStep.valid = valid
    },
    setRules (rules: CreateRulesIF) {
      this.stateModel.createRulesStep = rules
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setRulesStepValidity (validationDetail: ValidationDetailIF) {
      this.stateModel.createRulesStep.validationDetail = validationDetail
    },
    setMemorandum (memorandum: CreateMemorandumIF) {
      this.stateModel.createMemorandumStep = memorandum
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setMemorandumStepValidity (validationDetail: ValidationDetailIF) {
      this.stateModel.createMemorandumStep.validationDetail = validationDetail
    },
    setAffidavit (affidavit: UploadAffidavitIF) {
      this.stateModel.uploadAffidavitStep = affidavit
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setAffidavitStepValidity (validationDetail: ValidationDetailIF) {
      this.stateModel.uploadAffidavitStep.validationDetail = validationDetail
    },
    setResolution (resolution: CreateResolutionIF) {
      this.stateModel.createResolutionStep = resolution
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setResolutionStepValidationDetail (validationDetail: ValidationDetailIF) {
      this.stateModel.createResolutionStep.validationDetail = validationDetail
    },
    setShareClasses (shareClasses: ShareClassIF[]) {
      this.stateModel.createShareStructureStep.shareClasses = shareClasses
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setCreateShareStructureStepValidity (valid: boolean) {
      this.stateModel.createShareStructureStep.valid = valid
    },
    setIncorporationAgreementStepData (stepData: IncorporationAgreementIF) {
      this.stateModel.incorporationAgreementStep = stepData
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setIgnoreChanges (ignoreChanges: boolean) {
      this.stateModel.ignoreChanges = ignoreChanges
    },
    // setHaveChanges (haveChanges: boolean) {
    //   commit('mutateHaveChanges', haveChanges)
    // },
    setValidateSteps (validate: boolean) {
      this.stateModel.validateSteps = validate
    },
    setShowErrors (showErrors: boolean) {
      this.stateModel.showErrors = showErrors
    },
    setDissolutionStatementStepData (stepData: DissolutionStatementIF) {
      this.stateModel.dissolution.dissolutionStatementStep = stepData
    },
    setFeePrices (feePrices: Array<FeesIF>) {
      this.stateModel.feePrices = feePrices
    },
    setStaffPayment (staffPayment) {
      this.stateModel.staffPaymentStep.staffPayment = staffPayment
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setStaffPaymentValidity (validity: boolean) {
      this.stateModel.staffPaymentStep.valid = validity
    },
    setCourtOrderFileNumber (courtOrderNumber: string) {
      this.stateModel.courtOrderStep.courtOrder.fileNumber = courtOrderNumber
    },
    setHasPlanOfArrangement (hasPoa: boolean) {
      this.stateModel.courtOrderStep.courtOrder.hasPlanOfArrangement = hasPoa
    },
    setCourtOrderValidity (validity: boolean) {
      this.stateModel.courtOrderStep.valid = validity
    },
    setDocumentOptionalEmail (documentOptionalEmail: string) {
      this.stateModel.documentDelivery.documentOptionalEmail = documentOptionalEmail
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setDocumentOptionalEmailValidity (validity) {
      this.stateModel.documentDelivery.valid = validity
    },
    setHasCertificateDestroyed (hasCertificateDestroyed: boolean) {
      this.stateModel.dissolution.hasCertificateDestroyed = hasCertificateDestroyed
    },
    setCustodianValidity (validity: boolean) {
      this.stateModel.dissolution.custodianOfRecords.valid = validity
    },
    setCustodianOfRecords (custodian: OrgPersonIF) {
      this.stateModel.dissolution.custodianOfRecords.custodian = custodian
    },
    setRegistrationDefineBusinessValid (val: boolean) {
      this.stateModel.registration.defineBusinessValid = val
    },
    setRegistrationStartDate (val: string) {
      this.stateModel.registration.startDate = val
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    // need to test this a bit more
    setRegistrationBusinessAddress (val: BusinessAddressIF) {
      this.stateModel.registration.businessAddress = val
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setRegistrationFeeAcknowledgement (val: boolean) {
      this.stateModel.registration.feeAcknowledgement = val
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setRegistrationNaics (val: NaicsIF) {
      this.stateModel.registration.naics = val
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setRegistrationBusinessNumber (val: string) {
      this.stateModel.registration.businessNumber = val
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setIsAutoPopulatedBusinessNumber (val: boolean) {
      this.stateModel.registration.isAutoPopulatedBusinessNumber = val
    },
    setRegistrationBusinessType (businessType: BusinessTypes) {
      this.stateModel.registration.businessType = businessType
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setRegistrationBusinessTypeConfirm (businessTypeConfirm: boolean) {
      this.stateModel.registration.businessTypeConfirm = businessTypeConfirm
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setCompletingParty (cp: CompletingPartyIF) {
      this.stateModel.completingParty = cp
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setCompletingPartyValidity (validity: boolean) {
      this.stateModel.completingParty.valid = validity
    },
    setDissolutionDate (dissolutionDate: string) {
      this.stateModel.dissolution.dissolutionDate = dissolutionDate
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setParties (parties: Array<PartyIF>) {
      this.stateModel.parties = parties
    },
    setAdminFreeze (adminFreeze: boolean) {
      this.stateModel.business.adminFreeze = adminFreeze
    },
    setEntityName (legalName: string) {
      this.stateModel.business.legalName = legalName
    },
    setEntityState (entityState: EntityState) {
      this.stateModel.business.state = entityState
    },
    setBusinessNumber (taxId: string) {
      this.stateModel.business.taxId = taxId
    },
    setGoodStanding  (goodStanding: boolean) {
      this.stateModel.business.goodStanding = goodStanding
    },
    setIdentifier (identifier: string) {
      this.stateModel.business.identifier = identifier
    },
    setLastAnnualReportDate (date: string) {
      this.stateModel.business.lastAnnualReportDate = date
    },
    setLastAddressChangeDate (date: string) {
      this.stateModel.business.lastAddressChangeDate = date
    },
    setLastDirectorChangeDate (date: string) {
      this.stateModel.business.lastDirectorChangeDate = date
    },
    setWarnings  (businessWarnings: Array<BusinessWarningIF>) {
      this.stateModel.business.warnings = businessWarnings
    },
    setWindowWidth (width: number) {
      this.stateModel.windowWidth = width
    },
    setRestorationType (type: RestorationTypes) {
      this.stateModel.restoration.type = type
    },
    setRestorationExpiry (expiry: string) {
      this.stateModel.restoration.expiry = expiry
    },
    setRestorationRelationships (relationships: RelationshipTypes[]) {
      this.stateModel.restoration.relationships = relationships
    },
    setBusinessNameValid (valid: boolean) {
      this.stateModel.restoration.businessNameValid = valid
    },
    setRestorationTypeValid (valid: boolean) {
      this.stateModel.restoration.restorationTypeValid = valid
    },
    setRestorationApprovalType (type: ApprovalTypes) {
      this.stateModel.restoration.approvalType = type
    },
    setRestorationCourtOrderNumber (fileNumber: string) {
      this.stateModel.restoration.courtOrder.fileNumber = fileNumber
    },
    setRestorationCourtOrder (courtOrder: CourtOrderIF) {
      this.stateModel.restoration.courtOrder = courtOrder
    },
    setRestorationNoticeDate (date: string) {
      this.stateModel.restoration.noticeDate = date
    },
    setRestorationApplicationDate (date: string) {
      this.stateModel.restoration.applicationDate = date
    },
    setApprovalTypeValid (valid: boolean) {
      this.stateModel.restoration.approvalTypeValid = valid
    }
  }
})
