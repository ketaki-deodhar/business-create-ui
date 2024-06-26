import Vue from 'vue'
import { wrapperFactory } from '../vitest-wrapper-factory'
import ContinuationAuthorization from '@/components/ContinuationIn/ContinuationAuthorization.vue'
import FileUploadPreview from '@/components/common/FileUploadPreview.vue'
import { DatePicker as DatePickerShared } from '@bcrs-shared-components/date-picker'

describe('Continuation Authorization component', () => {
  it('renders the component correctly', async () => {
    const wrapper = wrapperFactory(ContinuationAuthorization)
    await Vue.nextTick()

    // verify main component exists
    expect(wrapper.findComponent(ContinuationAuthorization).exists()).toBe(true)
    expect(wrapper.find('#continuation-authorization').exists()).toBe(true)

    // spot check some content (structure / text)
    const formRows = wrapper.findAll('form > .row')
    expect(formRows.at(0).find('.col-sm-3 label').text()).toBe('Authorization Date')
    expect(formRows.at(0).find('.col-sm-9').findComponent(DatePickerShared).exists()).toBe(true)
    expect(formRows.at(1).find('.col-sm-3 label').text()).toBe('Expiry Date')
    expect(formRows.at(1).find('.col-sm-9').findComponent(DatePickerShared).exists()).toBe(true)

    expect(wrapper.find('header').exists()).toBe(true)
    expect(wrapper.find('header p').text()).toContain('Upload documents that support proof of')
    expect(wrapper.findAll('header li').at(0).text()).toContain('Use a white background')
    expect(wrapper.findAll('header li').at(1).text()).toContain('PDF file type')

    expect(wrapper.find('.upload-file-row .col-sm-3 label').text()).toBe('Upload File')
    expect(wrapper.find('.upload-file-row .col-sm-9').findComponent(FileUploadPreview).exists()).toBe(true)

    wrapper.destroy()
  })
})
