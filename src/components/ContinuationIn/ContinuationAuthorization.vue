<template>
  <!--
    Don't render this component until authorization object is initialized, so that we mount
    FileUploadPreview with existing files, because its "inputFile" prop is not reactive.
  -->
  <div
    v-if="authorization"
    id="continuation-authorization"
  >
    <v-form
      ref="formRef"
      lazy-validation
      @submit.prevent
    >
      <!-- Authorization Date -->
      <v-row no-gutters>
        <v-col
          cols="12"
          sm="3"
        >
          <label>Authorization Date</label>
        </v-col>

        <v-col
          cols="12"
          sm="9"
          class="pl-8"
        >
          <DatePickerShared
            id="authorization-date"
            ref="authorizationDateRef"
            title="Authorization Date"
            :nudgeRight="40"
            :nudgeTop="85"
            hint="The date the authorization was issued"
            :persistentHint="true"
            :initialValue="authorization.date"
            :inputRules="getShowErrors ? authorizationDateRules : []"
            :minDate="minAuthorizationDate"
            :maxDate="getCurrentDate"
            @emitDateSync="authorization.date = $event"
          />
        </v-col>
      </v-row>
    </v-form>

    <v-divider class="mt-4 mb-8" />

    <MessageBox
      v-if="isShowMessageBox"
      color="red"
    >
      <v-icon color="error">
        mdi-alert
      </v-icon>

      <label
        class="font-16"
        for="textarea-message"
      >
        Change Requested:
      </label>

      <textarea
        id="textarea-message"
        v-auto-resize
        class="font-16 font-italic ml-8"
        readonly
        rows="1"
        :value="latestReviewComment"
      />
    </MessageBox>

    <header
      :class="{ 'mt-6': isShowMessageBox }"
    >
      <p>
        Upload documents that support proof of authorization from your home jursidiction.
      </p>

      <ul>
        <li>
          Use a white background and a legible font with contrasting font colour
        </li>
        <li>
          PDF file type (maximum 30 MB file size)
        </li>
      </ul>
    </header>

    <div class="pt-4" />

    <!-- file upload components -->
    <v-row
      v-for="(num, index) in numUploads"
      :key="authorization.files[index]?.fileKey"
      class="upload-file-row mt-4 mb-n2"
      no-gutters
    >
      <v-col
        cols="12"
        sm="3"
      >
        <label v-if="index === 0">Upload File (Maximum 5)</label>
      </v-col>

      <v-col
        cols="12"
        sm="9"
      >
        <FileUploadPreview
          inputFileLabel="Continuation authorization"
          :maxSize="MAX_FILE_SIZE"
          :pdfPageSize="PdfPageSize.LETTER_SIZE"
          :hint="authorization.files[index]?.file ? 'File uploaded' : undefined"
          :inputFile="authorization.files[index]?.file"
          :showErrors="getShowErrors"
          :customErrorMessage.sync="customErrorMessage[index]"
          :isRequired="getShowErrors && (index === 0)"
          @fileValidity="onFileValidity($event)"
          @fileSelected="onFileSelected(index, $event)"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { StatusCodes } from 'http-status-codes'
import { useStore } from '@/store/store'
import { DocumentMixin } from '@/mixins'
import { ContinuationAuthorizationIF, ExistingBusinessInfoIF, FormIF, PresignedUrlIF } from '@/interfaces'
import { FilingStatus, PdfPageSize } from '@/enums'
import { VuetifyRuleFunction } from '@/types'
import FileUploadPreview from '@/components/common/FileUploadPreview.vue'
import { DatePicker as DatePickerShared } from '@bcrs-shared-components/date-picker'
import AutoResize from 'vue-auto-resize'
import MessageBox from '@/components/common/MessageBox.vue'

@Component({
  components: {
    DatePickerShared,
    FileUploadPreview,
    MessageBox
  },
  directives: {
    AutoResize
  }
})
export default class ExtraproRegistration extends Mixins(DocumentMixin) {
  // Refs
  $refs!: {
    authorizationDateRef: DatePickerShared,
    formRef: FormIF
  }

  readonly PdfPageSize = PdfPageSize

  @Getter(useStore) getContinuationAuthorization!: ContinuationAuthorizationIF
  @Getter(useStore) getCurrentDate!: string
  @Getter(useStore) getExistingBusinessInfo!: ExistingBusinessInfoIF
  @Getter(useStore) getFilingStatus!: FilingStatus
  @Getter(useStore) getKeycloakGuid!: string
  @Getter(useStore) getShowErrors!: boolean

  @Action(useStore) setContinuationAuthorization!: (x: ContinuationAuthorizationIF) => void

  // Local properties
  authorization = null as ContinuationAuthorizationIF
  authorizationDateValid = false
  fileValidity = false
  customErrorMessage = ['', '', '', '', ''] // max 5 files

  /**
   * The minimum date for the Authorization Date:
   * - the BC Founding Date (if it exists, ie, expro business)
   * - else the Home Jurisdiction Incorporation Date (ie, manual entry)
   * - else fall back to null (not undefined)
   */
  get minAuthorizationDate (): string {
    return (
      this.getExistingBusinessInfo.bcFoundingDate ||
      this.getExistingBusinessInfo.homeIncorporationDate ||
      null
    )
  }

  get authorizationDateRules (): Array<VuetifyRuleFunction> {
    const bcFoundingDate = this.getExistingBusinessInfo.bcFoundingDate
    const homeIncorporationDate = this.getExistingBusinessInfo.homeIncorporationDate

    return [
      (v) => !!v || 'Authorization Date is required',
      () => (this.authorization.date <= this.getCurrentDate) || 'Authorization Date cannot be in the future',
      () => (!bcFoundingDate || (this.authorization.date >= bcFoundingDate)) ||
        'Authorization Date cannot be before Date of Registration in B.C.',
      () => (!homeIncorporationDate || (this.authorization.date >= homeIncorporationDate)) ||
        'Authorization Date cannot be before Date of Incorporation in Home Jurisdiction'
    ]
  }

  /** The latest review comment. Only used when filing is in Change Requested status. */
  get latestReviewComment (): string {
    return this.getExistingBusinessInfo.latestReviewComment
  }

  get isShowMessageBox (): boolean {
    return (
      (this.getFilingStatus === FilingStatus.CHANGE_REQUESTED) &&
      !!this.latestReviewComment
    )
  }

  /** The number of file upload components to display (max 5). */
  get numUploads (): number {
    return Math.min((this.authorization.files.length + 1), 5)
  }

  /** Called when this component is mounted. */
  mounted (): void {
    this.authorization = this.getContinuationAuthorization ||
      { files: [], date: null } as ContinuationAuthorizationIF
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
  async onFileSelected (index: number, file: File): Promise<void> {
    if (file) {
      // verify that file is valid
      if (!this.fileValidity) {
        // NB: as this is validity according to the component, do not overwrite current error message
        return // don't add to array and don't change existing file
      }

      // verify that file doesn't already exist
      if (this.authorization.files.find(f => f.file.name === file.name)) {
        // put file uploader into manual error mode by setting custom error message
        this.customErrorMessage[index] = 'Duplicate file'
        this.$forceUpdate() // force file upload component to react
        return // don't add to list
      }

      // try to upload to Minio
      let psu: PresignedUrlIF
      try {
        psu = await this.getPresignedUrl(file.name)
        const res = await this.uploadToUrl(psu.preSignedUrl, file, psu.key, this.getKeycloakGuid)
        if (!res || res.status !== StatusCodes.OK) throw new Error()
      } catch {
        // put file uploader into manual error mode by setting custom error message
        this.customErrorMessage[index] = this.UPLOAD_FAILED_MESSAGE
        this.$forceUpdate() // force file upload component to react
        return // don't add to array
      }

      // add file to array
      this.authorization.files.push({
        file: {
          name: file.name,
          lastModified: file.lastModified,
          size: file.size
        } as File,
        fileKey: psu.key,
        fileName: file.name
      })
    } else {
      // delete file from Minio; ignore errors
      await this.deleteDocument(this.authorization.files[index].fileKey).catch(() => null)
      // remove file from array
      this.authorization.files.splice(index, 1)
    }
  }

  @Watch('getShowErrors')
  @Watch('minAuthorizationDate') // because Authorization Date depends on this
  @Watch('authorization.date') // in case this changes
  private async onGetShowErrors (): Promise<void> {
    if (this.getShowErrors) {
      // wait for form to finish rendering
      await this.$nextTick()
      // validate the form and our custom component that doesn't support form validation
      this.$refs.formRef.validate()
      this.authorizationDateValid = this.$refs.authorizationDateRef.validateForm()
    }
  }

  @Watch('authorization', { deep: true })
  @Watch('authorizationDateValid') // re-validate when the Authorization Date validity changes
  @Emit('valid')
  private onComponentValid (): boolean {
    // sync local object to the store
    this.setContinuationAuthorization(this.authorization)

    // this component is valid if we have the valid authorization date
    // and at least one file uploaded
    return (
      this.authorizationDateValid &&
      (this.authorization.files.length >= 1)
    )
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

header {
  p, li {
    color: $gray7;
  }
}

// set style for all labels
label {
  font-weight: bold;
  color: $gray9;
}

// add whitespace between the first and second columns
.col-sm-3 {
  padding-right: 1rem !important;
}

#authorization-date {
  // show pointer on hover
  :deep(.v-input__slot) {
    pointer-events: auto;
    cursor: pointer;
  }

  // set icon color
  :deep(.v-input__icon--append .v-icon) {
    color: $app-blue !important;
  }
}

textarea {
  color: $gray7;
  width: 100%;
  resize: none;
  // FUTURE: use field-sizing instead of "v-auto-resize" directive
  // ref: https://developer.mozilla.org/en-US/docs/Web/CSS/field-sizing
  // field-sizing: content;
}

// align the checkbox with its label
:deep(.v-input--checkbox .v-input__slot) {
  align-items: flex-start;
}

// style the checkbox label
:deep(.v-input--checkbox label) {
  margin-top: 2px;
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
