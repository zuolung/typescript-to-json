const p = require('./src/index')

console.info(
  p(`
  import { ComponentClass } from 'react'
  import { PickerProps, IPickerInstance } from './picker'

  type IAnyObjectString = {
    [x: number | string]: string
  }

  /**
   * @desc API
   */
  export interface AreaProps
    extends Omit<PickerProps, 'columns' | 'onChange'>,
      ComponentClass {
    /**
     * @default
     * @desc    value of address
     */
    value?: string
    areaList?: {
      province_list: IAnyObjectString
      city_list: IAnyObjectString
      county_list: IAnyObjectString
    }
    /**
     * @desc count of columns
     */
    columnsNum?: string | number
    /**
     * @desc placeholder of columns
     */
    columnsPlaceholder?: string[]
    /**
     * @desc trigger function
     */
    onChange: (event: {
      detail: {
        values: number[] | string[]
        picker: IPickerInstance
        index: number
      }
    }) => void
  }
  declare const Area: ComponentClass<AreaProps>

  export { Area }
  
  `)
)