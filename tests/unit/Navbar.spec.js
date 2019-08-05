import { shallowMount } from '@vue/test-utils'
import Navbar from '@/components/layout/Navbar.vue'

describe('Navbar.vue', () => {
  it('setup correctly', () => {
    const wrapper = shallowMount(Navbar)
    expect(wrapper.isVueInstance()).toBe(true)
  })
})
