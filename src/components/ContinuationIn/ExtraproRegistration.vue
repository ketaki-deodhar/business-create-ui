<template>
  <div id="extrapro-registration">
    <GenericErrorDialog
      attach="#extrapro-registration"
      :dialog="errorDialog"
      :text="errorDialogText"
      :title="errorDialogTitle"
      :showContactInfo="false"
      @close="errorDialog = false"
    />

    <!-- inactive = ready to search to start -->
    <template v-if="!active">
      <v-row no-gutters>
        <v-col
          cols="12"
          sm="3"
        >
          <label>Extraprovincial Registration in B.C.</label>
        </v-col>

        <v-col
          cols="12"
          sm="9"
        >
          <ExtraproBusinessLookup
            class="mr-2"
            @business="setBusiness($event)"
          />
        </v-col>
      </v-row>
    </template>

    <!-- active = display/edit mode -->
    <template v-if="active">
      <!-- Extraprovincial Registration in B.C. + Undo button-->
      <v-row no-gutters>
        <v-col
          cols="12"
          sm="3"
        >
          <label>Extraprovincial Registration in B.C.</label>
        </v-col>

        <v-col
          cols="12"
          sm="7"
        >
          <v-text-field
            class="incorporation-number"
            filled
            hide-details
            label="B.C. Extraprovincial Incorporation Number"
            readonly
            :value="business.bcIdentifier"
          />
        </v-col>

        <v-col
          cols="12"
          sm="2"
        >
          <v-btn
            id="undo-button"
            class="float-sm-right float-none"
            text
            color="primary"
            @click="reset()"
          >
            <v-icon small>
              mdi-undo
            </v-icon>
            <span>Undo</span>
          </v-btn>
        </v-col>
      </v-row>

      <!-- active business -->
      <v-form
        v-if="isBusinessActive"
        ref="formRef"
        v-model="formValid"
        @submit.prevent
      >
        <!-- Home Jurisdiction -->
        <v-row
          class="mt-6"
          no-gutters
        >
          <v-col
            cols="12"
            sm="3"
          >
            <label>Home Jurisdiction</label>
          </v-col>

          <v-col
            cols="12"
            sm="9"
          >
            <Jurisdiction
              class="home-jurisdiction"
              :showUsaJurisdictions="true"
              label="Home Jurisdiction"
              :initialValue="business.homeJurisdiction"
              :errorMessages="jurisdictionErrorMessage"
              @change="onJurisdictionChange($event)"
            />
          </v-col>
        </v-row>

        <!-- Name in Home Jurisdiction -->
        <v-row
          class="mt-6"
          no-gutters
        >
          <v-col
            cols="12"
            sm="3"
          >
            <label>Name in Home Jurisdiction</label>
          </v-col>

          <v-col
            cols="12"
            sm="9"
          >
            <v-text-field
              v-model="business.homeLegalName"
              class="name-home-jurisdiction"
              filled
              hide-details="auto"
              label="Name in Home Jurisdiction"
              :rules="getShowErrors ? businessNameRules : []"
            />
          </v-col>
        </v-row>

        <!-- Date of Incorporation, Continuation or Amalgamation in Home Jurisdiction -->
        <v-row
          class="mt-6"
          no-gutters
        >
          <v-col
            cols="12"
            sm="3"
          >
            <label>Date of Incorporation, Continuation or Amalgamation in Home Jurisdiction</label>
          </v-col>

          <v-col
            cols="12"
            sm="9"
          >
            <DatePickerShared
              id="incorporation-date"
              ref="incorporationDateRef"
              title="Date of Incorporation, Continuation or Amalgamation in Home Jurisdiction"
              :nudgeRight="40"
              :nudgeTop="85"
              :persistentHint="true"
              :initialValue="business.homeIncorporationDate"
              :inputRules="getShowErrors ? incorporationDateRules: []"
              :maxDate="getCurrentDate"
              @emitDateSync="$set(business, 'homeIncorporationDate', $event)"
            />
          </v-col>
        </v-row>

        <!-- Business Number -->
        <v-row
          class="mt-6"
          no-gutters
        >
          <v-col
            cols="12"
            sm="3"
          >
            <label>Business Number</label>
          </v-col>

          <v-col
            cols="12"
            sm="9"
          >
            <v-text-field
              v-model="business.taxId"
              v-mask="['#########']"
              class="business-number"
              filled
              hide-details="auto"
              label="Business Number (Optional)"
              hint="First 9 digits of the CRA Business Number if you have one"
              :rules="getShowErrors ? Rules.BusinessNumberRules : []"
            />
          </v-col>
        </v-row>

        <v-expand-transition>
          <!-- Upload Affidavit -->
          <v-row
            v-if="isContinuationInAffidavitRequired"
            class="mt-6"
            no-gutters
          >
            <v-col
              cols="12"
              sm="3"
            >
              <label>Upload Affidavit</label>
            </v-col>

            <v-col
              cols="12"
              sm="9"
            >
              <p>
                Upload the affidavit from the directors.
              </p>

              <ul>
                <li>Use a white background and a legible font with contrasting font colour</li>
                <li>PDF file type (maximum 30 MB file size)</li>
              </ul>

              <FileUploadPreview
                class="mt-4"
                inputFileLabel="Affidavit from directors"
                :maxSize="MAX_FILE_SIZE"
                :pdfPageSize="PdfPageSize.LETTER_SIZE"
                :hint="business.affidavitFile ? 'File uploaded' : undefined"
                :inputFile="business.affidavitFile"
                :showErrors="getShowErrors"
                :customErrorMessage.sync="customErrorMessage"
                :isRequired="getShowErrors"
                @fileValidity="onFileValidity($event)"
                @fileSelected="onFileSelected($event)"
              />
            </v-col>
          </v-row>
        </v-expand-transition>

        <!-- message box -->
        <v-row
          class="mt-6"
          no-gutters
        >
          <v-col
            cols="12"
            sm="3"
          >
            <!-- empty column -->
          </v-col>

          <v-col
            cols="12"
            sm="9"
          >
            <MessageBox color="gold">
              <strong>Important:</strong> Verify that this information matches exactly the current information
              in the home jurisdiction.
            </MessageBox>
          </v-col>
        </v-row>

        <!-- Confirmation -->
        <v-row
          class="mt-6"
          no-gutters
        >
          <v-col
            cols="12"
            sm="3"
          >
            <label>Confirmation</label>
          </v-col>

          <v-col
            cols="12"
            sm="9"
          >
            <v-checkbox
              v-model="business.isConfirmed"
              class="confirmation pt-0 mt-0"
              hide-details
              :label="checkboxLabel"
              :rules="getShowErrors ? [(v) => !!v] : []"
            />
          </v-col>
        </v-row>
      </v-form>

      <!-- historical business -->
      <template v-if="!isBusinessActive">
        <!-- Home Jurisdiction, Name in B.C., Date of Registration in B.C. -->
        <v-row
          class="mt-6"
          no-gutters
        >
          <v-col
            cols="12"
            sm="3"
          >
            <!-- empty column -->
          </v-col>

          <v-col
            cols="12"
            sm="9"
          >
            <div class="home-jurisdiction font-15">
              <label>Home Jurisdiction:</label>
              {{ homeJurisdictionText || '[Unknown]' }}
            </div>
            <div class="name-in-bc font-15 mt-2">
              <label>Name in B.C.:</label>
              {{ business.bcLegalName }}
            </div>
            <div class="date-registration-bc font-15 mt-2">
              <label>Date of Registration in B.C.:</label>
              {{ yyyyMmDdToPacificDate(business.bcFoundingDate, true, false) || '[Unknown]' }}
            </div>
          </v-col>
        </v-row>

        <v-divider class="mx-6 mt-6" />

        <!-- Business Information in Home Jurisdiction -->
        <v-row
          class="mt-6"
          no-gutters
        >
          <v-col
            cols="12"
            sm="3"
          >
            <label>Business Information in Home Jurisdiction</label>
          </v-col>

          <v-col
            cols="12"
            sm="9"
          >
            <div class="business-name font-15">
              <label>Business Name:</label>
              {{ business.homeLegalName || '[Unknown]' }}
            </div>
            <div class="registration-number font-15 mt-2">
              <label>Registration Number:</label>
              {{ business.homeIdentifier || '[Unknown]' }}
            </div>
            <div class="business-number font-15 mt-2">
              <label>Business Number:</label>
              {{ business.taxId || '[Unknown]' }}
            </div>
            <div class="incorporation-date font-15 mt-2">
              <label>Date of Incorporation, Continuation or Amalgamation in Home Jurisdiction:</label>
              {{ yyyyMmDdToPacificDate(business.homeIncorporationDate, true, false) || '[Unknown]' }}
            </div>
          </v-col>
        </v-row>

        <v-divider class="mx-6 mt-6" />

        <!-- message box -->
        <v-row
          class="mt-6"
          no-gutters
        >
          <v-col
            cols="12"
            sm="3"
          >
            <!-- empty column -->
          </v-col>

          <v-col
            cols="12"
            sm="9"
          >
            <MessageBox color="red">
              <strong>Important:</strong> This extraprovincial registration is historical. Please contact
              BC Registries staff.
            </MessageBox>

            <RegistriesContactInfo class="mt-6" />
          </v-col>
        </v-row>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { StatusCodes } from 'http-status-codes'
import { mask } from 'vue-the-mask'
import { useStore } from '@/store/store'
import { DateMixin, DocumentMixin } from '@/mixins'
import { BusinessLookupResultIF, ColinBusinessIF, ExistingBusinessInfoIF, FormIF, PresignedUrlIF } from '@/interfaces'
import { PdfPageSize } from '@/enums'
import { EntityStates, JurisdictionLocation } from '@bcrs-shared-components/enums'
import { ColinServices } from '@/services'
import { VuetifyRuleFunction } from '@/types'
import { CanJurisdictions, IntlJurisdictions, UsaJurisdiction } from '@bcrs-shared-components/jurisdiction/list-data'
import { Jurisdiction } from '@bcrs-shared-components/jurisdiction'
import { GenericErrorDialog } from '@/dialogs/'
import { Rules } from '@/rules'
import ExtraproBusinessLookup from './ExtraproBusinessLookup.vue'
import MessageBox from '@/components/common/MessageBox.vue'
import RegistriesContactInfo from '@/components/common/RegistriesContactInfo.vue'
import FileUploadPreview from '@/components/common/FileUploadPreview.vue'
import { DatePicker as DatePickerShared } from '@bcrs-shared-components/date-picker'

@Component({
  components: {
    DatePickerShared,
    ExtraproBusinessLookup,
    FileUploadPreview,
    GenericErrorDialog,
    Jurisdiction,
    MessageBox,
    RegistriesContactInfo
  },
  directives: {
    mask
  }
})
export default class ExtraproRegistration extends Mixins(DateMixin, DocumentMixin) {
  // Refs
  $refs!: {
    formRef: FormIF,
    incorporationDateRef: DatePickerShared
  }

  readonly PdfPageSize = PdfPageSize
  readonly Rules = Rules

  @Getter(useStore) getCurrentDate!: string
  @Getter(useStore) getExistingBusinessInfo!: ExistingBusinessInfoIF
  @Getter(useStore) getKeycloakGuid!: string
  @Getter(useStore) getShowErrors!: boolean
  @Getter(useStore) isContinuationInAffidavitRequired!: boolean

  @Action(useStore) setExistingBusinessInfo!: (x: ExistingBusinessInfoIF) => void

  // Local properties
  active = false
  business = {} as ExistingBusinessInfoIF
  formValid = false
  customErrorMessage = ''
  uploadMemorandumDoc = null as File
  uploadMemorandumDocKey = null as string
  fileValidity = false
  errorDialog = false
  errorDialogText = ''
  errorDialogTitle = ''

  readonly checkboxLabel = 'I understand and acknowledge that the extraprovincial registration of' +
    ' this business will be cancelled and made historical in the B.C. Registry once the continuation' +
    ' application application has been submitted.'

  /** Whether the business is active (otherwise it's historical). */
  get isBusinessActive (): boolean {
    return (this.business.status === EntityStates.ACTIVE)
  }

  readonly businessNameRules: Array<VuetifyRuleFunction> = [
    (v) => !!v || 'Name is required',
    (v) => (v && v.length <= 1000) || 'Cannot exceed 1000 characters'
  ]

  readonly incorporationDateRules: Array<VuetifyRuleFunction> = [
    (v) => !!v || 'Incorporation Date is required'
  ]

  get jurisdictionErrorMessage (): string {
    return (this.getShowErrors && !this.business.homeJurisdiction) ? 'Jurisdiction is required' : ''
  }

  /** The text version of the home jurisdiction. */
  get homeJurisdictionText (): string {
    const jurisdiction = this.business.homeJurisdiction // may be null

    if (jurisdiction?.country === JurisdictionLocation.CA) {
      if (jurisdiction?.region === 'FEDERAL') return 'Federal'
      return CanJurisdictions.find(can => can.value === jurisdiction?.region)?.text || 'Canada'
    }

    if (jurisdiction?.country === JurisdictionLocation.US) {
      const state = UsaJurisdiction.find(usa => usa.value === jurisdiction?.region)?.text
      return (state ? `${state}, US` : 'USA')
    }

    return IntlJurisdictions.find(intl => intl.value === jurisdiction?.country)?.text || null
  }

  /** Called when this component is mounted. */
  mounted (): void {
    // point business variable to Existing Business Info object from the store, if it exists
    if (this.getExistingBusinessInfo) this.business = this.getExistingBusinessInfo

    // if mode is EXPRO, set this component to active (which hides the other component)
    if (this.business.mode === 'EXPRO') this.active = true
  }

  /** Called when user has searched for and selected a business. */
  async setBusiness (result: BusinessLookupResultIF): Promise<void> {
    // fetch expro business data from COLIN and add to business object
    const businessInfo = await ColinServices.fetchPublicBusiness(result.identifier)
      .catch(() => (null as ColinBusinessIF))
    if (!businessInfo) {
      this.errorDialogTitle = 'Could not fetch business data'
      this.errorDialogText = 'An error occurred. Please try searching for the business again.'
      this.errorDialog = true

      // toggle active flag to re-render the ExtraproBusinessLookup component (and thus reset it)
      this.active = true
      await this.$nextTick()
      this.active = false

      return
    }

    this.business = {
      bcFoundingDate: this.dateToYyyyMmDd(this.apiToDate(businessInfo.foundingDate)),
      bcIdentifier: businessInfo.identifier,
      bcLegalName: businessInfo.legalName,
      homeJurisdiction: this.getHomeJurisdiction(businessInfo.jurisdiction || ''),
      homeIdentifier: businessInfo.homeJurisdictionNumber,
      homeIncorporationDate: this.dateToYyyyMmDd(this.apiToDate(businessInfo.homeRecognitionDate)),
      homeLegalName: businessInfo.homeCompanyName,
      mode: 'EXPRO',
      status: result.status,
      taxId: businessInfo.businessNumber?.substring(0, 9) || null
    }
    this.setExistingBusinessInfo(this.business)
    this.active = true
  }

  /** Returns jurisdiction object for the given COLIN jurisdiction string. */
  private getHomeJurisdiction (jurisdiction: string): any {
    // safety check
    if (jurisdiction) {
      const provinces = CanJurisdictions.map(j => j.value).filter(p => p !== JurisdictionLocation.FD)
      const states = UsaJurisdiction.map(j => j.value)
      const countries = IntlJurisdictions.map(j => j.value)
        .filter(c => (c !== JurisdictionLocation.CA && c !== JurisdictionLocation.US))

      // look for BC, AB, etc
      if (provinces.includes(jurisdiction)) {
        return { country: JurisdictionLocation.CA, region: jurisdiction }
      }
      // look for FD
      if (jurisdiction === JurisdictionLocation.FD) {
        return { country: JurisdictionLocation.CA, region: 'FEDERAL' }
      }
      // look for "US, <state>"
      if (
        jurisdiction.startsWith(JurisdictionLocation.US) &&
        states.includes(jurisdiction.substring(3))
      ) {
        return { country: JurisdictionLocation.US, region: jurisdiction }
      }
      // look for known countries
      if (countries.includes(jurisdiction)) {
        return { country: jurisdiction }
      }
    }
    return null
  }

  /** Resets this component back to its initial state. */
  reset () {
    this.business = {} as ExistingBusinessInfoIF
    this.setExistingBusinessInfo(this.business)
    // set this component to inactive (which shows the other component)
    this.active = false
  }

  /** Called when user has selected a jurisdiction. */
  onJurisdictionChange (jurisdiction: any): void {
    this.business.homeJurisdiction = null

    if (jurisdiction?.group === 0) {
      // set property reactively (in case it was null)
      this.$set(this.business, 'homeJurisdiction', {
        country: JurisdictionLocation.CA,
        region: (jurisdiction.value === JurisdictionLocation.FD) ? 'FEDERAL' : jurisdiction.value
      })
    }

    if (jurisdiction?.group === 1) {
      // set property reactively (in case it was null)
      this.$set(this.business, 'homeJurisdiction', {
        country: JurisdictionLocation.US,
        region: jurisdiction.value
      })
    }

    if (jurisdiction?.group === 2) {
      // set property reactively (in case it was null)
      this.$set(this.business, 'homeJurisdiction', {
        country: jurisdiction.value,
        region: ''
      })
    }
  }

  /**
   * Called when FileUploadPreview tells us whether a file is valid.
   * This is called right before the File Selected event.
   */
  onFileValidity (valid: boolean): void {
    this.fileValidity = valid
  }

  /**
   * Called when FileUploadPreview tells us about a new or cleared file.
   * This is called right after the File Validity event.
   */
  async onFileSelected (file: File): Promise<void> {
    if (file) {
      if (this.fileValidity) {
        // try to upload to Minio
        let psu: PresignedUrlIF
        try {
          psu = await this.getPresignedUrl(file.name)
          const res = await this.uploadToUrl(psu.preSignedUrl, file, psu.key, this.getKeycloakGuid)
          if (!res || res.status !== StatusCodes.OK) throw new Error()
        } catch {
          // put file uploader into manual error mode by setting custom error message
          this.customErrorMessage = this.UPLOAD_FAILED_MESSAGE
          this.$forceUpdate() // force file upload component to react
          return // don't add to list
        }

        // add properties reactively to business object
        this.$set(this.business, 'affidavitFile', {
          name: file.name,
          lastModified: file.lastModified,
          size: file.size
        } as File)
        this.$set(this.business, 'affidavitFileKey', psu.key)
        this.$set(this.business, 'affidavitFileName', file.name)
        this.$set(this.business, 'affidavitFileUrl', psu.preSignedUrl)
      }
    } else {
      // delete properties reactively when the file is cleared
      this.$delete(this.business, 'affidavitFile')
      this.$delete(this.business, 'affidavitFileKey')
      this.$delete(this.business, 'affidavitFileName')
      this.$delete(this.business, 'affidavitFileUrl')
      // FUTURE: should also delete the file from Minio
    }
  }

  /** Validates the form and other components. */
  @Watch('active')
  @Watch('getShowErrors')
  private async onGetShowErrors (): Promise<void> {
    if (this.active && this.getShowErrors) {
      await this.$nextTick() // wait for form to finish rendering
      this.$refs.formRef?.validate()
      this.$refs.incorporationDateRef?.validateForm()
    }
  }

  /** Emits form validity. */
  @Watch('isBusinessActive')
  @Watch('business.homeJurisdiction')
  @Watch('business.homeIncorporationDate')
  @Watch('isContinuationInAffidavitRequired')
  @Watch('business.affidavitFileKey')
  @Watch('formValid')
  @Emit('valid')
  private onComponentValid (): boolean {
    // this component is valid if we have an active business
    // and we have the home jurisdiction (custom component)
    // and we have the home incorporation date (custom component)
    // and we have the affidavit file, if required (custom component)
    // and the other form (Vuetify) components are valid
    return (
      this.isBusinessActive &&
      !!this.business.homeJurisdiction &&
      !!this.business.homeIncorporationDate &&
      (!this.isContinuationInAffidavitRequired || !!this.business.affidavitFileKey) &&
      this.formValid
    )
  }

  /** Informs parent component whether we have become active or inactive. */
  @Watch('active', { immediate: true })
  @Emit('active')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private onActiveChanged (val: boolean): void {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

// set style for all root labels
label {
  font-weight: bold;
  color: $gray9;
}

// add whitespace between the first and second columns
.col-sm-3 {
  padding-right: 1rem !important;
}

// disable the clickable v-textfield label
:deep(.incorporation-number label) {
  pointer-events: none;
}

// align the checkbox with its label
:deep(.v-input--checkbox .v-input__slot) {
  align-items: flex-start;
}

// style the checkbox label
:deep(.v-input--checkbox label) {
  margin-top: 1px;
  font-size: $px-14;
  color: $gray9;
}

ul {
  list-style: none;
  color: $gray7;

  li::before {
    content: "\2022";
    display: inline-block;
    width: 1.25em;
    margin-left: -1.5em;
    padding-left: 0.25rem;
  }
}
</style>
